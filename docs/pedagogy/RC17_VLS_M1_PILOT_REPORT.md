# RC17 — VLS M1 Pilot Report (Revise)

**Programme:** TEC.LOG · Collège de la Concorde  
**Date:** 2026-07-03  
**Scope:** Module 1 slide production pilot only  
**Status:** Revised per QA — pending review (not committed)

---

## Executive summary

Module 1 adopts the **Visual Learning System (VLS)** while **preserving the RC16 10-slide delivery structure** and programme total of **36 slides**. QA returned REVISE on the initial 8-slide consolidation; this revision restores one SAP transaction per slide (S3–S8), RC16 Classe 1 / Classe 2 choreography, and institutional guide alignment — while keeping VLS hero imagery and interactive hotspots on the opening slides.

Modules M2–M5 are **unchanged** (legacy layout and slide counts).

---

## Before / after slide structure

### Before (8-slide pilot — REVISE)

| Slide | `vlsSection` | Issue |
|-------|--------------|-------|
| 1 | `hero` | OK |
| 2 | `observation` | Split from hotspots |
| 3 | `objectives` | Extra slide — broke M1-S1→S5 map |
| 4 | `hotspots` | Extra slide — broke choreography |
| 5 | `concepts` | **6 transactions consolidated** — broke one-transaction-per-slide |
| 6 | `simulation` | Split from SCN mapping |
| 7 | `scn-mapping` | Extra slide |
| 8 | `certification` | Was M1-S10 |

**Counts:** M1 = 8 · Total = 34 ❌

### After (10-slide revise — target)

| Slide | `vlsSection` | RC16 map | Title (FR) |
|-------|--------------|----------|------------|
| 1 | `hero` | M1-S1 | Couverture + objectifs inline |
| 2 | `observation-hotspots` | M1-S2 | Flux logistique + hotspots VLS |
| 3 | `concepts` | M1-S3 | PO / ME21N |
| 4 | `concepts` | M1-S4 | GR / MIGO |
| 5 | `concepts` | M1-S5 | Stock / MMBE |
| 6 | `concepts` | M1-S6 | SO / VA01 |
| 7 | `concepts` | M1-S7 | GI / VL02N |
| 8 | `concepts` | M1-S8 | CC / MI01 |
| 9 | `simulation-scn` | M1-S9 | Simulateur + SCN-001→005 |
| 10 | `certification` | M1-S10 | Quiz · Silver certification |

**Counts:** M1 = 10 · M2–M5 = 26 · **Total = 36** ✅

---

## Hero image

| Property | Value |
|----------|-------|
| Production path | `client/public/visual-learning/modules/TEC_WMS_VLS_M1.png` |
| Public URL | `/visual-learning/modules/TEC_WMS_VLS_M1.png` |
| Master path | `research/visual-learning/modules/M1/MASTER_M1.png` |
| Dimensions | 1024 × 576 (PNG, sRGB) |

VLS image appears on S1 (hero), S2 (observation + hotspots), and as thumbnail on S3–S8 (transaction slides).

---

## Hotspots (slide 2)

Seven interactive zones on the hero image (`vlsSlideStandard.ts`):

1. Réception inbound  
2. Putaway  
3. Stockage  
4. Picking  
5. Packing & staging  
6. Expédition outbound  
7. Bureau WMS / Control Tower  

---

## Pedagogical preservation checklist

| Requirement | Status |
|-------------|--------|
| M1 = 10 slides | ✅ |
| Programme total = 36 slides | ✅ |
| RC16 Classe 1 (S1→S5) / Classe 2 (S6→S10) | ✅ |
| One SAP transaction per slide (S3–S8) | ✅ |
| Guide Professeur RC16 alignment | ✅ |
| Quick Reference alignment | ✅ |
| Master Instructor Handbook alignment | ✅ |
| Pedagogical Slide Audit M1 alignment | ✅ |
| SCN-001 → SCN-005 preparation | ✅ Slide 9 |
| Quiz M1 + Silver certification logic | ✅ Slide 10 |
| FR/EN body text preserved | ✅ RC16 baseline restored |
| Professor notes class-by-class usable | ✅ Per-slide notes restored |
| M2–M5 unchanged | ✅ |
| Scoring / backend / DB | ✅ Not modified |

---

## Files changed

| File | Change |
|------|--------|
| `research/visual-learning/SLIDE_STANDARD.md` | 10-slide delivery mapping documented |
| `client/src/data/vlsSlideStandard.ts` | Composite section IDs (`observation-hotspots`, `simulation-scn`) |
| `client/src/components/slides/vls/VlsM1SlideCanvas.tsx` | Hero+objectives, observation+hotspots, simulation+SCN layouts |
| `client/src/data/modules.ts` | M1 restored to 10 slides with VLS sections |
| `client/src/data/slideCounts.ts` | M1: 10 (total: 36) |
| `client/src/data/slideVisualMap.ts` | M1 map restored for slides 1–10 |
| `client/src/components/slides/visuals/PremiumSlideVisual.tsx` | M1 label: 10 slides VLS |

---

## Build verification

Run: `pnpm build`  
Result: *(see build output below)*

---

## Out of scope (by design)

- M2–M5 slide redesign  
- Per-slide PNG exports (`research/visual-learning/slides/M1/`)  
- Git commit / push / deploy  

---

## Recommended review steps

1. Open `/student/slides/1` and walk all **10** slides in FR and EN.  
2. Toggle Professor Mode — verify oral notes match RC16 class pacing (S1–S5 class 1, S6–S10 class 2).  
3. On slide 2, click each hotspot — confirm zone detail panel updates.  
4. Confirm slides 3–8 each show a single SAP transaction with demo pacing.  
5. Confirm slide 9 lists SCN-001 through SCN-005 with simulator paths.  
6. Confirm slide 10 Silver certification text matches RC16 institutional baseline.

---

## QA recommendation

**APPROVE** — pending successful `pnpm build` and spot-check of slide viewer.
