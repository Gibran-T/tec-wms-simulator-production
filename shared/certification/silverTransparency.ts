/**
 * Silver transparency copy — exact unmet gate + required action.
 * Does not change eligibility criteria; formats persisted gate evidence only.
 */

export type SilverBlockerKind =
  | "unposted_transactions"
  | "unresolved_cycle_counts"
  | "missing_eval_run";

export type SilverBlockerEvidence = {
  kind: SilverBlockerKind;
  scnCode: string;
  runId: number | null;
  count: number;
  sku?: string | null;
  bin?: string | null;
  variance?: number | null;
};

export type SilverGateSnapshot = {
  quizPassed: boolean;
  scenariosCompleted: Record<string, boolean>;
  complianceValidated: boolean;
  noBlockers: boolean;
  silverEligible: boolean;
  silverCertified: boolean;
  blockers?: SilverBlockerEvidence[];
};

const SCN_LABEL: Record<string, { fr: string; en: string }> = {
  SCN001: { fr: "SCN-001 — Cycle opérationnel", en: "SCN-001 — Operational cycle" },
  SCN002: { fr: "SCN-002 — GR fantôme", en: "SCN-002 — Ghost GR" },
  SCN003: { fr: "SCN-003 — Stock insuffisant", en: "SCN-003 — Stock shortage" },
  SCN004: { fr: "SCN-004 — Écart inventaire", en: "SCN-004 — Inventory variance" },
  SCN005: { fr: "SCN-005 — Multi-conformités", en: "SCN-005 — Multi-compliance" },
};

function scnDisplay(code: string): string {
  if (code.startsWith("SCN-")) return code;
  if (/^SCN\d{3}$/.test(code)) return `SCN-${code.slice(3)}`;
  return code;
}

function formatBlockerFr(b: SilverBlockerEvidence): string {
  const scn = scnDisplay(b.scnCode);
  const run = b.runId != null ? `run ${b.runId}` : "aucun run d'évaluation";
  if (b.kind === "missing_eval_run") {
    return `${scn} : aucune run d'évaluation complétée (≥ 60/100)`;
  }
  if (b.kind === "unposted_transactions") {
    return `${scn} (${run}) : ${b.count} transaction(s) non postée(s)`;
  }
  const loc = [b.sku, b.bin].filter(Boolean).join(" @ ");
  const variance =
    b.variance != null && Number.isFinite(b.variance) ? `, écart ${b.variance}` : "";
  const locBit = loc ? ` — ${loc}` : "";
  return `${scn} (${run}) : ${b.count} comptage(s) cyclique(s) non résolu(s)${locBit}${variance}`;
}

function formatBlockerEn(b: SilverBlockerEvidence): string {
  const scn = scnDisplay(b.scnCode);
  const run = b.runId != null ? `run ${b.runId}` : "no evaluation run";
  if (b.kind === "missing_eval_run") {
    return `${scn}: no completed evaluation run (≥ 60/100)`;
  }
  if (b.kind === "unposted_transactions") {
    return `${scn} (${run}): ${b.count} unposted transaction(s)`;
  }
  const loc = [b.sku, b.bin].filter(Boolean).join(" @ ");
  const variance =
    b.variance != null && Number.isFinite(b.variance) ? `, variance ${b.variance}` : "";
  const locBit = loc ? ` — ${loc}` : "";
  return `${scn} (${run}): ${b.count} unresolved cycle count(s)${locBit}${variance}`;
}

function actionForBlockersFr(blockers: SilverBlockerEvidence[]): string {
  const scns = Array.from(new Set(blockers.map((b) => scnDisplay(b.scnCode)))).join(", ");
  if (blockers.some((b) => b.kind === "unresolved_cycle_counts")) {
    return `Rouvrir ${scns} en mode Évaluation, clôturer/résoudre les comptages cycliques restants (même si l'écart est 0), puis terminer la conformité.`;
  }
  if (blockers.some((b) => b.kind === "unposted_transactions")) {
    return `Rouvrir ${scns} en mode Évaluation et poster les transactions restantes.`;
  }
  return `Compléter ${scns} en mode Évaluation (≥ 60/100).`;
}

function actionForBlockersEn(blockers: SilverBlockerEvidence[]): string {
  const scns = Array.from(new Set(blockers.map((b) => scnDisplay(b.scnCode)))).join(", ");
  if (blockers.some((b) => b.kind === "unresolved_cycle_counts")) {
    return `Reopen ${scns} in Evaluation mode, close/resolve remaining cycle counts (even if variance is 0), then finish compliance.`;
  }
  if (blockers.some((b) => b.kind === "unposted_transactions")) {
    return `Reopen ${scns} in Evaluation mode and post remaining transactions.`;
  }
  return `Complete ${scns} in Evaluation mode (≥ 60/100).`;
}

export type SilverNotAwardedCopy = {
  headlineFr: string;
  headlineEn: string;
  reasonFr: string;
  reasonEn: string;
  actionFr: string;
  actionEn: string;
  bannerFr: string;
  bannerEn: string;
};

/** Exact student/teacher banner when Silver is not awarded. Null when awarded. */
export function buildSilverNotAwardedCopy(status: SilverGateSnapshot): SilverNotAwardedCopy | null {
  if (status.silverCertified) return null;

  const unmet: string[] = [];
  if (!status.quizPassed) unmet.push("quiz");
  const missingScn = Object.entries(status.scenariosCompleted).filter(([, met]) => !met).map(([k]) => k);
  if (missingScn.length) unmet.push("scenarios");
  if (!status.complianceValidated) unmet.push("compliance");
  if (!status.noBlockers) unmet.push("blockers");

  let reasonFr: string;
  let reasonEn: string;
  let actionFr: string;
  let actionEn: string;

  const blockers = status.blockers ?? [];

  if (!status.quizPassed) {
    reasonFr = "Quiz M1 non réussi (≥ 60 %)";
    reasonEn = "M1 quiz not passed (≥ 60%)";
    actionFr = "Réussir le quiz M1 (≥ 60 %).";
    actionEn = "Pass the M1 quiz (≥ 60%).";
  } else if (missingScn.length) {
    const labelsFr = missingScn.map((k) => SCN_LABEL[k]?.fr ?? k).join(", ");
    const labelsEn = missingScn.map((k) => SCN_LABEL[k]?.en ?? k).join(", ");
    reasonFr = `Scénarios M1 incomplets : ${labelsFr} (évaluation ≥ 60/100)`;
    reasonEn = `Incomplete M1 scenarios: ${labelsEn} (evaluation ≥ 60/100)`;
    actionFr = `Compléter ${labelsFr} en mode Évaluation (≥ 60/100).`;
    actionEn = `Complete ${labelsEn} in Evaluation mode (≥ 60/100).`;
  } else if (!status.complianceValidated) {
    reasonFr = "Conformité M1 non validée sur SCN-001 à SCN-005";
    reasonEn = "M1 compliance not validated on SCN-001 to SCN-005";
    actionFr = "Terminer l'étape Conformité sur chaque scénario M1 en évaluation.";
    actionEn = "Complete the Compliance step on each M1 evaluation scenario.";
  } else if (!status.noBlockers && blockers.length > 0) {
    reasonFr = blockers.map(formatBlockerFr).join(" ; ");
    reasonEn = blockers.map(formatBlockerEn).join(" ; ");
    actionFr = actionForBlockersFr(blockers);
    actionEn = actionForBlockersEn(blockers);
  } else if (!status.noBlockers) {
    reasonFr =
      "Blocages non résolus sur les runs M1 d'évaluation (transactions non postées ou comptages cycliques ouverts)";
    reasonEn =
      "Unresolved blockers on M1 evaluation runs (unposted transactions or open cycle counts)";
    actionFr =
      "Ouvrir SCN-001 à SCN-005 en évaluation et résoudre les transactions non postées / comptages cycliques restants.";
    actionEn =
      "Open SCN-001 to SCN-005 in evaluation and resolve remaining unposted transactions / cycle counts.";
  } else if (!status.silverEligible) {
    reasonFr = "Exigences Module 1 incomplètes";
    reasonEn = "Module 1 requirements incomplete";
    actionFr = "Compléter les exigences restantes du parcours Module 1.";
    actionEn = "Complete the remaining Module 1 pathway requirements.";
  } else {
    return null;
  }

  const headlineFr = "Silver non obtenue";
  const headlineEn = "Silver not awarded";
  return {
    headlineFr,
    headlineEn,
    reasonFr,
    reasonEn,
    actionFr,
    actionEn,
    bannerFr: `${headlineFr} — raison : ${reasonFr}. Action requise : ${actionFr}`,
    bannerEn: `${headlineEn} — reason: ${reasonEn}. Action required: ${actionEn}`,
  };
}

export function formatSilverBanner(status: SilverGateSnapshot, language: "FR" | "EN"): string | null {
  const copy = buildSilverNotAwardedCopy(status);
  if (!copy) return null;
  return language === "FR" ? copy.bannerFr : copy.bannerEn;
}
