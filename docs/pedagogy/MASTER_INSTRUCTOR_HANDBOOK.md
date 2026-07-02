<div class="cover-page">

<div class="brand">TEC.WMS</div>

<div class="title-block">
<h1>Master Instructor Handbook</h1>
<h1>Manuel maître instructeur</h1>
</div>

<div class="subtitle-block">
<strong>TEC.LOG — Gestion intégrée des stocks et performance logistique</strong><br/>
Collège de la Concorde · Montréal<br/>
Mini-WMS Concorde (TEC.WMS Simulator)
</div>

<div class="meta">
Version RC16 · Document vivant — à enrichir après chaque cohorte<br/>
Compagnon instructeur · Ne remplace pas le Guide Professeur 10 classes<br/>
Juillet 2026
</div>

</div>

<div class="page-break"></div>

# TEC.WMS — Master Instructor Handbook (RC16)

**Type :** Compagnon instructeur institutionnel · document vivant  
**Programme :** TEC.LOG — Collège de la Concorde  
**Plateforme :** Mini-WMS Concorde (TEC.WMS Simulator)  
**Version :** RC16  
**Durée programme :** 30 h · 10 séances × 3 h (150 min effectives + 30 min pauses)

---

## Comment utiliser ce manuel

Ce document est le **compagnon de terrain** de l'instructeur. Il complète — sans remplacer — les ressources officielles :

| Document | Rôle | Chemin |
|----------|------|--------|
| **Guide Professeur 10 classes** | Manœuvre séance par séance | [`GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md`](./GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md) |
| **Résumé exécutif** | Calendrier et gates en un coup d'œil | [`GUIDE_PROFESSEUR_TECWMS_10_CLASSES_SUMMARY.md`](./GUIDE_PROFESSEUR_TECWMS_10_CLASSES_SUMMARY.md) |
| **Guide Enseignant institutionnel** | Cadre pédagogique global | `TECWMS_GUIDE_ENSEIGNANT.pdf` |
| **Ce manuel** | Pratiques, pièges, analogies, observations, amélioration continue | `MASTER_INSTRUCTOR_HANDBOOK.md` |

**Règle d'or :** après chaque séance, remplir au minimum la section *Observations de classe* et, si nécessaire, *Ajustements de timing*. Après chaque cohorte, compléter *Améliorations futures*.

**Ce manuel ne modifie pas :** simulateur · slides · guides étudiants · guides institutionnels existants.

---

## 1. Meilleures pratiques d'enseignement

### 1.1 Principes directeurs TEC.LOG

1. **Une transaction à la fois (M1).** Ne jamais enchaîner PO → GR → SO → GI en une seule démo. Chaque transaction = slide + démo simulateur + question.
2. **Explain → Quiz → Simulate → Debrief.** Respecter la boucle pédagogique institutionnelle sur chaque module.
3. **Mode Évaluation pour la certification.** Démo pour enseigner ; Évaluation pour tout ce qui compte (Silver, Gold, compliance).
4. **Run Report obligatoire (≥ 10 min).** Les slides ne couvrent pas le débrief — c'est là que l'apprentissage se cristallise.
5. **Enseigner depuis le corps des slides M4** et **Annexe A** comme autorité (rotation · OTIF · erreurs).
6. **Validation enseignant M3 avant M4.** Bloquer la cohorte si `teacherValidated` n'est pas fait en fin de Classe 6.
7. **Peak Week comme fil narratif M5.** Jour 1 (tactique) → Jour 2 (crise variance) → Jour 3 (capstone stratégique).

### 1.1.1 Politique institutionnelle de notation (RC16)

Chaque scénario TEC.WMS permet une exécution parfaite de **100/100**. Seuils de passage :

| Module | Seuil |
|--------|-------|
| M1 | 60/100 |
| M2 | 60/100 |
| M3 | 70/100 |
| M4 | 70/100 |
| M5 | 70/100 |

Toute documentation antérieure mentionnant un plafond M4 de 75/100 est **obsolète** — voir baseline RC16.

### 1.1.2 Politique institutionnelle — James Timothy

James Timothy est le **compte de démonstration institutionnel** officiel.

| Usages approuvés | Usages interdits |
|------------------|------------------|
| Démonstrations instructeur | Validation de certification |
| QA et smoke testing | Validation de checkpoint |
| Validation opérationnelle post-déploiement | Notation de production |
| Happy-path et régression M1–M5 | Certification automatique |

Référence : [`GOLDEN_STUDENT_JAMES_TIMOTHY.md`](../testing/GOLDEN_STUDENT_JAMES_TIMOTHY.md).

### 1.1.3 Politique institutionnelle — Cohorte Fondatrice

Les cinq comptes permanents : Darlin Campaz Paredes · Fredy Tamile Lola · Prince Agbodjan Sewa Francis Ghislain · Aissata Soukeina Camara · James Timothy.

Règles : accès permanent · registres historiques préservés · jamais réinitialiser · jamais migrer · jamais réutiliser · certifications et vérification préservées. Les futures cohortes sont **indépendantes**.

### 1.2 Configuration salle

| Écran | Contenu | Route |
|-------|---------|-------|
| **Principal (projection)** | Slides + notes professeur | `/teacher/slides/{1–5}` |
| **Secondaire (démo)** | Simulateur en mode Démo ou Monitor | `/teacher/monitor` |
| **Étudiants** | Shell Fiori · scénarios module | `/student/scenarios` · `/student/module{2–5}` |

- Filtrer le Monitor par **cohorte** avant chaque séance.
- Langue : aligner sur la cohorte ; conserver les codes SAP visibles (ME21N, MIGO, VA01, etc.).
- Distribuer **Annexe A** (M4) avant Classe 9 · **Annexe B** (M5) avant Classe 10.

### 1.3 Patterns d'engagement

| Pattern | Moment | Durée | Comment |
|---------|--------|-------|---------|
| **Think-pair-share** | Après M1-S2, M3-S2 | 2–3 min | « Que se passe-t-il si la GR n'est pas postée ? » |
| **Sondage prédictif** | Avant SCN-002, SCN-007 | 1 min | Vote à main levée |
| **Démo d'erreur live** | M5-S3 / SCN-016 | 5 min | Montrer gate 18a bloqué |
| **Peer Run Report** | Fin de séance | 5 min | Un étudiant explique une pénalité |
| **Tableau blanc ROP** | M3-S2 | 10 min | Calcul collectif : ROP = (D × L) + SS |

### 1.4 Voix de l'instructeur

| À faire | À éviter |
|---------|----------|
| Relier chaque concept à un emploi québécois | Lire les slides mot à mot |
| Nommer l'étape Mission Control avant le TP | Lancer un SCN sans briefing Fiche Mission |
| Célébrer Silver (Classe 7) comme étape majeure | Minimiser M4 (« c'est juste des KPI ») |
| Dire « le moniteur vide en M4 est normal » trois fois | Laisser les étudiants chercher des transactions WMS en M4 |
| Confirmer le mode Évaluation avant chaque TP | Assumer que les étudiants savent la différence Démo/Évaluation |

---

## 2. Gestion de classe

### 2.1 Ouverture de séance (8–10 min)

1. Accueil · objectif du jour (1 phrase).
2. Prérequis : SCN/quiz/validation de la séance précédente.
3. Consignes techniques : connexion · mode · routes du jour.
4. Rappel pause : 2 × 15 min · horaire de reprise affiché.

### 2.2 Gestion des niveaux hétérogènes

| Situation | Action |
|-----------|--------|
| Étudiant avancé termine SCN tôt | Pair tutoring · relire Run Report · aider un pair bloqué |
| Étudiant bloqué > 15 min | OIL Panel F · Fiche Mission · pas de réponse directe — question guidée |
| Retard SCN | Planifier rattrapage Classes 7–8 uniquement |
| Quiz raté gate (M1, M5) | Retake autorisé · revoir slides ciblées · pas de contournement manuel |

### 2.3 Discipline technique

- **Interdiction** de partager comptes ou de faire le SCN à la place de l'étudiant.
- **Interruption** si mode Démo utilisé pour un run certifiable — faire recommencer en Évaluation.
- **Écrans** : surveiller que les étudiants sont sur la bonne route module (pas `/student/scenarios` en M4).

### 2.4 Clôture de séance (8–12 min)

1. Débrief Run Report collectif (pénalités fréquentes du jour).
2. Checklist fin de classe (section 12).
3. Annonce explicite de la séance suivante + prérequis.
4. 2 min pour remplir *Observations de classe* (section 15).

### 2.5 Signaux d'alarme cohorte

| Signal | Seuil | Action |
|--------|-------|--------|
| < 50 % Quiz M1 Classe 1 | Fin C1 | Pause pédagogique · revoir S3–S5 avant SCN |
| Validation M3 incomplète | Fin C6 | Ne pas avancer vers M4 · session rattrapage |
| Silver < 80 % cohorte | Fin C7 | C8 entièrement dédiée rattrapage |
| SCN-016 gate 18a échoué | C10 | Démo collective échec intentionnel |
| OTIF « faible » à 95 % | C9 | Rétablir encadré terminologie M4 |

---

## 3. Mission Control — timing et conduite

Mission Control est le **tableau de bord narratif** du cycle logistique. L'instructeur l'utilise pour ancrer chaque transaction avant le TP.

### 3.1 Quand ouvrir Mission Control

| Classe | Moment | Action Mission Control | Durée |
|--------|--------|------------------------|-------|
| **1** | Après M1-S2 | Carte du cycle 7 étapes · aperçu SCN-001 | 5–8 min |
| **1** | Après S3–S5 | Surbrillance PO → GR → Stock sur la carte | 3 min chacune |
| **2** | S9 | Présentation ordre SCN-001→005 · panneaux OIL | 10–12 min |
| **3** | Après M2-S1 | Zones entrepôt ↔ REC-01 · STOCKAGE | 5 min |
| **5** | Après M3-S2 | Graphique MIN/MAX/ROP · déclenchement PO | 8 min |
| **6** | Avant SCN-011 | Pipeline 5 steps M3 · REPLENISH | 5 min |
| **8** | Preview M4 | **Moniteur TX vide** — mode analytique | 5 min |
| **9** | S1 | KPI tower sans transactions | 5 min |
| **10** | S1–S4 | Peak Week J1→J2→J3 sur la timeline | 8 min |

### 3.2 Séquence type Mission Control (M1)

```
1. Ouvrir Démo · SCN-001
2. Mission Control → montrer les 7 étapes du flux
3. Cliquer PO → expliquer ME21N équivalent
4. Avancer GR → distinguer posté / PENDING
5. Montrer Stock (MMBE) → soldes par bin
6. Fermer sans terminer le run — les étudiants feront le TP complet
```

### 3.3 Panneaux OIL — usage instructeur

| Panneau | Usage | Quand |
|---------|-------|-------|
| **A** | Données de référence · Annexe | M4 · M5 |
| **B** | Contexte scénario | Avant chaque nouveau SCN |
| **C** | Étapes Mission Sheet | Pendant TP si étudiant perdu |
| **D** | Formules · seuils | M3 ROP · M4 KPI |
| **E** | Compliance · blockers | Débrief · SCN raté |
| **F** | Points de contrôle pédagogiques | Intervention ciblée |

### 3.4 Erreurs fréquentes Mission Control

| Erreur | Conséquence | Correction |
|--------|-------------|------------|
| Terminer le run en démo avant le TP | Étudiants voient la solution | S'arrêter à mi-parcours |
| Ne pas nommer l'étape active | Étudiants sautent des steps | « Nous sommes à l'étape GR_POST » |
| Ignorer OIL Panel F | Retards non détectés | Vérifier control points avant pause |
| Montrer transactions en M4 | Confusion mode analytique | KPI tower seulement |

---

## 4. Simulateur — timing et conduite

### 4.1 Modèle horaire type (150 min effectives)

| Bloc | Minutes | Contenu |
|------|---------|---------|
| Accueil + objectif | 8–10 | Prérequis · consignes |
| Slides + démos | 50–70 | Une démo après chaque concept clé |
| **Pause 1** | **15** | Après bloc slides |
| Quiz (si prévu) | 15–20 | Autonome · surveiller connexion |
| TP simulateur | 60–100 | SCN du jour en Évaluation |
| **Pause 2** | **15** | Milieu ou fin TP selon classe |
| Débrief Run Report | 10–15 | Obligatoire |
| Buffer / questions | 5–10 | Marge imprévus |
| **Total enseignement** | **150** | + 30 min pauses = 180 min |

### 4.2 Durées cibles par SCN (assignation primaire)

| SCN | Classe | Durée TP | Seuil | Mode |
|-----|--------|----------|-------|------|
| SCN-001 | 1 | 24 min | 60 | Évaluation |
| SCN-002 | 1 | 20 min | 60 | Évaluation |
| SCN-003 | 2 | 20 min | 60 | Évaluation |
| SCN-004 | 2 | 22 min | 60 | Évaluation |
| SCN-005 | 2 | 30 min | 60 | Évaluation |
| SCN-006 | 3 | 35 min | 60 | Évaluation |
| SCN-007 | 3 | 30 min | 60 | Évaluation |
| SCN-008 | 4 | 50 min | 60 | Évaluation |
| SCN-009 | 5 | 35 min | 70 | Évaluation |
| SCN-010 | 5 | 35 min | 70 | Évaluation |
| SCN-011 | 6 | 40 min | 70 | Évaluation |
| SCN-012 | 9 | 25 min | 70 | Évaluation |
| SCN-013 | 9 | 25 min | 70 | Évaluation |
| SCN-014 | 9 | 27 min | 70 | Évaluation |
| SCN-015 | 10 | 35 min | 70 | Évaluation |
| SCN-016 | 10 | 40 min | 70 | Évaluation |
| SCN-017 | 10 | 35 min | 70 | Évaluation |

### 4.3 Avant de lancer un TP

| ☐ | Vérification |
|---|--------------|
| ☐ | Badge **Évaluation** visible (pas Démo) |
| ☐ | Fiche Mission lue collectivement (30 sec par étape) |
| ☐ | Prérequis SCN précédent complété |
| ☐ | Monitor filtré · cohorte correcte |
| ☐ | Étudiants savent où trouver OIL panels |

### 4.4 Pendant le TP

- **Minute 0–5 :** silence relatif — laisser explorer.
- **Minute 5–15 :** premières interventions ciblées (compliance, mode).
- **Minute 15+ :** identifier les 2–3 étudiants les plus en retard via Monitor.
- **Ne jamais** donner la séquence complète — pointer vers OIL Panel C.

### 4.5 Débrief Run Report — structure

1. Demander : « Quelle pénalité la plus fréquente aujourd'hui ? »
2. Projeter un Run Report anonyme ou celui d'un volontaire.
3. Relier pénalité → concept slide du jour.
4. Noter la pénalité #1 dans *Observations de classe*.

---

## 5. Stratégie checkpoints

Les checkpoints TEC.WMS opèrent à **trois niveaux** distincts :

| Niveau | Quoi | Où vérifier |
|--------|------|-------------|
| **Progression module** | `module_progress.passed` | `/teacher/monitor` |
| **Validation enseignant** | `teacherValidated` (M3) | `/teacher/dashboard` |
| **Certification** | Silver 4 gates · Gold 18 gates | `/student/certifications/silver` · `gold` |

### 5.1 Calendrier des checkpoints critiques

| Checkpoint | Classe | Critère | Action si échec |
|------------|--------|---------|-----------------|
| Quiz M1 | 1 | ≥ 60 % | Retake · bloque Silver G1 |
| SCN-001→005 | 1–2 | Chacun ≥ 60 · compliance | Rattrapage C7–8 |
| M1 passed | 2 | Tous SCN M1 | Bloque M2 |
| SCN-006→008 | 3–4 | ≥ 60 | Rattrapage C7–8 |
| SCN-009→011 | 5–6 | ≥ 70 | Rattrapage C7–8 |
| **Validation M3** | **6** | `teacherValidated = true` | **Bloque M4 eval** |
| Silver 4/4 | 7 | G1∧G2∧G3∧G4 | C8 consolidation |
| teacherValidated 100 % | 8 | File vide | Urgence avant C9 |
| SCN-012→014 | 9 | ≥ 70 | Rattrapage si temps |
| Quiz M5 | 10 | ≥ 60 % | Bloque Gold gate 2 |
| Gold 18/18 | 10 | Tous gates | ELIGIBLE → AWARDED |

### 5.2 Routine Monitor (5 min en fin de séance)

```
1. Filtrer cohorte
2. Trier par « incomplete » ou score < seuil
3. Exporter mentalement la liste retardataires
4. Vérifier compliance et blockers sur runs ratés
5. Mettre à jour checklist post-classe
```

### 5.3 Checkpoints pédagogiques (OIL Panel F)

Les control points sur la Fiche Mission sont des **aides pédagogiques**, pas des gates serveur. Utiliser pour guider, pas pour noter manuellement.

---

## 6. Stratégie Silver

### 6.1 Les 4 gates Silver

| Gate | Condition | Classe cible | Formule |
|------|-----------|--------------|---------|
| **G1** | Quiz M1 ≥ 60 % | 1 | Meilleure tentative |
| **G2** | SCN-001→005 chacun ≥ 60/100 (Évaluation) | 1–2 | Tous au seuil |
| **G3** | Compliance M1 validée sur chaque SCN | 1–2 | Steps compliance OK |
| **G4** | Aucun blocker (TX non postées, CC ouvert) | 1–2 | Intégrité transactionnelle |

**`silverEligible = G1 ∧ G2 ∧ G3 ∧ G4`**

### 6.2 Timeline Silver recommandée

| Classe | Action Silver |
|--------|---------------|
| 1 | Gate G1 (Quiz) · début G2 (SCN-001, 002) |
| 2 | Compléter G2 · G3 · G4 · visite page Silver |
| 3–6 | Maintenir intégrité · pas de regression |
| **7** | **Séance Silver** — diagnostic 4/4 · rattrapage |
| 8 | Confirmer AWARDED/ELIGIBLE · préparer Gold path |

### 6.3 Script Classe 7 (consolidation Silver)

> « Silver = maîtrise opérationnelle du module 1. Ce n'est pas la fin du programme — c'est la preuve que vous pouvez exécuter PO, GR, stock, SO, GI et cycle count sans contaminer la chaîne. Gold viendra après M2–M5. Aujourd'hui : 4 cases vertes pour tous. »

### 6.4 Dépannage Silver par gate

| Gate bloqué | Cause #1 | Intervention |
|-------------|----------|--------------|
| G1 | Quiz < 60 % | Retake · revoir S1–S5 |
| G2 | Un SCN < 60 | Rejouer SCN ciblé en Évaluation |
| G3 | Compliance fail | Run Report · TX non postées |
| G4 | Blocker actif | GR PENDING · CC non réconcilié |

### 6.5 Communication institutionnelle

- Confirmer `studentNumber` pour le registre avant attribution.
- Démontrer credential live : `/student/certifications/silver` — PDF, QR `/verify/{id}`, partage LinkedIn si AWARDED.
- Silver AWARDED ≠ PDF officiel signé — expliquer le workflow institutionnel si question.

---

## 7. Stratégie Gold

### 7.1 Prérequis absolu

**Silver attribué** (`profiles.silverCertified = true`). Sans Silver, Gold reste **LOCKED** — les 18 gates sont ignorés.

### 7.2 Les 18 gates Gold (résumé)

| # | Gate | Détail |
|---|------|--------|
| 1 | Silver prerequisite | Silver attribué |
| 2 | Quiz M5 ≥ 60 % | Meilleure tentative M5 |
| 3–14 | SCN-006 → SCN-017 | Chaque SCN ≥ seuil module (M2≥60, M3/M4/M5≥70) |
| 15 | Compliance M2–M5 | Steps COMPLIANCE_ADV, M3, M4, M5 |
| 16 | No blockers | TX non postées / CC non résolus |
| 17 | Module compliance validators | Validateurs profonds M3–M5 |
| 18a | SCN-016 variance gate | M5_ADJ **avant** M5_KPI si KPI complété |
| 18b | SCN-017 capstone | Score ≥ 70 + KPI snapshot + M5_DECISION liée |

### 7.3 Machine d'états

```
LOCKED → IN_PROGRESS → ELIGIBLE → AWARDED
```

| État | Signification instructeur |
|------|---------------------------|
| LOCKED | Pas de Silver — ne pas parler Gold |
| IN_PROGRESS | Silver OK · gates partiels — diagnostic page Gold |
| ELIGIBLE | 18/18 · prêt pour attribution institutionnelle |
| AWARDED | `goldCertified = true` |

### 7.4 Timeline Gold

| Classes | Contribution Gold |
|---------|-------------------|
| 3–4 | SCN-006→008 (gates 3–5) |
| 5–6 | SCN-009→011 (gates 6–8) |
| 7–8 | Rattrapage si retard · pas de nouveau gate |
| 9 | SCN-012→014 (gates 9–11) |
| **10** | Quiz M5 (gate 2) · SCN-015→017 (gates 12–14) · 18a/18b |

### 7.5 Classe 10 — séquence Peak Week obligatoire

| Ordre | SCN | Narratif | Piège #1 |
|-------|-----|----------|----------|
| 1 | SCN-015 | Jour 1 tactique | Réappro Q ≠ 0 |
| 2 | SCN-016 | Jour 2 crise | KPI avant M5_ADJ (gate 18a) |
| 3 | SCN-017 | Jour 3 capstone | Décision sans 2 KPI chiffrés |

**Démo obligatoire RC16 :** échec intentionnel SCN-016 (continuer vers KPI sans M5_ADJ) → montrer blocage gate 18a → puis chemin correct.

### 7.6 Script clôture Gold

> « Gold Premium TEC.WMS atteste un parcours intégré M1 à M5 : opérations, entrepôt, contrôle des stocks, analyse KPI et gestion de crise Peak Week. Vérifiez vos 18 gates sur `/student/certifications/gold`. Si ELIGIBLE → AWARDED : PDF, vérification publique `/verify/{id}` et partage LinkedIn disponibles. »

---

## 8. Erreurs fréquentes des étudiants

### 8.1 Module 1 — Fondements ERP/WMS

| Erreur | SCN / contexte | Signe | Correction instructeur |
|--------|----------------|-------|------------------------|
| Mode Démo pour cert | Tous M1 | Run non compté | Vérifier badge Évaluation |
| GR non postée | SCN-002 | Blocker G4 | Revoir S4 · moniteur PENDING |
| Confusion posté / en attente | SCN-002 | Compliance fail | Démo live GR_POST vs PENDING |
| Saisir delta au lieu de physique | SCN-004 | Score bas | Rappel S8 : « quantité comptée » |
| Expédier avant réappro | SCN-003 | Stock vide | Ordre : réappro puis GI |
| Ordre de résolution chaotique | SCN-005 | Multi-pénalités | OIL Panel · une anomalie à la fois |
| Surcharge codes SAP | S3–S8 | Regard vide | Une transaction = une séance |

### 8.2 Module 2 — Exécution entrepôt

| Erreur | SCN | Signe | Correction |
|--------|-----|-------|------------|
| Adressage bin incorrect | SCN-006 | Putaway rejeté | Format zone-allée-niveau-bin |
| Forcer 501e unité | SCN-007 | Compliance | Capacité max 500 — redistribuer |
| Confusion putaway / picking | SCN-006/008 | Mauvaise étape | M2 = putaway · SCN-008 = pick FIFO |
| Surprise putaway auto-complete | SCN-008 | Panique | Expliquer **avant** lancer : pick seulement |
| Violation FIFO | SCN-008 | Compliance bloquée | Lot le plus ancien d'abord |

### 8.3 Module 3 — Contrôle des stocks

| Erreur | SCN | Signe | Correction |
|--------|-----|-------|------------|
| Formule ROP mal appliquée | SCN-011 | Réappro incorrect | Tableau blanc : ROP = (D×L)+SS |
| ADJ hors CC_RECON | SCN-010 | Step introuvable | ADJ intégré dans réconciliation |
| Justification trop courte | SCN-010 | Validator | Longueur minimale exigée |
| Oublier REPLENISH | SCN-011 | Pipeline incomplet | 5 steps dont REPLENISH obligatoire |
| Panique math | S2–S3 | Blocage | Calculer ensemble au tableau |

### 8.4 Module 4 — KPI analytique

| Erreur | SCN | Signe | Correction |
|--------|-----|-------|------------|
| « 6× = surstock » | SCN-012 | Validator bloque | Bande normale 4–12× |
| Mot *surstock* dans réponse | SCN-012 | Rejet | Mot-clé : *normale* |
| OTIF seul sans erreurs | SCN-013 | Score partiel | Analyse duale 95 % + 4 % |
| « 95 % service faible » | SCN-013 | Erreur factuelle | 95 % = excellent |
| Liste de souhaits S&OP | SCN-014 | Pas de décision | Une initiative · trade-off nommé |
| Chercher transactions WMS | M4 global | Perte de temps | Moniteur vide = normal |
| Copier Annexe A sans lire | SCN-012–014 | Réponses génériques | Interpréter les bandes |

### 8.5 Module 5 — Peak Week

| Erreur | SCN | Signe | Correction |
|--------|-----|-------|------------|
| KPI avant ajustement variance | SCN-016 | Gate 18a fail | CC → variance → M5_ADJ → KPI |
| Réappro Q > 0 | SCN-015 | Pénalité | Q = 0 en Peak tactique |
| Capstone sans KPI chiffrés | SCN-017 | Gate 18b | ≥ 2 KPI avec valeurs |
| Sauter SCN-016 | Parcours | Gates incomplets | Ordre 015 → 016 → 017 |
| Quiz M5 reporté | C10 | Gate 2 bloqué | Quiz en début de C10 |

---

## 9. Foire aux questions (FAQ instructeur)

### 9.1 Programme et certification

**Q : Un étudiant peut-il obtenir Silver sans Quiz M1 ?**  
R : Non. G1 exige Quiz M1 ≥ 60 % (meilleure tentative).

**Q : Les quiz M2, M3, M4 comptent-ils pour la certification ?**  
R : Non. Renforcement pédagogique seulement. Seuls Quiz M1 (Silver) et M5 (Gold) sont des gates.

**Q : Quelle différence entre ELIGIBLE et AWARDED ?**  
R : ELIGIBLE = tous les critères techniques satisfaits. AWARDED = flag persisté `silverCertified` ou `goldCertified` selon workflow institutionnel.

**Q : Un run en mode Démo compte-t-il ?**  
R : Non. Toujours Évaluation pour certification.

**Q : Peut-on valider M3 manuellement sans SCN-011 ?**  
R : Non recommandé. La validation confirme la maîtrise M3 complète incluant SCN-011.

### 9.2 Simulateur et technique

**Q : Où voir la progression d'un étudiant ?**  
R : `/teacher/monitor` filtré par cohorte.

**Q : Comment débloquer M4 pour un étudiant ?**  
R : `teacherValidated = true` sur M3 via `/teacher/dashboard` — pas de raccourci admin.

**Q : Pourquoi le score M4 peut-il sembler inférieur à 100 ?**  
R : Politique institutionnelle RC16 — chaque scénario permet **100/100** en exécution parfaite. Le seuil de passage M4 reste **70/100**. Si un étudiant voit un score partiel, vérifier les interprétations KPI et la compliance dans le Run Report.

**Q : SCN-008 : pourquoi le putaway est déjà fait ?**  
R : Focus pédagogique FIFO picking — le rangement a été complété en amont.

### 9.3 Pédagogie

**Q : Dois-je enseigner les slides M2-S6, M3-S6, M4-S6 ?**  
R : Non. Exclues du parcours TEC.WMS RC16 (ERP externe / hors simulateur).

**Q : Combien de temps sur les slides vs simulateur ?**  
R : Cible ~50–70 min slides+démos · ~60–100 min TP · le `timingMin` des slides (79 min total) est un plancher, pas le budget complet.

**Q : Que faire si la cohorte est en retard après Classe 6 ?**  
R : Classes 7–8 = rattrapage. Ne pas compresser M4/M5 en sacrifice qualité.

**Q : Peut-on faire M5 sans M4 ?**  
R : Le serveur peut permettre M5 si M1 passed ; M4 est fortement recommandé — ne pas sauter pédagogiquement.

---

## 10. Explications suggérées (scripts courts)

### 10.1 Cycle ERP/WMS (M1)

| Concept | Script FR (30–45 sec) |
|---------|----------------------|
| **PO** | « La commande d'achat est le contrat d'entrée. Sans PO validée, rien n'entre en entrepôt — c'est la porte d'entrée du bâtiment. » |
| **GR** | « La réception transforme la promesse en stock réel. Postée = officielle pour le système. En attente = le stock n'existe pas encore pour le WMS. » |
| **Stock** | « MMBE, c'est le tableau de bord. Si le système dit 200 et le rayon en a 185, vous avez une variance — et un problème de confiance. » |
| **SO** | « La commande client crée la demande. Le WMS reçoit le signal : préparez cette expédition. » |
| **GI** | « L'expédition fait quitter la marchandise. Erreur ici = client mécontent, OTIF en baisse. » |
| **CC** | « Le cycle count ferme la boucle. Vous saisissez ce que vous **comptez**, pas l'écart — le système calcule la variance. » |

### 10.2 Entrepôt (M2)

| Concept | Script |
|---------|--------|
| **Zones** | « Neuf zones, neuf fonctions. REC-01 alimente le stockage — comme les quais d'un entrepôt Amazon. » |
| **Bins** | « Chaque adresse est unique : zone, allée, niveau, bin. Mauvaise adresse = produit perdu dans le système. » |
| **Capacité** | « Un bin à 500 unités n'en accepte pas 501. Le WMS doit refuser ou redistribuer — comme un stationnement plein. » |
| **FIFO** | « Premier entré, premier sorti. En alimentaire et pharma, vendre le plus récent en premier peut déclencher un rappel. » |

### 10.3 Contrôle stocks (M3)

| Concept | Script |
|---------|--------|
| **ROP** | « Le point de commande, c'est le niveau où vous déclenchez la PO : assez tôt pour ne pas tomber en rupture, pas trop tôt pour ne pas immobiliser du cash. » |
| **Safety Stock** | « C'est l'assurance. Plus vous voulez de fiabilité, plus le coussin est épais — mais ça coûte. » |
| **Variance** | « Au-delà de 2 %, le système n'est plus fiable. Vous investiguez d'abord, vous ajustez ensuite avec justification. » |

### 10.4 KPI (M4)

| Concept | Script |
|---------|--------|
| **Rotation 6×** | « 2400 $ de ventes sur 400 $ de stock = 6 rotations par an. C'est dans la bande normale — pas du surstock. » |
| **OTIF 95 %** | « 95 % des commandes à temps et complètes, c'est excellent. Le piège : ignorer les 4 % d'erreurs d'exécution. » |
| **S&OP** | « Le conseil n'a pas budget pour tout. Une initiative, un trade-off nommé — c'est une décision, pas une liste de souhaits. » |

### 10.5 Peak Week (M5)

| Concept | Script |
|---------|--------|
| **Jour 1** | « Opération tactique sous pression — exécuter vite, mais proprement. » |
| **Jour 2** | « Crise variance : régler l'écart **avant** de lire les KPI. Sinon vous analysez des données fausses. » |
| **Jour 3** | « Audit stratégique : prouver avec des chiffres et recommander une décision. » |

---

## 11. Exemples entrepôt (simulateur)

| SCN | Situation entrepôt | Ce que l'étudiant vit |
|-----|-------------------|----------------------|
| SCN-001 | Réception nominale d'une PO | Cycle complet sans anomalie |
| SCN-002 | Camion parti, GR non postée | Stock fantôme · blocker |
| SCN-003 | Rupture avant expédition | Réapprovisionnement urgent |
| SCN-004 | Comptage : −15 unités | Saisie physique 185 vs système 200 |
| SCN-005 | Multi-anomalies simultanées | Priorisation document / physique / expédition |
| SCN-006 | Palett 150 u. à ranger | Putaway vers STOCKAGE |
| SCN-007 | Bin saturé 600/500 | Rejet capacité |
| SCN-008 | 3 lots, dates différentes | Pick FIFO obligatoire |
| SCN-009 | Cycle count simple | CC_LIST → COUNT → RECON |
| SCN-010 | Variance significative | ADJ avec justification |
| SCN-011 | Stock sous ROP | REPLENISH automatique |
| SCN-012 | Analyse rotation SKU | Recommandation maintien |
| SCN-013 | Dashboard vert, erreurs cachées | OTIF + taux d'erreur |
| SCN-014 | Conseil S&OP | Trade-off budgétaire |
| SCN-015 | Peak J1 | Opération intégrée |
| SCN-016 | Peak J2 variance | MI07 avant KPI |
| SCN-017 | Peak J3 audit | Capstone décision |

---

## 12. Exemples logistiques réels (Québec)

Utiliser ces références pour ancrer la théorie — **sans prétendre que le simulateur reproduit ces systèmes à l'identique**.

| Entreprise / secteur | Lien pédagogique | Exemple à citer en classe |
|---------------------|------------------|---------------------------|
| **Amazon YUL4 / centres QC** | PO → GR → pick → GI | « Chaque colis suit le même flux que nos 7 étapes — à l'échelle millions. » |
| **Sobeys / alimentaire** | FIFO · capacité · froid | « FIFO n'est pas qu'une règle — un lot expiré = rappel et réputation. » |
| **Couche-Tard / distribution** | ROP · réappro · rupture | « Une rack vide en dépanneur, c'est une rupture — comme SCN-003. » |
| **Metro / SCN logistique** | OTIF · service client | « 95 % OTIF, c'est le genre de SLA que les grandes bannières négocient. » |
| **Pfizer / pharma (Boucherville)** | Compliance · traçabilité | « Une TX non postée en pharma, c'est un audit réglementaire. » |
| **Logistec / portuaire** | Rotation · immobilisation | « Rotation 6× = combien de fois l'argent revient par an dans le stock. » |
| **Canada Post / dernier km** | GI · expédition | « VL02N équivalent : la marchandise a quitté le bâtiment — engagement client. » |
| **PME québécoise 50 employés** | SAP Business One / Odoo | « Le simulateur vous prépare au langage SAP — en PME, les mêmes idées, outils différents. » |

---

## 13. Analogies pédagogiques

| Concept | Analogie | Limite à mentionner |
|---------|----------|---------------------|
| **PO** | Bon de commande au restaurant — sans bon, la cuisine ne prépare rien | Le restaurateur peut improviser ; l'entrepôt non |
| **GR non postée** | Colis livré mais pas déballé — pas dans le garde-manger | — |
| **Stock système vs physique** | Solde bancaire vs argent dans le portefeuille | Réconciliation = relevé bancaire |
| **SO** | Commande Uber Eats — le resto sait quoi préparer | — |
| **GI** | Colis remis au livreur | Point de non-retour client |
| **Cycle count** | Inventaire annuel du garde-manger | Compte ce qui est là, pas ce qui manque sur papier |
| **Bin / adresse** | Case aux lettres — mauvaise case = courrier perdu | — |
| **Capacité bin** | Stationnement 500 places — la 501e voiture ne rentre pas | — |
| **FIFO** | File d'attente — premier arrivé, premier servi | — |
| **Safety Stock** | Roue de secours | Coûte de la place et du poids |
| **ROP** | Seuil « réapprovisionner le lait » dans le frigo | Déclencheur automatique en WMS |
| **Rotation** | Combien de fois l'inventaire du magasin « tourne » par an | — |
| **OTIF** | Livraison Amazon « à temps et complète » | — |
| **Gate 18a SCN-016** | Lire le thermomètre avant de diagnostiquer la maladie | KPI sur données fausses = mauvaise décision |
| **Mode Démo vs Évaluation** | Entraînement vs match officiel | Seul le match compte pour le classement |

---

## 14. Checklist pré-classe

| ☐ | Action | Notes |
|---|--------|-------|
| ☐ | Cohorte créée · Monitor filtré | |
| ☐ | Fiche classe du jour relue (Guide RC16) | Classe : _____ |
| ☐ | Slides testées · notes professeur visibles | Route : `/teacher/slides/_` |
| ☐ | Simulateur accessible · mode Démo testé | |
| ☐ | Quiz du jour accessible (M1 C1 · M5 C10) | |
| ☐ | Annexe A distribuée (avant C9) | |
| ☐ | Annexe B distribuée (avant C10) | |
| ☐ | Liste prérequis vérifiée (SCN précédents) | |
| ☐ | Projection double écran configurée | |
| ☐ | Horloge visible · pauses 15+15 annoncées | |

**Notes pré-classe :**

```
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
```

---

## 15. Checklist post-classe

| ☐ | Action | Fait ? |
|---|--------|--------|
| ☐ | SCN du jour complétés ou plan rattrapage (C7–8) noté | |
| ☐ | Quiz gate (M1 C1 / M5 C10) vérifié si applicable | |
| ☐ | Validation M3 enregistrée (C6) si applicable | |
| ☐ | Silver 4/4 vérifié (C7) si applicable | |
| ☐ | Débrief Run Report ≥ 10 min réalisé | |
| ☐ | Prérequis séance suivante confirmés | |
| ☐ | Liste retardataires mise à jour | |
| ☐ | Observations de classe remplies (§17) | |
| ☐ | Ajustements timing notés (§18) | |

**Notes post-classe :**

```
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
```

---

## 16. Checklist fin de classe (par séance)

| Classe | Focus | ☐ Critique |
|--------|-------|------------|
| **1** | Quiz M1 ≥ 60 % · SCN-001/002 ≥ 60 Évaluation | ☐ |
| **2** | SCN-001→005 complets · page Silver visitée | ☐ |
| **3** | SCN-006/007 ≥ 60 | ☐ |
| **4** | SCN-008 · M2 passed | ☐ |
| **5** | SCN-009/010 ≥ 70 | ☐ |
| **6** | SCN-011 · **validation M3 100 %** | ☐ |
| **7** | Silver AWARDED/ELIGIBLE tous | ☐ |
| **8** | teacherValidated 100 % · Annexe A · preview M4 | ☐ |
| **9** | SCN-012→014 ≥ 70 · terminologie M4 | ☐ |
| **10** | Quiz M5 · SCN-015→017 · Gold 18/18 diagnostic | ☐ |

**Débrief Run Report (toutes séances) :**

| ☐ | Question posée | Réponse / thème |
|---|----------------|-----------------|
| ☐ | Pénalité #1 du jour ? | |
| ☐ | Concept slide à revoir ? | |
| ☐ | Volontaire Run Report ? | |

---

## 17. Observations de classe (journal)

*Remplir après chaque séance. Copier le bloc pour chaque entrée.*

---

### Séance : Classe ___ · Date : ___________ · Instructeur : ___________

**Ce qui a bien fonctionné :**

```
_____________________________________________________________________________
_____________________________________________________________________________
```

**Points de friction :**

```
_____________________________________________________________________________
_____________________________________________________________________________
```

**Erreur #1 des étudiants aujourd'hui :**

```
_____________________________________________________________________________
```

**Étudiants en retard (noms / SCN) :**

```
_____________________________________________________________________________
```

**Action pour la prochaine séance :**

```
_____________________________________________________________________________
```

---

### Séance : Classe ___ · Date : ___________ · Instructeur : ___________

**Ce qui a bien fonctionné :**

```
_____________________________________________________________________________
_____________________________________________________________________________
```

**Points de friction :**

```
_____________________________________________________________________________
_____________________________________________________________________________
```

**Erreur #1 des étudiants aujourd'hui :**

```
_____________________________________________________________________________
```

**Étudiants en retard (noms / SCN) :**

```
_____________________________________________________________________________
```

**Action pour la prochaine séance :**

```
_____________________________________________________________________________
```

---

## 18. Ajustements de timing (journal)

*Le Guide RC16 donne les cibles. Noter ici les écarts réels pour calibrer la cohorte suivante.*

| Classe | Bloc | Durée prévue (min) | Durée réelle (min) | Δ | Ajustement prochaine fois |
|--------|------|--------------------|--------------------|---|---------------------------|
| | Accueil | | | | |
| | Slides + démos | | | | |
| | Pause 1 | 15 | | | |
| | Quiz | | | | |
| | TP SCN | | | | |
| | Pause 2 | 15 | | | |
| | Débrief | | | | |
| | **Total effectif** | **150** | | | |

| Classe | Bloc | Prévu | Réel | Δ | Ajustement |
|--------|------|-------|------|---|------------|
| | | | | | |
| | | | | | |
| | | | | | |
| | | | | | |

---

## 19. Améliorations futures par cohorte

*Synthèse en fin de cohorte — alimenter la prochaine édition de ce manuel.*

### Cohorte : _____________ · Période : _____________ · Instructeur(s) : _____________

| # | Domaine | Observation | Amélioration proposée | Priorité (H/M/B) |
|---|---------|-------------|----------------------|------------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

**Top 3 à transmettre à l'équipe pédagogique TEC.LOG :**

1. _____________________________________________________________________________
2. _____________________________________________________________________________
3. _____________________________________________________________________________

**Taux de certification (cohorte) :**

| Métrique | Valeur |
|----------|--------|
| Silver AWARDED / effectif | ___ / ___ |
| Gold ELIGIBLE / effectif | ___ / ___ |
| Gold AWARDED / effectif | ___ / ___ |
| SCN le plus échoué | _____________ |
| Gate le plus bloqué | _____________ |

---

## 20. Notes libres instructeur

```
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
```

---

## Annexe — Référence rapide routes

| Rôle | Ressource | Route |
|------|-----------|-------|
| Slides M1–M5 | Projection | `/teacher/slides/{1–5}` |
| Monitor cohorte | Suivi live | `/teacher/monitor` |
| Validation M3 | Gate M4 | `/teacher/dashboard` |
| SCN M1 | Étudiant | `/student/scenarios` |
| SCN M2–M5 | Étudiant | `/student/module{2–5}` |
| Silver | Certification | `/student/certifications/silver` |
| Gold | Certification | `/student/certifications/gold` |
| Quiz | Par module | `/student/quiz/{1–5}` |

---

## Historique du document

| Version | Date | Changements |
|---------|------|-------------|
| RC16 | 2026-07-01 | Création initiale — compagnon instructeur vivant |

---

*TEC.WMS Master Instructor Handbook · RC16 · Collège de la Concorde · Documentation pédagogique — ne pas modifier simulateur, slides ni guides officiels.*
