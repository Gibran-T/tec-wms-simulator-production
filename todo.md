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
- [x] Save checkpoint after Odoo Lab implementation (version: 0595f2a5)

## Real-Time Stock Display Fix

- [x] Diagnose root cause: stock panel hidden by !isDemo gate + missing step keys
- [x] Fix: removed !isDemo gate, stock panel now shows in all modes
- [x] Improve UX: all 4 rows always visible, color-coded zones, bold TOTAL row
- [x] Validate: PUTAWAY 50 → RECEPTION=50, STOCKAGE=50, TOTAL=100 in real time
- [x] Save checkpoint after fix (version: 0595f2a5)

## Full UI Walkthrough QA (M1–M5)

- [x] M1: Login as student, take quiz, run Scenario 1 full flow (PO→GR→PUTAWAY→SO→PICKING→GI→CC→COMPLIANCE)
- [x] M1: Run Scenarios 2–5, verify final reports and teacher monitoring
- [x] M1: Verify slides accessible from teacher dashboard
- [x] M2: Slides, quiz, all 3 scenarios, verify Odoo Lab button at PUTAWAY/FIFO_PICK
- [x] M3: Slides, quiz, all 3 scenarios, verify Odoo Lab button at CC_RECON
- [x] M4: Slides, quiz, all 3 scenarios, verify Odoo Lab button at KPI_SERVICE
- [x] M5: Slides, quiz, all 3 scenarios, verify Odoo Lab button at M5_DECISION
- [x] Teacher dashboard: monitoring, analytics, cohort management, scenario assignment
- [x] Fix all bugs found during walkthrough
- [x] Save final checkpoint after walkthrough

## Odoo Lab URL Fix (demo6.odoo.com broken — 404 Not Found)

- [x] Find working Odoo demo instance URL (demo6 expired/reset) — demo.odoo.com → demo5
- [x] Update all 18 ODOO_LAB_CONFIG entries with working URLs — active labs use demo.odoo.com/odoo; disabled labs use #
- [x] Verify all updated URLs return valid pages (not 404/database selector)
- [x] Save checkpoint and publish fix — awaiting approval

## Professional Hybrid Odoo Lab Model (Option C + A)

- [x] Rewrite ODOO_LAB_CONFIG: add embedded guided walkthrough content (FR+EN) for all 5 Core Labs — implemented via OdooLabSlide.tsx + LAB_SLIDE_MAP dispatch
- [x] Rewrite ODOO_LAB_CONFIG: add embedded guided content for all 3 Error Labs (fifo_pick, adj, compliance)
- [x] Change all active lab Odoo URLs to safe base URL: https://demo.odoo.com/odoo (not deep links)
- [x] Add warning text to all active labs (FR + EN) about optional Odoo button
- [x] Keep disabled labs unchanged (url: "#", greyed, "À venir")
- [x] Update OdooLabButton component to render embedded guided walkthrough as primary content
- [x] Keep "Ouvrir Odoo Lab ↗" button as secondary/optional action
- [x] Run pnpm build — 0 errors
- [x] Run pnpm test — all pass
- [x] Save checkpoint and request user approval before publish

## Visual Didactic Lab Panels (Rich JSX Slides)
- [x] Create OdooLabSlide component with rich visual layout (header, concept card, diagram, mapping table, warning)
- [x] M1 GR: warehouse flow diagram (PO→GR→WH/Input), validation concept, TEC.WMS↔Odoo mapping table
- [x] M2 Putaway: warehouse hierarchy tree diagram, bin location visual, putaway rules table
- [x] M3 Replenish: Min/Max gauge visual, reorder logic diagram, formula cards
- [x] M4 KPI: KPI metric cards with formulas, reporting navigation diagram, 4-KPI comparison table
- [x] M5 Manufacturing: integrated ERP flow diagram (GR→MO→GR→GI), BoM concept, TEC.WMS↔TEC.SYS table
- [x] Error Lab FIFO: FIFO vs LIFO visual comparison, lot timeline diagram, correction steps
- [x] Error Lab ADJ: variance calculation visual, discrepancy types table, correction checklist
- [x] Error Lab Compliance: 3-anomaly type cards, compliance checklist visual, period-close impact diagram
- [x] Optional Odoo button: clearly secondary, below separator, with availability disclaimer
- [x] pnpm build: 0 errors (2433 modules, 11.04s)
- [x] pnpm test: 218/218 passed

## DevOps Checkpoint v1.0 — GitHub Publish
- [ ] Health check: project structure analysis
- [ ] Health check: TypeScript 0 errors
- [ ] Health check: pnpm build passes
- [ ] Health check: pnpm test 218/218 pass
- [ ] Cleanup: remove .manus-logs temp files from git tracking
- [ ] Cleanup: verify .gitignore covers node_modules, dist, .env, logs
- [ ] Git: verify remote user_github is connected and repo exists
- [ ] Git: create clean commit "Checkpoint v1 - TEC.WMS stable version before classroom deployment"
- [ ] GitHub: push to main branch
- [ ] Git: tag v1.0-classroom-ready with release notes
- [ ] Final validation report delivered
