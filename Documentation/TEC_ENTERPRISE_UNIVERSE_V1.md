# TEC Enterprise Universe v1.0

**Document type:** Official Enterprise Architecture — Persistent World Canon  
**Programme:** TEC.LOG — Gestion intégrée des stocks et performance logistique  
**Institution:** Collège de la Concorde — Montréal  
**Application:** TEC.WMS (Mini-WMS Concorde) · Future: TEC.ERP  
**Release:** RC18-C  
**Status:** SINGLE SOURCE OF TRUTH — Enterprise narrative architecture (no implementation)

---

## Authority and precedence

This document is the **operational canon** for Concorde Logistics — the persistent enterprise world defined in the [TEC Enterprise Experience Manifesto v1.0](./TEC_ENTERPRISE_EXPERIENCE_MANIFESTO_V1.md) (RC18-A).

| Domain | Authority |
|--------|-----------|
| Enterprise world identity, org structure, stakeholders, culture, incidents | **This document** |
| Experience layer philosophy, Fiche Mission schema, design system, AI mentor | Enterprise Experience Manifesto v1.0 |
| Scenario compliance, scoring gates, certification thresholds | TEC.WMS Pedagogical Constitution |
| Transaction execution, bin geography, seed data contracts | Simulation engine (unchanged) |

**Conflict resolution:** If this document contradicts the Manifesto on enterprise narrative, the Manifesto prevails until reconciled by programme leadership. If this document contradicts simulation geography (zone codes, bin IDs, capacity rules), **simulation engine prevails** — narrative must adapt, not bins.

**Explicit exclusions:** No production code. No database schema. No scenario logic changes. No API implementation.

---

## Executive summary

**Concorde Logistics Inc.** is a regional third-party logistics (3PL) and B2B distribution enterprise headquartered in Greater Montreal. For the TEC.LOG programme, it functions as a **living professional environment** — not a backdrop for software exercises.

Students are **professionals on assignment** at the Concorde Distribution Centre (CDC) for the duration of their certification journey. Every mission (SCN-001 through SCN-017) occurs inside this universe with stable departments, accounts, characters, and recurring operational patterns.

As a supply chain operating model, Concorde Logistics sits at the intersection of **execution excellence** (warehouse floor), **inventory governance** (stock truth), and **customer promise management** (SLA). The ERP/WMS — TEC.WMS in-universe — is the system of record. Professionals are judged on **business outcomes**, not button clicks.

This document defines the persistent architecture required for RC18-C and all subsequent experience-layer implementation waves.

---

## Part I — Corporate identity

### 1.1 Legal and commercial profile

| Attribute | Definition |
|-----------|------------|
| **Legal name** | Concorde Logistics Inc. |
| **Trade name** | Concorde Logistics |
| **Headquarters** | 1200 boulevard Marcel-Laurin, Saint-Laurent (Montréal), QC |
| **Founded** | 2008 (fictional) |
| **Industry** | 3PL · B2B distribution · Regional fulfillment |
| **Revenue model** | Storage + handling fees · Value-added services · Peak surge contracts |
| **Geographic focus** | Québec · Ontario · selective Maritimes accounts |
| **ERP/WMS platform** | TEC.WMS (integrated ERP/WMS — in-universe system of record) |
| **Workforce (CDC)** | ~185 FTE equivalent (shifts + agency at peak) |
| **Institutional partnership** | Collège de la Concorde — co-developed talent pipeline and TEC.LOG practicum site |

### 1.2 Strategic positioning

Concorde Logistics does not own the inventory it moves. It **owns the promise**: accurate receipt, governed storage, on-time dispatch, and auditable stock truth for mid-market manufacturers and retailers who cannot justify a dedicated national DC.

**Competitive differentiators (in-universe):**

1. **Bilingual operations** — FR/EN floor and customer communication without friction
2. **Data-driven control tower** — KPI visibility for clients and internal S&OP
3. **Compliance discipline** — quality holds, FIFO enforcement, ghost-document prevention
4. **Peak readiness** — surge capacity contracts (public-sector and seasonal retail)

### 1.3 Mission, vision, values

| Statement | Content |
|-----------|---------|
| **Mission** | Deliver dependable logistics outcomes so our clients can focus on production and sales. |
| **Vision** | Be the most trusted regional 3PL in Eastern Canada for mid-market B2B fulfillment. |
| **Values** | Safety-first · Stock truth · Customer promise · Continuous improvement · Evidence before action |

---

## Part II — Business units

Concorde Logistics organizes commercially and operationally into **four business units (BU)**. The CDC is shared infrastructure; BUs define service lines, P&L accountability, and client portfolios.

### 2.1 Business unit registry

| BU code | Name (FR) | Name (EN) | Scope | Primary clients | Curriculum weight |
|---------|-----------|-----------|-------|-----------------|-------------------|
| **BU-DIST** | Distribution générale | General Distribution | Standard B2B pick-pack-ship, storage, replenishment | NordPack, Artisan Québécois | M1–M3 core |
| **BU-FRESH** | Chaîne du frais contrôlé | Controlled Fresh Chain | FIFO-enforced, lot-tracked, shorter rotation windows | Laurentian Foods | M2, M3 |
| **BU-IND** | Composants industriels | Industrial Components | Higher SKU complexity, min/max and ROP planning | Via St-Laurent supply flows | M3, M4 |
| **BU-PEAK** | Opérations de pointe | Peak Operations | Surge contracts, cross-dock preload, crisis command | Ministère des Transports (contract) | M5 |

### 2.2 BU operating principles

| Principle | Rule |
|-----------|------|
| **Shared CDC** | All BUs execute inside CDC zones; BU is a **commercial and planning lens**, not a separate building |
| **Inventory ownership** | Client-owned inventory; Concorde owns **accuracy and SLA** |
| **Planning separation** | Each BU has distinct min/max policies and rotation targets |
| **Peak overlay** | BU-PEAK temporarily overrides standard wave priorities during surge windows |
| **Student assignment** | Students rotate through BU contexts via missions — not via org reassignment |

### 2.3 BU-to-module narrative arc

| Module | Dominant BU context | Enterprise chapter |
|--------|---------------------|-------------------|
| M1 | BU-DIST | Onboarding — learn the standard dock-to-ship contract |
| M2 | BU-DIST + BU-FRESH | Storage strategy — capacity and FIFO under real constraints |
| M3 | BU-IND + BU-DIST | Stock governance — replenishment and inventory investment |
| M4 | All BUs (control tower view) | Performance diagnosis — KPI ownership across service lines |
| M5 | BU-PEAK | Crisis leadership — integrated surge operations |

---

## Part III — Organizational structure and departments

### 3.1 Governance model

Concorde Logistics runs a **functional organization with matrix escalation** at peak. Department heads report to the Operations Director. Customer Service and Planning have dotted-line accountability to BU client leads.

### 3.2 Department registry

| Code | Department (FR) | Department (EN) | Headcount (CDC) | Core mandate | Key KPIs |
|------|-----------------|-----------------|---------------|--------------|----------|
| **MGT** | Direction | Management | 8 | Strategy, S&OP, crisis command | EBITDA, OTIF, inventory accuracy |
| **OPS** | Opérations intégrées | Integrated Operations | 12 | Cross-functional execution, shift command | Dock turnaround, wave completion |
| **WH** | Entrepôt | Warehouse | 68 | Safe floor execution — putaway, pick, count | Incidents, productivity, safety |
| **REC** | Réception | Receiving | 22 | Dock-to-stock integrity | GR accuracy, dock dwell time |
| **SHP** | Expédition | Shipping | 24 | On-time dispatch | On-time ship, load accuracy |
| **INV** | Inventaire | Inventory | 14 | Stock truth, allocation, adjustments | Inventory accuracy %, cycle count closure |
| **PROC** | Approvisionnement | Procurement | 9 | Supply continuity (client-directed and Concorde consumables) | PO cycle time, supplier OTIF |
| **PLAN** | Planification | Planning | 11 | Demand-supply balance, min/max, ROP | Fill rate, days of supply, stockouts |
| **CS** | Service client | Customer Service | 10 | Order promise, SLA tracking | OTIF, confirmation lead time |
| **FIN** | Finance | Finance | 7 | Valuation, invoice match, write-off governance | Invoice accuracy, inventory valuation |
| **QA** | Qualité | Quality | 6 | Holds, compliance, audit trail | Hold release time, non-conformance rate |

**Note:** REC and SHP are **subordinate operationally to WH** but maintain distinct process ownership — receiving and shipping are curriculum-first departments, not HR silos.

### 3.3 Department process ownership

| Process ribbon stage | Owning department | Supporting departments |
|---------------------|-------------------|------------------------|
| Supplier commitment | PROC | PLAN, FIN |
| Dock receipt | REC | QA, WH |
| Putaway / slotting | WH | INV, PLAN |
| Storage governance | WH | INV, QA |
| Replenishment trigger | PLAN | INV, PROC |
| Pick / pack | WH | CS |
| Dispatch | SHP | WH, CS |
| Customer confirmation | CS | SHP, MGT (escalation) |
| Inventory audit | INV | QA, FIN |
| Performance review | MGT | PLAN, CS, FIN |

### 3.4 Escalation ladder

```
Floor Operator → Shift Lead (WH) → Department Supervisor → Operations Coordinator (OPS)
        → Functional Lead (PROC/PLAN/CS/QA/INV) → Operations Director (MGT)
```

**Escalation triggers:** SLA breach within 4 hours · quality hold > 2 hours · inventory variance > threshold · safety incident · peak wave failure.

---

## Part IV — Warehouse and facility architecture

### 4.1 Facility network

| Facility code | Name | Type | Role in universe | Simulation scope |
|---------------|------|------|------------------|------------------|
| **CL-HQ** | Siège social Saint-Laurent | Corporate office | S&OP board, executive decisions, client QBRs | Narrative only (M4/M5) |
| **CDC** | Centre de distribution Concorde | Primary DC — 250,000 sq ft | **All TEC.WMS missions execute here** | Full simulation |
| **CL-XD-01** | Plateforme de cross-dock Laval | Cross-dock satellite | Peak preload staging (M5 narrative) | Narrative only |
| **CT-01** | Tour de contrôle (within CDC) | Control tower mezzanine | KPI missions, alert triage | M4/M5 monitors |

### 4.2 CDC physical layout

| Zone family | Zone codes | Function | Capacity narrative | Curriculum stress |
|-------------|------------|----------|-------------------|-------------------|
| **Receiving** | REC-01, REC-02 | Inbound docks | 300 units staging each | Ghost GR, dock pressure, supplier variance |
| **Picking** | A-01, A-02 (PICKING) | Fast movers, order fulfillment | 200 units/bin | Pick accuracy, wave timing |
| **Storage** | B-01, B-02 (STOCKAGE) | Bulk reserve racks | 500 units/bin | Slotting, overflow split (SCN-007) |
| **Reserve** | C-01 (RESERVE) | Deep reserve, slow movers | 1000 units/bin | Replenishment pulls |
| **Transit** | TRANSIT-01 | Temporary staging | 400 units | Cross-dock and overflow buffer |
| **Shipping** | EXP-01, EXP-02 | Outbound docks | 300 units staging each | SLA dispatch, load accuracy |
| **Quality hold** | QA-HOLD | Quarantine | Variable | Compliance stops flow |
| **Control tower** | CT-01 | Monitoring and decisions | N/A | KPI diagnosis, S&OP |

### 4.3 Warehouse operating parameters

| Parameter | Standard | Peak (BU-PEAK) |
|-----------|----------|----------------|
| Shifts | 2 × 10h (day/evening) | 3 × 8h + Saturday surge |
| Receiving windows | 07:00–15:00 primary | Extended to 18:00 |
| Cut-off dispatch | 14:00 same-day regional | 16:00 with approval |
| Target inventory accuracy | ≥ 98.5% | ≥ 98.0% (volume tolerance) |
| Dock dwell max | 4 hours | 2 hours |
| FIFO enforcement | BU-FRESH mandatory | BU-FRESH mandatory |

### 4.4 Slotting philosophy

1. **A-zone** — high-velocity SKUs, pick-facing, smaller lots  
2. **B-zone** — reserve storage, capacity-managed, overflow splits allowed  
3. **C-zone** — deep reserve, replenishment-driven  
4. **REC/EXP** — temporal locations; inventory should not **live** on docks  
5. **QA-HOLD** — no pick until release — non-negotiable  

---

## Part V — Customer portfolio

### 5.1 Customer registry (canonical)

| Account code | Customer | BU | Industry | SLA profile | Curriculum role |
|--------------|----------|-----|----------|-------------|-----------------|
| **C-NORD** | NordPack Inc. | BU-DIST | Industrial packaging | OTIF ≥ 96% · confirmation by 14:00 | SLA-sensitive; SCN-003, SCN-013, SCN-016 |
| **C-LAUR** | Laurentian Foods | BU-FRESH | Food ingredients distribution | FIFO max 90 days · lot traceability | Freshness compliance; SCN-008 |
| **C-ARTQ** | Artisan Québécois Co-op | BU-DIST | Specialty retail supply | OTIF ≥ 94% · seasonal variability | Replenishment variability; M3 |
| **C-TECH** | TechnoFab Montréal | BU-IND | Light manufacturing | Line-stop risk · 24h critical SKU | Emergency replenishment; M3 |
| **C-MTQ** | Ministère des Transports (contract) | BU-PEAK | Public infrastructure | Surge OTIF ≥ 92% during Peak Week | Volume spike; SCN-015, SCN-016, SCN-017 |
| **C-PAPI** | Papeterie des Cantons | BU-DIST | Office supplies wholesale | Standard B2B · monthly scorecard | KPI rotation review; SCN-012 context |

### 5.2 Customer contact personas (external)

| Customer | Contact | Title | Communication pattern |
|----------|---------|-------|----------------------|
| NordPack Inc. | **Isabelle Fontaine** | Procurement Manager | Direct, deadline-first: "We need confirmation before the truck leaves your dock." |
| Laurentian Foods | **Marc Desjardins** | Quality & Compliance Lead | Procedure-first: cites lot numbers and shelf-life policy |
| Ministère des Transports | **Direction des approvisionnements** | Contract authority (role, not individual) | Formal, document-driven, escalation through CS |
| TechnoFab Montréal | **Raj Patel** | Production Planner | Impact-first: translates stockouts into line-stop risk |

### 5.3 Customer promise rules

| Rule | Description |
|------|-------------|
| **No silent backorders** | CS must acknowledge shortfalls before cut-off |
| **Confirmation discipline** | OTIF measured from **confirmed** promise date |
| **Quality segregation** | BU-FRESH inventory never ships from QA-HOLD |
| **Peak re-prioritization** | BU-PEAK contract may temporarily defer non-critical waves — requires MGT approval |

---

## Part VI — Supplier ecosystem

### 6.1 Supplier registry (canonical)

| Account code | Supplier | Origin | Category | Lead time | Reliability profile | Curriculum role |
|--------------|----------|--------|----------|-----------|---------------------|-----------------|
| **S-STLA** | St-Laurent Components | Montréal, QC | Industrial components | 3–5 days | Reliable · recurring PO/GR | Baseline inbound; M1 flows |
| **S-GLAC** | Grands Lacs Industrial | Hamilton, ON | Bulk industrial supply | 7–10 days | Capacity constraints · MOQ pressure | Expedite decisions; SCN-003 |
| **S-NORD** | Nordic Supply Co. | Laval, QC | Packaging consumables | 2–4 days | High volume · occasional partials | NordPack supply chain |
| **S-AGRO** | AgroSource Québec | Drummondville, QC | Food-grade ingredients | 4–6 days | Lot-certified · QA documentation | Laurentian Foods inbound |
| **S-PACK** | Emballages Richelieu | Beloeil, QC | Corrugated and film | 5–7 days | Seasonal lead-time stretch | Peak preload pressure |
| **S-GLOB** | Global Parts Ltd. | Chicago, IL (import) | Long-lead components | 14–21 days | Emergency air freight option | M3 procurement stress |

### 6.2 Supplier performance tiers

| Tier | Criteria | Concorde treatment |
|------|----------|-------------------|
| **A** | OTIF ≥ 95%, complete documentation | Auto-release GR after validation |
| **B** | OTIF 85–94% | QA spot-check, planner safety stock bump |
| **C** | OTIF < 85% or recurring ASN mismatch | Hold until inspection; PROC escalation |

**Canonical assignments:** St-Laurent Components (A) · Grands Lacs Industrial (B) · Global Parts Ltd. (C for documentation, not quality).

### 6.3 Supplier contact personas (external)

| Supplier | Contact | Title | Communication pattern |
|----------|---------|-------|----------------------|
| St-Laurent Components | **Caroline Bélanger** | Account Manager | Responsive, confirms quantities and dock appointments |
| Grands Lacs Industrial | **Mike Sullivan** | Customer Service Lead | Capacity-aware: "We can partial now or full next week." |
| AgroSource Québec | **Dr. Nathalie Roy** | Quality Documentation | Sends lot certs; expects hold if paperwork incomplete |

### 6.4 Inbound compliance rules

1. **No GR, no stock** — dock quantity must match PO before unrestricted use  
2. **ASN mismatch** — triggers QA hold and PROC notification  
3. **Partial receipt** — allowed with documented short-ship reason code  
4. **Ghost document** — any unposted GR is treated as **INC-001** (see Part VII)  

---

## Part VII — Recurring incidents catalogue

Recurring incidents are the **operational heartbeat** of Concorde Logistics. They are not random bugs — they are predictable failure modes of real 3PL operations. Each incident type maps to curriculum missions and Fiche Mission briefing language.

### 7.1 Incident registry

| ID | Name (FR) | Name (EN) | Typical trigger | Primary owner | Severity | SCN mapping |
|----|-----------|-----------|-----------------|---------------|----------|-------------|
| **INC-001** | Réception fantôme | Ghost goods receipt | GR created but not posted; dock shows stock, system does not | QA / REC | High | SCN-002 |
| **INC-002** | Rupture de stock | Stockout / insufficient ATP | SO exceeds available quantity; pick wave blocked | CS → PLAN → PROC | High | SCN-003 |
| **INC-003** | Écart d'inventaire | Cycle count variance | Physical ≠ system beyond tolerance | INV | Medium–High | SCN-004, SCN-009, SCN-010 |
| **INC-004** | Anomalies multiples | Multi-anomaly shift | Concurrent ghost GR + variance + dispatch pressure | OPS | Critical | SCN-005 |
| **INC-005** | Quai saturé | Dock saturation | Putaway delay; REC staging exceeds dwell target | WH / REC | Medium | SCN-006 |
| **INC-006** | Dépassement de capacité | Bin capacity overflow | Single-bin quantity exceeds max capacity | WH | Medium | SCN-007 |
| **INC-007** | Violation FIFO | FIFO breach risk | Older lot bypassed for pick or putaway | WH / QA | High | SCN-008 |
| **INC-008** | Point de réappro atteint | Replenishment trigger | Min breached before pick wave | PLAN | Medium | SCN-009 |
| **INC-009** | Déséquilibre Min/Max | Min/max imbalance | Carrying cost vs service level trade-off | PLAN / INV | Medium | SCN-010, SCN-011 |
| **INC-010** | Écart multi-emplacements | Multi-bin accuracy drift | Zone audit reveals patterned variance | QA / INV | High | SCN-011 |
| **INC-011** | Rotation hors bande | Rotation band breach | Inventory aging outside CFO-approved band | MGT / PLAN | High | SCN-012 |
| **INC-012** | Risque SLA client | Customer SLA at risk | OTIF drop; NordPack confirmation deadline | CS | Critical | SCN-013 |
| **INC-013** | Conflit KPI | Multi-KPI conflict | OTIF vs inventory accuracy vs cost — S&OP decision | MGT | Critical | SCN-014 |
| **INC-014** | Précharge de pointe | Peak preload surge | Inbound volume exceeds standard slot plan | OPS | High | SCN-015 |
| **INC-015** | Défense SLA horaire | Hour-by-hour SLA defense | Wave failures cascade during Peak Week | CS / OPS | Critical | SCN-016 |
| **INC-016** | Arbitrage exécutif | Executive trade-off | Cost vs service vs capacity — strategic capstone | MGT | Critical | SCN-017 |

### 7.2 Incident response doctrine

| Phase | Action | Professional standard |
|-------|--------|----------------------|
| **Detect** | Monitor, count, dock walk, cockpit alert | Evidence before action — no posting on assumption |
| **Triage** | Classify severity, notify owner department | Escalate early when SLA < 4h |
| **Contain** | Hold, re-prioritize wave, stop non-conforming flow | QA-HOLD is authoritative |
| **Correct** | Post, adjust, replenish, re-slot | Document every system movement |
| **Review** | Shift debrief, root cause, KPI update | Feed continuous improvement |

### 7.3 Seasonal and calendar patterns

| Period | Pattern | Typical incidents |
|--------|---------|-----------------|
| Q1 | Post-holiday returns processing | INC-003, INC-005 |
| Q2 | Manufacturing ramp (BU-IND) | INC-002, INC-008 |
| Q3 | CFO inventory review | INC-011, INC-009 |
| Q4 | Retail preload | INC-014, INC-006 |
| **Peak Week** (M5) | Public contract surge | INC-012, INC-015, INC-016 |

---

## Part VIII — Professional characters

### 8.1 Canonical character roster

The following eight characters plus Coach ERP are **immutable supervisors** per Manifesto Part V. This document adds **reporting relationships** and **extended attributes** only.

#### Marc-André Tremblay — Warehouse Supervisor

| Attribute | Definition |
|-----------|------------|
| **Role** | Warehouse Supervisor — Receiving & Storage |
| **Department** | WH (dotted line to REC) |
| **Reports to** | Élise Beaumont |
| **Mission** | Ensure floor execution matches system truth |
| **Authority** | Shift tasking, putaway approval, overflow split decisions |
| **Personality** | Direct, experienced, calm under pressure |
| **Communication style** | Short sentences; asks *"Qu'est-ce que le moniteur montre?"* before suggesting action |
| **Signature phrase** | *"Le quai ne ment pas. Le système doit suivre."* |
| **Appears in** | SCN-001, SCN-005, SCN-006, SCN-015 · M1, M2, M5 |

#### Aisha Rahman — Senior Warehouse Operator

| Attribute | Definition |
|-----------|------------|
| **Role** | Senior Warehouse Operator |
| **Department** | WH |
| **Reports to** | Marc-André Tremblay |
| **Mission** | Mentor junior staff on physical-digital alignment |
| **Authority** | Bin verification, FIFO coaching, cycle count execution |
| **Personality** | Patient, precise, evidence-first |
| **Communication style** | Floor examples; *"Visitez le rack avant de poster."* |
| **Signature phrase** | *"Si le lot le plus vieux est derrière, le client reçoit le mauvais produit."* |
| **Appears in** | SCN-004, SCN-007, SCN-008 · M2 |

#### Jean-Philippe Morin — Senior Buyer

| Attribute | Definition |
|-----------|------------|
| **Role** | Senior Buyer |
| **Department** | PROC |
| **Reports to** | Élise Beaumont |
| **Mission** | Maintain supply continuity at acceptable cost |
| **Authority** | PO approval, expedite authorization (within band) |
| **Personality** | Analytical, cost-aware, deadline-driven |
| **Communication style** | Lead times and MOQ; demands business justification for expedite |
| **Signature phrase** | *"Un air freight se justifie par une ligne arrêtée, pas par un stress."* |
| **Appears in** | SCN-003 · M1, M3 |

#### Sophie Lachance — Demand Planner

| Attribute | Definition |
|-----------|------------|
| **Role** | Demand Planner |
| **Department** | PLAN |
| **Reports to** | Élise Beaumont |
| **Mission** | Balance inventory investment against service level |
| **Authority** | Min/max recommendations, ROP triggers, safety stock proposals |
| **Personality** | Data-curious, collaborative, scenario-thinker |
| **Communication style** | Trade-off framing; *"what-if"* language |
| **Signature phrase** | *"Chaque unité en rack a un coût. Chaque rupture a un prix."* |
| **Appears in** | SCN-009, SCN-010, SCN-011 · M3, M4 |

#### David Okonkwo — Quality Specialist

| Attribute | Definition |
|-----------|------------|
| **Role** | Quality Specialist |
| **Department** | QA |
| **Reports to** | Élise Beaumont |
| **Mission** | Prevent non-conforming inventory from reaching customers |
| **Authority** | Hold/release, GR validation gate, audit sign-off |
| **Personality** | Principled, detail-oriented, non-negotiable on compliance |
| **Communication style** | Cites procedure; requires document evidence before sign-off |
| **Signature phrase** | *"Pas de preuve, pas de libération."* |
| **Appears in** | SCN-002, SCN-011 · M1, M2 |

#### Mélanie Gagnon — Customer Service Lead

| Attribute | Definition |
|-----------|------------|
| **Role** | Customer Service Lead |
| **Department** | CS |
| **Reports to** | Élise Beaumont |
| **Mission** | Protect customer promise dates and satisfaction |
| **Authority** | Order priority, SLA escalation, client communication |
| **Personality** | Customer-advocate, urgent when SLA at risk |
| **Communication style** | Opens with customer impact; *"NordPack a besoin d'une confirmation pour 14h."* |
| **Signature phrase** | *"Le client ne voit pas notre WMS. Il voit notre promesse."* |
| **Appears in** | SCN-013, SCN-016 · M1, M5 |

#### Élise Beaumont — Operations Director

| Attribute | Definition |
|-----------|------------|
| **Role** | Operations Director |
| **Department** | MGT |
| **Reports to** | CEO (off-screen) |
| **Mission** | Align warehouse performance with business strategy |
| **Authority** | KPI ownership, cross-department arbitration, peak command |
| **Personality** | Strategic, composed, expects concise status updates |
| **Communication style** | Bottom-line impact; *"Quelle est la conséquence d'affaires?"* |
| **Signature phrase** | *"Donnez-moi le fait, l'impact, et votre recommandation."* |
| **Appears in** | SCN-012, SCN-014, SCN-017 · M4, M5 |

#### Coach ERP — Institutional AI Mentor

| Attribute | Definition |
|-----------|------------|
| **Role** | ERP Coach — TEC.LOG institutional mentor |
| **Department** | Cross-functional (reports to Collège de la Concorde programme) |
| **Mission** | Develop professional judgment without replacing it |
| **Authority** | Socratic guidance only — no transaction execution |
| **Personality** | Supportive, never condescending; respects student agency |
| **Communication style** | Questions before hints; never provides compliance answers in Evaluation mode |
| **Appears in** | All modules — AI layer (future) |

### 8.2 Supporting roles (non-supervisor)

These roles populate the universe but **do not** serve as primary mission supervisors unless added by Manifesto amendment.

| Role | Typical name pattern | Function |
|------|---------------------|----------|
| Shift Lead | Rotating floor lead | Task assignment, first-line escalation |
| Inventory Clerk | Pool of 4–6 staff | Count execution, label verification |
| Finance Analyst | **Lucie Paquette** | Month-end valuation, write-off review |
| Carrier dispatcher | External voice | Pickup windows, load sealing |
| TEC.LOG Practicant | Student professional profile | Learner on assignment |

### 8.3 Character deployment rules (inherited + extended)

1. Every scenario assigns **one primary supervisor** from the canonical roster  
2. Optional **one cross-functional stakeholder** (e.g., CS during WH mission)  
3. External customer/supplier contacts may appear in briefing — not as supervisors  
4. Supervisor Notes use **character voice** — attributed quote with name and title  
5. No ad-hoc Concorde employee supervisors per scenario  

---

## Part IX — Organizational chart

### 9.1 Executive and functional leadership

```
                         ┌──────────────────────────┐
                         │   CEO (off-screen)       │
                         │   Concorde Logistics Inc.│
                         └────────────┬─────────────┘
                                      │
                         ┌────────────▼─────────────┐
                         │  Élise Beaumont          │
                         │  Operations Director     │
                         │  (MGT)                   │
                         └────────────┬─────────────┘
                                      │
       ┌──────────────┬───────────────┼───────────────┬──────────────┐
       │              │               │               │              │
┌──────▼──────┐ ┌─────▼─────┐ ┌───────▼───────┐ ┌─────▼─────┐ ┌─────▼─────┐
│ Marc-André  │ │ Sophie    │ │ Jean-Philippe │ │ Mélanie   │ │ David     │
│ Tremblay    │ │ Lachance  │ │ Morin         │ │ Gagnon    │ │ Okonkwo   │
│ WH/REC lead │ │ PLAN lead │ │ PROC lead     │ │ CS lead   │ │ QA lead   │
└──────┬──────┘ └─────┬─────┘ └───────┬───────┘ └─────┬─────┘ └─────┬─────┘
       │              │               │               │              │
┌──────▼──────┐       │        ┌──────▼──────┐        │       ┌──────▼──────┐
│ Aisha Rahman│       │        │ Buyers (2)  │        │       │ QA analysts │
│ Sr. Operator│       │        └─────────────┘        │       │ (2)         │
└─────────────┘       │                               │       └─────────────┘
               ┌──────▼──────┐                 ┌──────▼──────┐
               │ Planners (2)│                 │ CS reps (4) │
               └─────────────┘                 └─────────────┘

       ┌─────────────────────────────────────────────────────────────┐
       │  OPS Coordinator (12) — matrix across REC · WH · SHP shifts │
       └─────────────────────────────────────────────────────────────┘
       ┌──────────────────────┐       ┌──────────────────────────────┐
       │ INV Controller pool  │       │ FIN — Lucie Paquette + team  │
       │ (14)                 │       │ (7)                          │
       └──────────────────────┘       └──────────────────────────────┘
```

### 9.2 Shift operations structure (CDC)

```
Day Shift (07:00–17:00)                    Evening Shift (15:00–01:00)
├── REC team (6)                             ├── REC team (5)
├── WH floor (22)                            ├── WH floor (18)
├── SHP team (8)                             ├── SHP team (6)
└── INV/QC support (4)                       └── INV/QC support (3)

Peak overlay: +agency labour · OPS command cell · CS war room
```

### 9.3 Matrix at peak (M5)

During BU-PEAK operations, reporting temporarily shifts:

| Function | Normal lead | Peak command |
|----------|-------------|--------------|
| Floor execution | Marc-André Tremblay | OPS Coordinator + Marc-André |
| Customer promise | Mélanie Gagnon | Mélanie Gagnon (war room) |
| Strategic arbitration | Élise Beaumont | Élise Beaumont (CT-01) |
| Quality gate | David Okonkwo | David Okonkwo (no bypass) |

---

## Part X — Company culture

### 10.1 Cultural pillars

| Pillar | Meaning at Concorde | Observable behaviour |
|--------|---------------------|----------------------|
| **Safety-first** | Physical safety and data safety are equivalent | Stop work on hazard; stop posting on unverified stock |
| **Stock truth** | The system must reflect physical reality | Walk the rack; count before adjust |
| **Customer promise** | OTIF is a contract, not a metric | CS involved before cut-off changes |
| **Continuous improvement** | Every incident feeds a corrective action | Shift debriefs are mandatory, not optional |
| **Evidence before action** | Monitors, documents, labels precede transactions | Ghost GR prevention culture |

### 10.2 Daily rituals

| Ritual | Timing | Participants | Purpose |
|--------|--------|--------------|---------|
| **Shift briefing** | Start of shift | Supervisor + floor | Priorities, hazards, dock schedule |
| **Dock stand-up** | 10:00 | REC + WH + QA | Dwell time review |
| **Wave checkpoint** | Pre-cut-off −2h | SHP + CS | SLA defense |
| **Count huddle** | Post cycle-count | INV + QA | Variance triage |
| **S&OP weekly** | Wednesday 09:00 | MGT + PLAN + PROC + CS | Demand-supply balance |

### 10.3 What Concorde rewards

- Catching a ghost document **before** pick  
- Splitting overflow **without** system rejection  
- Escalating SLA risk **early** with a recommendation  
- Documenting variance **with** root cause  

### 10.4 What Concorde rejects

- Posting to "make the screen green"  
- Bypassing FIFO for speed  
- Shipping from hold without QA release  
- Silent backorders  

### 10.5 TEC.LOG practicum integration

Collège de la Concorde practicants are treated as **junior professionals**, not tourists:

- Assigned Concorde email alias (`@concorde-logistics.sim`)  
- Onboarding day mirrors SCN-001 narrative  
- Certification achievement maps to "assignment complete" career signal  

---

## Part XI — Communication style and protocols

### 11.1 Enterprise voice

Concorde Logistics communicates like a **regional 3PL that reports to clients with numbers and to the floor with clarity**.

| Audience | Tone | Structure |
|----------|------|-----------|
| Internal floor | Direct, imperative, short | Situation → Action → Confirm |
| Cross-department | Professional, evidence-cited | Monitor data + recommendation |
| Customer | Confident, transparent, SLA-aware | Impact → Options → Commitment |
| Supplier | Firm, contractual | PO ref → Quantity → Dock window |
| Management | Bottom-line first | Fact → Business impact → Decision ask |

### 11.2 Bilingual protocol

| Rule | Standard |
|------|----------|
| **Floor language** | French primary in Montréal CDC; English on request |
| **Customer comms** | Match client preference (NordPack: FR · Grands Lacs: EN) |
| **System labels** | Bilingual fields in TEC.WMS |
| **Mission briefings** | Equal semantic depth FR/EN per Pedagogical Constitution |
| **Stable names** | Character and company names never translated |

### 11.3 Channel architecture

| Channel | Use | Response expectation |
|---------|-----|---------------------|
| **TEC.WMS alerts** | System-generated exceptions | Acknowledge within 15 min |
| **Shift radio** | Floor coordination | Immediate |
| **Email** | Customer/supplier documentation | < 2h business hours |
| **Control tower dashboard** | KPI and incident triage | Continuous (M4/M5) |
| **Fiche Mission** | Mission briefing authority | Pre-step reference |
| **Supervisor Notes** | Character-voiced expectations | Read before step 1 |

### 11.4 Status update template (professional standard)

```
SITUATION:   [What happened — one sentence]
EVIDENCE:    [Monitor / document / bin / lot]
IMPACT:      [Customer, cost, SLA, safety]
ACTION:      [What you did or propose]
NEED:        [Decision, approval, or resources]
```

Élise Beaumont expects this structure. Mélanie Gagnon leads with IMPACT. David Okonkwo requires EVIDENCE before approving ACTION.

### 11.5 Priority vocabulary

| Priority (FR) | Priority (EN) | Meaning |
|---------------|---------------|---------|
| Normal | Normal | Standard queue |
| Élevée | High | Same-shift resolution required |
| Critique | Critical | SLA or safety at risk — escalate now |
| Pointe | Peak | Peak Week protocol active |

---

## Part XII — Scenario-to-universe binding matrix

| SCN | Business unit | Customer | Supplier | Warehouse zone | Incident | Primary supervisor |
|-----|---------------|----------|----------|----------------|----------|------------------|
| SCN-001 | BU-DIST | C-PAPI | S-STLA | REC → B → EXP | — (nominal) | Marc-André Tremblay |
| SCN-002 | BU-DIST | — | S-STLA | REC-01 | INC-001 | David Okonkwo |
| SCN-003 | BU-DIST | C-NORD | S-GLAC | REC / A | INC-002 | Jean-Philippe Morin |
| SCN-004 | BU-DIST | — | S-STLA | B-02 | INC-003 | Aisha Rahman |
| SCN-005 | BU-DIST | C-ARTQ | S-STLA | REC / B | INC-004 | Marc-André Tremblay |
| SCN-006 | BU-DIST | — | S-STLA | REC-01 | INC-005 | Marc-André Tremblay |
| SCN-007 | BU-DIST | — | S-GLAC | B-01 | INC-006 | Aisha Rahman |
| SCN-008 | BU-FRESH | C-LAUR | S-AGRO | B-zones | INC-007 | Aisha Rahman |
| SCN-009 | BU-IND | C-TECH | S-STLA | A / B | INC-008 | Sophie Lachance |
| SCN-010 | BU-IND | — | S-GLAC | B-zones | INC-009 | Sophie Lachance |
| SCN-011 | BU-IND | — | S-STLA | B-zones | INC-010 | David Okonkwo |
| SCN-012 | All | C-PAPI | — | CT-01 | INC-011 | Élise Beaumont |
| SCN-013 | BU-DIST | C-NORD | — | CT-01 | INC-012 | Mélanie Gagnon |
| SCN-014 | All | Multiple | — | CT-01 | INC-013 | Élise Beaumont |
| SCN-015 | BU-PEAK | C-MTQ | S-PACK | REC / TRANSIT | INC-014 | Marc-André Tremblay |
| SCN-016 | BU-PEAK | C-MTQ | S-PACK | EXP / A | INC-015 | Mélanie Gagnon |
| SCN-017 | BU-PEAK | C-MTQ | S-GLOB | CT-01 | INC-016 | Élise Beaumont |

---

## Part XIII — Persistent continuity rules

1. **Company persists** — logos, departments, characters, accounts stable across M1–M5  
2. **Geography is simulation-locked** — zone codes and bin IDs match engine seed data  
3. **Events reference prior chapters** — M3 replenishment cites M2 slotting constraints  
4. **Metrics accumulate narratively** — M4 KPI missions reference M1–M3 patterns  
5. **Accounts are stable** — no customer/supplier rename without narrative justification and document amendment  
6. **Incidents recur by design** — INC-001 through INC-016 are teachable patterns, not one-offs  
7. **Peak is temporary state** — BU-PEAK overlays standard ops; does not replace org chart  

---

## Part XIV — Governance and amendment

### 14.1 Document ownership

| Role | Responsibility |
|------|----------------|
| Collège de la Concorde programme leadership | Constitutional authority |
| Pedagogy owner | Amendment initiation |
| Enterprise narrative curator | Universe consistency audits |
| Engineering lead | Simulation geography alignment verification |

### 14.2 Amendment process

1. Proposed change assessed against Enterprise Experience Principles (Manifesto Part X)  
2. Simulation geography check — no bin/zone contradiction  
3. Pedagogy owner review for Constitution compatibility  
4. Programme leadership approval  
5. Version increment (v1.1, v2.0, etc.)  
6. Dependent artifacts updated: Fiche Mission content, slides, Visual Bible character briefs  

### 14.3 Version history

| Version | Release | Summary |
|---------|---------|---------|
| **1.0** | RC18-C | Initial Enterprise Universe — persistent architecture canon |

### 14.4 Related artifacts

| Artifact | Relationship |
|----------|--------------|
| TEC Enterprise Experience Manifesto v1.0 | Constitutional parent |
| TEC.WMS Pedagogical Constitution | Compliance authority |
| Visual Bible v1.0 | Character visual identity |
| TEC Enterprise Design System (TEDS) | UI expression of enterprise |
| Scenario transformation map (Manifesto Part XI) | Mission framing target |

---

## Part XV — RC18-C success criteria

RC18-C is complete when this document is institutionalized as the enterprise world canon for all briefing content, slide narrative, debrief templates, and future AI mentor context assembly.

| Criterion | Status |
|-----------|--------|
| Business units defined | Complete in this document |
| Departments with operating model | Complete |
| Warehouse / facility architecture | Complete |
| Customer portfolio (canonical) | Complete |
| Supplier ecosystem (canonical) | Complete |
| Recurring incidents catalogue | Complete |
| Professional characters (extended canon) | Complete |
| Organizational chart | Complete |
| Company culture | Complete |
| Communication style and protocols | Complete |
| Scenario-to-universe binding | Complete |
| Simulation geography alignment verified | Complete |
| No production code modified | Verified — documentation only |

---

## Closing declaration

Concorde Logistics is not decoration around an ERP exercise. It is the **professional context** in which TEC.LOG graduates learn to think like supply chain practitioners — where stock truth protects customer promise, where every document has a business consequence, and where the warehouse floor and the control tower speak the same language.

The simulation engine provides the physics. The Enterprise Universe provides the **world**.

This document is the atlas.

---

**TEC Enterprise Universe v1.0**  
**RC18-C — Official Enterprise Architecture Document**  
**Collège de la Concorde · Montréal · TEC.LOG · TEC.WMS**

*End of document.*
