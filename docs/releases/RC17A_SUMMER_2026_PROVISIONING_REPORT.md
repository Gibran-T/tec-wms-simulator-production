# RC17-A — Summer 2026 Cohort Provisioning Report

**Document type:** Institutional operational provisioning report  
**Programme:** TEC.LOG — Collège de la Concorde  
**Operation:** RC17-A — Summer 2026 Institutional Student Enrollment  
**Production URL (Railway):** `https://tec-wms-simulator-production-production.up.railway.app`  
**Executed:** 2026-07-02T18:16:58Z  
**Report date:** 2026-07-02  
**Mode:** Documentation only — no production code, schema, API, Railway, checkpoint, certification, Mission Control, analytics, or dashboard changes  

**Prior baseline:** [`RC16_INSTITUTIONAL_DOCUMENTATION_BASELINE.md`](RC16_INSTITUTIONAL_DOCUMENTATION_BASELINE.md) — RC16 Institutional Baseline (2026-07-02)

---

## Executive verdict

# SUMMER 2026 COHORTS PROVISIONED

**Status: READY FOR WELCOME EMAILS**

Six institutional student accounts were provisioned in production across **Cohorte Été 2026 — Groupe A** and **Cohorte Été 2026 — Groupe B**. Post-provisioning validation confirmed authentication, dashboard access, scenario catalog availability, cohort assignment, and isolation from the Cohorte Fondatrice. No scenarios were executed. No student progress was created. No certifications were generated.

**No code changes. No deployment.** Await institutional approval before welcome emails are sent.

---

## 1. Operation Summary

| Dimension | Result |
|-----------|--------|
| Production health (`/api/health`) | **PASS** |
| Students created | **6/6** |
| Cohort assignments | **6/6 ASSIGNED** |
| Student numbers set | **6/6 SET** |
| Unique emails | **PASS** |
| Unique student numbers | **PASS** |
| Login smoke (Groupe A + Groupe B) | **PASS** |
| Cohorte Fondatrice preservation | **PASS** |
| James Timothy unchanged | **PASS** |
| Silver certifications unchanged | **PASS** |
| Gold certifications unchanged | **PASS** |
| Summer cohort isolation | **PASS** |
| Code changes | **NONE** |
| Deployment | **NONE** |

**Provisioning method:** Teacher-authenticated production API (`auth.localLogin` → `students.create` → student `profiles.upsert` for institutional student numbers). Cohort records (IDs 2 and 3) were created during the prior RC15 operational cohort initialization; RC17-A assigned students only.

---

## 2. Production Environment

| Field | Value |
|-------|-------|
| Platform | Railway production |
| Base URL | `https://tec-wms-simulator-production-production.up.railway.app` |
| Operation timestamp | 2026-07-02T18:16:58Z |
| Teacher provisioning path | `students.create` + `profiles.upsert` |
| Student authentication | `auth.localLogin` (local accounts) |
| Password policy | Phone numbers normalized before storage (spaces, parentheses, `+`, hyphens removed) |

**Institutional constraint observed:** RC17-A was an operational database action only. No repository code, schema, or deployment artifacts were modified as part of this operation.

---

## 3. Cohort Inventory (Post-Provisioning)

| Cohort | ID | Students (post) | Status |
|--------|-----|-----------------|--------|
| Cohorte Fondatrice · Session 2025–2026 | 1 | 5 | **Unchanged** |
| Cohorte Été 2026 — Groupe A | 2 | 3 | **Provisioned** |
| Cohorte Été 2026 — Groupe B | 3 | 3 | **Provisioned** |

---

## 4. Students Created

### Cohorte Été 2026 — Groupe A

| # | Name | Email | Student Number | Account Status | Cohort Status |
|---|------|-------|----------------|----------------|---------------|
| 01 | Anthony Antoine Tenguiano | tenguiano22@gmail.com | TECWMS-2026-A-001 | CREATED | ASSIGNED |
| 02 | Marc Arthur Dessin | marcarthurdessin@gmail.com | TECWMS-2026-A-002 | CREATED | ASSIGNED |
| 03 | Toumany Diakite | diaktoumany@gmail.com | TECWMS-2026-A-003 | CREATED | ASSIGNED |

### Cohorte Été 2026 — Groupe B

| # | Name | Email | Student Number | Account Status | Cohort Status |
|---|------|-------|----------------|----------------|---------------|
| 04 | Gnouma Camara | camarasvetagnouma@gmail.com | TECWMS-2026-B-001 | CREATED | ASSIGNED |
| 05 | Willy Martial Kouganou Siani | kouganoumartial@gmail.com | TECWMS-2026-B-002 | CREATED | ASSIGNED |
| 06 | Yawo Valentin Sodokin | isaacsodokin@yahoo.fr | TECWMS-2026-B-003 | CREATED | ASSIGNED |

**Notes:**

- All six accounts were newly created in production (no pre-existing duplicates).
- Initial passwords were set at provisioning time per institutional enrollment policy. **Passwords are not recorded in this repository report**; they are held in the separate institutional communication package for welcome emails.
- Student numbers were confirmed via `profiles.upsert` after account creation.

---

## 5. Cohort Assignments

| Email | Student Number | Cohort | Cohort ID | Status |
|-------|----------------|--------|-----------|--------|
| tenguiano22@gmail.com | TECWMS-2026-A-001 | Cohorte Été 2026 — Groupe A | 2 | ASSIGNED |
| marcarthurdessin@gmail.com | TECWMS-2026-A-002 | Cohorte Été 2026 — Groupe A | 2 | ASSIGNED |
| diaktoumany@gmail.com | TECWMS-2026-A-003 | Cohorte Été 2026 — Groupe A | 2 | ASSIGNED |
| camarasvetagnouma@gmail.com | TECWMS-2026-B-001 | Cohorte Été 2026 — Groupe B | 3 | ASSIGNED |
| kouganoumartial@gmail.com | TECWMS-2026-B-002 | Cohorte Été 2026 — Groupe B | 3 | ASSIGNED |
| isaacsodokin@yahoo.fr | TECWMS-2026-B-003 | Cohorte Été 2026 — Groupe B | 3 | ASSIGNED |

---

## 6. Login Smoke Validation

Login smoke was performed for one student per summer cohort. No scenarios were launched. No progress records were created.

| Check | Groupe A (Anthony Antoine Tenguiano) | Groupe B (Gnouma Camara) |
|-------|--------------------------------------|--------------------------|
| Authentication (`auth.localLogin` + `auth.me`) | **PASS** | **PASS** |
| Student Dashboard (`warehouse.myProgress`) | **PASS** (0 modules) | **PASS** (0 modules) |
| Mission Control readiness (`scenarios.list`) | **PASS** (17 scenarios) | **PASS** (17 scenarios) |
| Cohort assignment (`profiles.mine`) | **PASS** (cohortId 2) | **PASS** (cohortId 3) |
| No Fondatrice access (no Silver/Gold, not cohort 1) | **PASS** | **PASS** |

---

## 7. Isolation Validation

| Check | Pre | Post | Result |
|-------|-----|------|--------|
| Fondatrice roster count | 5 | 5 | **PASS** |
| Fondatrice monitor runs | 111 | 111 | **PASS** |
| Fondatrice analytics records | 111 | 111 | **PASS** |
| Fondatrice gold roster | 5 | 5 | **PASS** |
| Groupe A runs / analytics | 0 / 0 | 0 / 0 | **PASS** |
| Groupe B runs / analytics | 0 / 0 | 0 / 0 | **PASS** |
| Fondatrice emails absent from summer rosters | — | — | **PASS** |

**Groupe A roster (verified):** diaktoumany@gmail.com, marcarthurdessin@gmail.com, tenguiano22@gmail.com  
**Groupe B roster (verified):** camarasvetagnouma@gmail.com, isaacsodokin@yahoo.fr, kouganoumartial@gmail.com

---

## 8. Cohorte Fondatrice Preservation

The five founding cohort members remain intact and unmodified:

| Student | Email | Cohort ID | Student Number | Silver | Gold |
|---------|-------|-----------|----------------|--------|------|
| Aissata Soukeina Camara | aissatasoukeinacamara@gmail.com | 1 | 2026-1806 | Certified | Certified |
| Darlin Campaz Paredes | dcparedes2010@gmail.com | 1 | 00-2004 | Certified | Certified |
| Fredy Tamile Lola | fredlolabio@gmail.com | 1 | 1011-KF | Certified | Certified |
| Prince Agbodjan Sewa Francis Ghislain | sewafrancispa@gmail.com | 1 | 613-462 | Certified | Certified |
| James Timothy | jamesnns3@gmail.com | 1 | 16183026 | Not certified | Not certified |

**Institutional rules confirmed:** no reset, no migration, no reassignment, certifications preserved, verification routes intact, dashboards and historical progress unchanged.

---

## 9. James Timothy — Demonstration Account

James Timothy (`jamesnns3@gmail.com`) remains the official institutional demonstration account.

| Field | Pre-provisioning | Post-provisioning | Result |
|-------|------------------|-------------------|--------|
| Cohort ID | 1 | 1 | **UNCHANGED** |
| Student number | 16183026 | 16183026 | **UNCHANGED** |
| Progress modules | 4 | 4 | **UNCHANGED** |
| M3 best score | 100 | 100 | **UNCHANGED** |
| Silver certified | false | false | **UNCHANGED** |
| Gold certified | false | false | **UNCHANGED** |

---

## 10. Silver / Gold Certification Integrity

### Founder Silver/Gold status (4 certified founders)

All four Silver-certified founders retained Silver and Gold certification status with unchanged student numbers.

### Public verification routes

| Certificate ID | HTTP Status |
|----------------|-------------|
| TECWMS-GOLD-2026-001 | 200 |
| TECWMS-GOLD-2026-002 | 200 |
| TECWMS-GOLD-2026-003 | 200 |
| TECWMS-GOLD-2026-004 | 200 |
| TECWMS-SIL-2026-001 | 200 |
| TECWMS-SIL-2026-002 | 200 |
| TECWMS-SIL-2026-003 | 200 |
| TECWMS-SIL-2026-004 | 200 |

Summer 2026 students were confirmed with **no Silver** and **no Gold** certification at provisioning time.

---

## 11. Code and Deployment Scope

| Item | RC17-A action |
|------|---------------|
| Application code | **Not modified** |
| Database schema | **Not modified** |
| APIs | **Not modified** |
| Railway configuration | **Not modified** |
| Production deployment | **Not performed** |
| Repository commit (at operation time) | **Not performed** |

RC17-A used the existing RC16 institutional baseline deployment already running on Railway. Student records were written to the production database through the established teacher provisioning API.

---

## 12. Approval Gate

| Gate | Status |
|------|--------|
| Six users created | **PASS** |
| Unique emails and student numbers | **PASS** |
| Correct cohort assignment (A: 3, B: 3) | **PASS** |
| Login smoke (Groupe A + Groupe B) | **PASS** |
| Cohorte Fondatrice preserved | **PASS** |
| James Timothy unchanged | **PASS** |
| Silver/Gold unchanged | **PASS** |
| Summer cohort isolation | **PASS** |
| No code changes | **CONFIRMED** |
| No deployment | **CONFIRMED** |

### Final decision

# SUMMER 2026 COHORTS PROVISIONED

**Status: READY FOR WELCOME EMAILS**

Await institutional approval before sending official welcome emails.

---

## 13. Sign-Off

| Role | Name | Date | Decision |
|------|------|------|----------|
| Operator | _pending_ | 2026-07-02 | Provisioned |
| Institutional approver | _pending_ | | |

---

*This report documents a completed production provisioning operation. It contains no student passwords. Welcome-email credentials are maintained outside the repository in the institutional communication package.*
