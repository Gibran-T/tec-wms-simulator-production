/**
 * Professional short-answer contracts — SCN-012…017 + run 692 regression.
 */
import { describe, it, expect } from "vitest";
import {
  calculateKpis,
  scoreKpiInterpretation,
  validateM4Compliance,
  CANONICAL_M4_KPI_DATA,
} from "./rulesEngine";
import {
  evalKpiRotationShort,
  evalKpiServiceShort,
  evalKpiDiagnosticShort,
} from "../shared/m4m5ShortAnswerContract";
import { matchConceptGroup, CG_SERVICE_WEAK, normalizePedagogicalText } from "../shared/pedagogicalConceptEval";
import { formatAnalyticsValue, M4_PORTFOLIO_ANALYTICS } from "../shared/m4m5PedagogicalAnalytics";

const kpi = calculateKpis(CANONICAL_M4_KPI_DATA);
const steps = ["KPI_DATA", "KPI_ROTATION", "KPI_SERVICE", "KPI_DIAGNOSTIC"];

const ROT =
  "Rotation 6x, zone normale. Maintenir le stock global. Surveiller les SKU lents.";
const SVC = "OTIF 95%, excellent. Erreurs 4%, acceptables. Suivi qualite.";
const DIAG =
  "Maintenir le stock. Reduction ciblee des SKU lents. Revue OTIF et capital.";

function compliance(scn: string, rot: string, svc: string, diag: string) {
  return validateM4Compliance({
    scnCode: scn,
    completedSteps: steps,
    kpiInterpretations: [
      {
        kpiKey: "rotationRate",
        studentAnswer: rot,
        isCorrect: scoreKpiInterpretation("rotationRate", rot, kpi, scn).isCorrect,
      },
      {
        kpiKey: "serviceLevel",
        studentAnswer: svc,
        isCorrect: scoreKpiInterpretation("serviceLevel", svc, kpi, scn).isCorrect,
      },
      {
        kpiKey: "diagnostic",
        studentAnswer: diag,
        isCorrect: scoreKpiInterpretation("diagnostic", diag, kpi, scn).isCorrect,
      },
    ],
    kpiResult: kpi,
  });
}

describe("Run 692 regression — faible rotation must not poison service", () => {
  const ans692 =
    "Le taux de service OTIF est de 95 %. Ce résultat atteint le seuil excellent de 95 %. Je recommande de maintenir la politique globale de stock, tout en surveillant régulièrement l'OTIF et les SKU à faible rotation.";

  it("does not match CG_SERVICE_WEAK on faible rotation", () => {
    const n = normalizePedagogicalText(ans692);
    expect(matchConceptGroup(n, CG_SERVICE_WEAK)).toBe(false);
  });

  it("scores service answer as correct", () => {
    expect(scoreKpiInterpretation("serviceLevel", ans692, kpi, "SCN-012").isCorrect).toBe(true);
  });
});

describe("SCN-012 professional short answers", () => {
  it("accepts official short rotation / service / diagnostic", () => {
    expect(scoreKpiInterpretation("rotationRate", ROT, kpi, "SCN-012").isCorrect).toBe(true);
    expect(scoreKpiInterpretation("serviceLevel", SVC, kpi, "SCN-012").isCorrect).toBe(true);
    expect(scoreKpiInterpretation("diagnostic", DIAG, kpi, "SCN-012").isCorrect).toBe(true);
    expect(compliance("SCN-012", ROT, SVC, DIAG).allowed).toBe(true);
  });

  it("accepts accent-free synonyms and alternate order", () => {
    expect(
      scoreKpiInterpretation(
        "rotationRate",
        "6x normal. Pas de destock global. Revue periodique des SKU lents.",
        kpi,
        "SCN-012",
      ).isCorrect,
    ).toBe(true);
    expect(
      scoreKpiInterpretation(
        "rotationRate",
        "Je maintiens le stock global et je controle les articles lents. Rotation normale.",
        kpi,
        "SCN-012",
      ).isCorrect,
    ).toBe(true);
  });

  it("rejects global liquidation and rien a faire", () => {
    expect(evalKpiDiagnosticShort("SCN-012", "Surstock massif. Liquidation globale.").ok).toBe(false);
    expect(evalKpiDiagnosticShort("SCN-012", "Rotation normale. Rien a faire.").ok).toBe(false);
    expect(
      scoreKpiInterpretation("rotationRate", "6x mauvais. Reduire tout le stock.", kpi, "SCN-012").isCorrect,
    ).toBe(false);
  });

  it("blocks incomplete lecture-only when asking full short helper", () => {
    const r = evalKpiRotationShort("La rotation est normale.");
    expect(r.ok).toBe(false);
    expect(r.missing.length).toBeGreaterThan(0);
    // Step scorer still accepts lecture classification alone
    expect(scoreKpiInterpretation("rotationRate", "La rotation est normale.", kpi, "SCN-012").isCorrect).toBe(
      true,
    );
  });

  it("step scorer feedback matches compliance for same answers", () => {
    const stepOk = scoreKpiInterpretation("diagnostic", DIAG, kpi, "SCN-012").isCorrect;
    const comp = compliance("SCN-012", ROT, SVC, DIAG);
    expect(stepOk).toBe(true);
    expect(comp.allowed).toBe(true);
  });
});

describe("SCN-013 / SCN-014 short contracts", () => {
  it("SCN-013 accepts short quality answer", () => {
    const diag =
      "OTIF 95%, excellent. Erreurs 4%, acceptables mais a surveiller. Action qualite et suivi mensuel.";
    expect(scoreKpiInterpretation("diagnostic", diag, kpi, "SCN-013").isCorrect).toBe(true);
    expect(compliance("SCN-013", ROT, SVC, diag).allowed).toBe(true);
  });

  it("SCN-014 accepts short priority + horizon", () => {
    const diag =
      "Situation stable. Priorite: qualite d execution. Trade-off: maintenir le stock, former l equipe et revoir OTIF/erreurs dans 90 jours.";
    expect(scoreKpiInterpretation("diagnostic", diag, kpi, "SCN-014").isCorrect).toBe(true);
  });
});

describe("Analytics formatting — no duplicated units", () => {
  it("rotation value has no embedded ×", () => {
    const card = M4_PORTFOLIO_ANALYTICS.cards.find((c) => c.id === "rotation")!;
    expect(formatAnalyticsValue(card, "FR")).toBe("6");
    expect(card.unitFr).toContain("×");
  });

  it("capital value has no embedded $", () => {
    const card = M4_PORTFOLIO_ANALYTICS.cards.find((c) => c.id === "capital")!;
    expect(formatAnalyticsValue(card, "FR")).not.toContain("$");
    expect(card.unitFr).toBe("$");
  });

  it("dataset label is canonique", () => {
    expect(M4_PORTFOLIO_ANALYTICS.datasetLabelFr).toContain("canonique");
    expect(M4_PORTFOLIO_ANALYTICS.datasetLabelFr).not.toMatch(/canonic[^a-z]/);
  });
});

describe("Service short missing excellent", () => {
  it("feedback mentions excellent when classification missing", () => {
    const r = evalKpiServiceShort("Le taux de service est mediocre.");
    expect(r.ok).toBe(false);
    expect(r.feedbackFr.toLowerCase()).toMatch(/excellent|faible|insuffisant/);
  });
});
