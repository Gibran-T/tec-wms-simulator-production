# Pedagogical upgrade M1–M4 — Implementation handoff

**Date:** 2026-08-12  
**Constraint honored:** no change to WMS operational motor contracts (putaway/FIFO/CC seeds/rules paths).  
**James remote E2E:** script ready; blocked locally (no `JAMES_PASSWORD` in env). Contract/unit path **PASS**.

---

## 1. M4 — Cognitive selector (core request)

### Behavior
- On `KPI_ROTATION` / `KPI_SERVICE` / `KPI_DIAGNOSTIC` (SCN-012/013/014): **dropdown with 5 near-miss answers**.
- **Wrong** → red alert with **option-specific why** + scoring event **−5** (`KPI_*_COGNITIVE_INCORRECT`); step stays open (retry allowed).
- **Correct** → green why + step award; may pass after prior misses; penalties remain in score.

### Files
| File | Role |
|------|------|
| `shared/m4CognitiveSelectors.ts` | 9 questions × 5 options + whyWrong/whyRight |
| `client/src/components/analytical/CognitiveAnswerSelector.tsx` | Selector UI + red/green panels |
| `client/src/pages/student/StepForm.tsx` | Wires selector for M4 (M5 stays free-text) |
| `server/routers.ts` | `optionId` input, penalty on miss, award on hit |
| `server/m4CognitiveSelectors.test.ts` | Catalog ↔ scorer alignment |
| `server/m4CognitiveJamesPath.test.ts` | James-style wrong→correct→compliance |
| `scripts/qa-james-m4-cognitive.mjs` | Remote James E2E + demo readiness cleanup |

### Tests run
```
✓ server/m4CognitiveSelectors.test.ts (3)
✓ server/m4CognitiveJamesPath.test.ts (4)
✓ server/m4m5.shortAnswer.hotfix.test.ts (13)
```

### James QA (when you return)
```bash
JAMES_PASSWORD=*** node scripts/qa-james-m4-cognitive.mjs
# optional cleanup:
TEC_ADMIN_EMAIL=*** TEC_ADMIN_PASSWORD=*** JAMES_PASSWORD=*** node scripts/qa-james-m4-cognitive.mjs
```
Requires **deployed** build with `optionId` support. Until deploy, production will reject `optionId`.

---

## 2. M1–M3 pedagogy (no motor)

| Deliverable | Where |
|-------------|--------|
| Error School (traps → evidence → action) | `shared/pedagogy/errorSchool.ts` + `ErrorSchoolPanel` on hubs M1–M3 |
| Micro-drills 5-option (formative, no scenario score) | `shared/pedagogy/microDrills.ts` + `MicroDrillPanel` |
| Post-run debrief checklist (5 min) | `PostRunDebriefChecklist` on completed `RunReport` |
| Process strip completed-state | `OperationalFlowDisplay` |
| Slides M1 putaway + picking | `client/src/data/modules.ts` |
| M2: remove LIFO, bin `B-01-R1-L1`, GR pré-posté notes | same |
| M3: order CC → Min/Max → SS → teacher gate; EOQ demoted | same |
| Durations aligned to 6h | `moduleConfig.ts` + `modules.ts` |

---

## 3. What was NOT changed
- `rulesEngine` putaway/FIFO/CC/replenish validators
- Scenario seeds / Mission Sheet quantities
- Silver/Gold certification gates
- M5 free-text decision field

---

## 4. Suggested next deploy checklist
1. Deploy this branch.
2. Run `scripts/qa-james-m4-cognitive.mjs` (wrong then correct on SCN-012).
3. Confirm Run Report shows −5 cognitive penalty + step awards.
4. `admin.prepareDemoReadiness` → James **READY FOR CLASS**.
5. Spot-check hubs M1–M3: Error School + Micro-drills visible.
