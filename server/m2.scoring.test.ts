import { describe, expect, it } from "vitest";
import {
  calculateTotalScore,
  getM2PerfectRunMaxScore,
  getM2StockAccuracyPoints,
  getScoringRule,
} from "./scoringEngine";

/** Perfect M2 run events (SCN-006 / SCN-007 / SCN-008 share the same scored steps). */
function perfectM2Events() {
  return [
    { pointsDelta: getScoringRule("PUTAWAY_COMPLETED")!.points },
    { pointsDelta: getScoringRule("FIFO_PICK_COMPLETED")!.points },
    { pointsDelta: getM2StockAccuracyPoints(0) },
    { pointsDelta: getScoringRule("COMPLIANCE_ADV_COMPLETED")!.points },
  ];
}

describe("M2 scoring model", () => {
  it("perfect run budget sums to 100", () => {
    expect(getM2PerfectRunMaxScore()).toBe(100);
  });

  it("SCN-006 perfect execution reaches 100/100", () => {
    expect(calculateTotalScore(perfectM2Events())).toBe(100);
  });

  it("SCN-007 perfect execution reaches 100/100", () => {
    expect(calculateTotalScore(perfectM2Events())).toBe(100);
  });

  it("SCN-008 perfect execution reaches 100/100", () => {
    expect(calculateTotalScore(perfectM2Events())).toBe(100);
  });

  it("no M2 scenario exceeds 100 even with extra events", () => {
    const events = [
      ...perfectM2Events(),
      { pointsDelta: 10 },
    ];
    expect(calculateTotalScore(events)).toBe(100);
  });

  it("stock variance reduces score but compliance is still required for full marks", () => {
    const withoutCompliance = [
      { pointsDelta: getScoringRule("PUTAWAY_COMPLETED")!.points },
      { pointsDelta: getScoringRule("FIFO_PICK_COMPLETED")!.points },
      { pointsDelta: getM2StockAccuracyPoints(3) },
    ];
    expect(calculateTotalScore(withoutCompliance)).toBe(70);
    expect(getM2StockAccuracyPoints(3)).toBe(20);
  });

  it("M2 scored steps are not capped below 100 on a perfect run", () => {
    expect(getM2PerfectRunMaxScore()).toBeGreaterThanOrEqual(100);
  });
});
