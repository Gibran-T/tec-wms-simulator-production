# SCN-004 — Notes débrief instructeur

## Objectif pédagogique

Démontre la **réconciliation inventaire** : après expédition partielle, identifier l'écart physique/système (−15), saisir la quantité réelle au cycle count, puis ajuster avant clôture.

## Script d'ouverture

> « Vous agissez en tant que **Auditeur d'Inventaire**.  
> Compétence évaluée : **Spécialiste qualité** — **Analyse des écarts** (Analyser).  
> Règle d'or : au cycle count, saisissez la **quantité physique comptée**, pas la quantité système. L'écart −15 est intentionnel. Seuil **60/100**. »

## Questions débrief

1. À quel moment l'écart de −15 unités est-il apparu dans le flux ?
2. Quelle quantité avez-vous saisie au cycle count (physique vs système) ?
3. Pourquoi saisir 185 et non 200 au CC ?
4. Quel lien entre ADJ (MI07) et conformité finale ?
5. Si vous aviez clôturé en conformité sans ADJ, quel bloqueur auriez-vous rencontré ?

## Signaux d'alerte

| Observation | Intervention |
|-------------|--------------|
| CC avec quantité système (200) | Bloquer — rappeler saisie physique |
| CC sans ADJ malgré variance −15 | Rappeler variance ouverte |
| ADJ sauté avant COMPLIANCE | Orienter vers MI07 |
| Écart intentionnel ignoré | Rappeler objectif pédagogique audit |

## Recovery path officiel

PUTAWAY_M1 → SO → PICKING_M1 → GI → CC (physique 185) → ADJ (−15) → COMPLIANCE

## Référence pilote

Comparer avec **SCN-005** (écart SKU-005 −8) : même pattern CC → ADJ → COMPLIANCE ; SCN-004 isole l'analyse d'écart post-expédition partielle (difficile).
