# SCN-006 — Notes débrief instructeur

## Objectif pédagogique du débrief

Valider que l'étudiant **applique** la séquence M2 (GR avant putaway), choisit un emplacement **STOCKAGE** conforme LT01, et **réagit à l'alerte capacité** sans recourir au split multi-bins (compétence SCN-007).

## Script d'ouverture (5 min — avant run)

> « Pour ce scénario, vous agissez en tant que **Spécialiste Rangement**.  
> Nous évaluons votre maîtrise de la compétence **Rangement structuré** (Bloom : **Appliquer**).  
> Seuil : **60/100**. 150 unités SKU-001 sont déjà postées à REC-01 — commencez par valider la GR, puis LT01 vers STOCKAGE.  
> Ouvrez Mission Control si vous avez besoin des règles putaway. »

## Questions débrief (15 min)

1. Comment avez-vous confirmé que la GR était postée avant le rangement ?
2. Quel critère vous a permis de valider que le bin était en zone STOCKAGE ?
3. Qu'avez-vous fait face à l'alerte capacité pour 150 unités ?
4. Pourquoi le split multi-bins n'est-il pas la solution attendue ici ?
5. Quel tCode SAP correspond au putaway structuré ? (LT01)

## Signaux d'alerte (intervention formative)

| Observation | Action instructeur |
|-------------|-------------------|
| Putaway avant vérification GR | Arrêter — rappeler ordre GR → PUTAWAY |
| Bin hors STOCKAGE sélectionné | Pointer règles zone LT01 |
| Overflow ignoré sur bin unique | Rappeler alerte capacité ; choisir bin adapté |
| Tentative split 2+ bins | Rediriger vers SCN-007 pour capacité complexe |

## Liens documents

- Fiche : `fiche-mission.md`
- Anti-patterns G-C06 : `failure-conditions.md` § Anti-patterns
- Différenciation SCN-007 : split putaway = gestion capacité avancée

## Référence superviseur

Flux M2 documenté : `GR → PUTAWAY → FIFO_PICK → STOCK_ACCURACY → COMPLIANCE_ADV`.  
Rangement structuré = slotting conforme sans saturation slot.
