# Guide officiel des réponses — Modules 4 et 5

**Programme :** TEC.LOG — Simulation WMS intégrée  
**Document :** GUIDE_OFFICIEL_REPONSES_M4_M5  
**Version :** 1.0 — 2026-06-18  
**Audience :** Étudiants — référence officielle de préparation et de révision  
**Scénarios couverts :** SCN-012 · SCN-013 · SCN-014 · SCN-015 · SCN-016 · SCN-017  

---

## Avant-propos

Ce guide consolide les réponses canoniques validées par le simulateur TEC.WMS pour les six scénarios d'évaluation des **Modules 4 (Indicateurs de performance logistique)** et **5 (Simulation intégrée — Peak Week)**.

| Paramètre | Valeur |
|-----------|--------|
| **Seuil de réussite** | ≥ 70 / 100 (tous scénarios) |
| **Plafond M4 (parfait)** | 75 / 100 — score maximal atteignable par conception |
| **Plafond M5 (parfait)** | 100 / 100 — après clamp du moteur de scoring |
| **Certification Gold** | SCN-012 à SCN-017 requis selon parcours |

### Jeu de données M4 — Annexe A (partagé SCN-012 à SCN-014)

| Indicateur | Valeur | Formule / source |
|------------|--------|------------------|
| Consommation annuelle | 2 400 u. | KPI_DATA |
| Stock moyen | 400 u. | KPI_DATA |
| **Rotation** | **6,0×/an** | 2 400 ÷ 400 |
| Commandes honorées | 285 / 300 | KPI_DATA |
| **Taux de service (OTIF)** | **95,0 %** | 285 ÷ 300 |
| Erreurs opérationnelles | 12 / 300 | KPI_DATA |
| **Taux d'erreur** | **4,0 %** | 12 ÷ 300 |
| Délai moyen (lead time) | 3,5 j | KPI_DATA |
| Capital immobilisé | 48 000 $ | KPI_DATA |

### Bandes d'interprétation industrielles

| KPI | Bande | Seuil |
|-----|-------|-------|
| Rotation | Surstock | < 4×/an |
| Rotation | **Normal** | **4–12×/an** |
| Rotation | Sous-performance | > 12×/an |
| Service | **Excellent** | **≥ 95 %** |
| Service | Acceptable | 85–95 % |
| Service | Insuffisant | < 85 % |
| Erreurs | Excellent | ≤ 1 % |
| Erreurs | **Acceptable** | **1–5 %** |
| Erreurs | Critique | > 5 % |

### Pipeline M4 (analytique — aucune transaction WMS)

```
KPI_DATA → KPI_ROTATION → KPI_SERVICE → KPI_DIAGNOSTIC → COMPLIANCE_M4
```

### Pipeline M5 (opérationnel intégré)

```
SCN-015 / SCN-017 (7 étapes) :
M5_RECEPTION → M5_PUTAWAY → M5_CYCLE_COUNT → M5_REPLENISH → M5_KPI → M5_DECISION → COMPLIANCE_M5

SCN-016 (8 étapes — écart inventaire) :
… → M5_CYCLE_COUNT → M5_ADJ → M5_REPLENISH → …
```

---

# MODULE 4 — Indicateurs de performance logistique

---

## SCN-012 — Politique stock et capital immobilisé

**Module :** M4 · **Rôle :** Analyste logistique — revue capital circulant  
**Compétence :** Analyse performance (rotation stocks) · **Bloom :** Analyser  
**Contexte :** Revue Q3 du CFO — les 48 000 $ immobilisés sont-ils justifiés ?

### 1. Objectif

Recommander une **politique stock** au comité finance : classifier la rotation 6× dans la bande industrielle, évaluer si le capital immobilisé de 48 000 $ est cohérent, et proposer **maintien, réduction ciblée par SKU ou hausse** — sans chasse au surstock global.

### 2. Lecture KPI

| Indicateur | Valeur lue | Source |
|------------|------------|--------|
| Consommation annuelle | 2 400 u. | Tour de contrôle KPI |
| Stock moyen | 400 u. | Tour de contrôle KPI |
| Rotation | **6,0×/an** | 2 400 ÷ 400 |
| OTIF | 95,0 % (285/300) | Contexte portefeuille |
| Taux d'erreur | 4,0 % (12/300) | Contexte portefeuille |
| Délai moyen | 3,5 j | Contexte |
| Capital immobilisé | **48 000 $** | Lentille CFO — indicateur central |

### 3. Interprétation KPI

| KPI | Bande | Interprétation attendue |
|-----|-------|-------------------------|
| **Rotation 6×** | **Normal** (4–12×) | Ni surstock ni sous-performance — rotation équilibrée |
| OTIF 95 % | Excellent | Contexte favorable — ne pas déclencher de destock agressif |
| Erreurs 4 % | Acceptable | Contexte secondaire — pas le levier principal du scénario |
| Capital 48 000 $ | Cohérent avec 6× | Pression CFO légitime, mais **pas de surstock systémique** |

**Piège pédagogique :** 6× n'est **pas** du surstock (seuil surstock = < 4×). Le capital immobilisé exige une **politique**, pas une réaction panique.

### 4. Réponse correcte

**KPI_DATA (accusé de réception) :**
> Données KPI chargées : rotation 6× (2 400 ÷ 400), OTIF 95 %, erreurs 4 %, délai 3,5 j, capital immobilisé 48 000 $. Contexte revue CFO Q3 — analyse portefeuille, pas de transaction WMS.

**KPI_ROTATION :**
> Le taux de rotation est de 6× (2 400 ÷ 400), ce qui correspond à une **performance normale** dans la bande industrielle 4–12×. Le capital immobilisé de 48 000 $ est cohérent avec une rotation équilibrée ; pas de surstock systémique.

**KPI_SERVICE (contexte) :**
> OTIF 95 % — niveau **excellent** au seuil. Erreurs 4 % — bande **acceptable** en contexte portefeuille. Ces indicateurs soutiennent une politique de maintien plutôt qu'un destock global.

**KPI_DIAGNOSTIC :**
> Je **recommande** de **maintenir** la politique stock actuelle avec **surveillance SKU** par référence. **Décision** : monitorer les faibles rotations (< 4×) sans **destock global**. **Action** : revue mensuelle des 48 000 $ immobilisés et des articles à rotation lente.

### 5. Décision

**Maintenir** la politique stock actuelle avec surveillance ciblée par SKU — **pas** de réduction massive du portefeuille.

### 6. Recommandation

Politique de **maintien + surveillance SKU** : identifier les références à rotation < 4× pour action ciblée, conserver le niveau de stock global compatible avec OTIF 95 %.

### 7. Action

- Revue **mensuelle** du capital immobilisé (48 000 $)
- Cartographie des SKU à rotation faible
- Ajustements **ciblés par référence** uniquement — jamais de destock global aveugle

### 8. Stratégie

Optimiser le **working capital** sans sur-réaction : la rotation normale à 6× justifie le maintien de la politique actuelle, avec un filet de surveillance pour détecter les dérives SKU avant qu'elles n'alourdissent le bilan.

### 9. Concepts ERP / WMS

| Concept | Référence |
|---------|-----------|
| Rotation des stocks | MC$4 · Inventory turnover reports |
| Valorisation stock | CO-PA · Stock immobilisé |
| Contrôle de gestion logistique | Logistics controlling |
| Mode analytique M4 | Aucune transaction physique — interprétation KPI uniquement |
| Conformité M4 | ISO-style — interprétation documentée avant clôture |

### 10. Erreurs fréquentes

| Erreur | Conséquence |
|--------|-------------|
| Déclarer « surstock » à 6× | −5 pts rotation · échec conformité |
| Conclure « rien à faire » sans plan de surveillance | Échec conformité SCN-012 |
| Recommander destock global sans nuance SKU | Échec conformité |
| Ignorer la formule rotation (consommation ÷ stock) | Diagnostic incomplet |
| Copier le plan SCN-013 (formation picking) | Mauvais levier pour ce scénario |

### 11. Notes professorales

- M4 est **100 % analytique** — moniteur de transactions vide = normal.
- Seuil 70/100 · plafond parfait **75/100**.
- Question de cadrage : *« Qu'est-ce que ce KPI vous dit sur le capital immobilisé ? »*
- Mots-clés conformité diagnostic : `maintenir`, `surveiller`, `SKU`, `politique`.
- Interdits : `surstock` à 6× · `rien à faire` · `aucune action`.

---

## SCN-013 — Taux de service et erreurs opérationnelles

**Module :** M4 · **Rôle :** Responsable performance — revue SLA J-90  
**Compétence :** Analyse service et qualité d'exécution · **Bloom :** Évaluer  
**Contexte :** Renouvellement contrat grand compte dans 90 jours — **piège du tableau vert**

### 1. Objectif

Reconnaître l'**excellence OTIF au seuil** (95 %), corréler les **erreurs opérationnelles** (4 %) au risque de dérive OTIF, et proposer un **plan d'exécution chiffré** avant J-90 — **pas** diagnostiquer un « faible service ».

### 2. Lecture KPI

| Indicateur | Valeur lue | Formule |
|------------|------------|---------|
| OTIF | **95,0 %** | 285 commandes ÷ 300 |
| Taux d'erreur | **4,0 %** | 12 erreurs ÷ 300 opérations |
| Rotation | 6,0× | 2 400 ÷ 400 (contexte) |
| Délai moyen | 3,5 j | Contexte |
| Capital immobilisé | 48 000 $ | Contexte portefeuille |

### 3. Interprétation KPI

| KPI | Bande | Interprétation attendue |
|-----|-------|-------------------------|
| **OTIF 95 %** | **Excellent** (≥ 95 %) | Au seuil — **ne pas** qualifier de « faible » ou « insuffisant » |
| **Erreurs 4 %** | **Acceptable** (1–5 %) | Corrigible — source de **fragilité OTIF** à horizon J-90 |
| Rotation 6× | Normal | Contexte seulement — ne pas bloquer avec « surstock » |
| Corrélation clé | — | Erreurs **picking / prélèvement / réception** → risque OTIF malgré dashboard vert |

**Piège pédagogique :** Le dashboard est vert, mais l'exécution reste le levier prioritaire — **exécution amber**, pas alarme rouge.

### 4. Réponse correcte

**KPI_DATA :**
> Briefing validé : OTIF 285/300 (95 %), erreurs 12/300 (4 %), rotation 6×, délai 3,5 j, capital 48 000 $. Contexte SCN-013 : revue SLA J-90.

**KPI_ROTATION :**
> Rotation **normale** à 6× — bande 4–12×, contexte portefeuille stable.

**KPI_SERVICE (+ erreurs intégrées) :**
> OTIF 95,0 % — niveau **excellent** au seuil (≥ 95 %). Taux d'erreur 4,0 % (12/300) — bande **acceptable** mais corrigeable. Je corrèle ces erreurs de **picking** et de **réception** au risque de dérive OTIF avant renouvellement SLA J-90.

**KPI_DIAGNOSTIC :**
> Diagnostic SCN-013 — piège tableau vert. OTIF **95 %** reconnu **excellent** ; le risque prioritaire est l'exécution : **erreurs** de **picking** et de **réception** à **4 %** fragilisent OTIF à horizon **90** jours. **Je recommande** un programme qualité : formation picking, double validation réception, revue **hebdomadaire** du top 3 des erreurs, cible **2 %** d'ici J-90. **Décision** : financer le budget formation plutôt qu'un **destock**.

### 5. Décision

Financer un **programme qualité d'exécution** (formation + contrôles) plutôt qu'un levier stock — le service est déjà excellent au seuil ; le risque est la dérive par les erreurs opérationnelles.

### 6. Recommandation

Programme qualité picking/réception avec cible **2 %** d'erreurs, suivi **hebdomadaire**, horizon **90 jours** — double validation réception incluse.

### 7. Action

- Formation équipes picking et réception
- Double validation à la réception
- Revue hebdomadaire du top 3 des erreurs QM
- Suivi OTIF en parallèle du taux d'erreur

### 8. Stratégie

Protéger le renouvellement SLA J-90 en traitant la **qualité d'exécution** comme levier prioritaire : réduire les erreurs de 4 % à 2 % sans dégrader l'OTIF excellent déjà atteint.

### 9. Concepts ERP / WMS

| Concept | Référence |
|---------|-----------|
| OTIF (On-Time In-Full) | Taux de service client |
| QM — contrôle qualité | Erreurs opérationnelles / total opérations |
| Picking / prélèvement | Source d'erreurs corrélées à OTIF |
| Réception (MIGO) | Point de contrôle qualité entrante |
| Gouvernance KPI M4 | COMPLIANCE_M4 — corrélation erreurs ↔ exécution |

### 10. Erreurs fréquentes

| Erreur | Conséquence |
|--------|-------------|
| Qualifier 95 % de « acceptable » ou « insuffisant » | −5 pts service · échec conformité |
| Analyser OTIF sans mentionner les 4 % d'erreurs | Diagnostic incomplet |
| « 95 % = tout va bien » (complaisance) | Échec conformité |
| Destock comme levier principal | Échec conformité SCN-013 |
| Plan sans cible % ni horizon 90 j / hebdo | Échec conformité |
| Erreurs génériques sans picking/réception/OTIF | Échec corrélation |

### 11. Notes professorales

- Pas d'étape KPI_ERRORS séparée — intégrer l'analyse erreurs dans KPI_SERVICE et KPI_DIAGNOSTIC.
- Fixture de référence : *« Service excellent au seuil. Les erreurs picking et reception a 4% menacent OTIF… »*
- Plafond parfait **75/100**.
- Distinction bandes : 4 % = **acceptable**, pas « excellent » (< 2 %).

---

## SCN-014 — Analyse S&OP et arbitrage multi-KPI

**Module :** M4 · **Rôle :** Directeur des opérations — arbitrage S&OP  
**Compétence :** Diagnostic stratégique multi-KPI · **Bloom :** Évaluer  
**Contexte :** Comité S&OP mensuel — **budget pour UNE seule initiative financée**

### 1. Objectif

Arbitrer **une initiative unique** en synthétisant quatre lentilles KPI (CFO / Ventes / Ops / Supply), nommer le **levier prioritaire**, le **sacrifice explicite** et les **KPIs de suivi** sur 90 jours.

### 2. Lecture KPI

| Lentille | KPI | Valeur | Statut |
|----------|-----|--------|--------|
| **CFO (capital)** | Rotation + capital | 6× · 48 000 $ | Normal · pression cash |
| **Ventes (SLA)** | OTIF | 95,0 % | Excellent au seuil |
| **Ops (exécution)** | Erreurs | 4,0 % | Acceptable — fragilité cachée |
| **Supply (appro)** | Lead time | 3,5 j | Normal (3–7 j) |

### 3. Interprétation KPI

| KPI | Interprétation S&OP |
|-----|---------------------|
| Rotation 6× | Normal — pas de chasse au surstock global (héritage SCN-012) |
| OTIF 95 % | Ventes satisfaites au seuil — **maintenir** est impératif |
| Erreurs 4 % | Ops : picking/réception menacent OTIF — **levier naturel** pour l'initiative unique |
| Lead time 3,5 j | Pas d'urgence supply — **doit figurer** dans le diagnostic |
| Capital 48 000 $ | CFO : destock ciblé possible mais **non prioritaire** vs qualité exécution |

**Triangle d'arbitrage :**

| Partie prenante | Pression | Levier typique | Sacrifice typique |
|-----------------|----------|----------------|-------------------|
| CFO | 48 000 $ immobilisés | Destock ciblé SKU | Report investissement qualité |
| Ventes | OTIF 95 % au seuil | Maintenir service | Pas de baisse stock agressive |
| Ops | 4 % erreurs corrigeables | Programme qualité picking/réception | Destock reporté |

### 4. Réponse correcte

**KPI_DATA :**
> Briefing KPI : consommation 2 400 u., stock 400 u., OTIF 285/300, erreurs 12/300, délai 3,5 j, capital 48 000 $. Contexte S&OP : arbitrage multi-KPI, une initiative financée.

**KPI_ROTATION :**
> Rotation **normale** à 6× — bande 4–12×, capital 48 000 $ cohérent, pas de surstock systémique.

**KPI_SERVICE :**
> Service **excellent** à 95 % — optimal au seuil. Erreurs 4 % acceptables mais risque latent pour OTIF — à intégrer dans l'arbitrage S&OP.

**KPI_DIAGNOSTIC (≥ 150 caractères) :**
> Rotation normale à 6×, service excellent 95 %, erreurs acceptables 4 %, délai lead time **3,5 jours**. Je recommande un programme qualité exécution (picking/réception) pour réduire les erreurs de 4 % à 2 %. **Trade-off :** on reporte le destock pour maintenir le service et le capital immobilisé. **Priorité arbitrage :** financer la réduction d'erreurs comme initiative unique. Cible 90 jours avec KPI de suivi rotation, service, erreur et délai.

### 5. Décision

Financer le **programme qualité exécution** (réduction erreurs 4 % → 2 %) comme **initiative unique** — reporter le destock pour préserver OTIF et capital.

### 6. Recommandation

Programme qualité picking/réception sur **90 jours** : formation, checklists, revue hebdomadaire erreurs — avec KPIs de suivi sur rotation, service, erreur et délai.

### 7. Action

- Lancer le programme qualité exécution (budget unique S&OP)
- Reporter le destock ciblé CFO à un cycle ultérieur
- Instaurer un tableau de bord hebdomadaire multi-KPI

### 8. Stratégie

Arbitrage intégré : optimiser la **qualité d'exécution** comme levier à plus fort impact sur la performance globale, en sacrifiant temporairement la libération de cash par destock — préservation du service client au seuil excellent.

### 9. Concepts ERP / WMS

| Concept | Référence |
|---------|-----------|
| S&OP (Sales & Operations Planning) | Arbitrage mensuel multi-fonctions |
| SAC pipeline | 4 lentilles KPI requises |
| ME2M | Délai fournisseur moyen (lead time) |
| CO-PA | Capital immobilisé — lentille CFO |
| Capstone M4 | Synthèse SCN-012 + SCN-013 + lead time |

### 10. Erreurs fréquentes

| Erreur | Conséquence |
|--------|-------------|
| Décision mono-KPI (rotation seule ou service seul) | Échec conformité (< 3 domaines) |
| Omission du lead time 3,5 j | Échec conformité |
| Diagnostic < 150 caractères | Échec conformité |
| Absence de vocabulaire trade-off (`arbitrage`, `reporte`, `sacrifi`, `maintien`) | Échec conformité |
| « Surstock » à 6× | Échec conformité global |
| Liste de souhaits sans UNE initiative financée | Échec pédagogique |

### 11. Notes professorales

- Question de cadrage : *« Si vous n'avez budget que pour UNE action, laquelle et pourquoi ? »*
- Minimum **3 domaines KPI** sur 4 dans le diagnostic (rotation · service · erreur · délai).
- Plafond parfait **75/100** · Gold key `SCN014`.
- Les règles SCN-013 (corrélation picking obligatoire) ne s'appliquent **pas** à SCN-014 — recommandées mais non bloquantes.

---

# MODULE 5 — Simulation intégrée (Peak Week)

---

## SCN-015 — Cycle opérationnel intégré (Jour 1 nominal)

**Module :** M5 · **Rôle :** Gestionnaire logistique  
**Compétence :** Orchestration entrepôt bout-en-bout · **Bloom :** Évaluer  
**Profil :** `NOMINAL_INTEGRATED` · **Décision :** TACTICAL (pas stratégique)  
**Contexte :** Peak Week Jour 1 — cycle nominal sans anomalie (7 étapes)

### 1. Objectif

Exécuter un **cycle opérationnel intégré** fournisseur → entrepôt → client : réception, rangement FIFO, comptage, réapprovisionnement, snapshot KPI ancré au moniteur, décision tactique, conformité M5.

### 2. Lecture KPI

**Avant opérations (contexte Annexe A — référence uniquement) :**

| KPI | Valeur cible (contexte) |
|-----|-------------------------|
| Rotation | 6× |
| Service | 95 % |
| Erreurs | 4 % |
| Lead time | 3,5 j |
| Capital | 48 000 $ (portefeuille) |

**Après opérations (ledger — valeurs à soumettre M5_KPI) :**

| Champ | Valeur dérivée | Logique |
|-------|----------------|---------|
| Consommation annuelle | **300** | 50 × 6 (rotation cible) |
| Stock moyen | **50** | Stock au bin B-01-R1-L1 |
| OTIF | **285 / 300** | Contrat seed |
| Erreurs | **12 / 300** | Contrat seed |
| Délai | **3,5 j** | Contrat seed |
| Valeur stock | **6 000 $** | 50 × 120 (≠ 48 000 $ portefeuille) |

**Snapshot calculé :** Rotation 6× · Service 95 % · Erreurs 4 % · Délai 3,5 j

### 3. Interprétation KPI

| KPI | Interprétation post-cycle |
|-----|----------------------------|
| Rotation 6× | Normal — cohérent avec le profil nominal |
| Service 95 % | Excellent — maintenu |
| Erreurs 4 % | Acceptables — marge d'amélioration opérationnelle |
| Stock 50 u. | Au-dessus du min (10) — **pas de réapprovisionnement** |
| Capital 6 000 $ | Valeur **run-scoped** — ne pas confondre avec Annexe A 48 000 $ |

### 4. Réponse correcte

| Étape | Valeurs / texte canonique |
|-------|---------------------------|
| **M5_RECEPTION** | SKU-001 · **50 u.** · PO-M5-001 · zone REC-01 |
| **M5_PUTAWAY** | REC-01 → **B-01-R1-L1** · 50 u. · lot **LOT-M5-A** · FIFO |
| **M5_CYCLE_COUNT** | B-01-R1-L1 · système **50** = physique **50** · variance **0** |
| **M5_REPLENISH** | Stock 50 ≥ min 10 → **Q = 0** (stock suffisant) |
| **M5_KPI** | 300 / 50 / 285 / 300 / 12 / 300 / 3,5 / **6000** + ☑ ancrage moniteur |
| **M5_DECISION** | Voir section Décision ci-dessous |
| **COMPLIANCE_M5** | Valider après 7 étapes complètes + snapshot |

### 5. Décision

Après cycle nominal Peak Week : les KPI montrent une performance globale **correcte**. Stock 50 u. au-dessus du minimum — **aucun réapprovisionnement immédiat**. Orientation : **maintien opérationnel** avec amélioration qualité.

### 6. Recommandation

Formation picking et revue procédure réception pour réduire les erreurs vers **2 %** sans dégrader le taux de service excellent.

### 7. Action

| Opération | Transaction | Détail |
|-----------|-------------|--------|
| Réception | MIGO 101 | GR 50 u. SKU-001 @ REC-01 |
| Rangement | LT01 | FIFO → B-01-R1-L1, lot LOT-M5-A |
| Comptage | MI04 | 50 = 50, variance 0 |
| Réappro | MD04 / ME21N | Q = 0 — stock suffisant |
| KPI | MC$4 | Snapshot depuis moniteur |
| Conformité | Audit gate | Clôture M5 |

### 8. Stratégie

Établir la **chaîne ops → KPI** comme fondation Gold path : chaque transaction crée la preuve pour l'étape suivante ; les KPI sont **dérivés du ledger**, jamais copiés depuis Annexe A.

### 9. Concepts ERP / WMS

| Étape | SAP | WMS / Odoo |
|-------|-----|------------|
| M5_RECEPTION | MIGO 101 | Réception fournisseur |
| M5_PUTAWAY | LT01 | Transfert interne + lot FIFO |
| M5_CYCLE_COUNT | MI04 | Comptage cyclique |
| M5_REPLENISH | MD04 / ME21N | Règle Min/Max |
| M5_KPI | MC$4 / MB52 | Snapshot KPI opérationnel |
| M5_DECISION | IBP (tactique) | Revue ops |
| COMPLIANCE_M5 | Clôture période | Validation audit |

**Contrat seed :** SKU-001 · 50 u. · PO-M5-001 · LOT-M5-A · min 10 · max 100 · safety 5

### 10. Erreurs fréquentes

| Erreur | Conséquence |
|--------|-------------|
| Commander réappro (Q ≠ 0) alors que stock 50 > min 10 | −5 à −10 pts réappro |
| Coller Annexe A (400 / 48 000) dans M5_KPI | Soumission rejetée |
| Oublier la case « confirmé depuis moniteur » | Soumission rejetée |
| Rédiger une décision SCN-017 (stratégique 90 j) | Inutile — SCN-015 = tactique |
| Mauvais bin destination (≠ B-01-R1-L1) | Étape rejetée |
| Sauter une étape | Conformité bloquée |

### 11. Notes professorales

- Stock initial **vide (0)** = normal — première preuve = réception.
- **Piège réappro :** Q = 0 quand stock ≥ min — ne pas commander par réflexe.
- UI affiche parfois « décision stratégique » — runtime = **TACTICAL** pour SCN-015.
- Plafond **100/100** · Gold key `SCN015`.
- Tour de contrôle affiche 48 000 $ (contexte) ; soumettre **6 000 $** (ledger).

---

## SCN-016 — Gestion d'écarts et correction (Jour 2)

**Module :** M5 · **Rôle :** Gestionnaire d'entrepôt  
**Compétence :** Action corrective — gestion d'exceptions · **Bloom :** Évaluer  
**Profil :** `EXCEPTION_VARIANCE` · **Décision :** TACTICAL  
**Contexte :** Peak Week Jour 2 — écart inventaire **−5 u.** injecté au comptage (8 étapes)

### 1. Objectif

Gérer un **écart inventaire injecté** en cours de cycle M5, poster l'ajustement MI07 **avant** tout KPI ou décision, puis compléter le cycle avec snapshot post-correction.

### 2. Lecture KPI

**Signal primaire (M5_CYCLE_COUNT) :**

| Mesure | Valeur |
|--------|--------|
| Stock système | **50 u.** |
| Décompte physique | **45 u.** |
| Variance | **−5 u.** |

**Après M5_ADJ (−5) — ledger M5_KPI :**

| Champ | Valeur |
|-------|--------|
| Stock moyen | **45** |
| Consommation annuelle | **270** (45 × 6) |
| Valeur stock | **5 400 $** (45 × 120) |
| OTIF / erreurs / délai | 285/300 · 12/300 · 3,5 j (inchangés) |

**Snapshot :** Rotation 6× · Service 95 % · Erreurs 4 % · Délai 3,5 j · Stock 5 400 $

### 3. Interprétation KPI

| Signal | Interprétation |
|--------|----------------|
| Variance −5 | Exception inventaire — **action corrective obligatoire** avant pilotage |
| Post-ADJ stock 45 | Stock réconcilié — KPI fiables seulement **après** MI07 |
| Réappro Q = 0 | 45 u. > min 10 — pas de commande malgré l'écart corrigé |
| Bandes rotation/service/erreurs | Stables vs cycle nominal — l'enjeu est la **fiabilité inventaire** |

### 4. Réponse correcte

| Étape | Valeurs / texte canonique |
|-------|---------------------------|
| **M5_RECEPTION** | SKU-001 · 50 u. · PO-M5-001 |
| **M5_PUTAWAY** | REC-01 → B-01-R1-L1 · 50 u. · LOT-M5-A |
| **M5_CYCLE_COUNT** | Système 50 · physique **45** · écart **−5** — ADJ obligatoire |
| **M5_ADJ** | varianceQty **−5** · justification ≥ 10 car. · bin B-01-R1-L1 |
| **M5_REPLENISH** | systemQty **45** · min 10 · max 100 · **Q = 0** |
| **M5_KPI** | 270 / 45 / 285 / 300 / 12 / 300 / 3,5 / **5400** + ☑ ancrage |
| **M5_DECISION** | Voir sections Décision / Recommandation |
| **COMPLIANCE_M5** | 8 étapes · variance résolue · snapshot présent |

**Texte M5_ADJ canonique :**
> Ajustement MI07 de −5 u. sur SKU-001 @ B-01-R1-L1. Justification : écart constaté au comptage cyclique MI04 — stock physique 45 u. vs système 50 u. ; réconciliation avant réappro et KPI.

### 5. Décision

Après correction MI07 : stock réconcilié à **45 u.** — les KPI du cycle restent dans les bandes normales. **Pas de réapprovisionnement**. Priorité : renforcer la fiabilité inventaire avant tout pilotage KPI.

### 6. Recommandation

Procédure de **double-vérification** au comptage cyclique et **formation** courte picking/réception pour réduire les écarts en peak week.

### 7. Action

| Séquence | Action |
|----------|--------|
| 1 | Compléter réception + putaway (identique SCN-015) |
| 2 | Comptage MI04 → constater −5 |
| 3 | **Poster M5_ADJ (−5) avec justification** — débloque la suite |
| 4 | Réappro avec stock **post-correction** (45, pas 50) |
| 5 | KPI depuis moniteur post-ADJ |
| 6 | Décision tactique · conformité |

**Gate runtime :** REPLENISH / KPI / DECISION **bloqués** tant que M5_ADJ non posté.

### 8. Stratégie

**Corriger avant de piloter** — même principe que SCN-010 (M1) et CC→ADJ (M3) : toute décision KPI sur stock non réconcilié fausse l'analyse et le réapprovisionnement.

### 9. Concepts ERP / WMS

| Concept | Référence |
|---------|-----------|
| MI04 | Saisie comptage cyclique |
| MI07 | Ajustement inventaire (post-variance) |
| Exception management | Gestion d'écarts WMS |
| Variance gate | Blocage downstream jusqu'à résolution |
| Gold gate `scn-016-seq` | M5_ADJ complété **avant** M5_KPI |

### 10. Erreurs fréquentes

| Erreur | Conséquence |
|--------|-------------|
| Sauter M5_ADJ et tenter KPI/réappro | BAD_REQUEST — gate variance |
| varianceQty = +5 (mauvais signe) | Étape rejetée |
| Réappro avec stock 50 (pré-ADJ) | Points réduits · logique incorrecte |
| Coller Annexe A (400 / 48 000) | KPI rejeté |
| Justification < 10 caractères | UI bloque |
| Attendre variance avant réception | Variance n'apparaît qu'au comptage |

### 11. Notes professorales

- Pré-brief instructeur : *« une variance apparaîtra au comptage »*.
- Comptage avec variance ≠ 0 → **+10 pts** (pas +15).
- Gold requiert séquence ADJ **avant** KPI (`scn-016-seq`).
- Parallèle pédagogique explicite avec SCN-010 / M3 CC→ADJ.
- Plafond **100/100** · Gold key `SCN016`.

---

## SCN-017 — Décision stratégique et capstone M5 (Jour 3)

**Module :** M5 · **Rôle :** Directeur logistique  
**Compétence :** Décision stratégique justifiée par KPI · **Bloom :** Créer  
**Profil :** `STRATEGIC_CAPSTONE` · **Décision :** STRATEGIC (gate strict)  
**Contexte :** Peak Week Jour 3 — capstone programme TEC.LOG (7 étapes, pas de variance)

### 1. Objectif

Exécuter le cycle ops nominal (identique SCN-015), ancrer un **snapshot KPI** au moniteur, puis formuler une **décision stratégique** citant ≥ 2 KPI chiffrés du snapshot, avec **arbitrage explicite** et horizon **90–180 jours**.

### 2. Lecture KPI

**Ledger post-cycle (identique SCN-015) :**

| Champ snapshot | Valeur | Taux dérivé |
|----------------|--------|-------------|
| Consommation / stock | 300 / **50** | Rotation **6×** |
| OTIF | 285 / 300 | Service **95 %** |
| Erreurs | 12 / 300 | **4 %** |
| Délai | 3,5 j | Normal |
| Valeur stock | **6 000 $** | Run-scoped |

**Citation obligatoire :** utiliser les chiffres du **panneau snapshot** — pas le portefeuille Annexe A (48 000 $).

### 3. Interprétation KPI

| KPI | Interprétation stratégique |
|-----|---------------------------|
| Rotation 6× | Normal — politique stock soutenable |
| Service 95 % | Excellent — à préserver dans tout arbitrage |
| Erreurs 4 % | Acceptables — levier qualité d'exécution prioritaire |
| Délai 3,5 j | Normal mais serré — option capacité / résilience |
| Stock 6 000 $ | Base run-scoped pour arbitrage capital (≠ 48k portefeuille) |

### 4. Réponse correcte

**Ops (identique SCN-015) :**

| Étape | Valeur |
|-------|--------|
| M5_RECEPTION | SKU-001 · 50 · PO-M5-001 |
| M5_PUTAWAY | REC-01 → B-01-R1-L1 · LOT-M5-A |
| M5_CYCLE_COUNT | 50 = 50 · variance 0 |
| M5_REPLENISH | Q = 0 |
| M5_KPI | 300/50/285/300/12/300/3,5/6000 + ☑ ancrage |

**M5_DECISION — Modèle A1 (qualité d'exécution) :**
> Entrepôt post-cycle intégré ; performance globale correcte avec erreurs à 4 %. Preuve KPI : rotation **6×** normal, service **95 %** excellent, erreurs **4 %** acceptable, délai **3,5 j**. **Arbitrage** : maintenir politique stock vs investir en qualité d'exécution. **Recommandation** : plan **90 j** — formation picking/réception, checklists, revue hebdo erreurs. **KPI suivi** : erreurs → ≤ 2 % sans descendre sous **93 %** service.

**Modèle A2 (working capital) :**
> Rotation **6×**, stock immobilisé **[valeur snapshot]**, service **95 %**, erreurs **4 %**. **Arbitrage** stock/service/coût. Réduire cibles SKU faible rotation ; objectif **−15 %** stock en **6 mois** sans service < **93 %**.

**Modèle A3 (résilience capacité) :**
> Service **95 %** excellent mais délai **3,5 j** serré. **Arbitrage** capacité vs coût. Investir capacité préparation pour **+20 %** volume ; KPI : lead time ≤ **3 j**, service ≥ **95 %** sur **90–180 j**.

**Pattern unit-test accepté :**
> Rotation 6× normal et service 95% excellent ; erreurs 4% acceptable. J'arbitre entre maintien du stock immobilisé [snapshot $] et plan formation picking. Recommandation : initiative qualité 90 j pour réduire erreurs à 2% sans descendre sous 93% service.

### 5. Décision

Arbitrage **directeur logistique** au comité : choisir une orientation stratégique (qualité · capital · capacité) justifiée par **≥ 2 KPI chiffrés** du snapshot, avec sacrifice explicite.

### 6. Recommandation

Selon orientation choisie :
- **A1 :** Programme qualité 90 j — erreurs 4 % → 2 %, service maintenu ≥ 93 %
- **A2 :** Programme destock ciblé SKU — −15 % stock en 6 mois
- **A3 :** Investissement capacité — lead time ≤ 3 j, volume +20 %

### 7. Action

| Phase | Actions |
|-------|---------|
| Phase 1 — Ops | Cycle complet M5 (réception → réappro Q=0) |
| Phase 2 — KPI | Snapshot ledger + confirmation moniteur |
| Phase 3 — Décision | Texte stratégique ≥ 150 car. recommandé · citations chiffrées |
| Phase 4 — Conformité | COMPLIANCE_M5 après décision **acceptée** |

### 8. Stratégie

Capstone **Create** : passer de l'exécution ops (SCN-015/016) à la **synthèse exécutive** — lier preuves opérationnelles, snapshot KPI et recommandation board avec horizon temporel.

### 9. Concepts ERP / WMS

| Concept | Référence |
|---------|-----------|
| IBP | Integrated Business Planning — décision stratégique |
| Snapshot KPI | Ancrage ops → analytics (anti-paste Annexe A) |
| Gate STRATEGIC | `scoreM5StrategicDecision` — rejet si opérationnel ou générique |
| Gold capstone | `scn017CapstoneScore` + `scn017DecisionLinked` |
| Distinction M4 SCN-014 | M4 = Évaluer (analyste) · M5-017 = Créer (directeur) |

**Patterns rejetés :**

| ID | Exemple | Motif |
|----|---------|-------|
| R1 | « Poster la réception et continuer le rangement » | Niveau opérationnel |
| R2 | « Améliorer la performance globale » | Citations KPI insuffisantes |
| R3 | « Réduire le stock de 50 % immédiatement » | Mono-KPI incohérent |

### 10. Erreurs fréquentes

| Erreur | Conséquence |
|--------|-------------|
| Décision avant M5_KPI | API bloquée — pas de snapshot |
| Texte générique sans chiffres KPI | Rejet HTTP 400 |
| Réponse opérationnelle (MIGO, LT01…) | Rejet STRATEGIC |
| Coller Annexe A (48 000 $) | KPI rejeté · citations incohérentes |
| Oublier arbitrage / horizon 90–180 j | Rejet ou score réduit |
| Soumettre conformité avant décision acceptée | COMPLIANCE_M5_FAILED |

### 11. Notes professorales

- Prompt : *« Vous êtes Directeur Logistique au comité — quelle recommandation et sur quels chiffres ? »*
- Citer le **panneau snapshot**, pas Annexe A (48 000 $ vs 6 000 $ runtime).
- Run Report affiche M5_DECISION max **30** — moteur accorde jusqu'à **80** (total clampé 100).
- Prérequis Gold : SCN-015 + SCN-016 + SCN-017 + quiz M5 ≥ 60 %.
- Distinction claire : SCN-015/016 = **tactique** · SCN-017 = **stratégique**.

---

## Annexe — Parcours certification et progression

```
M4 : SCN-012 (rotation/capital) → SCN-013 (service/erreurs) → SCN-014 (S&OP capstone)
M5 : SCN-015 (nominal J1) → SCN-016 (variance J2) → SCN-017 (stratégique J3)
Gold : SCN-006…016 + SCN-017 capstone + quiz M5 + conformité modules
```

| Scénario | Module | Seuil | Score parfait | Gold key |
|----------|--------|-------|---------------|----------|
| SCN-012 | M4 | 70 | 75 | SCN012 |
| SCN-013 | M4 | 70 | 75 | SCN013 |
| SCN-014 | M4 | 70 | 75 | SCN014 |
| SCN-015 | M5 | 70 | 100 | SCN015 |
| SCN-016 | M5 | 70 | 100 | SCN016 |
| SCN-017 | M5 | 70 | 100 | SCN017 |

---

## Index des sources

| Document | Rôle |
|----------|------|
| `SCN013_CANONICAL_RESPONSES.md` | Réponses canoniques SCN-013 |
| `SCN014_CANONICAL_RESPONSES.md` | Réponses canoniques SCN-014 |
| `SCN015_CANONICAL_RESPONSES.md` | Réponses canoniques SCN-015 |
| `SCN016_CANONICAL_RESPONSES.md` | Réponses canoniques SCN-016 |
| `SCN017_CANONICAL_RESPONSES.md` | Réponses canoniques SCN-017 |
| `server/missionDataExtended.ts` | Fiches mission (SCN-012 inline) |
| Annexe A Guide Maître | Bandes KPI et notes instructeur M4 |

---

*TEC.WMS — Guide officiel étudiant M4-M5 · Distribution autorisée · 2026-06-18*
