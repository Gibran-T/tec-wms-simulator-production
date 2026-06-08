import MinMaxRopGraph from "./MinMaxRopGraph";
import WarehouseMacroFlow from "./WarehouseMacroFlow";
import WarehouseZonesDiagram from "./WarehouseZonesDiagram";
import CycleCountAdjDiagram from "./CycleCountAdjDiagram";
import KpiDashboardVisual from "./KpiDashboardVisual";
import IntegratedE2eFlow from "./IntegratedE2eFlow";
import PutawayFlowDiagram from "./PutawayFlowDiagram";
import FifoLotsDiagram from "./FifoLotsDiagram";

type Lang = "FR" | "EN";

/** Normalize Manus visualComponent keys and legacy visualType keys to a canonical id. */
function normalizeVisualKey(type: string): string {
  const key = type.trim().toLowerCase().replace(/_/g, "-");
  const aliases: Record<string, string> = {
    "warehouse-layout": "warehouse-zones",
    "warehouselayout": "warehouse-zones",
    "warehouse-zones": "warehouse-zones",
    "receiving-flow": "warehouse-macro-flow",
    "receivingflow": "warehouse-macro-flow",
    "warehouse-macro-flow": "warehouse-macro-flow",
    "fifo-lifo": "fifo-lots",
    "fifolifo": "fifo-lots",
    "fifo-lots": "fifo-lots",
    "putaway-flow": "putaway-flow",
    "putawayflow": "putaway-flow",
    "min-max-rop": "min-max-rop-graph",
    "minmaxrop": "min-max-rop-graph",
    "min-max-rop-graph": "min-max-rop-graph",
    "cycle-count": "cycle-count-adj",
    "cyclecount": "cycle-count-adj",
    "cycle-count-adj": "cycle-count-adj",
    "kpi-dashboard": "kpi-dashboard",
    "kpidashboard": "kpi-dashboard",
    "fishbone-rca": "kpi-dashboard",
    "fishbonerca": "kpi-dashboard",
    "end-to-end-flow": "integrated-e2e-flow",
    "endtoendflow": "integrated-e2e-flow",
    "integrated-e2e-flow": "integrated-e2e-flow",
    "certification-readiness": "integrated-e2e-flow",
    "certificationreadiness": "integrated-e2e-flow",
  };
  return aliases[key] ?? key;
}

interface Props {
  type: string;
  lang: Lang;
  accentColor?: string;
}

export default function VisualComponentMapper({ type, lang, accentColor = "#0070f2" }: Props) {
  const normalized = normalizeVisualKey(type);

  switch (normalized) {
    case "min-max-rop-graph":
      return <MinMaxRopGraph lang={lang} accentColor={accentColor} />;
    case "warehouse-macro-flow":
      return <WarehouseMacroFlow lang={lang} accentColor={accentColor} />;
    case "warehouse-zones":
      return <WarehouseZonesDiagram lang={lang} />;
    case "cycle-count-adj":
      return <CycleCountAdjDiagram lang={lang} />;
    case "kpi-dashboard":
      return <KpiDashboardVisual lang={lang} />;
    case "integrated-e2e-flow":
      return <IntegratedE2eFlow lang={lang} />;
    case "putaway-flow":
      return <PutawayFlowDiagram lang={lang} />;
    case "fifo-lots":
      return <FifoLotsDiagram lang={lang} />;
    default:
      return null;
  }
}
