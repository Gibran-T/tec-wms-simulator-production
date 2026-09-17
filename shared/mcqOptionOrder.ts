/**
 * Stable, balanced MCQ option order for quizzes and formative Pré/Pós.
 * Scoring is always by option ID — displayed letter is a presentation concern.
 * Do not use this helper for Eval 1 / Eval 2 (those keep assessmentCore.seededShuffle).
 */
import { seededShuffle } from "./assessmentCore";

export type McqOrderQuestion = {
  id: string;
  optionIds: string[];
  correctId: string;
};

/** Seed for one in-progress quiz sitting (stable until a new attempt is recorded). */
export function quizAttemptSeed(args: {
  quizId: number;
  userId: number;
  attemptNumber: number;
}): string {
  return `quiz-${args.quizId}-u${args.userId}-n${args.attemptNumber}`;
}

export function formativeAttemptSeed(args: {
  userId: number;
  exerciseId: string;
  startedAtMs: number;
}): string {
  return `formative-${args.userId}-${args.exerciseId}-t${args.startedAtMs}`;
}

/**
 * Balanced target indices for the correct option across a set.
 * Uses each slot as evenly as possible, then shuffles the slot list so the
 * sequence is not a predictable A-B-C-D loop.
 */
export function balancedCorrectSlots(
  questionCount: number,
  optionCount: number,
  seed: string,
): number[] {
  const nOpts = Math.max(1, optionCount);
  const slots: number[] = [];
  for (let i = 0; i < questionCount; i++) slots.push(i % nOpts);
  if (slots.length <= 1) return slots;
  return seededShuffle(slots, `${seed}::slots`);
}

export function orderOptionsWithCorrectAt(
  optionIds: string[],
  correctId: string,
  targetIndex: number,
  restSeed: string,
): string[] {
  const unique = Array.from(new Set(optionIds));
  if (!unique.includes(correctId)) {
    throw new Error(`correctId ${correctId} not in optionIds`);
  }
  const rest = seededShuffle(
    unique.filter((id) => id !== correctId),
    restSeed,
  );
  const idx = Math.max(0, Math.min(targetIndex, rest.length));
  const out = [...rest];
  out.splice(idx, 0, correctId);
  return out;
}

/** Build a persisted display order map — one array of option IDs per question. */
export function buildMcqDisplayOrder(args: {
  questions: McqOrderQuestion[];
  seed: string;
}): Record<string, string[]> {
  const optionCount = Math.max(1, ...args.questions.map((q) => q.optionIds.length), 1);
  const slots = balancedCorrectSlots(args.questions.length, optionCount, args.seed);
  const order: Record<string, string[]> = {};
  args.questions.forEach((q, i) => {
    const target = slots[i] ?? 0;
    const clamped = q.optionIds.length ? target % q.optionIds.length : 0;
    order[q.id] = orderOptionsWithCorrectAt(
      q.optionIds,
      q.correctId,
      clamped,
      `${args.seed}::${q.id}::rest`,
    );
  });
  return order;
}

export function applyOptionIdOrder<T extends { id: string }>(
  options: readonly T[],
  orderedIds: string[] | undefined,
): T[] {
  if (!orderedIds?.length) return [...options];
  const map = new Map(options.map((o) => [o.id, o]));
  const ordered = orderedIds.map((id) => map.get(id)).filter((o): o is T => !!o);
  for (const o of options) {
    if (!ordered.some((x) => x.id === o.id)) ordered.push(o);
  }
  return ordered;
}

export function letterForIndex(index: number): string {
  return String.fromCharCode(65 + index);
}

export function correctLetterDistribution(
  questions: McqOrderQuestion[],
  order: Record<string, string[]>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const q of questions) {
    const ids = order[q.id] ?? q.optionIds;
    const idx = ids.indexOf(q.correctId);
    const letter = idx >= 0 ? letterForIndex(idx) : "?";
    counts[letter] = (counts[letter] ?? 0) + 1;
  }
  return counts;
}

export function isCompleteOptionOrder(
  expectedIds: readonly string[],
  order: unknown,
): order is string[] {
  if (!Array.isArray(order)) return false;
  if (order.length !== expectedIds.length) return false;
  if (!order.every((id) => typeof id === "string")) return false;
  if (new Set(order).size !== order.length) return false;
  const expected = new Set(expectedIds);
  return order.every((id) => expected.has(id)) && expectedIds.every((id) => order.includes(id));
}

export function layoutParallelOptions(args: {
  optionIds: string[];
  optionsFr: string[];
  optionsEn: string[];
  orderedIds: string[];
}): { optionIds: string[]; optionsFr: string[]; optionsEn: string[] } {
  const idx = new Map(args.optionIds.map((id, i) => [id, i]));
  const optionIds: string[] = [];
  const optionsFr: string[] = [];
  const optionsEn: string[] = [];
  for (const id of args.orderedIds) {
    const i = idx.get(id);
    if (i == null) continue;
    optionIds.push(args.optionIds[i]!);
    optionsFr.push(args.optionsFr[i] ?? "");
    optionsEn.push(args.optionsEn[i] ?? "");
  }
  return { optionIds, optionsFr, optionsEn };
}
