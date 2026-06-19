/**
 * M4 Score Restoration (Option B) — validation tests
 * Perfect run: 10+20+20+25+25 = 100 · Pass threshold: 70/100
 */
import { describe, it, expect } from "vitest";
import {
  M4_STEP_MAX,
  M4_PERFECT_RUN_TOTAL,
  scoreKpiInterpretation,
  calculateKpis,
  CANONICAL_M4_KPI_DATA,
} from "./rulesEngine";
import { calculateTotalScore } from "./scoringEngine";
import { getModuleScenarioPassThreshold } from "@shared/moduleThresholds";

describe("M4 score restoration — runtime budget", () => {
  const kpiResult = calculateKpis(CANONICAL_M4_KPI_DATA);

  it("M4 pass threshold is 70/100", () => {
    expect(getModuleScenarioPassThreshold(4)).toBe(70);
  });

  it("perfect-run scoring events sum to 100", () => {
    const diag =
      "Je recommande une action strategique pour ameliorer le service avec decision claire et plan chiffre.";
    const events = [
      { pointsDelta: M4_STEP_MAX.KPI_DATA },
      { pointsDelta: scoreKpiInterpretation("rotationRate", "Rotation normale equilibree", kpiResult).pointsDelta },
      { pointsDelta: scoreKpiInterpretation("serviceLevel", "Service excellent optimal", kpiResult).pointsDelta },
      { pointsDelta: scoreKpiInterpretation("diagnostic", diag.repeat(2), kpiResult).pointsDelta },
      { pointsDelta: M4_STEP_MAX.COMPLIANCE_M4 },
    ];
    const total = calculateTotalScore(events as any);
    expect(total).toBe(M4_PERFECT_RUN_TOTAL);
    expect(total).toBe(100);
  });

  it("perfect run meets pass threshold with 30-point margin", () => {
    expect(M4_PERFECT_RUN_TOTAL).toBeGreaterThanOrEqual(getModuleScenarioPassThreshold(4));
    expect(M4_PERFECT_RUN_TOTAL - getModuleScenarioPassThreshold(4)).toBe(30);
  });

  it("one incorrect rotation (−5) still passes at 75", () => {
    const diag =
      "Je recommande une action strategique pour ameliorer le service avec decision claire et plan chiffre.";
    const events = [
      { pointsDelta: M4_STEP_MAX.KPI_DATA },
      { pointsDelta: scoreKpiInterpretation("rotationRate", "excellent optimal parfait", kpiResult).pointsDelta },
      { pointsDelta: scoreKpiInterpretation("serviceLevel", "Service excellent optimal", kpiResult).pointsDelta },
      { pointsDelta: scoreKpiInterpretation("diagnostic", diag.repeat(2), kpiResult).pointsDelta },
      { pointsDelta: M4_STEP_MAX.COMPLIANCE_M4 },
    ];
    expect(calculateTotalScore(events as any)).toBeGreaterThanOrEqual(getModuleScenarioPassThreshold(4));
  });
});
