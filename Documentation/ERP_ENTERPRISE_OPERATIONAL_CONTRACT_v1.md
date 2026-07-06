# TEC.ERP Enterprise Operational Contract v1.0

**Document type:** Official Standard — ERP Functional Operational Contracts  
**Product:** TEC.ERP — Enterprise Resource Planning Learning  
**Programme:** TEC.LOG — Gestion intégrée des stocks et performance logistique  
**Institution:** Collège de la Concorde — Montréal  
**Enterprise world:** Concorde Logistics Inc.  
**Agent:** AGENT 5 — Enterprise Operational Contracts  
**Version:** 1.0  
**Effective date:** 2026-07-06  
**Status:** SINGLE SOURCE OF TRUTH — TEC.ERP operational contracts (no implementation)

---

## Authority and precedence

This document defines the **ERP Enterprise Operational Contracts (ERPOC)** — the governed functional agreements that each TEC.ERP module must satisfy within the Concorde Logistics enterprise world. It establishes what each module owns, what it commits, what it consumes, and what invariants must hold across the integrated enterprise.

| Domain | Authority |
|--------|-----------|
| Platform mission, governance, product portfolio | [TEC Enterprise Platform Charter](./TEC_ENTERPRISE_PLATFORM_CHARTER.md) |
| EOC schema, read-path boundaries, assignment metadata | [Enterprise Operational Contract Standard v1.0](./ENTERPRISE_OPERATIONAL_CONTRACT_STANDARD_v1.0.md) |
| Universe canon, departments, stakeholders, business units | [TEC Enterprise Universe v1.0](./TEC_ENTERPRISE_UNIVERSE_V1.md) |
| Process-to-department alignment, ERP concept translation | [TEC Enterprise Process Mapping v1.0](./TEC_ENTERPRISE_PROCESS_MAPPING_V1.md) |
| Living-company philosophy and aliveness litmus | [Living Company Blueprint](./LIVING_COMPANY_BLUEPRINT.md) |
| **TEC.ERP functional module contracts, cross-module invariants** | **This document** |

**Conflict resolution:** When any TEC.ERP artifact contradicts this document on module ownership, document families, stock/financial impact rules, or cross-module boundaries, **this document prevails** until amended through the Enterprise Decision Register. TEC.WMS engine contracts, scoring paths, and certification gates remain frozen and authoritative for the founding product; TEC.ERP inherits universe and platform principles without overriding TEC.WMS production authority.

**Explicit exclusions:** No production code. No database schema. No API contracts. No scenario definitions. No UI specification. No implementation tasks. This document establishes **what each ERP module operationally guarantees** — not how features are built or presented.

---

## I. Definition — ERP Enterprise Operational Contract

### 1.1 What an ERPOC is

An **ERP Enterprise Operational Contract (ERPOC)** is the institutional agreement that a functional ERP domain exposes a **complete, auditable, cross-module-consistent operational identity** within Concorde Logistics.

Each ERPOC answers, for its module:

| # | Contract question | Required answer |
|---|-------------------|-----------------|
| 1 | **What business mandate does this module own?** | Functional scope and exclusion boundary |
| 2 | **Which department is accountable?** | Primary and supporting department codes |
| 3 | **What document families does it create or maintain?** | Canonical document types and lifecycle states |
| 4 | **What triggers work in this module?** | Upstream events, plans, or commitments |
| 5 | **What does this module commit to downstream?** | Outputs, obligations, and availability signals |
| 6 | **What is the stock impact rule?** | Increase, decrease, hold, transfer, or none |
| 7 | **What is the financial impact rule?** | Liability, revenue recognition, cost absorption, or none |
| 8 | **Which modules may it not bypass?** | Mandatory integration touchpoints |
| 9 | **What invariants must always hold?** | Machine-checkable operational rules |
| 10 | **What does this module explicitly not own?** | Boundary exclusions |

A module that executes transactions but **cannot satisfy its ERPOC** is incomplete for TEC.ERP product activation, regardless of interface completeness.

### 1.2 What an ERPOC is not

| Not an ERPOC | Actual authority |
|--------------|------------------|
| Scenario steps, learner tasks, pass/fail gates | TEC.ERP simulation engine (future) |
| Points, scoring economics, certification eligibility | Product pedagogical constitution |
| Screen layout, navigation, form design | Experience Layer (TEDS) |
| Vendor transaction codes, UI paths | Process Mapping (vocabulary only) |
| Seed data, bin geography, run state | Engine seed contracts |

The ERPOC is the **functional envelope** around an ERP domain — not its presentation or pedagogy.

### 1.3 Relationship to TEC.WMS EOC

TEC.WMS established the Enterprise Operational Contract (EOC) for mission-level identity (department, priority, supervisor, stakeholders). TEC.ERP ERPOCs **extend** that model into full ERP functional domains:

```
┌─────────────────────────────────────────────────────────────────┐
│  TEC.ERP Experience Layer (future)                              │
├─────────────────────────────────────────────────────────────────┤
│  ERPOC v1.0 (this document) — nine functional module contracts  │
├─────────────────────────────────────────────────────────────────┤
│  EOC Standard v1.0 — mission identity + assignment metadata     │
├─────────────────────────────────────────────────────────────────┤
│  Universe v1.0 — Concorde Logistics canon                       │
├─────────────────────────────────────────────────────────────────┤
│  Simulation Engine — execution, compliance, scoring (frozen)    │
└─────────────────────────────────────────────────────────────────┘
```

ERPOCs consume universe canon and respect EOC read-path boundaries. ERPOCs **must not** redefine TEC.WMS warehouse execution contracts; they govern the ERP domains TEC.WMS deliberately defers.

### 1.4 Contract notation

Each module contract in this document uses a consistent structure:

| Section | Purpose |
|---------|---------|
| **Mandate** | Business purpose the module owns |
| **Accountability** | Department ownership |
| **Document families** | Canonical documents and lifecycle states |
| **Triggers** | Events that initiate module work |
| **Commitments** | What the module guarantees downstream |
| **Stock impact** | Inventory effect rules |
| **Financial impact** | Accounting effect rules |
| **Integration touchpoints** | Mandatory cross-module interfaces |
| **Invariants** | Non-negotiable operational rules |
| **Exclusions** | What this module does not own |

---

## II. Enterprise foundation — shared contract elements

### 2.1 System of record

| Element | Contract |
|---------|----------|
| **Enterprise** | Concorde Logistics Inc. |
| **Primary site** | Concorde Distribution Centre (CDC) — Saint-Laurent, QC |
| **System of record** | TEC.ERP (in-universe integrated ERP) |
| **Execution substrate** | TEC.WMS warehouse layer remains authoritative for floor transactions until superseded by explicit product governance |

### 2.2 Business unit lens

All ERPOCs operate inside shared CDC infrastructure. Business unit (`BU-DIST`, `BU-FRESH`, `BU-IND`, `BU-PEAK`) is a **planning and commercial lens**, not a separate inventory pool unless explicitly contracted.

| BU code | ERPOC impact |
|---------|--------------|
| `BU-DIST` | Default distribution policies; standard min/max and ATP rules |
| `BU-FRESH` | Lot-tracked, FIFO-enforced inventory and shelf-life constraints |
| `BU-IND` | Higher SKU complexity; component and BOM awareness in MRP/Production |
| `BU-PEAK` | Temporary priority overlay; surge demand and capacity contracts |

### 2.3 Document lifecycle states (universal)

Unless a module contract specifies otherwise, documents follow these canonical states:

| State | Meaning |
|-------|---------|
| `draft` | Created but not operationally binding |
| `released` | Approved and binding; awaiting execution |
| `in_progress` | Partially executed |
| `completed` | Fully executed; closed operationally |
| `cancelled` | Voided before completion; audit trail retained |
| `blocked` | Cannot proceed — dependency, hold, or compliance failure |

### 2.4 Stock impact taxonomy (universal)

| Code | Rule |
|------|------|
| `NONE` | No inventory movement or reservation |
| `RESERVE` | Quantity allocated but not moved |
| `INCREASE` | On-hand or unrestricted stock increases |
| `DECREASE` | On-hand or unrestricted stock decreases |
| `TRANSFER` | Location or status change; total quantity unchanged |
| `HOLD` | Quantity exists but is not available for allocation |

### 2.5 Financial impact taxonomy (universal)

| Code | Rule |
|------|------|
| `NONE` | No general-ledger or sub-ledger effect |
| `COMMITMENT` | Obligation recorded (PO, SO, production order) |
| `ACCRUAL` | Economic event recognized before cash settlement |
| `EXPENSE` | Cost absorbed to P&L or cost centre |
| `REVENUE` | Revenue recognized per policy |
| `VALUATION` | Inventory or WIP value adjusted |

### 2.6 Cross-module documentary ribbon

Every ERPOC participates in the integrated enterprise ribbon. No module may create "ghost state" — system records without upstream authority or downstream consequence.

```
Demand signal → Plan → Commit → Execute → Confirm → Value → Report
     │           │        │         │          │         │        │
   Sales/CS    MRP    Purchasing  Production  Warehouse  Finance  MGT
              Inventory ←──────────────────────────────────────────┘
```

---

## III. Module contracts

---

### 3.1 Purchasing

**Contract ID:** `ERPOC-PUR` · **ERP domain:** Procurement / Purchase-to-Pay (commitment phase)

#### Mandate

Own the **formal supply commitment** lifecycle: translating material and service requirements into binding purchase obligations with approved suppliers under agreed commercial terms.

#### Accountability

| Role | Department |
|------|------------|
| **Primary** | `PROC` — Approvisionnement / Procurement |
| **Supporting** | `PLAN` (requirement source), `FIN` (budget and match), `QA` (vendor quality), `INV` (material master) |

#### Document families

| Document | Purpose | Terminal states |
|----------|---------|-----------------|
| Purchase requisition | Internal request for supply | `draft` → `released` → `converted` \| `cancelled` |
| Request for quotation | Competitive sourcing event | `draft` → `released` → `awarded` \| `cancelled` |
| Purchase order | Binding supplier commitment | `draft` → `released` → `in_progress` → `completed` \| `cancelled` |
| Purchase order schedule line | Time-phased delivery commitment | Inherits PO state |
| Supplier confirmation | Acknowledged delivery promise | `pending` → `confirmed` \| `rejected` |

#### Triggers

| Source | Event |
|--------|-------|
| MRP | Planned order proposal converted to requisition |
| Inventory | Reorder point breach; emergency shortage |
| Production | Component shortage for released production order |
| Warehouse | Indirect material consumption below threshold |
| Finance | Budget-approved capital or service acquisition |

#### Commitments

| Downstream | Guarantee |
|------------|-----------|
| Receiving | Open PO line with expected quantity, date, and supplier reference |
| Finance | Three-way match anchor (PO · GR · Invoice) |
| Inventory | Expected inbound signal for ATP and allocation planning |
| MRP | Open PO quantity reduces net requirement |

#### Stock impact

| Event | Impact |
|-------|--------|
| Requisition created | `NONE` |
| PO released | `NONE` — **a PO is a promise, not inventory** |
| PO schedule confirmation | `NONE` |
| Goods receipt (Warehouse contract) | Delegated — Purchasing does not post stock |

#### Financial impact

| Event | Impact |
|-------|--------|
| PO released | `COMMITMENT` — obligation recorded |
| Price variance at invoice | Delegated to Finance after GR match |
| Prepayment request | `ACCRUAL` with Finance approval |

#### Integration touchpoints

| Module | Interface |
|--------|-----------|
| MRP | Consumes planned order proposals; returns open PO quantity |
| Inventory | Reads material master, UoM, and reorder parameters |
| Warehouse / Receiving | Supplies PO reference for goods receipt validation |
| Finance | Budget check, commitment ledger, invoice match anchor |
| Production | Component demand for outsourced or purchased parts |

#### Invariants

| ID | Rule |
|----|------|
| ERPOC-PUR-01 | No stock increase may originate from Purchasing alone |
| ERPOC-PUR-02 | Every open PO line references a valid supplier and material |
| ERPOC-PUR-03 | Released PO quantity ≥ cumulative received quantity at all times |
| ERPOC-PUR-04 | Emergency POs require documented shortage authority (Planning or CS escalation) |
| ERPOC-PUR-05 | BU context is stamped on PO and inherited by downstream documents |

#### Exclusions

- Physical receipt, quality inspection posting, and bin placement (Warehouse / Receiving)
- Invoice posting and payment (Finance)
- Demand forecasting (MRP / Sales)
- Supplier master creation governance (Finance + Procurement joint; Purchasing executes)

---

### 3.2 Sales

**Contract ID:** `ERPOC-SAL` · **ERP domain:** Order-to-Cash (demand commitment phase)

#### Mandate

Own the **customer demand commitment** lifecycle: converting commercial opportunity into binding sales obligations with defined delivery promise, pricing, and fulfillment routing.

#### Accountability

| Role | Department |
|------|------------|
| **Primary** | `CS` — Service client / Customer Service (commercial order authority) |
| **Supporting** | `PLAN` (ATP/CTP), `INV` (allocation), `SHP` (dispatch promise), `FIN` (credit), `MGT` (escalation) |

#### Document families

| Document | Purpose | Terminal states |
|----------|---------|-----------------|
| Customer inquiry | Pre-commitment demand signal | `open` → `quoted` \| `closed` |
| Sales quotation | Commercial offer | `draft` → `released` → `accepted` \| `expired` \| `cancelled` |
| Sales order | Binding customer commitment | `draft` → `released` → `in_progress` → `completed` \| `cancelled` |
| Sales order line | Line-level quantity, price, delivery date | Inherits SO state |
| Delivery schedule | Time-phased fulfillment commitment | `planned` → `confirmed` → `shipped` |

#### Triggers

| Source | Event |
|--------|-------|
| Customer | Purchase order, portal order, or phone commitment |
| CS | Quote acceptance; contract renewal |
| MRP | Dependent demand does not apply — Sales owns independent demand |
| MGT | Strategic account surge authorization (BU-PEAK) |

#### Commitments

| Downstream | Guarantee |
|------------|-----------|
| Inventory | Allocation or backorder signal per ATP result |
| Warehouse | Pick demand with SO reference, quantity, and ship date |
| Shipping | Dispatch obligation with carrier and delivery window |
| Finance | Revenue recognition anchor and billing trigger |
| Customer Service | Promise date and confirmation communication |

#### Stock impact

| Event | Impact |
|-------|--------|
| Quotation | `NONE` |
| SO released — ATP available | `RESERVE` against unrestricted stock |
| SO released — ATP unavailable | `NONE` with backorder flag; may trigger MRP |
| Goods issue (Warehouse contract) | Delegated — Sales does not post stock |

#### Financial impact

| Event | Impact |
|-------|--------|
| SO released | `COMMITMENT` — backlog recorded |
| Credit hold | Blocks release until Finance clears |
| Billing trigger at GI | Delegated to Finance |

#### Integration touchpoints

| Module | Interface |
|--------|-----------|
| Inventory | ATP check, allocation, reservation release |
| Warehouse | Pick list generation authority |
| Shipping | Delivery creation and status |
| Finance | Credit limit, pricing condition, invoice creation |
| MRP | Independent demand input for forecast consumption |
| Customer Service | Confirmation, SLA tracking, escalation |

#### Invariants

| ID | Rule |
|----|------|
| ERPOC-SAL-01 | No stock decrease may originate from Sales alone |
| ERPOC-SAL-02 | Released SO line cannot promise quantity beyond ATP + approved oversell policy |
| ERPOC-SAL-03 | Every SO line references valid ship-to, sold-to, and material or service |
| ERPOC-SAL-04 | Cancelled SO releases all reservations immediately |
| ERPOC-SAL-05 | BU-PEAK orders carry surge priority metadata for Planning and Warehouse |

#### Exclusions

- Pick, pack, and goods issue execution (Warehouse)
- Carrier booking and proof of delivery (Shipping)
- Invoice generation and cash collection (Finance)
- Post-delivery service cases (Customer Service — service contract)

---

### 3.3 Finance

**Contract ID:** `ERPOC-FIN` · **ERP domain:** Record-to-Report / Procure-to-Pay settlement / Order-to-Cash settlement

#### Mandate

Own **financial truth**: monetary recording, budget governance, inventory valuation, invoice verification, payment authorization, and period-close integrity for Concorde Logistics operations.

#### Accountability

| Role | Department |
|------|------------|
| **Primary** | `FIN` — Finance |
| **Supporting** | `PROC` (PO match), `INV` (valuation), `MGT` (approval limits), `HR` (payroll interface) |

#### Document families

| Document | Purpose | Terminal states |
|----------|---------|-----------------|
| Journal entry | General-ledger posting | `draft` → `posted` \| `reversed` |
| Accounts payable invoice | Supplier invoice | `draft` → `matched` → `approved` → `paid` \| `blocked` |
| Accounts receivable invoice | Customer invoice | `draft` → `released` → `paid` \| `written_off` |
| Payment proposal | Outbound payment batch | `draft` → `approved` → `executed` |
| Credit memo / debit memo | Financial adjustment | `draft` → `posted` |
| Inventory valuation snapshot | Period inventory value | `calculated` → `posted` → `locked` |
| Budget encumbrance | Commitment against budget | `open` → `relieved` \| `cancelled` |

#### Triggers

| Source | Event |
|--------|-------|
| Purchasing | PO commitment; requires encumbrance when budget-controlled |
| Warehouse | Goods receipt and goods issue postings |
| Sales | Billing request at delivery confirmation |
| Inventory | Adjustment approval; revaluation event |
| Production | WIP absorption and finished goods capitalization |
| HR | Payroll accrual and payment interface |

#### Commitments

| Downstream | Guarantee |
|------------|-----------|
| Management | P&L, balance sheet, and cash position truth |
| Purchasing | Budget availability signal |
| Sales | Credit status and billing document |
| Inventory | Valued stock position per costing method |
| External auditors | Immutable posted document trail |

#### Stock impact

| Event | Impact |
|-------|--------|
| Standard Finance postings | `NONE` directly — Finance records valuation, not movement |
| Inventory adjustment approval | Authorizes `INCREASE` or `DECREASE` via Inventory contract |
| GR/IR clearing | `NONE` on quantity; clears liability accrual |

#### Financial impact

| Event | Impact |
|-------|--------|
| PO encumbrance | `COMMITMENT` against budget |
| GR accrual (uninvoiced receipt) | `ACCRUAL` — GR/IR liability |
| AP invoice match | `EXPENSE` or inventory capitalization per material type |
| AR invoice | `REVENUE` per recognition policy |
| Inventory revaluation | `VALUATION` |
| Period close | Locks prior-period postings |

#### Integration touchpoints

| Module | Interface |
|--------|-----------|
| Purchasing | Three-way match: PO · GR · Invoice |
| Sales | Credit check, pricing, billing, revenue recognition |
| Inventory | Costing method, adjustment approval, valuation |
| Warehouse | GR/GI as quantity truth for accrual and COGS |
| Production | WIP and finished goods costing |
| HR | Payroll posting interface |

#### Invariants

| ID | Rule |
|----|------|
| ERPOC-FIN-01 | No financial posting without operational document reference |
| ERPOC-FIN-02 | Three-way match variance beyond tolerance requires approval workflow |
| ERPOC-FIN-03 | Posted documents are immutable — corrections via reversal only |
| ERPOC-FIN-04 | Inventory valuation method is consistent within fiscal period |
| ERPOC-FIN-05 | Period close blocks retroactive postings to closed periods |

#### Exclusions

- Operational document creation (Purchasing, Sales, Production)
- Physical stock movement (Warehouse, Inventory)
- Payroll calculation rules (HR)
- Management strategic decisions (MGT — Finance records, does not decide)

---

### 3.4 Inventory

**Contract ID:** `ERPOC-INV` · **ERP domain:** Inventory Management / Stock Governance

#### Mandate

Own **stock truth**: material availability, location assignment, lot and serial integrity, reservation governance, adjustment authority, and valuation input for the enterprise.

#### Accountability

| Role | Department |
|------|------------|
| **Primary** | `INV` — Inventaire / Inventory |
| **Supporting** | `WH` (execution), `PLAN` (parameters), `QA` (hold release), `FIN` (valuation), `PROC` (material master) |

#### Document families

| Document | Purpose | Terminal states |
|----------|---------|-----------------|
| Material master | SKU definition and planning parameters | `active` \| `blocked` \| `obsolete` |
| Stock balance | Quantity by material, location, status | Continuous state |
| Reservation | Allocated quantity against demand | `active` → `consumed` \| `released` |
| Stock transfer order | Inter-location movement request | `draft` → `released` → `completed` |
| Inventory adjustment document | Approved quantity correction | `draft` → `approved` → `posted` |
| Cycle count document | Physical count event | `planned` → `in_progress` → `posted` \| `recount` |
| Lot / serial record | Traceability anchor | `active` → `consumed` \| `blocked` |

#### Triggers

| Source | Event |
|--------|-------|
| Warehouse | GR, GI, transfer confirmation, count result |
| Sales | Reservation request from released SO |
| MRP | Safety stock policy; reorder parameter change |
| QA | Quality hold or release |
| Finance | Approved adjustment; revaluation |
| Production | Component issue and finished goods receipt |

#### Commitments

| Downstream | Guarantee |
|------------|-----------|
| Sales | ATP quantity — unrestricted minus reservations |
| MRP | On-hand, on-order, and reserved visibility |
| Warehouse | Authoritative location and lot assignment |
| Finance | Valued quantity for ledger alignment |
| Planning | Accurate DOS, fill rate, and stockout signals |

#### Stock impact

| Event | Impact |
|-------|--------|
| Reservation | `RESERVE` — reduces ATP, not physical quantity |
| Transfer posted | `TRANSFER` between locations |
| Approved adjustment | `INCREASE` or `DECREASE` with reason code |
| QA hold | `HOLD` — quantity exists, not allocatable |
| QA release | Restores unrestricted status |

#### Financial impact

| Event | Impact |
|-------|--------|
| Adjustment posting | Triggers `VALUATION` via Finance |
| Standard movement | Delegated — Finance derives from Warehouse postings |
| Obsolete marking | May trigger write-down proposal to Finance |

#### Integration touchpoints

| Module | Interface |
|--------|-----------|
| Warehouse | Receives movement confirmations; does not execute floor work |
| Sales | ATP, reservation, backorder |
| MRP | Netting input: on-hand, scheduled receipts, reservations |
| Purchasing | Open PO as inbound supply |
| Production | Component availability; finished goods receipt |
| Finance | Costing, adjustment approval, valuation |
| QA | Hold status on lot or location |

#### Invariants

| ID | Rule |
|----|------|
| ERPOC-INV-01 | Stock quantity is single-sourced — no duplicate balance authority |
| ERPOC-INV-02 | Reservations cannot exceed unrestricted on-hand |
| ERPOC-INV-03 | Every quantity change traces to an operational document |
| ERPOC-INV-04 | Lot-tracked material (BU-FRESH) cannot move without lot reference |
| ERPOC-INV-05 | Negative unrestricted stock is prohibited unless explicit policy exception documented |
| ERPOC-INV-06 | Cycle count posting requires variance approval above threshold |

#### Exclusions

- Floor execution: pick, putaway, pack (Warehouse)
- PO and SO commercial terms (Purchasing, Sales)
- Demand forecast generation (MRP)
- GL posting (Finance)

---

### 3.5 MRP

**Contract ID:** `ERPOC-MRP` · **ERP domain:** Material Requirements Planning / Supply Planning

#### Mandate

Own **supply-demand balancing logic**: translating independent and dependent demand into planned supply proposals, reorder signals, and time-phased material requirements.

#### Accountability

| Role | Department |
|------|------------|
| **Primary** | `PLAN` — Planification / Planning |
| **Supporting** | `INV` (stock parameters), `PROC` (supply execution), `PROD` (BOM and capacity), `CS` (demand signal), `MGT` (S&OP) |

#### Document families

| Document | Purpose | Terminal states |
|----------|---------|-----------------|
| Demand forecast | Independent demand plan | `draft` → `released` → `consumed` |
| Master production schedule | Time-phased finished goods plan | `draft` → `released` → `frozen` |
| MRP run result | Planned order proposals | `generated` → `reviewed` → `converted` \| `rejected` |
| Planned order | System-proposed supply | `proposed` → `firmed` → `converted` |
| Planning parameter set | Min/max, ROP, safety stock, lead time | `active` → `superseded` |
| Exception message | Planning alert | `open` → `resolved` \| `overridden` |

#### Triggers

| Source | Event |
|--------|-------|
| Sales | Released SO; forecast consumption |
| Production | Released production order — dependent demand explosion |
| Inventory | Below reorder point; stockout exception |
| Purchasing | Supplier lead time change |
| MGT | S&OP plan release; BU-PEAK surge overlay |

#### Commitments

| Downstream | Guarantee |
|------------|-----------|
| Purchasing | Firmed planned purchase proposals |
| Production | Firmed planned production proposals |
| Inventory | Updated planning parameters when approved |
| Management | Exception visibility for service and inventory risk |

#### Stock impact

| Event | Impact |
|-------|--------|
| MRP run | `NONE` — planning is not execution |
| Firm planned order | `NONE` until converted |
| Conversion to PO | Delegated to Purchasing |
| Conversion to production order | Delegated to Production |

#### Financial impact

| Event | Impact |
|-------|--------|
| MRP planning | `NONE` |
| Firm plan with budget impact | Signals Finance encumbrance when PO converted |

#### Integration touchpoints

| Module | Interface |
|--------|-----------|
| Sales | Independent demand input |
| Inventory | On-hand, reservations, scheduled receipts, parameters |
| Purchasing | Planned order → requisition/PO conversion |
| Production | BOM explosion, capacity check, planned production order |
| Warehouse | Lead time and GR history feedback |
| Finance | Budget visibility for firm plans (indirect) |

#### Invariants

| ID | Rule |
|----|------|
| ERPOC-MRP-01 | MRP never posts stock or financial documents directly |
| ERPOC-MRP-02 | Every planned order cites driving demand (SO, forecast, BOM, or ROP) |
| ERPOC-MRP-03 | Lead time and lot size parameters are material-site specific |
| ERPOC-MRP-04 | BU-FRESH materials enforce FIFO-compatible planning windows |
| ERPOC-MRP-05 | Exception messages require human resolution or documented override |
| ERPOC-MRP-06 | BU-PEAK overlay may reprioritize but not invent demand |

#### Exclusions

- Purchase order creation (Purchasing)
- Production order execution (Production)
- ATP promise to customer (Sales + Inventory)
- Warehouse floor scheduling (Warehouse)

---

### 3.6 Production

**Contract ID:** `ERPOC-PRD` · **ERP domain:** Manufacturing / Plan-to-Produce

#### Mandate

Own the **transformation commitment** lifecycle: converting planned or actual demand into production orders, consuming components, absorbing capacity, and delivering finished goods into inventory.

#### Accountability

| Role | Department |
|------|------------|
| **Primary** | `OPS` — Opérations intégrées / Integrated Operations (production authority at CDC) |
| **Supporting** | `PLAN` (MPS/MRP), `INV` (component issue, FG receipt), `WH` (staging), `QA` (in-process hold), `FIN` (WIP costing) |

#### Document families

| Document | Purpose | Terminal states |
|----------|---------|-----------------|
| Bill of materials | Component structure | `active` → `superseded` |
| Routing / work center | Capacity and operation sequence | `active` → `superseded` |
| Production order | Manufacturing commitment | `draft` → `released` → `in_progress` → `completed` \| `cancelled` |
| Operation confirmation | Step-level completion | `pending` → `confirmed` |
| Component issue document | Material consumption | `draft` → `posted` |
| Finished goods receipt | Production output to inventory | `draft` → `posted` |
| Scrap / rework record | Non-conformance output | `recorded` → `resolved` |

#### Triggers

| Source | Event |
|--------|-------|
| MRP | Firm planned production order |
| Sales | Make-to-order demand when policy requires |
| Inventory | Component kit availability confirmation |
| QA | Rework order from quality failure |
| MGT | Capacity authorization for surge build (BU-IND, BU-PEAK) |

#### Commitments

| Downstream | Guarantee |
|------------|-----------|
| Inventory | Component consumption and finished goods increase |
| Warehouse | Staging and putaway demand for output |
| Finance | WIP accumulation and FG capitalization |
| MRP | Dependent demand for sub-assemblies |
| Planning | Capacity consumption truth |

#### Stock impact

| Event | Impact |
|-------|--------|
| Production order released | `RESERVE` components per BOM (if policy enabled) |
| Component issue posted | `DECREASE` component stock |
| Finished goods receipt posted | `INCREASE` finished goods stock |
| Scrap posting | `DECREASE` with scrap reason; may trigger rework |

#### Financial impact

| Event | Impact |
|-------|--------|
| Component issue | WIP `ACCRUAL` — absorbed into production order |
| Operation confirmation | Labor/machine `EXPENSE` or WIP absorption per policy |
| FG receipt | WIP relief; FG `VALUATION` at standard or actual |
| Scrap above tolerance | Variance `EXPENSE` with approval |

#### Integration touchpoints

| Module | Interface |
|--------|-----------|
| MRP | Planned production order source; dependent demand feedback |
| Inventory | Component availability, reservation, FG receipt |
| Warehouse | Staging, kitting, putaway of finished output |
| Purchasing | Component shortage escalation |
| Finance | WIP and variance posting |
| QA | In-process hold, release, rework |

#### Invariants

| ID | Rule |
|----|------|
| ERPOC-PRD-01 | No FG receipt without released production order reference |
| ERPOC-PRD-02 | Component issue cannot exceed BOM quantity + documented scrap tolerance |
| ERPOC-PRD-03 | BOM and routing version on order are frozen at release |
| ERPOC-PRD-04 | Completed production order must balance: issued components + scrap = FG + remaining WIP |
| ERPOC-PRD-05 | Make-to-stock and make-to-order policies are explicit per material |

#### Exclusions

- Floor pick and putaway execution (Warehouse)
- BOM engineering change governance (PLAN + QA joint)
- Sales pricing and delivery promise (Sales)
- Detailed capacity scheduling UI (out of scope — contract covers document truth only)

---

### 3.7 Warehouse

**Contract ID:** `ERPOC-WHS` · **ERP domain:** Warehouse Execution / Stock Movement

#### Mandate

Own **physical logistics execution**: receiving, putaway, storage, replenishment movement, picking, packing, staging, and shipping handoff — translating system demand into completed stock movements with location integrity.

#### Accountability

| Role | Department |
|------|------------|
| **Primary** | `WH` — Entrepôt / Warehouse |
| **Receiving primary** | `REC` — Réception / Receiving (dock-to-stock) |
| **Shipping primary** | `SHP` — Expédition / Shipping (dispatch) |
| **Supporting** | `INV` (stock truth), `QA` (hold), `CS` (promise), `PLAN` (replenishment signals) |

#### Document families

| Document | Purpose | Terminal states |
|----------|---------|-----------------|
| Advance ship notice | Expected inbound | `expected` → `arrived` \| `cancelled` |
| Goods receipt | Inbound posting against PO | `draft` → `posted` |
| Putaway task | Move from dock to storage bin | `open` → `completed` |
| Pick task | Move from storage to staging | `open` → `completed` |
| Pack / handling unit | Shipment consolidation | `open` → `sealed` |
| Goods issue | Outbound posting against SO | `draft` → `posted` |
| Internal replenishment move | Bin-to-bin or zone transfer | `open` → `completed` |
| Wave / pick list | Grouped execution batch | `planned` → `released` → `completed` |

#### Triggers

| Source | Event |
|--------|-------|
| Purchasing | Open PO with expected delivery |
| Sales | Released SO with allocation |
| Inventory | Transfer order; replenishment trigger |
| Production | Component staging request; FG putaway |
| QA | Hold move to quarantine; release move to unrestricted |
| Planning | Min/max replenishment signal |

#### Commitments

| Downstream | Guarantee |
|------------|-----------|
| Inventory | Posted movement updates stock truth |
| Finance | GR/GI as quantity truth for accrual and COGS |
| Shipping | Staged handling units ready for dispatch |
| Receiving | GR posted with PO match integrity |
| Customer Service | Ship confirmation event |

#### Stock impact

| Event | Impact |
|-------|--------|
| GR posted | `INCREASE` at receiving location (may be `HOLD` if QA required) |
| Putaway completed | `TRANSFER` dock → storage bin |
| Pick completed | `TRANSFER` storage → staging |
| GI posted | `DECREASE` unrestricted stock |
| Replenishment move | `TRANSFER` within warehouse |

#### Financial impact

| Event | Impact |
|-------|--------|
| GR posted | Signals Finance GR/IR `ACCRUAL` |
| GI posted | Signals Finance COGS `EXPENSE` per policy |
| Warehouse execution alone | `NONE` direct GL posting |

#### Integration touchpoints

| Module | Interface |
|--------|-----------|
| Purchasing | PO reference on GR |
| Sales | SO reference on pick and GI |
| Inventory | Balance update, lot assignment, reservation consumption |
| Production | Component issue staging; FG putaway |
| Shipping | Handoff of sealed handling units |
| Finance | Quantity truth for match and COGS |
| QA | Hold and release movements |

#### Invariants

| ID | Rule |
|----|------|
| ERPOC-WHS-01 | No GR without PO reference (except documented emergency policy) |
| ERPOC-WHS-02 | No GI without SO or approved issue reference |
| ERPOC-WHS-03 | Every movement updates exactly one authoritative stock record |
| ERPOC-WHS-04 | Putaway must assign target bin before stock is unrestricted in storage |
| ERPOC-WHS-05 | FIFO enforcement for BU-FRESH is non-overridable without QA + INV approval |
| ERPOC-WHS-06 | REC owns dock validation; WH owns putaway; SHP owns dispatch — roles are not interchangeable |

#### Exclusions

- PO and SO commercial authority (Purchasing, Sales)
- ATP and reservation logic (Inventory)
- Carrier contract and freight invoice (Finance + Shipping)
- Demand planning (MRP)

---

### 3.8 Customer Service

**Contract ID:** `ERPOC-CS` · **ERP domain:** Customer Promise Management / Service Operations

#### Mandate

Own the **customer promise lifecycle**: order confirmation, delivery communication, SLA monitoring, exception escalation, and post-delivery service coordination — ensuring commercial commitments remain visible and recoverable.

#### Accountability

| Role | Department |
|------|------------|
| **Primary** | `CS` — Service client / Customer Service |
| **Supporting** | `SAL` (order authority — shared for commercial), `SHP` (dispatch status), `INV` (availability), `PLAN` (date feasibility), `MGT` (escalation), `QA` (quality complaints) |

#### Document families

| Document | Purpose | Terminal states |
|----------|---------|-----------------|
| Customer master | Sold-to, ship-to, credit profile | `active` \| `blocked` |
| Service level agreement | OTIF and response commitments | `active` → `superseded` |
| Order confirmation | Customer-facing promise record | `issued` → `amended` \| `superseded` |
| Delivery exception | Risk to promise date or quantity | `open` → `resolved` \| `escalated` |
| Customer communication log | Audit of confirmations and notices | Continuous |
| Service case | Post-delivery issue | `open` → `in_progress` → `closed` |
| Return authorization | Approved return event | `draft` → `approved` → `completed` \| `cancelled` |

#### Triggers

| Source | Event |
|--------|-------|
| Sales | SO release requiring confirmation |
| Warehouse / Shipping | Pick delay, short pick, ship confirmation |
| Inventory | ATP failure; allocation release |
| QA | Quality hold affecting customer order |
| Customer | Complaint, change request, or return request |
| MGT | Strategic account intervention (BU-PEAK) |

#### Commitments

| Downstream | Guarantee |
|------------|-----------|
| Customer | Confirmed dates, quantities, and exception transparency |
| Sales | Authoritative promise amendments feeding SO |
| Planning | Escalated demand or date changes |
| Management | OTIF risk visibility |
| Warehouse | Priority signal for recovery waves |

#### Stock impact

| Event | Impact |
|-------|--------|
| Confirmation and communication | `NONE` |
| Return authorization approved | Precedes `INCREASE` via Warehouse return GR |
| Cancellation communication | Triggers Sales reservation release |

#### Financial impact

| Event | Impact |
|-------|--------|
| Service operations | `NONE` directly |
| Return completion | Triggers Finance credit memo via Sales/Finance |
| Penalty or credit agreement | `EXPENSE` or revenue adjustment with Finance approval |

#### Integration touchpoints

| Module | Interface |
|--------|-----------|
| Sales | SO status, amendments, credit requests |
| Inventory | ATP inquiries; allocation status |
| Warehouse | Pick/ship status; return receipt |
| Shipping | Tracking and POD |
| Planning | Date feasibility and recovery options |
| Finance | Credit hold visibility |
| QA | Quality complaint linkage |

#### Invariants

| ID | Rule |
|----|------|
| ERPOC-CS-01 | No customer promise without SO or approved quotation reference |
| ERPOC-CS-02 | Promise amendments must propagate to Sales document within same business day |
| ERPOC-CS-03 | OTIF measurement uses ship confirmation timestamp, not communication timestamp |
| ERPOC-CS-04 | Escalated exceptions require owner and target resolution time |
| ERPOC-CS-05 | Return cannot post stock without approved return authorization |

#### Exclusions

- SO creation and pricing (Sales)
- Stock movement execution (Warehouse)
- Invoice generation (Finance)
- Supplier communication (Purchasing)

---

### 3.9 Human Resources

**Contract ID:** `ERPOC-HR` · **ERP domain:** Human Capital / Workforce Administration

#### Mandate

Own **workforce administrative truth**: employee master data, organizational assignment, job role authority, time capture, absence governance, and payroll interface integrity — enabling accountable human execution across all other ERPOCs.

#### Accountability

| Role | Department |
|------|------------|
| **Primary** | `HR` — Ressources humaines / Human Resources |
| **Supporting** | `MGT` (headcount approval), `FIN` (payroll posting), `OPS` (shift roster), department heads (time approval) |

#### Document families

| Document | Purpose | Terminal states |
|----------|---------|-----------------|
| Employee master | Person and employment record | `active` → `suspended` → `terminated` |
| Organizational assignment | Department, role, supervisor | `active` → `transferred` → `ended` |
| Job role catalog | Authority and competency mapping | `active` → `superseded` |
| Time sheet / clock record | Hours worked by cost centre | `draft` → `submitted` → `approved` → `transferred` |
| Absence request | Leave or absence | `draft` → `approved` → `taken` \| `rejected` |
| Payroll run interface | Earnings and deductions batch | `calculated` → `approved` → `posted` |
| Training / certification record | Competency gate for role | `active` → `expired` |

#### Triggers

| Source | Event |
|--------|-------|
| MGT | Hire, transfer, or termination authorization |
| Operations | Shift completion; overtime exception |
| Employee | Absence request submission |
| Finance | Pay period close |
| QA / Safety | Certification expiry affecting role eligibility |

#### Commitments

| Downstream | Guarantee |
|------------|-----------|
| All modules | Identifiable accountable operator on operational documents |
| Finance | Approved payroll posting batch |
| Management | Headcount and labour cost visibility |
| Operations | Shift coverage truth for capacity planning |

#### Stock impact

| Event | Impact |
|-------|--------|
| All HR events | `NONE` |

#### Financial impact

| Event | Impact |
|-------|--------|
| Payroll posting | `EXPENSE` to cost centres; liability until paid |
| Benefit accrual | `ACCRUAL` per policy |
| Training cost | `EXPENSE` when capitalizable threshold not met |

#### Integration touchpoints

| Module | Interface |
|--------|-----------|
| Finance | Payroll journal, benefit liability |
| Production | Labour confirmation costing input |
| Warehouse | Operator identity on movement documents |
| All modules | `supervisorId` and department alignment with EOC |
| MGT | Headcount budget and approval limits |

#### Invariants

| ID | Rule |
|----|------|
| ERPOC-HR-01 | No operational document posts without identifiable operator context |
| ERPOC-HR-02 | Terminated employee cannot approve or post transactions |
| ERPOC-HR-03 | Organizational assignment determines default department for EOC resolution |
| ERPOC-HR-04 | Overtime and surge staffing (BU-PEAK) require approved roster exception |
| ERPOC-HR-05 | Role certification expiry blocks posting authority for governed operations |
| ERPOC-HR-06 | Payroll posting requires approved time records for hourly workforce |

#### Exclusions

- Production operation sequencing (Production)
- Shift-level warehouse task optimization (Warehouse)
- Performance management and discipline (MGT)
- GL account definition (Finance)

---

## IV. Cross-module operational invariants

These invariants govern **integration integrity** across all nine ERPOCs. Violation blocks TEC.ERP product readiness sign-off.

### 4.1 Document chain invariants

| ID | Rule |
|----|------|
| ERPOC-X-01 | No goods receipt without purchase authority (PO or approved exception) |
| ERPOC-X-02 | No goods issue without demand authority (SO, production order, or approved issue) |
| ERPOC-X-03 | No customer invoice without delivery confirmation |
| ERPOC-X-04 | No supplier invoice payment without match to PO and GR |
| ERPOC-X-05 | No production FG receipt without component issue balance within tolerance |

### 4.2 Stock truth invariants

| ID | Rule |
|----|------|
| ERPOC-X-06 | Inventory is the single balance authority; Warehouse posts, Inventory holds truth |
| ERPOC-X-07 | Reservation + unrestricted on-hand = total physical quantity in location |
| ERPOC-X-08 | QA hold quantity is not ATP-available |
| ERPOC-X-09 | Lot-tracked material retains lot identity across all movements |

### 4.3 Planning invariants

| ID | Rule |
|----|------|
| ERPOC-X-10 | MRP proposals require explicit firming before execution modules act |
| ERPOC-X-11 | Sales ATP consumes Inventory truth, not MRP projections |
| ERPOC-X-12 | BU-PEAK priority overlay cannot bypass QA hold or credit block |

### 4.4 Financial invariants

| ID | Rule |
|----|------|
| ERPOC-X-13 | Every financial posting references an operational source document |
| ERPOC-X-14 | Inventory valuation aligns with posted quantity within period lock rules |
| ERPOC-X-15 | Payroll expenses map to authorized cost centres |

### 4.5 Accountability invariants

| ID | Rule |
|----|------|
| ERPOC-X-16 | Every ERPOC maps to at least one universe department code |
| ERPOC-X-17 | HR employee assignment reconciles with EOC `supervisorId` and department resolution |
| ERPOC-X-18 | Cross-department work retains primary owner per ribbon stage (Process Mapping Part I) |

### 4.6 TEC.WMS coexistence invariants

| ID | Rule |
|----|------|
| ERPOC-X-19 | TEC.WMS floor execution contracts remain authoritative until explicit TEC.ERP supersession DR |
| ERPOC-X-20 | ERPOC definitions do not alter TEC.WMS scoring, compliance, or certification paths |
| ERPOC-X-21 | Warehouse ERPOC aligns with REC, WH, SHP department split established in Universe v1.0 |

---

## V. Module interaction matrix

Read: **R** = consumes data · **W** = produces data · **A** = approval authority · **—** = no direct contract

|  | PUR | SAL | FIN | INV | MRP | PRD | WHS | CS | HR |
|--|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **PUR** | — | — | W | R | R/W | R | W | — | R |
| **SAL** | — | — | W | R/W | W | R | W | W | R |
| **FIN** | R/A | R/A | — | R/A | — | R | R | R | R/W |
| **INV** | R | R/W | W | — | R/W | R/W | R/W | R | R |
| **MRP** | W | R | — | R | — | W | R | R | — |
| **PRD** | R | R | W | R/W | R/W | — | W | — | R |
| **WHS** | R | R | W | W | R | R | — | W | R |
| **CS** | — | R/W | R | R | R | — | R | — | R |
| **HR** | — | — | W | — | — | — | — | — | — |

---

## VI. Department-to-ERPOC registry

| Department | Code | Primary ERPOCs | Secondary ERPOCs |
|------------|------|----------------|------------------|
| Approvisionnement | `PROC` | PUR | MRP |
| Service client | `CS` | SAL, CS | INV, WHS |
| Finance | `FIN` | FIN | PUR, SAL, INV |
| Inventaire | `INV` | INV | WHS, MRP |
| Planification | `PLAN` | MRP | PUR, PRD, SAL |
| Opérations intégrées | `OPS` | PRD | WHS, MRP |
| Entrepôt | `WH` | WHS | INV, PRD |
| Réception | `REC` | WHS (receiving) | PUR, QA |
| Expédition | `SHP` | WHS (shipping) | SAL, CS |
| Ressources humaines | `HR` | HR | All (identity) |
| Qualité | `QA` | — (cross-cutting) | INV, WHS, PRD |
| Direction | `MGT` | — (governance) | All (escalation) |

---

## VII. Amendment and versioning

### 7.1 When amendment is required

| Change type | Amendment path |
|-------------|----------------|
| New ERP module contract | Standard version increment + DR entry |
| Document family addition | Module contract update + cross-module matrix review |
| Stock or financial impact rule change | Invariant re-verification + Finance review |
| Department ownership change | Universe reconciliation + EOC alignment check |
| TEC.WMS supersession of warehouse execution | Explicit DR + TEC.WMS engine contract review |

### 7.2 Version history

| Version | Date | Summary |
|---------|------|---------|
| **1.0** | 2026-07-06 | Initial TEC.ERP ERPOC — nine functional modules (AGENT 5) |

### 7.3 Related artifacts

| Artifact | Relationship |
|----------|--------------|
| TEC Enterprise Platform Charter | Product portfolio parent |
| Enterprise Operational Contract Standard v1.0 | Mission-level EOC parent |
| TEC Enterprise Universe v1.0 | Department and BU canon |
| TEC Enterprise Process Mapping v1.0 | Process ribbon alignment |
| Living Company Blueprint | Aliveness and persistence philosophy |
| TEC.WMS Pedagogical Constitution | Certification authority (unchanged) |

---

## VIII. Closing declaration

The ERP Enterprise Operational Contracts define **what Concorde Logistics operationally guarantees** across Purchasing, Sales, Finance, Inventory, MRP, Production, Warehouse, Customer Service, and Human Resources.

These contracts are the institutional foundation for TEC.ERP product development. No implementation increment, scenario authoring, or experience feature may proceed without respecting ERPOC boundaries. TEC.WMS remains the certified execution substrate; TEC.ERP extends enterprise literacy without compromising frozen WMS authority.

**AGENT 5 complete when:** This document is committed, governance-linked, and module contracts are unambiguous for downstream product charter work.

---

*Collège de la Concorde — TEC.LOG — Concorde Logistics Inc. — TEC.ERP Enterprise Operational Contract v1.0 — AGENT 5*
