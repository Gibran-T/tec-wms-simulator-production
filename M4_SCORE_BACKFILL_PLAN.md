# M4 Score Backfill Plan

**Purpose:** Reconcile historical M4 evaluation runs after Option B score restoration (75 → 100 ceiling).  
**Status:** PLAN ONLY — **do not execute automatically**  
**Effective change:** Runtime awards 10+20+20+25+25 = 100 (was 10+15+15+20+15 = 75)

---

## Scope

| Include | Exclude |
|---------|---------|
| Completed **non-demo** runs for `moduleId = 4` (SCN-012/013/014) | Demo runs (`isDemo = true`) |
| `scoringEvents` rows for M4 completion event types | M1/M2/M3/M5 runs |
| `kpiInterpretations.pointsDelta` mirror rows | In-progress / abandoned runs |
| `runs.score`, `runs.bestScore` (if denormalized) | Quiz attempts |
| `moduleProgress` / cohort ranking aggregates | Silver certification records |

---

## Affected Event Types

| Event | Old `pointsDelta` (correct) | New `pointsDelta` | Delta |
|-------|----------------------------|-------------------|-------|
| `KPI_DATA_COMPLETED` | 10 | 10 | 0 |
| `KPI_ROTATION_COMPLETED` | 15 | 20 | **+5** |
| `KPI_SERVICE_COMPLETED` | 15 | 20 | **+5** |
| `KPI_DIAGNOSTIC_COMPLETED` | 20 | 25 | **+5** |
| `COMPLIANCE_M4_COMPLETED` | 15 | 25 | **+10** |
| Penalties (`*_FAILED`, wrong answers) | unchanged | unchanged | 0 |

**Maximum uplift per perfect run:** +25 points (75 → 100).

---

## Backfill Strategy (Recommended: Option B1 — Proportional uplift)

### Phase 0 — Pre-flight audit

```sql
-- Count affected runs
SELECT COUNT(*) AS m4_eval_runs
FROM runs r
JOIN scenarios s ON s.id = r.scenarioId
WHERE s.moduleId = 4
  AND r.isDemo = 0
  AND r.status = 'completed';

-- Score distribution before backfill
SELECT
  FLOOR(r.score / 10) * 10 AS score_band,
  COUNT(*) AS cnt
FROM runs r
JOIN scenarios s ON s.id = r.scenarioId
WHERE s.moduleId = 4 AND r.isDemo = 0 AND r.status = 'completed'
GROUP BY score_band
ORDER BY score_band;
```

Export audit results to `.manus-logs/m4-backfill-audit-{timestamp}.json`.

### Phase 1 — Event-level recalculation

For each affected `runId`:

1. Load all `scoringEvents` for the run.
2. For each M4 completion event, apply new award if `pointsDelta > 0` (was a correct completion):
   - Map event type → new max from `M4_STEP_MAX`.
   - **Do not change negative penalties** (−5 rotation/service errors).
3. Recompute total via `calculateTotalScore(events)`.
4. Update `runs.score` with recomputed total (clamp 0–100).

**Alternative (conservative):** Only uplift runs where all five M4 steps completed with positive completion events (perfect-path candidates).

### Phase 2 — kpiInterpretations mirror

```sql
-- Example: rotation interpretations marked correct
UPDATE kpiInterpretations
SET pointsDelta = 20
WHERE kpiKey = 'rotationRate'
  AND isCorrect = 1
  AND pointsDelta = 15
  AND runId IN (SELECT r.id FROM runs r JOIN scenarios s ON s.id = r.scenarioId WHERE s.moduleId = 4);
```

Repeat for `serviceLevel` (15→20), `diagnostic` (20→25).

### Phase 3 — Aggregate recomputation

1. **`moduleProgress`** — recompute `bestScore` per user/module from max post-backfill run score.
2. **Teacher rankings** — refresh materialized views or cache if used.
3. **Gold certification** — re-evaluate eligibility only if score was the sole blocker (compliance unchanged).

### Phase 4 — Validation

| Check | Expected |
|-------|----------|
| No M4 perfect-path run scores > 100 | All clamped |
| Sample SCN-012 canonical run | 100/100 |
| Pass/fail flags unchanged for scores already ≥ 70 | Grandfathering intact |
| Pre-backfill export matches post-backfill count | No runs lost |

---

## Rollback Plan

1. Restore `scoringEvents` and `kpiInterpretations` from Phase 0 snapshot export.
2. Recompute `runs.score` from restored events.
3. Re-run aggregate recomputation (Phase 3).

**Requirement:** Take DB snapshot or row-level export **before** Phase 1.

---

## Execution Script (Draft — Not Deployed)

Location proposal: `scripts/m4-score-backfill.mjs`

```
Usage:
  node scripts/m4-score-backfill.mjs --dry-run     # audit + diff only
  node scripts/m4-score-backfill.mjs --execute     # requires M4_BACKFILL_CONFIRM=1
  node scripts/m4-score-backfill.mjs --rollback --from=.manus-logs/m4-backfill-snapshot.json
```

**Environment gates:**

- `M4_BACKFILL_CONFIRM=1` required for `--execute`
- `--dry-run` default; no writes
- Log every updated `runId` + old/new score to `.manus-logs/m4-backfill-results.json`

---

## Policy Decisions Required Before Execution

| Decision | Options |
|----------|---------|
| **Who gets backfill?** | All completed M4 eval runs vs. perfect-path only |
| **Effective date** | All historical vs. runs before deploy date only |
| **Ranking fairness** | Full backfill vs. dual leaderboard (pre/post) |
| **Cohorte Fondatrice** | Institutional sign-off required |
| **Communication** | Notify instructors/students of score reconciliation |

---

## Risk Summary

| Risk | Mitigation |
|------|------------|
| Incorrect penalty modification | Only update positive completion events |
| Double-application | Idempotent script keyed on `pointsDelta` old values |
| Certification re-issuance | Gold badges based on compliance + threshold — re-check after backfill |
| Production downtime | Run during maintenance window; dry-run first |

---

## Recommendation

1. Deploy code change (Option B) **without** backfill — new runs immediately use 100-point scale.
2. Run Phase 0 audit within 48h of deploy.
3. Schedule backfill during low-traffic window if Cohorte Fondatrice requests equity.
4. If backfill deferred indefinitely, document dual-era scoring in instructor materials.

---

*Plan authored 2026-06-19. Execution requires explicit operator approval — not part of automated deploy.*
