import type { LocalizedText } from "@shared/formativeExercises";

type TranslateFn = (fr: string, en: string) => string;

export default function FactsBanner({
  facts,
  language,
  t,
}: {
  facts: LocalizedText;
  language: "FR" | "EN";
  t: TranslateFn;
}) {
  return (
    <div className="rounded-md border bg-slate-50 dark:bg-slate-800/60 p-3 text-sm text-foreground" data-testid="formative-facts">
      <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
        {t("Situation (lecture seule)", "Situation (read only)")}
      </p>
      {language === "FR" ? facts.fr : facts.en}
    </div>
  );
}
