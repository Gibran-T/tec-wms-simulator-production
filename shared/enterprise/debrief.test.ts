import { describe, expect, it } from "vitest";
import { buildEnterpriseDebrief, buildSupervisorEvaluation } from "./debrief";
import { getCareerSignalsForModule } from "./careerSignals";

describe("Architecture Foundation v1.0 — enterprise debrief", () => {
  const baseInput = {
    moduleId: 3,
    scnCode: "SCN-009",
    missionTitle: "Déclencher le réapprovisionnement avant la vague de prélèvement.",
    businessProblem: "Stock sous le minimum — risque de rupture avant la commande client.",
    expectedOutcome: "Stock disponible et traçable au CDC.",
    supervisor: {
      id: "sophie-lachance",
      name: "Sophie Lachance",
      titleFr: "Planificatrice de la demande",
      titleEn: "Demand Planner",
      department: "PLAN" as const,
      signaturePhraseFr: "Chaque unité en rack a un coût. Chaque rupture a un prix.",
      signaturePhraseEn: "Every unit on the rack has a cost. Every stockout has a price.",
    },
    score: 78,
    passThreshold: 70,
    compliant: true,
    isDemo: false,
    stepsCompleted: 5,
    totalSteps: 5,
  };

  it("maps career signals per module (Manifesto §8.3)", () => {
    expect(getCareerSignalsForModule(4).primary.en).toBe("Operations Analyst");
    expect(getCareerSignalsForModule(5).secondary.en).toBe("Crisis decision-maker");
  });

  it("assembles debrief sections for successful evaluation run", () => {
    const debrief = buildEnterpriseDebrief(baseInput);
    expect(debrief.missionTitle).toBe(baseInput.missionTitle);
    expect(debrief.businessResult.en).toContain("Business result achieved");
    expect(debrief.supervisorEvaluation.fr).toContain("Sophie Lachance");
    expect(debrief.careerSignalPrimary.en).toBe("Inventory Analyst");
  });

  it("voices supervisor evaluation for demo runs", () => {
    const eval_ = buildSupervisorEvaluation({ ...baseInput, isDemo: true });
    expect(eval_.en).toContain("Demo exercise");
  });
});
