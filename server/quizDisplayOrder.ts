import {
  buildMcqDisplayOrder,
  layoutParallelOptions,
  quizAttemptSeed,
} from "../shared/mcqOptionOrder";

type QuizQ = {
  id: number;
  optionsFr: unknown;
  optionsEn: unknown;
  optionsPayload?: unknown;
  correctOptionId?: string | null;
  correctIndex: number;
};

function parseArr(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
}

export function materializeQuizQuestionOptions(q: QuizQ): {
  optionIds: string[];
  optionsFr: string[];
  optionsEn: string[];
  correctId: string;
} {
  let optionsFr = parseArr(q.optionsFr);
  let optionsEn = parseArr(q.optionsEn);
  let optionIds = optionsFr.map((_, i) => `legacy_${q.id}_${i}`);
  const payload = q.optionsPayload as Array<{ id: string; fr: string; en: string }> | null;
  if (payload && Array.isArray(payload) && payload.length) {
    optionsFr = payload.map((o) => o.fr);
    optionsEn = payload.map((o) => o.en);
    optionIds = payload.map((o) => o.id);
  }
  const correctId = q.correctOptionId ?? optionIds[q.correctIndex] ?? optionIds[0] ?? "";
  return { optionIds, optionsFr, optionsEn, correctId };
}

export function orderQuizQuestionsForAttempt(args: {
  quizId: number;
  userId: number;
  attemptNumber: number;
  questions: QuizQ[];
}) {
  const seed = quizAttemptSeed({
    quizId: args.quizId,
    userId: args.userId,
    attemptNumber: args.attemptNumber,
  });
  const materialized = args.questions.map((q) => ({ q, mat: materializeQuizQuestionOptions(q) }));
  const order = buildMcqDisplayOrder({
    questions: materialized.map(({ q, mat }) => ({
      id: String(q.id),
      optionIds: mat.optionIds,
      correctId: mat.correctId,
    })),
    seed,
  });
  return materialized.map(({ q, mat }) => {
    const orderedIds = order[String(q.id)] ?? mat.optionIds;
    const laid = layoutParallelOptions({
      optionIds: mat.optionIds,
      optionsFr: mat.optionsFr,
      optionsEn: mat.optionsEn,
      orderedIds,
    });
    return {
      questionId: q.id,
      correctId: mat.correctId,
      orderedIds: laid.optionIds,
      optionsFr: laid.optionsFr,
      optionsEn: laid.optionsEn,
    };
  });
}
