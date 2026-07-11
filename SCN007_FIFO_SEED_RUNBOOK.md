# SCN-007 FIFO_PICK — Seed & Run Operational Runbook

**Scope:** SCN-007 only (`M2 — Scénario 2`, scenarioId **7**, SKU-002).  
**Status:** Documentation only — do **not** run seed/deploy from this note without explicit GO.

## Facts

- Production deploy does **not** auto-run `server/seed.ts`.
- Scenario definitions live in the `scenarios` table (`initialStateJson`).
- New runs preload transactions from the **current** `initialStateJson` at `startRun`.
- In-progress runs keep their existing transaction ledger; FIFO catalog may also read live scenario JSON — do **not** reuse open SCN-007 runs after a seed refresh.

## After code GO (manual ops)

1. Deploy application code (no seed in deploy pipeline).
2. Run once (idempotent upsert on `scenarios.name + moduleId`):

```bash
npx tsx server/seed.ts
```

3. Use **new** SCN-007 runs only.
4. Do **not**:
   - reset cohorts globally;
   - wipe student progress;
   - force-restart unrelated scenarios;
   - re-use SCN-007 runs started before the seed.

## Expected seed effect for SCN-007

- Reception: 600 u. `LOT-2025-002` @ `REC-01`
- Older FIFO stock: 100 u. `LOT-2025-001` @ `B-02-R1-L1` (STOCKAGE)
- Capacity putaway remains 500 @ `B-01-R1-L1` + 100 @ `B-01-R1-L2` (`LOT-2025-002`)
- FIFO_PICK: `LOT-2025-001` from STOCKAGE → EXPÉDITION

## SCN-008

Not part of this package. Nomenclature hotfix preserved separately outside the repo patch store.
