import { describe, expect, it } from "vitest";
import {
  buildAssignmentMeta,
  comparePriority,
  groupByDepartment,
  isUrgentPriority,
  resolveMissionTitle,
} from "./operationalAssignment";

describe("RC21-B.1 — operationalAssignment", () => {
  it("sorts priority critique before normal", () => {
    expect(comparePriority("critique", "normal")).toBeLessThan(0);
    expect(comparePriority("normal", "critique")).toBeGreaterThan(0);
  });

  it("flags urgent priorities", () => {
    expect(isUrgentPriority("critique")).toBe(true);
    expect(isUrgentPriority("elevee")).toBe(true);
    expect(isUrgentPriority("normal")).toBe(false);
  });

  it("prefers mission objective over scenario name", () => {
    expect(resolveMissionTitle("SCN-001", "Scénario 1", "End-to-end flow")).toBe("End-to-end flow");
    expect(resolveMissionTitle("SCN-001", "Scénario 1", null)).toBe("Scénario 1");
  });

  it("builds assignment meta from SCN binding", () => {
    const meta = buildAssignmentMeta("SCN-002", "Ghost GR reconciliation");
    expect(meta?.assignmentType).toBe("mission");
    expect(meta?.department).toBe("QA");
    expect(meta?.supervisorId).toBe("david-okonkwo");
  });

  it("groups items by department", () => {
    const groups = groupByDepartment([
      { department: "WH" as const, id: 1 },
      { department: "QA" as const, id: 2 },
      { department: "WH" as const, id: 3 },
    ]);
    expect(groups).toHaveLength(2);
    expect(groups.find((g) => g.department === "WH")?.items).toHaveLength(2);
  });
});
