/**
 * TEC.WMS Production Seed Script
 * Restores: 5 modules (M1-M5), 17 unique scenarios, 10 SKUs, 13 bins,
 *           replenishment params, and 3 demo accounts.
 * Run: node scripts/seed-production.mjs
 * Safe to re-run: uses INSERT ... ON DUPLICATE KEY UPDATE
 */
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set in .env");
  process.exit(1);
}

const conn = await mysql.createConnection(DATABASE_URL);
console.log("🌱 TEC.WMS Production Seed — Starting...\n");

// ─── Modules ─────────────────────────────────────────────────────────────────
console.log("📦 Seeding modules M1–M5...");
const modules = [
  { code: "M1", titleFr: "Fondements de la chaîne logistique et intégration ERP/WMS", titleEn: "Supply Chain Fundamentals and ERP/WMS Integration", isActive: 1, order: 1, unlockedByModuleId: null, stepsJson: JSON.stringify(["PO","GR","STOCK","SO","GI","CC","COMPLIANCE"]) },
  { code: "M2", titleFr: "Exécution d'entrepôt et gestion des emplacements", titleEn: "Warehouse Execution and Location Management", isActive: 1, order: 2, unlockedByModuleId: 1, stepsJson: JSON.stringify(["PUTAWAY","BIN_CAPACITY","FIFO","INVENTORY_ACCURACY"]) },
  { code: "M3", titleFr: "Contrôle des stocks et réapprovisionnement", titleEn: "Inventory Control and Replenishment", isActive: 1, order: 3, unlockedByModuleId: 2, stepsJson: JSON.stringify(["CYCLE_COUNT","VARIANCE","ADJUSTMENT","REPLENISHMENT"]) },
  { code: "M4", titleFr: "Module 4 — Indicateurs de performance logistique", titleEn: "Module 4 — Logistics Performance Indicators", isActive: 1, order: 4, unlockedByModuleId: 3, stepsJson: null },
  { code: "M5", titleFr: "Module 5 — Simulation opérationnelle intégrée", titleEn: "Module 5 — Integrated Operational Simulation", isActive: 1, order: 5, unlockedByModuleId: 4, stepsJson: null },
];

for (const m of modules) {
  await conn.execute(
    "INSERT INTO modules (code, titleFr, titleEn, isActive, `order`, unlockedByModuleId, stepsJson) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE titleFr=VALUES(titleFr), titleEn=VALUES(titleEn), `order`=VALUES(`order`), unlockedByModuleId=VALUES(unlockedByModuleId)",
    [m.code, m.titleFr, m.titleEn, m.isActive, m.order, m.unlockedByModuleId, m.stepsJson]
  );
}
console.log("  ✓ 5 modules seeded");

// ─── Get module IDs ───────────────────────────────────────────────────────────
const [moduleRows] = await conn.execute("SELECT id, code FROM modules ORDER BY `order`");
const mid = {};
for (const r of moduleRows) mid[r.code] = r.id;
console.log("  Module IDs:", mid);

// ─── Master SKUs ──────────────────────────────────────────────────────────────
console.log("\n📦 Seeding master SKUs...");
const skus = [
  ["SKU-001", "Boîte carton standard (Carton Box)", "Standard Carton Box", "UN", 500],
  ["SKU-002", "Palette bois (Wooden Pallet)", "Wooden Pallet", "UN", 100],
  ["SKU-003", "Film étirable (Stretch Film)", "Stretch Film Roll", "RL", 200],
  ["SKU-004", "Casque de sécurité (Safety Helmet)", "Safety Helmet", "UN", 150],
  ["SKU-005", "Gants de manutention (Handling Gloves)", "Handling Gloves", "PR", 300],
  ["SKU-006", "Étiquette code-barres (Barcode Label)", "Barcode Label Roll", "RL", 1000],
  ["SKU-007", "Ruban adhésif (Adhesive Tape)", "Adhesive Tape Roll", "RL", 400],
  ["SKU-008", "Scanner code-barres (Barcode Scanner)", "Barcode Scanner", "UN", 50],
  ["SKU-009", "Chariot de manutention (Hand Truck)", "Hand Truck", "UN", 20],
  ["SKU-010", "Cutter de sécurité (Safety Cutter)", "Safety Cutter", "UN", 200],
];
for (const [sku, fr, en, uom, cap] of skus) {
  await conn.execute(
    "INSERT INTO master_skus (sku, descriptionFr, descriptionEn, unitOfMeasure, maxCapacity) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE descriptionFr=VALUES(descriptionFr), descriptionEn=VALUES(descriptionEn)",
    [sku, fr, en, uom, cap]
  );
}
console.log("  ✓ 10 SKUs seeded");

// ─── Master Bins ──────────────────────────────────────────────────────────────
console.log("\n📦 Seeding master bins...");
const bins = [
  ["A-01-R1-L1", "Zone A, Rangée 1, Niveau 1", "PICKING", 200],
  ["A-01-R1-L2", "Zone A, Rangée 1, Niveau 2", "PICKING", 200],
  ["A-02-R1-L1", "Zone A, Rangée 2, Niveau 1", "PICKING", 200],
  ["B-01-R1-L1", "Zone B, Rangée 1, Niveau 1", "STOCKAGE", 500],
  ["B-01-R1-L2", "Zone B, Rangée 1, Niveau 2", "STOCKAGE", 500],
  ["B-02-R1-L1", "Zone B, Rangée 2, Niveau 1", "STOCKAGE", 500],
  ["C-01-R1-L1", "Zone C, Rangée 1, Niveau 1 — Réserve", "RESERVE", 1000],
  ["C-01-R1-L2", "Zone C, Rangée 1, Niveau 2 — Réserve", "RESERVE", 1000],
  ["REC-01", "Quai de réception 01", "RECEPTION", 300],
  ["REC-02", "Quai de réception 02", "RECEPTION", 300],
  ["EXP-01", "Quai d'expédition 01", "EXPEDITION", 300],
  ["EXP-02", "Quai d'expédition 02", "EXPEDITION", 300],
  ["TRANSIT-01", "Zone de transit", "STOCKAGE", 400],
];
for (const [code, desc, zone, cap] of bins) {
  await conn.execute(
    "INSERT INTO master_bins (binCode, description, zone, maxCapacity) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE description=VALUES(description), maxCapacity=VALUES(maxCapacity)",
    [code, desc, zone, cap]
  );
  await conn.execute(
    "INSERT INTO bin_capacity (binCode, maxCapacity) VALUES (?,?) ON DUPLICATE KEY UPDATE maxCapacity=VALUES(maxCapacity)",
    [code, cap]
  );
}
console.log("  ✓ 13 bins seeded");

// ─── Replenishment Params ─────────────────────────────────────────────────────
console.log("\n📦 Seeding replenishment params...");
const replenishment = [
  ["SKU-001", 50, 500, 30, 3],
  ["SKU-002", 20, 100, 10, 7],
  ["SKU-003", 40, 200, 20, 5],
  ["SKU-004", 50, 200, 25, 3],
  ["SKU-005", 80, 300, 30, 5],
  ["SKU-006", 100, 1000, 50, 2],
  ["SKU-007", 60, 400, 25, 4],
  ["SKU-008", 5, 50, 3, 14],
  ["SKU-009", 3, 20, 2, 21],
  ["SKU-010", 30, 200, 15, 5],
];
for (const [sku, min, max, ss, lt] of replenishment) {
  await conn.execute(
    "INSERT INTO replenishment_params (sku, minQty, maxQty, safetyStock, leadTimeDays) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE minQty=VALUES(minQty), maxQty=VALUES(maxQty), safetyStock=VALUES(safetyStock)",
    [sku, min, max, ss, lt]
  );
}
console.log("  ✓ 10 replenishment params seeded");

// ─── Scenarios ────────────────────────────────────────────────────────────────
console.log("\n📦 Seeding scenarios...");

const scenarios = [
  // ── M1 (5 scenarios) ──────────────────────────────────────────────────────
  [mid.M1, "Scénario 1 — Cycle propre",
   "Exécutez un cycle complet PO→GR→SO→GI→Cycle Count sans erreur. Objectif : maîtriser le flux standard.",
   "Execute a complete PO→GR→SO→GI→Cycle Count cycle without errors. Objective: master the standard logistics flow.",
   "facile", JSON.stringify({ preloadedTransactions: [], context: "Entrepôt vide — démarrage à zéro." })],

  [mid.M1, "Scénario 2 — Réception fantôme (GR non postée)",
   "Une GR a été créée mais non postée. Détectez l'anomalie, postez la transaction et continuez le cycle.",
   "A GR was created but not posted. Detect the anomaly, post the transaction, and continue the cycle.",
   "moyen", JSON.stringify({
     preloadedTransactions: [
       { docType: "PO", sku: "SKU-001", bin: "REC-01", qty: 100, posted: true, docRef: "PO-2025-001" },
       { docType: "GR", sku: "SKU-001", bin: "B-01-R1-L1", qty: 100, posted: false, docRef: "GR-2025-001" },
     ],
     context: "GR non postée détectée — transaction fantôme.",
   })],

  [mid.M1, "Scénario 3 — Stock insuffisant",
   "Un SO a été créé pour une quantité supérieure au stock disponible. Gérez le backorder et approvisionnez.",
   "A SO was created for a quantity exceeding available stock. Manage the backorder and replenish inventory.",
   "moyen", JSON.stringify({
     preloadedTransactions: [
       { docType: "PO", sku: "SKU-003", bin: "REC-01", qty: 50, posted: true, docRef: "PO-2025-002" },
       { docType: "GR", sku: "SKU-003", bin: "A-01-R1-L1", qty: 50, posted: true, docRef: "GR-2025-002" },
     ],
     context: "Stock de 50 unités — SO demande 80 unités.",
   })],

  [mid.M1, "Scénario 4 — Écart d'inventaire",
   "Le comptage physique révèle un écart par rapport au stock système. Résolvez avec une transaction ADJ.",
   "Physical count reveals a discrepancy against system stock. Resolve it with an ADJ transaction.",
   "difficile", JSON.stringify({
     preloadedTransactions: [
       { docType: "PO", sku: "SKU-006", bin: "REC-01", qty: 200, posted: true, docRef: "PO-2025-003" },
       { docType: "GR", sku: "SKU-006", bin: "B-02-R1-L1", qty: 200, posted: true, docRef: "GR-2025-003" },
     ],
     context: "Stock système : 200 | Stock physique : 185 — écart de -15.",
   })],

  [mid.M1, "Scénario 5 — Non-conformités multiples",
   "Plusieurs anomalies simultanées : GR non postée, stock négatif potentiel, écart inventaire. Résolvez dans l'ordre.",
   "Multiple simultaneous anomalies: unposted GR, potential negative stock, inventory discrepancy. Resolve them in the correct order.",
   "difficile", JSON.stringify({
     preloadedTransactions: [
       { docType: "PO", sku: "SKU-004", bin: "REC-01", qty: 30, posted: true, docRef: "PO-2025-004" },
       { docType: "GR", sku: "SKU-004", bin: "A-02-R1-L1", qty: 30, posted: false, docRef: "GR-2025-004" },
       { docType: "PO", sku: "SKU-005", bin: "REC-02", qty: 60, posted: true, docRef: "PO-2025-005" },
       { docType: "GR", sku: "SKU-005", bin: "B-01-R1-L2", qty: 60, posted: true, docRef: "GR-2025-005" },
     ],
     context: "GR non postée + écart inventaire SKU-005 (-8 unités).",
   })],

  // ── M2 (3 scenarios) ──────────────────────────────────────────────────────
  [mid.M2, "M2 — Scénario 1 : Rangement structuré et affectation d'emplacement",
   "Recevez une marchandise et rangez-la dans le bon bin selon les règles de capacité et de zone. Objectif : maîtriser le putaway LT01.",
   "Receive goods and store them in the correct bin according to capacity and zone rules. Objective: master the LT01 putaway process.",
   "facile", JSON.stringify({
     preloadedTransactions: [
       { docType: "PO", sku: "SKU-001", bin: "REC-01", qty: 150, posted: true, docRef: "PO-M2-001" },
       { docType: "GR", sku: "SKU-001", bin: "REC-01", qty: 150, posted: true, docRef: "GR-M2-001" },
     ],
     context: "150 unités SKU-001 reçues au quai REC-01. Rangez dans la zone STOCKAGE selon la capacité disponible.",
     module: 2,
     lots: [{ lotNumber: "LOT-2025-001", receivedAt: "2025-01-15T08:00:00Z", qty: 150 }],
   })],

  [mid.M2, "M2 — Scénario 2 : Validation de la capacité d'emplacement",
   "Tentez de ranger une quantité dépassant la capacité d'un bin. Le système doit détecter le dépassement et proposer une alternative.",
   "Attempt to store a quantity exceeding a bin's capacity. The system must detect the overflow and suggest an alternative location.",
   "moyen", JSON.stringify({
     preloadedTransactions: [
       { docType: "PO", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "PO-M2-002" },
       { docType: "GR", sku: "SKU-002", bin: "REC-01", qty: 600, posted: true, docRef: "GR-M2-002" },
     ],
     context: "600 unités SKU-002 reçues. Le bin B-01-R1-L1 a une capacité de 500. Gérez le dépassement.",
     module: 2,
     lots: [{ lotNumber: "LOT-2025-002", receivedAt: "2025-02-01T10:00:00Z", qty: 600 }],
   })],

  [mid.M2, "M2 — Scénario 3 : Application de la méthode FIFO en gestion multi-lots",
   "Trois lots du même SKU sont en stock. Respectez l'ordre FIFO lors du rangement et de la préparation de commande.",
   "Three lots of the same SKU are in stock. Follow FIFO order during putaway and order picking.",
   "difficile", JSON.stringify({
     preloadedTransactions: [
       { docType: "PO", sku: "SKU-003", bin: "REC-01", qty: 300, posted: true, docRef: "PO-M2-003" },
       { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L1", qty: 100, posted: true, docRef: "GR-M2-003A" },
       { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L2", qty: 100, posted: true, docRef: "GR-M2-003B" },
       { docType: "GR", sku: "SKU-003", bin: "B-02-R1-L1", qty: 100, posted: true, docRef: "GR-M2-003C" },
     ],
     context: "3 lots SKU-003 en stock. Respectez l'ordre FIFO : LOT-A (jan), LOT-B (fév), LOT-C (mars).",
     module: 2,
     lots: [
       { lotNumber: "LOT-A-2025", receivedAt: "2025-01-10T08:00:00Z", qty: 100 },
       { lotNumber: "LOT-B-2025", receivedAt: "2025-02-10T08:00:00Z", qty: 100 },
       { lotNumber: "LOT-C-2025", receivedAt: "2025-03-10T08:00:00Z", qty: 100 },
     ],
   })],

  // ── M3 (3 scenarios) ──────────────────────────────────────────────────────
  [mid.M3, "M3 — Scénario 1 : Inventaire cyclique simple",
   "Réaliser un inventaire cyclique et analyser les écarts entre stock système et stock physique.",
   "Perform a cycle count and analyze discrepancies between system stock and physical stock.",
   "facile", JSON.stringify({
     preloadedTransactions: [
       { docType: "PO", sku: "SKU-001", bin: "REC-01", qty: 100, posted: true, docRef: "PO-M3-001" },
       { docType: "GR", sku: "SKU-001", bin: "B-01-R1-L1", qty: 100, posted: true, docRef: "GR-M3-001" },
       { docType: "PO", sku: "SKU-003", bin: "REC-01", qty: 80, posted: true, docRef: "PO-M3-002" },
       { docType: "GR", sku: "SKU-003", bin: "B-01-R1-L2", qty: 80, posted: true, docRef: "GR-M3-002" },
     ],
     context: "Stock système : SKU-001 = 100 unités, SKU-003 = 80 unités. Réalisez le comptage cyclique.",
     module: 3,
     cycleCountTargets: [
       { sku: "SKU-001", bin: "B-01-R1-L1", systemQty: 100, physicalQty: 97 },
       { sku: "SKU-003", bin: "B-01-R1-L2", systemQty: 80, physicalQty: 80 },
     ],
   })],

  [mid.M3, "M3 — Scénario 2 : Analyse d'écart et ajustement d'inventaire",
   "Identifier un écart significatif, fournir une justification et procéder à l'ajustement conforme aux règles internes.",
   "Identify a significant discrepancy, provide a justification, and perform the adjustment in compliance with internal rules.",
   "moyen", JSON.stringify({
     preloadedTransactions: [
       { docType: "PO", sku: "SKU-006", bin: "REC-01", qty: 500, posted: true, docRef: "PO-M3-003" },
       { docType: "GR", sku: "SKU-006", bin: "B-02-R1-L1", qty: 500, posted: true, docRef: "GR-M3-003" },
       { docType: "SO", sku: "SKU-006", bin: "B-02-R1-L1", qty: 120, posted: true, docRef: "SO-M3-001" },
       { docType: "GI", sku: "SKU-006", bin: "B-02-R1-L1", qty: 120, posted: true, docRef: "GI-M3-001" },
     ],
     context: "Stock système : SKU-006 = 380 unités. Comptage physique révèle 352 unités. Écart de -28.",
     module: 3,
     cycleCountTargets: [{ sku: "SKU-006", bin: "B-02-R1-L1", systemQty: 380, physicalQty: 352 }],
     adjustmentThreshold: 20,
   })],

  [mid.M3, "M3 — Scénario 3 : Réapprovisionnement selon paramètres Min/Max et stock de sécurité",
   "Analyser les niveaux d'inventaire et générer une recommandation de réapprovisionnement conforme aux paramètres définis.",
   "Analyze inventory levels and generate a replenishment recommendation aligned with the defined Min/Max and safety stock parameters.",
   "difficile", JSON.stringify({
     preloadedTransactions: [
       { docType: "PO", sku: "SKU-004", bin: "REC-01", qty: 200, posted: true, docRef: "PO-M3-004" },
       { docType: "GR", sku: "SKU-004", bin: "B-01-R1-L1", qty: 200, posted: true, docRef: "GR-M3-004" },
       { docType: "SO", sku: "SKU-004", bin: "B-01-R1-L1", qty: 170, posted: true, docRef: "SO-M3-002" },
       { docType: "GI", sku: "SKU-004", bin: "B-01-R1-L1", qty: 170, posted: true, docRef: "GI-M3-002" },
     ],
     context: "SKU-004 = 30 unités (Min=50, Max=200, SS=25). Générez la recommandation de réapprovisionnement.",
     module: 3,
     replenishmentParams: [{ sku: "SKU-004", minQty: 50, maxQty: 200, safetyStock: 25, leadTimeDays: 3 }],
   })],

  // ── M4 (3 scenarios) ──────────────────────────────────────────────────────
  [mid.M4, "M4 — Scénario 1 : Analyse de la rotation des stocks",
   "Calculer et interpréter le taux de rotation des stocks afin d'identifier une situation de surstock ou sous-performance.",
   "Calculate and interpret the inventory turnover rate to identify overstock or underperformance situations.",
   "facile", null],

  [mid.M4, "M4 — Scénario 2 : Analyse du taux de service et des erreurs opérationnelles",
   "Identifier les causes d'un faible taux de service et analyser l'impact des erreurs logistiques sur la performance globale.",
   "Identify the root causes of a low service level and analyze the impact of logistics errors on overall performance.",
   "moyen", null],

  [mid.M4, "M4 — Scénario 3 : Diagnostic global de performance logistique",
   "Analyser plusieurs indicateurs combinés et proposer une décision stratégique basée sur les données observées.",
   "Analyze multiple combined KPIs and propose a strategic decision based on the observed data.",
   "difficile", null],

  // ── M5 (3 scenarios) ──────────────────────────────────────────────────────
  [mid.M5, "M5 — Scénario 1 : Cycle opérationnel complet",
   "Réaliser un cycle complet fournisseur → entrepôt → client en respectant les règles opérationnelles.",
   "Complete a full supplier to warehouse to customer cycle following all operational rules.",
   "moyen", null],

  [mid.M5, "M5 — Scénario 2 : Gestion d'écarts et réajustement",
   "Gérer une situation incluant des écarts d'inventaire et proposer des actions correctives.",
   "Manage a situation involving inventory discrepancies and propose corrective actions.",
   "difficile", null],

  [mid.M5, "M5 — Scénario 3 : Analyse décisionnelle stratégique",
   "Analyser les indicateurs de performance globaux et formuler une décision stratégique justifiée.",
   "Analyze global performance indicators and formulate a justified strategic decision.",
   "difficile", null],
];

for (const [moduleId, name, descFr, descEn, difficulty, stateJson] of scenarios) {
  await conn.execute(
    "INSERT INTO scenarios (moduleId, name, descriptionFr, descriptionEn, difficulty, initialStateJson, isActive, createdBy) VALUES (?,?,?,?,?,?,1,1) ON DUPLICATE KEY UPDATE descriptionFr=VALUES(descriptionFr), descriptionEn=VALUES(descriptionEn), difficulty=VALUES(difficulty)",
    [moduleId, name, descFr, descEn, difficulty, stateJson]
  );
}
console.log("  ✓ 17 scenarios seeded (5 M1 + 3 M2 + 3 M3 + 3 M4 + 3 M5)");

// ─── Demo Accounts ────────────────────────────────────────────────────────────
console.log("\n👤 Seeding demo accounts...");
const accounts = [
  { email: "student@concorde.ca",  name: "Étudiant Demo",    role: "student", password: "Student123!" },
  { email: "etudiant@concorde.ca", name: "Étudiant FR Demo", role: "student", password: "Student123!" },
  { email: "prof@concorde.ca",     name: "Professeur Demo",  role: "teacher", password: "Teacher123!" },
];

for (const acc of accounts) {
  const openId = `local:${acc.email}`;
  const hash = await bcrypt.hash(acc.password, 10);
  const [existing] = await conn.execute("SELECT id FROM users WHERE email = ?", [acc.email]);
  if (existing.length > 0) {
    await conn.execute(
      "UPDATE users SET passwordHash=?, role=?, loginMethod='local', isActive=1 WHERE email=?",
      [hash, acc.role, acc.email]
    );
    console.log(`  ✓ Updated  [${acc.role.padEnd(7)}] ${acc.email}`);
  } else {
    await conn.execute(
      "INSERT INTO users (openId, email, name, role, passwordHash, loginMethod, isActive, lastSignedIn) VALUES (?,?,?,?,?,'local',1,NOW())",
      [openId, acc.email, acc.name, acc.role, hash]
    );
    console.log(`  ✓ Created  [${acc.role.padEnd(7)}] ${acc.email}`);
  }
}

// ─── Verify ───────────────────────────────────────────────────────────────────
const [scenarioCounts] = await conn.execute("SELECT moduleId, COUNT(*) as cnt FROM scenarios GROUP BY moduleId ORDER BY moduleId");
console.log("\n📊 Scenario counts by module:");
for (const r of scenarioCounts) {
  console.log(`  Module ${r.moduleId}: ${r.cnt} scenarios`);
}

const [[{ total: totalScenarios }]] = await conn.execute("SELECT COUNT(*) as total FROM scenarios");
const [[{ total: totalModules }]] = await conn.execute("SELECT COUNT(*) as total FROM modules");

console.log(`\n✅ Seed complete!`);
console.log(`   Modules:   ${totalModules}`);
console.log(`   Scenarios: ${totalScenarios}`);
console.log(`\n═══════════════════════════════════════════════════`);
console.log(`  DEMO ACCOUNTS`);
console.log(`═══════════════════════════════════════════════════`);
console.log(`  STUDENT  student@concorde.ca  / Student123!`);
console.log(`  STUDENT  etudiant@concorde.ca / Student123!`);
console.log(`  TEACHER  prof@concorde.ca     / Teacher123!`);
console.log(`═══════════════════════════════════════════════════\n`);

await conn.end();
