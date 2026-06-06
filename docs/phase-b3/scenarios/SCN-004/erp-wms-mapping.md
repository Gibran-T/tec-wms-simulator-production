# SCN-004 — ERP/WMS Mapping

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | Cycle count & adjustment |
| **Module** | Contrôle d'Intégrité |
| **SAP** | LT0A + VA01 + VL01N + VL02N + MI01 + MI07 |
| **Odoo** | Inventory adjustment workflow |
| **Pertinence** | Audit inventaire et cut-off comptable |

## Mapping étapes ↔ ERP

| Étape simulateur | tCode / fonction SAP | Panneau C hint |
|------------------|----------------------|----------------|
| PUTAWAY_M1 | LT0A | WM — Transfert REC-01 → B-02-R1-L1 |
| SO | VA01 | SD — Ventes |
| PICKING_M1 | VL01N | WM — Prélèvement |
| GI | VL02N | SD — Expédition partielle |
| CC | MI01 | IM — Inventaire cyclique (saisie physique) |
| ADJ | MI07 | IM — Ajustement inventaire (−15) |
| COMPLIANCE | MB52 | Cross-module — clôture |

## Séquence ERP

| Phase | Étapes | tCodes |
|-------|--------|--------|
| Physique | Putaway 200 u. | LT0A |
| Expédition | SO → Pick → GI (partielle) | VA01, VL01N, VL02N |
| Inventaire | CC quantité physique | MI01 |
| Ajustement | ADJ écart −15 | MI07 |
| Clôture | Compliance | MB52 |

## Point pédagogique ERP

Au **MI01**, le champ `physicalQty` représente le comptage terrain — distinct de la quantité livre (MB52). L'**MI07** réconcilie l'écart avant clôture comptable.
