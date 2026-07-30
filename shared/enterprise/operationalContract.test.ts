import { describe, expect, it } from "vitest";
import { M1_MISSIONS } from "../../server/missionData";
import { EXTENDED_MISSIONS } from "../../server/missionDataExtended";
import { enrichMissionWithEnterprise } from "./enrichMission";

/** RC21-C.1A — zero-invention operational contract verification (Agent 1 scope). */
describe("RC21-C.1A — enterprise operational contracts", () => {
  describe("SCN-001 — M1 open cycle document contract", () => {
    const mission = M1_MISSIONS[1];

    it("surfaces PO, GR, SO references and outbound quantities", () => {
      expect(mission.technicalSpecs.poRef).toBe("PO-2025-101");
      expect(mission.technicalSpecs.grRef).toBe("GR-2025-101");
      expect(mission.technicalSpecs.soRef).toBe("SO-2025-101");
      expect(mission.technicalSpecs.shipQuantity).toBe(80);
      expect(mission.technicalSpecs.giQuantity).toBe(80);
      expect(mission.technicalSpecs.targetBin).toBe("B-01-R1-L1");
      expect(mission.technicalSpecs.expBin).toBe("EXP-01");
    });

    it("exposes contract documents in enterprise briefing", () => {
      const docs = enrichMissionWithEnterprise(mission).enterprise?.documentsAvailable ?? [];
      const fr = docs.map((d) => d.fr).join(" ");
      expect(fr).toContain("PO-2025-101");
      expect(fr).toContain("GR-2025-101");
      expect(fr).toContain("SO-2025-101");
      expect(fr).toContain("80");
    });
  });

  describe("SCN-002 — ghost GR post-resolution ship contract", () => {
    const mission = M1_MISSIONS[2];

    it("surfaces preloaded GR and post-resolution SO/GI contract", () => {
      expect(mission.technicalSpecs.poRef).toBe("PO-2025-001");
      expect(mission.technicalSpecs.grRef).toBe("GR-2025-001");
      expect(mission.technicalSpecs.soRef).toBe("SO-2025-101");
      expect(mission.technicalSpecs.shipQuantity).toBe(80);
      expect(mission.technicalSpecs.expBin).toBe("EXP-01");
    });
  });

  describe("SCN-003 — binding ATP quantities", () => {
    const mission = M1_MISSIONS[3];

    it("uses binding quantities not example language", () => {
      const ctx = mission.context + mission.supervisorNotes;
      expect(ctx).not.toMatch(/ex\.\s*80/i);
      expect(ctx).not.toMatch(/ex\.\s*\+30/i);
      expect(mission.technicalSpecs.shipQuantity).toBe(80);
      expect(mission.technicalSpecs.correctivePoQuantity).toBe(30);
      expect(mission.technicalSpecs.correctivePoRef).toBe("PO-2025-003");
      expect(mission.technicalSpecs.targetBin).toBe("B-01-R1-L2");
    });
  });

  describe("SCN-006 — M2 lot disclosure", () => {
    const mission = EXTENDED_MISSIONS["SCN-006"];

    it("surfaces LOT-2025-001 in technical specs and briefing", () => {
      expect(mission.technicalSpecs.lotNumber).toBe("LOT-2025-001");
      const docs = enrichMissionWithEnterprise(mission).enterprise?.documentsAvailable ?? [];
      expect(docs.some((d) => d.fr.includes("LOT-2025-001"))).toBe(true);
    });
  });

  describe("SCN-007 — M2 capacity split lot", () => {
    const mission = EXTENDED_MISSIONS["SCN-007"];

    it("surfaces LOT-2025-002 and split destination bins (no FIFO lot)", () => {
      expect(mission.technicalSpecs.lotNumber).toBe("LOT-2025-002");
      expect(mission.technicalSpecs.lotNumber).not.toContain("LOT-2025-001");
      expect(mission.technicalSpecs.targetBin).toContain("B-01-R1-L1");
      expect(mission.technicalSpecs.targetBin).toContain("B-01-R1-L2");
      expect(mission.technicalSpecs.status).toMatch(/pas de FIFO|capacité/i);
    });
  });

  describe("SCN-015 — M5 integrated contract", () => {
    const mission = EXTENDED_MISSIONS["SCN-015"];

    it("publishes m5Contract fields in briefing", () => {
      expect(mission.technicalSpecs.poRef).toBe("PO-M5-001");
      expect(mission.technicalSpecs.lotNumber).toBe("LOT-M5-A");
      expect(mission.technicalSpecs.quantity).toBe(50);
      expect(mission.technicalSpecs.replenishMin).toBe(10);
      expect(mission.technicalSpecs.replenishMax).toBe(100);
      expect(mission.technicalSpecs.replenishSafetyStock).toBe(5);
      const docs = enrichMissionWithEnterprise(mission).enterprise?.documentsAvailable ?? [];
      const fr = docs.map((d) => d.fr).join(" ");
      expect(fr).toContain("LOT-M5-A");
      expect(fr).toContain("Min 10");
      expect(fr).toContain("Max 100");
    });
  });

  describe("SCN-016 — M5 variance with base contract", () => {
    const mission = EXTENDED_MISSIONS["SCN-016"];

    it("surfaces variance and base M5 contract", () => {
      expect(mission.technicalSpecs.lotNumber).toBe("LOT-M5-A");
      expect(mission.technicalSpecs.poRef).toBe("PO-M5-001");
      expect(mission.technicalSpecs.replenishMin).toBe(10);
      expect(mission.context).toContain("−5");
    });
  });

  describe("SCN-017 — M5 shift-review defense (session evidence)", () => {
    const mission = EXTENDED_MISSIONS["SCN-017"];

    it("does not cite static portfolio KPI values and requires session evidence", () => {
      const qty = String(mission.technicalSpecs.quantity);
      expect(qty).not.toContain("rotation");
      expect(qty).not.toContain("95%");
      expect(qty).not.toContain("48000");
      expect(mission.technicalSpecs.lotNumber).toBe("LOT-M5-A");
      expect(mission.objective).toMatch(/bilan du quart/i);
      expect(mission.context).toMatch(/≥3 preuves|preuves de VOTRE session/i);
      expect(mission.context).toMatch(/SCN-015/);
      expect(mission.context).toMatch(/SCN-016/);
      expect(mission.supervisorNotes).toMatch(/session courante|preuves/i);
      expect(mission.controlPoints.join(" ")).toMatch(/Continuité scellée/);
    });
  });
});
