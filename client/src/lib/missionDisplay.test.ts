import { describe, expect, it } from "vitest";
import { resolvePageMissionTitle } from "./missionDisplay";

describe("RC21-C.1A — missionDisplay", () => {
  it("prefers enterprise mission over scenario name", () => {
    expect(
      resolvePageMissionTitle({
        scnCode: "SCN-001",
        scenarioName: "Scénario 1",
        enterpriseMission: "Flux bout-en-bout réception → expédition",
        objective: "Legacy objective",
      }),
    ).toBe("Flux bout-en-bout réception → expédition");
  });

  it("falls back to objective when enterprise mission is absent", () => {
    expect(
      resolvePageMissionTitle({
        scnCode: "SCN-002",
        scenarioName: "Scénario 2",
        enterpriseMission: null,
        objective: "Ghost GR reconciliation",
      }),
    ).toBe("Ghost GR reconciliation");
  });

  it("falls back to scenario name when briefing fields are empty", () => {
    expect(
      resolvePageMissionTitle({
        scnCode: "SCN-003",
        scenarioName: "Scénario 3",
        enterpriseMission: "  ",
        objective: "",
      }),
    ).toBe("Scénario 3");
  });
});
