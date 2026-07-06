import type { EmployeeProfileCompetency } from "@shared/enterprise/employeeProfile";
import { CheckCircle2, Circle } from "lucide-react";

interface CompetencyGridProps {
  competencies: EmployeeProfileCompetency[];
  language: "FR" | "EN";
  t: (fr: string, en: string) => string;
}

export default function CompetencyGrid({
  competencies,
  language,
  t,
}: CompetencyGridProps) {
  const acquired = competencies.filter((c) => c.acquired);
  const pending = competencies.filter((c) => !c.acquired);

  return (
    <div className="tec-briefing-panel p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {t("Compétences professionnelles", "Professional competencies")}
        </p>
        <span className="text-[10px] font-mono text-slate-500">
          {acquired.length}/{competencies.length}
        </span>
      </div>

      {acquired.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase text-emerald-700 dark:text-emerald-400">
            {t("Acquises", "Acquired")}
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {acquired.map((comp) => (
              <CompetencyChip key={comp.id} competency={comp} language={language} acquired />
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase text-slate-400">
            {t("En développement", "In development")}
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {pending.map((comp) => (
              <CompetencyChip key={comp.id} competency={comp} language={language} acquired={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CompetencyChip({
  competency,
  language,
  acquired,
}: {
  competency: EmployeeProfileCompetency;
  language: "FR" | "EN";
  acquired: boolean;
}) {
  const label = language === "FR" ? competency.label.fr : competency.label.en;
  const Icon = acquired ? CheckCircle2 : Circle;

  return (
    <div
      className={`flex items-start gap-2 p-2.5 border text-xs ${
        acquired
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
          : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30"
      }`}
    >
      <Icon
        size={14}
        className={`shrink-0 mt-0.5 ${acquired ? "text-emerald-600" : "text-slate-400"}`}
      />
      <div className="min-w-0">
        <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug">{label}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">M{competency.sourceModuleId}</p>
      </div>
    </div>
  );
}
