import { describe, expect, it } from "vitest";
import {
  computeVariance,
  getM3VarianceThreshold,
  validateVarianceEntry,
  M3_VARIANCE_THRESHOLD,
  M3_VARIANCE_THRESHOLD_DEFAULT,
} from "./rulesEngine";

const SCN_010_INITIAL_STATE = { adjustmentThreshold: 20 };
const SCN_009_INITIAL_STATE = { cycleCountTargets: [{ sku: "SKU-001", systemQty: 100, physicalQty: 97 }] };

describe("M3 stabilization — D-M3-01 variance threshold", () => {
  it("getM3VarianceThreshold returns 20 for SCN-010 seed metadata", () => {
    expect(getM3VarianceThreshold(SCN_010_INITIAL_STATE)).toBe(20);
  });

  it("getM3VarianceThreshold returns default 5 when no override (SCN-009)", () => {
    expect(getM3VarianceThreshold(SCN_009_INITIAL_STATE)).toBe(5);
    expect(getM3VarianceThreshold(null)).toBe(5);
    expect(getM3VarianceThreshold(undefined)).toBe(5);
  });

  it("M3_VARIANCE_THRESHOLD alias remains 5 for backward-compatible tests", () => {
    expect(M3_VARIANCE_THRESHOLD).toBe(5);
    expect(M3_VARIANCE_THRESHOLD_DEFAULT).toBe(5);
  });

  describe("SCN-010 (threshold 20)", () => {
    const threshold = 20;

    it("variance −28 requires justification", () => {
      const { requiresJustification } = computeVariance(380, 352, threshold);
      expect(requiresJustification).toBe(true);
    });

    it("variance −15 does NOT require justification at threshold 20", () => {
      const { requiresJustification } = computeVariance(100, 85, threshold);
      expect(requiresJustification).toBe(false);
    });

    it("rejects empty justification for −28 variance", () => {
      const result = validateVarianceEntry(380, 352, "", threshold);
      expect(result.allowed).toBe(false);
      expect(result.reasonFr).toMatch(/20/);
    });

    it("rejects whitespace-only justification (no auto-fill)", () => {
      const result = validateVarianceEntry(380, 352, "   ", threshold);
      expect(result.allowed).toBe(false);
    });

    it("rejects justification shorter than 5 characters", () => {
      const result = validateVarianceEntry(380, 352, "ok", threshold);
      expect(result.allowed).toBe(false);
    });

    it("accepts valid justification for −28 variance", () => {
      const result = validateVarianceEntry(
        380,
        352,
        "Expédition partielle non enregistrée dans le système",
        threshold,
      );
      expect(result.allowed).toBe(true);
    });
  });

  describe("SCN-009 (default threshold 5)", () => {
    const threshold = 5;

    it("variance −3 does NOT require justification", () => {
      const { varianceQty, requiresJustification } = computeVariance(100, 97, threshold);
      expect(varianceQty).toBe(-3);
      expect(requiresJustification).toBe(false);
    });

    it("allows CC_RECON with empty justification for −3 variance", () => {
      const result = validateVarianceEntry(100, 97, null, threshold);
      expect(result.allowed).toBe(true);
    });

    it("still requires justification at default threshold boundary (−5)", () => {
      const result = validateVarianceEntry(100, 95, null, threshold);
      expect(result.allowed).toBe(false);
    });
  });
});
