import { isEnterpriseAssignmentsEnabled } from "@/lib/enterpriseExperience";

/** RC21-C.1A — « Affectation » when EOAS ON, « Mission » when legacy */
export function getMissionEntityLabel(): { fr: string; en: string } {
  if (isEnterpriseAssignmentsEnabled()) {
    return { fr: "Affectation", en: "Assignment" };
  }
  return { fr: "Mission", en: "Mission" };
}

export function missionEntityLabel(
  t: (fr: string, en: string) => string,
): string {
  const labels = getMissionEntityLabel();
  return t(labels.fr, labels.en);
}
