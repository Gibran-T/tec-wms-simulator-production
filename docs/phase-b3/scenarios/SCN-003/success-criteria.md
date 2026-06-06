# SCN-003 — Critères de réussite

| # | Critère | Observable en session |
|---|---------|---------------------|
| 1 | PUTAWAY_M1 initial complété (50 u. SKU-003 en STOCKAGE) | Stock REC-01 vidé, STOCKAGE crédité |
| 2 | Déficit identifié avant expédition | SO > stock disponible ; pas de GI prématurée |
| 3 | Réapprovisionnement effectué | PO corrective + GR postées ; stock total ≥ qty SO |
| 4 | Expédition complète après réappro | PICKING_M1 → GI validés |
| 5 | Conformité 100 % | `compliance.compliant = true` |
| 6 | Score ≥ 60/100 (évaluation) | Mode évaluation officiel |

**Synthèse :** La rupture de stock est résolue par réapprovisionnement **avant** expédition ; aucun stock négatif ni GI forcée.
