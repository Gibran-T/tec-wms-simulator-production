import { describe, expect, it } from "vitest";
import {
  M5_CANONICAL_OPS,
  M5_FORBIDDEN_PORTFOLIO_MARKERS,
  M5_LEARNING_CHAIN,
  M5_OFFICIAL_ORDER,
  M5_SCN015_MESSAGE,
  M5_SCN015_TITLE,
  M5_SCN016_CONTRACT,
  M5_SCN016_MESSAGE,
  M5_SCN017_DEFENSE_STRUCTURE,
  M5_SCN017_TITLE,
  M5_SEALED_MISSION_SUMMARIES,
  buildCanonicalM5ContractFields,
} from "./m5CapstoneMission";

describe("m5CapstoneMission — canonical closing-shift contracts", () => {
  it("exposes official order and learning chain", () => {
    expect(M5_OFFICIAL_ORDER.fr).toMatch(/Quiz M5.*Pré-M5.*SCN-015.*SCN-016.*SCN-017.*Post-M5/i);
    expect(M5_LEARNING_CHAIN.fr).toBe("EXÉCUTER → MESURER → RÉCONCILIER → ARBITRER → DÉFENDRE");
  });

  it("SCN-015 priority contract uses existing ops fields only", () => {
    const c = buildCanonicalM5ContractFields("NOMINAL_INTEGRATED");
    expect(c.qty).toBe(50);
    expect(c.initialStockQty).toBe(0);
    expect(c.storageCapacity).toBe(100);
    expect(c.priorityRequirement?.customerCode).toBe("CLI-PRIORITAIRE-A");
    expect(c.priorityRequirement?.reservedQty).toBe(10);
    expect(c.replenishmentParams?.minQty).toBe(10);
    expect(c.replenishmentParams?.maxQty).toBe(100);
    expect(c.decisionLevel).toBe("TACTICAL");
    expect(c.varianceInjection).toBeNull();
    expect(M5_SCN015_TITLE.fr).toMatch(/prioritaire/i);
    expect(M5_SCN015_MESSAGE.fr).toMatch(/correction artificielle/i);
  });

  it("SCN-016 contract is exact", () => {
    expect(M5_SCN016_CONTRACT).toEqual({
      systemQty: 50,
      physicalQty: 45,
      varianceQty: -5,
      adjustmentQty: -5,
      correctedStockQty: 45,
      minQty: 10,
      expectedQ: 0,
      accuracyBefore: 0.9,
      accuracyAfter: 1,
    });
    const c = buildCanonicalM5ContractFields("EXCEPTION_VARIANCE");
    expect(c.varianceInjection).toBe(-5);
    expect(c.cycleCountTargets?.[0]).toMatchObject({
      systemQty: 50,
      physicalQty: 45,
      bin: M5_CANONICAL_OPS.toBin,
    });
    expect(M5_SCN016_MESSAGE.fr).toMatch(/R[eé]concilier d'abord/i);
  });

  it("SCN-017 sealed summaries and defense structure avoid invented OTIF/backlog", () => {
    expect(M5_SCN017_TITLE.fr).toMatch(/bilan du quart/i);
    expect(M5_SCN017_DEFENSE_STRUCTURE.fr).toHaveLength(6);
    const sealed = [
      ...M5_SEALED_MISSION_SUMMARIES["SCN-015"].fr,
      ...M5_SEALED_MISSION_SUMMARIES["SCN-016"].fr,
    ].join(" ");
    expect(sealed.toLowerCase()).not.toMatch(/otif|backlog|goods issue|picking/);
    for (const marker of M5_FORBIDDEN_PORTFOLIO_MARKERS) {
      expect(sealed.includes(marker)).toBe(false);
    }
  });
});
