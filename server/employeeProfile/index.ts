import {
  assembleEmployeeProfile,
  type AssembleEmployeeProfileInput,
  type EmployeeProfilePayload,
  type RunSnapshot,
} from "../../shared/enterprise/employeeProfile";
import { OFFICIAL_SCN_BY_MODULE } from "../canonicalScenarios";
import {
  getModuleProgressWithModules,
  getProfileByUserId,
  getRunsByUser,
  getScoringEventsByRun,
} from "../db";
import { getMissionForScenario, resolveScnCode } from "../missionData";
import { calculateTotalScore } from "../scoringEngine";

export interface AssembleEmployeeProfileForUserInput {
  userId: number;
  displayName: string;
}

async function buildRunSnapshots(userId: number): Promise<RunSnapshot[]> {
  const runs = await getRunsByUser(userId);
  const snapshots: RunSnapshot[] = [];

  for (const row of runs) {
    const scnCode = resolveScnCode(row.scenario) ?? "SCN-000";
    const mission = getMissionForScenario(row.scenario);
    let score: number | null = null;

    if (!row.run.isDemo && row.run.status === "completed") {
      const events = await getScoringEventsByRun(row.run.id);
      score = calculateTotalScore(events);
    }

    snapshots.push({
      runId: row.run.id,
      scenarioId: row.scenario.id,
      moduleId: row.scenario.moduleId ?? 1,
      scnCode,
      missionTitle: mission?.objective ?? row.scenario.name ?? scnCode,
      status: row.run.status,
      isDemo: row.run.isDemo,
      completedAt: row.run.completedAt?.toISOString() ?? null,
      score,
    });
  }

  return snapshots;
}

export async function assembleEmployeeProfileForUser(
  input: AssembleEmployeeProfileForUserInput
): Promise<EmployeeProfilePayload> {
  const [profile, moduleProgress, runs] = await Promise.all([
    getProfileByUserId(input.userId),
    getModuleProgressWithModules(input.userId),
    buildRunSnapshots(input.userId),
  ]);

  const assemblyInput: AssembleEmployeeProfileInput = {
    userId: input.userId,
    displayName: input.displayName,
    studentNumber: profile?.studentNumber ?? null,
    silverCertified: profile?.silverCertified ?? false,
    goldCertified: profile?.goldCertified ?? false,
    moduleProgress: moduleProgress.map((row) => ({
      moduleId: row.moduleId,
      passed: row.passed,
      teacherValidated: row.teacherValidated ?? false,
      completedScenarios: row.completedScenarios ?? 0,
      requiredScenarios: row.requiredScenarios ?? 0,
    })),
    runs,
  };

  return assembleEmployeeProfile(assemblyInput, OFFICIAL_SCN_BY_MODULE);
}
