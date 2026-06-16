# TEC.WMS RC13 — Phase C Implementation Report

**Branch:** `production-hotfix-rc13-pedagogy-class6`
**Source commit:** `7c0e4a8fa30850fe0bae30fadbf1c4d3cb99f722`
**Implementation date:** 2026-06-15
**Status:** Complete — awaiting reviewer approval before commit

---

## Goal

Switch the default login flow from OAuth to Local Login while preserving optional OAuth support.

---

## Exact Files Changed

| File | Change summary |
|------|---------------|
| `client/src/const.ts` | `getLoginUrl()` now returns `LOCAL_LOGIN_PATH` (`/login`). Added `LOCAL_LOGIN_PATH`, `isOAuthLoginConfigured()`, and `getOAuthLoginUrl()` helpers for optional OAuth use. |
| `client/src/pages/LocalLogin.tsx` | Imported `getOAuthLoginUrl`. Added `oauthLoginUrl` variable. Added conditional "Institutional Sign In" button rendered only when `oauthLoginUrl` is non-null (i.e., OAuth env vars present). |
| `client/src/pages/Home.tsx` | Removed unused `getLoginUrl` import. Fixed authenticated-user redirect: `teacher` role now correctly routes to `/teacher` (was only `admin`). Updated footer copy from "Manus OAuth" to local-auth-first wording. |
| `server/_core/sdk.ts` | `OAuthService` constructor no longer emits an error log when `OAUTH_SERVER_URL` is absent — only logs when configured. Added private `ensureConfigured()` method; called at start of `getTokenByCode()` and `getUserInfoByToken()`. `SDKServer.getUserInfoWithJwt()` guards explicitly against missing `oAuthServerUrl`. `authenticateRequest()` missing-user block now throws `ForbiddenError("User not found")` immediately when `OAUTH_SERVER_URL` is absent, rather than attempting OAuth sync. |
| `server/_core/oauth.ts` | `/api/oauth/callback` handler returns HTTP 503 with `{"error":"OAuth provider is not configured"}` when `OAUTH_SERVER_URL` is not set, before any code/state parsing. |
| `README.md` | `OAUTH_SERVER_URL` and `VITE_OAUTH_PORTAL_URL` rows changed from `Required: Yes` to `Required: No`. `VITE_APP_ID` description updated to clarify dual use. Added prose note documenting local auth as the default. |

---

## Files Intentionally Preserved / Unchanged

These files were identified in the package as affected by the `const.ts` change but required no code edits — the `getLoginUrl()` return-value change propagates automatically:

| File | Status |
|------|--------|
| `client/src/main.tsx` | Unchanged — `getLoginUrl()` now returns `/login`; unauthorized tRPC errors redirect there automatically. |
| `client/src/_core/hooks/useAuth.ts` | Unchanged — `redirectPath = getLoginUrl()` default now resolves to `/login`. |
| `client/src/components/DashboardLayout.tsx` | Unchanged — unauthenticated CTA button now navigates to `/login` via updated helper. |
| `client/src/pages/SlideViewer.tsx` | Unchanged — auth guard now redirects to `/login` via updated helper. |
| `server/_core/index.ts` | Unchanged — `registerOAuthRoutes(app)` remains registered; OAuth callback is preserved. |
| `server/routers.ts` | Unchanged — local login/register endpoints untouched. |
| `server/db.ts` | Unchanged — local user creation pattern (`openId = local:<email>`, `loginMethod = "local"`) untouched. |
| `server/_core/env.ts` | Unchanged — `oAuthServerUrl` defaults to empty string as before. |
| `server/_core/oauth.ts` | Route preserved; only a 503 guard added at the entry of the handler. |

---

## Build Evidence

```
> wms-simulator@1.0.0 build
> vite build && esbuild server/_core/index.ts ...

vite v7.3.3 building client environment for production...
✓ 2466 modules transformed.
../dist/public/assets/index-DkrrTtVk.js   2,698.03 kB │ gzip: 584.30 kB
✓ built in 13.69s

  dist\index.js  347.1kb

Done in 32ms
```

Exit code: **0** — build passed cleanly.

Pre-existing warnings (analytics env vars, chunk size) are unrelated to Phase C and existed before this change.

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|-----------|
| OAuth-only deployments lose automatic redirect to portal | Low | `getOAuthLoginUrl()` still builds the portal URL; `LocalLogin.tsx` renders the "Institutional Sign In" button when both `VITE_OAUTH_PORTAL_URL` and `VITE_APP_ID` are set. |
| `getUserInfoWithJwt` called from OAuth callback path when `OAUTH_SERVER_URL` unset | Low | New explicit guard throws `"OAuth provider is not configured"` before making any HTTP call; callback route also short-circuits with 503. |
| Existing OAuth sessions broken in local-only mode | None | Sessions are JWT-verified locally by `sdk.verifySession()`; no OAuth round-trip is needed for valid existing sessions. Only the DB-miss fallback path was gated. |
| Teacher role routing regression | Fixed | `Home.tsx` line 34 now correctly routes `teacher` to `/teacher`; was previously only routing `admin`. Audit confirmed this as a required fix. |
| `new URL(undefined + "/app-auth")` exception in console | Eliminated | `getOAuthLoginUrl()` returns `null` when env vars are absent; no URL construction is attempted; no browser error. |
| Scoring, certification, scenarios, or teacher dashboard affected | None | Zero changes to `server/routers.ts`, `server/db.ts`, or any scenario/certification/teacher dashboard file. |

---

## OAuth Preservation Confirmation

**OAuth has not been removed.** It is available as an opt-in path:

- `server/_core/oauth.ts` — `/api/oauth/callback` route is registered and fully functional when `OAUTH_SERVER_URL` is set.
- `server/_core/index.ts` — `registerOAuthRoutes(app)` call is untouched.
- `server/_core/sdk.ts` — `OAuthService`, `exchangeCodeForToken`, `getUserInfo`, `getUserInfoWithJwt`, and OAuth user-sync logic are all preserved; they are simply gated behind a configured-provider check.
- `client/src/const.ts` — `getOAuthLoginUrl()` is exported and builds the full OAuth portal URL when `VITE_OAUTH_PORTAL_URL` and `VITE_APP_ID` are present.
- `client/src/pages/LocalLogin.tsx` — "Institutional Sign In" button is rendered automatically whenever OAuth env is configured.

---

## Rollback Path

To restore OAuth-first default:
1. Revert `client/src/const.ts` so `getLoginUrl()` constructs the `/app-auth` portal URL directly.
2. Remove or hide the conditional OAuth button in `LocalLogin.tsx`.
3. Restore `Home.tsx` copy and optionally the `admin`-only teacher redirect.
4. Revert `server/_core/sdk.ts` startup log and `authenticateRequest` guard to original.
5. Remove 503 guard from `server/_core/oauth.ts`.
6. Restore `README.md` OAuth rows to `Required: Yes`.
7. Redeploy with `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID`, and `OAUTH_SERVER_URL` present.

---

## No-Commit Confirmation

No commit has been made. All changes are unstaged in the working tree, ready for reviewer inspection before commit.
