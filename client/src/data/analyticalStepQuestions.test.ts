import { describe, expect, it } from "vitest";
import {
  ANALYTICAL_ANSWER_STEPS,
  getAnalyticalQuestionText,
  getM5DecisionStepTitle,
  getStepChromeCodeLabel,
  getStepSubmitLabel,
  isAnalyticalAnswerStep,
  isM4AnalyticalStep,
  questionContainsAnswerLeakage,
} from "./analyticalStepQuestions";

describe("analyticalStepQuestions — Slice B", () => {
  it("identifies M4 and M5 analytical answer steps", () => {
    expect(ANALYTICAL_ANSWER_STEPS.has("kpi_rotation")).toBe(true);
    expect(isAnalyticalAnswerStep("m5_reception")).toBe(false);
  });

  it("M4 analytical chrome is module-4 conditional only", () => {
    expect(isM4AnalyticalStep("kpi_rotation", 4)).toBe(true);
    expect(isM4AnalyticalStep("kpi_data", 4)).toBe(true);
    expect(isM4AnalyticalStep("kpi_rotation", 1)).toBe(false);
    expect(isM4AnalyticalStep("m5_reception", 5)).toBe(false);
    expect(isM4AnalyticalStep("po", 1)).toBe(false);
  });

  it("uses analytical labels for M4 and transaction labels for M1", () => {
    expect(getStepChromeCodeLabel(4, "kpi_rotation", "FR")).toBe("Référence analytique");
    expect(getStepChromeCodeLabel(1, "po", "FR")).toBe("Code Transaction");
    expect(getStepSubmitLabel(4, "kpi_diagnostic", "FR")).toBe("Valider l'analyse");
    expect(getStepSubmitLabel(2, "putaway", "FR")).toBe("Valider la transaction");
  });

  it("SCN-015/016 tactical titles vs SCN-017 strategic", () => {
    expect(getM5DecisionStepTitle("SCN-015", false).fr).toBe("Décision tactique");
    expect(getM5DecisionStepTitle("SCN-016", false).fr).toContain("réconciliation");
    expect(getM5DecisionStepTitle("SCN-017", true).fr).toBe("Décision stratégique");
    expect(getM5DecisionStepTitle("SCN-015", false).fr).not.toContain("stratégique");
  });

  it("questions do not leak completed calculation or classification", () => {
    for (const scn of ["SCN-012", "SCN-013", "SCN-014"] as const) {
      for (const step of ["kpi_rotation", "kpi_service", "kpi_diagnostic"] as const) {
        const text = getAnalyticalQuestionText(step, scn, "FR", false);
        expect(questionContainsAnswerLeakage(text), `${scn}/${step}: ${text}`).toBe(false);
      }
    }
  });

  it("questions still show necessary raw data", () => {
    const rot = getAnalyticalQuestionText("kpi_rotation", "SCN-012", "FR", false);
    expect(rot).toMatch(/2\s*400|2400/);
    expect(rot).toContain("400");
    expect(rot.toLowerCase()).toMatch(/calcul/);

    const svc013 = getAnalyticalQuestionText("kpi_service", "SCN-013", "FR", false);
    expect(svc013).toContain("285");
    expect(svc013).toContain("300");
    expect(svc013).toContain("12");

    const diag014 = getAnalyticalQuestionText("kpi_diagnostic", "SCN-014", "FR", false);
    expect(diag014).toContain("S&OP");
    expect(diag014.toLowerCase()).toMatch(/priorit|compromis|r[eé]valu/);
  });

  it("SCN-015 allows Q=0 / no forced corrective initiative", () => {
    const text = getAnalyticalQuestionText("m5_decision", "SCN-015", "FR", false);
    expect(text).toContain("Q = 0");
    expect(text.toLowerCase()).not.toContain("formation");
    expect(text.toLowerCase()).toMatch(/conforme|r[eé]appro|surveill/);
  });

  it("SCN-016 reinforces reconcile-first", () => {
    const text = getAnalyticalQuestionText("m5_decision", "SCN-016", "FR", false);
    expect(text.toLowerCase()).toMatch(/r[eé]concil/);
  });

  it("SCN-017 asks for snapshot KPIs, priority, trade-off, horizon", () => {
    const text = getAnalyticalQuestionText("m5_decision", "SCN-017", "FR", true);
    expect(text).toMatch(/snapshot|session/i);
    expect(text.toLowerCase()).toMatch(/compromis|trade/);
    expect(text).toMatch(/90/);
  });

  it("legacy leakage patterns are detected by helper", () => {
    expect(questionContainsAnswerLeakage("Taux = 2400/400 = 6. Analysez")).toBe(true);
    expect(questionContainsAnswerLeakage("rotation 6 (normal), service 95% (excellent)")).toBe(true);
  });
});
