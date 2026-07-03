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

export const VLS_M1_HERO_IMAGE = "/visual-learning/modules/TEC_WMS_VLS_M1.png";

/** Eight VLS pedagogical sections mapped across ten M1 delivery slides (RC17 revise) */
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

/** Hotspot anchors aligned to TEC_WMS_VLS_M1.png master layout */
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

export function isVlsPilotModule(moduleId: number): boolean {
  return moduleId === 1;
}

export function getVlsSectionLabel(section: VlsSectionId, lang: "FR" | "EN"): string {
  return lang === "FR" ? VLS_SECTION_LABELS[section].fr : VLS_SECTION_LABELS[section].en;
}
