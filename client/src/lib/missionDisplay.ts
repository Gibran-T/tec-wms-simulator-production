import { resolveMissionTitle } from "@shared/enterprise/operationalAssignment";

export interface PageMissionTitleInput {
  scnCode: string;
  scenarioName?: string | null;
  enterpriseMission?: string | null;
  objective?: string | null;
}

/** RC21-C.1A — canonical mission title for student operational surfaces */
export function resolvePageMissionTitle(input: PageMissionTitleInput): string {
  const briefingMission = input.enterpriseMission?.trim();
  const objective = input.objective?.trim();
  return resolveMissionTitle(
    input.scnCode,
    input.scenarioName?.trim() ?? "",
    briefingMission || objective || null,
  );
}
