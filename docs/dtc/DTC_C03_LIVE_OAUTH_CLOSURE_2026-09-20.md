# DTC-C03 live OAuth closure — evidence addendum

Date: 2026-09-20  
Repository: `jcv86/main`  
Production deployment checked: `dpl_4QSMMe7ZSr6r2Gp91iUa8ZAPyi9D`  
Production commit: `66579a875d70b9424ae7f84f2e582ca9dfd848a9`

## Objective

Close the remaining release blocker DTC-C03 with evidence from the exact current production release, without treating local/browser-lab evidence as equivalent to a fresh live OAuth run.

## Production identity

- Vercel production remains on `main` commit `66579a875d70b9424ae7f84f2e582ca9dfd848a9`.
- DTCFINAL project: `dcfrbwxbejtbcouionna`.
- No newer production deployment was observed at the time of this audit.

## Invitation state observed before testing

Read-only DTCFINAL audit:

- memberships total: 3
- invited memberships: 1
- grandfathered memberships: 2
- invitations total: 11
- currently issued and unexpired invitations: 0
- currently claimed and unexpired invitations: 0
- redeemed invitations: 1
- revoked invitations: 9
- all 11 invitations are expired or past due by current time

No live invitation was reused for this test.

## Live single-use invitation semantics

A synthetic invitation was inserted temporarily in DTCFINAL, exercised, then deleted.

Observed behavior:

1. First claim with claim ID A: allowed = true, reason = `claimed`.
2. Retry with the same claim ID A: allowed = true, reason = `claimed` (idempotent recovery).
3. Retry with a different claim ID B: allowed = false, reason = `claimed`.
4. Synthetic invitation row was deleted after the check.
5. A separate expired synthetic case returned allowed = false, reason = `expired`.

This confirms the current production database function preserves single-use semantics and safe idempotence for the original claimant.

## Scanner-safe GET on current production

A valid-format synthetic token was requested through the public production route:

`GET /api/auth/invitation/claim?token=<synthetic-valid-format-token>`

Observed:

- HTTP 200
- confirmation page rendered
- `Cache-Control: no-store, max-age=0`
- CSP limits content and allows only same-origin form submission
- `Referrer-Policy: no-referrer`
- `X-Frame-Options: DENY`
- page explicitly states that the invitation is reserved only after pressing the confirmation button

Database counts were measured immediately before and after the GET:

- invitations total: 11 → 11
- claimed invitations: 1 → 1

Therefore a scanner-style GET does not reserve or mutate an invitation.

## OAuth configuration evidence

The current application code:

- starts OAuth with `signInWithOAuth()`
- supports `google` and `linkedin_oidc`
- normalizes the requested `next` path
- stores the intended next path in a short-lived SameSite=Lax cookie
- redirects the provider back to `/auth/callback`
- exchanges the code server-side for a Supabase session
- resolves pilot access server-side
- signs the user out immediately if pilot access is not allowed
- clears claim/next cookies after success or denial

DTCFINAL historical `auth.flow_state` confirms real provider flows have existed for:

- Google: 40 historical OAuth flows observed before this release audit
- LinkedIn OIDC: 34 historical OAuth flows observed before this release audit

## Fresh OAuth on the exact production release

A human sign-in was completed on 2026-09-20 against the current production release.

Observed in DTCFINAL:

- one new Auth session created at 2026-09-20 12:53:42 UTC
- Auth audit entries at the same time record `provider=google` and `provider_type=google`
- the authenticated account has both email and Google identities
- session AAL: `aal1`
- the returning account already had an allowed pilot membership
- access kind: `grandfathered`
- the membership does not depend on an invitation
- redeemed invitations since the current release: 0
- a canonical journey state exists and was recovered for the returning account

This verifies that a returning user can complete Google OAuth on the current production release without consuming a new invitation and can recover the server-owned journey state.

## Logout + browser-back live evidence

The same human browser session was signed out through the product.

Observed:

- Auth audit log records a real `logout` at 2026-09-20 12:56:07 UTC.
- The current-release Auth session was removed from `auth.sessions`.
- Browser Back did **not** recover authenticated or protected DTC content.
- The browser could revisit the prior Google OAuth account chooser, but that flow referenced a consumed OAuth state.
- Supabase correctly rejected the stale transaction and returned `error_code=bad_oauth_state` to the public Site URL.

Therefore the security condition of the browser-history check passed: logout invalidated the server session and Back could not restore protected access.

The stale-state return exposed a separate recovery UX defect: a technical OAuth error was visible on the public landing URL. That defect is isolated in PR #181 (`fix(auth): recover stale OAuth state after browser back`) and does not represent session resurrection or protected-content exposure.

## Clean re-entry after the recovery fix

PR #181 was merged to `main` as `f0751cc4d9da0e5ae86f815b5c2e46acb57edf9b` and deployed to production in Vercel deployment `dpl_3R9VshmcqouMMB9DH15QdPpraP33` (READY).

The user then repeated the recovery flow in production.

Observed in DTCFINAL after the earlier logout:

- Google login at 2026-09-20 13:10:33 UTC.
- Logout at 2026-09-20 13:10:45 UTC.
- Second clean Google login at 2026-09-20 13:11:23 UTC.
- A live Auth session exists after the second re-entry.
- The account remains `grandfathered`, with no invitation dependency.
- The canonical journey state remains present and recoverable.

The user also confirmed the browser UX now behaves correctly: the stale OAuth state is converted into a controlled sign-in recovery message instead of exposing the provider error on the public landing page.

## Verdict

- Invitation single-use semantics: **LIVE VERIFIED**
- Scanner-safe GET: **LIVE VERIFIED**
- Callback/access logic: **LIVE + SOURCE VERIFIED**
- Google OAuth on exact current production release: **LIVE VERIFIED**
- Returning access without new invitation: **LIVE VERIFIED**
- Canonical journey recovery at authentication boundary: **LIVE VERIFIED**
- Sign-out invalidates live session: **LIVE VERIFIED**
- Browser Back cannot restore protected access: **LIVE VERIFIED**
- Stale OAuth browser-history UX recovery: **LIVE VERIFIED IN PRODUCTION**
- Clean re-entry after logout: **LIVE VERIFIED**
- DTC-C03 overall: **VERIFIED**
