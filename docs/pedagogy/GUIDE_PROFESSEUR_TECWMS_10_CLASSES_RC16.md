# TEC.WMS — Guide Professeur · 10 Classes (RC16)

**Programme :** TEC.LOG — Gestion intégrée des stocks et performance logistique  
**Institution :** Collège de la Concorde — Montréal  
**Plateforme :** Mini-WMS Concorde (TEC.WMS Simulator)  
**Version :** RC16 — Reconstruction pédagogique du guide professeur  
**Durée :** 30 heures · 10 séances × 3 h  
**Résumé exécutif :** [`GUIDE_PROFESSEUR_TECWMS_10_CLASSES_SUMMARY.md`](./GUIDE_PROFESSEUR_TECWMS_10_CLASSES_SUMMARY.md)

---

## Comment utiliser ce guide

Ce document est un **manuel de conduite de cours**, séance par séance. Il corrige les problèmes de rythme identifiés dans l'audit professeur RC16 :

- **M1 :** une transaction SAP/WMS à la fois, avec démonstration simulateur (plus de « carrousel » de six slides en 12 minutes).
- **M3 :** validation enseignant obligatoire avant M4 (Classe 6).
- **M4 :** terminologie alignée sur le **corps des slides** et **Annexe A** (rotation, OTIF, taux d'erreur — pas de confusion Fill Rate / service).
- **M5 :** narratif **Peak Week** (Jour 1 → 2 → 3) comme fil conducteur capstone.
- **Slides M2-S6, M3-S6, M4-S6 :** **exclues** du parcours RC16 (consolidation TEC.WMS — saut pour le rythme ; démos Mission Control couvertes par ce guide).

Chaque classe comprend **13 sections** : objectif · modules/SCN · slides · démos · TP · explications · questions · difficultés · checkpoints · quiz/cert · temps · pauses · checklist fin de séance.

**Convention horaire :** 3 h = 180 min dont **30 min de pause** (2 × 15 min) = **150 min effectives**.

---

## Référence rapide — Seuils et routes

| Module | Seuil | Score parfait max | Route étudiant SCN | Route slides prof |
|--------|-------|-------------------|--------------------|---------------------|
| M1 | 60/100 | 100 | `/student/scenarios` | `/teacher/slides/1` |
| M2 | 60/100 | 100 | `/student/module2` | `/teacher/slides/2` |
| M3 | 70/100 | 100 | `/student/module3` | `/teacher/slides/3` |
| M4 | 70/100 | 100 | `/student/module4` | `/teacher/slides/4` |
| M5 | 70/100 | 100 | `/student/module5` | `/teacher/slides/5` |

**Politique institutionnelle de notation (RC16) :** chaque scénario permet une exécution parfaite de **100/100**. Seuils de passage : M1 = 60 · M2 = 60 · M3 = 70 · M4 = 70 · M5 = 70.

**Monitor :** `/teacher/monitor` (filtrer par cohorte)  
**Teacher Dashboard :** `/teacher` · **Student Dashboard :** `/student/dashboard`  
**Mode obligatoire pour certification :** **Évaluation** (pas Démo)

---

# CLASSE 1 — M1 Fondements (partie 1) · PO, GR, Stock

## 1. Objectif de la classe

Poser les fondations du cycle logistique ERP/WMS : vue d'ensemble du flux, **trois premières transactions** (PO → GR → Stock), quiz M1 (gate Silver), et premiers scénarios opérationnels SCN-001 et SCN-002.

## 2. Modules / scénarios couverts

| Élément | Détail |
|---------|--------|
| Module | M1 — Fondements ERP/WMS |
| Scénarios | SCN-001 (cycle nominal) · SCN-002 (GR fantôme) |
| Prérequis | Aucun |

## 3. Séquence de diapositives

| Ordre | Slide | Titre | Durée réelle |
|-------|-------|-------|--------------|
| 1 | M1-S1 | Couverture — Module 1 | 12 min |
| 2 | M1-S2 | Flux logistique intégré | 18 min |
| 3 | M1-S3 | Commande d'achat (PO) — ME21N | 18 min |
| 4 | M1-S4 | Réception (GR) — MIGO | 18 min |
| 5 | M1-S5 | Gestion des stocks — MMBE | 15 min |

> **RC16 :** on ne présente **pas** SO, GI, CC aujourd'hui — report Classe 2.

## 4. Démonstrations simulateur

| Moment | Action | Mode | SCN |
|--------|--------|------|-----|
| Après S1 | Connexion · shell Fiori · vue enseignant/étudiant | Démo | — |
| Après S2 | Mission Control — carte du cycle 7 étapes | Démo | SCN-001 (aperçu) |
| Après S3 | Création PO — formulaire ME21N équivalent | Démo | SCN-001 |
| Après S4 | GR postée vs GR en attente (PENDING) | Démo | SCN-001 puis SCN-002 |
| Après S5 | Moniteur stock · soldes par bin | Démo | SCN-001 |

## 5. Moments de pratique étudiante

| Activité | Durée | Mode | Livrable |
|----------|-------|------|----------|
| Quiz M1 | 18 min | Autonome | Score ≥ 60 % (gate Silver G1) |
| SCN-001 | 24 min | **Évaluation** | Run complété ≥ 60/100 |
| SCN-002 | 20 min | **Évaluation** | Run complété ≥ 60/100 |

## 6. Explications suggérées (professeur)

**S1 — Accueil :** « Ce cours vous prépare aux emplois logistiques au Québec. Amazon, Sobeys, Couche-Tard utilisent ces mêmes flux. Le simulateur TEC.WMS reproduit PO, réception, stock, expédition — en bilingue, avec évaluation. »

**S2 — Flux :** Pointer chaque zone du diagramme. « Chaque étape dépend de la précédente. Une erreur à la réception contamine tout le stock downstream. »

**S3 — PO :** « La PO est le contrat d'entrée. Sans PO valide, rien n'entre en entrepôt. ME21N en SAP = notre formulaire PO. »

**S4 — GR :** « La GR est l'étape la plus critique pour la précision. Distinction essentielle : **postée** vs **non postée**. SCN-002 vous montrera pourquoi. »

**S5 — Stock :** « MMBE = tableau de bord. La variance (écart système/réalité) est l'ennemi du WMS. »

## 7. Questions à poser aux étudiants

- « Que se passe-t-il si on reçoit 100 unités mais que la PO indique 120 ? »
- « Quelle est la différence entre stock physique et stock système ? »
- « Pourquoi la GR doit-elle être *postée* avant de continuer ? » (préparer SCN-002)
- « Citez une entreprise québécoise où cette chaîne s'applique. »

## 8. Difficultés attendues

| Difficulté | Signe | Intervention |
|------------|-------|--------------|
| Surcharge codes SAP | Regard vide après S3 | Ralentir · une transaction = une démo |
| Confusion posté/non posté | Blocage SCN-002 | Revoir moniteur GR PENDING |
| Quiz M1 raté (< 60 %) | Gate Silver bloquée | Autoriser retake · revoir S3–S5 |
| Mode Démo par erreur | Run non comptabilisé | Vérifier badge « Évaluation » |

## 9. Checkpoints à vérifier

| Checkpoint | Critère | Où vérifier |
|------------|---------|-------------|
| Quiz M1 | ≥ 60 % meilleure tentative | Monitor · `/student/quiz/1` |
| SCN-001 | Complété ≥ 60/100 · COMPLIANCE OK | Monitor |
| SCN-002 | Complété ≥ 60/100 · COMPLIANCE OK | Monitor |
| Intégrité | Mode Évaluation confirmé | Run header |

## 10. Quiz / certification

| Élément | Détail |
|---------|--------|
| **Quiz M1** | **Obligatoire cette séance** — gate Silver G1 |
| Silver | Pas encore éligible (il manque SCN-003→005 + gates G2–G4) |
| Gold | Non applicable |

## 11. Répartition du temps (150 min effectives)

| Bloc | Contenu | Minutes |
|------|---------|---------|
| 0:00–0:08 | Accueil · consignes · connexion | 8 |
| 0:08–0:18 | M1-S1 Couverture | 10 |
| 0:18–0:32 | M1-S2 Flux + discussion | 14 |
| 0:32–0:46 | M1-S3 PO + démo simulateur | 14 |
| 0:46–1:00 | M1-S4 GR + démo posté/non posté | 14 |
| 1:00–1:12 | M1-S5 Stock + démo moniteur | 12 |
| 1:12–1:24 | Consolidation slides · questions | 8 |
| **1:24–1:39** | **PAUSE 1** | **15** |
| 1:39–1:57 | Quiz M1 (autonome) | 18 |
| 1:57–2:21 | SCN-001 TP supervisé | 24 |
| 2:21–2:43 | SCN-002 TP | 22 |
| **2:43–2:58** | **PAUSE 2** | **15** |
| 2:58–3:06 | Débrief · preview Classe 2 | 8 |
| *Enseignement effectif* | | *150* |
| *Pauses* | | *30* |
| *Total séance* | | *180* |

## 12. Pauses (30 min total)

- **Pause 1 (15 min)** — après bloc slides S1–S5, avant Quiz.
- **Pause 2 (15 min)** — après SCN-002, avant débrief final.

## 13. Checklist fin de classe

| ☐ | Action |
|---|--------|
| ☐ | Quiz M1 ≥ 60 % pour tous (ou liste retards) |
| ☐ | SCN-001 et SCN-002 complétés ≥ 60/100 en Évaluation |
| ☐ | Étudiants prêts pour SO/GI/CC (Classe 2) |

---

# CLASSE 2 — M1 Fondements (partie 2) · SO, GI, CC, Capstone

## 1. Objectif de la classe

Compléter le cycle transactionnel M1 (SO → GI → CC), présenter la carte des scénarios et la certification Silver, et exécuter SCN-003, SCN-004 et SCN-005.

## 2. Modules / scénarios couverts

| Élément | Détail |
|---------|--------|
| Module | M1 (fin) |
| Scénarios | SCN-003 (rupture) · SCN-004 (variance CC) · SCN-005 (multi-anomalies) |
| Prérequis | Quiz M1 ≥ 60 % · SCN-001 et SCN-002 complétés |

## 3. Séquence de diapositives

| Ordre | Slide | Titre | Durée réelle |
|-------|-------|-------|--------------|
| 1 | M1-S6 | Commande client (SO) — VA01 | 15 min |
| 2 | M1-S7 | Expédition (GI) — VL02N | 15 min |
| 3 | M1-S8 | Cycle Count — MI01 | 15 min |
| 4 | M1-S9 | Application scénarios SCN-001→005 | 15 min |
| 5 | M1-S10 | Certification Silver | 12 min |

## 4. Démonstrations simulateur

| Moment | Action | Mode |
|--------|--------|------|
| Après S6 | Création SO · lien stock → expédition | Démo SCN-001 |
| Après S7 | Pick · GI · bon de livraison | Démo SCN-001 |
| Après S8 | Cycle count · saisie quantité **physique** | Démo SCN-004 (aperçu) |
| S9 | Mission Sheet · OIL panels · ordre SCN | Démo |
| S10 | Page `/student/certifications/silver` | Live |

## 5. Moments de pratique étudiante

| Activité | Durée | SCN |
|----------|-------|-----|
| SCN-003 | 20 min | Rupture + réappro |
| SCN-004 | 22 min | Variance −15 |
| SCN-005 | 30 min | Capstone multi-anomalies |

## 6. Explications suggérées

**S6 :** « La SO crée la demande client. Signal au WMS : préparez cette commande. »

**S7 :** « VL02N = marchandise quitte l'entrepôt. Erreur ici = client mécontent · OTIF en baisse. »

**S8 :** « MI01 ferme la boucle ouverte à la GR. **Saisir la quantité physique**, pas le delta de variance. »

**S9 :** Présenter les 5 SCN dans l'ordre obligatoire. SCN-005 synthétise tout M1.

**S10 :** « Silver = 4 conditions : Quiz M1 + 5 SCN + compliance + pas de blockers. Démo `/student/certifications/silver` — checklist, PDF, QR `/verify/{id}`, partage LinkedIn si AWARDED. »

## 7. Questions à poser

- « Peut-on expédier sans SO ? »
- « À SCN-004 : si le système indique 200 et vous comptez 185, que saisissez-vous ? »
- « SCN-005 : dans quel ordre résoudre documents / physique / expédition ? »
- « Combien de gates Silver restent à compléter après aujourd'hui ? »

## 8. Difficultés attendues

| Difficulté | SCN | Intervention |
|------------|-----|--------------|
| Quantité physique vs delta | SCN-004 | Rappel S8 · exemple tableau |
| Ordre de résolution | SCN-005 | OIL Panel · Fiche Mission |
| Réappro avant GI | SCN-003 | Moniteur stock vide |
| Compliance échouée | Tous | Run Report · TX non postées |

## 9. Checkpoints à vérifier

| Checkpoint | Critère |
|------------|---------|
| SCN-001→005 | Chacun ≥ 60/100 en Évaluation |
| COMPLIANCE | Validée sur chaque run M1 |
| Blockers | Aucune TX PENDING · CC ouvert |
| M1 progress | Tous SCN listés verts Monitor |

## 10. Quiz / certification

| Élément | Détail |
|---------|--------|
| Quiz M1 | Doit déjà être ≥ 60 % (Classe 1) |
| Silver | Éligibilité possible si G1–G4 tous vrais — attribution auto |
| Action | Inviter visite `/student/certifications/silver` |

## 11. Répartition du temps

| Bloc | Minutes |
|------|---------|
| Accueil + récap Classe 1 | 8 |
| M1-S6 + démo SO | 12 |
| M1-S7 + démo GI | 12 |
| M1-S8 + démo CC | 12 |
| M1-S9 briefing scénarios | 12 |
| M1-S10 Silver | 10 |
| **PAUSE 1** | **15** |
| SCN-003 | 20 |
| SCN-004 | 22 |
| **PAUSE 2** | **15** |
| SCN-005 | 30 |
| Débrief Run Report collectif | 12 |
| *Enseignement effectif* | *150* |
| *Pauses* | *30* |
| *Total séance* | *180* |

## 12. Pauses

- **Pause 1** — après slides, avant TP intensif.
- **Pause 2** — entre SCN-004 et SCN-005 (capstone exige fraîcheur).

## 13. Checklist fin de classe

| ☐ | SCN-001→005 complétés ≥ 60/100 |
| ☐ | Quiz M1 confirmé |
| ☐ | Page Silver consultée par chaque étudiant |
| ☐ | Run Report archivé pour SCN-004 et SCN-005 |
| ☐ | Prêt pour M2 Classe 3 (gate M1 passed) |

---

# CLASSE 3 — M2 Exécution d'entrepôt (partie 1)

## 1. Objectif de la classe

Comprendre la disposition entrepôt, le flux réception→rangement, bins, capacité et FIFO ; pratiquer SCN-006 et SCN-007.

## 2. Modules / scénarios couverts

| Module | M2 |
| Scénarios | SCN-006 (putaway 150 u.) · SCN-007 (capacité 600/500) |
| Prérequis | M1 `module_progress.passed` |

## 3. Séquence de diapositives

| Slide | Titre | Durée |
|-------|-------|-------|
| M2-S1 | Disposition entrepôt — 9 zones | 15 min |
| M2-S2 | Réception et rangement | 15 min |
| M2-S3 | Gestion des bins | 12 min |
| M2-S4 | Contrôle capacité | 12 min |
| M2-S5 | Stratégie FIFO | 15 min |

**Verbaliser en ouverture (pas de slide couverture M2) :** objectifs M2 en 3 min.

## 4. Démonstrations simulateur

| Après slide | Démo |
|-------------|------|
| S1 | Plan zones ↔ REC-01 · STOCKAGE |
| S2 | Flux 6 étapes réception→confirmation |
| S3 | Code bin A1-C1-03 · allocation |
| S4 | Rejet 501e unité (SCN-007 preview) |
| S5 | Lots FIFO · dates |

## 5. Pratique étudiante

| Activité | Durée | Mode |
|----------|-------|------|
| Quiz M2 | 15 min | Renforcement (pas gate cert) |
| SCN-006 | 35 min | Évaluation |
| SCN-007 | 30 min | Évaluation |

## 6. Explications suggérées

**S1 :** « Neuf zones — chacune optimisée pour une fonction. La réception (REC-01) alimente le stockage. »

**S4 :** « Capacité = ressource précieuse. 600 unités dans un bin max 500 = le WMS doit refuser ou redistribuer. »

**S5 :** « FIFO = légal et réputationnel en alimentaire/pharma. Vendre un produit expiré = rappel. »

## 7. Questions à poser

- « Où placez-vous un palett reçu à REC-01 ? »
- « Que fait le système à la 501e unité ? »
- « FIFO : quel lot sort en premier si trois dates différentes ? »

## 8. Difficultés attendues

- Adressage bin (zone-allée-niveau-bin)
- SCN-007 : tentative de forcer l'allocation
- Confusion putaway vs picking (M2 = putaway focus)

## 9. Checkpoints

| Checkpoint | Critère |
|------------|---------|
| Gate M2 | M1 passed confirmé |
| SCN-006 | ≥ 60 · putaway STOCKAGE |
| SCN-007 | ≥ 60 · respect capacité |

## 10. Quiz / certification

- Quiz M2 : renforcement · 15 min · pas de gate
- Silver : déjà obtenu ou en cours (Classe 7)
- Gold : SCN-006/007 comptent pour gate 3–14

## 11. Répartition du temps

| Bloc | min |
|------|-----|
| Objectifs M2 (verbal) | 5 |
| M2-S1 → S5 + démos | 58 |
| **PAUSE 1** | **15** |
| Quiz M2 | 12 |
| SCN-006 | 28 |
| **PAUSE 2** | **15** |
| SCN-007 | 27 |
| Débrief | 10 |
| *Enseignement effectif* | *150* |
| *Pauses* | *30* |
| *Total séance* | *180* |

## 12. Pauses — 15 min après slides · 15 min avant débrief

## 13. Checklist fin de classe

| ☐ | SCN-006 et SCN-007 ≥ 60/100 |
| ☐ | Étudiants comprennent capacité bin |
| ☐ | SCN-008 annoncé Classe 4 |
| ☐ | M2-S6 **exclue** — enseignement S1–S5 seulement cette séance |

---

# CLASSE 4 — M2 Exécution (partie 2) · FIFO Capstone

## 1. Objectif

Maîtriser FIFO en conditions réelles (SCN-008) ; clôturer M2 ; consolidation putaway/capacité/FIFO.

## 2. Modules / scénarios

| Module | M2 (clôture) |
| Scénarios | SCN-008 (FIFO · 3 lots pré-chargés) |
| Prérequis | SCN-006 · SCN-007 complétés |

## 3. Slides

| Slide | Titre | Durée |
|-------|-------|-------|
| M2-S7 | Application scénarios SCN-006→008 | 15 min |

> **RC16 :** M2-S6 (consolidation TEC.WMS) **exclue** du parcours classe — saut S5 → S7. Récap verbal S1–S5 (10 min) en ouverture si nécessaire.

## 4. Démonstrations

- SCN-008 : putaway auto-complété · premier step actif = FIFO_PICK
- Violation FIFO → compliance bloquée
- Moniteur lots et dates

## 5. Pratique

| Activité | Durée |
|----------|-------|
| SCN-008 | 50 min |
| Débrief FIFO + clôture M2 | 20 min |
| Preview M3 (ROP) | 15 min |

> Rattrapage SCN-006/007 : **Classes 7–8 uniquement** (hors assignation primaire).

## 6. Explications

« SCN-008 : le rangement est déjà fait. Votre compétence = **choisir le bon lot** au picking. Le système détecte les violations FIFO. »

## 7. Questions

- « Pourquoi le putaway est-il déjà complété au départ ? »
- « Quelle transaction confirme le pick FIFO ? »
- « Que se passe-t-il si vous pickerez le lot le plus récent ? »

## 8. Difficultés

- Surprise putaway auto-complete (expliquer avant de lancer)
- Sélection mauvais lot
- Confusion SCN-008 description vs runtime (suivre Fiche Mission)

## 9. Checkpoints

| Checkpoint | Critère |
|------------|---------|
| SCN-008 | ≥ 60 · FIFO respecté |
| Module M2 | `module_progress.passed` = true |
| 3 SCN M2 | Tous complétés pour Gold futur |

## 10. Quiz / certification

- Pas de quiz obligatoire
- Gold : SCN-006→008 requis plus tard

## 11. Temps (150 min enseignement + 30 min pauses)

| Bloc | min |
|------|-----|
| Accueil + récap M2 (S1–S5) | 10 |
| M2-S7 briefing SCN-008 | 15 |
| **PAUSE 1** | **15** |
| SCN-008 TP | 50 |
| **PAUSE 2** | **15** |
| Débrief FIFO + clôture M2 | 20 |
| Preview M3 (formules ROP) | 15 |
| Questions · consignes | 10 |
| *Enseignement effectif* | *150* |
| *Pauses* | *30* |
| *Total séance* | *180* |

## 12. Pauses standard

## 13. Checklist

| ☐ | SCN-008 complété |
| ☐ | M2 passed pour tous |
| ☐ | M3 annoncé · formules ROP preview |
| ☐ | M2-S6 non couverte (exclusion confirmée) |

---

# CLASSE 5 — M3 Contrôle des stocks (partie 1)

## 1. Objectif

Introduire Min/Max/ROP, Safety Stock, cycle count et variance ; SCN-009 et SCN-010.

## 2. Modules / scénarios

| Module | M3 |
| Scénarios | SCN-009 (CC simple) · SCN-010 (variance + ADJ) |
| Seuil | **70/100** |

## 3. Slides

| Slide | Titre | Durée |
|-------|-------|-------|
| M3-S1 | Vue d'ensemble contrôle inventaire | 10 min |
| M3-S2 | Min/Max/ROP + **tableau blanc** | 20 min |
| M3-S3 | Safety Stock + formule | 15 min |
| M3-S4 | Cycle count et variance | 12 min |
| M3-S5 | Décision réapprovisionnement | 10 min |

## 4. Démonstrations

- S2 : graphique MIN/MAX/ROP · PO auto quand stock < ROP
- S4 : CC_LIST → CC_COUNT → CC_RECON dans simulateur
- SCN-010 : ADJ via étape CC_RECON (pas step séparé UI)

## 5. Pratique

| Activité | Durée |
|----------|-------|
| Quiz M3 | 15 min (renforcement) |
| SCN-009 | 35 min |
| SCN-010 | 35 min |

## 6. Explications

**S2 :** « ROP = (Demande × Délai) + Safety Stock. Quand stock touche ROP → nouvelle PO. »

**S3 :** « Safety Stock = assurance. 99 % fiabilité exige plus de stock tampon que 95 %. »

**S4 :** « Variance > 2 % = système non fiable. SCN-010 : justifier avant d'ajuster. »

## 7. Questions

- « Trop de stock vs rupture — où est l'équilibre ? »
- « Calculez ROP si demande = 10/j, délai = 5 j, SS = 20. »
- « SCN-010 : faut-il ajuster immédiatement ou investiguer ? »

## 8. Difficultés

- Formules ROP/SS (math anxiety)
- ADJ intégré dans CC_RECON (pas MI07 séparé en M3)
- Justification variance ≥ longueur minimale

## 9. Checkpoints

- SCN-009 ≥ 70
- SCN-010 ≥ 70 ou plan rattrapage Classes 7–8

## 10. Quiz / certification

- Quiz M3 : renforcement
- Validation enseignant : **pas encore** (Classe 6)

## 11. Temps

| Bloc | min |
|------|-----|
| Accueil + objectifs M3 | 5 |
| M3-S1 → S5 + tableau blanc | 62 |
| **PAUSE 1** | **15** |
| Quiz M3 | 12 |
| SCN-009 | 28 |
| **PAUSE 2** | **15** |
| SCN-010 | 28 |
| *Enseignement effectif* | *150* |
| *Pauses* | *30* |
| *Total séance* | *180* |

## 12. Pauses standard

## 13. Checklist

| ☐ | SCN-009/010 complétés ou planifiés |
| ☐ | Formules ROP comprises |
| ☐ | SCN-011 + validation M3 = Classe 6 |

---

# CLASSE 6 — M3 (partie 2) · Réappro + Validation enseignant

## 1. Objectif

Compléter SCN-011 ; effectuer la **validation enseignant M3** (gate M4) ; verrouiller prérequis M4.

## 2. Modules / scénarios

| Scénarios | SCN-011 (Min/Max REPLENISH) |
| **Gate critique** | `teacherValidated = true` sur M3 |

## 3. Slides

| Slide | Durée |
|-------|-------|
| M3-S7 Scénarios SCN-009→011 | 12 min |

> **RC16 :** M3-S6 (consolidation TEC.WMS) **exclue** du parcours classe — saut S5 → S7. Récap M3-S1→S5 (10 min verbal) si nécessaire.

## 4. Démonstrations

- SCN-011 : REPLENISH step · quantité commandée vs ROP
- Pipeline 5 steps M3 (REPLENISH obligatoire même si focus CC)
- **Validation M3** : bouton Teacher Dashboard

## 5. Pratique

| Activité | Durée |
|----------|-------|
| SCN-011 | 42 min |
| **Validation enseignant M3** | 18 min (batch) |
| Débrief M3 + preview M4 analytique | 20 min |

> Rattrapage SCN-009/010 : **Classes 7–8 uniquement** (hors assignation primaire).

## 6. Explications

« SCN-011 : décision réappro — quand commander, combien, pour quel SKU. Après complétion, je valide votre module 3 — **obligatoire** pour accéder aux KPI en M4. »

## 7. Questions

- « Stock sous ROP — que déclenche le système ? »
- « Pourquoi la validation enseignant existe-t-elle en M3 ? » (MI07 · décisions à impact)

## 8. Difficultés

- REPLENISH step perçu comme hors-sujet SCN-009
- Étudiants bloqués M4 sans validation — **vérifier avant Classe 9**
- Checkpoint deadlock résolu RC15 — valider dès M3 passed

## 9. Checkpoints — CRITIQUES

| Checkpoint | Action enseignant |
|------------|-------------------|
| SCN-011 | ≥ 70/100 |
| M3 passed | `module_progress.passed` |
| **teacherValidated** | **Cliquer validation pour chaque étudiant prêt** |
| File M4 | Aucun étudiant bloqué avant Classe 9 |

**Route validation :** `/teacher/dashboard` → Module 3 → Valider

## 10. Quiz / certification

- Gold gates 3–14 : SCN-009→011 comptent
- M4 locked until teacherValidated

## 11. Temps

| Bloc | min |
|------|-----|
| Accueil + récap M3 (S1–S5) | 10 |
| M3-S7 + consignes SCN-011 | 12 |
| **PAUSE 1** | **15** |
| SCN-011 TP | 42 |
| **PAUSE 2** | **15** |
| Validation enseignant batch | 18 |
| Débrief + preview M4 analytique | 20 |
| Questions · consignes Classe 7 | 8 |
| *Enseignement effectif* | *150* |
| *Pauses* | *30* |
| *Total séance* | *180* |

## 12. Pauses standard

## 13. Checklist — PRIORITÉ RC16

| ☐ | **Validation M3 enregistrée pour 100 % des étudiants prêts** |
| ☐ | SCN-009→011 ≥ 70 |
| ☐ | Liste étudiants en retard transmise (rattrapage C7–8) |
| ☐ | Annonce Classe 7 Silver + Classe 9 M4 |
| ☐ | M3-S6 non couverte (exclusion confirmée) |

---

# CLASSE 7 — Consolidation · Parcours Silver

## 1. Objectif

Consolidation M1–M3 ; obtenir ou confirmer **certification Silver** ; rattrapage SCN ; renforcement concepts.

## 2. Modules / scénarios

| Contenu | Rattrapage SCN-001→011 au besoin |
| Focus cert | **Silver 4 gates** |

## 3. Slides

Aucune slide obligatoire — révision ciblée depuis `/teacher/slides/1–3` au choix (10–15 min max).

## 4. Démonstrations

- Page Silver 4/4 gates
- Run Report d'un SCN raté (analyse collective)
- OIL Panel F pour étudiants bloqués

## 5. Pratique

| Activité | Durée |
|----------|-------|
| Rattrapage SCN | 70 min |
| Travail dirigé Silver | 30 min |
| Quiz manquants M2/M3 | 20 min |

## 6. Explications

« Silver = maîtrise opérationnelle M1. Gold = parcours complet M1–M5. Aujourd'hui : fermer Silver pour tous. »

## 7. Questions

- « Quel gate Silver vous manque ? »
- « Quelle est la différence Évaluation vs Démo pour la cert ? »

## 8. Difficultés

- Étudiants avec Quiz M1 < 60 % bloqués G1
- SCN un seul < 60 bloque G2
- Compliance non validée G3

## 9. Checkpoints Silver

| Gate | Vérification |
|------|--------------|
| G1 | Quiz M1 ≥ 60 % |
| G2 | SCN-001→005 ≥ 60 |
| G3 | COMPLIANCE M1 each |
| G4 | No blockers |

**Route :** `/student/certifications/silver` → état AWARDED ou ELIGIBLE

## 10. Quiz / certification

- **Focus Silver** — pas de gate Gold aujourd'hui
- Confirmer `studentNumber` pour registre institutionnel

## 11. Temps

| Bloc | min |
|------|-----|
| Brief Silver + diagnostic gates | 15 |
| Révision slides M1–M3 (ciblée) | 10 |
| **PAUSE 1** | **15** |
| Rattrapage SCN supervisé (retards uniquement) | 75 |
| **PAUSE 2** | **15** |
| Vérification Silver individuelle + quiz M2/M3 manquants | 35 |
| Débrief · consignes Classe 8 | 15 |
| *Enseignement effectif* | *150* |
| *Pauses* | *30* |
| *Total séance* | *180* |

## 12. Pauses standard

## 13. Checklist

| ☐ | Silver AWARDED ou ELIGIBLE pour chaque étudiant actif |
| ☐ | Liste retards Gold path (SCN M2/M3) |
| ☐ | SCN M2/M3 complets pour contribution Gold |
| ☐ | Préparation M4 confirmée (validation M3) |

---

# CLASSE 8 — Consolidation · Préparation M4

## 1. Objectif

Rattrapage final M2/M3 ; débrief Run Report ; préparer le **virage analytique M4** ; Quiz M4 ; confirmer déblocage M4.

## 2. Modules / scénarios

| Contenu | SCN M2/M3 restants · pas de nouveau contenu M4 |
| Gate | `teacherValidated` M3 + M3 passed |

## 3. Slides

Aucune — **preview M4-S1** (5 min) : « moniteur vide = normal en M4 ».

## 4. Démonstrations

- M4 mode analytique : KPI tower sans transactions
- Annexe A preview (rotation 6×, OTIF 95 %, erreurs 4 %)

## 5. Pratique

| Activité | Durée |
|----------|-------|
| Rattrapage SCN | 50 min |
| Quiz M4 | 15 min (renforcement) |
| Lecture Annexe A | 20 min |
| Débrief Run Report | 25 min |

## 6. Explications — Préparation M4 (terminologie RC16)

> **Encadré obligatoire — lire en classe :**
>
> | Terme | Valeur Annexe A | Interprétation |
> |-------|-----------------|----------------|
> | **Rotation** | 6×/an | Bande **normale** (4–12×) — pas surstock |
> | **OTIF (taux de service)** | 95 % | **Excellent** — ne pas dire « service faible » |
> | **Taux d'erreur** | 4 % | **Acceptable** (1–5 %) — levier qualité exécution |
> | **Fill Rate** | Concept connexe | Distinct de l'OTIF — pas l'indicateur central du sim M4 |
>
> « En M4, vous êtes analyste, pas opérateur. Le moniteur de transactions restera **vide**. C'est normal. »

## 7. Questions

- « Pourquoi le moniteur M4 est-il vide ? »
- « 6× rotation — surstock ou normal ? »
- « 95 % OTIF — excellent ou insuffisant ? »

## 8. Difficultés

- Étudiants sans validation M3 — **urgence** avant Classe 9
- Confusion OTIF / rotation / Fill Rate — utiliser encadré ci-dessus
- Annexe A non lue avant SCN-012

## 9. Checkpoints

| Checkpoint | Critère |
|------------|---------|
| teacherValidated | 100 % cohorte |
| M3 passed | Confirmé |
| SCN M2/M3 | Complets pour Gold |
| T−24h M4 | File d'attente validation vide |

## 10. Quiz / certification

- Quiz M4 : renforcement · 4 questions · pas gate cert
- Distribuer **Annexe A** (PDF ou OIL Panel D)

## 11. Temps

| Bloc | min |
|------|-----|
| Accueil + encadré M4 terminologie | 15 |
| Distribution · lecture Annexe A | 20 |
| Quiz M4 | 15 |
| **PAUSE 1** | **15** |
| Rattrapage SCN (retards M1–M3) | 45 |
| **PAUSE 2** | **15** |
| Débrief Run Report · confirmation validation M3 | 25 |
| Preview moniteur vide M4 (M4-S1) | 15 |
| *Enseignement effectif* | *150* |
| *Pauses* | *30* |
| *Total séance* | *180* |

## 12. Pauses standard

## 13. Checklist

| ☐ | **Aucun étudiant bloqué M4** (validation M3) |
| ☐ | Annexe A distribuée |
| ☐ | Tous comprennent : M4 = analytique |
| ☐ | SCN-012→014 preview Classe 9 |

---

# CLASSE 9 — M4 Indicateurs de performance KPI

## 1. Objectif

Lire et interpréter les KPI logistiques ; exécuter SCN-012, SCN-013, SCN-014 en mode analytique ; capstone S&OP SCN-014.

## 2. Modules / scénarios

| Module | M4 |
| Scénarios | SCN-012 (rotation) · SCN-013 (service + erreurs) · SCN-014 (capstone) |
| Seuil | 70/100 · max **100/100** |

## 3. Slides — enseigner depuis le **corps de slide**

| Slide | Titre | Durée | Lien SCN |
|-------|-------|-------|----------|
| M4-S1 | Tableau de bord KPI | 12 min | Intro 012–014 |
| M4-S2 | **Rotation** 2400÷400=6× | 15 min | SCN-012 |
| M4-S3 | **OTIF 95 % + erreurs 4 %** | 15 min | SCN-013 |
| M4-S4 | Productivité et coût | 10 min | Transversal 014 |
| M4-S5 | Root Cause Analysis | 10 min | SCN-014 |
| M4-S7 | Application SCN-012→014 | 10 min | TP handoff |

> **RC16 :** M4-S6 **exclue** du parcours RC16. Enseigner depuis **corps de slide** + **Annexe A** (rotation, OTIF, erreurs).

## 4. Démonstrations

| Moment | Action |
|--------|--------|
| S1 | KPI tower · moniteur TX **vide** |
| S2 | Calcul 2400÷400 au tableau · bandes 4–12× |
| S3 | 285/300 et 12/300 · corrélation picking/réception |
| S5 | Problem → Data → Cause → Action |
| Avant TP | Instructor run SCN-012 demo (1 analytical step) |

## 5. Pratique

| SCN | Durée | Focus |
|-----|-------|-------|
| SCN-012 | 25 min | Rotation normale · maintien + surveillance SKU |
| SCN-013 | 25 min | Piège dashboard vert · plan exécution J-90 |
| SCN-014 | 27 min | Trade-off · une initiative · ≥150 car. |

## 6. Explications clés (M4_M5 Instructor Guide)

**SCN-012 :** « 6× = normal. Ne proposez pas destock global. Recommandez maintien + surveillance SKU lents. **Mot-clé validator :** *normale*, pas *surstock*. »

**SCN-013 :** « 95 % OTIF = excellent. Le piège : ignorer 4 % erreurs picking/réception avant renouvellement SLA J-90. Analyse **duale** OTIF + erreurs dans la même réponse KPI_SERVICE. »

**SCN-014 :** « Conseil d'administration : **une** initiative financée. Nommez le trade-off. Citez rotation + service + erreurs + lead time 3,5 j. »

## 7. Questions

- « SCN-012 : le CFO demande si 48 000 $ immobilisés sont justifiés — que répondez-vous ? »
- « SCN-013 : le dashboard est vert — investissez-vous quand même ? »
- « SCN-014 : que sacrifiez-vous si vous financez la formation picking ? »

## 8. Difficultés

| SCN | Erreur fréquente | Correction |
|-----|------------------|------------|
| SCN-012 | « 6× = surstock » | Bande normale |
| SCN-012 | Mot *surstock* dans champ rotation | Validator bloque |
| SCN-013 | OTIF seul sans erreurs | Analyse duale requise |
| SCN-013 | « Service faible 95 % » | Factuellement faux |
| SCN-014 | Liste de souhaits sans trade-off | Pas une décision S&OP |
| Tous | Copier Annexe A sans interpréter | Lire bandes |

## 9. Checkpoints

| Checkpoint | Critère |
|------------|---------|
| SCN-012→014 | Chacun ≥ 70/100 |
| M4 passed | module_progress |
| Gold | SCN-012→014 comptent gates 3–14 |

## 10. Quiz / certification

- Pas de quiz gate — Quiz M4 déjà fait Classe 8 (renforcement)
- Gold contribution : SCN-012→014 requis

## 11. Temps

| Bloc | min |
|------|-----|
| Accueil + gate M3 confirmé | 10 |
| M4-S1 → S5 · S7 (S6 exclue) | 54 |
| **PAUSE 1** | **15** |
| SCN-012 | 25 |
| SCN-013 | 25 |
| **PAUSE 2** | **15** |
| SCN-014 + débrief | 35 |
| *Enseignement effectif* | *150* |
| *Pauses* | *30* |
| *Total séance* | *180* |

## 12. Pauses standard

## 13. Checklist

| ☐ | SCN-012→014 ≥ 70 |
| ☐ | Annexe A utilisée |
| ☐ | Aucun étudiant cherche transactions WMS en M4 |
| ☐ | M5 Peak Week annoncé Classe 10 |

---

# CLASSE 10 — M5 Peak Week · Capstone Gold

## 1. Objectif

Exécuter le parcours intégré **Peak Week** (Jour 1→2→3) ; Quiz M5 ; atteindre éligibilité **Gold** ; clôturer le programme TEC.LOG.

## 2. Modules / scénarios

| Narratif | SCN | Jour |
|----------|-----|------|
| Opération intégrée | SCN-015 | Jour 1 — tactique |
| Crise variance | SCN-016 | Jour 2 — MI07 avant KPI |
| Capstone stratégique | SCN-017 | Jour 3 — ≥2 KPI chiffrés |

## 3. Slides

| Slide | Titre | Durée |
|-------|-------|-------|
| M5-S1 | Opération intégrée bout en bout | 12 min |
| M5-S2 | SCN-015 Peak Week Jour 1 | 10 min |
| M5-S3 | SCN-016 Jour 2 — crise | 12 min |
| M5-S4 | SCN-017 Jour 3 — audit final | 10 min |
| M5-S5 | Certification Gold | 10 min |

## 4. Démonstrations — OBLIGATOIRES RC16

| Démo | Objectif |
|------|----------|
| SCN-016 échec intentionnel | Continuer vers KPI sans M5_ADJ → montrer blocage gate 18a |
| Chemin correct SCN-016 | CC → variance −5 → M5_ADJ → replen Q=0 → KPI snapshot |
| Page Gold 18 gates | `/student/certifications/gold` |
| Credential live | PDF · QR `/verify/{id}` · partage LinkedIn (ELIGIBLE → AWARDED) |

## 5. Pratique

| Activité | Durée | Note |
|----------|-------|------|
| Quiz M5 | 18 min | **Gate Gold #2** |
| SCN-015 | 35 min | Stock vide OK · Q réappro = 0 |
| SCN-016 | 40 min | 8 steps runtime |
| SCN-017 | 35 min | Décision stratégique · snapshot KPI |

## 6. Explications Peak Week

**S1 :** « M5 = M1+M2+M3+M4 ensemble. Vous **opérez**, puis **calculez KPI depuis vos ops**, puis **décidez**. »

**SCN-015 :** « Stock vide au départ normal. Réappro = 0 si stock > min. KPI du **moniteur**, pas Annexe A portfolio. Décision **tactique**. »

**SCN-016 :** « Jour 2 Peak Week : écart −5 @ B-01-R1-L1. **Règle d'or :** corriger avant KPI. Serveur injecte 50/45 même si vous comptez 50/50. »

**SCN-017 :** « Jour 3 : vous êtes directeur logistique. Citez ≥2 chiffres du **snapshot M5_KPI**. Arbitrage · horizon 90–180 j. Pas de réponse générique. »

## 7. Questions

- « SCN-015 : pourquoi Q réappro = 0 ? »
- « SCN-016 : que se passe-t-il si je saute M5_ADJ ? » (démo live)
- « SCN-017 : citez deux KPI numériques de votre snapshot. »
- « Combien de gates Gold avez-vous complétés ? »

## 8. Difficultés

| SCN | Difficulté | Aide |
|-----|------------|------|
| SCN-015 | Copier Annexe A (48000 $) | Utiliser KPI dérivés run (≈6000 $) |
| SCN-015 | Commander par réflexe | Stock > min → Q=0 |
| SCN-016 | Sauter ADJ | Gate 18a · démo échec |
| SCN-016 | KPI post-ADJ | Stock 45 · valeur 5400 $ |
| SCN-017 | Réponse opérationnelle | Rejetée — strategic rubric Annexe B |
| SCN-017 | Pas de chiffres | Validator exige tokens numériques |

## 9. Checkpoints Gold (18 gates)

| # | Gate | Classe 10 action |
|---|------|------------------|
| 1 | Silver | Confirmé |
| 2 | Quiz M5 ≥ 60 % | Cette séance |
| 3–14 | SCN-006→017 | Seuils module |
| 15–17 | Compliance M2–M5 | Run compliance steps |
| 18a | SCN-016 seq | M5_ADJ before KPI |
| 18b | SCN-017 | ≥70 + decision + snapshot |

**Route :** `/student/certifications/gold`

## 10. Quiz / certification

| Élément | Timing |
|---------|--------|
| **Quiz M5** | Début séance ou après S1 — gate #2 |
| Gold ELIGIBLE | Fin séance si 18/18 |
| Gold AWARDED | Décision institutionnelle |

## 11. Temps

| Bloc | min |
|------|-----|
| Accueil · Peak Week framing | 5 |
| M5-S1 → S5 | 39 |
| Quiz M5 (gate Gold #2) | 15 |
| **PAUSE 1** | **15** |
| SCN-015 | 22 |
| SCN-016 (incl. démo échec gate 18a) | 28 |
| **PAUSE 2** | **15** |
| SCN-017 | 26 |
| Clôture Gold + débrief final | 15 |
| *Enseignement effectif* | *150* |
| *Pauses* | *30* |
| *Total séance* | *180* |

## 12. Pauses standard

## 13. Checklist fin de programme

| ☐ | Quiz M5 ≥ 60 % tous |
| ☐ | SCN-015→017 complétés ≥ 70 |
| ☐ | Gold ELIGIBLE vérifié (18/18) |
| ☐ | Run Report final archivé |
| ☐ | Numéros étudiants confirmés pour certificats |
| ☐ | Signalement direction pour AWARDED Gold |
| ☐ | Feedback cohorte collecté |

---

# Annexes professeur RC16

## A. Pipeline opérationnel par module

| Module | Pipeline |
|--------|----------|
| M1 | PO → GR → STOCK → SO → GI → CC → COMPLIANCE |
| M2 | RÉCEPTION → PUTAWAY → CAPACITÉ → FIFO → INVENTAIRE |
| M3 | CC_LIST → CC_COUNT → CC_RECON → REPLENISH → COMPLIANCE_M3 |
| M4 | KPI_DATA → KPI_ROTATION → KPI_SERVICE → KPI_DIAGNOSTIC → COMPLIANCE_M4 |
| M5 | M5_RECEPTION → M5_PUTAWAY → M5_CC → [M5_ADJ] → M5_REPLENISH → M5_KPI → M5_DECISION → COMPLIANCE_M5 |

## B. Annexe A — Jeu KPI M4 (projeter Classe 8–9)

| Indicateur | Valeur |
|------------|--------|
| Consommation annuelle | 2 400 u. |
| Stock moyen | 400 u. |
| **Rotation** | **6×/an** |
| Commandes honorées | 285/300 |
| **OTIF** | **95 %** |
| Erreurs | 12/300 = **4 %** |
| Lead time | 3,5 j |
| Capital immobilisé | 48 000 $ |

## C. Slides exclues du parcours enseignant RC16

Les diapositives suivantes existent dans le corpus institutionnel (`modules.ts`) — **consolidation TEC.WMS / Mission Control** — mais **ne sont pas enseignées** dans le parcours RC16 (saut pour le rythme ; démos couvertes par les sections « Démonstrations » de chaque classe) :

| Slide | Module | Titre | Action enseignant |
|-------|--------|-------|-------------------|
| M2-S6 | M2 | Consolidation TEC.WMS — Layout entrepôt | **Sauter** — passer de S5 (Classe 3) à S7 (Classe 4) |
| M3-S6 | M3 | Consolidation TEC.WMS — Réapprovisionnement | **Sauter** — passer de S5 (Classe 5) à S7 (Classe 6) |
| M4-S6 | M4 | Consolidation TEC.WMS — Tableaux de bord KPI | **Sauter** — enseigner S1–S5 puis S7 (Classe 9) |

## D. Outils enseignant

| Outil | Route |
|-------|-------|
| Slides | `/teacher/slides` |
| Monitor | `/teacher/monitor` |
| Scenarios | `/teacher/scenarios` |
| Assignments | `/teacher/assignments` |
| Analytics | `/teacher/analytics` |
| Validation M3 | `/teacher/dashboard` |
| Cohort switcher | Shell Fiori (RC15) |

## E. Modes Démo vs Évaluation

| | Démo | Évaluation |
|---|------|------------|
| Certification | Non | **Oui** |
| Scoring | Indicatif | Actif |
| Réponses KPI M4 | Peuvent être révélées | Jamais |
| Usage | Projection prof | TP étudiant |

## F. Sources RC16

| Document | Rôle |
|----------|------|
| `PROFESSOR_EXPERIENCE_AUDIT.md` | Rythme · pauses · difficultés |
| `TECWMS_GUIDE_ENSEIGNANT_PDF_READY.md` | Règles institutionnelles |
| `GUIDE_OFFICIEL_REPONSES_M4_M5.md` | Réponses canoniques |
| `M4_M5_INSTRUCTOR_EXPLANATION_GUIDE.md` | Explications M4/M5 |
| `SCN012`–`SCN017_CANONICAL_RESPONSES.md` | Détail validateurs |
| `docs/releases/RC15_CLASSROOM_READINESS_REPORT.md` | Production ready |
| `docs/audits/CHECKPOINT_CERTIFICATION_GATING_AUDIT.md` | Gates Silver/Gold |
| `Documentation/PEDAGOGICAL_ALIGNMENT_AUDIT.md` | Alignement SCN-001→017 |

---

*Guide Professeur RC16 — Documentation uniquement · Collège de la Concorde · TEC.LOG / TEC.WMS*
