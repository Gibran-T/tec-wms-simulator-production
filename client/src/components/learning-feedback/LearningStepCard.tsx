import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { LearningFeedbackStep, LearningFeedbackStepPayload } from "@shared/learningFeedbackTypes";
import { pickBilingual } from "@shared/learningFeedbackTypes";
import KpiInterpretationBlock from "./KpiInterpretationBlock";
import ExpectedReasoningBlock from "./ExpectedReasoningBlock";
import CanonicalAnswerBlock from "./CanonicalAnswerBlock";
import StudentComparisonBlock from "./StudentComparisonBlock";
import CommonMistakesBlock from "./CommonMistakesBlock";

type Props = {
  step: LearningFeedbackStep;
  payload?: LearningFeedbackStepPayload;
  m5DecisionRejected?: boolean;
  language: "fr" | "en";
  t: (fr: string, en: string) => string;
  defaultExpanded: boolean;
};

function hasStudentSubmission(
  stepCode: string,
  payload?: LearningFeedbackStepPayload,
): payload is LearningFeedbackStepPayload & { studentSubmission: string } {
  return !!payload?.studentSubmission && payload.studentSubmission.length > 0;
}

export default function LearningStepCard({
  step,
  payload,
  m5DecisionRejected,
  language,
  t,
  defaultExpanded,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const showComparison =
    step.stepCode !== "COMPLIANCE_M4" &&
    step.stepCode !== "COMPLIANCE_M5" &&
    (hasStudentSubmission(step.stepCode, payload) || (step.stepCode === "M5_DECISION" && m5DecisionRejected));

  return (
    <div className="border border-border rounded-md overflow-hidden" data-testid={`learning-step-${step.stepCode}`}>
      <button
        type="button"
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-secondary/40 hover:bg-secondary/60 transition-colors text-left"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? <ChevronDown size={14} className="text-muted-foreground flex-shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />}
        <span className="text-xs font-semibold text-foreground flex-1">
          {pickBilingual(step.label, language)}
          {step.pedagogicalOnly && (
            <span className="ml-2 text-[9px] font-normal text-muted-foreground uppercase">
              ({t("pédagogique", "pedagogical")})
            </span>
          )}
        </span>
        {payload?.submissionCorrect === true && (
          <span className="text-[9px] font-bold text-emerald-600 uppercase">{t("OK", "OK")}</span>
        )}
        {payload?.submissionCorrect === false && (
          <span className="text-[9px] font-bold text-amber-600 uppercase">{t("Revoir", "Review")}</span>
        )}
      </button>
      {expanded && (
        <div className="p-3 space-y-3 border-t border-border">
          <KpiInterpretationBlock step={step} language={language} t={t} />
          <ExpectedReasoningBlock step={step} language={language} t={t} />
          <CanonicalAnswerBlock step={step} language={language} t={t} />
          {step.commonMistakes && step.commonMistakes.length > 0 && (
            <CommonMistakesBlock
              title={t("Erreurs fréquentes (étape)", "Common mistakes (step)")}
              mistakes={[]}
              stepMistakes={step.commonMistakes}
              language={language}
            />
          )}
          {showComparison && payload && (
            <StudentComparisonBlock
              stepCode={step.stepCode}
              studentSubmission={payload.studentSubmission ?? ""}
              submissionCorrect={payload.submissionCorrect ?? false}
              submissionFeedback={payload.submissionFeedback}
              rejected={step.stepCode === "M5_DECISION" ? m5DecisionRejected : false}
              t={t}
            />
          )}
        </div>
      )}
    </div>
  );
}
