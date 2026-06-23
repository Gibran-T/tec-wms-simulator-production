---
title: "TEC.WMS — Manuel officiel de certification"
author: "Collège de la Concorde"
date: "juin 2026"
lang: fr-CA
---

<style>
.cover-page {
  text-align: center;
  padding-top: 5.5cm;
  min-height: 24cm;
}
.cover-page .brand {
  font-size: 2.4em;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #0f2d52;
  margin-bottom: 1.2em;
}
.cover-page .title-block h1 {
  font-size: 1.55em;
  font-weight: 600;
  line-height: 1.45;
  margin: 0.35em 0;
  border: none;
  color: #1a1a1a;
}
.cover-page .subtitle-block {
  margin-top: 4cm;
  font-size: 1.1em;
  line-height: 1.65;
  color: #333;
}
.cover-page .meta {
  margin-top: 3cm;
  font-size: 0.95em;
  color: #555;
  line-height: 1.6;
}
.doc-control table { font-size: 9pt; }
.toc-page ol { line-height: 1.8; }
</style>

<div class="cover-page">

<div class="brand">TEC.WMS</div>

<div class="title-block">

# Manuel officiel de certification

## Programme TEC.LOG — Collège de la Concorde

</div>

<div class="subtitle-block">

**Credential opérationnel ERP/WMS**  
Silver Premium · Gold Premium · Vérification institutionnelle

</div>

<div class="meta">

**Version** 1.0 · **Date** juin 2026  
**Statut** Document institutionnel officiel  
**Autorité** Collège de la Concorde · Programme TEC.LOG  
**Classification** Public — gouvernance, émetteurs et vérificateurs

</div>

</div>

<div class="page-break"></div>

## Avis institutionnel

Ce manuel constitue la **référence officielle** du système de certification TEC.WMS. Il définit la philosophie, les exigences, la gouvernance des seuils, l'architecture de vérification, le format des identifiants, l'intégration LinkedIn, le cycle de vie des credentials et les politiques de révocation et de réémission.

Le simulateur TEC.WMS calcule l'**éligibilité pédagogique**. Seul le **processus institutionnel** du Collège de la Concorde émet les credentials officiels signés, numérotés et vérifiables.

> **Principe fondateur** — L'éligibilité dans le simulateur n'est pas une preuve d'émission. Seul un identifiant actif dans le registre institutionnel constitue une certification vérifiable.

---

<div class="page-break"></div>

## Table des matières

<div class="toc-page">

1. [Philosophie de certification](#1-philosophie-de-certification)
2. [Architecture à trois couches](#2-architecture-à-trois-couches)
3. [Exigences Silver Premium](#3-exigences-silver-premium)
4. [Exigences Gold Premium](#4-exigences-gold-premium)
5. [Gouvernance des seuils](#5-gouvernance-des-seuils)
6. [Format des identifiants de credential](#6-format-des-identifiants-de-credential)
7. [Architecture du portail de vérification](#7-architecture-du-portail-de-vérification)
8. [Flux de vérification par code QR](#8-flux-de-vérification-par-code-qr)
9. [Intégration LinkedIn](#9-intégration-linkedin)
10. [Cycle de vie de la certification](#10-cycle-de-vie-de-la-certification)
11. [Politique de révocation](#11-politique-de-révocation)
12. [Politique de réémission](#12-politique-de-réémission)
13. [Gouvernance institutionnelle](#13-gouvernance-institutionnelle)
14. [Annexes](#14-annexes)

</div>

<div class="page-break"></div>

## 1. Philosophie de certification

### 1.1 Mission

La certification TEC.WMS atteste la **compétence opérationnelle vérifiable** en environnement ERP/WMS pédagogique. Elle s'inscrit dans le programme TEC.LOG du Collège de la Concorde et vise à certifier que le titulaire peut exécuter, diagnostiquer et résoudre des flux logistiques réels — du bon de commande à la décision KPI — dans un cadre conforme aux standards professionnels.

### 1.2 Principes directeurs

| Principe | Description |
|----------|-------------|
| **Évidence opérationnelle** | La certification repose sur des scénarios évalués (SCN), des quiz validés et des étapes de conformité documentées — jamais sur la simple présence en classe. |
| **Séparation des couches** | Éligibilité simulateur, aperçu pédagogique et credential officiel sont des artefacts distincts avec des autorités distinctes. |
| **Vérifiabilité publique** | Chaque credential officiel possède un identifiant unique résolvable via le portail de vérification institutionnel. |
| **Intégrité des seuils** | Les seuils de réussite sont canoniques (GOV-T01, GOV-T02) et ne peuvent être modifiés sans décision de gouvernance documentée. |
| **Exclusion du mode démo** | Les exécutions en mode démonstration (`isDemo = true`) n'entrent jamais dans le calcul d'éligibilité. |
| **Bilinguisme institutionnel** | Les artefacts officiels et le portail supportent le français et l'anglais à parité sémantique. |
| **Non-rétroactivité arbitraire** | Les correctifs pédagogiques en M2–M5 n'altèrent pas rétroactivement l'éligibilité Silver sans décision programme explicite. |

### 1.3 Tiers de certification

| Tier | Titre officiel (FR) | Portée | Credential |
|------|---------------------|--------|------------|
| **Silver Premium** | Certification Silver TEC.WMS | Fondements ERP/WMS — Module 1 | `TECWMS-SIL-{ANNÉE}-{SÉQUENCE}` |
| **Gold Premium** | Certification Gold TEC.WMS | Parcours intégré M1–M5 | `TECWMS-GOLD-{ANNÉE}-{SÉQUENCE}` |

Silver valide les **opérations fondamentales** : cycle PO → GR → Putaway → SO → GI, contrôle inventaire et résolution de conformité. Gold valide le **parcours intégré** incluant planification M2, gestion des écarts M3, conformité multi-modules M4 et pilotage KPI / décision exécutive M5.

### 1.4 Distinction Excellence (hors certification minimale)

Le programme peut accorder une **distinction Excellence** pour les capstones ≥ 90/100 et une disponibilité stock ≥ 99,5 % lorsque applicable. Cette distinction est **séparée** des exigences minimales Silver et Gold Premium et ne constitue pas un tier de registre distinct en v1.0.

---

## 2. Architecture à trois couches

Le système de certification repose sur trois couches qui ne doivent **jamais être confondues** :

| Couche | Rôle | Autorité | Artefact |
|--------|------|----------|----------|
| **Éligibilité simulateur** | Calcule les portes (quiz, scores SCN, conformité, bloqueurs) | Moteur TEC.WMS | Indicateurs Silver Premium / Gold Premium dans le profil étudiant |
| **Aperçu pédagogique** | Présentation in-app pour étudiants éligibles | Interface TEC.WMS | Certificat Silver Premium (filigrane APERÇU si non émis) |
| **Credential officiel** | PDF signé, identifiant numéroté, QR, vérification publique | Collège de la Concorde | Entrée registre `ACTIVE` + PDF archivé |

**Message étudiant standard :**

- FR : *Le certificat officiel signé et vérifiable sera émis par le Collège de la Concorde.*
- EN : *The official signed verifiable certificate will be issued by Collège de la Concorde.*

---

## 3. Exigences Silver Premium

### 3.1 Prérequis généraux

| Exigence | Détail |
|----------|--------|
| **Module** | Module 1 uniquement |
| **Mode** | Évaluation uniquement (`isDemo = false`) |
| **Règle de run** | Dernière exécution complétée retenue par scénario |
| **Livraison officielle** | Émission institutionnelle après approbation B3 |

### 3.2 Grille d'exigences (7 portes)

| # | Porte | Critère | Seuil |
|---|-------|---------|-------|
| 1 | SCN-001 | Cycle opérationnel complet | ≥ 60/100 |
| 2 | SCN-002 | Résolution GR fantôme | ≥ 60/100 |
| 3 | SCN-003 | Résolution pénurie stock | ≥ 60/100 |
| 4 | SCN-004 | Ajustement écart inventaire | ≥ 60/100 |
| 5 | SCN-005 | Résolution conformité multi-erreurs (capstone M1) | ≥ 60/100 |
| 6 | Quiz M1 | Meilleure tentative | ≥ 60 % |
| 7 | Conformité M1 | Étape de conformité validée sur la dernière run ; aucun bloqueur non résolu | Vert |

### 3.3 Compétences certifiées (Silver)

1. Bons de commande (PO)
2. Réception marchandises (GR)
3. Rangement (Putaway)
4. Commandes client (SO)
5. Sortie marchandises (GI)
6. Contrôle inventaire
7. Conformité opérationnelle
8. Résolution de problèmes WMS

### 3.4 Spécification visuelle Silver Premium

| Attribut | Valeur |
|----------|--------|
| **Format** | A4 paysage (297 × 210 mm) |
| **Orientation** | Landscape premium |
| **Palette** | Papier blanc, bordure double bleue institutionnelle (`#0070f2`) |
| **Médaille** | Sceau Silver — ruban `M1 · FONDEMENTS` |
| **En-tête** | Armoiries Collège de la Concorde + devise *Performance · Excellence · Future* |
| **Signatures** | Directrice de programme (Nadia Allami) · Directeur technique TEC.WMS (Thiago Gibran) |
| **QR** | Bas droit — URL de vérification (§8) |
| **Filigrane aperçu** | `APERÇU` / `PREVIEW` — 20 % opacité — uniquement en simulateur non émis |
| **Résolution impression** | 300 DPI minimum pour PDF officiel |

### 3.5 Ce qui ne déclenche pas Silver

- `module_progress.passed` pour M1 seul (système parallèle)
- Complétion des diapositives
- Quiz M2–M5
- Exécutions en mode démo
- Aperçu simulateur sans entrée registre `ACTIVE`

---

## 4. Exigences Gold Premium

### 4.1 Prérequis généraux

| Exigence | Détail |
|----------|--------|
| **Prérequis absolu** | Silver Premium accordé dans le simulateur |
| **Modules** | M2 à M5 (SCN-006 → SCN-017) |
| **Approbation** | Enregistrement B3 pour cohorte Gold |

### 4.2 Machine à états Gold

| État | Condition |
|------|-----------|
| `LOCKED` | Silver non accordé |
| `IN_PROGRESS` | Silver accordé ; exigences incomplètes |
| `ELIGIBLE` | Toutes les portes passées ; credential Gold non encore émis |
| `AWARDED` | Gold Premium attribué ; credential émis |

### 4.3 Grille d'exigences (18 portes)

| # | Porte | Critère | Seuil / règle |
|---|-------|---------|---------------|
| 1 | Prérequis Silver | Silver Premium accordé | Oui |
| 2 | Quiz M5 | Meilleure tentative | ≥ 60 % |
| 3 | SCN-006 | Planification flux M2 | ≥ 60/100 |
| 4 | SCN-007 | Flux M2 | ≥ 60/100 |
| 5 | SCN-008 | Flux M2 | ≥ 60/100 |
| 6 | SCN-009 | Gestion écarts M3 | ≥ 70/100 |
| 7 | SCN-010 | Gestion écarts M3 | ≥ 70/100 |
| 8 | SCN-011 | Gestion écarts M3 | ≥ 70/100 |
| 9 | SCN-012 | Indicateurs M4 | ≥ 70/100 |
| 10 | SCN-013 | Indicateurs M4 | ≥ 70/100 |
| 11 | SCN-014 | Capstone multi-KPI M4 | ≥ 70/100 |
| 12 | SCN-015 | Simulation intégrée M5 | ≥ 70/100 |
| 13 | SCN-016 | Action corrective avant KPI | ≥ 70/100 + porte variance |
| 14 | SCN-017 | Décision exécutive capstone | ≥ 70/100 (GOV-T02) |
| 15 | Conformité M2–M5 | Étapes `COMPLIANCE_ADV`, `COMPLIANCE_M3`, `COMPLIANCE_M4`, `COMPLIANCE_M5` | Complétées |
| 16 | Bloqueurs | Transactions non comptabilisées / cycles non résolus | Aucun |
| 17 | Validateurs module | `validateM3Compliance`, `validateM4Compliance`, `validateM5Compliance` | Passés |
| 18a | Porte SCN-016 | Variance résolue ; si `M5_KPI` complété, `M5_ADJ` avant KPI | Ordre imposé |
| 18b | Porte SCN-017 | `M5_DECISION` + `M5_KPI` complétés ; snapshot KPI existant | Lié |

### 4.4 Seuils par module (Gold path)

| Module | Scénarios | Seuil |
|--------|-----------|-------|
| M2 | SCN-006, SCN-007, SCN-008 | 60/100 |
| M3 | SCN-009, SCN-010, SCN-011 | 70/100 |
| M4 | SCN-012, SCN-013, SCN-014 | 70/100 |
| M5 | SCN-015, SCN-016 | 70/100 |
| M5 capstone | SCN-017 | 70/100 (plancher capstone GOV-T02) |

### 4.5 Compétences certifiées (Gold)

1. Planification des flux M2
2. Gestion des écarts M3
3. Conformité multi-modules M4
4. Pilotage KPI et décision M5
5. Chaîne PO → GR → Putaway → SO → GI
6. Résolution capstone intégrée

### 4.6 Spécification visuelle Gold Premium

| Attribut | Valeur |
|----------|--------|
| **Format** | A4 paysage |
| **Palette** | Fond ambre doré (`#fffbeb` → `#fef3c7`) ; ruban `M1–M5 · PARCOURS INTÉGRÉ` |
| **Lien Silver** | Champ registre `prerequisite_certificate_id` vers credential Silver valide |
| **Motif** | Glyphes logistiques PO · GR · GI · KPI à 3 % opacité (impression physique) |

### 4.7 Déclencheurs d'attribution Gold

| Déclencheur | Emplacement | Notes |
|-------------|-------------|-------|
| Requête statut Gold | Page certifications | Si éligible et attribution autorisée |
| Rapport run M5 | Fin de module 5 | Même condition |
| Réconciliation admin | Audit cohorte | Recalcul vs éligibilité |

**Sans décision institutionnelle d'attribution :** l'étudiant peut rester `ELIGIBLE` indéfiniment sans credential Gold émis — comportement institutionnel intentionnel.

---

## 5. Gouvernance des seuils

### 5.1 Référentiel canonique (GOV-T01)

| Paramètre | Valeur | Portée |
|-----------|--------|--------|
| Seuil scénario M1–M2 | **60/100** | Silver + Gold path M2 |
| Seuil scénario M3–M5 | **70/100** | Gold path M3–M5 |
| Seuil quiz M1 / M5 | **60 %** | `QUIZ_PASS_THRESHOLD` |
| Seuil capstone SCN-017 | **70/100** | GOV-T02 |

**Source unique de vérité :** référentiel canonique GOV-T01 du Collège — toute dérive client/serveur est interdite.

### 5.2 Grandfather conditionnel (T-01 §6.3)

Pour les modules M3–M5, un score historique entre 60 et 69 peut conserver le statut `passed` si **déjà marqué passé** avant l'élévation du seuil à 70. Les **nouvelles** tentatives sous 70 ne passent pas prospectivement.

### 5.3 Validation enseignant M3 → M4

L'accès au Module 4 exige `module_progress.passed = true` **et** `teacherValidated = true` pour M3. Cette porte est distincte de la certification Gold mais conditionne le parcours.

### 5.4 Processus de modification des seuils

| Étape | Responsable | Livrable |
|-------|-------------|----------|
| 1. Proposition motivée | Directrice de programme | Note d'impact pédagogique |
| 2. Analyse technique | Directeur technique TEC.WMS | Rapport de compatibilité moteur |
| 3. Validation Constitution | Comité TEC.LOG | Référence Article VII |
| 4. Mise à jour canonique | Équipe technique | Mise à jour du référentiel GOV-T01 + tests de conformité |
| 5. Communication | Collège | Mise à jour du présent manuel |

**Interdit :** modifier les seuils uniquement pour faire passer des tests ou des cohortes sans décision documentée.

### 5.5 Exclusions du calcul de seuil

| Exclusion | Règle |
|-----------|-------|
| Mode démo | `isDemo = true` — exclu |
| Runs incomplètes | Non comptabilisées |
| Quiz comme porte d'accès scénario | Désactivé — le quiz ne bloque pas l'accès aux scénarios |

---

## 6. Format des identifiants de credential

### 6.1 Structure canonique

```
TECWMS-{TIER}-{ANNÉE}-{SÉQUENCE}
```

| Segment | Règle | Exemple |
|---------|-------|---------|
| `TECWMS` | Préfixe institutionnel fixe | TECWMS |
| `TIER` | `SIL` = Silver Premium · `GOLD` = Gold Premium | SIL |
| `ANNÉE` | Année d'émission de la cohorte (4 chiffres) | 2026 |
| `SÉQUENCE` | Numéro séquentiel sur 3 chiffres, zéro-padding | 001 |

**Expression régulière de validation :**

```
^TECWMS-(SIL|GOLD)-\d{4}-\d{3}$
```

### 6.2 Exemples officiels — Cohorte inaugurale 2026

| Identifiant | Titulaire | Tier |
|-------------|-----------|------|
| `TECWMS-SIL-2026-001` | Darlin Campaz Paredes | Silver |
| `TECWMS-SIL-2026-002` | Fredy Tamile Lola | Silver |
| `TECWMS-SIL-2026-003` | Prince Agbodjan Sewa Francis Ghislain | Silver |
| `TECWMS-SIL-2026-004` | Aissata Soukeina Camara | Silver |
| `TECWMS-GOLD-2026-001` | Darlin Campaz Paredes | Gold |
| `TECWMS-GOLD-2026-002` | Fredy Tamile Lola | Gold |
| `TECWMS-GOLD-2026-003` | Prince Agbodjan Sewa Francis Ghislain | Gold |
| `TECWMS-GOLD-2026-004` | Aissata Soukeina Camara | Gold |

### 6.3 Règles d'allocation

1. Numéros **pré-alloués** à l'approbation institutionnelle — jamais dérivés de l'auto-incrément simulateur.
2. Séquence démarre à `001` pour chaque combinaison `TIER + ANNÉE`.
3. **Aucune réutilisation** — un identifiant révoqué reste dans le registre comme `REVOKED`.
4. Séquences contiguës par cohorte ; tout écart requiert une note d'audit.
5. Silver et Gold sont **indépendants** — un titulaire peut posséder les deux identifiants.

### 6.4 Champs registre associés

| Champ | Visibilité | Description |
|-------|------------|-------------|
| `certificateId` | Public | Clé primaire |
| `studentNumber` | Portail (contexte institutionnel) | Numéro étudiant Collège |
| `recipient_display_name` | Public | Nom légal d'affichage |
| `status` | Public | `ACTIVE` · `REVOKED` · `EXPIRED` |
| `issueDate` | Public | Date ISO d'émission |
| `prerequisite_certificate_id` | Registre interne | Lien Silver → Gold |
| `eligibility_snapshot_hash` | Audit interne | Empreinte SHA-256 des portes à l'émission |

---

## 7. Architecture du portail de vérification

### 7.1 Objectif

Service web **public en lecture seule** permettant aux employeurs, partenaires académiques et titulaires de confirmer qu'un identifiant correspond à une entrée active du registre institutionnel.

### 7.2 Composants

```
┌─────────────────────────────────────────────────────────────┐
│                    Portail de vérification                   │
├─────────────────────────────────────────────────────────────┤
│  Route UI      /verify/{certificateId}                      │
│  Registre      Registre institutionnel TEC.WMS              │
│  Lookup        Vérification par identifiant canonique       │
│  Statuts       ACTIVE → affiché · REVOKED/EXPIRED → masqué  │
│  Actions       PDF · LinkedIn · URL de vérification         │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 URL de production

| Composant | Valeur |
|-----------|--------|
| **Base production** | Plateforme TEC.WMS — Collège de la Concorde |
| **Chemin vérification** | `/verify/{certificateId}` |
| **Exemple complet** | `https://tec-wms-simulator-production-production.up.railway.app/verify/TECWMS-SIL-2026-001` |

### 7.4 Contenu page — credential valide

| Section | Affichage |
|---------|-----------|
| Bannière statut | ✓ Certification vérifiée |
| Nom titulaire | Nom d'affichage registre |
| Identifiant | `TECWMS-SIL-2026-001` (monospace) |
| Numéro étudiant | Numéro Collège |
| Programme | TEC.WMS |
| Niveau | SILVER ou GOLD |
| Date d'émission | Format locale `fr-CA` / `en-CA` |
| Émis par | Collège de la Concorde |
| URL credential | Lien canonique de vérification |
| Actions | Télécharger PDF · Ajouter à LinkedIn |

### 7.5 États d'erreur

| État | Comportement | Message (FR) |
|------|--------------|--------------|
| `NOT_FOUND` | Identifiant absent du registre | Certification introuvable. Vérifiez l'identifiant. |
| `REVOKED` | Entrée `REVOKED` | Non affiché comme valide — traité comme introuvable en v1.0 |
| `MALFORMED_ID` | Format invalide | Format d'identifiant invalide |
| `EXPIRED` | Entrée `EXPIRED` | Non affiché comme valide |

### 7.6 Règles de confidentialité

- Le portail public retourne le **nom d'affichage** et les métadonnées de certification.
- Aucun courriel, mot de passe ou détail de score n'est exposé.
- La recherche partielle n'est **pas** supportée (prévention d'énumération).

### 7.7 Sécurité opérationnelle

| Mécanisme | Approche |
|-----------|----------|
| Authentification | Aucune requise pour la vérification |
| Source de vérité | Registre institutionnel — le PDF est une représentation |
| Limitation de débit | 60 requêtes/minute par IP (cible) |
| Intégrité QR signée | Hors scope v1.0 — URL mappe au registre |

---

## 8. Flux de vérification par code QR

### 8.1 Rôle du QR

Le code QR est le **pont hors-ligne vers en-ligne** sur le certificat imprimé ou PDF. Il encode une URL HTTPS unique pointant vers le portail de vérification du credential.

### 8.2 Spécification technique

| Propriété | Règle |
|-----------|-------|
| **Type** | URL (ISO/IEC 18004 QR Code Model 2) |
| **Charge utile** | URL complète incluant `certificateId` |
| **Correction d'erreur** | Niveau M (15 %) |
| **Taille minimale impression** | 32 × 32 mm sur certificat A4 |
| **Zone tranquille** | 4 modules minimum |
| **Couleurs** | `#1e293b` sur blanc uniquement |

### 8.3 Placement sur le certificat

- **Position :** Bas droit de la rangée de signatures, aligné avec les lignes de signature.
- **Étiquette :** `Vérifier / Verify` + URL portail TEC.WMS
- **Hors médaille** — le sceau institutionnel reste distinct pour la lisibilité du scan.

### 8.4 Workflow de vérification

```
┌──────────────┐    scan QR     ┌─────────────────────┐
│ Certificat   │ ─────────────► │ Portail /verify/ID  │
│ PDF / papier │                └──────────┬──────────┘
└──────────────┘                           │
                                           ▼
                              ┌────────────────────────┐
                              │ Lookup registre ACTIVE │
                              └──────────┬─────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
              ┌──────────┐        ┌──────────┐        ┌──────────┐
              │  VALIDE  │        │ INTROUV. │        │ RÉVOQUÉ  │
              │ Afficher │        │ Message  │        │ Masqué   │
              │ détails  │        │ erreur   │        │ v1.0     │
              └──────────┘        └──────────┘        └──────────┘
```

### 8.5 Vérification manuelle (secours)

Sans QR, saisir l'identifiant exact sur le portail. Correspondance **exacte** uniquement (insensible à la casse).

### 8.6 Génération QR

Le QR est généré **uniquement à l'émission officielle du PDF**, jamais pour les aperçus simulateur filigranés.

---

## 9. Intégration LinkedIn

### 9.1 Objectif

Permettre au titulaire d'ajouter sa certification TEC.WMS à son profil LinkedIn via le flux officiel **Add to Profile → Licenses & Certifications**.

### 9.2 Construction de l'URL

Le système génère une URL `https://www.linkedin.com/profile/add` avec les paramètres suivants :

| Paramètre | Silver | Gold |
|-----------|--------|------|
| `startTask` | `CERTIFICATION_NAME` | `CERTIFICATION_NAME` |
| `name` | `TEC.WMS Silver Certification` | `TEC.WMS Gold Certification` |
| `organizationName` | `Collège de la Concorde` | `Collège de la Concorde` |
| `issueYear` | Année d'émission | Année d'émission |
| `issueMonth` | Mois d'émission | Mois d'émission |
| `certId` | `TECWMS-SIL-2026-00N` | `TECWMS-GOLD-2026-00N` |
| `certUrl` | URL de vérification production | URL de vérification production |

**Fonction de référence :** générateur d'URL LinkedIn intégré à la plateforme TEC.WMS.

### 9.3 Points d'accès UI

| Emplacement | Action |
|-------------|--------|
| Page `/verify/{certificateId}` | Bouton « Ajouter à LinkedIn » |
| Page certifications étudiant | Lien credential si registre lié |

### 9.4 Règles institutionnelles

1. Seuls les credentials `ACTIVE` dans le registre peuvent générer un lien LinkedIn valide.
2. L'URL de vérification (`certUrl`) doit résoudre vers le portail institutionnel — jamais vers un aperçu simulateur.
3. Le titulaire est responsable de l'exactitude des informations sur son profil LinkedIn après ajout.
4. LinkedIn peut modifier son flux d'ajout ; le Collège maintient la fonction de génération d'URL à jour.

---

## 10. Cycle de vie de la certification

### 10.1 Diagramme de cycle de vie

```
                    ┌─────────────────┐
                    │   INSCRIPTION   │
                    │   (étudiant)    │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │  APPRENTISSAGE  │
                    │  M1 → M5        │
                    └────────┬────────┘
                             ▼
              ┌──────────────────────────────┐
              │  ÉVALUATION (mode eval)      │
              │  SCN + quiz + conformité     │
              └──────────────┬───────────────┘
                             ▼
              ┌──────────────────────────────┐
              │  ÉLIGIBILITÉ SIMULATEUR      │
              │  silverEligible / goldEligible│
              └──────────────┬───────────────┘
                             ▼
              ┌──────────────────────────────┐
              │  DÉBLOCAGE FLAG (optionnel)  │
              │  Attribution simulateur Silver/Gold │
              └──────────────┬───────────────┘
                             ▼
              ┌──────────────────────────────┐
              │  APERÇU PÉDAGOGIQUE          │
              │  (Silver/Gold Premium UI)    │
              └──────────────┬───────────────┘
                             ▼
              ┌──────────────────────────────┐
              │  REVUE INSTITUTIONNELLE B3   │
              │  Approbation cohorte         │
              └──────────────┬───────────────┘
                             ▼
              ┌──────────────────────────────┐
              │  ALLOCATION IDENTIFIANT      │
              │  TECWMS-{TIER}-{ANNÉE}-{SEQ} │
              └──────────────┬───────────────┘
                             ▼
              ┌──────────────────────────────┐
              │  ÉMISSION OFFICIELLE         │
              │  PDF + QR + registre ACTIVE  │
              └──────────────┬───────────────┘
                             ▼
         ┌───────────────────┴───────────────────┐
         ▼                   ▼                       ▼
  ┌─────────────┐    ┌─────────────┐         ┌─────────────┐
  │  MAINTIEN   │    │  RÉÉMISSION │         │  RÉVOCATION │
  │  ACTIVE     │    │  (§12)      │         │  (§11)      │
  └─────────────┘    └─────────────┘         └─────────────┘
```

### 10.2 Phases détaillées

| Phase | Description | Système responsable |
|-------|-------------|---------------------|
| **P1 — Formation** | Progression modules, scénarios, quiz | TEC.WMS LMS |
| **P2 — Évaluation** | Runs scorées, conformité, bloqueurs | Moteur TEC.WMS |
| **P3 — Éligibilité** | Calcul automatique des portes | Moteur de certification TEC.WMS |
| **P4 — Attribution simulateur** | Déblocage Silver Premium / Gold Premium | Serveur TEC.WMS |
| **P5 — Aperçu** | Certificat Premium in-app | Client React |
| **P6 — Revue B3** | Validation cohorte par direction | Collège (hors simulateur) |
| **P7 — Émission** | PDF signé, QR, entrée registre | Collège + pipeline export |
| **P8 — Vérification** | Portail public, LinkedIn | Infrastructure vérification |

### 10.3 Durée de validité

En v1.0, les credentials n'ont **pas de date d'expiration** automatique. Le statut `EXPIRED` est réservé aux décisions institutionnelles explicites (changement de programme majeur).

### 10.4 Archivage

| Artefact | Durée minimale | Responsable |
|----------|----------------|-------------|
| PDF signé | 7 ans | Collège de la Concorde |
| Entrée registre | Permanente | Collège de la Concorde |
| Snapshot éligibilité | 7 ans | Collège + audit technique |

---

## 11. Politique de révocation

### 11.1 Principes

La révocation est une mesure **exceptionnelle** qui invalide un credential précédemment émis. Elle ne supprime pas l'historique — l'identifiant reste dans le registre avec le statut `REVOKED`.

### 11.2 Motifs de révocation

| Code | Motif | Exemple |
|------|-------|---------|
| `R-01` | Fraude ou falsification | Soumission frauduleuse de preuves |
| `R-02` | Erreur d'identité | Credential émis au mauvais titulaire |
| `R-03` | Violation code d'éthique | Conduite incompatible avec la certification |
| `R-04` | Annulation académique | Retrait du programme pour motif disciplinaire |
| `R-05` | Erreur d'émission | Credential émis avant validation complète des portes |

### 11.3 Autorité de révocation

| Niveau | Autorité | Périmètre |
|--------|----------|-----------|
| **Décision** | Directrice de programme (Nadia Allami) | Tous les credentials TEC.WMS |
| **Exécution technique** | Directeur technique TEC.WMS | Mise à jour registre + portail |
| **Consultation** | Direction Collège | Motifs R-03, R-04 |

### 11.4 Procédure

1. **Signalement** — Fraude, erreur ou incident documenté.
2. **Enquête** — Vérification des preuves et du snapshot d'éligibilité.
3. **Décision écrite** — Motif codifié (R-01 à R-05) + date.
4. **Mise à jour registre** — `status = REVOKED` ; `revoked_at` ; `revocation_reason`.
5. **Notification titulaire** — Courriel institutionnel avec motif et voie de recours.
6. **Mise à jour portail** — Le credential n'apparaît plus comme valide.
7. **Archivage** — Dossier d'audit conservé 7 ans minimum.

### 11.5 Effets de la révocation

| Domaine | Effet |
|---------|-------|
| Portail vérification | Credential non résolu comme valide |
| LinkedIn | Titulaire doit retirer manuellement ; le Collège peut signaler à LinkedIn |
| Simulateur | Indicateurs Silver/Gold Premium peuvent être réinitialisés par l'administration |
| PDF existant | Devient non vérifiable — le registre prime sur le document |

### 11.6 Non-révocation automatique

**Il n'existe pas de révocation automatique** lorsqu'un étudiant rejoue un scénario avec un score inférieur. Seules les voies administratives institutionnelles peuvent réinitialiser les indicateurs simulateur — la révocation du credential officiel reste une décision institutionnelle distincte.

### 11.7 Recours

Le titulaire dispose de **15 jours ouvrables** pour soumettre un recours écrit à la direction du programme. La décision finale appartient au Collège de la Concorde.

---

## 12. Politique de réémission

### 12.1 Principes

La réémission couvre les cas où un credential valide doit être **remplacé** sans révocation pour faute — typiquement correction de nom, mise à jour visuelle ou remplacement de PDF endommagé.

### 12.2 Motifs de réémission

| Code | Motif | Nouvel identifiant ? |
|------|-------|----------------------|
| `E-01` | Correction orthographique du nom | Non — même ID |
| `E-02` | Remplacement PDF (défaut impression) | Non — même ID |
| `E-03` | Mise à jour template institutionnel | Non — même ID, nouvelle `issue_date` optionnelle |
| `E-04` | Credential jamais reçu (perte confirmée) | Non — réexpédition même ID |
| `E-05` | Changement légal de nom | Non — mise à jour `recipient_display_name` |

### 12.3 Motifs nécessitant un nouvel identifiant

| Situation | Action |
|-----------|--------|
| Credential émis par erreur à un non-éligible | Révoquer l'ancien (R-05) + émettre nouveau si éligible |
| Tier incorrect (Silver vs Gold) | Révoquer + émettre avec bon tier et nouvelle séquence si requis |

**Règle absolue :** un identifiant révoqué n'est **jamais réattribué**.

### 12.4 Procédure de réémission

1. **Demande** — Titulaire ou administration via formulaire institutionnel.
2. **Vérification** — Statut `ACTIVE` confirmé ; motif documenté.
3. **Regénération** — Nouveau PDF + QR (même URL si même ID).
4. **Journal** — Entrée `updated_at` + note de réémission dans le dossier audit.
5. **Livraison** — PDF sécurisé au titulaire ; ancien PDF considéré remplacé.

### 12.5 Limites

| Limite | Valeur |
|--------|--------|
| Réémissions gratuites par an | 2 maximum (E-01 à E-04) |
| Délai de traitement | 10 jours ouvrables |
| Frais administratifs | Applicables au-delà de la 2e réémission (barème Collège) |

---

## 13. Gouvernance institutionnelle

### 13.1 Organigramme de gouvernance

```
┌─────────────────────────────────────────────────────────────┐
│              Collège de la Concorde — Direction             │
└────────────────────────────┬────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Directrice de   │ │ Directeur       │ │ Comité          │
│ programme       │ │ technique       │ │ pédagogique     │
│ TEC.LOG         │ │ TEC.WMS         │ │ TEC.LOG         │
│ (N. Allami)     │ │ (T. Gibran)     │ │                 │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             ▼
              ┌──────────────────────────────┐
              │  Registre des certifications │
              │  Portail de vérification     │
              │  Politiques révocation/       │
              │  réémission                  │
              └──────────────────────────────┘
```

### 13.2 Rôles et responsabilités

| Rôle | Responsabilités |
|------|-----------------|
| **Directrice de programme** | Approbation B3 cohortes · Révocation · Politique pédagogique · Communication institutionnelle |
| **Directeur technique TEC.WMS** | Moteur d'éligibilité · Registre technique · Portail · Intégrité des seuils · Audit post-déploiement |
| **Enseignants TEC.LOG** | Validation M3 (`teacherValidated`) · Preuves pédagogiques · Signalement d'anomalies |
| **Administration Collège** | Émission PDF · Archivage · Numérotation · Support titulaires |
| **Comité pédagogique** | Révision Constitution · Modifications de seuils · Alignement Mission Sheets |

### 13.3 Contrôles périodiques

| Contrôle | Responsable | Fréquence |
|----------|-------------|-----------|
| Approbation B3 avant première émission | Directrice de programme | Par cohorte |
| Revue des entrées registre | Direction + technique | Par lot de récipiendaires |
| Spot-check vérification portail | Directeur technique | Post-déploiement + trimestriel |
| Audit cohérence flags simulateur / registre | Directeur technique | Par release majeure |
| Rétention archives PDF | Administration Collège | Continu — audit annuel |
| Revue politique révocation/réémission | Directrice de programme | Annuelle |

### 13.4 Alignement constitutionnel

Ce manuel s'aligne sur la **Constitution pédagogique TEC.WMS** :

- **Article VII** — Frontières de certification (Silver = M1 ; Gold = parcours intégré)
- **Article IX** — Gouvernance des changements (seuils, déploiements, agents IA)

Toute modification pédagogique impactant la certification exige une **décision programme distincte** — pas d'effet automatique via correctifs M2–M5.

### 13.5 Gestion des versions documentaires

| Version | Date | Auteur | Modification |
|---------|------|--------|--------------|
| 1.0 | juin 2026 | Collège de la Concorde · TEC.LOG | Publication initiale du manuel officiel |

**Références :** Manuel de certification TEC.WMS · Constitution pédagogique TEC.WMS · Audit intelligence certification

### 13.6 Contacts institutionnels

| Domaine | Contact |
|---------|---------|
| Questions certification | Programme TEC.LOG — Collège de la Concorde |
| Vérification employeur | Portail TEC.WMS — `/verify/{certificateId}` |
| Signalement fraude | Directrice de programme |
| Support technique portail | Directeur technique TEC.WMS |

---

## 14. Annexes

### Annexe A — Matrice Silver (récapitulatif)

| SCN | Intitulé | Seuil |
|-----|---------|-------|
| SCN-001 | Cycle opérationnel complet | 60 |
| SCN-002 | Résolution GR fantôme | 60 |
| SCN-003 | Résolution pénurie stock | 60 |
| SCN-004 | Ajustement écart inventaire | 60 |
| SCN-005 | Conformité multi-erreurs | 60 |
| Quiz M1 | Validation fondements | 60 % |

### Annexe B — Matrice Gold (récapitulatif)

| Module | SCN | Seuil |
|--------|-----|-------|
| M2 | 006–008 | 60 |
| M3 | 009–011 | 70 |
| M4 | 012–014 | 70 |
| M5 | 015–016 | 70 |
| M5 capstone | 017 | 70 |
| Quiz M5 | — | 60 % |

### Annexe C — Schéma registre (JSON)

```json
{
  "certificateId": "TECWMS-SIL-2026-001",
  "studentName": "Nom du titulaire",
  "studentNumber": "000000",
  "certificationLevel": "SILVER",
  "status": "ACTIVE"
}
```

### Annexe D — Paramètres LinkedIn (exemple)

```
https://www.linkedin.com/profile/add
  ?startTask=CERTIFICATION_NAME
  &name=TEC.WMS+Silver+Certification
  &organizationName=Collège+de+la+Concorde
  &issueYear=2026
  &issueMonth=6
  &certId=TECWMS-SIL-2026-001
  &certUrl=https://.../verify/TECWMS-SIL-2026-001
```

---

<div class="doc-footer">

**Collège de la Concorde · Programme TEC.LOG**  
Manuel officiel de certification TEC.WMS · Version 1.0 · juin 2026  
Credential opérationnel ERP/WMS — Silver Premium · Gold Premium

</div>
