# SCN-006 — Critères de réussite

| # | Critère | Observable en session |
|---|---------|---------------------|
| 1 | GR validée (postée) avant putaway | Stock REC-01 > 0 ; étape GR complétée |
| 2 | Putaway vers bin zone STOCKAGE | Transfert LT01 ; inventaire STOCKAGE cohérent |
| 3 | Capacité bin respectée pour 150 u. | Pas d'overflow ; alerte capacité gérée |
| 4 | Étapes M2 complétées | GR → PUTAWAY → FIFO_PICK (si requis) → STOCK_ACCURACY → COMPLIANCE_ADV |
| 5 | Score évaluation ≥ 60/100 | Mode évaluation officiel |
| 6 | Conformité avancée au vert | `compliance.compliant = true` |

**Synthèse :** Rangement structuré exécuté dans le bon ordre, vers la bonne zone, sans violation de capacité sur bin unique.
