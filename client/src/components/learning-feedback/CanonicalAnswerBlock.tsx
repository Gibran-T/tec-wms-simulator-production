import type { LearningFeedbackStep } from "@shared/learningFeedbackTypes";
import { pickBilingual } from "@shared/learningFeedbackTypes";

type Props = {
  step: LearningFeedbackStep;
  language: "fr" | "en";
  t: (fr: string, en: string) => string;
};

/**
 * Post-run pedagogical example — not a mandatory keyword answer key.
 * Literal validator synonym chips are not rendered.
 */
export default function CanonicalAnswerBlock({ step, language, t }: Props) {
  const { canonicalAnswer } = step;
  return (
    <div
      className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-3 space-y-2"
      data-testid={`learning-canonical-answer-${step.stepCode}`}
      role="region"
      aria-labelledby={`canonical-answer-${step.stepCode}`}
    >
      <p id={`canonical-answer-${step.stepCode}`} className="text-[10px] font-semibold uppercase tracking-wider text-foreground">
        {t("Exemple de raisonnement", "Example of reasoning")}
      </p>
      <p className="text-[10px] text-muted-foreground leading-relaxed" data-testid="learning-example-disclaimer">
        {t(
          "Cette formulation est un exemple. Une autre réponse peut être correcte si elle démontre le même raisonnement. Utilisez vos propres mots.",
          "This wording is an example. Another answer can be correct if it shows the same reasoning. Use your own words.",
        )}
      </p>
      <p className="text-xs font-semibold text-foreground">
        {t("Courte :", "Short:")} {pickBilingual(canonicalAnswer.short, language)}
      </p>
      <p className="text-xs text-foreground leading-relaxed border-t border-slate-200 dark:border-slate-700 pt-2">
        {pickBilingual(canonicalAnswer.full, language)}
      </p>
      {canonicalAnswer.whyCorrect.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase">
            {t("Idées de raisonnement", "Reasoning ideas")}
          </p>
          <ul className="list-disc list-inside space-y-0.5">
            {canonicalAnswer.whyCorrect.map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground">{pickBilingual(item, language)}</li>
            ))}
          </ul>
        </div>
      )}
      {canonicalAnswer.variants && canonicalAnswer.variants.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase">
            {t("Autres formulations possibles", "Other possible formulations")}
          </p>
          {canonicalAnswer.variants.map((variant) => (
            <div key={variant.id} className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/30">
              <p className="text-[10px] font-bold text-primary mb-1">{pickBilingual(variant.label, language)}</p>
              <p className="text-xs text-foreground leading-relaxed">{pickBilingual(variant.full, language)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
