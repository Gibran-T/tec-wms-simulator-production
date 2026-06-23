---
title: "TEC.WMS — Guide de suivi des cohortes"
author: "Collège de la Concorde"
date: "juin 2026"
lang: fr-CA
---

<style>
@media print {
  @page {
    size: A4;
    margin: 2.5cm;
  }
}
.page-break {
  page-break-after: always;
  break-after: page;
}
.cover-page {
  text-align: center;
  padding-top: 6cm;
  min-height: 24cm;
}
.cover-page .brand {
  font-size: 2.4em;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 1.2em;
}
.cover-page .title-block h1 {
  font-size: 1.6em;
  font-weight: 600;
  line-height: 1.4;
  margin: 0.3em 0;
  border: none;
}
.cover-page .subtitle-block {
  margin-top: 4cm;
  font-size: 1.1em;
  line-height: 1.6;
  color: #333;
}
.cover-page .meta {
  margin-top: 3cm;
  font-size: 0.95em;
  color: #555;
}
</style>

<div class="cover-page">

<p class="brand">TEC.WMS</p>

<div class="title-block">

# Guide de suivi des cohortes

# Programme TEC.LOG — Gestion intégrée des stocks

# et performance logistique

</div>

<div class="subtitle-block">

**Collège de la Concorde**  
Simulateur pédagogique ERP/WMS · Montréal

</div>

<div class="meta">

Parcours M1–M5 · 30 heures · 17 scénarios (SCN-001 → SCN-017)  
Version juin 2026 · Document institutionnel — direction, enseignants, coordination pédagogique

</div>

</div>

<div class="page-break"></div>

# Table des matières

1. [Vision du suivi pédagogique](#1-vision-du-suivi-pédagogique)
2. [Dashboard enseignant](#2-dashboard-enseignant)
3. [Checkpoints M2 à M5](#3-checkpoints-m2-à-m5)
4. [Progression des étudiants](#4-progression-des-étudiants)
5. [Validation pédagogique](#5-validation-pédagogique)
6. [Silver Premium readiness](#6-silver-premium-readiness)
7. [Gold Premium readiness](#7-gold-premium-readiness)
8. [Gestion des cohortes](#8-gestion-des-cohortes)
9. [Historique et traçabilité](#9-historique-et-traçabilité)
10. [Gouvernance pédagogique](#10-gouvernance-pédagogique)
11. [Intervention et accompagnement des étudiants](#11-intervention-et-accompagnement-des-étudiants)
12. [Bonnes pratiques pour les futures cohortes](#12-bonnes-pratiques-pour-les-futures-cohortes)

<div class="page-break"></div>

# 1. Vision du suivi pédagogique

## 1.1 Mission du suivi de cohorte

Le **Guide de suivi des cohortes TEC.WMS** définit comment les responsables pédagogiques, les enseignants et les coordonnateurs de programme **observent, interprètent et agissent** sur la progression des étudiantes et étudiants inscrits au programme **TEC.LOG — Gestion intégrée des stocks et performance logistique**.

Le suivi repose sur deux piliers complémentaires de la plateforme **Mini-WMS Concorde** :

| Pilier | Rôle institutionnel |
|--------|----------------------|
| **Tableau de bord enseignant** | Vue consolidée de la cohorte : activité, scores, validations en attente, certifications |
| **Système de progression par checkpoints** | Suivi structuré de la réussite modulaire M2–M5, aligné sur les scénarios officiels |

> **Principe directeur** — Les données de suivi **éclairent les décisions pédagogiques** et la **gestion de cohorte**. Elles ne remplacent ni le jugement professionnel de l'enseignant, ni le processus institutionnel de délivrance des credentials officiels.

## 1.2 Public et autorité

| Public | Usage du guide |
|--------|----------------|
| **Directeurs et directrices de programme** | Pilotage global, calendrier certification, gouvernance des seuils |
| **Enseignants** | Supervision quotidienne, validation M3, interventions ciblées |
| **Coordonnateurs pédagogiques** | Consolidation roster, préparation des remises de certificats |

**Documents de référence complémentaires :**

| Document | Contenu |
|----------|---------|
| Guide officiel du programme TEC.LOG | Architecture modulaire, résultats d'apprentissage, modèle de certification |
| Guide Enseignant Officiel TEC.WMS | Workflows séance, méthodologie BRIDGE, validation M3 |
| Manuel officiel de certification TEC.WMS | Exigences Silver Premium et Gold Premium, registre institutionnel |

En cas de divergence sur les **seuils de certification**, le **Manuel officiel de certification** prévaut. En cas de divergence sur la **progression modulaire M2–M5**, la **Constitution pédagogique TEC.WMS** et le présent guide prévalent.

## 1.3 Trois registres de progression (ne pas confondre)

Le simulateur maintient **trois registres distincts** que le responsable de suivi doit distinguer :

| Registre | Périmètre | Indicateur principal | Usage enseignant |
|----------|-----------|---------------------|------------------|
| **Progression de session** | Run en cours | Pourcentage d'étapes complétées dans Mission Control | Supervision en direct |
| **Checkpoints modules (M2–M5)** | Réussite modulaire | Module réussi, pourcentage SCN, validation M3 | Déblocage inter-modules |
| **Certification Silver / Gold Premium** | Éligibilité credential | États LOCKED → IN_PROGRESS → ELIGIBLE → AWARDED | Préparation remise certificats |

Un étudiant peut afficher une **session à 90 %** sans être **éligible Silver** si le quiz M1 ou un scénario M1 reste incomplet. De même, un module M2 peut être **partiellement complété** (66 %) sans être **marqué réussi**.

## 1.4 Finalité institutionnelle

Le suivi de cohorte vise à :

1. **Anticiper** les retards avant les séances critiques (M4, M5, certification Gold).
2. **Identifier** les étudiantes et étudiants nécessitant un accompagnement ciblé.
3. **Documenter** les validations pédagogiques humaines (Module 3).
4. **Préparer** les dossiers d'éligibilité Silver Premium et Gold Premium pour le processus institutionnel de délivrance.
5. **Assurer l'équité** — mêmes seuils, mêmes règles, pour toute la cohorte.

<div class="page-break"></div>

# 2. Dashboard enseignant

## 2.1 Accès et périmètre

Le **Tableau de bord enseignant** est l'espace de travail réservé aux comptes instructeurs sur TEC.WMS. Il centralise les indicateurs nécessaires au **pilotage d'une cohorte en formation**.

**Accès :** connexion avec compte enseignant institutionnel → espace enseignant.

## 2.2 Vue d'ensemble — indicateurs clés

Le tableau de bord présente, en un coup d'œil :

| Carte / indicateur | Signification pédagogique |
|--------------------|---------------------------|
| **Scénarios** | Catalogue des 17 missions opérationnelles disponibles |
| **Cohortes** | Groupes d'étudiants constitués pour la session |
| **Devoirs assignés** | Scénarios attribués avec échéance ou cible cohorte |
| **Simulations actives (évaluation)** | Runs en cours en mode Évaluation — à superviser |

Des **moyennes par module** (M1 à M5) et le **nombre de réussites au seuil** permettent d'évaluer la santé globale de la cohorte avant chaque séance.

## 2.3 Outils de supervision intégrés

| Outil | Fonction institutionnelle |
|-------|---------------------------|
| **Moniteur de simulation** | Suivi en direct des exécutions : étudiant, scénario, score, statut, étape active |
| **Gestionnaire de scénarios** | Consultation du catalogue, projection en mode démonstration |
| **Gestionnaire de devoirs** | Attribution de scénarios à une cohorte ou à un étudiant |
| **Analytiques** | Distribution des scores, taux de complétion par module |
| **Export des résultats** | Extraction CSV pour consolidation de notes ou archivage |

## 2.4 File d'attente — validation Module 3

Le tableau de bord affiche une section dédiée aux étudiantes et étudiants dont le **Module 3 est réussi** mais dont la **validation pédagogique enseignante** reste en attente. Cette file est un **indicateur critique** avant toute séance M4.

> **Règle opérationnelle** — La file de validation M3 doit être **vide** au minimum vingt-quatre heures avant le début de la séance consacrée au Module 4.

## 2.5 Activité récente et roster

La liste des **exécutions récentes** permet de repérer rapidement :

- Les scores en dessous du seuil module (60/100 ou 70/100).
- Les runs abandonnées ou en cours prolongé.
- Les étudiants actifs vs inactifs sur la période.

Le **registre étudiants** complète cette vue : numéro étudiant, cohorte, statut Silver/Gold, progression par module.

## 2.6 Workflow type — avant, pendant, après séance

| Phase | Actions sur le tableau de bord |
|-------|-------------------------------|
| **T−24 h** | Vérifier roster cohorte · file validation M3 · devoirs assignés pour la séance |
| **Pendant la séance** | Moniteur de simulation ouvert · supervision mode Évaluation |
| **T+48 h** | Analytiques · scores sous seuil · planifier interventions ou devoirs correctifs |

<div class="page-break"></div>

# 3. Checkpoints M2 à M5

## 3.1 Définition institutionnelle

Le **système de progression par checkpoints** est le mécanisme pédagogique qui enregistre la **réussite modulaire** pour les modules **M2, M3, M4 et M5**. Il garantit qu'un module n'est déclaré réussi que lorsque **l'ensemble des scénarios officiels** du module atteint le **seuil de réussite** en mode Évaluation.

> **Distinction importante** — Les « points de contrôle » affichés dans la Fiche Mission et Mission Control sont des **jalons pédagogiques** au sein d'une run. Le système de checkpoints modules est le **registre consolidé** de réussite inter-scénarios.

## 3.2 Périmètre par module

| Module | Scénarios officiels | Seuil | Nombre requis |
|--------|---------------------|-------|---------------|
| **M2** | SCN-006, SCN-007, SCN-008 | 60/100 | 3/3 |
| **M3** | SCN-009, SCN-010, SCN-011 | 70/100 | 3/3 |
| **M4** | SCN-012, SCN-013, SCN-014 | 70/100 | 3/3 |
| **M5** | SCN-015, SCN-016, SCN-017 | 70/100 | 3/3 |

Le **Module 1** relève du registre de **Certification Silver Premium** et non du système de checkpoints M2–M5.

## 3.3 Règles de calcul

| Règle | Description |
|-------|-------------|
| **Complétude intégrale** | Un module est réussi uniquement si tous les SCN officiels atteignent le seuil |
| **Dernière exécution prévaut** | Pour chaque SCN, seule la dernière run d'évaluation complétée détermine le crédit |
| **Exclusion du mode démo** | Les exécutions en mode démonstration ne comptent pas |
| **Progression partielle visible** | Le pourcentage de complétion reflète le nombre de SCN crédités (ex. 2/3 = 66 %) |
| **Indépendance certification** | Les moteurs Silver et Gold lisent directement les runs et quiz — pas le seul indicateur « module réussi » |

## 3.4 Champs de suivi enseignant

Pour chaque module M2–M5, le responsable de suivi consulte :

| Indicateur | Interprétation |
|------------|----------------|
| **Module réussi** | Tous les SCN du module au seuil |
| **Pourcentage de progression** | SCN crédités / SCN requis |
| **Scénarios complétés** | Liste des SCN au seuil |
| **Meilleur score** | Score maximal enregistré sur le module |
| **Validation enseignante (M3)** | Statut et date — condition d'accès M4 |
| **Date de première réussite** | Horodatage de complétion modulaire |

## 3.5 Déclencheurs de mise à jour

Le registre de checkpoints se met à jour automatiquement lorsque :

- Un étudiant **termine une run** et consulte son rapport de performance.
- L'enseignant **valide le Module 3** pour un étudiant.
- Une **réconciliation pédagogique** est demandée par la coordination (cohorte en cours de consolidation).

<div class="page-break"></div>

# 4. Progression des étudiants

## 4.1 Parcours type

```
Inscription → M1 (cours + quiz + simulation) → Éligibilité Silver Premium
     ↓
M2 (débloqué si M1 réussi) → M3 → Validation enseignante M3
     ↓
M4 → M5 (quiz M5) → Éligibilité Gold Premium → Certification Gold
```

## 4.2 Conditions de déblocage inter-modules

| Transition | Condition |
|------------|-----------|
| Accès M2 et suivants | Module M1 marqué réussi |
| Accès M4 | Module M3 réussi **et** validation enseignante M3 accordée |
| Lancement scénario | Quiz du module ≥ 60 % (recommandation pédagogique ; obligatoire M1 et M5 pour certification) |

## 4.3 Lecture de la progression — cas types

| Situation observée | Interprétation | Action recommandée |
|--------------------|----------------|-------------------|
| M2 à 33 % (1/3 SCN) | Progression en cours | Encourager complétion SCN-007 et SCN-008 |
| M3 à 100 % SCN, M4 bloqué | Validation enseignante absente | Procéder à la validation M3 (§5) |
| Silver ELIGIBLE, M1 non marqué réussi | Registres indépendants — normal | Prioriser page Certifications pour Silver |
| Score M4 à 75/100 | Plafond pédagogique M4 — **réussite** | Ne pas demander de resoumission pour « perfection » |
| Gold IN_PROGRESS après Séance 9 | SCN M5 ou quiz M5 incomplets | Planifier Séance 10 et devoirs SCN-015→017 |

## 4.4 Suivi par séance (calendrier 30 h)

| Séance | Module | Points de suivi dashboard |
|--------|--------|---------------------------|
| 1–2 | M1 | Quiz M1 · SCN-001→005 · préparation Silver |
| 3–4 | M2 | Checkpoints M2 · moyennes module |
| 5–6 | M3 | Checkpoints M3 · file validation |
| 7 | Consolidation | Page Certifications Silver · numéros étudiants |
| 8 | Consolidation M3 | Validation M3 finalisée |
| 9 | M4 | SCN-012→014 · scores ≥ 70 |
| 10 | M5 | SCN-015→017 · quiz M5 · préparation Gold |

## 4.5 Distinction session vs certification vs module

| Mesure | Question à laquelle elle répond |
|--------|--------------------------------|
| **Progression de session (%)** | Où en est l'étudiant **dans la run actuelle** ? |
| **Checkpoint module (%)** | Combien de SCN officiels sont **crédités** pour ce module ? |
| **Certification (%)** | L'étudiant remplit-il **toutes les portes** Silver ou Gold ? |

<div class="page-break"></div>

# 5. Validation pédagogique

## 5.1 Contexte — Module 3

Le Module 3 (**Contrôle des stocks et réapprovisionnement**) introduit des ajustements d'inventaire et des décisions de réapprovisionnement qui exigent une **validation humaine** de l'enseignant avant l'accès au Module 4. C'est la **seule validation enseignante obligatoire** enregistrée dans le système de progression.

## 5.2 Prérequis de validation

| Condition | Vérification |
|-----------|--------------|
| Module 3 réussi | Tous SCN-009, SCN-010, SCN-011 ≥ 70/100 en Évaluation |
| Conformité M3 | Étape de conformité validée sur chaque run |
| Rapports consultés | Justifications d'écarts et qualité des ajustements revus |

## 5.3 Procédure

1. **Connexion** au tableau de bord enseignant.
2. **Identification** de l'étudiant dans la file « M3 en attente de validation ».
3. **Revue pédagogique** des rapports de performance SCN-009 à SCN-011.
4. **Validation** — enregistrement de la décision enseignante avec horodatage.
5. **Effet** — déblocage du Module 4 en mode Évaluation ; recalcul du checkpoint M3.

## 5.4 Critères de revue (checklist)

| Critère | Attendu |
|---------|---------|
| SCN-009 | Cycle de comptage complet, écarts identifiés |
| SCN-010 | Variance justifiée si écart significatif, ajustement MI07 posté |
| SCN-011 | Réapprovisionnement calculé (Q = Max − stock), conformité verte |
| Intégrité | Aucun bloqueur non résolu (transactions en suspens, comptage ouvert) |

## 5.5 Calendrier institutionnel

| Moment | Exigence |
|--------|----------|
| Fin de la séance M3 | Valider les étudiants ayant complété SCN-011 |
| T−24 h avant séance M4 | File de validation **vide** |
| Pendant séance M4 | Ne pas lancer SCN-012 tant que M3 non validé |

## 5.6 Limites de la validation M3

- La validation M3 **ne remplace pas** la réussite des scénarios M3.
- La validation M3 **n'est pas** une condition Gold Premium (Gold évalue l'intégralité du parcours indépendamment).
- La validation ne peut être accordée que si le Module 3 est **déjà réussi** au sens des checkpoints.

<div class="page-break"></div>

# 6. Silver Premium readiness

## 6.1 Intitulé et périmètre

| Attribut | Valeur |
|----------|--------|
| **Titre officiel** | Certification Silver Premium TEC.WMS |
| **Sous-titre** | Opérations fondamentales ERP/WMS · Module 1 |
| **Périmètre** | Module 1 uniquement — SCN-001 à SCN-005 |

## 6.2 Les quatre portes Silver

Toutes les conditions suivantes doivent être **simultanément satisfaites** :

| Porte | Exigence |
|-------|----------|
| **P1 — Quiz M1** | Meilleure tentative ≥ 60 % |
| **P2 — Scénarios M1** | SCN-001 à SCN-005 chacun ≥ 60/100 (mode Évaluation) |
| **P3 — Conformité M1** | Étape de conformité validée sur chaque SCN M1 |
| **P4 — Intégrité** | Aucun bloqueur non résolu |

## 6.3 Suivi enseignant — indicateurs dashboard

| Indicateur | Où consulter | Seuil de readiness |
|------------|--------------|-------------------|
| Gates Silver (4/4) | Page Certifications étudiant · roster enseignant | 4 portes vertes |
| Quiz M1 | Analytiques / profil étudiant | ≥ 60 % |
| SCN M1 individuels | Moniteur · progression M1 | Chaque SCN ≥ 60/100 |
| Numéro étudiant | Registre étudiants | Renseigné pour allocation credential |
| État certification | LOCKED → IN_PROGRESS → ELIGIBLE → AWARDED | ELIGIBLE minimum avant émission |

## 6.4 Attribution et délivrance

- L'**éligibilité Silver** est calculée automatiquement par le simulateur lorsque les quatre portes sont satisfaites.
- L'**attribution AWARDED** dans le simulateur enregistre l'indicateur persistant Silver Premium.
- Le **credential officiel** (PDF signé, identifiant `TECWMS-SIL-AAAA-NNN`, QR de vérification) relève du **processus institutionnel** du Collège de la Concorde — distinct de l'éligibilité simulateur.

> **Principe fondateur** — L'éligibilité dans le simulateur n'est pas une preuve d'émission. Seul un identifiant actif dans le **registre institutionnel** constitue une certification vérifiable.

## 6.5 Exclusions — ce qui ne compte pas pour Silver

| Élément | Compte pour Silver ? |
|---------|---------------------|
| Exécutions mode démo | Non |
| Diapositives complétées | Non (non tracées) |
| Quiz M2–M5 | Non |
| Réussite module M1 seule (sans les 5 SCN) | Non |

## 6.6 Checklist readiness Silver — fin Séance 7

| ☐ | Critère |
|---|---------|
| ☐ | 4/4 portes Silver vertes pour chaque étudiant visé |
| ☐ | Numéro étudiant renseigné dans le roster |
| ☐ | Identité vérifiée pour allocation séquentielle |
| ☐ | Dossier transmis à la coordination pour approbation institutionnelle |

<div class="page-break"></div>

# 7. Gold Premium readiness

## 7.1 Intitulé et prérequis absolu

| Attribut | Valeur |
|----------|--------|
| **Titre officiel** | Certification Gold Premium TEC.WMS |
| **Sous-titre** | Parcours intégré M1–M5 · Opérations logistiques |
| **Prérequis absolu** | Certification Silver Premium accordée |

Sans Silver Premium, Gold reste à l'état **LOCKED** — les portes Gold ne sont pas évaluées.

## 7.2 Machine d'états Gold

| État | Signification |
|------|---------------|
| **LOCKED** | Silver non accordé |
| **IN_PROGRESS** | Silver OK — portes Gold partiellement complétées |
| **ELIGIBLE** | Toutes les portes Gold satisfaites dans le simulateur |
| **AWARDED** | Gold Premium attribué — prêt pour émission institutionnelle |

## 7.3 Grille de readiness — 18 portes (synthèse)

| # | Porte | Critère |
|---|-------|---------|
| 1 | Prérequis Silver | Silver Premium accordé |
| 2 | Quiz M5 | Meilleure tentative ≥ 60 % |
| 3–5 | SCN-006 → SCN-008 | Chaque SCN M2 ≥ 60/100 |
| 6–8 | SCN-009 → SCN-011 | Chaque SCN M3 ≥ 70/100 |
| 9–11 | SCN-012 → SCN-014 | Chaque SCN M4 ≥ 70/100 |
| 12–14 | SCN-015 → SCN-017 | Chaque SCN M5 ≥ 70/100 |
| 15 | Conformité M2–M5 | Étapes COMPLIANCE validées |
| 16 | Intégrité parcours | Aucun bloqueur non résolu |
| 17 | Validateurs modules | Exigences profondes M3–M5 satisfaites |
| 18a | SCN-016 — ordre variance/KPI | Ajustement variance **avant** analyse KPI |
| 18b | SCN-017 — capstone | Score ≥ 70 · décision liée au KPI · ≥ 2 KPI numériques · horizon 90–180 j |

## 7.4 Suivi enseignant par séance

| Séance | Contribution Gold | Indicateur dashboard |
|--------|-------------------|-------------------|
| 3–4 | SCN M2 | Checkpoints M2 complets |
| 5–6 | SCN M3 + validation | Checkpoints M3 + validation accordée |
| 9 | SCN M4 | Checkpoints M4 · scores ≥ 70 |
| 10 | SCN M5 + quiz M5 | 18/18 portes · quiz M5 ≥ 60 % |

## 7.5 Points d'attention capstone (Séance 10)

### SCN-016 — Variance avant KPI

L'étudiant doit compléter l'**ajustement de variance** avant l'**analyse KPI**. Toute inversion de séquence entraîne l'échec de la porte correspondante.

### SCN-017 — Décision stratégique

Exigences de readiness :

- Score global ≥ 70/100.
- Au moins **deux KPI numériques** dans la décision rédigée.
- Horizon temporel **90 à 180 jours**.
- Trade-off explicite dans la justification.
- Instantané KPI complété **avant** la décision finale.

## 7.6 Délivrance institutionnelle Gold

Comme pour Silver, l'**éligibilité ELIGIBLE** dans le simulateur précède l'**émission officielle** :

1. Confirmation Silver ACTIVE au registre institutionnel.
2. Vérification 18/18 portes Gold sur la page Certifications.
3. Décision institutionnelle et approbation programme.
4. Allocation identifiant `TECWMS-GOLD-AAAA-NNN`.
5. Génération PDF officiel et inscription registre statut ACTIVE.

<div class="page-break"></div>

# 8. Gestion des cohortes

## 8.1 Constitution d'une cohorte

Une **cohorte** est un groupe nommé d'étudiantes et étudiants inscrits à une même session du programme TEC.LOG. La gestion des cohortes permet :

- L'**assignation groupée** de devoirs et scénarios.
- Le **suivi consolidé** des progressions et certifications.
- La **préparation du manifest** pour la délivrance des credentials.

## 8.2 Création et paramétrage

| Étape | Action |
|-------|--------|
| 1 | Créer la cohorte avec un nom institutionnel (ex. « Groupe A — Automne 2026 ») |
| 2 | Inscrire les étudiantes et étudiants au groupe via le registre |
| 3 | Vérifier les numéros étudiants pour l'allocation des certificats |
| 4 | Assigner les scénarios de la séance en cours à la cohorte entière ou à des sous-groupes |

## 8.3 Assignation de devoirs

Les devoirs peuvent être ciblés :

| Cible | Usage pédagogique |
|-------|-------------------|
| **Cohorte entière** | Devoir de séance standard (ex. SCN-012 pour tous) |
| **Étudiant individuel** | Rattrapage, consolidation M3, préparation capstone |

Le tableau de bord indique le **nombre de devoirs actifs** — un indicateur de charge pédagogique planifiée.

## 8.4 Roster et manifest certification

Le **registre étudiants** consolide, par cohorte :

| Champ | Usage |
|-------|-------|
| Nom et identifiant | Vérification identité credential |
| Numéro étudiant | Séquence d'allocation SIL/GOLD |
| Statut Silver / Gold | Readiness certification |
| Progression modules | Checkpoints M1–M5 |
| Cohorte d'appartenance | Manifest et statistiques |

## 8.5 Rôles dans la gestion de cohorte

| Rôle | Responsabilités |
|------|-----------------|
| **Enseignant titulaire** | Supervision quotidienne, validation M3, assignation devoirs |
| **Coordonnateur TEC.LOG** | Consolidation roster, manifest certification, liaison direction |
| **Directrice de programme** | Approbation émission credentials (niveau B3) |

<div class="page-break"></div>

# 9. Historique et traçabilité

## 9.1 Données tracées par le simulateur

| Type de donnée | Contenu tracé | Rétention pédagogique |
|----------------|---------------|----------------------|
| **Exécutions de scénarios** | Score, statut, mode (démo/évaluation), horodatage | Historique consultable enseignant |
| **Tentatives quiz** | Score par tentative, meilleur score retenu | M1 et M5 — portes certification |
| **Progression modules** | Réussite, pourcentage, SCN crédités, validation M3 | Checkpoints M2–M5 |
| **Certifications** | États et dates d'attribution Silver/Gold | Profil étudiant |
| **Validations enseignantes** | Décision M3, date, enseignant | Traçabilité déblocage M4 |

## 9.2 Rapport de performance (Run Report)

Chaque exécution complétée génère un **rapport de performance** comprenant :

- Score par étape et score total.
- Analyse des pénalités.
- Recommandations personnalisées.
- État de conformité et bloqueurs éventuels.

Ce rapport est la **pièce centrale** de la revue pédagogique (validation M3, accompagnement post-séance).

## 9.3 Principe « dernière exécution prévaut »

Pour chaque scénario, seule la **dernière run d'évaluation complétée** détermine le crédit SCN et l'éligibilité certification. Une run ultérieure en échec **révoque** le crédit précédent — phénomène à surveiller lors du suivi de cohorte.

## 9.4 Export et archivage institutionnel

| Artefact | Usage |
|----------|-------|
| **Export CSV des résultats** | Consolidation notes, archivage session |
| **Manifest cohorte** | Liste étudiants + statuts certification pour émission |
| **Registre institutionnel** | Identifiants credentials ACTIVE — source de vérité officielle |

## 9.5 Ce qui n'est pas tracé

| Élément | Implication enseignant |
|---------|------------------------|
| Diapositives (Slides) | Complétion = responsabilité pédagogique, non technique |
| Temps passé en mode démo | Non comptabilisé certification |
| Consultation Fiche Mission | Recommandée — non enregistrée comme gate |

<div class="page-break"></div>

# 10. Gouvernance pédagogique

## 10.1 Seuils officiels (GOV-T01)

Les seuils de réussite sont **canoniques** et s'appliquent uniformément à toute cohorte :

| Règle | Valeur | Application |
|-------|--------|-------------|
| Quiz M1 / M5 | ≥ 60 % | Certification Silver / Gold |
| Scénarios M1, M2 | ≥ 60/100 | Réussite scénario et module |
| Scénarios M3, M4, M5 | ≥ 70/100 | Réussite scénario et module |
| Capstone SCN-017 | ≥ 70/100 | Porte Gold spécifique |

Toute modification de seuil requiert une **décision de gouvernance documentée** par la direction de programme — jamais un ajustement individuel en classe.

## 10.2 Architecture à trois couches — certification

| Couche | Rôle | Autorité |
|--------|------|----------|
| **Éligibilité simulateur** | Calcul des portes quiz + SCN + conformité | Plateforme TEC.WMS |
| **Aperçu pédagogique** | Prévisualisation certificat (filigrane APERÇU) | Interface étudiante |
| **Credential officiel** | PDF signé, numéro, QR, vérification publique | Collège de la Concorde |

## 10.3 Autorité des documents

| Sujet | Document faisant autorité |
|-------|---------------------------|
| Seuils et portes certification | Manuel officiel de certification |
| Progression modulaire M2–M5 | Constitution pédagogique · présent guide |
| Déroulement séance et méthodologie | Guide Enseignant Officiel |
| Architecture programme | Guide officiel du programme |

## 10.4 Politique mode démo vs évaluation

| Mode | Comptabilisation | Usage en classe |
|------|------------------|-----------------|
| **Démonstration** | Exclu de certification et checkpoints | Projection enseignant, exploration |
| **Évaluation** | Comptabilisé intégralement | Travaux pratiques notés, devoirs, certification |

Le suivi de cohorte doit **filtrer mentalement** les runs démo lors de l'interprétation des scores agrégés.

## 10.5 Décisions de cohorte documentées

Les décisions suivantes doivent être **traceables** au niveau institutionnel :

- Approbation émission Silver / Gold (niveau B3).
- Validation M3 par enseignant (horodatage automatique).
- Révocation ou réémission de credential (politique manuel certification).
- Exception pédagogique — **non prévue** pour les seuils ; toute dérogation relève de la gouvernance programme.

<div class="page-break"></div>

# 11. Intervention et accompagnement des étudiants

## 11.1 Principes d'intervention

| Principe | Application |
|----------|-------------|
| **Données → dialogue** | Le dashboard oriente la conversation, ne remplace pas le feedback |
| **Ciblage précoce** | Intervenir dès SCN sous seuil, pas seulement en fin de module |
| **Respect du mode Évaluation** | Ne pas révéler les réponses KPI en évaluation |
| **Documentation** | Run Report comme support de debrief structuré |

## 11.2 Signaux d'alerte dashboard

| Signal | Niveau | Action |
|--------|--------|--------|
| File validation M3 non vide à J−1 M4 | Critique | Valider ou planifier rattrapage M3 |
| SCN récurrent sous seuil (même étudiant) | Élevé | Debrief Run Report · réassignation ciblée |
| Quiz M1 < 60 % en Séance 2 | Élevé | Bloquer attente Silver · session renforcement |
| Gold LOCKED en Séance 10 | Critique | Vérifier Silver · parcours M1 incomplet |
| Run en cours > 2 h | Modéré | Vérifier blocage technique ou abandon |

## 11.3 Interventions par module — synthèse

| Module | Problème fréquent | Piste d'accompagnement |
|--------|-------------------|------------------------|
| M1 | GR non postée, stock négatif | Rappel chaîne PO→GR→SO · moniteur transactions |
| M2 | Violation FIFO | Diapositives M2 · règle premier entré / premier sorti |
| M3 | Écart non justifié, ADJ oublié | Pipeline CC → variance → ADJ → réappro |
| M4 | Moniteur vide perçu comme erreur | Expliquer nature analytique M4 |
| M4 | Score plafonné 75/100 | Rassurer — réussite pédagogique |
| M5 | KPI avant variance SCN-016 | Démonstration séquence correcte |
| M5 | Décision SCN-017 générique | Exiger KPI numériques + horizon 90–180 j |

## 11.4 Accompagnement certification

| Situation | Accompagnement |
|-----------|----------------|
| Silver IN_PROGRESS | Identifier porte manquante sur page Certifications |
| Gold ELIGIBLE non AWARDED | Coordination avec direction — décision émission |
| Numéro étudiant absent | Compléter roster avant allocation credential |
| Certificat PDF non visible | Rappeler distinction éligibilité / émission officielle |

## 11.5 Devoir correctif et rattrapage

Le gestionnaire de devoirs permet d'**assigner un scénario spécifique** à un étudiant en difficulté, avec suivi via le moniteur de simulation. Les rattrapages M3 doivent être **finalisés et validés** avant toute reprise M4.

<div class="page-break"></div>

# 12. Bonnes pratiques pour les futures cohortes

## 12.1 Préparation pré-session

| ☐ | Action |
|---|--------|
| ☐ | Cohorte créée et roster complet avec numéros étudiants |
| ☐ | Comptes enseignants et étudiants vérifiés |
| ☐ | Calendrier 10 séances aligné modules M1–M5 |
| ☐ | Documents étudiants distribués (guides M1–M3, M4–M5) |
| ☐ | Constitution pédagogique accessible à l'équipe |

## 12.2 Rituel hebdomadaire de suivi

| Fréquence | Rituel |
|-----------|--------|
| **Hebdomadaire** | Consultation analytiques · moyennes module · étudiants inactifs |
| **Avant chaque séance** | File M3 · devoirs assignés · SCN cible de la séance |
| **Après chaque séance** | Export CSV optionnel · identification sous-seuil |
| **Séance 7** | Audit Silver readiness (4/4 portes) |
| **Séance 10** | Audit Gold readiness (18/18 portes) |

## 12.3 Checklist clôture de cohorte

| ☐ | Critère |
|---|---------|
| ☐ | Toutes validations M3 enregistrées |
| ☐ | Silver : éligibilité vérifiée · credentials émis au registre |
| ☐ | Gold : 18/18 portes · credentials émis |
| ☐ | Manifest cohorte archivé |
| ☐ | Debrief pédagogique équipe enseignante |
| ☐ | Retour d'expérience transmis à la coordination programme |

## 12.4 Indicateurs de succès cohorte

| Indicateur | Cible institutionnelle |
|------------|------------------------|
| Taux complétion M1 (5 SCN) | 100 % avant Séance 7 |
| Taux validation M3 avant M4 | 100 % |
| Taux éligibilité Silver | Aligné objectifs programme |
| Taux éligibilité Gold | Aligné objectifs programme |
| Délai moyen validation M3 | < 48 h après SCN-011 |

## 12.5 Amélioration continue

Chaque cohorte alimente la **mémoire institutionnelle** du programme :

- Documenter les blocages récurrents (vocabulaire M4, séquence M5).
- Partager les Run Reports anonymisés en équipe pédagogique.
- Ajuster le timing des séances selon la progression observée.
- Maintenir l'alignement terminologique avec les guides officiels (programme, enseignant, certification).

---

**Document institutionnel** — Collège de la Concorde · Programme TEC.LOG · Simulateur TEC.WMS  
**Version** 1.0 · juin 2026 · Classification : usage interne pédagogique et direction de programme
