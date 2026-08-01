import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("m5Doc router isolation", () => {
  it("router source does not call legacy m5 submit* / replenish validators", () => {
    const src = readFileSync(resolve(__dirname, "../m5DocRouter.ts"), "utf8");
    expect(src).toContain("m5DocRouter");
    expect(src).toContain("FORBIDDEN_PROFILE");
    expect(src).toContain("ENABLE_M5_DOC_SUPERVISION");
    expect(src).not.toMatch(/submitReplenish|submitAdj|submitCycleCount|validateM5Replenish/);
    expect(src).not.toMatch(/m5-session-v1/);
  });

  it("migration SQL is additive satellite only", () => {
    const sql = readFileSync(resolve(__dirname, "../../drizzle/0020_m5_doc_mission_states.sql"), "utf8");
    expect(sql).toContain("m5_doc_mission_states");
    expect(sql).toContain("UNIQUE KEY");
    expect(sql).not.toMatch(/ALTER TABLE `scenario_runs`/);
    expect(sql).not.toMatch(/UPDATE `scenario_runs`/);
  });
});
