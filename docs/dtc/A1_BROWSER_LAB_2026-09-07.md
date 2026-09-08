# A1 browser laboratory — implementation candidate

Base: `c35788cd164024a5a106f954578ba82481a5b70d`, existing PR #134. This block adds a repeatable disposable integration harness; it does not publish the app or mutate the connected Supabase project.

## Exact scope

Run real Supabase Auth, signed sessions/JWT, PostgREST and PostgreSQL locally in a GitHub Actions runner. Four synthetic users are created through local Auth only with confirmed addresses under example.invalid and an ephemeral password. No emails, external models or remote database are used. Test tools are installed in runner temporary storage; application dependency versions are not changed.

The lab copies the actual A1 save and clarification route exports without editing them, actual report/Career components, source loaders, SQL migrations and CSS. It supplies a small page shell and login form instead of the complete production app. C1/C2 capture is seeded; pilot admission is a local allowlist fixture. Typography uses a declared system fallback. The production middleware, complete onboarding, journey progression, integral A2–A4 route, Vercel protection and production font loading are NOT tested by this harness.

## Intended evidence

Browser login/cookies; anonymous rejection; successful HTTP save through the SQL writer; rendering after save; optional partial clarifications, reload, withdrawal, stale second-tab conflict/recovery; identity source parity; real JWT cross-owner PostgREST reads/updates; missing-cookie rejection; desktop and 390px mobile overflow; automated accessibility; print isolation; synthetic PDF and screenshot artifacts.

Only evidence directory artifacts are uploaded. Environment/status files, cookies, credentials, traces and private server logs are excluded. Browser requests outside loopback are blocked. Lab setup refuses an existing lab or an existing assessment schema. Cleanup targets only the explicitly local temporary stack. No Supabase link, db push or remote project identifier is used.

## Release status

Results must be read from the actual final run, not inferred from this document. Passing this laboratory advances integration assurance but does not close authenticated Preview/production QA or psychometric validation. RLS and writer migrations already applied to the connected project remain unchanged. Keep PR #134 in draft until the remaining release gates have evidence.
