# Outcome Engine S1 — evidence-first product design

Date: 2026-09-20
Status: design gate before implementation
Scope: C1 → A4 user outcomes

## Why this exists

DTC now has strong evidence that the product works technically. That is not the same as evidence that users are better off after using it.

The next product phase separates four concepts:

1. Activity — the user opened, completed or repeated something.
2. Output — DTC produced an artifact, score, report or route.
3. Capability outcome — comparable evidence shows the user can do something better.
4. Career outcome — an externally meaningful career state changed.

A completion percentage, XP total or number of modules is not by itself a user outcome.

## North Star

DTC helps a person understand their professional position, choose a direction, improve demonstrable career capabilities, and make better career decisions using evidence.

For each user the product should answer:

- What was the baseline?
- What changed?
- What evidence supports that change?
- How confident are we?
- What is the highest-value next action?
- Did a meaningful career outcome eventually occur?

## Audit of the current product

### C1 / A1 — understanding and direction

Current production has 24 persisted A1 cerebral assessments. C1 context and A1's 28-question assessment feed a canonical professional report with provenance and incomplete-data behavior.

This proves that DTC can persist and interpret a structured professional self-assessment. It does not prove that the user became more self-aware, made a better career decision, or can articulate professional identity more clearly after A1.

S1 outcome key: professional_clarity.

Evidence should compare a short pre-A1 and post-A1 task using the same rubric:
- target-role clarity;
- ability to state professional value;
- evidence supporting strengths;
- awareness of development gaps;
- confidence calibrated to evidence.

The DISC profile remains context, not the outcome score.

### A2 — capability building

A2 has a 90-day mission system, persisted evidence, structural/specialized/checkpoint validation, scores, pass thresholds and cycle reviews.

This proves users can complete validated work and build artifacts. Current dashboard averages mix different missions, so a higher average across later tasks is not automatically a valid before/after capability comparison.

S1 outcome key: execution_capability.

Use repeated comparable checkpoints. Outcome claims require the same construct/rubric at baseline and follow-up. Report baseline, latest comparable score, delta, number of comparable observations, evidence references and confidence.

### A3 — interview readiness

Current production has 10 persisted A3 attempts and all 10 are completed. Attempts persist scores, feedback, transcripts and deliverables.

This proves structured interview-training completion. Different A3 modules are not interchangeable measurements, so a module-10 score minus a module-1 score is not automatically a valid learning delta.

S1 outcome key: interview_capability.

Introduce a comparable baseline and follow-up assessment with the same rubric:
- answer structure;
- evidence specificity;
- relevance;
- clarity and synthesis;
- handling challenge/follow-up.

Persist rubric version so evaluator changes cannot masquerade as user improvement.

### A4 — decision quality and real-world outcomes

A4 already has verified signals, decision rationale, expected evidence, review dates, outcomes and evidence snapshots.

Current production has 0 A4 decisions and therefore 0 reviewed A4 outcomes.

S1 outcome key: career_decision_quality.

A decision becomes evaluable only when reviewed against observed evidence. Track descriptive outcomes such as decision maintained/changed/abandoned, expected evidence observed/not observed/inconclusive, application, recruiter response, interview, process advancement, offer, accepted offer, and deliberate decision not to pursue.

DTC must not claim causal attribution for market outcomes it did not cause.

## Critical finding: legacy readiness score is not an outcome

lib/readiness-score.ts constructs a 0–100 score largely from completion: A1 completion/DISC threshold, A2 route completion/weeks in progress, A3 feature completion and A4 being active. It can recommend “ready to apply actively”.

That is a readiness/completeness heuristic, not demonstrated readiness. Outcome Engine must not reuse it as a North Star or evidence of transformation.

S1 should retire it from user-facing outcome claims or rename it explicitly to journey_completeness and keep it separate from evidence-based outcome scores.

## Outcome evidence model

Add an owner-bound model rather than overloading analytics.

dtc_outcome_observations:
- id
- user_id
- outcome_key
- stage
- measurement_role: baseline | follow_up | external_outcome
- instrument_key
- instrument_version
- score nullable
- score_scale_min nullable
- score_scale_max nullable
- dimensions jsonb
- evidence_refs jsonb
- confidence nullable
- observed_at
- created_at

No free-form private assessment answer is required here. Evidence references point to existing owner-bound sources.

dtc_outcome_snapshots, derived server-side:
- user_id
- outcome_key
- baseline_observation_id
- latest_observation_id
- normalized_baseline
- normalized_latest
- normalized_delta
- comparable boolean
- confidence
- next_best_action_key
- computed_at

The server must refuse a numeric delta when instrument/version/construct are not comparable.

## User experience

Create one reusable “Tu evidencia de progreso” card.

Preferred state:
- outcome name;
- baseline;
- latest comparable measurement;
- observed change;
- evidence count/version;
- confidence;
- next action.

When evidence is insufficient, explicitly say that there is not yet a comparable measurement to claim improvement.

## Outcome dashboard

Separate activation/funnel from:
- baseline coverage;
- users with comparable follow-up;
- median observed delta by outcome;
- distribution of deltas;
- time to first capability improvement;
- external career outcomes;
- evidence confidence;
- missing-data rate.

Never infer that DTC caused an interview, offer or salary change from temporal association alone.

## S1 implementation order

1. Freeze outcome taxonomy and rubric definitions.
2. Add owner-bound outcome observation/snapshot schema with RLS.
3. Add A1 professional-clarity baseline/follow-up instrument.
4. Add A3 comparable interview baseline/follow-up instrument.
5. Derive A2 outcomes only from genuinely comparable checkpoints.
6. Turn A4 reviewed decisions into external outcome observations.
7. Add user-facing Outcome Scorecard.
8. Add admin Outcome Dashboard.
9. Run a small pilot and inspect missingness/calibration before changing recommendations.
10. Only then use outcomes to influence Next Best Action.

## Non-goals

- no universal career score;
- no claim that DTC caused employment outcomes;
- no ranking users against each other;
- no opaque AI-only score;
- no replacement of source evidence;
- no gamification reward for an outcome;
- no recommendation optimization until measurement quality is demonstrated.

## S1 acceptance gate

S1 is not complete until:
- baseline and follow-up are comparable by contract;
- every displayed delta links to evidence;
- insufficient evidence renders honestly;
- RLS/cross-owner tests pass;
- rubric/version provenance is persisted;
- outcome analytics are aggregate and privacy-preserving;
- at least one real user completes baseline → follow-up → scorecard → next action;
- no legacy completeness metric is presented as demonstrated outcome.
