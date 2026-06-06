# SCN-008 — ERP/WMS Mapping

## Équivalents par domaine

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | FIFO / FEFO picking |
| **Module mission** | WM — Traçabilité lots |
| **SAP** | FIFO strategy, batch determination, LT01 par lot |
| **Odoo** | Removal strategy FIFO, lots |
| **Pertinence métier** | Conformité alimentaire/pharma et réduction obsolescence |

## Mapping étapes ↔ ERP

| Étape simulateur | tCode / fonction SAP | Panneau C hint |
|------------------|----------------------|----------------|
| GR multi-lots | MIGO par lot/batch | MM — Réception lotisée |
| PUTAWAY par lot | LT01 (1 TO par lot) | WM — Rangemenent séparé |
| FIFO_PICK lot A | VL01N + stratégie FIFO | WM — Prélèvement lot oldest |
| STOCK_ACCURACY | LX03 / MB52 par lot | WM — Cohérence lot/stock |
| COMPLIANCE_ADV | MB52 + contrôles M2 | Cross-module — clôture avancée |

## Point pédagogique ERP

La **détermination de lot SAP** (batch determination) et la stratégie FIFO imposent de sortir le lot au **date de réception la plus ancienne**. LOT-A (janvier) prime systématiquement sur LOT-B et LOT-C.

## Mission Control M2

Comparer dates de réception des lots dans le cockpit avant tout FIFO_PICK. Ne pas confondre emplacement physique et priorité FIFO.
