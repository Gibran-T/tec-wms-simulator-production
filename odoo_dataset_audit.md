# Odoo EDU LAB — Dataset Audit (2026-05-17)

## Products (SKUs)
All 10 SKUs exist (SKU-001 to SKU-010). All are type=`consu` (consumable).

**ISSUE**: Products should be type=`product` (storable) for proper stock tracking.
- SKU-003 (Film étirable): tracking=`lot` ✅
- SKU-004 (Ruban adhésif): tracking=`lot` ✅
- SKU-001, SKU-002, SKU-005 to SKU-010: tracking=`none`

## Warehouse Locations
- WH/Input ✅
- WH/Stock ✅
- WH/Stock/Allée-A ✅
- WH/Stock/Allée-B ✅
- WH/Stock/Allée-C ✅
- **MISSING**: WH/Output, WH/Picking, WH/Quality

## Stock Quants (Current Stock)
- SKU-001 @ WH/Stock: 130 units ✅
- BOX-001 @ WH/Stock: 75 units ✅
- SKU-003 @ WH/Stock: 50 (LOT-SKU003-A) + 30 (LOT-SKU003-B) + 20 (LOT-SKU003-C) = 100 units ✅

## Lots
- LOT-SKU003-A: 50 units ✅
- LOT-SKU003-B: 30 units ✅
- LOT-SKU003-C: 20 units ✅
- **MISSING**: Lots for SKU-004 (lot-tracked but no lots)

## Reordering Rules (Min/Max)
- SKU-004: min=10, max=50 ✅
- SKU-005: min=20, max=100 ✅

## Putaway Rules
- 1 rule exists (details not shown)
- Need to verify it routes WH/Input → WH/Stock/Allée-A for SKU-001

## Summary of Issues
1. All products are `consu` type — should be `product` (storable) for M2-M4 stock tracking demos
2. Missing WH/Output location for GI (Goods Issue) demos
3. Missing lots for SKU-004 (lot-tracked product)
4. Only 1 putaway rule — need rules for M2 demo (SKU-001 → Allée-A, SKU-003 → Allée-B)
