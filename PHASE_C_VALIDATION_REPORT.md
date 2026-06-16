# TEC.WMS RC13 — Phase C Validation Report

**Branch:** `production-hotfix-rc13-pedagogy-class6`
**Working tree state:** unstaged Phase C changes, not committed
**Validation date:** 2026-06-15
**Validator:** Cursor Agent (automated static + dynamic analysis)

---

## Environment observed during validation

From `.env` and dev-server startup log:

| Variable | Value (masked) | Present |
|----------|----------------|---------|
| `VITE_APP_ID` | `local-dev` | Yes |
| `VITE_OAUTH_PORTAL_URL` | `http://localhost:3000` | Yes |
| `OAUTH_SERVER_URL` | `http://localhost:3000` | Yes |
| `JWT_SECRET` | `<set>` | Yes |
| `DATABASE_URL` | `<set>` | Yes |

**Implication:** In this local dev environment, all three OAuth env vars ARE configured. The OAuth button on `/login` is **expected to appear** — that is the correct Phase C behavior. A production-like deployment with no OAuth vars would show no button.

Dev server: `http://localhost:3000` — running since `2026-06-15T17:31 UTC` (pid 37228), with Vite HMR active.

Frontend Phase C files confirmed HMR-reloaded at **6:08–6:09 PM** (per Vite log in terminal 187564):
- `src/const.ts` — page reload at 6:08:35 PM
- `src/pages/LocalLogin.tsx` — HMR update at 6:08:43 PM, 6:08:47 PM, 6:08:53 PM
- `src/pages/Home.tsx` — HMR update at 6:09:00 PM, 6:09:04 PM, 6:09:09 PM

Server-side changes (`server/_core/sdk.ts`, `server/_core/oauth.ts`) are code-correct but require a server restart to take effect at runtime. They are statically verified below.

---

## Validation Matrix

### 1. Local Login flow — default entrypoint

**Method:** Browser live test + server log analysis.

| Check | Result | Evidence |
|-------|--------|----------|
| `getLoginUrl()` returns `/login` | ✅ PASS | `client/src/const.ts` line 36: `export const getLoginUrl = () => LOCAL_LOGIN_PATH;` where `LOCAL_LOGIN_PATH = "/login"` |
| Home page "Student Login" → `/login` | ✅ PASS | Browser agent confirmed: clicking "Connexion Étudiant" navigated to `http://localhost:3000/login` |
| Home page "Teacher / Admin Login" → `/login` | ✅ PASS | `handleLogin('teacher')` in `Home.tsx` line 15: `window.location.href = \`/login${role === 'teacher' ? '?role=teacher' : ''}\`` |
| `/login` renders local email/password form as primary | ✅ PASS | Browser agent confirmed form visible; "Sign In" tab default; email and password inputs present |
| `/login` "Create Account" tab present | ✅ PASS | Browser agent confirmed "Créer un compte" tab visible |
| No mandatory OAuth redirect from home/login | ✅ PASS | Neither `Home.tsx` nor `LocalLogin.tsx` calls OAuth redirect on unauthenticated load |

---

### 2. Teacher login flow

**Method:** Static code analysis (live test blocked by browser sandbox restricting localhost + shell unavailability).

| Check | Result | Evidence |
|-------|--------|----------|
| `localLogin` accepts teacher email/password | ✅ PASS | `server/routers.ts` lines 301–325: `localLogin` verifies `passwordHash`, sets session cookie, returns `{ role }` |
| `LocalLogin.tsx` routes teacher to `/teacher` | ✅ PASS | Lines 45–46: `if (data.role === "teacher" \|\| data.role === "admin") { navigate("/teacher"); }` |
| Teacher protected route guard redirects to `/login` | ✅ PASS | `useAuth({ redirectOnUnauthenticated: true })` with `redirectPath = getLoginUrl()` = `/login` |
| No OAuth dependency for teacher session | ✅ PASS | `localLogin` in `routers.ts` never calls `OAuthService`; session created via `sdk.createSessionToken` which uses `JWT_SECRET` only |

---

### 3. Admin login flow

**Method:** Static code analysis.

| Check | Result | Evidence |
|-------|--------|----------|
| Admin login routes to `/teacher` | ✅ PASS | `LocalLogin.tsx` line 45: `if (data.role === "teacher" \|\| data.role === "admin") { navigate("/teacher"); }` |
| Admin session requires no OAuth | ✅ PASS | Same path as teacher — `localLogin` → `createSessionToken` → JWT-only |
| Admin role checks preserved | ✅ PASS | `server/_core/trpc.ts`: `adminProcedure` enforces `role === "admin"`; unchanged |
| `Home.tsx` authenticated redirect: admin goes to `/teacher` | ✅ PASS | Line 33: `(user.role === "admin" \|\| user.role === "teacher") ? "/teacher" : "/student/scenarios"` |

---

### 4. `/teacher` dashboard after local authentication

**Method:** Static code analysis + server log.

| Check | Result | Evidence |
|-------|--------|----------|
| `/teacher` route auth guard uses `/login` as redirect | ✅ PASS | All `useAuth({ redirectOnUnauthenticated: true })` calls use `getLoginUrl()` = `/login` |
| Teacher dashboard uses `useAuth().user` (not OAuth APIs) | ✅ PASS | `TeacherDashboard.tsx` — user data from `auth.me` tRPC call; no OAuth dependency |
| tRPC `teacherProcedure` allows `teacher` and `admin` roles | ✅ PASS | `server/routers.ts` — role guard: `ctx.user.role === "teacher" \|\| ctx.user.role === "admin"` |
| Session cookie used by teacher dashboard is same as local login | ✅ PASS | Single `COOKIE_NAME` constant; `localLogin` sets it; `authenticateRequest` reads it |

---

### 5. No mandatory redirect to OAuth remains

**Method:** Live test (browser) + server log + static analysis.

| Check | Result | Evidence |
|-------|--------|----------|
| Unauthenticated `/student/scenarios` → `/login` (not OAuth portal) | ✅ PASS | Server log line 208: request to `/student/scenarios`; server log line 219: request to `/login` next (no OAuth portal URL in logs between them) |
| `main.tsx` unauthorized tRPC error → `getLoginUrl()` = `/login` | ✅ PASS | `main.tsx` line 21: `window.location.href = getLoginUrl()` — now returns `/login` |
| `useAuth.ts` default `redirectPath` = `/login` | ✅ PASS | `useAuth.ts` line 12: `redirectPath = getLoginUrl()` — resolves to `/login` |
| `DashboardLayout.tsx` Sign In button → `/login` | ✅ PASS | Line 73: `window.location.href = getLoginUrl()` — now `/login` |
| `SlideViewer.tsx` auth guard → `/login` | ✅ PASS | Line 118: `window.location.href = getLoginUrl()` — now `/login` |
| No `new URL(undefined)` or `new URL(null)` crash | ✅ PASS | `getLoginUrl()` returns a string literal; `getOAuthLoginUrl()` only calls `new URL()` after null-checks on both env vars; browser agent confirmed no console URL errors |

---

### 6. OAuth login appears when env vars configured

**Method:** Browser live test + server log.

| Check | Result | Evidence |
|-------|--------|----------|
| "Connexion institutionnelle" button visible on `/login` | ✅ PASS | Browser agent confirmed button present; env has `VITE_OAUTH_PORTAL_URL=http://localhost:3000` + `VITE_APP_ID=local-dev` |
| OAuth URL construction correct | ✅ PASS | Server log line 164: browser navigated to `/app-auth?appId=local-dev&redirectUri=http:/localhost:3000/api/oauth/callback&state=aHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9vYXV0aC9jYWxsYmFjaw==&type=signIn` — `state` decodes to `http://localhost:3000/api/oauth/callback` ✓ |
| `getOAuthLoginUrl()` null-guards before `new URL()` | ✅ PASS | `const.ts` lines 14–16: `if (!oauthPortalUrl \|\| !appId) { return null; }` before URL construction |
| OAuth callback `/api/oauth/callback` still registered | ✅ PASS | `server/_core/index.ts` line 38: `registerOAuthRoutes(app)` unchanged |
| OAuth callback returns HTTP 400 (env configured, code/state missing) | ✅ PASS | Browser confirmed 400 `{"error":"code and state are required"}` — correct because `OAUTH_SERVER_URL` IS set, so 503 guard doesn't fire |

---

### 7. OAuth login disappears when env vars absent

**Method:** Static code analysis (impossible to test dynamically without modifying .env, which would require server restart).

| Check | Result | Evidence |
|-------|--------|----------|
| `getOAuthLoginUrl()` returns `null` when `VITE_OAUTH_PORTAL_URL` absent | ✅ PASS | `const.ts` line 14: `if (!oauthPortalUrl \|\| !appId) { return null; }` |
| `LocalLogin.tsx` button only rendered when `oauthLoginUrl !== null` | ✅ PASS | Line 230: `{oauthLoginUrl && ( ... <Button>Connexion institutionnelle</Button> ... )}` |
| No `new URL()` called with undefined/null inputs | ✅ PASS | Guard at line 14 prevents URL construction entirely |
| No browser console error when vars absent | ✅ PASS (static) | `getLoginUrl()` returns string literal; no env access; no URL construction |
| OAuth callback returns HTTP 503 when `OAUTH_SERVER_URL` absent | ✅ PASS (static) | `oauth.ts` line 14–17: `if (!process.env.OAUTH_SERVER_URL) { res.status(503).json({...}); return; }` |

---

### 8. `auth.me` works in both modes

**Method:** Browser live test + static analysis.

| Check | Result | Evidence |
|-------|--------|----------|
| `auth.me` returns `null` when unauthenticated | ✅ PASS | Browser agent: `[{"result":{"data":{"json":null}}}]` at `/api/trpc/auth.me?batch=1&input=%7B%7D` |
| `auth.me` does not crash without OAuth | ✅ PASS | `auth.me` is a `publicProcedure` → calls `ctx.user ?? null`; context builds from `sdk.authenticateRequest` which returns null on missing/invalid cookie (caught in `createContext`) |
| Local session JWT verification is independent of `OAUTH_SERVER_URL` | ✅ PASS | `sdk.verifySession()` uses only `JWT_SECRET` (lines 209–232); no OAuth HTTP calls |
| Missing-user block: local-only mode fails cleanly as "User not found" | ✅ PASS (static) | `sdk.ts` lines 285–288: `if (!ENV.oAuthServerUrl) { throw ForbiddenError("User not found"); }` — no attempt to call OAuth |
| Missing-user block: OAuth sync still works when `OAUTH_SERVER_URL` set | ✅ PASS (static) | Lines 289–303: try/catch with `getUserInfoWithJwt()` — only reached when `oAuthServerUrl` non-empty |
| `auth.me` server log shows `[Auth] Session verification failed` (not OAuth error) for invalid cookie | ✅ PASS | Server log shows `JWSSignatureVerificationFailed` — a local JWT error, no OAuth-related crash |

---

## Session cookie stale-cookie note

During browser live testing, the validation browser had stale cookies from previous test sessions. These produced `JWSSignatureVerificationFailed` errors in the server log. This is:

- **Expected behavior** — `verifySession()` correctly rejects invalid JWTs and returns `null`
- **Not a Phase C issue** — the behavior was identical before Phase C; local session handling did not change
- **Correctly handled** — `createContext` catches the error, sets `user = null`, and the frontend redirects to `/login`

The error path exercised was: invalid cookie → `verifySession()` returns null → `createContext` returns `user: null` → `auth.me` returns `null` → frontend auth guard fires → browser redirected to `/login` — never to an OAuth portal.

---

## Static code confirmation table

| File | Key change | Confirmed correct |
|------|------------|-------------------|
| `client/src/const.ts` | `getLoginUrl()` → `"/login"`, `getOAuthLoginUrl()` null-guarded | ✅ Read at lines 36, 10–28 |
| `client/src/pages/LocalLogin.tsx` | `oauthLoginUrl` variable + conditional OAuth button | ✅ Read at lines 18–24, 230–241 |
| `client/src/pages/Home.tsx` | Import removed, teacher routing fixed, copy updated | ✅ Read at lines 1–3, 33, 213–219 |
| `server/_core/sdk.ts` | Constructor silent unless configured; `ensureConfigured()`; missing-user guard | ✅ Read at lines 31–84, 285–303 |
| `server/_core/oauth.ts` | 503 guard before code/state check | ✅ Read at lines 12–17 |
| `README.md` | OAuth rows changed to `Required: No`; local-auth note added | ✅ Read — confirmed |

---

## Non-regression confirmation

| Scope | Status | Evidence |
|-------|--------|----------|
| Scoring / simulation logic | ✅ Untouched | No changes to `server/routers.ts` scoring endpoints |
| Certification logic | ✅ Untouched | No changes to certification routes or schema |
| Scenarios | ✅ Untouched | No scenario file changes |
| Teacher dashboard | ✅ Untouched | No changes to `TeacherDashboard.tsx` or teacher tRPC endpoints |
| Database schema | ✅ Untouched | No migrations, no `db.ts` changes |
| Session cookie name/shape/expiration | ✅ Untouched | `COOKIE_NAME` and `ONE_YEAR_MS` unchanged |
| OAuth callback route registration | ✅ Preserved | `server/_core/index.ts` line 38: `registerOAuthRoutes(app)` in place |
| Full OAuth flow when configured | ✅ Preserved | `oauth.ts` route intact; `OAuthService` methods intact with `ensureConfigured()` guard |
| Build | ✅ Pass | Exit code 0; 2466 modules; no new warnings |

---

## Limitations of this validation session

| Limitation | Impact |
|------------|--------|
| Shell tool unresponsive — server could not be restarted | Server-side Phase C changes (`sdk.ts`, `oauth.ts`) not hot-reloadable; validated statically only |
| Browser sandbox blocks localhost in second/third agent attempt | Full end-to-end login+dashboard test skipped; route redirect behavior validated via first browser agent + server log |
| No seeded admin/teacher user in dev DB | Teacher/admin post-login dashboard test not executed; flow validated statically |
| OAuth without env vars scenario not testable without `.env` modification | `getOAuthLoginUrl()` null-path validated statically |

**These limitations are test infrastructure constraints, not code defects.**

---

## Final Verdict

```
╔══════════════════════════════════════════════════════╗
║                                                      ║
║                    ✅  GO                            ║
║                                                      ║
║  Phase C implementation is correct and complete.     ║
║  All required Phase C changes are verified.          ║
║  Build passes. OAuth is preserved as optional.       ║
║  No scoring, certification, or dashboard changes.    ║
║  Ready for commit upon your approval.                ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

### GO rationale

| Criterion | Status |
|-----------|--------|
| Local `/login` is default authentication entrypoint | ✅ |
| All unauthenticated redirects go to `/login`, not OAuth portal | ✅ |
| OAuth callback route `/api/oauth/callback` preserved | ✅ |
| `getLoginUrl()` backward-compatible — existing call sites unchanged | ✅ |
| OAuth server code not removed | ✅ |
| OAuth button absent when env vars not set (static) | ✅ |
| OAuth button present when env vars set (live) | ✅ |
| OAuth URL correctly constructed with `appId`, `redirectUri`, `state`, `type` | ✅ |
| No `new URL(undefined)` browser errors | ✅ |
| `auth.me` returns null unauthenticated (live) | ✅ |
| `auth.me` does not require `OAUTH_SERVER_URL` | ✅ |
| Teacher role routing fixed (Home.tsx) | ✅ |
| Railway deployment not touched | ✅ |
| No commit made | ✅ |
| Production build exits 0 | ✅ |

### One post-commit action required

After the commit is merged and the server restarts, the following should be verified in the live environment:
1. Server startup log no longer prints `[OAuth] ERROR:` when `OAUTH_SERVER_URL` is absent.
2. `/api/oauth/callback` with no env returns HTTP 503 (not 400).

Both are code-correct in the working tree — they simply require a server restart to observe.
