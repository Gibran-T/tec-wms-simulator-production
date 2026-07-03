# TEC.WMS Visual Learning System (VLS)

**Programme:** TEC.LOG · Collège de la Concorde  
**Release context:** RC17  
**Version:** 1.0  
**Status:** Foundation architecture — institutional source of truth for pedagogical imagery

---

## Purpose

The Visual Learning System (VLS) is the **official institutional repository** for every pedagogical image used by TEC.WMS and future TEC.ERP programmes.

VLS is **not** a slide redesign, UI change, or code refactor. It is a governed asset pipeline that separates:

- **Research** — where images are created, iterated, and approved
- **Production** — where approved copies are served to the application and exported materials

All future module visuals, slide exports, instructor materials, and cross-programme ERP imagery must originate from this tree.

---

## Repository layout

```
research/visual-learning/          ← Master workspace (edit here)
├── README.md                      ← This file
├── VISUAL_BIBLE.md                ← Institutional visual standards
├── STYLE_GUIDE.md                 ← Technical file standards
├── CHANGELOG.md                   ← Version history
├── ROADMAP.md                     ← Phased delivery plan
├── master-canvas/                 ← Shared layout / zone templates
├── modules/                       ← Module-level master images
│   ├── M1/ … M5/
├── slides/                        ← Future per-slide exports
│   ├── M1/ … M5/
├── prompts/                       ← AI / design prompt library
├── references/                    ← Vendor & industry reference captures
└── exports/                       ← Batch export staging (PPT, PDF, web)

client/public/visual-learning/     ← Production copies only (never edit)
└── modules/                       ← Approved images served at runtime
```

---

## Research vs production

| Layer | Path | Role | Editable? |
|-------|------|------|-----------|
| **Research (master)** | `research/visual-learning/` | Source of truth for design, iteration, prompts, references | **Yes** |
| **Production (deployed)** | `client/public/visual-learning/` | Approved copies consumed by the app and external exports | **No — copy only** |

**Rule:** Never work directly from production assets. Never edit files under `client/public/visual-learning/`.

---

## How future images are produced

1. **Brief** — Align with `VISUAL_BIBLE.md`, module pedagogy (`client/src/data/modules.ts`), and Mission Sheet intent.
2. **Reference** — Gather vendor/industry captures under `references/<vendor>/`.
3. **Prompt / design** — Store prompts in `prompts/`; iterate in `modules/M{n}/` or `slides/M{n}/`.
4. **Review** — Pedagogy owner + visual lead verify against Visual Bible and Style Guide.
5. **Approve** — Record decision in `CHANGELOG.md`.
6. **Promote** — Copy approved PNG to `client/public/visual-learning/modules/` (production naming: `TEC_WMS_VLS_M{n}.png`).
7. **Integrate** — Application wiring is a **separate** task (not part of VLS foundation).

---

## Approval workflow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   Draft     │ ──► │ Peer review  │ ──► │ Pedagogy    │ ──► │ Copy to      │
│ (research/) │     │ (Visual Bible│     │ sign-off    │     │ production/  │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
                                              │
                                              ▼
                                        CHANGELOG entry
```

**Sign-off criteria:**

- Matches Visual Bible (industrial realism, French educational language, corporate palette)
- Meets Style Guide resolution and format standards
- Aligns with module learning objectives (no decorative drift)
- No fantasy, cartoon, or exaggerated AI artifacts

---

## Versioning

- **VLS version** — Tracked in `CHANGELOG.md` (semver: MAJOR.MINOR.PATCH).
- **Asset version** — Filename convention for masters: `MASTER_M{n}.png` (module folder).
- **Production filename** — `TEC_WMS_VLS_M{n}.png` in `client/public/visual-learning/modules/`.
- **Breaking visual changes** — Increment MAJOR; document migration in CHANGELOG.

---

## Expected master module images (manual placement)

Place official module masters here. **Do not commit until pedagogy owner confirms.**

| Module | Expected master file | Research path |
|--------|---------------------|---------------|
| M1 | `MASTER_M1.png` | `research/visual-learning/modules/M1/MASTER_M1.png` |
| M2 | `MASTER_M2.png` | `research/visual-learning/modules/M2/MASTER_M2.png` |
| M3 | `MASTER_M3.png` | `research/visual-learning/modules/M3/MASTER_M3.png` |
| M4 | `MASTER_M4.png` | `research/visual-learning/modules/M4/MASTER_M4.png` |
| M5 | `MASTER_M5.png` | `research/visual-learning/modules/M5/MASTER_M5.png` |

After approval, promote copies to:

| Module | Production file | Production path | Public URL |
|--------|----------------|-----------------|------------|
| M1 | `TEC_WMS_VLS_M1.png` | `client/public/visual-learning/modules/TEC_WMS_VLS_M1.png` | `/visual-learning/modules/TEC_WMS_VLS_M1.png` |
| M2 | `TEC_WMS_VLS_M2.png` | `client/public/visual-learning/modules/TEC_WMS_VLS_M2.png` | `/visual-learning/modules/TEC_WMS_VLS_M2.png` |
| M3 | `TEC_WMS_VLS_M3.png` | `client/public/visual-learning/modules/TEC_WMS_VLS_M3.png` | `/visual-learning/modules/TEC_WMS_VLS_M3.png` |
| M4 | `TEC_WMS_VLS_M4.png` | `client/public/visual-learning/modules/TEC_WMS_VLS_M4.png` | `/visual-learning/modules/TEC_WMS_VLS_M4.png` |
| M5 | `TEC_WMS_VLS_M5.png` | `client/public/visual-learning/modules/TEC_WMS_VLS_M5.png` | `/visual-learning/modules/TEC_WMS_VLS_M5.png` |

---

## Copy policy (mandatory)

```
Master (research/visual-learning/modules/M{n}/MASTER_M{n}.png)
        ↓
   Approval + CHANGELOG
        ↓
Production copy (client/public/visual-learning/modules/TEC_WMS_VLS_M{n}.png)
```

- Production always receives **copies**, never in-place edits.
- Re-promotion overwrites production only after a new approval cycle.
- Optional future script: `scripts/sync-visual-learning-assets.mjs` (not yet implemented).

---

## Related institutional docs

| Document | Location |
|----------|----------|
| Pedagogical Constitution | `Documentation/Pedagogical_Framework/` |
| Slide content (36 canonical) | `client/src/data/modules.ts` |
| Slide visual map | `client/src/data/slideVisualMap.ts` |
| Pedagogical slide audits | `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_*.md` |

---

## Maintenance

1. All new pedagogical imagery → VLS research tree first.  
2. Production promotion → documented in CHANGELOG.  
3. Visual standard changes → update VISUAL_BIBLE.md + STYLE_GUIDE.md together.  
4. Do not store unrelated audit screenshots here; use `Documentation/screenshots/` for QA evidence.
