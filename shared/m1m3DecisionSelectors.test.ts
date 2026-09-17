import { describe, expect, it } from "vitest";
import {
  getM1M3DecisionQuestion,
  listM1M3DecisionQuestions,
  m1m3DecisionPenalty,
  normalizeDecisionStep,
} from "./m1m3DecisionSelectors";

describe("M1–M3 in-mission decisions", () => {
  it("covers eleven SCN×step questions with exactly one correct option", () => {
    const all = listM1M3DecisionQuestions();
    expect(all).toHaveLength(11);
    for (const q of all) {
      expect(q.options.filter((o) => o.isCorrect)).toHaveLength(1);
      expect(q.options.length).toBeGreaterThanOrEqual(4);
      expect(q.options.length).toBeLessThanOrEqual(5);
    }
  });

  it("aliases PUTAWAY_M1 to PUTAWAY and uses reduced demo penalty", () => {
    expect(normalizeDecisionStep("putaway_m1")).toBe("PUTAWAY");
    expect(getM1M3DecisionQuestion("SCN-006", "putaway_m1")).toBeTruthy();
    expect(m1m3DecisionPenalty(true)).toBe(-2);
    expect(m1m3DecisionPenalty(false)).toBe(-5);
  });
});
