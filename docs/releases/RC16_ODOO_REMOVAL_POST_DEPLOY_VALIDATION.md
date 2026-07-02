# RC16 Odoo Removal — Post-Deploy Validation

**Date:** 2026-07-01  
**Validator:** Automated production smoke + bundle audit  
**Release commit:** `cb2f132` — `feat(rc16): remove Odoo as course environment`  
**Production URL:** https://tec-wms-simulator-production-production.up.railway.app  
**Railway deployment ID:** `ac47c643-f7e9-45fa-90d5-17d9f398c2ef`  
**Verdict:** **READY — GO**

---

## 1. Deployment

| Check | Result | Evidence |
|-------|--------|----------|
| Deployment completed | **PASS** | Railway status: **Online** (no rollback) |
| Commit deployed | **PASS (inferred)** | Push `f66ed70..cb2f132` triggered deploy `ac47c643`; production bundle `assets/index-CnQ87rF5.js` contains RC16-only slide strings |
| Production URL healthy | **PASS** | `GET /` → HTTP 200 |
| Build errors | **PASS** | Railway logs: `Server running on http://localhost:8080/` — no build/runtime failure |
| Rollback | **PASS** | No rollback observed; service remained Online |

**Note:** Production does not expose a `/version` or git SHA endpoint. Commit correlation is via Railway deploy timing + unique RC16 strings in the deployed JS bundle.

---

## 2. Files validated (deployed artifact)

| Source (commit `cb2f132`) | Validation method |
|---------------------------|-------------------|
| `client/src/data/modules.ts` | Production JS bundle string scan |
| `client/src/pages/student/MissionControl.tsx` | Bundle scan — forbidden Odoo Lab strings absent |
| Professor/programme guides | Not served by production SPA; validated at source in `cb2f132` (pre-deploy QA RC16) |
| Pedagogy audits | Repository documentation; not runtime-deployed |

**Production bundle:** `assets/index-CnQ87rF5.js`

---

## 3. Slides validation

| Module | Slide | Expected | Production bundle | Result |
|--------|-------|----------|-------------------|--------|
| M2 | 6 | Consolidation TEC.WMS — Layout entrepôt | **FOUND** | **PASS** |
| M2 | 6 | ~~Configuration Odoo~~ | absent | **PASS** |
| M3 | 6 | Consolidation TEC.WMS — Réapprovisionnement | **FOUND** | **PASS** |
| M3 | 6 | ~~Règles de réapprovisionnement Odoo~~ | absent | **PASS** |
| M4 | 6 | Consolidation TEC.WMS — Tableaux de bord KPI | **FOUND** | **PASS** |
| M4 | 6 | ~~Rapports Odoo~~ | absent | **PASS** |

**Route check:** `GET /student/slides/2` → HTTP 200 (SPA shell; slide content from bundle).

---

## 4. Mission Control validation

| Check | Result | Evidence |
|-------|--------|----------|
| Odoo Lab panel removed | **PASS** | Bundle: `Prof Demo — Odoo Lab`, `OPEN ODOO LAB`, `OUVRIR ODOO LAB` — **absent** |
| External Odoo links removed | **PASS** | Bundle: `edu-concorde-logistics-lab` — **absent** |
| Teacher interface clean | **PASS** | No forbidden Odoo course-environment strings in bundle |
| Student interface clean | **PASS** | Same bundle scan; Mission Control route HTTP 200 |

**Route check:** `GET /student/mission-control/1` → HTTP 200

---

## 5. Student experience (production UI)

**Forbidden strings scanned in production JS bundle:**

| Pattern | Found |
|---------|-------|
| Configuration Odoo | No |
| Règles de réapprovisionnement Odoo | No |
| Rapports Odoo | No |
| Odoo Lab | No |
| Odoo EDU LAB | No |
| edu-concorde-logistics-lab | No |
| Optional Odoo | No |

**Internal bundle note:** 51 occurrences of `odooEquivalent` in minified `missionData` / `stepErpMap` server-side reference fields. These are **not rendered** in student UI (only `sapEquivalent` / ERP module hints shown). Classified as internal ERP mapping — **not a course-environment violation**.

---

## 6. Professor experience

| Surface | Check | Result |
|---------|-------|--------|
| Professor login | `prof@teclog.ca` → role `teacher` | **PASS** |
| Dashboard routes | `/teacher/slides` → 200 | **PASS** |
| Mission Control | No Odoo Lab in bundle | **PASS** |
| Monitor | `monitor.allRuns` (cohort 1) → 110 runs | **PASS** |
| Analytics | `monitor.powerAnalytics` → data returned | **PASS** |
| Guides (institutional) | RC16 guide + Quick Reference pre-validated Odoo-free | **PASS** |
| Teaching flow (slides) | M2/M3/M4-S6 = TEC.WMS consolidation in bundle | **PASS** |

---

## 7. Allowed references

| Location | Reference | Context | Result |
|----------|-----------|---------|--------|
| Production bundle | `odooEquivalent` field values | Internal mission metadata only | **ALLOWED** (not user-visible) |
| Programme officiel (repo) | SAP, Odoo, Oracle, Dynamics | ERP market list | **ALLOWED** (not in production SPA) |

No operational Odoo teaching context found in production-facing UI.

---

## 8. Functional regression

| Function | Test | Result |
|----------|------|--------|
| Student login | James Timothy `jamesnns3@gmail.com` → userId 222 | **PASS** |
| Teacher login | `prof@teclog.ca` → role teacher | **PASS** |
| Dashboard | `/student/dashboard` → 200 | **PASS** |
| Mission Control | Route 200; demo run started (runId 125) | **PASS** |
| Monitor | `monitor.allRuns` → 110 evaluation runs | **PASS** |
| Analytics | `monitor.powerAnalytics` | **PASS** |
| SCN navigation | `runs.myRunsEnriched` → 53 runs | **PASS** |
| Slides | Bundle + `/student/slides/2` → 200 | **PASS** |
| Run Report | `runs.detailedReport` for run 87 — endpoint reachable | **PASS** (structure varies by run state) |
| Certification | `profiles.mine` + cert flags readable | **PASS** |
| Progress | `warehouse.myProgress` → 4 module rows | **PASS** |

No regressions observed in core classroom flows.

---

## 9. Happy path — James Timothy

| Step | Result | Detail |
|------|--------|--------|
| Login | **PASS** | userId 222, role student |
| Slides | **PASS** | RC16 consolidation titles in deployed bundle |
| Mission Control | **PASS** | Route 200; demo run `runs.start` scenarioId 1 → runId 125 |
| Scenario execution | **PASS** | `runs.state` returned for active demo run |
| Progress | **PASS** | 4 module progress rows |
| Feedback / runs | **PASS** | 52–53 enriched runs available |
| Odoo references | **PASS** | Zero forbidden course-environment strings |

---

## 10. PASS / FAIL summary

| Area | Result |
|------|--------|
| Deployment | **PASS** |
| Slides M2/M3/M4-S6 | **PASS** |
| Mission Control Odoo removal | **PASS** |
| Student UI (forbidden Odoo) | **PASS** |
| Professor UI / monitor / analytics | **PASS** |
| Allowed references only | **PASS** |
| Functional regression | **PASS** |
| Happy path (James Timothy) | **PASS** |

---

## 11. Verdict

| Field | Value |
|-------|-------|
| **Overall** | **GO** |
| **Classroom readiness** | **READY** |
| **Corrections required** | **None** |

RC16 Odoo removal is **live on production** without detectable classroom regressions. TEC.WMS remains the sole official course environment in slides and Mission Control.

---

## 12. Evidence artifacts

| Artifact | Location |
|----------|----------|
| Production validation script | `.manus-logs/rc16-odoo-post-deploy-validation.mjs` (untracked) |
| Bundle scan | Manual + script — `index-CnQ87rF5.js` |
| Railway status | `ac47c643-f7e9-45fa-90d5-17d9f398c2ef` — Online |
| Golden student QA reference | `docs/testing/GOLDEN_STUDENT_JAMES_TIMOTHY.md` |

**Validation only — no code commits, no deploy actions performed during this report.**
