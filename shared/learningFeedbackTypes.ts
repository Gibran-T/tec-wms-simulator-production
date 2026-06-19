export type Bilingual = { fr: string; en: string };

export function pickBilingual(b: Bilingual, language: "fr" | "en"): string {
  return language === "fr" ? b.fr : b.en;
}

export type LearningBandStatus = "critical" | "acceptable" | "normal" | "excellent" | "neutral";

export type LearningFeedbackStep = {
  stepCode: string;
  label: Bilingual;
  kpiInterpretation: {
    lens: Bilingual;
    bands: Array<{
      kpiKey: string;
      value: string;
      status: LearningBandStatus;
      formulaHint?: Bilingual;
    }>;
  };
  expectedReasoning: {
    chain: Bilingual[];
    traps: Bilingual[];
    bloom?: "Evaluate" | "Create";
    erpAnchor?: Bilingual;
  };
  canonicalAnswer: {
    short: Bilingual;
    full: Bilingual;
    keywords: string[];
    whyCorrect: Bilingual[];
    variants?: Array<{
      id: string;
      label: Bilingual;
      full: Bilingual;
    }>;
  };
  commonMistakes?: Bilingual[];
  pedagogicalOnly?: boolean;
};

export type LearningFeedbackScenario = {
  scnCode: string;
  moduleId: 4 | 5;
  title: Bilingual;
  lens: Bilingual;
  steps: LearningFeedbackStep[];
  scenarioMistakes: Bilingual[];
};

export type LearningFeedbackStepPayload = {
  stepCode: string;
  labelFr: string;
  labelEn: string;
  studentSubmission?: string | null;
  submissionCorrect?: boolean | null;
  submissionFeedback?: string | null;
};

export type LearningFeedbackPayload = {
  scnCode: string;
  moduleId: 4 | 5;
  steps: LearningFeedbackStepPayload[];
  m5Decision?: {
    studentText: string | null;
    rubricFeedback: string | null;
    rejected: boolean;
  } | null;
};

export const LEARNING_FEEDBACK_SCN_CODES = [
  "SCN-012",
  "SCN-013",
  "SCN-014",
  "SCN-015",
  "SCN-016",
  "SCN-017",
] as const;

export type LearningFeedbackScnCode = (typeof LEARNING_FEEDBACK_SCN_CODES)[number];

export function isLearningFeedbackScn(scnCode: string | null | undefined): scnCode is LearningFeedbackScnCode {
  return !!scnCode && (LEARNING_FEEDBACK_SCN_CODES as readonly string[]).includes(scnCode);
}
