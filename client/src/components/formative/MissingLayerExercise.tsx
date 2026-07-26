import type { LocalizedText } from "@shared/formativeExercises";

type TranslateFn = (fr: string, en: string) => string;

export interface MissingPrompt {
  id: string;
  prompt: LocalizedText;
}

export interface MissingOption {
  id: string;
  label: LocalizedText;
}

export interface MissingLayerExerciseProps {
  prompts: MissingPrompt[];
  options: MissingOption[];
  value: Record<string, string[]>;
  onChange: (next: Record<string, string[]>) => void;
  language: "FR" | "EN";
  t: TranslateFn;
  disabled?: boolean;
}

export default function MissingLayerExercise({
  prompts,
  options,
  value,
  onChange,
  language,
  t,
  disabled = false,
}: MissingLayerExerciseProps) {
  const toggle = (promptId: string, optionId: string) => {
    const current = value[promptId] ?? [];
    const next = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    onChange({ ...value, [promptId]: next });
  };

  return (
    <div className="space-y-4" role="group" aria-label={t("Identifier la couche manquante", "Identify the missing layer")}>
      {prompts.map((prompt) => {
        const selected = value[prompt.id] ?? [];
        return (
          <fieldset
            key={prompt.id}
            className="rounded-md border bg-card p-3 space-y-2"
            data-testid={`missing-${prompt.id}`}
          >
            <legend className="text-sm font-medium text-foreground px-1">
              {language === "FR" ? prompt.prompt.fr : prompt.prompt.en}
            </legend>
            <p className="text-xs text-muted-foreground">
              {t("Sélectionnez toutes les couches manquantes.", "Select all missing layers.")}
            </p>
            <div className="flex flex-wrap gap-2">
              {options.map((opt) => {
                const active = selected.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={active}
                    disabled={disabled}
                    onClick={() => toggle(prompt.id, opt.id)}
                    className={`px-2.5 py-1.5 text-xs rounded-md border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
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
          </fieldset>
        );
      })}
    </div>
  );
}
