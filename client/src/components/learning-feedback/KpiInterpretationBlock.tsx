import { getBandClasses, type BandColor } from "@/data/m4KpiBandUtils";
import type { LearningFeedbackStep } from "@shared/learningFeedbackTypes";
import { pickBilingual } from "@shared/learningFeedbackTypes";

const STATUS_TO_COLOR: Record<string, BandColor> = {
  critical: "red",
  acceptable: "amber",
  normal: "amber",
  excellent: "green",
  neutral: "neutral",
};

type Props = {
  step: LearningFeedbackStep;
  language: "fr" | "en";
  t: (fr: string, en: string) => string;
};

export default function KpiInterpretationBlock({ step, language, t }: Props) {
  const { kpiInterpretation } = step;
  return (
    <div
      className="rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-3 space-y-2"
      data-testid={`learning-kpi-interpretation-${step.stepCode}`}
      role="region"
      aria-labelledby={`kpi-interpretation-${step.stepCode}`}
    >
      <p id={`kpi-interpretation-${step.stepCode}`} className="text-[10px] font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300">
        {t("Interprétation KPI", "KPI Interpretation")}
      </p>
      {kpiInterpretation.bands.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {kpiInterpretation.bands.map((band) => {
            const color = STATUS_TO_COLOR[band.status] ?? "neutral";
            const classes = getBandClasses(color);
            return (
              <span
                key={`${step.stepCode}-${band.kpiKey}`}
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${classes.border} ${classes.bg} ${classes.text}`}
              >
                {band.value} {band.status.toUpperCase()}
              </span>
            );
          })}
        </div>
      )}
      <p className="text-xs text-foreground leading-relaxed">{pickBilingual(kpiInterpretation.lens, language)}</p>
      {kpiInterpretation.bands.map((band) =>
        band.formulaHint ? (
          <p key={`formula-${band.kpiKey}`} className="text-[10px] font-mono text-muted-foreground">
            {pickBilingual(band.formulaHint, language)}
          </p>
        ) : null,
      )}
    </div>
  );
}
