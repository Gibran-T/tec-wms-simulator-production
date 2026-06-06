# SCN-016 — Matrice des preuves (instructeur)

| Métadonnée | Valeur |
|------------|--------|
| Module | M5 |
| Seuil évaluation | 70/100 |
| Compétence primaire | Action corrective |
| Bloom | Évaluer |
| Pattern | A — Flux M5 avec branche exception (ADJ) |

## Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E / Cockpit | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | Réception / putaway | M5_RECEPTION + M5_PUTAWAY | M5_* | `completedSteps` | Flux M5 amont |
| 2 | Variance détectée | Écart au cycle count | M5_CYCLE_COUNT | CC tx + variance flag | Exception identifiée |
| 3 | ADJ posté | Ajustement MI07 | ADJ | tx ADJ POST | Action corrective |
| 4 | Écart résolu | Stock réconcilié | ADJ | inventory cohérent | Audit trail |
| 5 | Flux repris | M5_REPLENISH post-ADJ | M5_REPLENISH | step après ADJ | Séquence correcte |
| 6 | KPI fiables | M5_KPI post-correction | M5_KPI | step + contenu | Évaluer |
| 7 | Décision cohérente | M5_DECISION post-correction | M5_DECISION | eval | Gold path |
| 8 | Conformité M5 | COMPLIANCE_M5 sans écart ouvert | COMPLIANCE_M5 | `compliance.compliant = true` | Module M5 |
| 9 | Seuil score (évaluation) | score ≥ 70/100 | — | Panel E score | Scénario M5 compté |

## Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario | score ≥ 70/100 (évaluation) |
| Bloom | Évaluer — jugement sur correction avant décision |
| Certification path | TEC.LOG — Gold path (Module 5) |
| Note compétence | Action corrective — ADJ obligatoire avant KPI |

## Grille débrief (cocher en séance)

- [ ] Variance détectée au M5_CYCLE_COUNT
- [ ] ADJ posté avec justification
- [ ] Aucun passage à M5_KPI avant ADJ
- [ ] M5_REPLENISH après correction
- [ ] KPI calculés sur stock réconcilié
- [ ] COMPLIANCE_M5 sans écart ouvert
- [ ] Score ≥ 70/100
