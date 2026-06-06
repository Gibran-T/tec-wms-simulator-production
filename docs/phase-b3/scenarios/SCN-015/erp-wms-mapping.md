# SCN-015 — ERP/WMS Mapping

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | End-to-end warehouse orchestration |
| **Module** | Integrated WM + IM + KPI |
| **SAP** | EWM integrated scenario |
| **Odoo** | Full warehouse workflow |
| **Pertinence** | Pilotage entrepôt omnicanal |

## Pipeline étapes ↔ ERP

| Étape | tCode / fonction | Focus |
|-------|------------------|-------|
| M5_RECEPTION | MIGO / inbound | Réception fournisseur |
| M5_PUTAWAY | LT0A / putaway | Rangement FIFO |
| M5_CYCLE_COUNT | MI01 / MI07 | Inventaire cyclique |
| M5_REPLENISH | Min/Max trigger | Réapprovisionnement |
| M5_KPI | MC$4 / analytics | KPI post-cycle |
| M5_DECISION | IBP lite | Décision opérationnelle |
| COMPLIANCE_M5 | — | Clôture M5 |

## Gold path M5

SCN-015 établit le **parcours nominal** M5 — prérequis pédagogique pour SCN-016 (exceptions) et SCN-017 (capstone exécutif).
