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
    situation: { fr: "50 u. SKU-003 au quai REC-01 — rangement STOCKAGE à faire avant expédition.", en: "50 u. SKU-003 at dock REC-01 — STOCKAGE putaway required before shipping." },
    evidenceToObserve: { fr: "SKU-003 visible à REC-01 (pas encore en STOCKAGE) ; vérifiez quantité avant SO/GI.", en: "SKU-003 visible at REC-01 (not yet in STOCKAGE); check quantity before SO/GI." },
    operationalProblem: { fr: "Risque de rupture ou stock négatif si expédition sans rangement puis réappro.", en: "Stockout or negative stock risk if shipping without putaway then replenishment." },
    expectedActionHint: { fr: "Rangez REC-01 → STOCKAGE, puis planifiez SO ; réapprovisionnez si le stock STOCKAGE est insuffisant.", en: "Put away REC-01 → STOCKAGE, then plan SO; replenish if STOCKAGE is insufficient." },
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
    situation: { fr: "Peak Week Jour 1 — cycle nominal SKU-001 · 50 u. · PO-M5-001.", en: "Peak Week Day 1 — nominal cycle SKU-001 · 50 u. · PO-M5-001." },
    evidenceToObserve: { fr: "M5_RECEPTION → PUTAWAY → CC → REPLENISH → KPI snapshot → DECISION.", en: "M5_RECEPTION → PUTAWAY → CC → REPLENISH → KPI snapshot → DECISION." },
    operationalProblem: { fr: "Enchaîner 7 étapes contractuelles sans incohérence.", en: "Chain 7 contract-bound steps without inconsistency." },
    expectedActionHint: { fr: "SKU-001 · 50 u. · REC-01 → B-01-R1-L1 — complétez chaque étape.", en: "SKU-001 · 50 u. · REC-01 → B-01-R1-L1 — complete each step." },
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
    situation: { fr: "Peak Week Jour 2 — variance −5 u. injectée @ B-01-R1-L1.", en: "Peak Week Day 2 — injected −5 u. variance @ B-01-R1-L1." },
    evidenceToObserve: { fr: "Variance au M5_CYCLE_COUNT — M5_ADJ (MI07) requis avant réappro/KPI.", en: "Variance at M5_CYCLE_COUNT — M5_ADJ (MI07) required before replenish/KPI." },
    operationalProblem: { fr: "Écart non corrigé bloque réappro, KPI et conformité.", en: "Uncorrected variance blocks replenish, KPI and compliance." },
    expectedActionHint: { fr: "Détectez −5 u., postez M5_ADJ avec justification, puis poursuivez.", en: "Detect −5 u., post M5_ADJ with justification, then continue." },
    transactionMonitorHint: { fr: "Vérifiez les mouvements avant et après l'ajustement inventaire.", en: "Verify movements before and after inventory adjustment." },
    complianceHint: { fr: "Ne clôturez pas avec écart ouvert.", en: "Do not close with open variance." },
    learningTakeaway: { fr: "Les exceptions inventaire doivent être traitées avant le pilotage.", en: "Inventory exceptions must be handled before steering." },
  },
  "SCN-017": {
    scnCode: "SCN-017",
    situation: { fr: "Peak Week Jour 3 — capstone décisionnel avec KPI snapshot.", en: "Peak Week Day 3 — decision capstone with KPI snapshot." },
    evidenceToObserve: { fr: "Snapshot M5_KPI obligatoire — décision cite ≥2 KPI chiffrés.", en: "M5_KPI snapshot required — decision cites ≥2 numeric KPIs." },
    operationalProblem: { fr: "Formuler décision stratégique avec trade-off et horizon 90–180 j.", en: "Formulate strategic decision with trade-off and 90–180 day horizon." },
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
