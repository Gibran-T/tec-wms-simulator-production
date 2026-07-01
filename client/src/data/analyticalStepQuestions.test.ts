import { describe, expect, it } from "vitest";
import {
  ANALYTICAL_ANSWER_STEPS,
  getAnalyticalQuestionText,
  isAnalyticalAnswerStep,
} from "./analyticalStepQuestions";

describe("analyticalStepQuestions", () => {
  it("identifies M4 and M5 analytical answer steps", () => {
    expect(ANALYTICAL_ANSWER_STEPS.has("kpi_rotation")).toBe(true);
    expect(ANALYTICAL_ANSWER_STEPS.has("kpi_service")).toBe(true);
    expect(ANALYTICAL_ANSWER_STEPS.has("kpi_diagnostic")).toBe(true);
    expect(ANALYTICAL_ANSWER_STEPS.has("m5_decision")).toBe(true);
    expect(isAnalyticalAnswerStep("m5_reception")).toBe(false);
  });

  it("uses SCN-013 service question with error correlation (official guide)", () => {
    const text = getAnalyticalQuestionText("kpi_service", "SCN-013", "FR", false);
    expect(text).toContain("4,0 %");
    expect(text).toContain("J-90");
    expect(text).toContain("OTIF");
  });

  it("uses SCN-014 diagnostic with lead time (official guide)", () => {
    const text = getAnalyticalQuestionText("kpi_diagnostic", "SCN-014", "FR", false);
    expect(text).toContain("3,5 j");
    expect(text).toContain("S&OP");
    expect(text).toContain("trade-off");
  });

  it("uses tactical M5 decision wording for non-strategic runs", () => {
    const text = getAnalyticalQuestionText("m5_decision", "SCN-015", "FR", false);
    expect(text).toContain("tactique");
    expect(text).not.toContain("stratégique");
  });

  it("uses strategic M5 decision wording for SCN-017", () => {
    const text = getAnalyticalQuestionText("m5_decision", "SCN-017", "FR", true);
    expect(text).toContain("stratégique");
    expect(text).toContain("90–180");
  });

  it("falls back to default rotation question for SCN-012", () => {
    const text = getAnalyticalQuestionText("kpi_rotation", "SCN-012", "FR", false);
    expect(text).toContain("2400/400 = 6");
  });
});
