/** RC15 inaugural Gold cohort — static Gold credential registry (no DB schema). */
export type CertificationStatus = "ACTIVE" | "REVOKED" | "EXPIRED";

export type GoldRegistryEntry = {
  certificateId: string;
  displayName: string;
  studentNumber: string;
  cohortYear: number;
  status: CertificationStatus;
  program: string;
  certificationLevel: "GOLD";
  issueDate: string;
  issuedBy: string;
};

/** Inaugural Gold cohort — Collège de la Concorde · Session 2025–2026 · M1–M5 integrated pathway. */
export const GOLD_REGISTRY_COHORT_2026: readonly GoldRegistryEntry[] = [
  {
    certificateId: "TECWMS-GOLD-2026-001",
    displayName: "Darlin Campaz Paredes",
    studentNumber: "002004",
    cohortYear: 2026,
    status: "ACTIVE",
    program: "TEC.WMS",
    certificationLevel: "GOLD",
    issueDate: "2026-06-18",
    issuedBy: "Collège de la Concorde",
  },
  {
    certificateId: "TECWMS-GOLD-2026-002",
    displayName: "Fredy Tamile Lola",
    studentNumber: "1011-KF",
    cohortYear: 2026,
    status: "ACTIVE",
    program: "TEC.WMS",
    certificationLevel: "GOLD",
    issueDate: "2026-06-18",
    issuedBy: "Collège de la Concorde",
  },
  {
    certificateId: "TECWMS-GOLD-2026-003",
    displayName: "Prince Agbodjan Sewa Francis Ghislain",
    studentNumber: "613-462",
    cohortYear: 2026,
    status: "ACTIVE",
    program: "TEC.WMS",
    certificationLevel: "GOLD",
    issueDate: "2026-06-18",
    issuedBy: "Collège de la Concorde",
  },
  {
    certificateId: "TECWMS-GOLD-2026-004",
    displayName: "Aissata Soukeina Camara",
    studentNumber: "2026-1806",
    cohortYear: 2026,
    status: "ACTIVE",
    program: "TEC.WMS",
    certificationLevel: "GOLD",
    issueDate: "2026-06-18",
    issuedBy: "Collège de la Concorde",
  },
  {
    certificateId: "TECWMS-GOLD-2026-005",
    displayName: "Marc Arthur Dessin",
    studentNumber: "TECWMS-2026-A-002",
    cohortYear: 2026,
    status: "ACTIVE",
    program: "TEC.WMS",
    certificationLevel: "GOLD",
    issueDate: "2026-08-07",
    issuedBy: "Collège de la Concorde",
  },
  {
    certificateId: "TECWMS-GOLD-2026-006",
    displayName: "Toumany Diakité",
    studentNumber: "TECWMS-2026-A-003",
    cohortYear: 2026,
    status: "ACTIVE",
    program: "TEC.WMS",
    certificationLevel: "GOLD",
    issueDate: "2026-08-07",
    issuedBy: "Collège de la Concorde",
  },
  {
    certificateId: "TECWMS-GOLD-2026-007",
    displayName: "Saïd Mohamed Traoré",
    studentNumber: "TECWMS-2026-A-004",
    cohortYear: 2026,
    status: "ACTIVE",
    program: "TEC.WMS",
    certificationLevel: "GOLD",
    issueDate: "2026-08-07",
    issuedBy: "Collège de la Concorde",
  },
  {
    certificateId: "TECWMS-GOLD-2026-008",
    displayName: "Gnouma Camara",
    studentNumber: "TECWMS-2026-B-001",
    cohortYear: 2026,
    status: "ACTIVE",
    program: "TEC.WMS",
    certificationLevel: "GOLD",
    issueDate: "2026-08-07",
    issuedBy: "Collège de la Concorde",
  },
  {
    certificateId: "TECWMS-GOLD-2026-009",
    displayName: "Willy Martial Kouganou Siani",
    studentNumber: "TECWMS-2026-B-002",
    cohortYear: 2026,
    status: "ACTIVE",
    program: "TEC.WMS",
    certificationLevel: "GOLD",
    issueDate: "2026-08-07",
    issuedBy: "Collège de la Concorde",
  },
  {
    certificateId: "TECWMS-GOLD-2026-010",
    displayName: "Yawo Valentin Sodokin",
    studentNumber: "TECWMS-2026-B-003",
    cohortYear: 2026,
    status: "ACTIVE",
    program: "TEC.WMS",
    certificationLevel: "GOLD",
    issueDate: "2026-08-07",
    issuedBy: "Collège de la Concorde",
  },
  {
    certificateId: "TECWMS-GOLD-2026-011",
    displayName: "Ghislain Djitouo Pepouo",
    studentNumber: "TECWMS-2026-B-004",
    cohortYear: 2026,
    status: "ACTIVE",
    program: "TEC.WMS",
    certificationLevel: "GOLD",
    issueDate: "2026-08-07",
    issuedBy: "Collège de la Concorde",
  },
] as const;

function normalizeStudentNumber(value: string): string {
  return value.trim();
}

function studentNumbersMatch(stored: string, query: string): boolean {
  const a = normalizeStudentNumber(stored);
  const b = normalizeStudentNumber(query);
  if (a === b) return true;
  return a.replace(/-/g, "") === b.replace(/-/g, "");
}

export function lookupGoldRegistryByStudentNumber(
  studentNumber: string | null | undefined,
): GoldRegistryEntry | null {
  if (!studentNumber) return null;
  return (
    GOLD_REGISTRY_COHORT_2026.find((entry) => studentNumbersMatch(entry.studentNumber, studentNumber)) ??
    null
  );
}

function normalizeCertificateId(value: string): string {
  return value.trim().toUpperCase();
}

export function lookupGoldRegistryByCertificateId(
  certificateId: string,
): GoldRegistryEntry | null {
  const normalized = normalizeCertificateId(certificateId);
  return GOLD_REGISTRY_COHORT_2026.find((entry) => entry.certificateId === normalized) ?? null;
}
