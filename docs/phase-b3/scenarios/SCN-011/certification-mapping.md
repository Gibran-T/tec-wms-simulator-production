# SCN-011 — Certification Mapping

| Élément | Valeur |
|---------|--------|
| Compétence primaire | Planification réappro |
| Rôle entrepôt | Planificateur supply |
| Rôle mission | Planificateur Approvisionnement |
| Bloom | Évaluer |
| Maturité ERP/WMS | 4 / 4 |
| Seuil | **70/100** |
| certificationNote | Planification réappro M3 — calculs ROP/EOQ évalués |

## Parcours M3

| Jalon | Condition |
|-------|-----------|
| Scénario validé | Score ≥ 70 + conformité |
| Module M3 | Requis avant déblocage M4 |
| Quiz | Selon Guide Maître M3 (questions ROP/EOQ) |

## Preuves → certification

| Preuve | Impact |
|--------|--------|
| CC_LIST → CC_RECON | Valide diagnostic inventaire pré-réappro |
| ROP_CHECK_COMPLETED | Démontre évaluation point de commande |
| EOQ_CALC_COMPLETED | Démontre évaluation quantité économique |
| REPLENISH qty exacte (±10) | Points max réapprovisionnement |
| Score ≥ 70 | Compte module M3 |

## Positionnement parcours M3

| SCN | Focus | Bloom |
|-----|-------|-------|
| SCN-009 | Inventaire cyclique (−3) | Appliquer |
| SCN-010 | Écart significatif (−28) | Analyser |
| SCN-011 | Réappro Min/Max + ROP/EOQ | **Évaluer** |

## Formules de référence (évaluation)

| Concept | Formule |
|---------|---------|
| ROP | (Demande quotidienne × Délai fournisseur) + Stock de sécurité |
| EOQ | √(2 × D × S / H) — D = demande annuelle, S = coût commande, H = coût possession |
| Qté suggérée (moteur) | Max − stock actuel (si stock < Min) |
