import type { OfficialScnCode } from "../../../server/canonicalScenarios";

/** Steps that use the institutional analytical response component (M4 + M5). */
export const ANALYTICAL_ANSWER_STEPS = new Set([
  "kpi_rotation",
  "kpi_service",
  "kpi_diagnostic",
  "m5_decision",
]);

export function isAnalyticalAnswerStep(step: string | undefined | null): boolean {
  return ANALYTICAL_ANSWER_STEPS.has((step ?? "").toLowerCase());
}

type Bilingual = { fr: string; en: string };

type StepKey = "kpi_rotation" | "kpi_service" | "kpi_diagnostic" | "m5_decision";

/** SCN-specific question copy aligned with GUIDE_OFFICIEL_REPONSES_M4_M5.md and Documentation/M4|M5 audits. */
const SCN_STEP_QUESTIONS: Partial<Record<OfficialScnCode, Partial<Record<StepKey, Bilingual>>>> = {
  "SCN-013": {
    kpi_service: {
      fr: "Interpréter le taux de service OTIF (285 commandes livrées sur 300 = 95,0 %). Analysez si ce niveau est excellent, acceptable ou insuffisant selon les standards industrie. Corrélez le taux d'erreur opérationnel (12/300 = 4,0 %) au risque de dérive OTIF avant le renouvellement SLA J-90.",
      en: "Interpret the OTIF service level (285 orders delivered out of 300 = 95.0%). Analyze whether this level is excellent, acceptable, or insufficient according to industry standards. Correlate the operational error rate (12/300 = 4.0%) with OTIF drift risk before the J-90 SLA renewal.",
    },
    kpi_diagnostic: {
      fr: "Formuler un diagnostic global — piège du tableau vert. OTIF 95 % (excellent), erreurs 4 % (acceptable), rotation 6× (normal). Proposez un plan d'exécution chiffré prioritaire avant J-90, en corrélant picking/réception au risque OTIF.",
      en: "Formulate a global diagnostic — green dashboard trap. OTIF 95% (excellent), errors 4% (acceptable), rotation 6× (normal). Propose a priority numeric execution plan before J-90, correlating picking/receiving with OTIF risk.",
    },
  },
  "SCN-014": {
    kpi_service: {
      fr: "Interpréter le taux de service OTIF (285/300 = 95,0 %). Analysez si ce niveau est excellent, acceptable ou insuffisant. Intégrez le taux d'erreur 4,0 % (12/300) dans la lentille S&OP — tension ventes vs ops.",
      en: "Interpret the OTIF service level (285/300 = 95.0%). Analyze whether this level is excellent, acceptable, or insufficient. Integrate the 4.0% error rate (12/300) in the S&OP lens — sales vs ops tension.",
    },
    kpi_diagnostic: {
      fr: "Formuler un diagnostic global S&OP basé sur tous les KPIs : rotation 6× (normal), service 95 % (excellent), erreurs 4 % (acceptable), délai 3,5 j (normal). Proposez un plan d'action prioritaire avec trade-off explicite pour une initiative unique financée.",
      en: "Formulate a global S&OP diagnostic based on all KPIs: rotation 6× (normal), service 95% (excellent), errors 4% (acceptable), lead time 3.5 d (normal). Propose a priority action plan with explicit trade-off for one funded initiative.",
    },
  },
};

const DEFAULT_QUESTIONS: Record<string, Bilingual> = {
  kpi_rotation: {
    fr: "Interpréter le taux de rotation des stocks. Données : consommation annuelle 2400, stock moyen 400. Taux = 2400/400 = 6. Analysez si ce résultat indique un surstock, une performance normale ou une sous-performance.",
    en: "Interpret the stock rotation rate. Data: annual consumption 2400, average stock 400. Rate = 2400/400 = 6. Analyze whether this result indicates overstock, normal performance, or underperformance.",
  },
  kpi_service: {
    fr: "Interpréter le taux de service. Données : 285 commandes livrées sur 300 = 95 %. Analysez si ce résultat est excellent, acceptable ou insuffisant selon les standards industrie.",
    en: "Interpret the service level. Data: 285 orders delivered out of 300 = 95%. Analyze whether this result is excellent, acceptable, or insufficient according to industry standards.",
  },
  kpi_diagnostic: {
    fr: "Formuler un diagnostic global basé sur tous les KPIs. Taux de rotation 6 (normal), service 95 % (excellent), erreurs 4 % (acceptable). Proposez un plan d'action prioritaire.",
    en: "Formulate a global diagnostic based on all KPIs. Rotation rate 6 (normal), service 95% (excellent), errors 4% (acceptable). Propose a priority action plan.",
  },
  m5_decision_tactical: {
    fr: "Simulation intégrée M5 — Formuler une décision tactique basée sur les KPIs du snapshot M5_KPI. Analysez les résultats observés (rotation, service, erreurs) et proposez une action opérationnelle concrète.",
    en: "M5 Integrated Simulation — Formulate a tactical decision based on M5_KPI snapshot KPIs. Analyze observed results (rotation, service, errors) and propose a concrete operational action.",
  },
  m5_decision_strategic: {
    fr: "Simulation intégrée M5 — Formuler une décision stratégique basée sur les KPIs du snapshot M5_KPI. Citez ≥ 2 KPI chiffrés, un trade-off explicite, une recommandation et un horizon 90–180 jours.",
    en: "M5 Integrated Simulation — Formulate a strategic decision based on M5_KPI snapshot KPIs. Cite ≥ 2 numeric KPIs, an explicit trade-off, a recommendation, and a 90–180 day horizon.",
  },
};

export function getAnalyticalQuestionText(
  step: string,
  scnCode: OfficialScnCode | null,
  language: string,
  isM5Strategic: boolean,
): string {
  const key = step.toLowerCase();

  if (key === "m5_decision") {
    const entry = isM5Strategic ? DEFAULT_QUESTIONS.m5_decision_strategic : DEFAULT_QUESTIONS.m5_decision_tactical;
    return language === "FR" ? entry.fr : entry.en;
  }

  const scnOverride =
    scnCode && SCN_STEP_QUESTIONS[scnCode]?.[key as StepKey];
  if (scnOverride) {
    return language === "FR" ? scnOverride.fr : scnOverride.en;
  }

  const fallback = DEFAULT_QUESTIONS[key];
  if (!fallback) return "";
  return language === "FR" ? fallback.fr : fallback.en;
}
