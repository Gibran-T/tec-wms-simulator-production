# Guide étudiant — Réponses Modules 4 et 5

**Programme :** TEC.LOG — Simulation WMS intégrée  
**Établissement :** Collège de la Concorde  
**Scénarios :** SCN-012 à SCN-017  
**Version :** Finale — 2026-06-19  

---

## Comment utiliser ce guide

Ce document vous aide à **comprendre** ce que chaque scénario évalue et **comment prendre une bonne décision professionnelle**. Il ne s’agit pas d’apprendre des phrases par cœur.

| Ce que nous évaluons | Ce que nous n’évaluons pas |
|----------------------|----------------------------|
| Lire un KPI et le classer dans la bonne bande | Recopier mot pour mot un modèle |
| Relier plusieurs indicateurs entre eux | Mémoriser des chiffres sans les comprendre |
| Proposer une action cohérente avec les données | Cliquer au hasard dans le simulateur |
| Justifier votre choix avec des faits chiffrés | Remplir des champs sans lire le contexte |

**Seuil de réussite :** 70 / 100 pour tous les scénarios.

**Données de référence (Modules 4 — Annexe A, partagées SCN-012 à SCN-014)**

| Indicateur | Valeur | Comment la lire |
|------------|--------|-----------------|
| Consommation annuelle | 2 400 u. | Volume écoulé sur l’année |
| Stock moyen | 400 u. | Niveau moyen en entrepôt |
| **Rotation** | **6×/an** | 2 400 ÷ 400 |
| Commandes honorées | 285 / 300 | Livraisons complètes et à l’heure |
| **Taux de service (OTIF)** | **95,0 %** | 285 ÷ 300 |
| Erreurs opérationnelles | 12 / 300 | Erreurs sur le total des opérations |
| **Taux d’erreur** | **4,0 %** | 12 ÷ 300 |
| Délai moyen (lead time) | 3,5 j | Délai fournisseur |
| Capital immobilisé | 48 000 $ | Valeur du stock au bilan |

**Bandes d’interprétation à connaître**

| KPI | Bon signe | Zone normale / acceptable | Signal d’alerte |
|-----|-----------|---------------------------|-----------------|
| Rotation | 4 à 12×/an = **normal** | — | < 4× = surstock · > 12× = sous-performance |
| Service (OTIF) | ≥ 95 % = **excellent** | 85–95 % = acceptable | < 85 % = insuffisant |
| Erreurs | ≤ 1 % = excellent | 1–5 % = **acceptable** | > 5 % = critique |

---

# MODULE 4 — Indicateurs de performance

> **Rappel :** En Module 4, vous **analysez** des KPI. Le moniteur de transactions reste vide — c’est normal. Aucune réception, rangement ou comptage n’est attendu.

---

## SCN-012 — Politique stock et capital immobilisé

**Votre rôle :** Analyste logistique — revue du capital circulant (CFO, Q3)

### 1. Ce que le scénario teste

Le comité finance vous demande si les **48 000 $** immobilisés en stock sont justifiés. Vous devez :

- Classer la **rotation à 6×** dans la bonne bande industrielle ;
- Relier rotation et capital immobilisé ;
- Recommander une **politique stock** (maintien, ajustement ciblé ou hausse) — sans paniquer ni rester passif.

**Compétence visée :** analyser un KPI de rotation et formuler une recommandation financière nuancée.

### 2. Comment lire le KPI

| Indicateur | Valeur | Ce que ça signifie pour vous |
|------------|--------|------------------------------|
| Rotation | **6×** (2 400 ÷ 400) | Bande **normale** (4–12×) — ni surstock ni rupture systémique |
| Capital immobilisé | **48 000 $** | Pression légitime du CFO, mais cohérente avec une rotation équilibrée |
| OTIF 95 % | Excellent | Contexte favorable — ne pousse pas à un destock agressif |
| Erreurs 4 % | Acceptable | Contexte secondaire — ce n’est pas le levier principal ici |

**Piège courant :** 6× n’est **pas** du surstock. Le surstock commence en dessous de 4×.

### 3. Réponse correcte à utiliser

**Rotation (KPI_ROTATION) :**
> Le taux de rotation est de 6× (2 400 ÷ 400), ce qui correspond à une **performance normale** dans la bande 4–12×. Le capital immobilisé de 48 000 $ est cohérent avec une rotation équilibrée ; pas de surstock systémique.

**Diagnostic (KPI_DIAGNOSTIC) :**
> Je **recommande** de **maintenir** la politique stock actuelle avec **surveillance SKU** par référence. **Décision** : monitorer les faibles rotations (< 4×) sans **destock global**. **Action** : revue **mensuelle** des 48 000 $ immobilisés et des articles à rotation lente.

### 4. Pourquoi cette réponse est correcte

- **6× = normal** : vous appliquez la bande industrielle, pas une impression visuelle.
- **Maintien + surveillance SKU** : vous répondez à la pression CFO sans sur-réagir ni ignorer le risque.
- Le plan est **concret** (revue mensuelle, cartographie SKU lents) — pas un « tout va bien » vide.

### 5. Mots à inclure

`normal` · `6×` · `maintenir` · `surveiller` · `SKU` · `politique` · `recommande` · `décision` · `action` · `capital immobilisé` · `48 000 $`

### 6. Mots et actions à éviter

| À éviter | Pourquoi |
|----------|----------|
| « Surstock » à 6× | Fausse classification — pénalité et échec de conformité |
| « Rien à faire » / « aucune action » | Le CFO attend une politique, pas l’inaction |
| Destock global massif | Incohérent avec rotation normale et OTIF excellent |
| Plan de formation picking (SCN-013) | Mauvais scénario — ici c’est le **capital**, pas la qualité d’exécution |

### 7. Explication prof (courte)

*« Qu’est-ce que ce KPI vous dit sur le capital immobilisé ? »* — La rotation normale justifie le maintien de la politique actuelle, avec un filet de surveillance sur les SKU lents pour protéger le working capital sans dégrader le service.

---

## SCN-013 — Taux de service et erreurs opérationnelles

**Votre rôle :** Responsable performance — renouvellement contrat SLA dans 90 jours

### 1. Ce que le scénario teste

C’est le **piège du tableau vert** : OTIF à 95 % (excellent) et erreurs à 4 % (acceptables) donnent l’impression que tout va bien. Vous devez :

- Reconnaître l’**excellence** du service au seuil ;
- Relier les **erreurs opérationnelles** au **risque OTIF** à horizon J-90 ;
- Proposer un **plan d’exécution chiffré** — pas diagnostiquer un « faible service ».

**Compétence visée :** évaluer la fragilité cachée derrière des KPI « verts ».

### 2. Comment lire le KPI

| Indicateur | Valeur | Ce que ça signifie pour vous |
|------------|--------|------------------------------|
| OTIF | **95,0 %** (285/300) | **Excellent** au seuil (≥ 95 %) — ne pas le qualifier de faible |
| Erreurs | **4,0 %** (12/300) | **Acceptable** (1–5 %) — corrigeable, mais source de fragilité |
| Rotation 6× | Normal | Contexte seulement — ne bloquez pas avec « surstock » |
| Corrélation clé | — | Erreurs de **picking** et **réception** → risque de dérive OTIF |

**Image utile :** dashboard **vert**, exécution **ambre** — le levier prioritaire est la qualité d’exécution, pas le stock.

### 3. Réponse correcte à utiliser

**Service (KPI_SERVICE) :**
> OTIF 95,0 % — niveau **excellent** au seuil (≥ 95 %). Taux d’erreur 4,0 % (12/300) — bande **acceptable** mais corrigeable. Je corrèle ces erreurs de **picking** et de **réception** au risque de dérive OTIF avant renouvellement SLA J-90.

**Diagnostic (KPI_DIAGNOSTIC) :**
> OTIF **95 %** reconnu **excellent** ; le risque prioritaire est l’exécution : **erreurs** de **picking** et de **réception** à **4 %** fragilisent OTIF à horizon **90** jours. **Je recommande** un programme qualité : formation picking, double validation réception, revue **hebdomadaire** du top 3 des erreurs, cible **2 %** d’ici J-90. **Décision** : financer le budget formation plutôt qu’un **destock**.

### 4. Pourquoi cette réponse est correcte

- Vous **honorez** le 95 % (excellent) tout en **challengeant** l’exécution (4 %).
- Vous **corrélez** erreurs → picking/réception → OTIF (lien pédagogique central).
- Le plan est **mesurable** : cible 2 %, horizon 90 jours, suivi hebdomadaire.

### 5. Mots à inclure

`excellent` · `95 %` · `acceptable` · `4 %` · `erreurs` · `picking` · `prélèvement` · `réception` · `OTIF` · `recommande` · `formation` · `90` · `hebdomadaire` · `2 %` · `décision`

### 6. Mots et actions à éviter

| À éviter | Pourquoi |
|----------|----------|
| « Service acceptable » ou « insuffisant » à 95 % | Fausse bande — pénalité |
| « 95 % = tout va bien » (complaisance) | Rate le piège pédagogique |
| Analyser OTIF sans mentionner les 4 % d’erreurs | Diagnostic incomplet |
| Destock comme levier principal | Mauvais levier pour ce scénario |
| Plan sans cible % ni horizon 90 j / hebdo | Conformité insuffisante |

### 7. Explication prof (courte)

*« Le dashboard est vert — est-ce suffisant pour signer le contrat ? »* — Non sans plan : le service est excellent **aujourd’hui**, mais les erreurs d’exécution peuvent faire dériver OTIF avant J-90. Investir en qualité d’exécution protège le contrat.

---

## SCN-014 — Analyse S&OP et arbitrage multi-KPI

**Votre rôle :** Directeur des opérations — comité S&OP mensuel (budget pour **une seule** initiative)

### 1. Ce que le scénario teste

Capstone Module 4 : synthétiser **quatre lentilles KPI** (CFO / Ventes / Ops / Supply), choisir **une initiative financée**, nommer le **sacrifice explicite** et les **KPIs de suivi** sur 90 jours.

**Compétence visée :** arbitrer entre parties prenantes avec une décision intégrée, pas une optimisation mono-KPI.

### 2. Comment lire le KPI

| Lentille | KPI | Valeur | Message |
|----------|-----|--------|---------|
| **CFO** | Rotation + capital | 6× · 48 000 $ | Normal — pression cash, pas d’urgence surstock |
| **Ventes** | OTIF | 95,0 % | Excellent — **maintenir** le service |
| **Ops** | Erreurs | 4,0 % | Acceptable — fragilité cachée, levier naturel |
| **Supply** | Lead time | 3,5 j | Normal (3–7 j) — **doit figurer** dans votre synthèse |

**Triangle d’arbitrage :**

- CFO veut libérer du cash (destock ciblé possible, **non prioritaire**).
- Ventes veut préserver OTIF 95 %.
- Ops veut réduire les erreurs picking/réception.

### 3. Réponse correcte à utiliser

**Diagnostic (KPI_DIAGNOSTIC — ≥ 150 caractères) :**
> Rotation normale à 6×, service excellent 95 %, erreurs acceptables 4 %, délai lead time **3,5 jours**. Je recommande un programme qualité exécution (picking/réception) pour réduire les erreurs de 4 % à 2 %. **Trade-off :** on reporte le destock pour maintenir le service et le capital immobilisé. **Priorité arbitrage :** financer la réduction d’erreurs comme initiative unique. Cible 90 jours avec KPI de suivi rotation, service, erreur et délai.

### 4. Pourquoi cette réponse est correcte

- **≥ 3 domaines KPI** couverts (rotation, service, erreurs, délai).
- **Une initiative unique** : programme qualité exécution.
- **Trade-off explicite** : destock **reporté** pour préserver service et capital.
- **Horizon 90 jours** + KPIs de suivi nommés.

### 5. Mots à inclure

`arbitrage` · `trade-off` · `reporte` · `maintien` · `priorité` · `initiative` · `programme qualité` · `picking` · `réception` · `3,5` · `90 jours` · `rotation` · `service` · `erreur` · `délai` · `recommande`

### 6. Mots et actions à éviter

| À éviter | Pourquoi |
|----------|----------|
| Décision mono-KPI (rotation seule ou service seul) | Échec conformité (< 3 domaines) |
| Oublier le lead time 3,5 j | Échec conformité |
| Diagnostic trop court (< 150 caractères) | Échec conformité |
| « Surstock » à 6× | Incohérent avec les bandes |
| Liste de souhaits sans **une** initiative financée | Rate l’objectif S&OP |

### 7. Explication prof (courte)

*« Si vous n’avez budget que pour UNE action, laquelle et pourquoi ? »* — Le programme qualité exécution a le plus fort impact : il adresse la fragilité Ops tout en préservant OTIF et en reportant le destock CFO à un cycle ultérieur.

---

# MODULE 5 — Simulation intégrée (Peak Week)

> **Rappel :** En Module 5, vous **exécutez** un cycle entrepôt puis **soumettez des KPI dérivés de vos transactions**. Ne recopiez pas les chiffres du portefeuille M4 (400 u. / 48 000 $) — utilisez les valeurs du **moniteur** après vos opérations.

**Contrat commun Peak Week :** SKU-001 · 50 u. · PO-M5-001 · LOT-M5-A · REC-01 → B-01-R1-L1 · min 10 · max 100

---

## SCN-015 — Cycle opérationnel intégré (Jour 1 nominal)

**Votre rôle :** Gestionnaire logistique — Peak Week, cycle sans anomalie (7 étapes)

### 1. Ce que le scénario teste

Enchaîner un cycle complet **fournisseur → entrepôt → client** :

1. Réception · 2. Rangement FIFO · 3. Comptage · 4. Réappro · 5. Snapshot KPI · 6. Décision **tactique** · 7. Conformité M5

**Compétence visée :** prouver que les KPI viennent de vos opérations, pas d’une fiche théorique.

### 2. Comment lire le KPI

**Avant vos opérations** — le tour de contrôle affiche des **cibles de contexte** (Annexe A, dont 48 000 $). Ce sont des références, pas vos valeurs à soumettre.

**Après vos opérations** — valeurs à soumettre à M5_KPI (depuis le moniteur) :

| Champ | Valeur | Logique |
|-------|--------|---------|
| Consommation annuelle | **300** | 50 × 6 (rotation cible) |
| Stock moyen | **50** | Stock au bin B-01-R1-L1 |
| OTIF | **285 / 300** | Contrat seed |
| Erreurs | **12 / 300** | Contrat seed |
| Délai | **3,5 j** | Contrat seed |
| Valeur stock | **6 000 $** | 50 × 120 (≠ 48 000 $ portefeuille) |

**Snapshot calculé :** Rotation 6× · Service 95 % · Erreurs 4 % · Délai 3,5 j

**Réapprovisionnement :** stock 50 ≥ min 10 → **Q = 0** (pas de commande).

### 3. Réponse correcte à utiliser

| Étape | Valeurs / action |
|-------|------------------|
| **M5_RECEPTION** | SKU-001 · **50 u.** · PO-M5-001 · zone REC-01 |
| **M5_PUTAWAY** | REC-01 → **B-01-R1-L1** · 50 u. · lot **LOT-M5-A** · FIFO |
| **M5_CYCLE_COUNT** | B-01-R1-L1 · système **50** = physique **50** · variance **0** |
| **M5_REPLENISH** | Stock 50 ≥ min 10 → **Q = 0** |
| **M5_KPI** | 300 / 50 / 285 / 300 / 12 / 300 / 3,5 / **6000** + ☑ confirmé depuis moniteur |
| **M5_DECISION** | Performance globale correcte. Stock au-dessus du minimum — **aucun réapprovisionnement**. **Maintien opérationnel** avec amélioration qualité (formation picking, revue procédure réception, cible erreurs **2 %**). |
| **COMPLIANCE_M5** | Valider après les 7 étapes complètes |

### 4. Pourquoi cette réponse est correcte

- Chaque transaction crée une **preuve** pour l’étape suivante.
- Les KPI soumis correspondent au **ledger** (50 u., 6 000 $), pas au portefeuille M4.
- Q = 0 respecte la règle min/max : pas de commande quand le stock est suffisant.
- La décision est **tactique** (post-cycle immédiat), pas stratégique à 90 jours (réservé à SCN-017).

### 5. Mots à inclure

`SKU-001` · `50` · `PO-M5-001` · `B-01-R1-L1` · `LOT-M5-A` · `FIFO` · `variance 0` · `Q = 0` · `moniteur` · `maintien` · `formation` · `picking` · `2 %`

### 6. Mots et actions à éviter

| À éviter | Pourquoi |
|----------|----------|
| Commander réappro (Q ≠ 0) avec stock 50 > min 10 | Erreur logique — pénalité |
| Coller Annexe A (400 / 48 000) dans M5_KPI | Soumission rejetée |
| Oublier ☑ « confirmé depuis moniteur » | Soumission rejetée |
| Décision stratégique 90 j (style SCN-017) | Niveau inadapté — SCN-015 = tactique |
| Mauvais bin (≠ B-01-R1-L1) | Étape rejetée |
| Sauter une étape | Conformité bloquée |

### 7. Explication prof (courte)

*« Pourquoi le moniteur affiche 6 000 $ et pas 48 000 $ ? »* — Les 48 000 $ représentent le portefeuille entier (Module 4). Ici, vous ne gérez qu’un SKU sur un cycle : 50 u. × 120 $ = 6 000 $. Vos KPI doivent refléter **votre** cycle, pas la fiche théorique.

---

## SCN-016 — Gestion d’écarts et correction (Jour 2)

**Votre rôle :** Gestionnaire d’entrepôt — écart inventaire injecté (8 étapes)

### 1. Ce que le scénario teste

Gérer une **exception inventaire** : au comptage, le système indique 50 u. mais le décompte physique trouve **45 u.** (écart **−5**). Vous devez :

- Poster l’ajustement **M5_ADJ (MI07)** **avant** réappro, KPI et décision ;
- Utiliser le stock **post-correction** (45 u.) pour la suite ;
- Compléter le cycle avec un snapshot fiable.

**Compétence visée :** corriger avant de piloter — même principe qu’en Module 1 (SCN-010) et Module 3.

### 2. Comment lire le KPI

**Signal primaire (M5_CYCLE_COUNT) :**

| Mesure | Valeur |
|--------|--------|
| Stock système | **50 u.** |
| Décompte physique | **45 u.** |
| Variance | **−5 u.** |

**Après M5_ADJ (−5) — valeurs M5_KPI :**

| Champ | Valeur |
|-------|--------|
| Stock moyen | **45** |
| Consommation annuelle | **270** (45 × 6) |
| Valeur stock | **5 400 $** (45 × 120) |
| OTIF / erreurs / délai | 285/300 · 12/300 · 3,5 j (inchangés) |

**Réappro :** 45 u. > min 10 → **Q = 0** (malgré l’écart corrigé).

**Règle d’or :** REPLENISH / KPI / DECISION sont **bloqués** tant que M5_ADJ n’est pas posté.

### 3. Réponse correcte à utiliser

| Étape | Valeurs / action |
|-------|------------------|
| **M5_RECEPTION** | SKU-001 · 50 u. · PO-M5-001 |
| **M5_PUTAWAY** | REC-01 → B-01-R1-L1 · 50 u. · LOT-M5-A |
| **M5_CYCLE_COUNT** | Système 50 · physique **45** · écart **−5** |
| **M5_ADJ** | varianceQty **−5** · justification ≥ 10 car. · bin B-01-R1-L1 |
| **M5_REPLENISH** | systemQty **45** · min 10 · **Q = 0** |
| **M5_KPI** | 270 / 45 / 285 / 300 / 12 / 300 / 3,5 / **5400** + ☑ ancrage |
| **M5_DECISION** | Stock réconcilié à **45 u.** KPI dans les bandes normales. **Pas de réapprovisionnement**. Priorité : renforcer la **fiabilité inventaire** (double-vérification comptage, formation picking/réception). |

**Texte M5_ADJ :**
> Ajustement MI07 de −5 u. sur SKU-001 @ B-01-R1-L1. Justification : écart constaté au comptage cyclique MI04 — stock physique 45 u. vs système 50 u. ; réconciliation avant réappro et KPI.

### 4. Pourquoi cette réponse est correcte

- L’écart est **corrigé** avant toute décision — les KPI sur stock non réconcilié seraient faussés.
- Le signe **−5** (pas +5) aligne le système sur la réalité physique.
- Le réappro utilise **45** (post-ADJ), pas 50.
- Les bandes rotation/service/erreurs restent stables — l’enjeu pédagogique est la **fiabilité inventaire**.

### 5. Mots à inclure

`variance` · `−5` · `MI07` · `MI04` · `ajustement` · `réconciliation` · `45` · `5400` · `Q = 0` · `double-vérification` · `fiabilité inventaire`

### 6. Mots et actions à éviter

| À éviter | Pourquoi |
|----------|----------|
| Sauter M5_ADJ et tenter KPI/réappro | Bloqué par le simulateur |
| varianceQty = **+5** (mauvais signe) | Étape rejetée |
| Réappro avec stock **50** (pré-ADJ) | Logique incorrecte |
| Coller Annexe A (400 / 48 000) | KPI rejeté |
| Justification < 10 caractères | UI bloque |
| Attendre l’écart avant la réception | L’écart n’apparaît qu’au **comptage** |

### 7. Explication prof (courte)

*« Pourquoi corriger avant de décider ? »* — Un KPI calculé sur un stock faux mène à de mauvaises commandes et de mauvaises recommandations. En logistique professionnelle, on réconcilie d’abord, on pilote ensuite.

---

## SCN-017 — Décision stratégique et capstone M5 (Jour 3)

**Votre rôle :** Directeur logistique — recommandation au comité (7 étapes, pas de variance)

### 1. Ce que le scénario teste

Capstone programme TEC.LOG :

1. Exécuter le cycle ops nominal (identique SCN-015) ;
2. Ancrer le **snapshot KPI** au moniteur ;
3. Formuler une **décision stratégique** citant **≥ 2 KPI chiffrés**, avec **arbitrage explicite** et horizon **90–180 jours**.

**Compétence visée :** passer de l’exécution ops à la synthèse exécutive — lier preuves, chiffres et recommandation board.

### 2. Comment lire le KPI

**Ledger post-cycle (identique SCN-015) :**

| KPI | Valeur | Bande |
|-----|--------|-------|
| Rotation | **6×** (300 / 50) | Normal |
| Service (OTIF) | **95 %** (285/300) | Excellent |
| Erreurs | **4 %** (12/300) | Acceptable |
| Délai | **3,5 j** | Normal |
| Valeur stock | **6 000 $** | Run-scoped (≠ 48 000 $ portefeuille) |

**Obligation :** citer les chiffres du **panneau snapshot** de votre run — pas le portefeuille Annexe A.

### 3. Réponse correcte à utiliser

**Ops (identique SCN-015) :** réception 50 · putaway B-01-R1-L1 · comptage 50=50 · réappro Q=0 · KPI 300/50/285/300/12/300/3,5/**6000** + ☑ ancrage

**M5_DECISION — Modèle recommandé (qualité d’exécution) :**
> Entrepôt post-cycle intégré ; performance globale correcte avec erreurs à 4 %. Preuve KPI : rotation **6×** normal, service **95 %** excellent, erreurs **4 %** acceptable, délai **3,5 j**. **Arbitrage** : maintenir politique stock vs investir en qualité d’exécution. **Recommandation** : plan **90 j** — formation picking/réception, checklists, revue hebdo erreurs. **KPI suivi** : erreurs → ≤ 2 % sans descendre sous **93 %** service.

**Autres orientations valides (choisir une, justifier avec ≥ 2 KPI) :**

- **Capital :** rotation 6× + stock 6 000 $ + service 95 % → destock ciblé SKU faible rotation, −15 % stock en 6 mois, service ≥ 93 %.
- **Capacité :** service 95 % + délai 3,5 j serré → investir capacité préparation, lead time ≤ 3 j, volume +20 % sur 90–180 j.

### 4. Pourquoi cette réponse est correcte

- Niveau **stratégique** (directeur au comité), pas opérationnel (MIGO, LT01…).
- **≥ 2 KPI chiffrés** du snapshot (rotation 6×, service 95 %, erreurs 4 %, etc.).
- **Arbitrage explicite** : ce que vous choisissez et ce que vous sacrifiez.
- **Horizon temporel** : 90 à 180 jours.
- Texte suffisamment développé (≥ 150 caractères recommandé).

### 5. Mots à inclure

`arbitrage` · `recommandation` · `90 j` · `180 j` · `6×` · `95 %` · `4 %` · `3,5 j` · `6000` · `KPI` · `trade-off` · `maintien` · `formation` · `plan` · `suivi`

### 6. Mots et actions à éviter

| À éviter | Pourquoi |
|----------|----------|
| « Poster la réception et continuer le rangement » | Niveau opérationnel — rejet STRATEGIC |
| « Améliorer la performance globale » (sans chiffres) | Trop vague — rejet |
| « Réduire le stock de 50 % immédiatement » | Mono-KPI incohérent |
| Coller 48 000 $ (Annexe A) | Incohérent avec votre snapshot |
| Décision avant M5_KPI | API bloquée |
| Conformité avant décision acceptée | COMPLIANCE_M5_FAILED |
| Copier la décision tactique de SCN-015 | Niveau insuffisant pour le capstone |

### 7. Explication prof (courte)

*« Vous êtes Directeur Logistique au comité — quelle recommandation et sur quels chiffres ? »* — SCN-017 intègre tout le parcours : vous avez prouvé vos ops (SCN-015/016), vous lisez vos KPI réels, puis vous **créez** une orientation stratégique avec arbitrage et horizon — c’est la compétence Bloom « Créer », distincte de l’analyse S&OP du Module 4.

---

## Parcours et certification

```
Module 4 : SCN-012 (rotation/capital) → SCN-013 (service/erreurs) → SCN-014 (S&OP)
Module 5 : SCN-015 (nominal J1) → SCN-016 (variance J2) → SCN-017 (stratégique J3)
```

| Scénario | Module | Seuil | Objectif principal |
|----------|--------|-------|-------------------|
| SCN-012 | M4 | 70 | Politique stock / capital |
| SCN-013 | M4 | 70 | Piège tableau vert / SLA J-90 |
| SCN-014 | M4 | 70 | Arbitrage S&OP multi-KPI |
| SCN-015 | M5 | 70 | Cycle ops intégré nominal |
| SCN-016 | M5 | 70 | Correction écart inventaire |
| SCN-017 | M5 | 70 | Décision stratégique capstone |

---

## Conseils finaux

1. **Lisez la fiche mission** avant de commencer — le contexte (CFO, SLA J-90, S&OP, Peak Week) oriente votre décision.
2. **Module 4 = analyser** · **Module 5 = exécuter puis analyser** vos propres chiffres.
3. **Reformulez avec vos mots** — tant que vous respectez la logique (bandes KPI, corrélation, arbitrage, preuves ops), vous n’avez pas besoin de copier ce guide mot pour mot.
4. En cas de doute, posez-vous : *« Qu’est-ce que ce chiffre me dit ? Quelle action professionnelle en découle ? »*

---

*TEC.LOG — Collège de la Concorde · Guide étudiant M4-M5 · Distribution autorisée aux étudiants inscrits*
