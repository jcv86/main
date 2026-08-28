---
name: dtc-report-contract
description: Define or change DespegaTuCarrera report data sources, metric semantics, aggregation, ownership, freshness, and empty states. Use before implementing report calculations or cross-stage summaries.
---

# DTC Report Contract

Make every report value explainable from persisted, user-owned evidence. Start from `lib/reports/user-report-data.ts`, the relevant route under `app/despega/`, and the Supabase migrations that define the queried relations.

## Establish the contract

For every metric, section, or recommendation, record in code or a focused test:

- source relation and selected fields;
- ownership predicate, normally `user_id = authenticated user` enforced server-side;
- inclusion, exclusion, deduplication, and ordering rules;
- unit, denominator, range, rounding, and null behavior;
- freshness or evidence timestamp;
- meaning and limitation visible to the user;
- states for absent, partial, legacy, malformed, and failed data.

Prefer deterministic pure functions for derived metrics. Never substitute seeded/demo values, random classifications, inferred personal claims, or a default score for missing evidence. Guidance is allowed only when visually distinct from measured results.

## Preserve stage semantics

- A2 represents distinct completed days and its 30/60/90 reviews; do not inflate completion with duplicate writes.
- A3 represents the latest completed attempt per canonical module while retaining the distinction from total attempts.
- A4 represents verified signals, decisions, and user-owned documents; zero evidence is a valid result, not an error.
- The integral report summarizes stage contracts without silently redefining them.

## Verify

Extend `scripts/check-reporting-contract.ts` or add a focused behavioral contract that exercises the calculation, not generated wording. Include duplicate, empty, partial, malformed, and cross-user fixtures when relevant. Run the focused contract and TypeScript before handing the change to `$dtc-report-quality`.
