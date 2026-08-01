import mysql from "mysql2/promise";

const url = process.env.M5DOC_DISPOSABLE_DATABASE_URL || "mysql://root@127.0.0.1:3310/m5_doc_qa_disposable";
if (!/@(127\.0\.0\.1|localhost)[:/]/i.test(url) || /railway|rlwy/i.test(url)) {
  throw new Error("REFUSED_NON_LOCAL");
}
const c = await mysql.createConnection(url);
const [users] = await c.query(
  "SELECT u.openId, u.email, u.role, COUNT(sr.id) AS runs FROM users u LEFT JOIN scenario_runs sr ON sr.userId = u.id GROUP BY u.id",
);
console.log(JSON.stringify({ host: "127.0.0.1:3310", database: "m5_doc_qa_disposable", users }, null, 2));
await c.end();
