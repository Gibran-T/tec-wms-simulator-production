import { describe, expect, it } from "vitest";
import {
  getM1CanonicalInitialState,
  hasRuntimeInitialStateOverride,
  resolveScenarioInitialState,
} from "./scenarioInitialState";

describe("M1 runtime initial state override (SCN-003, SCN-005 only)", () => {
  it("SCN-002 not overridden — uses DB", () => {
    expect(hasRuntimeInitialStateOverride(2)).toBe(false);
    expect(getM1CanonicalInitialState(2)).toBeNull();
    expect(resolveScenarioInitialState(2, { context: "db-only" })?.context).toBe("db-only");
  });

  it("SCN-003 GR at REC-01 with multiFlow", () => {
    expect(hasRuntimeInitialStateOverride(3)).toBe(true);
    const s = getM1CanonicalInitialState(3)!;
    const gr = s.preloadedTransactions!.find((t) => t.docRef === "GR-2025-002");
    expect(gr?.bin).toBe("REC-01");
    expect(gr?.posted).toBe(true);
    expect(s.multiFlow).toBe(true);
  });

  it("SCN-005 ghost GR at REC-01, SKU-005 at REC-02, ccAllowsNegativePhysical", () => {
    expect(hasRuntimeInitialStateOverride(5)).toBe(true);
    const s = getM1CanonicalInitialState(5)!;
    const gr4 = s.preloadedTransactions!.find((t) => t.docRef === "GR-2025-004");
    const gr5 = s.preloadedTransactions!.find((t) => t.docRef === "GR-2025-005");
    expect(gr4?.bin).toBe("REC-01");
    expect(gr4?.posted).toBe(false);
    expect(gr5?.bin).toBe("REC-02");
    expect(gr5?.posted).toBe(true);
    expect(s.ccAllowsNegativePhysical).toBe(true);
  });

  it("SCN-001 and SCN-004 not overridden", () => {
    expect(getM1CanonicalInitialState(1)).toBeNull();
    expect(getM1CanonicalInitialState(4)).toBeNull();
    expect(resolveScenarioInitialState(4, { context: "db" })?.context).toBe("db");
  });

  it("resolveScenarioInitialState ignores stale DB for SCN-003", () => {
    const staleDb = {
      preloadedTransactions: [
        { docType: "GR", sku: "SKU-003", bin: "A-01-R1-L1", qty: 50, posted: true, docRef: "GR-2025-002" },
      ],
    };
    const resolved = resolveScenarioInitialState(3, staleDb)!;
    expect(resolved.preloadedTransactions!.find((t) => t.docRef === "GR-2025-002")?.bin).toBe("REC-01");
  });
});
