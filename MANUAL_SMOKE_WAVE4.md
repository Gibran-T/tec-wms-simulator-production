# Wave 4 Manual Smoke Matrix — SCN-015/016/017

**Programme:** TEC.WMS RC12 · Gate G4  
**Base commit (pre-cleanup):** `79536f2`  
**Document date:** 2026-06-14  
**Environment:** Local dev — browser E2E **not executed** in this cleanup session  

> Status legend: **PENDING** = not run · **PASS** = executed with evidence · **FAIL** = executed, failed  

---

## Prerequisites

1. `pnpm dev` (or staging URL) with DB seeded (`pnpm db:seed` or equivalent).
2. Student account in **evaluation** mode (not demo) for V4-M1–M4, V4-M6–M7.
3. M5 scenarios: SCN-015 (id 37), SCN-016 (id 38), SCN-017 (id 39) — verify via `/student/module5/scenarios`.

---

## V4-M1 — SCN-015 nominal integrated cycle

| Field | Value |
|-------|-------|
| **ID** | V4-M1 |
| **Scenario** | SCN-015 |
| **Mode** | Evaluation |
| **Status** | **PENDING** |

**Steps**

1. Start eval run on SCN-015.
2. Complete M5_RECEPTION: SKU-001 · 50 u. · PO-M5-001.
3. Complete M5_PUTAWAY: REC-01 → B-01-R1-L1 · LOT-M5-A.
4. Complete M5_CYCLE_COUNT (no variance).
5. Complete M5_REPLENISH.
6. On M5_KPI: verify monitor anchor panel shows received/putaway/stock; check confirmation box; submit ledger-derived KPI.
7. Complete M5_DECISION (tactical).
8. Complete COMPLIANCE_M5.

**Expected**

- 7 effective steps (no M5_ADJ).
- KPI snapshot persisted; run report shows rotation/service/errors.
- Compliance green; score ≥ 70 achievable.

---

## V4-M2 — SCN-016 variance visible at cycle count

| Field | Value |
|-------|-------|
| **ID** | V4-M2 |
| **Scenario** | SCN-016 |
| **Mode** | Evaluation |
| **Status** | **PENDING** |

**Steps**

1. Start eval run on SCN-016.
2. Complete reception + putaway (same contract as 015).
3. At M5_CYCLE_COUNT: confirm system 50 / physical 45 / variance −5 injected.

**Expected**

- Variance −5 displayed at CC step.
- OIL variance pastille visible (amber).
- 8 effective steps including M5_ADJ.

---

## V4-M3 — SCN-016 blocked before ADJ

| Field | Value |
|-------|-------|
| **ID** | V4-M3 |
| **Scenario** | SCN-016 (continued from V4-M2) |
| **Status** | **PENDING** |

**Steps**

1. After CC with open variance, attempt M5_REPLENISH or M5_KPI without posting M5_ADJ.

**Expected**

- Server returns BAD_REQUEST with M5_ADJ / unresolved variance message.
- Step remains incomplete.

---

## V4-M4 — SCN-016 ADJ resolves variance

| Field | Value |
|-------|-------|
| **ID** | V4-M4 |
| **Scenario** | SCN-016 |
| **Status** | **PENDING** |

**Steps**

1. Post M5_ADJ: variance −5 · justification ≥ 10 chars · bin B-01-R1-L1.
2. Proceed to M5_REPLENISH → M5_KPI (with ledger confirmation) → M5_DECISION → COMPLIANCE_M5.

**Expected**

- ADJ line in monitor; stock at bin = 45.
- KPI/REPLENISH/DECISION unblocked after ADJ.
- Run report shows variance trail + ADJ section.

---

## V4-M5 — SCN-017 KPI snapshot required

| Field | Value |
|-------|-------|
| **ID** | V4-M5 |
| **Scenario** | SCN-017 |
| **Status** | **PENDING** |

**Steps**

1. Complete ops chain through M5_REPLENISH.
2. Attempt M5_DECISION **without** completing M5_KPI.

**Expected**

- `submitDecision` rejected: KPI snapshot required.
- M5_KPI step shows ledger anchor + eval confirmation checkbox.

---

## V4-M6 — SCN-017 generic answer rejected

| Field | Value |
|-------|-------|
| **ID** | V4-M6 |
| **Scenario** | SCN-017 |
| **Status** | **PENDING** |

**Steps**

1. Complete M5_KPI with confirmed ledger values.
2. Submit M5_DECISION with keyword-only text (no numeric KPI citations).

**Expected**

- Strategic rubric rejects (`INSUFFICIENT_KPI_CITATIONS` or equivalent).
- Step not completed; user sees error message.

---

## V4-M7 — SCN-017 KPI-linked strategic answer accepted

| Field | Value |
|-------|-------|
| **ID** | V4-M7 |
| **Scenario** | SCN-017 |
| **Status** | **PENDING** |

**Steps**

1. Read KPI snapshot values from M5_KPI screen / run report.
2. Submit decision citing ≥2 numeric KPIs from snapshot + trade-off + 90–180 j horizon.

**Expected**

- Decision accepted; score ≥ 50.
- COMPLIANCE_M5 passes with full chain.

---

## Additional matrix (package §10.2)

| ID | Procedure | Status |
|----|-----------|--------|
| V4-M4 (instructor monitor) | Run report variance + snapshot + decision | **PENDING** |
| V4-M5 (arc coherence) | Slides/hub Jour 1→2→3; 016/017 GREEN labels | **PENDING** — slides updated in B1 cleanup |
| V4-M6 (demo mode) | All three scenarios without eval penalties | **PENDING** |
| V4-M7 (direct URL) | `/student/module5/scenario/37\|38\|39/mode` loads | **PENDING** |

---

## Automated coverage substitute (this session)

The following were verified via `pnpm test` (353/353 PASS) instead of live browser:

- V4.1–V4.3, V4.6, V4.7, V4.9, V4.11–V4.15 (unit/rules engine)
- V4.6 KPI ledger anchor: tests 11–13 in `module345.rules.test.ts`

**Re-audit requirement:** Execute V4-M1–V4-M7 on staging before production push.
