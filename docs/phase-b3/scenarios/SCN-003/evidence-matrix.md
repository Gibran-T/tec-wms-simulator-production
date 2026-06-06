# SCN-003 — Matrice des preuves (instructeur)

| Métadonnée | Valeur |
|------------|--------|
| Module | M1 |
| Seuil évaluation | 60/100 |
| Compétence primaire | Prise de décision |
| Bloom | Appliquer |
| Pattern | A + C (transactions + décision réappro) |

## Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E / Cockpit | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | Putaway initial SKU-003 | Stock STOCKAGE = 50 u. | PUTAWAY_M1 | inventory STOCKAGE | Exécution opérationnelle |
| 2 | Déficit détecté avant GI | SO > stock ; pas de GI prématurée | SO | alerte stock insuffisant | Prise de décision |
| 3 | PO corrective + GR postées | Tx PO/GR POST SKU-003 (+30 u.) | PO, GR | `completedSteps` contient GR | Réapprovisionnement |
| 4 | Putaway réappro complété | Stock STOCKAGE ≥ qty SO | PUTAWAY_M1 | inventory ≥ 80 | Séquence Décision→Physique |
| 5 | Flux expédition complété | PICKING_M1 / GI validés | PICKING_M1, GI | steps | Flux client |
| 6 | Conformité 100 % | compliant true | CC, COMPLIANCE | `compliance.compliant = true` | Progression Silver M1 |
| 7 | Seuil score | score ≥ 60 | — | Panel E score | Scénario M1 compté |

## Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario | score ≥ 60/100 (évaluation) |
| Quiz requis | Oui — Quiz M1 (60 %) pour Silver |
| Certification path | TEC.LOG Silver (Module 1) |
| Note compétence | Prise de décision (Appliquer) — rupture stock M1 |

## Grille débrief (cocher en séance)

- [ ] PUTAWAY_M1 initial REC-01 → STOCKAGE observé
- [ ] Déficit identifié avant tentative GI
- [ ] PO corrective + GR postées (+30 u.)
- [ ] Putaway réappro avant PICKING_M1 / GI
- [ ] COMPLIANCE verte
- [ ] Score ≥ 60/100
