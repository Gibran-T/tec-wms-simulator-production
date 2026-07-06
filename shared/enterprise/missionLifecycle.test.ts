import { describe, expect, it } from "vitest";
import {
  getMissionLifecyclePhaseMeta,
  getMissionLifecyclePhaseOrder,
  pickMissionLifecycleLanguage,
  resolveMissionLifecyclePhase,
} from "./missionLifecycle";

describe("RC20-A.3 — mission lifecycle phase resolution", () => {
  it("maps run state to briefing → live → closure", () => {
    expect(
      resolveMissionLifecyclePhase({ runStatus: "in_progress", completedStepsCount: 0 }),
    ).toBe("briefing");
    expect(
      resolveMissionLifecyclePhase({ runStatus: "in_progress", completedStepsCount: 1 }),
    ).toBe("live");
    expect(
      resolveMissionLifecyclePhase({ runStatus: "completed", completedStepsCount: 5 }),
    ).toBe("closure");
  });

  it("treats completed run as closure even with zero steps", () => {
    expect(
      resolveMissionLifecyclePhase({ runStatus: "completed", completedStepsCount: 0 }),
    ).toBe("closure");
  });

  it("exposes ordered phases for UI stepper", () => {
    expect(getMissionLifecyclePhaseOrder()).toEqual(["briefing", "live", "closure"]);
  });

  it("provides bilingual phase metadata", () => {
    const live = getMissionLifecyclePhaseMeta("live");
    expect(pickMissionLifecycleLanguage("EN", live, "label")).toBe("Live mission");
    expect(pickMissionLifecycleLanguage("FR", live, "guidance")).toContain("Mission active");
    expect(pickMissionLifecycleLanguage("EN", getMissionLifecyclePhaseMeta("closure"), "sheetBanner")).toContain(
      "Closure",
    );
  });
});
