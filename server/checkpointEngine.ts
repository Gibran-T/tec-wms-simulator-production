/**
 * Phase 1 — Unified checkpoint progression engine (M2–M5).
 * Certification (Silver/Gold) remains in db.ts / goldCertification.ts.
 */

import { and, asc, desc, eq } from "drizzle-orm";
import { getModuleScenarioPassThreshold } from "@shared/moduleThresholds";
import { scenarioRuns, scenarios } from "../drizzle/schema";
import {
  OFFICIAL_SCN_BY_MODULE,
  scenarioIdsForScn,
  type OfficialScnCode,
} from "./canonicalScenarios";
import { getDb, getBestScoringNonDemoCompletedRunForScn, getModuleProgressRow, upsertModuleCheckpointSnapshot } from "./db";
import { goldScnKeyFromCode } from "./goldCertification";
import { calculateTotalScore } from "./scoringEngine";

export const CHECKPOINT_MODULE_IDS = [1, 2, 3, 4, 5] as const;
export const CHECKPOINT_ENGINE_VERSION = "ckpt-v1";

export type CheckpointModuleId = (typeof CHECKPOINT_MODULE_IDS)[number];

export type ScnCheckpointStatus = {
  passed: boolean;
  score: number | null;
  runId: number | null;
};

export type ModuleCheckpointSnapshot = {
  moduleId: number;
  requiredScenarios: number;
  completedScenarios: number;
  progressPct: number;
  scenarioStatus: Record<string, ScnCheckpointStatus>;
  bestScore: number;
  averageScore: number | null;
  passed: boolean;
  completedAt: Date | null;
  teacherValidated: boolean;
};

export function isCheckpointEngineEnabled(): boolean {
  return process.env.CHECKPOINT_ENGINE_ENABLED !== "false";
}

export function isCheckpointModule(moduleId: number): moduleId is CheckpointModuleId {
  return (CHECKPOINT_MODULE_IDS as readonly number[]).includes(moduleId);
}

export function scnKeysForModule(moduleId: number): string[] {
  const codes = OFFICIAL_SCN_BY_MODULE[moduleId] ?? [];
  return codes.map((scn) => goldScnKeyFromCode(scn));
}

export function computeProgressPct(
  moduleId: number,
  completedScenarios: number,
  requiredScenarios: number,
  teacherValidated: boolean,
): number {
  if (requiredScenarios === 0) return 0;
  if (moduleId === 3) {
    return Math.round(
      ((completedScenarios + (teacherValidated ? 1 : 0)) / (requiredScenarios + 1)) * 100,
    );
  }
  return Math.round((completedScenarios / requiredScenarios) * 100);
}

export function computeCheckpointPassed(
  moduleId: number,
  completedScenarios: number,
  requiredScenarios: number,
  allScnsPass: boolean,
  teacherValidated: boolean,
): boolean {
  return (
    completedScenarios === requiredScenarios &&
    requiredScenarios > 0 &&
    allScnsPass &&
    (moduleId !== 3 || teacherValidated)
  );
}

export function isModuleCheckpointPassed(snapshot: ModuleCheckpointSnapshot): boolean {
  return snapshot.passed;
}

/** All official module SCNs at threshold — prerequisite for M3 teacher validation (before passed flips). */
export function isModuleReadyForTeacherValidation(snapshot: ModuleCheckpointSnapshot): boolean {
  if (snapshot.moduleId !== 3) return false;
  const keys = scnKeysForModule(snapshot.moduleId);
  const allScnsPass = keys.every((key) => snapshot.scenarioStatus[key]?.passed === true);
  return (
    snapshot.requiredScenarios > 0 &&
    snapshot.completedScenarios === snapshot.requiredScenarios &&
    allScnsPass
  );
}

/** Pure snapshot builder — used by tests and async recompute path. */
export function buildModuleCheckpointSnapshot(
  moduleId: number,
  scenarioStatus: Record<string, ScnCheckpointStatus>,
  scnKeys: string[],
  teacherValidated: boolean,
  existingCompletedAt?: Date | null,
): ModuleCheckpointSnapshot {
  const requiredScenarios = scnKeys.length;
  const scoresWithRuns = scnKeys
    .map((key) => scenarioStatus[key]?.score)
    .filter((score): score is number => score !== null && score !== undefined);

  const completedScenarios = scnKeys.filter((key) => scenarioStatus[key]?.passed === true).length;
  const allScnsPass = scnKeys.every((key) => scenarioStatus[key]?.passed === true);

  const bestScore = scoresWithRuns.length > 0 ? Math.max(...scoresWithRuns) : 0;
  const averageScore =
    scoresWithRuns.length > 0
      ? Math.round(scoresWithRuns.reduce((sum, score) => sum + score, 0) / scoresWithRuns.length)
      : null;

  const passed = computeCheckpointPassed(
    moduleId,
    completedScenarios,
    requiredScenarios,
    allScnsPass,
    teacherValidated,
  );

  const progressPct = computeProgressPct(
    moduleId,
    completedScenarios,
    requiredScenarios,
    teacherValidated,
  );

  let completedAt: Date | null = null;
  if (passed) {
    completedAt = existingCompletedAt ?? new Date();
  }

  return sanitizeCheckpointSnapshot({
    moduleId,
    requiredScenarios,
    completedScenarios,
    progressPct,
    scenarioStatus,
    bestScore,
    averageScore,
    passed,
    completedAt,
    teacherValidated,
  });
}

/** RC24 — passed must never diverge from progress / scenario completion. */
export function sanitizeCheckpointSnapshot(
  snapshot: ModuleCheckpointSnapshot,
): ModuleCheckpointSnapshot {
  const zeroProgress =
    snapshot.progressPct === 0 ||
    snapshot.completedScenarios === 0 ||
    snapshot.requiredScenarios === 0;
  if (!snapshot.passed || !zeroProgress) return snapshot;
  return {
    ...snapshot,
    passed: false,
    completedAt: null,
  };
}

async function getAllActiveScenarioRows() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(scenarios)
    .where(eq(scenarios.isActive, true))
    .orderBy(asc(scenarios.id));
}

export async function getModuleScenarioCheckpointStatus(
  userId: number,
  moduleId: number,
): Promise<Record<string, ScnCheckpointStatus>> {
  const scnCodes = OFFICIAL_SCN_BY_MODULE[moduleId] ?? [];
  const threshold = getModuleScenarioPassThreshold(moduleId);
  const allRows = await getAllActiveScenarioRows();
  const result: Record<string, ScnCheckpointStatus> = {};

  for (const scnCode of scnCodes) {
    const key = goldScnKeyFromCode(scnCode);
    const run = await getBestScoringNonDemoCompletedRunForScn(userId, scnCode, allRows);
    if (!run) {
      result[key] = { passed: false, score: null, runId: null };
      continue;
    }
    result[key] = {
      passed: run.score >= threshold,
      score: run.score,
      runId: run.id,
    };
  }

  return result;
}

export async function computeModuleCheckpointSnapshot(
  userId: number,
  moduleId: number,
): Promise<ModuleCheckpointSnapshot | null> {
  if (!isCheckpointModule(moduleId)) return null;

  const existing = await getModuleProgressRow(userId, moduleId);
  const teacherValidated = existing?.teacherValidated ?? false;
  const scnKeys = scnKeysForModule(moduleId);
  const scenarioStatus = await getModuleScenarioCheckpointStatus(userId, moduleId);

  return buildModuleCheckpointSnapshot(
    moduleId,
    scenarioStatus,
    scnKeys,
    teacherValidated,
    existing?.completedAt ?? null,
  );
}

export async function recomputeModuleCheckpoint(
  userId: number,
  moduleId: number,
): Promise<ModuleCheckpointSnapshot | null> {
  const snapshot = await computeModuleCheckpointSnapshot(userId, moduleId);
  if (!snapshot) return null;

  await upsertModuleCheckpointSnapshot(userId, {
    moduleId: snapshot.moduleId,
    passed: snapshot.passed,
    bestScore: snapshot.bestScore,
    averageScore: snapshot.averageScore,
    completedAt: snapshot.completedAt,
    progressPct: snapshot.progressPct,
    completedScenarios: snapshot.completedScenarios,
    requiredScenarios: snapshot.requiredScenarios,
    scenarioStatus: snapshot.scenarioStatus,
    engineVersion: CHECKPOINT_ENGINE_VERSION,
  });
  return snapshot;
}

export async function recomputeAllModuleCheckpoints(userId: number): Promise<ModuleCheckpointSnapshot[]> {
  const snapshots: ModuleCheckpointSnapshot[] = [];
  for (const moduleId of CHECKPOINT_MODULE_IDS) {
    const snapshot = await recomputeModuleCheckpoint(userId, moduleId);
    if (snapshot) snapshots.push(snapshot);
  }
  return snapshots;
}

export async function getCheckpointProgressForUser(userId: number): Promise<ModuleCheckpointSnapshot[]> {
  const snapshots: ModuleCheckpointSnapshot[] = [];
  for (const moduleId of CHECKPOINT_MODULE_IDS) {
    const snapshot = await computeModuleCheckpointSnapshot(userId, moduleId);
    if (snapshot) snapshots.push(snapshot);
  }
  return snapshots;
}
