# SCN-011 — ERP/WMS Mapping

| Domaine | Équivalent |
|---------|------------|
| **Fonction WMS** | Replenishment planning |
| **Module** | MRP / Replenishment |
| **SAP** | MD04, reorder point |
| **Odoo** | Reordering rules, Min/Max |
| **Pertinence** | Éviter ruptures tout en limitant stock dormant |

## Pipeline M3

| Étape | tCode | ERP module |
|-------|-------|------------|
| CC_LIST | MI01 | IM — Inventaire (validation niveaux) |
| CC_COUNT | MI04 | Saisie quantités physiques |
| CC_RECON | MI07 | Réconciliation / diagnostic sous Min |
| REPLENISH | MD04 | MRP — suggestion réapprovisionnement |
| COMPLIANCE_M3 | — | Clôture M3 |

## Paramètres réapprovisionnement

| SKU | Bin | Stock | Min | Max | SS | Délai (j) | Qté suggérée |
|-----|-----|-------|-----|-----|----|-----------|--------------|
| SKU-004 | B-01-R1-L1 | 30 | 50 | 200 | 25 | 3 | 170 |
| SKU-005 | B-01-R1-L2 | 40 | 80 | 300 | 30 | 5 | 260 |

## Formules évaluées

| Concept | Formule | Application SCN-011 |
|---------|---------|---------------------|
| **ROP** | (Demande/j × Délai) + SS | Min paramétré ≈ ROP ; SS 25/30 |
| **EOQ** | √(2DS/H) | Contexte pédagogique ; qté moteur = Max − stock |
| **Besoin net** | Max − stock actuel (si stock < Min) | 170 u. / 260 u. |

## Historique transactionnel (contexte seed)

| SKU | Flux | Qté |
|-----|------|-----|
| SKU-004 | PO/GR → SO/GI | 200 reçu, 170 expédié → 30 restant |
| SKU-005 | PO/GR → SO/GI | 300 reçu, 260 expédié → 40 restant |
