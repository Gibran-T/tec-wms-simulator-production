import { describe, it, expect, beforeAll } from "vitest";
import { checkCompliance } from "./rulesEngine";
import { getScoringRule, calculateTotalScore } from "./scoringEngine";
import type { RunState } from "./rulesEngine";

// ─── Rules Engine Tests ────────────────────────────────────────────────────────

describe("checkCompliance", () => {
  const baseState: RunState = {
    run: { id: 1, userId: 1, scenarioId: 1, status: "in_progress", completedSteps: [], startedAt: new Date(), completedAt: null },
    transactions: [],
    inventory: {},
    cycleCounts: [],
    scoringEvents: [],
    scenario: { id: 1, moduleId: 1, name: "Test", descriptionFr: "", difficulty: "facile", initialStateJson: {}, isActive: true, createdAt: new Date() },
  };

  it("returns compliant when no issues", () => {
    const result = checkCompliance(baseState);
    expect(result.compliant).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("detects unposted transactions", () => {
    const state: RunState = {
      ...baseState,
      transactions: [{ id: 1, runId: 1, type: "PO", movementType: "GR", sku: "SKU-001", bin: "A-01", qty: "10", docRef: "PO-001", posted: false, postedAt: null, userId: 1, comment: null, createdAt: new Date() }],
    };
    const result = checkCompliance(state);
    expect(result.compliant).toBe(false);
    expect(result.issues.some(i => i.includes("unposted"))).toBe(true);
  });

  it("detects negative stock", () => {
    const state: RunState = {
      ...baseState,
      inventory: { "SKU-001::A-01": -5 },
    };
    const result = checkCompliance(state);
    expect(result.compliant).toBe(false);
    expect(result.issues.some(i => i.includes("Negative stock"))).toBe(true);
  });

  it("detects unresolved cycle count variances", () => {
    const state: RunState = {
      ...baseState,
      cycleCounts: [{ id: 1, runId: 1, sku: "SKU-001", bin: "A-01", systemQty: "10", physicalQty: "8", variance: "-2", resolved: false, createdAt: new Date() }],
    };
    const result = checkCompliance(state);
    expect(result.compliant).toBe(false);
    expect(result.issues.some(i => i.includes("unresolved"))).toBe(true);
  });

  it("is compliant when all transactions posted and no negative stock", () => {
    const state: RunState = {
      ...baseState,
      transactions: [{ id: 1, runId: 1, type: "PO", movementType: "GR", sku: "SKU-001", bin: "A-01", qty: "10", docRef: "PO-001", posted: true, postedAt: new Date(), userId: 1, comment: null, createdAt: new Date() }],
      inventory: { "SKU-001::A-01": 10 },
    };
    const result = checkCompliance(state);
    expect(result.compliant).toBe(true);
  });
});

// ─── Scoring Engine Tests ──────────────────────────────────────────────────────

describe("getScoringRule", () => {
  it("returns correct points for PO_COMPLETED", () => {
    const rule = getScoringRule("PO_COMPLETED");
    expect(rule).toBeDefined();
    expect(rule!.points).toBeGreaterThan(0);
  });

  it("returns correct points for COMPLIANCE_OK", () => {
    const rule = getScoringRule("COMPLIANCE_OK");
    expect(rule).toBeDefined();
    expect(rule!.points).toBeGreaterThan(0);
  });

  it("returns negative points for NEGATIVE_STOCK_ATTEMPT", () => {
    const rule = getScoringRule("NEGATIVE_STOCK_ATTEMPT");
    expect(rule).toBeDefined();
    expect(rule!.points).toBeLessThan(0);
  });

  it("returns undefined for unknown event type", () => {
    const rule = getScoringRule("UNKNOWN_EVENT");
    expect(rule).toBeUndefined();
  });
});

describe("calculateTotalScore", () => {
  it("returns 0 for empty events", () => {
    expect(calculateTotalScore([])).toBe(0);
  });

  it("sums positive events correctly", () => {
    const events = [
      { id: 1, runId: 1, eventType: "PO_CREATED", pointsDelta: 10, message: "", createdAt: new Date() },
      { id: 2, runId: 1, eventType: "GR_POSTED", pointsDelta: 15, message: "", createdAt: new Date() },
    ];
    expect(calculateTotalScore(events)).toBe(25);
  });

  it("applies penalties correctly", () => {
    const events = [
      { id: 1, runId: 1, eventType: "PO_CREATED", pointsDelta: 10, message: "", createdAt: new Date() },
      { id: 2, runId: 1, eventType: "NEGATIVE_STOCK_PENALTY", pointsDelta: -10, message: "", createdAt: new Date() },
    ];
    expect(calculateTotalScore(events)).toBe(0);
  });

  it("clamps score to 0 minimum", () => {
    const events = [
      { id: 1, runId: 1, eventType: "PENALTY", pointsDelta: -50, message: "", createdAt: new Date() },
    ];
    expect(calculateTotalScore(events)).toBe(0);
  });

  it("clamps score to 100 maximum", () => {
    const events = Array.from({ length: 20 }, (_, i) => ({
      id: i, runId: 1, eventType: "BONUS", pointsDelta: 20, message: "", createdAt: new Date()
    }));
    expect(calculateTotalScore(events)).toBe(100);
  });
});

// ─── Auth logout test (from template) ─────────────────────────────────────────

import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];
    const ctx: TrpcContext = {
      user: { id: 1, openId: "test-user", email: "test@example.com", name: "Test", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: (name: string, options: Record<string, unknown>) => { clearedCookies.push({ name, options }); } } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
  });
});
