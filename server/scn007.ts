/**
 * SCN-007 — M2 capacity split ONLY (no FIFO).
 * Pedagogical contract (Points de contrôle = executable rules):
 *   Documents : PO-M2-002 · GR-M2-002 · SKU-002 · LOT-2025-002 · 600 u. · REC-01.
 *   Premier PUTAWAY : LOT-2025-002 · 500 u. · REC-01 → B-01-R1-L1.
 *   Deuxième PUTAWAY : LOT-2025-002 · 100 u. · REC-01 → B-01-R1-L2.
 *   Condition de passage : REC-01 = 0 · total stock = 600.
 *   Ensuite : STOCK_ACCURACY · COMPLIANCE_ADV.
 * FIFO belongs exclusively to SCN-008.
 */

export const SCN_007_SKU = "SKU-002";
export const SCN_007_LOT = "LOT-2025-002";
export const SCN_007_REC_BIN = "REC-01";
export const SCN_007_SPLIT_BIN_1 = "B-01-R1-L1";
export const SCN_007_SPLIT_BIN_2 = "B-01-R1-L2";
export const SCN_007_REC_QTY = 600;
export const SCN_007_SPLIT_QTY_1 = 500;
export const SCN_007_SPLIT_QTY_2 = 100;
export const SCN_007_GR_REF = "GR-M2-002";
export const SCN_007_PO_REF = "PO-M2-002";

/** Scored steps for SCN-007 (no FIFO) — sums to 100. */
export const SCN_007_STEP_MAX: Record<string, number> = {
  PUTAWAY: 40,
  STOCK_ACCURACY: 30,
  COMPLIANCE_ADV: 30,
};

export type Scn007PutawayTarget = {
  toBin: string;
  qty: number;
};

export const SCN_007_PUTAWAY_TARGETS: Scn007PutawayTarget[] = [
  { toBin: SCN_007_SPLIT_BIN_1, qty: SCN_007_SPLIT_QTY_1 },
  { toBin: SCN_007_SPLIT_BIN_2, qty: SCN_007_SPLIT_QTY_2 },
];

/** Mandatory three-state machine — only exact contractual moves are allowed. */
export type Scn007PutawayPhase =
  | "INITIAL"
  | "AFTER_FIRST_PUTAWAY"
  | "PUTAWAY_COMPLETE"
  | "INVALID";

export type Scn007AllowedPutaway = {
  fromBin: string;
  toBin: string;
  sku: string;
  lotNumber: string;
  qty: number;
};

export type Scn007TxLike = {
  docType?: string | null;
  sku?: string | null;
  bin?: string | null;
  qty?: number | string | null;
  posted?: boolean | null;
  docRef?: string | null;
  comment?: string | null;
};

export type Scn007StateLike = {
  inventory?: Record<string, number> | null;
  scnCode?: string | null;
  scenarioId?: number | null;
  scenarioName?: string | null;
  scenarioInitialStateJson?: Record<string, unknown> | null;
  completedSteps?: string[] | null;
  transactions?: Scn007TxLike[] | null;
};

export function isScn007(scnCode: string | null | undefined): boolean {
  return scnCode === "SCN-007";
}

export function isScn007Scenario(state: Scn007StateLike | null | undefined): boolean {
  if (!state) return false;
  if (isScn007(state.scnCode)) return true;
  if (state.scenarioId === 7) return true;

  const name = String(state.scenarioName ?? "");
  if (/capacit[eé].*emplacement|Validation de la capacit/i.test(name)) return true;

  const preload = state.scenarioInitialStateJson?.preloadedTransactions;
  if (Array.isArray(preload)) {
    const hasNewGr = preload.some(
      (t: { docType?: string; docRef?: string; sku?: string; bin?: string }) =>
        t.docType === "GR" && t.docRef === SCN_007_GR_REF && t.sku === SCN_007_SKU && t.bin === SCN_007_REC_BIN,
    );
    const hasFifoPreload = preload.some(
      (t: { docRef?: string }) => t.docRef === "GR-M2-002-FIFO",
    );
    // Capacity-only seed: GR-M2-002 present, no legacy FIFO preload
    if (hasNewGr && !hasFifoPreload) return true;
  }

  return false;
}

function invQty(inventory: Record<string, number> | null | undefined, sku: string, bin: string): number {
  return Number(inventory?.[`${sku}::${bin}`] ?? 0);
}

/** Detect the only valid SCN-007 putaway phase from inventory. */
export function detectScn007PutawayPhase(state: Scn007StateLike | null | undefined): Scn007PutawayPhase {
  if (!isScn007Scenario(state)) return "INVALID";
  const inv = state?.inventory ?? {};
  const rec = invQty(inv, SCN_007_SKU, SCN_007_REC_BIN);
  const l1 = invQty(inv, SCN_007_SKU, SCN_007_SPLIT_BIN_1);
  const l2 = invQty(inv, SCN_007_SKU, SCN_007_SPLIT_BIN_2);

  if (rec === SCN_007_REC_QTY && l1 === 0 && l2 === 0) return "INITIAL";
  if (rec === SCN_007_SPLIT_QTY_2 && l1 === SCN_007_SPLIT_QTY_1 && l2 === 0) return "AFTER_FIRST_PUTAWAY";
  if (rec === 0 && l1 === SCN_007_SPLIT_QTY_1 && l2 === SCN_007_SPLIT_QTY_2) return "PUTAWAY_COMPLETE";
  return "INVALID";
}

/** Single allowed operation for the current phase, or null if none. */
export function getScn007AllowedPutaway(state: Scn007StateLike | null | undefined): Scn007AllowedPutaway | null {
  const phase = detectScn007PutawayPhase(state);
  if (phase === "INITIAL") {
    return {
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_1,
      sku: SCN_007_SKU,
      lotNumber: SCN_007_LOT,
      qty: SCN_007_SPLIT_QTY_1,
    };
  }
  if (phase === "AFTER_FIRST_PUTAWAY") {
    return {
      fromBin: SCN_007_REC_BIN,
      toBin: SCN_007_SPLIT_BIN_2,
      sku: SCN_007_SKU,
      lotNumber: SCN_007_LOT,
      qty: SCN_007_SPLIT_QTY_2,
    };
  }
  return null;
}

/** Posted PUTAWAY credit lines (destination +qty) for SKU-002 contractual bins. */
export function getScn007PostedPutawayCredits(transactions: Scn007TxLike[] | null | undefined): Scn007PutawayTarget[] {
  if (!Array.isArray(transactions)) return [];
  return transactions
    .filter((t) => t.posted !== false && t.docType === "PUTAWAY" && t.sku === SCN_007_SKU)
    .map((t) => ({ toBin: String(t.bin ?? ""), qty: Number(t.qty) }))
    .filter((t) => t.qty > 0 && (t.toBin === SCN_007_SPLIT_BIN_1 || t.toBin === SCN_007_SPLIT_BIN_2));
}

/**
 * Exactly the two canonical business operations, in order:
 * 1) 500 → B-01-R1-L1
 * 2) 100 → B-01-R1-L2
 */
export function hasScn007CanonicalPutawaySequence(state: Scn007StateLike | null | undefined): boolean {
  const credits = getScn007PostedPutawayCredits(state?.transactions);
  if (credits.length !== 2) return false;
  return (
    credits[0].toBin === SCN_007_SPLIT_BIN_1 &&
    credits[0].qty === SCN_007_SPLIT_QTY_1 &&
    credits[1].toBin === SCN_007_SPLIT_BIN_2 &&
    credits[1].qty === SCN_007_SPLIT_QTY_2
  );
}

function inventoryMatchesTerminalSplit(state: Scn007StateLike | null | undefined): boolean {
  if (!isScn007Scenario(state)) return false;
  const inv = state?.inventory ?? {};
  return (
    invQty(inv, SCN_007_SKU, SCN_007_REC_BIN) === 0 &&
    invQty(inv, SCN_007_SKU, SCN_007_SPLIT_BIN_1) === SCN_007_SPLIT_QTY_1 &&
    invQty(inv, SCN_007_SKU, SCN_007_SPLIT_BIN_2) === SCN_007_SPLIT_QTY_2
  );
}

/**
 * Exact terminal putaway state — capacity split complete, total 600.
 * If PUTAWAY credit lines exist in the ledger, they must be exactly the two
 * canonical operations (500→L1 then 100→L2). Multi-move histories (e.g. 400+100+100)
 * never complete even if inventory accidentally matches the terminal split.
 * When no PUTAWAY credits exist yet, inventory gate alone applies (projection /
 * inventory-mocked unit tests).
 */
export function isScn007PutawayComplete(state: Scn007StateLike | null | undefined): boolean {
  if (!inventoryMatchesTerminalSplit(state)) return false;
  const credits = getScn007PostedPutawayCredits(state?.transactions);
  if (credits.length === 0) return true;
  return hasScn007CanonicalPutawaySequence(state);
}

export function getScn007ReceptionRemaining(state: Scn007StateLike | null | undefined): number {
  return invQty(state?.inventory ?? {}, SCN_007_SKU, SCN_007_REC_BIN);
}

export function getScn007ContractualCap(toBin: string): number | null {
  if (toBin === SCN_007_SPLIT_BIN_1) return SCN_007_SPLIT_QTY_1;
  if (toBin === SCN_007_SPLIT_BIN_2) return SCN_007_SPLIT_QTY_2;
  return null;
}

export function getScn007StepMaxPoints(stepCode: string): number {
  return SCN_007_STEP_MAX[stepCode] ?? 0;
}

export function getScn007StockAccuracyPoints(variance: number): number {
  const perfect = SCN_007_STEP_MAX.STOCK_ACCURACY;
  return variance === 0 ? perfect : Math.max(0, perfect - 5);
}

export function scn007FifoNotInScenarioMessage(): { reasonFr: string; reasonEn: string } {
  return {
    reasonFr:
      "L'étape FIFO_PICK ne fait pas partie du SCN-007. Ce scénario porte uniquement sur la capacité d'emplacement (PUTAWAY 500 + 100). Le FIFO est enseigné dans le SCN-008.",
    reasonEn:
      "FIFO_PICK is not part of SCN-007. This scenario covers bin capacity only (PUTAWAY 500 + 100). FIFO is taught in SCN-008.",
  };
}

function firstPutawayError(): { allowed: false; reasonFr: string; reasonEn: string } {
  return {
    allowed: false,
    reasonFr:
      "Première opération incorrecte\nLe premier PUTAWAY doit déplacer exactement 500 unités du lot LOT-2025-002 depuis REC-01 vers B-01-R1-L1.",
    reasonEn:
      "Incorrect first operation\nThe first PUTAWAY must move exactly 500 units of lot LOT-2025-002 from REC-01 to B-01-R1-L1.",
  };
}

function secondPutawayError(): { allowed: false; reasonFr: string; reasonEn: string } {
  return {
    allowed: false,
    reasonFr:
      "Deuxième opération incorrecte\nLe deuxième PUTAWAY doit déplacer exactement les 100 unités restantes du lot LOT-2025-002 depuis REC-01 vers B-01-R1-L2.",
    reasonEn:
      "Incorrect second operation\nThe second PUTAWAY must move exactly the remaining 100 units of lot LOT-2025-002 from REC-01 to B-01-R1-L2.",
  };
}

/**
 * Canonical SCN-007 PUTAWAY contract.
 * Rejects any non-exact move BEFORE inventory mutation / transaction posting.
 * Both m2.submitPUTAWAY and warehouse.submitPutaway must call this (or its alias).
 */
export function validateScn007PutawayInput(
  state: Scn007StateLike,
  input: { sku: string; fromBin: string; toBin: string; qty: number; lotNumber?: string | null },
): { allowed: true } | { allowed: false; reasonFr: string; reasonEn: string } {
  if (!isScn007Scenario(state)) return { allowed: true };

  const phase = detectScn007PutawayPhase(state);

  if (phase === "PUTAWAY_COMPLETE") {
    return {
      allowed: false,
      reasonFr:
        "PUTAWAY déjà terminé — aucun rangement supplémentaire n'est autorisé. Passez au contrôle de précision du stock (STOCK_ACCURACY).",
      reasonEn:
        "PUTAWAY already complete — no further putaway is allowed. Proceed to stock accuracy control (STOCK_ACCURACY).",
    };
  }

  if (phase === "INVALID") {
    return {
      allowed: false,
      reasonFr:
        "État d'inventaire non contractuel pour le SCN-007. Seules les opérations exactes 500→B-01-R1-L1 puis 100→B-01-R1-L2 sont autorisées. Aucune récupération partielle (ex. 400+100) n'existe.",
      reasonEn:
        "Non-contractual inventory state for SCN-007. Only exact operations 500→B-01-R1-L1 then 100→B-01-R1-L2 are allowed. No partial recovery path (e.g. 400+100) exists.",
    };
  }

  const allowed = getScn007AllowedPutaway(state);
  if (!allowed) {
    return {
      allowed: false,
      reasonFr: "Aucune opération PUTAWAY n'est autorisée dans cet état.",
      reasonEn: "No PUTAWAY operation is allowed in this state.",
    };
  }

  const lot = (input.lotNumber ?? "").trim();
  const matches =
    input.sku === allowed.sku &&
    input.fromBin === allowed.fromBin &&
    input.toBin === allowed.toBin &&
    Number(input.qty) === allowed.qty &&
    lot === allowed.lotNumber;

  if (matches) return { allowed: true };

  if (phase === "INITIAL") return firstPutawayError();
  return secondPutawayError();
}

/** Alias — Points de contrôle as a single executable contract. */
export const validateScn007PutawayContract = validateScn007PutawayInput;

export function projectInventoryAfterPutaway(
  inventory: Record<string, number>,
  input: { sku: string; fromBin: string; toBin: string; qty: number },
): Record<string, number> {
  const next = { ...inventory };
  const fromKey = `${input.sku}::${input.fromBin}`;
  const toKey = `${input.sku}::${input.toBin}`;
  next[fromKey] = (next[fromKey] ?? 0) - input.qty;
  next[toKey] = (next[toKey] ?? 0) + input.qty;
  return next;
}

/** Append projected PUTAWAY debit/credit lines for completion sequence checks. */
export function projectTransactionsAfterPutaway(
  transactions: Scn007TxLike[] | null | undefined,
  input: { sku: string; fromBin: string; toBin: string; qty: number; docRef?: string | null },
): Scn007TxLike[] {
  const base = Array.isArray(transactions) ? [...transactions] : [];
  const docRef = input.docRef ?? `PUT-${input.toBin}-${input.qty}`;
  return [
    ...base,
    {
      docType: "PUTAWAY",
      sku: input.sku,
      bin: input.fromBin,
      qty: -input.qty,
      posted: true,
      docRef,
    },
    {
      docType: "PUTAWAY",
      sku: input.sku,
      bin: input.toBin,
      qty: input.qty,
      posted: true,
      docRef,
    },
  ];
}

export function scn007IncompletePutawayMessage(): { reasonFr: string; reasonEn: string } {
  return {
    reasonFr:
      "Rangement incomplet — Les 600 unités du lot LOT-2025-002 doivent être entièrement rangées : 500 unités dans B-01-R1-L1 et 100 unités dans B-01-R1-L2.",
    reasonEn:
      "Incomplete putaway — All 600 units of lot LOT-2025-002 must be put away: 500 units in B-01-R1-L1 and 100 units in B-01-R1-L2.",
  };
}

export function getScn007ComplianceIssues(state: Scn007StateLike): { issues: string[]; issuesFr: string[] } {
  if (!isScn007Scenario(state) || isScn007PutawayComplete(state)) {
    return { issues: [], issuesFr: [] };
  }

  const remaining = getScn007ReceptionRemaining(state);
  const inv = state.inventory ?? {};
  const atL1 = invQty(inv, SCN_007_SKU, SCN_007_SPLIT_BIN_1);
  const atL2 = invQty(inv, SCN_007_SKU, SCN_007_SPLIT_BIN_2);

  if (remaining <= 0 && atL1 === SCN_007_SPLIT_QTY_1 && atL2 === SCN_007_SPLIT_QTY_2) {
    // Terminal inventory but non-canonical sequence — still non-compliant.
    if (Array.isArray(state.transactions) && state.transactions.length > 0 && !hasScn007CanonicalPutawaySequence(state)) {
      const msg = scn007IncompletePutawayMessage();
      return { issues: [msg.reasonEn], issuesFr: [msg.reasonFr] };
    }
    return { issues: [], issuesFr: [] };
  }

  const msg = scn007IncompletePutawayMessage();
  const detailFr =
    remaining > 0
      ? msg.reasonFr
      : `Rangement incomplet — répartition exigée : ${SCN_007_SPLIT_BIN_1}=${SCN_007_SPLIT_QTY_1} (actuel ${atL1}), ${SCN_007_SPLIT_BIN_2}=${SCN_007_SPLIT_QTY_2} (actuel ${atL2}).`;
  const detailEn =
    remaining > 0
      ? msg.reasonEn
      : `Incomplete putaway — required split: ${SCN_007_SPLIT_BIN_1}=${SCN_007_SPLIT_QTY_1} (now ${atL1}), ${SCN_007_SPLIT_BIN_2}=${SCN_007_SPLIT_QTY_2} (now ${atL2}).`;

  return { issues: [detailEn], issuesFr: [detailFr] };
}

export function getScn007NextActionHint(
  state: Scn007StateLike,
): { fr: string; en: string; titleFr: string; titleEn: string } | null {
  if (!isScn007Scenario(state)) return null;

  const phase = detectScn007PutawayPhase(state);
  const completed = state.completedSteps ?? [];

  if (phase === "PUTAWAY_COMPLETE" || isScn007PutawayComplete(state)) {
    if (completed.includes("STOCK_ACCURACY")) return null;
    return {
      titleFr: "Contrôle de précision du stock",
      titleEn: "Stock accuracy control",
      fr: "Vérifiez que REC-01 est vide, que B-01-R1-L1 contient 500 unités et que B-01-R1-L2 contient 100 unités.",
      en: "Verify that REC-01 is empty, B-01-R1-L1 holds 500 units and B-01-R1-L2 holds 100 units.",
    };
  }

  if (phase === "INITIAL") {
    return {
      titleFr: "Premier rangement — B-01-R1-L1",
      titleEn: "First putaway — B-01-R1-L1",
      fr: `Rangez exactement 500 unités du lot ${SCN_007_LOT} depuis ${SCN_007_REC_BIN} vers ${SCN_007_SPLIT_BIN_1}.`,
      en: `Put away exactly 500 units of lot ${SCN_007_LOT} from ${SCN_007_REC_BIN} to ${SCN_007_SPLIT_BIN_1}.`,
    };
  }

  if (phase === "AFTER_FIRST_PUTAWAY") {
    return {
      titleFr: "Deuxième rangement — B-01-R1-L2",
      titleEn: "Second putaway — B-01-R1-L2",
      fr: `Rangez exactement les 100 unités restantes du lot ${SCN_007_LOT} depuis ${SCN_007_REC_BIN} vers ${SCN_007_SPLIT_BIN_2}.`,
      en: `Put away exactly the remaining 100 units of lot ${SCN_007_LOT} from ${SCN_007_REC_BIN} to ${SCN_007_SPLIT_BIN_2}.`,
    };
  }

  // Contaminated / non-contractual inventory — never suggest partial recovery.
  return {
    titleFr: "Premier rangement — B-01-R1-L1",
    titleEn: "First putaway — B-01-R1-L1",
    fr: `Rangez exactement 500 unités du lot ${SCN_007_LOT} depuis ${SCN_007_REC_BIN} vers ${SCN_007_SPLIT_BIN_1}.`,
    en: `Put away exactly 500 units of lot ${SCN_007_LOT} from ${SCN_007_REC_BIN} to ${SCN_007_SPLIT_BIN_1}.`,
  };
}

export function scn007LotForDocRef(docRef: string | null | undefined): string | null {
  if (docRef === SCN_007_GR_REF || docRef === SCN_007_PO_REF) return SCN_007_LOT;
  return null;
}

export type Scn007MonitorBusinessRow = {
  docType: string;
  docRef: string | null;
  sku: string;
  bin: string;
  qty: number;
  posted: boolean;
  lot: string | null;
  /** When set, UI shows source → destination as one business PUTAWAY. */
  fromBin?: string | null;
  toBin?: string | null;
};

/**
 * Group technical debit/credit PUTAWAY pairs into one business movement each.
 * Non-PUTAWAY rows pass through unchanged. Does not hide invalid posts — rejection
 * must happen before posting so the monitor never contains them.
 */
export function toScn007MonitorBusinessRows(transactions: Scn007TxLike[] | null | undefined): Scn007MonitorBusinessRow[] {
  if (!Array.isArray(transactions)) return [];
  const rows: Scn007MonitorBusinessRow[] = [];
  const putawayBuckets = new Map<string, Scn007TxLike[]>();
  const putawayOrder: string[] = [];

  for (const tx of transactions) {
    if (tx.docType !== "PUTAWAY") {
      rows.push({
        docType: String(tx.docType ?? ""),
        docRef: tx.docRef ?? null,
        sku: String(tx.sku ?? ""),
        bin: String(tx.bin ?? ""),
        qty: Number(tx.qty ?? 0),
        posted: tx.posted !== false,
        lot: scn007LotForDocRef(tx.docRef) ?? (tx.docType === "PUTAWAY" ? SCN_007_LOT : null),
      });
      continue;
    }
    const key = String(tx.docRef ?? `${tx.sku}|${tx.bin}|${tx.qty}|${rows.length + putawayOrder.length}`);
    if (!putawayBuckets.has(key)) {
      putawayBuckets.set(key, []);
      putawayOrder.push(key);
    }
    putawayBuckets.get(key)!.push(tx);
  }

  for (const key of putawayOrder) {
    const group = putawayBuckets.get(key) ?? [];
    const debit = group.find((t) => Number(t.qty) < 0);
    const credit = group.find((t) => Number(t.qty) > 0);
    if (debit && credit) {
      rows.push({
        docType: "PUTAWAY",
        docRef: (credit.docRef ?? debit.docRef) ?? null,
        sku: String(credit.sku ?? debit.sku ?? SCN_007_SKU),
        bin: `${debit.bin} → ${credit.bin}`,
        qty: Math.abs(Number(credit.qty)),
        posted: credit.posted !== false && debit.posted !== false,
        lot: SCN_007_LOT,
        fromBin: String(debit.bin ?? ""),
        toBin: String(credit.bin ?? ""),
      });
    } else {
      for (const tx of group) {
        rows.push({
          docType: "PUTAWAY",
          docRef: tx.docRef ?? null,
          sku: String(tx.sku ?? ""),
          bin: String(tx.bin ?? ""),
          qty: Number(tx.qty ?? 0),
          posted: tx.posted !== false,
          lot: SCN_007_LOT,
          toBin: Number(tx.qty) > 0 ? String(tx.bin ?? "") : null,
          fromBin: Number(tx.qty) < 0 ? String(tx.bin ?? "") : null,
        });
      }
    }
  }

  return rows;
}
