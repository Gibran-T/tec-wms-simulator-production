import { describe, expect, it } from "vitest";
import { calculateTotalScore, getScoringRule } from "./scoringEngine";
import { getM1StepsToAutoComplete } from "./m1Preload";

/** SCN-004 perfect path: PO/GR pre-seeded, student completes PUTAWAY → ship → CC → ADJ → compliance. */
function scn004PerfectEvents(includePreloadPoGr: boolean) {
  const events: Array<{ pointsDelta: number }> = [];
  if (includePreloadPoGr) {
    events.push({ pointsDelta: getScoringRule("PO_COMPLETED")!.points });
    events.push({ pointsDelta: getScoringRule("GR_COMPLETED")!.points });
  }
  events.push(
    { pointsDelta: 5 }, // PUTAWAY_M1_COMPLETED
    { pointsDelta: getScoringRule("SO_COMPLETED")!.points },
    { pointsDelta: 5 }, // PICKING_M1_COMPLETED
    { pointsDelta: getScoringRule("GI_COMPLETED")!.points },
    { pointsDelta: getScoringRule("CC_COMPLETED")!.points },
    { pointsDelta: getScoringRule("COMPLIANCE_OK")!.points },
  );
  return events;
}

describe("M1 scoring model — SCN-004 preload", () => {
  const scn004Preload = [
    { docType: "PO" as const, sku: "SKU-006", bin: "REC-01", qty: 200, posted: true },
    { docType: "GR" as const, sku: "SKU-006", bin: "REC-01", qty: 200, posted: true },
  ];

  it("auto-completes PO and GR when both are posted at seed", () => {
    expect(getM1StepsToAutoComplete(scn004Preload)).toEqual(["PO", "GR"]);
  });

  it("perfect SCN-004 reaches 100/100 when preload PO/GR are credited", () => {
    expect(calculateTotalScore(scn004PerfectEvents(true))).toBe(100);
  });

  it("without preload PO/GR scoring credit, SCN-004 caps below 100 (regression guard)", () => {
    expect(calculateTotalScore(scn004PerfectEvents(false))).toBe(80);
    const withBonus = [
      ...scn004PerfectEvents(false),
      { pointsDelta: getScoringRule("PERFECT_RUN_BONUS")!.points },
    ];
    expect(calculateTotalScore(withBonus)).toBe(90);
  });
});
