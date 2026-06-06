# SCN-003 — Notes débrief instructeur

## Objectif pédagogique

Démontre la **séquence décisionnelle** face à une rupture de stock : identifier le déficit, réapprovisionner, puis expédier — sans forcer la GI avec stock insuffisant.

## Script d'ouverture

> « Vous agissez en tant que **Responsable d'Opération**.  
> Compétence évaluée : **Opérateur entrepôt** — **Prise de décision** (Appliquer).  
> Règle d'or : **ne jamais valider la GI sans stock suffisant**. Réapprovisionnez avant d'expédier. Seuil **60/100**. »

## Questions débrief

1. À quel moment avez-vous constaté que le stock (50 u.) était insuffisant pour la SO (ex. 80 u.) ?
2. Pourquoi la GI doit-elle être bloquée tant que le réappro n'est pas rangé ?
3. Quelle quantité avez-vous commandée en PO corrective et pourquoi ?
4. Quel lien entre putaway réappro et validation PICKING_M1 / GI ?
5. Si vous aviez expédié sans réapprovisionner, quel impact sur le score et la conformité ?

## Signaux d'alerte

| Observation | Intervention |
|-------------|--------------|
| GI tentée avec stock < SO | Bloquer — rappeler réappro obligatoire |
| SO créée mais pas de PO corrective | Orienter vers ME21N + MIGO |
| Putaway initial sauté | Rappeler séquence Physique → Décision → Expédition |
| Expédition sans rangement réappro | Anti-pattern — stock non disponible |

## Recovery path officiel

PUTAWAY_M1 (50 u.) → SO (déficit constaté) → PO corrective + GR (+30 u.) → PUTAWAY_M1 réappro → PICKING_M1 → GI → CC → COMPLIANCE

## Référence pilote

Comparer avec **SCN-005** (séquence Documents → Physique → Expédition) pour la logique d'ordonnancement décisionnel ; SCN-003 applique la même discipline à la rupture stock.
