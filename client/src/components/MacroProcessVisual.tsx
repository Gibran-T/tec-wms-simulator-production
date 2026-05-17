/**
 * MacroProcessVisual — Reusable horizontal process chain visual
 * Used as the visual standard for all TEC.LOG modules (M1–M5).
 *
 * Renders a compact, dark-navy, arrow-connected step chain
 * with the current active step highlighted.
 */

import { useLanguage } from "@/contexts/LanguageContext";

export interface ProcessStep {
  labelFr: string;
  labelEn: string;
  icon: string;
  isActive?: boolean;   // highlight this step (current module focus)
  isKey?: boolean;      // secondary accent (important but not current)
}

interface MacroProcessVisualProps {
  steps: ProcessStep[];
  moduleColor?: string; // hex color for active step accent
  titleFr?: string;
  titleEn?: string;
}

export function MacroProcessVisual({
  steps,
  moduleColor = "#3B82F6",
  titleFr = "Flux opérationnel",
  titleEn = "Operational Flow",
}: MacroProcessVisualProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-border bg-card/60 px-4 py-3 mb-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-0.5 w-6 rounded" style={{ backgroundColor: moduleColor }} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {t(titleFr, titleEn)}
        </span>
      </div>

      {/* Step chain — scrollable on small screens */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-0 min-w-max">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              {/* Step node */}
              <div
                className={`
                  flex flex-col items-center justify-center
                  rounded-lg px-2.5 py-1.5 text-center
                  transition-all duration-200
                  ${step.isActive
                    ? "text-white shadow-md"
                    : step.isKey
                    ? "bg-secondary/80 text-foreground border border-border"
                    : "bg-secondary/40 text-muted-foreground border border-border/50"
                  }
                `}
                style={step.isActive ? { backgroundColor: moduleColor } : undefined}
              >
                <span className="text-base leading-none mb-0.5">{step.icon}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wide leading-tight whitespace-nowrap ${step.isActive ? "text-white" : ""}`}>
                  {t(step.labelFr, step.labelEn)}
                </span>
              </div>

              {/* Arrow connector (not after last step) */}
              {i < steps.length - 1 && (
                <div className="flex items-center px-0.5">
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="opacity-40">
                    <path d="M0 5H11M11 5L7 1M11 5L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Module-specific process chain definitions ────────────────────────────────

export const M1_PROCESS: ProcessStep[] = [
  { icon: "📋", labelFr: "PO", labelEn: "PO", isActive: true },
  { icon: "📦", labelFr: "GR", labelEn: "GR", isActive: true },
  { icon: "🗄️", labelFr: "PUTAWAY", labelEn: "PUTAWAY", isActive: true },
  { icon: "📊", labelFr: "STOCK", labelEn: "STOCK", isActive: true },
  { icon: "🛒", labelFr: "SO", labelEn: "SO", isActive: true },
  { icon: "📤", labelFr: "GI", labelEn: "GI", isActive: true },
  { icon: "🔄", labelFr: "CC", labelEn: "CC", isActive: true },
  { icon: "✅", labelFr: "COMPLIANCE", labelEn: "COMPLIANCE", isActive: true },
];

export const M2_PROCESS: ProcessStep[] = [
  { icon: "📥", labelFr: "RÉCEPTION", labelEn: "RECEIVING", isActive: true },
  { icon: "🔍", labelFr: "QC", labelEn: "QC", isActive: true },
  { icon: "🗄️", labelFr: "PUTAWAY", labelEn: "PUTAWAY", isActive: true },
  { icon: "📍", labelFr: "BIN LOCATION", labelEn: "BIN LOCATION", isActive: true },
  { icon: "🔬", labelFr: "FIFO/LOTS", labelEn: "FIFO/LOTS", isActive: true },
  { icon: "🛒", labelFr: "PICKING", labelEn: "PICKING", isActive: true },
  { icon: "🎯", labelFr: "PRÉCISION", labelEn: "ACCURACY", isActive: true },
];

export const M3_PROCESS: ProcessStep[] = [
  { icon: "📊", labelFr: "VÉRIF. STOCK", labelEn: "STOCK CHECK", isActive: true },
  { icon: "⚠️", labelFr: "ÉCART", labelEn: "VARIANCE", isActive: true },
  { icon: "🔄", labelFr: "CYCLE COUNT", labelEn: "CYCLE COUNT", isActive: true },
  { icon: "🔧", labelFr: "AJUSTEMENT", labelEn: "ADJUSTMENT", isActive: true },
  { icon: "📏", labelFr: "MIN/MAX", labelEn: "MIN/MAX", isActive: true },
  { icon: "🔁", labelFr: "RÉAPPRO.", labelEn: "REPLENISHMENT", isActive: true },
  { icon: "🛡️", labelFr: "PRÉVENTION", labelEn: "PREVENTION", isActive: true },
];

export const M4_PROCESS: ProcessStep[] = [
  { icon: "🗃️", labelFr: "DONNÉES", labelEn: "DATA", isActive: true },
  { icon: "📈", labelFr: "KPI", labelEn: "KPI", isActive: true },
  { icon: "📊", labelFr: "DASHBOARD", labelEn: "DASHBOARD", isActive: true },
  { icon: "🔍", labelFr: "ANALYSE ÉCART", labelEn: "GAP ANALYSIS", isActive: true },
  { icon: "🔎", labelFr: "CAUSE RACINE", labelEn: "ROOT CAUSE", isActive: true },
  { icon: "📋", labelFr: "PLAN ACTION", labelEn: "ACTION PLAN", isActive: true },
  { icon: "🚀", labelFr: "AMÉLIORATION", labelEn: "IMPROVEMENT", isActive: true },
];

export const M5_PROCESS: ProcessStep[] = [
  { icon: "🔗", labelFr: "FLUX E2E", labelEn: "E2E FLOW", isActive: true },
  { icon: "🚨", labelFr: "INCIDENT", labelEn: "INCIDENT", isActive: true },
  { icon: "🧭", labelFr: "DÉCISION", labelEn: "DECISION", isActive: true },
  { icon: "🔧", labelFr: "CORRECTION", labelEn: "CORRECTION", isActive: true },
  { icon: "✅", labelFr: "VALIDATION ERP", labelEn: "ERP VALIDATION", isActive: true },
  { icon: "🎓", labelFr: "CERTIFICATION", labelEn: "CERTIFICATION", isActive: true },
];

// Map module ID → process chain
export const MODULE_PROCESS_MAP: Record<number, ProcessStep[]> = {
  1: M1_PROCESS,
  2: M2_PROCESS,
  3: M3_PROCESS,
  4: M4_PROCESS,
  5: M5_PROCESS,
};
