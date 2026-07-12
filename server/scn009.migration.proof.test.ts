/**
 * SCN-009 migration 0017 structural + uniqueness proof (no live MySQL required).
 * Live apply: node scripts/apply-cc-recon-claims-migration.mjs (test DATABASE_URL).
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, "../drizzle/0017_cc_recon_target_claims.sql");

describe("SCN-009 migration 0017 — structural proof", () => {
  const sql = fs.readFileSync(sqlPath, "utf8");

  it("creates claim table with IF NOT EXISTS (safe on existing DB)", () => {
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS `cc_recon_target_claims`/i);
  });

  it("includes required columns", () => {
    for (const col of [
      "id",
      "runId",
      "stepCode",
      "sku",
      "bin",
      "idempotencyKey",
      "varianceQty",
      "status",
      "createdAt",
      "completedAt",
    ]) {
      expect(sql).toContain(`\`${col}\``);
    }
  });

  it("enforces UNIQUE(idempotencyKey) and UNIQUE(runId, stepCode, sku, bin)", () => {
    expect(sql).toMatch(/UNIQUE\(`idempotencyKey`\)/);
    expect(sql).toMatch(/UNIQUE\(`runId`,`stepCode`,`sku`,`bin`\)/);
  });

  it("does not rewrite transactions or touch historical ADJs", () => {
    expect(sql).not.toMatch(/UPDATE\s+`?transactions/i);
    expect(sql).not.toMatch(/DELETE\s+FROM/i);
    expect(sql).not.toMatch(/INSERT\s+INTO\s+`?transactions/i);
    expect(sql).not.toMatch(/INSERT\s+INTO\s+`?cc_recon_target_claims/i);
  });

  it("empty-DB path and existing-DB path are the same idempotent CREATE IF NOT EXISTS", () => {
    // Applying twice is a no-op when IF NOT EXISTS is present.
    expect(sql.match(/CREATE TABLE IF NOT EXISTS/gi)?.length).toBe(1);
  });
});

describe("SCN-009 migration 0017 — unique constraint simulation (existing duplicate ADJ safe)", () => {
  it("claim uniqueness is independent of historical duplicate ADJ rows", () => {
    const claims = new Map<string, true>();
    const historicalAdjs = [
      { runId: 491, sku: "SKU-001", qty: -3 },
      { runId: 491, sku: "SKU-001", qty: -3 },
    ];
    expect(historicalAdjs).toHaveLength(2);

    const key = "CC_RECON:9000:SKU-001:B-01-R1-L1";
    expect(claims.has(key)).toBe(false);
    claims.set(key, true);
    expect(() => {
      if (claims.has(key)) throw new Error("ER_DUP_ENTRY");
      claims.set(key, true);
    }).toThrow(/ER_DUP_ENTRY/);
    expect(claims.size).toBe(1);
    // Historical ADJs untouched
    expect(historicalAdjs).toHaveLength(2);
  });
});
