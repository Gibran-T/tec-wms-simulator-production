import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Eye, Wrench } from "lucide-react";
import { getErrorSchoolForModule } from "@shared/pedagogy/errorSchool";

type TranslateFn = (fr: string, en: string) => string;

export default function ErrorSchoolPanel({
  moduleId,
  t,
  language,
}: {
  moduleId: number;
  t: TranslateFn;
  language: string;
}) {
  const cards = getErrorSchoolForModule(moduleId);
  const [open, setOpen] = useState(moduleId <= 3);
  if (cards.length === 0) return null;
  const lang = language === "en" ? "en" : "fr";

  return (
    <section
      className="rounded-lg border border-rose-200/80 bg-rose-50/40 overflow-hidden"
      data-testid={`error-school-m${moduleId}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-rose-600" />
          <div>
            <p className="text-sm font-semibold text-rose-900">
              {t("Error School — pièges opérationnels", "Error School — operational traps")}
            </p>
            <p className="text-[11px] text-rose-800/80">
              {t(
                "Lisez avant les scénarios : cause → évidence → action correcte.",
                "Read before scenarios: cause → evidence → correct action.",
              )}
            </p>
          </div>
        </div>
        {open ? <ChevronUp className="size-4 text-rose-700" /> : <ChevronDown className="size-4 text-rose-700" />}
      </button>

      {open && (
        <div className="px-4 pb-4 grid gap-3 sm:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.id}
              className="rounded-md border border-rose-200 bg-white p-3 space-y-2"
              data-testid={`error-school-card-${card.id}`}
            >
              <h3 className="text-sm font-semibold text-foreground">{card.title[lang]}</h3>
              <p className="text-[11px] text-muted-foreground leading-snug">
                <span className="font-semibold text-rose-700">{t("Piège", "Trap")}: </span>
                {card.trap[lang]}
              </p>
              <p className="text-[11px] text-slate-700 leading-snug flex gap-1.5">
                <Eye className="size-3.5 shrink-0 mt-0.5 text-slate-500" />
                <span>
                  <span className="font-semibold">{t("Évidence", "Evidence")}: </span>
                  {card.evidence[lang]}
                </span>
              </p>
              <p className="text-[11px] text-emerald-800 leading-snug flex gap-1.5">
                <Wrench className="size-3.5 shrink-0 mt-0.5" />
                <span>
                  <span className="font-semibold">{t("Action", "Action")}: </span>
                  {card.action[lang]}
                </span>
              </p>
              {card.scnHints?.length ? (
                <p className="text-[10px] font-mono text-slate-500">{card.scnHints.join(" · ")}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
