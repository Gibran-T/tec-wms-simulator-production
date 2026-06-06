# SCN-002 — ERP/WMS Mapping

## Équivalents par domaine

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | Goods receipt posting / validation |
| **Module mission** | Gestion des Anomalies ERP |
| **SAP** | MIGO — Post goods receipt |
| **Odoo** | Validate receipt (stock move) |
| **Pertinence métier** | Réconciliation dock WMS vs ERP |

## Mapping étapes ↔ ERP

| Étape simulateur | tCode / fonction SAP | Panneau C hint |
|------------------|----------------------|----------------|
| PO | ME21N | MM — Achats |
| GR (action corrective) | **MIGO** | MM — Réception · stock n'augmente qu'après posting |
| PUTAWAY_M1 | LT0A | WM — Transfert REC → STOCKAGE |
| SO | VA01 | SD — Ventes |
| PICKING_M1 | VL01N | WM — Prélèvement |
| GI | VL02N | SD — Expédition |
| CC | MI01 | IM — Inventaire cyclique |
| COMPLIANCE | MB52 | Cross-module — clôture |

## Point pédagogique ERP

La **Ghost GR** illustre la désynchronisation entre document ERP créé et stock WMS actif. Le posting MIGO est le pont obligatoire.
