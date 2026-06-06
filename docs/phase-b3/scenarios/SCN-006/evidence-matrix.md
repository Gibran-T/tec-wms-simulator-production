# SCN-006 — Matrice des preuves (instructeur)

| Métadonnée | Valeur |
|------------|--------|
| Module | M2 |
| Seuil évaluation | 60/100 |
| Compétence primaire | Rangement structuré |
| Bloom | Appliquer |
| Pattern | A — Flux transactionnel M2 |

## Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E / Cockpit | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | GR validée avant putaway | Stock SKU-001 visible REC-01 ; GR en statut POST | GR | `completedSteps` contient GR | Séquence documentaire respectée |
| 2 | Putaway vers STOCKAGE | Transfert REC-01 → bin zone STOCKAGE complété | PUTAWAY | inventory STOCKAGE > 0 ; bin hors REC | Rangement structuré démontré |
| 3 | Capacité bin respectée | Aucun overflow sur bin unique ; alerte capacité traitée | PUTAWAY | Pas d'erreur OUT_OF_SEQUENCE capacité | Contribution score M2 ≥ 60 |
| 4 | FIFO si requis | Lot/ordre FIFO respecté si étape activée | FIFO_PICK | `completedSteps` contient FIFO_PICK ou N/A | Traçabilité conforme |
| 5 | Précision stock | Écart stock nul ou réconcilié | STOCK_ACCURACY | Étape validée | Fiabilité inventaire |
| 6 | Conformité M2 | Aucun bloqueur compliance avancée | COMPLIANCE_ADV | `compliance.compliant = true` | Scénario comptabilisé M2 |
| 7 | Seuil score | score ≥ 60 en évaluation | — | Panel E score | Progression certification M2 |

## Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario | score ≥ 60/100 (évaluation) |
| Quiz requis | Selon parcours TEC.LOG Module M2 |
| Certification path | TEC.LOG — progression entrepôt intermédiaire (M2) |
| Note compétence | Scénario M2 — seuil 60/100 en évaluation |

## Grille débrief (cocher en séance)

- [ ] Preuve 1 — GR postée observée avant putaway
- [ ] Preuve 2 — Bin destination en zone STOCKAGE
- [ ] Preuve 3 — Alerte capacité traitée (pas d'overflow 150 u.)
- [ ] Preuve 4 — STOCK_ACCURACY et COMPLIANCE_ADV verts
- [ ] Étudiant n'a pas tenté split multi-bins (réservé SCN-007)
