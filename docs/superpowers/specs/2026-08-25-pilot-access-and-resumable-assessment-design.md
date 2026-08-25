# Pilot Access and Resumable Assessment Design

**Date:** 2026-08-25  
**Status:** Approved approach, pending implementation-plan review  
**Priority:** P1  
**Related objective:** GitHub issue #32

## Problem

A new user can follow the public call to action to `/comenzar`, but the protected journey redirects to `/auth/signin?reason=authentication_verification_failed`. The sign-in page requires a manually entered invitation code before LinkedIn OAuth is enabled. The page reports capacity from `user_invitations`, while code validation reads `invitation_codes`; available capacity therefore does not prove that a usable invitation exists.

C1 and the 28-question A1 assessment keep answers only in React state and write them at the end. A reload, expired session, navigation failure, or closed browser loses all unfinished work. C1 writes `canon_conozcamonos_1_responses`, while at least one A1 consumer still reads `conozcamonos_1_responses`, breaking the canonical context path.

## Goals

- Preserve the controlled 100-seat pilot.
- Let an invited person enter without copying a code.
- Distinguish a missing session from a genuinely invalid session.
- Save and resume C1 and A1 without changing their questions or scoring.
- Use one canonical response source for downstream A1 context.
- Prove the complete pilot journey with an automated browser test.

## Non-goals

- Open public registration.
- Change the 100-seat limit, pricing, or commercial positioning.
- Redesign the 7 C1 questions, 28 A1 questions, DISC scoring, or pillar methodology.
- Expand A2, A3, or A4.
- Migrate unrelated legacy tables or documentation.

## Chosen approach

Use a signed, single-use invitation link. The link establishes a short-lived invitation session, then enables LinkedIn OAuth. The server remains the authority for invitation validity, redemption, seat capacity, assessment drafts, and completion.

Alternatives rejected:

1. **Open registration:** simpler, but removes pilot control.
2. **Keep manual codes:** smaller change, but preserves the failure experienced by Joaquín.

## Architecture

### 1. Invitation link

An invitation URL contains an opaque token, not a raw database ID or email. Only a SHA-256 hash of the token is stored. Each invitation has:

- `id`
- `token_hash`
- `status`: `issued`, `claimed`, `redeemed`, `revoked`, or `expired`
- `expires_at`
- `claimed_at`
- `redeemed_at`
- `claimed_by_user_id`
- audit timestamps

Opening the link calls a server route that validates the hash, expiry, status, and remaining pilot capacity. A valid token creates an encrypted, HTTP-only, same-site invitation cookie and redirects to `/auth/signin`. The browser URL is cleaned so the token does not remain in history or analytics.

The sign-in screen enables LinkedIn when the invitation cookie is valid. OAuth state carries a server-generated correlation identifier, not the invitation token. The callback binds the authenticated user to the claimed invitation in a transaction and consumes one seat exactly once. Replaying a redeemed token never creates another membership.

### 2. Authentication states

Middleware treats these cases separately:

- No session on a protected route: normal sign-in redirect with `next` only.
- Expired or unverifiable session: sign-in redirect with `reason=authentication_verification_failed`.
- Missing Supabase configuration: `reason=authentication_unavailable`.
- Authenticated user without redeemed pilot access: access-request screen, not the assessment.

The public CTA must reflect the access model. Users without an invitation see “Solicitar acceso”; invited users arriving through a valid link see “Continuar con LinkedIn”. Internal QA routes and “Listo para Producción” copy are removed from the public `/comenzar` experience.

### 3. Assessment drafts

Add a server-owned `assessment_drafts` table with one active draft per `(user_id, assessment_type)` where `assessment_type` is `c1` or `a1`.

Fields:

- `user_id`
- `assessment_type`
- `schema_version`
- `current_question`
- `answers` JSONB
- `timings` JSONB for A1
- `updated_at`
- `completed_at`, nullable

RLS allows users to read and update only their own draft. Draft APIs validate the authenticated user, question IDs, allowed option values, payload size, and schema version. The client saves after every accepted answer and when moving backward or forward. Writes are idempotent upserts. A short debounce may coalesce text keystrokes, but navigation waits for the latest save.

On entry, the client loads the active draft and resumes at the first unanswered question or the saved `current_question`. A completed assessment cannot be reopened as a mutable draft. Final submission validates all answers again, writes the canonical completed record transactionally, marks the draft completed, and returns the canonical next route.

### 4. Canonical data flow

C1 completion writes only `canon_conozcamonos_1_responses`. Every downstream consumer, including A1 insights, reads that table. The legacy `conozcamonos_1_responses` table receives no new writes and is not used as a fallback in the new flow.

A1 completion continues through `/api/a1-cerebral-save` and `save_a1_cerebral_with_career_identity`. Draft storage does not alter scoring. The final API receives the full reconstructed answer set, validates it with the existing scorer, commits it, and marks the draft complete in the same server-controlled completion flow.

## Error handling

- Invalid, expired, revoked, or replayed invitation links show a recoverable explanation and “Solicitar un nuevo acceso”.
- Invitation claim and redemption are idempotent and safe under duplicate callbacks.
- Draft save failures keep local state visible, show “No pudimos guardar”, and block leaving the question until retry succeeds.
- Draft load failure offers retry and never silently starts over.
- Final submission failure preserves the completed local answers and the server draft.
- Logs include correlation IDs, route, stage, and non-sensitive error codes. Tokens, answers, OAuth data, and personal information are never logged.

## Security

- Invitation tokens are random, high entropy, short-lived, single-use, and stored only as hashes.
- Cookies are HTTP-only, secure in production, same-site Lax, path-scoped where practical, and expire quickly.
- OAuth callback validates state and the invitation claim before redemption.
- Seat allocation and redemption occur atomically in PostgreSQL.
- Draft endpoints use the authenticated user from Supabase, never a client-supplied user ID.
- RLS and payload validation are mandatory before rollout.

## Delivery sequence

### PR 1 — Pilot access

- Invitation schema and atomic claim/redemption functions.
- Signed-link entry route and invitation cookie.
- Correct authentication-state classification.
- Coherent sign-in and public CTA copy.
- Contract and integration tests for valid, expired, revoked, replayed, and full-capacity cases.

### PR 2 — Resumable C1/A1

- Draft schema, RLS, and authenticated draft APIs.
- C1 and A1 checkpoint/resume behavior.
- Canonical C1 reader correction.
- Unit and integration tests for save, reload, resume, completion, and isolation.

### PR 3 — Complete journey E2E

- Seeded test invitation and test identity in isolated CI.
- Browser flow: invitation → LinkedIn test callback → C1 → A1 → reload → resume → results.
- Assertions for persistence, authorization, canonical next route, and no duplicate redemption.
- Production smoke remains read-only and does not create pilot users.

Each PR is independently reversible and must pass TypeScript, production build, existing contracts, and its new tests before merge.

## Acceptance criteria

1. An invited pilot user reaches C1 through the invitation link and LinkedIn without manually copying a code.
2. An uninvited user cannot enter protected assessment routes and receives a clear access-request path.
3. A missing session is not labeled as an authentication verification failure.
4. Refreshing after any C1 or A1 answer resumes with all prior answers intact.
5. Two users cannot read or overwrite each other’s drafts.
6. Completing C1 and A1 creates exactly one canonical completion per assessment attempt.
7. A1 insights consume the canonical C1 response table.
8. Replaying an invitation does not consume another seat or create another pilot membership.
9. The isolated end-to-end test completes the full journey, including a forced reload mid-A1.
10. No known P0/P1 failure remains in the invited-user entry and A1 completion path.

## Rollout and rollback

Deploy migrations before application code. Initially issue links only to internal QA accounts, then Joaquín, then a small pilot cohort. Monitor claim, OAuth callback, draft-save, resume, and completion error codes.

Rollback disables new invitation issuance and restores the previous sign-in UI while leaving additive tables intact. Draft data remains recoverable. No rollback deletes invitations, assessment answers, or user data.
