import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { M4CognitiveQuestion } from "@shared/m4CognitiveSelectors";

type TranslateFn = (fr: string, en: string) => string;

export interface CognitiveAnswerSelectorProps {
  question: M4CognitiveQuestion;
  t: TranslateFn;
  language: "fr" | "en";
  value: string | undefined;
  onChange: (optionId: string, answerText: string) => void;
  /** Server/local red why after an incorrect attempt */
  lastWrongWhy?: { fr: string; en: string } | null;
  /** Green why after a correct validation (optional local preview) */
  lastRightWhy?: { fr: string; en: string } | null;
  disabled?: boolean;
  testId?: string;
}

export default function CognitiveAnswerSelector({
  question,
  t,
  language,
  value,
  onChange,
  lastWrongWhy,
  lastRightWhy,
  disabled,
  testId = "cognitive-answer-selector",
}: CognitiveAnswerSelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(
    () => question.options.find((o) => o.id === value) ?? null,
    [question.options, value],
  );

  const prompt = language === "en" ? question.prompt.en : question.prompt.fr;

  return (
    <div
      className="rounded-md border border-border bg-card overflow-hidden"
      data-testid={testId}
      role="group"
      aria-labelledby={`${testId}-question-label`}
    >
      <div className="border-b border-border bg-primary/5 px-4 py-3 sm:px-5 sm:py-4">
        <p
          id={`${testId}-question-label`}
          className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2"
        >
          {t("Décision cognitive", "Cognitive decision")}
        </p>
        <p className="text-sm sm:text-base text-foreground leading-relaxed">{prompt}</p>
        <p className="mt-2 text-[11px] text-muted-foreground leading-snug">
          {t(
            "Choisissez la meilleure réponse parmi 5 options proches. Une erreur affiche un alerte rouge spécifique et pénalise le score ; la bonne réponse (vert) valide l’étape.",
            "Choose the best answer among 5 near-miss options. A wrong choice shows a specific red alert and penalizes the score; the correct (green) choice validates the step.",
          )}
        </p>
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        <label className="fiori-field-label block" htmlFor={`${testId}-trigger`}>
          {t("Votre sélection", "Your selection")} <span className="text-destructive">*</span>
        </label>

        <Select
          open={open}
          onOpenChange={setOpen}
          value={value || undefined}
          disabled={disabled}
          onValueChange={(id) => {
            const opt = question.options.find((o) => o.id === id);
            if (!opt) return;
            onChange(opt.id, opt.answerText);
          }}
        >
          <SelectTrigger
            id={`${testId}-trigger`}
            className={cn(
              "w-full min-h-[2.75rem] h-auto py-2.5 whitespace-normal text-left items-start",
              lastWrongWhy && "border-rose-500 ring-1 ring-rose-400/40",
              lastRightWhy && !lastWrongWhy && "border-emerald-500 ring-1 ring-emerald-400/40",
            )}
            data-testid={`${testId}-trigger`}
          >
            <SelectValue
              placeholder={t(
                "Ouvrir le sélecteur — 5 réponses cognitives",
                "Open selector — 5 cognitive answers",
              )}
            >
              {selected
                ? language === "en"
                  ? selected.label.en
                  : selected.label.fr
                : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-w-[min(100vw-2rem,42rem)]" position="popper" align="start">
            {question.options.map((opt, idx) => (
              <SelectItem
                key={opt.id}
                value={opt.id}
                className="whitespace-normal py-2.5 leading-snug cursor-pointer"
                data-testid={`${testId}-option-${idx}`}
              >
                <span className="text-[11px] font-semibold text-muted-foreground mr-2">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {language === "en" ? opt.label.en : opt.label.fr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {lastWrongWhy ? (
          <div
            className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2.5 text-sm text-rose-900 flex gap-2"
            data-testid={`${testId}-wrong-alert`}
            role="alert"
          >
            <AlertTriangle className="size-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold text-rose-800">
                {t("Réponse incorrecte (−5 pts)", "Incorrect answer (−5 pts)")}
              </p>
              <p className="mt-1 leading-relaxed">
                {language === "en" ? lastWrongWhy.en : lastWrongWhy.fr}
              </p>
              <p className="mt-1.5 text-[11px] text-rose-700/90">
                {t(
                  "Vous pouvez réessayer. La bonne réponse (vert) validera l’étape ; les tentatives erronées restent dans le score.",
                  "You may retry. The correct (green) answer will validate the step; wrong attempts remain in the score.",
                )}
              </p>
            </div>
          </div>
        ) : null}

        {lastRightWhy && !lastWrongWhy ? (
          <div
            className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900 flex gap-2"
            data-testid={`${testId}-right-alert`}
          >
            <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-semibold text-emerald-800">
                {t("Réponse correcte", "Correct answer")}
              </p>
              <p className="mt-1 leading-relaxed">
                {language === "en" ? lastRightWhy.en : lastRightWhy.fr}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
