/**
 * SCN-005 — Multi-anomaly capstone (SKU-004 ghost GR + SKU-005 dual putaway + CC −8)
 * Canonical flow: post GR-2025-004 → dual putaway → CC/ADJ SKU-005 at B-01-R1-L2 → COMPLIANCE.
 * Inventory-audit finish (no SO / PICKING / GI) — outbound would desync CC book stock from ledger.
 */
import { calculateInventory, EXPEDITION_BINS, RECEPTION_BINS } from "./rulesEngine";

const STOCKAGE_BINS = ["B-01-R1-L1", "B-01-R1-L2", "B-02-R1-L1", "TRANSIT-01"];
const GHOST_GR_DOC_REFS = new Set(["GR-2025-001", "GR-2025-004"]);

export const SCN_005_SKU_A = "SKU-004";
export const SCN_005_SKU_B = "SKU-005";
export const SCN_005_GHOST_GR = "GR-2025-004";
export const SCN_005_CC_BIN = "B-01-R1-L2";
export const SCN_005_PHYSICAL_QTY = 52;
export const SCN_005_SYSTEM_QTY = 60;
export const SCN_005_VARIANCE = -8;

export type Scn005PutawayTarget = {
  sku: string;
  fromBin: string;
  toBin: string;
  qty: number;
};

export type Scn005CycleCountTarget = {
  sku: string;
  bin: string;
  physicalQty: number;
  variance: number;
  systemQty?: number;
};

/** Inventory-audit M1 pipeline — ghost GR + dual putaway, no outbound (SO / PICKING / GI). */
export const SCN_005_M1_STEPS = [
  { code: "PO", labelFr: "Bon de commande (ME21N)", labelEn: "Purchase Order (ME21N)", order: 1, prerequisite: null, moduleId: 1 },
  { code: "GR", labelFr: "Réception quai (MIGO)", labelEn: "Goods Receipt — Dock (MIGO)", order: 2, prerequisite: "PO", moduleId: 1 },
  { code: "PUTAWAY_M1", labelFr: "Rangement stock (LT0A)", labelEn: "Putaway to Stock (LT0A)", order: 3, prerequisite: "GR", moduleId: 1 },
  { code: "STOCK", labelFr: "Stock disponible", labelEn: "Stock Available", order: 4, prerequisite: "PUTAWAY_M1", moduleId: 1 },
  { code: "CC", labelFr: "Comptage cyclique (MI01)", labelEn: "Cycle Count (MI01)", order: 5, prerequisite: "STOCK", moduleId: 1 },
  { code: "ADJ", labelFr: "Ajustement inventaire (MI07)", labelEn: "Inventory Adjustment (MI07)", order: 6, prerequisite: "CC", moduleId: 1 },
  { code: "COMPLIANCE", labelFr: "Conformité système", labelEn: "System Compliance", order: 7, prerequisite: "ADJ", moduleId: 1 },
] as const;

/** Redistributes outbound step budget (SO+PICKING+GI) across audit + ghost-GR steps — still 100 pts. */
export const SCN_005_STEP_MAX: Record<string, number> = {
  PO: 10,
  GR: 15,
  PUTAWAY_M1: 25,
  STOCK: 5,
  CC: 10,
  ADJ: 0,
  COMPLIANCE: 35,
};

export function getScn005StepMaxPoints(stepCode: string): number {
  return SCN_005_STEP_MAX[stepCode] ?? 0;
}

export function getScn005OutboundBlockMessage(lang: "fr" | "en" = "fr") {
  if (lang === "en") {
    return {
      reason: "SCN-005 inventory variance is resolved after putaway — outbound shipping steps are not part of this mission.",
      reasonFr: "SCN-005 : l'écart inventaire se résout après rangement — les étapes d'expédition ne font pas partie de cette mission.",
      reasonEn: "SCN-005 inventory variance is resolved after putaway — outbound shipping steps are not part of this mission.",
    };
  }
  return {
    reason: "SCN-005 : l'écart inventaire se résout après rangement — les étapes d'expédition ne font pas partie de cette mission.",
    reasonFr: "SCN-005 : l'écart inventaire se résout après rangement — les étapes d'expédition ne font pas partie de cette mission.",
    reasonEn: "SCN-005 inventory variance is resolved after putaway — outbound shipping steps are not part of this mission.",
  };
}

export type Scn005Tx = {
  docType: string;
  sku: string;
  bin: string;
  qty: number;
  posted: boolean;
  docRef?: string | null;
};

export type Scn005CycleCount = {
  sku: string;
  bin: string;
  variance: number;
  resolved: boolean;
  systemQty?: number;
  physicalQty?: number;
};

export const SCN_005_PUTAWAY_TARGETS_DEFAULT: Scn005PutawayTarget[] = [
  { sku: SCN_005_SKU_A, fromBin: "REC-01", toBin: "B-01-R1-L1", qty: 30 },
  { sku: SCN_005_SKU_B, fromBin: "REC-02", toBin: SCN_005_CC_BIN, qty: 60 },
];

export function isScn005(scnCode: string | null | undefined): boolean {
  return scnCode === "SCN-005";
}

export function isScn005Scenario(state: {
  scnCode?: string | null;
  scenarioId?: number | null;
  scenarioName?: string | null;
  scenarioInitialStateJson?: Record<string, unknown> | null;
}): boolean {
  if (!state) return false;
  if (isScn005(state.scnCode)) return true;
  if (state.scenarioId === 5) return true;

  const name = String(state.scenarioName ?? "");
  if (/non-conformit[eé]s multiples|multi-anomal/i.test(name)) return true;

  const preload = state.scenarioInitialStateJson?.preloadedTransactions;
  if (Array.isArray(preload)) {
    const hasGhost004 = preload.some(
      (t) =>
        t.docType === "GR" &&
        t.docRef === SCN_005_GHOST_GR &&
        t.sku === SCN_005_SKU_A &&
        !t.posted,
    );
    const hasSku005Rec02 = preload.some(
      (t) => t.docType === "GR" && t.sku === SCN_005_SKU_B && t.bin === "REC-02" && t.posted,
    );
    if (hasGhost004 && hasSku005Rec02) return true;
  }

  const ctx = state.scenarioInitialStateJson?.context;
  if (typeof ctx === "string" && /GR-2025-004.*SKU-005|SKU-005.*REC-02/i.test(ctx)) return true;

  return false;
}

export function getScn005PutawayTargets(
  initialState?: Record<string, unknown> | null,
): Scn005PutawayTarget[] {
  const fromSeed = initialState?.putawayTargets;
  if (Array.isArray(fromSeed) && fromSeed.length >= 2) {
    return fromSeed as Scn005PutawayTarget[];
  }
  return SCN_005_PUTAWAY_TARGETS_DEFAULT;
}

/** Pedagogical CC contract — system 60 / physical 52 / variance −8 at B-01-R1-L2. */
export function getScn005CycleCountTarget(
  initialState?: Record<string, unknown> | null,
): Scn005CycleCountTarget {
  const fromSeed = initialState?.cycleCountTarget as Scn005CycleCountTarget | undefined;
  if (fromSeed?.sku && fromSeed?.bin && typeof fromSeed.variance === "number") {
    return {
      ...fromSeed,
      physicalQty:
        fromSeed.physicalQty ??
        (fromSeed.systemQty != null
          ? fromSeed.systemQty + fromSeed.variance
          : SCN_005_PHYSICAL_QTY),
      systemQty:
        fromSeed.systemQty ??
        (fromSeed.physicalQty != null
          ? fromSeed.physicalQty - fromSeed.variance
          : SCN_005_SYSTEM_QTY),
    };
  }
  return {
    sku: SCN_005_SKU_B,
    bin: SCN_005_CC_BIN,
    physicalQty: SCN_005_PHYSICAL_QTY,
    variance: SCN_005_VARIANCE,
    systemQty: SCN_005_SYSTEM_QTY,
  };
}

/**
 * Resolve M1 cycle count quantities for SCN-005.
 * When the CC target matches, inject pedagogical systemQty (60) for variance −8 at physical 52.
 */
export function resolveScn005CycleCount(
  initialState: Record<string, unknown> | null | undefined,
  input: { sku: string; bin: string; physicalQty: number },
  inventorySystemQty: number,
): { systemQty: number; physicalQty: number; variance: number; injected: boolean } {
  const target = getScn005CycleCountTarget(initialState);
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

/** Reject ADJ at expedition/reception when cycle count is on storage bin. */
export function validateScn005AdjBin(
  cycleCounts: Scn005CycleCount[],
  input: { sku: string; bin: string },
) {
  if (input.sku !== SCN_005_SKU_B) return { allowed: true as const };

  const pending = cycleCounts.filter(
    (c) => c.sku === input.sku && c.variance !== 0 && !c.resolved,
  );
  const ccBin = pending.find((c) => c.bin === SCN_005_CC_BIN)?.bin ?? pending[0]?.bin;

  if (EXPEDITION_BINS.includes(input.bin)) {
    return {
      allowed: false as const,
      reason: `ADJ cannot be posted at expedition bin ${input.bin}`,
      reasonFr: `L'ajustement MI07 ne peut pas être posté en zone EXPÉDITION (${input.bin}). Postez sur ${ccBin ?? SCN_005_CC_BIN}.`,
      reasonEn: `MI07 adjustment cannot be posted at expedition bin (${input.bin}). Post at ${ccBin ?? SCN_005_CC_BIN}.`,
    };
  }

  if (RECEPTION_BINS.includes(input.bin) && input.bin !== ccBin) {
    return {
      allowed: false as const,
      reason: `ADJ cannot be posted at reception bin ${input.bin}`,
      reasonFr: `L'ajustement MI07 ne peut pas être posté en zone RÉCEPTION (${input.bin}). Postez sur ${ccBin ?? SCN_005_CC_BIN}.`,
      reasonEn: `MI07 adjustment cannot be posted at reception bin (${input.bin}). Post at ${ccBin ?? SCN_005_CC_BIN}.`,
    };
  }

  return { allowed: true as const };
}

/** SKUs still sitting at a reception bin — dual putaway not finished. */
export function getScn005PendingPutaways(state: {
  inventory: Record<string, number>;
  scnCode?: string | null;
  scenarioId?: number | null;
  scenarioName?: string | null;
  scenarioInitialStateJson?: Record<string, unknown> | null;
}): Scn005PutawayTarget[] {
  if (!isScn005Scenario(state)) return [];
  const targets = getScn005PutawayTargets(state.scenarioInitialStateJson);
  return targets.filter((target) => {
    const receptionQty = state.inventory[`${target.sku}::${target.fromBin}`] ?? 0;
    return receptionQty > 0;
  });
}

export function isScn005DualPutawayComplete(state: Parameters<typeof getScn005PendingPutaways>[0]): boolean {
  return getScn005PendingPutaways(state).length === 0;
}

export function scn005PutawayBlockMessage(
  pending: Scn005PutawayTarget[],
  lang: "fr" | "en" = "fr",
): { reasonFr: string; reasonEn: string } {
  const skus = pending.map((p) => p.sku).join(", ");
  if (lang === "en") {
    return {
      reasonEn: `Putaway required for all reception stock before continuing (${skus} still at dock). Complete PUTAWAY for each SKU: REC-01 → STOCKAGE and REC-02 → STOCKAGE.`,
      reasonFr: `Rangement requis pour tout le stock en réception (${skus} encore au quai). Complétez le PUTAWAY pour chaque SKU.`,
    };
  }
  return {
    reasonFr: `Rangement requis pour tout le stock en réception (${skus} encore au quai). Complétez le PUTAWAY pour chaque SKU : REC-01 → STOCKAGE et REC-02 → STOCKAGE.`,
    reasonEn: `Putaway required for all reception stock before continuing (${skus} still at dock). Complete PUTAWAY for each SKU.`,
  };
}

export function validateScn005PutawayInput(
  state: {
    inventory: Record<string, number>;
    transactions: Scn005Tx[];
    scnCode?: string | null;
    scenarioId?: number | null;
    scenarioName?: string | null;
    scenarioInitialStateJson?: Record<string, unknown> | null;
  },
  input: { sku: string; fromBin: string; toBin: string; qty: number },
): { allowed: true } | { allowed: false; reasonFr: string; reasonEn: string } {
  if (!isScn005Scenario(state)) return { allowed: true };

  if (
    input.sku === SCN_005_SKU_A &&
    state.transactions.some(
      (t) => t.docType === "GR" && !t.posted && t.docRef === SCN_005_GHOST_GR,
    )
  ) {
    return {
      allowed: false,
      reasonFr: "Poster GR-2025-004 (MIGO) avant le rangement SKU-004.",
      reasonEn: "Post GR-2025-004 (MIGO) before putaway for SKU-004.",
    };
  }

  const pending = getScn005PendingPutaways(state);
  const target = pending.find((p) => p.sku === input.sku);
  if (!target) {
    if (pending.length === 0) return { allowed: true };
    return {
      allowed: false,
      reasonFr: `Aucun rangement en attente pour ${input.sku}. Prochain SKU : ${pending[0]!.sku} (${pending[0]!.fromBin} → ${pending[0]!.toBin}).`,
      reasonEn: `No pending putaway for ${input.sku}. Next SKU: ${pending[0]!.sku} (${pending[0]!.fromBin} → ${pending[0]!.toBin}).`,
    };
  }

  if (input.fromBin !== target.fromBin) {
    return {
      allowed: false,
      reasonFr: `Bin source attendu pour ${target.sku} : ${target.fromBin}, pas ${input.fromBin}.`,
      reasonEn: `Expected source bin for ${target.sku}: ${target.fromBin}, not ${input.fromBin}.`,
    };
  }

  const receptionQty = state.inventory[`${target.sku}::${target.fromBin}`] ?? 0;
  if (input.qty > receptionQty) {
    return {
      allowed: false,
      reasonFr: `Quantité maximale au quai ${target.fromBin} : ${receptionQty} u.`,
      reasonEn: `Maximum quantity at dock ${target.fromBin}: ${receptionQty}.`,
    };
  }

  return { allowed: true };
}

/** Reject cycle counts at reception/expedition bins for SKU-005 unless explicitly configured. */
export function validateM1CycleCountForScn005(
  state: {
    inventory: Record<string, number>;
    scnCode?: string | null;
    scenarioInitialStateJson?: Record<string, unknown> | null;
  },
  input: { sku: string; bin: string },
) {
  if (!isScn005(state.scnCode) || input.sku !== SCN_005_SKU_B) {
    return { allowed: true as const };
  }

  const target = getScn005CycleCountTarget(state.scenarioInitialStateJson);
  if (input.bin === target.bin) return { allowed: true as const };

  const stockAtBin = state.inventory[`${input.sku}::${input.bin}`] ?? 0;
  if (
    EXPEDITION_BINS.includes(input.bin) ||
    RECEPTION_BINS.includes(input.bin) ||
    stockAtBin === 0
  ) {
    return {
      allowed: false as const,
      reason: `Cycle count must be at ${target.bin}, not ${input.bin}`,
      reasonFr: `Le comptage cyclique SKU-005 doit être effectué à ${target.bin} (zone STOCKAGE), pas à ${input.bin}.`,
      reasonEn: `SKU-005 cycle count must be performed at ${target.bin} (STOCKAGE zone), not ${input.bin}.`,
    };
  }

  return { allowed: true as const };
}

/**
 * Recover broken SCN-005 runs:
 * - Remap CC recorded at REC-02 / wrong bin to B-01-R1-L2 with pedagogical −8 contract
 * - Normalize inventory to physicalQty 52 at target bin when CC is resolved
 */
export function recoverScn005RunState<
  T extends {
    scnCode: string | null;
    scenarioId?: number | null;
    scenarioName?: string | null;
    scenarioInitialStateJson?: Record<string, unknown> | null;
    transactions: Scn005Tx[];
    cycleCounts: Scn005CycleCount[];
    inventory: Record<string, number>;
    completedSteps?: string[];
  },
>(state: T): T {
  if (!isScn005Scenario(state)) return state;

  const ccTarget = getScn005CycleCountTarget(state.scenarioInitialStateJson);
  const normalizedCCs = state.cycleCounts.map((cc) => {
    if (cc.sku !== SCN_005_SKU_B) return cc;

    const matchesPattern =
      Math.abs(cc.variance - SCN_005_VARIANCE) < 0.01 ||
      cc.physicalQty === SCN_005_PHYSICAL_QTY ||
      (cc.systemQty != null &&
        cc.physicalQty != null &&
        Math.abs(cc.physicalQty - cc.systemQty - SCN_005_VARIANCE) < 0.01);

    if (cc.bin !== ccTarget.bin && !matchesPattern && !RECEPTION_BINS.includes(cc.bin)) {
      return cc;
    }

    if (cc.bin === ccTarget.bin && matchesPattern) {
      return {
        ...cc,
        systemQty: cc.systemQty ?? SCN_005_SYSTEM_QTY,
        physicalQty: cc.physicalQty ?? SCN_005_PHYSICAL_QTY,
        variance: SCN_005_VARIANCE,
      };
    }

    return {
      ...cc,
      bin: ccTarget.bin,
      systemQty: cc.systemQty ?? SCN_005_SYSTEM_QTY,
      physicalQty: cc.physicalQty ?? SCN_005_PHYSICAL_QTY,
      variance: SCN_005_VARIANCE,
    };
  });

  const inventory = calculateInventory(state.transactions);

  const resolvedCc = normalizedCCs.find(
    (c) =>
      c.sku === SCN_005_SKU_B &&
      c.bin === ccTarget.bin &&
      c.resolved &&
      c.physicalQty != null,
  );

  if (resolvedCc?.physicalQty != null) {
    const key = `${SCN_005_SKU_B}::${ccTarget.bin}`;
    const target = resolvedCc.physicalQty;
    if (Math.abs((inventory[key] ?? 0) - target) > 0.01) {
      inventory[key] = target;
    }
  }

  return { ...state, cycleCounts: normalizedCCs, inventory };
}

/** Count posted PUTAWAY_M1 movements for SCN-005 regression checks. */
export function countScn005PutawayMovements(
  transactions: Array<{ docType: string; sku: string; posted: boolean; qty: number; bin: string }>,
): number {
  const credits = transactions.filter(
    (t) =>
      t.docType === "PUTAWAY_M1" &&
      t.posted &&
      t.qty > 0 &&
      STOCKAGE_BINS.some((b) => t.bin === b),
  );
  const skus = new Set(credits.map((t) => t.sku));
  return skus.size;
}

/** True when ghost GR doc refs remain unposted (SCN-002 / SCN-005). */
export function hasPendingGhostGr(transactions: Scn005Tx[]): boolean {
  return transactions.some(
    (t) => t.docType === "GR" && !t.posted && t.docRef && GHOST_GR_DOC_REFS.has(t.docRef),
  );
}
