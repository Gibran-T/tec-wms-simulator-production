/**
 * M4 Analytics UX Quality Wave — formatting, dashboard contracts, short-response UX.
 * Must not regress SCN-012 short-answer / scoring contracts.
 */
import { describe, expect, it } from "vitest";
import {
  M4_PORTFOLIO_ANALYTICS,
  formatAnalyticsValue,
} from "../shared/m4m5PedagogicalAnalytics";
import {
  M4_REASONING_CHAIN,
  M4_VISUAL_CONTRACTS,
  getM4VisualContract,
  isM4VisualScn,
} from "../shared/m4ScenarioVisualContract";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");

function readClient(rel: string): string {
  return readFileSync(join(ROOT, "client", "src", rel), "utf8");
}

describe("M4 visual contracts — scenario focus", () => {
  it("exposes distinct contracts for SCN-012/013/014", () => {
    expect(isM4VisualScn("SCN-012")).toBe(true);
    expect(isM4VisualScn("SCN-015")).toBe(false);
    expect(getM4VisualContract("SCN-012")?.titleFr).toMatch(/Rotation et capital/i);
    expect(getM4VisualContract("SCN-013")?.titleFr).toMatch(/Service et qualité/i);
    expect(getM4VisualContract("SCN-014")?.titleFr).toMatch(/Arbitrage multi-KPI/i);
  });

  it("SCN-012 primary focus is rotation + capital", () => {
    const c = M4_VISUAL_CONTRACTS["SCN-012"];
    expect(c.primaryCardIds).toEqual(["rotation", "capital"]);
    expect(c.businessQuestionFr).toMatch(/48 000/);
    expect(c.mainInsightFr).toMatch(/6×/);
    expect(c.classroom.decisionFr.toLowerCase()).toMatch(/maintenir/);
  });

  it("SCN-013 primary focus is OTIF + errors", () => {
    const c = M4_VISUAL_CONTRACTS["SCN-013"];
    expect(c.primaryCardIds).toEqual(["otif", "errors"]);
    expect(c.businessQuestionFr).toMatch(/OTIF|SLA/i);
    expect(c.classroom.followUpFr.toLowerCase()).toMatch(/otif|erreur/);
  });

  it("SCN-014 is executive multi-KPI with trade-off classroom companion", () => {
    const c = M4_VISUAL_CONTRACTS["SCN-014"];
    expect(c.primaryCardIds).toContain("rotation");
    expect(c.primaryCardIds).toContain("otif");
    expect(c.primaryCardIds).toContain("errors");
    expect(c.classroom.followUpFr).toMatch(/90/);
    expect(c.debrief.decisionFr.toLowerCase()).toMatch(/priorit|qualit|90/);
  });

  it("classroom reasoning chain has seven labels", () => {
    expect(M4_REASONING_CHAIN).toHaveLength(7);
    expect(M4_REASONING_CHAIN.map((s) => s.fr)).toEqual([
      "DONNÉES",
      "KPI",
      "BANDE / CIBLE",
      "RISQUE",
      "DÉCISION",
      "ACTION",
      "SUIVI",
    ]);
  });
});

describe("Analytics formatting — no duplicated units", () => {
  it("rotation value has no embedded ×", () => {
    const card = M4_PORTFOLIO_ANALYTICS.cards.find((c) => c.id === "rotation")!;
    const v = formatAnalyticsValue(card, "FR");
    expect(v).toBe("6");
    expect(v).not.toMatch(/×/);
    expect(card.unitFr).toBe("× / an");
    // Combined display must not become 6××
    expect(`${v}${card.unitFr}`).toBe("6× / an");
    expect(`${v}${card.unitFr}`).not.toMatch(/××/);
  });

  it("capital value has no embedded $", () => {
    const card = M4_PORTFOLIO_ANALYTICS.cards.find((c) => c.id === "capital")!;
    const v = formatAnalyticsValue(card, "FR");
    expect(v).not.toContain("$");
    expect(card.unitFr).toBe("$");
    expect(`${v} ${card.unitFr}`).not.toMatch(/\$\$/);
  });

  it("French decimal for lead time", () => {
    const card = M4_PORTFOLIO_ANALYTICS.cards.find((c) => c.id === "leadTime")!;
    expect(formatAnalyticsValue(card, "FR")).toBe("3,5");
    expect(card.unitFr).toBe("jours");
  });

  it("dataset label is canonique (not truncated canonic)", () => {
    expect(M4_PORTFOLIO_ANALYTICS.datasetLabelFr).toContain("canonique");
    expect(M4_PORTFOLIO_ANALYTICS.datasetLabelFr).not.toMatch(/canonic[^a-z]/);
  });

  it("rotation name is distinct from DSI", () => {
    const card = M4_PORTFOLIO_ANALYTICS.cards.find((c) => c.id === "rotation")!;
    expect(card.nameFr).toBe("Rotation des stocks");
    expect(card.nameFr).not.toMatch(/DSI/i);
  });

  it("SKU segmentation matches visual contract", () => {
    const skus = M4_PORTFOLIO_ANALYTICS.slowMovers;
    expect(skus.find((s) => s.sku === "SKU-A12")?.rotation).toBe(2.1);
    expect(skus.find((s) => s.sku === "SKU-B04")?.rotation).toBe(3.4);
    expect(skus.find((s) => s.sku === "SKU-C01")?.rotation).toBe(7.2);
  });

  it("rotation trend spans T3 2025 → T2 2026 ending at 6", () => {
    const trend = M4_PORTFOLIO_ANALYTICS.rotationTrend;
    expect(trend[0].periodFr).toBe("T3 2025");
    expect(trend[trend.length - 1]).toMatchObject({ periodFr: "T2 2026", value: 6 });
  });
});

describe("M4 Control Tower UX source contracts", () => {
  it("M4KpiControlTower exposes required BI elements", () => {
    const src = readClient("components/operational-intelligence/m4/M4KpiControlTower.tsx");
    expect(src).toMatch(/data-testid="m4-kpi-control-tower"/);
    expect(src).toMatch(/m4-tower-business-question/);
    expect(src).toMatch(/m4-tower-primary-cards/);
    expect(src).toMatch(/analytics-trend-rotation/);
    expect(src).toMatch(/analytics-sku-bars/);
    expect(src).toMatch(/analytics-error-pareto/);
    expect(src).toMatch(/analytics-tradeoff-panel/);
    expect(src).toMatch(/m4-classroom-companion/);
    expect(src).toMatch(/m4-tower-advanced/);
    expect(src).toMatch(/sr-only/); // chart data tables for a11y
  });

  it("evidence layer uses three-level hierarchy with collapsible advanced", () => {
    const src = readClient("components/operational-intelligence/m4/M4EvidenceLayer.tsx");
    expect(src).toMatch(/M4KpiControlTower/);
    expect(src).toMatch(/m4-evidence-supporting/);
    expect(src).toMatch(/m4-evidence-advanced/);
    expect(src).toMatch(/Collapsible/);
  });

  it("snapshot header uses French terminology cleanup", () => {
    const src = readClient("components/operational-intelligence/m4/M4KpiSnapshotHeader.tsx");
    expect(src).toMatch(/Synthèse analytique/);
    expect(src).toMatch(/Angle d'analyse/);
    expect(src).toMatch(/Vue KPI/);
    expect(src).not.toMatch(/Extrait analytique canonique/);
    expect(src).not.toMatch(/Lens :/);
    expect(src).not.toMatch(/Snapshot KPI/);
  });

  it("short-response field uses short answer UX (no long-analysis prompt)", () => {
    const src = readClient("components/analytical/AnalyticalResponseField.tsx");
    expect(src).toMatch(/Réponse courte: KPI, décision, suivi/);
    expect(src).toMatch(/1 à 3 phrases courtes/);
    expect(src).toMatch(/LECTURE/);
    expect(src).toMatch(/Exemple professionnel|Structure attendue/);
    expect(src).not.toMatch(/Rédigez votre analyse/);
    expect(src).not.toMatch(/canonical response|réponse canonique/i);
  });

  it("debrief is concise with RESULT/LECTURE/DECISION/IMPACT/LESSON", () => {
    const src = readClient("components/operational-intelligence/m4/M4MissionDebrief.tsx");
    expect(src).toMatch(/m4-mission-debrief/);
    expect(src).toMatch(/RÉSULTAT|RESULT/);
    expect(src).toMatch(/LECTURE|READING/);
    expect(src).toMatch(/DÉCISION|DECISION/);
    expect(src).toMatch(/IMPACT/);
    expect(src).toMatch(/LEÇON|LESSON/);
    expect(src).toMatch(/m4-debrief-report-cta/);
  });

  it("student-facing FR avoids monitoring SKU phrasing in control tower data", () => {
    const src = readClient("data/m4KpiControlTower.ts");
    expect(src).not.toMatch(/monitoring SKU/);
    expect(src).toMatch(/suivi des SKU/);
  });

  it("StepForm mounts M4KpiControlTower on analytical step route", () => {
    const src = readClient("pages/student/StepForm.tsx");
    expect(src).toMatch(/M4KpiControlTower/);
    expect(src).toMatch(/m4-step-control-tower/);
    expect(src).toMatch(/showM4StepControlTower/);
    expect(src).not.toMatch(/Taux de rotation \(DSI\)/);
    expect(src).toMatch(/Taux de rotation des stocks/);
  });
});
