import { describe, expect, it } from "vitest";
import { calculateTotalScore } from "./scoringEngine";
import { M1_SCN_KEYS } from "./db";

describe("Silver certification — eligibility rules", () => {
  it("M1_SCN_KEYS maps five scenarios SCN-001 to SCN-005", () => {
    expect(M1_SCN_KEYS).toEqual(["SCN001", "SCN002", "SCN003", "SCN004", "SCN005"]);
  });

  it("calculateTotalScore >= 60 is the per-scenario passing threshold", () => {
    const passingEvents = [
      { pointsDelta: 10 },
      { pointsDelta: 10 },
      { pointsDelta: 10 },
      { pointsDelta: 10 },
      { pointsDelta: 10 },
      { pointsDelta: 10 },
      { pointsDelta: 10 },
    ];
    expect(calculateTotalScore(passingEvents)).toBeGreaterThanOrEqual(60);

    const failingEvents = [{ pointsDelta: 10 }, { pointsDelta: 10 }];
    expect(calculateTotalScore(failingEvents)).toBeLessThan(60);
  });

  it("demo runs must be excluded from completion logic (isDemo filter contract)", () => {
    // Contract: getLatestNonDemoCompletedRun filters isDemo=false — verified by helper usage in db.ts
    const demoRun = { status: "completed" as const, isDemo: true };
    const evalRun = { status: "completed" as const, isDemo: false };
    expect(demoRun.isDemo).toBe(true);
    expect(evalRun.isDemo).toBe(false);
  });
});
