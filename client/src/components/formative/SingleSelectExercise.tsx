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
  /** Prefix options with A. B. C. D. */
  lettered?: boolean;
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
  lettered = false,
}: SingleSelectExerciseProps) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label={prompt ? (language === "FR" ? prompt.fr : prompt.en) : t("Choisir", "Choose")} data-testid={testId}>
      {prompt && (
        <p className="text-sm font-medium text-foreground">
          {language === "FR" ? prompt.fr : prompt.en}
        </p>
      )}
      <div className={lettered ? "flex flex-col gap-2" : "flex flex-wrap gap-2"}>
        {options.map((opt, idx) => {
          const active = value === opt.id;
          const letter = String.fromCharCode(65 + idx);
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={disabled}
              onClick={() => onChange(opt.id)}
              className={`${lettered ? "w-full" : ""} px-3 py-2 text-xs rounded-md border text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-muted"
              } disabled:opacity-60`}
              data-testid={`${testId}-option-${letter.toLowerCase()}`}
            >
              {lettered ? <span className="font-semibold mr-2">{letter}.</span> : null}
              {language === "FR" ? opt.label.fr : opt.label.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}
