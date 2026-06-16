export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const LOCAL_LOGIN_PATH = "/login";

/** Returns true only when both OAuth frontend env vars are present. */
export const isOAuthLoginConfigured = () =>
  Boolean(import.meta.env.VITE_OAUTH_PORTAL_URL && import.meta.env.VITE_APP_ID);

/** Builds the OAuth portal URL, or null when OAuth env is not configured. */
export const getOAuthLoginUrl = (): string | null => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  if (!oauthPortalUrl || !appId) {
    return null;
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);
  const url = new URL(`${oauthPortalUrl}/app-auth`);

  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

/**
 * Returns the default login path.
 * Local /login is always the primary entrypoint; OAuth is opt-in via getOAuthLoginUrl().
 * Kept as a named export so existing call sites in main.tsx, useAuth.ts,
 * DashboardLayout.tsx, and SlideViewer.tsx continue to work unchanged.
 */
export const getLoginUrl = () => LOCAL_LOGIN_PATH;
