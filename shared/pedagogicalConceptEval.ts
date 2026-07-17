/**
 * Deterministic pedagogical concept evaluation for M4/M5 free-text answers.
 * Evaluates professional intention via synonym/stem concept groups — not phrase reproduction.
 * No LLM / nondeterministic matching.
 */

export type ConceptGroup = {
  id: string;
  /** Synonyms, stems, and equivalent professional expressions (pre-normalization OK). */
  terms: string[];
};

export type ConceptEvalResult = {
  matched: string[];
  missing: string[];
  contradictions: string[];
  negated: string[];
  stuffingSuspected: boolean;
  /** 0–1 rough coherence heuristic (not a score). */
  coherenceHint: number;
};

export type AnalyticalCoherenceResult = {
  coherent: boolean;
  reason?: "too_short" | "keyword_list" | "noun_list";
};

/**
 * Deterministic sentence-shape / coherence check for analytical free text.
 * Reusable across M4 diagnostics (and optionally M5 soft text).
 * Does not require punctuation or perfect French — only a minimal propositional stance.
 */
export function assessAnalyticalCoherence(text: string): AnalyticalCoherenceResult {
  const raw = text.trim();
  const n = normalizePedagogicalText(raw);
  if (!n || n.length < 12) return { coherent: false, reason: "too_short" };

  const words = n.split(/\s+/).filter(Boolean);
  const commaCount = (raw.match(/,/g) || []).length;

  // Stance / relationship / recommendation — word-boundary safe for short stems
  const hasStance =
    /\b(?:est|sont|faut|doit|doivent|mais|donc|parce|car|afin|pour|je|nous)\b/.test(n) ||
    hasAnyTerm(n, [
      "recomm",
      "dimin",
      "amelior",
      "amélior",
      "revoir",
      "surveill",
      "propos",
      "decid",
      "décid",
      "besoin",
      "risque",
      "classif",
      "calcul",
      "mainten",
      "conserv",
      "comparer",
      "correl",
      "avant",
      "apres",
      "après",
      "il faut",
      "a amelior",
      "à amelior",
      "encore a",
      "encore à",
    ]);

  // Comma-separated keyword dump: "Formation, checklist, OTIF, erreur, SLA."
  const keywordListByCommas =
    commaCount >= 2 &&
    words.length <= commaCount + 4 &&
    !hasStance;

  // Space-separated noun dump without stance: "OTIF erreur qualité formation"
  const nounOnlyList =
    !hasStance &&
    words.length >= 3 &&
    words.length <= 8 &&
    commaCount === 0 &&
    !/[.!?;:]/.test(raw);

  // "Excellent, acceptable, suivi."
  const shortCommaLabels =
    commaCount >= 2 && words.length <= 6 && !hasStance;

  if (keywordListByCommas || shortCommaLabels) {
    return { coherent: false, reason: "keyword_list" };
  }
  if (nounOnlyList) {
    return { coherent: false, reason: "noun_list" };
  }
  // Long keyword dump without verbs / connectors / recommendations
  if (!hasStance && words.length >= 12) {
    return { coherent: false, reason: "keyword_list" };
  }
  return { coherent: true };
}

/**
 * True when the student positively recommends ordering / replenishing a quantity.
 * Negations ("ne pas commander", "pas de réappro") do not count.
 */
export function hasPositiveReplenishmentRecommendation(text: string): boolean {
  const n = normalizePedagogicalText(text);

  if (
    hasAnyTerm(n, [
      "ne pas commander",
      "pas commander",
      "pas de reappro",
      "pas de reapprovisionnement",
      "aucun reappro",
      "reapprovisionnement non requis",
      "reappro non requis",
    ]) &&
    !/(?:commander|reapprovisionner|acheter)\s+(?:de\s+)?[1-9]\d*/.test(n) &&
    !/reapprovisionnement\s+de\s+[1-9]\d*/.test(n) &&
    !/q\s*=\s*[1-9]\d*/.test(n)
  ) {
    return false;
  }

  if (isTermNegated(n, "commander") && !/(?:commander)\s+(?:de\s+)?[1-9]\d*/.test(n)) {
    if (!/reapprovisionnement\s+de\s+[1-9]/.test(n) && !/q\s*=\s*[1-9]/.test(n)) {
      return false;
    }
  }

  if (/q\s*=\s*[1-9]\d*/.test(n)) return true;
  if (/(?:commander|acheter|reapprovisionner)\s+(?:de\s+)?[1-9]\d*/.test(n)) return true;
  if (/reapprovisionnement\s+de\s+[1-9]\d*/.test(n)) return true;
  if (
    hasAnyTerm(n, [
      "je recommande de commander",
      "recommande de commander",
      "recommande un reappro",
      "recommande un reapprovisionnement",
      "faut commander",
      "il faut commander",
      "il faut reapprovisionner",
      "commander du stock",
      "passer commande",
    ]) &&
    !isTermNegated(n, "commander")
  ) {
    return true;
  }
  return false;
}

/** True when text asserts sufficient stock / Q=0 / no replenishment needed. */
export function assertsNoReplenishmentNeeded(text: string): boolean {
  const n = normalizePedagogicalText(text);
  return (
    matchConceptGroup(n, {
      id: "q0",
      terms: [
        "q = 0",
        "q=0",
        "pas de reappro",
        "pas de reapprovisionnement",
        "aucun reappro",
        "reapprovisionnement non requis",
        "stock suffisant",
        "stock est suffisant",
        "au-dessus du min",
        "au dessus du min",
        "au-dessus du minimum",
        "au dessus du minimum",
        "pas besoin de commander",
        "ne pas commander",
        "aucun reapprovisionnement",
        "reapprovisionnement n'est necessaire",
        "reapprovisionnement nest necessaire",
        "reapprovisionnement non necessaire",
      ],
    }) ||
    hasAnyTerm(n, [
      "stock est suffisant",
      "stock suffisant",
      "q = 0",
      "q=0",
      "aucun reapprovisionnement",
    ])
  );
}

export function hasQ0VsReplenishmentContradiction(text: string): boolean {
  return assertsNoReplenishmentNeeded(text) && hasPositiveReplenishmentRecommendation(text);
}

/** Shared normalization: case, accents, apostrophes, whitespace. */
export function normalizePedagogicalText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[''`´]/g, "'")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/×/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

export function hasAnyTerm(normalizedText: string, terms: string[]): boolean {
  return terms.some((t) => normalizedText.includes(normalizePedagogicalText(t)));
}

export function findMatchedTerms(normalizedText: string, terms: string[]): string[] {
  return terms.filter((t) => normalizedText.includes(normalizePedagogicalText(t)));
}

/** Windowed negation: "pas normal", "n'est pas excellent", "aucune surveillance", etc. */
export function isTermNegated(normalizedText: string, term: string): boolean {
  const needle = normalizePedagogicalText(term);
  if (!needle || !normalizedText.includes(needle)) return false;
  const idx = normalizedText.indexOf(needle);
  const windowStart = Math.max(0, idx - 28);
  const before = normalizedText.slice(windowStart, idx);
  return (
    /\bne\s+\w{0,12}\s+pas\s*$/.test(before) ||
    /\bn'est\s+pas\s*$/.test(before) ||
    /\bpas\s+(?:de\s+|d'|un\s+|une\s+)?$/.test(before) ||
    /\baucun(?:e)?\s*$/.test(before) ||
    /\bsans\s*$/.test(before) ||
    /\bjamais\s*$/.test(before) ||
    /\bnon\s*$/.test(before)
  );
}

export function matchConceptGroup(normalizedText: string, group: ConceptGroup): boolean {
  for (const term of group.terms) {
    if (!normalizedText.includes(normalizePedagogicalText(term))) continue;
    if (isTermNegated(normalizedText, term)) continue;
    return true;
  }
  return false;
}

export function evaluateConceptGroups(
  text: string,
  required: ConceptGroup[],
  contradictions: ConceptGroup[] = [],
): ConceptEvalResult {
  const n = normalizePedagogicalText(text);
  const matched: string[] = [];
  const missing: string[] = [];
  const negated: string[] = [];
  const contradictionHits: string[] = [];

  for (const g of required) {
    const rawHits = findMatchedTerms(n, g.terms);
    const positiveHit = rawHits.some((t) => !isTermNegated(n, t));
    if (positiveHit) matched.push(g.id);
    else {
      missing.push(g.id);
      if (rawHits.length > 0) negated.push(g.id);
    }
  }

  for (const g of contradictions) {
    if (matchConceptGroup(n, g)) contradictionHits.push(g.id);
  }

  const wordCount = n.split(/\s+/).filter(Boolean).length;
  const uniqueHits = new Set(
    [...required, ...contradictions].flatMap((g) => findMatchedTerms(n, g.terms)),
  ).size;
  const stuffingSuspected =
    wordCount > 0 &&
    uniqueHits >= 8 &&
    wordCount / Math.max(uniqueHits, 1) < 2.2 &&
    (contradictionHits.length > 0 || matched.length < required.length);

  const coherenceHint = Math.max(
    0,
    Math.min(
      1,
      matched.length / Math.max(required.length, 1) -
        contradictionHits.length * 0.35 -
        (stuffingSuspected ? 0.25 : 0),
    ),
  );

  return {
    matched,
    missing,
    contradictions: contradictionHits,
    negated,
    stuffingSuspected,
    coherenceHint,
  };
}

// ─── Concept libraries (M4 / M5) ─────────────────────────────────────────────

export const CG_ROTATION_NORMAL: ConceptGroup = {
  id: "rotation_normal",
  terms: [
    "normal",
    "normale",
    "equilibr",
    "equilibre",
    "equilibree",
    "dans la bande",
    "bande 4",
    "4-12",
    "4 a 12",
    "4 à 12",
    "performance normale",
    "correcte",
    "adequat",
    "satisfaisant",
    "conforme a la bande",
  ],
};

export const CG_ROTATION_OVERSTOCK: ConceptGroup = {
  id: "rotation_overstock",
  terms: ["surstock", "sur-stock", "exces de stock", "excès", "trop de stock", "surcharge stock"],
};

export const CG_MAINTAIN_POLICY: ConceptGroup = {
  id: "maintain_policy",
  terms: [
    "mainten",
    "conserver",
    "conserv",
    "garder",
    "politique actuelle",
    "niveau actuel",
    "niveau global",
    "pas de reduction",
    "sans reduction",
    "ne pas reduire",
    "eviter une reduction",
    "pas de destock",
    "sans destock",
    "ne pas destock",
  ],
};

export const CG_MONITOR_FOLLOWUP: ConceptGroup = {
  id: "monitor_followup",
  terms: [
    "surveill",
    "monitor",
    "controler",
    "contrôler",
    "controle",
    "suivre",
    "suivi",
    "revue",
    "revision",
    "révision",
    "periodiq",
    "périodiq",
    "regulier",
    "régulier",
    "faible rotation",
    "tournent moins",
    "tournent lent",
    "lents",
    "lentement",
    "articles",
    "produits",
    "references",
    "références",
    "sku",
  ],
};

export const CG_GLOBAL_DESTOCK: ConceptGroup = {
  id: "global_destock",
  terms: [
    "destock global",
    "destockage global",
    "liquidation",
    "liquider",
    "reduction massive",
    "réduction massive",
    "vider le stock",
    "brader",
  ],
};

export const CG_NO_ACTION: ConceptGroup = {
  id: "no_action",
  terms: [
    "rien a faire",
    "rien à faire",
    "aucune action",
    "aucune analyse",
    "pas besoin de suivi",
    "aucun suivi",
    "inutile de surveiller",
  ],
};

export const CG_SERVICE_EXCELLENT: ConceptGroup = {
  id: "service_excellent",
  terms: ["excellent", "tres bon", "très bon", "optimal", "au seuil", "fort niveau de service"],
};

export const CG_SERVICE_WEAK: ConceptGroup = {
  id: "service_weak",
  terms: ["faible", "insuffisant", "mauvais", "mediocre", "médiocre", "critique", "inacceptable"],
};

export const CG_ERRORS_ACCEPTABLE_IMPROVE: ConceptGroup = {
  id: "errors_acceptable_improve",
  terms: [
    "acceptable",
    "amelior",
    "amélior",
    "corrigeable",
    "risque",
    "fragil",
    "surveiller les erreurs",
    "erreurs a surveiller",
    "4 %",
    "4%",
    "taux d'erreur",
    "taux d erreur",
  ],
};

export const CG_ERRORS_EXCELLENT_FALSE: ConceptGroup = {
  id: "errors_called_excellent",
  terms: ["erreurs excellent", "erreur excellent", "4% excellent", "4 % excellent"],
};

export const CG_QUALITY_ACTION: ConceptGroup = {
  id: "quality_action",
  terms: [
    "formation",
    "checklist",
    "controle qualite",
    "contrôle qualité",
    "qualite",
    "qualité",
    "picking",
    "prelevement",
    "prélèvement",
    "reception",
    "réception",
    "audit",
    "processus",
    "procedure",
    "procédure",
    "revue picking",
    "controle",
  ],
};

export const CG_SHORT_HORIZON: ConceptGroup = {
  id: "short_horizon",
  terms: [
    "90",
    "j-90",
    "sla",
    "hebdo",
    "semaine",
    "court terme",
    "prochaines semaines",
    "suivi court",
    "revue rapide",
    "horizon",
  ],
};

export const CG_SITUATION_STABLE: ConceptGroup = {
  id: "situation_stable",
  terms: [
    "stable",
    "controlee",
    "contrôlée",
    "maitrisee",
    "maîtrisée",
    "globalement bon",
    "sous controle",
    "sous contrôle",
    "equilibre global",
    "situation favorable",
    "portefeuille stable",
  ],
};

export const CG_ONE_PRIORITY: ConceptGroup = {
  id: "one_priority",
  terms: [
    "priorite",
    "priorité",
    "prioritaire",
    "initiative",
    "je choisis",
    "nous priorisons",
    "focus",
    "financer",
    "investir",
  ],
};

export const CG_TRADEOFF: ConceptGroup = {
  id: "tradeoff",
  terms: [
    "trade-off",
    "tradeoff",
    "arbitrage",
    "arbitr",
    "compromis",
    "au detriment",
    "au détriment",
    "reporte",
    "report",
    "differ",
    "différer",
    "sacrifi",
    "maintenir le service",
    "proteger",
    "protéger",
    "vs",
    "contre",
    "plutot que",
    "plutôt que",
    "en echange",
    "en échange",
  ],
};

export const CG_HORIZON_90_180: ConceptGroup = {
  id: "horizon_90_180",
  terms: [
    "90",
    "180",
    "3 mois",
    "6 mois",
    "trimestre",
    "semestre",
    "revue a 90",
    "horizon",
    "prochain trimestre",
  ],
};

export const CG_M5_NOMINAL: ConceptGroup = {
  id: "m5_nominal",
  terms: [
    "nominal",
    "conforme",
    "cycle conforme",
    "operations conformes",
    "opérations conformes",
    "sans ecart",
    "sans écart",
    "pas d'ecart",
    "pas d'écart",
    "flux nominal",
    "rien a corriger",
    "rien à corriger",
  ],
};

export const CG_M5_Q_ZERO: ConceptGroup = {
  id: "m5_q_zero",
  terms: [
    "q = 0",
    "q=0",
    "quantite 0",
    "quantité 0",
    "pas de reappro",
    "pas de réappro",
    "aucun reappro",
    "aucun réappro",
    "reapprovisionnement non requis",
    "réapprovisionnement non requis",
    "stock suffisant",
    "stock est suffisant",
    "stock au-dessus du min",
    "stock au dessus du min",
    "au-dessus du minimum",
    "au dessus du minimum",
    "pas besoin de commander",
    "ne pas commander",
    "aucun reapprovisionnement",
  ],
};

export const CG_M5_VARIANCE_AWARE: ConceptGroup = {
  id: "m5_variance_aware",
  terms: [
    "ecart",
    "écart",
    "variance",
    "ajustement",
    "adj",
    "reconcil",
    "réconcil",
    "corrige",
    "corrigé",
    "apres correction",
    "après correction",
    "stock corrige",
    "stock corrigé",
  ],
};

export const CG_ACTION_VOCAB: ConceptGroup = {
  id: "action_vocab",
  terms: ["recommand", "action", "strategie", "stratégie", "decision", "décision", "propos"],
};

/** Analytical block weights (internal) — map onto existing step budgets. */
export const ANALYTICAL_BLOCK_WEIGHTS = {
  evidence: 0.2,
  interpretation: 0.3,
  decision: 0.35,
  followUp: 0.15,
} as const;

export const STRATEGIC_BLOCK_WEIGHTS = {
  evidence: 0.25,
  interpretation: 0.25,
  decision: 0.25,
  tradeoffHorizon: 0.25,
} as const;
