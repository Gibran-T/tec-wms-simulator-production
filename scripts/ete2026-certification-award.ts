/**
 * Été 2026 — institutional Silver + Gold access for Cohortes A and B.
 * Approval: professor override (completion gates ignored).
 *
 * Does NOT touch Fondatrice (001–004), scenario_runs, or scoring_events.
 *
 * Usage:
 *   npx tsx scripts/ete2026-certification-award.ts
 *   npx tsx scripts/ete2026-certification-award.ts --apply --confirm-ete2026-certificates
 */
import { spawnSync } from "node:child_process";
import mysql from "mysql2/promise";

const APPLY = process.argv.includes("--apply");
const CONFIRMED = process.argv.includes("--confirm-ete2026-certificates");

const DEMO_EMAILS = new Set([
  "james.timothy@example.com",
  "prof@teclog.ca",
  "admin@teclog.ca",
]);

const CREDENTIAL_BY_STUDENT_NUMBER: Record<
  string,
  { name: string; cohort: "A" | "B"; sil: string; gold: string }
> = {
  "TECWMS-2026-A-002": { name: "Marc Arthur Dessin", cohort: "A", sil: "TECWMS-SIL-2026-005", gold: "TECWMS-GOLD-2026-005" },
  "TECWMS-2026-A-003": { name: "Toumany Diakité", cohort: "A", sil: "TECWMS-SIL-2026-006", gold: "TECWMS-GOLD-2026-006" },
  "TECWMS-2026-A-004": { name: "Saïd Mohamed Traoré", cohort: "A", sil: "TECWMS-SIL-2026-007", gold: "TECWMS-GOLD-2026-007" },
  "TECWMS-2026-B-001": { name: "Gnouma Camara", cohort: "B", sil: "TECWMS-SIL-2026-008", gold: "TECWMS-GOLD-2026-008" },
  "TECWMS-2026-B-002": { name: "Willy Martial Kouganou Siani", cohort: "B", sil: "TECWMS-SIL-2026-009", gold: "TECWMS-GOLD-2026-009" },
  "TECWMS-2026-B-003": { name: "Yawo Valentin Sodokin", cohort: "B", sil: "TECWMS-SIL-2026-010", gold: "TECWMS-GOLD-2026-010" },
  "TECWMS-2026-B-004": { name: "Ghislain Djitouo Pepouo", cohort: "B", sil: "TECWMS-SIL-2026-011", gold: "TECWMS-GOLD-2026-011" },
};

function loadPublicMysqlUrl(): string {
  for (const key of ["MYSQL_PUBLIC_URL", "MYSQL_URL"]) {
    const value = process.env[key];
    if (value && !value.includes("railway.internal")) return value;
  }
  const r = spawnSync("railway", ["variable", "list", "--service", "MySQL", "--json"], {
    encoding: "utf8",
    shell: true,
  });
  if (r.status !== 0) {
    throw new Error("railway variable list failed — login/link required");
  }
  const data = JSON.parse(r.stdout);
  const bag = data?.variables ?? data;
  const url = bag.MYSQL_PUBLIC_URL;
  if (!url || String(url).includes("railway.internal")) {
    throw new Error("MYSQL_PUBLIC_URL missing on Railway MySQL service");
  }
  return String(url);
}

function bool(v: unknown): boolean {
  return v === true || v === 1 || v === "1";
}

function isDemo(name: string, email: string): boolean {
  const n = name.toLowerCase();
  const e = email.toLowerCase();
  if (DEMO_EMAILS.has(e)) return true;
  if (n.includes("james timothy")) return true;
  if (e.endsWith("@teclog.ca")) return true;
  return false;
}

async function main() {
  const conn = await mysql.createConnection(loadPublicMysqlUrl());
  try {
    const [rows] = await conn.query<mysql.RowDataPacket[]>(
      `SELECT p.userId, p.studentNumber, p.silverCertified, p.goldCertified, p.cohortId,
              u.email, u.name, u.role, u.isActive
       FROM profiles p
       JOIN users u ON u.id = p.userId
       WHERE p.cohortId IN (2, 3)
       ORDER BY p.cohortId, p.studentNumber, u.name`,
    );

    console.log(APPLY ? (CONFIRMED ? "MODE apply" : "MODE apply-blocked") : "MODE audit");
    console.log(`cohort A/B profiles found: ${rows.length}`);

    let updates = 0;
    for (const row of rows) {
      const email = String(row.email || "").toLowerCase();
      const name = String(row.name || "");
      const studentNumber = String(row.studentNumber || "");
      const cred = CREDENTIAL_BY_STUDENT_NUMBER[studentNumber] ?? null;
      const demo = isDemo(name, email);
      const silver = bool(row.silverCertified);
      const gold = bool(row.goldCertified);
      const cohort = row.cohortId === 2 ? "A" : row.cohortId === 3 ? "B" : String(row.cohortId);
      let action = "SKIP";
      if (demo) action = "SKIP_DEMO";
      else if (!cred) action = "NO_CREDENTIAL_ASSETS";
      else if (silver && gold) action = "SKIP_ALREADY";
      else action = "AWARD";

      console.log(
        `${action} C${cohort} ${name} ${studentNumber} sil=${silver} gold=${gold} cred=${cred ? cred.sil : "none"}`,
      );

      if (action === "AWARD" && APPLY && CONFIRMED) {
        await conn.query(
          `UPDATE profiles SET silverCertified = 1, goldCertified = 1 WHERE userId = ?`,
          [row.userId],
        );
        updates += 1;
      } else if (action === "AWARD") {
        updates += 1;
      }
    }

    if (APPLY && !CONFIRMED) {
      throw new Error("Refusing apply without --confirm-ete2026-certificates");
    }
    console.log(APPLY && CONFIRMED ? `Updated ${updates} profiles` : `Would update ${updates} profiles`);
  } finally {
    await conn.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
