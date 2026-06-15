# TEC.WMS RC13 — Phase A + Phase B Implementation Report

## Source Of Truth

- Branch: `production-hotfix-rc13-pedagogy-class6`
- Commit (baseline): `12aa9439dfeba18952348efaf215ae39b397edcf`
- Inputs:
  - `MANUS_INDEPENDENCE_IMPLEMENTATION_BLUEPRINT.md`
  - `LOCAL_AUTH_IMPLEMENTATION_AUDIT.md`

## Scope Delivered

This change implements **ONLY** the first two phases of the Manus-independence blueprint:

- **Phase A — Local Admin Bootstrap**
- **Phase B — Local Teacher Bootstrap**

Phases C–F (OAuth redirect removal, Railway readiness, staging validation, production
cutover) are explicitly **out of scope** and were not touched.

## Requirements Compliance

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| 1 | Preserve existing OAuth path | ✅ | No edits to `server/_core/oauth.ts`, `server/_core/sdk.ts`, `server/_core/env.ts`, `server/_core/index.ts`, or `client/src/const.ts`. OAuth route mounting untouched. |
| 2 | Add local bootstrap capability | ✅ | New `scripts/bootstrap-local-auth.mjs` + 4 npm scripts. |
| 3 | No Railway work yet | ✅ | `RAILWAY_DEPLOYMENT_RUNBOOK.md` not modified. |
| 4 | No OAuth removal yet | ✅ | OAuth code paths and env vars left intact. |
| 5 | Backward compatible | ✅ | Existing `scripts/seed-accounts.mjs` defaults unchanged when env unset; OAuth login still works. |
| 6 | Build must pass | ✅ | `vite build` exit 0, `esbuild` server bundle exit 0 (see Build Evidence). |
| 7 | Create implementation report | ✅ | This document. |

## Changes

### 1. `scripts/bootstrap-local-auth.mjs` (new — primary deliverable)

A dedicated, secure, **idempotent** bootstrap utility that guarantees at least one
valid local admin (Phase A) and one valid local teacher (Phase B) account exist,
authenticating independently of Manus OAuth.

Key properties (directly addressing blueprint risks):

- **Secure credential input** — passwords are read from environment variables
  (`BOOTSTRAP_ADMIN_PASSWORD`, `BOOTSTRAP_TEACHER_PASSWORD`), never hardcoded. If a
  password is not supplied, a cryptographically strong password is generated and
  printed **once** with an explicit "store it now" warning. Provided passwords are
  masked in logs.
- **Idempotent** — upsert keyed on `email`: existing accounts are updated
  (`passwordHash`, `role`, `loginMethod='local'`, `isActive=1`, `name`); missing
  accounts are inserted with `openId = local:<email>`. Re-running is safe and never
  creates duplicates.
- **Correct account shape** — every bootstrapped account is written with
  `loginMethod='local'`, a non-null `passwordHash`, the correct `role`
  (`admin` / `teacher`), and `isActive=1`.
- **Built-in verification gate (Gate 1)** — after writing, the script asserts that at
  least one valid local account exists per requested role
  (`role + loginMethod='local' + passwordHash IS NOT NULL + isActive=1`) and exits
  non-zero (code `2`) if the gate fails, blocking progression to the next phase.
- **Phase isolation** — `--admin-only` (Phase A), `--teacher-only` (Phase B),
  `--verify-only` (read-only gate check), or both phases by default.
- **bcrypt cost** — configurable via `BOOTSTRAP_BCRYPT_ROUNDS` (default `12`, stronger
  than the app default of 10 for privileged accounts; `bcrypt.compare` remains
  compatible with both).

Usage:

```bash
node scripts/bootstrap-local-auth.mjs                # Phase A + Phase B
node scripts/bootstrap-local-auth.mjs --admin-only   # Phase A only
node scripts/bootstrap-local-auth.mjs --teacher-only # Phase B only
node scripts/bootstrap-local-auth.mjs --verify-only  # Gate check, no writes
```

Environment variables:

| Variable | Default | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | — (required) | MySQL connection string for target env |
| `BOOTSTRAP_ADMIN_EMAIL` | `admin@teclog.ca` | Admin account email |
| `BOOTSTRAP_ADMIN_PASSWORD` | generated | Admin password (secure input) |
| `BOOTSTRAP_ADMIN_NAME` | `Admin TEC.LOG` | Admin display name |
| `BOOTSTRAP_TEACHER_EMAIL` | `prof@teclog.ca` | Teacher account email |
| `BOOTSTRAP_TEACHER_PASSWORD` | generated | Teacher password (secure input) |
| `BOOTSTRAP_TEACHER_NAME` | `Professeur Demo` | Teacher display name |
| `BOOTSTRAP_BCRYPT_ROUNDS` | `12` | bcrypt cost factor |

### 2. `package.json` (npm scripts — additive)

Added convenience scripts (no existing scripts changed):

- `bootstrap:local` → both phases
- `bootstrap:admin` → Phase A only
- `bootstrap:teacher` → Phase B only
- `bootstrap:verify` → verification gate only

### 3. `scripts/seed-accounts.mjs` (hardened — backward compatible)

The demo seeder previously hardcoded the privileged admin/teacher passwords. It now
reads `BOOTSTRAP_ADMIN_PASSWORD` / `BOOTSTRAP_TEACHER_PASSWORD` from the environment
when present, falling back to the original demo defaults when unset. Summary output
no longer prints the real password when an override is supplied. Student demo
accounts and all other behavior are unchanged.

## Schema Alignment

The bootstrap writes to the existing `users` table (`drizzle/schema.ts`) with no
schema change required. Relevant columns already present:

- `openId` (unique, not null) — set to `local:<email>`
- `email`, `name`
- `loginMethod` — set to `local`
- `passwordHash` — bcrypt hash (non-null)
- `role` — enum `user|admin|student|teacher`
- `isActive` (not null, default true) — set to `1`

The local login path (`trpc.auth.localLogin` in `server/routers.ts`) validates against
exactly these fields (`passwordHash` + `bcrypt.compare`), so bootstrapped accounts log
in through the existing local flow with no further wiring.

## Build Evidence

Official build script: `vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist`

Executed as two steps (PowerShell does not support `&&`):

```text
# Step 1 — vite build
vite v7.3.3 building client environment for production...
✓ 2466 modules transformed.
../dist/public/index.html                   368.23 kB │ gzip: 105.75 kB
../dist/public/assets/index-DJ5kb6fS.css    194.80 kB │ gzip:  29.02 kB
../dist/public/assets/index-S4GAG5x9.js   2,697.29 kB │ gzip: 584.17 kB
✓ built in 11.14s
Exit code: 0

# Step 2 — esbuild server bundle
  dist\index.js  346.7kb
Done
Exit code: 0
```

Script syntax validation:

```text
node --check scripts/bootstrap-local-auth.mjs   # OK
node --check scripts/seed-accounts.mjs          # OK
```

### Note on `tsc --noEmit`

The separate `npm run check` (`tsc --noEmit`) reports numerous **pre-existing** type
errors in application source (`server/rulesEngine.ts`, `server/routers.ts`,
`client/src/pages/student/*`, etc.). These are **not** introduced by this change:

- The Phase A/B deliverables are `.mjs` scripts, which are not part of the TypeScript
  program, plus a `package.json` config edit.
- None of the reported `tsc` diagnostics reference any file modified in this change.
- The production `build` pipeline uses Vite/esbuild (transpile-only, no type-gate) and
  completes successfully.

The pre-existing `tsc` debt is therefore tracked separately and does not affect Phase
A/B acceptance ("Build must pass" = the `build` script, which passes).

## Verification Procedure (operator)

Against a target environment with a valid `DATABASE_URL`:

```bash
# Phase A + B bootstrap (supply secure passwords via env)
$env:BOOTSTRAP_ADMIN_PASSWORD="<strong-admin-pw>"
$env:BOOTSTRAP_TEACHER_PASSWORD="<strong-teacher-pw>"
node scripts/bootstrap-local-auth.mjs

# Independent gate re-check (read-only)
node scripts/bootstrap-local-auth.mjs --verify-only
```

Equivalent SQL gate (Gate 1 from the blueprint):

```sql
SELECT role, COUNT(*) AS valid_local
FROM users
WHERE loginMethod = 'local' AND passwordHash IS NOT NULL AND isActive = 1
  AND role IN ('admin','teacher')
GROUP BY role;
-- Expect: admin >= 1 AND teacher >= 1
```

Expected exit codes: `0` = bootstrap + gate passed; `2` = gate failed (block next
phase); `1` = configuration/connection error.

## Risk Assessment

| Risk (from blueprint) | Severity | Mitigation in this change | Residual |
|-----------------------|----------|---------------------------|----------|
| Insecure handling of bootstrap credentials | High | Passwords sourced from env; generated secrets shown once; provided secrets masked in logs; no plaintext persisted. | Low — operator must capture generated password / set strong env value. |
| Non-idempotent bootstrap creating duplicates | High | Upsert keyed on `email`; `openId` deterministic (`local:<email>`); safe re-run. | Low |
| Admin created with wrong `loginMethod` / missing `passwordHash` | High | Every write forces `loginMethod='local'` + non-null bcrypt `passwordHash`; verified by Gate 1. | Low |
| Teacher lacks dashboard access via wrong role | Medium | Role hardcoded to `teacher`; teacher area allows `teacher`/`admin` (verified in audit). | Low |
| Duplicate-email conflicts with existing users | Medium | Email-keyed update path reuses existing row instead of inserting. | Low |
| Partial bootstrap (account without valid password) | Medium | Hash computed before write; verification gate fails build if any role invalid. | Low |
| Regression to OAuth path | Medium | No OAuth files modified; OAuth env vars and routes intact; change is additive. | Low |
| Privileged passwords hardcoded in `seed-accounts.mjs` | Medium | Env override added; defaults retained only for local/dev backward compatibility. | Low — avoid running raw demo seeder in shared envs. |

### Rollback

- **Bootstrap script is the rollback tool.** Re-run in corrective/idempotent mode to
  restore intended admin/teacher state, or run `--verify-only` to confirm gate status.
- To correct a specific account, set the appropriate `BOOTSTRAP_*` env vars and re-run
  the relevant `--admin-only` / `--teacher-only` phase.
- Code rollback is a clean `git revert` of this commit: it removes the new script,
  the npm scripts, and the `seed-accounts.mjs` env-override (restoring hardcoded
  defaults). No schema or OAuth changes to unwind.
- If DB-level corruption is suspected, restore the pre-bootstrap snapshot (operational
  step, outside this change).

## Gate 1 Readiness (blueprint exit criterion for Phase A→B→C)

> Local admin + teacher verified with local login and correct roles.

This change provides the **mechanism** and an automated **assertion** for Gate 1. Gate
1 is satisfied once an operator runs the bootstrap against the target database and
`--verify-only` returns exit code `0`. No code path required for Phase C has been
altered, preserving a clean boundary for the next phase.

## Out Of Scope (unchanged)

- OAuth redirect removal (Phase C): `client/src/main.tsx`, `client/src/_core/hooks/useAuth.ts`, `client/src/components/DashboardLayout.tsx`, `client/src/pages/SlideViewer.tsx`, `client/src/pages/Home.tsx`, `client/src/const.ts`.
- Server OAuth runtime: `server/_core/oauth.ts`, `server/_core/index.ts`, `server/_core/env.ts`, `server/_core/sdk.ts`.
- Railway readiness / runbook (Phase D), staging (Phase E), production cutover (Phase F).
