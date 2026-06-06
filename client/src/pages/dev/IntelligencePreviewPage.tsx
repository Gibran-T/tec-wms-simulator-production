/**
 * Dev-only Phase B preview — mock Mission Control intelligence layer for SCN-002/005/006.
 * No auth, no DB. Not included in production builds.
 */
import React, { useState } from "react";
import { useParams } from "wouter";
import OperationalIntelligenceLayer, {
  type IntelligenceRunState,
} from "@/components/operational-intelligence/OperationalIntelligenceLayer";
import { getMissionForScenario } from "../../../../server/missionData";

const M1_STEPS = [
  { key: "PO", labelFr: "Bon de commande (ME21N)", labelEn: "Purchase Order (ME21N)" },
  { key: "GR", labelFr: "Réception quai (MIGO)", labelEn: "Goods Receipt — Dock (MIGO)" },
  { key: "PUTAWAY_M1", labelFr: "Rangement stock (LT0A)", labelEn: "Putaway to Stock (LT0A)" },
  { key: "STOCK", labelFr: "Stock disponible", labelEn: "Stock Available" },
  { key: "SO", labelFr: "Commande client (VA01)", labelEn: "Sales Order (VA01)" },
  { key: "PICKING_M1", labelFr: "Prélèvement expédition (VL01N)", labelEn: "Picking to Dispatch (VL01N)" },
  { key: "GI", labelFr: "Sortie marchandises (VL02N)", labelEn: "Goods Issue (VL02N)" },
  { key: "CC", labelFr: "Comptage cyclique (MI01)", labelEn: "Cycle Count (MI01)" },
  { key: "COMPLIANCE", labelFr: "Conformité système", labelEn: "System Compliance" },
];

const M2_STEPS = [
  { key: "GR", labelFr: "Réception marchandises", labelEn: "Goods Receipt" },
  { key: "PUTAWAY", labelFr: "Rangement structuré", labelEn: "Structured Putaway" },
  { key: "FIFO_PICK", labelFr: "Prélèvement FIFO", labelEn: "FIFO Pick" },
  { key: "STOCK_ACCURACY", labelFr: "Précision inventaire", labelEn: "Stock Accuracy" },
  { key: "COMPLIANCE_ADV", labelFr: "Conformité avancée", labelEn: "Advanced Compliance" },
];

const M4_STEPS = [
  { key: "KPI_DATA", labelFr: "Collecte données KPI", labelEn: "KPI Data Collection" },
  { key: "KPI_ROTATION", labelFr: "Rotation des stocks", labelEn: "Inventory Turnover" },
  { key: "KPI_SERVICE", labelFr: "Taux de service", labelEn: "Service Level" },
  { key: "KPI_DIAGNOSTIC", labelFr: "Diagnostic KPI", labelEn: "KPI Diagnosis" },
  { key: "COMPLIANCE_M4", labelFr: "Conformité M4", labelEn: "M4 Compliance" },
];

type PreviewKey = "scn-002" | "scn-005" | "scn-006" | "scn-012";

const PREVIEW_CONFIG: Record<PreviewKey, () => IntelligenceRunState> = {
  "scn-002": () => {
    const scenario = {
      id: 2,
      moduleId: 1,
      name: "Scénario 2 — Réception fantôme (GR non postée)",
      descriptionFr: "Une GR existe mais n'a pas été postée — le stock n'apparaît pas au quai.",
      descriptionEn: "A GR exists but was not posted — stock does not appear at the dock.",
    };
    const mission = getMissionForScenario(scenario);
    const unposted = [
      { docType: "GR", sku: "SKU-001", bin: "REC-01", qty: 100, posted: false, docRef: "GR-2025-001" },
    ];
    return {
      runId: 900002,
      run: { id: 900002, status: "in_progress", isDemo: true },
      scenario,
      mission,
      completedSteps: ["PO"],
      nextStep: { code: "GR", labelFr: "Réception quai (MIGO)", labelEn: "Goods Receipt — Dock (MIGO)" },
      progressPct: 11,
      score: 0,
      inventory: { "SKU-001::REC-01": 0 },
      compliance: {
        compliant: false,
        issues: ["1 unposted transaction(s) detected"],
        issuesFr: ["1 transaction(s) non postée(s) détectée(s)"],
      },
      unpostedTransactions: unposted,
      allTransactions: [...unposted, { docType: "PO", sku: "SKU-001", bin: "REC-01", qty: 100, posted: true, docRef: "PO-2025-001" }],
      isDemo: true,
      moduleId: 1,
      stepLabels: M1_STEPS,
      effectiveStepCount: M1_STEPS.length,
      onExecuteStep: () => {},
      previewMode: true,
    };
  },
  "scn-005": () => {
    const scenario = {
      id: 5,
      moduleId: 1,
      name: "Scénario 5 — Non-conformités multiples",
      descriptionFr: "GR fantôme SKU-004 et écart inventaire SKU-005 — ordre Documents → Physique → Expédition.",
      descriptionEn: "Ghost GR SKU-004 and SKU-005 inventory variance — order Documents → Physical → Shipping.",
    };
    const mission = getMissionForScenario(scenario);
    const unposted = [
      { docType: "GR", sku: "SKU-004", bin: "REC-01", qty: 30, posted: false, docRef: "GR-2025-004" },
    ];
    return {
      runId: 900005,
      run: { id: 900005, status: "in_progress", isDemo: false },
      scenario,
      mission,
      completedSteps: ["PO"],
      nextStep: { code: "GR", labelFr: "Réception quai (MIGO)", labelEn: "Goods Receipt — Dock (MIGO)" },
      progressPct: 11,
      score: 42,
      inventory: {
        "SKU-004::REC-01": 0,
        "SKU-005::REC-02": 92,
        "SKU-005::B-01-R1-L1": 0,
      },
      compliance: {
        compliant: false,
        issues: ["1 unposted transaction(s) detected", "Inventory variance SKU-005 pending resolution"],
        issuesFr: ["1 transaction(s) non postée(s) détectée(s)", "Écart inventaire SKU-005 en attente de résolution"],
      },
      unpostedTransactions: unposted,
      allTransactions: [
        ...unposted,
        { docType: "PO", sku: "SKU-004", bin: "REC-01", qty: 30, posted: true, docRef: "PO-2025-004" },
        { docType: "GR", sku: "SKU-005", bin: "REC-02", qty: 100, posted: true, docRef: "GR-2025-005" },
      ],
      isDemo: false,
      moduleId: 1,
      stepLabels: [...M1_STEPS.slice(0, 8), { key: "ADJ", labelFr: "Ajustement inventaire (MI07)", labelEn: "Inventory Adjustment (MI07)" }, M1_STEPS[8]],
      effectiveStepCount: 10,
      onExecuteStep: () => {},
      previewMode: true,
    };
  },
  "scn-006": () => {
    const scenario = {
      id: 6,
      moduleId: 2,
      name: "M2 — Scénario 1 : Rangement structuré et affectation d'emplacement",
      descriptionFr: "150 unités SKU-001 postées au quai — affecter l'emplacement STOCKAGE (LT01).",
      descriptionEn: "150 units SKU-001 posted at dock — assign STOCKAGE location (LT01).",
    };
    const mission = getMissionForScenario(scenario);
    const posted = [
      { docType: "GR", sku: "SKU-001", bin: "REC-01", qty: 150, posted: true, docRef: "GR-2025-M2-001" },
    ];
    return {
      runId: 900006,
      run: { id: 900006, status: "in_progress", isDemo: true },
      scenario,
      mission,
      completedSteps: ["GR"],
      nextStep: { code: "PUTAWAY", labelFr: "Rangement structuré", labelEn: "Structured Putaway" },
      progressPct: 20,
      score: 0,
      inventory: { "SKU-001::REC-01": 150 },
      compliance: { compliant: true, issues: [], issuesFr: [] },
      unpostedTransactions: [],
      allTransactions: posted,
      isDemo: true,
      moduleId: 2,
      stepLabels: M2_STEPS,
      effectiveStepCount: M2_STEPS.length,
      onExecuteStep: () => {},
      previewMode: true,
    };
  },
  "scn-012": () => {
    const scenario = {
      id: 12,
      moduleId: 4,
      name: "M4 — Scénario 1 : Rotation des stocks et surstock",
      descriptionFr: "Analyser les KPI de rotation pour détecter surstock ou sous-performance.",
      descriptionEn: "Analyze turnover KPIs to detect overstock or underperformance.",
    };
    const mission = getMissionForScenario(scenario);
    return {
      runId: 900012,
      run: { id: 900012, status: "in_progress", isDemo: false },
      scenario,
      mission,
      completedSteps: [],
      nextStep: { code: "KPI_DATA", labelFr: "Collecte données KPI", labelEn: "KPI Data Collection" },
      progressPct: 0,
      score: 0,
      inventory: {},
      compliance: { compliant: true, issues: [], issuesFr: [] },
      unpostedTransactions: [],
      allTransactions: [],
      isDemo: false,
      moduleId: 4,
      stepLabels: M4_STEPS,
      effectiveStepCount: M4_STEPS.length,
      onExecuteStep: () => {},
      previewMode: true,
    };
  },
};

const TABS: { key: PreviewKey; label: string }[] = [
  { key: "scn-002", label: "SCN-002 — Réception fantôme" },
  { key: "scn-005", label: "SCN-005 — Non-conformités multiples" },
  { key: "scn-006", label: "SCN-006 — M2 Rangement structuré" },
  { key: "scn-012", label: "SCN-012 — M4 KPI Rotation" },
];

export default function IntelligencePreviewPage() {
  const params = useParams<{ scn?: string }>();
  const initial = (params.scn as PreviewKey) || "scn-002";
  const [active, setActive] = useState<PreviewKey>(
    TABS.some((t) => t.key === initial) ? initial : "scn-002"
  );
  const state = PREVIEW_CONFIG[active]();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-amber-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wide">
        Phase B Preview — Dev only — Mock data (no auth / no live run)
      </div>
      <div className="flex flex-wrap gap-2 p-4 border-b border-border bg-slate-50">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`px-3 py-1.5 text-xs font-bold border ${
              active === tab.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <OperationalIntelligenceLayer {...state} />
      </div>
    </div>
  );
}
