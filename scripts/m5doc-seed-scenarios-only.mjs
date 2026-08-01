/**
 * Idempotent DOC-only scenario seed.
 * Touches ONLY SCN-015/016/017-DOC rows — never users, cohorts, or legacy scenarios.
 */
import mysql from "mysql2/promise";
import { M5_DOC_SCENARIO_DEFS } from "../server/m5Doc/docScenarioDefs.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL required");
  process.exit(2);
}
if (/railway|rlwy/i.test(url) && process.env.M5DOC_ALLOW_REMOTE_SEED !== "true") {
  console.error("REFUSED: set M5DOC_ALLOW_REMOTE_SEED=true to seed DOC on Railway");
  process.exit(3);
}

const conn = await mysql.createConnection(url);
const [mods] = await conn.query("SELECT id FROM modules WHERE code='M5' LIMIT 1");
if (!mods.length) {
  console.error("M5 module missing");
  process.exit(4);
}
const moduleId = mods[0].id;
const report = { moduleId, upserted: [], duplicatesCheck: [] };

for (const def of M5_DOC_SCENARIO_DEFS) {
  const name = def.name;
  const [existing] = await conn.query(
    "SELECT id, name FROM scenarios WHERE moduleId=? AND name=?",
    [moduleId, name],
  );
  if (existing.length) {
    await conn.query(
      "UPDATE scenarios SET descriptionFr=?, descriptionEn=?, difficulty=?, initialStateJson=?, isActive=1 WHERE id=?",
      [
        def.descriptionFr,
        def.descriptionEn,
        def.difficulty,
        JSON.stringify(def.initialStateJson),
        existing[0].id,
      ],
    );
    report.upserted.push({ id: existing[0].id, name, action: "update" });
  } else {
    const [ins] = await conn.query(
      "INSERT INTO scenarios (moduleId, name, descriptionFr, descriptionEn, difficulty, initialStateJson, createdBy, isActive) VALUES (?,?,?,?,?,?,1,1)",
      [
        moduleId,
        name,
        def.descriptionFr,
        def.descriptionEn,
        def.difficulty,
        JSON.stringify(def.initialStateJson),
      ],
    );
    report.upserted.push({ id: ins.insertId, name, action: "insert" });
  }
}

const [counts] = await conn.query(
  "SELECT name, COUNT(*) c FROM scenarios WHERE moduleId=? AND name LIKE '%DOC%' GROUP BY name",
  [moduleId],
);
report.duplicatesCheck = counts;
const hasDup = counts.some((r) => Number(r.c) > 1);
console.log(JSON.stringify({ ok: !hasDup, ...report }, null, 2));
await conn.end();
process.exit(hasDup ? 5 : 0);
