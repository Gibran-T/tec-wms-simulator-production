# D-M3-02 Pre-Commit Risk Review

**Date:** 2026-06-10  
**Branch:** `production-hotfix-rc13-pedagogy-class6`  
**Scope:** Final review before committing D-M3-02 (implementation complete, tests green)  
**Production context:** M1 catalog shows 7 scenarios (expected 5), SCN-003/005 appear duplicated, JSON/HTML error on `/student/module5/scenario/15/mode`  
**Verdict:** **Do not commit yet** until this review is acknowledged — see §8.

---

## 1. Executive Verdict

| Question | Answer |
|----------|--------|
| **Is the D-M3-02 diff safe to commit in isolation?** | **Yes** — scoped to M3; does not touch catalog, non-M3 routes, certification, or schema |
| **Will committing D-M3-02 fix production catalog / M5 JSON issues?** | **No** |
| **Will committing D-M3-02 worsen those production issues?** | **No evidence** — zero overlap in changed files |
| **Recommend commit now?** | **Yes for D-M3-02 code** after review sign-off; **no deploy** until P0 catalog/routing issues are dispositioned separately |

---

## 2. Checks Run

| Check | Result |
|-------|--------|
| `git diff --check` | **Pass** — no conflict markers or whitespace errors |
| `pnpm test` | **Pass** — 14 files, **289/289** tests |
| Scenario catalog / routes grep | **Pass** — no diff in catalog or route files |
| Certification grep | **Pass** — no diff in cert paths |
| DB schema / migrations grep | **Pass** — `drizzle/schema.ts` and migrations untouched |

---

## 3. Files Changed (Staged Scope for Commit)

### Modified (6)

| File | Role |
|------|------|
| `server/rulesEngine.ts` | M3 validators: `validateM3Compliance`, cycle/replen helpers |
| `server/routers.ts` | M3 router only (`m3.submitCcList` … `submitComplianceM3`) + `loadM3ComplianceArtifacts` |
| `server/db.ts` | `upsertInventoryCount`, `upsertReplenishmentSuggestion` (existing tables) |
| `client/src/pages/student/StepForm.tsx` | M3 CC_LIST multi-SKU UI, partial-step toasts, SCN-011 replenish banner |
| `server/missionDataExtended.ts` | **SCN-011 only** — Min–Max copy alignment |
| `client/src/data/scenarioCockpitPedagogy.ts` | **SCN-011 only** — cockpit hint alignment |

### Untracked (should be included when committing D-M3-02)

| File | Role |
|------|------|
| `server/m3.d-m3-02.test.ts` | 14 required D-M3-02 tests |

### Untracked (reports — commit separately if desired)

`D-M3-02_IMPLEMENTATION_REPORT.md`, `D-M3-02_PEDAGOGICAL_DESIGN.md`, audit/P0 reports.

### Explicitly NOT in diff

`drizzle/schema.ts`, `drizzle/migrations/**`, `server/seed.ts`, `client/src/App.tsx`, `ScenarioList.tsx`, `Module5ModeSelectionPage.tsx`, `modulePathway.ts`, `competencyMap.ts`, `silver.certification.test.ts`, M1/M2/M4/M5 routers.

---

## 4. Criterion-by-Criterion Review

### 4.1 Does not worsen or touch scenario catalog outside M3

| Evidence | Result |
|----------|--------|
| No changes to `trpc.scenarios.list`, `getAllScenarios`, `seed.ts`, `ScenarioList.tsx` | ✅ |
| No new scenario rows or moduleId filters | ✅ |
| `missionDataExtended.ts` — only **SCN-011** text fields | ✅ |
| `scenarioCockpitPedagogy.ts` — only **SCN-011** keys | ✅ |

**Conclusion:** D-M3-02 does **not** generate, filter, or duplicate scenarios. M1 showing **7 instead of 5** and SCN-003/005 duplication are **pre-existing catalog/DB seed issues**, not introduced by this diff.

---

### 4.2 Does not affect M1/M2/M4/M5 routes

| Evidence | Result |
|----------|--------|
| `routers.ts` hunks: imports, `loadM3ComplianceArtifacts`, **`m3.*` mutations only** (lines ~2266–2524) | ✅ |
| No changes to `m2`, `m4`, `m5`, `transactions`, `compliance.finalize` routers | ✅ |
| `App.tsx` route table unchanged | ✅ |
| `StepForm.tsx` — new logic gated by `m3CycleCountTargets` / `m3ReplenishmentParams` / `case "cc_list"` / `step === "replenish"` | ✅ |
| Shared `handleSuccess` adds `complete === false` branch — **only M3 APIs return this field** | ✅ |

**Conclusion:** Non-M3 HTTP routes and step handlers are **unchanged**.

---

### 4.3 Does not alter certification logic

| Evidence | Result |
|----------|--------|
| No diff in `getSilverCertificationStatus`, `unlockSilverCertification`, `unlockGoldCertification`, `upsertModuleProgress` call sites | ✅ |
| `silver.certification.test.ts` unchanged; still **3/3 pass** | ✅ |
| M3 `completeRun()` still only sets run `status: completed` — no module pass / cert flags | ✅ |

**Conclusion:** Silver/Gold and module progress certification paths are **untouched**.

---

### 4.4 No DB schema or migration changes

| Evidence | Result |
|----------|--------|
| `drizzle/schema.ts` — **not modified** | ✅ |
| `drizzle/migrations/**` — **not modified** | ✅ |
| `db.ts` adds **upsert** helpers using existing `inventory_counts` and `replenishment_suggestions` columns | ✅ |
| `studentQty` encoded in existing `reason` varchar — **no new column** | ✅ |

**Conclusion:** Application-layer writes only; **no migration required**.

---

### 4.5 Keeps existing completed runs grandfathered

| Evidence | Result |
|----------|--------|
| All five M3 mutations: `if (run.status === "completed") return { success: true, ... }` before new validation | ✅ |
| No batch job to invalidate historical runs | ✅ |
| In-progress runs get new rules on forward path only | ✅ (by design) |

**Conclusion:** Grandfather policy **implemented as specified**.

---

### 4.6 Keeps Mission Sheets as Gold Standard

| Evidence | Result |
|----------|--------|
| Runtime driven by seed contracts: `cycleCountTargets`, `replenishmentParams`, `adjustmentThreshold` | ✅ |
| SCN-011 copy aligned to engine formula (Q = Max − stock) without changing engine | ✅ |
| P-M3-009-02 **held** — SCN-009 −3 still allows empty justification (D-M3-01 preserved) | ✅ |
| COMPLIANCE_M3 enforces Mission outcomes via `validateM3Compliance` | ✅ |

**Caveat:** Institutional PDF not in repo; SCN-011 copy changes should be confirmed against PDF before deploy (not blocking commit of code).

---

## 5. Risk Areas (Within D-M3-02)

| Risk | Severity | Mitigation |
|------|----------|------------|
| **In-progress M3 runs** blocked at COMPLIANCE until multi-SKU work done | Medium (intended) | Catch-up submissions; communicate to students |
| **Exact replenishment match** (170/260) — partial credit still stored but step incomplete | Low | Matches Mission Sheet numerics |
| **`ValidationResult` type export** added to `rulesEngine.ts` | Low | Tests pass; existing validators already return `allowed` |
| **Shared StepForm `handleSuccess`** toast branch | Low | Only fires when `complete === false` (M3-only response shape) |
| **Untracked test file** omitted from commit | Medium process | Include `server/m3.d-m3-02.test.ts` in commit |

---

## 6. Production Issues vs D-M3-02 — Interaction Analysis

### 6.1 M1 displays 7 scenarios instead of 5 official Mission Sheet scenarios

| Factor | Assessment |
|--------|------------|
| **Likely cause** | Duplicate rows in `scenarios` table (re-seed / `onDuplicateKeyUpdate` without dedup) or UI listing all `moduleId === 1` rows from DB |
| **D-M3-02 touch?** | **None** — `seed.ts`, `scenarios.list`, `ScenarioList.tsx` not in diff |
| **Seed canonical count** | `server/seed.ts` defines **5** M1 scenarios (lines ~119–173) |

### 6.2 SCN-003 and SCN-005 appear duplicated

| Factor | Assessment |
|--------|------------|
| **Likely cause** | Same as §6.1 — duplicate DB scenario records sharing names/codes, not duplicate code paths in D-M3-02 |
| **D-M3-02 touch?** | **None** — no changes to SCN-003/005 mission data, cockpit, or catalog |

### 6.3 JSON/HTML error on `/student/module5/scenario/15/mode`

| Factor | Assessment |
|--------|------------|
| **Likely cause** | Per `P0_JSON_HTML_ROOT_CAUSE_REPORT.md`: tRPC client receives **HTML instead of JSON** when `/api/trpc` is misrouted (static SPA fallback / stale bundle / API not running) — **not M5 business logic** |
| **Page** | `Module5ModeSelectionPage.tsx` calls `trpc.scenarios.listByModule` + `runs.start` — **unchanged by D-M3-02** |
| **D-M3-02 touch?** | **None** — no changes to `_core/index.ts`, `main.tsx`, M5 router, or M5 pages |

**Summary:** The three production symptoms are **orthogonal** to D-M3-02. Committing D-M3-02 **neither fixes nor aggravates** them; they require separate P0 work (DB catalog cleanup, static/API alignment).

---

## 7. `routers.ts` Diff Map (Sanity)

All functional hunks fall in:

1. Import block — M3 validator imports + db upsert imports  
2. `loadM3ComplianceArtifacts()` helper  
3. `m3.submitCcList`, `submitCcCount`, `submitCcRecon`, `submitReplenish`, `submitComplianceM3`

**Zero hunks** in: auth, certification, quiz, scenarios CRUD, M1 transactions, M2/M4/M5 routers, teacher monitor, runs.start (except unchanged surrounding context).

---

## 8. Recommendation

| Action | Guidance |
|--------|----------|
| **Commit D-M3-02?** | **Yes**, after reviewer acknowledges this report — diff is **isolated and safe** |
| **Include in commit** | 6 modified files + `server/m3.d-m3-02.test.ts` + optional `D-M3-02_*` reports |
| **Deploy with this commit alone?** | **Not recommended** — production catalog and JSON/HTML P0 issues remain |
| **Block commit because of M1/M5 production bugs?** | **No** — unrelated; track as separate P0 |

---

## 9. Sign-Off Checklist

- [ ] Reviewer confirms D-M3-02 scope acceptable
- [ ] Reviewer confirms `m3.d-m3-02.test.ts` will be added to commit
- [ ] Pedagogy owner accepts SCN-011 copy-only changes
- [ ] Ops owner acknowledges M1 catalog + M5 JSON issues are **out of scope** for this commit
- [ ] **Then** authorize `git commit` (still no deploy unless explicitly requested)

---

*Review complete. No commit performed.*
