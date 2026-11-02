/**
 * Day 1 completion contract. Legacy numeric keys remain for database/API
 * compatibility; all are field-presence checks, never estimates of quality.
 */

export interface DTCCriteria {
  visionClarity: number // 0-25 points
  milestoneQuality: number // 0-25 points
  completeness: number // 0-25 points
  realism: number // 0-25 points
}

export interface DTCScoringResult {
  totalScore: number // 0-100
  passed: boolean // all required fields present
  criteria: DTCCriteria
  breakdown: string[] // Human-readable feedback per criterion
  recommendations: string[] // What to improve
  timestamp: Date
}

export interface Day1Submission {
  userId: string
  submissionId: string
  visionRole: string
  visionDesiredOutcome: string
  visionEnvironment: string
  milestoneDay10: string
  milestoneDay20: string
  milestoneDay30: string
  actionPlan: Record<string, unknown>
  documentUrl?: string
  createdAt: Date
}

/**
 * Compatibility contract: these four numbers record presence of fields only.
 * They do not estimate clarity, realism, quality or execution capability.
 */
export function scoreDay1Submission(submission: Day1Submission): DTCScoringResult {
  const present = (value: unknown) => typeof value === 'string' && value.trim().length > 0
  const vision = [submission.visionRole, submission.visionDesiredOutcome, submission.visionEnvironment].every(present)
  const milestones = [submission.milestoneDay10, submission.milestoneDay20, submission.milestoneDay30].every(present)
  const plan = submission.actionPlan && Object.values(submission.actionPlan).some((value) =>
    typeof value === 'string' ? present(value) : Array.isArray(value) ? value.some(present) : Boolean(value && typeof value === 'object' && Object.keys(value).length),
  )
  const complete = vision && milestones && Boolean(plan)
  const criteria: DTCCriteria = {
    visionClarity: vision ? 25 : 0,
    milestoneQuality: milestones ? 25 : 0,
    completeness: complete ? 25 : 0,
    realism: plan ? 25 : 0,
  }
  const checks = [
    [vision, 'Objetivo, resultado y contexto registrados', 'Completa objetivo, resultado esperado y contexto.'],
    [milestones, 'Revisiones de días 10, 20 y 30 registradas', 'Registra qué revisarás en los días 10, 20 y 30.'],
    [Boolean(plan), 'Primera acción registrada', 'Registra una acción concreta para empezar.'],
  ] as const
  return {
    totalScore: Object.values(criteria).reduce((sum, value) => sum + value, 0),
    passed: complete,
    criteria,
    breakdown: checks.filter(([met]) => met).map(([, label]) => label),
    recommendations: checks.filter(([met]) => !met).map(([, , action]) => action),
    timestamp: new Date(),
  }
}

export function formatScoringResult(result: DTCScoringResult): string {
  return [
    result.passed ? 'Tu acuerdo inicial tiene los campos registrados.' : 'Tu acuerdo inicial tiene campos pendientes.',
    'Este control no evalúa la calidad ni la viabilidad del plan. Revisa ambas al practicar y contrastar tus evidencias.',
    ...result.breakdown,
    ...result.recommendations,
  ].join('\n')
}
