# Pilot Access PR 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let invited new users and verified returning users enter the controlled DTC pilot through Google or LinkedIn without copying invitation codes.

**Architecture:** PostgreSQL owns pilot membership, invitation claim, grandfathering, and seat allocation. Next.js route handlers convert opaque invitation tokens into short-lived HTTP-only claims; OAuth callbacks resolve returning membership before requiring an invitation. Middleware distinguishes missing sessions from verification failures, while the sign-in and `/comenzar` pages expose coherent returning-user and new-user paths.

**Tech Stack:** Next.js 15 App Router, TypeScript, Supabase Auth/PostgreSQL/RLS, Node `crypto`, React 19, Node test runner, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-25-pilot-access-and-resumable-assessment-design.md`

## Global Constraints

- Preserve the controlled 100-seat pilot.
- Do not change C1/A1 questions, DISC scoring, pillar methodology, pricing, or commercial positioning.
- Never grant access from client-controlled `user_metadata`; only database evidence and authenticated identity are authoritative.
- Do not merge accounts automatically by matching email.
- Do not commit Joaquín's email or internal user ID.
- Invitation tokens are high-entropy, short-lived, single-use, and stored only as SHA-256 hashes.
- Every database object exposed through `public` has RLS enabled and explicit grants.
- Every task follows RED → GREEN → REFACTOR and ends with a focused commit.

---

## File map

- Create `supabase/migrations/20260825010000_pilot_access_foundation.sql`: pilot memberships, hashed invitations, atomic claim/redemption/grandfather functions, RLS, and grants.
- Create `lib/auth/pilot-access.ts`: provider-independent access decisions and safe next-path normalization.
- Create `scripts/check-pilot-access-contract.ts`: executable migration and source contract.
- Create `app/api/auth/invitation/claim/route.ts`: token validation and HTTP-only claim cookie.
- Create `app/api/auth/pilot-status/route.ts`: authenticated returning-user access status.
- Modify `app/auth/signin/page.tsx`: Google and LinkedIn entry without manual code input.
- Modify `app/auth/callback/route.ts`: session exchange, returning-user resolution, and claimed-invitation redemption.
- Modify `lib/supabase/middleware.ts`: missing-session classification and protected pilot membership gate.
- Modify `app/comenzar/page.tsx`: remove QA surface and present “Ya tengo cuenta” / “Solicitar acceso”.
- Create `scripts/test-pilot-auth-flow.mjs`: local HTTP integration test for claim, provider selection, callback decisions, and replay rejection.
- Create `.github/workflows/pilot-access.yml`: contract, integration, TypeScript, and production-build gate.

---

### Task 1: Database-owned pilot access

**Files:**
- Create: `supabase/migrations/20260825010000_pilot_access_foundation.sql`
- Create: `scripts/check-pilot-access-contract.ts`

**Interfaces:**
- Produces: `public.pilot_memberships`, `public.pilot_invitations`.
- Produces: `private.claim_pilot_invitation(p_token_hash text, p_claim_id uuid)`.
- Produces: `private.resolve_pilot_access(p_user_id uuid, p_claim_id uuid)` returning `{allowed boolean, access_kind text, membership_id uuid}`.
- Consumes: existing `auth.users`, `public.despega_user_profiles`, `public.canon_conozcamonos_1_responses`, and `public.a1_cerebral_assessment`.

- [ ] **Step 1: Write the failing migration contract**

Create `scripts/check-pilot-access-contract.ts` with assertions that the migration contains: RLS on both tables; unique membership per user; unique invitation token hash; no plaintext `token` column; claim and resolve functions in `private`; `auth.uid()` validation; pre-rollout grandfather evidence; execute revoked from `PUBLIC`, `anon`, and `authenticated`; and service-role-only execution.

```ts
import assert from 'node:assert/strict'
import fs from 'node:fs'

const sql = fs.readFileSync('supabase/migrations/20260825010000_pilot_access_foundation.sql', 'utf8')
const expect = (pattern: RegExp, message: string) => assert.match(sql, pattern, message)

expect(/create table public\.pilot_memberships/i, 'pilot membership table missing')
expect(/unique\s*\(user_id\)/i, 'membership must be unique per user')
expect(/create table public\.pilot_invitations/i, 'pilot invitation table missing')
expect(/token_hash text not null unique/i, 'hashed token must be unique')
assert.doesNotMatch(sql, /\btoken\s+text/i, 'plaintext invitation token is forbidden')
expect(/enable row level security/i, 'RLS must be enabled')
expect(/private\.claim_pilot_invitation/i, 'claim function missing')
expect(/private\.resolve_pilot_access/i, 'access resolver missing')
expect(/despega_user_profiles|canon_conozcamonos_1_responses|a1_cerebral_assessment/i, 'grandfather evidence missing')
expect(/revoke all .* from public/i, 'PUBLIC execute must be revoked')
expect(/grant execute .* to service_role/i, 'service role grant missing')

console.log(JSON.stringify({ pilotAccessMigration: true }))
```

- [ ] **Step 2: Run the contract to verify RED**

Run: `npx tsx scripts/check-pilot-access-contract.ts`  
Expected: FAIL with `ENOENT` for the migration.

- [ ] **Step 3: Implement the additive migration**

Create tables with `status` checks, `expires_at`, claim/redemption timestamps, membership `access_kind` (`invited` or `grandfathered`), unique `user_id`, and audit timestamps. Put mutation functions in a non-exposed `private` schema. `claim_pilot_invitation` locks the invitation row and accepts only `issued`, unexpired tokens. `resolve_pilot_access` runs in one transaction and follows this order:

```sql
-- 1. Existing membership is returned unchanged.
-- 2. A pre-cutoff, email-confirmed auth user with an existing DTC profile,
--    canonical C1 row, or A1 assessment receives one grandfathered membership.
-- 3. Otherwise a valid claimed invitation is redeemed and creates membership.
-- 4. Otherwise return allowed=false without writing.
```

Set the immutable rollout cutoff to `2026-08-25 00:00:00+00`. Enforce the 100-seat cap with an advisory transaction lock before inserting an `invited` membership. Grandfathered historical users do not consume a newly issued invitation, but they do appear in membership auditing.

- [ ] **Step 4: Run contract and database validation**

Run: `npx tsx scripts/check-pilot-access-contract.ts`  
Expected: PASS with `{"pilotAccessMigration":true}`.

Apply the migration to a Supabase branch, then run:

```sql
select relname, relrowsecurity
from pg_class
where relname in ('pilot_memberships','pilot_invitations');

select routine_schema, routine_name
from information_schema.routines
where routine_name in ('claim_pilot_invitation','resolve_pilot_access');
```

Expected: both tables have `relrowsecurity=true`; both functions are in `private`.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260825010000_pilot_access_foundation.sql scripts/check-pilot-access-contract.ts
git commit -m "feat(auth): add database-owned pilot access"
```

---

### Task 2: Provider-independent access decisions

**Files:**
- Create: `lib/auth/pilot-access.ts`
- Create: `scripts/test-pilot-access-decisions.mjs`

**Interfaces:**
- Produces: `normalizeNextPath(value: string | null): string`.
- Produces: `classifyAuthState(input: { hasUser: boolean; authErrorCode?: string }): 'signed_out' | 'invalid_session' | 'authenticated'`.
- Produces: `providerRedirect(provider: 'google' | 'linkedin_oidc', origin: string, nextPath: string): { provider: string; redirectTo: string }`.

- [ ] **Step 1: Write failing behavior tests**

Test literal cases: missing user without auth error is `signed_out`; `refresh_token_not_found` is `invalid_session`; user is `authenticated`; external and protocol-relative next paths normalize to `/despega`; Google and LinkedIn callbacks use `/auth/callback` and preserve only a safe internal `next`.

```js
assert.equal(classifyAuthState({ hasUser: false }), 'signed_out')
assert.equal(classifyAuthState({ hasUser: false, authErrorCode: 'refresh_token_not_found' }), 'invalid_session')
assert.equal(normalizeNextPath('https://evil.example'), '/despega')
assert.equal(normalizeNextPath('//evil.example'), '/despega')
assert.equal(normalizeNextPath('/despega/a1-cerebral'), '/despega/a1-cerebral')
```

- [ ] **Step 2: Run tests to verify RED**

Run: `node scripts/test-pilot-access-decisions.mjs`  
Expected: FAIL because `lib/auth/pilot-access.ts` does not exist.

- [ ] **Step 3: Implement minimal pure helpers**

Use a single internal-path rule: value starts with one `/`, does not start with `//`, and parses against the application origin without changing origin. Provider names are a closed union; do not accept arbitrary strings.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `node scripts/test-pilot-access-decisions.mjs`  
Expected: PASS with all literal cases.

- [ ] **Step 5: Commit**

```bash
git add lib/auth/pilot-access.ts scripts/test-pilot-access-decisions.mjs
git commit -m "test(auth): define pilot access decisions"
```

---

### Task 3: Invitation claim route

**Files:**
- Create: `app/api/auth/invitation/claim/route.ts`
- Create: `lib/auth/invitation-cookie.ts`
- Modify: `scripts/test-pilot-auth-flow.mjs`

**Interfaces:**
- Consumes: `private.claim_pilot_invitation(tokenHash, claimId)` through the server admin client.
- Produces: HTTP-only cookie `dtc_pilot_claim` containing a signed claim ID, expiring after 15 minutes.
- Produces: `GET /api/auth/invitation/claim?token=<opaque>` → 303 `/auth/signin?invited=1` or `/auth/signin?error=invalid_invitation`.

- [ ] **Step 1: Write failing HTTP tests**

Extend `scripts/test-pilot-auth-flow.mjs` with a local server adapter and literal cases: missing token returns safe error redirect; valid 32-byte token is SHA-256 hashed before the repository call; success sets `HttpOnly`, `Secure`, `SameSite=Lax`, `Max-Age=900`; raw token is absent from `Location`, cookie, and logs.

- [ ] **Step 2: Run tests to verify RED**

Run: `node scripts/test-pilot-auth-flow.mjs`  
Expected: FAIL because the claim handler and cookie signer do not exist.

- [ ] **Step 3: Implement claim and cookie modules**

Use `crypto.createHash('sha256')`, `crypto.randomUUID()`, and HMAC-SHA256 with `PILOT_INVITATION_COOKIE_SECRET`. Reject tokens outside 43–128 URL-safe characters before hashing. Return generic invalid-invitation copy for invalid, expired, revoked, and replayed tokens.

- [ ] **Step 4: Verify GREEN**

Run: `node scripts/test-pilot-auth-flow.mjs`  
Expected: PASS; output contains no raw token.

- [ ] **Step 5: Commit**

```bash
git add app/api/auth/invitation/claim/route.ts lib/auth/invitation-cookie.ts scripts/test-pilot-auth-flow.mjs
git commit -m "feat(auth): claim signed pilot invitations"
```

---

### Task 4: Returning-user Google and LinkedIn authentication

**Files:**
- Modify: `app/auth/signin/page.tsx`
- Modify: `app/auth/callback/route.ts`
- Create: `app/api/auth/pilot-status/route.ts`
- Modify: `scripts/test-pilot-auth-flow.mjs`

**Interfaces:**
- Consumes: `providerRedirect`, signed claim cookie, and `private.resolve_pilot_access`.
- Produces: OAuth buttons for `google` and `linkedin_oidc`.
- Produces: callback outcomes `returning`, `grandfathered`, `invited`, or `access_required`.

- [ ] **Step 1: Add failing callback and UI tests**

Cover: both provider buttons exist and are enabled for “Ya tengo cuenta”; no invitation code textbox exists; OAuth errors preserve safe copy; returning membership continues; verified legacy evidence creates `grandfathered`; new user without claim is signed out and redirected to `/auth/signin?error=access_required`; claimed invitation is redeemed once; unsafe `next` is discarded.

- [ ] **Step 2: Run tests to verify RED**

Run: `node scripts/test-pilot-auth-flow.mjs`  
Expected: FAIL because Google and pilot resolution are absent.

- [ ] **Step 3: Implement the minimal sign-in and callback flow**

Replace invitation-code state and validation calls with one provider handler:

```ts
const signIn = async (provider: 'google' | 'linkedin_oidc') => {
  const options = providerRedirect(provider, window.location.origin, searchParams.get('next'))
  const { error } = await supabase.auth.signInWithOAuth(options)
  if (error) setError('No pudimos iniciar sesión. Intenta nuevamente.')
}
```

After `exchangeCodeForSession`, callback calls the server-side access resolver. On denial, sign out the just-created session before redirecting to `access_required`. On success, clear the claim cookie and redirect to the normalized next route or canonical journey resolver. Do not log provider tokens, email, claim IDs, or user IDs.

- [ ] **Step 4: Verify GREEN**

Run: `node scripts/test-pilot-auth-flow.mjs && npx tsc --noEmit`  
Expected: all auth-flow tests pass and TypeScript exits 0.

- [ ] **Step 5: Commit**

```bash
git add app/auth/signin/page.tsx app/auth/callback/route.ts app/api/auth/pilot-status/route.ts scripts/test-pilot-auth-flow.mjs
git commit -m "feat(auth): restore returning pilot sign-in"
```

---

### Task 5: Correct middleware authentication states

**Files:**
- Modify: `lib/supabase/middleware.ts`
- Modify: `scripts/check-global-auth-boundary-contract.ts`
- Modify: `scripts/test-pilot-auth-flow.mjs`

**Interfaces:**
- Consumes: `classifyAuthState` and authenticated pilot status.
- Produces: signed-out redirect with `next` only; invalid-session redirect with `reason=authentication_verification_failed`; access denial with `error=access_required`.

- [ ] **Step 1: Write failing regression tests**

Add cases proving an `AuthSessionMissingError` or absent cookie is `signed_out`, not `authentication_verification_failed`; a malformed/expired refresh token is `invalid_session`; authenticated membership reaches `/despega`; authenticated non-member reaches `access_required`.

- [ ] **Step 2: Run tests to verify RED**

Run: `node scripts/test-pilot-auth-flow.mjs && npx tsx scripts/check-global-auth-boundary-contract.ts`  
Expected: FAIL because current middleware maps any `getUser` error to verification failure.

- [ ] **Step 3: Implement the classification and membership gate**

Use `classifyAuthState` before constructing redirects. Resolve membership only after Supabase returns a verified user. Preserve existing A2 progress redirects after pilot access is allowed.

- [ ] **Step 4: Verify GREEN**

Run: `node scripts/test-pilot-auth-flow.mjs && npx tsx scripts/check-global-auth-boundary-contract.ts && npx tsc --noEmit`  
Expected: all commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add lib/supabase/middleware.ts scripts/check-global-auth-boundary-contract.ts scripts/test-pilot-auth-flow.mjs
git commit -m "fix(auth): distinguish signed-out pilot users"
```

---

### Task 6: Coherent public entry and CI gate

**Files:**
- Modify: `app/comenzar/page.tsx`
- Create: `.github/workflows/pilot-access.yml`
- Modify: `package.json`
- Modify: `scripts/test-pilot-auth-flow.mjs`

**Interfaces:**
- Produces: `/comenzar` with “Ya tengo cuenta”, “Tengo una invitación”, and “Solicitar acceso”.
- Removes: public QA links, “Listo para Producción”, direct pillar shortcuts, and testing-document links.
- Produces npm commands `test:pilot-access` and `check:pilot-access`.

- [ ] **Step 1: Write failing public-entry assertions**

Run the rendered `/comenzar` page in the local HTTP harness. Assert the three user-facing actions are present and QA/testing copy is absent. Assert “Ya tengo cuenta” reaches `/auth/signin`, preserving a safe `next` when supplied.

- [ ] **Step 2: Run tests to verify RED**

Run: `node scripts/test-pilot-auth-flow.mjs`  
Expected: FAIL because the current page exposes QA and internal routes.

- [ ] **Step 3: Implement the focused entry page and workflow**

Keep the existing visual system but remove internal testing content. Add package scripts:

```json
"test:pilot-access": "node scripts/test-pilot-auth-flow.mjs",
"check:pilot-access": "tsx scripts/check-pilot-access-contract.ts"
```

The workflow installs dependencies, runs both commands, existing global-auth contract, `tsc --noEmit`, `npm run build`, starts `next start`, and runs the read-only critical smoke test. Use test environment values matching the existing evidence-aware workflow and add only `PILOT_INVITATION_COOKIE_SECRET` with a non-production test value.

- [ ] **Step 4: Run full verification**

```bash
npm run test:pilot-access
npm run check:pilot-access
npx tsx scripts/check-global-auth-boundary-contract.ts
npx tsc --noEmit
npm run build
```

Expected: every command exits 0; build produces the production bundle without new warnings.

On a Supabase branch, verify: valid invitation claim, expired invitation rejection, replay rejection, returning membership, grandfathered legacy account, new account denial, and 100-seat cap.

- [ ] **Step 5: Browser verification**

Verify desktop and mobile flows in preview:

1. `/comenzar` contains no QA surface.
2. Returning Google login reaches the canonical next route.
3. Returning LinkedIn login resolves the same existing account when already linked.
4. New user without invitation receives `access_required`.
5. Valid invitation can create exactly one membership.

- [ ] **Step 6: Commit**

```bash
git add app/comenzar/page.tsx .github/workflows/pilot-access.yml package.json scripts/test-pilot-auth-flow.mjs
git commit -m "ci(auth): validate controlled pilot entry"
```

---

## PR completion gate

- [ ] Re-read the spec and confirm PR 1 covers only pilot access.
- [ ] Run all commands in Task 6 Step 4 with fresh output.
- [ ] Run Supabase security advisors and resolve new findings caused by this migration.
- [ ] Confirm no exact pilot email, OAuth token, invitation token, claim ID, or internal user ID appears in git diff or logs.
- [ ] Open a PR targeting `main`; do not merge until GitHub Actions, preview browser verification, and Joaquín's returning-user test are green.
- [ ] Record only masked identity evidence in the PR description.
