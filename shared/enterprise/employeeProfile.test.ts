import { describe, expect, it } from "vitest";
import {
  assembleEmployeeProfile,
  buildCompetencies,
  deriveEmployeeId,
  resolveActiveModuleId,
  resolveDepartmentForModule,
} from "./employeeProfile";

describe("RC20-A.2 — employee profile derivation", () => {
  it("derives stable employee ID from studentNumber", () => {
    expect(deriveEmployeeId(42, "2026-1806")).toBe("2026-1806");
  });

  it("falls back to CL-TEC format when studentNumber absent", () => {
    const id = deriveEmployeeId(7, null);
    expect(id).toMatch(/^CL-TEC-\d{4}-0007$/);
  });

  it("resolves active module as first not passed", () => {
    expect(
      resolveActiveModuleId([
        { moduleId: 1, passed: true },
        { moduleId: 2, passed: false },
      ])
    ).toBe(2);
  });

  it("defaults to M5 when all modules passed", () => {
    expect(
      resolveActiveModuleId([
        { moduleId: 1, passed: true },
        { moduleId: 2, passed: true },
        { moduleId: 3, passed: true },
        { moduleId: 4, passed: true },
        { moduleId: 5, passed: true },
      ])
    ).toBe(5);
  });

  it("builds competencies from completed modules only", () => {
    const competencies = buildCompetencies([1, 2]);
    const acquired = competencies.filter((c) => c.acquired);
    expect(acquired).toHaveLength(4);
    expect(acquired.every((c) => c.sourceModuleId <= 2)).toBe(true);
  });

  it("assembles full profile from derived inputs", () => {
    const profile = assembleEmployeeProfile({
      userId: 12,
      displayName: "Marie Dupont",
      studentNumber: "613-462",
      silverCertified: false,
      goldCertified: false,
      moduleProgress: [{ moduleId: 1, passed: false }],
      runs: [
        {
          runId: 100,
          scenarioId: 1,
          moduleId: 1,
          scnCode: "SCN-001",
          missionTitle: "Flux nominal End-to-End",
          status: "completed",
          isDemo: false,
          completedAt: "2026-06-01T12:00:00.000Z",
          score: 85,
        },
      ],
    });

    expect(profile.employeeId).toBe("613-462");
    expect(profile.displayName).toBe("Marie Dupont");
    expect(profile.department.code).toBeDefined();
    expect(profile.supervisor.name).toBeTruthy();
    expect(profile.careerChapter.moduleId).toBe(1);
    expect(profile.completedMissions).toHaveLength(1);
    expect(profile.completedMissions[0].scnCode).toBe("SCN-001");
    expect(profile.competencies.length).toBeGreaterThan(0);
    expect(profile.currentAssignment.status).toMatch(/active|available|none/);
    expect(profile.professionalSummary.fr).toContain("Marie");
    expect(profile.professionalSummary.en).toContain("Marie");
  });

  it("detects active in-progress assignment", () => {
    const profile = assembleEmployeeProfile({
      userId: 3,
      displayName: "Jean Test",
      moduleProgress: [{ moduleId: 1, passed: false }],
      runs: [
        {
          runId: 200,
          scenarioId: 2,
          moduleId: 1,
          scnCode: "SCN-002",
          missionTitle: "Ghost GR audit",
          status: "in_progress",
          isDemo: false,
          completedAt: null,
          score: null,
        },
      ],
    });

    expect(profile.currentAssignment.status).toBe("active");
    expect(profile.currentAssignment.runId).toBe(200);
    expect(profile.currentAssignment.scnCode).toBe("SCN-002");
  });

  it("excludes demo runs from completed missions", () => {
    const profile = assembleEmployeeProfile({
      userId: 5,
      displayName: "Demo User",
      moduleProgress: [],
      runs: [
        {
          runId: 1,
          scenarioId: 1,
          moduleId: 1,
          scnCode: "SCN-001",
          missionTitle: "Demo mission",
          status: "completed",
          isDemo: true,
          completedAt: "2026-06-01T12:00:00.000Z",
          score: 100,
        },
      ],
    });

    expect(profile.completedMissions).toHaveLength(0);
  });
});

describe("RC21-B.3 — department derivation", () => {
  it("derives department from scenarioBinding when assignment SCN exists", () => {
    const dept = resolveDepartmentForModule(1, "SCN-002");
    expect(dept.code).toBe("QA");
  });

  it("falls back to MODULE_HOME_DEPARTMENT when no assignment SCN", () => {
    expect(resolveDepartmentForModule(1, null).code).toBe("WH");
    expect(resolveDepartmentForModule(3, undefined).code).toBe("INV");
    expect(resolveDepartmentForModule(5, null).code).toBe("MGT");
  });

  it("assembles profile department from active assignment SCN binding", () => {
    const profile = assembleEmployeeProfile({
      userId: 1,
      displayName: "Test Student",
      moduleProgress: [{ moduleId: 1, passed: false }],
      runs: [
        {
          runId: 50,
          scenarioId: 2,
          moduleId: 1,
          scnCode: "SCN-002",
          missionTitle: "Ghost GR",
          status: "in_progress",
          isDemo: false,
          completedAt: null,
          score: null,
        },
      ],
    });
    expect(profile.department.code).toBe("QA");
    expect(profile.currentAssignment.scnCode).toBe("SCN-002");
  });
});
