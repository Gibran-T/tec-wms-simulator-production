import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { createInitialM5DocState } from "./createInitialState";
import { buildCanonicalProgressionPayloads, submitM5DocInteraction } from "./engine";
import { buildCoherentHandoverFromState } from "./handoverGuard";
import { buildM5DocProfessorView } from "./professorView";

describe("M5 DOC professor / RBAC contracts", () => {
  it("router forbids student professor view and requires feature flag before persistence", () => {
    const src = readFileSync(resolve(__dirname, "../m5DocRouter.ts"), "utf8");
    expect(src).toMatch(/Teacher\/admin only|role !== "teacher"/);
    const assertFn = src.slice(src.indexOf("async function assertDocRunAccess"));
    expect(assertFn.indexOf("isM5DocFeatureEnabled()")).toBeGreaterThanOrEqual(0);
    expect(assertFn.indexOf("isM5DocFeatureEnabled()")).toBeLessThan(assertFn.indexOf("getRunById"));
    // Procedures call assert before load
    expect(src).toMatch(/assertDocRunAccess[\s\S]{0,220}loadM5DocState/);
    expect(src).toContain("FORBIDDEN_PROFILE");
    expect(src).toContain("__m5DocLocks");
  });

  it("professor view has no ops-ledger fields after full run", () => {
    let state = createInitialM5DocState(99, "SCN-015-DOC");
    for (const step of buildCanonicalProgressionPayloads()) {
      const mode = step.id.startsWith("INT-PRE") ? "FORMATIVE" : "OFFICIAL";
      const res = submitM5DocInteraction({
        state,
        interactionId: step.id,
        payload: step.payload,
        mode,
        actorRole: "student",
      });
      if (res.ok) state = res.state;
    }
    const post = submitM5DocInteraction({
      state,
      interactionId: "INT-POST-01",
      payload: buildCoherentHandoverFromState(state),
      mode: "OFFICIAL",
      actorRole: "student",
    });
    if (post.ok) state = post.state;
    const view = buildM5DocProfessorView(state);
    expect(view.byInteraction).toHaveLength(31);
    expect(view.timeline.length).toBeGreaterThan(20);
    expect(view.handoverQuality.status).toBe("Transmis");
    const blob = JSON.stringify(view);
    expect(blob).not.toMatch(/replenish|inventoryAccuracy|m5Contract|kpiSnapshot|M5_ADJ/i);
  });

  it("App route wires professor page", () => {
    const app = readFileSync(resolve(__dirname, "../../client/src/App.tsx"), "utf8");
    expect(app).toContain("/teacher/m5-doc/:runId");
    expect(app).toContain("M5DocProfessorPage");
  });
});
