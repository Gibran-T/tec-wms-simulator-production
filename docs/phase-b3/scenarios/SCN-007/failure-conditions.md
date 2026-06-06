# SCN-007 — Conditions d'échec

| # | Condition d'échec | Conséquence pédagogique |
|---|-------------------|-------------------------|
| 1 | Forcer 600 u. dans B-01-R1-L1 malgré alerte | Overflow ; blocage système |
| 2 | Ignorer message dépassement et valider putaway | Erreur opérationnelle ; pénalité évaluation |
| 3 | Ranger en zone non-STOCKAGE | Pénalité zone ; non-conformité LT01 |
| 4 | Perte de traçabilité lot/SKU après split | Stock incomplet ou incohérent |
| 5 | Unités non rangées (< 600 u. en stock) | Mission incomplète |
| 6 | Score < 60/100 en évaluation | Scénario non validé pour certification |

**Anti-patterns étudiant (ne pas faire) :**

1. Forcer les 600 unités dans un seul bin malgré l'alerte capacité — le système bloque et la traçabilité est compromise.
2. Ignorer le message de dépassement et valider le putaway — erreur opérationnelle et pénalité en évaluation.
3. Ranger en zone non-STOCKAGE sans vérifier les règles d'emplacement.

**Pattern correct (à faire) :**

- **Split putaway** sur plusieurs bins STOCKAGE valides (ex. 500 + 100 u.) — c'est la solution attendue de ce scénario.
