import type { SlideVisualType, SlideVisualVariant } from "@/data/slideVisualMap";
import {
  VisualFrame,
  FlowPipeline,
  FlowVertical,
  KpiGrid,
  ScnList,
  DocCard,
  CertBadge,
  MiniGauge,
  IntegrationStack,
  FioriTileGrid,
  WhZone,
} from "./FioriPrimitives";

export type PremiumVisualProps = {
  moduleId: number;
  slideId: number;
  visualType: SlideVisualType;
  variant: SlideVisualVariant;
  accent: string;
  title: string;
  scenarioMap?: string[];
};

function scnStatus(code: string): "green" | "yellow" | "red" {
  const n = parseInt(code.replace("SCN-", ""), 10);
  if (n >= 16) return "red";
  if (n >= 9) return "yellow";
  return "green";
}

function renderBySlide({ moduleId, slideId, accent }: PremiumVisualProps) {
  const key = `${moduleId}-${slideId}`;

  switch (key) {
    case "1-1":
      return (
        <VisualFrame title="TEC.LOG · Portal pédagogique" subtitle="Collège de la Concorde" accent={accent}>
          <FioriTileGrid accent={accent} labels={["ERP/WMS", "Flux PO→GI", "SAP Fiori", "Mini-WMS", "SCN Lab", "Certification"]} />
          <p className="text-center text-[10px] text-muted-foreground mt-4">Module 1 · Fondements chaîne logistique · 10 slides</p>
        </VisualFrame>
      );
    case "1-2":
      return (
        <VisualFrame title="Flux logistique intégré" subtitle="SCN-001 → SCN-005" accent={accent}>
          <FlowPipeline steps={["PO", "GR", "Putaway", "Stock", "SO", "GI", "CC", "✓"]} accent={accent} />
        </VisualFrame>
      );
    case "1-3":
      return (
        <VisualFrame title="Purchase Order (PO)" subtitle="ME21N · Commande fournisseur" accent={accent}>
          <DocCard accent={accent} title="PO · Document d'achat" fields={[{ k: "Vendor", v: "V-1001" }, { k: "SKU", v: "SKU-001" }, { k: "Qty", v: "100 EA" }, { k: "Plant", v: "MTL-01" }, { k: "Status", v: "Open" }]} />
        </VisualFrame>
      );
    case "1-4":
      return (
        <VisualFrame title="Goods Receipt (GR)" subtitle="MIGO · Réception dock REC-01" accent={accent}>
          <svg viewBox="0 0 320 140" className="w-full max-w-sm mx-auto">
            <WhZone label="REC-01" sub="Dock" accent={accent} x={20} y={20} w={100} h={60} />
            <WhZone label="STOCKAGE" sub="Bins" accent={accent} x={140} y={20} w={160} h={60} />
            <text x={160} y={110} textAnchor="middle" fontSize={10} className="fill-muted-foreground">GR → Putaway → Stock</text>
          </svg>
        </VisualFrame>
      );
    case "1-5":
      return (
        <VisualFrame title="Stock & Inventaire" subtitle="Bins · Quantités · Traçabilité" accent={accent}>
          <svg viewBox="0 0 320 150" className="w-full max-w-sm mx-auto">
            {[0, 1, 2].map((row) => [0, 1, 2].map((col) => (
              <WhZone key={`${row}-${col}`} label={`B-0${row + 1}`} sub={`L${col + 1}`} accent={accent} x={20 + col * 100} y={20 + row * 42} w={88} h={36} />
            )))}
          </svg>
        </VisualFrame>
      );
    case "1-6":
      return (
        <VisualFrame title="Sales Order (SO)" subtitle="VA01 · Allocation stock" accent={accent}>
          <FlowPipeline steps={["SO", "Check stock", "Allocate", "Pick list"]} accent={accent} />
          <DocCard accent={accent} title="SO · Commande client" fields={[{ k: "Customer", v: "C-2001" }, { k: "SKU", v: "SKU-001" }, { k: "Qty", v: "20 EA" }]} />
        </VisualFrame>
      );
    case "1-7":
      return (
        <VisualFrame title="Goods Issue (GI)" subtitle="VL02N · Expédition EXP" accent={accent}>
          <FlowPipeline steps={["Pick", "Pack", "GI", "Ship"]} accent={accent} />
          <svg viewBox="0 0 320 60" className="w-full max-w-sm mx-auto mt-2">
            <WhZone label="PICK" accent={accent} x={40} y={10} w={80} h={40} />
            <WhZone label="EXP" accent={accent} x={200} y={10} w={80} h={40} />
          </svg>
        </VisualFrame>
      );
    case "1-8":
      return (
        <VisualFrame title="Cycle Count & Conformité" subtitle="MI01 · MI04 · MI07" accent={accent}>
          <FlowVertical steps={["Plan CC (MI01)", "Count (MI04)", "Post variance (MI07)", "Audit trail"]} accent={accent} />
        </VisualFrame>
      );
    case "1-9":
      return (
        <VisualFrame title="Scénarios M1" subtitle="Application pratique Mini-WMS" accent={accent}>
          <ScnList accent={accent} items={[
            { code: "SCN-001", label: "Cycle propre PO→GR→SO→GI", status: "green" },
            { code: "SCN-002", label: "GR non postée · réception fantôme", status: "green" },
            { code: "SCN-003", label: "Stock insuffisant", status: "yellow" },
            { code: "SCN-004", label: "Écart inventaire", status: "yellow" },
            { code: "SCN-005", label: "Non-conformités multiples", status: "yellow" },
          ]} />
        </VisualFrame>
      );
    case "1-10":
      return (
        <VisualFrame title="Certification Silver" subtitle="Parcours M1 complet" accent={accent}>
          <CertBadge tier="silver" lines={["Quiz M1 ≥ 60%", "SCN-001 → SCN-005", "Checklist conformité", "Badge numérique · à venir"]} />
        </VisualFrame>
      );
    case "2-1":
      return (
        <VisualFrame title="Layout entrepôt" subtitle="Zones REC · STOCK · PICK · EXP" accent={accent}>
          <svg viewBox="0 0 360 120" className="w-full">
            <WhZone label="REC" sub="Réception" accent={accent} x={10} y={20} w={75} h={50} />
            <WhZone label="STOCK" sub="Stockage" accent={accent} x={95} y={20} w={75} h={50} />
            <WhZone label="PICK" sub="Prélèvement" accent={accent} x={180} y={20} w={75} h={50} />
            <WhZone label="EXP" sub="Expédition" accent={accent} x={265} y={20} w={75} h={50} />
            <WhZone label="B-01-R1-L1" accent={accent} x={95} y={85} w={120} h={30} />
          </svg>
        </VisualFrame>
      );
    case "2-2":
      return (
        <VisualFrame title="Réception & Putaway" subtitle="ASN → GR → Emplacement" accent={accent}>
          <FlowPipeline steps={["ASN", "GR", "QC", "Putaway", "Confirm"]} accent={accent} />
        </VisualFrame>
      );
    case "2-3":
      return (
        <VisualFrame title="Gestion des emplacements" subtitle="Structure bin hiérarchique" accent={accent}>
          <FlowVertical steps={["Zone B-01", "Rack R1", "Level L1", "Bin B-01-R1-L1"]} accent={accent} />
        </VisualFrame>
      );
    case "2-4":
      return (
        <VisualFrame title="Contrôle capacité" subtitle="Max qty · Volume · Poids" accent={accent}>
          <div className="flex justify-center gap-6 py-2">
            <MiniGauge label="Capacité" value="78%" pct={78} accent={accent} />
            <MiniGauge label="Occupation" value="62%" pct={62} accent="#059669" />
          </div>
          <p className="text-center text-[10px] text-muted-foreground">SCN-007 · Validation capacité bin</p>
        </VisualFrame>
      );
    case "2-5":
      return (
        <VisualFrame title="Stratégie FIFO" subtitle="Premier entré · premier sorti" accent={accent}>
          <FlowVertical steps={["Lot A · 01-Jan", "Lot B · 15-Jan", "Lot C · 01-Feb", "→ Pick oldest first"]} accent={accent} />
        </VisualFrame>
      );
    case "2-6":
      return (
        <VisualFrame title="Configuration WMS" subtitle="Emplacements · Règles · Routes" accent={accent}>
          <FioriTileGrid accent={accent} labels={["Warehouse", "Locations", "Routes", "Putaway", "Pick strat.", "Lots"]} />
        </VisualFrame>
      );
    case "2-7":
      return (
        <VisualFrame title="Scénarios M2" subtitle="Exécution entrepôt" accent={accent}>
          <ScnList accent={accent} items={[
            { code: "SCN-006", label: "Rangement structuré · affectation", status: "green" },
            { code: "SCN-007", label: "Validation capacité emplacement", status: "yellow" },
            { code: "SCN-008", label: "FIFO multi-lots", status: "yellow" },
          ]} />
        </VisualFrame>
      );
    case "3-1":
      return (
        <VisualFrame title="Contrôle des stocks" subtitle="CC · Variance · Replenishment" accent={accent}>
          <FlowPipeline steps={["Count", "Variance", "ADJ", "ROP", "Replenish"]} accent={accent} />
        </VisualFrame>
      );
    case "3-2":
      return (
        <VisualFrame title="Min / Max / ROP" subtitle="Point de commande" accent={accent}>
          <svg viewBox="0 0 300 120" className="w-full max-w-sm mx-auto">
            <line x1={30} y1={90} x2={270} y2={90} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
            <line x1={30} y1={30} x2={270} y2={30} stroke="#dc2626" strokeDasharray="4 2" strokeWidth={1.5} />
            <text x={275} y={34} fontSize={8} fill="#dc2626">Max</text>
            <line x1={30} y1={70} x2={270} y2={70} stroke="#f59e0b" strokeDasharray="4 2" strokeWidth={1.5} />
            <text x={275} y={74} fontSize={8} fill="#f59e0b">ROP</text>
            <line x1={30} y1={100} x2={270} y2={100} stroke="#059669" strokeDasharray="4 2" strokeWidth={1.5} />
            <text x={275} y={104} fontSize={8} fill="#059669">Min</text>
            <polyline points="30,50 80,65 130,45 180,75 230,55 270,68" fill="none" stroke={accent} strokeWidth={2} />
          </svg>
        </VisualFrame>
      );
    case "3-3":
      return (
        <VisualFrame title="Stock de sécurité" subtitle="Protection variabilité demande" accent={accent}>
          <div className="flex items-end justify-center gap-2 h-28 px-4">
            {[{ h: 40, label: "Cycle" }, { h: 70, label: "Safety" }, { h: 55, label: "Demand" }].map((b) => (
              <div key={b.label} className="flex flex-col items-center flex-1">
                <div className="w-full rounded-t-md" style={{ height: b.h, backgroundColor: `${accent}${b.label === "Safety" ? "cc" : "55"}` }} />
                <span className="text-[9px] text-muted-foreground mt-1">{b.label}</span>
              </div>
            ))}
          </div>
        </VisualFrame>
      );
    case "3-4":
      return (
        <VisualFrame title="Inventaire cyclique & écarts" subtitle="MI07 · Ajustements" accent={accent}>
          <FlowVertical steps={["Cycle count", "Variance −3 u.", "Analyse cause", "ADJ posting", "Stock corrigé"]} accent={accent} />
        </VisualFrame>
      );
    case "3-5":
      return (
        <VisualFrame title="Décision réapprovisionnement" subtitle="Min/Max · EOQ · Lead time" accent={accent}>
          <FlowPipeline steps={["Stock < ROP", "Calc order", "PO/TO", "Receipt"]} accent={accent} />
        </VisualFrame>
      );
    case "3-6":
      return (
        <VisualFrame title="Règles de réappro" subtitle="Paramètres Min/Max" accent={accent}>
          <DocCard accent={accent} title="Reordering Rule" fields={[{ k: "Min", v: "50 EA" }, { k: "Max", v: "200 EA" }, { k: "Multiple", v: "10 EA" }, { k: "Lead time", v: "3 days" }]} />
        </VisualFrame>
      );
    case "3-7":
      return (
        <VisualFrame title="Scénarios M3" subtitle="Contrôle stocks & réappro" accent={accent}>
          <ScnList accent={accent} items={[
            { code: "SCN-009", label: "Inventaire cyclique simple", status: "yellow" },
            { code: "SCN-010", label: "Analyse écart · ajustement", status: "yellow" },
            { code: "SCN-011", label: "Réappro Min/Max · safety stock", status: "yellow" },
          ]} />
        </VisualFrame>
      );
    case "4-1":
      return (
        <VisualFrame title="KPI Dashboard" subtitle="Tour de contrôle logistique" accent={accent}>
          <KpiGrid accent={accent} tiles={[
            { label: "Rotation", value: "6×", pct: 60, status: "neutral" },
            { label: "Service", value: "95%", pct: 95, status: "good" },
            { label: "Erreurs", value: "4%", pct: 40, status: "warn" },
            { label: "OTIF", value: "92%", pct: 92, status: "good" },
          ]} />
        </VisualFrame>
      );
    case "4-2":
      return (
        <VisualFrame title="Rotation des stocks" subtitle="SCN-012 · Bande normale 4–12×" accent={accent}>
          <div className="flex justify-center py-2"><MiniGauge label="Turnover" value="6×" pct={50} accent={accent} /></div>
          <p className="text-center text-[10px] text-muted-foreground">Normal @ 6× · Annexe A instructeur</p>
        </VisualFrame>
      );
    case "4-3":
      return (
        <VisualFrame title="Service & Erreurs" subtitle="SCN-013 · Corrélation KPI" accent={accent}>
          <KpiGrid accent={accent} tiles={[
            { label: "Service level", value: "95%", pct: 95, status: "good" },
            { label: "Error rate", value: "4%", pct: 40, status: "warn" },
            { label: "Fill rate", value: "98%", pct: 98, status: "good" },
            { label: "Backorders", value: "2%", pct: 20, status: "neutral" },
          ]} />
        </VisualFrame>
      );
    case "4-4":
      return (
        <VisualFrame title="Productivité & Coûts" subtitle="LPH · DSI · Efficience" accent={accent}>
          <KpiGrid accent={accent} tiles={[
            { label: "LPH", value: "120", pct: 75, status: "good" },
            { label: "DSI", value: "45j", pct: 55, status: "neutral" },
            { label: "Cost/order", value: "€8.2", pct: 65, status: "neutral" },
            { label: "Pick accuracy", value: "99%", pct: 99, status: "good" },
          ]} />
        </VisualFrame>
      );
    case "4-5":
      return (
        <VisualFrame title="Root Cause Analysis" subtitle="SCN-014 · Diagnostic multi-KPI" accent={accent}>
          <FlowPipeline steps={["KPI ↓", "Analyse", "Cause", "Action", "KPI ↑"]} accent={accent} />
        </VisualFrame>
      );
    case "4-6":
      return (
        <VisualFrame title="Reporting & Analytics" subtitle="Tableaux de bord KPI" accent={accent}>
          <KpiGrid accent={accent} tiles={[
            { label: "Dashboard", value: "Live", pct: 100, status: "good" },
            { label: "Trend", value: "↑ 3%", pct: 70, status: "good" },
            { label: "Alerts", value: "2", pct: 30, status: "warn" },
            { label: "Export", value: "PDF", pct: 80, status: "neutral" },
          ]} />
        </VisualFrame>
      );
    case "4-7":
      return (
        <VisualFrame title="Scénarios M4" subtitle="Indicateurs analytiques" accent={accent}>
          <ScnList accent={accent} items={[
            { code: "SCN-012", label: "Rotation 6× — normal", status: "yellow" },
            { code: "SCN-013", label: "Service 95% + erreurs 4%", status: "yellow" },
            { code: "SCN-014", label: "Diagnostic multi-KPI capstone", status: "yellow" },
          ]} />
        </VisualFrame>
      );
    case "5-1":
      return (
        <VisualFrame title="Opération intégrée M5" subtitle="Capstone M1 → M5" accent={accent}>
          <IntegrationStack accent={accent} layers={[
            { mod: "M1", label: "Flux PO → GR → SO → GI" },
            { mod: "M2", label: "Putaway FIFO · bins" },
            { mod: "M3", label: "CC · variance · réappro" },
            { mod: "M4", label: "KPI · diagnostic" },
            { mod: "M5", label: "REC → PUT → CC → REP → KPI → DEC" },
          ]} />
        </VisualFrame>
      );
    case "5-2":
      return (
        <VisualFrame title="SCN-015 · Opération multi-SKU" subtitle="YELLOW · Cycle intégré" accent={accent}>
          <FlowPipeline steps={["REC", "PUT", "CC", "REP", "KPI", "DEC", "OK"]} accent={accent} />
          <p className="text-[10px] text-muted-foreground text-center mt-3">SKU-001 · 50 u. · REC-01 → B-01-R1-L1</p>
        </VisualFrame>
      );
    case "5-3":
      return (
        <VisualFrame title="SCN-016 · Gestion de crise" subtitle="RED · Variance papier + ADJ" accent={accent}>
          <FlowVertical steps={["Variance −5 u. (papier)", "Demo sim partielle", "Discussion ADJ", "KPI recalculé"]} accent="#dc2626" />
        </VisualFrame>
      );
    case "5-4":
      return (
        <VisualFrame title="SCN-017 · Audit conformité" subtitle="Décision stratégique · KPI cités" accent={accent}>
          <KpiGrid accent={accent} tiles={[
            { label: "Rotation", value: "6×", pct: 60, status: "neutral" },
            { label: "Service", value: "95%", pct: 95, status: "good" },
            { label: "Erreurs", value: "4%", pct: 40, status: "warn" },
            { label: "Decision", value: "→", pct: 100, status: "neutral" },
          ]} />
        </VisualFrame>
      );
    case "5-5":
      return (
        <VisualFrame title="Certification Gold" subtitle="Parcours intégré M1–M5" accent={accent}>
          <CertBadge tier="gold" lines={["Capstone opérationnel complet", "Statut : en développement", "Non déblocable automatiquement", "QR / LinkedIn · à venir"]} />
        </VisualFrame>
      );
    default:
      return null;
  }
}

function renderFallback(props: PremiumVisualProps) {
  const { visualType, variant, accent } = props;
  switch (visualType) {
    case "FLOW":
      return (
        <VisualFrame title="Processus opérationnel" accent={accent}>
          <FlowPipeline steps={variant === "m1-flow" ? ["PO", "GR", "Stock", "SO", "GI", "CC"] : variant === "m5-ops" ? ["REC", "PUT", "CC", "REP", "KPI", "DEC"] : ["Step 1", "Step 2", "Step 3", "Step 4"]} accent={accent} />
        </VisualFrame>
      );
    case "WH":
      return (
        <VisualFrame title="Entrepôt" accent={accent}>
          <svg viewBox="0 0 320 100" className="w-full">
            <WhZone label="REC" accent={accent} x={20} y={25} w={80} h={50} />
            <WhZone label="STOCK" accent={accent} x={120} y={25} w={180} h={50} />
          </svg>
        </VisualFrame>
      );
    case "KPI":
      return (
        <VisualFrame title="KPI" accent={accent}>
          <KpiGrid accent={accent} tiles={[{ label: "KPI 1", value: "—", pct: 70 }, { label: "KPI 2", value: "—", pct: 85 }, { label: "KPI 3", value: "—", pct: 60 }, { label: "KPI 4", value: "—", pct: 90 }]} />
        </VisualFrame>
      );
    case "CERT":
      return (
        <VisualFrame title="Certification" accent={accent}>
          <CertBadge tier={variant === "gold" ? "gold" : "silver"} lines={["TEC.LOG Program"]} />
        </VisualFrame>
      );
    default:
      return (
        <VisualFrame title="TEC.WMS" accent={accent}>
          <FioriTileGrid accent={accent} labels={["Module", "Concept", "SCN", "Quiz"]} />
        </VisualFrame>
      );
  }
}

export default function PremiumSlideVisual(props: PremiumVisualProps) {
  const specific = renderBySlide(props);
  const content = specific ?? renderFallback(props);

  if (props.scenarioMap?.length && specific) {
    return (
      <div className="h-full flex flex-col gap-2">
        {content}
        <div className="flex flex-wrap gap-1.5 px-1">
          {props.scenarioMap.map((scn) => (
            <span key={scn} className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: scnStatus(scn) === "red" ? "#dc2626" : scnStatus(scn) === "yellow" ? "#d97706" : "#059669" }}>
              {scn}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return content;
}

export function ModulePreviewPremium({ moduleId, accent }: { moduleId: number; accent: string }) {
  return (
    <PremiumSlideVisual moduleId={moduleId} slideId={1} visualType={moduleId === 4 ? "KPI" : moduleId === 5 ? "FLOW" : "FIORI"} variant={moduleId === 1 ? "m1-flow" : moduleId === 4 ? "m4-dashboard" : moduleId === 5 ? "m5-ops" : "default"} accent={accent} title="" />
  );
}
