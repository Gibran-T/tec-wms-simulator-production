import mysql from "mysql2/promise";
const url = process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL;
const c = await mysql.createConnection(url);
const [doc] = await c.query(
  "SELECT runId, version, CHAR_LENGTH(CAST(stateJson AS CHAR)) AS bytes FROM m5_doc_mission_states ORDER BY id",
);
const [james] = await c.query(
  "SELECT id, email, role FROM users WHERE id=222 OR email='jamesnns3@gmail.com'",
);
const [runs] = await c.query(
  "SELECT id, userId, status, scenarioId FROM scenario_runs WHERE id IN (776,781)",
);
const [scn] = await c.query(
  "SELECT id, name FROM scenarios WHERE name LIKE '%DOC%' AND moduleId=5",
);
console.log(JSON.stringify({ doc, james, runs, scn, docCount: doc.length }, null, 2));
await c.end();
