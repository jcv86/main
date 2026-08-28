---
name: dtc-report-quality
description: Run the release gate for DespegaTuCarrera report changes through data contracts, security checks, authenticated browser journeys, export inspection, and deployment evidence. Use before declaring any A1-A4 report improvement complete.
---

# DTC Report Quality

Return an evidence-backed `GO`, `CONDITIONAL_GO`, or `NO_GO`. Scope checks by risk, but never omit factual correctness, user ownership, or the changed rendered state.

## Gate order

1. Review the diff and identify affected claims, sources, identities, routes, viewports, and export surfaces.
2. Run `scripts/check-reporting-contract.ts`, relevant focused stage contracts, TypeScript, and the build check appropriate to the candidate.
3. Verify with an approved authenticated QA identity: A2, A3, A4, and integral report where affected. Compare visible counts and summaries with known persisted evidence.
4. Exercise populated plus relevant empty, partial, legacy, and error states without contaminating production user data.
5. Confirm cross-user isolation at the query/API boundary and inspect recent runtime errors for the exact deployment.
6. When export changed, inspect the generated PDF using `$dtc-report-export` criteria.

Capture route, identity label without credentials, viewport, commit, deployment, time, expected result, observed result, and artifact or log reference. Browser success on a stale deployment is not evidence for the candidate commit.

## Verdict

- `GO`: all release-blocking checks pass with exact candidate/deployment identity.
- `CONDITIONAL_GO`: changed report behavior passes but a documented, bounded non-blocking risk remains.
- `NO_GO`: wrong/fabricated data, privacy failure, primary route/export failure, build failure, runtime regression, or missing proof for a release-blocking state.

Record the verdict and residual risks in `docs/dtc/DTC_CLOSURE_LEDGER.md`. Do not deploy, promote, mutate live data, or retry a failed external mutation without the authorization required for that action.
