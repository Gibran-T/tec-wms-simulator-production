/**
 * Single pedagogical analytics source for M4/M5 KPI dashboards.
 * Values must stay aligned with:
 * - TECWMS_GUIDE_ETUDIANT_M4_M5_PREPARATION_CERTIFICATION_PDF_READY.md (juillet 2026)
 * - CANONICAL_M4_KPI_DATA / calculateKpis in rulesEngine
 * Do not invent alternate bands or portfolio numbers here.
 */

export type PedagogicalKpiCard = {
  id: string;
  nameFr: string;
  nameEn: string;
  value: number | string;
  unitFr: string;
  unitEn: string;
  targetFr: string;
  targetEn: string;
  statusFr: string;
  statusEn: string;
  priorValue: number | string;
  deltaFr: string;
  deltaEn: string;
  interpretationFr: string;
  interpretationEn: string;
};

export type PedagogicalTrendPoint = {
  periodFr: string;
  periodEn: string;
  value: number;
};

export type PedagogicalSourceRow = {
  metricFr: string;
  metricEn: string;
  value: string;
  originFr: string;
  originEn: string;
};

export type GuidedReadingStep = {
  n: number;
  fr: string;
  en: string;
};

/** Portfolio dataset shared by SCN-012/013/014 (tour de contrôle). */
export const M4_PORTFOLIO_ANALYTICS = {
  periodFr: "T2 2026 — portefeuille entrepôt pédagogique",
  periodEn: "Q2 2026 — pedagogical warehouse portfolio",
  datasetLabelFr: "Jeu de données canonic TEC.WMS M4 (lecture seule)",
  datasetLabelEn: "TEC.WMS M4 canonical dataset (read-only)",
  cards: [
    {
      id: "rotation",
      nameFr: "Rotation des stocks",
      nameEn: "Inventory turnover",
      value: 6,
      unitFr: "× / an",
      unitEn: "× / yr",
      targetFr: "Bande 4–12×",
      targetEn: "Band 4–12×",
      statusFr: "Normal",
      statusEn: "Normal",
      priorValue: 5.4,
      deltaFr: "+0,6× vs T1",
      deltaEn: "+0.6× vs Q1",
      interpretationFr: "6× dans la bande normale — ne pas conclure surstock global",
      interpretationEn: "6× in the normal band — do not conclude global overstock",
    },
    {
      id: "capital",
      nameFr: "Capital immobilisé",
      nameEn: "Tied-up capital",
      value: 48000,
      unitFr: "$",
      unitEn: "$",
      targetFr: "Cohérent avec rotation normale",
      targetEn: "Consistent with normal turnover",
      statusFr: "À surveiller",
      statusEn: "Monitor",
      priorValue: 51000,
      deltaFr: "−3 000 $ vs T1",
      deltaEn: "−$3,000 vs Q1",
      interpretationFr: "Capital justifié si politique globale maintenue + revue SKU",
      interpretationEn: "Capital justified if global policy maintained + SKU review",
    },
    {
      id: "otif",
      nameFr: "Service (OTIF)",
      nameEn: "Service (OTIF)",
      value: 95,
      unitFr: "%",
      unitEn: "%",
      targetFr: "≥ 95 %",
      targetEn: "≥ 95%",
      statusFr: "Excellent",
      statusEn: "Excellent",
      priorValue: 93,
      deltaFr: "+2 pts vs T1",
      deltaEn: "+2 pts vs Q1",
      interpretationFr: "Headline vert — ne masque pas le risque erreurs 4 %",
      interpretationEn: "Green headline — does not hide 4% error risk",
    },
    {
      id: "errors",
      nameFr: "Taux d'erreur",
      nameEn: "Error rate",
      value: 4,
      unitFr: "%",
      unitEn: "%",
      targetFr: "1–5 % acceptable",
      targetEn: "1–5% acceptable",
      statusFr: "Acceptable",
      statusEn: "Acceptable",
      priorValue: 3.2,
      deltaFr: "+0,8 pt vs T1",
      deltaEn: "+0.8 pt vs Q1",
      interpretationFr: "Acceptable mais levier qualité (pas destock)",
      interpretationEn: "Acceptable but quality lever (not destock)",
    },
    {
      id: "leadTime",
      nameFr: "Délai fournisseur",
      nameEn: "Supplier lead time",
      value: 3.5,
      unitFr: "jours",
      unitEn: "days",
      targetFr: "3–7 j",
      targetEn: "3–7 days",
      statusFr: "Normal",
      statusEn: "Normal",
      priorValue: 3.8,
      deltaFr: "−0,3 j vs T1",
      deltaEn: "−0.3 d vs Q1",
      interpretationFr: "Délai stable — pas le levier principal M4",
      interpretationEn: "Stable lead time — not the primary M4 lever",
    },
  ] as PedagogicalKpiCard[],
  rotationTrend: [
    { periodFr: "T3 2025", periodEn: "Q3 2025", value: 5.1 },
    { periodFr: "T4 2025", periodEn: "Q4 2025", value: 5.3 },
    { periodFr: "T1 2026", periodEn: "Q1 2026", value: 5.4 },
    { periodFr: "T2 2026", periodEn: "Q2 2026", value: 6.0 },
  ] as PedagogicalTrendPoint[],
  sourceRows: [
    {
      metricFr: "Consommation annuelle",
      metricEn: "Annual consumption",
      value: "2 400 u.",
      originFr: "Agrégation sorties GI / demandes",
      originEn: "Aggregated GI / demand",
    },
    {
      metricFr: "Stock moyen",
      metricEn: "Average stock",
      value: "400 u.",
      originFr: "Moyenne inventaire valorisé",
      originEn: "Average valued inventory",
    },
    {
      metricFr: "Commandes honorées / total",
      metricEn: "Orders fulfilled / total",
      value: "285 / 300",
      originFr: "OTIF portefeuille",
      originEn: "Portfolio OTIF",
    },
    {
      metricFr: "Erreurs / opérations",
      metricEn: "Errors / operations",
      value: "12 / 300",
      originFr: "Incidents picking / réception",
      originEn: "Picking / receiving incidents",
    },
    {
      metricFr: "Valeur stock",
      metricEn: "Stock value",
      value: "48 000 $",
      originFr: "Valorisation inventaire",
      originEn: "Inventory valuation",
    },
  ] as PedagogicalSourceRow[],
  slowMovers: [
    { sku: "SKU-A12", abc: "C", rotation: 2.1, valueFr: "6 200 $", noteFr: "Lent — revue", noteEn: "Slow — review" },
    { sku: "SKU-B04", abc: "B", rotation: 3.4, valueFr: "4 800 $", noteFr: "Sous bande", noteEn: "Below band" },
    { sku: "SKU-C01", abc: "A", rotation: 7.2, valueFr: "18 000 $", noteFr: "Sain", noteEn: "Healthy" },
  ],
  lineage: [
    { stageFr: "MASTER DATA", stageEn: "MASTER DATA", itemsFr: "SKU · client · fournisseur · entrepôt", itemsEn: "SKU · customer · supplier · warehouse" },
    { stageFr: "TRANSACTION DATA", stageEn: "TRANSACTION DATA", itemsFr: "Réception · picking · GI · commandes · délais · erreurs", itemsEn: "Receipt · picking · GI · orders · delays · errors" },
    { stageFr: "TRANSFORM", stageEn: "TRANSFORM", itemsFr: "Nettoyage · agrégation · calcul KPI", itemsEn: "Cleaning · aggregation · KPI calculation" },
    { stageFr: "OUTPUT", stageEn: "OUTPUT", itemsFr: "KPI · graphique · décision · suivi", itemsEn: "KPI · chart · decision · follow-up" },
  ],
  guidedReading: [
    { n: 1, fr: "Identifier la période (T2 portefeuille)", en: "Identify the period (Q2 portfolio)" },
    { n: 2, fr: "Lire la valeur (ex. rotation 6×)", en: "Read the value (e.g. turnover 6×)" },
    { n: 3, fr: "Comparer avec la cible / bande (4–12×)", en: "Compare with target / band (4–12×)" },
    { n: 4, fr: "Observer la tendance vs période précédente", en: "Observe trend vs prior period" },
    { n: 5, fr: "Segmenter (SKU / classe ABC lents)", en: "Segment (slow SKU / ABC class)" },
    { n: 6, fr: "Identifier le risque (fausse conclusion surstock)", en: "Identify the risk (false overstock conclusion)" },
    { n: 7, fr: "Formuler une hypothèse professionnelle", en: "Formulate a professional hypothesis" },
    { n: 8, fr: "Recommander une action (maintien + revue SKU)", en: "Recommend an action (maintain + SKU review)" },
    { n: 9, fr: "Définir le KPI de suivi", en: "Define the follow-up KPI" },
  ] as GuidedReadingStep[],
} as const;

export function formatAnalyticsValue(card: PedagogicalKpiCard, language: string): string {
  const isFr = language === "FR" || language === "fr";
  if (card.id === "capital" && typeof card.value === "number") {
    return isFr ? `${card.value.toLocaleString("fr-CA")} $` : `$${card.value.toLocaleString("en-CA")}`;
  }
  if (typeof card.value === "number" && (card.id === "otif" || card.id === "errors")) {
    return isFr ? `${card.value} %` : `${card.value}%`;
  }
  if (typeof card.value === "number" && card.id === "rotation") {
    return `${card.value}×`;
  }
  if (typeof card.value === "number" && card.id === "leadTime") {
    return isFr ? `${String(card.value).replace(".", ",")} j` : `${card.value} d`;
  }
  return String(card.value);
}
