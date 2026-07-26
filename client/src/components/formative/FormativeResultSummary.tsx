type TranslateFn = (fr: string, en: string) => string;

export interface FormativeResultSummaryProps {
  formativeScore: number;
  partScores?: Record<string, number>;
  t: TranslateFn;
}

export default function FormativeResultSummary({
  formativeScore,
  partScores,
  t,
}: FormativeResultSummaryProps) {
  return (
    <section
      className="rounded-md border bg-card p-4 space-y-3"
      data-testid="formative-result-summary"
      aria-label={t("Résultat formatif", "Formative result")}
    >
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
          {t("Score formatif", "Formative score")}
        </p>
        <p className="text-3xl font-bold text-foreground">
          {formativeScore}
          <span className="text-base font-medium text-muted-foreground">/100</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {t(
            "Hors moyenne officielle — n’affecte pas missions, quiz, assessment ni certification.",
            "Outside official average — does not affect missions, quiz, assessment or certification.",
          )}
        </p>
      </div>
      {partScores && Object.keys(partScores).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(partScores).map(([key, score]) => (
            <div key={key} className="rounded-md bg-slate-50 dark:bg-slate-800 p-2 text-center">
              <p className="text-[10px] uppercase text-muted-foreground truncate">{key}</p>
              <p className="text-sm font-semibold">{Math.round(score)}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
