# TEC.WMS Visual Learning System — Style Guide

**Version:** 1.0  
**Companion:** `VISUAL_BIBLE.md` (creative standards)

Technical specifications for file creation, export, and downstream compatibility.

---

## Resolution standards

### Module master images (`MASTER_M{n}.png`)

| Attribute | Standard |
|-----------|----------|
| Minimum width | 3840 px (4K-ready) |
| Recommended | 3840 × 2160 (16:9) |
| Minimum for approval | 1920 × 1080 (1080p) — upscaling not permitted for production promotion |
| Color space | sRGB |
| Bit depth | 8-bit per channel |

### Slide exports (future — `slides/M{n}/`)

| Attribute | Standard |
|-----------|----------|
| Target | 1920 × 1080 (16:9) |
| Safe title zone | Top 120 px reserved for institutional header overlay if needed |
| Safe footer zone | Bottom 100 px for process ribbon continuity |

### Master canvas (`master-canvas/`)

| Attribute | Standard |
|-----------|----------|
| Purpose | Shared zone grid, typography rulers, color swatches |
| Format | PNG or SVG reference board |
| Size | 3840 × 2160 baseline |

---

## PNG standards

| Rule | Detail |
|------|--------|
| Format | PNG-24 with alpha only when transparency required |
| Compression | Lossless; optimize with `pngcrush` or equivalent — no visible artifacting |
| Naming (master) | `MASTER_M{n}.png` in `modules/M{n}/` |
| Naming (production) | `TEC_WMS_VLS_M{n}.png` in `client/public/visual-learning/modules/` |
| Naming (slides) | `M{n}-S{nn}_{slug}.png` (e.g., `M1-S02_flux-logistique.png`) |
| Metadata | Embed title and VLS version in companion `prompts/` or CHANGELOG entry — not required in EXIF |

**Do not** store JPEG masters for pedagogical art (generational loss on re-export).

---

## Future SVG usage

SVG is planned for Phase 3+ (sequential slides, interactive hotspots):

| Use case | SVG role |
|----------|----------|
| Process ribbon icons | Scalable, single-color themable |
| Zone overlays | Hotspot boundaries on module masters |
| KPI sparklines | Lightweight inline charts |
| Print | Embed PNG fallback for PowerPoint |

**Current phase (1.0):** PNG masters only. SVG standards will be appended in Style Guide 1.1 when first SVG ships.

---

## Aspect ratios

| Deliverable | Ratio | Notes |
|-------------|-------|-------|
| Module master | 16:9 | Primary format |
| Slide export | 16:9 | Matches `SlideViewer` projection |
| Thumbnail / hub card | 16:9 | Crop from master safe zone — no recomposition |
| Instructor PDF | 16:9 or A4 landscape | Margins per PDF section below |
| PowerPoint | 16:9 widescreen default | Widescreen 13.333 × 7.5 in |

Avoid mixed aspect ratios within the same module set.

---

## Margins

### Slide-safe margins (1920 × 1080)

```
┌────────────────────────────────────────┐
│ ← 48px →                    ← 48px → │  top: 48px
│                                        │
│         SAFE CONTENT AREA              │
│                                        │
│ ← 48px →                    ← 48px → │  bottom: 48px
└────────────────────────────────────────┘
```

- **Critical text** (module title banner) stays inside 48 px inset
- **Process ribbon** spans full width at bottom — designed as integral part of master, not overlay

### PDF margins (A4 landscape)

- 15 mm all sides for institutional headers/footers
- Module image scaled to fit content width; maintain aspect ratio

---

## Slide compatibility

VLS assets must remain legible when displayed in:

- **TEC.WMS SlideViewer** — full-screen 16:9 projection
- **Instructor second screen** — 1920×1080 typical
- **Student hub cards** — cropped preview (`ModulePreviewVisual` replacement — future integration)

Design masters with:

- High contrast titles (WCAG AA minimum for overlaid text)
- KPI panels readable at 50% scale (thumbnail test)

Current slide runtime uses React-drawn visuals (`client/src/components/slides/visuals/`). VLS PNG integration is a **future wiring task** — assets must be ready before code changes.

---

## PowerPoint compatibility

| Rule | Detail |
|------|--------|
| Insert mode | Full-bleed 16:9 image on blank slide |
| Max file size per slide | ≤ 5 MB PNG recommended for smooth presenter mode |
| Font embedding | N/A — text baked into PNG for VLS masters |
| Template | Future `exports/ppt/` institutional template — not yet created |

Export path: `research/visual-learning/exports/` → manual or scripted PPT assembly.

---

## PDF compatibility

| Rule | Detail |
|------|--------|
| Resolution embed | 300 DPI equivalent for print PDFs (scale 3840 px width → ~32 cm print) |
| Compression | PNG source → PDF via institutional scripts (`scripts/generate-*.mjs` pattern) |
| Color | sRGB embedded; CMYK conversion only at print vendor stage |

Student guides and instructor handbooks in `docs/pedagogy/` may reference VLS assets once promoted.

---

## Production copy rules

1. Export final master from research at full resolution.
2. Optionally generate optimized 1920×1080 production variant if file size > 2 MB (document in CHANGELOG).
3. Copy — never move — to `client/public/visual-learning/modules/`.
4. Verify public URL loads in dev: `/visual-learning/modules/TEC_WMS_VLS_M{n}.png`.

---

## Version tagging

Include in CHANGELOG for each promoted asset:

- VLS semver (e.g., 1.0.0)
- Master filename and SHA-256 (optional)
- Production filename
- Approver initials / date
