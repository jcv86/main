/** Private evidence is projected by the server. The browser receives only relevant support. */
export type PersonalEvidenceSource = 'cv' | 'dtc_goal' | 'dtc_a1' | 'dtc_a2' | 'dtc_a3'
export type PersonalSourceStatus = 'available' | 'empty' | 'unavailable' | 'partial'
export type PersonalEvidenceNature = 'declared_skill' | 'declared_experience' | 'declared_goal' | 'self_reported_preference' | 'practice_artifact'

export interface PersonalEvidence {
  /** Stable source reference; never a contact, email, token, or free-form URL. */
  id: string
  source: PersonalEvidenceSource
  nature: PersonalEvidenceNature
  label: string
  text: string
  /** Canonical A1 situation; never infer this routing key by parsing display prose. */
  preferenceDomain?: 'environment' | 'communication' | 'decision' | 'collaboration'
  observedAt: string
  expiresAt: string | null
  /** A reviewed first-party route for inspecting the source. */
  href: string
}

export interface PersonalSourceSummary {
  source: PersonalEvidenceSource
  status: PersonalSourceStatus
  updatedAt: string | null
}

export interface PersonalContextSummary {
  version: 1
  status: 'available' | 'partial' | 'empty' | 'unavailable'
  /** A hash of relevant content and source states, stable across equivalent reads. */
  revision: string
  sources: PersonalSourceSummary[]
}

export interface OpportunityPersonalContext extends PersonalContextSummary {
  /** Server-only input. Never serialize the complete list into an API response. */
  evidence: PersonalEvidence[]
}

export interface OrientationOfferEvidence {
  field: 'title' | 'requirements' | 'skills' | 'workMode' | 'location'
  value: string
  excerpt: string
}

export interface OrientationSupport {
  id: string
  personal: PersonalEvidence
  offer: OrientationOfferEvidence
}

export interface PersonalOrientationReason {
  code: 'cv_skill' | 'cv_experience' | 'dtc_practice' | 'dtc_goal'
  label: string
  supportIds: string[]
}

export interface PersonalOrientationQuestion {
  code: 'requirement_unconfirmed' | 'level_unconfirmed' | 'offer_details_missing' | 'context_incomplete'
  label: string
  offer?: OrientationOfferEvidence
}

export interface PersonalOrientationAction {
  label: string
  href?: string
  supportIds: string[]
}

export interface OpportunityPersonalOrientation {
  version: 1
  status: 'with_evidence' | 'search_only' | 'context_unavailable'
  summary: string
  reasons: PersonalOrientationReason[]
  toConfirm: PersonalOrientationQuestion[]
  nextStep: PersonalOrientationAction
  /** Only support referenced by visible reasons or actions. */
  support: OrientationSupport[]
}

export interface EvaluatedPersonalOrientation {
  orientation: OpportunityPersonalOrientation
  /** Distinct supported topics; an internal tie-break, never employability or a probability. */
  supportedTopics: number
}
