import { describe, expect, it } from "vitest";
import {
  EVAL_CLOTURE_DURATION_MINUTES,
  EVAL_CLOTURE_PASSING_SCORE,
  EVAL_CLOTURE_QUESTIONS,
  EVAL_CLOTURE_TOTAL_POINTS,
  countCorrectPositionDistribution,
  uniqueLongestCorrectRatio,
} from "./evalClotureQuestionBank";

describe("Eval clôture question bank", () => {
  it("has 20 questions totaling 100 points with 50 min / pass 70", () => {
    expect(EVAL_CLOTURE_QUESTIONS).toHaveLength(20);
    expect(EVAL_CLOTURE_QUESTIONS.reduce((s, q) => s + q.points, 0)).toBe(
      EVAL_CLOTURE_TOTAL_POINTS,
    );
    expect(EVAL_CLOTURE_DURATION_MINUTES).toBe(50);
    expect(EVAL_CLOTURE_PASSING_SCORE).toBe(70);
  });

  it("balances correct option ids o1–o4", () => {
    const dist = countCorrectPositionDistribution(EVAL_CLOTURE_QUESTIONS);
    const values = Object.values(dist);
    expect(dist).toEqual({ o1: 5, o2: 5, o3: 5, o4: 5 });
    expect(Math.max(...values) - Math.min(...values)).toBe(0);
  });

  it("covers five axes with four items each", () => {
    const byAxis = EVAL_CLOTURE_QUESTIONS.reduce(
      (acc, q) => {
        acc[q.axisCode] = (acc[q.axisCode] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    expect(byAxis).toEqual({
      FLUX: 4,
      EXACT: 4,
      CAPA: 4,
      KPI: 4,
      DEC: 4,
    });
  });

  it("covers all cognitive layers", () => {
    const layers = new Set(EVAL_CLOTURE_QUESTIONS.map((q) => q.cognitiveLayer));
    expect(layers).toEqual(
      new Set([
        "preuve",
        "verification",
        "interpretation",
        "decision",
        "connexion",
        "suivi",
      ]),
    );
  });

  it("avoids unique-longest-correct FR cue (≤ 35%)", () => {
    const ratio = uniqueLongestCorrectRatio(EVAL_CLOTURE_QUESTIONS);
    expect(ratio).toBeLessThanOrEqual(0.35);
  });

  it("has stable codes EF-Q01..EF-Q20 and no SCN references in prompts", () => {
    const codes = EVAL_CLOTURE_QUESTIONS.map((q) => q.code);
    expect(codes).toEqual(
      Array.from({ length: 20 }, (_, i) => `EF-Q${String(i + 1).padStart(2, "0")}`),
    );
    for (const q of EVAL_CLOTURE_QUESTIONS) {
      expect(q.promptFr).not.toMatch(/SCN-\d+/i);
      expect(q.promptEn).not.toMatch(/SCN-\d+/i);
    }
  });
});
