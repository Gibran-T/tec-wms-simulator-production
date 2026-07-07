import { describe, expect, it } from "vitest";
import {
  findActiveRunForScenario,
  findCompletedRunForScenario,
  resolveDisplayActiveRunForScenario,
  resolveMissionPrimaryAction,
} from "./scenarioCatalog";

const moduleRows = [
  { id: 1, moduleId: 1, name: "SCN-001 — Réception" },
  { id: 2, moduleId: 1, name: "SCN-002 — Expédition" },
];

const m1WithDuplicates = [
  { id: 1, moduleId: 1, name: "Scénario 1 — Cycle propre" },
  { id: 2, moduleId: 1, name: "Scénario 2 — Réception fantôme (GR non postée)" },
  { id: 3, moduleId: 1, name: "Scénario 3 — Stock insuffisant" },
  { id: 8, moduleId: 1, name: "Scénario 3 — Stock insuffisant (legacy duplicate)" },
  { id: 4, moduleId: 1, name: "Scénario 4 — Écart d'inventaire" },
  { id: 5, moduleId: 1, name: "Scénario 5 — Non-conformités multiples" },
  { id: 12, moduleId: 1, name: "Scénario 5 — Non-conformités (legacy duplicate)" },
];

describe("scenarioCatalog — unlimited replay helpers", () => {
  it("findCompletedRunForScenario returns best score, not first match", () => {
    const runs = [
      { run: { id: 10, scenarioId: 1, status: "completed", isDemo: false, score: 55 }, score: 55 },
      { run: { id: 11, scenarioId: 1, status: "completed", isDemo: false, score: 82 }, score: 82 },
      { run: { id: 12, scenarioId: 1, status: "completed", isDemo: false, score: 70 }, score: 70 },
    ];
    const best = findCompletedRunForScenario(moduleRows[0], moduleRows, runs);
    expect(best?.run.id).toBe(11);
    expect(best?.score).toBe(82);
  });

  it("findActiveRunForScenario still resolves in-progress eval run when replays exist", () => {
    const runs = [
      { run: { id: 20, scenarioId: 1, status: "completed", isDemo: false, score: 90 }, score: 90 },
      { run: { id: 21, scenarioId: 1, status: "in_progress", isDemo: false }, score: null },
    ];
    const active = findActiveRunForScenario(moduleRows[0], moduleRows, runs);
    expect(active?.run.id).toBe(21);
  });

  it("resolveDisplayActiveRunForScenario ignores stale in-progress behind a newer completion", () => {
    const runs = [
      { run: { id: 15, scenarioId: 1, status: "in_progress", isDemo: false }, score: null },
      { run: { id: 20, scenarioId: 1, status: "completed", isDemo: false, score: 100 }, score: 100 },
    ];
    const active = resolveDisplayActiveRunForScenario(moduleRows[0], moduleRows, runs);
    expect(active).toBeUndefined();
    expect(resolveMissionPrimaryAction(active, findCompletedRunForScenario(moduleRows[0], moduleRows, runs))).toBe(
      "replay",
    );
  });

  it("resolveDisplayActiveRunForScenario keeps a replay attempt active after prior completion", () => {
    const runs = [
      { run: { id: 20, scenarioId: 1, status: "completed", isDemo: false, score: 90 }, score: 90 },
      { run: { id: 21, scenarioId: 1, status: "in_progress", isDemo: false }, score: null },
    ];
    const active = resolveDisplayActiveRunForScenario(moduleRows[0], moduleRows, runs);
    expect(active?.run.id).toBe(21);
    expect(resolveMissionPrimaryAction(active, findCompletedRunForScenario(moduleRows[0], moduleRows, runs))).toBe(
      "continue",
    );
  });

  it("M1 legacy duplicate row in_progress does not block canonical SCN-003 replay UI", () => {
    const runs = [
      { run: { id: 30, scenarioId: 3, status: "completed", isDemo: false, score: 88 }, score: 88 },
      { run: { id: 99, scenarioId: 8, status: "in_progress", isDemo: false }, score: null },
    ];
    const canonicalScn003 = m1WithDuplicates[2];
    const active = resolveDisplayActiveRunForScenario(canonicalScn003, m1WithDuplicates, runs);
    const completed = findCompletedRunForScenario(canonicalScn003, m1WithDuplicates, runs);
    expect(active).toBeUndefined();
    expect(completed?.run.id).toBe(30);
    expect(resolveMissionPrimaryAction(active, completed)).toBe("replay");
  });

  it("M1 legacy duplicate row in_progress does not block canonical SCN-005 replay UI", () => {
    const runs = [
      { run: { id: 40, scenarioId: 5, status: "completed", isDemo: false, score: 100 }, score: 100 },
      { run: { id: 120, scenarioId: 12, status: "in_progress", isDemo: false }, score: null },
    ];
    const canonicalScn005 = m1WithDuplicates[5];
    const active = resolveDisplayActiveRunForScenario(canonicalScn005, m1WithDuplicates, runs);
    const completed = findCompletedRunForScenario(canonicalScn005, m1WithDuplicates, runs);
    expect(active).toBeUndefined();
    expect(completed?.run.id).toBe(40);
    expect(resolveMissionPrimaryAction(active, completed)).toBe("replay");
  });
});
