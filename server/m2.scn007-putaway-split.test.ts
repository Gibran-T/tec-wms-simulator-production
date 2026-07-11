/**
 * SCN-007 — capacity split completion + FIFO gate (pedagogical hotfix)
 * Covers: initial state, 500 then 100, partial 400, overflow, wrong lot, FIFO, non-regression hooks.
 */
import { describe, expect, it } from "vitest";
import {
  buildM2FifoLotCatalog,
  calculateInventory,
  checkCompliance,
  canExecuteStepM2,
  getNextRequiredStepAllModules,
  isM2PutawayStepComplete,
  validateM2FifoPick,
  validatePutaway,
} from "./rulesEngine";
import {
  getScn007NextActionHint,
  isScn007PutawayComplete,
  isScn007Scenario,
  projectInventoryAfterPutaway,
  SCN_007_FIFO_BIN,
  SCN_007_NEW_LOT,
  SCN_007_OLD_LOT,
  SCN_007_REC_BIN,
  SCN_007_SKU,
  SCN_007_SPLIT_BIN_1,
  SCN_007_SPLIT_BIN_2,
  validateScn007PutawayInput,
} from "./scn007";
import { EXTENDED_MISSIONS } from "./missionDataExtended";
import { getCockpitPedagogy } from "../client/src/data/scenarioCockpitPedagogy";

const SCN_007_SEED = {
  preloadedTransactions: [
    { docType: "PO", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "PO-M2-002" },
    { docType: "GR", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "GR-M2-002" },
    { docType: "GR", sku: "SKU-002", bin: "B-02-R1-L1", qty: 100, posted: true, docRef: "GR-M2-002-FIFO" },
  ],
  lots: [
    { lotNumber: "LOT-2025-001", receivedAt: "2025-01-15T08:00:00Z", qty: 100 },
    { lotNumber: "LOT-2025-002", receivedAt: "2025-02-01T10:00:00Z", qty: 600 },
  ],
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

describe("SCN-007 — A. initial state", () => {
  it("starts with 600 LOT-2025-002 at REC-01, 100 LOT-2025-001 at B-02, total 700", () => {
    const inv = initialInventory();
    expect(inv["SKU-002::REC-01"]).toBe(600);
    expect(inv["SKU-002::B-02-R1-L1"]).toBe(100);
    const total = Object.values(inv).reduce((s, q) => s + Number(q), 0);
    expect(total).toBe(700);
    expect(isScn007Scenario(scn007State())).toBe(true);
    expect(isScn007PutawayComplete(scn007State())).toBe(false);
  });

  it("mission briefing explains prior stock and dual putaway", () => {
    const mission = EXTENDED_MISSIONS["SCN-007"];
    expect(mission.context).toContain("LOT-2025-001");
    expect(mission.context).toContain("B-02-R1-L1");
    expect(mission.context).toContain("GR-M2-002-FIFO");
    expect(mission.context).toContain("600");
    expect(mission.controlPoints.some((p) => p.includes("Stock pré-existant"))).toBe(true);
    expect(mission.controlPoints.some((p) => p.includes("Premier PUTAWAY"))).toBe(true);
    expect(mission.controlPoints.some((p) => p.includes("Deuxième PUTAWAY"))).toBe(true);
    const pedagogy = getCockpitPedagogy("SCN-007");
    expect(pedagogy?.situation.fr).toContain("stock antérieur");
    expect(pedagogy?.operationalProblem.fr).toContain("LOT-2025-002");
    expect(pedagogy?.operationalProblem.fr).toContain("LOT-2025-001");
  });
});

describe("SCN-007 — B. first PUTAWAY 500", () => {
  it("leaves 100 in REC-01, does not complete PUTAWAY, blocks FIFO_PICK", () => {
    const before = scn007State();
    const afterInv = projectInventoryAfterPutaway(before.inventory, {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      qty: 500,
    });
    const after = scn007State({
      inventory: afterInv,
      completedSteps: ["GR"], // must NOT include PUTAWAY yet
    });

    expect(afterInv["SKU-002::REC-01"]).toBe(100);
    expect(afterInv["SKU-002::B-01-R1-L1"]).toBe(500);
    expect(isScn007PutawayComplete(after)).toBe(false);
    expect(isM2PutawayStepComplete(after)).toBe(false);

    const next = getNextRequiredStepAllModules(["GR", "PUTAWAY"], 2, after);
    expect(next?.code).toBe("PUTAWAY"); // effective steps strip premature PUTAWAY

    const fifo = canExecuteStepM2("FIFO_PICK", { ...after, completedSteps: ["GR", "PUTAWAY"] });
    expect(fifo.allowed).toBe(false);

    const hint = getScn007NextActionHint(after);
    expect(hint?.titleFr).toMatch(/Deuxième rangement/i);
    expect(hint?.fr).toContain("B-01-R1-L2");

    const compliance = checkCompliance(after);
    expect(compliance.compliant).toBe(false);
    expect(compliance.issuesFr.join(" ")).toMatch(/Rangement incomplet/i);
  });
});

describe("SCN-007 — C. second PUTAWAY 100", () => {
  it("clears REC-01, completes PUTAWAY, releases FIFO_PICK", () => {
    let inv = initialInventory();
    inv = projectInventoryAfterPutaway(inv, {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      qty: 500,
    });
    inv = projectInventoryAfterPutaway(inv, {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_2,
      qty: 100,
    });

    expect(inv["SKU-002::REC-01"]).toBe(0);
    expect(inv["SKU-002::B-01-R1-L1"]).toBe(500);
    expect(inv["SKU-002::B-01-R1-L2"]).toBe(100);
    expect(inv["SKU-002::B-02-R1-L1"]).toBe(100);

    const after = scn007State({ inventory: inv, completedSteps: ["GR", "PUTAWAY"] });
    expect(isScn007PutawayComplete(after)).toBe(true);
    expect(isM2PutawayStepComplete(after)).toBe(true);

    const next = getNextRequiredStepAllModules(["GR", "PUTAWAY"], 2, after);
    expect(next?.code).toBe("FIFO_PICK");

    const fifo = canExecuteStepM2("FIFO_PICK", after);
    expect(fifo.allowed).toBe(true);

    const compliance = checkCompliance(after);
    expect(compliance.compliant).toBe(true);
    expect(getScn007NextActionHint(after)).toBeNull();
  });
});

describe("SCN-007 — D. incorrect distribution 400", () => {
  it("does not complete step, does not mark compliant, does not release FIFO", () => {
    const afterInv = projectInventoryAfterPutaway(initialInventory(), {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      qty: 400,
    });
    const after = scn007State({
      inventory: afterInv,
      completedSteps: ["GR", "PUTAWAY"], // simulate premature mark (run 456 bug)
    });

    expect(afterInv["SKU-002::REC-01"]).toBe(200);
    expect(isScn007PutawayComplete(after)).toBe(false);
    expect(getNextRequiredStepAllModules(after.completedSteps, 2, after)?.code).toBe("PUTAWAY");
    expect(canExecuteStepM2("FIFO_PICK", after).allowed).toBe(false);
    expect(checkCompliance(after).compliant).toBe(false);
  });
});

describe("SCN-007 — E. overflow 600 into B-01-R1-L1", () => {
  it("blocks by capacity max 500", () => {
    const result = validatePutaway({
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
    expect(result.allowed).toBe(false);
    expect(result.penaltyEvent).toBe("CAPACITY_OVERFLOW");
  });
});

describe("SCN-007 — F. wrong lot on putaway", () => {
  it("blocks LOT-2025-001 putaway and requires LOT-2025-002", () => {
    const state = scn007State();
    const wrong = validateScn007PutawayInput(state, {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      qty: 500,
      lotNumber: SCN_007_OLD_LOT,
    });
    expect(wrong.allowed).toBe(false);
    if (!wrong.allowed) {
      expect(wrong.reasonFr).toContain(SCN_007_NEW_LOT);
    }

    const ok = validateScn007PutawayInput(state, {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      qty: 500,
      lotNumber: SCN_007_NEW_LOT,
    });
    expect(ok.allowed).toBe(true);
  });

  it("blocks contractual overflow into B-01-R1-L2 beyond 100", () => {
    const state = scn007State();
    const check = validateScn007PutawayInput(state, {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_2,
      qty: 200,
      lotNumber: SCN_007_NEW_LOT,
    });
    expect(check.allowed).toBe(false);
  });
});

describe("SCN-007 — G. FIFO after complete split", () => {
  it("accepts LOT-2025-001 and blocks LOT-2025-002 while old lot has stock", () => {
    let inv = initialInventory();
    inv = projectInventoryAfterPutaway(inv, {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      qty: 500,
    });
    inv = projectInventoryAfterPutaway(inv, {
      sku: SCN_007_SKU,
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_2,
      qty: 100,
    });

    const putawayRecords = [
      {
        sku: SCN_007_SKU,
        toBin: SCN_007_SPLIT_BIN_1,
        lotNumber: SCN_007_NEW_LOT,
        receivedAt: new Date("2025-02-01T10:00:00Z"),
        qty: 500,
      },
      {
        sku: SCN_007_SKU,
        toBin: SCN_007_SPLIT_BIN_2,
        lotNumber: SCN_007_NEW_LOT,
        receivedAt: new Date("2025-02-01T10:00:00Z"),
        qty: 100,
      },
    ];
    const catalog = buildM2FifoLotCatalog(putawayRecords, SCN_007_SEED);

    const ok = validateM2FifoPick({
      sku: SCN_007_SKU,
      lotNumber: SCN_007_OLD_LOT,
      catalog,
      inventory: inv,
    });
    expect(ok.allowed).toBe(true);

    const blocked = validateM2FifoPick({
      sku: SCN_007_SKU,
      lotNumber: SCN_007_NEW_LOT,
      catalog,
      inventory: inv,
    });
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.requiredLot).toBe(SCN_007_OLD_LOT);
    }

    expect(catalog.some((e) => e.lotNumber === SCN_007_OLD_LOT && e.toBin === SCN_007_FIFO_BIN)).toBe(true);
  });
});

describe("SCN-007 — H. non-regression SCN-006 / SCN-008", () => {
  it("SCN-008 keeps LOT-A/B/C nomenclature and auto-satisfied putaway", () => {
    const mission = EXTENDED_MISSIONS["SCN-008"];
    expect(mission.context).toContain("LOT-A");
    expect(mission.context).toContain("LOT-B");
    expect(mission.context).toContain("LOT-C");
    expect(String(mission.technicalSpecs.expectedTransaction ?? "")).toContain("LOT-A");
    expect(String(mission.technicalSpecs.lotNumber ?? "")).not.toContain("LOT-2025-002");

    const inv = calculateInventory(
      SCN_008_SEED.preloadedTransactions.map((t) => ({
        docType: t.docType,
        sku: t.sku,
        bin: t.bin,
        qty: t.qty,
        posted: t.posted,
      })),
    );
    const state = {
      scnCode: "SCN-008",
      scenarioId: 8,
      completedSteps: ["GR"],
      transactions: SCN_008_SEED.preloadedTransactions,
      cycleCounts: [],
      inventory: inv,
      scenarioInitialStateJson: SCN_008_SEED,
    };
    expect(isM2PutawayStepComplete(state)).toBe(true);
    expect(getNextRequiredStepAllModules(["GR"], 2, state)?.code).toBe("FIFO_PICK");
  });

  it("SCN-006 mission remains intact (single-lot putaway briefing)", () => {
    const mission = EXTENDED_MISSIONS["SCN-006"];
    expect(mission.scnCode).toBe("SCN-006");
    expect(mission.technicalSpecs.sku).toBe("SKU-001");
    expect(mission.context).not.toContain("LOT-2025-002");
  });
});
