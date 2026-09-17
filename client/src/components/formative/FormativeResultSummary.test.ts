import { describe, expect, it } from "vitest";
import { failedFormativeParts, formativeFailedPartsCopy } from "./FormativeResultSummary";

const t = (fr: string, en: string) => fr;

describe("FormativeResultSummary failed parts", () => {
  it("calls out M5 consolidation ordering 0/100 as the 80% cause", () => {
    const parts = {
      evidenceColors: 100,
      ordering: 0,
      associations: 100,
      trueFalse: 100,
      actionBuckets: 100,
    };
    expect(failedFormativeParts(parts)).toEqual([{ key: "ordering", score: 0 }]);
    const copy = formativeFailedPartsCopy(80, parts, t);
    expect(copy).toContain("Ordre professionnel (0/100)");
    expect(copy).toContain("Score 80%");
    expect(copy).toContain("Action requise");
  });
});
