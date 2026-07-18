/**
 * RC13.2 — Compact icon-only top navigation contracts (static source audit).
 * Node vitest environment — no browser; asserts canonical FioriShell invariants.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = readFileSync(resolve(__dirname, "FioriShell.tsx"), "utf8");

/** Desktop nav block: from icon-only comment through collapse toggle. */
function desktopNavBlock(src: string): string {
  const start = src.indexOf("Nav — desktop/tablet: icon-only");
  const end = src.indexOf("Nav collapse toggle (desktop)");
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return src.slice(start, end);
}

/** Mobile nav dropdown block. */
function mobileNavBlock(src: string): string {
  const start = src.indexOf("Mobile Nav Dropdown");
  const end = src.indexOf("Page Header (breadcrumbs + title)");
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return src.slice(start, end);
}

describe("RC13.2 — FioriShell compact icon-only navigation", () => {
  const desktop = desktopNavBlock(SRC);
  const mobile = mobileNavBlock(SRC);

  it("keeps desktop nav icon-only (no permanent label span at md+)", () => {
    expect(desktop).not.toMatch(/hidden xl:inline/);
    expect(desktop).not.toMatch(/max-w-\[7\.5rem\] truncate/);
    expect(desktop).toMatch(/w-8 h-8/);
    expect(desktop).toMatch(/aria-hidden="true"/);
  });

  it("does not use horizontal overflow scroll on canonical desktop nav", () => {
    expect(desktop).not.toMatch(/overflow-x-auto/);
    expect(desktop).not.toMatch(/scrollbar-none/);
    expect(desktop).toMatch(/hidden md:flex/);
  });

  it("wraps every desktop nav item with Radix Tooltip + matching label content", () => {
    expect(desktop).toMatch(/<Tooltip /);
    expect(desktop).toMatch(/TooltipTrigger/);
    expect(desktop).toMatch(/TooltipContent/);
    expect(desktop).toMatch(/delayDuration=\{200\}/);
    expect(desktop).toMatch(/\{item\.label\}/);
    expect(desktop).toMatch(/aria-label=\{item\.label\}/);
  });

  it("sets aria-current on active desktop and mobile routes", () => {
    expect(desktop).toMatch(/aria-current=\{active \? "page" : undefined\}/);
    expect(mobile).toMatch(/aria-current=\{active \? "page" : undefined\}/);
  });

  it("keeps visible text labels inside the mobile menu", () => {
    expect(mobile).toMatch(/\{item\.label\}/);
    expect(mobile).toMatch(/md:hidden/);
  });

  it("does not render desktop and mobile nav with the same visibility class", () => {
    expect(desktop).toMatch(/hidden md:flex/);
    expect(mobile).toMatch(/md:hidden/);
    expect(SRC).toMatch(/md:hidden flex items-center justify-center w-8 h-8/); // hamburger
  });

  it("preserves all student navigation destinations", () => {
    const required = [
      "/student/profile",
      "/student/slides",
      "/student/glossary",
      "/student/evaluations",
      "/student/certifications",
    ];
    for (const href of required) {
      expect(SRC).toContain(`href: "${href}"`);
    }
    // Home / Connect uses getStudentEntryPath() → studentHome
    expect(SRC).toMatch(/href: studentHome/);
  });

  it("preserves all teacher navigation destinations", () => {
    const required = [
      "/teacher",
      "/teacher/cohorts",
      "/teacher/scenarios",
      "/teacher/assignments",
      "/teacher/evaluations",
      "/teacher/students",
      "/teacher/monitor",
      "/teacher/analytics",
    ];
    for (const href of required) {
      expect(SRC).toContain(`href: "${href}"`);
    }
    expect(SRC).toMatch(/href: studentHome/); // Connect / Simulateur
    expect(SRC).toContain('href: "/admin"');
  });

  it("deprioritizes long programme title before nav (2xl) while keeping TEC.LOG from md", () => {
    expect(SRC).toMatch(/hidden 2xl:flex[\s\S]*?PROGRAMME_CODE/);
    expect(SRC).toMatch(/hidden md:flex 2xl:hidden[\s\S]*?TEC\.LOG/);
  });

  it("does not alter assessment/scoring imports or routes", () => {
    expect(SRC).not.toMatch(/assessmentEngine|scoringEngine|retake/i);
    expect(SRC).not.toMatch(/from ["']@\/pages\/.*Assessment/);
  });
});
