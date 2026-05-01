import { Auth0Client } from '@auth0/nextjs-auth0/server';

// Match vero-mobile's Auth0 setup (vero-mobile/src/config/index.ts):
//   audience: 'https://api.veroreceipts.com'
//   scopes:   openid profile email offline_access
// Without `audience`, Auth0 issues an OIDC-only response and
// `auth0.getAccessToken()` returns no token usable against the backend —
// every /api/email call then 401s. `offline_access` lets the SDK refresh
// the access token automatically on expiry, mirroring the mobile
// apiClient's refresh-on-401 behaviour.
//
// Override via env vars `AUTH0_AUDIENCE` / `AUTH0_SCOPE` if needed.
export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE || 'https://api.veroreceipts.com',
    scope:
      process.env.AUTH0_SCOPE || 'openid profile email offline_access',
  },
});
