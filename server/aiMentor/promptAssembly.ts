import type { EnterpriseContextPayload } from "../../shared/enterpriseContext/types";
import type { MentorMode, MentorPersonaId, MentorPromptPreview } from "../../shared/aiMentor/types";
import { buildProfessionalRoleContext } from "../enterpriseContext/scenarioContext";
import { getMissionForScenario } from "../missionData";
import { buildPersonaSystemPrompt } from "./personas";

export function assemblePromptPreview(input: {
  context: EnterpriseContextPayload;
  mode: MentorMode;
  personaId: MentorPersonaId;
  language: "fr" | "en";
  studentMessage?: string;
  blocked?: boolean;
  blockReason?: string;
}): MentorPromptPreview {
  const { context, mode, personaId, language } = input;
  const systemPrompt = buildPersonaSystemPrompt(
    personaId,
    mode === "certification" ? "professional" : mode,
    language,
  );

  const scnCode = context.scnCode ?? "SCN-001";
  const moduleId = context.blocks.scenario.data.moduleId;
  const mission = getMissionForScenario({ id: 0, moduleId, name: scnCode });
  const professionalRole = buildProfessionalRoleContext(mission, scnCode);

  const contextSummary = JSON.stringify(
    {
      scnCode: context.scnCode,
      scenario: context.blocks.scenario.data,
      mission: {
        situation: context.blocks.mission.data.situation,
        role: context.blocks.mission.data.role,
        mission: context.blocks.mission.data.mission,
        kpis: context.blocks.mission.data.kpis,
        successCriteria: context.blocks.mission.data.successCriteria,
      },
      universe: context.blocks.universe.data,
      process: context.blocks.process.data,
      professionalRole,
      currentStep: context.blocks.currentStep.data,
      studentProgress: {
        modulesCompleted: context.blocks.studentProgress.data.modulesCompleted,
        certificationStatus: context.blocks.studentProgress.data.certificationStatus,
        attemptCount: context.blocks.studentProgress.data.attemptCount,
      },
    },
    null,
    2,
  );

  return {
    mode,
    personaId,
    systemPrompt,
    contextSummary,
    blocked: !!input.blocked,
    blockReason: input.blockReason,
  };
}

export function buildDryRunUserMessage(studentMessage?: string): string {
  if (!studentMessage?.trim()) {
    return "[dry-run: no student message]";
  }
  return studentMessage.trim();
}
