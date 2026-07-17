import type { OfficialScnCode } from "../../../server/canonicalScenarios";

/** Steps that use the institutional analytical response component (M4 + M5). */
export const ANALYTICAL_ANSWER_STEPS = new Set([
  "kpi_rotation",
  "kpi_service",
  "kpi_diagnostic",
  "m5_decision",
]);

/** M4 steps that use analytical chrome (no physical warehouse transaction). */
export const M4_ANALYTICAL_STEPS = new Set([
  "kpi_data",
  "kpi_rotation",
  "kpi_service",
  "kpi_diagnostic",
  "compliance_m4",
]);

export function isAnalyticalAnswerStep(step: string | undefined | null): boolean {
  return ANALYTICAL_ANSWER_STEPS.has((step ?? "").toLowerCase());
}

/** True for Module 4 analytical steps — use analytical chrome, not transaction chrome. */
export function isM4AnalyticalStep(step: string | undefined | null, moduleId?: number | null): boolean {
  if (moduleId != null && moduleId !== 4) return false;
  return M4_ANALYTICAL_STEPS.has((step ?? "").toLowerCase());
}

type Bilingual = { fr: string; en: string };

type StepKey = "kpi_rotation" | "kpi_service" | "kpi_diagnostic" | "m5_decision";

/** Patterns that leak completed calculation, classification, or recommendation. */
const LEAKAGE_PATTERNS: RegExp[] = [
  /taux\s*=\s*2400\s*\/\s*400\s*=\s*6/i,
  /2400\/400\s*=\s*6/i,
  /6\s*[×x]\s*\(normal/i,
  /rotation\s+6\s*\(normal/i,
  /95\s*%\s*\(excellent/i,
  /4\s*%\s*\(acceptable/i,
  /pi[eè]ge du tableau vert/i,
];

export function questionContainsAnswerLeakage(text: string): boolean {
  return LEAKAGE_PATTERNS.some((re) => re.test(text));
}

/** SCN-specific questions — raw data OK; no pre-written classification/recommendation. */
const SCN_STEP_QUESTIONS: Partial<Record<OfficialScnCode, Partial<Record<StepKey, Bilingual>>>> = {
  "SCN-012": {
    kpi_rotation: {
      fr: "À partir de la consommation annuelle (2 400 unités) et du stock moyen (400 unités), calculez le taux de rotation. Classifiez le résultat et indiquez la politique de stock que vous recommandez ainsi que le suivi nécessaire.",
      en: "From annual consumption (2,400 units) and average stock (400 units), calculate the turnover rate. Classify the result and state the stock policy you recommend plus the follow-up required.",
    },
    kpi_service: {
      fr: "Données : 285 commandes livrées sur 300. Calculez le taux de service (OTIF), classifiez-le et indiquez ce que cela implique pour la politique stock.",
      en: "Data: 285 orders delivered out of 300. Calculate the OTIF service level, classify it, and state what it implies for stock policy.",
    },
    kpi_diagnostic: {
      fr: "À partir de la consommation annuelle et du stock moyen, calculez la rotation. Classifiez le résultat et indiquez la politique de stock que vous recommandez ainsi que le suivi nécessaire.",
      en: "From annual consumption and average stock, calculate turnover. Classify the result and state the stock policy you recommend plus required monitoring.",
    },
  },
  "SCN-013": {
    kpi_service: {
      fr: "Données : 285 commandes livrées sur 300 ; 12 erreurs sur 300 opérations. Calculez l'OTIF et le taux d'erreur, puis classifiez chaque indicateur.",
      en: "Data: 285 orders delivered out of 300; 12 errors out of 300 operations. Calculate OTIF and the error rate, then classify each indicator.",
    },
    kpi_diagnostic: {
      fr: "Comparez l'OTIF et le taux d'erreur. Quel risque identifiez-vous avant le renouvellement du SLA et quelle action recommandez-vous ?",
      en: "Compare OTIF and the error rate. What risk do you identify before SLA renewal, and what action do you recommend?",
    },
  },
  "SCN-014": {
    kpi_service: {
      fr: "Données : 285 commandes livrées sur 300 ; 12 erreurs sur 300 opérations. Calculez et classifiez l'OTIF et le taux d'erreur dans une perspective S&OP.",
      en: "Data: 285 orders delivered out of 300; 12 errors out of 300 operations. Calculate and classify OTIF and the error rate in an S&OP perspective.",
    },
    kpi_diagnostic: {
      fr: "Le comité S&OP ne peut financer qu'une seule initiative. À partir des KPI disponibles (rotation, service, erreurs, délai), choisissez une priorité, expliquez le compromis et indiquez quand la décision devra être réévaluée.",
      en: "The S&OP committee can fund only one initiative. From available KPIs (turnover, service, errors, lead time), choose one priority, explain the trade-off, and state when the decision should be reviewed.",
    },
  },
  "SCN-015": {
    m5_decision: {
      fr: "Le cycle opérationnel est-il conforme ? Un réapprovisionnement est-il nécessaire d'après le stock et les seuils du run ? Que faut-il maintenir ou surveiller ? (Q = 0 peut être une décision complète.)",
      en: "Is the operational cycle compliant? Is replenishment required given run stock and thresholds? What should be maintained or monitored? (Q = 0 can be a complete decision.)",
    },
  },
  "SCN-016": {
    m5_decision: {
      fr: "Réconcilier d'abord, décider ensuite. Sur la base du stock corrigé après ajustement, un réapprovisionnement est-il nécessaire ? Que maintenez-vous ou surveillez-vous ?",
      en: "Reconcile first, decide afterward. Based on corrected stock after adjustment, is replenishment required? What do you maintain or monitor?",
    },
  },
  "SCN-017": {
    m5_decision: {
      fr: "À partir du snapshot M5_KPI de votre session, citez au moins deux KPI chiffrés, définissez une priorité stratégique, explicitez un compromis et indiquez un horizon de revue (90–180 jours ou équivalent).",
      en: "From your session M5_KPI snapshot, cite at least two numeric KPIs, define one strategic priority, state an explicit trade-off, and give a review horizon (90–180 days or equivalent).",
    },
  },
};

const DEFAULT_QUESTIONS: Record<string, Bilingual> = {
  kpi_rotation: {
    fr: "Consommation annuelle : 2 400 unités. Stock moyen : 400 unités. Calculez le taux de rotation, classifiez le résultat et recommandez une action avec suivi.",
    en: "Annual consumption: 2,400 units. Average stock: 400 units. Calculate the turnover rate, classify the result, and recommend an action with follow-up.",
  },
  kpi_service: {
    fr: "Données : 285 commandes livrées sur 300. Calculez le taux de service, classifiez-le et expliquez brièvement ce qu'il implique.",
    en: "Data: 285 orders delivered out of 300. Calculate the service level, classify it, and briefly explain what it implies.",
  },
  kpi_diagnostic: {
    fr: "À partir des KPI disponibles, formulez une synthèse courte : classification, décision et suivi. Utilisez vos propres mots.",
    en: "From available KPIs, write a short synthesis: classification, decision, and follow-up. Use your own words.",
  },
  m5_decision_tactical: {
    fr: "Le cycle opérationnel est-il conforme ? Un réapprovisionnement est-il nécessaire d'après le stock et les seuils du run ? Que faut-il maintenir ou surveiller ?",
    en: "Is the operational cycle compliant? Is replenishment required given run stock and thresholds? What should be maintained or monitored?",
  },
  m5_decision_tactical_recon: {
    fr: "Réconcilier d'abord, décider ensuite. Sur la base du stock corrigé, un réapprovisionnement est-il nécessaire ? Que maintenez-vous ou surveillez-vous ?",
    en: "Reconcile first, decide afterward. Based on corrected stock, is replenishment required? What do you maintain or monitor?",
  },
  m5_decision_strategic: {
    fr: "À partir du snapshot M5_KPI de votre session, citez au moins deux KPI chiffrés, définissez une priorité stratégique, explicitez un compromis et indiquez un horizon de revue (90–180 jours ou équivalent).",
    en: "From your session M5_KPI snapshot, cite at least two numeric KPIs, define one strategic priority, state an explicit trade-off, and give a review horizon (90–180 days or equivalent).",
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
    const scnOverride = scnCode && SCN_STEP_QUESTIONS[scnCode]?.m5_decision;
    if (scnOverride) return language === "FR" ? scnOverride.fr : scnOverride.en;
    if (isM5Strategic) {
      const entry = DEFAULT_QUESTIONS.m5_decision_strategic;
      return language === "FR" ? entry.fr : entry.en;
    }
    if (scnCode === "SCN-016") {
      const entry = DEFAULT_QUESTIONS.m5_decision_tactical_recon;
      return language === "FR" ? entry.fr : entry.en;
    }
    const entry = DEFAULT_QUESTIONS.m5_decision_tactical;
    return language === "FR" ? entry.fr : entry.en;
  }

  const scnOverride = scnCode && SCN_STEP_QUESTIONS[scnCode]?.[key as StepKey];
  if (scnOverride) {
    return language === "FR" ? scnOverride.fr : scnOverride.en;
  }

  const fallback = DEFAULT_QUESTIONS[key];
  if (!fallback) return "";
  return language === "FR" ? fallback.fr : fallback.en;
}

/** Header label for step chrome — analytical for M4 only. */
export function getStepChromeCodeLabel(
  moduleId: number | null | undefined,
  step: string | undefined | null,
  language: string,
): string {
  if (isM4AnalyticalStep(step, moduleId)) {
    return language === "FR" ? "Référence analytique" : "Analytical reference";
  }
  return language === "FR" ? "Code Transaction" : "Transaction Code";
}

/** Primary submit CTA — analytical for M4 free-text / compliance steps. */
export function getStepSubmitLabel(
  moduleId: number | null | undefined,
  step: string | undefined | null,
  language: string,
  options?: { isGrRegularization?: boolean; isZeroVarianceConfirm?: boolean },
): string {
  if (options?.isGrRegularization) {
    return language === "FR" ? "Poster (MIGO)" : "Post (MIGO)";
  }
  if (options?.isZeroVarianceConfirm) {
    return language === "FR" ? "Confirmer l'écart nul" : "Confirm zero variance";
  }
  if (isM4AnalyticalStep(step, moduleId)) {
    return language === "FR" ? "Valider l'analyse" : "Validate analysis";
  }
  return language === "FR" ? "Valider la transaction" : "Validate transaction";
}

/** Step title for M5_DECISION depending on SCN / decision level. */
export function getM5DecisionStepTitle(
  scnCode: OfficialScnCode | null,
  isM5Strategic: boolean,
): Bilingual {
  if (isM5Strategic || scnCode === "SCN-017") {
    return { fr: "Décision stratégique", en: "Strategic decision" };
  }
  if (scnCode === "SCN-016") {
    return { fr: "Décision tactique après réconciliation", en: "Tactical decision after reconciliation" };
  }
  return { fr: "Décision tactique", en: "Tactical decision" };
}

/** KPI_DATA title — lecture, not data entry of invented numbers. */
export const M4_KPI_DATA_TITLE: Bilingual = {
  fr: "Lecture des données KPI",
  en: "KPI data review",
};
