import { describe, expect, it, afterEach } from "vitest";
import {
  getDepartmentEntryPath,
  isDepartmentHomeEnabled,
} from "./departmentHome";
import { getStudentEntryPath } from "./concordeConnect";

describe("RC21-B.3 — Department Home feature gate", () => {
  const originalDept = import.meta.env.VITE_ENABLE_DEPARTMENT_HOME;
  const originalConnect = import.meta.env.VITE_ENABLE_CONCORDE_CONNECT;
  const originalEnterprise = import.meta.env.VITE_ENABLE_ENTERPRISE_EXPERIENCE;

  afterEach(() => {
    import.meta.env.VITE_ENABLE_DEPARTMENT_HOME = originalDept;
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT = originalConnect;
    import.meta.env.VITE_ENABLE_ENTERPRISE_EXPERIENCE = originalEnterprise;
  });

  it("defaults OFF when env var is unset", () => {
    import.meta.env.VITE_ENABLE_DEPARTMENT_HOME = undefined;
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT = "true";
    expect(isDepartmentHomeEnabled()).toBe(false);
  });

  it("defaults OFF when env var is not true", () => {
    import.meta.env.VITE_ENABLE_DEPARTMENT_HOME = "false";
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT = "true";
    expect(isDepartmentHomeEnabled()).toBe(false);
  });

  it("enables only when explicitly true and Concorde Connect is on", () => {
    import.meta.env.VITE_ENABLE_DEPARTMENT_HOME = "true";
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT = "true";
    expect(isDepartmentHomeEnabled()).toBe(true);
  });

  it("stays OFF when Concorde Connect is disabled", () => {
    import.meta.env.VITE_ENABLE_DEPARTMENT_HOME = "true";
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT = "false";
    expect(isDepartmentHomeEnabled()).toBe(false);
  });

  it("routes to department home path when enabled", () => {
    import.meta.env.VITE_ENABLE_DEPARTMENT_HOME = "true";
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT = "true";
    expect(getDepartmentEntryPath()).toBe("/student/department");
    expect(getStudentEntryPath()).toBe("/student/department");
  });

  it("falls back to connect when department home disabled", () => {
    import.meta.env.VITE_ENABLE_DEPARTMENT_HOME = undefined;
    import.meta.env.VITE_ENABLE_CONCORDE_CONNECT = "true";
    expect(getStudentEntryPath()).toBe("/student/connect");
  });
});
