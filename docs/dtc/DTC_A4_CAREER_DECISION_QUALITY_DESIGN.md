# A4 Career Decision Quality — outcome design

Date: 2026-09-20
Status: design gate

## Principle

A4 already has the strongest real-world outcome substrate in DTC: verified signals, a decision, rationale, expected evidence, review date and observed outcome.

Do not invent a universal numeric career-success score.

A4 should answer two separate questions:

1. Was the decision process evidence-disciplined?
2. What externally meaningful result was later observed?

## Outcome key

career_decision_quality

Unlike A1–A3, this outcome is primarily event/review based. A baseline/follow-up numeric delta is not required for every decision.

## Decision-quality contract

A decision is eligible for outcome review only when it has:

- a verified/traceable signal;
- explicit decision;
- rationale;
- expected evidence;
- review date;
- observed outcome at/after review.

The review classifies the result descriptively:

- evidence_supported
- evidence_not_supported
- inconclusive
- decision_changed
- decision_abandoned

This classification is about whether the decision's expected evidence materialized, not whether the person “won” or “lost”.

## External career outcomes

A reviewed decision may additionally record zero or more descriptive external outcomes:

- application_submitted
- recruiter_response
- interview_reached
- process_advanced
- offer_received
- offer_accepted
- opportunity_declined
- no_external_change

These are observations, not causal claims.

DTC must say “observed after this decision”, never “caused by DTC”.

## Decision quality dimensions

For coaching/diagnostic feedback, a decision may be evaluated on 0–4 dimensions:

- evidence_grounding
- rationale_clarity
- falsifiability
- review_discipline

These dimensions describe the quality of the decision process. They are not an employability score and are not combined with salary, interviews or offers into one universal score.

## Current production baseline

At the time of this design, DTCFINAL has no A4 decisions and no reviewed A4 outcomes. Therefore the correct product state is “sin evidencia suficiente”, not a zero-quality score.

## UX

Add an “Outcome review” state to each decision when review_on is due.

The user records:

- what actually happened;
- whether expected evidence appeared;
- optional external career outcomes;
- whether the decision is maintained, adapted or closed.

Then show:

“Resultado observado”
- decision;
- expected evidence;
- observed evidence;
- classification;
- external outcomes;
- reviewed date.

Do not celebrate an offer as proof that the original decision logic was sound if expected evidence was not observed. Conversely, a well-grounded decision can remain high-quality even if the market outcome is unfavorable.

## Outcome Engine mapping

On completed review, server creates an external_outcome observation:

- outcome_key: career_decision_quality
- stage: a4
- measurement_role: external_outcome
- instrument_key: a4_decision_review
- instrument_version: 1
- evidence_refs: decision id + signal id
- dimensions: decision-quality dimensions when available
- response_payload: descriptive review fields
- score may remain null when dimensions are incomplete

No normalized delta is required for an external_outcome-only observation.

## Aggregate dashboard

Report separately:

- decisions created;
- decisions reviewed on time;
- evidence-supported / unsupported / inconclusive;
- decision changed / abandoned;
- external outcome counts;
- median time decision → review;
- missing review rate.

Never report “DTC success rate” from offers/interviews without a causal design.

## Acceptance gate

- outcome cannot be recorded before review date unless user explicitly closes/abandons the decision;
- every outcome references the source decision and signal;
- external outcome taxonomy is enumerated;
- free-form observed result remains private owner-bound evidence;
- no offer/interview is attributed causally to DTC;
- zero A4 data renders as insufficient evidence, not failure;
- reviewed outcomes remain editable only through the authenticated A4 decision workflow, with audit timestamps.
