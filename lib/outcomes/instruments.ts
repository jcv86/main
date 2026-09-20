export const A1_PROFESSIONAL_CLARITY_V1 = {
  outcomeKey: 'professional_clarity',
  instrumentKey: 'a1_professional_clarity',
  instrumentVersion: '1',
  stage: 'a1',
  scale: { min: 0, max: 16 },
  dimensions: [
    'direction_clarity',
    'value_articulation',
    'evidence_specificity',
    'gap_awareness',
  ],
} as const

export const A2_EXECUTION_CAPABILITY_V1 = {
  outcomeKey: 'execution_capability',
  instrumentKey: 'a2_execution_checkpoint',
  instrumentVersion: '1',
  stage: 'a2',
  scale: { min: 0, max: 20 },
  dimensions: [
    'objective_specificity',
    'action_quality',
    'evidence_definition',
    'obstacle_planning',
    'review_discipline',
  ],
} as const

export const A3_INTERVIEW_CAPABILITY_V1 = {
  outcomeKey: 'interview_capability',
  instrumentKey: 'a3_structured_interview',
  instrumentVersion: '1',
  stage: 'a3',
  scale: { min: 0, max: 20 },
  dimensions: [
    'answer_structure',
    'evidence_specificity',
    'question_relevance',
    'clarity_synthesis',
    'challenge_handling',
  ],
} as const

type DimensionMap = Record<string, number>

export interface ComparableObservation {
  instrumentKey: string
  instrumentVersion: string
  score: number | null
  scoreScaleMin: number | null
  scoreScaleMax: number | null
  dimensions: DimensionMap
  observedAt: string
}

function hasExpectedDimensions(
  dimensions: DimensionMap,
  expected: readonly string[],
): boolean {
  return expected.every((key) => {
    const value = dimensions[key]
    return Number.isFinite(value) && value >= 0 && value <= 4
  })
}

export function compareOutcomePair(
  baseline: ComparableObservation,
  followUp: ComparableObservation,
  instrument: typeof A1_PROFESSIONAL_CLARITY_V1 | typeof A2_EXECUTION_CAPABILITY_V1 | typeof A3_INTERVIEW_CAPABILITY_V1,
) {
  const sameInstrument =
    baseline.instrumentKey === instrument.instrumentKey
    && followUp.instrumentKey === instrument.instrumentKey
    && baseline.instrumentVersion === instrument.instrumentVersion
    && followUp.instrumentVersion === instrument.instrumentVersion

  const validScale =
    baseline.scoreScaleMin === instrument.scale.min
    && followUp.scoreScaleMin === instrument.scale.min
    && baseline.scoreScaleMax === instrument.scale.max
    && followUp.scoreScaleMax === instrument.scale.max

  const validScores =
    baseline.score !== null
    && followUp.score !== null
    && baseline.score >= instrument.scale.min
    && baseline.score <= instrument.scale.max
    && followUp.score >= instrument.scale.min
    && followUp.score <= instrument.scale.max

  const validDimensions =
    hasExpectedDimensions(baseline.dimensions, instrument.dimensions)
    && hasExpectedDimensions(followUp.dimensions, instrument.dimensions)

  const chronological =
    Number.isFinite(Date.parse(baseline.observedAt))
    && Number.isFinite(Date.parse(followUp.observedAt))
    && Date.parse(followUp.observedAt) > Date.parse(baseline.observedAt)

  const comparable = Boolean(
    sameInstrument && validScale && validScores && validDimensions && chronological,
  )

  if (!comparable || baseline.score === null || followUp.score === null) {
    return {
      comparable: false,
      normalizedBaseline: null,
      normalizedLatest: null,
      normalizedDelta: null,
    }
  }

  const span = instrument.scale.max - instrument.scale.min
  const normalizedBaseline = ((baseline.score - instrument.scale.min) / span) * 100
  const normalizedLatest = ((followUp.score - instrument.scale.min) / span) * 100

  return {
    comparable: true,
    normalizedBaseline,
    normalizedLatest,
    normalizedDelta: normalizedLatest - normalizedBaseline,
  }
}
