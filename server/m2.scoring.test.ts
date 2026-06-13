import { describe, expect, it } from "vitest";
import { calculateTotalScore, getM2PerfectRunMaxScore, getM2StockAccuracyPoints, getScoringRule } from "./scoringEngine";
import { getM2StepsToAutoComplete, isM2PutawayPreSatisfied } from "./m1Preload";

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

  it("SCN-008 preloaded putaway auto-complete includes PUTAWAY_COMPLETED in 100/100 budget", () => {
    const scn008Preload = [
      { docType: "GR" as const, sku: "SKU-003", bin: "B-01-R1-L1", qty: 100, posted: true },
      { docType: "GR" as const, sku: "SKU-003", bin: "B-01-R1-L2", qty: 100, posted: true },
      { docType: "GR" as const, sku: "SKU-003", bin: "B-02-R1-L1", qty: 100, posted: true },
    ];
    expect(isM2PutawayPreSatisfied(scn008Preload)).toBe(true);
    const autoSteps = getM2StepsToAutoComplete(scn008Preload);
    expect(autoSteps).toContain("PUTAWAY");
    const events = autoSteps.includes("PUTAWAY")
      ? perfectM2Events()
      : perfectM2Events().filter((e) => e.pointsDelta !== getScoringRule("PUTAWAY_COMPLETED")!.points);
    expect(calculateTotalScore(events)).toBe(100);
  });
});
