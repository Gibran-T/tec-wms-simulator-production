import type { CharacterRef, DepartmentCode } from "../enterpriseBriefing";
import { getCharacterById } from "./characters";
import { getCareerSignalsForModule } from "./careerSignals";
import {
  CAREER_CHAPTER_LABELS,
  DEPARTMENT_LABELS,
  getScenarioBinding,
} from "./scenarioBinding";

/** Module home department — Living Company Blueprint §XII.
 *  FALLBACK ONLY: used when no assignment SCN is active.
 *  Primary department identity always comes from scenarioBinding when scnCode is present. */
export const MODULE_HOME_DEPARTMENT: Record<number, DepartmentCode> = {
  1: "WH",
  2: "WH",
  3: "INV",
  4: "OPS",
  5: "MGT",
};

/** Default supervisor per career chapter — Universe Part VIII */
export const MODULE_HOME_SUPERVISOR: Record<number, string> = {
  1: "marc-andre-tremblay",
  2: "aisha-rahman",
  3: "sophie-lachance",
  4: "elise-beaumont",
  5: "elise-beaumont",
};

export interface BilingualLabel {
  fr: string;
  en: string;
}

export interface EmployeeProfileMission {
  scnCode: string;
  missionTitle: string;
  moduleId: number;
  status: "completed" | "in_progress";
  completedAt: string | null;
  score: number | null;
  runId: number | null;
}

export interface EmployeeProfileCompetency {
  id: string;
  label: BilingualLabel;
  sourceModuleId: number;
  acquired: boolean;
}

export interface EmployeeProfileCurrentAssignment {
  scnCode: string | null;
  label: BilingualLabel;
  missionTitle: string | null;
  runId: number | null;
  status: "active" | "available" | "none";
}

export interface EmployeeProfilePayload {
  assembledAt: string;
  employeeId: string;
  displayName: string;
  department: { code: DepartmentCode; label: BilingualLabel };
  supervisor: CharacterRef;
  careerChapter: { moduleId: number; label: BilingualLabel };
  completedMissions: EmployeeProfileMission[];
  competencies: EmployeeProfileCompetency[];
  currentAssignment: EmployeeProfileCurrentAssignment;
  professionalSummary: BilingualLabel;
  certificationStatus: {
    silverCertified: boolean;
    goldCertified: boolean;
  };
}

export interface ModuleProgressSnapshot {
  moduleId: number;
  passed: boolean;
  teacherValidated?: boolean;
  completedScenarios?: number;
  requiredScenarios?: number;
}

export interface RunSnapshot {
  runId: number;
  scenarioId: number;
  moduleId: number;
  scnCode: string;
  missionTitle: string;
  status: string;
  isDemo: boolean;
  completedAt: string | null;
  score: number | null;
}

export interface AssembleEmployeeProfileInput {
  userId: number;
  displayName: string;
  studentNumber?: string | null;
  silverCertified?: boolean;
  goldCertified?: boolean;
  moduleProgress: ModuleProgressSnapshot[];
  runs: RunSnapshot[];
}

/** Stable Concorde employee identifier — RC20-A.2 fallback policy */
export function deriveEmployeeId(userId: number, studentNumber?: string | null): string {
  const trimmed = studentNumber?.trim();
  if (trimmed) return trimmed;
  const year = new Date().getFullYear();
  return `CL-TEC-${year}-${String(userId).padStart(4, "0")}`;
}

/** Active career chapter = first module not yet passed, else capstone M5 */
export function resolveActiveModuleId(moduleProgress: ModuleProgressSnapshot[]): number {
  for (let moduleId = 1; moduleId <= 5; moduleId += 1) {
    const row = moduleProgress.find((p) => p.moduleId === moduleId);
    if (!row?.passed) return moduleId;
  }
  return 5;
}

/** Resolve employee department identity.
 *  1. When scnCode is present → scenarioBinding.department (canonical)
 *  2. When no assignment SCN → MODULE_HOME_DEPARTMENT[moduleId] (fallback only) */
export function resolveDepartmentForModule(
  moduleId: number,
  scnCode?: string | null
): { code: DepartmentCode; label: BilingualLabel } {
  const binding = scnCode ? getScenarioBinding(scnCode) : undefined;
  const code = binding?.department ?? MODULE_HOME_DEPARTMENT[moduleId] ?? "WH";
  return { code, label: DEPARTMENT_LABELS[code] };
}

export function resolveSupervisorForModule(
  moduleId: number,
  scnCode?: string | null
): CharacterRef {
  const binding = scnCode ? getScenarioBinding(scnCode) : undefined;
  const supervisorId =
    binding?.supervisorId ?? MODULE_HOME_SUPERVISOR[moduleId] ?? "marc-andre-tremblay";
  return (
    getCharacterById(supervisorId) ?? {
      id: supervisorId,
      name: "Superviseur Concorde",
      titleFr: "Superviseur d'entrepôt",
      titleEn: "Warehouse Supervisor",
      department: MODULE_HOME_DEPARTMENT[moduleId] ?? "WH",
      signaturePhraseFr: "Le quai ne ment pas.",
      signaturePhraseEn: "The dock doesn't lie.",
    }
  );
}

export function buildCompetencies(modulesCompleted: number[]): EmployeeProfileCompetency[] {
  const competencies: EmployeeProfileCompetency[] = [];
  for (let moduleId = 1; moduleId <= 5; moduleId += 1) {
    const signals = getCareerSignalsForModule(moduleId);
    competencies.push(
      {
        id: `m${moduleId}-primary`,
        label: signals.primary,
        sourceModuleId: moduleId,
        acquired: modulesCompleted.includes(moduleId),
      },
      {
        id: `m${moduleId}-secondary`,
        label: signals.secondary,
        sourceModuleId: moduleId,
        acquired: modulesCompleted.includes(moduleId),
      }
    );
  }
  return competencies;
}

export function buildProfessionalSummary(input: {
  displayName: string;
  modulesCompleted: number[];
  completedMissionCount: number;
  activeModuleId: number;
  silverCertified: boolean;
  goldCertified: boolean;
}): BilingualLabel {
  const firstName = input.displayName.split(" ")[0] || input.displayName;
  const careerSignal = getCareerSignalsForModule(input.activeModuleId);

  if (input.goldCertified) {
    return {
      fr: `${firstName} a complété son affectation TEC.LOG chez Concorde Logistics. Profil ${careerSignal.primary.fr} — prêt(e) pour certification Gold et responsabilités opérationnelles étendues.`,
      en: `${firstName} has completed the TEC.LOG assignment at Concorde Logistics. ${careerSignal.primary.en} profile — ready for Gold certification and extended operational responsibility.`,
    };
  }

  if (input.silverCertified) {
    return {
      fr: `${firstName} est practicant(e) certifié(e) Silver à Concorde Logistics. ${input.completedMissionCount} mission(s) réussie(s) · chapitre actif : ${careerSignal.primary.fr}.`,
      en: `${firstName} is a Silver-certified practicant at Concorde Logistics. ${input.completedMissionCount} mission(s) completed · active chapter: ${careerSignal.primary.en}.`,
    };
  }

  if (input.modulesCompleted.length === 0 && input.completedMissionCount === 0) {
    return {
      fr: `${firstName} débute son affectation TEC.LOG au CDC Concorde Logistics. Chapitre 1 — prouver une exécution conforme sous supervision.`,
      en: `${firstName} is beginning the TEC.LOG assignment at the Concorde Logistics CDC. Chapter 1 — prove compliant execution under supervision.`,
    };
  }

  return {
    fr: `${firstName} progresse chez Concorde Logistics (${input.completedMissionCount} mission(s) complétée(s)). Signal de carrière actuel : ${careerSignal.primary.fr}. Les signaux de carrière sont motivationnels — ils ne remplacent pas Silver/Gold.`,
    en: `${firstName} is progressing at Concorde Logistics (${input.completedMissionCount} mission(s) completed). Current career signal: ${careerSignal.primary.en}. Career signals are motivational — they do not replace Silver/Gold.`,
  };
}

function resolveCurrentAssignment(
  activeModuleId: number,
  evalRuns: RunSnapshot[],
  officialScnByModule: Record<number, string[]>
): EmployeeProfileCurrentAssignment {
  const inProgress = evalRuns.find((r) => r.status === "in_progress");
  if (inProgress) {
    const chapter = CAREER_CHAPTER_LABELS[activeModuleId];
    return {
      scnCode: inProgress.scnCode,
      label: chapter,
      missionTitle: inProgress.missionTitle,
      runId: inProgress.runId,
      status: "active",
    };
  }

  const moduleScns = officialScnByModule[activeModuleId] ?? [];
  const completedScns = new Set(
    evalRuns.filter((r) => r.status === "completed").map((r) => r.scnCode)
  );
  const nextScn = moduleScns.find((scn) => !completedScns.has(scn));
  if (nextScn) {
    const runForScn = evalRuns.find((r) => r.scnCode === nextScn);
    const chapter = CAREER_CHAPTER_LABELS[activeModuleId];
    return {
      scnCode: nextScn,
      label: chapter,
      missionTitle: runForScn?.missionTitle ?? null,
      runId: null,
      status: "available",
    };
  }

  return {
    scnCode: null,
    label: CAREER_CHAPTER_LABELS[activeModuleId],
    missionTitle: null,
    runId: null,
    status: "none",
  };
}

function buildCompletedMissions(evalRuns: RunSnapshot[]): EmployeeProfileMission[] {
  const byScn = new Map<string, EmployeeProfileMission>();

  for (const run of evalRuns) {
    if (run.status !== "completed" || run.isDemo) continue;
    const existing = byScn.get(run.scnCode);
    if (!existing || (run.score ?? 0) > (existing.score ?? 0)) {
      byScn.set(run.scnCode, {
        scnCode: run.scnCode,
        missionTitle: run.missionTitle,
        moduleId: run.moduleId,
        status: "completed",
        completedAt: run.completedAt,
        score: run.score,
        runId: run.runId,
      });
    }
  }

  return Array.from(byScn.values()).sort((a, b) => {
    if (a.moduleId !== b.moduleId) return a.moduleId - b.moduleId;
    return a.scnCode.localeCompare(b.scnCode);
  });
}

/** Pure assembly — RC20-A.2 read-path derivation (no persistence) */
export function assembleEmployeeProfile(
  input: AssembleEmployeeProfileInput,
  officialScnByModule: Record<number, string[]> = {
    1: ["SCN-001", "SCN-002", "SCN-003", "SCN-004", "SCN-005"],
    2: ["SCN-006", "SCN-007", "SCN-008"],
    3: ["SCN-009", "SCN-010", "SCN-011"],
    4: ["SCN-012", "SCN-013", "SCN-014"],
    5: ["SCN-015", "SCN-016", "SCN-017"],
  }
): EmployeeProfilePayload {
  const modulesCompleted = input.moduleProgress
    .filter((m) => m.passed || m.teacherValidated)
    .map((m) => m.moduleId)
    .sort((a, b) => a - b);

  const activeModuleId = resolveActiveModuleId(input.moduleProgress);
  const evalRuns = input.runs.filter((r) => !r.isDemo);
  const currentAssignment = resolveCurrentAssignment(activeModuleId, evalRuns, officialScnByModule);
  const assignmentScn = currentAssignment.scnCode ?? undefined;

  const department = resolveDepartmentForModule(activeModuleId, assignmentScn);
  const supervisor = resolveSupervisorForModule(activeModuleId, assignmentScn);
  const completedMissions = buildCompletedMissions(evalRuns);
  const competencies = buildCompetencies(modulesCompleted);

  const silverCertified = input.silverCertified ?? false;
  const goldCertified = input.goldCertified ?? false;

  return {
    assembledAt: new Date().toISOString(),
    employeeId: deriveEmployeeId(input.userId, input.studentNumber),
    displayName: input.displayName,
    department,
    supervisor,
    careerChapter: {
      moduleId: activeModuleId,
      label: CAREER_CHAPTER_LABELS[activeModuleId],
    },
    completedMissions,
    competencies,
    currentAssignment,
    professionalSummary: buildProfessionalSummary({
      displayName: input.displayName,
      modulesCompleted,
      completedMissionCount: completedMissions.length,
      activeModuleId,
      silverCertified,
      goldCertified,
    }),
    certificationStatus: { silverCertified, goldCertified },
  };
}
