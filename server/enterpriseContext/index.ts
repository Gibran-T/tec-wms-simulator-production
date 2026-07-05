import type { MissionWithEnterprise } from "../../shared/enterprise/enrichMission";
import type { EnterpriseContextPayload } from "../../shared/enterpriseContext/types";
import { getMissionForScenario } from "../missionData";
import {
  getGoldCertificationStatus,
  getModuleProgressByUser,
  getPassedModuleIds,
  getProfileByUserId,
  getRunsByUser,
  getRunById,
  getScenarioById,
} from "../db";
import {
  calculateProgressPctAllModules,
  getNextRequiredStepAllModules,
} from "../rulesEngine";
import { buildRunState } from "./runStateBridge";
import { buildScenarioContext } from "./scenarioContext";
import { buildMissionContext } from "./missionContext";
import { buildUniverseContext } from "./universeContext";
import { buildProcessContext } from "./processContext";
import { buildStudentProgressContext } from "./progressContext";
import { buildStepContext } from "./stepContext";
import { applyProhibitedContextFilter } from "./prohibitedFilter";
import { resolveScnCode } from "../missionData";
import {
  CANONICAL_SCENARIO_ID_BY_SCN,
  moduleIdFromScnCode,
  type OfficialScnCode,
} from "../canonicalScenarios";

export interface AssembleEnterpriseContextInput {
  userId: number;
  runId?: number;
  scnCode?: string;
  scenarioId?: number;
}

export async function assembleEnterpriseContext(
  input: AssembleEnterpriseContextInput
): Promise<EnterpriseContextPayload> {
  let scnCode = input.scnCode ?? null;
  let moduleId = 1;
  let mission: MissionWithEnterprise | null = null;
  let activeStepCode: string | null = null;
  let activeStepLabelFr: string | null = null;
  let activeStepLabelEn: string | null = null;
  let completedSteps: string[] = [];
  let progressPct = 0;
  let runStatus = "briefing";
  let isDemo = false;
  let attemptCount = 0;

  if (input.runId != null) {
    const run = await getRunById(input.runId);
    if (!run) {
      throw new Error("Run not found");
    }
    if (run.userId !== input.userId) {
      throw new Error("Run access denied");
    }

    const scenario = await getScenarioById(run.scenarioId);
    moduleId = scenario?.moduleId ?? 1;
    mission = getMissionForScenario(scenario);
    scnCode = mission?.scnCode ?? resolveScnCode(scenario) ?? scnCode;

    const state = await buildRunState(input.runId);
    completedSteps = state.completedSteps as string[];
    isDemo = run.isDemo;
    runStatus = run.status;
    progressPct = calculateProgressPctAllModules(completedSteps, moduleId, state);
    const nextStep = getNextRequiredStepAllModules(completedSteps, moduleId, state);
    activeStepCode = (nextStep as { code?: string } | null)?.code ?? null;
    activeStepLabelFr = (nextStep as { labelFr?: string } | null)?.labelFr ?? null;
    activeStepLabelEn = (nextStep as { labelEn?: string } | null)?.labelEn ?? null;

    const userRuns = await getRunsByUser(input.userId);
    attemptCount = userRuns.filter((r) => r.run.scenarioId === run.scenarioId).length;
  } else if (input.scenarioId != null) {
    const scenario = await getScenarioById(input.scenarioId);
    if (!scenario) {
      throw new Error("Scenario not found");
    }
    moduleId = scenario.moduleId ?? 1;
    mission = getMissionForScenario(scenario);
    scnCode = mission?.scnCode ?? resolveScnCode(scenario) ?? scnCode;
    const userRuns = await getRunsByUser(input.userId);
    attemptCount = userRuns.filter((r) => r.run.scenarioId === input.scenarioId).length;
  } else if (input.scnCode) {
    const resolvedModuleId = moduleIdFromScnCode(input.scnCode);
    moduleId = resolvedModuleId ?? 1;
    const canonicalScenarioId = CANONICAL_SCENARIO_ID_BY_SCN[input.scnCode as OfficialScnCode];
    if (canonicalScenarioId != null) {
      mission = getMissionForScenario({
        id: canonicalScenarioId,
        moduleId,
        name: input.scnCode,
      });
    }
  }

  if (!scnCode) {
    throw new Error("Unable to resolve SCN code for enterprise context");
  }

  if (!mission && input.scenarioId != null) {
    const scenario = await getScenarioById(input.scenarioId);
    mission = getMissionForScenario(scenario);
  }

  const passedModuleIds = await getPassedModuleIds(input.userId);
  const profile = await getProfileByUserId(input.userId);
  const gold = await getGoldCertificationStatus(input.userId);
  const moduleProgress = await getModuleProgressByUser(input.userId);
  const modulesCompleted = Array.from(
    new Set([
      ...passedModuleIds,
      ...moduleProgress.filter((m) => m.passed || m.teacherValidated).map((m) => m.moduleId),
    ]),
  ).sort((a, b) => a - b);

  const payload: EnterpriseContextPayload = {
    assembledAt: new Date().toISOString(),
    scnCode,
    runId: input.runId ?? null,
    blocks: {
      scenario: buildScenarioContext(scnCode, moduleId, mission),
      mission: buildMissionContext(mission),
      universe: buildUniverseContext(scnCode),
      process: buildProcessContext(scnCode, activeStepCode),
      studentProgress: buildStudentProgressContext({
        modulesCompleted,
        silverCertified: profile?.silverCertified ?? false,
        goldEligible: gold.goldEligible,
        goldCertified: gold.goldCertified,
        attemptCount,
      }),
      currentStep: buildStepContext({
        activeStepCode,
        activeStepLabelFr,
        activeStepLabelEn,
        completedSteps,
        progressPct,
        runStatus,
        isDemo,
        moduleId,
      }),
    },
  };

  return applyProhibitedContextFilter(payload);
}
