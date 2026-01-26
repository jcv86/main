/**
 * Lógica de Entrevistas Guiadas A3
 */

export interface ModuloEducativo {
  id: string
  titulo: string
  contenido: {
    introduccion: string
    que_esperar: string[]
    tips: string[]
  }
  tipo: 'que_es' | 'a_que_te_enfrentas' | 'tips'
  orden: number
}

export interface PreguntaEntrevista {
  id: string
  pregunta: string
  tipo: 'conductual' | 'tecnica' | 'situacional'
  sugerencia: string
  tips: string[]
  categoria: string
}

export interface RespuestaUsuario {
  pregunta_id: string
  respuesta: string
  tiempo: number
}

export interface FeedbackEntrevista {
  puntuacion: number
  fortalezas: string[]
  areas_mejora: string[]
  recomendaciones: string[]
}

/**
 * Calcula score de respuesta basado en criterios
 */
export function calcularScoreRespuesta(
  respuesta: string,
  tipo_pregunta: string,
  perfil_usuario?: string
): { score: number; feedback: string } {
  let score = 50 // Base

  // Longitud adecuada (30-500 caracteres es bueno)
  if (respuesta.length > 100 && respuesta.length < 500) {
    score += 15
  } else if (respuesta.length < 100) {
    score -= 10
  }

  // Palabras clave positivas
  const palabras_positivas = [
    'logré',
    'conseguí',
    'resultó',
    'mejoré',
    'desarrollé',
    'aprendí',
    'lideré',
    'implementé',
    'resolví',
  ]
  const coincidencias = palabras_positivas.filter(p => respuesta.toLowerCase().includes(p))
  score += coincidencias.length * 5

  // Estructura (debe tener contexto + acción + resultado)
  const tiene_contexto = respuesta.toLowerCase().includes('cuando') || respuesta.toLowerCase().includes('en')
  const tiene_accion =
    respuesta.toLowerCase().includes('hice') ||
    respuesta.toLowerCase().includes('decidí') ||
    respuesta.toLowerCase().includes('implementé')
  const tiene_resultado =
    respuesta.toLowerCase().includes('resultado') ||
    respuesta.toLowerCase().includes('logré') ||
    respuesta.toLowerCase().includes('conseguí')

  if (tiene_contexto && tiene_accion && tiene_resultado) {
    score += 20
  }

  score = Math.min(100, Math.max(0, score))

  const feedback =
    score >= 80
      ? 'Excelente respuesta. Has proporcionado un ejemplo claro con contexto, acciones y resultados.'
      : score >= 60
        ? 'Buena respuesta. Considera añadir más detalles sobre el resultado o el impacto.'
        : score >= 40
          ? 'Respuesta aceptable. Intenta ser más específico y incluir resultados concretos.'
          : 'Necesita mejorar. Proporciona ejemplos más detallados con inicio, acciones y resultados.'

  return { score, feedback }
}

/**
 * Genera feedback personalizado basado en perfil DISC
 */
export function generarFeedbackPersonalizado(
  respuestas: RespuestaUsuario[],
  perfil_disc: 'A' | 'B' | 'C' | 'D'
): FeedbackEntrevista {
  const promedio_score = respuestas.reduce((sum, r) => {
    const { score } = calcularScoreRespuesta(r.respuesta, 'general', perfil_disc)
    return sum + score
  }, 0) / respuestas.length

  const consejos_por_perfil = {
    A: {
      fortalezas: ['Claridad en objetivos', 'Decisión rápida', 'Enfoque en resultados'],
      mejoras: ['Escucha más a otros', 'Sé más flexible', 'Explica tu proceso de pensamiento'],
    },
    B: {
      fortalezas: ['Comunicación efectiva', 'Trabajo en equipo', 'Entusiasmo'],
      mejoras: ['Sé más puntual con detalles', 'Profundiza en números', 'Sigue procesos'],
    },
    C: {
      fortalezas: ['Atención al detalle', 'Análisis profundo', 'Precisión'],
      mejoras: ['Sé más conciso', 'Confía más en tu intuición', 'Acelera toma de decisiones'],
    },
    D: {
      fortalezas: ['Paciencia', 'Estabilidad', 'Confiabilidad'],
      mejoras: ['Toma más iniciativa', 'Cuestiona más', 'Sé más directo'],
    },
  }

  return {
    puntuacion: Math.round(promedio_score),
    fortalezas: consejos_por_perfil[perfil_disc].fortalezas,
    areas_mejora: consejos_por_perfil[perfil_disc].mejoras,
    recomendaciones: [
      'Practica entrevistas más seguido',
      'Grábate respondiendo preguntas',
      'Busca feedback de mentores',
    ],
  }
}

/**
 * Determina si usuario está listo para entrevista sin asistencia
 */
export function verificarReadinessNoAsistida(progreso: any): boolean {
  // Requiere: completar módulos + 2 entrevistas guiadas + score promedio >= 70
  return (
    progreso.modulos_completados >= 3 &&
    progreso.entrevistas_completadas >= 2 &&
    progreso.puntuacion_promedio >= 70
  )
}

/**
 * Contenido educativo de módulos
 */
export const MODULOS_EDUCATIVOS: ModuloEducativo[] = [
  {
    id: 'que_es',
    titulo: '¿Qué es una entrevista?',
    contenido: {
      introduccion:
        'Una entrevista es una conversación bidireccional donde tanto tú como el empleador os evaluáis mutuamente.',
      que_esperar: [
        'Preguntas sobre tu experiencia y habilidades',
        'Discusión sobre la posición y empresa',
        'Evaluación de si encajas con la cultura',
        'Tu oportunidad para hacer preguntas',
      ],
      tips: [
        'Es una conversación, no un interrogatorio',
        'El entrevistador también quiere que tengas éxito',
        'Tu objetivo es demostrar valor y evaluar si es el lugar correcto',
      ],
    },
    tipo: 'que_es',
    orden: 1,
  },
  {
    id: 'a_que_enfrentas',
    titulo: 'A qué te enfrentas',
    contenido: {
      introduccion: 'Existen diferentes tipos de entrevistas. Aquí los principales:',
      que_esperar: [
        'Entrevistas conductuales: "Cuéntame de un momento en que..."',
        'Entrevistas técnicas: Problemas de codificación o técnicos',
        'Entrevistas situacionales: "¿Qué harías si...?"',
        'Entrevistas generales: Sobre ti, tu carrera, motivación',
      ],
      tips: [
        'Prepara historias (STAR: Situation, Task, Action, Result)',
        'Investiga la empresa antes',
        'Llega puntual (o 5 min antes si es virtual)',
        'Haz preguntas inteligentes',
      ],
    },
    tipo: 'a_que_te_enfrentas',
    orden: 2,
  },
  {
    id: 'tips_preparacion',
    titulo: 'Tips de Preparación',
    contenido: {
      introduccion: 'Estos tips te ayudarán a estar listo:',
      que_esperar: [
        'Practica con amigos o mentores',
        'Grábate respondiendo preguntas',
        'Conoce la empresa profundamente',
        'Prepara 3-5 historias relevantes',
        'Ten preguntas listas para el entrevistador',
      ],
      tips: [
        'El 70% del éxito es preparación',
        'No memorices, internacionaliza',
        'Ajusta tu lenguaje corporal (sonríe, contacto visual)',
        'Sigue el método STAR para historias',
      ],
    },
    tipo: 'tips',
    orden: 3,
  },
]

/**
 * Preguntas de entrevista organizadas por tipo
 */
export const PREGUNTAS_ENTREVISTA: PreguntaEntrevista[] = [
  {
    id: '1',
    pregunta: 'Cuéntame sobre un momento en que enfrentaste un conflicto en el trabajo.',
    tipo: 'conductual',
    sugerencia:
      'Describe la situación, qué hiciste, y el resultado positivo. Muestra empatía y resolución.',
    tips: [
      'Sé específico con nombres de proyectos/personas',
      'Muestra que escuchaste al otro lado',
      'Explica qué aprendiste',
      'Enfatiza la resolución positiva',
    ],
    categoria: 'manejo_conflictos',
  },
  {
    id: '2',
    pregunta: '¿Cuál es tu mayor debilidad y cómo la estás abordando?',
    tipo: 'conductual',
    sugerencia: 'Sé honesto pero enfocado en mejora. Elige algo real pero que hayas trabajado.',
    tips: ['Nunca digas que no tienes debilidades', 'Muestra que estás mejorando', 'Sé específico', 'Da un ejemplo de progreso'],
    categoria: 'autoconocimiento',
  },
  {
    id: '3',
    pregunta: '¿Por qué quieres trabajar en nuestra empresa?',
    tipo: 'general',
    sugerencia: 'Investiga la empresa. Conecta valores con tu carrera.',
    tips: [
      'Menciona productos o logros específicos',
      'Conecta con tu carrera',
      'Muestra entusiasmo genuino',
      'Evita respuestas genéricas',
    ],
    categoria: 'motivacion',
  },
  {
    id: '4',
    pregunta: '¿Qué situación de trabajo te es más desafiante?',
    tipo: 'situacional',
    sugerencia: 'Da un escenario realista pero muestra cómo lo manejarías.',
    tips: ['Sé honesto pero constructivo', 'Muestra cómo lo resolverías', 'Enfatiza aprendizaje', 'Sé conciso'],
    categoria: 'adaptabilidad',
  },
]
