# TEC.WMS — Professor Experience Audit

**Document type:** Instructor-facing pedagogical audit (audit only — no slide redesign, no course rewrite)  
**Programme:** TEC.LOG — Collège de la Concorde  
**Release context:** RC15 complete · Simulator operational · Classroom ready  
**Audit date:** 2026-07-01  
**Scope:** All 36 official slides (M1–M5), teaching rhythm, simulator integration, quiz/checkpoint/certification timing  
**Primary sources:** `client/src/data/modules.ts` (slides + `notesFr`/`notesEn` + `timingMin`), `TECWMS_GUIDE_ENSEIGNANT_PDF_READY.md`, `Documentation/PEDAGOGICAL_ALIGNMENT_AUDIT.md`, `docs/releases/RC15_CLASSROOM_READINESS_REPORT.md`, `docs/audits/CHECKPOINT_CERTIFICATION_GATING_AUDIT.md`

---

## Executive Summary

This audit evaluates the **classroom delivery experience from the professor's perspective** — not content accuracy (already audited elsewhere) nor runtime correctness (RC15 validated). The question is: *Can an instructor, projecting slides with professor notes, naturally lead a 3-hour session, know when to demonstrate, pause, or open the simulator, and anticipate where students struggle?*

### Overall verdict: **READY with documented instructor adaptations**

| Dimension | Rating | Summary |
|-----------|--------|---------|
| **Teaching flow (M1)** | ★★★★☆ | Strong narrative arc PO→GI; slides 3–8 need live demos to avoid lecture overload |
| **Teaching flow (M2–M3)** | M2–M3 | Good warehouse/inventory story; M2/M3/M4 slide 6 = TEC.WMS consolidation; M3 formulas need whiteboard time |
| **Teaching flow (M4–M5)** | M4–M5 | Analytical shift well signaled; M4 professor notes misaligned on slides 2–3; M5 Peak Week narrative is instructor-ready |
| **Built-in instructor support** | **Strong** | Every slide has bilingual oral notes; `scenarioMap` links slides to SCN codes |
| **Slide pacing vs. calendar** | **Gap** | Sum of `timingMin` = **79 min** across 36 slides; institutional model allocates **~7.5 h** (~25% of 30 h) to slides — instructors must expand with demos, questions, and pauses |
| **Simulator integration cues** | **Partial** | Scenario slides and flow slides hint at simulator; no explicit “open simulator now” markers except exercise slides |
| **Quiz / checkpoint / cert timing** | **Clear in Guide** | Slides under-specify gates; Guide Enseignant §4–11 is authoritative for instructors |
| **Future cohort readiness** | **GO** | RC15 classroom readiness confirmed; cohort isolation and M3 teacher validation fixed |

### Top 5 instructor risks (no slide changes required — classroom mitigation)

1. **M1 slides 3–8 (six SAP transactions in ~12 min nominal)** — Cognitive overload without simulator projection between slides.
2. **M4 slides 2–3** — Professor notes reference OTIF / Fill Rate while slide bodies cover rotation and service/errors; instructors must follow **slide body**, not notes alone.
3. **TEC.WMS consolidation slides (M2-S6, M3-S6, M4-S6)** — Mission Control demonstration in the official simulator environment; TEC.WMS is the evaluation environment.
4. **Missing module cover/objectives slides (M2–M5)** — Sessions start mid-content; instructors should verbalize objectives in first 5 minutes.
5. **M1-S10 / M5-S5 certification copy** — Slide text still hedges QR badge availability; production now supports credentials — instructors should demo live Certifications page (RC15).

### Slide inventory

| Module | Slides | `timingMin` sum | Institutional duration | Scenarios | Quiz gate |
|--------|--------|-----------------|------------------------|-----------|-----------|
| M1 | 10 | 23 min | 6 h (S1–S2) | SCN-001→005 | **Silver gate** |
| M2 | 7 | 16 min | 6 h (S3–S4) | SCN-006→008 | Reinforcement |
| M3 | 7 | 15 min | 6 h (S5–S6) | SCN-009→011 | Reinforcement + **teacher validation** |
| M4 | 7 | 15 min | 6 h (S9) | SCN-012→014 | Reinforcement |
| M5 | 5 | 10 min | 6 h (S10) | SCN-015→017 | **Gold gate** |
| **Total** | **36** | **79 min** | **30 h / 10 séances** | **17 SCN** | M1 + M5 |

---

## Methodology

For each slide the audit assesses:

| Criterion | Question |
|-----------|----------|
| **Class leadership** | Does the slide naturally lead the class forward? |
| **Explainability** | Would the professor know *what* to explain? |
| **Demonstrability** | Would the professor know *what* to demonstrate? |
| **Student questions** | Where are questions likely? |
| **Simulator timing** | Is this the correct place to open the simulator? |
| **Activity type** | Should this slide host demonstration · discussion · pause · exercise · scenario · quiz? |

Ratings: **●** Strong · **◐** Adequate with instructor adaptation · **○** Weak / needs instructor workaround

Slide types in codebase: `cover`, `concept`, `process`, `exercise`, `summary`, `kpi` — types `objectives`, `terminology`, `comparison`, `simulation` exist in the schema but are **unused**.

---

## Cross-cutting analysis

### Teaching rhythm

The programme follows a consistent **Explain → Quiz → Simulate → Debrief** loop per module. Slides occupy the **Explain** phase (~25% of session time per Guide §4.2). The nominal `timingMin` values represent **minimum speaking time**, not full session allocation. Effective rhythm requires:

| Phase | Typical duration (3 h séance) | Slide role |
|-------|-------------------------------|------------|
| Accueil + slides concepts | 45–60 min | Slides 1–N−1 |
| Quiz (autonomous) | 15–20 min | After slides or between séances |
| Simulator TP | 90–110 min | Post slide “Application scénarios” |
| Débrief Run Report | 10–15 min | Post-scenario, not on slides |

**Attention span:** M1 packs six transaction slides consecutively (S3–S8) without exercise breaks — the highest overload risk in the programme. M4–M5 shift to analytical mode appropriately after M1–M3 operational foundation.

### Transitions

| Transition | Quality | Instructor action |
|------------|---------|-------------------|
| M1 flow overview → PO → GR → … → GI | **Strong** linear chain | Use S2 warehouse image as anchor; return to diagram after each transaction |
| M1 GI → CC → Scenarios | **Adequate** | Explicitly bridge: “MI01 closes the loop we started at MIGO” |
| M2 zones → receiving flow → bins → capacity → FIFO | **Strong** spatial-then-process | Walk zones on S1 before S2 flow |
| M2 FIFO → TEC.WMS consolidation → Scenarios | **Strong** | Simulator reinforces layout rules before SCN-006–008 |
| M3 formulas → TEC.WMS consolidation → Scenarios | **Adequate** | Whiteboard ROP/SS before Mission Control demo |
| M4 KPI reading → RCA → TEC.WMS consolidation → Scenarios | **Strong** analytical arc | Stress “no stock movement” before opening simulator |
| M5 integrated chain → SCN-015/16/17 → Gold | **Strong** Peak Week narrative | Map each slide to Peak Week day |

### Difficulty progression

```
M1: Understand → Apply (SCN-001→005)
M2: Apply → Analyze (FIFO)
M3: Apply → Analyze (variance, replenishment)
M4: Analyze → Evaluate (multi-KPI trade-offs)
M5: Analyze → Evaluate → Create (strategic capstone)
```

Slides mirror this progression; **simulator difficulty** ramps faster than slide density in M1 (SCN-004/005 are hard while slides stay uniform 2 min).

### Knowledge progression

Slides teach **conceptual vocabulary and SAP transaction anchors**; the simulator teaches **operational reasoning** (Constitution Article III). The split is intentional but instructors must never treat slides as sufficient without TP.

### Simulator integration (programme-level)

| When | Action | Route |
|------|--------|-------|
| M1-S1 | Show platform (second screen) | `/teacher/slides/1` + student login demo |
| M1-S2 | Map flow to Mission Control | Demo mode SCN-001 preview |
| M1-S3–S8 | Micro-demo per transaction | Demo mode or teacher projection |
| M1-S9 | Assign scenarios | `/student/scenarios` |
| M2-S1 | Warehouse layout ↔ monitor zones | Demo SCN-006 |
| M2-S7 | Assign M2 scenarios | `/student/module2` |
| M3-S2–S3 | ROP/SS — use monitor + Annexe | `/student/module3` |
| M3-S7 + S6 | Teacher validation after SCN-011 | `/teacher/dashboard` validate M3 |
| M4-S1 | **Empty monitor is normal** | Demo SCN-012 |
| M4-S7 | Distribute Annexe A | `/student/module4` |
| M5-S2–S4 | Peak Week sequential | `/student/module5` |

### Quiz timing

| Module | When (institutional) | Slide support | Instructor must |
|--------|----------------------|---------------|-----------------|
| M1 | S1 — before SCN-001 (Silver gate) | S1 mentions quiz threshold | Allocate 15–20 min; verify ≥60% before S2 |
| M2–M4 | End of slides or homework | Not on slides | Clarify: reinforcement only, not cert |
| M5 | S10 — before/during capstone | S5 mentions Gold | Gate 2 for Gold eligibility |

### Checkpoint timing

| Checkpoint | Slide mention | Critical instructor moment |
|------------|---------------|----------------------------|
| M1 `module_progress` | S1, S10 | After SCN-005 complete |
| M3 `teacherValidated` | **Not on slides** | **S6 — validate all students before S9** |
| Silver 4 gates | S10 | S7 consolidation séance |
| Gold 18 gates | M5-S5 | S10 — SCN-017 + Quiz M5 |

### Certification preparation

- **M1-S10:** Silver checklist — demo `/student/certifications/silver`
- **M5-S5:** Gold capstone — demo `/student/certifications/gold`; note slide copy lag on QR badge (production ready per RC15)
- **S7–S8 consolidation séances:** No dedicated slides — instructors use Guide §10–11

---

## Module 1 — Fondements ERP/WMS

**Institutional duration:** 6 h (Séances 1–2) · **Slides:** 10 · **Scenarios:** SCN-001→005 · **Pass:** ≥60/100

### Teaching flow

```
S1 Cover → S2 Flow overview → S3–S8 Transaction chain (PO→GR→STOCK→SO→GI→CC)
→ S9 Scenario map → S10 Silver certification
```

**Recommended séance split (Guide §4.1):**

| Séance | Slides | Quiz | Scenarios |
|--------|--------|------|-----------|
| S1 | 1–5 (+ demo S3–S5) | **Quiz M1** | SCN-001, SCN-002 |
| S2 | 6–10 | — | SCN-003, SCN-004, SCN-005 |

**Estimated teaching time (slides only):** 23 min nominal · **realistic with demos:** 50–70 min across both séances

### Slide-by-slide audit

#### M1-S1 — Cover · `timingMin: 3`

| Criterion | Assessment |
|-----------|------------|
| Leads class? | **●** Strong opener — programme, cycle, thresholds |
| Know what to explain? | **●** Notes: job market, Quebec employers, platform intro |
| Know what to demonstrate? | **●** Notes explicitly say show Mini-WMS on second screen |
| Student questions? | Programme structure, “what is WMS?”, certification meaning |
| Open simulator? | **◐** Show login/shell only — not a scenario yet |
| Activities | **demonstration** · **discussion** (expectations) · **pause** (self-intro) |

**Tips:** Do not rush. This slide sets employment relevance. Show teacher + student views.

---

#### M1-S2 — Flux logistique intégré · `timingMin: 4` · `scenarioMap: SCN-001→005`

| Criterion | Assessment |
|-----------|------------|
| Leads class? | **●** Central anchor diagram for entire M1 |
| Explain? | **●** Seven-step cycle; dependency chain |
| Demonstrate? | **●** Warehouse image + optional FLOW visual |
| Student questions? | “What happens if GR fails?” — foreshadows SCN-002 |
| Open simulator? | **◐** Preview Mission Control layout in demo mode |
| Activities | **demonstration** · **discussion** · **warehouse story** (Sobeys/Couche-Tard receiving dock) |

**Confusion risk:** Students conflate emoji steps with SAP transaction names — map each step to upcoming slides.

**Pause:** After step 4 (STOCK) — ask “where does physical inventory live vs. system record?”

---

#### M1-S3 — Purchase Order (PO) · ME21N · `timingMin: 2`

| Criterion | Assessment |
|-----------|------------|
| Leads class? | **◐** Logical after S2 but **fast** |
| Explain? | **●** Contractual trigger, supplier link |
| Demonstrate? | **○** Notes do not say demo — **instructor should** |
| Student questions? | PO vs. requisition; who creates PO in real warehouse? |
| Open simulator? | **●** Yes — demo PO step in SCN-001 or transaction form |
| Activities | **demonstration** · **pause** |

**Too fast:** 2 min insufficient. Plan **8–10 min** with live PO creation.

**Warehouse story:** “Supplier confirms 500 units SKU-001 — nothing enters without this document.”

---

#### M1-S4 — Goods Receipt (GR) · MIGO · `timingMin: 2`

| Criterion | Assessment |
|-----------|------------|
| Leads class? | **●** Natural follow-on from PO |
| Explain? | **●** Counting accuracy, labels, discrepancies |
| Demonstrate? | **◐** Notes mention labels but not simulator |
| Student questions? | Partial receipt; damaged goods; ghost GR (foreshadow SCN-002) |
| Open simulator? | **●** Demo GR posting; show unposted state for SCN-002 preview |
| Activities | **demonstration** · **discussion** · **scenario** (tease SCN-002) |

**Confusion hotspot:** Posted vs. unposted GR — **critical** for SCN-002 success.

**Instructor question:** “What breaks downstream if GR quantity is wrong?”

---

#### M1-S5 — Stock & Inventory · MMBE · `timingMin: 2`

| Criterion | Assessment |
|-----------|------------|
| Leads class? | **●** |
| Explain? | **●** Real-time balances, bins, FIFO mention, variance |
| Demonstrate? | **◐** Show stock monitor in simulator |
| Student questions? | FIFO definition; “variance detected” meaning |
| Open simulator? | **●** Stock view / monitor panel |
| Activities | **demonstration** · **pause** |

**Needs example:** Walk through one SKU quantity across bins.

---

#### M1-S6 — Sales Order (SO) · VA01 · `timingMin: 2`

| Criterion | Assessment |
|-----------|------------|
| Leads class? | **●** Demand signal concept clear |
| Explain? | **●** |
| Demonstrate? | **○** Add simulator SO step |
| Student questions? | Allocation; partial ship; backorder link to SCN-003 |
| Open simulator? | **●** |
| Activities | **demonstration** · **discussion** |

---

#### M1-S7 — Goods Issue / Shipping (GI) · VL02N · `timingMin: 2`

| Criterion | Assessment |
|-----------|------------|
| Leads class? | **●** |
| Explain? | **●** Customer impact framing strong in notes |
| Demonstrate? | **◐** Pick/pack/ship in simulator |
| Student questions? | Difference GI vs. delivery; picking errors |
| Open simulator? | **●** |
| Activities | **demonstration** · **warehouse story** (wrong item shipped → OTIF impact) |

---

#### M1-S8 — Cycle Count · MI01 · `timingMin: 2`

| Criterion | Assessment |
|-----------|------------|
| Leads class? | **●** Closes loop back to S2 compliance step |
| Explain? | **●** System = reality principle |
| Demonstrate? | **◐** Preview cycle count in SCN-004 context |
| Student questions? | When to count; adjustment authority |
| Open simulator? | **◐** Preview only — full CC in SCN-004 |
| Activities | **demonstration** · **discussion** · **pause** |

**Confusion hotspot:** Physical count vs. variance delta — emphasize before SCN-004.

---

#### M1-S9 — Application scénarios SCN-001→005 · `timingMin: 2`

| Criterion | Assessment |
|-----------|------------|
| Leads class? | **●** Clear TP handoff |
| Explain? | **●** Each SCN tests one cycle skill |
| Demonstrate? | **◐** Brief Mission Sheet walkthrough |
| Student questions? | Order mandatory? Mode Évaluation vs. Démo |
| Open simulator? | **●** **Primary handoff slide** |
| Activities | **exercise** · **scenario** · **discussion** |

**Too fast:** Allocate **15–20 min** to explain all five scenarios + evaluation rules.

**Suggested classroom questions:**
- “Which SCN has no stock at start?” (SCN-001)
- “Which SCN tests unposted transaction?” (SCN-002)

---

#### M1-S10 — Silver certification · `timingMin: 2`

| Criterion | Assessment |
|-----------|------------|
| Leads class? | **●** Motivational close |
| Explain? | **◐** Slide says QR “à venir” — **update verbally** for RC15 |
| Demonstrate? | **●** Show Certifications page live |
| Student questions? | Quiz retakes; what if one SCN fails |
| Open simulator? | **●** Certifications + quiz routes |
| Activities | **demonstration** · **discussion** · **quiz** (reminder M1 gate) |

---

### M1 — Summary recommendations

| Category | Guidance |
|----------|----------|
| **Suggested pauses** | After S2 (flow); after S4 (GR posted/unposted); before S9 (scenario briefing) |
| **Suggested demonstrations** | S1 platform; S3–S8 each need simulator micro-demo; S10 certifications |
| **Suggested discussions** | Employment relevance (S1); error propagation (S2, S4); Silver requirements (S10) |
| **Expected student difficulties** | SAP code overload; ghost GR concept; physical qty at cycle count |
| **Teaching effectiveness** | **B+** — Strong content, requires instructor pacing to avoid “transaction carousel” |

---

## Module 2 — Exécution d'entrepôt

**Institutional duration:** 6 h (Séances 3–4) · **Slides:** 7 · **Scenarios:** SCN-006→008 · **Pass:** ≥60/100

### Teaching flow

```
S1 Warehouse zones → S2 Receiving/putaway flow → S3 Bin structure → S4 Capacity
→ S5 FIFO → S6 TEC.WMS consolidation → S7 Scenarios
```

**Note:** No cover slide — instructor opens with M2 objectives verbally.

**Estimated teaching time:** 16 min nominal · **realistic:** 40–55 min + Mission Control demo 15 min

### Slide-by-slide audit

#### M2-S1 — Warehouse layout (9 zones) · `timingMin: 3`

| Activities | **demonstration** · **discussion** · **warehouse story** |
| Simulator? | **●** Map zones to monitor; preview SCN-006 REC-01 |
| Questions? | Cold storage rules; why separate picking zone |

**●** Strong spatial anchor — use warehouse image extensively.

---

#### M2-S2 — Receiving & putaway flow · `timingMin: 2`

| Activities | **demonstration** · **pause** |
| Simulator? | **●** Six-step flow in SCN-006 |
| Confusion? | System confirmation vs. physical putaway complete |

**◐** Too fast without walking one pallet through all six steps.

---

#### M2-S3 — Bin management · `timingMin: 2`

| Activities | **demonstration** · **discussion** |
| Simulator? | **●** Bin codes A1-C1-03 in putaway forms |
| Questions? | Zone-aisle-level-bin hierarchy |

**Needs example:** One SKU in two bins — why?

---

#### M2-S4 — Capacity control · `timingMin: 2`

| Activities | **demonstration** · **scenario** (tease SCN-007) |
| Simulator? | **●** SCN-007 demo — 600 vs 500 cap |
| Confusion hotspot? | **●** Students try force allocation — preview rejection |

**Warehouse story:** “Overfilled bin collapses — safety and picking efficiency.”

---

#### M2-S5 — FIFO strategy · `timingMin: 2`

| Activities | **discussion** · **demonstration** · **warehouse story** (pharma/food) |
| Simulator? | **●** SCN-008 pre-seeded lots |
| Questions? | FIFO vs. FEFO; expired product liability |

**●** Notes excellent — legal/reputation angle resonates.

---

#### M2-S6 — TEC.WMS consolidation (layout) · `timingMin: 3`

| Activities | **demonstration** · Mission Control |
| Simulator? | **●** TEC.WMS — official course environment |
| Questions? | “Is this on the exam?” → Concepts apply in simulator runs |

**Instructor guidance:** Demo zones, bins, capacity and FIFO in Mission Control before SCN-006–008.

**Too slow if:** Students not logged in — verify simulator access before class.

---

#### M2-S7 — Scenarios SCN-006→008 · `timingMin: 2`

| Activities | **exercise** · **scenario** |
| Simulator? | **●** Primary TP handoff |

Brief each scenario: putaway → capacity → FIFO.

---

### M2 — Summary recommendations

| Category | Guidance |
|----------|----------|
| **Suggested pauses** | After S1 (zone tour); after S5 (FIFO rules before TP) |
| **Suggested demonstrations** | S1 layout; S4 capacity rejection; S5 lot dates |
| **Suggested classroom questions** | “Which zone for inbound pallets?” “What happens at 501st unit?” |
| **Expected difficulties** | Bin addressing; capacity overflow handling; SCN-008 autocompleted putaway surprise |
| **Teaching effectiveness** | **A-** — Spatial slides strong; TEC.WMS consolidation reinforces before scenarios |

---

## Module 3 — Contrôle des stocks

**Institutional duration:** 6 h (Séances 5–6) · **Slides:** 7 · **Scenarios:** SCN-009→011 · **Pass:** ≥70/100 · **Teacher validation required**

### Teaching flow

```
S1 Inventory overview → S2 Min/Max/ROP → S3 Safety Stock → S4 Cycle count/variance
→ S5 Replenishment decision → S6 TEC.WMS consolidation → S7 Scenarios
```

**Estimated teaching time:** 15 min nominal · **realistic:** 45–60 min (formulas need whiteboard)

### Slide-by-slide audit

#### M3-S1 — Inventory control overview · `timingMin: 2`

| Activities | **discussion** · **pause** |
| Questions? | Cost of stockout vs. holding cost |

**●** Good dilemma framing.

---

#### M3-S2 — Min/Max/ROP · `timingMin: 2`

| Activities | **demonstration** · **pause** · **exercise** (whiteboard) |
| Simulator? | **◐** Reference SCN-011 replenishment |
| Confusion hotspot? | **●** Formula variables — demand, lead time, SS |

**Too fast:** Plan **10–15 min** whiteboard: draw MIN, MAX, ROP lines.

**Instructor question:** “Stock is at ROP — what document gets created?”

---

#### M3-S3 — Safety Stock · `timingMin: 2`

| Activities | **discussion** · **exercise** (formula walkthrough) |
| Confusion? | **●** Z-score, σ — math anxiety |

**Needs example:** Compare 95% vs 99% service level numeric example.

**Pause:** Ask students for real-world “surprise demand” stories.

---

#### M3-S4 — Cycle count & variance · `timingMin: 2`

| Activities | **demonstration** · **discussion** |
| Simulator? | **●** SCN-009/010 preview |
| Confusion? | Variance % threshold; ADJ inside CC_RECON |

Links back to M1-S8 — reinforce continuity.

---

#### M3-S5 — Replenishment decision · `timingMin: 2`

| Activities | **discussion** · **scenario** |
| Questions? | Manual override of automatic PO |

**◐** Criteria list good but abstract — tie to SCN-011 numbers.

---

#### M3-S6 — TEC.WMS consolidation (replenishment) · `timingMin: 3`

| Activities | **demonstration** · Mission Control |
| Simulator? | **●** TEC.WMS — REPLENISH / SCN-011 |

Demo Min/Max, ROP and Safety Stock in Mission Control before scenarios.

---

#### M3-S7 — Scenarios SCN-009→011 · `timingMin: 2`

| Activities | **exercise** · **scenario** |
| Simulator? | **●** TP handoff |

**Critical:** After SCN-011, schedule **teacher validation** (not on slide — Guide §5.3).

---

### M3 — Summary recommendations

| Category | Guidance |
|----------|----------|
| **Suggested pauses** | S2–S3 formula block (combined 20 min whiteboard) |
| **Suggested demonstrations** | S4 cycle count; S7 live SCN-009 start |
| **Expected difficulties** | ROP/SS math; SCN-010 variance justification; SCN-011 replenishment quantity; mandatory REPLENISH step even when focus is CC |
| **Checkpoint timing** | **S6 end** — validate M3 before any M4 work |
| **Teaching effectiveness** | **B** — Concepts dense; instructor math support essential |

---

## Module 4 — Indicateurs de performance

**Institutional duration:** 6 h (Séance 9) · **Slides:** 7 · **Scenarios:** SCN-012→014 · **Pass:** ≥70/100 (max score 75)

### Teaching flow

```
S1 KPI dashboard → S2 Turnover → S3 Service/errors → S4 Productivity/cost
→ S5 RCA → S6 TEC.WMS KPI consolidation → S7 Scenarios + Annexe A
```

**Paradigm shift:** Analytical — **no stock movement**. Must be stated early and often.

**Estimated teaching time:** 15 min nominal · **realistic:** 40–50 min

### Slide-by-slide audit

#### M4-S1 — KPI dashboard overview · `timingMin: 2`

| Activities | **demonstration** · **discussion** · **pause** |
| Simulator? | **●** Show **empty** transaction monitor — normalize this |
| Questions? | “Why is monitor empty?” “Is simulator broken?” |

**●** Body text explicitly addresses empty monitor — **critical instructor moment**.

---

#### M4-S2 — Turnover & service · `timingMin: 2`

| Activities | **exercise** (calculation) · **discussion** |
| Simulator? | **◐** SCN-012 after slide block |
| **Issue:** Notes mention **OTIF** but slide body is **rotation** — follow slide |

**Needs example:** 2400÷400=6× class calculation on board.

**Instructor question:** “Is 6× good or bad? Why?”

---

#### M4-S3 — Service & operational errors · `timingMin: 2`

| Activities | **exercise** · **discussion** |
| **Issue:** Notes mention **Fill Rate** but slide is **service level + errors** |

285/300=95%; errors 4% — walk through both.

Foreshadow SCN-013 correlation analysis.

---

#### M4-S4 — Productivity & cost · `timingMin: 2`

| Activities | **discussion** |
| Simulator? | **○** Transversal — supports SCN-014 trade-offs |

**◐** Generic — link explicitly to SCN-014 cost/service tension.

---

#### M4-S5 — Root Cause Analysis · `timingMin: 2`

| Activities | **discussion** · **scenario** (SCN-014 capstone) |
| Questions? | “Can we optimize one KPI in isolation?” |

**●** Strong capstone framing — single-KPI = sub-optimization.

---

#### M4-S6 — TEC.WMS KPI consolidation · `timingMin: 3`

Mission Control KPI Control Tower demo — same official environment as assessment.

---

#### M4-S7 — Scenarios SCN-012→014 · `timingMin: 2`

| Activities | **exercise** · **scenario** · **discussion** |
| Simulator? | **●** TP handoff |

**●** Notes excellent: distribute **Annexe A**; stress analytical mode.

**Suggested demonstration:** Instructor completes SCN-012 once in demo before students start.

---

### M4 — Summary recommendations

| Category | Guidance |
|----------|----------|
| **Suggested pauses** | S1 (empty monitor normalization); S5 before SCN-014 |
| **Suggested demonstrations** | KPI tower; Annexe A grid; one analytical step walkthrough |
| **Expected difficulties** | Empty monitor anxiety; keyword expectations in eval; multi-KPI trade-offs in SCN-014 |
| **Slides needing instructor fix (verbal)** | S2–S3 notes misaligned with slide bodies |
| **Teaching effectiveness** | **B+** after instructor notes correction — analytical arc sound |

---

## Module 5 — Simulation intégrée (Peak Week)

**Institutional duration:** 6 h (Séance 10) · **Slides:** 5 · **Scenarios:** SCN-015→017 · **Pass:** ≥70/100 · **Gold capstone**

### Teaching flow

```
S1 Integrated chain → S2 SCN-015 Day 1 → S3 SCN-016 Day 2 crisis
→ S4 SCN-017 Day 3 strategic → S5 Gold certification
```

**Estimated teaching time:** 10 min nominal · **realistic:** 25–35 min (narrative compact; TP dominates)

### Slide-by-slide audit

#### M5-S1 — End-to-end integrated operation · `timingMin: 2`

| Activities | **demonstration** · **discussion** |
| Simulator? | **◐** Preview full chain diagram |
| Questions? | How M1–M4 combine |

**●** Good integrative recap — quick review of all modules.

---

#### M5-S2 — SCN-015 Complex multi-SKU · Peak Week Day 1 · `timingMin: 2`

| Activities | **scenario** · **exercise** · **demonstration** |
| Simulator? | **●** Annexe B script — SKU-001, 50 u., REC-01→B-01-R1-L1 |

**●** Instructor-ready class script in body.

---

#### M5-S3 — SCN-016 Crisis · Day 2 · `timingMin: 2`

| Activities | **scenario** · **discussion** · **demonstration** |
| Confusion hotspot? | **●** M5_ADJ before KPI — **mandatory gate** |

**●** Notes excellent — debrief ADJ mandatory.

**Suggested demonstration:** Intentional failure — proceed to KPI without ADJ, show block (Guide §11.6).

---

#### M5-S4 — SCN-017 Final audit · Day 3 · `timingMin: 2`

| Activities | **scenario** · **discussion** · **exercise** (written decision) |
| Questions? | Generic answer rejection; ≥2 numeric KPIs |

**●** Strategic capstone well specified; teacher may review justification.

---

#### M5-S5 — Gold certification · `timingMin: 2`

| Activities | **demonstration** · **discussion** · **quiz** (M5 gate) |
| **Issue:** Notes hedge server-side validation — RC15 Gold path operational |

Demo `/student/certifications/gold` 18-gate checklist.

---

### M5 — Summary recommendations

| Category | Guidance |
|----------|----------|
| **Suggested pauses** | S3 after variance discovery cell; S4 before written decision |
| **Suggested demonstrations** | SCN-016 gate failure; Gold page; Quiz M5 |
| **Peak Week narrative** | Maintain Day 1/2/3 framing across séance |
| **Expected difficulties** | SCN-016 sequencing; SCN-017 generic answers; time pressure |
| **Teaching effectiveness** | **A-** — Best instructor notes in programme; TP-heavy design correct |

---

## Simulator integration map (complete)

| Slide | Module | Trigger | Simulator action | Mode | SCN |
|-------|--------|---------|------------------|------|-----|
| S1 | M1 | Platform intro | Login, shell tour | Demo | — |
| S2 | M1 | Flow overview | Mission Control preview | Demo | SCN-001 |
| S3 | M1 | PO concept | PO step form | Demo | SCN-001 |
| S4 | M1 | GR concept | GR post / unposted compare | Demo | SCN-001/002 |
| S5 | M1 | Stock | Monitor stock view | Demo | SCN-001 |
| S6 | M1 | SO | SO creation | Demo | SCN-001 |
| S7 | M1 | GI | Pick/ship flow | Demo | SCN-001 |
| S8 | M1 | CC | Cycle count preview | Demo | SCN-004 preview |
| S9 | M1 | Scenario briefing | Assign TP | **Eval** | SCN-001→005 |
| S10 | M1 | Silver | Certifications page | — | — |
| S1 | M2 | Zones | Warehouse monitor map | Demo | SCN-006 |
| S2–S5 | M2 | Operations | Putaway, capacity, FIFO | Demo | SCN-006–008 |
| S7 | M2 | TP handoff | Student module2 | **Eval** | SCN-006→008 |
| S2–S4 | M3 | Formulas + variance | CC/replenishment preview | Demo | SCN-009–011 |
| S7 | M3 | TP + validation | module3 + teacher validate | **Eval** | SCN-009→011 |
| S1 | M4 | Empty monitor | Show KPI tower, empty TX list | Demo | SCN-012 |
| S2–S5 | M4 | KPI concepts | Analytical step preview | Demo | SCN-012–014 |
| S7 | M4 | TP + Annexe A | module4 | **Eval** | SCN-012→014 |
| S1 | M5 | Integration | Full chain overview | Demo | — |
| S2–S4 | M5 | Peak Week | Sequential capstone | **Eval** | SCN-015→017 |
| S5 | M5 | Gold | Certifications gold + Quiz M5 | **Eval** | — |

### Quiz placement map

| When | Module | Duration | Cert impact |
|------|--------|----------|-------------|
| S1 after M1 slides 1–5 | M1 | 15–20 min | **Silver gate 1** |
| S3 start or homework | M2 | 15 min | None |
| S5 end or homework | M3 | 15 min | None |
| S9 before scenarios | M4 | 15 min | None |
| S10 before SCN-017 | M5 | 15–20 min | **Gold gate 2** |

---

## Slides flagged by audit category

### Too fast (nominal `timingMin` underestimates class need)

| Slide | Nominal | Recommended | Reason |
|-------|---------|-------------|--------|
| M1-S3→S8 | 2 min each | 8–10 min each | Six transactions without breaks |
| M2-S2→S4 | 2 min each | 5–8 min each | Operational detail |
| M3-S2→S3 | 2 min each | 10–15 min combined | Formulas |
| All scenario slides (S9/S7) | 2 min | 15–20 min | Briefing + Q&A |

### Too slow / optional trim

| Slide | Notes |
|-------|-------|
| M2-S6, M3-S6, M4-S6 | Mission Control demo — verify login before class |

### Overload risk

| Block | Risk | Mitigation |
|-------|------|------------|
| M1-S3→S8 | SAP code fatigue | Micro-demo each; one warehouse story thread |
| M3-S2→S3 | Math anxiety | Pre-class formula sheet; worked example |
| M4 analytical trio | Interpretation pressure | Annexe A always visible |

### Need examples

| Slide | Example to add verbally |
|-------|-------------------------|
| M1-S5 | One SKU, two bins, total qty |
| M3-S2 | Numeric ROP with real demand/lead time |
| M3-S3 | 95% vs 99% SS comparison |
| M4-S2 | 2400÷400 on whiteboard |
| M4-S3 | 285/300 and 12/300 interpretation |

### Need warehouse stories

| Slide | Story hook |
|-------|------------|
| M1-S1 | Amazon/Sobeys/Couche-Tard (in notes) |
| M1-S4 | Wrong count → wrong pick → angry customer |
| M2-S5 | Expired food recall |
| M2-S4 | Collapsed overstack |
| M3-S4 | Theft vs. counting error variance |
| M5-S3 | Peak season inventory shock |

### Confusion hotspots

| Slide | Topic | When it surfaces |
|-------|-------|------------------|
| M1-S4 | Unposted GR | SCN-002 |
| M1-S8 | Physical qty vs. delta | SCN-004 |
| M2-S7 / SCN-008 | Autocompleted putaway | SCN-008 first step |
| M3-S4 | ADJ inside CC_RECON | SCN-010 |
| M3-S7 | Teacher validation invisible on slide | Before M4 |
| M4-S1 | Empty monitor | SCN-012 start |
| M4-S2–S3 | Notes/body mismatch | During lecture |
| M5-S3 | ADJ before KPI gate | SCN-016 |

### Instructor pause points

| Slide | Pause purpose |
|-------|---------------|
| M1-S2 | “What breaks if step N fails?” |
| M1-S4 | Posted vs. unposted |
| M1-S8 | System vs. physical |
| M2-S1 | Zone identification quiz |
| M2-S5 | FIFO/FEFO legal implications |
| M3-S2 | ROP calculation together |
| M4-S1 | Empty monitor normalization |
| M4-S5 | Single-KPI trap discussion |
| M5-S3 | Variance gate prediction |

### Instructor question prompts

| Slide | Question |
|-------|----------|
| M1-S2 | “Which step creates legal ownership transfer?” |
| M1-S6 | “Can we ship without SO?” |
| M2-S4 | “What should WMS do at 501st unit?” |
| M3-S5 | “Order now or wait — why?” |
| M4-S5 | “If turnover up but service down, what do you do?” |
| M5-S4 | “Which two KPIs justify your strategic choice?” |

### SAP/WMS demonstration points

| Slide | Transaction / concept |
|-------|----------------------|
| M1-S3 | ME21N / PO |
| M1-S4 | MIGO / GR |
| M1-S5 | MMBE / stock |
| M1-S6 | VA01 / SO |
| M1-S7 | VL02N / GI |
| M1-S8 | MI01 / cycle count |
| M2-S2 | Putaway LT0A |
| M2-S5 | FIFO pick |
| M3-S4 | MI01 + adjustment |
| M3-S2–S3 | ROP / replenishment PO |
| M4-S1–S5 | KPI tower (no TX) |
| M5-S2–S4 | Full M5 pipeline |

---

## Teaching recommendations

### Before first cohort session

1. Rehearse M1-S3→S8 with simulator demo mode — target **45 min** not 12 min.
2. Print or project **Annexe A** (M4) and **Annexe B** (M5) before séances 9–10.
3. Confirm cohort switcher (RC15 Agent 3) — filter monitor by cohort.
4. Prepare Mission Control walkthrough for M2/M3/M4 slide 6 consolidation.
5. Update verbal script for certification slides (QR/badge now live).

### During sessions

1. **Project professor notes** (`notesFr`) — primary instructor script.
2. Never skip **Run Report debrief** (10 min) — slides do not cover this.
3. M3-S6 end: batch **teacher validation** before dismissing class.
4. M4: state “analytical mode” three times — empty monitor, KPI tower, no PO.
5. M5: run **intentional SCN-016 failure** demo once as class.

### Pacing model (per 3 h séance)

| Block | Minutes |
|-------|---------|
| Slides + demos | 50–70 |
| Quiz (if scheduled) | 15–20 |
| Simulator TP | 90–100 |
| Debrief | 10–15 |
| Buffer | 10 |

### Alignment fixes (documentation only — no slide edits in this audit)

| ID | Finding | Instructor workaround |
|----|---------|----------------------|
| PE-01 | `durationH` in `modules.ts`: M1=4, M2=8 vs Guide 6 h each | Follow Guide §4 (6 h/module) |
| PE-02 | M4-S2/S3 notes vs body mismatch | Teach from slide body |
| PE-03 | M1-S10, M5-S5 badge copy lag | Demo live cert page |
| PE-04 | No objectives slides M2–M5 | Verbal objectives 5 min |
| PE-05 | `timingMin` sum 79 min vs 7.5 h slide budget | Expand with demos/discussion |
| PE-06 | M3 teacher validation not on slides | Follow Guide §5.3 at S6 |

---

## Classroom best practices

### Projection setup

- **Primary screen:** SlideViewer `/teacher/slides/{moduleId}` with professor notes visible to instructor only (second monitor or instructor view).
- **Secondary screen:** Student simulator — demo mode for demos, or live monitor during TP.
- **Language toggle:** Match cohort primary language; keep SAP codes visible in both.

### Engagement patterns

| Pattern | When | How |
|---------|------|-----|
| **Think-pair-share** | After M1-S2, M3-S2 | 2 min pairs → debrief |
| **Predictive poll** | Before SCN-002, SCN-007 | “What happens if…?” hand vote |
| **Live error demo** | M5-S3 | Instructor triggers gate failure |
| **Peer Run Report** | End each séance | Student explains one penalty |

### Monitor dashboard usage

During TP, instructor cycles `/teacher/monitor` filtered by cohort:

- Stuck on same step >10 min → OIL Panel F hint
- Repeated compliance failure → pause class, project correct path
- Quiz attempts → verify M1/M5 gates before cert discussion

### Consolidation séances (S7–S8)

No slides — use:

- Silver checklist review
- Rattrapage SCN list from monitor analytics
- Run Report collective analysis
- M4 prerequisite confirmation (`teacherValidated`)

---

## Estimated teaching effectiveness

| Module | Slide clarity | Instructor notes quality | Pacing fit | Simulator alignment | Overall |
|--------|---------------|--------------------------|------------|---------------------|---------|
| M1 | B+ | A- | C+ (too fast block S3–8) | A | **B+** |
| M2 | A- | B+ | B | A- | **B+** |
| M3 | B+ | B | B- (math density) | A- | **B** |
| M4 | A- | B- (notes drift S2–3) | B+ | A | **B+** |
| M5 | A | A | A- | A | **A-** |
| **Programme** | **B+** | **B+** | **B** | **A-** | **B+** |

**Interpretation:** The programme is **teachable and classroom-ready** when instructors use Guide Enseignant pacing, expand transaction slides with live demos, and use TEC.WMS consolidation slides (M2/M3/M4-S6) in Mission Control. Built-in `notesFr`/`notesEn` are the strongest instructor asset. Primary weakness is **nominal timing vs. institutional hours** and **M1 transaction carousel density**.

---

## Readiness for future cohorts

### GO criteria (RC15 + this audit)

| Criterion | Status |
|-----------|--------|
| Simulator operational on Railway | **PASS** (RC15 20/20) |
| Cohort isolation for professor dashboard | **PASS** |
| M3 teacher validation workflow | **PASS** (deadlock fixed) |
| Slide corpus complete (36 slides) | **PASS** |
| Professor notes on every slide | **PASS** |
| Scenario mapping on exercise slides | **PASS** |
| Guide Enseignant session calendar | **PASS** |
| Certification gates documented | **PASS** |

### Pre-cohort checklist (instructor)

| ☐ | Action |
|---|--------|
| ☐ | Create cohort + assign students (RC15 pending operator action) |
| ☐ | Rehearse M1 demo path SCN-001 in demo mode |
| ☐ | Print Annexe A + Annexe B |
| ☐ | Confirm Quiz M1 and M5 accessible |
| ☐ | Plan M3 validation moment at S6 |
| ☐ | Verify Mission Control access for consolidation slides (M2/M3/M4-S6) |
| ☐ | Review M4-S2/S3 from slide body not legacy notes |
| ☐ | Demo Certifications Silver + Gold pages once |

### Recommended instructor onboarding (2 h)

1. Read Guide Enseignant §4–8 (30 min)
2. Walk all 36 slides with professor notes (45 min)
3. Complete one demo run per module in demo mode (45 min)

### Future enhancement opportunities (out of scope — audit notes only)

- Add explicit `objectives` slide per module (M2–M5)
- Reconcile M4-S2/S3 professor notes with slide bodies
- Add `simulation` type markers on handoff slides
- Refresh M1-S10 / M5-S5 certification copy for QR badge
- Align `durationH` in `modules.ts` with institutional 6 h/module
- Increase `timingMin` on M1-S3→S8 to reflect demo-inclusive pacing

---

## Document control

| Field | Value |
|-------|-------|
| **Path** | `docs/pedagogy/PROFESSOR_EXPERIENCE_AUDIT.md` |
| **Mode** | Audit only — no commits, no deploy, no slide redesign |
| **Related audits** | `Documentation/PEDAGOGICAL_ALIGNMENT_AUDIT.md`, `docs/audits/CHECKPOINT_CERTIFICATION_GATING_AUDIT.md`, `docs/releases/RC15_CLASSROOM_READINESS_REPORT.md` |
| **Authority for conflicts** | Guide Enseignant PDF > slide `notesFr` > slide `bodyFr` > this audit |

---

*End of Professor Experience Audit — TEC.WMS RC15*
