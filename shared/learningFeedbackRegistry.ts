import type { Bilingual, LearningFeedbackScenario, LearningFeedbackStep } from "./learningFeedbackTypes";

const ANNEXE_A_BANDS = [
  {
    kpiKey: "rotation",
    value: "6×",
    status: "normal" as const,
    formulaHint: {
      fr: "Rotation = consommation annuelle ÷ stock moyen → 2400 ÷ 400 = 6×",
      en: "Turnover = annual consumption ÷ average stock → 2400 ÷ 400 = 6×",
    },
  },
  {
    kpiKey: "service",
    value: "95,0 %",
    status: "excellent" as const,
    formulaHint: {
      fr: "Service = commandes honorées ÷ total → 285 ÷ 300 = 95,0 %",
      en: "Service level = orders fulfilled ÷ total → 285 ÷ 300 = 95.0%",
    },
  },
  {
    kpiKey: "errors",
    value: "4,0 %",
    status: "acceptable" as const,
    formulaHint: {
      fr: "Erreurs = erreurs opérationnelles ÷ opérations → 12 ÷ 300 = 4,0 %",
      en: "Error rate = operational errors ÷ operations → 12 ÷ 300 = 4.0%",
    },
  },
  {
    kpiKey: "leadTime",
    value: "3,5 j",
    status: "normal" as const,
    formulaHint: {
      fr: "Délai moyen fournisseur → 3,5 jours (bande normale 3–7 j)",
      en: "Average supplier lead time → 3.5 days (normal band 3–7 d)",
    },
  },
  {
    kpiKey: "capital",
    value: "48 000 $",
    status: "neutral" as const,
    formulaHint: {
      fr: "Capital immobilisé = stock moyen × coût unitaire",
      en: "Immobilized capital = average stock × unit cost",
    },
  },
];

function m4ComplianceStep(): LearningFeedbackStep {
  return {
    stepCode: "COMPLIANCE_M4",
    label: { fr: "Conformité M4", en: "M4 Compliance" },
    kpiInterpretation: {
      lens: {
        fr: "Porte intégrateur — toutes les interprétations doivent être cohérentes avant clôture.",
        en: "Integrator gate — all interpretations must be coherent before closing.",
      },
      bands: ANNEXE_A_BANDS,
    },
    expectedReasoning: {
      chain: [
        { fr: "Vérifier que chaque étape KPI est complétée.", en: "Verify each KPI step is completed." },
        { fr: "Confirmer la cohérence diagnostic ↔ interprétations.", en: "Confirm diagnostic ↔ interpretations coherence." },
      ],
      traps: [
        { fr: "Soumettre la conformité avant le diagnostic.", en: "Submitting compliance before diagnostic." },
      ],
      erpAnchor: { fr: "SAP MC$4 — validation analytique", en: "SAP MC$4 — analytical validation" },
    },
    canonicalAnswer: {
      short: { fr: "Conformité M4 — interprétations validées", en: "M4 compliance — interpretations validated" },
      full: {
        fr: "Toutes les interprétations KPI sont cohérentes avec le diagnostic. La simulation analytique M4 peut être clôturée.",
        en: "All KPI interpretations are coherent with the diagnostic. The M4 analytical simulation can be closed.",
      },
      keywords: ["conformité", "cohérent", "diagnostic"],
      whyCorrect: [
        { fr: "Respecte la séquence M4 sans transaction WMS.", en: "Respects M4 sequence without WMS transactions." },
      ],
    },
  };
}

function m4ErrorsPedagogical(): LearningFeedbackStep {
  return {
    stepCode: "KPI_ERRORS",
    label: { fr: "Taux d'erreurs (pédagogique)", en: "Error rate (pedagogical)" },
    pedagogicalOnly: true,
    kpiInterpretation: {
      lens: {
        fr: "Erreurs 4 % — bande acceptable (1–5 %) mais levier d'exécution prioritaire.",
        en: "Errors 4% — acceptable band (1–5%) but execution lever is priority.",
      },
      bands: [
        {
          kpiKey: "errors",
          value: "4,0 %",
          status: "acceptable",
          formulaHint: { fr: "12 ÷ 300 = 4,0 %", en: "12 ÷ 300 = 4.0%" },
        },
      ],
    },
    expectedReasoning: {
      chain: [
        { fr: "Classifier 4 % comme acceptable, pas excellent (< 2 %).", en: "Classify 4% as acceptable, not excellent (< 2%)." },
        { fr: "Corréler picking/réception au risque OTIF.", en: "Correlate picking/receiving to OTIF risk." },
      ],
      traps: [
        { fr: "Ignorer les erreurs car le tableau est vert.", en: "Ignoring errors because the dashboard is green." },
      ],
      bloom: "Evaluate",
    },
    canonicalAnswer: {
      short: {
        fr: "Erreurs 4 % acceptables — corriger picking/réception avant J-90",
        en: "Errors 4% acceptable — fix picking/receiving before D-90",
      },
      full: {
        fr: "Le taux d'erreur opérationnelle est de 12 sur 300 opérations, soit 4,0 %. Le moteur le classe acceptable (seuil critique > 5 %). En contexte J-90, ce n'est pas un signal rouge, mais une exécution amber : erreurs de prélèvement et de réception peuvent dégrader OTIF malgré le 95 % actuel.",
        en: "The operational error rate is 12 errors out of 300 operations, or 4.0%. The engine classifies this as acceptable (critical threshold > 5%). In a D-90 context, this is not a red signal, but amber execution: picking and receiving errors can degrade OTIF despite the current 95%.",
      },
      keywords: ["acceptable", "picking", "réception", "OTIF", "4%"],
      whyCorrect: [
        { fr: "Correspond à errorRateStatus = acceptable dans le moteur.", en: "Matches errorRateStatus = acceptable in the engine." },
      ],
    },
    commonMistakes: [
      { fr: "Classer 4 % comme excellent ou critique.", en: "Classifying 4% as excellent or critical." },
      { fr: "Mentionner les erreurs sans picking/réception/OTIF.", en: "Mentioning errors without picking/receiving/OTIF." },
    ],
  };
}

const SCN_012: LearningFeedbackScenario = {
  scnCode: "SCN-012",
  moduleId: 4,
  title: { fr: "Rotation & capital", en: "Turnover & capital" },
  lens: { fr: "Revue CFO — working capital 48 000 $", en: "CFO review — $48k working capital" },
  scenarioMistakes: [
    { fr: "Déclarer surstock à 6× (bande normale 4–12×).", en: "Declaring overstock at 6× (normal band 4–12×)." },
    { fr: "Conclure « rien à faire » sans surveillance SKU.", en: "Concluding « nothing to do » without SKU monitoring." },
    { fr: "Recommander un destock global injustifié.", en: "Recommending unjustified global destock." },
  ],
  steps: [
    {
      stepCode: "KPI_DATA",
      label: { fr: "Données KPI", en: "KPI Data" },
      kpiInterpretation: {
        lens: { fr: "Bundle Annexe A — mode analytique, aucune transaction WMS.", en: "Annexe A bundle — analytical mode, no WMS transactions." },
        bands: ANNEXE_A_BANDS,
      },
      expectedReasoning: {
        chain: [
          { fr: "Confirmer le mode analytique M4.", en: "Confirm M4 analytical mode." },
          { fr: "Retenir rotation 6×, capital 48 000 $, OTIF 95 %, erreurs 4 %.", en: "Retain 6× turnover, $48k capital, 95% OTIF, 4% errors." },
        ],
        traps: [{ fr: "Supposer que le moniteur vide est un bug.", en: "Assuming empty monitor is a bug." }],
        erpAnchor: { fr: "SAP MC$4 / CO-PA — tour de contrôle KPI", en: "SAP MC$4 / CO-PA — KPI control tower" },
      },
      canonicalAnswer: {
        short: { fr: "6× · 95 % · 4 % · 3,5 j · 48 000 $", en: "6× · 95% · 4% · 3.5 d · $48,000" },
        full: {
          fr: "Briefing tour de contrôle validé. Contrat Annexe A : rotation 6×, OTIF 95,0 %, erreurs 4,0 %, délai 3,5 j, capital 48 000 $. Contexte CFO : revue politique stock.",
          en: "Control tower briefing validated. Annexe A contract: 6× turnover, 95.0% OTIF, 4.0% errors, 3.5 d lead time, $48,000 capital. CFO context: stock policy review.",
        },
        keywords: ["6×", "95%", "48 000", "rotation", "capital"],
        whyCorrect: [{ fr: "Aligne sur CANONICAL_M4_KPI_DATA.", en: "Aligns with CANONICAL_M4_KPI_DATA." }],
      },
    },
    {
      stepCode: "KPI_ROTATION",
      label: { fr: "Taux de rotation", en: "Turnover rate" },
      kpiInterpretation: {
        lens: { fr: "6× = bande normale (4–12×) — pas de surstock.", en: "6× = normal band (4–12×) — not overstock." },
        bands: [ANNEXE_A_BANDS[0]],
      },
      expectedReasoning: {
        chain: [
          { fr: "Appliquer la formule rotation = consommation ÷ stock moyen.", en: "Apply turnover = consumption ÷ average stock." },
          { fr: "Classifier 6× dans la bande normale.", en: "Classify 6× in the normal band." },
          { fr: "Éviter le réflexe destock à 6×.", en: "Avoid destock reflex at 6×." },
        ],
        traps: [{ fr: "Déclarer surstock à rotation normale.", en: "Declaring overstock at normal turnover." }],
        bloom: "Evaluate",
      },
      canonicalAnswer: {
        short: { fr: "6× bande normale — pas de surstock", en: "6× normal band — no overstock" },
        full: {
          fr: "La rotation est de 6× (2400 ÷ 400), classée normale dans la bande 4–12×. Le capital immobilisé de 48 000 $ est cohérent avec cette rotation — pas de surstock global à déclarer.",
          en: "Turnover is 6× (2400 ÷ 400), classified as normal in the 4–12× band. The $48,000 immobilized capital is consistent with this turnover — no global overstock to declare.",
        },
        keywords: ["normal", "6×", "bande", "rotation"],
        whyCorrect: [{ fr: "rotationStatus = normal dans le moteur.", en: "rotationStatus = normal in the engine." }],
      },
      commonMistakes: [
        { fr: "Classifier 6× comme surstock.", en: "Classifying 6× as overstock." },
        { fr: "Oublier la formule consommation ÷ stock.", en: "Forgetting consumption ÷ stock formula." },
      ],
    },
    {
      stepCode: "KPI_SERVICE",
      label: { fr: "Taux de service", en: "Service level" },
      kpiInterpretation: {
        lens: { fr: "OTIF 95 % excellent — contexte pour politique stock.", en: "95% OTIF excellent — context for stock policy." },
        bands: [ANNEXE_A_BANDS[1], ANNEXE_A_BANDS[2]],
      },
      expectedReasoning: {
        chain: [
          { fr: "Reconnaître OTIF 95 % comme excellent (≥ 95 %).", en: "Recognize 95% OTIF as excellent (≥ 95%)." },
          { fr: "Contextualiser erreurs 4 % acceptables.", en: "Contextualize 4% acceptable errors." },
        ],
        traps: [{ fr: "Diagnostiquer un service faible à 95 %.", en: "Diagnosing low service at 95%." }],
      },
      canonicalAnswer: {
        short: { fr: "OTIF excellent · erreurs acceptables en contexte", en: "Excellent OTIF · acceptable errors in context" },
        full: {
          fr: "Le taux de service OTIF est de 285/300, soit 95,0 % — niveau excellent. Les erreurs à 4 % sont acceptables et servent de contexte pour la politique stock, pas de levier destock primaire.",
          en: "OTIF service level is 285/300, or 95.0% — excellent level. Errors at 4% are acceptable and provide context for stock policy, not a primary destock lever.",
        },
        keywords: ["excellent", "95%", "acceptable"],
        whyCorrect: [{ fr: "serviceLevelStatus = excellent.", en: "serviceLevelStatus = excellent." }],
      },
    },
    {
      stepCode: "KPI_DIAGNOSTIC",
      label: { fr: "Diagnostic", en: "Diagnostic" },
      kpiInterpretation: {
        lens: { fr: "Capital 48 000 $ + rotation normale — recommander maintien + surveillance SKU.", en: "$48k capital + normal turnover — recommend maintain + SKU monitoring." },
        bands: ANNEXE_A_BANDS,
      },
      expectedReasoning: {
        chain: [
          { fr: "Synthétiser rotation normale + capital immobilisé.", en: "Synthesize normal turnover + immobilized capital." },
          { fr: "Recommander maintien + surveillance SKU ciblée.", en: "Recommend maintain + targeted SKU monitoring." },
          { fr: "Éviter destock global injustifié.", en: "Avoid unjustified global destock." },
        ],
        traps: [{ fr: "Destock global comme levier principal.", en: "Global destock as primary lever." }],
        bloom: "Create",
        erpAnchor: { fr: "SAP MC$4 — recommandation comité finance", en: "SAP MC$4 — finance committee recommendation" },
      },
      canonicalAnswer: {
        short: { fr: "Maintien + surveillance SKU — pas destock global", en: "Maintain + SKU monitoring — no global destock" },
        full: {
          fr: "Rotation 6× normale, capital 48 000 $ justifié pour le portefeuille actuel. Je recommande une politique de maintien avec surveillance SKU ciblée (revue trimestrielle des références à faible rotation) plutôt qu'un destock global coûteux et inutile.",
          en: "6× normal turnover, $48,000 capital justified for current portfolio. I recommend a maintain policy with targeted SKU monitoring (quarterly review of low-turnover SKUs) rather than costly, unnecessary global destock.",
        },
        keywords: ["maintien", "surveillance", "SKU", "recommand"],
        whyCorrect: [
          { fr: "Répond à l'objectif CFO sans sur-réaction.", en: "Addresses CFO objective without over-reaction." },
          { fr: "Évite le piège surstock à 6×.", en: "Avoids overstock trap at 6×." },
        ],
      },
      commonMistakes: [
        { fr: "Diagnostic trop court (< 50 car.).", en: "Diagnostic too short (< 50 chars)." },
        { fr: "Destock global sans justification.", en: "Global destock without justification." },
      ],
    },
    m4ComplianceStep(),
  ],
};

const SCN_013: LearningFeedbackScenario = {
  scnCode: "SCN-013",
  moduleId: 4,
  title: { fr: "Service & erreurs J-90", en: "Service & errors D-90" },
  lens: { fr: "Piège tableau vert — renouvellement SLA J-90", en: "Green dashboard trap — D-90 SLA renewal" },
  scenarioMistakes: [
    { fr: "Diagnostiquer un « faible service » à 95 %.", en: "Diagnosing « low service » at 95%." },
    { fr: "Complaisance — « tout va bien » sans plan exécution.", en: "Complacency — « all good » without execution plan." },
    { fr: "Destock comme levier principal.", en: "Destock as primary lever." },
    { fr: "Plan sans cible % ni horizon 90 jours.", en: "Plan without % target or 90-day horizon." },
  ],
  steps: [
    {
      stepCode: "KPI_DATA",
      label: { fr: "Données KPI", en: "KPI Data" },
      kpiInterpretation: {
        lens: { fr: "Setup piège tableau vert — OTIF 95 % + erreurs 4 %.", en: "Green dashboard trap setup — 95% OTIF + 4% errors." },
        bands: ANNEXE_A_BANDS,
      },
      expectedReasoning: {
        chain: [
          { fr: "Cadrer la revue SLA J-90.", en: "Frame D-90 SLA review." },
          { fr: "Retenir OTIF 285/300 et erreurs 12/300.", en: "Retain OTIF 285/300 and errors 12/300." },
        ],
        traps: [{ fr: "Ignorer le contexte J-90.", en: "Ignoring D-90 context." }],
      },
      canonicalAnswer: {
        short: { fr: "OTIF 285/300 · erreurs 12/300 · rotation 6×", en: "OTIF 285/300 · errors 12/300 · 6× turnover" },
        full: {
          fr: "Briefing validé. OTIF 95,0 % (excellent au seuil), erreurs 4,0 % (acceptables), rotation 6× normale. Contexte : renouvellement SLA J-90 — tableau vert à analyser.",
          en: "Briefing validated. 95.0% OTIF (excellent at threshold), 4.0% errors (acceptable), 6× normal turnover. Context: D-90 SLA renewal — green dashboard to analyze.",
        },
        keywords: ["285", "300", "J-90", "OTIF"],
        whyCorrect: [{ fr: "Établit les deux KPI headline du piège vert.", en: "Establishes both headline KPIs of green trap." }],
      },
    },
    {
      stepCode: "KPI_ROTATION",
      label: { fr: "Taux de rotation", en: "Turnover rate" },
      kpiInterpretation: {
        lens: { fr: "6× normale — contexte portefeuille seulement.", en: "6× normal — portfolio context only." },
        bands: [ANNEXE_A_BANDS[0]],
      },
      expectedReasoning: {
        chain: [
          { fr: "Classifier 6× normale.", en: "Classify 6× as normal." },
          { fr: "Ne pas bloquer la conformité avec surstock.", en: "Do not block compliance with overstock misclassification." },
        ],
        traps: [{ fr: "Surstock comme angle principal SCN-013.", en: "Overstock as main SCN-013 angle." }],
      },
      canonicalAnswer: {
        short: { fr: "6× normale — contexte seulement", en: "6× normal — context only" },
        full: {
          fr: "Rotation 6× — bande normale. Contexte portefeuille stable ; le risque prioritaire SCN-013 est l'exécution (erreurs), pas le stock.",
          en: "6× turnover — normal band. Stable portfolio context; SCN-013 priority risk is execution (errors), not stock.",
        },
        keywords: ["normal", "6×", "contexte"],
        whyCorrect: [{ fr: "Rotation non bloquante pour SCN-013.", en: "Turnover not blocking for SCN-013." }],
      },
    },
    {
      stepCode: "KPI_SERVICE",
      label: { fr: "Taux de service et erreurs", en: "Service level and errors" },
      kpiInterpretation: {
        lens: { fr: "95 % excellent + 4 % acceptable — analyse duale requise.", en: "95% excellent + 4% acceptable — dual analysis required." },
        bands: [ANNEXE_A_BANDS[1], ANNEXE_A_BANDS[2]],
      },
      expectedReasoning: {
        chain: [
          { fr: "Reconnaître OTIF 95 % comme excellent (≥ 95 %).", en: "Recognize 95% OTIF as excellent (≥ 95%)." },
          { fr: "Classifier erreurs 4 % comme acceptables (1–5 %).", en: "Classify 4% errors as acceptable (1–5%)." },
          { fr: "Corréler picking/réception → fragilité OTIF.", en: "Correlate picking/receiving → OTIF fragility." },
        ],
        traps: [{ fr: "Tableau vert ≠ exécution sans risque.", en: "Green dashboard ≠ risk-free execution." }],
        bloom: "Evaluate",
        erpAnchor: { fr: "SAP VL06O + QM — OTIF et erreurs", en: "SAP VL06O + QM — OTIF and errors" },
      },
      canonicalAnswer: {
        short: { fr: "OTIF excellent · erreurs 4 % fragilité picking/réception", en: "Excellent OTIF · 4% errors picking/receiving fragility" },
        full: {
          fr: "Le taux de service OTIF est de 285/300, soit 95,0 % — niveau excellent au seuil (≥ 95 %). Le taux d'erreur est de 12/300, soit 4,0 %, classé acceptable (1–5 %) mais corrigeable. Avant renouvellement SLA J-90, je corrèle ces erreurs de picking et de réception au risque de dérive OTIF.",
          en: "OTIF service level is 285/300, or 95.0% — excellent at threshold (≥ 95%). Error rate is 12/300, or 4.0%, classified acceptable (1–5%) but correctable. Before D-90 SLA renewal, I correlate these picking and receiving errors to OTIF drift risk.",
        },
        keywords: ["excellent", "acceptable", "picking", "réception", "OTIF"],
        whyCorrect: [
          { fr: "Satisfait le prérequis compliance excellence @ 95 %.", en: "Satisfies compliance prerequisite excellence @ 95%." },
          { fr: "Implémente l'analyse duale OTIF + erreurs.", en: "Implements dual OTIF + errors analysis." },
        ],
      },
      commonMistakes: [
        { fr: "Classer 95 % comme acceptable ou insuffisant.", en: "Classifying 95% as acceptable or insufficient." },
        { fr: "OTIF seul sans mentionner 4 % erreurs.", en: "OTIF only without mentioning 4% errors." },
      ],
    },
    m4ErrorsPedagogical(),
    {
      stepCode: "KPI_DIAGNOSTIC",
      label: { fr: "Synthèse diagnostic", en: "Diagnostic synthesis" },
      kpiInterpretation: {
        lens: { fr: "Synthèse multi-KPI — plan exécution chiffré 90 jours.", en: "Multi-KPI synthesis — numeric 90-day execution plan." },
        bands: ANNEXE_A_BANDS,
      },
      expectedReasoning: {
        chain: [
          { fr: "Reconnaître excellence OTIF au seuil.", en: "Recognize OTIF excellence at threshold." },
          { fr: "Lier erreurs picking/réception à OTIF.", en: "Link picking/receiving errors to OTIF." },
          { fr: "Proposer plan chiffré (% cible) + horizon 90 j + suivi hebdo.", en: "Propose numeric plan (% target) + 90 d horizon + weekly follow-up." },
          { fr: "Financer formation — pas destock primaire.", en: "Fund training — not primary destock." },
        ],
        traps: [{ fr: "Destock comme levier principal.", en: "Destock as primary lever." }],
        bloom: "Create",
      },
      canonicalAnswer: {
        short: { fr: "Plan formation/checklists · erreurs → ≤ 2 %", en: "Training/checklists plan · errors → ≤ 2%" },
        full: {
          fr: "Diagnostic SCN-013 — piège tableau vert. OTIF 95 % reconnu excellent ; rotation 6× normale. Risque prioritaire : erreurs picking/réception à 4 % fragilisent OTIF à horizon 90 jours. Je recommande un programme qualité d'exécution : formation picking, double validation réception, revue hebdomadaire, cible 2 % d'ici J-90. Décision : financer le budget formation plutôt qu'un destock.",
          en: "SCN-013 diagnostic — green dashboard trap. 95% OTIF recognized as excellent; 6× normal turnover. Priority risk: picking/receiving errors at 4% weaken OTIF at 90-day horizon. I recommend an execution quality program: picking training, double receiving validation, weekly review, 2% target by D-90. Decision: fund training budget rather than destock.",
        },
        keywords: ["recommand", "2%", "90", "hebdo", "picking", "formation"],
        whyCorrect: [
          { fr: "Correspond au fixture diag013.", en: "Matches diag013 fixture." },
          { fr: "Satisfait les portes compliance SCN-013.", en: "Satisfies SCN-013 compliance gates." },
        ],
      },
      commonMistakes: [
        { fr: "Plan sans % ni horizon 90/hebdo.", en: "Plan without % or 90/weekly horizon." },
        { fr: "Diagnostic < 50 caractères.", en: "Diagnostic < 50 characters." },
      ],
    },
    m4ComplianceStep(),
  ],
};

const SCN_014: LearningFeedbackScenario = {
  scnCode: "SCN-014",
  moduleId: 4,
  title: { fr: "Arbitrage S&OP multi-KPI", en: "Multi-KPI S&OP arbitration" },
  lens: { fr: "Conseil S&OP — une initiative financée", en: "S&OP board — one funded initiative" },
  scenarioMistakes: [
    { fr: "Optimisation mono-KPI (rotation seule ou service seul).", en: "Single-KPI optimization (turnover only or service only)." },
    { fr: "Oublier le délai 3,5 j dans le diagnostic.", en: "Forgetting 3.5 d lead time in diagnostic." },
    { fr: "Destock global sans arbitrage explicite.", en: "Global destock without explicit trade-off." },
    { fr: "Diagnostic sans ≥ 3 domaines KPI.", en: "Diagnostic without ≥ 3 KPI domains." },
  ],
  steps: [
    {
      stepCode: "KPI_DATA",
      label: { fr: "Données KPI", en: "KPI Data" },
      kpiInterpretation: {
        lens: { fr: "Bundle complet — cadrage S&OP une initiative.", en: "Full bundle — S&OP one-initiative framing." },
        bands: ANNEXE_A_BANDS,
      },
      expectedReasoning: {
        chain: [
          { fr: "Reconnaître les quatre lentilles KPI.", en: "Recognize four KPI lenses." },
          { fr: "Cadrer arbitrage S&OP — une initiative financée.", en: "Frame S&OP arbitration — one funded initiative." },
        ],
        traps: [{ fr: "Traiter comme SCN-012 ou SCN-013 isolément.", en: "Treating as SCN-012 or SCN-013 in isolation." }],
      },
      canonicalAnswer: {
        short: { fr: "Bundle complet · arbitrage S&OP", en: "Full bundle · S&OP arbitration" },
        full: {
          fr: "Tour de contrôle S&OP : rotation 6×, OTIF 95 %, erreurs 4 %, délai 3,5 j, capital 48 000 $. Une seule initiative doit être financée — arbitrage intégré requis.",
          en: "S&OP control tower: 6× turnover, 95% OTIF, 4% errors, 3.5 d lead time, $48,000 capital. Only one initiative can be funded — integrated arbitration required.",
        },
        keywords: ["S&OP", "arbitrage", "initiative"],
        whyCorrect: [{ fr: "Cadre la tension ventes vs ops vs finance.", en: "Frames sales vs ops vs finance tension." }],
      },
    },
    {
      stepCode: "KPI_ROTATION",
      label: { fr: "Taux de rotation", en: "Turnover rate" },
      kpiInterpretation: {
        lens: { fr: "6× normale — lentille CFO capital 48 000 $.", en: "6× normal — CFO $48k capital lens." },
        bands: [ANNEXE_A_BANDS[0], ANNEXE_A_BANDS[4]],
      },
      expectedReasoning: {
        chain: [
          { fr: "Rotation normale — pas de chasse destock globale.", en: "Normal turnover — no global destock chase." },
          { fr: "Capital 48 000 $ comme contexte arbitrage.", en: "$48k capital as arbitration context." },
        ],
        traps: [{ fr: "Destock rotation-only (carryover SCN-012).", en: "Turnover-only destock (SCN-012 carryover)." }],
      },
      canonicalAnswer: {
        short: { fr: "6× normale — capital 48k contexte", en: "6× normal — $48k capital context" },
        full: {
          fr: "Rotation 6× — bande normale. Capital immobilisé 48 000 $ cohérent ; pas de levier destock global sans arbitrage S&OP.",
          en: "6× turnover — normal band. $48,000 immobilized capital consistent; no global destock lever without S&OP arbitration.",
        },
        keywords: ["normal", "48 000", "capital"],
        whyCorrect: [{ fr: "Évite optimisation rotation seule.", en: "Avoids turnover-only optimization." }],
      },
    },
    {
      stepCode: "KPI_SERVICE",
      label: { fr: "Taux de service", en: "Service level" },
      kpiInterpretation: {
        lens: { fr: "95 % excellent + 4 % erreurs — tension ventes vs ops.", en: "95% excellent + 4% errors — sales vs ops tension." },
        bands: [ANNEXE_A_BANDS[1], ANNEXE_A_BANDS[2]],
      },
      expectedReasoning: {
        chain: [
          { fr: "OTIF 95 % excellent au seuil.", en: "95% OTIF excellent at threshold." },
          { fr: "Erreurs 4 % = menace cachée exécution.", en: "4% errors = hidden execution threat." },
        ],
        traps: [{ fr: "Service-only maintenance sans qualité.", en: "Service-only maintenance without quality." }],
      },
      canonicalAnswer: {
        short: { fr: "OTIF seuil · erreurs menace cachée", en: "Threshold OTIF · hidden error threat" },
        full: {
          fr: "Service excellent à 95 % au seuil. Erreurs 4 % acceptables mais menace cachée pour OTIF — levier qualité exécution prioritaire sur destock.",
          en: "Excellent service at 95% threshold. 4% errors acceptable but hidden OTIF threat — execution quality lever priority over destock.",
        },
        keywords: ["excellent", "erreurs", "qualité"],
        whyCorrect: [{ fr: "Intègre lentille ventes et ops.", en: "Integrates sales and ops lenses." }],
      },
    },
    m4ErrorsPedagogical(),
    {
      stepCode: "KPI_DIAGNOSTIC",
      label: { fr: "Synthèse diagnostic S&OP", en: "S&OP diagnostic synthesis" },
      kpiInterpretation: {
        lens: { fr: "Triangle arbitrage — délai 3,5 j obligatoire.", en: "Trade-off triangle — 3.5 d lead time mandatory." },
        bands: ANNEXE_A_BANDS,
      },
      expectedReasoning: {
        chain: [
          { fr: "Intégrer rotation, service, erreurs, délai (≥ 3 domaines).", en: "Integrate turnover, service, errors, lead time (≥ 3 domains)." },
          { fr: "Triangle arbitrage avec sacrifice explicite.", en: "Trade-off triangle with explicit sacrifice." },
          { fr: "Initiative qualité · destock reporté.", en: "Quality initiative · destock deferred." },
          { fr: "Cibles 90 jours chiffrées.", en: "Numeric 90-day targets." },
        ],
        traps: [{ fr: "Décision mono-KPI.", en: "Single-KPI decision." }],
        bloom: "Create",
      },
      canonicalAnswer: {
        short: { fr: "Initiative qualité · destock reporté", en: "Quality initiative · destock deferred" },
        full: {
          fr: "Rotation normale à 6×, service excellent 95 %, erreurs acceptables 4 %, délai lead time 3,5 jours. Je recommande un programme qualité exécution. Trade-off : on reporte le destock pour maintenir le service et le capital. Priorité arbitrage : financer réduction erreurs. Cible 90 jours avec KPI rotation, service, erreur, délai.",
          en: "Normal turnover at 6×, excellent 95% service, 4% acceptable errors, 3.5 d lead time. I recommend an execution quality program. Trade-off: defer destock to maintain service and capital. Arbitration priority: fund error reduction. 90-day target with turnover, service, error, lead time KPIs.",
        },
        keywords: ["qualité", "trade-off", "destock", "90", "délai", "3,5"],
        whyCorrect: [
          { fr: "Correspond au fixture diag014.", en: "Matches diag014 fixture." },
          { fr: "Inclut délai 3,5 j obligatoire SCN-014.", en: "Includes mandatory SCN-014 3.5 d lead time." },
        ],
      },
    },
    m4ComplianceStep(),
  ],
};

function m5OpsStep(
  stepCode: string,
  label: Bilingual,
  lens: Bilingual,
  chain: Bilingual[],
  short: Bilingual,
  full: Bilingual,
  keywords: string[],
  mistakes?: Bilingual[],
): LearningFeedbackStep {
  return {
    stepCode,
    label,
    kpiInterpretation: { lens, bands: [] },
    expectedReasoning: { chain, traps: [] },
    canonicalAnswer: {
      short,
      full,
      keywords,
      whyCorrect: [{ fr: "Aligné sur le contrat seed M5.", en: "Aligned with M5 seed contract." }],
    },
    commonMistakes: mistakes,
  };
}

const SCN_015: LearningFeedbackScenario = {
  scnCode: "SCN-015",
  moduleId: 5,
  title: { fr: "Peak Week J1 — nominal", en: "Peak Week D1 — nominal" },
  lens: { fr: "Cycle intégré nominal — décision tactique", en: "Nominal integrated cycle — tactical decision" },
  scenarioMistakes: [
    { fr: "Mauvais SKU/qté/PO (rejet dur).", en: "Wrong SKU/qty/PO (hard reject)." },
    { fr: "Q = 50 au réappro (piège Q = 0).", en: "Q = 50 on replenish (Q = 0 trap)." },
    { fr: "Coller Annexe A (400, 48000) au KPI.", en: "Pasting Annexe A (400, 48000) at KPI." },
    { fr: "Essai stratégique SCN-017 inutile.", en: "Unnecessary SCN-017 strategic essay." },
  ],
  steps: [
    m5OpsStep("M5_RECEPTION", { fr: "Réception", en: "Reception" },
      { fr: "Stock 0 → première preuve GR.", en: "Stock 0 → first GR evidence." },
      [{ fr: "GR lié au contrat PO-M5-001.", en: "GR bound to PO-M5-001 contract." }],
      { fr: "SKU-001 · 50 · PO-M5-001", en: "SKU-001 · 50 · PO-M5-001" },
      { fr: "Réception SKU-001, 50 unités, référence PO-M5-001 — première transaction du cycle Peak Week.", en: "Receive SKU-001, 50 units, reference PO-M5-001 — first Peak Week cycle transaction." },
      ["SKU-001", "50", "PO-M5-001"],
      [{ fr: "Mauvais SKU ou quantité.", en: "Wrong SKU or quantity." }],
    ),
    m5OpsStep("M5_PUTAWAY", { fr: "Rangement", en: "Putaway" },
      { fr: "REC-01 → B-01-R1-L1 · FIFO + lot.", en: "REC-01 → B-01-R1-L1 · FIFO + lot." },
      [{ fr: "Ranger avec lot LOT-M5-A.", en: "Put away with lot LOT-M5-A." }],
      { fr: "REC-01 → B-01-R1-L1 · LOT-M5-A", en: "REC-01 → B-01-R1-L1 · LOT-M5-A" },
      { fr: "Rangement REC-01 vers B-01-R1-L1 avec lot LOT-M5-A — respect FIFO.", en: "Putaway REC-01 to B-01-R1-L1 with lot LOT-M5-A — FIFO respected." },
      ["REC-01", "B-01-R1-L1", "LOT-M5-A"],
    ),
    m5OpsStep("M5_CYCLE_COUNT", { fr: "Comptage cyclique", en: "Cycle count" },
      { fr: "Système 50 = physique 50 — variance 0.", en: "System 50 = physical 50 — variance 0." },
      [{ fr: "Confirmer chaîne ops sans écart.", en: "Confirm ops chain without variance." }],
      { fr: "50 = 50 · variance 0", en: "50 = 50 · variance 0" },
      { fr: "Comptage : système 50, physique 50, variance 0 — chaîne nominale confirmée.", en: "Count: system 50, physical 50, variance 0 — nominal chain confirmed." },
      ["50", "variance", "0"],
    ),
    m5OpsStep("M5_REPLENISH", { fr: "Réapprovisionnement", en: "Replenishment" },
      { fr: "Stock 50 ≥ min 10 — piège Q = 0.", en: "Stock 50 ≥ min 10 — Q = 0 trap." },
      [{ fr: "Stock suffisant — Q = 0.", en: "Sufficient stock — Q = 0." }],
      { fr: "Q = 0 · stock suffisant", en: "Q = 0 · sufficient stock" },
      { fr: "Stock 50 unités au-dessus du minimum 10 — aucun réapprovisionnement nécessaire (Q = 0).", en: "Stock 50 units above minimum 10 — no replenishment needed (Q = 0)." },
      ["Q = 0", "stock", "suffisant"],
      [{ fr: "Commander Q = 50.", en: "Ordering Q = 50." }],
    ),
    {
      stepCode: "M5_KPI",
      label: { fr: "Snapshot KPI", en: "KPI Snapshot" },
      kpiInterpretation: {
        lens: { fr: "Ledger-derived — pas Annexe A.", en: "Ledger-derived — not Annexe A." },
        bands: [
          { kpiKey: "rotation", value: "6×", status: "normal", formulaHint: { fr: "300 ÷ 50 = 6×", en: "300 ÷ 50 = 6×" } },
          { kpiKey: "service", value: "95 %", status: "excellent", formulaHint: { fr: "285 ÷ 300", en: "285 ÷ 300" } },
          { kpiKey: "errors", value: "4 %", status: "acceptable", formulaHint: { fr: "12 ÷ 300", en: "12 ÷ 300" } },
        ],
      },
      expectedReasoning: {
        chain: [
          { fr: "Dériver KPI depuis le moniteur ops.", en: "Derive KPI from ops monitor." },
          { fr: "Confirmer depuis ledger (checkbox).", en: "Confirm from ledger (checkbox)." },
        ],
        traps: [{ fr: "Coller Annexe A 400/48000.", en: "Pasting Annexe A 400/48000." }],
        erpAnchor: { fr: "SAP MC$4 / MB52 — indicateurs dérivés", en: "SAP MC$4 / MB52 — derived indicators" },
      },
      canonicalAnswer: {
        short: { fr: "Ledger: 300/50/285/300/12/300/3,5/6000", en: "Ledger: 300/50/285/300/12/300/3.5/6000" },
        full: {
          fr: "KPI dérivés du moniteur : consommation 300 u., stock moyen 50 u., OTIF 285/300, erreurs 12/300, délai 3,5 j, valeur stock 6 000 $. Rotation 6×, service 95 %, erreurs 4 %.",
          en: "KPI derived from monitor: consumption 300 u., average stock 50 u., OTIF 285/300, errors 12/300, lead time 3.5 d, stock value $6,000. 6× turnover, 95% service, 4% errors.",
        },
        keywords: ["50", "300", "285", "6000", "ledger"],
        whyCorrect: [{ fr: "Prouve la chaîne ops → analytics.", en: "Proves ops → analytics chain." }],
      },
      commonMistakes: [
        { fr: "Annexe A au lieu du ledger.", en: "Annexe A instead of ledger." },
        { fr: "Oublier la confirmation ledger.", en: "Forgetting ledger confirmation." },
      ],
    },
    {
      stepCode: "M5_DECISION",
      label: { fr: "Décision tactique", en: "Tactical decision" },
      kpiInterpretation: {
        lens: { fr: "Interpréter snapshot — action corrective ops.", en: "Interpret snapshot — ops corrective action." },
        bands: [
          { kpiKey: "rotation", value: "6×", status: "normal" },
          { kpiKey: "service", value: "95 %", status: "excellent" },
          { kpiKey: "errors", value: "4 %", status: "acceptable" },
        ],
      },
      expectedReasoning: {
        chain: [
          { fr: "Synthèse tactique post-cycle nominal.", en: "Tactical synthesis post-nominal cycle." },
          { fr: "Pas de réappro (Q = 0).", en: "No replenishment (Q = 0)." },
          { fr: "Formation picking / procédures.", en: "Picking training / procedures." },
        ],
        traps: [{ fr: "Essai stratégique SCN-017.", en: "SCN-017 strategic essay attempt." }],
        bloom: "Evaluate",
      },
      canonicalAnswer: {
        short: { fr: "Rotation/service/erreurs OK · pas de réappro · améliorer procédures", en: "Turnover/service/errors OK · no replen · improve procedures" },
        full: {
          fr: "Après cycle nominal Peak Week : rotation 6× normale, service 95 % excellent, erreurs 4 % acceptables. Stock 50 u. au-dessus du min — aucun réapprovisionnement immédiat. Je recommande une formation picking et une revue procédure réception pour réduire les erreurs vers 2 % sans dégrader le taux de service.",
          en: "After nominal Peak Week cycle: 6× normal turnover, 95% excellent service, 4% acceptable errors. Stock 50 u. above min — no immediate replenishment. I recommend picking training and receiving procedure review to reduce errors toward 2% without degrading service level.",
        },
        keywords: ["rotation", "service", "erreur", "formation", "réapprovisionnement"],
        whyCorrect: [{ fr: "Décision tactique SCN-015 — jamais rejetée.", en: "SCN-015 tactical decision — never rejected." }],
      },
    },
    {
      stepCode: "COMPLIANCE_M5",
      label: { fr: "Conformité M5", en: "M5 Compliance" },
      kpiInterpretation: {
        lens: { fr: "7 étapes + snapshot — checklist complète.", en: "7 steps + snapshot — complete checklist." },
        bands: [],
      },
      expectedReasoning: {
        chain: [{ fr: "Valider chaîne ops + KPI + décision.", en: "Validate ops + KPI + decision chain." }],
        traps: [],
      },
      canonicalAnswer: {
        short: { fr: "Conformité M5 validée", en: "M5 compliance validated" },
        full: { fr: "Cycle intégré nominal complété — conformité M5 validée.", en: "Nominal integrated cycle completed — M5 compliance validated." },
        keywords: ["conformité"],
        whyCorrect: [{ fr: "7 étapes effectives sans M5_ADJ.", en: "7 effective steps without M5_ADJ." }],
      },
    },
  ],
};

const SCN_016: LearningFeedbackScenario = {
  scnCode: "SCN-016",
  moduleId: 5,
  title: { fr: "Peak Week J2 — variance", en: "Peak Week D2 — variance" },
  lens: { fr: "Exception variance −5 — ADJ obligatoire", en: "Variance exception −5 — ADJ required" },
  scenarioMistakes: [
    { fr: "Ignorer variance −5 au comptage.", en: "Ignoring −5 variance at count." },
    { fr: "Soumettre KPI avant ADJ.", en: "Submitting KPI before ADJ." },
    { fr: "Q = 50 post-correction.", en: "Q = 50 post-correction." },
    { fr: "Décision sans mention correction.", en: "Decision without correction mention." },
  ],
  steps: [
    ...SCN_015.steps.slice(0, 2),
    m5OpsStep("M5_CYCLE_COUNT", { fr: "Comptage cyclique", en: "Cycle count" },
      { fr: "Variance −5 injectée — ADJ requis.", en: "Variance −5 injected — ADJ required." },
      [{ fr: "Système 50 · physique 45 · Δ −5.", en: "System 50 · physical 45 · Δ −5." }],
      { fr: "Δ −5 · ADJ obligatoire", en: "Δ −5 · ADJ required" },
      { fr: "Comptage : système 50, physique 45, variance −5 — ajustement MI07 obligatoire avant KPI.", en: "Count: system 50, physical 45, variance −5 — MI07 adjustment required before KPI." },
      ["−5", "ADJ", "45", "50"],
    ),
    m5OpsStep("M5_ADJ", { fr: "Ajustement MI07", en: "MI07 Adjustment" },
      { fr: "Stock post-variance 45 — justification.", en: "Post-variance stock 45 — justification." },
      [{ fr: "MI07 avant KPI/DECISION.", en: "MI07 before KPI/DECISION." }],
      { fr: "Ajustement −5 · justification", en: "Adjustment −5 · justification" },
      { fr: "Ajustement inventaire −5 unités avec justification variance — stock corrigé à 45.", en: "Inventory adjustment −5 units with variance justification — stock corrected to 45." },
      ["−5", "MI07", "45"],
    ),
    m5OpsStep("M5_REPLENISH", { fr: "Réapprovisionnement", en: "Replenishment" },
      { fr: "Stock 45 > min 10 — Q = 0 post-correction.", en: "Stock 45 > min 10 — Q = 0 post-correction." },
      [{ fr: "Q = 0 après correction.", en: "Q = 0 after correction." }],
      { fr: "Q = 0 post-correction", en: "Q = 0 post-correction" },
      { fr: "Stock 45 unités post-ADJ — au-dessus du minimum, Q = 0.", en: "Stock 45 units post-ADJ — above minimum, Q = 0." },
      ["Q = 0", "45"],
    ),
    {
      ...SCN_015.steps[4],
      kpiInterpretation: {
        ...SCN_015.steps[4].kpiInterpretation,
        lens: { fr: "Snapshot post-ADJ — ledger corrigé.", en: "Post-ADJ snapshot — corrected ledger." },
      },
    },
    {
      ...SCN_015.steps[5],
      expectedReasoning: {
        chain: [
          { fr: "Mentionner résolution variance.", en: "Mention variance resolution." },
          { fr: "Décision tactique post-correction.", en: "Post-correction tactical decision." },
        ],
        traps: [{ fr: "Oublier l'exception ADJ.", en: "Forgetting ADJ exception." }],
        bloom: "Evaluate",
      },
      canonicalAnswer: {
        short: { fr: "Variance résolue · décision tactique", en: "Variance resolved · tactical decision" },
        full: {
          fr: "Après résolution de l'écart −5 par MI07 : rotation et service conformes au snapshot corrigé. Je recommande une revue procédure comptage et formation pour éviter récurrence, tout en maintenant le service client.",
          en: "After resolving −5 variance via MI07: turnover and service aligned with corrected snapshot. I recommend count procedure review and training to avoid recurrence while maintaining customer service.",
        },
        keywords: ["variance", "ADJ", "correction", "service"],
        whyCorrect: [{ fr: "Intègre la gestion d'exception SCN-016.", en: "Integrates SCN-016 exception handling." }],
      },
    },
    SCN_015.steps[6],
  ],
};

const SCN_017: LearningFeedbackScenario = {
  scnCode: "SCN-017",
  moduleId: 5,
  title: { fr: "Peak Week J3 — stratégique", en: "Peak Week D3 — strategic" },
  lens: { fr: "Capstone conseil — structure A1/A2/A3", en: "Board capstone — A1/A2/A3 structure" },
  scenarioMistakes: [
    { fr: "Décision tactique courte (insuffisante).", en: "Short tactical decision (insufficient)." },
    { fr: "Sans citation snapshot (≥ 2 KPI).", en: "Without snapshot citation (≥ 2 KPIs)." },
    { fr: "Structure board absente.", en: "Missing board structure." },
    { fr: "Décision rejetée (mots-clés manquants).", en: "Rejected decision (missing keywords)." },
  ],
  steps: [
    ...SCN_015.steps.slice(0, 4),
    {
      ...SCN_015.steps[4],
      kpiInterpretation: {
        ...SCN_015.steps[4].kpiInterpretation,
        lens: { fr: "Snapshot verrouillé — citer valeurs panel.", en: "Locked snapshot — cite panel values." },
      },
      expectedReasoning: {
        chain: [
          { fr: "Citer ≥ 2 KPI du snapshot panel.", en: "Cite ≥ 2 KPIs from snapshot panel." },
          { fr: "Ne pas utiliser Annexe A $48k.", en: "Do not use Annexe A $48k." },
        ],
        traps: [{ fr: "Annexe A au lieu du snapshot.", en: "Annexe A instead of snapshot." }],
      },
    },
    {
      stepCode: "M5_DECISION",
      label: { fr: "Décision stratégique", en: "Strategic decision" },
      kpiInterpretation: {
        lens: { fr: "Structure board — Situation · Preuve · Arbitrage · Recommandation.", en: "Board structure — Situation · Proof · Trade-off · Recommendation." },
        bands: [
          { kpiKey: "rotation", value: "6×", status: "normal" },
          { kpiKey: "service", value: "95 %", status: "excellent" },
          { kpiKey: "errors", value: "4 %", status: "acceptable" },
        ],
      },
      expectedReasoning: {
        chain: [
          { fr: "Situation : cycle ops complété.", en: "Situation: ops cycle completed." },
          { fr: "Preuve : citer snapshot (rotation, service, erreurs, délai).", en: "Proof: cite snapshot (turnover, service, errors, lead time)." },
          { fr: "Arbitrage : qualité vs capital vs résilience.", en: "Trade-off: quality vs capital vs resilience." },
          { fr: "Recommandation + horizon 90–180 j.", en: "Recommendation + 90–180 d horizon." },
        ],
        traps: [{ fr: "Une seule orientation imposée.", en: "Single imposed orientation." }],
        bloom: "Create",
        erpAnchor: { fr: "SAP IBP — revue conseil stratégique", en: "SAP IBP — strategic board review" },
      },
      canonicalAnswer: {
        short: { fr: "A1/A2/A3 — choisir une orientation", en: "A1/A2/A3 — choose one orientation" },
        full: {
          fr: "Exemplaires acceptés — choisir une orientation stratégique parmi A1 (qualité), A2 (working capital), A3 (résilience). Chaque réponse doit citer le snapshot et structurer Situation · Preuve · Arbitrage · Recommandation · Horizon.",
          en: "Accepted exemplars — choose one strategic orientation among A1 (quality), A2 (working capital), A3 (resilience). Each answer must cite the snapshot and structure Situation · Proof · Trade-off · Recommendation · Horizon.",
        },
        keywords: ["situation", "preuve", "arbitrage", "recommandation", "90", "rotation", "service"],
        whyCorrect: [{ fr: "SCN-017 autorise trois orientations valides.", en: "SCN-017 allows three valid orientations." }],
        variants: [
          {
            id: "A1",
            label: { fr: "A1 — Qualité d'exécution", en: "A1 — Execution quality" },
            full: {
              fr: "Entrepôt post-cycle intégré ; performance globale correcte avec erreurs à 4 %. Preuve KPI : rotation 6× normal, service 95 % excellent, erreurs 4 % acceptable, délai 3,5 j. Arbitrage : maintenir politique stock vs investir en qualité d'exécution. Recommandation : plan 90 j — formation picking/réception, checklists, revue hebdo erreurs. KPI suivi : erreurs → ≤ 2 % sans descendre sous 93 % service.",
              en: "Warehouse post-integrated cycle; overall performance correct with 4% errors. KPI proof: 6× normal turnover, 95% excellent service, 4% acceptable errors, 3.5 d lead time. Trade-off: maintain stock policy vs invest in execution quality. Recommendation: 90 d plan — picking/receiving training, checklists, weekly error review. KPI target: errors → ≤ 2% without dropping below 93% service.",
            },
          },
          {
            id: "A2",
            label: { fr: "A2 — Working capital", en: "A2 — Working capital" },
            full: {
              fr: "Cycle ops complété ; rotation 6×, stock immobilisé [snapshot], service 95 %, erreurs 4 %. Arbitrage stock/service/coût. Réduire cibles SKU faible rotation ; objectif −15 % stock en 6 mois sans service < 93 %.",
              en: "Ops cycle completed; 6× turnover, immobilized stock [snapshot], 95% service, 4% errors. Stock/service/cost trade-off. Reduce low-turnover SKU targets; −15% stock target in 6 months without service < 93%.",
            },
          },
          {
            id: "A3",
            label: { fr: "A3 — Résilience capacité", en: "A3 — Capacity resilience" },
            full: {
              fr: "Service 95 % excellent mais délai 3,5 j serré. Arbitrage capacité vs coût. Investir capacité préparation (planning shift + FIFO putaway) pour +20 % volume ; KPI : lead time ≤ 3 j, service ≥ 95 % sur 90–180 j.",
              en: "95% excellent service but tight 3.5 d lead time. Capacity vs cost trade-off. Invest in prep capacity (shift planning + FIFO putaway) for +20% volume; KPI: lead time ≤ 3 d, service ≥ 95% over 90–180 d.",
            },
          },
        ],
      },
    },
    SCN_015.steps[6],
  ],
};

export const LEARNING_FEEDBACK_REGISTRY: Record<string, LearningFeedbackScenario> = {
  "SCN-012": SCN_012,
  "SCN-013": SCN_013,
  "SCN-014": SCN_014,
  "SCN-015": SCN_015,
  "SCN-016": SCN_016,
  "SCN-017": SCN_017,
};

export function getLearningFeedbackScenario(scnCode: string): LearningFeedbackScenario | null {
  return LEARNING_FEEDBACK_REGISTRY[scnCode] ?? null;
}
