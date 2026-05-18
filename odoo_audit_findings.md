# Odoo EDU LAB — Full Dataset Audit
## Date: 2026-05-18

### Products (11 total)
| Code | Name | Type | Tracking | Qty |
|------|------|------|----------|-----|
| BOX-001 | BOX-001 | consu | none | 75 |
| SKU-001 | Boîte carton standard | consu | none | 130 |
| SKU-002 | Palette bois standard | consu | none | 0 |
| SKU-003 | Film étirable transparent | consu | lot | 100 (A=50, B=30, C=20) |
| SKU-004 | Ruban adhésif d'emballage | consu | lot | 0 (lots exist, no stock) |
| SKU-005 | Étiquette code-barres | consu | none | 0 |
| SKU-006 | Colle industrielle | consu | none | 0 |
| SKU-007 | Sac plastique refermable | consu | none | 0 |
| SKU-008 | Intercalaire carton | consu | none | 0 |
| SKU-009 | Cerclage plastique | consu | none | 0 |
| SKU-010 | Coussin d'air protection | consu | none | 0 |

**GAPS:**
- All products are type=consu (consumable), NOT storable. This means Odoo does NOT enforce stock levels for most SKUs.
- SKU-002 through SKU-010 (except SKU-003) have 0 stock — no pedagogical data for M2-M5 observations.
- SKU-004 lots exist but have 0 stock — lot tracking is configured but unusable.
- "Frais de réservation" product exists (service type, $50) — not a WMS product, should be hidden or archived.

### Locations (7 internal)
| ID | Name | Usage | Active |
|----|------|-------|--------|
| 6 | WH/Input | internal | True |
| 16 | WH/Output | internal | True |
| 17 | WH/Quality Control | internal | True |
| 5 | WH/Stock | internal | True |
| 13 | WH/Stock/Allée-A | internal | True |
| 14 | WH/Stock/Allée-B | internal | True |
| 15 | WH/Stock/Allée-C | internal | True |

**STATUS:** All required locations exist ✅

### Lots (5 total)
| ID | Name | Product | Qty |
|----|------|---------|-----|
| 1 | LOT-SKU003-A | SKU-003 Film étirable | 50 |
| 2 | LOT-SKU003-B | SKU-003 Film étirable | 30 |
| 3 | LOT-SKU003-C | SKU-003 Film étirable | 20 |
| 4 | LOT-SKU004-2024-A | SKU-004 Ruban adhésif | 0 |
| 5 | LOT-SKU004-2024-B | SKU-004 Ruban adhésif | 0 |

**GAPS:**
- SKU-004 lots have 0 stock — need stock added for M2 lot-tracking demo.

### Putaway Rules (4 rules — 1 duplicate)
| ID | Product | From | To |
|----|---------|------|-----|
| 1 | SKU-001 | WH/Input | WH/Stock/Allée-A |
| 2 | SKU-001 | WH/Input | WH/Stock/Allée-A | ← DUPLICATE |
| 3 | SKU-003 | WH/Input | WH/Stock/Allée-B |
| 4 | SKU-004 | WH/Input | WH/Stock/Allée-C |

**GAPS:**
- Duplicate rule for SKU-001 (IDs 1 and 2) — should delete one.
- No putaway rules for SKU-002, SKU-005 through SKU-010, BOX-001.

### Reorder Rules (3 rules)
| ID | Product | Min | Max | Location |
|----|---------|-----|-----|----------|
| 1 | SKU-004 | 10 | 50 | WH/Stock |
| 2 | SKU-005 | 20 | 100 | WH/Stock |
| 3 | SKU-003 | 30 | 150 | WH/Stock |

**STATUS:** Core rules exist ✅. No rules for SKU-006 through SKU-010 (not needed for M3 core demo).

### Stock Quants (5 quants, all in WH/Stock)
| Product | Location | Lot | Qty |
|---------|----------|-----|-----|
| BOX-001 | WH/Stock | - | 75 |
| SKU-001 | WH/Stock | - | 130 |
| SKU-003 | WH/Stock | LOT-SKU003-A | 50 |
| SKU-003 | WH/Stock | LOT-SKU003-B | 30 |
| SKU-003 | WH/Stock | LOT-SKU003-C | 20 |

**GAPS:**
- All stock is in WH/Stock (root), NOT in Allée-A/B/C — putaway rules were not applied retroactively.
- SKU-001 (130 units) should be in WH/Stock/Allée-A per putaway rule.
- SKU-003 lots should be in WH/Stock/Allée-B per putaway rule.
- SKU-004 has 0 stock despite having lots — needs stock for M2 lot demo.
- SKU-002, SKU-005 through SKU-010 have 0 stock — need some stock for M4 KPI data.

### Stock Pickings (10 documents)
| ID | Name | Type | State | Origin |
|----|------|------|-------|--------|
| 10 | WH/OUT/00001 | Delivery Orders | done | S00001 |
| 9 | WH/STOR/00002 | Storage | done | P00001 |
| 8 | WH/IN/00006 | Receipts | done | P00001 |
| 7 | WH/STOR/00001 | Storage | confirmed | SCN-003 |
| 6 | WH/INT/00001 | Internal Transfers | draft | SCN-003 |
| 5 | WH/IN/00005 | Receipts | assigned | SCN-002-CONTRAST |
| 4 | WH/IN/00004 | Receipts | done | SCN-002 |
| 3 | WH/IN/00003 | Receipts | done | SCN-001 |
| 2 | WH/IN/00002 | Receipts | done | SCN-001 |
| 1 | WH/IN/00001 | Receipts | draft | - |

**GAPS:**
- WH/IN/00001 (draft) and WH/INT/00001 (draft) are open/unfinished — should be cleaned up.
- WH/IN/00005 (assigned, not done) — incomplete receipt.
- WH/STOR/00001 (confirmed, not done) — incomplete storage.
- No delivery data for M4 KPI analysis (only 1 delivery: WH/OUT/00001).
- No replenishment orders visible.

### Required Actions Summary
1. Fix SKU types: change consu → storable for M1-M5 core SKUs (SKU-001 to SKU-005, BOX-001)
2. Add stock to Allée-A/B/C (move existing stock to correct bin locations)
3. Add SKU-004 stock with lots for M2 lot-tracking demo
4. Add stock for SKU-002, SKU-005 for M4 KPI data
5. Delete duplicate putaway rule (ID=2)
6. Add putaway rules for SKU-002 → Allée-A, BOX-001 → Allée-A
7. Create M4 KPI data: additional receipts, deliveries, delays
8. Archive/close open draft documents (WH/IN/00001, WH/INT/00001)
9. Archive "Frais de réservation" product
