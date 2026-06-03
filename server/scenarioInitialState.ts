/**
 * Canonical M1 scenario initial states — overrides stale DB rows without re-seed.
 * Source of truth: Student Mission Sheets (SCN-002, SCN-003, SCN-005).
 * SCN-001 and SCN-004 are intentionally excluded.
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

/** Scenario IDs 2, 3, 5 — pedagogical corrections (June 2026) */
const M1_CANONICAL: Record<number, ScenarioInitialState> = {
  2: {
    preloadedTransactions: [
      { docType: "PO", sku: "SKU-001", bin: "REC-01", qty: 100, posted: true, docRef: "PO-2025-001" },
      { docType: "GR", sku: "SKU-001", bin: "REC-01", qty: 100, posted: false, docRef: "GR-2025-001" },
    ],
    context: "GR non postée détectée — transaction fantôme (quai REC-01).",
  },
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
  return M1_CANONICAL[scenarioId] ?? null;
}

/** Merge canonical override over DB scenario config for run-time flags and preloads. */
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
