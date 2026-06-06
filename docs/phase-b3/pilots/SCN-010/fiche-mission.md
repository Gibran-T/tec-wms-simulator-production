# FICHE DE MISSION OPÉRATIONNELLE — SCN-010

**Référence:** CL-SCN-010  
**Code scénario:** SCN-010  
**Module:** M3 — Gestion inventaire avancée  
**Seuil évaluation:** 70/100  
**Difficulté:** difficile  
**Statut:** ACTIF

*Concorde Logistics — Institutional Standard · QMS v2.0*

---

## Contexte opérationnel

SKU-006 : système 380 u., physique 352 u. Écart −28. Seuil d'ajustement sans escalade documentée : **20 unités**.

## Objectif de la mission

Analyser un écart significatif (−28) et produire un ajustement justifié.

## Rôles

| Type | Libellé |
|------|---------|
| **Rôle de mission** | Gestionnaire Inventaire |
| **Compétence évaluée** | Gestionnaire inventaire |
| **Compétence primaire** | Gestion des écarts |
| **Niveau Bloom** | Analyser |
| **Progression** | Avancé M3 |

## Spécifications techniques

| SKU | Quantité système | Emplacement |
|-----|------------------|-------------|
| SKU-006 | 380 | B-02-R1-L1 |

## Actions à réaliser (étudiant)

1. **CC_LIST** — générer / consulter la liste de comptage.
2. **CC_COUNT** — saisir la quantité physique réelle (352).
3. **CC_RECON** — documenter la justification de l'écart −28 (> seuil 20).
4. **REPLENISH** — *optionnel* : non requis pour la clôture de SCN-010. Ne l'exécutez que si le flux M3 l'active après résolution de l'écart ; ne passez jamais REPLENISH ou COMPLIANCE_M3 sans avoir résolu la variance.
5. **COMPLIANCE_M3** — clôture conformité module.

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

1. Écart > seuil (20 u.) identifié et documenté.
2. Justification métier fournie avant ADJ.
3. Ajustement conforme (MI07).

## Résultat attendu

Variance −28 justifiée et ajustée, conformité verte.

> **Contexte M3 :** SCN-009 (écart −3) exige réconciliation **et** ajustement, sans justification écrite longue. **SCN-010** est le premier scénario où la **justification formelle** est obligatoire (écart > seuil 20 u.). Voir `06-superviseur-runbook-addendum/SCN-009-adj-policy.md`.

---

**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  
Le « Rôle de mission » décrit votre poste dans la simulation.  
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.  
Ces deux libellés peuvent différer sans contradiction.

*Référence : `docs/phase-b3/01-dual-role-standard.md` § 5*
