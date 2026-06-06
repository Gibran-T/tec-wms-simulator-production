# SCN-002 — Notes débrief instructeur

## Objectif pédagogique du débrief

Valider que l'étudiant a **identifié l'anomalie documentaire** (GR non postée) avant toute action physique, et compris la différence entre *créer* une GR et *poster* une GR existante.

## Script d'ouverture (5 min — avant run)

> « Pour ce scénario, vous agissez en tant que **Contrôleur Qualité Logistique**.  
> Nous évaluons votre maîtrise de la compétence **Opérateur entrepôt** — **Identification de problème** (Bloom : Comprendre).  
> Seuil : **60/100**. Commencez par le moniteur de transactions. »

## Questions débrief (15 min)

1. Comment avez-vous détecté que la réception était « fantôme » ?
2. Pourquoi créer une nouvelle GR aurait été une mauvaise décision ?
3. Quelle preuve confirme que GR-2025-001 est active dans le stock ?
4. À quel moment la conformité est-elle passée au vert ?
5. Quel tCode SAP correspond à l'action corrective ? (MIGO)

## Signaux d'alerte (intervention formative)

| Observation | Action instructeur |
|-------------|-------------------|
| Putaway avant post GR | Arrêter — rappeler ordre Documents d'abord |
| Nouvelle GR créée | Pointer double GR / fantôme persistante |
| REC-01 vide après « réception » | Retour moniteur PENDING |

## Liens documents

- Fiche : `fiche-mission.md`
- Anti-patterns (Guide étudiant) : ne pas créer nouvelle GR ; ne pas ignorer PENDING
- Panel D application : `alternativeActions` — « Créer nouvelle GR (incorrect) »

## Référence superviseur

Réception fantôme = document créé mais non validé dans le WMS. Réconciliation dock WMS vs ERP.
