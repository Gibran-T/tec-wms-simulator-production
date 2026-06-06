# SCN-009 — Notes débrief instructeur

## Objectif pédagogique

Former à la **procédure d'inventaire cyclique** et à la **clôture complète** d'un petit écart (−3) — fondation avant SCN-010 (justification formelle) et SCN-011 (réappro).

## Politique institutionnelle (G-C05 — adoptée)

| Règle | Exigence |
|-------|----------|
| CC_RECON | **Obligatoire** |
| Ajustement −3 (MI07 via CC_RECON) | **Obligatoire** |
| Justification écrite | **Optionnelle** si \|écart\| < 5 u. |
| SCN-010 | Premier scénario avec justification formelle obligatoire |

Référence : `06-superviseur-runbook-addendum/SCN-009-adj-policy.md`

## Script d'ouverture

> « Vous agissez en tant qu'**Auditeur Inventaire**.  
> Compétence : **Précision inventaire** (Appliquer). Seuil **70/100**.  
> Deux SKU à compter : SKU-001 et SKU-003.  
> Pour l'écart −3 : documentez en CC_RECON **et** postez l'ajustement pour aligner le stock.  
> Une justification longue n'est pas exigée ici — c'est le focus de SCN-010. »

## Questions débrief

1. Quel écart avez-vous calculé sur SKU-001 (système − physique) ?
2. SKU-003 était-il conforme ? Comment l'avez-vous vérifié ?
3. Qu'avez-vous documenté dans CC_RECON ?
4. Avez-vous posté l'ajustement −3 ? Le stock système affiche-t-il 97 u. ?
5. Quelle est la différence entre réconciliation et ajustement comptable (ADJ/MI07) ?
6. Pourquoi SCN-010 exige une justification écrite alors que SCN-009 ne l'exige pas ?
7. Pourquoi REPLENISH n'était-il pas requis dans ce scénario ?

## Signaux d'alerte

- Ignorer l'écart −3 sur SKU-001 → échec détection
- CC_RECON documentée mais ajustement −3 non posté → stock non aligné
- Passer COMPLIANCE_M3 sans CC_RECON → non-conformité
- ADJ sans réconciliation préalable → anti-pattern

## Contexte technique (référence instructeur)

| Paramètre | Valeur |
|-----------|--------|
| Seuil justification moteur M3 | 5 unités (`M3_VARIANCE_THRESHOLD`) |
| Écart SCN-009 | −3 (< seuil — justification écrite optionnelle) |
| Seuil pédagogique SCN-010 | 20 unités (justification formelle obligatoire) |
| Gap G-C05 | **Closed** — Option B (refined) |

## Lien scénarios M3

| SCN | Écart / focus | Justification |
|-----|---------------|---------------|
| SCN-009 | −3 — cyclique simple | Optionnelle (< 5 u.) |
| SCN-010 | −28 — écart significatif | **Obligatoire** (> 20 u.) |
| SCN-011 | Sous Min — ROP/EOQ | Calculs évalués |
