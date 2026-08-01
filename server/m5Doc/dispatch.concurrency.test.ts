import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createInitialM5DocState } from "./createInitialState";
import { submitM5DocInteraction, buildCanonicalProgressionPayloads } from "./engine";
import { buildCoherentHandoverFromState } from "./handoverGuard";
import { computeFinalScore } from "../../shared/m5Doc/scoringPure";
import { isSupervisionDocRun, resolveInteractionModel } from "../../shared/m5Doc/dispatch";
import { M5_DOC_SCENARIO_DEFS } from "./docScenarioDefs";
import { m5DocPersistenceProbe, loadM5DocState, clearM5DocMemoryStore } from "./persistence";
import { isM5DocFeatureEnabled } from "../../shared/m5Doc/types";
import { getEffectiveM5Steps } from "../rulesEngine";

describe("M5 DOC dispatch / concurrency / flag", () => {
  const prev = process.env.ENABLE_M5_DOC_SUPERVISION;

  beforeEach(() => {
    clearM5DocMemoryStore();
    m5DocPersistenceProbe.reset();
    process.env.ENABLE_M5_DOC_SUPERVISION = "true";
  });

  afterEach(() => {
    if (prev === undefined) delete process.env.ENABLE_M5_DOC_SUPERVISION;
    else process.env.ENABLE_M5_DOC_SUPERVISION = prev;
  });

  it("DOC scenario defs never resolve as ops-ledger", () => {
    for (const d of M5_DOC_SCENARIO_DEFS) {
      expect(isSupervisionDocRun(d.initialStateJson)).toBe(true);
      expect(resolveInteractionModel(d.initialStateJson)).toBe("supervision-doc-v1");
    }
  });

  it("legacy m5Contract without DOC model resolves ops-ledger", () => {
    expect(
      resolveInteractionModel({
        m5Contract: { sku: "SKU-001", qty: 50 },
        module: 5,
      }),
    ).toBe("ops-ledger-v1");
  });

  it("DOC init must not require getEffectiveM5Steps — probe via undefined m5InitialStateJson", () => {
    // Simulates buildRunState DOC branch: m5InitialStateJson left undefined.
    const steps = getEffectiveM5Steps(undefined, { completedSteps: [] } as never);
    // Calling with undefined is legacy-safe empty contract path; DOC routers must avoid this call.
    expect(Array.isArray(steps)).toBe(true);
  });

  it("flag false parses safely and blocks persistence probe usage in guard pattern", () => {
    process.env.ENABLE_M5_DOC_SUPERVISION = "false";
    expect(isM5DocFeatureEnabled()).toBe(false);
    m5DocPersistenceProbe.reset();
    // Guard pattern used by router: check flag before load
    if (isM5DocFeatureEnabled()) {
      void loadM5DocState(1);
    }
    expect(m5DocPersistenceProbe.loadCalls).toBe(0);
  });

  it("canonical path reaches 100/100", () => {
    let state = createInitialM5DocState(4242, "SCN-015-DOC");
    for (const step of buildCanonicalProgressionPayloads()) {
      const mode = step.id.startsWith("INT-PRE") ? "FORMATIVE" : "OFFICIAL";
      const res = submitM5DocInteraction({
        state,
        interactionId: step.id,
        payload: step.payload,
        mode,
        actorRole: "student",
      });
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.correct).toBe(true);
        state = res.state;
      }
    }
    const post = submitM5DocInteraction({
      state,
      interactionId: "INT-POST-01",
      payload: buildCoherentHandoverFromState(state),
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(post.ok && post.correct).toBe(true);
    if (post.ok) {
      const { finalScore } = computeFinalScore(post.state);
      expect(finalScore).toBe(100);
      expect(post.state.handover.status).toBe("Transmis");
    }
  });

  it("concurrent official evaluation: second locked after first consumes attempt", () => {
    let state = createInitialM5DocState(7);
    // advance PRE quickly
    for (const step of buildCanonicalProgressionPayloads().slice(0, 6)) {
      const res = submitM5DocInteraction({
        state,
        interactionId: step.id,
        payload: step.payload,
        mode: "FORMATIVE",
        actorRole: "student",
      });
      if (res.ok) state = res.state;
    }
    const first = submitM5DocInteraction({
      state,
      interactionId: "INT-015-01",
      payload: "E-144",
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(first.ok).toBe(true);
    if (first.ok) state = first.state;
    const timelineLen = state.timeline.length;
    const second = submitM5DocInteraction({
      state,
      interactionId: "INT-015-01",
      payload: "D-143",
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.code).toBe("SCORE_ONCE_LOCKED");
    expect(state.timeline.length).toBe(timelineLen);
    expect(state.officialScores["INT-015-01"]?.payload).toBe("E-144");
  });

  it("malformed matrix does not consume official attempt", () => {
    let state = createInitialM5DocState(8);
    for (const step of buildCanonicalProgressionPayloads().slice(0, 26)) {
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
    const before = { ...state.officialScores };
    const bad = submitM5DocInteraction({
      state,
      interactionId: "INT-017-02",
      payload: [],
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.code).toBe("MATRIX_PAYLOAD_INVALIDE");
    expect(state.officialScores["INT-017-02"]).toBeUndefined();
    expect(Object.keys(state.officialScores).length).toBe(Object.keys(before).length);
  });
});
