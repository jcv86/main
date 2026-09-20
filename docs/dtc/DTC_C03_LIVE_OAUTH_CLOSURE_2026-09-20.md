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

## Remaining live evidence gap

The current-release OAuth portion is now verified. The only remaining browser-specific sequence is:

1. Sign out through the product UI / sign-out route.
2. Use browser Back.
3. Verify protected content cannot be recovered as an authenticated page.
4. Re-enter through sign-in.
5. Verify the canonical journey resumes from persisted state.

Because the available automation cannot reuse the user's real browser session cookie, this final browser-history check must be observed in the user's browser.

## Verdict

- Invitation single-use semantics: **LIVE VERIFIED**
- Scanner-safe GET: **LIVE VERIFIED**
- Callback/access logic: **LIVE + SOURCE VERIFIED**
- Google OAuth on exact current production release: **LIVE VERIFIED**
- Returning access without new invitation: **LIVE VERIFIED**
- Canonical journey recovery at authentication boundary: **LIVE VERIFIED**
- Sign-out + browser-back negative check: **PENDING HUMAN BROWSER OBSERVATION**
- DTC-C03 overall: **IN_PROGRESS — only sign-out/browser-back/re-entry remains**
