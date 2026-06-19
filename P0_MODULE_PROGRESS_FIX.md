# P0 Module Progress Hotfix

**Date:** 2026-06-18  
**Priority:** P0 — production 502 on `/student/module4`, `/student/module5`  
**Scope:** Data integrity + read-path deduplication only. No pedagogical or scoring changes.

---

## Problem summary

`module_progress` accumulated thousands of duplicate rows per user (e.g. user 213: **5,036 rows** for 3 modules). Root causes:

1. No `UNIQUE(userId, moduleId)` constraint — `ON DUPLICATE KEY UPDATE` in `upsertModuleProgress` never fired.
2. `RunReport.tsx` re-render loop calling `recordModulePass` (upstream amplifier; not changed in this hotfix).
3. `modules.progress` returned the full duplicate history with no deduplication.
4. tRPC `httpBatchLink` batched `modules.progress` with dashboard queries → ~1.7 MB response exceeded Railway upstream window → **502**.

---

## Changes in this hotfix

| Layer | Change |
|---|---|
| `drizzle/schema.ts` | `uniqueIndex("module_progress_user_module_idx")` on `(userId, moduleId)` |
| `drizzle/0014_module_progress_unique.sql` | Merge + dedupe existing rows, then add unique index |
| `server/db.ts` | True upsert via select-then-update; canonical `ORDER BY` on reads; `getModuleProgressWithModules()` returns one row per module |
| `server/routers.ts` | `modules.progress` uses `getModuleProgressWithModules()` |
| `scripts/p0-apply-module-progress-migration.mjs` | One-shot migration runner for Railway production |

**Preserved (unchanged tables/logic):** `scenario_runs`, `progress` (step history), `scoring_events`, `quiz_attempts`, `profiles` (silver/gold certification), all scoring thresholds and pedagogical content.

---

## Affected tables

| Table | Operation | Notes |
|---|---|---|
| `module_progress` | **READ + WRITE + DDL** | Dedup, merge certification fields, add unique index |
| `modules` | READ only | Join target for `modules.progress` |
| `profiles` | None | Certification flags untouched |
| `scenario_runs` | None | Full scenario history preserved |
| `progress` | None | Per-step run history preserved |
| `scoring_events` | None | Scoring history preserved |

---

## Migration plan

### Pre-migration (production)

1. **Snapshot backup** (Railway MySQL → Export or `mysqldump module_progress`):
   ```sql
   CREATE TABLE module_progress_backup_20260618 AS SELECT * FROM module_progress;
   SELECT COUNT(*) FROM module_progress;
   SELECT COUNT(DISTINCT userId, moduleId) AS distinct_pairs FROM module_progress;
   ```

2. **Record baseline metrics** for validation (heavy user, e.g. userId 213):
   ```sql
   SELECT userId, moduleId, COUNT(*) AS cnt, MAX(bestScore), MAX(passed), MAX(teacherValidated)
   FROM module_progress WHERE userId = 213 GROUP BY userId, moduleId;
   ```

### Deploy sequence

| Step | Action | Owner |
|---|---|---|
| 1 | `git push` → Railway auto-deploy (build + start) | CI/Railway |
| 2 | Code deploy activates **read deduplication** immediately (502 relief even before SQL) | Automatic |
| 3 | Run migration against production `DATABASE_URL`: | Operator |
| | `node scripts/p0-apply-module-progress-migration.mjs` | |
| | — or — `pnpm drizzle-kit migrate` (if dev deps available) | |
| 4 | Verify post-migration counts (see checklist below) | Operator |

### Migration SQL (canonical)

File: `drizzle/0014_module_progress_unique.sql`

**Phase A — Merge** certification-relevant fields into survivor row (`MIN(id)` per pair):

- `passed` = `MAX(passed)` (any pass wins)
- `bestScore` = `MAX(bestScore)`
- `completedAt` = earliest non-null completion among passing rows
- `teacherValidated` = `MAX(teacherValidated)`
- `teacherValidatedAt` = `MAX(teacherValidatedAt)`

**Phase B — Delete** all non-survivor rows for each `(userId, moduleId)`.

**Phase C — Constraint** `CREATE UNIQUE INDEX module_progress_user_module_idx ON module_progress (userId, moduleId)`.

### SQL cleanup query (standalone)

```sql
-- 1. Merge into canonical survivor (MIN id per userId+moduleId)
UPDATE module_progress mp
INNER JOIN (
  SELECT
    userId, moduleId, MIN(id) AS keepId,
    MAX(CAST(passed AS UNSIGNED)) AS passed,
    MAX(bestScore) AS bestScore,
    MIN(CASE WHEN passed = 1 AND completedAt IS NOT NULL THEN completedAt END) AS completedAt,
    MAX(CAST(teacherValidated AS UNSIGNED)) AS teacherValidated,
    MAX(teacherValidatedAt) AS teacherValidatedAt
  FROM module_progress
  GROUP BY userId, moduleId
) agg ON mp.id = agg.keepId
SET
  mp.passed = agg.passed,
  mp.bestScore = agg.bestScore,
  mp.completedAt = agg.completedAt,
  mp.teacherValidated = agg.teacherValidated,
  mp.teacherValidatedAt = agg.teacherValidatedAt;

-- 2. Delete duplicates
DELETE mp FROM module_progress mp
INNER JOIN (
  SELECT userId, moduleId, MIN(id) AS keepId
  FROM module_progress
  GROUP BY userId, moduleId
) keep ON mp.userId = keep.userId AND mp.moduleId = keep.moduleId
WHERE mp.id <> keep.keepId;

-- 3. Enforce uniqueness
CREATE UNIQUE INDEX module_progress_user_module_idx ON module_progress (userId, moduleId);

-- 4. Verify
SELECT userId, moduleId, COUNT(*) AS cnt
FROM module_progress GROUP BY userId, moduleId HAVING cnt > 1;
-- Expected: 0 rows
```

### Expected row counts

| Metric | Before (prod estimate) | After |
|---|---|---|
| Global `module_progress` rows | ~540,000+ | ≤ `users_with_progress × 5` (~100–500) |
| Rows per user (user 213) | 5,036 | ≤ 5 |
| Distinct `(userId, moduleId)` pairs | ~100 | unchanged (canonical data retained) |

---

## Expected payload size (before / after)

Endpoint: `modules.progress` (user 213 — Darlin, heaviest known case)

| Metric | Before | After (code dedup) | After (code + SQL dedup) |
|---|---|---|---|
| Row count | 5,036 | ≤ 5 | ≤ 5 |
| Response size | **~1,694 KB (1.62 MiB)** | **~2–4 KB** | **~2–4 KB** |
| Isolated latency | 452 ms (sometimes 7+ s / 502) | < 100 ms | < 50 ms |
| Batched dashboard (`modules.progress` + `listByModule` + `myRuns`) | **502** | **200** | **200** |

Batched payload total (Module 4 dashboard): **~1.7 MB → ~12 KB**.

---

## Rollback plan

### If migration fails mid-flight

1. Stop app traffic (optional maintenance window).
2. Restore from backup:
   ```sql
   DROP TABLE module_progress;
   CREATE TABLE module_progress AS SELECT * FROM module_progress_backup_20260618;
   -- Re-apply original PK if needed:
   ALTER TABLE module_progress ADD PRIMARY KEY (id);
   ```
3. Redeploy previous app commit (reverts read dedup + upsert logic; duplicates return in responses).

### If migration succeeds but app regresses

1. Redeploy previous commit — read dedup in code is backward-compatible with clean data.
2. **Do not drop** the unique index unless restoring full backup; index is safe to keep.

### If unique index already exists (re-run)

Migration runner will fail on `CREATE UNIQUE INDEX` — safe to skip Phase C if index present. Verify with:

```sql
SHOW INDEX FROM module_progress WHERE Key_name = 'module_progress_user_module_idx';
```

---

## Production validation checklist

### Database (post-migration)

- [ ] `SELECT COUNT(*) FROM module_progress` — orders of magnitude smaller than pre-migration
- [ ] Duplicate check returns 0 rows:
  ```sql
  SELECT userId, moduleId, COUNT(*) cnt FROM module_progress
  GROUP BY userId, moduleId HAVING cnt > 1;
  ```
- [ ] `SHOW INDEX FROM module_progress` shows `module_progress_user_module_idx`
- [ ] Cohorte users retain `passed=1` / `teacherValidated=1` where expected (spot-check userIds 184, 213, 216, 219, 222)
- [ ] `profiles.silverCertified` / `goldCertified` unchanged for cohorte

### API (authenticated student — cohorte account)

Base: `https://tec-wms-simulator-production-production.up.railway.app`

- [ ] `modules.progress` → **200**, ≤ 5 rows, response < 10 KB
- [ ] Batched: `modules.progress,scenarios.listByModule,runs.myRuns` (M4 input) → **200**, total < 50 KB
- [ ] `warehouse.myProgress` → ≤ 5 rows (same dedup)

### UI routes

- [ ] `/student/module4` — dashboard loads, scenarios visible, no 502 in Network tab
- [ ] `/student/module5` — simulation page loads, no 502 in Network tab
- [ ] Module unlock gates still correct (M4 requires M3 teacher validation; M5 requires M1 pass)

### Regression guards

- [ ] Scenario run history intact (`runs.myRuns` count unchanged for test user)
- [ ] Run report scores unchanged for completed runs
- [ ] Teacher monitor `allModuleProgress` returns ≤ 1 row per student per module (after dedup)
- [ ] New `recordModulePass` after scenario completion updates existing row (no new duplicate inserts)

### Quick probe commands

```bash
# Login then query modules.progress (replace cookie after auth.localLogin)
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" \
  "https://tec-wms-simulator-production-production.up.railway.app/api/trpc/modules.progress?input=%7B%22json%22%3Anull%7D" \
  -H "Cookie: <session>"
# Expected: 200 and size_download < 10000
```

---

## Out of scope (follow-up)

- `RunReport.tsx` `useEffect` dependency fix (stops duplicate **creation** at source)
- `getAllModuleProgressForMonitor` teacher-view dedup (lower traffic)
- Global `module_progress` row-count monitoring alert

---

## Files changed

- `drizzle/schema.ts`
- `drizzle/0014_module_progress_unique.sql`
- `drizzle/meta/_journal.json`
- `server/db.ts`
- `server/routers.ts`
- `scripts/p0-apply-module-progress-migration.mjs`
- `P0_MODULE_PROGRESS_FIX.md` (this document)
