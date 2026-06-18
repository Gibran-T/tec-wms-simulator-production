# TEC.WMS — RC13 Cohorte Fondatrice Execution Report

**Document type:** Execution report  
**Repository:** `tec-wms-simulator-production`  
**Branch / HEAD:** `production-hotfix-rc13-pedagogy-class6` @ `cb1ca10`  
**Platform:** `https://tec-wms-simulator-production-production.up.railway.app`  
**Executed:** 2026-06-18  
**Mode:** Railway API only · No application code changes · No migrations  

---

## Executive Summary

| Area | Result |
|------|--------|
| **Cohorte Fondatrice bootstrap** | **GO** — 5/5 students provisioned, cohort assigned, student numbers set |
| **Silver registry lookup** | **GO** — 4/4 Silver students compatible |
| **Teacher cohort view** | **GO** — 5 students visible in cohort ID 1 |
| **M4 smoke (SCN-012–014)** | **NO-GO** — 0/3 pass (module progression gate) |
| **M5 smoke (SCN-015–017)** | **NO-GO** — 0/7 pass (module progression gate) |
| **Final verdict** | **YELLOW** |

**Interpretation:** The founding cohort is ready for credential handoff and first login. Class 9/10 scenario smoke cannot complete on fresh student accounts until Module 1 (and Module 3 teacher validation for M4) progression is satisfied by normal system logic. No code or DB bypass was used.

---

## 1. Students Created

| # | Name | Email | User ID | Account status |
|---|------|-------|---------|----------------|
| 1 | Aissata Soukeina Camara | aissatasoukeinacamara@gmail.com | 184 | Pre-existing (session 1) |
| 2 | Darlin Campaz Paredes | dcparedes2010@gmail.com | 213 | **CREATED** (this session) |
| 3 | Fredy Tamile Lola | fredlolabio@gmail.com | 216 | **CREATED** |
| 4 | Prince Agbodjan Sewa Francis Ghislain | sewafrancispa@gmail.com | 219 | **CREATED** |
| 5 | James Timothy | jamesnns3@gmail.com | 222 | **CREATED** |

**API path:** `auth.localLogin` (teacher) → `students.create` (teacher re-authenticated before each call)  
**Result:** 5/5 accounts exist on Railway with local auth.

Initial passwords match the institutional roster (not repeated in this report).

---

## 2. Cohort Assignment Status

| Field | Value |
|-------|-------|
| Cohort ID | `1` |
| Cohort name | `Cohorte Fondatrice · Session 2025–2026` |
| Assignment API | `students.assignCohort` + `profiles.upsert` |

| Email | cohortId | Status |
|-------|----------|--------|
| aissatasoukeinacamara@gmail.com | 1 | ASSIGNED |
| dcparedes2010@gmail.com | 1 | ASSIGNED |
| fredlolabio@gmail.com | 1 | ASSIGNED |
| sewafrancispa@gmail.com | 1 | ASSIGNED |
| jamesnns3@gmail.com | 1 | ASSIGNED |

**Teacher view verification:** `students.list({ cohortId: 1 })` → **5 students** (PASS)

---

## 3. Student Number Status

| Student | Expected | Actual | Status |
|---------|----------|--------|--------|
| Aissata | `2026-1806` | `2026-1806` | OK |
| Darlin | `00-2004` | `00-2004` | OK |
| Fredy | `1011-KF` | `1011-KF` | OK |
| Prince | `613-462` | `613-462` | OK |
| James | *(none)* | `null` | N/A |

**API path:** Student self-service `profiles.upsert` (approved flow per bootstrap plan Path A).  
**Note:** `silverCertified` was **not** set manually on any account.

---

## 4. Silver Registry Lookup Status

Static registry: `shared/silverCertificationRegistry.ts` @ `cb1ca10`

| Student | studentNumber | Expected cert | Registry cert | Lookup |
|---------|---------------|---------------|---------------|--------|
| Aissata | `2026-1806` | TEC-SIL-2026-001 | TEC-SIL-2026-001 | **COMPATIBLE** |
| Darlin | `00-2004` | TEC-SIL-2026-002 | TEC-SIL-2026-002 | **COMPATIBLE** |
| Prince | `613-462` | TEC-SIL-2026-004 | TEC-SIL-2026-004 | **COMPATIBLE** |
| Fredy | `1011-KF` | TEC-SIL-2026-003 | TEC-SIL-2026-003 | **COMPATIBLE** |

**Display note:** Certificate ID appears on `/student/certifications/silver` only when `silverCertified = true` (earned via M1 pathway). Lookup compatibility is confirmed; earned Silver UI was not expected on day-zero accounts.

---

## 5. Scenario Readiness (Railway IDs 12–17)

| SCN | DB ID | Accessible | Launchable | Completion path | Blocker |
|-----|-------|------------|------------|-----------------|---------|
| SCN-012 | 12 | Yes | No | No | Module 1 not passed |
| SCN-013 | 13 | Yes | No | No | Module 1 not passed |
| SCN-014 | 14 | Yes | No | No | Module 1 not passed |
| SCN-015 | 15 | Yes | No | No | Module 1 not passed |
| SCN-016 | 16 | Yes | No | No | Module 1 not passed |
| SCN-017 | 17 | Yes | No | No | Module 1 not passed |

**Error returned by `runs.start` (eval mode):**  
`Module 2 verrouillé — complétez le Module 1 d'abord.`

**Additional M4 gate (when M1 passed):**  
`Module 4 verrouillé — validation enseignant du Module 3 requise.` (`runs.start` server gate P0-07)

Scenarios are present in catalog (17 total). Launch blocked by **existing progression rules**, not missing seed data.

---

## 6. M4 Smoke Result (Class 9)

**Probe account:** Aissata Soukeina Camara  
**Scenario IDs:** 12, 13, 14  
**Mode:** Evaluation (`isDemo: false`)

| SCN | ID | Pass | Score | Error |
|-----|----|------|-------|-------|
| SCN-012 | 12 | FAIL | — | Module 1 progression gate |
| SCN-013 | 13 | FAIL | — | Module 1 progression gate |
| SCN-014 | 14 | FAIL | — | Module 1 progression gate |

**M4 smoke verdict:** **NO-GO** (0/3) — not a runtime defect; fresh cohort accounts have no module progress.

---

## 7. M5 Smoke Result (Class 10)

**Runner:** `.manus-logs/wave4-smoke-runner.mjs`  
**Probe account:** Aissata Soukeina Camara  
**Scenario IDs:** 15, 16, 17  
**Executed:** 2026-06-18T01:33:20Z

| Test ID | SCN | Pass | Blocker |
|---------|-----|------|---------|
| V4-M1 | SCN-015 | FAIL | Module 1 progression gate |
| V4-M2–M4 | SCN-016 | FAIL | Module 1 progression gate |
| V4-M5–M7 | SCN-017 | FAIL | Module 1 progression gate |

**Summary:** `0/7 PASS`

**M5 smoke verdict:** **NO-GO** — same progression gate as M4 readiness.

---

## 8. Validation Checklist (Required)

| # | Requirement | Result |
|---|-------------|--------|
| 1 | Account creation path | **PASS** — `students.create` |
| 2 | Login path | **PASS** — all 5 students |
| 3 | Student profile creation | **PASS** — `profiles` row on upsert/cohort assign |
| 4 | studentNumber persistence | **PASS** — 4/4 Silver numbers exact |
| 5 | Silver registry lookup | **PASS** — 4/4 COMPATIBLE |
| 6 | Teacher cohort management | **PASS** — 5 in cohort ID 1 |
| 7 | Student scenario access (catalog) | **PASS** — 17 scenarios listed |
| 8 | SCN-012–017 launch/completion smoke | **FAIL** — progression gate on fresh accounts |

---

## 9. Files Changed

| File | Type | Notes |
|------|------|-------|
| `Documentation/RC13_COHORTE_EXECUTION_REPORT.md` | **New** | This deliverable |
| `.manus-logs/rc13-cohorte-execution.mjs` | Untracked | Operator script (session 1) |
| `.manus-logs/rc13-cohorte-continue.mjs` | Untracked | Operator script (session 2) |
| `.manus-logs/rc13-smoke-railway.mjs` | Untracked | M4/readiness smoke helper |
| `.manus-logs/rc13-smoke-railway-results.json` | Untracked | Smoke output |
| `.manus-logs/rc13-m5-smoke-railway.json` | Untracked | M5 smoke output |

**No tracked application code, migrations, scoring, Silver, Gold, or M4/M5 pedagogy files were modified.**

---

## 10. Commit Recommendation

**No commit required** for cohort bootstrap itself (Railway state only).

**Optional commit (documentation only):**

```
docs(rc13): add Cohorte Fondatrice execution report
```

Include only `Documentation/RC13_COHORTE_EXECUTION_REPORT.md`. Do **not** commit `.manus-logs/` operator scripts or smoke JSON unless explicitly requested.

---

## 11. Recommended Next Steps (Operator)

1. **Credential handoff** — distribute Railway URL + per-student passwords to Collège de la Concorde instructor.
2. **Class progression** — students complete Modules 1–3 through normal eval runs; teacher validates Module 3 (`validateTeacherModule`) to unlock M4.
3. **Re-run S-10 / S-11** — after progression, repeat smoke with IDs **12–17** on any cohort student (or dedicated smoke account with progress).
4. **Do not** bypass progression via SQL or manual `silverCertified` flags.

---

## Final Verdict

> **YELLOW**

| Component | Verdict |
|-----------|---------|
| Cohorte Fondatrice bootstrap | **GO** |
| Silver lookup readiness | **GO** |
| Class 9 (M4) smoke | **NO-GO** (progression) |
| Class 10 (M5) smoke | **NO-GO** (progression) |
| **Overall RC13 cohort cutover** | **YELLOW** — ready for first class login; scenario smoke deferred until module gates cleared |

---

*Report generated from live Railway API execution. Evidence artifacts: `.manus-logs/rc13-smoke-railway-results.json`, `.manus-logs/rc13-m5-smoke-railway.json`.*
