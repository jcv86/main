import assert from 'node:assert/strict'
import {
  A1_PROFESSIONAL_CLARITY_V1,
  A3_INTERVIEW_CAPABILITY_V1,
  compareOutcomePair,
} from '../lib/outcomes/instruments'

const a1Baseline = {
  instrumentKey: 'a1_professional_clarity',
  instrumentVersion: '1',
  score: 8,
  scoreScaleMin: 0,
  scoreScaleMax: 16,
  dimensions: {
    direction_clarity: 2,
    value_articulation: 2,
    evidence_specificity: 2,
    gap_awareness: 2,
  },
  observedAt: '2026-09-20T10:00:00Z',
}
const a1FollowUp = {
  ...a1Baseline,
  score: 12,
  dimensions: {
    direction_clarity: 3,
    value_articulation: 3,
    evidence_specificity: 3,
    gap_awareness: 3,
  },
  observedAt: '2026-09-20T12:00:00Z',
}

const a1 = compareOutcomePair(a1Baseline, a1FollowUp, A1_PROFESSIONAL_CLARITY_V1)
assert.equal(a1.comparable, true)
assert.equal(a1.normalizedBaseline, 50)
assert.equal(a1.normalizedLatest, 75)
assert.equal(a1.normalizedDelta, 25)

assert.equal(
  compareOutcomePair(
    a1Baseline,
    { ...a1FollowUp, instrumentVersion: '2' },
    A1_PROFESSIONAL_CLARITY_V1,
  ).comparable,
  false,
)

assert.equal(
  compareOutcomePair(
    a1Baseline,
    { ...a1FollowUp, dimensions: { direction_clarity: 3 } },
    A1_PROFESSIONAL_CLARITY_V1,
  ).normalizedDelta,
  null,
)

const a3Baseline = {
  instrumentKey: 'a3_structured_interview',
  instrumentVersion: '1',
  score: 10,
  scoreScaleMin: 0,
  scoreScaleMax: 20,
  dimensions: {
    answer_structure: 2,
    evidence_specificity: 2,
    question_relevance: 2,
    clarity_synthesis: 2,
    challenge_handling: 2,
  },
  observedAt: '2026-09-20T10:00:00Z',
}
const a3FollowUp = {
  ...a3Baseline,
  score: 15,
  dimensions: {
    answer_structure: 3,
    evidence_specificity: 3,
    question_relevance: 3,
    clarity_synthesis: 3,
    challenge_handling: 3,
  },
  observedAt: '2026-09-20T12:00:00Z',
}

assert.equal(
  compareOutcomePair(a3Baseline, a3FollowUp, A3_INTERVIEW_CAPABILITY_V1).normalizedDelta,
  25,
)

assert.equal(
  compareOutcomePair(
    a3Baseline,
    { ...a3FollowUp, observedAt: '2026-09-20T09:00:00Z' },
    A3_INTERVIEW_CAPABILITY_V1,
  ).comparable,
  false,
)

console.log(JSON.stringify({
  a1ComparableDelta: true,
  a3ComparableDelta: true,
  versionMismatchFailsClosed: true,
  missingDimensionFailsClosed: true,
  chronologyFailsClosed: true,
}))
