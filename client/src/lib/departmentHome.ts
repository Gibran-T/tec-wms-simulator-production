import { isEnterpriseExperienceEnabled } from "./enterpriseExperience";

/** RC21-B.3 — Department-first navigation (Department Home + Queue). Default OFF. */
export function isDepartmentHomeEnabled(): boolean {
  return (
    isEnterpriseExperienceEnabled() &&
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT === "true" &&
    import.meta.env.VITE_ENABLE_DEPARTMENT_HOME === "true"
  );
}

/** Student entry path when department home is active */
export function getDepartmentEntryPath(): string {
  return isDepartmentHomeEnabled() ? "/student/department" : "/student/connect";
}
