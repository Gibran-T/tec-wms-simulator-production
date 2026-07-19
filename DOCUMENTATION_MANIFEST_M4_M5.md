# DOCUMENTATION MANIFEST — M4 / M5 (TEC.WMS)

**Date d'inventaire :** 2026-07-19  
**Branche :** `feature/integrated-assessments-quiz-nav-july-2026`  
**HEAD applicatif :** `9560b8888ff28d23df822251a80c7d2893be054e`  
**Hiérarchie des sources :** décisions course owner → **doc étudiant livrée** → matrice pédagogique → slides/glossaire/Fiche Mission/Annexe A → canons scénario → UI → hints → validators → seed/historique.

---

## 1. Version canonique livrée aux étudiants

| Champ | Valeur |
|-------|--------|
| **Document vigent (M4/M5)** | `TECWMS_GUIDE_M4_M5.pdf` |
| **Renommage livraison** | `Guide_TECWMS_Modules_M4_a_M5_Juillet_2026.pdf` |
| **Dossier livraison** | `C:\Users\gibra\Downloads\TEC.WMS_Guides_Etudiants_Juillet_2026` |
| **Source éditoriale** | `TECWMS_GUIDE_ETUDIANT_M4_M5_PREPARATION_CERTIFICATION_PDF_READY.md` |
| **Version** | juillet 2026 |
| **Langue** | fr-CA |
| **Modules** | M4, M5 |
| **Scénarios** | SCN-012 → SCN-017 |
| **Commit d'origine** | `f2dd2c4` — *docs(pedagogy): align M1-M5 student guides with production scenarios* (2026-07-17) |
| **SHA-256 PDF (checkpoint)** | `1a102513796d3a9599599e25f6c6298bfa77bec7e1241eef0f1c938d58e7ef05` |
| **Preuve de livraison** | `M1_M5_STUDENT_GUIDES_SYSTEM_ALIGNMENT_CHECKPOINT.md` — READY FOR STUDENT DISTRIBUTION |
| **Status** | **VIGENTE** |

Companions vigentes : `.docx`, `.html` (même commit).

Pack distinct M1–M3 (même vague juillet) : `TECWMS_GUIDE_M1_M3.pdf` — hors scope scénarios M4/M5 mais même livraison.

---

## 2. Inventaire complet (étudiant / adjacent)

### 2.1 VIGENTE — livraison juillet 2026

| Nom | Chemin | Version | Date | Lang | Modules | SCN | Status | Commit |
|-----|--------|---------|------|------|---------|-----|--------|--------|
| Guide étudiant M4/M5 PDF | `TECWMS_GUIDE_M4_M5.pdf` | juillet 2026 | 2026-07-17 | FR | M4–M5 | 012–017 | **vigente** | `f2dd2c4` |
| Guide étudiant M4/M5 DOCX | `TECWMS_GUIDE_M4_M5.docx` | juillet 2026 | 2026-07-17 | FR | M4–M5 | 012–017 | vigente | `f2dd2c4` |
| Guide étudiant M4/M5 HTML | `TECWMS_GUIDE_M4_M5.html` | juillet 2026 | 2026-07-17 | FR | M4–M5 | 012–017 | vigente | `f2dd2c4` |
| Source Pandoc M4/M5 | `TECWMS_GUIDE_ETUDIANT_M4_M5_PREPARATION_CERTIFICATION_PDF_READY.md` | juillet 2026 | 2026-07-17 | FR | M4–M5 | 012–017 | **source de vérité** | `f2dd2c4` |
| Guide étudiant M1–M3 PDF | `TECWMS_GUIDE_M1_M3.pdf` | juillet 2026 | 2026-07-17 | FR | M1–M3 | 001–011 | vigente (autre pack) | `f2dd2c4` |

### 2.2 SUBSTITUÉ / NON OFFICIEL POUR DISTRIBUTION JUILLET

| Nom | Chemin | Version | Date | Lang | Status | Notes |
|-----|--------|---------|------|------|--------|-------|
| Préparation M4/M5 (non PDF_READY) | `TECWMS_GUIDE_ETUDIANT_M4_M5_PREPARATION_CERTIFICATION.md` | juin lineage | ~2026-07-11 | FR | substitué | untracked |
| Learning guide | `STUDENT_READY_M4_M5_LEARNING_GUIDE_FR.md` | 2026-06-19 | ~2026-07-11 | FR | substitué / prep | untracked ; mot-clé framing plus fort |
| Writing guide | `STUDENT_WRITING_GUIDE_M4_M5_FR.md` | juin | ~2026-07-11 | FR | historique | untracked |
| Keywords sheet | `STUDENT_READY_M4_M5_KEYWORDS_FR.md` | juin | ~2026-07-11 | FR | **historique — risque** | contredit l’esprit « pas de mots magiques » du guide juillet |
| Réponses étudiants FINAL | `GUIDE_ETUDIANTS_REPONSES_M4_M5_FINAL.md` | juin 19 | git 2026-07-01 | FR | substitué | `d5e1441` ; phrases modèles |
| Réponses officiel | `GUIDE_OFFICIEL_REPONSES_M4_M5.md` | juin | git 2026-07-01 | FR | substitué | `cb2f132` ; plafond 75/100 historique |
| Dossier juin PDF M4/M5 | `Dossier_Institutionnel_…/02_Pedagogie/TECWMS_GUIDE_M4_M5.pdf` | juin 2026 | 2026-06-23 | FR | substitué | SHA différent du juillet |
| Dossier juin DOCX | même dossier `.docx` | juin | 2026-06-23 | FR | substitué | |

### 2.3 RUNTIME / IN-APP (complément vivant — FR+EN)

| Nom | Chemin | Lang | Modules | Status |
|-----|--------|------|---------|--------|
| Slides M4/M5 | `client/src/data/modules.ts` (+ `modules_m4m5_tail.ts`) | FR+EN | M4–M5 | vigente runtime |
| Glossaire | `client/src/data/glossary.ts` | FR+EN | transversal | vigente (pas de PDF glossaire) |
| Fiche Mission | `server/missionDataExtended.ts` + `MissionSheet.tsx` | FR+EN | SCN | vigente (pas de pack PDF) |
| Annexe A (bandes) | embarquée guide juillet + `m4KpiBandUtils.ts` / KPI tower | FR | M4 | vigente embarquée |
| Hints analytiques | `AnalyticalStepHints.tsx` | FR+EN | M4–M5 | vigente |
| Cockpit pédagogie | `scenarioCockpitPedagogy.ts` | FR+EN | 012–017 | vigente |
| Debrief | `shared/enterprise/debrief.ts` | FR+EN | modules | vigente |

### 2.4 CADRE PROGRAMME / ENSEIGNANT (pas handout étudiant scénario)

| Nom | Chemin | Status |
|-----|--------|--------|
| Matrice BRIDGE / rôles | `Projects/TEC.WMS/03_PEDAGOGY/Competency_Framework.md` | cadre programme |
| Guide professeur | `docs/pedagogy/GUIDE_PROFESSEUR_*`, `MASTER_INSTRUCTOR_HANDBOOK.*` | enseignant |
| Guide enseignant | `TECWMS_GUIDE_ENSEIGNANT.*` | enseignant |
| Programme officiel | `TECWMS_GUIDE_PROGRAMME_OFFICIEL.*` | programme |
| Canons correcteur | `SCN01[2-7]_CANONICAL_RESPONSES.md`, `SCN012_SCN014_RUNTIME_SAFE_CANONICALS.md` | interne QA |
| Mission sheet standard (BRIDGE) | `MISSION_SHEET_MASTER_STANDARD.md` | authoring |

### 2.5 Absences explicites

| Attendu | Résultat |
|---------|----------|
| Glossaire PDF autonome | Absent (in-app seulement) |
| Fiches Mission PDF pack | Absent (in-app) |
| Annexe A PDF autonome | Absent (dans le guide + UI) |
| Guide étudiant EN PDF M4/M5 | Absent |
| Slides deck PDF M4/M5 étudiants | Assets PNG VLS seulement |

---

## 3. Contrat pédagogique extrait du guide JULIET (source #2)

### Principes transversaux

1. **Utilisez vos propres mots** — pas de phrase unique obligatoire.
2. **Pas de listes de mots magiques obligatoires.**
3. M4 = Observer → Classifier → Décider → Suivre (analyste / tour de contrôle).
4. M5 = Exécuter → Vérifier → Interpréter → Décider (gestionnaire / session).
5. Seuil **70/100** par scénario.
6. Bandes Annexe A : rotation **4–12×** ; OTIF **≥95 %** ; erreurs **1–5 %** ; délai **3–7 j**.

### SCN-012 (contrat)

- Classer 6× dans bande normale (pas surstock).
- Maintenir / ne pas réduire massivement.
- Suivi / surveillance articles lents.
- Exemples officiels :
  - « La rotation est normale. Je **maintiens** la politique et je **surveille** les articles qui tournent lentement. »
  - « Résultat **équilibré** : **conserver** le niveau global avec un **contrôle** régulier des produits. »

### SCN-013 → 017

- Voir guide § SCN-013…017 (OTIF+erreurs+qualité+SLA ; S&OP priorité/compromis/horizon ; M5 Q=0 ; SCN-016 50/45/−5 → 45 Min10 Q=0 ; SCN-017 preuves session).

### BRIDGE

- Cadre programme TEC.LOG BRIDGE (Competency_Framework) : Analyste=M4, Gestionnaire=M5.
- Guide juillet utilise chaînes courtes (pas l’acronyme BRIDGE en première ligne) — **cohérent** avec Analyse et Décision, sans contradiction matérielle.

---

## 4. Divergences documentées (doc → système)

| ID | Élément | Doc juillet | Système actuel | Sévérité | Décision |
|----|---------|-------------|----------------|----------|----------|
| D1 | Exemple « Je maintiens » | Accepté / enseigné | Stem `mainten` **ne matche pas** `maintiens` / `maintient` → `maintain_policy` manquant | **MATÉRIELLE** | Corriger validator (conjugaisons FR) |
| D2 | Exemple « conserver…contrôle » | Accepté | Compliance OK, mais `scoreKpiInterpretation(diagnostic)` exige `CG_ACTION_VOCAB` (`recommand`/`action`/`stratégie`/`décision`) → **0 pts diagnostic** | **MATÉRIELLE** | Aligner scoring sur blocs conceptuels (stance pro), pas mots littéraux |
| D3 | « Pas de mots magiques » | Explicit | Concept groups encore lexicalement étroits sur certains verbes | **MATÉRIELLE** | Élargir synonymes / codes conceptuels |
| D4 | Session 000658 réponses QA | Reject per doc | Reject per validator | Alignés | Cause A — réponses incorrectes |
| D5 | Recovery même run | Doc implique correction possible | `addKpiInterpretation` **INSERT only** ; compliance `.find()` = **première** ligne | **MATÉRIELLE** | Latest-wins + upsert |
| D6 | Keywords sheet juin | Non oficial | Contredit guide juillet | Doc | Ne pas redistribuer |
| D7 | Plafond 75/100 (guides réponses juin) | Juillet : seuil 70 | Scoring max 100 possible | Mineure | Doc julio prevalece |
| D8 | scenarioId 12 vs canonical 34 | SCN-012 | Run 658 utilise id **12** (résolu SCN-012 via name/id) | À surveiller | Vérifier start path utilise canonical 34 |
| D9 | Analytics BI pédagogique | Guide parle tour de contrôle | UI KPI tiles existent mais faibles vs brief hotfix | Produit | Améliorer couche analytique |
| D10 | James mid-scenario | Politique demo | 7 runs `in_progress` (658,660,665,672,674,675,676) | Gouvernance | Cleanup obligatoire via `admin.prepareDemoReadiness` |
| D11 | Annexe A UI `>12× = excellent` | Guide: sous-performance | `m4KpiControlTower` / `m5KpiDisplayUtils` | **MATÉRIELLE** | Corrigé — aligné guide juillet + `calculateKpis` |
| D12 | OTIF critique UI `<90%` | Guide/engine `<85%` | labels Annexe A | Mineure→fixée | Aligné 85–94 acceptable / ≥95 excellent |

---

## 5. Verdict DOCUMENTATION QA GATE (post-corrections code — pré-deploy)

| Gate | Statut |
|------|--------|
| Document vigente identifié | **PASS** — `TECWMS_GUIDE_M4_M5.pdf` juillet / `f2dd2c4` |
| Documentation lue (source PDF_READY) | **PASS** |
| M4 aligné doc↔validator | **PASS unit** — D1/D2/D5/D11 corrigés en code ; smoke prod pending |
| M5 aligné | **PASS unit** (tests concept) ; smoke prod pending |
| Formules / bandes | **PASS** (Annexe A UI alignée guide) |
| Terminologie | **PASS** (`maintiens` accepté) |
| Screenshots | Non bloquant |
| Validators alignés | **PASS unit** — exemples officiels guide PASS |
| Reports alignés | Pending smoke |
| FR/EN | Guide FR only ; UI bilingue — acceptable |
| Aucun doc livré ne contredit production | **HOLD** jusqu’au deploy + smoke prod |

**Verdict documentation :** **HOLD** (code corrigé localement ; production pas encore alignée).

**Changement doc étudiant requis :** **NON** — le guide juillet reste correct ; la plateforme a été corrigée pour le respecter.

---

## 6. Forensique session 000658 (rappel)

| Champ | Valeur |
|-------|--------|
| Session UI | `000658` |
| runId | 658 |
| userId | 222 James Timothy |
| scenarioId | 12 → SCN-012 |
| progress | 80 % · COMPLIANCE_M4 |
| rotationRate | `"Rotation 6×."` · isCorrect **false** |
| serviceLevel | `"Service 95%."` · isCorrect **false** |
| diagnostic | `"Surstock massif — liquidation globale immédiate…"` · isCorrect **false** |

**Classification causes :**

- **A** QA answer incorrect — **prouvé** (réponses contredisent le guide et le validator).
- **H** UI/hint/validator vs doc — **prouvé séparément** via exemples officiels (D1/D2), pas via 658.
- **G** recovery path fragile — **prouvé** (insert-only + find first).

Ne pas « patcher » 658 pour forcer PASS ; corriger le contrat technique pour que les réponses **conformes au guide** passent, puis cleanup James.
