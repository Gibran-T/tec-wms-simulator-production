# TEC.WMS — Operational Playbook RC16

**Document type:** Official operational playbook — instructor-facing  
**Workstream:** RC16.4 — Classroom Operational Playbook  
**Programme:** TEC.LOG — Gestion intégrée des stocks et performance logistique  
**Institution:** Collège de la Concorde — Montréal  
**Plateforme:** Mini-WMS Concorde (TEC.WMS Simulator)  
**Production URL (Railway):** `https://tec-wms-simulator-production-production.up.railway.app`  
**Version:** RC16 · Juillet 2026  
**Mode:** Documentation only — **no deployment · no production changes · no commits implied**

---

## Authority and scope

This playbook is the **official pre-class, in-class, and post-class procedure** for every TEC.WMS instructional session. It complements — without replacing — the following institutional documents:

| Document | Role |
|----------|------|
| [`GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md`](../pedagogy/GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md) | Séance par séance — contenu pédagogique |
| [`GUIDE_PROFESSEUR_QUICK_REFERENCE.md`](../pedagogy/GUIDE_PROFESSEUR_QUICK_REFERENCE.md) | Consultation rapide en direct |
| [`MASTER_INSTRUCTOR_HANDBOOK.md`](../pedagogy/MASTER_INSTRUCTOR_HANDBOOK.md) | Compagnon vivant — observations et amélioration continue |
| [`GUIDE_MONITORING_COHORTE_TECWMS.md`](../../GUIDE_MONITORING_COHORTE_TECWMS.md) | Suivi cohorte et gouvernance certification |
| [`GOLDEN_STUDENT_JAMES_TIMOTHY.md`](../testing/GOLDEN_STUDENT_JAMES_TIMOTHY.md) | Compte démonstration institutionnel |
| [`RC15_CLASSROOM_READINESS_REPORT.md`](../releases/RC15_CLASSROOM_READINESS_REPORT.md) | Baseline production GO — Classroom Ready |

**Public :** instructeurs, coordonnateurs pédagogiques, opérateurs plateforme.  
**Règle d'or :** si un item de ce playbook échoue **≤ 30 minutes avant la séance**, reporter ou basculer sur le plan de contingence institutionnel — ne pas enseigner sur une plateforme non vérifiée.

---

## Quick reference — routes instructeur

| Outil | Route | Usage |
|-------|-------|-------|
| Tableau de bord (Teacher Dashboard) | `/teacher` | Vue consolidée cohorte |
| Slides | `/teacher/slides/{1–5}` | Projection séance |
| Cohortes | `/teacher/cohorts` | Roster, création, affectation |
| Scénarios | `/teacher/scenarios` | Catalogue · mode démo |
| Devoirs | `/teacher/assignments` | Attribution par cohorte |
| Étudiants | `/teacher/students` | Roster détaillé |
| **Monitor** | `/teacher/monitor` | Supervision en direct des runs |
| **Analytics** | `/teacher/analytics` | Distribution scores · complétion |
| Mission Control (étudiant) | `/student/mission-control/{runId}` | Cockpit run — démo ou inspection |
| Run Report | Depuis Monitor → run complété | Débrief post-run |
| Certifications | `/student/certifications` | Silver / Gold — démo ou vérification |

**Seuils module :** M1/M2 ≥ 60/100 · M3/M4/M5 ≥ 70/100 · score parfait **100/100** par scénario (politique institutionnelle RC16).  
**Mode certification :** **Évaluation** uniquement (`isDemo: false`).

---

# PARTIE I — PRE-CLASS (≥ 30 min avant la séance)

Exécuter **dans l'ordre**. Arrêter et escalader si un item **bloquant** échoue.

## 1.1 Production verification

| # | Vérification | Méthode | Bloquant |
|---|--------------|---------|----------|
| P-01 | URL production charge | `GET /` → HTTP 200 | Oui |
| P-02 | Page login charge | `GET /login` → HTTP 200, pas d'erreur JS console | Oui |
| P-03 | Santé API | `GET /api/trpc/system.health` → `ok: true` | Oui |
| P-04 | Bundle RC16 actif | Pas de chaînes Odoo dans l'interface (M2-S6, M3-S6, M4-S6 = consolidation TEC.WMS) | Oui |
| P-05 | Scénarios SCN-001 → SCN-017 accessibles | Liste modules M1–M5 charge pour compte étudiant test | Oui |
| P-06 | Validateurs M4/M5 actifs | `ENABLE_M4_COMPLIANCE_VALIDATOR` et `ENABLE_M5_COMPLIANCE_VALIDATOR` ≠ `false` | Oui |
| P-07 | Politique Gold | Confirmer si `ENABLE_GOLD_UNLOCK=true` (auto-award) ou ELIGIBLE seulement | Non |

**Référence smoke :** `.manus-logs/agent5-final-qa-smoke.mjs` · dernier rapport `agent5-final-qa-results.json`.

## 1.2 Railway

| # | Vérification | Action |
|---|--------------|--------|
| R-01 | Service Node **Online** | Railway dashboard → pas de rollback récent |
| R-02 | Service MySQL **healthy** | Connexion DB stable |
| R-03 | Déploiement stable | Pas de redéploiement en cours pendant la fenêtre pré-classe |
| R-04 | `DATABASE_URL` / `JWT_SECRET` | Inchangés depuis dernier smoke réussi (sessions actives) |
| R-05 | Logs runtime | Aucune erreur 5xx récurrente dans les 15 dernières minutes |

**URL canonique :** `https://tec-wms-simulator-production-production.up.railway.app`  
**En cas d'échec :** suivre `RAILWAY_DEPLOYMENT_RUNBOOK.md` — rollback uniquement sur autorisation direction.

## 1.3 Teacher login

| # | Vérification | Critère de succès |
|---|--------------|-------------------|
| T-01 | Connexion instructeur | Email institutionnel (ex. `prof@teclog.ca`) → redirect `/teacher` |
| T-02 | Rôle confirmé | `auth.me` → `role: teacher` |
| T-03 | Shell Fiori | Menu enseignant visible : Cohortes, Scénarios, Monitor, Analytics |
| T-04 | Sélecteur de cohorte | Toutes les cohortes de la session listées |
| T-05 | Session persistante | Rafraîchir la page — session maintenue |

> Ne pas enregistrer les mots de passe dans le dépôt. Utiliser le coffre institutionnel.

## 1.4 Cohort verification

| # | Vérification | Critère |
|---|--------------|---------|
| C-01 | Cohorte active sélectionnée | Shell filtré sur la cohorte du jour (Groupe A, Groupe B, ou autre) |
| C-02 | Effectif roster | `/teacher/students` — nombre = inscription attendue |
| C-03 | Isolation | Aucun étudiant d'une autre cohorte dans le roster filtré |
| C-04 | Devoirs assignés | Scénarios du module en cours assignés à la cohorte |
| C-05 | Nouveaux comptes | Chaque étudiant peut se connecter (test spot 1–2 comptes si première séance) |
| C-06 | File validation M3 | Si séance ≥ Classe 7 : file M3 **vide** (validation enseignant faite) |

**Règle RC15 :** les cohortes nouvelles (Groupe A / Groupe B) sont **indépendantes** de la Cohorte Fondatrice. Ne jamais réassigner un fondateur à une nouvelle cohorte.

## 1.5 James Timothy verification

James Timothy est le **compte démonstration institutionnel** — pas un étudiant ordinaire.

| # | Vérification | Valeur attendue |
|---|--------------|-----------------|
| J-01 | Connexion | `jamesnns3@gmail.com` → succès |
| J-02 | Cohorte | Cohorte Fondatrice (`cohortId: 1`) — **ne pas déplacer** |
| J-03 | Certifications | `silverCertified = false` · `goldCertified = false` (par design) |
| J-04 | Mission Control | Ouvre sur un run de démo · cockpit + moniteur fonctionnels |
| J-05 | Fondateurs intacts | 4/4 Silver + 4/4 Gold fondateurs inchangés après toute session James |

**Usages approuvés :** démo live · smoke post-déploiement · régression M1–M5 · validation opérationnelle.  
**Interdit :** validation de certification · validation de checkpoint · notation de production · certification automatique · valider l'isolation d'une nouvelle cohorte vide avec James (il vit dans Fondatrice).

## 1.6 Mission Control (pré-vol)

| # | Vérification | Contexte |
|---|--------------|----------|
| MC-01 | Route charge | `/student/mission-control/{runId}` → HTTP 200 |
| MC-02 | Panneau Odoo absent | Pas de lien « Odoo Lab » (RC16) |
| MC-03 | Cockpit actif | « Prochaine action requise » visible sur run actif |
| MC-04 | Moniteur transactions | Liste TX se remplit sur run M1/M5 · **vide normal en M4** |
| MC-05 | OIL panels | Panneaux A–F chargent selon module |
| MC-06 | Fiche Mission | Accessible depuis le scénario du jour |

**Briefing instructeur :** en M4, répéter trois fois que le **moniteur vide est normal** (scénarios analytiques KPI-only).

## 1.7 Monitor

| # | Vérification | Action |
|---|--------------|--------|
| M-01 | `/teacher/monitor` charge | Liste runs visible |
| M-02 | Filtre cohorte | Sélectionner cohorte du jour — runs filtrés |
| M-03 | Colonnes utiles | Étudiant · scénario · score · statut · étape active |
| M-04 | Drill-down run | Clic run → Mission Control étudiant charge |
| M-05 | Run Report accessible | Run complété → rapport s'ouvre |
| M-06 | Export CSV | Bouton export fonctionne (archivage post-classe) |

## 1.8 Analytics

| # | Vérification | Action |
|---|--------------|--------|
| A-01 | `/teacher/analytics` charge | Graphiques / tableaux visibles |
| A-02 | Filtre cohorte | Métriques reflètent **uniquement** la cohorte sélectionnée |
| A-03 | Moyennes module | Cartes M1–M5 cohérentes avec Monitor |
| A-04 | Taux complétion | Pas de 0 % anormal si étudiants actifs la veille |

## 1.9 Dashboards

| # | Vérification | Route / zone |
|---|--------------|--------------|
| D-01 | Tableau de bord principal | `/teacher` — cartes Scénarios, Cohortes, Simulations actives |
| D-02 | Simulations actives (évaluation) | Compteur cohérent avec Monitor |
| D-03 | File validation M3 | Section dédiée — vide avant Classe 7+ |
| D-04 | Activité récente | Runs récents de la cohorte visibles |
| D-05 | Progression modulaire | `/teacher` ou warehouse progress — % par module |
| D-06 | Certifications (spot) | Fondateurs : portal credential + verify 200 |

## 1.10 Pre-class sign-off

| Champ | Valeur |
|-------|--------|
| Date / heure | |
| Séance (Classe #) | |
| Cohorte | |
| Instructeur | |
| P-01 → P-07 | ☐ PASS |
| R-01 → R-05 | ☐ PASS |
| T-01 → T-05 | ☐ PASS |
| C-01 → C-06 | ☐ PASS / N/A |
| J-01 → J-05 | ☐ PASS / N/A |
| MC-01 → MC-06 | ☐ PASS |
| M-01 → M-06 | ☐ PASS |
| A-01 → A-04 | ☐ PASS |
| D-01 → D-06 | ☐ PASS |

**Verdict pré-classe :** ☐ **GO** · ☐ **NO-GO** (reporter)  
**Bloqueur(s) :** _______________________________________________

---

# PARTIE II — CLASS EXECUTION

## 2.1 Recommended operational sequence

Séquence standard **chaque séance** (150 min effectives + 30 min pauses) :

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. OUVERTURE (8–10 min)                                         │
│    Accueil · objectif · prérequis · consignes · pauses          │
├─────────────────────────────────────────────────────────────────┤
│ 2. SLIDES + DÉMO (60–75 min)                                    │
│    Projection /teacher/slides/{n} · démos Mission Control       │
├─────────────────────────────────────────────────────────────────┤
│ 3. PAUSE 1 (15 min)                                             │
├─────────────────────────────────────────────────────────────────┤
│ 4. QUIZ / TP SUPERVISÉ (40–60 min)                              │
│    Mode Évaluation · Monitor actif · interventions ciblées      │
├─────────────────────────────────────────────────────────────────┤
│ 5. PAUSE 2 (15 min)                                             │
├─────────────────────────────────────────────────────────────────┤
│ 6. DÉBRIEF + RUN REPORT (10–15 min)                           │
│    1–2 runs exemplaires · peer review · preview séance suivante │
└─────────────────────────────────────────────────────────────────┘
```

**Avant d'ouvrir la salle :** filtrer Monitor sur la cohorte · ouvrir slides du module · tester projecteur · onglet James Timothy prêt (démo) · onglet Monitor sur second écran.

## 2.2 Classroom timeline (template 3 h)

| Heure | Bloc | Écran principal | Écran secondaire |
|-------|------|-----------------|------------------|
| 0:00 | Accueil · connexion étudiants | Consignes | — |
| 0:08 | Slides S1–S3 + démos | Slides | Mission Control (démo) |
| 0:45 | Slides S4–S5 + démos | Slides | Mission Control |
| 1:12 | Consolidation · questions | Slides | — |
| **1:24** | **PAUSE 1** | — | — |
| 1:39 | Quiz ou TP SCN (supervisé) | — | **Monitor** |
| 2:21 | TP SCN (suite) | — | **Monitor** |
| **2:43** | **PAUSE 2** | — | — |
| 2:58 | Débrief · Run Report · preview | Run Report (1 run) | Monitor |

> Ajuster selon [`GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md`](../pedagogy/GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md) — chaque classe a sa répartition détaillée.

## 2.3 When to switch screens

| Moment pédagogique | Écran principal | Écran secondaire |
|--------------------|-----------------|------------------|
| Explication concept (slides) | `/teacher/slides/{n}` | — |
| Démo transaction WMS | Slides (référence) | Mission Control — **Démo** |
| Étudiants en TP autonome | Slides figées ou éteint | **Monitor** filtré cohorte |
| Intervention sur étudiant bloqué | — | Mission Control **de l'étudiant** (via Monitor) |
| Débrief collectif | **Run Report** (run exemplaire) | — |
| Certification / Silver (Classe 7) | `/student/certifications` (James ou fondateur) | — |
| M4 KPI (Classe 9) | Slides M4 + Annexe A | Monitor (interprétations) |
| M5 Peak Week (Classe 10) | Slides M5 + Annexe B | Monitor (TX en direct) |

**Règle :** ne jamais projeter les réponses d'un étudiant en cours d'évaluation sans son consentement.

## 2.4 When to demonstrate

| Module | Déclencher démo | Contenu démo | Mode |
|--------|-----------------|--------------|------|
| M1 | Après chaque slide transaction (S3–S8) | PO, GR, SO, GI, CC — **une TX à la fois** | Démo |
| M2 | Après slides layout / FIFO | Zones, bins, capacité | Démo |
| M3 | Après formules ROP/SS (tableau blanc d'abord) | ROP calculator · EOQ | Démo |
| M4 | Slides 1–3 | KPI Tower · Annexe A · **moniteur vide = normal** | Démo |
| M5 | Slides 2–4 | Chaîne réception → putaway → CC → ADJ (SCN-016) | Démo |

**Démo d'erreur live (recommandée) :** SCN-002 (GR non postée) · SCN-007 · SCN-016 gate ADJ avant replenish.

## 2.5 When to use James Timothy

| Situation | Utiliser James | Ne pas utiliser James |
|-----------|----------------|----------------------|
| Démo live devant la classe | ✅ | |
| Montrer Mission Control / OIL / Fiche Mission | ✅ | |
| Smoke post-déploiement rapide | ✅ | |
| Validation opérationnelle post-déploiement | ✅ | |
| Validation de certification | | ❌ |
| Validation de checkpoint | | ❌ |
| Notation de production | | ❌ |
| Certification automatique | | ❌ |
| Valider roster cohorte vide (Groupe A/B) | | ❌ — utiliser compte de la cohorte |
| Démontrer certification Silver/Gold fondateur | | ❌ — utiliser fondateur ou slides |
| Modifier runs fondateurs | | ❌ — jamais |

**Connexion James :** compte institutionnel documenté dans [`GOLDEN_STUDENT_JAMES_TIMOTHY.md`](../testing/GOLDEN_STUDENT_JAMES_TIMOTHY.md).  
**Post-démo :** confirmer certifications James toujours `false` · fondateurs 4/4 inchangés.

## 2.6 When to use Mission Control

| Contexte | Mission Control | Notes |
|----------|-----------------|-------|
| Démo instructeur (M1–M3, M5) | Cockpit + moniteur + stocks | Mode **Démo** |
| Supervision TP | Via Monitor → run étudiant | Mode **Évaluation** — lecture seule |
| M4 analytique | KPI Tower · OIL · pas de TX physique | Rappeler moniteur vide |
| M5 intégré | TX apparaissent étape par étape | SCN-016 : variance amber à CC |
| Débrief | Run Report (complément) | ≥ 10 min en fin de séance |

**Mission Control ≠ Monitor :** Monitor = vue enseignant multi-étudiants · Mission Control = cockpit d'un run unique.

## 2.7 Pause management

| Pause | Durée | Règles opérationnelles |
|-------|-------|------------------------|
| Pause 1 | 15 min | Afficher heure de reprise · laisser runs ouverts · Monitor en pause |
| Pause 2 | 15 min | Idem · rappeler sauvegarde implicite (runs serveur) |
| Pause technique | Variable | Si plateforme down > 5 min : noter l'heure · ne pas demander recommencer les runs en cours |

**Convention :** 3 h = 180 min dont **30 min pauses** = **150 min effectives** (Guide Professeur RC16).

## 2.8 Run Report

| Quand | Action |
|-------|--------|
| Fin de chaque SCN majeur (TP) | Inviter l'étudiant à ouvrir son Run Report |
| Débrief collectif (≥ 10 min) | Projeter 1 run exemplaire (bon score + run avec pénalité pédagogique) |
| M4 | Interprétations KPI · score parfait **100/100** |
| M5 | Chaîne ops + snapshot KPI + décision stratégique (SCN-017) |
| Incidents | Capturer run ID + screenshot pour backlog |

**Accès instructeur :** Monitor → run complété → ouvrir Run Report.

## 2.9 Student monitoring

| Signal Monitor | Intervention |
|----------------|--------------|
| Score 0 ou run abandonné | Vérifier mode Évaluation · reconnecter · relancer si nécessaire |
| Blocage > 15 min même étape | OIL Panel F · Fiche Mission · question guidée — pas de réponse directe |
| Mode Démo sur run certifiable | **Interrompre** — faire recommencer en Évaluation |
| M3 à 75 % tous SCN passés | Validation enseignant en attente — traiter avant M4 |
| M4 moniteur vide + panique | Rassurer — normal · pointer KPI Tower |
| COMPLIANCE rouge | Run Report · identifier TX non postée ou stock négatif |

**Cadence Monitor :** vérifier toutes les **10–15 min** pendant les TP · chaque étudiant au moins une fois par séance.

---

# PARTIE III — POST-CLASS

Exécuter dans les **24 heures** suivant la séance.

## 3.1 Observations

Consigner dans [`MASTER_INSTRUCTOR_HANDBOOK.md`](../pedagogy/MASTER_INSTRUCTOR_HANDBOOK.md) — section *Observations de classe* :

| Champ | Contenu |
|-------|---------|
| Date · Classe # · Cohorte | |
| Effectif présent / inscrit | |
| SCN complétés (moyenne score) | |
| Quiz (taux réussite) | |
| Difficultés observées (top 3) | |
| Interventions Monitor (nombre · type) | |
| Incidents plateforme | |
| Citations étudiantes (verbatim utiles) | |

## 3.2 Timing adjustments

| Question | Action si OUI |
|----------|---------------|
| Slides en retard systématiquement ? | Réduire discussion S1 · reporter consolidation |
| TP trop court ? | Réallouer depuis pause 2 ou débrief (max 5 min) |
| Démo trop longue ? | Une transaction = une démo (règle M1 RC16) |
| M4/M5 analytique sous-temps ? | Distribuer Annexe A/B **avant** la séance |

Mettre à jour la section *Ajustements de timing* du Master Instructor Handbook.

## 3.3 Improvements

| Source | Destination |
|--------|-------------|
| Friction UX en classe | [`docs/backlog/RC16_BACKLOG.md`](../backlog/RC16_BACKLOG.md) — ID existant ou nouveau |
| Contenu pédagogique | Note pour révision Guide Professeur RC16 |
| Plateforme / bug | Incident log + re-smoke si correctif déployé |

**Format item backlog :** titre · priorité · run ID · cohorte · séance · reproduction.

## 3.4 Backlog registration

1. Ouvrir `docs/backlog/RC16_BACKLOG.md`.
2. Chercher un ID existant (RC16-Hxx / Mxx / Lxx) correspondant.
3. Si nouveau : ajouter avec préfixe `RC16-` · thème · *Post-class input required*.
4. Joindre : run IDs · emails (interne) · captures Monitor / Run Report.

**Ne pas** implémenter depuis ce playbook — enregistrement planification uniquement.

## 3.5 Master Instructor Handbook update

Après **chaque séance**, minimum :

- [ ] Section *Observations de classe* remplie
- [ ] *Ajustements de timing* si écart > 10 min sur un bloc
- [ ] *Pièges rencontrés* si nouvelle difficulté récurrente
- [ ] *Analogies qui ont fonctionné* si applicable

Après **chaque cohorte** (fin des 10 séances) :

- [ ] Section *Améliorations futures* complétée
- [ ] Revue croisée avec backlog RC16
- [ ] Proposition mise à jour Guide Professeur (si direction approuve)

## 3.6 Post-class operator checklist

| # | Action | Délai |
|---|--------|-------|
| PC-01 | Exporter CSV Monitor — archivage | J+0 |
| PC-02 | Vérifier file validation M3 vide (si applicable) | J+0 |
| PC-03 | Spot-check certifications fondateurs inchangées | J+0 |
| PC-04 | Vérifier James Timothy non certifié | J+0 |
| PC-05 | Documenter incidents (5xx, login, progression bloquée) | J+1 |
| PC-06 | Mettre à jour Master Instructor Handbook | J+1 |
| PC-07 | Enregistrer items backlog RC16 | J+2 |

---

# PARTIE IV — FOUNDING COHORT POLICY

## Politique institutionnelle — Cohorte Fondatrice

La **Cohorte Fondatrice** est la première turma officielle du programme TEC.LOG (Session 2025–2026). Elle constitue un **patrimoine institutionnel permanent** — registre historique, non réutilisable pour de futures promotions.

### 4.1 Composition permanente

Les cinq comptes suivants **restent activement et définitivement** :

| # | Nom institutionnel | Rôle |
|---|-------------------|------|
| 1 | **Darlin Campaz Paredes** | Fondateur · Silver + Gold |
| 2 | **Fredy Tamile Lola** | Fondateur · Silver + Gold |
| 3 | **Prince Agbodjan Sewa Francis Ghislain** | Fondateur · Silver + Gold |
| 4 | **Aissata Soukeina Camara** | Fondateur · Silver + Gold |
| 5 | **James Timothy** | Fondateur · compte démonstration institutionnel officiel |

### 4.2 Droits d'accès permanents

Chacun de ces cinq comptes conserve en permanence l'accès à :

- **Simulateur** — parcours M1–M5 · scénarios SCN-001 → SCN-017
- **Tableaux de bord** — progression · Monitor (vue enseignant si rôle attribué)
- **Certifications** — credentials Silver/Gold (fondateurs 1–4) · portal credential
- **Portail de vérification** — routes `/verify/{certificateId}` publiques

### 4.3 Règles de préservation (non négociables)

| Règle | Description |
|-------|-------------|
| **FP-01** | Les enregistrements Cohorte Fondatrice ne doivent **jamais** être réinitialisés |
| **FP-02** | L'identifiant cohorte fondateur (`cohortId: 1`) ne doit **pas** être réutilisé pour une nouvelle promotion |
| **FP-03** | Aucun fondateur (1–4) ne doit être réassigné à Groupe A, Groupe B, ou toute autre cohorte |
| **FP-04** | Les certifications `TECWMS-SIL-2026-001` à `004` et `TECWMS-GOLD-2026-001` à `004` restent immuables |
| **FP-05** | `goldAwardSource = FONDATRICE_2026_GOLD_AWARD` ne doit pas être modifié |
| **FP-06** | Aucun script de override pédagogique ne s'applique aux **nouvelles** cohortes |
| **FP-07** | Les nouvelles cohortes sont créées **indépendamment** — progression propre · pas d'héritage de runs |

### 4.4 James Timothy — compte démonstration officiel

James Timothy occupe un statut dual :

1. **Membre permanent** de la Cohorte Fondatrice (patrimoine institutionnel).
2. **Compte de démonstration officiel** pour instructeurs, QA, et validation post-déploiement.

| Attribut | Politique |
|----------|-----------|
| Certification automatique | **Interdite** — jamais pour validation certification, checkpoint, ou notation production |
| Déplacement de cohorte | **Interdit** sans approbation institutionnelle |
| Suppression du compte | **Interdit** |
| Usage en classe | Démo live · happy-path · jamais pour valider isolation cohorte vide |
| Mot de passe | Documenté dans coffre institutionnel · rotation si observateurs externes |

### 4.5 Nouvelles cohortes

| Principe | Application |
|----------|-------------|
| Création | Cohortes nommées indépendamment (ex. « Groupe A — Automne 2026 ») |
| Données | Progression initiale vide · pas de runs hérités |
| Certification | Moteur standard `ckpt-v1` — pas de `founder-v1` override |
| Vérification | Isolation testée avec comptes de la **nouvelle** cohorte uniquement |

### 4.6 Vérification périodique fondateurs

Exécuter après chaque déploiement production et en fin de séance si James a été utilisé :

- [ ] 5/5 comptes fondateurs actifs (`isActive = true`)
- [ ] 4/4 fondateurs certifiés Silver + Gold inchangés
- [ ] James Timothy : non certifié (sauf décision gouvernance contraire)
- [ ] Routes verify fondateurs → HTTP 200
- [ ] Aucun fondateur dans roster Groupe A / B

---

# APPROVAL GATE

Ce document est soumis à approbation institutionnelle avant adoption comme playbook opérationnel officiel.

| Gate | Critère | Statut |
|------|---------|--------|
| **G1 — Exactitude technique** | Routes, seuils, et procédures alignés sur RC15/RC16 production | ☐ APPROVED · ☐ REVISE |
| **G2 — Cohérence pédagogique** | Séquence compatible Guide Professeur 10 classes RC16 | ☐ APPROVED · ☐ REVISE |
| **G3 — Politique Cohorte Fondatrice** | Cinq membres permanents · règles FP-01→FP-07 validées par direction | ☐ APPROVED · ☐ REVISE |
| **G4 — James Timothy** | Statut démonstration + préservation documentés | ☐ APPROVED · ☐ REVISE |
| **G5 — Opérateur** | Checklist pré-classe testée sur Railway production | ☐ APPROVED · ☐ REVISE |

### Sign-off

| Rôle | Nom | Signature | Date |
|------|-----|-----------|------|
| Direction pédagogique TEC.LOG | | | |
| Responsable plateforme TEC.WMS | | | |
| Instructeur référent | | | |

**Verdict final :** ☐ **APPROVED — Playbook opérationnel officiel RC16** · ☐ **REVISE — corrections requises**

**Conditions de révision :** _______________________________________________

---

## Document control

| Version | Date | Auteur | Changement |
|---------|------|--------|------------|
| 1.0 | 2026-07-02 | RC16.4 Documentation | Création initiale — Classroom Operational Playbook |

**Fichier :** `docs/operations/TEC_WMS_OPERATIONAL_PLAYBOOK_RC16.md`  
**Mode :** Documentation only — aucun déploiement · aucun commit · aucune modification production.

---

*Collège de la Concorde · Programme TEC.LOG · TEC.WMS Simulator · RC16 Operational Playbook*
