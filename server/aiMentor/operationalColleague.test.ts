import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  resolveMentorMode,
  isMentorAvailable,
  getModeBlockReason,
  getOperationalColleagueAvailabilityNote,
} from "./modeRouter";
import { applyPreCallGuardrails, classifyUserIntent, scanResponseForLeaks } from "./guardrails";
import { generateDryRunResponse } from "./providers/dryRunProvider";
import { generateLiveResponse } from "./providers/liveProvider";
import { assemblePromptPreview } from "./promptAssembly";
import {
  isAiMentorIntegrationReady,
} from "./mentorEnv";
import { buildScenarioContext } from "../enterpriseContext/scenarioContext";
import { buildMissionContext } from "../enterpriseContext/missionContext";
import { buildUniverseContext } from "../enterpriseContext/universeContext";
import { buildProcessContext } from "../enterpriseContext/processContext";
import { getMissionForScenario } from "../missionData";
import type { EnterpriseContextPayload } from "../../shared/enterpriseContext/types";

function evalPayload(isDemo = false): EnterpriseContextPayload {
  const mission = getMissionForScenario({ id: 6, moduleId: 2, name: "SCN-006" });
  return {
    assembledAt: new Date().toISOString(),
    scnCode: "SCN-006",
    runId: 99,
    blocks: {
      scenario: buildScenarioContext("SCN-006", 2, mission),
      mission: buildMissionContext(mission),
      universe: buildUniverseContext("SCN-006"),
      process: buildProcessContext("SCN-006", "PUTAWAY"),
      studentProgress: {
        blockId: "studentProgress",
        sensitivity: "medium",
        data: {
          modulesCompleted: [1],
          certificationStatus: { silverCertified: false, goldEligible: false, goldCertified: false },
          attemptCount: 1,
        },
      },
      currentStep: {
        blockId: "currentStep",
        sensitivity: "medium",
        data: {
          activeStepCode: "PUTAWAY",
          activeStepLabel: { fr: "Rangement", en: "Putaway" },
          completedSteps: ["GR"],
          progressPct: 40,
          runStatus: "in_progress",
          isDemo,
          oilFocus: "execution",
        },
      },
    },
  };
}

describe("RC23-D — operational colleague mode routing", () => {
  it("maps student evaluation in-progress to operational_colleague", () => {
    expect(resolveMentorMode({ isDemo: false, runStatus: "in_progress" })).toBe("operational_colleague");
    expect(isMentorAvailable("operational_colleague")).toBe(true);
  });

  it("keeps teacher demo in learning mode", () => {
    expect(resolveMentorMode({ isDemo: true, runStatus: "in_progress" })).toBe("learning");
    expect(isMentorAvailable("learning")).toBe(true);
  });

  it("keeps completed run in reflection when requested", () => {
    expect(
      resolveMentorMode({ isDemo: false, runStatus: "completed", reflectionRequested: true }),
    ).toBe("reflection");
  });

  it("locks certification only when AI mentor is disabled", () => {
    expect(resolveMentorMode({ isDemo: false, runStatus: "in_progress", aiMentorEnabled: false })).toBe(
      "certification",
    );
    expect(isMentorAvailable("certification")).toBe(false);
  });

  it("does not expose mentor lock message for operational_colleague", () => {
    expect(getModeBlockReason("operational_colleague", "fr")).toBeUndefined();
    const note = getOperationalColleagueAvailabilityNote("FLOOR_MENTOR", "fr");
    expect(note).toContain("Marc-André");
    expect(note).not.toMatch(/verrouillé|locked|collègue opérationnel|operational colleague|AI|OpenAI/i);
  });
});

describe("RC23-D — operational colleague guardrails", () => {
  const base = { mode: "operational_colleague" as const, hintCount: 0, language: "fr" as const };

  it("refuses direct answer requests", () => {
    const result = applyPreCallGuardrails({ ...base, message: "Donne-moi la réponse" });
    expect(result.blocked).toBe(true);
    expect(result.message).toMatch(/ne peux pas/i);
  });

  it("refuses lot requests", () => {
    const result = applyPreCallGuardrails({ ...base, message: "Quel lot je dois entrer ?" });
    expect(result.blocked).toBe(true);
    expect(result.message).toMatch(/lot/i);
    expect(classifyUserIntent("Quel lot je dois entrer ?")).toContain("intent:lot_request");
  });

  it("refuses bin requests", () => {
    const result = applyPreCallGuardrails({ ...base, message: "Quel bin dois-je utiliser ?" });
    expect(result.blocked).toBe(true);
    expect(result.message).toMatch(/emplacement|bin/i);
  });

  it("refuses quantity requests", () => {
    const result = applyPreCallGuardrails({ ...base, message: "Quelle quantité dois-je saisir ?" });
    expect(result.blocked).toBe(true);
    expect(result.message).toMatch(/quantité/i);
  });

  it("refuses transaction sequence requests", () => {
    const result = applyPreCallGuardrails({ ...base, message: "Quelle est la prochaine transaction ?" });
    expect(result.blocked).toBe(true);
    expect(result.message).toMatch(/séquence|cockpit/i);
  });
});

describe("RC23-D — operational colleague dry-run", () => {
  it("answers conceptual ERP/WMS questions safely", () => {
    const putaway = generateDryRunResponse({
      context: evalPayload(),
      mode: "operational_colleague",
      personaId: "FLOOR_MENTOR",
      language: "fr",
      studentMessage: "Pourquoi dois-je faire un putaway ?",
    });
    expect(putaway).toMatch(/traçabilité|quai|stock/i);
    expect(scanResponseForLeaks(putaway)).toHaveLength(0);

    const lt01 = generateDryRunResponse({
      context: evalPayload(),
      mode: "operational_colleague",
      personaId: "FLOOR_MENTOR",
      language: "fr",
      studentMessage: "C'est quoi LT01 ?",
    });
    expect(lt01).toMatch(/LT01|rangement|WM/i);
    expect(scanResponseForLeaks(lt01)).toHaveLength(0);
  });

  it("preserves colleague refusal behavior in dry-run fallback", () => {
    const response = generateDryRunResponse({
      context: evalPayload(),
      mode: "operational_colleague",
      personaId: "FLOOR_MENTOR",
      language: "fr",
      studentMessage: "Quel lot je dois entrer ?",
    });
    expect(response).toMatch(/ne peux pas|lot/i);
    expect(response).not.toMatch(/LOT-\d{4}/);
  });

  it("uses Socratic colleague framing for open questions", () => {
    const response = generateDryRunResponse({
      context: evalPayload(),
      mode: "operational_colleague",
      personaId: "FLOOR_MENTOR",
      language: "en",
      studentMessage: "I am reviewing putaway evidence in the monitor",
    });
    expect(response).toMatch(/reason|observe|Mission Sheet|cockpit|understand|together/i);
    expect(scanResponseForLeaks(response)).toHaveLength(0);
  });
});

describe("RC23-D — operational colleague prompt assembly", () => {
  it("includes operational colleague system prompt rules", () => {
    const preview = assemblePromptPreview({
      context: evalPayload(),
      mode: "operational_colleague",
      personaId: "FLOOR_MENTOR",
      language: "fr",
    });
    expect(preview.blocked).toBe(false);
    expect(preview.systemPrompt).toMatch(/employé Concorde Logistics|Concorde Logistics employee/i);
    expect(preview.systemPrompt).toMatch(/ne donnes pas de réponses|do not give answers/i);
  });
});

describe("RC23-D — OpenAI live in operational_colleague mode", () => {
  const env = { ...process.env };
  const fetchMock = vi.fn();

  beforeEach(() => {
    process.env = { ...env, OPENAI_API_KEY: "sk-test", OPENAI_MODEL: "gpt-4o-mini", ENABLE_AI_MENTOR_LIVE: "true" };
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    process.env = { ...env };
    vi.unstubAllGlobals();
  });

  it("integrationReady true when live enabled", () => {
    expect(isAiMentorIntegrationReady()).toBe(true);
  });

  it("generateLiveResponse works with operational_colleague preview", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "What evidence do you see in the cockpit for putaway?" } }],
      }),
    });

    const preview = assemblePromptPreview({
      context: evalPayload(),
      mode: "operational_colleague",
      personaId: "FLOOR_MENTOR",
      language: "en",
    });

    const text = await generateLiveResponse({
      preview,
      studentMessage: "Why does putaway matter?",
      liveContextSummary: "{}",
    });

    expect(text).toMatch(/evidence|cockpit/i);
    expect(scanResponseForLeaks(text)).toHaveLength(0);
  });
});
