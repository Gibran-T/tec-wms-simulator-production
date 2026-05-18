# TEC.LOG — Exam Snapshot & Teacher Reset Procedure
## Version 1.0 — 2026-05-18

This document defines the **official exam snapshot** (canonical state of the Odoo EDU LAB
before any exam) and the **teacher reset procedure** to restore it after classroom use.

---

## Exam Snapshot — Canonical State

The following table defines the exact state of the Odoo EDU LAB that must exist
**before any exam or graded evaluation session**.

### Stock Quantities (Canonical)

| Product | Location | Lot | Qty | Tolerance |
|---------|----------|-----|-----|-----------|
| SKU-001 Boîte carton | WH/Stock/Allée-A | — | 130 | ±0 |
| SKU-002 Palette bois | WH/Stock/Allée-A | — | 20 | ±0 |
| BOX-001 Carton assemblé | WH/Stock/Allée-A | — | 75 | ±0 |
| SKU-003 Film étirable | WH/Stock/Allée-B | LOT-SKU003-A | 50 | ±0 |
| SKU-003 Film étirable | WH/Stock/Allée-B | LOT-SKU003-B | 30 | ±0 |
| SKU-003 Film étirable | WH/Stock/Allée-B | LOT-SKU003-C | 20 | ±0 |
| SKU-004 Ruban adhésif | WH/Stock/Allée-C | LOT-SKU004-2024-A | 40 | ±0 |
| SKU-004 Ruban adhésif | WH/Stock/Allée-C | LOT-SKU004-2024-B | 25 | ±0 |
| SKU-005 Étiquettes | WH/Stock/Allée-C | — | 500 | ±0 |

**Total canonical stock:** 970 units across 9 quants in 3 Allées.

### Putaway Rules (Canonical — 6 rules)

| ID | Product | From | To |
|----|---------|------|----|
| 1 | SKU-001 | WH/Input | WH/Stock/Allée-A |
| 3 | SKU-003 | WH/Input | WH/Stock/Allée-B |
| 4 | SKU-004 | WH/Input | WH/Stock/Allée-C |
| 5 | SKU-002 | WH/Input | WH/Stock/Allée-A |
| 6 | BOX-001 | WH/Input | WH/Stock/Allée-A |
| 7 | SKU-005 | WH/Input | WH/Stock/Allée-C |

### Reorder Rules (Canonical — 3 rules)

| Product | Min | Max | Location |
|---------|-----|-----|----------|
| SKU-004 | 10 | 50 | WH/Stock |
| SKU-005 | 20 | 100 | WH/Stock |
| SKU-003 | 30 | 150 | WH/Stock |

---

## Teacher Reset Procedure

### Step 1 — TEC.WMS Reset (5 minutes)

1. Log in to TEC.WMS as teacher/admin
2. Navigate to **Tableau de bord enseignant → Surveillance**
3. For each student with a completed or in-progress run:
   - Click the **"Réinitialiser"** button (red, with confirmation dialog)
   - Confirm reset — this deletes the run and all child records
4. Optionally reset quiz attempts: click **"Réinit. quiz"** for each student

### Step 2 — Odoo EDU LAB Stock Reset (10 minutes)

Run the stock adjustment script from the sandbox:

```bash
python3 /home/ubuntu/odoo_stock_adjust.py
```

This script restores all stock quantities to canonical values.

**Manual alternative (if script unavailable):**

1. In Odoo: Inventory → Products → SKU-001
2. Click **"Update Quantity"**
3. Set quantity to 130 in WH/Stock/Allée-A
4. Repeat for each product in the canonical table above

### Step 3 — Archive Exam Documents (5 minutes)

After each exam, archive student-created documents to keep the lab clean:

1. Inventory → Receipts → filter by date (today)
2. Select all exam-created receipts → Action → Archive
3. Inventory → Delivery Orders → filter by date (today)
4. Select all exam-created deliveries → Action → Archive

**Important:** Do NOT archive the reference documents (WH/IN/00002–00006, WH/OUT/00001).
These are teaching reference documents and must remain visible.

### Step 4 — Verify Reset (2 minutes)

Run the audit script to confirm canonical state:

```bash
python3 /home/ubuntu/odoo_audit.py 2>&1 | grep -A 20 "STOCK QUANTS"
```

Expected output should match the canonical table above.

---

## Pre-Exam Checklist

Use this checklist before every graded evaluation:

```
□ TEC.WMS: All student runs reset (MonitorDashboard shows 0 active runs)
□ TEC.WMS: Quiz attempts reset for all students (if required)
□ Odoo: SKU-001 @ Allée-A = 130 units
□ Odoo: SKU-002 @ Allée-A = 20 units
□ Odoo: BOX-001 @ Allée-A = 75 units
□ Odoo: SKU-003 @ Allée-B = 100 units (3 lots)
□ Odoo: SKU-004 @ Allée-C = 65 units (2 lots)
□ Odoo: SKU-005 @ Allée-C = 500 units
□ Odoo: 6 putaway rules active
□ Odoo: 3 reorder rules active
□ Odoo: Exam documents from previous session archived
□ Odoo: Reference documents (WH/IN/00002–00006, WH/OUT/00001) still visible
□ Student accounts: All students can log in to TEC.WMS
□ Odoo access: Students have read access to edu-concorde-logistics-lab.odoo.com
```

---

## Troubleshooting

### "Stock shows wrong quantity after exam"

Run `odoo_stock_adjust.py` to restore canonical quantities. If a student created
an inventory adjustment that cannot be undone, use the Odoo backend:
Inventory → Reporting → Inventory → select product → adjust quantity manually.

### "Putaway rule is missing"

In Odoo: Inventory → Configuration → Putaway Rules → create rule manually
using the canonical table above.

### "Student cannot see Odoo data"

Verify the student is accessing `https://edu-concorde-logistics-lab.odoo.com`
(not demo.odoo.com or any other instance). The lab URL is embedded in TEC.WMS
slide links — check the Odoo Lab button in each module.

### "TEC.WMS reset button is greyed out"

The reset button is only available for runs in `in_progress` or `completed` state.
If the run is in `not_started` state, no reset is needed.

### "Quiz reset is not working"

The `quiz.resetAttempts` procedure requires teacher or admin role.
Verify the teacher account has `role = 'teacher'` or `role = 'admin'` in the database.
