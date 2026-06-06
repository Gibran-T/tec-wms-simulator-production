# SCN-012 — ERP/WMS Mapping

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | KPI analytics |
| **Module** | CO-PA / Logistics controlling |
| **SAP** | MC$4, Inventory turnover reports |
| **Odoo** | Inventory reports, stock valuation |
| **Pertinence** | Optimisation working capital |

## Pipeline étapes ↔ ERP

| Étape | tCode | Module |
|-------|-------|--------|
| KPI_DATA | MC$4 | CO — Contrôle |
| KPI_ROTATION | MC$4 | Rotation stocks |
| KPI_SERVICE | VL06O | SD — Service / OTIF |
| KPI_DIAGNOSTIC | SAC | Analytics |
| COMPLIANCE_M4 | — | Clôture M4 |

## CO-PA / MC$4

La rotation alimente les décisions de **carrying cost** et de politique stock — lien finance/logistique.
