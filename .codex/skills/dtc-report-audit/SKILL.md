---
name: dtc-report-audit
description: Audit DespegaTuCarrera A1-A4 reports for factual, security, consistency, usability, and evidence gaps. Use when deciding what to improve or diagnosing a suspicious report; do not implement fixes unless requested.
---

# DTC Report Audit

Produce a prioritized, evidence-based gap assessment. If the user asked only for review or diagnosis, remain read-only.

## Inspect four layers

1. **Claim:** inventory scores, counts, labels, recommendations, timestamps, and completion statements visible on A2, A3, A4, and the integral report.
2. **Lineage:** trace each claim through the page, `lib/reports/user-report-data.ts`, query ownership, aggregation, and source relation.
3. **Experience:** inspect populated, empty, partial, error, narrow viewport, desktop, and print states; check meaning, limitations, next action, focus order, contrast, and overflow.
4. **Reality:** compare authenticated rendered output with persisted evidence and confirm another user's records cannot appear.

Do not treat source inspection alone as proof of a live user outcome. Do not mutate production data merely to manufacture an audit fixture.

## Report findings

For each finding provide: severity, affected route/stage, user impact, observed evidence, likely cause, acceptance criterion, and smallest coherent owner skill. Use these priorities:

- **P0:** privacy breach, fabricated personal claim, or destructive corruption.
- **P1:** wrong metric, broken access/export, cross-stage contradiction, or unusable primary state.
- **P2:** unclear interpretation, weak recovery/next action, accessibility, responsive, or print defect.
- **P3:** polish with no material decision impact.

End with a recommended work block and explicitly separate verified facts, inferences, and untested risks. Update the closure ledger only when the request includes project tracking or implementation.
