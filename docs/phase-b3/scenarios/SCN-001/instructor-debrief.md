# SCN-001 — Notes débrief instructeur

## Objectif pédagogique

Valider la **maîtrise du flux nominal M1** — chaque étape documentaire avant l'étape physique suivante.

## Script d'ouverture

> « Vous agissez en tant que **Gestionnaire de Stocks**.  
> Compétence évaluée : **Opérateur entrepôt** — **Exécution opérationnelle** (Comprendre).  
> Seuil **60/100**. Aucune anomalie injectée — respectez la séquence PO → GR → … → Conformité. »

## Questions débrief

1. Quelle étape fait apparaître le stock au quai ?
2. Pourquoi vérifier MB52 avant la GI ?
3. À quoi sert le cycle count en fin de flux ?
4. Quel tCode SAP correspond au rangement ? (LT0A)
5. Quelle preuve confirme la conformité finale ?

## Signaux d'alerte

| Observation | Action instructeur |
|-------------|-------------------|
| GI avant putaway | Rappeler séquence stock |
| Transaction PENDING | Retour posting |
| Étape sautée | Pointer OUT_OF_SEQUENCE |

## Référence pilote

Comparer avec SCN-002 (même flux avec anomalie GR) pour différencier nominal vs diagnostic.
