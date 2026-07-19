import type { ReactNode } from "react";
import type { M4KpiInterpretationRow, M4KpiSnapshot } from "@/data/m4KpiBandUtils";
import M4KpiTiles from "./M4KpiTiles";
import M4KpiInterpretationTrail from "./M4KpiInterpretationTrail";
import M4KpiAmberAlerts from "./M4KpiAmberAlerts";
import M4KpiSnapshotHeader from "./M4KpiSnapshotHeader";
import M4KpiControlTower from "./M4KpiControlTower";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

/**
 * M4 evidence layer — three visual levels:
 * 1. Essential decision view (Control Tower)
 * 2. Supporting evidence (tiles, trail, alerts)
 * 3. Advanced references (collapsible framing tower + snapshot)
 */
export default function M4EvidenceLayer({
  scnCode,
  completedSteps,
  snapshot,
  kpiInterpretations,
  language,
  t,
  showSnapshot = true,
  towerView,
}: {
  scnCode: string;
  completedSteps: string[];
  snapshot: M4KpiSnapshot;
  kpiInterpretations?: M4KpiInterpretationRow[];
  language: string;
  t: (fr: string, en: string) => string;
  showSnapshot?: boolean;
  towerView: ReactNode;
}) {
  return (
    <div className="space-y-3" data-testid="m4-evidence-layer">
      {/* LEVEL 1 — Essential decision view */}
      <M4KpiControlTower scnCode={scnCode} language={language} t={t} />

      {/* LEVEL 2 — Supporting evidence */}
      <section className="space-y-3" data-testid="m4-evidence-supporting" aria-label={t("Preuves de support", "Supporting evidence")}>
        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
          {t("Preuves de support", "Supporting evidence")}
        </p>
        <M4KpiTiles snapshot={snapshot} scnCode={scnCode} language={language} t={t} />
        <M4KpiInterpretationTrail
          completedSteps={completedSteps}
          kpiInterpretations={kpiInterpretations}
          language={language}
          t={t}
        />
        <M4KpiAmberAlerts
          scnCode={scnCode}
          completedSteps={completedSteps}
          kpiInterpretations={kpiInterpretations}
          t={t}
        />
      </section>

      {/* LEVEL 3 — Advanced references */}
      <Collapsible defaultOpen={false} data-testid="m4-evidence-advanced">
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-sm border border-border bg-card px-3 py-2 text-left text-[10px] font-bold uppercase text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <span>
            {t(
              "Références avancées — cadrage mission, extrait KPI, conformité",
              "Advanced references — mission framing, KPI extract, compliance",
            )}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-3">
          {showSnapshot && (
            <M4KpiSnapshotHeader snapshot={snapshot} scnCode={scnCode} language={language} t={t} variant="cockpit" />
          )}
          {towerView}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
