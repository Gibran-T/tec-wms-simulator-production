/**
 * M5 capstone pedagogical alignment — student-facing slides, visuals, tower framing.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getModuleById } from "./modules";
import { M5_DECISION_SCAFFOLD, M5_KPI_CONTROL_TOWER } from "./m5KpiControlTower";
import { SLIDE_VISUAL_MAP } from "./slideVisualMap";
import { VLS_MODULE_CONFIG } from "./vlsSlideStandard";

const FORBIDDEN_SLIDE_BODY = [
  /runtime\s*G4/i,
  /\bGREEN\b/,
  /\bM5_ADJ\b/,
  /snapshot\s+required/i,
  /snapshot\s+requis/i,
  /\bMI07\b/,
  /\bCOMPLIANCE_M5\b/,
  /\bM5_KPI\b/,
  /\bM5_CYCLE_COUNT\b/,
];

const M4_SNAPSHOT_AS_SESSION = [
  /6\s*[×x].*95\s*%.*4\s*%/i,
  /rotation\s*6\s*[×x]/i,
  /service\s*95\s*%/i,
  /erreurs?\s*4\s*%/i,
  /errors?\s*4\s*%/i,
];

const TARGET_TITLES_FR = [
  "M5 — Piloter une opération sous contrainte",
  "SCN-015 — Protéger une commande prioritaire sans désorganiser le flux",
  "SCN-016 — Réconcilier avant de décider",
  "SCN-017 — Présenter le bilan du quart et défendre le prochain plan d'action",
  "TEC.LOG complété — Vous savez piloter",
];

const VISUAL_SRC = readFileSync(
  resolve(__dirname, "../components/slides/visuals/PremiumSlideVisual.tsx"),
  "utf8",
);

describe("M5 capstone slides — titles and student bodies", () => {
  const m5 = getModuleById(5)!;

  it("exposes all five target French titles", () => {
    expect(m5.slides).toHaveLength(5);
    expect(m5.slides.map((s) => s.titleFr)).toEqual(TARGET_TITLES_FR);
  });

  it("does not present M4 Annexe A 6×/95%/4% as M5 session data in slide bodies", () => {
    for (const slide of m5.slides) {
      const body = [...slide.bodyFr, ...slide.bodyEn].join("\n");
      for (const pattern of M4_SNAPSHOT_AS_SESSION) {
        expect(body, `slide ${slide.id} body matched ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  it("removes internal QA / runtime labels from student slide bodies", () => {
    for (const slide of m5.slides) {
      const body = [...slide.bodyFr, ...slide.bodyEn].join("\n");
      for (const pattern of FORBIDDEN_SLIDE_BODY) {
        expect(body, `slide ${slide.id} body matched ${pattern}`).not.toMatch(pattern);
      }
    }
  });

  it("teaches SCN-015 nominal cycle and valid Q = 0", () => {
    const body = m5.slides[1].bodyFr.join(" ").toLowerCase();
    expect(body).toMatch(/q\s*=\s*0/);
    expect(body).toMatch(/conforme|correction artificielle/);
    expect(body).toMatch(/variance/);
  });

  it("teaches SCN-016 reconcile-before-decide with contract values", () => {
    const body = m5.slides[2].bodyFr.join(" ");
    expect(body).toContain("50");
    expect(body).toContain("45");
    expect(body).toMatch(/−\s*5|-\s*5/);
    expect(body.toLowerCase()).toMatch(/r[eé]concil/);
    expect(body).toMatch(/Q\s*=\s*0/);
    expect(body.toLowerCase()).toMatch(/deux d[eé]cisions|distinctes/);
  });

  it("teaches SCN-017 session evidence chain without fixed M4 KPIs", () => {
    const body = m5.slides[3].bodyFr.join(" ").toLowerCase();
    expect(body).toMatch(/preuves? de session|session/);
    expect(body).toMatch(/priorit/);
    expect(body).toMatch(/compromis|trade-off/);
    expect(body).toMatch(/horizon/);
    expect(body).not.toMatch(/6\s*[×x]/);
    expect(body).not.toMatch(/95\s*%/);
    expect(body).not.toMatch(/4\s*%/);
  });

  it("closes with M1–M5 progression competencies", () => {
    const body = m5.slides[4].bodyFr.join(" ");
    expect(body).toMatch(/M1 — Comprendre/);
    expect(body).toMatch(/M2 — Exécuter/);
    expect(body).toMatch(/M3 — Contrôler/);
    expect(body).toMatch(/M4 — Analyser/);
    expect(body).toMatch(/M5 — Piloter et décider/);
  });

  it("does not attach the VLS warehouse image to M5 student slides", () => {
    for (const slide of m5.slides) {
      expect(slide.imageUrl, `slide ${slide.id} imageUrl`).toBeUndefined();
    }
  });
});

describe("M5 slide visual map", () => {
  it("maps SCN-017 to m5-capstone FLOW, not m4-dashboard KPI", () => {
    expect(SLIDE_VISUAL_MAP[5][4]).toEqual({ type: "FLOW", variant: "m5-capstone" });
    expect(SLIDE_VISUAL_MAP[5][4]).not.toEqual({ type: "KPI", variant: "m4-dashboard" });
  });
});

describe("M5 PremiumSlideVisual cases", () => {
  it("case 5-4 source no longer hardcodes M4 KPI dashboard values", () => {
    const case54 = VISUAL_SRC.split('case "5-4":')[1]?.split('case "5-5":')[0] ?? "";
    expect(case54).not.toContain("6×");
    expect(case54).not.toContain("95%");
    expect(case54).not.toContain("4%");
    expect(case54).not.toContain("KpiGrid");
    expect(case54).toMatch(/Preuves de session|Priorité|Compromis|Horizon/i);
  });

  it("case 5-2 teaches nominal cycle / Q = 0", () => {
    const case52 = VISUAL_SRC.split('case "5-2":')[1]?.split('case "5-3":')[0] ?? "";
    expect(case52).toMatch(/Q\s*=\s*0/);
    expect(case52).toMatch(/nominal|Aucune variance|correction artificielle/i);
  });

  it("case 5-3 teaches reconciliation before decision", () => {
    const case53 = VISUAL_SRC.split('case "5-3":')[1]?.split('case "5-4":')[0] ?? "";
    expect(case53).toContain("50");
    expect(case53).toContain("45");
    expect(case53).toMatch(/−\s*5|écart/i);
    expect(case53).toMatch(/bloqu/i);
    expect(case53).not.toMatch(/\bGREEN\b|\bRED\b|\bYELLOW\b|M5_ADJ|papier/i);
  });

  it("case 5-5 shows M1–M5 progression", () => {
    const case55 = VISUAL_SRC.split('case "5-5":')[1]?.split("default:")[0] ?? "";
    expect(case55).toContain("Comprendre");
    expect(case55).toContain("Exécuter");
    expect(case55).toContain("Contrôler");
    expect(case55).toContain("Analyser");
    expect(case55).toContain("Piloter et décider");
  });

  it("case 5-1 teaches the pilot flow without M4 KPI tiles", () => {
    const case51 = VISUAL_SRC.split('case "5-1":')[1]?.split('case "5-2":')[0] ?? "";
    expect(case51).toMatch(/EXÉCUTER/);
    expect(case51).toMatch(/DÉFENDRE/);
    expect(case51).not.toContain("6×");
    expect(case51).not.toContain("KpiGrid");
  });
});

describe("M5 control tower student framing", () => {
  it("SCN-015/017 do not present 6×/95%/4% as session truth", () => {
    const tower = [M5_KPI_CONTROL_TOWER["SCN-015"], M5_KPI_CONTROL_TOWER["SCN-017"]]
      .flatMap((entry) =>
        Object.values(entry).flatMap((v) => (v && typeof v === "object" ? [v.fr, v.en] : [])),
      )
      .join("\n");
    const scaffold = `${M5_DECISION_SCAFFOLD["SCN-017"].fr}\n${M5_DECISION_SCAFFOLD["SCN-017"].en}`;
    const bundle = `${tower}\n${scaffold}`;
    expect(bundle).not.toMatch(/6\s*[×x]/);
    expect(bundle).not.toMatch(/95\s*%/);
    expect(bundle).not.toMatch(/4\s*%/);
    expect(bundle.toLowerCase()).toMatch(/session|snapshot/);
  });

  it("SCN-016 preserves contract reconciliation values", () => {
    const target = M5_KPI_CONTROL_TOWER["SCN-016"].target.fr;
    expect(target).toContain("50");
    expect(target).toContain("45");
    expect(target).toMatch(/−\s*5|-\s*5/);
    expect(target).toMatch(/Q\s*=\s*0/);
    expect(target).toMatch(/10/);
  });
});

describe("M5 VLS student-visible hotspots", () => {
  it("removes internal implementation labels from hotspot copy", () => {
    const hotspots = VLS_MODULE_CONFIG[5].hotspots;
    const text = hotspots
      .flatMap((h) => [h.labelFr, h.labelEn, h.detailFr, h.detailEn])
      .join("\n");
    expect(text).not.toMatch(/runtime\s*G4/i);
    expect(text).not.toMatch(/\bGREEN\b/);
    expect(text).not.toMatch(/\bM5_ADJ\b/);
    expect(text).not.toMatch(/snapshot\s+required/i);
    expect(text).not.toMatch(/\bM5_KPI\b/);
    expect(text).not.toMatch(/\bCOMPLIANCE\b/);
  });
});
