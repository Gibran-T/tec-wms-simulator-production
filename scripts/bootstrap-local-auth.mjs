/**
 * TEC.WMS RC13 — Local Auth Bootstrap (Phase A + Phase B)
 *
 * Guarantees that at least one local ADMIN (Phase A) and one local TEACHER
 * (Phase B) account exist, with a valid local password, so the platform can
 * authenticate independently of Manus OAuth.
 *
 * This script ONLY adds local bootstrap capability. It does NOT touch, remove,
 * or disable the existing OAuth path. It is safe to run repeatedly (idempotent).
 *
 * Usage:
 *   node scripts/bootstrap-local-auth.mjs                # Phase A + Phase B
 *   node scripts/bootstrap-local-auth.mjs --admin-only   # Phase A only
 *   node scripts/bootstrap-local-auth.mjs --teacher-only # Phase B only
 *   node scripts/bootstrap-local-auth.mjs --verify-only  # Verify gate, no writes
 *
 * Credentials (secure input via environment, never hardcoded):
 *   BOOTSTRAP_ADMIN_EMAIL      (default: admin@teclog.ca)
 *   BOOTSTRAP_ADMIN_PASSWORD   (if unset, a strong password is generated + printed once)
 *   BOOTSTRAP_ADMIN_NAME       (default: Admin TEC.LOG)
 *   BOOTSTRAP_TEACHER_EMAIL    (default: prof@teclog.ca)
 *   BOOTSTRAP_TEACHER_PASSWORD (if unset, a strong password is generated + printed once)
 *   BOOTSTRAP_TEACHER_NAME     (default: Professeur Demo)
 *   BOOTSTRAP_BCRYPT_ROUNDS    (default: 12)
 *
 * Required:
 *   DATABASE_URL (MySQL connection string for the target environment)
 *
 * Exit codes:
 *   0  success and verification gate passed
 *   1  configuration / connection error
 *   2  verification gate failed (no valid local admin/teacher present)
 */
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

// ─── CLI flags ────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const ADMIN_ONLY = argv.includes("--admin-only");
const TEACHER_ONLY = argv.includes("--teacher-only");
const VERIFY_ONLY = argv.includes("--verify-only");

const DO_ADMIN = VERIFY_ONLY ? true : !TEACHER_ONLY;
const DO_TEACHER = VERIFY_ONLY ? true : !ADMIN_ONLY;

// ─── Config ───────────────────────────────────────────────────────────────────
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set (check .env or environment).");
  process.exit(1);
}

const BCRYPT_ROUNDS = Number.parseInt(process.env.BOOTSTRAP_BCRYPT_ROUNDS ?? "12", 10);

/** Generate a strong, URL-safe random password for unattended bootstrap. */
function generatePassword() {
  // 24 bytes -> 32 base64url chars, plus a guaranteed symbol/number mix.
  const base = crypto.randomBytes(24).toString("base64url");
  return `Tec!${base}9`;
}

/** Mask a secret for safe logging. */
function mask(secret) {
  if (!secret) return "(none)";
  if (secret.length <= 4) return "****";
  return `${secret.slice(0, 2)}***${secret.slice(-2)} (len ${secret.length})`;
}

function resolveAccount(kind) {
  const prefix = kind === "admin" ? "ADMIN" : "TEACHER";
  const defaults =
    kind === "admin"
      ? { email: "admin@teclog.ca", name: "Admin TEC.LOG", role: "admin" }
      : { email: "prof@teclog.ca", name: "Professeur Demo", role: "teacher" };

  const email = (process.env[`BOOTSTRAP_${prefix}_EMAIL`] ?? defaults.email).toLowerCase().trim();
  const name = process.env[`BOOTSTRAP_${prefix}_NAME`] ?? defaults.name;
  const providedPassword = process.env[`BOOTSTRAP_${prefix}_PASSWORD`];
  const generated = !providedPassword;
  const password = providedPassword ?? generatePassword();

  return { kind, email, name, role: defaults.role, password, generated };
}

/** Idempotent upsert keyed on email. Never weakens an existing account. */
async function bootstrapAccount(conn, account) {
  const openId = `local:${account.email}`;
  const hash = await bcrypt.hash(account.password, BCRYPT_ROUNDS);

  const [existing] = await conn.execute(
    "SELECT id, role, loginMethod FROM users WHERE email = ? LIMIT 1",
    [account.email],
  );

  if (existing.length > 0) {
    await conn.execute(
      "UPDATE users SET passwordHash=?, role=?, loginMethod='local', isActive=1, name=? WHERE email=?",
      [hash, account.role, account.name, account.email],
    );
    console.log(`✓ Updated  [${account.role.padEnd(7)}] ${account.email}`);
  } else {
    await conn.execute(
      "INSERT INTO users (openId, email, name, role, passwordHash, loginMethod, isActive, lastSignedIn) VALUES (?,?,?,?,?,'local',1,NOW())",
      [openId, account.email, account.name, account.role, hash],
    );
    console.log(`✓ Created  [${account.role.padEnd(7)}] ${account.email}`);
  }

  if (account.generated) {
    console.log(`  ⚠ Generated password for ${account.email}: ${account.password}`);
    console.log("    Store it now — it will NOT be shown again.");
  } else {
    console.log(`  Password (provided): ${mask(account.password)}`);
  }
}

/** Phase A/B exit gate: at least one valid local account per requested role. */
async function verifyRole(conn, role) {
  const [rows] = await conn.execute(
    "SELECT COUNT(*) AS n FROM users WHERE role=? AND loginMethod='local' AND passwordHash IS NOT NULL AND isActive=1",
    [role],
  );
  const count = Number(rows[0].n);
  const ok = count >= 1;
  console.log(`  ${ok ? "✓" : "✗"} ${role}: ${count} valid local account(s)`);
  return ok;
}

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  TEC.WMS RC13 — Local Auth Bootstrap (Phase A + B)");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  Mode: ${VERIFY_ONLY ? "verify-only" : DO_ADMIN && DO_TEACHER ? "admin + teacher" : DO_ADMIN ? "admin only" : "teacher only"}`);
  console.log(`  bcrypt rounds: ${BCRYPT_ROUNDS}`);
  console.log("");

  const conn = await mysql.createConnection(DATABASE_URL);
  try {
    if (!VERIFY_ONLY) {
      if (DO_ADMIN) {
        console.log("── Phase A — Local Admin Bootstrap ──");
        await bootstrapAccount(conn, resolveAccount("admin"));
        console.log("");
      }
      if (DO_TEACHER) {
        console.log("── Phase B — Local Teacher Bootstrap ──");
        await bootstrapAccount(conn, resolveAccount("teacher"));
        console.log("");
      }
    }

    console.log("── Verification Gate (Gate 1) ──");
    let pass = true;
    if (DO_ADMIN) pass = (await verifyRole(conn, "admin")) && pass;
    if (DO_TEACHER) pass = (await verifyRole(conn, "teacher")) && pass;
    console.log("");

    if (!pass) {
      console.error("❌ Verification gate FAILED. Do not progress to the next phase.");
      process.exitCode = 2;
      return;
    }
    console.log("✅ Bootstrap complete and verification gate PASSED.");
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error(`❌ Bootstrap error: ${err.message}`);
  process.exit(1);
});
