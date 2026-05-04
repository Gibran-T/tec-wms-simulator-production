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
- [x] Health check: project structure analysis
- [x] Health check: TypeScript 0 errors
- [x] Health check: pnpm build passes
- [x] Health check: pnpm test 218/218 pass
- [x] Cleanup: remove .manus-logs temp files from git tracking
- [x] Cleanup: verify .gitignore covers node_modules, dist, .env, logs
- [x] Git: verify remote user_github is connected — https://github.com/Gibran-T/tec-wms-simulator-production
- [x] Git: create clean commit "Checkpoint v1 - TEC.WMS stable version before classroom deployment" (c7d2b55)
- [x] GitHub: push to main branch — 990f04a..c7d2b55
- [x] Git: tag v1.0-classroom-ready with release notes — https://github.com/Gibran-T/tec-wms-simulator-production/releases/tag/v1.0-classroom-ready
- [x] Final validation report delivered

## Strict Execution Mode — Phases 1-6
- [x] Phase 1: Verify SKU-001 to SKU-010 exist in Odoo (storable, FIFO, lot-tracked)
- [x] Phase 1: Verify WH/Input, WH/Stock, WH/Output locations exist
- [x] Phase 1: Verify P00003 exists and receipt is in Ready status
- [x] Phase 2: Open P00003, click Receive Products, validate receipt
- [x] Phase 2: Confirm stock = 0 before validation, stock increases after
- [x] Phase 2: Confirm destination is WH/Input
- [x] Phase 2: Execute putaway internal transfer to WH/Stock (WH/STOR/00001 Ready)
- [x] Phase 4 (CRITICAL): Replace ALL demo.odoo.com / demo5.odoo.com URLs with https://concorde-logistics-lab.odoo.com in TEC.WMS simulator
- [x] Phase 4: Verify all 8 active Odoo Lab buttons open concorde-logistics-lab.odoo.com
- [x] Phase 4: Run pnpm build and pnpm test after URL fix (TypeScript 0 errors, HMR OK)
- [x] Phase 4: Save checkpoint and push to GitHub (version: c485ba1e)
- [x] Phase 5+6: Deliver pedagogical guide + final validation report

## URL Enforcement — Eliminate ALL demo.odoo.com References (CRITICAL)

- [x] Grep entire codebase for demo.odoo.com, demo5.odoo.com, odoo.com/start
- [x] Replace ALL occurrences with deep links to concorde-logistics-lab.odoo.com
- [x] Enforce specific deep links per module (receipts, products, reporting, warehouses, reordering-rules, manufacturing)
- [x] Add session-failure guard: show "Odoo session required — please log in to Concorde Logistics Lab" instead of redirecting to demo
- [x] Validate all 8 Odoo Lab buttons open correct concorde-logistics-lab.odoo.com pages
- [x] Confirm zero occurrences of demo.odoo.com in final codebase (0 in source, 0 in dist bundle)
- [x] Run pnpm build (0 errors, 2433 modules) and pnpm test (218/218)
- [x] Save checkpoint and push to GitHub

## Scenario Implementation — SCN-004 & SCN-005

- [x] Audit existing SCN-001/002/003 implementation in StepForm.tsx to understand scenario rendering pattern
- [x] Implement SCN-004: Stock négatif (M3/GI) — negative stock scenario with Odoo trigger at /odoo/inventory/reporting, manual confirmation, no auto-resolution
- [x] Implement SCN-005: Erreur cachée (M5/Compliance) — hidden error audit scenario with Odoo trigger at /odoo/inventory/receipts, manual confirmation, no auto-resolution
- [x] Ensure both scenarios follow JSON schema: trigger, route, action, expected_observation, resolution, wms_return_logic, instructor_script
- [x] UI: clear action panel + clear explanation panel + clear validation/confirmation step
- [x] FR/EN bilingual support for all new scenario text
- [x] Run pnpm build (0 errors, 2707kB bundle) and pnpm test (218/218)
- [x] Save checkpoint and push to GitHub

## Scenario Implementation — SCN-001, SCN-002, SCN-003

- [x] Audit module step codes (M1, M2, M4) to determine correct wiring points for SCN-001/002/003
- [x] Design SCN-001 JSON config (M1 — negative, GR step: Réception fantôme / Ghost Receipt)
- [x] Design SCN-002 JSON config (M2 — negative, FIFO_PICK step: Violation FIFO)
- [x] Design SCN-003 JSON config (M4 — positive, KPI_DIAGNOSTIC step: Diagnostic KPI)
- [x] Add SCN-001/002/003 to SCENARIO_REGISTRY in ScenarioPanel.tsx
- [x] Wire SCN-001 to GR step in StepForm.tsx
- [x] Wire SCN-002 to FIFO_PICK step in StepForm.tsx
- [x] Wire SCN-003 to KPI_DIAGNOSTIC step in StepForm.tsx
- [x] Run pnpm build (0 errors) and pnpm test (218/218)
- [x] Save checkpoint and push to GitHub

## ScenarioPanel Guided Discovery Refactor

- [x] Rewrite ScenarioPanel.tsx: collapsed alert banner (default) → Step 1 (Odoo task, no explanation) → Step 2 (reveal explanation + root cause) → Step 3 (written answer required before confirm)
- [x] Collapsed state: small amber banner "⚠️ Situation détectée (optionnel)" + short hint + "Vérifier dans Odoo" button
- [x] Step 1: show ONLY Odoo instructions + where to look + 1 discovery question (no explanation)
- [x] Step 2: reveal after user types first input (≥10 chars) — show explanation, root cause, correction
- [x] Step 3: require non-empty written answer before enabling confirmation button
- [x] Do NOT block normal WMS transaction flow (scenario is always optional/collapsible)
- [x] Teacher script section: hidden by default, collapsible accordion
- [x] Bilingual FR/EN support maintained across all 3 steps
- [x] Validate all 5 SCN placements: correct module, correct step, correct Odoo URL
- [x] Run pnpm build (0 errors, 9.62s) and pnpm test (218/218)
- [x] Save checkpoint and deliver validation table

## ScenarioPanel & Dashboard Improvements

- [x] Enforce minimum 20 characters in ScenarioPanel Step 3 final answer (disable confirm button + show character counter)
- [x] Add SCN-001 to SCN-005 confirmation indicators to teacher monitoring dashboard (per-student, per-scenario status)
- [x] Expose SCN confirmation data via tRPC (completedSteps already contains "SCN-00X-CONFIRMED" entries from existing procedure)
- [x] Run pnpm build (0 errors) and pnpm test (218/218)
- [x] Save checkpoint

## M1 Scenario Redesign — SCN-001 to SCN-005 (Full Rebuild)

- [x] Audit current ScenarioPanel registry for existing SCN-001 content
- [x] Design SCN-001: Positive baseline (GR posted correctly, stock visible) — Réception conforme
- [x] Design SCN-002: GR not posted (receipt in READY, stock = 0) — Réception fantôme
- [x] Design SCN-003: Stock issue (quantity mismatch between PO and GR) — Marchandise mal rangée (putaway incomplete)
- [x] Design SCN-004: Inventory mismatch (physical vs system discrepancy) — Écart de quantité (PO/GR mismatch)
- [x] Design SCN-005: Multi-error (hidden receipt + wrong lot + negative stock chain) — Erreur en cascade
- [x] Validate all 5 scenarios against real Odoo data (SKU-001, SKU-004, BOX-001)
- [x] Implement all 5 in ScenarioPanel registry with 3-step guided UX
- [x] Wire each SCN to correct M1 step in StepForm.tsx (GR, GR, PUTAWAY_M1, GI, COMPLIANCE)
- [x] Add instructor guidance, expected answers, common mistakes to each (in instructor_script block)
- [x] Run pnpm build (0 errors, 10.04s) and pnpm test (218/218)
- [x] Save checkpoint (582aa2ff) and deliver structured scenario document

## Teacher Trigger — Scenario Entry Point Redesign

- [ ] Design Teacher Trigger (FR + EN) for SCN-001: tension around "stock visible but is it real?"
- [ ] Design Teacher Trigger (FR + EN) for SCN-002: tension around "receipt created but stock = 0"
- [ ] Design Teacher Trigger (FR + EN) for SCN-003: tension around "goods received but cannot be picked"
- [ ] Design Teacher Trigger (FR + EN) for SCN-004: tension around "supplier invoice blocked, no one knows why"
- [ ] Design Teacher Trigger (FR + EN) for SCN-005: tension around "period close tomorrow, system is not clean"
- [ ] Design Teacher Trigger (FR + EN) for SCN-M2-001: tension around "wrong lot shipped to customer"
- [ ] Design Teacher Trigger (FR + EN) for SCN-M3-001: tension around "delivery impossible, stock shows negative"
- [ ] Design Teacher Trigger (FR + EN) for SCN-M4-001: tension around "KPI dashboard shows red, no one can explain why"
- [ ] Design Teacher Trigger (FR + EN) for SCN-M5-001: tension around "old receipt still open, audit is tomorrow"
- [ ] Add teacher_trigger + teacher_triggerEn fields to ScenarioConfig TypeScript interface
- [ ] Add teacher_trigger text to all 9 scenario entries in SCENARIO_REGISTRY
- [ ] Update ScenarioPanel UI: show Teacher Trigger as the first visible element in collapsed banner
- [ ] Update ScenarioPanel UI: repeat Teacher Trigger as a styled "situation" card at top of Step 1
- [ ] Run pnpm build (0 errors) and pnpm test (218/218)
- [ ] Save checkpoint and deliver updated scenario document
