/**
 * Canonical SCN catalog — defensive resolver for duplicate DB rows and SCN/DB id drift.
 * Gold Standard: SCN-001 … SCN-017. Production M4/M5 may use DB ids 34–39.
 */

export type ScenarioRef = {
  id: number;
  moduleId: number;
  name?: string | null;
  isActive?: boolean;
};

/** Official SCN codes in module order. */
export const OFFICIAL_SCN_CODES = [
  "SCN-001", "SCN-002", "SCN-003", "SCN-004", "SCN-005",
  "SCN-006", "SCN-007", "SCN-008",
  "SCN-009", "SCN-010", "SCN-011",
  "SCN-012", "SCN-013", "SCN-014",
  "SCN-015", "SCN-016", "SCN-017",
] as const;

export type OfficialScnCode = (typeof OFFICIAL_SCN_CODES)[number];

/** Preferred canonical DB primary keys per SCN (seed + production M4/M5 layout). */
export const CANONICAL_SCENARIO_ID_BY_SCN: Record<OfficialScnCode, number> = {
  "SCN-001": 1,
  "SCN-002": 2,
  "SCN-003": 3,
  "SCN-004": 4,
  "SCN-005": 5,
  "SCN-006": 6,
  "SCN-007": 7,
  "SCN-008": 8,
  "SCN-009": 9,
  "SCN-010": 10,
  "SCN-011": 11,
  "SCN-012": 34,
  "SCN-013": 35,
  "SCN-014": 36,
  "SCN-015": 37,
  "SCN-016": 38,
  "SCN-017": 39,
};

const SCN_BY_CANONICAL_ID: Record<number, OfficialScnCode> = Object.fromEntries(
  Object.entries(CANONICAL_SCENARIO_ID_BY_SCN).map(([scn, id]) => [id, scn as OfficialScnCode])
) as Record<number, OfficialScnCode>;

const MODULE_SCENARIO_OFFSET: Record<number, number> = { 1: 0, 2: 5, 3: 8, 4: 11, 5: 14 };
const MODULE_SCENARIO_MAX: Record<number, number> = { 1: 5, 2: 3, 3: 3, 4: 3, 5: 3 };

export const OFFICIAL_SCN_BY_MODULE: Record<number, OfficialScnCode[]> = {
  1: ["SCN-001", "SCN-002", "SCN-003", "SCN-004", "SCN-005"],
  2: ["SCN-006", "SCN-007", "SCN-008"],
  3: ["SCN-009", "SCN-010", "SCN-011"],
  4: ["SCN-012", "SCN-013", "SCN-014"],
  5: ["SCN-015", "SCN-016", "SCN-017"],
};

export const M1_CANONICAL_SCENARIO_IDS = [1, 2, 3, 4, 5] as const;

export function scnCodeFromNumber(n: number): OfficialScnCode | null {
  if (n < 1 || n > 17) return null;
  return `SCN-${String(n).padStart(3, "0")}` as OfficialScnCode;
}

export function scnNumberFromCode(scn: string): number | null {
  const m = scn.match(/^SCN-(\d{3})$/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return n >= 1 && n <= 17 ? n : null;
}

export function moduleIdFromScnCode(scn: string): number | null {
  const n = scnNumberFromCode(scn);
  if (!n) return null;
  if (n <= 5) return 1;
  if (n <= 8) return 2;
  if (n <= 11) return 3;
  if (n <= 14) return 4;
  return 5;
}

/** Resolve scenario row → SCN code (canonical id map + legacy name/id heuristics). */
export function resolveScenarioScnCode(scenario: ScenarioRef | null | undefined): OfficialScnCode | null {
  if (!scenario) return null;

  const fromCanonicalId = SCN_BY_CANONICAL_ID[scenario.id];
  if (fromCanonicalId && moduleIdFromScnCode(fromCanonicalId) === scenario.moduleId) {
    return fromCanonicalId;
  }

  const nameMatch = scenario.name?.match(/Sc[eé]nario\s*(\d+)/i);
  const idx = nameMatch ? parseInt(nameMatch[1], 10) : null;
  const max = MODULE_SCENARIO_MAX[scenario.moduleId];
  if (idx && max && idx >= 1 && idx <= max) {
    const code = scnCodeFromNumber((MODULE_SCENARIO_OFFSET[scenario.moduleId] ?? 0) + idx);
    if (code) return code;
  }

  if (scenario.moduleId === 1 && scenario.id >= 1 && scenario.id <= 5) {
    return scnCodeFromNumber(scenario.id);
  }

  if (scenario.id >= 6 && scenario.id <= 17) {
    return scnCodeFromNumber(scenario.id);
  }

  const m4m5 = scenario.name?.match(/M[45]\s*[—–-]\s*Sc[eé]nario\s*(\d+)/i);
  if (m4m5 && scenario.moduleId >= 4) {
    const local = parseInt(m4m5[1], 10);
    const offset = MODULE_SCENARIO_OFFSET[scenario.moduleId];
    const max = MODULE_SCENARIO_MAX[scenario.moduleId];
    if (local >= 1 && local <= max) {
      const code = scnCodeFromNumber(offset + local);
      if (code) return code;
    }
  }

  return null;
}

export function getCanonicalScenarioId(scnCode: string): number | null {
  const normalized = scnCode.toUpperCase().replace(/^SCN-?(\d+)$/, (_, d) => `SCN-${d.padStart(3, "0")}`);
  if (normalized in CANONICAL_SCENARIO_ID_BY_SCN) {
    return CANONICAL_SCENARIO_ID_BY_SCN[normalized as OfficialScnCode];
  }
  const n = scnNumberFromCode(normalized);
  if (n) return CANONICAL_SCENARIO_ID_BY_SCN[scnCodeFromNumber(n)!];
  return null;
}

/** Module-local scenario index (1-based) → canonical DB id. */
export function getCanonicalScenarioIdForModule(moduleId: number, scenarioNumber: number): number | null {
  const max = MODULE_SCENARIO_MAX[moduleId];
  if (!max || scenarioNumber < 1 || scenarioNumber > max) return null;
  const scn = scnCodeFromNumber((MODULE_SCENARIO_OFFSET[moduleId] ?? 0) + scenarioNumber);
  return scn ? getCanonicalScenarioId(scn) : null;
}

/** scenarioId (DB id or global SCN number) → SCN code when unambiguous. */
export function scenarioIdToScnCode(scenarioId: number, moduleId?: number): OfficialScnCode | null {
  const fromId = SCN_BY_CANONICAL_ID[scenarioId];
  if (fromId) return fromId;

  const asScn = scnCodeFromNumber(scenarioId);
  if (asScn && (!moduleId || moduleIdFromScnCode(asScn) === moduleId)) return asScn;

  if (moduleId) {
    const canonical = getCanonicalScenarioIdForModule(moduleId, scenarioId);
    if (canonical) return SCN_BY_CANONICAL_ID[canonical] ?? null;
  }

  return null;
}

/**
 * Resolve a route param (DB id, global SCN number, or module-local index) → canonical DB id.
 */
export function resolveRouteScenarioId(moduleId: number, routeParam: number): number | null {
  if (!routeParam || routeParam < 1) return null;

  if (SCN_BY_CANONICAL_ID[routeParam] && moduleIdFromScnCode(SCN_BY_CANONICAL_ID[routeParam]) === moduleId) {
    return routeParam;
  }

  const asGlobalScn = scnCodeFromNumber(routeParam);
  if (asGlobalScn && moduleIdFromScnCode(asGlobalScn) === moduleId) {
    return getCanonicalScenarioId(asGlobalScn);
  }

  const asLocal = getCanonicalScenarioIdForModule(moduleId, routeParam);
  if (asLocal) return asLocal;

  return null;
}

/** Pick the canonical row for an SCN when duplicates exist. */
export function pickCanonicalRowForScn<T extends ScenarioRef>(
  rows: T[],
  scnCode: OfficialScnCode
): T | undefined {
  const preferredId = CANONICAL_SCENARIO_ID_BY_SCN[scnCode];
  const matching = rows.filter((r) => resolveScenarioScnCode(r) === scnCode);
  if (matching.length === 0) return undefined;
  return matching.find((r) => r.id === preferredId) ?? matching[0];
}

/**
 * Deduplicate scenario rows by SCN — one official row per SCN.
 * Prefers canonical DB id; falls back to lowest id for legacy duplicates.
 */
export function dedupeScenariosByScn<T extends ScenarioRef>(rows: T[], moduleId?: number): T[] {
  const byScn = new Map<OfficialScnCode, T>();
  for (const row of rows) {
    if (moduleId != null && row.moduleId !== moduleId) continue;
    const scn = resolveScenarioScnCode(row);
    if (!scn) continue;
    const existing = byScn.get(scn);
    if (!existing) {
      byScn.set(scn, row);
      continue;
    }
    const preferred = CANONICAL_SCENARIO_ID_BY_SCN[scn];
    if (row.id === preferred) {
      byScn.set(scn, row);
    } else if (existing.id !== preferred && row.id < existing.id) {
      byScn.set(scn, row);
    }
  }
  const codes = moduleId != null ? (OFFICIAL_SCN_BY_MODULE[moduleId] ?? []) : [...OFFICIAL_SCN_CODES];
  return codes.map((scn) => byScn.get(scn)).filter((r): r is T => r != null);
}

/** Official catalog for a module (SCN-001–005, etc.), deduped. */
export function filterCanonicalScenariosForModule<T extends ScenarioRef>(
  moduleId: number,
  rows: T[]
): T[] {
  const moduleRows = rows.filter((r) => r.moduleId === moduleId && r.isActive !== false);
  return dedupeScenariosByScn(moduleRows, moduleId);
}

/** All DB ids that map to the same SCN (for run history across duplicate rows). */
export function scenarioIdsForScn<T extends ScenarioRef>(scnCode: OfficialScnCode, rows: T[]): number[] {
  return rows
    .filter((r) => resolveScenarioScnCode(r) === scnCode)
    .map((r) => r.id);
}

/** Match scenario from route param against listed rows (SCN-aware). */
export function matchScenarioForModuleRoute<T extends ScenarioRef>(
  moduleId: number,
  routeParam: number,
  rows: T[]
): T | undefined {
  const canonicalId = resolveRouteScenarioId(moduleId, routeParam);
  if (canonicalId != null) {
    const byId = rows.find((r) => r.id === canonicalId);
    if (byId) return byId;
    const scn = SCN_BY_CANONICAL_ID[canonicalId];
    if (scn) return pickCanonicalRowForScn(rows.filter((r) => r.moduleId === moduleId), scn);
  }

  const direct = rows.find((r) => r.moduleId === moduleId && r.id === routeParam);
  if (direct) return direct;

  const scnFromParam = scenarioIdToScnCode(routeParam, moduleId);
  if (scnFromParam) return pickCanonicalRowForScn(rows.filter((r) => r.moduleId === moduleId), scnFromParam);

  return undefined;
}

export function m1ScnKeyFromCode(scn: OfficialScnCode): string {
  return scn.replace("-", "") as string;
}
