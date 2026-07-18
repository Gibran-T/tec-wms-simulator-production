/**
 * TEC.WMS — Évaluation intégrée 1 (M1–M3)
 * Canonical assessment question bank (20 × 5 pts = 100).
 */

export type Eval1QuestionDef = {
  code: string; // E1-Q01 .. E1-Q20
  moduleCode: "M1" | "M2" | "M3";
  scenarioOrProcess: string;
  competency: string;
  difficulty: "easy" | "medium" | "hard";
  questionType:
    | "conceptual"
    | "scenario"
    | "sequencing"
    | "data_interpretation"
    | "diagnosis";
  /** Learning objective (Assessment Center bank metadata). Optional in seed; defaults applied at insert. */
  learningObjectiveFr?: string;
  learningObjectiveEn?: string;
  /** Estimated response time in seconds. */
  estimatedTimeSeconds?: number;
  promptFr: string;
  promptEn: string;
  options: Array<{ id: string; fr: string; en: string }>;
  correctOptionId: string;
  explanationFr: string;
  explanationEn: string;
  points: number;
};

export const EVAL1_ASSESSMENT_CODE = "EVAL_INTEGREE_1";
export const EVAL1_PASSING_SCORE = 70;
export const EVAL1_DURATION_MINUTES = 40;
export const EVAL1_TOTAL_POINTS = 100;

export const EVAL1_QUESTIONS: Eval1QuestionDef[] = [
  // ─── Conceptual (5) ───────────────────────────────────────────────────────
  {
    code: "E1-Q01",
    moduleCode: "M1",
    scenarioOrProcess: "flux PO→GI",
    competency: "Réception et flux entrant",
    difficulty: "easy",
    questionType: "conceptual",
    promptFr:
      "Dans le flux standard M1, quelle est la séquence correcte des transactions entrantes avant qu’un picking puisse démarrer ?",
    promptEn:
      "In the standard M1 flow, what is the correct sequence of inbound transactions before picking can start?",
    options: [
      {
        id: "o1",
        fr: "PO → GR (réception) → Putaway (rangement en stock)",
        en: "PO → GR (goods receipt) → Putaway (stock placement)",
      },
      {
        id: "o2",
        fr: "GR → PO → Putaway → Picking",
        en: "GR → PO → Putaway → Picking",
      },
      {
        id: "o3",
        fr: "PO → Putaway → GR → SO",
        en: "PO → Putaway → GR → SO",
      },
      {
        id: "o4",
        fr: "SO → GR → Putaway → PO",
        en: "SO → GR → Putaway → PO",
      },
    ],
    correctOptionId: "o1",
    explanationFr:
      "Le flux entrant M1 impose d’abord la commande d’achat (PO), puis la réception (GR), puis le rangement (Putaway). Sans stock rangé, le picking sortant n’est pas fiable.",
    explanationEn:
      "The M1 inbound flow requires purchase order (PO), then goods receipt (GR), then putaway. Without putaway stock, outbound picking is not reliable.",
    points: 5,
  },
  {
    code: "E1-Q02",
    moduleCode: "M1",
    scenarioOrProcess: "écart / réception fantôme",
    competency: "Exactitude des stocks",
    difficulty: "medium",
    questionType: "conceptual",
    promptFr:
      "Une réception a été postée dans le WMS, mais aucune marchandise n’est physiquement présente en zone. Quel est le risque opérationnel immédiat ?",
    promptEn:
      "A receipt was posted in the WMS, but no goods are physically present in the zone. What is the immediate operational risk?",
    options: [
      {
        id: "o1",
        fr: "Le système bloquera automatiquement tout putaway jusqu’à inventaire annuel",
        en: "The system will automatically block all putaway until the annual inventory",
      },
      {
        id: "o2",
        fr: "Les lots FIFO seront recalculés sans impact sur le picking",
        en: "FIFO lots will be recalculated with no impact on picking",
      },
      {
        id: "o3",
        fr: "Le stock système est surévalué : un picking peut être lancé sur du stock inexistant",
        en: "System stock is overstated: picking may be launched against nonexistent stock",
      },
      {
        id: "o4",
        fr: "Seule la conformité M3 est affectée ; M1 reste opérationnel",
        en: "Only M3 compliance is affected; M1 remains operational",
      },
    ],
    correctOptionId: "o3",
    explanationFr:
      "Une réception fantôme crée un écart positif fictif. Le WMS croit disposer du stock et peut autoriser picking/GI alors que le physique est vide.",
    explanationEn:
      "A phantom receipt creates a fictitious positive variance. The WMS believes stock exists and may authorize picking/GI while physical stock is empty.",
    points: 5,
  },
  {
    code: "E1-Q03",
    moduleCode: "M2",
    scenarioOrProcess: "putaway / capacité bin",
    competency: "Capacité et division du stock",
    difficulty: "medium",
    questionType: "conceptual",
    promptFr:
      "Lors d’un putaway, le bin cible a une capacité restante inférieure à la quantité à ranger. Quelle décision opérationnelle est correcte ?",
    promptEn:
      "During putaway, the target bin has remaining capacity lower than the quantity to store. Which operational decision is correct?",
    options: [
      {
        id: "o1",
        fr: "Forcer toute la quantité dans le bin et ignorer l’alerte capacité",
        en: "Force the full quantity into the bin and ignore the capacity alert",
      },
      {
        id: "o2",
        fr: "Remplir le bin jusqu’à sa capacité, puis diviser le reste vers un autre emplacement",
        en: "Fill the bin up to capacity, then split the remainder to another location",
      },
      {
        id: "o3",
        fr: "Annuler la réception GR pour libérer de la capacité",
        en: "Cancel the GR receipt to free capacity",
      },
      {
        id: "o4",
        fr: "Basculer en FIFO et choisir le lot le plus ancien avant de ranger",
        en: "Switch to FIFO and choose the oldest lot before putaway",
      },
    ],
    correctOptionId: "o2",
    explanationFr:
      "En M2, la capacité bin est une contrainte dure : on remplit jusqu’au plafond, puis on split le surplus vers un second emplacement (ex. SCN-007).",
    explanationEn:
      "In M2, bin capacity is a hard constraint: fill up to the limit, then split the surplus to a second location (e.g. SCN-007).",
    points: 5,
  },
  {
    code: "E1-Q04",
    moduleCode: "M3",
    scenarioOrProcess: "Min/Max / safety stock",
    competency: "Réapprovisionnement",
    difficulty: "medium",
    questionType: "conceptual",
    promptFr:
      "Un SKU est sous le Min, avec Max et safety stock (SS) définis. Quelle logique de quantité de réappro est attendue ?",
    promptEn:
      "A SKU is below Min, with Max and safety stock (SS) defined. What replenishment quantity logic is expected?",
    options: [
      {
        id: "o1",
        fr: "Commander uniquement le safety stock, sans viser le Max",
        en: "Order only the safety stock, without targeting Max",
      },
      {
        id: "o2",
        fr: "Commander la différence Min − stock actuel uniquement",
        en: "Order only the difference Min − current stock",
      },
      {
        id: "o3",
        fr: "Annuler le Min et laisser le picking consommer jusqu’à zéro",
        en: "Cancel Min and let picking consume stock down to zero",
      },
      {
        id: "o4",
        fr: "Remonter le stock vers le Max (Q = Max − stock), en tenant compte du SS dans la politique",
        en: "Raise stock toward Max (Q = Max − stock), accounting for SS in the policy",
      },
    ],
    correctOptionId: "o4",
    explanationFr:
      "En politique Min/Max, le déclenchement sous Min vise à reconstituer jusqu’au Max. Le SS cadre le niveau de service ; la quantité typique est Q = Max − stock (ex. SCN-011).",
    explanationEn:
      "Under Min/Max policy, triggering below Min aims to rebuild up to Max. SS frames service level; the typical quantity is Q = Max − stock (e.g. SCN-011).",
    points: 5,
  },
  {
    code: "E1-Q05",
    moduleCode: "M3",
    scenarioOrProcess: "inventaire cyclique",
    competency: "Inventaire cyclique",
    difficulty: "easy",
    questionType: "conceptual",
    promptFr:
      "Quel est le rôle opérationnel d’un inventaire cyclique (cycle count) dans le WMS ?",
    promptEn:
      "What is the operational role of a cycle count in the WMS?",
    options: [
      {
        id: "o1",
        fr: "Compter périodiquement des SKU/emplacements ciblés pour détecter et corriger les écarts stock",
        en: "Periodically count targeted SKUs/locations to detect and correct stock variances",
      },
      {
        id: "o2",
        fr: "Remplacer le putaway en rangeant automatiquement toute la réception",
        en: "Replace putaway by automatically storing the entire receipt",
      },
      {
        id: "o3",
        fr: "Appliquer FIFO en forçant le picking du lot le plus récent",
        en: "Apply FIFO by forcing picks from the newest lot",
      },
      {
        id: "o4",
        fr: "Calculer uniquement le Max sans toucher au stock physique",
        en: "Calculate Max only without touching physical stock",
      },
    ],
    correctOptionId: "o1",
    explanationFr:
      "Le cycle count mesure le physique sur un périmètre ciblé, compare au système, puis alimente réconciliation/ajustement — sans attendre un inventaire annuel complet.",
    explanationEn:
      "Cycle count measures physical stock on a targeted scope, compares to system, then feeds reconciliation/adjustment — without waiting for a full annual inventory.",
    points: 5,
  },

  // ─── Scenario (7) ─────────────────────────────────────────────────────────
  {
    code: "E1-Q06",
    moduleCode: "M2",
    scenarioOrProcess: "SCN-007",
    competency: "Capacité et division du stock",
    difficulty: "hard",
    questionType: "scenario",
    promptFr:
      "SCN-007 : SKU-002 LOT-2025-002, 600 u en REC-01. La capacité du premier bin est 500. Quelle exécution putaway est correcte ?",
    promptEn:
      "SCN-007: SKU-002 LOT-2025-002, 600 u in REC-01. First bin capacity is 500. Which putaway execution is correct?",
    options: [
      {
        id: "o1",
        fr: "Ranger 600 u dans B-01-R1-L1 en ignorant la capacité",
        en: "Put away 600 u into B-01-R1-L1 ignoring capacity",
      },
      {
        id: "o2",
        fr: "500 → B-01-R1-L1 puis 100 → B-01-R1-L2 (capacité seule, sans règle FIFO)",
        en: "500 → B-01-R1-L1 then 100 → B-01-R1-L2 (capacity-only, no FIFO rule)",
      },
      {
        id: "o3",
        fr: "100 → B-01-R1-L1 puis 500 → B-01-R1-L2 pour respecter FIFO",
        en: "100 → B-01-R1-L1 then 500 → B-01-R1-L2 to respect FIFO",
      },
      {
        id: "o4",
        fr: "Laisser 600 u en REC-01 et passer directement au picking",
        en: "Leave 600 u in REC-01 and go straight to picking",
      },
    ],
    correctOptionId: "o2",
    explanationFr:
      "SCN-007 est capacity-only (pas de FIFO). Split canonique : 500 vers B-01-R1-L1, puis 100 vers B-01-R1-L2.",
    explanationEn:
      "SCN-007 is capacity-only (no FIFO). Canonical split: 500 to B-01-R1-L1, then 100 to B-01-R1-L2.",
    points: 5,
  },
  {
    code: "E1-Q07",
    moduleCode: "M2",
    scenarioOrProcess: "SCN-008",
    competency: "FIFO et gestion des lots",
    difficulty: "medium",
    questionType: "scenario",
    promptFr:
      "SCN-008 : stock multi-lots LOT-A (plus ancien), LOT-B et LOT-C. Quelle action de picking est conforme FIFO ?",
    promptEn:
      "SCN-008: multi-lot stock LOT-A (oldest), LOT-B and LOT-C. Which picking action complies with FIFO?",
    options: [
      {
        id: "o1",
        fr: "Piquer d’abord LOT-C car c’est le lot le plus récent",
        en: "Pick LOT-C first because it is the newest lot",
      },
      {
        id: "o2",
        fr: "Mélanger librement LOT-A, B et C dans la même ligne de pick",
        en: "Freely mix LOT-A, B and C on the same pick line",
      },
      {
        id: "o3",
        fr: "Piquer d’abord LOT-A (lot le plus ancien), puis B/C selon disponibilité",
        en: "Pick LOT-A first (oldest lot), then B/C as availability allows",
      },
      {
        id: "o4",
        fr: "Ignorer les lots et piquer uniquement par emplacement REC-01",
        en: "Ignore lots and pick only by location REC-01",
      },
    ],
    correctOptionId: "o3",
    explanationFr:
      "SCN-008 enseigne le FIFO multi-lots : LOT-A est le plus ancien et doit sortir en premier.",
    explanationEn:
      "SCN-008 teaches multi-lot FIFO: LOT-A is oldest and must be picked first.",
    points: 5,
  },
  {
    code: "E1-Q08",
    moduleCode: "M3",
    scenarioOrProcess: "SCN-009",
    competency: "Exactitude des stocks",
    difficulty: "medium",
    questionType: "scenario",
    promptFr:
      "SCN-009 : pour SKU-001, le système indique 100 u et le comptage physique donne 97 u. Quelle lecture est correcte ?",
    promptEn:
      "SCN-009: for SKU-001, the system shows 100 u and the physical count is 97 u. Which reading is correct?",
    options: [
      {
        id: "o1",
        fr: "Écart de +3 : stock physique supérieur au système",
        en: "Variance of +3: physical stock higher than system",
      },
      {
        id: "o2",
        fr: "Aucun écart : 100 et 97 sont dans la tolérance sans ajustement",
        en: "No variance: 100 and 97 are within tolerance with no adjustment",
      },
      {
        id: "o3",
        fr: "Écart de −100 : le stock système doit être mis à zéro",
        en: "Variance of −100: system stock must be zeroed",
      },
      {
        id: "o4",
        fr: "Écart de −3 : le système est surévalué de 3 unités par rapport au physique",
        en: "Variance of −3: system is overstated by 3 units versus physical",
      },
    ],
    correctOptionId: "o4",
    explanationFr:
      "Écart = physique − système = 97 − 100 = −3. Le WMS surestime le stock de 3 unités.",
    explanationEn:
      "Variance = physical − system = 97 − 100 = −3. The WMS overstates stock by 3 units.",
    points: 5,
  },
  {
    code: "E1-Q09",
    moduleCode: "M3",
    scenarioOrProcess: "SCN-011",
    competency: "Réapprovisionnement",
    difficulty: "hard",
    questionType: "scenario",
    promptFr:
      "SCN-011 (réappro seul) : SKU-004 stock 30, Min 50, Max 200, SS 25. Quelle quantité de réapprovisionnement Q est correcte ?",
    promptEn:
      "SCN-011 (replenishment-only): SKU-004 stock 30, Min 50, Max 200, SS 25. Which replenishment quantity Q is correct?",
    options: [
      {
        id: "o1",
        fr: "Q = 170 (Max − stock = 200 − 30)",
        en: "Q = 170 (Max − stock = 200 − 30)",
      },
      {
        id: "o2",
        fr: "Q = 20 (Min − stock = 50 − 30)",
        en: "Q = 20 (Min − stock = 50 − 30)",
      },
      {
        id: "o3",
        fr: "Q = 25 (égal au safety stock)",
        en: "Q = 25 (equal to safety stock)",
      },
      {
        id: "o4",
        fr: "Q = 260 (formule de SKU-005 appliquée par erreur)",
        en: "Q = 260 (SKU-005 formula applied by mistake)",
      },
    ],
    correctOptionId: "o1",
    explanationFr:
      "Sous Min, on reconstitue jusqu’au Max : Q = 200 − 30 = 170. Le SS (25) cadre la politique mais n’est pas la quantité commandée.",
    explanationEn:
      "Below Min, rebuild to Max: Q = 200 − 30 = 170. SS (25) frames policy but is not the ordered quantity.",
    points: 5,
  },
  {
    code: "E1-Q10",
    moduleCode: "M1",
    scenarioOrProcess: "stock insuffisant / GI",
    competency: "Conformité du processus",
    difficulty: "medium",
    questionType: "scenario",
    promptFr:
      "Une SO demande 80 u, mais le stock disponible confirmé après putaway n’est que de 50 u. Quelle conduite conforme est attendue ?",
    promptEn:
      "An SO requests 80 u, but confirmed available stock after putaway is only 50 u. Which compliant course of action is expected?",
    options: [
      {
        id: "o1",
        fr: "Poster quand même le GI pour 80 u afin de clôturer la commande",
        en: "Still post GI for 80 u to close the order",
      },
      {
        id: "o2",
        fr: "Bloquer le GI complet, traiter le manque (réappro/ajustement/partial selon règles) avant sortie",
        en: "Block full GI; resolve shortage (replenish/adjust/partial per rules) before goods issue",
      },
      {
        id: "o3",
        fr: "Créer une réception fantôme de 30 u pour combler l’écart",
        en: "Create a phantom receipt of 30 u to cover the gap",
      },
      {
        id: "o4",
        fr: "Ignorer la SO et lancer un inventaire cyclique M3 uniquement",
        en: "Ignore the SO and run an M3 cycle count only",
      },
    ],
    correctOptionId: "o2",
    explanationFr:
      "La conformité M1 interdit de sortir plus que le stock disponible. Le manque doit être traité avant un GI valide (thème stock insuffisant).",
    explanationEn:
      "M1 compliance forbids issuing more than available stock. The shortage must be resolved before a valid GI (insufficient-stock theme).",
    points: 5,
  },
  {
    code: "E1-Q11",
    moduleCode: "M2",
    scenarioOrProcess: "SCN-007",
    competency: "Rangement et localisation",
    difficulty: "medium",
    questionType: "scenario",
    promptFr:
      "SCN-007 : après réception en REC-01, où doivent être rangées les 600 u de SKU-002 LOT-2025-002 ?",
    promptEn:
      "SCN-007: after receipt in REC-01, where must the 600 u of SKU-002 LOT-2025-002 be put away?",
    options: [
      {
        id: "o1",
        fr: "Tout laisser en REC-01 jusqu’au picking FIFO",
        en: "Leave everything in REC-01 until FIFO picking",
      },
      {
        id: "o2",
        fr: "600 u vers B-01-R1-L2 uniquement",
        en: "600 u to B-01-R1-L2 only",
      },
      {
        id: "o3",
        fr: "500 u vers B-01-R1-L1, puis 100 u vers B-01-R1-L2",
        en: "500 u to B-01-R1-L1, then 100 u to B-01-R1-L2",
      },
      {
        id: "o4",
        fr: "300 u vers chaque bin B-01-R1-L1 et B-01-R1-L2",
        en: "300 u to each of B-01-R1-L1 and B-01-R1-L2",
      },
    ],
    correctOptionId: "o3",
    explanationFr:
      "Le rangement canonique SCN-007 place 500 en B-01-R1-L1 puis 100 en B-01-R1-L2 — sortie de la zone réception vers le stockage structuré.",
    explanationEn:
      "Canonical SCN-007 putaway places 500 in B-01-R1-L1 then 100 in B-01-R1-L2 — moving out of receiving into structured storage.",
    points: 5,
  },
  {
    code: "E1-Q12",
    moduleCode: "M3",
    scenarioOrProcess: "SCN-009",
    competency: "Ajustement",
    difficulty: "medium",
    questionType: "scenario",
    promptFr:
      "SCN-009 : après CC_COUNT et CC_RECON, l’écart SKU-001 est −3. Quel rôle de l’ajustement est correct ?",
    promptEn:
      "SCN-009: after CC_COUNT and CC_RECON, SKU-001 variance is −3. Which role of the adjustment is correct?",
    options: [
      {
        id: "o1",
        fr: "Augmenter le stock physique de 3 u sans toucher au système",
        en: "Increase physical stock by 3 u without changing the system",
      },
      {
        id: "o2",
        fr: "Remplacer le réapprovisionnement automatique par un putaway M2",
        en: "Replace automatic replenishment with an M2 putaway",
      },
      {
        id: "o3",
        fr: "Annuler CC_LIST car l’écart est trop faible pour être traité",
        en: "Cancel CC_LIST because the variance is too small to process",
      },
      {
        id: "o4",
        fr: "Aligner le stock système sur le physique (réduire de 3 u) avant de poursuivre le pipeline",
        en: "Align system stock to physical (reduce by 3 u) before continuing the pipeline",
      },
    ],
    correctOptionId: "o4",
    explanationFr:
      "L’ajustement post-réconciliation corrige le livre système pour coller au comptage (−3). Le pipeline SCN-009 enchaîne ensuite REPLENISH auto puis COMPLIANCE_M3.",
    explanationEn:
      "Post-reconciliation adjustment corrects the system book to match the count (−3). SCN-009 then continues with auto REPLENISH then COMPLIANCE_M3.",
    points: 5,
  },

  // ─── Sequencing (3) ───────────────────────────────────────────────────────
  {
    code: "E1-Q13",
    moduleCode: "M1",
    scenarioOrProcess: "flux PO→GI",
    competency: "Réception et flux entrant",
    difficulty: "medium",
    questionType: "sequencing",
    promptFr:
      "Quelle séquence complète du flux standard M1 est correcte de bout en bout ?",
    promptEn:
      "Which end-to-end sequence of the standard M1 flow is correct?",
    options: [
      {
        id: "o1",
        fr: "PO → GR → Putaway → SO → Picking → GI",
        en: "PO → GR → Putaway → SO → Picking → GI",
      },
      {
        id: "o2",
        fr: "SO → Picking → GI → PO → GR → Putaway",
        en: "SO → Picking → GI → PO → GR → Putaway",
      },
      {
        id: "o3",
        fr: "GR → PO → Picking → Putaway → SO → GI",
        en: "GR → PO → Picking → Putaway → SO → GI",
      },
      {
        id: "o4",
        fr: "PO → SO → GR → Picking → Putaway → GI",
        en: "PO → SO → GR → Picking → Putaway → GI",
      },
    ],
    correctOptionId: "o1",
    explanationFr:
      "Le flux canonique M1 enchaîne entrée (PO→GR→Putaway) puis sortie (SO→Picking→GI). Putaway avant picking garantit un stock localisé.",
    explanationEn:
      "Canonical M1 chains inbound (PO→GR→Putaway) then outbound (SO→Picking→GI). Putaway before picking ensures located stock.",
    points: 5,
  },
  {
    code: "E1-Q14",
    moduleCode: "M3",
    scenarioOrProcess: "SCN-009",
    competency: "Inventaire cyclique",
    difficulty: "hard",
    questionType: "sequencing",
    promptFr:
      "SCN-009 : quel enchaînement de steps du pipeline est correct ?",
    promptEn:
      "SCN-009: which pipeline step sequence is correct?",
    options: [
      {
        id: "o1",
        fr: "REPLENISH → CC_COUNT → CC_LIST → COMPLIANCE_M3 → CC_RECON",
        en: "REPLENISH → CC_COUNT → CC_LIST → COMPLIANCE_M3 → CC_RECON",
      },
      {
        id: "o2",
        fr: "CC_LIST → CC_COUNT → CC_RECON → REPLENISH (auto) → COMPLIANCE_M3",
        en: "CC_LIST → CC_COUNT → CC_RECON → REPLENISH (auto) → COMPLIANCE_M3",
      },
      {
        id: "o3",
        fr: "CC_RECON → CC_LIST → REPLENISH → CC_COUNT → COMPLIANCE_M3",
        en: "CC_RECON → CC_LIST → REPLENISH → CC_COUNT → COMPLIANCE_M3",
      },
      {
        id: "o4",
        fr: "CC_COUNT → COMPLIANCE_M3 → CC_LIST → CC_RECON (sans REPLENISH)",
        en: "CC_COUNT → COMPLIANCE_M3 → CC_LIST → CC_RECON (no REPLENISH)",
      },
    ],
    correctOptionId: "o2",
    explanationFr:
      "Pipeline SCN-009 : liste CC → comptage → réconciliation → réappro automatique → conformité M3.",
    explanationEn:
      "SCN-009 pipeline: CC list → count → reconciliation → auto replenish → M3 compliance.",
    points: 5,
  },
  {
    code: "E1-Q15",
    moduleCode: "M3",
    scenarioOrProcess: "SCN-011",
    competency: "Réapprovisionnement",
    difficulty: "medium",
    questionType: "sequencing",
    promptFr:
      "SCN-011 est un scénario réapprovisionnement-only (sans cycle count). Quelle séquence de steps est correcte ?",
    promptEn:
      "SCN-011 is a replenishment-only scenario (no cycle count). Which step sequence is correct?",
    options: [
      {
        id: "o1",
        fr: "CC_LIST → CC_COUNT → REPLENISH → COMPLIANCE_M3",
        en: "CC_LIST → CC_COUNT → REPLENISH → COMPLIANCE_M3",
      },
      {
        id: "o2",
        fr: "CC_RECON → REPLENISH → COMPLIANCE_M3",
        en: "CC_RECON → REPLENISH → COMPLIANCE_M3",
      },
      {
        id: "o3",
        fr: "REPLENISH → COMPLIANCE_M3",
        en: "REPLENISH → COMPLIANCE_M3",
      },
      {
        id: "o4",
        fr: "PUTAWAY → FIFO_PICK → COMPLIANCE_M3",
        en: "PUTAWAY → FIFO_PICK → COMPLIANCE_M3",
      },
    ],
    correctOptionId: "o3",
    explanationFr:
      "SCN-011 n’inclut pas les steps CC : uniquement REPLENISH puis COMPLIANCE_M3.",
    explanationEn:
      "SCN-011 has no CC steps: only REPLENISH then COMPLIANCE_M3.",
    points: 5,
  },

  // ─── Data interpretation (3) ──────────────────────────────────────────────
  {
    code: "E1-Q16",
    moduleCode: "M2",
    scenarioOrProcess: "SCN-007",
    competency: "Lecture des données WMS",
    difficulty: "hard",
    questionType: "data_interpretation",
    promptFr:
      "Données SCN-007 : REC-01 = 600 u (SKU-002 LOT-2025-002) ; capacité B-01-R1-L1 = 500 ; B-01-R1-L2 disponible. Quelle interprétation est juste ?",
    promptEn:
      "SCN-007 data: REC-01 = 600 u (SKU-002 LOT-2025-002); B-01-R1-L1 capacity = 500; B-01-R1-L2 available. Which interpretation is correct?",
    options: [
      {
        id: "o1",
        fr: "On doit d’abord piquer LOT-2025-002 depuis REC-01 avant tout putaway",
        en: "LOT-2025-002 must be picked from REC-01 before any putaway",
      },
      {
        id: "o2",
        fr: "Les 600 u tiennent dans B-01-R1-L1 car le lot est unique",
        en: "All 600 u fit in B-01-R1-L1 because there is a single lot",
      },
      {
        id: "o3",
        fr: "B-01-R1-L2 doit recevoir 600 u et L1 rester vide",
        en: "B-01-R1-L2 must receive 600 u and L1 stay empty",
      },
      {
        id: "o4",
        fr: "Il faut un split capacité 500+100 ; FIFO n’est pas le critère de ce scénario",
        en: "A 500+100 capacity split is required; FIFO is not the criterion in this scenario",
      },
    ],
    correctOptionId: "o4",
    explanationFr:
      "Lecture opérationnelle : 600 > 500 ⇒ split obligatoire. SCN-007 est capacity-only ; le FIFO est réservé à SCN-008.",
    explanationEn:
      "Operational reading: 600 > 500 ⇒ mandatory split. SCN-007 is capacity-only; FIFO belongs to SCN-008.",
    points: 5,
  },
  {
    code: "E1-Q17",
    moduleCode: "M3",
    scenarioOrProcess: "SCN-011",
    competency: "Réapprovisionnement",
    difficulty: "hard",
    questionType: "data_interpretation",
    promptFr:
      "SCN-011 : SKU-005 stock 40, Min 80, Max 300, SS 30. Quelle quantité Q doit être planifiée ?",
    promptEn:
      "SCN-011: SKU-005 stock 40, Min 80, Max 300, SS 30. Which quantity Q should be planned?",
    options: [
      {
        id: "o1",
        fr: "Q = 260 (Max − stock = 300 − 40)",
        en: "Q = 260 (Max − stock = 300 − 40)",
      },
      {
        id: "o2",
        fr: "Q = 40 (reconstituer uniquement le stock actuel)",
        en: "Q = 40 (rebuild current stock only)",
      },
      {
        id: "o3",
        fr: "Q = 170 (valeur de SKU-004 appliquée par erreur)",
        en: "Q = 170 (SKU-004 value applied by mistake)",
      },
      {
        id: "o4",
        fr: "Q = 30 (égal au safety stock)",
        en: "Q = 30 (equal to safety stock)",
      },
    ],
    correctOptionId: "o1",
    explanationFr:
      "Stock 40 < Min 80 ⇒ déclenchement. Q = Max − stock = 300 − 40 = 260. SS 30 n’est pas la quantité commandée.",
    explanationEn:
      "Stock 40 < Min 80 ⇒ trigger. Q = Max − stock = 300 − 40 = 260. SS 30 is not the ordered quantity.",
    points: 5,
  },
  {
    code: "E1-Q18",
    moduleCode: "M3",
    scenarioOrProcess: "SCN-009",
    competency: "Exactitude des stocks",
    difficulty: "medium",
    questionType: "data_interpretation",
    promptFr:
      "Tableau SCN-009 : SKU-001 | système 100 | physique 97. Quelle conclusion opérationnelle tirez-vous ?",
    promptEn:
      "SCN-009 table: SKU-001 | system 100 | physical 97. What operational conclusion do you draw?",
    options: [
      {
        id: "o1",
        fr: "Surplus physique de 3 u à recevoir en REC-01",
        en: "Physical surplus of 3 u to receive in REC-01",
      },
      {
        id: "o2",
        fr: "Manque physique de 3 u : réconcilier puis ajuster le système à la baisse",
        en: "Physical shortage of 3 u: reconcile then adjust the system downward",
      },
      {
        id: "o3",
        fr: "Écart nul : lancer directement COMPLIANCE_M3 sans CC_RECON",
        en: "Zero variance: go straight to COMPLIANCE_M3 without CC_RECON",
      },
      {
        id: "o4",
        fr: "Le Max doit être baissé de 3 avant tout comptage",
        en: "Max must be lowered by 3 before any counting",
      },
    ],
    correctOptionId: "o2",
    explanationFr:
      "97 < 100 ⇒ manque physique (−3). Après comptage, CC_RECON puis ajustement système sont requis dans le pipeline SCN-009.",
    explanationEn:
      "97 < 100 ⇒ physical shortage (−3). After counting, CC_RECON then system adjustment are required in the SCN-009 pipeline.",
    points: 5,
  },

  // ─── Diagnosis (2) ────────────────────────────────────────────────────────
  {
    code: "E1-Q19",
    moduleCode: "M2",
    scenarioOrProcess: "SCN-008",
    competency: "FIFO et gestion des lots",
    difficulty: "hard",
    questionType: "diagnosis",
    promptFr:
      "SCN-008 : un opérateur tente de piquer LOT-C alors que LOT-A (plus ancien) a encore du stock. Le système refuse. Quelle est la cause la plus probable ?",
    promptEn:
      "SCN-008: an operator tries to pick LOT-C while LOT-A (older) still has stock. The system rejects it. What is the most likely cause?",
    options: [
      {
        id: "o1",
        fr: "La capacité de B-01-R1-L1 est dépassée (règle SCN-007)",
        en: "B-01-R1-L1 capacity is exceeded (SCN-007 rule)",
      },
      {
        id: "o2",
        fr: "Le cycle count M3 n’a pas encore été clôturé",
        en: "The M3 cycle count has not been closed yet",
      },
      {
        id: "o3",
        fr: "Violation FIFO : un lot plus ancien (LOT-A) doit être consommé en premier",
        en: "FIFO violation: an older lot (LOT-A) must be consumed first",
      },
      {
        id: "o4",
        fr: "La PO entrante n’a pas été créée pour LOT-C",
        en: "The inbound PO was not created for LOT-C",
      },
    ],
    correctOptionId: "o3",
    explanationFr:
      "Diagnostic SCN-008 : avec stock restant sur LOT-A, piquer LOT-C viole le FIFO multi-lots. Le WMS bloque la conformité.",
    explanationEn:
      "SCN-008 diagnosis: with remaining LOT-A stock, picking LOT-C violates multi-lot FIFO. The WMS blocks compliance.",
    points: 5,
  },
  {
    code: "E1-Q20",
    moduleCode: "M1",
    scenarioOrProcess: "réception fantôme / écart",
    competency: "Conformité du processus",
    difficulty: "hard",
    questionType: "diagnosis",
    promptFr:
      "Après un GI, le solde système est encore positif alors que l’emplacement est vide. On découvre qu’une GR a été postée sans marchandise réelle. Quel diagnostic et quelle action correcte ?",
    promptEn:
      "After a GI, system balance is still positive while the location is empty. A GR was posted with no real goods. What diagnosis and corrective action are correct?",
    options: [
      {
        id: "o1",
        fr: "Problème FIFO uniquement : basculer vers LOT-A et clôturer",
        en: "FIFO-only issue: switch to LOT-A and close",
      },
      {
        id: "o2",
        fr: "Capacité bin insuffisante : splitter 500/100 comme en SCN-007",
        en: "Insufficient bin capacity: split 500/100 as in SCN-007",
      },
      {
        id: "o3",
        fr: "Réappro Min/Max manquant : commander Q = Max − stock immédiatement",
        en: "Missing Min/Max replenishment: immediately order Q = Max − stock",
      },
      {
        id: "o4",
        fr: "Réception fantôme : inventaire/écart puis ajustement pour rétablir l’exactitude avant de poursuivre",
        en: "Phantom receipt: count/variance then adjust to restore accuracy before continuing",
      },
    ],
    correctOptionId: "o4",
    explanationFr:
      "Une GR sans physique (réception fantôme) gonfle le stock système. Le remède conforme est de mesurer l’écart et d’ajuster, pas de contourner via FIFO/capacité/réappro.",
    explanationEn:
      "A GR without physical goods (phantom receipt) inflates system stock. The compliant fix is to measure the variance and adjust — not to bypass via FIFO/capacity/replenishment.",
    points: 5,
  },
];

/** Counts how often each option id (o1–o4) is the correct answer. */
export function countCorrectPositionDistribution(
  questions: Eval1QuestionDef[],
): Record<string, number> {
  const dist: Record<string, number> = { o1: 0, o2: 0, o3: 0, o4: 0 };
  for (const q of questions) {
    const key = q.correctOptionId;
    dist[key] = (dist[key] ?? 0) + 1;
  }
  return dist;
}
