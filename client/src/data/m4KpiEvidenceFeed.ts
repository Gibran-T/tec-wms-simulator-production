import type { M4KpiInterpretationRow } from "./m4KpiBandUtils";

export type M4EvidenceFeedRow = {
  id: string;
  gateStep: string;
  scnFilter?: string[];
  timestamp: string;
  source: string;
  category: "STOCK" | "DELIVERY" | "QUALITY" | "PROCUREMENT" | "ANALYTICS" | "GATE";
  labelFr: string;
  labelEn: string;
  valueFr: string;
  valueEn: string;
  bandFr?: string;
  bandEn?: string;
  bandColor?: "red" | "amber" | "green" | "neutral";
  animate?: boolean;
};

export const M4_EVIDENCE_FEED_ROWS: M4EvidenceFeedRow[] = [
  {
    id: "mb52-consumption",
    gateStep: "KPI_DATA",
    timestamp: "T+0:00",
    source: "MB52",
    category: "STOCK",
    labelFr: "Consommation & stock moyen",
    labelEn: "Consumption & average stock",
    valueFr: "Conso. annuelle 2 400 u. · Stock moyen 400 u. chargés",
    valueEn: "Annual consumption 2,400 u. · Average stock 400 u. loaded",
    bandColor: "neutral",
  },
  {
    id: "me2m-leadtime",
    gateStep: "KPI_DATA",
    timestamp: "T+0:05",
    source: "ME2M",
    category: "PROCUREMENT",
    labelFr: "Délai fournisseur",
    labelEn: "Supplier lead time",
    valueFr: "Délai fournisseur moyen : 3,5 j",
    valueEn: "Average supplier lead time: 3.5 d",
    bandFr: "NORMAL",
    bandEn: "NORMAL",
    bandColor: "amber",
  },
  {
    id: "scn012-copa-capital",
    gateStep: "KPI_DATA",
    scnFilter: ["SCN-012"],
    timestamp: "T+0:08",
    source: "CO-PA",
    category: "ANALYTICS",
    labelFr: "Capital immobilisé",
    labelEn: "Tied-up capital",
    valueFr: "Capital immobilisé 48 000 $ — contexte CFO Q3",
    valueEn: "Tied-up capital $48,000 — CFO Q3 context",
    bandColor: "neutral",
  },
  {
    id: "scn013-vl06o-headline",
    gateStep: "KPI_DATA",
    scnFilter: ["SCN-013"],
    timestamp: "T+0:08",
    source: "VL06O",
    category: "DELIVERY",
    labelFr: "Headline OTIF vert",
    labelEn: "Green OTIF headline",
    valueFr: "Headline vert — corréler avec QM 4 %",
    valueEn: "Green headline — correlate with QM 4%",
    bandColor: "green",
  },
  {
    id: "scn014-sac-pipeline",
    gateStep: "KPI_DATA",
    scnFilter: ["SCN-014"],
    timestamp: "T+0:08",
    source: "SAC",
    category: "ANALYTICS",
    labelFr: "Pipeline S&OP",
    labelEn: "S&OP pipeline",
    valueFr: "Pipeline S&OP — 4 lentilles KPI requises",
    valueEn: "S&OP pipeline — 4 KPI lenses required",
    bandColor: "neutral",
  },
  {
    id: "mc44-rotation",
    gateStep: "KPI_ROTATION",
    timestamp: "T+0:15",
    source: "MC$4",
    category: "ANALYTICS",
    labelFr: "Rotation calculée",
    labelEn: "Calculated turnover",
    valueFr: "Rotation calculée : 6× — bande NORMALE",
    valueEn: "Calculated turnover: 6× — NORMAL band",
    bandFr: "NORMAL",
    bandEn: "NORMAL",
    bandColor: "amber",
    animate: true,
  },
  {
    id: "vl06o-otif",
    gateStep: "KPI_SERVICE",
    timestamp: "T+0:30",
    source: "VL06O",
    category: "DELIVERY",
    labelFr: "OTIF livraisons",
    labelEn: "Delivery OTIF",
    valueFr: "OTIF : 285/300 = 95,0 % — EXCELLENT",
    valueEn: "OTIF: 285/300 = 95.0% — EXCELLENT",
    bandFr: "EXCELLENT",
    bandEn: "EXCELLENT",
    bandColor: "green",
    animate: true,
  },
  {
    id: "qm-errors",
    gateStep: "KPI_SERVICE",
    timestamp: "T+0:32",
    source: "QM",
    category: "QUALITY",
    labelFr: "Alertes qualité",
    labelEn: "Quality alerts",
    valueFr: "Alertes qualité : 12/300 = 4,0 % — ACCEPTABLE",
    valueEn: "Quality alerts: 12/300 = 4.0% — ACCEPTABLE",
    bandFr: "ACCEPTABLE",
    bandEn: "ACCEPTABLE",
    bandColor: "amber",
    animate: true,
  },
  {
    id: "sac-diagnostic",
    gateStep: "KPI_DIAGNOSTIC",
    timestamp: "T+0:45",
    source: "SAC",
    category: "ANALYTICS",
    labelFr: "Diagnostic étudiant",
    labelEn: "Student diagnostic",
    valueFr: "Diagnostic étudiant déposé",
    valueEn: "Student diagnostic submitted",
    bandColor: "neutral",
    animate: true,
  },
  {
    id: "iso-compliance",
    gateStep: "COMPLIANCE_M4",
    timestamp: "T+1:00",
    source: "ISO",
    category: "GATE",
    labelFr: "Revue conformité interprétations",
    labelEn: "Interpretation compliance review",
    valueFr: "Revue conformité interprétations — PASS",
    valueEn: "Interpretation compliance review — PASS",
    bandFr: "PASS",
    bandEn: "PASS",
    bandColor: "green",
    animate: true,
  },
];

function rowMatchesScn(row: M4EvidenceFeedRow, scnCode: string): boolean {
  if (!row.scnFilter) return true;
  return row.scnFilter.includes(scnCode);
}

function stepCompleted(completedSteps: string[], step: string): boolean {
  return completedSteps.includes(step);
}

function resolveComplianceBand(
  kpiInterpretations: M4KpiInterpretationRow[] | undefined,
): { bandColor: "green" | "red"; valueFr: string; valueEn: string; bandFr: string; bandEn: string } {
  const rows = kpiInterpretations ?? [];
  const interpretationKeys = ["rotationRate", "serviceLevel", "diagnostic"];
  const relevant = rows.filter((r) => interpretationKeys.includes(r.kpiKey));
  const allCorrect = relevant.length > 0 && relevant.every((r) => r.isCorrect);
  if (allCorrect) {
    return {
      bandColor: "green",
      valueFr: "Revue conformité interprétations — PASS",
      valueEn: "Interpretation compliance review — PASS",
      bandFr: "PASS",
      bandEn: "PASS",
    };
  }
  return {
    bandColor: "red",
    valueFr: "Revue conformité interprétations — FAIL",
    valueEn: "Interpretation compliance review — FAIL",
    bandFr: "FAIL",
    bandEn: "FAIL",
  };
}

/** Returns visible feed rows in display order (newest first for monitor). */
export function getVisibleM4EvidenceRows(
  completedSteps: string[],
  scnCode: string,
  kpiInterpretations?: M4KpiInterpretationRow[],
): M4EvidenceFeedRow[] {
  const visible = M4_EVIDENCE_FEED_ROWS.filter(
    (row) => stepCompleted(completedSteps, row.gateStep) && rowMatchesScn(row, scnCode),
  ).map((row) => {
    if (row.id !== "iso-compliance") return row;
    const compliance = resolveComplianceBand(kpiInterpretations);
    return {
      ...row,
      valueFr: compliance.valueFr,
      valueEn: compliance.valueEn,
      bandFr: compliance.bandFr,
      bandEn: compliance.bandEn,
      bandColor: compliance.bandColor,
    };
  });

  return visible;
}

/** Row ids unlocked by a given completed step (for tests). */
export function getRowIdsUnlockedByStep(step: string, scnCode: string): string[] {
  return M4_EVIDENCE_FEED_ROWS.filter(
    (row) => row.gateStep === step && rowMatchesScn(row, scnCode),
  ).map((r) => r.id);
}
