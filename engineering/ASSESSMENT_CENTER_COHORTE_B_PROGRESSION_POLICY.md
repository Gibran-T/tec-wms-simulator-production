# Assessment Center — Cohorte B transitional progression policy

**Status:** Engineering decision (P0)  
**Scope:** Cohorte Été 2026 — Groupe B (`cohortId = 3`) only  
**Code:** `shared/assessmentCore.ts` → `computeM4UnlockStatus`, `progressionPolicyForCohort`

## Rule

| Student situation | Assessment role | Score ≥ 70 | M4 academic status |
|-------------------|-----------------|------------|--------------------|
| M1–M3 practical already complete (`module_progress.passed` for 1,2,3) | **Consolidative** | Pass or fail | Remains **unlocked** — never revoked |
| M1–M3 practical incomplete | **Competency validation** | Pass | `pending_practical` until professor evidence, then `unlocked` |
| M1–M3 practical incomplete | **Competency validation** | Fail | `locked` (unless previously unlocked — never downgraded) |

## Explicit non-goals

- Does **not** fabricate scenario completions
- Does **not** overwrite scenario run history
- Does **not** change learning open-access runtime for M1–M5
- Does **not** apply to future cohorts (they use `policy: "standard"`)

## Professor action

For incomplete students who score ≥ 70: record short supervised practical evidence via Assessment Center → unlock confirms full progression.
