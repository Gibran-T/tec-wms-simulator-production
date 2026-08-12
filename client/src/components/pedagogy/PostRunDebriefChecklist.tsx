import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type TranslateFn = (fr: string, en: string) => string;

const PROMPTS = [
  {
    id: "observe",
    fr: "Qu’ai-je observé (stock, document, KPI, alerte) ?",
    en: "What did I observe (stock, document, KPI, alert)?",
  },
  {
    id: "evidence",
    fr: "Quelle évidence ai-je utilisée ?",
    en: "What evidence did I use?",
  },
  {
    id: "decision",
    fr: "Quelle décision ai-je prise — et pourquoi ?",
    en: "What decision did I make — and why?",
  },
  {
    id: "compliance",
    fr: "Que la conformité a-t-elle validé ?",
    en: "What did compliance validate?",
  },
  {
    id: "next",
    fr: "Une erreur que je ne répéterai pas :",
    en: "One error I will not repeat:",
  },
] as const;

/**
 * Lightweight post-run debrief checklist (local only — no grade impact).
 */
export default function PostRunDebriefChecklist({ t, language }: { t: TranslateFn; language: string }) {
  const lang = language === "en" ? "en" : "fr";
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const completed = PROMPTS.filter((p) => done[p.id]).length;

  return (
    <section
      className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-4 space-y-3"
      data-testid="post-run-debrief-checklist"
    >
      <div className="flex items-start gap-2">
        <ClipboardCheck className="size-4 text-indigo-700 mt-0.5" />
        <div>
          <h2 className="text-sm font-semibold text-indigo-950">
            {t("Debrief structuré (5 min)", "Structured debrief (5 min)")}
          </h2>
          <p className="text-[11px] text-indigo-900/80">
            {t(
              "Observe → évidence → décision → conformité → 1 erreur à ne pas répéter. Local — n’affecte pas la note.",
              "Observe → evidence → decision → compliance → 1 error not to repeat. Local — does not affect the grade.",
            )}{" "}
            ({completed}/{PROMPTS.length})
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {PROMPTS.map((p) => (
          <li key={p.id} className="rounded-md border border-indigo-100 bg-white p-2.5 space-y-1.5">
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="mt-1"
                checked={!!done[p.id]}
                onChange={(e) => setDone((prev) => ({ ...prev, [p.id]: e.target.checked }))}
              />
              <span>{p[lang]}</span>
            </label>
            <textarea
              rows={2}
              className="w-full text-xs rounded border border-slate-200 px-2 py-1.5"
              placeholder={t("Note personnelle (optionnel)", "Personal note (optional)")}
              value={notes[p.id] ?? ""}
              onChange={(e) => setNotes((prev) => ({ ...prev, [p.id]: e.target.value }))}
            />
          </li>
        ))}
      </ul>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => {
          setDone({});
          setNotes({});
        }}
      >
        {t("Réinitialiser le debrief", "Reset debrief")}
      </Button>
    </section>
  );
}
