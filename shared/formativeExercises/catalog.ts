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
    version: 1,
    title: {
      fr: "Préparation opérationnelle — Lire les preuves avant de décider",
      en: "Operational preparation — Read the evidence before deciding",
    },
    subtitle: {
      fr: "Validez votre lecture des preuves avant vos affectations — sans rédaction.",
      en: "Validate your reading of evidence before assignments — no writing.",
    },
    chain: {
      fr: "PREUVE → VÉRIFICATION → INTERPRÉTATION → DÉCISION → SUIVI",
      en: "EVIDENCE → VERIFICATION → INTERPRETATION → DECISION → FOLLOW-UP",
    },
    duration: { fr: "15–20 min", en: "15–20 min" },
    routeSegment: "M5-PREP-EVIDENCE-TO-DECISION",
  },
  "M5-CONS-FULL-REASONING": {
    id: "M5-CONS-FULL-REASONING",
    moduleId: 5,
    kind: "consolidation",
    version: 1,
    title: {
      fr: "Consolidation M5 — Produire le raisonnement complet",
      en: "M5 consolidation — Produce the full reasoning",
    },
    subtitle: {
      fr: "Analysez une nouvelle session sans assistance guidée.",
      en: "Analyze a new session without guided assistance.",
    },
    chain: {
      fr: "PREUVE → VÉRIFICATION → INTERPRÉTATION → DÉCISION → SUIVI",
      en: "EVIDENCE → VERIFICATION → INTERPRETATION → DECISION → FOLLOW-UP",
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
