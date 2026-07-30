import type { FormativeExerciseId, FormativeExerciseMeta } from "./types";

export const FORMATIVE_EXERCISE_CATALOG: Record<FormativeExerciseId, FormativeExerciseMeta> = {
  "M4-PREP-KPI-RESPONSE": {
    id: "M4-PREP-KPI-RESPONSE",
    moduleId: 4,
    kind: "preparation",
    version: 1,
    title: {
      fr: "Préparation analytique — Construire le raisonnement KPI",
      en: "Analytical preparation — Build the KPI reasoning",
    },
    subtitle: {
      fr: "Structurez un raisonnement professionnel avant vos missions — sans rédaction.",
      en: "Structure professional reasoning before your missions — no writing.",
    },
    chain: {
      fr: "DONNÉE → CLASSIFICATION → RISQUE → DÉCISION → ACTION → SUIVI",
      en: "DATA → CLASSIFICATION → RISK → DECISION → ACTION → FOLLOW-UP",
    },
    duration: { fr: "15–20 min", en: "15–20 min" },
    routeSegment: "M4-PREP-KPI-RESPONSE",
  },
  "M4-CONS-SAME-KPI-DIFF-DECISION": {
    id: "M4-CONS-SAME-KPI-DIFF-DECISION",
    moduleId: 4,
    kind: "consolidation",
    version: 1,
    title: {
      fr: "Consolidation M4 — Même KPI, décision différente",
      en: "M4 consolidation — Same KPI, different decision",
    },
    subtitle: {
      fr: "Transférez votre raisonnement vers une situation nouvelle.",
      en: "Transfer your reasoning to a new situation.",
    },
    chain: {
      fr: "DONNÉE → CLASSIFICATION → RISQUE → DÉCISION → ACTION → SUIVI",
      en: "DATA → CLASSIFICATION → RISK → DECISION → ACTION → FOLLOW-UP",
    },
    duration: { fr: "20–25 min", en: "20–25 min" },
    routeSegment: "M4-CONS-SAME-KPI-DIFF-DECISION",
  },
  "M5-PREP-EVIDENCE-TO-DECISION": {
    id: "M5-PREP-EVIDENCE-TO-DECISION",
    moduleId: 5,
    kind: "preparation",
    version: 2,
    title: {
      fr: "Pré-M5 — Lire les preuves avant de décider",
      en: "Pré-M5 — Read the evidence before deciding",
    },
    subtitle: {
      fr: "Après le quiz M5 : ACTION → PREUVE → KPI → DIAGNOSTIC → DÉCISION → SUIVI — sans rédaction.",
      en: "After Quiz M5: ACTION → EVIDENCE → KPI → DIAGNOSTIC → DECISION → FOLLOW-UP — no writing.",
    },
    chain: {
      fr: "ACTION → PREUVE → KPI → DIAGNOSTIC → DÉCISION → SUIVI",
      en: "ACTION → EVIDENCE → KPI → DIAGNOSTIC → DECISION → FOLLOW-UP",
    },
    duration: { fr: "15–20 min", en: "15–20 min" },
    routeSegment: "M5-PREP-EVIDENCE-TO-DECISION",
  },
  "M5-CONS-FULL-REASONING": {
    id: "M5-CONS-FULL-REASONING",
    moduleId: 5,
    kind: "consolidation",
    version: 2,
    title: {
      fr: "Post-M5 — Débriefer le quart de clôture",
      en: "Post-M5 — Debrief the closing shift",
    },
    subtitle: {
      fr: "Consolidez : ce qui s'est passé · pourquoi · quelles preuves · quelle décision · quoi changer au prochain quart.",
      en: "Consolidate: what happened · why · which evidence · which decision · what to change next shift.",
    },
    chain: {
      fr: "EXÉCUTER → MESURER → RÉCONCILIER → ARBITRER → DÉFENDRE",
      en: "EXECUTE → MEASURE → RECONCILE → ARBITRATE → DEFEND",
    },
    duration: { fr: "20–25 min", en: "20–25 min" },
    routeSegment: "M5-CONS-FULL-REASONING",
  },
};

export function getFormativeExercisesForModule(moduleId: number): FormativeExerciseMeta[] {
  return Object.values(FORMATIVE_EXERCISE_CATALOG).filter((e) => e.moduleId === moduleId);
}

export function getFormativeExerciseMeta(id: FormativeExerciseId): FormativeExerciseMeta {
  return FORMATIVE_EXERCISE_CATALOG[id];
}

export function isFormativeExerciseId(value: string): value is FormativeExerciseId {
  return value in FORMATIVE_EXERCISE_CATALOG;
}

export function formativeExercisePath(moduleId: 4 | 5, exerciseId: FormativeExerciseId): string {
  return `/student/module${moduleId}/formative/${exerciseId}`;
}
