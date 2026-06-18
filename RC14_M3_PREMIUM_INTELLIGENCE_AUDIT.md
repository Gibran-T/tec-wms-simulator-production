# TEC.WMS — RC14 M3 Premium Intelligence Gap Analysis

**Audit type:** Read-only premium operational intelligence analysis  
**Scope:** SCN-009, SCN-010, SCN-011 (Module 3 — Contrôle des stocks et réapprovisionnement)  
**Benchmark:** M1 (SCN-001 → SCN-005) and M2 (SCN-006 → SCN-008) as transactional gold standard  
**Repository:** `tec-wms-simulator-production`  
**Date:** 2026-06-18  
**Constraints:** No code, database, scoring, or certification changes — audit only  

---

## Executive Summary

Module 3 is **functionally complete**, **pedagogically approved** (YELLOW in `Documentation/PEDAGOGICAL_ALIGNMENT_AUDIT.md`, no production blockers), and correctly positioned as a **transactional inventory-control module** between M2 execution and M4 analytics.

However, M3 has **not yet reached the same operational intelligence depth** as M1/M2. The gap is not missing infrastructure — Mission Control, OIL Panels A–F, monitor, compliance engine, and transactional APIs are all wired — but **scenario-specific operational richness**: causal transaction narratives, dynamic resolution paths, proactive evidence overlays, and contextual KPIs that make M1/M2 feel like a live WMS cockpit.

| Scenario | DB ID | Premium intelligence verdict | One-line rationale |
|----------|-------|------------------------------|-------------------|
| **SCN-009** | 9 | **YELLOW** | Solid cycle-count shell; weakest causal monitor, ADJ-in-CC_RECON invisible in Fiche Mission, no decision depth |
| **SCN-010** | 10 | **GREEN** | Closest to M1/M2 gold — PO→GR→SO→GI causality, threshold pedagogy, rich mission copy |
| **SCN-011** | 11 | **YELLOW** | Strong replenish StepForm; CC pipeline friction, no Min/Max overlay in cockpit, static causality |

**Overall M3 premium intelligence:** **YELLOW (functional, not premium-parity with M1/M2)** — ship-ready for instructed cohorts; premium parity requires targeted intelligence overlays, not a paradigm shift to M4 KPI mode.

---

## Audit Mandate & Method

### Dimensions analyzed (per mandate)

| Dimension | M1/M2 gold reference | M3 implementation surface |
|-----------|---------------------|---------------------------|
| Mission Control | `client/src/pages/student/MissionControl.tsx` | Same shell — no `moduleId === 3` branches |
| Operational Intelligence Layer | `OperationalIntelligenceLayer.tsx` + `scenarioCockpitPedagogy.ts` | Panels A–F; no M3 control tower |
| Monitor | Transaction ledger + POSTED/PENDING badges + pedagogy hints | Preloaded txs only; all POSTED |
| Inventory Evidence | Live ledger-derived grid + scenario notes | Grid works; no threshold/variance overlay |
| Compliance | `rulesEngine.ts` multi-condition validators | `validateM3Compliance` — adequate but narrower |
| ERP/WMS Learning | `stepErpMap.ts` + Fiche Mission SAP/Odoo chain | Complete for M3 steps |
| Decision Support | OIL Panel D + mission `alternativeActions` / consequences | Thin on SCN-009; no M3 decision scaffold |
| Resolution Path | OIL Panel F + dynamic steps (M1 ADJ) | Fixed 5-step pipeline for all SCNs |

### Gap categories (per mandate)

1. Evidências operacionais ausentes  
2. Monitores pouco informativos  
3. Dados estáticos  
4. Transações não refletidas visualmente  
5. Ausência de causalidade operacional  
6. Ausência de histórico operacional  
7. Ausência de KPI contextual  

### Priority classification

| Class | Meaning |
|-------|---------|
| **P0** | Necessary for pedagogical coherence — student may misread the scenario or hit unexplained blockers |
| **P1** | Premium improvement — brings M3 to M1/M2 operational depth without structural refactor |
| **P2** | Future improvement — architectural or nice-to-have; does not block release |

### Primary sources

| # | Source | Location |
|---|--------|----------|
| 1 | Fiches de Mission | `server/missionDataExtended.ts` (SCN-009–011) |
| 2 | Guide Maître M3 | `client/src/data/modules.ts` (`module3`, slides 1–7) |
| 3 | Mission Control | `client/src/pages/student/MissionControl.tsx` |
| 4 | OIL | `OperationalIntelligenceLayer.tsx` + `scenarioCockpitPedagogy.ts` |
| 5 | Monitor / seed contracts | `server/seed.ts` + `server/routers.ts` (`m3` router) |
| 6 | Runtime enforcement | `server/rulesEngine.ts` (`MODULE3_STEPS`, `validateM3Compliance`) |
| 7 | Step UX | `client/src/pages/student/StepForm.tsx` |
| 8 | Automated regression | `server/m3.smoke.test.ts`, `server/m3.stabilization.test.ts` |
| 9 | Pedagogical baseline | `Documentation/PEDAGOGICAL_ALIGNMENT_AUDIT.md` |

---

## M1/M2 Gold Standard — Operational Intelligence Reference

M1 and M2 are the **only modules with full GO** in the pedagogical alignment audit. Their premium intelligence pattern (transactional cockpit) is defined by:

### What M1/M2 do exceptionally well

| Capability | M1 example | M2 example | Why it matters |
|------------|-----------|-----------|----------------|
| **Causal monitor narrative** | SCN-002: PO POSTED vs GR PENDING side-by-side | SCN-008: multi-lot GR chain across bins | Student infers root cause from ledger |
| **Scenario-specific empty-state pedagogy** | `emptyStockNote` on SCN-001, SCN-002 | `emptyStockNote` on SCN-008 (preloaded STOCKAGE) | Prevents false "bug" perception |
| **Dynamic resolution path** | ADJ step appears only when variance unresolved | PUTAWAY auto-skip on SCN-008 | Path matches scenario focus |
| **Proactive anomaly surfacing** | `UnpostedTransactionsPanel` + amber PENDING pulse | Capacity overflow penalty + zone validation | Evidence before action |
| **Rich decision scaffolding** | SCN-005: resolution order documents → physical → ship | SCN-007: split putaway consequences | Wrong-action learning |
| **Live inventory semantics** | Negative stock highlighting | FIFO lot dates in pedagogy | Bin grid tells a story |
| **Transaction → inventory coupling** | Each student POST updates grid + monitor | Putaway moves visible REC-01 → STOCKAGE | Visual feedback loop |
| **Automated monitor tests** | `m1.compliance.test.ts` | `m2.monitor.test.ts`, `m2.gold-standard.test.ts` | Regression on ledger alignment |

### M1/M2 intelligence stack (transactional)

```
Fiche Mission (truth)
    → Seed preloadedTransactions (evidence contract)
        → Mission Control (inventory grid + full monitor + compliance)
            → OIL A–F (pedagogy + ERP + decision + resolution)
                → Student actions (POSTED txs mutate ledger)
                    → Compliance gate (multi-condition)
```

M3 inherits this **shell** but several **inner layers are thinner** — especially causal monitor, cockpit overlays, and scenario-tailored resolution paths.

---

## Shared M3 Architecture Assessment

### Step pipeline (all three SCNs)

```
CC_LIST → CC_COUNT → CC_RECON → REPLENISH → COMPLIANCE_M3
```

Sources: `MODULE3_STEPS` in `server/rulesEngine.ts`; pass threshold **70/100** (`shared/moduleThresholds.ts`).

### Data model: static seed + dynamic student work

| Data | Pattern | Updates at runtime? |
|------|---------|---------------------|
| `preloadedTransactions` | Static in `seed.ts` | No — loaded at run start |
| `cycleCountTargets`, `replenishmentParams`, `adjustmentThreshold` | Static in `initialStateJson` | No |
| Mission / pedagogy text | Static TS files | No |
| `inventory_counts`, `inventory_adjustments`, `replenishment_suggestions` | Per-run DB rows | Yes — student actions |
| ADJ transactions on CC_RECON | Posted to ledger | Yes — should appear in monitor |
| Live inventory grid | Derived from ledger | Yes |
| REPLENISH auto-complete (SCN-009/010) | Server-side on CC_RECON | Yes — invisible to student |

### Cross-layer coherence vs M1/M2

| Element | M1/M2 pattern | M3 status | Gap class |
|---------|--------------|-----------|-----------|
| Unified Mission Control cockpit | ✓ | ✓ | — |
| OIL Panels A–F populated | ✓ | ✓ | — |
| Bilingual FR/EN pedagogy | ✓ | ✓ | — |
| POSTED/PENDING monitor badges | ✓ (M1 PENDING drama) | △ all POSTED | P1 |
| Scenario-specific cockpit overlays | ✓ | ✗ | P1 |
| Dynamic step rail per scenario | ✓ (M1 ADJ) | ✗ fixed 5 steps | P1/P2 |
| Causal chain in monitor hint + ledger | ✓ | △ SCN-010 only | P1 |
| Student tx highlighted in monitor | implicit | ✗ ADJ blends in | P1 |
| Contextual KPI in cockpit | implicit (capacity, FIFO) | ✗ score only | P1 |
| Operational history / timeline | ledger order | △ flat table | P2 |
| Unposted transaction panel | M1 core | N/A (no PENDING) | — |

---

## Dimension-by-Dimension Analysis

### 1. Mission Control

**M1/M2 gold:** Command bar + OIL + next-action hint + inventory grid with semantic highlighting + full transaction monitor + compliance block + unposted panel (M1) + scenario notes.

**M3 current state:**

| Feature | SCN-009 | SCN-010 | SCN-011 | vs M1/M2 |
|---------|---------|---------|---------|----------|
| Next-action cockpit | ✓ `expectedActionHint` | ✓ | ✓ | Parity |
| Inventory grid (live) | ✓ 2 SKUs | ✓ 1 SKU | ✓ 2 SKUs under Min | Parity on live data |
| Min/Max status in grid | — | — | ✗ no below-Min badge | **Gap P1** |
| Variance delta column | — | — | — | **Gap P1** |
| Transaction monitor | 4 GR rows | 4-row PO→GI chain | 8-row depletion chain | SCN-010 parity; 009 thin |
| Performance block | Score/progress only | Same | Same | **Gap P1** — no accuracy %, days-of-cover |
| Module-specific UX branches | M1: ADJ filter, unposted | M2: (validators) | None | **Gap P1** |

**Findings:**

| ID | Finding | Priority |
|----|---------|----------|
| MC-01 | No inventory overlay showing stock vs Min/Max/SS for SCN-011 — student must infer from numbers | P1 |
| MC-02 | No variance indicator (system vs expected physical) in grid during CC scenarios — only in StepForm | P1 |
| MC-03 | Performance block shows generic score; M2 implicitly teaches via capacity/FIFO in pedagogy — M3 lacks equivalent contextual metric (e.g. accuracy %, variance %) | P1 |
| MC-04 | Resolution path in Mission Control shows REPLENISH for SCN-009/010 even though server auto-completes it — strains G3 coherence | P1 |
| MC-05 | SCN-011 still surfaces CC_LIST/COUNT/RECON in step rail before REPLENISH — mitigated by amber banner in StepForm only | P0 (coherence) |

---

### 2. Operational Intelligence Layer (OIL)

**M1/M2 gold:** Panel B combines pedagogy box + compliance + compact monitor + inventory count; Panel D has alternatives/consequences; Panel F shows recovery paths; scenario-specific notes (`emptyStockNote`, FIFO, capacity).

**M3 current state:** Full A–F panels with static content from `missionDataExtended.ts` and `scenarioCockpitPedagogy.ts`. **No M3-specific control tower** (contrast: M4 `M4_KPI_CONTROL_TOWER`, M5 `M5_KPI_CONTROL_TOWER` + variance signal).

| Panel | M3 quality | Gap vs M1/M2 |
|-------|-----------|--------------|
| **A — Briefing** | Complete objectives, student actions, success/failure | SCN-009 omits ADJ-in-CC_RECON (**P0**) |
| **B — Control Tower** | Evidence + problem + compliance + tx table + location count | No variance threshold badge; no Min/Max tower; tx table capped at 12 rows |
| **C — ERP Learning** | Role, module, tCode per step | Parity |
| **D — Decision Support** | Next-step CTA + takeaway | No `M3_DECISION_SCAFFOLD`; SCN-009 lacks `alternativeActions` |
| **E — Competency** | Bloom, certification note | Parity |
| **F — Resolution Path** | 5-step flow + recovery paths | Fixed pipeline; REPLENISH shown when N/A |

**Findings:**

| ID | Finding | Priority |
|----|---------|----------|
| OIL-01 | SCN-009 Fiche `studentActions` says "REPLENISH si besoin" but no replenish params; omits "Poster ADJ dans CC_RECON (MI07)" for −3 variance | **P0** |
| OIL-02 | No M3 operational annex (cf. M4 Annexe A / M5 Annexe B) for variance bands, Min/Max interpretation | P1 |
| OIL-03 | Panel B inventory visibility is location count only — M1/M2 pedagogy embeds richer bin semantics in `evidenceToObserve` | P1 |
| OIL-04 | Panel D has no demo/eval gated decision scaffold for M3 (M4/M5 pattern exists; M1/M2 use mission copy — SCN-009 is thinner) | P1 |
| OIL-05 | Panel F does not annotate auto-completed REPLENISH on SCN-009/010 | P1 |

---

### 3. Monitor

**M1/M2 gold:** Monitor is the **primary detective tool** — PENDING vs POSTED contrast (SCN-002), multi-hop chains (SCN-004 PO→GR→putaway→SO→GI), lot traceability (SCN-008).

**M3 per scenario:**

| SCN | Preloaded ledger | Causal depth | Pedagogy hint quality | vs M1/M2 |
|-----|-----------------|--------------|----------------------|----------|
| **009** | 2× PO + 2× GR (4 rows) | Low — receipts only | "Focus sur comptage" | Below gold |
| **010** | PO→GR→SO→GI (4 rows) | **High** — explains 380 system qty | "Historique explique stock 380" | **At gold** |
| **011** | 2× full depletion chains (8 rows) | Medium — GIs explain low stock | "GI passées ont réduit sous Min" | Near gold |

**Findings:**

| ID | Finding | Priority |
|----|---------|----------|
| MON-01 | SCN-009 monitor shows only inbound GR — no outbound context; student cannot practice "why is system 100?" detective work | P1 |
| MON-02 | Student-posted ADJ rows after CC_RECON are not visually distinguished from preloaded seed txs (no "student action" badge, no highlight) | P1 |
| MON-03 | No PENDING transactions in any M3 scenario — correct for pedagogy but removes M1-style document anomaly learning (acceptable; not a defect) | — |
| MON-04 | Monitor lacks causal annotation (e.g. "GI-M3-001 −120 → stock 380") — hint text only, not inline | P1 |
| MON-05 | OIL Panel B compact table truncates at 12 rows — SCN-011 has 8 preloaded + student txs; acceptable today, fragile if pipeline grows | P2 |
| MON-06 | No automated monitor alignment test for M3 (M2 has `m2.monitor.test.ts`) | P2 |

---

### 4. Inventory Evidence

**M1/M2 gold:** Grid reflects ledger in real time; negative stock in red; `emptyStockNote` explains starting state; M2 FIFO lots described in pedagogy.

**M3 current state:**

| Capability | Status | Gap |
|------------|--------|-----|
| Live ledger-derived quantities | ✓ | — |
| Negative stock highlighting | ✓ (generic) | — |
| Scenario starting-state note | ✗ no `emptyStockNote` for M3 | P1 |
| Threshold comparison (stock vs Min) | ✗ | P1 |
| Post-adjustment inventory refresh visible | ✓ after CC_RECON ADJ | — |
| Physical qty in CC_COUNT guidance table | Reveals `physicalQty` from seed | P2 — reduces discovery vs M1 observe-then-act |

**Findings:**

| ID | Finding | Priority |
|----|---------|----------|
| INV-01 | SCN-011: grid shows 30/40 but not "BELOW MIN" or delta-to-Min — student must cross-reference StepForm panel | P1 |
| INV-02 | SCN-009/010: no "expected variance" or accuracy % after count — M1 SCN-004 teaches variance through count step discovery | P1 |
| INV-03 | `replenishment_params` global DB table exists but is not surfaced in Mission Control inventory view | P2 |

---

### 5. Compliance

**M1/M2 gold:** `checkCompliance` blocks on unposted txs, negative stock, open variances, FIFO violations, capacity — multi-dimensional with issue list in UI.

**M3 current state:** `validateM3Compliance` checks count completeness, recon + ADJ alignment, justification above threshold, replenish completeness, unposted txs. **Functionally sound** — narrower domain than M1/M2 (appropriate for module scope).

| SCN | Compliance story | vs M1/M2 |
|-----|-----------------|----------|
| 009 | −3 < threshold 5 → no justification; ADJ must post in CC_RECON | ADJ step invisible in Fiche (**P0**) |
| 010 | −28 > threshold 20 → justification mandatory | **Gold parity** |
| 011 | Replenish Q = Max − stock per SKU | **Gold parity** on validator |

**Findings:**

| ID | Finding | Priority |
|----|---------|----------|
| CMP-01 | SCN-009: compliance may block on missing ADJ while Fiche Mission never names MI07 posting inside CC_RECON | **P0** |
| CMP-02 | `complianceHint` in pedagogy is generic — does not echo threshold value per scenario in Mission Control (only in StepForm CC_RECON) | P1 |
| CMP-03 | COMPLIANCE_M3 step copy references REPLENISH as dependency even when auto-completed — minor coherence strain | P2 |

---

### 6. ERP/WMS Learning

**M1/M2 gold:** Full SAP chain in Fiche Mission; `stepErpMap.ts` per step; Guide Maître slides map to scenarios.

**M3 current state:** Complete `stepErpMap` entries for CC_LIST (MI01), CC_COUNT (MI04), CC_RECON (MI07), REPLENISH (MD04), COMPLIANCE_M3 (MB52). Fiche missions cite MI01/MI04/MI07/MD04 appropriately.

**Findings:**

| ID | Finding | Priority |
|----|---------|----------|
| ERP-01 | Guide Maître slide 2 teaches ROP formula; slide 6 Odoo configures ROP; SCN-011 eval uses **Min/Max Q = Max − stock** only — instructor over-teach risk | P1 |
| ERP-02 | Guide slide 7 maps SCN-009 to CC_LIST→CC_COUNT→CC_RECON only — omits ADJ outcome (aligns with Fiche gap) | **P0** |
| ERP-03 | M3 quiz includes EOQ concepts; SCN-011 eval does not assess EOQ — quiz/scenario misalignment | P2 |
| ERP-04 | StepForm REPLENISH panel shows ROP formulas alongside Min/Max — helpful but may confuse eval focus | P1 |

---

### 7. Decision Support

**M1/M2 gold:** OIL Panel D + `scenarioCockpitPedagogy.expectedActionHint` + mission `alternativeActions`, `wrongActionConsequences`, `recoveryPaths`, eval/demo guidance.

**M3 per scenario:**

| SCN | alternativeActions | wrongActionConsequences | recoveryPaths | Depth vs M1/M2 |
|-----|-------------------|------------------------|---------------|----------------|
| 009 | ✗ | ✓ (1) | ✓ (1) | Below M2 SCN-007/008 |
| 010 | ✓ (2) | ✓ (1) | ✓ (1) | **At gold** |
| 011 | ✓ (2) | ✓ (1) | ✓ (1) | **At gold** |

**Findings:**

| ID | Finding | Priority |
|----|---------|----------|
| DEC-01 | SCN-009 lacks alternative actions and rich wrong-action list — weakest decision layer in M3 | P1 |
| DEC-02 | No eval/demo gated `M3_DECISION_SCAFFOLD` (M4/M5 pattern) — optional premium layer | P2 |
| DEC-03 | Variance threshold surfaced in StepForm only — not in OIL Panel D proactive guidance for SCN-010 | P1 |
| DEC-04 | SCN-011 StepForm Min/Max formula panel is excellent — should be referenced from OIL Panel D as "annexe" | P1 |

---

### 8. Resolution Path

**M1/M2 gold:** `OperationalFlowDisplay` + dynamic steps; M1 hides ADJ until variance; M2 SCN-008 skips PUTAWAY; recovery paths name business order (SCN-005: documents → physical → ship).

**M3 current state:** Fixed 5-step pipeline; server auto-completes REPLENISH when no `replenishmentParams`; SCN-011 validators accept empty CC targets as complete but UI still traverses CC steps.

**Findings:**

| ID | Finding | Priority |
|----|---------|----------|
| RES-01 | Shared pipeline forces REPLENISH in Panel F for count-only scenarios — auto-complete is server-side invisible | P1 |
| RES-02 | SCN-011: CC steps mandatory in UI despite empty `cycleCountTargets` — amber banner mitigates, does not remove | **P0** |
| RES-03 | No scenario-specific step skipping (contrast M2 SCN-008 putaway auto-complete with `emptyStockNote` explaining why) | P1 |
| RES-04 | Structural pipeline refactor for per-scenario steps would be high-cost | P2 |

---

## Consolidated Gap Register

### By gap category (mandate taxonomy)

| Category | M3 manifestation | Top priority items |
|----------|-----------------|-------------------|
| **1. Evidências operacionais ausentes** | No Min/Max overlay; no variance badge; SCN-009 ADJ not in Fiche | OIL-01 (**P0**), INV-01 (P1) |
| **2. Monitores pouco informativos** | SCN-009 thin chain; no inline causality; ADJ not highlighted | MON-01, MON-02, MON-04 (P1) |
| **3. Dados estáticos** | Seed targets, thresholds, params static; physicalQty shown in CC_COUNT table | INV-03 (P2), CC_COUNT reveal (P2) |
| **4. Transações não refletidas visualmente** | Student ADJ blends into monitor; REPLENISH auto-complete invisible | MON-02, RES-01 (P1) |
| **5. Ausência de causalidade operacional** | Only SCN-010 has strong PO→GI→stock link; no inline annotations | MON-04 (P1); SCN-010 ✓ |
| **6. Ausência de histórico operacional** | Flat chronological table; no timeline / run audit trail in cockpit | MON-06 (P2) |
| **7. Ausência de KPI contextual** | No accuracy %, variance %, days-of-cover, below-Min count in cockpit | MC-03, INV-01 (P1) |

### Full priority backlog

| ID | Scenario | Dimension | Description | Priority |
|----|----------|-----------|-------------|----------|
| OIL-01 / ERP-02 / CMP-01 | 009 | OIL / ERP / Compliance | Fiche Mission + Guide omit ADJ posting inside CC_RECON for −3 variance | **P0** |
| MC-05 / RES-02 | 011 | Mission Control / Resolution | CC pipeline steps mandatory despite no count targets | **P0** |
| MC-01 | 011 | Inventory | No below-Min / delta-to-Max in inventory grid | P1 |
| MC-02 | 009, 010 | Inventory | No variance context in grid during count scenarios | P1 |
| MC-03 | All | Mission Control | Performance block lacks contextual KPIs (accuracy %, variance %) | P1 |
| MC-04 / RES-01 / OIL-05 | 009, 010 | Resolution | REPLENISH shown in path but auto-completed server-side | P1 |
| OIL-02 | All | OIL | No M3 operational annex (variance bands, Min/Max rubric) | P1 |
| OIL-04 | All | Decision | No M3 decision scaffold; SCN-009 thinnest | P1 |
| MON-01 | 009 | Monitor | Receipt-only ledger — weak causal story | P1 |
| MON-02 | 009, 010 | Monitor | Student ADJ txs not visually distinguished | P1 |
| MON-04 | 010, 011 | Monitor | Causal chain in hint text only — not inline on rows | P1 |
| INV-01 | 011 | Inventory | Min/Max status not in cockpit grid | P1 |
| ERP-01 / ERP-04 | 011 | ERP Learning | ROP taught in Guide/StepForm; eval uses Min/Max only | P1 |
| DEC-01 | 009 | Decision | Missing alternativeActions / richer consequences | P1 |
| DEC-03 | 010 | Decision | Threshold not in OIL Panel D proactively | P1 |
| DEC-04 | 011 | Decision | Excellent StepForm formulas not mirrored in OIL annex | P1 |
| RES-03 | 011 | Resolution | No skip/auto-complete for CC with explanation (cf. M2 SCN-008) | P1 |
| MON-05 | 011 | Monitor | 12-row truncation risk | P2 |
| MON-06 | All | Monitor | No M3 monitor alignment test | P2 |
| INV-03 | All | Inventory | Global `replenishment_params` not in cockpit | P2 |
| ERP-03 | 011 | ERP | Quiz EOQ vs scenario Min/Max focus | P2 |
| RES-04 | All | Resolution | Per-scenario pipeline refactor | P2 |
| DEC-02 | All | Decision | M3_DECISION_SCAFFOLD (demo/eval gated) | P2 |

---

## Per-Scenario Premium Intelligence Verdicts

### SCN-009 — Inventaire cyclique simple (−3 variance)

**Classification: YELLOW**

| Dimension | Assessment |
|-----------|------------|
| Mission Control | Functional; inventory shows 100/80 but no variance context |
| OIL | Briefing gap on ADJ; REPLENISH mention misleading |
| Monitor | Weakest in M3 — 4 GR rows only |
| Inventory Evidence | Live grid OK; no accuracy KPI |
| Compliance | Validator correct; Fiche does not explain ADJ path (**P0**) |
| ERP/WMS Learning | MI01/04/07 mapped; Guide slide 7 incomplete |
| Decision Support | Minimal — no alternatives |
| Resolution Path | 5 steps including irrelevant REPLENISH |

**Analytical chain:** Problème (écarts) → Données (grid + GR monitor) → Analyse (CC_COUNT) → Décision (CC_RECON) → Solution (ADJ) → Conformité — **broken at Fiche Mission for Solution step**.

---

### SCN-010 — Écart significatif (−28, seuil 20)

**Classification: GREEN (M3 gold reference)**

| Dimension | Assessment |
|-----------|------------|
| Mission Control | Full cockpit; inventory + monitor tell coherent story |
| OIL | Richest mission copy — alternatives, consequences, recovery |
| Monitor | **M1/M2 parity** — PO→GR→SO→GI explains 380 |
| Inventory Evidence | Single-SKU focus clear |
| Compliance | Threshold + justification — exemplary |
| ERP/WMS Learning | MI07 variance focus aligned |
| Decision Support | Strong wrong-action learning |
| Resolution Path | REPLENISH mention is only blemish (auto-completed) |

**Analytical chain:** Complete end-to-end without instructor rescue.

---

### SCN-011 — Réapprovisionnement Min/Max

**Classification: YELLOW**

| Dimension | Assessment |
|-----------|------------|
| Mission Control | Stock levels visible; no below-Min badges |
| OIL | Replenish-focused pedagogy strong |
| Monitor | 8-row depletion chain — good with hint |
| Inventory Evidence | 30/40 visible; Min/Max only in StepForm |
| Compliance | Min/Max validator solid |
| ERP/WMS Learning | MD04 aligned; ROP over-taught in slides |
| Decision Support | Strong mission + StepForm formulas |
| Resolution Path | **CC friction** — non-pedagogical steps remain (**P0**) |

**Analytical chain:** Problème (sous Min) → Données (grid + GI monitor) → Analyse (Min/Max panel) → Décision (REPLENISH Q) → Conformité — **friction at CC pipeline steps**.

---

## Cross-Source Coherence Matrix

| Element | Guide Maître M3 | Fiche Mission | OIL / Pedagogy | Monitor | StepForm | Compliance |
|---------|----------------|---------------|----------------|---------|----------|------------|
| SCN-009 cycle count | Slide 7: CC only | △ no ADJ in actions | ✓ reconcile hint | △ GR only | ✓ CC targets table | ✓ ADJ required |
| SCN-010 variance −28 | Slide 4: variance process | ✓ threshold 20 | ✓ | ✓ PO→GI chain | ✓ threshold panel | ✓ justification |
| SCN-011 Min/Max | △ ROP in slides | ✓ Q = Max − stock | ✓ | ✓ GI depletion | ✓ formula panel | ✓ replenish validator |
| Shared REPLENISH step | Slide 7 implies per-SCN focus | △ "si besoin" on 009/010 | — | — | auto-complete | passes empty |
| ADJ inside CC_RECON | Not explicit | △ SCN-009 gap | ✓ SCN-010 | ADJ tx in ledger | ✓ MI07 on recon | ✓ |

---

## What M3 Needs to Reach M1/M2 Premium Parity

### P0 — Pedagogical coherence (must-fix for unattended eval)

1. **SCN-009 Fiche Mission + Guide slide 7:** Add explicit step — "CC_RECON : poster l'ajustement ADJ (MI07) pour l'écart −3 sur SKU-001."
2. **SCN-011 resolution path:** Either server-side skip of empty CC steps with Mission Control explanation, or strengthen Mission Control next-action (not only StepForm banner) to state CC steps are confirmatory only.

### P1 — Premium parity with M1/M2 operational depth

1. **M3 Operational Control Tower** (lightweight, not M4 KPI mode): per-SCN overlays in OIL Panel B — variance threshold badge (010), below-Min badges (011), accuracy % after count (009/010).
2. **Monitor causality annotations:** Inline row grouping or docRef chain labels for SCN-010/011 (e.g. "→ stock 380").
3. **Student transaction highlighting:** Visual badge on ADJ/REPLENISH rows posted by student in monitor + OIL Panel B.
4. **Inventory grid enrichment:** Status column variants — BELOW_MIN, VARIANCE_OPEN, ACCURACY_OK.
5. **SCN-009 decision depth:** Add `alternativeActions` and expand `wrongActionConsequences` to M2 level.
6. **Resolution path honesty:** Panel F annotation when REPLENISH is auto-completed ("Non requis — confirmé automatiquement").
7. **Align Guide Maître slide 6/7** with Min/Max eval gate; de-emphasize ROP for SCN-011 eval path.
8. **Contextual performance KPIs** in Mission Control right column — inventory accuracy %, open variances count.

### P2 — Future premium (no release blocker)

1. Per-scenario `MODULE3_STEPS` variants (structural).
2. `M3_DECISION_SCAFFOLD` with demo/eval gating (M4/M5 pattern).
3. `m3.monitor.test.ts` ledger alignment tests.
4. Operational timeline / audit trail panel.
5. Surface global `replenishment_params` in cockpit for cross-SKU context.
6. Remove `physicalQty` from CC_COUNT guidance table to restore pure observe-then-act (trade-off vs accessibility).

---

## What Is Already Excellent (Do Not Regress)

| Asset | Why it is gold-quality |
|-------|------------------------|
| **Transactional M3 API** | `submitCcList/Count/Recon`, `submitReplenish`, `submitComplianceM3` — full persist + score events |
| **`validateM3Compliance`** | Multi-check validator with FR/EN issues — production-grade |
| **SCN-010 end-to-end** | Near M1/M2 parity on monitor causality, justification gate, mission copy richness |
| **SCN-011 StepForm** | Min/Max formula panel, multi-SKU replenish hints, amber CC banner |
| **`scenarioCockpitPedagogy` M3 entries** | Complete bilingual hints per SCN including `transactionMonitorHint` |
| **`stepErpMap` M3 steps** | MI01/04/07/MD04/MB52 correctly mapped |
| **Bloom arc 009→010→011** | Apply → Analyze → Evaluate — pedagogically sound progression |
| **70/100 threshold** | Aligned with competency map and module complexity |
| **ADJ folded into CC_RECON** | Matches real SAP MI07 reconciliation flow — **do not split into separate ADJ step** |
| **OIL A–F shell** | Same premium cockpit architecture as M1/M2/M4/M5 |
| **`m3.smoke.test.ts`** | Regression on full pipeline and compliance for all three SCNs |
| **RC13 SCN-011 labeling fix** | Min/Max Q = Max − stock correctly documented in eval guidance |

---

## What Must NOT Be Altered

| Item | Rationale |
|------|-----------|
| **M3 transactional paradigm** | M3 is inventory execution, not KPI analytics — do **not** import M4 KPI tower or empty-monitor pattern |
| **Core 5-step pipeline structure** | Changing per-SCN pipelines is P2 architectural work — not required for RC14 coherence fixes |
| **Pass threshold 70/100** | Certification contract in `competencyMap` and `moduleThresholds` |
| **SCN-010 justification validator** | Pedagogically correct; matches industry audit-trail requirements |
| **Server-side REPLENISH auto-complete** | Correct behavior for SCN-009/010 — fix is **visibility/copy**, not removing auto-complete |
| **Preloaded all-POSTED transactions** | No ghost GR in M3 is intentional — different learning objective than M1 SCN-002 |
| **Competency map entries** | Bloom levels and certification notes are aligned |
| **Database schema** | `inventory_counts`, `inventory_adjustments`, `replenishment_suggestions` — stable contracts |

---

## Instructor Briefing Notes (RC14)

| Scenario | Student must discover | UI already scaffolds | Instructor should emphasize |
|----------|----------------------|---------------------|----------------------------|
| SCN-009 | −3 variance on SKU-001; ADJ inside CC_RECON | CC_COUNT table, OIL reconcile hint | **ADJ is posted during CC_RECON, not a separate step** |
| SCN-010 | Why system = 380; −28 exceeds threshold 20 | Monitor PO→GI chain, threshold panel | Read monitor before counting |
| SCN-011 | Q = Max − stock for each SKU | Min/Max panel, GI depletion monitor | CC steps are procedural — focus on REPLENISH |

---

## Recommended RC14 Execution Order

```
Phase 1 (P0 — documentation/coherence, no pipeline refactor)
  → SCN-009 Fiche + Guide slide 7 ADJ wording
  → SCN-011 Mission Control next-action strengthening for CC skip context

Phase 2 (P1 — premium intelligence overlays)
  → M3 Panel B operational badges (variance threshold, below-Min)
  → Monitor student-tx highlighting + SCN-010 causal annotations
  → Panel F REPLENISH auto-complete annotation
  → SCN-009 alternativeActions / consequences

Phase 3 (P2 — backlog)
  → m3.monitor.test.ts
  → M3_DECISION_SCAFFOLD
  → Per-scenario pipeline evaluation
```

---

## Verdict Summary

| Question | Answer |
|----------|--------|
| **O que falta para M3 atingir padrão M1/M2?** | Scenario-specific operational overlays (control tower badges, causal monitor annotations, student-tx highlighting, contextual KPIs), P0 copy fixes on SCN-009 ADJ and SCN-011 CC friction, and richer decision support on SCN-009. SCN-010 already demonstrates the target depth. |
| **O que já está excelente?** | Transactional engine, compliance validator, OIL shell, SCN-010 narrative chain, SCN-011 StepForm pedagogy, bilingual cockpit hints, ERP step mapping, smoke tests. |
| **O que não deve ser alterado?** | M3 transactional paradigm (no M4 KPI mode), 70/100 threshold, ADJ-in-CC_RECON model, auto-complete REPLENISH logic, all-POSTED seed design, database schema, SCN-010 justification gate. |

**RC14 M3 Premium Intelligence Status:** **YELLOW — functional and pedagogically viable with instructor briefing; premium parity with M1/M2 achievable via P0 copy fixes + P1 operational intelligence overlays without architectural refactor.**

---

*Audit conducted read-only against repository state on 2026-06-18. No code, seed, scoring, or certification logic was modified.*
