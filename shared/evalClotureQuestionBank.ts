/**
 * TEC.LOG — Évaluation intégrée de clôture
 * Gestion des stocks et performance WMS (compétence professionnelle)
 *
 * Blueprint canonique — PAS encore branché au seed Assessment Center.
 * Décision professeur requise avant activation (status draft / ready).
 *
 * Intention pédagogique :
 * - Prouver un apprentissage de logistique / WMS transferable (hors UI plateforme)
 * - Chaîne cognitive : PREUVE → VÉRIFICATION → INTERPRÉTATION → DÉCISION → CONNEXION → SUIVI
 * - Résultat conclusif par axes de compétence + interprétation (radar)
 *
 * Calibrage séance : ~50 min · 20 × 5 pts = 100 · seuil 70
 */

export type CognitiveLayer =
  | "preuve"
  | "verification"
  | "interpretation"
  | "decision"
  | "connexion"
  | "suivi";

export type CompetencyAxisCode =
  | "FLUX"
  | "EXACT"
  | "CAPA"
  | "KPI"
  | "DEC";

export type EvalClotureQuestionDef = {
  code: string; // EF-Q01 .. EF-Q20
  axisCode: CompetencyAxisCode;
  competency: string;
  cognitiveLayer: CognitiveLayer;
  difficulty: "easy" | "medium" | "hard";
  /** Compatible Assessment Center questionType enum / analytics */
  questionType:
    | "conceptual"
    | "scenario"
    | "sequencing"
    | "data_interpretation"
    | "diagnosis";
  learningObjectiveFr: string;
  learningObjectiveEn: string;
  estimatedTimeSeconds: number;
  promptFr: string;
  promptEn: string;
  options: Array<{ id: string; fr: string; en: string }>;
  correctOptionId: string;
  explanationFr: string;
  explanationEn: string;
  points: number;
};

/** Second Assessment Center exam (= ASSESSMENT_CODES.EVAL2). */
export const EVAL_CLOTURE_ASSESSMENT_CODE = "EVAL_INTEGREE_2";
export const EVAL_CLOTURE_PASSING_SCORE = 70;
export const EVAL_CLOTURE_DURATION_MINUTES = 50;
export const EVAL_CLOTURE_TOTAL_POINTS = 100;

export const EVAL_CLOTURE_META = {
  titleFr:
    "Évaluation intégrée 2 — Clôture : stocks et performance WMS",
  titleEn:
    "Integrated Assessment 2 — Closing: inventory and WMS performance",
  purposeFr:
    "Valider la compétence professionnelle intégrée en logistique d’entrepôt et pilotage WMS — lecture de preuves, interprétation, décision et suivi — indépendamment de la mémorisation de l’interface du simulateur. Classe 10 · Cohorte B.",
  purposeEn:
    "Validate integrated professional competency in warehouse logistics and WMS control — evidence reading, interpretation, decision and follow-up — independent of memorizing the simulator interface. Class 10 · Cohort B.",
  activationStatus: "ready" as const,
  modulesCovered: ["PROG", "M1", "M2", "M3", "M4", "M5"] as string[],
  studentBriefFr:
    "Durée : 50 minutes. Un dossier d’entrepôt est fourni. Les questions portent sur le raisonnement opérationnel, pas sur les écrans de la plateforme.",
  studentBriefEn:
    "Duration: 50 minutes. A warehouse dossier is provided. Questions test operational reasoning, not platform screens.",
} as const;

/** Axes → labels for radar / score report */
export const EVAL_CLOTURE_AXES: Record<
  CompetencyAxisCode,
  { fr: string; en: string; shortFr: string; shortEn: string }
> = {
  FLUX: {
    fr: "Flux intégrés (réception → stockage → sortie)",
    en: "Integrated flows (receive → store → ship)",
    shortFr: "Flux",
    shortEn: "Flows",
  },
  EXACT: {
    fr: "Exactitude et contrôle des stocks",
    en: "Inventory accuracy and control",
    shortFr: "Exactitude",
    shortEn: "Accuracy",
  },
  CAPA: {
    fr: "Capacité, localisation et priorités (FIFO / lots)",
    en: "Capacity, location and priorities (FIFO / lots)",
    shortFr: "Capacité",
    shortEn: "Capacity",
  },
  KPI: {
    fr: "Pilotage par KPI et diagnostic",
    en: "KPI steering and diagnosis",
    shortFr: "KPI",
    shortEn: "KPI",
  },
  DEC: {
    fr: "Décision opérationnelle sous contrainte",
    en: "Operational decision under constraint",
    shortFr: "Décision",
    shortEn: "Decision",
  },
};

/**
 * Dossier d’entrepôt — case study (consultable pendant toute la preuve).
 * Fictif : aucune référence SCN / écran TEC.WMS.
 */
export const EVAL_CLOTURE_DOSSIER = {
  code: "DOSSIER-ND-2026",
  titleFr: "Dossier — Entrepôt Nordique Distribution (semaine de pointe)",
  titleEn: "Dossier — Nordique Distribution Warehouse (peak week)",
  contextFr: `Nordique Distribution exploite un entrepôt régional de pièces et consommables B2B.
Semaine de pointe : promotions clients + réceptions fournisseurs groupées.
Votre rôle : superviseur adjoint WMS — vous devez lire les preuves, interpréter les écarts et décider dans l’ordre opérationnel correct.`,
  contextEn: `Nordique Distribution runs a regional B2B parts and consumables warehouse.
Peak week: customer promotions + batched supplier receipts.
Your role: assistant WMS supervisor — read evidence, interpret variances, and decide in the correct operational order.`,
  factsFr: [
    "Réception du jour : ASN attendu 1 200 u (SKU-A 800, SKU-B 400). Comptage quai : SKU-A 780, SKU-B 400 (écart −20 sur SKU-A).",
    "Putaway proposé : B-12 (capacité restante 500 u) pour les 780 u SKU-A ; overflow possible vers B-18 (capacité restante 400 u).",
    "Stock système SKU-C avant inventaire : 250 u en B-04. Comptage physique cyclique : 238 u. Écart −12 u confirmé après double comptage.",
    "Lots SKU-D en picking : LOT-2024-01 (qty 40, plus ancien), LOT-2024-08 (qty 90). Commande client urgente : 55 u SKU-D.",
    "Min/Max SKU-E en bin de picking : Min 30 / Max 120. Stock picking actuel : 22 u. Stock réserve : 200 u disponibles.",
    "KPI semaine (seuils internes) : Exactitude stock cible ≥ 98 % (actuel 96,4 %) ; OTIF cible ≥ 95 % (actuel 92 %) ; Rotation OK (bande normale).",
    "Contrainte direction : protéger le service client cette semaine ; éviter les expéditions avec risque d’erreur élevé ; ajustements stock autorisés seulement après preuve d’écart.",
    "Incident signalé : une GR a été postée hier pour 50 u SKU-F sans marchandise physique au quai (suspicion réception fantôme).",
  ],
  factsEn: [
    "Today’s receipt: ASN expected 1,200 u (SKU-A 800, SKU-B 400). Dock count: SKU-A 780, SKU-B 400 (SKU-A short by 20).",
    "Proposed putaway: B-12 (remaining capacity 500 u) for 780 u SKU-A; overflow possible to B-18 (remaining capacity 400 u).",
    "SKU-C system stock before count: 250 u in B-04. Cycle count physical: 238 u. Variance −12 u confirmed after double count.",
    "SKU-D pick lots: LOT-2024-01 (qty 40, older), LOT-2024-08 (qty 90). Urgent customer order: 55 u SKU-D.",
    "SKU-E pick-bin Min/Max: Min 30 / Max 120. Current pick stock: 22 u. Reserve stock: 200 u available.",
    "Week KPIs (internal thresholds): inventory accuracy target ≥ 98% (actual 96.4%); OTIF target ≥ 95% (actual 92%); turnover OK (normal band).",
    "Management constraint: protect customer service this week; avoid high-error-risk shipments; stock adjustments allowed only after variance evidence.",
    "Reported incident: a GR was posted yesterday for 50 u SKU-F with no physical goods on the dock (suspected phantom receipt).",
  ],
  tableFr: {
    headers: ["Indicateur", "Valeur", "Seuil", "Lecture"],
    rows: [
      ["Exactitude stock", "96,4 %", "≥ 98 %", "Sous seuil"],
      ["OTIF", "92 %", "≥ 95 %", "Sous seuil"],
      ["Erreurs picking (tendance)", "+18 % vs N-1", "stable", "Dégradation"],
      ["Rotation", "bande normale", "bande normale", "Conforme"],
    ],
  },
  tableEn: {
    headers: ["Metric", "Value", "Threshold", "Reading"],
    rows: [
      ["Inventory accuracy", "96.4%", "≥ 98%", "Below threshold"],
      ["OTIF", "92%", "≥ 95%", "Below threshold"],
      ["Picking errors (trend)", "+18% vs prior", "stable", "Worsening"],
      ["Turnover", "normal band", "normal band", "OK"],
    ],
  },
} as const;

/** Textes d’interprétation du rapport de clôture (global + par axe) */
export const EVAL_CLOTURE_REPORT = {
  global: {
    excellent: {
      fr: "Vous avez démontré une maîtrise solide du raisonnement WMS intégré : lecture des preuves, diagnostic et décisions sous contrainte.",
      en: "You demonstrated solid mastery of integrated WMS reasoning: evidence reading, diagnosis, and decisions under constraint.",
    },
    good: {
      fr: "Vous avez démontré une bonne compétence professionnelle. Quelques liens processus ↔ conséquences restent à consolider.",
      en: "You demonstrated good professional competency. A few process ↔ consequence links still need consolidation.",
    },
    sufficient: {
      fr: "Compétence suffisante pour clôturer le parcours. Renforcez surtout l’interprétation des écarts et la priorité des actions.",
      en: "Sufficient competency to close the programme. Strengthen variance interpretation and action priority in particular.",
    },
    not_demonstrated: {
      fr: "La compétence intégrée n’est pas encore démontrée. Révision ciblée des flux, de l’exactitude stock et du pilotage KPI recommandée avant une nouvelle tentative autorisée.",
      en: "Integrated competency is not yet demonstrated. Targeted review of flows, inventory accuracy and KPI steering is recommended before an authorized retake.",
    },
  },
  axisCoachFr: {
    FLUX: "Relisez la séquence réception → contrôle → rangement → sortie et les dépendances entre documents.",
    EXACT: "Pratiquez l’écart (preuve → réconciliation → ajustement) sans court-circuiter le contrôle.",
    CAPA: "Travaillez capacité bin, split de putaway et règles FIFO multi-lots.",
    KPI: "Séparez donnée / classification / risque avant de conclure sur un KPI.",
    DEC: "Sous contrainte de service, choisissez l’action qui réduit le risque client avec preuve.",
  } as Record<CompetencyAxisCode, string>,
  axisCoachEn: {
    FLUX: "Revisit receive → check → putaway → ship sequencing and document dependencies.",
    EXACT: "Practice variance (evidence → reconcile → adjust) without skipping control.",
    CAPA: "Drill bin capacity, putaway split and multi-lot FIFO rules.",
    KPI: "Separate data / classification / risk before concluding on a KPI.",
    DEC: "Under service constraint, choose the action that reduces customer risk with evidence.",
  } as Record<CompetencyAxisCode, string>,
} as const;

export const EVAL_CLOTURE_QUESTIONS: EvalClotureQuestionDef[] = [
  // ─── FLUX (4) ─────────────────────────────────────────────────────────────
  {
    code: "EF-Q01",
    axisCode: "FLUX",
    competency: EVAL_CLOTURE_AXES.FLUX.fr,
    cognitiveLayer: "preuve",
    difficulty: "easy",
    questionType: "data_interpretation",
    learningObjectiveFr: "Identifier la preuve fiable d’écart à la réception",
    learningObjectiveEn: "Identify reliable receiving variance evidence",
    estimatedTimeSeconds: 120,
    promptFr:
      "D’après le dossier, quelle preuve doit guider le traitement de la réception SKU-A aujourd’hui ?",
    promptEn:
      "Per the dossier, which evidence should drive today’s SKU-A receiving handling?",
    options: [
      {
        id: "o1",
        fr: "ASN fournisseur 800 u pris seul comme quantité finale à ranger",
        en: "Supplier ASN 800 u taken alone as the final quantity to put away",
      },
      {
        id: "o2",
        fr: "Stock réserve SKU-E 200 u utilisé pour compenser la pénurie A.",
        en: "SKU-E reserve 200 u used to offset the SKU-A shortage today",
      },
      {
        id: "o3",
        fr: "OTIF hebdomadaire 92 % utilisé pour valider la quantité reçue.",
        en: "Weekly OTIF 92% used to validate the quantity received today",
      },
      {
        id: "o4",
        fr: "Comptage quai 780 u confronté à l’ASN pour acter l’écart −20 u",
        en: "Dock count 780 u checked against ASN to record the −20 u variance",
      },
    ],
    correctOptionId: "o4",
    explanationFr:
      "À la réception, la preuve opérationnelle est le comptage quai confronté à l’attendu (ASN). L’écart −20 doit être acté avant putaway/stock.",
    explanationEn:
      "At receiving, operational evidence is the dock count vs expected (ASN). The −20 variance must be recorded before putaway/stock.",
    points: 5,
  },

  {
    code: "EF-Q02",
    axisCode: "FLUX",
    competency: EVAL_CLOTURE_AXES.FLUX.fr,
    cognitiveLayer: "verification",
    difficulty: "medium",
    questionType: "sequencing",
    learningObjectiveFr: "Ordonner les étapes du flux entrant avant mise à disposition",
    learningObjectiveEn: "Sequence inbound steps before stock availability",
    estimatedTimeSeconds: 140,
    promptFr:
      "Pour SKU-A, quelle séquence respecte un flux entrant fiable avant que le picking puisse s’appuyer sur ce stock ?",
    promptEn:
      "For SKU-A, which sequence keeps inbound reliable before picking may rely on that stock?",
    options: [
      {
        id: "o1",
        fr: "Contrôle réception avec écart, puis putaway, puis disponibilité picking",
        en: "Receiving check with variance, then putaway, then pick availability",
      },
      {
        id: "o2",
        fr: "Putaway immédiat, puis comptage quai, puis ajustement de l’ASN",
        en: "Immediate putaway, then dock count, then ASN quantity adjustment",
      },
      {
        id: "o3",
        fr: "Picking urgent d’abord, puis réception papier, putaway en soirée",
        en: "Urgent picking first, then paper receiving, putaway in the evening",
      },
      {
        id: "o4",
        fr: "Ajustement SKU-C d’abord, puis réception A, puis expédition D observé..",
        en: "SKU-C adjustment first, then receive A, then ship order D",
      },
    ],
    correctOptionId: "o1",
    explanationFr:
      "Sans contrôle d’écart puis rangement, le stock « disponible » n’est pas fiable pour le picking.",
    explanationEn:
      "Without variance control then putaway, “available” stock is not reliable for picking.",
    points: 5,
  },

  {
    code: "EF-Q03",
    axisCode: "FLUX",
    competency: EVAL_CLOTURE_AXES.FLUX.fr,
    cognitiveLayer: "connexion",
    difficulty: "medium",
    questionType: "diagnosis",
    learningObjectiveFr: "Lier une réception incorrecte à un risque aval",
    learningObjectiveEn: "Link incorrect receiving to downstream risk",
    estimatedTimeSeconds: 150,
    promptFr:
      "Si l’on rangeait les 800 u ASN de SKU-A sans traiter l’écart quai (−20), quel risque aval est le plus direct ?",
    promptEn:
      "If 800 u ASN of SKU-A were put away without handling the dock variance (−20), what is the most direct downstream risk?",
    options: [
      {
        id: "o1",
        fr: "Rotation trop élevée imposant d’augmenter aussitôt le Max SKU-E",
        en: "Turnover too high forcing an immediate increase of SKU-E Max",
      },
      {
        id: "o2",
        fr: "Stock système surestimé menant à promesses et picks sur unités absentes",
        en: "Overstated system stock leading to promises and picks on missing units",
      },
      {
        id: "o3",
        fr: "FIFO multi-lots cassé uniquement sur les lots de la référence D",
        en: "Multi-lot FIFO broken only on the lots of reference SKU-D",
      },
      {
        id: "o4",
        fr: "OTIF remis automatiquement à 100 % dès la fin de la semaine",
        en: "OTIF automatically reset to 100% as soon as the week ends",
      },
    ],
    correctOptionId: "o2",
    explanationFr:
      "Ignorer −20 crée un stock fantôme partiel : le système « voit » plus que le physique → erreurs de promesse et de picking.",
    explanationEn:
      "Ignoring −20 creates partial phantom stock: the system “sees” more than physical → promise and picking errors.",
    points: 5,
  },

  {
    code: "EF-Q04",
    axisCode: "FLUX",
    competency: EVAL_CLOTURE_AXES.FLUX.fr,
    cognitiveLayer: "suivi",
    difficulty: "medium",
    questionType: "conceptual",
    learningObjectiveFr: "Choisir l’indicateur de suivi après correction réception",
    learningObjectiveEn: "Choose the follow-up metric after a receiving correction",
    estimatedTimeSeconds: 130,
    promptFr:
      "Après correction de l’écart SKU-A et putaway conforme, quel suivi confirme le mieux que le flux entrant est redevenu fiable ?",
    promptEn:
      "After correcting the SKU-A variance and compliant putaway, which follow-up best confirms inbound is reliable again?",
    options: [
      {
        id: "o1",
        fr: "Augmenter aussitôt le Min de tous les SKU du face de picking",
        en: "Immediately raise Min for every SKU on the pick face area",
      },
      {
        id: "o2",
        fr: "Clôturer la semaine sans inventaire car la rotation reste normale",
        en: "Close the week with no counts because turnover remains normal",
      },
      {
        id: "o3",
        fr: "Comparer système et emplacements rangés, sans nouvelles ruptures SKU-A",
        en: "Compare system vs putaway locations, with no new SKU-A stockouts",
      },
      {
        id: "o4",
        fr: "Mesurer seulement le coût de transport facturé par le fournisseur",
        en: "Measure only the transport cost invoiced by the supplier side",
      },
    ],
    correctOptionId: "o3",
    explanationFr:
      "Le suivi utile relie exactitude localisation/système et absence de ruptures causées par la mauvaise réception.",
    explanationEn:
      "Useful follow-up links location/system accuracy and absence of stockouts caused by bad receiving.",
    points: 5,
  },

  // ─── EXACT (4) ────────────────────────────────────────────────────────────
  {
    code: "EF-Q05",
    axisCode: "EXACT",
    competency: EVAL_CLOTURE_AXES.EXACT.fr,
    cognitiveLayer: "preuve",
    difficulty: "easy",
    questionType: "data_interpretation",
    learningObjectiveFr: "Lire un écart d’inventaire cyclique",
    learningObjectiveEn: "Read a cycle-count variance",
    estimatedTimeSeconds: 110,
    promptFr:
      "Pour SKU-C (système 250, physique 238), quelle lecture est correcte ?",
    promptEn:
      "For SKU-C (system 250, physical 238), which reading is correct?",
    options: [
      {
        id: "o1",
        fr: "Surplus physique de 12 u : il faut ajouter au système",
        en: "Physical surplus of 12 u: units must be added to system",
      },
      {
        id: "o2",
        fr: "Écart nul car 250 et 238 sont proches du seuil OTIF",
        en: "Zero variance because 250 and 238 are near OTIF threshold",
      },
      {
        id: "o3",
        fr: "Écart de capacité B-12 sans aucun lien avec le SKU-C",
        en: "B-12 capacity variance with no link at all to SKU-C",
      },
      {
        id: "o4",
        fr: "Manque physique de 12 u : le stock système est trop élevé",
        en: "Physical shortage of 12 u: system stock is too high",
      },
    ],
    correctOptionId: "o4",
    explanationFr:
      "Physique < système ⇒ manque de 12 u. L’exactitude exige de traiter cet écart, pas de l’ignorer via OTIF ou un autre bin.",
    explanationEn:
      "Physical < system ⇒ shortage of 12 u. Accuracy requires handling this variance, not ignoring it via OTIF or another bin.",
    points: 5,
  },

  {
    code: "EF-Q06",
    axisCode: "EXACT",
    competency: EVAL_CLOTURE_AXES.EXACT.fr,
    cognitiveLayer: "verification",
    difficulty: "medium",
    questionType: "sequencing",
    learningObjectiveFr: "Valider l’ordre contrôle avant ajustement",
    learningObjectiveEn: "Validate control-before-adjust order",
    estimatedTimeSeconds: 140,
    promptFr:
      "Le dossier confirme l’écart SKU-C après double comptage. Quelle suite est la plus conforme ?",
    promptEn:
      "The dossier confirms the SKU-C variance after double count. Which next path is most compliant?",
    options: [
      {
        id: "o1",
        fr: "Réconcilier l’écart documenté puis ajuster le stock système",
        en: "Reconcile the documented variance then adjust system stock",
      },
      {
        id: "o2",
        fr: "Expédier d’abord les 12 u manquantes puis compter demain",
        en: "Ship the missing 12 u first then perform the count tomorrow",
      },
      {
        id: "o3",
        fr: "Augmenter le Max SKU-C afin de masquer l’écart constaté",
        en: "Raise SKU-C Max in order to hide the observed variance",
      },
      {
        id: "o4",
        fr: "Poster une GR de 12 u sans marchandise pour équilibrer",
        en: "Post a 12 u GR with no goods in order to balance books",
      },
    ],
    correctOptionId: "o1",
    explanationFr:
      "Preuve confirmée → réconciliation → ajustement. Masquer ou inventer une GR empire l’exactitude.",
    explanationEn:
      "Confirmed evidence → reconcile → adjust. Hiding or inventing a GR worsens accuracy.",
    points: 5,
  },

  {
    code: "EF-Q07",
    axisCode: "EXACT",
    competency: EVAL_CLOTURE_AXES.EXACT.fr,
    cognitiveLayer: "interpretation",
    difficulty: "medium",
    questionType: "diagnosis",
    learningObjectiveFr: "Diagnostiquer une réception fantôme",
    learningObjectiveEn: "Diagnose a phantom receipt",
    estimatedTimeSeconds: 150,
    promptFr:
      "Une GR de 50 u SKU-F a été postée sans marchandise au quai. Quelle interprétation est juste ?",
    promptEn:
      "A 50 u SKU-F GR was posted with no goods on the dock. Which interpretation is correct?",
    options: [
      {
        id: "o1",
        fr: "Simple retard fournisseur sans aucun impact sur le stock système..",
        en: "Simple supplier delay with no impact at all on system stock",
      },
      {
        id: "o2",
        fr: "Réception fantôme : stock système gonflé sans marchandise physique",
        en: "Phantom receipt: system stock inflated without physical goods",
      },
      {
        id: "o3",
        fr: "Problème FIFO limité au seul lot ancien LOT-2024-01 en picking",
        en: "FIFO issue limited only to the older lot LOT-2024-01 in picking",
      },
      {
        id: "o4",
        fr: "Signal positif garantissant une hausse automatique de l’OTIF",
        en: "Positive signal guaranteeing an automatic rise in weekly OTIF",
      },
    ],
    correctOptionId: "o2",
    explanationFr:
      "GR sans physique = réception fantôme : exactitude et décisions aval sont faussées jusqu’à correction.",
    explanationEn:
      "GR without physical goods = phantom receipt: accuracy and downstream decisions are skewed until corrected.",
    points: 5,
  },

  {
    code: "EF-Q08",
    axisCode: "EXACT",
    competency: EVAL_CLOTURE_AXES.EXACT.fr,
    cognitiveLayer: "decision",
    difficulty: "hard",
    questionType: "scenario",
    learningObjectiveFr: "Décider sous règle « ajustement seulement avec preuve »",
    learningObjectiveEn: "Decide under “adjust only with evidence” rule",
    estimatedTimeSeconds: 160,
    promptFr:
      "La direction n’autorise les ajustements qu’avec preuve d’écart. Pour SKU-F (suspicion fantôme) et SKU-C (écart confirmé), que faire maintenant ?",
    promptEn:
      "Management allows adjustments only with variance evidence. For SKU-F (suspected phantom) and SKU-C (confirmed variance), what now?",
    options: [
      {
        id: "o1",
        fr: "Ajuster SKU-F et SKU-C tout de suite sans nouveau contrôle actuel.",
        en: "Adjust SKU-F and SKU-C right away with no further control",
      },
      {
        id: "o2",
        fr: "N’ajuster ni SKU-F ni SKU-C avant la clôture du mois entier",
        en: "Adjust neither SKU-F nor SKU-C before the full month closes",
      },
      {
        id: "o3",
        fr: "Ajuster SKU-C maintenant ; investiguer SKU-F avant tout ajustement",
        en: "Adjust SKU-C now; investigate SKU-F before any stock adjustment",
      },
      {
        id: "o4",
        fr: "Ajuster seulement SKU-F parce que l’OTIF est sous le seuil",
        en: "Adjust SKU-F only because OTIF sits below the set threshold",
      },
    ],
    correctOptionId: "o3",
    explanationFr:
      "SKU-C a une preuve confirmée → ajustement légitime. SKU-F reste une suspicion → vérifier avant d’ajuster.",
    explanationEn:
      "SKU-C has confirmed evidence → legitimate adjust. SKU-F is still a suspicion → verify before adjusting.",
    points: 5,
  },

  // ─── CAPA (4) ─────────────────────────────────────────────────────────────
  {
    code: "EF-Q09",
    axisCode: "CAPA",
    competency: EVAL_CLOTURE_AXES.CAPA.fr,
    cognitiveLayer: "interpretation",
    difficulty: "medium",
    questionType: "data_interpretation",
    learningObjectiveFr: "Interpréter une contrainte de capacité au putaway",
    learningObjectiveEn: "Interpret putaway capacity constraint",
    estimatedTimeSeconds: 140,
    promptFr:
      "SKU-A à ranger : 780 u. B-12 reste 500 u ; B-18 reste 400 u. Quelle interprétation est correcte ?",
    promptEn:
      "SKU-A to put away: 780 u. B-12 has 500 u left; B-18 has 400 u left. Which interpretation is correct?",
    options: [
      {
        id: "o1",
        fr: "B-12 suffit seul pour ranger les 780 u sans dépasser capacité",
        en: "B-12 alone fits all 780 u without exceeding remaining capacity",
      },
      {
        id: "o2",
        fr: "B-18 suffit seul ; B-12 doit rester vide pendant la pointe",
        en: "B-18 alone is enough; B-12 must stay empty during the peak",
      },
      {
        id: "o3",
        fr: "Aucune capacité utile : refuser toute la réception du SKU-A..",
        en: "No usable capacity: refuse the entire inbound receipt of SKU-A",
      },
      {
        id: "o4",
        fr: "Split requis : par exemple 500 u en B-12 et 280 u en B-18",
        en: "Split required: for example 500 u in B-12 and 280 u in B-18",
      },
    ],
    correctOptionId: "o4",
    explanationFr:
      "500 < 780 ⇒ B-12 ne suffit pas ; avec B-18 (400) un split 500+280 est faisable.",
    explanationEn:
      "500 < 780 ⇒ B-12 is not enough; with B-18 (400) a 500+280 split is feasible.",
    points: 5,
  },

  {
    code: "EF-Q10",
    axisCode: "CAPA",
    competency: EVAL_CLOTURE_AXES.CAPA.fr,
    cognitiveLayer: "decision",
    difficulty: "medium",
    questionType: "scenario",
    learningObjectiveFr: "Appliquer FIFO multi-lots sur commande urgente",
    learningObjectiveEn: "Apply multi-lot FIFO on an urgent order",
    estimatedTimeSeconds: 150,
    promptFr:
      "Commande urgente 55 u SKU-D. Lots : LOT-2024-01 (40, plus ancien) et LOT-2024-08 (90). Quelle exécution est correcte ?",
    promptEn:
      "Urgent order 55 u SKU-D. Lots: LOT-2024-01 (40, older) and LOT-2024-08 (90). Which execution is correct?",
    options: [
      {
        id: "o1",
        fr: "Piquer 40 u sur LOT-2024-01 puis 15 u sur LOT-2024-08",
        en: "Pick 40 u from LOT-2024-01 then 15 u from LOT-2024-08",
      },
      {
        id: "o2",
        fr: "Piquer 55 u seulement sur LOT-2024-08 car plus pratique",
        en: "Pick all 55 u only from LOT-2024-08 because it is easier",
      },
      {
        id: "o3",
        fr: "Attendre un lot plus récent avant toute sortie client urgente",
        en: "Wait for a newer lot before any urgent customer issue starts",
      },
      {
        id: "o4",
        fr: "Sortir 55 u sans lot pour gagner du temps en semaine pointe..",
        en: "Issue 55 u with no lot to save time in this peak week rush",
      },
    ],
    correctOptionId: "o1",
    explanationFr:
      "FIFO : consommer d’abord le lot le plus ancien (40), puis compléter (15) sur le lot suivant.",
    explanationEn:
      "FIFO: consume the oldest lot first (40), then complete (15) from the next lot.",
    points: 5,
  },

  {
    code: "EF-Q11",
    axisCode: "CAPA",
    competency: EVAL_CLOTURE_AXES.CAPA.fr,
    cognitiveLayer: "verification",
    difficulty: "easy",
    questionType: "conceptual",
    learningObjectiveFr: "Vérifier le signal Min/Max de réapprovisionnement",
    learningObjectiveEn: "Verify Min/Max replenishment signal",
    estimatedTimeSeconds: 120,
    promptFr:
      "SKU-E picking : Min 30, Max 120, stock actuel 22, réserve 200. Que vérifie-t-on d’abord ?",
    promptEn:
      "SKU-E pick: Min 30, Max 120, current 22, reserve 200. What should you verify first?",
    options: [
      {
        id: "o1",
        fr: "Stock au-dessus du Max : retirer aussitôt 98 u du picking",
        en: "Stock above Max: immediately remove 98 u from the pick face",
      },
      {
        id: "o2",
        fr: "Stock sous Min : réappro picking depuis la réserve est requis",
        en: "Stock below Min: pick-face replenishment from reserve is required",
      },
      {
        id: "o3",
        fr: "Aucun signal Min/Max : 22 u suffit car rotation est normale..",
        en: "No Min/Max signal: 22 u is enough because turnover is normal",
      },
      {
        id: "o4",
        fr: "Ajuster d’abord SKU-C avant tout mouvement de réappro SKU-E..",
        en: "Adjust SKU-C first before any SKU-E replenishment movement",
      },
    ],
    correctOptionId: "o2",
    explanationFr:
      "22 < Min 30 ⇒ signal de réappro. La réserve (200) permet de remonter le picking vers le Max selon la règle site.",
    explanationEn:
      "22 < Min 30 ⇒ replenishment signal. Reserve (200) can refill the pick face toward Max per site rule.",
    points: 5,
  },

  {
    code: "EF-Q12",
    axisCode: "CAPA",
    competency: EVAL_CLOTURE_AXES.CAPA.fr,
    cognitiveLayer: "connexion",
    difficulty: "hard",
    questionType: "diagnosis",
    learningObjectiveFr: "Relier capacité / FIFO à un risque OTIF",
    learningObjectiveEn: "Connect capacity/FIFO to OTIF risk",
    estimatedTimeSeconds: 160,
    promptFr:
      "Si l’équipe force 780 u SKU-A dans B-12 (cap. 500) et pique SKU-D hors FIFO, quel lien est le plus juste ?",
    promptEn:
      "If the team forces 780 u SKU-A into B-12 (cap. 500) and picks SKU-D outside FIFO, which link is most accurate?",
    options: [
      {
        id: "o1",
        fr: "Exactitude stock portée automatiquement à 100 % après ces choix",
        en: "Inventory accuracy automatically rises to 100% after these choices",
      },
      {
        id: "o2",
        fr: "Impact limité au seul coût énergie de fonctionnement de l’entrepôt",
        en: "Impact limited only to the warehouse operating energy cost line",
      },
      {
        id: "o3",
        fr: "Chaos localisation et mauvaise conso de lots → erreurs et OTIF bas",
        en: "Location chaos and wrong lot use → errors and lower OTIF",
      },
      {
        id: "o4",
        fr: "Aucun lien service : capacité et FIFO n’affectent jamais l’OTIF",
        en: "No service link: capacity and FIFO never affect OTIF outcomes",
      },
    ],
    correctOptionId: "o3",
    explanationFr:
      "Capacité violée et FIFO ignoré créent erreurs de localisation/picking — levier direct sur l’OTIF.",
    explanationEn:
      "Violated capacity and ignored FIFO create location/picking errors — a direct OTIF lever.",
    points: 5,
  },

  // ─── KPI (4) ──────────────────────────────────────────────────────────────
  {
    code: "EF-Q13",
    axisCode: "KPI",
    competency: EVAL_CLOTURE_AXES.KPI.fr,
    cognitiveLayer: "preuve",
    difficulty: "easy",
    questionType: "data_interpretation",
    learningObjectiveFr: "Lire le tableau KPI sans sur-interpréter",
    learningObjectiveEn: "Read the KPI table without over-interpreting",
    estimatedTimeSeconds: 110,
    promptFr:
      "Selon le tableau du dossier, quels indicateurs sont sous seuil cette semaine ?",
    promptEn:
      "Per the dossier table, which metrics are below threshold this week?",
    options: [
      {
        id: "o1",
        fr: "La rotation seule est sous seuil ; les autres restent conformes",
        en: "Turnover alone is below threshold; the others remain compliant",
      },
      {
        id: "o2",
        fr: "Tous les indicateurs, rotation comprise, sont sous leurs seuils",
        en: "All metrics, including turnover, sit below their set thresholds",
      },
      {
        id: "o3",
        fr: "Aucun sous seuil : la tendance picking annule toutes les cibles",
        en: "None below threshold: picking trend cancels all target breaches",
      },
      {
        id: "o4",
        fr: "Exactitude stock et OTIF seulement sont sous leurs seuils",
        en: "Inventory accuracy and OTIF only are below their thresholds",
      },
    ],
    correctOptionId: "o4",
    explanationFr:
      "Exactitude 96,4 % < 98 % et OTIF 92 % < 95 %. La rotation est conforme ; la tendance picking est un risque, pas le même seuil.",
    explanationEn:
      "Accuracy 96.4% < 98% and OTIF 92% < 95%. Turnover is OK; picking trend is a risk signal, not the same threshold breach.",
    points: 5,
  },

  {
    code: "EF-Q14",
    axisCode: "KPI",
    competency: EVAL_CLOTURE_AXES.KPI.fr,
    cognitiveLayer: "interpretation",
    difficulty: "medium",
    questionType: "scenario",
    learningObjectiveFr: "Classer un KPI « bon » vs risque associé",
    learningObjectiveEn: "Classify a “good” KPI vs associated risk",
    estimatedTimeSeconds: 150,
    promptFr:
      "La rotation est dans la bande normale, mais les erreurs picking montent (+18 %) et l’OTIF est à 92 %. Quelle interprétation est la plus professionnelle ?",
    promptEn:
      "Turnover is in the normal band, but picking errors are up (+18%) and OTIF is 92%. Which interpretation is most professional?",
    options: [
      {
        id: "o1",
        fr: "Rotation conforme ne compense pas le risque service erreurs/OTIF",
        en: "Healthy turnover does not offset service risk from errors/OTIF",
      },
      {
        id: "o2",
        fr: "Un seul KPI vert suffit pour déclarer la semaine pleinement OK..",
        en: "A single green KPI is enough to declare the week fully OK",
      },
      {
        id: "o3",
        fr: "L’OTIF peut être ignoré car seule l’exactitude stock compte ici.",
        en: "OTIF can be ignored because only inventory accuracy matters here",
      },
      {
        id: "o4",
        fr: "Hausser artificiellement la rotation corrigera forcément l’OTIF.",
        en: "Artificially raising turnover will necessarily correct the OTIF",
      },
    ],
    correctOptionId: "o1",
    explanationFr:
      "Un KPI conforme n’annule pas un autre sous seuil. Ici le risque client (erreurs/OTIF) prime sur une rotation « OK ».",
    explanationEn:
      "One healthy KPI does not cancel another below threshold. Here customer risk (errors/OTIF) outweighs “OK” turnover.",
    points: 5,
  },

  {
    code: "EF-Q15",
    axisCode: "KPI",
    competency: EVAL_CLOTURE_AXES.KPI.fr,
    cognitiveLayer: "connexion",
    difficulty: "hard",
    questionType: "diagnosis",
    learningObjectiveFr: "Relier causes opérationnelles aux KPI sous seuil",
    learningObjectiveEn: "Link operational causes to below-threshold KPIs",
    estimatedTimeSeconds: 170,
    promptFr:
      "Quels éléments du dossier expliquent le mieux, ensemble, exactitude 96,4 % et OTIF 92 % ?",
    promptEn:
      "Which dossier elements together best explain accuracy 96.4% and OTIF 92%?",
    options: [
      {
        id: "o1",
        fr: "La rotation normale suffit seule à expliquer les deux sous-seuils",
        en: "Normal turnover alone is enough to explain both threshold breaches",
      },
      {
        id: "o2",
        fr: "Écarts stock SKU-C/F et hausse des erreurs picking expliquent les KPI",
        en: "SKU-C/F stock variances and rising picking errors explain the KPIs",
      },
      {
        id: "o3",
        fr: "La capacité inutilisée de B-18 est la cause unique des deux KPI",
        en: "Unused B-18 capacity is the sole cause of both KPI breaches",
      },
      {
        id: "o4",
        fr: "Les Min/Max SKU-E trop hauts expliquent seuls exactitude et OTIF",
        en: "SKU-E Min/Max set too high alone explain accuracy and OTIF",
      },
    ],
    correctOptionId: "o2",
    explanationFr:
      "Exactitude souffre des écarts/fantômes ; OTIF souffre des erreurs picking et stocks peu fiables — lecture systémique.",
    explanationEn:
      "Accuracy suffers from variances/phantoms; OTIF suffers from picking errors and unreliable stock — system reading.",
    points: 5,
  },

  {
    code: "EF-Q16",
    axisCode: "KPI",
    competency: EVAL_CLOTURE_AXES.KPI.fr,
    cognitiveLayer: "suivi",
    difficulty: "medium",
    questionType: "conceptual",
    learningObjectiveFr: "Définir un suivi KPI après plan d’action",
    learningObjectiveEn: "Define KPI follow-up after an action plan",
    estimatedTimeSeconds: 140,
    promptFr:
      "Après actions sur écarts et qualité picking, quel suivi est le plus cohérent pour la direction ?",
    promptEn:
      "After actions on variances and picking quality, which follow-up is most coherent for management?",
    options: [
      {
        id: "o1",
        fr: "Suivre uniquement le nombre brut de réceptions fournisseurs",
        en: "Track only the raw count of supplier receipts at the site",
      },
      {
        id: "o2",
        fr: "Arrêter tout suivi KPI jusqu’à l’ouverture du prochain trimestre",
        en: "Stop all KPI follow-up until the next quarter window opens",
      },
      {
        id: "o3",
        fr: "Suivre exactitude et OTIF à court terme, plus la tendance erreurs..",
        en: "Track accuracy and OTIF short-term, plus the picking-error trend",
      },
      {
        id: "o4",
        fr: "Remplacer l’OTIF par la rotation comme unique indicateur de suivi..",
        en: "Replace OTIF with turnover as the only follow-up metric used",
      },
    ],
    correctOptionId: "o3",
    explanationFr:
      "Le suivi doit mesurer les leviers attaqués : exactitude, service (OTIF) et tendance erreurs.",
    explanationEn:
      "Follow-up should measure the levers you attacked: accuracy, service (OTIF) and error trend.",
    points: 5,
  },

  // ─── DEC (4) ──────────────────────────────────────────────────────────────
  {
    code: "EF-Q17",
    axisCode: "DEC",
    competency: EVAL_CLOTURE_AXES.DEC.fr,
    cognitiveLayer: "decision",
    difficulty: "hard",
    questionType: "scenario",
    learningObjectiveFr: "Prioriser sous contrainte de service client",
    learningObjectiveEn: "Prioritize under customer-service constraint",
    estimatedTimeSeconds: 170,
    promptFr:
      "Contrainte : protéger le service, éviter les expéditions à risque élevé. Quelle priorité d’action est la plus saine maintenant ?",
    promptEn:
      "Constraint: protect service, avoid high-risk shipments. Which action priority is soundest now?",
    options: [
      {
        id: "o1",
        fr: "Expédier toutes les commandes d’abord ; inventaires après la pointe",
        en: "Ship every order first; run inventory counts only after the peak",
      },
      {
        id: "o2",
        fr: "Bloquer tout le site jusqu’à une exactitude mesurée de 100 %",
        en: "Halt the whole site until measured inventory accuracy hits 100%",
      },
      {
        id: "o3",
        fr: "Ignorer SKU-C et SKU-F parce que la rotation reste dans la bande",
        en: "Ignore SKU-C and SKU-F because turnover remains inside the band",
      },
      {
        id: "o4",
        fr: "Sécuriser exactitude critique et réappro sous Min, puis expédier fiable",
        en: "Secure critical accuracy and below-Min replenish, then ship reliably",
      },
    ],
    correctOptionId: "o4",
    explanationFr:
      "Protéger le service ≠ expédier aveuglément. Il faut d’abord fiabiliser les stocks critiques et le picking sous Min.",
    explanationEn:
      "Protecting service ≠ blind shipping. First stabilize critical stock accuracy and below-Min pick faces.",
    points: 5,
  },

  {
    code: "EF-Q18",
    axisCode: "DEC",
    competency: EVAL_CLOTURE_AXES.DEC.fr,
    cognitiveLayer: "interpretation",
    difficulty: "medium",
    questionType: "scenario",
    learningObjectiveFr: "Interpréter un trade-off vitesse vs risque d’erreur",
    learningObjectiveEn: "Interpret a speed vs error-risk trade-off",
    estimatedTimeSeconds: 150,
    promptFr:
      "Un chef d’équipe propose de sauter le double comptage SKU-C pour « gagner 20 minutes » en pointe. Quelle lecture est correcte ?",
    promptEn:
      "A team lead proposes skipping the SKU-C double count to “save 20 minutes” in peak. Which reading is correct?",
    options: [
      {
        id: "o1",
        fr: "Risqué : accélérer sans preuve peut amplifier erreurs et OTIF faible",
        en: "Risky: speeding without evidence can amplify errors and weak OTIF",
      },
      {
        id: "o2",
        fr: "Bon trade-off : vingt minutes gagnées valent plus que l’exactitude..",
        en: "Good trade-off: twenty saved minutes always outweigh accuracy work",
      },
      {
        id: "o3",
        fr: "Neutre : le double comptage n’a jamais d’effet sur les opérations",
        en: "Neutral: double counting never has any effect on warehouse operations",
      },
      {
        id: "o4",
        fr: "Obligatoire d’accepter car la direction ne veut que du volume brut..",
        en: "Must accept because management wants raw volume output only now",
      },
    ],
    correctOptionId: "o1",
    explanationFr:
      "En pointe, la vitesse sans contrôle augmente le risque client — contraire à la contrainte « éviter les expéditions à risque ».",
    explanationEn:
      "In peak, speed without control raises customer risk — against the “avoid high-risk shipments” constraint.",
    points: 5,
  },

  {
    code: "EF-Q19",
    axisCode: "DEC",
    competency: EVAL_CLOTURE_AXES.DEC.fr,
    cognitiveLayer: "decision",
    difficulty: "hard",
    questionType: "scenario",
    learningObjectiveFr: "Choisir la décision système cohérente pour SKU-E",
    learningObjectiveEn: "Choose the coherent system decision for SKU-E",
    estimatedTimeSeconds: 160,
    promptFr:
      "SKU-E picking à 22 u (Min 30) avec 200 u en réserve. Quelle décision opérationnelle est la plus cohérente ?",
    promptEn:
      "SKU-E pick face at 22 u (Min 30) with 200 u in reserve. Which operational decision is most coherent?",
    options: [
      {
        id: "o1",
        fr: "Baisser le Min à 20 u pour éviter tout mouvement de stock réserve",
        en: "Lower Min to 20 u to avoid any movement from reserve stock now",
      },
      {
        id: "o2",
        fr: "Réapprovisionner le picking depuis la réserve selon la règle Min/Max..",
        en: "Replenish the pick face from reserve according to the Min/Max rule",
      },
      {
        id: "o3",
        fr: "Créer une GR fantôme de 8 u afin d’afficher un stock au Min",
        en: "Create an 8 u phantom GR so the system shows stock at the Min",
      },
      {
        id: "o4",
        fr: "Annuler les commandes SKU-E sans tenter le réapprovisionnement picking",
        en: "Cancel SKU-E orders without attempting pick-face replenishment first",
      },
    ],
    correctOptionId: "o2",
    explanationFr:
      "Sous Min avec réserve disponible ⇒ réappro picking. Modifier le Min ou inventer une GR sont des contournements.",
    explanationEn:
      "Below Min with available reserve ⇒ pick-face replenishment. Changing Min or inventing a GR are workarounds.",
    points: 5,
  },

  {
    code: "EF-Q20",
    axisCode: "DEC",
    competency: EVAL_CLOTURE_AXES.DEC.fr,
    cognitiveLayer: "connexion",
    difficulty: "hard",
    questionType: "diagnosis",
    learningObjectiveFr: "Synthèse systémique de clôture de parcours",
    learningObjectiveEn: "Programme-closing systemic synthesis",
    estimatedTimeSeconds: 180,
    promptFr:
      "Synthèse : quelle affirmation décrit le mieux le rôle d’un WMS dans cette semaine de pointe ?",
    promptEn:
      "Synthesis: which statement best describes the WMS role in this peak week?",
    options: [
      {
        id: "o1",
        fr: "Le WMS remplace le jugement : cliquer suffit pour garantir le service",
        en: "The WMS replaces judgment: clicking alone is enough to guarantee service",
      },
      {
        id: "o2",
        fr: "Le WMS n’enregistre que la finance ; l’entrepôt physique est hors scope",
        en: "The WMS only records finance; the physical warehouse stays out of scope",
      },
      {
        id: "o3",
        fr: "Le WMS fiabilise preuves et flux ; la perf. dépend des décisions alignées.",
        en: "The WMS makes evidence and flows reliable; performance needs aligned decisions",
      },
      {
        id: "o4",
        fr: "Les KPI seuls suffisent, sans transactions ni contrôles d’exactitude stock",
        en: "KPIs alone suffice, without transactions or inventory accuracy controls",
      },
    ],
    correctOptionId: "o3",
    explanationFr:
      "Message de clôture du programme : le WMS structure la vérité opérationnelle ; la compétence est de décider avec preuves.",
    explanationEn:
      "Programme closing message: the WMS structures operational truth; competency is deciding with evidence.",
    points: 5,
  },

];

/** moduleCode court pour schéma Assessment Center (varchar 8) */
export function axisToModuleCode(axis: CompetencyAxisCode): string {
  return axis;
}

export function countCorrectPositionDistribution(
  questions: EvalClotureQuestionDef[],
): Record<string, number> {
  const dist: Record<string, number> = { o1: 0, o2: 0, o3: 0, o4: 0 };
  for (const q of questions) {
    dist[q.correctOptionId] = (dist[q.correctOptionId] ?? 0) + 1;
  }
  return dist;
}

/** Fraction of items where the correct FR option is uniquely the longest */
export function uniqueLongestCorrectRatio(
  questions: EvalClotureQuestionDef[],
): number {
  let uniqueLongestCorrect = 0;
  for (const q of questions) {
    const lengths = q.options.map((o) => o.fr.length);
    const max = Math.max(...lengths);
    const longestIds = q.options.filter((o) => o.fr.length === max).map((o) => o.id);
    if (longestIds.length === 1 && longestIds[0] === q.correctOptionId) {
      uniqueLongestCorrect += 1;
    }
  }
  return uniqueLongestCorrect / questions.length;
}

export function buildClotureCompetencyBreakdown(
  responses: Array<{ code: string; correct: boolean }>,
): Array<{ competency: string; axisCode: CompetencyAxisCode; earned: number; possible: number; pct: number }> {
  const byAxis = new Map<
    CompetencyAxisCode,
    { earned: number; possible: number }
  >();
  for (const axis of Object.keys(EVAL_CLOTURE_AXES) as CompetencyAxisCode[]) {
    byAxis.set(axis, { earned: 0, possible: 0 });
  }
  for (const q of EVAL_CLOTURE_QUESTIONS) {
    const bucket = byAxis.get(q.axisCode)!;
    bucket.possible += q.points;
    const hit = responses.find((r) => r.code === q.code);
    if (hit?.correct) bucket.earned += q.points;
  }
  return (Object.keys(EVAL_CLOTURE_AXES) as CompetencyAxisCode[]).map((axis) => {
    const b = byAxis.get(axis)!;
    return {
      competency: EVAL_CLOTURE_AXES[axis].fr,
      axisCode: axis,
      earned: b.earned,
      possible: b.possible,
      pct: b.possible > 0 ? Math.round((b.earned / b.possible) * 100) : 0,
    };
  });
}

export function interpretClotureReport(score: number): {
  levelCode: "excellent" | "good" | "sufficient" | "not_demonstrated";
  meaningFr: string;
  meaningEn: string;
} {
  if (score >= 90) {
    return {
      levelCode: "excellent",
      meaningFr: EVAL_CLOTURE_REPORT.global.excellent.fr,
      meaningEn: EVAL_CLOTURE_REPORT.global.excellent.en,
    };
  }
  if (score >= 80) {
    return {
      levelCode: "good",
      meaningFr: EVAL_CLOTURE_REPORT.global.good.fr,
      meaningEn: EVAL_CLOTURE_REPORT.global.good.en,
    };
  }
  if (score >= 70) {
    return {
      levelCode: "sufficient",
      meaningFr: EVAL_CLOTURE_REPORT.global.sufficient.fr,
      meaningEn: EVAL_CLOTURE_REPORT.global.sufficient.en,
    };
  }
  return {
    levelCode: "not_demonstrated",
    meaningFr: EVAL_CLOTURE_REPORT.global.not_demonstrated.fr,
    meaningEn: EVAL_CLOTURE_REPORT.global.not_demonstrated.en,
  };
}
