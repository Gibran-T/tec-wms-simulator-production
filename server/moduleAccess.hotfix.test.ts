/**
 * Hotfix: open M1–M5 learning access — no inter-module progression checkpoints.
 * Proves gates removed from routers/UI while scenario validators remain.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { canAccessLearningModule } from "@shared/moduleAccess";
import { canExecuteStepM3, validatePutaway } from "./rulesEngine";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(rel: string): string {
  return readFileSync(path.resolve(root, rel), "utf8");
}

describe("Open module access hotfix — routers & UI gates removed", () => {
  const routers = read("server/routers.ts");

  it("runs.start no longer FORBIDDEN on M1 pass or M3 teacherValidated", () => {
    expect(routers).not.toContain("Module 2 verrouillé — complétez le Module 1 d'abord");
    expect(routers).not.toContain("Module 4 verrouillé — validation enseignant du Module 3 requise");
    expect(routers).toContain("canAccessLearningModule");
    expect(routers).not.toMatch(/isModuleUnlocked\(1,\s*passedIds\)/);
    expect(routers).not.toMatch(/isModule3Unlocked\(/);
  });

  it("submitPutaway no longer gates on Module 1 completion", () => {
    const putawayIdx = routers.indexOf("submitPutaway:");
    expect(putawayIdx).toBeGreaterThan(-1);
    const slice = routers.slice(putawayIdx, putawayIdx + 2500);
    expect(slice).not.toContain("Module 2 verrouillé");
    expect(slice).not.toContain("isModuleUnlocked");
  });

  it("warehouse.checkAccess uses open-access policy", () => {
    expect(routers).toContain("Module access flag — M1–M5 open");
    expect(routers).toContain("canAccessLearningModule");
  });

  it("A–D: authenticated enrolled student can access M1–M5 with empty progress", () => {
    for (const moduleId of [1, 2, 3, 4, 5]) {
      expect(
        canAccessLearningModule({
          authenticated: true,
          enrolledInCohort: true,
          moduleId,
        }),
      ).toBe(true);
    }
  });
});

describe("Open module access hotfix — protections preserved (E/F)", () => {
  it("E: scenario-internal step sequencing still blocks out-of-order steps", () => {
    const result = canExecuteStepM3("CC_COUNT" as any, []);
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/must be completed first/i);
  });

  it("F: capacity validation still rejects overflow putaway", () => {
    const result = validatePutaway({
      sku: "SKU-1",
      fromBin: "RECV",
      toBin: "BIN-A01",
      qty: 999,
      binCapacities: { "BIN-A01": 100 },
      binCurrentLoad: { "BIN-A01": 0 },
      existingLots: [],
      lotNumber: "LOT-A",
      receivedAt: new Date("2026-01-01"),
    });
    expect(result.allowed).toBe(false);
  });

  it("F: FIFO validation still rejects newer lot while older exists", () => {
    const result = validatePutaway({
      sku: "SKU-1",
      fromBin: "RECV",
      toBin: "BIN-A01",
      qty: 10,
      binCapacities: { "BIN-A01": 200 },
      binCurrentLoad: { "BIN-A01": 0 },
      existingLots: [
        { lotNumber: "LOT-OLD", receivedAt: new Date("2024-01-01"), qty: 50 },
      ],
      lotNumber: "LOT-NEW",
      receivedAt: new Date("2025-12-01"),
    });
    expect(result.allowed).toBe(false);
    expect(result.penaltyEvent).toBe("FIFO_VIOLATION");
  });
});

describe("Open module access hotfix — UI lock messaging removed (J)", () => {
  it("Module4Dashboard no longer sets missionsBlocked / Affectation verrouillée", () => {
    const src = read("client/src/pages/student/Module4Dashboard.tsx");
    expect(src).not.toContain("missionsBlocked");
    expect(src).not.toContain("m4Blocked");
    expect(src).not.toContain("Affectation verrouillée");
    expect(src).not.toContain("Assignment locked");
  });

  it("M2/M3/M5 hubs no longer show prerequisite lock alerts", () => {
    for (const rel of [
      "client/src/pages/student/Module2ScenarioList.tsx",
      "client/src/pages/student/Module3ScenarioList.tsx",
      "client/src/pages/student/Module5SimulationPage.tsx",
    ]) {
      const src = read(rel);
      expect(src).not.toContain("prerequisiteAlert");
      expect(src).not.toContain("Prérequis recommandé");
      expect(src).not.toContain("Recommended prerequisite");
    }
  });

  it("moduleProgressionCopy FR/EN have no blocking prerequisite language", () => {
    const src = read("client/src/data/moduleProgressionCopy.ts");
    expect(src).not.toMatch(/verrouill/i);
    expect(src).not.toMatch(/locked/i);
    expect(src).not.toMatch(/requiert la validation/i);
    expect(src).not.toMatch(/requires your supervisor/i);
    expect(src).toMatch(/Non commencé/);
    expect(src).toMatch(/Not started/);
    expect(src).toMatch(/En cours/);
    expect(src).toMatch(/In progress/);
    expect(src).toMatch(/Terminé/);
    expect(src).toMatch(/Completed/);
  });

  it("EnterpriseModuleHub fallback no longer tells students to complete previous chapter", () => {
    const src = read("client/src/components/enterprise/EnterpriseModuleHub.tsx");
    expect(src).not.toContain("complétez le chapitre précédent");
    expect(src).not.toContain("complete the previous chapter");
  });
});
