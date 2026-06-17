# TEC.WMS — RC13 Silver Certification Hotfix Report

**Type:** Implementation + validation  
**Repository:** `tec-wms-simulator-production`  
**Branch:** `production-hotfix-rc13-pedagogy-class6`  
**Reference commit:** `711c822fa3781fd155fc97be886975323332669d`  
**Date:** 2026-06-17  
**Executor:** Cursor Agent  

---

## Executive Summary

Implemented the minimal RC13 Silver Certification hotfix identified in `Documentation/RC13_SILVER_CERTIFICATION_RESOLUTION_AUDIT.md`. Silver eligibility logic was already correct; the gap was lazy persistence when Quiz M1 was the final missing requirement. `quiz.submit` now invokes the same unlock evaluation as `profiles.silverStatus` and `warehouse.recordModulePass(M1)`.

**Verdict:** Safe to commit after review. No schema, auth, Gold, M4/M5, or scoring changes.

---

## Files Changed

| File | Change |
|------|--------|
| `server/routers.ts` | Added Silver unlock evaluation at end of `quiz.submit` when `moduleId === 1` |
| `server/silver.certification.test.ts` | Added RC13 hotfix contract tests, gate matrix tests, UI display contract tests |
| `Documentation/RC13_SILVER_CERTIFICATION_HOTFIX_REPORT.md` | This report |

**Not changed (per scope):** `drizzle/schema.ts`, migrations, auth, `goldCertification.ts`, M4/M5 logic, scenario scoring, client UI components.

---

## Exact Behavior Before

1. **Eligibility:** `getSilverCertificationStatus()` correctly computed `silverEligible` from four gates (Quiz M1 ≥ 60 %, SCN-001…005 eval runs ≥ 60, compliance on all canonical SCNs, no unresolved blockers). Demo runs excluded via `isDemo = false`.

2. **Persistence triggers:** `profiles.silverCertified = true` was written only when:
   - `profiles.silverStatus` was queried and `silverEligible && !silverCertified`, or
   - `warehouse.recordModulePass` ran for `moduleId === 1` with all gates true.

3. **Gap:** `quiz.submit` saved the attempt and returned score/feedback but **did not** call `unlockSilverCertification`. A student who completed all SCN work first and passed Quiz M1 last could remain eligible indefinitely without the persisted flag.

4. **UI:** Certifications page showed **Obtenue / Obtained** only when `silverStatus.silverCertified === true`. **Continue pathway** button rendered when `!silverEarned` (routes to `/student/quiz/1`). Eligible-but-not-persisted students saw **Éligible** and the Continue button until visiting Certifications (which triggered `silverStatus` unlock).

---

## Exact Behavior After

1. **`quiz.submit` (moduleId === 1):** After `saveQuizAttempt`, the handler calls `getSilverCertificationStatus(ctx.user.id)`. If `status.silverEligible && !status.silverCertified`, it calls `unlockSilverCertification(ctx.user.id)` — identical guard to `profiles.silverStatus`.

```typescript
// server/routers.ts — quiz.submit (after saveQuizAttempt)
if (input.moduleId === 1) {
  const status = await getSilverCertificationStatus(ctx.user.id);
  if (status.silverEligible && !status.silverCertified) {
    await unlockSilverCertification(ctx.user.id);
  }
}
```

2. **Quiz-last path:** Student who passes Quiz M1 as the final gate is persisted as Silver Certified immediately on submit, without requiring a Certifications page visit or Run Report `recordModulePass`.

3. **No unlock when gates fail:** Failed quiz, missing SCN, below-threshold latest eval run, missing compliance, or unresolved blockers keep `silverEligible` false; no persistence write occurs.

4. **No revocation:** `unlockSilverCertification` only sets `silverCertified: true`. The `!status.silverCertified` guard prevents redundant writes; existing Silver is never cleared by this path.

5. **Gold unchanged:** `quiz.submit` does not reference `getGoldCertificationStatus` or `unlockGoldCertification`. Gold unlock remains on `recordModulePass(M5)` and `profiles.goldStatus` only.

6. **UI (unchanged code, validated assumption):**
   - `profiles.silverCertified = true` → `resolveSilverState` returns `obtenue` → **Obtenue / Obtained** chip and congratulations banner on Certifications page.
   - `silverEarned === true` → **Continue pathway** button hidden; **View my Silver certificate** shown instead.

---

## Tests Run

| Command | Result |
|---------|--------|
| `npx vitest run server/silver.certification.test.ts server/gold.certification.test.ts` | **39 passed** (18 Silver + 21 Gold) |
| `npx vitest run` (full suite) | **418 passed** (20 files) |
| `npm run build` | **Success** (vite + esbuild) |

### New / updated test coverage (`server/silver.certification.test.ts`)

| Test | Proves |
|------|--------|
| `quiz.submit evaluates Silver unlock after M1 quiz save` | Hotfix wired in `routers.ts` |
| `student becomes Silver eligible when Quiz M1 is the final gate` | Quiz-last eligibility matrix |
| `student does not become Silver eligible when any SCN-001..005 is missing` | Per-SCN gate enforcement |
| `student does not become Silver eligible when any latest eval run is below threshold` | Score floor gate |
| `student does not become Silver eligible without compliance` | Compliance gate |
| `student does not become Silver eligible with unresolved blockers` | Blocker gate |
| `demo runs do not count toward Silver` | `isDemo=false` contract |
| `unlockSilverCertification only sets silverCertified=true` | No revocation path |
| `existing Silver is not re-evaluated for revocation in quiz.submit unlock guard` | `!status.silverCertified` guard |
| `Gold logic is unaffected by quiz.submit M1 unlock` | No Gold calls in quiz path |
| `profiles.silverCertified=true renders Obtenue / Obtained state` | UI state machine |
| `silverEarned hides Continue pathway button contract` | Continue button hidden when earned |
| `eligible-but-not-persisted shows Eligible until silverCertified is set` | Pre-unlock UI state |

`server/gold.certification.test.ts` — all 21 existing tests pass (Gold regression shield).

---

## Risk Assessment

| Risk | Likelihood | Severity | Mitigation in this hotfix |
|------|------------|----------|---------------------------|
| Quiz-last eligible students never awarded | **Was High** | Medium | **Resolved** — unlock on `quiz.submit` |
| Over-award (persist without eligibility) | Low | Low | Same `getSilverCertificationStatus` gate as existing unlock paths |
| Accidental Silver revocation | None | N/A | `unlockSilverCertification` is write-true only; guard skips if already certified |
| Gold regression | Very Low | Medium | No Gold code in quiz path; full Gold test suite green |
| Performance on quiz submit | Low | Low | One extra status query + optional single-row profile update; same cost as `silverStatus` |
| Stale OIL panel after unlock | Low | Low | Pre-existing; out of scope (P1 in audit) |
| Continue button misroutes eligible students | Low | Low | Pre-existing P1 item; Silver earned path already hides button |

**Overall risk:** **Low.** Change is ~7 lines, mirrors an established pattern, and is covered by 418 passing tests.

---

## Commit Recommendation

**Recommended: YES** — after human review of the diff.

Suggested commit message:

```
fix(rc13): persist Silver certification on Quiz M1 submit

Close lazy-unlock gap when Quiz M1 is the final Silver gate by
evaluating getSilverCertificationStatus in quiz.submit, matching
profiles.silverStatus and recordModulePass behavior.
```

**Do not commit** until explicitly instructed (per RC13 executor brief).

---

## References

- Audit: `Documentation/RC13_SILVER_CERTIFICATION_RESOLUTION_AUDIT.md`
- Unlock helper: `server/db.ts` — `getSilverCertificationStatus`, `unlockSilverCertification`
- Existing unlock paths: `server/routers.ts` — `profiles.silverStatus`, `warehouse.recordModulePass`
- UI: `client/src/pages/student/CertificationsPage.tsx`, `client/src/components/certification/CertificationStatus.tsx`
