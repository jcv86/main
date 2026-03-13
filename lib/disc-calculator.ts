// DISC Profile Calculator - Procesa respuestas y calcula perfil DISC

export interface DiscResponse {
  [questionId: number]: number // 1-5 scale
}

export interface DiscProfile {
  D: number // Dominance
  I: number // Influence
  S: number // Steadiness
  C: number // Conscientiousness
  primary: 'D' | 'I' | 'S' | 'C'
  secondary: 'D' | 'I' | 'S' | 'C'
  primaryScore: number
  secondaryScore: number
  balanced: boolean
}

export interface DiscInterpretation {
  primary: string
  secondary: string
  profile_type: string
  strengths: string[]
  challenges: string[]
  ideal_role: string
  communication_style: string
  motivators: string[]
  stressors: string[]
  development_areas: string[]
}

export function calculateDiscProfile(responses: DiscResponse): DiscProfile {
  let scores = { D: 0, I: 0, S: 0, C: 0 }
  const categoryMap = {
    1: 'D', 2: 'D', 3: 'D', 4: 'D', 5: 'D', 6: 'D', 7: 'D',
    8: 'I', 9: 'I', 10: 'I', 11: 'I', 12: 'I', 13: 'I', 14: 'I',
    15: 'S', 16: 'S', 17: 'S', 18: 'S', 19: 'S', 20: 'S', 21: 'S',
    22: 'C', 23: 'C', 24: 'C', 25: 'C', 26: 'C', 27: 'C', 28: 'C'
  } as const

  // Sum scores by category
  Object.entries(responses).forEach(([questionId, score]) => {
    const id = parseInt(questionId)
    const category = categoryMap[id as keyof typeof categoryMap]
    if (category) {
      scores[category] += score
    }
  })

  // Normalize to 0-100 scale (7 questions per category, max 5 each = 35 max)
  Object.keys(scores).forEach(key => {
    scores[key as keyof typeof scores] = Math.round((scores[key as keyof typeof scores] / 35) * 100)
  })

  // Find primary and secondary
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key as 'D' | 'I' | 'S' | 'C')

  const primary = sorted[0]
  const secondary = sorted[1]
  const primaryScore = scores[primary]
  const secondaryScore = scores[secondary]
  const balanced = Math.max(...Object.values(scores)) - Math.min(...Object.values(scores)) < 20

  return {
    D: scores.D,
    I: scores.I,
    S: scores.S,
    C: scores.C,
    primary,
    secondary,
    primaryScore,
    secondaryScore,
    balanced
  }
}

export function interpretDiscProfile(profile: DiscProfile): DiscInterpretation {
  const interpretations: Record<string, DiscInterpretation> = {
    'D-I': {
      primary: 'Dominancia',
      secondary: 'Influencia',
      profile_type: 'Emprendedor Motivador',
      strengths: ['Visión clara', 'Carisma', 'Capacidad de decisión rápida', 'Inspirador'],
      challenges: ['Puede ser impulsivo', 'A veces negligente con detalles', 'Dificultad escuchando otros'],
      ideal_role: 'CEO, Gerente de Ventas, Emprendedor',
      communication_style: 'Directo, entusiasta, decisivo',
      motivators: ['Poder', 'Reconocimiento', 'Éxito visible'],
      stressors: ['Falta de control', 'Rutina', 'Fracaso'],
      development_areas: ['Atención al detalle', 'Paciencia', 'Escucha activa']
    },
    'D-S': {
      primary: 'Dominancia',
      secondary: 'Estabilidad',
      profile_type: 'Gestor Leal',
      strengths: ['Liderazgo firme', 'Consistencia', 'Confiabilidad', 'Decisivo'],
      challenges: ['Puede ser muy exigente', 'Resistencia al cambio', 'Comunicación fría'],
      ideal_role: 'Director de Operaciones, Gerente de Proyecto, Supervisor',
      communication_style: 'Directo, consistente, formal',
      motivators: ['Control', 'Logros medibles', 'Orden'],
      stressors: ['Incertidumbre', 'Cambio inesperado', 'Desorden'],
      development_areas: ['Flexibilidad', 'Empatía', 'Delegación']
    },
    'D-C': {
      primary: 'Dominancia',
      secondary: 'Conciencia',
      profile_type: 'Ejecutivo Analítico',
      strengths: ['Liderazgo basado en datos', 'Pensamiento estratégico', 'Calidad de decisiones'],
      challenges: ['Puede ser muy crítico', 'Análisis paralizante', 'Dificultad delegando'],
      ideal_role: 'CTO, Analista Senior, Consultor',
      communication_style: 'Lógico, preciso, exigente',
      motivators: ['Excelencia', 'Reconocimiento profesional', 'Dominio'],
      stressors: ['Incompetencia', 'Imprecisión', 'Desorganización'],
      development_areas: ['Diplomacia', 'Confianza en otros', 'Velocidad de decisión']
    },
    'I-D': {
      primary: 'Influencia',
      secondary: 'Dominancia',
      profile_type: 'Vendedor Líder',
      strengths: ['Red de contactos amplia', 'Persuasión', 'Energía contagiosa', 'Visionario'],
      challenges: ['Falta de seguimiento', 'Impulsividad', 'Superficialidad'],
      ideal_role: 'Vendedor Senior, Gerente de Ventas, Publicista',
      communication_style: 'Dinámico, persuasivo, entusiasta',
      motivators: ['Reconocimiento', 'Variedad', 'Conexiones sociales'],
      stressors: ['Rechazo', 'Aislamiento', 'Rutina'],
      development_areas: ['Consistencia', 'Análisis profundo', 'Paciencia']
    },
    'I-S': {
      primary: 'Influencia',
      secondary: 'Estabilidad',
      profile_type: 'Diplomático Amigable',
      strengths: ['Relaciones interpersonales', 'Lealtad', 'Comunicación efectiva', 'Empatía'],
      challenges: ['Dificultad con conflicto', 'Indecisión', 'Susceptibilidad a presión social'],
      ideal_role: 'Recursos Humanos, Comunicación, Servicio al Cliente',
      communication_style: 'Cálido, colaborativo, considerado',
      motivators: ['Reconocimiento social', 'Armonía', 'Colaboración'],
      stressors: ['Conflicto', 'Confrontación', 'Rechazo'],
      development_areas: ['Assertividad', 'Pensamiento analítico', 'Acción independiente']
    },
    'I-C': {
      primary: 'Influencia',
      secondary: 'Conciencia',
      profile_type: 'Comunicador Reflexivo',
      strengths: ['Comunicación clara', 'Análisis social', 'Presentaciones persuasivas', 'Creatividad informada'],
      challenges: ['Análisis excesivo', 'Indecisión', 'Perfeccionismo'],
      ideal_role: 'Consultor, Trainer, Especialista en Comunicación',
      communication_style: 'Reflexivo, estructurado, cautious',
      motivators: ['Reconocimiento intelectual', 'Calidad', 'Influencia'],
      stressors: ['Crítica', 'Imprecisión', 'Presión por rapidez'],
      development_areas: ['Flexibilidad', 'Acción sin análisis perfecto', 'Toma de riesgos']
    },
    'S-D': {
      primary: 'Estabilidad',
      secondary: 'Dominancia',
      profile_type: 'Guardián Responsable',
      strengths: ['Lealtad', 'Responsabilidad', 'Paciencia', 'Consistencia'],
      challenges: ['Puede ser pasivo', 'Resistencia al cambio', 'Dificultad delegando'],
      ideal_role: 'Supervisor, Gerente de Operaciones, Administrador',
      communication_style: 'Formal, responsable, consistente',
      motivators: ['Seguridad', 'Reconocimiento por esfuerzo', 'Estabilidad'],
      stressors: ['Cambio abrupto', 'Incertidumbre', 'Conflicto'],
      development_areas: ['Iniciativa', 'Flexibilidad', 'Velocidad']
    },
    'S-I': {
      primary: 'Estabilidad',
      secondary: 'Influencia',
      profile_type: 'Colaborador Entusiasta',
      strengths: ['Trabajo en equipo', 'Paciencia', 'Loyalidad', 'Comunicación amable'],
      challenges: ['Indecisión', 'Evita conflictos', 'Dependencia del grupo'],
      ideal_role: 'Especialista en Equipo, Coordinador, Coach',
      communication_style: 'Colaborativo, apoyo, amigable',
      motivators: ['Armonía grupal', 'Reconocimiento del equipo', 'Contribución'],
      stressors: ['Conflicto interpersonal', 'Cambio', 'Soledad'],
      development_areas: ['Independencia', 'Assertividad', 'Iniciativa individual']
    },
    'S-C': {
      primary: 'Estabilidad',
      secondary: 'Conciencia',
      profile_type: 'Profesional Confiable',
      strengths: ['Atención al detalle', 'Confiabilidad', 'Calidad constante', 'Lealtad'],
      challenges: ['Falta de velocidad', 'Resistencia al cambio', 'Perfeccionismo paralizante'],
      ideal_role: 'Auditor, QA, Especialista Técnico, Archivador',
      communication_style: 'Preciso, formal, verificado',
      motivators: ['Calidad', 'Orden', 'Reconocimiento por precisión'],
      stressors: ['Presión por velocidad', 'Cambio de sistemas', 'Imprecisión'],
      development_areas: ['Velocidad', 'Flexibilidad', 'Tolerancia a la ambigüedad']
    },
    'C-D': {
      primary: 'Conciencia',
      secondary: 'Dominancia',
      profile_type: 'Estratega Analítico',
      strengths: ['Análisis profundo', 'Pensamiento estratégico', 'Calidad', 'Decisiones informadas'],
      challenges: ['Análisis paralizante', 'Crítica excesiva', 'Dificultad delegando'],
      ideal_role: 'Estratega, Arquitecto de Sistemas, Investigador',
      communication_style: 'Analítico, directo, basado en datos',
      motivators: ['Excelencia', 'Solución de problemas complejos', 'Control'],
      stressors: ['Incompetencia', 'Presión para actuar sin datos', 'Caos'],
      development_areas: ['Velocidad', 'Diplomacia', 'Confianza en intuición']
    },
    'C-I': {
      primary: 'Conciencia',
      secondary: 'Influencia',
      profile_type: 'Especialista Comunicador',
      strengths: ['Comunicación precisa', 'Análisis profundo', 'Credibilidad técnica', 'Persuasión informada'],
      challenges: ['Perfeccionismo', 'Indecisión', 'Análisis excesivo'],
      ideal_role: 'Especialista en Cumplimiento, Documentalista, Trainer Técnico',
      communication_style: 'Cuidadoso, informativo, metódico',
      motivators: ['Precisión', 'Reconocimiento técnico', 'Mejora continua'],
      stressors: ['Presión por rapidez', 'Imprecisión', 'Cambio sin análisis'],
      development_areas: ['Agilidad mental', 'Toma de riesgos', 'Pragmatismo']
    },
    'C-S': {
      primary: 'Conciencia',
      secondary: 'Estabilidad',
      profile_type: 'Custodio Meticuloso',
      strengths: ['Precisión', 'Loyalidad', 'Consistencia', 'Atención al detalle'],
      challenges: ['Resistencia al cambio', 'Lentitud', 'Perfeccionismo paralizante'],
      ideal_role: 'Contable, Auditor Interno, Archivador',
      communication_style: 'Formal, preciso, cauteloso',
      motivators: ['Orden', 'Precisión', 'Seguridad'],
      stressors: ['Presión por cambio rápido', 'Ambigüedad', 'Desorden'],
      development_areas: ['Agilidad', 'Flexibilidad', 'Apertura al cambio']
    }
  }

  const key = `${profile.primary}-${profile.secondary}`
  return interpretations[key] || interpretations['D-I'] // Default fallback
}
