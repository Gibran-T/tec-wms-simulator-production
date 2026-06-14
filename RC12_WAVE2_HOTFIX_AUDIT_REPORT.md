# RC12 Wave 2 Hotfix — Pre-Push Audit Report

**Auditor role:** RC12-WAVE2-HOTFIX-AUDITOR  
**Project:** TEC.WMS — Collège de la Concorde  
**Commit under review:** `0554f2fbee1f3f80f9c3dd485f25086c9218cf99`  
**Message:** `fix(rc12): remove quiz gate from scenario access`  
**Audit date:** 2026-06-13  
**HEAD at audit time:** `0554f2f` (matches hotfix commit)

---

## Executive summary

Independent re-audit of the Wave 2 quiz hotfix confirms the regression is resolved: quiz no longer blocks scenario access on server or client, the Drizzle `orderBy` misuse is corrected, Silver certification and M4 `teacherValidated` gates are intact, demo mode is unchanged, and the diff stays within allowed scope. Fresh `pnpm test` and `pnpm build` both pass.

**Final verdict: GO TO PUSH**

---

## 1. Quiz no longer blocks scenario access

| Surface | Finding | Status |
|---------|---------|--------|
| **Server `runs.start`** | Quiz gate (`checkQuizPassed` → `FORBIDDEN`) removed from student eval path | ✅ PASS |
| **Client `ScenarioList.tsx`** | `isLocked = !quizPassed` removed; scenario cards always startable | ✅ PASS |
| **Client UI** | Amber “Prerequisite Quiz” / locked buttons replaced with blue “Recommended quiz” banner (informational only) | ✅ PASS |
| **Residual quiz gates** | No `quizPassed` lock, `Verrouillé`, or quiz `FORBIDDEN` elsewhere in client/server run path | ✅ PASS |

**Evidence:** Commit diff removes ~10 lines from `server/routers.ts` (quiz rejection) and ~40 lines of lock UI from `ScenarioList.tsx`. `quizPassed` remains only for the non-blocking recommendation banner and certification pages.

---

## 2. `runs.start` no longer requires quiz pass

**Finding:** `checkQuizPassed` import and call removed from `runs.start`. Remaining student eval gates are module progression only (M2 requires M1 pass; M4 requires M3 `teacherValidated`).

```787:808:server/routers.ts
        // Server-side progression gates for students in evaluation mode (P0-07)
        if (!isDemo && ctx.user.role === "student") {
          if (moduleId >= 2) {
            const passedIds = await getPassedModuleIds(ctx.user.id);
            if (!isModuleUnlocked(1, passedIds)) {
              throw new TRPCError({
                code: "FORBIDDEN",
                message: "Module 2 verrouillé — complétez le Module 1 d'abord.",
              });
            }
          }

          if (moduleId === 4) {
            const m3Progress = await getModuleProgressRow(ctx.user.id, 3);
            if (!isModule3Unlocked(m3Progress ?? undefined)) {
              throw new TRPCError({
                code: "FORBIDDEN",
                message: "Module 4 verrouillé — validation enseignant du Module 3 requise.",
              });
            }
          }
        }
```

**Status:** ✅ PASS — no quiz check in `runs.start`.

---

## 3. Drizzle `orderBy` syntax is correct

**Root cause (pre-hotfix):** `.orderBy(quizAttempts.score.desc())` — invalid in this Drizzle setup (`score.desc is not a function`).

**Post-hotfix fixes in `server/db.ts`:**

| Function | Before | After |
|----------|--------|-------|
| `checkQuizPassed` | `quizAttempts.score.desc()` | `desc(quizAttempts.score)` |
| `checkM1QuizPassed` | `quizAttempts.score.desc()` | `desc(quizAttempts.score)` |
| `getBestQuizAttempt` | `orderBy(quizAttempts.score)` + last element | `orderBy(desc(quizAttempts.score)).limit(1)` |
| `getLatestNonDemoCompletedRun` | `scenarioRuns.completedAt.desc()` | `desc(scenarioRuns.completedAt)` |

- `desc` imported from `drizzle-orm` ✅  
- No remaining `.score.desc()` or `.completedAt.desc()` patterns in codebase ✅  
- `server/quiz.query.test.ts` asserts correct usage ✅  

**Status:** ✅ PASS

---

## 4. Silver certification still requires M1 quiz ≥ 60

**Finding:** Silver eligibility path untouched by gate removal.

- `QUIZ_PASS_THRESHOLD = 60` in `shared/moduleThresholds.ts` — unchanged ✅  
- `checkM1QuizPassed` uses `>= QUIZ_PASS_THRESHOLD` with fixed `desc()` ordering ✅  
- `getSilverCertificationStatus` still requires `quizPassed && allScenariosDone && complianceValidated && noBlockers` ✅  
- `CertificationsPage.tsx` still shows “Quiz M1 réussi (≥ 60 %)” checklist item ✅  
- `server/silver.certification.test.ts` — 5 tests pass ✅  
- `wave2.progression.test.ts` asserts threshold remains 60 ✅  

**Status:** ✅ PASS

---

## 5. M4 `teacherValidated` gate remains active

**Finding:** M4 access gate not modified by hotfix.

| Layer | Mechanism | Status |
|-------|-----------|--------|
| **Server `runs.start`** | `moduleId === 4` → `isModule3Unlocked(m3Progress)` requires `passed && teacherValidated` | ✅ Unchanged |
| **Client `Module4Dashboard.tsx`** | `m4Blocked` when `!m3Progress?.teacherValidated` | ✅ Not in diff |
| **Tests** | `wave2.progression.test.ts` V2.7 teacherValidated tests retained; `module345.rules.test.ts` 80 tests pass | ✅ PASS |

**Status:** ✅ PASS

---

## 6. Demo mode remains accessible

**Finding:** Demo logic in `runs.start` unchanged.

- `isDemo = input.isDemo && (role === "teacher" || role === "admin")` ✅  
- Students cannot escalate to demo (`effectiveIsDemo = false`) ✅  
- Demo scoring isolation unchanged ✅  
- `server/demo.mode.test.ts` — 15 tests pass ✅  

**Status:** ✅ PASS

---

## 7. Forbidden scope — not touched

**Files changed (6 total):**

| File | In scope? |
|------|-----------|
| `server/db.ts` | ✅ Quiz query fixes only |
| `server/routers.ts` | ✅ Quiz gate removal only |
| `client/src/pages/student/ScenarioList.tsx` | ✅ Client lock removal only |
| `server/wave2.progression.test.ts` | ✅ Test contract update |
| `server/quiz.query.test.ts` | ✅ New regression test |
| `RC12_WAVE2_HOTFIX_REPORT.md` | ✅ Hotfix documentation |

**Forbidden areas — zero diff hits:**

| Area | Touched? |
|------|----------|
| Wave 3 | ❌ No |
| M4 runtime (`Module4Dashboard`, M4 scenario engines) | ❌ No |
| M5 | ❌ No |
| Gold certification | ❌ No |
| Registry | ❌ No |
| PDF | ❌ No |
| QR | ❌ No |
| DB migrations / schema | ❌ No |

**Status:** ✅ PASS — diff is narrowly scoped to quiz gate + Drizzle ordering.

---

## 8. Re-run: `pnpm test`

**Command:** `pnpm test` (vitest run)  
**Date:** 2026-06-13  
**Result:**

```text
Test Files  18 passed (18)
Tests       329 passed (329)
Duration    ~8s
```

**Hotfix-relevant suites:**

| Suite | Tests | Result |
|-------|-------|--------|
| `server/quiz.query.test.ts` | 2 | ✅ PASS |
| `server/wave2.progression.test.ts` | 15 | ✅ PASS |
| `server/silver.certification.test.ts` | 5 | ✅ PASS |
| `server/demo.mode.test.ts` | 15 | ✅ PASS |
| `server/trpc.integration.test.ts` | 95 | ✅ PASS |

**Status:** ✅ PASS

---

## 9. Re-run: `pnpm build`

**Command:** `pnpm build` (Vite + esbuild)  
**Date:** 2026-06-13  
**Result:**

```text
vite build   ✓ built in ~12s
esbuild      dist/index.js  292.2kb — Done
Exit code    0
```

Non-blocking warnings only (analytics env placeholders, chunk size). No build failures.

**Status:** ✅ PASS

---

## 10. Risk notes (informational, non-blocking)

1. **`checkQuizPassed` is exported but no longer called from routers** — retained for potential certification/display use; not a regression.
2. **`getBestQuizAttempt` ordering fix** — previously returned last row of ascending sort (coincidentally highest); now explicitly `desc` + `limit(1)`. Correct behavior, slight latent bug fixed.
3. **Pre-existing commit artifact** — `RC12_WAVE2_HOTFIX_REPORT.md` included in commit; acceptable internal documentation, not forbidden scope.

None of the above block push.

---

## Checklist summary

| # | Requirement | Verdict |
|---|-------------|---------|
| 1 | Quiz no longer blocks scenario access | ✅ |
| 2 | `runs.start` no longer requires quiz pass | ✅ |
| 3 | Drizzle `orderBy` syntax correct | ✅ |
| 4 | Silver certification requires M1 quiz ≥ 60 | ✅ |
| 5 | M4 `teacherValidated` gate active | ✅ |
| 6 | Demo mode accessible | ✅ |
| 7 | Forbidden scope not touched | ✅ |
| 8 | `pnpm test` | ✅ 329/329 |
| 9 | `pnpm build` | ✅ PASS |

---

## Final verdict

# GO TO PUSH

The hotfix at `0554f2f` resolves the Wave 2 quiz regression without collateral damage to certification, M4 gating, demo mode, or out-of-scope subsystems. Independent test and build re-runs confirm production readiness.

---

*End of RC12 Wave 2 Hotfix Audit Report.*
