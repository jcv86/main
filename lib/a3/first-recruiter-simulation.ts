import { normalizeCoachText } from '@/lib/a3/coach-practice'

export const FIRST_RECRUITER_DRAFT_KEY = 'dtc:a3:first-recruiter-simulation:draft:v1'

export const FIRST_RECRUITER_QUESTION_IDS = [
  'greeting',
  'introduction',
  'experience',
  'motivation',
  'strength',
  'behavioral',
  'candidateQuestion',
  'closing',
] as const

export type FirstRecruiterQuestionId = (typeof FIRST_RECRUITER_QUESTION_IDS)[number]

export interface FirstRecruiterAnswer {
  text: string
  durationSeconds: number
  selfRating: number
}

export interface FirstRecruiterDraft {
  answers: Record<FirstRecruiterQuestionId, FirstRecruiterAnswer>
  strongestAnswer: string
  weakestAnswer: string
  improvementAction: string
  interviewReflection: string
}

export interface FirstRecruiterContext {
  fullName: string
  targetRole: string
  company: string
  prioritySignals: string[]
  approvedIntroduction: string
  approvedMotivation: string
  approvedStrength: string
  approvedChallenge: string
  available: boolean
}

const EMPTY_ANSWER: FirstRecruiterAnswer = {
  text: '',
  durationSeconds: 0,
  selfRating: 0,
}

export const EMPTY_FIRST_RECRUITER_DRAFT: FirstRecruiterDraft = {
  answers: Object.fromEntries(
    FIRST_RECRUITER_QUESTION_IDS.map((id) => [id, { ...EMPTY_ANSWER }]),
  ) as Record<FirstRecruiterQuestionId, FirstRecruiterAnswer>,
  strongestAnswer: '',
  weakestAnswer: '',
  improvementAction: '',
  interviewReflection: '',
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function numberValue(value: unknown): number {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric >= 0 ? Math.round(numeric) : 0
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
  }
  if (typeof value !== 'string') return []
  return value.split(/\r?\n|,|;/).map((item) => item.trim().replace(/^[-•*]\s*/, '')).filter(Boolean)
}

export function toFirstRecruiterDraft(value: unknown): FirstRecruiterDraft {
  const deliverable = objectValue(value)
  const answersValue = objectValue(deliverable.answers)
  const answers = Object.fromEntries(
    FIRST_RECRUITER_QUESTION_IDS.map((id) => {
      const answer = objectValue(answersValue[id])
      return [id, {
        text: textValue(answer.text),
        durationSeconds: numberValue(answer.durationSeconds),
        selfRating: Math.min(5, numberValue(answer.selfRating)),
      }]
    }),
  ) as Record<FirstRecruiterQuestionId, FirstRecruiterAnswer>

  return {
    answers,
    strongestAnswer: textValue(deliverable.strongestAnswer),
    weakestAnswer: textValue(deliverable.weakestAnswer),
    improvementAction: textValue(deliverable.improvementAction),
    interviewReflection: textValue(deliverable.interviewReflection),
  }
}

export function extractFirstRecruiterContext(
  cvDeliverable: unknown,
  decoderDeliverable: unknown,
  answersDeliverable: unknown,
): FirstRecruiterContext {
  const cv = objectValue(cvDeliverable)
  const decoder = objectValue(decoderDeliverable)
  const answers = objectValue(answersDeliverable)
  const fullName = textValue(cv.fullName)
  const targetRole = textValue(decoder.jobTitle) || textValue(cv.targetRole)
  const company = textValue(decoder.company)
  const prioritySignals = [
    ...stringList(decoder.priorityKeywords),
    ...stringList(decoder.mustHaveRequirements),
  ]

  return {
    fullName,
    targetRole,
    company,
    prioritySignals,
    approvedIntroduction: textValue(answers.selfIntroduction),
    approvedMotivation: textValue(answers.motivation),
    approvedStrength: textValue(answers.strengthEvidence),
    approvedChallenge: textValue(answers.challengeStar),
    available: Boolean(fullName || targetRole || company || prioritySignals.length),
  }
}

export function countFirstRecruiterWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export function countFirstRecruiterContextOverlap(
  draft: FirstRecruiterDraft,
  context?: FirstRecruiterContext | null,
): number {
  if (!context?.available) return 0
  const spoken = normalizeCoachText(
    FIRST_RECRUITER_QUESTION_IDS.map((id) => draft.answers[id].text).join(' '),
  )
  const signals = [context.targetRole, context.company, ...context.prioritySignals]
    .map(normalizeCoachText)
    .filter((item) => item.length >= 3)

  return new Set(
    signals.filter((signal) =>
      signal.split(' ').filter((token) => token.length >= 4).some((token) => spoken.includes(token)),
    ),
  ).size
}

export const SAMPLE_FIRST_RECRUITER_DRAFT: FirstRecruiterDraft = {
  answers: {
    greeting: { text: 'Muy bien, gracias por recibirme. Estoy preparado para conversar sobre el rol.', durationSeconds: 11, selfRating: 4 },
    introduction: { text: 'Soy profesional de operaciones con experiencia coordinando equipos comerciales y técnicos. He transformado procesos dispersos en planes claros y medibles, y busco aportar esa capacidad en una jefatura de operaciones con foco en continuidad y mejora.', durationSeconds: 38, selfRating: 4 },
    experience: { text: 'En mi experiencia más reciente coordiné responsables, riesgos y seguimiento semanal. Implementé un tablero que permitió reducir 22% los atrasos y entregar mayor visibilidad a la gerencia.', durationSeconds: 44, selfRating: 4 },
    motivation: { text: 'Me interesa esta empresa porque el rol combina coordinación transversal, indicadores y mejora continua. Esa necesidad se conecta con mi experiencia y con el tipo de impacto que quiero seguir construyendo.', durationSeconds: 37, selfRating: 4 },
    strength: { text: 'Mi principal fortaleza es convertir información compleja en decisiones ejecutables. Por ejemplo, organicé un proceso con múltiples áreas y logramos reducir 22% los atrasos mediante responsables y alertas claras.', durationSeconds: 43, selfRating: 4 },
    behavioral: { text: 'Situación: un proyecto crítico acumulaba atrasos. Tarea: recuperar control sin detener la operación. Acción: definí responsables, hitos y alertas semanales. Resultado: redujimos 22% los atrasos y mejoramos la visibilidad para la gerencia.', durationSeconds: 67, selfRating: 4 },
    candidateQuestion: { text: '¿Cuáles son los resultados más importantes que esperan de esta posición durante los primeros seis meses?', durationSeconds: 16, selfRating: 5 },
    closing: { text: 'Gracias por la conversación. El desafío me interesa y creo que mi experiencia en coordinación e indicadores puede aportar desde el inicio.', durationSeconds: 18, selfRating: 4 },
  },
  strongestAnswer: 'La respuesta conductual porque mantuvo una estructura clara y terminó con un resultado medible.',
  weakestAnswer: 'La motivación porque todavía puede incorporar una señal más específica de la empresa.',
  improvementAction: 'Investigar una prioridad concreta de la empresa y conectarla con una evidencia profesional antes de repetir la simulación.',
  interviewReflection: 'La entrevista mantuvo un hilo coherente entre experiencia, motivación y aporte. Las respuestas más sólidas fueron las que incluyeron evidencia cuantitativa; el próximo foco será hacer la motivación más específica sin alargarla.',
}
