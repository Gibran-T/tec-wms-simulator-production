import { describe, expect, it } from "vitest";
import {
  CANONICAL_SCENARIO_ID_BY_SCN,
  dedupeScenariosByScn,
  filterCanonicalScenariosForModule,
  matchScenarioForModuleRoute,
  OFFICIAL_SCN_BY_MODULE,
  resolveRouteScenarioId,
  resolveScenarioScnCode,
  scenarioIdsForScn,
} from "./canonicalScenarios";

describe("canonicalScenarios — catalog defense", () => {
  const m1WithDuplicates = [
    { id: 1, moduleId: 1, name: "Scénario 1 — Cycle propre" },
    { id: 2, moduleId: 1, name: "Scénario 2 — Réception fantôme (GR non postée)" },
    { id: 3, moduleId: 1, name: "Scénario 3 — Stock insuffisant" },
    { id: 8, moduleId: 1, name: "Scénario 3 — Stock insuffisant (legacy duplicate)" },
    { id: 4, moduleId: 1, name: "Scénario 4 — Écart d'inventaire" },
    { id: 5, moduleId: 1, name: "Scénario 5 — Non-conformités multiples" },
    { id: 12, moduleId: 1, name: "Scénario 5 — Non-conformités (legacy duplicate)" },
  ];

  it("dedupes 7 M1 rows to 5 official SCN-001–005 scenarios", () => {
    const result = filterCanonicalScenariosForModule(1, m1WithDuplicates);
    expect(result).toHaveLength(5);
    expect(result.map((r) => resolveScenarioScnCode(r))).toEqual(OFFICIAL_SCN_BY_MODULE[1]);
    expect(result.map((r) => r.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not render duplicate SCN-003 or SCN-005 rows", () => {
    const result = filterCanonicalScenariosForModule(1, m1WithDuplicates);
    const ids = result.map((r) => r.id);
    expect(ids).not.toContain(8);
    expect(ids).not.toContain(12);
    expect(scenarioIdsForScn("SCN-003", m1WithDuplicates).sort((a, b) => a - b)).toEqual([3, 8]);
    expect(scenarioIdsForScn("SCN-005", m1WithDuplicates).sort((a, b) => a - b)).toEqual([5, 12]);
  });

  it("prefers canonical DB id when deduping same SCN", () => {
    const deduped = dedupeScenariosByScn(m1WithDuplicates, 1);
    const scn003 = deduped.find((r) => resolveScenarioScnCode(r) === "SCN-003");
    const scn005 = deduped.find((r) => resolveScenarioScnCode(r) === "SCN-005");
    expect(scn003?.id).toBe(3);
    expect(scn005?.id).toBe(5);
  });

  it("Silver M1 scope is exactly five official SCN codes", () => {
    expect(OFFICIAL_SCN_BY_MODULE[1]).toHaveLength(5);
    expect(OFFICIAL_SCN_BY_MODULE[1]).toEqual([
      "SCN-001", "SCN-002", "SCN-003", "SCN-004", "SCN-005",
    ]);
  });
});

describe("canonicalScenarios — M4/M5 route resolution", () => {
  const m4Rows = [
    { id: 34, moduleId: 4, name: "M4 — Scénario 1 : Analyse de la rotation des stocks" },
    { id: 35, moduleId: 4, name: "M4 — Scénario 2 : Analyse du taux de service" },
    { id: 36, moduleId: 4, name: "M4 — Scénario 3 : Diagnostic global" },
  ];

  const m5Rows = [
    { id: 37, moduleId: 5, name: "M5 — Scénario 1 : Cycle opérationnel complet" },
    { id: 38, moduleId: 5, name: "M5 — Scénario 2 : Gestion d'écarts" },
    { id: 39, moduleId: 5, name: "M5 — Scénario 3 : Analyse décisionnelle" },
  ];

  it("maps production M4 DB ids 34–36 to SCN-012–014", () => {
    expect(resolveScenarioScnCode(m4Rows[0])).toBe("SCN-012");
    expect(resolveScenarioScnCode(m4Rows[1])).toBe("SCN-013");
    expect(resolveScenarioScnCode(m4Rows[2])).toBe("SCN-014");
  });

  it("resolves SCN number 12 to M4 canonical DB id 34", () => {
    expect(resolveRouteScenarioId(4, 12)).toBe(34);
    expect(matchScenarioForModuleRoute(4, 12, m4Rows)?.id).toBe(34);
  });

  it("resolves SCN number 15 to M5 canonical DB id 37", () => {
    expect(resolveRouteScenarioId(5, 15)).toBe(37);
    expect(CANONICAL_SCENARIO_ID_BY_SCN["SCN-015"]).toBe(37);
    expect(matchScenarioForModuleRoute(5, 15, m5Rows)?.id).toBe(37);
  });

  it("keeps canonical DB id route params working", () => {
    expect(resolveRouteScenarioId(5, 37)).toBe(37);
    expect(matchScenarioForModuleRoute(5, 37, m5Rows)?.id).toBe(37);
    expect(resolveRouteScenarioId(4, 36)).toBe(36);
    expect(matchScenarioForModuleRoute(4, 36, m4Rows)?.id).toBe(36);
  });

  it("resolves module-local scenario index to canonical id", () => {
    expect(resolveRouteScenarioId(5, 1)).toBe(37);
    expect(resolveRouteScenarioId(4, 3)).toBe(36);
    expect(resolveRouteScenarioId(2, 2)).toBe(7);
  });
});
