import mysql from "mysql2/promise";
const runId = Number(process.env.M5DOC_RUN_ID || 781);
const url = process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL;
const c = await mysql.createConnection(url);
const [before] = await c.query("SELECT id, status, completedAt FROM scenario_runs WHERE id=?", [runId]);
await c.query(
  "UPDATE scenario_runs SET status='completed', completedAt=COALESCE(completedAt, NOW()) WHERE id=? AND status<>'completed'",
  [runId],
);
const [after] = await c.query("SELECT id, userId, status, completedAt, scenarioId FROM scenario_runs WHERE id=?", [
  runId,
]);
console.log(JSON.stringify({ before, after }, null, 2));
await c.end();
