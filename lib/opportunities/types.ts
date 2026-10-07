/** Shared contract for published vacancies; provider payloads never reach the client. */
export type OpportunitySource = 'chiletrabajos' | 'getonboard' | 'lever' | 'greenhouse'

export type OpportunityVerificationStatus =
  | 'verified_active'
  | 'verified_restricted'
  | 'stale'
  | 'unavailable'
  | 'unknown'

export interface CanonicalOpportunity {
  source: OpportunitySource
  sourceId: string
  title: string
  company: string
  location: string | null
  remote: boolean | null
  workMode?: 'remote' | 'hybrid' | 'onsite' | null
  description: string
  requirements: string[]
  skills: string[]
  originalUrl: string
  publishedAt: string | null
  expiresAt?: string | null
  lastVerifiedAt: string
  verificationStatus: OpportunityVerificationStatus
  raw: unknown
}

export const OPPORTUNITY_SOURCE_LABELS: Readonly<Record<OpportunitySource, string>> = {
  chiletrabajos: 'Chiletrabajos',
  getonboard: 'Get on Board',
  lever: 'Sitio de la empresa',
  greenhouse: 'Sitio de la empresa',
}
