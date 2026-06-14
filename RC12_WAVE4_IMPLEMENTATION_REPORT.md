# RC12 Wave 4 — M5 Runtime Alignment Implementation Report

**Programme:** TEC.WMS RC12  
**Date:** 2026-06-14  
**Commit base:** Wave 3 @ e52adf5  
**Gate target:** G4

---

## Executive verdict

### **G4 READY**

Wave 4 closes all P0 blockers for SCN-015/016/017. Runtime now enforces contract-bound M5 flows, variance→ADJ gating, KPI snapshot→decision linkage, and `validateM5Compliance`.

| Scenario | Pre-Wave 4 | Post-Wave 4 |
|----------|------------|-------------|
| **SCN-015** | YELLOW | **GREEN** |
| **SCN-016** | RED | **GREEN** |
| **SCN-017** | RED | **GREEN** |
| **Arc 015→017** | RED | **YELLOW** (narrative + contract consistency; no cross-run state carry-over) |

---

## Phase A — Seed contracts

**File:** `server/seed.ts`

| Scenario | Profile | Contract highlights |
|----------|---------|-------------------|
| SCN-015 | `NOMINAL_INTEGRATED` | SKU-001 · 50 u. · PO-M5-001 · LOT-M5-A · REC-01→B-01-R1-L1 · `decisionLevel: TACTICAL` |
| SCN-016 | `EXCEPTION_VARIANCE` | `cycleCountTargets` system 50 / physical 45 · `varianceInjection: -5` |
| SCN-017 | `STRATEGIC_CAPSTONE` | Canonical KPI bundle · `decisionLevel: STRATEGIC` |

---

## Phase B — Runtime variance + M5_ADJ

**Files:** `server/rulesEngine.ts`, `server/routers.ts`, `client/src/pages/student/StepForm.tsx`

- `getEffectiveM5Steps()` — inserts `M5_ADJ` after `M5_CYCLE_COUNT` when variance profile active
- `m5.submitAdj` — MI07 transaction + `addInventoryAdjustment` + resolves cycle counts
- `submitCycleCount` — injects seeded system/physical qty for SCN-016 (−5 variance)
- `assertM5VarianceGate` — blocks `M5_REPLENISH`, `M5_KPI`, `M5_DECISION` until ADJ posted
- StepForm `m5_adj` UI with justification gate (min 10 chars)

---

## Phase C — KPI snapshot gate

- `submitKpi` persists full snapshot via `addKpiSnapshot`
- `submitDecision` **requires** existing snapshot — hardcoded KPI default removed
- `detailedReport` + `RunReport.tsx` expose M5 KPI snapshot, variance trail, ADJ lines

---

## Phase D — SCN-017 decision validator

**File:** `server/rulesEngine.ts` — `scoreM5StrategicDecision()`

Requires for SCN-017 (`decisionLevel: STRATEGIC`):
- ≥2 numeric KPI citations matched to snapshot (±tolerance)
- Trade-off / arbitrage language
- Strategic recommendation
- 90–180 day horizon or follow-up action
- Rejects R1 operational-level and R2 generic keyword-only answers

SCN-015/016 retain tactical keyword rubric via `scoreM5Decision()`.

---

## Phase E — validateM5Compliance

**File:** `server/rulesEngine.ts` — `validateM5Compliance()`

Blocks when:
- Unresolved variance / M5_ADJ missing on variance profile
- KPI snapshot missing
- SCN-017 decision rejected (KPI-linked justification)
- Negative stock or unposted critical transactions
- Incomplete step chain

Wired to `submitComplianceM5` with rollback flag:
- `ENABLE_M5_COMPLIANCE_VALIDATOR=false` → legacy one-click close

---

## Phase F — Reports and OIL

| Surface | Changes |
|---------|---------|
| `server/missionDataExtended.ts` | Peak Week copy · chiffré contracts · unified persona |
| `client/src/data/scenarioCockpitPedagogy.ts` | SCN-015/016/017 capstone copy |
| `client/src/data/m5KpiControlTower.ts` | M5 KPI Control Tower + decision scaffold |
| `OperationalIntelligenceLayer.tsx` | M5 tower · variance pastille (016) · decision guide (017) |
| `RunReport.tsx` | M5 snapshot · variance · ADJ sections |

---

## Tests

**File:** `server/module345.rules.test.ts` — Wave 4 describe block (13 tests)

| # | Test | Status |
|---|------|--------|
| 1 | SCN-015 nominal completion | PASS |
| 2 | SCN-016 variance injection | PASS |
| 3 | SCN-016 blocked with unresolved variance | PASS |
| 4 | SCN-016 M5_ADJ resolves variance | PASS |
| 5 | SCN-016 compliance blocked before ADJ | PASS |
| 6 | SCN-017 KPI snapshot required | PASS |
| 7 | SCN-017 rejects generic keyword text | PASS |
| 8 | SCN-017 accepts KPI-linked strategic answer | PASS |
| 9 | validateM5Compliance blocks missing evidence | PASS |
| 10 | Rollback flag semantics | PASS |

**Full suite:** 350 tests PASS · M1–M4 unchanged  
**Build:** `pnpm build` PASS

---

## Blueprint G1–G5 post-Wave 4

| Criterion | Status |
|-----------|--------|
| G1 Runtime = Mission Sheet (`m5Contract`) | **GREEN** |
| G2 OADEAV; no auto-fill decision | **GREEN** |
| G3 Mission Control + OIL = capstone copy | **GREEN** |
| G4 COMPLIANCE_M5 validates outcome | **GREEN** |
| G5 No bypass paths | **GREEN** |

**Score: 5/5 GREEN** (arc continuity YELLOW by design — no multi-run persistence in Wave 4)

---

## Out of scope (confirmed)

- M1–M4 rework
- Silver changes
- Gold unlock
- Registry, QR, public credentials, migrations, production data

---

## Rollback

Set `ENABLE_M5_COMPLIANCE_VALIDATOR=false` to restore legacy compliance auto-complete. Re-run seed to revert contract content if needed.

---

*RC12 Wave 4 engineering deliverable — G4 READY*
