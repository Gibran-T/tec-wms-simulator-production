# SCN-008 — Notes débrief instructeur

## Objectif pédagogique du débrief

Valider que l'étudiant **analyse** les dates de lot, sépare la traçabilité au rangement, et exécute un **FIFO_PICK** conforme — LOT-A (janvier) avant tout autre lot.

## Script d'ouverture (5 min — avant run)

> « Pour ce scénario, vous agissez en tant que **Spécialiste FIFO**.  
> Nous évaluons votre maîtrise de la compétence **Conformité FIFO** (Bloom : **Analyser**).  
> Seuil : **60/100**. Trois lots SKU-003 — janvier, février, mars.  
> Le client exige que **LOT-A** (le plus ancien) sorte en premier. Comparez les dates avant de prélever. »

## Questions débrief (15 min)

1. Comment avez-vous identifié LOT-A comme lot le plus ancien ?
2. Pourquoi le putaway séparé par lot est-il nécessaire avant le prélèvement ?
3. Qu'aurait-il fallu faire si vous aviez prélevé LOT-C par erreur ?
4. Quelle preuve confirme que le client a reçu le bon lot (FIFO) ?
5. En quoi ce scénario diffère-t-il de SCN-006 et SCN-007 ? (traçabilité vs zone/capacité)

## Signaux d'alerte (intervention formative)

| Observation | Action instructeur |
|-------------|-------------------|
| Pick LOT-C ou LOT-B en premier | Arrêter — retour analyse dates |
| Mélange lots dans un mouvement | Rappeler séparation putaway |
| Bin choisi au hasard | Pointer Mission Control dates |
| Confusion capacité / FIFO | Différencier SCN-007 vs SCN-008 |

## Liens documents

- Fiche : `fiche-mission.md`
- Anti-patterns : `failure-conditions.md`
- Supervisor note : LOT-A (jan) doit sortir avant LOT-B et LOT-C

## Référence superviseur

Mauvais lot en évaluation = pénalité FIFO et échec conformité. En démo, re-pick avec lot correct autorisé (`recoveryPaths`).
