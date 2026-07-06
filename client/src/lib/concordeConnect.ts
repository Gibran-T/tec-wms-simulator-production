import { isEnterpriseExperienceEnabled } from "./enterpriseExperience";

/** RC20-A — Concorde Connect feature gate (Employee Profile + entry portal) */
export function isConcordeConnectEnabled(): boolean {
  return (
    isEnterpriseExperienceEnabled() &&
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT === "true"
  );
}

/** Post-login student home when Concorde Connect is active */
export function getStudentEntryPath(): string {
  return isConcordeConnectEnabled() ? "/student/connect" : "/student/scenarios";
}
