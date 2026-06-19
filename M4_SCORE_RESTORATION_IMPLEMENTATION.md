# M4 Score Restoration — Implementation Report (Option B)

**Mission:** M4 Score Restoration (Option B) — true 100/100 achievable  
**Date:** 2026-06-19  
**Scenarios:** SCN-012, SCN-013, SCN-014 (shared M4 pipeline)

---

## Before

| Step | Runtime award | STEP_MAX_ALL (display) | Notes |
|------|---------------|------------------------|-------|
| KPI_DATA | 10 | 10 | Aligned |
| KPI_ROTATION | **15** | 20 | Mismatch |
| KPI_SERVICE | **15** | 20 | Mismatch |
| KPI_DIAGNOSTIC | **20** | 20 | Aligned |
| COMPLIANCE_M4 | **15** | 15 | Aligned |
| **Perfect-run total** | **75** | 85 (step sum) / **100** (header) | 100/100 unreachable |

**RunReport:** Hardcoded pass threshold **60 pts** for all modules (incorrect for M4 — should be 70/100).

**Certification:** Pass threshold 70/100 unchanged; perfect-run banner (`isPerfect >= 100`) never triggered for M4.

---

## After

| Step | Runtime award | STEP_MAX_ALL (display) | Source |
|------|---------------|------------------------|--------|
| KPI_DATA | 10 | 10 | `M4_STEP_MAX` |
| KPI_ROTATION | **20** | **20** | `scoreKpiInterpretation` + `M4_STEP_MAX` |
| KPI_SERVICE | **20** | **20** | `scoreKpiInterpretation` + `M4_STEP_MAX` |
| KPI_DIAGNOSTIC | **25** | **25** | `scoreKpiInterpretation` + `M4_STEP_MAX` |
| COMPLIANCE_M4 | **25** | **25** | Router + `M4_STEP_MAX` |
| **Perfect-run total** | **100** | **100** | Fully aligned |

**Formula:** `10 + 20 + 20 + 25 + 25 = 100`

---

## Changes Implemented

### 1. Runtime scoring (`server/rulesEngine.ts`)

- Exported `M4_STEP_MAX` and `M4_PERFECT_RUN_TOTAL` as single source of truth.
- `scoreKpiInterpretation`:
  - `rotationRate`: 15 → **20**
  - `serviceLevel`: 15 → **20**
  - `diagnostic`: 20 → **25**
  - Penalties unchanged (−5 rotation/service; 0 diagnostic)

### 2. STEP_MAX_ALL alignment (`server/routers.ts`)

- `STEP_MAX_ALL` M4 entries spread from `M4_STEP_MAX` (no duplicate literals).
- `COMPLIANCE_M4_COMPLETED` events use `M4_STEP_MAX.COMPLIANCE_M4` (**25**).

### 3. RunReport (`client/src/pages/student/RunReport.tsx`)

- Removed hardcoded **60 pts** pass threshold.
- Uses `getModuleScenarioPassThreshold(moduleId)` — **70/100** for M4 (and M3/M5).
- Progress bar color uses module-aware threshold.

### 4. Dashboard verification

| Surface | Status | Notes |
|---------|--------|-------|
| **Rankings** (`TeacherDashboard`) | ✅ No change needed | Uses `getModuleScenarioPassThreshold(moduleId)` per module |
| **Analytics** (`AnalyticsDashboard`) | ⚠️ Global 60 baseline | Cross-module chart uses M1/M2 floor; M4 eval scores scale 0–100 correctly |
| **Module progress** | ✅ Unaffected | Step-count based, not point-based |
| **Reports** (`RunReport`) | ✅ Fixed | Module-aware threshold + aligned step maxima via API |

### 5. Historical data

- **No automatic backfill executed.** See `M4_SCORE_BACKFILL_PLAN.md`.

### 6. Tests updated

| File | Coverage |
|------|----------|
| `server/module345.rules.test.ts` | Updated point expectations; added `M4_STEP_MAX alignment` suite |
| `server/m4ScoreRestoration.test.ts` | Perfect-run total 100; pass threshold 70; penalty margin |
| `client/src/data/m4KpiEvidenceFeed.test.ts` | Fixture `pointsDelta` parity |

---

## Risk

| Risk | Level | Mitigation |
|------|-------|------------|
| Historical run score disparity (pre/post deploy) | **Medium** | Backfill plan documented; grandfathering via `computeModulePassResult` |
| Cohort ranking skew | **Low–Medium** | New runs score up to +25 higher; backfill optional |
| Pass threshold inflation | **Low** | Threshold stays 70; margin at ceiling increases (+5 → +30) |
| Certification equity | **Low** | Gold still requires compliance + ≥70; no threshold change |
| Regression in M3/M5 | **None** | M4-only constants and router paths |

---

## Validation

| Check | Result |
|-------|--------|
| `M4_PERFECT_RUN_TOTAL === 100` | ✅ |
| `scoreKpiInterpretation` awards match `M4_STEP_MAX` | ✅ |
| `STEP_MAX_ALL` M4 keys === `M4_STEP_MAX` | ✅ |
| M4 pass threshold 70/100 | ✅ |
| RunReport displays module threshold (not 60) | ✅ |
| `vitest run` full suite | ✅ (see commit) |

---

## Certification Impact

| System | Impact |
|--------|--------|
| **Gold** (`goldCertification.ts`) | **None** on gates — still `validateM4Compliance` + score ≥ 70 |
| **Silver** | **None** — M4 not a Silver gate |
| **Pass threshold** (`getModuleScenarioPassThreshold(4)`) | **Unchanged at 70** |
| **Grandfathering** (`computeModulePassResult`) | **Unchanged** — legacy passed rows retained |
| **Perfect-run semantics** | **Changed** — 100/100 now achievable and triggers `isPerfect` banner |
| **RC14 acceptance docs** | **Superseded** — 75/100 ceiling replaced by 100/100 (Option B institutional decision) |
| **Cohorte Fondatrice** | **Medium** — pre-deploy runs capped at 75 unless backfill executed |

---

## Files Modified

| File | Change |
|------|--------|
| `server/rulesEngine.ts` | `M4_STEP_MAX`, scoring awards |
| `server/routers.ts` | `STEP_MAX_ALL`, COMPLIANCE_M4 points |
| `client/src/pages/student/RunReport.tsx` | Module-aware pass threshold |
| `server/module345.rules.test.ts` | Scoring + alignment tests |
| `server/m4ScoreRestoration.test.ts` | New restoration validation suite |
| `client/src/data/m4KpiEvidenceFeed.test.ts` | Fixture parity |

---

*Implementation completed 2026-06-19. Backfill execution requires explicit operator approval per `M4_SCORE_BACKFILL_PLAN.md`.*
