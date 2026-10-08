import { createOpportunityEvaluator, type MatchableOpportunity, type OpportunityMatch, type OpportunitySearchFilters } from './matching'
import { normalizeRoleSearchPhrase, planOpportunityRoleTerms } from './search-intent'
import type { OpportunityFieldEvidence } from './opportunity-evidence'
import type {
  EvaluatedPersonalOrientation, OpportunityPersonalContext, OpportunityPersonalOrientation,
  OrientationOfferEvidence, OrientationSupport, PersonalEvidence, PersonalOrientationQuestion,
  PersonalOrientationReason,
} from './personal-orientation-types'

interface OrientableOpportunity extends MatchableOpportunity {
  description?: string | null
  requirements?: readonly string[]
  skills?: readonly string[]
  field_evidence?: readonly OpportunityFieldEvidence[]
  match?: OpportunityMatch
}

const MAX_RECORDS = 120
const MAX_SOURCE_TEXT = 40_000
const MAX_LINES = 500
const MAX_CLAUSES = 2_000
const MAX_QUOTE = 600
const MAX_TOPICS = 3
const MAX_SUPPORT = 6
const MAX_QUESTIONS = 3
const SAFE_ROUTES = new Set([
  '/despega/a3/cv-builder-studio', '/despega/a3/value-mining-lab', '/despega/a3/job-decoder',
  '/despega/a3/answer-architecture', '/despega/a3/ajuste-por-vacante', '/despega/career-identity',
  '/despega/a1-report', '/despega/a2', '/despega/a3', '/despega/recorrido',
])

const SOURCE_LABELS: Record<PersonalEvidence['source'], string> = {
  cv: 'Tu CV', dtc_goal: 'Tu objetivo en DTC', dtc_a1: 'Tu respuesta en A1',
  dtc_a2: 'Tu registro en A2', dtc_a3: 'Tu registro en A3',
}
const DEFAULT_ROUTES: Record<PersonalEvidence['source'], string> = {
  cv: '/despega/a3/cv-builder-studio', dtc_goal: '/despega/career-identity',
  dtc_a1: '/despega/a1-report', dtc_a2: '/despega/a2', dtc_a3: '/despega/a3',
}

function fold(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

function literal(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function contains(value: string, term: string): boolean {
  const normalized = fold(term)
  if (!normalized) return false
  return new RegExp('(?:^|[^a-z0-9_+#])' + literal(normalized) + '(?=$|[^a-z0-9_+#])').test(fold(value))
}

// Reviewed spelling/language variants only. No occupational or capability inference.
const TOPIC_ALIASES: readonly (readonly string[])[] = [
  ['Excel', 'Microsoft Excel'], ['Power BI', 'PowerBI'], ['PostgreSQL', 'Postgres'],
  ['Inglés', 'English'], ['Portugués', 'Portuguese'], ['trabajo en equipo', 'teamwork'],
  ['comunicación escrita', 'written communication'], ['comunicación oral', 'verbal communication'],
]

function topicNames(value: string): readonly string[] {
  return TOPIC_ALIASES.find(group => group.some(alias => fold(alias) === fold(value))) ?? [value]
}

function topicKey(value: string): string {
  return fold(topicNames(value)[0])
}

function mentions(value: string, topic: string): boolean {
  return topicNames(topic).some(name => contains(value, name))
}

const NEGATION = /\b(?:no|not|never|without|neither|nor|sin|ni|tampoco|lack|lacks|lacking|ningun[oa]?|ningunos|ningunas|innecesari[oa]s?|unnecessary|unneeded|isn['’]t|aren['’]t|doesn['’]t|don['’]t|haven['’]t|hasn['’]t|cannot|can't|carezco|desconozco)\b/
const ASPIRATION = /\b(?:quiero|quisiera|me gustaria|deseo|espero|pretendo|busco|aspir[oa]|interesad[oa]|interes en|objetivo|mi meta|aprender|aprendiendo|en aprendizaje|en formacion|por aprender|pendiente|aun no|todavia no|plan to|want to|would like|hope to|interested in|learning|to learn|aspiring|seeking|wish to)\b/
const INDIRECT = /\b(?:(?:el equipo|mi equipo|mis? companer[oa]s?|mis? colegas?) (?:usa|utiliza|domina|maneja|sabe|usan|utilizan|dominan|manejan|saben|tiene(?:n)? experiencia)|(?:our team|my team|my colleagues?|team members?) (?:uses?|knows?|programs?|(?:has|have) experience)|(?:contrate|contratacion de|reclute|reclutamiento de|supervise|supervision de|coordine|coordinacion de) (?:expertos|especialistas|profesionales)|(?:hired|recruited|supervised) (?:experts|specialists)|se requiere|requerimos|buscamos|must have|candidates? (?:must|should)|(?:curso|capacitacion|training) (?:pendiente|futur[oa]|previst[oa]|scheduled|planned))\b/
const PSYCHOLOGICAL = /\b(?:disc|psicometr\w*|psychometr\w*|perfil psicolog\w*|psychological profile|dominant pattern|patron dominante|intensidad (?:d|i|s|c))\b/
const QUALIFIER = /\b(?:avanzad[oa]|intermedi[oa]|expert[oa]?|experiencia (?:demostrable|comprobable)|fluido|fluida|bilingue|nativ[oa]|certificad[oa]|licencia|nivel|advanced|intermediate|expertise|expert|fluent|fluency|bilingual|native|certified|certification|proficien\w*|[0-9]+\s*\+?\s*(?:anos|years))\b/
const EXPLICIT_PERSONAL_STATEMENT = /^(?:(?:yo )?(?:utilice|use|aplique|desarrolle|construi|implemente|elabore|automatice|programe|realice|prepare|presente|documente|analice|trabaje|uso|utilizo|manejo|domino|conozco)|(?:cuento con|tengo) experiencia|experiencia (?:en|con)|i (?:(?:have|had) )?(?:used|developed|built|implemented|created|prepared|presented|documented|analyzed|worked))\b/

function plainBounded(value: unknown, maximum: number): string {
  if (typeof value !== 'string' || value.length > maximum || /[<>\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)) return ''
  return value.trim()
}

/** Split complete clauses, never comma-separated lists whose negation can span terms. */
function clauses(text: string): string[] {
  if (!plainBounded(text, MAX_SOURCE_TEXT)) return []
  const lines = text.split(/\r?\n/)
  if (lines.filter(line => line.trim()).length > MAX_LINES) return []
  const result = lines.flatMap(line => line.split(/;|(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿])/u)).map(line => line.trim()).filter(Boolean)
  if (result.length > MAX_CLAUSES) return []
  return result
}

function validDate(value: string): number {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return NaN
  return Date.parse(value)
}

function validRecord(record: PersonalEvidence, context: OpportunityPersonalContext, now: number): boolean {
  if (!record || !Object.hasOwn(SOURCE_LABELS, record.source) || context.status === 'unavailable') return false
  if (!/^[a-zA-Z0-9:._-]{1,160}$/.test(record.id)) return false
  const source = context.sources.find(entry => entry.source === record.source)
  if (!source || !['available', 'partial'].includes(source.status)) return false
  const observed = validDate(record.observedAt)
  const expiry = record.expiresAt === null ? Infinity : validDate(record.expiresAt)
  if (!Number.isFinite(observed) || observed > now || !(expiry > now)) return false
  if (!plainBounded(record.text, MAX_SOURCE_TEXT)) return false
  return record.source === 'cv' ? ['declared_skill', 'declared_experience'].includes(record.nature)
    : record.source === 'dtc_goal' ? record.nature === 'declared_goal'
      : record.source === 'dtc_a1' ? record.nature === 'self_reported_preference'
        : ['declared_experience', 'practice_artifact'].includes(record.nature)
}

function projectRecord(record: PersonalEvidence, quote: string): PersonalEvidence {
  return {
    id: record.id, source: record.source, nature: record.nature,
    label: SOURCE_LABELS[record.source], text: quote, observedAt: record.observedAt,
    expiresAt: record.expiresAt,
    ...(record.source === 'dtc_a1' && record.preferenceDomain ? { preferenceDomain: record.preferenceDomain } : {}),
    href: SAFE_ROUTES.has(record.href) ? record.href : DEFAULT_ROUTES[record.source],
  }
}

interface OfferTopic { key: string; value: string; quote: OrientationOfferEvidence }

function sourceQuotes(job: OrientableOpportunity): OrientationOfferEvidence[] {
  const entries = Array.isArray(job.field_evidence) ? job.field_evidence.slice(0, 100) : []
  const result: OrientationOfferEvidence[] = []
  for (const item of entries) {
    if (!item || !['skills', 'requirements'].includes(item.field)) continue
    const value = plainBounded(item.value, item.field === 'skills' ? 120 : MAX_QUOTE)
    const excerpt = plainBounded(item.excerpt, MAX_QUOTE)
    if (!value || !excerpt || NEGATION.test(fold(excerpt)) || PSYCHOLOGICAL.test(fold(excerpt))) continue
    if (item.field === 'skills' && (!mentions(excerpt, value) || !(job.skills ?? []).some(skill => topicKey(skill) === topicKey(value)))) continue
    if (item.field === 'requirements' && !(job.requirements ?? []).some(requirement => fold(requirement) === fold(value))) continue
    result.push({ field: item.field, value, excerpt })
  }
  return result
}

function offerTopics(quotes: OrientationOfferEvidence[]): OfferTopic[] {
  const topics = new Map<string, OfferTopic>()
  for (const quote of quotes) {
    if (quote.field !== 'skills') continue
    const key = topicKey(quote.value)
    if (!topics.has(key)) topics.set(key, { key, value: quote.value, quote })
  }
  return [...topics.values()].slice(0, 30)
}

interface PreparedClause { text: string; normalized: string; blocked: boolean; negative: boolean }
interface PersonalMatch { record: PersonalEvidence; quote: string }

function prepareClauses(text: string): PreparedClause[] {
  let blockedSection = false
  let negativeSection = false
  return clauses(text).map(clause => {
    const normalized = fold(clause)
    const negative = NEGATION.test(normalized)
    if (clause.length <= 140 && /:$/.test(clause)) {
      negativeSection = negative
      blockedSection = negativeSection || ASPIRATION.test(normalized) || PSYCHOLOGICAL.test(normalized) ||
        /\b(?:intereses|interests|goals|aspiraciones|objetivos|pendientes|to learn)\b/.test(normalized)
    } else if (!negative && !ASPIRATION.test(normalized) && EXPLICIT_PERSONAL_STATEMENT.test(normalized.replace(/^[\s•*\-–—]+/, ''))) {
      // A new explicit personal statement can close a previous list. Its own
      // negation is still checked, and conflicting topics remain unresolved.
      negativeSection = false
      blockedSection = false
    } else if (negative && !/[.!?]$/.test(clause)) {
      // A line break alone does not end "No domino SQL\nPython".
      negativeSection = true
      blockedSection = true
    }
    return {
      text: clause, normalized,
      negative: negativeSection || negative,
      blocked: blockedSection || ASPIRATION.test(normalized) || INDIRECT.test(normalized) || PSYCHOLOGICAL.test(normalized),
    }
  })
}

function incidentalName(clause: string, topic: string): boolean {
  const key = topicKey(topic)
  if (key === 'excel') return /(?:\b(?:i|we|you|they|who|to)\s+|^)excel\s+(?:at|in|when)\b/.test(clause)
  if (key === 'react') return /(?:\b(?:i|we|you|they|who|to)\s+|^)react\s+(?:to|quickly|calmly|appropriately)\b/.test(clause)
  if (key === 'word') return /\b(?:final|last|every|each|spoken|written)\s+word\b|\bword\s+(?:of|for|about)\b/.test(clause)
  if (key === 'spring') return /\bspring\s+(?:events|semester|season)\b|\b(?:in|this|last|next)\s+spring\b/.test(clause)
  if (key === 'swift') return /\bswift\s+(?:communication|responses?|decisions?)\b/.test(clause)
  if (key === 'go') return /\bgo\s+(?:to|ahead|back|forward|beyond|through)\b/.test(clause)
  return false
}

function addSupport(support: OrientationSupport[], record: PersonalEvidence, text: string, offer: OrientationOfferEvidence): string | null {
  const existing = support.find(item => item.personal.id === record.id && item.personal.text === text &&
    item.offer.field === offer.field && item.offer.value === offer.value && item.offer.excerpt === offer.excerpt)
  if (existing) return existing.id
  if (support.length >= MAX_SUPPORT) return null
  const id = 'support-' + (support.length + 1)
  support.push({ id, personal: projectRecord(record, text), offer })
  return id
}

function reasonForTopic(topic: OfferTopic, records: PersonalMatch[], support: OrientationSupport[]): PersonalOrientationReason | null {
  // One CV declaration and one DTC artifact suffice; repeated uploads cannot raise relevance.
  const selected = [records.find(item => item.record.source === 'cv'), records.find(item => item.record.source !== 'cv')].filter((item): item is PersonalMatch => Boolean(item))
  const ids = selected.map(item => addSupport(support, item.record, item.quote, topic.quote)).filter((id): id is string => Boolean(id))
  if (!ids.length) return null
  const represented = support.filter(item => ids.includes(item.id))
  const cv = represented.find(item => item.personal.source === 'cv')
  const dtc = represented.find(item => item.personal.source === 'dtc_a2' || item.personal.source === 'dtc_a3')
  const practice = dtc?.personal.nature === 'practice_artifact'
  return {
    code: cv ? cv.personal.nature === 'declared_skill' ? 'cv_skill' : 'cv_experience' : 'dtc_practice',
    label: cv && dtc ? topic.value + ' aparece en tu CV y en ' + (practice ? 'una práctica de DTC' : 'una experiencia que declaraste en DTC') + '.'
      : cv ? topic.value + ' aparece en ' + (cv.personal.nature === 'declared_skill' ? 'las habilidades que declaraste en tu CV.' : 'una experiencia que declaraste en tu CV.')
        : topic.value + ' aparece en ' + (practice ? 'una práctica que registraste en DTC.' : 'una experiencia que declaraste en DTC.'),
    supportIds: ids,
  }
}

function goalReason(job: OrientableOpportunity, records: PersonalEvidence[], filters: OpportunitySearchFilters, support: OrientationSupport[]): PersonalOrientationReason | null {
  for (const record of records.filter(item => item.source === 'dtc_goal')) {
    const text = plainBounded(record.text, MAX_QUOTE)
    if (!text || NEGATION.test(fold(text)) || PSYCHOLOGICAL.test(fold(text))) continue
    const targets = (filters.targetRoles ?? []).filter(role => {
      const match = createOpportunityEvaluator({ targetRoles: [role], breadth: 'related' })({ title: text })
      return match?.kind === 'title' || match?.kind === 'equivalent'
    })
    // A past objective cannot pull an exploration away from the user's current target.
    if ((filters.targetRoles?.length ?? 0) && !targets.length) continue
    const role = targets[0] ?? text
    const match = createOpportunityEvaluator({ targetRoles: [role], breadth: filters.breadth ?? 'related' })(job)
    if (match?.kind !== 'title' && match?.kind !== 'equivalent') continue
    const title = plainBounded(job.title, 200)
    if (!title) continue
    const id = addSupport(support, record, text, { field: 'title', value: title, excerpt: title })
    if (id) return { code: 'dtc_goal', label: 'El cargo se relaciona con el objetivo que declaraste en DTC y con esta búsqueda.', supportIds: [id] }
  }
  return null
}

function experienceTitleReason(job: OrientableOpportunity, records: PersonalEvidence[], support: OrientationSupport[]): PersonalOrientationReason | null {
  const title = plainBounded(job.title, 200)
  if (!title) return null
  const offered = normalizeRoleSearchPhrase(title)
  for (const record of records.filter(item => item.source === 'cv' && item.nature === 'declared_experience' && item.id.endsWith(':experienceTitle'))) {
    const text = plainBounded(record.text, 200)
    if (!text || NEGATION.test(fold(text)) || ASPIRATION.test(fold(text)) || PSYCHOLOGICAL.test(fold(text))) continue
    const equivalent = planOpportunityRoleTerms({ targetRoles: [text], breadth: 'related' }).some(term =>
      (term.kind === 'title' || term.kind === 'equivalent') && normalizeRoleSearchPhrase(term.term) === offered)
    if (!equivalent) continue
    const id = addSupport(support, record, text, { field: 'title', value: title, excerpt: title })
    if (id) return { code: 'cv_experience', label: 'En tu CV declaras experiencia como ' + text + ', un cargo que se relaciona con el publicado.', supportIds: [id] }
  }
  return null
}

const A1_TOPICS: Array<{ domain: PersonalEvidence['preferenceDomain']; requirement: RegExp; action: string }> = [
  { domain: 'collaboration', requirement: /\b(?:trabajo en equipo|teamwork|colaboracion|collaboration|collaborate)\b/, action: 'Prepara un ejemplo reciente de colaboración y contrástalo con tu preferencia declarada en A1; confirma cómo trabaja el equipo de este cargo.' },
  { domain: 'communication', requirement: /\b(?:comunicacion (?:oral|escrita|efectiva)|(?:written|verbal) communication|presentaciones|presentations)\b/, action: 'Prepara un ejemplo reciente de comunicación y contrástalo con tu preferencia declarada en A1; revisa qué intercambios requiere este cargo.' },
  { domain: 'decision', requirement: /\b(?:toma de decisiones|decision making|decision-making)\b/, action: 'Revisa una decisión reciente junto con tu preferencia declarada en A1 y prepara un ejemplo para la responsabilidad que describe esta oferta.' },
]

function a1Action(records: PersonalEvidence[], quotes: OrientationOfferEvidence[], support: OrientationSupport[]): OpportunityPersonalOrientation['nextStep'] | null {
  if (support.length >= MAX_SUPPORT) return null
  for (const record of records.filter(item => item.source === 'dtc_a1')) {
    const text = plainBounded(record.text, MAX_QUOTE)
    if (!text || !record.preferenceDomain) continue
    for (const topic of A1_TOPICS) {
      if (record.preferenceDomain !== topic.domain) continue
      const offer = quotes.find(quote => topic.requirement.test(fold(quote.excerpt)))
      if (!offer) continue
      const id = addSupport(support, record, text, offer)
      if (id) return { label: topic.action, href: '/despega/a1-report', supportIds: [id] }
    }
  }
  return null
}

function addQuestion(questions: PersonalOrientationQuestion[], question: PersonalOrientationQuestion): void {
  if (questions.length < MAX_QUESTIONS && !questions.some(item => item.label === question.label)) questions.push(question)
}

function onlyTopicNames(quote: OrientationOfferEvidence, topics: OfferTopic[]): boolean {
  let remainder = fold(quote.excerpt)
  for (const topic of topics) for (const name of topicNames(topic.value)) {
    remainder = remainder.replace(new RegExp('(^|[^a-z0-9_+#])' + literal(fold(name)) + '(?=$|[^a-z0-9_+#])', 'g'), '$1')
  }
  return !remainder.replace(/\b(?:y|e|and|o|or)\b/g, '').replace(/[^a-z0-9]/g, '')
}

/**
 * A deterministic, read-only explanation of relevant declarations and practice.
 * It never decides inclusion, replaces current search filters, or estimates aptitude.
 * Only distinct topics with visible, two-sided support can break a search-rank tie.
 */
export function createOpportunityPersonalOrienter(
  context: OpportunityPersonalContext,
  filters: OpportunitySearchFilters,
  now = new Date(),
): (job: OrientableOpportunity) => EvaluatedPersonalOrientation {
  const observed = now.getTime()
  const records = Number.isFinite(observed) && Array.isArray(context.evidence)
    ? context.evidence.slice(0, MAX_RECORDS).filter(record => validRecord(record, context, observed)).map(record => ({ ...record })) : []
  const personal = records.filter(record => record.source === 'cv' || record.source === 'dtc_a2' || record.source === 'dtc_a3')
  // A prior role is its own declared topic; a title alone does not assert each tool named in it.
  const prepared = personal.filter(record => !record.id.endsWith(':experienceTitle'))
    .map(record => ({ record, clauses: prepareClauses(record.text) }))
  const topicMatches = new Map<string, PersonalMatch[]>()
  const matchesForTopic = (topic: OfferTopic): PersonalMatch[] => {
    const cached = topicMatches.get(topic.key)
    if (cached) return cached
    const names = topicNames(topic.value).map(name => new RegExp('(?:^|[^a-z0-9_+#])' + literal(fold(name)) + '(?=$|[^a-z0-9_+#])'))
    const relevant = prepared.map(item => ({ record: item.record, clauses: item.clauses.filter(clause => names.some(name => name.test(clause.normalized))) }))
    // Contradictions across current records also stay unresolved, regardless of input order.
    const matches = relevant.some(item => item.clauses.some(clause => clause.negative)) ? []
      : relevant.flatMap(item => {
        const quote = item.clauses.find(clause => clause.text.length <= MAX_QUOTE && !clause.blocked && !incidentalName(clause.normalized, topic.value))?.text
        return quote ? [{ record: item.record, quote }] : []
      })
    topicMatches.set(topic.key, matches)
    return matches
  }
  return job => evaluatePrepared(job, context, filters, records, personal, matchesForTopic)
}

function evaluatePrepared(
  job: OrientableOpportunity,
  context: OpportunityPersonalContext,
  filters: OpportunitySearchFilters,
  records: PersonalEvidence[],
  personal: PersonalEvidence[],
  matchesForTopic: (topic: OfferTopic) => PersonalMatch[],
): EvaluatedPersonalOrientation {
  const support: OrientationSupport[] = []
  const reasons: PersonalOrientationReason[] = []
  const toConfirm: PersonalOrientationQuestion[] = []
  const quotes = sourceQuotes(job)
  const topics = offerTopics(quotes)
  const supported = new Set<string>()
  const experience = experienceTitleReason(job, records, support)
  if (experience) { reasons.push(experience); supported.add('experience-title') }
  for (const topic of topics) {
    const matches = matchesForTopic(topic)
    if (matches.length && reasons.length < MAX_TOPICS) {
      const reason = reasonForTopic(topic, matches, support)
      if (reason) { reasons.push(reason); supported.add(topic.key) }
    }
    if (!matches.length) addQuestion(toConfirm, {
      code: 'requirement_unconfirmed', label: 'Confirma tu experiencia con ' + topic.value + ': todavía no hay respaldo suficiente en la información disponible.', offer: topic.quote,
    })
    else if (QUALIFIER.test(fold(topic.quote.excerpt))) addQuestion(toConfirm, {
      code: 'level_unconfirmed', label: 'Confirma el nivel, la experiencia o la acreditación que pide la oferta para ' + topic.value + '.', offer: topic.quote,
    })
  }
  if (reasons.length < MAX_TOPICS) {
    const goal = goalReason(job, records, filters, support)
    if (goal) reasons.push(goal)
  }
  for (const quote of quotes.filter(item => item.field === 'requirements')) {
    // A separate provider skill field may say only "SQL" while a requirement
    // adds advanced use, years, travel or a credential. Keep the entire condition.
    if (toConfirm.some(question => question.offer?.excerpt === quote.excerpt) || onlyTopicNames(quote, topics)) continue
    addQuestion(toConfirm, {
      code: QUALIFIER.test(fold(quote.excerpt)) ? 'level_unconfirmed' : 'requirement_unconfirmed',
      label: 'Revisa este requisito con tu experiencia y confirma sus condiciones: «' + quote.excerpt + '».', offer: quote,
    })
  }
  if (!quotes.length) addQuestion(toConfirm, {
    code: 'offer_details_missing', label: 'Los datos disponibles no permiten contrastar requisitos con respaldo. Revisa las funciones y condiciones en el aviso original.',
  })
  if (context.status !== 'available' || !personal.length) addQuestion(toConfirm, {
    code: 'context_incomplete', label: context.status === 'unavailable'
      ? 'No pudimos consultar tu contexto personal en este momento.'
      : 'Falta información personal utilizable para completar el cruce; puedes actualizar tu CV y tus registros de DTC.',
  })
  const supportingTopics = topics.filter(topic => supported.has(topic.key))
  const topicNamesForAction = supportingTopics.map(topic => topic.value).slice(0, 2).join(' y ')
  let nextStep: OpportunityPersonalOrientation['nextStep'] = context.status === 'unavailable'
    ? { label: 'Vuelve a cargar la orientación personal. Mientras tanto, puedes revisar los requisitos y el aviso original.', supportIds: [] }
    : supportingTopics.length || experience
      ? { label: 'Prepara un ejemplo concreto de ' + (topicNamesForAction || 'tu experiencia en este cargo') + ' con el respaldo disponible y confirma el nivel y las condiciones del aviso.', href: '/despega/a3/ajuste-por-vacante', supportIds: reasons.filter(reason => reason.code !== 'dtc_goal').flatMap(reason => reason.supportIds) }
      : reasons.some(reason => reason.code === 'dtc_goal')
        ? { label: 'Revisa las funciones y requisitos para decidir cómo avanzar hacia tu objetivo declarado.', href: '/despega/a3/job-decoder', supportIds: reasons.flatMap(reason => reason.supportIds) }
        : personal.length
          ? { label: 'Revisa los requisitos del aviso y registra un ejemplo específico si cuentas con experiencia relacionada.', href: '/despega/a3/value-mining-lab', supportIds: [] }
          : { label: 'Actualiza tu CV o registra un ejemplo en DTC para contrastarlo con esta oferta.', href: '/despega/a3/cv-builder-studio', supportIds: [] }
  nextStep = a1Action(records, quotes, support) ?? nextStep
  const referenced = new Set([...reasons.flatMap(reason => reason.supportIds), ...nextStep.supportIds])
  const visibleSupport = support.filter(item => referenced.has(item.id))
  const status = visibleSupport.length ? 'with_evidence' : context.status === 'unavailable' ? 'context_unavailable' : 'search_only'
  return {
    supportedTopics: supported.size,
    orientation: {
      version: 1, status,
      summary: status === 'with_evidence'
        ? 'Tu búsqueda se complementa con las declaraciones y registros pertinentes que se citan aquí. Los requisitos pendientes siguen por confirmar.'
        : status === 'context_unavailable'
          ? 'La oferta corresponde a tu búsqueda; la orientación personal no está disponible en este momento.'
          : 'La oferta corresponde a tu búsqueda. Aún no encontramos respaldo personal suficiente para explicarla más allá de esos criterios.',
      reasons, toConfirm, nextStep, support: visibleSupport,
    },
  }
}

export function evaluateOpportunityPersonalOrientation(
  job: OrientableOpportunity,
  context: OpportunityPersonalContext,
  filters: OpportunitySearchFilters,
  now = new Date(),
): EvaluatedPersonalOrientation {
  return createOpportunityPersonalOrienter(context, filters, now)(job)
}
