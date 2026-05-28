/**
 * Script to create test accounts for TEC.LOG WMS Simulator
 * Run: node scripts/create-test-accounts.mjs
 */
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const conn = await mysql.createConnection(DATABASE_URL);

const accounts = [
  // Test students
  { email: "magaly.student@teclog.ca", name: "Magaly Tremblay", role: "student", password: "TecLog2025!" },
  { email: "jean.dupont@teclog.ca", name: "Jean Dupont", role: "student", password: "TecLog2025!" },
  { email: "marie.chen@teclog.ca", name: "Marie Chen", role: "student", password: "TecLog2025!" },
  { email: "ahmed.benali@teclog.ca", name: "Ahmed Benali", role: "student", password: "TecLog2025!" },
  // Test teacher
  { email: "prof.demo@teclog.ca", name: "Professeur Demo", role: "teacher", password: "TeacherDemo2025!" },
  // Admin
  { email: "admin@teclog.ca", name: "Admin TEC.LOG", role: "admin", password: "Admin2025!" },
];

console.log("Creating test accounts...\n");

for (const account of accounts) {
  const openId = `local:${account.email}`;
  const passwordHash = await bcrypt.hash(account.password, 10);

  try {
    // Check if exists
    const [existing] = await conn.execute("SELECT id FROM users WHERE email = ?", [account.email]);
    if (existing.length > 0) {
      // Update password hash and role
      await conn.execute(
        "UPDATE users SET passwordHash = ?, role = ?, loginMethod = 'local' WHERE email = ?",
        [passwordHash, account.role, account.email]
      );
      console.log(`✓ Updated: ${account.email} (${account.role})`);
    } else {
      await conn.execute(
        "INSERT INTO users (openId, email, name, role, passwordHash, loginMethod, lastSignedIn) VALUES (?, ?, ?, ?, ?, 'local', NOW())",
        [openId, account.email, account.name, account.role, passwordHash]
      );
      console.log(`✓ Created: ${account.email} (${account.role})`);
    }
  } catch (err) {
    console.error(`✗ Error for ${account.email}:`, err.message);
  }
}

console.log("\n=== Test Accounts Summary ===");
console.log("Students:");
console.log("  magaly.student@teclog.ca / TecLog2025!");
console.log("  jean.dupont@teclog.ca / TecLog2025!");
console.log("  marie.chen@teclog.ca / TecLog2025!");
console.log("  ahmed.benali@teclog.ca / TecLog2025!");
console.log("Teacher:");
console.log("  prof.demo@teclog.ca / TeacherDemo2025!");
console.log("Admin:");
console.log("  admin@teclog.ca / Admin2025!");

await conn.end();
console.log("\nDone!");
