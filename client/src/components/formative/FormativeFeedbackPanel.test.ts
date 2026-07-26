import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  M4_PREP_FRAGMENTS,
  M4_LAYERS,
  M4_PREP_KPI_QUESTIONS,
  M5_PREP_TRAFFIC,
  M5_PREP_STOCK_BASE,
  M5_PREP_ASSOC,
  M5_PREP_TRUE_FALSE,
  scoreFormativeExercise,
} from "@shared/formativeExercises";
import { feedbackKindBadge, resolveFeedbackTexts } from "./FormativeFeedbackPanel";

const t = (fr: string, en: string) => fr;
const src = readFileSync(resolve(__dirname, "FormativeFeedbackPanel.tsx"), "utf8");

describe("FormativeFeedbackPanel — correct feedback visibility", () => {
  it("exposes Correct badge text and high-contrast body classes", () => {
    const badge = feedbackKindBadge("correct", t);
    expect(badge.label).toBe("Correct");
    expect(badge.labelClass).toContain("text-emerald-950");
    expect(badge.bodyClass).toContain("text-emerald-950");
    expect(badge.shell).toContain("bg-emerald-50");
  });

  it("exposes Incorrect badge symmetrically with Correct", () => {
    const ok = feedbackKindBadge("correct", t);
    const bad = feedbackKindBadge("incorrect", t);
    expect(ok.label).toBe("Correct");
    expect(bad.label).toBe("Incorrect");
    expect(bad.labelClass).toContain("text-rose-950");
    expect(src).toContain("formative-feedback-badge-${item.kind}");
    expect(src).toContain('data-testid="formative-feedback-body"');
    expect(src).toContain("min-h-[4.5rem]");
    expect(src).toContain("overflow-visible");
    expect(src).not.toContain("opacity-0");
  });

  it("M4 perfect scoring yields non-empty Correct feedback titles and bodies", () => {
    const result = scoreFormativeExercise("M4-PREP-KPI-RESPONSE", {
      classification: Object.fromEntries(M4_PREP_FRAGMENTS.map((f) => [f.id, f.layer])),
      ordering: [...M4_LAYERS],
      missing: {
        m1: ["decision", "suivi"],
        m2: ["donnee", "classification", "risque", "suivi"],
      },
      kpiQuestions: Object.fromEntries(M4_PREP_KPI_QUESTIONS.map((k) => [k.id, k.questionId])),
    });
    expect(result.formativeScore).toBe(100);
    const correctItems = result.feedback.filter((f) => f.kind === "correct");
    expect(correctItems.length).toBeGreaterThan(0);
    for (const item of correctItems) {
      const { title, body } = resolveFeedbackTexts(item, "FR");
      expect(title.length).toBeGreaterThan(0);
      expect(body.length).toBeGreaterThan(0);
      expect(title.toLowerCase()).toMatch(/correct/);
    }
  });

  it("M5 perfect scoring yields non-empty Correct feedback bodies", () => {
    const result = scoreFormativeExercise("M5-PREP-EVIDENCE-TO-DECISION", {
      traffic: Object.fromEntries(M5_PREP_TRAFFIC.map((x) => [x.id, x.color])),
      stockBase: M5_PREP_STOCK_BASE.correctId,
      associations: Object.fromEntries(M5_PREP_ASSOC.map((a) => [a.id, a.consequenceId])),
      trueFalse: Object.fromEntries(M5_PREP_TRUE_FALSE.map((x) => [x.id, x.answer])),
    });
    expect(result.formativeScore).toBe(100);
    const correctItems = result.feedback.filter((f) => f.kind === "correct");
    expect(correctItems.length).toBeGreaterThan(0);
    for (const item of correctItems) {
      const { title, body } = resolveFeedbackTexts(item, "FR");
      expect(body.trim().length).toBeGreaterThan(0);
      expect(title.trim().length).toBeGreaterThan(0);
    }
  });

  it("does not rely on color alone — badge label always present in markup", () => {
    expect(src).toContain('t("Correct", "Correct")');
    expect(src).toContain('t("Incorrect", "Incorrect")');
    expect(src).toContain("CheckCircle2");
    expect(src).toContain("CircleAlert");
  });
});
