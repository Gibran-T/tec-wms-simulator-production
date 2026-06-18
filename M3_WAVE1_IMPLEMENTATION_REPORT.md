# TEC.WMS — RC14 M3 Wave 1 Implementation Report

**Date:** 2026-06-18  
**Scope:** Display + evidence layers only (RC14_M3_WAVE1_IMPLEMENTATION_SPEC.md)  
**Status:** Complete — no commit, no push, no deploy

---

## 1. Executive Summary

Wave 1 M3 closes P0 pedagogical coherence gaps and introduces a lightweight **M3 Operational Control Tower** in OIL Panel B and Mission Control. All changes are display-only; scoring, certification, validators, seeds, and Guide Maître were not modified.

| Phase | Deliverable | Status |
|-------|-------------|--------|
| A | API evidence surfacing + `m3OperationalEvidence.ts` | ✅ |
| B | SCN-009 Fiche + cockpit pedagogy | ✅ |
| C | M3 Operational Control Tower (Panel B) | ✅ |
| D | Mission Control enhancements | ✅ |
| E | StepForm SCN-011 Min/Max table + visual parity | ✅ |

---

## 2. Phase A — Evidence Plumbing

### `server/routers.ts` — `runs.state`

Extended response with `m3Evidence` when `moduleId === 3`:

- `inventoryCounts`
- `inventoryAdjustments`
- `replenishmentSuggestions`
- `initialStateJson`

M1/M2/M4/M5 payloads unchanged (`m3Evidence` absent).

### `client/src/lib/m3OperationalEvidence.ts`

Pure functions for badge computation, resolution chain, step-aware hints, grid status, performance metrics, and replenishment param rows.

### `client/src/lib/m3OperationalEvidence.test.ts`

7 unit tests covering SCN-009 variance/ADJ, accuracy, SCN-011 below-Min, replenishment status, resolution chain, and grid status.

---

## 3. Phase B — Fiche + Pedagogy Coherence

### `server/missionDataExtended.ts` — SCN-009 only

| Field | Change |
|-------|--------|
| `controlPoints[3]` | ADJ (MI07) explicit for −3 on SKU-001 |
| `studentActions[2]` | CC_RECON includes ADJ posting |
| `studentActions[3]` | REPLENISH marked auto-validated |
| `technicalSpecs.expectedTransaction` | `CC_COUNT → CC_RECON + ADJ (MI07) — écart −3` |
| `recoveryPaths` | Added MI07 closure path |

### `client/src/data/scenarioCockpitPedagogy.ts`

- **SCN-009:** ADJ chain in `expectedActionHint`, `complianceHint`, `transactionMonitorHint`
- **SCN-011:** `evidenceToObserve` updated for cockpit-first Min/Max visibility; confirmatory override handled in `getM3StepAwareHint` (CC steps only)

---

## 4. Phase C — OIL Panel B M3 Control Tower

### New files

| File | Purpose |
|------|---------|
| `client/src/data/m3OperationalControlTower.ts` | Static tower metadata SCN-009/010/011 |
| `client/src/components/operational-intelligence/M3OperationalTowerView.tsx` | 2×2 badge grid + resolution chain + shared tables |

### `OperationalIntelligenceLayer.tsx`

- Panel B: `M3OperationalTowerView` when `moduleId === 3` and SCN ∈ {009, 010, 011}
- Panel F: SCN-011 step pills annotated *(confirmatoire)* / REPLENISH *(focus principal)*
- `IntelligenceRunState` extended with optional `m3Evidence`

### Badges implemented

| Badge | SCN-009 | SCN-010 | SCN-011 |
|-------|---------|---------|---------|
| Variance | ✅ | ✅ (threshold guard) | Hidden |
| Inventory accuracy | ✅ | ✅ | Replaced by levels confirmed |
| Below-Min | Hidden | Hidden | ✅ |
| Replenishment status | Auto-validé (slate) | Auto-validé | Pending/Partial/Complete |

---

## 5. Phase D — Mission Control

### `client/src/pages/student/MissionControl.tsx`

| Section | SCNs | Implementation |
|---------|------|----------------|
| Step-aware Next Action | 009, 010, 011 | `getM3StepAwareHint()` |
| Resolution chain row | 009 | `M3ResolutionChainRow` below Next Action |
| Replenishment params table | 011 | `M3ReplenishmentParamsTable` on first load |
| CC confirmatory banner | 011 | Amber banner + confirmation targets table |
| Grid status badges | 009, 010, 011 | BELOW_MIN / VARIANCE_OPEN / RECONCILED |
| Min/Max sub-row | 011 | Muted `min/max` under SKU |
| Performance contextual metrics | All M3 | Non-scored strip below score |
| ADJ row highlight | 009, 010 | `bg-primary/5` + "Action étudiant" badge |

---

## 6. Phase E — StepForm Polish

### `client/src/pages/student/StepForm.tsx`

SCN-011 CC-step amber banner extended with embedded `M3ReplenishmentParamsTable` (Min/Max/SS/Δ Min/Q cible) reusing REPLENISH panel markup pattern.

---

## 7. Constraints Verified (unchanged)

| Domain | Status |
|--------|--------|
| Guide Maître / `modules.ts` | ✅ Not modified |
| Scoring / certification | ✅ Not modified |
| Validators / thresholds | ✅ Not modified |
| `seed.ts` / MODULE3_STEPS | ✅ Not modified |
| M4 KPI paradigm in M3 | ✅ Not imported |

---

## 8. Validation Results

| Check | Result |
|-------|--------|
| `npm run build` | ✅ Pass |
| `npm test -- m3OperationalEvidence` | ✅ 7/7 |
| `npm test -- m3.smoke` | ✅ 27/27 |
| `npm test -- m3.stabilization` | ✅ 12/12 |
| `npm test -- gold.certification` | ✅ 21/21 |

---

## 9. Acceptance Criteria Mapping

### SCN-009

- [x] Fiche Mission shows ADJ-in-CC_RECON in `studentActions` and `controlPoints`
- [x] CC_RECON chain row with MI07 callout in Mission Control + Panel B
- [x] Green ADJ chip after post; accuracy badge updates
- [x] Validators/scoring/step sequence unchanged

### SCN-011

- [x] Min/Max table visible in Mission Control on first load
- [x] CC steps show confirmatory banner + Next Action override
- [x] Panel F annotates CC vs REPLENISH focus
- [x] BELOW_MIN badges on SKU-004 and SKU-005

### SCN-010 (regression guard)

- [x] Variance threshold badge visible in Panel B tower

---

## 10. Student Experience Target

```
Problem → Evidence → Analysis → ADJ / REPLENISH → Compliance
```

- **SCN-009:** Students see CC_RECON → ADJ (MI07) → COMPLIANCE_M3 chain before compliance block
- **SCN-011:** Students see Min/Max parameters and below-Min evidence in cockpit; CC steps framed as confirmatory

---

## 11. Files Changed

| File | Action |
|------|--------|
| `server/routers.ts` | Edit — `m3Evidence` in `runs.state` |
| `server/missionDataExtended.ts` | Edit — SCN-009 copy |
| `client/src/data/scenarioCockpitPedagogy.ts` | Edit — SCN-009, SCN-011 |
| `client/src/data/m3OperationalControlTower.ts` | **Create** |
| `client/src/lib/m3OperationalEvidence.ts` | **Create** |
| `client/src/lib/m3OperationalEvidence.test.ts` | **Create** |
| `client/src/components/operational-intelligence/M3OperationalTowerView.tsx` | **Create** |
| `client/src/components/operational-intelligence/OperationalIntelligenceLayer.tsx` | Edit — Panel B/F M3 |
| `client/src/pages/student/MissionControl.tsx` | Edit — M3 sections |
| `client/src/pages/student/StepForm.tsx` | Edit — SCN-011 CC Min/Max table |
| `vitest.config.ts` | Edit — include client tests |

---

*Implementation complete per RC14_M3_WAVE1_IMPLEMENTATION_SPEC.md. Display and evidence layers only.*
