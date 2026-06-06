# SCN-015 — Conditions d'échec

| # | Condition |
|---|-----------|
| 1 | Saut d'étape M5 (ex. M5_DECISION avant M5_KPI) |
| 2 | M5_REPLENISH ou M5_CYCLE_COUNT ignorés |
| 3 | Décision KPI incohérente avec le flux exécuté |
| 4 | COMPLIANCE_M5 avec bloqueur actif |
| 5 | Stock incohérent entre étapes (REC / STOCKAGE / EXP) |
| 6 | Score < 70/100 |

**Anti-patterns :**

- Aller directement au KPI sans compléter les étapes opérationnelles amont
- Clôturer COMPLIANCE_M5 avec transactions non postées
- Décision générique sans lien aux KPI M5
