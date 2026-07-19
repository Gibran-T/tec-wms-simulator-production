/**
 * Integrated assessment DB + business operations.
 */
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  ASSESSMENT_CODES,
  COHORTE_B_ID,
  computeM4UnlockStatus,
  isDemoAccount,
  isUntimedDuration,
  isWithinWindow,
  progressionPolicyForCohort,
  resolveCompetencyLevel,
  scoreByOptionId,
  seededShuffle,
  shouldIncludeInOfficialAssessmentStats,
  studentAttemptStatusLabel,
  toStoredDurationMinutes,
  UNTIMED_EXPIRES_AT_SENTINEL,
  type M4UnlockStatus,
  type PracticalValidationStatus,
} from "../shared/assessmentCore";
import {
  EVAL1_ASSESSMENT_CODE,
  EVAL1_DURATION_MINUTES,
  EVAL1_PASSING_SCORE,
  EVAL1_QUESTIONS,
  EVAL1_TOTAL_POINTS,
} from "../shared/eval1QuestionBank";
import { QUIZ_INTEGRITY_BANK, materializeQuizOptions } from "../shared/quizIntegrity";

const EVAL2_CODE = ASSESSMENT_CODES.EVAL2;

export async function ensureAssessmentSchemaSeeded() {
  const db = await getDb();
  if (!db) return;
  const {
    integratedAssessments,
    assessmentQuestions,
    assessmentReleases,
  } = await import("../drizzle/schema");

  const existing = await db
    .select()
    .from(integratedAssessments)
    .where(eq(integratedAssessments.code, EVAL1_ASSESSMENT_CODE))
    .limit(1);

  let eval1Id: number;
  if (existing.length === 0) {
    const [row] = await db
      .insert(integratedAssessments)
      .values({
        code: EVAL1_ASSESSMENT_CODE,
        titleFr:
          "Évaluation intégrée 1 — Réception, stockage et contrôle des stocks",
        titleEn:
          "Integrated Assessment 1 — Receiving, storage and inventory control",
        modulesCovered: ["M1", "M2", "M3"],
        questionCount: 20,
        durationMinutes: toStoredDurationMinutes(EVAL1_DURATION_MINUTES),
        passingScore: EVAL1_PASSING_SCORE,
        totalPoints: EVAL1_TOTAL_POINTS,
        purposeFr:
          "Vérifier la compréhension des liens entre opérations physiques, processus métier, transactions WMS, documents/statuts, scénarios et conséquences opérationnelles (M1–M3).",
        purposeEn:
          "Verify understanding of links between physical operations, business process, WMS transactions, documents/statuses, scenarios and operational consequences (M1–M3).",
        status: "ready",
      })
      .$returningId();
    eval1Id = row.id;

    await db.insert(assessmentQuestions).values(
      EVAL1_QUESTIONS.map((q, i) => ({
        assessmentId: eval1Id,
        code: q.code,
        moduleCode: q.moduleCode,
        scenarioOrProcess: q.scenarioOrProcess,
        competency: q.competency,
        difficulty: q.difficulty,
        questionType: q.questionType,
        promptFr: q.promptFr,
        promptEn: q.promptEn,
        optionsJson: q.options,
        correctOptionId: q.correctOptionId,
        explanationFr: q.explanationFr,
        explanationEn: q.explanationEn,
        learningObjectiveFr:
          q.learningObjectiveFr ??
          `Valider la compétence : ${q.competency}`,
        learningObjectiveEn:
          q.learningObjectiveEn ??
          `Validate competency: ${q.competency}`,
        estimatedTimeSeconds: q.estimatedTimeSeconds ?? 120,
        lastRevisedAt: new Date(),
        points: q.points,
        orderIndex: i + 1,
        active: true,
        annulled: false,
        bankScope: "WMS",
      }))
    );

    // Cohort B: visible + released to cohort (professor can tighten later)
    await db.insert(assessmentReleases).values({
      assessmentId: eval1Id,
      cohortId: COHORTE_B_ID,
      releaseLevel: "released_cohort",
      releasedByUserId: null,
      note: "Initial Cohorte Été 2026 — Groupe B release",
      configJson: { excludeDemoAccounts: true },
    });
  } else {
    eval1Id = existing[0].id;
    // Hotfix sync: Eval 1 is canonically untimed (durationMinutes = 0).
    // Do not touch questions, scoring, threshold, or release rows.
    const stored = toStoredDurationMinutes(EVAL1_DURATION_MINUTES);
    if (existing[0].durationMinutes !== stored) {
      await db
        .update(integratedAssessments)
        .set({ durationMinutes: stored })
        .where(eq(integratedAssessments.id, eval1Id));
    }
  }

  const existing2 = await db
    .select()
    .from(integratedAssessments)
    .where(eq(integratedAssessments.code, EVAL2_CODE))
    .limit(1);

  if (existing2.length === 0) {
    const [row2] = await db
      .insert(integratedAssessments)
      .values({
        code: EVAL2_CODE,
        titleFr:
          "Évaluation intégrée 2 — Préparation, expédition et performance logistique",
        titleEn:
          "Integrated Assessment 2 — Preparation, shipping and logistics performance",
        modulesCovered: ["M4", "M5"],
        questionCount: 20,
        durationMinutes: 40,
        passingScore: 70,
        totalPoints: 100,
        purposeFr:
          "Évaluer la préparation, l'expédition, la qualité, la productivité et l'interprétation des KPI (M4–M5). Banque de questions en validation.",
        purposeEn:
          "Assess preparation, shipping, quality, productivity and KPI interpretation (M4–M5). Question bank pending validation.",
        status: "draft",
      })
      .$returningId();

    await db.insert(assessmentReleases).values({
      assessmentId: row2.id,
      cohortId: COHORTE_B_ID,
      releaseLevel: "visible_pending",
      note: "Visible as À venir — not startable until question bank approved",
      configJson: { excludeDemoAccounts: true },
    });
  }

  return { eval1Id };
}

/** Upsert redistributed quiz options + stable option IDs (preserves historical attempt scores). */
export async function reconcileQuizIntegrity() {
  const db = await getDb();
  if (!db) return { updated: 0 };
  const { quizzes, quizQuestions } = await import("../drizzle/schema");

  let updated = 0;
  for (const seed of QUIZ_INTEGRITY_BANK) {
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.moduleId, seed.moduleId))
      .limit(1);
    if (!quiz) continue;

    const [existingQ] = await db
      .select()
      .from(quizQuestions)
      .where(
        and(
          eq(quizQuestions.quizId, quiz.id),
          eq(quizQuestions.orderIndex, seed.orderIndex)
        )
      )
      .limit(1);
    if (!existingQ) continue;

    const mat = materializeQuizOptions(seed.options, seed.correctOptionId);
    await db
      .update(quizQuestions)
      .set({
        questionFr: seed.questionFr,
        questionEn: seed.questionEn,
        optionsFr: mat.optionsFr,
        optionsEn: mat.optionsEn,
        correctIndex: mat.correctIndex,
        optionsPayload: mat.optionsPayload,
        correctOptionId: mat.correctOptionId,
        explanationFr: seed.explanationFr,
        explanationEn: seed.explanationEn,
        difficulty: seed.difficulty,
      })
      .where(eq(quizQuestions.id, existingQ.id));
    updated++;
  }
  return { updated };
}

async function getAssessmentByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const { integratedAssessments } = await import("../drizzle/schema");
  const [row] = await db
    .select()
    .from(integratedAssessments)
    .where(eq(integratedAssessments.code, code))
    .limit(1);
  return row ?? null;
}

async function getQuestionsForAssessment(assessmentId: number) {
  const db = await getDb();
  if (!db) return [];
  const { assessmentQuestions } = await import("../drizzle/schema");
  return db
    .select()
    .from(assessmentQuestions)
    .where(
      and(
        eq(assessmentQuestions.assessmentId, assessmentId),
        eq(assessmentQuestions.active, true)
      )
    )
    .orderBy(asc(assessmentQuestions.orderIndex));
}

async function getReleasesForAssessment(assessmentId: number) {
  const db = await getDb();
  if (!db) return [];
  const { assessmentReleases } = await import("../drizzle/schema");
  return db
    .select()
    .from(assessmentReleases)
    .where(eq(assessmentReleases.assessmentId, assessmentId))
    .orderBy(desc(assessmentReleases.updatedAt));
}

async function getStudentProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const { profiles, users } = await import("../drizzle/schema");
  const [u] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const [p] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);
  return { user: u ?? null, profile: p ?? null };
}

function releaseAppliesToStudent(
  release: {
    releaseLevel: string;
    cohortId: number | null;
    studentUserIds: unknown;
    opensAt: Date | null;
    closesAt: Date | null;
  },
  student: { userId: number; cohortId: number | null },
  now: Date
): { visible: boolean; canStart: boolean; reason: string } {
  const level = release.releaseLevel;
  if (level === "unpublished" || level === "cancelled") {
    return { visible: false, canStart: false, reason: level };
  }

  const ids = Array.isArray(release.studentUserIds)
    ? (release.studentUserIds as number[])
    : typeof release.studentUserIds === "string"
      ? (JSON.parse(release.studentUserIds) as number[])
      : [];

  const cohortMatch =
    release.cohortId == null || release.cohortId === student.cohortId;
  const studentMatch =
    level !== "released_students" || ids.includes(student.userId);

  if (!cohortMatch) {
    return { visible: false, canStart: false, reason: "wrong_cohort" };
  }

  if (level === "visible_pending") {
    return {
      visible: true,
      canStart: false,
      reason: "pending_professor",
    };
  }

  if (level === "closed") {
    return { visible: true, canStart: false, reason: "closed" };
  }

  if (level === "scheduled" || level === "released_cohort" || level === "released_students") {
    if (level === "released_students" && !studentMatch) {
      return { visible: true, canStart: false, reason: "not_selected" };
    }
    const inWindow = isWithinWindow(now, release.opensAt, release.closesAt);
    return {
      visible: true,
      canStart: inWindow && (level !== "scheduled" || inWindow),
      reason: inWindow ? "released" : "outside_window",
    };
  }

  return { visible: true, canStart: false, reason: "unknown" };
}

export async function listStudentAssessmentHub(userId: number) {
  await ensureAssessmentSchemaSeeded();
  const db = await getDb();
  if (!db) return [];

  const profile = await getStudentProfile(userId);
  if (!profile?.user) return [];
  if (isDemoAccount({ id: userId, email: profile.user.email })) {
    // Demo accounts see hub cards as non-official (no start for official cohort releases)
  }

  const { integratedAssessments, assessmentAttempts, studentAssessmentProgress, assessmentRetakeAuthorizations } =
    await import("../drizzle/schema");

  const assessments = await db.select().from(integratedAssessments);
  const cohortId = profile.profile?.cohortId ?? null;
  const now = new Date();
  const result = [];

  for (const a of assessments) {
    const releases = await getReleasesForAssessment(a.id);
    const applicable = releases.filter((r) => {
      if (r.cohortId != null && r.cohortId !== cohortId) return false;
      return true;
    });
    const primary = applicable[0] ?? releases[0] ?? null;

    let visible = a.code === EVAL2_CODE; // Eval2 always visible as hub card
    let canStart = false;
    let releaseLevel = primary?.releaseLevel ?? "unpublished";

    if (primary) {
      const apply = releaseAppliesToStudent(
        primary,
        { userId, cohortId },
        now
      );
      visible = apply.visible || a.code === EVAL2_CODE;
      canStart = apply.canStart && a.status === "ready";
      releaseLevel = primary.releaseLevel;
    }

    // Demo accounts never start official Cohorte B assessments
    if (isDemoAccount({ id: userId, email: profile.user.email })) {
      canStart = false;
    }

    const attempts = await db
      .select()
      .from(assessmentAttempts)
      .where(
        and(
          eq(assessmentAttempts.assessmentId, a.id),
          eq(assessmentAttempts.userId, userId)
        )
      )
      .orderBy(desc(assessmentAttempts.attemptNumber));

    const inProgress = attempts.find((t) => t.status === "in_progress");
    const latestSubmitted = attempts.find(
      (t) => t.status === "submitted" || t.status === "expired_submitted"
    );

    const [progress] = await db
      .select()
      .from(studentAssessmentProgress)
      .where(
        and(
          eq(studentAssessmentProgress.assessmentId, a.id),
          eq(studentAssessmentProgress.userId, userId)
        )
      )
      .limit(1);

    const [retake] = await db
      .select()
      .from(assessmentRetakeAuthorizations)
      .where(
        and(
          eq(assessmentRetakeAuthorizations.assessmentId, a.id),
          eq(assessmentRetakeAuthorizations.userId, userId),
          eq(assessmentRetakeAuthorizations.active, true)
        )
      )
      .limit(1);

    const failed =
      latestSubmitted && latestSubmitted.passed === false;
    const retakeBlocked = !!failed && !retake;
    if (retake && !inProgress) {
      const ok = isWithinWindow(now, retake.opensAt, retake.closesAt);
      if (ok) canStart = canStart || a.status === "ready";
    }
    if (failed && !retake && !inProgress) canStart = false;
    if (inProgress) canStart = true;

    if (a.code === EVAL2_CODE && a.status !== "ready") {
      canStart = false;
      releaseLevel = releaseLevel === "unpublished" ? "visible_pending" : releaseLevel;
    }

    const statusLabel = studentAttemptStatusLabel({
      releaseLevel,
      canStart: canStart && !inProgress,
      inProgress: !!inProgress,
      submitted: !!latestSubmitted,
      passed: latestSubmitted?.passed ?? null,
      retakeBlocked,
      m4UnlockStatus: (progress?.m4UnlockStatus ??
        latestSubmitted?.m4UnlockStatus ??
        "locked") as M4UnlockStatus,
      practicalValidationStatus: (progress?.practicalValidationStatus ??
        "pending") as PracticalValidationStatus,
    });

    if (!visible && a.code !== EVAL2_CODE) continue;

    result.push({
      id: a.id,
      code: a.code,
      titleFr: a.titleFr,
      titleEn: a.titleEn,
      modulesCovered: a.modulesCovered,
      questionCount: a.questionCount,
      durationMinutes: a.durationMinutes,
      passingScore: a.passingScore,
      purposeFr: a.purposeFr,
      purposeEn: a.purposeEn,
      status: a.status,
      releaseLevel,
      canStart: !!canStart && !inProgress,
      inProgressAttemptId: inProgress?.id ?? null,
      statusLabel,
      bestScore: progress?.bestScore ?? null,
      latestScore: progress?.latestScore ?? null,
      firstScore: progress?.firstScore ?? null,
      attemptCount: progress?.attemptCount ?? attempts.length,
      passed: progress?.passed ?? false,
      m4UnlockStatus: progress?.m4UnlockStatus ?? "locked",
      practicalValidationStatus:
        progress?.practicalValidationStatus ?? "pending",
      retakeAuthorized: !!retake,
    });
  }

  return result;
}

export async function startAssessmentAttempt(args: {
  userId: number;
  assessmentId: number;
  email?: string | null;
}) {
  await ensureAssessmentSchemaSeeded();
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");

  if (isDemoAccount({ id: args.userId, email: args.email })) {
    throw Object.assign(new Error("DEMO_EXCLUDED"), { code: "FORBIDDEN" });
  }

  const profile = await getStudentProfile(args.userId);
  const cohortId = profile?.profile?.cohortId ?? null;
  const hub = await listStudentAssessmentHub(args.userId);
  const card = hub.find((h) => h.id === args.assessmentId);
  if (!card) throw Object.assign(new Error("NOT_FOUND"), { code: "NOT_FOUND" });
  if (card.inProgressAttemptId) {
    return { attemptId: card.inProgressAttemptId, resumed: true };
  }
  if (!card.canStart) {
    throw Object.assign(new Error("NOT_RELEASED"), { code: "FORBIDDEN" });
  }

  const questions = await getQuestionsForAssessment(args.assessmentId);
  if (questions.length === 0) {
    throw Object.assign(new Error("NO_QUESTIONS"), { code: "PRECONDITION_FAILED" });
  }

  const { assessmentAttempts, assessmentRetakeAuthorizations } = await import(
    "../drizzle/schema"
  );
  const prior = await db
    .select()
    .from(assessmentAttempts)
    .where(
      and(
        eq(assessmentAttempts.assessmentId, args.assessmentId),
        eq(assessmentAttempts.userId, args.userId)
      )
    );
  const attemptNumber = prior.length + 1;
  if (attemptNumber > 1) {
    const [auth] = await db
      .select()
      .from(assessmentRetakeAuthorizations)
      .where(
        and(
          eq(assessmentRetakeAuthorizations.assessmentId, args.assessmentId),
          eq(assessmentRetakeAuthorizations.userId, args.userId),
          eq(assessmentRetakeAuthorizations.active, true)
        )
      )
      .limit(1);
    if (!auth) {
      throw Object.assign(new Error("RETAKE_NOT_AUTHORIZED"), {
        code: "FORBIDDEN",
      });
    }
  }

  const seed = `a${args.assessmentId}-u${args.userId}-n${attemptNumber}`;
  const qOrder = seededShuffle(
    questions.map((q) => q.id),
    seed + "-q"
  );
  const optionOrder: Record<number, string[]> = {};
  for (const q of questions) {
    const opts = (q.optionsJson as Array<{ id: string }>) || [];
    optionOrder[q.id] = seededShuffle(
      opts.map((o) => o.id),
      seed + `-o${q.id}`
    );
  }

  const untimed = isUntimedDuration(card.durationMinutes);
  const startedAt = new Date();
  // Untimed: DB expiresAt is NOT NULL — store sentinel; never enforce wall-clock expiry.
  const expiresAt = untimed
    ? UNTIMED_EXPIRES_AT_SENTINEL
    : new Date(
        startedAt.getTime() +
          (card.durationMinutes > 0 ? card.durationMinutes : 40) * 60 * 1000
      );

  const [row] = await db
    .insert(assessmentAttempts)
    .values({
      assessmentId: args.assessmentId,
      userId: args.userId,
      cohortId,
      attemptNumber,
      status: "in_progress",
      startedAt,
      expiresAt,
      questionOrderJson: qOrder,
      optionOrderJson: optionOrder,
      responsesJson: {},
      m4UnlockStatus: "locked",
      practicalValidationStatus: "pending",
    })
    .$returningId();

  if (attemptNumber > 1) {
    await db
      .update(assessmentRetakeAuthorizations)
      .set({ consumedAttemptId: row.id, active: false })
      .where(
        and(
          eq(assessmentRetakeAuthorizations.assessmentId, args.assessmentId),
          eq(assessmentRetakeAuthorizations.userId, args.userId),
          eq(assessmentRetakeAuthorizations.active, true)
        )
      );
  }

  return { attemptId: row.id, resumed: false };
}

export async function getAttemptForStudent(args: {
  attemptId: number;
  userId: number;
  includeAnswers?: boolean;
}) {
  const db = await getDb();
  if (!db) return null;
  const { assessmentAttempts, assessmentQuestions, integratedAssessments } =
    await import("../drizzle/schema");

  const [attempt] = await db
    .select()
    .from(assessmentAttempts)
    .where(eq(assessmentAttempts.id, args.attemptId))
    .limit(1);
  if (!attempt || attempt.userId !== args.userId) return null;

  const [assessment] = await db
    .select()
    .from(integratedAssessments)
    .where(eq(integratedAssessments.id, attempt.assessmentId))
    .limit(1);

  const allQ = await getQuestionsForAssessment(attempt.assessmentId);
  const qById = new Map(allQ.map((q) => [q.id, q]));
  const order = (attempt.questionOrderJson as number[]) || [];
  const optionOrder = (attempt.optionOrderJson as Record<string, string[]>) || {};
  const responses = (attempt.responsesJson as Record<string, string | null>) || {};

  const questions = order.map((qid) => {
    const q = qById.get(qid)!;
    const opts = (q.optionsJson as Array<{ id: string; fr: string; en: string }>) || [];
    const ord = optionOrder[String(qid)] || optionOrder[qid] || opts.map((o) => o.id);
    const orderedOpts = ord
      .map((id) => opts.find((o) => o.id === id))
      .filter(Boolean) as Array<{ id: string; fr: string; en: string }>;

    const base: Record<string, unknown> = {
      id: q.id,
      code: q.code,
      moduleCode: q.moduleCode,
      scenarioOrProcess: q.scenarioOrProcess,
      competency: q.competency,
      difficulty: q.difficulty,
      questionType: q.questionType,
      promptFr: q.promptFr,
      promptEn: q.promptEn,
      points: q.points,
      options: orderedOpts,
      selectedOptionId: responses[String(qid)] ?? responses[qid] ?? null,
    };

    // Never leak answers before submission
    if (
      args.includeAnswers ||
      attempt.status === "submitted" ||
      attempt.status === "expired_submitted"
    ) {
      // Still hide full key on failed attempts for students (retake risk)
      if (attempt.passed === false && !args.includeAnswers) {
        return base;
      }
      return {
        ...base,
        correctOptionId: q.correctOptionId,
        explanationFr: q.explanationFr,
        explanationEn: q.explanationEn,
      };
    }
    return base;
  });

  const now = new Date();
  const untimed = isUntimedDuration(assessment?.durationMinutes);
  // Live-class recovery: if assessment became untimed while attempt is open,
  // heal expiresAt so leftover timers cannot expire the student.
  if (
    untimed &&
    attempt.status === "in_progress" &&
    attempt.expiresAt.getTime() < UNTIMED_EXPIRES_AT_SENTINEL.getTime()
  ) {
    await db
      .update(assessmentAttempts)
      .set({ expiresAt: UNTIMED_EXPIRES_AT_SENTINEL })
      .where(eq(assessmentAttempts.id, attempt.id));
    attempt.expiresAt = UNTIMED_EXPIRES_AT_SENTINEL;
  }
  const remainingMs = untimed
    ? null
    : Math.max(0, attempt.expiresAt.getTime() - now.getTime());

  return {
    attempt: {
      id: attempt.id,
      assessmentId: attempt.assessmentId,
      attemptNumber: attempt.attemptNumber,
      status: attempt.status,
      startedAt: attempt.startedAt,
      expiresAt: untimed ? null : attempt.expiresAt,
      submittedAt: attempt.submittedAt,
      durationSeconds: attempt.durationSeconds,
      remainingSeconds: remainingMs === null ? null : Math.floor(remainingMs / 1000),
      isTimed: !untimed,
      autoScore: attempt.autoScore,
      finalScore: attempt.finalScore,
      passed: attempt.passed,
      m4UnlockStatus: attempt.m4UnlockStatus,
      practicalValidationStatus: attempt.practicalValidationStatus,
      competencyBreakdown: attempt.competencyBreakdownJson,
    },
    assessment,
    questions,
  };
}

export async function autosaveAssessmentResponse(args: {
  attemptId: number;
  userId: number;
  questionId: number;
  selectedOptionId: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const { assessmentAttempts } = await import("../drizzle/schema");
  const [attempt] = await db
    .select()
    .from(assessmentAttempts)
    .where(eq(assessmentAttempts.id, args.attemptId))
    .limit(1);
  if (!attempt || attempt.userId !== args.userId) {
    throw Object.assign(new Error("FORBIDDEN"), { code: "FORBIDDEN" });
  }
  if (attempt.status !== "in_progress") {
    throw Object.assign(new Error("IMMUTABLE"), { code: "CONFLICT" });
  }

  const responses = {
    ...((attempt.responsesJson as Record<string, string | null>) || {}),
    [String(args.questionId)]: args.selectedOptionId,
  };
  await db
    .update(assessmentAttempts)
    .set({ responsesJson: responses })
    .where(eq(assessmentAttempts.id, args.attemptId));
  return { ok: true };
}

export async function submitAssessmentAttempt(args: {
  attemptId: number;
  userId: number;
  forceExpire?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const {
    assessmentAttempts,
    assessmentAttemptResponses,
    studentAssessmentProgress,
    assessmentPracticalEvidence,
    integratedAssessments,
  } = await import("../drizzle/schema");

  const [attempt] = await db
    .select()
    .from(assessmentAttempts)
    .where(eq(assessmentAttempts.id, args.attemptId))
    .limit(1);
  if (!attempt || attempt.userId !== args.userId) {
    throw Object.assign(new Error("FORBIDDEN"), { code: "FORBIDDEN" });
  }

  // Idempotent: already submitted
  if (attempt.status === "submitted" || attempt.status === "expired_submitted") {
    const score = attempt.finalScore ?? attempt.autoScore ?? 0;
    const level = resolveCompetencyLevel(score);
    return {
      score,
      passed: attempt.passed,
      competencyLevel: {
        code: level.code,
        labelFr: level.labelFr,
        labelEn: level.labelEn,
        meaningFr: level.meaningFr,
        meaningEn: level.meaningEn,
        continuationAllowed: level.continuationAllowed,
      },
      m4UnlockStatus: attempt.m4UnlockStatus,
      practicalValidationStatus: attempt.practicalValidationStatus,
      competencyBreakdown: attempt.competencyBreakdownJson,
      duplicate: true,
    };
  }
  if (attempt.status !== "in_progress") {
    throw Object.assign(new Error("INVALID_STATUS"), { code: "CONFLICT" });
  }

  const [assessmentRow] = await db
    .select()
    .from(integratedAssessments)
    .where(eq(integratedAssessments.id, attempt.assessmentId))
    .limit(1);
  const untimed = isUntimedDuration(assessmentRow?.durationMinutes);

  const questions = await getQuestionsForAssessment(attempt.assessmentId);
  const responsesMap =
    (attempt.responsesJson as Record<string, string | null>) || {};
  const responses = questions.map((q) => ({
    questionId: q.id,
    selectedOptionId: responsesMap[String(q.id)] ?? responsesMap[q.id] ?? null,
  }));

  const scored = scoreByOptionId({
    responses,
    questions: questions.map((q) => ({
      id: q.id,
      correctOptionId: q.correctOptionId,
      points: q.points,
      competency: q.competency,
      annulled: q.annulled,
    })),
  });

  const now = new Date();
  // Untimed assessments never expire by wall clock (even if forceExpire is passed).
  const expired =
    !untimed && (now > attempt.expiresAt || !!args.forceExpire);
  const durationSeconds = Math.floor(
    (Math.min(
      now.getTime(),
      untimed ? now.getTime() : attempt.expiresAt.getTime()
    ) -
      attempt.startedAt.getTime()) /
      1000
  );

  // Practical evidence: professor record only (never fabricate scenario completions)
  const evidence = await db
    .select()
    .from(assessmentPracticalEvidence)
    .where(
      and(
        eq(assessmentPracticalEvidence.assessmentId, attempt.assessmentId),
        eq(assessmentPracticalEvidence.userId, args.userId)
      )
    )
    .limit(1);

  // Prior M1–M3 practical progression — Cohorte B consolidative path
  const { getModuleProgressByUser } = await import("./db");
  const moduleRows = await getModuleProgressByUser(args.userId);
  const byModule = new Map(moduleRows.map((r) => [r.moduleId, r]));
  const priorPracticalProgressComplete = !!(
    byModule.get(1)?.passed &&
    byModule.get(2)?.passed &&
    byModule.get(3)?.passed
  );

  const [progExisting] = await db
    .select()
    .from(studentAssessmentProgress)
    .where(
      and(
        eq(studentAssessmentProgress.userId, args.userId),
        eq(studentAssessmentProgress.assessmentId, attempt.assessmentId)
      )
    )
    .limit(1);

  const unlock = computeM4UnlockStatus({
    assessmentPassed: scored.passed,
    practicalEvidenceSatisfied: evidence.length > 0,
    priorPracticalProgressComplete,
    policy: progressionPolicyForCohort(attempt.cohortId),
    previousM4UnlockStatus: progExisting?.m4UnlockStatus ?? null,
  });
  const m4UnlockStatus = unlock.m4UnlockStatus;
  const practicalStatus = unlock.practicalValidationStatus;

  await db
    .update(assessmentAttempts)
    .set({
      status: expired ? "expired_submitted" : "submitted",
      submittedAt: now,
      durationSeconds,
      autoScore: scored.autoScore,
      finalScore: scored.autoScore,
      passed: scored.passed,
      competencyBreakdownJson: scored.competencyBreakdown,
      m4UnlockStatus,
      practicalValidationStatus: practicalStatus,
      professorReviewStatus: "none",
    })
    .where(eq(assessmentAttempts.id, args.attemptId));

  for (const pq of scored.perQuestion) {
    const existingResp = await db
      .select()
      .from(assessmentAttemptResponses)
      .where(
        and(
          eq(assessmentAttemptResponses.attemptId, args.attemptId),
          eq(assessmentAttemptResponses.questionId, pq.questionId)
        )
      )
      .limit(1);
    if (existingResp.length) {
      await db
        .update(assessmentAttemptResponses)
        .set({
          selectedOptionId: pq.selectedOptionId,
          isCorrect: pq.isCorrect,
          pointsAwarded: pq.pointsAwarded,
          annulled: pq.annulled,
        })
        .where(eq(assessmentAttemptResponses.id, existingResp[0].id));
    } else {
      await db.insert(assessmentAttemptResponses).values({
        attemptId: args.attemptId,
        questionId: pq.questionId,
        selectedOptionId: pq.selectedOptionId,
        isCorrect: pq.isCorrect,
        pointsAwarded: pq.pointsAwarded,
        annulled: pq.annulled,
      });
    }
  }

  const prog = progExisting;
  const firstScore = prog?.firstScore ?? scored.autoScore;
  const bestScore = Math.max(prog?.bestScore ?? 0, scored.autoScore);
  const attemptCount = (prog?.attemptCount ?? 0) + 1;

  // Never revoke an already-unlocked academic M4 status (Cohorte B consolidative rule)
  const persistedM4: M4UnlockStatus =
    prog?.m4UnlockStatus === "unlocked" || m4UnlockStatus === "unlocked"
      ? "unlocked"
      : m4UnlockStatus;
  const persistedPractical: PracticalValidationStatus =
    prog?.practicalValidationStatus === "satisfied" ||
    practicalStatus === "satisfied"
      ? "satisfied"
      : practicalStatus;

  if (prog) {
    await db
      .update(studentAssessmentProgress)
      .set({
        firstScore,
        latestScore: scored.autoScore,
        bestScore,
        attemptCount,
        passed: prog.passed || scored.passed,
        m4UnlockStatus: persistedM4,
        practicalValidationStatus: persistedPractical,
      })
      .where(eq(studentAssessmentProgress.id, prog.id));
  } else {
    await db.insert(studentAssessmentProgress).values({
      userId: args.userId,
      assessmentId: attempt.assessmentId,
      firstScore: scored.autoScore,
      latestScore: scored.autoScore,
      bestScore: scored.autoScore,
      attemptCount: 1,
      passed: scored.passed,
      m4UnlockStatus: persistedM4,
      practicalValidationStatus: persistedPractical,
    });
  }

  // Keep attempt row aligned with non-revocation rule
  if (persistedM4 !== m4UnlockStatus || persistedPractical !== practicalStatus) {
    await db
      .update(assessmentAttempts)
      .set({
        m4UnlockStatus: persistedM4,
        practicalValidationStatus: persistedPractical,
      })
      .where(eq(assessmentAttempts.id, args.attemptId));
  }

  const level = resolveCompetencyLevel(scored.autoScore);

  return {
    score: scored.autoScore,
    passed: scored.passed,
    assessmentRole: unlock.assessmentRole,
    competencyLevel: {
      code: level.code,
      labelFr: level.labelFr,
      labelEn: level.labelEn,
      meaningFr: level.meaningFr,
      meaningEn: level.meaningEn,
      continuationAllowed: level.continuationAllowed,
    },
    m4UnlockStatus: persistedM4,
    practicalValidationStatus: persistedPractical,
    competencyBreakdown: scored.competencyBreakdown,
    expired,
    duplicate: false,
  };
}

// ── Professor operations ────────────────────────────────────────────────────

export async function professorListAssessments() {
  await ensureAssessmentSchemaSeeded();
  const db = await getDb();
  if (!db) return [];
  const { integratedAssessments, assessmentReleases } = await import(
    "../drizzle/schema"
  );
  const assessments = await db.select().from(integratedAssessments);
  const releases = await db.select().from(assessmentReleases);
  return assessments.map((a) => ({
    ...a,
    releases: releases.filter((r) => r.assessmentId === a.id),
  }));
}

export async function professorUpsertRelease(args: {
  actorUserId: number;
  assessmentId: number;
  cohortId: number | null;
  releaseLevel:
    | "unpublished"
    | "visible_pending"
    | "released_cohort"
    | "released_students"
    | "scheduled"
    | "closed"
    | "cancelled";
  studentUserIds?: number[];
  opensAt?: Date | null;
  closesAt?: Date | null;
  note?: string;
  releaseId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const { assessmentReleases, assessmentReleaseLogs } = await import(
    "../drizzle/schema"
  );

  let releaseId = args.releaseId;
  let before: unknown = null;

  if (releaseId) {
    const [prev] = await db
      .select()
      .from(assessmentReleases)
      .where(eq(assessmentReleases.id, releaseId))
      .limit(1);
    before = prev;
    await db
      .update(assessmentReleases)
      .set({
        releaseLevel: args.releaseLevel,
        cohortId: args.cohortId,
        studentUserIds: args.studentUserIds ?? null,
        opensAt: args.opensAt ?? null,
        closesAt: args.closesAt ?? null,
        releasedByUserId: args.actorUserId,
        note: args.note ?? null,
      })
      .where(eq(assessmentReleases.id, releaseId));
  } else {
    const [row] = await db
      .insert(assessmentReleases)
      .values({
        assessmentId: args.assessmentId,
        cohortId: args.cohortId,
        releaseLevel: args.releaseLevel,
        studentUserIds: args.studentUserIds ?? null,
        opensAt: args.opensAt ?? null,
        closesAt: args.closesAt ?? null,
        releasedByUserId: args.actorUserId,
        note: args.note ?? null,
      })
      .$returningId();
    releaseId = row.id;
  }

  const [after] = await db
    .select()
    .from(assessmentReleases)
    .where(eq(assessmentReleases.id, releaseId!))
    .limit(1);

  await db.insert(assessmentReleaseLogs).values({
    releaseId: releaseId!,
    assessmentId: args.assessmentId,
    actorUserId: args.actorUserId,
    action: args.releaseId ? "update_release" : "create_release",
    beforeJson: before,
    afterJson: after,
  });

  return after;
}

export async function professorAuthorizeRetake(args: {
  actorUserId: number;
  assessmentId: number;
  userId: number;
  opensAt?: Date | null;
  closesAt?: Date | null;
  note?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const { assessmentRetakeAuthorizations } = await import("../drizzle/schema");
  // Deactivate prior
  await db
    .update(assessmentRetakeAuthorizations)
    .set({ active: false })
    .where(
      and(
        eq(assessmentRetakeAuthorizations.assessmentId, args.assessmentId),
        eq(assessmentRetakeAuthorizations.userId, args.userId),
        eq(assessmentRetakeAuthorizations.active, true)
      )
    );
  const [row] = await db
    .insert(assessmentRetakeAuthorizations)
    .values({
      assessmentId: args.assessmentId,
      userId: args.userId,
      authorizedByUserId: args.actorUserId,
      opensAt: args.opensAt ?? null,
      closesAt: args.closesAt ?? null,
      note: args.note ?? null,
      active: true,
    })
    .$returningId();
  return row;
}

export async function professorRecordPracticalEvidence(args: {
  actorUserId: number;
  assessmentId: number;
  userId: number;
  cohortId?: number | null;
  taskFr: string;
  resultFr: string;
  note?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const {
    assessmentPracticalEvidence,
    studentAssessmentProgress,
    assessmentAttempts,
  } = await import("../drizzle/schema");

  const [row] = await db
    .insert(assessmentPracticalEvidence)
    .values({
      assessmentId: args.assessmentId,
      userId: args.userId,
      cohortId: args.cohortId ?? null,
      taskFr: args.taskFr,
      resultFr: args.resultFr,
      note: args.note ?? null,
      recordedByUserId: args.actorUserId,
    })
    .$returningId();

  const [prog] = await db
    .select()
    .from(studentAssessmentProgress)
    .where(
      and(
        eq(studentAssessmentProgress.assessmentId, args.assessmentId),
        eq(studentAssessmentProgress.userId, args.userId)
      )
    )
    .limit(1);

  if (prog?.passed) {
    await db
      .update(studentAssessmentProgress)
      .set({
        practicalValidationStatus: "satisfied",
        m4UnlockStatus: "unlocked",
      })
      .where(eq(studentAssessmentProgress.id, prog.id));

    await db
      .update(assessmentAttempts)
      .set({
        practicalValidationStatus: "satisfied",
        m4UnlockStatus: "unlocked",
      })
      .where(
        and(
          eq(assessmentAttempts.assessmentId, args.assessmentId),
          eq(assessmentAttempts.userId, args.userId),
          eq(assessmentAttempts.passed, true)
        )
      );
  }

  return row;
}

export async function professorGetAttemptDetail(attemptId: number) {
  const db = await getDb();
  if (!db) return null;
  const {
    assessmentAttempts,
    assessmentQuestions,
    integratedAssessments,
    users,
    profiles,
    assessmentGradeAudits,
  } = await import("../drizzle/schema");

  const [attempt] = await db
    .select()
    .from(assessmentAttempts)
    .where(eq(assessmentAttempts.id, attemptId))
    .limit(1);
  if (!attempt) return null;

  const [assessment] = await db
    .select()
    .from(integratedAssessments)
    .where(eq(integratedAssessments.id, attempt.assessmentId))
    .limit(1);
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, attempt.userId))
    .limit(1);
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, attempt.userId))
    .limit(1);

  const allQ = await getQuestionsForAssessment(attempt.assessmentId);
  const qById = new Map(allQ.map((q) => [q.id, q]));
  const order = (attempt.questionOrderJson as number[]) || [];
  const optionOrder =
    (attempt.optionOrderJson as Record<string, string[]>) || {};
  const responses =
    (attempt.responsesJson as Record<string, string | null>) || {};

  const questions = order.map((qid) => {
    const q = qById.get(qid)!;
    const opts =
      (q.optionsJson as Array<{ id: string; fr: string; en: string }>) || [];
    const ord =
      optionOrder[String(qid)] || optionOrder[qid] || opts.map((o) => o.id);
    const orderedOpts = ord
      .map((id) => opts.find((o) => o.id === id))
      .filter(Boolean);
    return {
      ...q,
      optionsDisplayed: orderedOpts,
      selectedOptionId: responses[String(qid)] ?? null,
      isCorrect:
        (responses[String(qid)] ?? null) === q.correctOptionId && !q.annulled,
    };
  });

  const audits = await db
    .select()
    .from(assessmentGradeAudits)
    .where(eq(assessmentGradeAudits.attemptId, attemptId))
    .orderBy(desc(assessmentGradeAudits.createdAt));

  return {
    attempt,
    assessment,
    student: {
      userId: user?.id,
      name: user?.name,
      email: user?.email,
      studentNumber: profile?.studentNumber,
      cohortId: profile?.cohortId,
      isDemo: user ? isDemoAccount({ id: user.id, email: user.email }) : false,
    },
    questions,
    audits,
  };
}

export async function professorRecalculateAttempt(args: {
  attemptId: number;
  actorUserId: number;
  reason: string;
  annulQuestionIds?: number[];
}) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const {
    assessmentAttempts,
    assessmentQuestions,
    assessmentGradeAudits,
    studentAssessmentProgress,
  } = await import("../drizzle/schema");

  const [attempt] = await db
    .select()
    .from(assessmentAttempts)
    .where(eq(assessmentAttempts.id, args.attemptId))
    .limit(1);
  if (!attempt) throw new Error("NOT_FOUND");

  if (args.annulQuestionIds?.length) {
    for (const qid of args.annulQuestionIds) {
      await db
        .update(assessmentQuestions)
        .set({ annulled: true })
        .where(eq(assessmentQuestions.id, qid));
    }
  }

  const questions = await getQuestionsForAssessment(attempt.assessmentId);
  const responsesMap =
    (attempt.responsesJson as Record<string, string | null>) || {};
  const scored = scoreByOptionId({
    responses: questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: responsesMap[String(q.id)] ?? null,
    })),
    questions: questions.map((q) => ({
      id: q.id,
      correctOptionId: q.correctOptionId,
      points: q.points,
      competency: q.competency,
      annulled: q.annulled,
    })),
  });

  const previousScore = attempt.finalScore ?? attempt.autoScore;
  await db
    .update(assessmentAttempts)
    .set({
      autoScore: scored.autoScore,
      finalScore: scored.autoScore,
      passed: scored.passed,
      competencyBreakdownJson: scored.competencyBreakdown,
      professorReviewStatus: "adjusted",
    })
    .where(eq(assessmentAttempts.id, args.attemptId));

  await db.insert(assessmentGradeAudits).values({
    attemptId: args.attemptId,
    actorUserId: args.actorUserId,
    previousScore,
    updatedScore: scored.autoScore,
    reason: args.reason,
    detailsJson: { annulQuestionIds: args.annulQuestionIds ?? [] },
  });

  const [prog] = await db
    .select()
    .from(studentAssessmentProgress)
    .where(
      and(
        eq(studentAssessmentProgress.userId, attempt.userId),
        eq(studentAssessmentProgress.assessmentId, attempt.assessmentId)
      )
    )
    .limit(1);
  if (prog) {
    await db
      .update(studentAssessmentProgress)
      .set({
        latestScore: scored.autoScore,
        bestScore: Math.max(prog.bestScore ?? 0, scored.autoScore),
        passed: prog.passed || scored.passed,
      })
      .where(eq(studentAssessmentProgress.id, prog.id));
  }

  return { previousScore, updatedScore: scored.autoScore, passed: scored.passed };
}

export async function professorAssessmentAnalysis(assessmentId: number) {
  const db = await getDb();
  if (!db) return null;
  const {
    assessmentAttempts,
    assessmentReleases,
    users,
    profiles,
    studentAssessmentProgress,
  } = await import("../drizzle/schema");

  const releases = await getReleasesForAssessment(assessmentId);
  const attempts = await db
    .select()
    .from(assessmentAttempts)
    .where(eq(assessmentAttempts.assessmentId, assessmentId));

  const userIds = Array.from(new Set(attempts.map((a) => a.userId)));
  const userRows =
    userIds.length > 0
      ? await db.select().from(users).where(inArray(users.id, userIds))
      : [];
  const userMap = new Map(userRows.map((u) => [u.id, u]));

  const officialAttempts = attempts.filter((a) => {
    const u = userMap.get(a.userId);
    return u
      ? shouldIncludeInOfficialAssessmentStats({ id: u.id, email: u.email })
      : false;
  });

  const submitted = officialAttempts.filter(
    (a) => a.status === "submitted" || a.status === "expired_submitted"
  );
  const scores = submitted
    .map((a) => a.finalScore ?? a.autoScore)
    .filter((s): s is number => s != null)
    .sort((a, b) => a - b);

  const median =
    scores.length === 0
      ? null
      : scores.length % 2 === 1
        ? scores[(scores.length - 1) / 2]
        : Math.round(
            (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2
          );

  const progress = await db
    .select()
    .from(studentAssessmentProgress)
    .where(eq(studentAssessmentProgress.assessmentId, assessmentId));

  const questions = await getQuestionsForAssessment(assessmentId);
  const questionStats = questions.map((q) => {
    let answered = 0;
    let correct = 0;
    const dist: Record<string, number> = {};
    for (const a of submitted) {
      const resp = (a.responsesJson as Record<string, string | null>) || {};
      const sel = resp[String(q.id)];
      if (!sel) continue;
      answered++;
      dist[sel] = (dist[sel] || 0) + 1;
      if (sel === q.correctOptionId) correct++;
    }
    const distractors = Object.entries(dist)
      .filter(([id]) => id !== q.correctOptionId)
      .sort((a, b) => b[1] - a[1]);
    return {
      questionId: q.id,
      code: q.code,
      competency: q.competency,
      moduleCode: q.moduleCode,
      scenarioOrProcess: q.scenarioOrProcess,
      answered,
      correct,
      correctRate: answered ? correct / answered : 0,
      answerDistribution: dist,
      mostSelectedDistractor: distractors[0]?.[0] ?? null,
      ambiguityWarning: answered >= 3 && correct / answered < 0.4,
    };
  });

  return {
    releases,
    counts: {
      releasedStudents: releases
        .filter((r) =>
          ["released_cohort", "released_students", "scheduled"].includes(
            r.releaseLevel
          )
        )
        .length,
      notStarted: progress.filter((p) => p.attemptCount === 0).length,
      inProgress: officialAttempts.filter((a) => a.status === "in_progress")
        .length,
      submitted: submitted.length,
      passed: submitted.filter((a) => a.passed).length,
      failed: submitted.filter((a) => a.passed === false).length,
      pendingPractical: progress.filter(
        (p) => p.passed && p.practicalValidationStatus === "pending"
      ).length,
    },
    scores: {
      average:
        scores.length === 0
          ? null
          : Math.round(scores.reduce((s, n) => s + n, 0) / scores.length),
      highest: scores.length ? scores[scores.length - 1] : null,
      lowest: scores.length ? scores[0] : null,
      median,
      passRate:
        submitted.length === 0
          ? null
          : submitted.filter((a) => a.passed).length / submitted.length,
      averageDurationSeconds:
        submitted.length === 0
          ? null
          : Math.round(
              submitted.reduce((s, a) => s + (a.durationSeconds || 0), 0) /
                submitted.length
            ),
    },
    questionStats,
    competencyStats: (() => {
      const map = new Map<
        string,
        { earned: number; possible: number; n: number }
      >();
      for (const a of submitted) {
        const br = (a.competencyBreakdownJson as Array<{
          competency: string;
          earned: number;
          possible: number;
        }>) || [];
        for (const c of br) {
          const cur = map.get(c.competency) || {
            earned: 0,
            possible: 0,
            n: 0,
          };
          cur.earned += c.earned;
          cur.possible += c.possible;
          cur.n += 1;
          map.set(c.competency, cur);
        }
      }
      return Array.from(map.entries()).map(([competency, v]) => ({
        competency,
        avgPct: v.possible ? Math.round((v.earned / v.possible) * 100) : 0,
        samples: v.n,
      }));
    })(),
  };
}

export async function professorAssessmentRoster(args: {
  assessmentId: number;
  cohortId?: number | null;
}) {
  const db = await getDb();
  if (!db) return [];
  const { profiles, users, studentAssessmentProgress, assessmentAttempts } =
    await import("../drizzle/schema");

  let profileRows = await db.select().from(profiles);
  if (args.cohortId != null) {
    profileRows = profileRows.filter((p) => p.cohortId === args.cohortId);
  }

  const result = [];
  for (const p of profileRows) {
    const [u] = await db
      .select()
      .from(users)
      .where(eq(users.id, p.userId))
      .limit(1);
    if (!u || u.role !== "student") continue;
    if (!shouldIncludeInOfficialAssessmentStats({ id: u.id, email: u.email })) {
      continue;
    }

    const [prog] = await db
      .select()
      .from(studentAssessmentProgress)
      .where(
        and(
          eq(studentAssessmentProgress.userId, u.id),
          eq(studentAssessmentProgress.assessmentId, args.assessmentId)
        )
      )
      .limit(1);

    const attempts = await db
      .select()
      .from(assessmentAttempts)
      .where(
        and(
          eq(assessmentAttempts.userId, u.id),
          eq(assessmentAttempts.assessmentId, args.assessmentId)
        )
      )
      .orderBy(desc(assessmentAttempts.attemptNumber));

    result.push({
      userId: u.id,
      name: u.name,
      email: u.email,
      studentNumber: p.studentNumber,
      cohortId: p.cohortId,
      progress: prog ?? null,
      attempts,
      latestAttempt: attempts[0] ?? null,
    });
  }
  return result;
}

/**
 * RC13.1 — Professor preview (read-only).
 * Loads the full assessment + question bank for inspection.
 * MUST NOT create attempts, responses, logs, analytics writes, or mutate releases/scores.
 */
export async function professorPreviewAssessment(assessmentId: number) {
  await ensureAssessmentSchemaSeeded();
  const db = await getDb();
  if (!db) return null;
  const { integratedAssessments } = await import("../drizzle/schema");

  const [assessment] = await db
    .select()
    .from(integratedAssessments)
    .where(eq(integratedAssessments.id, assessmentId))
    .limit(1);
  if (!assessment) return null;

  const questions = await getQuestionsForAssessment(assessmentId);
  // Reuse analysis computation (SELECT-only aggregates — no writes).
  const analysis = await professorAssessmentAnalysis(assessmentId);
  const statsById = new Map(
    (analysis?.questionStats ?? []).map((s) => [s.questionId, s])
  );

  const lastRevisionCandidates = [
    assessment.updatedAt,
    ...questions.map((q) => q.lastRevisedAt).filter(Boolean),
  ].filter((d): d is Date => d != null);
  const lastRevision =
    lastRevisionCandidates.length === 0
      ? assessment.updatedAt
      : new Date(
          Math.max(...lastRevisionCandidates.map((d) => new Date(d).getTime()))
        );

  return {
    assessment: {
      id: assessment.id,
      code: assessment.code,
      titleFr: assessment.titleFr,
      titleEn: assessment.titleEn,
      modulesCovered: assessment.modulesCovered as string[],
      durationMinutes: assessment.durationMinutes,
      passingScore: assessment.passingScore,
      questionCount: assessment.questionCount,
      totalPoints: assessment.totalPoints,
      status: assessment.status,
      purposeFr: assessment.purposeFr,
      purposeEn: assessment.purposeEn,
      version: `v1 · ${assessment.code}`,
      lastRevision,
      createdAt: assessment.createdAt,
      updatedAt: assessment.updatedAt,
    },
    questions: questions.map((q, idx) => {
      const options =
        (q.optionsJson as Array<{ id: string; fr: string; en: string }>) || [];
      const st = statsById.get(q.id);
      const answered = st?.answered ?? 0;
      const correctRate = st?.correctRate ?? 0;
      return {
        id: q.id,
        number: idx + 1,
        code: q.code,
        moduleCode: q.moduleCode,
        scenarioOrProcess: q.scenarioOrProcess,
        competency: q.competency,
        difficulty: q.difficulty,
        questionType: q.questionType,
        promptFr: q.promptFr,
        promptEn: q.promptEn,
        options,
        points: q.points,
        correctOptionId: q.correctOptionId,
        explanationFr: q.explanationFr,
        explanationEn: q.explanationEn,
        learningObjectiveFr: q.learningObjectiveFr,
        learningObjectiveEn: q.learningObjectiveEn,
        estimatedTimeSeconds: q.estimatedTimeSeconds,
        lastRevisedAt: q.lastRevisedAt,
        revision: q.lastRevisedAt ?? q.createdAt,
        active: q.active,
        annulled: q.annulled,
        bankScope: q.bankScope,
        status: q.annulled ? "annulled" : q.active ? "active" : "inactive",
        // Professor-only notes — reuse learning objective / explanation (no schema change).
        professorNotesFr:
          q.learningObjectiveFr ||
          q.explanationFr ||
          null,
        professorNotesEn:
          q.learningObjectiveEn ||
          q.explanationEn ||
          null,
        stats: {
          attempts: answered || null,
          correctPct: answered > 0 ? Math.round(correctRate * 100) : null,
          averageScore:
            answered > 0
              ? Math.round(correctRate * q.points * 10) / 10
              : null,
          averageTimeMs: q.avgResponseTimeMs ?? null,
          mostSelectedDistractor: st?.mostSelectedDistractor ?? null,
        },
      };
    }),
  };
}

/**
 * RC13.1 — Professor question bank browser (read-only, no edits).
 */
export async function professorQuestionBank(args: {
  assessmentId?: number;
}) {
  await ensureAssessmentSchemaSeeded();
  const db = await getDb();
  if (!db) return { assessments: [], questions: [] };
  const { integratedAssessments, assessmentQuestions } = await import(
    "../drizzle/schema"
  );

  const assessments = await db.select().from(integratedAssessments);
  let qRows = await db
    .select()
    .from(assessmentQuestions)
    .orderBy(
      asc(assessmentQuestions.assessmentId),
      asc(assessmentQuestions.orderIndex)
    );
  if (args.assessmentId != null) {
    qRows = qRows.filter((q) => q.assessmentId === args.assessmentId);
  }

  const assessmentById = new Map(assessments.map((a) => [a.id, a]));

  return {
    assessments: assessments.map((a) => ({
      id: a.id,
      code: a.code,
      titleFr: a.titleFr,
      titleEn: a.titleEn,
      status: a.status,
      questionCount: a.questionCount,
    })),
    questions: qRows.map((q) => {
      const a = assessmentById.get(q.assessmentId);
      return {
        id: q.id,
        assessmentId: q.assessmentId,
        assessmentCode: a?.code ?? null,
        assessmentTitleFr: a?.titleFr ?? null,
        code: q.code,
        moduleCode: q.moduleCode,
        scenarioOrProcess: q.scenarioOrProcess,
        competency: q.competency,
        difficulty: q.difficulty,
        questionType: q.questionType,
        promptFr: q.promptFr,
        promptEn: q.promptEn,
        points: q.points,
        correctOptionId: q.correctOptionId,
        explanationFr: q.explanationFr,
        explanationEn: q.explanationEn,
        learningObjectiveFr: q.learningObjectiveFr,
        learningObjectiveEn: q.learningObjectiveEn,
        options:
          (q.optionsJson as Array<{ id: string; fr: string; en: string }>) ||
          [],
        active: q.active,
        annulled: q.annulled,
        status: q.annulled ? "annulled" : q.active ? "active" : "inactive",
        lastRevisedAt: q.lastRevisedAt,
        bankScope: q.bankScope,
      };
    }),
  };
}
