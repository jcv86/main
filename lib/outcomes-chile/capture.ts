import { createAdminClient } from '@/lib/supabase/server'
import {
  OutcomeCaptureValidationError,
  OutcomeCaptureConflictError,
  OutcomeCaptureNotFoundError,
  validateCaptureRequestId,
  validateEmploymentOutcome,
  validateFollowupCompletion,
  validateJobSearchEvent,
  validateSalaryOutcome,
} from './capture-validation'

type CaptureDatabase = Pick<ReturnType<typeof createAdminClient>, 'rpc'>

const CONFLICTS = new Set(['IDEMPOTENCY_KEY_REUSED', 'FOLLOWUP_NOT_DUE', 'FOLLOWUP_ALREADY_COMPLETED', 'FOLLOWUP_VERIFICATION_LOCKED'])
const DATABASE_VALIDATION = new Set(['INVALID_EMPLOYMENT_OUTCOME_ID', 'INVALID_EMPLOYMENT_ACTIVE', 'INVALID_SAME_ROLE', 'FUTURE_OCCURRED_AT', 'FUTURE_EFFECTIVE_DATE', 'FUTURE_MEASURED_AT'])

async function capture(userId: string, requestId: string, action: string, payload: Record<string, unknown>, database?: CaptureDatabase) {
  const db = database ?? createAdminClient()
  // The service-only invoker RPC reserves the owner's request key, checks links
  // and row state, writes, and stores the exact response in one transaction.
  const { data, error } = await db.rpc('capture_dtc_chile_outcome', {
    p_user_id: userId, p_request_id: requestId, p_action: action, p_payload: payload,
  })
  if (error) {
    // Only known public codes leave this boundary. SQL details can contain
    // private values and must never become validation messages in the browser.
    if (error.code === 'PT409' && CONFLICTS.has(error.message)) throw new OutcomeCaptureConflictError(error.message)
    if (error.code === 'PT404' && error.message === 'FOLLOWUP_NOT_FOUND') throw new OutcomeCaptureNotFoundError()
    if (error.code === 'PT422' && DATABASE_VALIDATION.has(error.message)) throw new OutcomeCaptureValidationError(error.message)
    throw error
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('OUTCOME_CAPTURE_FAILED')
  return data
}

export async function recordJobSearchEvent(userId: string, input: unknown, database?: CaptureDatabase, now = new Date()) {
  return capture(userId, validateCaptureRequestId(input), 'job_search_event', validateJobSearchEvent(input, now), database)
}

export async function recordEmploymentOutcome(userId: string, input: unknown, database?: CaptureDatabase, now = new Date()) {
  return capture(userId, validateCaptureRequestId(input), 'employment_outcome', validateEmploymentOutcome(input, now), database)
}

export async function recordSalaryOutcome(userId: string, input: unknown, database?: CaptureDatabase, now = new Date()) {
  return capture(userId, validateCaptureRequestId(input), 'salary_outcome', validateSalaryOutcome(input, now), database)
}

export async function completeOutcomeFollowup(userId: string, input: unknown, database?: CaptureDatabase) {
  return capture(userId, validateCaptureRequestId(input), 'complete_followup', validateFollowupCompletion(input), database)
}
