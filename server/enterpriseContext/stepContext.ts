import type { ContextBlock, CurrentStepContextBlock } from "../../shared/enterpriseContext/types";

export interface StepSnapshot {
  activeStepCode: string | null;
  activeStepLabelFr: string | null;
  activeStepLabelEn: string | null;
  completedSteps: string[];
  progressPct: number;
  runStatus: string;
  isDemo: boolean;
  moduleId: number;
}

const OIL_FOCUS_BY_MODULE: Record<number, string> = {
  1: "transaction_monitor",
  2: "zone_capacity",
  3: "inventory_governance",
  4: "kpi_evidence",
  5: "peak_ledger",
};

export function buildStepContext(snapshot: StepSnapshot): ContextBlock<CurrentStepContextBlock> {
  return {
    blockId: "currentStep",
    sensitivity: "medium",
    data: {
      activeStepCode: snapshot.activeStepCode,
      activeStepLabel:
        snapshot.activeStepCode && (snapshot.activeStepLabelFr || snapshot.activeStepLabelEn)
          ? {
              fr: snapshot.activeStepLabelFr ?? snapshot.activeStepCode,
              en: snapshot.activeStepLabelEn ?? snapshot.activeStepCode,
            }
          : null,
      completedSteps: snapshot.completedSteps,
      progressPct: snapshot.progressPct,
      runStatus: snapshot.runStatus,
      isDemo: snapshot.isDemo,
      oilFocus: OIL_FOCUS_BY_MODULE[snapshot.moduleId] ?? null,
    },
  };
}
