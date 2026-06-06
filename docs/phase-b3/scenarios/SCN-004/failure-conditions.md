# SCN-004 — Conditions d'échec

| # | Condition d'échec | Conséquence pédagogique |
|---|-------------------|-------------------------|
| 1 | Quantité système saisie au CC au lieu du physique | Écart non détecté / faux positif |
| 2 | ADJ manquant malgré variance −15 | UNRESOLVED_VARIANCE bloque compliance |
| 3 | Conformité clôturée avec variance ouverte | Compliance bloquée |
| 4 | Écart intentionnel ignoré ou contourné | Objectif audit non atteint |
| 5 | Putaway ou expédition sautés | Séquence hors ordre |
| 6 | Score < 60/100 en évaluation | Scénario non validé pour certification |

**Anti-patterns étudiant (ne pas faire) :**

- Saisir la **quantité système** au cycle count au lieu de la quantité **physique**
- Passer à **COMPLIANCE** sans **ADJ** malgré variance −15
- Ignorer l'écart « intentionnel » du scénario
