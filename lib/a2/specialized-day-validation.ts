export interface A2SpecializedCriterion {
  key: string
  label: string
  met: boolean
  score: number
  maxScore: number
}

export interface A2SpecializedValidationResult {
  passed: boolean
  score: number
  passScore: number
  mode: 'specialized_day'
  day: number
  errors: string[]
  strengths: string[]
  criteria: A2SpecializedCriterion[]
  normalized: Record<string, unknown>
}

type Submission = Record<string, unknown>
type CriterionInput = {
  key: string
  label: string
  met: boolean
  maxScore: number
  error: string
}

const PASS_SCORE = 75

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function arrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function numericValue(value: unknown): number {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

function nonEmptyObject(value: unknown): boolean {
  return Object.keys(objectValue(value)).length > 0
}

function completedMemoryCount(value: unknown): number {
  return arrayValue(value).filter((item) => {
    const memory = objectValue(item)
    return (
      textValue(memory.memory_text).length >= 10 &&
      textValue(memory.memory_where).length >= 3 &&
      textValue(memory.memory_why_remember).length >= 5
    )
  }).length
}

function taskCount(value: unknown): number {
  return arrayValue(value).filter((item) => textValue(item).length >= 12).length
}

function valueSeedCount(value: unknown): number {
  return arrayValue(value).filter((item) => {
    const seed = objectValue(item)
    return textValue(seed.value).length >= 3 && textValue(seed.impact).length >= 5
  }).length
}

function criteriaForDay(day: number, submission: Submission): CriterionInput[] {
  switch (day) {
    case 2: {
      const vault = objectValue(submission.vaultData)
      const fragments = arrayValue(vault.fragments)
      return [
        { key: 'vault', label: 'Bóveda definida', met: textValue(vault.vaultType).length > 0, maxScore: 20, error: 'Define el tipo de bóveda donde conservarás tu evidencia.' },
        { key: 'fragments', label: 'Fragmentos de evidencia', met: fragments.length >= 5, maxScore: 35, error: 'Registra al menos cinco fragmentos de evidencia profesional.' },
        { key: 'classified', label: 'Evidencia clasificada', met: fragments.filter((item) => textValue(objectValue(item).category)).length >= 3, maxScore: 20, error: 'Clasifica al menos tres fragmentos de evidencia.' },
        { key: 'gold', label: 'Piezas de oro', met: arrayValue(vault.goldPieces).length >= 3, maxScore: 25, error: 'Selecciona tres piezas de oro reutilizables.' },
      ]
    }
    case 3: {
      const marketSignals = arrayValue(submission.marketSignals)
      return [
        { key: 'jobs', label: 'Vacantes reales analizadas', met: marketSignals.length >= 3, maxScore: 40, error: 'Analiza al menos tres vacantes reales.' },
        { key: 'job_detail', label: 'Vacantes con contexto', met: marketSignals.filter((item) => { const signal = objectValue(item); return textValue(signal.job_title).length >= 2 && textValue(signal.company_name).length >= 2 }).length >= 2, maxScore: 20, error: 'Incluye cargo y empresa en al menos dos vacantes.' },
        { key: 'signals', label: 'Señales extraídas', met: arrayValue(submission.extractedSignals).length >= 3, maxScore: 40, error: 'Extrae al menos tres señales del mercado.' },
      ]
    }
    case 4: {
      const board = objectValue(submission.candidateBoard)
      const columns = [board.column_1_quien_soy, board.column_2_que_quiere, board.column_3_que_prueba, board.column_4_que_falta].filter((value) => textValue(value).length >= 10).length
      return [
        { key: 'columns', label: 'Tablero de cuatro columnas', met: columns === 4, maxScore: 55, error: 'Completa las cuatro columnas del tablero del candidato.' },
        { key: 'hypothesis', label: 'Hipótesis de candidato', met: textValue(board.candidate_hypothesis).length >= 20, maxScore: 30, error: 'Formula una hipótesis de candidato suficientemente concreta.' },
        { key: 'archetype', label: 'Arquetipo identificado', met: textValue(board.candidate_archetype).length >= 3, maxScore: 15, error: 'Identifica el arquetipo profesional del tablero.' },
      ]
    }
    case 5: {
      const intro = objectValue(submission.testIntroduction)
      return [
        { key: 'versions', label: 'Versiones iniciales', met: textValue(intro.version_a).length >= 20 && textValue(intro.version_b).length >= 20, maxScore: 35, error: 'Construye dos versiones completas de tu introducción.' },
        { key: 'improved', label: 'Versión mejorada', met: textValue(intro.version_c).length >= 20, maxScore: 30, error: 'Conserva una versión mejorada después del feedback.' },
        { key: 'test', label: 'Prueba realizada', met: textValue(intro.test_type).length >= 2, maxScore: 20, error: 'Registra el formato de la prueba realizada.' },
        { key: 'feedback', label: 'Feedback registrado', met: textValue(intro.test_feedback).length >= 5, maxScore: 15, error: 'Registra el feedback o resultado de la prueba.' },
      ]
    }
    case 6: {
      const identity = objectValue(submission.professionalIdentity)
      const versions = [identity.version_simple, identity.version_recruiter, identity.version_interview].filter((value) => textValue(value).length >= 20).length
      return [
        { key: 'archetype', label: 'Arquetipo profesional', met: textValue(identity.candidate_archetype).length >= 3, maxScore: 20, error: 'Selecciona un arquetipo profesional.' },
        { key: 'versions', label: 'Tres versiones de identidad', met: versions === 3, maxScore: 45, error: 'Completa las versiones simple, recruiter y entrevista.' },
        { key: 'stress', label: 'Prueba de estrés', met: textValue(identity.stress_test_result).length >= 5, maxScore: 20, error: 'Registra el resultado de la prueba de estrés.' },
        { key: 'validated', label: 'Identidad validada', met: identity.is_validated === true, maxScore: 15, error: 'Valida la identidad antes de completar el día.' },
      ]
    }
    case 7: {
      const mirror = objectValue(submission.careerMirror)
      return [
        { key: 'snapshot', label: 'Datos previos integrados', met: nonEmptyObject(mirror.a2_data_snapshot), maxScore: 20, error: 'Integra los datos de los días anteriores.' },
        { key: 'card', label: 'Tarjeta espejo construida', met: textValue(mirror.mirror_card_title).length >= 5 && nonEmptyObject(mirror.mirror_card_content), maxScore: 35, error: 'Construye una tarjeta espejo con título y contenido.' },
        { key: 'feedback', label: 'Feedback incorporado', met: textValue(mirror.coach_feedback).length >= 5 || arrayValue(mirror.coach_tags).length >= 1, maxScore: 20, error: 'Incorpora feedback o etiquetas del Coach.' },
        { key: 'validated', label: 'Tarjeta validada', met: mirror.is_validated === true && numericValue(mirror.validation_score) >= 60, maxScore: 25, error: 'Valida la tarjeta espejo con un puntaje suficiente.' },
      ]
    }
    case 8: {
      const memories = arrayValue(submission.workMemories)
      return [
        { key: 'memories', label: 'Memorias completas', met: completedMemoryCount(memories) >= 5, maxScore: 45, error: 'Completa al menos cinco memorias profesionales.' },
        { key: 'tags', label: 'Memorias etiquetadas', met: memories.filter((item) => arrayValue(objectValue(item).coach_tags).length > 0).length >= 3, maxScore: 25, error: 'Etiqueta al menos tres memorias con señales del Coach.' },
        { key: 'selected', label: 'Memorias seleccionadas', met: arrayValue(submission.selectedMemories).length >= 3, maxScore: 30, error: 'Selecciona al menos tres memorias para continuar.' },
      ]
    }
    case 9:
      return [
        { key: 'tasks', label: 'Task statements construidos', met: taskCount(submission.tasks) >= 3, maxScore: 70, error: 'Construye al menos tres task statements completos.' },
        { key: 'source', label: 'Memorias de origen', met: numericValue(submission.memoryCount) >= 3, maxScore: 30, error: 'El entregable debe provenir de al menos tres memorias seleccionadas.' },
      ]
    case 10:
      return [
        { key: 'seeds', label: 'Semillas de valor', met: valueSeedCount(submission.valueSeeds) >= 3, maxScore: 75, error: 'Construye al menos tres semillas de valor con impacto.' },
        { key: 'source', label: 'Tareas transformadas', met: numericValue(submission.taskCount) >= 3, maxScore: 25, error: 'Transforma al menos tres tareas del Día 9.' },
      ]
    default:
      return []
  }
}

export function validateA2SpecializedDaySubmission(day: number, value: unknown): A2SpecializedValidationResult {
  const normalized = objectValue(value)
  const declaredDay = numericValue(normalized.dayNumber)
  const inputs = criteriaForDay(day, normalized)
  if (day < 2 || day > 10 || inputs.length === 0) {
    return { passed: false, score: 0, passScore: PASS_SCORE, mode: 'specialized_day', day, errors: ['El día especializado no tiene un contrato de validación.'], strengths: [], criteria: [], normalized }
  }

  const dayMatches = declaredDay === day
  const criteria = [
    { key: 'day_identity', label: 'Identidad del día', met: dayMatches, score: dayMatches ? 5 : 0, maxScore: 5 },
    ...inputs.map((criterion) => {
      const maxScore = Math.round(criterion.maxScore * 0.95)
      return { key: criterion.key, label: criterion.label, met: criterion.met, score: criterion.met ? maxScore : 0, maxScore }
    }),
  ]
  const score = Math.min(100, criteria.reduce((sum, criterion) => sum + criterion.score, 0))
  const errors = [
    ...(dayMatches ? [] : [`El entregable declara el Día ${declaredDay || 'inválido'} y no el Día ${day}.`]),
    ...inputs.filter((criterion) => !criterion.met).map((criterion) => criterion.error),
  ]

  return {
    passed: dayMatches && score >= PASS_SCORE,
    score,
    passScore: PASS_SCORE,
    mode: 'specialized_day',
    day,
    errors,
    strengths: criteria.filter((criterion) => criterion.met).map((criterion) => criterion.label),
    criteria,
    normalized,
  }
}
