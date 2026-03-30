import { A1_PREGUNTAS_BASE } from './disc-questions'

/**
 * Despega Cerebral Assessment Profile
 * 4 dimensions: Energía, Enfoque, Relaciones, Plan Ejecutivo
 */
export interface DespegarProfile {
  energia: number
  enfoque: number
  relaciones: number
  plan_ejecutivo: number
  primary: 'energia' | 'enfoque' | 'relaciones' | 'plan_ejecutivo'
  primaryScore: number
  secondary: 'energia' | 'enfoque' | 'relaciones' | 'plan_ejecutivo'
  secondaryScore: number
}

export interface DespegarInterpretation {
  profile: DespegarProfile
  profileName: string
  description: string
  strengths: string[]
  developmentAreas: string[]
  recommendations: string[]
}

/**
 * Backwards compatibility - aliases for legacy code
 */
export type DiscProfile = DespegarProfile
export type DiscInterpretation = DespegarInterpretation

export interface A1ProfileResult {
  dominancia: number
  influencia: number
  estabilidad: number
  conciencia: number
  perfil_dominante: 'dominancia' | 'influencia' | 'estabilidad' | 'conciencia'
  perfil_secundario: 'dominancia' | 'influencia' | 'estabilidad' | 'conciencia'
  descripción: string
  fortalezas: string[]
  areas_desarrollo: string[]
  recomendaciones: string[]
}

export interface A1Response {
  question_id: number
  respuesta: 'más' | 'menos' | 'como_yo'
}

export function calcularPerfilA1(respuestas: A1Response[]): A1ProfileResult {
  // Inicializar contadores por categoría
  const scores: Record<string, number> = {
    dominancia: 0,
    influencia: 0,
    estabilidad: 0,
    conciencia: 0,
  }

  // Procesar respuestas y asignar puntos
  respuestas.forEach((respuesta) => {
    const pregunta = A1_PREGUNTAS_BASE.find((p) => p.id === respuesta.question_id)
    if (!pregunta) return

    // Scoring: Más = 3 puntos, Como yo = 2 puntos, Menos = 1 punto
    const puntaje =
      respuesta.respuesta === 'más' ? 3 : respuesta.respuesta === 'como_yo' ? 2 : 1

    scores[pregunta.category] += puntaje
  })

  // Normalizar a escala 0-100
  const preguntasPorCategoria = 7 // 28 preguntas / 4 categorías
  const maxPuntosPorCategoria = preguntasPorCategoria * 3 // Máximo 21 puntos

  const perfiles = {
    dominancia: Math.round((scores.dominancia / maxPuntosPorCategoria) * 100),
    influencia: Math.round((scores.influencia / maxPuntosPorCategoria) * 100),
    estabilidad: Math.round((scores.estabilidad / maxPuntosPorCategoria) * 100),
    conciencia: Math.round((scores.conciencia / maxPuntosPorCategoria) * 100),
  }

  // Encontrar perfiles dominantes
  const sorted = Object.entries(perfiles).sort(([, a], [, b]) => b - a)
  const perfilDominante = sorted[0][0] as 'dominancia' | 'influencia' | 'estabilidad' | 'conciencia'
  const perfilSecundario = sorted[1][0] as 'dominancia' | 'influencia' | 'estabilidad' | 'conciencia'

  // Generar descripción según perfil
  const descripciones: Record<string, string> = {
    dominancia:
      'Eres una persona orientada a resultados, con capacidad para tomar decisiones rápidas y enfrentar desafíos. Te motiva el liderazgo y la competencia.',
    influencia:
      'Eres una persona carismática y comunicadora, que se energiza con la interacción social. Te motiva inspirar a otros y generar conexiones significativas.',
    estabilidad:
      'Eres una persona colaborativa y empática, que valora las relaciones y la estabilidad. Te motiva apoyar a otros y mantener el equilibrio.',
    conciencia:
      'Eres una persona analítica y detallista, que busca exactitud y cumplimiento. Te motiva el análisis profundo y la excelencia en lo que haces.',
  }

  // Generar fortalezas según perfil
  const fortalezasMap: Record<string, string[]> = {
    dominancia: [
      'Tomas decisiones rápidas y eficientes',
      'Eres líder natural en situaciones complejas',
      'Te adaptas rápido a cambios',
      'Inspiras acción en otros',
    ],
    influencia: [
      'Conectas fácilmente con las personas',
      'Comunicas ideas con claridad y entusiasmo',
      'Motivas y energizas a tu equipo',
      'Eres excelente en presentaciones',
    ],
    estabilidad: [
      'Eres confiable y leal',
      'Escuchas y comprendes a otros',
      'Mantienes la calma bajo presión',
      'Eres excelente en trabajo colaborativo',
    ],
    conciencia: [
      'Atiendes a los detalles importantes',
      'Analizas profundamente antes de decidir',
      'Buscas calidad en todo lo que haces',
      'Eres metódico y organizado',
    ],
  }

  // Generar áreas de desarrollo según perfil
  const areasMap: Record<string, string[]> = {
    dominancia: [
      'Escuchar activamente antes de decidir',
      'Ser más considerado con otros en decisiones',
      'Desarrollar paciencia',
      'Trabajar en adaptación gradual a cambios',
    ],
    influencia: [
      'Desarrollar análisis antes de actuar',
      'Mejorar enfoque y concentración',
      'Ser más cuidadoso con detalles',
      'Fortalecer seguimiento de procesos',
    ],
    estabilidad: [
      'Tomar decisiones más rápidas',
      'Ser más proactivo en cambios',
      'Aumentar iniciativa personal',
      'Desarrollar mayor assertividad',
    ],
    conciencia: [
      'Ser más flexible ante lo imprevisto',
      'Mejorar ritmo de ejecución',
      'Desarrollar mayor confianza en la acción',
      'Equilibrar análisis con decisión rápida',
    ],
  }

  // Generar recomendaciones personalizadas
  const recomendacionesMap: Record<string, string[]> = {
    dominancia: [
      'En A2 Ruta: Enfócate en metas de corto plazo y competitivas',
      'En A3 Impulso: Busca roles de liderazgo en simulaciones',
      'En A4 Radar: Analiza oportunidades de mercado competitivas',
    ],
    influencia: [
      'En A2 Ruta: Crea un plan con interacción y networking',
      'En A3 Impulso: Prepárate en comunicación de logros',
      'En A4 Radar: Sigue tendencias y personas influyentes',
    ],
    estabilidad: [
      'En A2 Ruta: Construye un plan gradual y sostenible',
      'En A3 Impulso: Trabaja en confianza y apoyo mutuo',
      'En A4 Radar: Busca mentores y comunidades estables',
    ],
    conciencia: [
      'En A2 Ruta: Detalla tu plan con métricas claras',
      'En A3 Impulso: Prepárate profundamente para entrevistas',
      'En A4 Radar: Analiza datos y tendencias del mercado',
    ],
  }

  return {
    dominancia: perfiles.dominancia,
    influencia: perfiles.influencia,
    estabilidad: perfiles.estabilidad,
    conciencia: perfiles.conciencia,
    perfil_dominante: perfilDominante,
    perfil_secundario: perfilSecundario,
    descripción: descripciones[perfilDominante],
    fortalezas: fortalezasMap[perfilDominante],
    areas_desarrollo: areasMap[perfilDominante],
    recomendaciones: recomendacionesMap[perfilDominante],
  }
}

/**
 * Calculate Despega profile from raw responses
 * Maps assessment categories to Despega dimensions
 */
export function calculateDespegarProfile(responses: Record<number, any>): DespegarProfile {
  const scores: Record<string, number> = { 
    energia: 0, 
    enfoque: 0, 
    relaciones: 0, 
    plan_ejecutivo: 0 
  }
  
  // Handle both array and object response formats
  const responseArray = Array.isArray(responses) ? responses : Object.values(responses)
  
  responseArray.forEach((response: any) => {
    if (!response) return
    
    // Map DISC categories to Despega dimensions
    // dominancia → energia, influencia → relaciones, estabilidad → plan_ejecutivo, conciencia → enfoque
    if (response.dominancia !== undefined) scores.energia += response.dominancia
    if (response.influencia !== undefined) scores.relaciones += response.influencia
    if (response.estabilidad !== undefined) scores.plan_ejecutivo += response.estabilidad
    if (response.conciencia !== undefined) scores.enfoque += response.conciencia
  })
  
  // Normalize scores to 0-100 scale
  const normalized: Record<string, number> = {}
  Object.entries(scores).forEach(([dimension, score]) => {
    normalized[dimension] = Math.max(0, Math.min(100, score))
  })
  
  // Find primary and secondary dimensions
  const entries = Object.entries(normalized).sort(([, a], [, b]) => b - a)
  const primary = entries[0][0] as 'energia' | 'enfoque' | 'relaciones' | 'plan_ejecutivo'
  const secondary = entries[1][0] as 'energia' | 'enfoque' | 'relaciones' | 'plan_ejecutivo'
  
  return {
    energia: Math.round(normalized.energia),
    enfoque: Math.round(normalized.enfoque),
    relaciones: Math.round(normalized.relaciones),
    plan_ejecutivo: Math.round(normalized.plan_ejecutivo),
    primary,
    primaryScore: Math.round(normalized[primary]),
    secondary,
    secondaryScore: Math.round(normalized[secondary])
  }
}

/**
 * Backwards compatibility - use calculateDespegarProfile instead
 */
export function calculateDiscProfile(responses: Record<number, any>): DiscProfile {
  return calculateDespegarProfile(responses)
}

/**
 * Generate Despega interpretation and insights from profile
 */
export function interpretDespegarProfile(profile: DespegarProfile): DespegarInterpretation {
  const profileNames: Record<string, string> = {
    energia: 'Energía y Vitalidad',
    enfoque: 'Enfoque y Productividad',
    relaciones: 'Relaciones y Conexión',
    plan_ejecutivo: 'Plan Ejecutivo y Acción'
  }

  const descriptions: Record<string, string> = {
    energia: 'Tu fortaleza es generar energía, movimiento y vitalidad. Te destaca tu capacidad para impulsar iniciativas y mantener el ritmo. Eres motor de cambio y acción.',
    enfoque: 'Tu fortaleza es el enfoque y la productividad. Destaca tu capacidad para mantener claridad, establecer prioridades y ejecutar con precisión. Eres orientado a resultados.',
    relaciones: 'Tu fortaleza es construir relaciones significativas y colaboración. Destaca tu capacidad para conectar con otros, generar confianza y crear equipo. Eres catalizador de conexión.',
    plan_ejecutivo: 'Tu fortaleza es la planificación y ejecución estratégica. Destaca tu capacidad para diseñar, organizar y llevar a cabo planes complejos. Eres arquitecto de resultados.'
  }

  const strengthsMap: Record<string, string[]> = {
    energia: [
      'Generas movimiento y cambio en equipos',
      'Mantienes ritmo sostenido',
      'Inspiras acción en otros',
      'Superas inercia y obstáculos'
    ],
    enfoque: [
      'Estableces prioridades claras',
      'Ejecutas con precisión',
      'Mantienes productividad consistente',
      'Orientado a resultados medibles'
    ],
    relaciones: [
      'Construyes conexiones significativas',
      'Generas confianza y colaboración',
      'Escuchas y comprendes perspectivas',
      'Creas equipos cohesivos'
    ],
    plan_ejecutivo: [
      'Diseñas planes estratégicos',
      'Organizas complejidad',
      'Ejecutas proyectos integrales',
      'Anticipas y mitigas riesgos'
    ]
  }

  const developmentMap: Record<string, string[]> = {
    energia: [
      'Desarrollar sostenibilidad vs. solo movimiento',
      'Mejorar escucha y reflexión',
      'Balancear energía con enfoque',
      'Cultivar profundidad además de velocidad'
    ],
    enfoque: [
      'Aumentar flexibilidad ante lo imprevisto',
      'Desarrollar capacidad de pivote rápido',
      'Mejorar energía y comunicación',
      'Equilibrar análisis con intuición'
    ],
    relaciones: [
      'Desarrollar capacidad de decisión independiente',
      'Mejorar enfoque individual',
      'Aumentar orientación a resultados',
      'Fortalecer accountability personal'
    ],
    plan_ejecutivo: [
      'Desarrollar agilidad y adaptabilidad',
      'Mejorar comunicación y conexión',
      'Aumentar energía y espontaneidad',
      'Equilibrar control con flexibilidad'
    ]
  }

  return {
    profile,
    profileName: profileNames[profile.primary],
    description: descriptions[profile.primary],
    strengths: strengthsMap[profile.primary],
    developmentAreas: developmentMap[profile.primary],
    recommendations: [
      `En A2 Ruta: Diseña tu plan aprovechando tu dimensión de ${profile.profileName}`,
      `En A3 Impulso: Prepárate con acciones que refuercen tu fortaleza natural`,
      `En A4 Radar: Busca oportunidades alineadas con tu perfil de ${profile.primary}`
    ]
  }
}

/**
 * Backwards compatibility - use interpretDespegarProfile instead
 */
export function interpretDiscProfile(profile: DiscProfile): DiscInterpretation {
  return interpretDespegarProfile(profile)
}
