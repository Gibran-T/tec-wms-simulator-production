import { describe, expect, it } from "vitest";
import { LEARNING_FEEDBACK_REGISTRY, getLearningFeedbackScenario } from "@shared/learningFeedbackRegistry";
import { buildLearningFeedbackPayload } from "@shared/learningFeedbackPayload";
import { LEARNING_FEEDBACK_SCN_CODES } from "@shared/learningFeedbackTypes";

describe("learningFeedbackRegistry", () => {
  it("covers all six M4/M5 SCN codes", () => {
    for (const scn of LEARNING_FEEDBACK_SCN_CODES) {
      expect(LEARNING_FEEDBACK_REGISTRY[scn]).toBeDefined();
      expect(LEARNING_FEEDBACK_REGISTRY[scn].steps.length).toBeGreaterThan(0);
    }
  });

  it("SCN-013 includes pedagogical KPI_ERRORS block", () => {
    const scn = getLearningFeedbackScenario("SCN-013");
    expect(scn?.steps.some((s) => s.stepCode === "KPI_ERRORS" && s.pedagogicalOnly)).toBe(true);
  });

  it("SCN-017 M5_DECISION has three strategic variants", () => {
    const decision = getLearningFeedbackScenario("SCN-017")?.steps.find((s) => s.stepCode === "M5_DECISION");
    expect(decision?.canonicalAnswer.variants?.length).toBe(3);
  });

  it("all registry strings have FR/EN parity", () => {
    for (const scn of Object.values(LEARNING_FEEDBACK_REGISTRY)) {
      expect(scn.title.fr.length).toBeGreaterThan(0);
      expect(scn.title.en.length).toBeGreaterThan(0);
      for (const step of scn.steps) {
        expect(step.label.fr.length).toBeGreaterThan(0);
        expect(step.label.en.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("buildLearningFeedbackPayload", () => {
  it("returns null for M1/M2/M3 modules", () => {
    expect(
      buildLearningFeedbackPayload({ scnCode: "SCN-013", moduleId: 3, kpiInterpretations: [] }),
    ).toBeNull();
  });

  it("maps M4 kpiKey rows to step submissions", () => {
    const payload = buildLearningFeedbackPayload({
      scnCode: "SCN-013",
      moduleId: 4,
      kpiInterpretations: [
        {
          kpiKey: "serviceLevel",
          studentAnswer: "Taux de service excellent optimal",
          isCorrect: true,
          feedback: "OK",
        },
      ],
    });
    const service = payload?.steps.find((s) => s.stepCode === "KPI_SERVICE");
    expect(service?.studentSubmission).toContain("excellent");
    expect(service?.submissionCorrect).toBe(true);
  });

  it("maps M5 decision and detects rejection event", () => {
    const payload = buildLearningFeedbackPayload({
      scnCode: "SCN-017",
      moduleId: 5,
      kpiInterpretations: [
        {
          kpiKey: "m5Decision",
          studentAnswer: "Situation preuve arbitrage recommandation",
          isCorrect: true,
          feedback: "Strategic OK",
        },
      ],
      scoringEvents: [{ eventType: "M5_DECISION_REJECTED", message: "Rejected" }],
    });
    expect(payload?.m5Decision?.rejected).toBe(true);
  });
});
