import { describe, expect, it } from "vitest";
import {
  getM4CognitiveOption,
  listM4CognitiveQuestions,
  M4_COGNITIVE_WRONG_PENALTY,
} from "../shared/m4CognitiveSelectors";
import { calculateKpis, scoreKpiInterpretation, CANONICAL_M4_KPI_DATA } from "./rulesEngine";

const kpi = calculateKpis(CANONICAL_M4_KPI_DATA);

describe("m4CognitiveSelectors — scorer alignment", () => {
  it("exposes 9 questions with one correct option each", () => {
    const all = listM4CognitiveQuestions();
    expect(all).toHaveLength(9);
    for (const q of all) {
      expect(q.options).toHaveLength(5);
      expect(q.options.filter((o) => o.isCorrect)).toHaveLength(1);
      expect(q.options.filter((o) => !o.isCorrect).every((o) => !!o.whyWrong)).toBe(true);
    }
  });

  it("correct answerTexts pass scoreKpiInterpretation", () => {
    const map: Record<string, "rotationRate" | "serviceLevel" | "diagnostic"> = {
      KPI_ROTATION: "rotationRate",
      KPI_SERVICE: "serviceLevel",
      KPI_DIAGNOSTIC: "diagnostic",
    };
    for (const q of listM4CognitiveQuestions()) {
      const correct = q.options.find((o) => o.isCorrect)!;
      const scored = scoreKpiInterpretation(map[q.step], correct.answerText, kpi, q.scnCode);
      expect(scored.isCorrect, `${q.scnCode} ${q.step}`).toBe(true);
    }
  });

  it("resolves options and keeps −5 penalty", () => {
    expect(getM4CognitiveOption("SCN-012", "KPI_ROTATION", "scn012-rot-b")?.isCorrect).toBe(true);
    expect(M4_COGNITIVE_WRONG_PENALTY).toBe(-5);
  });
});
