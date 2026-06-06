# SCN-003 — ERP/WMS Mapping

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | ATP / backorder management |
| **Module** | Planification des Besoins |
| **SAP** | LT0A + ME21N corrective + MIGO + VA01 + VL01N + VL02N + MI01 |
| **Odoo** | Reorder rule / emergency PO + delivery |
| **Pertinence** | Gestion ruptures e-commerce / B2C |

## Mapping étapes ↔ ERP

| Étape simulateur | tCode / fonction SAP | Panneau C hint |
|------------------|----------------------|----------------|
| PUTAWAY_M1 (initial) | LT0A | WM — Transfert REC-01 → STOCKAGE |
| SO | VA01 | SD — Ventes (qty > stock) |
| PO corrective | ME21N | MM — Achats urgence |
| GR réappro | MIGO | MM — Réception corrective |
| PUTAWAY_M1 (réappro) | LT0A | WM — Rangement stock additionnel |
| PICKING_M1 | VL01N | WM — Prélèvement |
| GI | VL02N | SD — Expédition |
| CC | MI01 | IM — Inventaire cyclique |
| COMPLIANCE | MB52 | Cross-module — clôture |

## Séquence ERP

| Phase | Étapes | tCodes |
|-------|--------|--------|
| Physique | Putaway initial 50 u. | LT0A |
| Décision | SO → constat déficit → PO + GR corrective | VA01, ME21N, MIGO |
| Physique | Putaway réappro | LT0A |
| Expédition | PICKING_M1 → GI | VL01N, VL02N |
| Clôture | CC → Compliance | MI01, MB52 |

## Point pédagogique ERP

La **disponibilité ATP** (Available-to-Promise) impose de vérifier le stock en STOCKAGE avant GI ; le réapprovisionnement documentaire (PO/GR) précède toute expédition au-delà du stock physique.
