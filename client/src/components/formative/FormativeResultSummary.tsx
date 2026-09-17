type TranslateFn = (fr: string, en: string) => string;

export interface FormativeResultSummaryProps {
  formativeScore: number;
  partScores?: Record<string, number>;
  t: TranslateFn;
}

export const FORMATIVE_PART_LABELS: Record<string, { fr: string; en: string }> = {
  ordering: { fr: "Ordre professionnel", en: "Professional order" },
  evidenceColors: { fr: "Classification des preuves", en: "Evidence classification" },
  associations: { fr: "Décisions associées", en: "Associated decisions" },
  trueFalse: { fr: "Vrai / Faux", en: "True / False" },
  actionBuckets: { fr: "Leviers d'action", en: "Action levers" },
  classification: { fr: "Classification", en: "Classification" },
  missing: { fr: "Couches manquantes", en: "Missing layers" },
  kpiQuestions: { fr: "Questions KPI", en: "KPI questions" },
  kpiColors: { fr: "Couleurs KPI", en: "KPI colors" },
  mcq: { fr: "Questions fermées", en: "Closed questions" },
};

export function failedFormativeParts(
  partScores: Record<string, number> | undefined,
): Array<{ key: string; score: number }> {
  if (!partScores) return [];
  return Object.entries(partScores)
    .filter(([, score]) => score < 100)
    .map(([key, score]) => ({ key, score }))
    .sort((a, b) => a.score - b.score);
}

export function formativeFailedPartsCopy(
  formativeScore: number,
  partScores: Record<string, number> | undefined,
  t: TranslateFn,
): string | null {
  const failed = failedFormativeParts(partScores);
  if (failed.length === 0) return null;
  const parts = failed
    .map((p) => {
      const label = FORMATIVE_PART_LABELS[p.key];
      const name = label ? t(label.fr, label.en) : p.key;
      return `${name} (${Math.round(p.score)}/100)`;
    })
    .join(" ; ");
  return t(
    `Score ${formativeScore}% — partie(s) en échec : ${parts}. Action requise : revoir ces parties (incorrect ou ordre incomplet), puis refaire l’exercice.`,
    `Score ${formativeScore}% — failed part(s): ${parts}. Action required: review those parts (incorrect or incomplete order), then retry the exercise.`,
  );
}

export default function FormativeResultSummary({
  formativeScore,
  partScores,
  t,
}: FormativeResultSummaryProps) {
  const failedCopy = formativeFailedPartsCopy(formativeScore, partScores, t);
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
      {failedCopy && (
        <p
          className="text-sm text-rose-900 dark:text-rose-100 rounded-md border border-rose-300 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 leading-relaxed"
          data-testid="formative-failed-parts"
        >
          {failedCopy}
        </p>
      )}
      {partScores && Object.keys(partScores).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(partScores).map(([key, score]) => {
            const label = FORMATIVE_PART_LABELS[key];
            const failed = score < 100;
            return (
              <div
                key={key}
                className={`rounded-md p-2 text-center ${
                  failed
                    ? "bg-rose-50 dark:bg-rose-950/40 border border-rose-200"
                    : "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200"
                }`}
                data-testid={`formative-part-${key}`}
              >
                <p className="text-[10px] uppercase text-muted-foreground truncate">
                  {label ? t(label.fr, label.en) : key}
                </p>
                <p className="text-sm font-semibold">{Math.round(score)}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
