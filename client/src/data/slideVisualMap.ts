export type SlideVisualType = "FLOW" | "WH" | "KPI" | "FIORI" | "CERT";

export type SlideVisualVariant =
  | "default"
  | "m1-flow"
  | "m1-scenarios"
  | "m2-zones"
  | "m2-fifo"
  | "m3-inventory"
  | "m4-dashboard"
  | "m4-rca"
  | "m5-capstone"
  | "m5-ops"
  | "m4-scenarios"
  | "silver"
  | "gold";

/** Official 36 slides — visual type + variant per module slide id */
export const SLIDE_VISUAL_MAP: Record<number, Record<number, { type: SlideVisualType; variant?: SlideVisualVariant }>> = {
  1: {
    1: { type: "FIORI", variant: "default" },
    2: { type: "FLOW", variant: "m1-flow" },
    3: { type: "FLOW", variant: "default" },
    4: { type: "WH", variant: "default" },
    5: { type: "FIORI", variant: "default" },
    6: { type: "FLOW", variant: "default" },
    7: { type: "WH", variant: "default" },
    8: { type: "FLOW", variant: "default" },
    9: { type: "FIORI", variant: "m1-scenarios" },
    10: { type: "CERT", variant: "silver" },
  },
  2: {
    1: { type: "WH", variant: "m2-zones" },
    2: { type: "WH", variant: "default" },
    3: { type: "WH", variant: "default" },
    4: { type: "KPI", variant: "default" },
    5: { type: "FLOW", variant: "m2-fifo" },
    6: { type: "FIORI", variant: "default" },
    7: { type: "FIORI", variant: "default" },
  },
  3: {
    1: { type: "WH", variant: "m3-inventory" },
    2: { type: "KPI", variant: "default" },
    3: { type: "KPI", variant: "default" },
    4: { type: "FLOW", variant: "default" },
    5: { type: "FLOW", variant: "default" },
    6: { type: "FIORI", variant: "default" },
    7: { type: "FLOW", variant: "default" },
  },
  4: {
    1: { type: "KPI", variant: "m4-dashboard" },
    2: { type: "KPI", variant: "default" },
    3: { type: "KPI", variant: "default" },
    4: { type: "KPI", variant: "default" },
    5: { type: "FLOW", variant: "m4-rca" },
    6: { type: "KPI", variant: "default" },
    7: { type: "FIORI", variant: "m4-scenarios" },
  },
  5: {
    1: { type: "FLOW", variant: "m5-ops" },
    2: { type: "FLOW", variant: "m5-ops" },
    3: { type: "WH", variant: "default" },
    4: { type: "KPI", variant: "m4-dashboard" },
    5: { type: "CERT", variant: "gold" },
  },
};

export function resolveSlideVisual(
  moduleId: number,
  slideId: number,
  slideType?: string,
  tags?: string[],
): { type: SlideVisualType; variant: SlideVisualVariant } {
  const mapped = SLIDE_VISUAL_MAP[moduleId]?.[slideId];
  if (mapped) return { type: mapped.type, variant: mapped.variant ?? "default" };

  if (tags?.includes("certification")) {
    return { type: "CERT", variant: moduleId === 5 ? "gold" : "silver" };
  }
  if (slideType === "kpi") return { type: "KPI", variant: "default" };
  if (slideType === "process") return { type: "FLOW", variant: "default" };
  if (slideType === "cover" || slideType === "objectives") return { type: "FIORI", variant: "default" };
  if (slideType === "exercise") return { type: "FIORI", variant: "default" };
  return { type: "FIORI", variant: "default" };
}
