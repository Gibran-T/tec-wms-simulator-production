# TEC.WMS — QA Review · Guide Professeur RC16

**Date :** 2026-07-02  
**Alignment :** RC16 Final Institutional Documentation Baseline
**Documents revus :**
- `GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.md`
- `GUIDE_PROFESSEUR_TECWMS_10_CLASSES_SUMMARY.md`

**Verdict :** **READY**

---

## 1. Suppression Odoo

| Critère | Statut |
|---------|--------|
| Aucune mention « Odoo » dans le guide RC16 | **PASS** |
| Aucune mention « Odoo » dans le résumé RC16 | **PASS** |
| M2-S6 · M3-S6 · M4-S6 exclues du flux (Annexe C) | **PASS** |
| Pas de variante « optionnel / devoir » | **PASS** |

---

## 2. Calendrier vs stratégie certification

| Événement | Classe guide | Guide Enseignant / simulateur | Statut |
|-----------|--------------|-------------------------------|--------|
| M1 (6 h) | 1–2 | Séances 1–2 | **PASS** |
| Quiz M1 (Silver G1) | **1** | Avant SCN · gate Silver | **PASS** |
| SCN-001→005 | 1–2 | Silver G2–G4 | **PASS** |
| Silver vérification | **7** | Séance 7 consolidation | **PASS** |
| M2 (6 h) | 3–4 | Séances 3–4 | **PASS** |
| M3 (6 h) | 5–6 | Séances 5–6 | **PASS** |
| Validation enseignant M3 | **6** (fin) | Gate M4 eval · `teacherValidated` | **PASS** |
| Prérequis M4 confirmés | **8** | T−24 h avant séance 9 | **PASS** |
| M4 démarrage | **9** | M3 passed + teacherValidated | **PASS** |
| M5 démarrage | **10** | M1 passed (serveur) · M4 recommandé UI | **PASS** |
| Quiz M5 (Gold #2) | **10** | Gate Gold | **PASS** |
| Gold ELIGIBLE | **10** | 18/18 gates | **PASS** |

---

## 3. SCN — assignation primaire unique (17/17)

| SCN | Classe | Statut |
|-----|--------|--------|
| SCN-001 · SCN-002 | 1 | **PASS** |
| SCN-003 · SCN-004 · SCN-005 | 2 | **PASS** |
| SCN-006 · SCN-007 | 3 | **PASS** |
| SCN-008 | 4 | **PASS** |
| SCN-009 · SCN-010 | 5 | **PASS** |
| SCN-011 | 6 | **PASS** |
| SCN-012 · SCN-013 · SCN-014 | 9 | **PASS** |
| SCN-015 · SCN-016 · SCN-017 | 10 | **PASS** |
| Classes 7–8 | Rattrapage retards uniquement | **PASS** (hors flux primaire) |

---

## 4. Checkpoints par classe

| Checkpoint | Classe | Statut |
|------------|--------|--------|
| Quiz M1 ≥ 60 % | 1 | **PASS** |
| SCN-001→002 complets | 1 | **PASS** |
| SCN-003→005 complets | 2 | **PASS** |
| M1 module_progress / Silver prep | 2 | **PASS** |
| M2 gate M1 passed | 3 | **PASS** |
| SCN-006→007 | 3 | **PASS** |
| SCN-008 · M2 passed | 4 | **PASS** |
| SCN-009→010 | 5 | **PASS** |
| SCN-011 · **teacherValidated** | 6 | **PASS** |
| Silver 4 gates | 7 | **PASS** |
| teacherValidated 100 % · Annexe A | 8 | **PASS** |
| SCN-012→014 · M4 passed | 9 | **PASS** |
| Quiz M5 · Gold 18 gates | 10 | **PASS** |

---

## 5. Quiz par classe

| Quiz | Classe | Gate cert | Statut |
|------|--------|-----------|--------|
| M1 | **1** | Silver G1 | **PASS** |
| M2 | **3** | Renforcement | **PASS** |
| M3 | **5** | Renforcement | **PASS** |
| M4 | **8** | Renforcement | **PASS** |
| M5 | **10** | Gold #2 | **PASS** |

---

## 6. Silver / Gold vs simulateur

| Règle simulateur | Guide RC16 | Statut |
|----------------|------------|--------|
| Silver = G1∧G2∧G3∧G4 · auto AWARDED | Classe 7 | **PASS** |
| Gold LOCKED sans Silver | Prérequis documenté | **PASS** |
| Gold 18 gates incl. 18a SCN-016 seq | Classe 10 démo + checklist | **PASS** |
| M4 max 100/100 (politique RC16) | Mentionné Classe 9 | **PASS** |
| M3 seuil 70/100 | Classes 5–6 | **PASS** |

---

## 7. Temps 150 + 2×15 min

| Classe | Enseignement | Pauses | Total | Statut |
|--------|--------------|--------|-------|--------|
| 1 | 150 | 30 | 180 | **PASS** |
| 2 | 150 | 30 | 180 | **PASS** |
| 3 | 150 | 30 | 180 | **PASS** |
| 4 | 150 | 30 | 180 | **PASS** |
| 5 | 150 | 30 | 180 | **PASS** |
| 6 | 150 | 30 | 180 | **PASS** |
| 7 | 150 | 30 | 180 | **PASS** |
| 8 | 150 | 30 | 180 | **PASS** |
| 9 | 150 | 30 | 180 | **PASS** |
| 10 | 150 | 30 | 180 | **PASS** |

*Corrections QA appliquées : tables horaires Classes 1–10 recalibrées (écart initial Classe 2 ~190 min déclarées à tort comme 150).*

---

## 8. Alignement sources

| Source | Alignement |
|--------|------------|
| TECWMS_GUIDE_M1_M3 | Flux M1–M3 · validation M3 · seuils | **PASS** |
| TECWMS_GUIDE_M4_M5 | Mode analytique M4 · Peak Week M5 | **PASS** |
| PROFESSOR_EXPERIENCE_AUDIT | Rythme M1 · pauses · M4 terminologie | **PASS** |
| RC15_CLASSROOM_READINESS | Cohorte · monitor · production | **PASS** |
| SCN-001→017 documentation | 17 SCN · pipelines · canonical M4/M5 | **PASS** |
| CHECKPOINT_CERTIFICATION_GATING_AUDIT | Gates Silver/Gold · teacherValidated | **PASS** |

---

## Corrections appliquées lors de cette QA

1. Suppression **totale** des références Odoo (guide + résumé).
2. Exclusion explicite M2-S6 · M3-S6 · M4-S6 (Annexe C).
3. SCN-002 complété en Classe 1 (plus de report Classe 2).
4. Rattrapage SCN limité aux Classes 7–8 (plus en Classe 4/6 primaire).
5. Recalibrage horaire Classes 1–10 à 150 + 30 min.
6. Politique institutionnelle de notation RC16 — **100/100** par scénario (remplace plafond M4 75/100).

---

**Statut final : READY** — Guide professeur RC16 utilisable en cohorte. Aligné baseline RC16 CERTIFIED.

*Documentation uniquement · Aucun commit*
