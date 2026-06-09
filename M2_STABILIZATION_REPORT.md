# M2 Stabilization Report — Class 6 Critical Pass

**Branch:** `production-hotfix-rc13-pedagogy-class6`  
**Date:** 2026-06-09  
**Status:** Audit + fixes complete — **NOT COMMITTED** (awaiting authorization)

---

## Executive Summary

M2 PUTAWAY split-brain routing was **fixed** — all student PUTAWAY operations now flow through **Mission Control → `/step/putaway` → StepForm → `m2.submitPUTAWAY`**. Capacity validation (SCN-007) was added to the unified API path. **233/233 tests pass**, **build succeeds**.

One residual scenario gap remains: **SCN-008** preloads GR directly into STOCKAGE bins (no REC-01 stock), while the mission path expects PUTAWAY from reception first.

---

## Phase 1 — M2 End-to-End Operational Validation

Validation method: code-path audit + rules-engine tests + `m2.stabilization.test.ts`. Live HTTP E2E blocked in audit environment (DB login failure); architecture validated via tRPC + superjson stack.

### SCN-006 — Rangement structuré (150 u. SKU-001 @ REC-01)

| # | Check | Result |
|---|-------|--------|
| 1 | Mission Control opens | **PASS** — `Module2ModeSelectionPage` → `/student/run/:runId` |
| 2 | Fiche Mission matches logic | **PASS** — `EXTENDED_MISSIONS.SCN-006` + `scenarioCockpitPedagogy` |
| 3 | Monitor evidence | **PASS** — PO-M2-001 / GR-M2-001 POSTED, REC-01 stock 150 |
| 4 | Student executes next action | **PASS** — next step `PUTAWAY` → `/step/putaway` |
| 5 | API valid JSON | **PASS** — `m2.submitPUTAWAY` → `{ success, demoWarning? }` |
| 6 | No HTML response | **PASS** — tRPC `/api/trpc/*` only |
| 7 | No `Unexpected token <` | **PASS** — no raw `fetch().json()` on operational forms |
| 8 | Next step advances | **PASS** — PUTAWAY → FIFO_PICK → STOCK_ACCURACY → COMPLIANCE_ADV |
| 9 | Compliance completable | **PASS** — `m2.submitComplianceAdv` + `completeRun` |
| 10 | Scenario finishable | **PASS** — full M2 chain in rules engine |

**Scenario verdict: PASS**

---

### SCN-007 — Capacité bin (600 u. SKU-002, B-01-R1-L1 max 500)

| # | Check | Result |
|---|-------|--------|
| 1 | Mission Control opens | **PASS** |
| 2 | Fiche Mission matches logic | **PASS** — overflow + split guidance in mission sheet |
| 3 | Monitor evidence | **PASS** — GR-M2-002 POSTED, 600 u. @ REC-01 |
| 4 | Student executes next action | **PASS** — PUTAWAY with capacity UI hints in StepForm |
| 5 | API valid JSON | **PASS** |
| 6 | No HTML response | **PASS** |
| 7 | No `Unexpected token <` | **PASS** |
| 8 | Next step advances | **PASS** — after valid split putaway(s) |
| 9 | Compliance completable | **PASS** |
| 10 | Scenario finishable | **PASS** (eval blocks single-bin 600 u. overflow) |

**Capacity fix applied:** `m2.submitPUTAWAY` now runs `validatePutaway()` (same rules as legacy `warehouse.submitPutaway`). Test: 600 u. → B-01-R1-L1 (max 500) → `CAPACITY_OVERFLOW`.

**Scenario verdict: PASS**

---

### SCN-008 — FIFO multi-lots (SKU-003, 3 GR posted)

| # | Check | Result |
|---|-------|--------|
| 1 | Mission Control opens | **PASS** |
| 2 | Fiche Mission matches logic | **PARTIAL** — mission text references PUTAWAY then FIFO; seed skips reception putaway |
| 3 | Monitor evidence | **PASS** — 3 GR POSTED (GR-M2-003A/B/C) |
| 4 | Student executes next action | **PARTIAL** — next step still `PUTAWAY` but REC-01 stock = 0 (GR preloaded to STOCKAGE) |
| 5 | API valid JSON | **PASS** |
| 6 | No HTML response | **PASS** |
| 7 | No `Unexpected token <` | **PASS** |
| 8 | Next step advances | **PASS** after PUTAWAY marked complete (or demo skip) |
| 9 | Compliance completable | **PASS** — FIFO_PICK + STOCK_ACCURACY + COMPLIANCE_ADV |
| 10 | Scenario finishable | **PARTIAL** — pedagogical friction at PUTAWAY without REC-01 stock |

**Scenario verdict: PARTIAL PASS** — routing fixed; seed initial state vs mission path misaligned (no schema/seed change in this pass per constraints).

---

## Phase 2 — M2 Routing Defects (FIXED)

### Defect (before)

| Entry | Route | Handler | Status |
|-------|-------|---------|--------|
| Module2ModeSelectionPage | `/student/module2/run/:id/putaway` | `PutawayForm` → `warehouse.submitPutaway` | Legacy |
| Mission Control Execute | `/student/run/:id/step/putaway` | StepForm (no config, no switch case) | **DEAD** |

### Fix (after) — single path

| Entry | Route | Handler |
|-------|-------|---------|
| Module2ModeSelectionPage | `/student/run/:runId` | Mission Control |
| Mission Control Execute | `/student/run/:id/step/putaway` | StepForm `STEP_CONFIG.putaway` → `m2.submitPUTAWAY` |
| Legacy URL (backward compat) | `/student/module2/run/:id/putaway` | `M2PutawayRedirect` → `/step/putaway` |

### Files changed

| File | Change |
|------|--------|
| `client/src/pages/student/StepForm.tsx` | Added `putaway` STEP_CONFIG; `case "putaway"` handler; `lotNumber` required for M2 |
| `client/src/pages/student/Module2ModeSelectionPage.tsx` | Navigate to Mission Control (not legacy putaway) |
| `client/src/pages/student/M2PutawayRedirect.tsx` | **NEW** — legacy URL redirect |
| `client/src/App.tsx` | Legacy route → `M2PutawayRedirect` |
| `server/routers.ts` | `m2.submitPUTAWAY` — capacity + FIFO lot validation via `validatePutaway()` |

**Note:** `PutawayForm.tsx` / `warehouse.submitPutaway` remain in codebase but are **no longer on the student path**. No split-brain for new sessions.

---

## Phase 3 — JSON Rendering Audit

### Stack

| Component | Finding |
|-----------|---------|
| `client/src/main.tsx` | `httpBatchLink` + `superjson` on `/api/trpc` — **correct** |
| `client/src/lib/trpc.ts` | React Query tRPC client — **no raw fetch** |
| `client/src/pages/student/StepForm.tsx` | All M1/M2 mutations via tRPC — **PASS** |
| `client/src/pages/student/PutawayForm.tsx` | Uses tRPC (orphaned from student flow) — **PASS** if called |
| `client/src/pages/student/QuizPage.tsx` | `JSON.parse` on quiz option strings only — **not operational WMS** |

### Search results

- **`Unexpected token <`**: No occurrences in codebase.
- **Raw `fetch` + `.json()`** on student operational forms: **none** (only tRPC wrapper in `main.tsx`).
- **HTML risk**: Only if server down or wrong URL hits SPA fallback — mitigated by tRPC error handling in `TRPCClientError`.

**JSON audit verdict: PASS** — zero operational-form JSON parse defects found.

---

## Phase 4 — Fiche Mission Alignment (SCN-001 → SCN-008)

| SCN | Mission Control | OIL / Cockpit | Mission Sheet (`missionData`) | Scenario Engine (seed + rules) | Next Step Logic | Solution Path | **Verdict** |
|-----|-----------------|---------------|-------------------------------|-------------------------------|-----------------|---------------|-------------|
| SCN-001 | Empty warehouse flow | Empty stock note | Clean cycle PO→GR→… | No preload | PO first | Create all docs | **ALIGNED** |
| SCN-002 | Ghost GR panel + regularize | GR-2025-001 PENDING | Post existing GR | PO posted, GR pending | GR until posted | Regularize → PUTAWAY_M1 | **ALIGNED** |
| SCN-003 | Stock insufficiency hints | SKU-003 qty note | Backorder + replenish | PO+GR posted | PUTAWAY_M1 after preload | Putaway → SO → replenish | **ALIGNED** |
| SCN-004 | CC variance hints | SKU-006 variance | CC → ADJ path | PO+GR posted | Standard + ADJ if variance | CC → ADJ → COMPLIANCE | **ALIGNED** |
| SCN-005 | Dual anomaly panel | GR-004 PENDING + SKU-005 | Docs → physical order | Ghost GR + SKU-005 stock | GR before putaway SKU-004 | Post GR-004 first | **ALIGNED** |
| SCN-006 | M2 MC + preloaded GR | 150 u. REC-01 | PUTAWAY → FIFO → compliance | GR posted @ REC-01 | PUTAWAY after GR auto-complete | Putaway → FIFO_PICK | **ALIGNED** |
| SCN-007 | Capacity context | 600 u. vs 500 cap | Split putaway | GR 600 @ REC-01 | PUTAWAY with capacity guard | Split bins | **ALIGNED** (post capacity fix) |
| SCN-008 | FIFO lot dates | 3 lots multi-bin | FIFO oldest first | GR directly in STOCKAGE | PUTAWAY required but REC-01 empty | FIFO_PICK primary | **PARTIALLY ALIGNED** |

---

## Phase 5 — Teacher Analytics Integrity (read-only audit)

| Link | Verified | Notes |
|------|----------|-------|
| Student Runs → `scenarioRuns` table | **INTACT** | `runs.start` creates rows; no data modified |
| Run History → `getRunsByUser` / `myRunsEnriched` | **INTACT** | Includes `completedSteps`, `progressPct`, score |
| Scoring → `scoringEvents` | **INTACT** | Written on step completion (eval mode) |
| Certification → `checkM1QuizPassed`, `unlockSilverCertification` | **INTACT** | Not modified in this pass |
| Teacher Dashboard → `monitor.allRuns` | **LIVE** | Reads `getAllRunsForMonitor()` + `buildRunState` |
| Teacher Analytics → `monitor.powerAnalytics` | **LIVE** | Aggregates eval runs; **excludes demo** from KPIs |
| Quiz scores → `quizAttempts` | **INTACT** | Separate from run scoring |

### Partial gaps (informational, not fixed)

- `powerAnalytics.stepCompletionRates` uses **MODULE1_STEPS only** — M2 step heatmap not represented in analytics radar.
- M2 `PUTAWAY` / `FIFO_PICK` completion not in `STEP_COLORS` analytics map (M1-centric labels).

**Analytics integrity verdict: PASS for data recording; PARTIAL for M2-specific analytics visualization.**

---

## Phase 6 — Build and Validation

| Check | Result |
|-------|--------|
| `npm test` | **233/233 PASS** (+4 new `m2.stabilization.test.ts`) |
| `npm run build` | **PASS** (Vite + esbuild) |
| Linter | No new errors on edited files |

---

## Defects Found vs Fixed

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| D-01 | **CRITICAL** | M2 `/step/putaway` dead form (wrong STEP_CONFIG + no submit case) | **FIXED** |
| D-02 | **CRITICAL** | Module2ModeSelectionPage routed to legacy PutawayForm | **FIXED** |
| D-03 | **HIGH** | `m2.submitPUTAWAY` lacked capacity validation (SCN-007) | **FIXED** |
| D-04 | **MEDIUM** | Legacy `/module2/run/:id/putaway` bookmark could hit dead path | **FIXED** (redirect) |
| D-05 | **MEDIUM** | SCN-008 seed: GR in STOCKAGE, PUTAWAY expects REC-01 stock | **OPEN** (seed not changed per constraints) |
| D-06 | **LOW** | Teacher analytics M2 step heatmap M1-only | **OPEN** (out of scope) |

---

## Commit Rule

Per mission instructions:

- **DO NOT COMMIT**
- **DO NOT PUSH**
- **DO NOT DEPLOY**

**STOP — awaiting authorization.**

Suggested commit message when approved:

```
fix(M2): unify PUTAWAY path via Mission Control StepForm + capacity validation

Route M2 mode selection to Mission Control; add STEP_CONFIG.putaway;
redirect legacy putaway URL; enforce validatePutaway on m2.submitPUTAWAY.
```

---

## Files Touched (uncommitted)

- `client/src/pages/student/StepForm.tsx`
- `client/src/pages/student/Module2ModeSelectionPage.tsx`
- `client/src/pages/student/M2PutawayRedirect.tsx` (new)
- `client/src/App.tsx`
- `server/routers.ts`
- `server/m2.stabilization.test.ts` (new)
- `M2_STABILIZATION_REPORT.md` (new)
