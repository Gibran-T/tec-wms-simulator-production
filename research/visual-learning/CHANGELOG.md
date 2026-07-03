# TEC.WMS Visual Learning System — Changelog

All notable changes to VLS architecture and promoted assets are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
VLS versioning is independent of application RC releases unless explicitly linked.

---

## [1.0.0] — 2026-07-03

### Added

- Initial VLS repository architecture under `research/visual-learning/`
- Institutional documents: `README.md`, `VISUAL_BIBLE.md`, `STYLE_GUIDE.md`, `ROADMAP.md`
- Directory tree: `master-canvas/`, `modules/M1–M5/`, `slides/M1–M5/`, `prompts/`, `references/`, `exports/`
- Reference vendor folders: SAP, Oracle, Dynamics, Microsoft, BlueYonder, Manhattan, Amazon, Costco, Sobeys, Metro, UPS, FedEx, DHL, Logistec
- Production staging folder: `client/public/visual-learning/modules/`
- Documented master filenames: `MASTER_M1.png` … `MASTER_M5.png`
- Documented production filenames: `TEC_WMS_VLS_M1.png` … `TEC_WMS_VLS_M5.png`
- Copy policy: research → approval → production (no in-place production edits)

### Status

- **Architecture:** Ready
- **Module masters:** Awaiting manual placement by pedagogy owner
- **Production assets:** Empty — promotion pending approval
- **Application integration:** Not started (by design)

---

## Template for future entries

```markdown
## [1.x.x] — YYYY-MM-DD

### Added / Changed / Promoted

- `MASTER_M{n}.png` — description — approved by [initials]
- Promoted `TEC_WMS_VLS_M{n}.png` to production

### Notes

- Linked RC / pedagogy ticket (if any)
```
