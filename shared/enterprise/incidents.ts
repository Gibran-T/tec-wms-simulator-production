/** Enterprise Universe Part VII — recurring incidents catalogue (INC-001→016) */

export interface IncidentRef {
  id: string;
  nameFr: string;
  nameEn: string;
  severity: "medium" | "high" | "critical";
  primaryOwner: string;
  scnCodes: string[];
}

export const INCIDENT_REGISTRY: Record<string, IncidentRef> = {
  "INC-001": {
    id: "INC-001",
    nameFr: "Réception fantôme",
    nameEn: "Ghost goods receipt",
    severity: "high",
    primaryOwner: "QA / REC",
    scnCodes: ["SCN-002"],
  },
  "INC-002": {
    id: "INC-002",
    nameFr: "Rupture de stock",
    nameEn: "Stockout / insufficient ATP",
    severity: "high",
    primaryOwner: "CS → PLAN → PROC",
    scnCodes: ["SCN-003"],
  },
  "INC-003": {
    id: "INC-003",
    nameFr: "Écart d'inventaire",
    nameEn: "Cycle count variance",
    severity: "high",
    primaryOwner: "INV",
    scnCodes: ["SCN-004", "SCN-009", "SCN-010"],
  },
  "INC-004": {
    id: "INC-004",
    nameFr: "Anomalies multiples",
    nameEn: "Multi-anomaly shift",
    severity: "critical",
    primaryOwner: "OPS",
    scnCodes: ["SCN-005"],
  },
  "INC-005": {
    id: "INC-005",
    nameFr: "Quai saturé",
    nameEn: "Dock saturation",
    severity: "medium",
    primaryOwner: "WH / REC",
    scnCodes: ["SCN-006"],
  },
  "INC-006": {
    id: "INC-006",
    nameFr: "Dépassement de capacité",
    nameEn: "Bin capacity overflow",
    severity: "medium",
    primaryOwner: "WH",
    scnCodes: ["SCN-007"],
  },
  "INC-007": {
    id: "INC-007",
    nameFr: "Violation FIFO",
    nameEn: "FIFO breach risk",
    severity: "high",
    primaryOwner: "WH / QA",
    scnCodes: ["SCN-008"],
  },
  "INC-008": {
    id: "INC-008",
    nameFr: "Point de réappro atteint",
    nameEn: "Replenishment trigger",
    severity: "medium",
    primaryOwner: "PLAN",
    scnCodes: ["SCN-009"],
  },
  "INC-009": {
    id: "INC-009",
    nameFr: "Déséquilibre Min/Max",
    nameEn: "Min/max imbalance",
    severity: "medium",
    primaryOwner: "PLAN / INV",
    scnCodes: ["SCN-010", "SCN-011"],
  },
  "INC-010": {
    id: "INC-010",
    nameFr: "Écart multi-emplacements",
    nameEn: "Multi-bin accuracy drift",
    severity: "high",
    primaryOwner: "QA / INV",
    scnCodes: ["SCN-011"],
  },
  "INC-011": {
    id: "INC-011",
    nameFr: "Rotation hors bande",
    nameEn: "Rotation band breach",
    severity: "high",
    primaryOwner: "MGT / PLAN",
    scnCodes: ["SCN-012"],
  },
  "INC-012": {
    id: "INC-012",
    nameFr: "Risque SLA client",
    nameEn: "Customer SLA at risk",
    severity: "critical",
    primaryOwner: "CS",
    scnCodes: ["SCN-013"],
  },
  "INC-013": {
    id: "INC-013",
    nameFr: "Conflit KPI",
    nameEn: "Multi-KPI conflict",
    severity: "critical",
    primaryOwner: "MGT",
    scnCodes: ["SCN-014"],
  },
  "INC-014": {
    id: "INC-014",
    nameFr: "Précharge de pointe",
    nameEn: "Peak preload surge",
    severity: "high",
    primaryOwner: "OPS",
    scnCodes: ["SCN-015"],
  },
  "INC-015": {
    id: "INC-015",
    nameFr: "Défense SLA horaire",
    nameEn: "Hour-by-hour SLA defense",
    severity: "critical",
    primaryOwner: "CS / OPS",
    scnCodes: ["SCN-016"],
  },
  "INC-016": {
    id: "INC-016",
    nameFr: "Arbitrage exécutif",
    nameEn: "Executive trade-off",
    severity: "critical",
    primaryOwner: "MGT",
    scnCodes: ["SCN-017"],
  },
};

export function getIncidentById(id: string): IncidentRef | undefined {
  return INCIDENT_REGISTRY[id];
}
