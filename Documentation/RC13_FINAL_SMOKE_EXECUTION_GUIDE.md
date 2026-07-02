> **Superseded by RC16** — M4 smoke expectations referencing 75/100 maximum are obsolete. Official institutional policy (RC16): every scenario allows **100/100** perfect execution. Preserved for project history.

# TEC.WMS RC13 — Final Smoke Execution Guide (Railway)

**Programme:** TEC.WMS · TEC.LOG  
**Repository:** `tec-wms-simulator-production`  
**Branch:** `production-hotfix-rc13-pedagogy-class6`  
**Minimum HEAD:** `cb1ca10` or newer  
**Document type:** Manual validation checklist only — no code, no deployment, no implementation  
**Date:** 2026-06-17  
**Objective:** Final production validation for **Class 9** (M4) and **Class 10** (M5)

---

## Scope

| Session | Module | Scenarios | Canonical DB IDs (Railway seed) |
|---------|--------|-----------|----------------------------------|
| **Class 9** | M4 — KPI Control Tower | SCN-012, SCN-013, SCN-014 | 34, 35, 36 |
| **Class 10** | M5 — Integrated Peak Week | SCN-015, SCN-016, SCN-017 | 37, 38, 39 |

**Smoke plans produced by this guide:**

| ID | Name | Scope |
|----|------|-------|
| **S-10** | M4 Smoke Plan | SCN-012 → SCN-014 (eval mode, full pipeline) |
| **S-11** | M5 Smoke Plan | SCN-015 → SCN-017 (eval mode, full pipeline + gates) |

---

## Validation Dimensions (All Scenarios)

Each scenario checklist below verifies these nine dimensions:

1. **Exact teacher steps** — instructor slide arc + monitor actions  
2. **Exact student steps** — ordered step pipeline with field-level inputs  
3. **Required accounts** — roles and credentials to use  
4. **Expected scoring** — total score and pass threshold  
5. **Expected compliance** — runtime and final compliance gate  
6. **Expected completion state** — run status, progress, next step  
7. **Expected report state** — Run Report sections and values  
8. **Expected OIL state** — Operational Intelligence Layer panels  
9. **Expected KPI Tower state** — M4 Panel B only (N/A for M5)

---

## Pre-Smoke Gate (Operator — Verify Before S-10 / S-11)

Stop if any item fails. Record blocker ID and URL.

- [ ] Target URL loads (`/` and `/login` without JS console errors)
- [ ] Branch deployed is `production-hotfix-rc13-pedagogy-class6` at HEAD `cb1ca10` or newer
- [ ] Database seeded — console or seed log confirms SCN-012–014 at IDs **34–36** and SCN-015–017 at IDs **37–39**
- [ ] Student account exists and can log in (local auth)
- [ ] Teacher account exists and can open `/teacher/monitor`
- [ ] `ENABLE_M4_COMPLIANCE_VALIDATOR` is not explicitly `false`
- [ ] `ENABLE_M5_COMPLIANCE_VALIDATOR` is not explicitly `false`
- [ ] Fresh eval run per scenario (do not reuse demo runs for certification checks)

**Known display caveat (non-blocking):** M4 perfect runs cap at **75/100**; Run Report step percentages for KPI_ROTATION/KPI_SERVICE may show 75% on a perfect run. M5 Run Report M5_DECISION step percentage may show 100% when raw strategic score is ≥30/80. Total scores and certification gates are unaffected.

---

## Required Accounts

| Role | Purpose | Default bootstrap (Railway) | Notes |
|------|---------|-------------------------------|-------|
| **Student (smoke)** | Execute S-10 and S-11 eval runs | e.g. `alice.martin@teclog.ca` / test password | Must use **Evaluation** mode (`isDemo: false`) |
| **Student (fresh)** | Optional second account for certification card checks | Self-register with access code `TECLOG2025` (or env override) | Used if verifying Silver/Gold LOCKED state |
| **Teacher** | Monitor runs, open Mission Sheet, debrief | e.g. `prof@teclog.ca` | `/teacher`, `/teacher/monitor` |
| **Admin** | Optional — user roster, env confirmation | e.g. `admin@teclog.ca` | Not required for scenario smoke |

Record actual credentials used in the smoke log. Do not commit passwords to the repository.

---

## Shared Canonical KPI Seed (M4 + M5 reference)

All six scenarios share this analytical baseline (Annexe A):

| KPI | Value | Band |
|-----|-------|------|
| Rotation | 6× (2 400 ÷ 400) | Normal (4–12×) |
| Service (OTIF) | 95% (285/300) | Excellent (≥95%) |
| Error rate | 4% (12/300) | Acceptable (1–5%) |
| Lead time | 3,5 days | Normal (3–7 days) |
| Stock value | $48 000 | — |

M5 operational contract (SCN-015–017): **SKU-001 · 50 u. · PO-M5-001 · REC-01 → B-01-R1-L1 · LOT-M5-A**

---

# S-10 — M4 Smoke Plan (Class 9)

**Module route:** `/student/module4`  
**Mode:** Evaluation only  
**Step pipeline (all three scenarios):**  
`KPI_DATA → KPI_ROTATION → KPI_SERVICE → KPI_DIAGNOSTIC → COMPLIANCE_M4`  
**Pass threshold:** ≥ **70/100** per scenario  
**Perfect eval ceiling:** **75/100** (not 100/100)

---

## S-10-A — SCN-012 · Normal Rotation / Complacency Trap

**Canonical ID:** 34 · **Route:** `/student/module4/scenario/34/mode` (or SCN-012 listing)

### Teacher steps (exact)

- [ ] Present M4 Slide 1 — KPI dashboard overview; stress **empty monitor = normal in M4**
- [ ] Present M4 Slide 2 — rotation formula 2 400÷400=6× → **normal band**; map to SCN-012
- [ ] Distribute **Annexe A KPI grid** (OIL Panel D collapsible or printed Guide Maître)
- [ ] Before students start: confirm eval mode; remind that COMPLIANCE_M4 validates **interpretations**, not M1 inventory
- [ ] During run: open `/teacher/monitor` → select student run → verify Mission Control loads
- [ ] Debrief: expected stance is **maintain + SKU monitoring**, not blanket destock at 6×

### Student steps (exact)

- [ ] Log in as student → `/student/module4` → select **SCN-012** → choose **Évaluation**
- [ ] Open **Fiche Mission** (Mission Sheet) — confirm CFO Q3 / $48k capital / 6× normal context
- [ ] **KPI_DATA:** Open KPI control tower; review Annexe A values; submit/consult step to complete
- [ ] **KPI_ROTATION:** Enter interpretation containing **normal** / **équilibr** / **6×** (must NOT say surstock)
- [ ] **KPI_SERVICE:** Enter interpretation acknowledging **service excellent** (≥95%)
- [ ] **KPI_DIAGNOSTIC:** Enter ≥50 chars with **recommand** vocabulary; include **maintien/surveillance SKU/politique**; avoid blanket destock
- [ ] **COMPLIANCE_M4:** Submit final compliance when prior four KPI steps show complete

**Reference happy-path diagnostic (minimum content):**  
Maintain current stock policy with SKU-level monitoring; monthly review of $48k tied capital; no global destock.

### Expected scoring

- [ ] KPI_DATA completed: **+10**
- [ ] KPI_ROTATION correct (normal @ 6×): **+15**
- [ ] KPI_SERVICE correct (excellent): **+15**
- [ ] KPI_DIAGNOSTIC with recommendation: **+20**
- [ ] COMPLIANCE_M4 accepted: **+15**
- [ ] **Total: 75/100** (pass ≥70) — cannot reach 100/100

### Expected compliance

- [ ] **Runtime OIL badge:** green — no physical transactions; `checkCompliance` returns compliant (no unposted TX, no negative stock, no open variance)
- [ ] **COMPLIANCE_M4 gate:** accepts maintain/monitor/SKU policy; **rejects** surstock classification at 6× and complacency without action
- [ ] Negative control (optional): surstock answer at rotation step → compliance **blocked**

### Expected completion state

- [ ] `run.status` = **completed**
- [ ] `progressPct` = **100%**
- [ ] `completedSteps` = all 5 M4 steps including **COMPLIANCE_M4**
- [ ] `nextStep` = **null**

### Expected report state

- [ ] Run Report opens from Mission Control
- [ ] `kpiInterpretations` section populated (rotation, service, diagnostic)
- [ ] Total score shows **75** (or ≥70 if partial KPI deductions)
- [ ] No physical transaction trail (analytical scenario)

### Expected OIL state

- [ ] Panel A situation: CFO Q3 review @ 6× normal
- [ ] Panel B KPI Tower: see **KPI Tower** section below
- [ ] `emptyStockNote` visible: **no physical stock — KPI-only scenario**
- [ ] Transaction monitor hint: **no transactions expected**
- [ ] Compliance hint: COMPLIANCE_M4 validates coherent interpretations

### Expected KPI Tower state (Panel B)

- [ ] KPI evaluated: **Inventory Turnover**
- [ ] Target: classify 4–12× band; recommend stock policy
- [ ] Diagnostic focus: **6× = normal band — capital judgment vs SKU monitoring**
- [ ] Alert risk: misclassifying overstock @ 6×; complacency without SKU monitoring
- [ ] Expected output: stock policy + SKU monitoring

### S-10-A pass criteria

- [ ] All nine dimensions verified  
- [ ] Record run ID, final score, timestamp, tester initials

---

## S-10-B — SCN-013 · Green Dashboard Trap

**Canonical ID:** 35 · **Route:** `/student/module4/scenario/35/mode`

### Teacher steps (exact)

- [ ] Present M4 Slide 3 — service 95% excellent + errors 4% acceptable; picking/réception correlation → SCN-013
- [ ] Stress **green dashboard trap** — excellence at threshold masks OTIF fragility if errors untreated
- [ ] Remind students: do **not** diagnose weak service; do **not** propose destock as primary lever
- [ ] Monitor via `/teacher/monitor`; debrief J-90 SLA renewal framing

### Student steps (exact)

- [ ] Select **SCN-013** → **Évaluation** → confirm Mission Sheet (SLA J-90, 95%+4%)
- [ ] **KPI_DATA:** Review KPI tower (service + error focus)
- [ ] **KPI_ROTATION:** Context answer (normal band acceptable)
- [ ] **KPI_SERVICE:** Acknowledge **excellent** service @ 95% (must not treat as weak)
- [ ] **KPI_DIAGNOSTIC:** Link **picking/réception/prélèvement** errors to **OTIF** risk; include **measurable plan** (% target or **90 jours** / **hebdomadaire**)
- [ ] **COMPLIANCE_M4:** Submit when diagnostic passes validator

**Reference happy-path diagnostic (minimum content):**  
Excellent service at threshold; picking/receiving errors at 4% threaten OTIF; recommend training program to reduce to 2% in 90 days with weekly indicator follow-up.

### Expected scoring

- [ ] Same M4 budget as SCN-012 → **75/100** maximum on perfect eval run
- [ ] Pass threshold ≥ **70/100**

### Expected compliance

- [ ] Runtime OIL badge: **green** (analytical — no stock movements)
- [ ] COMPLIANCE_M4 requires: excellent acknowledgment; error↔picking/réception/OTIF link; measurable 90-day plan; **blocks** destock-as-primary-lever

### Expected completion state

- [ ] `run.status` = **completed** · `progressPct` = **100%** · all 5 steps complete

### Expected report state

- [ ] Run Report shows KPI interpretations with service/error emphasis
- [ ] Total score ≥ **70**

### Expected OIL state

- [ ] Situation: J-90 SLA renewal — green dashboard @ 95% + 4% errors
- [ ] Operational problem: green dashboard trap — where to invest training budget
- [ ] Compliance hint: diagnosis must link picking/receiving errors + measurable target
- [ ] Learning takeaway: 95% excellent masks OTIF fragility if errors untreated

### Expected KPI Tower state (Panel B)

- [ ] KPI evaluated: **Service Level & Operational Error Rate**
- [ ] Target: 95% excellent · 4% acceptable — J-90 training budget arbitration
- [ ] Diagnostic focus: correlate picking/receiving errors with OTIF drift despite excellent headline
- [ ] Alert risk: green dashboard trap; destock as wrong lever
- [ ] Expected output: picking/receiving execution program + numeric target

### S-10-B pass criteria

- [ ] All nine dimensions verified  
- [ ] Record run ID, final score, timestamp, tester initials

---

## S-10-C — SCN-014 · S&OP Multi-KPI Capstone

**Canonical ID:** 36 · **Route:** `/student/module4/scenario/36/mode`

### Teacher steps (exact)

- [ ] Present M4 Slides 5–7 — root cause → multi-KPI synthesis; Slide 7 maps all three M4 scenarios
- [ ] Frame S&OP board: CFO / Ventes / Ops — **one funded initiative**
- [ ] Integrate SCN-012 capital lens + SCN-013 execution lens
- [ ] Debrief: mono-KPI answers fail; trade-off language required

### Student steps (exact)

- [ ] Select **SCN-014** → **Évaluation** → confirm capstone Mission Sheet
- [ ] **KPI_DATA → KPI_ROTATION → KPI_SERVICE:** Complete with correct band classifications
- [ ] **KPI_DIAGNOSTIC:** Board-ready paragraph **≥150 chars** citing **≥3 KPI domains** (rotation, service, erreurs, **délai/lead time 3,5**); include **trade-off/arbitrage** vocabulary; one funded initiative + 90-day follow-up KPIs
- [ ] **COMPLIANCE_M4:** Submit final compliance

**Reference happy-path diagnostic (minimum content):**  
Normal rotation 6×, excellent service 95%, acceptable errors 4%, lead time 3.5 days; recommend execution quality program; explicit trade-off deferring destock to protect service and capital; 90-day KPI follow-up across rotation, service, errors, lead time.

### Expected scoring

- [ ] Perfect eval maximum **75/100** · pass ≥ **70/100**

### Expected compliance

- [ ] Runtime OIL badge: **green**
- [ ] COMPLIANCE_M4: **≥3 KPI domains** in diagnostic; trade-off language; **≥150 chars**; lead time mention when ≥3 domains; **rejects** mono-KPI capstone

### Expected completion state

- [ ] `run.status` = **completed** · `progressPct` = **100%** · all 5 steps complete

### Expected report state

- [ ] Run Report shows full KPI interpretation chain + capstone diagnostic
- [ ] Total score ≥ **70**

### Expected OIL state

- [ ] Situation: monthly S&OP — one funded initiative
- [ ] Evidence: rotation + service + errors + 3.5-day lead time combined
- [ ] Eval mode: process guidance only — full decision scaffold **not** shown (demo-gated)
- [ ] Learning takeaway: logistics leadership balances measurable trade-offs

### Expected KPI Tower state (Panel B)

- [ ] KPI evaluated: **Multi-KPI diagnosis** (rotation + service + errors + lead time)
- [ ] Target: S&OP — one funded initiative; integrates 012 capital + 013 execution lenses
- [ ] Diagnostic focus: CFO/Sales/Ops arbitration — lever, trade-off, 90-day follow-up KPIs
- [ ] Alert risk: single-KPI decision; board paragraph without explicit trade-off

### S-10-C pass criteria

- [ ] All nine dimensions verified  
- [ ] Record run ID, final score, timestamp, tester initials

---

## S-10 Summary Sign-Off

| Scenario | DB ID | Run ID | Score | Progress | Compliance | Pass? |
|----------|-------|--------|-------|----------|------------|-------|
| SCN-012 | 34 | | /100 | % | ☐ Green | ☐ |
| SCN-013 | 35 | | /100 | % | ☐ Green | ☐ |
| SCN-014 | 36 | | /100 | % | ☐ Green | ☐ |

**S-10 overall:** ☐ **PASS** (3/3 scenarios green) · ☐ **FAIL** (stop — log blocker)

**Tester:** _______________ **Date:** _______________ **Environment URL:** _______________

---

# S-11 — M5 Smoke Plan (Class 10)

**Module route:** `/student/module5`  
**Mode:** Evaluation only  
**Pass threshold:** ≥ **70/100** per scenario  
**Perfect eval ceiling:** **100/100** (score clamped 0–100)

**Base step sequence:**  
`M5_RECEPTION → M5_PUTAWAY → M5_CYCLE_COUNT → M5_REPLENISH → M5_KPI → M5_DECISION → COMPLIANCE_M5`

**SCN-016 adds:** `M5_ADJ` after cycle count (8 steps total)

---

## S-11-A — SCN-015 · Nominal Integrated (Peak Week Day 1)

**Canonical ID:** 37 · **Profile:** NOMINAL_INTEGRATED · **Decision level:** TACTICAL

### Teacher steps (exact)

- [ ] Present M5 Slide 1 — end-to-end chain; M1–M4 integration map
- [ ] Present M5 Slide 2 — SCN-015 GREEN; distribute **Annexe B ops script**
- [ ] Script class: SKU-001 · 50 u. · REC-01 → B-01-R1-L1
- [ ] Remind: M5_KPI values derived from monitor — student must **confirm from ledger** in eval
- [ ] Monitor transactions appearing step-by-step in `/teacher/monitor`

### Student steps (exact)

- [ ] Select **SCN-015** → **Évaluation**
- [ ] **M5_RECEPTION:** SKU-001 · qty **50** · doc ref **PO-M5-001**
- [ ] **M5_PUTAWAY:** from **REC-01** → **B-01-R1-L1** · qty **50** · lot **LOT-M5-A**
- [ ] **M5_CYCLE_COUNT:** bin **B-01-R1-L1** · variance **0** (system 50 / counted 50)
- [ ] **M5_REPLENISH:** accept suggestion · studentQty **0** (no replenishment needed)
- [ ] **M5_KPI:** open ledger anchor panel → confirm derived values · check **confirmedFromLedger**
- [ ] **M5_DECISION:** tactical decision with operational keywords (rotation, service, erreur, réapprovisionnement, etc.) — not rejected
- [ ] **COMPLIANCE_M5:** submit final compliance

### Expected scoring

- [ ] Perfect eval run: **100/100** (clamped)
- [ ] Pass threshold ≥ **70/100**
- [ ] M5_DECISION tactical rubric: up to 80 raw pts (included in total)

### Expected compliance

- [ ] Runtime: no negative stock; no unposted critical transactions; no open variance
- [ ] COMPLIANCE_M5: all 7 effective steps complete; KPI snapshot present; **success: true**

### Expected completion state

- [ ] **7 steps** — no **M5_ADJ** in step list
- [ ] `run.status` = **completed** · `progressPct` = **100%** · `nextStep` = **null**

### Expected report state

- [ ] Run Report shows full ops chain: reception → putaway → CC → replenish → KPI → decision
- [ ] KPI snapshot section with rotation/service/errors from run ledger
- [ ] Total score **≥70** (reference perfect: **100**)
- [ ] Note: M5_DECISION per-step % may show 100% when raw ≥30 — total score still correct

### Expected OIL state

- [ ] Situation: Peak Week Day 1 — nominal cycle SKU-001 · 50 u.
- [ ] `emptyStockNote`: stock empty at start until M5_RECEPTION posts
- [ ] Transaction monitor: each POSTED step visible as evidence builds
- [ ] Compliance hint: COMPLIANCE_M5 after complete cycle

### Expected KPI Tower state

- [ ] **N/A** — KPI Tower is M4-only; M5 uses **M5_KPI ledger anchor panel** instead
- [ ] Ledger anchor shows: received=50, putaway=50, stock=50, source=**run_ledger**

### S-11-A pass criteria

- [ ] All nine dimensions verified (KPI Tower marked N/A with ledger anchor checked)  
- [ ] Record run ID, final score, timestamp, tester initials

---

## S-11-B — SCN-016 · Exception Variance (Peak Week Day 2)

**Canonical ID:** 38 · **Profile:** EXCEPTION_VARIANCE · **Decision level:** TACTICAL

### Teacher steps (exact)

- [ ] Present M5 Slide 3 — SCN-016 GREEN; variance **−5 u. @ B-01-R1-L1**
- [ ] Explain **M5_ADJ (MI07)** required before REPLENISH / KPI / DECISION
- [ ] Debrief Peak Week Day 2: ADJ mandatory before continuing
- [ ] Optional negative demo: attempt replenish before ADJ → show server block message

### Student steps (exact)

- [ ] Select **SCN-016** → **Évaluation**
- [ ] **M5_RECEPTION** + **M5_PUTAWAY:** same contract as SCN-015
- [ ] **M5_CYCLE_COUNT:** bin B-01-R1-L1 — expect injected variance **−5** (system **50** / physical **45**)
- [ ] Confirm **8 steps** appear including **M5_ADJ**
- [ ] **Negative gate check:** attempt M5_REPLENISH or M5_KPI **before** ADJ → must fail with M5_ADJ / unresolved variance message
- [ ] **M5_ADJ:** variance **−5** · bin B-01-R1-L1 · justification ≥10 chars (e.g. physical count confirmed — MI07 adjustment required before KPI)
- [ ] **M5_REPLENISH → M5_KPI** (ledger confirmed) → **M5_DECISION** (tactical) → **COMPLIANCE_M5**

### Expected scoring

- [ ] M5_CYCLE_COUNT with non-zero variance: **10** pts (not 15)
- [ ] M5_ADJ: **10** pts
- [ ] Perfect eval run: **100/100** · pass ≥ **70/100**

### Expected compliance

- [ ] Runtime: variance unresolved blocks replenish/KPI/decision
- [ ] After ADJ: stock at B-01-R1-L1 = **45**; ADJ transaction POSTED
- [ ] COMPLIANCE_M5: blocks if M5_ADJ missing or variance open
- [ ] **Gold-path note:** SCN-016 ADJ must complete **before** M5_KPI on latest run (`scn-016-seq` on Certifications page)

### Expected completion state

- [ ] **8 steps** including **M5_ADJ** and **COMPLIANCE_M5**
- [ ] `run.status` = **completed** · `progressPct` = **100%**

### Expected report state

- [ ] Run Report shows variance trail at cycle count
- [ ] ADJ section present (docType ADJ, qty −5)
- [ ] KPI snapshot reflects post-ADJ stock (**45** at bin)
- [ ] Total score ≥ **70**

### Expected OIL state

- [ ] Situation: Peak Week Day 2 — injected −5 u. variance
- [ ] Evidence: variance at M5_CYCLE_COUNT — M5_ADJ required before replenish/KPI
- [ ] OIL variance pastille: **amber** at CC step (visual check recommended; server contract is authoritative)
- [ ] Annexe B rubric shows M5_ADJ step (SCN-016 only)
- [ ] Compliance hint: do not close with open variance

### Expected KPI Tower state

- [ ] **N/A** (M5) — verify **kpiLedger** post-ADJ shows stockQtyAtBin=**45**

### S-11-B pass criteria

- [ ] All nine dimensions verified  
- [ ] Negative gate (replenish/KPI before ADJ) confirmed blocked  
- [ ] Record run ID, final score, timestamp, tester initials

---

## S-11-C — SCN-017 · Strategic Capstone (Peak Week Day 3)

**Canonical ID:** 39 · **Profile:** STRATEGIC_CAPSTONE · **Decision level:** STRATEGIC

### Teacher steps (exact)

- [ ] Present M5 Slide 4 — SCN-017 GREEN; snapshot required; ≥2 numeric KPI citations
- [ ] Present M5 Slide 5 — Gold unlock via SCN-017 capstone (flag-dependent for auto-award)
- [ ] Stress eval mode: requirements summary only — **no full decision scaffold** (demo-gated)
- [ ] Debrief: generic answers rejected; strategic rubric requires trade-off + 90–180 j horizon

### Student steps (exact)

- [ ] Select **SCN-017** → **Évaluation**
- [ ] Complete ops chain: **M5_RECEPTION → M5_PUTAWAY → M5_CYCLE_COUNT (variance 0) → M5_REPLENISH**
- [ ] **Gate check:** attempt **M5_DECISION before M5_KPI** → must reject (*KPI snapshot required*)
- [ ] **M5_KPI:** submit with ledger-derived values + **confirmedFromLedger**
- [ ] **Gate check:** submit **generic** decision (keywords only, no numeric KPIs) → must reject (*citez au moins 2 KPI chiffrés*)
- [ ] **M5_DECISION:** strategic answer citing **≥2 numeric KPIs** from snapshot (rotation, service %, errors %, stock value) + explicit **trade-off** + **recommendation** + horizon **90–180 jours**
- [ ] **COMPLIANCE_M5:** submit — blocked if decision was rejected

**Reference strategic decision pattern:**  
Cite snapshot values (e.g. rotation 6×, service 95%, errors 4%, stock $48 000); arbitrate capital vs execution; recommend 90-day quality initiative with explicit trade-off.

### Expected scoring

- [ ] Strategic decision accepted: up to **80** raw pts on M5_DECISION
- [ ] Perfect eval run: **100/100** total · pass ≥ **70/100**
- [ ] SCN-017 Gold capstone gate: latest completed run score ≥ **70** + KPI decision linkage

### Expected compliance

- [ ] `decisionRejected` = false required for COMPLIANCE_M5
- [ ] Cannot complete scenario with rejected strategic decision even if ops chain is done

### Expected completion state

- [ ] **7 steps** (no M5_ADJ) · all complete including COMPLIANCE_M5
- [ ] `run.status` = **completed** · `progressPct` = **100%**

### Expected report state

- [ ] Run Report shows KPI snapshot + strategic decision section
- [ ] Decision score visible (reference: **80** on accepted capstone answer)
- [ ] Total score ≥ **70** (reference perfect: **100**)
- [ ] M5_DECISION step % may read 100% despite 80/80 raw — note for student briefing

### Expected OIL state

- [ ] Situation: Peak Week Day 3 — decision capstone with KPI snapshot
- [ ] Expected action hint: Phase 1 ops → Phase 2 M5_KPI → Phase 3 M5_DECISION
- [ ] Eval mode shows requirements only (no verbatim scaffold)
- [ ] Learning takeaway: Gold certification requires synthesis and justification

### Expected KPI Tower state

- [ ] **N/A** (M5) — verify snapshot row persisted and decision references snapshot KPIs

### S-11-C pass criteria

- [ ] All nine dimensions verified  
- [ ] Both negative gates confirmed (decision before KPI; generic decision after KPI)  
- [ ] Record run ID, decision score, total score, timestamp, tester initials

---

## S-11 Summary Sign-Off

| Scenario | DB ID | Run ID | Score | Steps | Variance/ADJ | Compliance | Pass? |
|----------|-------|--------|-------|-------|--------------|------------|-------|
| SCN-015 | 37 | | /100 | 7 | N/A | ☐ Green | ☐ |
| SCN-016 | 38 | | /100 | 8 | ☐ −5 + ADJ | ☐ Green | ☐ |
| SCN-017 | 39 | | /100 | 7 | N/A | ☐ Green | ☐ |

**S-11 overall:** ☐ **PASS** (3/3 scenarios green + SCN-016/017 gates verified) · ☐ **FAIL**

**Tester:** _______________ **Date:** _______________ **Environment URL:** _______________

---

## Certification Cross-Check (Optional — Same Session)

Execute after S-10/S-11 if validating Gold-path readiness on the same student account.

- [ ] Navigate to `/student/certifications`
- [ ] Silver card loads without error (may show LOCKED for smoke-only student)
- [ ] Gold card loads without error
- [ ] After completing all six scenarios at ≥70: Gold status moves toward **IN_PROGRESS** / **ELIGIBLE** (not AWARDED unless `ENABLE_GOLD_UNLOCK=true`)
- [ ] Certifications page shows SCN-016 sequence requirement (`scn-016-seq`) when SCN-016 completed out of order
- [ ] Certifications page shows SCN-017 capstone rows (`scn017CapstoneScore`, decision linked)

---

## Blocker Log Template

| ID | Smoke step | Scenario | Symptom | Severity | Action |
|----|------------|----------|---------|----------|--------|
| | S-10-/S-11- | SCN-0xx | | P0/P1/P2 | |

**P0 examples:** scenario missing from hub; compliance mutation returns 500; M5 endpoints NOT_FOUND; wrong DB IDs; eval run cannot start.

---

## Final Release Recommendation Matrix

| Gate | Class 9 (S-10) | Class 10 (S-11) |
|------|----------------|-----------------|
| 3/3 scenarios PASS | Required | Required |
| Teacher monitor verified | Recommended | Recommended |
| Certification cross-check | Optional | Recommended (Gold gates) |
| `ENABLE_GOLD_UNLOCK=true` | Not required for class | Required only for auto-award |

**Conditional GO for Class 9:** S-10 green on the platform students will use, teacher-supervised session acceptable if one scenario yellow with documented workaround.

**Conditional GO for Class 10:** S-11 green including SCN-016 ADJ gate and SCN-017 strategic gates; confirm M5 runtime endpoints respond on target URL before class day.

---

## Evidence Index

| Artifact | Use |
|----------|-----|
| `Documentation/RC13_M4_VALIDATION_REPORT.md` | M4 static audit baseline |
| `Documentation/RC13_M5_VALIDATION_REPORT.md` | M5 static audit baseline |
| `MANUAL_SMOKE_WAVE4.md` | Local Wave 4 procedure (V4-M1–M7) |
| `.manus-logs/wave4-b01-rerun.json` | Reference eval run scores (local) |
| `PHASE_D_RAILWAY_STAGING_EXECUTION_PLAN.md` | S-01–S-16 staging context |
| `Documentation/RC13_RELEASE_READINESS_REPORT.md` | Class 9/10 scope mapping |

---

*RC13 Final Smoke Execution Guide — checklist only. No code changes. No deployment actions.*
