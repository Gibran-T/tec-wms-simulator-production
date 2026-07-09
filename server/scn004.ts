/**
 * SCN-004 — Écart d'inventaire (SKU-006)
 * Canonical bins: REC-01 (reception) → B-02-R1-L1 (putaway / CC / ADJ).
 * Never REC-02, B-01-R1-L2, or EXP-01 for inventory adjustment.
 */
import {
  calculateInventory,
  EXPEDITION_BINS,
  RECEPTION_BINS,
} from "./rulesEngine";

export const SCN_004_SKU = "SKU-006";
export const SCN_004_TARGET_BIN = "B-02-R1-L1";
export const SCN_004_PHYSICAL_QTY = 185;
export const SCN_004_VARIANCE = -15;

export type Scn004Tx = {
  docType: string;
  sku: string;
  bin: string;
  qty: number;
  posted: boolean;
  docRef?: string | null;
};

export type Scn004CycleCount = {
  sku: string;
  bin: string;
  variance: number;
  resolved: boolean;
  systemQty?: number;
  physicalQty?: number;
};

export type Scn004CycleCountTarget = {
  sku: string;
  bin: string;
  physicalQty: number;
  variance: number;
  systemQty?: number;
};

export function isScn004(scnCode: string | null | undefined): boolean {
  return scnCode === "SCN-004";
}

export function isScn004Scenario(state: {
  scnCode?: string | null;
  scenarioId?: number | null;
  scenarioName?: string | null;
} | null | undefined): boolean {
  if (!state) return false;
  if (state.scnCode === "SCN-004") return true;
  if (state.scenarioId === 4) return true;
  const name = String(state.scenarioName ?? "");
  return /SCN-004|Scénario 4|Scenario 4/i.test(name);
}

/** Inventory-audit-only M1 pipeline — no outbound (SO / PICKING / GI). */
export const SCN_004_M1_STEPS = [
  { code: "PO", labelFr: "Bon de commande (ME21N)", labelEn: "Purchase Order (ME21N)", order: 1, prerequisite: null, moduleId: 1 },
  { code: "GR", labelFr: "Réception quai (MIGO)", labelEn: "Goods Receipt — Dock (MIGO)", order: 2, prerequisite: "PO", moduleId: 1 },
  { code: "PUTAWAY_M1", labelFr: "Rangement stock (LT0A)", labelEn: "Putaway to Stock (LT0A)", order: 3, prerequisite: "GR", moduleId: 1 },
  { code: "STOCK", labelFr: "Stock disponible", labelEn: "Stock Available", order: 4, prerequisite: "PUTAWAY_M1", moduleId: 1 },
  { code: "CC", labelFr: "Comptage cyclique (MI01)", labelEn: "Cycle Count (MI01)", order: 5, prerequisite: "STOCK", moduleId: 1 },
  { code: "ADJ", labelFr: "Ajustement inventaire (MI07)", labelEn: "Inventory Adjustment (MI07)", order: 6, prerequisite: "CC", moduleId: 1 },
  { code: "COMPLIANCE", labelFr: "Conformité système", labelEn: "System Compliance", order: 7, prerequisite: "ADJ", moduleId: 1 },
] as const;

/** Redistributes outbound step budget (SO+PICKING+GI) across inventory-audit steps — still 100 pts. */
export const SCN_004_STEP_MAX: Record<string, number> = {
  PO: 10,
  GR: 10,
  PUTAWAY_M1: 25,
  STOCK: 5,
  CC: 10,
  ADJ: 0,
  COMPLIANCE: 40,
};

export function getScn004StepMaxPoints(stepCode: string): number {
  return SCN_004_STEP_MAX[stepCode] ?? 0;
}

export function getScn004OutboundBlockMessage(lang: "fr" | "en" = "fr") {
  if (lang === "en") {
    return {
      reason: "SCN-004 is an inventory audit scenario — outbound shipping steps are not part of this mission.",
      reasonFr: "SCN-004 est un scénario d'audit inventaire — les étapes d'expédition ne font pas partie de cette mission.",
      reasonEn: "SCN-004 is an inventory audit scenario — outbound shipping steps are not part of this mission.",
    };
  }
  return {
    reason: "SCN-004 est un scénario d'audit inventaire — les étapes d'expédition ne font pas partie de cette mission.",
    reasonFr: "SCN-004 est un scénario d'audit inventaire — les étapes d'expédition ne font pas partie de cette mission.",
    reasonEn: "SCN-004 is an inventory audit scenario — outbound shipping steps are not part of this mission.",
  };
}

export function getScn004TargetBin(initialState?: Record<string, unknown> | null): string {
  return getScn004CycleCountTarget(initialState).bin;
}

/** Pedagogical CC contract — system 200 / physical 185 / variance −15 at B-02-R1-L1. */
export function getScn004CycleCountTarget(
  initialState?: Record<string, unknown> | null,
): Scn004CycleCountTarget {
  const fromSeed = initialState?.cycleCountTarget as Scn004CycleCountTarget | undefined;
  if (
    fromSeed?.sku &&
    fromSeed?.bin &&
    typeof fromSeed.physicalQty === "number" &&
    typeof fromSeed.variance === "number"
  ) {
    return {
      ...fromSeed,
      systemQty: fromSeed.systemQty ?? fromSeed.physicalQty - fromSeed.variance,
    };
  }
  return {
    sku: SCN_004_SKU,
    bin: SCN_004_TARGET_BIN,
    physicalQty: SCN_004_PHYSICAL_QTY,
    variance: SCN_004_VARIANCE,
    systemQty: SCN_004_PHYSICAL_QTY - SCN_004_VARIANCE,
  };
}

/**
 * Resolve M1 cycle count quantities for SCN-004.
 * When the CC target matches, inject pedagogical systemQty (200) for variance −15 at physical 185.
 */
export function resolveScn004CycleCount(
  initialState: Record<string, unknown> | null | undefined,
  input: { sku: string; bin: string; physicalQty: number },
  inventorySystemQty: number,
): { systemQty: number; physicalQty: number; variance: number; injected: boolean } {
  const target = getScn004CycleCountTarget(initialState);
  if (input.sku !== target.sku || input.bin !== target.bin) {
    return {
      systemQty: inventorySystemQty,
      physicalQty: input.physicalQty,
      variance: input.physicalQty - inventorySystemQty,
      injected: false,
    };
  }
  const systemQty = target.systemQty ?? target.physicalQty - target.variance;
  const physicalQty = target.physicalQty;
  return {
    systemQty,
    physicalQty,
    variance: physicalQty - systemQty,
    injected: true,
  };
}

export function isBadScn004AdjAtExpedition(tx: Scn004Tx): boolean {
  return (
    tx.docType === "ADJ" &&
    tx.sku === SCN_004_SKU &&
    tx.posted &&
    EXPEDITION_BINS.includes(tx.bin)
  );
}

/** Reject cycle counts at reception/expedition bins or empty storage for SCN-004. */
export function validateM1CycleCountForScn004(
  state: {
    inventory: Record<string, number>;
    scnCode?: string | null;
    scenarioInitialStateJson?: Record<string, unknown> | null;
  },
  input: { sku: string; bin: string },
) {
  if (!isScn004(state.scnCode) || input.sku !== SCN_004_SKU) {
    return { allowed: true as const };
  }

  const targetBin = getScn004TargetBin(state.scenarioInitialStateJson);
  if (input.bin === targetBin) return { allowed: true as const };

  const stockAtBin = state.inventory[`${input.sku}::${input.bin}`] ?? 0;
  if (
    EXPEDITION_BINS.includes(input.bin) ||
    RECEPTION_BINS.includes(input.bin) ||
    stockAtBin === 0
  ) {
    return {
      allowed: false as const,
      reason: `Cycle count must be at ${targetBin}, not ${input.bin}`,
      reasonFr: `Le comptage cyclique SKU-006 doit être effectué à ${targetBin} (zone STOCKAGE), pas à ${input.bin}.`,
      reasonEn: `SKU-006 cycle count must be performed at ${targetBin} (STOCKAGE zone), not ${input.bin}.`,
    };
  }

  return { allowed: true as const };
}

/** Reject ADJ at expedition/reception when cycle count is on storage bin. */
export function validateScn004AdjBin(
  cycleCounts: Scn004CycleCount[],
  input: { sku: string; bin: string },
) {
  if (input.sku !== SCN_004_SKU) return { allowed: true as const };

  const pending = cycleCounts.filter(
    (c) => c.sku === input.sku && c.variance !== 0 && !c.resolved,
  );
  const ccBin = pending.find((c) => c.bin === SCN_004_TARGET_BIN)?.bin ?? pending[0]?.bin;

  if (EXPEDITION_BINS.includes(input.bin)) {
    return {
      allowed: false as const,
      reason: `ADJ cannot be posted at expedition bin ${input.bin}`,
      reasonFr: `L'ajustement MI07 ne peut pas être posté en zone EXPÉDITION (${input.bin}). Postez sur ${ccBin ?? SCN_004_TARGET_BIN}.`,
      reasonEn: `MI07 adjustment cannot be posted at expedition bin (${input.bin}). Post at ${ccBin ?? SCN_004_TARGET_BIN}.`,
    };
  }

  if (RECEPTION_BINS.includes(input.bin) && input.bin !== ccBin) {
    return {
      allowed: false as const,
      reason: `ADJ cannot be posted at reception bin ${input.bin}`,
      reasonFr: `L'ajustement MI07 ne peut pas être posté en zone RÉCEPTION (${input.bin}). Postez sur ${ccBin ?? SCN_004_TARGET_BIN}.`,
      reasonEn: `MI07 adjustment cannot be posted at reception bin (${input.bin}). Post at ${ccBin ?? SCN_004_TARGET_BIN}.`,
    };
  }

  return { allowed: true as const };
}

/**
 * Recover broken SCN-004 runs:
 * - Ignore bad ADJ-AUTO at EXP-01 (negative expedition stock)
 * - Remap cycle counts wrongly recorded at REC-02 / other bins to B-02-R1-L1
 * - Normalize inventory to physicalQty 185 at target bin when CC is resolved
 */
export function recoverScn004RunState<
  T extends {
    scnCode: string | null;
    transactions: Scn004Tx[];
    cycleCounts: Scn004CycleCount[];
    inventory: Record<string, number>;
  },
>(state: T): T {
  if (!isScn004(state.scnCode)) return state;

  const targetBin = SCN_004_TARGET_BIN;
  const cleanedTxs = state.transactions.filter((tx) => !isBadScn004AdjAtExpedition(tx));

  const normalizedCCs = state.cycleCounts.map((cc) => {
    if (cc.sku !== SCN_004_SKU || cc.bin === targetBin) return cc;

    const matchesPattern =
      Math.abs(cc.variance - SCN_004_VARIANCE) < 0.01 ||
      cc.physicalQty === SCN_004_PHYSICAL_QTY ||
      (cc.systemQty != null &&
        cc.physicalQty != null &&
        Math.abs(cc.physicalQty - cc.systemQty - SCN_004_VARIANCE) < 0.01);

    if (!matchesPattern) return cc;

    return {
      ...cc,
      bin: targetBin,
      systemQty: cc.systemQty ?? SCN_004_PHYSICAL_QTY - SCN_004_VARIANCE,
      physicalQty: cc.physicalQty ?? SCN_004_PHYSICAL_QTY,
      variance: SCN_004_VARIANCE,
    };
  });

  const inventory = calculateInventory(cleanedTxs);

  for (const expBin of EXPEDITION_BINS) {
    const key = `${SCN_004_SKU}::${expBin}`;
    if ((inventory[key] ?? 0) < 0) inventory[key] = 0;
  }

  const resolvedCc = normalizedCCs.find(
    (c) =>
      c.sku === SCN_004_SKU &&
      c.bin === targetBin &&
      c.resolved &&
      c.physicalQty != null,
  );

  if (resolvedCc?.physicalQty != null) {
    const key = `${SCN_004_SKU}::${targetBin}`;
    const target = resolvedCc.physicalQty;
    if (Math.abs((inventory[key] ?? 0) - target) > 0.01) {
      inventory[key] = target;
    }
  }

  return { ...state, transactions: cleanedTxs, cycleCounts: normalizedCCs, inventory };
}
