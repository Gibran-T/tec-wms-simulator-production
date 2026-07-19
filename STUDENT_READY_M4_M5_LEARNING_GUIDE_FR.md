# Guide d'apprentissage — Modules 4 et 5 (SCN-012 à SCN-017)

**Programme :** TEC.LOG — Simulation WMS intégrée  
**Public :** étudiants et enseignants  
**Version :** 2026-06-19  
**Source :** audit pédagogique question par question (Modules 4 et 5)

---

## Comment utiliser ce guide

Ce document vous aide à **apprendre à raisonner**, pas à mémoriser des réponses toutes faites.

| Ce guide vous apprend… | Ce guide ne contient pas… |
|------------------------|---------------------------|
| Quoi observer dans le simulateur | Les formulations exactes à recopier |
| Quels KPI lire et comment les classer | La logique interne de correction automatique |
| Quelles relations établir entre indicateurs | Des listes de mots-clés « magiques » |
| Comment structurer votre raisonnement | Les réponses canoniques des correcteurs |

**Seuil de réussite :** 70 / 100 par scénario.

**Ordre recommandé :** SCN-012 → 013 → 014 (Module 4), puis SCN-015 → 016 → 017 (Module 5 Peak Week).

---

## Référence commune — Bandes KPI (Annexe A)

À connaître pour **interpréter**, pas pour recopier des chiffres au hasard :

| Indicateur | Formule / base | Bande normale ou excellente | Signal d'alerte |
|------------|----------------|------------------------------|-----------------|
| **Rotation** | Consommation ÷ stock moyen | **4 à 12×/an = normal** | < 4× : risque de surstock · > 12× : risque de stock trop serré |
| **Service (OTIF)** | Commandes honorées ÷ total | **≥ 95 % = excellent** | < 85 % insuffisant |
| **Erreurs** | Erreurs ÷ opérations | **1 à 5 % = acceptable** | > 5 % critique |
| **Délai (lead time)** | Délai moyen fournisseur | **3 à 7 j = normal** | Contexte supply chain |

**Module 4** — bundle portefeuille partagé (rotation 6×, OTIF 95 %, erreurs 4 %, délai 3,5 j, capital 48 000 $).  
**Module 5** — vos KPI viennent du **moniteur après vos opérations** (échelle SKU, pas le portefeuille entier).

---

# MODULE 4 — Tour de contrôle KPI (analytique)

> **Paradigme M4 :** vous **analysez** des indicateurs. Le moniteur de transactions reste **vide** — c'est normal. Aucune réception, rangement ou comptage n'est attendu. La preuve est dans le **tour de contrôle KPI** et l'**Annexe A**.

**Parcours commun :** Briefing → Rotation → Service → Diagnostic → Conformité M4.

---

## SCN-012 — Rotation et capital immobilisé

**Rôle simulé :** Analyste logistique — revue CFO du capital circulant (Q3)  
**Compétence :** Analyser (Bloom) — jugement politique stock vs pression finance  
**Piège pédagogique central :** la **complaisance** à rotation « normale »

### Ce qu'il faut observer

| Zone | Élément à repérer |
|------|-------------------|
| Fiche Mission | Question du comité finance : les 48 000 $ immobilisés sont-ils justifiés ? |
| Tour de contrôle KPI | Rotation au centre ; capital immobilisé affiché comme contexte CFO |
| Bannière pédagogique | « Aucune transaction attendue — utilisez les indicateurs KPI » |
| Annexe A | Bandes 4–12× pour classer la rotation |
| Étape KPI_DATA | Consommation, stock moyen, OTIF et erreurs en contexte |

### Quels KPI lire

| KPI | Lecture attendue | Priorité dans ce SCN |
|-----|------------------|----------------------|
| **Rotation (6×)** | Calculer consommation ÷ stock ; classer dans la bande | **Primaire** |
| **Capital immobilisé (48 000 $)** | Relier au niveau de rotation — pression légitime du CFO | **Primaire** |
| OTIF 95 % | Excellent — contexte favorable, pas levier principal | Secondaire |
| Erreurs 4 % | Acceptables — contexte seulement | Secondaire |

### Relations à identifier

1. **Rotation ↔ bande industrielle** — 6× n'est ni surstock ni rupture systémique ; c'est une zone **équilibrée**.
2. **Rotation ↔ capital** — un capital élevé peut être **cohérent** avec une rotation normale ; la question n'est pas « tout liquider » mais « quelle politique ? ».
3. **Service excellent ↔ prudence destock** — un OTIF au seuil ne justifie pas une chasse au stock agressive.

### Raisonnement à mobiliser

```
Question CFO (capital justifié ?)
  → Calculer et classer la rotation (formule + bande Annexe A)
  → Conclure sur la politique stock (maintien, ajustement ciblé ou surveillance)
  → Proposer un plan concret (pas l'inaction, pas le destock global)
```

**Question clé à se poser :** *« Qu'est-ce que ce KPI me dit sur le capital immobilisé — faut-il alarmer ou nuancer ? »*

### Erreurs fréquentes

- Classer 6× comme **surstock** (confusion avec la bande < 4×).
- Conclure « tout va bien, rien à faire » sans **politique** ni plan de suivi.
- Recommander un **destock global** incohérent avec une rotation normale et un service excellent.
- Appliquer le raisonnement SCN-013 (qualité d'exécution) alors que l'enjeu ici est le **capital**.

### Pièges de validation (soumission)

- Réponse rotation qui **contredit** la bande normale (vocabulaire de crise surstock à 6×).
- Diagnostic trop **passif** — le CFO attend une recommandation actionnable, pas une absence de décision.
- Diagnostic **trop court** ou sans lien explicite entre rotation, capital et politique proposée.
- Ignorer le **moniteur vide** et tenter des transactions WMS (habitude M1–M3).

---

## SCN-013 — Service, erreurs et renouvellement SLA (J-90)

**Rôle simulé :** Responsable performance — contrat SLA à renouveler dans 90 jours  
**Compétence :** Évaluer (Bloom) — fragilité cachée derrière un tableau « vert »  
**Piège pédagogique central :** le **tableau vert** (OTIF excellent masque un risque d'exécution)

### Ce qu'il faut observer

| Zone | Élément à repérer |
|------|-------------------|
| Fiche Mission | Horizon J-90 ; enjeu renouvellement contrat |
| Tour de contrôle KPI | OTIF au seuil **et** taux d'erreur affichés ensemble |
| OIL / alerte | Formulation « piège tableau vert » |
| Étape KPI_SERVICE | Deux indicateurs en tension : service headline vs erreurs |
| Contexte J-90 | L'analyse porte sur la **durabilité**, pas seulement l'instant présent |

### Quels KPI lire

| KPI | Lecture attendue | Priorité dans ce SCN |
|-----|------------------|----------------------|
| **OTIF (95 %)** | Excellent au seuil — **à reconnaître**, pas à minimiser | **Primaire** |
| **Erreurs (4 %)** | Acceptables statistiquement, mais **corrigeables** — source de fragilité | **Primaire** |
| Rotation 6× | Normale — contexte portefeuille, pas angle principal | Contexte |
| Délai 3,5 j | Normal — contexte supply | Contexte |

### Relations à identifier

1. **Excellence OTIF ↔ risque futur** — 95 % aujourd'hui ne garantit pas 95 % à J-90 si les erreurs persistent.
2. **Erreurs ↔ processus** — picking et réception sont les processus typiques qui **fragilisent** l'OTIF.
3. **Qualité d'exécution ↔ levier prioritaire** — le dashboard vert oriente vers la **formation / contrôle qualité**, pas vers le stock.
4. **Image utile :** dashboard **vert**, exécution **ambre**.

### Raisonnement à mobiliser

```
Tableau vert (95 % + 4 %)
  → Reconnaître l'excellence actuelle du service (ne pas la nier)
  → Analyser les erreurs comme menace corrigeable à horizon J-90
  → Proposer un plan d'exécution chiffré (cible, horizon, fréquence de suivi)
  → Choisir le bon levier (qualité ops, pas destock)
```

**Question clé :** *« Le dashboard est vert — est-ce suffisant pour signer le contrat dans 90 jours sans plan ? »*

### Erreurs fréquentes

- Qualifier 95 % de « faible » ou « acceptable » — mauvaise bande.
- Dire « tout va bien » sans plan — tombe dans la **complaisance** du piège vert.
- Analyser l'OTIF **sans** traiter le taux d'erreur (analyse incomplète).
- Proposer le **destock** comme levier principal — hors sujet pour ce scénario.
- Plan sans **cible chiffrée**, sans **horizon 90 jours** ni **rythme de suivi**.

### Pièges de validation (soumission)

- Étape service limitée à l'OTIF seul : pensez aussi au **taux d'erreur** avant le diagnostic (le pipeline partagé ne le rappelle pas toujours).
- Diagnostic qui contredit l'excellence reconnue à 95 %.
- Recommandation **non mesurable** — le renouvellement SLA exige un plan traçable.
- Réutiliser la logique capital/destock de SCN-012.

---

## SCN-014 — Arbitrage S&OP multi-KPI (capstone M4)

**Rôle simulé :** Directeur des opérations — comité S&OP (budget pour **une seule** initiative)  
**Compétence :** Évaluer / Créer (Bloom) — synthèse exécutive multi-parties prenantes  
**Piège pédagogique central :** l'**optimisation mono-KPI** (une lentille au détriment des autres)

### Ce qu'il faut observer

| Zone | Élément à repérer |
|------|-------------------|
| Fiche Mission | Conflit CFO / Ventes / Ops ; **une** initiative financée |
| Tour de contrôle KPI | Quatre lentilles visibles : rotation, service, erreurs, **délai** |
| Compétences SCN-012 et 013 | Ce capstone **intègre** rotation/capital et piège tableau vert |
| Étape diagnostic | Attendu : paragraphe de synthèse « board », pas une phrase |
| Annexe A | Toutes les bandes disponibles pour arbitrer |

### Quels KPI lire

| Lentille | KPI | Message pour l'arbitrage |
|----------|-----|--------------------------|
| **CFO** | Rotation 6× + capital 48 000 $ | Normal — pression cash, pas urgence surstock |
| **Ventes** | OTIF 95 % | Excellent — **à préserver** dans tout trade-off |
| **Ops** | Erreurs 4 % | Acceptables — fragilité cachée, levier qualité naturel |
| **Supply** | Délai 3,5 j | Normal — **doit figurer** dans la synthèse intégrée |

### Relations à identifier

1. **Tension CFO ↔ Ventes** — libérer du cash vs maintenir le service client.
2. **Tension Ops ↔ Ventes** — réduire les erreurs vs préserver l'OTIF au seuil.
3. **Trade-off explicite** — toute initiative financée implique ce qu'on **reporte** ou **sacrifie**.
4. **Horizon 90 jours** — l'arbitrage doit être **suivi** par des KPI nommés.

**Triangle d'arbitrage :** cash (rotation/capital) · service (OTIF) · exécution (erreurs) · supply (délai).

### Raisonnement à mobiliser

```
Réunion S&OP — budget unique
  → Synthétiser ≥ 3 domaines KPI (idéal : les 4)
  → Choisir UNE initiative prioritaire avec justification intégrée
  → Nommer explicitement le trade-off (ce qui est différé ou maintenu)
  → Fixer horizon et KPI de suivi
```

**Question clé :** *« Si je n'ai budget que pour UNE action, laquelle maximise l'impact global — et qu'est-ce que je reporte ? »*

### Erreurs fréquentes

- Décision basée sur **un seul** KPI (rotation seule, service seul, etc.).
- Oublier le **délai 3,5 j** dans la synthèse (souvent sous-visible aux premières étapes).
- Liste de souhaits sans **une** initiative clairement financée.
- Paragraphe trop court pour une recommandation board crédible.
- Reprendre SCN-012 ou SCN-013 **isolément** sans intégration S&OP.

### Pièges de validation (soumission)

- Diagnostic **mono-domaine** — le capstone exige une vision **multi-indicateurs**.
- Trade-off **implicite** seulement — formulez clairement ce que vous maintenez vs ce que vous reportez.
- Omission du délai — facile si vous vous arrêtez aux trois KPI « habituels ».
- Vocabulaire de crise surstock à rotation 6× — incohérent avec les bandes apprises en SCN-012.

---

# MODULE 5 — Peak Week (simulation intégrée)

> **Paradigme M5 :** vous **exécutez** un cycle entrepôt, puis vous **dérivez** vos KPI du moniteur. Ne recopiez pas les chiffres du portefeuille Module 4.

**Contrat ops commun :** SKU-001 · 50 u. · PO-M5-001 · LOT-M5-A · REC-01 → B-01-R1-L1 · min 10 · max 100

**Chaîne ops :** Réception → Rangement → Comptage → [Ajustement] → Réappro → KPI → Décision → Conformité M5

---

## SCN-015 — Cycle opérationnel nominal (Peak Week Jour 1)

**Rôle simulé :** Gestionnaire logistique — cycle sans anomalie (7 étapes)  
**Compétence :** Évaluer (Bloom) — prouver que les KPI viennent de l'exécution  
**Niveau décision :** **Tactique** (post-cycle immédiat, pas stratégique board)

### Ce qu'il faut observer

| Zone | Élément à repérer |
|------|-------------------|
| Fiche Mission | 7 étapes listées ; contrat SKU/qté/PO/bin |
| Stock initial | **Vide** — normal ; première preuve après réception |
| Moniteur | Transactions GR → PUTAWAY → CC → REPLENISH s'enchaînent |
| Tour de contrôle M5 | Cibles de **contexte** (portefeuille) ≠ valeurs à **soumettre** |
| Étape M5_KPI | Bloc d'ancrage ledger + confirmation depuis moniteur |
| Cockpit | « Prochaine action requise » — ordre strict des étapes |

### Quels KPI lire

| Moment | Source | Ce qu'il faut comprendre |
|--------|--------|--------------------------|
| Avant ops | Tour de contrôle (cibles) | Références pédagogiques — **pas** vos chiffres finaux |
| Après ops | Moniteur / ledger | Stock réel au bin, consommation dérivée, valeur stock **à votre échelle** |
| Snapshot | Étape M5_KPI | Rotation, service, erreurs calculés **depuis votre run** |
| Réappro | Stock vs min/max | Si stock ≥ min → pas de commande nécessaire |

### Relations à identifier

1. **Ops → preuve → KPI** — chaque transaction alimente la suivante ; sauter une étape fausse le snapshot.
2. **Stock vide initial → réception** — la chaîne causale commence au GR.
3. **Variance 0 au comptage** — confirme cohérence réception + rangement (chemin nominal).
4. **KPI ledger ↔ décision tactique** — la décision commente **votre** performance, pas une fiche théorique.
5. **Échelle SKU vs portefeuille M4** — 50 u. et ~6 000 $ de valeur stock, pas 400 u. / 48 000 $.

### Raisonnement à mobiliser

```
Cycle nominal complet (7 étapes ordonnées)
  → Confirmer cohérence ops (variance 0, bin correct, contrat respecté)
  → Dériver KPI depuis le moniteur (checkbox d'ancrage)
  → Décision tactique : que faire maintenant ? (réappro, formation, procédures)
```

**Question clé :** *« Mes chiffres KPI reflètent-ils ce que **j'ai fait** dans le simulateur ? »*

### Erreurs fréquentes

- Mauvais SKU, quantité, PO ou bin — rejet dur à la source.
- **Sauter** une étape (comptage, réappro) — snapshot faussé ou progression bloquée.
- Coller les valeurs **Annexe A / portefeuille M4** dans M5_KPI.
- Oublier la **confirmation** d'ancrage au moniteur.
- Commander un réappro alors que le stock est **au-dessus du minimum**.
- Rédiger une **décision stratégique** longue (réservée à SCN-017).

### Pièges de validation (soumission)

- Confusion entre **cibles d'affichage** (contexte) et **valeurs à soumettre** (ledger).
- Titre d'étape « décision stratégique » vs attente **tactique** — ne sur-investissez pas en prose board.
- Réappro avec Q ≠ 0 alors que le stock couvre le minimum — incohérence logique ops.
- Tentative de clôturer la conformité avec des étapes manquantes.

---

## SCN-016 — Écart inventaire et correction (Peak Week Jour 2)

**Rôle simulé :** Gestionnaire d'entrepôt — exception variance (8 étapes)  
**Compétence :** Évaluer (Bloom) — corriger avant de piloter  
**Règle d'or :** **Réconcilier d'abord, décider ensuite**

### Ce qu'il faut observer

| Zone | Élément à repérer |
|------|-------------------|
| Fiche Mission | Variance attendue au comptage ; ADJ requis avant la suite |
| Comptage (M5_CYCLE_COUNT) | Écart entre stock **système** et **physique** — moment diagnostic |
| Étape M5_ADJ (MI07) | Injectée dynamiquement — 8 étapes au lieu de 7 |
| Signal OIL | Alerte variance ; KPI bloqué tant que l'écart est ouvert |
| Moniteur | Mouvements avant et **après** l'ajustement inventaire |
| Justification ADJ | Champ texte — expliquer la réconciliation |

### Quels KPI lire

| Phase | Focus |
|-------|-------|
| Au comptage | Système vs physique → **delta** (écart signé) |
| Post-ADJ | Stock corrigé — base fiable pour réappro et snapshot |
| Snapshot M5_KPI | Valeurs **après correction** (stock moyen, consommation, valeur stock recalculés) |
| Réappro | Utiliser le stock **post-correction**, pas le stock pré-écart |
| Bandes rotation/service/erreurs | Restent stables — l'enjeu est la **fiabilité inventaire** |

### Relations à identifier

1. **Écart non corrigé → KPI non fiables** — piloter sur un stock faux mène à de mauvaises commandes et recommandations.
2. **Comptage → diagnostic → ADJ** — l'écart n'est observable qu'à l'étape comptage (pas avant).
3. **Correction → reprise du flux** — réappro, KPI et décision reprennent sur base réconciliée.
4. **Parallèle M3** — même discipline que SCN-010, intégrée au flux Peak Week.

### Raisonnement à mobiliser

```
Flux nominal amont (réception + rangement)
  → Détecter l'écart au comptage (système ≠ physique)
  → Poster l'ajustement MI07 avec justification métier
  → Reprendre réappro → KPI → décision sur stock corrigé
  → Décision tactique mentionnant la résolution de l'exception
```

**Question clé :** *« Puis-je piloter (réappro, KPI, décision) tant que le stock système ne reflète pas la réalité physique ? »*

### Erreurs fréquentes

- Passer à réappro, KPI ou décision **sans** ADJ — bloqué par le simulateur.
- Saisir un écart **non conforme** à la situation injectée (ignorer le −5).
- Mauvais **signe** sur l'ajustement (+ au lieu de −).
- Réappro basé sur le stock **pré-correction**.
- ADJ sans **justification** suffisamment explicite.
- Traiter comme SCN-015 (7 étapes) et oublier M5_ADJ.

### Pièges de validation (soumission)

- Tentative de clôturer avec **écart ouvert** — conformité impossible.
- Snapshot KPI **avant** correction — chiffres incohérents avec le ledger corrigé.
- Décision tactique qui **ignore** l'exception inventaire traitée.
- Coller encore les valeurs portefeuille M4 au lieu du ledger post-ADJ.

---

## SCN-017 — Décision stratégique capstone (Peak Week Jour 3)

**Rôle simulé :** Directeur logistique — recommandation au comité  
**Compétence :** Créer (Bloom) — synthèse exécutive avec preuves chiffrées  
**Niveau décision :** **Stratégique** (politique, investissement, organisation — pas opérationnel)

### Ce qu'il faut observer

| Zone | Élément à repérer |
|------|-------------------|
| Fiche Mission | 3 phases : ops → KPI → décision stratégique |
| Cycle ops | Identique au nominal (7 étapes, pas de variance) |
| Étape M5_KPI | Snapshot **verrouillé** — panel avec valeurs dérivées |
| Étape M5_DECISION | Guide structurel : preuves, arbitrage, horizon |
| OIL Panel B | Rappel ≥ 2 KPI chiffrés, trade-off, horizon 90–180 j |
| Feedback rejet | Messages séquentiels si la décision est incomplète |

### Quels KPI lire

| Source | Usage |
|--------|-------|
| Snapshot M5_KPI (votre run) | **Preuves chiffrées** à citer dans la décision |
| Rotation, service, erreurs, délai | Classer avec les bandes apprises en M4 |
| Valeur stock (snapshot) | Échelle **votre cycle** — pas le portefeuille 48 000 $ |

**Trois orientations stratégiques valides** (en choisir **une**, argumentée) :

| Orientation | Idée directrice |
|-------------|-----------------|
| **Qualité d'exécution** | Formation, checklists, réduction erreurs avec garde-fou service |
| **Working capital** | Optimiser stock cible ; arbitrage cash vs niveau de service |
| **Résilience capacité** | Investir capacité préparation ; délai et volume |

### Relations à identifier

1. **Preuves KPI → diagnostic** — la décision doit **s'appuyer** sur des chiffres de **votre** snapshot, pas sur des généralités.
2. **Multi-KPI → arbitrage** — toute recommandation stratégique implique un **compromis** explicite (qualité vs capital vs service vs capacité).
3. **Niveau stratégique vs ops** — « poster la réception » ou « continuer le rangement » ne sont **pas** des décisions board.
4. **Horizon 90–180 j** — une recommandation exécutive sans échéance mesurable est incomplète.
5. **Continuité M4 → M5** — mêmes bandes KPI, échelle opérationnelle différente.

### Raisonnement à mobiliser

```
Phase 1 — Ops : cycle complet pour alimenter le ledger
Phase 2 — KPI : ancrer et lire le snapshot panel
Phase 3 — Décision stratégique :
  Situation (contexte post-cycle)
  → Preuve (≥ 2 KPI chiffrés du snapshot)
  → Arbitrage (tension explicite entre options)
  → Recommandation (initiative claire)
  → Horizon + KPI de suivi
```

**Question clé :** *« Ma recommandation est-elle au niveau **direction** — avec preuves, compromis et plan mesurable ? »*

### Erreurs fréquentes

- Décision **tactique courte** (style SCN-015) — insuffisante pour le capstone.
- Texte **générique** sans chiffres issus du snapshot.
- **Une seule** preuve KPI — la synthèse exige au moins deux citations chiffrées cohérentes.
- Recommandation **sans arbitrage** — pas de tension nommée entre options.
- Plan **sans horizon** 90 à 180 jours.
- Copier les chiffres **portefeuille M4** (400 u., 48 000 $) si le snapshot indique votre échelle SKU.
- Réponse **purement opérationnelle** — continuer les transactions au lieu de recommander une politique.

### Pièges de validation (soumission)

- Soumettre M5_DECISION **avant** M5_KPI ou sans snapshot enregistré.
- Ignorer les **messages de feedback** en cas de rejet — lire et compléter séquentiellement.
- Citer des KPI **non présents** dans votre panel snapshot.
- Arbitrage implicite — formulez la tension entre au moins deux dimensions (ex. qualité et capital).
- Confondre l'**affichage contexte** du tour de contrôle avec les preuves à citer.

---

## Synthèse — Progression pédagogique

```text
MODULE 4 — Interpréter
  SCN-012  Rotation + capital        → jugement politique (complaisance)
  SCN-013  OTIF + erreurs J-90       → piège tableau vert
  SCN-014  S&OP capstone             → arbitrage multi-KPI

MODULE 5 — Exécuter puis décider
  SCN-015  Cycle nominal             → ops alimente KPI (tactique)
  SCN-016  Variance + ADJ            → corriger avant piloter (tactique)
  SCN-017  Capstone stratégique      → preuves snapshot + arbitrage board
```

| Transition | Ce qui change |
|--------------|---------------|
| M3 → M4 | Transactions → tour de contrôle KPI ; moniteur vide = normal |
| M4 → M5 | Analyse portefeuille → exécution SKU + KPI ledger |
| SCN-015 → 017 | Décision tactique → décision stratégique avec structure board |
| SCN-012+013 → 014 | Compétences isolées → synthèse intégrée S&OP |

---

## Notes pour l'enseignant

| SCN | Point de briefing recommandé | Verdict audit pédagogique |
|-----|------------------------------|---------------------------|
| SCN-012 | Moniteur vide M4 ; formule rotation ; bande 4–12× | Prêt pour eval standard |
| SCN-013 | Insister : classifier aussi les 4 % erreurs à l'étape service | Friction pipeline — brief ciblé |
| SCN-014 | Checklist multi-KPI + délai 3,5 j + trade-off explicite | Capstone — après 012+013 |
| SCN-015 | Distinction cibles affichage vs ledger ; niveau tactique | GO |
| SCN-016 | Règle « corriger avant piloter » ; 8 étapes | GO — meilleure chaîne exception |
| SCN-017 | Structure Situation → Preuve → Arbitrage → Recommandation → Horizon | Autonomie conditionnelle |

**En une phrase pour les étudiants :** en Module 4 vous **interprétez** des KPI portefeuille ; en Module 5 vous **prouvez** vos KPI par l'exécution, puis vous **décidez** au bon niveau (tactique ou stratégique) avec les chiffres que vous avez produits.

---

*Document étudiant et enseignant — juin 2026. Aligné sur les audits pédagogiques M4/M5 et le registre de feedback d'apprentissage. Aucune réponse canonique ni logique interne de validation exposée.*
