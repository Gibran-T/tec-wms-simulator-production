# SCN-007 — Critères de réussite

| # | Critère | Observable en session |
|---|---------|---------------------|
| 1 | Capacité max identifiée (500 u. sur B-01-R1-L1) | Alerte ou consultation Mission Control |
| 2 | Aucun bin au-delà de sa capacité | Pas d'overflow ; pas d'erreur capacité |
| 3 | Split putaway sur bins valides STOCKAGE | ≥ 2 mouvements LT01 ou équivalent |
| 4 | Toutes les 600 u. rangées | Inventaire total SKU-002 = 600 |
| 5 | Traçabilité lot/SKU conservée | Pas de perte de lot entre bins |
| 6 | Étapes M2 complétées | PUTAWAY → FIFO_PICK → STOCK_ACCURACY → COMPLIANCE_ADV |
| 7 | Score évaluation ≥ 60/100 | Mode évaluation officiel |

**Synthèse :** Dépassement de capacité résolu par répartition conforme — le split multi-bins est ici la **bonne** décision.
