import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TranslateFn = (fr: string, en: string) => string;

export interface AnalyticalResponseFieldProps {
  questionText: string;
  registerProps: UseFormRegisterReturn;
  t: TranslateFn;
  minChars?: number;
  /** Pedagogical helper shown instead of bare “Min. N caractères” as primary guidance. */
  guidanceText?: string;
  /** Short structure example (not a full grading key). */
  exampleStructure?: string;
  hints?: React.ReactNode;
  testId?: string;
  className?: string;
}

export default function AnalyticalResponseField({
  questionText,
  registerProps,
  t,
  minChars = 5,
  guidanceText,
  exampleStructure,
  hints,
  testId = "analytical-response-field",
  className,
}: AnalyticalResponseFieldProps) {
  const placeholder =
    guidanceText ||
    t(
      "Réponse courte: KPI, décision, suivi.",
      "Short answer: KPI, decision, follow-up.",
    );

  return (
    <div
      className={cn("rounded-md border border-border bg-card overflow-hidden", className)}
      data-testid={testId}
      role="group"
      aria-labelledby={`${testId}-question-label`}
    >
      <div className="border-b border-border bg-primary/5 px-4 py-3 sm:px-5 sm:py-4">
        <p
          id={`${testId}-question-label`}
          className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2"
        >
          {t("Question", "Question")}
        </p>
        <p className="text-sm sm:text-base text-foreground leading-relaxed">{questionText}</p>
      </div>

      {hints ? <div className="px-4 pt-3 sm:px-5">{hints}</div> : null}

      <div className="p-4 sm:p-5 space-y-2">
        <label htmlFor={registerProps.name} className="fiori-field-label block">
          {t("Votre réponse", "Your answer")} <span className="text-destructive">*</span>
        </label>

        {/* Structure cue: LECTURE → DÉCISION → SUIVI */}
        <div
          className="flex flex-wrap items-center gap-1 text-[9px]"
          data-testid={`${testId}-structure-cue`}
          aria-label={t("Structure attendue", "Expected structure")}
        >
          {[
            { fr: "LECTURE", en: "READING" },
            { fr: "DÉCISION", en: "DECISION" },
            { fr: "SUIVI", en: "FOLLOW-UP" },
          ].map((step, i) => (
            <span key={step.en} className="inline-flex items-center gap-1">
              {i > 0 && <span className="text-muted-foreground" aria-hidden>→</span>}
              <span className="px-1.5 py-0.5 border border-primary/30 bg-primary/5 text-primary rounded-sm font-bold tracking-wide">
                {t(step.fr, step.en)}
              </span>
            </span>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground leading-snug" data-testid={`${testId}-guidance`}>
          {t(
            "Répondez en 1 à 3 phrases courtes avec vos propres mots.",
            "Answer in 1 to 3 short sentences in your own words.",
          )}
        </p>
        {exampleStructure ? (
          <p className="text-[10px] text-slate-500 italic" data-testid={`${testId}-example-structure`}>
            {t("Exemple professionnel", "Professional example")} : {exampleStructure}
          </p>
        ) : (
          <p className="text-[10px] text-slate-500 italic" data-testid={`${testId}-example-structure`}>
            {t("Structure attendue", "Expected structure")} :{" "}
            {t("Valeur + classification. Décision. Suivi.", "Value + classification. Decision. Follow-up.")}
          </p>
        )}
        <Textarea
          id={registerProps.name}
          {...registerProps}
          rows={4}
          placeholder={placeholder}
          className={cn(
            "fiori-field-input fiori-field-active w-full text-sm leading-relaxed",
            "min-h-[6.5rem] sm:min-h-[7.5rem] resize-y",
          )}
        />
        <p className="sr-only">
          {t(`Minimum technique : ${minChars} caractères`, `Technical minimum: ${minChars} characters`)}
        </p>
      </div>
    </div>
  );
}
