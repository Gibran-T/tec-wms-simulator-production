# TEC.WMS Visual Learning System — Roadmap

**Current version:** 1.0  
**Foundation date:** 2026-07-03 (RC17)

Phased delivery plan for institutional visual assets. Phases are sequential; later phases depend on Visual Bible compliance of earlier deliverables.

---

## Phase 1 — Master Canvas

**Status:** In progress (architecture complete)

| Deliverable | Location | Notes |
|-------------|----------|-------|
| Visual Bible + Style Guide | `research/visual-learning/` | ✅ v1.0 published |
| Master canvas template | `master-canvas/` | Zone grid, palette, typography rulers |
| Process ribbon standard | Visual Bible | Supplier → Customer icon strip |
| Copy policy | README.md | Research → production workflow |

**Exit criteria:** Master canvas approved; module briefs can reference single layout standard.

---

## Phase 2 — Module Images

**Status:** Pending manual asset placement

| Deliverable | Location | Notes |
|-------------|----------|-------|
| M1 master | `modules/M1/MASTER_M1.png` | Flux logistique intégré — warehouse overview |
| M2 master | `modules/M2/MASTER_M2.png` | Organisation entrepôt — zones A/B/C/D |
| M3 master | `modules/M3/MASTER_M3.png` | Gestion des stocks — control tower + inventory |
| M4 master | `modules/M4/MASTER_M4.png` | Performance opérationnelle — KPI wall |
| M5 master | `modules/M5/MASTER_M5.png` | Peak Week — opérations intégrées |
| Production copies | `client/public/visual-learning/modules/` | Post-approval only |

**Exit criteria:** All five masters approved, promoted, CHANGELOG updated.

---

## Phase 3 — Sequential Slides

**Status:** Not started

| Deliverable | Location | Notes |
|-------------|----------|-------|
| Per-slide PNG exports | `slides/M1/` … `slides/M5/` | 36 slides aligned with `modules.ts` |
| Slide naming | `M{n}-S{nn}_{slug}.png` | Matches canonical slide IDs |
| PPT/PDF export packs | `exports/` | Instructor classroom materials |

**Exit criteria:** Slide set covers 36 canonical slides; pedagogy audit sign-off.

---

## Phase 4 — Interactive Hotspots

**Status:** Not started

| Deliverable | Notes |
|-------------|-------|
| SVG overlay layers | Zone click targets on module masters |
| Hotspot manifest | JSON map: coordinates → glossary / SCN links |
| SlideViewer integration | Separate development track — not VLS-only |

**Exit criteria:** M1 hotspot pilot validated in classroom dry-run.

---

## Phase 5 — Instructor Animations

**Status:** Not started

| Deliverable | Notes |
|-------------|-------|
| Short loop sequences | Receiving → Putaway → Picking micro-animations |
| Format | MP4 or Lottie — standards TBD in Style Guide 1.2 |
| Use case | Projector transitions, LMS embed |

**Exit criteria:** Animation style matches Visual Bible; no cartoon motion.

---

## Phase 6 — TEC.ERP Expansion

**Status:** Not started

| Deliverable | Notes |
|-------------|-------|
| Programme fork | `research/visual-learning/erp/` or sibling repo (TBD) |
| Shared Visual Bible | Extend palette and module taxonomy for ERP tracks |
| Cross-reference library | Reuse `references/` vendor captures |

**Exit criteria:** TEC.ERP pilot module images produced under same approval workflow.

---

## Dependency map

```
Phase 1 Master Canvas
        ↓
Phase 2 Module Images ──► Production promotion
        ↓
Phase 3 Sequential Slides ──► exports/ (PPT, PDF)
        ↓
Phase 4 Interactive Hotspots ──► App integration (separate)
        ↓
Phase 5 Instructor Animations
        ↓
Phase 6 TEC.ERP Expansion
```

---

## Out of scope (explicit)

- Slide text changes (`client/src/data/modules.ts`)
- React visual component refactors (`PremiumSlideVisual.tsx`)
- UI redesign or Fiori shell changes
- Automated deployment of assets (manual promotion until script approved)
