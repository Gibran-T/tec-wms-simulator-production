import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  canExecuteStep,
  checkCompliance,
  validateAdjQuantity,
  type RunState,
} from "./rulesEngine";

const positiveTransactionQty = z.number().positive();

function makeState(
  completedSteps: string[],
  transactions: RunState["transactions"] = [],
  inventory: Record<string, number> = {},
  cycleCounts: RunState["cycleCounts"] = [],
): RunState {
  return {
    completedSteps: completedSteps as RunState["completedSteps"],
    transactions,
    inventory,
    cycleCounts,
    scenarioId: 4,
    scnCode: "SCN-004",
  };
}

describe("RC17-C — validateAdjQuantity (ADJ / MI07)", () => {
  it("accepts -15 (inventory decrease / write-off)", () => {
    const result = validateAdjQuantity(-15);
    expect(result.allowed).toBe(true);
  });

  it("accepts +15 (inventory increase / correction)", () => {
    const result = validateAdjQuantity(15);
    expect(result.allowed).toBe(true);
  });

  it("rejects 0 with MI07-specific French message", () => {
    const result = validateAdjQuantity(0);
    expect(result.allowed).toBe(false);
    expect(result.reasonFr).toBe(
      "Saisissez un écart d'inventaire positif ou négatif. La valeur 0 n'est pas acceptée.",
    );
  });

  it("rejects NaN", () => {
    const result = validateAdjQuantity(Number.NaN);
    expect(result.allowed).toBe(false);
  });
});

describe("RC17-C — standard transaction qty still requires positive values", () => {
  const protectedDocTypes = ["GR", "PUTAWAY_M1", "PICKING_M1", "GI", "SO"] as const;

  it.each(protectedDocTypes)("rejects negative qty for %s", (docType) => {
    expect(() => positiveTransactionQty.parse(-15)).toThrow();
    expect(positiveTransactionQty.parse(15)).toBe(15);
    void docType;
  });

  it("rejects zero qty for standard transactions", () => {
    expect(() => positiveTransactionQty.parse(0)).toThrow();
  });
});

describe("RC17-C — ADJ to COMPLIANCE flow after valid -15 adjustment", () => {
  const unresolvedCycleCount = {
    id: 1,
    runId: 132,
    sku: "SKU-006",
    bin: "B-01-R1-L2",
    systemQty: "15",
    physicalQty: "0",
    variance: "-15",
    resolved: false,
    createdAt: new Date(),
  };

  it("COMPLIANCE blocked before ADJ when variance is unresolved", () => {
    const state = makeState(
      ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO", "PICKING_M1", "GI", "CC"],
      [],
      { "SKU-006::B-01-R1-L2": 0 },
      [unresolvedCycleCount],
    );
    expect(canExecuteStep("COMPLIANCE", state).allowed).toBe(false);
    expect(checkCompliance(state).compliant).toBe(false);
  });

  it("COMPLIANCE allowed after ADJ with -15 resolves variance", () => {
    const state = makeState(
      ["PO", "GR", "PUTAWAY_M1", "STOCK", "SO", "PICKING_M1", "GI", "CC", "ADJ"],
      [
        {
          id: 1,
          runId: 132,
          docType: "ADJ",
          sku: "SKU-006",
          bin: "B-01-R1-L2",
          qty: "-15",
          posted: true,
          docRef: "ADJ-AUTO",
          moveType: "701",
          comment: null,
          createdAt: new Date(),
        },
      ],
      { "SKU-006::B-01-R1-L2": 0 },
      [{ ...unresolvedCycleCount, resolved: true }],
    );
    expect(validateAdjQuantity(-15).allowed).toBe(true);
    expect(canExecuteStep("COMPLIANCE", state).allowed).toBe(true);
    expect(checkCompliance(state).compliant).toBe(true);
  });
});
