/**
 * M1/M2 preloaded scenario bootstrap — normalizes seed state and marks satisfied steps.
 */

import { RECEPTION_BINS, RESERVE_BINS, PICKING_BINS, STOCKAGE_BINS } from "./rulesEngine";

export type PreloadedTx = {
  docType: string;
  sku?: string;
  bin?: string;
  qty?: number;
  posted?: boolean;
  docRef?: string | null;
};

/** Ghost GR documents must use reception bin so stock appears at REC-01 when posted. */
const GHOST_GR_RECEPTION_BIN = "REC-01";

/** Canonical reception bin for known ghost GR doc refs (SCN-002, SCN-005). */
export const GHOST_GR_DOC_REFS = new Set(["GR-2025-001", "GR-2025-004"]);

export function normalizePreloadedTransaction(tx: PreloadedTx): PreloadedTx {
  if (tx.docType === "GR" && !tx.posted) {
    return { ...tx, bin: GHOST_GR_RECEPTION_BIN };
  }
  return tx;
}

export function getM1StepsToAutoComplete(preloaded: PreloadedTx[]): string[] {
  const steps: string[] = [];
  const txsOfType = (type: string) => preloaded.filter((t) => t.docType === type);
  const hasPosted = (type: string) => preloaded.some((t) => t.docType === type && t.posted);
  /** SCN-005: GR step only when every GR is posted — pending ghost GR must stay actionable. */
  const allGrPosted = () => {
    const grs = txsOfType("GR");
    return grs.length > 0 && grs.every((t) => t.posted);
  };
  if (hasPosted("PO")) steps.push("PO");
  if (allGrPosted()) steps.push("GR");
  return steps;
}

const STORAGE_BINS = [...STOCKAGE_BINS, ...PICKING_BINS, ...RESERVE_BINS];

/** SCN-008: GR already posted to STOCKAGE bins — putaway is pedagogically complete. */
export function isM2PutawayPreSatisfied(preloaded: PreloadedTx[]): boolean {
  const postedGRs = preloaded.filter((t) => t.docType === "GR" && t.posted);
  if (postedGRs.length === 0) return false;
  const hasReceptionStock = postedGRs.some((t) => t.bin && RECEPTION_BINS.includes(t.bin));
  if (hasReceptionStock) return false;
  return postedGRs.some((t) => t.bin && STORAGE_BINS.includes(t.bin));
}

export function getM2StepsToAutoComplete(preloaded: PreloadedTx[]): string[] {
  const steps: string[] = [];
  if (preloaded.some((t) => t.docType === "GR" && t.posted)) steps.push("GR");
  if (isM2PutawayPreSatisfied(preloaded)) steps.push("PUTAWAY");
  return steps;
}

export function ghostGrReceptionBin(docRef: string | null | undefined): string | null {
  if (docRef && GHOST_GR_DOC_REFS.has(docRef)) return GHOST_GR_RECEPTION_BIN;
  return null;
}
