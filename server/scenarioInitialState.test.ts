import { describe, expect, it } from "vitest";
import { getM1CanonicalInitialState, resolveScenarioInitialState } from "./scenarioInitialState";

describe("M1 canonical initial state", () => {
  it("SCN-002 ghost GR at REC-01", () => {
    const s = getM1CanonicalInitialState(2)!;
    const gr = s.preloadedTransactions!.find((t) => t.docRef === "GR-2025-001");
    expect(gr?.bin).toBe("REC-01");
    expect(gr?.posted).toBe(false);
  });

  it("SCN-003 GR at REC-01 not stockage", () => {
    const s = getM1CanonicalInitialState(3)!;
    const gr = s.preloadedTransactions!.find((t) => t.docRef === "GR-2025-002");
    expect(gr?.bin).toBe("REC-01");
    expect(s.multiFlow).toBe(true);
  });

  it("SCN-005 ghost GR at REC-01 and ccAllowsNegativePhysical", () => {
    const s = getM1CanonicalInitialState(5)!;
    const gr4 = s.preloadedTransactions!.find((t) => t.docRef === "GR-2025-004");
    expect(gr4?.bin).toBe("REC-01");
    expect(s.ccAllowsNegativePhysical).toBe(true);
  });

  it("SCN-001 and SCN-004 not overridden", () => {
    expect(getM1CanonicalInitialState(1)).toBeNull();
    expect(getM1CanonicalInitialState(4)).toBeNull();
    expect(resolveScenarioInitialState(4, { context: "db" })?.context).toBe("db");
  });
});
