/** RC20-A.3 — Mission Lifecycle feature gate (default OFF) */
export function isMissionLifecycleEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_MISSION_LIFECYCLE === "true";
}
