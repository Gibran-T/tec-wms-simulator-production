import type { LearningFeedbackStep } from "@shared/learningFeedbackTypes";
import { pickBilingual } from "@shared/learningFeedbackTypes";

type Props = {
  step: LearningFeedbackStep;
  language: "fr" | "en";
  t: (fr: string, en: string) => string;
};

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
        {t("Réponse canonique", "Canonical answer")}
      </p>
      <p className="text-xs font-semibold text-foreground">
        {t("Courte :", "Short:")} {pickBilingual(canonicalAnswer.short, language)}
      </p>
      <p className="text-xs text-foreground leading-relaxed border-t border-slate-200 dark:border-slate-700 pt-2">
        {pickBilingual(canonicalAnswer.full, language)}
      </p>
      {canonicalAnswer.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-[10px] text-muted-foreground mr-1">{t("Mots-clés :", "Keywords:")}</span>
          {canonicalAnswer.keywords.map((kw) => (
            <span key={kw} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {kw}
            </span>
          ))}
        </div>
      )}
      {canonicalAnswer.whyCorrect.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase">
            {t("Pourquoi c'est correct", "Why correct")}
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
            {t("Exemplaires acceptés — choisir une orientation", "Accepted exemplars — choose one orientation")}
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
