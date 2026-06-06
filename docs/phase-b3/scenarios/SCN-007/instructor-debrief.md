# SCN-007 — Notes débrief instructeur

## Objectif pédagogique du débrief

Valider que l'étudiant **applique** la gestion de capacité : détection overflow, **split putaway** conforme, traçabilité préservée — en contraste avec SCN-006 (bin unique adapté).

## Script d'ouverture (5 min — avant run)

> « Pour ce scénario, vous agissez en tant que **Planificateur Capacité**.  
> Nous évaluons votre maîtrise de la compétence **Gestion de capacité** (Bloom : **Appliquer**).  
> Seuil : **60/100**. 600 unités SKU-002 — le bin B-01-R1-L1 ne peut en accueillir que 500.  
> Identifiez l'overflow **avant** de valider le putaway. »

## Questions débrief (15 min)

1. À quel moment avez-vous identifié le dépassement de capacité ?
2. Comment avez-vous réparti les 600 unités ? Quels bins avez-vous choisis ?
3. Pourquoi forcer un seul bin aurait été une erreur ici (contrairement à SCN-006) ?
4. Comment avez-vous vérifié que la traçabilité SKU-002 était intacte après le split ?
5. Quel tCode SAP consultez-vous pour la capacité emplacement ? (LS01)

## Signaux d'alerte (intervention formative)

| Observation | Action instructeur |
|-------------|-------------------|
| Tentative putaway 600 u. sur B-01-R1-L1 | Arrêter — montrer alerte capacité |
| Split vers zone hors STOCKAGE | Rappeler règles LT01 |
| Stock total < 600 après rangement | Vérifier tous les mouvements LT01 |
| Refus de split (« un seul bin suffit ») | Contraster avec SCN-006 |

## Liens documents

- Fiche : `fiche-mission.md`
- Anti-patterns : `failure-conditions.md`
- Différenciation SCN-006 : split = solution **correcte** en SCN-007

## Référence superviseur

Le système doit refuser ou alerter sur un dépassement de 500 u. La répartition correcte est **obligatoire** pour valider le scénario en évaluation.
