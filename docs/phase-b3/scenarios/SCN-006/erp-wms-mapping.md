# SCN-006 — ERP/WMS Mapping

## Équivalents par domaine

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | Putaway / slotting |
| **Module mission** | WM — Exécution d'entrepôt |
| **SAP** | LT01, LT12, WM-TO (transfer order) |
| **Odoo** | Internal Transfers, Putaway rules |
| **Pertinence métier** | Slotting et traçabilité emplacement en entrepôt automatisé |

## Mapping étapes ↔ ERP

| Étape simulateur | tCode / fonction SAP | Panneau C hint |
|------------------|----------------------|----------------|
| GR (validation) | MIGO — vérifier posting | MM — Réception · stock quai actif |
| PUTAWAY | **LT01** / LT12 | WM — Transfert REC → STOCKAGE |
| FIFO_PICK | VL01N (stratégie FIFO) | WM — Prélèvement ordonné |
| STOCK_ACCURACY | LX03 / inventaire WM | WM — Précision stock |
| COMPLIANCE_ADV | MB52 + contrôles M2 | Cross-module — clôture avancée |

## Point pédagogique ERP

Le **rangement structuré LT01** impose zone STOCKAGE et capacité bin avant validation du transfer order. Le posting GR (MIGO) précède toujours le mouvement physique WM.

## Mission Control M2

Ouvrir **Mission Control** pour consulter les règles putaway, capacités bin et indices zone avant validation LT01.
