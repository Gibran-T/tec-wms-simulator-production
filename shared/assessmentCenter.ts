/**
 * Assessment Center v1.0 — competency engine (pure functions).
 * Philosophy: competency validation, not memorization examination.
 */

export type CompetencyLevelCode =
  | "excellent"
  | "good"
  | "sufficient"
  | "not_demonstrated";

export type CompetencyLevel = {
  code: CompetencyLevelCode;
  minScore: number;
  maxScore: number;
  labelFr: string;
  labelEn: string;
  continuationAllowed: boolean;
  /** Pedagogical interpretation — never "barely passed". */
  meaningFr: string;
  meaningEn: string;
};

export const COMPETENCY_LEVELS: CompetencyLevel[] = [
  {
    code: "excellent",
    minScore: 90,
    maxScore: 100,
    labelFr: "Compétence excellente",
    labelEn: "Excellent Competency",
    continuationAllowed: true,
    meaningFr:
      "L'étudiant a démontré une maîtrise solide des compétences évaluées.",
    meaningEn:
      "The student demonstrated solid mastery of the assessed competencies.",
  },
  {
    code: "good",
    minScore: 80,
    maxScore: 89,
    labelFr: "Bonne compétence",
    labelEn: "Good Competency",
    continuationAllowed: true,
    meaningFr:
      "L'étudiant a démontré une bonne compétence pour poursuivre l'apprentissage.",
    meaningEn:
      "The student demonstrated good competency to continue learning.",
  },
  {
    code: "sufficient",
    minScore: 70,
    maxScore: 79,
    labelFr: "Compétence suffisante",
    labelEn: "Sufficient Competency",
    continuationAllowed: true,
    meaningFr:
      "L'étudiant a démontré une compétence suffisante pour poursuivre vers l'étape suivante.",
    meaningEn:
      "The student demonstrated sufficient competency to continue to the next learning stage.",
  },
  {
    code: "not_demonstrated",
    minScore: 0,
    maxScore: 69,
    labelFr: "Compétence non encore démontrée",
    labelEn: "Competency not yet demonstrated",
    continuationAllowed: false,
    meaningFr:
      "La compétence n'est pas encore démontrée. Une révision ciblée et une nouvelle tentative autorisée par le professeur sont recommandées.",
    meaningEn:
      "Competency is not yet demonstrated. Targeted review and a professor-authorized retake are recommended.",
  },
];

/** Threshold for continuing to the next learning stage (sufficient competency). */
export const CONTINUATION_THRESHOLD = 70;

export function resolveCompetencyLevel(score: number): CompetencyLevel {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  for (const level of COMPETENCY_LEVELS) {
    if (clamped >= level.minScore && clamped <= level.maxScore) return level;
  }
  return COMPETENCY_LEVELS[COMPETENCY_LEVELS.length - 1];
}

export type CompetencyRadarPoint = {
  competency: string;
  /** Short display label for radar axes */
  shortLabel: string;
  pct: number;
  earned: number;
  possible: number;
  cohortAvgPct?: number | null;
};

const COMPETENCY_SHORT: Record<string, string> = {
  "Réception et flux entrant": "Réception",
  "Rangement et localisation": "Putaway",
  "Capacité et division du stock": "Capacité",
  "FIFO et gestion des lots": "FIFO",
  "Exactitude des stocks": "Exactitude",
  "Inventaire cyclique": "Cycle Count",
  Ajustement: "Ajustement",
  Réapprovisionnement: "Réappro.",
  "Lecture des données WMS": "Données WMS",
  "Conformité du processus": "Conformité",
};

export function shortCompetencyLabel(competency: string): string {
  return COMPETENCY_SHORT[competency] || competency.slice(0, 14);
}

export function buildCompetencyRadar(
  breakdown: Array<{
    competency: string;
    earned: number;
    possible: number;
  }>,
  cohortAverages?: Record<string, number> | null
): CompetencyRadarPoint[] {
  return breakdown.map((b) => ({
    competency: b.competency,
    shortLabel: shortCompetencyLabel(b.competency),
    pct: b.possible > 0 ? Math.round((b.earned / b.possible) * 100) : 0,
    earned: b.earned,
    possible: b.possible,
    cohortAvgPct: cohortAverages?.[b.competency] ?? null,
  }));
}

/** Flag question for pedagogical review when success rate is abnormally low/high with enough samples. */
export function flagQuestionForPedagogicalReview(args: {
  answered: number;
  correctRate: number;
  minSamples?: number;
}): { flagged: boolean; reasonFr: string | null; reasonEn: string | null } {
  const min = args.minSamples ?? 5;
  if (args.answered < min) {
    return { flagged: false, reasonFr: null, reasonEn: null };
  }
  if (args.correctRate < 0.35) {
    return {
      flagged: true,
      reasonFr:
        "Taux de réussite anormalement bas — vérifier ambiguïté ou alignement scénario.",
      reasonEn:
        "Abnormally low success rate — check ambiguity or scenario alignment.",
    };
  }
  if (args.correctRate > 0.95) {
    return {
      flagged: true,
      reasonFr:
        "Taux de réussite anormalement élevé — question peut-être trop facile ou fuite d'indice.",
      reasonEn:
        "Abnormally high success rate — question may be too easy or cue-leaking.",
    };
  }
  return { flagged: false, reasonFr: null, reasonEn: null };
}

export const ASSESSMENT_CENTER = {
  productCode: "TEC.ASSESSMENT_CENTER",
  version: "1.0",
  navLabelFr: "Centre d'évaluation",
  navLabelEn: "Assessment Center",
  philosophyFr:
    "Moteur officiel de validation des compétences — pas un simple quiz de mémorisation.",
  philosophyEn:
    "Official competency validation engine — not a memorization quiz.",
} as const;
