# SCN-010 — Notes débrief instructeur

## Objectif pédagogique

Former à la **justification obligatoire** des écarts au-delà du seuil opérationnel (20 u.) — pont vers audit trail comptable/stocks.

## Script d'ouverture

> « Vous agissez en tant que **Gestionnaire Inventaire**.  
> Compétence : **Gestion des écarts** (Analyser). Seuil **70/100**.  
> Tout écart > 20 unités exige une justification avant ajustement. »

## Questions débrief

1. Quel écart avez-vous calculé (système − physique) ?
2. Pourquoi le seuil de 20 unités est-il significatif ?
3. Quelle justification avez-vous documentée pour −28 ?
4. Différence entre CC_RECON et ADJ dans votre flux ?
5. Que se passe-t-il si vous ajustez sans justification en mode évaluation ?

## Signaux d'alerte

- ADJ sans texte de justification → rappel evalGuidance
- Quantité physique = quantité système → écart non détecté
- Passage COMPLIANCE_M3 avec variance ouverte

## Lien SCN-009 (politique G-C05 — adoptée)

| Dimension | SCN-009 | SCN-010 (ce scénario) |
|-----------|---------|----------------------|
| Écart | −3 | −28 |
| CC_RECON | Obligatoire | Obligatoire |
| Ajustement MI07 | **Obligatoire** | **Obligatoire** |
| Justification écrite | **Optionnelle** (< 5 u.) | **Obligatoire** (> seuil 20 u.) |
| Bloom | Appliquer | Analyser |

SCN-009 enseigne la **clôture procédurale** (détecter → réconcilier → aligner stock). SCN-010 introduit la **gouvernance documentaire** des écarts significatifs. Référence : `06-superviseur-runbook-addendum/SCN-009-adj-policy.md`.
