/**
 * Disposable LOCAL E2E for M5 DOC:
 * - assert local empty-ish DB
 * - ensure FK
 * - seed DOC scenarios + test user
 * - create run + satellite state
 * - run canonical 31 interactions via engine
 * NEVER uses Railway/production URL.
 */
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import {
  modules,
  scenarios,
  users,
} from "../drizzle/schema.ts";

const URL = process.env.M5DOC_DISPOSABLE_DATABASE_URL || "mysql://root@127.0.0.1:3310/m5_doc_qa_disposable";

function assertLocal(url) {
  if (!/@(127\.0\.0\.1|localhost)[:/]/i.test(url)) {
    throw new Error("REFUSED_NON_LOCAL_DATABASE");
  }
  if (/railway|rlwy|amazonaws|azure|cloud/i.test(url)) {
    throw new Error("REFUSED_REMOTE_DATABASE");
  }
}

assertLocal(URL);
process.env.DATABASE_URL = URL;
process.env.ENABLE_M5_DOC_SUPERVISION = "true";
process.env.ENABLE_M5_DOC_GOLD_V1 = "false";

const { M5_DOC_SCENARIO_DEFS } = await import("../server/m5Doc/docScenarioDefs.ts");
const { createInitialM5DocState } = await import("../server/m5Doc/createInitialState.ts");
const { buildCanonicalProgressionPayloads, submitM5DocInteraction } = await import(
  "../server/m5Doc/engine.ts"
);
const { buildCoherentHandoverFromState } = await import("../server/m5Doc/handoverGuard.ts");
const { computeFinalScore } = await import("../shared/m5Doc/scoringPure.ts");
const { deriveM5DocSessionEvidenceV2 } = await import("../shared/m5Doc/evidenceV2.ts");
const { M5_DOC_EVIDENCE_VERSION } = await import("../shared/m5Doc/types.ts");

const conn = await mysql.createConnection(URL);
const db = drizzle(URL);

// Pre-check
const [countsBefore] = await conn.query(
  "SELECT (SELECT COUNT(*) FROM users) u, (SELECT COUNT(*) FROM scenario_runs) r, (SELECT COUNT(*) FROM m5_doc_mission_states) d",
);
console.log("BEFORE", countsBefore[0]);

// FK
try {
  await conn.query(
    "ALTER TABLE m5_doc_mission_states ADD CONSTRAINT fk_m5_doc_mission_states_run FOREIGN KEY (runId) REFERENCES scenario_runs(id) ON DELETE CASCADE",
  );
  console.log("FK_ADDED");
} catch (e) {
  console.log("FK_STATUS", e.code || e.message);
}

// Synthetic QA user first (not a real student record)
await db
  .insert(users)
  .values({
    openId: "m5doc-qa-local-student",
    name: "M5 DOC QA Student",
    email: "m5doc-qa-local@example.invalid",
    loginMethod: "local",
    role: "user",
  })
  .onDuplicateKeyUpdate({ set: { name: "M5 DOC QA Student" } });

const [userRows] = await conn.query("SELECT id FROM users WHERE openId='m5doc-qa-local-student' LIMIT 1");
const userId = userRows[0].id;

// Seed module M5
await db
  .insert(modules)
  .values({
    code: "M5",
    titleFr: "M5 DOC QA",
    titleEn: "M5 DOC QA",
    isActive: true,
    order: 5,
    stepsJson: [],
  })
  .onDuplicateKeyUpdate({ set: { titleFr: "M5 DOC QA" } });

const [m5rows] = await conn.query("SELECT id FROM modules WHERE code='M5' LIMIT 1");
const m5Id = m5rows[0].id;

for (const def of M5_DOC_SCENARIO_DEFS) {
  await db
    .insert(scenarios)
    .values({
      moduleId: m5Id,
      name: def.name,
      descriptionFr: def.descriptionFr,
      descriptionEn: def.descriptionEn,
      difficulty: def.difficulty,
      isActive: true,
      initialStateJson: def.initialStateJson,
      createdBy: userId,
    })
    .onDuplicateKeyUpdate({
      set: {
        descriptionFr: def.descriptionFr,
        initialStateJson: def.initialStateJson,
        isActive: true,
      },
    });
}
const [scnRows] = await conn.query(
  "SELECT id, name, initialStateJson FROM scenarios WHERE name LIKE 'M5-DOC%' ORDER BY id",
);
console.log(
  "SCENARIOS",
  scnRows.map((s) => ({ id: s.id, name: s.name, model: s.initialStateJson?.interactionModel })),
);

const scn015 = scnRows.find((s) => s.name.includes("SCN-015-DOC"));
if (!scn015) throw new Error("SCN-015-DOC missing");

const [runIns] = await conn.query(
  "INSERT INTO scenario_runs (userId, scenarioId, status, isDemo) VALUES (?, ?, 'in_progress', 0)",
  [userId, scn015.id],
);
const runId = runIns.insertId;

let state = createInitialM5DocState(runId, "SCN-015-DOC");
await conn.query(
  "INSERT INTO m5_doc_mission_states (runId, version, stateJson) VALUES (?, ?, ?)",
  [runId, M5_DOC_EVIDENCE_VERSION, JSON.stringify(state)],
);

// Canonical path
for (const step of buildCanonicalProgressionPayloads()) {
  const mode = step.id.startsWith("INT-PRE") ? "FORMATIVE" : "OFFICIAL";
  const res = submitM5DocInteraction({
    state,
    interactionId: step.id,
    payload: step.payload,
    mode,
    actorRole: "student",
  });
  if (!res.ok || !res.correct) {
    throw new Error(`FAILED ${step.id}: ${JSON.stringify(res)}`);
  }
  state = res.state;
}
const post = submitM5DocInteraction({
  state,
  interactionId: "INT-POST-01",
  payload: buildCoherentHandoverFromState(state),
  mode: "OFFICIAL",
  actorRole: "student",
});
if (!post.ok || !post.correct) throw new Error(`POST failed ${JSON.stringify(post)}`);
state = post.state;

await conn.query("UPDATE m5_doc_mission_states SET stateJson=? WHERE runId=? AND version=?", [
  JSON.stringify(state),
  runId,
  M5_DOC_EVIDENCE_VERSION,
]);

// Reload persistence check
const [saved] = await conn.query(
  "SELECT stateJson FROM m5_doc_mission_states WHERE runId=? AND version=?",
  [runId, M5_DOC_EVIDENCE_VERSION],
);
const reloaded = saved[0].stateJson;
const score = computeFinalScore(reloaded);
const evidence = deriveM5DocSessionEvidenceV2(reloaded);

const [timelineCount] = await conn.query(
  "SELECT JSON_LENGTH(stateJson, '$.timeline') AS n FROM m5_doc_mission_states WHERE runId=?",
  [runId],
);

console.log(
  JSON.stringify(
    {
      ok: true,
      database: "m5_doc_qa_disposable",
      host: "127.0.0.1:3310",
      runId,
      userId,
      scenarioId: scn015.id,
      interactionModel: reloaded.interactionModel,
      evidenceVersion: evidence.evidenceVersion,
      finalScore: score.finalScore,
      handover: reloaded.handover.status,
      officialCount: Object.keys(reloaded.officialScores).length,
      timelineEvents: timelineCount[0].n,
      phase: reloaded.phase,
      emptyStudentData: false,
      syntheticQaUserOnly: true,
    },
    null,
    2,
  ),
);

await conn.end();
process.exit(score.finalScore === 100 && reloaded.handover.status === "Transmis" ? 0 : 4);
