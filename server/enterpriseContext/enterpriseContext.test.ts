import { describe, it, expect } from "vitest";
import { getMissionForScenario } from "../missionData";
import { buildScenarioContext } from "./scenarioContext";
import { buildMissionContext } from "./missionContext";
import { buildUniverseContext } from "./universeContext";
import { buildProcessContext } from "./processContext";
import { applyProhibitedContextFilter, assertNoProhibitedStrings } from "./prohibitedFilter";
import { getProcessFamilyForScn, getProcessForStep } from "../../shared/enterprise/processes";
import { getIncidentById } from "../../shared/enterprise/incidents";
import { moduleIdFromScnCode } from "../canonicalScenarios";
import type { EnterpriseContextPayload } from "../../shared/enterpriseContext/types";

const ALL_SCNS = Array.from({ length: 17 }, (_, i) => `SCN-${String(i + 1).padStart(3, "0")}`);

describe("RC21 Enterprise Context Engine", () => {
  describe("Universe Part XII binding coverage", () => {
    it.each(ALL_SCNS)("assembles universe context for %s", (scnCode) => {
      const block = buildUniverseContext(scnCode);
      expect(block.blockId).toBe("universe");
      expect(block.sensitivity).toBe("low");
      expect(block.data.facility.fr).toContain("CDC");
      expect(block.data.warehouseZone).toBeTruthy();
    });
  });

  describe("Process Mapping alignment", () => {
    it.each(ALL_SCNS)("resolves process family for %s", (scnCode) => {
      const family = getProcessFamilyForScn(scnCode);
      expect(family.length).toBeGreaterThan(0);
      const ctx = buildProcessContext(scnCode, null);
      expect(ctx.data.cards.length).toBe(family.length);
    });

    it("maps GR step to PROC-GR", () => {
      expect(getProcessForStep("GR")).toBe("PROC-GR");
    });

    it("marks active process on step context", () => {
      const ctx = buildProcessContext("SCN-002", "GR");
      expect(ctx.data.activeProcessId).toBe("PROC-GR");
      expect(ctx.data.cards.find((c) => c.processId === "PROC-GR")?.isActiveForStep).toBe(true);
    });
  });

  describe("Incident catalogue", () => {
    it("resolves INC-001 for ghost GR scenario", () => {
      const inc = getIncidentById("INC-001");
      expect(inc?.scnCodes).toContain("SCN-002");
      const universe = buildUniverseContext("SCN-002");
      expect(universe.data.incident?.id).toBe("INC-001");
    });
  });

  describe("Mission + scenario blocks", () => {
    it("builds SCN-001 briefing blocks from mission data", () => {
      const mission = getMissionForScenario({ id: 1, moduleId: 1, name: "SCN-001" });
      expect(mission).not.toBeNull();
      const scenario = buildScenarioContext("SCN-001", 1, mission);
      const missionBlock = buildMissionContext(mission);
      expect(scenario.data.scnCode).toBe("SCN-001");
      expect(scenario.data.department).toBe("REC");
      expect(missionBlock.data.role).toContain("Gestionnaire");
      expect(missionBlock.data.supervisor?.name).toBeTruthy();
    });

    it("resolves module from scnCode for M4 capstone scenarios", () => {
      expect(moduleIdFromScnCode("SCN-014")).toBe(4);
      const mission = getMissionForScenario({ id: 36, moduleId: 4, name: "SCN-014" });
      const scenario = buildScenarioContext("SCN-014", 4, mission);
      expect(scenario.data.department).toBe("MGT");
    });
  });

  describe("Prohibited context filter", () => {
    it("passes clean payload", () => {
      const mission = getMissionForScenario({ id: 14, moduleId: 4, name: "SCN-014" });
      const payload: EnterpriseContextPayload = {
        assembledAt: new Date().toISOString(),
        scnCode: "SCN-014",
        runId: null,
        blocks: {
          scenario: buildScenarioContext("SCN-014", 4, mission),
          mission: buildMissionContext(mission),
          universe: buildUniverseContext("SCN-014"),
          process: buildProcessContext("SCN-014", "KPI_INTERPRET"),
          studentProgress: {
            blockId: "studentProgress",
            sensitivity: "medium",
            data: {
              modulesCompleted: [1, 2, 3],
              certificationStatus: { silverCertified: true, goldEligible: false, goldCertified: false },
              attemptCount: 2,
            },
          },
          currentStep: {
            blockId: "currentStep",
            sensitivity: "medium",
            data: {
              activeStepCode: "KPI_INTERPRET",
              activeStepLabel: { fr: "Interprétation KPI", en: "KPI interpretation" },
              completedSteps: ["PO", "GR"],
              progressPct: 40,
              runStatus: "in_progress",
              isDemo: false,
              oilFocus: "kpi_evidence",
            },
          },
        },
      };
      expect(() => applyProhibitedContextFilter(payload)).not.toThrow();
    });

    it("rejects payloads containing prohibited substrings", () => {
      expect(assertNoProhibitedStrings("expectedDiagnostic value")).toBe(false);
      expect(assertNoProhibitedStrings("Concorde Logistics operational briefing")).toBe(true);
    });
  });

  describe("Golden snapshots — SCN-002, SCN-014, SCN-017", () => {
    const snapshotScns = [
      { scn: "SCN-002", scenarioId: 2, moduleId: 1 },
      { scn: "SCN-014", scenarioId: 14, moduleId: 4 },
      { scn: "SCN-017", scenarioId: 17, moduleId: 5 },
    ] as const;

    it.each(snapshotScns)("$scn produces stable block IDs and sensitivities", ({ scn, scenarioId, moduleId }) => {
      const mission = getMissionForScenario({ id: scenarioId, moduleId, name: scn });
      const payload: EnterpriseContextPayload = {
        assembledAt: "2026-07-05T00:00:00.000Z",
        scnCode: scn,
        runId: null,
        blocks: {
          scenario: buildScenarioContext(scn, moduleId, mission),
          mission: buildMissionContext(mission),
          universe: buildUniverseContext(scn),
          process: buildProcessContext(scn, null),
          studentProgress: {
            blockId: "studentProgress",
            sensitivity: "medium",
            data: {
              modulesCompleted: [],
              certificationStatus: { silverCertified: false, goldEligible: false, goldCertified: false },
              attemptCount: 0,
            },
          },
          currentStep: {
            blockId: "currentStep",
            sensitivity: "medium",
            data: {
              activeStepCode: null,
              activeStepLabel: null,
              completedSteps: [],
              progressPct: 0,
              runStatus: "briefing",
              isDemo: false,
              oilFocus: null,
            },
          },
        },
      };

      expect(Object.keys(payload.blocks)).toEqual([
        "scenario",
        "mission",
        "universe",
        "process",
        "studentProgress",
        "currentStep",
      ]);
      expect(payload.blocks.scenario.sensitivity).toBe("low");
      expect(payload.blocks.studentProgress.sensitivity).toBe("medium");
      expect(payload.blocks.process.data.processFamily.length).toBeGreaterThan(0);
      applyProhibitedContextFilter(payload);
    });
  });
});
