import { useMemo, useState } from "react";
import { CheckCircle2, GraduationCap, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMicroDrillsForModule, type MicroDrill } from "@shared/pedagogy/microDrills";

type TranslateFn = (fr: string, en: string) => string;

function DrillCard({
  drill,
  t,
  language,
}: {
  drill: MicroDrill;
  t: TranslateFn;
  language: string;
}) {
  const lang = language === "en" ? "en" : "fr";
  const [selected, setSelected] = useState<string | undefined>();
  const [revealed, setRevealed] = useState(false);
  const chosen = useMemo(
    () => drill.options.find((o) => o.id === selected) ?? null,
    [drill.options, selected],
  );

  return (
    <div className="rounded-md border border-border bg-card p-3 space-y-2" data-testid={`micro-drill-${drill.id}`}>
      <p className="text-sm text-foreground leading-snug">{drill.prompt[lang]}</p>
      {drill.context ? (
        <p className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 leading-snug">
          {drill.context[lang]}
        </p>
      ) : null}
      <Select
        value={selected}
        onValueChange={(id) => {
          setSelected(id);
          setRevealed(false);
        }}
      >
        <SelectTrigger className="w-full h-auto min-h-9 whitespace-normal text-left">
          <SelectValue placeholder={t("Choisir parmi 5 réponses", "Choose among 5 answers")} />
        </SelectTrigger>
        <SelectContent className="max-w-[min(100vw-2rem,36rem)]">
          {drill.options.map((opt, idx) => (
            <SelectItem key={opt.id} value={opt.id} className="whitespace-normal py-2">
              <span className="text-[11px] font-semibold text-muted-foreground mr-1">
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt.label[lang]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        disabled={!selected}
        onClick={() => setRevealed(true)}
      >
        {t("Vérifier", "Check")}
      </Button>
      {revealed && chosen ? (
        <div
          className={
            chosen.isCorrect
              ? "rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 flex gap-2"
              : "rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900 flex gap-2"
          }
          role="alert"
        >
          {chosen.isCorrect ? (
            <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="size-4 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold">
              {chosen.isCorrect
                ? t("Correct", "Correct")
                : t("Incorrect — relisez le pourquoi", "Incorrect — read why")}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed">{chosen.why[lang]}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function MicroDrillPanel({
  moduleId,
  t,
  language,
}: {
  moduleId: number;
  t: TranslateFn;
  language: string;
}) {
  const drills = getMicroDrillsForModule(moduleId);
  if (drills.length === 0) return null;

  return (
    <section className="rounded-lg border border-sky-200 bg-sky-50/50 p-4 space-y-3" data-testid={`micro-drills-m${moduleId}`}>
      <div className="flex items-start gap-2">
        <GraduationCap className="size-4 text-sky-700 mt-0.5" />
        <div>
          <h2 className="text-sm font-semibold text-sky-950">
            {t("Micro-drills (Show → Try)", "Micro-drills (Show → Try)")}
          </h2>
          <p className="text-[11px] text-sky-900/80">
            {t(
              "Jugement situationnel (style SAP) : 5 options proches, une seule correcte. Ne compte pas dans le score des scénarios.",
              "Situational judgment (SAP-style): 5 near-miss options, only one correct. Does not count toward scenario score.",
            )}
          </p>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {drills.map((drill) => (
          <DrillCard key={drill.id} drill={drill} t={t} language={language} />
        ))}
      </div>
    </section>
  );
}
