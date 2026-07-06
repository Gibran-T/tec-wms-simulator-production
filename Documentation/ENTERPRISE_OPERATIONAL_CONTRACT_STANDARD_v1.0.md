# Enterprise Operational Contract Standard v1.0

**Document type:** Official Standard — Enterprise Intelligence Contract Layer  
**Programme:** TEC.LOG — Gestion intégrée des stocks et performance logistique  
**Institution:** Collège de la Concorde — Montréal  
**Application:** TEC.WMS (Mini-WMS Concorde) · Concorde Logistics enterprise layer  
**Release gate:** RC21-C.0  
**Version:** 1.0  
**Effective date:** 2026-07-06  
**Status:** SINGLE SOURCE OF TRUTH — Operational contract standard (no implementation)

---

## Authority and precedence

This Standard defines the **Enterprise Operational Contract (EOC)** — the governed interface between the simulation engine, the Concorde Logistics universe, and the Enterprise Experience / Intelligence presentation layers. It is the binding specification for RC21-C activation work and all successor EOAS (Enterprise Operational Assignment System) increments.

| Domain | Authority |
|--------|-----------|
| Platform mission, governance, release philosophy | [TEC Enterprise Platform Charter](./TEC_ENTERPRISE_PLATFORM_CHARTER.md) |
| Experience architecture, ten mission questions, Fiche Mission schema | [TEC Enterprise Experience Manifesto v1.0](./TEC_ENTERPRISE_EXPERIENCE_MANIFESTO_V1.md) |
| Universe canon, scenario bindings, departments, incidents | [TEC Enterprise Universe v1.0](./TEC_ENTERPRISE_UNIVERSE_V1.md) |
| Living-company philosophy and aliveness litmus | [Living Company Blueprint](./LIVING_COMPANY_BLUEPRINT.md) |
| Scenario compliance, scoring gates, certification thresholds | TEC.WMS Pedagogical Constitution |
| **Operational contract schema, invariants, read-path boundaries** | **This Standard** |

**Conflict resolution:** When any presentation artifact, enrichment helper, or intelligence feature contradicts this Standard on contract fields, binding invariants, or read-path boundaries, **this Standard prevails** until amended through the Enterprise Decision Register. Engine and certification authority are never overridden by experience or intelligence layers.

**Explicit exclusions:** No production code. No database schema. No API implementation. No scenario logic changes. No scoring or compliance modifications. No feature-flag changes. This document establishes **what the operational contract is**, **what each layer may read or write**, and **how RC21-C increments prove compliance** — not how features are built.

---

## I. Definition — Enterprise Operational Contract

### 1.1 What the contract is

The **Enterprise Operational Contract (EOC)** is the institutional agreement that every active scenario (SCN-001 through SCN-017 and successors) exposes a **complete, consistent, read-only operational identity** to the Enterprise Experience and Intelligence layers.

The contract answers, for every mission the learner may execute:

| # | Contract question | Canonical source |
|---|-------------------|------------------|
| 1 | **Which scenario?** | Engine scenario ID + SCN code |
| 2 | **Which department owns this work?** | Universe binding → `department` |
| 3 | **Who supervises it?** | Universe binding → `supervisorId` → character canon |
| 4 | **How urgent is it?** | Universe binding → `priority` |
| 5 | **What business unit context applies?** | Universe binding → `businessUnit` |
| 6 | **Which stakeholders are involved?** | Universe binding → customer/supplier codes |
| 7 | **Which operational geography?** | Universe binding → `warehouseZone` (narrative) + engine seed (execution) |
| 8 | **Which incident pattern?** | Universe binding → `incidentId` (when applicable) |
| 9 | **What is the mission title?** | Briefing `mission` or engine scenario name (fallback) |
| 10 | **What assignment type is this?** | EOC taxonomy — today: `mission` only |

A scenario that runs correctly in the engine but **cannot satisfy the EOC** is incomplete for Enterprise Intelligence activation, even if pedagogically GREEN.

### 1.2 What the contract is not

| Not the EOC | Actual authority |
|-------------|------------------|
| Step sequence, compliance validators, pass/fail | Simulation engine |
| Points, scoring economics, certification eligibility | Scoring + checkpoint engine |
| Transaction seed data, bin geography execution | Engine seed contracts |
| UI layout, card grouping, CSS presentation | Experience Layer (EOAS) |
| AI mentor responses, semantic evaluation | RC21+ AI governance (separate path) |

The EOC is the **semantic envelope** around a mission — not the mission's execution logic.

### 1.3 EOAS relationship

**EOAS (Enterprise Operational Assignment System)** is the RC21-B presentation subsystem that consumes the EOC:

```
┌─────────────────────────────────────────────────────────────┐
│  EOAS Presentation (RC21-B+)                                │
│  Today's Priorities · Assignment Queue · Department Home    │
├─────────────────────────────────────────────────────────────┤
│  EOC Standard (this document) — schema + invariants         │
├─────────────────────────────────────────────────────────────┤
│  Universe Binding + Briefing Enrichment (read-path)       │
├─────────────────────────────────────────────────────────────┤
│  Simulation Engine — steps, compliance, scoring (frozen)    │
└─────────────────────────────────────────────────────────────┘
```

EOAS **must not** invent department, priority, or supervisor values that contradict universe binding. EOAS **may** reorder, group, and highlight assignments for professional presentation.

---

## II. Contract layers and ownership

### 2.1 Three-layer model

| Layer | Owns | EOC role |
|-------|------|----------|
| **L1 — Simulation Engine** | Steps, validators, scoring, seed data, run state | Supplies scenario ID, run lifecycle, execution geography |
| **L2 — Universe + Briefing** | SCN bindings, characters, departments, briefing fields | Supplies canonical operational identity per SCN |
| **L3 — Experience + Intelligence** | EOAS, Morning Briefing, Department Home, debrief, mentor UI | **Consumes** EOC read-path; never mutates L1 outcomes |

### 2.2 Read-path vs write-path

| Path | Permitted | Forbidden |
|------|-----------|-----------|
| **Read-path** | Resolve SCN → binding → briefing enrichment → assignment metadata → UI presentation | — |
| **Write-path (engine)** | Start run, submit step, complete run, persist score | Any write driven by EOAS display state |
| **Write-path (experience)** | UI preferences, collapsed panels, navigation history | Department reassignment, priority override, supervisor substitution |

**Certification integrity rule (inherited from Platform Charter §IV.4):** No EOAS or intelligence feature may alter certification eligibility, scoring paths, or compliance outcomes. The EOC is strictly read-path for L3.

### 2.3 Feature-flag boundaries

Enterprise Intelligence presentation features ship behind explicit flags. The EOC Standard applies **regardless of flag state** — bindings must remain complete in code and canon even when UI is gated off.

| Flag | Scope | Default | EOC impact |
|------|-------|---------|------------|
| `VITE_ENABLE_ENTERPRISE_EXPERIENCE` | RC19 experience layer master | ON (opt-out) | Enables enterprise chrome; does not define EOC |
| `VITE_ENABLE_ENTERPRISE_ASSIGNMENTS` | RC21-B.1 EOAS (Today's Priorities + Assignment Queue) | OFF | EOAS consumes EOC when enabled |
| `VITE_ENABLE_ENTERPRISE_DEBRIEF` | RC19-B Run Report debrief | OFF | Debrief reads briefing outcome fields; separate from EOAS |
| Morning Briefing gate | RC21-B.2 | OFF | Reads employee profile + assignment context |
| Department Home gate | RC21-B.3 | OFF | Reads department identity + queue |

**RC21-C rule:** Activation increments (RC21-C.1+) may toggle presentation flags per Release Book. They **must not** modify EOC schema, universe bindings, or engine contracts without a new Standard version and DR entry.

---

## III. Mandatory contract schema

### 3.1 Core assignment metadata

Every resolvable SCN must produce an **Operational Assignment** record conforming to this schema:

| Field | Type | Required | Source |
|-------|------|----------|--------|
| `assignmentType` | `"mission"` | Yes | EOC taxonomy (v1.0: missions only) |
| `scnCode` | `SCN-NNN` | Yes | Engine / programme registry |
| `missionTitle` | string | Yes | Briefing `mission` → scenario name fallback |
| `department` | `DepartmentCode` | Yes | Universe binding |
| `priority` | `PriorityLevel` | Yes | Universe binding |
| `supervisorId` | character ID | Yes | Universe binding |

**DepartmentCode (canonical):** `WH` · `REC` · `SHP` · `INV` · `PROC` · `PLAN` · `CS` · `FIN` · `QA` · `OPS` · `MGT`

**PriorityLevel (canonical):** `normal` · `elevee` · `critique` · `pointe`

Priority labels for display:

| Code | FR | EN |
|------|----|----|
| `normal` | Normal | Normal |
| `elevee` | Élevée | High |
| `critique` | Critique | Critical |
| `pointe` | Pointe | Peak |

### 3.2 Universe binding extension (per SCN)

Each SCN binding must additionally provide:

| Field | Required | Notes |
|-------|----------|-------|
| `businessUnit` | Yes | `BU-DIST` · `BU-FRESH` · `BU-IND` · `BU-PEAK` |
| `customerCode` | Nullable | Null when no customer stakeholder |
| `supplierCode` | Nullable | Null when no supplier stakeholder |
| `warehouseZone` | Yes | Narrative geography; must not contradict engine bins |
| `incidentId` | Nullable | `INC-001` … `INC-016` when incident-driven |

Authority: Enterprise Universe Part XII — Scenario-to-universe binding matrix.

### 3.3 Briefing enrichment (Fiche Mission alignment)

When enterprise briefing enrichment is active, the following Manifesto Part III §3.2 fields form the **briefing contract** — supplementary to assignment metadata, not a substitute:

| Field | EOC tier | Required for full contract |
|-------|----------|---------------------------|
| `situation` | Briefing | Recommended |
| `mission` | Briefing | **Yes** (primary title source) |
| `businessContext` | Briefing | Recommended |
| `priority` | Binding + Briefing | **Yes** (must match binding) |
| `department` | Binding + Briefing | **Yes** (must match binding) |
| `supervisor` | Character ref | **Yes** (must match binding ID) |
| `customer` / `supplier` | Stakeholder ref | When binding codes non-null |
| `expectedBusinessOutcome` | Briefing | Recommended |
| `successCriteria` | Briefing | Recommended |

**Invariant:** Briefing `priority` and `department` must never contradict universe binding. Mismatch is an EOC violation.

### 3.4 Employee identity contract

Learner professional identity (RC21-B.3) derives from EOC — never from ad hoc UI state:

| Identity field | Resolution order |
|----------------|------------------|
| Primary department | 1. Active SCN binding → `department` · 2. Module home department fallback |
| Supervisor | Active SCN binding → character canon |
| Display name / role | Employee profile (Concorde assignment framing) |

Students are **practicants on assignment**, not anonymous users. The identity contract must remain stable for the duration of an active run.

---

## IV. Operational invariants

These invariants are **machine-checkable expectations** for RC21-C verification. Violation blocks Enterprise Intelligence activation sign-off.

### 4.1 Coverage invariants

| ID | Invariant | Scope |
|----|-----------|-------|
| EOC-COV-01 | Every production SCN (001–017) has a universe binding | All modules |
| EOC-COV-02 | Every binding resolves a valid `DepartmentCode` | All SCNs |
| EOC-COV-03 | Every binding resolves a valid `PriorityLevel` | All SCNs |
| EOC-COV-04 | Every binding resolves a canonical `supervisorId` | All SCNs |
| EOC-COV-05 | `buildAssignmentMeta(scnCode, title)` returns defined metadata for all production SCNs | Read-path |

### 4.2 Consistency invariants

| ID | Invariant | Rule |
|----|-----------|------|
| EOC-CON-01 | Priority sort order is stable | `critique` < `pointe` < `elevee` < `normal` (urgency descending) |
| EOC-CON-02 | Department group order is stable | MGT → OPS → CS → QA → INV → WH → REC → SHP → PROC → PLAN → FIN |
| EOC-CON-03 | Mission title precedence | `missionObjective` trim → scenario `name` fallback |
| EOC-CON-04 | Urgent classification | `critique`, `elevee`, `pointe` = urgent; `normal` = not urgent |
| EOC-CON-05 | Geography alignment | Narrative `warehouseZone` must not contradict engine seed geography |
| EOC-CON-06 | Incident reference | When `incidentId` set, incident must exist in Universe Part VI catalogue |

### 4.3 Isolation invariants

| ID | Invariant | Rule |
|----|-----------|------|
| EOC-ISO-01 | No engine import from EOAS presentation | Presentation reads shared enterprise helpers only |
| EOC-ISO-02 | No scoring side effects | EOC resolution never calls scoring, compliance, or certification APIs |
| EOC-ISO-03 | No binding mutation at runtime | Universe bindings are static per release; changes require governance |
| EOC-ISO-04 | No duplicate authority | Engine scenario name is fallback title only — binding owns department/priority |

### 4.4 Presentation invariants (EOAS)

| ID | Invariant | Rule |
|----|-----------|------|
| EOC-PRS-01 | Mission title primary | Assignment cards show mission title first; SCN code secondary |
| EOC-PRS-02 | Grouping modes | Queue supports department grouping and priority grouping — both respect EOC sort orders |
| EOC-PRS-03 | Today's Priorities | Current assignment card hides redundant inline assignment when active |
| EOC-PRS-04 | Department accent | Department Home uses TEDS CSS department accent vars |

---

## V. M5 and peak operational contracts

M5 scenarios (SCN-015, SCN-016, SCN-017) carry an additional **execution seed contract** independent of but aligned with the EOC:

**M5 operational seed (canonical):** SKU-001 · 50 u. · PO-M5-001 · REC-01 → B-01-R1-L1 · LOT-M5-A

| Dimension | EOC layer | Engine layer |
|-----------|-----------|--------------|
| Business urgency | `pointe` / `critique` via binding | — |
| Peak business unit | `BU-PEAK` | — |
| Customer | `C-MTQ` (Ministère des Transports) | Order references in seed |
| Inventory anchor | Narrative in briefing | SKU-001 quantity and location in seed |
| Strategic decision | Briefing + Run Report | SCN-017 eval gate |

The EOC must not redefine M5 seed data. Narrative and execution contracts are **parallel, aligned, non-overlapping**.

---

## VI. Sort and grouping specification

### 6.1 Priority sort (Today's Priorities)

Assignments sort by urgency for "what needs attention first":

```
critique (0) → pointe (1) → elevee (2) → normal (3)
```

Lower index = higher urgency. EOAS Today's Priorities uses this order.

### 6.2 Department group order (Assignment Queue)

When grouping by department, sections appear in operational authority order:

```
MGT → OPS → CS → QA → INV → WH → REC → SHP → PROC → PLAN → FIN
```

Within each department group, items sort by priority (§6.1).

### 6.3 Priority grouping (Assignment Queue alternate view)

When grouping by priority, sections appear in urgency order (§6.1). Within each priority band, department order (§6.2) applies as secondary sort.

---

## VII. Verification and release gates

### 7.1 RC21-C.0 gate (this document)

| Criterion | Requirement |
|-----------|-------------|
| EOC schema defined | Complete in this document |
| Layer ownership documented | §II |
| Invariants catalogued | §IV |
| EOAS relationship clarified | §I.3 |
| Feature-flag boundaries documented | §II.3 |
| No production code modified | Verified — documentation only |

**RC21-C.0 verdict:** Documentation gate. Enables RC21-C.1A implementation audit.

### 7.2 RC21-C.1A readiness checklist (forward reference)

RC21-C.1A must verify, without modifying engine/scoring/compliance/certification:

| Check | Method |
|-------|--------|
| EOC-COV-01 through EOC-COV-05 | Unit tests on shared enterprise read-path |
| EOC-CON-01 through EOC-CON-06 | Binding audit vs Universe Part XII |
| EOC-ISO-01 through EOC-ISO-04 | Import graph / side-effect review |
| EOC-PRS-01 through EOC-PRS-04 | EOAS component review when flag enabled |
| Zero scoring drift | Regression suite unchanged |
| Zero certification path change | Checkpoint engine smoke unchanged |

### 7.3 RC21-C.1 activation gate (forward reference)

Production EOAS activation (RC21-C.1) requires:

1. RC21-C.0 Standard institutionalized (this document)
2. RC21-C.1A audit PASS
3. Release Book entry with flag toggle authorization
4. Post-deploy smoke: health, bundle, EOAS components, student login, mission start
5. Regression: auth, runs, scoring, certification endpoints unchanged

---

## VIII. Amendment and versioning

### 8.1 When amendment is required

| Change type | Amendment path |
|-------------|----------------|
| New SCN added | Universe binding + EOC coverage proof + this Standard audit table update |
| Department or priority taxonomy change | Standard version increment + DR entry |
| New assignment type (beyond `mission`) | Standard version increment + EOAS design review |
| Engine seed geography change | Universe geography check + EOC-CON-05 re-verification |
| EOAS presentation rule change | Experience Layer review; Standard update if invariant affected |

### 8.2 Version history

| Version | Release | Summary |
|---------|---------|---------|
| **1.0** | RC21-C.0 | Initial Enterprise Operational Contract Standard |

### 8.3 Related artifacts

| Artifact | Relationship |
|----------|--------------|
| TEC Enterprise Platform Charter | Platform governance parent |
| TEC Enterprise Experience Manifesto v1.0 | Briefing schema authority |
| TEC Enterprise Universe v1.0 | Binding matrix authority |
| Living Company Blueprint | Philosophical aliveness filter |
| TEC Enterprise Process Mapping v1.0 | Process-to-department alignment |
| RC21-B release evidence | EOAS initial implementation |
| Enterprise Backlog EB-EXP-* | Experience increments consuming EOC |

---

## IX. Closing declaration

The Enterprise Operational Contract is the **institutional handshake** between what Concorde Logistics *is* (universe), what the learner *does* (engine), and what the learner *sees* (experience and intelligence).

RC21-C.0 establishes this handshake as a governed standard. No Enterprise Intelligence activation increment may proceed without proving EOC compliance. The simulation engine, scoring economics, compliance validators, and certification gates remain **frozen and authoritative** — the contract wraps them; it never replaces them.

**RC21-C.0 complete when:** This document is committed, governance-linked, and RC21-C.1A audit scope is unambiguous.

---

*Collège de la Concorde — TEC.LOG — Concorde Logistics Inc. — Enterprise Operational Contract Standard v1.0 — RC21-C.0*
