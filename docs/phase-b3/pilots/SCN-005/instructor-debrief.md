# SCN-005 — Notes débrief instructeur

## Objectif pédagogique

Démontre la **priorisation multi-anomalie** : ghost GR (document) avant putaway, puis écart inventaire (physique) avant clôture.

## Script d'ouverture

> « Vous agissez en tant que **Superviseur Logistique**.  
> Compétence évaluée : **Spécialiste qualité** — Résolution de problèmes complexes (Analyser).  
> Règle d'or : **Documents → Physique → Expédition**. Seuil **60/100**. »

## Questions débrief

1. Pourquoi GR-2025-004 devait être postée avant le putaway SKU-004 ?
2. À quel moment l'écart SKU-005 (−8) est-il apparu ?
3. Quelle quantité avez-vous saisie au cycle count (physique vs système) ?
4. Quel lien entre ADJ et conformité finale ?
5. Si vous aviez expédié avant de résoudre l'écart, quel impact sur le score ?

## Signaux d'alerte

| Observation | Intervention |
|-------------|--------------|
| Putaway SKU-004 avant GR-004 | Bloquer — ordre Documents |
| CC sans ADJ SKU-005 | Rappeler variance ouverte |
| Nouvelle GR SKU-004 | Anti-pattern documentaire |

## Recovery path officiel

Post GR-004 → putaway both → ship → CC SKU-005 → ADJ → Compliance
