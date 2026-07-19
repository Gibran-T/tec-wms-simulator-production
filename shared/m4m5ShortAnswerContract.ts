/**
 * Professional short-answer contract for M4/M5 free text.
 * Structure: LECTURE + DÉCISION + ACTION/SUIVI
 * Deterministic concept matching — no external NLP.
 */
import {
  normalizePedagogicalText,
  matchConceptGroup,
  hasAnyTerm,
  CG_ROTATION_NORMAL,
  CG_ROTATION_OVERSTOCK,
  CG_MAINTAIN_POLICY,
  CG_MONITOR_FOLLOWUP,
  CG_GLOBAL_DESTOCK,
  CG_NO_ACTION,
  CG_SERVICE_EXCELLENT,
  CG_SERVICE_WEAK,
  CG_ERRORS_ACCEPTABLE_IMPROVE,
  CG_QUALITY_ACTION,
  CG_ONE_PRIORITY,
  CG_TRADEOFF,
  CG_SHORT_HORIZON,
  CG_HORIZON_90_180,
  CG_SITUATION_STABLE,
  CG_ACTION_VOCAB,
  type ConceptGroup,
} from "./pedagogicalConceptEval";

export type ShortAnswerBlock = "lecture" | "decision" | "suivi";

export type ShortAnswerEval = {
  ok: boolean;
  blocks: { lecture: boolean; decision: boolean; suivi: boolean };
  missing: ShortAnswerBlock[];
  contradictions: string[];
  /** Immediate FR feedback for the student */
  feedbackFr: string;
  feedbackEn: string;
};

const CG_TARGETED_REDUCE: ConceptGroup = {
  id: "targeted_reduce",
  terms: [
    "reduction cible",
    "reduire cible",
    "reductions ciblees",
    "ajustement selectif",
    "destockage cible",
    "sku lents",
    "sku lent",
    "articles lents",
    "faible rotation",
    "cibl",
  ],
};

function missingFeedback(missing: ShortAnswerBlock[]): { fr: string; en: string } {
  if (missing.includes("lecture") && missing.length === 1) {
    return { fr: "Lecture incorrecte ou manquante. Classez le KPI (ex. normal, excellent, acceptable).", en: "Missing or incorrect reading. Classify the KPI (e.g. normal, excellent, acceptable)." };
  }
  if (missing.includes("decision") && !missing.includes("lecture")) {
    return { fr: "Lecture correcte. Ajoutez une décision.", en: "Reading OK. Add a decision." };
  }
  if (missing.includes("suivi") && !missing.includes("lecture") && !missing.includes("decision")) {
    return { fr: "Décision correcte. Ajoutez un suivi.", en: "Decision OK. Add a follow-up." };
  }
  if (missing.length >= 2) {
    return {
      fr: "Réponse incomplète. Structure attendue : 1) lecture du KPI 2) décision 3) action ou suivi.",
      en: "Incomplete answer. Expected: 1) KPI reading 2) decision 3) action or follow-up.",
    };
  }
  return { fr: "Réponse incomplète.", en: "Incomplete answer." };
}

function hasSixXNormal(n: string): boolean {
  const hasSix =
    /\b6\s*x\b/.test(n) ||
    /\b6\s*fois\b/.test(n) ||
    n.includes("2400") ||
    n.includes("2 400") ||
    n.includes("2,400");
  return (
    matchConceptGroup(n, CG_ROTATION_NORMAL) ||
    (hasSix && (n.includes("bande") || n.includes("4-12") || n.includes("4 a 12") || n.includes("zone")))
  );
}

/** KPI_ROTATION for SCN-012 portfolio (normal 6×). */
export function evalKpiRotationShort(answer: string): ShortAnswerEval {
  const n = normalizePedagogicalText(answer);
  const lecture = hasSixXNormal(n);
  const decision =
    matchConceptGroup(n, CG_MAINTAIN_POLICY) ||
    matchConceptGroup(n, CG_TARGETED_REDUCE) ||
    hasAnyTerm(n, ["pas de destock", "sans destock", "ne pas reduire global", "conserver la politique"]);
  const suivi =
    matchConceptGroup(n, CG_MONITOR_FOLLOWUP) ||
    matchConceptGroup(n, CG_TARGETED_REDUCE) ||
    hasAnyTerm(n, ["sku", "capital", "revue", "surveill", "suivi"]);
  const contradictions: string[] = [];
  if (matchConceptGroup(n, CG_ROTATION_OVERSTOCK) && lecture) {
    contradictions.push("surstock_vs_normal");
  }
  if (matchConceptGroup(n, CG_GLOBAL_DESTOCK)) {
    contradictions.push("global_destock");
  }
  if (matchConceptGroup(n, CG_NO_ACTION)) {
    contradictions.push("no_action");
  }

  const missing: ShortAnswerBlock[] = [];
  if (!lecture) missing.push("lecture");
  if (!decision) missing.push("decision");
  if (!suivi) missing.push("suivi");

  let ok = missing.length === 0 && contradictions.length === 0;
  let feedbackFr = "";
  let feedbackEn = "";
  if (contradictions.includes("global_destock") || contradictions.includes("surstock_vs_normal")) {
    ok = false;
    feedbackFr = "Contradiction : 6× est normal — pas de destock/liquidation globale.";
    feedbackEn = "Contradiction: 6× is normal — no global destock/liquidation.";
  } else if (contradictions.includes("no_action")) {
    ok = false;
    feedbackFr = "« Rien à faire » est rejeté — ajoutez un suivi (SKU / revue).";
    feedbackEn = "“Nothing to do” is rejected — add follow-up (SKU / review).";
  } else if (!ok) {
    const m = missingFeedback(missing);
    feedbackFr = m.fr;
    feedbackEn = m.en;
  } else {
    feedbackFr = "Correct — lecture, décision et suivi professionnels.";
    feedbackEn = "Correct — professional reading, decision and follow-up.";
  }

  return { ok, blocks: { lecture, decision, suivi }, missing, contradictions, feedbackFr, feedbackEn };
}

/** KPI_SERVICE — OTIF excellent + errors acceptable when portfolio canonical. */
export function evalKpiServiceShort(answer: string): ShortAnswerEval {
  const n = normalizePedagogicalText(answer);
  const lecture =
    matchConceptGroup(n, CG_SERVICE_EXCELLENT) ||
    (/\b95\b/.test(n) && (n.includes("excellent") || n.includes("otif") || n.includes("service")));
  const errorsOk =
    matchConceptGroup(n, CG_ERRORS_ACCEPTABLE_IMPROVE) ||
    hasAnyTerm(n, ["4%", "4 %", "erreur", "erreurs", "acceptable", "surveiller"]);
  // Decision can be maintain service policy OR quality action
  const decision =
    matchConceptGroup(n, CG_MAINTAIN_POLICY) ||
    matchConceptGroup(n, CG_QUALITY_ACTION) ||
    hasAnyTerm(n, ["maintenir", "conserver", "qualite", "qualité", "former", "controler", "contrôler"]);
  const suivi =
    matchConceptGroup(n, CG_MONITOR_FOLLOWUP) ||
    matchConceptGroup(n, CG_SHORT_HORIZON) ||
    hasAnyTerm(n, ["suivi", "surveill", "mensuel", "otif", "revue", "audit"]);

  const contradictions: string[] = [];
  if (matchConceptGroup(n, CG_SERVICE_WEAK)) {
    contradictions.push("service_weak");
  }

  const missing: ShortAnswerBlock[] = [];
  if (!lecture) missing.push("lecture");
  // For service step: errors mention strengthens lecture; decision+suivi required for full professional answer
  // Allow short official: "OTIF 95%, excellent. Erreurs 4%, acceptables. Suivi qualite."
  const decisionOk = decision || (errorsOk && suivi);
  const suiviOk = suivi || errorsOk;
  if (!decisionOk) missing.push("decision");
  if (!suiviOk) missing.push("suivi");

  let ok = missing.length === 0 && contradictions.length === 0;
  let feedbackFr = "";
  let feedbackEn = "";
  if (contradictions.includes("service_weak")) {
    ok = false;
    feedbackFr = "95 % doit être classé excellent — pas faible/insuffisant.";
    feedbackEn = "95% must be classified excellent — not weak/insufficient.";
  } else if (!lecture) {
    feedbackFr = "95 % doit être classé excellent.";
    feedbackEn = "95% must be classified as excellent.";
  } else if (!ok) {
    const m = missingFeedback(missing);
    feedbackFr = m.fr;
    feedbackEn = m.en;
  } else {
    feedbackFr = "Correct — service excellent avec suivi professionnel.";
    feedbackEn = "Correct — excellent service with professional follow-up.";
  }

  return {
    ok,
    blocks: { lecture, decision: decisionOk, suivi: suiviOk },
    missing,
    contradictions,
    feedbackFr,
    feedbackEn,
  };
}

/** KPI_DIAGNOSTIC / COMPLIANCE synthesis — scenario-aware minimum. */
export function evalKpiDiagnosticShort(scnCode: string, answer: string): ShortAnswerEval {
  const n = normalizePedagogicalText(answer);
  const scn = (scnCode || "").toUpperCase();

  const lecture =
    matchConceptGroup(n, CG_ROTATION_NORMAL) ||
    matchConceptGroup(n, CG_SERVICE_EXCELLENT) ||
    matchConceptGroup(n, CG_SITUATION_STABLE) ||
    hasAnyTerm(n, ["6x", "95", "erreur", "otif", "kpi", "normal", "excellent", "acceptable"]);

  const decision =
    matchConceptGroup(n, CG_MAINTAIN_POLICY) ||
    matchConceptGroup(n, CG_TARGETED_REDUCE) ||
    matchConceptGroup(n, CG_QUALITY_ACTION) ||
    matchConceptGroup(n, CG_ONE_PRIORITY) ||
    matchConceptGroup(n, CG_ACTION_VOCAB) ||
    hasAnyTerm(n, ["priorite", "priorité", "former", "maintenir", "reduire"]);

  const suivi =
    matchConceptGroup(n, CG_MONITOR_FOLLOWUP) ||
    matchConceptGroup(n, CG_SHORT_HORIZON) ||
    matchConceptGroup(n, CG_HORIZON_90_180) ||
    hasAnyTerm(n, ["90", "revue", "suivi", "surveill", "otif", "capital", "sku"]);

  const contradictions: string[] = [];
  if (matchConceptGroup(n, CG_GLOBAL_DESTOCK) && !matchConceptGroup(n, CG_TARGETED_REDUCE)) {
    contradictions.push("global_destock");
  }
  if (matchConceptGroup(n, CG_NO_ACTION)) {
    contradictions.push("no_action");
  }

  // SCN-014: need multi-KPI or trade-off + priority + horizon
  if (scn === "SCN-014") {
    const multiOrTrade =
      matchConceptGroup(n, CG_TRADEOFF) ||
      (hasAnyTerm(n, ["rotation", "otif", "erreur", "service", "stock"]) &&
        hasAnyTerm(n, ["et", "mais", "trade", "arbitrage", "priorite", "priorité"]));
    const priority = matchConceptGroup(n, CG_ONE_PRIORITY) || hasAnyTerm(n, ["priorite", "priorité", "qualite", "qualité"]);
    const horizon = matchConceptGroup(n, CG_HORIZON_90_180) || matchConceptGroup(n, CG_SHORT_HORIZON) || hasAnyTerm(n, ["90", "jours", "mensuel"]);
    if (!multiOrTrade && !lecture) contradictions.push("mono_kpi");
    if (!priority) {
      /* counted in decision */
    }
    if (!horizon && !suivi) {
      /* suivi missing */
    }
    // Strengthen decision/suivi for 014
    const d014 = decision && (priority || matchConceptGroup(n, CG_QUALITY_ACTION) || matchConceptGroup(n, CG_MAINTAIN_POLICY));
    const s014 = suivi || horizon;
    const missing: ShortAnswerBlock[] = [];
    if (!lecture && !multiOrTrade) missing.push("lecture");
    if (!d014) missing.push("decision");
    if (!s014) missing.push("suivi");
    const ok = missing.length === 0 && !contradictions.includes("global_destock") && !contradictions.includes("no_action");
    const m = missingFeedback(missing);
    return {
      ok,
      blocks: { lecture: lecture || multiOrTrade, decision: !!d014, suivi: !!s014 },
      missing,
      contradictions,
      feedbackFr: ok ? "Correct — arbitrage multi-KPI professionnel." : contradictions.length ? "Contradiction ou absence d'action rejetée." : m.fr,
      feedbackEn: ok ? "Correct — professional multi-KPI trade-off." : contradictions.length ? "Contradiction or no-action rejected." : m.en,
    };
  }

  // SCN-013: quality action + follow-up emphasis
  if (scn === "SCN-013") {
    const quality = matchConceptGroup(n, CG_QUALITY_ACTION) || hasAnyTerm(n, ["qualite", "qualité", "formation", "picking", "checklist"]);
    const missing: ShortAnswerBlock[] = [];
    if (!lecture) missing.push("lecture");
    if (!decision && !quality) missing.push("decision");
    if (!suivi) missing.push("suivi");
    const ok = missing.length === 0 && contradictions.length === 0;
    const m = missingFeedback(missing);
    return {
      ok,
      blocks: { lecture, decision: decision || quality, suivi },
      missing,
      contradictions,
      feedbackFr: ok ? "Correct — risque qualité et suivi identifiés." : contradictions.length ? "Contradiction rejetée." : m.fr,
      feedbackEn: ok ? "Correct — quality risk and follow-up identified." : contradictions.length ? "Contradiction rejected." : m.en,
    };
  }

  // Default SCN-012 / generic M4 — maintain/targeted + follow-up (no bare action verb alone)
  const decision012 =
    matchConceptGroup(n, CG_MAINTAIN_POLICY) || matchConceptGroup(n, CG_TARGETED_REDUCE);
  const missing: ShortAnswerBlock[] = [];
  if (!lecture) missing.push("lecture");
  if (!decision012) missing.push("decision");
  if (!suivi) missing.push("suivi");
  let ok = missing.length === 0 && contradictions.length === 0;
  let feedbackFr = "";
  let feedbackEn = "";
  if (contradictions.includes("global_destock")) {
    ok = false;
    feedbackFr = "Pas de destock global — maintien ou réduction ciblée + suivi.";
    feedbackEn = "No global destock — maintain or targeted reduction + follow-up.";
  } else if (contradictions.includes("no_action")) {
    ok = false;
    feedbackFr = "Ajoutez une action ou un suivi — « rien à faire » est rejeté.";
    feedbackEn = "Add an action or follow-up — “nothing to do” is rejected.";
  } else if (!ok) {
    const m = missingFeedback(missing);
    feedbackFr = m.fr;
    feedbackEn = m.en;
  } else {
    feedbackFr = "Correct — synthèse décisionnelle professionnelle.";
    feedbackEn = "Correct — professional decision synthesis.";
  }

  return { ok, blocks: { lecture, decision: decision012, suivi }, missing, contradictions, feedbackFr, feedbackEn };
}

/** M5 decision short answers (tactical / strategic). */
export function evalM5DecisionShort(
  level: "TACTICAL" | "STRATEGIC",
  answer: string,
): ShortAnswerEval {
  const n = normalizePedagogicalText(answer);
  const lecture =
    hasAnyTerm(n, ["stock", "ecart", "écart", "rotation", "service", "kpi", "niveau", "min", "q=0", "q = 0", "reconcil"]) ||
    n.length >= 20;
  const decision =
    matchConceptGroup(n, CG_MAINTAIN_POLICY) ||
    matchConceptGroup(n, CG_QUALITY_ACTION) ||
    matchConceptGroup(n, CG_ACTION_VOCAB) ||
    matchConceptGroup(n, CG_ONE_PRIORITY) ||
    hasAnyTerm(n, ["recommande", "maintenir", "suivre", "former", "priorite", "priorité", "q=0", "aucun reappro"]);
  const suivi =
    matchConceptGroup(n, CG_MONITOR_FOLLOWUP) ||
    matchConceptGroup(n, CG_SHORT_HORIZON) ||
    matchConceptGroup(n, CG_HORIZON_90_180) ||
    hasAnyTerm(n, ["suivi", "cycle", "revue", "90", "prochain"]);

  const contradictions: string[] = [];
  if (matchConceptGroup(n, CG_NO_ACTION) && !suivi) contradictions.push("no_action");
  if (level === "STRATEGIC" && matchConceptGroup(n, CG_GLOBAL_DESTOCK) && !matchConceptGroup(n, CG_TARGETED_REDUCE)) {
    contradictions.push("global_destock");
  }

  const missing: ShortAnswerBlock[] = [];
  if (!lecture) missing.push("lecture");
  if (!decision) missing.push("decision");
  if (!suivi && level === "STRATEGIC") missing.push("suivi");
  // Tactical: suivi optional if decision present
  if (!suivi && level === "TACTICAL" && !decision) missing.push("suivi");

  const ok =
    missing.length === 0 &&
    contradictions.length === 0 &&
    (level === "TACTICAL" ? decision && lecture : decision && lecture && suivi);

  const m = missingFeedback(missing.length ? missing : !ok ? ["decision"] : []);
  return {
    ok,
    blocks: { lecture, decision, suivi: suivi || level === "TACTICAL" },
    missing,
    contradictions,
    feedbackFr: ok ? "Correct — décision opérationnelle professionnelle." : contradictions.length ? "Contradiction rejetée." : m.fr,
    feedbackEn: ok ? "Correct — professional operational decision." : contradictions.length ? "Contradiction rejected." : m.en,
  };
}
