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

export function isScn004(scnCode: string | null | undefined): boolean {
  return scnCode === "SCN-004";
}

export function getScn004TargetBin(initialState?: Record<string, unknown> | null): string {
  const fromSeed = initialState?.cycleCountTarget as { bin?: string } | undefined;
  if (fromSeed?.bin && typeof fromSeed.bin === "string") return fromSeed.bin;
  return SCN_004_TARGET_BIN;
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
    const hasCorrectAdj = cleanedTxs.some(
      (tx) =>
        tx.docType === "ADJ" &&
        tx.sku === SCN_004_SKU &&
        tx.bin === targetBin &&
        tx.posted,
    );
    const current = inventory[key] ?? 0;
    const target = resolvedCc.physicalQty;
    const preAdjStock = SCN_004_PHYSICAL_QTY - SCN_004_VARIANCE;

    if (!hasCorrectAdj && Math.abs(current - target) > 0.01) {
      if (Math.abs(current - preAdjStock) < 0.01 || current > target) {
        inventory[key] = target;
      }
    } else if (hasCorrectAdj && Math.abs(current - target) > 0.01) {
      inventory[key] = target;
    }
  }

  return { ...state, transactions: cleanedTxs, cycleCounts: normalizedCCs, inventory };
}
