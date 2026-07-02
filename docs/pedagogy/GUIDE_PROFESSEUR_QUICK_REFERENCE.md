# TEC.WMS — Guide Professeur · Référence Rapide (RC16)

**Usage :** enseignement en direct · consultation en quelques secondes  
**Source complète :** [`GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md`](./GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md)  
**Programme :** TEC.LOG · Collège de la Concorde · 10 × 3 h (150 min effectives + 30 min pauses)

---

## Référence globale

| Module | Seuil | Slides prof | SCN étudiant | Monitor |
|--------|-------|-------------|--------------|---------|
| M1 | 60/100 | `/teacher/slides/1` | `/student/scenarios` | `/teacher/monitor` |
| M2 | 60/100 | `/teacher/slides/2` | `/student/module2` | idem |
| M3 | 70/100 | `/teacher/slides/3` | `/student/module3` | idem |
| M4 | 70/100 (max 100) | `/teacher/slides/4` | `/student/module4` | idem |
| M5 | 70/100 | `/teacher/slides/5` | `/student/module5` | idem |

**Mode certification :** Évaluation uniquement · **Slides exclues :** M2-S6 · M3-S6 · M4-S6

**Politique institutionnelle de notation (RC16) :** chaque scénario permet une exécution parfaite de **100/100**. Seuils : M1 = 60 · M2 = 60 · M3 = 70 · M4 = 70 · M5 = 70.

---

<div class="page-break"></div>

## CLASSE 1 — M1 Fondements (partie 1) · PO, GR, Stock

| | |
|---|---|
| **Objectif** | Fondations ERP/WMS : flux, PO → GR → Stock, quiz M1, SCN-001 et SCN-002 |
| **Slides** | M1-S1 Couverture · S2 Flux · S3 PO (ME21N) · S4 GR (MIGO) · S5 Stock (MMBE) — *pas SO/GI/CC aujourd'hui* |
| **Démos simulateur** | Connexion Fiori · Mission Control (cycle 7 étapes) · PO SCN-001 · GR posté vs PENDING SCN-002 · moniteur stock |
| **SCN** | **SCN-001** (cycle nominal) · **SCN-002** (GR fantôme) — Évaluation ≥ 60/100 |
| **Quiz** | **Quiz M1** — 18 min · gate Silver G1 · ≥ 60 % |
| **Checkpoints** | Quiz M1 ≥ 60 % · SCN-001/002 complétés · COMPLIANCE OK · mode Évaluation confirmé |
| **Certification** | Silver G1 seulement — pas encore éligible Silver complet |
| **Temps** | Slides ~66 min · Quiz 18 · SCN-001 24 · SCN-002 22 · pauses 2×15 · **150 min effectives** |

**Questions à poser**
- Que se passe-t-il si on reçoit 100 u. mais la PO indique 120 ?
- Différence stock physique vs système ?
- Pourquoi la GR doit être *postée* avant de continuer ?
- Entreprise québécoise où cette chaîne s'applique ?

**Difficultés attendues**
- Surcharge codes SAP → une transaction = une démo
- Confusion posté/non posté → revoir moniteur GR PENDING
- Quiz < 60 % → retake · revoir S3–S5
- Mode Démo par erreur → vérifier badge « Évaluation »

**Conseils pédagogiques**
- Ralentir après S3 — une transaction SAP/WMS à la fois
- SCN-002 préparer dès S4 (GR non postée)
- Pointer diagramme S2 zone par zone

**Mission Control**
- Après S2 : carte cycle 7 étapes · aperçu SCN-001
- Monitor : filtrer cohorte · vérifier runs SCN-001/002

**Rappels enseignant**
- ☐ Quiz M1 ≥ 60 % tous · ☐ SCN-001/002 ≥ 60 Évaluation · ☐ Preview Classe 2 (SO/GI/CC)

---

<div class="page-break"></div>

## CLASSE 2 — M1 Fondements (partie 2) · SO, GI, CC, Capstone

| | |
|---|---|
| **Objectif** | Compléter cycle M1 (SO → GI → CC), carte SCN, certification Silver, SCN-003→005 |
| **Slides** | M1-S6 SO (VA01) · S7 GI (VL02N) · S8 CC (MI01) · S9 Scénarios · S10 Silver |
| **Démos simulateur** | SO/GI SCN-001 · CC quantité **physique** SCN-004 · Mission Sheet + OIL · page Silver live |
| **SCN** | **SCN-003** (rupture) · **SCN-004** (variance −15) · **SCN-005** (multi-anomalies capstone) |
| **Quiz** | Quiz M1 déjà fait Classe 1 — confirmer ≥ 60 % |
| **Checkpoints** | SCN-001→005 ≥ 60 · COMPLIANCE chaque run · aucune TX PENDING · Monitor verts |
| **Certification** | Silver éligible si G1–G4 vrais — visite `/student/certifications/silver` |
| **Temps** | Slides ~58 · SCN-003 20 · SCN-004 22 · SCN-005 30 · débrief 12 · **150 min** |

**Questions à poser**
- Peut-on expédier sans SO ?
- SCN-004 : système 200, compté 185 — que saisissez-vous ?
- SCN-005 : ordre documents / physique / expédition ?
- Combien de gates Silver restent après aujourd'hui ?

**Difficultés attendues**
- Quantité physique vs delta (SCN-004) → rappel S8
- Ordre résolution SCN-005 → OIL Panel · Fiche Mission
- Réappro avant GI (SCN-003) → moniteur stock vide
- Compliance échouée → Run Report · TX non postées

**Conseils pédagogiques**
- S8 : saisir quantité **physique**, pas le delta
- SCN-005 = synthèse M1 — pause 2 avant capstone
- Archiver Run Report SCN-004 et SCN-005

**Mission Control**
- S9 : Mission Sheet · OIL panels · ordre SCN obligatoire
- Monitor : progression M1 complète avant M2

**Rappels enseignant**
- ☐ SCN-001→005 ≥ 60 · ☐ Page Silver consultée · ☐ Prêt M2 (gate M1 passed)

---

<div class="page-break"></div>

## CLASSE 3 — M2 Exécution d'entrepôt (partie 1)

| | |
|---|---|
| **Objectif** | Disposition entrepôt, réception→rangement, bins, capacité, FIFO ; SCN-006 et SCN-007 |
| **Slides** | M2-S1 9 zones · S2 Réception/rangement · S3 Bins · S4 Capacité · S5 FIFO — *M2-S6 exclue* |
| **Démos simulateur** | Plan zones REC-01 · flux 6 étapes · bin A1-C1-03 · rejet 501e unité · lots FIFO |
| **SCN** | **SCN-006** (putaway 150 u.) · **SCN-007** (capacité 600/500) — ≥ 60/100 |
| **Quiz** | Quiz M2 — 15 min renforcement · *pas gate cert* |
| **Checkpoints** | M1 passed confirmé · SCN-006 putaway STOCKAGE · SCN-007 respect capacité |
| **Certification** | Silver en cours · SCN-006/007 comptent Gold gates 3–14 |
| **Temps** | Objectifs verbal 5 · Slides+démos 58 · Quiz 12 · SCN-006 28 · SCN-007 27 · **150 min** |

**Questions à poser**
- Où placez-vous un palett reçu à REC-01 ?
- Que fait le système à la 501e unité ?
- FIFO : quel lot sort si trois dates différentes ?

**Difficultés attendues**
- Adressage bin (zone-allée-niveau-bin)
- SCN-007 : tentative forcer allocation
- Confusion putaway vs picking

**Conseils pédagogiques**
- Verbaliser objectifs M2 en ouverture (pas de slide couverture)
- S4 : 600 u. dans bin max 500 = refus/redistribution
- Annoncer SCN-008 Classe 4

**Mission Control**
- S1 : zones ↔ REC-01 · STOCKAGE
- Monitor : gate M2 · scores SCN-006/007

**Rappels enseignant**
- ☐ SCN-006/007 ≥ 60 · ☐ Capacité bin comprise · ☐ M2-S6 **non couverte**

---

<div class="page-break"></div>

## CLASSE 4 — M2 Exécution (partie 2) · FIFO Capstone

| | |
|---|---|
| **Objectif** | FIFO en conditions réelles (SCN-008) · clôturer M2 · preview M3 ROP |
| **Slides** | M2-S7 Scénarios SCN-006→008 · récap verbal S1–S5 si besoin (10 min) |
| **Démos simulateur** | SCN-008 putaway auto-complété · step FIFO_PICK · violation FIFO → compliance bloquée · moniteur lots |
| **SCN** | **SCN-008** (FIFO · 3 lots pré-chargés) — 50 min · ≥ 60/100 |
| **Quiz** | Aucun obligatoire |
| **Checkpoints** | SCN-008 ≥ 60 FIFO respecté · M2 `module_progress.passed` · 3 SCN M2 pour Gold |
| **Certification** | Gold : SCN-006→008 requis plus tard |
| **Temps** | Récap 10 · S7 15 · SCN-008 50 · débrief FIFO 20 · preview M3 15 · **150 min** |

**Questions à poser**
- Pourquoi le putaway est-il déjà complété au départ ?
- Quelle transaction confirme le pick FIFO ?
- Que se passe-t-il si vous pickez le lot le plus récent ?

**Difficultés attendues**
- Surprise putaway auto-complete → expliquer **avant** lancer
- Sélection mauvais lot
- Description SCN vs runtime → suivre Fiche Mission

**Conseils pédagogiques**
- Compétence = choisir le **bon lot** au picking
- Rattrapage SCN-006/007 : Classes 7–8 uniquement
- Preview formules ROP en clôture

**Mission Control**
- Moniteur lots et dates · compliance FIFO
- Vérifier M2 passed Monitor avant M3

**Rappels enseignant**
- ☐ SCN-008 complété · ☐ M2 passed tous · ☐ M3 annoncé · ☐ M2-S6 exclusion confirmée

---

<div class="page-break"></div>

## CLASSE 5 — M3 Contrôle des stocks (partie 1)

| | |
|---|---|
| **Objectif** | Min/Max/ROP, Safety Stock, cycle count, variance ; SCN-009 et SCN-010 |
| **Slides** | M3-S1 Vue d'ensemble · S2 Min/Max/ROP + **tableau blanc** · S3 SS · S4 CC/variance · S5 Réappro |
| **Démos simulateur** | Graphique MIN/MAX/ROP · PO auto stock < ROP · CC_LIST→COUNT→RECON · ADJ via CC_RECON |
| **SCN** | **SCN-009** (CC simple) · **SCN-010** (variance + ADJ) — **seuil 70/100** |
| **Quiz** | Quiz M3 — 15 min renforcement |
| **Checkpoints** | SCN-009 ≥ 70 · SCN-010 ≥ 70 ou plan rattrapage C7–8 |
| **Certification** | Validation enseignant M3 = **Classe 6** (pas encore) |
| **Temps** | Slides+tableau 62 · Quiz 12 · SCN-009 28 · SCN-010 28 · **150 min** |

**Questions à poser**
- Trop de stock vs rupture — où est l'équilibre ?
- ROP : demande 10/j, délai 5 j, SS 20 → calculez
- SCN-010 : ajuster immédiatement ou investiguer ?

**Difficultés attendues**
- Formules ROP/SS (math anxiety) → tableau blanc S2
- ADJ intégré CC_RECON (pas MI07 séparé)
- Justification variance longueur minimale

**Conseils pédagogiques**
- S2 au tableau : ROP = (Demande × Délai) + SS
- Variance > 2 % = système non fiable
- Annoncer SCN-011 + validation Classe 6

**Mission Control**
- Pipeline M3 : CC_LIST → CC_COUNT → CC_RECON → REPLENISH → COMPLIANCE_M3
- Monitor : seuil **70** (pas 60)

**Rappels enseignant**
- ☐ SCN-009/010 complétés ou planifiés · ☐ Formules ROP comprises · ☐ M3-S6 **non couverte**

---

<div class="page-break"></div>

## CLASSE 6 — M3 (partie 2) · Réappro + Validation enseignant

| | |
|---|---|
| **Objectif** | SCN-011 · **validation enseignant M3** (gate M4) · verrouiller prérequis M4 |
| **Slides** | M3-S7 Scénarios SCN-009→011 · récap verbal S1–S5 si besoin |
| **Démos simulateur** | SCN-011 REPLENISH · quantité vs ROP · pipeline 5 steps · bouton validation Dashboard |
| **SCN** | **SCN-011** (Min/Max REPLENISH) — 42 min · ≥ 70/100 |
| **Quiz** | Aucun gate |
| **Checkpoints** | SCN-011 ≥ 70 · M3 passed · **`teacherValidated = true`** · aucun bloqué M4 |
| **Certification** | Gold gates 3–14 : SCN-009→011 · M4 locked until teacherValidated |
| **Temps** | Récap 10 · S7 12 · SCN-011 42 · validation batch 18 · débrief M4 20 · **150 min** |

**Questions à poser**
- Stock sous ROP — que déclenche le système ?
- Pourquoi la validation enseignant existe en M3 ?

**Difficultés attendues**
- REPLENISH perçu hors-sujet → expliquer pipeline complet
- Étudiants bloqués M4 sans validation → **vérifier avant Classe 9**
- Valider dès M3 passed (deadlock RC15 résolu)

**Conseils pédagogiques**
- **PRIORITÉ RC16** : validation batch fin de séance
- Route : `/teacher/dashboard` → Module 3 → Valider
- Liste retards → rattrapage C7–8

**Mission Control**
- Teacher Dashboard validation M3
- Monitor : file M4 vide avant Classe 9

**Rappels enseignant**
- ☐ **Validation M3 100 % étudiants prêts** · ☐ SCN-009→011 ≥ 70 · ☐ Annonce C7 Silver · C9 M4

---

<div class="page-break"></div>

## CLASSE 7 — Consolidation · Parcours Silver

| | |
|---|---|
| **Objectif** | Consolidation M1–M3 · obtenir/confirmer **Silver** · rattrapage SCN · renforcement |
| **Slides** | Aucune obligatoire — révision ciblée `/teacher/slides/1–3` (10–15 min max) |
| **Démos simulateur** | Page Silver 4/4 gates · Run Report SCN raté · OIL Panel F pour bloqués |
| **SCN** | Rattrapage SCN-001→011 au besoin — **Classes 7–8 uniquement** |
| **Quiz** | Quiz M2/M3 manquants — 20 min |
| **Checkpoints** | G1 Quiz M1 ≥ 60 · G2 SCN-001→005 ≥ 60 · G3 COMPLIANCE M1 · G4 no blockers |
| **Certification** | **Focus Silver** — `/student/certifications/silver` AWARDED ou ELIGIBLE |
| **Temps** | Brief 15 · révision 10 · rattrapage 75 · Silver individuel 35 · **150 min** |

**Questions à poser**
- Quel gate Silver vous manque ?
- Différence Évaluation vs Démo pour la cert ?

**Difficultés attendues**
- Quiz M1 < 60 % → G1 bloqué
- Un seul SCN < 60 → G2 bloqué
- Compliance non validée → G3

**Conseils pédagogiques**
- Silver = maîtrise opérationnelle M1 · Gold = parcours M1–M5 complet
- Confirmer `studentNumber` registre institutionnel
- Diagnostic gates en ouverture

**Mission Control**
- Monitor : gates Silver par étudiant
- OIL Panel F pour déblocage

**Rappels enseignant**
- ☐ Silver AWARDED/ELIGIBLE chaque actif · ☐ Liste retards Gold path · ☐ Validation M3 confirmée

---

<div class="page-break"></div>

## CLASSE 8 — Consolidation · Préparation M4

| | |
|---|---|
| **Objectif** | Rattrapage M2/M3 · débrief Run Report · virage analytique M4 · Quiz M4 · déblocage M4 |
| **Slides** | Preview M4-S1 (5 min) : « moniteur vide = normal en M4 » |
| **Démos simulateur** | M4 mode analytique KPI tower · Annexe A (rotation 6×, OTIF 95 %, erreurs 4 %) |
| **SCN** | Rattrapage SCN M2/M3 restants · *pas de nouveau SCN M4* |
| **Quiz** | Quiz M4 — 15 min renforcement · 4 questions · *pas gate cert* |
| **Checkpoints** | teacherValidated 100 % · M3 passed · SCN M2/M3 Gold complets · file validation vide |
| **Certification** | Distribuer **Annexe A** · prérequis M4 confirmés |
| **Temps** | Encadré terminologie 15 · Annexe A 20 · Quiz 15 · rattrapage 45 · débrief 25 · preview M4 15 · **150 min** |

**Questions à poser**
- Pourquoi le moniteur M4 est-il vide ?
- 6× rotation — surstock ou normal ?
- 95 % OTIF — excellent ou insuffisant ?

**Difficultés attendues**
- Sans validation M3 → **urgence** avant Classe 9
- Confusion OTIF / rotation / Fill Rate → encadré obligatoire
- Annexe A non lue avant SCN-012

**Conseils pédagogiques**
- **Encadré RC16 :** Rotation 6× = **normale** · OTIF 95 % = **excellent** · Erreurs 4 % = acceptable · Fill Rate ≠ OTIF
- M4 = analyste, pas opérateur
- Preview SCN-012→014 Classe 9

**Mission Control**
- KPI tower sans transactions · moniteur TX vide = attendu
- Vérifier validation M3 Dashboard

**Rappels enseignant**
- ☐ **Aucun bloqué M4** · ☐ Annexe A distribuée · ☐ SCN-012→014 preview · ☐ M4 = analytique compris

---

<div class="page-break"></div>

## CLASSE 9 — M4 Indicateurs de performance KPI

| | |
|---|---|
| **Objectif** | Lire/interpréter KPI · SCN-012, SCN-013, SCN-014 mode analytique · capstone S&OP |
| **Slides** | M4-S1 Dashboard · S2 Rotation 2400÷400=6× · S3 OTIF 95 %+erreurs 4 % · S4 Productivité · S5 RCA · S7 SCN — *M4-S6 exclue* |
| **Démos simulateur** | KPI tower TX vide · calcul rotation tableau · 285/300 OTIF · RCA · demo SCN-012 (1 step) |
| **SCN** | **SCN-012** (rotation) · **SCN-013** (service+erreurs) · **SCN-014** (capstone S&OP) — ≥ 70 (max 100) |
| **Quiz** | Quiz M4 déjà fait C8 — renforcement |
| **Checkpoints** | SCN-012→014 ≥ 70 · M4 passed · Gold contribution gates 3–14 |
| **Certification** | Gold : SCN-012→014 requis · pas gate quiz M4 |
| **Temps** | Gate M3 10 · Slides 54 · SCN-012 25 · SCN-013 25 · SCN-014 35 · **150 min** |

**Questions à poser**
- SCN-012 : 48 000 $ immobilisés — justifiés ?
- SCN-013 : dashboard vert — investissez-vous quand même ?
- SCN-014 : que sacrifiez-vous si formation picking financée ?

**Difficultés attendues**
- « 6× = surstock » → bande normale 4–12× · mot *surstock* bloque validator
- OTIF seul sans erreurs → analyse **duale** requise
- « Service faible 95 % » → factuellement faux
- SCN-014 liste sans trade-off → pas décision S&OP

**Conseils pédagogiques**
- Enseigner depuis **corps de slide** + **Annexe A** (rotation · OTIF · erreurs)
- SCN-012 mot-clé : *normale* · SCN-013 dual OTIF+erreurs · SCN-014 une initiative + trade-off
- Aucun étudiant ne cherche transactions WMS en M4

**Mission Control**
- Monitor analytique · pas de TX WMS
- Instructor run SCN-012 demo avant TP

**Rappels enseignant**
- ☐ SCN-012→014 ≥ 70 · ☐ Annexe A utilisée · ☐ M5 Peak Week annoncé C10 · ☐ M4-S6 exclusion

---

<div class="page-break"></div>

## CLASSE 10 — M5 Peak Week · Capstone Gold

| | |
|---|---|
| **Objectif** | Parcours **Peak Week** J1→J2→J3 · Quiz M5 · éligibilité **Gold** · clôture TEC.LOG |
| **Slides** | M5-S1 Opération intégrée · S2 SCN-015 J1 · S3 SCN-016 J2 crise · S4 SCN-017 J3 audit · S5 Gold |
| **Démos simulateur** | **SCN-016 échec intentionnel** (sans M5_ADJ → gate 18a) · chemin correct CC→ADJ→KPI · page Gold 18 gates · badge QR |
| **SCN** | **SCN-015** (J1 tactique) · **SCN-016** (J2 variance −5) · **SCN-017** (J3 stratégique ≥2 KPI chiffrés) |
| **Quiz** | **Quiz M5** — gate Gold #2 · ≥ 60 % · début séance ou après S1 |
| **Checkpoints** | Silver confirmé · Quiz M5 · SCN-006→017 seuils · compliance M2–M5 · **18a** M5_ADJ before KPI · **18b** SCN-017 |
| **Certification** | Gold ELIGIBLE 18/18 fin séance · AWARDED = décision institutionnelle |
| **Temps** | Slides 39 · Quiz 15 · SCN-015 22 · SCN-016 28 · SCN-017 26 · clôture 15 · **150 min** |

**Questions à poser**
- SCN-015 : pourquoi Q réappro = 0 ?
- SCN-016 : que se passe-t-il si je saute M5_ADJ ? *(démo live)*
- SCN-017 : citez deux KPI numériques du snapshot
- Combien de gates Gold complétés ?

**Difficultés attendues**
- SCN-015 copier Annexe A (48000 $) → KPI run ≈6000 $
- SCN-015 commander par réflexe → stock > min → Q=0
- SCN-016 sauter ADJ → gate 18a
- SCN-017 réponse opérationnelle → rubric stratégique Annexe B

**Conseils pédagogiques**
- Narratif Peak Week : opérer → KPI depuis ops → décider
- SCN-016 : corriger **avant** KPI · serveur injecte 50/45 même si compté 50/50
- Démo échec gate 18a **obligatoire RC16**

**Mission Control**
- `/student/certifications/gold` · 18 gates live
- Run Report final archivé

**Rappels enseignant**
- ☐ Quiz M5 ≥ 60 % · ☐ SCN-015→017 ≥ 70 · ☐ Gold ELIGIBLE 18/18 · ☐ Numéros étudiants · ☐ Signalement AWARDED · ☐ Feedback cohorte

---

<div class="page-break"></div>

## Annexe — Outils & rappels instantanés

| Outil | Route |
|-------|-------|
| **Teacher Dashboard** | `/teacher` |
| **Teacher Dashboard — Validation M3** | `/teacher/dashboard` |
| **Student Dashboard** | `/student/dashboard` |
| Slides | `/teacher/slides` |
| Monitor | `/teacher/monitor` |
| Scenarios | `/teacher/scenarios` |
| Silver | `/student/certifications/silver` |
| Gold | `/student/certifications/gold` |
| **Public Verification** | `/verify/{certificateId}` |
| **LinkedIn** | Préremplissage depuis le portail credential (Silver/Gold) |

**Annexe A (M4)** — Rotation 6× · OTIF 95 % · Erreurs 4 % · Lead time 3,5 j · Capital 48 000 $

**Démo vs Évaluation** — Certification = **Évaluation** uniquement · Démo = projection prof · KPI M4 jamais révélés en Évaluation

---

*TEC.WMS Guide Professeur · Référence Rapide RC16 · Collège de la Concorde · Documentation uniquement*
