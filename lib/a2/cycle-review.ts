import { A3_CHECKPOINT_MAP } from '@/lib/a3-checkpoint-map'
import type { A2Horizon } from '@/lib/a2/server-progress'

export interface A2CycleReviewRecord {
  day: number
  missionType: string | null
  validationStatus: string
  score: number | null
  hasEvidence: boolean
  completedAt: string | null
}

export interface A2CycleReview {
  horizon: A2Horizon
  completedDays: number
  completionRate: number
  validatedDays: number
  validationRate: number
  evidenceDays: number
  evidenceRate: number
  checkpointDays: number[]
  checkpointsCompleted: number
  checkpointsRequired: number
  checkpointRate: number
  realActionDays: number
  averageScore: number | null
  closureScore: number
  status: 'not_started' | 'in_progress' | 'ready_to_extend' | 'completed'
  strengths: string[]
  gaps: string[]
}

function percentage(value: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.round((value / total) * 100))
}

function average(values: number[]): number | null {
  if (values.length === 0) return null
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

/**
 * Builds a neutral, evidence-based closure summary. It surfaces signals and
 * gaps without prescribing whether the user should extend the route.
 */
export function buildA2CycleReview(
  horizon: A2Horizon,
  records: A2CycleReviewRecord[],
): A2CycleReview {
  const cycleRecords = records.filter(
    (record) => record.day >= 1 && record.day <= horizon,
  )
  const uniqueByDay = new Map<number, A2CycleReviewRecord>()
  for (const record of cycleRecords) {
    if (!uniqueByDay.has(record.day)) uniqueByDay.set(record.day, record)
  }

  const normalizedRecords = Array.from(uniqueByDay.values())
  const completedDays = normalizedRecords.length
  const validatedDays = normalizedRecords.filter((record) =>
    ['structural', 'specialized', 'checkpoint'].includes(
      record.validationStatus,
    ),
  ).length
  const evidenceDays = normalizedRecords.filter(
    (record) => record.hasEvidence,
  ).length
  const checkpointDays = Object.keys(A3_CHECKPOINT_MAP)
    .map(Number)
    .filter((day) => day <= horizon)
    .sort((left, right) => left - right)
  const completedCheckpointDays = new Set(
    normalizedRecords
      .filter((record) => record.validationStatus === 'checkpoint')
      .map((record) => record.day),
  )
  const checkpointsCompleted = checkpointDays.filter((day) =>
    completedCheckpointDays.has(day),
  ).length
  const realActionDays = normalizedRecords.filter(
    (record) => record.missionType === 'field_action',
  ).length
  const scoreValues = normalizedRecords
    .map((record) => record.score)
    .filter((score): score is number => typeof score === 'number')

  const completionRate = percentage(completedDays, horizon)
  const validationRate = percentage(validatedDays, completedDays)
  const evidenceRate = percentage(evidenceDays, completedDays)
  const checkpointRate = percentage(
    checkpointsCompleted,
    checkpointDays.length,
  )
  const averageScore = average(scoreValues)
  const closureScore = Math.round(
    completionRate * 0.4 +
      validationRate * 0.25 +
      evidenceRate * 0.15 +
      checkpointRate * 0.2,
  )
  const cycleComplete = completedDays >= horizon
  const status: A2CycleReview['status'] =
    completedDays === 0
      ? 'not_started'
      : !cycleComplete
        ? 'in_progress'
        : horizon === 90
          ? 'completed'
          : 'ready_to_extend'

  const strengths: string[] = []
  const gaps: string[] = []

  if (completionRate === 100) strengths.push(`Completaste los ${horizon} días del ciclo.`)
  else gaps.push(`Quedan ${Math.max(0, horizon - completedDays)} días por completar.`)

  if (validationRate >= 90) {
    strengths.push('La mayoría de los días tiene validación registrada.')
  } else if (completedDays > 0) {
    gaps.push(`${Math.max(0, completedDays - validatedDays)} días no tienen validación actual.`)
  }

  if (evidenceRate >= 70) {
    strengths.push('El ciclo conserva evidencia suficiente para revisar decisiones y resultados.')
  } else if (completedDays > 0) {
    gaps.push(`${Math.max(0, completedDays - evidenceDays)} días no tienen evidencia estructurada.`)
  }

  if (checkpointRate === 100 && checkpointDays.length > 0) {
    strengths.push('Todos los checkpoints de Entrenamiento del ciclo están completos.')
  } else if (checkpointDays.length > 0) {
    gaps.push(
      `Faltan ${checkpointDays.length - checkpointsCompleted} checkpoints de Entrenamiento del ciclo.`,
    )
  }

  if (realActionDays > 0) {
    strengths.push(`${realActionDays} días registran acciones realizadas fuera de la plataforma.`)
  }

  if (averageScore !== null && averageScore < 70) {
    gaps.push(`El puntaje promedio de los entregables evaluados es ${averageScore}/100.`)
  } else if (averageScore !== null) {
    strengths.push(`El puntaje promedio de los entregables evaluados es ${averageScore}/100.`)
  }

  return {
    horizon,
    completedDays,
    completionRate,
    validatedDays,
    validationRate,
    evidenceDays,
    evidenceRate,
    checkpointDays,
    checkpointsCompleted,
    checkpointsRequired: checkpointDays.length,
    checkpointRate,
    realActionDays,
    averageScore,
    closureScore,
    status,
    strengths,
    gaps,
  }
}
