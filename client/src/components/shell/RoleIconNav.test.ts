import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { computeVisibleNavCount, NAV_ICON_SLOT_PX, SHELL_NAV_ITEMS } from "./roleNavConfig";

const navSrc = readFileSync(resolve(__dirname, "RoleIconNav.tsx"), "utf8");
const configSrc = readFileSync(resolve(__dirname, "roleNavConfig.ts"), "utf8");

describe("RoleIconNav accessibility and overflow packing", () => {
  it("uses real Lucide icons with full accessible names (not abbreviations)", () => {
    expect(navSrc).toContain("aria-label={item.label}");
    expect(navSrc).toContain("<span className=\"sr-only\">{item.label}</span>");
    expect(navSrc).toContain("TooltipContent");
    expect(navSrc).toContain("title={item.label}");
    expect(navSrc).toContain("<Icon size={15}");
    expect(navSrc).not.toMatch(/>\s*TD\s*</);
    expect(navSrc).not.toMatch(/>\s*Ex\s*</);
    expect(configSrc).toContain('labelFr: "Exercices"');
    expect(configSrc).toContain("ListChecks");
  });

  it("Plus menu shows full labels and closes on Escape", () => {
    expect(navSrc).toContain("shell-nav-more-menu");
    expect(navSrc).toContain("{item.label}");
    expect(navSrc).toContain('e.key === "Escape"');
    expect(navSrc).toContain("aria-expanded={moreOpen}");
  });

  it("ResizeObserver packing moves items to Plus when narrow and restores when wide", () => {
    expect(navSrc).toContain("ResizeObserver");
    expect(navSrc).toContain("computeVisibleNavCount");
    const teacherCount = SHELL_NAV_ITEMS.filter((i) => i.roles.includes("teacher")).length;
    expect(teacherCount).toBeGreaterThan(5);

    const wide = computeVisibleNavCount(900, teacherCount, NAV_ICON_SLOT_PX);
    expect(wide).toBe(teacherCount);

    const mid = computeVisibleNavCount(250, teacherCount, NAV_ICON_SLOT_PX);
    expect(mid).toBeLessThan(teacherCount);
    expect(mid).toBeGreaterThanOrEqual(1);

    const narrow = computeVisibleNavCount(120, teacherCount, NAV_ICON_SLOT_PX);
    expect(narrow).toBeLessThanOrEqual(mid);
    expect(narrow).toBeGreaterThanOrEqual(1);

    // Widening restores more icons
    expect(computeVisibleNavCount(320, teacherCount, NAV_ICON_SLOT_PX)).toBeGreaterThan(narrow);
  });

  it("keeps focus-visible and active ring styles", () => {
    expect(navSrc).toContain("focus-visible:outline");
    expect(navSrc).toContain("aria-current={active ? \"page\" : undefined}");
    expect(navSrc).toContain("bg-white/20 text-white ring-1 ring-white/40");
  });
});
