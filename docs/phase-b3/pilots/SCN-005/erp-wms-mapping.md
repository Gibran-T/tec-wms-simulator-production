# SCN-005 — ERP/WMS Mapping

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | Multi-exception resolution |
| **Module** | Gestion de Crise / Multi-Module |
| **SAP** | MIGO + LT0A + MI01 + MI07 |
| **Odoo** | Full exception workflow |
| **Pertinence** | Gestion crise entrepôt multi-anomalies |

## Séquence ERP

| Phase | Étapes | tCodes |
|-------|--------|--------|
| Documents | Post GR-004 | MIGO |
| Physique | Putaway dual-SKU | LT0A |
| Expédition | SO → Pick → GI | VA01, VL01N, VL02N |
| Inventaire | CC + ADJ SKU-005 | MI01, MI07 |
| Clôture | Compliance | MB52 |
