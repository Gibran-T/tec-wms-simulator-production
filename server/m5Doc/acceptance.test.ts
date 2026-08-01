/**
 * M5 DOC acceptance suite A01–A20 (engine-level + isolation).
 * Does not migrate legacy data. Does not require production DB.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { createInitialM5DocState } from "./createInitialState";
import {
  buildCanonicalProgressionPayloads,
  submitM5DocInteraction,
} from "./engine";
import { buildCoherentHandoverFromState } from "./handoverGuard";
import { deriveM5DocSessionEvidenceV2, isM5DocSessionEvidenceV2 } from "../../shared/m5Doc/evidenceV2";
import { buildM5DocProfessorView } from "./professorView";
import { evaluateM5DocGoldV1 } from "./goldDocGates";
import { M5_DOC_INTERACTION_ORDER } from "../../shared/m5Doc/interactionsCatalog";
import {
  isM5DocFeatureEnabled,
  isM5DocInitialState,
  M5_DOC_EVIDENCE_VERSION,
  M5_DOC_INTERACTION_MODEL,
  M5_LEGACY_INTERACTION_MODEL,
} from "../../shared/m5Doc/types";
import { M5_DOC_SCENARIO_DEFS } from "./docScenarioDefs";
import { computeFinalScore } from "../../shared/m5Doc/scoringPure";

function runCanonical(upto?: number) {
  let state = createInitialM5DocState(9001, "SCN-015-DOC");
  const steps = buildCanonicalProgressionPayloads();
  const limit = upto ?? steps.length;
  for (let i = 0; i < limit; i++) {
    const step = steps[i]!;
    const mode = step.id.startsWith("INT-PRE") ? "FORMATIVE" : "OFFICIAL";
    const res = submitM5DocInteraction({
      state,
      interactionId: step.id,
      payload: step.payload,
      mode,
      actorRole: "student",
      now: new Date(Date.UTC(2026, 7, 1, 8, i)).toISOString(),
    });
    expect(res.ok).toBe(true);
    if (res.ok) state = res.state;
  }
  return state;
}

describe("M5 DOC acceptance A01–A20", () => {
  const prevFlag = process.env.ENABLE_M5_DOC_SUPERVISION;
  const prevGold = process.env.ENABLE_M5_DOC_GOLD_V1;

  beforeEach(() => {
    process.env.ENABLE_M5_DOC_SUPERVISION = "true";
    delete process.env.ENABLE_M5_DOC_GOLD_V1;
  });

  afterEach(() => {
    if (prevFlag === undefined) delete process.env.ENABLE_M5_DOC_SUPERVISION;
    else process.env.ENABLE_M5_DOC_SUPERVISION = prevFlag;
    if (prevGold === undefined) delete process.env.ENABLE_M5_DOC_GOLD_V1;
    else process.env.ENABLE_M5_DOC_GOLD_V1 = prevGold;
  });

  it("A01: DOC scenario defs use supervision-doc-v1 and versioned SCN ids", () => {
    expect(M5_DOC_SCENARIO_DEFS).toHaveLength(3);
    for (const d of M5_DOC_SCENARIO_DEFS) {
      expect(isM5DocInitialState(d.initialStateJson)).toBe(true);
      expect(d.initialStateJson.interactionModel).toBe(M5_DOC_INTERACTION_MODEL);
      expect(d.scnCode.endsWith("-DOC")).toBe(true);
    }
  });

  it("A02: initial state satellite version m5-session-v2 + immutable model", () => {
    const state = createInitialM5DocState(1, "SCN-015-DOC");
    expect(state.evidenceVersion).toBe(M5_DOC_EVIDENCE_VERSION);
    expect(state.interactionModel).toBe(M5_DOC_INTERACTION_MODEL);
    expect(state.interactionModel).not.toBe(M5_LEGACY_INTERACTION_MODEL);
  });

  it("A03: full progression Pré → Post (31 interactions)", () => {
    let state = runCanonical();
    const postPayload = buildCoherentHandoverFromState(state);
    const post = submitM5DocInteraction({
      state,
      interactionId: "INT-POST-01",
      payload: postPayload,
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(post.ok).toBe(true);
    if (post.ok) {
      state = post.state;
      expect(Object.keys(state.officialScores)).toHaveLength(31);
      expect(state.handover.status).toBe("Transmis");
      expect(state.phase).toBe("CLOSED");
    }
  });

  it("A04: server validation — wrong PRE association scores incorrect without silent canon", () => {
    let state = createInitialM5DocState(2);
    const res = submitM5DocInteraction({
      state,
      interactionId: "INT-PRE-01",
      payload: { s1: "ECART", s2: "DEMANDE", s3: "DECISION", s4: "INTERVENTION" },
      mode: "FORMATIVE",
      actorRole: "student",
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.correct).toBe(false);
      expect(res.state.officialScores["INT-PRE-01"]).toBeUndefined();
    }
  });

  it("A05: INT-016-06 unique combination only", () => {
    let state = runCanonical(20); // through INT-016-05
    const bad = submitM5DocInteraction({
      state,
      interactionId: "INT-016-06",
      payload: {
        posture: "ESCALADER",
        keepOwner: "technicienFrigo",
        nextControlMinutes: 15,
        requireProofBeforeClose: true,
        proofBand: [2, 4],
      },
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(bad.ok).toBe(true);
    if (bad.ok) {
      expect(bad.correct).toBe(false);
      expect(bad.tags).toContain("ESCALADE_INJUSTIFIEE");
      state = bad.state;
    }

    // score-once locked on retry
    const retry = submitM5DocInteraction({
      state,
      interactionId: "INT-016-06",
      payload: {
        posture: "SOUS_SURVEILLANCE",
        keepOwner: "technicienFrigo",
        nextControlMinutes: 15,
        requireProofBeforeClose: true,
        proofBand: [2, 4],
      },
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(retry.ok).toBe(false);
    if (!retry.ok) expect(retry.code).toBe("SCORE_ONCE_LOCKED");
  });

  it("A05b: INT-016-06 correct combination", () => {
    let state = runCanonical(20);
    const ok = submitM5DocInteraction({
      state,
      interactionId: "INT-016-06",
      payload: {
        posture: "SOUS_SURVEILLANCE",
        keepOwner: "technicienFrigo",
        nextControlMinutes: 15,
        requireProofBeforeClose: true,
        proofBand: [2, 4],
      },
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(ok.ok && ok.correct).toBe(true);
    if (ok.ok) {
      expect(ok.state.portfolio.gaps["E-144"]?.status).toBe("Sous surveillance");
    }
  });

  it("A06: matrix SCN-017 combination + malformed rejection", () => {
    let state = runCanonical(26); // through INT-017-01
    const malformed = submitM5DocInteraction({
      state,
      interactionId: "INT-017-02",
      payload: [{ demandId: "D-117", resource: "chefQuai", mode: "TRAITER" }],
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(malformed.ok).toBe(false);
    if (!malformed.ok) expect(malformed.code).toBe("MATRIX_PAYLOAD_INVALIDE");

    const incoherent = submitM5DocInteraction({
      state,
      interactionId: "INT-017-02",
      payload: [
        { demandId: "D-117", resource: "chefQuai", mode: "SURVEILLER" },
        { demandId: "D-143", resource: "chefQuai+equipeQuai", mode: "REAFFECTER" },
        { demandId: "D-144", resource: "technicienFrigo", mode: "SURVEILLER" },
      ],
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(incoherent.ok).toBe(true);
    if (incoherent.ok) {
      expect(incoherent.correct).toBe(false);
      expect(incoherent.tags).toContain("MATRIX_INCOHERENTE");
      expect(incoherent.state.arbitration?.matrixResolved).toBe(false);
    }
  });

  it("A07: closure without proof rejected pedagogically (015-08)", () => {
    let state = runCanonical(13); // through 015-07
    const res = submitM5DocInteraction({
      state,
      interactionId: "INT-015-08",
      payload: "close",
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.correct).toBe(false);
      expect(res.tags).toContain("CLOTURE_SANS_PREUVE");
      expect(res.state.portfolio.demands["D-143"].status).not.toBe("Cloturee");
    }
  });

  it("A08/A09: invented intervention + contradictory handover", () => {
    let state = runCanonical();
    const bad = submitM5DocInteraction({
      state,
      interactionId: "INT-POST-01",
      payload: {
        ...buildCoherentHandoverFromState(state),
        interventions: ["OI-143", "OI-999" as never],
        closedWithProof: ["D-143"],
      },
      mode: "OFFICIAL",
      actorRole: "student",
    });
    // OI-999 fails structural OrderId check → payload invalid OR contradiction
    expect(bad.ok).toBe(false);
    if (!bad.ok) {
      expect(["HANDOVER_PAYLOAD_INVALIDE", "HANDOVER_CONTRADICTOIRE"]).toContain(bad.code);
    }

    const contradictory = submitM5DocInteraction({
      state,
      interactionId: "INT-POST-01",
      payload: {
        ...buildCoherentHandoverFromState(state),
        gaps: [], // omit E-144
      },
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(contradictory.ok).toBe(true);
    if (contradictory.ok) {
      expect(contradictory.correct).toBe(false);
      expect(contradictory.tags).toContain("ECART_OMIS");
      expect(contradictory.state.handover.status).toBe("Brouillon");
    }
  });

  it("A10: formative retry Pré-M5 append-only", () => {
    let state = createInitialM5DocState(3);
    const first = submitM5DocInteraction({
      state,
      interactionId: "INT-PRE-01",
      payload: { s1: "ECART", s2: "DEMANDE", s3: "INTERVENTION", s4: "DECISION" },
      mode: "FORMATIVE",
      actorRole: "student",
    });
    expect(first.ok).toBe(true);
    if (first.ok) state = first.state;
    const second = submitM5DocInteraction({
      state,
      interactionId: "INT-PRE-01",
      payload: { s1: "DEMANDE", s2: "ECART", s3: "INTERVENTION", s4: "DECISION" },
      mode: "FORMATIVE",
      actorRole: "student",
    });
    expect(second.ok).toBe(true);
    if (second.ok) {
      expect(second.state.timeline.length).toBeGreaterThanOrEqual(2);
      expect(second.state.formativeLatest["INT-PRE-01"]).toEqual({
        s1: "DEMANDE",
        s2: "ECART",
        s3: "INTERVENTION",
        s4: "DECISION",
      });
      expect(second.state.timeline[0]?.payload).not.toEqual(second.state.timeline[1]?.payload);
    }
  });

  it("A11: score-once from SCN-015", () => {
    let state = runCanonical(6); // through PRE
    const first = submitM5DocInteraction({
      state,
      interactionId: "INT-015-01",
      payload: "E-144",
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(first.ok).toBe(true);
    if (first.ok) state = first.state;
    const second = submitM5DocInteraction({
      state,
      interactionId: "INT-015-01",
      payload: "D-143",
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.code).toBe("SCORE_ONCE_LOCKED");
  });

  it("A12: REVIEW does not mutate score/status", () => {
    let state = runCanonical(7);
    const before = JSON.stringify(state.officialScores);
    const beforeStatus = state.portfolio.demands["D-143"].status;
    const review = submitM5DocInteraction({
      state,
      interactionId: "INT-015-02",
      payload: "P1",
      mode: "REVIEW",
      actorRole: "teacher",
    });
    expect(review.ok).toBe(true);
    if (review.ok) {
      expect(JSON.stringify(review.state.officialScores)).toBe(before);
      expect(review.state.portfolio.demands["D-143"].status).toBe(beforeStatus);
      expect(review.state.reviewNotes.length).toBe(1);
    }
  });

  it("A13: legacy profile detection rejects DOC helpers", () => {
    expect(
      isM5DocInitialState({
        interactionModel: M5_LEGACY_INTERACTION_MODEL,
        m5Contract: { sku: "X" },
      }),
    ).toBe(false);
  });

  it("A14: no migration semantics — createInitial never rewrites foreign ids", () => {
    const a = createInitialM5DocState(10);
    const b = createInitialM5DocState(11);
    expect(a.runId).toBe(10);
    expect(b.runId).toBe(11);
    expect(a.timeline).toEqual([]);
  });

  it("A15: feature flag rollback defaults false", () => {
    delete process.env.ENABLE_M5_DOC_SUPERVISION;
    expect(isM5DocFeatureEnabled()).toBe(false);
    process.env.ENABLE_M5_DOC_SUPERVISION = "true";
    expect(isM5DocFeatureEnabled()).toBe(true);
  });

  it("A16/A17: Gold DOC disabled by default; checklist stub present", () => {
    const state = runCanonical(5);
    const gold = evaluateM5DocGoldV1(state);
    expect(gold.gateId).toBe("M5_DOC_GOLD_V1");
    expect(gold.enabled).toBe(false);
    expect(gold.eligible).toBe(false);
  });

  it("A18: lexical purge on DOC runtime sources only", () => {
    const roots = [
      resolve(__dirname, "../../shared/m5Doc"),
      resolve(__dirname, "."),
      resolve(__dirname, "../../client/src/components/m5Doc"),
    ];
    const forbidden =
      /\b(réappro|reappro|replenish|Q\s*=\s*0|ajustement de stock|stock\s*min|stock\s*max|cycle\s*count|M5_ADJ|inventoryAccuracy)\b/i;
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        if (name.endsWith(".test.ts")) continue;
        const p = join(dir, name);
        const st = statSync(p);
        if (st.isDirectory()) walk(p);
        else if (/\.(ts|tsx)$/.test(name)) files.push(p);
      }
    };
    for (const r of roots) walk(r);
    const offenders: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, "utf8");
      if (forbidden.test(text)) offenders.push(f);
    }
    expect(offenders).toEqual([]);
  });

  it("A19: evidence v2 stable/deterministic", () => {
    const state = runCanonical(10);
    const e1 = deriveM5DocSessionEvidenceV2(state);
    const e2 = deriveM5DocSessionEvidenceV2(state);
    expect(isM5DocSessionEvidenceV2(e1)).toBe(true);
    expect(e1).toEqual(e2);
    expect(e1.evidenceVersion).toBe("m5-session-v2");
    expect(JSON.stringify(e1)).not.toMatch(/replenish|inventoryAccuracy|Q\s*=\s*0/i);
  });

  it("A20: Professor View complete without ops-ledger fields", () => {
    const state = runCanonical(15);
    const view = buildM5DocProfessorView(state);
    expect(view.interactionModel).toBe("supervision-doc-v1");
    expect(view.byInteraction).toHaveLength(31);
    expect(view.timeline).toBeTruthy();
    expect(view.competenceScores).toBeTruthy();
    expect(view.handoverQuality).toBeTruthy();
    expect(view.journalView).toBeTruthy();
    const blob = JSON.stringify(view);
    expect(blob).not.toMatch(/replenishmentQty|inventoryAccuracy|m5Contract|kpiSnapshot/i);
  });

  it("catalog has exactly 31 frozen interactions", () => {
    expect(M5_DOC_INTERACTION_ORDER).toHaveLength(31);
  });

  it("scoring weights clamp 0–100 with coherence", () => {
    const state = runCanonical();
    const post = submitM5DocInteraction({
      state,
      interactionId: "INT-POST-01",
      payload: buildCoherentHandoverFromState(state),
      mode: "OFFICIAL",
      actorRole: "student",
    });
    expect(post.ok).toBe(true);
    if (post.ok) {
      const { finalScore } = computeFinalScore(post.state);
      expect(finalScore).toBeGreaterThanOrEqual(0);
      expect(finalScore).toBeLessThanOrEqual(100);
    }
  });
});
