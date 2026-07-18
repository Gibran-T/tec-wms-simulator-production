/**
 * RC13.1 Guardian tests — professor preview authorization, bank integrity,
 * read-only surface, and no student leakage.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./routers";
import { assessmentsRouter } from "./assessmentsRouter";
import type { TrpcContext } from "./_core/context";
import {
  EVAL1_ASSESSMENT_CODE,
  EVAL1_PASSING_SCORE,
  EVAL1_QUESTIONS,
  EVAL1_TOTAL_POINTS,
} from "../shared/eval1QuestionBank";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function makeCtx(role: AuthenticatedUser["role"] | null): TrpcContext {
  const user: AuthenticatedUser | null =
    role == null
      ? null
      : {
          id: role === "admin" ? 99 : role === "teacher" ? 2 : 10,
          openId: `rc131-${role ?? "anon"}`,
          email: `${role ?? "anon"}@example.com`,
          name: `RC131 ${role ?? "anon"}`,
          loginMethod: "manus",
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => undefined,
    } as TrpcContext["res"],
  };
}

async function expectForbidden(fn: () => Promise<unknown>) {
  try {
    await fn();
    expect.fail("expected FORBIDDEN");
  } catch (e) {
    expect(e).toBeInstanceOf(TRPCError);
    expect((e as TRPCError).code).toBe("FORBIDDEN");
  }
}

async function expectUnauthorized(fn: () => Promise<unknown>) {
  try {
    await fn();
    expect.fail("expected UNAUTHORIZED");
  } catch (e) {
    expect(e).toBeInstanceOf(TRPCError);
    expect((e as TRPCError).code).toBe("UNAUTHORIZED");
  }
}

describe("RC13.1 professor preview authorization surface", () => {
  it("exposes professorPreview and professorQuestionBank on assessments router", () => {
    const keys = Object.keys(assessmentsRouter._def.procedures);
    expect(keys).toContain("professorPreview");
    expect(keys).toContain("professorQuestionBank");
    expect(keys).toContain("professorList");
    expect(keys).toContain("professorAnalysis");
  });

  it("keeps student procedures separate from preview/bank", () => {
    const keys = Object.keys(assessmentsRouter._def.procedures);
    for (const k of ["hub", "start", "getAttempt", "autosave", "submit"]) {
      expect(keys).toContain(k);
    }
    expect(keys).not.toContain("preview");
    expect(keys).not.toContain("questionBank");
    expect(keys).not.toContain("getCorrection");
  });

  it("rejects unauthenticated professorPreview", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expectUnauthorized(() =>
      caller.assessments.professorPreview({ assessmentId: 1 })
    );
  });

  it("rejects unauthenticated professorQuestionBank", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expectUnauthorized(() =>
      caller.assessments.professorQuestionBank({ assessmentId: 1 })
    );
  });

  it("rejects student (role=user) professorPreview with FORBIDDEN", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expectForbidden(() =>
      caller.assessments.professorPreview({ assessmentId: 1 })
    );
  });

  it("rejects student (role=student) professorPreview with FORBIDDEN", async () => {
    const caller = appRouter.createCaller(makeCtx("student"));
    await expectForbidden(() =>
      caller.assessments.professorPreview({ assessmentId: 1 })
    );
  });

  it("rejects student professorQuestionBank with FORBIDDEN", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expectForbidden(() =>
      caller.assessments.professorQuestionBank({ assessmentId: 1 })
    );
  });

  it("allows teacher to call professorPreview (auth gate passes)", async () => {
    const caller = appRouter.createCaller(makeCtx("teacher"));
    try {
      const data = await caller.assessments.professorPreview({
        assessmentId: 1,
      });
      // If DB seeded: assert Eval1 shape. If NOT_FOUND (empty env), auth still passed.
      expect(data.assessment).toBeTruthy();
      if (data.assessment.code === EVAL1_ASSESSMENT_CODE) {
        expect(data.questions).toHaveLength(20);
        expect(data.assessment.totalPoints).toBe(100);
        expect(data.assessment.passingScore).toBe(70);
        expect(data.questions.reduce((s, q) => s + q.points, 0)).toBe(100);
        const codes = data.questions.map((q) => q.code).sort();
        expect(codes).toEqual(
          EVAL1_QUESTIONS.map((q) => q.code).sort()
        );
      }
    } catch (e) {
      // Auth must not be the failure mode for teacher
      expect(e).toBeInstanceOf(TRPCError);
      expect((e as TRPCError).code).not.toBe("FORBIDDEN");
      expect((e as TRPCError).code).not.toBe("UNAUTHORIZED");
    }
  });

  it("allows admin to call professorPreview (auth gate passes)", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    try {
      await caller.assessments.professorPreview({ assessmentId: 1 });
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError);
      expect((e as TRPCError).code).not.toBe("FORBIDDEN");
      expect((e as TRPCError).code).not.toBe("UNAUTHORIZED");
    }
  });
});

describe("RC13.1 Eval1 bank consistency (canonical source)", () => {
  it("has exactly 20 questions totaling 100 points with threshold 70", () => {
    expect(EVAL1_QUESTIONS).toHaveLength(20);
    expect(EVAL1_TOTAL_POINTS).toBe(100);
    expect(EVAL1_PASSING_SCORE).toBe(70);
    expect(EVAL1_QUESTIONS.reduce((s, q) => s + q.points, 0)).toBe(100);
  });

  it("retains SCN-007 / SCN-008 / SCN-009 / SCN-011 scenario references", () => {
    const scenarios = EVAL1_QUESTIONS.map((q) => q.scenarioOrProcess);
    for (const scn of ["SCN-007", "SCN-008", "SCN-009", "SCN-011"]) {
      expect(scenarios).toContain(scn);
    }
  });

  it("uses unique E1-Qxx codes with no duplicates", () => {
    const codes = EVAL1_QUESTIONS.map((q) => q.code);
    expect(new Set(codes).size).toBe(20);
  });
});

describe("RC13.1 read-only service source audit", () => {
  it("professorPreviewAssessment / professorQuestionBank contain no write SQL", () => {
    const src = readFileSync(
      resolve(process.cwd(), "server/assessmentService.ts"),
      "utf8"
    );
    const start = src.indexOf(
      "export async function professorPreviewAssessment"
    );
    const bankStart = src.indexOf(
      "export async function professorQuestionBank"
    );
    expect(start).toBeGreaterThan(-1);
    expect(bankStart).toBeGreaterThan(-1);
    const previewBody = src.slice(start, bankStart);
    const bankBody = src.slice(bankStart);
    for (const body of [previewBody, bankBody]) {
      expect(body).not.toMatch(/\.insert\s*\(/);
      expect(body).not.toMatch(/\.update\s*\(/);
      expect(body).not.toMatch(/\.delete\s*\(/);
      expect(body).not.toMatch(/\bINSERT\b/);
      expect(body).not.toMatch(/\bUPDATE\b/);
      expect(body).not.toMatch(/\bDELETE\b/);
    }
  });

  it("empty-attempt stats stay null (not 0%) in preview mapping source", () => {
    const src = readFileSync(
      resolve(process.cwd(), "server/assessmentService.ts"),
      "utf8"
    );
    expect(src).toContain(
      "correctPct: answered > 0 ? Math.round(correctRate * 100) : null"
    );
    expect(src).toContain("attempts: answered || null");
  });
});

describe("RC13.1 student UI leakage", () => {
  it("student assessment pages do not import professor preview panel", () => {
    const attempt = readFileSync(
      resolve(
        process.cwd(),
        "client/src/pages/student/AssessmentAttemptPage.tsx"
      ),
      "utf8"
    );
    const hub = readFileSync(
      resolve(process.cwd(), "client/src/pages/student/EvaluationsHubPage.tsx"),
      "utf8"
    );
    expect(attempt).not.toMatch(/AssessmentPreviewPanel/);
    expect(attempt).not.toMatch(/professorPreview/);
    expect(hub).not.toMatch(/AssessmentPreviewPanel/);
    expect(hub).not.toMatch(/professorQuestionBank/);
  });

  it("print CSS for professor preview is body-class scoped", () => {
    const css = readFileSync(
      resolve(process.cwd(), "client/src/index.css"),
      "utf8"
    );
    expect(css).toContain("body.assessment-prof-print");
    expect(css).toContain("assessment-prof-print-correction");
    expect(css).toContain("assessment-prof-no-print");
  });
});
