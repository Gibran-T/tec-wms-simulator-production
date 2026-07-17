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
@media print {
  @page {
    size: A4;
    margin: 2.5cm;
    @bottom-center {
      content: "Collège de la Concorde · TEC.WMS · Simulateur pédagogique ERP/WMS · juillet 2026";
      font-size: 9pt;
      color: #444;
    }
    @bottom-right {
      content: counter(page);
      font-size: 9pt;
      color: #444;
    }
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
Version juillet 2026 · Document étudiant

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
**Version :** juillet 2026

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
| **Rotation** | Consommation ÷ stock moyen | **4 à 12×/an** | < 4× surstock · > 12× sous-performance |
| **Service (OTIF)** | Commandes honorées ÷ total | **≥ 95 %** | < 85 % insuffisant |
| **Erreurs** | Erreurs ÷ opérations | **1 à 5 %** | > 5 % critique |
| **Délai** | Délai moyen fournisseur | **3 à 7 j** | Contexte supply chain |

**Module 4** — données portefeuille fournies par le tour de contrôle analytique (pas de transaction physique).
**Module 5** — KPI issus de **votre run** (ledger / snapshot).

> **Les KPI du Module 5 proviennent de votre session. Ne recopiez pas les valeurs du Module 4, sauf si elles apparaissent réellement dans votre snapshot.**

---

## Deux paradigmes à distinguer

| | **Module 4** | **Module 5** |
|---|--------------|--------------|
| **Chaîne** | Observer → Classifier → Décider → Suivre | Exécuter → Vérifier → Corriger si nécessaire → Décider |
| **Source KPI** | Portefeuille / tour de contrôle | Snapshot de votre session |
| **Moniteur** | Vide de transactions physiques — normal | Transactions ops du run |
| **Niveau décision** | Analytique (politique / S&OP) | Tactique (015/016) ou stratégique (017) |
| **Seuil** | 70/100 | 70/100 |

<div class="page-break"></div>

\newpage

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

<div class="page-break"></div>

\newpage

# MODULE 5 — Simulation intégrée

> Chaîne : **Exécuter → Vérifier → Corriger si nécessaire → Décider**.
> KPI = **snapshot de votre session**.

---

## SCN-015 — Cycle nominal (décision tactique)

**Longueur recommandée :** 2–3 phrases

### Ce que vous observez

Preuves du run (réception, putaway, comptage, réappro, KPI).

### Ce que vous devez comprendre

Un cycle conforme peut aboutir à **Q = 0** si le stock est ≥ minimum.

### Ce que vous devez décider

Confirmer conformité ; indiquer si réappro est requis ; maintenir / surveiller.

### Ce que votre réponse doit démontrer

Conformité nominale · décision de réappro (souvent Q = 0) · suivi léger

**N’inventez pas** formation, audit ou problème fictif.

### Erreurs de raisonnement à éviter

- Forcer une action corrective sans écart
- Recopier les KPI du Module 4

---

## SCN-016 — Écart puis décision tactique

**Règle :** **Réconcilier d’abord, décider ensuite.**
**Longueur recommandée :** 2–4 phrases

### Ce que vous observez

Écart au comptage ; ajustement ; stock corrigé.

### Ce que vous devez comprendre

Réappro et KPI se basent sur le stock **après** correction.

### Ce que vous devez décider

Sur stock corrigé : réappro ou Q = 0 ; suivi éventuel.

### Ce que votre réponse doit démontrer

Reconnaissance de l’écart / correction · décision sur stock réconcilié

La prévention est utile mais **pas obligatoire** sauf si la question le demande.

### Erreurs de raisonnement à éviter

- Décider avant l’ajustement
- Ignorer l’écart ouvert

---

## SCN-017 — Décision stratégique (capstone)

**Structure :** Preuves → Priorité → Compromis → Horizon
**Longueur recommandée :** 4–6 phrases

### Ce que vous observez

Snapshot M5_KPI **de votre session** (pas l’Annexe M4).

### Ce que vous devez comprendre

Niveau stratégique : arbitrage durable, pas une transaction ops.

### Ce que vous devez décider

Priorité stratégique + compromis + horizon 90–180 j (ou équivalent).

### Ce que votre réponse doit démontrer

1. ≥ 2 KPI chiffrés du snapshot
2. Une priorité
3. Un compromis (même sans le mot « trade-off »)
4. Un horizon de revue

### Erreurs de raisonnement à éviter

- Recopier 6× / 95 % / 48 000 $ du Module 4
- Réponse purement opérationnelle (poster réception, putaway…)
- Pas de compromis / pas d’horizon

<div class="page-break"></div>

\newpage

## Tableau récapitulatif

| SCN | Niveau | Idée centrale | Longueur |
|-----|--------|---------------|----------|
| 012 | Analytique | Classer rotation + maintenir + suivre | 2–3 phrases |
| 013 | Analytique | OTIF vs erreurs + action qualité + SLA | 2–4 phrases |
| 014 | Capstone M4 | Priorité + compromis + horizon | 3–5 phrases |
| 015 | Tactique | Cycle nominal · Q = 0 possible | 2–3 phrases |
| 016 | Tactique | Réconcilier puis décider | 2–4 phrases |
| 017 | Stratégique | Preuves session → priorité → compromis → horizon | 4–6 phrases |

---

## Préparation aux évaluations de consolidation

Sans décrire le calendrier ni le nombre de tentatives (fonctions à venir) :

**Évaluation de consolidation M1–M3**
Compréhension des processus et séquences (POSTED/PENDING, putaway, capacité, FIFO, inventaire, ADJ, Min/Max, réappro).

**Évaluation de consolidation M4–M5**
Interprétation KPI, distinction tactique / stratégique, snapshot de session, compromis — **avec vos propres mots**.

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
