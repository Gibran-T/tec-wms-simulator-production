# SCN-011 — Matrice des preuves (instructeur)

| Métadonnée | Valeur |
|------------|--------|
| Module | M3 |
| Seuil évaluation | 70/100 |
| Compétence primaire | Planification réappro |
| Bloom | Évaluer |
| Pattern | C — Réappro Min/Max + ROP/EOQ |

## Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E / Cockpit | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | Liste comptage générée | SKU-004 et SKU-005 listés | CC_LIST | step CC_LIST | Pipeline M3 initié |
| 2 | Niveaux confirmés | SKU-004 = 30 ; SKU-005 = 40 | CC_COUNT | cycle count data | Précision inventaire |
| 3 | Sous Min identifié | 30 < 50 ; 40 < 80 | CC_RECON | eval texte | Diagnostic niveaux |
| 4 | ROP évalué | Référence Min/SS/délai dans justification | REPLENISH | ROP_CHECK event | Planification réappro |
| 5 | EOQ évalué | Compréhension quantité économique (Max − stock) | REPLENISH | EOQ_CALC event | Planification réappro |
| 6 | Réappro SKU-004 | Quantité étudiant ≈ 170 u. | REPLENISH | `suggestedQty` diff ≤ 10 | Quantité cohérente |
| 7 | Réappro SKU-005 | Quantité étudiant ≈ 260 u. | REPLENISH | `suggestedQty` diff ≤ 10 | Quantité cohérente |
| 8 | Conformité verte | compliant true | COMPLIANCE_M3 | `compliance.compliant = true` | Module M3 validation |
| 9 | Seuil score (évaluation) | score ≥ 70/100 | — | Panel E score | Scénario M3 compté |

## Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario | score ≥ 70/100 (évaluation) |
| Quiz requis | Oui — Quiz M3 (ROP, EOQ, Min/Max) |
| Certification path | TEC.LOG — Module 3 avancé |
| Note compétence | Planification réappro M3 — calculs ROP/EOQ évalués |
| Événements scoring | ROP_CHECK_COMPLETED (+10), EOQ_CALC_COMPLETED (+10), REPLENISH_COMPLETED (précision qty) |

## Grille débrief (cocher en séance)

- [ ] CC_LIST → CC_COUNT → CC_RECON → REPLENISH → COMPLIANCE_M3 (ordre respecté)
- [ ] SKU-004 sous Min (30 < 50) explicité
- [ ] SKU-005 sous Min (40 < 80) explicité
- [ ] Quantité SKU-004 = 170 u. (200 − 30)
- [ ] Quantité SKU-005 = 260 u. (300 − 40)
- [ ] ROP et EOQ mentionnés dans la justification étudiant
- [ ] COMPLIANCE_M3 verte
- [ ] Score ≥ 70/100
