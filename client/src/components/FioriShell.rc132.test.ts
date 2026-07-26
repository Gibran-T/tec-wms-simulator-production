/**
 * RC13.2 — Compact icon-only top navigation contracts (static source audit).
 * Extended: structural overflow ("Plus") + teacher Exercices destination.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = readFileSync(resolve(__dirname, "FioriShell.tsx"), "utf8");
const ROLE_NAV = readFileSync(resolve(__dirname, "shell/RoleIconNav.tsx"), "utf8");
const CONFIG = readFileSync(resolve(__dirname, "shell/roleNavConfig.ts"), "utf8");

function mobileNavBlock(src: string): string {
  const start = src.indexOf("Mobile Nav Dropdown");
  const end = src.indexOf("Page Header (breadcrumbs + title)");
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return src.slice(start, end);
}

describe("RC13.2 — FioriShell compact icon-only navigation", () => {
  const mobile = mobileNavBlock(SRC);

  it("uses shared RoleIconNav for desktop icon packing", () => {
    expect(SRC).toContain("RoleIconNav");
    expect(SRC).toContain("Nav — desktop/tablet: icon-only + structural overflow");
    expect(SRC).not.toMatch(/overflow-x-auto/);
    expect(ROLE_NAV).toContain("ResizeObserver");
    expect(ROLE_NAV).toContain("shell-nav-more");
    expect(ROLE_NAV).toMatch(/w-8 h-8/);
    expect(ROLE_NAV).toMatch(/aria-hidden="true"/);
    expect(ROLE_NAV).toMatch(/<Tooltip /);
    expect(ROLE_NAV).toContain("aria-label={item.label}");
    expect(ROLE_NAV).toContain("computeVisibleNavCount");
    expect(ROLE_NAV).toContain('e.key === "Escape"');
  });

  it("keeps visible text labels inside the mobile menu", () => {
    expect(mobile).toMatch(/\{item\.label\}/);
    expect(mobile).toMatch(/md:hidden/);
  });

  it("preserves student navigation destinations", () => {
    expect(CONFIG).toContain('href: "/student/profile"');
    expect(CONFIG).toContain('href: "/student/slides"');
    expect(CONFIG).toContain('href: "/student/glossary"');
    expect(CONFIG).toContain('href: "/student/evaluations"');
    expect(CONFIG).toContain('href: "/student/certifications"');
    expect(CONFIG).toContain("__student_home__");
  });

  it("preserves teacher destinations including Exercices", () => {
    const required = [
      "/teacher",
      "/teacher/cohorts",
      "/teacher/exercices",
      "/teacher/scenarios",
      "/teacher/assignments",
      "/teacher/evaluations",
      "/teacher/students",
      "/teacher/monitor",
      "/teacher/analytics",
    ];
    for (const href of required) {
      expect(CONFIG).toContain(`href: "${href}"`);
    }
    expect(CONFIG).toContain('labelFr: "Exercices"');
    expect(CONFIG).toContain("ListChecks");
    expect(CONFIG).toContain('href: "/admin"');
  });

  it("moves cohort selector out of the tight mid-width shell bar", () => {
    expect(SRC).toContain("hidden xl:flex items-center gap-1.5");
    expect(SRC).toContain("shell-cohort-select-menu");
    expect(SRC).toContain("isTeacher ? \"hidden xl:flex 2xl:hidden\"");
  });

  it("does not alter assessment/scoring imports or routes", () => {
    expect(SRC).not.toMatch(/assessmentEngine|scoringEngine|retake/i);
    expect(SRC).not.toMatch(/from ["']@\/pages\/.*Assessment/);
  });
});
