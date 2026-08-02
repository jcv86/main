import type { A2DailyMission } from '@/lib/a2-mission.types'

const MAX_TEXT_LENGTH = 8_000

export interface A2MissionSubmission {
  summary: string
  evidence: string
  reflection: string
  metrics: string
  artifactUrl: string
  completedInstructions: number[]
}

export interface A2MissionValidationCriterion {
  key: 'instructions' | 'summary' | 'evidence' | 'reflection' | 'mission_specific'
  label: string
  score: number
  maxScore: number
  met: boolean
}

export interface A2MissionValidationResult {
  passed: boolean
  score: number
  passScore: number
  mode: 'specialized_day_1' | 'checkpoint' | 'structural'
  errors: string[]
  strengths: string[]
  criteria: A2MissionValidationCriterion[]
  normalized: A2MissionSubmission
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function textValue(value: unknown): string {
  return typeof value === 'string'
    ? value.trim().slice(0, MAX_TEXT_LENGTH)
    : ''
}

function instructionIndexes(value: unknown, total: number): number[] {
  if (!Array.isArray(value)) return []

  return Array.from(
    new Set(
      value
        .map((item) => Number(item))
        .filter(
          (item) => Number.isInteger(item) && item >= 0 && item < total,
        ),
    ),
  ).sort((left, right) => left - right)
}

function validOptionalUrl(value: string): boolean {
  if (!value) return true

  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

function proportionalScore(length: number, target: number, maxScore: number): number {
  if (target <= 0) return maxScore
  return Math.min(maxScore, Math.round((length / target) * maxScore))
}

export function normalizeA2MissionSubmission(
  mission: A2DailyMission,
  value: unknown,
): A2MissionSubmission {
  const source = objectValue(value)

  return {
    summary: textValue(source.summary),
    evidence: textValue(source.evidence),
    reflection: textValue(source.reflection),
    metrics: textValue(source.metrics),
    artifactUrl: textValue(source.artifactUrl),
    completedInstructions: instructionIndexes(
      source.completedInstructions,
      mission.instructions.length,
    ),
  }
}

export function requiresUniversalA2Submission(
  mission: A2DailyMission,
): boolean {
  return mission.day >= 11 && mission.missionType !== 'a3_checkpoint'
}

export function validateA2MissionSubmission(
  mission: A2DailyMission,
  value: unknown,
): A2MissionValidationResult {
  const normalized = normalizeA2MissionSubmission(mission, value)

  if (mission.day === 1) {
    return {
      passed: true,
      score: 100,
      passScore: mission.dtcValidation.passScore || 75,
      mode: 'specialized_day_1',
      errors: [],
      strengths: ['El Día 1 usa su evaluación especializada de cuatro criterios.'],
      criteria: [],
      normalized,
    }
  }

  if (mission.missionType === 'a3_checkpoint') {
    return {
      passed: true,
      score: 100,
      passScore: 100,
      mode: 'checkpoint',
      errors: [],
      strengths: ['El entregable se valida mediante la finalización del módulo de Entrenamiento.'],
      criteria: [],
      normalized,
    }
  }

  const requiredValidation = mission.dtcValidation.required
  const summaryTarget = requiredValidation ? 180 : 100
  const evidenceTarget = requiredValidation ? 140 : 70
  const reflectionTarget =
    mission.missionType === 'debrief' || mission.missionType === 'milestone'
      ? 120
      : 60
  const summaryMinimum = requiredValidation ? 100 : 60
  const evidenceMinimum = requiredValidation ? 80 : 40
  const reflectionMinimum =
    mission.missionType === 'debrief' || mission.missionType === 'milestone'
      ? 80
      : 30
  const instructionRatio =
    mission.instructions.length === 0
      ? 1
      : normalized.completedInstructions.length / mission.instructions.length
  const instructionsScore = Math.round(instructionRatio * 30)
  const summaryScore = proportionalScore(
    normalized.summary.length,
    summaryTarget,
    20,
  )
  const evidenceScore = proportionalScore(
    normalized.evidence.length,
    evidenceTarget,
    25,
  )
  const reflectionScore = proportionalScore(
    normalized.reflection.length,
    reflectionTarget,
    15,
  )

  let missionSpecificScore = 10
  let missionSpecificMet = true
  let missionSpecificLabel = 'Coherencia del entregable'

  if (mission.missionType === 'field_action') {
    missionSpecificLabel = 'Resultado o métrica de la acción real'
    missionSpecificMet = normalized.metrics.length >= 20
    missionSpecificScore = proportionalScore(normalized.metrics.length, 60, 10)
  } else if (
    mission.missionType === 'builder' ||
    mission.missionType === 'coach_forge' ||
    mission.missionType === 'performance_drill'
  ) {
    missionSpecificLabel = 'Activo, práctica o evidencia utilizable'
    missionSpecificMet =
      normalized.artifactUrl.length > 0 || normalized.evidence.length >= evidenceTarget
    missionSpecificScore = missionSpecificMet ? 10 : 5
  }

  const criteria: A2MissionValidationCriterion[] = [
    {
      key: 'instructions',
      label: 'Pasos de la misión completados',
      score: instructionsScore,
      maxScore: 30,
      met: instructionRatio === 1,
    },
    {
      key: 'summary',
      label: 'Resumen concreto del trabajo realizado',
      score: summaryScore,
      maxScore: 20,
      met: normalized.summary.length >= summaryMinimum,
    },
    {
      key: 'evidence',
      label: 'Evidencia o contenido del entregable',
      score: evidenceScore,
      maxScore: 25,
      met: normalized.evidence.length >= evidenceMinimum,
    },
    {
      key: 'reflection',
      label: 'Aprendizaje y siguiente ajuste',
      score: reflectionScore,
      maxScore: 15,
      met: normalized.reflection.length >= reflectionMinimum,
    },
    {
      key: 'mission_specific',
      label: missionSpecificLabel,
      score: missionSpecificScore,
      maxScore: 10,
      met: missionSpecificMet,
    },
  ]

  const errors: string[] = []
  if (instructionRatio !== 1) {
    errors.push('Confirma todos los pasos de la misión antes de continuar.')
  }
  if (normalized.summary.length < summaryMinimum) {
    errors.push(
      `Resume el trabajo realizado con al menos ${summaryMinimum} caracteres.`,
    )
  }
  if (normalized.evidence.length < evidenceMinimum) {
    errors.push(
      `Describe o pega evidencia del entregable con al menos ${evidenceMinimum} caracteres.`,
    )
  }
  if (normalized.reflection.length < reflectionMinimum) {
    errors.push(
      `Registra tu aprendizaje o ajuste con al menos ${reflectionMinimum} caracteres.`,
    )
  }
  if (!validOptionalUrl(normalized.artifactUrl)) {
    errors.push('El enlace del entregable debe comenzar con http:// o https://.')
  }
  if (mission.missionType === 'field_action' && !missionSpecificMet) {
    errors.push('Registra un resultado o métrica concreta de la acción realizada.')
  }

  const score = criteria.reduce((sum, criterion) => sum + criterion.score, 0)
  const passScore =
    mission.dtcValidation.passScore || (requiredValidation ? 70 : 60)
  const strengths = criteria
    .filter((criterion) => criterion.met)
    .map((criterion) => criterion.label)

  return {
    passed: errors.length === 0 && score >= passScore,
    score,
    passScore,
    mode: 'structural',
    errors,
    strengths,
    criteria,
    normalized,
  }
}
