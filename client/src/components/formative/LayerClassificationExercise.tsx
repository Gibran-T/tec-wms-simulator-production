import type { LocalizedText } from "@shared/formativeExercises";

type TranslateFn = (fr: string, en: string) => string;

export interface LayerOption {
  id: string;
  label: LocalizedText;
}

export interface LayerFragment {
  id: string;
  text: LocalizedText;
}

export interface LayerClassificationExerciseProps {
  fragments: LayerFragment[];
  layers: LayerOption[];
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  language: "FR" | "EN";
  t: TranslateFn;
  disabled?: boolean;
}

export default function LayerClassificationExercise({
  fragments,
  layers,
  value,
  onChange,
  language,
  t,
  disabled = false,
}: LayerClassificationExerciseProps) {
  return (
    <div className="space-y-3" role="group" aria-label={t("Classer les couches", "Classify the layers")}>
      {fragments.map((frag) => {
        const selected = value[frag.id] ?? "";
        return (
          <div
            key={frag.id}
            className="rounded-md border bg-card p-3 space-y-2"
            data-testid={`layer-frag-${frag.id}`}
          >
            <p className="text-sm font-medium text-foreground">
              {language === "FR" ? frag.text.fr : frag.text.en}
            </p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={language === "FR" ? frag.text.fr : frag.text.en}>
              {layers.map((layer) => {
                const active = selected === layer.id;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={disabled}
                    onClick={() => onChange({ ...value, [frag.id]: layer.id })}
                    className={`px-2.5 py-1.5 text-xs rounded-md border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted"
                    } disabled:opacity-60`}
                  >
                    {language === "FR" ? layer.label.fr : layer.label.en}
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
