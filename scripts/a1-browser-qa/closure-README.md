# Closure acceptance in disposable local Supabase

This phase runs **after** the existing invitation, runtime boundary, report,
journey-map and operational-correlation suites. It preserves those tests and
their original minimal application. Only after they finish does it replace the
temporary application's shell with the actual `/despega` layout, AppShell,
Providers and contexts, and copy the six capture pages and their real APIs.

## What the acceptance gate executes

1. `closure-prepare.mjs` checks the temporary directory, an existing local stack,
   loopback URLs and the absence of a linked project. It copies application
   sources unchanged and records SHA-256 hashes in `closure-scope.json`.
2. `closure-seed.ts` verifies the four previous synthetic Auth users as a stack
   sentinel. It applies the canonical journey foundation/security, outcome
   foundation/payload, and saved labor objective migrations. Two **new** owners
   are created through the real local Auth admin API. No outcome observations
   are preinserted.
3. `closure-browser.mjs` signs in through the laboratory password form, using
   the actual Supabase browser client, SSR cookies, JWT verification, PostgREST
   and PostgreSQL. All six forms are saved, refreshed, read back, and continued
   to actual A1/A2/A3 pages. Refresh and continuation must preserve exactly one
   record for that instrument and role and must not issue another POST.
4. Both owners read through real JWT clients. The second owner cannot read the
   first owner's answers. Anonymous reads and direct authenticated outcome
   inserts/updates/deletes must be denied. The actual route accepts an identical
   UUID retry, rejects a changed payload or another owner's colliding UUID, and
   rejects client-selected identity and cross-origin writes.
5. The actual journey service/map must recognize `2-capture` records when
   choosing A1, A2 and A3 follow-up links and stop offering a completed capture.
   A2 day 30 and A3 route closure are explicitly seeded milestones, **not**
   claims that this test completed the training activities.
6. `closure-objective.mjs` calls the actual saved-objective GET/POST from two
   independently authenticated browser sessions. It verifies persistence,
   role/area/industry separation, owner RLS, and one successful update plus one
   HTTP 409 when both sessions submit the same old revision. Omitted advanced
   preferences must remain stored. No vacancy provider is contacted.
7. The actual early objective page is opened by the personal-path owner before
   A2/A4 access. Keyboard operations add a role and area, select preferences,
   save, refresh and continue from a recovered summary. This page is also
   captured and checked by axe at both widths. It must make no catalog/matching
   request, preserve journey flags/state and still receive HTTP 403 from the
   real A4 catalog endpoint before and after saving. Before opening A2, the same
   authenticated pilot must also receive HTTP 403 from both real practice writers
   (`complete-day` and `practice-adjustments`), with no completion inserted.

The capture version stores free-text evidence with null scores, scale bounds
and confidence, empty dimensions, and no generated outcome snapshots. The gate
checks these conditions in the database as well as the API responses.

## Visual evidence and accessibility

Every capture page is checked at **390 × 844** and **1440 × 1000**, both with
answers entered and after the saved answers have been recovered. Screenshots
include the actual AppShell. Axe checks WCAG 2 A/AA and 2.1 AA rules and rejects
serious/critical violations; all returned violations are recorded. Horizontal
overflow and the mobile navigation open/close behavior are checked separately.
After a viewport change, the test waits for two rendering frames before measuring
overflow so that responsive CSS corresponds to the reported viewport width.
Screenshots and text-free element geometry are retained even if overflow fails.
Screenshots start at the top so a sticky header is not captured midway down a
full-page image after filling the final textarea.

This is an automated regression gate, not a claim of comprehensive WCAG
conformance or a substitute for human accessibility testing.

## Boundaries

- The root HTML wrapper, fallback fonts and password sign-in form remain
  laboratory-specific. `/despega/layout.tsx`, AppShell, Providers, contexts,
  capture pages and tested route handlers are copied unchanged.
- Supporting source tables have minimal synthetic fixture schemas. The
  canonical **outcome** SQL/policies/grants are applied without replacement or
  widening; the seed checks forced RLS, owner-only SELECT and server INSERT.
- The old source-fixture journey write policy is removed before this phase.
  The canonical journey initializer and owner SELECT policy then apply.
- Next is restarted between bounded stages while real Auth cookies remain in
  the browser contexts. This keeps the test workload below the unchanged
  in-memory API limiter; it does not validate distributed production limiting.
- Browser requests can reach only literal localhost/127.0.0.1. The Next process
  receives an explicit local environment, with no inherited external provider
  credentials. Database access is guarded separately against remote URLs.
- No production environment, remote migration, external OAuth exchange,
  Vercel deployment, psychometric validity or live job-source quality is tested.

## Evidence and execution status

GitHub Actions is the executor for this gate. A local source/type check cannot
substitute for its real Auth/JWT/RLS verdict when Docker is unavailable.

Uploaded files are limited to synthetic screenshots and sanitized
`closure-scope.json`, `closure-seed.json` and `closure-results.json`. Passwords,
API keys, cookies, storage state, HAR, authenticated traces and private server
logs are never put in the evidence directory. The two credential fixtures and
server logs remain under the disposable root and are not uploaded.

The workflow runs the phase with:

```sh
node scripts/a1-browser-qa/closure-prepare.mjs
npx tsx scripts/a1-browser-qa/closure-seed.ts
node scripts/a1-browser-qa/closure-browser.mjs
```

It requires the existing preceding setup with `A1_BROWSER_LAB=yes`,
`A1_LAB_ROOT` beneath `RUNNER_TEMP`, `A1_TOOLS_ROOT`, the disposable stack's
`status.json` and the original synthetic fixture file. It refuses an arbitrary
application directory or a linked/remote Supabase project.
