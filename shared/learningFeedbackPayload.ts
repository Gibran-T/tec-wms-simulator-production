import type {
  LearningFeedbackPayload,
  LearningFeedbackScenario,
  LearningFeedbackStep,
  LearningFeedbackStepPayload,
} from "./learningFeedbackTypes";
import { LEARNING_FEEDBACK_REGISTRY } from "./learningFeedbackRegistry";
import { isLearningFeedbackScn } from "./learningFeedbackTypes";

const M4_KPI_KEY_TO_STEP: Record<string, string> = {
  rotationRate: "KPI_ROTATION",
  serviceLevel: "KPI_SERVICE",
  errorRate: "KPI_ERRORS",
  diagnostic: "KPI_DIAGNOSTIC",
};

type KpiInterpretationRow = {
  kpiKey: string;
  studentAnswer: string;
  isCorrect: boolean;
  feedback: string;
};

type ScoringEventRow = {
  eventType: string;
  message?: string | null;
};

/** Steps shown on Run Report — completed runtime steps + pedagogical blocks when relevant. */
export function resolveVisibleLearningSteps(
  scenario: LearningFeedbackScenario,
  completedStepCodes: string[],
): LearningFeedbackStep[] {
  const completed = new Set(completedStepCodes);
  return scenario.steps.filter((step) => {
    if (completed.has(step.stepCode)) return true;
    if (step.pedagogicalOnly && step.stepCode === "KPI_ERRORS") {
      return completed.has("KPI_SERVICE");
    }
    return false;
  });
}

export function buildLearningFeedbackPayload(input: {
  scnCode: string | null;
  moduleId: number;
  completedStepCodes?: string[];
  kpiInterpretations?: KpiInterpretationRow[];
  scoringEvents?: ScoringEventRow[];
}): LearningFeedbackPayload | null {
  const { scnCode, moduleId, completedStepCodes = [], kpiInterpretations = [], scoringEvents = [] } = input;
  if (!isLearningFeedbackScn(scnCode)) return null;
  if (moduleId !== 4 && moduleId !== 5) return null;

  const registry = LEARNING_FEEDBACK_REGISTRY[scnCode];
  if (!registry) return null;

  const submissionByStep = new Map<string, KpiInterpretationRow>();
  for (const row of kpiInterpretations) {
    const stepCode =
      row.kpiKey === "m5Decision"
        ? "M5_DECISION"
        : M4_KPI_KEY_TO_STEP[row.kpiKey] ?? row.kpiKey;
    submissionByStep.set(stepCode, row);
  }

  const completed = new Set(completedStepCodes);
  const steps: LearningFeedbackStepPayload[] = registry.steps.map((step) => {
    const sub = submissionByStep.get(step.stepCode);
    const stepCompleted =
      completed.has(step.stepCode)
      || (step.pedagogicalOnly && step.stepCode === "KPI_ERRORS" && completed.has("KPI_SERVICE"));
    return {
      stepCode: step.stepCode,
      labelFr: step.label.fr,
      labelEn: step.label.en,
      studentSubmission: sub?.studentAnswer ?? null,
      submissionCorrect: sub ? sub.isCorrect : null,
      submissionFeedback: sub?.feedback ?? null,
      stepCompleted,
    };
  });

  let m5Decision: LearningFeedbackPayload["m5Decision"] = null;
  if (moduleId === 5) {
    const decisionRow = kpiInterpretations.find((r) => r.kpiKey === "m5Decision");
    const rejected = scoringEvents.some((e) => e.eventType === "M5_DECISION_REJECTED");
    m5Decision = {
      studentText: decisionRow?.studentAnswer ?? null,
      rubricFeedback: decisionRow?.feedback ?? null,
      rejected,
    };
  }

  return {
    scnCode,
    moduleId: moduleId as 4 | 5,
    steps,
    m5Decision,
  };
}
