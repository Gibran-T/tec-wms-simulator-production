/**
 * SCN-007 — capacity split ONLY (no FIFO).
 * Covers: initial 600, PUTAWAY 500+100, partial 400, overflow, wrong lot/dest,
 * FIFO absent, STOCK_ACCURACY / COMPLIANCE gates, SCN-008 non-regression.
 */
import { describe, expect, it } from "vitest";
import {
  buildM2FifoLotCatalog,
  calculateInventory,
  checkCompliance,
  canExecuteStepM2,
  getEffectiveM2CompletedSteps,
  getEffectiveM2Steps,
  getNextRequiredStepAllModules,
  isM2PutawayStepComplete,
  MODULE2_SCN007_STEPS,
  validateM2FifoPick,
  validatePutaway,
} from "./rulesEngine";
import {
  getScn007ComplianceIssues,
  getScn007NextActionHint,
  getScn007StepMaxPoints,
  getScn007StockAccuracyPoints,
  isScn007PutawayComplete,
  isScn007Scenario,
  projectInventoryAfterPutaway,
  SCN_007_LOT,
  SCN_007_REC_BIN,
  SCN_007_SKU,
  SCN_007_SPLIT_BIN_1,
  SCN_007_SPLIT_BIN_2,
  SCN_007_STEP_MAX,
  scn007FifoNotInScenarioMessage,
  validateScn007PutawayInput,
} from "./scn007";
import { EXTENDED_MISSIONS } from "./missionDataExtended";
import { getCockpitPedagogy } from "../client/src/data/scenarioCockpitPedagogy";

const SCN_007_SEED = {
  preloadedTransactions: [
    { docType: "PO", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "PO-M2-002" },
    { docType: "GR", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "GR-M2-002" },
  ],
  lots: [{ lotNumber: "LOT-2025-002", receivedAt: "2025-02-01T10:00:00Z", qty: 600 }],
};

const SCN_008_SEED = {
  preloadedTransactions: [
    { docType: "PO", sku: "SKU-003", bin: "REC-01", qty: 300, posted: true, docRef: "PO-M2-003" },
    { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L1", qty: 100, posted: true, docRef: "GR-M2-003A" },
    { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L2", qty: 100, posted: true, docRef: "GR-M2-003B" },
    { docType: "GR", sku: "SKU-003", bin: "B-02-R1-L1", qty: 100, posted: true, docRef: "GR-M2-003C" },
  ],
  lots: [
    { lotNumber: "LOT-A", receivedAt: "2025-01-10T08:00:00Z", qty: 100 },
    { lotNumber: "LOT-B", receivedAt: "2025-02-10T08:00:00Z", qty: 100 },
    { lotNumber: "LOT-C", receivedAt: "2025-03-10T08:00:00Z", qty: 100 },
  ],
};

function initialInventory() {
  return calculateInventory(
    SCN_007_SEED.preloadedTransactions.map((t) => ({
      docType: t.docType,
      sku: t.sku,
      bin: t.bin,
      qty: t.qty,
      posted: t.posted,
    })),
  );
}

function scn007State(overrides: Record<string, unknown> = {}) {
  return {
    scnCode: "SCN-007",
    scenarioId: 7,
    scenarioName: "M2 — Scénario 2 : Validation de la capacité d'emplacement",
    scenarioInitialStateJson: SCN_007_SEED,
    completedSteps: ["GR"] as string[],
    transactions: SCN_007_SEED.preloadedTransactions.map((t) => ({
      docType: t.docType,
      sku: t.sku,
      bin: t.bin,
      qty: t.qty,
      posted: t.posted,
      docRef: t.docRef,
    })),
    cycleCounts: [] as Array<{ sku: string; bin: string; variance: number; resolved: boolean }>,
    inventory: initialInventory(),
    ...overrides,
  };
}

function applyPutaway(state: ReturnType<typeof scn007State>, toBin: string, qty: number) {
  const input = {
    sku: SCN_007_SKU,
    fromBin: SCN_007_REC_BIN,
    toBin,
    qty,
    lotNumber: SCN_007_LOT,
  };
  const check = validateScn007PutawayInput(state, input);
  if (!check.allowed) return { state, check };
  const inventory = projectInventoryAfterPutaway(state.inventory as Record<string, number>, input);
  const next = {
    ...state,
    inventory,
    transactions: [
      ...state.transactions,
      { docType: "PUTAWAY", sku: SCN_007_SKU, bin: toBin, qty, posted: true, docRef: `PUT-${toBin}-${qty}` },
    ],
  };
  const putawayDone = isScn007PutawayComplete(next);
  return {
    state: {
      ...next,
      completedSteps: putawayDone
        ? Array.from(new Set([...state.completedSteps, "PUTAWAY"]))
        : state.completedSteps,
    },
    check,
  };
}

describe("SCN-007 — A. initial state", () => {
  it("starts with 600 LOT-2025-002 at REC-01, STOCKAGE=0, total 600", () => {
    const inv = initialInventory();
    expect(inv["SKU-002::REC-01"]).toBe(600);
    expect(inv["SKU-002::B-01-R1-L1"] ?? 0).toBe(0);
    expect(inv["SKU-002::B-01-R1-L2"] ?? 0).toBe(0);
    expect(inv["SKU-002::B-02-R1-L1"]).toBeUndefined();
    const total = Object.values(inv).reduce((s, q) => s + Number(q), 0);
    expect(total).toBe(600);
    expect(isScn007Scenario(scn007State())).toBe(true);
    expect(isScn007PutawayComplete(scn007State())).toBe(false);
  });

  it("has no LOT-2025-001, no GR-M2-002-FIFO, no B-02 preload", () => {
    const refs = SCN_007_SEED.preloadedTransactions.map((t) => t.docRef);
    expect(refs).toEqual(["PO-M2-002", "GR-M2-002"]);
    expect(refs).not.toContain("GR-M2-002-FIFO");
    expect(SCN_007_SEED.lots.map((l) => l.lotNumber)).toEqual(["LOT-2025-002"]);
    expect(SCN_007_SEED.lots.some((l) => l.lotNumber === "LOT-2025-001")).toBe(false);
  });

  it("mission and pedagogy are capacity-only (no FIFO)", () => {
    const mission = EXTENDED_MISSIONS["SCN-007"];
    expect(mission.context).toContain("LOT-2025-002");
    expect(mission.context).toContain("600");
    expect(mission.context).not.toContain("LOT-2025-001");
    expect(mission.context).not.toContain("FIFO");
    expect(mission.technicalSpecs.lotNumber).toBe("LOT-2025-002");
    expect(mission.supervisorNotes).toContain("Pas de FIFO");

    const pedagogy = getCockpitPedagogy("SCN-007");
    expect(pedagogy?.operationalProblem.fr).toContain("LOT-2025-002");
    expect(pedagogy?.operationalProblem.fr).not.toContain("FIFO");
    expect(pedagogy?.evidenceToObserve.fr).not.toContain("B-02");
  });

  it("effective steps are GR → PUTAWAY → STOCK_ACCURACY → COMPLIANCE_ADV", () => {
    expect(getEffectiveM2Steps(scn007State()).map((s) => s.code)).toEqual([
      "GR",
      "PUTAWAY",
      "STOCK_ACCURACY",
      "COMPLIANCE_ADV",
    ]);
    expect(MODULE2_SCN007_STEPS.map((s) => s.code)).not.toContain("FIFO_PICK");
  });
});

describe("SCN-007 — B. PUTAWAY 500", () => {
  it("accepts 500→L1, leaves PUTAWAY incomplete, blocks STOCK_ACCURACY", () => {
    const { state: after, check } = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500);
    expect(check.allowed).toBe(true);
    expect(after.inventory["SKU-002::REC-01"]).toBe(100);
    expect(after.inventory["SKU-002::B-01-R1-L1"]).toBe(500);
    expect(after.inventory["SKU-002::B-01-R1-L2"] ?? 0).toBe(0);
    expect(isScn007PutawayComplete(after)).toBe(false);
    expect(isM2PutawayStepComplete(after as any)).toBe(false);
    expect(getNextRequiredStepAllModules(after.completedSteps, 2, after as any)?.code).toBe("PUTAWAY");
    expect(canExecuteStepM2("STOCK_ACCURACY", after as any).allowed).toBe(false);
    expect(getScn007NextActionHint(after)?.titleFr).toContain("Deuxième");
  });
});

describe("SCN-007 — C. PUTAWAY 100", () => {
  it("completes split and unlocks STOCK_ACCURACY (never FIFO_PICK)", () => {
    const mid = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    const { state: after } = applyPutaway(mid, SCN_007_SPLIT_BIN_2, 100);
    expect(after.inventory["SKU-002::REC-01"]).toBe(0);
    expect(after.inventory["SKU-002::B-01-R1-L1"]).toBe(500);
    expect(after.inventory["SKU-002::B-01-R1-L2"]).toBe(100);
    expect(isScn007PutawayComplete(after)).toBe(true);
    expect(after.completedSteps).toContain("PUTAWAY");
    expect(after.completedSteps).not.toContain("FIFO_PICK");
    expect(getNextRequiredStepAllModules(after.completedSteps, 2, after as any)?.code).toBe(
      "STOCK_ACCURACY",
    );
    expect(canExecuteStepM2("STOCK_ACCURACY", after as any).allowed).toBe(true);
    expect(canExecuteStepM2("FIFO_PICK", after as any).allowed).toBe(false);
  });
});

describe("SCN-007 — D. PUTAWAY 400", () => {
  it("does not complete, keeps compliance red, next action orients split", () => {
    const { state: after } = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 400);
    expect(after.inventory["SKU-002::REC-01"]).toBe(200);
    expect(isScn007PutawayComplete(after)).toBe(false);
    expect(checkCompliance(after as any).compliant).toBe(false);
    expect(getScn007ComplianceIssues(after).issuesFr.length).toBeGreaterThan(0);
    expect(getScn007NextActionHint(after)?.fr).toMatch(/100|500|REC-01/);
  });
});

describe("SCN-007 — E. Overflow", () => {
  it("blocks 600 in L1", () => {
    const generic = validatePutaway({
      sku: "SKU-002",
      fromBin: "REC-01",
      toBin: "B-01-R1-L1",
      qty: 600,
      binCapacities: { "B-01-R1-L1": 500 },
      binCurrentLoad: { "B-01-R1-L1": 0 },
      existingLots: [],
      lotNumber: "LOT-2025-002",
      receivedAt: new Date("2025-02-01"),
    });
    expect(generic.allowed).toBe(false);
    expect(generic.penaltyEvent).toBe("CAPACITY_OVERFLOW");

    const contractual = validateScn007PutawayInput(scn007State(), {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      qty: 600,
      lotNumber: SCN_007_LOT,
    });
    expect(contractual.allowed).toBe(false);
  });
});

describe("SCN-007 — F. Wrong lot", () => {
  it("blocks any lot other than LOT-2025-002", () => {
    const check = validateScn007PutawayInput(scn007State(), {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      qty: 500,
      lotNumber: "LOT-2025-001",
    });
    expect(check.allowed).toBe(false);
    if (!check.allowed) expect(check.reasonFr).toContain("LOT-2025-002");
  });
});

describe("SCN-007 — G. Wrong destination", () => {
  it("blocks bins other than L1/L2", () => {
    const check = validateScn007PutawayInput(scn007State(), {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: "B-02-R1-L1",
      qty: 100,
      lotNumber: SCN_007_LOT,
    });
    expect(check.allowed).toBe(false);
  });
});

describe("SCN-007 — H. FIFO absent", () => {
  it("FIFO_PICK is not in scenario steps and is blocked via gate", () => {
    const state = scn007State();
    expect(getEffectiveM2Steps(state).some((s) => s.code === "FIFO_PICK")).toBe(false);
    const fifo = canExecuteStepM2("FIFO_PICK", state as any);
    expect(fifo.allowed).toBe(false);
    expect(fifo.reasonFr).toBe(scn007FifoNotInScenarioMessage().reasonFr);
    expect(getEffectiveM2CompletedSteps(state.completedSteps, state as any)).not.toContain("FIFO_PICK");
  });

  it("after complete putaway, completedSteps never require FIFO_PICK", () => {
    const mid = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    const after = applyPutaway(mid, SCN_007_SPLIT_BIN_2, 100).state;
    expect(getEffectiveM2CompletedSteps(after.completedSteps, after as any)).toEqual(
      expect.arrayContaining(["GR", "PUTAWAY"]),
    );
    expect(getEffectiveM2CompletedSteps(after.completedSteps, after as any)).not.toContain("FIFO_PICK");
    expect(getNextRequiredStepAllModules(after.completedSteps, 2, after as any)?.code).toBe(
      "STOCK_ACCURACY",
    );
  });
});

describe("SCN-007 — I. STOCK_ACCURACY", () => {
  it("unlocks only after 500+100 and expects total 600", () => {
    const partial = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    expect(canExecuteStepM2("STOCK_ACCURACY", partial as any).allowed).toBe(false);

    const mid = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    const complete = applyPutaway(mid, SCN_007_SPLIT_BIN_2, 100).state;
    expect(canExecuteStepM2("STOCK_ACCURACY", complete as any).allowed).toBe(true);
    const total = Object.values(complete.inventory as Record<string, number>).reduce(
      (s, q) => s + Number(q),
      0,
    );
    expect(total).toBe(600);
  });
});

describe("SCN-007 — J. COMPLIANCE_ADV", () => {
  it("validates capacity split and goes green only when complete", () => {
    const partial = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    expect(checkCompliance(partial as any).compliant).toBe(false);

    const mid = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    const complete = applyPutaway(mid, SCN_007_SPLIT_BIN_2, 100).state;
    const withStock = {
      ...complete,
      completedSteps: ["GR", "PUTAWAY", "STOCK_ACCURACY"],
    };
    expect(getScn007ComplianceIssues(withStock).issuesFr).toEqual([]);
    expect(checkCompliance(withStock as any).compliant).toBe(true);
  });
});

describe("SCN-007 — K. Non-regression SCN-008", () => {
  it("keeps LOT-A/B/C FIFO order intact", () => {
    const catalog = buildM2FifoLotCatalog([], SCN_008_SEED);
    expect(catalog.map((c) => c.lotNumber)).toEqual(["LOT-A", "LOT-B", "LOT-C"]);
    const inventory = {
      "SKU-003::B-01-R1-L1": 100,
      "SKU-003::B-01-R1-L2": 100,
      "SKU-003::B-02-R1-L1": 100,
    };
    expect(
      validateM2FifoPick({ sku: "SKU-003", lotNumber: "LOT-A", catalog, inventory }).allowed,
    ).toBe(true);
    expect(
      validateM2FifoPick({ sku: "SKU-003", lotNumber: "LOT-B", catalog, inventory }).allowed,
    ).toBe(false);
  });
});

describe("SCN-007 — L. Scoring", () => {
  it("max 100 without FIFO points and no duplicate budget", () => {
    const sum = Object.values(SCN_007_STEP_MAX).reduce((s, n) => s + n, 0);
    expect(sum).toBe(100);
    expect(getScn007StepMaxPoints("PUTAWAY")).toBe(40);
    expect(getScn007StockAccuracyPoints(0)).toBe(30);
    expect(getScn007StepMaxPoints("COMPLIANCE_ADV")).toBe(30);
    expect(getScn007StepMaxPoints("FIFO_PICK")).toBe(0);
  });
});
