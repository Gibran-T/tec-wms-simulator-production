# FICHE DE MISSION OPÉRATIONNELLE — SCN-009

**Référence:** CL-SCN-009  
**Code scénario:** SCN-009  
**Module:** M3 — Gestion inventaire avancée  
**Seuil évaluation:** 70/100  
**Difficulté:** facile  
**Statut:** ACTIF

*Concorde Logistics — Institutional Standard · QMS v2.0*

---

## Politique institutionnelle M3 (G-C05 — adoptée)

| Élément | Exigence |
|---------|----------|
| **CC_RECON** | **Obligatoire** — documenter l'écart −3 sur SKU-001 |
| **Ajustement stock (MI07)** | **Obligatoire** — poster l'ajustement **−3** via CC_RECON pour aligner le système sur le physique |
| **Justification écrite** | **Optionnelle** lorsque \|écart\| < **5 unités** (seuil moteur M3) |
| **Référence** | `06-superviseur-runbook-addendum/SCN-009-adj-policy.md` |

> SCN-010 est le **premier scénario** exigeant une **justification formelle** pour un écart significatif (seuil pédagogique 20 u.).

---

## Contexte opérationnel

Stock système : **SKU-001 = 100 u.** (B-01-R1-L1), **SKU-003 = 80 u.** (B-01-R1-L2). Le comptage physique révélera un écart de **−3 unités** sur SKU-001 (physique attendu : 97 u.). SKU-003 est conforme (80 = 80).

## Objectif de la mission

Réaliser un inventaire cyclique simple, identifier les écarts système/physique, réconcilier et aligner le stock système.

## Rôles

| Type | Libellé |
|------|---------|
| **Rôle de mission** | Auditeur Inventaire |
| **Compétence évaluée** | Auditeur inventaire |
| **Compétence primaire** | Précision inventaire |
| **Niveau Bloom** | Appliquer |
| **Progression** | Avancé M3 |

## Spécifications techniques

| SKU | Quantité système | Emplacement | Quantité physique attendue |
|-----|------------------|-------------|----------------------------|
| SKU-001 | 100 | B-01-R1-L1 | 97 (−3) |
| SKU-003 | 80 | B-01-R1-L2 | 80 (conforme) |

## Actions à réaliser (étudiant)

1. **CC_LIST** — générer / consulter la liste de comptage cyclique (MI01).
2. **CC_COUNT** — saisir les quantités physiques réelles (SKU-001 : 97 u. ; SKU-003 : 80 u.).
3. **CC_RECON** — **obligatoire** : documenter l'écart −3 sur SKU-001, confirmer SKU-003 conforme, et **poster l'ajustement −3** (MI07) pour aligner le stock système.
4. **REPLENISH** — *si besoin* : exécuter uniquement si le flux M3 l'active après réconciliation.
5. **COMPLIANCE_M3** — clôture conformité module.

> **Note M3 :** en Module 3, l'ajustement stock est exécuté **dans l'étape CC_RECON** (pas d'étape ADJ séparée). Une justification écrite détaillée n'est **pas requise** pour un écart de −3 (< 5 u.).

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

1. Liste de comptage complète (SKU-001 et SKU-003).
2. Saisie physique exacte — écart −3 identifié sur SKU-001.
3. Réconciliation CC_RECON documentée **et** ajustement −3 posté.
4. SKU-003 validé conforme sans ajustement.

## Résultat attendu

Écart −3 identifié, réconcilié et corrigé (stock système = 97 u.) ; SKU-003 conforme ; conformité M3 verte.

---

**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  
Le « Rôle de mission » décrit votre poste dans la simulation.  
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.  
Ces deux libellés peuvent différer sans contradiction.

*Référence : `docs/phase-b3/01-dual-role-standard.md` § 5*
