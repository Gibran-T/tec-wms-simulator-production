/** Display-only pathway metadata for student training surfaces (no backend). */
export interface ModulePathwayMeta {
  moduleId: number;
  scnRange: string;
  competencyFr: string;
  competencyEn: string;
  learningOutcomeFr: string;
  learningOutcomeEn: string;
}

export const MODULE_PATHWAY: ModulePathwayMeta[] = [
  {
    moduleId: 1,
    scnRange: "SCN-001 → SCN-005",
    competencyFr: "Exécution opérationnelle ERP/WMS — fondements logistiques",
    competencyEn: "ERP/WMS operational execution — logistics foundations",
    learningOutcomeFr: "Module M1 complété — flux PO→GR→SO→GI→CC",
    learningOutcomeEn: "Module M1 complete — PO→GR→SO→GI→CC flow",
  },
  {
    moduleId: 2,
    scnRange: "SCN-006 → SCN-008",
    competencyFr: "Exécution entrepôt — rangement, capacité, FIFO",
    competencyEn: "Warehouse execution — putaway, capacity, FIFO",
    learningOutcomeFr: "Module M2 complété — exécution entrepôt",
    learningOutcomeEn: "Module M2 complete — warehouse execution",
  },
  {
    moduleId: 3,
    scnRange: "SCN-009 → SCN-011",
    competencyFr: "Contrôle stocks — inventaire, écarts, réapprovisionnement",
    competencyEn: "Inventory control — cycle count, variances, replenishment",
    learningOutcomeFr: "Module M3 complété — contrôle des stocks",
    learningOutcomeEn: "Module M3 complete — inventory control",
  },
  {
    moduleId: 4,
    scnRange: "SCN-012 → SCN-014",
    competencyFr: "Analyse KPI — performance et diagnostic stratégique",
    competencyEn: "KPI analysis — performance and strategic diagnosis",
    learningOutcomeFr: "Module M4 complété — pilotage logistique",
    learningOutcomeEn: "Module M4 complete — logistics control",
  },
  {
    moduleId: 5,
    scnRange: "SCN-015 → SCN-017",
    competencyFr: "Opérations intégrées — cycle complet et décision stratégique",
    competencyEn: "Integrated operations — full cycle and strategic decision",
    learningOutcomeFr: "Module M5 complété — capstone opérationnel",
    learningOutcomeEn: "Module M5 complete — operational capstone",
  },
];

export function getPathwayForModule(moduleId: number): ModulePathwayMeta | undefined {
  return MODULE_PATHWAY.find((m) => m.moduleId === moduleId);
}
