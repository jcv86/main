import type { CanonicalOpportunity } from './types'

/** Fixed codes keep provider content and arbitrary errors out of the run ledger. */
export const OPPORTUNITY_REASON_CODES = [
  'job_identity', 'job_url', 'internal_job_id', 'duplicate_id',
  'invalid_publication_date', 'invalid_deadline', 'invalid_location',
  'description_too_large', 'missing_description', 'invalid_record',
  'resource_type', 'company_missing', 'remote_geography_unresolved',
  'prospect_post', 'talent_pool', 'scheduled', 'expired', 'geography_unconfirmed',
] as const

export type OpportunityReasonCode = typeof OPPORTUNITY_REASON_CODES[number]
export type OpportunityReasonCounts = Partial<Record<OpportunityReasonCode, number>>
const REASONS = new Set<string>(OPPORTUNITY_REASON_CODES)

export function addOpportunityReason(counts: OpportunityReasonCounts, reason: unknown): void {
  const key = typeof reason === 'string' && REASONS.has(reason)
    ? reason as OpportunityReasonCode : 'invalid_record'
  counts[key] = (counts[key] ?? 0) + 1
}

/** Projection is explicit even when an injected provider implementation misbehaves. */
export function safeOpportunityReasonCounts(input: unknown): OpportunityReasonCounts {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {}
  const result: OpportunityReasonCounts = {}
  for (const key of OPPORTUNITY_REASON_CODES) {
    const value = (input as Record<string, unknown>)[key]
    if (typeof value === 'number' && Number.isSafeInteger(value) && value > 0 && value <= 500) result[key] = value
  }
  return result
}

export interface OpportunityContentCoverage {
  measured: 'returned'
  total: number
  with_requirements: number
  with_skills: number
  with_work_mode: number
}

export function safeOpportunityContentCoverage(input: unknown): OpportunityContentCoverage | undefined {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined
  const value = input as Record<string, unknown>
  if (value.measured !== 'returned' || typeof value.total !== 'number'
      || !Number.isSafeInteger(value.total) || value.total < 0 || value.total > 500) return undefined
  const fields = ['with_requirements', 'with_skills', 'with_work_mode'] as const
  if (fields.some(field => typeof value[field] !== 'number' || !Number.isSafeInteger(value[field])
      || (value[field] as number) < 0 || (value[field] as number) > (value.total as number))) return undefined
  return {
    measured: 'returned', total: value.total,
    with_requirements: value.with_requirements as number,
    with_skills: value.with_skills as number,
    with_work_mode: value.with_work_mode as number,
  }
}

/** Coverage measures present fields; it is not a confidence or candidate-fit score. */
export function opportunityContentCoverage(jobs: readonly Pick<CanonicalOpportunity, 'requirements' | 'skills' | 'workMode'>[]): OpportunityContentCoverage {
  return {
    measured: 'returned',
    total: jobs.length,
    with_requirements: jobs.filter(job => Array.isArray(job.requirements) && job.requirements.length > 0).length,
    with_skills: jobs.filter(job => Array.isArray(job.skills) && job.skills.length > 0).length,
    with_work_mode: jobs.filter(job => ['onsite', 'hybrid', 'remote'].includes(job.workMode ?? '')).length,
  }
}
