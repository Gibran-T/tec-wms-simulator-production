# TEC.WMS — Gabarit canonique Fiche Mission

**Document:** B.3.2 — Fiche Mission Canonical Template  
**Version:** Draft 1.0  
**Statut:** Documentation institutionnelle — non publié  
**Référence:** Phase B.3 Section B · Standard double rôle (`01-dual-role-standard.md`)

---

## 1. Objet

Ce gabarit définit la **structure obligatoire** de toute Fiche Mission opérationnelle (SCN-001 → SCN-017) après harmonisation B.3.

**Livrable B.3 :** 17 fiches rédigées selon ce gabarit (hors périmètre de ce fichier : une fiche exemple + modèle vide).

**Ne pas confondre avec :**

- Panneau A (briefing intelligence) — contenu aligné mais format cockpit
- PDF legacy `docs/FICHES_DE_MISSION_ÉTUDIANT_*.pdf` — non modifié en B.3

---

## 2. Structure canonique (ordre obligatoire)

| # | Section | Obligatoire | Source de données |
|---|---------|-------------|-------------------|
| 1 | En-tête institutionnel | Oui | Template § 3 |
| 2 | Code SCN et module | Oui | `scnCode`, `moduleId` |
| 3 | Contexte opérationnel | Oui | `context` |
| 4 | Objectif de la mission | Oui | `objective` |
| 5 | Rôle de mission | Oui | `role` |
| 6 | Compétence évaluée | Oui | `competencyMap.warehouseRole` + Bloom |
| 7 | Spécifications techniques | Oui | `technicalSpecs` |
| 8 | Actions à réaliser (étudiant) | Oui | `studentActions` |
| 9 | Preuves attendues | Oui | Matrice preuves (doc `03-evidence-matrix-master-template.md`) |
| 10 | Critères de réussite | Oui | `successCriteria` |
| 11 | Conditions d'échec | Oui | `failureConditions` |
| 12 | Équivalents ERP/WMS | Oui | `sapEquivalent`, `odooEquivalent`, `wmsFunction` |
| 13 | Lien certification | Oui | `certificationNote` + seuil 60/70 |
| 14 | Points de contrôle | Oui | `controlPoints` |
| 15 | Résultat attendu (synthèse) | Oui | `expectedOutcome` |
| 16 | Note double rôle | Oui | `01-dual-role-standard.md` § 5 |

**Hors Fiche Mission (autres documents) :**

- `alternativeActions` → Guide étudiant / Panel D (aide à la décision)
- `recoveryPaths`, `demoGuidance`, `evalGuidance` → Guide superviseur

---

## 3. Modèle d'en-tête

```markdown
# FICHE DE MISSION OPÉRATIONNELLE

**Référence:** CL-SCN-___  
**Code scénario:** SCN-___  
**Module:** M_ — [Titre module]  
**Seuil évaluation:** __/100  
**Date:** [JJ/MM/AAAA]  
**Statut:** ACTIF

*Concorde Logistics — Institutional Standard · QMS v2.0*
```

---

## 4. Modèle vide (à dupliquer par SCN)

```markdown
# FICHE DE MISSION OPÉRATIONNELLE — SCN-___

## En-tête
| Champ | Valeur |
|-------|--------|
| Référence | CL-SCN-___ |
| Module | M_ |
| Seuil évaluation | __/100 |
| Difficulté | [facile / moyen / difficile] |

## Contexte opérationnel
[Coller `context`]

## Objectif de la mission
[Coller `objective`]

## Rôles
| Type | Libellé |
|------|---------|
| **Rôle de mission** (poste simulé) | [Coller `role`] |
| **Compétence évaluée** (rôle entrepôt) | [warehouseRole] |
| **Niveau Bloom** | [bloomLevel] |
| **Progression** | [progression] |

## Spécifications techniques
| SKU | Quantité | Emplacement cible |
|-----|----------|-------------------|
| | | |

## Actions à réaliser (étudiant)
1. [Action 1]
2. [Action 2]
…

## Preuves attendues
- [Preuve 1 — liée critère réussite 1]
- [Preuve 2]
…

## Critères de réussite
- [Critère 1]
- [Critère 2]
…

## Conditions d'échec
- [Condition 1]
…

## Équivalents ERP/WMS
| Domaine | Équivalent |
|---------|------------|
| Fonction WMS | [wmsFunction] |
| SAP | [sapEquivalent] |
| Odoo | [odooEquivalent] |
| Pertinence métier | [industryRelevance] |

## Lien certification
- **Compétence primaire :** [primaryCompetency]
- **Note certification :** [certificationNote ou contexte module]
- **Seuil scénario :** __/100

## Points de contrôle
1. [Point 1]
…

## Résultat attendu
[Coller `expectedOutcome`]

---
**NOTE INSTITUTIONNELLE — DOUBLE RÔLE**  
Le « Rôle de mission » décrit votre poste dans la simulation.  
La « Compétence évaluée » décrit ce que TEC.LOG mesure pour votre certification.
```

---

## 5. Règles de style par module

### M1 (SCN-001 → 005)
- Actions numérotées avec tCodes SAP quand applicable (ME21N, MIGO, LT0A, MI01, MI07).
- Seuil **60/100** explicite dans § Lien certification.

### M2 (SCN-006 → 008)
- Utiliser codes d'étape : `GR`, `PUTAWAY`, `FIFO_PICK`, `STOCK_ACCURACY`, `COMPLIANCE_ADV`.
- Mentionner accès Mission Control pour la couche d'intelligence (putaway entry).

### M3 (SCN-009 → 011)
- Codes : `CC_LIST`, `CC_COUNT`, `CC_RECON`, `REPLENISH`, `COMPLIANCE_M3`.
- Seuil **70/100** obligatoire dans critères et lien certification.

### M4 (SCN-012 → 014)
- Pipeline KPI complet : `KPI_DATA` → `KPI_ROTATION` → `KPI_SERVICE` → `KPI_DIAGNOSTIC` → `COMPLIANCE_M4`.
- SCN-014 : même granularité que 012/013 (pas de libellé vague « pipeline complet » seul).

### M5 (SCN-015 → 017)
- Codes : `M5_RECEPTION`, `M5_PUTAWAY`, `M5_CYCLE_COUNT`, `M5_REPLENISH`, `M5_KPI`, `M5_DECISION`, `COMPLIANCE_M5`.
- SCN-016 : liste en codes, pas en prose.
- SCN-017 : différencier du capstone M4 (décision **exécutive** post-cycle ops intégré).

---

## 6. Exemple rempli — SCN-002 (référence)

# FICHE DE MISSION OPÉRATIONNELLE — SCN-002

## En-tête
| Champ | Valeur |
|-------|--------|
| Référence | CL-SCN-002 |
| Module | M1 — Fondations logistiques |
| Seuil évaluation | 60/100 |
| Difficulté | moyen |

## Contexte opérationnel
Le système affiche un Bon de Commande validé, mais le stock n'est pas apparu dans le bin de réception. Une GR (GR-2025-001) existe mais n'a pas été postée.

## Objectif de la mission
Détection et résolution d'une anomalie de réception (Ghost GR).

## Rôles
| Type | Libellé |
|------|---------|
| **Rôle de mission** | Contrôleur Qualité Logistique |
| **Compétence évaluée** | Opérateur entrepôt |
| **Compétence primaire** | Identification de problème |
| **Niveau Bloom** | Comprendre |
| **Progression** | Fondation M1 |

## Spécifications techniques
| SKU | Quantité | Emplacement |
|-----|----------|-------------|
| SKU-001 | 100 | REC-01 |

## Actions à réaliser (étudiant)
1. Repérer GR-2025-001 en statut PENDING dans le moniteur.
2. Poster (MIGO) sur GR-2025-001 — ne pas créer une nouvelle GR.
3. Ranger (PUTAWAY), puis SO → Picking → GI → CC → Conformité.

## Preuves attendues
- Transaction GR-2025-001 en statut POST.
- Stock SKU-001 visible en REC-01 (> 0).
- Conformité système sans bloqueur (transactions non postées = 0).

## Critères de réussite
- GR-2025-001 postée
- Stock visible REC-01
- Conformité rétablie

## Conditions d'échec
- Nouvelle GR créée sans poster la fantôme
- REC-01 vide après réception

## Équivalents ERP/WMS
| Domaine | Équivalent |
|---------|------------|
| Fonction WMS | Goods receipt posting / validation |
| SAP | MIGO — Post goods receipt |
| Odoo | Validate receipt (stock move) |
| Pertinence | Réconciliation dock WMS vs ERP |

## Lien certification
- **Compétence primaire :** Identification de problème
- **Seuil :** 60/100 · Progression certification Silver M1

## Points de contrôle
1. Analyser le moniteur de transactions (documents non postés).
2. Vérifier l'état du bin REC-01.
3. Valider la transaction GR manquante.

## Résultat attendu
GR fantôme postée, stock visible en REC-01, conformité rétablie.

---
*Note double rôle — voir `01-dual-role-standard.md` § 5*

---

## 7. Checklist de validation fiche (par SCN)

- [ ] SCN-00N présent en en-tête (pas seulement scenarioId)
- [ ] Double rôle documenté (§ Rôles + note pied)
- [ ] Preuves attendues ≠ critères de réussite (formulation evidence-oriented)
- [ ] Seuil 60 ou 70 cohérent avec module
- [ ] ERP/WMS renseigné
- [ ] Actions conformes aux règles de style module (§ 5)
- [ ] alternativeActions **absentes** de la fiche (renvoi Guide étudiant)

---

## 8. Planning de rédaction (17 fiches)

| Priorité | SCN | Raison |
|----------|-----|--------|
| P1 | 002, 005, 010, 012, 013 | Fully aligned — modèles de référence |
| P2 | 001, 003, 004, 006, 009, 011 | Partially aligned — écarts M1/M3 |
| P3 | 014, 015, 016, 017 | Capstones — harmonisation pipeline |
| P4 | 007, 008 | Déjà alignés — duplication rapide |

---

*TEC.WMS — Documentation B.3 · Ne pas modifier le code application en cette phase*
