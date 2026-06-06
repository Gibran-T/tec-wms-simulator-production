# FICHE DE MISSION OPÉRATIONNELLE — SCN-002

**Référence:** CL-SCN-002  
**Code scénario:** SCN-002  
**Module:** M1 — Fondations logistiques  
**Seuil évaluation:** 60/100  
**Difficulté:** moyen  
**Statut:** ACTIF

*Concorde Logistics — Institutional Standard · QMS v2.0*

---

## Contexte opérationnel

Le système affiche un Bon de Commande validé, mais le stock n'est pas apparu dans le bin de réception. Une GR (GR-2025-001) existe mais n'a pas été postée.

## Objectif de la mission

Détection et résolution d'une anomalie de réception (Ghost GR).

## Rôles

| Type | Libellé |
|------|---------|
| **Rôle de mission** (poste simulé) | Contrôleur Qualité Logistique |
| **Compétence évaluée** (rôle entrepôt) | Opérateur entrepôt |
| **Compétence primaire** | Identification de problème |
| **Niveau Bloom** | Comprendre |
| **Progression** | Fondation M1 |

## Spécifications techniques

| SKU | Quantité | Emplacement |
|-----|----------|-------------|
| SKU-001 | 100 | REC-01 |

## Actions à réaliser (étudiant)

1. Ouvrir le cockpit : repérer GR-2025-001 en statut PENDING dans le moniteur de transactions.
2. Aller à l'étape GR ou Conformité et cliquer « Poster (MIGO) » sur GR-2025-001.
3. Ne pas créer une nouvelle GR — cela laisserait la fantôme non postée.
4. Une fois postée, ranger (PUTAWAY), poursuivre SO → Picking → GI → CC → Conformité.

## Preuves attendues

Voir `student-expected-evidence.md`.

## Critères de réussite

Voir `success-criteria.md`.

## Conditions d'échec

Voir `failure-conditions.md`.

## Équivalents ERP/WMS

Voir `erp-wms-mapping.md`.

## Lien certification

Voir `certification-mapping.md`.

## Points de contrôle

1. Analyser le moniteur de transactions pour identifier les documents non postés.
2. Vérifier l'état du bin REC-01 dans le cockpit opérationnel.
3. Valider la transaction GR manquante pour débloquer le flux.

## Résultat attendu

GR fantôme postée, stock visible en REC-01, conformité rétablie.

---

**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  
Le « Rôle de mission » décrit votre poste dans la simulation.  
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.  
Ces deux libellés peuvent différer sans contradiction.

*Référence : `docs/phase-b3/01-dual-role-standard.md` § 5*
