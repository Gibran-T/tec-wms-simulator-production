# TEC.WMS Visual Learning System — Visual Bible

**Version:** 1.0  
**Authority:** Institutional — governs all TEC.WMS and future TEC.ERP pedagogical imagery  
**Companion:** `STYLE_GUIDE.md` (technical specifications)

---

## Mission

Establish a single, repeatable visual language for warehouse and ERP pedagogy at Collège de la Concorde. Every VLS asset must help students **recognize real logistics environments**, **read operational dashboards**, and **connect classroom theory to industry systems** — without distraction, fantasy, or brand misrepresentation.

This document is the **supreme visual authority** for VLS. If an asset conflicts with this Bible, the asset is rejected until corrected.

---

## Visual philosophy

### Industrial realism

Images must depict believable warehouse and control-room environments:

- Correct scale relationships (racks, aisles, dock doors, mezzanines)
- Authentic equipment brands and forms (reach trucks, counterbalance forklifts, pallet jacks)
- Realistic lighting (overhead warehouse luminaires, monitor glow in control towers)
- Operational clutter where appropriate (pallets, shrink wrap, lane markings, safety bollards)

**Prohibited:** stylized 3D game aesthetics, neon cyberpunk palettes, impossible geometry, floating UI without physical anchors.

### Educational clarity

Every frame serves a learning objective:

- Zone labels must be legible at intended display size
- Process flows (Supplier → Customer) use consistent iconography across modules
- KPI panels show realistic metric names aligned with TEC.LOG curriculum (OTIF, Fill Rate, DSI, etc.)
- Visual hierarchy: title → operational scene → supporting data → process ribbon

Avoid decorative elements that do not teach.

### Camera consistency

| Context | Standard |
|---------|----------|
| Warehouse floor (M1, M2, M5) | High-angle isometric or elevated 3/4 view; full facility legibility |
| Control tower / KPI (M3, M4) | Eye-level or slight elevation; operators visible from rear/side; dashboard wall dominant |
| Module thumbnails | Same camera family as module master; no jarring perspective shifts within a module |

Maintain consistent horizon and vanishing logic within a module series.

---

## Environment standards

### Lighting

- **Warehouse:** Bright, even overhead industrial lighting; no dramatic single-source spotlights unless narratively justified (e.g., M5 peak crisis — controlled contrast only)
- **Control tower:** Dim ambient room + illuminated screens; faces not required; focus on dashboards and operator posture
- **Avoid:** lens flare, bloom, HDR exaggeration, uncanny skin rendering

### Warehouse proportions

- Standard selective rack: ~8–12 m aisle width visible; 2–4 pallet positions deep where shown
- Dock doors: proportional to trailer (53 ft semitrailer reference)
- Mezzanine / WMS office: plausible height (~4–6 m clear)
- Floor markings: yellow safety lanes, zone color accents per module palette

### Rack standards

- Blue/orange selective racking or industry-neutral grey
- Upright frames, beam levels, pallet positions clearly readable
- Location labels (A1, B2, etc.) when pedagogically relevant — consistent with Mini-WMS bin logic

### Forklift standards

- Counterbalance and reach truck forms recognizable
- Yellow/orange industrial livery acceptable; no fantasy liveries
- Operators in cab or walking with pallet jack — scale correct relative to racks

### Truck standards

- Box trailers and semitrailers at loading docks
- Realistic carrier branding only when reference-captured and pedagogically licensed; generic livery preferred for institutional masters
- Dock levelers and bumpers visible where receiving/shipping zones are shown

---

## Personnel standards

### Operator uniforms

- **Warehouse floor:** High-visibility vests, hard hats, safety footwear — Quebec/industrial norm
- **Control tower / office:** Business-casual or corporate polo/button-down (blue/grey palette); headsets acceptable for M3/M4 call-center aesthetic
- **Diversity:** Inclusive representation without tokenism; professional posture

### Control Tower standards

- Multi-monitor workstations (2–3 screens per operator)
- Large video wall or dashboard grid for KPI modules (M3, M4)
- Sidebar navigation metaphor acceptable (Dashboard, Entrepôt, Transport, Alertes, Rapports)
- Alert panels: Critical / High / Medium counts — aligned with operational literacy goals

---

## Typography

- **Module headers:** Bold sans-serif; French primary (`M{n} — TITRE PÉDAGOGIQUE`)
- **Subtitles:** Smaller weight; French explanatory line
- **Dashboard KPIs:** English acronyms acceptable where industry-standard (OTIF, SKU, PO); French labels for student-facing titles
- **Minimum legibility:** All header text readable at 1920×1080 full-screen slide projection

---

## French educational language

Primary pedagogical titles and subtitles are **French**:

| Module | Title standard |
|--------|----------------|
| M1 | Fondements — flux logistique intégré / organisation entrepôt |
| M2 | L'organisation de l'entrepôt — stratégie de stockage et emplacement |
| M3 | La gestion des stocks — planification et réapprovisionnement |
| M4 | Performance opérationnelle — analyse des KPI et amélioration continue |
| M5 | Peak Week — opérations intégrées — haute demande et prise de décision stratégique |

English may appear on dashboards mirroring real WMS/ERP UIs. French titles always anchor the pedagogical frame.

---

## Corporate palette

Module accent colors align with TEC.WMS module theme (`client/src/data/moduleTheme.ts`):

| Module | Accent | Usage |
|--------|--------|-------|
| M1 | Blue `#3B82F6` | Receiving, storage, flow |
| M2 | Blue `#2563EB` | Zone A/B/C/D coding |
| M3 | Emerald `#059669` | Inventory, stock levels |
| M4 | Amber `#D97706` | KPI dashboards, alerts |
| M5 | Purple `#7B1FA2` | Peak operations, crisis |

**Process ribbon (all modules):** Supplier (grey) → Receiving (orange) → Putaway (yellow) → Storage (blue) → Picking (green) → Packing (purple) → Shipping (red) → Customer (grey).

Neutral backgrounds: warehouse grey floor, white/off-white dashboard panels, dark control-room walls.

---

## Prohibited content

| Category | Rule |
|----------|------|
| Fantasy | No dragons, gamification mascots, sci-fi holograms |
| Cartoons | No illustrated characters, emoji-style icons in scene art |
| Exaggerated AI effects | No impossible glow, surreal proportions, melted text |
| Brand misuse | No unauthorized logos presented as endorsement |
| Violence / unsafe acts | No operators without PPE in active zones |

---

## Real logistics environment

Reference captures live under `references/`:

- **WMS/ERP vendors:** SAP, Oracle, Dynamics, Microsoft, BlueYonder, Manhattan
- **Retail / 3PL context:** Amazon, Costco, Sobeys, Metro, Logistec
- **Carriers:** UPS, FedEx, DHL

Use references for proportion and UI literacy — **do not copy proprietary UI pixel-for-pixel** into published masters without clearance.

---

## Approval checklist

Before any master is promoted to production:

- [ ] Industrial realism verified
- [ ] French module title/subtitle present
- [ ] Process ribbon consistent with Visual Bible
- [ ] Module accent color aligned
- [ ] No prohibited content
- [ ] Style Guide resolution met
- [ ] Pedagogy owner sign-off recorded in CHANGELOG
