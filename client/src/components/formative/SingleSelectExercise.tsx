import type { LocalizedText } from "@shared/formativeExercises";

type TranslateFn = (fr: string, en: string) => string;

export interface SingleSelectOption {
  id: string;
  label: LocalizedText;
}

export interface SingleSelectExerciseProps {
  prompt?: LocalizedText;
  options: SingleSelectOption[];
  value?: string;
  onChange: (next: string) => void;
  language: "FR" | "EN";
  t: TranslateFn;
  disabled?: boolean;
  testId?: string;
}

export default function SingleSelectExercise({
  prompt,
  options,
  value,
  onChange,
  language,
  t,
  disabled = false,
  testId = "single-select",
}: SingleSelectExerciseProps) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label={prompt ? (language === "FR" ? prompt.fr : prompt.en) : t("Choisir", "Choose")} data-testid={testId}>
      {prompt && (
        <p className="text-sm font-medium text-foreground">
          {language === "FR" ? prompt.fr : prompt.en}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={disabled}
              onClick={() => onChange(opt.id)}
              className={`px-3 py-2 text-xs rounded-md border text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-muted"
              } disabled:opacity-60`}
            >
              {language === "FR" ? opt.label.fr : opt.label.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}
