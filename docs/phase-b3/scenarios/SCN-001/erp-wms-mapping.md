# SCN-001 — ERP/WMS Mapping

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | End-to-end logistics execution |
| **Module** | WMS / ERP Core |
| **SAP** | ME21N → MIGO → LT0A → VA01 → VL01N → VL02N → MI01 |
| **Odoo** | Purchase → Receipt → Internal Transfer → Delivery |
| **Pertinence** | Flux standard distribution B2B/B2C |

## Mapping étapes ↔ ERP

| Étape simulateur | tCode / fonction SAP | Panneau C hint |
|------------------|----------------------|----------------|
| PO | ME21N | MM — Achats |
| GR | MIGO | MM — Réception |
| PUTAWAY_M1 | LT0A | WM — Transfert REC → STOCKAGE |
| SO | VA01 | SD — Ventes |
| PICKING_M1 | VL01N | WM — Prélèvement |
| GI | VL02N | SD — Expédition |
| CC | MI01 | IM — Inventaire cyclique |
| COMPLIANCE | MB52 | Cross-module — clôture |

## Point pédagogique ERP

Le flux nominal illustre la **chaîne documentaire complète** : chaque posting valide une étape avant la suivante.
