/** Display-only cockpit pedagogy per SCN — no scenario/scoring logic. */
export interface CockpitPedagogy {
  scnCode: string;
  situation: { fr: string; en: string };
  evidenceToObserve: { fr: string; en: string };
  operationalProblem: { fr: string; en: string };
  expectedActionHint: { fr: string; en: string };
  emptyStockNote?: { fr: string; en: string };
  transactionMonitorHint: { fr: string; en: string };
  complianceHint: { fr: string; en: string };
  learningTakeaway: { fr: string; en: string };
}

export const SCENARIO_COCKPIT_PEDAGOGY: Record<string, CockpitPedagogy> = {
  "SCN-001": {
    scnCode: "SCN-001",
    situation: {
      fr: "Entrepôt vide — flux nominal. Contrat : PO-2025-101 · GR-2025-101 · SO-2025-101 · SKU-001 · 100 u. · REC-01 → B-01-R1-L1 · expédition 80 u. EXP-01.",
      en: "Empty warehouse — nominal flow. Contract: PO-2025-101 · GR-2025-101 · SO-2025-101 · SKU-001 · 100 u. · REC-01 → B-01-R1-L1 · ship 80 u. EXP-01.",
    },
    evidenceToObserve: {
      fr: "Stocks vides au départ ; chaque document posté (PO-2025-101, GR-2025-101, SO-2025-101) apparaît dans le moniteur.",
      en: "Empty stock at start; each posted document (PO-2025-101, GR-2025-101, SO-2025-101) appears in the monitor.",
    },
    operationalProblem: { fr: "Construire le cycle complet avec les références contractuelles.", en: "Build the complete cycle with contractual references." },
    expectedActionHint: {
      fr: "PO-2025-101 → GR-2025-101 → PUTAWAY B-01-R1-L1 → SO-2025-101 (80 u.) → GI EXP-01 (80 u.) → CC → conformité.",
      en: "PO-2025-101 → GR-2025-101 → PUTAWAY B-01-R1-L1 → SO-2025-101 (80 u.) → GI EXP-01 (80 u.) → CC → compliance.",
    },
    emptyStockNote: { fr: "Stock vide au départ : normal. Le stock n'apparaît qu'après réception postée (GR).", en: "Empty stock at start: expected. Stock appears only after posted receipt (GR)." },
    transactionMonitorHint: { fr: "Vérifiez que chaque document est POSTED avant l'étape suivante.", en: "Verify each document is POSTED before the next step." },
    complianceHint: { fr: "Conformité = aucune transaction en attente, pas de stock négatif, pas d'écart ouvert.", en: "Compliance = no pending transactions, no negative stock, no open variance." },
    learningTakeaway: { fr: "Le WMS reflète la réalité physique uniquement après validation des documents.", en: "The WMS reflects physical reality only after document validation." },
  },
  "SCN-002": {
    scnCode: "SCN-002",
    situation: {
      fr: "PO-2025-001 POSTED · GR-2025-001 PENDING · SKU-001 · 100 u. REC-01. Post-résolution : SO-2025-101 · 80 u. · EXP-01.",
      en: "PO-2025-001 POSTED · GR-2025-001 PENDING · SKU-001 · 100 u. REC-01. After fix: SO-2025-101 · 80 u. · EXP-01.",
    },
    evidenceToObserve: {
      fr: "Moniteur : GR-2025-001 PENDING vs PO-2025-001 POSTED ; REC-01 vide jusqu'à post GR.",
      en: "Monitor: GR-2025-001 PENDING vs PO-2025-001 POSTED; REC-01 empty until GR posted.",
    },
    operationalProblem: { fr: "GR-2025-001 non postée — stock indisponible.", en: "GR-2025-001 unposted — stock unavailable." },
    expectedActionHint: {
      fr: "Poster GR-2025-001 → PUTAWAY B-01-R1-L1 → SO-2025-101 (80 u.) → GI EXP-01.",
      en: "Post GR-2025-001 → PUTAWAY B-01-R1-L1 → SO-2025-101 (80 u.) → GI EXP-01.",
    },
    emptyStockNote: { fr: "REC-01 vide malgré la PO : l'anomalie est la GR non postée, pas un bug.", en: "REC-01 empty despite PO: the anomaly is the unposted GR, not a bug." },
    transactionMonitorHint: { fr: "Comparez PO (POSTED) vs GR (PENDING) — c'est la preuve de l'anomalie.", en: "Compare PO (POSTED) vs GR (PENDING) — that's the evidence." },
    complianceHint: { fr: "Tant qu'une GR reste PENDING, la conformité finale sera bloquée.", en: "While a GR remains PENDING, final compliance will be blocked." },
    learningTakeaway: { fr: "Réception physique ≠ stock ERP tant que la transaction n'est pas postée.", en: "Physical receipt ≠ ERP stock until the transaction is posted." },
  },
  "SCN-003": {
    scnCode: "SCN-003",
    situation: {
      fr: "PO-2025-002 · GR-2025-002 : 50 u. SKU-003 REC-01. Contrat : putaway B-01-R1-L2 · SO-2025-101 80 u. · PO corrective PO-2025-003 +30 u.",
      en: "PO-2025-002 · GR-2025-002: 50 u. SKU-003 REC-01. Contract: putaway B-01-R1-L2 · SO-2025-101 80 u. · corrective PO-2025-003 +30 u.",
    },
    evidenceToObserve: {
      fr: "50 u. à REC-01 ; après putaway B-01-R1-L2, SO 80 u. exige +30 u. réappro.",
      en: "50 u. at REC-01; after putaway B-01-R1-L2, SO 80 u. requires +30 u. replenishment.",
    },
    operationalProblem: { fr: "Déficit contractuel 30 u. (80 − 50) avant GI.", en: "Contract deficit 30 u. (80 − 50) before GI." },
    expectedActionHint: {
      fr: "PUTAWAY B-01-R1-L2 → SO-2025-101 (80 u.) → PO-2025-003 (+30 u.) + GR → GI 80 u.",
      en: "PUTAWAY B-01-R1-L2 → SO-2025-101 (80 u.) → PO-2025-003 (+30 u.) + GR → GI 80 u.",
    },
    emptyStockNote: { fr: "Stock au quai REC-01 — le rangement n'est pas encore fait ; ce n'est pas un bin de picking.", en: "Stock at dock REC-01 — putaway not done yet; this is not a picking bin." },
    transactionMonitorHint: { fr: "Suivez le mouvement REC-01 → STOCKAGE et les quantités disponibles.", en: "Track REC-01 → STOCKAGE movement and available quantities." },
    complianceHint: { fr: "La GI ne doit pas créer de stock négatif.", en: "GI must not create negative stock." },
    learningTakeaway: { fr: "ATP et réapprovisionnement protègent le service client.", en: "ATP and replenishment protect customer service." },
  },
  "SCN-004": {
    scnCode: "SCN-004",
    situation: { fr: "200 unités reçues ; un écart inventaire apparaîtra au comptage.", en: "200 units received; inventory variance will appear at count." },
    evidenceToObserve: { fr: "Stock système après expédition ; préparez le cycle count sur SKU-006.", en: "System stock after shipment; prepare cycle count on SKU-006." },
    operationalProblem: { fr: "Écart physique −15 à documenter et corriger.", en: "Physical variance −15 to document and correct." },
    expectedActionHint: { fr: "Rangez REC-01 → B-02-R1-L1, complétez le flux expédition, puis comptez SKU-006 à B-02-R1-L1 (quantité physique 185).", en: "Put away REC-01 → B-02-R1-L1, complete shipping flow, then count SKU-006 at B-02-R1-L1 (physical qty 185)." },
    transactionMonitorHint: { fr: "Tracez PO → GR → putaway → SO → GI avant le comptage.", en: "Trace PO → GR → putaway → SO → GI before counting." },
    complianceHint: { fr: "Écart non résolu = conformité bloquée.", en: "Unresolved variance = compliance blocked." },
    learningTakeaway: { fr: "L'inventaire cyclique réconcilie le physique et le système.", en: "Cycle counting reconciles physical and system." },
  },
  "SCN-005": {
    scnCode: "SCN-005",
    situation: { fr: "Deux anomalies simultanées : GR fantôme + écart inventaire.", en: "Two simultaneous anomalies: ghost GR + inventory variance." },
    evidenceToObserve: { fr: "GR-2025-004 PENDING (SKU-004) ; SKU-005 avec écart −8 au comptage.", en: "GR-2025-004 PENDING (SKU-004); SKU-005 with −8 variance at count." },
    operationalProblem: { fr: "Ordre de résolution : documents → physique → expédition.", en: "Resolution order: documents → physical → shipping." },
    expectedActionHint: { fr: "Postez GR-2025-004 avant le rangement SKU-004 ; traitez l'écart SKU-005 avant conformité.", en: "Post GR-2025-004 before SKU-004 putaway; resolve SKU-005 variance before compliance." },
    transactionMonitorHint: { fr: "Deux lignes PENDING possibles — traitez-les dans l'ordre métier.", en: "Two possible PENDING lines — handle in business order." },
    complianceHint: { fr: "Chaque bloqueur doit être levé avant clôture.", en: "Each blocker must be cleared before closing." },
    learningTakeaway: { fr: "En crise logistique, prioriser documents puis physique.", en: "In logistics crisis, prioritize documents then physical." },
  },
  "SCN-006": {
    scnCode: "SCN-006",
    situation: {
      fr: "PO-M2-001 · GR-M2-001 : 150 u. SKU-001 REC-01 · lot LOT-2025-001 · destination B-01-R1-L1.",
      en: "PO-M2-001 · GR-M2-001: 150 u. SKU-001 REC-01 · lot LOT-2025-001 · destination B-01-R1-L1.",
    },
    evidenceToObserve: {
      fr: "GR-M2-001 POSTED ; lot LOT-2025-001 requis au PUTAWAY M2.",
      en: "GR-M2-001 POSTED; lot LOT-2025-001 required at M2 PUTAWAY.",
    },
    operationalProblem: { fr: "Putaway contractuel avec lot LOT-2025-001 vers B-01-R1-L1.", en: "Contract putaway with lot LOT-2025-001 to B-01-R1-L1." },
    expectedActionHint: {
      fr: "PUTAWAY : REC-01 → B-01-R1-L1 · 150 u. · lot LOT-2025-001.",
      en: "PUTAWAY: REC-01 → B-01-R1-L1 · 150 u. · lot LOT-2025-001.",
    },
    transactionMonitorHint: { fr: "PO-M2-001 et GR-M2-001 doivent être POSTED avant putaway.", en: "PO-M2-001 and GR-M2-001 must be POSTED before putaway." },
    complianceHint: { fr: "Conformité M2 après FIFO, précision stock et validation avancée.", en: "M2 compliance after FIFO, stock accuracy and advanced validation." },
    learningTakeaway: { fr: "Le putaway structure la traçabilité emplacement.", en: "Putaway structures location traceability." },
  },
  "SCN-007": {
    scnCode: "SCN-007",
    situation: {
      fr: "PO-M2-002 · GR-M2-002 : 600 u. SKU-002 · lot LOT-2025-002 · split B-01-R1-L1 (500) + B-01-R1-L2 (100).",
      en: "PO-M2-002 · GR-M2-002: 600 u. SKU-002 · lot LOT-2025-002 · split B-01-R1-L1 (500) + B-01-R1-L2 (100).",
    },
    evidenceToObserve: {
      fr: "Capacité B-01-R1-L1 = 500 u. ; lot LOT-2025-002 obligatoire au putaway.",
      en: "B-01-R1-L1 capacity = 500 u.; lot LOT-2025-002 mandatory at putaway.",
    },
    operationalProblem: { fr: "Répartition contractuelle 500 + 100 u. sans overflow.", en: "Contract split 500 + 100 u. without overflow." },
    expectedActionHint: {
      fr: "PUTAWAY split : B-01-R1-L1 500 u. + B-01-R1-L2 100 u. · lot LOT-2025-002.",
      en: "PUTAWAY split: B-01-R1-L1 500 u. + B-01-R1-L2 100 u. · lot LOT-2025-002.",
    },
    transactionMonitorHint: { fr: "GR-M2-002 POSTED — 600 u. à placer sans overflow.", en: "GR-M2-002 POSTED — 600 u. to place without overflow." },
    complianceHint: { fr: "Aucun bin ne doit dépasser sa capacité max.", en: "No bin may exceed max capacity." },
    learningTakeaway: { fr: "La capacité d'emplacement évite la saturation des slots.", en: "Bin capacity prevents slot saturation." },
  },
  "SCN-008": {
    scnCode: "SCN-008",
    situation: { fr: "3 lots SKU-003 préchargés en STOCKAGE (jan, fév, mars) — putaway déjà fait.", en: "3 SKU-003 lots preloaded in STOCKAGE (Jan, Feb, Mar) — putaway already done." },
    evidenceToObserve: { fr: "Lots LOT-A/B/C en bins STOCKAGE — dates de réception dans le cockpit.", en: "Lots LOT-A/B/C in STOCKAGE bins — receipt dates in cockpit." },
    operationalProblem: { fr: "Respecter FIFO : lot le plus ancien en premier.", en: "Respect FIFO: oldest lot first." },
    expectedActionHint: { fr: "Pas de rangement requis — confirmez l'ordre des lots, puis FIFO_PICK sur le plus ancien.", en: "No putaway required — confirm lot order, then FIFO_PICK the oldest." },
    emptyStockNote: { fr: "Stock préchargé en STOCKAGE — démarrage direct au prélèvement FIFO.", en: "Stock preloaded in STOCKAGE — start directly at FIFO pick." },
    transactionMonitorHint: { fr: "GR multi-bins déjà postées — traçabilité lot visible.", en: "Multi-bin GRs already posted — lot traceability visible." },
    complianceHint: { fr: "Violation FIFO = non-conformité client.", en: "FIFO violation = customer non-compliance." },
    learningTakeaway: { fr: "FIFO protège la fraîcheur et la conformité réglementaire.", en: "FIFO protects freshness and regulatory compliance." },
  },
  "SCN-009": {
    scnCode: "SCN-009",
    situation: { fr: "Inventaire cyclique : SKU-001 (100) et SKU-003 (80) en système.", en: "Cycle count: SKU-001 (100) and SKU-003 (80) in system." },
    evidenceToObserve: { fr: "Stocks B-01-R1-L1 et B-01-R1-L2 ; écart −3 attendu sur SKU-001.", en: "Stock at B-01-R1-L1 and B-01-R1-L2; −3 variance expected on SKU-001." },
    operationalProblem: { fr: "Identifier l'écart système vs physique.", en: "Identify system vs physical discrepancy." },
    expectedActionHint: { fr: "Comptage → réconciliation → ajustement MI07 obligatoire pour l'écart −3.", en: "Count → reconcile → mandatory MI07 adjustment for the −3 variance." },
    transactionMonitorHint: { fr: "Transactions de réception déjà postées — focus sur comptage. Après CC_RECON, une ligne ADJ étudiant doit apparaître au moniteur.", en: "Receipt transactions already posted — focus on counting. After CC_RECON, a student ADJ line must appear in the monitor." },
    complianceHint: { fr: "L'ajustement ADJ (MI07) doit être posté dans CC_RECON avant COMPLIANCE_M3.", en: "The ADJ (MI07) adjustment must be posted in CC_RECON before COMPLIANCE_M3." },
    learningTakeaway: { fr: "Le comptage cyclique détecte les dérives avant rupture.", en: "Cycle counting detects drift before stockouts." },
  },
  "SCN-010": {
    scnCode: "SCN-010",
    situation: { fr: "SKU-006 : système 380 u., physique 352 u. (écart −28).", en: "SKU-006: system 380 u., physical 352 u. (−28 variance)." },
    evidenceToObserve: { fr: "B-02-R1-L1 ; seuil d'ajustement = 20 u.", en: "B-02-R1-L1; adjustment threshold = 20 u." },
    operationalProblem: { fr: "Écart significatif — justification obligatoire.", en: "Significant variance — justification required." },
    expectedActionHint: { fr: "Saisissez 352 au comptage, justifiez l'écart, puis ajustez.", en: "Enter 352 at count, justify variance, then adjust." },
    transactionMonitorHint: { fr: "Historique PO/SO/GI explique le stock système 380.", en: "PO/SO/GI history explains system stock 380." },
    complianceHint: { fr: "ADJ requis si écart > seuil.", en: "ADJ required if variance > threshold." },
    learningTakeaway: { fr: "Les écarts majeurs exigent une piste d'audit documentée.", en: "Major variances require documented audit trail." },
  },
  "SCN-011": {
    scnCode: "SCN-011",
    situation: { fr: "SKU-004 (30) et SKU-005 (40) sous seuil Min.", en: "SKU-004 (30) and SKU-005 (40) below Min threshold." },
    evidenceToObserve: { fr: "Niveaux vs Min/Max/SS visibles dans le cockpit dès l'ouverture.", en: "Levels vs Min/Max/SS visible in the cockpit from first load." },
    operationalProblem: { fr: "Risque de rupture — calcul de réappro requis.", en: "Stockout risk — replenishment calculation required." },
    expectedActionHint: { fr: "Analysez Min/Max, calculez Q = Max − stock pour chaque SKU, proposez REPLENISH.", en: "Analyze Min/Max, calculate Q = Max − stock for each SKU, propose REPLENISH." },
    transactionMonitorHint: { fr: "GI passées ont réduit les stocks sous Min.", en: "Past GIs reduced stock below Min." },
    complianceHint: { fr: "Quantité = Max − stock actuel ; vérifier SS pour urgence.", en: "Quantity = Max − current stock; check SS for urgency." },
    learningTakeaway: { fr: "Min/Max et SS cadrent le réapprovisionnement automatique.", en: "Min/Max and SS frame automated replenishment." },
  },
  "SCN-012": {
    scnCode: "SCN-012",
    situation: { fr: "Revue Q3 CFO — politique stock @ rotation 6× (normale).", en: "Q3 CFO review — stock policy @ 6× turnover (normal)." },
    evidenceToObserve: { fr: "Tour de contrôle KPI M4 ; capital immobilisé 48 000 $.", en: "M4 KPI control tower; $48k tied-up capital." },
    operationalProblem: { fr: "Bande normale 6× — risque complaisance, pas crise surstock.", en: "Normal 6× band — complacency risk, not overstock crisis." },
    expectedActionHint: { fr: "Classifiez la bande, recommandez politique (maintien/surveillance SKU).", en: "Classify band, recommend policy (maintain/SKU monitoring)." },
    emptyStockNote: { fr: "Pas de stock physique : scénario KPI uniquement — normal.", en: "No physical stock: KPI-only scenario — expected." },
    transactionMonitorHint: { fr: "Aucune transaction attendue — utilisez les indicateurs KPI.", en: "No transactions expected — use KPI indicators." },
    complianceHint: { fr: "COMPLIANCE_M4 valide interprétations cohérentes — pas inventaire M1.", en: "COMPLIANCE_M4 validates coherent interpretations — not M1 inventory." },
    learningTakeaway: { fr: "6× normal exige jugement politique, pas alarme surstock.", en: "Normal 6× requires policy judgment, not overstock alarm." },
  },
  "SCN-013": {
    scnCode: "SCN-013",
    situation: { fr: "Renouvellement SLA J-90 — dashboard vert @ 95 % + 4 % erreurs.", en: "J-90 SLA renewal — green dashboard @ 95% + 4% errors." },
    evidenceToObserve: { fr: "OTIF au seuil ; erreurs picking/réception corrigeables.", en: "OTIF at threshold; correctable picking/receiving errors." },
    operationalProblem: { fr: "Piège tableau vert — investir budget formation oui/non, où ?", en: "Green dashboard trap — invest training budget yes/no, where?" },
    expectedActionHint: { fr: "Reconnaissez excellence, corrélez erreurs/OTIF, plan chiffré 90 j.", en: "Acknowledge excellence, correlate errors/OTIF, 90-day numeric plan." },
    emptyStockNote: { fr: "Scénario analytique — stocks non requis.", en: "Analytical scenario — stock not required." },
    transactionMonitorHint: { fr: "Focus sur indicateurs, pas sur transactions stock.", en: "Focus on indicators, not stock transactions." },
    complianceHint: { fr: "Diagnostic doit lier erreurs picking/réception et cible mesurable.", en: "Diagnosis must link picking/receiving errors and measurable target." },
    learningTakeaway: { fr: "95 % excellent masque fragilité OTIF si erreurs non traitées.", en: "95% excellent masks OTIF fragility if errors untreated." },
  },
  "SCN-014": {
    scnCode: "SCN-014",
    situation: { fr: "S&OP mensuel — CFO, Ventes, Ops, une initiative financée.", en: "Monthly S&OP — CFO, Sales, Ops, one funded initiative." },
    evidenceToObserve: { fr: "Rotation + service + erreurs + délai 3,5 j combinés.", en: "Turnover + service + errors + 3.5-day lead time combined." },
    operationalProblem: { fr: "Arbitrer capital / OTIF / exécution — paragraphe board requis.", en: "Balance capital / OTIF / execution — board paragraph required." },
    expectedActionHint: { fr: "Nommez levier, trade-off, ≥3 KPIs de suivi, cible 90 j.", en: "Name lever, trade-off, ≥3 follow-up KPIs, 90-day target." },
    emptyStockNote: { fr: "Capstone analytique M4 — pas de stock physique.", en: "M4 analytical capstone — no physical stock." },
    transactionMonitorHint: { fr: "Utilisez le pipeline KPI complet.", en: "Use full KPI pipeline." },
    complianceHint: { fr: "Décision multi-indicateurs avant clôture.", en: "Multi-indicator decision before closing." },
    learningTakeaway: { fr: "La direction logistique arbitre des trade-offs mesurables.", en: "Logistics leadership balances measurable trade-offs." },
  },
  "SCN-015": {
    scnCode: "SCN-015",
    situation: {
      fr: "Contrat M5 : PO-M5-001 · SKU-001 · 50 u. · LOT-M5-A · REC-01 → B-01-R1-L1 · réappro Min 10 / Max 100 / SS 5.",
      en: "M5 contract: PO-M5-001 · SKU-001 · 50 u. · LOT-M5-A · REC-01 → B-01-R1-L1 · replenish Min 10 / Max 100 / SS 5.",
    },
    evidenceToObserve: {
      fr: "M5_RECEPTION → PUTAWAY (LOT-M5-A) → CC → REPLENISH (10/100/5) → KPI snapshot → DECISION.",
      en: "M5_RECEPTION → PUTAWAY (LOT-M5-A) → CC → REPLENISH (10/100/5) → KPI snapshot → DECISION.",
    },
    operationalProblem: { fr: "7 étapes contractuelles — ne pas deviner lot ni paramètres réappro.", en: "7 contract steps — do not guess lot or replenish params." },
    expectedActionHint: {
      fr: "PO-M5-001 · 50 u. · LOT-M5-A · B-01-R1-L1 · réappro Min 10 Max 100 SS 5.",
      en: "PO-M5-001 · 50 u. · LOT-M5-A · B-01-R1-L1 · replenish Min 10 Max 100 SS 5.",
    },
    emptyStockNote: {
      fr: "Stock vide au départ — normal. La première preuve opérationnelle apparaît après la réception M5_RECEPTION.",
      en: "Empty stock at start — expected. First operational evidence appears after M5_RECEPTION.",
    },
    transactionMonitorHint: { fr: "Chaque étape ops alimente les KPI finaux.", en: "Each ops step feeds final KPIs." },
    complianceHint: { fr: "COMPLIANCE_M5 après cycle complet.", en: "COMPLIANCE_M5 after complete cycle." },
    learningTakeaway: { fr: "L'entrepôt intégré relie exécution et pilotage.", en: "Integrated warehouse links execution and control." },
  },
  "SCN-016": {
    scnCode: "SCN-016",
    situation: {
      fr: "Contrat M5 base (PO-M5-001 · LOT-M5-A · réappro 10/100/5) + variance −5 u. @ B-01-R1-L1 (physique 45 vs système 50).",
      en: "M5 base contract (PO-M5-001 · LOT-M5-A · replenish 10/100/5) + −5 u. variance @ B-01-R1-L1 (physical 45 vs system 50).",
    },
    evidenceToObserve: {
      fr: "M5_CYCLE_COUNT : physique 45 u. · système 50 u. — M5_ADJ requis avant réappro/KPI.",
      en: "M5_CYCLE_COUNT: physical 45 u. · system 50 u. — M5_ADJ required before replenish/KPI.",
    },
    operationalProblem: { fr: "Écart −5 contractuel — ADJ avant suite du flux.", en: "Contract −5 variance — ADJ before continuing flow." },
    expectedActionHint: {
      fr: "LOT-M5-A · ADJ −5 u. · puis REPLENISH Min 10 Max 100 SS 5.",
      en: "LOT-M5-A · ADJ −5 u. · then REPLENISH Min 10 Max 100 SS 5.",
    },
    transactionMonitorHint: { fr: "Vérifiez les mouvements avant et après l'ajustement inventaire.", en: "Verify movements before and after inventory adjustment." },
    complianceHint: { fr: "Ne clôturez pas avec écart ouvert.", en: "Do not close with open variance." },
    learningTakeaway: { fr: "Les exceptions inventaire doivent être traitées avant le pilotage.", en: "Inventory exceptions must be handled before steering." },
  },
  "SCN-017": {
    scnCode: "SCN-017",
    situation: {
      fr: "Contrat ops M5 (PO-M5-001 · LOT-M5-A · 50 u. · réappro 10/100/5) puis décision stratégique basée sur snapshot M5_KPI runtime.",
      en: "M5 ops contract (PO-M5-001 · LOT-M5-A · 50 u. · replenish 10/100/5) then strategic decision from M5_KPI runtime snapshot.",
    },
    evidenceToObserve: {
      fr: "Snapshot M5_KPI dans le cockpit après cycle ops — source autoritaire pour M5_DECISION.",
      en: "M5_KPI snapshot in cockpit after ops cycle — authoritative source for M5_DECISION.",
    },
    operationalProblem: {
      fr: "Décision stratégique liée aux KPI runtime — pas aux valeurs statiques du briefing.",
      en: "Strategic decision tied to runtime KPIs — not static briefing values.",
    },
    expectedActionHint: {
      fr: "Cycle ops (LOT-M5-A · 10/100/5) → lire M5_KPI runtime → M5_DECISION avec KPI cités.",
      en: "Ops cycle (LOT-M5-A · 10/100/5) → read M5_KPI runtime → M5_DECISION citing KPIs.",
    },
    transactionMonitorHint: { fr: "Consultez les KPI agrégés — pas de nouvelle transaction requise.", en: "Review aggregated KPIs — no new transaction required." },
    emptyStockNote: {
      fr: "Départ opérationnel normal : complétez d'abord le cycle M5_RECEPTION → mouvements → KPI. La décision stratégique vient après les preuves KPI.",
      en: "Normal operational start: complete M5_RECEPTION → movements → KPI first. Strategic decision comes after KPI evidence.",
    },
    complianceHint: { fr: "Décision liée aux KPI avant COMPLIANCE_M5.", en: "Decision linked to KPIs before COMPLIANCE_M5." },
    learningTakeaway: { fr: "La certification Gold exige synthèse et justification.", en: "Gold certification requires synthesis and justification." },
  },
};

export function getCockpitPedagogy(scnCode: string | null | undefined): CockpitPedagogy | null {
  if (!scnCode) return null;
  return SCENARIO_COCKPIT_PEDAGOGY[scnCode] ?? null;
}

export function pickLang<T extends { fr: string; en: string }>(entry: T, language: string): string {
  return language === "FR" ? entry.fr : entry.en;
}
