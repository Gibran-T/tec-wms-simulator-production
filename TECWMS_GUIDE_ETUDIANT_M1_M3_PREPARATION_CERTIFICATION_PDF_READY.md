---
title: "TEC.WMS — Guide de Préparation Modules M1, M2 et M3"
author: "Collège de la Concorde"
date: "juillet 2026"
lang: fr-CA
geometry: margin=2.5cm
toc: false
header-includes:
  - \usepackage{fancyhdr}
  - \usepackage{setspace}
  - \pagestyle{fancy}
  - \fancyhead[L]{\small TEC.WMS — Guide étudiant M1/M2/M3}
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

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!-- PAGE DE COUVERTURE                                                       -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

<div class="cover-page">

<p class="brand">TEC.WMS</p>

<div class="title-block">

# Guide de Préparation

# Modules M1, M2 et M3

# Préparation aux scénarios et à la certification

</div>

<div class="subtitle-block">

**Collège de la Concorde**
Simulateur pédagogique ERP/WMS

</div>

<div class="meta">

Scénarios SCN-001 à SCN-011 · Seuils : M1/M2 ≥ 60/100 · M3 ≥ 70/100
Version juillet 2026 · Document étudiant

</div>

</div>

<div class="page-break"></div>

\newpage

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!-- TABLE DES MATIÈRES                                                       -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

# Table des matières

1. [Présentation du guide](#présentation-du-guide)
2. [Référence commune — Flux ERP/WMS et zones](#référence-commune--flux-erpwms-et-zones)
3. [Trois paradigmes à distinguer](#trois-paradigmes-à-distinguer)
4. [Module 1 — Fondements ERP/WMS](#module-1--fondements-erpwms)
   - 4.1 [SCN-001 — Cycle propre (flux nominal)](#scn-001--cycle-propre-flux-nominal)
   - 4.2 [SCN-002 — Réception fantôme (GR non postée)](#scn-002--réception-fantôme-gr-non-postée)
   - 4.3 [SCN-003 — Stock insuffisant et réapprovisionnement](#scn-003--stock-insuffisant-et-réapprovisionnement)
   - 4.4 [SCN-004 — Écart d'inventaire](#scn-004--écart-dinventaire)
   - 4.5 [SCN-005 — Non-conformités multiples (capstone M1)](#scn-005--non-conformités-multiples-capstone-m1)
5. [Module 2 — Exécution d'entrepôt](#module-2--exécution-dentrepôt)
   - 5.1 [SCN-006 — Rangement structuré (putaway)](#scn-006--rangement-structuré-putaway)
   - 5.2 [SCN-007 — Dépassement de capacité d'emplacement](#scn-007--dépassement-de-capacité-demplacement)
   - 5.3 [SCN-008 — Application FIFO multi-lots](#scn-008--application-fifo-multi-lots)
6. [Module 3 — Contrôle des stocks et réapprovisionnement](#module-3--contrôle-des-stocks-et-réapprovisionnement)
   - 6.1 [SCN-009 — Inventaire cyclique simple](#scn-009--inventaire-cyclique-simple)
   - 6.2 [SCN-010 — Écart significatif et justification](#scn-010--écart-significatif-et-justification)
   - 6.3 [SCN-011 — Réapprovisionnement Min/Max (capstone M3)](#scn-011--réapprovisionnement-minmax-capstone-m3)
7. [Tableau récapitulatif — Données opérationnelles clés](#tableau-récapitulatif--données-opérationnelles-clés)
8. [Progression pédagogique](#progression-pédagogique)
9. [Checklist finale avant soumission](#checklist-finale-avant-soumission)

<div class="page-break"></div>

\newpage

<div class="doc-footer">Collège de la Concorde · TEC.WMS · Simulateur pédagogique ERP/WMS · juillet 2026</div>

---

## Présentation du guide

**Programme :** TEC.LOG — Simulation WMS intégrée
**Public :** étudiants en préparation à l'évaluation
**Scénarios couverts :** SCN-001 à SCN-011
**Seuils de réussite :** M1 et M2 ≥ 60/100 · M3 ≥ 70/100
**Version :** juillet 2026

Ce document consolide l'essentiel pour préparer les **Modules 1, 2 et 3** de la simulation WMS. Il vous aide à **comprendre, observer et exécuter** — pas à mémoriser des réponses toutes faites.

| Ce guide vous apporte | Ce guide ne contient pas |
|-----------------------|--------------------------|
| Où regarder dans le simulateur (cockpit, moniteur) | Des formulations exactes à recopier |
| Quelles données lire et comment les interpréter | Des réponses modèles des correcteurs |
| Quels mots-clés renforcer votre raisonnement | La logique interne de correction automatique |
| Comment structurer votre séquence d'actions | Des listes de mots « magiques » sans contexte |

**Ordre recommandé :** SCN-001 → 002 → 003 → 004 → 005 (Module 1), puis SCN-006 → 007 → 008 (Module 2), puis SCN-009 → 010 → 011 (Module 3).

**Certification Silver (M1) :** quiz M1 ≥ 60 % + SCN-001 à SCN-005 complétés en évaluation (≥ 60/100) + conformité M1.

**Question réflexive avant chaque soumission :** *« Ai-je posté chaque document dans le bon ordre, lu les preuves dans le moniteur et le cockpit, et résolu chaque bloqueur avant la conformité ? »*

---

## Référence commune — Flux ERP/WMS et zones

À connaître pour **interpréter** le simulateur, pas pour recopier des chiffres au hasard :

| Élément | Règle opérationnelle | Signal d'alerte |
|---------|---------------------|-----------------|
| **Statut POSTED** | Document validé — le stock système est disponible | PENDING = document fantôme, stock non utilisable |
| **Zone RECEPTION** | Quai (REC-01, REC-02) — stock temporaire après GR | Stock au quai ≠ stock en picking |
| **Zone STOCKAGE** | Emplacements B-xx (putaway obligatoire avant expédition M1) | Picking depuis REC-01 = erreur de zone |
| **Zone EXPÉDITION** | Quai sortie (EXP-01, EXP-02) — destination du prélèvement | GI sans picking préalable |
| **Conformité** | Aucune transaction PENDING, pas de stock négatif, pas d'écart ouvert | Conformité bloquée tant qu'un bloqueur persiste |
| **Capacité bin** | Max affiché (ex. B-01-R1-L1 = 500 u.) | Overflow = répartition requise |
| **Min/Max/SS (M3)** | Seuils de réapprovisionnement par SKU | Stock < Min = risque rupture |

**Codes transaction SAP (référence pédagogique) :** ME21N (PO) · MIGO (GR) · LT0A/LT01 (putaway) · VA01 (SO) · VL01N/VL02N (picking/GI) · MI01 (comptage) · MI07 (ajustement).

**Contrat M2 :** GR pré-chargée et postée — démarrage au PUTAWAY (sauf SCN-008 : stock pré-chargé en STOCKAGE, démarrage au FIFO_PICK). SCN-007 = parcours capacité sans FIFO.

**Contrat M3 :** selon le scénario —
- **SCN-009 / SCN-010 :** pipeline inventaire `CC_LIST → CC_COUNT → CC_RECON → REPLENISH → COMPLIANCE_M3` ;
- **SCN-011 :** parcours Min/Max **uniquement** `REPLENISH → COMPLIANCE_M3` (pas de cycle count obligatoire).

> **Utilisez vos propres mots.** Une réponse correcte démontre le raisonnement attendu ; elle ne dépend pas d’une phrase unique ni d’une liste magique de mots-clés.

---

## Trois paradigmes à distinguer

| | **Module 1 — Fondements** | **Module 2 — Entrepôt** | **Module 3 — Inventaire** |
|---|---------------------------|-------------------------|---------------------------|
| **Activité** | Exécution ERP/WMS + audit inventaire (SCN-004/005) | Rangement, capacité, FIFO | Comptage (009/010) ou réappro Min/Max (011) |
| **Moniteur** | Chaque transaction que vous créez | GR pré-postée + vos mouvements | Historique + ajustements ADJ (si écart) |
| **Source de preuve** | Moniteur + cockpit stock | Cockpit emplacements + capacité | Quantités système vs physique, ou seuils Min/Max |
| **Parcours type** | PO → GR → Putaway → [STOCK] → CC → [ADJ] → Conformité *(audit SCN-004/005 : pas d’expédition SO/GI)* | PUTAWAY → (FIFO_PICK si SCN-008) → STOCK_ACCURACY → COMPLIANCE_ADV | 009/010 : CC → RECON ; **011 : REPLENISH seulement** |
| **Niveau décision** | Exécution séquentielle (M1) | Règles d'emplacement et lots (M2) | Réconciliation et/ou planification (M3) |
| **Seuil** | 60/100 | 60/100 | 70/100 |

<div class="page-break"></div>

\newpage

# MODULE 1 — Fondements ERP/WMS

> Vous **exécutez** le cycle logistique complet. Chaque document doit être **posté** avant l'étape suivante. La preuve est dans le **moniteur de transactions** et le **cockpit opérationnel**.

**Certification Silver Premium :** les cinq scénarios M1 comptent pour la Certification Silver Premium TEC.WMS (Cohorte Fondatrice 2026).

<div class="page-break"></div>

\newpage

## SCN-001 — Cycle propre (flux nominal)

**Rôle simulé :** Gestionnaire de stocks — exécution d'un flux logistique nominal complet
**Enjeu :** Construire le cycle PO → GR → rangement → expédition → inventaire → conformité **sans anomalie**.
**Piège pédagogique :** l'**entrepôt vide au départ** n'est pas un bug — le stock n'apparaît qu'après la GR postée.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | SKU-001 · 100 u. · séquence ME21N → MIGO → LT0A → VA01 → VL02N → MI01 |
| Cockpit opérationnel | Stock vide au départ ; quantités après chaque mouvement |
| Moniteur de transactions | Chaque document passe de créé à **POSTED** avant l'étape suivante |
| Bannière pédagogique | « Stock vide au départ : normal » |
| Étape COMPLIANCE | Vert = aucune transaction PENDING, pas de stock négatif |

### KPI / données à lire

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **Statut transactions** | Primaire | PO POSTED → GR POSTED → putaway POSTED → GI POSTED |
| **Stock REC-01 puis STOCKAGE** | Primaire | 100 u. SKU-001 visible après GR, puis déplacées en zone STOCKAGE |
| **Quantité MB52 / cockpit** | Secondaire | Cohérence à chaque étape — pas de stock négatif |
| **Conformité système** | Primaire | Vert uniquement si séquence complète et cohérente |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| PO / GR | `ME21N`, `MIGO`, `POSTED`, `réception`, `quai`, `REC-01`, `SKU-001`, `100 u.` | Commentaire réception : document validé |
| Putaway | `LT0A`, `PUTAWAY`, `STOCKAGE`, `rangement`, `emplacement`, `traçabilité` | Étape rangement : zone conforme |
| Expédition | `VA01`, `SO`, `VL01N`, `picking`, `VL02N`, `GI`, `EXP-01` | Prélèvement depuis STOCKAGE, pas depuis quai |
| Inventaire | `MI01`, `comptage cyclique`, `conformité`, `MB52` | Cycle count final |
| Conformité | `conformité système`, `séquence`, `flux nominal`, `end-to-end` | Clôture : cycle complet sans anomalie |

**Mots à éviter :** `bug`, `erreur système` (pour l'état vide initial), `GR fantôme`, `rupture`, `écart`, `surstock`, vocabulaire KPI M4 (`rotation`, `OTIF`, `capital immobilisé`).

### Structure de réponse

1. **PO (ME21N)** — Créer et poster la commande fournisseur vers REC-01 pour SKU-001 (100 u.).
2. **GR (MIGO)** — Poster la réception ; confirmer stock visible au quai.
3. **PUTAWAY (LT0A)** — Ranger REC-01 → emplacement STOCKAGE.
4. **SO + Picking + GI** — Créer la commande client, prélever depuis STOCKAGE, poster la sortie.
5. **CC (MI01)** — Effectuer le comptage cyclique.
6. **COMPLIANCE** — Valider conformité système au vert.

### Erreurs fréquentes

- Sauter une étape (OUT_OF_SEQUENCE) — chaque étape a un prérequis.
- Tenter la GI **avant** le putaway — stock encore au quai.
- Confondre stock vide initial avec une anomalie.
- Ne pas vérifier le statut **POSTED** dans le moniteur.
- Prélever depuis REC-01 au lieu de STOCKAGE.

### Pièges pédagogiques

- **Entrepôt vide :** comportement attendu SCN-001 — la première preuve opérationnelle apparaît après GR.
- **Séquence stricte :** en évaluation, chaque erreur est pénalisée ; en démo, exploration libre.
- **Document ≠ stock :** la PO postée ne crée pas de stock utilisable tant que la GR n'est pas postée.

<div class="page-break"></div>

\newpage

## SCN-002 — Réception fantôme (GR non postée)

**Rôle simulé :** Contrôleur qualité logistique — détection d'anomalie de réception
**Enjeu :** La PO est validée mais le stock n'apparaît pas — identifier et **poster la GR fantôme** GR-2025-001.
**Piège pédagogique :** créer une **nouvelle GR** au lieu de **poster l'existante** — laisse la fantôme non résolue.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | GR-2025-001 en statut PENDING |
| Moniteur de transactions | PO-2025-001 **POSTED** vs GR-2025-001 **PENDING** |
| Cockpit REC-01 | Quai vide ou stock non utilisable malgré PO validée |
| Bannière pédagogique | « REC-01 vide malgré la PO : l'anomalie est la GR non postée » |
| Étape GR / Conformité | Bouton « Poster (MIGO) » sur la transaction PENDING |

### KPI / données à lire

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **GR-2025-001 PENDING** | Primaire | Preuve de l'anomalie — document créé mais non validé |
| **PO POSTED vs GR PENDING** | Primaire | Écart documentaire = cause du stock absent |
| **Stock REC-01** | Primaire | Vide tant que GR non postée |
| **Statut après correction** | Secondaire | GR POSTED → 100 u. SKU-001 visibles |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| Diagnostic | `GR fantôme`, `PENDING`, `non postée`, `GR-2025-001`, `moniteur`, `anomalie`, `document` | Identification : comparer PO et GR |
| Correction | `MIGO`, `poster`, `valider`, `régulariser`, `transaction existante` | Action : poster GR-2025-001 |
| Suite du flux | `putaway`, `STOCKAGE`, `SO`, `GI`, `conformité rétablie` | Après correction : flux standard |
| Justification | `réception physique ≠ stock ERP`, `validation document`, `WMS` | Commentaire : principe métier |

**Mots à éviter :** `nouvelle GR`, `recréer`, `bug système`, `double réception`, `ignorer PENDING`, vocabulaire inventaire (`écart`, `MI07`) — hors sujet ici.

### Structure de réponse

1. **Diagnostic** — Ouvrir moniteur ; repérer GR-2025-001 PENDING ; confirmer REC-01 vide.
2. **Correction GR** — Cliquer « Poster (MIGO) » sur GR-2025-001 (ne pas créer une nouvelle GR).
3. **PUTAWAY** — Ranger REC-01 → STOCKAGE une fois stock disponible.
4. **Expédition** — SO → Picking → GI selon flux standard.
5. **CC + COMPLIANCE** — Comptage et conformité au vert.

### Erreurs fréquentes

- **Créer une nouvelle GR** — laisse GR-2025-001 PENDING ; conformité bloquée.
- Poursuivre putaway/expédition sans poster la fantôme — OUT_OF_SEQUENCE.
- Traiter comme SCN-001 (entrepôt vide normal) — ici la PO existe déjà.
- Ignorer le moniteur — la preuve est PO POSTED / GR PENDING.

### Pièges pédagogiques

- **Réception physique ≠ stock ERP :** document créé mais non posté = stock système indisponible.
- **Une seule correction valide :** poster la transaction existante, pas en créer une autre.
- **Bloqueur persistant :** toute GR PENDING bloque les étapes suivantes en M1.

<div class="page-break"></div>

\newpage

## SCN-003 — Stock insuffisant et réapprovisionnement

**Rôle simulé :** Responsable d'opération — gestion de rupture et réapprovisionnement d'urgence
**Enjeu :** 50 u. SKU-003 au quai ; la SO demandera **plus que le stock STOCKAGE** — réapprovisionner avant la GI.
**Piège pédagogique :** valider la **GI avec stock insuffisant** ou expédier **sans putaway** depuis REC-01.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | SKU-003 · 50 u. REC-01 · SO ~80 u. après rangement |
| Cockpit REC-01 | 50 u. au quai — pas encore en STOCKAGE |
| Cockpit STOCKAGE | Quantité disponible après putaway — insuffisante pour SO |
| Moniteur | Mouvement REC-01 → STOCKAGE ; PO/GR corrective si réappro |
| Étape GI | Blocage si stock STOCKAGE insuffisant |

### KPI / données à lire

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **Stock REC-01 (50 u.)** | Primaire | Stock au quai — rangement obligatoire avant expédition |
| **Stock STOCKAGE post-putaway** | Primaire | Base ATP pour la SO |
| **Quantité SO vs stock disponible** | Primaire | Déficit → réapprovisionnement requis |
| **Statut GI** | Secondaire | Refus si stock négatif ou insuffisant |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| Putaway | `PUTAWAY`, `REC-01`, `STOCKAGE`, `B-01-R1-L2`, `SKU-003`, `quai`, `rangement` | Avant SO : stock en zone picking |
| Analyse stock | `stock insuffisant`, `déficit`, `ATP`, `disponible`, `50 u.`, `80 u.` | Avant GI : comparer demande et stock |
| Réappro | `PO corrective`, `ME21N`, `MIGO`, `réapprovisionnement`, `urgence`, `backorder` | Combler le déficit (+30 u. typique) |
| Expédition | `GI`, `commande client`, `SO satisfaite`, `pas de stock négatif` | GI uniquement si stock suffisant |
| Conformité | `réapprovisionnement`, `rupture évitée`, `conformité` | Clôture |

**Mots à éviter :** `GI forcée`, `stock négatif`, `expédier depuis REC-01`, `ignorer déficit`, `Min/Max` (concept M3), `GR fantôme` (GR déjà postée ici).

### Structure de réponse

1. **PUTAWAY** — Déplacer 50 u. SKU-003 de REC-01 vers bin STOCKAGE.
2. **SO** — Créer commande client pour quantité supérieure au stock (ex. 80 u.) ; noter le blocage.
3. **Réapprovisionnement** — PO corrective + GR pour combler le déficit ; ranger en STOCKAGE.
4. **Picking + GI** — Prélever depuis STOCKAGE ; poster GI.
5. **CC + COMPLIANCE** — Comptage et conformité.

### Erreurs fréquentes

- Valider GI **sans réapprovisionnement** — NEGATIVE_STOCK_ATTEMPT.
- Oublier le **putaway** — stock encore au quai, pas en zone expédition.
- Créer SO sans vérifier stock STOCKAGE disponible.
- Confondre avec SCN-002 (pas de GR fantôme — PO/GR déjà postées).

### Pièges pédagogiques

- **REC-01 ≠ bin de picking :** le quai n'est pas une zone d'expédition directe.
- **ATP protège le client :** le système bloque la GI si stock insuffisant — comportement attendu.
- **Réappro avant GI :** ordre métier non négociable en évaluation.

<div class="page-break"></div>

\newpage

## SCN-004 — Écart d'inventaire

**Rôle simulé :** Auditeur d'inventaire — réconciliation physique/système après rangement
**Enjeu :** 200 u. SKU-006 reçues et rangées ; le comptage physique révèle un **écart −15 u.** (système 200 / physique 185).
**Piège pédagogique :** saisir la **variance (−15)** au lieu de la **quantité physique réelle (185 u.)** au comptage.

> **Contrat de production :** scénario d’**audit inventaire après putaway**. Aucune transaction d’expédition (SO / picking / GI) n’est requise ni attendue.

### Ce que vous observez

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | SKU-006 · 200 u. · écart −15 intentionnel |
| Cockpit B-02-R1-L1 | Stock système après putaway (pas d’expédition préalable) |
| Étape CC (MI01) | Saisir quantité **physique comptée**, pas la variance |
| Étape ADJ (MI07) | Apparaît si variance ≠ 0 — correction obligatoire |
| Moniteur | Trace PO → GR → putaway → CC → ADJ |

### Ce que vous devez comprendre

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **Stock système (200 u.)** | Primaire | Référence avant comptage |
| **Quantité physique saisie** | Primaire | Valeur réelle comptée (185 si système affiche 200) |
| **Variance (−15)** | Primaire | Calculée par le système — à corriger via ADJ |
| **Statut conformité** | Secondaire | Bloquée si écart non résolu |

### Ce que vous devez faire

1. **PUTAWAY** — REC-01 → B-02-R1-L1 (200 u. SKU-006).
2. **STOCK** — Confirmer la disponibilité en STOCKAGE.
3. **CC (MI01)** — Saisir la quantité physique réelle (185).
4. **ADJ (MI07)** — Corriger l’écart −15 ; poster l’ajustement.
5. **COMPLIANCE** — Conformité au vert.

### Ce que vous devez vérifier

- Ne pas saisir **−15** comme quantité physique (saisir **185**).
- Ne pas passer à conformité **sans ADJ** — UNRESOLVED_VARIANCE.
- Ne pas chercher SO / picking / GI : ce scénario **n’est pas** un flux d’expédition.
- L’écart n’est pas optionnel — bloqueur en évaluation.

### Pièges pédagogiques

- **physicalQty ≠ variance :** le comptage enregistre ce qui est compté, pas l’écart calculé.
- **ADJ dynamique :** l’étape MI07 s’insère si variance détectée.
- **Précurseur M3 :** même discipline que SCN-009/010.

<div class="page-break"></div>

\newpage

## SCN-005 — Non-conformités multiples (capstone M1)

**Rôle simulé :** Superviseur logistique — résolution de non-conformités multiples
**Enjeu :** Deux anomalies simultanées : **GR-2025-004 non postée** (SKU-004, 30 u.) + **écart inventaire SKU-005 (−8 u. à B-01-R1-L2)**.
**Piège pédagogique :** mauvais **ordre de résolution** — putaway SKU-004 avant post de la GR fantôme.

> **Contrat de production :** capstone d’**audit multi-anomalies** (documents → putaway → inventaire → conformité). **Aucune expédition SO / picking / GI n’est requise.**

### Ce que vous observez

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | Ordre : Documents → Physique / putaway → Contrôle inventaire |
| Moniteur | GR-2025-004 PENDING (SKU-004) ; PO/GR SKU-005 POSTED |
| Cockpit REC-01 / REC-02 | SKU-004 bloqué par GR fantôme ; SKU-005 au quai |
| Étape CC + ADJ | Écart −8 sur SKU-005 (système 60 / physique 52) |
| COMPLIANCE | Vert seulement si **tous** bloqueurs levés |

### Ce que vous devez comprendre

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **GR-2025-004 PENDING** | Primaire | Bloqueur documentaire — priorité 1 |
| **Stock SKU-004 / SKU-005** | Primaire | Deux SKU, deux quais — putaways distincts |
| **Variance SKU-005 (−8)** | Primaire | Écart inventaire — ADJ obligatoire |
| **Conformité globale** | Primaire | Tous bloqueurs levés — capstone M1 |

### Ce que vous devez faire

1. **Poster GR-2025-004** — MIGO · SKU-004 · 30 u. · REC-01.
2. **PUTAWAY** — SKU-004 : REC-01 → B-01-R1-L1 (30) ; SKU-005 : REC-02 → B-01-R1-L2 (60).
3. **STOCK** — Confirmer les deux SKU en STOCKAGE.
4. **CC SKU-005** — Saisir la quantité physique réelle (52).
5. **ADJ (MI07)** — Corriger l’écart −8 ; **COMPLIANCE** au vert.

### Ce que vous devez vérifier

- Ne pas faire le putaway SKU-004 **avant** le post de GR-2025-004.
- Ne pas créer une **nouvelle** GR pour SKU-004.
- Ne pas clôturer sans ADJ pour l’écart −8.
- Ne pas ajouter une étape d’expédition : ce n’est **pas** le contrat actuel.

### Pièges pédagogiques

- **Capstone M1 :** combine GR fantôme (SCN-002) + écart inventaire (SCN-004).
- **Ordre strict :** poster la GR fantôme **avant** tout rangement SKU-004.
- **Score bloqué** sans conformité — gate final Silver.

<div class="page-break"></div>

\newpage

# MODULE 2 — Exécution d'entrepôt

> Vous **exécutez** des opérations d'entrepôt avancées : rangement structuré, gestion de capacité, conformité FIFO. La GR est **pré-postée** (sauf SCN-008) — démarrage au PUTAWAY ou FIFO_PICK.

<div class="page-break"></div>

\newpage

## SCN-006 — Rangement structuré (putaway)

**Rôle simulé :** Spécialiste rangement (Putaway Specialist) — affectation d'emplacement conforme
**Enjeu :** 150 u. SKU-001 postées au quai REC-01 — ranger en zone **STOCKAGE** selon règles LT01.
**Piège pédagogique :** sauter le **PUTAWAY** ou choisir un bin **hors zone STOCKAGE**.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | PO-M2-001 / GR-M2-001 POSTED · 150 u. REC-01 |
| Moniteur | GR postée avant putaway — preuve réception |
| Cockpit REC-01 | 150 u. SKU-001 au quai |
| Sélecteur bin | Zone STOCKAGE (B-xx) — capacité disponible |
| Pipeline M2 | PUTAWAY → FIFO_PICK → STOCK_ACCURACY → COMPLIANCE_ADV |

### KPI / données à lire

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **GR-M2-001 POSTED** | Primaire | Prérequis putaway validé |
| **150 u. REC-01** | Primaire | Quantité à ranger intégralement |
| **Zone destination** | Primaire | STOCKAGE obligatoire — pas PICKING direct depuis quai |
| **Précision stock post-putaway** | Secondaire | Cohérence cockpit après mouvement |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| Observation | `GR-M2-001`, `POSTED`, `REC-01`, `150 u.`, `SKU-001`, `moniteur` | Vérification initiale |
| Putaway | `LT01`, `PUTAWAY`, `STOCKAGE`, `rangement structuré`, `emplacement`, `slotting` | Mouvement REC-01 → bin valide |
| Suite M2 | `FIFO_PICK`, `STOCK_ACCURACY`, `COMPLIANCE_ADV`, `traçabilité` | Étapes suivantes |
| Conformité | `séquence M2`, `zone conforme`, `capacité` | Validation |

**Mots à éviter :** `GR fantôme` (GR déjà postée), `overflow` (SCN-007), `FIFO` comme action principale ici, `Min/Max`, vocabulaire KPI M4.

### Structure de réponse

1. **Observer moniteur** — Confirmer PO-M2-001 et GR-M2-001 POSTED.
2. **Cockpit REC-01** — Vérifier 150 u. SKU-001.
3. **PUTAWAY (LT01)** — REC-01 → bin STOCKAGE valide.
4. **FIFO_PICK → STOCK_ACCURACY → COMPLIANCE_ADV** — Compléter pipeline M2.

### Erreurs fréquentes

- Putaway **sans GR postée** vérifiée.
- Choisir bin **hors zone STOCKAGE**.
- Sauter PUTAWAY alors que stock est au quai.
- Confondre avec SCN-008 (putaway déjà fait).

### Pièges pédagogiques

- **GR pré-chargée M2 :** pas de PO/GR à créer — focus sur exécution entrepôt.
- **Putaway = traçabilité emplacement :** fondation pour FIFO et précision stock M2.
- **Séquence M2 distincte M1 :** PUTAWAY → FIFO_PICK → STOCK_ACCURACY → COMPLIANCE_ADV.

<div class="page-break"></div>

\newpage

## SCN-007 — Dépassement de capacité d'emplacement

**Rôle simulé :** Planificateur capacité (Capacity Planner) — gestion overflow
**Enjeu :** 600 u. SKU-002 (LOT-2025-002) au quai ; bin B-01-R1-L1 **max 500 u.** — répartir sans dépassement.
**Piège pédagogique :** **forcer 600 u. dans un seul bin** malgré l'alerte capacité.

> **Contrat de production (exact-match) :**
> 1) **500 u.** → `B-01-R1-L1` · 2) **100 u.** → `B-01-R1-L2` · lot **LOT-2025-002** conservé · **600 u. placées**.
> Aucun split « équivalent » ni bin alternatif n’est accepté. Parcours : GR → PUTAWAY → STOCK_ACCURACY → COMPLIANCE_ADV (**pas de FIFO** ici — FIFO = SCN-008).

### Ce que vous observez

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | 600 u. · B-01-R1-L1 max 500 · LOT-2025-002 |
| Cockpit capacité | Message dépassement si 600 u. vers B-01-R1-L1 |
| Moniteur | GR-M2-002 POSTED · 600 u. REC-01 |
| Split putaway | D’abord 500 → B-01-R1-L1, puis 100 → B-01-R1-L2 |
| Traçabilité lot | LOT-2025-002 sur les deux mouvements |

### Ce que vous devez comprendre

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **600 u. au quai** | Primaire | Quantité totale à placer |
| **Capacité B-01-R1-L1 (500)** | Primaire | Limite hard — alerte overflow |
| **Répartition exacte** | Primaire | 500 @ L1 + 100 @ L2 uniquement |
| **LOT-2025-002** | Secondaire | Traçabilité lot sur le split |

### Ce que vous devez faire

1. **Vérifier REC-01** — 600 u. SKU-002 · GR-M2-002 POSTED.
2. **PUTAWAY #1** — 500 u. REC-01 → **B-01-R1-L1** (LOT-2025-002).
3. **PUTAWAY #2** — 100 u. REC-01 → **B-01-R1-L2** (LOT-2025-002).
4. **STOCK_ACCURACY → COMPLIANCE_ADV** — Compléter le parcours capacité.

### Ce que vous devez vérifier

- Ne pas forcer **600 u. dans un bin max 500**.
- Ne pas inventer un autre bin « alternatif » : seul **B-01-R1-L2** est accepté pour les 100 u.
- Conserver **LOT-2025-002** ; ranger **toutes** les 600 u.
- Ne pas démarrer un FIFO_PICK : hors contrat SCN-007.

### Pièges pédagogiques

- **Capacité = contrainte hard :** le système alerte ou refuse — comportement intentionnel.
- **Split ≠ deux réceptions :** un seul GR, deux mouvements putaway canoniques.
- **FIFO est enseigné en SCN-008**, pas ici.

<div class="page-break"></div>

\newpage

## SCN-008 — Application FIFO multi-lots

**Rôle simulé :** Spécialiste FIFO — prélèvement conforme traçabilité lots
**Enjeu :** 3 lots SKU-003 préchargés en STOCKAGE — prélever **LOT-A (janvier)** avant LOT-B et LOT-C.
**Piège pédagogique :** tenter un **PUTAWAY** (déjà fait) ou prélever **LOT-C (mars)** en premier.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | LOT-A (jan, B-01-R1-L1) · LOT-B (fév, B-01-R1-L2) · LOT-C (mars, B-02-R1-L1) |
| Bannière emptyStockNote | « Stock préchargé — démarrage direct au prélèvement FIFO » |
| Cockpit dates réception | LOT-A plus ancien → priorité FIFO |
| Moniteur | GR multi-bins déjà POSTED — pas de putaway requis |
| Étape FIFO_PICK | Lot oldest first |

### KPI / données à lire

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **Dates réception lots** | Primaire | Jan < Fév < Mars → ordre FIFO |
| **LOT-A-2025** | Primaire | Lot le plus ancien — à prélever en premier |
| **Emplacements B-01-R1-L1 / L2 / B-02-R1-L1** | Secondaire | Localisation par lot |
| **Statut PUTAWAY** | Secondaire | Auto-complété — ne pas refaire |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| Observation | `LOT-A`, `LOT-B`, `LOT-C`, `FIFO`, `date réception`, `STOCKAGE`, `préchargé` | Confirmation ordre lots |
| Action | `FIFO_PICK`, `lot le plus ancien`, `janvier`, `traçabilité`, `pas de putaway` | Prélèvement |
| Conformité | `violation FIFO`, `conformité client`, `FEFO`, `obsolescence` | Validation |
| Suite M2 | `STOCK_ACCURACY`, `COMPLIANCE_ADV` | Pipeline |

**Mots à éviter :** `PUTAWAY` (déjà complété), `LOT-C en premier`, `mélanger lots`, `overflow`, `GR fantôme`, `Min/Max`.

### Structure de réponse

1. **Observer stock préchargé** — 3 lots SKU-003 en STOCKAGE ; putaway auto-complété.
2. **Valider ordre FIFO** — LOT-A (jan) → LOT-B (fév) → LOT-C (mars).
3. **FIFO_PICK** — Prélever lot le plus ancien (LOT-A).
4. **STOCK_ACCURACY → COMPLIANCE_ADV** — Compléter M2.

### Erreurs fréquentes

- Tenter **PUTAWAY** alors que stock déjà rangé.
- Prélever **LOT-C ou LOT-B** avant LOT-A.
- Mélanger deux lots dans un même mouvement.
- Confondre avec SCN-006 (putaway requis).

### Pièges pédagogiques

- **Empty stock note inversée :** stock visible dès l'ouverture — normal SCN-008.
- **FIFO = conformité réglementaire :** alimentaire/pharma — pas seulement convention.
- **Violation FIFO = échec conformité** — pénalité directe en évaluation.

<div class="page-break"></div>

\newpage

# MODULE 3 — Contrôle des stocks et réapprovisionnement

> Vous **réconciliez** l’inventaire (SCN-009/010) et/ou **planifiez** le réapprovisionnement Min/Max (SCN-011).
> **SCN-009/010 :** `CC_LIST → CC_COUNT → CC_RECON → REPLENISH → COMPLIANCE_M3`.
> **SCN-011 :** `REPLENISH → COMPLIANCE_M3` uniquement.
> **Seuil 70/100** · validation enseignant requise avant M4.

<div class="page-break"></div>

\newpage

## SCN-009 — Inventaire cyclique simple

**Rôle simulé :** Auditeur inventaire (Inventory Auditor) — détection d'écart système/physique
**Enjeu :** SKU-001 (100 u. système → 97 physique) et SKU-003 (80 / 80) — **écart −3 sur SKU-001**.
**Piège pédagogique :** ignorer l'écart −3 ou clôturer **sans ajustement** dans CC_RECON.

### Ce que vous observez

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | B-01-R1-L1 (SKU-001) · B-01-R1-L2 (SKU-003) |
| Tour de contrôle M3 | Détecter −3, poster l’ajustement, clôturer |
| Étape CC_LIST | SKU à compter |
| Étape CC_COUNT | Saisir quantités physiques réelles |
| Étape CC_RECON | Ajustement pour l’écart −3 ; confirmation écart nul SKU-003 |

### Ce que vous devez comprendre

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **Stock système SKU-001 (100)** | Primaire | Référence comptage |
| **Stock système SKU-003 (80)** | Secondaire | Pas d'écart attendu |
| **Quantité physique SKU-001 (97)** | Primaire | Écart −3 |
| **Ligne d’ajustement au moniteur** | Primaire | Preuve de correction postée |

### Ce que vous devez faire

1. **CC_LIST** — Identifier SKU-001 et SKU-003.
2. **CC_COUNT** — Saisir les quantités physiques (97 et 80).
3. **CC_RECON** — Soumettre **une** réconciliation cohérente : ajuster SKU-001 (−3) ; confirmer SKU-003 (écart 0).
4. **REPLENISH** — Non requis ici ; poursuivre vers COMPLIANCE_M3.
5. **COMPLIANCE_M3** — Conformité verte.

### Ce que vous devez vérifier

- Soumettre **une** réconciliation cohérente par cible ; **ne pas répéter** l’ajustement pour le même écart.
- Ne pas créer **plusieurs corrections** pour la même variance.
- Vérifier le résultat posté au moniteur **avant** de continuer.
- Ne pas saisir −3 comme quantité physique (saisir **97**).

### Pièges pédagogiques

- **Écart intentionnel −3 :** ne pas « corriger » le comptage à 100.
- **Une correction suffit :** une fois l’écart traité et visible, ne pas resoumettre la même correction.
- **Focus inventaire :** le réappro n’est pas l’enjeu de SCN-009.

<div class="page-break"></div>

\newpage

## SCN-010 — Écart significatif et justification

**Rôle simulé :** Gestionnaire inventaire — variance management avec piste d'audit
**Enjeu :** SKU-006 : système **380 u.**, physique **352 u.** — écart **−28 > seuil 20 u.** — justification obligatoire.
**Piège pédagogique :** ajuster **sans justification écrite** ou passer conformité **sans ADJ**.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | B-02-R1-L1 · SKU-006 · seuil ajustement 20 u. |
| Tour de contrôle M3 | Écart −28 > seuil — justification avant ADJ |
| Cockpit | Stock système 380 u. avant comptage |
| Étape CC_COUNT | Saisir **352 u.** (physique) |
| Étape CC_RECON | Justifier cause + poster ADJ (MI07) |

### KPI / données à lire

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **Stock système (380 u.)** | Primaire | Référence |
| **Quantité physique (352 u.)** | Primaire | Saisie CC_COUNT |
| **Variance (−28)** | Primaire | > seuil 20 → justification requise |
| **Historique PO/SO/GI** | Secondaire | Contexte audit trail |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| Analyse | `380 u.`, `352 u.`, `écart`, `−28`, `seuil`, `20 u.`, `significatif` | CC_RECON |
| Justification | `cause`, `justification`, `audit trail`, `piste d'audit`, `analyse`, `documenter` | Commentaire ADJ |
| Ajustement | `MI07`, `ADJ`, `ajustement inventaire`, `réconciliation`, `variance` | Post ADJ |
| Conformité | `COMPLIANCE_M3`, `conformité verte`, `écart résolu` | Clôture |

**Mots à éviter :** `ajustement sans justification`, `ignorer seuil`, `−28` comme qty physique, `Min/Max`, `FIFO`, `GR fantôme`.

### Structure de réponse

1. **CC_LIST** — Cibler SKU-006 / B-02-R1-L1.
2. **CC_COUNT** — Saisir 352 u. (physique) vs 380 u. (système).
3. **CC_RECON** — Documenter cause de l'écart −28 ; poster ADJ (MI07).
4. **REPLENISH** — Si requis ; sinon COMPLIANCE_M3.
5. **COMPLIANCE_M3** — Conformité verte.

### Erreurs fréquentes

- ADJ **sans justification** — audit trail incomplet.
- Ignorer écart **> seuil 20 u.**
- Passer COMPLIANCE_M3 sans résoudre l'écart.
- Copier logique SCN-009 sans justification (écart plus large ici).

### Pièges pédagogiques

- **Seuil interne 20 u. :** écart −28 exige analyse documentée — pas optionnel.
- **Continuité M1 SCN-004 :** même discipline MI01/MI07, exigence justification renforcée.
- **Précurseur SCN-016 M5 :** corriger avant de piloter — principe transversal TEC.WMS.

<div class="page-break"></div>

\newpage

## SCN-011 — Réapprovisionnement Min/Max (capstone M3)

**Rôle simulé :** Planificateur approvisionnement (Supply Planner) — recommandations REPLENISH
**Enjeu :** SKU-004 (**30 u.** < Min 50) et SKU-005 (**40 u.** < Min 80) — calculer **Q = Max − stock actuel**.
**Piège pédagogique :** **sous-réapprovisionner** ou utiliser la mauvaise formule.

> **Contrat de production :** parcours **REPLENISH → COMPLIANCE_M3** uniquement.
> **Pas** de CC_LIST / CC_COUNT / CC_RECON / ADJ sur les nouveaux runs SCN-011.

### Ce que vous observez

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | Min/Max/SS par SKU dès l'ouverture |
| Tour de contrôle M3 | SKUs sous Min — focus REPLENISH |
| Cockpit | SKU-004 : 30 (Min 50, Max 200, SS 25) · SKU-005 : 40 (Min 80, Max 300, SS 30) |
| Étapes actives | **REPLENISH** puis **COMPLIANCE_M3** |

### Ce que vous devez comprendre

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **Stock actuel SKU-004 (30)** | Primaire | Sous Min 50 (proche SS 25) |
| **Stock actuel SKU-005 (40)** | Primaire | Sous Min 80 |
| **Min / Max / SS** | Primaire | Paramètres de calcul |
| **Q = Max − stock** | Primaire | SKU-004 : **170** · SKU-005 : **260** |

### Ce que vous devez faire

1. **Comparer les seuils** — Min (50/80) · Max (200/300) · SS (25/30).
2. **REPLENISH** — Proposer Q = Max − stock : **170** (SKU-004) et **260** (SKU-005).
3. **COMPLIANCE_M3** — Valider les recommandations.

### Ce que vous devez vérifier

- Formule **Q = Max − stock** (pas Min − stock).
- Traiter **les deux SKU**.
- Ne pas chercher un pipeline de cycle count : hors contrat SCN-011.
- Nommer Min et SS dans l’analyse d’urgence (SKU-004 à 30 avec SS 25).

### Pièges pédagogiques

- **Capstone M3 planification :** distinct des scénarios de comptage 009/010.
- **SS vs Min :** urgence élevée sur SKU-004 — nommer les deux seuils.
- **Validation enseignant** avant M4 reste le gate pédagogique de cohorte.

<div class="page-break"></div>

\newpage

## Tableau récapitulatif — Données opérationnelles clés

| SCN | SKU(s) | Donnée critique | Action clé | Seuil |
|-----|--------|-----------------|------------|-------|
| SCN-001 | SKU-001 | Entrepôt vide → 100 u. | Flux PO→GR→Putaway→GI→CC | 60/100 |
| SCN-002 | SKU-001 | GR-2025-001 PENDING | Poster MIGO (pas nouvelle GR) | 60/100 |
| SCN-003 | SKU-003 | 50 u. quai · SO ~80 u. | Putaway + réappro avant GI | 60/100 |
| SCN-004 | SKU-006 | Écart −15 (audit après putaway) | CC qty physique + ADJ · **pas SO/GI** | 60/100 |
| SCN-005 | SKU-004/005 | GR-2025-004 + écart −8 | Docs → putaway → inventaire · **pas expédition** | 60/100 |
| SCN-006 | SKU-001 | 150 u. REC-01 | PUTAWAY → STOCKAGE | 60/100 |
| SCN-007 | SKU-002 | 600 u. · max 500 | **500 @ L1 + 100 @ L2** exact | 60/100 |
| SCN-008 | SKU-003 | 3 lots FIFO | FIFO_PICK lot oldest (LOT-A) | 60/100 |
| SCN-009 | SKU-001/003 | Écart −3 SKU-001 | CC_RECON + 1 ajustement cohérent | 70/100 |
| SCN-010 | SKU-006 | Écart −28 > seuil 20 | Justification + ADJ | 70/100 |
| SCN-011 | SKU-004/005 | Sous Min | **REPLENISH only** · Q=170/260 | 70/100 |

---

## Progression pédagogique

```text
MODULE 1 — Exécuter (cycle ERP/WMS complet)
  SCN-001  Cycle nominal           → séquence PO→GR→Putaway→GI→CC
  SCN-002  GR fantôme              → poster document existant
  SCN-003  Stock insuffisant       → putaway + réappro avant GI
  SCN-004  Écart inventaire        → audit après putaway + ADJ
  SCN-005  Capstone M1             → docs → putaway → inventaire

MODULE 2 — Entrepôt (GR pré-postée, règles emplacement/lots)
  SCN-006  Putaway structuré       → REC-01 → STOCKAGE
  SCN-007  Capacité overflow       → 500@L1 + 100@L2 exact
  SCN-008  FIFO multi-lots         → lot oldest first, pas de putaway

MODULE 3 — Inventaire et réappro (seuil 70/100)
  SCN-009  Comptage cyclique       → écart −3 + 1 ajustement
  SCN-010  Variance significative  → justification + ADJ
  SCN-011  Capstone M3             → REPLENISH only · Q=170/260
```

| Transition | Ce qui change |
|------------|---------------|
| M1 → M2 | Cycle complet → GR pré-chargée ; focus putaway/capacité/FIFO |
| M2 → M3 | Exécution mouvements → réconciliation inventaire + planification |
| M3 → M4 | Transactions → interprétation KPI ; moniteur vide = normal en M4 |
| SCN-004 → SCN-009/010 | Même MI01/MI07 ; M3 ajoute pipeline CC et seuils |
| SCN-005 → SCN-011 | Résolution crise → planification proactive Min/Max |

**En résumé :** en Modules 1–3 vous **exécutez** et **prouvez** par le moniteur et le cockpit ; chaque scénario ajoute une contrainte métier (document, stock, capacité, lot, écart, réappro) jusqu'au capstone M3.

<div class="page-break"></div>

\newpage

<div class="checklist-page">

# Checklist finale avant soumission

Avant de soumettre votre réponse dans le simulateur, parcourez cette liste. Cochez mentalement chaque point — ou imprimez cette page pour vos révisions.

| | **Étape de préparation** | **Ce que vous devez avoir fait** |
|---|--------------------------|----------------------------------|
| ☐ | **Lire les slides** | Parcourir le contenu pédagogique du module et du scénario en cours |
| ☐ | **Lire la Fiche Mission** | Identifier le rôle simulé, l'enjeu métier et les contraintes du scénario |
| ☐ | **Observer le moniteur** | Vérifier statuts POSTED/PENDING et transactions créées |
| ☐ | **Lire le cockpit** | Confirmer stocks, emplacements, capacités, lots ou seuils Min/Max |
| ☐ | **Identifier les bloqueurs** | GR fantôme, stock insuffisant, overflow, FIFO, écart ou sous-Min |
| ☐ | **Respecter la séquence** | Compléter chaque étape dans l'ordre requis avant conformité |
| ☐ | **Vérifier la cohérence avant soumission** | Conformité verte ; pas de PENDING, stock négatif ou écart ouvert |

---

### Rappel par module

**Module 1 —** Flux opérationnel PO→GR→Putaway ; SCN-004/005 = **audit inventaire** (CC→[ADJ]→Conformité) **sans** SO/picking/GI. Seuil 60/100. SCN-001 à SCN-005 requis pour **Silver**. Ordre Documents → Physique → Inventaire en crise (SCN-005).

**Module 2 —** GR pré-postée (sauf SCN-008). PUTAWAY obligatoire si stock au quai. SCN-007 = split **exact** 500@L1 + 100@L2. FIFO = lot oldest first (SCN-008 uniquement).

**Module 3 —** Seuil **70/100**. SCN-009/010 : ADJ si écart. SCN-010 : justification si écart > 20 u. **SCN-011 : REPLENISH → COMPLIANCE uniquement** (Q = Max − stock). Validation enseignant avant M4.

---

### Question finale

*« Ma séquence est-elle complète, mes documents postés, mes écarts résolus et ma conformité cohérente avec le scénario et le module ? »*

</div>

<div class="doc-footer">Collège de la Concorde · TEC.WMS · Simulateur pédagogique ERP/WMS · juillet 2026 · Guidance pédagogique uniquement</div>
