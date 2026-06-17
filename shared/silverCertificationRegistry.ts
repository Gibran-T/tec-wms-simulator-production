/** RC13 first cohort — static Silver credential registry (no DB schema). */
export type SilverRegistryEntry = {
  certificateId: string;
  displayName: string;
  studentNumber: string;
  cohortYear: number;
};

/** First institutional Silver cohort — Collège de la Concorde · Session 2025–2026. */
export const SILVER_REGISTRY_COHORT_2026: readonly SilverRegistryEntry[] = [
  {
    certificateId: "TEC-SIL-2026-001",
    displayName: "Aissata Soukeina Camara",
    studentNumber: "2026-1806",
    cohortYear: 2026,
  },
  {
    certificateId: "TEC-SIL-2026-002",
    displayName: "Darlin Campaz Paredes",
    studentNumber: "00-2004",
    cohortYear: 2026,
  },
  {
    certificateId: "TEC-SIL-2026-003",
    displayName: "Fredy Tamile Lola",
    studentNumber: "1011-KF",
    cohortYear: 2026,
  },
  {
    certificateId: "TEC-SIL-2026-004",
    displayName: "Prince Agbodjan Sewa Francis Ghislain",
    studentNumber: "613-462",
    cohortYear: 2026,
  },
] as const;

function normalizeStudentNumber(value: string): string {
  return value.trim();
}

export function lookupSilverRegistryByStudentNumber(
  studentNumber: string | null | undefined,
): SilverRegistryEntry | null {
  if (!studentNumber) return null;
  const normalized = normalizeStudentNumber(studentNumber);
  return SILVER_REGISTRY_COHORT_2026.find((entry) => entry.studentNumber === normalized) ?? null;
}

export function lookupSilverRegistryByCertificateId(
  certificateId: string,
): SilverRegistryEntry | null {
  return SILVER_REGISTRY_COHORT_2026.find((entry) => entry.certificateId === certificateId) ?? null;
}
