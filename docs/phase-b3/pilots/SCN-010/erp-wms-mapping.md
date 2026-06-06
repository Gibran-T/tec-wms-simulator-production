# SCN-010 — ERP/WMS Mapping

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | Variance analysis & adjustment |
| **Module** | IM — Variance management |
| **SAP** | MI07, difference analysis |
| **Odoo** | Inventory valuation adjustment |
| **Pertinence** | Réconciliation mensuelle comptabilité/stocks |

## Pipeline M3

| Étape | tCode | ERP module |
|-------|-------|------------|
| CC_LIST | MI01 | IM — Inventaire |
| CC_COUNT | MI04 | Saisie quantités |
| CC_RECON | MI07 | Réconciliation / justification |
| REPLENISH | MD04 | MRP (si applicable) |
| COMPLIANCE_M3 | — | Clôture M3 |

## Seuil métier

**20 unités** — au-delà : justification obligatoire (contexte mission, display only).
