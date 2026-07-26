import { useLocation } from "wouter";
import { BookOpenCheck, Clock3 } from "lucide-react";
import type { FormativeExerciseMeta, FormativeExerciseStatus } from "@shared/formativeExercises";
import { formativeExercisePath } from "@shared/formativeExercises";

type TranslateFn = (fr: string, en: string) => string;

export interface FormativeExerciseCardProps {
  meta: FormativeExerciseMeta;
  status: FormativeExerciseStatus;
  language: "FR" | "EN";
  t: TranslateFn;
  recommendAfterQuiz?: boolean;
  recommendAfterMissions?: boolean;
}

function statusLabel(status: FormativeExerciseStatus, t: TranslateFn): string {
  if (status === "completed") return t("Complété", "Completed");
  if (status === "in_progress") return t("En cours", "In progress");
  return t("À faire", "To do");
}

function ctaLabel(status: FormativeExerciseStatus, t: TranslateFn): string {
  if (status === "completed") return t("Voir le résultat", "View result");
  if (status === "in_progress") return t("Continuer l’exercice", "Continue exercise");
  return t("Commencer l’exercice", "Start exercise");
}

function statusClasses(status: FormativeExerciseStatus): string {
  if (status === "completed") {
    return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200";
  }
  if (status === "in_progress") {
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200";
  }
  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
}

export default function FormativeExerciseCard({
  meta,
  status,
  language,
  t,
  recommendAfterQuiz = false,
  recommendAfterMissions = false,
}: FormativeExerciseCardProps) {
  const [, navigate] = useLocation();
  const title = language === "FR" ? meta.title.fr : meta.title.en;
  const subtitle = language === "FR" ? meta.subtitle.fr : meta.subtitle.en;
  const chain = language === "FR" ? meta.chain.fr : meta.chain.en;
  const duration = language === "FR" ? meta.duration.fr : meta.duration.en;
  const href = formativeExercisePath(meta.moduleId, meta.id);
  const resultHref = `${href}?view=result`;
  const redoHref = href;

  return (
    <article
      className="bg-card border rounded-md p-4 space-y-3"
      data-testid={`formative-card-${meta.id}`}
      data-formative-kind={meta.kind}
      aria-labelledby={`formative-title-${meta.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
            {meta.kind === "preparation"
              ? t("Exercice préparatoire", "Preparatory exercise")
              : t("Exercice de consolidation", "Consolidation exercise")}
          </p>
          <h3 id={`formative-title-${meta.id}`} className="text-base font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <span
          className={`text-[11px] font-semibold px-2 py-1 rounded-md shrink-0 ${statusClasses(status)}`}
          data-testid={`formative-status-${meta.id}`}
        >
          {statusLabel(status, t)}
        </span>
      </div>

      <p
        className="text-xs font-mono text-foreground/90 bg-slate-50 dark:bg-slate-800/80 border rounded-md px-2 py-1.5"
        data-testid={`formative-chain-${meta.id}`}
      >
        {chain}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock3 size={14} aria-hidden />
          {duration}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium text-foreground bg-background">
          <BookOpenCheck size={14} aria-hidden />
          {t("Exercice formatif — hors moyenne officielle", "Formative exercise — outside official average")}
        </span>
      </div>

      {(recommendAfterQuiz || recommendAfterMissions) && (
        <div className="flex flex-wrap gap-2" data-testid={`formative-soft-badge-${meta.id}`}>
          {recommendAfterQuiz && (
            <span className="text-[11px] px-2 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700">
              {t("Recommandé après le quiz", "Recommended after the quiz")}
            </span>
          )}
          {recommendAfterMissions && (
            <span className="text-[11px] px-2 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700">
              {t("Recommandé après les trois missions", "Recommended after the three missions")}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate(status === "completed" ? resultHref : href)}
          className="px-3 py-2 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`${ctaLabel(status, t)} — ${title}`}
          data-testid={`formative-cta-${meta.id}`}
        >
          {ctaLabel(status, t)}
        </button>
        {status === "completed" && (
          <button
            type="button"
            onClick={() => navigate(redoHref)}
            className="px-3 py-2 text-xs font-semibold rounded-md border bg-background hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`${t("Refaire l’exercice", "Redo exercise")} — ${title}`}
            data-testid={`formative-redo-${meta.id}`}
          >
            {t("Refaire l’exercice", "Redo exercise")}
          </button>
        )}
      </div>
    </article>
  );
}
