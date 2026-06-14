# RC12 Wave 2 Hotfix Report — Quiz Gate Regression

**Date:** 2026-06-12  
**Branch:** `production-hotfix-rc13-pedagogy-class6`  
**Pedagogical rule:** Quiz is diagnostic / reinforcement / certification support — **must not block scenario access**

---

## 1. Root cause

### Primary: Drizzle orderBy API misuse

Wave 2 added `checkQuizPassed()` in `server/db.ts` with:

```typescript
.orderBy(quizAttempts.score.desc())
```

In this project's Drizzle setup, **`score.desc` is not a function**. When `runs.start` called `checkQuizPassed()` for eval students, the server threw:

```text
quizAttempts.score.desc is not a function
```

This blocked **all** eval scenario starts (e.g. `/student/module2/scenario/8/mode`) regardless of quiz completion.

The same pattern existed in `checkM1QuizPassed()` (Silver path) — latent production risk on certification checks.

### Secondary: Wave 2 P0-09 quiz gate

`runs.start` rejected students without quiz pass — contradicts the authoritative hotfix rule that the core learning path is Mission → Scenario, with quiz as non-blocking support.

### Module 4 loading

`Module4Dashboard` does **not** call `checkQuizPassed`. M4 hang on loading is tied to `scenarios.listByModule` / network (existing timeout/retry UI), **not** the quiz gate. Removing the throwing `runs.start` gate eliminates the scenario-start failure; M4 teacherValidated lock remains independent.

---

## 2. Files changed

| File | Change |
|------|--------|
| `server/db.ts` | Import `desc`; fix `orderBy(desc(quizAttempts.score))` in `checkQuizPassed`, `checkM1QuizPassed`, `getBestQuizAttempt`; fix `desc(scenarioRuns.completedAt)` |
| `server/routers.ts` | **Remove** quiz gate from `runs.start`; drop unused `checkQuizPassed` import |
| `client/src/pages/student/ScenarioList.tsx` | Remove client quiz lock on scenario cards; show **recommended** quiz banner (Silver note only) |
| `server/wave2.progression.test.ts` | Replace V2.6 “quiz blocks start” tests with hotfix contract tests |
| `server/quiz.query.test.ts` | **New** — assert Drizzle `desc()` usage; `checkQuizPassed` retained for cert display |

**Not changed:** Silver eligibility (`getSilverCertificationStatus`, `checkM1QuizPassed`), Gold, M4/M5 runtime, DB schema, `teacherValidated` M3→M4 gate.

---

## 3. Tests added / updated

| File | Tests |
|------|-------|
| `server/wave2.progression.test.ts` | Eval runs not blocked by quiz; demo teacher access; Silver quiz threshold 60 unchanged; teacherValidated tests retained |
| `server/quiz.query.test.ts` | No `.score.desc()` in db.ts; cert helpers still exported |

---

## 4. Test result

```text
Test Files  18 passed (18)
Tests       329 passed (329)
```

---

## 5. Build result

```text
pnpm build — PASS (Vite + esbuild)
```

---

## 6. Regression review

| Requirement | Status |
|-------------|--------|
| Students open scenario mode pages | ✅ No server throw on `runs.start` |
| Students start eval without quiz block | ✅ Quiz gate removed from `runs.start` |
| Demo mode accessible | ✅ Unchanged (`isDemo` teacher/admin only) |
| Silver certification unchanged | ✅ `checkM1QuizPassed` + `getSilverCertificationStatus` intact; query fixed |
| Quiz usable for status / cert | ✅ `getBestQuizAttempt`, quiz UI, CertificationsPage checklist |
| Quiz does not block SCN access | ✅ Server + ScenarioList locks removed |
| teacherValidated M4 lock | ✅ Independent gate in `runs.start` + Module4Dashboard |

---

## 7. Confirmation — quiz no longer blocks SCN

| Surface | Before | After |
|---------|--------|-------|
| `runs.start` (eval student) | `checkQuizPassed` → throw | **No quiz check** |
| `ScenarioList` cards | Locked until quiz pass | **Always startable**; quiz recommended banner |
| Silver cert | Quiz required | **Unchanged** (≥ 60 % M1 quiz) |
| M4 access | teacherValidated | **Unchanged** |

---

## 8. Verdict

**HOTFIX READY — quiz gate removed; Drizzle query fixed; 329/329 tests PASS.**

---

*End of RC12 Wave 2 Hotfix Report.*
