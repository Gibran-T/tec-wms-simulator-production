/**
 * M1–M3 hub micro-drills — SAP-style situational judgment (near-miss cognition).
 * All five options must sound professionally plausible; only one is operationally correct.
 * Isolated from scenario scores / certification.
 */

export type MicroDrillOption = {
  id: string;
  label: { fr: string; en: string };
  isCorrect: boolean;
  why: { fr: string; en: string };
};

export type MicroDrill = {
  id: string;
  moduleId: 1 | 2 | 3;
  prompt: { fr: string; en: string };
  /** Short context strip (document flow / evidence) — not the answer. */
  context?: { fr: string; en: string };
  options: MicroDrillOption[];
};

export const MICRO_DRILLS: MicroDrill[] = [
  // ── M1 ───────────────────────────────────────────────────────────────────
  {
    id: "m1-drill-ghost",
    moduleId: 1,
    prompt: {
      fr: "MB52 montre 0 pour SKU-001. Vous voyez pourtant un document GR dans le journal. Quelle est la meilleure action ERP ?",
      en: "MB52 shows 0 for SKU-001. Yet you see a GR document in the journal. What is the best ERP action?",
    },
    context: {
      fr: "Document flow: PO créé · GR présent · statut ≠ POSTED · aucun putaway",
      en: "Document flow: PO created · GR present · status ≠ POSTED · no putaway",
    },
    options: [
      {
        id: "a",
        label: {
          fr: "Créer une PO corrective pour « recharger » le stock, puis poster une nouvelle GR",
          en: "Create a corrective PO to “reload” stock, then post a new GR",
        },
        isCorrect: false,
        why: {
          fr: "Near-miss dangereux : un second PO/GR crée un double flux. Le document existant doit d’abord être régularisé.",
          en: "Dangerous near-miss: a second PO/GR doubles the flow. The existing document must be regularized first.",
        },
      },
      {
        id: "b",
        label: {
          fr: "Lancer un Cycle Count immédiatement pour forcer la réconciliation inventaire",
          en: "Launch a Cycle Count immediately to force inventory reconciliation",
        },
        isCorrect: false,
        why: {
          fr: "Le CC compare physique vs système ; il ne poste pas une GR PENDING. Vous traiteriez l’effet, pas la cause documentaire.",
          en: "CC compares physical vs system; it does not post a PENDING GR. You would treat the effect, not the document cause.",
        },
      },
      {
        id: "c",
        label: {
          fr: "Ouvrir le GR existant, vérifier PENDING vs POSTED, puis poster/régulariser avant toute autre transaction",
          en: "Open the existing GR, check PENDING vs POSTED, then post/regularize before any other transaction",
        },
        isCorrect: true,
        why: {
          fr: "Correct : en SAP, un MIGO non posté n’impacte pas le stock. Evidence documentaire d’abord, puis continuum du flux.",
          en: "Correct: in SAP, an unposted MIGO does not move stock. Document evidence first, then continue the flow.",
        },
      },
      {
        id: "d",
        label: {
          fr: "Passer en SO/GI : si le stock système est 0, le scénario forcera une rupture pédagogique utile",
          en: "Go to SO/GI: if system stock is 0, the scenario will force a useful pedagogical stockout",
        },
        isCorrect: false,
        why: {
          fr: "Exécuter l’aval sans résoudre l’amont enseigne la mauvaise séquence documentaire.",
          en: "Running downstream without fixing upstream teaches the wrong document sequence.",
        },
      },
      {
        id: "e",
        label: {
          fr: "Supprimer le GR du journal et recréer PO→GR « propre » pour éviter l’ambiguïté",
          en: "Delete the GR from the journal and recreate a “clean” PO→GR to avoid ambiguity",
        },
        isCorrect: false,
        why: {
          fr: "Effacer l’historique masque l’anomalie. En entrepôt réel, on régularise ; on ne réécrit pas le passé.",
          en: "Erasing history hides the anomaly. In a real warehouse you regularize; you do not rewrite the past.",
        },
      },
    ],
  },
  {
    id: "m1-drill-cc-physical",
    moduleId: 1,
    prompt: {
      fr: "Bin B-02-R1-L1 : système 200. Comptage terrain confirmé 185. Vous êtes à l’écran Cycle Count. Que saisissez-vous ?",
      en: "Bin B-02-R1-L1: system 200. Floor count confirmed 185. You are on the Cycle Count screen. What do you enter?",
    },
    context: {
      fr: "Évidence: écart observé = −15 · l’écran demande la qty comptée, pas l’écriture ADJ",
      en: "Evidence: observed variance = −15 · screen asks for counted qty, not the ADJ posting",
    },
    options: [
      {
        id: "a",
        label: {
          fr: "−15, car le but du CC est d’enregistrer l’écart déjà calculé",
          en: "−15, because the CC goal is to record the already-computed variance",
        },
        isCorrect: false,
        why: {
          fr: "Piège classique : confondre observation et écriture. Le CC capture le physique ; le système calcule l’écart.",
          en: "Classic trap: confusing observation with posting. CC captures physical; the system computes variance.",
        },
      },
      {
        id: "b",
        label: {
          fr: "185, puis seulement ensuite décider d’un ADJ si la politique l’exige",
          en: "185, then only afterward decide on an ADJ if policy requires it",
        },
        isCorrect: true,
        why: {
          fr: "Correct : MI01/comptage = réalité terrain. L’ajustement est une décision de gouvernance séparée.",
          en: "Correct: MI01/count = floor reality. Adjustment is a separate governance decision.",
        },
      },
      {
        id: "c",
        label: {
          fr: "200, puis commenter « écart non significatif » pour protéger le KPI d’exactitude",
          en: "200, then comment “immaterial variance” to protect the accuracy KPI",
        },
        isCorrect: false,
        why: {
          fr: "Falsifier le comptage pour le KPI détruit l’auditabilité — exactement l’inverse de la conformité.",
          en: "Falsifying the count for the KPI destroys auditability — the opposite of compliance.",
        },
      },
      {
        id: "d",
        label: {
          fr: "192,5 (moyenne système/physique) pour lisser l’écart avant validation",
          en: "192.5 (system/physical average) to smooth the variance before validation",
        },
        isCorrect: false,
        why: {
          fr: "Le lissage n’est pas un comptage. En SAP, on ne « négocie » pas la qty physique.",
          en: "Smoothing is not counting. In SAP you do not “negotiate” the physical qty.",
        },
      },
      {
        id: "e",
        label: {
          fr: "0 puis ADJ +185 pour reconstruire le stock « depuis zéro » plus clairement",
          en: "0 then ADJ +185 to rebuild stock “from zero” more clearly",
        },
        isCorrect: false,
        why: {
          fr: "Sur-correction artificielle. Le chemin professionnel reste : compter 185 → analyser −15 → ADJ si requis.",
          en: "Artificial over-correction. The professional path remains: count 185 → analyze −15 → ADJ if required.",
        },
      },
    ],
  },
  {
    id: "m1-drill-sequence",
    moduleId: 1,
    prompt: {
      fr: "GR postée sur REC-01 (100 u.). Le superviseur demande d’expédier 40 u. aujourd’hui. Quelle séquence est cognitivement saine ?",
      en: "GR posted on REC-01 (100 u.). Supervisor asks to ship 40 u. today. Which sequence is cognitively sound?",
    },
    context: {
      fr: "Flux nominal: PO→GR→Putaway→Stock→SO→Pick→GI",
      en: "Nominal flow: PO→GR→Putaway→Stock→SO→Pick→GI",
    },
    options: [
      {
        id: "a",
        label: {
          fr: "SO → GI direct depuis REC-01 pour gagner du temps (quai = stock disponible)",
          en: "SO → GI direct from REC-01 to save time (dock = available stock)",
        },
        isCorrect: false,
        why: {
          fr: "Near-miss opérationnel : le quai n’est pas une zone de picking stable. Vous cassez putaway + traçabilité.",
          en: "Operational near-miss: the dock is not a stable picking zone. You break putaway + traceability.",
        },
      },
      {
        id: "b",
        label: {
          fr: "Putaway vers STOCKAGE → confirmer stock → SO → picking → GI",
          en: "Putaway to STORAGE → confirm stock → SO → picking → GI",
        },
        isCorrect: true,
        why: {
          fr: "Correct : stock exploitable après rangement, puis allocation/picking, puis sortie.",
          en: "Correct: usable stock after putaway, then allocation/picking, then goods issue.",
        },
      },
      {
        id: "c",
        label: {
          fr: "CC d’abord (prouver 100), puis GI, le putaway pourra attendre la fin de journée",
          en: "CC first (prove 100), then GI; putaway can wait until end of day",
        },
        isCorrect: false,
        why: {
          fr: "Le CC ne remplace pas le transfert de zone. L’expédition depuis quai reste non conforme.",
          en: "CC does not replace the zone transfer. Shipping from dock remains non-compliant.",
        },
      },
      {
        id: "d",
        label: {
          fr: "SO immédiat, puis putaway « rétroactif » après GI pour aligner les documents",
          en: "Immediate SO, then “retroactive” putaway after GI to align documents",
        },
        isCorrect: false,
        why: {
          fr: "Putaway rétroactif = réécriture d’histoire. La séquence documentaire doit précéder la sortie.",
          en: "Retroactive putaway = rewriting history. Document sequence must precede goods issue.",
        },
      },
      {
        id: "e",
        label: {
          fr: "Créer un second GR en STOCKAGE pour « téléporter » les 100 u. sans LT01",
          en: "Create a second GR into STORAGE to “teleport” the 100 u. without LT01",
        },
        isCorrect: false,
        why: {
          fr: "Second GR = double réception fictive. Le mouvement correct est un putaway, pas une nouvelle réception.",
          en: "Second GR = fictitious double receipt. The correct movement is putaway, not a new receipt.",
        },
      },
    ],
  },

  // ── M2 ───────────────────────────────────────────────────────────────────
  {
    id: "m2-drill-capacity",
    moduleId: 2,
    prompt: {
      fr: "600 u. postées en REC-01. B-01-R1-L1 max = 500. Quelle décision de rangement est conforme au contrat de capacité ?",
      en: "600 u. posted in REC-01. B-01-R1-L1 max = 500. Which putaway decision complies with the capacity contract?",
    },
    context: {
      fr: "M2: GR souvent pré-postée · skill = putaway/capacité · total 600 doit être rangé",
      en: "M2: GR often pre-posted · skill = putaway/capacity · all 600 must be put away",
    },
    options: [
      {
        id: "a",
        label: {
          fr: "Ranger 600 dans L1 : le système « devrait » autoriser un overflow temporaire géré au picking",
          en: "Put 600 into L1: the system “should” allow temporary overflow managed at picking",
        },
        isCorrect: false,
        why: {
          fr: "La capacité est une contrainte dure. L’overflow pédagogique est rejeté — ce n’est pas un buffer métier.",
          en: "Capacity is a hard constraint. Pedagogical overflow is rejected — it is not a business buffer.",
        },
      },
      {
        id: "b",
        label: {
          fr: "Splitter 400+200 sur L1/L2 pour « équilibrer » la charge visuelle des allées",
          en: "Split 400+200 on L1/L2 to “balance” aisle visual load",
        },
        isCorrect: false,
        why: {
          fr: "Near-miss : total 600 OK, mais le contrat SCN-007 exige 500+100 (max L1). L’esthétique n’est pas la règle.",
          en: "Near-miss: total 600 OK, but SCN-007 contract requires 500+100 (L1 max). Aesthetics is not the rule.",
        },
      },
      {
        id: "c",
        label: {
          fr: "500 → B-01-R1-L1 puis 100 → B-01-R1-L2, dans cet ordre contractuel",
          en: "500 → B-01-R1-L1 then 100 → B-01-R1-L2, in that contractual order",
        },
        isCorrect: true,
        why: {
          fr: "Correct : respecter max bin + séquence. C’est de la discipline d’emplacement, pas de l’approximation.",
          en: "Correct: respect bin max + sequence. This is location discipline, not approximation.",
        },
      },
      {
        id: "d",
        label: {
          fr: "Laisser 100 sur REC-01 « en réserve quai » et ne ranger que 500 — le quai absorbe l’excédent",
          en: "Leave 100 on REC-01 as “dock reserve” and put away only 500 — dock absorbs the excess",
        },
        isCorrect: false,
        why: {
          fr: "Le quai n’est pas un stock de réserve. Le skill M2 exige le rangement complet du volume reçu.",
          en: "The dock is not reserve stock. The M2 skill requires full putaway of the received volume.",
        },
      },
      {
        id: "e",
        label: {
          fr: "Créer une GR partielle de 500 seulement pour que le putaway « tombe juste » sur L1",
          en: "Create a partial GR of 500 only so putaway “fits perfectly” on L1",
        },
        isCorrect: false,
        why: {
          fr: "La GR est déjà postée (600). Recréer/altérer la réception pour faciliter le putaway est une fraude documentaire.",
          en: "GR is already posted (600). Recreating/altering receipt to ease putaway is document fraud.",
        },
      },
    ],
  },
  {
    id: "m2-drill-fifo",
    moduleId: 2,
    prompt: {
      fr: "Trois lots du même SKU en STOCKAGE. Un SO demande 20 u. Quelle lecture FIFO est la bonne ?",
      en: "Three lots of the same SKU in STORAGE. An SO needs 20 u. Which FIFO reading is correct?",
    },
    context: {
      fr: "Lots: LOT-A (plus ancien) · LOT-B · LOT-C (plus récent) · qty suffisante sur plusieurs lots",
      en: "Lots: LOT-A (oldest) · LOT-B · LOT-C (newest) · enough qty across lots",
    },
    options: [
      {
        id: "a",
        label: {
          fr: "Prélever LOT-C : plus récent = moins de risque qualité / moins de réclamations",
          en: "Pick LOT-C: newer = lower quality risk / fewer claims",
        },
        isCorrect: false,
        why: {
          fr: "C’est du LIFO « qualité perçue ». Ici la règle enseignée est FIFO (plus ancien d’abord).",
          en: "That is “perceived quality” LIFO. The taught rule here is FIFO (oldest first).",
        },
      },
      {
        id: "b",
        label: {
          fr: "Prélever le lot le plus proche du quai d’expédition pour minimiser les mètres parcourus",
          en: "Pick the lot closest to the shipping dock to minimize travel meters",
        },
        isCorrect: false,
        why: {
          fr: "Near-miss lean : la distance compte en productivité, mais ne prime pas sur la discipline de lot FIFO.",
          en: "Lean near-miss: distance matters for productivity, but does not outrank FIFO lot discipline.",
        },
      },
      {
        id: "c",
        label: {
          fr: "Prélever LOT-A (plus ancien), même si un autre lot est plus « pratique » à atteindre",
          en: "Pick LOT-A (oldest), even if another lot is more “convenient” to reach",
        },
        isCorrect: true,
        why: {
          fr: "Correct : First In, First Out. La contrainte de lot prime sur le confort de parcours.",
          en: "Correct: First In, First Out. Lot constraint outranks travel comfort.",
        },
      },
      {
        id: "d",
        label: {
          fr: "Mélanger 10 LOT-A + 10 LOT-C sur une seule ligne de picking pour « moyenne » les dates",
          en: "Mix 10 LOT-A + 10 LOT-C on one pick line to “average” the dates",
        },
        isCorrect: false,
        why: {
          fr: "Le mix masque la traçabilité. Une ligne de picking FIFO doit porter le lot exigé.",
          en: "Mixing hides traceability. A FIFO pick line must carry the required lot.",
        },
      },
      {
        id: "e",
        label: {
          fr: "Ignorer le lot si la quantité totale bin est exacte — le WMS « saura » redistribuer",
          en: "Ignore lot if total bin qty is exact — the WMS will “know” how to redistribute",
        },
        isCorrect: false,
        why: {
          fr: "Qty exacte ≠ lot exact. Sans lot, FIFO et rappel produit deviennent impossibles.",
          en: "Exact qty ≠ exact lot. Without lot, FIFO and product recall become impossible.",
        },
      },
    ],
  },
  {
    id: "m2-drill-preposted",
    moduleId: 2,
    prompt: {
      fr: "Vous ouvrez SCN-006. Le stock quai est déjà là, aucune PO à créer. Que comprenez-vous ?",
      en: "You open SCN-006. Dock stock is already there; no PO to create. What do you understand?",
    },
    context: {
      fr: "Mission Sheet: GR pré-chargée · objectif = rangement structuré / capacité / FIFO selon SCN",
      en: "Mission Sheet: GR preloaded · objective = structured putaway / capacity / FIFO per SCN",
    },
    options: [
      {
        id: "a",
        label: {
          fr: "Le scénario est incomplet : je dois recréer PO→GR pour « prouver » le flux M1",
          en: "The scenario is incomplete: I must recreate PO→GR to “prove” the M1 flow",
        },
        isCorrect: false,
        why: {
          fr: "Piège de transfert M1→M2. Recréer PO/GR hors contrat casse l’objectif pédagogique du module.",
          en: "M1→M2 transfer trap. Recreating PO/GR outside contract breaks the module learning objective.",
        },
      },
      {
        id: "b",
        label: {
          fr: "L’état initial est volontaire : je commence au putaway et je lis les contraintes de bin/lot",
          en: "Initial state is intentional: I start at putaway and read bin/lot constraints",
        },
        isCorrect: true,
        why: {
          fr: "Correct : comme un TO SAP déjà créé, le travail commence à l’exécution d’entrepôt.",
          en: "Correct: like an already-created SAP TO, work starts at warehouse execution.",
        },
      },
      {
        id: "c",
        label: {
          fr: "Je peux sauter au FIFO pick sans putaway, car le stock « existe déjà » quelque part",
          en: "I can jump to FIFO pick without putaway, because stock “already exists” somewhere",
        },
        isCorrect: false,
        why: {
          fr: "« Existe quelque part » ≠ correctement rangé. Plusieurs SCN M2 exigent d’abord le putaway.",
          en: "“Exists somewhere” ≠ correctly put away. Several M2 SCNs require putaway first.",
        },
      },
      {
        id: "d",
        label: {
          fr: "Je lance un CC avant tout pour valider que le seed n’a pas « triché » les quantités",
          en: "I run a CC first to validate the seed did not “cheat” the quantities",
        },
        isCorrect: false,
        why: {
          fr: "Méfiance inutile : le seed est le contrat. Le skill demandé n’est pas l’audit du seed.",
          en: "Unnecessary distrust: the seed is the contract. The skill is not auditing the seed.",
        },
      },
      {
        id: "e",
        label: {
          fr: "Je change de scénario : sans créer la PO moi-même, je n’aurai pas de points M2",
          en: "I switch scenario: without creating the PO myself I will not earn M2 points",
        },
        isCorrect: false,
        why: {
          fr: "Les points M2 portent sur putaway/capacité/FIFO, pas sur la recréation du flux M1.",
          en: "M2 points cover putaway/capacity/FIFO, not recreating the M1 flow.",
        },
      },
    ],
  },

  // ── M3 ───────────────────────────────────────────────────────────────────
  {
    id: "m3-drill-minmax",
    moduleId: 3,
    prompt: {
      fr: "Paramètres: Min 40 · Max 200 · stock disponible 30 · SS 20. Quelle qty de réappro est alignée SCN-011 ?",
      en: "Params: Min 40 · Max 200 · available stock 30 · SS 20. Which replenishment qty aligns with SCN-011?",
    },
    context: {
      fr: "Évaluation = Min/Max opérationnel · pas un examen EOQ théorique",
      en: "Evaluation = operational Min/Max · not a theoretical EOQ exam",
    },
    options: [
      {
        id: "a",
        label: {
          fr: "Q = √(2DS/H) (EOQ) puis arrondir au multiple de carton le plus proche",
          en: "Q = √(2DS/H) (EOQ) then round to nearest case pack",
        },
        isCorrect: false,
        why: {
          fr: "Near-miss académique : EOQ peut être vrai en cours, mais SCN-011 score Q = Max − stock.",
          en: "Academic near-miss: EOQ may be true in class, but SCN-011 scores Q = Max − stock.",
        },
      },
      {
        id: "b",
        label: {
          fr: "Q = Max − stock = 170",
          en: "Q = Max − stock = 170",
        },
        isCorrect: true,
        why: {
          fr: "Correct : ramener au Max. Le SS explique le buffer ; il ne remplace pas la formule Min/Max ici.",
          en: "Correct: bring back to Max. SS explains the buffer; it does not replace the Min/Max formula here.",
        },
      },
      {
        id: "c",
        label: {
          fr: "Q = Max − Min = 160 (bande utile), car le Min est déjà « consommé »",
          en: "Q = Max − Min = 160 (useful band), because Min is already “consumed”",
        },
        isCorrect: false,
        why: {
          fr: "Max−Min ignore le stock réel (30). La décision part du disponible observé.",
          en: "Max−Min ignores real stock (30). The decision starts from observed on-hand.",
        },
      },
      {
        id: "d",
        label: {
          fr: "Q = Min + SS − stock = 30, juste assez pour repasser au-dessus du Min",
          en: "Q = Min + SS − stock = 30, just enough to climb back above Min",
        },
        isCorrect: false,
        why: {
          fr: "Remonter au Min/SS sous-approvisionne vs politique Max. Ce n’est pas le contrat SCN-011.",
          en: "Climbing only to Min/SS under-replenishes vs Max policy. Not the SCN-011 contract.",
        },
      },
      {
        id: "e",
        label: {
          fr: "Q = 0 : stock 30 > 0, donc pas de rupture « vraie » — attendre le prochain CC",
          en: "Q = 0: stock 30 > 0, so no “real” stockout — wait for the next CC",
        },
        isCorrect: false,
        why: {
          fr: "Sous le Min, le signal de réappro est déjà actif. Attendre le CC confond inventaire et planification.",
          en: "Below Min, the replenishment signal is already active. Waiting for CC confuses inventory with planning.",
        },
      },
    ],
  },
  {
    id: "m3-drill-justify",
    moduleId: 3,
    prompt: {
      fr: "CC: système 120, physique 92 (écart −28). Seuil de justification = 20. Quelle gouvernance appliquez-vous ?",
      en: "CC: system 120, physical 92 (variance −28). Justification threshold = 20. Which governance do you apply?",
    },
    context: {
      fr: "Pipeline M3: CC_LIST → CC_COUNT → CC_RECON(+ADJ) → REPLENISH",
      en: "M3 pipeline: CC_LIST → CC_COUNT → CC_RECON(+ADJ) → REPLENISH",
    },
    options: [
      {
        id: "a",
        label: {
          fr: "Poster ADJ −28 immédiatement : le seuil sert seulement aux rapports hebdomadaires",
          en: "Post ADJ −28 immediately: the threshold is only for weekly reports",
        },
        isCorrect: false,
        why: {
          fr: "Near-miss « vitesse » : au-delà du seuil, la justification est une condition de validation, pas un reporting cosmétique.",
          en: "“Speed” near-miss: above threshold, justification is a validation condition, not cosmetic reporting.",
        },
      },
      {
        id: "b",
        label: {
          fr: "Saisir 92 au CC, documenter la cause probable, puis ADJ avec justification — ensuite seulement réappro",
          en: "Enter 92 in CC, document the likely cause, then ADJ with justification — only then replenish",
        },
        isCorrect: true,
        why: {
          fr: "Correct : compter → expliquer → ajuster → planifier. Le réappro sur stock non réconcilié ment au S&OP.",
          en: "Correct: count → explain → adjust → plan. Replenishing on unreconciled stock lies to S&OP.",
        },
      },
      {
        id: "c",
        label: {
          fr: "Ignorer l’écart < 30 % du stock et passer au Min/Max pour ne pas bloquer l’équipe",
          en: "Ignore variance < 30% of stock and jump to Min/Max so the team is not blocked",
        },
        isCorrect: false,
        why: {
          fr: "Un seuil pédagogique (20) est déjà défini. Inventer 30 % contourne la gouvernance.",
          en: "A pedagogical threshold (20) is already defined. Inventing 30% bypasses governance.",
        },
      },
      {
        id: "d",
        label: {
          fr: "Commander Q = 28 en urgence : remplacer l’écart par du stock neuf sans ADJ",
          en: "Urgently order Q = 28: replace the variance with new stock without ADJ",
        },
        isCorrect: false,
        why: {
          fr: "Réappro ≠ réconciliation. Sans ADJ, le système garde 120 alors que le physique est 92.",
          en: "Replenishment ≠ reconciliation. Without ADJ, the system keeps 120 while physical is 92.",
        },
      },
      {
        id: "e",
        label: {
          fr: "Recalculer le Max à 92 pour « normaliser » le stock et éviter un ADJ négatif visible",
          en: "Recalculate Max to 92 to “normalize” stock and avoid a visible negative ADJ",
        },
        isCorrect: false,
        why: {
          fr: "Changer le Max pour cacher l’écart est une manipulation de paramètre, pas un contrôle d’inventaire.",
          en: "Changing Max to hide variance is parameter manipulation, not inventory control.",
        },
      },
    ],
  },
  {
    id: "m3-drill-order",
    moduleId: 3,
    prompt: {
      fr: "Un collègue veut calculer Min/Max avant le Cycle Count « pour gagner du temps ». Que répondez-vous ?",
      en: "A colleague wants to compute Min/Max before Cycle Count “to save time.” What do you answer?",
    },
    context: {
      fr: "Ordre simulateur: inventaire fiable → puis suggestions de réappro",
      en: "Simulator order: reliable inventory → then replenishment suggestions",
    },
    options: [
      {
        id: "a",
        label: {
          fr: "D’accord : le Min/Max est indépendant du CC, on peut paralléliser sans risque",
          en: "Agreed: Min/Max is independent of CC, we can parallelize with no risk",
        },
        isCorrect: false,
        why: {
          fr: "Si le stock système est faux, Q = Max − stock propage l’erreur dans tout le plan.",
          en: "If system stock is wrong, Q = Max − stock propagates the error into the whole plan.",
        },
      },
      {
        id: "b",
        label: {
          fr: "Non : d’abord CC/réconciliation (stock fiable), ensuite Min/Max — sinon on planifie sur une fiction",
          en: "No: first CC/reconciliation (reliable stock), then Min/Max — otherwise we plan on fiction",
        },
        isCorrect: true,
        why: {
          fr: "Correct : la planification hérite de la vérité inventaire. C’est le sens du pipeline M3.",
          en: "Correct: planning inherits inventory truth. That is the point of the M3 pipeline.",
        },
      },
      {
        id: "c",
        label: {
          fr: "Oui si on ajoute 10 % de SS « buffer cognitif » pour compenser l’incertitude du CC",
          en: "Yes if we add a 10% SS “cognitive buffer” to compensate CC uncertainty",
        },
        isCorrect: false,
        why: {
          fr: "Un buffer inventé ne remplace pas un comptage. Vous masquez l’incertitude au lieu de la mesurer.",
          en: "An invented buffer does not replace a count. You hide uncertainty instead of measuring it.",
        },
      },
      {
        id: "d",
        label: {
          fr: "Peu importe l’ordre : la conformité M3 ne regarde que le total des points, pas la séquence",
          en: "Order does not matter: M3 compliance only looks at total points, not sequence",
        },
        isCorrect: false,
        why: {
          fr: "Faux : la conformité valide la chaîne de preuves, pas seulement un score agrégé.",
          en: "False: compliance validates the evidence chain, not only an aggregated score.",
        },
      },
      {
        id: "e",
        label: {
          fr: "Faire Min/Max d’abord, puis « ajuster » le CC pour coller aux suggestions déjà calculées",
          en: "Do Min/Max first, then “adjust” the CC to match suggestions already computed",
        },
        isCorrect: false,
        why: {
          fr: "Inverser preuve et plan = fraude douce. Le comptage doit contraindre le plan, jamais l’inverse.",
          en: "Inverting evidence and plan = soft fraud. The count must constrain the plan, never the reverse.",
        },
      },
    ],
  },
];

export function getMicroDrillsForModule(moduleId: number): MicroDrill[] {
  return MICRO_DRILLS.filter((d) => d.moduleId === moduleId);
}
