/**
 * Integrated assessment core — pure functions (no DB).
 * Scoring by immutable option ID; M4 unlock vs practical validation separation.
 * Competency interpretation: see shared/assessmentCenter.ts (Assessment Center v1.0).
 */

export {
  ASSESSMENT_CENTER,
  CONTINUATION_THRESHOLD,
  COMPETENCY_LEVELS,
  buildCompetencyRadar,
  flagQuestionForPedagogicalReview,
  resolveCompetencyLevel,
  shortCompetencyLabel,
  type CompetencyLevel,
  type CompetencyLevelCode,
  type CompetencyRadarPoint,
} from "./assessmentCenter";

export const DEMO_ACCOUNT_USER_IDS = new Set<number>([222]); // James Timothy pedagogical/demo
export const DEMO_ACCOUNT_EMAILS = new Set<string>(["jamesnns3@gmail.com"]);

export const ASSESSMENT_CODES = {
  EVAL1: "EVAL_INTEGREE_1",
  EVAL2: "EVAL_INTEGREE_2",
} as const;

export const COHORTE_B_ID = 3;

export type M4UnlockStatus = "locked" | "pending_practical" | "unlocked";
export type PracticalValidationStatus =
  | "not_applicable"
  | "pending"
  | "satisfied"
  | "waived";

export type AssessmentOption = { id: string; fr: string; en: string };

export function isDemoAccount(user: {
  id: number;
  email?: string | null;
}): boolean {
  if (DEMO_ACCOUNT_USER_IDS.has(user.id)) return true;
  const email = (user.email || "").trim().toLowerCase();
  return email.length > 0 && DEMO_ACCOUNT_EMAILS.has(email);
}

export function shouldIncludeInOfficialAssessmentStats(user: {
  id: number;
  email?: string | null;
}): boolean {
  return !isDemoAccount(user);
}

/** Seeded Fisher–Yates — stable for the same seed string. */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  const arr = [...items];
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function scoreByOptionId(args: {
  responses: Array<{ questionId: number; selectedOptionId: string | null }>;
  questions: Array<{
    id: number;
    correctOptionId: string;
    points: number;
    competency: string;
    annulled?: boolean;
  }>;
}): {
  autoScore: number;
  maxPoints: number;
  passed: boolean;
  passingScore: number;
  competencyBreakdown: Array<{
    competency: string;
    earned: number;
    possible: number;
    correct: number;
    total: number;
  }>;
  perQuestion: Array<{
    questionId: number;
    selectedOptionId: string | null;
    isCorrect: boolean;
    pointsAwarded: number;
    annulled: boolean;
  }>;
} {
  const passingScore = 70;
  const byId = new Map(args.questions.map((q) => [q.id, q]));
  const competencyMap = new Map<
    string,
    { earned: number; possible: number; correct: number; total: number }
  >();

  let autoScore = 0;
  let maxPoints = 0;
  const perQuestion = args.responses.map((r) => {
    const q = byId.get(r.questionId);
    if (!q) {
      return {
        questionId: r.questionId,
        selectedOptionId: r.selectedOptionId,
        isCorrect: false,
        pointsAwarded: 0,
        annulled: false,
      };
    }
    const annulled = !!q.annulled;
    const possible = annulled ? 0 : q.points;
    maxPoints += possible;
    const isCorrect =
      !annulled &&
      !!r.selectedOptionId &&
      r.selectedOptionId === q.correctOptionId;
    const pointsAwarded = isCorrect ? q.points : 0;
    autoScore += pointsAwarded;

    const c = competencyMap.get(q.competency) || {
      earned: 0,
      possible: 0,
      correct: 0,
      total: 0,
    };
    c.possible += possible;
    c.earned += pointsAwarded;
    c.total += annulled ? 0 : 1;
    if (isCorrect) c.correct += 1;
    competencyMap.set(q.competency, c);

    return {
      questionId: r.questionId,
      selectedOptionId: r.selectedOptionId,
      isCorrect,
      pointsAwarded,
      annulled,
    };
  });

  const scaled =
    maxPoints > 0 ? Math.round((autoScore / maxPoints) * 100) : 0;
  const passed = scaled >= passingScore;

  return {
    autoScore: scaled,
    maxPoints,
    passed,
    passingScore,
    competencyBreakdown: Array.from(competencyMap.entries()).map(
      ([competency, v]) => ({ competency, ...v })
    ),
    perQuestion,
  };
}

/**
 * Academic M4 unlock from assessment — does NOT fabricate scenario completions.
 * Learning open-access (M1–M5) remains a separate runtime policy.
 *
 * Cohorte B transition (exceptional):
 * - Students with completed M1–M3 practical progression: assessment is consolidative;
 *   never revoke progression already earned.
 * - Students with incomplete practical: score >= 70 = competency validation;
 *   professor may require short supervised practical before full confirmation.
 * Future cohorts: use policy "standard".
 */
export type AssessmentProgressionPolicy = "cohorte_b_transition" | "standard";

export type M4UnlockComputation = {
  m4UnlockStatus: M4UnlockStatus;
  practicalValidationStatus: PracticalValidationStatus;
  /** Pedagogical role of this attempt for the student */
  assessmentRole: "consolidative" | "competency_validation";
};

export function computeM4UnlockStatus(args: {
  assessmentPassed: boolean;
  /** Explicit professor practical evidence or waiver */
  practicalEvidenceSatisfied: boolean;
  /** True when M1–M3 practical/scenario progression already earned */
  priorPracticalProgressComplete: boolean;
  policy?: AssessmentProgressionPolicy;
  previousM4UnlockStatus?: M4UnlockStatus | null;
}): M4UnlockComputation {
  const policy = args.policy ?? "standard";

  if (policy === "cohorte_b_transition" && args.priorPracticalProgressComplete) {
    // Consolidative: never revoke earned progression
    return {
      assessmentRole: "consolidative",
      practicalValidationStatus: "satisfied",
      m4UnlockStatus: "unlocked",
    };
  }

  // Competency-validation path (incomplete practical, or standard policy)
  if (!args.assessmentPassed) {
    // Do not downgrade a previously unlocked academic status under Cohorte B
    if (
      policy === "cohorte_b_transition" &&
      args.previousM4UnlockStatus === "unlocked"
    ) {
      return {
        assessmentRole: "competency_validation",
        practicalValidationStatus: "satisfied",
        m4UnlockStatus: "unlocked",
      };
    }
    return {
      assessmentRole: "competency_validation",
      practicalValidationStatus: "pending",
      m4UnlockStatus: "locked",
    };
  }

  if (args.practicalEvidenceSatisfied || args.priorPracticalProgressComplete) {
    return {
      assessmentRole: "competency_validation",
      practicalValidationStatus: "satisfied",
      m4UnlockStatus: "unlocked",
    };
  }

  return {
    assessmentRole: "competency_validation",
    practicalValidationStatus: "pending",
    m4UnlockStatus: "pending_practical",
  };
}

/** Cohorte Été 2026 — Groupe B uses the transitional progression policy. */
export function progressionPolicyForCohort(
  cohortId: number | null | undefined
): AssessmentProgressionPolicy {
  return cohortId === COHORTE_B_ID ? "cohorte_b_transition" : "standard";
}

export function studentAttemptStatusLabel(args: {
  releaseLevel: string;
  canStart: boolean;
  inProgress: boolean;
  submitted: boolean;
  passed: boolean | null;
  retakeBlocked: boolean;
  m4UnlockStatus: M4UnlockStatus;
  practicalValidationStatus: PracticalValidationStatus;
}): string {
  if (args.releaseLevel === "unpublished" || args.releaseLevel === "cancelled") {
    return "À venir";
  }
  if (
    args.releaseLevel === "visible_pending" ||
    (!args.canStart && !args.inProgress && !args.submitted)
  ) {
    return "En attente de libération du professeur";
  }
  if (args.inProgress) return "En cours";
  if (args.submitted && args.passed) {
    if (
      args.m4UnlockStatus === "pending_practical" ||
      (args.practicalValidationStatus === "pending" &&
        args.m4UnlockStatus !== "unlocked")
    ) {
      return "Évaluation réussie — validation pratique en attente";
    }
    return "Réussie";
  }
  if (args.submitted && args.passed === false) {
    return args.retakeBlocked
      ? "À reprendre — nouvelle tentative non autorisée"
      : "À reprendre";
  }
  if (args.submitted) return "Terminée";
  if (args.canStart) return "Disponible";
  return "À venir";
}

/**
 * Untimed assessments are stored as `durationMinutes = 0` (DB NOT NULL).
 * Application contract: null / undefined / <= 0 ⇒ untimed.
 */
export const UNTIMED_DURATION_MINUTES = 0;

/** DB placeholder for attempt.expiresAt when untimed (column NOT NULL; MySQL TIMESTAMP max ≈ 2038). */
export const UNTIMED_EXPIRES_AT_SENTINEL = new Date("2037-12-31T23:59:59.000Z");

export function isUntimedDuration(
  durationMinutes: number | null | undefined
): boolean {
  return durationMinutes == null || durationMinutes <= 0;
}

/** Persistable INT for integrated_assessments.durationMinutes. */
export function toStoredDurationMinutes(
  durationMinutes: number | null | undefined
): number {
  return isUntimedDuration(durationMinutes)
    ? UNTIMED_DURATION_MINUTES
    : durationMinutes!;
}

export function formatAssessmentDurationLabel(
  durationMinutes: number | null | undefined,
  language: "FR" | "EN" = "FR"
): string {
  if (isUntimedDuration(durationMinutes)) {
    return language === "FR" ? "Sans limite de temps" : "No time limit";
  }
  return `${durationMinutes} min`;
}

export function warnThresholds(durationMinutes: number): {
  warn30AtSeconds: number;
  warn35AtSeconds: number;
} {
  if (isUntimedDuration(durationMinutes)) {
    return { warn30AtSeconds: 0, warn35AtSeconds: 0 };
  }
  const total = durationMinutes * 60;
  return {
    warn30AtSeconds: Math.max(0, total - 10 * 60), // after 30 min of 40
    warn35AtSeconds: Math.max(0, total - 5 * 60),
  };
}

export function isWithinWindow(
  now: Date,
  opensAt: Date | null | undefined,
  closesAt: Date | null | undefined
): boolean {
  if (opensAt && now < opensAt) return false;
  if (closesAt && now > closesAt) return false;
  return true;
}
