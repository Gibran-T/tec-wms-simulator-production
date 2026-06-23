# Gold Founding Cohort Award — Dry Run

**Generated:** 2026-06-23  
**Mode:** DRY RUN — no database mutations in this report  
**Award source:** `FONDATRICE_2026_GOLD_AWARD`  
**Institutional note (API):** Certification Gold accordée par validation institutionnelle exceptionnelle — Cohorte Fondatrice 2026.

---

## 1. Safest award mechanism (selected)

| Mechanism | Used? | Rationale |
|-----------|-------|-----------|
| `profiles.goldCertified` | **YES** | Persisted award flag — same field as `unlockGoldCertification()` |
| `profiles.goldAwardSource` | **YES** | Audit trail = `FONDATRICE_2026_GOLD_AWARD` |
| Engine display short-circuit | **YES** | `getGoldCertificationStatus()` returns 18/18 when certified + source set (mirrors Silver) |
| Live `goldEligible` from runs | **NO** | Not required for institutional award |
| `student_certifications` table | **N/A** | Not in schema |
| Gold registry / PDF / verify | **NO CHANGE** | Pre-provisioned assets remain HTTP 200 |
| `scenario_runs` / `scoring_events` | **NO CHANGE** | No fabrication |
| Silver flags | **NO CHANGE** | Preserved |

---

## 2. Pre-apply production baseline (2026-06-23)

Source: `GOLD_18_GATE_FORENSIC_AUDIT.md` · TRPC `profiles.goldStatusForStudent`

| Student | userId | Silver | goldCertified | Gates met | Gold state |
|---------|--------|--------|---------------|-----------|------------|
| Aissata Soukeina Camara | 184 | ✅ | false | 1/18 | IN_PROGRESS |
| Darlin Campaz Paredes | 213 | ✅ | false | 4/18 | IN_PROGRESS |
| Fredy Tamile Lola | 216 | ✅ | false | 1/18 | IN_PROGRESS |
| Prince Agbodjan Sewa Francis Ghislain | 219 | ✅ | false | 1/18 | IN_PROGRESS |

M2–M5 checkpoint override: **completed** (`module_progress`, `founder-v1`).

---

## 3. Planned profile updates (apply)

| Student | userId | Action | goldCertified | goldAwardSource |
|---------|--------|--------|---------------|-----------------|
| Aissata | 184 | AWARD | false → **true** | null → **FONDATRICE_2026_GOLD_AWARD** |
| Darlin | 213 | AWARD | false → **true** | null → **FONDATRICE_2026_GOLD_AWARD** |
| Fredy | 216 | AWARD | false → **true** | null → **FONDATRICE_2026_GOLD_AWARD** |
| Francis | 219 | AWARD | false → **true** | null → **FONDATRICE_2026_GOLD_AWARD** |

**Rows to update:** 4  
**Schema migration:** `drizzle/0016_founding_cohort_gold_award.sql` — add `profiles.goldAwardSource` (nullable varchar 64)

---

## 4. Runtime integrity (unchanged)

| Student | Completed non-demo runs | Scoring events | Fabrication |
|---------|-------------------------|----------------|-------------|
| Aissata | 0 (baseline) | 0 | **None** |
| Darlin | partial M2 | partial | **None** |
| Fredy | 0 (baseline) | 0 | **None** |
| Francis | 0 (baseline) | 0 | **None** |

---

## 5. Expected result after apply + deploy

| Check | Expected |
|-------|----------|
| Gold card progress | **100%** |
| Gold state chip | **Obtenue / AWARDED** |
| Institutional note | Visible on certifications page |
| Silver | Unchanged (certified) |
| Verify URLs | HTTP 200 (unchanged) |
| PDF assets | Unchanged |

---

## 6. Apply command

```bash
# Requires MYSQL_PUBLIC_URL or railway run
npx tsx scripts/cohorte-fondatrice-gold-award.ts --apply --confirm-cohorte-fondatrice-gold
```

Rollback: `--rollback --backup-table=<profiles_backup_fondatrice_gold_*>` (table name printed at apply).

---

*Collège de la Concorde · TEC.WMS · Cohorte Fondatrice 2026*
