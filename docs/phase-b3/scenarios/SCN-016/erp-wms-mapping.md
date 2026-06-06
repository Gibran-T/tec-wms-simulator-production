# SCN-016 — ERP/WMS Mapping

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | Exception management |
| **Module** | Corrective warehouse control |
| **SAP** | MI07 in integrated flow |
| **Odoo** | Inventory adjustment wizard |
| **Pertinence** | Gestion exceptions temps réel en ops |

## Pipeline étapes ↔ ERP

| Étape | tCode / fonction | Focus |
|-------|------------------|-------|
| M5_RECEPTION | MIGO | Réception |
| M5_PUTAWAY | LT0A | Rangement FIFO |
| M5_CYCLE_COUNT | MI01 | Inventaire — **variance injectée** |
| **ADJ** | **MI07** | Ajustement inventaire obligatoire |
| M5_REPLENISH | Min/Max | Réappro post-correction |
| M5_KPI | Analytics | KPI sur stock réconcilié |
| M5_DECISION | IBP lite | Décision post-correction |
| COMPLIANCE_M5 | — | Clôture M5 |

## Branche exception M5

```
M5_CYCLE_COUNT (variance) → ADJ → reprise flux → M5_REPLENISH → M5_KPI → M5_DECISION
```

Priorité pédagogique : **résoudre physique avant décision** — aligné politique entrepôt « tout écart ≠ 0 ».
