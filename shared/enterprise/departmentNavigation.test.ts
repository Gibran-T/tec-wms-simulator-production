import { describe, expect, it } from "vitest";
import {
  buildDepartmentQueueItems,
  filterQueueByDepartment,
  getDepartmentCssClass,
  groupQueueByPriority,
  resolveDepartmentsForModule,
  resolveModuleHomeDepartment,
} from "./departmentNavigation";

describe("RC21-B.3 — departmentNavigation", () => {
  it("maps department code to TEDS CSS class (colors in tec-enterprise.css)", () => {
    expect(getDepartmentCssClass("WH")).toBe("tec-dept--wh");
    expect(getDepartmentCssClass("INV")).toBe("tec-dept--inv");
    expect(getDepartmentCssClass("MGT")).toBe("tec-dept--mgt");
  });

  it("resolves module home department from MODULE_HOME_DEPARTMENT (fallback only)", () => {
    expect(resolveModuleHomeDepartment(1)).toBe("WH");
    expect(resolveModuleHomeDepartment(3)).toBe("INV");
    expect(resolveModuleHomeDepartment(5)).toBe("MGT");
  });

  it("resolves unique departments for a module SCN list", () => {
    const depts = resolveDepartmentsForModule([
      "SCN-001",
      "SCN-002",
      "SCN-003",
      "SCN-004",
      "SCN-005",
    ]);
    expect(depts).toContain("REC");
    expect(depts).toContain("QA");
    expect(depts).toContain("PROC");
    expect(new Set(depts).size).toBe(depts.length);
  });

  it("builds queue items sorted by priority", () => {
    const items = buildDepartmentQueueItems(
      ["SCN-001", "SCN-005", "SCN-002"],
      { "SCN-001": "Nominal", "SCN-005": "Ops crisis", "SCN-002": "Ghost GR" },
    );
    expect(items).toHaveLength(3);
    expect(items[0].meta.priority).toBe("critique");
  });

  it("filters queue by department", () => {
    const items = buildDepartmentQueueItems(
      ["SCN-001", "SCN-002"],
      { "SCN-001": "Nominal", "SCN-002": "Ghost GR" },
    );
    const whOnly = filterQueueByDepartment(items, "REC");
    expect(whOnly).toHaveLength(1);
    expect(whOnly[0].scnCode).toBe("SCN-001");
  });

  it("groups queue by priority", () => {
    const items = buildDepartmentQueueItems(
      ["SCN-001", "SCN-005"],
      { "SCN-001": "Nominal", "SCN-005": "Ops crisis" },
    );
    const groups = groupQueueByPriority(items);
    expect(groups.length).toBeGreaterThan(0);
    expect(groups[0].priority).toBe("critique");
  });
});
