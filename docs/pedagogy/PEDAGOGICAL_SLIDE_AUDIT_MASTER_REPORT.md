# Pedagogical Slide Audit — Master Report (M1–M5)

**Institution:** TEC.LOG · Collège de la Concorde · TEC.WMS Mini-WMS Concorde Logistics  
**Audit date:** 2026-07-01  
**Context:** RC15 CLOSED · RC16 preparation · Next cohorts (Groupe A/B + future intakes)  
**Auditor scope:** 36 canonical slides in `client/src/data/modules.ts`  
**Method:** Full-text pedagogical cross-reference against institutional documentation hierarchy (Constitution → Programme → Enseignant → Student guides → Mission Sheets → Canonical answers → Learning feedback → RC audits)

**Constraints observed:** No slide modifications · No redesign · Audit only · No commit · No deploy

---

## Executive summary

The TEC.WMS slide programme delivers a **coherent college-level ERP/WMS curriculum** with strong scenario alignment on exercise slides (M1 SCN labels corrected; M2/M3/M5 SCN maps verified; M4 Annexe A integration excellent). The deck is **certification-aware** for Silver (M1) but **lags production** on Gold messaging. The **single highest institutional risk** is M3: slides omit the **mandatory teacher validation gate** before M4 — a requirement repeated in the enseignant guide, student guide, and monitoring guide.

**Overall institutional slide quality: ★★★★ (4.1 / 5) — Good**

**Readiness for next cohorts: CONDITIONAL GO** — teachable today with instructor supplements; slide text updates recommended before Groupe A/B formal intake.

---

## Slide inventory

| Module | Slides | Duration (metadata) | SCNs | Module score |
|--------|--------|---------------------|------|--------------|
| M1 Fondements | 10 | 4 h | SCN-001–005 | ★★★★ (4.2) |
| M2 Exécution entrepôt | 7 | 8 h* | SCN-006–008 | ★★★★ (4.3) |
| M3 Contrôle stocks | 7 | 6 h | SCN-009–011 | ★★★★ (3.9) |
| M4 Intelligence KPI | 7 | 6 h | SCN-012–014 | ★★★★ (4.0) |
| M5 Simulation intégrée | 5 | 6 h | SCN-015–017 | ★★★★+ (4.4) |
| **Total** | **36** | **30 h programme** | **17 SCNs** | **4.1 avg** |

\*M2 `durationH: 8` in `modules.ts` vs programme guide 6 h — metadata inconsistency only.

---

## Overall institutional scorecard

| Criterion | Rating | Evidence |
|-----------|--------|----------|
| **Professional** | ★★★★ | SAP T-codes, warehouse zones, KPI bands, compliance gates |
| **College level** | ★★★★ | Accessible FR; some formulas (Safety Stock Z×σ) exceed typical CEGEP comfort |
| **Industry aligned** | ★★★★ | FIFO, cycle count, OTIF, RCA, Peak Week — Quebec logistics context |
| **Certification ready** | ★★★ | Silver well covered; Gold slide stale; M3 validation gate missing |
| **ERP/WMS realistic** | ★★★★ | Transaction chain credible; bin notation drift; M2/M3/M4 slide 6 = TEC.WMS consolidation (RC16) |
| **Decision-support oriented** | ★★★★★ | M4/M5 analytical and strategic decision pedagogy strong |
| **TEC.WMS environment** | ★★★★★ | TEC.WMS simulator is the sole official course environment (RC16); SAP anchors throughout |

**Weighted institutional score: 81 / 100**

---

## Module comparison

```
Pedagogical strength by module (estimated teaching effectiveness)

M5 ████████████████████ 88  (scenario slides excellent; Gold summary weak)
M2 █████████████████░░░ 85
M1 ████████████████░░░░ 82
M4 ████████████████░░░░ 80
M3 ██████████████░░░░░░ 74  (content good; validation gate gap)
```

| Dimension | Best module | Weakest module |
|-----------|-------------|----------------|
| Scenario fidelity | **M5** (1:1 SCN slides) | M1 (missing putaway/pick slides) |
| Institutional doc alignment | **M4** slide 7 + Annexe A | M3 (missing teacher gate) |
| Cognitive load balance | **M2** | M3 (Safety Stock formula) |
| Certification preparation | **M1** Silver slide | **M5** Gold slide (outdated) |
| ERP integration hooks | **M1** (SAP spine) | M4 slide 4 (off-topic productivity) |

---

## Cross-cutting findings

### Aligned with documentation (strengths)
1. **36-slide canonical set** matches enseignant guide counts (10/7/7/7/5).
2. **M4 KPI bundle** (6×, 95 %, 4 %, 3.5 j, $48k) matches student guide Annexe A.
3. **M5 Peak Week** blocking logic (M5_ADJ, KPI snapshot, ≥2 KPIs) matches runtime and Annexe B.
4. **SCN exercise slides** — prior P0 M3 permutation **resolved** in current `modules.ts`.
5. **Professor notes** (`notesFr`) are classroom-ready across all modules.
6. **Analytical paradigm** (M4 empty monitor) explicitly taught — closes common student confusion.

### Gaps vs documentation (weaknesses)
1. **M3 teacher validation** — not on any slide; enseignant Séance 6 depends on it.
2. **Threshold visibility** — 70/100 for M3–M5 rarely stated on slides.
3. **Gold certification** — slide 5 notes imply future availability; 18-gate model absent.
4. **Silver QR badge** — M1 slide 10 "à venir" vs live verify portal.
5. **Mission Sheet supremacy** — Constitution states Mission Sheets override slides; SlideViewer does not surface disclaimer.
6. **M4 slide 4** — productivity/cost not in assessment model.
7. **Bin notation** — `A1-C1-03` vs simulator `B-01-R1-L1`.
8. **Concept vs scenario order** — M3 teaches Min/Max before cycle count; scenarios run CC first.

### Constitution hierarchy compliance

Per `TEC_WMS_PEDAGOGICAL_CONSTITUTION.md`:

| Layer | Status |
|-------|--------|
| Mission Sheets > Slides | Slides defer correctly on SCN slides; transaction slides lack SCN cross-links |
| Cockpit OIL | Not referenced in slides — acceptable (runtime layer) |
| Learning feedback (M4/M5) | Slide 7 M4/M5 align; no slide equivalent for M1–M3 feedback |

---

## Priority improvements

### P0 — Before next formal cohort intake
| # | Module | Action |
|---|--------|--------|
| 1 | M3 | Add **validation enseignant obligatoire** content (new slide or expand slide 7) |
| 2 | M5 | Update **Gold certification slide** to live 18-gate model |
| 3 | All | Add **Mission Sheet authority disclaimer** to SlideViewer professor mode |

### P1 — RC16 pedagogical polish
| # | Module | Action |
|---|--------|--------|
| 4 | M3 | State **seuil 70/100**; reorder concepts CC → variance → replenish |
| 5 | M4 | Replace slide 4 with **lead time + capital immobilisé** |
| 6 | M4 | Fix professor **notes/body mismatch** slide 2 |
| 7 | M1 | Emphasize **COMPLIANCE gate** and Putaway/Picking |
| 8 | M1 | Update Silver **QR/badge** copy to production state |
| 9 | M2 | Document **GR pré-postée** contract on scenario slide |

### P2 — Quality enhancement
| # | Module | Action |
|---|--------|--------|
| 10 | M3 | Simplify Safety Stock slide (operational, not statistical) |
| 11 | M2 | Align bin naming with simulator convention |
| 12 | M4 | Embed **surstock anti-pattern** in slide 2 body |
| 13 | M5 | Add **Peak Week** terminology to slide 1 |
| 14 | All | Wire `scenarioMap` to scenario deep-links in SlideViewer |

### P3 — Long-term
| # | Action |
|---|--------|
| 15 | M1–M3 learning feedback slide annex (mirror M4 `learningFeedbackRegistry`) |
| 16 | Bilingual glossary pull-through on terminology slides |
| 17 | Harmonize module `durationH` with programme guide |
| 18 | Optional LIFO comparison slide or remove LIFO from M2 description |

---

## Quick wins (no structural redesign)

1. **Professor note patches only** — M3 validation gate script on slide 7 `notesFr`.
2. **M5 slide 5 body text** — replace "sera disponible" with current Gold checklist bullets from `MANUEL_CERTIFICATION_TECWMS.md`.
3. **M1 slide 10** — change "à venir" to "disponible sur portail vérification".
4. **M4 slide 2 `notesFr`** — rewrite to discuss rotation, not OTIF.
5. **Distribute Annexe A/B** references in Séance 9–10 professor scripts (already on slides 7 M4, 2–4 M5).

---

## Long-term improvements

1. **Pedagogical slide versioning** — link slide `id` to documentation release (RC16, RC17).
2. **Threshold single source** — inject `shared/moduleThresholds.ts` values into slide cover templates.
3. **ERP market comparison appendix** — optional instructor sheet mapping SAP T-code → equivalent concepts in SAP, Oracle, Dynamics ecosystems (neutral market reference only).
4. **Cohort-specific supplements** — Groupe A/B empty-cohort instructor addendum (no change to slide canon).
5. **Post-slide formative check** — 2-question micro-quiz per module aligned to slide objectives (separate from certification quiz).

---

## Readiness assessments

### Future cohorts (Été 2026 — Groupe A/B)

| Readiness | Verdict |
|-----------|---------|
| **Instructor-led with supplements** | **READY** — enseignant guide compensates slide gaps |
| **Self-paced student slides only** | **NOT READY** — M3 gate and M4 anti-patterns insufficient on slides alone |
| **Empty cohort provisioning** | Slides unaffected — operational concern separate |

**Recommendation:** Deliver Séances 1–10 using slides + Mission Sheets. Mandate instructor verbal coverage of M3 validation on Séance 6 until slide updated.

### TEC.ERP pedagogical reuse

| Factor | Assessment |
|--------|------------|
| SAP transaction anchors | **High reuse** — ME21N, MIGO, MI01, MI07 map to ERP labs |
| M2/M3/M4 slide 6 (TEC.WMS consolidation) | **High reuse** — Mission Control live demo, no external lab |
| KPI Annexe A/B | **High reuse** — portable to any ERP dashboard module |
| Simulator-specific (monitor, bins) | **Low reuse** — needs TEC.ERP scenario adapter notes |
| Bilingual structure | **High reuse** — `bodyFr`/`bodyEn` pairs export cleanly |

**TEC.ERP reuse score: 78 / 100** — slides are a strong **conceptual spine**; bind to ERP lab sheets per transaction slide.

---

## Star distribution (36 slides)

| Rating | Count | % |
|--------|-------|---|
| ★★★★★ Excellent | 14 | 39 % |
| ★★★★ Good | 17 | 47 % |
| ★★★ Acceptable | 3 | 8 % |
| ★★ Needs Improvement | 1 | 3 % |
| ★ Rewrite Recommended | 0 | 0 % |

**Lowest-rated slide:** M4 slide 4 (Productivité et coût) — ★★  
**Highest-rated cluster:** M5 slides 2–4 (SCN-015/016/017) — ★★★★★ each

---

## Relationship to prior audits

| Prior report | Date | This audit |
|--------------|------|------------|
| `SLIDES_CERTIFICATION_AUDIT_REPORT.md` | 2026-06-11 | M1 SCN-003/004/005 labels **fixed**; Gold **now implemented** (slide 5 still stale) |
| `Documentation/PEDAGOGICAL_ALIGNMENT_AUDIT.md` | RC13 | M2 GO confirmed; M3 YELLOW — **validation gate still open** |
| `Documentation/M4_PEDAGOGICAL_INTELLIGENCE_AUDIT.md` | RC13 | Slide 7 closes most M4 gaps; slide 4 unrelated |
| `docs/releases/RC15_CLASSROOM_READINESS_REPORT.md` | 2026-07-01 | Platform GO; slide pedagogy not in RC15 scope — this audit fills gap |

---

## Deliverables index

| Report | Path |
|--------|------|
| M1 audit | `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_M1.md` |
| M2 audit | `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_M2.md` |
| M3 audit | `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_M3.md` |
| M4 audit | `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_M4.md` |
| M5 audit | `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_M5.md` |
| Master report | `docs/pedagogy/PEDAGOGICAL_SLIDE_AUDIT_MASTER_REPORT.md` |

---

## Final institutional decision

| Decision | Status |
|----------|--------|
| **Pedagogical audit complete** | ✓ |
| **Slides modified** | ✗ (per scope) |
| **Ready for RC16 planning** | ✓ |
| **Ready for next cohort (slides alone)** | Conditional — instructor supplements required |
| **Recommended RC16 workstream** | Pedagogical slide text alignment (P0–P1 items) |

---

*This audit treats official Markdown/HTML/TypeScript documentation as source of truth. PDF/DOCX deliverables in `Dossier_Institutionnel_TECWMS_Cohorte_Fondatrice_2026/` are authoritative for signature but were cross-referenced via their `*_PDF_READY.md` mirrors.*
