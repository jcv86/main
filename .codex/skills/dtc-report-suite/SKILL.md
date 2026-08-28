---
name: dtc-report-suite
description: Coordinate an end-to-end improvement or closure of DespegaTuCarrera A1-A4 reports when the request spans data accuracy, UX, export, and release evidence. Do not use for a single isolated copy or styling edit.
---

# DTC Report Suite

Turn a report request into one coherent, evidence-backed block of work. Treat `docs/dtc/DTC_CLOSURE_LEDGER.md` as the release record and `lib/reports/user-report-data.ts` as the current shared reporting boundary.

## Route the work

1. Use `$dtc-report-audit` first when the defect or opportunity is unclear.
2. Use `$dtc-report-contract` before changing metrics, sources, aggregation, ownership, or empty states.
3. Use `$dtc-report-story` for hierarchy, interpretation, limitations, and next actions.
4. Use `$dtc-report-export` when print, PDF, or portable evidence is in scope.
5. Finish every material change with `$dtc-report-quality`.

Skip a specialist only when its concern is demonstrably unaffected. Do not duplicate its detailed procedure here.

## Definition of done

A report improvement is closed only when:

- every displayed claim traces to user-owned persisted evidence or is clearly labeled as guidance;
- A2, A3, A4, and the integral report remain mutually consistent;
- missing, partial, stale, and failed data have truthful states;
- the page explains meaning, limitation, and one useful next action;
- focused contracts, type checks, build-relevant checks, and authenticated browser verification appropriate to the risk pass;
- the closure ledger records the exact commit, deployment when applicable, evidence, residual risk, and verdict.

Live database changes, external publication, production deployment, and destructive actions still require the authorization appropriate to that action. Stop after a failed high-risk mutation; diagnose before retrying.
