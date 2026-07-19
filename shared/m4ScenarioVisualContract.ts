/**
 * M4 analytics visual + classroom contracts for SCN-012 / 013 / 014.
 * Display-only — does not alter scoring, thresholds, or student records.
 */

export type M4ScnCode = "SCN-012" | "SCN-013" | "SCN-014";

export type M4ClassroomCompanion = {
  kpiFr: string;
  kpiEn: string;
  decisionFr: string;
  decisionEn: string;
  actionFr: string;
  actionEn: string;
  followUpFr: string;
  followUpEn: string;
};

export type M4DebriefContract = {
  lectureFr: string;
  lectureEn: string;
  decisionFr: string;
  decisionEn: string;
  impactFr: string;
  impactEn: string;
  lessonFr: string;
  lessonEn: string;
};

export type M4VisualContract = {
  titleFr: string;
  titleEn: string;
  businessQuestionFr: string;
  businessQuestionEn: string;
  /** Primary KPI card ids (high visual priority). */
  primaryCardIds: string[];
  /** Secondary KPI card ids (lower visual priority). */
  secondaryCardIds: string[];
  mainInsightFr: string;
  mainInsightEn: string;
  decisionPromptFr: string;
  decisionPromptEn: string;
  dominantFocusFr: string;
  dominantFocusEn: string;
  classroom: M4ClassroomCompanion;
  debrief: M4DebriefContract;
};

/** Classroom reasoning chain — shared labels with Whiteboard pedagogy. */
export const M4_REASONING_CHAIN = [
  { fr: "DONNÉES", en: "DATA" },
  { fr: "KPI", en: "KPI" },
  { fr: "BANDE / CIBLE", en: "BAND / TARGET" },
  { fr: "RISQUE", en: "RISK" },
  { fr: "DÉCISION", en: "DECISION" },
  { fr: "ACTION", en: "ACTION" },
  { fr: "SUIVI", en: "FOLLOW-UP" },
] as const;

export const M4_VISUAL_CONTRACTS: Record<M4ScnCode, M4VisualContract> = {
  "SCN-012": {
    titleFr: "Rotation et capital immobilisé",
    titleEn: "Turnover and tied-up capital",
    businessQuestionFr: "Les 48 000 $ immobilisés sont-ils justifiés ?",
    businessQuestionEn: "Are the $48,000 tied up justified?",
    primaryCardIds: ["rotation", "capital"],
    secondaryCardIds: ["otif", "errors", "leadTime"],
    mainInsightFr: "Le portefeuille est normal à 6×, mais certains SKU sont sous la bande.",
    mainInsightEn: "The portfolio is normal at 6×, but some SKUs are below the band.",
    decisionPromptFr: "Maintenir globalement ou réduire tout le stock ?",
    decisionPromptEn: "Maintain globally or cut all stock?",
    dominantFocusFr: "ROTATION + CAPITAL + SKU LENTS",
    dominantFocusEn: "TURNOVER + CAPITAL + SLOW SKUs",
    classroom: {
      kpiFr: "Rotation / capital",
      kpiEn: "Turnover / capital",
      decisionFr: "Maintenir globalement",
      decisionEn: "Maintain globally",
      actionFr: "Revoir les SKU lents",
      actionEn: "Review slow SKUs",
      followUpFr: "Rotation et capital par SKU",
      followUpEn: "Turnover and capital by SKU",
    },
    debrief: {
      lectureFr: "Rotation 6× — bande normale",
      lectureEn: "Turnover 6× — normal band",
      decisionFr: "Maintien global + revue ciblée des SKU lents",
      decisionEn: "Global maintain + targeted slow-SKU review",
      impactFr: "Capital protégé sans créer de risque de rupture",
      impactEn: "Capital protected without creating stockout risk",
      lessonFr: "Une moyenne normale peut masquer des articles lents",
      lessonEn: "A normal average can hide slow-moving items",
    },
  },
  "SCN-013": {
    titleFr: "Service et qualité d'exécution",
    titleEn: "Service and execution quality",
    businessQuestionFr: "Un OTIF excellent suffit-il pour sécuriser le SLA ?",
    businessQuestionEn: "Is an excellent OTIF enough to secure the SLA?",
    primaryCardIds: ["otif", "errors"],
    secondaryCardIds: ["rotation", "capital", "leadTime"],
    mainInsightFr: "Le service est excellent, mais les erreurs peuvent fragiliser le résultat.",
    mainInsightEn: "Service is excellent, but errors can undermine the result.",
    decisionPromptFr: "Maintenir la politique de service et engager une action qualité ?",
    decisionPromptEn: "Maintain the service policy and launch a quality action?",
    dominantFocusFr: "OTIF + ERREURS + QUALITÉ",
    dominantFocusEn: "OTIF + ERRORS + QUALITY",
    classroom: {
      kpiFr: "OTIF / erreurs",
      kpiEn: "OTIF / errors",
      decisionFr: "Maintenir le service",
      decisionEn: "Maintain service",
      actionFr: "Amélioration qualité",
      actionEn: "Quality improvement",
      followUpFr: "OTIF et taux d'erreur",
      followUpEn: "OTIF and error rate",
    },
    debrief: {
      lectureFr: "OTIF 95 % excellent · erreurs 4 % acceptables",
      lectureEn: "OTIF 95% excellent · errors 4% acceptable",
      decisionFr: "Maintenir le service + action qualité ciblée",
      decisionEn: "Maintain service + targeted quality action",
      impactFr: "SLA protégé — risque d'exécution sous contrôle",
      impactEn: "SLA protected — execution risk under control",
      lessonFr: "Un tableau vert peut masquer une fragilité qualité",
      lessonEn: "A green dashboard can hide quality fragility",
    },
  },
  "SCN-014": {
    titleFr: "Arbitrage multi-KPI — comité S&OP",
    titleEn: "Multi-KPI trade-off — S&OP committee",
    businessQuestionFr: "Quelle initiative doit être financée en priorité ?",
    businessQuestionEn: "Which initiative should be funded first?",
    primaryCardIds: ["rotation", "otif", "errors", "leadTime", "capital"],
    secondaryCardIds: [],
    mainInsightFr: "Une seule initiative peut être financée — arbitrer qualité, capital et service.",
    mainInsightEn: "Only one initiative can be funded — trade off quality, capital, and service.",
    decisionPromptFr: "Priorité, action, compromis, responsable, horizon, KPI de suivi ?",
    decisionPromptEn: "Priority, action, trade-off, owner, horizon, follow-up KPI?",
    dominantFocusFr: "MULTI-KPI + PRIORITÉ + COMPROMIS",
    dominantFocusEn: "MULTI-KPI + PRIORITY + TRADE-OFF",
    classroom: {
      kpiFr: "Multi-KPI",
      kpiEn: "Multi-KPI",
      decisionFr: "Financer une priorité",
      decisionEn: "Fund one priority",
      actionFr: "Responsable nommé",
      actionEn: "Named owner",
      followUpFr: "Revue à 90 jours",
      followUpEn: "90-day review",
    },
    debrief: {
      lectureFr: "Portefeuille multi-KPI lu en comité S&OP",
      lectureEn: "Multi-KPI portfolio read in S&OP committee",
      decisionFr: "Priorité qualité — maintenir stock — revue 90 j",
      decisionEn: "Quality priority — maintain stock — 90-day review",
      impactFr: "Budget focalisé · capital et OTIF préservés",
      impactEn: "Budget focused · capital and OTIF preserved",
      lessonFr: "L'arbitrage explicite vaut mieux que l'optimisation mono-KPI",
      lessonEn: "Explicit trade-off beats single-KPI optimization",
    },
  },
};

export function isM4VisualScn(code: string | null | undefined): code is M4ScnCode {
  return code === "SCN-012" || code === "SCN-013" || code === "SCN-014";
}

export function getM4VisualContract(scnCode: string | null | undefined): M4VisualContract | null {
  if (!isM4VisualScn(scnCode)) return null;
  return M4_VISUAL_CONTRACTS[scnCode];
}
