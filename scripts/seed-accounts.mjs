/**
 * Seed test accounts for TEC.LOG WMS Simulator
 * Run: node scripts/seed-accounts.mjs
 */
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set in .env");
  process.exit(1);
}

const conn = await mysql.createConnection(DATABASE_URL);

const accounts = [
  // Students
  { email: "alice.martin@teclog.ca",   name: "Alice Martin",       role: "student", password: "TecLog2025!" },
  { email: "bob.tremblay@teclog.ca",   name: "Bob Tremblay",       role: "student", password: "TecLog2025!" },
  { email: "chloe.chen@teclog.ca",     name: "Chloé Chen",         role: "student", password: "TecLog2025!" },
  { email: "david.benali@teclog.ca",   name: "David Benali",       role: "student", password: "TecLog2025!" },
  // Teacher
  { email: "prof@teclog.ca",           name: "Professeur Demo",    role: "teacher", password: "TeacherDemo2025!" },
  // Admin
  { email: "admin@teclog.ca",          name: "Admin TEC.LOG",      role: "admin",   password: "Admin2025!" },
];

console.log("🌱 Seeding test accounts...\n");

for (const acc of accounts) {
  const openId = `local:${acc.email}`;
  const hash = await bcrypt.hash(acc.password, 10);
  try {
    const [existing] = await conn.execute("SELECT id FROM users WHERE email = ?", [acc.email]);
    if (existing.length > 0) {
      await conn.execute(
        "UPDATE users SET passwordHash=?, role=?, loginMethod='local', isActive=1 WHERE email=?",
        [hash, acc.role, acc.email]
      );
      console.log(`✓ Updated  [${acc.role.padEnd(7)}] ${acc.email}`);
    } else {
      await conn.execute(
        "INSERT INTO users (openId, email, name, role, passwordHash, loginMethod, isActive, lastSignedIn) VALUES (?,?,?,?,?,'local',1,NOW())",
        [openId, acc.email, acc.name, acc.role, hash]
      );
      console.log(`✓ Created  [${acc.role.padEnd(7)}] ${acc.email}`);
    }
  } catch (err) {
    console.error(`✗ Error    ${acc.email}: ${err.message}`);
  }
}

console.log("\n═══════════════════════════════════════════════════");
console.log("  TEST ACCOUNTS — TEC.LOG WMS Simulator");
console.log("═══════════════════════════════════════════════════");
console.log("  STUDENTS (password: TecLog2025!)");
console.log("    alice.martin@teclog.ca");
console.log("    bob.tremblay@teclog.ca");
console.log("    chloe.chen@teclog.ca");
console.log("    david.benali@teclog.ca");
console.log("  TEACHER  (password: TeacherDemo2025!)");
console.log("    prof@teclog.ca");
console.log("  ADMIN    (password: Admin2025!)");
console.log("    admin@teclog.ca");
console.log("═══════════════════════════════════════════════════\n");

await conn.end();
