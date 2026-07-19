/**
 * Slice A — Concept-based pedagogical evaluation tests for SCN-012 … SCN-017.
 * Covers positive / partial / contradictory / adversarial variants.
 */
import { describe, it, expect } from "vitest";
import {
  calculateKpis,
  scoreKpiInterpretation,
  validateM4Compliance,
  CANONICAL_M4_KPI_DATA,
  evaluateM4DiagnosticConcepts,
  evaluateM4DiagnosticLegacyShadow,
  scoreM5Decision,
  scoreM5StrategicDecision,
} from "./rulesEngine";
import { SCN014_DIAGNOSTIC_FIXTURE } from "../shared/m4CanonicalResponses";
import {
  assessAnalyticalCoherence,
  hasQ0VsReplenishmentContradiction,
  normalizePedagogicalText,
} from "../shared/pedagogicalConceptEval";

const kpiResult = calculateKpis(CANONICAL_M4_KPI_DATA);
const completedSteps = ["KPI_DATA", "KPI_ROTATION", "KPI_SERVICE", "KPI_DIAGNOSTIC"];

function m4Compliance(scn: string, rotation: string, service: string, diagnostic: string) {
  return validateM4Compliance({
    scnCode: scn,
    completedSteps,
    kpiInterpretations: [
      {
        kpiKey: "rotationRate",
        studentAnswer: rotation,
        isCorrect: scoreKpiInterpretation("rotationRate", rotation, kpiResult).isCorrect,
      },
      {
        kpiKey: "serviceLevel",
        studentAnswer: service,
        isCorrect: scoreKpiInterpretation("serviceLevel", service, kpiResult).isCorrect,
      },
      {
        kpiKey: "diagnostic",
        studentAnswer: diagnostic,
        isCorrect: scoreKpiInterpretation("diagnostic", diagnostic, kpiResult).isCorrect,
      },
    ],
    kpiResult,
  });
}

describe("Slice A — normalizePedagogicalText", () => {
  it("strips accents and normalizes apostrophes", () => {
    expect(normalizePedagogicalText("Équilibrée — c’est très bon")).toContain("equilibree");
    expect(normalizePedagogicalText("Équilibrée — c’est très bon")).toContain("tres bon");
  });
});

describe("SCN-012 — concept evaluation", () => {
  const rotOk = "La rotation de 6x est normale";
  const svcOk = "Service excellent";

  it("positive: short correct paraphrase (no literal SKU / 48000)", () => {
    const diag =
      "La rotation est normale. Je recommande de maintenir le stock et de surveiller les articles qui tournent lentement.";
    expect(m4Compliance("SCN-012", rotOk, svcOk, diag).allowed).toBe(true);
  });

  it("positive: July official guide example A — « Je maintiens » conjugaison", () => {
    const diag =
      "La rotation est normale. Je maintiens la politique et je surveille les articles qui tournent lentement.";
    expect(scoreKpiInterpretation("rotationRate", "La rotation est normale.", kpiResult).isCorrect).toBe(true);
    expect(scoreKpiInterpretation("serviceLevel", "OTIF excellent a 95%.", kpiResult).isCorrect).toBe(true);
    expect(scoreKpiInterpretation("diagnostic", diag, kpiResult).isCorrect).toBe(true);
    expect(m4Compliance("SCN-012", "La rotation est normale.", "OTIF excellent a 95%.", diag).allowed).toBe(true);
  });

  it("positive: July official guide example B — conserver/contrôle without magic words", () => {
    const diag =
      "Resultat equilibre : conserver le niveau global avec un controle regulier des produits.";
    expect(scoreKpiInterpretation("diagnostic", diag, kpiResult).isCorrect).toBe(true);
    expect(
      m4Compliance("SCN-012", "Resultat equilibre dans la bande 4-12.", "Service excellent.", diag).allowed,
    ).toBe(true);
  });

  it("positive: synonym / no accents / different order", () => {
    const diag =
      "Il faut conserver la politique actuelle avec un controle regulier des produits. Le resultat est equilibre.";
    expect(m4Compliance("SCN-012", "Resultat equilibre dans la bande", svcOk, diag).allowed).toBe(true);
  });

  it("positive: longer correct response", () => {
    const diag =
      "Je recommande de maintenir la politique stock actuelle avec surveillance des references a faible rotation. Decision: monitor sans destock global. Action: revue mensuelle.";
    expect(m4Compliance("SCN-012", "Rotation normale et equilibree a 6x", svcOk, diag).allowed).toBe(true);
  });

  it("partial: classification without action fails compliance", () => {
    const diag = "Tout est excellent et parfait, rien a faire maintenant.";
    expect(m4Compliance("SCN-012", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("partial: monitoring without maintain stance fails", () => {
    const diag = "Je recommande uniquement de surveiller un peu les articles. Action de suivi.";
    // missing maintain/conserve — should fail
    expect(m4Compliance("SCN-012", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("contradiction: 6x classified as surstock", () => {
    expect(m4Compliance("SCN-012", "Situation de surstock importante", svcOk, "Je recommande de maintenir et surveiller.").allowed).toBe(
      false,
    );
  });

  it("contradiction: global liquidation", () => {
    const diag = "Je recommande une liquidation et un destock global immediat. Action urgente.";
    expect(m4Compliance("SCN-012", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("adversarial: keyword stuffing with contradictions", () => {
    const diag =
      "normal equilibre excellent surstock destock liquidation maintenir surveiller sku otif rotation service erreur 48000 recommandation action strategie decision rien a faire";
    expect(m4Compliance("SCN-012", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("adversarial: negation of normal", () => {
    expect(scoreKpiInterpretation("rotationRate", "Ce n'est pas normal, c'est un surstock", kpiResult).isCorrect).toBe(
      false,
    );
  });

  it("adversarial: empty / generic", () => {
    expect(m4Compliance("SCN-012", rotOk, svcOk, "ok").allowed).toBe(false);
  });

  it("shadow: short paraphrase may fail legacy length/stems but pass concept path", () => {
    const diag =
      "La rotation est normale. Je recommande de maintenir le stock et de surveiller les articles qui tournent lentement.";
    const legacy = evaluateM4DiagnosticLegacyShadow("SCN-012", diag, kpiResult);
    const concept = evaluateM4DiagnosticConcepts("SCN-012", diag, kpiResult);
    expect(concept.competenceComplete).toBe(true);
    // Legacy often required explicit sku/politique stems or longer text — document delta
    expect(typeof legacy.allowed).toBe("boolean");
  });
});

describe("SCN-013 — concept evaluation", () => {
  const rotOk = "Rotation normale";
  const svcOk = "Taux de service excellent a 95%";

  it("positive: short quality plan without corporate essay", () => {
    const diag =
      "OTIF 95% est excellent. Les erreurs 4% restent acceptables mais a ameliorer. Je recommande une formation picking et un suivi hebdomadaire avant le SLA.";
    expect(m4Compliance("SCN-013", rotOk, svcOk, diag).allowed).toBe(true);
  });

  it("positive: checklist + audit synonyms, missing accents", () => {
    const diag =
      "Service excellent. Erreurs acceptables a surveiller. Action: checklist reception et audit processus. Revue sous 90 jours.";
    expect(m4Compliance("SCN-013", rotOk, "Service tres bon optimal", diag).allowed).toBe(true);
  });

  it("partial: excellent OTIF without quality action fails", () => {
    const diag =
      "Service excellent et erreurs mentionnees. Je recommande seulement de regarder le dashboard. Horizon 90 jours.";
    expect(m4Compliance("SCN-013", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("contradiction: OTIF 95% called weak", () => {
    expect(
      m4Compliance(
        "SCN-013",
        rotOk,
        "Le service est faible et insuffisant",
        "Formation picking et suivi 90 jours pour les erreurs.",
      ).allowed,
    ).toBe(false);
  });

  it("contradiction: destock as main action", () => {
    const diag = "Je recommande un destock global urgent. Horizon 90 jours.";
    expect(m4Compliance("SCN-013", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("adversarial: copied question / generic", () => {
    expect(m4Compliance("SCN-013", rotOk, svcOk, "Analysez si ce niveau est excellent").allowed).toBe(false);
  });

  it("rejects comma-separated keyword-only list (Guardian stuffing)", () => {
    const diag = "Formation, checklist, OTIF, erreur, SLA.";
    expect(assessAnalyticalCoherence(diag).coherent).toBe(false);
    expect(m4Compliance("SCN-013", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("rejects space-separated noun-only list", () => {
    const diag = "OTIF erreur qualité formation";
    expect(assessAnalyticalCoherence(diag).coherent).toBe(false);
    expect(m4Compliance("SCN-013", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("rejects short comma label stuffing", () => {
    const diag = "Excellent, acceptable, suivi.";
    expect(assessAnalyticalCoherence(diag).coherent).toBe(false);
  });

  it("accepts simple coherent non-native French", () => {
    const diag =
      "Service bon, erreurs encore a ameliorer; il faut revoir le picking. Formation et suivi avant le SLA.";
    expect(assessAnalyticalCoherence(diag).coherent).toBe(true);
    expect(m4Compliance("SCN-013", rotOk, svcOk, diag).allowed).toBe(true);
  });

  it("accepts concise complete answer with relationship", () => {
    const diag =
      "L'OTIF est excellent mais les erreurs doivent diminuer. Je recommande une formation et un suivi avant le SLA.";
    expect(assessAnalyticalCoherence(diag).coherent).toBe(true);
    expect(m4Compliance("SCN-013", rotOk, svcOk, diag).allowed).toBe(true);
  });

  it("rejects long keyword stuffing paragraph without stance", () => {
    const diag =
      "Formation checklist OTIF erreur SLA audit processus reception picking qualite service excellent acceptable suivi hebdomadaire revue horizon destock liquidation capital immobilise rotation.";
    expect(assessAnalyticalCoherence(diag).coherent).toBe(false);
    expect(m4Compliance("SCN-013", rotOk, svcOk, diag).allowed).toBe(false);
  });
});

describe("SCN-014 — concept evaluation", () => {
  const rotOk = "Rotation normale";
  const svcOk = "Service excellent";

  it("positive: concise capstone with trade-off and horizon (no 150-char gate)", () => {
    const diag =
      "Situation globalement stable. Priorite: qualite d'execution. On reporte le destock pour proteger le service. Revue a 90 jours.";
    expect(m4Compliance("SCN-014", rotOk, svcOk, diag).allowed).toBe(true);
  });

  it("positive: canonical fixture still passes", () => {
    expect(m4Compliance("SCN-014", rotOk, svcOk, SCN014_DIAGNOSTIC_FIXTURE).allowed).toBe(true);
  });

  it("positive: verb prioriser with trade-off and horizon (prod smoke recovery)", () => {
    const diag =
      "Les indicateurs sont globalement stables. Je recommande de prioriser la qualité afin de protéger le service. L'optimisation générale du stock sera reportée et la décision sera réévaluée dans 90 jours.";
    expect(m4Compliance("SCN-014", rotOk, svcOk, diag).allowed).toBe(true);
  });

  it("positive: noun priorité form remains accepted", () => {
    const diag =
      "Les indicateurs sont stables. Notre priorité est la qualité. Le projet de réduction générale du stock est reporté afin de protéger le service. Révision dans 90 jours.";
    expect(m4Compliance("SCN-014", rotOk, svcOk, diag).allowed).toBe(true);
  });

  it("positive: adjective prioritaire with trade-off and horizon", () => {
    const diag =
      "Situation globalement stable. La qualité est prioritaire. Le stock global sera maintenu pour protéger le service et la décision sera revue dans 90 jours.";
    expect(m4Compliance("SCN-014", rotOk, svcOk, diag).allowed).toBe(true);
  });

  it("partial: prioriser without trade-off fails", () => {
    const diag = "Je recommande de prioriser la qualité. Révision dans 90 jours.";
    expect(m4Compliance("SCN-014", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("partial: prioriser without horizon fails", () => {
    const diag =
      "Je recommande de prioriser la qualité et de reporter la réduction du stock afin de protéger le service.";
    expect(m4Compliance("SCN-014", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("partial: generic wording without selected priority", () => {
    const diag =
      "Les indicateurs sont stables. Il faut améliorer les opérations dans 90 jours.";
    expect(m4Compliance("SCN-014", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("adversarial: keyword stuffing priority list rejected", () => {
    const diag = "Priorité, compromis, horizon, S&OP, qualité.";
    expect(m4Compliance("SCN-014", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("partial: priority without trade-off fails", () => {
    const diag = "Situation stable. Priorite formation. Je recommande d'agir vite sur 90 jours.";
    expect(m4Compliance("SCN-014", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("contradiction: no action", () => {
    const diag = "Tout est parfait, aucune action ni arbitrage n'est necessaire pour le trimestre.";
    expect(m4Compliance("SCN-014", rotOk, svcOk, diag).allowed).toBe(false);
  });

  it("adversarial: mono-KPI without arbitration", () => {
    const diag = "Je recommande une action sur la rotation uniquement avec decision rapide.";
    expect(m4Compliance("SCN-014", rotOk, svcOk, diag).allowed).toBe(false);
  });
});

describe("SCN-015 — tactical nominal decision", () => {
  const kpi = { rotationRate: 5.2, serviceLevel: 0.96, errorRate: 0.02 };

  it("positive: Q=0 / nominal short decision scores well without inventing problems", () => {
    const result = scoreM5Decision(
      "Cycle nominal et conforme. Stock au-dessus du minimum: Q=0, pas de reapprovisionnement requis. KPI du run stables.",
      kpi,
      { decisionLevel: "TACTICAL" },
    );
    expect(result.rejected).toBe(false);
    expect(result.score).toBeGreaterThanOrEqual(35);
  });

  it("positive: simple French synonyms", () => {
    const result = scoreM5Decision(
      "Operations conformes. Aucun reappro: stock suffisant. Rotation et service du snapshot ok.",
      kpi,
    );
    expect(result.score).toBeGreaterThanOrEqual(30);
  });

  it("partial: empty generic is low", () => {
    expect(scoreM5Decision("Je ne sais pas.", kpi).score).toBeLessThan(20);
  });

  it("adversarial: keyword stuffing capped", () => {
    const stuffed =
      "rotation service erreur stock reapprovisionnement formation procedure ameliorer nominal Q=0 aucune action destock liquidation";
    const result = scoreM5Decision(stuffed, kpi);
    expect(result.score).toBeLessThanOrEqual(25);
  });

  it("positive: Q=0 correct without replenishment", () => {
    const result = scoreM5Decision("Le stock est suffisant, donc Q = 0.", kpi);
    expect(result.rejected).toBe(false);
    expect(result.score).toBeGreaterThanOrEqual(35);
  });

  it("contradiction: sufficient stock + positive replenishment", () => {
    const result = scoreM5Decision(
      "Le stock est suffisant, mais je recommande de commander 100 unités.",
      kpi,
    );
    expect(hasQ0VsReplenishmentContradiction(
      "Le stock est suffisant, mais je recommande de commander 100 unités.",
    )).toBe(true);
    expect(result.rejected).toBe(true);
    expect(result.score).toBeLessThanOrEqual(10);
  });

  it("positive: no replenishment needed", () => {
    const result = scoreM5Decision("Aucun réapprovisionnement n'est nécessaire.", kpi);
    expect(result.rejected).toBe(false);
    expect(result.score).toBeGreaterThanOrEqual(30);
  });

  it("positive: ne pas commander with sufficient stock", () => {
    const result = scoreM5Decision("Le stock est suffisant; ne pas commander.", kpi);
    expect(hasQ0VsReplenishmentContradiction("Le stock est suffisant; ne pas commander.")).toBe(false);
    expect(result.rejected).toBe(false);
    expect(result.score).toBeGreaterThanOrEqual(30);
  });

  it("ambiguous: mentions replenishment concept without recommending it", () => {
    const text =
      "Le stock est suffisant, donc Q = 0. Surveiller seulement le prochain cycle de réapprovisionnement.";
    expect(hasQ0VsReplenishmentContradiction(text)).toBe(false);
    const result = scoreM5Decision(text, kpi);
    expect(result.rejected).toBe(false);
    expect(result.score).toBeGreaterThanOrEqual(35);
  });
});

describe("SCN-016 — variance-aware tactical decision", () => {
  const kpi = { rotationRate: 4.8, serviceLevel: 0.94, errorRate: 0.03 };

  it("positive: reconcile then decide from corrected stock", () => {
    const result = scoreM5Decision(
      "Ecart corrige via ajustement. Apres reconciliation, stock corrige au-dessus du min: pas de reappro. Prevention: double controle reception.",
      kpi,
    );
    expect(result.score).toBeGreaterThanOrEqual(40);
    expect(result.feedback).toMatch(/cart|reconcil|corrig/i);
  });

  it("contradiction note: decision without variance awareness still can score but lower than reconciled", () => {
    const withAdj = scoreM5Decision(
      "Apres correction de l'ecart, stock suffisant, Q=0. Rotation du run ok.",
      kpi,
    );
    const without = scoreM5Decision("Tout est bon, commander du stock tout de suite.", kpi);
    expect(withAdj.score).toBeGreaterThan(without.score);
  });
});

describe("SCN-017 — strategic decision", () => {
  const snapshot = {
    rotationRate: 5.5,
    serviceLevel: 0.97,
    errorRate: 0.025,
    averageLeadTime: 4,
    stockImmobilizedValue: 12500,
  };

  it("positive: concise 4–6 sentence natural French trade-off", () => {
    const text =
      "Rotation 5,5 et service 97% issus du snapshot. Priorite: securiser le service. On reporte toute baisse de stock pour proteger l'OTIF. Horizon: revue a 90 jours.";
    const result = scoreM5StrategicDecision(text, snapshot);
    expect(result.rejected).toBe(false);
    expect(result.score).toBeGreaterThanOrEqual(50);
  });

  it("contradiction: missing trade-off", () => {
    const text = "Rotation 5,5 et service 97%. Je recommande d'investir. Horizon 90 jours.";
    const result = scoreM5StrategicDecision(text, snapshot);
    expect(result.rejected).toBe(true);
    expect(result.rejectionReason).toBe("MISSING_TRADE_OFF");
  });

  it("contradiction: M4 portfolio paste without snapshot KPIs", () => {
    const text =
      "Rotation 6 et service 95% du module 4 avec 48000$. Trade-off stock/service. Horizon 90 jours. Je recommande.";
    // 6 and 95 may coincidentally match tolerance — use clearly wrong M4-only narrative without snapshot numbers
    const result = scoreM5StrategicDecision(
      "Capital 48000 dollars Annexe A. Trade-off et recommandation. Horizon 90 jours.",
      snapshot,
    );
    expect(result.rejected).toBe(true);
    expect(result.rejectionReason).toBe("INSUFFICIENT_KPI_CITATIONS");
  });

  it("adversarial: operational-level phrasing rejected", () => {
    const result = scoreM5StrategicDecision(
      "Poster la reception puis faire le putaway. Rotation 5,5 service 97. Trade-off. Horizon 90 jours. Je recommande.",
      snapshot,
    );
    expect(result.rejected).toBe(true);
    expect(result.rejectionReason).toBe("OPERATIONAL_LEVEL");
  });
});

describe("Slice A — scoring budgets preserved", () => {
  it("rotation/service awards still use M4_STEP_MAX magnitudes", () => {
    const rot = scoreKpiInterpretation("rotationRate", "normale et equilibree", kpiResult);
    const svc = scoreKpiInterpretation("serviceLevel", "excellent", kpiResult);
    expect(rot.pointsDelta).toBe(20);
    expect(svc.pointsDelta).toBe(20);
  });
});
