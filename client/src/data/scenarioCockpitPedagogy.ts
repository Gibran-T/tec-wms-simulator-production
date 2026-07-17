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
    situation: { fr: "200 unités reçues et rangées ; un écart inventaire apparaîtra au comptage.", en: "200 units received and put away; inventory variance will appear at count." },
    evidenceToObserve: { fr: "Stock système 200 u. à B-02-R1-L1 après rangement ; préparez le cycle count sur SKU-006.", en: "System stock 200 u. at B-02-R1-L1 after putaway; prepare cycle count on SKU-006." },
    operationalProblem: { fr: "Écart physique −15 à documenter et corriger (MI01 → MI07).", en: "Physical variance −15 to document and correct (MI01 → MI07)." },
    expectedActionHint: { fr: "Rangez REC-01 → B-02-R1-L1, comptez SKU-006 (quantité physique 185), puis ADJ −15.", en: "Put away REC-01 → B-02-R1-L1, count SKU-006 (physical qty 185), then ADJ −15." },
    transactionMonitorHint: { fr: "Tracez PO → GR → putaway → CC → ADJ — réconciliation inventaire uniquement.", en: "Trace PO → GR → putaway → CC → ADJ — inventory reconciliation only." },
    complianceHint: { fr: "Écart non résolu = conformité bloquée. Stock final attendu : 185 u. à B-02-R1-L1.", en: "Unresolved variance = compliance blocked. Expected final stock: 185 u. at B-02-R1-L1." },
    learningTakeaway: { fr: "Le comptage cyclique et l'ajustement MI07 réconcilient le physique et le système.", en: "Cycle counting and MI07 adjustment reconcile physical and system inventory." },
  },
  "SCN-005": {
    scnCode: "SCN-005",
    situation: { fr: "Deux anomalies simultanées : GR fantôme + écart inventaire.", en: "Two simultaneous anomalies: ghost GR + inventory variance." },
    evidenceToObserve: { fr: "GR-2025-004 PENDING (SKU-004) ; SKU-005 avec écart −8 au comptage.", en: "GR-2025-004 PENDING (SKU-004); SKU-005 with −8 variance at count." },
    operationalProblem: { fr: "Ordre de résolution : documents → physique → réconciliation inventaire.", en: "Resolution order: documents → physical → inventory reconciliation." },
    expectedActionHint: { fr: "Postez GR-2025-004 avant le rangement SKU-004 ; comptez SKU-005 (physique 52, écart −8) puis ADJ.", en: "Post GR-2025-004 before SKU-004 putaway; count SKU-005 (physical 52, variance −8) then ADJ." },
    transactionMonitorHint: { fr: "Deux lignes PENDING possibles — traitez-les dans l'ordre métier (pas d'expédition).", en: "Two possible PENDING lines — handle in business order (no outbound shipping)." },
    complianceHint: { fr: "Stock final SKU-005 attendu : 52 u. à B-01-R1-L2 après ADJ −8.", en: "Expected final SKU-005 stock: 52 u. at B-01-R1-L2 after ADJ −8." },
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
      fr: "PO-M2-002 et GR-M2-002 déjà enregistrés. 600 u. SKU-002 lot LOT-2025-002 à REC-01. Capacité B-01-R1-L1 = 500 — deux PUTAWAY obligatoires (500 + 100), puis précision inventaire et conformité.",
      en: "PO-M2-002 and GR-M2-002 already posted. 600 u. SKU-002 lot LOT-2025-002 at REC-01. B-01-R1-L1 capacity = 500 — two mandatory PUTAWAYs (500 + 100), then stock accuracy and compliance.",
    },
    evidenceToObserve: {
      fr: "600 u. LOT-2025-002 à REC-01 ; capacité B-01-R1-L1 = 500 ; B-01-R1-L2 reçoit 100 ; même lot aux deux putaway ; REC-01 vide ; total final = 600.",
      en: "600 u. LOT-2025-002 at REC-01; B-01-R1-L1 capacity = 500; B-01-R1-L2 receives 100; same lot on both putaways; REC-01 empty; final total = 600.",
    },
    operationalProblem: {
      fr: "Répartir les 600 unités du lot LOT-2025-002 entre deux emplacements de STOCKAGE sans dépasser la capacité maximale du premier bin.",
      en: "Split the 600 units of lot LOT-2025-002 across two STOCKAGE bins without exceeding the first bin's max capacity.",
    },
    expectedActionHint: {
      fr: "PUTAWAY 1 : 500 u. LOT-2025-002 → B-01-R1-L1. PUTAWAY 2 : 100 u. → B-01-R1-L2. Puis STOCK_ACCURACY · COMPLIANCE_ADV.",
      en: "PUTAWAY 1: 500 u. LOT-2025-002 → B-01-R1-L1. PUTAWAY 2: 100 u. → B-01-R1-L2. Then STOCK_ACCURACY · COMPLIANCE_ADV.",
    },
    transactionMonitorHint: {
      fr: "PO-M2-002 et GR-M2-002 POSTED (600 u. LOT-2025-002). Puis deux PUTAWAY du même lot — pas de FIFO dans ce scénario.",
      en: "PO-M2-002 and GR-M2-002 POSTED (600 u. LOT-2025-002). Then two PUTAWAYs of the same lot — no FIFO in this scenario.",
    },
    complianceHint: {
      fr: "Pas de SYSTÈME CONFORME tant que REC-01 conserve du LOT-2025-002 ou que le split 500+100 n'est pas exact. Total attendu = 600.",
      en: "No SYSTEM COMPLIANT while REC-01 still holds LOT-2025-002 or the 500+100 split is incomplete. Expected total = 600.",
    },
    learningTakeaway: {
      fr: "La capacité d'emplacement force la répartition — une compétence distincte du FIFO (SCN-008).",
      en: "Bin capacity forces a split — a skill distinct from FIFO (SCN-008).",
    },
  },
  "SCN-008": {
    scnCode: "SCN-008",
    situation: { fr: "3 lots SKU-003 préchargés en STOCKAGE (jan, fév, mars) — putaway déjà fait.", en: "3 SKU-003 lots preloaded in STOCKAGE (Jan, Feb, Mar) — putaway already done." },
    evidenceToObserve: { fr: "Lots LOT-A/B/C en bins STOCKAGE — dates de réception dans le cockpit.", en: "Lots LOT-A/B/C in STOCKAGE bins — receipt dates in cockpit." },
    operationalProblem: { fr: "Respecter FIFO : lot le plus ancien en premier.", en: "Respect FIFO: oldest lot first." },
    expectedActionHint: { fr: "Pas de rangement requis — identifiez le lot le plus ancien (date la plus ancienne), puis FIFO_PICK sur ce lot.", en: "No putaway required — identify the oldest lot (earliest date), then FIFO_PICK that lot." },
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
    situation: { fr: "Revue Q3 — politique stock à partir des KPI du tour de contrôle.", en: "Q3 review — stock policy from control-tower KPIs." },
    evidenceToObserve: { fr: "Consommation annuelle et stock moyen dans le tour de contrôle KPI M4.", en: "Annual consumption and average stock in the M4 KPI control tower." },
    operationalProblem: { fr: "Classer la rotation et choisir une politique — sans confondre bande normale et surstock.", en: "Classify turnover and choose a policy — do not confuse normal band with overstock." },
    expectedActionHint: { fr: "Calculer → classer → recommander maintien/suivi des articles lents.", en: "Calculate → classify → recommend maintain/monitor slow movers." },
    emptyStockNote: { fr: "Pas de stock physique : scénario KPI uniquement — normal.", en: "No physical stock: KPI-only scenario — expected." },
    transactionMonitorHint: { fr: "Aucune transaction physique — utilisez les indicateurs KPI.", en: "No physical transaction — use KPI indicators." },
    complianceHint: { fr: "COMPLIANCE_M4 valide un raisonnement cohérent — pas inventaire M1.", en: "COMPLIANCE_M4 validates coherent reasoning — not M1 inventory." },
    learningTakeaway: { fr: "Une rotation dans la bande normale exige jugement politique, pas alarme surstock.", en: "Normal-band turnover requires policy judgment, not overstock alarm." },
  },
  "SCN-013": {
    scnCode: "SCN-013",
    situation: { fr: "Renouvellement SLA à court terme — lire OTIF et taux d'erreur ensemble.", en: "Near-term SLA renewal — read OTIF and error rate together." },
    evidenceToObserve: { fr: "Commandes livrées / total et erreurs opérationnelles dans le tour de contrôle.", en: "Orders delivered / total and operational errors in the control tower." },
    operationalProblem: { fr: "Comparer les deux indicateurs et identifier le risque avant le SLA.", en: "Compare both indicators and identify risk before the SLA." },
    expectedActionHint: { fr: "Classer OTIF et erreurs → action qualité simple → suivi court terme.", en: "Classify OTIF and errors → simple quality action → short-term follow-up." },
    emptyStockNote: { fr: "Scénario analytique — stocks non requis.", en: "Analytical scenario — stock not required." },
    transactionMonitorHint: { fr: "Focus sur indicateurs, pas sur transactions stock.", en: "Focus on indicators, not stock transactions." },
    complianceHint: { fr: "Le diagnostic doit relier risque d'exécution et suivi avant SLA.", en: "Diagnosis must link execution risk and follow-up before SLA." },
    learningTakeaway: { fr: "Un OTIF élevé ne dispense pas d'analyser le taux d'erreur.", en: "A high OTIF does not remove the need to analyze the error rate." },
  },
  "SCN-014": {
    scnCode: "SCN-014",
    situation: { fr: "S&OP — une seule initiative financée ; arbitrer avec les KPI disponibles.", en: "S&OP — one funded initiative; arbitrate with available KPIs." },
    evidenceToObserve: { fr: "Rotation, service, erreurs et délai dans le tour de contrôle.", en: "Turnover, service, errors and lead time in the control tower." },
    operationalProblem: { fr: "Choisir une priorité et expliciter ce qui est protégé ou reporté.", en: "Choose one priority and state what is protected or postponed." },
    expectedActionHint: { fr: "Priorité + compromis + horizon de revue — réponse board concise.", en: "Priority + trade-off + review horizon — concise board answer." },
    emptyStockNote: { fr: "Capstone analytique M4 — pas de stock physique.", en: "M4 analytical capstone — no physical stock." },
    transactionMonitorHint: { fr: "Utilisez le pipeline KPI analytique.", en: "Use the analytical KPI pipeline." },
    complianceHint: { fr: "Décision multi-indicateurs avant clôture.", en: "Multi-indicator decision before closing." },
    learningTakeaway: { fr: "La direction logistique arbitre des compromis mesurables.", en: "Logistics leadership balances measurable trade-offs." },
  },
  "SCN-015": {
    scnCode: "SCN-015",
    situation: {
      fr: "Cycle M5 nominal intégré — exécuter, vérifier, décider.",
      en: "Nominal integrated M5 cycle — execute, verify, decide.",
    },
    evidenceToObserve: {
      fr: "Preuves du run : réception, putaway, comptage, réappro, snapshot KPI.",
      en: "Run evidence: reception, putaway, count, replenish, KPI snapshot.",
    },
    operationalProblem: { fr: "Décision tactique — Q = 0 peut être correct si le stock est suffisant.", en: "Tactical decision — Q = 0 can be correct if stock is sufficient." },
    expectedActionHint: {
      fr: "Confirmer conformité du cycle ; réappro seulement si besoin ; maintenir/surveiller.",
      en: "Confirm cycle compliance; replenish only if needed; maintain/monitor.",
    },
    emptyStockNote: {
      fr: "Stock vide au départ — normal. La première preuve apparaît après M5_RECEPTION.",
      en: "Empty stock at start — expected. First evidence appears after M5_RECEPTION.",
    },
    transactionMonitorHint: { fr: "Chaque étape ops alimente les KPI du run.", en: "Each ops step feeds run KPIs." },
    complianceHint: { fr: "COMPLIANCE_M5 après cycle complet.", en: "COMPLIANCE_M5 after complete cycle." },
    learningTakeaway: { fr: "Un cycle nominal n'exige pas d'inventer un problème.", en: "A nominal cycle does not require inventing a problem." },
  },
  "SCN-016": {
    scnCode: "SCN-016",
    situation: {
      fr: "Cycle M5 avec écart inventaire — réconcilier avant de décider.",
      en: "M5 cycle with inventory variance — reconcile before deciding.",
    },
    evidenceToObserve: {
      fr: "Comptage avec écart → ajustement → stock corrigé → KPI/réappro.",
      en: "Count with variance → adjustment → corrected stock → KPI/replenish.",
    },
    operationalProblem: { fr: "Réconcilier d'abord, décider ensuite.", en: "Reconcile first, decide afterward." },
    expectedActionHint: {
      fr: "Ajuster l'écart, puis décider sur le stock corrigé (réappro ou Q = 0).",
      en: "Adjust variance, then decide on corrected stock (replenish or Q = 0).",
    },
    transactionMonitorHint: { fr: "Vérifiez les mouvements avant et après l'ajustement.", en: "Verify movements before and after adjustment." },
    complianceHint: { fr: "Ne clôturez pas avec écart ouvert.", en: "Do not close with open variance." },
    learningTakeaway: { fr: "Les exceptions inventaire se traitent avant le pilotage.", en: "Inventory exceptions are handled before steering." },
  },
  "SCN-017": {
    scnCode: "SCN-017",
    situation: {
      fr: "Capstone M5 — décision stratégique à partir du snapshot de votre session.",
      en: "M5 capstone — strategic decision from your session snapshot.",
    },
    evidenceToObserve: {
      fr: "Snapshot M5_KPI runtime après le cycle ops — source autoritaire.",
      en: "Runtime M5_KPI snapshot after ops cycle — authoritative source.",
    },
    operationalProblem: {
      fr: "Preuves → priorité → compromis → horizon. Pas les valeurs du Module 4.",
      en: "Evidence → priority → trade-off → horizon. Not Module 4 values.",
    },
    expectedActionHint: {
      fr: "Lire le snapshot de session → décision stratégique concise (4–6 phrases).",
      en: "Read session snapshot → concise strategic decision (4–6 sentences).",
    },
    transactionMonitorHint: { fr: "Consultez les KPI agrégés — pas de nouvelle transaction requise.", en: "Review aggregated KPIs — no new transaction required." },
    emptyStockNote: {
      fr: "Complétez d'abord le cycle ops → KPI. La décision stratégique vient après les preuves.",
      en: "Complete ops → KPI first. Strategic decision comes after evidence.",
    },
    complianceHint: { fr: "Décision liée aux KPI avant COMPLIANCE_M5.", en: "Decision linked to KPIs before COMPLIANCE_M5." },
    learningTakeaway: { fr: "Le capstone exige synthèse et justification KPI de session.", en: "The capstone requires synthesis and session KPI justification." },
  },
};

export function getCockpitPedagogy(scnCode: string | null | undefined): CockpitPedagogy | null {
  if (!scnCode) return null;
  return SCENARIO_COCKPIT_PEDAGOGY[scnCode] ?? null;
}

export function pickLang<T extends { fr: string; en: string }>(entry: T, language: string): string {
  return language === "FR" ? entry.fr : entry.en;
}
