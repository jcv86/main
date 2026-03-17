import { A1_PREGUNTAS_BASE } from './disc-questions'

export interface DiscProfile {
  D: number
  I: number
  S: number
  C: number
  primary: 'D' | 'I' | 'S' | 'C'
  primaryScore: number
  secondary: 'D' | 'I' | 'S' | 'C'
  secondaryScore: number
}

export interface DiscInterpretation {
  profile: DiscProfile
  profileName: string
  description: string
  strengths: string[]
  developmentAreas: string[]
  recommendations: string[]
}

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
 * Calculate DISC profile from raw responses (modern format)
 * Accepts responses in format: Record<questionId, { mas?: letter, menos?: letter }>
 */
export function calculateDiscProfile(responses: Record<number, any>): DiscProfile {
  const scores: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 }
  
  // Handle both array and object response formats
  const responseArray = Array.isArray(responses) ? responses : Object.values(responses)
  
  responseArray.forEach((response: any) => {
    if (!response) return
    
    // Handle DISC letter responses
    if (response.mas && typeof response.mas === 'string') {
      const letter = response.mas.toUpperCase()
      if (letter in scores) scores[letter] += 2
    }
    if (response.menos && typeof response.menos === 'string') {
      const letter = response.menos.toUpperCase()
      if (letter in scores) scores[letter] -= 1
    }
  })
  
  // Normalize scores to 0-100 scale
  const normalized: Record<string, number> = {}
  Object.entries(scores).forEach(([letter, score]) => {
    // Normalize with offset and scaling factor
    normalized[letter] = Math.max(0, Math.min(100, ((score + 56) / 1.12)))
  })
  
  // Find primary and secondary profiles
  const entries = Object.entries(normalized).sort(([, a], [, b]) => b - a)
  const primary = entries[0][0] as 'D' | 'I' | 'S' | 'C'
  const secondary = entries[1][0] as 'D' | 'I' | 'S' | 'C'
  
  return {
    D: Math.round(normalized.D),
    I: Math.round(normalized.I),
    S: Math.round(normalized.S),
    C: Math.round(normalized.C),
    primary,
    primaryScore: Math.round(normalized[primary]),
    secondary,
    secondaryScore: Math.round(normalized[secondary])
  }
}

/**
 * Generate interpretation and insights from DISC profile
 */
export function interpretDiscProfile(profile: DiscProfile): DiscInterpretation {
  const profileNames: Record<string, string> = {
    D: 'Dominancia (Impulsor)',
    I: 'Influencia (Inspirador)',
    S: 'Estabilidad (Apoyo)',
    C: 'Consciencia (Analista)'
  }

  const descriptions: Record<string, string> = {
    D: 'Eres orientado a resultados, con capacidad para tomar decisiones rápidas. Te motiva el liderazgo y superar desafíos.',
    I: 'Eres carismático y comunicador, energizado por interacción social. Te motiva inspirar a otros y generar conexiones.',
    S: 'Eres colaborativo y empático, que valora relaciones y estabilidad. Te motiva apoyar a otros y mantener equilibrio.',
    C: 'Eres analítico y detallista, buscando exactitud y cumplimiento. Te motiva el análisis profundo y la excelencia.'
  }

  const strengthsMap: Record<string, string[]> = {
    D: ['Tomas decisiones rápidas y eficientes', 'Eres líder natural', 'Te adaptas rápido a cambios', 'Inspiras acción'],
    I: ['Conectas fácilmente con personas', 'Comunicas con claridad', 'Motivas equipos', 'Excelente en presentaciones'],
    S: ['Eres confiable y leal', 'Escuchas y comprendes', 'Mantienes calma bajo presión', 'Excelente en colaboración'],
    C: ['Atiendes detalles', 'Analizas profundamente', 'Buscas calidad', 'Eres metódico y organizado']
  }

  const developmentMap: Record<string, string[]> = {
    D: ['Escuchar activamente', 'Ser más considerado', 'Desarrollar paciencia', 'Adaptarse gradualmente'],
    I: ['Desarrollar análisis', 'Mejorar enfoque', 'Ser cuidadoso con detalles', 'Fortalecer seguimiento'],
    S: ['Tomar decisiones rápidas', 'Ser más proactivo', 'Aumentar iniciativa', 'Mayor assertividad'],
    C: ['Ser más flexible', 'Mejorar ritmo ejecución', 'Mayor confianza en acción', 'Equilibrar análisis-decisión']
  }

  return {
    profile,
    profileName: profileNames[profile.primary],
    description: descriptions[profile.primary],
    strengths: strengthsMap[profile.primary],
    developmentAreas: developmentMap[profile.primary],
    recommendations: [
      `En A2 Ruta: Diseña tu plan considerando tu perfil ${profile.primary}`,
      `En A3 Impulso: Prepárate enfocándote en tus fortalezas naturales`,
      `En A4 Radar: Busca oportunidades alineadas con tu perfil`
    ]
  }
}
