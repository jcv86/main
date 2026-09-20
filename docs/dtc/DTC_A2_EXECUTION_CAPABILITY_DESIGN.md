# A2 Execution Capability — comparability audit

Date: 2026-09-20
Status: design gate; no user-facing delta yet

## Finding

A2 has rich validated activity and evidence, but its 90 missions intentionally measure different things:
clarity, market intelligence, evidence extraction, asset building, field action, drills, debriefs and milestones.

Therefore:

- Day 1 score vs Day 30/60/90 score is not automatically comparable.
- Average mission score over time is not a valid capability delta.
- Completion, XP and streaks are activity/progress, not execution capability.
- A3 checkpoint scores belong to Interview Capability and must not be reused as A2 outcome evidence.

## Existing useful anchors

The catalog already contains milestone/checkpoint semantics and Day 1 has an explicit 4×25 scoring model:
vision clarity, milestone quality, completeness and realism/coherence.

Those dimensions are valuable for route quality, but they do not repeat unchanged across the current 90-day catalog.

## Decision

Do **not** manufacture an A2 outcome from existing heterogeneous mission scores.

Execution Capability v1 should use a dedicated repeated performance task at two or more milestone points, independent from the daily mission score.

Instrument proposal:

- outcome_key: execution_capability
- instrument_key: a2_execution_checkpoint
- version: 1
- scale: 0–20
- measurement points: baseline + milestone follow-up(s)

Same prompt blueprint at every measurement:

1. Choose one concrete professional objective for the next 7 days.
2. Break it into observable actions.
3. Define evidence that would prove completion/impact.
4. Identify one likely obstacle and a contingency.
5. Define the review rule: what result would make you continue, adapt or stop.

Rubric dimensions 0–4:

- objective_specificity
- action_quality
- evidence_definition
- obstacle_planning
- review_discipline

This measures the ability to convert a professional intention into an evidence-bearing execution loop.

## Placement

Baseline: immediately before the user begins the A2 daily route.

Follow-up 1: after the first meaningful A2 milestone, not merely after N completions.

Follow-up 2+: optional at later milestones using the same instrument version.

A numeric delta is allowed only against the baseline using the same five dimensions and scale.

## Why not reuse Day 1 DTC score

Day 1 currently evaluates route-plan quality with vision clarity, milestone quality, completeness and realism/coherence. It is useful operational evidence, but the proposed execution instrument has a narrower construct and repeatable measurement contract.

Changing Day 1 retrospectively into a baseline would mix constructs and invalidate comparability.

## Acceptance gate

A2 Execution Capability cannot be called implemented until:

- the baseline is placed before A2 training exposure;
- a follow-up is tied to a verified milestone;
- both use identical instrument/version/rubric;
- the response evidence is private and owner-bound;
- server-side validation requires all five evidence fields;
- no daily mission average is displayed as improvement;
- no A3 score is reused;
- the scorecard clearly distinguishes activity progress from capability change.
