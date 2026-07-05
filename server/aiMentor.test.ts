import { describe, expect, it, beforeEach } from "vitest";
import { resolveMentorMode, isMentorAvailable } from "./aiMentor/modeRouter";
import { applyPreCallGuardrails, classifyUserIntent } from "./aiMentor/guardrails";
import { resolvePersonaForScenario } from "../shared/aiMentor/personaMap";
import { applyProhibitedContextFilter } from "./enterpriseContext/prohibitedFilter";
import { buildScenarioContext } from "./enterpriseContext/scenarioContext";
import { buildMissionContext } from "./enterpriseContext/missionContext";
import { buildUniverseContext } from "./enterpriseContext/universeContext";
import { buildProcessContext } from "./enterpriseContext/processContext";
import { getMissionForScenario } from "./missionData";
import type { EnterpriseContextPayload } from "../shared/enterpriseContext/types";
import { resetMentorSessionState } from "./aiMentor/mentorService";
import { clearMentorAuditLog } from "./aiMentor/auditLog";
import { assemblePromptPreview } from "./aiMentor/promptAssembly";
import { generateDryRunResponse } from "./aiMentor/providers/dryRunProvider";
import { scanResponseForLeaks } from "./aiMentor/guardrails";

function samplePayload(): EnterpriseContextPayload {
  const mission = getMissionForScenario({ id: 9, moduleId: 3, name: "SCN-009" });
  return {
    assembledAt: new Date().toISOString(),
    scnCode: "SCN-009",
    runId: null,
    blocks: {
      scenario: buildScenarioContext("SCN-009", 3, mission),
      mission: buildMissionContext(mission),
      universe: buildUniverseContext("SCN-009"),
      process: buildProcessContext("SCN-009", "CC_RECON"),
      studentProgress: {
        blockId: "studentProgress",
        sensitivity: "medium",
        data: {
          modulesCompleted: [1, 2],
          certificationStatus: { silverCertified: false, goldEligible: false, goldCertified: false },
          attemptCount: 1,
        },
      },
      currentStep: {
        blockId: "currentStep",
        sensitivity: "medium",
        data: {
          activeStepCode: "CC_RECON",
          activeStepLabel: { fr: "Réconciliation", en: "Reconciliation" },
          completedSteps: ["CC_LIST", "CC_COUNT"],
          progressPct: 50,
          runStatus: "in_progress",
          isDemo: true,
          oilFocus: "inventory_governance",
        },
      },
    },
  };
}

describe("AI Mentor — mode router", () => {
  it("maps demo runs to learning mode", () => {
    expect(resolveMentorMode({ isDemo: true, runStatus: "in_progress" })).toBe("learning");
    expect(isMentorAvailable("learning")).toBe(true);
  });

  it("locks certification during active evaluation", () => {
    expect(resolveMentorMode({ isDemo: false, runStatus: "in_progress" })).toBe("certification");
    expect(isMentorAvailable("certification")).toBe(false);
  });

  it("maps completed runs to reflection when requested", () => {
    expect(
      resolveMentorMode({ isDemo: false, runStatus: "completed", reflectionRequested: true }),
    ).toBe("reflection");
  });
});

describe("AI Mentor — persona mapping", () => {
  it("assigns Inventory Advisor to M3 SCN-009", () => {
    expect(resolvePersonaForScenario("SCN-009", 3)).toBe("INVENTORY_ADVISOR");
  });

  it("assigns Crisis Advisor to SCN-017", () => {
    expect(resolvePersonaForScenario("SCN-017", 5)).toBe("CRISIS_ADVISOR");
  });

  it("falls back to module persona", () => {
    expect(resolvePersonaForScenario(null, 4)).toBe("PERFORMANCE_COACH");
  });
});

describe("AI Mentor — guardrails", () => {
  beforeEach(() => {
    resetMentorSessionState();
    clearMentorAuditLog();
  });

  it("detects direct answer fishing", () => {
    expect(classifyUserIntent("What is the ADJ quantity?")).toContain("intent:answer_request");
  });

  it("refuses direct answers in professional mode", () => {
    const result = applyPreCallGuardrails({
      message: "Give me the answer",
      mode: "professional",
      hintCount: 0,
      language: "en",
    });
    expect(result.blocked).toBe(true);
    expect(result.message).toContain("direct answer");
  });

  it("blocks at hint budget cap", () => {
    const result = applyPreCallGuardrails({
      message: "I need help",
      mode: "professional",
      hintCount: 3,
      language: "en",
    });
    expect(result.blocked).toBe(true);
    expect(result.flags).toContain("hint_budget_exhausted");
  });
});

describe("AI Mentor — prohibited context integration", () => {
  it("passes clean enterprise context payloads", () => {
    expect(() => applyProhibitedContextFilter(samplePayload())).not.toThrow();
  });
});

describe("AI Mentor — prompt assembly", () => {
  it("includes universe, process, and professional role in context summary", () => {
    const preview = assemblePromptPreview({
      context: samplePayload(),
      mode: "learning",
      personaId: "INVENTORY_ADVISOR",
      language: "en",
    });
    const parsed = JSON.parse(preview.contextSummary);
    expect(parsed.universe).toBeDefined();
    expect(parsed.process).toBeDefined();
    expect(parsed.professionalRole).toBeDefined();
    expect(parsed.professionalRole.roleTitle).toBeTruthy();
  });
});

describe("AI Mentor — dry-run provider", () => {
  it("returns Socratic persona response in learning mode", () => {
    const response = generateDryRunResponse({
      context: samplePayload(),
      mode: "learning",
      personaId: "INVENTORY_ADVISOR",
      language: "en",
      studentMessage: "I am stuck on the reconciliation step",
    });
    expect(response).toContain("Sophie Lachance");
    expect(response).toContain("monitor or cockpit");
  });

  it("does not reveal step sequencer language", () => {
    const leaks = scanResponseForLeaks("Next you must click step 3");
    expect(leaks).toContain("leak:step_sequencer");
  });
});
