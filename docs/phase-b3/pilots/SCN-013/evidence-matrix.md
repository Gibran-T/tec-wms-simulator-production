# SCN-013 — Matrice des preuves (instructeur)

| Métadonnée | Valeur |
|------------|--------|
| Module | M4 |
| Seuil évaluation | 70/100 |
| Compétence primaire | Analyse taux de service |
| Bloom | Évaluer |
| Pattern | C — Analytique KPI |

## Matrice détaillée

| # | Critère de réussite | Preuve requise (observable) | Étape / artefact | Indice Panel E / Cockpit | Résultat certification |
|---|---------------------|----------------------------|------------------|--------------------------|------------------------|
| 1 | Données KPI collectées | KPI_DATA complété avant analyse | KPI_DATA | `completedSteps` contient KPI_DATA | Pipeline M4 initié |
| 2 | Rotation contextualisée | KPI_ROTATION traité (contexte pipeline) | KPI_ROTATION | step + contenu | Analyse holistique M4 |
| 3 | Service analysé | KPI_SERVICE complété avec cibles | KPI_SERVICE | completedSteps | Service Level Analysis |
| 4 | Erreurs corrélées | Lien erreurs ops ↔ baisse service | KPI_DIAGNOSTIC | contenu diagnostic | Évaluer |
| 5 | Causes identifiées | Causes racines nommées | KPI_DIAGNOSTIC | eval | M4 ≥ 70 |
| 6 | Plan actionnable | Recommandations chiffrées | KPI_DIAGNOSTIC | — | OTIF / SLA |
| 7 | Clôture M4 | COMPLIANCE_M4 | COMPLIANCE_M4 | `compliance.compliant = true` | Module M4 |
| 8 | Seuil score (évaluation) | score ≥ 70/100 | — | Panel E score | Scénario M4 compté |

## Tour de contrôle KPI (référence)

| Élément | Cible / focus |
|---------|---------------|
| KPI évalué | Taux de service & taux d'erreur opérationnelle |
| Service excellent | ≥ 95 % |
| Erreurs excellent | ≤ 1 % |
| Alerte | Service < 85 % ou erreurs > 5 % → risque SLA |
| Sortie | Diagnostic causes + plan (VL06O) |

## Synthèse certification

| Élément | Valeur |
|---------|--------|
| Seuil scénario | score ≥ 70/100 (évaluation) |
| Bloom | Évaluer (distinct de SCN-012 — Analyser) |
| Certification path | TEC.LOG — Module 4 Expert |
| Note compétence | Analyse taux de service — corrélation erreurs ↔ OTIF |

## Grille débrief (cocher en séance)

- [ ] KPI_DATA consulté avant diagnostic service
- [ ] KPI_ROTATION contextualisé (pipeline complet)
- [ ] Corrélation erreurs ↔ service explicitée
- [ ] Pas de diagnostic générique
- [ ] Cibles 95 % / 1 % citées
- [ ] Score ≥ 70/100
