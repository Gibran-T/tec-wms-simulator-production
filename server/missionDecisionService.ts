import { and, desc, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getDb, getRunById, getScenarioById, addScoringEvent, listStudents } from "./db";
import { resolveScenarioScnCode } from "./canonicalScenarios";
import {
  getM1M3DecisionOption,
  getM1M3DecisionQuestion,
  m1m3DecisionPenalty,
  m1m3DecisionPenaltyEventType,
  normalizeDecisionStep,
} from "../shared/m1m3DecisionSelectors";

export async function submitMissionDecision(args: {
  userId: number;
  role: string;
  runId: number;
  step: string;
  optionId: string;
  responseMs?: number;
  isEn: boolean;
}) {
  const run = await getRunById(args.runId);
  if (!run) throw new TRPCError({ code: "NOT_FOUND", message: "Run introuvable" });
  if (run.userId !== args.userId && args.role !== "teacher" && args.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  const scenario = await getScenarioById(run.scenarioId);
  const scnCode = resolveScenarioScnCode(scenario);
  const step = normalizeDecisionStep(args.step);
  const question = getM1M3DecisionQuestion(scnCode, step);
  if (!question) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: args.isEn ? "No decision question for this step." : "Aucune question de décision pour cette étape.",
    });
  }
  const option = getM1M3DecisionOption(scnCode, step, args.optionId);
  if (!option) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: args.isEn ? "Unknown option." : "Option inconnue.",
    });
  }

  const isDemo = !!run.isDemo;
  const penalty = option.isCorrect ? 0 : m1m3DecisionPenalty(isDemo);
  const why = option.isCorrect
    ? (args.isEn ? option.whyRight?.en : option.whyRight?.fr)
    : (args.isEn ? option.whyWrong?.en : option.whyWrong?.fr);
  const whyPair = option.isCorrect ? option.whyRight : option.whyWrong;

  if (!option.isCorrect && !isDemo) {
    await addScoringEvent({
      runId: args.runId,
      eventType: m1m3DecisionPenaltyEventType(step),
      pointsDelta: penalty,
      message: why ?? "Incorrect operational decision",
    });
  } else if (!option.isCorrect && isDemo && penalty !== 0) {
    await addScoringEvent({
      runId: args.runId,
      eventType: m1m3DecisionPenaltyEventType(step),
      pointsDelta: penalty,
      message: why ?? "Incorrect operational decision (demo)",
    });
  }

  const db = await getDb();
  if (db) {
    try {
      const { missionDecisionResponses } = await import("../drizzle/schema");
      await db.insert(missionDecisionResponses).values({
        userId: run.userId,
        runId: args.runId,
        moduleId: scenario?.moduleId ?? 1,
        scnCode: scnCode || "UNKNOWN",
        stepCode: step,
        questionId: `${scnCode || "UNKNOWN"}::${step}`,
        optionId: option.id,
        correctOptionId: question.options.find((o) => o.isCorrect)!.id,
        isCorrect: option.isCorrect,
        pointsDelta: penalty,
        responseMs: args.responseMs ?? null,
        submitMode: isDemo ? "FORMATIVE" : "OFFICIAL",
        errorType: option.isCorrect ? undefined : question.errorType.fr,
        competence: question.competence.fr,
      });
    } catch {
      // Table may be missing until migration 0021 is applied.
    }
  }

  return {
    isCorrect: option.isCorrect,
    unlocked: option.isCorrect,
    pointsDelta: penalty,
    submitMode: isDemo ? "FORMATIVE" : "OFFICIAL",
    why: why ?? "",
    whyPair: whyPair ?? null,
    correctOptionId: question.options.find((o) => o.isCorrect)!.id,
    competence: question.competence,
  };
}

export async function getMissionDecisionState(runId: number, step: string) {
  const st = normalizeDecisionStep(step);
  const db = await getDb();
  if (!db) return { unlocked: true, attempts: 0, tableAvailable: false };
  try {
    const { missionDecisionResponses } = await import("../drizzle/schema");
    const rows = await db
      .select()
      .from(missionDecisionResponses)
      .where(
        and(eq(missionDecisionResponses.runId, runId), eq(missionDecisionResponses.stepCode, st)),
      )
      .orderBy(desc(missionDecisionResponses.createdAt));
    return {
      unlocked: rows.some((r) => r.isCorrect),
      attempts: rows.length,
      lastOptionId: rows[0]?.optionId ?? null,
      lastCorrect: rows[0]?.isCorrect ?? null,
      tableAvailable: true,
    };
  } catch {
    // Missing table must not block mission execution (UI gate skipped).
    return { unlocked: true, attempts: 0, tableAvailable: false };
  }
}

export async function listProfessorMissionDecisions(params: {
  cohortId: number;
  studentUserIds: number[];
  moduleId?: number;
}) {
  const students = await listStudents({ cohortId: params.cohortId });
  const scoped = students.filter((s) => params.studentUserIds.includes(s.id));
  const db = await getDb();
  let rows: Array<{
    studentUserId: number;
    studentName: string | null;
    moduleId: number;
    scnCode: string;
    stepCode: string;
    optionId: string;
    correctOptionId: string;
    isCorrect: boolean;
    pointsDelta: number;
    errorType: string | null;
    competence: string | null;
    createdAt: Date;
  }> = [];
  let tableAvailable = true;
  if (db && scoped.length) {
    try {
      const { missionDecisionResponses } = await import("../drizzle/schema");
      const data = await db
        .select()
        .from(missionDecisionResponses)
        .where(inArray(missionDecisionResponses.userId, scoped.map((s) => s.id)));
      const nameById = new Map(scoped.map((s) => [s.id, s.name]));
      rows = data
        .filter((r) => (params.moduleId ? r.moduleId === params.moduleId : true))
        .map((r) => ({
          studentUserId: r.userId,
          studentName: nameById.get(r.userId) ?? null,
          moduleId: r.moduleId,
          scnCode: r.scnCode,
          stepCode: r.stepCode,
          optionId: r.optionId,
          correctOptionId: r.correctOptionId,
          isCorrect: r.isCorrect,
          pointsDelta: r.pointsDelta,
          errorType: r.errorType,
          competence: r.competence,
          createdAt: r.createdAt,
        }));
    } catch {
      tableAvailable = false;
    }
  } else if (!db) {
    tableAvailable = false;
  }

  const hotspotMap = new Map<string, { wrong: number; total: number; chosen: Map<string, number> }>();
  for (const r of rows) {
    const key = `${r.scnCode}:${r.stepCode}`;
    const h = hotspotMap.get(key) ?? { wrong: 0, total: 0, chosen: new Map() };
    h.total += 1;
    if (!r.isCorrect) {
      h.wrong += 1;
      h.chosen.set(r.optionId, (h.chosen.get(r.optionId) ?? 0) + 1);
    }
    hotspotMap.set(key, h);
  }
  const hotspots = Array.from(hotspotMap.entries())
    .map(([key, h]) => {
      let most = "";
      let max = 0;
      for (const [id, n] of h.chosen) {
        if (n > max) {
          max = n;
          most = id;
        }
      }
      return {
        question: key,
        errorRate: h.total ? Math.round((h.wrong / h.total) * 1000) / 10 : 0,
        mostChosenWrong: most || null,
        incorrect: h.wrong,
        submitted: h.total,
      };
    })
    .sort((a, b) => b.errorRate - a.errorRate);

  return { rows, hotspots, tableAvailable };
}
