# SCN-006 — Conditions d'échec

| # | Condition d'échec | Conséquence pédagogique |
|---|-------------------|-------------------------|
| 1 | Putaway avant GR postée | Séquence invalide — OUT_OF_SEQUENCE |
| 2 | Bin hors zone STOCKAGE | Pénalité zone ; rangement non conforme LT01 |
| 3 | Ignorer alerte capacité (150 u. sur bin insuffisant) | Overflow ; blocage putaway |
| 4 | Split multi-bins tenté comme solution principale | Confusion pédagogique avec SCN-007 |
| 5 | Étapes M2 incomplètes (STOCK_ACCURACY / COMPLIANCE_ADV) | Scénario non clôturé |
| 6 | Score < 60/100 en évaluation | Scénario non validé pour certification |

**Anti-patterns étudiant (G-C06 — ne pas faire) :**

1. Ranger sans vérifier que la GR est postée — séquence invalide.
2. Choisir un bin hors zone STOCKAGE — pénalité zone.
3. Ignorer l'alerte capacité sur un bin unique alors que 150 u. dépassent la capacité affichée.

*Note : la répartition multi-bins est la compétence de SCN-007, pas de SCN-006.*
