/** RC17 — Visual Learning System slide production standard (institutional) */

export type VlsSectionId =
  | "hero"
  | "observation-hotspots"
  | "concepts"
  | "simulation-scn"
  | "module-completed"
  /** Legacy section IDs — retained for renderer fallbacks */
  | "certification"
  | "observation"
  | "objectives"
  | "hotspots"
  | "simulation"
  | "scn-mapping";

export const VLS_SECTION_ORDER: VlsSectionId[] = [
  "hero",
  "observation-hotspots",
  "concepts",
  "simulation-scn",
  "module-completed",
];

export const VLS_SECTION_LABELS: Record<VlsSectionId, { fr: string; en: string }> = {
  hero: { fr: "Image héro · objectifs", en: "Hero Image · objectives" },
  "observation-hotspots": { fr: "Observation guidée · hotspots", en: "Guided Observation · hotspots" },
  concepts: { fr: "Transaction SAP", en: "SAP Transaction" },
  "simulation-scn": { fr: "Simulateur · cartographie SCN", en: "Simulator · SCN mapping" },
  "module-completed": { fr: "Module complété", en: "Module completed" },
  certification: { fr: "Module complété", en: "Module completed" },
  observation: { fr: "Observation guidée", en: "Guided Observation" },
  objectives: { fr: "Objectifs du module", en: "Module Objectives" },
  hotspots: { fr: "Zones opérationnelles", en: "Operational Zones" },
  simulation: { fr: "Démonstration simulateur", en: "Simulator Demo" },
  "scn-mapping": { fr: "Cartographie SCN", en: "SCN Mapping" },
};

export type VlsHotspot = {
  id: string;
  labelFr: string;
  labelEn: string;
  detailFr: string;
  detailEn: string;
  /** Percentage-based bounding box on hero image */
  x: number;
  y: number;
  w: number;
  h: number;
};

export type VlsModuleConfig = {
  heroImage: string;
  hotspots: VlsHotspot[];
  /** Keywords used to split observation slide body into zone vs flow lines */
  observationZoneKeywords: string[];
  conceptsLabel: { fr: string; en: string };
  quizThresholdPct: number;
  scenarioHref: string;
  scenarioLinkFr: string;
  scenarioLinkEn: string;
};

export const VLS_MODULE_IMAGES: Record<number, string> = {
  1: "/visual-learning/modules/TEC_WMS_VLS_M1.png",
  2: "/visual-learning/modules/TEC_WMS_VLS_M2.png",
  3: "/visual-learning/modules/TEC_WMS_VLS_M3.png",
  4: "/visual-learning/modules/TEC_WMS_VLS_M4.png",
  /** M5 closing-shift supervisor hero (quart de clôture) */
  5: "/visual-learning/modules/m5/03_truck_night_gls.png",
};

/** @deprecated Use getVlsModuleConfig(1).heroImage */
export const VLS_M1_HERO_IMAGE = VLS_MODULE_IMAGES[1];

/** @deprecated Use getVlsModuleConfig(1).hotspots */
export const VLS_M1_HOTSPOTS: VlsHotspot[] = [
  {
    id: "receiving",
    labelFr: "Réception inbound",
    labelEn: "Receiving Inbound",
    detailFr: "Docks 01–04 · déchargement · inspection qualité · PO/GR",
    detailEn: "Docks 01–04 · unloading · quality inspection · PO/GR",
    x: 4,
    y: 38,
    w: 16,
    h: 22,
  },
  {
    id: "putaway",
    labelFr: "Rangement (Putaway)",
    labelEn: "Putaway",
    detailFr: "Allocation dynamique des bins · flux vers le stockage",
    detailEn: "Dynamic bin allocation · flow into storage",
    x: 20,
    y: 32,
    w: 14,
    h: 18,
  },
  {
    id: "storage",
    labelFr: "Stockage",
    labelEn: "Storage",
    detailFr: "Racks A/B/C · suivi inventaire · FIFO · MMBE",
    detailEn: "Racks A/B/C · inventory tracking · FIFO · MMBE",
    x: 36,
    y: 28,
    w: 18,
    h: 28,
  },
  {
    id: "picking",
    labelFr: "Picking",
    labelEn: "Picking",
    detailFr: "Prélèvement commandes · scanners · préparation SO",
    detailEn: "Order picking · scanners · SO preparation",
    x: 55,
    y: 32,
    w: 12,
    h: 20,
  },
  {
    id: "packing",
    labelFr: "Packing & staging",
    labelEn: "Packing & Staging",
    detailFr: "Consolidation · UPS · FedEx · Purolator",
    detailEn: "Consolidation · UPS · FedEx · Purolator",
    x: 68,
    y: 30,
    w: 14,
    h: 22,
  },
  {
    id: "shipping",
    labelFr: "Expédition outbound",
    labelEn: "Outbound Shipping",
    detailFr: "Docks 07–09 · GI · livraison client",
    detailEn: "Docks 07–09 · GI · customer delivery",
    x: 83,
    y: 36,
    w: 12,
    h: 24,
  },
  {
    id: "control",
    labelFr: "Bureau WMS / Control Tower",
    labelEn: "WMS Control Office",
    detailFr: "Dashboard ERP · order fulfillment · alertes retard",
    detailEn: "ERP dashboard · order fulfillment · delay alerts",
    x: 72,
    y: 4,
    w: 22,
    h: 16,
  },
];

const VLS_M2_HOTSPOTS: VlsHotspot[] = [
  {
    id: "supplier-yard",
    labelFr: "Cour fournisseur",
    labelEn: "Supplier Yard",
    detailFr: "Arrivée camion · PO · fiabilité fournisseur · contrôle procurement",
    detailEn: "Truck arrival · PO · supplier reliability · procurement control",
    x: 2,
    y: 42,
    w: 14,
    h: 20,
  },
  {
    id: "receiving",
    labelFr: "Réception avancée",
    labelEn: "Advanced Receiving",
    detailFr: "Déchargement · comptage · écarts réception · inbound flow",
    detailEn: "Unloading · counting · receiving discrepancy · inbound flow",
    x: 16,
    y: 36,
    w: 16,
    h: 24,
  },
  {
    id: "putaway",
    labelFr: "Rangement structuré",
    labelEn: "Structured Putaway",
    detailFr: "Allocation bins · REC-01 → STOCKAGE · SCN-006",
    detailEn: "Bin allocation · REC-01 → STOCKAGE · SCN-006",
    x: 32,
    y: 30,
    w: 14,
    h: 22,
  },
  {
    id: "storage",
    labelFr: "Stockage & capacité",
    labelEn: "Storage & Capacity",
    detailFr: "Bins · capacité max 500 u. · dépassement SCN-007",
    detailEn: "Bins · max capacity 500 u. · overflow SCN-007",
    x: 46,
    y: 26,
    w: 18,
    h: 28,
  },
  {
    id: "fifo-zone",
    labelFr: "Zone FIFO",
    labelEn: "FIFO Zone",
    detailFr: "Traçabilité lots · fraîcheur · SCN-008 picking FIFO",
    detailEn: "Lot traceability · freshness · SCN-008 FIFO picking",
    x: 58,
    y: 32,
    w: 12,
    h: 20,
  },
  {
    id: "shipping",
    labelFr: "Expédition",
    labelEn: "Shipping",
    detailFr: "Préparation · staging · outbound flow",
    detailEn: "Preparation · staging · outbound flow",
    x: 78,
    y: 34,
    w: 14,
    h: 22,
  },
  {
    id: "control",
    labelFr: "Bureau WMS",
    labelEn: "WMS Office",
    detailFr: "Mission Control · bins · capacité · exécution entrepôt",
    detailEn: "Mission Control · bins · capacity · warehouse execution",
    x: 70,
    y: 4,
    w: 24,
    h: 16,
  },
];

const VLS_M3_HOTSPOTS: VlsHotspot[] = [
  {
    id: "bin-location",
    labelFr: "Localisation bin",
    labelEn: "Bin Location",
    detailFr: "Zone-Aisle-Level-Bin · exactitude inventaire · stock accuracy",
    detailEn: "Zone-Aisle-Level-Bin · inventory accuracy · stock accuracy",
    x: 8,
    y: 30,
    w: 18,
    h: 26,
  },
  {
    id: "cycle-count",
    labelFr: "Inventaire cyclique",
    labelEn: "Cycle Count",
    detailFr: "CC_LIST → CC_COUNT → CC_RECON · SCN-009",
    detailEn: "CC_LIST → CC_COUNT → CC_RECON · SCN-009",
    x: 28,
    y: 28,
    w: 16,
    h: 24,
  },
  {
    id: "variance",
    labelFr: "Écart & ajustement",
    labelEn: "Variance & Adjustment",
    detailFr: "Analyse écart significatif · ADJ · SCN-010",
    detailEn: "Significant variance analysis · ADJ · SCN-010",
    x: 44,
    y: 32,
    w: 14,
    h: 22,
  },
  {
    id: "replenishment",
    labelFr: "Réapprovisionnement",
    labelEn: "Replenishment",
    detailFr: "Min/Max · ROP · Safety Stock · REPLENISH · SCN-011",
    detailEn: "Min/Max · ROP · Safety Stock · REPLENISH · SCN-011",
    x: 58,
    y: 26,
    w: 16,
    h: 26,
  },
  {
    id: "safety-stock",
    labelFr: "Safety Stock",
    labelEn: "Safety Stock",
    detailFr: "Tampon variabilité · niveau de service · contrôle inventaire",
    detailEn: "Variability buffer · service level · inventory control",
    x: 74,
    y: 30,
    w: 14,
    h: 22,
  },
  {
    id: "control",
    labelFr: "Contrôle inventaire",
    labelEn: "Inventory Control",
    detailFr: "Tableaux Min/Max · validation enseignant · gate M4",
    detailEn: "Min/Max dashboards · teacher validation · M4 gate",
    x: 68,
    y: 4,
    w: 26,
    h: 16,
  },
];

const VLS_M4_HOTSPOTS: VlsHotspot[] = [
  {
    id: "kpi-tower",
    labelFr: "KPI Control Tower",
    labelEn: "KPI Control Tower",
    detailFr: "Tableau de bord · rotation · OTIF · erreurs · lead time",
    detailEn: "Dashboard · turnover · OTIF · errors · lead time",
    x: 62,
    y: 2,
    w: 32,
    h: 18,
  },
  {
    id: "rotation",
    labelFr: "Rotation des stocks",
    labelEn: "Inventory Turnover",
    detailFr: "2 400 ÷ 400 = 6× · bande normale 4–12× · SCN-012",
    detailEn: "2,400 ÷ 400 = 6× · normal band 4–12× · SCN-012",
    x: 10,
    y: 28,
    w: 16,
    h: 24,
  },
  {
    id: "otif",
    labelFr: "OTIF & service",
    labelEn: "OTIF & Service",
    detailFr: "285/300 = 95% · niveau de service · SCN-013",
    detailEn: "285/300 = 95% · service level · SCN-013",
    x: 28,
    y: 32,
    w: 14,
    h: 22,
  },
  {
    id: "errors",
    labelFr: "Erreurs opérationnelles",
    labelEn: "Operational Errors",
    detailFr: "12/300 = 4% · picking/réception · piège tableau vert",
    detailEn: "12/300 = 4% · picking/receiving · green dashboard trap",
    x: 44,
    y: 30,
    w: 14,
    h: 24,
  },
  {
    id: "productivity",
    labelFr: "Productivité & coût",
    labelEn: "Productivity & Cost",
    detailFr: "Efficacité opérationnelle · trade-offs SCN-014",
    detailEn: "Operational efficiency · SCN-014 trade-offs",
    x: 58,
    y: 28,
    w: 16,
    h: 26,
  },
  {
    id: "decision",
    labelFr: "Décision management",
    labelEn: "Management Decision",
    detailFr: "Diagnostic multi-KPI · intelligence opérationnelle · SCN-014",
    detailEn: "Multi-KPI diagnosis · operational intelligence · SCN-014",
    x: 74,
    y: 34,
    w: 18,
    h: 22,
  },
];

const VLS_M5_HOTSPOTS: VlsHotspot[] = [
  {
    id: "reception",
    labelFr: "Réception M5",
    labelEn: "M5 Reception",
    detailFr: "Point de départ · REC-01 · SKU-001 · SCN-015",
    detailEn: "Starting point · REC-01 · SKU-001 · SCN-015",
    x: 4,
    y: 38,
    w: 16,
    h: 22,
  },
  {
    id: "putaway",
    labelFr: "Putaway intégré",
    labelEn: "Integrated Putaway",
    detailFr: "B-01-R1-L1 · traçabilité lot · flux end-to-end",
    detailEn: "B-01-R1-L1 · lot traceability · end-to-end flow",
    x: 20,
    y: 32,
    w: 14,
    h: 20,
  },
  {
    id: "cycle-count",
    labelFr: "Cycle count M5",
    labelEn: "M5 Cycle Count",
    detailFr: "Variance injectée · M5_ADJ · SCN-016",
    detailEn: "Injected variance · M5_ADJ · SCN-016",
    x: 36,
    y: 28,
    w: 16,
    h: 24,
  },
  {
    id: "replenish",
    labelFr: "Réapprovisionnement",
    labelEn: "Replenishment",
    detailFr: "REPLENISH · exception management · intégration M3",
    detailEn: "REPLENISH · exception management · M3 integration",
    x: 52,
    y: 30,
    w: 14,
    h: 22,
  },
  {
    id: "kpi-monitor",
    labelFr: "Moniteur KPI",
    labelEn: "KPI Monitor",
    detailFr: "Snapshot M5_KPI · synthèse · SCN-017",
    detailEn: "M5_KPI snapshot · synthesis · SCN-017",
    x: 66,
    y: 26,
    w: 16,
    h: 26,
  },
  {
    id: "decision",
    labelFr: "Décision stratégique",
    labelEn: "Strategic Decision",
    detailFr: "Recommandation finale · ≥2 KPI chiffrés · SCN-017",
    detailEn: "Final recommendation · ≥2 numeric KPIs · SCN-017",
    x: 78,
    y: 34,
    w: 16,
    h: 22,
  },
  {
    id: "compliance",
    labelFr: "Conformité finale",
    labelEn: "Final Compliance",
    detailFr: "Audit capstone · COMPLIANCE · parcours M1–M5",
    detailEn: "Capstone audit · COMPLIANCE · M1–M5 pathway",
    x: 70,
    y: 4,
    w: 24,
    h: 16,
  },
];

export const VLS_MODULE_CONFIG: Record<number, VlsModuleConfig> = {
  1: {
    heroImage: VLS_MODULE_IMAGES[1],
    hotspots: VLS_M1_HOTSPOTS,
    observationZoneKeywords: [
      "INBOUND", "PUTAWAY", "STOCKAGE", "STORAGE", "PICKING", "PACKING",
      "OUTBOUND", "BUREAU WMS", "WMS OFFICE",
    ],
    conceptsLabel: { fr: "Transaction SAP", en: "SAP Transaction" },
    quizThresholdPct: 60,
    scenarioHref: "/student/scenarios",
    scenarioLinkFr: "Liste des scénarios M1",
    scenarioLinkEn: "M1 scenario list",
  },
  2: {
    heroImage: VLS_MODULE_IMAGES[2],
    hotspots: VLS_M2_HOTSPOTS,
    observationZoneKeywords: [
      "RÉCEPTION", "RECEIVING", "PUTAWAY", "RANGEMENT", "STOCKAGE", "STORAGE",
      "PICKING", "EXPÉDITION", "SHIPPING", "BUREAU", "CONTROL", "ZONE",
    ],
    conceptsLabel: { fr: "Concepts opérationnels", en: "Operational concepts" },
    quizThresholdPct: 60,
    scenarioHref: "/student/module2",
    scenarioLinkFr: "Liste des scénarios M2",
    scenarioLinkEn: "M2 scenario list",
  },
  3: {
    heroImage: VLS_MODULE_IMAGES[3],
    hotspots: VLS_M3_HOTSPOTS,
    observationZoneKeywords: [
      "MIN", "MAX", "ROP", "SAFETY", "CYCLE", "VARIANCE", "ÉCART",
      "REPLENISH", "RÉAPPRO", "INVENTAIRE", "INVENTORY",
    ],
    conceptsLabel: { fr: "Stratégies d'inventaire", en: "Inventory strategies" },
    quizThresholdPct: 60,
    scenarioHref: "/student/module3",
    scenarioLinkFr: "Liste des scénarios M3",
    scenarioLinkEn: "M3 scenario list",
  },
  4: {
    heroImage: VLS_MODULE_IMAGES[4],
    hotspots: VLS_M4_HOTSPOTS,
    observationZoneKeywords: [
      "ROTATION", "OTIF", "ERREUR", "ERROR", "KPI", "PRODUCTIVIT",
      "SCN-012", "SCN-013", "SCN-014",
    ],
    conceptsLabel: { fr: "Lecture KPI", en: "KPI reading" },
    quizThresholdPct: 60,
    scenarioHref: "/student/module4",
    scenarioLinkFr: "Liste des scénarios M4",
    scenarioLinkEn: "M4 scenario list",
  },
  5: {
    heroImage: VLS_MODULE_IMAGES[5],
    hotspots: VLS_M5_HOTSPOTS,
    observationZoneKeywords: [
      "PRÉPARER", "PREPARER", "SUPERVISER", "INTERVENIR", "CLÔTURER", "CLOTURER",
      "QUAI", "FRET", "ÉCART", "ECART", "SÉCURITÉ", "SECURITE", "TRANSMISSION",
    ],
    conceptsLabel: { fr: "Actes du quart", en: "Shift acts" },
    quizThresholdPct: 60,
    scenarioHref: "/student/module5",
    scenarioLinkFr: "Liste des scénarios M5",
    scenarioLinkEn: "M5 scenario list",
  },
};

export function getVlsModuleConfig(moduleId: number): VlsModuleConfig | undefined {
  return VLS_MODULE_CONFIG[moduleId];
}

export function isVlsEnabledModule(moduleId: number): boolean {
  return moduleId in VLS_MODULE_CONFIG;
}

/** @deprecated Use isVlsEnabledModule */
export function isVlsPilotModule(moduleId: number): boolean {
  return isVlsEnabledModule(moduleId);
}

export function getVlsSectionLabel(section: VlsSectionId, lang: "FR" | "EN"): string {
  return lang === "FR" ? VLS_SECTION_LABELS[section].fr : VLS_SECTION_LABELS[section].en;
}

export function getVlsConceptsLabel(moduleId: number, lang: "FR" | "EN"): string {
  const config = getVlsModuleConfig(moduleId);
  if (!config) return getVlsSectionLabel("concepts", lang);
  return lang === "FR" ? config.conceptsLabel.fr : config.conceptsLabel.en;
}

export function isScnBodyLine(line: string): boolean {
  return /SCN-\d{3}/.test(line);
}

export function matchesObservationZoneLine(line: string, keywords: string[]): boolean {
  const upper = line.toUpperCase();
  return keywords.some((kw) => upper.includes(kw.toUpperCase()));
}
