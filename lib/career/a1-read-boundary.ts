import type { A1ProfessionalReport } from '../reports/a1-professional-report'
import type { CareerIdentityPatch } from './agent-contract'

/** Read boundary only. Persisted legacy history is never changed by these functions. */
export const A1_CAREER_POLICY = 'a1-preferences-not-competencies.v1'
type Row = Record<string, any>
const object = (value: unknown): Row => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Row : {}
const normalized = (value: unknown): string => typeof value === 'string' ? value.trim().toLowerCase() : ''
const reservedFields = new Set(['dominantpattern', 'secondarypattern', 'lastassessmentid', 'lastassessedat', 'a1', 'disc', 'discprofile', 'patternevidence'])
const legacyScalars = new Set(['framework', 'scores', 'confidence'])
const patchProtectedFields = new Set([...reservedFields, ...legacyScalars])

export function isA1Derived(row: Row): boolean {
  const metadata = object(row.metadata)
  const content = object(row.content)
  const module = normalized(row.source_module ?? row.sourceModule ?? metadata.sourceModule ?? metadata.source_module ?? metadata.module)
  const key = normalized(row.skill_key ?? row.skillKey ?? row.key)
  return module === 'a1' || /^disc(?:[.:]|$)/.test(key) || /^a1(?:[.:_-]|$)/.test(key)
    || normalized(metadata.framework) === 'disc' || normalized(content.framework) === 'disc'
    || normalized(row.framework) === 'disc' || normalized(row.source_type ?? row.sourceType) === 'disc_dimension'
    || 'discProfile' in content || 'dominantPattern' in content
}

function textClaims(value: unknown): string[] {
  // Legacy A1 strengths were {key: 'D', score: n}; they are not measured strengths.
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim())) : []
}

export function careerA1Projection(report: A1ProfessionalReport | null) {
  return {
    policy: A1_CAREER_POLICY,
    kind: 'self_reported_preferences' as const,
    status: report ? report.reviewable ? report.understanding.pattern.status : 'unavailable' : 'missing',
    assessmentDate: report?.assessmentDate ?? null,
    rawScores: report?.reviewable ? report.rawScores : null,
    displayIntensities: report?.reviewable ? report.intensities : null,
    primary: report?.reviewable ? report.primary : null,
    secondary: report?.reviewable ? report.secondary : null,
    primaryCandidates: report?.understanding.pattern.primaryCandidates ?? [],
    secondaryCandidates: report?.understanding.pattern.secondaryCandidates ?? [],
    combinationName: report?.combinationName ?? null,
    limitation: 'Preferencias relativas autodeclaradas; no miden capacidad, integridad, aptitud laboral ni confianza psicológica. Las intensidades no son percentiles.',
    reportPath: '/despega/a1-report',
  }
}

export function sanitizeCareerIdentityRow(row: Row, report: A1ProfessionalReport | null): Row {
  const communication = object(row.communication_profile)
  const hasLegacyDisc = normalized(communication.framework) === 'disc'
    || Object.keys(communication).some((key) => reservedFields.has(key.toLowerCase()))
  // Non-DISC A3 framework/score fields are not removed merely because they use common names.
  const safeCommunication = Object.fromEntries(Object.entries(communication).filter(([key]) =>
    !reservedFields.has(key.toLowerCase()) && !(hasLegacyDisc && legacyScalars.has(key.toLowerCase()))))
  return {
    ...row,
    strengths: textClaims(row.strengths),
    growth_areas: textClaims(row.growth_areas),
    communication_profile: { ...safeCommunication, a1: careerA1Projection(report) },
    metadata: { ...object(row.metadata), a1ReadPolicy: A1_CAREER_POLICY },
  }
}

export function sanitizeCareerRows(input: {
  skills: Row[]; skillEdges: Row[]; memories: Row[]; recentEvidence: Row[]; a1EvidenceIds: string[]
}) {
  const ids = (rows: Row[]): string[] => rows.map((row) => row.id).filter((id): id is string => typeof id === 'string')
  const suppressedSkills = new Set(ids(input.skills.filter(isA1Derived)))
  const suppressedEvidence = new Set([...input.a1EvidenceIds, ...ids(input.recentEvidence.filter(isA1Derived))])
  return {
    skills: input.skills.filter((row) => !isA1Derived(row)),
    skillEdges: input.skillEdges.filter((row) => !suppressedSkills.has(row.source_skill_id) && !suppressedSkills.has(row.target_skill_id)),
    recentEvidence: input.recentEvidence.filter((row) => !isA1Derived(row) && !suppressedEvidence.has(row.id) && !suppressedSkills.has(row.skill_id)),
    memories: input.memories.filter((row) => !isA1Derived(row) && !suppressedEvidence.has(row.source_evidence_id)),
  }
}

/** Agents must not replace source-derived preferences through a general identity patch. */
export function assertNoA1IdentityPatch(patch: CareerIdentityPatch): void {
  const communication = object(patch.communicationProfile)
  if (Object.keys(communication).some((key) => patchProtectedFields.has(key.toLowerCase()))
    || [patch.strengths, patch.growthAreas].some((claims) => claims !== undefined && (!Array.isArray(claims) || claims.some((claim) => typeof claim !== 'string')))) {
    throw new TypeError('A1 debe actualizarse desde su evaluación, no como una habilidad o un puntaje inferido.')
  }
}
