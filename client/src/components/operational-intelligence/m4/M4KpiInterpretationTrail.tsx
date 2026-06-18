import { CheckCircle, AlertTriangle, Clock } from "lucide-react";
import type { M4KpiInterpretationRow } from "@/data/m4KpiBandUtils";

type TrailChipState = "pending" | "correct" | "incorrect";

function chipState(
  completedSteps: string[],
  stepCode: string,
  row: M4KpiInterpretationRow | undefined,
): TrailChipState {
  if (!completedSteps.includes(stepCode)) return "pending";
  if (!row) return "pending";
  return row.isCorrect ? "correct" : "incorrect";
}

function latestInterpretation(
  rows: M4KpiInterpretationRow[] | undefined,
  kpiKey: string,
): M4KpiInterpretationRow | undefined {
  if (!rows?.length) return undefined;
  const matches = rows.filter((r) => r.kpiKey === kpiKey);
  return matches[matches.length - 1];
}

function extractStatusHint(feedback: string): string | null {
  const match = feedback.match(/→\s*(.+)$/);
  if (match) return match[1].trim().slice(0, 24);
  return null;
}

const CHIPS = [
  { step: "KPI_ROTATION", kpiKey: "rotationRate", labelFr: "Rotation", labelEn: "Turnover" },
  { step: "KPI_SERVICE", kpiKey: "serviceLevel", labelFr: "Service", labelEn: "Service" },
  { step: "KPI_DIAGNOSTIC", kpiKey: "diagnostic", labelFr: "Diagnostic", labelEn: "Diagnostic" },
] as const;

export default function M4KpiInterpretationTrail({
  completedSteps,
  kpiInterpretations,
  language,
  t,
}: {
  completedSteps: string[];
  kpiInterpretations?: M4KpiInterpretationRow[];
  language: string;
  t: (fr: string, en: string) => string;
}) {
  const isFr = language === "FR";

  return (
    <div className="space-y-1.5" data-testid="m4-interpretation-trail">
      <p className="text-[10px] font-bold text-slate-500 uppercase">
        {t("Piste d'interprétation", "Interpretation trail")}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {CHIPS.map((chip) => {
          const row = latestInterpretation(kpiInterpretations, chip.kpiKey);
          const state = chipState(completedSteps, chip.step, row);
          const label = isFr ? chip.labelFr : chip.labelEn;
          const hint = state === "correct" && row?.feedback ? extractStatusHint(row.feedback) : null;

          const stateClasses =
            state === "correct"
              ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-950/30 dark:text-green-300 dark:border-green-700"
              : state === "incorrect"
                ? "bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-600"
                : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600";

          const Icon = state === "correct" ? CheckCircle : state === "incorrect" ? AlertTriangle : Clock;

          return (
            <span
              key={chip.kpiKey}
              data-testid={`m4-trail-chip-${chip.kpiKey}`}
              title={row?.studentAnswer ? row.studentAnswer.slice(0, 80) : undefined}
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 border rounded-sm ${stateClasses}`}
            >
              <Icon size={11} className="shrink-0" />
              {label}
              {state === "correct" && hint && <span className="font-mono text-[9px] opacity-80">· {hint}</span>}
              {state === "pending" && <span className="text-[9px] opacity-70">⏳</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}
