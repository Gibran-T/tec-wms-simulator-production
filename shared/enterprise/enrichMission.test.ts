import { describe, expect, it } from "vitest";
import { enrichMissionWithEnterprise } from "./enrichMission";
import { SCENARIO_UNIVERSE_BINDINGS } from "./scenarioBinding";
import type { MissionData } from "../../server/missionData";

const baseMission: MissionData = {
  scenarioId: 1,
  scnCode: "SCN-001",
  objective: "Assurer la réception conforme du PO-2026-001.",
  context: "Un camion STLA est au quai REC-01.",
  role: "Opérateur réception — quai",
  module: "M1 — Fondements",
  controlPoints: [],
  studentActions: [],
  expectedOutcome: "Stock disponible et traçable au CDC.",
  supervisorNotes: "Vérifie le PO avant de poster la GR.",
  technicalSpecs: {
    sku: "SKU-001",
    quantity: 120,
    expectedTransaction: "MIGO",
  },
};

describe("Architecture Foundation v1.0 — enterprise enrichment", () => {
  it("binds all SCN-001 through SCN-017 to universe metadata", () => {
    for (let n = 1; n <= 17; n += 1) {
      const code = `SCN-${String(n).padStart(3, "0")}`;
      expect(SCENARIO_UNIVERSE_BINDINGS[code]).toBeDefined();
      expect(SCENARIO_UNIVERSE_BINDINGS[code].scnCode).toBe(code);
    }
  });

  it("attaches enterprise briefing fields from universe binding", () => {
    const enriched = enrichMissionWithEnterprise(baseMission);

    expect(enriched.enterprise).toBeDefined();
    expect(enriched.enterprise?.priority).toBe("normal");
    expect(enriched.enterprise?.department).toBe("REC");
    expect(enriched.enterprise?.customer?.code).toBe("C-PAPI");
    expect(enriched.enterprise?.supplier?.code).toBe("S-STLA");
    expect(enriched.enterprise?.supervisor?.name).toBe("Marc-André Tremblay");
    expect(enriched.enterprise?.mission).toBe(baseMission.objective);
    expect(enriched.enterprise?.situation).toBe(baseMission.context);
  });

  it("returns mission unchanged when no universe binding exists", () => {
    const unknown = { ...baseMission, scnCode: "SCN-999" };
    expect(enrichMissionWithEnterprise(unknown)).toEqual(unknown);
  });

  it("RC21-C.1A — buildDocuments surfaces operational contract fields", () => {
    const mission: MissionData = {
      ...baseMission,
      scnCode: "SCN-006",
      technicalSpecs: {
        sku: "SKU-001",
        quantity: 150,
        poRef: "PO-M2-001",
        grRef: "GR-M2-001",
        lotNumber: "LOT-2025-001",
        sourceBin: "REC-01",
        targetBin: "B-01-R1-L1",
      },
    };
    const docs = enrichMissionWithEnterprise(mission).enterprise?.documentsAvailable ?? [];
    const fr = docs.map((d) => d.fr).join(" ");
    expect(fr).toContain("PO-M2-001");
    expect(fr).toContain("GR-M2-001");
    expect(fr).toContain("LOT-2025-001");
  });
});
