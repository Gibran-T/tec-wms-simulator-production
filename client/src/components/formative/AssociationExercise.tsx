import type { LocalizedText } from "@shared/formativeExercises";

type TranslateFn = (fr: string, en: string) => string;

export interface AssociationItem {
  id: string;
  evidence: LocalizedText;
}

export interface AssociationOption {
  id: string;
  label: LocalizedText;
}

export interface AssociationExerciseProps {
  items: AssociationItem[];
  options: AssociationOption[];
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  language: "FR" | "EN";
  t: TranslateFn;
  disabled?: boolean;
}

export default function AssociationExercise({
  items,
  options,
  value,
  onChange,
  language,
  t,
  disabled = false,
}: AssociationExerciseProps) {
  return (
    <div className="space-y-3" role="group" aria-label={t("Associer preuve et interprétation", "Associate evidence and interpretation")}>
      {items.map((item) => (
        <div key={item.id} className="rounded-md border bg-card p-3 space-y-2" data-testid={`assoc-${item.id}`}>
          <p className="text-sm font-medium text-foreground">
            {language === "FR" ? item.evidence.fr : item.evidence.en}
          </p>
          <label className="block text-xs text-muted-foreground" htmlFor={`assoc-select-${item.id}`}>
            {t("Interprétation", "Interpretation")}
          </label>
          <select
            id={`assoc-select-${item.id}`}
            disabled={disabled}
            value={value[item.id] ?? ""}
            onChange={(e) => onChange({ ...value, [item.id]: e.target.value })}
            className="w-full text-sm rounded-md border bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            aria-label={`${t("Interprétation pour", "Interpretation for")} ${language === "FR" ? item.evidence.fr : item.evidence.en}`}
          >
            <option value="">{t("Choisir…", "Choose…")}</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {language === "FR" ? opt.label.fr : opt.label.en}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
