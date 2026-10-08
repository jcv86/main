import 'server-only'

import { createHash } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { buildA1ProfessionalReport } from '@/lib/reports/a1-professional-report'
import type {
  OpportunityPersonalContext, PersonalContextSummary, PersonalEvidence,
  PersonalEvidenceNature, PersonalEvidenceSource, PersonalSourceStatus, PersonalSourceSummary,
} from './personal-orientation-types'

type Client = Awaited<ReturnType<typeof createClient>>
type Row = Record<string, unknown>
type ReadResult = { data: unknown; error: unknown }
type Options = { now?: Date }
type Section = { summary: PersonalSourceSummary; evidence: PersonalEvidence[]; revision: unknown }

const SOURCES: readonly PersonalEvidenceSource[] = ['cv', 'dtc_goal', 'dtc_a1', 'dtc_a2', 'dtc_a3']
const MAX_TEXT = 2_000
const MAX_GOALS = 8
const MAX_A2_ROWS = 20
const MAX_EVIDENCE = 64
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const CONTACT = /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b|\b(?:https?:\/\/|www\.)\S+|\b(?:linkedin\.com|wa\.me)\b|\+56(?:[\s.()-]*\d){8,9}\b|\b(?:tel[eé]fono|celular|whatsapp|m[oó]vil|phone)\s*[:=]?\s*\+?\d(?:[\s.()-]*\d){6,14}\b|\b\d{1,2}(?:\.\d{3}){2}-[\dkK]\b|\b\d{7,8}-[\dkK]\b/iu
const CV_SELECT = 'id,module_id,completed_at,target_role:deliverable->targetRole,skills:deliverable->skills,experience_title:deliverable->experienceTitle,achievement_1:deliverable->achievement1,achievement_2:deliverable->achievement2,achievement_3:deliverable->achievement3'
const A3_SELECT = 'id,module_id,completed_at,project_value:deliverable->projectValue,critical_value:deliverable->criticalValue'
const A2_SELECT = 'id,source_ref,observed_at,expires_at,day:value->day,validation_status:value->validationStatus,validation_passed:value->validation->passed,submission_summary:value->submission->summary,submission_evidence:value->submission->evidence,identity_version:metadata->identityVersion'
const A1_SELECT = 'id,completed_at,dominant_pattern,secondary_pattern,disc_d:disc_profile->D,disc_i:disc_profile->I,disc_s:disc_profile->S,disc_c:disc_profile->C,responses_more:responses->more,responses_less:responses->less,questionnaire_version:responses->_meta->questionnaireVersion'

function row(value: unknown): Row {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid source record')
  return value as Row
}

function sourceId(value: unknown): string {
  if (typeof value !== 'string' || !UUID.test(value)) throw new Error('Invalid source reference')
  return value.toLowerCase()
}

/** Reject an excessive field intact: cutting it could lose a qualification or negation. */
function text(value: unknown, max = MAX_TEXT): string | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string' || value.length > max
    || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)
    || /<\/?[a-z][^>]*>/i.test(value) || CONTACT.test(value)) throw new Error('Invalid source text')
  return value.trim() || null
}

/** DTCFINAL stores the A3 timestamp without a zone; its verified database timezone is UTC. */
function date(value: unknown, now: Date, allowNaive = false, future = false): string {
  if (typeof value !== 'string' || value.length > 40) throw new Error('Invalid source date')
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,6}))?(Z|[+-]\d{2}(?::?\d{2})?)?$/i.exec(value)
  if (!match || (!match[8] && !allowNaive)) throw new Error('Invalid source date')
  const [year, month, day, hour, minute, second] = match.slice(1, 7).map(Number)
  const calendar = new Date(Date.UTC(year, month - 1, day))
  if (year < 1000 || calendar.getUTCFullYear() !== year || calendar.getUTCMonth() !== month - 1
    || calendar.getUTCDate() !== day || hour > 23 || minute > 59 || second > 59) throw new Error('Invalid source date')
  let zone = match[8] ?? 'Z'
  if (/^[+-]\d{2}$/.test(zone)) zone += ':00'
  const normalized = value.slice(0, value.length - (match[8]?.length ?? 0)).replace(' ', 'T') + zone
  const timestamp = Date.parse(normalized)
  if (!Number.isFinite(timestamp) || (!future && timestamp > now.getTime())) throw new Error('Invalid source date')
  return new Date(timestamp).toISOString()
}

function empty(source: PersonalEvidenceSource, status: PersonalSourceStatus = 'empty'): Section {
  return { summary: { source, status, updatedAt: null }, evidence: [], revision: null }
}

function partial(section: Section) { section.summary.status = 'partial' }
function observed(section: Section, value: string) {
  if (!section.summary.updatedAt || value > section.summary.updatedAt) section.summary.updatedAt = value
}

function add(
  section: Section, sourceRef: string, field: string, nature: PersonalEvidenceNature,
  label: string, value: unknown, observedAt: string, href: string, expiresAt: string | null = null,
  preferenceDomain?: PersonalEvidence['preferenceDomain'],
) {
  try {
    const body = text(value)
    if (!body) return
    section.evidence.push({
      id: section.summary.source + ':' + sourceRef + ':' + field,
      source: section.summary.source, nature, label, text: body, observedAt, expiresAt, href,
      ...(preferenceDomain ? { preferenceDomain } : {}),
    })
    if (section.summary.status === 'empty') section.summary.status = 'available'
  } catch { partial(section) }
}

async function section(source: PersonalEvidenceSource, read: () => PromiseLike<ReadResult>, parse: (data: unknown) => Section): Promise<Section> {
  try {
    const result = await read()
    return !result || result.error ? empty(source, 'unavailable') : parse(result.data)
  } catch { return empty(source, 'unavailable') }
}

function context(sections: Section[]): OpportunityPersonalContext {
  const evidence: PersonalEvidence[] = []
  for (const source of sections) {
    for (const item of source.evidence) {
      if (evidence.length >= MAX_EVIDENCE) { partial(source); break }
      evidence.push(item)
    }
  }
  // JSON order is not evidence. Keep a stable identity across equivalent reads.
  evidence.sort((a, b) => a.id.localeCompare(b.id, 'en'))
  const sources = sections.map(item => ({ ...item.summary }))
  const statuses = sources.map(item => item.status)
  const status = statuses.every(value => value === 'unavailable') ? 'unavailable'
    : statuses.some(value => value === 'unavailable' || value === 'partial') ? 'partial'
      : evidence.length ? 'available' : 'empty'
  const revision = createHash('sha256').update(JSON.stringify({
    policy: 'personal-context-source-projection.v1', sources, evidence,
    revisions: sections.map(item => item.revision),
  })).digest('hex')
  return { version: 1, status, revision, sources, evidence }
}

function unavailable(): OpportunityPersonalContext {
  return context(SOURCES.map(source => empty(source, 'unavailable')))
}

function parseGoal(data: unknown, now: Date): Section {
  const output = empty('dtc_goal')
  if (data === null) return output
  const value = row(data)
  try {
    const id = sourceId(value.id), observedAt = date(value.updated_at, now)
    if (!Number.isSafeInteger(value.version) || Number(value.version) < 1 || !Array.isArray(value.target_roles)) throw new Error('Invalid goal source')
    observed(output, observedAt)
    output.revision = { id, version: value.version }
    if (value.target_roles.length > MAX_GOALS) partial(output)
    const roles = new Set<string>()
    for (const candidate of value.target_roles.slice(0, MAX_GOALS)) {
      try {
        const role = text(candidate, 200)
        if (role) roles.add(role)
      } catch { partial(output) }
    }
    for (const [index, role] of [...roles].sort().entries()) {
      add(output, id, 'goal-' + index, 'declared_goal', 'Objetivo declarado en DTC', role, observedAt, '/despega/career-identity')
    }
  } catch { partial(output) }
  return output
}

function parseCV(data: unknown, now: Date): Section {
  const output = empty('cv')
  if (data === null) return output
  const value = row(data)
  try {
    const id = sourceId(value.id), observedAt = date(value.completed_at, now, true)
    if (value.module_id !== 'cv-builder-studio' && value.module_id !== 'module-3') throw new Error('Invalid CV source')
    observed(output, observedAt)
    output.revision = { id, module: value.module_id, observedAt }
    const href = '/despega/a3/cv-builder-studio'
    // Keep the complete skills clause. Comma splitting could turn a negated list into positive skills.
    add(output, id, 'skills', 'declared_skill', 'Habilidades declaradas en tu CV', value.skills, observedAt, href)
    add(output, id, 'target-role', 'declared_goal', 'Cargo objetivo declarado en tu CV', value.target_role, observedAt, href)
    add(output, id, 'experienceTitle', 'declared_experience', 'Cargo declarado en tu CV', value.experience_title, observedAt, href)
    for (const number of [1, 2, 3]) {
      add(output, id, 'achievement' + number, 'declared_experience', 'Logro declarado en tu CV', value['achievement_' + number], observedAt, href)
    }
    if (!output.evidence.length) partial(output)
  } catch { partial(output) }
  return output
}

function a1Selections(value: unknown): Row {
  const selections = row(value), entries = Object.entries(selections)
  if (entries.length !== 28 || entries.some(([key, answer]) => !/^[1-9]\d?$/.test(key)
    || typeof answer !== 'string' || answer.length > 300)) throw new Error('Invalid questionnaire source')
  return selections
}

function parseA1(data: unknown, now: Date): Section {
  const output = empty('dtc_a1')
  if (data === null) return output
  const value = row(data)
  try {
    const id = sourceId(value.id), observedAt = date(value.completed_at, now)
    observed(output, observedAt)
    const questionnaireVersion = text(value.questionnaire_version, 100)
    const responses = {
      more: a1Selections(value.responses_more), less: a1Selections(value.responses_less),
      ...(questionnaireVersion ? { _meta: { questionnaireVersion } } : {}),
    }
    const report = buildA1ProfessionalReport({
      rawScores: { D: value.disc_d, I: value.disc_i, S: value.disc_s, C: value.disc_c },
      dominantPattern: value.dominant_pattern, secondaryPattern: value.secondary_pattern,
      completedAt: observedAt, generatedAt: observedAt, assessmentResponses: responses,
    })
    if (!report.reviewable || report.understanding.responseState !== 'available') throw new Error('Unreviewable preference source')
    output.revision = { id, observedAt, version: report.understanding.version, questionnaire: report.understanding.questionnaireVersion }
    // Situational choices guide reflection; neither the DISC pattern nor a score is projected.
    const domains = ['environment', 'communication', 'decision', 'collaboration'] as const
    for (const domainId of domains) {
      const domain = report.understanding.domains.find(item => item.id === domainId)
      const choice = domain?.evidence[0]
      if (!domain || !choice) continue
      const statement = 'En «' + domain.title + '», al responder «' + choice.question + '», elegiste «'
        + choice.more.text + '» como más parecido y «' + choice.less.text
        + '» como menos parecido. Es una preferencia autodeclarada; no acredita una competencia.'
      add(output, id, 'question-' + choice.questionId, 'self_reported_preference', 'A1 · ' + domain.title, statement, observedAt, '/despega/a1-report', null, domainId)
    }
    if (!output.evidence.length) partial(output)
  } catch { partial(output) }
  return output
}

function parseA2(data: unknown, now: Date): Section {
  const output = empty('dtc_a2')
  if (!Array.isArray(data)) throw new Error('Invalid A2 collection')
  if (data.length > MAX_A2_ROWS) partial(output)
  const seen = new Set<string>(), revisions: unknown[] = []
  for (const candidate of data.slice(0, MAX_A2_ROWS)) {
    try {
      const value = row(candidate), sourceRef = value.source_ref
      if (typeof sourceRef !== 'string' || !/^a2-day-([1-9]|[1-8]\d|90)$/.test(sourceRef)) throw new Error('Invalid A2 reference')
      // Never resurrect an older version after an invalid or expired latest source.
      if (seen.has(sourceRef)) continue
      seen.add(sourceRef)
      const id = sourceId(value.id), day = value.day
      if (!Number.isInteger(day) || sourceRef !== 'a2-day-' + day) throw new Error('Invalid A2 reference')
      const observedAt = date(value.observed_at, now)
      const expiresAt = value.expires_at === null ? null : date(value.expires_at, now, false, true)
      if (expiresAt && expiresAt < observedAt) throw new Error('Invalid source expiry')
      observed(output, observedAt)
      revisions.push({ id, ref: sourceRef, observedAt, expiresAt, version: Number.isSafeInteger(value.identity_version) ? value.identity_version : null })
      if (expiresAt && Date.parse(expiresAt) <= now.getTime()) continue
      if (value.validation_passed !== true || !['structural', 'specialized'].includes(String(value.validation_status))) { partial(output); continue }
      const before = output.evidence.length, label = 'A2 · Evidencia documentada del día ' + day
      // A completed structural exercise is documented practice, not a competence certification.
      add(output, id, 'evidence', 'practice_artifact', label, value.submission_evidence, observedAt, '/despega/a2', expiresAt)
      add(output, id, 'summary', 'practice_artifact', 'A2 · Trabajo documentado del día ' + day, value.submission_summary, observedAt, '/despega/a2', expiresAt)
      if (output.evidence.length === before) partial(output)
    } catch { partial(output) }
  }
  output.revision = revisions.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b), 'en'))
  return output
}

function parseA3(data: unknown, now: Date): Section {
  const output = empty('dtc_a3')
  if (data === null) return output
  const value = row(data)
  try {
    const id = sourceId(value.id), observedAt = date(value.completed_at, now, true)
    if (value.module_id !== 'value-mining-lab' && value.module_id !== 'module-2') throw new Error('Invalid A3 source')
    observed(output, observedAt)
    output.revision = { id, module: value.module_id, observedAt }
    const href = '/despega/a3/value-mining-lab'
    // These prompts describe past work; completing the exercise does not verify that experience.
    add(output, id, 'project', 'declared_experience', 'A3 · Experiencia de proyecto declarada', value.project_value, observedAt, href)
    add(output, id, 'critical-situation', 'declared_experience', 'A3 · Experiencia en situación crítica declarada', value.critical_value, observedAt, href)
    if (!output.evidence.length) partial(output)
  } catch { partial(output) }
  return output
}

/** Owner-bound, bounded reads. Missing sources never trigger writes, RPCs or legacy profile extraction. */
export async function readOpportunityPersonalContext(client: Client, userId: string, options: Options = {}): Promise<OpportunityPersonalContext> {
  const now = options.now ?? new Date()
  if (!UUID.test(userId) || !Number.isFinite(now.getTime())) return unavailable()
  try {
    const { data, error } = await client.auth.getUser()
    if (error || !data.user || data.user.id !== userId) return unavailable()
  } catch { return unavailable() }

  const sections = await Promise.all([
    section('cv', () => client.from('a3_module_completion').select(CV_SELECT).eq('user_id', userId)
      .in('module_id', ['cv-builder-studio', 'module-3']).not('completed_at', 'is', null)
      .order('completed_at', { ascending: false }).order('id', { ascending: false }).limit(1).maybeSingle(), data => parseCV(data, now)),
    section('dtc_goal', () => client.from('career_identities').select('id,version,target_roles,updated_at')
      .eq('user_id', userId).limit(1).maybeSingle(), data => parseGoal(data, now)),
    section('dtc_a1', () => client.from('a1_cerebral_assessment').select(A1_SELECT).eq('user_id', userId)
      .not('completed_at', 'is', null).order('completed_at', { ascending: false }).order('id', { ascending: false })
      .limit(1).maybeSingle(), data => parseA1(data, now)),
    section('dtc_a2', () => client.from('career_evidence').select(A2_SELECT).eq('user_id', userId)
      .eq('source_module', 'a2').eq('source_type', 'mission_completion')
      .order('observed_at', { ascending: false }).order('id', { ascending: false }).limit(MAX_A2_ROWS + 1), data => parseA2(data, now)),
    section('dtc_a3', () => client.from('a3_module_completion').select(A3_SELECT).eq('user_id', userId)
      .in('module_id', ['value-mining-lab', 'module-2']).not('completed_at', 'is', null)
      .order('completed_at', { ascending: false }).order('id', { ascending: false }).limit(1).maybeSingle(), data => parseA3(data, now)),
  ])
  return context(sections)
}

export async function loadOpportunityPersonalContext(userId: string, options: Options = {}): Promise<OpportunityPersonalContext> {
  try { return await readOpportunityPersonalContext(await createClient(), userId, options) }
  catch { return unavailable() }
}

/** Deliberate public projection: never spread the server context into an API response. */
export function getOpportunityPersonalContextSummary(value: OpportunityPersonalContext): PersonalContextSummary {
  return { version: value.version, status: value.status, revision: value.revision, sources: value.sources.map(source => ({ source: source.source, status: source.status, updatedAt: source.updatedAt })) }
}
