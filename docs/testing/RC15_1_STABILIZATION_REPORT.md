# RC15.1 Post-Release Stabilization Report

**Date:** 2026-07-01  
**Scope:** Golden Student (James Timothy) + checkpoint synchronization audit + legacy backfill audit  
**Production:** `https://tec-wms-simulator-production-production.up.railway.app`  
**RC15 deploy:** `f66ed70` (GO — validated 2026-07-01)

---

## Executive Summary

RC15.1 stabilization addressed the three remaining observations from the James Timothy Full Path QA report:

| Observation | Outcome |
|-------------|---------|
| `studentNumber` NULL | **Resolved** — set to `16183026` via `profiles.upsert` (field-only change) |
| M3 `scenarioStatusJson` sync timing | **Investigated** — deferred-sync design gap; not a teacher-validation bug |
| Legacy founder backfill metadata | **Audited** — expected institutional override (`founder-v1`); non-blocking |

**Decision: READY**

No code changes, commits, pushes, or deploys were performed. Founder Silver/Gold integrity preserved.

---

## Part 1 — James Profile Validation

### Before

| Field | Value |
|-------|-------|
| Name | James Timothy |
| Email | `jamesnns3@gmail.com` |
| `studentNumber` | `NULL` |
| Cohort | Cohorte Fondatrice (`cohortId: 1`) |
| Silver / Gold | `false` / `false` |

### Action taken

Single-field update via production API:

```
auth.localLogin(jamesnns3@gmail.com)
profiles.upsert({ studentNumber: "16183026" })
```

**Fields not modified:** `userId`, `email`, `cohortId`, progress, runs, certifications, checkpoints.

### After — confirmation

| Check | Result |
|-------|--------|
| Login | PASS — role `student` |
| Student number | PASS — `16183026` |
| Profile | PASS — cohort unchanged, no cert flags |
| Teacher roster | PASS — `students.list` shows `studentNumber: 16183026` |
| Dashboard | PASS — 4 module-progress rows visible in cohort monitor |
| M3 checkpoint | PASS — `passed: true`, `teacherValidated: true`, `engineVersion: ckpt-v1` |
| Founder integrity | PASS — no changes to founder Silver/Gold (James remains uncertified) |

### studentNumber status

**RESOLVED.** James password and student number are now aligned (`16183026`), matching institutional convention used by other cohort students.

---

## Part 2 — Checkpoint Synchronization Analysis

### QA observation

During Full Path QA, M3 `scenarioStatusJson` appeared stale until teacher validation was applied.

### Flow trace

```
Scenario completed
    ↓  m*.submitCompliance* → completeRun(runId)          [server/routers.ts]
    ↓  Run saved in scenario_runs (status=completed)      [db.completeRun]
    ↓  Checkpoint update                                  [NOT automatic]
    ↓  scenarioStatusJson generation                      [checkpointEngine]
    ↓  Teacher validation                                 [validateTeacherModule]
    ↓  module_progress persisted                          [upsertModuleCheckpointSnapshot]
    ↓  Unlock (M3 → M4)                                   [rulesEngine.isModule3Unlocked]
```

### When is `scenarioStatusJson` regenerated?

`scenarioStatusJson` is written only when `recomputeModuleCheckpoint()` runs, which:

1. Calls `getModuleScenarioCheckpointStatus()` — reads latest **completed, non-demo** runs per official SCN
2. Builds snapshot via `buildModuleCheckpointSnapshot()`
3. Persists via `upsertModuleCheckpointSnapshot()` → `module_progress.scenarioStatusJson`

**Triggers today:**

| Trigger | Location | Regenerates JSON? |
|---------|----------|-------------------|
| Student views Final Report after completed run | `client/.../RunReport.tsx` → `warehouse.recordModulePass` | **Yes** |
| Teacher validates M3 | `warehouse.validateTeacherModule` → `recomputeModuleCheckpoint` | **Yes** |
| Scenario compliance finalize (`completeRun`) | `server/routers.ts` (M2/M3/M4/M5) | **No** |
| Backfill scripts | `scripts/backfill-*.ts`, pedagogical override | **Yes** (manual) |

### Answers to investigation questions

**1. When should `scenarioStatusJson` be regenerated?**  
After any official (non-demo) scenario completion that affects module checkpoint state — ideally immediately when `completeRun` succeeds for M2–M5 modules.

**2. Should teacher validation regenerate it?**  
Yes, and it already does (`validateTeacherModule` calls `recomputeModuleCheckpoint` after `setTeacherValidated`). Teacher validation also recomputes `passed`, `progressPct` (M3 includes teacher slot), and unlock state.

**3. Should scenario completion regenerate it?**  
Yes — for consistent teacher-monitor and student dashboard views. Currently it does **not** on the server; the client defers to the Run Report page.

**4. Is the current behaviour intentional?**  
**Partially intentional, partially a gap.**

- **Intentional:** Checkpoint engine batches per-module recompute rather than updating on every step mutation; M3 `passed` correctly requires `teacherValidated`.
- **Gap:** `completeRun()` does not invoke `recomputeModuleCheckpoint()`. Sync depends on the student opening `/student/run/:id/report`, which fires `recordModulePass` in a `useEffect` (`RunReport.tsx` lines 268–274).
- **QA repro:** `.manus-logs/james-timothy-full-path-qa.mjs` completes runs via API but **never calls** `warehouse.recordModulePass`, so `scenarioStatusJson` stayed stale until teacher validation forced a recompute.

**5. Defect assessment**

| Item | Assessment |
|------|------------|
| Classification | **Synchronization defect** (low severity) — deferred client-side sync |
| Root cause | `completeRun` path lacks `recomputeModuleCheckpoint`; only `RunReport` mount triggers it |
| Impact | Teacher monitor may show outdated per-SCN status until report viewed or teacher validates; API-only QA scripts see stale JSON; normal UI happy path (complete → report) works |
| Smallest safe correction (not implemented) | After `completeRun` for non-demo runs, call `recomputeModuleCheckpoint(userId, scenario.moduleId)` when `isCheckpointModule(moduleId) && isCheckpointEngineEnabled()` — single server-side hook, no rule changes |
| Alternative | QA scripts should call `warehouse.recordModulePass` after each completed run |

### Current James M3 state (post-QA, post-teacher-validation)

```json
{
  "SCN009": { "runId": 113, "score": 100, "passed": true },
  "SCN010": { "runId": 116, "score": 100, "passed": true },
  "SCN011": { "runId": 99,  "score": 80,  "passed": true }
}
```

`engineVersion: ckpt-v1` — live checkpoint engine data, not founder override.

---

## Part 3 — Legacy Backfill Analysis

### Scope

Cohorte Fondatrice founder students (4 certified Silver/Gold) — M2–M5 `module_progress` rows from `scripts/cohorte-fondatrice-pedagogical-override.ts`.

### Production audit (2026-07-01)

All four founders exhibit:

| Field | Value |
|-------|-------|
| `passed` | `true` |
| `progressPct` | `100` (not 0 at module level) |
| `engineVersion` | `founder-v1` |
| `scenarioStatusJson._pedagogicalOverride` | Present |
| Per-SCN `source` | `"teacher-validated"` |
| Per-SCN `runId` | Often `null` (M3–M5); sometimes populated (e.g. Darlin M2 has runIds) |
| Per-SCN `passed` | `true` at threshold score (60 M2, 70 M3–M5) |

### Verdict

**Expected institutional override — not technical debt requiring RC15.1 action.**

The `founder-v1` engine and `_pedagogicalOverride` metadata document an exceptional pedagogical validation for Cohorte Fondatrice 2026. The script explicitly:

- Does **not** touch Silver/Gold profile flags or certificate registries
- Sets module completion to 100% for classroom continuity
- Uses `runId: null` where no canonical run is linked — acceptable for override rows

**Non-blocking.** No modification performed per stabilization scope.

**Note on QA wording:** If a report cited `progressPct=0`, that likely referred to an intermediate pre-recompute state or per-SCN display before override/backfill — current production module rows show `progressPct: 100`.

---

## Recommendations

| Priority | Recommendation | Status |
|----------|----------------|--------|
| P0 | James `studentNumber` = `16183026` | **Done** |
| P1 | Document golden student rules | **Done** — `GOLDEN_STUDENT_JAMES_TIMOTHY.md` |
| P2 | Checkpoint sync: add server-side `recomputeModuleCheckpoint` after `completeRun` (M2–M5) | **Proposed — await approval** |
| P3 | Update QA runners to call `recordModulePass` after API completions | **Proposed** |
| P4 | Reserve `TEC-SIL-2026-005` if institutional Silver preview for James is ever approved | **Deferred — governance decision** |
| P5 | Founder `founder-v1` rows | **No action** — institutional override intact |

---

## Risk Level

| Area | Risk |
|------|------|
| James profile fix | **Low** — single nullable field, verified |
| Checkpoint sync gap | **Low–Medium** — affects monitor freshness, not scoring or certification |
| Founder override metadata | **None** — documented, stable |
| Cohorte Fondatrice impact | **None** — no founder mutations |

---

## Decision

# READY

RC15.1 stabilization objectives are met:

- Golden Student profile corrected and verified
- Checkpoint synchronization characterised with a minimal fix proposal (not implemented)
- Legacy founder backfill confirmed as intentional institutional state
- Documentation published under `docs/testing/`

**No commit, push, or deploy required for this stabilization pass.**

Optional follow-up (separate RC): approve and implement server-side checkpoint recompute on `completeRun`.
