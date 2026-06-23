---
title: "TEC.WMS — Guide de Préparation Modules M1, M2 et M3"
author: "Collège de la Concorde"
date: "juin 2026"
lang: fr-CA
geometry: margin=2.5cm
toc: false
header-includes:
  - \usepackage{fancyhdr}
  - \usepackage{setspace}
  - \pagestyle{fancy}
  - \fancyhead[L]{\small TEC.WMS — Guide étudiant M1/M2/M3}
  - \fancyhead[R]{\small Collège de la Concorde}
  - \fancyfoot[C]{\small Collège de la Concorde · Simulateur pédagogique ERP/WMS · juin 2026}
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
      content: "Collège de la Concorde · TEC.WMS · Simulateur pédagogique ERP/WMS · juin 2026";
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
Version juin 2026 · Document étudiant

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

<div class="doc-footer">Collège de la Concorde · TEC.WMS · Simulateur pédagogique ERP/WMS · juin 2026</div>

---

## Présentation du guide

**Programme :** TEC.LOG — Simulation WMS intégrée  
**Public :** étudiants en préparation à l'évaluation  
**Scénarios couverts :** SCN-001 à SCN-011  
**Seuils de réussite :** M1 et M2 ≥ 60/100 · M3 ≥ 70/100  
**Version :** juin 2026

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

**Contrat M2 :** GR pré-chargée et postée — démarrage au PUTAWAY (sauf SCN-008 : stock pré-chargé en STOCKAGE, démarrage au FIFO_PICK).

**Contrat M3 :** stock pré-chargé — pipeline CC_LIST → CC_COUNT → CC_RECON → REPLENISH → COMPLIANCE_M3.

---

## Trois paradigmes à distinguer

| | **Module 1 — Fondements** | **Module 2 — Entrepôt** | **Module 3 — Inventaire** |
|---|---------------------------|-------------------------|---------------------------|
| **Activité** | Cycle ERP/WMS complet de bout en bout | Rangement, capacité, FIFO | Comptage, écarts, réappro |
| **Moniteur** | Chaque transaction que vous créez | GR pré-postée + vos mouvements | Historique + ajustements ADJ |
| **Source de preuve** | Moniteur + cockpit stock | Cockpit emplacements + capacité | Quantités système vs physique |
| **Parcours** | PO → GR → Putaway → SO → GI → CC → [ADJ] → Conformité | PUTAWAY → FIFO_PICK → STOCK_ACCURACY → COMPLIANCE_ADV | CC_LIST → CC_COUNT → CC_RECON → REPLENISH → COMPLIANCE_M3 |
| **Niveau décision** | Exécution séquentielle (M1) | Règles d'emplacement et lots (M2) | Réconciliation et planification (M3) |
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

**Rôle simulé :** Auditeur d'inventaire — réconciliation physique/système  
**Enjeu :** 200 u. SKU-006 reçues ; après expédition partielle, comptage physique révèle **écart −15 u.**  
**Piège pédagogique :** saisir la **variance (−15)** au lieu de la **quantité physique réelle (185 u.)** au comptage.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | SKU-006 · 200 u. · écart −15 intentionnel |
| Cockpit B-02-R1-L1 | Stock système après putaway et expédition |
| Étape CC (MI01) | Saisir quantité **physique comptée**, pas la variance |
| Étape ADJ (MI07) | Apparaît si variance ≠ 0 — correction obligatoire |
| Moniteur | Trace PO → GR → putaway → SO → GI avant comptage |

### KPI / données à lire

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **Stock système (200 u. initiales)** | Primaire | Référence avant comptage |
| **Quantité physique saisie** | Primaire | Valeur réelle comptée (ex. 185 si système affiche 200) |
| **Variance (−15)** | Primaire | Calculée système — à corriger via ADJ |
| **Statut conformité** | Secondaire | Bloquée si écart non résolu |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| Flux amont | `PUTAWAY`, `B-02-R1-L1`, `SO`, `GI`, `SKU-006`, `200 u.` | Avant comptage : cycle standard |
| Comptage | `MI01`, `comptage cyclique`, `quantité physique`, `stock système`, `écart` | CC : saisir qty réelle comptée |
| Ajustement | `MI07`, `ADJ`, `ajustement inventaire`, `−15`, `variance`, `réconciliation` | ADJ : corriger l'écart |
| Justification | `écart physique`, `intégrité`, `audit`, `conformité` | Commentaire ADJ |
| Conformité | `écart résolu`, `conformité verte`, `UNRESOLVED_VARIANCE` | Clôture |

**Mots à éviter :** saisir `−15` comme quantité physique, `ignorer écart`, `conformité sans ADJ`, `GR fantôme`, `FIFO`, `capacité`.

### Structure de réponse

1. **PUTAWAY** — REC-01 → B-02-R1-L1 (200 u. SKU-006).
2. **SO → PICKING → GI** — Flux expédition standard.
3. **CC (MI01)** — Saisir quantité physique réelle (ex. 185).
4. **ADJ (MI07)** — Corriger écart −15 ; poster ajustement.
5. **COMPLIANCE** — Conformité au vert.

### Erreurs fréquentes

- Saisir **−15** au comptage au lieu de **185** (qty physique).
- Passer à conformité **sans ADJ** — UNRESOLVED_VARIANCE.
- Oublier le flux expédition avant le comptage.
- Traiter l'écart comme optionnel — bloqueur en évaluation.

### Pièges pédagogiques

- **physicalQty ≠ variance :** le comptage enregistre ce qui est compté, pas l'écart calculé.
- **ADJ dynamique :** l'étape MI07 s'insère automatiquement si variance détectée.
- **Précurseur M3 :** même discipline que SCN-009/010 en Module 3.

<div class="page-break"></div>

\newpage

## SCN-005 — Non-conformités multiples (capstone M1)

**Rôle simulé :** Superviseur logistique — résolution de non-conformités multiples  
**Enjeu :** Deux anomalies simultanées : **GR-2025-004 non postée** (SKU-004) + **écart SKU-005 (−8 u.)**.  
**Piège pédagogique :** mauvais **ordre de résolution** — putaway SKU-004 avant post GR, ou expédition avant correction inventaire.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | Ordre : Documents → Physique → Expédition |
| Moniteur | GR-2025-004 PENDING (SKU-004) ; PO/GR SKU-005 POSTED |
| Cockpit REC-01 / REC-02 | SKU-004 bloqué par GR fantôme ; SKU-005 au quai |
| Étape CC + ADJ | Écart −8 sur SKU-005 au comptage |
| COMPLIANCE | Vert seulement si **tous** bloqueurs levés |

### KPI / données à lire

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **GR-2025-004 PENDING** | Primaire | Bloqueur documentaire — priorité 1 |
| **Stock SKU-004 / SKU-005** | Primaire | Deux SKU, deux quais — traçabilité distincte |
| **Variance SKU-005 (−8)** | Primaire | Écart inventaire — ADJ obligatoire |
| **Conformité globale** | Primaire | 100 % requis — capstone M1 |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| Priorisation | `ordre`, `documents`, `physique`, `expédition`, `GR fantôme`, `GR-2025-004`, `priorité` | Plan d'action initial |
| Correction doc | `MIGO`, `poster`, `SKU-004`, `REC-01`, `30 u.` | Étape 1 : post GR-004 |
| Putaway | `PUTAWAY`, `SKU-004`, `SKU-005`, `REC-01`, `REC-02`, `STOCKAGE` | Étape 2 : rangement les deux SKU |
| Expédition | `SO`, `picking`, `GI`, `multi-SKU` | Étape 3 : expédition |
| Inventaire | `MI01`, `MI07`, `SKU-005`, `−8`, `écart`, `quantité physique` | Étape 4-5 : CC + ADJ |
| Conformité | `100 %`, `multi-anomalie`, `crise logistique`, `conformité` | Clôture capstone |

**Mots à éviter :** `nouvelle GR SKU-004`, putaway avant post GR-004, `ignorer SKU-005`, `une seule anomalie`, vocabulaire M2/M3 (`FIFO`, `Min/Max`, `overflow`).

### Structure de réponse

1. **Poster GR-2025-004** — MIGO · SKU-004 · 30 u. · REC-01.
2. **PUTAWAY** — SKU-004 (REC-01 → STOCKAGE) et SKU-005 (REC-02 → STOCKAGE).
3. **SO → PICKING → GI** — Expédition pour les deux SKU.
4. **CC SKU-005** — Saisir quantité physique réelle (système − 8).
5. **ADJ (MI07)** — Corriger écart SKU-005 ; **COMPLIANCE** au vert.

### Erreurs fréquentes

- **Putaway SKU-004 avant post GR-2025-004** — non-conformité persistante.
- Créer nouvelle GR pour SKU-004 au lieu de poster GR-2025-004.
- Traiter SKU-005 sans ADJ pour l'écart −8.
- Ignorer l'ordre Documents → Physique → Expédition.

### Pièges pédagogiques

- **Capstone M1 :** combine SCN-002 (fantôme) + SCN-004 (écart) — compétences cumulatives.
- **Ordre strict :** poster GR fantôme **avant** tout rangement SKU-004.
- **Score bloqué ~60 %** sans COMPLIANCE_OK — la conformité est le gate final Silver.

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
**Enjeu :** 600 u. SKU-002 reçues ; bin B-01-R1-L1 **max 500 u.** — répartir sans dépassement.  
**Piège pédagogique :** **forcer 600 u. dans un seul bin** malgré l'alerte capacité.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | 600 u. · B-01-R1-L1 max 500 · LOT-2025-002 |
| Cockpit capacité | Message dépassement si 600 u. vers B-01-R1-L1 |
| Moniteur | GR-M2-002 POSTED · 600 u. REC-01 |
| Split putaway | B-01-R1-L1 (500 u.) + bin STOCKAGE secondaire (100 u.) |
| Traçabilité lot | LOT-2025-002 conservé sur les deux mouvements |

### KPI / données à lire

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **600 u. au quai** | Primaire | Quantité totale à placer |
| **Capacité B-01-R1-L1 (500)** | Primaire | Limite hard — alerte overflow |
| **Répartition multi-bins** | Primaire | 500 + 100 (ou équivalent) sans overflow |
| **LOT-2025-002** | Secondaire | Traçabilité lot sur split |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| Diagnostic | `capacité`, `500 u.`, `600 u.`, `overflow`, `dépassement`, `B-01-R1-L1`, `alerte` | Identification contrainte |
| Solution | `répartir`, `split`, `bin secondaire`, `STOCKAGE`, `LOT-2025-002`, `traçabilité` | Putaway split |
| Validation | `aucun overflow`, `capacité max`, `toutes unités rangées` | Conformité |
| Suite M2 | `FIFO_PICK`, `STOCK_ACCURACY`, `COMPLIANCE_ADV` | Pipeline |

**Mots à éviter :** `forcer`, `ignorer alerte`, `single-bin`, `600 dans B-01-R1-L1`, `GR fantôme`, `FIFO violation`.

### Structure de réponse

1. **Vérifier REC-01** — 600 u. SKU-002 · GR-M2-002 POSTED.
2. **Tester capacité** — Observer alerte si PUTAWAY 600 u. → B-01-R1-L1.
3. **Split PUTAWAY** — 500 u. B-01-R1-L1 + 100 u. bin STOCKAGE alternatif.
4. **FIFO_PICK → STOCK_ACCURACY → COMPLIANCE_ADV** — Compléter M2.

### Erreurs fréquentes

- Forcer **600 u. dans un bin max 500**.
- Ignorer message de dépassement capacité.
- Perdre traçabilité **LOT-2025-002** lors du split.
- Oublier de ranger **toutes** les unités (600 total).

### Pièges pédagogiques

- **Capacité = contrainte hard :** le système alerte ou refuse — comportement pédagogique intentionnel.
- **Split ≠ deux réceptions :** un seul GR, plusieurs mouvements putaway.
- **Précurseur e-commerce :** saturation slots en haute rotation.

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

> Vous **réconciliez** inventaire et **planifiez** le réapprovisionnement. Stock pré-chargé — pipeline CC_LIST → CC_COUNT → CC_RECON → REPLENISH → COMPLIANCE_M3. **Seuil 70/100** · validation enseignant requise avant M4.

<div class="page-break"></div>

\newpage

## SCN-009 — Inventaire cyclique simple

**Rôle simulé :** Auditeur inventaire (Inventory Auditor) — détection d'écart système/physique  
**Enjeu :** SKU-001 (100 u. système) et SKU-003 (80 u.) — comptage révèle **écart −3 sur SKU-001**.  
**Piège pédagogique :** ignorer l'écart −3 ou clôturer **sans ADJ (MI07)** dans CC_RECON.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | B-01-R1-L1 (SKU-001) · B-01-R1-L2 (SKU-003) |
| Tour de contrôle M3 | Focus : détecter −3, poster ADJ, clôturer |
| Étape CC_LIST | SKU à compter |
| Étape CC_COUNT | Saisir quantités physiques réelles |
| Étape CC_RECON | ADJ (MI07) obligatoire pour écart −3 |

### KPI / données à lire

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **Stock système SKU-001 (100)** | Primaire | Référence comptage |
| **Stock système SKU-003 (80)** | Secondaire | Pas d'écart attendu |
| **Quantité physique SKU-001 (97)** | Primaire | 100 − 3 = écart −3 |
| **Ligne ADJ au moniteur** | Primaire | Preuve ajustement posté |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| CC_LIST | `liste comptage`, `SKU-001`, `SKU-003`, `B-01-R1-L1`, `B-01-R1-L2` | Identification |
| CC_COUNT | `MI01`, `quantité physique`, `comptage cyclique`, `stock système` | Saisie |
| CC_RECON | `écart`, `−3`, `variance`, `réconciliation`, `MI07`, `ADJ` | Correction |
| Conformité | `COMPLIANCE_M3`, `écart résolu`, `inventaire cyclique` | Clôture |
| REPLENISH | `non requis`, `auto-validé` | Passer à conformité |

**Mots à éviter :** `ignorer écart`, `conformité sans ADJ`, `quantité −3` comme saisie physique, `Min/Max` (SCN-011), `justification longue` (seuil 20 u. — SCN-010).

### Structure de réponse

1. **CC_LIST** — Identifier SKU-001 et SKU-003 à compter.
2. **CC_COUNT** — Saisir quantités physiques (SKU-001 ≠ 100 ; SKU-003 = 80).
3. **CC_RECON** — Analyser écart −3 ; poster ADJ (MI07) sur SKU-001.
4. **REPLENISH** — Auto-validé ; passer à COMPLIANCE_M3.
5. **COMPLIANCE_M3** — Conformité verte.

### Erreurs fréquentes

- Ignorer écart −3 à la réconciliation.
- Clôturer sans **ADJ posté** dans CC_RECON.
- Saisir variance au lieu de quantité physique au CC_COUNT.
- Confondre avec SCN-010 (justification seuil 20 u.).

### Pièges pédagogiques

- **Écart intentionnel −3 :** comportement pédagogique — ne pas arrondir à 100.
- **ADJ visible au moniteur :** preuve opérationnelle requise avant COMPLIANCE_M3.
- **REPLENISH auto-validé SCN-009 :** focus inventaire, pas réappro.

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
**Piège pédagogique :** **sous-réapprovisionner** ou ignorer **stock de sécurité (SS)** dans l'analyse d'urgence.

### Où porter son attention

| Zone simulateur | Élément à repérer |
|-----------------|-------------------|
| Fiche Mission | Min/Max/SS par SKU dès l'ouverture |
| Tour de contrôle M3 | SKUs sous Min — focus REPLENISH |
| Cockpit | SKU-004 : 30 (Min 50, Max 200, SS 25) · SKU-005 : 40 (Min 80, Max 300, SS 30) |
| Étape REPLENISH | Q = Max − stock pour chaque SKU |
| Pipeline CC | CC confirmatoire puis REPLENISH |

### KPI / données à lire

| Donnée | Priorité | Lecture attendue |
|--------|----------|------------------|
| **Stock actuel SKU-004 (30)** | Primaire | Sous Min 50 et proche SS 25 |
| **Stock actuel SKU-005 (40)** | Primaire | Sous Min 80 |
| **Min / Max / SS** | Primaire | Paramètres de calcul |
| **Q = Max − stock** | Primaire | SKU-004 : 200−30=170 · SKU-005 : 300−40=260 |

### Mots-clés — où et comment les utiliser

| Étape | Mots à privilégier | Où les placer |
|-------|-------------------|---------------|
| Diagnostic | `sous seuil`, `Min`, `Max`, `SS`, `stock de sécurité`, `SKU-004`, `SKU-005`, `rupture` | Analyse niveaux |
| Calcul | `Q = Max − stock`, `réapprovisionnement`, `170 u.`, `260 u.`, `Min-Max`, `besoin` | REPLENISH |
| Paramètres | `lead time`, `MD04`, `reorder point`, `ROP` | Contexte planification |
| Conformité | `COMPLIANCE_M3`, `recommandations`, `seuils respectés` | Clôture capstone M3 |

**Mots à éviter :** `réappro partiel`, `ignorer SS`, `Q = Min − stock` (formule incorrecte), `GR fantôme`, `FIFO`, `overflow`, vocabulaire KPI M4 (`rotation`, `OTIF`).

### Structure de réponse

1. **CC pipeline** — Confirmer niveaux SKU-004 (30) et SKU-005 (40).
2. **Comparer seuils** — Min (50/80) · Max (200/300) · SS (25/30).
3. **REPLENISH** — Proposer Q = Max − stock : 170 u. SKU-004 · 260 u. SKU-005.
4. **COMPLIANCE_M3** — Valider recommandations conformes.

### Erreurs fréquentes

- Calcul **Q = Min − stock** au lieu de **Max − stock**.
- Sous-réapprovisionner (quantité inférieure au besoin calculé).
- Ignorer **stock de sécurité** dans l'analyse d'urgence.
- Oublier l'un des **deux SKU** — les deux sont sous Min.

### Pièges pédagogiques

- **Capstone M3 :** combine inventaire (SCN-009/010) + planification — validation enseignant avant M4.
- **SS vs Min :** SKU-004 à 30 u. avec SS 25 — urgence élevée ; nommer les deux seuils.
- **Formule Min-Max évaluée :** Q = Stock max − Stock actuel — pas de raccourci arbitraire.

<div class="page-break"></div>

\newpage

## Tableau récapitulatif — Données opérationnelles clés

| SCN | SKU(s) | Donnée critique | Action clé | Seuil |
|-----|--------|-----------------|------------|-------|
| SCN-001 | SKU-001 | Entrepôt vide → 100 u. | Flux PO→GR→Putaway→GI→CC | 60/100 |
| SCN-002 | SKU-001 | GR-2025-001 PENDING | Poster MIGO (pas nouvelle GR) | 60/100 |
| SCN-003 | SKU-003 | 50 u. quai · SO ~80 u. | Putaway + réappro avant GI | 60/100 |
| SCN-004 | SKU-006 | Écart −15 | CC qty physique + ADJ MI07 | 60/100 |
| SCN-005 | SKU-004/005 | GR-2025-004 + écart −8 | Ordre : docs → physique → expédition | 60/100 |
| SCN-006 | SKU-001 | 150 u. REC-01 | PUTAWAY → STOCKAGE | 60/100 |
| SCN-007 | SKU-002 | 600 u. · max 500/bin | Split putaway sans overflow | 60/100 |
| SCN-008 | SKU-003 | 3 lots FIFO | FIFO_PICK lot oldest (LOT-A) | 60/100 |
| SCN-009 | SKU-001/003 | Écart −3 SKU-001 | CC_RECON + ADJ MI07 | 70/100 |
| SCN-010 | SKU-006 | Écart −28 > seuil 20 | Justification + ADJ MI07 | 70/100 |
| SCN-011 | SKU-004/005 | Sous Min | REPLENISH Q = Max − stock | 70/100 |

---

## Progression pédagogique

```text
MODULE 1 — Exécuter (cycle ERP/WMS complet)
  SCN-001  Cycle nominal           → séquence PO→GR→Putaway→GI→CC
  SCN-002  GR fantôme              → poster document existant
  SCN-003  Stock insuffisant       → putaway + réappro avant GI
  SCN-004  Écart inventaire        → qty physique + ADJ
  SCN-005  Capstone M1             → multi-anomalie, ordre strict

MODULE 2 — Entrepôt (GR pré-postée, règles emplacement/lots)
  SCN-006  Putaway structuré       → REC-01 → STOCKAGE
  SCN-007  Capacité overflow       → split multi-bins
  SCN-008  FIFO multi-lots         → lot oldest first, pas de putaway

MODULE 3 — Inventaire et réappro (seuil 70/100)
  SCN-009  Comptage cyclique       → écart −3 + ADJ
  SCN-010  Variance significative  → justification + ADJ
  SCN-011  Capstone M3             → Min/Max Q = Max − stock
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

**Module 1 —** Cycle complet PO→GR→Putaway→SO→GI→CC→[ADJ]→Conformité. Seuil 60/100. SCN-001 à SCN-005 requis pour **Silver**. Ordre Documents → Physique → Expédition en crise (SCN-005).

**Module 2 —** GR pré-postée (sauf SCN-008). PUTAWAY obligatoire si stock au quai. Capacité max = contrainte hard (SCN-007). FIFO = lot oldest first (SCN-008).

**Module 3 —** Seuil **70/100**. ADJ (MI07) obligatoire si écart. SCN-010 : justification si écart > 20 u. SCN-011 : Q = Max − stock. Validation enseignant avant M4.

---

### Question finale

*« Ma séquence est-elle complète, mes documents postés, mes écarts résolus et ma conformité cohérente avec le scénario et le module ? »*

</div>

<div class="doc-footer">Collège de la Concorde · TEC.WMS · Simulateur pédagogique ERP/WMS · juin 2026 · Guidance pédagogique uniquement</div>
