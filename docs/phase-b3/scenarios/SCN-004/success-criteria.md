# SCN-004 — Critères de réussite

| # | Critère | Observable en session |
|---|---------|---------------------|
| 1 | PUTAWAY_M1 complété (200 u. SKU-006 en STOCKAGE) | Stock B-02-R1-L1 crédité |
| 2 | Expédition partielle exécutée | SO → PICKING_M1 → GI complétés |
| 3 | Écart −15 documenté au CC | Quantité physique saisie (ex. 185) ≠ système (200) |
| 4 | ADJ appliqué pour l'écart | `completedSteps` contient ADJ |
| 5 | Conformité 100 % | `compliance.compliant = true` |
| 6 | Score ≥ 60/100 (évaluation) | Mode évaluation officiel |

**Synthèse :** L'écart physique/système (−15) est identifié, documenté au cycle count et résolu via ADJ avant clôture.
