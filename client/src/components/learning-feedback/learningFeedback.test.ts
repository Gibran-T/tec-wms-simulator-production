import { describe, expect, it } from "vitest";
import { LEARNING_FEEDBACK_REGISTRY, getLearningFeedbackScenario } from "@shared/learningFeedbackRegistry";
import {
  buildLearningFeedbackPayload,
  resolveVisibleLearningSteps,
} from "@shared/learningFeedbackPayload";
import { LEARNING_FEEDBACK_SCN_CODES } from "@shared/learningFeedbackTypes";
import { buildRunReportRecommendations } from "@shared/runReportRecommendations";

const SCN012_COMPLETED = [
  "KPI_DATA",
  "KPI_ROTATION",
  "KPI_SERVICE",
  "KPI_DIAGNOSTIC",
  "COMPLIANCE_M4",
];

const SCN013_COMPLETED = [...SCN012_COMPLETED];

const SCN015_COMPLETED = [
  "M5_RECEPTION",
  "M5_PUTAWAY",
  "M5_CYCLE_COUNT",
  "M5_REPLENISH",
  "M5_KPI",
  "M5_DECISION",
  "COMPLIANCE_M5",
];

const SCN016_COMPLETED = [
  "M5_RECEPTION",
  "M5_PUTAWAY",
  "M5_CYCLE_COUNT",
  "M5_ADJ",
  "M5_REPLENISH",
  "M5_KPI",
  "M5_DECISION",
  "COMPLIANCE_M5",
];

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

describe("resolveVisibleLearningSteps", () => {
  it("SCN-012 shows all five completed M4 cards", () => {
    const scenario = getLearningFeedbackScenario("SCN-012")!;
    const visible = resolveVisibleLearningSteps(scenario, SCN012_COMPLETED);
    expect(visible.map((s) => s.stepCode)).toEqual([
      "KPI_DATA",
      "KPI_ROTATION",
      "KPI_SERVICE",
      "KPI_DIAGNOSTIC",
      "COMPLIANCE_M4",
    ]);
  });

  it("SCN-013 and SCN-014 include KPI_ERRORS when KPI_SERVICE completed", () => {
    for (const scnCode of ["SCN-013", "SCN-014"] as const) {
      const scenario = getLearningFeedbackScenario(scnCode)!;
      const visible = resolveVisibleLearningSteps(scenario, SCN013_COMPLETED);
      expect(visible.map((s) => s.stepCode)).toContain("KPI_ERRORS");
      expect(visible.map((s) => s.stepCode)).toContain("KPI_ROTATION");
      expect(visible.map((s) => s.stepCode)).toContain("KPI_SERVICE");
      expect(visible.map((s) => s.stepCode)).toContain("KPI_DIAGNOSTIC");
    }
  });

  it("SCN-015/016/017 expose full M5 card coverage when completed", () => {
    const cases: Array<[string, string[], number]> = [
      ["SCN-015", SCN015_COMPLETED, 7],
      ["SCN-016", SCN016_COMPLETED, 8],
      ["SCN-017", SCN015_COMPLETED, 7],
    ];
    for (const [scnCode, completed, count] of cases) {
      const scenario = getLearningFeedbackScenario(scnCode)!;
      const visible = resolveVisibleLearningSteps(scenario, completed);
      expect(visible.length).toBe(count);
      expect(visible.every((s) => completed.includes(s.stepCode) || s.stepCode === "KPI_ERRORS")).toBe(true);
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
      completedStepCodes: SCN013_COMPLETED,
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
    expect(service?.stepCompleted).toBe(true);
  });

  it("SCN-012 perfect run marks all five steps completed", () => {
    const payload = buildLearningFeedbackPayload({
      scnCode: "SCN-012",
      moduleId: 4,
      completedStepCodes: SCN012_COMPLETED,
      kpiInterpretations: [
        { kpiKey: "rotationRate", studentAnswer: "6× normal", isCorrect: true, feedback: "OK" },
        { kpiKey: "serviceLevel", studentAnswer: "excellent 95%", isCorrect: true, feedback: "OK" },
        { kpiKey: "diagnostic", studentAnswer: "maintien surveillance SKU recommandation", isCorrect: true, feedback: "OK" },
      ],
    });
    expect(payload?.steps.length).toBe(5);
    const completed = payload!.steps.filter((s) => s.stepCompleted);
    expect(completed.map((s) => s.stepCode)).toEqual([
      "KPI_DATA",
      "KPI_ROTATION",
      "KPI_SERVICE",
      "KPI_DIAGNOSTIC",
      "COMPLIANCE_M4",
    ]);
    const visible = resolveVisibleLearningSteps(getLearningFeedbackScenario("SCN-012")!, SCN012_COMPLETED);
    expect(visible.length).toBe(5);
  });

  it("maps M5 decision and detects rejection event", () => {
    const payload = buildLearningFeedbackPayload({
      scnCode: "SCN-017",
      moduleId: 5,
      completedStepCodes: SCN015_COMPLETED,
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
    expect(payload?.steps.find((s) => s.stepCode === "M5_RECEPTION")?.stepCompleted).toBe(true);
  });

  it("does not mutate scoring events (display-only payload)", () => {
    const events = [
      { eventType: "KPI_DATA_COMPLETED", pointsDelta: 10, message: "Données KPI saisies" },
      { eventType: "KPI_ROTATION_COMPLETED", pointsDelta: 15, message: "Rotation OK" },
      { eventType: "KPI_SERVICE_COMPLETED", pointsDelta: 15, message: "Service OK" },
      { eventType: "KPI_DIAGNOSTIC_COMPLETED", pointsDelta: 20, message: "Diagnostic OK" },
      { eventType: "COMPLIANCE_M4_COMPLETED", pointsDelta: 15, message: "Conformité OK" },
    ];
    const scoreBefore = events.reduce((sum, e) => sum + e.pointsDelta, 0);
    const eventsSnapshot = events.map((e) => ({ ...e }));
    buildLearningFeedbackPayload({
      scnCode: "SCN-012",
      moduleId: 4,
      completedStepCodes: SCN012_COMPLETED,
      kpiInterpretations: [
        { kpiKey: "rotationRate", studentAnswer: "normal", isCorrect: true, feedback: "" },
        { kpiKey: "serviceLevel", studentAnswer: "excellent", isCorrect: true, feedback: "" },
        { kpiKey: "diagnostic", studentAnswer: "recommandation maintien surveillance", isCorrect: true, feedback: "" },
      ],
      scoringEvents: events.map((e) => ({ eventType: e.eventType, message: e.message })),
    });
    expect(events).toEqual(eventsSnapshot);
    expect(scoreBefore).toBe(75);
  });
});

describe("buildRunReportRecommendations", () => {
  it("M4 SCN-012 success recommends next M4 scenario", () => {
    const recs = buildRunReportRecommendations({
      moduleId: 4,
      scnCode: "SCN-012",
      errorEventTypes: [],
      complianceCompliant: true,
      errorCount: 0,
    });
    expect(recs[0]).toContain("SCN-013");
    expect(recs[0]).not.toContain("Module 2");
  });

  it("M4 SCN-014 success recommends Module 5", () => {
    const recs = buildRunReportRecommendations({
      moduleId: 4,
      scnCode: "SCN-014",
      errorEventTypes: [],
      complianceCompliant: true,
      errorCount: 0,
    });
    expect(recs[0]).toContain("Module 5");
    expect(recs[0]).toContain("SCN-015");
  });

  it("M5 SCN-017 success recommends Gold certification path", () => {
    const recs = buildRunReportRecommendations({
      moduleId: 5,
      scnCode: "SCN-017",
      errorEventTypes: [],
      complianceCompliant: true,
      errorCount: 0,
    });
    expect(recs[0]).toMatch(/Gold|certification/i);
    expect(recs[0]).not.toContain("Module 2");
  });

  it("M1 success keeps Module 2 FIFO recommendation", () => {
    const recs = buildRunReportRecommendations({
      moduleId: 1,
      scnCode: "SCN-001",
      errorEventTypes: [],
      complianceCompliant: true,
      errorCount: 0,
    });
    expect(recs[0]).toContain("Module 2");
    expect(recs[0]).toContain("FIFO");
  });
});
