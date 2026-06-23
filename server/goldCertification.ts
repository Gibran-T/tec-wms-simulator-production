/**
 * Wave 5 — Gold certification eligibility engine.
 * Mirrors Silver pattern; consumes Wave 3/4 compliance validators.
 */

import { and, asc, desc, eq } from "drizzle-orm";
import {
  GOLD_CAPSTONE_THRESHOLD,
  QUIZ_PASS_THRESHOLD,
  getModuleScenarioPassThreshold,
} from "@shared/moduleThresholds";
import {
  FONDATRICE_GOLD_INSTITUTIONAL_NOTE,
  isFoundingCohortInstitutionalGoldAward,
} from "@shared/foundingCohortGoldAward";
import {
  cycleCounts,
  progress,
  quizAttempts,
  quizzes,
  scenarioRuns,
  scenarios,
  transactions,
} from "../drizzle/schema";
import {
  moduleIdFromScnCode,
  OFFICIAL_SCN_BY_MODULE,
  scenarioIdsForScn,
  type OfficialScnCode,
} from "./canonicalScenarios";
import {
  getDb,
  getInventoryAdjustmentsByRun,
  getInventoryCountsByRun,
  getKpiInterpretationsByRun,
  getKpiSnapshotByRun,
  getProfileByUserId,
  getProgressByRun,
  getReplenishmentSuggestionsByRun,
  getRunById,
  getScenarioById,
  getScoringEventsByRun,
  getTransactionsByRun,
} from "./db";
import { calculateTotalScore } from "./scoringEngine";
import {
  assertM5VarianceGate,
  calculateInventory,
  calculateKpis,
  getEffectiveM5Steps,
  getM4KpiDataFromSeed,
  validateM3Compliance,
  validateM4Compliance,
  validateM5Compliance,
  type M5InitialStateJson,
} from "./rulesEngine";

export type GoldState = "LOCKED" | "IN_PROGRESS" | "ELIGIBLE" | "AWARDED";

export const GOLD_SCN_KEYS = [
  "SCN006", "SCN007", "SCN008",
  "SCN009", "SCN010", "SCN011",
  "SCN012", "SCN013", "SCN014",
  "SCN015", "SCN016", "SCN017",
] as const;

export type GoldScnKey = (typeof GOLD_SCN_KEYS)[number];

export type GoldScenarioCompletionMap = Record<GoldScnKey, boolean>;

export type GoldCertificationStatus = {
  state: GoldState;
  silverPrerequisite: boolean;
  quizM5Passed: boolean;
  scenariosCompleted: GoldScenarioCompletionMap;
  complianceValidated: boolean;
  noBlockers: boolean;
  moduleCompliancePassed: boolean;
  scn016VarianceBeforeKpi: boolean;
  scn017CapstoneScore: boolean;
  scn017DecisionLinked: boolean;
  goldEligible: boolean;
  goldCertified: boolean;
  requirementsMetCount: number;
  requirementsTotalCount: number;
  blockerSummary?: string;
  /** Set when Gold is awarded via institutional governance (not runtime 18-gate completion). */
  goldAwardSource?: string;
  institutionalNote?: string;
};

const GOLD_PATH_SCNS: OfficialScnCode[] = [
  ...OFFICIAL_SCN_BY_MODULE[2],
  ...OFFICIAL_SCN_BY_MODULE[3],
  ...OFFICIAL_SCN_BY_MODULE[4],
  ...OFFICIAL_SCN_BY_MODULE[5],
];

const COMPLIANCE_STEP_BY_MODULE: Record<number, string> = {
  2: "COMPLIANCE_ADV",
  3: "COMPLIANCE_M3",
  4: "COMPLIANCE_M4",
  5: "COMPLIANCE_M5",
};

export const GOLD_REQUIREMENTS_TOTAL = 18;

export function isGoldUnlockEnabled(): boolean {
  return process.env.ENABLE_GOLD_UNLOCK === "true";
}

export function goldScnKeyFromCode(scn: OfficialScnCode): GoldScnKey {
  const n = scn.replace("SCN-", "");
  return `SCN${n}` as GoldScnKey;
}

export function getGoldScenarioPassThreshold(scnCode: OfficialScnCode): number {
  const moduleId = moduleIdFromScnCode(scnCode);
  if (!moduleId) return GOLD_CAPSTONE_THRESHOLD;
  if (scnCode === "SCN-017") return GOLD_CAPSTONE_THRESHOLD;
  return getModuleScenarioPassThreshold(moduleId);
}

export function resolveGoldState(input: {
  silverCertified: boolean;
  goldCertified: boolean;
  goldEligible: boolean;
}): GoldState {
  if (input.goldCertified) return "AWARDED";
  if (!input.silverCertified) return "LOCKED";
  if (input.goldEligible) return "ELIGIBLE";
  return "IN_PROGRESS";
}

function emptyGoldScenarioMap(): GoldScenarioCompletionMap {
  return Object.fromEntries(GOLD_SCN_KEYS.map((k) => [k, false])) as GoldScenarioCompletionMap;
}

function fullGoldScenarioMap(): GoldScenarioCompletionMap {
  return Object.fromEntries(GOLD_SCN_KEYS.map((k) => [k, true])) as GoldScenarioCompletionMap;
}

/** Display + API status for Cohorte Fondatrice institutional Gold (mirrors Silver awarded short-circuit). */
export function buildInstitutionalGoldAwardStatus(goldAwardSource: string): GoldCertificationStatus {
  const scenariosCompleted = fullGoldScenarioMap();
  const partial = {
    silverPrerequisite: true,
    quizM5Passed: true,
    scenariosCompleted,
    complianceValidated: true,
    noBlockers: true,
    moduleCompliancePassed: true,
    scn016VarianceBeforeKpi: true,
    scn017CapstoneScore: true,
    scn017DecisionLinked: true,
    goldEligible: true,
    goldCertified: true,
    goldAwardSource,
    institutionalNote: FONDATRICE_GOLD_INSTITUTIONAL_NOTE,
  };
  return {
    ...partial,
    state: "AWARDED",
    requirementsMetCount: GOLD_REQUIREMENTS_TOTAL,
    requirementsTotalCount: GOLD_REQUIREMENTS_TOTAL,
    blockerSummary: undefined,
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

async function getLatestNonDemoCompletedRun(userId: number, scenarioId: number) {
  const db = await getDb();
  if (!db) return null;
  const runs = await db
    .select()
    .from(scenarioRuns)
    .where(
      and(
        eq(scenarioRuns.userId, userId),
        eq(scenarioRuns.scenarioId, scenarioId),
        eq(scenarioRuns.status, "completed"),
        eq(scenarioRuns.isDemo, false),
      ),
    )
    .orderBy(desc(scenarioRuns.completedAt))
    .limit(1);
  return runs[0] ?? null;
}

async function getLatestNonDemoCompletedRunForScn(
  userId: number,
  scnCode: OfficialScnCode,
  allRows: Awaited<ReturnType<typeof getAllActiveScenarioRows>>,
) {
  const ids = scenarioIdsForScn(scnCode, allRows);
  let best: Awaited<ReturnType<typeof getLatestNonDemoCompletedRun>> = null;
  for (const scenarioId of ids) {
    const run = await getLatestNonDemoCompletedRun(userId, scenarioId);
    if (!run) continue;
    if (!best || (run.completedAt && best.completedAt && run.completedAt > best.completedAt)) {
      best = run;
    }
  }
  return best;
}

async function buildRunStateForGold(runId: number) {
  const run = await getRunById(runId);
  const scenario = run ? await getScenarioById(run.scenarioId) : null;
  const [txs, prog, inventoryCounts, inventoryAdjustments] = await Promise.all([
    getTransactionsByRun(runId),
    getProgressByRun(runId),
    getInventoryCountsByRun(runId),
    getInventoryAdjustmentsByRun(runId),
  ]);

  const inventory = calculateInventory(
    txs.map((t) => ({
      docType: t.docType,
      sku: t.sku,
      bin: t.bin,
      qty: Number(t.qty),
      posted: t.posted,
    })),
  );

  const completedSteps = prog.filter((p) => p.completed).map((p) => p.stepCode);

  return {
    run,
    scenario,
    completedSteps,
    transactions: txs.map((t) => ({
      docType: t.docType,
      sku: t.sku,
      bin: t.bin,
      qty: Number(t.qty),
      posted: t.posted,
      docRef: (t as { docRef?: string | null }).docRef ?? null,
    })),
    inventoryCounts: inventoryCounts.map((c) => ({
      sku: c.sku,
      systemQty: Number(c.systemQty),
      countedQty: Number(c.countedQty),
      varianceQty: Number(c.varianceQty),
    })),
    inventoryAdjustments: inventoryAdjustments.map((a) => ({
      sku: a.sku,
      varianceQty: Number(a.varianceQty),
      adjustmentQty: Number(a.adjustmentQty),
      reason: a.reason,
    })),
    inventory,
  };
}

export async function checkM5QuizPassed(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const m5Quiz = await db.select().from(quizzes).where(eq(quizzes.moduleId, 5)).limit(1);
  if (m5Quiz.length === 0) return false;

  const bestAttempt = await db
    .select()
    .from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, m5Quiz[0].id)))
    .orderBy(desc(quizAttempts.score))
    .limit(1);

  return bestAttempt.length > 0 && bestAttempt[0].score >= QUIZ_PASS_THRESHOLD;
}

export async function getGoldScenarioCompletionStatus(userId: number): Promise<GoldScenarioCompletionMap> {
  const result = emptyGoldScenarioMap();
  const allRows = await getAllActiveScenarioRows();

  for (const scnCode of GOLD_PATH_SCNS) {
    const key = goldScnKeyFromCode(scnCode);
    const run = await getLatestNonDemoCompletedRunForScn(userId, scnCode, allRows);
    if (!run) continue;
    const events = await getScoringEventsByRun(run.id);
    const score = calculateTotalScore(events);
    result[key] = score >= getGoldScenarioPassThreshold(scnCode);
  }

  return result;
}

export async function checkGoldComplianceValidated(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const allRows = await getAllActiveScenarioRows();

  for (const scnCode of GOLD_PATH_SCNS) {
    const moduleId = moduleIdFromScnCode(scnCode);
    if (!moduleId) return false;
    const complianceStep = COMPLIANCE_STEP_BY_MODULE[moduleId];
    const latestRun = await getLatestNonDemoCompletedRunForScn(userId, scnCode, allRows);
    if (!latestRun) return false;

    const step = await db
      .select()
      .from(progress)
      .where(
        and(
          eq(progress.runId, latestRun.id),
          eq(progress.stepCode, complianceStep),
          eq(progress.completed, true),
        ),
      )
      .limit(1);

    if (step.length === 0) return false;
  }

  return true;
}

export async function checkGoldNoUnresolvedBlockers(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const allRows = await getAllActiveScenarioRows();

  for (const scnCode of GOLD_PATH_SCNS) {
    const latestRun = await getLatestNonDemoCompletedRunForScn(userId, scnCode, allRows);
    if (!latestRun) return false;

    const unpostedTransactions = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.runId, latestRun.id), eq(transactions.posted, false)));

    if (unpostedTransactions.length > 0) return false;

    const unresolvedCycleCounts = await db
      .select()
      .from(cycleCounts)
      .where(and(eq(cycleCounts.runId, latestRun.id), eq(cycleCounts.resolved, false)));

    if (unresolvedCycleCounts.length > 0) return false;
  }

  return true;
}

async function checkModuleComplianceForRun(
  scnCode: OfficialScnCode,
  runId: number,
): Promise<boolean> {
  const state = await buildRunStateForGold(runId);
  const scenario = state.scenario;
  if (!scenario) return false;
  const moduleId = scenario.moduleId;

  if (moduleId === 3) {
    const replenishmentSuggestions = await getReplenishmentSuggestionsByRun(runId);
    const result = validateM3Compliance({
      initialStateJson: scenario.initialStateJson as Parameters<typeof validateM3Compliance>[0]["initialStateJson"],
      inventoryCounts: state.inventoryCounts,
      inventoryAdjustments: state.inventoryAdjustments,
      replenishmentSuggestions: replenishmentSuggestions.map((r) => ({
        sku: r.sku,
        systemQty: Number(r.systemQty),
        suggestedQty: Number(r.suggestedQty),
        reason: r.reason,
      })),
      transactions: state.transactions,
    });
    return result.allowed;
  }

  if (moduleId === 4) {
    const kpiInterpretations = await getKpiInterpretationsByRun(runId);
    const kpiData = getM4KpiDataFromSeed(
      scenario.initialStateJson as Parameters<typeof getM4KpiDataFromSeed>[0],
    );
    const kpiResult = calculateKpis(kpiData);
    const result = validateM4Compliance({
      scnCode,
      completedSteps: state.completedSteps,
      kpiInterpretations: kpiInterpretations.map((r) => ({
        kpiKey: r.kpiKey,
        studentAnswer: r.studentAnswer,
        isCorrect: r.isCorrect,
      })),
      kpiResult,
    });
    return result.allowed;
  }

  if (moduleId === 5) {
    const m5State = scenario.initialStateJson as M5InitialStateJson | undefined;
    const snapshotRow = await getKpiSnapshotByRun(runId);
    const kpiSnapshot = snapshotRow
      ? {
          rotationRate: Number(snapshotRow.rotationRate),
          serviceLevel: Number(snapshotRow.serviceLevel),
          errorRate: Number(snapshotRow.errorRate),
          averageLeadTime: Number(snapshotRow.averageLeadTime),
          stockImmobilizedValue: Number(snapshotRow.stockImmobilizedValue),
        }
      : null;
    const effectiveSteps = getEffectiveM5Steps(m5State, state);
    const decisionRejected = scnCode === "SCN-017" && !state.completedSteps.includes("M5_DECISION");
    const result = validateM5Compliance({
      scnCode,
      initialStateJson: m5State,
      completedSteps: state.completedSteps,
      inventoryCounts: state.inventoryCounts,
      inventoryAdjustments: state.inventoryAdjustments,
      transactions: state.transactions,
      inventory: state.inventory,
      kpiSnapshot,
      decisionRejected,
      effectiveSteps,
    });
    return result.allowed;
  }

  return true;
}

export async function checkGoldModuleCompliance(userId: number): Promise<boolean> {
  const allRows = await getAllActiveScenarioRows();
  const m345Scns = [
    ...OFFICIAL_SCN_BY_MODULE[3],
    ...OFFICIAL_SCN_BY_MODULE[4],
    ...OFFICIAL_SCN_BY_MODULE[5],
  ];

  for (const scnCode of m345Scns) {
    const latestRun = await getLatestNonDemoCompletedRunForScn(userId, scnCode, allRows);
    if (!latestRun) return false;
    const ok = await checkModuleComplianceForRun(scnCode, latestRun.id);
    if (!ok) return false;
  }

  return true;
}

export async function checkScn016VarianceGate(userId: number): Promise<boolean> {
  const allRows = await getAllActiveScenarioRows();
  const run = await getLatestNonDemoCompletedRunForScn(userId, "SCN-016", allRows);
  if (!run) return false;

  const state = await buildRunStateForGold(run.id);
  const scenario = state.scenario;
  const m5State = scenario?.initialStateJson as M5InitialStateJson | undefined;

  const varianceGate = assertM5VarianceGate(
    m5State,
    state.inventoryCounts,
    state.inventoryAdjustments,
    state.transactions,
  );
  if (!varianceGate.allowed) return false;

  const steps = state.completedSteps;
  const kpiIdx = steps.indexOf("M5_KPI");
  const adjIdx = steps.indexOf("M5_ADJ");
  if (kpiIdx >= 0) {
    if (adjIdx < 0) return false;
    if (adjIdx > kpiIdx) return false;
  }

  return true;
}

export async function checkScn017CapstoneGates(userId: number): Promise<{
  capstoneScore: boolean;
  decisionLinked: boolean;
}> {
  const allRows = await getAllActiveScenarioRows();
  const run = await getLatestNonDemoCompletedRunForScn(userId, "SCN-017", allRows);
  if (!run) return { capstoneScore: false, decisionLinked: false };

  const events = await getScoringEventsByRun(run.id);
  const score = calculateTotalScore(events);
  const capstoneScore = score >= GOLD_CAPSTONE_THRESHOLD;

  const snapshotRow = await getKpiSnapshotByRun(run.id);
  const state = await buildRunStateForGold(run.id);
  const decisionLinked =
    snapshotRow != null &&
    state.completedSteps.includes("M5_DECISION") &&
    state.completedSteps.includes("M5_KPI");

  return { capstoneScore, decisionLinked };
}

function countRequirementsMet(status: Omit<GoldCertificationStatus, "requirementsMetCount" | "requirementsTotalCount" | "state" | "blockerSummary">): number {
  let count = 0;
  if (status.silverPrerequisite) count++;
  if (status.quizM5Passed) count++;
  count += GOLD_SCN_KEYS.filter((k) => status.scenariosCompleted[k]).length;
  if (status.complianceValidated && status.moduleCompliancePassed) count++;
  if (status.noBlockers) count++;
  if (status.scn016VarianceBeforeKpi) count++;
  if (status.scn017CapstoneScore && status.scn017DecisionLinked) count++;
  return count;
}

function firstBlockerSummary(status: Omit<GoldCertificationStatus, "blockerSummary" | "requirementsMetCount" | "requirementsTotalCount" | "state">): string | undefined {
  if (!status.silverPrerequisite) return "Silver prerequisite not met";
  if (!status.quizM5Passed) return "Quiz M5 ≥ 60% required";
  const missingScn = GOLD_SCN_KEYS.find((k) => !status.scenariosCompleted[k]);
  if (missingScn) return `${missingScn.replace("SCN", "SCN-")} eval threshold not met`;
  if (!status.complianceValidated) return "M2–M5 compliance not validated";
  if (!status.noBlockers) return "Unresolved blockers on Gold-path scenarios";
  if (!status.moduleCompliancePassed) return "Module compliance validators failed";
  if (!status.scn016VarianceBeforeKpi) return "SCN-016: variance must be resolved before KPI";
  if (!status.scn017CapstoneScore) return "SCN-017 capstone score below threshold";
  if (!status.scn017DecisionLinked) return "SCN-017 decision not linked to KPI snapshot";
  return undefined;
}

export async function getGoldCertificationStatus(userId: number): Promise<GoldCertificationStatus> {
  const profile = await getProfileByUserId(userId);
  const silverCertified = profile?.silverCertified ?? false;
  const goldCertified = profile?.goldCertified ?? false;
  const goldAwardSource = profile?.goldAwardSource ?? null;

  if (
    silverCertified &&
    goldCertified &&
    isFoundingCohortInstitutionalGoldAward(goldAwardSource)
  ) {
    return buildInstitutionalGoldAwardStatus(goldAwardSource!);
  }

  const silverPrerequisite = silverCertified;
  const quizM5Passed = silverCertified ? await checkM5QuizPassed(userId) : false;
  const scenariosCompleted = silverCertified
    ? await getGoldScenarioCompletionStatus(userId)
    : emptyGoldScenarioMap();
  const complianceValidated = silverCertified ? await checkGoldComplianceValidated(userId) : false;
  const noBlockers = silverCertified ? await checkGoldNoUnresolvedBlockers(userId) : false;
  const moduleCompliancePassed = silverCertified ? await checkGoldModuleCompliance(userId) : false;
  const scn016VarianceBeforeKpi = silverCertified ? await checkScn016VarianceGate(userId) : false;
  const scn017Gates = silverCertified
    ? await checkScn017CapstoneGates(userId)
    : { capstoneScore: false, decisionLinked: false };

  const allScenariosDone = GOLD_SCN_KEYS.every((k) => scenariosCompleted[k]);

  const goldEligible =
    silverPrerequisite &&
    quizM5Passed &&
    allScenariosDone &&
    complianceValidated &&
    noBlockers &&
    moduleCompliancePassed &&
    scn016VarianceBeforeKpi &&
    scn017Gates.capstoneScore &&
    scn017Gates.decisionLinked;

  const partial: Omit<GoldCertificationStatus, "state" | "requirementsMetCount" | "requirementsTotalCount" | "blockerSummary"> = {
    silverPrerequisite,
    quizM5Passed,
    scenariosCompleted,
    complianceValidated,
    noBlockers,
    moduleCompliancePassed,
    scn016VarianceBeforeKpi,
    scn017CapstoneScore: scn017Gates.capstoneScore,
    scn017DecisionLinked: scn017Gates.decisionLinked,
    goldEligible,
    goldCertified,
  };

  return {
    ...partial,
    state: resolveGoldState({ silverCertified, goldCertified, goldEligible }),
    requirementsMetCount: countRequirementsMet(partial),
    requirementsTotalCount: GOLD_REQUIREMENTS_TOTAL,
    blockerSummary: goldEligible ? undefined : firstBlockerSummary(partial),
    goldAwardSource: goldAwardSource ?? undefined,
    institutionalNote: isFoundingCohortInstitutionalGoldAward(goldAwardSource)
      ? FONDATRICE_GOLD_INSTITUTIONAL_NOTE
      : undefined,
  };
}
