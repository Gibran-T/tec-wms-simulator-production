# FICHE DE MISSION OPÉRATIONNELLE — SCN-011

**Référence:** CL-SCN-011  
**Code scénario:** SCN-011  
**Module:** M3 — Gestion inventaire avancée  
**Seuil évaluation:** 70/100  
**Difficulté:** difficile  
**Statut:** ACTIF

*Concorde Logistics — Institutional Standard · QMS v2.0*

---

## Contexte opérationnel

Deux SKU sont **sous le seuil Min** après consommation récente :

| SKU | Stock actuel | Min | Max | Stock sécurité | Délai (j) |
|-----|--------------|-----|-----|----------------|-----------|
| SKU-004 | 30 u. | 50 | 200 | 25 | 3 |
| SKU-005 | 40 u. | 80 | 300 | 30 | 5 |

Analysez les niveaux, exécutez le pipeline inventaire M3, puis générez des recommandations de réapprovisionnement conformes aux paramètres Min/Max et aux calculs **ROP/EOQ**.

## Objectif de la mission

Générer des recommandations de réapprovisionnement selon Min/Max, stock de sécurité et quantités calculées (ROP/EOQ).

## Rôles

| Type | Libellé |
|------|---------|
| **Rôle de mission** | Planificateur Approvisionnement |
| **Compétence évaluée** | Planificateur supply |
| **Compétence primaire** | Planification réappro |
| **Niveau Bloom** | Évaluer |
| **Progression** | Avancé M3 |

## Spécifications techniques

| SKU | Quantité système | Emplacement | Statut |
|-----|------------------|-------------|--------|
| SKU-004 | 30 | B-01-R1-L1 | Sous Min (50) |
| SKU-005 | 40 | B-01-R1-L2 | Sous Min (80) |

**Quantités de réapprovisionnement attendues (Max − stock actuel) :**

| SKU | Calcul | Quantité suggérée |
|-----|--------|-------------------|
| SKU-004 | 200 − 30 | **170 u.** |
| SKU-005 | 300 − 40 | **260 u.** |

## Actions à réaliser (étudiant)

1. **CC_LIST** — générer / consulter la liste de comptage pour valider les niveaux système.
2. **CC_COUNT** — confirmer les quantités physiques (SKU-004 : 30 u. ; SKU-005 : 40 u.).
3. **CC_RECON** — documenter que les deux SKU sont sous Min ; aucun écart inventaire significatif attendu.
4. **REPLENISH** — saisir les quantités **calculées** pour chaque SKU (170 u. SKU-004 ; 260 u. SKU-005), en vous appuyant sur ROP et EOQ.
5. **COMPLIANCE_M3** — clôture conformité module.

> **Interdit :** libellé vague « pipeline CC » — chaque étape doit être exécutée dans l'ordre ci-dessus.

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

1. Niveaux sous Min détectés (SKU-004 et SKU-005).
2. ROP interprété (Min ≈ point de commande dans ce scénario).
3. Quantités REPLENISH conformes au calcul Max − stock.
4. Stock de sécurité pris en compte dans l'analyse (SKU-005 proche du SS).
5. Pipeline complet CC_LIST → CC_COUNT → CC_RECON → REPLENISH → COMPLIANCE_M3.

## Résultat attendu

Suggestions de réapprovisionnement conformes Min/Max ; deux SKU remontés vers Max ; conformité M3 verte.

---

**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  
Le « Rôle de mission » décrit votre poste dans la simulation.  
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.  
Ces deux libellés peuvent différer sans contradiction.

*Référence : `docs/phase-b3/01-dual-role-standard.md` § 5*
