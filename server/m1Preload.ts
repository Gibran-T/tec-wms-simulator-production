/**
 * M1/M2 preloaded scenario bootstrap — normalizes seed state and marks satisfied steps.
 */

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
  const hasPosted = (type: string) => preloaded.some((t) => t.docType === type && t.posted);
  if (hasPosted("PO")) steps.push("PO");
  if (hasPosted("GR")) steps.push("GR");
  return steps;
}

export function getM2StepsToAutoComplete(preloaded: PreloadedTx[]): string[] {
  const steps: string[] = [];
  if (preloaded.some((t) => t.docType === "GR" && t.posted)) steps.push("GR");
  return steps;
}

export function ghostGrReceptionBin(docRef: string | null | undefined): string | null {
  if (docRef && GHOST_GR_DOC_REFS.has(docRef)) return GHOST_GR_RECEPTION_BIN;
  return null;
}
