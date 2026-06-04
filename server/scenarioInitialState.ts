/**
 * Runtime canonical initial states — overrides stale DB rows without re-seed.
 * SCN-003 and SCN-005 only (SCN-002 uses corrected DB; SCN-001/004 untouched).
 * Source of truth: Student Mission Sheets.
 */

export interface PreloadedTransaction {
  docType: string;
  sku: string;
  bin: string;
  qty: number;
  posted: boolean;
  docRef: string;
}

export interface ScenarioInitialState {
  preloadedTransactions?: PreloadedTransaction[];
  context?: string;
  multiFlow?: boolean;
  ccAllowsNegativePhysical?: boolean;
}

/** Scenario IDs 3 and 5 — runtime override over stale production DB JSON */
const RUNTIME_OVERRIDE: Record<number, ScenarioInitialState> = {
  3: {
    preloadedTransactions: [
      { docType: "PO", sku: "SKU-003", bin: "REC-01", qty: 50, posted: true, docRef: "PO-2025-002" },
      { docType: "GR", sku: "SKU-003", bin: "REC-01", qty: 50, posted: true, docRef: "GR-2025-002" },
    ],
    context: "50 unités reçues au quai REC-01 — SO client demande 80 unités.",
    multiFlow: true,
  },
  5: {
    preloadedTransactions: [
      { docType: "PO", sku: "SKU-004", bin: "REC-01", qty: 30, posted: true, docRef: "PO-2025-004" },
      { docType: "GR", sku: "SKU-004", bin: "REC-01", qty: 30, posted: false, docRef: "GR-2025-004" },
      { docType: "PO", sku: "SKU-005", bin: "REC-02", qty: 60, posted: true, docRef: "PO-2025-005" },
      { docType: "GR", sku: "SKU-005", bin: "REC-02", qty: 60, posted: true, docRef: "GR-2025-005" },
    ],
    context: "GR non postée SKU-004 + écart inventaire SKU-005 (-8 unités).",
    multiFlow: true,
    ccAllowsNegativePhysical: true,
  },
};

export function getM1CanonicalInitialState(scenarioId: number): ScenarioInitialState | null {
  return RUNTIME_OVERRIDE[scenarioId] ?? null;
}

export function hasRuntimeInitialStateOverride(scenarioId: number): boolean {
  return scenarioId in RUNTIME_OVERRIDE;
}

/** Override stale DB scenario config at run start for SCN-003 and SCN-005. */
export function resolveScenarioInitialState(
  scenarioId: number,
  dbState: ScenarioInitialState | null | undefined
): ScenarioInitialState | null {
  const canonical = getM1CanonicalInitialState(scenarioId);
  if (canonical) return canonical;
  return dbState ?? null;
}

export function getScenarioFlags(
  scenarioId: number,
  dbState: ScenarioInitialState | null | undefined
): { multiFlow: boolean; ccAllowsNegativePhysical: boolean } {
  const state = resolveScenarioInitialState(scenarioId, dbState);
  return {
    multiFlow: state?.multiFlow === true,
    ccAllowsNegativePhysical: state?.ccAllowsNegativePhysical === true,
  };
}
