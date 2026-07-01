import { describe, expect, it, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";

vi.mock("./db", () => ({
  getCohortById: vi.fn(),
  getStudentUserIdsInCohort: vi.fn(),
}));

import { getCohortById, getStudentUserIdsInCohort } from "./db";
import { resolveCohortScope, assertTeacherOwnsCohort } from "./cohortScope";

describe("cohortScope", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all students in cohort for owning teacher", async () => {
    vi.mocked(getCohortById).mockResolvedValue({
      id: 1,
      name: "Cohorte Fondatrice",
      description: null,
      createdBy: 10,
      createdAt: new Date(),
    });
    vi.mocked(getStudentUserIdsInCohort).mockResolvedValue([184, 213]);

    const scope = await resolveCohortScope(10, 1);
    expect(scope).toEqual({ cohortId: 1, studentUserIds: [184, 213] });
  });

  it("rejects teacher accessing another teacher cohort", async () => {
    vi.mocked(getCohortById).mockResolvedValue({
      id: 2,
      name: "Groupe B",
      description: null,
      createdBy: 99,
      createdAt: new Date(),
    });

    await expect(resolveCohortScope(10, 2)).rejects.toBeInstanceOf(TRPCError);
  });

  it("allows admin global scope without cohortId", async () => {
    const scope = await resolveCohortScope(1, undefined, true);
    expect(scope).toEqual({});
    expect(getCohortById).not.toHaveBeenCalled();
  });

  it("requires cohortId for teachers", async () => {
    await expect(resolveCohortScope(10, undefined, false)).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("assertTeacherOwnsCohort delegates to resolveCohortScope", async () => {
    vi.mocked(getCohortById).mockResolvedValue({
      id: 3,
      name: "Test",
      description: null,
      createdBy: 5,
      createdAt: new Date(),
    });
    vi.mocked(getStudentUserIdsInCohort).mockResolvedValue([]);

    await assertTeacherOwnsCohort(5, 3);
    expect(getStudentUserIdsInCohort).toHaveBeenCalledWith(3);
  });
});
