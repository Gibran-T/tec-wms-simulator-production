# ODOO Removal Alignment Report — RC16

**Date:** 2026-07-01  
**Scope:** Pedagogical / content alignment — Odoo no longer part of course delivery  
**Official environment:** TEC.WMS simulator only  
**Business logic:** Unchanged (scoring, certification, cohort)

---

## 1. Executive summary

Institutional decision RC16 is implemented in all **course-facing** surfaces: slides, Mission Control, professor/student guides, and pedagogy audits. Three Odoo demonstration slides (M2-S6, M3-S6, M4-S6) were **replaced** with TEC.WMS consolidation slides. The teacher-only **Odoo Lab** panel in Mission Control was **removed**.

Forbidden patterns (`Odoo EDU LAB`, `OPEN ODOO LAB`, `Odoo Menu`, course-environment Odoo slides) no longer appear in `client/` user-visible content.

**Final status:** **PASS** — course delivery aligned; neutral ERP market references retained where appropriate.

---

## 2. Files scanned

| Category | Count | Notes |
|----------|------:|-------|
| Repository-wide pattern search | 28 files | Odoo / EDU LAB / ERPNext |
| `client/` (student + teacher UI) | 3 files | modules.ts, MissionControl.tsx, stepErpMap.ts |
| `docs/pedagogy/` | 16 files | Guides, audits, PDFs |
| Root guides (TECWMS_GUIDE_*, GUIDE_*) | 8 files | Programme, enseignant, réponses M4–M5 |
| `server/` mission data | 2 files | missionData.ts, missionDataExtended.ts |
| Historical RC/SCN audit docs | 9 files | Not modified (archive) |

---

## 3. Occurrences found (pre-change)

| Classification | Count | Examples |
|----------------|------:|----------|
| **A — Must remove** | 24 | Odoo slides in modules.ts, Mission Control Odoo Lab link, Guide Enseignant “SAP/Odoo” as simulator env, M4 slide map “Odoo Reports” |
| **B — Replace with TEC.WMS** | 3 | M2/M3/M4 slide 6 content |
| **C — Allowed neutral reference** | 6 | ERP market list (SAP, Odoo, Oracle, Dynamics); PME example in Master Handbook; external cert mention |
| **D — Human review (unchanged)** | 56 | `odooEquivalent` in stepErpMap / missionData (not displayed in UI); SCN canonical response tables; historical RC13/RC14 audits |

---

## 4. Changes applied

### 4.1 Removed (Category A)

| File | Change |
|------|--------|
| `client/src/pages/student/MissionControl.tsx` | Removed entire teacher “Prof Demo — Odoo Lab” block and `edu-concorde-logistics-lab.odoo.com` link |
| `TECWMS_GUIDE_ENSEIGNANT_PDF_READY.md` | Removed Odoo as simulator environment descriptor |
| `TECWMS_GUIDE_ENSEIGNANT.html` | Same |
| `docs/pedagogy/PROFESSOR_EXPERIENCE_AUDIT.md` | Removed all Odoo lab / optional Odoo teaching guidance (18 edits) |
| `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_M2.md` | Odoo slide section removed |
| `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_M3.md` | Odoo slide section removed |
| `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_M4.md` | Odoo slide section removed |
| `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_MASTER_REPORT.md` | Odoo EDU LAB narrative removed |

### 4.2 Replaced with TEC.WMS (Category B)

| File | Before | After |
|------|--------|-------|
| `client/src/data/modules.ts` M2-S6 | Configuration Odoo — Entrepôt | **Consolidation TEC.WMS — Layout entrepôt** |
| `client/src/data/modules.ts` M3-S6 | Règles de réapprovisionnement Odoo | **Consolidation TEC.WMS — Réapprovisionnement** |
| `client/src/data/modules.ts` M4-S6 | Rapports Odoo | **Consolidation TEC.WMS — Tableaux de bord KPI** |
| `TECWMS_GUIDE_ENSEIGNANT_*` M4 slide map row 6 | Odoo Reports (démo) | Consolidation TEC.WMS — KPI Control Tower |
| `GUIDE_OFFICIEL_REPONSES_M4_M5.md` | Column header `WMS / Odoo` | `Fonction WMS (TEC.WMS)` |

### 4.3 Wording alignment (Category A → neutral)

| File | Change |
|------|--------|
| `TECWMS_GUIDE_PROGRAMME_OFFICIEL_PDF_READY.md` | `terminologie SAP/Odoo` → `terminologie SAP et ERP/WMS` |
| `TECWMS_GUIDE_PROGRAMME_OFFICIEL.html` | Same |

---

## 5. Allowed neutral references (Category C — retained)

| File | Reference | Rationale |
|------|-----------|-----------|
| `TECWMS_GUIDE_PROGRAMME_OFFICIEL_PDF_READY.md` | ERP (SAP, Odoo, Oracle, Microsoft Dynamics) | Market ecosystem comparison |
| `TECWMS_GUIDE_PROGRAMME_OFFICIEL_PDF_READY.md` | Certification SAP ou Odoo professionnelle | External professional certs — not course tool |
| `docs/pedagogy/MASTER_INSTRUCTOR_HANDBOOK.md` | SAP Business One / Odoo (PME québécoise) | Neutral market analogy |
| `docs/pedagogy/GUIDE_PROFESSEUR_QA_REVIEW_RC16.md` | Documents Odoo suppression QA criteria | Meta QA record |

---

## 6. Remaining references requiring approval (Category D)

| Location | Count | Recommendation |
|----------|------:|----------------|
| `client/src/data/stepErpMap.ts` | 35 | **Keep** — `odooEquivalent` field not rendered in UI; internal ERP mapping only |
| `server/missionData.ts` | 5 | **Keep** — same; `sapEquivalent` shown in UI, not Odoo |
| `server/missionDataExtended.ts` | 12 | **Keep** — server-side reference data |
| `SCN015/016/017_CANONICAL_RESPONSES.md` | 3 | **Optional rename** — column “Odoo equivalent” could become “ERP ecosystem equivalent” in future pass |
| `RC13_RELEASE_GAP_ANALYSIS.md` | 3 | **Archive** — historical; documents retired Odoo EDU LAB links |
| `RC14_M3_PREMIUM_INTELLIGENCE_AUDIT.md` | 2 | **Archive** |
| `Documentation/*.md` | 6 | **Archive** — pre-RC16 execution plans |
| `todo.md` | 2 | **Dev backlog** — “Odoo Level” UI aspiration; not course-facing |

No action required for certification, scoring, or cohort logic.

---

## 7. PDFs regenerated

| PDF | Source changed? | Regenerated? |
|-----|-----------------|--------------|
| `GUIDE_PROFESSEUR_TECWMS_10_CLASSES_RC16.pdf` | No (already Odoo-free per QA RC16) | **No** |
| `GUIDE_PROFESSEUR_QUICK_REFERENCE.pdf` | No | **No** |
| `MASTER_INSTRUCTOR_HANDBOOK.pdf` | No (only allowed neutral ref) | **No** |

**Note:** `TECWMS_GUIDE_ENSEIGNANT` and `TECWMS_GUIDE_PROGRAMME_OFFICIEL` HTML/PDF_READY sources were updated; institutional PDF regeneration for those guides is out of RC16 scope unless requested separately.

---

## 8. Validation results

| Check | Result |
|-------|--------|
| Forbidden patterns in `client/` UI | **PASS** — no Odoo EDU LAB, Odoo Lab link, or Odoo slides |
| Student-facing slides (`modules.ts`) | **PASS** — M2/M3/M4-S6 = TEC.WMS consolidation |
| Professor-facing Mission Control | **PASS** — Odoo Lab panel removed |
| Guide Professeur RC16 + Quick Reference | **PASS** — no Odoo course references |
| Student guides M1–M3 / M4–M5 | **PASS** — no Odoo hits in `TECWMS_GUIDE_ETUDIANT_*` |
| Slides do not present Odoo as course activity | **PASS** |
| TEC.WMS remains official environment | **PASS** — explicit on all replacement slides |
| Business logic unchanged | **PASS** — no server rule/scoring/cohort edits |

### Post-change forbidden-pattern scan

```
Odoo EDU LAB | OPEN ODOO LAB | Odoo Lab | edu-concorde | Odoo Menu | Configuration Odoo
→ 0 hits in client/ and course-facing guides
→ 3 hits in historical Documentation/ and RC13 archive only
```

---

## 9. Files changed (this task)

1. `client/src/data/modules.ts`
2. `client/src/pages/student/MissionControl.tsx`
3. `TECWMS_GUIDE_ENSEIGNANT_PDF_READY.md`
4. `TECWMS_GUIDE_ENSEIGNANT.html`
5. `TECWMS_GUIDE_PROGRAMME_OFFICIEL_PDF_READY.md`
6. `TECWMS_GUIDE_PROGRAMME_OFFICIEL.html`
7. `GUIDE_OFFICIEL_REPONSES_M4_M5.md`
8. `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_M2.md`
9. `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_M3.md`
10. `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_M4.md`
11. `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_MASTER_REPORT.md`
12. `docs/pedagogy/PROFESSOR_EXPERIENCE_AUDIT.md`
13. `docs/pedagogy/ODOO_REMOVAL_ALIGNMENT_REPORT.md` (this file)

---

## 10. Final status

| Item | Status |
|------|--------|
| RC16 Odoo removal — course delivery | **COMPLETE** |
| Commit recommended | **Yes** — content-only, validation clean |
| Deploy required | **No** — pedagogical alignment only |

**Proposed commit message:**

```
Align course content with RC16: remove Odoo as teaching environment.

Replace M2/M3/M4 Odoo slides with TEC.WMS consolidation, remove Mission
Control Odoo Lab panel, and update enseignant/programme guides. TEC.WMS
is the sole official course environment; neutral ERP market references retained.
```
