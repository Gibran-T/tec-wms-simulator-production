# RunReport Hotfix Report — RC-1.1 Pre-Class

**Date:** 2026-06-10  
**Scope:** UI defensive rendering only — fix `TypeError: Cannot read properties of undefined (reading 'totalErrors')`  
**Route affected:** `/student/run/:runId/report` (e.g. `/student/run/2400001/report`)

---

## 1. Root cause

`RunReport.tsx` renders as soon as `runs.state` loads, **before** `runs.detailedReport` finishes.

Previous guard:

```typescript
const detailUnavailable = detailError || (!detailLoading && !detail);
```

When `detailLoading === true` and `detail === undefined`, `detailUnavailable` was **false**, so the component executed:

```typescript
detail!.totalErrors  // TypeError
```

Secondary risk: partial `detailedReport` payloads missing `totalErrors`, `stepBreakdown`, `errors`, etc. would crash on `.length` / `.map` access.

---

## 2. File changed

| File | Change |
|------|--------|
| `client/src/pages/student/RunReport.tsx` | Defensive normalization + safe reads |

**No changes to:** DB, scoring engine, certification engine, scenario engine, mission data, slides, quizzes, server routers.

---

## 3. Lines changed (summary)

| Area | Change |
|------|--------|
| **L12–50** | Added `normalizeReportDetail()` helper with safe defaults for `totalErrors`, `totalWarnings`, `stepBreakdown`, `errors`, `bonuses`, `recommendations`, `stepsCompleted`, `totalSteps`, `scoreLabel`, `certificationUnlocked` |
| **L277–285** | Added `safeCompliance`, `safeScore`, `safeDetail`; fixed `detailUnavailable` to include **`detailLoading`** |
| **L265–276** | Added partial-report banner: *« Rapport partiel — données de performance non encore disponibles. »* |
| **L285–520** | Replaced unsafe `compliance.*`, `detail.*`, `totalScore` reads with `safeCompliance`, `safeDetail`, `safeScore` |

**Approximate diff:** ~90 lines touched (insertions + replacements) in one file.

---

## 4. Defensive pattern applied

```typescript
const safeCompliance = {
  compliant: compliance?.compliant ?? false,
  issuesFr: compliance?.issuesFr ?? [],
};
const safeScore = totalScore ?? run?.score ?? 0;
const safeDetail = normalizeReportDetail(detail);
const detailUnavailable = detailError || detailLoading || !safeDetail;
```

`normalizeReportDetail` ensures:

| Field | Fallback |
|-------|----------|
| `totalErrors` | `detail.totalErrors ?? errors.length ?? 0` |
| `totalWarnings` | `0` |
| `stepBreakdown` | `[]` |
| `errors` | `[]` |
| `bonuses` | `[]` |
| `recommendations` | `[]` |

When detail is loading, failed, or absent → errors cell shows *« Détails indisponibles / erreurs non chargées »* instead of crashing. When loading/incomplete without error → partial banner shown; **score header still renders from `runs.state`**.

---

## 5. Validation

| Check | Result |
|-------|--------|
| `git diff --check` | **PASS** |
| `pnpm test` | **PASS** — 16 files · **310/310** |
| `pnpm build` | **PASS** |
| Silver / Gold / scoring / scenarios | **Unchanged** (client-only) |

### Manual scenarios (logic review)

| Scenario | Expected behavior |
|----------|-------------------|
| `/student/run/2400001/report` | No TypeError; score from `state`; partial banner if detail pending |
| SCN-001 completed report | Score + compliance render; detail sections when loaded |
| SCN-002 completed report | Same — no crash on missing metrics |
| In-progress run report | Partial banner + summary; no `totalErrors` crash |

*Production URL verification requires deploy of this bundle.*

---

## 6. Final verdict

# **REPORT FIXED**

The RunReport page no longer crashes when `detailedReport` is loading, failed, or partially populated. Existing layout and copy preserved; partial state surfaced with documented French/English message.

---

*End of RunReport Hotfix Report.*
