# TEC.WMS — RC14 Wave 1 · M3 Premium Operational Intelligence

**Implementation Specification (display + evidence layers only)**  
**Programme:** Collège de la Concorde — TEC.LOG / TEC.WMS  
**Module:** M3 — Contrôle des stocks et réapprovisionnement  
**Scenarios:** SCN-009, SCN-010 (référence badges), SCN-011  
**Date:** 2026-06-18  
**Status:** Specification — **no implementation, no commit**

**Source documents:**

- `RC14_PREMIUM_OPERATIONAL_INTELLIGENCE_MASTER_PLAN.md` (W1-01, W1-02, W2-06 scope M3)
- `RC14_M3_PREMIUM_INTELLIGENCE_AUDIT.md` (gaps OIL-01, MC-01–05, INV-01/02, RES-02)

---

## 1. Executive Summary

Wave 1 M3 closes **P0 pedagogical coherence gaps** and introduces a **lightweight M3 Operational Control Tower** in OIL Panel B and Mission Control — without touching scoring, certification, thresholds, validators, scenario logic, or Guide Maître.

| Gap ID | Wave 1 resolution | Layer |
|--------|-------------------|-------|
| G-P0-01 / OIL-01 / CMP-01 | SCN-009: ADJ (MI07) explicit in Fiche Mission + cockpit evidence chain | Copy + display |
| G-P0-02 / MC-05 / RES-02 | SCN-011: CC steps framed as confirmatory; Min/Max surfaced outside StepForm | Display |
| G-P1-01 / INV-01 | Below-Min badges in grid + Panel B | Display |
| G-P1-02 / INV-02 / MC-03 | Inventory accuracy % + variance badge after count | Display |
| G-P1-04 / RES-01 | Replenishment status (pending / auto-complete / satisfied) | Display |

**Target student experience:** SCN-009 students see **CC_RECON → ADJ (MI07) → COMPLIANCE_M3** before hitting an unexplained compliance block. SCN-011 students see **Min/Max parameters and stock levels in the cockpit** and understand CC_LIST/COUNT/RECON are **confirmatory**, not the learning focus.

---

## 2. Golden Rules (mandatory constraints)

### 2.1 In scope

| Allowed | Examples |
|---------|----------|
| Fiche Mission copy alignment | SCN-009 `studentActions`, `controlPoints`, `expectedTransaction` |
| Cockpit pedagogy strings | `scenarioCockpitPedagogy.ts` hints (display-only) |
| UI overlays, badges, annex panels | Panel B tower, Mission Control grid columns |
| Read-only surfacing of existing run artifacts | Expose `inventoryCounts` / `inventoryAdjustments` already built in `buildRunState` |
| Pure client-side computed display metrics | accuracy %, below-Min delta, replenishment progress |

### 2.2 Out of scope (hard prohibition)

| Domain | Items |
|--------|-------|
| **Guide Maître** | Slides, instructor annexes, `client/src/data/modules.ts` slide 7 — **no edits** |
| **Scoring** | `addScoringEvent`, scoring budgets, pass thresholds |
| **Certification** | Silver/Gold gates, `goldCertification.ts`, competency map |
| **Thresholds** | `adjustmentThreshold`, default variance 5, SCN-010 threshold 20 |
| **Validators** | `validateM3Compliance`, `validateCycleCount*`, `validateReplenishmentComplete` |
| **Scenario logic** | `seed.ts` contracts, `cycleCountTargets`, `replenishmentParams`, preloaded txs |
| **Pipeline structure** | `MODULE3_STEPS` — fixed 5-step rail for all M3 SCNs |
| **M4 KPI paradigm** | No KPI tiles, Annexe A import, or analytical tower in M3 |

### 2.3 Canonical chain (unchanged)

```
Guide Maître (read-only reference for instructors)
    ↓
Fiche Mission (source of truth — Wave 1 may align SCN-009 copy only)
    ↓
Scenario Logic / Validators (untouched)
    ↓
Runtime Experience (Wave 1 target: Mission Control + OIL + Fiche visibility)
```

**ADJ remains inside CC_RECON (MI07)** — never a separate step in the pipeline.

---

## 3. Current State Baseline

### 3.1 Architecture touchpoints

| Surface | File | M3 today |
|---------|------|----------|
| Fiche Mission | `server/missionDataExtended.ts` | SCN-009 omits ADJ in `studentActions`; SCN-011 has Min/Max in context but CC friction unresolved in cockpit |
| Cockpit pedagogy | `client/src/data/scenarioCockpitPedagogy.ts` | SCN-009 `expectedActionHint` stops at count entry; no ADJ chain |
| Mission Control | `client/src/pages/student/MissionControl.tsx` | Generic grid (AVAILABLE/EMPTY only); generic performance block; no `moduleId === 3` branches |
| OIL Panel B | `client/src/components/operational-intelligence/OperationalIntelligenceLayer.tsx` | Location count only; no M3 tower (contrast M4 `M4_KPI_CONTROL_TOWER`) |
| StepForm | `client/src/pages/student/StepForm.tsx` | CC targets table (009/010); amber CC banner (011 only); Min/Max panel (REPLENISH only) |
| Run state API | `server/routers.ts` → `buildRunState` / `runs.state` | Builds `inventoryCounts` + `inventoryAdjustments` but **does not return them** to client |
| Seed contracts | `server/seed.ts` | SCN-009: 2 CC targets (−3 on SKU-001); SCN-011: `replenishmentParams` only, no `cycleCountTargets` |

### 3.2 Gap → Wave 1 mapping

| Audit ID | Priority | Wave 1 item |
|----------|----------|-------------|
| OIL-01 / CMP-01 / ERP-02 | P0 | §4 SCN-009 Fiche + pedagogy + evidence chain |
| MC-05 / RES-02 | P0 | §5 SCN-011 CC confirmatory framing |
| MC-01 / INV-01 | P1 | §6 Panel B + §7 grid below-Min |
| MC-02 / INV-02 | P1 | §6 variance badge + §7 count context |
| MC-03 | P1 | §7 performance block accuracy |
| MC-04 / RES-01 / OIL-05 | P1 | §6 replenishment status badge |

---

## 4. SCN-009 — ADJ Visibility & CC_RECON → ADJ → COMPLIANCE Coherence

### 4.1 Problem statement

Runtime requires ADJ posted during CC_RECON (`validateCycleCountReconComplete` + `validateM3Compliance`). Fiche Mission lists CC_RECON analysis but **never names MI07 posting**. Students reach COMPLIANCE_M3 with an unexplained blocker.

### 4.2 Fiche Mission copy changes (`server/missionDataExtended.ts`)

**File:** `server/missionDataExtended.ts` — block `"SCN-009"` only.

| Field | Current | Target (FR) |
|-------|---------|-------------|
| `controlPoints[3]` | `"Documenter avant tout ajustement."` | `"CC_RECON : poster l'ajustement ADJ (MI07) pour l'écart −3 sur SKU-001."` |
| `studentActions[2]` | `"CC_RECON : analyser l'écart −3 sur SKU-001."` | `"CC_RECON : analyser l'écart −3, puis poster l'ajustement ADJ (MI07) sur SKU-001."` |
| `studentActions[3]` | `"REPLENISH si besoin, puis COMPLIANCE_M3."` | `"REPLENISH : non requis (auto-validé) — passer à COMPLIANCE_M3."` |
| `technicalSpecs.expectedTransaction` | `"CC_COUNT → CC_RECON"` | `"CC_COUNT → CC_RECON + ADJ (MI07) — écart −3"` |
| `recoveryPaths` | add entry | `"CC_RECON : saisir variance −3 et valider MI07 avant clôture."` |

**Copy rules:**

- Document **process** (MI07 inside CC_RECON), not the physical count answer (97).
- Keep `evalGuidance` threshold language unchanged (significant adjustment justification rule stays generic).
- Do **not** add `alternativeActions` in Wave 1 (Wave 2 per master plan W2-09).

### 4.3 Cockpit pedagogy (`scenarioCockpitPedagogy.ts`)

Update `"SCN-009"` entry:

| Key | Target content (FR / EN) |
|-----|--------------------------|
| `expectedActionHint` | Step-aware via Mission Control (§7.2); base: *"Comptage → réconciliation → ajustement MI07 obligatoire pour l'écart −3."* |
| `complianceHint` | *"L'ajustement ADJ (MI07) doit être posté dans CC_RECON avant COMPLIANCE_M3."* |
| `transactionMonitorHint` | Add: *"Après CC_RECON, une ligne ADJ étudiant doit apparaître au moniteur."* |

### 4.4 Evidence chain display (Mission Control + Panel B)

Render a **Resolution Chain Chip Row** (display-only, not a new step):

```
CC_LIST ✓ → CC_COUNT ✓ → CC_RECON [ADJ MI07] → COMPLIANCE_M3
                              ↑ highlight when nextStep === CC_RECON
```

**State derivation (client-side, no new API logic):**

| Signal | Source |
|--------|--------|
| Count complete | `inventoryCounts.length >= cycleCountTargets.length` (after API surfacing §8) |
| ADJ posted | `inventoryAdjustments.some(a => a.sku === 'SKU-001' && a.adjustmentQty === -3)` OR ledger `transactions` contains `docType === 'ADJ'` for SKU-001 |
| Variance open | count submitted for SKU-001 with `varianceQty !== 0` and no matching ADJ |
| REPLENISH N/A | `replenishmentParams` absent from `scenario.initialStateJson` → show grey *"Auto — non requis"* chip |

**Visual treatment:**

- Open variance: amber chip *"Écart ouvert −3"*
- ADJ posted: green chip *"ADJ MI07 posté"*
- Chain visible in Mission Control (below Next Action) and OIL Panel B (compact)

### 4.5 SCN-009 acceptance criteria

- [ ] Fiche Mission Panel A / MissionSheet shows ADJ-in-CC_RECON in `studentActions` and `controlPoints`
- [ ] Student on CC_RECON step sees chain row with MI07 callout before opening StepForm
- [ ] After ADJ post, chain shows green ADJ chip; COMPLIANCE_M3 hint references closed variance
- [ ] No change to validator messages, scoring events, or step sequence
- [ ] Guide Maître files untouched

---

## 5. SCN-011 — Count Targets, Min/Max Parameters & CC Pipeline Friction

### 5.1 Problem statement

SCN-011 has **zero** `cycleCountTargets` but UI still traverses CC_LIST → CC_COUNT → CC_RECON. Validators auto-complete empty targets; StepForm amber banner mitigates friction **only inside the step form**. Min/Max parameters appear only at REPLENISH — too late for cockpit-first learners.

### 5.2 Explicit parameter surfacing

#### 5.2.1 Data source (read-only)

From `scenario.initialStateJson` (already on `runs.state.scenario`):

```typescript
replenishmentParams: [
  { sku: "SKU-004", minQty: 50, maxQty: 200, safetyStock: 25, leadTimeDays: 3 },
  { sku: "SKU-005", minQty: 80, maxQty: 300, safetyStock: 30, leadTimeDays: 5 },
]
```

Live stock from `inventory` map keys `SKU::BIN`.

#### 5.2.2 M3 Replenishment Parameters Panel (new display component)

**Placement:**

1. Mission Control — between Next Action and Inventory Grid when `moduleId === 3 && scnCode === 'SCN-011'`
2. OIL Panel B — inside M3 Operational Tower (§6)
3. StepForm — extend existing CC-step amber banner with **embedded Min/Max table** (reuse table markup from REPLENISH panel §1883–1898)

**Table columns:**

| SKU | Bin (from inventory key) | Stock actuel | Min | Max | SS | Δ Min | Q cible (Max − stock) |
|-----|--------------------------|--------------|-----|-----|----|-------|------------------------|
| SKU-004 | B-01-R1-L1 | 30 | 50 | 200 | 25 | −20 | 170 |
| SKU-005 | B-01-R1-L2 | 40 | 80 | 300 | 30 | −40 | 260 |

**Computed fields (display only — mirror validator formula, do not enforce):**

- `deltaMin = stock - minQty` → badge **BELOW_MIN** when `< 0`
- `targetQ = maxQty - stock` → label *"Référence pédagogique"* (not pre-filled answer field)

**Copy footer (FR):**

> *"Évaluation : Q = Max − stock actuel. Les étapes CC_LIST/COUNT/RECON confirment les niveaux — concentrez-vous sur REPLENISH."*

#### 5.2.3 Count targets for SCN-011

SCN-011 has **no cycle count targets** — do not invent seed targets.

Instead, at CC_LIST / CC_COUNT / CC_RECON steps, show **Confirmation Targets** table:

| SKU | Niveau système à confirmer | Rôle |
|-----|---------------------------|------|
| SKU-004 | 30 u. | Confirmer sous Min |
| SKU-005 | 40 u. | Confirmer sous Min |

This satisfies *"exibir targets de contagem"* as **confirmation targets**, not MI04 physical count targets.

### 5.3 CC pipeline friction elimination (display layer)

**No step skipping.** Friction reduced via cockpit framing:

| Surface | When | Content |
|---------|------|---------|
| Mission Control Next Action | `scnCode === SCN-011'` && next step ∈ `{CC_LIST, CC_COUNT, CC_RECON}` | Override `expectedActionHint`: *"Étape confirmatoire — vérifiez les niveaux affichés, validez rapidement, puis REPLENISH."* |
| Mission Control banner | Same condition | Amber info banner (same tone as StepForm L1620–1631) |
| OIL Panel F | `scnCode === SCN-011'` | Annotate CC_* step pills: suffix *"(confirmatoire)"* in muted text |
| OIL Panel F | REPLENISH pill | Bold *"(focus principal)"* |

**REPLENISH auto-complete** does not apply to SCN-011 — show replenishment progress normally (§6.4).

### 5.4 SCN-011 acceptance criteria

- [ ] Min/Max/SS table visible in Mission Control on first load (not only at REPLENISH step)
- [ ] CC steps show confirmatory banner + Next Action override in Mission Control
- [ ] Panel F annotates CC steps vs REPLENISH focus
- [ ] Below-Min badges on grid rows for SKU-004 and SKU-005
- [ ] MODULE3_STEPS unchanged; validators unchanged
- [ ] Guide Maître untouched

---

## 6. OIL Panel B — M3 Operational Control Tower

### 6.1 Design pattern

Follow **M4 tower file pattern** (`client/src/data/m4KpiControlTower.ts`) but for **transactional inventory evidence**, not KPI analytics.

**New file:** `client/src/data/m3OperationalControlTower.ts`

```typescript
export interface M3OperationalBadge {
  id: string;
  labelFr: string;
  labelEn: string;
  /** Tailwind semantic: 'green' | 'amber' | 'red' | 'slate' */
  tone: "green" | "amber" | "red" | "slate";
  valueFr: string;
  valueEn: string;
}

export interface M3OperationalTowerEntry {
  scnCode: "SCN-009" | "SCN-010" | "SCN-011";
  titleFr: string;
  titleEn: string;
  /** Static scenario framing — no scoring content */
  focusFr: string;
  focusEn: string;
}
```

**New file:** `client/src/lib/m3OperationalEvidence.ts`

Pure functions:

```typescript
computeM3OperationalBadges(input: {
  scnCode: string;
  initialStateJson: M3InitialStateJson;
  inventory: Record<string, number>;
  inventoryCounts: M3InventoryCountRow[];
  inventoryAdjustments: M3InventoryAdjustmentRow[];
  replenishmentSuggestions: ReplenishmentSuggestionRow[];
  completedSteps: string[];
  nextStepCode?: string;
}): M3OperationalBadge[];
```

### 6.2 Badge specifications

#### 6.2.1 Variance badge

| SCN | Condition | Display |
|-----|-----------|---------|
| 009 | Always (pre-count) | *"Écart attendu : −3 u. (SKU-001)"* — tone `amber` |
| 009 | ADJ posted | *"Variance résolue : −3"* — tone `green` |
| 010 | From seed threshold | *"Seuil ajustement : 20 u."* + *"Écart : −28"* — tone `red` when abs ≥ threshold |
| 011 | N/A | Hidden |

**Data:** `initialStateJson.adjustmentThreshold`, `cycleCountTargets`, `inventoryAdjustments`.

#### 6.2.2 Inventory accuracy badge

| SCN | Formula (display) | When shown |
|-----|-------------------|------------|
| 009 / 010 | `accuracy = round(100 * (targetsWithMatchingCount / totalTargets))` where match = student submitted count exists | After ≥1 count row OR step ≥ CC_COUNT |
| 009 / 010 | Sub-label: *"SKUs comptés : n/N"* | Always with accuracy |
| 011 | Replace with *"Niveaux confirmés : n/N SKUs"* when CC steps complete | CC_LIST done → n=1, etc. |

**Important:** Accuracy % reflects **submission progress**, not pre-revealed `physicalQty`. Do not display expected physical qty in Panel B (discovery preserved).

#### 6.2.3 Below-Min indicator

| SCN | Condition | Display |
|-----|-----------|---------|
| 011 | `stock < minQty` per replenishment param | *"SKU-004 : −20 vs Min"* / *"2 SKUs sous Min"* aggregate |
| 009 / 010 | Hidden unless `replenishmentParams` present | — |

Tone: `red` when any SKU below Min; `green` when all ≥ Min (theoretical after REPLENISH — display *"Réappro soumis"* not stock simulation).

#### 6.2.4 Replenishment status badge

| State | Condition | Display (FR) | Tone |
|-------|-----------|--------------|------|
| `NOT_APPLICABLE` | No `replenishmentParams` in seed (009/010) | *"Réappro : non requis (auto-validé)"* | `slate` |
| `PENDING` | SCN-011, REPLENISH not complete, suggestions < required SKUs | *"Réappro : 0/2 SKUs"* | `amber` |
| `PARTIAL` | Some suggestions submitted | *"Réappro : 1/2 SKUs"* | `amber` |
| `COMPLETE` | `validateReplenishmentComplete` would pass (display mirror only) | *"Réappro : complet"* | `green` |

**Data:** `replenishmentSuggestions` from run (§8). Do **not** call validator in UI — duplicate counting logic in pure function for display parity only.

### 6.3 Panel B integration (`OperationalIntelligenceLayer.tsx`)

In `PanelB`, after pedagogy box and before compliance strip:

```tsx
{m3Tower && (
  <M3OperationalTowerView
    entry={m3Tower}
    badges={computedBadges}
    resolutionChain={scnCode === "SCN-009" ? chain : undefined}
    t={t}
    language={language}
  />
)}
```

**Conditions:**

- Render when `state.moduleId === 3` && `scnCode ∈ {SCN-009, SCN-010, SCN-011}`
- Keep existing tx table (12-row cap) — badges are **above** it
- Do not set `showTxTable = false` for M3 (unlike M5 fix)

**New component:** `M3OperationalTowerView.tsx` in `client/src/components/operational-intelligence/`

Layout: 2×2 badge grid + optional resolution chain row. Match Fiori compact styling from `M4KpiTowerView`.

### 6.4 Panel B acceptance criteria

- [ ] SCN-009 shows variance + accuracy badges; chain row at CC_RECON
- [ ] SCN-010 shows variance threshold badge (regression guard — gold reference)
- [ ] SCN-011 shows below-Min + replenishment status; no variance badge
- [ ] No M4/M5 KPI tower imported
- [ ] Bilingual FR/EN via `pickLang`

---

## 7. Mission Control — Contextual Operational Evidence

### 7.1 Module gate

All Wave 1 Mission Control changes wrapped in:

```typescript
const isM3 = moduleId === 3;
const m3Scn = scnCode as "SCN-009" | "SCN-010" | "SCN-011" | undefined;
```

No impact on M1/M2/M4/M5 layouts.

### 7.2 Step-aware Next Action hints

**New helper:** `getM3StepAwareHint(scnCode, nextStepCode, pedagogy, language)`

| SCN | nextStep | Hint override |
|-----|----------|-----------------|
| 009 | CC_RECON | *"Analysez l'écart −3 et postez l'ajustement ADJ (MI07) dans cette étape."* |
| 009 | COMPLIANCE_M3 | *"Vérifiez que l'ADJ −3 est posté avant clôture M3."* |
| 011 | CC_LIST / CC_COUNT / CC_RECON | Confirmatory hint (§5.3) |
| 011 | REPLENISH | Default pedagogy *"Q = Max − stock"* |
| 010 | CC_RECON | Existing threshold language + *"Justification obligatoire (≥20 u.)"* |

Fallback to `pedagogy.expectedActionHint` for other steps.

### 7.3 Inventory grid enrichment

Extend Status column (`MissionControl.tsx` L260–264) for M3:

| Condition | Badge | Style |
|-----------|-------|-------|
| SCN-011 && stock < minQty | `BELOW_MIN` | `bg-red-100 text-red-700` |
| SCN-009/010 && open variance on SKU | `VARIANCE_OPEN` | `bg-amber-100 text-amber-800` |
| SCN-009/010 && ADJ posted for SKU | `RECONCILED` | `bg-green-100 text-green-700` |
| Default | existing AVAILABLE/EMPTY | unchanged |

Optional column **Min / Max** (SCN-011 only): append sub-row under SKU with `50/200` muted text.

### 7.4 Performance block — contextual metrics (M3 only)

Below pedagogical score, add **Operational Context** strip (does not replace score):

| SCN | Metric | Source |
|-----|--------|--------|
| 009 / 010 | Précision inventaire `%` | Same formula as Panel B accuracy badge |
| 009 / 010 | Écarts ouverts count | Unreconciled variances from counts minus ADJs |
| 011 | SKUs sous Min | Count from replenishment params vs inventory |
| 011 | Réappro progression | `suggestions / required` |

Label: *"Indicateurs contextuels — non notés"* to prevent scoring confusion.

### 7.5 Transaction monitor — student ADJ highlight (evidence layer)

When `moduleId === 3` && row `docType === 'ADJ'` && row not in seed `preloadedTransactions`:

- Row background: `bg-primary/5`
- Badge: *"Action étudiant"* on Status column

**Seed detection:** compare `docRef` against `scenario.initialStateJson.preloadedTransactions` client-side.

No inline causal annotations in Wave 1 (Wave 2 MON-04 per master plan).

### 7.6 New Mission Control sections summary

| Section | SCNs | Priority |
|---------|------|----------|
| Resolution chain row | 009 | P0 |
| Replenishment params table | 011 | P0 |
| CC confirmatory banner | 011 | P0 |
| Grid status badges | 009, 010, 011 | P1 |
| Performance contextual metrics | all M3 | P1 |
| ADJ row highlight | 009, 010 | P1 |

---

## 8. API Evidence Surfacing (read-only extension)

### 8.1 Problem

`buildRunState` already loads M3 artifacts but `runs.state` omits them from the response (L1355–1364 returns transactions only).

### 8.2 Specification

**File re` `server/routers.ts`** — extend `runs.state` return when `moduleId === 3`:

```typescript
m3Evidence: moduleId === 3 ? {
  inventoryCounts: state.inventoryCounts,
  inventoryAdjustments: state.inventoryAdjustments,
  replenishmentSuggestions: await getReplenishmentSuggestionsByRun(input.runId),
  initialStateJson: scenario?.initialStateJson,
} : undefined,
```

Alternatively flatten into top-level optional fields — team choice at implementation; **must not** alter `checkCompliance` inputs for M1/M2.

### 8.3 Constraints

- Read-only query addition — no mutation, no validator invocation change
- `replenishmentSuggestions` already fetched in `loadM3ComplianceArtifacts` — reuse pattern
- Type export: add `M3RunEvidence` to shared client types or infer from tRPC

### 8.4 Acceptance

- [ ] Mission Control M3 badges render without extra round-trips per step
- [ ] M1/M2/M4/M5 payloads unchanged (field absent or undefined)
- [ ] No new DB tables or columns

---

## 9. File Change Matrix

| File | Action | Scope |
|------|--------|-------|
| `server/missionDataExtended.ts` | Edit | SCN-009 copy only |
| `client/src/data/scenarioCockpitPedagogy.ts` | Edit | SCN-009, SCN-011 hints |
| `client/src/data/m3OperationalControlTower.ts` | **Create** | Static tower metadata per SCN |
| `client/src/lib/m3OperationalEvidence.ts` | **Create** | Badge computation pure functions |
| `client/src/components/operational-intelligence/M3OperationalTowerView.tsx` | **Create** | Panel B UI |
| `client/src/components/operational-intelligence/OperationalIntelligenceLayer.tsx` | Edit | Panel B M3 branch |
| `client/src/pages/student/MissionControl.tsx` | Edit | M3 sections §7 |
| `client/src/pages/student/StepForm.tsx` | Edit | SCN-011 CC-step Min/Max table in banner |
| `server/routers.ts` | Edit | `runs.state` M3 evidence surfacing §8 |

**Files explicitly not modified:**

- `client/src/data/modules.ts` (Guide Maître slides)
- `server/rulesEngine.ts`, `server/seed.ts`
- `shared/moduleThresholds.ts`, `server/goldCertification.ts`
- `Documentation/Pedagogical_Framework/**` (Guide Maître tree)

---

## 10. Implementation Order

```
Phase A — Evidence plumbing (half day)
  1. runs.state M3 evidence fields (§8)
  2. m3OperationalEvidence.ts pure functions + unit tests

Phase B — Fiche + pedagogy coherence (half day)
  3. missionDataExtended SCN-009 copy (§4.2)
  4. scenarioCockpitPedagogy SCN-009/011 (§4.3, §5.3)

Phase C — Panel B tower (1 day)
  5. m3OperationalControlTower.ts + M3OperationalTowerView.tsx
  6. OperationalIntelligenceLayer Panel B integration (§6)

Phase D — Mission Control (1 day)
  7. Step-aware hints + SCN-011 params table + CC banner (§5, §7.2)
  8. Grid badges + performance metrics + ADJ highlight (§7.3–7.5)
  9. SCN-009 resolution chain row (§4.4)

Phase E — StepForm polish (optional half day)
  10. SCN-011 CC-step Min/Max embedded table (§5.2.2)
```

**Estimated effort:** 3–4 dev days · **Risk:** LOW (display-only)

---

## 11. Test Plan (specification-level)

### 11.1 Manual smoke scenarios

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| T-009-01 | SCN-009 fresh run | Open Mission Control | Min/Max table absent; variance badge *"−3 attendu"*; Fiche shows ADJ in studentActions |
| T-009-02 | SCN-009 at CC_RECON | Before submit | Chain highlights MI07; hint mentions ADJ |
| T-009-03 | SCN-009 post ADJ | After CC_RECON submit | Green ADJ chip; accuracy 100%; ADJ row highlighted in monitor |
| T-009-04 | SCN-009 skip ADJ | Attempt COMPLIANCE | Validator still blocks (unchanged); UI issues list unchanged |
| T-011-01 | SCN-011 fresh run | Open Mission Control | Min/Max table visible; 2× BELOW_MIN grid badges |
| T-011-02 | SCN-011 CC_LIST | Next action | Confirmatory hint; banner visible |
| T-011-03 | SCN-011 REPLENISH partial | 1/2 SKUs | Badge *"1/2 SKUs"* amber |
| T-010-REG | SCN-010 | Full flow | No regression; variance threshold badge visible (gold guard) |

### 11.2 Automated tests (recommended)

| File | Coverage |
|------|----------|
| `client/src/lib/m3OperationalEvidence.test.ts` | Badge computation edge cases |
| Existing `server/m3.smoke.test.ts` | Must pass unchanged — confirms no validator drift |

### 11.3 Regression guards

- [ ] `npm test -- m3.smoke` green
- [ ] `npm test -- m3.stabilization` green
- [ ] `npm test -- gold.certification` green
- [ ] SCN-010 manual path still GREEN per audit

---

## 12. Out of Scope (Wave 2+ / RC15)

| Item | Master plan ref | Reason deferred |
|------|-----------------|-----------------|
| Guide Maître slide 7 ADJ | W1-01 partial | User constraint: Guide untouched |
| Monitor causal inline annotations | W2-07 / MON-04 | Wave 2 |
| Panel F REPLENISH auto-complete annotation (009/010) | W2-08 | Optional Wave 1.5 — not in user mandate |
| SCN-009 alternativeActions | W2-09 | Decision layer Wave 2 |
| Per-scenario MODULE3_STEPS | W3-03 / RES-04 | High-risk structural |
| `m3.monitor.test.ts` | W3-01 | RC15 |
| Remove physicalQty from CC_COUNT table | P2 | Accessibility trade-off |

---

## 13. Success Definition

Wave 1 M3 is **complete** when:

1. **SCN-009** Fiche Mission and cockpit consistently teach **ADJ (MI07) inside CC_RECON** before compliance.
2. **SCN-011** students see **Min/Max parameters and below-Min evidence** in Mission Control and Panel B without opening REPLENISH step first.
3. **Panel B** shows operational badges (variance, accuracy, below-Min, replenishment status) for M3 scenarios.
4. **Zero** changes to scoring, certification, thresholds, validators, scenario seeds, or Guide Maître.
5. All existing M3 automated tests pass without modification unless adding new display-only test files.

**Premium intelligence target post-Wave 1:**

| Scenario | Verdict before | Verdict after Wave 1 |
|----------|----------------|----------------------|
| SCN-009 | YELLOW | **YELLOW+** (coherent; full GREEN needs Wave 2 monitor depth) |
| SCN-010 | GREEN | **GREEN** (maintained) |
| SCN-011 | YELLOW | **YELLOW+** (friction reduced; full GREEN needs Wave 2 annotations) |

---

*Specification produced from RC14 master plan and M3 premium audit. Display and evidence layers only. No code implemented.*
