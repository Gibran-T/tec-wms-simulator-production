# SCN-009 — Conditions d'échec

| # | Condition |
|---|-----------|
| 1 | Ignorer l'écart −3 sur SKU-001 au comptage |
| 2 | Saisir la quantité système (100) au lieu du physique (97) |
| 3 | Omettre CC_RECON — réconciliation non documentée |
| 4 | CC_RECON sans ajustement −3 posté — stock système non aligné |
| 5 | Ajuster sans réconciliation préalable (CC_RECON) |
| 6 | COMPLIANCE_M3 avec écart non documenté ou non résolu |
| 7 | Score < 70/100 |

**Anti-patterns (Panel D doc) :**

- Ignorer l'écart −3 sur SKU-001 au comptage
- Documenter l'écart sans poster l'ajustement −3 (stock système reste à 100)
- Clôturer COMPLIANCE_M3 avec variance non résolue

**Note :** l'absence de justification écrite longue **n'est pas** une condition d'échec pour |écart| < 5 u. (politique G-C05 adoptée).
