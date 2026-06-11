# Canonical Slides 36 — Conflict Resolution Report

**Date:** 2026-06-11  
**Status:** RESOLVED · **no commit · no push · no deploy**  
**Rule applied:** 17 canonical scenarios · **36 canonical slides** (M1=10 · M2=7 · M3=7 · M4=7 · M5=5)

---

## 1. Conflict summary

| Source | M5 | Total | Verdict |
|--------|-----|-------|---------|
| `AULA7_AULA_READY_PLAN` (pre-fix) | 7 | 38 | ❌ Contradicted constitution |
| `VISUAL_PHASE1_SLIDES_IMPLEMENTATION_REPORT` | 5 | 36 | ✅ Matches constitution |
| **Code before fix** | 7 slides in `modules.ts` · M5=7 in `slideCounts.ts` | **38** | ❌ Expansion applied |
| **Code after fix** | 5 | **36** | ✅ Aligned |

**Decision:** Revert M5 expansion. Move ex-M5-S06 and ex-M5-S07 to instructor documentation (Annexe B supplément), not canonical slides.

---

## 2. Real counts (verified post-fix)

| Module | `modules.ts` | `slideCounts.ts` | `slideVisualMap.ts` | Hub UI (`TOTAL_SLIDE_COUNT`) |
|--------|-------------|------------------|---------------------|------------------------------|
| M1 | 10 | 10 | 10 | dynamic |
| M2 | 7 | 7 | 7 | dynamic |
| M3 | 7 | 7 | 7 | dynamic |
| M4 | 7 | 7 | 7 | dynamic |
| M5 | **5** | **5** | **5** | dynamic |
| **Total** | **36** | **36** | **36** | **36** |

Node cross-check (2026-06-11): `{ "1":10, "2":7, "3":7, "4":7, "5":5 }` → total **36** across all three sources.

---

## 3. Files altered in this resolution

| File | Change |
|------|--------|
| `client/src/data/modules.ts` | Removed canonical slides M5-S06 (Instructor Script) and M5-S07 (Slides→Quiz→Scenarios) |
| `client/src/data/slideCounts.ts` | M5: 7 → **5** · `TOTAL_SLIDE_COUNT` = **36** |
| `client/src/data/slideVisualMap.ts` | Removed M5 entries 6 and 7 (map now 36 entries) |
| `Documentation/.../09-APPENDICES/B-aula7-m5-instructor-supplement.md` | **New** — instructor-only content from ex-M5-S06/S07 |
| `AULA7_AULA_READY_PLAN.md` | Updated to 36 canonical · Annexe B reference · removed 38-slide claims |

### Unchanged by this resolution (already correct)

| File | Role |
|------|------|
| `client/src/pages/SlideViewer.tsx` | Loads slides via `getModuleById()` · clamps to `modData.slides.length` |
| `client/src/pages/student/StudentSlidesHub.tsx` | Uses `SLIDE_COUNT_BY_MODULE` / `TOTAL_SLIDE_COUNT` |
| `client/src/pages/teacher/TeacherSlidesHub.tsx` | Same |
| `client/src/pages/teacher/TeacherDashboard.tsx` | Same |

---

## 4. Content relocated (not deleted)

| Former slide | New location |
|--------------|--------------|
| M5-S06 — Script instructeur Aula 7 | `B-aula7-m5-instructor-supplement.md` § B.1 |
| M5-S07 — Passage Slides → Quiz → Scénarios | `B-aula7-m5-instructor-supplement.md` § B.2 |

Path: `Documentation/Pedagogical_Framework/Pedagogical_Framework/01_Guide_Enseignant_Maitre/GUIDE_MAITRE_TECLOG_RC15_MASTER/09-APPENDICES/B-aula7-m5-instructor-supplement.md`

---

## 5. Systems explicitly NOT touched

| Area | Status |
|------|--------|
| `server/db.ts` | ✅ No diff |
| Scoring engine (`server/m*.scoring`, `module*.rules`) | ✅ No diff |
| Certification unlock (`silver.certification`, Gold path) | ✅ No diff |
| Scenario engine / canonical SCN (17 scenarios) | ✅ No diff |
| Migrations / seed | ✅ No diff |
| tRPC routers (cert/scoring) | ✅ No diff |

**Note:** Other uncommitted client work exists (`SlideViewer.tsx`, `StepForm.tsx`, `StudentSlidesHub.tsx`, `SlideVisualPanel`, etc.) from Visual Phase 1 / Aula 7 prep — those are **slides/UI only**, not DB/scoring/cert/engine.

---

## 6. Validation results

| Check | Result |
|-------|--------|
| `git diff --check` | **PASS** (LF/CRLF warning only on `modules.ts`) |
| `pnpm test` | **PASS** — 16 files · **310 tests** |
| `pnpm build` | **PASS** — Vite + esbuild OK |

---

## 7. Pre-commit checklist

- [x] M1=10 · M2=7 · M3=7 · M4=7 · M5=5 · Total=36
- [x] `modules.ts` · `slideCounts.ts` · `slideVisualMap.ts` aligned
- [x] Extra M5 content in Annexe B documentation
- [x] `AULA7_AULA_READY_PLAN` reconciled with 36-slide rule
- [x] Tests and build green
- [x] DB / scoring / certification / engine untouched
- [ ] **Awaiting explicit user approval before commit/push/deploy**

---

*Constitution pédagogique: 36 slides canônicos · 17 scénarios canônicos · contenu instructeur hors deck.*
