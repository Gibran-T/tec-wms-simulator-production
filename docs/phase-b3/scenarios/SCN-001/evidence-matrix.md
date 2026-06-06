# SCN-001 — Matrice des preuves (instructeur)

| Métadonnée | Valeur |
|------------|--------|
| Module | M1 |
| Seuil évaluation | 60/100 |
| Compétence primaire | Exécution opérationnelle |
| Bloom | Comprendre |
| Pattern | A — Flux transactionnel nominal |

## Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E / Cockpit | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | PO postée | Tx PO POST SKU-001 | PO | `completedSteps` contient PO | Déclenchement flux |
| 2 | GR postée | Tx GR POST, stock REC-01 | GR | inventory REC-01 > 0 | Réception validée |
| 3 | Putaway complété | Stock en STOCKAGE | PUTAWAY_M1 | inventory STOCKAGE | Exécution opérationnelle |
| 4 | Expédition complète | SO/PICKING_M1/GI | PICKING_M1, GI | steps | Flux client |
| 5 | Conformité verte | compliant true | COMPLIANCE | compliance | Silver M1 |
| 6 | Seuil score | score ≥ 60 | — | Panel E score | Scénario M1 compté |

## Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario | score ≥ 60/100 (évaluation) |
| Quiz requis | Oui — Quiz M1 (60 %) pour Silver |
| Certification path | TEC.LOG Silver (Module 1) |
| Note compétence | Requis pour certification Silver (M1) |

## Grille débrief (cocher en séance)

- [ ] PO et GR postées observées
- [ ] PUTAWAY_M1 vers STOCKAGE
- [ ] GI validée avec stock suffisant
- [ ] COMPLIANCE verte
- [ ] Score ≥ 60/100
