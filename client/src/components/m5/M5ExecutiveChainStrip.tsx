import React from "react";
import { Package, BarChart3, Compass, GitBranch, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type PhaseId = "ops" | "kpi" | "decision" | "consequence";

function resolveActivePhase(completedSteps: string[], nextStepCode?: string): PhaseId {
  if (completedSteps.includes("M5_DECISION")) return "consequence";
  if (nextStepCode === "M5_DECISION" || completedSteps.includes("M5_KPI")) return "decision";
  if (nextStepCode === "M5_KPI" || completedSteps.includes("M5_REPLENISH")) return "kpi";
  return "ops";
}

export default function M5ExecutiveChainStrip({
  completedSteps,
  nextStepCode,
  scnCode,
}: {
  completedSteps: string[];
  nextStepCode?: string;
  scnCode: string | null;
}) {
  const { t } = useLanguage();
  const active = resolveActivePhase(completedSteps, nextStepCode);

  const phases = [
    {
      id: "ops" as const,
      icon: Package,
      labelFr: "Opérations",
      labelEn: "Operations",
      hintFr: "Moniteur + stocks = preuves",
      hintEn: "Monitor + stock = evidence",
    },
    {
      id: "kpi" as const,
      icon: BarChart3,
      labelFr: "KPI",
      labelEn: "KPI",
      hintFr: "Snapshot alimenté par le cycle",
      hintEn: "Snapshot fed by the cycle",
    },
    {
      id: "decision" as const,
      icon: Compass,
      labelFr: "Décision",
      labelEn: "Decision",
      hintFr: scnCode === "SCN-017"
        ? "Stratégique — citez vos KPI"
        : "Tactique — reliez aux KPI",
      hintEn: scnCode === "SCN-017"
        ? "Strategic — cite your KPIs"
        : "Tactical — link to KPIs",
    },
    {
      id: "consequence" as const,
      icon: GitBranch,
      labelFr: "Conséquence",
      labelEn: "Consequence",
      hintFr: "Impact pédagogique post-décision",
      hintEn: "Pedagogical impact post-decision",
    },
  ];

  const order: PhaseId[] = ["ops", "kpi", "decision", "consequence"];
  const activeIdx = order.indexOf(active);

  return (
    <div
      className="bg-slate-900 text-white border-l-4 border-primary px-4 py-3 rounded-none"
      data-testid="m5-executive-chain"
    >
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        {t("Chaîne exécutive Peak Week", "Peak Week executive chain")}
      </p>
      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        {phases.map((phase, idx) => {
          const Icon = phase.icon;
          const isActive = phase.id === active;
          const isPast = order.indexOf(phase.id) < activeIdx;
          const label = t(phase.labelFr, phase.labelEn);
          return (
            <React.Fragment key={phase.id}>
              <div
                className={`flex items-center gap-2 px-2 py-1.5 border ${
                  isActive
                    ? "bg-primary/20 border-primary text-white"
                    : isPast
                      ? "bg-slate-800 border-slate-600 text-slate-300"
                      : "bg-slate-800/50 border-slate-700 text-slate-500"
                }`}
                title={t(phase.hintFr, phase.hintEn)}
              >
                <Icon size={14} className={isActive ? "text-primary" : "text-slate-400"} />
                <div>
                  <p className="text-[10px] font-black uppercase">{label}</p>
                  {isActive && (
                    <p className="text-[8px] text-slate-400 hidden sm:block">
                      {t(phase.hintFr, phase.hintEn)}
                    </p>
                  )}
                </div>
              </div>
              {idx < phases.length - 1 && (
                <ChevronRight size={14} className="text-slate-600 hidden sm:block flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
