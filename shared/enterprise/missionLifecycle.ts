/** RC20-A.3 — Mission Lifecycle phase resolution (Architecture Foundation v1.0) */

export type MissionLifecyclePhase = "briefing" | "live" | "closure";

export interface MissionLifecycleInput {
  runStatus: string;
  completedStepsCount: number;
}

export interface MissionLifecyclePhaseMeta {
  phase: MissionLifecyclePhase;
  labelFr: string;
  labelEn: string;
  guidanceFr: string;
  guidanceEn: string;
  sheetBannerFr: string;
  sheetBannerEn: string;
}

const PHASE_ORDER: MissionLifecyclePhase[] = ["briefing", "live", "closure"];

const PHASE_META: Record<MissionLifecyclePhase, Omit<MissionLifecyclePhaseMeta, "phase">> = {
  briefing: {
    labelFr: "Briefing",
    labelEn: "Briefing",
    guidanceFr:
      "Lisez la fiche de mission avant d'exécuter la première étape — le superviseur attend votre compréhension du contexte d'affaires.",
    guidanceEn:
      "Read the mission sheet before executing the first step — your supervisor expects you to understand the business context.",
    sheetBannerFr: "Phase briefing — contexte opérationnel et mandat professionnel",
    sheetBannerEn: "Briefing phase — operational context and professional mandate",
  },
  live: {
    labelFr: "Mission en cours",
    labelEn: "Live mission",
    guidanceFr:
      "Mission active au CDC — consultez la fiche de mission au besoin pendant l'exécution.",
    guidanceEn:
      "Active mission at the CDC — refer to the mission sheet as needed during execution.",
    sheetBannerFr: "Mission en cours — référence opérationnelle",
    sheetBannerEn: "Live mission — operational reference",
  },
  closure: {
    labelFr: "Clôture",
    labelEn: "Closure",
    guidanceFr:
      "Mission terminée — consultez le débrief professionnel pour consolider le résultat d'affaires.",
    guidanceEn:
      "Mission complete — review the professional debrief to consolidate the business outcome.",
    sheetBannerFr: "Clôture — consolidation du résultat d'affaires",
    sheetBannerEn: "Closure — business outcome consolidation",
  },
};

/** Derives lifecycle phase from run state only — no engine or scoring mutation. */
export function resolveMissionLifecyclePhase(input: MissionLifecycleInput): MissionLifecyclePhase {
  if (input.runStatus === "completed") return "closure";
  if (input.completedStepsCount === 0) return "briefing";
  return "live";
}

export function getMissionLifecyclePhaseMeta(phase: MissionLifecyclePhase): MissionLifecyclePhaseMeta {
  return { phase, ...PHASE_META[phase] };
}

export function getMissionLifecyclePhaseOrder(): readonly MissionLifecyclePhase[] {
  return PHASE_ORDER;
}

export function pickMissionLifecycleLanguage(
  language: "FR" | "EN",
  meta: MissionLifecyclePhaseMeta,
  field: "label" | "guidance" | "sheetBanner",
): string {
  const isFr = language === "FR";
  if (field === "label") return isFr ? meta.labelFr : meta.labelEn;
  if (field === "guidance") return isFr ? meta.guidanceFr : meta.guidanceEn;
  return isFr ? meta.sheetBannerFr : meta.sheetBannerEn;
}
