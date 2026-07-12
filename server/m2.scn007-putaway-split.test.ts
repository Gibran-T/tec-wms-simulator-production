/**
 * SCN-007 — capacity split ONLY (no FIFO).
 * Contract tests: Points de contrôle are executable state-machine rules.
 * Covers: exact 500+100, reject 400 with zero mutation, monitor, endpoints,
 * FIFO absent, STOCK_ACCURACY / COMPLIANCE gates, SCN-006/008 non-regression.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildM2FifoLotCatalog,
  calculateInventory,
  checkCompliance,
  canExecuteStepM2,
  calculateProgressPctAllModules,
  getEffectiveM2CompletedSteps,
  getEffectiveM2Steps,
  getNextRequiredStepAllModules,
  isM2PutawayStepComplete,
  MODULE2_SCN007_STEPS,
  validateM2FifoPick,
  validatePutaway,
} from "./rulesEngine";
import {
  detectScn007PutawayPhase,
  getScn007AllowedPutaway,
  getScn007ComplianceIssues,
  getScn007NextActionHint,
  getScn007PostedPutawayCredits,
  getScn007StepMaxPoints,
  getScn007StockAccuracyPoints,
  hasScn007CanonicalPutawaySequence,
  isScn007PutawayComplete,
  isScn007Scenario,
  projectInventoryAfterPutaway,
  projectTransactionsAfterPutaway,
  SCN_007_LOT,
  SCN_007_REC_BIN,
  SCN_007_SKU,
  SCN_007_SPLIT_BIN_1,
  SCN_007_SPLIT_BIN_2,
  SCN_007_STEP_MAX,
  scn007FifoNotInScenarioMessage,
  toScn007MonitorBusinessRows,
  validateScn007PutawayContract,
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
  const check = validateScn007PutawayContract(state, input);
  if (!check.allowed) return { state, check, mutated: false };
  const inventory = projectInventoryAfterPutaway(state.inventory as Record<string, number>, input);
  const transactions = projectTransactionsAfterPutaway(state.transactions, {
    ...input,
    docRef: `PUT-${toBin}-${qty}`,
  });
  const next = {
    ...state,
    inventory,
    transactions,
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
    mutated: true,
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
    expect(detectScn007PutawayPhase(scn007State())).toBe("INITIAL");
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
    expect(mission.controlPoints[1]).toContain("500");
    expect(mission.controlPoints[2]).toContain("100");

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

  it("next action demands exact 500 to L1", () => {
    const hint = getScn007NextActionHint(scn007State());
    expect(hint?.titleFr).toBe("Premier rangement — B-01-R1-L1");
    expect(hint?.fr).toContain("exactement 500");
    expect(hint?.titleFr).not.toMatch(/partiel/i);
  });
});

describe("SCN-007 — B. PUTAWAY 500 (contract accept)", () => {
  it("1. initial + 500 for L1 → accepted", () => {
    const { state: after, check, mutated } = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500);
    expect(check.allowed).toBe(true);
    expect(mutated).toBe(true);
    expect(after.inventory["SKU-002::REC-01"]).toBe(100);
    expect(after.inventory["SKU-002::B-01-R1-L1"]).toBe(500);
    expect(after.inventory["SKU-002::B-01-R1-L2"] ?? 0).toBe(0);
    expect(isScn007PutawayComplete(after)).toBe(false);
    expect(isM2PutawayStepComplete(after as any)).toBe(false);
    expect(detectScn007PutawayPhase(after)).toBe("AFTER_FIRST_PUTAWAY");
    expect(getNextRequiredStepAllModules(after.completedSteps, 2, after as any)?.code).toBe("PUTAWAY");
    expect(canExecuteStepM2("STOCK_ACCURACY", after as any).allowed).toBe(false);
    expect(getScn007NextActionHint(after)?.titleFr).toBe("Deuxième rangement — B-01-R1-L2");
    expect(getScn007NextActionHint(after)?.fr).toContain("exactement les 100");
  });
});

describe("SCN-007 — C. PUTAWAY 100 (contract accept)", () => {
  it("4. after 500 + 100 for L2 → accepted and completes", () => {
    const mid = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    const { state: after } = applyPutaway(mid, SCN_007_SPLIT_BIN_2, 100);
    expect(after.inventory["SKU-002::REC-01"]).toBe(0);
    expect(after.inventory["SKU-002::B-01-R1-L1"]).toBe(500);
    expect(after.inventory["SKU-002::B-01-R1-L2"]).toBe(100);
    expect(isScn007PutawayComplete(after)).toBe(true);
    expect(hasScn007CanonicalPutawaySequence(after)).toBe(true);
    expect(after.completedSteps).toContain("PUTAWAY");
    expect(after.completedSteps).not.toContain("FIFO_PICK");
    expect(getNextRequiredStepAllModules(after.completedSteps, 2, after as any)?.code).toBe(
      "STOCK_ACCURACY",
    );
    expect(canExecuteStepM2("STOCK_ACCURACY", after as any).allowed).toBe(true);
    expect(canExecuteStepM2("FIFO_PICK", after as any).allowed).toBe(false);
    expect(getScn007NextActionHint(after)?.titleFr).toBe("Contrôle de précision du stock");
  });
});

describe("SCN-007 — D. PUTAWAY 400 (hard reject, zero mutation)", () => {
  it("2. initial + 400 for L1 → rejected, zero mutation", () => {
    const before = scn007State();
    // Capacity alone would accept 400 (under max 500) — contract must still reject.
    const capacityWouldAllow = validatePutaway({
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      qty: 400,
      binCapacities: { "B-01-R1-L1": 500 },
      binCurrentLoad: { "B-01-R1-L1": 0 },
      existingLots: [],
      lotNumber: SCN_007_LOT,
      receivedAt: new Date("2025-02-01"),
    });
    expect(capacityWouldAllow.allowed).toBe(true);

    const { state: after, check, mutated } = applyPutaway(before, SCN_007_SPLIT_BIN_1, 400);
    expect(check.allowed).toBe(false);
    expect(mutated).toBe(false);
    if (!check.allowed) {
      expect(check.reasonFr).toContain("Première opération incorrecte");
      expect(check.reasonFr).toContain("500");
      expect(check.reasonFr).not.toMatch(/compléter|partiel|400 \+ 100/i);
    }
    expect(after.inventory["SKU-002::REC-01"]).toBe(600);
    expect(after.inventory["SKU-002::B-01-R1-L1"] ?? 0).toBe(0);
    expect(after.inventory["SKU-002::B-01-R1-L2"] ?? 0).toBe(0);
    expect(after.transactions).toEqual(before.transactions);
    expect(after.completedSteps).toEqual(["GR"]);
    expect(isScn007PutawayComplete(after)).toBe(false);
    expect(calculateProgressPctAllModules(after.completedSteps, 2, after as any)).toBe(25);
    expect(getScn007NextActionHint(after)?.fr).toContain("exactement 500");
    expect(getScn007NextActionHint(after)?.titleFr).not.toMatch(/partiel/i);
  });

  it("3. initial + 100 for L2 → rejected, zero mutation", () => {
    const before = scn007State();
    const { state: after, check, mutated } = applyPutaway(before, SCN_007_SPLIT_BIN_2, 100);
    expect(check.allowed).toBe(false);
    expect(mutated).toBe(false);
    expect(after.inventory["SKU-002::REC-01"]).toBe(600);
    expect(after.inventory).toEqual(before.inventory);
  });

  it("rejects 499/501/600 for L1 on initial", () => {
    for (const qty of [499, 501, 600]) {
      const check = validateScn007PutawayContract(scn007State(), {
        sku: SCN_007_SKU,
        fromBin: SCN_007_REC_BIN,
        toBin: SCN_007_SPLIT_BIN_1,
        qty,
        lotNumber: SCN_007_LOT,
      });
      expect(check.allowed).toBe(false);
    }
  });
});

describe("SCN-007 — D2. after first putaway rejects", () => {
  it("5. after 500 + 50 for L2 → rejected, zero mutation", () => {
    const mid = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    const { state: after, check, mutated } = applyPutaway(mid, SCN_007_SPLIT_BIN_2, 50);
    expect(check.allowed).toBe(false);
    expect(mutated).toBe(false);
    expect(after.inventory["SKU-002::REC-01"]).toBe(100);
    expect(after.inventory["SKU-002::B-01-R1-L1"]).toBe(500);
    expect(after.inventory["SKU-002::B-01-R1-L2"] ?? 0).toBe(0);
  });

  it("after 500 + 200 for L2 → rejected (capacity would allow, contract must not)", () => {
    const mid = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    const capacityWouldAllow = validatePutaway({
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_2,
      qty: 200,
      binCapacities: { "B-01-R1-L2": 500 },
      binCurrentLoad: { "B-01-R1-L2": 0 },
      existingLots: [],
      lotNumber: SCN_007_LOT,
      receivedAt: new Date("2025-02-01"),
    });
    expect(capacityWouldAllow.allowed).toBe(true);

    const { state: after, check, mutated } = applyPutaway(mid, SCN_007_SPLIT_BIN_2, 200);
    expect(check.allowed).toBe(false);
    expect(mutated).toBe(false);
    if (!check.allowed) {
      expect(check.reasonFr).toContain("Deuxième opération incorrecte");
      expect(check.reasonFr).toContain("100 unités restantes");
    }
    expect(after.inventory["SKU-002::REC-01"]).toBe(100);
    expect(after.inventory["SKU-002::B-01-R1-L2"] ?? 0).toBe(0);
  });

  it("6. after 500 + 100 for L1 → rejected", () => {
    const mid = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    const check = validateScn007PutawayContract(mid, {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      qty: 100,
      lotNumber: SCN_007_LOT,
    });
    expect(check.allowed).toBe(false);
  });

  it("rejects 99/101 for L2 after first", () => {
    const mid = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    for (const qty of [99, 101]) {
      expect(
        validateScn007PutawayContract(mid, {
          sku: SCN_007_SKU,
          fromBin: SCN_007_REC_BIN,
          toBin: SCN_007_SPLIT_BIN_2,
          qty,
          lotNumber: SCN_007_LOT,
        }).allowed,
      ).toBe(false);
    }
  });
});

describe("SCN-007 — D3. complete rejects extra PUTAWAY", () => {
  it("7. after complete + extra PUTAWAY → rejected", () => {
    const mid = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    const done = applyPutaway(mid, SCN_007_SPLIT_BIN_2, 100).state;
    expect(detectScn007PutawayPhase(done)).toBe("PUTAWAY_COMPLETE");
    const check = validateScn007PutawayContract(done, {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      qty: 1,
      lotNumber: SCN_007_LOT,
    });
    expect(check.allowed).toBe(false);
    if (!check.allowed) expect(check.reasonFr).toMatch(/déjà terminé|terminé/i);
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
    const check = validateScn007PutawayContract(scn007State(), {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      qty: 500,
      lotNumber: "LOT-2025-001",
    });
    expect(check.allowed).toBe(false);
  });
});

describe("SCN-007 — G. Wrong destination", () => {
  it("blocks bins other than L1 on initial (and L2/L1 out of order)", () => {
    const check = validateScn007PutawayContract(scn007State(), {
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
  it("14. keeps LOT-A/B/C FIFO order intact", () => {
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
  it("11. score not credited on invalid attempt; max 100 without FIFO", () => {
    const sum = Object.values(SCN_007_STEP_MAX).reduce((s, n) => s + n, 0);
    expect(sum).toBe(100);
    expect(getScn007StepMaxPoints("PUTAWAY")).toBe(40);
    expect(getScn007StockAccuracyPoints(0)).toBe(30);
    expect(getScn007StepMaxPoints("COMPLIANCE_ADV")).toBe(30);
    expect(getScn007StepMaxPoints("FIFO_PICK")).toBe(0);

    const { state: after, mutated } = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 400);
    expect(mutated).toBe(false);
    expect(after.completedSteps).not.toContain("PUTAWAY");
    expect(isScn007PutawayComplete(after)).toBe(false);
  });
});

describe("SCN-007 — M. Monitor contract", () => {
  it("8. monitor after rejected 400 contains only PO/GR", () => {
    const before = scn007State();
    const { state: after, mutated } = applyPutaway(before, SCN_007_SPLIT_BIN_1, 400);
    expect(mutated).toBe(false);
    const business = toScn007MonitorBusinessRows(after.transactions);
    expect(business.map((r) => r.docRef)).toEqual(["PO-M2-002", "GR-M2-002"]);
    expect(business.some((r) => r.docType === "PUTAWAY")).toBe(false);
  });

  it("9. monitor after correct path contains two business PUTAWAY movements", () => {
    const mid = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    const done = applyPutaway(mid, SCN_007_SPLIT_BIN_2, 100).state;
    const business = toScn007MonitorBusinessRows(done.transactions);
    const putaways = business.filter((r) => r.docType === "PUTAWAY");
    expect(putaways).toHaveLength(2);
    expect(putaways[0]).toMatchObject({
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      qty: 500,
      lot: SCN_007_LOT,
    });
    expect(putaways[1]).toMatchObject({
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_2,
      qty: 100,
      lot: SCN_007_LOT,
    });
    expect(business.filter((r) => r.docRef === "PO-M2-002" || r.docRef === "GR-M2-002")).toHaveLength(2);
  });
});

describe("SCN-007 — N. completedSteps / progression", () => {
  it("10. completedSteps does not advance on invalid attempt", () => {
    const { state: after } = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 400);
    expect(after.completedSteps).toEqual(["GR"]);
    expect(getEffectiveM2CompletedSteps(after.completedSteps, after as any)).toEqual(["GR"]);
    expect(getNextRequiredStepAllModules(after.completedSteps, 2, after as any)?.code).toBe("PUTAWAY");
  });
});

describe("SCN-007 — O. Both endpoints share canonical contract", () => {
  it("12. m2.submitPUTAWAY and warehouse.submitPutaway both call validateScn007PutawayContract", () => {
    const src = readFileSync(join(__dirname, "routers.ts"), "utf8");
    const calls = src.match(/validateScn007PutawayContract\(/g) ?? [];
    expect(calls.length).toBeGreaterThanOrEqual(2);
    // Alias remains available for shared identity
    expect(validateScn007PutawayContract).toBe(validateScn007PutawayInput);

    // Both endpoints reject before mutation (throw BAD_REQUEST, no demo soft-pass).
    const warehouseBlock = src.indexOf("submitPutaway: protectedProcedure");
    const m2Block = src.indexOf("submitPUTAWAY: protectedProcedure");
    expect(warehouseBlock).toBeGreaterThan(-1);
    expect(m2Block).toBeGreaterThan(-1);
    const warehouseSlice = src.slice(warehouseBlock, warehouseBlock + 4500);
    const m2Slice = src.slice(m2Block, m2Block + 5500);
    expect(warehouseSlice).toContain("validateScn007PutawayContract");
    expect(m2Slice).toContain("validateScn007PutawayContract");
    expect(warehouseSlice).toContain('code: "BAD_REQUEST"');
    expect(m2Slice).toContain('code: "BAD_REQUEST"');
    // Contract runs before addTransaction / addPutawayRecord
    const whContract = warehouseSlice.indexOf("validateScn007PutawayContract");
    const whMutate = warehouseSlice.indexOf("addPutawayRecord");
    expect(whContract).toBeGreaterThan(-1);
    expect(whMutate).toBeGreaterThan(whContract);
    const m2Contract = m2Slice.indexOf("validateScn007PutawayContract");
    const m2Mutate = m2Slice.indexOf("addTransaction");
    expect(m2Contract).toBeGreaterThan(-1);
    expect(m2Mutate).toBeGreaterThan(m2Contract);
  });

  it("allowed move helper matches phase", () => {
    expect(getScn007AllowedPutaway(scn007State())).toEqual({
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      sku: SCN_007_SKU,
      lotNumber: SCN_007_LOT,
      qty: 500,
    });
    const mid = applyPutaway(scn007State(), SCN_007_SPLIT_BIN_1, 500).state;
    expect(getScn007AllowedPutaway(mid)?.qty).toBe(100);
    expect(getScn007AllowedPutaway(mid)?.toBin).toBe(SCN_007_SPLIT_BIN_2);
  });
});

describe("SCN-007 — P. Non-regression SCN-006 (generic putaway)", () => {
  it("13. SCN-006 is not gated by SCN-007 contract", () => {
    const scn006 = {
      scnCode: "SCN-006",
      scenarioId: 6,
      inventory: { "SKU-001::REC-01": 150 },
      transactions: [],
    };
    const check = validateScn007PutawayContract(scn006, {
      sku: "SKU-001",
      fromBin: "REC-01",
      toBin: "B-01-R1-L1",
      qty: 150,
      lotNumber: "LOT-2025-001",
    });
    expect(check.allowed).toBe(true);
    expect(isScn007Scenario(scn006)).toBe(false);
  });
});

describe("SCN-007 — Q. Canonical sequence required for completion", () => {
  it("terminal inventory via non-canonical multi-move does not complete", () => {
    const contaminated = scn007State({
      inventory: {
        "SKU-002::REC-01": 0,
        "SKU-002::B-01-R1-L1": 500,
        "SKU-002::B-01-R1-L2": 100,
      },
      transactions: [
        ...SCN_007_SEED.preloadedTransactions,
        { docType: "PUTAWAY", sku: SCN_007_SKU, bin: SCN_007_SPLIT_BIN_1, qty: 400, posted: true, docRef: "PUT-bad-1" },
        { docType: "PUTAWAY", sku: SCN_007_SKU, bin: SCN_007_SPLIT_BIN_1, qty: 100, posted: true, docRef: "PUT-bad-2" },
        { docType: "PUTAWAY", sku: SCN_007_SKU, bin: SCN_007_SPLIT_BIN_2, qty: 100, posted: true, docRef: "PUT-bad-3" },
      ],
    });
    expect(getScn007PostedPutawayCredits(contaminated.transactions)).toHaveLength(3);
    expect(hasScn007CanonicalPutawaySequence(contaminated)).toBe(false);
    expect(isScn007PutawayComplete(contaminated)).toBe(false);
  });
});
