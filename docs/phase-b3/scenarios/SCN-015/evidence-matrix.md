# SCN-015 — Matrice des preuves (instructeur)

| Métadonnée | Valeur |
|------------|--------|
| Module | M5 |
| Seuil évaluation | 70/100 |
| Compétence primaire | Opérations intégrées |
| Bloom | Évaluer |
| Pattern | A — Flux transactionnel intégré M5 (gold path) |

## Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E / Cockpit | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | Réception validée | M5_RECEPTION complété | M5_RECEPTION | `completedSteps` | Déclenchement flux M5 |
| 2 | Putaway FIFO | Stock en STOCKAGE | M5_PUTAWAY | inventory STOCKAGE | Opérations intégrées |
| 3 | Cycle count | M5_CYCLE_COUNT sans écart ouvert | M5_CYCLE_COUNT | step + CC tx | Exactitude stock |
| 4 | Réapprovisionnement | M5_REPLENISH exécuté | M5_REPLENISH | step + tx | Min/Max M5 |
| 5 | KPI calculés | M5_KPI complété | M5_KPI | step + contenu | Évaluer |
| 6 | Décision cohérente | M5_DECISION liée aux KPI | M5_DECISION | eval | Gold path |
| 7 | Conformité M5 | COMPLIANCE_M5 | COMPLIANCE_M5 | `compliance.compliant = true` | Module M5 |
| 8 | Seuil score (évaluation) | score ≥ 70/100 | — | Panel E score | Scénario M5 compté |

## Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario | score ≥ 70/100 (évaluation) |
| Bloom | Évaluer — jugement opérationnel post-cycle |
| Certification path | TEC.LOG — Gold path (Module 5) |
| Note compétence | Opérations intégrées — fondation M5 avant variance et capstone |

## Grille débrief (cocher en séance)

- [ ] M5_RECEPTION → stock REC visible
- [ ] M5_PUTAWAY vers STOCKAGE (FIFO respecté)
- [ ] M5_CYCLE_COUNT sans écart non résolu
- [ ] M5_REPLENISH déclenché
- [ ] M5_KPI cohérent avec le flux
- [ ] M5_DECISION fondée sur KPI
- [ ] COMPLIANCE_M5 verte
- [ ] Score ≥ 70/100
