import type { SlideContent } from "@/data/modules";
import MinMaxRopGraph from "./MinMaxRopGraph";
import WarehouseMacroFlow from "./WarehouseMacroFlow";
import WarehouseZonesDiagram from "./WarehouseZonesDiagram";
import CycleCountAdjDiagram from "./CycleCountAdjDiagram";
import KpiDashboardVisual from "./KpiDashboardVisual";
import IntegratedE2eFlow from "./IntegratedE2eFlow";

type Lang = "FR" | "EN";

interface Props {
  slide: SlideContent;
  lang: Lang;
  accentColor: string;
}

export default function SlideVisualRenderer({ slide, lang, accentColor }: Props) {
  if (!slide.visualType) return null;

  switch (slide.visualType) {
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
    default:
      return null;
  }
}
