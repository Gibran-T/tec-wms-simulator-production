import type { LocalizedText } from "./types";

export type ColorCode = "vert" | "ambre" | "rouge" | "bleu";

export const COLOR_LABELS: Record<ColorCode, LocalizedText> = {
  vert: { fr: "Vert — conforme / décision possible", en: "Green — compliant / decision possible" },
  ambre: { fr: "Ambre — à surveiller / vérification", en: "Amber — watch / verification needed" },
  rouge: { fr: "Rouge — critique / bloquant", en: "Red — critical / blocking" },
  bleu: { fr: "Bleu — donnée / preuve neutre", en: "Blue — neutral data / evidence" },
};

export const M4_LAYERS = [
  "donnee",
  "classification",
  "risque",
  "decision",
  "action",
  "suivi",
] as const;

export type M4Layer = (typeof M4_LAYERS)[number];

export const M4_LAYER_LABELS: Record<M4Layer, LocalizedText> = {
  donnee: { fr: "Donnée", en: "Data" },
  classification: { fr: "Classification", en: "Classification" },
  risque: { fr: "Risque", en: "Risk" },
  decision: { fr: "Décision", en: "Decision" },
  action: { fr: "Action", en: "Action" },
  suivi: { fr: "Suivi", en: "Follow-up" },
};

/** M4 Prep — block 1 */
export const M4_PREP_FRAGMENTS: Array<{
  id: string;
  text: LocalizedText;
  layer: M4Layer;
}> = [
  { id: "f1", text: { fr: "OTIF 95 %", en: "OTIF 95%" }, layer: "donnee" },
  {
    id: "f2",
    text: { fr: "Excellent au seuil", en: "Excellent at threshold" },
    layer: "classification",
  },
  {
    id: "f3",
    text: { fr: "Erreurs picking en augmentation", en: "Picking errors rising" },
    layer: "risque",
  },
  {
    id: "f4",
    text: { fr: "Protéger le niveau de service", en: "Protect the service level" },
    layer: "decision",
  },
  {
    id: "f5",
    text: {
      fr: "Mettre en place une checklist picking/réception",
      en: "Implement a picking/receiving checklist",
    },
    layer: "action",
  },
  {
    id: "f6",
    text: {
      fr: "Suivre OTIF et erreurs chaque semaine",
      en: "Track OTIF and errors weekly",
    },
    layer: "suivi",
  },
];

/** M4 Prep — block 3 */
export const M4_PREP_MISSING: Array<{
  id: string;
  prompt: LocalizedText;
  expectedMissing: string[];
  explanation: LocalizedText;
}> = [
  {
    id: "m1",
    prompt: {
      fr: "Structure : « La rotation est de 6×, dans la bande normale. »",
      en: "Structure: “Turnover is 6×, within the normal band.”",
    },
    expectedMissing: ["decision", "suivi"],
    explanation: {
      fr: "Donnée et classification sont là ; décision et suivi manquent.",
      en: "Data and classification are present; decision and follow-up are missing.",
    },
  },
  {
    id: "m2",
    prompt: {
      fr: "Structure : « Je recommande une formation. »",
      en: "Structure: “I recommend training.”",
    },
    expectedMissing: ["donnee", "classification", "risque", "suivi"],
    explanation: {
      fr: "Une action seule ne suffit pas : preuve, classification, risque et suivi manquent.",
      en: "An action alone is not enough: evidence, classification, risk and follow-up are missing.",
    },
  },
];

export const M4_PREP_MISSING_OPTIONS: Array<{ id: string; label: LocalizedText }> = [
  { id: "donnee", label: { fr: "Donnée", en: "Data" } },
  { id: "classification", label: { fr: "Classification", en: "Classification" } },
  { id: "risque", label: { fr: "Risque", en: "Risk" } },
  { id: "decision", label: { fr: "Décision", en: "Decision" } },
  { id: "action", label: { fr: "Action", en: "Action" } },
  { id: "suivi", label: { fr: "Suivi", en: "Follow-up" } },
];

/** M4 Prep — block 4: KPI → professional question */
export const M4_PREP_KPI_QUESTIONS: Array<{
  id: string;
  kpi: LocalizedText;
  questionId: string;
}> = [
  {
    id: "k_rotation",
    kpi: { fr: "Rotation des stocks", en: "Inventory turnover" },
    questionId: "q_rotation",
  },
  {
    id: "k_otif",
    kpi: { fr: "OTIF", en: "OTIF" },
    questionId: "q_otif",
  },
  {
    id: "k_erreurs",
    kpi: { fr: "Taux d’erreurs", en: "Error rate" },
    questionId: "q_erreurs",
  },
  {
    id: "k_delai",
    kpi: { fr: "Délai fournisseur", en: "Supplier lead time" },
    questionId: "q_delai",
  },
  {
    id: "k_capital",
    kpi: { fr: "Capital immobilisé", en: "Immobilized capital" },
    questionId: "q_capital",
  },
  {
    id: "k_multi",
    kpi: { fr: "Lecture multi-KPI", en: "Multi-KPI reading" },
    questionId: "q_multi",
  },
];

export const M4_PREP_KPI_QUESTION_OPTIONS: Array<{ id: string; label: LocalizedText }> = [
  {
    id: "q_rotation",
    label: {
      fr: "Le stock tourne-t-il assez vite sans surstock ?",
      en: "Is stock turning fast enough without overstock?",
    },
  },
  {
    id: "q_otif",
    label: {
      fr: "Livrons-nous complet et à temps selon l’engagement ?",
      en: "Do we deliver complete and on time per commitment?",
    },
  },
  {
    id: "q_erreurs",
    label: {
      fr: "La qualité d’exécution met-elle le service en danger ?",
      en: "Does execution quality endanger service?",
    },
  },
  {
    id: "q_delai",
    label: {
      fr: "Le délai d’approvisionnement limite-t-il notre réactivité ?",
      en: "Does supply lead time limit our responsiveness?",
    },
  },
  {
    id: "q_capital",
    label: {
      fr: "Combien de liquidité est immobilisée dans le stock ?",
      en: "How much cash is tied up in inventory?",
    },
  },
  {
    id: "q_multi",
    label: {
      fr: "Quel KPI doit primer quand plusieurs signaux divergent ?",
      en: "Which KPI should lead when several signals diverge?",
    },
  },
];

/** M4 Consolidation case (display only) */
export const M4_CONS_FACTS: LocalizedText = {
  fr: "Rotation 8× · OTIF 97 % · Erreurs 6 % · Délai 4 j · Capital 52 000 $ · Une seule initiative financée.",
  en: "Turnover 8× · OTIF 97% · Errors 6% · Lead time 4 days · Capital $52,000 · Only one funded initiative.",
};

/** M4 Cons — block 1: KPI color classification */
export const M4_CONS_KPI_COLORS: Array<{
  id: string;
  label: LocalizedText;
  color: ColorCode;
}> = [
  { id: "rotation", label: { fr: "Rotation 8×", en: "Turnover 8×" }, color: "vert" },
  { id: "otif", label: { fr: "OTIF 97 %", en: "OTIF 97%" }, color: "vert" },
  { id: "erreurs", label: { fr: "Erreurs 6 %", en: "Errors 6%" }, color: "rouge" },
  { id: "delai", label: { fr: "Délai 4 jours", en: "Lead time 4 days" }, color: "ambre" },
  { id: "capital", label: { fr: "Capital 52 000 $", en: "Capital $52,000" }, color: "ambre" },
];

export const M4_CONS_COLOR_OPTIONS: Array<{ id: ColorCode; label: LocalizedText }> = [
  { id: "vert", label: COLOR_LABELS.vert },
  { id: "ambre", label: COLOR_LABELS.ambre },
  { id: "rouge", label: COLOR_LABELS.rouge },
];

/** M4 Cons — block 2 */
export const M4_CONS_PRIORITY_RISK = {
  correctId: "qualite",
  options: [
    { id: "qualite", label: { fr: "Risque qualité (erreurs)", en: "Quality risk (errors)" } },
    { id: "stock", label: { fr: "Risque surstock global", en: "Global overstock risk" } },
    { id: "otif", label: { fr: "Risque OTIF insuffisant", en: "Insufficient OTIF risk" } },
    { id: "delai", label: { fr: "Risque délai fournisseur", en: "Supplier lead-time risk" } },
  ],
} as const;

/** M4 Cons — block 3 true/false */
export const M4_CONS_TRUE_FALSE: Array<{
  id: string;
  statement: LocalizedText;
  answer: boolean;
  why: LocalizedText;
  rule: LocalizedText;
}> = [
  {
    id: "tf1",
    statement: {
      fr: "Un OTIF à 97 % élimine le besoin de traiter les erreurs à 6 %.",
      en: "OTIF at 97% removes the need to address a 6% error rate.",
    },
    answer: false,
    why: {
      fr: "Incorrect : un KPI fort n’annule pas un risque qualité critique.",
      en: "Incorrect: a strong KPI does not cancel a critical quality risk.",
    },
    rule: {
      fr: "Règle : prioriser le risque qui menace le plus le service durable.",
      en: "Rule: prioritize the risk that most threatens durable service.",
    },
  },
  {
    id: "tf2",
    statement: {
      fr: "Avec une seule initiative, un destock global n’est pas le premier levier ici.",
      en: "With one initiative, a global destock is not the first lever here.",
    },
    answer: true,
    why: {
      fr: "Correct : la rotation est normale ; la priorité est la qualité.",
      en: "Correct: turnover is normal; quality is the priority.",
    },
    rule: {
      fr: "Règle : ne pas financer un mauvais levier quand un signal critique domine.",
      en: "Rule: do not fund a wrong lever when a critical signal dominates.",
    },
  },
  {
    id: "tf3",
    statement: {
      fr: "Le suivi doit inclure OTIF et erreurs après une action qualité.",
      en: "Follow-up should include OTIF and errors after a quality action.",
    },
    answer: true,
    why: {
      fr: "Correct : le suivi couple service et qualité.",
      en: "Correct: follow-up pairs service and quality.",
    },
    rule: {
      fr: "Règle : toute décision comporte des KPI de suivi explicites.",
      en: "Rule: every decision includes explicit follow-up KPIs.",
    },
  },
];

/** M4 Cons — block 4 action classification */
export const M4_CONS_ACTIONS: Array<{
  id: string;
  label: LocalizedText;
  bucket: "priorite" | "suivi" | "mauvais";
}> = [
  {
    id: "a1",
    label: {
      fr: "Checklist qualité picking / contrôles",
      en: "Picking quality checklist / controls",
    },
    bucket: "priorite",
  },
  {
    id: "a2",
    label: {
      fr: "Suivre OTIF + erreurs sur 2–4 semaines",
      en: "Track OTIF + errors over 2–4 weeks",
    },
    bucket: "suivi",
  },
  {
    id: "a3",
    label: {
      fr: "Destock global immédiat de tout le portefeuille",
      en: "Immediate global destock of the whole portfolio",
    },
    bucket: "mauvais",
  },
  {
    id: "a4",
    label: {
      fr: "Formation ciblée sur les zones d’erreurs",
      en: "Targeted training on error zones",
    },
    bucket: "priorite",
  },
];

export const M4_CONS_ACTION_BUCKETS: Array<{
  id: "priorite" | "suivi" | "mauvais";
  label: LocalizedText;
}> = [
  { id: "priorite", label: { fr: "Priorité à financer", en: "Priority to fund" } },
  { id: "suivi", label: { fr: "Suivi", en: "Follow-up" } },
  { id: "mauvais", label: { fr: "Mauvais levier", en: "Wrong lever" } },
];

/** M4 Cons — block 5 decision ↔ justification */
export const M4_CONS_DECISION_PAIRS: Array<{
  id: string;
  decision: LocalizedText;
  justificationId: string;
}> = [
  {
    id: "d1",
    decision: {
      fr: "Financer une initiative qualité",
      en: "Fund a quality initiative",
    },
    justificationId: "j_erreurs",
  },
  {
    id: "d2",
    decision: {
      fr: "Ne pas prioriser un destock global",
      en: "Do not prioritize a global destock",
    },
    justificationId: "j_rotation",
  },
  {
    id: "d3",
    decision: {
      fr: "Suivre OTIF et erreurs",
      en: "Monitor OTIF and errors",
    },
    justificationId: "j_suivi",
  },
];

export const M4_CONS_JUSTIFICATIONS: Array<{ id: string; label: LocalizedText }> = [
  {
    id: "j_erreurs",
    label: {
      fr: "Les erreurs à 6 % sont le signal critique malgré un OTIF fort.",
      en: "Errors at 6% are the critical signal despite strong OTIF.",
    },
  },
  {
    id: "j_rotation",
    label: {
      fr: "La rotation 8× est normale ; ce n’est pas le premier levier.",
      en: "Turnover at 8× is normal; it is not the first lever.",
    },
  },
  {
    id: "j_suivi",
    label: {
      fr: "Il faut mesurer l’effet sur le service et la qualité.",
      en: "The effect on service and quality must be measured.",
    },
  },
];

/** M5 Prep — block 1 traffic light */
export const M5_PREP_TRAFFIC: Array<{
  id: string;
  prompt: LocalizedText;
  color: ColorCode;
}> = [
  {
    id: "t1",
    prompt: {
      fr: "Réception et putaway terminés, aucune variance ouverte.",
      en: "Receiving and putaway complete, no open variance.",
    },
    color: "vert",
  },
  {
    id: "t2",
    prompt: {
      fr: "Écart −5 constaté, aucun ajustement posté.",
      en: "Variance −5 observed, no adjustment posted.",
    },
    color: "rouge",
  },
  {
    id: "t3",
    prompt: {
      fr: "Stock système connu, comptage physique non fait.",
      en: "System stock known, physical count not done.",
    },
    color: "ambre",
  },
  {
    id: "t4",
    prompt: {
      fr: "Écart détecté ; réconciliation obligatoire avant Q.",
      en: "Gap detected; reconciliation mandatory before Q.",
    },
    color: "rouge",
  },
];

export const M5_TRAFFIC_OPTIONS: Array<{ id: ColorCode; label: LocalizedText }> = [
  { id: "vert", label: { fr: "Vert — décision possible", en: "Green — decision possible" } },
  { id: "ambre", label: { fr: "Ambre — vérifier", en: "Amber — verify" } },
  { id: "rouge", label: { fr: "Rouge — décision bloquée", en: "Red — decision blocked" } },
];

/** M5 Prep — block 2 stock base */
export const M5_PREP_STOCK_BASE = {
  prompt: {
    fr: "Après réconciliation, quelle base utiliser pour interpréter Q ?",
    en: "After reconciliation, which base should be used to interpret Q?",
  },
  correctId: "corrige",
  options: [
    { id: "systeme", label: { fr: "Stock système", en: "System stock" } },
    { id: "physique", label: { fr: "Stock physique", en: "Physical stock" } },
    { id: "corrige", label: { fr: "Stock corrigé", en: "Corrected stock" } },
  ],
} as const;

/** M5 Prep — block 3 evidence → consequence */
export const M5_PREP_ASSOC: Array<{
  id: string;
  evidence: LocalizedText;
  consequenceId: string;
}> = [
  {
    id: "a1",
    evidence: {
      fr: "Opérations complètes, aucune variance",
      en: "Operations complete, no variance",
    },
    consequenceId: "c_ok",
  },
  {
    id: "a2",
    evidence: {
      fr: "Stock système 50 / stock physique 45",
      en: "System stock 50 / physical stock 45",
    },
    consequenceId: "c_verify",
  },
  {
    id: "a3",
    evidence: {
      fr: "Écart −5 non réconcilié",
      en: "Variance −5 not reconciled",
    },
    consequenceId: "c_block",
  },
  {
    id: "a4",
    evidence: { fr: "Stock corrigé 45 · minimum 10", en: "Corrected stock 45 · minimum 10" },
    consequenceId: "c_q0",
  },
  {
    id: "a5",
    evidence: {
      fr: "Service élevé avec erreurs à surveiller",
      en: "High service with errors to monitor",
    },
    consequenceId: "c_watch",
  },
];

export const M5_PREP_CONSEQUENCES: Array<{ id: string; label: LocalizedText }> = [
  {
    id: "c_ok",
    label: {
      fr: "Base fiable — décision possible",
      en: "Reliable base — decision possible",
    },
  },
  {
    id: "c_verify",
    label: {
      fr: "Écart détecté — vérification requise",
      en: "Gap detected — verification required",
    },
  },
  {
    id: "c_block",
    label: {
      fr: "Décision de stock bloquée",
      en: "Stock decision blocked",
    },
  },
  {
    id: "c_q0",
    label: {
      fr: "Q = 0 possible si stock ≥ minimum",
      en: "Q = 0 possible if stock ≥ minimum",
    },
  },
  {
    id: "c_watch",
    label: {
      fr: "Décision OK mais risque qualité à suivre",
      en: "Decision OK but quality risk to monitor",
    },
  },
];

/** M5 Prep — block 4 true/false */
export const M5_PREP_TRUE_FALSE: Array<{
  id: string;
  statement: LocalizedText;
  answer: boolean;
  why: LocalizedText;
  rule: LocalizedText;
}> = [
  {
    id: "tf1",
    statement: {
      fr: "Q = 0 est toujours une erreur de décision.",
      en: "Q = 0 is always a decision error.",
    },
    answer: false,
    why: {
      fr: "Incorrect : Q = 0 peut être valide si le stock corrigé ≥ minimum.",
      en: "Incorrect: Q = 0 can be valid if corrected stock ≥ minimum.",
    },
    rule: {
      fr: "Règle : comparer stock corrigé et minimum avant de décider Q.",
      en: "Rule: compare corrected stock and minimum before deciding Q.",
    },
  },
  {
    id: "tf2",
    statement: {
      fr: "Sans réconciliation, on ne doit pas finaliser Q sur un écart ouvert.",
      en: "Without reconciliation, Q should not be finalized on an open gap.",
    },
    answer: true,
    why: {
      fr: "Correct : un écart non traité bloque la décision.",
      en: "Correct: an untreated gap blocks the decision.",
    },
    rule: {
      fr: "Règle : preuve réconciliée avant décision de réapprovisionnement.",
      en: "Rule: reconciled evidence before replenishment decision.",
    },
  },
  {
    id: "tf3",
    statement: {
      fr: "Après ajustement, le stock corrigé remplace le stock système brut comme base.",
      en: "After adjustment, corrected stock replaces raw system stock as the base.",
    },
    answer: true,
    why: {
      fr: "Correct : la base post-réconciliation est le stock corrigé.",
      en: "Correct: the post-reconciliation base is corrected stock.",
    },
    rule: {
      fr: "Règle : décider sur la preuve la plus fiable après vérification.",
      en: "Rule: decide on the most reliable evidence after verification.",
    },
  },
];

/** M5 Consolidation case */
export const M5_CONS_FACTS: LocalizedText = {
  fr: "Réception terminée · Putaway terminé · Système 32 · Physique 29 · Écart −3 · Ajustement posté · Corrigé 29 · Min 20 · Max 70 · Q = 0 · Erreurs en hausse.",
  en: "Receiving done · Putaway done · System 32 · Physical 29 · Variance −3 · Adjustment posted · Corrected 29 · Min 20 · Max 70 · Q = 0 · Errors rising.",
};

/** M5 Cons — block 1 evidence colors */
export const M5_CONS_EVIDENCE_COLORS: Array<{
  id: string;
  label: LocalizedText;
  color: ColorCode;
}> = [
  {
    id: "ops",
    label: { fr: "Réception + putaway terminés", en: "Receiving + putaway complete" },
    color: "vert",
  },
  {
    id: "ajuste",
    label: { fr: "Ajustement posté / écart traité", en: "Adjustment posted / gap handled" },
    color: "vert",
  },
  {
    id: "q0",
    label: { fr: "Q = 0 avec stock corrigé 29 ≥ min 20", en: "Q = 0 with corrected 29 ≥ min 20" },
    color: "vert",
  },
  {
    id: "erreurs",
    label: { fr: "Taux d’erreurs en hausse", en: "Rising error rate" },
    color: "ambre",
  },
  {
    id: "systeme_brut",
    label: {
      fr: "Utiliser 32 (système brut) comme base après ajustement",
      en: "Use 32 (raw system) as base after adjustment",
    },
    color: "rouge",
  },
];

/** M5 Cons — block 2 ordering */
export const M5_CONS_PATH = [
  "ecart",
  "ajustement",
  "corrige",
  "minimum",
  "q",
  "suivi",
] as const;

export const M5_CONS_PATH_LABELS: Record<(typeof M5_CONS_PATH)[number], LocalizedText> = {
  ecart: { fr: "Écart constaté", en: "Variance observed" },
  ajustement: { fr: "Ajustement posté", en: "Adjustment posted" },
  corrige: { fr: "Stock corrigé", en: "Corrected stock" },
  minimum: { fr: "Comparer au minimum", en: "Compare to minimum" },
  q: { fr: "Déterminer Q", en: "Determine Q" },
  suivi: { fr: "Suivi", en: "Follow-up" },
};

/** M5 Cons — block 3 evidence → decision */
export const M5_CONS_ASSOC: Array<{
  id: string;
  evidence: LocalizedText;
  decisionId: string;
}> = [
  {
    id: "e1",
    evidence: {
      fr: "Ajustement posté, stock corrigé 29",
      en: "Adjustment posted, corrected stock 29",
    },
    decisionId: "dec_base",
  },
  {
    id: "e2",
    evidence: { fr: "Minimum 20 · stock corrigé 29", en: "Minimum 20 · corrected stock 29" },
    decisionId: "dec_q0",
  },
  {
    id: "e3",
    evidence: { fr: "Erreurs en hausse", en: "Rising errors" },
    decisionId: "dec_watch",
  },
  {
    id: "e4",
    evidence: {
      fr: "Écart encore ouvert, aucun ajustement",
      en: "Gap still open, no adjustment",
    },
    decisionId: "dec_block",
  },
];

export const M5_CONS_DECISIONS: Array<{ id: string; label: LocalizedText }> = [
  {
    id: "dec_base",
    label: {
      fr: "Décision possible sur stock corrigé",
      en: "Decision possible on corrected stock",
    },
  },
  {
    id: "dec_q0",
    label: {
      fr: "Aucun réapprovisionnement (Q = 0)",
      en: "No replenishment (Q = 0)",
    },
  },
  {
    id: "dec_watch",
    label: {
      fr: "Maintenir Q = 0 et surveiller la qualité",
      en: "Keep Q = 0 and monitor quality",
    },
  },
  {
    id: "dec_block",
    label: {
      fr: "Bloquer Q jusqu’à réconciliation",
      en: "Block Q until reconciliation",
    },
  },
];

/** M5 Cons — block 4 true/false */
export const M5_CONS_TRUE_FALSE: Array<{
  id: string;
  statement: LocalizedText;
  answer: boolean;
  why: LocalizedText;
  rule: LocalizedText;
}> = [
  {
    id: "tf1",
    statement: {
      fr: "Dans ce run, Q = 0 est cohérent car 29 ≥ 20.",
      en: "In this run, Q = 0 is coherent because 29 ≥ 20.",
    },
    answer: true,
    why: {
      fr: "Correct : le besoin de réappro n’est pas déclenché.",
      en: "Correct: replenishment need is not triggered.",
    },
    rule: {
      fr: "Règle : Q dépend du stock corrigé vs minimum.",
      en: "Rule: Q depends on corrected stock vs minimum.",
    },
  },
  {
    id: "tf2",
    statement: {
      fr: "Les erreurs en hausse obligent à commander malgré Q = 0.",
      en: "Rising errors force an order despite Q = 0.",
    },
    answer: false,
    why: {
      fr: "Incorrect : le risque qualité se surveille ; il ne force pas Q > 0 ici.",
      en: "Incorrect: quality risk is monitored; it does not force Q > 0 here.",
    },
    rule: {
      fr: "Règle : séparer décision de stock et priorité qualité.",
      en: "Rule: separate stock decision from quality priority.",
    },
  },
  {
    id: "tf3",
    statement: {
      fr: "Après ajustement, la base reste le stock système 32.",
      en: "After adjustment, the base remains system stock 32.",
    },
    answer: false,
    why: {
      fr: "Incorrect : la base est le stock corrigé 29.",
      en: "Incorrect: the base is corrected stock 29.",
    },
    rule: {
      fr: "Règle : post-réconciliation, utiliser le stock corrigé.",
      en: "Rule: after reconciliation, use corrected stock.",
    },
  },
];

/** M5 Cons — block 5 action buckets */
export const M5_CONS_ACTIONS: Array<{
  id: string;
  label: LocalizedText;
  bucket: "maintenir" | "surveiller" | "rejeter";
}> = [
  {
    id: "x1",
    label: { fr: "Maintenir Q = 0", en: "Keep Q = 0" },
    bucket: "maintenir",
  },
  {
    id: "x2",
    label: {
      fr: "Surveiller erreurs / prochains comptages",
      en: "Monitor errors / next counts",
    },
    bucket: "surveiller",
  },
  {
    id: "x3",
    label: {
      fr: "Commander pour atteindre le maximum 70",
      en: "Order to reach maximum 70",
    },
    bucket: "rejeter",
  },
  {
    id: "x4",
    label: {
      fr: "Ignorer l’ajustement et décider sur 32",
      en: "Ignore adjustment and decide on 32",
    },
    bucket: "rejeter",
  },
];

export const M5_CONS_ACTION_BUCKETS: Array<{
  id: "maintenir" | "surveiller" | "rejeter";
  label: LocalizedText;
}> = [
  { id: "maintenir", label: { fr: "Maintenir", en: "Maintain" } },
  { id: "surveiller", label: { fr: "Surveiller", en: "Monitor" } },
  { id: "rejeter", label: { fr: "Rejeter", en: "Reject" } },
];
