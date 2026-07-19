# Guide étudiant — Préparation à la certification Modules 4 et 5

**Programme :** TEC.LOG — Simulation WMS intégrée  
**Public :** étudiants en préparation à l'évaluation  
**Scénarios couverts :** SCN-012 à SCN-017  
**Seuil de réussite :** 70 / 100 par scénario  
**Version :** juin 2026

---

## Présentation du guide

Ce document consolide l'essentiel pour préparer les **Modules 4 et 5** de la simulation WMS. Il vous aide à **comprendre, observer et rédiger** — pas à mémoriser des réponses toutes faites.

| Ce guide vous apporte | Ce guide ne contient pas |
|-----------------------|--------------------------|
| Où regarder dans le simulateur | Des formulations exactes à recopier |
| Quels KPI lire et comment les classer | Des réponses modèles des correcteurs |
| Quels mots-clés renforcer votre analyse | La logique interne de correction automatique |
| Comment structurer votre raisonnement | Des listes de mots « magiques » sans contexte |

**Ordre recommandé :** SCN-012 → 013 → 014 (Module 4), puis SCN-015 → 016 → 017 (Module 5 Peak Week).

**Question réflexive avant chaque soumission :** *« Qu'est-ce que ce chiffre me dit ? Quelle action professionnelle cohérente en découle — et ai-je nommé les preuves, les compromis et l'horizon attendus pour ce scénario ? »*

---

## Référence commune — Bandes KPI (Annexe A)

À connaître pour **interpréter**, pas pour recopier des chiffres au hasard :

| Indicateur | Formule / base | Bande normale ou excellente | Signal d'alerte |
|------------|----------------|------------------------------|-----------------|
| **Rotation** | Consommation ÷ stock moyen | **4 à 12×/an = normal** | < 4× : risque de surstock · > 12× : risque de stock trop serré |
| **Service (OTIF)** | Commandes honorées ÷ total | **≥ 95 % = excellent** | < 85 % insuffisant |
| **Erreurs** | Erreurs ÷ opérations | **1 à 5 % = acceptable** | > 5 % critique |
| **Délai (lead time)** | Délai moyen fournisseur | **3 à 7 j = normal** | Contexte supply chain |

**Module 4** — données portefeuille partagé (rotation 6×, OTIF 95 %, erreurs 4 %, délai 3,5 j, capital 48 000 $). Le moniteur de transactions reste **vide** : c'est normal.  
**Module 5** — vos KPI viennent du **moniteur après vos opérations** (échelle SKU, pas le portefeuille entier).

**Contrat ops M5 (fiche mission) :** SKU-001 · quai REC-01 · emplacement B-01-R1-L1 · lot LOT-M5-A · bon PO-M5-001 · min 10 · max 100.

---

## Deux paradigmes à distinguer

| | **Module 4 — Analytique** | **Module 5 — Peak Week** |
|---|---------------------------|--------------------------|
| **Activité** | Interpréter des KPI portefeuille | Exécuter un cycle entrepôt, puis décider |
| **Moniteur** | Vide — comportement attendu | Transactions GR → PUTAWAY → CC → [ADJ] → REPLENISH |
| **Source KPI** | Tour de contrôle KPI + Annexe A | Moniteur / snapshot de **votre run** |
| **Parcours** | Briefing → Rotation → Service → Diagnostic → Conformité | Réception → Rangement → Comptage → [Ajustement] → Réappro → KPI → Décision → Conformité |
| **Niveau décision** | Politique / arbitrage (M4) | Tactique (SCN-015/016) ou stratégique (SCN-017) |

---

# MODULE 4 — Tour de contrôle KPI

> Vous **analysez** des indicateurs. Aucune réception, rangement ou comptage n'est attendu. La preuve est dans le **tour de contrôle KPI** et l'**Annexe A**.

---

## SCN-012 — Rotation et capital immobilisé

**Rôle simulé :** Analyste logistique — revue CFO du capital circulant (Q3)  
**Enjeu :** Les 48 000 $ immobilisés sont-ils justifiés à 6× de rotation ?  
**Piège pédagogique :** la **complaisance** à une rotation « normale » sans politique claire.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | Question du comité finance sur le capital circulant |
| Tour de contrôle KPI | Rotation au centre ; capital immobilisé en contexte CFO |
| Bannière pédagogique | « Aucune transaction attendue — utilisez les indicateurs KPI » |
| Annexe A | Bandes 4–12× pour classer la rotation |
| Étape KPI_DATA | Consommation, stock moyen, OTIF et erreurs en contexte |

### KPI à lire

| KPI | Priorité | Lecture attendue |
|-----|----------|------------------|
| **Rotation (6×)** | Primaire | Formule consommation ÷ stock moyen → classer dans la bande |
| **Capital immobilisé (48 000 $)** | Primaire | Relier au niveau de rotation — pression légitime du CFO |
| OTIF 95 % | Secondaire | Excellent — contexte favorable, pas levier principal |
| Erreurs 4 % | Secondaire | Acceptables — contexte seulement |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| Rotation | `normale`, `équilibrée`, `bande 4–12`, `6×`, `formule`, `consommation`, `stock moyen`, `capital immobilisé`, `48 000 $`, `cohérent` | Étape rotation : formule + classification |
| Service | `excellent`, `optimal`, `seuil`, `95 %`, `OTIF`, `contexte` | Étape service : reconnaître l'excellence, contextualiser |
| Diagnostic | `recommande`, `décision`, `politique`, `maintenir`, `surveillance`, `SKU`, `revue`, `mensuelle` ou `trimestrielle` | Diagnostic : politique actionnable |

**Mots à éviter :** `surstock`, `sur-stock`, `excès de stock`, `destock global`, `liquidation`, `rien à faire`, `formation picking`, `SLA`, `J-90`, vocabulaire transaction WMS (`MIGO`, `LT01`).

### Structure de réponse par étape

1. **Données KPI** — Confirmer le mode analytique ; énumérer les indicateurs repérés ; cadrer l'enjeu capital / politique stock.
2. **Rotation** — Citer la formule → présenter le résultat → classer **normale** → relier au capital immobilisé.
3. **Service** — Calculer ou citer l'OTIF → classer **excellent** → mentionner brièvement les erreurs en contexte.
4. **Diagnostic** — Constat (rotation + capital + service) → interprétation pour le CFO → **recommandation** (maintien + surveillance SKU ciblée) → plan mesurable (revue périodique).

### Erreurs fréquentes

- Classer 6× comme **surstock** (confusion avec la bande < 4×).
- Utiliser le mot « surstock » même pour dire « pas de surstock ».
- Conclure « tout va bien, rien à faire » sans politique ni plan de suivi.
- Recommander un **destock global** incohérent avec rotation normale et service excellent.
- Appliquer la logique SCN-013 (qualité d'exécution) alors que l'enjeu est le **capital**.
- Tenter des transactions WMS (habitude Modules 1–3).

### Pièges pédagogiques

- **Complaisance :** une rotation normale ne signifie pas « aucune action » — le CFO attend une recommandation.
- **Mauvais scénario :** ne pas traiter les erreurs comme levier principal ici.
- **Contradiction interne :** une rotation classée normale ne peut pas motiver un vocabulaire de crise surstock.

---

## SCN-013 — Service, erreurs et renouvellement SLA (J-90)

**Rôle simulé :** Responsable performance — contrat SLA à renouveler dans 90 jours  
**Enjeu :** Analyser le **piège du tableau vert** : tout semble bon, mais les erreurs menacent l'OTIF.  
**Piège pédagogique :** l'**OTIF excellent masque une fragilité d'exécution** corrigeable.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | Horizon J-90 ; enjeu renouvellement contrat |
| Tour de contrôle KPI | OTIF **et** taux d'erreur affichés ensemble |
| Alerte OIL | Formulation « piège tableau vert » |
| Étape KPI_SERVICE | Deux indicateurs en tension : service headline vs erreurs |

### KPI à lire

| KPI | Priorité | Lecture attendue |
|-----|----------|------------------|
| **OTIF (95 %)** | Primaire | Excellent au seuil — **à reconnaître**, pas à minimiser |
| **Erreurs (4 %)** | Primaire | Acceptables statistiquement, mais **corrigeables** — source de fragilité |
| Rotation 6× | Contexte | Normale — une ligne suffit |
| Délai 3,5 j | Contexte | Normal — supply chain |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| Données | `J-90`, `SLA`, `renouvellement`, `OTIF`, `erreurs`, `tableau vert` | Cadrage initial : dual KPI service + erreurs |
| Rotation | `normale`, `6×`, `contexte`, `portefeuille stable` | Rotation : classer, puis orienter vers l'exécution |
| Service | `excellent`, `95 %`, `OTIF`, `acceptable`, `4 %`, `erreurs`, `picking`, `prélèvement`, `réception`, `fragilité`, `dérive`, `J-90` | Service : analyse **duale** obligatoire |
| Diagnostic | `recommande`, `formation`, `qualité`, `checklist`, `cible`, `90 jours`, `hebdomadaire`, `suivi`, `budget` | Diagnostic : plan chiffré et mesurable |

**Mots à éviter :** `faible service`, `insuffisant`, `excellent` pour les erreurs à 4 %, `destock`, `surstock`, `capital` comme levier principal, `rien à faire`, `statu quo`.

### Structure de réponse par étape

1. **Données KPI** — Cadrer la revue SLA à 90 jours ; repérer OTIF **et** erreurs ; signaler le piège « tout vert ».
2. **Rotation** — Classer normale → indiquer que ce n'est **pas** le risque prioritaire → orienter vers service/erreurs.
3. **Service** — OTIF : calcul, classification excellente, reconnaissance explicite → Erreurs : classification acceptable, nuance « corrigeable » → Corrélation picking/réception → risque OTIF à J-90.
4. **Diagnostic** — Reconnaissance de l'excellence OTIF → Risque erreurs 4 % à horizon J-90 → Recommandation programme qualité/formation → Plan chiffré (cible %, échéance, rythme de revue) → Décision : financer qualité plutôt que destock.

### Erreurs fréquentes

- Qualifier 95 % de « faible » ou « acceptable » — mauvaise bande.
- Analyser l'OTIF **sans** traiter le taux d'erreur.
- Dire « tout va bien » sans plan — tombe dans la complaisance du piège vert.
- Proposer le **destock** comme levier principal — hors sujet.
- Plan sans **cible chiffrée**, sans **horizon 90 jours** ni **rythme de suivi**.
- Reprendre la logique capital/destock de SCN-012.

### Pièges pédagogiques

- **Tableau vert :** dashboard vert, exécution ambre — ne pas se laisser rassurer par l'OTIF seul.
- **Analyse incomplète :** l'étape service exige **deux** indicateurs, pas un seul.
- **Mauvais levier :** le renouvellement SLA se joue sur la **qualité d'exécution**, pas sur le stock.

---

## SCN-014 — Arbitrage S&OP multi-KPI (capstone M4)

**Rôle simulé :** Directeur des opérations — comité S&OP (budget pour **une seule** initiative)  
**Enjeu :** Arbitrer CFO (capital), Ventes (OTIF), Ops (erreurs) et supply (délai 3,5 j).  
**Piège pédagogique :** l'**optimisation mono-KPI** (une lentille au détriment des autres).

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | Conflit CFO / Ventes / Ops ; **une** initiative financée |
| Tour de contrôle KPI | Quatre lentilles : rotation, service, erreurs, **délai** |
| Compétences SCN-012 et 013 | Ce capstone **intègre** rotation/capital et piège tableau vert |
| Annexe A | Toutes les bandes disponibles pour arbitrer |

### KPI à lire — lentilles parties prenantes

| Lentille | KPI | Message pour l'arbitrage |
|----------|-----|--------------------------|
| **CFO** | Rotation 6× + capital 48 000 $ | Normal — pression cash, pas urgence surstock |
| **Ventes** | OTIF 95 % | Excellent — **à préserver** dans tout trade-off |
| **Ops** | Erreurs 4 % | Acceptables — fragilité cachée, levier qualité naturel |
| **Supply** | Délai 3,5 j | Normal — **doit figurer** dans la synthèse intégrée |

### Mots-clés — où et comment les utiliser

| Domaine | Mots à privilégier | Où les placer |
|---------|-------------------|---------------|
| Cadrage | `S&OP`, `arbitrage`, `initiative`, `trade-off`, `CFO`, `ventes`, `ops` | Données et rotation : ouvrir l'arbitrage |
| Rotation | `normale`, `6×`, `capital`, `48 000 $`, `contexte CFO` | Lentille finance — input, pas décision isolée |
| Service | `excellent`, `95 %`, `erreurs`, `4 %`, `qualité`, `exécution`, `préserver` | Lentille ventes + ops — tension explicite |
| Diagnostic | `délai`, `3,5 j`, `lead time`, `trade-off`, `reporte`, `maintien`, `priorité`, `sacrifice`, `90 jours`, `initiative` | Synthèse board : ≥ 3 domaines KPI, idéal 4 |

**Mots à éviter :** `surstock` à 6×, diagnostic mono-KPI, omission du délai, liste de souhaits sans **une** initiative clairement financée.

### Structure de réponse par étape

1. **Données KPI** — Cadrer la réunion S&OP et la contrainte budget unique ; lister les **quatre** lentilles KPI.
2. **Rotation** — Classer normale + relier au capital → indiquer que toute action stock s'intègre à l'arbitrage global.
3. **Service** — OTIF excellent (enjeu ventes) + erreurs acceptables (enjeu ops) → tension : maintenir le service tout en corrigeant l'exécution.
4. **Diagnostic (paragraphe board)** — Contexte S&OP → Panorama ≥ 3 domaines KPI (idéal : les 4, **délai inclus**) → **Une** initiative prioritaire justifiée → **Trade-off explicite** (ce qui est reporté ou maintenu) → Horizon 90 jours + KPI de suivi nommés.

### Erreurs fréquentes

- Décision basée sur **un seul** KPI.
- Oublier le **délai 3,5 j** dans la synthèse.
- Liste de souhaits sans initiative clairement financée.
- Reprendre SCN-012 ou SCN-013 **isolément** sans intégration S&OP.
- Trade-off **implicite** seulement — formulez clairement ce que vous maintenez vs ce que vous reportez.

### Pièges pédagogiques

- **Délai invisible :** souvent oublié si vous vous arrêtez aux trois KPI « habituels ».
- **Capstone ≠ scénario isolé :** intégrez rotation/capital (012) **et** piège vert (013).
- **Triangle d'arbitrage :** cash (rotation/capital) · service (OTIF) · exécution (erreurs) · supply (délai).

---

# MODULE 5 — Peak Week (simulation intégrée)

> Vous **exécutez** un cycle entrepôt, puis **dérivez** vos KPI du moniteur. Ne recopiez pas les chiffres du portefeuille Module 4.

**Chaîne ops :** Réception → Rangement → Comptage → [Ajustement SCN-016] → Réappro → KPI → Décision → Conformité

---

## SCN-015 — Cycle opérationnel nominal (Peak Week Jour 1)

**Rôle simulé :** Gestionnaire logistique — cycle sans anomalie (7 étapes)  
**Enjeu :** Prouver que les KPI viennent de l'exécution ; décision **tactique** post-cycle.  
**Piège pédagogique :** confondre les **cibles d'affichage** (contexte M4) et les **valeurs à soumettre** (ledger).

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | 7 étapes listées ; contrat SKU / quantité / PO / bin |
| Stock initial | **Vide** — normal ; première preuve après réception |
| Moniteur | Transactions GR → PUTAWAY → CC → REPLENISH s'enchaînent |
| Tour de contrôle M5 | Cibles de **contexte** ≠ valeurs à **soumettre** |
| Étape M5_KPI | Bloc d'ancrage ledger + confirmation depuis moniteur |
| Cockpit | Ordre strict des étapes |

### KPI à lire

| Moment | Source | Ce qu'il faut comprendre |
|--------|--------|--------------------------|
| Avant ops | Tour de contrôle (cibles) | Références pédagogiques — **pas** vos chiffres finaux |
| Après ops | Moniteur / ledger | Stock réel, consommation dérivée, valeur stock **à votre échelle SKU** |
| Snapshot | Étape M5_KPI | Rotation, service, erreurs calculés **depuis votre run** |
| Réappro | Stock vs min/max | Si stock ≥ min → pas de commande (Q = 0) |

### Mots-clés — où et comment les utiliser

| Étape ops | Mots à privilégier | Où les placer |
|-----------|-------------------|---------------|
| Réception | Valeurs **fiche mission** (SKU, PO, quantité), `réception`, `GR`, `contrat` | Saisie conforme au contrat |
| Rangement | `REC-01`, `B-01-R1-L1`, `LOT-M5-A`, `FIFO`, `traçabilité` | Putaway source → destination |
| Comptage | `système`, `physique`, `variance`, `0`, `cohérence`, `MI04` | Nominal : variance nulle |
| Réappro | `Q = 0`, `stock suffisant`, `minimum`, `pas de commande` | Comparer stock actuel au min |
| KPI | `moniteur`, `ledger`, `dérivé`, `snapshot`, chiffres **de votre run** | Lire le panel, confirmer l'ancrage |
| Décision | `rotation`, `service`, `erreur`, `stock`, `formation`, `procédure`, `améliorer`, `recommande` | Synthèse KPI + action tactique |

**Mots à éviter :** valeurs portefeuille M4 (`400`, `48 000 $`), structure board longue (réservée SCN-017), `destock global`, `surstock` à 6×.

### Structure de réponse

**Ops (étapes 1 à 4) :** exécuter le cycle complet dans l'ordre — réception conforme au contrat → rangement avec bin et lot corrects → comptage avec variance nulle → réappro avec Q = 0 si stock ≥ min.

**Snapshot KPI :** lire chaque champ depuis le moniteur → saisir les valeurs dérivées → confirmer l'ancrage → classer rotation / service / erreurs dans les bandes M4.

**Décision tactique :**
1. Synthèse KPI snapshot (rotation, service, erreurs — bandes).
2. Constat ops : réappro nécessaire ou non.
3. Action immédiate : ex. formation picking / revue procédure réception.

### Erreurs fréquentes

- Mauvais SKU, quantité, PO ou bin.
- **Sauter** une étape — snapshot faussé ou progression bloquée.
- Coller les valeurs **Annexe A / portefeuille M4** dans M5_KPI.
- Oublier la **confirmation** d'ancrage au moniteur.
- Commander un réappro alors que le stock est **au-dessus du minimum**.
- Rédiger une **décision stratégique** longue (réservée à SCN-017).

### Pièges pédagogiques

- **Échelle SKU vs portefeuille :** votre run porte sur ~50 unités, pas 400 — ne copiez pas les chiffres M4.
- **Réflexe réappro :** stock suffisant → Q = 0, pas de commande par habitude.
- **Niveau décision :** tactique et concise — pas d'essai stratégique board.

---

## SCN-016 — Écart inventaire et correction (Peak Week Jour 2)

**Rôle simulé :** Gestionnaire d'entrepôt — exception variance (8 étapes)  
**Enjeu :** Gérer un écart au comptage et **corriger avant** réappro, KPI et décision.  
**Règle d'or :** **Réconcilier d'abord, décider ensuite.**  
**Piège pédagogique :** piloter (réappro, KPI, décision) sur un stock système non réconcilié.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | Variance attendue au comptage ; ADJ requis avant la suite |
| Comptage (M5_CYCLE_COUNT) | Écart entre stock **système** et **physique** |
| Étape M5_ADJ (MI07) | Injectée dynamiquement — **8 étapes** au lieu de 7 |
| Signal OIL | Alerte variance ; KPI bloqué tant que l'écart est ouvert |
| Justification ADJ | Champ texte — expliquer la réconciliation |

### KPI à lire

| Phase | Focus |
|-------|-------|
| Au comptage | Système vs physique → **delta** (écart signé) |
| Post-ADJ | Stock corrigé — base fiable pour réappro et snapshot |
| Snapshot M5_KPI | Valeurs **après correction** |
| Réappro | Utiliser le stock **post-correction**, pas le stock pré-écart |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| Comptage | `variance`, `écart`, `système`, `physique`, `MI04`, `investigation` | Calculer et **signer** l'écart |
| Ajustement | `MI07`, `ajustement`, `réconciliation`, `justification`, `stock corrigé`, `ADJ` | Poster correction + justification métier |
| Réappro | `post-correction`, `Q = 0`, `stock suffisant`, `minimum` | Base = stock réconcilié |
| KPI | `post-ADJ`, `ledger corrigé`, `snapshot`, `réconcilié` | Snapshot après correction uniquement |
| Décision | `variance`, `écart`, `correction`, `fiabilité inventaire`, `comptage`, `formation`, `service` | Mentionner la résolution de l'exception |

**Mots à éviter :** `variance 0` (incohérent J2), mauvais signe sur l'ajustement, stock pré-écart pour le réappro, valeurs portefeuille M4.

### Structure de réponse

**Ops :** flux nominal amont (réception + rangement) → détecter l'écart au comptage → poster l'ajustement MI07 avec justification → reprendre réappro → KPI → décision sur stock corrigé.

**Décision tactique :**
1. Confirmer écart résolu par ajustement.
2. Synthèse KPI snapshot **corrigé** (bandes).
3. Pas de réappro si stock ≥ min (Q = 0).
4. Action : revue procédure comptage / formation pour éviter récurrence.

### Erreurs fréquentes

- Passer à réappro, KPI ou décision **sans** ADJ.
- Saisir un écart non conforme à la situation injectée.
- Mauvais **signe** sur l'ajustement.
- Réappro basé sur le stock **pré-correction**.
- ADJ sans **justification** suffisamment explicite.
- Traiter comme SCN-015 (7 étapes) et oublier M5_ADJ.

### Pièges pédagogiques

- **Écart non corrigé → KPI non fiables :** piloter sur un stock faux mène à de mauvaises commandes et recommandations.
- **L'écart n'apparaît qu'au comptage** — pas avant.
- **8 étapes, pas 7 :** M5_ADJ est obligatoire en Jour 2.

---

## SCN-017 — Décision stratégique capstone (Peak Week Jour 3)

**Rôle simulé :** Directeur logistique — recommandation au comité  
**Enjeu :** Formuler une **décision stratégique** de niveau direction avec preuves chiffrées.  
**Niveau décision :** **Stratégique** (politique, investissement, organisation — pas opérationnel).  
**Piège pédagogique :** réponse tactique courte ou générique sans preuves du snapshot.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | 3 phases : ops → KPI → décision stratégique |
| Cycle ops | Identique au nominal (7 étapes, pas de variance) |
| Étape M5_KPI | Snapshot **verrouillé** — panel avec valeurs dérivées |
| Étape M5_DECISION | Guide structurel : preuves, arbitrage, horizon |
| OIL Panel B | Rappel : ≥ 2 KPI chiffrés, trade-off, horizon 90–180 j |

### KPI à lire

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

### Mots-clés — où et comment les utiliser

| Exigence | Mots à privilégier | Où les placer |
|----------|-------------------|---------------|
| Preuves KPI (≥ 2 chiffrées) | Valeurs du **panneau snapshot** : rotation, OTIF, erreurs, délai, valeur stock | Section Preuve — citer et classer |
| Arbitrage | `arbitrage`, `trade-off`, `compromis`, `entre … et …`, `sacrifice` | Section Arbitrage — tension explicite |
| Recommandation | `recommandation`, `décision`, `plan`, `initiative`, `politique` | Section Recommandation — initiative claire |
| Horizon | `90 jours`, `180 jours`, `3 mois`, `6 mois`, `trimestre` | Section Horizon — plan mesurable |
| Selon orientation | `formation`, `working capital`, `capacité`, `résilience`, `lead time` | Adapter au choix stratégique |

**Mots à éviter :** actions ops pures (« poster la réception », « continuer le rangement »), texte vague sans chiffres, portefeuille M4 (`48 000 $`, stock 400 u.), décision tactique courte type SCN-015.

### Structure de réponse (décision stratégique)

1. **Situation** — Cycle ops complété ; performance globale post-Peak Week.
2. **Preuve** — Citer **au moins deux KPI chiffrés** du snapshot (avec bandes).
3. **Arbitrage** — Tension explicite entre options (ex. qualité vs capital vs service vs capacité).
4. **Recommandation** — Initiative claire + objectifs mesurables.
5. **Horizon** — Plan 90 à 180 jours + KPI de suivi nommés.

### Erreurs fréquentes

- Décision **tactique courte** (style SCN-015) — insuffisante pour le capstone.
- Texte **générique** sans chiffres issus du snapshot.
- **Une seule** preuve KPI — la synthèse exige au moins deux citations chiffrées cohérentes.
- Recommandation **sans arbitrage** — pas de tension nommée entre options.
- Plan **sans horizon** 90 à 180 jours.
- Copier les chiffres **portefeuille M4** si le snapshot indique votre échelle SKU.
- Réponse **purement opérationnelle** — continuer les transactions au lieu de recommander une politique.

### Pièges pédagogiques

- **Preuves obligatoires :** la décision board s'appuie sur **votre** snapshot, pas sur des généralités.
- **Niveau direction :** politique et investissement — pas transaction WMS.
- **Continuité M4 → M5 :** mêmes bandes KPI, échelle opérationnelle différente.
- **Arbitrage implicite insuffisant :** formulez la tension entre au moins deux dimensions.

---

## Tableau récapitulatif — Classification KPI

| Indicateur | Valeur de référence | Bande / statut | Mots de classification |
|------------|---------------------|----------------|------------------------|
| Rotation | **6×** | Normale (4–12×) | `normale`, `équilibrée` |
| Service OTIF | **95 %** | Excellent (≥ 95 %) | `excellent`, `optimal` |
| Erreurs | **4 %** | Acceptable (1–5 %) | `acceptable`, `modéré` |
| Délai | **3,5 j** | Normal (3–7 j) | `délai`, `lead time`, `3,5 j` |

---

## Progression pédagogique

```text
MODULE 4 — Interpréter (moniteur vide = normal)
  SCN-012  Rotation + capital        → politique stock, pas destock global
  SCN-013  OTIF + erreurs J-90       → piège tableau vert, plan chiffré
  SCN-014  S&OP capstone             → arbitrage multi-KPI, délai obligatoire

MODULE 5 — Exécuter puis décider (KPI = votre ledger)
  SCN-015  Cycle nominal             → ops → KPI → décision tactique
  SCN-016  Variance + ADJ            → corriger avant piloter → tactique
  SCN-017  Capstone stratégique      → preuves snapshot + arbitrage board
```

| Transition | Ce qui change |
|------------|---------------|
| M3 → M4 | Transactions → interprétation KPI ; pas de vocabulaire ops WMS |
| M4 → M5 | Portefeuille Annexe A → chiffres ledger de **votre** run |
| SCN-015 → SCN-017 | Décision tactique courte → décision stratégique structurée |
| SCN-012 + 013 → 014 | Compétences isolées → synthèse intégrée avec trade-off explicite |

**En résumé :** en Module 4 vous **interprétez** des KPI portefeuille ; en Module 5 vous **prouvez** vos KPI par l'exécution, puis vous **décidez** au bon niveau (tactique ou stratégique) avec les chiffres que vous avez produits.

---

## Conseils pour la conversion PDF

- Conserver la hiérarchie des titres pour la table des matières automatique.
- Imprimer en format A4, marges standard.
- Les tableaux et blocs de structure se lisent mieux en paysage si nécessaire pour les tableaux larges.

---

*TEC.LOG — Guide étudiant M4/M5 · Préparation certification · juin 2026 · Guidance pédagogique uniquement.*
