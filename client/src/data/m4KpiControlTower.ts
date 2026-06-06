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
    target: { fr: "Rotation 4–12×/an (zone normale) — détecter surstock ou sous-performance", en: "Turnover 4–12×/yr (normal band) — detect overstock or underperformance" },
    diagnosticFocus: { fr: "Analyser consommation annuelle vs stock moyen — identifier immobilisation excessive", en: "Analyze annual consumption vs average stock — identify excess carrying cost" },
    alertRisk: { fr: "Rotation < 4 → surstock · Rotation > 12 → rupture / sous-performance", en: "Turnover < 4 → overstock · Turnover > 12 → stockout risk" },
    expectedOutput: { fr: "Interprétation rotation + recommandation (MC$4 / CO-PA)", en: "Turnover interpretation + recommendation (MC$4 / CO-PA)" },
  },
  "SCN-013": {
    kpiEvaluated: { fr: "Taux de service & taux d'erreur opérationnelle", en: "Service Level & Operational Error Rate" },
    target: { fr: "Service ≥ 95 % (excellent) · Erreurs ≤ 1 % (excellent)", en: "Service ≥ 95% (excellent) · Errors ≤ 1% (excellent)" },
    diagnosticFocus: { fr: "Corréler erreurs picking/réception avec baisse du taux de service (OTIF)", en: "Correlate picking/receiving errors with service level decline (OTIF)" },
    alertRisk: { fr: "Service < 85 % ou erreurs > 5 % → risque SLA client", en: "Service < 85% or errors > 5% → customer SLA risk" },
    expectedOutput: { fr: "Diagnostic causes racines + plan d'action (VL06O / performance)", en: "Root-cause diagnosis + action plan (VL06O / performance)" },
  },
  "SCN-014": {
    kpiEvaluated: { fr: "Diagnostic multi-KPI (rotation + service + erreurs + lead time)", en: "Multi-KPI diagnosis (turnover + service + errors + lead time)" },
    target: { fr: "Synthèse stratégique avec trade-offs stock / service / coût", en: "Strategic synthesis with stock / service / cost trade-offs" },
    diagnosticFocus: { fr: "Identifier le levier prioritaire — pas d'analyse mono-indicateur", en: "Identify priority lever — no single-KPI analysis" },
    alertRisk: { fr: "Décision mono-KPI → sous-optimisation globale entrepôt", en: "Single-KPI decision → warehouse-wide sub-optimization" },
    expectedOutput: { fr: "Décision stratégique argumentée (SAC / embedded analytics)", en: "Justified strategic decision (SAC / embedded analytics)" },
  },
};
