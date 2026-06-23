# Checkpoint Engine Phase 1 — Implementation Report

**Date:** 2026-06-23  
**Status:** Implemented — **not committed** (awaiting review)  
**Plan:** [CHECKPOINT_ENGINE_IMPLEMENTATION_PLAN.md](./CHECKPOINT_ENGINE_IMPLEMENTATION_PLAN.md)

---

## Summary

Phase 1 introduces a unified **checkpoint progression engine** for **M2–M5** that recomputes `module_progress` from all official module SCNs (latest non-demo eval run per SCN). **Silver**, **Gold**, certificate registry, and certification UI were **not modified**.

Approved deferrals honored:

- M1 / Silver logic unchanged
- No strict unlock chain on `runs.start`
- Slides and quizzes M2–M4 excluded from checkpoint gates
- Quiz M5 remains Gold-only (not a checkpoint gate)

---

## Files changed

| File | Action |
|------|--------|
| `server/checkpointEngine.ts` | **Created** — core engine (compute, recompute, pure snapshot builder) |
| `server/checkpointEngine.test.ts` | **Created** — 20 unit tests (CK-M2 through CK-TRG matrix) |
| `drizzle/schema.ts` | **Modified** — extended `module_progress` columns |
| `drizzle/0015_checkpoint_engine.sql` | **Created** — migration SQL |
| `scripts/apply-checkpoint-engine-migration.mjs` | **Created** — one-shot migration runner |
| `scripts/backfill-cohorte-fondatrice-checkpoints.ts` | **Created** — Cohorte Fondatrice backfill (`--dry-run` / `--apply`) |
| `server/db.ts` | **Modified** — `upsertModuleCheckpointSnapshot`, `ModuleCheckpointUpsertPayload` |
| `server/routers.ts` | **Modified** — `recordModulePass` (M2–M5 recompute), `validateTeacherModule` (M3 recompute) |

### Not changed (per scope)

- Silver / Gold engines (`server/db.ts` cert section, `server/goldCertification.ts`)
- Certificate registry, PDFs, verification URLs
- Certification UI (`CertificationsPage.tsx`, badge components)
- `runs.start` unlock gates
- M1 `recordModulePass` path (legacy single-scenario `computeModulePassResult`)

---

## Implementation details

### Checkpoint rules (M2–M5)

| Module | SCNs | Threshold | `passed` |
|--------|------|-----------|----------|
| M2 | SCN-006…008 | 60 | All 3 SCNs pass |
| M3 | SCN-009…011 | 70 | All 3 SCNs pass **+** `teacherValidated` |
| M4 | SCN-012…014 | 70 | All 3 SCNs pass |
| M5 | SCN-015…017 | 70 | All 3 SCNs pass |

**`progressPct`:**

- M2/M4/M5: `round(completedScenarios / requiredScenarios × 100)`
- M3: `round((completedScenarios + (teacherValidated ? 1 : 0)) / (requiredScenarios + 1) × 100)`

**Latest run wins** per SCN (same as Silver/Gold).

### Persistence (`module_progress`)

New columns:

- `progressPct`, `completedScenarios`, `requiredScenarios`
- `averageScore`, `scenarioStatusJson`, `engineVersion`

`teacherValidated` is **preserved** on checkpoint upsert (not overwritten by recompute).

### Triggers

1. **`warehouse.recordModulePass`** — when `moduleId ∈ {2,3,4,5}` and `CHECKPOINT_ENGINE_ENABLED !== "false"`, calls `recomputeModuleCheckpoint` instead of single-score pass logic.
2. **`warehouse.validateTeacherModule`** — after M3 teacher validation, calls `recomputeModuleCheckpoint(userId, 3)`.

### Feature flag

| Env | Default | Effect |
|-----|---------|--------|
| `CHECKPOINT_ENGINE_ENABLED` | `true` (unset) | Set `"false"` to restore legacy M2–M5 `recordModulePass` behavior |

---

## Tests run

### Full suite

```text
npm test
```

| Result | Detail |
|--------|--------|
| **PASS** | 27 files, **497 tests**, 0 failures |

### Targeted checkpoint + certification

```text
npx vitest run server/checkpointEngine.test.ts server/silver.certification.test.ts server/gold.certification.test.ts
```

| File | Tests | Result |
|------|-------|--------|
| `server/checkpointEngine.test.ts` | 20 | PASS |
| `server/silver.certification.test.ts` | 29 | PASS |
| `server/gold.certification.test.ts` | 21 | PASS |

### Checkpoint test coverage (plan matrix)

| ID | Covered |
|----|---------|
| CK-M2-01 … CK-M2-04 | Yes |
| CK-M3-01 … CK-M3-03 | Yes |
| CK-M4-01 … CK-M4-02 | Yes |
| CK-M5-01 … CK-M5-02 | Yes |
| CK-ISO-01, CK-ISO-02 | Yes |
| CK-TRG-01, CK-TRG-02 | Yes |

---

## Backfill dry-run result

**Command:**

```text
npx tsx scripts/backfill-cohorte-fondatrice-checkpoints.ts --dry-run
```

**Result:** **BLOCKED — no database connection**

```text
DrizzleQueryError: connect ECONNREFUSED 127.0.0.1:3307
```

Local `DATABASE_URL` points to MySQL on `127.0.0.1:3307`, which is not running in this environment. The script is ready for staging/production execution.

**Target students (script):**

| Name | Email |
|------|-------|
| Darlin Campaz Paredes | `dcparedes2010@gmail.com` |
| Fredy Tamile Lola | `fredlolabio@gmail.com` |
| Prince Agbodjan Sewa Francis Ghislain | `sewafrancispa@gmail.com` |
| Aissata Soukeina Camara | `aissatasoukeinacamara@gmail.com` |

**Pre-apply checklist (ops):**

1. `node scripts/apply-checkpoint-engine-migration.mjs` (or run `0015_checkpoint_engine.sql`)
2. `CREATE TABLE module_progress_backup_YYYYMMDD AS SELECT * FROM module_progress;`
3. `npx tsx scripts/backfill-cohorte-fondatrice-checkpoints.ts --dry-run`
4. Review `.manus-logs/checkpoint-backfill-dry-run-*.json`
5. `npx tsx scripts/backfill-cohorte-fondatrice-checkpoints.ts --apply`

Backfill **does not** update `profiles.silverCertified`, `profiles.goldCertified`, or registry files.

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Migration not applied before deploy** | High | Run `0015_checkpoint_engine.sql` before enabling writes; migration runner handles duplicate-column skip |
| **Cohorte `passed` flags corrected downward** | Medium | Students with `passed=true` from one SCN only will show `passed=false` after backfill — expected; communicate to instructors |
| **M3 `progressPct` drops from 100→75** if SCNs pass but teacher not validated | Low | Matches pedagogical truth; teacher validation unchanged |
| **Schema/code drift on old rows** | Low | Recompute on next run report visit; backfill accelerates alignment |
| **Grandfather M3–M5 sub-70 `passed`** | Medium | Checkpoint engine does not grandfather; backfill may clear stale `passed` unless all SCNs ≥ threshold |
| **DB unavailable for dry-run locally** | Low | Run backfill on Railway staging with production-like data |

---

## Next steps

1. **Review** this report and diff; approve commit when ready.
2. **Apply migration** on staging: `node scripts/apply-checkpoint-engine-migration.mjs`
3. **Deploy** application code with `CHECKPOINT_ENGINE_ENABLED` default (on).
4. **Run backfill dry-run** on staging DB; review JSON deltas for four Cohorte students.
5. **Apply backfill** on staging; smoke M2–M5 dashboards (read-only — UI display updates deferred to Phase 1.5 if desired).
6. **Production** — migration → dry-run → apply → monitor.
7. **Phase 1.5 (optional):** Surface `progressPct` / `completedScenarios` in module dashboards (no cert UI changes).
8. **Phase 2 (deferred):** Strict unlock chain (`CHECKPOINT_STRICT_UNLOCK`), M1 five-SCN alignment, compliance-in-checkpoint if required.

---

## Rollback

1. Set `CHECKPOINT_ENGINE_ENABLED=false` and redeploy.
2. Restore `module_progress` from backup table if backfill applied incorrectly.
3. Migration columns can remain nullable-safe; no cert data affected.

---

*End of Phase 1 implementation report.*
