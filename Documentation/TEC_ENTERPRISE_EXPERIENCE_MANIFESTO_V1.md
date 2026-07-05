# TEC Enterprise Experience Manifesto v1.0

**Document type:** Official Foundation Document — Constitutional Architecture  
**Programme:** TEC.LOG — Gestion intégrée des stocks et performance logistique  
**Institution:** Collège de la Concorde — Montréal  
**Application:** TEC.WMS (Mini-WMS Concorde) · Future: TEC.ERP  
**Release:** RC18-A  
**Status:** SINGLE SOURCE OF TRUTH — Architecture only (no implementation)

---

## Authority and precedence

This manifesto is the **constitutional document** for every future decision affecting learning experience, user interface, user experience, artificial intelligence integration, pedagogical design, and enterprise narrative in TEC.WMS and its successor TEC.ERP.

| Domain | Authority |
|--------|-----------|
| Learning experience, enterprise narrative, UX/UI identity, AI mentor philosophy, career framing | **This manifesto** |
| Scenario compliance, scoring gates, certification thresholds, simulation engine contracts | TEC.WMS Pedagogical Constitution (coexists; does not conflict) |
| Visual asset production (slides, VLS imagery) | Visual Bible v1.0 (must align with Design System herein) |
| Transaction execution, rules engine, seed data | Unchanged — simulation engine is preserved |

**Conflict resolution:** If any prior documentation disagrees with this manifesto on *how students experience learning*, this manifesto prevails. If prior documentation governs *what constitutes a passing evaluation run*, the Pedagogical Constitution prevails until programme leadership reconciles both artifacts.

**Explicit exclusions from this document:** No production code. No React components. No database schema. No scenario logic changes. No API implementation. No task lists.

---

## Executive summary

TEC.WMS today is a rigorous ERP/WMS transaction simulator. It teaches operational reasoning through sequenced scenarios, compliance gates, and institutional certification. That engine works. It must not be replaced.

RC18-A redefines the **experience layer** around the engine. Students will no longer perceive scenarios as transaction checklists. They will enter a **persistent professional enterprise** — Concorde Logistics — where each mission has business stakes, human context, measurable outcomes, and career meaning.

The ERP remains a **tool**. The business problem is the **learning objective**.

The mandatory pedagogical chain is unchanged:

```
Slides → Quiz → Scenario (SCN) → Debrief → Certification
```

Everything in this manifesto serves that chain. Nothing bypasses it.

---

## Part I — Vision and mission philosophy

### 1.1 Transformation statement

| From | To |
|------|-----|
| ERP/WMS Transaction Simulator | Professional Enterprise Learning Experience |
| "Complete the steps" | "Solve the business problem" |
| Isolated scenario exercises | Missions inside a living company |
| Software training | Profession simulation |
| Answer validation | Professional judgment development |

The simulation engine — steps, compliance validators, scoring, Mission Control, cockpit monitors, OIL panels — continues to enforce operational correctness. The manifesto changes **why** the student cares, **who** they are when they act, and **what success means** in business terms.

### 1.2 The ten mission questions

Every scenario (SCN-001 through SCN-017 and all future scenarios) must be designable and reviewable by answering:

1. **Where am I?** — Facility, zone, shift, time pressure
2. **What happened?** — Triggering event (order spike, ghost GR, capacity breach, KPI alert)
3. **Who am I?** — Professional role with authority boundaries
4. **Who is my supervisor?** — Named character with expectations
5. **Which department am I working in?** — Organizational home
6. **Which company is this?** — Concorde Logistics (persistent enterprise)
7. **Which customer is involved?** — When customer impact exists
8. **Which supplier is involved?** — When supply chain impact exists
9. **Why is this mission important?** — Business consequence of failure
10. **What business problem must I solve?** — The learning objective in operational language
11. **How will success be measured?** — KPIs, SLA, compliance, stakeholder satisfaction

A scenario that cannot answer these questions is **incomplete** as an enterprise experience, even if technically GREEN under the Pedagogical Constitution.

### 1.3 BRIDGE methodology — enterprise elevation

The existing BRIDGE model (Briefing → Reasoning → Interpretation → Decision → Governance → Evaluation) remains the pedagogical spine. RC18-A elevates each letter:

| BRIDGE | Legacy framing | Enterprise framing |
|--------|----------------|-------------------|
| **B — Briefing** | Fiche Mission + role | Operational briefing with business context |
| **R — Reasoning** | Documentary proof | Evidence-based professional analysis |
| **I — Interpretation** | KPI reading | Performance diagnosis for stakeholders |
| **D — Decision** | Tactical choice | Business decision with trade-offs |
| **G — Governance** | Compliance sequence | Organizational accountability |
| **E — Evaluation** | Score + Run Report | Mission debrief + career signal |

### 1.4 ERP as tool, problem as objective

Students open screens for **business reasons**, not because a tutorial arrow points there.

| Screen / function | Wrong framing | Correct framing |
|-------------------|---------------|-----------------|
| Goods receipt posting | "Click MIGO" | "Dock reconciliation — supplier delivery must match PO before stock is usable" |
| Putaway | "Execute LT01" | "Slotting decision — capacity and rotation policy determine where inventory lives" |
| Cycle count | "Run MI01" | "Inventory accuracy audit — finance and operations need trustworthy stock truth" |
| KPI tower | "Read the dashboard" | "Service failure diagnosis — customer SLA is at risk; recommend corrective plan" |

Transaction codes (ME21N, MIGO, LT01, MI01, etc.) remain pedagogical anchors. They are **vocabulary**, not the lesson.

---

## Part II — Mandatory pedagogical flow

### 2.1 Institutional sequence

```
┌─────────┐    ┌──────┐    ┌──────────┐    ┌─────────┐    ┌───────────────┐
│ Slides  │ →  │ Quiz │ →  │ Scenario │ →  │ Debrief │ →  │ Certification │
└─────────┘    └──────┘    └──────────┘    └─────────┘    └───────────────┘
  Theory        Gate         Mission         Reflection      Credential
  Transfer      Check        Execution       Consolidation   Recognition
```

This sequence is **non-negotiable**. No feature may reorder, skip, or collapse these phases for evaluation pathways.

### 2.2 Phase responsibilities

| Phase | Enterprise experience role | Engine contract (unchanged) |
|-------|---------------------------|----------------------------|
| **Slides** | Introduce business concepts, company context, profession skills | Not server-tracked; instructor-led transmission |
| **Quiz** | Verify conceptual readiness before professional mission | M1/M5 certification gates preserved |
| **Scenario** | Execute mission inside Concorde Logistics using ERP tool | Steps, compliance, scoring enforced |
| **Debrief** | Connect mission outcome to business lesson and career skill | Run Report + instructor facilitation |
| **Certification** | Recognize profession-ready competence | Silver (M1) / Gold (M1–M5) gates preserved |

### 2.3 Module arc as career chapters

| Module | Profession focus | Enterprise narrative chapter |
|--------|------------------|------------------------------|
| M1 | Foundations — integrated logistics flow | **Chapter 1:** Onboarding at Concorde Logistics |
| M2 | Warehouse organization and slotting | **Chapter 2:** Storage strategy and floor execution |
| M3 | Inventory planning and replenishment | **Chapter 3:** Stock governance and demand response |
| M4 | Operational performance and KPI | **Chapter 4:** Control tower and continuous improvement |
| M5 | Peak operations and strategic decisions | **Chapter 5:** Crisis leadership — Peak Week |

Each module is a **career chapter**, not a software module.

---

## Part III — Fiche Mission: operational briefing architecture

### 3.1 Principle: keep and transform

The Fiche Mission (Operational Mission Sheet) is **retained**. It is the institutional briefing artifact accessed from Mission Control before and during runs. RC18-A transforms its information architecture from transaction checklist to **operational briefing**.

The dialog title remains: *Fiche de Mission Opérationnelle / Operational Mission Sheet*.

### 3.2 Briefing field schema

The following fields replace the checklist-first layout as the **primary reading order**. Transaction steps move to a supporting section titled **Execution Reference** (secondary to business framing).

| Field | FR label | Purpose |
|-------|----------|---------|
| **Situation** | Situation | What happened; current operational state |
| **Role** | Rôle professionnel | Student's professional identity and authority |
| **Mission** | Mission | Business problem to solve (one sentence) |
| **Business Context** | Contexte d'affaires | Why stakeholders care; revenue/service/risk impact |
| **People Involved** | Intervenants | Characters engaged in this mission |
| **Customer** | Client | Customer name, SLA, order context (when applicable) |
| **Supplier** | Fournisseur | Supplier name, delivery context (when applicable) |
| **Priority** | Priorité | Urgency level: Normal · Élevée · Critique · Peak |
| **Expected Business Outcome** | Résultat d'affaires attendu | What "good" looks like for the business |
| **KPIs** | Indicateurs de performance | Metrics that measure success |
| **Documents Available** | Documents disponibles | PO, GR, SO, monitor evidence the professional would consult |
| **Supervisor Notes** | Notes du superviseur | Character voice; expectations; pitfalls |
| **Success Criteria** | Critères de réussite | Business + operational success conditions |
| **Execution Reference** | Référence d'exécution | Transaction sequence (supporting, not leading) |

### 3.3 Visual hierarchy rules

1. **Header band:** Concorde Logistics logo lockup · Department badge · Priority indicator · SCN reference
2. **Hero block:** Mission statement (large) + Role + Supervisor portrait slot
3. **Context panels:** Situation · Business Context · People Involved (two-column layout)
4. **Stakeholder strip:** Customer · Supplier (when applicable)
5. **Outcome block:** Expected Business Outcome · KPIs · Success Criteria
6. **Supervisor voice:** Notes du superviseur in quoted callout with character attribution
7. **Execution Reference:** Collapsed by default in Evaluation mode; expanded in Demo mode

### 3.4 Bilingual requirement

All briefing fields must exist at equal semantic depth in **French and English**, consistent with Article VIII of the Pedagogical Constitution. Character names and company names remain stable across languages.

### 3.5 Relationship to Mission Control and OIL

| Artifact | Relationship |
|----------|--------------|
| Mission Control | Entry point; briefing accessible before step 1 |
| OIL Panel F | Reinforces control points from briefing — never contradicts |
| Cockpit monitors | Evidence sources referenced in Documents Available |
| Run Report | Debrief references Expected Business Outcome vs actual |

---

## Part IV — Concorde Logistics: persistent enterprise architecture

### 4.1 Enterprise concept

**Concorde Logistics** is a fictional but internally consistent third-party logistics and distribution enterprise headquartered in the Greater Montreal area. It serves as the **persistent world** for the entire TEC.LOG programme.

Students are not "using a simulator." They are **professionals on assignment** at Concorde Logistics for the duration of the course.

### 4.2 Company profile

| Attribute | Value |
|-----------|-------|
| **Legal name** | Concorde Logistics Inc. |
| **Industry** | 3PL · B2B distribution · Regional fulfillment |
| **Facility** | Concorde Distribution Centre (CDC) — 250,000 sq ft |
| **ERP/WMS** | TEC.WMS (in-universe: integrated ERP/WMS platform) |
| **Customers** | Mid-market manufacturers and retailers (fictional accounts) |
| **Suppliers** | Regional and international vendors (fictional accounts) |
| **Culture** | Safety-first · Data-driven · Continuous improvement |
| **Programme link** | Collège de la Concorde co-develops talent pipeline with Concorde Logistics |

### 4.3 Organizational structure

```
                    ┌─────────────────────┐
                    │     Management      │
                    │  (Operations Dir.)  │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼───────┐    ┌─────────▼─────────┐   ┌──────▼──────┐
│  Operations   │    │     Planning      │   │   Finance   │
│  (Warehouse,  │    │  (Demand, S&OP)   │   │  (Cost,     │
│   Shipping,   │    │                   │   │   invoice)  │
│   Receiving)  │    │                   │   │             │
└───────┬───────┘    └─────────┬─────────┘   └─────────────┘
        │                      │
┌───────▼───────┐    ┌─────────▼─────────┐   ┌─────────────┐
│   Inventory   │    │   Procurement     │   │   Quality   │
│  (Stock truth)│    │   (Buying)        │   │  (Compliance)│
└───────────────┘    └───────────────────┘   └─────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Customer Service   │
                    │  (Orders, SLA)      │
                    └─────────────────────┘
```

### 4.4 Department definitions

| Department | Code | Mission | Key processes in curriculum |
|------------|------|---------|----------------------------|
| **Warehouse** | WH | Safe, accurate floor execution | Putaway, picking, cycle count |
| **Receiving** | REC | Dock-to-stock integrity | PO validation, GR posting, discrepancy |
| **Shipping** | SHP | On-time, accurate dispatch | Pick, pack, GI, carrier coordination |
| **Inventory** | INV | Stock truth and allocation | MB52, adjustments, replenishment |
| **Procurement** | PROC | Supply continuity | PO creation, supplier follow-up |
| **Planning** | PLAN | Balance supply and demand | Min/max, safety stock, ROP |
| **Customer Service** | CS | Order promise management | SO, SLA, escalation |
| **Finance** | FIN | Cost and inventory valuation | Invoice match, write-off governance |
| **Quality** | QA | Compliance and audit | Ghost GR detection, hold release |
| **Operations** | OPS | Cross-functional execution | Peak Week, exception management |
| **Management** | MGT | Strategic direction | KPI review, S&OP, crisis decisions |

### 4.5 Facility zones (CDC)

Zones remain consistent with existing simulation geography:

| Zone | Code | Narrative function |
|------|------|-------------------|
| Receiving dock | REC-01, REC-02 | Inbound pressure · supplier interface |
| Storage | B-01, B-02 (racks) | Capacity, FIFO, slotting decisions |
| Shipping | EXP-01, EXP-02 | Outbound SLA pressure |
| Quarantine / Hold | QA-HOLD | Quality stops flow |
| Control Tower | CT-01 | M4/M5 KPI and decision missions |

### 4.6 Persistent continuity rules

1. **Company persists** across all modules — logos, departments, character roster, customer/supplier accounts
2. **Events reference prior chapters** — M3 replenishment may reference M2 slotting constraints
3. **Metrics accumulate narratively** — M4 KPI missions reference operational patterns established in M1–M3
4. **No contradictory geography** — bin logic, zone codes, and capacity rules remain simulation-consistent
5. **Fictional accounts are stable** — customer and supplier names do not change between scenarios without narrative justification

### 4.7 Sample stakeholder registry (canonical)

| Entity | Type | Role in curriculum |
|--------|------|-------------------|
| NordPack Inc. | Customer | B2B packaging buyer; SLA-sensitive |
| Laurentian Foods | Customer | FIFO and freshness constraints |
| St-Laurent Components | Supplier | Recurring PO/GR flows |
| Grands Lacs Industrial | Supplier | Capacity and lead-time pressure |
| Ministère des Transports (fictional contract) | Customer | Peak Week volume spike (M5) |

---

## Part V — Professional characters architecture

### 5.1 Character system purpose

Recurring characters transform abstract exercises into **professional relationships**. Students learn to receive direction, communicate status, and respect organizational hierarchy — competencies that transfer to every ERP environment.

### 5.2 Character roster

#### Marc-André Tremblay — Warehouse Supervisor

| Attribute | Definition |
|-----------|------------|
| **Role** | Warehouse Supervisor — Receiving & Storage |
| **Department** | Warehouse |
| **Mission** | Ensure floor execution matches system truth |
| **Responsibilities** | Shift briefing, exception escalation, safety compliance |
| **Personality** | Direct, experienced, calm under pressure |
| **Communication style** | Short sentences; asks "What does the monitor show?" before suggesting action |
| **Appears in** | M1, M2 missions; ghost GR and putaway scenarios |

#### Aisha Rahman — Senior Warehouse Operator

| Attribute | Definition |
|-----------|------------|
| **Role** | Senior Warehouse Operator |
| **Department** | Warehouse |
| **Mission** | Mentor junior staff on physical-digital alignment |
| **Responsibilities** | FIFO coaching, bin verification, equipment safety |
| **Personality** | Patient, precise, evidence-first |
| **Communication style** | Uses floor examples; "Walk the rack before you post" |
| **Appears in** | M2 FIFO, cycle count, adjustment scenarios |

#### Jean-Philippe Morin — Senior Buyer

| Attribute | Definition |
|-----------|------------|
| **Role** | Senior Buyer |
| **Department** | Procurement |
| **Mission** | Maintain supply continuity at acceptable cost |
| **Responsibilities** | PO approval, supplier negotiation, expedite decisions |
| **Personality** | Analytical, cost-aware, deadline-driven |
| **Communication style** | References lead times and MOQ; asks business justification for expedite |
| **Appears in** | M1 emergency replenishment, M3 procurement scenarios |

#### Sophie Lachance — Demand Planner

| Attribute | Definition |
|-----------|------------|
| **Role** | Demand Planner |
| **Department** | Planning |
| **Mission** | Balance inventory investment against service level |
| **Responsibilities** | Min/max, safety stock, ROP, forecast interpretation |
| **Personality** | Data-curious, collaborative, scenario-thinker |
| **Communication style** | Frames decisions as trade-offs; uses "what-if" language |
| **Appears in** | M3 replenishment, M4 KPI diagnostic scenarios |

#### David Okonkwo — Quality Specialist

| Attribute | Definition |
|-----------|------------|
| **Role** | Quality Specialist |
| **Department** | Quality |
| **Mission** | Prevent non-conforming inventory from reaching customers |
| **Responsibilities** | Hold/release, GR validation, audit trail |
| **Personality** | Principled, detail-oriented, non-negotiable on compliance |
| **Communication style** | Cites procedure; asks for document evidence before sign-off |
| **Appears in** | M1 ghost GR, M2 compliance, hold scenarios |

#### Mélanie Gagnon — Customer Service Lead

| Attribute | Definition |
|-----------|------------|
| **Role** | Customer Service Lead |
| **Department** | Customer Service |
| **Mission** | Protect customer promise dates and satisfaction |
| **Responsibilities** | Order priority, SLA tracking, escalation to operations |
| **Personality** | Customer-advocate, urgent when SLA at risk |
| **Communication style** | Opens with customer impact; "NordPack needs confirmation by 14h" |
| **Appears in** | M1 stockout, M5 Peak Week scenarios |

#### Élise Beaumont — Operations Director

| Attribute | Definition |
|-----------|------------|
| **Role** | Operations Director |
| **Department** | Management |
| **Mission** | Align warehouse performance with business strategy |
| **Responsibilities** | KPI ownership, cross-department coordination, crisis command |
| **Personality** | Strategic, composed, expects concise status updates |
| **Communication style** | Requests bottom-line impact; "What is the business consequence?" |
| **Appears in** | M4 capstone, M5 strategic decision scenarios |

#### Coach ERP (AI Mentor) — Institutional Guide

| Attribute | Definition |
|-----------|------------|
| **Role** | ERP Coach — TEC.LOG institutional mentor |
| **Department** | Cross-functional (reports to programme) |
| **Mission** | Develop professional judgment without replacing it |
| **Responsibilities** | Socratic guidance, concept bridging, reflection prompts |
| **Personality** | Supportive, never condescending; respects student agency |
| **Communication style** | Questions before hints; never provides compliance answers in Evaluation mode |
| **Appears in** | All modules — AI layer (future) |

### 5.3 Character deployment rules

1. Every scenario assigns **one primary supervisor** and optionally one cross-functional stakeholder
2. Supervisor Notes in Fiche Mission use **character voice** — attributed quote with name and title
3. Characters may appear in slides, debrief templates, and future AI mentor responses — never contradict Mission Sheet operational truth
4. Character roster grows only through manifesto amendment — no ad-hoc characters per scenario

---

## Part VI — AI mentor architecture (definition only)

### 6.1 Strategic intent

OpenAI integration is planned as a **professional mentor layer**. It is not a chatbot that completes missions. It develops the student's ability to observe, analyze, and decide — the same outcomes required by the Pedagogical Constitution.

**Implementation status:** Architecture defined. API integration deferred.

### 6.2 Mentor philosophy

| Principle | Rule |
|-----------|------|
| **Mentor, not solver** | AI never posts transactions, fills compliance fields, or reveals canonical answers |
| **Evidence before advice** | AI asks what the student sees in monitor/cockpit before suggesting direction |
| **Mode-aware behavior** | Learning Mode and Professional Mode are Socratic; Certification Mode is restricted |
| **Bilingual parity** | Mentor responds in student's active language (FR/EN) |
| **Auditability** | All mentor interactions are loggable for instructor review |
| **Source hierarchy** | AI context is subordinate to Mission Sheet and Pedagogical Constitution |

### 6.3 Mentor personas

| Persona | Mapped character | Primary use |
|---------|------------------|-------------|
| **Floor Mentor** | Marc-André Tremblay | M1/M2 execution guidance |
| **Inventory Advisor** | Sophie Lachance | M3 planning reasoning |
| **Performance Coach** | Élise Beaumont | M4 KPI interpretation |
| **Crisis Advisor** | Élise Beaumont + Mélanie Gagnon | M5 decision support |
| **ERP Coach** | Coach ERP | Cross-module concept bridging |

Personas share core guardrails but differ in vocabulary and department framing.

### 6.4 Help modes

| Mode | Student context | AI behavior |
|------|-----------------|-------------|
| **Learning Mode** | Demo runs, post-debrief review | Broad Socratic hints; concept explanations permitted |
| **Professional Mode** | Evaluation runs, pre-compliance | Narrow hints; evidence questions only; no step-specific answers |
| **Certification Mode** | Active scored run | **Disabled** — AI unavailable during compliance-critical evaluation |
| **Reflection Mode** | Post-run debrief | Full conceptual discussion; links mission to career skills |

### 6.5 Context injection architecture

The AI layer receives structured context assembled at request time. No generative model is given raw database access.

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Mentor Request                       │
└─────────────────────────────┬───────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼───────┐   ┌─────────▼─────────┐  ┌──────▼──────┐
│ Scenario      │   │ Student Progress  │  │ Mission     │
│ Context       │   │ Snapshot          │  │ Context     │
│ (SCN, dept,   │   │ (module, prior    │  │ (briefing   │
│  characters)  │   │  scores, mode)    │  │  fields)    │
└───────────────┘   └───────────────────┘  └─────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Current Step      │
                    │ Context           │
                    │ (step ID, OIL    │
                    │  panel, non-     │
                    │  sensitive state)│
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Professional Role │
                    │ (student role +   │
                    │  supervisor)     │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Prompt Assembly   │
                    │ + Guardrail Layer │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │ OpenAI API        │
                    │ (future)          │
                    └───────────────────┘
```

#### Context injection fields

| Context block | Contents | Sensitivity |
|---------------|----------|-------------|
| **Scenario Context** | SCN code, module, department, priority, business problem summary | Low — briefing-level |
| **Student Progress** | Modules completed, certification status, attempt count (not answers) | Medium — FERPA-aware |
| **Mission Context** | Situation, role, KPIs, success criteria, supervisor identity | Low — briefing-level |
| **Current Step Context** | Active step name, OIL panel focus, completed steps list | Medium — no canonical answers |
| **Professional Role** | Role title, authority boundaries, supervisor expectations | Low |

#### Prohibited context

- Canonical compliance responses
- Expected numeric answers for KPI_DIAGNOSTIC
- Seed metadata the student must discover
- Other students' data

### 6.6 Response guardrails

1. **Refusal templates** for direct answer requests in Professional Mode
2. **Maximum three hints** before suggesting instructor consultation
3. **Citation of evidence sources** — monitor, cockpit, Fiche Mission section — before advice
4. **No transaction execution language** — AI says "verify GR status" not "click Poster MIGO"
5. **Instructor override** — teachers can disable AI per cohort

### 6.7 AI entry points (future UX)

| Entry point | Mode available |
|-------------|----------------|
| Mission Control help drawer | Learning, Professional |
| OIL Panel F mentor chip | Learning, Professional |
| Post-run debrief reflection | Reflection |
| Certification runs | None (Certification Mode lock) |

---

## Part VII — TEC Enterprise Design System

### 7.1 Design philosophy

The TEC Enterprise Design System (TEDS) defines the official visual and interaction identity for TEC.WMS and TEC.ERP.

**Original identity.** TEDS is inspired by enterprise software best practices — clarity, density control, operational focus — but does **not** imitate SAP Fiori, Microsoft Dynamics 365, Oracle Fusion, or Odoo. Students should feel they are in a **professional environment**, not a clone of any vendor UI.

**Preserved surfaces.** Mission Control, cockpit monitors, and operational dashboards remain core navigation metaphors. RC18-A improves **consistency** across them, not replacement.

### 7.2 Brand pillars

| Pillar | Expression |
|--------|------------|
| **Operational Clarity** | Information hierarchy serves decision-making |
| **Institutional Trust** | Collège de la Concorde + Concorde Logistics co-branding |
| **Industrial Realism** | Visual Learning System alignment — believable logistics |
| **Bilingual Professionalism** | FR primary pedagogy; EN parity; industry acronyms where standard |
| **Mission-First Layout** | Business context before tool controls |

### 7.3 Identity elements

#### Wordmark and lockup

- **TEC.WMS** — programme application mark
- **Concorde Logistics** — enterprise world mark
- **Collège de la Concorde** — institutional authority mark
- Combined lockup for certificates, Fiche Mission header, and slide masters

#### Color system

Module accents preserved from institutional palette:

| Token | Module | Hex | Usage |
|-------|--------|-----|-------|
| `--tec-m1` | M1 Foundations | `#3B82F6` | Receiving, flow |
| `--tec-m2` | M2 Warehouse | `#2563EB` | Slotting, zones |
| `--tec-m3` | M3 Inventory | `#059669` | Stock, replenishment |
| `--tec-m4` | M4 Performance | `#D97706` | KPI, alerts |
| `--tec-m5` | M5 Peak | `#7B1FA2` | Crisis, decisions |

Enterprise neutrals:

| Token | Hex | Usage |
|-------|-----|-------|
| `--tec-navy` | `#1E293B` | Headers, authority |
| `--tec-slate` | `#64748B` | Secondary text |
| `--tec-surface` | `#F8FAFC` | Panel backgrounds |
| `--tec-border` | `#E2E8F0` | Structural lines |
| `--tec-success` | `#16A34A` | Compliance positive |
| `--tec-warning` | `#D97706` | Attention |
| `--tec-critical` | `#DC2626` | SLA breach, hold |

Process ribbon (all modules): Supplier → Receiving → Putaway → Storage → Picking → Packing → Shipping → Customer — color-coded consistently.

### 7.4 Typography

| Level | Typeface class | Usage |
|-------|----------------|-------|
| **Display** | Bold sans-serif | Mission titles, module headers |
| **Body** | Regular sans-serif | Briefing prose, OIL content |
| **Mono** | Monospace | SCN codes, transaction refs, bin IDs |
| **Data** | Tabular numerals | KPIs, quantities, scores |

Minimum legibility target: 1920×1080 classroom projection.

### 7.5 Layout patterns

#### Mission Control (preserved, refined)

- Left: step progress and mission status
- Center: active workspace (forms, monitors)
- Right: OIL panels A–F
- Top bar: Concorde Logistics department badge · role indicator · Fiche Mission access

#### Fiche Mission briefing layout

- Single-column mobile; two-column desktop
- Business fields above fold; Execution Reference below fold
- Supervisor quote callout with character avatar

#### Cockpit monitors

- Zone-first labeling (REC, STOCKAGE, EXP)
- Evidence callouts tied to OIL Panel C (Situation)

#### Dashboards (M4/M5)

- KPI tiles with Annexe A band colors
- Alert severity: Critical / High / Medium
- No vendor-specific widget cloning

### 7.6 Component principles

| Component | Rule |
|-----------|------|
| Buttons | Verb-first labels in business language ("Validate receipt" not "MIGO") |
| Badges | Department, priority, compliance state |
| Panels | Consistent border-radius, shadow depth, and header band |
| Dialogs | Zero border-radius option for institutional authority surfaces (Fiche Mission) |
| Empty states | Explain why empty is normal (M4 monitor) — business narrative |

### 7.7 Motion and feedback

- Subtle transitions on step completion — no gamification confetti
- Compliance success: professional acknowledgment, not game rewards
- Alert pulse reserved for SLA and safety events only

### 7.8 Accessibility

- WCAG 2.1 AA contrast minimum for all briefing text
- Keyboard navigation preserved for instructor projection workflows
- Color never sole indicator of state — icon + label required

### 7.9 Relationship to Visual Bible

VLS slide imagery and TEDS UI share the module palette and process ribbon. Slide characters match the character roster defined in Part V. Divergence requires Visual Bible amendment aligned with this manifesto.

---

## Part VIII — Career experience architecture

### 8.1 Core principle

Students are learning **professions**, not software. Career progression is a first-class pedagogical dimension, not a cosmetic badge.

### 8.2 Profession pathways

| Pathway | Entry role | Mid role | Capstone role |
|---------|------------|----------|---------------|
| **Warehouse** | Warehouse Operator | Senior Operator | Warehouse Supervisor |
| **Inventory** | Inventory Clerk | Inventory Analyst | Inventory Controller |
| **Purchasing** | Procurement Assistant | Buyer | Senior Buyer |
| **Planning** | Planning Coordinator | Demand Planner | S&OP Contributor |
| **Operations** | Operations Clerk | Operations Analyst | Operations Director |
| **Management** | Team Lead | Department Head | Cross-functional Leader |

### 8.3 Module-to-profession mapping

| Module | Primary profession signal | Secondary signal |
|--------|--------------------------|------------------|
| M1 | Warehouse Operator | Quality awareness |
| M2 | Senior Warehouse Operator | Capacity planner |
| M3 | Inventory Analyst | Demand planner |
| M4 | Operations Analyst | Performance specialist |
| M5 | Operations Director | Crisis decision-maker |

### 8.4 Career signals (non-certification)

Career progression displays are **motivational and reflective**. They do not replace Silver or Gold certification gates.

| Signal | Source | Display |
|--------|--------|---------|
| Missions completed | Scenario runs | Profession experience meter |
| Business outcomes achieved | Compliance + Run Report | Mission success portfolio |
| KPI competence | M4 interpretation quality | Analyst readiness indicator |
| Leadership decisions | M5 decision steps | Leadership readiness indicator |

### 8.5 Future ERP roles

The programme prepares graduates for ERP-adjacent roles in industry:

- WMS Application Consultant
- ERP Logistics Analyst
- Supply Chain Systems Coordinator
- Inventory Record Accuracy Lead
- Distribution Operations Supervisor

TEC.ERP will extend career pathways into finance, manufacturing, and HR modules using the same enterprise world.

### 8.6 Student identity framing

| Legacy framing | Enterprise framing |
|----------------|-------------------|
| "Student account" | "Professional profile — Concorde Logistics assignment" |
| "Scenario list" | "Mission board — open assignments" |
| "Score 70/100" | "Mission outcome — business result + operational score" |
| "Module 3" | "Inventory career chapter" |

---

## Part IX — ERP Explorer (future feature architecture)

### 9.1 Purpose

ERP Explorer is a **concept translation layer**. It teaches that business processes are universal while ERP products are implementations. Students learn **what** happens in any ERP, not **where one vendor hides a button**.

**No vendor UI reproduction.** ERP Explorer uses process diagrams, concept cards, and comparison tables — never screenshots or cloned interfaces.

### 9.2 Concept-first mapping model

Every TEC.WMS business process maps to a **canonical process definition**, then to vendor implementations:

```
Business Process (canonical)
        │
        ├── Concept card (what/why/who)
        ├── TEC.WMS execution (tool practice)
        └── ERP Explorer map
                ├── SAP (conceptual module + transaction family)
                ├── Microsoft Dynamics (conceptual module)
                ├── Oracle (conceptual module)
                └── Odoo (conceptual module)
```

### 9.3 Canonical process library (initial)

| Process ID | Business process | TEC.WMS anchor |
|------------|------------------|----------------|
| PROC-PO | Purchase order management | ME21N |
| PROC-GR | Goods receipt / dock validation | MIGO |
| PROC-PUT | Putaway / slotting | LT01 / PUTAWAY |
| PROC-PICK | Pick execution | Pick/GI flow |
| PROC-SHIP | Shipment confirmation | VL02N / GI |
| PROC-CC | Physical inventory / cycle count | MI01 |
| PROC-ADJ | Inventory adjustment | MI01 / adjustment |
| PROC-REP | Replenishment trigger | Min/max, ROP |
| PROC-KPI | Performance diagnosis | KPI Tower |
| PROC-PEAK | Integrated crisis operations | M5 capstone |

### 9.4 Vendor mapping format (conceptual)

Each process card contains:

| Field | Example (PROC-GR) |
|-------|-------------------|
| **Universal definition** | Recording inbound goods against a purchase commitment, updating stock liability |
| **Business trigger** | Supplier delivery arrives at dock |
| **Key documents** | PO, delivery note, GR document |
| **Stock impact** | Unrestricted use or quality hold |
| **SAP family** | MM — Inventory Management; MIGO movement type |
| **Dynamics family** | Warehouse management — product receipt |
| **Oracle family** | Inventory — receiving transaction |
| **Odoo family** | Inventory — validate receipt (stock move) |
| **Transferable concept** | "No GR, no stock" — dock-to-system reconciliation |

### 9.5 ERP Explorer access points (future)

- Fiche Mission — "Concept transfer" link per mission
- OIL Panel — "In industry ERPs" expandable card
- Debrief — "What you practiced vs how vendors implement"
- Career portfolio — process mastery map

### 9.6 Pedagogical guardrails

1. Vendor names are **reference**, not endorsement
2. No certification question asks "which button in SAP"
3. Assessment remains on **reasoning and execution** in TEC.WMS
4. ERP Explorer is supplementary — never required for Silver/Gold gates unless programme amends Constitution

---

## Part X — Enterprise Experience Principles (Golden Rules)

Every future feature — UX, UI, content, AI, narrative, assessment display, instructor tool — **must satisfy all five principles** before institutional approval.

### Principle 1 — Profession simulation

**Question:** Which profession is being simulated?

**Pass criteria:** Feature identifies a role with authority boundaries, department home, and realistic responsibilities. "User" or "student" alone is insufficient.

**Fail example:** Generic "complete the form" prompt with no role context.

### Principle 2 — Business problem

**Question:** Which business problem is being solved?

**Pass criteria:** Feature states the operational or commercial consequence at stake — SLA, stock truth, capacity, cost, customer satisfaction.

**Fail example:** Step list with no why.

### Principle 3 — Professional screen rationale

**Question:** Why would a real professional open this screen?

**Pass criteria:** Feature justification references evidence, decision, or accountability need — not tutorial sequencing alone.

**Fail example:** Screen exists only because step 3 requires it.

### Principle 4 — Universal concept transfer

**Question:** What concept transfers to every ERP?

**Pass criteria:** Feature links to a canonical process (Part IX) or BRIDGE reasoning step applicable across vendors.

**Fail example:** TEC.WMS-specific trick with no industry generalization.

### Principle 5 — Engagement with integrity

**Question:** Does this improve student engagement?

**Pass criteria:** Engagement comes from mission stakes, career meaning, or clarity — not from gamification that bypasses reasoning.

**Fail example:** Points badge for clicking faster; AI giving answers to reduce frustration.

### Golden Rules review gate

| Stage | Reviewer | Artifact |
|-------|----------|----------|
| Design | Pedagogy owner | Enterprise Experience Principles checklist |
| Implementation | Engineering lead | Manifesto compliance note in PR |
| Release | Programme leadership | RC release audit appendix |

---

## Part XI — Scenario transformation map (SCN-001 → SCN-017)

This map defines the **enterprise narrative target** for each existing scenario. Simulation steps and compliance logic remain unchanged.

| SCN | Legacy focus | Enterprise mission framing | Primary supervisor | Department |
|-----|--------------|---------------------------|-------------------|------------|
| SCN-001 | End-to-end nominal flow | First solo assignment — prove dock-to-ship integrity | Marc-André Tremblay | Warehouse |
| SCN-002 | Ghost GR detection | Reconcile system vs dock — supplier delivery blocked | David Okonkwo | Quality |
| SCN-003 | Stockout / emergency PO | Protect NordPack order — expedited supply decision | Jean-Philippe Morin | Procurement |
| SCN-004 | Cycle count variance | Inventory truth for month-end close | Aisha Rahman | Inventory |
| SCN-005 | Multi-SKU compliance | Shift handover — full accountability chain | Marc-André Tremblay | Operations |
| SCN-006 | Structured putaway | Clear the dock — slotting under time pressure | Marc-André Tremblay | Receiving |
| SCN-007 | Capacity overflow | Prevent slot saturation — split decision | Aisha Rahman | Warehouse |
| SCN-008 | FIFO execution | Laurentian Foods freshness compliance | Aisha Rahman | Warehouse |
| SCN-009 | Replenishment trigger | Prevent stockout before pick wave | Sophie Lachance | Planning |
| SCN-010 | Min/max tuning | Balance carrying cost vs service | Sophie Lachance | Inventory |
| SCN-011 | Multi-bin accuracy | Zone B audit — management visibility | David Okonkwo | Quality |
| SCN-012 | KPI rotation review | CFO Q3 review — rotation band justification | Élise Beaumont | Management |
| SCN-013 | Service level diagnosis | NordPack SLA risk — root cause plan | Mélanie Gagnon | Customer Service |
| SCN-014 | Multi-KPI capstone | S&OP board presentation — trade-off decision | Élise Beaumont | Management |
| SCN-015 | Peak preload | Prepare CDC for volume surge | Marc-André Tremblay | Operations |
| SCN-016 | Peak execution | Hour-by-hour SLA defense | Mélanie Gagnon | Customer Service |
| SCN-017 | Strategic capstone | Executive decision — cost vs service vs capacity | Élise Beaumont | Management |

---

## Part XII — Instructor and debrief architecture

### 12.1 Instructor role in enterprise experience

Instructors are **mission commanders**, not software trainers. Institutional materials guide:

- Pre-mission briefing alignment with slides
- Monitor supervision via Teacher Dashboard
- Debrief facilitation using business outcome framing
- Certification gate verification (unchanged)

### 12.2 Debrief structure

Every scenario debrief follows:

1. **Business result** — Was the mission outcome achieved for Concorde Logistics?
2. **Evidence trail** — What documents and monitors proved the analysis?
3. **Decision review** — What trade-off did the professional face?
4. **Concept transfer** — What applies in any ERP (ERP Explorer preview)?
5. **Career reflection** — What profession skill was demonstrated?

### 12.3 Run Report elevation

Run Report remains the technical debrief artifact. RC18-A adds:

- Mission title and business problem restatement
- Supervisor evaluation narrative (template, character-voiced)
- Career signal summary (non-gating)

---

## Part XIII — Governance and amendment

### 13.1 Document ownership

| Role | Responsibility |
|------|----------------|
| Collège de la Concorde programme leadership | Constitutional authority |
| Pedagogy owner | Amendment initiation |
| Engineering lead | Implementation fidelity |
| Visual Learning System curator | TEDS and VLS alignment |

### 13.2 Amendment process

1. Proposed change documented with Enterprise Experience Principles assessment
2. Pedagogy owner review for Constitution compatibility
3. Programme leadership approval
4. Version increment (v1.1, v2.0, etc.)
5. Dependent artifacts updated: Visual Bible, instructor guides, mission briefing content

### 13.3 Version history

| Version | Release | Summary |
|---------|---------|---------|
| **1.0** | RC18-A | Initial Enterprise Experience Manifesto — architecture only |

### 13.4 Related artifacts (subordinate to this manifesto for experience; parallel for compliance)

- TEC.WMS Pedagogical Constitution
- Visual Bible v1.0
- TEC.WMS Guide Programme Officiel
- Guide Enseignant
- Certification Package v1

---

## Part XIV — Success criteria for RC18-A

RC18-A is complete when this document is institutionalized as the single source of truth. Implementation waves (RC18-B onward) will reference but not alter these architectural decisions without amendment.

| Criterion | Status |
|-----------|--------|
| Vision and mission philosophy defined | Complete in this document |
| Pedagogical flow preserved and elevated | Complete |
| Fiche Mission briefing schema defined | Complete |
| Concorde Logistics enterprise architecture defined | Complete |
| Character roster with full attributes | Complete |
| AI mentor architecture defined (no API) | Complete |
| TEC Enterprise Design System defined | Complete |
| Career experience architecture defined | Complete |
| ERP Explorer future feature defined | Complete |
| Enterprise Experience Principles (Golden Rules) | Complete |
| SCN-001→017 transformation map | Complete |
| No production code modified | Verified — documentation only |

---

## Closing declaration

TEC.WMS has proven that students can execute ERP/WMS transactions with institutional rigor. The next era proves they can **think like professionals** inside a living enterprise — with business stakes, human relationships, career meaning, and concepts that transfer to any system they will encounter in industry.

The simulation engine is the foundation. The enterprise experience is the building.

This manifesto is the blueprint.

---

**TEC Enterprise Experience Manifesto v1.0**  
**RC18-A — Official Foundation Document**  
**Collège de la Concorde · Montréal · TEC.LOG · TEC.WMS**

*End of document.*
