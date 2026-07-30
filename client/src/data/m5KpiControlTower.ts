/** M5 KPI Control Tower — student-safe capstone copy for SCN-015/016/017 */

/** Annexe B — M5 operational cycle rubric (what each step proves) */
export const ANNEXE_B_M5_OPS_RUBRIC = {
  titleFr: "Annexe B — Grille opérationnelle M5",
  titleEn: "Annex B — M5 Operational Rubric",
  steps: [
    { code: "M5_RECEPTION", fr: "Réception PO — quantité & référence exactes", en: "PO Receipt — exact quantity & reference" },
    { code: "M5_PUTAWAY", fr: "Rangement — bin source → bin destination correct", en: "Putaway — correct source → destination bin" },
    { code: "M5_CYCLE_COUNT", fr: "Comptage cyclique — détecter variance éventuelle", en: "Cycle count — detect any variance" },
    { code: "M5_ADJ", fr: "Ajustement inventaire — résoudre l'écart avant de décider (SCN-016)", en: "Inventory adjustment — resolve variance before deciding (SCN-016)" },
    { code: "M5_REPLENISH", fr: "Réapprovisionnement — Q = Max − stock actuel", en: "Replenishment — Q = Max − current stock" },
    { code: "M5_KPI", fr: "Preuves du cycle — confirmer les valeurs de votre session (pas de copier-coller)", en: "Cycle evidence — confirm your session values (no copy-paste)" },
    { code: "M5_DECISION", fr: "Décision — ≥3 preuves de session + diagnostic + priorité + compromis + horizon", en: "Decision — ≥3 session evidence + diagnostic + priority + trade-off + horizon" },
    { code: "COMPLIANCE_M5", fr: "Conformité — toutes étapes validées, preuves du cycle confirmées", en: "Compliance — all steps validated, cycle evidence confirmed" },
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
    kpiEvaluated: { fr: "Preuves de session · stock final · variance · conformité", en: "Session evidence · final stock · variance · compliance" },
    target: { fr: "Citez les preuves disponibles dans votre session", en: "Cite the evidence available in your session" },
    diagnosticFocus: { fr: "Cycle nominal — ops conforme, Q = 0 peut être valide", en: "Nominal cycle — compliant ops, Q = 0 can be valid" },
    alertRisk: { fr: "Inventer une correction alors que le cycle est conforme", en: "Inventing a correction when the cycle is already compliant" },
    expectedOutput: { fr: "Décision tactique + suivi, sans correction artificielle", en: "Tactical decision + follow-up, without artificial correction" },
  },
  "SCN-016": {
    kpiEvaluated: { fr: "Variance inventaire après comptage", en: "Inventory variance after cycle count" },
    target: { fr: "Système 50 u. · Physique 45 u. · Écart −5 · Corrigé 45 · Min 10 · Q = 0", en: "System 50 u. · Physical 45 u. · Variance −5 · Corrected 45 · Min 10 · Q = 0" },
    diagnosticFocus: { fr: "Réconcilier d'abord, décider ensuite — réappro est une décision distincte", en: "Reconcile first, decide next — replenishment is a separate decision" },
    alertRisk: { fr: "Décider ou réapprovisionner tant que l'écart n'est pas réconcilié", en: "Deciding or replenishing while variance remains open" },
    expectedOutput: { fr: "Réconciliation → stock corrigé → décision de réappro (Q = 0 si Min respecté)", en: "Reconciliation → corrected stock → replenishment decision (Q = 0 if Min met)" },
    varianceSignal: { fr: "Écart −5 u. au bin B-01-R1-L1", en: "−5 u. variance at bin B-01-R1-L1" },
  },
  "SCN-017": {
    kpiEvaluated: { fr: "Preuves de session M5 (m5-session-v1)", en: "M5 session evidence (m5-session-v1)" },
    target: { fr: "Citez au moins trois preuves de votre run (pas le portfolio M4)", en: "Cite at least three evidence items from your run (not the M4 portfolio)" },
    diagnosticFocus: { fr: "Preuves → diagnostic → priorité → compromis → horizon → recommandation", en: "Evidence → diagnostic → priority → trade-off → horizon → recommendation" },
    alertRisk: { fr: "Réponses génériques ou valeurs de portfolio figées présentées comme preuves de session", en: "Generic answers or fixed portfolio values presented as session evidence" },
    expectedOutput: { fr: "≥3 preuves · diagnostic · priorité · compromis · horizon · recommandation", en: "≥3 evidence · diagnostic · priority · trade-off · horizon · recommendation" },
  },
};

export const M5_DECISION_SCAFFOLD: Record<string, { fr: string; en: string }> = {
  "SCN-017": {
    fr: "Modèle : Preuves de session (≥3) · Diagnostic · Priorité · Compromis explicite · Horizon (prochain quart / 7 j / 30 j / 90–180 j) · Recommandation professionnelle.",
    en: "Template: Session evidence (≥3) · Diagnostic · Priority · Explicit trade-off · Horizon (next shift / 7d / 30d / 90–180d) · Professional recommendation.",
  },
};
