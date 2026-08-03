import {
  extractAnswerArchitectureContext,
  type AnswerArchitectureContext,
} from '@/lib/a3/answer-architecture'

export const COACH_PRACTICE_DRAFT_KEY = 'dtc:a3:coach-practice-room:draft:v1'

export type CoachPracticeSessionId = 'intro' | 'motivation' | 'challenge'

export interface CoachPracticeDraft {
  introOriginal: string
  introImproved: string
  introLearning: string
  motivationOriginal: string
  motivationImproved: string
  motivationLearning: string
  challengeOriginal: string
  challengeImproved: string
  challengeLearning: string
}

export interface CoachPracticeContext extends AnswerArchitectureContext {
  answerArchitecture: {
    selfIntroduction: string
    motivation: string
    challengeStar: string
  }
}

export interface CoachPracticeSessionDefinition {
  id: CoachPracticeSessionId
  title: string
  question: string
  originalKey: keyof CoachPracticeDraft
  improvedKey: keyof CoachPracticeDraft
  learningKey: keyof CoachPracticeDraft
  minimumOriginalWords: number
  minimumWords: number
  coachFocus: string
}

export const COACH_PRACTICE_SESSIONS: readonly CoachPracticeSessionDefinition[] = [
  {
    id: 'intro',
    title: 'Autopresentación profesional',
    question: 'Cuéntame sobre ti.',
    originalKey: 'introOriginal',
    improvedKey: 'introImproved',
    learningKey: 'introLearning',
    minimumOriginalWords: 25,
    minimumWords: 30,
    coachFocus: 'Identidad profesional, foco del rol, evidencia y cierre claro.',
  },
  {
    id: 'motivation',
    title: 'Motivación por la oportunidad',
    question: '¿Por qué te interesa esta oportunidad?',
    originalKey: 'motivationOriginal',
    improvedKey: 'motivationImproved',
    learningKey: 'motivationLearning',
    minimumOriginalWords: 25,
    minimumWords: 40,
    coachFocus: 'Conexión con empresa, rol, contribución y motivación específica.',
  },
  {
    id: 'challenge',
    title: 'Desafío profesional con estructura STAR',
    question: 'Cuéntame sobre una situación desafiante que superaste.',
    originalKey: 'challengeOriginal',
    improvedKey: 'challengeImproved',
    learningKey: 'challengeLearning',
    minimumOriginalWords: 35,
    minimumWords: 65,
    coachFocus: 'Situación, tarea, acción propia, resultado y aprendizaje.',
  },
] as const

export const EMPTY_COACH_PRACTICE_DRAFT: CoachPracticeDraft = {
  introOriginal: '',
  introImproved: '',
  introLearning: '',
  motivationOriginal: '',
  motivationImproved: '',
  motivationLearning: '',
  challengeOriginal: '',
  challengeImproved: '',
  challengeLearning: '',
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function extractCoachPracticeContext(
  cvDeliverable: unknown,
  jobDecoderDeliverable: unknown,
  answerArchitectureDeliverable: unknown,
): CoachPracticeContext {
  const base = extractAnswerArchitectureContext(cvDeliverable, jobDecoderDeliverable)
  const answerArchitecture = objectValue(answerArchitectureDeliverable)

  return {
    ...base,
    answerArchitecture: {
      selfIntroduction: textValue(answerArchitecture.selfIntroduction),
      motivation: textValue(answerArchitecture.motivation),
      challengeStar: textValue(answerArchitecture.challengeStar),
    },
  }
}

export function normalizeCoachText(value: string): string {
  return value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9%$+\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function countCoachWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export function changedCoachTokens(original: string, improved: string): number {
  const originalTokens = new Set(normalizeCoachText(original).split(' ').filter(Boolean))
  const improvedTokens = new Set(normalizeCoachText(improved).split(' ').filter(Boolean))
  let changed = 0

  for (const token of originalTokens) {
    if (!improvedTokens.has(token)) changed += 1
  }
  for (const token of improvedTokens) {
    if (!originalTokens.has(token)) changed += 1
  }

  return changed
}

export function formatCoachingFeedback(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  const feedback = objectValue(value)
  const strengths = Array.isArray(feedback.strengths)
    ? feedback.strengths.filter((item): item is string => typeof item === 'string')
    : []
  const improvements = Array.isArray(feedback.improvements)
    ? feedback.improvements.filter((item): item is string => typeof item === 'string')
    : []
  const suggestion = textValue(feedback.suggestion)

  return [
    strengths.length ? `Fortalezas:\n- ${strengths.join('\n- ')}` : '',
    improvements.length ? `Ajustes:\n- ${improvements.join('\n- ')}` : '',
    suggestion ? `Siguiente versión:\n${suggestion}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')
}

export const SAMPLE_COACH_PRACTICE: CoachPracticeDraft = {
  introOriginal:
    'Soy líder de proyectos y he trabajado coordinando equipos comerciales y técnicos. Me interesa seguir creciendo en operaciones porque disfruto ordenar procesos y ayudar a que los equipos cumplan sus objetivos.',
  introImproved:
    'Soy líder de proyectos con experiencia coordinando equipos comerciales y técnicos en operaciones de alta exigencia. Mi fortaleza es convertir procesos complejos en planes claros, con responsables, riesgos y métricas visibles. En mi último equipo ayudé a reducir 22% los atrasos y busco aplicar esa experiencia en una operación que necesita mayor predictibilidad.',
  introLearning:
    'La segunda versión abre con una identidad profesional concreta, incorpora evidencia cuantitativa y termina conectando mi experiencia con la necesidad del rol.',
  motivationOriginal:
    'Me interesa la empresa porque parece un lugar desafiante donde podría aprender y aportar mi experiencia. También me atrae trabajar con equipos diversos y participar en proyectos importantes.',
  motivationImproved:
    'Me interesa esta oportunidad porque combina coordinación transversal, indicadores y mejora continua. La empresa está buscando una operación más predecible y esa necesidad se conecta con mi experiencia construyendo sistemas de seguimiento que redujeron 22% los atrasos. Puedo aportar estructura desde el inicio y seguir desarrollándome en un entorno exigente.',
  motivationLearning:
    'Reemplacé elogios genéricos por una conexión específica entre la necesidad de la empresa, mi evidencia previa y la contribución que puedo realizar.',
  challengeOriginal:
    'Tuvimos un proyecto con varios atrasos y problemas de coordinación. Hablé con las áreas, organizamos reuniones y finalmente logramos ordenar el trabajo. Fue difícil, pero el proyecto pudo continuar y el equipo aprendió a comunicarse mejor.',
  challengeImproved:
    'Situación: un proyecto crítico acumulaba atrasos y no existía una visión compartida de las dependencias. Tarea: debía recuperar el control sin detener la operación. Acción: levanté riesgos, asigné responsables, definí hitos semanales y establecí una revisión ejecutiva breve. Resultado: el equipo recuperó el calendario, redujo 22% los atrasos y dejó un sistema reutilizable. Aprendizaje: confirmé que hacer visibles las dependencias permite decidir antes y coordinar mejor.',
  challengeLearning:
    'La revisión separa claramente situación, tarea, acciones propias, resultado medible y aprendizaje, evitando una historia genérica centrada solo en el equipo.',
}
