/** Display-only competency metadata per SCN (Guide Maître / Matrice de Compétences). */
export interface CompetencyEntry {
  scnCode: string;
  moduleId: number;
  primaryCompetency: { fr: string; en: string };
  warehouseRole: { fr: string; en: string };
  bloomLevel: { fr: string; en: string };
  progression: { fr: string; en: string };
  erpMaturity: number;
  wmsMaturity: number;
  certificationNote?: { fr: string; en: string };
}

export const COMPETENCY_MAP: Record<string, CompetencyEntry> = {
  "SCN-001": {
    scnCode: "SCN-001", moduleId: 1,
    primaryCompetency: { fr: "Exécution opérationnelle", en: "Operational Execution" },
    warehouseRole: { fr: "Opérateur entrepôt", en: "Warehouse Operator" },
    bloomLevel: { fr: "Comprendre", en: "Understand" },
    progression: { fr: "Fondation M1", en: "M1 Foundation" },
    erpMaturity: 2, wmsMaturity: 2,
    certificationNote: { fr: "Requis pour certification Silver (M1)", en: "Required for Silver certification (M1)" },
  },
  "SCN-002": {
    scnCode: "SCN-002", moduleId: 1,
    primaryCompetency: { fr: "Identification de problème", en: "Problem Identification" },
    warehouseRole: { fr: "Opérateur entrepôt", en: "Warehouse Operator" },
    bloomLevel: { fr: "Comprendre", en: "Understand" },
    progression: { fr: "Fondation M1", en: "M1 Foundation" },
    erpMaturity: 2, wmsMaturity: 2,
  },
  "SCN-003": {
    scnCode: "SCN-003", moduleId: 1,
    primaryCompetency: { fr: "Prise de décision", en: "Decision-Making" },
    warehouseRole: { fr: "Opérateur entrepôt", en: "Warehouse Operator" },
    bloomLevel: { fr: "Appliquer", en: "Apply" },
    progression: { fr: "Fondation M1", en: "M1 Foundation" },
    erpMaturity: 2, wmsMaturity: 2,
  },
  "SCN-004": {
    scnCode: "SCN-004", moduleId: 1,
    primaryCompetency: { fr: "Analyse des écarts", en: "Variance Analysis" },
    warehouseRole: { fr: "Spécialiste qualité", en: "Quality Specialist" },
    bloomLevel: { fr: "Analyser", en: "Analyze" },
    progression: { fr: "Fondation M1", en: "M1 Foundation" },
    erpMaturity: 3, wmsMaturity: 2,
  },
  "SCN-005": {
    scnCode: "SCN-005", moduleId: 1,
    primaryCompetency: { fr: "Résolution de problèmes complexes", en: "Complex Problem-Solving" },
    warehouseRole: { fr: "Spécialiste qualité", en: "Quality Specialist" },
    bloomLevel: { fr: "Analyser", en: "Analyze" },
    progression: { fr: "Fondation M1", en: "M1 Foundation" },
    erpMaturity: 3, wmsMaturity: 3,
  },
  "SCN-006": {
    scnCode: "SCN-006", moduleId: 2,
    primaryCompetency: { fr: "Rangement structuré", en: "Structured Putaway" },
    warehouseRole: { fr: "Spécialiste rangement", en: "Putaway Specialist" },
    bloomLevel: { fr: "Appliquer", en: "Apply" },
    progression: { fr: "Intermédiaire M2", en: "M2 Intermediate" },
    erpMaturity: 2, wmsMaturity: 3,
    certificationNote: { fr: "Scénario M2 — seuil 60/100 en évaluation", en: "M2 scenario — 60/100 evaluation threshold" },
  },
  "SCN-007": {
    scnCode: "SCN-007", moduleId: 2,
    primaryCompetency: { fr: "Gestion de capacité", en: "Capacity Management" },
    warehouseRole: { fr: "Planificateur capacité", en: "Capacity Planner" },
    bloomLevel: { fr: "Appliquer", en: "Apply" },
    progression: { fr: "Intermédiaire M2", en: "M2 Intermediate" },
    erpMaturity: 3, wmsMaturity: 3,
    certificationNote: { fr: "Gestion capacité M2 — compte pour progression certification entrepôt", en: "M2 capacity management — counts toward warehouse certification" },
  },
  "SCN-008": {
    scnCode: "SCN-008", moduleId: 2,
    primaryCompetency: { fr: "Conformité FIFO", en: "FIFO Compliance" },
    warehouseRole: { fr: "Spécialiste FIFO", en: "FIFO Specialist" },
    bloomLevel: { fr: "Analyser", en: "Analyze" },
    progression: { fr: "Intermédiaire M2", en: "M2 Intermediate" },
    erpMaturity: 3, wmsMaturity: 3,
    certificationNote: { fr: "Conformité FIFO M2 — seuil 60/100", en: "M2 FIFO compliance — 60/100 threshold" },
  },
  "SCN-009": {
    scnCode: "SCN-009", moduleId: 3,
    primaryCompetency: { fr: "Précision inventaire", en: "Inventory Accuracy" },
    warehouseRole: { fr: "Auditeur inventaire", en: "Inventory Auditor" },
    bloomLevel: { fr: "Appliquer", en: "Apply" },
    progression: { fr: "Avancé M3", en: "M3 Advanced" },
    erpMaturity: 3, wmsMaturity: 4,
    certificationNote: { fr: "Module 3 — seuil scénario 70/100", en: "Module 3 — scenario threshold 70/100" },
  },
  "SCN-010": {
    scnCode: "SCN-010", moduleId: 3,
    primaryCompetency: { fr: "Gestion des écarts", en: "Variance Management" },
    warehouseRole: { fr: "Gestionnaire inventaire", en: "Inventory Manager" },
    bloomLevel: { fr: "Analyser", en: "Analyze" },
    progression: { fr: "Avancé M3", en: "M3 Advanced" },
    erpMaturity: 4, wmsMaturity: 4,
    certificationNote: { fr: "Gestion écarts M3 — justification obligatoire en évaluation", en: "M3 variance management — justification required in evaluation" },
  },
  "SCN-011": {
    scnCode: "SCN-011", moduleId: 3,
    primaryCompetency: { fr: "Planification réappro", en: "Replenishment Planning" },
    warehouseRole: { fr: "Planificateur supply", en: "Supply Planner" },
    bloomLevel: { fr: "Évaluer", en: "Evaluate" },
    progression: { fr: "Avancé M3", en: "M3 Advanced" },
    erpMaturity: 4, wmsMaturity: 4,
    certificationNote: { fr: "Planification réappro M3 — calculs ROP/EOQ évalués", en: "M3 replenishment — ROP/EOQ calculations assessed" },
  },
  "SCN-012": {
    scnCode: "SCN-012", moduleId: 4,
    primaryCompetency: { fr: "Analyse performance", en: "Performance Analysis" },
    warehouseRole: { fr: "Analyste logistique", en: "Logistics Analyst" },
    bloomLevel: { fr: "Analyser", en: "Analyze" },
    progression: { fr: "Expert M4", en: "M4 Expert" },
    erpMaturity: 4, wmsMaturity: 4,
    certificationNote: { fr: "Module 4 — seuil 70/100, analyse KPI rotation", en: "Module 4 — 70/100 threshold, turnover KPI analysis" },
  },
  "SCN-013": {
    scnCode: "SCN-013", moduleId: 4,
    primaryCompetency: { fr: "Analyse taux de service", en: "Service Level Analysis" },
    warehouseRole: { fr: "Responsable performance", en: "Performance Manager" },
    bloomLevel: { fr: "Évaluer", en: "Evaluate" },
    progression: { fr: "Expert M4", en: "M4 Expert" },
    erpMaturity: 4, wmsMaturity: 4,
    certificationNote: { fr: "Diagnostic service M4 — corrélation erreurs/KPI", en: "M4 service diagnosis — error/KPI correlation" },
  },
  "SCN-014": {
    scnCode: "SCN-014", moduleId: 4,
    primaryCompetency: { fr: "Diagnostic stratégique", en: "Strategic Diagnosis" },
    warehouseRole: { fr: "Directeur opérations", en: "Operations Manager" },
    bloomLevel: { fr: "Évaluer", en: "Evaluate" },
    progression: { fr: "Expert M4", en: "M4 Expert" },
    erpMaturity: 5, wmsMaturity: 5,
    certificationNote: { fr: "Capstone M4 — décision stratégique multi-KPI, seuil 70/100", en: "M4 capstone — multi-KPI strategic decision, 70/100 threshold" },
  },
  "SCN-015": {
    scnCode: "SCN-015", moduleId: 5,
    primaryCompetency: { fr: "Opérations intégrées", en: "Integrated Operations" },
    warehouseRole: { fr: "Gestionnaire entrepôt", en: "Warehouse Manager" },
    bloomLevel: { fr: "Évaluer", en: "Evaluate" },
    progression: { fr: "Maître M5", en: "M5 Master" },
    erpMaturity: 4, wmsMaturity: 4,
    certificationNote: { fr: "Progression vers certification Gold", en: "Progress toward Gold certification" },
  },
  "SCN-016": {
    scnCode: "SCN-016", moduleId: 5,
    primaryCompetency: { fr: "Action corrective", en: "Corrective Action" },
    warehouseRole: { fr: "Gestionnaire entrepôt", en: "Warehouse Manager" },
    bloomLevel: { fr: "Évaluer", en: "Evaluate" },
    progression: { fr: "Maître M5", en: "M5 Master" },
    erpMaturity: 5, wmsMaturity: 5,
    certificationNote: { fr: "M5 corrective action — résoudre variance avant KPI", en: "M5 corrective action — resolve variance before KPI" },
  },
  "SCN-017": {
    scnCode: "SCN-017", moduleId: 5,
    primaryCompetency: { fr: "Décision stratégique", en: "Strategic Decision-Making" },
    warehouseRole: { fr: "Directeur logistique", en: "Director" },
    bloomLevel: { fr: "Créer", en: "Create" },
    progression: { fr: "Maître M5", en: "M5 Master" },
    erpMaturity: 5, wmsMaturity: 5,
  },
};
