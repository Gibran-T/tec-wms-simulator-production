/** Display-only M4 KPI control tower content (SCN-012–014). No scenario logic. */
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
    diagnosticFocus: { fr: "6× = bande normale — jugement capital (48 000 $) vs surveillance SKU, pas chasse au surstock", en: "6× = normal band — capital judgment ($48k) vs SKU monitoring, not overstock hunt" },
    alertRisk: { fr: "Misclassification surstock @ 6× · Complaisance sans monitoring SKU", en: "Misclassifying overstock @ 6× · Complacency without SKU monitoring" },
    expectedOutput: { fr: "Politique stock + surveillance SKU (MC$4 / CO-PA)", en: "Stock policy + SKU monitoring (MC$4 / CO-PA)" },
  },
  "SCN-013": {
    kpiEvaluated: { fr: "Taux de service & taux d'erreur opérationnelle", en: "Service Level & Operational Error Rate" },
    target: { fr: "Service 95 % (excellent au seuil) · Erreurs 4 % (acceptable) — arbitrage budget formation J-90", en: "Service 95% (excellent at threshold) · Errors 4% (acceptable) — J-90 training budget arbitration" },
    diagnosticFocus: { fr: "Corréler erreurs picking/réception au risque OTIF malgré headline excellent — pas baisse de service", en: "Correlate picking/receiving errors with OTIF drift risk despite excellent headline — not service decline" },
    alertRisk: { fr: "Piège tableau vert · Erreurs 4 % → dérive OTIF · Destock comme mauvais levier", en: "Green dashboard trap · 4% errors → OTIF drift · Destock as wrong lever" },
    expectedOutput: { fr: "Programme exécution picking/réception + cible chiffrée (VL06O / performance)", en: "Picking/receiving execution program + numeric target (VL06O / performance)" },
  },
  "SCN-014": {
    kpiEvaluated: { fr: "Diagnostic multi-KPI (rotation + service + erreurs + lead time)", en: "Multi-KPI diagnosis (turnover + service + errors + lead time)" },
    target: { fr: "S&OP — une initiative financée · intègre lentille capital (012) + exécution (013)", en: "S&OP — one funded initiative · integrates capital lens (012) + execution lens (013)" },
    diagnosticFocus: { fr: "Arbitrage CFO/Ventes/Ops — nommer levier, trade-off, KPIs de suivi 90 j", en: "CFO/Sales/Ops arbitration — name lever, trade-off, 90-day follow-up KPIs" },
    alertRisk: { fr: "Décision mono-KPI · Paragraphe board sans arbitrage explicite", en: "Single-KPI decision · Board paragraph without explicit trade-off" },
    expectedOutput: { fr: "Paragraphe décisionnel board-ready avec sacrifice et priorités (SAC / embedded analytics)", en: "Board-ready decision paragraph with sacrifice and priorities (SAC / embedded analytics)" },
  },
};
