/** M5 KPI Control Tower — student-safe capstone copy for SCN-015/016/017 */

/** Annexe B — M5 operational cycle rubric (what each step proves) */
export const ANNEXE_B_M5_OPS_RUBRIC = {
  titleFr: "Annexe B — Grille opérationnelle M5",
  titleEn: "Annex B — M5 Operational Rubric",
  steps: [
    { code: "M5_RECEPTION", fr: "Réception PO — quantité & référence exactes", en: "PO Receipt — exact quantity & reference" },
    { code: "M5_PUTAWAY", fr: "Rangement — bin source → bin destination correct", en: "Putaway — correct source → destination bin" },
    { code: "M5_CYCLE_COUNT", fr: "Comptage cyclique — détecter variance éventuelle", en: "Cycle count — detect any variance" },
    { code: "M5_ADJ", fr: "Ajustement MI07 — résoudre variance avant KPI (SCN-016)", en: "MI07 Adjustment — resolve variance before KPI (SCN-016)" },
    { code: "M5_REPLENISH", fr: "Réapprovisionnement — Q = Max − stock actuel", en: "Replenishment — Q = Max − current stock" },
    { code: "M5_KPI", fr: "Snapshot KPI — confirmer valeurs du cycle (pas de copier-coller)", en: "KPI Snapshot — confirm cycle values (no copy-paste)" },
    { code: "M5_DECISION", fr: "Décision — KPI cités + arbitrage + horizon 90–180 j", en: "Decision — KPIs cited + trade-off + 90–180 day horizon" },
    { code: "COMPLIANCE_M5", fr: "Conformité — toutes étapes validées, snapshot requis", en: "Compliance — all steps validated, snapshot required" },
  ],
} as const;
export type M5KpiTowerEntry = {
  kpiEvaluated: { fr: string; en: string };
  target: { fr: string; en: string };
  diagnosticFocus: { fr: string; en: string };
  alertRisk: { fr: string; en: string };
  expectedOutput: { fr: string; en: string };
  varianceSignal?: { fr: string; en: string };
};

export const M5_KPI_CONTROL_TOWER: Record<string, M5KpiTowerEntry> = {
  "SCN-015": {
    kpiEvaluated: { fr: "Rotation · Service · Erreurs · Délai · Stock immobilisé", en: "Turnover · Service · Errors · Lead time · Tied-up stock" },
    target: { fr: "6× · 95 % · 4 % · 3,5 j · 48 000 $", en: "6× · 95% · 4% · 3.5d · $48k" },
    diagnosticFocus: { fr: "Cycle nominal — ops alimente le KPI final", en: "Nominal cycle — ops feeds final KPI" },
    alertRisk: { fr: "Sauter une étape ops fausse le snapshot KPI", en: "Skipping an ops step skews KPI snapshot" },
    expectedOutput: { fr: "7 étapes complètes puis décision tactique", en: "7 complete steps then tactical decision" },
  },
  "SCN-016": {
    kpiEvaluated: { fr: "Variance inventaire @ M5_CYCLE_COUNT", en: "Inventory variance @ M5_CYCLE_COUNT" },
    target: { fr: "Système 50 u. · Physique 45 u. · Écart −5", en: "System 50 u. · Physical 45 u. · Variance −5" },
    diagnosticFocus: { fr: "Corriger via M5_ADJ (MI07) avant réappro/KPI", en: "Correct via M5_ADJ (MI07) before replenish/KPI" },
    alertRisk: { fr: "KPI bloqué tant que variance non résolue", en: "KPI blocked until variance resolved" },
    expectedOutput: { fr: "CC → ADJ → réappro → KPI post-correction", en: "CC → ADJ → replenish → post-correction KPI" },
    varianceSignal: { fr: "Écart −5 u. injecté @ B-01-R1-L1", en: "Injected −5 u. variance @ B-01-R1-L1" },
  },
  "SCN-017": {
    kpiEvaluated: { fr: "Snapshot KPI post-cycle (Annexe A)", en: "Post-cycle KPI snapshot (Annex A)" },
    target: { fr: "Rotation 6× · Service 95 % · Erreurs 4 % · Délai 3,5 j", en: "Turnover 6× · Service 95% · Errors 4% · Lead time 3.5d" },
    diagnosticFocus: { fr: "Décision stratégique — citez ≥2 KPI chiffrés du snapshot", en: "Strategic decision — cite ≥2 numeric KPIs from snapshot" },
    alertRisk: { fr: "Réponses génériques ou niveau opérationnel rejetées", en: "Generic or operational-level answers rejected" },
    expectedOutput: { fr: "Trade-off · recommandation · horizon 90–180 j", en: "Trade-off · recommendation · 90–180 day horizon" },
  },
};

export const M5_DECISION_SCAFFOLD: Record<string, { fr: string; en: string }> = {
  "SCN-017": {
    fr: "Modèle : Situation post-cycle · Preuve KPI (rotation 6×, service 95 %, erreurs 4 %, délai 3,5 j) · Décision stratégique · Trade-off explicite · Horizon 90 j · KPI de suivi.",
    en: "Template: Post-cycle situation · KPI proof (6× turnover, 95% service, 4% errors, 3.5d lead) · Strategic decision · Explicit trade-off · 90-day horizon · Follow-up KPIs.",
  },
};
