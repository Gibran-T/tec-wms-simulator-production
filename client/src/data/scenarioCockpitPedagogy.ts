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
    situation: { fr: "Entrepôt vide — flux nominal de bout en bout.", en: "Empty warehouse — end-to-end nominal flow." },
    evidenceToObserve: { fr: "Stocks vides au départ ; chaque transaction postée apparaît dans le moniteur.", en: "Empty stock at start; each posted transaction appears in the monitor." },
    operationalProblem: { fr: "Construire le cycle complet sans anomalie.", en: "Build the complete cycle without anomalies." },
    expectedActionHint: { fr: "Créez la PO, puis enchaînez GR → rangement → SO → expédition → inventaire → conformité.", en: "Create the PO, then chain GR → putaway → SO → shipping → count → compliance." },
    emptyStockNote: { fr: "Stock vide au départ : normal. Le stock n'apparaît qu'après réception postée (GR).", en: "Empty stock at start: expected. Stock appears only after posted receipt (GR)." },
    transactionMonitorHint: { fr: "Vérifiez que chaque document est POSTED avant l'étape suivante.", en: "Verify each document is POSTED before the next step." },
    complianceHint: { fr: "Conformité = aucune transaction en attente, pas de stock négatif, pas d'écart ouvert.", en: "Compliance = no pending transactions, no negative stock, no open variance." },
    learningTakeaway: { fr: "Le WMS reflète la réalité physique uniquement après validation des documents.", en: "The WMS reflects physical reality only after document validation." },
  },
  "SCN-002": {
    scnCode: "SCN-002",
    situation: { fr: "PO validée mais stock absent au quai — GR fantôme.", en: "PO validated but no stock at dock — ghost GR." },
    evidenceToObserve: { fr: "Moniteur : GR-2025-001 en PENDING ; REC-01 vide ou sans stock utilisable.", en: "Monitor: GR-2025-001 PENDING; REC-01 empty or without usable stock." },
    operationalProblem: { fr: "Document créé mais non validé — le stock système n'est pas encore disponible.", en: "Document created but not validated — system stock not yet available." },
    expectedActionHint: { fr: "Identifiez la GR non postée et validez-la avant tout rangement ou expédition.", en: "Identify the unposted GR and validate it before putaway or shipping." },
    emptyStockNote: { fr: "REC-01 vide malgré la PO : l'anomalie est la GR non postée, pas un bug.", en: "REC-01 empty despite PO: the anomaly is the unposted GR, not a bug." },
    transactionMonitorHint: { fr: "Comparez PO (POSTED) vs GR (PENDING) — c'est la preuve de l'anomalie.", en: "Compare PO (POSTED) vs GR (PENDING) — that's the evidence." },
    complianceHint: { fr: "Tant qu'une GR reste PENDING, la conformité finale sera bloquée.", en: "While a GR remains PENDING, final compliance will be blocked." },
    learningTakeaway: { fr: "Réception physique ≠ stock ERP tant que la transaction n'est pas postée.", en: "Physical receipt ≠ ERP stock until the transaction is posted." },
  },
  "SCN-003": {
    scnCode: "SCN-003",
    situation: { fr: "50 unités reçues ; la demande client dépassera le stock disponible.", en: "50 units received; customer demand will exceed available stock." },
    evidenceToObserve: { fr: "SKU-003 à REC-01 après GR ; vérifiez quantité avant SO/GI.", en: "SKU-003 at REC-01 after GR; check quantity before SO/GI." },
    operationalProblem: { fr: "Risque de rupture ou stock négatif si expédition sans réappro.", en: "Stockout or negative stock risk if shipping without replenishment." },
    expectedActionHint: { fr: "Rangez d'abord, puis planifiez SO et réapprovisionnez si le stock est insuffisant.", en: "Put away first, then plan SO and replenish if stock is insufficient." },
    transactionMonitorHint: { fr: "Suivez le mouvement REC-01 → STOCKAGE et les quantités disponibles.", en: "Track REC-01 → STOCKAGE movement and available quantities." },
    complianceHint: { fr: "La GI ne doit pas créer de stock négatif.", en: "GI must not create negative stock." },
    learningTakeaway: { fr: "ATP et réapprovisionnement protègent le service client.", en: "ATP and replenishment protect customer service." },
  },
  "SCN-004": {
    scnCode: "SCN-004",
    situation: { fr: "200 unités reçues ; un écart inventaire apparaîtra au comptage.", en: "200 units received; inventory variance will appear at count." },
    evidenceToObserve: { fr: "Stock système après expédition ; préparez le cycle count sur SKU-006.", en: "System stock after shipment; prepare cycle count on SKU-006." },
    operationalProblem: { fr: "Écart physique −15 à documenter et corriger.", en: "Physical variance −15 to document and correct." },
    expectedActionHint: { fr: "Complétez le flux expédition, puis saisissez la quantité physique réelle au comptage.", en: "Complete shipping flow, then enter actual physical quantity at count." },
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
    situation: { fr: "150 u. SKU-001 postées au quai REC-01.", en: "150 u. SKU-001 posted at dock REC-01." },
    evidenceToObserve: { fr: "GR-M2-001 POSTED ; stock visible REC-01 ; putaway requis vers STOCKAGE.", en: "GR-M2-001 POSTED; stock visible REC-01; putaway required to STOCKAGE." },
    operationalProblem: { fr: "Affecter un emplacement conforme capacité et zone.", en: "Assign a location meeting capacity and zone rules." },
    expectedActionHint: { fr: "Validez la réception, puis exécutez le rangement structuré (PUTAWAY).", en: "Validate receipt, then execute structured putaway (PUTAWAY)." },
    transactionMonitorHint: { fr: "PO-M2-001 et GR-M2-001 doivent être POSTED avant putaway.", en: "PO-M2-001 and GR-M2-001 must be POSTED before putaway." },
    complianceHint: { fr: "Conformité M2 après FIFO, précision stock et validation avancée.", en: "M2 compliance after FIFO, stock accuracy and advanced validation." },
    learningTakeaway: { fr: "Le putaway structure la traçabilité emplacement.", en: "Putaway structures location traceability." },
  },
  "SCN-007": {
    scnCode: "SCN-007",
    situation: { fr: "600 u. SKU-002 reçues ; capacité bin B-01-R1-L1 = 500.", en: "600 u. SKU-002 received; bin B-01-R1-L1 capacity = 500." },
    evidenceToObserve: { fr: "Quantité au quai vs capacité max du bin cible.", en: "Dock quantity vs target bin max capacity." },
    operationalProblem: { fr: "Dépassement de capacité — répartition requise.", en: "Capacity overflow — split required." },
    expectedActionHint: { fr: "Observez l'alerte capacité et répartissez sur plusieurs bins STOCKAGE.", en: "Watch capacity alert and split across STOCKAGE bins." },
    transactionMonitorHint: { fr: "GR-M2-002 POSTED — 600 u. à placer sans overflow.", en: "GR-M2-002 POSTED — 600 u. to place without overflow." },
    complianceHint: { fr: "Aucun bin ne doit dépasser sa capacité max.", en: "No bin may exceed max capacity." },
    learningTakeaway: { fr: "La capacité d'emplacement évite la saturation des slots.", en: "Bin capacity prevents slot saturation." },
  },
  "SCN-008": {
    scnCode: "SCN-008",
    situation: { fr: "3 lots SKU-003 en stock multi-bins (jan, fév, mars).", en: "3 SKU-003 lots in multi-bins (Jan, Feb, Mar)." },
    evidenceToObserve: { fr: "Lots LOT-A/B/C — dates de réception dans le cockpit.", en: "Lots LOT-A/B/C — receipt dates in cockpit." },
    operationalProblem: { fr: "Respecter FIFO : lot le plus ancien en premier.", en: "Respect FIFO: oldest lot first." },
    expectedActionHint: { fr: "Confirmez l'ordre des lots, puis prélevez le lot le plus ancien (FIFO_PICK).", en: "Confirm lot order, then pick oldest lot (FIFO_PICK)." },
    transactionMonitorHint: { fr: "GR multi-bins déjà postées — traçabilité lot visible.", en: "Multi-bin GRs already posted — lot traceability visible." },
    complianceHint: { fr: "Violation FIFO = non-conformité client.", en: "FIFO violation = customer non-compliance." },
    learningTakeaway: { fr: "FIFO protège la fraîcheur et la conformité réglementaire.", en: "FIFO protects freshness and regulatory compliance." },
  },
  "SCN-009": {
    scnCode: "SCN-009",
    situation: { fr: "Inventaire cyclique : SKU-001 (100) et SKU-003 (80) en système.", en: "Cycle count: SKU-001 (100) and SKU-003 (80) in system." },
    evidenceToObserve: { fr: "Stocks B-01-R1-L1 et B-01-R1-L2 ; écart −3 attendu sur SKU-001.", en: "Stock at B-01-R1-L1 and B-01-R1-L2; −3 variance expected on SKU-001." },
    operationalProblem: { fr: "Identifier l'écart système vs physique.", en: "Identify system vs physical discrepancy." },
    expectedActionHint: { fr: "Générez la liste de comptage, saisissez les quantités physiques réelles.", en: "Generate count list, enter actual physical quantities." },
    transactionMonitorHint: { fr: "Transactions de réception déjà postées — focus sur comptage.", en: "Receipt transactions already posted — focus on counting." },
    complianceHint: { fr: "Écart identifié doit être réconcilié avant clôture M3.", en: "Identified variance must be reconciled before M3 closing." },
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
    evidenceToObserve: { fr: "Niveaux vs Min/Max/SS dans le panneau réappro.", en: "Levels vs Min/Max/SS in replenishment panel." },
    operationalProblem: { fr: "Risque de rupture — calcul de réappro requis.", en: "Stockout risk — replenishment calculation required." },
    expectedActionHint: { fr: "Analysez Min/Max, calculez Q = Max − stock pour chaque SKU, proposez REPLENISH.", en: "Analyze Min/Max, calculate Q = Max − stock for each SKU, propose REPLENISH." },
    transactionMonitorHint: { fr: "GI passées ont réduit les stocks sous Min.", en: "Past GIs reduced stock below Min." },
    complianceHint: { fr: "Quantité = Max − stock actuel ; vérifier SS pour urgence.", en: "Quantity = Max − current stock; check SS for urgency." },
    learningTakeaway: { fr: "Min/Max et SS cadrent le réapprovisionnement automatique.", en: "Min/Max and SS frame automated replenishment." },
  },
  "SCN-012": {
    scnCode: "SCN-012",
    situation: { fr: "Scénario analytique — rotation des stocks.", en: "Analytical scenario — inventory turnover." },
    evidenceToObserve: { fr: "Tour de contrôle KPI M4 ; pas de mouvement physique requis.", en: "M4 KPI control tower; no physical movement required." },
    operationalProblem: { fr: "Interpréter rotation pour détecter surstock.", en: "Interpret turnover to detect overstock." },
    expectedActionHint: { fr: "Collectez KPI_DATA, calculez rotation, formulez diagnostic.", en: "Collect KPI_DATA, calculate turnover, formulate diagnosis." },
    emptyStockNote: { fr: "Pas de stock physique : scénario KPI uniquement — normal.", en: "No physical stock: KPI-only scenario — expected." },
    transactionMonitorHint: { fr: "Aucune transaction attendue — utilisez les indicateurs KPI.", en: "No transactions expected — use KPI indicators." },
    complianceHint: { fr: "Interprétation chiffrée requise avant COMPLIANCE_M4.", en: "Quantified interpretation required before COMPLIANCE_M4." },
    learningTakeaway: { fr: "La rotation lie consommation et capital immobilisé.", en: "Turnover links consumption and tied-up capital." },
  },
  "SCN-013": {
    scnCode: "SCN-013",
    situation: { fr: "Analyse du taux de service et des erreurs opérationnelles.", en: "Service level and operational error analysis." },
    evidenceToObserve: { fr: "Indicateurs OTIF et taux d'erreur dans le tour KPI.", en: "OTIF and error rate indicators in KPI tower." },
    operationalProblem: { fr: "Service faible — corréler erreurs picking/réception.", en: "Low service — correlate picking/receiving errors." },
    expectedActionHint: { fr: "Analysez KPI_SERVICE, identifiez causes, proposez plan d'action.", en: "Analyze KPI_SERVICE, identify causes, propose action plan." },
    emptyStockNote: { fr: "Scénario analytique — stocks non requis.", en: "Analytical scenario — stock not required." },
    transactionMonitorHint: { fr: "Focus sur indicateurs, pas sur transactions stock.", en: "Focus on indicators, not stock transactions." },
    complianceHint: { fr: "Diagnostic doit lier données et causes opérationnelles.", en: "Diagnosis must link data and operational causes." },
    learningTakeaway: { fr: "Le taux de service reflète la qualité d'exécution entrepôt.", en: "Service level reflects warehouse execution quality." },
  },
  "SCN-014": {
    scnCode: "SCN-014",
    situation: { fr: "Diagnostic multi-KPI — décision stratégique.", en: "Multi-KPI diagnosis — strategic decision." },
    evidenceToObserve: { fr: "Rotation + service + erreurs + lead time combinés.", en: "Turnover + service + errors + lead time combined." },
    operationalProblem: { fr: "Arbitrer stock / service / coût — pas mono-indicateur.", en: "Balance stock / service / cost — not single-KPI." },
    expectedActionHint: { fr: "Synthétisez tous les KPI, formulez décision argumentée.", en: "Synthesize all KPIs, formulate justified decision." },
    emptyStockNote: { fr: "Capstone analytique M4 — pas de stock physique.", en: "M4 analytical capstone — no physical stock." },
    transactionMonitorHint: { fr: "Utilisez le pipeline KPI complet.", en: "Use full KPI pipeline." },
    complianceHint: { fr: "Décision multi-indicateurs avant clôture.", en: "Multi-indicator decision before closing." },
    learningTakeaway: { fr: "La direction logistique arbitre des trade-offs mesurables.", en: "Logistics leadership balances measurable trade-offs." },
  },
  "SCN-015": {
    scnCode: "SCN-015",
    situation: { fr: "Cycle intégré fournisseur → entrepôt → client.", en: "Integrated supplier → warehouse → customer cycle." },
    evidenceToObserve: { fr: "Progression M5_RECEPTION → PUTAWAY → CC → REPLENISH → KPI → DECISION.", en: "Progress M5_RECEPTION → PUTAWAY → CC → REPLENISH → KPI → DECISION." },
    operationalProblem: { fr: "Enchaîner 7 étapes sans incohérence.", en: "Chain 7 steps without inconsistency." },
    expectedActionHint: { fr: "Complétez chaque étape M5 avant la suivante.", en: "Complete each M5 step before the next." },
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
    situation: { fr: "Simulation M5 avec écart inventaire injecté.", en: "M5 simulation with injected inventory variance." },
    evidenceToObserve: { fr: "Variance au M5_CYCLE_COUNT — corriger avant KPI.", en: "Variance at M5_CYCLE_COUNT — correct before KPI." },
    operationalProblem: { fr: "Écart physique non résolu fausse la décision.", en: "Unresolved physical variance skews decision." },
    expectedActionHint: { fr: "Détectez l'écart, ajustez, puis poursuivez vers KPI et décision.", en: "Detect variance, adjust, then proceed to KPI and decision." },
    transactionMonitorHint: { fr: "Vérifiez les mouvements avant et après l'ajustement inventaire.", en: "Verify movements before and after inventory adjustment." },
    complianceHint: { fr: "Ne clôturez pas avec écart ouvert.", en: "Do not close with open variance." },
    learningTakeaway: { fr: "Les exceptions inventaire doivent être traitées avant le pilotage.", en: "Inventory exceptions must be handled before steering." },
  },
  "SCN-017": {
    scnCode: "SCN-017",
    situation: { fr: "Capstone décisionnel M5 — KPI agrégés.", en: "M5 decision capstone — aggregated KPIs." },
    evidenceToObserve: { fr: "Indicateurs M5_KPI après cycle ops.", en: "M5_KPI indicators after ops cycle." },
    operationalProblem: { fr: "Formuler décision stratégique fondée sur données.", en: "Formulate data-driven strategic decision." },
    expectedActionHint: {
      fr: "Phase 1 : complétez le cycle ops (M5_RECEPTION en premier). Phase 2 : analysez M5_KPI. Phase 3 : rédigez M5_DECISION justifiée.",
      en: "Phase 1: complete the ops cycle (M5_RECEPTION first). Phase 2: analyze M5_KPI. Phase 3: write justified M5_DECISION.",
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
