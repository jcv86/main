/**
 * DTC AgentOS - Evaluation Rubrics
 * 
 * Defines scoring criteria for each A3 module. Rubrics specify what
 * to evaluate, how to score (1-5), and what constitutes passing.
 */

import type { ModuleRubric, RubricCriterion } from '../types'

// =============================================================================
// COACHING MODULES (1-6) RUBRICS
// =============================================================================

/**
 * Module 1: Auditoría Inicial
 */
export const RUBRIC_AUDITORIA_INICIAL: ModuleRubric = {
  moduleId: 'auditoria-inicial',
  criteria: [
    {
      id: 'self-awareness',
      name: 'Autoconocimiento',
      description: 'Capacidad de identificar fortalezas y áreas de mejora con honestidad',
      weight: 0.35,
      scoringGuide: {
        1: 'No identifica fortalezas ni debilidades. Respuestas genéricas o evasivas.',
        2: 'Menciona 1-2 fortalezas/debilidades pero sin profundidad ni ejemplos.',
        3: 'Identifica varias fortalezas/debilidades con algunos ejemplos básicos.',
        4: 'Buena reflexión con ejemplos concretos y conexión a su carrera.',
        5: 'Reflexión profunda, ejemplos detallados, plan de mejora claro.',
      },
    },
    {
      id: 'goal-clarity',
      name: 'Claridad de objetivo',
      description: 'Definición clara del objetivo profesional y la razón de la búsqueda',
      weight: 0.35,
      scoringGuide: {
        1: 'Objetivo vago o inexistente. No sabe qué busca.',
        2: 'Objetivo general pero sin especificidad ni plazos.',
        3: 'Objetivo definido pero falta especificidad en rol/industria/nivel.',
        4: 'Objetivo claro con rol, industria y nivel definidos.',
        5: 'Objetivo SMART con rol específico, empresas target y timeline.',
      },
    },
    {
      id: 'commitment',
      name: 'Compromiso con el proceso',
      description: 'Disposición a invertir tiempo y esfuerzo en su transformación',
      weight: 0.3,
      scoringGuide: {
        1: 'Sin compromiso evidente. Busca atajos o soluciones mágicas.',
        2: 'Compromiso verbal pero sin plan concreto de dedicación.',
        3: 'Compromiso moderado con tiempo definido pero flexible.',
        4: 'Compromiso claro con tiempo bloqueado y prioridad alta.',
        5: 'Compromiso total con calendario, métricas de progreso y accountability.',
      },
    },
  ],
  passingScore: 60,
  levelThresholds: {
    basic: 60,
    advanced: 75,
    pro: 90,
  },
}

/**
 * Module 2: Método STAR
 */
export const RUBRIC_METODO_STAR: ModuleRubric = {
  moduleId: 'metodo-star',
  criteria: [
    {
      id: 'situation',
      name: 'Situación',
      description: 'Contexto claro y conciso de la situación',
      weight: 0.25,
      scoringGuide: {
        1: 'Sin contexto. El evaluador no entiende la situación.',
        2: 'Contexto vago o demasiado largo sin información relevante.',
        3: 'Contexto presente pero le faltan detalles importantes.',
        4: 'Contexto claro, conciso y relevante para la historia.',
        5: 'Contexto perfecto: conciso, específico, establece el escenario.',
      },
    },
    {
      id: 'task',
      name: 'Tarea',
      description: 'Responsabilidad personal clara y específica',
      weight: 0.2,
      scoringGuide: {
        1: 'No queda claro qué era su responsabilidad.',
        2: 'Tarea mencionada pero mezclada con el equipo.',
        3: 'Tarea clara pero genérica.',
        4: 'Tarea específica con responsabilidad personal evidente.',
        5: 'Tarea específica, desafiante, con alcance y restricciones claras.',
      },
    },
    {
      id: 'action',
      name: 'Acción',
      description: 'Acciones concretas tomadas con verbos de acción',
      weight: 0.3,
      scoringGuide: {
        1: 'Sin acciones concretas o acciones del equipo sin distinción.',
        2: 'Acciones vagas o pasivas ("se hizo", "se logró").',
        3: 'Algunas acciones concretas pero falta detalle.',
        4: 'Acciones claras con verbos de acción ("implementé", "lideré").',
        5: 'Acciones detalladas, secuenciales, con decisiones clave explicadas.',
      },
    },
    {
      id: 'result',
      name: 'Resultado',
      description: 'Impacto medible y aprendizaje',
      weight: 0.25,
      scoringGuide: {
        1: 'Sin resultado o resultado vago ("fue exitoso").',
        2: 'Resultado cualitativo sin métricas.',
        3: 'Resultado con alguna métrica pero incompleto.',
        4: 'Resultado con métricas claras de impacto.',
        5: 'Resultado con métricas múltiples, aprendizaje y aplicación futura.',
      },
    },
  ],
  passingScore: 65,
  levelThresholds: {
    basic: 65,
    advanced: 78,
    pro: 90,
  },
}

/**
 * Module 3: CV Inteligente
 */
export const RUBRIC_CV_INTELIGENTE: ModuleRubric = {
  moduleId: 'cv-inteligente',
  criteria: [
    {
      id: 'ats-compatibility',
      name: 'Compatibilidad ATS',
      description: 'Formato y estructura compatible con sistemas de tracking',
      weight: 0.25,
      scoringGuide: {
        1: 'Formato incompatible: tablas, gráficos, headers/footers.',
        2: 'Algunos problemas de formato que afectan la lectura ATS.',
        3: 'Formato básico compatible pero no optimizado.',
        4: 'Formato limpio, compatible, con keywords apropiados.',
        5: 'Formato perfecto ATS con keywords estratégicos y estructura óptima.',
      },
    },
    {
      id: 'impact-statements',
      name: 'Declaraciones de impacto',
      description: 'Logros presentados con métricas y resultados medibles',
      weight: 0.35,
      scoringGuide: {
        1: 'Solo responsabilidades listadas, sin logros.',
        2: 'Algunos logros pero sin métricas.',
        3: 'Logros presentes con algunas métricas.',
        4: 'Logros claros con métricas de impacto en mayoría de puntos.',
        5: 'Cada logro tiene métrica, contexto y impacto business.',
      },
    },
    {
      id: 'relevance',
      name: 'Relevancia para el rol',
      description: 'Contenido alineado con el rol objetivo',
      weight: 0.25,
      scoringGuide: {
        1: 'CV genérico sin adaptación al rol.',
        2: 'Algo de relevancia pero no adaptado.',
        3: 'Parcialmente adaptado al rol objetivo.',
        4: 'Bien adaptado con experiencias relevantes destacadas.',
        5: 'Perfectamente alineado con keywords y experiencias del rol target.',
      },
    },
    {
      id: 'clarity',
      name: 'Claridad y concisión',
      description: 'Fácil de escanear, información jerarquizada',
      weight: 0.15,
      scoringGuide: {
        1: 'Difícil de leer, mucho texto, sin jerarquía.',
        2: 'Algo desordenado, información importante escondida.',
        3: 'Estructura básica pero mejorable.',
        4: 'Claro, bien organizado, escaneable.',
        5: 'Perfectamente estructurado, información clave visible en 6 segundos.',
      },
    },
  ],
  passingScore: 70,
  levelThresholds: {
    basic: 70,
    advanced: 82,
    pro: 92,
  },
}

/**
 * Module 4: Análisis de Vacante
 */
export const RUBRIC_ANALISIS_VACANTE: ModuleRubric = {
  moduleId: 'analisis-vacante',
  criteria: [
    {
      id: 'requirements-identification',
      name: 'Identificación de requisitos',
      description: 'Capacidad de identificar requisitos explícitos e implícitos',
      weight: 0.3,
      scoringGuide: {
        1: 'No identifica requisitos clave.',
        2: 'Solo identifica requisitos obvios/explícitos.',
        3: 'Identifica requisitos principales pero pierde algunos.',
        4: 'Identifica requisitos explícitos e implícitos.',
        5: 'Análisis completo incluyendo cultura, no-negociables y nice-to-haves.',
      },
    },
    {
      id: 'gap-analysis',
      name: 'Análisis de brechas',
      description: 'Identificación honesta de gaps y plan para abordarlos',
      weight: 0.35,
      scoringGuide: {
        1: 'No reconoce brechas o las minimiza.',
        2: 'Reconoce algunas brechas sin plan.',
        3: 'Identifica brechas con plan genérico.',
        4: 'Análisis honesto con plan específico para cada brecha.',
        5: 'Análisis profundo con estrategia de mitigación y evidencias alternativas.',
      },
    },
    {
      id: 'company-research',
      name: 'Investigación de empresa',
      description: 'Conocimiento de la empresa, cultura y contexto',
      weight: 0.35,
      scoringGuide: {
        1: 'Sin investigación sobre la empresa.',
        2: 'Información básica (tamaño, industria).',
        3: 'Información moderada (productos, competidores básicos).',
        4: 'Buena investigación (cultura, noticias recientes, desafíos).',
        5: 'Investigación profunda (estrategia, competidores, tendencias, cultura interna).',
      },
    },
  ],
  passingScore: 65,
  levelThresholds: {
    basic: 65,
    advanced: 78,
    pro: 90,
  },
}

/**
 * Module 5: Análisis Multimodal
 */
export const RUBRIC_ANALISIS_MULTIMODAL: ModuleRubric = {
  moduleId: 'analisis-multimodal',
  criteria: [
    {
      id: 'verbal-communication',
      name: 'Comunicación verbal',
      description: 'Claridad, ritmo y vocabulario apropiado',
      weight: 0.35,
      scoringGuide: {
        1: 'Incoherente, muletillas excesivas, vocabulario pobre.',
        2: 'Comunicación básica con problemas de claridad.',
        3: 'Comunicación aceptable con áreas de mejora.',
        4: 'Comunicación clara, profesional, buen vocabulario.',
        5: 'Comunicación excelente, articulada, vocabulario preciso.',
      },
    },
    {
      id: 'confidence',
      name: 'Confianza',
      description: 'Proyección de seguridad sin arrogancia',
      weight: 0.35,
      scoringGuide: {
        1: 'Muy inseguro o excesivamente arrogante.',
        2: 'Inseguridad evidente que afecta el mensaje.',
        3: 'Confianza moderada con momentos de duda.',
        4: 'Confianza apropiada, equilibrada.',
        5: 'Confianza natural, auténtica, inspiradora.',
      },
    },
    {
      id: 'adaptability',
      name: 'Adaptabilidad',
      description: 'Capacidad de ajustar el mensaje según el contexto',
      weight: 0.3,
      scoringGuide: {
        1: 'Mensaje rígido, no se adapta.',
        2: 'Intentos de adaptación pero forzados.',
        3: 'Adaptación básica al contexto.',
        4: 'Buena adaptación a diferentes escenarios.',
        5: 'Adaptación fluida, natural, siempre apropiada al contexto.',
      },
    },
  ],
  passingScore: 65,
  levelThresholds: {
    basic: 65,
    advanced: 78,
    pro: 90,
  },
}

/**
 * Module 6: Entrenamiento Guiado
 */
export const RUBRIC_ENTRENAMIENTO_GUIADO: ModuleRubric = {
  moduleId: 'entrenamiento-guiado',
  criteria: [
    {
      id: 'structure',
      name: 'Estructura de respuesta',
      description: 'Organización lógica y clara de las respuestas',
      weight: 0.3,
      scoringGuide: {
        1: 'Respuestas desestructuradas, divagan.',
        2: 'Algo de estructura pero inconsistente.',
        3: 'Estructura básica presente.',
        4: 'Estructura clara y consistente.',
        5: 'Estructura impecable: introducción, desarrollo, cierre.',
      },
    },
    {
      id: 'evidence-use',
      name: 'Uso de evidencia',
      description: 'Respaldo de afirmaciones con ejemplos concretos',
      weight: 0.4,
      scoringGuide: {
        1: 'Sin evidencia, solo afirmaciones.',
        2: 'Evidencia vaga o genérica.',
        3: 'Algunos ejemplos concretos.',
        4: 'Evidencia sólida en la mayoría de respuestas.',
        5: 'Cada afirmación respaldada con evidencia específica y relevante.',
      },
    },
    {
      id: 'improvement',
      name: 'Mejora progresiva',
      description: 'Aplicación de feedback y mejora entre intentos',
      weight: 0.3,
      scoringGuide: {
        1: 'No aplica feedback, repite errores.',
        2: 'Aplica feedback parcialmente.',
        3: 'Mejora moderada entre intentos.',
        4: 'Mejora notable, incorpora feedback activamente.',
        5: 'Mejora excepcional, transforma debilidades en fortalezas.',
      },
    },
  ],
  passingScore: 68,
  levelThresholds: {
    basic: 68,
    advanced: 80,
    pro: 92,
  },
}

// =============================================================================
// INTERVIEW MODULES (7-10) RUBRICS
// =============================================================================

/**
 * Base interview rubric (used for modules 7-10)
 */
export const RUBRIC_INTERVIEW_BASE: ModuleRubric = {
  moduleId: 'interview-base',
  criteria: [
    {
      id: 'star-structure',
      name: 'Estructura STAR',
      description: 'Uso correcto del método STAR en respuestas',
      weight: 0.25,
      scoringGuide: {
        1: 'Sin estructura, respuestas caóticas.',
        2: 'Intento de STAR pero incompleto o desordenado.',
        3: 'STAR presente pero algún componente débil.',
        4: 'STAR completo y bien ejecutado.',
        5: 'STAR perfecto, fluido, natural.',
      },
    },
    {
      id: 'relevance',
      name: 'Relevancia',
      description: 'Ejemplos apropiados para la pregunta y el rol',
      weight: 0.25,
      scoringGuide: {
        1: 'Ejemplo irrelevante o no responde la pregunta.',
        2: 'Ejemplo tangencialmente relacionado.',
        3: 'Ejemplo relacionado pero no óptimo.',
        4: 'Ejemplo bien elegido y relevante.',
        5: 'Ejemplo perfecto que demuestra exactamente lo que se pregunta.',
      },
    },
    {
      id: 'impact-quantification',
      name: 'Cuantificación de impacto',
      description: 'Resultados medibles y significativos',
      weight: 0.25,
      scoringGuide: {
        1: 'Sin métricas ni resultados claros.',
        2: 'Resultados vagos ("mejoró", "se logró").',
        3: 'Alguna métrica pero incompleta.',
        4: 'Métricas claras de impacto.',
        5: 'Múltiples métricas de impacto business con contexto.',
      },
    },
    {
      id: 'authenticity',
      name: 'Autenticidad',
      description: 'Respuestas genuinas vs. ensayadas',
      weight: 0.15,
      scoringGuide: {
        1: 'Claramente fabricado o ensayado.',
        2: 'Suena ensayado, poco natural.',
        3: 'Parcialmente auténtico.',
        4: 'Auténtico y genuino.',
        5: 'Completamente natural, personal, memorable.',
      },
    },
    {
      id: 'conciseness',
      name: 'Concisión',
      description: 'Respuestas completas pero no excesivas',
      weight: 0.1,
      scoringGuide: {
        1: 'Extremadamente largo o extremadamente corto.',
        2: 'Demasiado largo con información innecesaria.',
        3: 'Longitud aceptable pero mejorable.',
        4: 'Bien calibrado en extensión.',
        5: 'Perfecto equilibrio entre completitud y concisión.',
      },
    },
  ],
  passingScore: 70,
  levelThresholds: {
    basic: 65,
    advanced: 78,
    pro: 90,
  },
}

/**
 * Module 7: Entrenamiento Estructurado
 */
export const RUBRIC_ENTRENAMIENTO_ESTRUCTURADO: ModuleRubric = {
  ...RUBRIC_INTERVIEW_BASE,
  moduleId: 'entrenamiento-estructurado',
  passingScore: 65, // Lower threshold for first interview module
}

/**
 * Module 8: Simulación Real
 */
export const RUBRIC_SIMULACION_REAL: ModuleRubric = {
  ...RUBRIC_INTERVIEW_BASE,
  moduleId: 'simulacion-real',
  passingScore: 70,
  criteria: [
    ...RUBRIC_INTERVIEW_BASE.criteria,
    {
      id: 'pressure-handling',
      name: 'Manejo de presión',
      description: 'Compostura y claridad bajo preguntas difíciles',
      weight: 0.15,
      scoringGuide: {
        1: 'Se descompone bajo presión, respuestas incoherentes.',
        2: 'Visiblemente nervioso, afecta la respuesta.',
        3: 'Maneja presión moderadamente.',
        4: 'Mantiene compostura, respuestas claras.',
        5: 'Thrives under pressure, respuestas más sólidas.',
      },
    },
  ],
}

/**
 * Module 9: Sala de Práctica
 */
export const RUBRIC_SALA_PRACTICA: ModuleRubric = {
  ...RUBRIC_INTERVIEW_BASE,
  moduleId: 'sala-practica',
  passingScore: 72,
  criteria: [
    ...RUBRIC_INTERVIEW_BASE.criteria.map(c => ({
      ...c,
      // Increase scoring strictness
      scoringGuide: {
        ...c.scoringGuide,
        3: c.scoringGuide[3].replace('básico', 'moderado'),
      },
    })),
  ],
}

/**
 * Module 10: Evaluación Final
 */
export const RUBRIC_EVALUACION_FINAL: ModuleRubric = {
  moduleId: 'evaluacion-final',
  criteria: [
    {
      id: 'executive-presence',
      name: 'Presencia ejecutiva',
      description: 'Proyección de liderazgo y credibilidad',
      weight: 0.2,
      scoringGuide: {
        1: 'Sin presencia ejecutiva.',
        2: 'Presencia débil, poca credibilidad.',
        3: 'Presencia moderada.',
        4: 'Buena presencia ejecutiva.',
        5: 'Presencia excepcional, inspirador.',
      },
    },
    {
      id: 'strategic-thinking',
      name: 'Pensamiento estratégico',
      description: 'Visión de alto nivel, conexión de puntos',
      weight: 0.2,
      scoringGuide: {
        1: 'Pensamiento puramente táctico.',
        2: 'Algunos indicios de visión estratégica.',
        3: 'Pensamiento estratégico básico.',
        4: 'Demuestra visión estratégica clara.',
        5: 'Pensamiento estratégico excepcional, conecta temas macro.',
      },
    },
    {
      id: 'measurable-impact',
      name: 'Impacto medible',
      description: 'Resultados cuantificables a nivel organizacional',
      weight: 0.25,
      scoringGuide: {
        1: 'Sin métricas de impacto.',
        2: 'Métricas de bajo nivel o irrelevantes.',
        3: 'Algunas métricas de impacto organizacional.',
        4: 'Métricas sólidas de impacto business.',
        5: 'Impacto cuantificable a nivel P&L, estratégico.',
      },
    },
    {
      id: 'star-mastery',
      name: 'Dominio STAR',
      description: 'Ejecución fluida y natural del método',
      weight: 0.2,
      scoringGuide: {
        1: 'STAR ausente o mal ejecutado.',
        2: 'STAR mecánico, forzado.',
        3: 'STAR correcto pero no fluido.',
        4: 'STAR bien ejecutado y natural.',
        5: 'STAR invisible - tan natural que no se nota la estructura.',
      },
    },
    {
      id: 'readiness',
      name: 'Preparación para entrevistas reales',
      description: 'Nivel de preparación general',
      weight: 0.15,
      scoringGuide: {
        1: 'No está listo para entrevistas reales.',
        2: 'Necesita más práctica significativa.',
        3: 'Puede intentar entrevistas con riesgo moderado.',
        4: 'Listo para entrevistas, probabilidad alta de éxito.',
        5: 'Completamente preparado, excelente candidato.',
      },
    },
  ],
  passingScore: 75,
  levelThresholds: {
    basic: 70,
    advanced: 82,
    pro: 92,
  },
}

// =============================================================================
// RUBRIC REGISTRY
// =============================================================================

export const EVALUATION_RUBRICS: Record<string, ModuleRubric> = {
  'auditoria-inicial': RUBRIC_AUDITORIA_INICIAL,
  'metodo-star': RUBRIC_METODO_STAR,
  'cv-inteligente': RUBRIC_CV_INTELIGENTE,
  'analisis-vacante': RUBRIC_ANALISIS_VACANTE,
  'analisis-multimodal': RUBRIC_ANALISIS_MULTIMODAL,
  'entrenamiento-guiado': RUBRIC_ENTRENAMIENTO_GUIADO,
  'entrenamiento-estructurado': RUBRIC_ENTRENAMIENTO_ESTRUCTURADO,
  'simulacion-real': RUBRIC_SIMULACION_REAL,
  'sala-practica': RUBRIC_SALA_PRACTICA,
  'evaluacion-final': RUBRIC_EVALUACION_FINAL,
}

/**
 * Get rubric for a module
 */
export function getRubric(moduleId: string): ModuleRubric | null {
  return EVALUATION_RUBRICS[moduleId] ?? null
}

/**
 * Get passing score for a module at a specific level
 */
export function getPassingScore(
  moduleId: string,
  level: 'basic' | 'advanced' | 'pro'
): number {
  const rubric = getRubric(moduleId)
  if (!rubric) return 70 // Default

  return rubric.levelThresholds[level]
}

/**
 * Format rubric as text for AI prompt
 */
export function formatRubricForPrompt(rubric: ModuleRubric): string {
  const criteriaText = rubric.criteria
    .map(c => {
      const guide = Object.entries(c.scoringGuide)
        .map(([score, desc]) => `  ${score}: ${desc}`)
        .join('\n')
      return `### ${c.name} (${Math.round(c.weight * 100)}%)
${c.description}

Guía de puntuación:
${guide}`
    })
    .join('\n\n')

  return `# Rúbrica de Evaluación: ${rubric.moduleId}

Puntaje para aprobar: ${rubric.passingScore}/100

## Criterios

${criteriaText}`
}
