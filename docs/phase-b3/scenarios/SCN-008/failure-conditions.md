# SCN-008 — Conditions d'échec

| # | Condition d'échec | Conséquence pédagogique |
|---|-------------------|-------------------------|
| 1 | Prélèvement LOT-C ou LOT-B avant LOT-A | Violation FIFO client ; pénalité |
| 2 | Mélange de deux lots dans un même mouvement | Perte de traçabilité |
| 3 | Putaway sans séparation par lot | Stock indifférencié — audit impossible |
| 4 | Ignorer dates de réception affichées | Mauvais lot sélectionné |
| 5 | STOCK_ACCURACY ou COMPLIANCE_ADV incomplets | Scénario non clôturé |
| 6 | Score < 60/100 en évaluation | Scénario non validé pour certification |

**Anti-patterns étudiant (ne pas faire) :**

1. Prélever un lot récent (LOT-C) avant le lot le plus ancien (LOT-A) — violation FIFO client.
2. Mélanger deux lots dans un même mouvement sans séparation — perte de traçabilité.
3. Ignorer les dates de réception affichées et choisir un bin au hasard.

**Pattern correct (à faire) :**

- Analyser les dates de réception → identifier LOT-A (jan) → **FIFO_PICK sur LOT-A en premier**.
