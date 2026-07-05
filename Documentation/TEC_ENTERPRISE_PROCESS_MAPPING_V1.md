# TEC.WMS Enterprise Process Mapping — Official Reference

**Document type:** Official Pedagogical Reference — ERP Concept Translation Layer  
**Programme:** TEC.LOG — Gestion intégrée des stocks et performance logistique  
**Institution:** Collège de la Concorde — Montréal  
**Application:** TEC.WMS (Mini-WMS Concorde) · Concorde Logistics enterprise narrative  
**Release:** RC18-A  
**Audience:** Professeurs · Coordinateurs pédagogiques · Consultants institutionnels  
**Status:** SINGLE SOURCE OF TRUTH — Process mapping (conceptual only)

---

## Authority and usage

This document is the **official enterprise process mapping** for TEC.LOG. It translates every business process taught in TEC.WMS into the conceptual language of four major ERP families:

| Vendor | Scope referenced |
|--------|------------------|
| **SAP** | S/4HANA · ECC (MM, WM/EWM, SD, IM, CO) |
| **Oracle** | Oracle Fusion Cloud SCM · Oracle E-Business Suite (Inventory, WMS, Order Management, Purchasing) |
| **Microsoft Dynamics** | Dynamics 365 Supply Chain Management (Finance & Operations) |
| **Odoo** | Odoo Enterprise — Inventory, Purchase, Sales, Manufacturing |

### What this document is

- A **concept translation layer** for classroom instruction
- A reference for professors explaining *why* processes exist and *how* they transfer across ERPs
- A companion to the [TEC Enterprise Experience Manifesto v1.0](./TEC_ENTERPRISE_EXPERIENCE_MANIFESTO_V1.md) Part IX (ERP Explorer)

### What this document is not

- **Not** a UI comparison — no screens, buttons, menus, or navigation paths
- **Not** vendor certification material — transaction codes are *vocabulary*, not exam targets
- **Not** an endorsement of any vendor — names are industry reference only

### Pedagogical guardrails (mandatory)

1. Assessment in TEC.WMS remains on **reasoning and execution**, not vendor trivia
2. Never ask *"Where is the button in SAP?"* — ask *"What business event must occur before stock is usable?"*
3. TEC.WMS transaction anchors (ME21N, MIGO, LT0A, etc.) are **learning shorthand**, not the lesson itself
4. When a student asks *"How do I do this in Oracle?"*, answer with **process, documents, and stock impact** — not interface steps

---

## Part I — The universal logistics ribbon

Every distribution-centric ERP implements the same **documentary chain**. WMS depth varies; the business logic does not.

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Supplier │ → │ Purchase │ → │  Goods   │ → │ Putaway  │ → │  Sales   │ → │  Pick &  │ → │  Goods   │
│ delivery │   │  Order   │   │ Receipt  │   │ / Slot   │   │  Order   │   │  Stage   │   │  Issue   │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
     │              │               │              │              │              │              │
  Physical       Commitment      Liability       Location      Demand        Execution      Ownership
  arrival        to buy          transfer        assignment      signal        to ship        transfer
```

Parallel governance processes — **cycle count**, **adjustment**, **replenishment**, **KPI diagnosis** — run continuously across this ribbon. They do not replace it; they keep it truthful.

### TEC.WMS module alignment

| Module | Enterprise chapter | Dominant processes |
|--------|-------------------|-------------------|
| **M1** | Onboarding — dock-to-ship integrity | PO → GR → Putaway → SO → Pick → GI → CC |
| **M2** | Storage strategy — slotting & rotation | Putaway · FIFO · Capacity · Stock accuracy |
| **M3** | Stock governance — truth & replenishment | Cycle count · Adjustment · Min/Max · ROP |
| **M4** | Control tower — performance diagnosis | OTIF · Fill rate · DSI · Rotation · Lean |
| **M5** | Crisis leadership — integrated peak ops | Full ribbon under surge + strategic decision |

### Concorde Logistics department ownership

| Process stage | Primary department | Supporting |
|---------------|-------------------|------------|
| Purchase commitment | Procurement (PROC) | Planning, Finance |
| Dock receipt | Receiving (REC) | Quality, Warehouse |
| Putaway / slotting | Warehouse (WH) | Inventory, Planning |
| Replenishment | Planning (PLAN) | Inventory, Procurement |
| Pick / stage | Warehouse (WH) | Customer Service |
| Dispatch | Shipping (SHP) | Warehouse, CS |
| Inventory audit | Inventory (INV) | Quality, Finance |
| Performance review | Management (MGT) | Planning, CS |

---

## Part II — Process card reference format

Each process card below follows this structure:

| Section | Purpose for professors |
|---------|------------------------|
| **Business process** | Universal definition — what happens in the real world |
| **Purpose** | Why the organization performs it; stakeholder impact |
| **Typical transaction** | Document/event family (not UI navigation) |
| **Terminology** | Vendor-neutral term ↔ vendor-specific labels |
| **Vendor conceptual map** | How each ERP family implements the same idea |
| **Conceptual differences** | Where vendors diverge in *design*, not screens |
| **Learning transfer** | The one sentence a graduate must carry to any employer |

---

## Part III — Core procurement & inbound processes

---

### PROC-PO — Purchase Order Management

**Process ID:** `PROC-PO` · **TEC.WMS anchor:** PO / ME21N · **Module:** M1, M3, M5

#### Business process

Creation of a **formal purchase commitment** that authorizes a supplier to deliver specified materials or services under agreed commercial terms (quantity, price, delivery date, incoterms).

#### Purpose

- Translates a **material requirement** (MRP, manual requisition, emergency shortage) into a legally and financially traceable obligation
- Gives Receiving a **reference document** for dock validation
- Enables **three-way match** later (PO · GR · Invoice)
- In SCN-003 and corrective flows: closes an **ATP gap** when demand exceeds on-hand stock

#### Typical transaction

| Element | Description |
|---------|-------------|
| **Trigger** | Planned requirement, stock below reorder point, or customer order cannot be fulfilled |
| **Input** | Material/SKU, quantity, supplier, requested delivery date, plant/warehouse |
| **Output** | Open purchase order line — *not yet inventory* |
| **Stock impact** | **None** until goods receipt is posted |
| **Key documents** | Purchase requisition (optional) → Purchase order |

#### Terminology

| Universal (teach this) | SAP | Oracle | Dynamics 365 | Odoo |
|------------------------|-----|--------|--------------|------|
| Purchase order | Bestellung / PO | Purchase Order | Purchase order | Purchase Order (`purchase.order`) |
| PO line | PO position | PO line | Purchase order line | Order line |
| Open PO qty | Offene Bestellmenge | Open quantity | Remaining receive quantity | Quantity to receive |
| Supplier | Lieferant / Vendor | Supplier | Vendor | Vendor (`res.partner`) |

#### Vendor conceptual map

| Dimension | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| **Module family** | MM — Materials Management (Purchasing) | SCM — Procurement | Procurement and sourcing | Purchase app |
| **Document object** | Purchase order (EKKO/EKPO) | PO header/lines | Purchase order table | `purchase.order` |
| **Creation path** | Direct PO, requisition conversion, MRP run | Requisition → PO, approved buyer assignment | Planned PO, requisition, vendor collaboration | RFQ → PO, manual, reorder rule trigger |
| **Approval workflow** | Release strategy (optional) | Approval routing | Workflow, purchase requisition policies | Optional multi-level approval |
| **Integration to receipt** | PO reference mandatory on GR (MIGO) | PO-matched receiving | Product receipt against PO | Validate receipt on linked PO |

#### Conceptual differences

| Topic | How vendors differ (conceptually) |
|-------|-----------------------------------|
| **Numbering** | SAP uses external vs internal PO numbers; Oracle uses document sequences; Dynamics uses configurable number sequences; Odoo uses per-journal sequences |
| **Account assignment** | SAP distinguishes stock vs consumption vs asset on PO line; Oracle uses destination type; Dynamics uses procurement categories; Odoo uses analytic accounts |
| **MRP integration** | SAP MD04/MD01 tightly coupled; Oracle Planning Central; Dynamics master planning; Odoo reorder rules + optional MRP module |
| **Drop-ship** | All support direct-to-customer PO variants — stock never touches own warehouse |

#### Learning transfer

> **A purchase order is a promise, not inventory.** Until goods are received and posted, the enterprise has obligation but no usable stock. Every ERP enforces this separation; confusion here causes the "ghost stock" failure mode (SCN-002).

**Classroom question:** *"If the truck is at the dock, do we have stock?"* → Only after GR posting.

---

### PROC-GR — Goods Receipt / Dock Validation

**Process ID:** `PROC-GR` · **TEC.WMS anchor:** GR / MIGO · **Module:** M1, M2, M5

#### Business process

**Recording inbound goods** against a purchase commitment at the receiving point, updating inventory liability and making material available (or placing it on quality hold).

#### Purpose

- Reconciles **physical delivery** with **system expectation** (PO quantity, SKU, lot)
- Transfers ownership/accountability from supplier transit to **enterprise inventory**
- Creates audit trail for **invoice verification**
- Establishes lot/batch traceability for FIFO and quality holds

#### Typical transaction

| Element | Description |
|---------|-------------|
| **Trigger** | Supplier delivery arrives at dock; ASN may pre-notify |
| **Input** | PO reference, delivered quantity, receiving location, batch/lot (if tracked) |
| **Output** | Goods receipt document — posted |
| **Stock impact** | **Increase** unrestricted-use or quality-inspection stock at receiving location |
| **Key documents** | Delivery note (external) · GR document (internal) |

#### Terminology

| Universal | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| Goods receipt | Wareneingang / GR | Receipt / Receive | Product receipt | Receipt / Validate transfer |
| Posting | Buchen / Post | Confirm transaction | Post product receipt | Validate (button concept = posting) |
| Movement type | Bewegungsart (e.g. 101) | Transaction type | Inventory transaction | Stock move type |
| Quality hold | QI stock / inspection | Inspection status | Quarantine order | Quality control point |
| Dock location | Empfangslager | Receiving subinventory | Warehouse location | Input location |

#### Vendor conceptual map

| Dimension | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| **Module family** | MM — Inventory Management | Inventory — Receiving | Warehouse management — inbound | Inventory — Receipt |
| **Transaction family** | MIGO / MB01 movement types | Miscellaneous receipt, PO receipt | Product receipt journal | Incoming shipment validation |
| **PO matching** | Strict — movement 101 against PO | PO-matched receiving required | Registration against PO line | Linked to `purchase.order` line |
| **Partial receipt** | Supported per line | Supported | Supported | Supported |
| **Over-delivery** | Tolerance limits in customizing | Receiving tolerances | Over-delivery % | Configurable tolerance |

#### Conceptual differences

| Topic | Conceptual divergence |
|-------|----------------------|
| **WM vs IM** | SAP separates Inventory Management (plant stock) from WM (bin stock) — GR may hit IM first, then transfer to WM; Oracle uses subinventory + locator; Dynamics uses warehouse + location + license plate; Odoo uses locations in a hierarchy |
| **Posting vs saving** | All ERPs distinguish **draft/saved** vs **posted/validated** — SCN-002 teaches that unposted GR = invisible stock |
| **Returns to vendor** | Reverse movement (SAP 122/161); Oracle Return to Vendor; Dynamics vendor return; Odoo return transfer |
| **Cross-docking** | Advanced WMS skips storage — receipt flows directly to outbound staging |

#### Learning transfer

> **No GR, no stock.** Dock reconciliation is the moment system truth meets physical truth. A saved-but-unposted receipt is one of the most common operational failures in live ERP environments.

**TEC.WMS rule taught:** GR must land in **RECEPTION zone** (REC-01/REC-02) — mirrors industry practice of receiving dock before storage slot.

---

### PROC-PUT — Putaway / Slotting

**Process ID:** `PROC-PUT` · **TEC.WMS anchor:** PUTAWAY / LT01 · LT0A · **Module:** M1, M2, M5

#### Business process

**Internal movement** from receiving/staging to a storage or picking location, applying slotting rules (capacity, rotation, product class, zone).

#### Purpose

- Clears the dock — frees receiving capacity for next delivery
- Assigns inventory to **addressable storage** (bin, aisle, rack level)
- Applies **slotting strategy** — fast movers near pick face, heavy items on lower levels, hazmat segregation
- Enables accurate picking and cycle counting by location

#### Typical transaction

| Element | Description |
|---------|-------------|
| **Trigger** | GR posted to receiving; putaway task generated (manual or system-directed) |
| **Input** | Source location, destination bin, quantity, handling unit |
| **Output** | Confirmed internal stock transfer |
| **Stock impact** | **Neutral** at plant level — changes location dimension only |
| **Key documents** | Transfer order / internal stock move |

#### Terminology

| Universal | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| Putaway | Einlagerung | Put away / Subinventory transfer | Put away work | Internal transfer |
| Bin / location | Lagerplatz | Locator | Location / warehouse position | Location (`stock.location`) |
| Slotting | Einlagerungsstrategie | Putaway rules | Location directives | Putaway rules / routes |
| Capacity check | Kapazitätsprüfung | Locator capacity | Location max weight/volume | Optional constraints |
| Transfer order | Transferauftrag (WM) | Move order | Work order (warehouse) | Picking / internal move |

#### Vendor conceptual map

| Dimension | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| **Module family** | WM/EWM — Transfer | WMS / Inventory move | Warehouse management | Inventory routes |
| **Transaction family** | LT01, LT10, EWM putaway WO | Move order confirm | Work class putaway | Internal transfer validation |
| **Rule engine** | Storage type search, capacity check | Putaway rules by item/locator | Location directives, work templates | Route rules on product/category |
| **M1 vs M2 depth** | M1: simple REC→STOCK transfer (LT0A); M2: capacity + structured slotting (LT01) | Same progression | Same progression | Same progression |

#### Conceptual differences

| Topic | Conceptual divergence |
|-------|----------------------|
| **Task vs transaction** | Advanced WMS (SAP EWM, Dynamics WMS) generates **warehouse tasks** for RF scanners; IM-only ERPs may allow direct bin-to-bin posting without task layer |
| **Capacity model** | Bin max qty (TEC.WMS SCN-007) exists in all vendors — enforcement timing differs (at assignment vs at confirm) |
| **Mixed storage** | SAP storage unit / HU; Oracle LPN; Dynamics license plate; Odoo package (optional) |
| **Cross-zone rules** | TEC.WMS enforces REC → STOCKAGE → EXPEDITION — industry-standard zone sequencing |

#### Learning transfer

> **Putaway is where inventory gets an address.** Until material has a valid storage location, it is received but not operationally available for efficient picking. Capacity and rotation rules exist to prevent warehouse chaos, not to slow operators down.

**Classroom question (SCN-007):** *"Can we force 600 units into a 500-capacity bin?"* → Discuss system enforcement vs override governance.

---

## Part IV — Demand & outbound processes

---

### PROC-SO — Sales Order / Demand Signal

**Process ID:** `PROC-SO` · **TEC.WMS anchor:** SO / VA01 · **Module:** M1, M5

#### Business process

**Customer demand capture** — a commercial commitment to deliver specified products by a requested date, triggering allocation, picking, and shipping processes.

#### Purpose

- Converts customer request into **fulfillment work**
- Drives **ATP/CTP check** — can we promise this date with current stock + inbound?
- Creates revenue recognition trigger (integrated with finance)
- Prioritizes warehouse execution (wave, pick list)

#### Typical transaction

| Element | Description |
|---------|-------------|
| **Trigger** | Customer order entry (EDI, portal, CSR) |
| **Input** | Customer, SKU, quantity, requested ship date, ship-to |
| **Output** | Sales order — confirmed or backordered |
| **Stock impact** | **Reservation/allocation** (soft commitment) — not yet GI |
| **Key documents** | Sales order · Delivery note (later) |

#### Terminology

| Universal | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| Sales order | Kundenauftrag | Sales order | Sales order | Sales Order (`sale.order`) |
| Allocation | Reservierung / ATP | Reservation | Allocation | Reserved quantity |
| Available-to-promise | ATP / Verfügbarkeit | Available to promise | ATP | Available qty |
| Backorder | Rückstand | Backorder | Backorder line | Partial delivery |
| Ship-to | Warenempfänger | Ship-to site | Delivery address | Delivery address |

#### Vendor conceptual map

| Dimension | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| **Module family** | SD — Sales & Distribution | Order Management | Sales and marketing | Sales app |
| **Transaction family** | VA01 order · VA02 change | Create sales order | Sales order header/lines | Confirm quotation / SO |
| **ATP logic** | Global ATP, location-specific | Promising rules | ATP with dimensions | Computed from quants |
| **Credit check** | FI credit management | Credit checking | Credit limit hold | Partner credit limit (optional) |

#### Conceptual differences

| Topic | Conceptual divergence |
|-------|----------------------|
| **Order vs delivery** | SAP often separates SO (VA01) from outbound delivery (VL01N) — two documents; Odoo collapses more steps into delivery flow; Dynamics uses sales → shipment |
| **Allocation timing** | At order entry vs at release to warehouse — policy choice |
| **Drop-ship** | SO triggers PO to supplier — no internal stock touch |
| **SCN-003 pattern** | SO before corrective PO — teaches ATP failure and emergency replenishment |

#### Learning transfer

> **A sales order is a promise to the customer, not a shipment.** It reserves intent. Fulfillment still requires pick, stage, and goods issue. Creating SO without stock visibility causes the stockout crisis (SCN-003).

---

### PROC-PICK — Pick Execution

**Process ID:** `PROC-PICK` · **TEC.WMS anchor:** PICKING / VL01N · FIFO_PICK · **Module:** M1, M2, M5

#### Business process

**Retrieval of goods** from storage/picking locations to fulfill a sales order or transfer requirement, applying picking strategy (FIFO, FEFO, batch, zone pick).

#### Purpose

- Executes the **physical retrieval** against allocated demand
- Moves material to **staging/shipping zone** for verification and loading
- Enforces **rotation policy** — especially critical for perishables (SCN-008, BU-FRESH)
- Provides pick confirmation for shipment posting

#### Typical transaction

| Element | Description |
|---------|-------------|
| **Trigger** | Released sales order / wave / replenishment to pick face |
| **Input** | Source bin, quantity, batch/lot, destination staging |
| **Output** | Pick confirmation — material at shipping staging |
| **Stock impact** | Location change STOCKAGE/PICKING → EXPEDITION staging |
| **Key documents** | Pick list · Transfer/pick confirmation |

#### Terminology

| Universal | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| Pick / pick list | Kommissionierung | Pick wave / move order | Pick work | Picking operation |
| Pick face | Kommissionierzone | Forward pick area | Pick location | Pick zone location |
| FIFO | FIFO / First in first out | FIF O rotation | FIFO date control | Removal strategy (FIFO) |
| FEFO | FEFO | FEFO (expiry) | Best before date | FEFO on lots |
| Staging | Bereitstellungszone | Staging subinventory | Shipment staging | Output location |

#### Vendor conceptual map

| Dimension | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| **Module family** | WM/EWM — Outbound | WMS shipping | Warehouse management outbound | Delivery picking |
| **Transaction family** | VL01N delivery · WM pick WO | Pick release/confirm | Work order pick | Validate picking |
| **Strategy** | WM picking area, FIFO at storage type | Pick rules, min max forward pick | Wave templates, location directives | Removal strategy on location |
| **M2 FIFO** | Batch determination / stock category | Lot selection rules | Batch FIFO | `removal_strategy = fifo` |

#### Conceptual differences

| Topic | Conceptual divergence |
|-------|----------------------|
| **Pick vs issue** | Industry best practice: **pick to staging, then GI** — TEC.WMS enforces STOCKAGE → EXPEDITION before VL02N |
| **Paper vs RF** | Task-driven WMS vs manual posting — process same, execution medium differs |
| **Partial pick** | Backorder remainder vs cancel — policy per customer SLA |
| **Batch mandatory** | Regulated industries force lot selection at pick; distribution may not |

#### Learning transfer

> **Picking is proof of what left the rack.** The pick confirmation tells Shipping that the right material — right lot, right quantity — is at the dock. Skipping pick and posting GI directly breaks audit trail and causes negative stock.

**TEC.WMS rule:** Pick must deposit to **EXPEDITION zone** (EXP-01/EXP-02) before GI.

---

### PROC-SHIP — Shipment Confirmation / Goods Issue

**Process ID:** `PROC-SHIP` · **TEC.WMS anchor:** GI / VL02N · **Module:** M1, M5

#### Business process

**Goods issue** — formal removal of inventory from enterprise ownership upon shipment to customer, closing the fulfillment loop and triggering billing.

#### Purpose

- Reduces on-hand inventory **permanently** (for outbound sale)
- Confirms **OTIF** event — shipped on time, in full
- Triggers **invoice/billing** in integrated ERP
- Updates customer delivery status and COGS (finance)

#### Typical transaction

| Element | Description |
|---------|-------------|
| **Trigger** | Material staged at shipping; transport ready |
| **Input** | Delivery reference, ship quantity, batch (if applicable) |
| **Output** | Posted goods issue |
| **Stock impact** | **Decrease** unrestricted-use stock |
| **Key documents** | Outbound delivery · Bill of lading · GI document |

#### Terminology

| Universal | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| Goods issue | Warenausgang / GI | Issue from stores | Ship confirm | Validate delivery |
| Post goods issue | Warenausgang buchen | Confirm shipment | Post packing slip / ship confirm | Validate picking (stock move done) |
| Proof of delivery | Liefernachweis | POD | Proof of delivery | Signature (optional module) |
| COGS | Wareneinsatz | Cost of goods sold | Inventory issue to COGS | Automatic on validation |

#### Vendor conceptual map

| Dimension | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| **Module family** | SD + MM (PGI) | Shipping / Inventory | Warehouse shipment | Inventory delivery |
| **Transaction family** | VL02N PGI · MIGO 601 | Ship confirm | Ship confirm journal | Delivery order validate |
| **Billing link** | Automatic billing doc (VF01) | Invoice interface | Invoice posting | Invoice from SO |
| **Batch on issue** | Batch split on GI | Lot issue | Batch/serial on ship | Lot on move line |

#### Conceptual differences

| Topic | Conceptual divergence |
|-------|----------------------|
| **PGI timing** | At ship confirm vs at invoice — revenue recognition policy drives this |
| **Delivery document** | SAP VL structure vs Odoo single delivery flow — same stock effect |
| **Transport integration** | TMS load planning optional layer — GI remains inventory event |
| **Negative stock** | All ERPs can allow or block — TEC.WMS blocks GI without sufficient stock |

#### Learning transfer

> **Goods issue is the moment inventory leaves the building.** After GI, the warehouse no longer owns the material; Customer Service owns the delivery promise. GI without prior pick is a governance failure, not a shortcut.

---

## Part V — Inventory governance processes

---

### PROC-CC — Physical Inventory / Cycle Count

**Process ID:** `PROC-CC` · **TEC.WMS anchor:** CC / MI01 · CC_LIST · CC_COUNT · **Module:** M1, M3, M5

#### Business process

**Periodic verification** that system inventory quantities match physical stock on hand, using full physical inventory or cycle counting (count subset of SKUs/locations on a schedule).

#### Purpose

- Maintains **inventory accuracy** — foundation of ATP, finance, and customer promise
- Detects shrinkage, mis-posting, theft, UoM errors
- Supports **month-end/quarter-end** financial close
- Drives root-cause analysis when variance exceeds threshold

#### Typical transaction

| Element | Description |
|---------|-------------|
| **Trigger** | Count plan (ABC schedule), ad-hoc audit, pre-close requirement |
| **Input** | Count list (SKU, location), physical quantity counted |
| **Output** | Count document — variance identified |
| **Stock impact** | **None until adjustment posted** |
| **Key documents** | Count sheet · PI document |

#### Terminology

| Universal | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| Cycle count | Permanente Inventur | Cycle count | Cycle counting | Inventory adjustment (cyclical) |
| Physical inventory | Inventur | Physical inventory | Stock count journal | Inventory count |
| Count document | Inventurbeleg | Count entry | Counting journal | Inventory adjustment |
| Book quantity | Buchbestand | System quantity | On-hand | Theoretical qty |
| Count quantity | Gezählte Menge | Count quantity | Counted quantity | Counted qty |

#### Vendor conceptual map

| Dimension | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| **Module family** | IM — Physical Inventory | Cycle Counting module | Inventory management | Inventory adjustments |
| **Transaction family** | MI01 create · MI04 enter · MI07 post | Count entry · Approve | Count journal · Post | Physical inventory / cycle count |
| **ABC scheduling** | Cycle counting indicator on material | ABC classes | Cycle counting codes | Annual inventory by location |
| **M3 pipeline** | CC_LIST → CC_COUNT → CC_RECON mirrors industry three-step count | Same pattern | Same pattern | Same pattern |

#### Conceptual differences

| Topic | Conceptual divergence |
|-------|----------------------|
| **Blind count** | Hide system qty from counter — best practice; not all ERPs enforce by default |
| **Freeze book** | Block movements during count — SAP phys inv freeze; others use snapshot |
| **Count frequency** | A items monthly, C items quarterly — policy, not software |
| **SCN-004 teaching** | Enter **physical count** (185), not delta (−15) — universal data entry rule |

#### Learning transfer

> **Cycle count is an audit, not an adjustment.** Count first, investigate variance, then adjust with governance. Entering the delta instead of the physical quantity is a classic trainee error in every ERP.

---

### PROC-ADJ — Inventory Adjustment / Variance Resolution

**Process ID:** `PROC-ADJ` · **TEC.WMS anchor:** ADJ / MI07 · CC_RECON · **Module:** M3, M5

#### Business process

**Correction posting** that aligns system inventory with verified physical reality after count variance analysis, with reason code and approval.

#### Purpose

- Restores **stock truth** after justified variance
- Creates **audit trail** for finance (write-off, shrinkage account)
- Prevents cascading errors in ATP and replenishment
- Closes the count document cycle

#### Typical transaction

| Element | Description |
|---------|-------------|
| **Trigger** | Approved count variance; damage write-off; found material |
| **Input** | SKU, location, adjustment qty (+/−), reason code |
| **Output** | Posted adjustment document |
| **Stock impact** | **Increase or decrease** to match physical |
| **Key documents** | Adjustment doc · linked count reference |

#### Terminology

| Universal | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| Adjustment | Bestandskorrektur | Inventory adjustment | Adjustment journal | Inventory adjustment |
| Reason code | Bewegungsgrund | Adjustment reason | Adjustment code | Inventory loss reason |
| Write-off | Abschreibung | Write-off account | Negative adjustment | Scrap location |
| Recount | Nachzählung | Recount | Recount journal | Second count |

#### Vendor conceptual map

| Dimension | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| **Module family** | IM — Inventory Management | Cost Management / Inventory | Inventory adjustment | Inventory |
| **Transaction family** | MI07 post diff · MB1A/MB1C | Adjusting entries | Adjustment journal post | Apply inventory adjustment |
| **Approval** | Authorization group | Approval workflow | Journal approval | Manager approval (optional) |
| **Financial posting** | Automatic to GL account by movement type | Cost update | Financial integration | Stock valuation update |

#### Conceptual differences

| Topic | Conceptual divergence |
|-------|----------------------|
| **Integrated vs separate step** | TEC.WMS M3 integrates ADJ into CC_RECON — some ERPs separate count approval (MI07) from manual adjustment (MB1A) |
| **Threshold governance** | Variance > X% requires supervisor — policy layer on all ERPs |
| **Root cause** | Reason codes differ by industry — teach categorization concept |

#### Learning transfer

> **Adjust with evidence, not impulse.** Every adjustment hits the general ledger. SCN-010 teaches: investigate before posting, document the reason, then align system to physical.

---

### PROC-STOCK — Stock Availability Inquiry

**Process ID:** `PROC-STOCK` · **TEC.WMS anchor:** STOCK / MB52 · **Module:** M1

#### Business process

**Read-only analysis** of current inventory position by material, location, batch, and status — the operational "source of truth" before committing to sales or production.

#### Purpose

- Supports **ATP decisions** before SO creation
- Prevents **negative stock** and overselling
- Identifies **blocked/quality** stock not available for sale
- Reveals **unposted documents** (SCN-002 ghost GR detection)

#### Typical transaction

| Element | Description |
|---------|-------------|
| **Trigger** | Pre-SO check, shift start, exception investigation |
| **Input** | Material, plant/warehouse, optional location/batch filters |
| **Output** | Stock balance display — unrestricted, blocked, in transit |
| **Stock impact** | **None** — inquiry only |

#### Terminology

| Universal | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| Unrestricted stock | Frei verwendbar | On-hand available | Available physical | Available qty |
| Blocked stock | Gesperrter Bestand | Hold / non-nettable | On-hand blocked | Reserved / blocked |
| In transit | Bestellware | In-transit | Registered qty | Incoming / outgoing |
| Stock overview | Bestandsübersicht | On-hand quantity | On-hand inventory | Stock report |

#### Vendor conceptual map

| Dimension | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| **Module family** | MM — Inventory | Inventory inquiry | Inventory on-hand | Reporting |
| **Transaction family** | MB52 · MMBE | On-hand quantity report | On-hand inventory | Product stock report |
| **Dimensions** | Plant · Storage location · Batch | Org · Subinventory · Locator | Warehouse · Location · Batch | Location · Lot · Owner |

#### Learning transfer

> **Look before you promise.** MB52-equivalent inquiry is the professional habit before SO or GI. Stock on the screen is only real if all receipts are posted and all issues confirmed.

---

### PROC-REP — Replenishment Trigger

**Process ID:** `PROC-REP` · **TEC.WMS anchor:** REPLENISH / MD04 · **Module:** M3, M5

#### Business process

**Automated or manual initiation** of supply to restore inventory to target levels when stock crosses reorder point (ROP) or min threshold.

#### Purpose

- Prevents **stockouts** while minimizing carrying cost
- Translates planning parameters (min, max, ROP, safety stock) into **action**
- Balances **service level vs inventory investment**
- May generate PO, production order, or internal transfer

#### Typical transaction

| Element | Description |
|---------|-------------|
| **Trigger** | Stock ≤ ROP; min/max breach; MRP exception |
| **Input** | SKU, current stock, ROP, EOQ/order qty, lead time |
| **Output** | Requisition, planned order, or PO suggestion |
| **Stock impact** | **None until supply received** |

#### Terminology

| Universal | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| Reorder point | Meldebestand | Reorder point | Reorder point | Reordering rule min qty |
| Safety stock | Sicherheitsbestand | Safety stock | Safety stock | Min quantity buffer |
| EOQ | Bestellmenge (fixed lot) | EOQ | Reorder quantity | Multiple quantity |
| MRP run | DISPO / MRP-Lauf | MRP planning | Master planning run | Reorder rule scheduler |
| Min/Max | Min/Max | Min-max planning | Min/max replenishment | Min/max on rule |

#### Vendor conceptual map

| Dimension | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| **Module family** | PP-MRP / MM | Supply Planning | Master planning | Reordering rules |
| **Transaction family** | MD04 stock/requirements · MD01 MRP | Planning workbench | Planned orders | Run scheduler / manual PO |
| **Formula** | ROP = (demand × lead time) + SS | Same industry formula | Same | Configured on rule |
| **SCN-011** | REPLENISH step + ROP_CHECK + EOQ_CALC | Planning parameters | Coverage calculation | Reorder rule trigger |

#### Conceptual differences

| Topic | Conceptual divergence |
|-------|----------------------|
| **MRP vs reorder point** | Full MRP explodes BOM; reorder point is single-SKU heuristic — TEC.WMS M3 teaches reorder point first |
| **Lead time** | Supplier lead time vs internal — affects ROP calculation |
| **Lot sizing** | EOQ, fixed lot, lot-for-lot — policy choice |
| **Manual override** | Planner can firm planned order — human judgment layer |

#### Learning transfer

> **Replenishment is a policy executing a formula, not guesswork.** ROP = (Demand × Lead Time) + Safety Stock. When stock touches ROP, the system speaks — the professional decides whether to trust or override.

---

### PROC-FIFO — Rotation / Batch Compliance

**Process ID:** `PROC-FIFO` · **TEC.WMS anchor:** FIFO_PICK · **Module:** M2

#### Business process

**Stock rotation enforcement** — ensuring oldest receipt (FIFO) or earliest expiry (FEFO) is picked first, critical for perishables, regulated goods, and client SLA.

#### Purpose

- Prevents **obsolescence and waste** (BU-FRESH, Laurentian Foods narrative)
- Meets **regulatory and customer audit** requirements
- Reduces **shrinkage write-offs**
- Demonstrates warehouse **compliance culture**

#### Typical transaction

| Element | Description |
|---------|-------------|
| **Trigger** | Pick request for batch-managed SKU |
| **Input** | Available lots with receipt/expiry dates |
| **Output** | Pick from mandated lot |
| **Stock impact** | Standard pick — lot selection constraint applied |

#### Vendor conceptual map

| Dimension | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| **Strategy name** | FIFO at storage type / batch search | FEFO/FIFO picking rules | Batch disposition codes | Removal strategy FIFO/FEFO |
| **Enforcement** | Batch determination in WM | Pick rule engine | Batch attribute sorting | Strict on location |
| **Override** | Supervisor authorization | Override reason | Exception handling | Force lot (governed) |

#### Learning transfer

> **Rotation is a compliance decision, not a sort preference.** Picking the newest lot when oldest exists is a scored failure in TEC.WMS SCN-008 — and a recall risk in industry.

---

## Part VI — Performance & integrated operations

---

### PROC-KPI — Performance Diagnosis

**Process ID:** `PROC-KPI` · **TEC.WMS anchor:** KPI Tower · KPI_DATA · KPI_SERVICE · **Module:** M4

#### Business process

**Measurement and interpretation** of logistics performance indicators to diagnose service failures, inventory imbalances, and productivity gaps — leading to corrective action.

#### Purpose

- Translates operations into **stakeholder language** (OTIF, fill rate, DSI)
- Enables **S&OP and continuous improvement**
- Prioritizes interventions (replenish, rebalance, retrain)
- Supports **customer SLA governance**

#### Typical indicators (TEC.LOG curriculum)

| KPI | Universal definition | Primary owner |
|-----|---------------------|---------------|
| **OTIF** | On Time In Full — delivered as promised | Customer Service / Shipping |
| **Fill Rate** | % of demand shipped from stock | Planning / Warehouse |
| **DSI** | Days of Supply Inventory — stock ÷ daily demand | Planning / Finance |
| **Inventory Turnover** | COGS ÷ average inventory | Finance / Inventory |
| **LPH** | Lines per hour — pick productivity | Warehouse |
| **Inventory Accuracy** | (1 − \|variance\|/total counted) × 100 | Inventory |

#### Vendor conceptual map

| Dimension | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| **Module family** | CO — Controlling · SAP Analytics Cloud | OTBI / FAW analytics | Power BI + D365 analytics | Spreadsheet / Odoo reporting |
| **Data source** | MC$4 · VL06O · MB5B | Inventory aging · Order fulfillment | Warehouse performance workspace | Stock reports · Delivery analysis |
| **Delivery performance** | VL06O outbound monitor | Order fulfillment KPIs | OTIF calculated fields | On-time delivery report |
| **Philosophy** | Often separate BW/analytics layer | Fusion Analytics | Embedded Power BI | Lighter native reporting |

#### Conceptual differences

| Topic | Conceptual divergence |
|-------|----------------------|
| **Definition variance** | OTIF definitions differ by company — teach **explicit definition** before comparing numbers |
| **Leading vs lagging** | Fill rate (lagging) vs dock dwell (leading) — M4 teaches diagnosis chain |
| **System vs business KPI** | ERP reports operational data; KPI ownership is **management process** |

#### Learning transfer

> **A KPI is a question, not a number.** OTIF dropping is not the problem — it is the signal. The professional asks: root cause in stock, pick, carrier, or demand plan?

**M4 classroom pattern:** Present KPI anomaly → student proposes **one inventory action** and **one process action** — mirrors control tower briefing.

---

### PROC-PEAK — Integrated Crisis Operations (Capstone)

**Process ID:** `PROC-PEAK` · **TEC.WMS anchor:** M5 full pipeline · **Module:** M5

#### Business process

**Concurrent execution** of inbound, storage, outbound, count, replenishment, and KPI response under surge demand — requiring prioritization, escalation, and strategic trade-offs.

#### Purpose

- Simulates **Peak Week** at Concorde Logistics (BU-PEAK)
- Tests **cross-functional judgment** — not isolated transaction skill
- Requires **sequencing under pressure** (what yields first when everything is urgent?)
- Culminates in **executive decision** (M5_DECISION) — capacity, overtime, or SLA renegotiation

#### Typical transaction chain (M5)

```
M5_RECEPTION → M5_PUTAWAY → M5_CYCLE_COUNT → M5_ADJ → M5_REPLENISH → M5_KPI → M5_DECISION → COMPLIANCE_M5
```

#### Vendor conceptual map

| Dimension | SAP | Oracle | Dynamics 365 | Odoo |
|-----------|-----|--------|--------------|------|
| **Peak planning** | IBP / S&OP | Supply planning workbench | Master planning + capacity | Manual + reorder surge |
| **Wave release** | EWM wave management | WMS wave | Wave template release | Batch pickings |
| **Control tower** | SAP LBN / custom Fiori | Fusion SCM dashboard | D365 warehouse insights | Custom dashboard |
| **Decision layer** | IBP scenario | Plan comparison | What-if simulation | Spreadsheet / committee |

#### Conceptual differences

| Topic | Conceptual divergence |
|-------|----------------------|
| **Integrated vs modular** | Large ERPs have separate modules — peak success depends on **orchestration**, not one transaction |
| **Temporary override** | BU-PEAK priority overlay (Enterprise Universe) mirrors **holiday surge policies** in industry |
| **Human escalation** | Escalation ladder (floor → supervisor → ops director) exists in all mature operations — ERP supports, people decide |

#### Learning transfer

> **Peak is when processes collide.** The capstone proves the student can hold the full ribbon in working memory and make governed trade-offs — the skill employers value over any single transaction code.

---

## Part VII — Cross-process concepts (professor reference)

### Document posting lifecycle (all vendors)

| State | Business meaning | TEC.WMS teaching moment |
|-------|------------------|------------------------|
| **Draft / Saved** | Intent recorded, no stock effect | SCN-002 ghost GR |
| **Posted / Validated** | Stock and finance updated | Compliance gate |
| **Cancelled / Reversed** | Audit-preserving undo | Advanced — mention in M5 debrief |

### Zone model (TEC.WMS ↔ industry)

| TEC.WMS zone | Industry concept | Typical vendor representation |
|--------------|------------------|------------------------------|
| RECEPTION | Receiving dock / staging | Receiving location, staging bin |
| STOCKAGE | Bulk / reserve storage | Bulk zone, reserve rack |
| PICKING | Forward pick / pick face | Forward pick area, pick slot |
| EXPEDITION | Shipping staging | Ship staging, outbound dock |
| RESERVE | Overflow / quarantine | Overflow, hold location |

### ATP chain (available-to-promise)

```
On-hand (unrestricted)
  + Planned receipts (open PO)
  − Reservations (open SO)
  − Safety stock
  = ATP available for new demand
```

Teach this formula vendor-neutrally — SCN-003 is the failure when ATP < 0 and corrective PO is required.

### Three-way match (procure-to-pay bridge)

```
Purchase Order  ←→  Goods Receipt  ←↔  Supplier Invoice
     (commitment)      (quantity)         (payment)
```

Professors: mention in M1 GR debrief — students need not execute invoice in TEC.WMS, but must understand GR enables payment.

---

## Part VIII — End-to-end process comparison matrix

Summary for classroom wall chart or slide — **process families only**.

| Business process | SAP module family | Oracle Cloud family | Dynamics 365 family | Odoo app family | Universal document |
|-----------------|-------------------|---------------------|---------------------|-----------------|-------------------|
| Purchase order | MM Purchasing | Procurement | Procurement | Purchase | PO |
| Goods receipt | MM IM / WM | Receiving | WMS inbound | Inventory receipt | GR |
| Putaway | WM/EWM | WMS putaway | WMS work | Internal transfer | Transfer |
| Stock inquiry | MM IM | On-hand | On-hand | Stock report | — |
| Sales order | SD | Order Management | Sales | Sales | SO |
| Pick | WM/EWM | WMS pick | WMS outbound | Picking | Pick confirm |
| Goods issue | SD + MM | Ship confirm | Ship confirm | Delivery validate | GI |
| Cycle count | IM | Cycle count | Count journal | Inventory count | Count doc |
| Adjustment | IM | Adjustment | Adjustment journal | Inventory adj | Adj doc |
| Replenishment | MRP/MM | Planning | Master planning | Reorder rules | Planned order |
| KPI / analytics | CO + BW | Analytics | Power BI | Reporting | Dashboard |
| Peak orchestration | IBP + EWM | Planning + WMS | Planning + WMS | Manual + rules | S&OP decision |

---

## Part IX — Professor facilitation guide

### Opening frame (recommended, 5 min)

*"Today we practice in TEC.WMS. The tool is Concorde's WMS. The lesson is the business process — the same process exists in SAP, Oracle, Dynamics, and Odoo. Your employability is process literacy, not button memory."*

### Per-process teaching pattern (15–20 min each)

1. **Situation** — Tell the Concorde story (dock arrival, customer order, peak surge)
2. **Universal definition** — Read Business process from this document
3. **TEC.WMS execution** — Students perform in simulator
4. **ERP Explorer moment** — Read Vendor conceptual map; ask Learning transfer question
5. **Debrief** — One conceptual difference that surprised them

### Questions that teach transfer (never UI)

| Instead of… | Ask… |
|-------------|------|
| "Where is MIGO in SAP?" | "What must happen before stock increases?" |
| "What's the Odoo button?" | "What document links PO to physical delivery?" |
| "Memorize movement type 101" | "What is the business event movement type 101 represents?" |
| "Dynamics is easier" | "Where does Dynamics store the receiving location concept?" |

### Module-specific emphasis

| Module | Processes to stress in ERP comparison |
|--------|--------------------------------------|
| M1 | PROC-PO, PROC-GR, PROC-PUT, PROC-SO, PROC-PICK, PROC-SHIP, PROC-CC |
| M2 | PROC-PUT (capacity), PROC-FIFO, PROC-STOCK accuracy |
| M3 | PROC-CC (full pipeline), PROC-ADJ, PROC-REP |
| M4 | PROC-KPI — definitions matter more than ERP source |
| M5 | PROC-PEAK — integration over isolation |

### Common student misconceptions

| Misconception | Correction |
|---------------|-------------|
| "PO creates stock" | PO creates obligation only |
| "Saved GR = received" | Posting creates stock |
| "SO ships automatically" | SO triggers pick/GI chain |
| "Cycle count fixes stock" | Count reveals; adjustment fixes with governance |
| "ERP replaces judgment" | ERP enforces rules; professionals handle exceptions |

---

## Part X — Document maintenance

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Aligned manifesto** | TEC Enterprise Experience Manifesto v1.0 — Part IX |
| **Aligned universe** | TEC Enterprise Universe v1.0 — Process ribbon §3.3 |
| **TEC.WMS step source** | `server/rulesEngine.ts` · `client/src/data/stepErpMap.ts` |
| **Review cycle** | Each RC with new SCN or process step |
| **Change authority** | Programme leadership + pedagogy owner |

### Version history

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-05 | Initial official release — 12 canonical processes + professor guide |

---

*Collège de la Concorde · TEC.LOG · Concorde Logistics · TEC.WMS*  
*Process literacy transfers. Vendor interfaces expire.*
