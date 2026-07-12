/**
 * Exercise production claimAndPersistCcReconTarget against disposable MariaDB.
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL required");
  process.exit(1);
}

const admin = await mysql.createConnection(DATABASE_URL.replace(/\/[^/]*$/, "/mysql"));
await admin.query("DROP DATABASE IF EXISTS scn009_module");
await admin.query("CREATE DATABASE scn009_module");
await admin.end();

const moduleUrl = DATABASE_URL.replace(/\/[^/]*$/, "/scn009_module");
process.env.DATABASE_URL = moduleUrl;

const conn = await mysql.createConnection(moduleUrl);
await conn.query(`
  CREATE TABLE IF NOT EXISTS transactions (
    id int AUTO_INCREMENT PRIMARY KEY,
    runId int NOT NULL,
    docType enum('PO','GR','SO','GI','ADJ','PUTAWAY','PUTAWAY_M1','PICKING','PICKING_M1') NOT NULL,
    moveType varchar(16) NULL,
    sku varchar(64) NOT NULL,
    bin varchar(64) NOT NULL,
    qty decimal(10,2) NOT NULL,
    posted boolean NOT NULL DEFAULT false,
    docRef varchar(64) NULL,
    comment text NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);
await conn.query(`
  CREATE TABLE IF NOT EXISTS inventory_adjustments (
    id int AUTO_INCREMENT PRIMARY KEY,
    runId int NOT NULL,
    sku varchar(64) NOT NULL,
    varianceQty decimal(10,2) NOT NULL,
    adjustmentQty decimal(10,2) NOT NULL,
    reason text NULL,
    approved boolean NOT NULL DEFAULT false,
    approvedBy int NULL,
    approvedAt timestamp NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = fs.readFileSync(path.join(__dirname, "../drizzle/0017_cc_recon_target_claims.sql"), "utf8");
await conn.query(sql);
await conn.query(
  `INSERT INTO transactions (runId, docType, moveType, sku, bin, qty, posted, docRef)
   VALUES (9100, 'GR', '101', 'SKU-001', 'B-01-R1-L1', 100, 1, 'GR')`,
);
await conn.end();

// Clear cached db singleton by dynamic import after env set
const { claimAndPersistCcReconTarget } = await import("../server/ccReconAtomic.ts");

const input = {
  runId: 9100,
  sku: "SKU-001",
  bin: "B-01-R1-L1",
  varianceQty: -3,
  justification: "module proof",
};

const results = await Promise.all([
  claimAndPersistCcReconTarget(input),
  claimAndPersistCcReconTarget(input),
  claimAndPersistCcReconTarget(input),
]);

const verify = await mysql.createConnection(moduleUrl);
const [claims] = await verify.query(`SELECT * FROM cc_recon_target_claims WHERE runId = 9100`);
const [adjs] = await verify.query(`SELECT * FROM inventory_adjustments WHERE runId = 9100`);
const [txs] = await verify.query(`SELECT * FROM transactions WHERE runId = 9100 AND docType = 'ADJ'`);
await verify.end();

console.log({
  results,
  claims: claims.length,
  adjs: adjs.length,
  adjTx: txs.length,
  created: results.filter((r) => r.created).length,
  idempotent: results.filter((r) => r.alreadyReconciled).length,
});

if (results.filter((r) => r.created).length !== 1) throw new Error("expected 1 created");
if (claims.length !== 1 || adjs.length !== 1 || txs.length !== 1) throw new Error("unexpected row counts");
console.log("PRODUCTION MODULE claimAndPersistCcReconTarget REAL DB PROOF PASS");
process.exit(0);
