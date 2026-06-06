# SCN-008 — Matrice des preuves (instructeur)

| Métadonnée | Valeur |
|------------|--------|
| Module | M2 |
| Seuil évaluation | 60/100 |
| Compétence primaire | Conformité FIFO |
| Bloom | Analyser |
| Pattern | A — Flux transactionnel M2 + traçabilité lot |

## Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E / Cockpit | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | GR multi-lots validée | LOT-A, LOT-B, LOT-C réceptionnés et postés | GR | 3 lots distincts en stock | Traçabilité amont établie |
| 2 | Putaway par lot | Chaque lot rangé séparément en STOCKAGE | PUTAWAY | Bins distincts par lot | Pas de mélange lots |
| 3 | LOT-A identifié comme plus ancien | Analyse dates réception (jan < fév < mar) | Analyse FIFO | Mission Control / cockpit dates | Conformité FIFO — Analyser |
| 4 | FIFO_PICK lot A en premier | Prélèvement sur LOT-A avant B ou C | FIFO_PICK | Mouvement lot = LOT-A | Client servi conformément FIFO |
| 5 | Traçabilité conservée | Lot source = destination sur chaque mouvement | FIFO_PICK, STOCK_ACCURACY | Pas de mélange cross-lot | Audit trail intact |
| 6 | Conformité M2 | COMPLIANCE_ADV verte | COMPLIANCE_ADV | `compliance.compliant = true` | Scénario comptabilisé |
| 7 | Seuil score | score ≥ 60 en évaluation | — | Panel E score | Progression certification M2 |

## Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario | score ≥ 60/100 (évaluation) |
| Quiz requis | Selon parcours TEC.LOG Module M2 |
| Certification path | TEC.LOG — progression entrepôt intermédiaire (M2) |
| Note compétence | Conformité FIFO M2 — seuil 60/100 |

## Grille débrief (cocher en séance)

- [ ] Preuve 1 — Trois lots GR postés (A, B, C)
- [ ] Preuve 2 — Putaway séparé par lot
- [ ] Preuve 3 — LOT-A identifié comme plus ancien
- [ ] Preuve 4 — FIFO_PICK sur LOT-A avant les autres
- [ ] COMPLIANCE_ADV verte et score ≥ 60
