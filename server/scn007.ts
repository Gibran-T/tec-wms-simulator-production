/**
 * SCN-007 — M2 capacity split + dual-lot FIFO
 * Pedagogical contract:
 *   A) Pre-existing FIFO stock: LOT-2025-001 · 100 u. · B-02-R1-L1
 *   B) New reception: LOT-2025-002 · 600 u. · REC-01 → split PUTAWAY 500+100
 * PUTAWAY completes only when REC is empty AND destinations hold exactly 500 / 100.
 */

export const SCN_007_SKU = "SKU-002";
export const SCN_007_OLD_LOT = "LOT-2025-001";
export const SCN_007_NEW_LOT = "LOT-2025-002";
export const SCN_007_REC_BIN = "REC-01";
export const SCN_007_FIFO_BIN = "B-02-R1-L1";
export const SCN_007_SPLIT_BIN_1 = "B-01-R1-L1";
export const SCN_007_SPLIT_BIN_2 = "B-01-R1-L2";
export const SCN_007_REC_QTY = 600;
export const SCN_007_OLD_QTY = 100;
export const SCN_007_SPLIT_QTY_1 = 500;
export const SCN_007_SPLIT_QTY_2 = 100;
export const SCN_007_FIFO_GR_REF = "GR-M2-002-FIFO";
export const SCN_007_GR_REF = "GR-M2-002";
export const SCN_007_PO_REF = "PO-M2-002";

export type Scn007PutawayTarget = {
  toBin: string;
  qty: number;
};

export const SCN_007_PUTAWAY_TARGETS: Scn007PutawayTarget[] = [
  { toBin: SCN_007_SPLIT_BIN_1, qty: SCN_007_SPLIT_QTY_1 },
  { toBin: SCN_007_SPLIT_BIN_2, qty: SCN_007_SPLIT_QTY_2 },
];

export type Scn007StateLike = {
  inventory?: Record<string, number> | null;
  scnCode?: string | null;
  scenarioId?: number | null;
  scenarioName?: string | null;
  scenarioInitialStateJson?: Record<string, unknown> | null;
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
    const hasFifoGr = preload.some(
      (t: { docType?: string; docRef?: string; sku?: string; bin?: string }) =>
        t.docType === "GR" && t.docRef === SCN_007_FIFO_GR_REF && t.sku === SCN_007_SKU && t.bin === SCN_007_FIFO_BIN,
    );
    if (hasNewGr && hasFifoGr) return true;
  }

  return false;
}

function invQty(inventory: Record<string, number> | null | undefined, sku: string, bin: string): number {
  return Number(inventory?.[`${sku}::${bin}`] ?? 0);
}

/** Exact terminal putaway state required before FIFO_PICK. */
export function isScn007PutawayComplete(state: Scn007StateLike | null | undefined): boolean {
  if (!isScn007Scenario(state)) return false;
  const inv = state?.inventory ?? {};
  return (
    invQty(inv, SCN_007_SKU, SCN_007_REC_BIN) === 0 &&
    invQty(inv, SCN_007_SKU, SCN_007_SPLIT_BIN_1) === SCN_007_SPLIT_QTY_1 &&
    invQty(inv, SCN_007_SKU, SCN_007_SPLIT_BIN_2) === SCN_007_SPLIT_QTY_2 &&
    invQty(inv, SCN_007_SKU, SCN_007_FIFO_BIN) === SCN_007_OLD_QTY
  );
}

export function getScn007ReceptionRemaining(state: Scn007StateLike | null | undefined): number {
  return invQty(state?.inventory ?? {}, SCN_007_SKU, SCN_007_REC_BIN);
}

export function getScn007ContractualCap(toBin: string): number | null {
  if (toBin === SCN_007_SPLIT_BIN_1) return SCN_007_SPLIT_QTY_1;
  if (toBin === SCN_007_SPLIT_BIN_2) return SCN_007_SPLIT_QTY_2;
  return null;
}

export function validateScn007PutawayInput(
  state: Scn007StateLike,
  input: { sku: string; fromBin: string; toBin: string; qty: number; lotNumber?: string | null },
): { allowed: true } | { allowed: false; reasonFr: string; reasonEn: string } {
  if (!isScn007Scenario(state)) return { allowed: true };

  if (input.sku !== SCN_007_SKU) {
    return {
      allowed: false,
      reasonFr: `SCN-007 exige le SKU ${SCN_007_SKU} pour le rangement.`,
      reasonEn: `SCN-007 requires SKU ${SCN_007_SKU} for putaway.`,
    };
  }

  const lot = (input.lotNumber ?? "").trim();
  if (lot && lot !== SCN_007_NEW_LOT) {
    return {
      allowed: false,
      reasonFr: `Le rangement de la nouvelle réception doit utiliser le lot ${SCN_007_NEW_LOT}. Le lot ${SCN_007_OLD_LOT} est un stock antérieur déjà en ${SCN_007_FIFO_BIN} — ne pas le ranger à nouveau.`,
      reasonEn: `Putaway of the new receipt must use lot ${SCN_007_NEW_LOT}. Lot ${SCN_007_OLD_LOT} is pre-existing stock already in ${SCN_007_FIFO_BIN} — do not put it away again.`,
    };
  }
  if (!lot) {
    return {
      allowed: false,
      reasonFr: `Le numéro de lot ${SCN_007_NEW_LOT} est obligatoire pour le PUTAWAY.`,
      reasonEn: `Lot number ${SCN_007_NEW_LOT} is required for PUTAWAY.`,
    };
  }

  if (input.fromBin !== SCN_007_REC_BIN) {
    return {
      allowed: false,
      reasonFr: `Source attendue : ${SCN_007_REC_BIN} (nouvelle réception ${SCN_007_NEW_LOT}).`,
      reasonEn: `Expected source: ${SCN_007_REC_BIN} (new receipt ${SCN_007_NEW_LOT}).`,
    };
  }

  const cap = getScn007ContractualCap(input.toBin);
  if (cap == null) {
    return {
      allowed: false,
      reasonFr: `Destination contractuelle : ${SCN_007_SPLIT_BIN_1} (500 u.) ou ${SCN_007_SPLIT_BIN_2} (100 u.).`,
      reasonEn: `Contractual destination: ${SCN_007_SPLIT_BIN_1} (500 u.) or ${SCN_007_SPLIT_BIN_2} (100 u.).`,
    };
  }

  const currentAtDest = invQty(state.inventory, SCN_007_SKU, input.toBin);
  if (currentAtDest + input.qty > cap) {
    return {
      allowed: false,
      reasonFr: `Répartition contractuelle : ${input.toBin} doit recevoir au total ${cap} u. du lot ${SCN_007_NEW_LOT} (déjà ${currentAtDest} u.).`,
      reasonEn: `Contractual split: ${input.toBin} must hold exactly ${cap} u. of lot ${SCN_007_NEW_LOT} (already ${currentAtDest} u.).`,
    };
  }

  const remaining = getScn007ReceptionRemaining(state);
  if (input.qty > remaining) {
    return {
      allowed: false,
      reasonFr: `Il ne reste que ${remaining} u. du lot ${SCN_007_NEW_LOT} à ${SCN_007_REC_BIN}.`,
      reasonEn: `Only ${remaining} u. of lot ${SCN_007_NEW_LOT} remain at ${SCN_007_REC_BIN}.`,
    };
  }

  return { allowed: true };
}

/** Project inventory after a putaway move (for completion check before DB reload). */
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

export function scn007IncompletePutawayMessage(): { reasonFr: string; reasonEn: string } {
  return {
    reasonFr:
      "Rangement incomplet — Il reste des unités du lot LOT-2025-002 dans la zone RÉCEPTION. Complétez le PUTAWAY (500 vers B-01-R1-L1 + 100 vers B-01-R1-L2) avant de continuer.",
    reasonEn:
      "Incomplete putaway — Units of lot LOT-2025-002 remain in RECEPTION. Complete PUTAWAY (500 to B-01-R1-L1 + 100 to B-01-R1-L2) before continuing.",
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

  // Only flag while putaway work is outstanding (reception residual or wrong split)
  if (remaining <= 0 && atL1 === SCN_007_SPLIT_QTY_1 && atL2 === SCN_007_SPLIT_QTY_2) {
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

/** Dynamic cockpit hint while split is in progress. */
export function getScn007NextActionHint(
  state: Scn007StateLike,
): { fr: string; en: string; titleFr: string; titleEn: string } | null {
  if (!isScn007Scenario(state) || isScn007PutawayComplete(state)) return null;

  const remaining = getScn007ReceptionRemaining(state);
  const atL1 = invQty(state.inventory, SCN_007_SKU, SCN_007_SPLIT_BIN_1);
  const needL1 = Math.max(0, SCN_007_SPLIT_QTY_1 - atL1);
  const atL2 = invQty(state.inventory, SCN_007_SKU, SCN_007_SPLIT_BIN_2);
  const needL2 = Math.max(0, SCN_007_SPLIT_QTY_2 - atL2);

  if (remaining <= 0 && (needL1 > 0 || needL2 > 0)) {
    return {
      titleFr: "Répartition incorrecte",
      titleEn: "Incorrect split",
      fr: `La répartition contractuelle n'est pas atteinte (${SCN_007_SPLIT_BIN_1}=${atL1}/500, ${SCN_007_SPLIT_BIN_2}=${atL2}/100).`,
      en: `Contractual split not reached (${SCN_007_SPLIT_BIN_1}=${atL1}/500, ${SCN_007_SPLIT_BIN_2}=${atL2}/100).`,
    };
  }

  if (needL1 > 0 && remaining >= needL1) {
    return {
      titleFr: atL1 === 0 ? "Premier rangement nécessaire" : "Rangement partiel — compléter B-01-R1-L1",
      titleEn: atL1 === 0 ? "First putaway required" : "Partial putaway — finish B-01-R1-L1",
      fr: `Rangez ${needL1} unités du lot ${SCN_007_NEW_LOT} depuis ${SCN_007_REC_BIN} vers ${SCN_007_SPLIT_BIN_1}.`,
      en: `Put away ${needL1} units of lot ${SCN_007_NEW_LOT} from ${SCN_007_REC_BIN} to ${SCN_007_SPLIT_BIN_1}.`,
    };
  }

  if (needL2 > 0 && remaining >= needL2) {
    return {
      titleFr: "Deuxième rangement nécessaire",
      titleEn: "Second putaway required",
      fr: `Il reste ${remaining} unités du lot ${SCN_007_NEW_LOT} à ranger depuis ${SCN_007_REC_BIN} vers ${SCN_007_SPLIT_BIN_2}.`,
      en: `${remaining} units of lot ${SCN_007_NEW_LOT} remain to put away from ${SCN_007_REC_BIN} to ${SCN_007_SPLIT_BIN_2}.`,
    };
  }

  if (remaining > 0) {
    return {
      titleFr: "Rangement incomplet",
      titleEn: "Incomplete putaway",
      fr: `Il reste ${remaining} unités du lot ${SCN_007_NEW_LOT} à ${SCN_007_REC_BIN}. Complétez le split 500 + 100 avant FIFO.`,
      en: `${remaining} units of lot ${SCN_007_NEW_LOT} remain at ${SCN_007_REC_BIN}. Complete the 500 + 100 split before FIFO.`,
    };
  }

  return null;
}

/** Pedagogical label for preloaded FIFO GR in the transaction monitor. */
export function scn007TransactionLabel(docRef: string | null | undefined): { fr: string; en: string } | null {
  if (docRef === SCN_007_FIFO_GR_REF) {
    return {
      fr: `Stock antérieur — ${SCN_007_OLD_LOT} reçu précédemment`,
      en: `Prior stock — ${SCN_007_OLD_LOT} received previously`,
    };
  }
  if (docRef === SCN_007_GR_REF) {
    return {
      fr: `Nouvelle réception — ${SCN_007_NEW_LOT}`,
      en: `New receipt — ${SCN_007_NEW_LOT}`,
    };
  }
  return null;
}

export function scn007LotForDocRef(docRef: string | null | undefined): string | null {
  if (docRef === SCN_007_FIFO_GR_REF) return SCN_007_OLD_LOT;
  if (docRef === SCN_007_GR_REF || docRef === SCN_007_PO_REF) return SCN_007_NEW_LOT;
  return null;
}
