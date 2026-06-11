# D-M3-02 Implementation Report

**Date:** 2026-06-10  
**Branch:** `production-hotfix-rc13-pedagogy-class6`  
**Status:** Implemented — **uncommitted**, **not deployed**  
**Scope:** M3 only — SCN-009, SCN-010, SCN-011  
**Design reference:** `D-M3-02_PEDAGOGICAL_DESIGN.md`

---

## 1. Summary

D-M3-02 implements the authorized build order:

| # | Item | Status |
|---|------|--------|
| 1 | `validateM3Compliance()` + COMPLIANCE_M3 gate | ✅ Done |
| 2 | Multi-SKU cycle count (SCN-009) via `cycleCountTargets` | ✅ Done |
| 3 | Multi-SKU replenishment (SCN-011) via `replenishmentParams` | ✅ Done |
| 4 | SCN-011 copy/pedagogy alignment (no engine change) | ✅ Done |

**Held (per authorization):**

| Item | Status |
|------|--------|
| SCN-009 documentation rule for any non-zero variance (P-M3-009-02) | ⏸ Not implemented |
| M4/M5/Gold changes | ⏸ Not touched |
| DB schema migrations / production data changes | ⏸ Not touched |

**D-M3-01 preserved:** `getM3VarianceThreshold`, `validateVarianceEntry` in `submitCcRecon`, SCN-010 threshold 20, StepForm banner unchanged.

**Grandfather policy:** All M3 mutations return early when `run.status === "completed"`. New rules apply only to **in-progress** runs going forward.

---

## 2. Files Changed

| File | Change |
|------|--------|
| `server/rulesEngine.ts` | `validateM3Compliance`, cycle/replen helpers, seed parsers, `ValidationResult` type |
| `server/routers.ts` | M3 step accumulation + COMPLIANCE gate; `loadM3ComplianceArtifacts` helper |
| `server/db.ts` | `upsertInventoryCount`, `upsertReplenishmentSuggestion` (no schema change) |
| `server/m3.d-m3-02.test.ts` | **New** — 14 D-M3-02 tests |
| `client/src/pages/student/StepForm.tsx` | Multi-SKU CC_LIST UI; partial-step toasts; SCN-011 replenish banner |
| `server/missionDataExtended.ts` | SCN-011 Min–Max copy alignment |
| `client/src/data/scenarioCockpitPedagogy.ts` | SCN-011 cockpit hints aligned to Q = Max − stock |

---

## 3. Implementation Detail

### 3.1 COMPLIANCE_M3 — `validateM3Compliance()`

**Location:** `server/rulesEngine.ts`

Validates against scenario `initialStateJson`:

- **Cycle count:** each `cycleCountTargets[]` entry counted at seed `physicalQty`
- **Reconciliation:** non-zero variances have matching ADJ + posted ADJ transaction
- **Justification:** D-M3-01 threshold rules (SCN-010 −28 requires text; SCN-009 −3 still optional)
- **Replenishment:** each `replenishmentParams[]` SKU has suggestion with `studentQty` matching engine `Q = Max − stock`
- **Transactions:** no unposted rows

**API:** `submitComplianceM3` calls validator before `completeRun()`. Failure → `BAD_REQUEST` + `COMPLIANCE_M3_FAILED` scoring event (−10, eval only).

### 3.2 SCN-009 — Multi-SKU cycle count

**Contract:** `initialStateJson.cycleCountTargets` (already in seed)

| Step | Behavior |
|------|----------|
| `submitCcList` | Rejects unless **all** target SKUs in `skus[]` |
| `submitCcCount` | Upserts per SKU; completes step only when all targets counted at correct `physicalQty` |
| `submitCcRecon` | Completes only when all variances reconciled (ADJ for −3 on SKU-001) |
| **UI** | CC_LIST auto-includes all required SKUs; shows target list |

Catch-up: if step already marked complete (legacy in-progress run), additional count/recon submissions allowed until targets satisfied.

### 3.3 SCN-011 — Multi-SKU replenishment

**Contract:** `initialStateJson.replenishmentParams` (already in seed)

| Step | Behavior |
|------|----------|
| `submitReplenish` | Upserts per SKU; stores `studentQty` in reason (`;studentQty=N`); completes only when **both** SKU-004 (170) and SKU-005 (260) satisfied exactly |
| **UI** | Banner listing both SKUs and Min/Max/SS |

Engine unchanged: `computeReplenishmentSuggestion` = Max − systemQty.

### 3.4 SCN-011 copy alignment

Updated Mission Sheet proxy + cockpit to teach **Q = Max − stock actuel** instead of ROP/EOQ as the operational formula. ROP/EOQ remain in StepForm pedagogical deep panel as industry context only.

### 3.5 SCN-010

No new step logic beyond COMPLIANCE gate: existing D-M3-01 justification at threshold 20 enforced at CC_RECON and re-checked at COMPLIANCE_M3.

---

## 4. Test Results

### 4.1 Full suite

```
 RUN  v2.1.9

 Test Files  14 passed (14)
      Tests  289 passed (289)
   Duration  9.05s
```

**Delta:** +14 tests (275 → 289) from `server/m3.d-m3-02.test.ts`.

### 4.2 Required D-M3-02 tests

| Requirement | Test |
|-------------|------|
| SCN-009 cannot complete with only one SKU counted | `validateCycleCountEntriesComplete` + `validateM3Compliance` reject partial |
| SCN-009 completes when all SKUs counted/reconciled | `validateCycleCountReconComplete` + `validateM3Compliance` accept full path |
| SCN-011 cannot complete replenishment after one SKU | `validateReplenishmentComplete` rejects SKU-004 only |
| SCN-011 completes when all targets satisfied | `validateReplenishmentComplete` + `validateM3Compliance` accept both |
| COMPLIANCE_M3 rejects incomplete outcomes | SCN-009 partial count, SCN-010 missing justification, SCN-011 partial replenish |

### 4.3 D-M3-01 regression

`server/m3.stabilization.test.ts` — **12/12 pass** (SCN-009 −3 empty justification still allowed; SCN-010 threshold 20 enforced).

---

## 5. Uncommitted Diff Summary

```
 client/src/data/scenarioCockpitPedagogy.ts |   4 +-
 client/src/pages/student/StepForm.tsx      |  94 +++++++--
 server/db.ts                               |  62 ++++++
 server/missionDataExtended.ts              |   8 +-
 server/routers.ts                          | 183 +++++++++++++++--
 server/rulesEngine.ts                      | 320 ++++++++++++++++++++++++++++-
 server/m3.d-m3-02.test.ts                  | 217 (new, untracked)
 ─────────────────────────────────────────────────────────
 6 modified + 1 new test file ≈ 846 lines touched
```

**Not staged for commit** (per instruction).

**Untracked reports** (pre-existing, not part of D-M3-02 code): `D-M3-02_PEDAGOGICAL_DESIGN.md`, audit/alignment/P0 reports.

---

## 6. Operational Notes

| Topic | Note |
|-------|------|
| **Deploy** | Not performed |
| **Commit** | Not performed — await review |
| **Production DB** | No migration; uses existing `inventory_counts`, `inventory_adjustments`, `replenishment_suggestions` tables |
| **Completed runs** | Grandfathered via `run.status === "completed"` early return |
| **In-progress runs** | May need additional CC_COUNT / REPLENISH submissions before COMPLIANCE_M3 |
| **P-M3-009-02** | Still open — empty justification allowed for SCN-009 −3 |

---

## 7. Review Checklist

- [ ] Confirm grandfather policy for in-progress runs (catch-up submissions)
- [ ] Confirm exact-match requirement for SCN-011 replenishment qty (170 / 260)
- [ ] Confirm COMPLIANCE_M3 blocks SCN-010 without justification even if CC_RECON step was marked complete earlier
- [ ] Pedagogy owner: SCN-011 copy changes acceptable vs institutional PDF
- [ ] Approve commit when ready

---

*End of D-M3-02 implementation report.*
