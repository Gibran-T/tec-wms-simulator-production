import type { LocalizedText } from "@shared/formativeExercises";

type TranslateFn = (fr: string, en: string) => string;

export interface TrueFalseItem {
  id: string;
  statement: LocalizedText;
}

export interface TrueFalseExerciseProps {
  items: TrueFalseItem[];
  value: Record<string, boolean | undefined>;
  onChange: (next: Record<string, boolean | undefined>) => void;
  language: "FR" | "EN";
  t: TranslateFn;
  disabled?: boolean;
}

export default function TrueFalseExercise({
  items,
  value,
  onChange,
  language,
  t,
  disabled = false,
}: TrueFalseExerciseProps) {
  return (
    <div className="space-y-3" role="group" aria-label={t("Vrai ou Faux", "True or False")}>
      {items.map((item) => {
        const selected = value[item.id];
        return (
          <div key={item.id} className="rounded-md border bg-card p-3 space-y-2" data-testid={`tf-${item.id}`}>
            <p className="text-sm font-medium text-foreground">
              {language === "FR" ? item.statement.fr : item.statement.en}
            </p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={language === "FR" ? item.statement.fr : item.statement.en}>
              {[
                { val: true, label: t("Vrai", "True") },
                { val: false, label: t("Faux", "False") },
              ].map((opt) => {
                const active = selected === opt.val;
                return (
                  <button
                    key={String(opt.val)}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={disabled}
                    onClick={() => onChange({ ...value, [item.id]: opt.val })}
                    className={`px-3 py-1.5 text-xs rounded-md border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted"
                    } disabled:opacity-60`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
