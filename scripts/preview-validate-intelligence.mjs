/**
 * Phase B / B.1 preview validation — read-only data checks for intelligence layer.
 * Does NOT modify DB, seed, scoring, or scenario logic.
 */
import { getMissionForScenario, resolveScnCode } from "../server/missionData.ts";
import { EXTENDED_MISSIONS } from "../server/missionDataExtended.ts";
import { COMPETENCY_MAP } from "../client/src/data/competencyMap.ts";
import { getStepErpHint } from "../client/src/data/stepErpMap.ts";
import { M4_KPI_CONTROL_TOWER } from "../client/src/data/m4KpiControlTower.ts";
import { getEvalScoreThreshold } from "../client/src/data/moduleThresholds.ts";

const SCENARIOS = [
  {
    id: "SCN-002",
    scenario: { id: 2, moduleId: 1, name: "Scénario 2 — Réception fantôme (GR non postée)" },
    expectedNextStep: "GR",
    competency: "Problem Identification",
    scoreThreshold: 60,
    checks: {
      ghostGrInBriefing: (m) => /fantôme|ghost|GR-2025-001|non postée/i.test(m.context + m.objective),
      migoInLearning: () => /MIGO/i.test(getStepErpHint("GR").sapTCode + getMissionForScenario({ id: 2, moduleId: 1, name: "Scénario 2 — Réception fantôme" })?.sapEquivalent),
      posterInActions: (m) => m.studentActions.some((a) => /Poster|MIGO/i.test(a)),
      notOnlyGhostInRecovery: (m) => !m.recoveryPaths?.every((p) => /fantôme|ghost/i.test(p)) || (m.studentActions?.length ?? 0) > 2,
    },
  },
  {
    id: "SCN-005",
    scenario: { id: 5, moduleId: 1, name: "Scénario 5 — Non-conformités multiples" },
    expectedNextStep: "GR",
    competency: "Complex Problem-Solving",
    scoreThreshold: 60,
    checks: {
      dualAnomaly: (m) => /GR-2025-004/i.test(m.context) && /SKU-005|−8|écart/i.test(m.context),
      documentsFirst: (m) => /Documents.*Physique.*Expédition/i.test(m.context) || m.studentActions[0]?.includes("GR-2025-004"),
      multiStepRecovery: (m) => (m.recoveryPaths?.[0]?.split("→").length ?? 0) >= 4,
      notOnlyGhost: (m) => m.studentActions.some((a) => /ADJ|Cycle Count|SKU-005/i.test(a)),
    },
  },
  {
    id: "SCN-006",
    scenario: { id: 6, moduleId: 2, name: "M2 — Scénario 1 : Rangement structuré et affectation d'emplacement" },
    expectedNextStep: "PUTAWAY",
    competency: "Structured Putaway",
    scoreThreshold: 60,
    module2Steps: ["GR", "PUTAWAY", "FIFO_PICK", "STOCK_ACCURACY", "COMPLIANCE_ADV"],
    checks: {
      m2Mission: (m) => m?.module?.includes("WM") || m?.module?.includes("entrepôt"),
      putawayLearning: (m) => /putaway|LT01|rangement/i.test((m?.wmsFunction ?? "") + (m?.sapEquivalent ?? "")),
    },
  },
  {
    id: "SCN-012",
    scenario: { id: 12, moduleId: 4, name: "M4 — Scénario 1 : Rotation des stocks" },
    expectedNextStep: "KPI_DATA",
    competency: "Performance Analysis",
    scoreThreshold: 70,
    checks: {
      m4KpiTower: () => !!M4_KPI_CONTROL_TOWER["SCN-012"]?.kpiEvaluated,
      kpiAnalytical: (m) => /KPI|rotation|analytique/i.test(m.context + m.supervisorNotes),
      alternativeActions: (m) => (m.alternativeActions?.length ?? 0) >= 3,
    },
  },
  {
    id: "SCN-014",
    scenario: { id: 14, moduleId: 4, name: "M4 — Scénario 3 : Décision stratégique multi-KPI" },
    expectedNextStep: "KPI_DATA",
    competency: "Strategic Diagnosis",
    scoreThreshold: 70,
    checks: {
      m4KpiTower: () => !!M4_KPI_CONTROL_TOWER["SCN-014"]?.expectedOutput,
      multiKpi: (m) => /multi|trade-off|stratégique/i.test(m.objective + m.context),
      alternativeActions: (m) => (m.alternativeActions?.length ?? 0) >= 3,
    },
  },
];

const ALT_ACTION_SCNS = [
  "SCN-007", "SCN-008", "SCN-010", "SCN-011",
  "SCN-012", "SCN-013", "SCN-014", "SCN-015", "SCN-016", "SCN-017",
];

function assert(name, ok, detail = "") {
  return { name, ok, detail };
}

const results = [];

for (const scn of SCENARIOS) {
  const mission = getMissionForScenario(scn.scenario);
  const code = resolveScnCode(scn.scenario);
  const comp = COMPETENCY_MAP[scn.id];
  const row = { scn: scn.id, code, missionFound: !!mission, checks: [] };

  row.checks.push(assert("resolveScnCode", code === scn.id, `got ${code}`));
  row.checks.push(assert("mission loaded", !!mission));
  row.checks.push(
    assert(
      "competency panel",
      comp?.primaryCompetency.en === scn.competency,
      comp?.primaryCompetency.en
    )
  );
  row.checks.push(
    assert(
      "competency enrichment fields",
      !!(comp?.warehouseRole && comp?.progression && comp?.erpMaturity && comp?.wmsMaturity),
      "warehouseRole/progression/maturity"
    )
  );
  row.checks.push(
    assert(
      "score threshold display",
      getEvalScoreThreshold(scn.scenario.moduleId) === scn.scoreThreshold,
      `expected ${scn.scoreThreshold}`
    )
  );

  if (mission) {
    for (const [key, fn] of Object.entries(scn.checks)) {
      row.checks.push(assert(key, fn(mission)));
    }
    if (scn.id === "SCN-002") {
      const grHint = getStepErpHint("GR");
      row.checks.push(assert("GR tCode MIGO", grHint.sapTCode === "MIGO"));
      row.checks.push(assert("demoGuidance mentions Poster", /Poster|MIGO/i.test(mission.demoGuidance ?? "")));
    }
    if (scn.id === "SCN-006" && scn.module2Steps) {
      row.checks.push(assert("M2 step pipeline documented in supervisorNotes", /GR.*PUTAWAY/i.test(mission.supervisorNotes)));
    }
  }

  results.push(row);
}

const altActionResults = ALT_ACTION_SCNS.map((id) => {
  const mission = EXTENDED_MISSIONS[id];
  const count = mission?.alternativeActions?.length ?? 0;
  return {
    scn: id,
    alternativeActionsCount: count,
    checks: [assert("alternativeActions >= 3", count >= 3, `got ${count}`)],
  };
});

console.log(
  JSON.stringify(
    {
      validation: results,
      alternativeActions: altActionResults,
      allPass:
        results.every((r) => r.checks.every((c) => c.ok)) &&
        altActionResults.every((r) => r.checks.every((c) => c.ok)),
    },
    null,
    2
  )
);
