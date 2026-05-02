# TEC.WMS Production — Migration TODO

- [x] Migrate drizzle/schema.ts from wms-simulatorV2
- [x] Migrate drizzle/relations.ts from wms-simulatorV2
- [x] Run pnpm db:push to initialize all tables
- [x] Migrate shared/const.ts and shared/types.ts
- [x] Migrate server/db.ts
- [x] Migrate server/rulesEngine.ts
- [x] Migrate server/scoringEngine.ts
- [x] Migrate server/seed.ts
- [x] Migrate server/storage.ts
- [x] Migrate server/routers.ts
- [x] Migrate all server test files
- [x] Migrate client/src/index.css
- [x] Migrate client/src/App.tsx
- [x] Migrate client/src/main.tsx
- [x] Migrate client/src/const.ts
- [x] Migrate all client pages (student, teacher, admin)
- [x] Migrate all client components (including ui/)
- [x] Migrate client contexts, hooks, data, lib
- [x] Add additional dependencies (bcryptjs, etc.)
- [x] Run pnpm test — must pass 100% (218/218)
- [x] Validate stock pick/GI logic in dev server
- [x] Save checkpoint "TEC.WMS production deploy with stock fix" (version: 1a77f251)
- [x] Publish project — checkpoint 21439496 ready, user to click Publish button

## Database Seeding

- [x] Audit seed.ts and scenario/module definitions in the repository
- [x] Create and run seed-production.mjs — 17 unique scenarios (5+3+3+3+3) across M1–M5 seeded (the 68 were duplicates)
- [x] Verify teacher dashboard shows 17 scenarios across M1–M5 (confirmed in screenshot)
- [x] Verify student view shows M1–M5 scenarios correctly

## QA Walkthrough & Odoo Lab Integration

- [x] Validate M1 Scenario 1 stock logic: initial=100, pick 50 (TOTAL=100), GI (TOTAL=50), CC — PASSED
- [x] Walk through M1 full path: quiz (100%), all steps validated, compliance confirmed
- [x] Walk through M2 path and confirm Odoo Lab placement after PUTAWAY/FIFO_PICK
- [x] Walk through M3 path and confirm Odoo Lab placement after CC_RECON
- [x] Walk through M4 path and confirm Odoo Lab placement after KPI_SERVICE
- [x] Walk through M5 path and confirm Odoo Lab placement after M5_DECISION
- [x] Implement Odoo Lab button M2: "Odoo Lab — Warehouse Locations" (putaway_m1 + fifo_pick)
- [x] Implement Odoo Lab button M3: "Odoo Lab — Inventory Adjustment" (cc_recon)
- [x] Implement Odoo Lab button M4: "Odoo Lab — Reporting & Stock Moves" (kpi_service)
- [x] Implement Odoo Lab button M5: "Odoo Lab — Traceability / Manufacturing Flow" (m5_decision)
- [x] Fix all bugs found during walkthrough (quiz seed missing, bcryptjs version conflict)
- [ ] Save checkpoint after Odoo Lab implementation (pending)

## Real-Time Stock Display Fix

- [x] Diagnose root cause: stock panel hidden by !isDemo gate + missing step keys
- [x] Fix: removed !isDemo gate, stock panel now shows in all modes
- [x] Improve UX: all 4 rows always visible, color-coded zones, bold TOTAL row
- [x] Validate: PUTAWAY 50 → RECEPTION=50, STOCKAGE=50, TOTAL=100 in real time
- [ ] Save checkpoint after fix (pending)
