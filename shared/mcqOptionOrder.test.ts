import { describe, expect, it } from "vitest";
import {
  applyOptionIdOrder,
  balancedCorrectSlots,
  buildMcqDisplayOrder,
  correctLetterDistribution,
  isCompleteOptionOrder,
  layoutParallelOptions,
  orderOptionsWithCorrectAt,
  quizAttemptSeed,
} from "./mcqOptionOrder";

const BANK = [
  { id: "q1", optionIds: ["a", "b", "c", "d"], correctId: "b" },
  { id: "q2", optionIds: ["a", "b", "c", "d"], correctId: "b" },
  { id: "q3", optionIds: ["a", "b", "c", "d"], correctId: "b" },
  { id: "q4", optionIds: ["a", "b", "c", "d"], correctId: "b" },
];

describe("mcq option order — position bias fix", () => {
  it("keeps exactly one correct option and never marks distractors correct", () => {
    const order = buildMcqDisplayOrder({ questions: BANK, seed: "s1" });
    for (const q of BANK) {
      const ids = order[q.id]!;
      expect(ids.filter((id) => id === q.correctId)).toHaveLength(1);
      expect(ids.filter((id) => id !== q.correctId)).toHaveLength(3);
    }
  });

  it("moves the correct option off a fixed catalog letter", () => {
    const order = buildMcqDisplayOrder({ questions: BANK, seed: "s-move" });
    const positions = BANK.map((q) => order[q.id]!.indexOf(q.correctId));
    expect(new Set(positions).size).toBeGreaterThan(1);
  });

  it("is stable for the same attempt seed", () => {
    const a = buildMcqDisplayOrder({ questions: BANK, seed: quizAttemptSeed({ quizId: 1, userId: 9, attemptNumber: 2 }) });
    const b = buildMcqDisplayOrder({ questions: BANK, seed: quizAttemptSeed({ quizId: 1, userId: 9, attemptNumber: 2 }) });
    expect(a).toEqual(b);
  });

  it("may reshuffle on a new attempt number", () => {
    const a = buildMcqDisplayOrder({ questions: BANK, seed: quizAttemptSeed({ quizId: 1, userId: 9, attemptNumber: 1 }) });
    const b = buildMcqDisplayOrder({ questions: BANK, seed: quizAttemptSeed({ quizId: 1, userId: 9, attemptNumber: 2 }) });
    expect(a).not.toEqual(b);
  });

  it("distributes correct letters instead of concentrating on B", () => {
    const order = buildMcqDisplayOrder({ questions: BANK, seed: "balance-seed" });
    const dist = correctLetterDistribution(BANK, order);
    const values = Object.values(dist);
    expect(Math.max(...values)).toBeLessThanOrEqual(2);
    expect(dist.B ?? 0).toBeLessThan(4);
  });

  it("scores by option id after shuffle", () => {
    const ordered = orderOptionsWithCorrectAt(["a", "b", "c", "d"], "b", 3, "rest");
    expect(ordered[3]).toBe("b");
    expect(ordered.filter((id) => id === "b")).toHaveLength(1);
  });

  it("preserves a complete persisted order and rejects incomplete ones", () => {
    expect(isCompleteOptionOrder(["a", "b", "c", "d"], ["d", "a", "c", "b"])).toBe(true);
    expect(isCompleteOptionOrder(["a", "b", "c", "d"], ["a", "b"])).toBe(false);
  });

  it("applies parallel FR/EN arrays to the shuffled ids", () => {
    const laid = layoutParallelOptions({
      optionIds: ["a", "b", "c", "d"],
      optionsFr: ["Fa", "Fb", "Fc", "Fd"],
      optionsEn: ["Ea", "Eb", "Ec", "Ed"],
      orderedIds: ["c", "a", "d", "b"],
    });
    expect(laid.optionIds).toEqual(["c", "a", "d", "b"]);
    expect(laid.optionsFr).toEqual(["Fc", "Fa", "Fd", "Fb"]);
    expect(laid.optionsEn[3]).toBe("Eb");
  });

  it("applyOptionIdOrder keeps unknown options from disappearing", () => {
    const opts = applyOptionIdOrder(
      [{ id: "a", label: "A" }, { id: "b", label: "B" }],
      ["b"],
    );
    expect(opts.map((o) => o.id)).toEqual(["b", "a"]);
  });

  it("does not emit a sequential A-B-C-D slot pattern", () => {
    const slots = balancedCorrectSlots(8, 4, "no-loop");
    expect(slots).not.toEqual([0, 1, 2, 3, 0, 1, 2, 3]);
  });
});
