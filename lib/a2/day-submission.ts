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
  return mission.practiceTrack === 'persona' || (mission.day >= 11 && mission.missionType !== 'a3_checkpoint')
}

export function validateA2MissionSubmission(
  mission: A2DailyMission,
  value: unknown,
): A2MissionValidationResult {
  const normalized = normalizeA2MissionSubmission(mission, value)

  if (mission.day === 1 && mission.practiceTrack !== 'persona') {
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

  // Compatibility numbers describe field coverage only. They are never an
  // assessment of quality, skill, truthfulness or learning.
  const instructionRatio = mission.instructions.length === 0
    ? 1 : normalized.completedInstructions.length / mission.instructions.length
  const instructionsScore = instructionRatio === 1 ? 30 : 0
  const summaryMet = Boolean(normalized.summary)
  const evidenceMet = Boolean(normalized.evidence)
  const reflectionMet = Boolean(normalized.reflection)
  const missionSpecificMet = mission.missionType !== 'field_action' || Boolean(normalized.metrics)
  const missionSpecificLabel = mission.missionType === 'field_action'
    ? 'Resultado observado registrado' : 'Entregable registrado'

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
      label: 'Trabajo realizado registrado',
      score: summaryMet ? 20 : 0,
      maxScore: 20,
      met: summaryMet,
    },
    {
      key: 'evidence',
      label: 'Contenido del entregable registrado',
      score: evidenceMet ? 25 : 0,
      maxScore: 25,
      met: evidenceMet,
    },
    {
      key: 'reflection',
      label: 'Aprendizaje y siguiente ajuste',
      score: reflectionMet ? 15 : 0,
      maxScore: 15,
      met: reflectionMet,
    },
    {
      key: 'mission_specific',
      label: missionSpecificLabel,
      score: missionSpecificMet ? 10 : 0,
      maxScore: 10,
      met: missionSpecificMet,
    },
  ]

  const errors: string[] = []
  if (instructionRatio !== 1) {
    errors.push('Confirma todos los pasos de la misión antes de continuar.')
  }
  if (!summaryMet) errors.push('Registra qué hiciste y qué decisión tomaste.')
  if (!evidenceMet) errors.push('Pega o describe una evidencia real del trabajo realizado.')
  if (!reflectionMet) errors.push('Registra un aprendizaje y tu siguiente acción.')
  if (!validOptionalUrl(normalized.artifactUrl)) {
    errors.push('El enlace del entregable debe comenzar con http:// o https://.')
  }
  if (mission.missionType === 'field_action' && !missionSpecificMet) {
    errors.push('Registra qué ocurrió en la acción; no necesitas inventar una cifra.')
  }

  const score = criteria.reduce((sum, criterion) => sum + criterion.score, 0)
  const passScore = 100
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
