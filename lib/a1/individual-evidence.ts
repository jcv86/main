/** Original DTC rules. Descriptive evidence, not a psychometric norm or clinical inference. */
export const UNDERSTANDING_VERSION = 'a1-understanding.v1' as const
export const QUESTIONNAIRE_VERSION = 'dtc-disc-28.v1' as const
export const PATTERN_VERSION = 'disc-net-evidence.v2' as const
export const KEYS = ['D', 'I', 'S', 'C'] as const
export type Dimension = (typeof KEYS)[number]
export type Scores = Record<Dimension, number | null>
export type PatternEvidence = {
  version: typeof PATTERN_VERSION
  status: 'resolved' | 'ambiguous' | 'unavailable'
  primary: Dimension | null
  secondary: Dimension | null
  primaryCandidates: Dimension[]
  secondaryCandidates: Dimension[]
}

export function patternEvidence(scores: Scores): PatternEvidence {
  const empty: PatternEvidence = { version: PATTERN_VERSION, status: 'unavailable', primary: null, secondary: null, primaryCandidates: [], secondaryCandidates: [] }
  if (!KEYS.every((key) => typeof scores[key] === 'number' && Number.isFinite(scores[key]))) return empty
  const leaders = (keys: Dimension[]) => {
    const maximum = Math.max(...keys.map((key) => scores[key]!))
    return keys.filter((key) => scores[key] === maximum)
  }
  const primaryCandidates = leaders([...KEYS])
  const primary = primaryCandidates.length === 1 ? primaryCandidates[0] : null
  const secondaryCandidates = primary ? leaders(KEYS.filter((key) => key !== primary)) : []
  const secondary = secondaryCandidates.length === 1 ? secondaryCandidates[0] : null
  return { version: PATTERN_VERSION, status: primary && secondary ? 'resolved' : 'ambiguous', primary, secondary, primaryCandidates, secondaryCandidates }
}

export function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

export function answerList(value: unknown): string[] {
  const list = Array.isArray(value) ? value : [value]
  return [...new Set(list.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean))]
}

/** Legacy C1 select answers are arrays. Preserve them, including multiple concurrent work situations. */
export function answerText(value: unknown): string {
  return answerList(value).join(' · ')
}

export interface ItemEvidence {
  questionId: number
  question: string
  more: { text: string; dimension: Dimension }
  less: { text: string; dimension: Dimension }
}

export type DomainId = 'decision' | 'communication' | 'collaboration' | 'change' | 'conflict' | 'environment'
export const DOMAINS: Array<{ id: DomainId; title: string; questionIds: number[] }> = [
  { id: 'decision', title: 'Decidir y ejecutar', questionIds: [1, 5, 10, 13, 25] },
  { id: 'communication', title: 'Comunicar e influir', questionIds: [6, 19, 20] },
  { id: 'collaboration', title: 'Colaborar y coordinar', questionIds: [3, 4, 14, 22, 23, 24] },
  { id: 'change', title: 'Responder a cambios', questionIds: [2, 11, 12, 27] },
  { id: 'conflict', title: 'Desacuerdos y críticas', questionIds: [7, 15, 21] },
  { id: 'environment', title: 'Condiciones de trabajo', questionIds: [8, 9, 16, 17, 18, 26, 28] },
]

export interface DomainReading {
  id: DomainId
  title: string
  evidence: ItemEvidence[]
  repeatedPreference: Dimension | null
  contextualVariation: boolean
  reading: string
  pending: string
}

const LENSES: Record<Dimension, string> = {
  D: 'la dirección y el avance', I: 'la interacción y la movilización',
  S: 'el apoyo y la continuidad', C: 'el análisis y la precisión',
}

/** Domain groupings are editorial lenses, not new scales or competency scores. */
export function domainReadings(items: ItemEvidence[], globalPrimary: Dimension | null): DomainReading[] {
  return DOMAINS.map((domain) => {
    const evidence = items.filter((item) => domain.questionIds.includes(item.questionId))
    const counts = Object.fromEntries(KEYS.map((key) => [key, evidence.filter((item) => item.more.dimension === key).length])) as Record<Dimension, number>
    const maximum = Math.max(...Object.values(counts))
    const leaders = KEYS.filter((key) => counts[key] === maximum)
    const repeatedPreference = maximum > 1 && leaders.length === 1 ? leaders[0] : null
    const contextualVariation = new Set(evidence.map((item) => item.more.dimension)).size > 1
    let reading = evidence.length ? `Al responder sobre ${domain.title.toLowerCase()}, elegiste «${evidence[0].more.text}».` : 'No hay respuestas por situación disponibles para esta lectura.'
    if (repeatedPreference) reading += ` En este grupo se repite ${LENSES[repeatedPreference]}.`
    else if (evidence.length > 1) reading += ' Las elecciones no concentran una preferencia única en este grupo.'
    if (contextualVariation) {
      const contrast = evidence.find((item) => item.more.dimension !== evidence[0].more.dimension)!
      reading += ` En otra situación elegiste «${contrast.more.text}». Esta variación puede depender del contexto; no la tratamos automáticamente como una contradicción.`
    }
    if (repeatedPreference && globalPrimary && repeatedPreference !== globalPrimary) reading += ' Este matiz difiere de la tendencia global y merece explorarse por separado.'
    return { id: domain.id, title: domain.title, evidence, repeatedPreference, contextualVariation, reading,
      pending: evidence.length ? 'Falta contrastar estas elecciones con una situación reciente. No acreditan por sí solas habilidad o desempeño.' : 'Esta versión conserva el resultado disponible, pero no inventa respuestas para reconstruir la situación.' }
  })
}

export interface ClarificationQuestion {
  id: DomainId
  title: string
  reason: string
  prompt: string
  options: Array<{ id: string; label: string }>
}

const NONE = { id: 'no_example', label: 'No tengo una experiencia comparable o prefiero no responder' }
const QUESTIONS: Record<DomainId, Omit<ClarificationQuestion, 'id' | 'reason'>> = {
  decision: { title: 'Decisiones', prompt: 'En una decisión importante reciente, ¿qué fue más parecido a lo que hiciste?', options: [
    { id: 'enough', label: 'Actué con información suficiente, aunque incompleta' },
    { id: 'risk', label: 'Esperé más antecedentes por el costo de equivocarme' },
    { id: 'agreement', label: 'Busqué primero acuerdos con las personas involucradas' },
    { id: 'procedure', label: 'Seguí un procedimiento establecido' }, NONE,
  ] },
  communication: { title: 'Comunicación', prompt: 'Cuando tuviste que explicar una propuesta reciente, ¿qué priorizaste?', options: [
    { id: 'summary', label: 'Aclarar la decisión o el resultado esperado' },
    { id: 'dialogue', label: 'Escuchar preguntas y construir el mensaje con otros' },
    { id: 'evidence', label: 'Preparar antecedentes y responder con precisión' },
    { id: 'audience', label: 'Adaptar el mensaje según la audiencia' }, NONE,
  ] },
  collaboration: { title: 'Colaboración', prompt: 'En un proyecto reciente, ¿qué condicionó más tu forma de colaborar?', options: [
    { id: 'responsibility', label: 'La responsabilidad que me asignaron' },
    { id: 'team', label: 'Las necesidades y experiencia del equipo' },
    { id: 'deadline', label: 'El plazo y los resultados esperados' },
    { id: 'expertise', label: 'Mi experiencia específica en ese tema' }, NONE,
  ] },
  change: { title: 'Cambios', prompt: 'Ante un cambio reciente, ¿qué necesitabas para avanzar?', options: [
    { id: 'purpose', label: 'Entender para qué se hacía el cambio' },
    { id: 'try', label: 'Poder probarlo con un alcance acotado' },
    { id: 'support', label: 'Tener apoyo y claridad sobre mi papel' },
    { id: 'criteria', label: 'Conocer los riesgos y los criterios para evaluar el resultado' }, NONE,
  ] },
  conflict: { title: 'Desacuerdos', prompt: 'En un desacuerdo reciente, ¿qué influyó más en cómo respondiste?', options: [
    { id: 'stakes', label: 'Las consecuencias de la decisión' },
    { id: 'relationship', label: 'La relación con la otra persona' },
    { id: 'time', label: 'La urgencia por resolver' },
    { id: 'authority', label: 'El margen que tenía para decidir' }, NONE,
  ] },
  environment: { title: 'Entorno', prompt: 'Pensando en las últimas semanas, ¿qué condición te ayudó más a trabajar?', options: [
    { id: 'autonomy', label: 'Autonomía para organizarme y decidir' },
    { id: 'connection', label: 'Intercambio frecuente con otras personas' },
    { id: 'stability', label: 'Prioridades estables y apoyo disponible' },
    { id: 'clarity', label: 'Criterios claros e información confiable' }, NONE,
  ] },
}

/** Four bounded clarifications. Priority is explanatory, not a validated adaptive test. */
export function selectClarifications(domains: DomainReading[]): ClarificationQuestion[] {
  return [...domains].filter((domain) => domain.evidence.length > 0)
    .sort((a, b) => Number(b.contextualVariation) - Number(a.contextualVariation) || DOMAINS.findIndex((d) => d.id === a.id) - DOMAINS.findIndex((d) => d.id === b.id))
    .slice(0, 4).map((domain) => ({ id: domain.id, ...QUESTIONS[domain.id], reason: domain.contextualVariation ? 'Tus elecciones variaron entre estas situaciones. Esta pregunta permite añadir el contexto que falta.' : 'El cuestionario describe una preferencia; una experiencia reciente permite matizarla.' }))
}

export const RECOGNITION_OPTIONS = [
  { id: 'represents', label: 'Me representa' }, { id: 'contextual', label: 'Depende del contexto' },
  { id: 'not_represents', label: 'No me representa' }, { id: 'unsure', label: 'No tengo suficiente experiencia para saberlo' },
] as const
export type Recognition = (typeof RECOGNITION_OPTIONS)[number]['id']
export interface ClarificationAnswers { selections: Partial<Record<DomainId, string>>; recognition: Recognition | null }

export function validateClarifications(value: unknown, questions: ClarificationQuestion[]): ClarificationAnswers | null {
  const body = record(value)
  if (!Object.keys(body).every((key) => key === 'selections' || key === 'recognition')) return null
  if (!body.selections || typeof body.selections !== 'object' || Array.isArray(body.selections)) return null
  const entries = Object.entries(record(body.selections))
  if (entries.length > questions.length) return null
  const selections: Partial<Record<DomainId, string>> = {}
  for (const [id, selection] of entries) {
    const question = questions.find((item) => item.id === id)
    if (!question || typeof selection !== 'string' || !question.options.some((option) => option.id === selection)) return null
    selections[question.id] = selection
  }
  const recognition = body.recognition
  if (recognition !== null && !RECOGNITION_OPTIONS.some((option) => option.id === recognition)) return null
  return { selections, recognition: recognition as Recognition | null }
}

export function clarificationStatements(answers: ClarificationAnswers | null, questions: ClarificationQuestion[]) {
  if (!answers) return []
  return questions.flatMap((question) => {
    const id = answers.selections[question.id]
    const option = question.options.find((option) => option.id === id)
    return option ? [{ domain: question.id, title: question.title, statement: option.label, isEvidence: id !== 'no_example' }] : []
  })
}
