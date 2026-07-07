import type { EnterpriseContextPayload } from "../../shared/enterpriseContext/types";
import { buildProfessionalRoleContext } from "../enterpriseContext/scenarioContext";
import { getMissionForScenario } from "../missionData";

/** Redact operational values that must never reach the live LLM prompt. */
export function redactOperationalValues(text: string): string {
  return text
    .replace(/\bLOT[- ]?\d{4}[- ]?[A-Z0-9-]+\b/gi, "[LOT]")
    .replace(/\b(?:PO|SO|GR|GI)-(?:M\d|\d{4})-[A-Z0-9-]+\b/gi, "[DOC]")
    .replace(/\bB-\d{2}-R\d-L\d\b/gi, "[BIN]")
    .replace(/\b(?:REC|EXP|STO|SHP)-\d{2}\b/gi, "[BIN]")
    .replace(/\b\d+(?:[.,]\d+)?\s*u\.?\b/gi, "[QTY]")
    .replace(/\bréappro\s+\d+\s*\/\s*\d+\s*\/\s*\d+\b/gi, "[REPLENISH_POLICY]")
    .replace(/\bMin\s+\d+\s*\/\s*Max\s+\d+\s*\/\s*SS\s+\d+\b/gi, "[REPLENISH_POLICY]")
    .replace(/\b\d+(?:[.,]\d+)?%\b/g, "[KPI]")
    .replace(/\b\d+(?:[.,]\d+)?\s*(?:jours|days)\b/gi, "[LEAD_TIME]");
}

function redactLocalized(text: { fr: string; en: string }): { fr: string; en: string } {
  return {
    fr: redactOperationalValues(text.fr),
    en: redactOperationalValues(text.en),
  };
}

/**
 * Live OpenAI context — pedagogical framing only; no eval-sensitive operational datums.
 */
export function buildLiveSafeContextSummary(context: EnterpriseContextPayload): string {
  const scnCode = context.scnCode ?? "SCN-001";
  const moduleId = context.blocks.scenario.data.moduleId;
  const mission = getMissionForScenario({ id: 0, moduleId, name: scnCode });
  const professionalRole = buildProfessionalRoleContext(mission, scnCode);
  const missionBlock = context.blocks.mission.data;
  const step = context.blocks.currentStep.data;

  const payload = {
    scnCode: context.scnCode,
    scenario: {
      moduleId: context.blocks.scenario.data.moduleId,
      department: context.blocks.scenario.data.department,
      priority: context.blocks.scenario.data.priority,
      businessProblem: redactLocalized(context.blocks.scenario.data.businessProblem),
    },
    mission: {
      role: missionBlock.role,
      mission: redactLocalized(missionBlock.mission),
      businessContext: redactLocalized(missionBlock.businessContext),
      expectedOutcome: redactLocalized({
        fr: missionBlock.expectedOutcome.fr,
        en: missionBlock.expectedOutcome.en,
      }),
      supervisor: missionBlock.supervisor
        ? { name: missionBlock.supervisor.name, titleFr: missionBlock.supervisor.titleFr }
        : null,
    },
    universe: {
      facility: redactLocalized(context.blocks.universe.data.facility),
      warehouseZone: context.blocks.universe.data.warehouseZone,
      incident: context.blocks.universe.data.incident
        ? {
            id: context.blocks.universe.data.incident.id,
            severity: context.blocks.universe.data.incident.severity,
          }
        : null,
    },
    process: {
      activeProcessId: context.blocks.process.data.activeProcessId,
      processFamily: context.blocks.process.data.processFamily,
    },
    professionalRole: {
      roleTitle: professionalRole.roleTitle,
      department: professionalRole.department,
      supervisorName: professionalRole.supervisorName,
    },
    currentStep: {
      activeStepCode: step.activeStepCode,
      activeStepLabel: step.activeStepLabel
        ? redactLocalized(step.activeStepLabel)
        : null,
      progressPct: step.progressPct,
      runStatus: step.runStatus,
      isDemo: step.isDemo,
      oilFocus: step.oilFocus,
    },
    studentProgress: {
      modulesCompleted: context.blocks.studentProgress.data.modulesCompleted,
      attemptCount: context.blocks.studentProgress.data.attemptCount,
    },
  };

  return JSON.stringify(payload, null, 2);
}
