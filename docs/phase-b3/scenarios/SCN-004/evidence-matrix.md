# SCN-004 — Matrice des preuves (instructeur)

| Métadonnée | Valeur |
|------------|--------|
| Module | M1 |
| Seuil évaluation | 60/100 |
| Compétence primaire | Analyse des écarts |
| Bloom | Analyser |
| Pattern | B (variance inventaire) |

## Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E / Cockpit | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | Putaway SKU-006 complété | Stock B-02-R1-L1 = 200 u. | PUTAWAY_M1 | inventory STOCKAGE | Exécution opérationnelle |
| 2 | Expédition partielle | SO / PICKING_M1 / GI complétés | PICKING_M1, GI | steps | Flux client |
| 3 | Écart −15 identifié | CC saisie physique ≠ système | CC | cycle count data | Analyse des écarts |
| 4 | Quantité physique saisie | physicalQty = 185 (ex.) | CC | physical ≠ system qty | Variance analysis |
| 5 | ADJ SKU-006 −15 | ADJ step / MI07 | ADJ | `completedSteps` contient ADJ | Écart résolu |
| 6 | Conformité 100 % | compliant true | COMPLIANCE | `compliance.compliant = true` | Progression Silver M1 |
| 7 | Seuil score | score ≥ 60 | — | Panel E score | Scénario M1 compté |

## Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario | score ≥ 60/100 (évaluation) |
| Quiz requis | Oui — Quiz M1 (60 %) pour Silver |
| Certification path | TEC.LOG Silver (Module 1) |
| Note compétence | Analyse des écarts (Analyser) — réconciliation inventaire M1 |

## Grille débrief (cocher en séance)

- [ ] PUTAWAY_M1 200 u. SKU-006 observé
- [ ] Expédition partielle (SO → PICKING_M1 → GI) complétée
- [ ] CC avec quantité physique (185) — pas quantité système
- [ ] ADJ −15 effectué
- [ ] Conformité finale verte
- [ ] Score ≥ 60/100
