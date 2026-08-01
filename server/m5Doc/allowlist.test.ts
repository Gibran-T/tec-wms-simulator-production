import { describe, it, expect, afterEach } from "vitest";
import {
  canAccessM5DocAsActor,
  isM5DocStudentAllowlisted,
  parseM5DocStudentAllowlist,
} from "../../shared/m5Doc/types";

const PREV = process.env.M5_DOC_STUDENT_ALLOWLIST;

afterEach(() => {
  if (PREV === undefined) delete process.env.M5_DOC_STUDENT_ALLOWLIST;
  else process.env.M5_DOC_STUDENT_ALLOWLIST = PREV;
});

describe("M5 DOC student allowlist", () => {
  it("is empty by default — no student access", () => {
    delete process.env.M5_DOC_STUDENT_ALLOWLIST;
    const parsed = parseM5DocStudentAllowlist();
    expect(parsed.userIds.size).toBe(0);
    expect(isM5DocStudentAllowlisted({ id: 222, email: "jamesnns3@gmail.com" })).toBe(false);
    expect(canAccessM5DocAsActor({ id: 222, role: "student", email: "jamesnns3@gmail.com" })).toBe(false);
  });

  it("allows James by userId 222 and email", () => {
    process.env.M5_DOC_STUDENT_ALLOWLIST = "222";
    expect(isM5DocStudentAllowlisted({ id: 222, email: "jamesnns3@gmail.com" })).toBe(true);
    expect(isM5DocStudentAllowlisted({ id: 999, email: "other@example.com" })).toBe(false);

    process.env.M5_DOC_STUDENT_ALLOWLIST = "jamesnns3@gmail.com";
    expect(isM5DocStudentAllowlisted({ id: 1, email: "jamesnns3@gmail.com" })).toBe(true);
    expect(isM5DocStudentAllowlisted({ id: 1, email: "OTHER@example.com" })).toBe(false);
  });

  it("allows teacher/admin without being on allowlist; refuses other students", () => {
    process.env.M5_DOC_STUDENT_ALLOWLIST = "222";
    expect(canAccessM5DocAsActor({ id: 1, role: "teacher", email: "prof@teclog.ca" })).toBe(true);
    expect(canAccessM5DocAsActor({ id: 1, role: "admin", email: "admin@teclog.ca" })).toBe(true);
    expect(canAccessM5DocAsActor({ id: 222, role: "student", email: "jamesnns3@gmail.com" })).toBe(true);
    expect(canAccessM5DocAsActor({ id: 50, role: "student", email: "cohort-b@example.com" })).toBe(false);
  });
});
