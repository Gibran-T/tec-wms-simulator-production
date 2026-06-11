# D-M3-01 Implementation Report — SCN-010 Variance Threshold Alignment

**Date:** 2026-06-10  
**Fix:** D-M3-01 only (P0 variance threshold + enforcement)  
**Branch:** `production-hotfix-rc13-pedagogy-class6` @ `3349676`  
**Status:** Implemented — **NOT COMMITTED** (awaiting review)  
**Related audit:** `M3_STABILIZATION_AUDIT_REPORT.md`

---

## 1. Executive Summary

SCN-010 now uses per-scenario threshold **20 units** from seed `initialStateJson.adjustmentThreshold`. The rules engine, API (`m3.submitCcRecon`), and StepForm CC_RECON step enforce justification when |variance| ≥ threshold. The silent `"Ajustement manuel"` default is removed.

SCN-009 and other M3 scenarios without `adjustmentThreshold` keep the default **5 units**.

**Tests:** **275/275 PASS** (+16 new tests vs prior 259 baseline).

**Out of scope (unchanged):** D-M3-02 multi-SKU, DB/migrations, M4/M5/Gold, production data.

---

## 2. Changes Made

### 2.1 `server/rulesEngine.ts`

| Change | Detail |
|--------|--------|
| `M3_VARIANCE_THRESHOLD_DEFAULT` | New explicit default = **5** |
| `M3_VARIANCE_THRESHOLD` | Kept as alias to default (backward-compatible) |
| `getM3VarianceThreshold(initialStateJson)` | Reads `adjustmentThreshold` from scenario seed; fallback **5** |
| `computeVariance(..., threshold?)` | Optional per-scenario threshold parameter |
| `validateVarianceEntry(..., threshold?)` | Error messages use active threshold value |

### 2.2 `server/routers.ts` — `m3.submitCcRecon`

Before posting ADJ transactions:

1. Load scenario → `getM3VarianceThreshold(scenario.initialStateJson)`
2. Load prior counts via `getInventoryCountsByRun(runId)` for system/counted qty
3. For each non-zero adjustment:
   - `validateAdjustment(varianceQty, varianceQty)`
   - `validateVarianceEntry(systemQty, countedQty, justification, threshold)`
4. Reject with `BAD_REQUEST` + bilingual message if validation fails
5. Penalty event `VARIANCE_JUSTIFICATION_MISSING` (−10) in evaluation mode

**No DB schema changes.** Uses existing `inventory_counts` rows from `submitCcCount`.

### 2.3 `client/src/pages/student/StepForm.tsx`

| Change | Detail |
|--------|--------|
| `m3VarianceThreshold` | Derived from `runData.scenario.initialStateJson.adjustmentThreshold` (default 5) |
| CC_RECON banner | Amber guidance panel showing active threshold + 5-char justification rule |
| `cc_recon` submit | Client-side guard when \|variance\| ≥ threshold and justification < 5 chars |
| Removed | `justification ?? "Ajustement manuel"` silent default |

---

## 3. Behavior Matrix (Post-Fix)

| Scenario | Threshold | Variance | Empty justification | Valid justification |
|----------|-----------|----------|---------------------|---------------------|
| **SCN-010** | **20** | **−28** | **REJECTED** (API + UI) | **ACCEPTED** |
| **SCN-010** | **20** | **−15** | Allowed | N/A |
| **SCN-009** | **5** (default) | **−3** | **Allowed** | N/A |
| **SCN-009** | **5** | **−5** | **REJECTED** | Required (≥5 chars) |

---

## 4. Tests Added / Updated

### New: `server/m3.stabilization.test.ts` (12 tests)

- SCN-010 threshold 20 from seed metadata
- SCN-009 default threshold 5
- −28 requires justification at threshold 20
- −15 does not require justification at threshold 20
- Empty / whitespace justification rejected (no auto-fill)
- SCN-009 −3 allowed without justification

### Updated: `server/module345.rules.test.ts` (+4 tests)

- `getM3VarianceThreshold` reads seed override
- SCN-010 −28 / −15 boundary cases with threshold 20

### Regression

| Suite | Result |
|-------|--------|
| Full `pnpm test --run` | **275/275 PASS** |
| M1 compliance | PASS |
| M2 stabilization / scoring / monitor | PASS |
| Silver certification | PASS |
| tRPC integration (M3 flow) | PASS |

---

## 5. Files Changed (Uncommitted)

| File | Lines (approx.) |
|------|-----------------|
| `server/rulesEngine.ts` | +15 |
| `server/routers.ts` | +35 |
| `client/src/pages/student/StepForm.tsx` | +40 |
| `server/m3.stabilization.test.ts` | **NEW** (+95) |
| `server/module345.rules.test.ts` | +20 |
| `D-M3-01_IMPLEMENTATION_REPORT.md` | **NEW** (this file) |

---

## 6. Manual Verification Checklist (Post-Review)

| # | Action | Expected |
|---|--------|----------|
| V1 | SCN-010 run → CC_RECON banner | Shows threshold **20** |
| V2 | Submit −28 variance, empty justification | Toast error + API 400 |
| V3 | Submit −28 with ≥5 char justification | ADJ posted, step completes |
| V4 | SCN-009 run → CC_RECON −3, empty justification | Allowed |
| V5 | Confirm no `"Ajustement manuel"` in Network payload | Justification field empty or user text only |

---

## 7. Remaining Open Items (Not in Fix 1)

| ID | Item |
|----|------|
| D-M3-02 | Multi-SKU CC (SCN-009) and multi-SKU REPLENISH (SCN-011) |
| D-M3-03 | Wire `cycleCountTargets` for UI prefill |
| D-M3-04 | Teacher slide SCN label swap in `modules.ts` |

---

## 8. Commit Rule

- **DO NOT COMMIT** until reviewed
- **DO NOT DEPLOY**
- **DO NOT MODIFY PRODUCTION DB OR STUDENT DATA**

---

## 9. Test Command Output

```
Test Files  13 passed (13)
     Tests  275 passed (275)
  Duration  2.87s
```

All suites green including `m3.stabilization.test.ts`, `module345.rules.test.ts`, `m1.compliance.test.ts`, `m2.stabilization.test.ts`, `silver.certification.test.ts`.
