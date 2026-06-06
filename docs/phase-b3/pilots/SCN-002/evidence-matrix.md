# SCN-002 — Matrice des preuves (instructeur)

| Métadonnée | Valeur |
|------------|--------|
| Module | M1 |
| Seuil évaluation | 60/100 |
| Compétence primaire | Identification de problème |
| Bloom | Comprendre |
| Pattern | A — Flux transactionnel |

## Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E / Cockpit | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | GR-2025-001 postée | Transaction GR docRef GR-2025-001 en statut POST | GR | `completedSteps` contient GR | Identification de problème démontrée |
| 2 | Stock visible REC-01 | `inventory` SKU-001::REC-01 > 0 après post | GR → PUTAWAY | Panel B inventaire | Contribution score M1 ≥ 60 |
| 3 | Conformité rétablie | 0 transaction non postée ; pas de bloqueur | COMPLIANCE | `compliance.compliant = true` | Progression Silver M1 |
| 4 | Flux poursuivi | Étapes amont PO complétée ; suite flux initiée | PO, PUTAWAY… | `progressPct` > 0 post-GR | Scénario comptabilisé |

## Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario | score ≥ 60/100 (évaluation) |
| Quiz requis | Oui — Quiz M1 (60 %) pour Silver |
| Certification path | TEC.LOG Silver (Module 1) |
| Note compétence | Requis pour certification Silver (M1) |

## Grille débrief (cocher en séance)

- [ ] Preuve 1 — GR postée observée
- [ ] Preuve 2 — Stock REC-01 visible
- [ ] Preuve 3 — Conformité verte
- [ ] Étudiant a évité création nouvelle GR
