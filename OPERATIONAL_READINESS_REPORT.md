# TEC.WMS — Operational Readiness Report

**Report type:** Post-cohort-creation operational validation  
**Date:** 2026-07-01  
**Environment:** Railway production — `https://tec-wms-simulator-production-production.up.railway.app`  
**Validator:** Automated API smoke + roster/isolation forensics  
**Evidence artifacts:** `.manus-logs/operational-readiness-validation.mjs`, `.manus-logs/operational-readiness-results.json`, `.manus-logs/ete-2026-cohort-init-results.json`

---

## 1. Executive Summary

| Dimension | Verdict |
|-----------|---------|
| **Overall operational readiness** | **NO-GO** — blocking isolation gap on deployed build |
| Cohort records (Fondatrice + Groupe A + Groupe B) | **PASS** |
| Professor authentication & cohort listing | **PASS** |
| Professor monitor / analytics / reports isolation | **FAIL** — not deployed to production |
| Cohorte Fondatrice preservation | **PASS** |
| Groupe A / Groupe B student provisioning | **PENDING** — 0 students assigned |
| Student flows (Cohorte Fondatrice) | **PASS** |

**Bottom line:** The three cohorts exist and Cohorte Fondatrice is fully intact. However, **monitoring, analytics, and certification rosters are not cohort-scoped on the live Railway deployment**. Selecting Groupe A or Groupe B still surfaces Cohorte Fondatrice run data (110 runs, 7 user emails). The cohort-isolation implementation exists in the local working tree (`server/cohortScope.ts`, `server/db.ts`, `server/routers.ts`, `client/src/contexts/CohortContext.tsx`) but **has not been committed or deployed**. Class cannot start safely until that code is deployed and re-validated.

---

## 2. Cohort Inventory (Production)

| Cohort | ID | Students | Status |
|--------|-----|----------|--------|
| Cohorte Fondatrice · Session 2025–2026 | 1 | 5 | Active — unchanged |
| Cohorte Été 2026 — Groupe A | 2 | 0 | Created 2026-07-01 — empty |
| Cohorte Été 2026 — Groupe B | 3 | 0 | Created 2026-07-01 — empty |

**Cohorte Fondatrice roster (verified):**

| Student | Email | Silver | Gold |
|---------|-------|--------|------|
| Aissata Soukeina Camara | aissatasoukeinacamara@gmail.com | TEC-SIL-2026-001 | TECWMS-GOLD-2026-001 |
| Darlin Campaz Paredes | dcparedes2010@gmail.com | TEC-SIL-2026-002 | TECWMS-GOLD-2026-002 |
| Fredy Tamile Lola | fredlolabio@gmail.com | TEC-SIL-2026-003 | TECWMS-GOLD-2026-003 |
| Prince Agbodjan Sewa Francis Ghislain | sewafrancispa@gmail.com | TEC-SIL-2026-004 | TECWMS-GOLD-2026-004 |
| James Timothy (demo) | jamesnns3@gmail.com | — | — |

---

## 3. Professor Validation

| Check | Result | Evidence |
|-------|--------|----------|
| Login | **PASS** | `prof@teclog.ca` → role `teacher` |
| Dashboard (data loads) | **PASS** | Aggregates return HTTP 200 for all 3 cohorts |
| Cohort selector source | **PASS** | `cohorts.list` returns 3 cohorts (IDs 1, 2, 3) |
| Dashboard refresh | **PASS** | Repeated queries return stable counts per request |
| Students | **PASS** | Roster filter correct: Fondatrice=5, Groupe A=0, Groupe B=0 |
| Assignments | **PASS** | `assignments.all` loads (0 assignments all cohorts) |
| Analytics | **PARTIAL** | API loads but **returns global data** when Groupe A/B selected |
| Monitor | **FAIL** | `monitor.allRuns` returns **110 runs** for Groupe A/B (should be 0) |
| Reports (`powerAnalytics`) | **PARTIAL** | API loads but inherits same global-data leak |

### Monitor isolation forensics (blocking)

```
cohortId=1 (Fondatrice): 110 runs, 7 unique emails
cohortId=2 (Groupe A):     110 runs, 7 unique emails  ← identical to Fondatrice
cohortId=3 (Groupe B):     110 runs, 7 unique emails  ← identical to Fondatrice
```

Emails appearing in Groupe A monitor (should be empty): all 5 Fondatrice students plus `gibranlog@gmail.com` and `prof@teclog.ca`.

`profiles.goldRoster` with `cohortId=2` or `3` also returns **5** entries (Fondatrice Gold holders) instead of **0**.

**Root cause:** Deployed production build predates RC15 cohort-scope filtering. Local repo contains the fix (`resolveCohortScope`, empty-roster guard in `getAllRunsForMonitor`) but it is **uncommitted** (`server/cohortScope.ts` untracked; `server/routers.ts`, `server/db.ts`, client cohort context modified).

---

## 4. Student Validation

### Cohorte Fondatrice — **PASS (35/35 checks)**

| Check | Result | Detail |
|-------|--------|--------|
| Login (5/5 accounts) | **PASS** | All founder + demo accounts authenticate |
| Assigned cohort | **PASS** | All `cohortId = 1` |
| Assigned scenarios | **PASS** | `scenarios.list` returns 17 active scenarios |
| Progress | **PASS** | Module progress rows present for all accounts |
| Module completion | **PASS** | 4 Silver founders: M2–M5 `passed=true`, `progressPct=100` |
| Certifications | **PASS** | 4/4 Silver, 4/4 Gold; verify URLs HTTP 200 |

Gold verify routes confirmed: `TECWMS-GOLD-2026-001` … `004` all valid.

### Groupe A — **PENDING**

| Check | Result | Detail |
|-------|--------|--------|
| Login | **N/A** | No student accounts provisioned |
| Assigned cohort | **N/A** | Roster empty |
| Assigned scenarios | **N/A** | — |
| Progress | **N/A** | — |
| Module completion | **N/A** | — |
| Certifications | **N/A** | — |

### Groupe B — **PENDING**

Same as Groupe A — cohort shell exists, zero students assigned.

---

## 5. Cohort Isolation Verification

| Isolation rule | Result | Detail |
|----------------|--------|--------|
| Groupe A ∩ Groupe B = ∅ | **PASS** | Both rosters empty |
| Groupe A ∩ Fondatrice = ∅ | **PASS** (roster) | No shared student emails in `students.list` |
| Groupe B ∩ Fondatrice = ∅ | **PASS** (roster) | No shared student emails in `students.list` |
| Fondatrice roster intact | **PASS** | Exactly 5 students, all expected emails present |
| Groupe A monitor data isolated | **FAIL** | Returns full Fondatrice run set (110 runs) |
| Groupe B monitor data isolated | **FAIL** | Returns full Fondatrice run set (110 runs) |
| Gold roster scoped per cohort | **FAIL** | Empty cohorts show 5 Gold entries |

**Verdict:** Roster-level isolation works (`students.list`). **Operational data isolation (monitor, analytics, progress, gold roster) does not work on production.** The three cohorts are **not** completely isolated in the professor workflow.

---

## 6. Cohorte Fondatrice Preservation

| Preservation check | Result |
|--------------------|--------|
| Cohort ID unchanged (still 1) | **PASS** |
| Cohort name unchanged | **PASS** |
| Student count unchanged (5) | **PASS** |
| Roster emails unchanged | **PASS** |
| Silver certifications (4/4) | **PASS** |
| Gold certifications (4/4) | **PASS** |
| Gold verify HTTP routes | **PASS** |
| M2–M5 module pass state (founders) | **PASS** |
| `goldAwardSource = FONDATRICE_2026_GOLD_AWARD` | **PASS** |
| No regressions from cohort creation | **PASS** |

Cohort creation for Groupe A/B did **not** alter Cohorte Fondatrice data.

---

## 7. Blocking Issues

### B-01 — Cohort isolation not deployed (CRITICAL)

**Impact:** Professor selecting Groupe A or Groupe B sees Cohorte Fondatrice monitoring data, analytics, and Gold roster. Violates institutional isolation requirement.

**Remediation:** Commit and deploy RC15 cohort-isolation package:
- `server/cohortScope.ts` (+ tests)
- `server/db.ts` (empty-roster guards)
- `server/routers.ts` (cohort-scoped teacher endpoints)
- `client/src/contexts/CohortContext.tsx`, `client/src/hooks/useTeacherCohort.ts`, `client/src/components/FioriShell.tsx`
- Teacher dashboard pages using `useTeacherCohortInput`

**Re-validation after deploy:** Confirm `monitor.allRuns` with `cohortId=2` returns `[]` and `cohortId=1` returns only Fondatrice student runs.

### B-02 — Groupe A/B students not provisioned (OPERATIONAL)

**Impact:** Cannot validate student login, scenario assignment, or progression for new cohorts.

**Remediation:** Operator task — create student accounts via **Étudiants** with shell set to each cohort; assign scenarios per cohort.

---

## 8. Non-Blocking Observations

1. **Assignments:** Zero assignments across all cohorts. Scenario assignment per cohort is a pre-class operator step.
2. **James Timothy** (`jamesnns3@gmail.com`): Demo account in Fondatrice, no Silver/Gold — expected.
3. **Monitor includes non-student runs:** Fondatrice monitor includes runs from `gibranlog@gmail.com` and `prof@teclog.ca` (admin/teacher test runs). Cosmetic; does not affect student certification.
4. **UI browser login:** Login page loads correctly; full UI walkthrough deferred (credential automation restricted in validation environment). API validation covers all professor/student surfaces.

---

## 9. Test Summary

| Category | Passed | Failed | Total |
|----------|--------|--------|-------|
| Professor | 23 | 0* | 23 |
| Student (Fondatrice) | 33 | 0 | 33 |
| Student (Groupe A/B) | 0 | 2 | 2 |
| Isolation | 6 | 1† | 7 |
| **Total** | **63** | **3** | **66** |

\*Professor API checks pass HTTP/load tests but **monitor/analytics data correctness fails** isolation requirements (see §3).  
†Additional isolation failures (Groupe A/B monitor leak) elevate severity beyond automated check count.

---

## 10. Recommended Actions (Priority Order)

1. **Deploy** cohort-isolation code to Railway production and run post-deploy smoke (`.manus-logs/operational-readiness-validation.mjs`).
2. **Re-verify** isolation: Groupe A monitor = 0 runs; Groupe B monitor = 0 runs; Fondatrice = 5-student scope only.
3. **Provision** student accounts in Groupe A and Groupe B; assign module scenarios per cohort.
4. **Re-run** full student validation checklist for at least one account per new cohort.
5. **Confirm** professor UI cohort switcher updates all surfaces (dashboard, monitor, analytics, students, assignments) without stale data.

---

## 11. Final Verdict

| Gate | Status |
|------|--------|
| Cohort creation | **GO** |
| Cohorte Fondatrice preservation | **GO** |
| Professor platform (deployed) | **NO-GO** — isolation not live |
| Student new cohorts | **PENDING** — provisioning required |
| **Operational readiness for class** | **NO-GO** |

> **Class cannot proceed safely until B-01 (deploy cohort isolation) is resolved and B-02 (student provisioning) is completed.** Engineering fix exists locally; the remaining gate is **deployment + operator provisioning**.

---

*Collège de la Concorde · TEC.WMS · Operational Readiness Validation · 2026-07-01*
