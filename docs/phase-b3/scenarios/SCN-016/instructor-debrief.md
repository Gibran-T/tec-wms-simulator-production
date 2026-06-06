# SCN-016 — Notes débrief instructeur

## Objectif pédagogique

Enseigner la **gestion d'exception M5** : variance injectée → ADJ obligatoire → reprise flux → KPI fiables. Priorité : résoudre le physique avant toute décision.

## Script d'ouverture

> « Vous agissez en tant que **Gestionnaire d'Entrepôt**.  
> Compétence : **Action corrective** (Évaluer). Seuil **70/100**.  
> Une variance sera injectée au cycle count — vous devez corriger (ADJ) avant KPI et décision. »

## Questions débrief

1. Quel écart avez-vous détecté au M5_CYCLE_COUNT ?
2. Pourquoi l'ADJ était-il obligatoire avant de continuer ?
3. Qu'aurait faussé votre M5_KPI si vous aviez ignoré l'écart ?
4. Avez-vous documenté la justification de l'ajustement ?
5. Comment ce scénario diffère-t-il du gold path SCN-015 ?

## Signaux d'alerte

- Passage direct M5_CYCLE_COUNT → M5_REPLENISH sans ADJ
- COMPLIANCE_M5 clôturée avec variance ouverte
- Décision KPI sans mention de la correction effectuée
- Traitement « comme SCN-015 » malgré l'écart

## Branche pédagogique

Rejouer en démo la séquence : **CC (variance) → ADJ → reprise → KPI → Decision**.

## Comparaison M5

| SCN | Exception | Compétence |
|-----|-----------|------------|
| 015 | Non | Opérations intégrées |
| 016 | **Variance + ADJ** | Action corrective |
| 017 | Post-cycle exécutif | Décision stratégique |

## Lien Panel B application

Moniteur transactions — vérifier tx ADJ POST et absence de variance non résolue avant COMPLIANCE_M5.
