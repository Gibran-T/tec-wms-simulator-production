# SCN-014 — ERP/WMS Mapping

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | Integrated performance diagnosis |
| **Module** | Strategic Logistics Control Tower |
| **SAP** | Embedded analytics, SAC |
| **Odoo** | Spreadsheet / BI dashboards |
| **Pertinence** | S&OP et revue performance mensuelle |

## Pipeline étapes ↔ ERP

| Étape | tCode / outil | Focus |
|-------|---------------|-------|
| KPI_DATA | MC$4, VL06O | Collecte multi-KPI |
| KPI_ROTATION | MC$4 | Rotation stocks / working capital |
| KPI_SERVICE | VL06O | Taux de service & erreurs ops |
| KPI_DIAGNOSTIC | SAC | Synthèse stratégique & trade-offs |
| COMPLIANCE_M4 | — | Clôture capstone M4 |

## Indicateurs de référence (instructeur)

| Indicateur | Référence | Alerte |
|------------|-----------|--------|
| Rotation | 4–12×/an | < 4 surstock · > 12 rupture |
| Service | ≥ 95 % | < 85 % SLA |
| Erreurs | ≤ 1 % | > 5 % risque OTIF |
| Lead time | Cible scénario | Écart vs promesse client |

## SAC / embedded analytics

La décision capstone alimente la **revue direction** — lien finance, ops et service client.
