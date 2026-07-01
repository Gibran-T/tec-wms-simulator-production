import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getCohortById, getStudentUserIdsInCohort } from "./db";

export const cohortFilterInput = z.object({
  cohortId: z.number().optional(),
});

export type CohortScope = {
  cohortId?: number;
  studentUserIds?: number[];
};

/**
 * Resolves cohort scope for teacher dashboards.
 * - Teachers must pass cohortId (isolated view).
 * - Admins may omit cohortId for a global view.
 */
export async function resolveCohortScope(
  teacherId: number,
  cohortId: number | undefined,
  isAdmin = false,
): Promise<CohortScope> {
  if (cohortId == null) {
    if (isAdmin) return {};
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Sélectionnez une cohorte pour afficher les données",
    });
  }
  const cohort = await getCohortById(cohortId);
  if (!cohort) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Cohorte introuvable" });
  }
  if (!isAdmin && cohort.createdBy !== teacherId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Accès non autorisé à cette cohorte" });
  }
  const studentUserIds = await getStudentUserIdsInCohort(cohortId);
  return { cohortId, studentUserIds };
}

/** Validates that a cohort belongs to the teacher (admin bypass). */
export async function assertTeacherOwnsCohort(
  teacherId: number,
  cohortId: number,
  isAdmin = false,
): Promise<void> {
  await resolveCohortScope(teacherId, cohortId, isAdmin);
}
