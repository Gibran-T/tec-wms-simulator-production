/**
 * Focused unit tests for M5DecisionResultPanel evidence rendering and helpers.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Panel, {
  formatM5Qty,
  resolveM5PhysicalStock,
  resolveM5ReconDisplayState,
  resolveM5SystemStock,
  type M5DecisionEvidence,
} from "./M5DecisionResultPanel";

const SRC = readFileSync(resolve(__dirname, "M5DecisionResultPanel.tsx"), "utf8");
const t = (fr: string) => fr;
const strip = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function evidence(partial: Partial<M5DecisionEvidence>): M5DecisionEvidence {
  return {
    receivedQty: 0,
    putawayQty: 0,
    cycleCountQty: null,
    varianceQty: 0,
    varianceResolved: false,
    replenishmentQty: null,
    stockQtyAtBin: 0,
    ...partial,
  };
}

describe("M5DecisionResultPanel — session evidence chrome", () => {
  it("states that data comes from the current session", () => {
    expect(SRC).toContain("Ces données proviennent de votre session");
    expect(SRC).toContain("m5-decision-result-panel");
  });

  it("uses the official M5 reasoning chain", () => {
    expect(SRC).toContain("EXÉCUTER → MESURER → RÉCONCILIER → ARBITRER → DÉFENDRE");
  });

  it("includes SCN-016 before/after reconciliation blocks", () => {
    expect(SRC).toContain("Avant réconciliation");
    expect(SRC).toContain("Après réconciliation");
    expect(SRC).toContain("m5-recon-before-after");
  });

  it("does not inject M4 portfolio defaults as live evidence", () => {
    expect(SRC).not.toContain("2400");
    expect(SRC).not.toContain("CANONICAL_M4");
    expect(SRC).not.toContain("48 000");
  });

  it("surfaces replenishment Q and session evidence tiles without revealing the recommendation", () => {
    expect(SRC).toContain("Q réappro");
    expect(SRC).toContain("Completion");
    expect(SRC).toContain("Exact. avant");
    expect(SRC).not.toMatch(/Je recommande|commander 100|Q = 0 est correct/);
    expect(SRC).not.toContain('"Rotation"');
  });
});

describe("SCN-015 — no client conformity verdict", () => {
  it("does not render a client-generated conforme / compliant verdict", () => {
    expect(SRC).not.toMatch(/\bconforme\b/i);
    expect(SRC).not.toMatch(/\bcompliant\b/i);
    expect(SRC).not.toMatch(/\bnon conforme\b/i);
    expect(SRC).not.toContain("cycleOk");
  });

  it("shows operational facts instead of a cycle verdict", () => {
    expect(SRC).toContain("État des opérations");
    expect(SRC).toContain("Réception");
    expect(SRC).toContain("Rangement");
    expect(SRC).toContain("Variance ouverte");
    expect(SRC).toContain("m5-ops-status");
  });

  it("keeps Q evidence path that preserves legitimate zero", () => {
    expect(SRC).toContain('q == null ? "—" : String(q)');
  });
});

describe("SCN-016 — reconciliation display states", () => {
  it("marks unresolved variance without completed after-state", () => {
    expect(resolveM5ReconDisplayState(evidence({
      cycleCountQty: 90,
      varianceQty: -10,
      varianceResolved: false,
      stockQtyAtBin: 90,
    }))).toBe("unresolved");
    expect(SRC).toContain("Réconciliation en attente");
    expect(SRC).toContain("Ajustement requis avant décision");
    expect(SRC).toContain("En attente de l'ajustement");
    expect(SRC).toContain("m5-recon-pending");
  });

  it("marks resolved variance for green after-reconciliation", () => {
    expect(resolveM5ReconDisplayState(evidence({
      cycleCountQty: 90,
      varianceQty: -10,
      varianceResolved: true,
      stockQtyAtBin: 90,
    }))).toBe("resolved");
    expect(resolveM5ReconDisplayState(
      evidence({ cycleCountQty: 90, varianceQty: -10, varianceResolved: false }),
      true,
    )).toBe("resolved");
    expect(SRC).toContain("m5-recon-complete");
    expect(SRC).toContain("Base de réapprovisionnement");
  });

  it("treats zero variance as complete without implying ADJ was posted", () => {
    expect(resolveM5ReconDisplayState(evidence({
      cycleCountQty: 100,
      varianceQty: 0,
      varianceResolved: true,
      stockQtyAtBin: 100,
    }))).toBe("zero_variance");
    expect(SRC).toContain("non requis");
  });

  it("does not treat stockQtyAtBin alone as reconciliation complete", () => {
    expect(resolveM5ReconDisplayState(evidence({
      cycleCountQty: null,
      varianceQty: 0,
      varianceResolved: false,
      stockQtyAtBin: 50,
    }))).toBe("awaiting_count");
  });

  it("handles missing evidence", () => {
    expect(resolveM5ReconDisplayState(null)).toBe("no_evidence");
    expect(resolveM5ReconDisplayState(undefined)).toBe("no_evidence");
  });
});

describe("run evidence priority over contract seed", () => {
  it("run cycle count overrides contract system/physical", () => {
    const run = evidence({ cycleCountQty: 88, varianceQty: -12 });
    const contract = { systemQtyBefore: 999, physicalQty: 888 };
    expect(resolveM5SystemStock(run, contract)).toBe(100); // 88 - (-12)
    expect(resolveM5PhysicalStock(run, contract)).toBe(88);
  });

  it("contract seed used only when run count evidence absent", () => {
    const run = evidence({ cycleCountQty: null, varianceQty: 0 });
    const contract = { systemQtyBefore: 120, physicalQty: 100 };
    expect(resolveM5SystemStock(run, contract)).toBe(120);
    expect(resolveM5PhysicalStock(run, contract)).toBe(100);
  });

  it("preserves legitimate zero run values and does not coerce undefined to zero", () => {
    expect(formatM5Qty(0)).toBe("0");
    expect(formatM5Qty(null)).toBe("—");
    expect(formatM5Qty(undefined)).toBe("—");
    expect(formatM5Qty(Number.NaN)).toBe("—");
    expect(resolveM5SystemStock(evidence({ cycleCountQty: 0, varianceQty: 0 }), { systemQtyBefore: 50 })).toBe(0);
    expect(resolveM5PhysicalStock(evidence({ cycleCountQty: 0 }), { physicalQty: 50 })).toBe(0);
    expect(resolveM5SystemStock(null, null)).toBe(null);
    expect(resolveM5PhysicalStock(null, {})).toBe(null);
  });
});

describe("ledger loading / error / empty states", () => {
  it("defines distinct loading, error and empty copy with a11y roles", () => {
    expect(SRC).toContain("m5-ledger-loading");
    expect(SRC).toContain('role="status"');
    expect(SRC).toContain("Synchronisation des résultats de la session");
    expect(SRC).toContain("m5-ledger-error");
    expect(SRC).toContain('role="alert"');
    expect(SRC).toContain("ne peuvent pas être chargés");
    expect(SRC).toContain("m5-ledger-empty");
    expect(SRC).toContain("après la validation des étapes opérationnelles");
  });

  it("uses readable tile label sizing (no 8px labels)", () => {
    expect(SRC).not.toContain("text-[8px]");
    expect(SRC).toMatch(/text-xs font-bold uppercase tracking-wide text-muted-foreground/);
  });
});

describe("SSR visual / rendered state descriptions", () => {
  it("SCN-015 Q=0 shows ops facts, Q=0, no conforme", () => {
    const html = renderToStaticMarkup(
      React.createElement(Panel, {
        scnCode: "SCN-015",
        t,
        evidence: evidence({
          receivedQty: 100,
          putawayQty: 100,
          cycleCountQty: 100,
          varianceQty: 0,
          varianceResolved: true,
          replenishmentQty: 0,
          stockQtyAtBin: 100,
        }),
        kpiResult: { rotationRate: 6, serviceLevel: 0.95, errorRate: 0.04 },
        contract: { minQty: 50, maxQty: 150 },
      }),
    );
    const text = strip(html);
    expect(text).toContain("État des opérations");
    expect(text).toContain("Réception: complétée");
    expect(text).toContain("Q réappro");
    expect(text).toMatch(/Q réappro\s+0/);
    expect(text).not.toMatch(/conforme/i);
  });

  it("SCN-016 unresolved hides final corrected stock and prefers run over seed", () => {
    const html = renderToStaticMarkup(
      React.createElement(Panel, {
        scnCode: "SCN-016",
        t,
        evidence: evidence({
          receivedQty: 100,
          putawayQty: 100,
          cycleCountQty: 90,
          varianceQty: -10,
          varianceResolved: false,
          stockQtyAtBin: 90,
        }),
        contract: { systemQtyBefore: 999, physicalQty: 888 },
        adjCompleted: false,
      }),
    );
    const text = strip(html);
    expect(html).toContain('data-recon-state="unresolved"');
    expect(text).toContain("Réconciliation en attente");
    expect(html).toMatch(/En attente de l(&#x27;|')ajustement/);
    expect(text).not.toContain("Après réconciliation");
    expect(text).toContain("Stock système: 100");
    expect(text).toContain("Stock physique: 90");
    expect(text).not.toContain("999");
    expect(text).not.toContain("888");
  });

  it("SCN-016 resolved shows Après + Stock corrigé from run stock", () => {
    const html = renderToStaticMarkup(
      React.createElement(Panel, {
        scnCode: "SCN-016",
        t,
        evidence: evidence({
          receivedQty: 100,
          putawayQty: 100,
          cycleCountQty: 90,
          varianceQty: -10,
          varianceResolved: true,
          replenishmentQty: 20,
          stockQtyAtBin: 90,
        }),
        adjCompleted: true,
      }),
    );
    const text = strip(html);
    expect(html).toContain('data-recon-state="resolved"');
    expect(text).toContain("Après réconciliation");
    expect(text).toContain("Stock corrigé: 90");
    expect(text).toContain("Base de réapprovisionnement: 90");
    expect(text).toContain("ajusté");
  });

  it("SCN-016 zero variance uses non requis ADJ status", () => {
    const html = renderToStaticMarkup(
      React.createElement(Panel, {
        scnCode: "SCN-016",
        t,
        evidence: evidence({
          receivedQty: 100,
          putawayQty: 100,
          cycleCountQty: 100,
          varianceQty: 0,
          varianceResolved: true,
          stockQtyAtBin: 100,
        }),
      }),
    );
    const text = strip(html);
    expect(html).toContain('data-recon-state="zero_variance"');
    expect(text).toContain("Après réconciliation");
    expect(text).toContain("non requis");
  });

  it("ledger loading / error / empty are mutually distinct", () => {
    const loading = strip(renderToStaticMarkup(React.createElement(Panel, { scnCode: "SCN-017", t, isLoading: true })));
    const error = strip(renderToStaticMarkup(React.createElement(Panel, { scnCode: "SCN-017", t, isError: true })));
    const empty = strip(renderToStaticMarkup(React.createElement(Panel, { scnCode: "SCN-017", t, evidence: null })));
    expect(loading).toContain("Synchronisation des résultats");
    expect(error).toContain("ne peuvent pas être chargés");
    expect(empty).toContain("après la validation des étapes opérationnelles");
    expect(loading).not.toContain("Rotation");
    expect(error).not.toContain("Rotation");
  });

  it("SCN-017 shows session evidence tiles and omits M4 portfolio KPI", () => {
    const html = renderToStaticMarkup(
      React.createElement(Panel, {
        scnCode: "SCN-017",
        t,
        evidence: evidence({ receivedQty: 50, putawayQty: 50, stockQtyAtBin: 50 }),
        sessionEvidence: {
          executionCompletionRate: 0.5,
          finalStockQty: 50,
          replenishmentQty: 0,
        },
      }),
    );
    const text = strip(html);
    expect(text).toContain("Taux de complétion du parcours");
    expect(text).toContain("50.0 %");
    expect(text).toContain("Preuves (≥3)");
    expect(text).not.toContain("6×");
    expect(text).not.toMatch(/Service\s+90/);
    expect(text).not.toContain("Valeur stock");
  });
});
