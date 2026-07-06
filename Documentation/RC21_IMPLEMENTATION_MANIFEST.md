# RC21 Implementation Manifest

**Document type:** Engineering Execution Plan — Governance-to-Implementation Bridge  
**Programme:** TEC.LOG — TEC.WMS  
**Institution:** Collège de la Concorde — Montréal  
**Release gate:** RC21-C.1  
**Version:** 1.0  
**Effective date:** 2026-07-06  
**Status:** LAST GOVERNANCE DOCUMENT BEFORE IMPLEMENTATION

---

## 1. Purpose

Governance is complete.

The RC21 programme has passed its constitutional, architectural, operational-contract, and content-audit gates. The following artifacts are **approved and frozen** as inputs to engineering:

| Artifact | Role |
|----------|------|
| Architecture Foundation v1.0 | Experience Manifesto · Universe · Process Mapping — frozen (DR-002) |
| TEC Enterprise Platform Charter | Platform governance, release philosophy, certification integrity |
| Living Company Blueprint | Aliveness litmus, situated enterprise narrative |
| Enterprise Experience Standard | Manifesto v1.0 — ten mission questions, Fiche Mission schema, BRIDGE |
| Enterprise Operational Contract Standard v1.0 | EOC schema, invariants, EOAS read-path boundaries |
| RC21-C.2 Operational Audit | SCN-001→017 zero-invention audit, P0–P3 correction matrix |
| RC20-A | Concorde Connect, Employee Profile, Mission Lifecycle (BRIEFING → LIVE → CLOSURE) |
| RC21-B | EOAS — Today's Priorities, Assignment Queue, Morning Briefing, Department Home |
| EOAS Architecture | Presentation subsystem consuming EOC (Standard §I.3) |
| Mission Lifecycle | Phase resolution from run state only — no engine mutation |

From this point forward the project transitions from:

```
Design
  ↓
Engineering
```

**This document translates approved governance into executable engineering work.**

It is **not** another constitutional document. It is **not** another architecture document. It is the engineering bridge between governance and implementation. After approval of this manifest, **RC21-C.1A implementation begins**.

---

## 2. Implementation Principles

The following principles are **immutable** for all RC21-C.1A work. Violation blocks merge.

| # | Principle | Authority |
|---|-----------|-----------|
| P1 | **No engine modifications** | Simulation engine steps, validators, seed contracts remain frozen |
| P2 | **No scoring modifications** | Points, scoring economics, keyword/semantic paths unchanged |
| P3 | **No compliance modifications** | Pass/fail gates, step validators, M5 eval gates unchanged |
| P4 | **No database changes** | Schema, migrations, persistence models untouched |
| P5 | **Experience Layer only** | Presentation, copy, layout, read-path helpers — L3 only |
| P6 | **Mission is the operational contract** | Every surface resolves identity through EOC + briefing enrichment |
| P7 | **Enterprise before simulator** | Mission title, department, supervisor, priority precede SCN and t-codes |
| P8 | **Student never invents operational data** | All transaction-required fields must appear in briefing before form entry |
| P9 | **AI never replaces professional judgment** | Mentor remains dry-run (DR-006); no live LLM in RC21-C.1A |
| P10 | **Reuse, do not duplicate** | One header band, one hero block, one title resolver, one terminology lane |
| P11 | **EOAS consumes EOC — never invents** | Department, priority, supervisor from universe binding only |
| P12 | **Certification integrity preserved** | No experience feature alters Silver/Gold eligibility or checkpoint paths |

---

## 3. Approved Implementation Scope

The definitive RC21-C.1A implementation checklist. Each item is **approved for engineering execution**.

### 3.1 Mission identity and hierarchy

- [ ] **Hero Mission Block** — single shared `MissionHeroBlock` (extract from Mission Sheet + Morning Briefing)
- [ ] **Single Mission Identity** — canonical title via `resolvePageMissionTitle` / `resolveMissionTitle`
- [ ] **Remove duplicated Mission headers** — max one mission title hero per viewport
- [ ] **Single Mission Hero** — mission title = primary H1; SCN = `text-[10px] font-mono` metadata only
- [ ] **Mission hierarchy L0→L4** — FioriShell (page function) → EnterpriseHeader (one per route) → Mission hero → Operational panels → Execution/cockpit
- [ ] **SCN visibility rules** — SCN in EnterpriseHeader only; never duplicated in body when header present
- [ ] **Terminology lane** — `enterpriseTerminology.ts`: « Affectation » when EOAS ON, « Mission » when legacy

### 3.2 Operational contract presentation

- [ ] **Operational Contract panel** — EOC fields surfaced in briefing: department, priority, supervisor, business unit, stakeholders, geography, incident
- [ ] **Enterprise Operational Data panel** — technical execution reference (SKU, qty, lot, bins, doc refs) in Mission Sheet « Référence d'exécution »
- [ ] **Mission Sheet `suppressHeader`** — hide duplicate EnterpriseHeader when opened from Mission Control
- [ ] **Employee identity contract** — practicant framing from EOC; no ad hoc UI state for department/supervisor

### 3.3 EOAS refinements (RC21-B consumption)

- [ ] **EOAS title-primary cards** — mission title H4 + SCN mono footer (audit confirm; modify only if regression)
- [ ] **Today's Priorities** — CurrentAssignmentCard hides redundant inline assignment when active (EOC-PRS-03)
- [ ] **Assignment Queue** — department and priority grouping respect EOC sort orders (EOC-CON-01, EOC-CON-02)
- [ ] **Department Home alignment** — header mission title via resolver; department accent vars (EOC-PRS-04)
- [ ] **CompletedMissionsList hierarchy** — mission title bold, SCN secondary (mirror CurrentAssignmentCard)

### 3.4 Mission lifecycle (RC20-A.3)

- [ ] **MissionLifecycleHub** — single « Fiche de mission » CTA when lifecycle ON (dedupe command bar CTA)
- [ ] **MissionLifecycleSheetBanner** — phase chrome only; mission content unchanged
- [ ] **Phase resolution** — `resolveMissionLifecyclePhase` from run status + completed steps only

### 3.5 Page-level standardization

- [ ] **Mission Control** — FioriShell title: `COCKPIT OPÉRATIONNEL — {missionTitle}`; session bar mission title + SCN mono
- [ ] **Morning Briefing** — adopt MissionHeroBlock; dedupe header/hero; flag-off safe
- [ ] **Mode Selection** — mission title header replaces scenario name primary
- [ ] **Module lists M2–M5** — MissionBoard delegation with assignment presentation when enterprise enabled
- [ ] **ScenarioList** — EOAS terminology « File d'affectations » when assignments enabled
- [ ] **StepForm** — breadcrumb mission title + step label; compact context line (no full EnterpriseHeader)
- [ ] **Run Report** — breadcrumb + outcome header with canonical mission title
- [ ] **Employee Profile** — assignmentPresentation prop; breadcrumb to Connect
- [ ] **Concorde Connect** — audit header binding; no duplicate SCN in header + CurrentAssignmentCard

### 3.6 Information prioritization

- [ ] **One EnterpriseHeader per route** — never two on same viewport
- [ ] **No duplicate supervisor CharacterCard** — hero supervisor OR sheet supervisor, not both visible redundantly
- [ ] **No duplicate situation/mission panels** — briefing content appears once per surface
- [ ] **Execution reference collapsed in Evaluation** — Manifesto §3.3 preserved
- [ ] **OIL references briefing** — cockpit intelligence does not restate mission title as primary

### 3.7 P0 operational corrections (RC21-C.2 — blocks implementation)

- [ ] **SCN-006** — surface LOT-2025-001 in mission sheet, briefing, cockpit pedagogy
- [ ] **SCN-003** — replace « ex. 80 » / « ex. +30 » with binding quantities; name putaway bin B-01-R1-L2
- [ ] **SCN-015** — publish full m5Contract in briefing: PO-M5-001, LOT-M5-A, replenish min/max/SS
- [ ] **SCN-016** — same M5 contract surfacing as SCN-015
- [ ] **SCN-017** — remove static KPI values from technicalSpecs; point to M5_KPI snapshot panel; fix stock-value narrative

### 3.8 P1 corrections

- [ ] **SCN-001** — outbound contract: SO qty, GI qty, EXP bin, suggested docRef pattern
- [ ] **SCN-002** — post-GR ship contract (SO ref + qty)
- [ ] **SCN-003** — destination STOCKAGE bin specification (with P0 qty binding)
- [ ] **SCN-006** — destination STOCKAGE bin if zone-only insufficient
- [ ] **SCN-007** — surface LOT-2025-002 in briefing

### 3.9 P2 corrections

- [ ] **SCN-009** — rebind INC-008 to inventory-variance incident (INC-003)
- [ ] **SCN-010** — rebind INC-009 to variance-aligned incident
- [ ] **SCN-011** — rebind INC-010 to replenishment-aligned incident
- [ ] **SCN-004/005** — optional SO/GI qty specification

### 3.10 P3 corrections

- [ ] **SCN-011** — add leadTimeDays to technicalSpecs
- [ ] **ALL** — remove redundant SAP t-code duplication between mission + StepForm pedagogical panel
- [ ] **SCN-001–011** — Run Report learning feedback enrichment (display-only)

### 3.11 Shared infrastructure (Wave 0 prerequisite)

- [ ] `client/src/lib/missionDisplay.ts` — `resolvePageMissionTitle`
- [ ] `client/src/lib/enterpriseTerminology.ts` — label map
- [ ] `client/src/components/enterprise/MissionHeroBlock.tsx` — extracted shared hero
- [ ] Unit tests mirroring `operationalAssignment.test.ts`

---

## 4. Explicitly Out of Scope

The following domains are **forbidden** in RC21-C.1A. Any pull request touching these requires a new governance gate and Decision Register entry.

| Domain | Reason |
|--------|--------|
| **Simulation Engine** | Frozen — steps, seed, run lifecycle |
| **Rules Engine** | Frozen — compliance validators |
| **Scoring** | Frozen — points, keyword paths, semantic scoring (RC21 other track) |
| **Compliance** | Frozen — pass/fail, M5 eval gates |
| **Database** | No schema or migration |
| **Certification** | Silver/Gold thresholds, checkpoint engine |
| **Checkpoint Engine** | Progression recompute, module gates |
| **Scenario Logic** | SCN behaviour, step sequences |
| **Enterprise Context Engine** | `enterpriseContext` API write-path |
| **AI Mentor implementation** | Live LLM provider (RC23); dry-run only |
| **Semantic scoring Phase 1** | Separate RC21 track (EB-AI-01) |
| **M5 Decision Replay** | Separate RC21 track (EB-EXP-02) |
| **Teacher dashboard presentation** | Out of student-scope standardization |
| **Morning Briefing production activation** | RC21-C.1B — code-ready, flag stays OFF until G5+G6 |
| **Department Home production activation** | RC21-C.1B — flag stays OFF until G5+G6 |
| **New governance documents** | Unless architecture changes (see §8) |

---

## 5. Implementation Order

Execute in sequence. Do not skip phases. Parallel work permitted only where noted.

### Phase 1 — Mission Identity (Wave 0 + Wave 1)

**Goal:** One resolver, one hero, one header hierarchy.

1. Create `missionDisplay.ts`, `enterpriseTerminology.ts`, `MissionHeroBlock`
2. Unit tests for title resolver
3. Mission Control: FioriShell title, session bar, dedupe Fiche de mission CTAs
4. Mission Sheet: `suppressHeader`, adopt MissionHeroBlock
5. **Gate G1:** Wave 0 complete — helpers tested, no new CSS files

### Phase 2 — Operational Contract (Wave 5 content — P0 first)

**Goal:** Student never invents business data.

1. P0 corrections: SCN-003, 006, 015, 016, 017 (missionData + cockpit pedagogy)
2. Verify EOC-COV-01 through EOC-COV-05 for corrected SCNs
3. Bilingual FR/EN parity on all corrected copy
4. **Gate G5-partial:** P0 content complete before cockpit sign-off on affected SCNs

### Phase 3 — Mission Simplification (Wave 2 + Wave 3)

**Goal:** Zero redundant information on entry paths.

1. ScenarioList terminology alignment
2. Employee Profile: assignmentPresentation + CompletedMissionsList
3. Concorde Connect audit
4. Module2–5 lists → MissionBoard delegation
5. ModeSelectionScreen + module mode pages → mission title header
6. **Gate G3:** Entry path sign-off

### Phase 4 — EOAS Refinement (Wave 2 audit + Wave 4)

**Goal:** EOAS consumes EOC without duplication.

1. Confirm TodayPriorities + AssignmentQueue EOC-PRS-01 through EOC-PRS-04
2. Department Home header alignment (flag-off safe)
3. Morning Briefing → MissionHeroBlock (staging only)
4. **Gate G4:** Legacy parity with EOAS card hierarchy

### Phase 5 — Operational Corrections (P1 → P2 → P3)

**Goal:** Close RC21-C.2 audit register.

1. P1: SCN-001, 002, 003, 006, 007 document/qty/bin corrections
2. P2: SCN-009, 010, 011 incident rebinding; optional SCN-004/005 ship qty
3. P3: SCN-011 leadTimeDays; t-code deduplication; learning feedback copy
4. Re-run zero-invention audit — target 17/17 YES

### Phase 6 — QA

**Goal:** Regression green, EOC invariants proven.

1. Engine & certification regression (runs, compliance, Silver/Gold)
2. Enterprise presentation regression (all modules, FR/EN)
3. Automated: operationalAssignment, morningBriefing, departmentHome, employeeProfile tests
4. TypeScript check + full vitest suite
5. Staging: Morning Briefing + Department Home flag ON paths
6. **Gate G6:** Full regression checklist PASS

### Phase 7 — Guardian

**Goal:** Institutional sign-off before deploy.

1. Pedagogy review: Mission Control + Mission Sheet M1–M5
2. EOC invariant review: EOC-ISO-01 through EOC-ISO-04 import graph
3. Content review: 17 SCNs pass zero-invention standard
4. Release council authorization

### Phase 8 — Commit

**Goal:** Single RC21-C.1A commit.

1. One commit: presentation layer + content corrections only
2. Commit message: `feat(rc21-c1a): enterprise experience standardization and operational contract surfacing`
3. Verify: no engine, scoring, compliance, database, or flag changes in commit

### Phase 9 — Deploy

**Goal:** Production deployment with unchanged flag state.

1. Railway redeploy to `production-hotfix-rc13-pedagogy-class6`
2. Post-deploy smoke: `rc21c-eoas-activation-smoke.mjs` (14/14)
3. Health endpoint + student login → Connect → assignment → step → report
4. **Gate G7:** Production deploy authorized

---

## 6. Completion Criteria

RC21-C.1A is **complete** only when **all** of the following are true:

| Criterion | Verification |
|-----------|--------------|
| **Mission has one identity** | Single canonical title resolver used on every student operational surface |
| **No duplicated headers** | Max one EnterpriseHeader per route; Mission Sheet suppresses when parent has header |
| **Operational contract complete** | EOC fields visible in briefing for all 17 SCNs; P0 corrections merged |
| **Student never invents business data** | RC21-C.2 zero-invention audit: 17/17 YES (or documented pedagogical exceptions only) |
| **Enterprise Experience consistent** | L0→L4 hierarchy on Mission Control, entry paths, lifecycle pages |
| **Zero redundant information** | No duplicate mission title, SCN badge, supervisor card, or situation block on same viewport |
| **EOAS invariants pass** | EOC-PRS-01 through EOC-PRS-04 confirmed |
| **Engine frozen** | Zero changes to rules engine, scoring, compliance validators |
| **Certification frozen** | Checkpoint smoke unchanged; Silver/Gold paths unchanged |
| **Regression green** | Full vitest suite PASS; staging smoke PASS |
| **Production smoke PASS** | EOAS activation smoke 14/14 post-deploy |

---

## 7. Engineering Checklist

Developers execute this checklist **without rereading all governance documents**. Reference this section only.

### 7.1 Before you write code

- [ ] Read this manifest §2 principles — confirm your task is Experience Layer only
- [ ] Confirm files you will touch are in §3 scope
- [ ] Confirm files you will **not** touch are in §4 out-of-scope
- [ ] If content change: check RC21-C.2 P0/P1/P2/P3 priority for your SCN

### 7.2 Title and header rules

```
missionTitle = resolveMissionTitle(scnCode, scenario.name, mission.enterprise?.mission ?? mission.objective)
```

- FioriShell title = page function only (never mission title, never SCN)
- EnterpriseHeader = max 1 per route; SCN appears here only
- Mission hero = primary H1; SCN = mono metadata below or in header
- Mission Sheet from Mission Control: pass `suppressHeader={true}`

### 7.3 Files you will likely modify

| Area | Primary files |
|------|---------------|
| Shared helpers | `client/src/lib/missionDisplay.ts`, `enterpriseTerminology.ts` |
| Hero extract | `client/src/components/enterprise/MissionHeroBlock.tsx` |
| Cockpit | `client/src/pages/student/MissionControl.tsx` |
| Briefing dialog | `client/src/components/MissionSheet.tsx` |
| Morning Briefing | `client/src/pages/student/MorningBriefing.tsx` |
| Entry / lists | `ScenarioList.tsx`, `Module2–5*ScenarioList*.tsx`, `ConcordeConnect.tsx` |
| Mode select | `ModeSelectionScreen.tsx`, `Module*ModeSelectionPage.tsx` |
| Step / report | `StepForm.tsx`, `RunReport.tsx` |
| Profile | `EmployeeProfilePage.tsx`, `CompletedMissionsList.tsx` |
| Content P0–P3 | `server/missionData.ts`, `server/missionDataExtended.ts`, `client/src/data/scenarioCockpitPedagogy.ts` |
| Incident rebind P2 | `shared/enterprise/scenarioBinding.ts` |

### 7.4 Files you must NOT modify

```
server/rulesEngine.ts
server/seed.ts (unless governance explicitly approves — default NO)
server/scoring*
shared/checkpoint*
drizzle/*
Any certification router logic
Any feature flag defaults in production config
```

### 7.5 EOC invariants to verify after your change

| ID | Quick check |
|----|-------------|
| EOC-ISO-01 | EOAS components import shared enterprise helpers only — no engine import |
| EOC-ISO-02 | No scoring/compliance API calls from presentation |
| EOC-PRS-01 | Assignment cards: mission title first, SCN secondary |
| EOC-PRS-03 | CurrentAssignmentCard hides redundant inline assignment |
| EOC-CON-03 | Title precedence: briefing mission → scenario name fallback |

### 7.6 Tests to run before PR

```bash
npm test -- operationalAssignment missionLifecycle morningBriefing departmentHome employeeProfile
npm run check
# Full suite if touching Mission Control or StepForm
npm test
```

### 7.7 Production smoke (post-deploy)

```bash
node .manus-logs/rc21c-eoas-activation-smoke.mjs
```

### 7.8 Rollback triggers

| Symptom | Action |
|---------|--------|
| Cockpit unusable | Revert RC21-C.1A commit; redeploy |
| EOAS layout break | Revert commit or `VITE_ENABLE_ENTERPRISE_ASSIGNMENTS=false` |
| Full legacy needed | `VITE_ENABLE_ENTERPRISE_EXPERIENCE=false` (last resort) |

No database rollback required — RC21-C.1A has no migrations.

---

## 8. Approval Gate

**After approval of this document, all remaining RC21 work becomes implementation work.**

| Rule | Binding |
|------|---------|
| No additional governance documents | Unless Architecture Foundation v1.0 changes (requires DR + version increment) |
| No constitutional amendments | Manifesto, Universe, Process Mapping remain frozen |
| EOC Standard v1.0 | Amendment only via Standard version increment + DR |
| RC21-C.1A scope | Locked to §3 of this manifest |
| RC21-C.1B | Separate increment: Morning Briefing + Department Home production flag activation |
| RC21 other tracks | Semantic scoring, OI Wave 2, M5 replay — separate implementation manifests when scoped |

**Sign-off required before RC21-C.1A Phase 1 begins:**

| Role | Confirms |
|------|----------|
| Programme lead | Scope §3 approved; §4 exclusions acknowledged |
| Engineering lead | Implementation order §5 feasible; checklist §7 executable |
| Pedagogy lead | P0–P3 correction matrix §3.7–3.10 approved |
| Release council | Completion criteria §6 accepted as RC21-C.1A definition of done |

---

## Related artifacts

| Artifact | Path |
|----------|------|
| Architecture Foundation v1.0 | `Documentation/TEC_ENTERPRISE_EXPERIENCE_MANIFESTO_V1.md` · `TEC_ENTERPRISE_UNIVERSE_V1.md` · `TEC_ENTERPRISE_PROCESS_MAPPING_V1.md` |
| Platform Charter | `Documentation/TEC_ENTERPRISE_PLATFORM_CHARTER.md` |
| Living Company Blueprint | `Documentation/LIVING_COMPANY_BLUEPRINT.md` |
| EOC Standard v1.0 | `Documentation/ENTERPRISE_OPERATIONAL_CONTRACT_STANDARD_v1.0.md` |
| RC21-C.2 Operational Audit | Agent transcript audit SCN-001→017 (2026-07-06) |
| RC21-C.1A Implementation Plan | Agent transcript roadmap (2026-07-06) |
| Decision Register | `governance/DecisionRegister/DECISION_REGISTER.md` |

---

**RC21-C.1 complete when:** This manifest is committed, approved, and RC21-C.1A Phase 1 engineering begins.

**RC21-C.1A Ready:** Awaiting manifest approval → **YES** upon commit of this document.

---

*Collège de la Concorde — TEC.LOG — Concorde Logistics Inc. — RC21 Implementation Manifest v1.0 — RC21-C.1*
