# Cohorte Fondatrice 2026 — Pedagogical Override Execution Report

**Executed at:** 2026-06-23T20:01:27.877Z  
**Post-apply verification:** 2026-06-23T20:01:51.007Z  
**Environment:** Railway production (`https://tec-wms-simulator-production-production.up.railway.app`)  
**Branch:** `production-hotfix-rc13-pedagogy-class6`

---

## Command executed

```bash
MYSQL_PUBLIC_URL=<from Railway MySQL service> npx tsx scripts/cohorte-fondatrice-pedagogical-override.ts --apply --confirm-cohorte-fondatrice
```

The `MYSQL_PUBLIC_URL` value was sourced from the Railway **MySQL** service variables (not the internal `mysql.railway.internal` hostname).

---

## Backup table

| Field | Value |
|-------|-------|
| **Backup table name** | `module_progress_backup_founder_override_20260623200127` |
| **Rows backed up** | 16 |
| **Convention** | `module_progress_backup_founder_override_YYYYMMDDHHMMSS` |

Machine-readable apply log: `.manus-logs/cohorte-fondatrice-pedagogical-override-apply-1782244889892.json`

---

## Rows updated

| Metric | Value |
|--------|-------|
| **Total rows updated** | **16** |
| Inserts | 0 |
| Updates | 16 |
| Students affected | 4 |
| Modules affected | M2, M3, M4, M5 |

### Students and row IDs

| userId | Student | M2 | M3 | M4 | M5 |
|--------|---------|----|----|----|-----|
| 184 | Aissata Soukeina Camara | 2 | 3 | 217261 | 217262 |
| 213 | Darlin Campaz Paredes | 5 | 6 | 217255 | 217256 |
| 216 | Fredy Tamile Lola | 8 | 9 | 217257 | 217258 |
| 219 | Prince Agbodjan Sewa Francis Ghislain | 11 | 12 | 217259 | 217260 |

---

## Post-apply production snapshot

Verified via read-only production API (`warehouse.myProgress` + `profiles.mine`) for all four students.

| Check | Result |
|-------|--------|
| All M2–M5 rows `passed=true` | **PASS** (16/16) |
| All M2–M5 rows `progressPct=100` | **PASS** (16/16) |
| All M2–M5 rows `completedScenarios=3/3` | **PASS** (16/16) |
| All M2–M5 rows `engineVersion=founder-v1` | **PASS** (16/16) |
| All rows include `_pedagogicalOverride` note | **PASS** (16/16) |
| M3 `teacherValidated` preserved | **PASS** (4/4 students: `true`) |

Snapshot file: `.manus-logs/_post-apply-snapshot.json`

---

## Certification and registry — unchanged

| Asset | Post-apply status |
|-------|-------------------|
| **Silver (`profiles.silverCertified`)** | **Unchanged** — all 4 students remain `true` |
| **Gold (`profiles.goldCertified`)** | **Unchanged** — all 4 students remain `false` |
| Silver certification registry | **Not modified** (no code or DB registry writes) |
| Gold certificate registry | **Not modified** |
| PDF assets | **Not modified** |
| Public verification URLs / verify routes | **Not modified** |
| `student_certifications` | **Not modified** |
| `profiles` table | **Not modified** |

---

## Rollback command

```bash
npx tsx scripts/cohorte-fondatrice-pedagogical-override.ts --rollback --backup-table=module_progress_backup_founder_override_20260623200127
```

Equivalent manual SQL is documented in `OVERRIDE_DRY_RUN_REPORT_COHORTE_FONDATRICE_2026.md`.

---

## Outcome

**SUCCESS** — Cohorte Fondatrice 2026 pedagogical checkpoint override applied to 16 `module_progress` rows. Gold-readiness checkpoint display is now at 100 % for M2–M5 for all four founder-cohort students, with no impact to Silver/Gold certification records or public verification infrastructure.
