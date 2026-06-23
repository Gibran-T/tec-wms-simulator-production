# Cohorte Fondatrice 2026 — Pedagogical Override Dry-Run Report

**Timestamp:** 2026-06-23T19:56:00.000Z (live baseline: production API `warehouse.myProgress` @ 2026-06-23T19:54:05.342Z)  
**Cohort:** Cohorte Fondatrice 2026 only  
**Script:** `scripts/cohorte-fondatrice-pedagogical-override.ts`  
**Mode:** Dry-run (no database writes)

---

## Affected students

| userId | Name | Email |
|--------|------|-------|
| 184 | Aissata Soukeina Camara | aissatasoukeinacamara@gmail.com |
| 213 | Darlin Campaz Paredes | dcparedes2010@gmail.com |
| 216 | Fredy Tamile Lola | fredlolabio@gmail.com |
| 219 | Prince Agbodjan Sewa Francis Ghislain | sewafrancispa@gmail.com |

## Affected modules

**M2, M3, M4, M5** — checkpoint fields on `module_progress` only.

Target values per row:

- `passed = true`
- `progressPct = 100`
- `completedScenarios = requiredScenarios = 3`
- `averageScore` = teacher-validated threshold (60 for M2, 70 for M3–M5), or higher if already recorded
- `engineVersion = founder-v1`
- `scenarioStatusJson` includes pedagogical note: *« Cohorte Fondatrice 2026 — validation pédagogique exceptionnelle par le responsable pédagogique. »*
- **M3:** `teacherValidated` preserved from existing row (all four students currently `true`)

---

## Before / after summary

| rowId | userId | Student | Module | Before | After |
|-------|--------|---------|--------|--------|-------|
| 2 | 184 | Aissata | M2 | passed=false, pct=0, scn=0/3, eng=ckpt-v1 | passed=true, pct=100, scn=3/3, avg=60, eng=founder-v1 |
| 3 | 184 | Aissata | M3 | passed=false, pct=25, scn=0/3, TV=true | passed=true, pct=100, scn=3/3, avg=70, TV=true |
| 217261 | 184 | Aissata | M4 | passed=false, pct=0, scn=0/3 | passed=true, pct=100, scn=3/3, avg=70 |
| 217262 | 184 | Aissata | M5 | passed=false, pct=0, scn=0/3 | passed=true, pct=100, scn=3/3, avg=70 |
| 5 | 213 | Darlin | M2 | passed=true, pct=100, scn=3/3, avg=90, eng=ckpt-v1 | passed=true, pct=100, scn=3/3, avg=90, eng=founder-v1 |
| 6 | 213 | Darlin | M3 | passed=false, pct=25, scn=0/3, TV=true | passed=true, pct=100, scn=3/3, avg=70, TV=true |
| 217255 | 213 | Darlin | M4 | passed=false, pct=0, scn=0/3 | passed=true, pct=100, scn=3/3, avg=70 |
| 217256 | 213 | Darlin | M5 | passed=false, pct=0, scn=0/3 | passed=true, pct=100, scn=3/3, avg=70 |
| 8 | 216 | Fredy | M2 | passed=false, pct=0, scn=0/3 | passed=true, pct=100, scn=3/3, avg=60 |
| 9 | 216 | Fredy | M3 | passed=false, pct=25, scn=0/3, TV=true | passed=true, pct=100, scn=3/3, avg=70, TV=true |
| 217257 | 216 | Fredy | M4 | passed=false, pct=0, scn=0/3 | passed=true, pct=100, scn=3/3, avg=70 |
| 217258 | 216 | Fredy | M5 | passed=false, pct=0, scn=0/3 | passed=true, pct=100, scn=3/3, avg=70 |
| 11 | 219 | Prince | M2 | passed=false, pct=0, scn=0/3 | passed=true, pct=100, scn=3/3, avg=60 |
| 12 | 219 | Prince | M3 | passed=false, pct=25, scn=0/3, TV=true | passed=true, pct=100, scn=3/3, avg=70, TV=true |
| 217259 | 219 | Prince | M4 | passed=false, pct=0, scn=0/3 | passed=true, pct=100, scn=3/3, avg=70 |
| 217260 | 219 | Prince | M5 | passed=false, pct=0, scn=0/3 | passed=true, pct=100, scn=3/3, avg=70 |

**Totals:** 16 rows — 16 UPDATE, 0 INSERT, 0 unchanged.

---

## Scope confirmation — only `module_progress` updated

This override writes **only** to the `module_progress` table for the four allowlisted user IDs and modules M2–M5.

The script does **not** execute any SQL or API calls against:

| Asset | Status |
|-------|--------|
| `profiles` (Silver/Gold flags) | **Untouched** |
| Silver certification registry (`shared/silverCertificationRegistry.ts`) | **Untouched** |
| Gold certificate registry | **Untouched** |
| PDF assets / generation | **Untouched** |
| Public verification URLs / verify routes | **Untouched** |
| `student_certifications` | **Untouched** |
| `scenario_runs`, `scoring_events`, `quiz_attempts` | **Untouched** |

Baseline certification state (all four students): `silverCertified=true`, `goldCertified=false` — expected to remain unchanged.

---

## Backup table naming convention

Before apply, the script creates a full-row backup:

```
module_progress_backup_founder_override_YYYYMMDDHHMMSS
```

Example: `module_progress_backup_founder_override_20260623204500`

Only rows that will be modified are copied into the backup table. Row count is verified before writes proceed.

---

## Rollback strategy

1. **Automatic backup** — created immediately before apply; table name printed to stdout and written to the JSON apply report in `.manus-logs/`.
2. **CLI rollback** — restores all checkpoint columns from the backup table:

```bash
npx tsx scripts/cohorte-fondatrice-pedagogical-override.ts --rollback --backup-table=module_progress_backup_founder_override_<timestamp>
```

3. **Manual SQL rollback** (equivalent):

```sql
UPDATE module_progress mp
INNER JOIN `module_progress_backup_founder_override_<timestamp>` b ON mp.id = b.id
SET
  mp.passed = b.passed,
  mp.bestScore = b.bestScore,
  mp.completedAt = b.completedAt,
  mp.teacherValidated = b.teacherValidated,
  mp.teacherValidatedAt = b.teacherValidatedAt,
  mp.progressPct = b.progressPct,
  mp.completedScenarios = b.completedScenarios,
  mp.requiredScenarios = b.requiredScenarios,
  mp.averageScore = b.averageScore,
  mp.scenarioStatusJson = b.scenarioStatusJson,
  mp.engineVersion = b.engineVersion;
```

---

## Apply command (pending approval at dry-run time)

```bash
MYSQL_PUBLIC_URL=... npx tsx scripts/cohorte-fondatrice-pedagogical-override.ts --apply --confirm-cohorte-fondatrice
```
