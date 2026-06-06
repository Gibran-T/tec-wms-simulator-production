# SCN-007 — Matrice des preuves (instructeur)

| Métadonnée | Valeur |
|------------|--------|
| Module | M2 |
| Seuil évaluation | 60/100 |
| Compétence primaire | Gestion de capacité |
| Bloom | Appliquer |
| Pattern | A — Flux transactionnel M2 + contrôle capacité |

## Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E / Cockpit | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | Overflow identifié | Alerte capacité 600 > 500 sur B-01-R1-L1 reconnue | Analyse capacité | Message cockpit / Mission Control | Gestion de capacité initiée |
| 2 | Split putaway exécuté | ≥ 2 bins utilisés ; aucun bin > 500 u. | PUTAWAY | Mouvements LT01 multiples | Répartition conforme |
| 3 | Toutes unités rangées | Total 600 u. SKU-002 en STOCKAGE | PUTAWAY | Σ inventaire = 600 | Stock complet |
| 4 | Traçabilité maintenue | SKU/lot cohérent sur chaque bin | PUTAWAY, FIFO_PICK | Pas de perte lot | Conformité traçabilité |
| 5 | Précision stock | STOCK_ACCURACY validée | STOCK_ACCURACY | Étape complétée | Fiabilité inventaire |
| 6 | Conformité M2 | COMPLIANCE_ADV verte | COMPLIANCE_ADV | `compliance.compliant = true` | Scénario comptabilisé |
| 7 | Seuil score | score ≥ 60 en évaluation | — | Panel E score | Progression certification M2 |

## Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario | score ≥ 60/100 (évaluation) |
| Quiz requis | Selon parcours TEC.LOG Module M2 |
| Certification path | TEC.LOG — progression entrepôt intermédiaire (M2) |
| Note compétence | Gestion capacité M2 — compte pour progression certification entrepôt |

## Grille débrief (cocher en séance)

- [ ] Preuve 1 — Overflow 600/500 identifié avant validation
- [ ] Preuve 2 — Split putaway sur ≥ 2 bins STOCKAGE
- [ ] Preuve 3 — Aucun bin au-delà de 500 u.
- [ ] Preuve 4 — 600 u. totales rangées avec traçabilité
- [ ] COMPLIANCE_ADV verte et score ≥ 60
