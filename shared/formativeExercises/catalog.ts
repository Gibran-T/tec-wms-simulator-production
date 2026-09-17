import type { FormativeExerciseId, FormativeExerciseMeta } from "./types";

export const FORMATIVE_EXERCISE_CATALOG: Record<FormativeExerciseId, FormativeExerciseMeta> = {
  "M1-PREP-RECEIVING-SEQUENCE": {
    id: "M1-PREP-RECEIVING-SEQUENCE",
    moduleId: 1,
    kind: "preparation",
    version: 1,
    title: {
      fr: "Pré-test M1 — Séquence de réception et disponibilité stock",
      en: "M1 pre-test — Receiving sequence and stock availability",
    },
    subtitle: {
      fr: "Diagnostiquez votre lecture du cycle PO → GR → putaway avant les missions.",
      en: "Diagnose your reading of the PO → GR → putaway cycle before the missions.",
    },
    chain: {
      fr: "PO → GR → CONTRÔLE → PUTAWAY → STOCK DISPONIBLE",
      en: "PO → GR → CHECK → PUTAWAY → AVAILABLE STOCK",
    },
    duration: { fr: "10–15 min", en: "10–15 min" },
    routeSegment: "M1-PREP-RECEIVING-SEQUENCE",
  },
  "M1-CONS-OPERATIONAL-DECISION": {
    id: "M1-CONS-OPERATIONAL-DECISION",
    moduleId: 1,
    kind: "consolidation",
    version: 1,
    title: {
      fr: "Post-test M1 — Décision opérationnelle après les missions",
      en: "M1 post-test — Operational decision after the missions",
    },
    subtitle: {
      fr: "Mesurez l’évolution de votre jugement sur les issues M1.",
      en: "Measure how your judgment evolved on M1 issues.",
    },
    chain: {
      fr: "ISSUE → RÈGLE → DÉCISION → CONSÉQUENCE → CONFORMITÉ",
      en: "ISSUE → RULE → DECISION → CONSEQUENCE → COMPLIANCE",
    },
    duration: { fr: "10–15 min", en: "10–15 min" },
    routeSegment: "M1-CONS-OPERATIONAL-DECISION",
  },
  "M2-PREP-PUTAWAY-FIFO": {
    id: "M2-PREP-PUTAWAY-FIFO",
    moduleId: 2,
    kind: "preparation",
    version: 1,
    title: {
      fr: "Pré-test M2 — Rangement, capacité et FIFO",
      en: "M2 pre-test — Putaway, capacity and FIFO",
    },
    subtitle: {
      fr: "Diagnostiquez vos règles d’exécution d’entrepôt avant les missions.",
      en: "Diagnose your warehouse execution rules before the missions.",
    },
    chain: {
      fr: "QUAI → ZONE → CAPACITÉ BIN → FIFO → PRÉCISION",
      en: "DOCK → ZONE → BIN CAPACITY → FIFO → ACCURACY",
    },
    duration: { fr: "10–15 min", en: "10–15 min" },
    routeSegment: "M2-PREP-PUTAWAY-FIFO",
  },
  "M2-CONS-EXECUTION-DECISION": {
    id: "M2-CONS-EXECUTION-DECISION",
    moduleId: 2,
    kind: "consolidation",
    version: 1,
    title: {
      fr: "Post-test M2 — Décision d’exécution après les missions",
      en: "M2 post-test — Execution decision after the missions",
    },
    subtitle: {
      fr: "Transférez FIFO, capacité et localisation vers une situation nouvelle.",
      en: "Transfer FIFO, capacity and location rules to a new situation.",
    },
    chain: {
      fr: "ISSUE → LOCALISATION → FIFO → CAPACITÉ → DÉCISION",
      en: "ISSUE → LOCATION → FIFO → CAPACITY → DECISION",
    },
    duration: { fr: "10–15 min", en: "10–15 min" },
    routeSegment: "M2-CONS-EXECUTION-DECISION",
  },
  "M3-PREP-INVENTORY-CONTROL": {
    id: "M3-PREP-INVENTORY-CONTROL",
    moduleId: 3,
    kind: "preparation",
    version: 1,
    title: {
      fr: "Pré-test M3 — Comptage, écart et réapprovisionnement",
      en: "M3 pre-test — Count, variance and replenishment",
    },
    subtitle: {
      fr: "Diagnostiquez votre lecture du contrôle d’inventaire avant les missions.",
      en: "Diagnose your inventory-control reading before the missions.",
    },
    chain: {
      fr: "CC → ÉCART → RÉCONCILIATION → ADJ → MIN/MAX",
      en: "CC → VARIANCE → RECONCILIATION → ADJ → MIN/MAX",
    },
    duration: { fr: "10–15 min", en: "10–15 min" },
    routeSegment: "M3-PREP-INVENTORY-CONTROL",
  },
  "M3-CONS-VARIANCE-REPLENISH": {
    id: "M3-CONS-VARIANCE-REPLENISH",
    moduleId: 3,
    kind: "consolidation",
    version: 1,
    title: {
      fr: "Post-test M3 — Écart, ajustement et réappro après les missions",
      en: "M3 post-test — Variance, adjustment and replenishment after missions",
    },
    subtitle: {
      fr: "Mesurez l’évolution de vos décisions de contrôle d’inventaire.",
      en: "Measure how your inventory-control decisions evolved.",
    },
    chain: {
      fr: "PREUVE PHYSIQUE → ÉCART → ADJ → PARAMÈTRES → SUIVI",
      en: "PHYSICAL EVIDENCE → VARIANCE → ADJ → PARAMETERS → FOLLOW-UP",
    },
    duration: { fr: "10–15 min", en: "10–15 min" },
    routeSegment: "M3-CONS-VARIANCE-REPLENISH",
  },
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

export function formativeExercisePath(
  moduleId: 1 | 2 | 3 | 4 | 5,
  exerciseId: FormativeExerciseId,
): string {
  return `/student/module${moduleId}/formative/${exerciseId}`;
}
