# TEC.LOG — Classroom Dataset Standard
## Version 1.0 — 2026-05-18

This document defines the **canonical pedagogical dataset** for the Odoo EDU LAB
(edu-concorde-logistics-lab.odoo.com) used across all TEC.LOG modules M1–M5.

---

## Dataset Architecture

### Product Catalogue

| Code | Name | Type | Tracking | Primary Module | Role |
|------|------|------|----------|----------------|------|
| SKU-001 | Boîte carton standard | Goods | None | M1, M2 | Core demo — GR, putaway, picking |
| SKU-002 | Palette bois standard | Goods | None | M2 | Demo — internal transfer, heavy item |
| SKU-003 | Film étirable transparent | Goods | Lot | M2, M3 | Lot tracking demo, cycle count |
| SKU-004 | Ruban adhésif d'emballage | Goods | Lot | M2, M3 | Lot tracking + Min/Max replenishment |
| SKU-005 | Étiquette code-barres | Goods | None | M3, M4 | Min/Max replenishment, KPI data |
| SKU-006 | Colle industrielle | Goods | None | M4 | KPI data (slow mover) |
| SKU-007 | Sac plastique refermable | Goods | None | M4 | KPI data (fast mover) |
| SKU-008 | Intercalaire carton | Goods | None | M4 | KPI data |
| SKU-009 | Cerclage plastique | Goods | None | M5 | End-to-end flow |
| SKU-010 | Coussin d'air protection | Goods | None | M5 | End-to-end flow |
| BOX-001 | BOX-001 (carton assemblé) | Goods | None | M1, M2 | GR demo, packaging |

### Location Structure

```
WH/ (Warehouse: concorde-logistics-lab)
├── WH/Input          (Réception — dock d'entrée)
├── WH/Stock          (Stock principal — root)
│   ├── WH/Stock/Allée-A   (Articles lourds / volumétriques)
│   ├── WH/Stock/Allée-B   (Articles lot-trackés)
│   └── WH/Stock/Allée-C   (Articles petits / consommables)
├── WH/Output         (Expédition — dock de sortie)
└── WH/Quality Control (Zone contrôle qualité)
```

### Putaway Rules (7 rules)

| Product | From | To | Module |
|---------|------|----|--------|
| SKU-001 | WH/Input | WH/Stock/Allée-A | M2 demo |
| SKU-002 | WH/Input | WH/Stock/Allée-A | M2 demo |
| SKU-003 | WH/Input | WH/Stock/Allée-B | M2 demo |
| SKU-004 | WH/Input | WH/Stock/Allée-C | M2 demo |
| SKU-005 | WH/Input | WH/Stock/Allée-C | M3 demo |
| BOX-001 | WH/Input | WH/Stock/Allée-A | M2 demo |

### Lot Structure

| Lot | Product | Qty | Module | Purpose |
|-----|---------|-----|--------|---------|
| LOT-SKU003-A | SKU-003 | 50 | M2, M3 | Lot tracking demo — oldest lot (FIFO) |
| LOT-SKU003-B | SKU-003 | 30 | M3 | Cycle count — partial lot |
| LOT-SKU003-C | SKU-003 | 20 | M3 | Cycle count — smallest lot |
| LOT-SKU004-2024-A | SKU-004 | 40 | M2, M3 | Lot tracking + replenishment trigger |
| LOT-SKU004-2024-B | SKU-004 | 25 | M3 | Lot tracking — second lot |

### Reorder Rules (Min/Max)

| Product | Min | Max | Location | Module | Teaching Point |
|---------|-----|-----|----------|--------|----------------|
| SKU-003 | 30 | 150 | WH/Stock | M3 | Replenishment trigger at 100 units |
| SKU-004 | 10 | 50 | WH/Stock | M3 | Replenishment trigger at 65 units |
| SKU-005 | 20 | 100 | WH/Stock | M3 | Replenishment trigger at 500 units |

---

## Module-by-Module Dataset Usage

### M1 — Fondamentaux ERP/WMS

**Teaching dataset:**
- SKU-001 (130 units @ Allée-A) — GR demo, inventory update
- BOX-001 (75 units @ Allée-A) — packaging demo
- WH/IN/00002, WH/IN/00003 (done) — completed receipts for reference

**Exam dataset:**
- Students receive a fresh PO for SKU-001 (50 units) and must validate GR
- Students must verify stock update in Inventory → Products

**Error scenarios:**
- Forgetting to validate the receipt (state stays "ready" not "done")
- Confusing "Save" with "Validate/Post"
- Looking at virtual stock instead of on-hand stock

**Odoo Lab URL:** `/odoo/inventory/products` → filter by SKU-001

---

### M2 — Exécution d'entrepôt

**Teaching dataset:**
- SKU-001 @ Allée-A (130 units) — putaway demo
- SKU-002 @ Allée-A (20 units) — internal transfer demo
- SKU-003 @ Allée-B (lots A/B/C) — lot tracking demo
- SKU-004 @ Allée-C (lots 2024-A/B) — lot tracking + putaway
- WH/INT/00001 (draft) — internal transfer to demonstrate

**Exam dataset:**
- Students receive a receipt for SKU-003 (30 units, new lot LOT-EXAM-001)
- Students must validate receipt, verify putaway to Allée-B, confirm lot creation

**Error scenarios:**
- Receiving without specifying lot number (lot-tracked product)
- Putaway rule not applied (product received directly to WH/Stock root)
- Internal transfer left in "draft" state

**Odoo Lab URL:** `/odoo/inventory/picking-type-internal` → WH/INT/00001

---

### M3 — Contrôle des stocks

**Teaching dataset:**
- SKU-003 @ Allée-B (lots A=50, B=30, C=20) — cycle count demo
- SKU-004 @ Allée-C (lots 2024-A=40, 2024-B=25) — replenishment trigger
- SKU-005 @ Allée-C (500 units) — Min/Max demo
- Reorder rules for SKU-003, SKU-004, SKU-005

**Exam dataset:**
- Students must perform a cycle count for SKU-003 (adjust LOT-B from 30 to 28)
- Students must trigger replenishment for SKU-004 (current qty=65, min=10 → no trigger needed; reduce to 8 → trigger)

**Error scenarios:**
- Applying inventory adjustment without selecting the correct lot
- Confusing "Scheduled Date" with "Deadline" in replenishment
- Not confirming the replenishment order

**Odoo Lab URL:** `/odoo/inventory/reporting/inventory` → filter by SKU-003

---

### M4 — Indicateurs de performance logistique

**Teaching dataset:**
- All products with stock movements (receipts WH/IN/00002–00006, delivery WH/OUT/00001)
- SKU-001 movement history (receipts + delivery)
- Reorder rules for KPI analysis

**Exam dataset:**
- Students analyze the KPI dashboard and identify:
  - OTIF rate from WH/OUT/00001
  - Stock accuracy from cycle count adjustments
  - Fill Rate from available stock vs demand

**Error scenarios:**
- Confusing "Inventory Valuation" with "Stock Moves"
- Reading "Forecasted Quantity" as current stock
- Not filtering by date range for KPI analysis

**Odoo Lab URL:** `/odoo/inventory/reporting/moves` → filter by product

---

### M5 — Simulation opérationnelle intégrée

**Teaching dataset:**
- Full end-to-end: PO → GR → Putaway → Picking → Delivery → Cycle Count
- Uses SKU-009, SKU-010 (0 stock — students create from scratch)
- Audit trail: all 10 pickings visible in history

**Exam dataset:**
- Students execute complete flow for SKU-009 (create PO, validate GR, internal transfer, create SO, validate delivery)
- Students generate audit report

**Error scenarios:**
- Breaking the PO → GR link (creating GR without PO reference)
- Forgetting to validate each step before proceeding
- Mixing up source documents (origin field)

**Odoo Lab URL:** `/odoo/inventory` → full dashboard

---

## Classroom Reset Procedure

### Before Each Class (Teacher)

1. **TEC.WMS:** Use MonitorDashboard → "Réinitialiser" for each student run
2. **Odoo EDU LAB:** No reset needed — Odoo data is persistent and additive
3. **Stock levels:** Run `odoo_stock_adjust.py` if stock was consumed during previous class

### Exam Reset (Teacher)

1. Archive any student-created POs/SOs from previous exam
2. Run stock adjustment script to restore canonical quantities
3. Verify putaway rules are intact
4. Confirm lot quantities match the standard above

### Student Self-Reset (TEC.WMS only)

Students can use the "Nouvelle tentative" button in their run report to reset their own TEC.WMS session. Odoo data is NOT reset per student.

---

## Quick Reference Card (for classroom display)

```
ODOO EDU LAB — STOCK REFERENCE
═══════════════════════════════════════════════════════
ALLÉE-A (Articles lourds)
  SKU-001  Boîte carton      130 u.
  SKU-002  Palette bois       20 u.
  BOX-001  Carton assemblé    75 u.

ALLÉE-B (Articles lot-trackés)
  SKU-003  Film étirable     100 u. (3 lots: A=50, B=30, C=20)

ALLÉE-C (Consommables / petits articles)
  SKU-004  Ruban adhésif      65 u. (2 lots: 2024-A=40, 2024-B=25)
  SKU-005  Étiquettes        500 u.

RÈGLES MIN/MAX
  SKU-003: min=30, max=150
  SKU-004: min=10, max=50
  SKU-005: min=20, max=100
═══════════════════════════════════════════════════════
```
