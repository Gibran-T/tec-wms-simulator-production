# FICHE DE MISSION OPÉRATIONNELLE — SCN-007

**Référence:** CL-SCN-007  
**Code scénario:** SCN-007  
**Module:** M2 — Gestion des emplacements  
**Seuil évaluation:** 60/100  
**Difficulté:** moyen  
**Statut:** ACTIF

*Concorde Logistics — Institutional Standard · QMS v2.0*

---

## Contexte opérationnel

**600 unités** de **SKU-002** sont reçues et doivent être rangées. Le bin **B-01-R1-L1** affiche une **capacité maximale de 500 unités**. Le système alerte ou refuse tout dépassement. Vous devez planifier une répartition conforme sans perdre la traçabilité.

*Accès Mission Control recommandé pour consulter capacités et bins alternatifs STOCKAGE.*

## Objectif de la mission

Gérer un dépassement de capacité d'emplacement et proposer une solution conforme par répartition (split putaway).

## Rôles

| Type | Libellé |
|------|---------|
| **Rôle de mission** (poste simulé) | Planificateur Capacité (Capacity Planner) |
| **Compétence évaluée** (rôle entrepôt) | Planificateur capacité |
| **Compétence primaire** | Gestion de capacité |
| **Niveau Bloom** | Appliquer |
| **Progression** | Intermédiaire M2 |

## Spécifications techniques

| SKU | Quantité | Bin principal | Capacité max |
|-----|----------|---------------|--------------|
| SKU-002 | 600 | B-01-R1-L1 | 500 u. |

*Répartition attendue : au minimum deux bins valides (ex. 500 + 100 u.) en zone STOCKAGE.*

## Actions à réaliser (étudiant)

1. **Identifier la capacité** — Consulter B-01-R1-L1 et détecter l'overflow (600 > 500).
2. **PUTAWAY (split)** — Répartir le rangement sur plusieurs bins STOCKAGE valides.
3. **FIFO_PICK** — Exécuter le prélèvement FIFO si requis.
4. **STOCK_ACCURACY** — Valider la précision stock après répartition.
5. **COMPLIANCE_ADV** — Clôturer avec conformité avancée M2.

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

1. Détecter l'overflow **avant** validation du putaway unique.
2. Répartir les 600 u. sans dépasser la capacité de chaque bin.
3. Maintenir la traçabilité lot/SKU sur chaque mouvement.
4. Compléter le pipeline M2 jusqu'à COMPLIANCE_ADV.

## Résultat attendu

Stock réparti sans overflow, précision validée, conformité M2 au vert.

---

**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  
Le « Rôle de mission » décrit votre poste dans la simulation.  
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.  
Ces deux libellés peuvent différer sans contradiction.

*Référence : `docs/phase-b3/01-dual-role-standard.md` § 5*
