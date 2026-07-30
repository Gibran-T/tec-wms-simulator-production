# M5 Mission Session Aggregate — Design Artifact (Phase 3A)

**Status:** Design only — no migration executed in Phase 3A.  
**Constraint:** Scenario isolation, retries, best-score, Gold, demo exclusion, and historical attempts must remain intact.

## Goal

Connect SCN-015, SCN-016 and SCN-017 evidence for a future cumulative “quart de clôture” without merging live runs into a single mutable session.

## Recommended model (future Option B-lite)

```text
m5_mission_session (parent)
  id
  userId
  cohortId nullable
  evidenceVersion = 'm5-session-v1'
  status = open | sealed | superseded
  createdAt
  sealedAt nullable

m5_mission_scenario_link
  missionSessionId
  scenarioId (SCN-015 | 016 | 017)
  bestRunId          -- points to scenario_runs.id used for evidence
  attemptRunIdsJson  -- optional history pointer list
  sealedEvidenceJson -- immutable M5SessionEvidenceV1 snapshot at seal time
  sealedAt
```

## Rules

1. **Independent scoring stays on `scenario_runs`.** Mission parent never replaces per-SCN scores.
2. **Retries:** new runs update `bestRunId` only via existing best-score selection; previous attempts remain in `scenario_runs`.
3. **Seal:** when a SCN best run is selected for the mission, copy `M5SessionEvidenceV1` into `sealedEvidenceJson` (immutable).
4. **SCN-017 injection (future):** scoring may read sealed 015/016 evidence **in addition to** the current 017 run evidence, with explicit labels (`sourceScenario`).
5. **No silent reinterpretation** of historical `kpi_snapshots` columns.
6. **Demo / James:** mission aggregates exclude `isDemo` runs, same as Gold.

## Phase 3A bridge

- `M5SessionEvidenceV1` is computed in-process from a single run.
- API returns `sessionEvidence` + `evidenceVersion`.
- Future parent can store the same JSON without changing student-facing field names.

## Non-goals for Phase 3A

- No DB migration
- No cumulative 015→017 claims in student UI
- No SCN-015 multi-SKU / priority fulfillment
