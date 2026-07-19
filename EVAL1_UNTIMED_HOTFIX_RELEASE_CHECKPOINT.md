# EVAL1 UNTIMED HOTFIX — RELEASE CHECKPOINT

**Date:** 2026-07-19 (live Cohorte B class)  
**Status:** COMPLETE / DEPLOYED / SMOKED / CHECKPOINTED  
**Verdict:** GO — CLOSED  
**Scope:** Emergency narrow hotfix — Evaluation 1 untimed + Gnouma Camara targeted recovery only.

---

## Release identity

| Field | Value |
|---|---|
| Repository | `C:\Projetos\tec-wms-simulator-production` (`Gibran-T/tec-wms-simulator-production`) |
| Feature branch | `feature/integrated-assessments-quiz-nav-july-2026` |
| Production branch | `production-hotfix-rc13-pedagogy-class6` |
| Hotfix commit (full) | `65b32d1190f2a085615839fb574558db60001cb7` |
| Hotfix commit (short) | `65b32d1` |
| Commit message | `fix(assessments): make Eval1 untimed for live Cohorte B class` |
| Merge mechanism | Fast-forward only (`6f41ce5` → `65b32d1`) |
| Railway deployment ID | `7f4325df-bea0-4bac-a06d-ca27953d445e` |
| Deploy status | **SUCCESS** |
| Deployed SHA | `65b32d1190f2a085615839fb574558db60001cb7` |
| Production URL | https://tec-wms-simulator-production-production.up.railway.app |

---

## Commit scope (8 files — exact)

### Modified
- `shared/eval1QuestionBank.ts` — `EVAL1_DURATION_MINUTES = null` (untimed)
- `shared/assessmentCore.ts` — `isUntimedDuration` / `toStoredDurationMinutes` / FR label helper / TIMESTAMP-safe sentinel
- `server/assessmentService.ts` — seed sync to `durationMinutes=0`; start/getAttempt/submit never expire untimed; heal open attempts
- `client/src/pages/student/AssessmentAttemptPage.tsx` — no countdown / no auto-submit; show **Sans limite de temps**
- `client/src/pages/student/EvaluationsHubPage.tsx` — duration label
- `client/src/pages/teacher/AssessmentPreviewPanel.tsx` — duration label
- `client/src/pages/teacher/AssessmentsManagerPage.tsx` — duration label

### New
- `server/assessment.untimed.test.ts` — 6 contract tests

### Explicitly excluded
- Questions, answers, scoring, 70% threshold, Eval2, other students’ attempts, schema migrations

Staging used path-based `git add` only (never `git add .` / `-A` / `--all`).

---

## Data corrections (targeted)

### Evaluation 1 config
| Field | Before | After |
|---|---|---|
| `integrated_assessments.durationMinutes` (EVAL_INTEGREE_1) | 40 | **0** (untimed) |
| status / passingScore / release | ready / 70 / `released_cohort` cohort **3** | **unchanged** |

### Evaluation 2
| Field | Value |
|---|---|
| status | `draft` (unchanged) |
| release | `visible_pending` cohort 3 (unchanged) |

### Gnouma Camara only (TECWMS-2026-B-001 · userId 89750)

| Field | Value |
|---|---|
| Attempt ID | **7** |
| Previous status | `submitted` at exact `expiresAt` (timer-forced) · score **5** · **3** answers |
| Recovery action | **REOPEN_ATTEMPT_PRESERVE_ANSWERS** → `in_progress` · clear score metadata · keep `responsesJson` · `expiresAt` → 2037 sentinel |
| Other students modified | **None** |
| Final outcome (student-driven) | He continued live, then **voluntarily submitted** · status `submitted` (not `expired_submitted`) · **20** answers · score **65** · durationSeconds **4273** (~71 min) · passed **false** |

**Do not reset Gnouma again** — final submit is a legitimate student submission after recovery.

---

## Validation

| Suite | Result |
|---|---|
| `server/assessment.untimed.test.ts` | **6/6** |
| `server/assessment.integrity.test.ts` | **21/21** |
| Combined | **27/27** |
| `npm run build` | **PASS (EXIT=0)** |

---

## Production smoke (critical)

| Check | Result |
|---|---|
| Health `/` `/api/health` `/health` | **200** |
| Bundle contains `Sans limite de temps` | **PASS** |
| Deploy SHA `65b32d1` | **PASS** |
| Eval1 `durationMinutes=0` · ready · pass 70 | **PASS** |
| Eval1 `released_cohort` cohort 3 | **PASS** |
| Eval2 draft + `visible_pending` | **PASS** |
| Four Cohorte B students accessible (profiles cohort 3) | **PASS** |
| Gnouma recovery → continue → submit without timer cut-off | **PASS** (71 min wall time; `submitted` not `expired_submitted`) |

Evidence: `.manus-logs/_eval1-untimed-prod-smoke-results.json`, `_gnouma-recovery-report.json`

---

## Canonical untimed contract

- App: `EVAL1_DURATION_MINUTES = null`
- DB: `durationMinutes = 0` (NOT NULL column)
- Attempts: `expiresAt` sentinel within MySQL TIMESTAMP range (`2037-12-31`); **never enforced** when assessment is untimed
- Client: no countdown, no auto-submit, label **Sans limite de temps**

---

## Final verdict

**COMPLETE / DEPLOYED / SMOKED / CHECKPOINTED**
