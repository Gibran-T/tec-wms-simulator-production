# TEC.WMS RC13 — Final Manual Validation Checklist

**Programme:** TEC.WMS · TEC.LOG  
**Release candidate:** RC13  
**Document type:** Manual validation only — no code, no deployment, no implementation  
**Date:** 2026-06-18  
**Platform:** `https://tec-wms-simulator-production-production.up.railway.app`

---

## Pre-flight (stop if any item fails)

- [ ] Target URL loads (`/` and `/login` without blocking JS errors)
- [ ] Teacher account can log in and reach `/teacher`
- [ ] Record validator name, date/time, and browser used below

| Field | Value |
|-------|-------|
| Validator | |
| Date / time | |
| Browser | |
| Deployment HEAD (if known) | |

---

## 1. Aissata — Silver Certification

**Account:** Aissata Soukeina Camara · `aissatasoukeinacamara@gmail.com`  
**Student number:** `2026-1806`  
**Expected certificate ID:** `TEC-SIL-2026-001`

Log in as Aissata → navigate to **Certifications** (`/student/certifications`).

| # | Check | Expected | Pass | Fail | Notes |
|---|-------|----------|:----:|:----:|-------|
| 1.1 | **Silver status** | Silver tier visible; status chip shows **Obtenue** (FR) or **Obtained** (EN) | ☐ | ☐ | |
| 1.2 | **100%** | Overall progression shows **100%** (or equivalent complete state on dashboard / certifications) | ☐ | ☐ | |
| 1.3 | **Certificate ID** | ID **`TEC-SIL-2026-001`** displayed on Certifications page | ☐ | ☐ | |
| 1.4 | **Preview** | Certificate preview opens; shows institutional layout, student name, Silver badge, and **`TEC-SIL-2026-001`**; no routing loop on back navigation | ☐ | ☐ | |

**Section 1 result:** ☐ PASS · ☐ FAIL

---

## 2. James — Module 4 (M4)

**Account:** James Timothy · `jamesnns3@gmail.com`  
**Role:** Demo / professor student (no Silver registry entry)  
**Module route:** `/student/module4`  
**Mode:** Evaluation (`isDemo: false`) where applicable

| # | Check | Expected | Pass | Fail | Notes |
|---|-------|----------|:----:|:----:|-------|
| 2.1 | **M4 access** | Module 4 page loads; SCN-012 / SCN-013 / SCN-014 are selectable (not blocked by M1–M3 gate) | ☐ | ☐ | |
| 2.2 | **SCN-012** | Scenario opens (canonical ID **34**); eval run can start; Mission Sheet / KPI pipeline loads | ☐ | ☐ | |
| 2.3 | **SCN-013** | Scenario opens (canonical ID **35**); eval run can start; compliance step reachable | ☐ | ☐ | |
| 2.4 | **SCN-014** | Scenario opens (canonical ID **36**); eval run can start; compliance step reachable | ☐ | ☐ | |

**Section 2 result:** ☐ PASS · ☐ FAIL

---

## 3. James — Module 5 (M5)

**Account:** James Timothy · `jamesnns3@gmail.com` (same session as §2)  
**Module route:** `/student/module5`  
**Mode:** Evaluation where applicable

| # | Check | Expected | Pass | Fail | Notes |
|---|-------|----------|:----:|:----:|-------|
| 3.1 | **M5 access** | Module 5 page loads; SCN-015 / SCN-016 / SCN-017 are selectable (not blocked by prerequisite gate) | ☐ | ☐ | |
| 3.2 | **SCN-015** | Scenario opens (canonical ID **37**); eval run can start; Peak Week Day 1 pipeline loads | ☐ | ☐ | |
| 3.3 | **SCN-016** | Scenario opens (canonical ID **38**); eval run can start; M5_ADJ step present when applicable | ☐ | ☐ | |
| 3.4 | **SCN-017** | Scenario opens (canonical ID **39**); eval run can start; strategic capstone / Gold-path messaging visible | ☐ | ☐ | |

**Section 3 result:** ☐ PASS · ☐ FAIL

---

## 4. Teacher — Cohorte Fondatrice Roster

**Account:** Teacher (e.g. `prof@teclog.ca` or institutional teacher login)  
**Route:** `/teacher/students` (or cohort filter on Teacher Dashboard)

| # | Check | Expected | Pass | Fail | Notes |
|---|-------|----------|:----:|:----:|-------|
| 4.1 | **Cohorte Fondatrice roster** | Cohort **`Cohorte Fondatrice · Session 2025–2026`** (ID **1**) lists exactly **5** students | ☐ | ☐ | |

**Expected roster (all five must appear):**

| # | Name | Email |
|---|------|-------|
| 1 | Aissata Soukeina Camara | aissatasoukeinacamara@gmail.com |
| 2 | Darlin Campaz Paredes | dcparedes2010@gmail.com |
| 3 | Fredy Tamile Lola | fredlolabio@gmail.com |
| 4 | Prince Agbodjan Sewa Francis Ghislain | sewafrancispa@gmail.com |
| 5 | James Timothy | jamesnns3@gmail.com |

**Section 4 result:** ☐ PASS · ☐ FAIL

---

## Final Sign-off

| Section | Result |
|---------|--------|
| 1 — Aissata Silver | ☐ PASS · ☐ FAIL |
| 2 — James M4 | ☐ PASS · ☐ FAIL |
| 3 — James M5 | ☐ PASS · ☐ FAIL |
| 4 — Teacher roster | ☐ PASS · ☐ FAIL |

**Overall RC13 manual validation:** ☐ **GO** · ☐ **NO-GO**

**Blockers (if any):**

```
```

**Validator signature / confirmation:**

```
```

---

*Checklist derived from RC13 cohort backfill, Silver visual validation, M4/M5 scenario validation, and final smoke execution guide. Credentials are institutional — do not commit passwords to the repository.*
