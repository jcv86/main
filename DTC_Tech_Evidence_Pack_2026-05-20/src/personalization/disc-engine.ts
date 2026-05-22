// DISC Profile types and personalización logic
export type DISCProfile = 'D' | 'I' | 'S' | 'C' | null

export interface DISCPersonalizationConfig {
  contentDepth: 'superficial' | 'intermedio' | 'profundo'
  interactionStyle: 'directa' | 'colaborativa' | 'reflexiva'
  contentFormat: 'numeros' | 'historias' | 'conceptos' | 'procesos'
  pace: 'rapido' | 'moderado' | 'lento'
  preferredTopics: string[]
  recommendedReadingTime: number // minutos
}

const DEFAULT_PERSONALIZATION: DISCPersonalizationConfig = {
  contentDepth: 'intermedio',
  interactionStyle: 'colaborativa',
  contentFormat: 'historias',
  pace: 'moderado',
  preferredTopics: [],
  recommendedReadingTime: 10,
}

const DISC_PERSONALIZATION_MAP: Record<Exclude<DISCProfile, null>, DISCPersonalizationConfig> = {
  D: {
    // Dominador: Directo, orientado a resultados, rápido
    contentDepth: 'superficial',
    interactionStyle: 'directa',
    contentFormat: 'numeros',
    pace: 'rapido',
    preferredTopics: ['Oportunidades inmediatas', 'ROI', 'Liderazgo', 'Toma de decisiones rápida'],
    recommendedReadingTime: 5,
  },
  I: {
    // Influenciador: Comunicativo, orientado a personas, colaborativo
    contentDepth: 'intermedio',
    interactionStyle: 'colaborativa',
    contentFormat: 'historias',
    pace: 'moderado',
    preferredTopics: ['Networking', 'Comunicación', 'Influencia', 'Oportunidades de crecimiento'],
    recommendedReadingTime: 10,
  },
  S: {
    // Estable: Reflexivo, orientado al equipo, consistente
    contentDepth: 'profundo',
    interactionStyle: 'colaborativa',
    contentFormat: 'procesos',
    pace: 'lento',
    preferredTopics: ['Estabilidad laboral', 'Desarrollo de equipo', 'Procesos sostenibles'],
    recommendedReadingTime: 20,
  },
  C: {
    // Concienzudo: Analítico, orientado a calidad, detallado
    contentDepth: 'profundo',
    interactionStyle: 'reflexiva',
    contentFormat: 'conceptos',
    pace: 'moderado',
    preferredTopics: ['Análisis profundo', 'Datos', 'Precisión', 'Mejora continua'],
    recommendedReadingTime: 15,
  },
}

export function getDISCPersonalization(profile: DISCProfile): DISCPersonalizationConfig {
  return profile ? DISC_PERSONALIZATION_MAP[profile] : DEFAULT_PERSONALIZATION
}

export function getPersonalizedNewsRanking(
  profile: DISCProfile,
  newsItems: any[]
): any[] {
  const config = getDISCPersonalization(profile)
  
  // Score each news item based on DISC profile
  const scoredItems = newsItems.map(item => {
    let score = item.relevance_score || 50
    
    // Boost score based on preferred topics
    if (config.preferredTopics.some(topic => 
      item.title?.toLowerCase().includes(topic.toLowerCase()) ||
      item.content?.toLowerCase().includes(topic.toLowerCase())
    )) {
      score += 20
    }
    
    // Adjust based on content type preference
    if (config.contentFormat === 'numeros' && item.has_data) score += 10
    if (config.contentFormat === 'historias' && item.has_case_study) score += 10
    if (config.contentFormat === 'conceptos' && item.is_analytical) score += 10
    if (config.contentFormat === 'procesos' && item.is_structured) score += 10
    
    // Adjust based on pace
    if (config.pace === 'rapido' && item.reading_time_minutes <= 5) score += 5
    if (config.pace === 'lento' && item.reading_time_minutes >= 15) score += 5
    
    return { ...item, personalizedScore: score }
  })
  
  return scoredItems.sort((a, b) => b.personalizedScore - a.personalizedScore)
}

const DEFAULT_RECOMMENDATIONS: string[] = [
  'Explora diferentes tipos de roles y empresas',
  'Desarrolla una red profesional diversa',
  'Invierte en educación continua',
  'Busca mentores que te guíen',
]

const RECOMMENDATIONS_MAP: Record<Exclude<DISCProfile, null>, string[]> = {
  D: [
    'Enfócate en oportunidades con impacto inmediato',
    'Busca roles de liderazgo con autonomía',
    'Prioriza empresas en crecimiento acelerado',
    'Negocia agresivamente tu compensación',
  ],
  I: [
    'Desarrolla tu red de contactos estratégicamente',
    'Busca roles con interacción humana directa',
    'Participa en eventos y conferencias de tu industria',
    'Cultiva mentores y mentees',
  ],
  S: [
    'Busca estabilidad y beneficios en el largo plazo',
    'Prioriza cultura organizacional sana',
    'Desarrolla especialización en tu área actual',
    'Crea relaciones profundas en tu equipo',
  ],
  C: [
    'Domina las métricas y datos de tu industria',
    'Busca roles que demanden precisión y análisis',
    'Invierte en certificaciones relevantes',
    'Desarrolla expertise reconocida en tu campo',
  ],
}

export function getPersonalizedRecommendations(profile: DISCProfile): string[] {
  return profile ? RECOMMENDATIONS_MAP[profile] : DEFAULT_RECOMMENDATIONS
}
