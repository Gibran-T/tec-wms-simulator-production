/**
 * M4 cognitive selector path — wrong (−5 + red why) → retry correct → step award.
 * Pure contract tests (no DB). James E2E remote script uses the same option IDs.
 */
import { describe, expect, it } from "vitest";
import {
  getM4CognitiveOption,
  getM4CognitiveQuestion,
  M4_COGNITIVE_WRONG_PENALTY,
  m4CognitivePenaltyEventType,
} from "../shared/m4CognitiveSelectors";
import {
  calculateKpis,
  scoreKpiInterpretation,
  validateM4Compliance,
  CANONICAL_M4_KPI_DATA,
  M4_STEP_MAX,
} from "./rulesEngine";

const kpi = calculateKpis(CANONICAL_M4_KPI_DATA);

describe("James-style M4 cognitive path (SCN-012)", () => {
  it("wrong rotation option yields specific why + −5 contract", () => {
    const wrong = getM4CognitiveOption("SCN-012", "KPI_ROTATION", "scn012-rot-a");
    expect(wrong?.isCorrect).toBe(false);
    expect(wrong?.whyWrong?.fr).toMatch(/bande normale|liquidation/i);
    expect(M4_COGNITIVE_WRONG_PENALTY).toBe(-5);
    expect(m4CognitivePenaltyEventType("KPI_ROTATION")).toBe("KPI_ROTATION_COGNITIVE_INCORRECT");
  });

  it("correct options complete rotation → service → diagnostic → compliance", () => {
    const rot = getM4CognitiveOption("SCN-012", "KPI_ROTATION", "scn012-rot-b")!;
    const svc = getM4CognitiveOption("SCN-012", "KPI_SERVICE", "scn012-svc-d")!;
    const diag = getM4CognitiveOption("SCN-012", "KPI_DIAGNOSTIC", "scn012-diag-c")!;

    const r1 = scoreKpiInterpretation("rotationRate", rot.answerText, kpi, "SCN-012");
    const r2 = scoreKpiInterpretation("serviceLevel", svc.answerText, kpi, "SCN-012");
    const r3 = scoreKpiInterpretation("diagnostic", diag.answerText, kpi, "SCN-012");

    expect(r1.isCorrect).toBe(true);
    expect(r1.pointsDelta).toBe(M4_STEP_MAX.KPI_ROTATION);
    expect(r2.isCorrect).toBe(true);
    expect(r2.pointsDelta).toBe(M4_STEP_MAX.KPI_SERVICE);
    expect(r3.isCorrect).toBe(true);
    expect(r3.pointsDelta).toBe(M4_STEP_MAX.KPI_DIAGNOSTIC);

    const compliance = validateM4Compliance({
      scnCode: "SCN-012",
      completedSteps: ["KPI_DATA", "KPI_ROTATION", "KPI_SERVICE", "KPI_DIAGNOSTIC"],
      kpiInterpretations: [
        { kpiKey: "rotationRate", studentAnswer: rot.answerText, isCorrect: true },
        { kpiKey: "serviceLevel", studentAnswer: svc.answerText, isCorrect: true },
        { kpiKey: "diagnostic", studentAnswer: diag.answerText, isCorrect: true },
      ],
      kpiResult: kpi,
    });
    expect(compliance.allowed).toBe(true);
  });

  it("score after one wrong attempt remains passable (100 − 5 + awards model)", () => {
    // Pedagogical model: one wrong (−5) then full step awards still allow ≥70 pass.
    const awards =
      M4_STEP_MAX.KPI_DATA +
      M4_STEP_MAX.KPI_ROTATION +
      M4_STEP_MAX.KPI_SERVICE +
      M4_STEP_MAX.KPI_DIAGNOSTIC +
      M4_STEP_MAX.COMPLIANCE_M4;
    const afterOneMiss = awards + M4_COGNITIVE_WRONG_PENALTY;
    expect(awards).toBe(100);
    expect(afterOneMiss).toBe(95);
    expect(afterOneMiss).toBeGreaterThanOrEqual(70);
  });

  it("every SCN question exposes 5 near-miss labels for selector UX", () => {
    for (const scn of ["SCN-012", "SCN-013", "SCN-014"] as const) {
      for (const step of ["KPI_ROTATION", "KPI_SERVICE", "KPI_DIAGNOSTIC"] as const) {
        const q = getM4CognitiveQuestion(scn, step);
        expect(q?.options.length).toBe(5);
        expect(new Set(q!.options.map((o) => o.label.fr)).size).toBe(5);
      }
    }
  });
});
