import {
  buildChileImpact, chileCalendarDate, isCompletedChileFollowup, selectEligibleChileEvidence,
  type ChileImpactEvidence, type OutcomeVerification,
} from './impact'

export type ChileImpact = ReturnType<typeof buildChileImpact>

export interface ChileEmploymentOption {
  id: string
  roleTitle: string
  effectiveDate: string
  outcomeType: string
  verification: OutcomeVerification
}

export interface ChileWorkspaceFollowup {
  id: string
  employmentOutcomeId: string
  roleTitle: string
  day: 30 | 90 | 180
  dueAt: string
  completedAt: string | null
  employmentActive: boolean | null
  sameRole: boolean | null
  verification: OutcomeVerification
  state: 'upcoming' | 'due' | 'overdue' | 'completed' | 'needs_review'
  canComplete: boolean
}

export interface ChileHistoryItem {
  id: string
  kind: 'event' | 'employment' | 'salary' | 'followup'
  title: string
  detail: string | null
  date: string
  recordedAt: string
  monthlyNetClp: number | null
  verification: OutcomeVerification
}

export interface ChileWorkspace {
  asOfDate: string
  employmentOptions: ChileEmploymentOption[]
  employmentOptionCount: number
  employmentOptionsTruncated: boolean
  followups: ChileWorkspaceFollowup[]
  followupCount: number
  followupsTruncated: boolean
  history: ChileHistoryItem[]
  historyCount: number
  historyTruncated: boolean
}

export interface OutcomesChileSummary {
  funnel: ChileImpact['observed']['jobSearch']
  timeToJobDays: number | null
  economic: ChileImpact['observed']['economic'] & { annualizedLiftClp: number | null }
  verification: ChileImpact['verification']
  attribution: ChileImpact['attribution']['classification']
  impact: ChileImpact
  workspace: ChileWorkspace
}

const EVENT_TITLES: Record<string, string> = {
  application: 'Postulación', employer_response: 'Respuesta de una empresa', screening: 'Evaluación inicial',
  interview: 'Entrevista', process_advance: 'Avance de proceso', rejection: 'Proceso no continuó',
  offer: 'Oferta recibida', withdrawal: 'Retiro de proceso',
}
const EMPLOYMENT_TITLES: Record<string, string> = {
  job_started: 'Inicio de empleo', role_change: 'Cambio de cargo', promotion: 'Promoción', return_to_work: 'Regreso al trabajo',
}
const SALARY_TITLES = { baseline: 'Renta de referencia inicial', new_role: 'Renta de nuevo cargo', follow_up: 'Medición de renta' }
const LIMITS = { employment: 100, followups: 60, history: 30 }

/** A bounded presentation view, never the input to aggregate metrics or an authorization decision. */
export function buildChileWorkspace(evidence: ChileImpactEvidence, computedAt: string): ChileWorkspace {
  const eligible = selectEligibleChileEvidence(evidence, computedAt)
  const asOfDate = chileCalendarDate(computedAt)
  const employmentById = new Map(eligible.employment.map((row) => [row.id, row]))
  const roleTitle = (id: string | null) => employmentById.get(id ?? '')?.role_title?.trim() || 'Empleo registrado'
  const employmentOptions: ChileEmploymentOption[] = eligible.employment.map((row) => ({
    id: row.id,
    roleTitle: roleTitle(row.id),
    effectiveDate: row.effective_date,
    outcomeType: row.outcome_type,
    verification: row.verification_status,
  })).sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate) || a.id.localeCompare(b.id))

  const followups: ChileWorkspaceFollowup[] = eligible.followups.map((row) => {
    const complete = isCompletedChileFollowup(row, computedAt)
    const state: ChileWorkspaceFollowup['state'] = complete ? 'completed'
      : row.completed_at ? 'needs_review' : row.due_at < asOfDate ? 'overdue'
        : row.due_at === asOfDate ? 'due' : 'upcoming'
    return {
      id: row.id,
      employmentOutcomeId: row.employment_outcome_id!,
      roleTitle: roleTitle(row.employment_outcome_id),
      day: row.followup_day,
      dueAt: row.due_at,
      completedAt: row.completed_at,
      employmentActive: row.employment_active,
      sameRole: row.same_role,
      verification: row.verification_status,
      state,
      canComplete: !row.completed_at && row.verification_status === 'self_reported' && row.due_at <= asOfDate,
    }
  }).sort((a, b) => Number(!a.canComplete) - Number(!b.canComplete)
    || Number(a.state === 'completed') - Number(b.state === 'completed')
    || a.dueAt.localeCompare(b.dueAt) || a.id.localeCompare(b.id))

  const history: ChileHistoryItem[] = [
    ...eligible.events.map((row): ChileHistoryItem => ({
      id: row.id, kind: 'event', title: EVENT_TITLES[row.event_type] ?? 'Evento de búsqueda',
      detail: row.target_role?.trim() || null, date: chileCalendarDate(row.occurred_at),
      recordedAt: row.created_at, monthlyNetClp: null, verification: row.verification_status,
    })),
    ...eligible.employment.map((row): ChileHistoryItem => ({
      id: row.id, kind: 'employment', title: EMPLOYMENT_TITLES[row.outcome_type] ?? 'Resultado laboral',
      detail: roleTitle(row.id), date: row.effective_date, recordedAt: row.created_at,
      monthlyNetClp: null, verification: row.verification_status,
    })),
    ...eligible.salary.map((row): ChileHistoryItem => ({
      id: row.id, kind: 'salary', title: SALARY_TITLES[row.measurement_role],
      detail: row.employment_outcome_id ? roleTitle(row.employment_outcome_id) : null,
      date: row.measured_at, recordedAt: row.created_at,
      monthlyNetClp: row.monthly_net_clp, verification: row.verification_status,
    })),
    ...eligible.followups.filter((row) => isCompletedChileFollowup(row, computedAt)).map((row): ChileHistoryItem => ({
      id: row.id, kind: 'followup', title: `Seguimiento de ${row.followup_day} días`,
      detail: roleTitle(row.employment_outcome_id), date: chileCalendarDate(row.completed_at!),
      recordedAt: row.completed_at!, monthlyNetClp: null, verification: row.verification_status,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date) || Date.parse(b.recordedAt) - Date.parse(a.recordedAt)
    || a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id))

  return {
    asOfDate,
    employmentOptions: employmentOptions.slice(0, LIMITS.employment),
    employmentOptionCount: employmentOptions.length,
    employmentOptionsTruncated: employmentOptions.length > LIMITS.employment,
    followups: followups.slice(0, LIMITS.followups),
    followupCount: followups.length,
    followupsTruncated: followups.length > LIMITS.followups,
    history: history.slice(0, LIMITS.history),
    historyCount: history.length,
    historyTruncated: history.length > LIMITS.history,
  }
}
