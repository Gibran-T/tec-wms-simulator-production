# SCN-005 — Matrice des preuves (instructeur)

| Métadonnée | Valeur |
|------------|--------|
| Module | M1 |
| Seuil évaluation | 60/100 |
| Compétence primaire | Résolution de problèmes complexes |
| Bloom | Analyser |
| Pattern | A + B (transactions + variance) |

## Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E / Cockpit | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | GR-2025-004 postée | Tx GR POST SKU-004 | GR | `completedSteps` contient GR | Problem identification + sequencing |
| 2 | Putaway SKU-004 post-GR | Stock STOCKAGE SKU-004 | PUTAWAY_M1 | inventory | Séquence Documents→Physique |
| 3 | Flux expédition dual-SKU | SO / PICKING_M1 / GI complétés | PICKING_M1, GI | steps | Ops multi-SKU |
| 4 | Écart SKU-005 identifié | CC saisie physique ≠ système | CC | cycle count data | Variance analysis |
| 5 | ADJ SKU-005 −8 | ADJ step / MI07 | ADJ | `completedSteps` contient ADJ | Écart résolu |
| 6 | Conformité 100 % | compliant true | COMPLIANCE | `compliance.compliant = true` | Progression Silver M1 |
| 7 | Seuil score | score ≥ 60 | — | Panel E score | Scénario M1 compté |

## Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario | score ≥ 60/100 (évaluation) |
| Quiz requis | Oui — Quiz M1 (60 %) pour Silver |
| Certification path | TEC.LOG Silver (Module 1) |
| Note compétence | Capstone M1 — Résolution de problèmes complexes (Analyser) |

## Grille débrief (cocher en séance)

- [ ] GR-004 postée avant PUTAWAY_M1 SKU-004
- [ ] ADJ SKU-005 effectué
- [ ] Ordre Documents → Physique → Expédition respecté
- [ ] Conformité finale verte
- [ ] Score ≥ 60/100
