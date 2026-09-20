# Outcome Instruments S1 — A1 + A3

Date: 2026-09-20
Status: instrument specification
Depends on: Outcome Engine S1 foundation

## Measurement principles

1. Baseline and follow-up must measure the same construct with the same rubric version.
2. A score is not an outcome unless evidence is comparable.
3. User self-confidence is useful context but cannot replace demonstrated performance.
4. AI may assist scoring only against an explicit rubric; instrument version and evidence must persist.
5. No hidden personality or employability ranking.
6. A follow-up may show no improvement or decline; DTC must render that honestly.

## A1 instrument: Professional Clarity v1

Outcome key: professional_clarity
Instrument key: a1_professional_clarity
Version: 1

The user answers the same four short performance prompts at baseline and follow-up:

1. Target: state the kind of role/problem/environment they are pursuing.
2. Value: explain the professional value they can create in that context.
3. Evidence: support the claim with concrete prior evidence.
4. Gap: identify the most important current development gap and why it matters.

Rubric dimensions, each 0–4:

- direction_clarity
- value_articulation
- evidence_specificity
- gap_awareness

Total raw score: 0–16.
Normalized score: raw / 16 * 100.

Anchors:
- 0: absent / unusable;
- 1: vague assertion;
- 2: partially specific but weakly supported;
- 3: clear and evidence-linked;
- 4: precise, coherent, evidence-linked and decision-useful.

Baseline timing: before the A1 assessment/report is revealed.
Follow-up timing: after the user has reviewed the A1 report and completed the A1 closing reflection.

The DISC result is never scored as improvement.

Minimum evidence for a displayed delta:
- both observations exist;
- instrument_key and instrument_version match;
- all four dimensions are present;
- both scores use 0–16;
- follow-up occurred after baseline.

Confidence:
- high: all four dimensions have direct evidence and rubric scoring completed;
- medium: one dimension has limited evidence;
- insufficient: more than one dimension lacks scorable evidence.

## A3 instrument: Interview Capability v1

Outcome key: interview_capability
Instrument key: a3_structured_interview
Version: 1

Baseline and follow-up use different prompt wording but the same prompt blueprint and rubric to reduce simple memorization.

Blueprint:
- one behavioral question requiring a concrete example;
- one value/fit question;
- one challenge/follow-up question.

Rubric dimensions, each 0–4:

- answer_structure
- evidence_specificity
- question_relevance
- clarity_synthesis
- challenge_handling

Total raw score: 0–20.
Normalized score: raw / 20 * 100.

Anchors:
- 0: no usable response;
- 1: mostly generic / unsupported;
- 2: partially structured or partially evidenced;
- 3: clear, relevant and supported;
- 4: concise, specific, adaptive and strongly evidenced.

Baseline timing: before A3 training modules.
Follow-up timing: after the final comparable checkpoint.

A3 module scores remain training telemetry. They are not substituted for this outcome instrument.

Minimum evidence for a displayed delta:
- both observations use a3_structured_interview v1;
- all five dimensions are present;
- score scale is 0–20;
- baseline and follow-up use the same evaluator contract;
- follow-up occurs after baseline.

## User-facing scorecard language

When comparable:

“Tu evidencia de progreso”
- baseline;
- latest comparable measurement;
- observed delta;
- strongest improved dimension;
- dimension needing more evidence/work;
- evidence count;
- confidence;
- next action.

Use “cambio observado”, not “DTC te hizo mejorar”.

When not comparable:

“Todavía no tenemos una medición comparable para afirmar mejora.”

## Next Best Action S1

NBA remains rule-based and transparent.

A1 examples:
- low evidence_specificity → build two quantified career examples;
- low direction_clarity → refine target-role hypothesis;
- low gap_awareness → evidence-based gap review.

A3 examples:
- low answer_structure → STAR/structured-answer practice;
- low evidence_specificity → evidence bank exercise;
- low challenge_handling → difficult-question simulation.

No recommendation may depend solely on overall score if a lower-confidence dimension is driving the result.

## Calibration gate

Before using deltas for product claims:
- manually review a small sample of paired scores;
- verify rubric consistency;
- inspect floor/ceiling effects;
- inspect missingness;
- compare AI-assisted score with a second independent rubric pass where feasible;
- freeze v1 only after material scoring ambiguities are resolved.

Changing anchors or dimension meaning requires a new instrument version.
