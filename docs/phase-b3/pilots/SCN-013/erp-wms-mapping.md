# SCN-013 — ERP/WMS Mapping

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | Service level monitoring |
| **Module** | Logistics Performance Management |
| **SAP** | OTIF, VL06O performance |
| **Odoo** | Delivery performance, SLA dashboards |
| **Pertinence** | OTIF contractuel grands comptes |

## Pipeline étapes ↔ ERP

| Étape | tCode | Focus |
|-------|-------|-------|
| KPI_DATA | MC$4 | Collecte |
| KPI_ROTATION | MC$4 | Contexte stock |
| KPI_SERVICE | **VL06O** | Taux de service / livraisons |
| KPI_DIAGNOSTIC | SAC | Synthèse causes |
| COMPLIANCE_M4 | — | Clôture |

## Indicateurs de référence (instructeur)

| Indicateur | Excellent | Alerte |
|------------|-----------|--------|
| Taux de service | ≥ 95 % | < 85 % |
| Taux d'erreur | ≤ 1 % | > 5 % |
