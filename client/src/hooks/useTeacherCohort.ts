import { skipToken } from "@tanstack/react-query";
import { useCohort } from "@/contexts/CohortContext";

/** tRPC query input scoped to the teacher's selected cohort. */
export function useTeacherCohortInput() {
  const { selectedCohortId, isReady, isTeacher } = useCohort();
  if (!isTeacher || !isReady || selectedCohortId == null) return skipToken;
  return { cohortId: selectedCohortId };
}
