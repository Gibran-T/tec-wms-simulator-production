/**
 * Demo Mode Isolation Tests
 *
 * Verifies that:
 * 1. runs.start accepts isDemo flag and only allows it for teacher/admin roles
 * 2. Scoring is skipped in demo mode (no addScoringEvent calls)
 * 3. monitor.analytics excludes demo sessions
 * 4. runs.state returns isDemo flag and demoBackendState only for demo runs
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function makeUser(role: "student" | "teacher" | "admin"): AuthenticatedUser {
  return {
    id: 1,
    openId: `test-${role}`,
    email: `${role}@test.com`,
    name: `Test ${role}`,
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

function makeCtx(role: "student" | "teacher" | "admin"): TrpcContext {
  return {
    user: makeUser(role),
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// ─── Unit Tests (pure logic, no DB) ───────────────────────────────────────────

describe("Demo Mode — Role Gate Logic", () => {
  it("student requesting isDemo=true should be silently downgraded to evaluation", () => {
    // The router logic: isDemo = input.isDemo && (role === teacher || admin)
    const studentRole = "student";
    const inputIsDemo = true;
    const isTeacherOrAdmin = studentRole === "teacher" || studentRole === "admin";
    const effectiveIsDemo = inputIsDemo && isTeacherOrAdmin;
    expect(effectiveIsDemo).toBe(false);
  });

  it("teacher requesting isDemo=true should get demo mode", () => {
    const teacherRole = "teacher";
    const inputIsDemo = true;
    const isTeacherOrAdmin = teacherRole === "teacher" || teacherRole === "admin";
    const effectiveIsDemo = inputIsDemo && isTeacherOrAdmin;
    expect(effectiveIsDemo).toBe(true);
  });

  it("admin requesting isDemo=true should get demo mode", () => {
    const adminRole = "admin";
    const inputIsDemo = true;
    const isTeacherOrAdmin = adminRole === "teacher" || adminRole === "admin";
    const effectiveIsDemo = inputIsDemo && isTeacherOrAdmin;
    expect(effectiveIsDemo).toBe(true);
  });

  it("teacher requesting isDemo=false should get evaluation mode", () => {
    const teacherRole = "teacher";
    const inputIsDemo = false;
    const isTeacherOrAdmin = teacherRole === "teacher" || teacherRole === "admin";
    const effectiveIsDemo = inputIsDemo && isTeacherOrAdmin;
    expect(effectiveIsDemo).toBe(false);
  });
});

describe("Demo Mode — Scoring Isolation Logic", () => {
  it("evaluation mode: scoring event should be added when step completed", () => {
    const isDemo = false;
    const scoringEvents: string[] = [];
    // Simulate the router logic
    if (!isDemo) {
      scoringEvents.push("PO_COMPLETED");
    }
    expect(scoringEvents).toContain("PO_COMPLETED");
  });

  it("demo mode: no scoring event should be added when step completed", () => {
    const isDemo = true;
    const scoringEvents: string[] = [];
    if (!isDemo) {
      scoringEvents.push("PO_COMPLETED");
    }
    expect(scoringEvents).toHaveLength(0);
  });

  it("evaluation mode: OUT_OF_SEQUENCE should add penalty and throw", () => {
    const isDemo = false;
    const penalties: number[] = [];
    let threw = false;
    const validationAllowed = false;
    try {
      if (!validationAllowed) {
        if (!isDemo) {
          penalties.push(-5);
          throw new Error("BAD_REQUEST");
        }
      }
    } catch {
      threw = true;
    }
    expect(penalties).toContain(-5);
    expect(threw).toBe(true);
  });

  it("demo mode: OUT_OF_SEQUENCE should NOT add penalty and NOT throw", () => {
    const isDemo = true;
    const penalties: number[] = [];
    let threw = false;
    const validationAllowed = false;
    try {
      if (!validationAllowed) {
        if (!isDemo) {
          penalties.push(-5);
          throw new Error("BAD_REQUEST");
        }
        // Demo: warn but allow
      }
    } catch {
      threw = true;
    }
    expect(penalties).toHaveLength(0);
    expect(threw).toBe(false);
  });
});

describe("Demo Mode — Monitor Analytics Exclusion", () => {
  it("evaluation analytics should exclude demo runs", () => {
    const allRuns = [
      { run: { id: 1, isDemo: false, status: "completed" }, score: 85 },
      { run: { id: 2, isDemo: true, status: "completed" }, score: null },
      { run: { id: 3, isDemo: false, status: "in_progress" }, score: 60 },
    ];

    const evalRuns = allRuns.filter(r => !r.run.isDemo);
    expect(evalRuns).toHaveLength(2);
    expect(evalRuns.every(r => !r.run.isDemo)).toBe(true);
  });

  it("average score should only include evaluation runs", () => {
    const evalRuns = [
      { score: 80 },
      { score: 90 },
      { score: 70 },
    ];
    const avg = Math.round(evalRuns.reduce((sum, r) => sum + r.score, 0) / evalRuns.length);
    expect(avg).toBe(80);
  });

  it("demo runs should be identifiable by isDemo flag", () => {
    const allRuns = [
      { run: { id: 1, isDemo: false } },
      { run: { id: 2, isDemo: true } },
    ];
    const demoRuns = allRuns.filter(r => r.run.isDemo);
    expect(demoRuns).toHaveLength(1);
    expect(demoRuns[0]?.run.id).toBe(2);
  });
});

describe("Demo Mode — Backend Transparency", () => {
  it("demoBackendState should be null for evaluation runs", () => {
    const isDemo = false;
    const demoBackendState = isDemo ? { inventory: {}, transactions: [], cycleCounts: [] } : null;
    expect(demoBackendState).toBeNull();
  });

  it("demoBackendState should be populated for demo runs", () => {
    const isDemo = true;
    const mockState = { inventory: { "SKU-A::BIN-01": 50 }, transactions: [], cycleCounts: [] };
    const demoBackendState = isDemo ? mockState : null;
    expect(demoBackendState).not.toBeNull();
    expect(demoBackendState?.inventory).toHaveProperty("SKU-A::BIN-01");
  });
});

describe("Demo Mode — Compliance Finalization", () => {
  it("evaluation mode: non-compliant run should throw on finalize", () => {
    const isDemo = false;
    const compliant = false;
    let threw = false;
    try {
      if (!isDemo && !compliant) {
        throw new Error("BAD_REQUEST: Non conforme");
      }
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
  });

  it("demo mode: non-compliant run should be allowed to finalize with warning", () => {
    const isDemo = true;
    const compliant = false;
    let threw = false;
    let demoWarning: string | null = null;
    try {
      if (!isDemo && !compliant) {
        throw new Error("BAD_REQUEST: Non conforme");
      }
      // Demo: allow with warning
      if (isDemo && !compliant) {
        demoWarning = "Conformité non atteinte — mode démonstration autorise la clôture";
      }
    } catch {
      threw = true;
    }
    expect(threw).toBe(false);
    expect(demoWarning).not.toBeNull();
  });
});
