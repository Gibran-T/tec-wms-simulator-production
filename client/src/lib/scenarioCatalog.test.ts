import { describe, expect, it } from "vitest";
import {
  findActiveRunForScenario,
  findCompletedRunForScenario,
} from "./scenarioCatalog";

const moduleRows = [
  { id: 1, moduleId: 1, name: "SCN-001 — Réception" },
  { id: 2, moduleId: 1, name: "SCN-002 — Expédition" },
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
});
