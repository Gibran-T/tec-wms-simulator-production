/**
 * DOC vs legacy dispatch helpers — shared, no legacy imports.
 */

import { isM5DocInitialState, M5_DOC_INTERACTION_MODEL, type M5DocInitialStateJson } from "./types";

export function resolveInteractionModel(initialStateJson: unknown): "supervision-doc-v1" | "ops-ledger-v1" | "unknown" {
  if (isM5DocInitialState(initialStateJson)) return M5_DOC_INTERACTION_MODEL;
  if (initialStateJson && typeof initialStateJson === "object") {
    const v = (initialStateJson as Record<string, unknown>).interactionModel;
    if (v === "ops-ledger-v1") return "ops-ledger-v1";
    // Legacy M5 seeds historically omit interactionModel — treat as ops-ledger.
    if ("m5Contract" in (initialStateJson as object)) return "ops-ledger-v1";
  }
  return "unknown";
}

export function isSupervisionDocRun(initialStateJson: unknown): initialStateJson is M5DocInitialStateJson {
  return isM5DocInitialState(initialStateJson);
}

/** Probe used by tests to ensure legacy M5 path was not entered. */
export type LegacyM5PathProbe = {
  getEffectiveM5StepsCalls: number;
  m5SessionV1Calls: number;
  legacyScoreCalls: number;
};

export function createLegacyM5PathProbe(): LegacyM5PathProbe {
  return { getEffectiveM5StepsCalls: 0, m5SessionV1Calls: 0, legacyScoreCalls: 0 };
}
