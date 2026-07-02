# James Timothy — Full Path QA Report

**Date:** 2026-07-01  
**Environment:** Production — `https://tec-wms-simulator-production-production.up.railway.app`  
**QA student:** James Timothy · `jamesnns3@gmail.com` · password `16183026`  
**Executor:** Automated production QA script + follow-up validation  
**Scope:** M1–M5 happy path, unlock gates, checkpoints, pedagogical feedback, documentation linkage  
**Constraints observed:** No code changes · No deploy · No Cohorte Fondatrice founder cert mutations · No Groupe A/B contamination

---

## Executive Summary

James Timothy is a **valid, active teaching/QA student account** (userId **222**) in **Cohorte Fondatrice · Session 2025–2026** (cohortId **1**). Login, scenario execution, scoring, answer persistence, M3 teacher validation, and M4/M5 analytical flows **work end-to-end** on production.

**Final decision: PASS WITH CONDITIONS**

| Area | Result |
|------|--------|
| Identity & login | PASS |
| M1–M5 scenario execution (representative SCNs) | PASS |
| M3 teacher validation → M4 JIT unlock | PASS |
| M4 analytical UX + saved answers + feedback | PASS |
| M5 decision chain + completion | PASS |
| Cohorte Fondatrice founder integrity | PASS (4 Silver / 4 Gold unchanged) |
| Silver / Gold certification readiness (James) | NOT READY (by design + gaps) |
| Checkpoint engine sync (M3) | CONDITION — stale until recompute |
| Profile studentNumber | GAP — null in DB, password is 16183026 |

**Blocking issues for institutional certification on James:** M1 quiz not attempted; `studentNumber` not assigned; registry slot `TEC-SIL-2026-005` not allocated. These are **expected** for the demo account and do not block platform QA use.

---

## 1. James Account State

| Field | Expected | Actual | Status |
|-------|----------|--------|--------|
| Name | James Timothy | James Timothy | PASS |
| Email | jamesnns3@gmail.com | jamesnns3@gmail.com | PASS |
| Login password | 16183026 | Works | PASS |
| Profile `studentNumber` | 16183026 (recommended) | **null** | GAP |
| userId | — | 222 | PASS |
| Role | student | student | PASS |
| cohortId | 1 (Fondatrice) | 1 | PASS |
| Cohort name | Cohorte Fondatrice | Cohorte Fondatrice · Session 2025–2026 | PASS |
| silverCertified | false (demo) | false | PASS |
| goldCertified | false (demo) | false | PASS |
| Registry slot | TEC-SIL-2026-005 (reserved) | Not allocated | EXPECTED |

### Cohort recommendation

**Recommendation:** Keep James in **Cohorte Fondatrice** as the official teaching/demo account **unless** institutional policy requires isolating QA traffic. A dedicated **QA/Teaching cohort** would reduce risk of roster confusion with the four certified founders but requires explicit approval and cohort migration — **do not move without sign-off**.

---

## 2. M1–M5 Path Table

| Module | Scenario | Action | Score | Pass (≥ threshold) | Module checkpoint | Notes |
|--------|----------|--------|-------|-------------------|-------------------|-------|
| M1 | SCN-001 | Executed (run 114) | **100** | PASS (≥60) | M1 `passed=true`, progressPct=0 | Full PO→GR→Putaway→SO→Pick→GI→CC→Compliance |
| M1 | Quiz M1 | Not executed | — | NOT ATTEMPTED | — | Required for Silver |
| M2 | SCN-006 | Executed (run 115) | **100** | PASS (≥60) | M2 `passed=true` (backfill) | GR→Putaway→FIFO→StockAccuracy→Compliance |
| M2 | SCN-007/008 | Not re-run this session | — | Backfill `passed=true` | Legacy row, progressPct=0 | Prior institutional backfill |
| M3 | SCN-009 | Verified + prior run 113 | **100** | PASS (≥70) | SCN009 passed after recompute | 100/100 reachable |
| M3 | SCN-010 | Executed (run 116) | **100** | PASS (≥70) | SCN010 passed after recompute | 100/100 reachable |
| M3 | SCN-011 | Verified (run 99) | **80** | PASS (≥70) | SCN011 passed | Below 100 ceiling on existing run |
| M3 | Teacher validation | Executed by teacher | — | PASS | progressPct **100%**, `passed=true` | Unlocked M4 JIT |
| M4 | SCN-012 | Verified (run 91) | **75** | PASS (≥70) | M4 `passed=true` (backfill) | Answers saved; KPI feedback present |
| M4 | SCN-013 | Executed (run 122) | **100** | PASS | — | Canonical answers required for compliance |
| M4 | SCN-014 | Executed (run 123) | **100** | PASS | — | Canonical answers required for compliance |
| M5 | SCN-015 | Verified (run 110) | **100** | PASS (≥70) | — | Full ops + KPI + decision chain |
| M5 | SCN-016 | Executed (run 117) | **100** | PASS | — | Variance → ADJ → chain unblocked |
| M5 | SCN-017 | Executed (run 118) | **100** | PASS | — | Strategic decision with KPI refs |

---

## 3. Scores by Scenario (James — eval runs, 2026-07-01 session)

| SCN | Run ID | Score | Status |
|-----|--------|-------|--------|
| SCN-001 | 114 | 100 | completed |
| SCN-006 | 115 | 100 | completed |
| SCN-009 | 113 | 100 | completed |
| SCN-010 | 116 | 100 | completed |
| SCN-011 | 99 | 80 | completed |
| SCN-012 | 91 | 75 | completed |
| SCN-013 | 122 | 100 | completed |
| SCN-014 | 123 | 100 | completed |
| SCN-015 | 110 | 100 | completed |
| SCN-016 | 117 | 100 | completed |
| SCN-017 | 118 | 100 | completed |

**Total eval runs on account:** 42 runs · 14+ completed eval runs before session; session added 7 new completed eval runs.

---

## 4. Checkpoint State (post teacher validation)

| Module | passed | progressPct | completedScenarios | teacherValidated | engineVersion | scenarioStatusJson |
|--------|--------|-------------|-------------------|------------------|---------------|-------------------|
| M1 | true | 0 | 0/3 | false | null | null (legacy backfill) |
| M2 | true | 0 | 0/3 | false | null | null (legacy backfill) |
| M3 | **true** | **100** | **3/3** | **true** | ckpt-v1 | SCN009✓ SCN010✓ SCN011✓ |
| M4 | true | 0 | 0/3 | false | null | null (legacy backfill) |
| M5 | — | — | — | — | No row | M5 runs complete; no module_progress row |

**M3 final checkpoint (after teacher validation at 2026-07-01T18:35:10Z):**

- SCN009: run 113 · score 100 · passed  
- SCN010: run 116 · score 100 · passed  
- SCN011: run 99 · score 80 · passed  
- averageScore: 93 · bestScore: 100

---

## 5. Unlock Timing Validation

| Gate | Expected | Observed | Result |
|------|----------|----------|--------|
| M1 → M2 | M1 passed unlocks M2 | M2 accessible; SCN-006 launched | PASS |
| M2 → M3 | M2 passed unlocks M3 | M3 SCNs launched | PASS |
| M3 full pass → teacher validation | All 3 SCNs ≥70 before validation | Validation succeeded after recompute | PASS |
| M3 teacher validation → M4 | M4 blocked until validation | `SCN-012` blocked pre-validation; **unlocked post-validation** (run 119) | PASS |
| M4 → M5 | M4 chain required | M5 SCNs executable (M4 backfill + live runs) | PASS |
| Silver | Quiz + M1 SCNs + compliance + no blockers | **Not eligible** — quiz not attempted; no registry slot | PASS (correctly blocked) |
| Gold | Silver + 18 gates | **LOCKED** 0/18 — `silverPrerequisite: false` | PASS (correctly blocked) |
| Early certification | None before gates | No cert issued on James | PASS |
| Cross-cohort progress | Isolated | James only in cohort 1; founders unchanged | PASS |

---

## 6. Silver / Gold Readiness (James)

| Certification | Status | Blockers |
|---------------|--------|----------|
| **Silver** | NOT READY | M1 quiz not attempted; `studentNumber` null; no `TEC-SIL-2026-005` registry entry; M1 checkpoint not on ckpt-v1 |
| **Gold** | LOCKED (0/18) | No Silver prerequisite; Gold engine reports all SCN006–017 incomplete (strict gate read) |

**Note:** James is intentionally **outside** the institutional Silver registry. Auto-unlock via `profiles.silverStatus` was **not invoked** to avoid unintended certification side effects.

**Founder cohort (read-only control):** 4/4 Silver · 4/4 Gold — **unchanged** before and after James QA session.

Verify routes, PDF download, and LinkedIn prefill were **not tested** on James (certification not reached). Founder verify routes for `TECWMS-GOLD-2026-001`–`004` remain valid from prior RC13/RC15 audits.

---

## 7. Pedagogical Feedback Validation

| Layer | Validated | Evidence |
|-------|-----------|----------|
| Mission Sheet / Fiche Mission | YES (code + runtime) | `MissionSheet.tsx` + `server/missionData.ts` loaded per scenario |
| Cockpit pedagogy hints | YES (code) | `scenarioCockpitPedagogy.ts` — SCN-001–017 entries |
| M3 operational tower | YES (code) | `M3OperationalTowerView`, resolution chain on SCN-009 |
| M4 KPI interpretation feedback | YES (runtime) | Run 91 `detailedReport`: rotation/service/diagnostic answers saved with feedback flags |
| M4 compliance rejection messages | YES (runtime) | SCN-013/014 rejected short answers with French pedagogical reasons; canonical answers scored 100 |
| M5 decision scoring | YES (runtime) | SCN-015/016/017 completed with decision step; scores 100 |
| Run report | YES (route) | `/student/run/:runId/report` — score 100 on M5 run 117 |
| Learning feedback registry | YES (code) | `shared/learningFeedbackRegistry.ts` aligned with band thresholds |

**Student comprehension support:** Students can see **what to do** (Mission Sheet, slides hub), **why answers succeed/fail** (compliance messages, KPI band feedback), **which KPI is tested** (M4/M5 cockpit labels), and **checkpoint progress** (M3 ckpt-v1 JSON after recompute). **Blocked modules** show French gate messages (e.g. M4 locked pending M3 teacher validation).

---

## 8. Documentation Linkage Validation

| Asset | In-app / repo linkage | Student accessible |
|-------|-------------------------|-------------------|
| M1–M3 guide | `Dossier_Institutionnel.../TECWMS_GUIDE_M1_M3.pdf` | Slides hub + scenarios (indirect) |
| M4/M5 guide | `TECWMS_GUIDE_M4_M5.html`, PDF-ready MD | Module 4/5 dashboards |
| M4/M5 canonical answers | `SCN012_SCN014_RUNTIME_SAFE_CANONICALS.md`, `GUIDE_OFFICIEL_REPONSES_M4_M5.md` | Instructor-side; student gets band feedback not full canon |
| Pedagogical feedback layer | `learningFeedbackRegistry.ts`, cockpit pedagogy | In-run via OIL panels |
| Run reports | `/student/run/:runId/report` | YES after completion |
| Slides (theory) | `/student/slides` | HTTP 200 |
| Glossary | `/student/glossary` | Available |
| Certifications portal | `/student/certifications` | HTTP 200 |

**Route checks (production, unauthenticated shell — 200 expected with auth guard client-side):**

- `/student/scenarios` → 200  
- `/student/module4` → 200  
- `/student/module5` → 200  
- `/student/slides` → 200  
- `/student/certifications` → 200  

---

## 9. QA Functionality Checklist

| Function | Result | Detail |
|----------|--------|--------|
| Login | PASS | Local auth, role=student |
| Scenario access | PASS | 17 scenarios in catalog |
| Answer saving | PASS | M4 KPI interpretations persisted (run 91, 122, 123) |
| Score calculation | PASS | 100 on perfect M3/M5 runs; 75–100 on M4 |
| Checkpoint update | CONDITION | M3 ckpt-v1 updates on teacher validation recompute |
| Teacher monitor visibility | PASS | James in cohort roster; runs visible in monitor |
| Dashboard update | PASS | Teacher aggregates load; James progress rows present |
| Cohort scoping | PASS | James cohortId=1; founders isolated |
| Certification status | PASS | Correctly not certified |
| Verify routes | N/A | Not reached for James |
| PDF/LinkedIn actions | N/A | Not reached for James |

---

## 10. Defects Found

| ID | Severity | Description | Repro |
|----|----------|-------------|-------|
| **QA-001** | MEDIUM | M3 `scenarioStatusJson` stale after new eval runs until teacher validation triggers `recomputeModuleCheckpoint` | Complete SCN-009/010 at 100; `warehouse.myProgress` still showed SCN009/010 `passed:false` until teacher validation |
| **QA-002** | LOW | Profile `studentNumber` is null; login password is `16183026` but not stored on profile | `profiles.mine` → studentNumber null |
| **QA-003** | LOW | M1/M2/M4 `module_progress` rows show `progressPct=0` / null `scenarioStatusJson` despite passed=true (legacy backfill vs ckpt-v1) | James rows id 13, 14, 5049 |
| **QA-004** | LOW | M4 compliance rejects abbreviated answers without clear in-UI pointer to canonical structure (pedagogically correct, UX friction) | SCN-013/014 first attempt failed compliance |
| **QA-005** | INFO | M1 quiz gate not exercised — blocks Silver path validation on James | `quiz.getBestAttempt` module 1 → null |
| **QA-006** | INFO | Gold status API reads all SCN gates false for James despite completed runs (strict engine vs backfill mismatch) | `goldStatusForStudent` 0/18 |

**No CRITICAL defects.** No founder certification contamination.

---

## 11. Recommendations

1. **Keep James in Cohorte Fondatrice** as the canonical teaching account unless a dedicated QA cohort is approved.  
2. **Assign `studentNumber: 16183026`** and allocate **`TEC-SIL-2026-005`** if institutional Silver preview on James is desired.  
3. **Trigger checkpoint recompute** on M3 run completion (or document that teacher validation is the recompute trigger) to fix QA-001.  
4. **Backfill James M1/M2/M4** onto `ckpt-v1` for dashboard parity with founders, or reset James to clean ckpt-v1 state for repeatable demos.  
5. **Execute M1 quiz** on James before next Silver readiness demo.  
6. **Do not use James** in Groupe A or Groupe B without explicit instruction.  
7. **Rotate password** if James credentials are shared beyond teaching staff.

---

## 12. Final Decision

### PASS WITH CONDITIONS

**Rationale:** Core student path (login → scenarios → scoring → M3 teacher gate → M4/M5 analytical flows → run reports) is **functional and explainable** on production. Unlock gates behave correctly. Founder cohort certifications are **untouched**. Conditions: resolve M3 checkpoint sync visibility (QA-001), assign studentNumber if Silver demo needed, complete M1 quiz for full Silver gate validation, and optionally migrate to dedicated QA cohort per institutional policy.

---

*Report generated from production validation on 2026-07-01. Script artifact: `.manus-logs/james-timothy-full-path-qa.mjs` (untracked). No code commits or deploys performed.*
