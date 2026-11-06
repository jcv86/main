# DTC password access: focused regression evidence

Date: 2026-11-06. Branch: `uat/dtc-20261106`. Baseline: `59645764989f7eed1a54be41d2755b48e98278fa`.

This block closes DTC-AUTH-01 (email entry, invitation and return path) and DTC-AUTH-02 (recoverable errors). It does not change Auth providers, migrations, remote configuration or production. All credentials, sessions and identities used below are synthetic.

## Reproduction before the change

`node --import tsx scripts/test-email-login.mjs` loads the actual password Route Handler, actual NextResponse, and installed Supabase SSR/Auth SDK. Next's request cookie store and HTTP transport are replaced. One explicit fault injection simulates a cleanup that cannot confirm removal. The transport cannot contact the network.

The baseline run completed with **1 passing / 15 failing expectations, 0 live network calls**. These are regression expectations, not 15 independent product defects. The concrete failures were:

1. A successful password response returned HTTP 200 without calling `resolve_pilot_access`. Even a valid signed `dtc_pilot_claim` was not submitted to the policy. A new user with an invitation therefore could not redeem it: the following protected-page middleware submits `p_claim_id: null` and rejects a nonmember. The same endpoint also claimed success for a user with no pilot access.
2. Supabase HTTP 503 and 429 both became HTTP 401 with “Credenciales incorrectas.” Malformed JSON and JSON `null` became HTTP 500. These responses prevented the form from giving the appropriate retry action.
3. The form used `router.replace` and `router.refresh` after server-side cookie login. `SessionWrapper` is mounted in persistent Providers and updates from browser SDK events; the server fetch does not emit a browser `SIGNED_IN` event. The browser laboratory must verify the actual form and Provider state. The previous fixture-only login does not establish this behavior.

The test also reproduced that the baseline handler did not consult the pilot policy when that boundary failed or returned malformed data. It did not pretend to validate the database policy or RLS using a mock.

## Correction and verification

The password endpoint now validates malformed input before calling Auth, classifies documented provider errors without exposing diagnostics, and calls the existing `resolve_pilot_access` policy after a valid password. The verified signed invitation cookie supplies the claim; query/body flags do not grant access. SSR cookie updates are staged until the policy allows entry. A denied or failed policy retires only the newly established current session and verifies its removal. A transient failure retains the claim for retry.

The form now performs a full document navigation after confirmed success, so Providers and the browser SDK initialize from the SSR cookies. It preserves the normalized return path, invitation context and supported recovery reason when returning to the canonical sign-in page. Non-JSON service failures and quota responses have safe Spanish retry messages, and the form becomes usable again on failure.

Independent review also reproduced an account-switch edge case: a policy failure after valid credentials retired the new staged session but sent its cookie expiration to a browser that still held an earlier session. Two added regressions failed before correction. The handler now discards all attempted-session cookie updates on rejection; it revokes only the new session and preserves the previous browser cookie. The test uses distinct previous/new session IDs and verifies which session is revoked.

Post-change focused verification: **22/22 checks passed, 0 live network calls**. The original 16 regression expectations changed from 1/16 to 16/16; four additional checks cover return-path/context preservation and safe client error messages; two verify that a prior session survives a policy outage or denied new login. TypeScript (`npx tsc --noEmit --incremental false`) and `git diff --check` passed before this final cookie-only correction; the integrated gate covers the final tree.

Browser verification belongs to the real auth laboratory in this branch; this unit-level evidence alone does not close human UAT or certify remote Auth configuration.

## Provider references

Error classification follows the documented Supabase Auth `code` and `status`, not raw provider messages: <https://supabase.com/docs/guides/auth/debugging/error-codes>.

Denied-session cleanup uses `scope: 'local'` and verifies local removal independently of remote token revocation: <https://supabase.com/docs/reference/javascript/auth-signout>. The installed Auth SDK for this reproduction is 2.119.0; SSR is 0.7.0.
