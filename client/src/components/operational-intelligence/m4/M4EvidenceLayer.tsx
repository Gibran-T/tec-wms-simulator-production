import type { ReactNode } from "react";
import type { M4KpiInterpretationRow, M4KpiSnapshot } from "@/data/m4KpiBandUtils";
import M4KpiTiles from "./M4KpiTiles";
import M4KpiInterpretationTrail from "./M4KpiInterpretationTrail";
import M4KpiAmberAlerts from "./M4KpiAmberAlerts";
import M4KpiSnapshotHeader from "./M4KpiSnapshotHeader";
import PedagogicalAnalyticsPanel from "@/components/analytical/PedagogicalAnalyticsPanel";

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
      {showSnapshot && (
        <M4KpiSnapshotHeader snapshot={snapshot} scnCode={scnCode} language={language} t={t} variant="cockpit" />
      )}
      <M4KpiTiles snapshot={snapshot} scnCode={scnCode} language={language} t={t} />
      <PedagogicalAnalyticsPanel scnCode={scnCode} language={language} t={t} />
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
      {towerView}
    </div>
  );
}
