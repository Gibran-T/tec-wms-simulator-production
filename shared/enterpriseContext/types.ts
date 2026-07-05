/** Enterprise Context Engine types — AI Mentor §6.5 / RC21 */

import type { PriorityLevel, DepartmentCode } from "../enterpriseBriefing";

export type ContextSensitivity = "low" | "medium";

export interface ContextBlock<T> {
  blockId: string;
  sensitivity: ContextSensitivity;
  data: T;
}

export interface ScenarioContextBlock {
  scnCode: string;
  moduleId: number;
  department: DepartmentCode;
  businessProblem: { fr: string; en: string };
  primarySupervisorId: string;
  priority: PriorityLevel;
}

export interface MissionContextBlock {
  situation: { fr: string; en: string };
  role: string;
  mission: { fr: string; en: string };
  businessContext: { fr: string; en: string };
  expectedOutcome: { fr: string; en: string };
  successCriteria: string[];
  supervisor: {
    name: string;
    titleFr: string;
    titleEn: string;
  } | null;
  kpis: string[];
}

export interface UniverseContextBlock {
  facility: { fr: string; en: string };
  warehouseZone: string;
  customer: { code: string; name: string } | null;
  supplier: { code: string; name: string } | null;
  incident: {
    id: string;
    nameFr: string;
    nameEn: string;
    severity: string;
  } | null;
}

export interface ProcessCardSummary {
  processId: string;
  titleFr: string;
  titleEn: string;
  wmsAnchor: string;
  learningTransferFr: string;
  learningTransferEn: string;
  isActiveForStep: boolean;
}

export interface ProcessContextBlock {
  activeProcessId: string | null;
  processFamily: string[];
  cards: ProcessCardSummary[];
}

export interface StudentProgressContextBlock {
  modulesCompleted: number[];
  certificationStatus: {
    silverCertified: boolean;
    goldEligible: boolean;
    goldCertified: boolean;
  };
  attemptCount: number;
}

export interface CurrentStepContextBlock {
  activeStepCode: string | null;
  activeStepLabel: { fr: string; en: string } | null;
  completedSteps: string[];
  progressPct: number;
  runStatus: string;
  isDemo: boolean;
  oilFocus: string | null;
}

export interface EnterpriseContextBlocks {
  scenario: ContextBlock<ScenarioContextBlock>;
  mission: ContextBlock<MissionContextBlock>;
  universe: ContextBlock<UniverseContextBlock>;
  process: ContextBlock<ProcessContextBlock>;
  studentProgress: ContextBlock<StudentProgressContextBlock>;
  currentStep: ContextBlock<CurrentStepContextBlock>;
}

export interface EnterpriseContextPayload {
  assembledAt: string;
  scnCode: string;
  runId: number | null;
  blocks: EnterpriseContextBlocks;
}
