# SCN-009 — Matrice des preuves (instructeur)

| Métadonnée | Valeur |
|------------|--------|
| Module | M3 |
| Seuil évaluation | 70/100 |
| Compétence primaire | Précision inventaire |
| Bloom | Appliquer |
| Pattern | B — Inventaire / variance (petit écart) |
| Politique G-C05 | **Closed** — Option B (refined) adoptée |

## Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E / Cockpit | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | Liste de comptage générée | SKU-001 et SKU-003 listés | CC_LIST | step CC_LIST | Inventory accuracy path |
| 2 | Quantités physiques saisies | SKU-001 = 97 ; SKU-003 = 80 | CC_COUNT | cycle count data | Précision inventaire |
| 3 | Écart −3 identifié | Calcul système − physique = −3 | CC_COUNT | variance display | Détection écart |
| 4 | Réconciliation documentée | Texte CC_RECON pour SKU-001 | CC_RECON | eval mode | **Obligatoire** |
| 5 | SKU-003 conforme | Aucun écart sur SKU-003 | CC_RECON | cycle count data | Couverture multi-SKU |
| 6 | Ajustement −3 posté | Tx ADJ / MI07, stock = 97 | CC_RECON | `completedSteps` + tx | Stock aligné — **obligatoire** |
| 7 | Conformité verte | compliant true | COMPLIANCE_M3 | `compliance.compliant = true` | Module M3 validation |
| 8 | Seuil score (évaluation) | score ≥ 70/100 | — | Panel E score | Scénario M3 compté |

**Note :** justification écrite **non auditée** pour |écart| < 5 u. REPLENISH conditionnel — non audité si flux inactif.

## Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario | score ≥ 70/100 (évaluation) |
| Quiz requis | Oui — Quiz M3 pour validation module |
| Certification path | TEC.LOG — Module 3 avancé |
| Note compétence | Précision inventaire — détection + réconciliation + alignement stock |
| Politique G-C05 | CC_RECON + ajustement obligatoires ; justification optionnelle < 5 u. |

## Grille débrief (cocher en séance)

- [ ] CC_LIST complète (2 SKU)
- [ ] Écart −3 explicitement identifié sur SKU-001
- [ ] CC_RECON documentée (obligatoire)
- [ ] Ajustement −3 posté — stock système = 97
- [ ] SKU-003 validé sans écart
- [ ] COMPLIANCE_M3 verte
- [ ] Score ≥ 70/100
