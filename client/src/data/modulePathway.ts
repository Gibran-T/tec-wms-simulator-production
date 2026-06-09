/** Display-only pathway metadata for student training surfaces (no backend). */
export interface ModulePathwayMeta {
  moduleId: number;
  scnRange: string;
  competencyFr: string;
  competencyEn: string;
  certImpactFr: string;
  certImpactEn: string;
  certTier: "silver" | "gold";
}

export const MODULE_PATHWAY: ModulePathwayMeta[] = [
  {
    moduleId: 1,
    scnRange: "SCN-001 → SCN-005",
    competencyFr: "Exécution opérationnelle ERP/WMS — fondations logistiques",
    competencyEn: "ERP/WMS operational execution — logistics foundations",
    certImpactFr: "Certification Silver — parcours M1",
    certImpactEn: "Silver Certification — M1 pathway",
    certTier: "silver",
  },
  {
    moduleId: 2,
    scnRange: "SCN-006 → SCN-008",
    competencyFr: "Exécution entrepôt — rangement, capacité, FIFO",
    competencyEn: "Warehouse execution — putaway, capacity, FIFO",
    certImpactFr: "Contribution Gold — opérations entrepôt",
    certImpactEn: "Gold contribution — warehouse operations",
    certTier: "gold",
  },
  {
    moduleId: 3,
    scnRange: "SCN-009 → SCN-011",
    competencyFr: "Contrôle stocks — inventaire, écarts, réapprovisionnement",
    competencyEn: "Inventory control — cycle count, variances, replenishment",
    certImpactFr: "Contribution Gold — gestion des stocks",
    certImpactEn: "Gold contribution — inventory management",
    certTier: "gold",
  },
  {
    moduleId: 4,
    scnRange: "SCN-012 → SCN-014",
    competencyFr: "Analyse KPI — performance et diagnostic stratégique",
    competencyEn: "KPI analysis — performance and strategic diagnosis",
    certImpactFr: "Contribution Gold — pilotage logistique",
    certImpactEn: "Gold contribution — logistics control",
    certTier: "gold",
  },
  {
    moduleId: 5,
    scnRange: "SCN-015 → SCN-017",
    competencyFr: "Opérations intégrées — cycle complet et décision stratégique",
    competencyEn: "Integrated operations — full cycle and strategic decision",
    certImpactFr: "Capstone Gold — certification intégrée",
    certImpactEn: "Gold capstone — integrated certification",
    certTier: "gold",
  },
];

export function getPathwayForModule(moduleId: number): ModulePathwayMeta | undefined {
  return MODULE_PATHWAY.find((m) => m.moduleId === moduleId);
}
