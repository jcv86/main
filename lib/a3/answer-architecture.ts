import { extractCvContext, splitDecoderKeywords, splitDecoderLines } from '@/lib/a3/job-decoder'

export const ANSWER_ARCHITECTURE_DRAFT_KEY = 'dtc:a3:answer-architecture:draft:v1'

export interface AnswerArchitectureDraft {
  selfIntroduction: string
  motivation: string
  strengthEvidence: string
  challengeStar: string
  whyHire: string
  timing30: string
  timing45: string
  timing60: string
}

export interface AnswerArchitectureContext {
  jobTitle: string
  company: string
  mustHaveRequirements: string[]
  likelyQuestions: string[]
  priorityKeywords: string[]
  cvRole: string
  cvKeywords: string[]
  cvSkills: string[]
  cvAchievements: string[]
  available: boolean
}

export const EMPTY_ANSWER_ARCHITECTURE_DRAFT: AnswerArchitectureDraft = {
  selfIntroduction: '',
  motivation: '',
  strengthEvidence: '',
  challengeStar: '',
  whyHire: '',
  timing30: '',
  timing45: '',
  timing60: '',
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function normalizeAnswerText(value: string): string {
  return value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function countAnswerWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export function extractAnswerArchitectureContext(
  cvDeliverable: unknown,
  jobDecoderDeliverable: unknown,
): AnswerArchitectureContext {
  const cv = extractCvContext(cvDeliverable)
  const job = objectValue(jobDecoderDeliverable)
  const jobTitle = textValue(job.jobTitle)
  const company = textValue(job.company)
  const mustHaveRequirements = splitDecoderLines(job.mustHaveRequirements)
  const likelyQuestions = splitDecoderLines(job.likelyQuestions)
  const priorityKeywords = splitDecoderKeywords(job.priorityKeywords)

  return {
    jobTitle,
    company,
    mustHaveRequirements,
    likelyQuestions,
    priorityKeywords,
    cvRole: cv.targetRole,
    cvKeywords: cv.targetKeywords,
    cvSkills: cv.skills,
    cvAchievements: cv.achievements,
    available:
      cv.available ||
      jobTitle.length > 0 ||
      company.length > 0 ||
      mustHaveRequirements.length > 0 ||
      likelyQuestions.length > 0,
  }
}

export const SAMPLE_ANSWER_ARCHITECTURE: AnswerArchitectureDraft = {
  selfIntroduction:
    'Soy líder de proyectos con experiencia coordinando equipos comerciales y técnicos. Mi fortaleza está en ordenar procesos complejos, hacer visibles los riesgos y convertirlos en planes ejecutables. Busco aportar esa capacidad en un rol de coordinación de operaciones con impacto medible.',
  motivation:
    'Me interesa esta oportunidad porque combina coordinación transversal, mejora de procesos y trabajo con indicadores. La empresa está buscando una operación más predecible y esa necesidad se conecta con mi experiencia construyendo sistemas de seguimiento y documentación para equipos exigentes.',
  strengthEvidence:
    'Mi principal fortaleza es transformar información dispersa en decisiones claras. En mi último equipo implementé un sistema de seguimiento con responsables, riesgos y próximos hitos, lo que redujo 22% los atrasos y mejoró la coordinación entre áreas.',
  challengeStar:
    'Situación: un proyecto crítico acumulaba atrasos y no existía una visión compartida de las dependencias. Tarea: debía recuperar el control sin detener la operación y alinear a responsables con prioridades distintas. Acción: levanté riesgos, ordené responsables, definí hitos semanales y establecí una revisión ejecutiva breve para resolver bloqueos. Resultado: el equipo recuperó el calendario, redujo 22% los atrasos y dejó un sistema reutilizable para proyectos posteriores. El aprendizaje fue anticipar dependencias antes de que se transformen en urgencias.',
  whyHire:
    'Puedo aportar una combinación de coordinación transversal, documentación y mejora continua. Ya he convertido operaciones poco visibles en sistemas medibles y puedo aplicar esa experiencia para fortalecer el seguimiento, anticipar riesgos y acelerar la ejecución del equipo.',
  timing30:
    'Soy líder de proyectos y convierto procesos complejos en planes claros. He coordinado equipos comerciales y técnicos, reduciendo atrasos mediante seguimiento y documentación. Busco aplicar esa experiencia en una operación con impacto medible.',
  timing45:
    'Soy líder de proyectos con experiencia coordinando equipos comerciales y técnicos. Mi especialidad es transformar procesos complejos en planes claros, con responsables, riesgos y métricas visibles. En mi último equipo ayudé a reducir 22% los atrasos. Busco aportar esa capacidad en una operación que necesita mayor predictibilidad y coordinación transversal.',
  timing60:
    'Soy líder de proyectos con experiencia coordinando equipos comerciales y técnicos en contextos de alta exigencia. Mi fortaleza es transformar información dispersa en planes claros, con responsables, riesgos y métricas visibles. En mi último equipo implementé un sistema de seguimiento que redujo 22% los atrasos y mejoró la continuidad entre áreas. Busco aportar esa experiencia en una operación que necesita ejecutar con mayor predictibilidad, documentación y foco en resultados.',
}
