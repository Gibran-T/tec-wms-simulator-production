---
title: "TEC.WMS — Guide de Préparation Modules M4 et M5"
author: "Collège de la Concorde"
date: "juillet 2026"
lang: fr-CA
geometry: margin=2.5cm
toc: false
header-includes:
  - \usepackage{fancyhdr}
  - \usepackage{setspace}
  - \pagestyle{fancy}
  - \fancyhead[L]{\small TEC.WMS — Guide étudiant M4/M5}
  - \fancyhead[R]{\small Collège de la Concorde}
  - \fancyfoot[C]{\small Collège de la Concorde · Simulateur pédagogique ERP/WMS · juillet 2026}
  - \fancyfoot[R]{\small \thepage}
  - \renewcommand{\headrulewidth}{0.4pt}
  - \renewcommand{\footrulewidth}{0.4pt}
---

<style>
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
.doc-footer {
  margin-top: 2em;
  padding-top: 0.8em;
  border-top: 1px solid #ccc;
  font-size: 0.85em;
  color: #555;
  text-align: center;
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

# Guide de Préparation

# Modules M4 et M5

# Raisonnement KPI et décision professionnelle

</div>

<div class="subtitle-block">

**Collège de la Concorde**
Simulateur pédagogique ERP/WMS

</div>

<div class="meta">

Scénarios SCN-012 à SCN-017 · Seuil de réussite : 70 / 100
Version mise à jour — juillet 2026 · Document étudiant

</div>

</div>

<div class="page-break"></div>

\newpage

# Table des matières

1. [Présentation du guide](#présentation-du-guide)
2. [Référence commune — Bandes KPI](#référence-commune--bandes-kpi)
3. [Deux paradigmes à distinguer](#deux-paradigmes-à-distinguer)
4. [Module 4 — Tour de contrôle KPI](#module-4--tour-de-contrôle-kpi)
5. [Module 5 — Simulation intégrée](#module-5--simulation-intégrée)
6. [Tableau récapitulatif](#tableau-récapitulatif)
7. [Préparation aux évaluations de consolidation](#préparation-aux-évaluations-de-consolidation)
8. [Checklist finale](#checklist-finale)

<div class="page-break"></div>

\newpage

<div class="doc-footer">Collège de la Concorde · TEC.WMS · Simulateur pédagogique ERP/WMS · juillet 2026</div>

---

## Présentation du guide

**Programme :** TEC.LOG — Simulation WMS intégrée
**Public :** étudiants en préparation à l'évaluation
**Scénarios couverts :** SCN-012 à SCN-017
**Seuil de réussite :** 70 / 100 par scénario
**Version :** mise à jour — juillet 2026

> **Utilisez vos propres mots.** Une réponse correcte démontre le raisonnement attendu ; elle ne dépend pas d’une phrase unique.

Ce guide enseigne **comment observer, classer et décider**. Il ne fournit pas de phrases modèles à recopier.

| Ce guide vous apporte | Ce guide ne contient pas |
|-----------------------|--------------------------|
| Où regarder dans le simulateur | Des formulations exactes à recopier |
| Quelles idées votre réponse doit démontrer | Des listes de mots « magiques » obligatoires |
| Comment structurer un raisonnement court | La logique interne du correcteur automatique |
| Distinguer M4 (portefeuille) et M5 (session) | Des réponses modèles de correcteurs |

**Ordre recommandé :** SCN-012 → 013 → 014 (Module 4), puis SCN-015 → 016 → 017 (Module 5).

---

## Référence commune — Bandes KPI

À connaître pour **interpréter**, pas pour recopier une réponse :

| Indicateur | Formule / base | Bande de référence | Signal d'alerte |
|------------|----------------|--------------------|-----------------|
| **Rotation** | Consommation ÷ stock moyen | **4 à 12×/an** | < 4× : risque de surstock · > 12× : risque de stock trop serré |
| **Service (OTIF)** | Commandes honorées ÷ total | **≥ 95 %** | < 85 % insuffisant |
| **Erreurs** | Erreurs ÷ opérations | **1 à 5 %** | > 5 % critique |
| **Délai** | Délai moyen fournisseur | **3 à 7 j** | Contexte supply chain |

**Module 4** — données portefeuille fournies par le tour de contrôle analytique (pas de transaction physique).
**Module 5** — résultats et KPI issus de **votre propre session de simulation**.

> **Dans le Module 5, les résultats présentés dans le panneau de décision proviennent de votre propre session. Vous devez utiliser ces données pour expliquer la situation et formuler une décision professionnelle.**
>
> Le panneau présente des **preuves**. C’est à vous de produire le diagnostic. Le système ne fournit pas la conclusion finale. Des réponses courtes sont acceptées lorsque le raisonnement est complet.

---

## Deux paradigmes à distinguer

| | **Module 4** | **Module 5** |
|---|--------------|--------------|
| **Chaîne** | Observer → Classifier → Décider → Suivre | Exécuter → Vérifier → Interpréter → Décider |
| **Source** | Portefeuille / tour de contrôle | Résultats de votre session |
| **Moniteur** | Vide de transactions physiques — normal | Opérations exécutées dans le run |
| **Boutons** | Valider l’analyse | Valider les résultats · Soumettre la décision |
| **Niveau décision** | Analytique (politique / S&OP) | Tactique (015/016) ou stratégique (017) |
| **Seuil** | 70/100 | 70/100 |

# MODULE 4 — Tour de contrôle KPI

> Aucune transaction magasin. Interface : **référence analytique** · **valider l’analyse** · **lecture des données KPI**.

---

## SCN-012 — Rotation et politique stock

**Rôle :** analyste stock / revue CFO
**Longueur recommandée :** 2–3 phrases courtes

### Ce que vous observez

Consommation annuelle et stock moyen dans le tour de contrôle.

### Ce que vous devez comprendre

Formule : consommation ÷ stock moyen. Placer le résultat dans la bande 4–12× (ou hors bande).
Ne pas classer une rotation dans la bande normale comme un surstock.

### Ce que vous devez décider

Politique globale : maintenir / ne pas réduire massivement ; suivi des articles lents ou revue périodique.

### Ce que votre réponse doit démontrer

1. Classification cohérente du taux
2. Maintien (ou absence de réduction globale)
3. Suivi / surveillance

Exemples d’idées (pas de phrase unique) :

- *« La rotation est normale. Je maintiens la politique et je surveille les articles qui tournent lentement. »*
- *« Résultat équilibré : conserver le niveau global avec un contrôle régulier des produits. »*

Ces formulations illustrent le raisonnement. **Rédigez votre réponse avec vos propres mots.**

### Erreurs de raisonnement à éviter

- Classer 6× (bande normale) comme surstock
- Liquidation / destock global
- « Rien à faire / aucun suivi »

---

## SCN-013 — Service, erreurs et SLA

**Rôle :** responsable service client / qualité
**Longueur recommandée :** 2–4 phrases

### Ce que vous observez

Commandes livrées / total et erreurs opérationnelles ; horizon SLA à court terme.

### Ce que vous devez comprendre

Comparer OTIF et taux d’erreur. Un OTIF élevé n’efface pas un risque d’exécution.

### Ce que vous devez décider

Action qualité simple (formation, checklist, revue picking/réception, audit, contrôle) + suivi avant le SLA.

### Ce que votre réponse doit démontrer

1. OTIF classé correctement
2. Erreurs acceptables mais à améliorer / surveiller
3. Action qualité
4. Horizon court terme / SLA / revue

### Erreurs de raisonnement à éviter

- OTIF 95 % classé faible
- Erreurs 4 % présentées comme excellentes
- Destock comme levier principal
- « Rien à faire »

---

## SCN-014 — Arbitrage S&OP (capstone M4)

**Rôle :** comité S&OP — une seule initiative financée
**Longueur recommandée :** 3–5 phrases (réponse board concise)

### Ce que vous observez

Ensemble des KPI (rotation, service, erreurs, délai).

### Ce que vous devez comprendre

Situation globalement stable / contrôlée ; un seul budget à allouer.

### Ce que vous devez décider

Une priorité ; ce qui est protégé, maintenu ou reporté ; quand réévaluer.

### Ce que votre réponse doit démontrer

1. Lecture globale stable
2. Une priorité claire
3. Compromis explicite
4. Horizon de revue

### Erreurs de raisonnement à éviter

- Liste de souhaits sans priorité
- Aucun compromis
- Aucun horizon
- Copier une longue rédaction modèle

# MODULE 5 — Simulation intégrée

> Chaîne : **Exécuter → Vérifier → Interpréter → Décider**.
>
> Après les opérations, vous **validez les résultats**, puis vous **soumettez la décision**.
> Les données du panneau de décision viennent de **votre session** — pas du portefeuille M4.

Dans le Module 5, les résultats présentés dans le panneau de décision proviennent de votre propre session. Vous devez utiliser ces données pour expliquer la situation et formuler une décision professionnelle.

- Le panneau présente des **preuves** opérationnelles et des indicateurs.
- **Vous** produisez le diagnostic et la décision.
- Le système **ne déclare pas** la conclusion finale à votre place.
- **2 à 3 phrases** suffisent souvent si le raisonnement est complet (4 à 6 pour SCN-017).

---

## SCN-015 — Décision tactique à partir d’un cycle nominal

**Niveau :** Décision tactique
**Longueur recommandée :** 2 à 3 phrases suffisent si le raisonnement est complet.

### Ce que le panneau peut afficher

État des opérations · réception · rangement · variance ouverte · stock final · minimum · maximum · quantité de réapprovisionnement **Q** · KPI sélectionné.

Ces faits sont des **preuves**. Le panneau **ne déclare pas** le cycle « conforme » pour vous : c’est à vous de déterminer la conformité à partir des opérations et du stock.

### Ce que vous devez comprendre

1. Vérifier les opérations (réception, rangement, variance).
2. Comparer le stock final au minimum.
3. Déterminer si un réapprovisionnement est nécessaire.
4. Formuler une **décision tactique**.
5. Indiquer un suivi si pertinent.

**Q = 0** est un résultat valide lorsque le stock est suffisant. N’inventez pas un besoin de réapprovisionnement.

### Structure de raisonnement

Opérations → stock vs minimum → réappro (ou Q = 0) → décision tactique → suivi

### Exemple de raisonnement

*« Les opérations sont complétées et aucune variance n’est ouverte. Le stock reste supérieur au minimum, donc aucun réapprovisionnement n’est nécessaire et Q = 0. Je recommande de maintenir le processus et de suivre le prochain cycle. »*

Ce texte illustre le raisonnement. **Rédigez avec vos propres mots.** Ce n’est pas une réponse obligatoire.

### Erreurs de raisonnement à éviter

- Forcer une action corrective sans écart
- Inventer un réapprovisionnement alors que Q = 0
- Recopier les KPI du Module 4

---

## SCN-016 — Décision tactique après réconciliation

**Règle :** **Réconcilier d’abord, décider ensuite.**
**Niveau :** Décision tactique après réconciliation
**Longueur recommandée :** 2 à 3 phrases suffisent si la décision est basée sur le stock réconcilié.

### Contrat de production (valeurs exactes)

| Donnée | Valeur |
|--------|--------|
| Stock système | **50 u.** |
| Stock physique | **45 u.** |
| Écart | **−5** |
| Stock corrigé (après ADJ) | **45 u.** |
| Min / Max / SS | **10 / 100 / 5** |
| Q de réapprovisionnement | **0** (stock corrigé ≥ Min) |

### Deux états de l’interface

**Avant réconciliation**

- Stock système **50** · stock physique **45** · écart **−5**
- Réconciliation en attente · ajustement requis
- Pas encore de base de décision sur stock corrigé

**Après réconciliation**

- Stock corrigé **45** · ADJ **−5** posté
- Base de décision de réapprovisionnement (Min 10 → **Q = 0**)
- Décision finale fondée sur l’inventaire corrigé

Tant qu’un ajustement requis n’est pas résolu, la décision reste **bloquée**. Ne basez pas votre décision sur le stock avant correction.

Si l’écart est nul, l’interface peut indiquer **ADJ non requis** : cela ne signifie pas qu’un ajustement a eu lieu.

### Structure de raisonnement

1. Identifier la variance (−5)
2. Confirmer la réconciliation / ADJ
3. Utiliser le **stock corrigé (45)**
4. Comparer au minimum (10)
5. Déterminer le réapprovisionnement (**Q = 0**)
6. Recommander l’action tactique

### Exemple de raisonnement

*« L’écart a été réconcilié et le stock corrigé (45) constitue maintenant la base de décision. Le niveau corrigé reste suffisant par rapport au minimum ; aucun réapprovisionnement n’est requis. Je recommande de poursuivre le suivi des comptages. »*

**Avec vos propres mots.** Ce n’est pas une phrase exacte requise.

### Erreurs de raisonnement à éviter

- Décider avant la réconciliation / l’ajustement
- Ignorer un écart ouvert
- Calculer Q = Max − stock (55) sans tenir compte du seuil Min
- Traiter « ADJ non requis » comme si un ajustement avait été posté

---

## SCN-017 — Décision stratégique à partir des KPI de la session

**Niveau :** Décision stratégique
**Structure :** Preuves → Priorité → Compromis → Horizon
**Longueur recommandée :** 4 à 6 phrases suffisent si les quatre blocs du raisonnement sont présents.

### Ce que le panneau peut afficher

Rotation · service · taux d’erreur · délai moyen · valeur du stock · autres KPI de session disponibles.

Les valeurs viennent du **run courant**. Une valeur manquante peut apparaître comme **—**. Un zéro légitime reste affiché comme **0**. Aucune orientation stratégique n’est présélectionnée.

### Ce que vous devez démontrer

1. Citer **au moins deux KPI** disponibles
2. Choisir une **priorité stratégique**
3. Expliquer le **compromis**
4. Indiquer l’**horizon de suivi**

### Exemple de raisonnement

*« Le taux de service est élevé, mais le taux d’erreur reste à surveiller. Je recommande de prioriser la qualité d’exécution afin de réduire les erreurs sans dégrader le service. Cette orientation peut reporter une réduction immédiate du stock. Les résultats seront réévalués dans 90 jours. »*

Idées de raisonnement — **rédigez avec vos propres mots.**

### Erreurs de raisonnement à éviter

- Recopier les valeurs du portefeuille Module 4
- Réponse purement opérationnelle (poster une réception, un putaway…)
- Pas de compromis / pas d’horizon
- S’appuyer sur un seul KPI alors que d’autres sont disponibles

<div class="page-break"></div>

\newpage

## Tableau récapitulatif

| SCN | Niveau | Idée centrale | Longueur |
|-----|--------|---------------|----------|
| 012 | Analytique | Classer rotation + maintenir + suivre | 2–3 phrases |
| 013 | Analytique | OTIF vs erreurs + action qualité + SLA | 2–4 phrases |
| 014 | Capstone M4 | Priorité + compromis + horizon | 3–5 phrases |
| 015 | Décision tactique | Preuves session · Q = 0 possible | 2–3 phrases |
| 016 | Décision tactique après réconciliation | Réconcilier puis décider sur stock corrigé | 2–3 phrases |
| 017 | Décision stratégique | Preuves → priorité → compromis → horizon | 4–6 phrases |

---

## Préparation aux évaluations de consolidation

Sans décrire le calendrier ni le nombre de tentatives (fonctions à venir) :

**Évaluation de consolidation M1–M3**
Compréhension des processus et séquences (POSTED/PENDING, putaway, capacité, FIFO, inventaire, ADJ, Min/Max, réappro).

**Évaluation de consolidation M4–M5**
Interprétation KPI, distinction tactique / stratégique, résultats de session, compromis — **avec vos propres mots**.

L’évaluation valorise la **compréhension**, pas les phrases mémorisées.

---

## Checklist finale

<div class="checklist-page">

| ☐ | Point |
|---|--------|
| ☐ | J’ai **observé** les données / preuves du scénario |
| ☐ | J’ai **classifié** sans recopier une réponse modèle |
| ☐ | Ma décision est cohérente (y compris Q = 0 si pertinent) |
| ☐ | J’ai un **suivi** ou un **horizon** si attendu |
| ☐ | En M5, j’utilise les KPI de **ma session** |
| ☐ | J’ai rédigé **avec mes propres mots** |

</div>

### Question finale

*« Mon raisonnement montre-t-il ce que j’observe, ce que je classe, ce que je décide et ce que je suis — en phrases claires et personnelles ? »*

<div class="doc-footer">Collège de la Concorde · TEC.WMS · Simulateur pédagogique ERP/WMS · juillet 2026 · Guidance pédagogique uniquement</div>
