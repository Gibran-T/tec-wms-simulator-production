import type { CharacterRef } from "../enterpriseBriefing";
import { getCareerSignalsForModule } from "./careerSignals";

/** Run Report debrief assembly — Manifesto Part XII §12.2–12.3 */

export interface EnterpriseDebriefInput {
  moduleId: number;
  scnCode: string;
  missionTitle: string;
  businessProblem: string;
  expectedOutcome: string;
  supervisor?: CharacterRef;
  score: number;
  passThreshold: number;
  compliant: boolean;
  isDemo: boolean;
  stepsCompleted: number;
  totalSteps: number;
}

export interface BilingualText {
  fr: string;
  en: string;
}

export interface EnterpriseDebriefContent {
  missionTitle: string;
  businessProblem: string;
  businessResult: BilingualText;
  evidenceTrail: BilingualText;
  decisionReview: BilingualText;
  careerReflection: BilingualText;
  supervisorEvaluation: BilingualText;
  careerSignalPrimary: BilingualText;
  careerSignalSecondary: BilingualText;
}

function pick(lang: "fr" | "en", text: BilingualText): string {
  return lang === "fr" ? text.fr : text.en;
}

export function buildBusinessResultSummary(input: EnterpriseDebriefInput): BilingualText {
  const passed = input.score >= input.passThreshold && input.compliant;
  if (input.isDemo) {
    return {
      fr: `Mission en mode démonstration — résultat pédagogique ${input.score}/100. Le résultat d'affaires n'est pas comptabilisé officiellement.`,
      en: `Demo mission — pedagogical outcome ${input.score}/100. Business result is not counted officially.`,
    };
  }
  if (passed) {
    return {
      fr: `Résultat d'affaires atteint pour Concorde Logistics — score opérationnel ${input.score}/100 (seuil ${input.passThreshold}). Conformité validée.`,
      en: `Business result achieved for Concorde Logistics — operational score ${input.score}/100 (threshold ${input.passThreshold}). Compliance validated.`,
    };
  }
  if (input.score >= input.passThreshold && !input.compliant) {
    return {
      fr: `Score opérationnel ${input.score}/100, mais anomalies de conformité — le résultat d'affaires reste incomplet pour le CDC.`,
      en: `Operational score ${input.score}/100, but compliance anomalies remain — business result incomplete for the CDC.`,
    };
  }
  return {
    fr: `Résultat d'affaires non atteint — score ${input.score}/100 (seuil ${input.passThreshold}). Révision de la preuve et des décisions requise.`,
    en: `Business result not achieved — score ${input.score}/100 (threshold ${input.passThreshold}). Evidence and decision review required.`,
  };
}

export function buildEvidenceTrailSummary(input: EnterpriseDebriefInput): BilingualText {
  const pct = input.totalSteps > 0 ? Math.round((input.stepsCompleted / input.totalSteps) * 100) : 0;
  return {
    fr: `${input.stepsCompleted}/${input.totalSteps} étapes complétées (${pct}%). Piste documentaire : moniteur WMS, cockpit de zone, Fiche Mission et transactions postées au CDC.`,
    en: `${input.stepsCompleted}/${input.totalSteps} steps completed (${pct}%). Evidence trail: WMS monitor, zone cockpit, Mission Sheet, and posted CDC transactions.`,
  };
}

export function buildDecisionReviewSummary(input: EnterpriseDebriefInput): BilingualText {
  if (input.moduleId >= 5) {
    return {
      fr: "Revue des compromis sous contrainte de pointe — coût, service client et capacité doivent être explicités dans votre recommandation exécutive.",
      en: "Peak-constraint trade-off review — cost, customer service, and capacity must be explicit in your executive recommendation.",
    };
  }
  if (input.moduleId === 4) {
    return {
      fr: "Revue des décisions KPI — chaque interprétation doit relier l'indicateur à une cause opérationnelle et à une action priorisée.",
      en: "KPI decision review — each interpretation must link the indicator to an operational cause and a prioritized action.",
    };
  }
  return {
    fr: "Revue des décisions opérationnelles — vérifiez que chaque transaction postée soutient le résultat d'affaires attendu.",
    en: "Operational decision review — verify each posted transaction supports the expected business outcome.",
  };
}

export function buildCareerReflectionSummary(input: EnterpriseDebriefInput): BilingualText {
  const signals = getCareerSignalsForModule(input.moduleId);
  return {
    fr: `Compétence démontrée : ${signals.primary.fr} — ${signals.secondary.fr}. Cette mission contribue à votre parcours professionnel chez Concorde Logistics (signal non certifiant).`,
    en: `Skill demonstrated: ${signals.primary.en} — ${signals.secondary.en}. This mission contributes to your professional path at Concorde Logistics (non-certification signal).`,
  };
}

export function buildSupervisorEvaluation(input: EnterpriseDebriefInput): BilingualText {
  const sup = input.supervisor;
  const name = sup?.name ?? (input.moduleId <= 2 ? "Marc-André Tremblay" : "Superviseur");
  const phraseFr = sup?.signaturePhraseFr ?? "Donnez-moi le fait, l'impact, et votre recommandation.";
  const phraseEn = sup?.signaturePhraseEn ?? "Give me the fact, the impact, and your recommendation.";
  const passed = input.score >= input.passThreshold && input.compliant && !input.isDemo;

  if (passed) {
    return {
      fr: `${name} — « ${phraseFr} » Mission ${input.scnCode} clôturée avec résultat d'affaires conforme. Poursuivez avec la même rigueur documentaire.`,
      en: `${name} — « ${phraseEn} » Mission ${input.scnCode} closed with compliant business outcome. Maintain the same documentary rigor.`,
    };
  }
  if (input.isDemo) {
    return {
      fr: `${name} — « ${phraseFr} » Exercice de démonstration terminé. Utilisez le débrief pour consolider la logique métier avant l'évaluation.`,
      en: `${name} — « ${phraseEn} » Demo exercise complete. Use this debrief to consolidate business logic before evaluation.`,
    };
  }
  return {
    fr: `${name} — « ${phraseFr} » Mission ${input.scnCode} : écart entre résultat opérationnel et promesse client. Revenez à la preuve au moniteur avant la prochaine tentative.`,
    en: `${name} — « ${phraseEn} » Mission ${input.scnCode}: gap between operational result and customer promise. Return to monitor evidence before your next attempt.`,
  };
}

export function buildEnterpriseDebrief(input: EnterpriseDebriefInput): EnterpriseDebriefContent {
  const signals = getCareerSignalsForModule(input.moduleId);
  return {
    missionTitle: input.missionTitle,
    businessProblem: input.businessProblem,
    businessResult: buildBusinessResultSummary(input),
    evidenceTrail: buildEvidenceTrailSummary(input),
    decisionReview: buildDecisionReviewSummary(input),
    careerReflection: buildCareerReflectionSummary(input),
    supervisorEvaluation: buildSupervisorEvaluation(input),
    careerSignalPrimary: signals.primary,
    careerSignalSecondary: signals.secondary,
  };
}

export { pick as pickDebriefLanguage };
