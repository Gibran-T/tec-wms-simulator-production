import { isEnterpriseExperienceEnabled } from "@/lib/enterpriseExperience";
import { getMissionForScenario } from "../../../server/missionData";

/** RC21-B.2 — Morning Briefing presentation gate. Default OFF. */
export function isMorningBriefingEnabled(): boolean {
  return (
    import.meta.env.VITE_ENABLE_MORNING_BRIEFING === "true" &&
    isEnterpriseExperienceEnabled()
  );
}

export function morningBriefingStorageKey(runId: number): string {
  return `tec-morning-briefing-ack:${runId}`;
}

export function isMorningBriefingAcknowledged(runId: number): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(morningBriefingStorageKey(runId)) === "true";
}

export function acknowledgeMorningBriefing(runId: number): void {
  sessionStorage.setItem(morningBriefingStorageKey(runId), "true");
}

type ScenarioRef = {
  id: number;
  moduleId?: number;
  name?: string | null;
};

/** Whether this run should show the Morning Briefing screen (client presentation only). */
export function shouldShowMorningBriefing(
  runId: number,
  scenario: ScenarioRef | null | undefined,
  runStatus?: string,
  completedStepsCount = 0,
): boolean {
  if (!isMorningBriefingEnabled()) return false;
  if (runStatus === "completed") return false;
  if (completedStepsCount > 0) return false;
  if (isMorningBriefingAcknowledged(runId)) return false;
  const mission = scenario ? getMissionForScenario(scenario) : null;
  return !!mission?.enterprise;
}

/** Post–runs.start navigation target. */
export function resolvePostRunStartPath(
  runId: number,
  scenario: ScenarioRef | null | undefined,
): string {
  if (shouldShowMorningBriefing(runId, scenario, "in_progress", 0)) {
    return `/student/run/${runId}/briefing`;
  }
  return `/student/run/${runId}`;
}
