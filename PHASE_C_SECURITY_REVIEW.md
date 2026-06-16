# TEC.WMS RC13 — Phase C Security Review

**Branch:** `production-hotfix-rc13-pedagogy-class6`
**Reviewed commit:** `7c0e4a8fa30850fe0bae30fadbf1c4d3cb99f722`
**Review date:** 2026-06-15
**Reviewer:** Cursor Agent (automated static analysis + implementation audit)
**Review type:** Pre-commit security regression review

---

## Scope

This document records the security review performed against the Phase C implementation
(OAuth-to-local-auth default switch) prior to commit. The review covers authentication
regression, authorization enforcement, OAuth fallback behavior, session handling, routing
integrity, and unauthorized-access surfaces.

Related documents:

- `PHASE_C_IMPLEMENTATION_REPORT.md` — implementation record
- `PHASE_C_VALIDATION_REPORT.md` — functional validation record

---

## 1. Authentication Regression Review

### 1.1 Local authentication entrypoint

| Check | Finding | Risk |
|-------|---------|------|
| `getLoginUrl()` returns `/login` (string literal, no env dependency) | `client/src/const.ts` line 36: `export const getLoginUrl = () => LOCAL_LOGIN_PATH;` where `LOCAL_LOGIN_PATH = "/login"` | None |
| All unauthenticated redirects now target `/login` | `main.tsx`, `useAuth.ts`, `DashboardLayout.tsx`, `SlideViewer.tsx` — all call `getLoginUrl()` unchanged; value resolves to `/login` | None |
| `/login` form renders without any OAuth dependency | `LocalLogin.tsx` renders local email/password form unconditionally; OAuth button is gated separately | None |
| `auth.localLogin` and `auth.localRegister` unchanged | `server/routers.ts` lines 301–361 untouched | None |
| Session cookie creation on local login unchanged | `sdk.createSessionToken` path unmodified; cookie name, shape, and expiration unchanged | None |

**Finding:** No authentication regression introduced. Local login is confirmed as the new default entrypoint. All prior call sites of `getLoginUrl()` continue to operate correctly against the updated return value.

**Mitigation:** The change is additive. `getLoginUrl()` still returns a safe, local path string. No credential handling code was modified.

---

### 1.2 Session verification

| Check | Finding | Risk |
|-------|---------|------|
| `sdk.verifySession()` uses only `JWT_SECRET` | Lines 209–232 of `sdk.ts` — no OAuth HTTP call, no `OAUTH_SERVER_URL` dependency | None |
| Invalid/stale JWTs rejected cleanly | `JWSSignatureVerificationFailed` error caught in `createContext`; `user = null` returned; frontend redirects to `/login` | None |
| Valid local sessions remain valid without `OAUTH_SERVER_URL` | JWT is self-contained; verification is purely local | None |

**Finding:** Session verification is cryptographically independent of OAuth. No regression.

---

## 2. Teacher / Admin Authorization Review

| Check | Finding | Risk |
|-------|---------|------|
| `teacherProcedure` role guard unchanged | `server/routers.ts`: `ctx.user.role === "teacher" \|\| ctx.user.role === "admin"` — untouched | None |
| `adminProcedure` role guard unchanged | `server/_core/trpc.ts`: `role === "admin"` — untouched | None |
| Role is read from database, not from OAuth token | Role assigned at user creation/login; stored in DB; read via `db.getUserByOpenId` | None |
| `Home.tsx` teacher routing regression fixed | Line 33: `(user.role === "admin" \|\| user.role === "teacher") ? "/teacher" : "/student/scenarios"` — teacher now correctly routed (was admin-only before Phase C) | Fixed |
| `LocalLogin.tsx` routes teacher/admin to `/teacher` | Lines 45–46: `if (data.role === "teacher" \|\| data.role === "admin") { navigate("/teacher"); }` — untouched | None |
| Teacher dashboard `useAuth` still enforces authentication | `TeacherDashboard.tsx` uses `useAuth({ redirectOnUnauthenticated: true })`; redirect path is now `/login` | None |

**Finding:** Teacher/Admin authorization is database-role based and was not weakened. The routing fix in `Home.tsx` is a correctness improvement, not a security regression. A user claiming a teacher role without a matching database record would not pass `teacherProcedure` enforcement.

**Risk identified:** Teacher role routing was previously broken in `Home.tsx` (authenticated teacher was being routed as a student). Phase C corrected this. The fix is a security improvement.

**Mitigation:** Role enforcement remains exclusively server-side, enforced by tRPC procedure guards reading `ctx.user.role` from the database-verified session.

---

## 3. OAuth Fallback Review

### 3.1 OAuth route preservation

| Check | Finding | Risk |
|-------|---------|------|
| `registerOAuthRoutes(app)` call preserved | `server/_core/index.ts` line 38 — untouched | None |
| `/api/oauth/callback` route still registered | `server/_core/oauth.ts` — route preserved; only a 503 guard added at entry | None |
| `OAuthService`, `exchangeCodeForToken`, `getUserInfo`, `getUserInfoWithJwt` preserved | `server/_core/sdk.ts` — all OAuth methods retained; none removed | None |
| `getOAuthLoginUrl()` helper exported and functional | `client/src/const.ts` lines 10–28 — builds correct portal URL with `appId`, `redirectUri`, `state`, `type=signIn` | None |
| OAuth button appears on `/login` when env vars configured | `LocalLogin.tsx` line 230: `{oauthLoginUrl && ( <Button>Connexion institutionnelle</Button> )}` — conditional on non-null | None |

### 3.2 OAuth absent / misconfigured behavior

| Check | Finding | Risk |
|-------|---------|------|
| `getOAuthLoginUrl()` returns `null` when `VITE_OAUTH_PORTAL_URL` or `VITE_APP_ID` absent | `const.ts` lines 14–16: `if (!oauthPortalUrl \|\| !appId) { return null; }` | None |
| No `new URL(undefined)` or `new URL(null)` crash possible | Guard at line 14 prevents URL construction entirely when vars absent | None |
| `/api/oauth/callback` returns HTTP 503 when `OAUTH_SERVER_URL` absent | `oauth.ts` lines 14–17: `if (!process.env.OAUTH_SERVER_URL) { res.status(503).json({ error: "OAuth provider is not configured" }); return; }` — returns before any code/state parsing | Low |
| `OAuthService.getTokenByCode()` throws "OAuth provider is not configured" before any HTTP call | `ensureConfigured()` called at method entry | None |
| `OAuthService.getUserInfoByToken()` throws "OAuth provider is not configured" before any HTTP call | `ensureConfigured()` called at method entry | None |
| `SDKServer.getUserInfoWithJwt()` throws "OAuth provider is not configured" before any HTTP call | Explicit guard before payload construction | None |
| Missing-user path in local-only mode throws `ForbiddenError("User not found")` cleanly | `sdk.ts` lines 285–288: `if (!ENV.oAuthServerUrl) { throw ForbiddenError("User not found"); }` | None |

**Finding:** OAuth is fully preserved as an opt-in, configurable path. When unconfigured, all OAuth code paths fail fast and explicitly before attempting any network call or credential exchange. No OAuth credentials can be exposed or misused in a local-only deployment.

**Risk identified (Low):** A deployment with `OAUTH_SERVER_URL` absent but with a stale OAuth session cookie would previously attempt an OAuth HTTP call and log a confusing error. Phase C eliminates this by short-circuiting immediately with `ForbiddenError("User not found")`.

**Mitigation:** The fast-fail guards added in Phase C reduce the error surface. The explicit 503 on the callback route prevents silent failure.

---

## 4. Session Handling Review

| Check | Finding | Risk |
|-------|---------|------|
| Cookie name `COOKIE_NAME` unchanged | Constant not modified in any Phase C file | None |
| Cookie expiration `ONE_YEAR_MS` unchanged | Not modified | None |
| Cookie `httpOnly`, `secure`, `sameSite` flags unchanged | `sdk.ts` cookie-setting code not modified | None |
| Session token signing uses `JWT_SECRET` only | `createSessionToken` path unchanged | None |
| `auth.logout` clears the same cookie used by both local and OAuth flows | Logout handler not modified; single cookie name used | None |
| Local sessions and OAuth sessions share the same cookie mechanism | Unified `COOKIE_NAME`; `verifySession()` accepts tokens from both flows | None |
| `auth.me` returns `null` when unauthenticated — no crash | `publicProcedure` returning `ctx.user ?? null` — unchanged | None |

**Finding:** No session handling changes were made. The cookie mechanism, JWT signing, expiration, and security flags are identical to the pre-Phase-C state. No session-related security regression exists.

---

## 5. Routing Review

| Check | Finding | Risk |
|-------|---------|------|
| Unauthenticated `/student/scenarios` → `/login` (not OAuth portal) | Confirmed via server log and static analysis | None |
| Unauthenticated `/student/slides/:id` → `/login` | `SlideViewer.tsx` auth guard → `getLoginUrl()` = `/login` | None |
| Unauthenticated tRPC `UNAUTHORIZED` → `/login` | `main.tsx` line 21: `window.location.href = getLoginUrl()` | None |
| DashboardLayout sign-in button → `/login` | Line 73: `window.location.href = getLoginUrl()` | None |
| `/login` tab default is local email/password sign-in | `LocalLogin.tsx` renders "Sign In" tab as default | None |
| Home page student login → `/login` | `Home.tsx` `handleLogin` navigates to `/login` | None |
| Home page teacher login → `/login?role=teacher` | `Home.tsx` line 15 — unchanged | None |
| Password reset pages navigate back to `/login` | `ForgotPassword` and `ResetPassword` pages not modified | None |
| `/api/oauth/callback` route still accessible when OAuth configured | `registerOAuthRoutes(app)` preserved | None |

**Finding:** All routing is correct. No protected route was made publicly accessible. No redirect now bypasses `/login`. The transition from OAuth-portal-first to local-login-first is complete and consistent across all redirect call sites.

---

## 6. Unauthorized Access Review

| Check | Finding | Risk |
|-------|---------|------|
| Protected tRPC procedures still require valid session | `authenticatedProcedure`, `teacherProcedure`, `adminProcedure` — all unchanged | None |
| `authenticateRequest()` rejects missing/invalid cookie → `null` → `UNAUTHORIZED` | Path unchanged; fast-fail added only for the missing-user OAuth sync branch | None |
| No public route was accidentally protected | No route registration changes | None |
| No protected route was accidentally made public | No middleware changes | None |
| Admin endpoints still require `role === "admin"` | `adminProcedure` in `trpc.ts` — unchanged | None |
| Teacher endpoints still require `role === "teacher" \|\| "admin"` | `teacherProcedure` — unchanged | None |
| Student endpoints not affected | No `studentProcedure` changes | None |
| `/api/oauth/callback` with `OAUTH_SERVER_URL` absent returns HTTP 503 | 503 guard returns before any processing; no token exchange attempted | None |
| Forged OAuth state cannot be exploited in local-only mode | Callback returns 503 before state/code parsing begins | None |

**Finding:** No unauthorized access vectors were introduced. The attack surface is unchanged or reduced. The explicit 503 on the OAuth callback in local-only mode prevents a potential state-forgery attempt against an unconfigured OAuth endpoint.

---

## 7. Immutability Confirmation

The following systems were explicitly confirmed as **not modified** by Phase C:

| System | Status |
|--------|--------|
| Certification logic | ✅ Not modified — no changes to certification routes or schema |
| Scoring logic | ✅ Not modified — no changes to scoring endpoints in `server/routers.ts` |
| Scenario logic | ✅ Not modified — no scenario file changes |
| Database schema | ✅ Not modified — no migrations, no `db.ts` changes |
| Teacher dashboard (`TeacherDashboard.tsx`) | ✅ Not modified |
| tRPC procedure guards (`trpc.ts`) | ✅ Not modified |
| Session cookie mechanism | ✅ Not modified |
| OAuth callback route registration (`index.ts`) | ✅ Preserved |

---

## 8. Explicit Guarantees

The following guarantees are established by this review and must be maintained through commit:

1. **OAuth remains preserved.** The OAuth callback route (`/api/oauth/callback`), `OAuthService`, and all OAuth session logic are intact and functional when `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, and `VITE_APP_ID` are configured.

2. **Local auth is now the default entrypoint.** `getLoginUrl()` returns `"/login"` unconditionally. All unauthenticated redirects across the application target the local login page.

3. **Teacher/Admin role enforcement remains database-role based.** No role-checking logic was modified. Roles are verified server-side via `ctx.user.role` populated from the database, not from OAuth tokens or client-supplied claims.

4. **No certification logic was modified.** Certification endpoints and schema are untouched.

5. **No scoring logic was modified.** Scoring endpoints in `server/routers.ts` are untouched.

6. **No scenario logic was modified.** No scenario file, route, or data model was changed.

---

## 9. Risk Register

| ID | Risk | Severity | Status | Mitigation |
|----|------|----------|--------|-----------|
| R1 | OAuth-only deployments lose automatic redirect to portal | Low | Mitigated | `LocalLogin.tsx` renders the OAuth button automatically when both `VITE_OAUTH_PORTAL_URL` and `VITE_APP_ID` are set |
| R2 | Stale OAuth session cookie in local-only mode triggers confusing error | Low | Eliminated | `authenticateRequest` now throws `ForbiddenError("User not found")` immediately when `OAUTH_SERVER_URL` absent, before any OAuth HTTP call |
| R3 | `new URL(undefined)` browser exception | Low | Eliminated | `getOAuthLoginUrl()` null-guards both env vars before URL construction; returns `null` |
| R4 | Forged OAuth state/code against unconfigured callback | Low | Eliminated | `/api/oauth/callback` returns HTTP 503 before parsing `code` or `state` when `OAUTH_SERVER_URL` absent |
| R5 | Teacher role routing regression (pre-existing) | Medium | Fixed | `Home.tsx` line 33 now routes authenticated `teacher` role to `/teacher`; was previously bypassed (admin-only) |
| R6 | Scoring, certification, or scenario regression | None | N/A | Zero changes to those subsystems confirmed |

---

## 10. Commit Exclusion Notice

> **The following directory must be excluded from all future commits:**
>
> `.manus-logs/`
>
> All files under `.manus-logs/` are test artifacts, smoke run outputs, and local diagnostic data. They are not part of the application and must not be committed to the repository.
>
> **Critical warning:**
>
> `.manus-logs/wave4-smoke-runner.mjs` **contains test credentials and must never be committed.** This file should be added to `.gitignore` if not already excluded, and must be verified absent from the staging area before any `git add` or `git commit` operation is performed.

---

## Final Verdict

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              ✅  GO FOR COMMIT                             ║
║                                                            ║
║  Phase C security review returned no blocking findings.    ║
║  OAuth is preserved as a configurable opt-in path.         ║
║  Local auth is the default entrypoint — confirmed.         ║
║  Teacher/Admin authorization is database-role based.       ║
║  No certification, scoring, or scenario logic modified.    ║
║  Session handling is unchanged and correct.                ║
║  No unauthorized access vectors introduced.                ║
║  All identified risks are mitigated or eliminated.         ║
║                                                            ║
║  Exclude .manus-logs/ from commit. See Section 10.         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

### Commit checklist

Before executing `git add` and `git commit`, the committer must confirm:

- [ ] `.manus-logs/` is not staged (run `git status` and verify)
- [ ] `.manus-logs/wave4-smoke-runner.mjs` is not staged
- [ ] Only the six Phase C application files are staged:
  - `client/src/const.ts`
  - `client/src/pages/LocalLogin.tsx`
  - `client/src/pages/Home.tsx`
  - `server/_core/sdk.ts`
  - `server/_core/oauth.ts`
  - `README.md`
- [ ] Build passes (`exit code 0`) — confirmed in `PHASE_C_IMPLEMENTATION_REPORT.md`
- [ ] This document (`PHASE_C_SECURITY_REVIEW.md`) is included in the commit or retained as a review artifact per team policy
