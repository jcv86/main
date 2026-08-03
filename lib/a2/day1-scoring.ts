import {
  formatScoringResult,
  scoreDay1Submission,
  type DTCScoringResult,
} from '@/lib/a2-dtc-scoring'

export type Day1Input = Record<string, unknown>

export interface Day1UiScores {
  clarity: number
  logic: number
  realism: number
  actionability: number
}

export interface Day1Analysis {
  totalScore: number
  passed: boolean
  status: 'pass' | 'needs_revision'
  scores: Day1UiScores
  criteria: DTCScoringResult['criteria']
  breakdown: string[]
  recommendations: string[]
  formattedResult: string
  feedback: string
  strengths: string[]
  improvements: string[]
  normalized: {
    visionRole: string
    visionDesiredOutcome: string
    visionEnvironment: string
    milestoneDay10: string
    milestoneDay20: string
    milestoneDay30: string
    actionPlan: Record<string, unknown>
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function firstString(...values: unknown[]): string {
  for (const value of values) {
    const text = asString(value)
    if (text) return text
  }
  return ''
}

/**
 * Converts both the current A2 route-contract payload and the older canonical
 * Day 1 payload into one server-scored representation.
 */
export function analyzeA2Day1Submission(
  userId: string,
  input: Day1Input,
): Day1Analysis {
  const gates = asRecord(input.gates)
  const explicitActionPlan = asRecord(input.actionPlan)
  const fallbackActionPlan = {
    identity: gates.identity ?? null,
    evidence: gates.evidence ?? null,
    material: gates.material ?? null,
    roadmap: input.roadmap ?? null,
  }
  const actionPlan =
    Object.keys(explicitActionPlan).length > 0
      ? explicitActionPlan
      : fallbackActionPlan

  const normalized = {
    visionRole: firstString(input.visionRole, input.targetRole),
    visionDesiredOutcome: firstString(
      input.visionDesiredOutcome,
      input.change30Days,
    ),
    visionEnvironment: firstString(
      input.visionEnvironment,
      input.hypothesis,
      input.mainBlocker,
    ),
    milestoneDay10: firstString(input.milestoneDay10, gates.identity),
    milestoneDay20: firstString(input.milestoneDay20, gates.evidence),
    milestoneDay30: firstString(
      input.milestoneDay30,
      input.roadmap,
      gates.material,
    ),
    actionPlan,
  }

  const result = scoreDay1Submission({
    userId,
    submissionId: `dtc-${userId}-${Date.now()}`,
    ...normalized,
    createdAt: new Date(),
  })
  const formattedResult = formatScoringResult(result)

  return {
    totalScore: result.totalScore,
    passed: result.passed,
    status: result.passed ? 'pass' : 'needs_revision',
    scores: {
      clarity: result.criteria.visionClarity,
      logic: result.criteria.milestoneQuality,
      realism: result.criteria.realism,
      actionability: result.criteria.completeness,
    },
    criteria: result.criteria,
    breakdown: result.breakdown,
    recommendations: result.recommendations,
    formattedResult,
    feedback: formattedResult,
    strengths: result.breakdown,
    improvements: result.recommendations,
    normalized,
  }
}

export function buildDay1PersistencePayload(
  userId: string,
  input: Day1Input,
  analysis: Day1Analysis,
  now: string,
) {
  return {
    user_id: userId,
    vision_role: analysis.normalized.visionRole,
    vision_environment: analysis.normalized.visionEnvironment,
    vision_desired_outcome: analysis.normalized.visionDesiredOutcome,
    milestone_day10: analysis.normalized.milestoneDay10,
    milestone_day20: analysis.normalized.milestoneDay20,
    milestone_day30: analysis.normalized.milestoneDay30,
    action_plan: {
      ...analysis.normalized.actionPlan,
      original_submission: input,
    },
    analysis_score: analysis.totalScore,
    pass_fail_status: analysis.status,
    analysis_status: 'completed',
    analysis_result: {
      criteria: analysis.criteria,
      scores: analysis.scores,
      breakdown: analysis.breakdown,
      recommendations: analysis.recommendations,
    },
    current_step: 8,
    completed_steps: [1, 2, 3, 4, 5, 6, 7, 8],
    updated_at: now,
    completed_at: analysis.passed ? now : null,
  }
}
