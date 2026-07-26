import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import type { FormativeExerciseMeta } from "@shared/formativeExercises";

type TranslateFn = (fr: string, en: string) => string;

export interface FormativeExerciseShellProps {
  meta: FormativeExerciseMeta;
  language: "FR" | "EN";
  t: TranslateFn;
  onBack: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export default function FormativeExerciseShell({
  meta,
  language,
  t,
  onBack,
  children,
  footer,
}: FormativeExerciseShellProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-4" data-testid={`formative-shell-${meta.id}`}>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
        aria-label={t("Retour au module", "Back to module")}
      >
        <ArrowLeft size={16} aria-hidden />
        {t(`Retour M${meta.moduleId}`, `Back to M${meta.moduleId}`)}
      </button>

      <header className="rounded-md border bg-card p-4 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
          {t("Exercice formatif — hors moyenne officielle", "Formative exercise — outside official average")}
        </p>
        <h1 className="text-xl font-bold text-foreground">
          {language === "FR" ? meta.title.fr : meta.title.en}
        </h1>
        <p className="text-sm text-muted-foreground">
          {language === "FR" ? meta.subtitle.fr : meta.subtitle.en}
        </p>
        <p className="text-xs font-mono bg-slate-50 dark:bg-slate-800 border rounded-md px-2 py-1.5">
          {language === "FR" ? meta.chain.fr : meta.chain.en}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("Durée estimée", "Estimated duration")}:{" "}
          {language === "FR" ? meta.duration.fr : meta.duration.en}
        </p>
      </header>

      <div className="space-y-5">{children}</div>
      {footer}
    </div>
  );
}
