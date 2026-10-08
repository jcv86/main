import { load } from 'cheerio'

export type OpportunityWorkMode = 'remote' | 'hybrid' | 'onsite'

/** Quotes from visible source text/fields, never a claim about an applicant. */
export interface OpportunityFieldEvidence {
  field: 'requirements' | 'skills' | 'workMode'
  value: string
  excerpt: string
  origin: 'source_field' | 'description'
  section?: string
}

export interface OpportunityEvidenceInput {
  description?: unknown
  requirements?: unknown
  skills?: unknown
  workMode?: unknown
  /** A provider's explicit workplace/location label, not a whole page. */
  workModeText?: unknown
}

const MAX_HTML = 200_000
const MAX_DESCRIPTION = 40_000
const MAX_TEXT_LINES = 500
const MAX_TEXT_CLAUSES = 2_000
const MAX_HTML_ELEMENTS = 2_000
const MAX_REQUIREMENTS = 50
const MAX_SKILLS = 30
const MAX_CLAUSE = 2_000
const HIDDEN = 'script,style,noscript,template,iframe,object,embed,svg,canvas,form,nav,footer,aside,[hidden],[aria-hidden="true"],.d-none,.adsbygoogle,.advertisement,.advertising,.publicidad,.ad-container,.botones-desc,[id^="google_ads"],[id^="div-gpt-ad"]'
const BLOCKS = 'br,p,li,div,section,article,h1,h2,h3,h4,h5,h6,dt,dd,tr'

function folded(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

function readableDocument(value: unknown, requirementContext = false): { text: string; headings: Set<string>; exceedsLimit: boolean } {
  const headings = new Set<string>()
  const empty = { text: '', headings, exceedsLimit: false }
  if (typeof value !== 'string') return empty
  if (value.length > MAX_HTML) return { ...empty, exceedsLimit: true }
  if (!value.trim()) return empty
  let content = value
  // Greenhouse encodes HTML entities. Decode a bounded number of times and
  // remove unsafe nodes again on every pass, including encoded script tags.
  for (let pass = 0; pass < 3 && /<|&(?:#\d+|#x[\da-f]+|[a-z]+);/i.test(content); pass++) {
    if ((content.match(/<\s*[a-z][^>]*>/gi) || []).length > MAX_HTML_ELEMENTS) return { ...empty, exceedsLimit: true }
    const $ = load(content, null, false)
    $(HIDDEN).remove()
    $('[style]').each((_, element) => {
      if (/(?:^|;)\s*(?:display\s*:\s*none|visibility\s*:\s*hidden)\b/i.test($(element).attr('style') || '')) $(element).remove()
    })
    $(BLOCKS).before('\n').after('\n')
    const hasRequirements = requirementContext || $.root().text().split('\n').some(line => sectionHeading(line).kind === 'requirements')
    const headingsInBold = $('strong,b').filter((_, element) => {
      const node = $(element)
      const parent = node.parent()
      return !node.closest('li').length && parent.is('p,div,section,header') && parent.text().trim() === node.text().trim()
    }).toArray()
    for (const element of [...$('h1,h2,h3,h4,h5,h6').toArray(), ...headingsInBold]) {
      const title = $(element).text().trim()
      if (title && title.length <= 140) {
        // A visible delimiter preserves the HTML section boundary after the
        // description is stored as plain text and enriched again on a read.
        // A lone emphasized skill/title is kept verbatim outside a section.
        if (hasRequirements && !/[:?!]$/.test(title)) $(element).append(':')
        headings.add(folded($(element).text()))
      }
    }
    content = $.root().text()
    if (!/<\/?[a-z][^>]*>/i.test(content)) break
    if (pass === 2) return empty
  }
  const text = content.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[\t\r\u00A0 ]+/g, ' ').split('\n').map(line => line.trim()).join('\n')
    .replace(/\n{3,}/g, '\n\n').trim()
  // Never slice through a qualifying/negating clause to manufacture evidence.
  const complex = text.split('\n').filter(Boolean).length > MAX_TEXT_LINES ||
    (text.match(/[.!?;\n]/g) || []).length > MAX_TEXT_CLAUSES
  return text.length <= MAX_DESCRIPTION && !complex ? { text, headings, exceedsLimit: false } : { ...empty, exceedsLimit: true }
}

/** Bounded, readable text. No markup, hidden content or executable nodes survive. */
export function readableOpportunityText(value: unknown): string {
  return readableDocument(value).text
}

/** Lets normalizers reject size/complexity limits without guessing/truncating. */
export function readableOpportunityTextResult(value: unknown): { text: string; exceedsLimit: boolean } {
  const { text, exceedsLimit } = readableDocument(value)
  return { text, exceedsLimit }
}

/** Provider section labels must be applied before HTML boundaries are flattened. */
export function readableOpportunitySection(heading: unknown, content: unknown): string {
  const label = readableOpportunityText(heading).replace(/:+$/, '') || 'Información adicional'
  const { text } = readableDocument(content, sectionHeading(label).kind === 'requirements')
  return text ? label + ':\n' + text : ''
}

const REQUIREMENT_HEADING = /^(?:(?:minimum |preferred |basic |required |essential |desired |technical |key )?(?:requirements?|qualifications?|skills)(?: (?:and|&) (?:experience|qualifications|skills))?|what (?:you(?:['’]ll| will)? (?:bring|need)|we(?:['’]re| are)? looking for)|who you are|your (?:skills|qualifications)|nice to have|(?:requisitos|requerimientos|cualificaciones|calificaciones)(?: (?:minimos|deseables|indispensables|excluyentes|tecnicos|del (?:cargo|puesto)|para (?:el cargo|postular)))?|habilidades(?: (?:y conocimientos|requeridas|necesarias))?|(?:formacion y experiencia)|perfil(?: (?:buscado|requerido|del (?:cargo|candidato|puesto)))?|(?:que (?:buscamos|necesitas|esperamos de ti)|lo que buscamos))$/
const OTHER_HEADING = /^(?:benefits?|perks|what (?:we offer|you(?:'ll| will) (?:do|be doing))|responsibilities|(?:your |key )?(?:responsibilities|duties)|about(?: .{0,80})?|who we are|compensation(?: .{0,60})?|salary(?: .{0,60})?|how to apply|equal (?:opportunity|employment)(?: .{0,60})?|privacy(?: .{0,60})?|(?:beneficios|ofrecemos|que ofrecemos|responsabilidades|funciones|tareas|remuneracion|sueldo|salario|horario|jornada|modalidad|condiciones|como postular|sobre nosotros|acerca de nosotros|nuestra empresa|descripcion del cargo)(?: .{0,60})?)$/
const BENEFIT_OR_BOILERPLATE = /\b(?:we (?:offer|provide)|what we offer|our benefits|benefits include|equal opportunity|equal employment|all qualified applicants|without regard to|regardless of|ofrecemos|nuestros beneficios|seguro complementario|vacaciones|aguinaldo|sin distincion de|igualdad de oportunidades|(?:training|courses?|certifications?) (?:are )?(?:provided|offered|paid)|(?:capacitacion|cursos?) (?:gratuit[oa]s?|incluid[oa]s?))\b/
const EXPLICIT_REQUIREMENT = /^(?:(?:se requiere(?:n)?|requerimos|es requisito|debe(?:s|ra)? (?:contar con|tener|poseer|dominar)|necesitas (?:tener|contar con)|(?:you )?must (?:have|possess|be proficient)|you (?:need|are required) to have|candidates? must have)\b|required\s*:)/

function clause(value: unknown): string {
  const text = readableOpportunityText(value).replace(/^[\s•*\-–—]+/, '').trim()
  return text && text.length <= MAX_CLAUSE ? text : ''
}

function fieldItems(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, MAX_REQUIREMENTS).map(clause).filter(Boolean)
}

function sectionHeading(value: string): { kind: 'requirements' | 'other' | null; label: string; remainder: string } {
  const candidate = value.replace(/^[\s•*\-–—]+/, '').trim()
  const colon = candidate.indexOf(':')
  const label = (colon < 0 ? candidate : candidate.slice(0, colon)).trim()
  if (label.length > 140) return { kind: null, label: '', remainder: '' }
  const name = folded(label.replace(/^[¿¡]+|[:?¿!¡]+$/g, ''))
  return {
    kind: REQUIREMENT_HEADING.test(name) ? 'requirements' : OTHER_HEADING.test(name) ? 'other' : null,
    label,
    remainder: colon < 0 ? '' : candidate.slice(colon + 1).trim(),
  }
}

/** Reviewed literal names only. Values keep the spelling present in the quote. */
const SKILL_NAMES = /(?:\b(?:Microsoft\s+)?Excel\b|\bPower\s*BI\b|\b(?:PostgreSQL|Postgres|MySQL|SQL|Python|JavaScript|TypeScript|Java|Scala|Kotlin|Swift|Ruby|PHP|HTML|CSS|React|Angular|Vue|Django|Flask|FastAPI|Spring|Git|GitHub|GitLab|Docker|Kubernetes|Terraform|Linux|AWS|Azure|GCP|Snowflake|Databricks|Tableau|Looker|SAP|Salesforce|HubSpot|Figma|Jira|Scrum|Kanban|AutoCAD|SolidWorks|PowerPoint|Word|Ingles|Inglés|English|Portugues|Portugués|Portuguese)\b|\bNode\.js\b|\bNext\.js\b|\bGoogle\s+(?:Cloud|Analytics)\b|\bMicrosoft\s+(?:Office|365)\b|\bOracle\b|\bC\+\+(?!\w)|\bC#(?!\w)|(?<!\w)\.NET\b|\btrabajo en equipo\b|\bteamwork\b|\bcomunicaci[oó]n (?:oral|escrita|efectiva)\b|\b(?:written|verbal) communication\b)/gi
const NEGATED_SKILL = /\b(?:no|not|never|without|unnecessary|unneeded|neither|nor|sin|ni|innecesari[oa]s?|ningun[oa]?|ningunos|ningunas|isn['’]t|aren['’]t|doesn['’]t|don['’]t)\b/

const MODE_WORDS = '(remote|remot[oa]|telecommut(?:e|ing)|teletrabajo|a distancia|hybrid|hibrid[oa]|on[- ]site|onsite|presencial)'
const NEGATED_MODE = /\b(?:not|never|without|neither|nor|forbidden|disallowed|cannot|can['’]t|isn['’]t|aren['’]t|no|ni|sin|nunca|jamas|descarta(?:mos|n)?|descartad[oa]s?|excluye(?:n)?|excluimos|excluid[oa]s?|prohibe|prohibid[oa])\b/
const CONDITIONAL_MODE = /\b(?:if|unless|si|en (?:el )?caso de|siempre que|a menos que)\b/
const CONDITIONAL_OR_HISTORICAL_MODE = /\b(?:might|may|could|optional|possibly|possibility|potential|unknown|undecided|tbd|por definir|a definir|experience|experienced|experiencia|previous|previously|worked|trabajado|familiarity|familiar|training|courses?|certifications?|education|anterior(?:es)?|previ[oa]s?|historial|conocimientos?|certificacion|formacion|capacitacion|cursos?|posibilidad|posible|opcion|opcional|eventual(?:mente)?|podria(?:n)?|podra(?:n)?|puede(?:n)?|potencial(?:mente)?|preferencia|idealmente|deseable)\b/

function modeFromWord(value: string): OpportunityWorkMode {
  return /^(?:hybrid|hibrid[oa])$/.test(value) ? 'hybrid' : /^(?:on[- ]site|onsite|presencial)$/.test(value) ? 'onsite' : 'remote'
}

function deriveWorkMode(input: OpportunityEvidenceInput, description: string): { workMode: OpportunityWorkMode | null; evidence: OpportunityFieldEvidence[] } {
  const offered = new Map<OpportunityWorkMode, OpportunityFieldEvidence[]>()
  const denied = new Set<OpportunityWorkMode>()
  const add = (value: OpportunityWorkMode, excerpt: string, origin: OpportunityFieldEvidence['origin']) => {
    const quotes = offered.get(value) || []
    if (!quotes.some(item => item.excerpt === excerpt && item.origin === origin) && quotes.length < 6) quotes.push({ field: 'workMode', value, excerpt, origin })
    offered.set(value, quotes)
  }
  if (input.workMode === 'remote' || input.workMode === 'hybrid' || input.workMode === 'onsite') add(input.workMode, input.workMode, 'source_field')
  const patterns = [
    new RegExp('\\b(?:modalidad|trabajo|jornada|cargo|puesto|esquema|formato|modelo|sistema)(?:\\s+(?:de|es|sera|en|trabajo)){0,3}\\s*[:=-]?\\s*(?:100\\s*%\\s*)?' + MODE_WORDS + '\\b', 'g'),
    new RegExp('\\b(?:ofrecemos|ofrece|incluye|incluimos|permite|permitimos)\\s+(?:(?:el|la|un|una|en|modalidad|de|trabajo)\\s+){0,4}(?:100\\s*%\\s*)?' + MODE_WORDS + '\\b', 'g'),
    new RegExp('\\b(?:this (?:role|position|job)|the (?:role|position)) (?:is|will be|requires)\\s+(?:fully |100% )?' + MODE_WORDS + '\\b', 'g'),
    new RegExp('\\b(?:this is|we offer) an?\\s+(?:fully |100% )?' + MODE_WORDS + '\\s+(?:role|position|job|workplace)\\b', 'g'),
    new RegExp('\\b(?:you|the successful candidate|the person|applicants?|employees?) (?:must|will|are required to|is required to|are expected to) work\\s+(?:fully |100% )?' + MODE_WORDS + '\\b', 'g'),
    new RegExp('^(?:(?:work(?:place|ing)? (?:type|mode|arrangement)|workplace|work model)\\s*:\\s*|(?:fully|100%)\\s+)' + MODE_WORDS + '\\b', 'g'),
    /\bwe (?:believe|offer|operate|use|provide|embrace)\b.{0,50}\b(hybrid) (?:(?:work|working) (?:environment|model)|workplace)\b/g,
  ]
  const inspect = (raw: string, origin: OpportunityFieldEvidence['origin'], isField = false) => {
    const excerpt = clause(raw).replace(/:$/, '')
    const text = folded(excerpt).replace(/[.!;]+$/, '')
    if (!text) return
    if (/[?¿]/.test(excerpt)) return
    // A conditional is not a contradiction (e.g. remote salary boilerplate).
    if (CONDITIONAL_MODE.test(text)) return
    if (NEGATED_MODE.test(text)) {
      for (const match of text.matchAll(new RegExp('\\b' + MODE_WORDS + '\\b', 'g'))) denied.add(modeFromWord(match[1]))
      return
    }
    if (CONDITIONAL_OR_HISTORICAL_MODE.test(text)) return
    if (isField) {
      // A workplace label can declare alternatives. Retain all of them so
      // "Remote - Onsite" is a contradiction, not an arbitrary first match.
      for (const match of text.matchAll(new RegExp('\\b' + MODE_WORDS + '\\b', 'g'))) add(modeFromWord(match[1]), excerpt, origin)
    }
    const direct = text.match(new RegExp('^(?:100\\s*%\\s*)?' + MODE_WORDS + '(?:\\s+100\\s*%)?$'))
    if (direct) add(modeFromWord(direct[1]), excerpt, origin)
    for (const pattern of patterns) {
      pattern.lastIndex = 0
      for (const match of text.matchAll(pattern)) add(modeFromWord(match[1]), excerpt, origin)
    }
  }
  const declaredText = typeof input.workModeText === 'string' && input.workModeText.length <= MAX_CLAUSE ? readableOpportunityText(input.workModeText) : ''
  const clauses = (text: string) => (text.match(/[^.!?;\n]+[.!?;]?/g) || []).flatMap(line => line.split(/,\s*(?=(?:sin|no|not|without|never)\b)/i))
  for (const line of clauses(declaredText)) inspect(line, 'source_field', true)
  for (const line of clauses(description)) inspect(line, 'description')
  if (offered.size !== 1) return { workMode: null, evidence: [] }
  const [workMode, evidence] = [...offered][0]
  return denied.has(workMode) ? { workMode: null, evidence: [] } : { workMode, evidence }
}

/**
 * Pure enrichment for fresh source jobs and already-stored rows. Unknown fields
 * stay unknown; no network, persistence, model calls or inferred credentials.
 */
export function deriveOpportunityEvidence(input: OpportunityEvidenceInput): {
  requirements: string[]
  skills: string[]
  workMode: OpportunityWorkMode | null
  evidence: OpportunityFieldEvidence[]
} {
  const { text: description, headings, exceedsLimit } = readableDocument(input.description)
  if (exceedsLimit) return { requirements: [], skills: [], workMode: null, evidence: [] }
  const requirements = new Map<string, OpportunityFieldEvidence>()
  const skills = new Map<string, OpportunityFieldEvidence>()
  const addRequirement = (raw: unknown, origin: OpportunityFieldEvidence['origin'], section?: string) => {
    const value = clause(raw)
    if (!value || BENEFIT_OR_BOILERPLATE.test(folded(value)) || requirements.size >= MAX_REQUIREMENTS) return
    const key = folded(value)
    if (!requirements.has(key)) requirements.set(key, { field: 'requirements', value, excerpt: value, origin, ...(section ? { section } : {}) })
  }
  for (const requirement of fieldItems(input.requirements)) addRequirement(requirement, 'source_field')
  let section: string | undefined
  for (const rawLine of description.split('\n')) {
    const line = clause(rawLine)
    if (!line) { if (rawLine.trim()) section = undefined; continue }
    const heading = sectionHeading(line)
    if (heading.kind === 'requirements') {
      section = heading.label
      // Old rows may have lost all line breaks. Multiple labels on one line
      // are ambiguous, so do not ingest the rest as one qualification.
      if (heading.remainder && !heading.remainder.includes(':')) addRequirement(heading.remainder, 'description', section)
      if (heading.remainder.includes(':')) section = undefined
      continue
    }
    // A short colon-terminated heading ends the prior requirement section even
    // when it is not in our vocabulary. Empty sections never absorb benefits.
    if (heading.kind === 'other' || headings.has(folded(line)) || /:$/.test(line) || (line.length <= 140 && /[?!]$/.test(line))) { section = undefined; continue }
    if (section) addRequirement(line, 'description', section)
    else for (const sentence of line.split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿])/u)) {
      if (EXPLICIT_REQUIREMENT.test(folded(sentence))) addRequirement(sentence, 'description')
    }
  }
  const skillFields = fieldItems(input.skills)
  // Validate the original field before splitting a list; otherwise the "no"
  // in "No SQL, Python or Java" would be lost from its later elements.
  const sourceSkills = skillFields.filter(value => !NEGATED_SKILL.test(folded(value)) && !BENEFIT_OR_BOILERPLATE.test(folded(value)))
    .flatMap(value => value.split(/[,;\n]+/).slice(0, MAX_SKILLS).map(clause).filter(Boolean)).slice(0, MAX_SKILLS)
  const negativeQuotes = [...requirements.values()].map(item => item.excerpt).concat(skillFields)
    .filter(value => NEGATED_SKILL.test(folded(value)))
  const deniedSkills = new Set<string>()
  for (const quote of negativeQuotes) {
    SKILL_NAMES.lastIndex = 0
    for (const match of quote.matchAll(SKILL_NAMES)) deniedSkills.add(folded(match[0]))
    for (const value of sourceSkills) {
      const literal = folded(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      if (new RegExp('(?:^|[^a-z0-9])' + literal + '(?=$|[^a-z0-9])').test(folded(quote))) deniedSkills.add(folded(value))
    }
  }
  const addSkill = (value: string, quote: OpportunityFieldEvidence) => {
    if (skills.size >= MAX_SKILLS) return
    const key = folded(value)
    if (deniedSkills.has(key)) return
    if (!skills.has(key)) skills.set(key, { ...quote, field: 'skills', value })
  }
  for (const quote of requirements.values()) {
    if (NEGATED_SKILL.test(folded(quote.excerpt))) continue
    SKILL_NAMES.lastIndex = 0
    for (const match of quote.excerpt.matchAll(SKILL_NAMES)) {
      const name = folded(match[0])
      const before = folded(quote.excerpt.slice(0, match.index))
      const after = folded(quote.excerpt.slice((match.index || 0) + match[0].length))
      // Common English verbs/nouns are not evidence of the similarly named
      // software. Explicit provider skill fields remain separately supported.
      if (name === 'excel' && /^(?:at|in|when)\b/.test(after)) continue
      if (name === 'react' && /^(?:to|quickly|calmly|appropriately)\b/.test(after)) continue
      if (name === 'word' && !/microsoft$/.test(before)) continue
      if (name === 'spring' && /^(?:events|semester|season)\b/.test(after)) continue
      if (name === 'swift' && /^(?:communication|responses?|decisions?)\b/.test(after)) continue
      addSkill(match[0], quote)
    }
  }
  // Provider skill fields can contain terms outside our reviewed vocabulary.
  // Keep their literal value, but never convert negative/benefit prose to a skill.
  for (const value of sourceSkills) {
    if (value.length > 120 || /[\n!?;]|\.\s/.test(value) || NEGATED_SKILL.test(folded(value)) || BENEFIT_OR_BOILERPLATE.test(folded(value))) continue
    addSkill(value, { field: 'skills', value, excerpt: value, origin: 'source_field' })
  }
  const mode = deriveWorkMode(input, description)
  return {
    requirements: [...requirements.values()].map(item => item.value),
    skills: [...skills.values()].map(item => item.value),
    workMode: mode.workMode,
    evidence: [...requirements.values(), ...skills.values(), ...mode.evidence],
  }
}
