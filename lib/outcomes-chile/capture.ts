import { createAdminClient } from '@/lib/supabase/server'
import {
  OutcomeCaptureValidationError,
  validateEmploymentOutcome,
  validateJobSearchEvent,
  validateSalaryOutcome,
} from './capture-validation'

type CaptureDatabase = Pick<ReturnType<typeof createAdminClient>, 'from'>

export async function recordJobSearchEvent(userId: string, input: unknown, database?: CaptureDatabase) {
  const event = validateJobSearchEvent(input)
  const db = database ?? createAdminClient()
  const { data, error } = await db.from('dtc_job_search_events').insert({
    ...event,
    user_id: userId,
    verification_status: 'self_reported',
    evidence_refs: [],
  }).select('id,event_type,occurred_at,verification_status').single()
  if (error) throw error
  if (!data) throw new Error('OUTCOME_CAPTURE_FAILED')
  return data
}

export async function recordEmploymentOutcome(userId: string, input: unknown, database?: CaptureDatabase) {
  const outcome = validateEmploymentOutcome(input)
  const db = database ?? createAdminClient()
  // The database trigger creates the 30/90/180-day followups in this insert's
  // transaction. A scheduling error therefore rolls back the employment too.
  const { data, error } = await db.from('dtc_employment_outcomes').insert({
    ...outcome,
    user_id: userId,
    verification_status: 'self_reported',
    evidence_refs: [],
  }).select('id,outcome_type,effective_date,verification_status').single()
  if (error) throw error
  if (!data) throw new Error('OUTCOME_CAPTURE_FAILED')
  return data
}

export async function recordSalaryOutcome(userId: string, input: unknown, database?: CaptureDatabase) {
  const salary = validateSalaryOutcome(input)
  const db = database ?? createAdminClient()
  if (salary.employment_outcome_id) {
    // The admin client bypasses RLS: both predicates are required before linking
    // a salary. The composite database foreign key also protects this invariant.
    const { data: employment, error: lookupError } = await db.from('dtc_employment_outcomes')
      .select('id').eq('id', salary.employment_outcome_id).eq('user_id', userId).maybeSingle()
    if (lookupError) throw lookupError
    if (!employment) throw new OutcomeCaptureValidationError('INVALID_EMPLOYMENT_OUTCOME_ID')
  }
  const { data, error } = await db.from('dtc_salary_outcomes').insert({
    ...salary,
    user_id: userId,
    verification_status: 'self_reported',
    evidence_refs: [],
  }).select('id,measurement_role,monthly_net_clp,measured_at,verification_status').single()
  if (error) throw error
  if (!data) throw new Error('OUTCOME_CAPTURE_FAILED')
  return data
}
