import { describe, expect, it } from "vitest";
import { selectRunsForHub } from "./hubSelection";

describe("selectRunsForHub", () => {
  it("keeps leftover in-progress runs plus latest completed per scenario", () => {
    const selected = selectRunsForHub([
      { run: { id: 774, scenarioId: 16, status: "completed", userId: 222, completedAt: "2026-07-01T00:00:00.000Z" } },
      { run: { id: 778, scenarioId: 16, status: "in_progress", userId: 222, completedAt: null } },
      { run: { id: 100, scenarioId: 16, status: "abandoned", userId: 222, completedAt: "2026-06-01T00:00:00.000Z" } },
      { run: { id: 50, scenarioId: 16, status: "completed", userId: 222, completedAt: "2026-05-01T00:00:00.000Z" } },
    ]);
    const ids = selected.map((r) => r.run.id).sort((a, b) => a - b);
    expect(ids).toEqual([774, 778]);
  });

  it("does not drop a second student's completed run", () => {
    const selected = selectRunsForHub([
      { run: { id: 1, scenarioId: 1, status: "completed", userId: 10, completedAt: "2026-01-01T00:00:00.000Z" } },
      { run: { id: 2, scenarioId: 1, status: "completed", userId: 11, completedAt: "2026-01-01T00:00:00.000Z" } },
    ]);
    expect(selected).toHaveLength(2);
  });
});
