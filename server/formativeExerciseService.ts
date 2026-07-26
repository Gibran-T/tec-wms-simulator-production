/**
 * Isolated formative exercise persistence for M4/M5.
 * Explicitly does NOT update module_progress, scenario_runs, quiz_attempts,
 * assessments, checkpoints, or certification tables.
 */
import { and, eq, inArray } from "drizzle-orm";
import { getDb, listStudents } from "./db";
import {
  FORMATIVE_EXERCISE_CATALOG,
  FORMATIVE_EXERCISE_IDS,
  FORMATIVE_ISOLATION_FLAGS,
  countFeedbackAnswers,
  deriveTeacherFormativeStatus,
  getFormativeExerciseMeta,
  isFormativeExerciseId,
  participationRate,
  completionRate,
  scoreFormativeExercise,
  correctAnswerRate,
  type FormativeExerciseId,
  type FormativeExerciseStatus,
  type TeacherFormativeStatus,
} from "../shared/formativeExercises";

const CURRENT_VERSION = 1;

function isolationDefaults() {
  return { ...FORMATIVE_ISOLATION_FLAGS };
}

export async function listFormativeAttemptsForUser(userId: number, moduleId?: number) {
  const db = await getDb();
  if (!db) return [];
  const { formativeExerciseAttempts } = await import("../drizzle/schema");
  const rows = await db
    .select()
    .from(formativeExerciseAttempts)
    .where(
      moduleId
        ? and(
            eq(formativeExerciseAttempts.userId, userId),
            eq(formativeExerciseAttempts.moduleId, moduleId),
          )
        : eq(formativeExerciseAttempts.userId, userId),
    );
  return rows.map(sanitizeAttempt);
}

export async function getFormativeAttempt(userId: number, exerciseId: FormativeExerciseId) {
  const db = await getDb();
  if (!db) return null;
  const { formativeExerciseAttempts } = await import("../drizzle/schema");
  const [row] = await db
    .select()
    .from(formativeExerciseAttempts)
    .where(
      and(
        eq(formativeExerciseAttempts.userId, userId),
        eq(formativeExerciseAttempts.exerciseId, exerciseId),
        eq(formativeExerciseAttempts.version, CURRENT_VERSION),
      ),
    )
    .limit(1);
  return row ? sanitizeAttempt(row) : null;
}

export async function startOrResumeFormativeExercise(userId: number, exerciseId: FormativeExerciseId) {
  if (!isFormativeExerciseId(exerciseId)) {
    throw Object.assign(new Error("Unknown formative exercise"), { code: "NOT_FOUND" });
  }
  const meta = getFormativeExerciseMeta(exerciseId);
  const db = await getDb();
  if (!db) {
    throw Object.assign(new Error("Database unavailable"), { code: "INTERNAL_SERVER_ERROR" });
  }
  const { formativeExerciseAttempts } = await import("../drizzle/schema");
  const existing = await getFormativeAttempt(userId, exerciseId);
  if (existing) return existing;

  const flags = isolationDefaults();
  const [inserted] = await db
    .insert(formativeExerciseAttempts)
    .values({
      userId,
      exerciseId,
      moduleId: meta.moduleId,
      version: CURRENT_VERSION,
      answers: {},
      formativeScore: null,
      status: "in_progress",
      feedbackJson: null,
      ...flags,
      startedAt: new Date(),
      completedAt: null,
    })
    .$returningId();

  const [row] = await db
    .select()
    .from(formativeExerciseAttempts)
    .where(eq(formativeExerciseAttempts.id, inserted.id))
    .limit(1);
  return sanitizeAttempt(row!);
}

export async function saveFormativeAnswers(params: {
  userId: number;
  exerciseId: FormativeExerciseId;
  answers: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) {
    throw Object.assign(new Error("Database unavailable"), { code: "INTERNAL_SERVER_ERROR" });
  }
  const { formativeExerciseAttempts } = await import("../drizzle/schema");
  let attempt = await getFormativeAttempt(params.userId, params.exerciseId);
  if (!attempt) {
    attempt = await startOrResumeFormativeExercise(params.userId, params.exerciseId);
  }
  if (attempt.userId !== params.userId) {
    throw Object.assign(new Error("Forbidden"), { code: "FORBIDDEN" });
  }

  const nextStatus: FormativeExerciseStatus =
    attempt.status === "completed" ? "completed" : "in_progress";

  await db
    .update(formativeExerciseAttempts)
    .set({
      answers: params.answers,
      status: nextStatus,
      // Re-assert isolation flags on every write
      ...isolationDefaults(),
    })
    .where(
      and(
        eq(formativeExerciseAttempts.id, attempt.id),
        eq(formativeExerciseAttempts.userId, params.userId),
      ),
    );

  return getFormativeAttempt(params.userId, params.exerciseId);
}

export async function submitFormativeExercise(params: {
  userId: number;
  exerciseId: FormativeExerciseId;
  answers: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) {
    throw Object.assign(new Error("Database unavailable"), { code: "INTERNAL_SERVER_ERROR" });
  }
  const { formativeExerciseAttempts } = await import("../drizzle/schema");
  let attempt = await getFormativeAttempt(params.userId, params.exerciseId);
  if (!attempt) {
    attempt = await startOrResumeFormativeExercise(params.userId, params.exerciseId);
  }
  if (attempt.userId !== params.userId) {
    throw Object.assign(new Error("Forbidden"), { code: "FORBIDDEN" });
  }

  const scored = scoreFormativeExercise(params.exerciseId, params.answers);

  await db
    .update(formativeExerciseAttempts)
    .set({
      answers: params.answers,
      formativeScore: scored.formativeScore,
      feedbackJson: { items: scored.feedback, partScores: scored.partScores },
      status: "completed",
      completedAt: new Date(),
      ...isolationDefaults(),
    })
    .where(
      and(
        eq(formativeExerciseAttempts.id, attempt.id),
        eq(formativeExerciseAttempts.userId, params.userId),
      ),
    );

  // Isolation guarantee: no writes to module_progress, scenario_runs,
  // quiz/assessment scoring, or checkpoint / certification engines.
  return {
    attempt: await getFormativeAttempt(params.userId, params.exerciseId),
    result: scored,
  };
}

export async function restartFormativeExercise(userId: number, exerciseId: FormativeExerciseId) {
  const db = await getDb();
  if (!db) {
    throw Object.assign(new Error("Database unavailable"), { code: "INTERNAL_SERVER_ERROR" });
  }
  const { formativeExerciseAttempts } = await import("../drizzle/schema");
  const attempt = await getFormativeAttempt(userId, exerciseId);
  if (!attempt) {
    return startOrResumeFormativeExercise(userId, exerciseId);
  }

  await db
    .update(formativeExerciseAttempts)
    .set({
      answers: {},
      formativeScore: null,
      feedbackJson: null,
      status: "in_progress",
      startedAt: new Date(),
      completedAt: null,
      ...isolationDefaults(),
    })
    .where(
      and(
        eq(formativeExerciseAttempts.id, attempt.id),
        eq(formativeExerciseAttempts.userId, userId),
      ),
    );

  return getFormativeAttempt(userId, exerciseId);
}

function sanitizeAttempt(row: {
  id: number;
  userId: number;
  exerciseId: string;
  moduleId: number;
  version: number;
  answers: unknown;
  formativeScore: number | null;
  status: FormativeExerciseStatus;
  feedbackJson: unknown;
  countsTowardMissionCount: boolean;
  countsTowardScenarioAverage: boolean;
  countsTowardCertificate: boolean;
  countsTowardAssessment: boolean;
  countsTowardCheckpoint: boolean;
  startedAt: Date | null;
  completedAt: Date | null;
  lastUpdatedAt: Date;
}) {
  return {
    id: row.id,
    userId: row.userId,
    exerciseId: row.exerciseId,
    moduleId: row.moduleId,
    version: row.version,
    answers: (row.answers ?? {}) as Record<string, unknown>,
    formativeScore: row.formativeScore,
    status: row.status,
    feedbackJson: row.feedbackJson,
    isolation: {
      countsTowardMissionCount: row.countsTowardMissionCount,
      countsTowardScenarioAverage: row.countsTowardScenarioAverage,
      countsTowardCertificate: row.countsTowardCertificate,
      countsTowardAssessment: row.countsTowardAssessment,
      countsTowardCheckpoint: row.countsTowardCheckpoint,
    },
    startedAt: row.startedAt,
    completedAt: row.completedAt,
    lastUpdatedAt: row.lastUpdatedAt,
  };
}

export type ProfessorFormativeRow = {
  studentUserId: number;
  studentName: string | null;
  studentEmail: string | null;
  studentNumber: string | null;
  cohortId: number;
  moduleId: 4 | 5;
  exerciseId: FormativeExerciseId;
  exerciseTitleFr: string;
  exerciseTitleEn: string;
  status: TeacherFormativeStatus;
  attemptStatus: FormativeExerciseStatus | null;
  /** True when an active formative row exists (not a multi-attempt history count). */
  hasRecord: boolean;
  correctAnswers: number;
  incorrectAnswers: number;
  submittedAnswers: number;
  correctAnswerRate: number | null;
  formativeScore: number | null;
  startedAt: Date | null;
  completedAt: Date | null;
  lastUpdatedAt: Date | null;
  isolation: typeof FORMATIVE_ISOLATION_FLAGS;
};

/**
 * Cohort roster × exercises — students without attempts appear as Non commencé.
 * Model stores one active row per user/exercise/version (restart overwrites; no history).
 */
export async function listProfessorFormativeRoster(params: {
  cohortId: number;
  studentUserIds: number[];
  moduleId?: 4 | 5;
  exerciseId?: FormativeExerciseId;
}): Promise<{
  rows: ProfessorFormativeRow[];
  summary: {
    enrolled: number;
    started: number;
    completed: number;
    participationRate: number | null;
    completionRate: number | null;
    correctAnswers: number;
    submittedAnswers: number;
    correctAnswerRate: number | null;
  };
  tableAvailable: boolean;
}> {
  const exerciseIds = (params.exerciseId
    ? [params.exerciseId]
    : [...FORMATIVE_EXERCISE_IDS]
  ).filter((id) => {
    const meta = FORMATIVE_EXERCISE_CATALOG[id];
    return params.moduleId ? meta.moduleId === params.moduleId : true;
  }) as FormativeExerciseId[];

  const students = await listStudents({ cohortId: params.cohortId });
  const scopedStudents = students.filter((s) => params.studentUserIds.includes(s.id));

  let attempts: Array<ReturnType<typeof sanitizeAttempt>> = [];
  let tableAvailable = true;
  const db = await getDb();
  if (db && scopedStudents.length > 0) {
    try {
      const { formativeExerciseAttempts } = await import("../drizzle/schema");
      const userIds = scopedStudents.map((s) => s.id);
      const rows = await db
        .select()
        .from(formativeExerciseAttempts)
        .where(
          and(
            inArray(formativeExerciseAttempts.userId, userIds),
            inArray(formativeExerciseAttempts.exerciseId, exerciseIds),
            eq(formativeExerciseAttempts.version, CURRENT_VERSION),
          ),
        );
      attempts = rows.map(sanitizeAttempt);
    } catch {
      // Table may be missing when migration 0019 is not applied yet
      tableAvailable = false;
      attempts = [];
    }
  } else if (!db) {
    tableAvailable = false;
  }

  const attemptKey = (userId: number, exerciseId: string) => `${userId}::${exerciseId}`;
  const attemptMap = new Map(attempts.map((a) => [attemptKey(a.userId, a.exerciseId), a]));

  const rows: ProfessorFormativeRow[] = [];
  for (const student of scopedStudents) {
    for (const exerciseId of exerciseIds) {
      const meta = getFormativeExerciseMeta(exerciseId);
      const attempt = attemptMap.get(attemptKey(student.id, exerciseId));
      const counts = countFeedbackAnswers(attempt?.feedbackJson);
      const teacherStatus = deriveTeacherFormativeStatus(attempt?.status ?? null);
      rows.push({
        studentUserId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        studentNumber: student.studentNumber ?? null,
        cohortId: params.cohortId,
        moduleId: meta.moduleId,
        exerciseId,
        exerciseTitleFr: meta.title.fr,
        exerciseTitleEn: meta.title.en,
        status: teacherStatus,
        attemptStatus: attempt?.status ?? null,
        hasRecord: Boolean(attempt),
        correctAnswers: counts.correct,
        incorrectAnswers: counts.incorrect,
        submittedAnswers: counts.submitted,
        correctAnswerRate: correctAnswerRate(counts.correct, counts.submitted),
        formativeScore: attempt?.formativeScore ?? null,
        startedAt: attempt?.startedAt ?? null,
        completedAt: attempt?.completedAt ?? null,
        lastUpdatedAt: attempt?.lastUpdatedAt ?? null,
        isolation: { ...FORMATIVE_ISOLATION_FLAGS },
      });
    }
  }

  const enrolledPairs = scopedStudents.length * exerciseIds.length;
  const started = rows.filter((r) => r.hasRecord).length;
  const completed = rows.filter((r) => r.attemptStatus === "completed").length;
  const correctAnswers = rows.reduce((s, r) => s + r.correctAnswers, 0);
  const submittedAnswers = rows.reduce((s, r) => s + r.submittedAnswers, 0);

  return {
    rows,
    summary: {
      enrolled: enrolledPairs,
      started,
      completed,
      participationRate: participationRate(started, enrolledPairs),
      completionRate: completionRate(completed, enrolledPairs),
      correctAnswers,
      submittedAnswers,
      correctAnswerRate: correctAnswerRate(correctAnswers, submittedAnswers),
    },
    tableAvailable,
  };
}
