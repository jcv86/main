import { normalizeOpportunityText } from './taxonomy'

export const INDUSTRY_OPTIONS = ['Servicios financieros', 'Tecnología', 'Transporte y movilidad', 'Minería', 'Salud', 'Educación', 'Comercio', 'Construcción', 'Industria y manufactura', 'Consultoría y servicios profesionales', 'Energía', 'Agroindustria'] as const

export interface EmployerIndustryEvidence {
  industry: string
  company: string
  sourceUrl: string
  reviewedAt: string
  reviewAfter: string
  scope: 'employer'
  origin: 'reviewed_company_source'
  summary: string
}

interface ReviewedEmployer extends EmployerIndustryEvidence { source: 'lever' | 'greenhouse'; board: string }

/**
 * Public first-party pages read on 2026-11-02. These classifications describe the
 * named direct employer, never its customers, a recruiter's client, or a job title.
 * Dates bound this small reviewed registry; missing/expired evidence stays unknown.
 */
const REVIEWED_EMPLOYERS: readonly ReviewedEmployer[] = [
  { source: 'lever', board: 'fintual', company: 'Fintual', industry: 'Servicios financieros',
    sourceUrl: 'https://fintual.cl/', summary: 'La empresa presenta servicios de inversión y fondos mutuos.',
    reviewedAt: '2026-11-02', reviewAfter: '2027-02-02', scope: 'employer', origin: 'reviewed_company_source' },
  { source: 'greenhouse', board: 'cabify', company: 'Cabify', industry: 'Transporte y movilidad',
    sourceUrl: 'https://cabify.com/cl', summary: 'La empresa describe sus servicios de viajes y transporte corporativo.',
    reviewedAt: '2026-11-02', reviewAfter: '2027-02-02', scope: 'employer', origin: 'reviewed_company_source' },
  { source: 'greenhouse', board: 'pagerduty', company: 'PagerDuty', industry: 'Tecnología',
    sourceUrl: 'https://www.pagerduty.com/company/', summary: 'La empresa presenta su plataforma de software para operaciones digitales.',
    reviewedAt: '2026-11-02', reviewAfter: '2027-02-02', scope: 'employer', origin: 'reviewed_company_source' },
]

export function validEmployerIndustry(value: unknown, company: unknown, now = new Date()): EmployerIndustryEvidence | null {
  if (!value || typeof value !== 'object' || Array.isArray(value) || typeof company !== 'string') return null
  const evidence = value as EmployerIndustryEvidence
  if (evidence.scope !== 'employer' || evidence.origin !== 'reviewed_company_source'
      || typeof evidence.company !== 'string' || normalizeOpportunityText(evidence.company) !== normalizeOpportunityText(company)
      || typeof evidence.industry !== 'string' || !evidence.industry.trim() || evidence.industry.length > 160
      || typeof evidence.summary !== 'string' || !evidence.summary.trim() || evidence.summary.length > 400
      || !Number.isFinite(Date.parse(evidence.reviewedAt)) || !Number.isFinite(Date.parse(evidence.reviewAfter))
      || Date.parse(evidence.reviewedAt) > now.getTime() || Date.parse(evidence.reviewAfter) <= now.getTime()) return null
  try {
    const url = new URL(evidence.sourceUrl)
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null
  } catch { return null }
  return { industry: evidence.industry, company: evidence.company, sourceUrl: evidence.sourceUrl,
    reviewedAt: evidence.reviewedAt, reviewAfter: evidence.reviewAfter, scope: evidence.scope,
    origin: evidence.origin, summary: evidence.summary }
}

export function employerIndustryForOpportunity(job: {
  source?: string; source_id?: string; company?: string; description?: string | null
}, now = new Date()): EmployerIndustryEvidence | null {
  // Even a known employer must not lend its classification to an unnamed client.
  const text = normalizeOpportunityText(job.description ?? '')
  if (/\b(?:para (?:nuestro|un importante|un reconocido|un) cliente|for (?:our|a) client|cliente confidencial)\b/.test(text)) return null
  const board = job.source_id?.split(':')[0]
  const reviewed = REVIEWED_EMPLOYERS.find(item => item.source === job.source && item.board === board)
  return validEmployerIndustry(reviewed, job.company, now)
}

export function industryCatalogFromJobs(jobs: readonly { company?: string; industry_evidence?: EmployerIndustryEvidence | null }[], now = new Date()) {
  const counts = new Map<string, number>()
  let known = 0
  for (const job of jobs) {
    const evidence = validEmployerIndustry(job.industry_evidence, job.company, now)
    if (!evidence) continue
    known++
    counts.set(evidence.industry, (counts.get(evidence.industry) ?? 0) + 1)
  }
  return { known, unknown: jobs.length - known, total: jobs.length,
    industries: [...counts].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)) }
}
