---
title: "TEC.WMS — Guide Enseignant Officiel"
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
.checklist-page table {
  width: 100%;
  border-collapse: collapse;
}
.checklist-page td {
  padding: 0.6em 0.4em;
  border-bottom: 1px solid #ddd;
  vertical-align: top;
}
.checklist-page td:first-child {
  width: 2em;
  font-size: 1.2em;
}
</style>

<div class="cover-page">

<p class="brand">TEC.WMS</p>

<div class="title-block">

# Guide Enseignant Officiel

# Programme TEC.LOG — Gestion intégrée des stocks

# et performance logistique

</div>

<div class="subtitle-block">

**Collège de la Concorde**  
Simulateur pédagogique ERP/WMS · Montréal

</div>

<div class="meta">

Parcours M1–M5 · 30 heures · 10 séances · 17 scénarios (SCN-001 → SCN-017)  
Version juin 2026 · Document instructeur — usage institutionnel

</div>

</div>

<div class="page-break"></div>

# Table des matières

1. [Présentation du guide](#1-présentation-du-guide)
2. [Vision du programme TEC.LOG](#2-vision-du-programme-teclog)
3. [Méthodologie pédagogique](#3-méthodologie-pédagogique)
4. [Structure en 10 séances (30 h)](#4-structure-en-10-séances-30-h)
5. [Objectifs par module M1–M5](#5-objectifs-par-module-m1m5)
6. [Flux pédagogique — Diapositives (Slides)](#6-flux-pédagogique--diapositives-slides)
7. [Flux pédagogique — Quiz](#7-flux-pédagogique--quiz)
8. [Flux pédagogique — Scénarios (Simulation)](#8-flux-pédagogique--scénarios-simulation)
9. [Processus de validation enseignant (Module 3)](#9-processus-de-validation-enseignant-module-3)
10. [Certification Silver — processus et critères](#10-certification-silver--processus-et-critères)
11. [Certification Gold — processus et critères](#11-certification-gold--processus-et-critères)
12. [Moteur de checkpoints (Checkpoint Engine)](#12-moteur-de-checkpoints-checkpoint-engine)
13. [Problèmes fréquents des étudiants](#13-problèmes-fréquents-des-étudiants)
14. [Workflow de délivrance des certificats](#14-workflow-de-délivrance-des-certificats)
15. [Annexes — Références et outils enseignant](#15-annexes--références-et-outils-enseignant)

<div class="page-break"></div>

# 1. Présentation du guide

Ce **Guide Enseignant Officiel TEC.WMS** est le document de référence pour les instructeurs du Collège de la Concorde qui dispensent le programme **TEC.LOG — Gestion intégrée des stocks et performance logistique**.

Il couvre l'ensemble du parcours pédagogique sur la plateforme **Mini-WMS Concorde** : vision du programme, méthodologie, calendrier des dix séances, objectifs par module, workflows opérationnels (diapositives, quiz, scénarios), validation enseignant, certifications Silver et Gold, moteur de checkpoints, problèmes fréquents et délivrance institutionnelle des certificats.

**Public visé :** enseignants, coordonnateurs de programme, directeurs de département.

**Prérequis techniques :** compte enseignant sur TEC.WMS, accès au tableau de bord `/teacher`, familiarité de base avec les concepts ERP/WMS.

**Documents complémentaires (étudiants) :**

| Document | Contenu |
|----------|---------|
| Guide étudiant M1–M3 | Préparation scénarios SCN-001 à SCN-011 |
| Guide étudiant M4–M5 | Préparation scénarios SCN-012 à SCN-017 |
| Constitution pédagogique TEC.WMS | Hiérarchie des sources et critères GREEN |

> **Autorité pédagogique.** En cas de divergence entre ce guide et la **Constitution pédagogique TEC.WMS** (PDF institutionnel), la Constitution prévaut. Les **Fiches Mission** (Mission Sheets) sont la vérité opérationnelle pour chaque scénario.

<div class="page-break"></div>

# 2. Vision du programme TEC.LOG

## 2.1 Mission

Former des **gestionnaires logistiques** capables d'**exécuter**, **analyser** et **décider** dans un environnement WMS/ERP simulé — sans dépendance à un ERP commercial en classe.

Le simulateur TEC.WMS reproduit les flux transactionnels industriels (SAP S/4HANA, Odoo) dans un environnement structuré, bilingue (FR/EN), avec évaluation automatisée et conformité système.

## 2.2 Résultats d'apprentissage globaux

À la fin du parcours M1–M5, l'étudiant est capable de :

1. **Exécuter** le cycle logistique complet : PO → GR → Putaway → SO → Picking → GI → Cycle Count → Conformité.
2. **Appliquer** les règles d'entrepôt : zones (RÉCEPTION / STOCKAGE / EXPÉDITION), capacité d'emplacement, FIFO.
3. **Contrôler** les stocks : inventaire cyclique, écarts, ajustements (MI07), réapprovisionnement.
4. **Interpréter** les KPI logistiques : rotation, taux de service, OTIF, lead time, diagnostic stratégique.
5. **Décider** sous contrainte opérationnelle : cycle intégré Peak Week, gestion de variance, capstone stratégique S&OP.

## 2.3 Architecture pédagogique en quatre couches

| Couche | Rôle | Artefact |
|--------|------|----------|
| **Briefing** | Contexte, rôle, compétence visée | Fiche Mission (in-app) |
| **Transmission** | Concepts, terminologie, processus | Diapositives (Slides) |
| **Pratique guidée** | Exécution transactionnelle | Scénarios SCN-001 → SCN-017 |
| **Évaluation** | Quiz, scoring, conformité, certification | Moteur de règles + certifications |

## 2.4 Parcours certification

| Niveau | Intitulé officiel | Périmètre | Seuil |
|--------|-------------------|-----------|-------|
| **Silver Premium** | Certification Silver Premium TEC.WMS | Module 1 — Fondements ERP/WMS | 4 portes M1 |
| **Gold Premium** | Certification Gold Premium TEC.WMS | Parcours intégré M1–M5 | 18 portes |

Les certifications sont **distinctes** de la progression par module (`module_progress`) et des checkpoints pédagogiques M2–M5.

<div class="page-break"></div>

# 3. Méthodologie pédagogique

## 3.1 Modèle BRIDGE

La méthodologie TEC.LOG repose sur le modèle **BRIDGE**, intégré à chaque scénario :

| Lettre | Principe | Application en classe |
|--------|----------|----------------------|
| **B** — Briefing | Rôle + compétence + contexte opérationnel | Fiche Mission lue avant chaque run |
| **R** — Raisonnement documentaire | Preuve avant action | Moniteur de transactions, MB52, Annexe A |
| **I** — Interprétation KPI | Lecture des indicateurs (M4–M5) | KPI Control Tower, OIL Panel B |
| **D** — Décision | Choix tactique ou stratégique | Steps KPI_DIAGNOSTIC, M5_DECISION |
| **G** — Gouvernance conformité | Séquence, moniteur, compliance | Step COMPLIANCE_* final |
| **E** — Évaluation cohérente | Seuils, matrices de preuves | Run Report, scoring automatisé |

## 3.2 Chaîne pédagogique par scénario

Chaque scénario suit la chaîne institutionnelle :

```
Fiche Mission → Contexte opérationnel → Raisonnement attendu → Décision attendue
→ Solution attendue → Conformité (COMPLIANCE)
```

L'enseignant facilite cette chaîne ; le simulateur **ne remplace pas** le raisonnement de l'étudiant (pas de pré-remplissage des réponses en mode Évaluation).

## 3.3 Deux modes de simulation

| Mode | Usage en classe | Scoring | Certification |
|------|-----------------|---------|---------------|
| **Démonstration** | Projection enseignant, exploration libre | Non comptabilisé | Non |
| **Évaluation** | Travaux pratiques, devoirs, examens | Oui — pénalités actives | Oui |

**Règle d'or :** seuls les runs en mode **Évaluation** (`isDemo = false`) comptent pour la certification et la progression officielle.

## 3.4 Progression Bloom

| Module | Niveau Bloom dominant | Verbe d'action |
|--------|----------------------|----------------|
| M1 | Appliquer | Exécuter le flux nominal |
| M2 | Appliquer / Analyser | Ranger, valider capacité, FIFO |
| M3 | Analyser / Évaluer | Justifier écarts, réapprovisionner |
| M4 | Analyser / Évaluer | Interpréter KPI, diagnostiquer |
| M5 | Évaluer / Créer | Décider stratégiquement (capstone) |

## 3.5 Couche Operational Intelligence (OIL)

Pendant chaque run, six panneaux (A–F) guident l'étudiant :

- **A** — Briefing situation
- **B** — Tour de contrôle / KPI Tower
- **C** — Contexte ERP
- **D** — Aide à la décision
- **E** — Compétences visées
- **F** — Points de contrôle (control points)

L'enseignant peut projeter le panneau OIL en mode démonstration pour ancrer le vocabulaire avant le travail pratique.

<div class="page-break"></div>

# 4. Structure en 10 séances (30 h)

Le programme TEC.LOG totalise **30 heures** réparties en **10 séances de 3 heures**. Chaque module couvre **6 heures** (deux séances), sauf la phase de consolidation M1–M3 qui précède les séances M4 et M5.

## 4.1 Calendrier institutionnel

| Séance | Durée | Module | Contenu principal | Livrables étudiants |
|--------|-------|--------|-------------------|---------------------|
| **1** | 3 h | M1 | Slides M1 (1–5) · Quiz M1 · SCN-001, SCN-002 | Quiz M1 ≥ 60 % · 2 scénarios |
| **2** | 3 h | M1 | Slides M1 (6–10) · SCN-003, SCN-004, SCN-005 | 5 SCN M1 ≥ 60/100 · compliance |
| **3** | 3 h | M2 | Slides M2 · SCN-006, SCN-007 | 2 SCN M2 ≥ 60/100 |
| **4** | 3 h | M2 | SCN-008 · consolidation FIFO | Module M2 passé |
| **5** | 3 h | M3 | Slides M3 · SCN-009, SCN-010 | 2 SCN M3 ≥ 70/100 |
| **6** | 3 h | M3 | SCN-011 · **validation enseignant M3** | Module M3 passé + validé |
| **7** | 3 h | Consolidation | Renforcement M1–M3 · parcours Silver · TD | Silver éligible ou obtenu |
| **8** | 3 h | Consolidation | Rattrapage SCN · Run Report debrief · préparation M4 | Prérequis M4 confirmés |
| **9** | 3 h | M4 | Slides M4 · SCN-012, SCN-013, SCN-014 | 3 SCN M4 ≥ 70/100 |
| **10** | 3 h | M5 | Slides M5 · SCN-015, SCN-016, SCN-017 · clôture Gold | Parcours Gold éligible |

> **Note Cohorte Fondatrice 2026 :** les séances 9 et 10 correspondent aux modules M4 et M5 (Aulas 9 et 10). Les séances 1–8 couvrent M1–M3 et la consolidation Silver Premium.

## 4.2 Répartition horaire par activité (modèle)

| Activité | % du temps | Rôle enseignant |
|----------|------------|-----------------|
| Diapositives (Slides) | ~25 % | Présentation, notes orales (`notesFr`) |
| Quiz | ~10 % | Vérification concepts ; M1/M5 = gates cert |
| Simulation (Scénarios) | ~55 % | Supervision, Monitor Dashboard |
| Débrief / Run Report | ~10 % | Analyse erreurs, recommandations |

## 4.3 Prérequis de déblocage par séance

| Séance | Gate serveur | Action enseignant si bloqué |
|--------|--------------|----------------------------|
| M2 (S3+) | M1 `module_progress.passed` | Vérifier SCN-001→005 en Évaluation |
| M4 (S9) | M3 passé **et** `teacherValidated = true` | Bouton validation M3 sur Teacher Dashboard |
| M5 (S10) | M1 passé (gate serveur) | M4 passé fortement recommandé (UI) |
| Gold | Silver attribué + 18 gates | Vérifier page `/student/certifications/gold` |

<div class="page-break"></div>

# 5. Objectifs par module M1–M5

## 5.1 Module 1 — Fondements ERP/WMS

| Attribut | Valeur |
|----------|--------|
| **Scénarios** | SCN-001 → SCN-005 |
| **Seuil** | ≥ 60/100 |
| **Durée** | 6 h (Séances 1–2) |
| **Diapositives** | 10 slides |
| **Impact certification** | **Silver** (4 gates) |

**Objectifs d'apprentissage :**

1. Comprendre les flux logistiques PO → GR → SO → GI.
2. Maîtriser la création de commandes dans le WMS (ME21N équivalent).
3. Valider les réceptions et gérer les stocks (MIGO, MB52).
4. Effectuer un Cycle Count et finaliser la conformité (MI01, COMPLIANCE).

**Pipeline opérationnel :** PO → GR → STOCK → SO → GI → CC → COMPLIANCE

**Capstone M1 :** SCN-005 — Non-conformités multiples (synthèse des compétences M1).

---

## 5.2 Module 2 — Exécution d'entrepôt

| Attribut | Valeur |
|----------|--------|
| **Scénarios** | SCN-006 → SCN-008 |
| **Seuil** | ≥ 60/100 |
| **Durée** | 6 h (Séances 3–4) |
| **Diapositives** | 7 slides |
| **Impact certification** | Contribution **Gold** |

**Objectifs d'apprentissage :**

1. Exécuter un rangement structuré depuis le quai (Putaway LT0A).
2. Valider les limites de capacité par emplacement (bin capacity).
3. Respecter la règle FIFO (premier entré, premier sorti).
4. Contrôler la précision inventaire système vs physique.

**Pipeline opérationnel :** RÉCEPTION → PUTAWAY → BIN CAPACITY → FIFO → INVENTAIRE

---

## 5.3 Module 3 — Contrôle des stocks

| Attribut | Valeur |
|----------|--------|
| **Scénarios** | SCN-009 → SCN-011 |
| **Seuil** | ≥ 70/100 |
| **Durée** | 6 h (Séances 5–6) |
| **Diapositives** | 7 slides |
| **Impact certification** | Contribution **Gold** · **Validation enseignant requise** |

**Objectifs d'apprentissage :**

1. Réaliser un inventaire cyclique complet (MI01).
2. Analyser et justifier les écarts de stock (variance).
3. Générer des suggestions de réapprovisionnement (MRP).
4. Valider les ajustements avec l'enseignant (MI07).

**Pipeline opérationnel :** CYCLE COUNT → VARIANCE → AJUSTEMENT → RÉAPPRO → VALIDATION

> **Gate critique :** la validation enseignant M3 (`teacherValidated`) est **obligatoire** avant tout accès M4 en mode Évaluation.

---

## 5.4 Module 4 — Indicateurs de performance

| Attribut | Valeur |
|----------|--------|
| **Scénarios** | SCN-012 → SCN-014 |
| **Seuil** | ≥ 70/100 (score parfait max **75/100**) |
| **Durée** | 6 h (Séance 9 + travail dirigé) |
| **Diapositives** | 7 slides |
| **Impact certification** | Contribution **Gold** (SCN012–014) |

**Objectifs d'apprentissage :**

1. Calculer les KPI logistiques clés (OTIF, Fill Rate, DSI, rotation).
2. Analyser la rotation des stocks et le lead time.
3. Identifier les causes racines des écarts de performance.
4. Proposer des actions correctives basées sur les données (S&OP capstone SCN-014).

**Pipeline opérationnel :** KPI_DATA → KPI_ROTATION → KPI_SERVICE → KPI_DIAGNOSTIC → COMPLIANCE_M4

**Particularité M4 :** scénarios **analytiques** — le moniteur de transactions reste **vide** (comportement normal).

**Séquence obligatoire :** SCN-012 → SCN-013 → SCN-014.

---

## 5.5 Module 5 — Simulation intégrée (Peak Week)

| Attribut | Valeur |
|----------|--------|
| **Scénarios** | SCN-015 → SCN-017 |
| **Seuil** | ≥ 70/100 (SCN-017 capstone ≥ 70) |
| **Durée** | 6 h (Séance 10 + travail dirigé) |
| **Diapositives** | 5 slides |
| **Impact certification** | **Capstone Gold** |

**Objectifs d'apprentissage :**

1. Exécuter un cycle complet de bout en bout (fournisseur → entrepôt → client).
2. Gérer des situations de crise (variance, ajustement MI07 avant KPI).
3. Analyser les KPI en temps réel et prendre des décisions tactiques/stratégiques.
4. Démontrer la maîtrise globale du système WMS (capstone SCN-017).

**Pipeline opérationnel :** RÉCEPTION → RANGEMENT → INVENTAIRE → RÉAPPRO → KPI → DÉCISION → COMPLIANCE_M5

**Narratif Peak Week :**

| Scénario | Jour | Focus |
|----------|------|-------|
| SCN-015 | Jour 1 | Cycle nominal intégré · décision **tactique** |
| SCN-016 | Jour 2 | Variance −5 · **M5_ADJ avant KPI** (gate obligatoire) |
| SCN-017 | Jour 3 | Capstone stratégique · ≥2 KPIs numériques · horizon 90–180 j |

<div class="page-break"></div>

# 6. Flux pédagogique — Diapositives (Slides)

## 6.1 Vue d'ensemble

| Module | Nombre de slides | Route enseignant | Route étudiant |
|--------|------------------|------------------|----------------|
| M1 | 10 | `/teacher/slides/1` | `/student/slides/1` |
| M2 | 7 | `/teacher/slides/2` | `/student/slides/2` |
| M3 | 7 | `/teacher/slides/3` | `/student/slides/3` |
| M4 | 7 | `/teacher/slides/4` | `/student/slides/4` |
| M5 | 5 | `/teacher/slides/5` | `/student/slides/5` |
| **Total** | **36** | `/teacher/slides` | `/student/slides` |

## 6.2 Workflow enseignant — séance type

1. **Avant la séance (T−24 h)** — Parcourir les slides du module ; relire les `notesFr` (notes orales intégrées).
2. **Accueil (0:00–0:15)** — Connexion `/teacher/slides/{moduleId}` · mode projection · vérifier affichage bilingue FR/EN.
3. **Présentation (0:15–0:45)** — Slides 1–3 : couverture, objectifs, concepts clés.
4. **Approfondissement (0:45–1:15)** — Slides 4–6 : processus, terminologie, comparaisons ERP.
5. **Lien scénarios (1:15–1:30)** — Dernières slides : carte SCN, exercices, synthèse.
6. **Transition TP (1:30+)** — Diriger les étudiants vers quiz puis scénarios.

## 6.3 Fonctionnalités SlideViewer

| Fonction | Usage enseignant |
|----------|------------------|
| Navigation clavier (← →) | Projection fluide |
| Mode professeur (`professorMode`) | Affiche les notes orales sous la diapositive |
| Bascule FR/EN | Cohérence avec la cohorte |
| Visuels premium | FLOW, WH, KPI, FIORI, CERT selon le slide |
| `timingMin` | Estimation du temps de parole par slide |

## 6.4 Rôle des slides dans la progression

> **Important :** les diapositives **ne sont pas tracées côté serveur**. Elles ne bloquent ni ne débloquent modules, certifications ou checkpoints. Elles restent le **véhicule principal de transmission** en classe ; leur complétion est une responsabilité pédagogique, non technique.

## 6.5 Cartographie slides → scénarios (M4 exemple)

| Slide M4 | Thème | Scénario associé |
|----------|-------|------------------|
| 1 | Dashboard KPI · moniteur vide = normal | Intro SCN-012–014 |
| 2 | Rotation 2400÷400 = 6× | SCN-012 |
| 3 | Service 95 % + erreurs 4 % | SCN-013 |
| 4 | Productivité / coût | Transversal |
| 5 | Root Cause Analysis | SCN-014 (capstone) |
| 6 | Odoo Reports (démo) | Renforcement institutionnel |
| 7 | Application SCN-012–014 + Annexe A | Debrief + devoir |

<div class="page-break"></div>

# 7. Flux pédagogique — Quiz

## 7.1 Inventaire des quiz

| Module | Questions | Seuil passage | Gate certification |
|--------|-----------|---------------|-------------------|
| M1 | Banque seed | ≥ **60 %** | **Oui — Silver (gate 1)** |
| M2 | Banque seed | ≥ 60 % | Non |
| M3 | Banque seed | ≥ 60 % | Non |
| M4 | 4 questions | ≥ 60 % | Non |
| M5 | Banque seed | ≥ **60 %** | **Oui — Gold (gate 2)** |

## 7.2 Workflow enseignant

### Avant la séance

- Confirmer que le quiz du module est accessible : `/student/quiz/{moduleId}`.
- Pour M1 : insister sur le quiz **avant** les scénarios (gate Silver).

### Pendant la séance

1. Allouer **15–20 minutes** en début de module (ou en fin de slides).
2. Les étudiants passent le quiz en autonomie ; **meilleur score** conservé (`quizAttempts`).
3. Surveiller via Monitor Dashboard les tentatives en cours.

### Après la séance

- Quiz M2–M4 : usage **pédagogique de renforcement** uniquement — aucun impact certification.
- Quiz M1 non réussi (< 60 %) : **bloquer la certification Silver** même si tous les SCN M1 sont passés.

## 7.3 Règles techniques

- Tentatives multiples autorisées ; seul le **meilleur score** compte.
- Les quiz **n'écrivent pas** dans `module_progress`.
- Les quiz **ne bloquent pas** le démarrage d'un scénario (sauf recommandation UI pour M1).

## 7.4 Checklist enseignant — Quiz

| ☐ | Action |
|---|--------|
| ☐ | Quiz M1 passé avant SCN-005 (Séance 2) |
| ☐ | Quiz M5 assigné avant ou pendant Séance 10 |
| ☐ | Étudiants informés : M2–M4 quiz = renforcement, pas gate cert |
| ☐ | Scores consultés dans Monitor / Analytics |

<div class="page-break"></div>

# 8. Flux pédagogique — Scénarios (Simulation)

## 8.1 Catalogue officiel

| Module | Scénarios | Route | Seuil |
|--------|-----------|-------|-------|
| M1 | SCN-001 → SCN-005 | `/student/scenarios` | 60/100 |
| M2 | SCN-006 → SCN-008 | `/student/module2` | 60/100 |
| M3 | SCN-009 → SCN-011 | `/student/module3` | 70/100 |
| M4 | SCN-012 → SCN-014 | `/student/module4` | 70/100 |
| M5 | SCN-015 → SCN-017 | `/student/module5` | 70/100 |

## 8.2 Workflow enseignant — run type

```
Sélection scénario → Lecture Fiche Mission → Démarrage run (Évaluation)
→ Mission Control → Steps séquentiels → OIL panels → COMPLIANCE
→ Run Report → Débrief
```

### Étape par étape

| # | Étape | Rôle enseignant |
|---|-------|-----------------|
| 1 | **Sélection** | Confirmer mode **Évaluation** (pas Démo) pour cert |
| 2 | **Fiche Mission** | Vérifier que l'étudiant a lu le briefing (rôle, SKU, quantités) |
| 3 | **Mission Control** | Superviser via `/teacher/monitor` — progression %, step actif |
| 4 | **Exécution steps** | Intervenir si blocage récurrent ; renvoyer vers OIL Panel F |
| 5 | **COMPLIANCE** | Step final — valide l'état transactionnel |
| 6 | **Run Report** | Débrief collectif : score, pénalités, recommandations |

## 8.3 Modes Démo vs Évaluation

| Critère | Démo | Évaluation |
|---------|------|------------|
| Scoring | Désactivé ou indicatif | Actif — pénalités |
| Certification | **Exclu** | **Comptabilisé** |
| Réponses KPI | Peuvent être révélées (demo-gated) | Jamais révélées |
| Usage en classe | Projection enseignant, exploration | TP noté, devoirs |

## 8.4 Gates de démarrage (`runs.start`)

| Module cible | Condition serveur |
|--------------|-------------------|
| M2–M5 | M1 `module_progress.passed = true` |
| M4 | M3 passé **et** `teacherValidated = true` |
| M5 | M1 passé (M4 passé recommandé UI) |

## 8.5 Outils enseignant — supervision

| Outil | Route | Usage |
|-------|-------|-------|
| Monitor Dashboard | `/teacher/monitor` | Runs actifs, scores, blockers |
| Scenario Manager | `/teacher/scenarios` | Catalogue, mode démo |
| Assignment Manager | `/teacher/assignments` | Devoirs avec échéances |
| Analytics | `/teacher/analytics` | Distribution scores, complétion |
| Export CSV | Teacher Dashboard | Rapports de notes |

## 8.6 Seuils et scores parfaits

| Module | Seuil passage | Score parfait typique |
|--------|---------------|----------------------|
| M1–M2 | 60/100 | 100/100 |
| M3–M5 | 70/100 | 100/100 (M4 max **75/100**) |

> **Ne pas pénaliser** un étudiant M4 pour ne pas atteindre 100/100 — le plafond M4 est **75/100** par conception pédagogique.

<div class="page-break"></div>

# 9. Processus de validation enseignant (Module 3)

## 9.1 Contexte

Le Module 3 introduit des ajustements d'inventaire (MI07) et des décisions de réapprovisionnement qui requièrent une **validation humaine** avant l'accès au Module 4. C'est le seul module avec gate `teacherValidated` côté serveur.

## 9.2 Prérequis

| Condition | Vérification |
|-----------|--------------|
| Module 3 passé | `module_progress.passed = true` pour moduleId 3 |
| Tous SCN M3 complétés | SCN-009, SCN-010, SCN-011 ≥ 70/100 en Évaluation |
| Compliance validée | Step COMPLIANCE_M3 vert sur chaque run |

## 9.3 Procédure de validation

1. **Connexion** — `/teacher` → Teacher Dashboard.
2. **File d'attente** — Section **« M3 en attente de validation »** (étudiants avec M3 passé et `teacherValidated = false`).
3. **Revue** — Consulter Run Reports SCN-009→011 ; vérifier justification des écarts et qualité des ajustements.
4. **Validation** — Cliquer **« Valider le Module 3 »** pour l'étudiant concerné.
5. **Effet serveur** — Mutation `warehouse.validateTeacherModule` :
   - Définit `teacherValidated = true` et `teacherValidatedAt`.
   - Déclenche `recomputeModuleCheckpoint` si Checkpoint Engine activé.
   - **Débloque M4** en mode Évaluation.

## 9.4 Calendrier recommandé

| Moment | Action |
|--------|--------|
| Fin Séance 6 | Valider tous les étudiants ayant complété SCN-011 |
| T−24 h avant Séance 9 | File d'attente **vide** — aucun étudiant bloqué sur M4 |
| Pendant Séance 9 | Ne pas débuter SCN-012 tant que M3 non validé |

## 9.5 Ce que la validation M3 **ne fait pas**

- N'est **pas** un gate Gold (Gold ignore `teacherValidated`).
- Ne remplace **pas** le passage des scénarios M3.
- Ne peut **pas** être appliquée si M3 n'est pas passé (erreur serveur).

## 9.6 Checklist validation M3

| ☐ | Critère |
|---|---------|
| ☐ | SCN-009 : cycle count complet, écarts identifiés |
| ☐ | SCN-010 : variance justifiée, ajustement MI07 posté |
| ☐ | SCN-011 : réapprovisionnement validé, compliance verte |
| ☐ | Run Reports consultés — pas de blockers non résolus |
| ☐ | Validation enregistrée avant Séance 9 |

<div class="page-break"></div>

# 10. Certification Silver — processus et critères

## 10.1 Intitulé officiel

| FR | EN |
|----|-----|
| **Certification Silver Premium TEC.WMS** | **TEC.WMS Silver Premium Certification** |
| Opérations fondamentales ERP/WMS · Module 1 | ERP/WMS Foundation Operations · Module 1 |

## 10.2 Les 4 gates Silver

Toutes les conditions suivantes doivent être **simultanément vraies** :

| Gate | Exigence | Source technique |
|------|----------|------------------|
| **G1** | Quiz M1 ≥ 60 % | Meilleure tentative quiz M1 |
| **G2** | SCN-001 → SCN-005 chacun ≥ 60/100 (Évaluation) | Tous scénarios M1 au seuil |
| **G3** | Compliance M1 validée sur chaque SCN | Conformité M1 complète |
| **G4** | Aucun blocker non résolu (TX non postées, CC ouvert) | Intégrité transactionnelle |

**Formule :** `silverEligible = G1 ∧ G2 ∧ G3 ∧ G4`

## 10.3 Attributions automatique

- **Aucune action enseignant requise** pour l'attribution Silver.
- Déclenchement : visite de `/student/certifications` ou complétion du dernier gate lors d'un run M1.
- Indicateur persistant : Silver Premium attribué dans le profil étudiant.
- État UI : `LOCKED → IN_PROGRESS → ELIGIBLE → AWARDED`.

## 10.4 Exclusions

| Élément | Compte pour Silver ? |
|---------|---------------------|
| Runs Démo | **Non** |
| Slides complétées | **Non** (non tracé) |
| Quiz M2–M5 | **Non** |
| `module_progress.passed` M1 seul | **Non** (5 SCN requis individuellement) |

## 10.5 Workflow enseignant — Silver

| Étape | Action |
|-------|--------|
| Séances 1–2 | Superviser complétion SCN-001→005 + Quiz M1 |
| Séance 7 | Vérifier page Certifications — 4/4 gates vertes |
| Post-Silver | Confirmer numéro étudiant (`studentNumber`) pour registry |
| Délivrance | Voir §14 — workflow institutionnel PDF |

## 10.6 Numérotation Silver (Cohorte 2026)

Format : `TECWMS-SIL-{ANNÉE}-{SÉQUENCE}` (ex. `TECWMS-SIL-2026-001`)

| Identifiant | Statut registre |
|-------------|-----------------|
| TECWMS-SIL-2026-001 → 004 | Cohorte Fondatrice 2026 — slots pré-alloués · statut `ACTIVE` |

<div class="page-break"></div>

# 11. Certification Gold — processus et critères

## 11.1 Intitulé officiel

| FR | EN |
|----|-----|
| **Certification Gold Premium TEC.WMS** | **TEC.WMS Gold Premium Certification** |
| Parcours intégré M1–M5 · Opérations logistiques | Integrated M1–M5 pathway · Logistics operations |

## 11.2 Prérequis absolu

**Silver attribué** (`profiles.silverCertified = true`). Sans Silver, Gold reste **LOCKED** — tous les gates sont ignorés.

## 11.3 Les 18 gates Gold

| # | Gate | Détail |
|---|------|--------|
| 1 | Silver prerequisite | `silverCertified = true` |
| 2 | Quiz M5 ≥ 60 % | Meilleure tentative M5 |
| 3–14 | SCN-006 → SCN-017 | Chaque SCN ≥ seuil module (M2≥60, M3/M4/M5≥70) |
| 15 | Compliance M2–M5 | Steps COMPLIANCE_ADV, COMPLIANCE_M3, COMPLIANCE_M4, COMPLIANCE_M5 |
| 16 | No blockers | TX non postées / CC non résolus sur parcours Gold |
| 17 | Module compliance validators | Validateurs profonds M3–M5 |
| 18a | SCN-016 variance gate | M5_ADJ **avant** M5_KPI si KPI complété |
| 18b | SCN-017 capstone | Score ≥ 70 + KPI snapshot + M5_DECISION liée |

## 11.4 Machine d'états Gold

```
LOCKED → IN_PROGRESS → ELIGIBLE → AWARDED
```

| État | Condition |
|------|-----------|
| LOCKED | Silver non attribué |
| IN_PROGRESS | Silver OK, gates partiellement complétés |
| ELIGIBLE | 18/18 gates vrais |
| AWARDED | `profiles.goldCertified = true` |

## 11.5 Attribution Gold — configuration institutionnelle

- Par défaut, l'attribution automatique Gold peut être **désactivée** (comportement fail-closed).
- L'étudiant peut atteindre **ELIGIBLE** sans attribution automatique.
- L'attribution **AWARDED** requiert une **décision institutionnelle** et une configuration administrateur avant la Séance 10.

## 11.6 Gates spéciaux — briefing enseignant Séance 10

### SCN-016 — Ordre variance / KPI

L'étudiant **doit** compléter `M5_ADJ` (MI07) **avant** `M5_KPI`. Tenter REPLENISH ou KPI sans ADJ → **échec gate**.

**Démonstration recommandée :** montrer l'échec intentionnel puis le chemin correct.

### SCN-017 — Capstone stratégique

Exigences :

- Score global ≥ 70/100.
- Au moins **2 KPIs numériques** dans la décision.
- Horizon temporel **90–180 jours**.
- Trade-off explicite (vocabulaire : `tradeoff`, `trade-off`).
- `M5_KPI` complété **avant** `M5_DECISION`.

## 11.7 Workflow enseignant — Gold

| Étape | Action |
|-------|--------|
| Séances 3–8 | Superviser SCN-006→011 (contribution Gold) |
| Séance 9 | SCN-012→014 ≥ 70 |
| Séance 10 | SCN-015→017 · Quiz M5 · gates 18a/18b |
| Post-session | Vérifier `/student/certifications/gold` — 18/18 |
| Délivrance | Workflow institutionnel §14 · `TECWMS-GOLD-2026-xxx` |

<div class="page-break"></div>

# 12. Moteur de checkpoints (Checkpoint Engine)

## 12.1 Définition

Le **Checkpoint Engine** est le système unifié de progression par module pour **M2–M5**. Il aligne l'état persisté (`module_progress`) avec la vérité pédagogique : **un module est passé uniquement lorsque tous les scénarios officiels du module atteignent le seuil**.

> **Distinction importante :** les « checkpoints » dans l'UI (OIL Panel F, `controlPoints` sur la Fiche Mission) sont des **points de contrôle pédagogiques statiques**. Le Checkpoint Engine est un **moteur serveur** de progression module.

## 12.2 Trois systèmes parallèles (ne pas confondre)

| Système | Périmètre | Stockage |
|---------|-----------|----------|
| **Certification engine** | Silver Premium (M1) · Gold Premium (parcours M1–M5) | Profil étudiant — indicateurs simulateur |
| **Checkpoint engine** | Progression M2–M5 | Progression par module (checkpoints) |
| **Run progress %** | Session en cours | Calculé en temps réel — non persisté comme certification |

## 12.3 Règles du Checkpoint Engine

1. **Un module = tous les SCN officiels** — `OFFICIAL_SCN_BY_MODULE[moduleId]` au seuil module.
2. **Dernière run gagne** — une run Évaluation échouée plus récente révoque le crédit SCN.
3. **Runs Démo exclus** — même règle que certification.
4. **Certification engines inchangés** — Silver/Gold lisent directement runs/quiz, pas `module_progress`.
5. **Slides et quiz M2–M4 exclus** du calcul checkpoint.

## 12.4 Champs `module_progress` étendus

| Champ | Signification |
|-------|---------------|
| `passed` | Tous SCN module ≥ seuil |
| `progressPct` | % SCN complétés (partiel OK) |
| `completedScenarios` | Liste SCN crédités |
| `teacherValidated` | Validation M3 (gate M4) |
| `teacherValidatedAt` | Horodatage validation |

## 12.5 Déclencheurs de recalcul

| Événement | Action |
|-----------|--------|
| Run complétée (Run Report) | `recomputeModuleCheckpoint(userId, moduleId)` |
| Validation enseignant M3 | Recalcul module 3 |
| Script backfill (admin) | Recalcul cohorte entière |

## 12.6 Activation du moteur

Le moteur de checkpoints est **actif en production** pour les cohortes postérieures à juin 2026. Un module M2–M5 n'est marqué réussi que lorsque **tous** les scénarios officiels du module atteignent le seuil requis.

## 12.7 Implications enseignant

| Situation | Interprétation |
|-----------|----------------|
| Étudiant « M2 passé » mais SCN-007 absent | Bug legacy — relancer backfill ou SCN manquant |
| `progressPct = 66 %` M3 | 2/3 SCN complétés — pas encore passé |
| M3 passé mais M4 bloqué | `teacherValidated = false` — action enseignant requise |
| Silver ELIGIBLE mais M1 `passed=false` | Normal — systèmes indépendants |

<div class="page-break"></div>

# 13. Problèmes fréquents des étudiants

## 13.1 Module 1 — Fondements

| Problème | Cause | Intervention enseignant |
|----------|-------|------------------------|
| GR « fantôme » — stock invisible | GR créée mais non **postée** | Rappeler : poster MIGO avant putaway |
| Séquence hors ordre | SO avant GR | OIL Panel — chaîne PO→GR→SO |
| Stock négatif | GI sans stock suffisant | Vérifier MB52 avant picking |
| Compliance rouge | CC non complété ou TX pending | Moniteur transactions — tout poster |
| Score < 60 malgré flux complet | Pénalités séquence / zone | Run Report — analyser pénalités |

## 13.2 Module 2 — Entrepôt

| Problème | Cause | Intervention |
|----------|-------|--------------|
| FIFO violation | Lot récent sélectionné | Rappeler règle premier entré / premier sorti |
| Capacité bin dépassée | Putaway vers emplacement plein | Slide M2 bin capacity |
| Mauvaise zone | Putaway vers EXPÉDITION | Zones : RÉCEPTION → STOCKAGE uniquement |

## 13.3 Module 3 — Stocks

| Problème | Cause | Intervention |
|----------|-------|--------------|
| Écart non justifié | Variance ignorée | Fiche Mission — texte justification requis |
| ADJ (MI07) oublié | Passage direct à réappro | Pipeline CC → VARIANCE → **ADJ** → RÉAPPRO |
| M4 bloqué | M3 non validé enseignant | Procédure §9 — validation dashboard |
| Score 69/100 | Seuil M3 = **70** | Une pénalité de trop — revoir Run Report |

## 13.4 Module 4 — KPI

| Problème | Cause | Intervention |
|----------|-------|--------------|
| Moniteur vide — « bug » | Scénario **analytique** | Slide 1 M4 — comportement normal |
| Diagnostic rejeté SCN-013 | Mot « prélèvement » absent | Vocabulaire validator — guide étudiant |
| Diagnostic rejeté SCN-014 | « trade-off » / délai 3,5 j | Fiche Mission SCN-014 |
| Déception score 75/100 | **Plafond M4 = 75** | Expliquer — ce n'est pas un échec |
| Surstock recommandé SCN-012 | Piège complaisance 6× | Anti-surstock compliance |

## 13.5 Module 5 — Peak Week

| Problème | Cause | Intervention |
|----------|-------|--------------|
| KPI bloqué SCN-016 | ADJ non fait avant KPI | Démontrer séquence M5_ADJ → M5_KPI |
| Décision rejetée SCN-017 | KPI non snapshot avant décision | Ordre M5_KPI → M5_DECISION |
| Décision « générique » | Pas de KPIs numériques | Exiger ≥2 KPIs + horizon 90–180 j |
| SCN-015 « stratégique » confus | Profil **TACTICAL** (pas strategic) | Clarifier : tactique vs stratégique (017) |
| KPI copiés Annexe A | Doivent être **ledger-derived** | Run eval — valeurs du moniteur |

## 13.6 Certification et compte

| Problème | Cause | Intervention |
|----------|-------|--------------|
| Silver non débloqué | Quiz M1 < 60 % ou 1 SCN manquant | Page `/student/certifications/silver` |
| Gold LOCKED | Silver non attribué | Compléter parcours M1 d'abord |
| Gold ELIGIBLE non AWARDED | Attribution automatique désactivée | Décision admin / coordonnateur |
| Certificat PDF absent | Phase preview UI | Workflow institutionnel §14 |
| Numéro étudiant manquant | Profile incomplet | `/teacher/students` — éditer |

<div class="page-break"></div>

# 14. Workflow de délivrance des certificats

## 14.1 Trois couches (ne pas confondre)

| Couche | Rôle | Autorité |
|--------|------|----------|
| **Éligibilité simulateur** | Gates quiz + SCN + compliance | TEC.WMS runtime |
| **Aperçu pédagogique** | Preview in-app (filigrane) | UI étudiant |
| **Credential officiel** | PDF signé, numéro, QR, vérification publique | **Collège de la Concorde** |

> Seul le processus institutionnel délivre un certificat numéroté inscrit au **Certificate Registry**.

## 14.2 Workflow Silver — Cohorte type

```
1. Étudiant atteint 4/4 gates Silver (simulateur)
2. Attribution Silver Premium automatique (simulateur)
3. Enseignant vérifie studentNumber + identité
4. Coordinateur programme → approbation B3 (Directrice)
5. Allocation numéro : TECWMS-SIL-2026-xxx
6. Génération PDF institutionnel (300 DPI, A4 paysage)
7. Entrée registre : statut ACTIVE
8. Remise étudiant + publication portail /verify/{certificateId}
```

## 14.3 Workflow Gold — Cohorte type

```
1. Silver ACTIVE confirmé (lien credential prérequis)
2. Étudiant atteint 18/18 portes Gold
3. Décision institutionnelle → attribution Gold dans le simulateur
4. Approbation B3 Gold cohort
5. Allocation : TECWMS-GOLD-2026-xxx
6. PDF Gold (palette or, ribbon M1–M5)
7. Registry entry + QR verification URL
8. Remise + option LinkedIn credential URL
```

## 14.4 Numérotation officielle

Format : `TECWMS-{TIER}-{ANNÉE}-{SÉQUENCE}`

| Segment | Valeur |
|---------|--------|
| TIER | `SIL` (Silver Premium) · `GOLD` (Gold Premium) |
| ANNÉE | Année de délivrance (2026) |
| SÉQUENCE | 001, 002… (non réutilisable si REVOKED) |

## 14.5 Rôles et responsabilités

| Rôle | Responsabilité |
|------|----------------|
| **Enseignant** | Confirmer éligibilité simulateur · identité · studentNumber |
| **Coordonnateur TEC.LOG** | Consolidation roster · manifest cohorte |
| **Directrice de programme (B3)** | Approbation institutionnelle · signature PDF |
| **Directeur technique TEC.WMS** | Export eligibility snapshot · génération PDF |
| **Registraire** | Entrée registre · statut ACTIVE / REVOKED |

## 14.6 Vérification publique

- URL : `{PLATFORM}/verify/{certificateId}`
- QR code sur PDF → même URL
- Champs publics : ID, tier, nom, cohorte, date, statut
- Statuts registre : `ACTIVE` · `REVOKED` · `EXPIRED`

## 14.7 Checklist clôture cohorte

| ☐ | Action | Responsable |
|---|--------|-------------|
| ☐ | 100 % étudiants actifs — gates Silver vérifiés | Enseignant |
| ☐ | studentNumber renseigné pour tous | Enseignant |
| ☐ | Export CSV scores final | Enseignant |
| ☐ | Eligibility snapshot signé | Coordination |
| ☐ | Approbation B3 documentée | Direction |
| ☐ | PDFs générés et archivés | Technique |
| ☐ | Entrées registre ACTIVE | Registraire |
| ☐ | Remise credentials + debrief cohorte | Enseignant |

<div class="page-break"></div>

# 15. Annexes — Références et outils enseignant

## 15.1 Routes essentielles

| Route | Fonction |
|-------|----------|
| `/teacher` | Tableau de bord principal |
| `/teacher/monitor` | Supervision runs en direct |
| `/teacher/students` | Gestion comptes · studentNumber |
| `/teacher/scenarios` | Catalogue scénarios · mode démo |
| `/teacher/slides` | Hub diapositives projection |
| `/teacher/analytics` | Statistiques cohorte |
| `/student/certifications` | Page certifications étudiant |

## 15.2 Documents de référence

| Document | Emplacement |
|----------|-------------|
| Constitution pédagogique TEC.WMS | Documentation institutionnelle pédagogique |
| Package certification V1 | Manuel de certification TEC.WMS |
| Guide étudiant M1–M3 | `TECWMS_GUIDE_M1_M3` |
| Guide étudiant M4–M5 | `TECWMS_GUIDE_M4_M5` |
| Plan d'exécution Aula 9 (M4) | Documentation séance M4 |
| Guide de validation opérationnelle | Documentation validation cohorte |

## 15.3 Seuils officiels (référence rapide)

| Type | M1–M2 | M3–M5 | Quiz cert |
|------|-------|-------|-----------|
| Scénario Évaluation | ≥ 60/100 | ≥ 70/100 | M1/M5 ≥ 60 % |
| SCN-017 capstone | — | ≥ 70/100 | — |

## 15.4 Contacts et support

| Besoin | Contact |
|--------|---------|
| Compte enseignant / reset mot de passe | Administrateur TEC.WMS |
| Approbation certification B3 | Directrice de programme TEC.LOG |
| Incident plateforme (P0) | Directeur technique TEC.WMS · procédure d'escalade institutionnelle |
| Question pédagogique SCN | Coordination TEC.LOG + Fiche Mission PDF |

---

<div class="checklist-page">

# Checklist de préparation — Séance type

| ☐ | Vérification |
|---|--------------|
| ☐ | Plateforme accessible — `/login` sans erreur |
| ☐ | Compte enseignant actif — `/teacher` |
| ☐ | Slides module chargées — `/teacher/slides/{n}` |
| ☐ | Roster cohorte visible — 5+ étudiants |
| ☐ | Gates prérequis confirmés (M3 validation si S9+) |
| ☐ | Mode Évaluation rappelé aux étudiants |
| ☐ | Monitor Dashboard ouvert pour supervision |
| ☐ | Run Report debrief planifié (10 min fin séance) |

</div>

---

**Collège de la Concorde · TEC.WMS · Simulateur pédagogique ERP/WMS**  
Guide Enseignant Officiel · Version juin 2026 · Usage institutionnel
