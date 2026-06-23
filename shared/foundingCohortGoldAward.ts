/**
 * Cohorte Fondatrice 2026 — governed institutional Gold award (allowlist + audit source).
 * Used by server/goldCertification.ts and scripts/cohorte-fondatrice-gold-award.ts only.
 */

export const FONDATRICE_2026_GOLD_AWARD = "FONDATRICE_2026_GOLD_AWARD";

export const FONDATRICE_GOLD_INSTITUTIONAL_NOTE =
  "Certification Gold accordée par validation institutionnelle exceptionnelle — Cohorte Fondatrice 2026.";

export const FONDATRICE_GOLD_COHORT_STUDENTS = [
  { userId: 184, name: "Aissata Soukeina Camara", email: "aissatasoukeinacamara@gmail.com" },
  { userId: 213, name: "Darlin Campaz Paredes", email: "dcparedes2010@gmail.com" },
  { userId: 216, name: "Fredy Tamile Lola", email: "fredlolabio@gmail.com" },
  { userId: 219, name: "Prince Agbodjan Sewa Francis Ghislain", email: "sewafrancispa@gmail.com" },
] as const;

export const FONDATRICE_GOLD_USER_IDS = FONDATRICE_GOLD_COHORT_STUDENTS.map((s) => s.userId);

export function isFoundingCohortInstitutionalGoldAward(
  goldAwardSource: string | null | undefined,
): boolean {
  return goldAwardSource === FONDATRICE_2026_GOLD_AWARD;
}

export function isFoundingCohortGoldUserId(userId: number): boolean {
  return (FONDATRICE_GOLD_USER_IDS as readonly number[]).includes(userId);
}
