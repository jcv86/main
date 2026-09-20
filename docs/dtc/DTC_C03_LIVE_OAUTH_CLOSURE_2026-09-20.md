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

- Google: 40 historical OAuth flows; latest observed 2026-09-08
- LinkedIn OIDC: 34 historical OAuth flows; latest observed 2026-08-27

The current release has not yet received a new OAuth flow.

## Fresh-release evidence gap

From the current production release timestamp onward:

- Google users with a new `last_sign_in_at`: 0
- new Auth sessions: 0
- redeemed pilot invitations: 0
- OAuth flow_state rows created: 0

So there is no factual basis to mark DTC-C03 `verified` yet.

## Exact final live test required

One human OAuth run on the current production release is still required.

Acceptance sequence:

1. Open `https://www.despegatucarrera.com/auth/signin`.
2. Sign in with an already-authorized returning Google account, or use a fresh pilot invitation followed by Google/LinkedIn.
3. Confirm redirect returns to the intended DTC route.
4. Confirm a new Auth session exists in DTCFINAL after the release timestamp.
5. Confirm returning access does not require a new invitation when membership already exists.
6. POST sign-out through the product UI / sign-out route.
7. Use browser Back and verify protected content cannot be recovered as an authenticated page.
8. Re-enter through sign-in and confirm the canonical journey resumes from persisted state.

Until that sequence is observed on this exact release, DTC-C03 remains `in_progress`.

## Verdict

- Invitation single-use semantics: **LIVE VERIFIED**
- Scanner-safe GET: **LIVE VERIFIED**
- Callback/access logic: **SOURCE + EXISTING CI VERIFIED**
- Google and LinkedIn OIDC historical provider operation: **OBSERVED**
- Fresh OAuth on exact current production release: **NOT YET OBSERVED**
- DTC-C03 overall: **IN_PROGRESS — one human OAuth run remains**
