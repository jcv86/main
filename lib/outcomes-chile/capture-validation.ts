const EVENT_TYPES = new Set(['application', 'employer_response', 'screening', 'interview', 'process_advance', 'rejection', 'offer', 'withdrawal'])
const SOURCE_CHANNELS = new Set(['dtc_a4', 'linkedin', 'job_board', 'referral', 'direct', 'recruiter', 'other'])
const OUTCOME_TYPES = new Set(['job_started', 'role_change', 'promotion', 'return_to_work'])
const WORK_MODES = new Set(['onsite', 'hybrid', 'remote'])
const EMPLOYMENT_CATEGORIES = new Set(['private_employee', 'public_employee', 'employer', 'self_employed', 'other'])
const MEASUREMENT_ROLES = new Set(['baseline', 'new_role', 'follow_up'])
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export class OutcomeCaptureValidationError extends Error {
  constructor(code: string) {
    super(code)
    this.name = 'OutcomeCaptureValidationError'
  }
}

export function isCaptureInput(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function inputRecord(input: unknown): Record<string, unknown> {
  if (!isCaptureInput(input)) throw new OutcomeCaptureValidationError('INVALID_INPUT')
  return input
}

function enumValue(value: unknown, allowed: Set<string>, code: string): string {
  if (typeof value !== 'string' || !allowed.has(value)) throw new OutcomeCaptureValidationError(code)
  return value
}

function optionalEnum(value: unknown, allowed: Set<string>, code: string): string | null {
  return value == null ? null : enumValue(value, allowed, code)
}

function optionalText(value: unknown, max: number, code: string): string | null {
  if (value == null) return null
  if (typeof value !== 'string' || value.trim().length > max) throw new OutcomeCaptureValidationError(code)
  return value.trim() || null
}

function dateOnly(value: unknown, code: string): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) {
    throw new OutcomeCaptureValidationError(code)
  }
  const date = new Date(value + 'T00:00:00.000Z')
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new OutcomeCaptureValidationError(code)
  }
  return value
}

function timestamp(value: unknown): string {
  const code = 'INVALID_OCCURRED_AT'
  // Require a calendar date and an explicit offset, so server timezone and
  // Date.parse's permissive rollover cannot change the event the person entered.
  const parts = typeof value === 'string'
    ? /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-](\d{2}):(\d{2}))$/.exec(value)
    : null
  if (!parts || Number(parts[2]) > 23 || Number(parts[3]) > 59 || Number(parts[4]) > 59
    || (parts[5] !== 'Z' && (Number(parts[6]) > 23 || Number(parts[7]) > 59))) {
    throw new OutcomeCaptureValidationError(code)
  }
  dateOnly(parts[1], code)
  const parsed = new Date(value as string)
  if (!Number.isFinite(parsed.getTime())) throw new OutcomeCaptureValidationError(code)
  const normalized = parsed.toISOString()
  if (!/^\d{4}-/.test(normalized) || normalized.startsWith('0000')) throw new OutcomeCaptureValidationError(code)
  return normalized
}

export function validateJobSearchEvent(input: unknown) {
  const body = inputRecord(input)
  return {
    event_type: enumValue(body.eventType, EVENT_TYPES, 'INVALID_EVENT_TYPE'),
    occurred_at: timestamp(body.occurredAt),
    source_channel: optionalEnum(body.sourceChannel, SOURCE_CHANNELS, 'INVALID_SOURCE_CHANNEL'),
    target_role: optionalText(body.targetRole, 160, 'INVALID_TARGET_ROLE'),
    occupation_code: optionalText(body.occupationCode, 40, 'INVALID_OCCUPATION_CODE'),
    region_code: optionalText(body.regionCode, 20, 'INVALID_REGION_CODE'),
  }
}

export function validateEmploymentOutcome(input: unknown) {
  const body = inputRecord(input)
  const roleTitle = optionalText(body.roleTitle, 160, 'INVALID_ROLE_TITLE')
  if (!roleTitle) throw new OutcomeCaptureValidationError('ROLE_REQUIRED')
  return {
    outcome_type: enumValue(body.outcomeType, OUTCOME_TYPES, 'INVALID_OUTCOME_TYPE'),
    effective_date: dateOnly(body.effectiveDate, 'INVALID_EFFECTIVE_DATE'),
    role_title: roleTitle,
    occupation_code: optionalText(body.occupationCode, 40, 'INVALID_OCCUPATION_CODE'),
    region_code: optionalText(body.regionCode, 20, 'INVALID_REGION_CODE'),
    work_mode: optionalEnum(body.workMode, WORK_MODES, 'INVALID_WORK_MODE'),
    employment_category: optionalEnum(body.employmentCategory, EMPLOYMENT_CATEGORIES, 'INVALID_EMPLOYMENT_CATEGORY'),
    source_channel: optionalEnum(body.sourceChannel, SOURCE_CHANNELS, 'INVALID_SOURCE_CHANNEL'),
  }
}

export function validateSalaryOutcome(input: unknown) {
  const body = inputRecord(input)
  const amount = body.monthlyNetClp
  if (typeof amount !== 'number' || !Number.isInteger(amount) || amount < 0 || amount > 100000000) {
    throw new OutcomeCaptureValidationError('INVALID_MONTHLY_NET_CLP')
  }
  const employmentOutcomeId = body.employmentOutcomeId ?? null
  if (employmentOutcomeId !== null && (typeof employmentOutcomeId !== 'string' || !UUID.test(employmentOutcomeId))) {
    throw new OutcomeCaptureValidationError('INVALID_EMPLOYMENT_OUTCOME_ID')
  }
  return {
    employment_outcome_id: employmentOutcomeId as string | null,
    measurement_role: enumValue(body.measurementRole, MEASUREMENT_ROLES, 'INVALID_MEASUREMENT_ROLE'),
    monthly_net_clp: amount,
    measured_at: dateOnly(body.measuredAt, 'INVALID_MEASURED_AT'),
  }
}
