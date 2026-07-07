import { describe, expect, it } from "vitest";
import { validateM4Compliance, calculateKpis, CANONICAL_M4_KPI_DATA } from "../server/rulesEngine";
import {
  M4_DIAGNOSTIC_ACTION_TERMS,
  SCN014_DIAGNOSTIC_CANONICAL_FR,
  SCN014_DIAGNOSTIC_FIXTURE,
} from "./m4CanonicalResponses";

const completedSteps = ["KPI_DATA", "KPI_ROTATION", "KPI_SERVICE", "KPI_DIAGNOSTIC"];
const kpiResult = calculateKpis(CANONICAL_M4_KPI_DATA);

function norm(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

describe("RC24 — SCN-014 canonical diagnostic", () => {
  it("fixture passes validateM4Compliance for SCN-014", () => {
    const result = validateM4Compliance({
      scnCode: "SCN-014",
      completedSteps,
      kpiInterpretations: [
        { kpiKey: "rotationRate", studentAnswer: "Rotation normale", isCorrect: true },
        { kpiKey: "serviceLevel", studentAnswer: "Service excellent", isCorrect: true },
        { kpiKey: "diagnostic", studentAnswer: SCN014_DIAGNOSTIC_FIXTURE, isCorrect: true },
      ],
      kpiResult,
    });
    expect(result.allowed).toBe(true);
  });

  it("French canonical passes validateM4Compliance for SCN-014", () => {
    const result = validateM4Compliance({
      scnCode: "SCN-014",
      completedSteps,
      kpiInterpretations: [
        { kpiKey: "rotationRate", studentAnswer: "Rotation normale", isCorrect: true },
        { kpiKey: "serviceLevel", studentAnswer: "Service excellent", isCorrect: true },
        { kpiKey: "diagnostic", studentAnswer: SCN014_DIAGNOSTIC_CANONICAL_FR, isCorrect: true },
      ],
      kpiResult,
    });
    expect(result.allowed).toBe(true);
  });

  it("includes required recommendation vocabulary", () => {
    const n = norm(SCN014_DIAGNOSTIC_CANONICAL_FR);
    expect(M4_DIAGNOSTIC_ACTION_TERMS.some((term) => n.includes(term))).toBe(true);
    expect(SCN014_DIAGNOSTIC_CANONICAL_FR.length).toBeGreaterThanOrEqual(150);
  });
});
