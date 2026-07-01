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
  hints?: React.ReactNode;
  testId?: string;
  className?: string;
}

export default function AnalyticalResponseField({
  questionText,
  registerProps,
  t,
  minChars = 5,
  hints,
  testId = "analytical-response-field",
  className,
}: AnalyticalResponseFieldProps) {
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
          {t("Votre réponse", "Your answer")} <span className="text-destructive">*</span>{" "}
          <span className="text-[10px] text-muted-foreground ml-1 font-normal">
            {t(`Min. ${minChars} caractères`, `Min. ${minChars} characters`)}
          </span>
        </label>
        <Textarea
          id={registerProps.name}
          {...registerProps}
          rows={6}
          placeholder={t(
            "Rédigez votre analyse ici. Soyez précis et justifiez votre réponse avec des données.",
            "Write your analysis here. Be precise and justify your answer with data.",
          )}
          className={cn(
            "fiori-field-input fiori-field-active w-full text-sm leading-relaxed",
            "min-h-[9rem] sm:min-h-[10rem] md:min-h-[11rem] resize-y",
          )}
        />
      </div>
    </div>
  );
}
