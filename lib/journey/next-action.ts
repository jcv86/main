import type { JourneyFlow } from './flow'
import { A2_BARRIERS, readAdjustmentContent } from '../a2/practice-adjustment'
import { objectiveFromStoredFields, objectiveSummary } from '../opportunities/labor-objective'

export const GUIDED_NEXT_ACTION_VERSION = 'dtc-guided-next-action.v1' as const

export interface GuidedNextActionSource {
  id: 'journey' | 'objective' | 'adjustment'
  status: 'available' | 'missing' | 'unavailable'
  label: string
  href?: string
  recordId?: string
  recordedAt?: string
}

export interface GuidedNextAction {
  version: typeof GUIDED_NEXT_ACTION_VERSION
  action: JourneyFlow['next']
  reason: string
  /** A confirmed declaration, never evidence that the user has a skill or a job. */
  objective?: { summary: string }
  /** A saved intention to retry; it does not complete the day or validate its work. */
  adjustment?: {
    dayNumber: number
    nextAction: string
    retainedWork: string
    barrierLabel: string
    reviewDate: string
  }
  sources: GuidedNextActionSource[]
  limitations: string[]
}

export type GuidedSourceRead =
  | { status: 'available'; value: Record<string, unknown> }
  | { status: 'missing' | 'unavailable' }

/** Only a pending day selected by the canonical flow may use a practice adjustment. */
export function guidedPracticeDay(flow: JourneyFlow): number | null {
  if (flow.onboardingPath !== '/despega/a2') return null
  const match = /^\/despega\/a2\/dia-([1-9]\d?)$/.exec(flow.next.href)
  if (!match) return null
  const day = Number(match[1])
  return day <= 90 && day === flow.resumeDay && !flow.completedDays.includes(day) ? day : null
}

function reference(value: Record<string, unknown>, dateKey: 'updated_at' | 'created_at') {
  const recordId = value.id
  const recordedAt = value[dateKey]
  if (typeof recordId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(recordId)
    || typeof recordedAt !== 'string' || recordedAt.length > 64 || !Number.isFinite(Date.parse(recordedAt))) {
    throw new TypeError('Source reference unavailable')
  }
  return { recordId, recordedAt }
}

/**
 * Adds source-backed context to flow.next; it never chooses a route, grants access,
 * writes progress or treats a declared intention as a completed action.
 */
export function buildGuidedNextAction(
  flow: JourneyFlow,
  reads: { objective?: GuidedSourceRead; adjustment?: GuidedSourceRead } = {},
): GuidedNextAction {
  const result: GuidedNextAction = {
    version: GUIDED_NEXT_ACTION_VERSION,
    action: { ...flow.next },
    reason: flow.practicePath === 'persona'
      ? 'Tu camino personal conserva sus propias prácticas. Este paso corresponde al avance que tienes registrado.'
      : 'Tu avance registrado indica que este es el paso que corresponde retomar.',
    sources: [{ id: 'journey', status: 'available', label: 'Tu recorrido y avance registrado', href: '/despega/recorrido' }],
    limitations: [],
  }

  // A work objective must not redirect or condition a personal practice path.
  if (flow.practicePath !== 'persona' && reads.objective) {
    const source: GuidedNextActionSource = {
      id: 'objective', status: reads.objective.status,
      label: 'Objetivo laboral confirmado por ti', href: '/despega/objetivo-laboral',
    }
    if (reads.objective.status === 'available') {
      try {
        const value = reads.objective.value
        if (value.source !== 'user_confirmed') throw new TypeError('Unconfirmed objective')
        const summary = objectiveSummary(objectiveFromStoredFields(value)).join(' · ')
        Object.assign(source, reference(value, 'updated_at'))
        result.objective = { summary }
        result.reason = 'Tu objetivo guardado aporta contexto a este paso. Tu avance registrado determina por dónde continuar.'
      } catch { source.status = 'unavailable' }
    }
    if (source.status === 'unavailable') {
      result.limitations.push('No pudimos verificar tu objetivo guardado. Puedes reintentar; tu siguiente paso se conserva.')
    }
    result.sources.push(source)
  }

  const day = guidedPracticeDay(flow)
  if (day !== null && reads.adjustment) {
    const source: GuidedNextActionSource = {
      id: 'adjustment', status: reads.adjustment.status,
      label: `Ajuste que guardaste para el día ${day}`, href: flow.next.href,
    }
    if (reads.adjustment.status === 'available') {
      try {
        const value = reads.adjustment.value
        const content = readAdjustmentContent(value.content)
        if (!content || content.dayNumber !== day || value.related_day !== day) {
          throw new TypeError('Adjustment does not match the pending day')
        }
        Object.assign(source, reference(value, 'created_at'))
        result.adjustment = {
          dayNumber: day, nextAction: content.nextAction, retainedWork: content.retainedWork,
          barrierLabel: A2_BARRIERS[content.barrier].label, reviewDate: content.reviewDate,
        }
        result.reason = 'Para este día guardaste un nuevo intento. Retoma la acción que elegiste y conserva el trabajo que anotaste.'
        if (content.barrier === 'goal_changed') {
          result.limitations.push('Tu ajuste indica un cambio de objetivo. Revisa si esta práctica sigue apoyando lo que quieres lograr.')
        }
      } catch { source.status = 'unavailable' }
    }
    if (source.status === 'unavailable') {
      result.limitations.push('No pudimos recuperar tu último ajuste para este día. Puedes reintentar sin cambiar tu avance.')
    }
    result.sources.push(source)
  }

  return result
}
