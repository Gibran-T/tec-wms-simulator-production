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

- [x] Design Teacher Trigger (FR + EN) for SCN-001: tension around "stock visible but is it real?"
- [x] Design Teacher Trigger (FR + EN) for SCN-002: tension around "receipt created but stock = 0"
- [x] Design Teacher Trigger (FR + EN) for SCN-003: tension around "goods received but cannot be picked"
- [x] Design Teacher Trigger (FR + EN) for SCN-004: tension around "supplier invoice blocked, no one knows why"
- [x] Design Teacher Trigger (FR + EN) for SCN-005: tension around "period close tomorrow, system is not clean"
- [x] Design Teacher Trigger (FR + EN) for SCN-M2-001: tension around "wrong lot shipped to customer"
- [x] Design Teacher Trigger (FR + EN) for SCN-M3-001: tension around "delivery impossible, stock shows negative"
- [x] Design Teacher Trigger (FR + EN) for SCN-M4-001: tension around "KPI dashboard shows red, no one can explain why"
- [x] Design Teacher Trigger (FR + EN) for SCN-M5-001: tension around "old receipt still open, audit is tomorrow"
- [x] Add teacher_trigger + teacher_triggerEn fields to ScenarioConfig TypeScript interface
- [x] Add teacher_trigger text to all 9 scenario entries in SCENARIO_REGISTRY
- [x] Update ScenarioPanel UI: show Teacher Trigger as the first visible element in collapsed banner
- [x] Update ScenarioPanel UI: repeat Teacher Trigger as a styled "situation" card at top of Step 1
- [x] Run pnpm build (0 errors, 9.90s) and pnpm test (218/218)
- [x] Save checkpoint (6abcae52) and deliver updated scenario document

## Full Scenario Validation & Stress-Test (All 9 SCN)

- [x] Stress-test SCN-001 to SCN-005 (M1): simulate execution, validate visual contrast, confirm classroom readiness
- [x] Stress-test SCN-M2-001, SCN-M3-001, SCN-M4-001, SCN-M5-001: same validation
- [x] Improve discovery questions, expected answers, and common mistakes where weak (SCN-M2-001 observation note, SCN-M4-001 question sharpened)
- [x] Update ScenarioPanel registry with improved content (checkpoint 1b9356ea)
- [x] Write comprehensive validated scenario document (all 9 SCN, FR+EN, with instructor guidance)
- [x] Export scenario document to PDF (TEC_WMS_Scenarios_Validated_Complete.pdf)
- [x] Run pnpm build (0 errors) and pnpm test (218/218)
- [x] Save checkpoint (1b9356ea) and deliver to professor

## Single Odoo Lab Per Step — Architecture Fix

- [x] Audit all ScenarioPanel and OdooLabButton render sites in StepForm.tsx
- [x] Implement getActiveScenarioForStep(moduleId, scenarioId, stepCode) single-source-of-truth function
- [x] Remove all duplicate ScenarioPanel renders on same step
- [x] Enforce mutual exclusion: suppress OdooLabButton when ScenarioPanel is active for that step
- [x] M1 Scenario 1 GR → only SCN-001; M1 Scenario 2 GR → only SCN-002
- [x] Add dev warning guard: if >1 scenario matches a step, render only highest-priority
- [x] Verify no screen shows 2+ Odoo buttons or duplicate "Vérifier dans Odoo"
- [x] Run pnpm build (0 errors) and pnpm test (218/218)
- [x] Save checkpoint "Fix single Odoo Lab per scenario-step rendering"
- [x] Deliver validation table: each scenario, step, exactly one visible lab

## Compliance Recovery Flow — Full Implementation

- [x] Extend ComplianceResult type in rulesEngine.ts: add rootCauseStep, recoveryStepCode, impactFr, impactEn, odooAuditUrl per issue
- [x] Update checkCompliance() to return structured ComplianceIssue objects with root cause + recovery target
- [x] Add compliance.diagnose tRPC query returning detailed audit report (non-destructive, no run close)
- [x] Create ComplianceAuditPanel.tsx: root-cause cards, corrective action cards, smart recovery buttons
- [x] Wire recovery navigation in StepForm.tsx: return-to-step without full reset, preserve completed steps
- [x] Add compliance.retryCheck tRPC procedure (re-run compliance without closing run)
- [x] Add pedagogical fallback message when rollback is not technically possible
- [x] Add Odoo-ready audit hooks (odooAuditUrl per issue type for future EDU LAB integration)
- [x] Update compliance step rendering in StepForm.tsx to use ComplianceAuditPanel
- [x] Run pnpm build (0 errors) and pnpm test (218/218 pass)
- [x] Save checkpoint and deliver implementation report

## TEC.LOG Final Completion — Phases 1-8

### Phase 1 — Reset Path Validation & Fix
- [x] Audit existing resetRun path: teacher MonitorDashboard → runs.resetRun tRPC → db.resetRun (deletes run + child records)
- [x] Add student self-reset: runs.selfReset tRPC procedure (student can reset their own in_progress or completed run)
- [x] Fix RunReport.tsx "Recommencer ce scénario" button: wired to selfReset mutation
- [x] Add teacher quiz reset: quiz.resetAttempts tRPC procedure (teacher can clear quiz attempts for a student/module)
- [x] Wire quiz reset button in MonitorDashboard (per-student, per-module)
- [x] Verify reset restores: scenario state, scoring history, stocks, lots, compliance state

### Phase 2 — M1 Quiz Retake Fix
- [x] Investigate why M1 quiz button appears inactive after one attempt (quizPassed gate confirmed working)
- [x] Confirm quiz is already retakeable (QuizPage shows "Recommencer le quiz" — gate not blocking)
- [x] Add "Mode pratique" label to quiz intro (unlimited retakes, no lock)
- [x] Add "Mode examen" label for certification attempts (teacher-controlled)
- [x] Ensure practice mode and exam mode are clearly separated in UI

### Phase 3 — Odoo Certification Structure (2 certifications only)
- [x] Create Odoo article: "TEC.LOG Fundamentals Certification" (M1 scope, seq 39)
- [x] Create Odoo article: "TEC.LOG — Integrated ERP/WMS Logistics Certification" (M2–M5 scope, seq 69)
- [x] Remove/update existing M1 certification article if it has wrong scope
- [x] Update TEC.WMS CertificationPage to show 2-cert structure (M1 Fundamentals + M2–M5 Final)
- [x] Update TEC.WMS M1 completion logic → triggers Fundamentals Cert display
- [x] Update TEC.WMS M2–M5 all complete → triggers Final Cert display
- [x] Do NOT create per-module M2/M3/M4/M5 certifications

### Phase 4 — Odoo Dataset Validation
- [x] Verify SKU-001 to SKU-010 exist in Odoo (all 10 present; type=consu, SKU-003/004 lot-tracked)
- [x] Verify/create WH/Input, WH/Stock, WH/Output, WH/Quality locations (created Output+Quality, Allée-A/B/C exist)
- [x] Verify Min/Max replenishment rules for SKU-004 (10/50), SKU-005 (20/100), SKU-003 (30/150) created
- [x] Verify lot-tracked products: SKU-003 has LOT-A/B/C; SKU-004 lots LOT-2024-A/B created
- [x] Verify cycle count data: SKU-003 multi-lot stock confirmed (50+30+20=100 units)
- [x] Verify KPI data: stock quants confirmed (SKU-001=130, BOX-001=75, SKU-003=100)
- [x] Created: WH/Output, WH/Quality locations; putaway rules SKU-001→Allée-A, SKU-003→Allée-B, SKU-004→Allée-C; lots LOT-SKU004-2024-A/B; reorder rule SKU-003

### Phase 5 — M2-M5 Odoo Readiness
- [x] M2: Validate putaway rules, bin locations, internal transfers, FIFO picking
- [x] M3: Validate Min/Max, replenishment, safety stock, cycle count, multi-lot
- [x] M4: Validate KPI datasets, dashboards, OTIF, Fill Rate, Lead Time, Inventory Turnover
- [x] M5: Validate end-to-end flow: receipt → putaway → picking → shipping → cycle count → audit

### Phase 6 — Student/Teacher UX Fixes
- [x] Fix empty pages or inactive buttons found during audit
- [x] Fix broken Odoo links (all 64 Odoo URLs confirmed pointing to edu-concorde-logistics-lab.odoo.com)
- [x] Ensure teacher notes are hidden from students (isTeacherOrAdmin gate confirmed in SlideViewer)
- [x] Fix certification visibility: banners shown in RunReport after M1 pass (green) and M5 pass (indigo)

### Phase 7 — Guide de facilitation TEC.LOG PDF
- [x] Write Guide de facilitation TEC.LOG (French, 10 classes × 3h)
- [x] Include: module flow, TEC.WMS usage, Odoo EDU LAB, demo/exam modes, reset procedure, quiz/certification, evaluation criteria, student mistakes, teacher script, final checklist
- [x] Export to PDF

### Phase 8 — Final Validation Report
- [x] Run TypeScript check (0 errors)
- [x] Run pnpm test (218/218)
- [x] Validate student flow M1-M5
- [x] Validate teacher flow (reset, monitoring, quiz management)
- [x] Validate Odoo certification pages (2 articles: M1 Fundamentals + M2–M5 Final)
- [x] Produce FINAL TEC.LOG VALIDATION REPORT
- [x] Save checkpoint

## Production Hardening — Phases 1-8 (pasted_content_39)

### PH1 — Odoo Dataset Coverage Matrix
- [ ] Audit all Odoo products (SKU-001 to SKU-010, BOX-001) — confirm name, type, tracking
- [ ] Audit all locations (WH/Input, WH/Stock, Allée-A/B/C, WH/Output, WH/Quality)
- [ ] Audit all lots (LOT-SKU003-A/B/C, LOT-SKU004-2024-A/B)
- [ ] Audit putaway rules, reorder rules, stock quants
- [ ] Build M1–M5 coverage matrix (MODULE→SCENARIO→SKU→LOCATION→LOT→OPERATION→URL→OBSERVATION→TEC.WMS STEP)
- [ ] Create missing products/lots/locations/rules for complete M1–M5 coverage

### PH2 — Classroom Dataset Standard
- [ ] Define per-module SKU roles: teaching/exam/demo/lot-tracked/replenishment/KPI/error
- [ ] Ensure every stock quantity has a pedagogical reason (no random stock)
- [ ] Document the classroom dataset standard

### PH3 — Exam Snapshot / Reset State
- [ ] Document exact Odoo state before each module exam (quantities, lots, rules, docs)
- [ ] Create teacher reset procedure (archive/delete/recreate steps)
- [ ] If possible, create a reset script or checklist

### PH4 — M4 KPI Data Hardening
- [ ] Create stock movement history for KPI analysis (receipts, deliveries, delays)
- [ ] Create delayed receipt example (OTIF <95%)
- [ ] Create delivery issue example (Fill Rate <98%)
- [ ] Create inventory discrepancy example (stock accuracy)
- [ ] Create replenishment delay example (DSI/rotation)
- [ ] Verify M4 Odoo Reporting page has enough data for student observation

### PH5 — TEC.WMS ↔ Odoo URL Coherence
- [ ] Audit all active Odoo Lab URLs in TEC.WMS slides (M1–M5)
- [ ] Verify each URL opens correct Odoo page and data exists
- [ ] Fix any broken, generic, or misleading links

### PH6 — Certification Logic Final Check
- [ ] Confirm M1 cert banner appears only on M1 pass (score ≥60 + conformity)
- [ ] Confirm M5 cert banner appears only on M5 pass (score ≥60 + conformity)
- [ ] Confirm no M2/M3/M4 standalone certifications exist
- [ ] Verify Odoo certification articles explain each cert clearly

### PH7 — Teacher Guide Addendum
- [ ] Write addendum: before-class checklist, before-exam checklist, after-exam reset
- [ ] Write Odoo dataset validation checklist
- [ ] Write module-by-module SKU guide (what to show in Odoo and when)
- [ ] Write troubleshooting section (if Odoo data changed by students)
- [ ] Export updated guide to PDF

### PH8 — Final Validation Report
- [ ] Compile full inventory: SKUs, locations, lots, putaway rules, reorder rules, documents, URLs
- [ ] Validate certification pages
- [ ] Confirm reset procedure status
- [ ] Run pnpm test (218/218) and build (0 errors)
- [ ] Save checkpoint
