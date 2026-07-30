import { describe, expect, it } from "vitest";
import {
  getAnalyticalQuestionText,
  getM5DecisionStepTitle,
  getM5ResponseGuidance,
  getStepChromeCodeLabel,
  getStepSubmitLabel,
  isM4AnalyticalStep,
  isM5AnalyticalStep,
  questionContainsAnswerLeakage,
} from "./analyticalStepQuestions";

describe("analyticalStepQuestions — M5 run-to-decision", () => {
  it("M5 analytical steps are module-5 conditional", () => {
    expect(isM5AnalyticalStep("m5_decision", 5)).toBe(true);
    expect(isM5AnalyticalStep("m5_kpi", 5)).toBe(true);
    expect(isM5AnalyticalStep("m5_reception", 5)).toBe(false);
    expect(isM5AnalyticalStep("m5_decision", 4)).toBe(false);
    expect(isM4AnalyticalStep("kpi_rotation", 4)).toBe(true);
  });

  it("distinguishes operational vs analytical M5 button labels", () => {
    expect(getStepSubmitLabel(5, "m5_reception", "FR")).toBe("Valider la transaction");
    expect(getStepSubmitLabel(5, "m5_kpi", "FR")).toBe("Valider les résultats");
    expect(getStepSubmitLabel(5, "m5_decision", "FR")).toBe("Soumettre la décision");
    expect(getStepChromeCodeLabel(5, "m5_kpi", "FR")).toBe("Vérification des résultats");
    expect(getStepChromeCodeLabel(5, "m5_decision", "FR")).toBe("Référence décisionnelle");
    expect(getStepChromeCodeLabel(1, "po", "FR")).toBe("Code Transaction");
    expect(getStepSubmitLabel(4, "kpi_diagnostic", "FR")).toBe("Valider l'analyse");
  });

  it("SCN-015/016/017 titles and guidance", () => {
    expect(getM5DecisionStepTitle("SCN-015", false).fr).toBe("Décision tactique");
    expect(getM5DecisionStepTitle("SCN-016", false).fr).toContain("réconciliation");
    expect(getM5DecisionStepTitle("SCN-017", true).fr).toMatch(/Bilan du quart/i);

    expect(getM5ResponseGuidance("SCN-015", false, "FR")).toMatch(/conformité|réappro/i);
    expect(getM5ResponseGuidance("SCN-015", false, "FR").toLowerCase()).not.toContain("min. 5");
    expect(getM5ResponseGuidance("SCN-016", false, "FR")).toMatch(/r[eé]concili/i);
    expect(getM5ResponseGuidance("SCN-016", false, "FR")).toMatch(/2 à 3 phrases/i);
    expect(getM5ResponseGuidance("SCN-017", true, "FR")).toMatch(/≥3|preuves|priorit|compromis|horizon/i);
  });

  it("SCN-015 question asks session-based tactical decision without forcing a problem", () => {
    const text = getAnalyticalQuestionText("m5_decision", "SCN-015", "FR", false);
    expect(text.toLowerCase()).toMatch(/session|preuves/);
    expect(text.toLowerCase()).toMatch(/conforme|priorit|q\s*=\s*0/);
    expect(questionContainsAnswerLeakage(text)).toBe(false);
  });

  it("SCN-016 question reinforces reconcile-first on corrected stock", () => {
    const text = getAnalyticalQuestionText("m5_decision", "SCN-016", "FR", false);
    expect(text.toLowerCase()).toMatch(/r[eé]concili/);
    expect(text.toLowerCase()).toMatch(/r[eé]appro/);
  });

  it("SCN-017 question asks ≥3 session evidence and defense dimensions", () => {
    const text = getAnalyticalQuestionText("m5_decision", "SCN-017", "FR", true);
    expect(text).toMatch(/≥3|au moins 3/i);
    expect(text.toLowerCase()).toMatch(/preuves?/);
    expect(text.toLowerCase()).toMatch(/priorit/);
    expect(text.toLowerCase()).toMatch(/compromis|horizon|recommand/);
    expect(text).not.toMatch(/2400|48\s*000/);
  });
});
