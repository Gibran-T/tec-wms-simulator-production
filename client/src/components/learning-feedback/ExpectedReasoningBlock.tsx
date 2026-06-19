import { AlertTriangle } from "lucide-react";
import type { LearningFeedbackStep } from "@shared/learningFeedbackTypes";
import { pickBilingual } from "@shared/learningFeedbackTypes";

type Props = {
  step: LearningFeedbackStep;
  language: "fr" | "en";
  t: (fr: string, en: string) => string;
};

export default function ExpectedReasoningBlock({ step, language, t }: Props) {
  const { expectedReasoning } = step;
  return (
    <div
      className="rounded-md border border-border bg-card p-3 space-y-2"
      data-testid={`learning-expected-reasoning-${step.stepCode}`}
      role="region"
      aria-labelledby={`expected-reasoning-${step.stepCode}`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <p id={`expected-reasoning-${step.stepCode}`} className="text-[10px] font-semibold uppercase tracking-wider text-foreground">
          {t("Raisonnement attendu", "Expected reasoning")}
        </p>
        {expectedReasoning.bloom && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
            Bloom: {expectedReasoning.bloom}
          </span>
        )}
      </div>
      <ol className="list-decimal list-inside space-y-1">
        {expectedReasoning.chain.map((item, i) => (
          <li key={i} className="text-xs text-foreground leading-relaxed">
            {pickBilingual(item, language)}
          </li>
        ))}
      </ol>
      {expectedReasoning.traps.length > 0 && (
        <div className="space-y-1 pt-1">
          {expectedReasoning.traps.map((trap, i) => (
            <p key={i} className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1.5">
              <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
              {pickBilingual(trap, language)}
            </p>
          ))}
        </div>
      )}
      {expectedReasoning.erpAnchor && (
        <p className="text-[10px] text-muted-foreground italic border-t border-border pt-2">
          ERP/WMS: {pickBilingual(expectedReasoning.erpAnchor, language)}
        </p>
      )}
    </div>
  );
}
