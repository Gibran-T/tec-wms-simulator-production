# TEC.WMS Visual Learning System — Slide Production Standard

**Version:** 1.1 (RC17 revise)  
**Authority:** Extends `research/visual-learning/VISUAL_BIBLE.md` and `STYLE_GUIDE.md`  
**Pilot module:** M1 only — M2–M5 remain on legacy layout until promoted

---

## Purpose

Define the **institutional slide production pattern** for TEC.WMS classroom delivery. VLS master imagery anchors visual learning while **delivery slide count remains aligned with RC16 choreography** (M1 = 10 slides, programme total = 36).

---

## Eight VLS sections mapped to ten M1 delivery slides

| Delivery slide | `vlsSection` | RC16 map | Production role |
|----------------|--------------|----------|-----------------|
| S1 | `hero` | M1-S1 Couverture | Hero image + inline module objectives |
| S2 | `observation-hotspots` | M1-S2 Flux | Guided observation + interactive hotspots |
| S3 | `concepts` | M1-S3 PO / ME21N | One SAP transaction · one slide · one demo |
| S4 | `concepts` | M1-S4 GR / MIGO | One SAP transaction · one slide · one demo |
| S5 | `concepts` | M1-S5 Stock / MMBE | One SAP transaction · one slide · one demo |
| S6 | `concepts` | M1-S6 SO / VA01 | One SAP transaction · one slide · one demo |
| S7 | `concepts` | M1-S7 GI / VL02N | One SAP transaction · one slide · one demo |
| S8 | `concepts` | M1-S8 CC / MI01 | One SAP transaction · one slide · one demo |
| S9 | `simulation-scn` | M1-S9 Scénarios | Simulator demo + SCN-001→005 mapping |
| S10 | `certification` | M1-S10 Silver | Quiz · checkpoint · Silver certification |

**Slide counts:** M1 = 10 · M2 = 7 · M3 = 7 · M4 = 7 · M5 = 5 · **Total = 36**

---

## Asset policy

| Asset | Path |
|-------|------|
| Master (research) | `research/visual-learning/modules/M{n}/MASTER_M{n}.png` |
| Production (app) | `client/public/visual-learning/modules/TEC_WMS_VLS_M{n}.png` |
| Public URL | `/visual-learning/modules/TEC_WMS_VLS_M{n}.png` |

Never edit production PNGs in place. Promote copies after pedagogy sign-off (`CHANGELOG.md`).

---

## Data model

Slides declare VLS section via `vlsSection` on `SlideContent` in `client/src/data/modules.ts`.

Supporting configuration:

- `client/src/data/vlsSlideStandard.ts` — section labels, M1 hotspots, hero URL
- `client/src/components/slides/vls/VlsM1SlideCanvas.tsx` — M1 pilot renderer

Modules without `vlsSection` continue using `SlideVisualPanel` (legacy React visuals).

---

## Pedagogical preservation rules

1. All official FR/EN body text and professor notes must be preserved — never deleted.
2. **One SAP transaction = one slide + one demo** (M1-S3 through M1-S8).
3. RC16 Classe 1 (M1-S1→S5) and Classe 2 (M1-S6→S10) choreography must remain intact.
4. SCN labels and order must match Mission Sheets (M1: SCN-001 → SCN-005).
5. Certification thresholds unchanged (quiz ≥ 60%, SCN ≥ 60/100, compliance gates).
6. No scoring, router, or backend changes as part of slide production.

---

## Rollout phases

| Phase | Scope |
|-------|--------|
| RC17 pilot (revise) | M1 — 10 VLS delivery slides |
| RC18+ | M2–M5 promotion after M1 classroom validation |
| Future | Per-slide exports under `research/visual-learning/slides/M{n}/` |
