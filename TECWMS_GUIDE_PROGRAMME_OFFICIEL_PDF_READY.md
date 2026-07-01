---
title: "TEC.WMS — Guide officiel du programme"
author: "Collège de la Concorde"
date: "juin 2026"
lang: fr-CA
---

<style>
@media print {
  @page {
    size: A4;
    margin: 2.5cm;
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
.toc-table td:first-child {
  width: 3em;
  text-align: right;
  color: #555;
}
</style>

<div class="cover-page">

<p class="brand">TEC.WMS</p>

<div class="title-block">

# Guide officiel du programme

# TEC.LOG — Opérations ERP/WMS

</div>

<div class="subtitle-block">

**Collège de la Concorde**  
Programme collégial de formation en logistique intégrée  
Simulateur pédagogique ERP/WMS

</div>

<div class="meta">

Version 1.0 · Session 2025–2026 · Document institutionnel  
Modules M1 à M5 · 17 scénarios certifiables (SCN-001 à SCN-017)  
Durée totale : 30 heures · Français (Canada)

</div>

</div>

<div class="page-break"></div>

# Table des matières

| Section | Titre |
|---------|-------|
| 1 | Description du programme |
| 2 | Résultats d'apprentissage |
| 3 | Cadre de compétences |
| 4 | Compétences par module (M1–M5) |
| 5 | Modèle d'évaluation |
| 6 | Architecture des scénarios |
| 7 | Modèle de certification |
| 8 | Modèle de progression étudiante |
| 9 | Profil du diplômé |
| A | Glossaire institutionnel |

<div class="page-break"></div>

# 1. Description du programme

## 1.1 Identité du programme

Le **programme TEC.LOG** (Technologies de la chaîne logistique) est une formation collégiale offerte par le **Collège de la Concorde** en partenariat avec la plateforme **TEC.WMS** — un simulateur pédagogique ERP/WMS inspiré des environnements SAP Fiori et des systèmes d'entrepôt professionnels.

Le programme vise à former des techniciennes et techniciens capables d'exécuter, contrôler et piloter les opérations logistiques dans un contexte québécois, en maîtrisant les flux transactionnels de la chaîne d'approvisionnement : de la commande fournisseur à l'expédition client, en passant par la réception, le rangement, le contrôle des stocks et l'analyse de performance.

## 1.2 Public cible et prérequis

| Critère | Description |
|---------|-------------|
| **Public** | Étudiantes et étudiants en techniques de la logistique, gestion d'entrepôt ou programmes connexes |
| **Prérequis académiques** | Aucun prérequis technique en ERP; familiarité de base avec les concepts d'entrepôt recommandée |
| **Prérequis technologiques** | Accès Web au simulateur TEC.WMS, compte étudiant institutionnel |
| **Langue d'instruction** | Français (Canada); terminologie bilingue FR/EN pour l'employabilité |

## 1.3 Structure modulaire

Le parcours comprend **cinq modules** totalisant **30 heures** de formation pratique et théorique intégrée :

| Module | Titre | Durée | Scénarios |
|--------|-------|-------|-----------|
| **M1** | Fondements de la chaîne logistique et intégration ERP/WMS | 6 h | SCN-001 → SCN-005 |
| **M2** | Exécution d'entrepôt et gestion des emplacements | 6 h | SCN-006 → SCN-008 |
| **M3** | Contrôle des stocks et réapprovisionnement | 6 h | SCN-009 → SCN-011 |
| **M4** | Indicateurs de performance logistique | 6 h | SCN-012 → SCN-014 |
| **M5** | Simulation opérationnelle intégrée | 6 h | SCN-015 → SCN-017 |

## 1.4 Approche pédagogique

Le programme repose sur une **progression par compétences** alignée sur la taxonomie de Bloom, combinant :

1. **Cours magistraux interactifs** — diapositives institutionnelles, terminologie SAP et ERP/WMS, cartographie des flux.
2. **Quiz de validation des connaissances** — seuil de réussite de 60 % pour débloquer la simulation.
3. **Scénarios transactionnels** — 17 missions opérationnelles (SCN) dans un entrepôt simulé à trois zones (Réception, Stockage, Expédition).
4. **Intelligence pédagogique** — panneaux contextuels, glossaire de 80 termes TEC.LOG, rapports de performance personnalisés.
5. **Certification par paliers** — Silver (fondements M1) et Gold (parcours intégré M1–M5).

## 1.5 Transactions SAP de référence

| Domaine | Transactions couvertes |
|---------|------------------------|
| Approvisionnement | ME21N (commande d'achat) |
| Réception | MIGO (réception marchandises) |
| Rangement | LT0A (mise en stock) |
| Ventes / expédition | VL01N, PGI (sortie marchandises) |
| Inventaire | MI01, MI04, MI07 (comptage cyclique) |
| Consultation stocks | MB52 |
| Planification | Logique MRP, Min/Max, ROP, EOQ |

## 1.6 Contexte professionnel québécois

Les compétences visées correspondent aux exigences du marché du travail logistique au Québec : traçabilité des lots, conformité FIFO, précision d'inventaire, indicateurs OTIF et taux de service, gestion des écarts et prise de décision opérationnelle sous contrainte de temps.

<div class="page-break"></div>

# 2. Résultats d'apprentissage

À l'issue du programme TEC.LOG, l'étudiante ou l'étudiant sera en mesure de :

## 2.1 Résultats globaux (programme)

| Code | Résultat d'apprentissage |
|------|--------------------------|
| **RA-G01** | Exécuter le cycle logistique nominal de bout en bout (PO → GR → rangement → SO → GI) dans un système ERP/WMS intégré. |
| **RA-G02** | Identifier, analyser et résoudre les anomalies opérationnelles courantes (écarts d'inventaire, ruptures, non-conformités documentaires). |
| **RA-G03** | Appliquer les règles de rangement structuré, de gestion de capacité et de conformité FIFO dans un entrepôt multi-zones. |
| **RA-G04** | Réaliser un inventaire cyclique, réconcilier les écarts et formuler une décision de réapprovisionnement fondée sur une politique Min/Max. |
| **RA-G05** | Interpréter les indicateurs clés de performance logistique (rotation, taux de service, productivité) et établir un diagnostic opérationnel. |
| **RA-G06** | Piloter un cycle opérationnel intégré sous contrainte, corriger les variances et formuler une décision stratégique argumentée par les KPI. |
| **RA-G07** | Démontrer une conformité système documentée à chaque étape critique du parcours (vérification de conformité finale). |

## 2.2 Alignement Bloom par palier

| Palier | Niveau Bloom dominant | Modules |
|--------|----------------------|---------|
| Fondation | Comprendre → Analyser | M1 |
| Exécution | Appliquer → Analyser | M2 |
| Contrôle | Appliquer → Évaluer | M3 |
| Pilotage | Analyser → Évaluer | M4 |
| Maîtrise | Évaluer → Créer | M5 |

<div class="page-break"></div>

# 3. Cadre de compétences

## 3.1 Principes directeurs

Le cadre de compétences TEC.LOG s'appuie sur la **Matrice de Compétences TEC.LOG BRIDGE** et distingue trois dimensions d'évaluation :

| Dimension | Description | Échelle |
|-----------|-------------|---------|
| **Maturité ERP** | Capacité à exécuter et interpréter les transactions intégrées | 1 à 5 |
| **Maturité WMS** | Capacité à gérer les opérations d'entrepôt (zones, bins, lots) | 1 à 5 |
| **Niveau Bloom** | Profondeur cognitive exigée par le scénario | Comprendre → Créer |

## 3.2 Rôles professionnels ciblés

| Rôle en entrepôt | Modules principaux | Niveau de responsabilité |
|------------------|-------------------|-------------------------|
| Opérateur entrepôt | M1 | Exécution transactionnelle |
| Spécialiste rangement / FIFO | M2 | Application des règles opérationnelles |
| Auditeur / gestionnaire inventaire | M3 | Contrôle et réconciliation |
| Analyste logistique | M4 | Interprétation et diagnostic |
| Gestionnaire / directeur opérations | M5 | Décision intégrée et stratégique |

## 3.3 Matrice de progression des compétences

| Module | Bloom dominant | Compétences clés certifiables |
|--------|----------------|------------------------------|
| M1 | Comprendre → Analyser | Flux PO→GI, conformité documentaire, résolution d'anomalies |
| M2 | Appliquer → Analyser | Rangement structuré, capacité d'emplacement, FIFO multi-lots |
| M3 | Appliquer → Évaluer | Inventaire cyclique, analyse d'écarts, politique réappro Min/Max |
| M4 | Analyser → Évaluer | Rotation des stocks, diagnostic service/erreurs, décision multi-KPI |
| M5 | Évaluer → Créer | Cycle intégré, gestion post-cycle, décision stratégique capstone |

## 3.4 Cartographie SCN → compétence certifiable

| SCN | Compétence certifiable | Bloom | Maturité ERP/WMS |
|-----|------------------------|-------|------------------|
| SCN-001 | Cycle nominal E2E | Comprendre | 2 / 2 |
| SCN-002 | Résolution GR fantôme | Analyser | 2 / 2 |
| SCN-003 | Gestion rupture de stock | Analyser | 2 / 2 |
| SCN-004 | Correction écart inventaire | Analyser | 3 / 2 |
| SCN-005 | Résolution multi-anomalies | Évaluer | 3 / 3 |
| SCN-006 | Rangement structuré | Appliquer | 2 / 3 |
| SCN-007 | Gestion capacité emplacement | Analyser | 3 / 3 |
| SCN-008 | Application FIFO multi-lots | Analyser | 3 / 3 |
| SCN-009 | Inventaire cyclique | Appliquer | 3 / 4 |
| SCN-010 | Analyse d'écart significatif | Évaluer | 4 / 4 |
| SCN-011 | Politique réappro Min/Max | Évaluer | 4 / 4 |
| SCN-012 | Interprétation rotation | Analyser | 4 / 4 |
| SCN-013 | Diagnostic service / erreurs | Évaluer | 4 / 4 |
| SCN-014 | Diagnostic stratégique multi-KPI | Évaluer | 5 / 5 |
| SCN-015 | Cycle opérationnel intégré | Évaluer | 4 / 4 |
| SCN-016 | Gestion écarts post-cycle | Évaluer | 5 / 5 |
| SCN-017 | Décision stratégique | **Créer** | 5 / 5 |

<div class="page-break"></div>

# 4. Compétences par module (M1–M5)

## 4.1 Module 1 — Fondements de la chaîne logistique et intégration ERP/WMS

**Durée :** 6 heures · **Scénarios :** SCN-001 à SCN-005 · **Seuil :** 60/100

### Compétences visées

| Code | Compétence | Indicateur de maîtrise |
|------|------------|------------------------|
| C-M1-01 | Exécution opérationnelle du cycle PO→GI | Complétion sans stock négatif ni transaction en suspens |
| C-M1-02 | Identification de problèmes documentaires | Détection et correction d'une réception fantôme (GR) |
| C-M1-03 | Prise de décision face à une rupture | Allocation correcte malgré contrainte de disponibilité |
| C-M1-04 | Analyse des écarts d'inventaire | Ajustement documenté d'un écart de comptage |
| C-M1-05 | Résolution de problèmes complexes | Gestion simultanée de plusieurs anomalies |

### Étapes opérationnelles évaluées

PO → GR → Rangement (PUTAWAY) → SO → GI → Comptage cyclique → Conformité M1

### Impact certification

Réussite intégrale du module M1 = **éligibilité à la Certification Silver Premium TEC.WMS**.

---

## 4.2 Module 2 — Exécution d'entrepôt et gestion des emplacements

**Durée :** 6 heures · **Scénarios :** SCN-006 à SCN-008 · **Seuil :** 60/100

### Compétences visées

| Code | Compétence | Indicateur de maîtrise |
|------|------------|------------------------|
| C-M2-01 | Rangement structuré par zone et bin | Allocation conforme aux règles de localisation |
| C-M2-02 | Gestion de la capacité d'emplacement | Respect des limites de capacité sans surcharge |
| C-M2-03 | Conformité FIFO multi-lots | Sélection du lot le plus ancien au prélèvement |

### Étapes opérationnelles évaluées

GR (pré-amorcé) → Rangement → Prélèvement FIFO → Précision inventaire → Conformité avancée M2

### Déblocage

Module accessible après réussite du module M1 (seuil module atteint sur au moins un scénario d'évaluation).

---

## 4.3 Module 3 — Contrôle des stocks et réapprovisionnement

**Durée :** 6 heures · **Scénarios :** SCN-009 à SCN-011 · **Seuil :** 70/100

### Compétences visées

| Code | Compétence | Indicateur de maîtrise |
|------|------------|------------------------|
| C-M3-01 | Précision inventaire par comptage cyclique | Exécution MI01/MI04 sans écart non traité |
| C-M3-02 | Gestion des écarts significatifs | Justification obligatoire en mode évaluation |
| C-M3-03 | Planification réapprovisionnement Min/Max | Calcul Q = Max − stock évalué, décision documentée |

### Étapes opérationnelles évaluées

Liste CC → Comptage → Réconciliation → Réapprovisionnement → Conformité M3

### Validation enseignante

La progression vers M4 peut exiger une **validation enseignante** du module M3 (`teacherValidated`), selon la cohorte.

---

## 4.4 Module 4 — Indicateurs de performance logistique

**Durée :** 6 heures · **Scénarios :** SCN-012 à SCN-014 · **Seuil :** 70/100

### Compétences visées

| Code | Compétence | Indicateur de maîtrise |
|------|------------|------------------------|
| C-M4-01 | Interprétation de la rotation des stocks | Analyse KPI rotation avec seuils de référence |
| C-M4-02 | Diagnostic taux de service et erreurs | Corrélation erreurs opérationnelles / KPI service |
| C-M4-03 | Diagnostic stratégique multi-KPI | Décision argumentée à partir de plusieurs indicateurs |

### Étapes opérationnelles évaluées

Collecte KPI → Analyse rotation → Analyse service → Diagnostic intégré → Conformité M4

### Nature de l'évaluation

Évaluation **sémantique** des réponses écrites (analyse, diagnostic, justification) en complément de la conformité transactionnelle.

---

## 4.5 Module 5 — Simulation opérationnelle intégrée

**Durée :** 6 heures · **Scénarios :** SCN-015 à SCN-017 · **Seuil :** 70/100 (capstone SCN-017 : 70/100 minimum)

### Compétences visées

| Code | Compétence | Indicateur de maîtrise |
|------|------------|------------------------|
| C-M5-01 | Opérations intégrées de bout en bout | Cycle complet multi-SKU sans rupture de séquence |
| C-M5-02 | Action corrective post-cycle | Résolution de variance **avant** analyse KPI (SCN-016) |
| C-M5-03 | Décision stratégique capstone | Décision M5 liée à un instantané KPI documenté (SCN-017) |

### Étapes opérationnelles évaluées

Réception M5 → Rangement → Prélèvement → Cycle count → Ajustement variance (si applicable) → KPI → Décision → Conformité M5

### Impact certification

Réussite intégrale du parcours M1–M5 = **éligibilité à la Certification Gold Premium TEC.WMS**.

<div class="page-break"></div>

# 5. Modèle d'évaluation

## 5.1 Architecture d'évaluation à trois niveaux

| Niveau | Instrument | Seuil | Poids dans la progression |
|--------|------------|-------|---------------------------|
| **Connaissances** | Quiz de module (M1, M5) | ≥ 60 % | Condition de déblocage simulation |
| **Compétences transactionnelles** | Scénarios SCN en mode évaluation | 60/100 (M1–M2) · 70/100 (M3–M5) | Certification et déblocage module |
| **Conformité système** | Vérification finale de conformité | Validée (étape COMPLIANCE) | Condition obligatoire certification |

## 5.2 Système de notation par scénario

Chaque scénario d'évaluation attribue des points selon un barème événementiel :

| Catégorie | Description | Exemple M1 |
|-----------|-------------|------------|
| **Complétion** | Points par étape transactionnelle réussie | PO (10), GR (10), Rangement (25), SO (10), GI (10), CC (10) |
| **Conformité** | Bonus de conformité système | COMPLIANCE_OK (+40) |
| **Pénalités** | Déductions pour erreurs | Stock négatif, mauvais lot FIFO, transaction en suspens |

Le score total est exprimé sur **100 points**. Les exécutions en mode **démo** (`isDemo = true`) ne comptent pas pour la certification.

## 5.3 Seuils officiels (GOV-T01)

| Règle | Valeur | Application |
|-------|--------|-------------|
| Quiz M1 / M5 | ≥ 60 % | Déblocage simulation et certification |
| Scénarios M1, M2 | ≥ 60/100 | Réussite scénario et module |
| Scénarios M3, M4, M5 | ≥ 70/100 | Réussite scénario et module |
| Capstone SCN-017 (Gold) | ≥ 70/100 | Condition Gold spécifique |

## 5.4 Évaluation sémantique (M4–M5)

Pour les scénarios d'analyse et de décision (SCN-012 à SCN-017), le moteur d'évaluation combine :

1. **Conformité transactionnelle** — étapes complétées dans le bon ordre.
2. **Analyse sémantique** — présence des concepts clés, cohérence du diagnostic, lien explicite aux KPI.
3. **Justification obligatoire** — certains scénarios (SCN-010, SCN-014, SCN-017) exigent une réponse rédigée structurée.

## 5.5 Rapport de performance (Run Report)

À la fin de chaque exécution, l'étudiant reçoit un rapport détaillé comprenant :

- Score par étape et score total
- Analyse des pénalités
- Recommandations personnalisées d'amélioration
- État de conformité et blockers éventuels

## 5.6 Distinction progression session / certification

| Indicateur | Mesure | Usage |
|------------|--------|-------|
| **Progression de session (%)** | Étapes opérationnelles complétées dans la run en cours | Mission Control, tableau de bord |
| **Progression certification (%)** | Quiz + SCN + conformité + blockers | Page Certifications |
| **Progression module** | `module_progress.passed`, `bestScore` | Déblocage inter-modules |

> **Note pédagogique :** Un score de session de 90 % signifie qu'une étape opérationnelle reste à compléter dans la run courante ; cela ne garantit pas l'éligibilité à la certification, qui exige la réussite de tous les scénarios requis.

<div class="page-break"></div>

# 6. Architecture des scénarios

## 6.1 Catalogue officiel — 17 scénarios (SCN)

Le simulateur TEC.WMS déploie **17 scénarios canoniques** répartis en cinq modules :

```
M1 [SCN-001 ─ SCN-005]  Fondements et anomalies de base
M2 [SCN-006 ─ SCN-008]  Exécution entrepôt
M3 [SCN-009 ─ SCN-011]  Contrôle stocks
M4 [SCN-012 ─ SCN-014]  Analyse KPI
M5 [SCN-015 ─ SCN-017]  Intégration et capstone
```

## 6.2 Anatomie d'un scénario

Chaque scénario (SCN) comprend :

| Composante | Description |
|------------|-------------|
| **Fiche de mission** | Contexte opérationnel, objectifs, contraintes |
| **État initial** | Données pré-chargées (stocks, commandes, anomalies) |
| **Séquence d'étapes** | Transactions ordonnées avec validations inter-étapes |
| **Règles métier** | Zones, capacité, FIFO, seuils KPI |
| **Mode démo / évaluation** | Démo = entraînement libre ; Évaluation = compte pour certification |
| **Points de contrôle** | Jalons pédagogiques affichés dans l'interface Mission Control |

## 6.3 Zones de l'entrepôt simulé

| Zone | Code | Opérations principales |
|------|------|------------------------|
| Réception | RECEPTION | GR, étiquetage, contrôle qualité initial |
| Stockage | STOCKAGE | Rangement, inventaire, prélèvement FIFO |
| Expédition | EXPEDITION | Préparation commande, GI, conformité finale |

## 6.4 Profils de complexité par module

| Module | Profil dominant | Type d'anomalie |
|--------|-----------------|-----------------|
| M1 | Nominal → multi-anomalies | GR fantôme, rupture, écart CC |
| M2 | Opérationnel structuré | Capacité, FIFO multi-lots |
| M3 | Contrôle et décision | Écart significatif, calcul réappro |
| M4 | Analytique | Interprétation KPI, corrélation erreurs |
| M5 | Intégré → capstone | Variance post-cycle, décision stratégique |

## 6.5 Scénarios détaillés — M1

| SCN | Titre fonctionnel | Compétence | Difficulté |
|-----|-------------------|------------|------------|
| SCN-001 | Cycle nominal de bout en bout | Exécution opérationnelle | ★☆☆ |
| SCN-002 | Résolution GR fantôme | Identification de problème | ★★☆ |
| SCN-003 | Gestion rupture de stock | Prise de décision | ★★☆ |
| SCN-004 | Correction écart inventaire | Analyse des écarts | ★★☆ |
| SCN-005 | Résolution multi-anomalies | Résolution complexe | ★★★ |

## 6.6 Scénarios détaillés — M2 à M5

| SCN | Module | Titre fonctionnel | Seuil |
|-----|--------|-------------------|-------|
| SCN-006 | M2 | Rangement structuré | 60/100 |
| SCN-007 | M2 | Gestion capacité emplacement | 60/100 |
| SCN-008 | M2 | Application FIFO multi-lots | 60/100 |
| SCN-009 | M3 | Inventaire cyclique | 70/100 |
| SCN-010 | M3 | Analyse d'écart significatif | 70/100 |
| SCN-011 | M3 | Politique réappro Min/Max | 70/100 |
| SCN-012 | M4 | Interprétation rotation | 70/100 |
| SCN-013 | M4 | Diagnostic service / erreurs | 70/100 |
| SCN-014 | M4 | Diagnostic stratégique multi-KPI | 70/100 |
| SCN-015 | M5 | Cycle opérationnel intégré | 70/100 |
| SCN-016 | M5 | Gestion écarts post-cycle | 70/100 |
| SCN-017 | M5 | Décision stratégique (capstone) | 70/100 |

## 6.7 Règles d'intégrité des scénarios

- **Dernière exécution prévaut** — pour chaque SCN, seule la dernière run d'évaluation complétée détermine l'éligibilité.
- **Blockers** — transactions non validées ou comptages non réconciliés bloquent la certification même si le score est suffisant.
- **Ordre des étapes M5** — SCN-016 exige la résolution de variance (ADJ) avant l'analyse KPI lorsque le contrat de variance s'applique.

<div class="page-break"></div>

# 7. Modèle de certification

## 7.1 Architecture à trois couches

Le système de certification TEC.WMS sépare strictement trois couches :

| Couche | Rôle | Autorité |
|--------|------|----------|
| **Éligibilité simulateur** | Calcul des conditions (quiz, scores SCN, conformité, blockers) | Moteur TEC.WMS |
| **Aperçu pédagogique** | Prévisualisation du certificat dans l'application (filigrane) | Interface étudiante |
| **Crédential officiel** | PDF signé, numéro de certificat, QR, vérification publique | Collège de la Concorde |

> Le simulateur attribue les indicateurs `silverCertified` et `goldCertified`. **Seul le processus institutionnel** délivre le certificat numéroté inscrit au registre officiel.

## 7.2 Certification Silver — Fondements opérationnels

| Attribut | Valeur |
|----------|--------|
| **Titre officiel** | Certification Silver Premium TEC.WMS |
| **Sous-titre** | Opérations fondamentales ERP/WMS · Module 1 |
| **Ruban** | M1 · FONDEMENTS |
| **Prérequis** | Quiz M1 ≥ 60 % ; SCN-001 à SCN-005 chacun ≥ 60/100 ; conformité M1 validée ; aucun blocker |

### Conditions détaillées (4 volets)

1. **Quiz M1** — meilleur score ≥ 60 %
2. **Scénarios M1** — chaque SCN-001 à SCN-005 ≥ 60/100 (runs non-démo)
3. **Conformité M1** — étape COMPLIANCE complétée sur chaque SCN
4. **Intégrité** — aucune transaction en suspens ni comptage non résolu

## 7.3 Certification Gold — Parcours intégré

| Attribut | Valeur |
|----------|--------|
| **Titre officiel** | Certification Gold Premium TEC.WMS |
| **Sous-titre** | Parcours intégré M1–M5 · Opérations logistiques |
| **Ruban** | M1–M5 · PARCOURS INTÉGRÉ |
| **Prérequis** | Silver obtenu + conditions Gold intégrales |

### Conditions Gold (synthèse)

| # | Condition |
|---|-----------|
| 1 | Certification Silver accordée |
| 2 | Quiz M5 ≥ 60 % |
| 3 | SCN-006 à SCN-017 chacun au seuil module (60 ou 70/100) |
| 4 | Conformité M2–M5 validée (étapes COMPLIANCE_ADV, COMPLIANCE_M3, COMPLIANCE_M4, COMPLIANCE_M5) |
| 5 | Validateurs de module M3, M4, M5 satisfaits |
| 6 | SCN-016 : variance résolue avant KPI |
| 7 | SCN-017 : score capstone ≥ 70/100 et décision liée au KPI |

## 7.4 Numérotation et vérification

| Élément | Format |
|---------|--------|
| **ID Silver** | `TECWMS-SIL-AAAA-NNN` (ex. `TECWMS-SIL-2026-001` … `004` — Cohorte Fondatrice 2026) |
| **ID Gold** | `TECWMS-GOLD-AAAA-NNN` (ex. `TECWMS-GOLD-2026-001` … `004` — Cohorte Fondatrice 2026) |
| **Vérification** | Portail public TEC.WMS — `/verify/{certificateId}` |
| **Registre** | Registre institutionnel — statut `ACTIVE` · `REVOKED` · `EXPIRED` |

## 7.5 États de certification

| État | Signification |
|------|---------------|
| **LOCKED** | Prérequis non satisfaits (ex. Gold sans Silver) |
| **IN_PROGRESS** | Parcours en cours, conditions partiellement remplies |
| **ELIGIBLE** | Toutes les conditions simulateur satisfaites |
| **AWARDED** | Certificat accordé dans le simulateur et/ou émis au registre institutionnel |

<div class="page-break"></div>

# 8. Modèle de progression étudiante

## 8.1 Parcours type

```
Inscription → M1 (cours + quiz) → Simulation M1 → Certification Silver
     ↓
M2 (débloqué si M1 réussi) → M3 → Validation enseignante M3 (si requise)
     ↓
M4 → M5 (quiz M5) → Éligibilité Gold → Certification Gold
```

## 8.2 Conditions de déblocage inter-modules

| Transition | Condition simulateur |
|------------|---------------------|
| Accès M2+ | Module M1 marqué `passed` (seuil atteint sur au moins un scénario d'évaluation) |
| Accès M4 | Module M3 `passed` + `teacherValidated = true` (selon cohorte) |
| Accès scénarios | Quiz du module ≥ 60 % pour lancer la simulation |

## 8.3 Suivi de la progression et checkpoints

| Couche | Périmètre | Rôle |
|--------|-----------|------|
| **Certification Silver Premium** | Module M1 uniquement | Credential de fondements ERP/WMS |
| **Checkpoints modules** | Modules M2–M5 | Progression par module — tous les SCN officiels au seuil requis |
| **Certification Gold Premium** | Parcours intégré M1–M5 | Credential avancé — registre institutionnel et couche credential |

Le moteur de checkpoints (M2–M5) enregistre pour chaque module : réussite globale, pourcentage de complétion, scénarios crédités, validation enseignante M3 (accès M4) et date de première réussite.

## 8.4 Jalons étudiants recommandés

| Jalon | Module | Critère de réussite |
|-------|--------|---------------------|
| **J1 — Fondations** | M1 | Silver éligible ou obtenu |
| **J2 — Opérations** | M2 | 3/3 SCN ≥ 60/100 |
| **J3 — Contrôle** | M3 | 3/3 SCN ≥ 70/100 + validation enseignante |
| **J4 — Pilotage** | M4 | 3/3 SCN ≥ 70/100 |
| **J5 — Maîtrise** | M5 | 3/3 SCN ≥ 70/100 + capstone SCN-017 |
| **J6 — Certification** | M1–M5 | Gold éligible ou obtenu |

## 8.5 Accompagnement pédagogique

| Ressource | Disponibilité |
|-----------|---------------|
| Diapositives de cours | Hub Slides par module |
| Glossaire TEC.LOG (80 termes) | Accessible en simulation |
| Panneaux pédagogiques | Après chaque étape complétée |
| Guides de préparation | Documents étudiants M1–M3 et M4–M5 |
| Rapport de run | Après chaque exécution |
| Page Certifications | Checklist en temps réel |

<div class="page-break"></div>

# 9. Profil du diplômé

## 9.1 Profil professionnel visé

Le diplômé du programme TEC.LOG — parcours TEC.WMS est une **technicienne ou un technicien en opérations logistiques intégrées**, capable d'intervenir autonomement dans les environnements ERP/WMS des PME et grandes entreprises québécoises.

## 9.2 Compétences professionnelles du diplômé

| Domaine | Capacité démontrée |
|---------|-------------------|
| **Exécution** | Traiter les transactions PO, GR, rangement, SO et GI sans erreur système |
| **Qualité** | Maintenir la conformité documentaire et la traçabilité des lots |
| **Gestion d'entrepôt** | Optimiser les emplacements, respecter FIFO et capacités |
| **Contrôle** | Mener un inventaire cyclique, analyser et corriger les écarts |
| **Approvisionnement** | Appliquer une politique Min/Max et calculer les quantités de réappro |
| **Analyse** | Lire un tableau de bord KPI et formuler un diagnostic opérationnel |
| **Décision** | Proposer une action stratégique fondée sur des indicateurs mesurables |
| **Intégrité** | Respecter les procédures de conformité et documenter les écarts |

## 9.3 Postes ciblés

| Niveau | Titres de poste |
|--------|-----------------|
| Opérationnel | Commis d'entrepôt, préposé à la réception, cariste logistique |
| Technique | Coordonnateur de stocks, agent de répartition, commis aux inventaires |
| Analyste | Analyste logistique junior, adjoint à la planification |
| Supervision | Contremaître d'entrepôt, superviseur des opérations (avec expérience) |

## 9.4 Employeurs types (Québec)

Distribution alimentaire, commerce de détail, e-commerce, manufacturier, prestataires logistiques (3PL), transporteurs intégrés — tout environnement utilisant un ERP (SAP, Odoo, Oracle, Microsoft Dynamics) couplé à un WMS.

## 9.5 Niveau de certification et employabilité

| Certification | Signal employeur | Couverture compétences |
|---------------|------------------|------------------------|
| **Silver Premium** | Opérateur ERP/WMS certifié — fondations | Cycle nominal, anomalies de base, conformité M1 |
| **Gold Premium** | Technicien logistique intégré certifié | Parcours complet M1–M5, diagnostic KPI, décision stratégique |

## 9.6 Poursuite des études

Le programme constitue une base solide pour :

- Spécialisation en planification de la chaîne d'approvisionnement (SCM)
- Certification SAP ou Odoo professionnelle
- AEC en gestion de la logistique et du transport
- Progression vers des rôles de supervision ou d'analyse logistique

<div class="page-break"></div>

# Annexe A — Glossaire institutionnel

| Terme | Définition |
|-------|------------|
| **TEC.LOG** | Programme collégial de technologies de la chaîne logistique |
| **TEC.WMS** | Simulateur pédagogique ERP/WMS du Collège de la Concorde |
| **SCN** | Scénario opérationnel numéroté (SCN-001 à SCN-017) |
| **Run** | Exécution complète ou partielle d'un scénario par un étudiant |
| **Conformité** | Étape finale validant l'intégrité transactionnelle du système |
| **Blocker** | Condition bloquante (transaction en suspens, écart non résolu) |
| **FIFO** | First In, First Out — premier entré, premier sorti |
| **CC** | Cycle Count — comptage cyclique d'inventaire |
| **KPI** | Key Performance Indicator — indicateur clé de performance |
| **GR** | Goods Receipt — réception de marchandises |
| **GI** | Goods Issue — sortie de marchandises |
| **PO** | Purchase Order — commande d'achat |
| **SO** | Sales Order — commande client |
| **ROP** | Reorder Point — point de réapprovisionnement |
| **EOQ** | Economic Order Quantity — quantité économique de commande |
| **OTIF** | On Time In Full — livraison à temps et complète |

---

**Document approuvé pour diffusion institutionnelle**

Collège de la Concorde · Programme TEC.LOG · TEC.WMS v1.0  
Session 2025–2026 · Révision : juin 2026

*Ce guide officiel du programme est la référence institutionnelle pour l'architecture pédagogique, l'évaluation et la certification TEC.WMS. Les seuils et conditions décrits sont alignés sur le moteur de certification en production (GOV-T01, GOV-T02).*
