/** Display-only M4 KPI control tower content (SCN-012–014). No scenario logic. */

/** Annexe A — KPI interpretation reference guide (aligned with July 2026 student guide + calculateKpis). */
export const ANNEXE_A_KPI_GUIDE = {
  titleFr: "Annexe A — Grille de lecture KPI",
  titleEn: "Annex A — KPI Interpretation Grid",
  rows: [
    {
      kpi: { fr: "Rotation des stocks", en: "Inventory Turnover" },
      // Risk framing (not automatic conclusion): <4× overstock risk · >12× tight-stock risk
      critical: { fr: "< 4× / an (rotation faible — risque de surstock)", en: "< 4×/yr (low turnover — overstock risk)" },
      normal: { fr: "4–12× / an", en: "4–12×/yr" },
      excellent: { fr: "> 12× / an (rotation élevée — risque stock trop serré)", en: "> 12×/yr (high turnover — tight stock risk)" },
    },
    {
      kpi: { fr: "Taux de service (OTIF)", en: "Service Level (OTIF)" },
      // Engine: <85 insuffisant · 85–94 acceptable · ≥95 excellent (guide: alerte <85)
      critical: { fr: "< 85 %", en: "< 85%" },
      normal: { fr: "85–94 %", en: "85–94%" },
      excellent: { fr: "≥ 95 %", en: "≥ 95%" },
    },
    {
      kpi: { fr: "Taux d'erreur opérationnel", en: "Operational Error Rate" },
      critical: { fr: "> 5 %", en: "> 5%" },
      normal: { fr: "1–5 %", en: "1–5%" },
      excellent: { fr: "< 1 %", en: "< 1%" },
    },
    {
      kpi: { fr: "Délai fournisseur", en: "Supplier Lead Time" },
      critical: { fr: "> 7 jours", en: "> 7 days" },
      normal: { fr: "3–7 jours", en: "3–7 days" },
      excellent: { fr: "< 3 jours", en: "< 3 days" },
    },
  ],
} as const;
export interface M4KpiTowerEntry {
  kpiEvaluated: { fr: string; en: string };
  target: { fr: string; en: string };
  diagnosticFocus: { fr: string; en: string };
  alertRisk: { fr: string; en: string };
  expectedOutput: { fr: string; en: string };
}

export const M4_KPI_CONTROL_TOWER: Record<string, M4KpiTowerEntry> = {
  "SCN-012": {
    kpiEvaluated: { fr: "Rotation des stocks (Inventory Turnover)", en: "Inventory Turnover" },
    target: { fr: "Classifier bande 4–12×/an et recommander politique stock (maintien / réduction / hausse)", en: "Classify 4–12×/yr band and recommend stock policy (maintain / reduce / increase)" },
    diagnosticFocus: { fr: "6× = bande normale — jugement capital (48 000 $) vs suivi des SKU, pas chasse au surstock", en: "6× = normal band — capital judgment ($48k) vs SKU follow-up, not overstock hunt" },
    alertRisk: { fr: "Misclassification surstock @ 6× · Complaisance sans suivi des SKU", en: "Misclassifying overstock @ 6× · Complacency without SKU follow-up" },
    expectedOutput: { fr: "Politique stock + suivi des SKU (MC$4 / CO-PA)", en: "Stock policy + SKU follow-up (MC$4 / CO-PA)" },
  },
  "SCN-013": {
    kpiEvaluated: { fr: "Taux de service & taux d'erreur opérationnelle", en: "Service Level & Operational Error Rate" },
    target: { fr: "Service 95 % (excellent au seuil) · Erreurs 4 % (acceptable) — arbitrage budget formation J-90", en: "Service 95% (excellent at threshold) · Errors 4% (acceptable) — J-90 training budget arbitration" },
    diagnosticFocus: { fr: "Corréler erreurs picking/réception au risque OTIF malgré headline excellent — pas baisse de service", en: "Correlate picking/receiving errors with OTIF drift risk despite excellent headline — not service decline" },
    alertRisk: { fr: "Piège tableau vert · Erreurs 4 % → dérive OTIF · Destock comme mauvais levier", en: "Green dashboard trap · 4% errors → OTIF drift · Destock as wrong lever" },
    expectedOutput: { fr: "Programme exécution picking/réception + cible chiffrée (VL06O / performance)", en: "Picking/receiving execution program + numeric target (VL06O / performance)" },
  },
  "SCN-014": {
    kpiEvaluated: { fr: "Diagnostic multi-KPI (rotation + service + erreurs + délai)", en: "Multi-KPI diagnosis (turnover + service + errors + lead time)" },
    target: { fr: "S&OP — une initiative financée · intègre angle capital (012) + exécution (013)", en: "S&OP — one funded initiative · integrates capital angle (012) + execution angle (013)" },
    diagnosticFocus: { fr: "Arbitrage CFO/Ventes/Ops — nommer levier, compromis, KPIs de suivi 90 j", en: "CFO/Sales/Ops arbitration — name lever, trade-off, 90-day follow-up KPIs" },
    alertRisk: { fr: "Décision mono-KPI · Paragraphe comité sans arbitrage explicite", en: "Single-KPI decision · Board paragraph without explicit trade-off" },
    expectedOutput: { fr: "Paragraphe décisionnel prêt pour le comité avec sacrifice et priorités (SAC / analytics embarquée)", en: "Board-ready decision paragraph with sacrifice and priorities (SAC / embedded analytics)" },
  },
};
