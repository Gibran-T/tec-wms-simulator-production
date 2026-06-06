# SCN-017 — ERP/WMS Mapping

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | Strategic warehouse decision support |
| **Module** | Strategic decision layer |
| **SAP** | IBP / analytics tie-in |
| **Odoo** | Executive dashboard decision |
| **Pertinence** | Comité logistique direction |

## Pipeline étapes ↔ ERP

| Étape | tCode / outil | Focus |
|-------|---------------|-------|
| M5_RECEPTION … M5_REPLENISH | EWM flow | Cycle ops amont |
| M5_KPI | MC$4, IBP lite | KPI agrégés post-cycle |
| M5_DECISION | IBP / SAC | Décision stratégique exécutive |
| COMPLIANCE_M5 | — | Clôture capstone Gold |

## SCN-014 vs SCN-017 (capstones)

| SCN | Module | Couche | Outil principal |
|-----|--------|--------|-----------------|
| 014 | M4 | Multi-KPI tactique / S&OP | Tour de contrôle KPI |
| 017 | M5 | Décision exécutive post-ops | Dashboard direction + cycle M5 |

## IBP / executive dashboard

La décision capstone M5 alimente le **comité direction** — investissement, politique stock, capacité entrepôt.
