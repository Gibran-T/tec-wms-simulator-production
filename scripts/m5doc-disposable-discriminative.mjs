/**
 * Discriminative path on disposable local DB (same instance as E2E).
 */
import mysql from "mysql2/promise";
import { createInitialM5DocState } from "../server/m5Doc/createInitialState.ts";
import { buildCanonicalProgressionPayloads, submitM5DocInteraction } from "../server/m5Doc/engine.ts";
import { buildCoherentHandoverFromState } from "../server/m5Doc/handoverGuard.ts";
import { M5_DOC_EVIDENCE_VERSION } from "../shared/m5Doc/types.ts";

const URL = process.env.M5DOC_DISPOSABLE_DATABASE_URL || "mysql://root@127.0.0.1:3310/m5_doc_qa_disposable";
if (!/@(127\.0\.0\.1|localhost)[:/]/i.test(URL) || /railway|rlwy/i.test(URL)) {
  throw new Error("REFUSED_NON_LOCAL");
}

const conn = await mysql.createConnection(URL);
const [u] = await conn.query("SELECT id FROM users WHERE openId='m5doc-qa-local-student'");
const [s] = await conn.query("SELECT id FROM scenarios WHERE name LIKE '%SCN-015-DOC%' LIMIT 1");
const [runIns] = await conn.query(
  "INSERT INTO scenario_runs (userId, scenarioId, status, isDemo) VALUES (?, ?, 'in_progress', 0)",
  [u[0].id, s[0].id],
);
const runId = runIns.insertId;
let state = createInitialM5DocState(runId, "SCN-015-DOC");
const results = [];

const push = (label, res) => {
  results.push({
    label,
    ok: res.ok,
    code: res.ok ? null : res.code,
    correct: res.ok ? res.correct : false,
    tags: res.ok ? res.tags : [],
    handover: res.ok ? res.state.handover?.status : null,
  });
  if (res.ok) state = res.state;
};

push(
  "INT-PRE-01:wrong_formative",
  submitM5DocInteraction({
    state,
    interactionId: "INT-PRE-01",
    payload: { s1: "ECART", s2: "DEMANDE", s3: "INTERVENTION", s4: "DECISION" },
    mode: "FORMATIVE",
    actorRole: "student",
  }),
);

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

const malformed = submitM5DocInteraction({
  state,
  interactionId: "INT-015-01",
  payload: null,
  mode: "OFFICIAL",
  actorRole: "student",
});
push("INT-015-01:malformed", malformed);
const malformedDidNotConsume = !state.officialScores["INT-015-01"];

push(
  "INT-015-01:wrong_official",
  submitM5DocInteraction({
    state,
    interactionId: "INT-015-01",
    payload: "E-144",
    mode: "OFFICIAL",
    actorRole: "student",
  }),
);
const locked = submitM5DocInteraction({
  state,
  interactionId: "INT-015-01",
  payload: "D-143",
  mode: "OFFICIAL",
  actorRole: "student",
});
push("INT-015-01:double", locked);

state = createInitialM5DocState(runId + 1000, "SCN-015-DOC");
for (const step of buildCanonicalProgressionPayloads().slice(0, 13)) {
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
push(
  "INT-015-08:close_without_proof",
  submitM5DocInteraction({
    state,
    interactionId: "INT-015-08",
    payload: "close",
    mode: "OFFICIAL",
    actorRole: "student",
  }),
);

state = createInitialM5DocState(runId + 2000, "SCN-015-DOC");
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
push(
  "INT-017-02:incoherent",
  submitM5DocInteraction({
    state,
    interactionId: "INT-017-02",
    payload: [
      { demandId: "D-117", resource: "chefQuai", mode: "SURVEILLER" },
      { demandId: "D-143", resource: "chefQuai+equipeQuai", mode: "REAFFECTER" },
      { demandId: "D-144", resource: "technicienFrigo", mode: "SURVEILLER" },
    ],
    mode: "OFFICIAL",
    actorRole: "student",
  }),
);

state = createInitialM5DocState(runId + 3000, "SCN-015-DOC");
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
const badHo = buildCoherentHandoverFromState(state);
badHo.gaps = [];
push(
  "INT-POST-01:contradictory",
  submitM5DocInteraction({
    state,
    interactionId: "INT-POST-01",
    payload: badHo,
    mode: "OFFICIAL",
    actorRole: "student",
  }),
);

await conn.query(
  "INSERT INTO m5_doc_mission_states (runId, version, stateJson) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE stateJson=VALUES(stateJson)",
  [runId, M5_DOC_EVIDENCE_VERSION, JSON.stringify(state)],
);

const summary = {
  ok: true,
  host: "127.0.0.1:3310",
  database: "m5_doc_qa_disposable",
  malformedRejected: !malformed.ok && malformed.code === "PAYLOAD_INVALIDE",
  malformedDidNotConsume,
  doubleSubmitLocked: !locked.ok && locked.code === "SCORE_ONCE_LOCKED",
  closeWithoutProofTagged: results.find((r) => r.label.includes("close_without_proof"))?.tags?.includes(
    "CLOTURE_SANS_PREUVE",
  ),
  matrixIncoherent: results.find((r) => r.label.includes("incoherent"))?.tags?.includes("MATRIX_INCOHERENTE"),
  handoverStaysBrouillon: state.handover.status === "Brouillon",
  results,
};
console.log(JSON.stringify(summary, null, 2));
await conn.end();
process.exit(
  summary.malformedRejected &&
    summary.malformedDidNotConsume &&
    summary.doubleSubmitLocked &&
    summary.handoverStaysBrouillon
    ? 0
    : 4,
);
