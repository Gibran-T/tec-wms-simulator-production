/** RC19 — Enterprise Experience Layer feature gate (Architecture Foundation v1.0) */
export function isEnterpriseExperienceEnabled(): boolean {
  const flag = import.meta.env.VITE_ENABLE_ENTERPRISE_EXPERIENCE;
  return flag !== "false";
}

/** RC19-B — Run Report enterprise debrief (deferred until integration review). */
export function isEnterpriseDebriefEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_ENTERPRISE_DEBRIEF === "true";
}
