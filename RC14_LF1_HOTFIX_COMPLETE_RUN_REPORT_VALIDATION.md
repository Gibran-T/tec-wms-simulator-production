# RC14-LF1 Hotfix — Complete Run Report Validation

**Mission:** RC14-LF1 HOTFIX — COMPLETE RUN REPORT VALIDATION  
**Date:** 2026-06-18  
**Deploy baseline:** 750caa1 (Post-Scenario Learning Layer live on SCN-012)  
**Status:** Implemented + tests green

---

## Executive summary

Production SCN-012 Run Report showed the Learning Layer but only surfaced **KPI_DATA** and **COMPLIANCE_M4** cards prominently, while **KPI_ROTATION**, **KPI_SERVICE**, and **KPI_DIAGNOSTIC** appeared missing to users. Personalized recommendations incorrectly defaulted to **Module 2 / FIFO** on M4 perfect runs.

Root cause: the learning payload did not bind **runtime completed steps** (`state.completedSteps`) to card visibility/expansion. Cards with correct KPI submissions collapsed by default and were easy to miss; M5 ops steps had no completion signal. Recommendations used a **Module 1-only success fallback**.

This hotfix wires `completedStepCodes` through the server payload, resolves visible cards from registry + completion, expands completed steps by default, and adds **module-aware recommendations** without touching scoring, compliance, or certification logic.

---

## Issues observed (SCN-012 production)

| Field | Expected | Observed |
|-------|----------|----------|
| Score final | 75/100 | 75/100 ✓ |
| Étapes validées | 5/5 | 5/5 ✓ |
| Progression | 100% | 100% ✓ |
| Conformité système | conforme | conforme ✓ |
| Erreurs commises | 0 | 0 ✓ |
| Learning cards | 5 M4 cards | Only KPI_DATA + COMPLIANCE_M4 prominent |
| Recommendation | Next M4 or M5 | "Passez au Module 2… FIFO" ✗ |

---

## Root cause analysis

### 1. Missing / hidden learning cards

- `buildLearningFeedbackPayload` mapped **kpiInterpretations** to step submissions but did not receive **`state.completedSteps`**.
- `LearningFeedbackLayer` iterated the full registry without completion-aware visibility.
- `defaultExpanded` collapsed steps with `submissionCorrect === true`, so a perfect SCN-012 run showed expanded content mainly for **KPI_DATA** (no interpretation row) and users overlooked collapsed **KPI_ROTATION / KPI_SERVICE / KPI_DIAGNOSTIC** headers.

### 2. Wrong personalized recommendation

- `server/routers.ts` `detailedReport` used a single success fallback:
  > "Passez au Module 2 pour approfondir FIFO…"
- That path ran for **all modules** when `errors.length === 0` and no error-type recommendations applied — including **Module 4** and **Module 5**.

---

## Implementation

### Files changed

| File | Change |
|------|--------|
| `shared/learningFeedbackTypes.ts` | Add `stepCompleted` on step payload |
| `shared/learningFeedbackPayload.ts` | Accept `completedStepCodes`; add `resolveVisibleLearningSteps()` |
| `shared/runReportRecommendations.ts` | **New** — module/SCN-aware recommendation builder |
| `server/routers.ts` | Pass `state.completedSteps`; use shared recommendations |
| `client/.../LearningFeedbackLayer.tsx` | Render `resolveVisibleLearningSteps()`; expand completed steps |
| `client/.../LearningStepCard.tsx` | `Validé` badge for completed non-interpretation steps |
| `client/.../learningFeedback.test.ts` | 16 tests — card coverage, recommendations, scoring isolation |

### Card visibility model

```
state.completedSteps
        │
        ▼
buildLearningFeedbackPayload({ completedStepCodes })
        │  stepCompleted per registry step
        ▼
resolveVisibleLearningSteps(scenario, completedStepCodes)
        │  runtime completed steps
        │  + KPI_ERRORS pedagogical when KPI_SERVICE done (SCN-013/014)
        ▼
LearningFeedbackLayer → LearningStepCard (expanded if stepCompleted)
```

### M4 kpiKey → step mapping (unchanged)

| kpiKey | stepCode |
|--------|----------|
| `rotationRate` | `KPI_ROTATION` |
| `serviceLevel` | `KPI_SERVICE` |
| `errorRate` | `KPI_ERRORS` (pedagogical SCN-013/014) |
| `diagnostic` | `KPI_DIAGNOSTIC` |
| `m5Decision` | `M5_DECISION` |

Runtime steps **KPI_DATA**, **COMPLIANCE_M4**, **M5_*** ops steps use **`completedStepCodes`** only.

### Card coverage audit

| SCN | Expected visible cards (perfect completed run) | Count |
|-----|--------------------------------------------------|-------|
| SCN-012 | KPI_DATA, KPI_ROTATION, KPI_SERVICE, KPI_DIAGNOSTIC, COMPLIANCE_M4 | 5 |
| SCN-013 | Above + KPI_ERRORS (pedagogical) | 6 |
| SCN-014 | Above + KPI_ERRORS (pedagogical) | 6 |
| SCN-015 | M5_RECEPTION → COMPLIANCE_M5 (7 ops/KPI/decision steps) | 7 |
| SCN-016 | SCN-015 set + M5_ADJ | 8 |
| SCN-017 | 7-step strategic capstone (A1/A2/A3 on M5_DECISION) | 7 |

### Personalized recommendations (fixed)

| Module | SCN | Success recommendation |
|--------|-----|------------------------|
| M4 | SCN-012 | Poursuivez avec **SCN-013** |
| M4 | SCN-013 | Poursuivez avec **SCN-014** |
| M4 | SCN-014 | Passez au **Module 5 (SCN-015)** |
| M5 | SCN-015 | Enchaînez avec **SCN-016** |
| M5 | SCN-016 | Enchaînez avec **SCN-017** |
| M5 | SCN-017 | Parcours **Gold TEC.LOG / certification intégrée** |
| M1 | any | Module 2 FIFO (unchanged) |
| M2/M3 | any | Next module in pathway |

Error-based recommendations (zones, compliance demo mode, etc.) are **unchanged**.

---

## Scoring / compliance preservation

| Domain | Touched? | Evidence |
|--------|----------|----------|
| Scoring engine | **No** | No changes to `scoreKpiInterpretation`, `calculateTotalScore`, scoring events |
| Compliance engine | **No** | No changes to `checkCompliance`, `validateM4Compliance` |
| Certification / Silver | **No** | `certificationUnlocked` / `silverEligible` paths unchanged |
| Student history / best score | **No** | `recordModulePass`, `myScoreEvolution` unchanged |
| SCN-012 perfect score | **75/100** | Test asserts 10+15+15+20+15 = 75; payload build does not mutate events |

---

## Test results

```text
✓ client/src/components/learning-feedback/learningFeedback.test.ts (16 tests)
  - Registry SCN-012 → SCN-017 coverage
  - resolveVisibleLearningSteps — SCN-012/013/014/015/016/017 card counts
  - buildLearningFeedbackPayload — completedStepCodes + M4/M5 mapping
  - Scoring events immutable after payload build (75/100 SCN-012)
  - buildRunReportRecommendations — M4/M5/M1 paths

✓ server/module345.rules.test.ts (109 tests) — regression green
```

---

## Post-deploy smoke checklist

- [ ] SCN-012 perfect eval run → Run Report shows **5 learning cards** expanded (rotation/service/diagnostic visible)
- [ ] SCN-012 recommendation → **SCN-013** (not Module 2)
- [ ] SCN-014 perfect run → recommendation → **Module 5 / SCN-015**
- [ ] SCN-013 perfect run → **6 cards** including KPI_ERRORS pedagogical block
- [ ] SCN-015 perfect run → **7 M5 cards** including ops chain
- [ ] SCN-017 perfect run → recommendation mentions **Gold / certification**
- [ ] Score 75/100, 0 errors, 5/5 steps, conforme — unchanged on SCN-012

---

## Traceability

| Task | Status |
|------|--------|
| Investigate registry + payload mapping | ✅ |
| SCN-012 all five completed cards | ✅ |
| Audit SCN-013 / SCN-014 missing-card risk | ✅ |
| Audit SCN-015 / SCN-016 / SCN-017 M5 coverage | ✅ |
| Validate Run Report scoring consistency | ✅ (no engine changes) |
| Tests — learning layer does not alter score/compliance/cert | ✅ |
| Fix M4/M5 personalized recommendations | ✅ |
| Preserve scoring, compliance, thresholds, cert, history | ✅ |

---

*End of RC14-LF1 hotfix validation report*
