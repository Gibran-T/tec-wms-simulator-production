# RC14 Wave 1 — Commit Readiness Report

**Date:** 2026-06-18  
**Branch:** local working tree (uncommitted)  
**Scope:** RC14 Wave 1 — M3 / M4 / M5 operational intelligence + Silver Premium Certificate  
**Actions taken:** `git status --short`, diff review, sensitive-path verification  
**Actions NOT taken:** commit, push, deploy, test execution

---

## Executive summary

RC14 Wave 1 introduces **display-only operational intelligence** for Modules 3–5 and a **Silver Premium Certificate** presentation layer. All changes are local and untracked/modified across **11 tracked files** (+561 / −158 lines) and **~40 new source/assets files**.

**Sensitive core confirmed untouched:** scoring engine, certification engine, thresholds, DB schema, migrations, Silver/Gold unlock logic, and critical validators.

**Main commit risk:** `MissionControl.tsx`, `OperationalIntelligenceLayer.tsx`, and `server/routers.ts` span multiple wave groups — staged commits will require `git add -p` or incremental commits on shared files.

---

## 1. `git status --short` (tracked + untracked summary)

### Modified (tracked) — 11 files

| Status | Path |
|--------|------|
| `M` | `client/src/components/operational-intelligence/OperationalIntelligenceLayer.tsx` |
| `M` | `client/src/data/scenarioCockpitPedagogy.ts` |
| `M` | `client/src/index.css` |
| `M` | `client/src/pages/student/MissionControl.tsx` |
| `M` | `client/src/pages/student/RunReport.tsx` |
| `M` | `client/src/pages/student/SilverCertificatePreview.tsx` |
| `M` | `client/src/pages/student/StepForm.tsx` |
| `M` | `server/missionDataExtended.ts` |
| `M` | `server/module345.rules.test.ts` |
| `M` | `server/routers.ts` |
| `M` | `vitest.config.ts` |

### Untracked — RC14 Wave 1 source (new)

See groups A–D below.

### Untracked — out of RC14 Wave 1 scope

Large backlog of RC12/RC13 audit markdown, Railway/Manus plans, `.manus-logs/` — **do not include** in RC14 commits (Group F).

`dist/` is **not** present in current status (good).

---

## 2. Files by group

### A) M3 Wave 1 — Operational Control Tower

**New files**

| File | Role |
|------|------|
| `client/src/components/operational-intelligence/M3OperationalTowerView.tsx` | M3 tower UI (badges, replenishment table, resolution chain) |
| `client/src/data/m3OperationalControlTower.ts` | Per-SCN M3 cockpit pedagogy metadata |
| `client/src/lib/m3OperationalEvidence.ts` | Evidence computation (badges, resolution chain, replenishment rows) |
| `client/src/lib/m3OperationalEvidence.test.ts` | Client unit tests |

**Modified files (M3-specific hunks)**

| File | Change summary |
|------|----------------|
| `server/routers.ts` | `runs.state` exposes `m3Evidence` (inventory counts, adjustments, replenishment suggestions, initial state) |
| `server/missionDataExtended.ts` | SCN-009 copy: CC_RECON + ADJ (MI07) guidance (pedagogical text only) |
| `client/src/data/scenarioCockpitPedagogy.ts` | SCN-009 / SCN-011 cockpit hints |
| `client/src/pages/student/StepForm.tsx` | SCN-011 replenishment params table in CC_LIST confirmatory step |
| `client/src/components/operational-intelligence/OperationalIntelligenceLayer.tsx` | Panel B M3 tower; Panel F SCN-011 step labels |
| `client/src/pages/student/MissionControl.tsx` | M3 grids, resolution chain, performance metrics, ADJ highlighting |

---

### B) M4 Wave 1 — KPI Evidence Layer

**New files**

| File | Role |
|------|------|
| `client/src/components/operational-intelligence/m4/M4EvidenceLayer.tsx` | Composes tower + feed + trail + alerts |
| `client/src/components/operational-intelligence/m4/M4KpiAmberAlerts.tsx` | Amber interpretation alerts |
| `client/src/components/operational-intelligence/m4/M4KpiEvidenceFeed.tsx` | Step-aware KPI evidence feed |
| `client/src/components/operational-intelligence/m4/M4KpiInterpretationTrail.tsx` | Student interpretation trail |
| `client/src/components/operational-intelligence/m4/M4KpiSnapshotHeader.tsx` | KPI snapshot header (cockpit + report) |
| `client/src/components/operational-intelligence/m4/M4KpiTiles.tsx` | KPI tile grid |
| `client/src/data/m4KpiBandUtils.ts` | Display-only band helpers (mirrors `rulesEngine` semantics) |
| `client/src/data/m4KpiEvidenceFeed.ts` | Feed row builder |
| `client/src/data/m4KpiEvidenceFeed.test.ts` | Client unit tests |

**Modified files (M4-specific hunks)**

| File | Change summary |
|------|----------------|
| `server/routers.ts` | `buildM4KpiSnapshot()`, `m4KpiSnapshot` on report detail + `runs.state`; `kpiInterpretations` on `runs.state` |
| `server/module345.rules.test.ts` | New test: display payload matches `calculateKpis(CANONICAL_M4_KPI_DATA)` — **no validator change** |
| `client/src/components/operational-intelligence/OperationalIntelligenceLayer.tsx` | `M4EvidenceLayer` in Panel B |
| `client/src/pages/student/MissionControl.tsx` | M4 snapshot header + evidence feed |
| `client/src/pages/student/RunReport.tsx` | M4 snapshot header on completed runs |

---

### C) M5 Wave 1 — Dynamic KPI Tower

**New files**

| File | Role |
|------|------|
| `client/src/components/m5/M5DynamicKpiTower.tsx` | Live KPI tower replacing static M5 panel |
| `client/src/components/m5/M5ExecutiveChainStrip.tsx` | Executive decision chain strip |
| `client/src/components/m5/M5KpiLedgerWidget.tsx` | Ledger widget for cockpit |
| `client/src/components/m5/M5TransactionTimeline.tsx` | Transaction timeline (cockpit + report) |
| `client/src/components/m5/M5ZoneFlowBar.tsx` | Zone flow bar (cockpit + report) |
| `client/src/components/m5/m5KpiDisplayUtils.ts` | Formatting helpers |
| `shared/zoneMapping.ts` | Display-only bin → zone mapping + `aggregateZoneFlow` |

**Modified files (M5-specific hunks)**

| File | Change summary |
|------|----------------|
| `client/src/components/operational-intelligence/OperationalIntelligenceLayer.tsx` | `M5DynamicKpiTower`, `m5KpiLedger` prop, tx table visibility |
| `client/src/pages/student/MissionControl.tsx` | `trpc.m5.kpiLedger` polling, M5 widgets (ledger, zone flow, timeline, chain) |
| `client/src/pages/student/RunReport.tsx` | M5 zone flow + transaction timeline on report |

**Note:** `server/routers.ts` `zoneFlow` / `transactionTimeline` / `m5.kpiLedger` endpoints appear **pre-existing** — not introduced in this diff. M5 Wave 1 is primarily **client wiring** to existing API surface.

---

### D) Silver Premium Certificate

**New files**

| File | Role |
|------|------|
| `client/src/components/certification/CertificationCompletionBadge.tsx` | Completion badge block |
| `client/src/components/certification/QrPlaceholder.tsx` | QR placeholder |
| `client/src/components/certification/SignaturePlaceholder.tsx` | Signature placeholder |
| `client/src/components/certification/SilverCertificateDocument.tsx` | A4 landscape premium layout |
| `client/src/components/certification/VerificationIdBlock.tsx` | Verification ID block |

**Modified files**

| File | Change summary |
|------|----------------|
| `client/src/pages/student/SilverCertificatePreview.tsx` | Delegates rendering to `SilverCertificateDocument`; print classes |
| `client/src/index.css` | `@media print` A4 landscape rules for silver certificate |

**Doc assets (visual before/after — include with D or E)**

| File |
|------|
| `Documentation/silver-premium-certificate/after-rc14-landscape-premium.svg` |
| `Documentation/silver-premium-certificate/before-rc13-portrait.svg` |
| `Documentation/silver-premium-certificate/silver-premium-before-after.png` |

---

### E) Reports / docs (RC14)

**RC14 specifications & audits (recommended for docs commit)**

| File |
|------|
| `RC14_PREMIUM_OPERATIONAL_INTELLIGENCE_MASTER_PLAN.md` |
| `RC14_M3_PREMIUM_INTELLIGENCE_AUDIT.md` |
| `RC14_M3_WAVE1_IMPLEMENTATION_SPEC.md` |
| `RC14_M4_PREMIUM_INTELLIGENCE_AUDIT.md` |
| `RC14_M4_WAVE1_IMPLEMENTATION_SPEC.md` |
| `RC14_M5_PREMIUM_INTELLIGENCE_AUDIT.md` |
| `RC14_M5_AND_SILVER_PREMIUM_IMPLEMENTATION_SPEC.md` |
| `Documentation/M4_PEDAGOGICAL_INTELLIGENCE_AUDIT.md` |
| `Documentation/M5_PEDAGOGICAL_INTELLIGENCE_AUDIT.md` |
| `Documentation/M4_WAVE1_SCREENSHOTS/01-mission-control-kpi-data.svg` |
| `Documentation/M4_WAVE1_SCREENSHOTS/02-evidence-feed-kpi-service.svg` |
| `Documentation/M4_WAVE1_SCREENSHOTS/03-run-report-snapshot.svg` |
| `Documentation/screenshots/rc14-m5-wave1/m5-wave1-mission-control.png` |
| `Documentation/screenshots/rc14-m5-wave1/m5-wave1-dynamic-tower.png` |

**Shared test infra (cross-cutting — commit before or with first feature group)**

| File | Change |
|------|--------|
| `vitest.config.ts` | Adds `client/**/*.test.ts` to test include |

---

### F) Temporary / out-of-scope — do NOT commit

| Category | Paths |
|----------|-------|
| Runtime logs | `.manus-logs/` (entire directory) |
| Build artifacts | `dist/` (if reappears) |
| RC12 backlog docs | `RC12_*.md` |
| RC13 backlog docs | `RC13_*.md`, `COHORTE_*.md`, `RAILWAY_*.md`, `MANUS_*.md`, `PHASE_*.md`, `HOSTING_*.md`, `LOCAL_AUTH_*.md`, `PRE_CLASS_*.md`, `DATABASE_*.md`, `DEPLOYMENT_*.md` |
| RC13 Documentation | `Documentation/RC13_*`, `Documentation/CERTIFICATION_*`, `Documentation/PEDAGOGICAL_ALIGNMENT_AUDIT.md` |

---

## 3. Sensitive-area verification

| Area | Status | Evidence |
|------|--------|----------|
| **Scoring** (`server/scoringEngine.ts`) | ✅ No changes | `git diff --name-only` empty for file |
| **Certification engine** (`server/goldCertification.ts`, unlock flows in `routers.ts`) | ✅ No changes | No diff on `goldCertification.ts`; routers diff is read-only enrichment only |
| **Thresholds** (`shared/moduleThresholds.ts`, `client/src/data/moduleThresholds.ts`) | ✅ No changes | Files not in status; `m4KpiBandUtils.ts` duplicates bands for **display only** |
| **Database schema** (`drizzle/schema.ts`, `server/db.ts`) | ✅ No changes | Not in status |
| **Migrations** (`drizzle/migrations/*`) | ✅ No changes | Not in status |
| **Silver/Gold logic** (`shared/silverCertificationRegistry.ts`, cert tests) | ✅ No changes | Registry and `silver.certification.test.ts` / `gold.certification.test.ts` untouched |
| **Critical validators** (`server/rulesEngine.ts`, `validateM4Compliance`, etc.) | ✅ No changes | `rulesEngine.ts` untouched; `module345.rules.test.ts` adds display assertion only |
| **Pedagogical mission copy** (`missionDataExtended.ts`) | ⚠️ Copy only | SCN-009 text clarifies ADJ flow — does not alter validation functions |

---

## 4. Risks

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| R1 | **Shared files span A+B+C** (`MissionControl.tsx`, `OperationalIntelligenceLayer.tsx`, `routers.ts`) | High | Use `git add -p`; commit foundation files first, integration hunks per module |
| R2 | **Band threshold drift** — `m4KpiBandUtils.ts` mirrors `rulesEngine` literals | Medium | Add comment/link to canonical source; consider shared constants in future wave |
| R3 | **Large MissionControl diff** (+275 lines) — regression surface for M1/M2 cockpit | Medium | Manual smoke: M1 run, M3 SCN-009/011, M4 SCN-012–014, M5 active run |
| R4 | **Client tests not executed in this audit** | Medium | Run `npm test` before first commit |
| R5 | **Accidental doc commit** — 50+ untracked RC13 markdown files | Medium | Stage RC14 paths explicitly; never `git add .` |
| R6 | **Silver certificate is presentation-only** but changes print layout | Low | Visual check print preview; confirm unlock/eligibility logic unchanged |
| R7 | **`resolveScnCode` import from server in `RunReport.tsx`** | Low | Pre-existing pattern in codebase; verify bundler resolves in production build |

---

## 5. Recommended commit order

Commits are ordered so each step keeps the tree buildable. Shared integration files are committed incrementally.

| Order | Group | Rationale |
|-------|-------|-----------|
| **1** | Test infra (`vitest.config.ts`) | Enables client tests for subsequent commits |
| **2** | **A — M3 Wave 1** | Foundation + `m3Evidence` API; least dependency on M4/M5 |
| **3** | **B — M4 Wave 1** | Builds on existing KPI calc; adds `m4KpiSnapshot` API |
| **4** | **C — M5 Wave 1** | Client-only on existing `m5.kpiLedger`; `zoneMapping` shared module |
| **5** | **D — Silver Premium** | Independent vertical; no module coupling |
| **6** | **E — RC14 docs** | Documentation last; no build impact |

**Staging note for commits 2–4:** Each commit touches `OperationalIntelligenceLayer.tsx`, `MissionControl.tsx`, and possibly `routers.ts` — stage only the hunks for that module.

---

## 6. Proposed commit messages

### Commit 1 — test infra

```
chore(test): include client unit tests in vitest config

Enables m3OperationalEvidence and m4KpiEvidenceFeed tests added in RC14 Wave 1.
```

**Files:** `vitest.config.ts`

---

### Commit 2 — M3 Wave 1

```
feat(rc14/m3): add operational control tower and run evidence API

Expose M3 inventory/replenishment evidence on runs.state and surface SCN-009/011
cockpit intelligence (tower, resolution chain, replenishment params) in Mission
Control, StepForm, and Operational Intelligence Layer.
```

**Files:**  
`client/src/components/operational-intelligence/M3OperationalTowerView.tsx`  
`client/src/data/m3OperationalControlTower.ts`  
`client/src/lib/m3OperationalEvidence.ts`  
`client/src/lib/m3OperationalEvidence.test.ts`  
`server/missionDataExtended.ts`  
`client/src/data/scenarioCockpitPedagogy.ts`  
`client/src/pages/student/StepForm.tsx`  
`server/routers.ts` *(m3Evidence hunks only)*  
`client/src/components/operational-intelligence/OperationalIntelligenceLayer.tsx` *(M3 hunks)*  
`client/src/pages/student/MissionControl.tsx` *(M3 hunks)*

---

### Commit 3 — M4 Wave 1

```
feat(rc14/m4): add KPI evidence layer with live snapshot payload

Add M4 evidence components (feed, trail, amber alerts, snapshot header) and
expose m4KpiSnapshot plus kpiInterpretations on runs.state for SCN-012–014.
```

**Files:**  
`client/src/components/operational-intelligence/m4/*` (6 files)  
`client/src/data/m4KpiBandUtils.ts`  
`client/src/data/m4KpiEvidenceFeed.ts`  
`client/src/data/m4KpiEvidenceFeed.test.ts`  
`server/module345.rules.test.ts`  
`server/routers.ts` *(buildM4KpiSnapshot + m4KpiSnapshot + kpiInterpretations hunks)*  
`client/src/components/operational-intelligence/OperationalIntelligenceLayer.tsx` *(M4 hunks)*  
`client/src/pages/student/MissionControl.tsx` *(M4 hunks)*  
`client/src/pages/student/RunReport.tsx` *(M4 hunks)*

---

### Commit 4 — M5 Wave 1

```
feat(rc14/m5): add dynamic KPI tower, zone flow, and transaction timeline

Wire live m5.kpiLedger polling into Mission Control and surface zone flow and
transaction timeline on cockpit and run report via shared zoneMapping helpers.
```

**Files:**  
`client/src/components/m5/*` (6 files)  
`shared/zoneMapping.ts`  
`client/src/components/operational-intelligence/OperationalIntelligenceLayer.tsx` *(M5 hunks)*  
`client/src/pages/student/MissionControl.tsx` *(M5 hunks)*  
`client/src/pages/student/RunReport.tsx` *(M5 hunks)*

---

### Commit 5 — Silver Premium

```
feat(rc14/silver): premium landscape certificate document and print layout

Extract SilverCertificateDocument component with verification, signature, and QR
placeholders; add A4 landscape print CSS for Silver certificate preview.
```

**Files:**  
`client/src/components/certification/CertificationCompletionBadge.tsx`  
`client/src/components/certification/QrPlaceholder.tsx`  
`client/src/components/certification/SignaturePlaceholder.tsx`  
`client/src/components/certification/SilverCertificateDocument.tsx`  
`client/src/components/certification/VerificationIdBlock.tsx`  
`client/src/pages/student/SilverCertificatePreview.tsx`  
`client/src/index.css`  
`Documentation/silver-premium-certificate/*` *(optional: move to docs commit)*

---

### Commit 6 — RC14 documentation

```
docs(rc14): add Wave 1 implementation specs, audits, and screenshots

RC14 premium operational intelligence master plan, M3/M4/M5 Wave 1 specs,
pedagogical audits, and validation screenshots.
```

**Files:** all paths listed in Group E (RC14 docs only)

---

## 7. Pre-commit checklist (before approval)

- [ ] `npm test` — all server + new client tests green
- [ ] `npm run build` — no client bundler errors (especially `RunReport` server import)
- [ ] Manual smoke: M3 SCN-009 resolution chain, SCN-011 replenishment table
- [ ] Manual smoke: M4 SCN-012–014 evidence feed + snapshot header
- [ ] Manual smoke: M5 live ledger poll + zone flow on active run
- [ ] Silver certificate print preview (A4 landscape)
- [ ] Confirm `.manus-logs/`, `dist/`, and RC13 markdown **not staged**
- [ ] Review `git diff --cached` after each staged commit

---

## 8. Approval gate

**No commit has been made.** Awaiting explicit approval to execute commits 1–6 in the order above.

---

*Generated by RC14 Wave 1 commit readiness check — local audit only.*
