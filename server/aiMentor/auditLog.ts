import type { MentorInteraction } from "../../shared/aiMentor/types";

const interactions: MentorInteraction[] = [];

export function logMentorInteraction(entry: Omit<MentorInteraction, "id" | "createdAt">): MentorInteraction {
  const record: MentorInteraction = {
    ...entry,
    id: `mentor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  interactions.push(record);
  if (interactions.length > 500) {
    interactions.splice(0, interactions.length - 500);
  }
  return record;
}

export function getMentorAuditTrail(runId: number): MentorInteraction[] {
  return interactions.filter((i) => i.runId === runId);
}

export function clearMentorAuditLog(): void {
  interactions.length = 0;
}

/** Dev/test only */
export function getMentorAuditSize(): number {
  return interactions.length;
}
