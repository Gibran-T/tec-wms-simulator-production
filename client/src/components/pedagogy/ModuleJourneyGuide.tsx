import { useState } from "react";
import { ChevronDown, ChevronUp, Route } from "lucide-react";
import {
  JOURNEY_CONS_HINT,
  JOURNEY_MISSION_HINT,
  JOURNEY_PREP_HINT,
  JOURNEY_SECTIONS,
  JOURNEY_STEPS,
  JOURNEY_TEACHER_HINT,
  type JourneyVariant,
} from "@shared/pedagogy/moduleJourney";

type TranslateFn = (fr: string, en: string) => string;

export interface ModuleJourneyGuideProps {
  variant: JourneyVariant;
  language: "FR" | "EN";
  t: TranslateFn;
  moduleId?: number;
}

function loc(language: "FR" | "EN", pair: { fr: string; en: string }): string {
  return language === "FR" ? pair.fr : pair.en;
}

export default function ModuleJourneyGuide({
  variant,
  language,
  t,
  moduleId,
}: ModuleJourneyGuideProps) {
  const [open, setOpen] = useState(variant === "hub" || variant === "teacher");
  const compactHint =
    variant === "prep"
      ? JOURNEY_PREP_HINT
      : variant === "cons"
        ? JOURNEY_CONS_HINT
        : variant === "mission"
          ? JOURNEY_MISSION_HINT
          : variant === "teacher"
            ? JOURNEY_TEACHER_HINT
            : null;

  return (
    <section
      className="rounded-md border bg-card p-4 space-y-3"
      data-testid={`module-journey-guide-${variant}`}
      aria-label={t("Parcours d’apprentissage", "Learning path")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <Route size={16} className="text-primary shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              {moduleId
                ? t(`Parcours M${moduleId}`, `M${moduleId} path`)
                : t("Parcours d’apprentissage", "Learning path")}
            </p>
            <h2 className="text-sm font-semibold text-foreground">
              {t("Comment fonctionne ce module ?", "How does this module work?")}
            </h2>
          </div>
        </div>
        <button
          type="button"
          className="text-xs text-primary hover:underline inline-flex items-center gap-1 shrink-0"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {open ? t("Réduire", "Collapse") : t("Lire le parcours", "Read the path")}
        </button>
      </div>

      <ol className="grid grid-cols-2 md:grid-cols-6 gap-2" data-testid="module-journey-steps">
        {JOURNEY_STEPS.map((step) => (
          <li
            key={step.id}
            className="rounded-md border bg-slate-50 dark:bg-slate-800/60 px-2 py-2"
          >
            <p className="text-[11px] font-semibold text-foreground leading-tight">
              {loc(language, step.title)}
            </p>
          </li>
        ))}
      </ol>

      {compactHint && (
        <p className="text-xs text-muted-foreground leading-relaxed">{loc(language, compactHint)}</p>
      )}

      {open && (
        <div className="space-y-3 pt-1">
          {JOURNEY_STEPS.map((step) => (
            <p key={`${step.id}-body`} className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">{loc(language, step.title)} — </span>
              {loc(language, step.body)}
            </p>
          ))}
          {(variant === "hub" || variant === "glossary" || variant === "teacher") && (
            <div className="grid gap-3 md:grid-cols-2">
              {(Object.keys(JOURNEY_SECTIONS) as Array<keyof typeof JOURNEY_SECTIONS>).map((key) => {
                const section = JOURNEY_SECTIONS[key];
                return (
                  <div key={key} className="rounded-md border p-3 space-y-1">
                    <p className="text-xs font-semibold text-foreground">{loc(language, section.title)}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {loc(language, section.body)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
