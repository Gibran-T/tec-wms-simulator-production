# SCN-007 — ERP/WMS Mapping

## Équivalents par domaine

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | Bin capacity control |
| **Module mission** | WM — Gestion des emplacements |
| **SAP** | LS01, LT01, contrôles capacité WM |
| **Odoo** | Storage capacity, location constraints |
| **Pertinence métier** | Éviter saturation slots en e-commerce haute rotation |

## Mapping étapes ↔ ERP

| Étape simulateur | tCode / fonction SAP | Panneau C hint |
|------------------|----------------------|----------------|
| Identification capacité | **LS01** / master data bin | WM — Capacité emplacement |
| PUTAWAY (split) | **LT01** × N transferts | WM — Répartition multi-TO |
| FIFO_PICK | VL01N | WM — Prélèvement ordonné |
| STOCK_ACCURACY | LX03 | WM — Précision stock |
| COMPLIANCE_ADV | MB52 + contrôles M2 | Cross-module — clôture avancée |

## Point pédagogique ERP

Le **contrôle de capacité WM** (LS01) précède la création des transfer orders. Quand la quantité dépasse `max capacity`, la solution ERP/WMS standard est la **répartition multi-emplacements**, pas le forçage sur un slot saturé.

## Mission Control M2

Consulter capacités bin, bins alternatifs STOCKAGE et messages overflow avant de valider chaque mouvement LT01.
