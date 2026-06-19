import { GraduationCap } from "lucide-react";
import type { LearningFeedbackPayload } from "@shared/learningFeedbackTypes";
import { getLearningFeedbackScenario } from "@shared/learningFeedbackRegistry";
import { resolveVisibleLearningSteps } from "@shared/learningFeedbackPayload";
import LearningFeedbackHeader from "./LearningFeedbackHeader";
import LearningStepCard from "./LearningStepCard";
import CommonMistakesBlock from "./CommonMistakesBlock";

type Props = {
  payload: LearningFeedbackPayload;
  language: "fr" | "en";
  t: (fr: string, en: string) => string;
};

function defaultExpanded(
  stepCode: string,
  payload?: { submissionCorrect?: boolean | null; stepCompleted?: boolean },
): boolean {
  if (stepCode.startsWith("COMPLIANCE")) return false;
  if (payload?.submissionCorrect === false) return true;
  if (payload?.stepCompleted) return true;
  if (payload?.submissionCorrect == null) return true;
  return false;
}

export default function LearningFeedbackLayer({ payload, language, t }: Props) {
  const scenario = getLearningFeedbackScenario(payload.scnCode);
  if (!scenario) return null;

  const payloadByStep = new Map(payload.steps.map((s) => [s.stepCode, s]));
  const completedStepCodes = payload.steps
    .filter((s) => s.stepCompleted)
    .map((s) => s.stepCode);
  const visibleSteps = resolveVisibleLearningSteps(scenario, completedStepCodes);

  return (
    <div
      className="mt-4 pt-4 border-t border-border"
      data-testid="learning-feedback-layer"
    >
      <div className="flex items-center gap-2 mb-3">
        <GraduationCap size={14} className="text-primary" />
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
          {t("Couche d'apprentissage — débrief post-scénario", "Learning layer — post-scenario debrief")}
        </p>
      </div>
      <p className="text-sm font-medium text-foreground mb-2">
        {language === "fr" ? scenario.title.fr : scenario.title.en}
      </p>
      <LearningFeedbackHeader scenario={scenario} language={language} t={t} />
      <CommonMistakesBlock
        title={t("Erreurs fréquentes des étudiants", "Common student mistakes")}
        mistakes={scenario.scenarioMistakes}
        language={language}
      />
      <div className="space-y-2 mt-3">
        {visibleSteps.map((step) => {
          const stepPayload = payloadByStep.get(step.stepCode);
          return (
            <LearningStepCard
              key={step.stepCode}
              step={step}
              payload={stepPayload}
              m5DecisionRejected={step.stepCode === "M5_DECISION" ? payload.m5Decision?.rejected : false}
              language={language}
              t={t}
              defaultExpanded={defaultExpanded(step.stepCode, stepPayload)}
            />
          );
        })}
      </div>
    </div>
  );
}
