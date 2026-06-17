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
 * Returns the login entry point appropriate for the current deployment.
 * On Manus (VITE_OAUTH_PORTAL_URL + VITE_APP_ID set): returns the OAuth portal URL.
 * On Railway / local (no OAuth env): returns the local /login path.
 * This ensures Manus OAuth is preserved while Railway local-auth works without
 * any environment configuration changes.
 */
export const getLoginUrl = () => getOAuthLoginUrl() ?? LOCAL_LOGIN_PATH;
