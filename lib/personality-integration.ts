export interface PersonalityProfile {
  disc?: {
    primary: string
    secondary: string
    scores: { D: number; I: number; S: number; C: number }
    completedAt: string
  }
  bigFive?: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
    completedAt: string
  }
  mbti?: {
    type: string
    preferences: { E_I: number; S_N: number; T_F: number; J_P: number }
    completedAt: string
  }
  values?: {
    primary: string[]
    secondary: string[]
    completedAt: string
  }
}

export interface PersonalizedRecommendation {
  type: "job" | "skill" | "book" | "course" | "networking" | "interview_prep"
  title: string
  description: string
  reason: string
  priority: "high" | "medium" | "low"
  personalityTrait: string
  actionUrl?: string
  metadata?: Record<string, any>
}

export interface PersonalityInsight {
  id: string
  category: "strength" | "development" | "career" | "relationship" | "leadership"
  title: string
  description: string
  relevantTraits: string[]
  actionable: boolean
  confidence: number // 0-100
}

// Main integration class
export class PersonalityIntegrationService {
  private personalityProfile: PersonalityProfile

  constructor(personalityProfile: PersonalityProfile) {
    this.personalityProfile = personalityProfile
  }

  // Generate personalized CV recommendations
  generateCVRecommendations(): {
    summary: string
    skills: string[]
    experienceEmphasis: string[]
    personalityHighlights: string[]
  } {
    const { disc, bigFive } = this.personalityProfile
    let summary = ""
    const skills: string[] = []
    const experienceEmphasis: string[] = []
    const personalityHighlights: string[] = []

    // DISC-based recommendations
    if (disc) {
      const primary = disc.primary

      if (primary === "D") {
        summary +=
          "Profesional orientado a resultados con fuerte capacidad de liderazgo y toma de decisiones estratégicas. "
        skills.push("Liderazgo de equipos", "Toma de decisiones", "Gestión de resultados", "Orientación a objetivos")
        experienceEmphasis.push("Logros cuantificables", "Proyectos liderados", "Resultados de negocio")
        personalityHighlights.push("Líder natural", "Orientado a resultados", "Toma decisiones rápidas")
      } else if (primary === "I") {
        summary += "Profesional con excelentes habilidades de comunicación y capacidad para influir y motivar equipos. "
        skills.push("Comunicación efectiva", "Trabajo en equipo", "Networking", "Presentaciones públicas")
        experienceEmphasis.push("Colaboración exitosa", "Gestión de relaciones", "Proyectos en equipo")
        personalityHighlights.push("Comunicador efectivo", "Colaborativo", "Habilidades interpersonales")
      } else if (primary === "S") {
        summary +=
          "Profesional confiable y estable con fuerte orientación al trabajo colaborativo y la construcción de consensos. "
        skills.push("Trabajo en equipo", "Adaptabilidad", "Soporte al cliente", "Estabilidad operacional")
        experienceEmphasis.push("Consistencia en resultados", "Colaboración a largo plazo", "Adaptación a cambios")
        personalityHighlights.push("Confiable", "Colaborativo", "Estable bajo presión")
      } else if (primary === "C") {
        summary += "Profesional analítico con fuerte atención al detalle y compromiso con la calidad y precisión. "
        skills.push("Análisis de datos", "Control de calidad", "Atención al detalle", "Metodologías rigurosas")
        experienceEmphasis.push("Análisis detallados", "Mejoras de procesos", "Proyectos de calidad")
        personalityHighlights.push("Analítico", "Orientado a la calidad", "Meticuloso")
      }
    }

    // Big Five enhancements
    if (bigFive) {
      if (bigFive.openness >= 70) {
        summary += "Cuenta con alta creatividad y apertura a nuevas experiencias, ideal para entornos innovadores. "
        skills.push("Innovación", "Creatividad", "Pensamiento estratégico", "Adaptabilidad")
        personalityHighlights.push("Creativo", "Innovador", "Pensador estratégico")
      }

      if (bigFive.conscientiousness >= 70) {
        summary += "Demuestra alta responsabilidad y organización en la gestión de proyectos y objetivos. "
        skills.push("Gestión de proyectos", "Organización", "Planificación estratégica", "Cumplimiento de deadlines")
        personalityHighlights.push("Altamente organizado", "Responsable", "Cumplidor")
      }

      if (bigFive.extraversion >= 70) {
        skills.push("Networking profesional", "Presentaciones públicas", "Gestión de stakeholders")
        personalityHighlights.push("Sociable", "Networking natural", "Comunicador público")
      }

      if (bigFive.agreeableness >= 70) {
        skills.push("Mediación de conflictos", "Construcción de consensos", "Relaciones interpersonales")
        personalityHighlights.push("Colaborativo", "Empático", "Constructor de consensos")
      }

      if (bigFive.neuroticism <= 30) {
        skills.push("Manejo del estrés", "Estabilidad emocional", "Liderazgo bajo presión")
        personalityHighlights.push("Estable bajo presión", "Manejo efectivo del estrés", "Equilibrio emocional")
      }
    }

    return {
      summary: summary.trim(),
      skills: [...new Set(skills)], // Remove duplicates
      experienceEmphasis: [...new Set(experienceEmphasis)],
      personalityHighlights: [...new Set(personalityHighlights)],
    }
  }

  // Generate personalized interview preparation
  generateInterviewPreparation(): {
    strengths: string[]
    questionsToExpect: string[]
    preparationTips: string[]
    exampleAnswers: Array<{ question: string; approach: string }>
  } {
    const { disc, bigFive } = this.personalityProfile
    const strengths: string[] = []
    const questionsToExpect: string[] = []
    const preparationTips: string[] = []
    const exampleAnswers: Array<{ question: string; approach: string }> = []

    // DISC-based interview prep
    if (disc) {
      const primary = disc.primary

      if (primary === "D") {
        strengths.push("Liderazgo natural", "Toma de decisiones rápida", "Orientación a resultados")
        questionsToExpect.push(
          "Cuéntame sobre una vez que lideraste un equipo hacia un objetivo desafiante",
          "¿Cómo manejas la presión y los deadlines ajustados?",
          "Describe una decisión difícil que tuviste que tomar",
        )
        preparationTips.push(
          "Prepara ejemplos específicos de liderazgo con resultados medibles",
          "Enfatiza tu capacidad de tomar decisiones bajo presión",
          "Muestra confianza sin ser agresivo",
        )
        exampleAnswers.push({
          question: "¿Cómo manejas los conflictos en el equipo?",
          approach:
            "Enfócate en resolver rápidamente, tomar decisiones claras y mantener el foco en los objetivos del equipo",
        })
      } else if (primary === "I") {
        strengths.push("Comunicación efectiva", "Habilidades interpersonales", "Capacidade de influencia")
        questionsToExpect.push(
          "¿Cómo construyes relaciones con nuevos colegas?",
          "Cuéntame sobre un proyecto exitoso que hiciste en equipo",
          "¿Cómo persuades a otros de tus ideas?",
        )
        preparationTips.push(
          "Usa storytelling en tus respuestas",
          "Muestra entusiasmo y energía positiva",
          "Prepara ejemplos de colaboración exitosa",
        )
        exampleAnswers.push({
          question: "¿Cómo manejas las presentaciones públicas?",
          approach: "Destaca tu comodidad con audiencias y tu capacidad de conectar con diferentes tipos de personas",
        })
      }
    }

    // Big Five enhancements
    if (bigFive) {
      if (bigFive.openness >= 70) {
        strengths.push("Creatividad", "Innovación", "Adaptabilidad")
        questionsToExpect.push(
          "¿Cómo aportas nuevas ideas a los proyectos?",
          "Cuéntame sobre una vez que innovaste o mejoraste un proceso",
        )
        preparationTips.push("Prepara ejemplos de soluciones creativas o innovadoras")
      }

      if (bigFive.conscientiousness >= 70) {
        strengths.push("Organización", "Responsabilidad", "Atención al detalle")
        questionsToExpect.push(
          "¿Cómo organizas y priorizas tu trabajo?",
          "Describe tu proceso para asegurar la calidad en tus entregas",
        )
        preparationTips.push("Enfatiza tu metodología y procesos sistemáticos")
      }
    }

    return {
      strengths: [...new Set(strengths)],
      questionsToExpect: [...new Set(questionsToExpect)],
      preparationTips: [...new Set(preparationTips)],
      exampleAnswers,
    }
  }

  // Generate job matching criteria
  generateJobMatchingCriteria(): {
    idealRoles: string[]
    companyTypes: string[]
    workEnvironment: string[]
    avoidanceFactors: string[]
    salaryExpectations?: { min: number; max: number; currency: string }
  } {
    const { disc, bigFive } = this.personalityProfile
    const idealRoles: string[] = []
    const companyTypes: string[] = []
    const workEnvironment: string[] = []
    const avoidanceFactors: string[] = []

    // DISC-based job matching
    if (disc) {
      const primary = disc.primary

      if (primary === "D") {
        idealRoles.push("Director Ejecutivo", "Gerente General", "Líder de Proyecto", "Emprendedor", "Consultor Senior")
        companyTypes.push("Startups", "Líder de Proyecto", "Emprendedor", "Consultor Senior")
        companyTypes.push("Startups", "Empresas en crecimiento", "Consultorías", "Empresas de servicios profesionales")
        workEnvironment.push(
          "Autonomía en decisiones",
          "Metas claras y desafiantes",
          "Ritmo rápido",
          "Reconocimiento por resultados",
        )
        avoidanceFactors.push("Micromanagement", "Procesos burocráticos lentos", "Roles puramente operativos")
      } else if (primary === "I") {
        idealRoles.push("Gerente de Ventas", "Director de Marketing", "Gerente de RRHH", "Consultor", "Account Manager")
        companyTypes.push(
          "Empresas con cultura colaborativa",
          "Organizaciones orientadas al cliente",
          "Empresas de servicios",
        )
        workEnvironment.push(
          "Trabajo en equipo",
          "Interacción social frecuente",
          "Presentaciones y networking",
          "Ambiente dinámico",
        )
        avoidanceFactors.push("Trabajo aislado", "Tareas puramente técnicas", "Ambientes muy estructurados")
      } else if (primary === "S") {
        idealRoles.push(
          "Coordinador de Equipos",
          "Analista Senior",
          "Especialista",
          "Gerente de Operaciones",
          "Customer Success",
        )
        companyTypes.push(
          "Empresas estables y establecidas",
          "Organizaciones con buena cultura",
          "Corporaciones tradicionales",
        )
        workEnvironment.push(
          "Estabilidad laboral",
          "Trabajo colaborativo",
          "Procesos bien definidos",
          "Ambiente de apoyo",
        )
        avoidanceFactors.push("Cambios constantes", "Alta presión competitiva", "Ambientes muy agresivos")
      } else if (primary === "C") {
        idealRoles.push("Ingeniero", "Analista de Datos", "Auditor", "Especialista Técnico", "Quality Assurance")
        companyTypes.push("Empresas técnicas", "Organizaciones que valoran la precisión", "Instituciones académicas")
        workEnvironment.push(
          "Tiempo para análisis profundo",
          "Estándares de calidad altos",
          "Trabajo independiente",
          "Recursos técnicos",
        )
        avoidanceFactors.push("Decisiones apresuradas", "Ambientes caóticos", "Presión por velocidad sobre calidad")
      }
    }

    // Big Five enhancements
    if (bigFive) {
      if (bigFive.openness >= 70) {
        idealRoles.push("Director de Innovación", "Product Manager", "UX Designer", "Consultor de Transformación")
        companyTypes.push("Empresas tecnológicas", "Startups innovadoras", "Consultorías estratégicas")
        workEnvironment.push("Proyectos diversos", "Libertad creativa", "Nuevos desafíos", "Aprendizaje continuo")
      }

      if (bigFive.conscientiousness >= 70) {
        idealRoles.push("Gerente de Proyectos", "Director de Operaciones", "Compliance Officer")
        workEnvironment.push("Procesos bien estructurados", "Objetivos claros", "Seguimiento detallado")
      }

      if (bigFive.extraversion >= 70) {
        companyTypes.push("Empresas con cultura social activa", "Organizaciones orientadas al networking")
        workEnvironment.push("Interacción social frecuente", "Eventos y presentaciones", "Trabajo en espacios abiertos")
        avoidanceFactors.push("Trabajo remoto exclusivo", "Tareas solitarias prolongadas")
      }

      if (bigFive.agreeableness >= 70) {
        idealRoles.push("Gerente de RRHH", "Mediador", "Community Manager", "Customer Success Manager")
        workEnvironment.push("Cultura colaborativa", "Enfoque en bienestar del equipo", "Resolución de conflictos")
      }

      if (bigFive.neuroticism <= 30) {
        idealRoles.push("Gerente de Crisis", "Líder de Cambio Organizacional", "Roles de alta responsabilidad")
        workEnvironment.push(
          "Ambientes de alta presión",
          "Responsabilidades críticas",
          "Toma de decisiones importantes",
        )
      }
    }

    // Salary expectations based on personality and Chilean market
    let salaryExpectations = undefined
    if (disc?.primary === "D" || (bigFive?.conscientiousness && bigFive.conscientiousness >= 70)) {
      salaryExpectations = { min: 2500000, max: 5000000, currency: "CLP" }
    } else if (disc?.primary === "I" || (bigFive?.extraversion && bigFive.extraversion >= 70)) {
      salaryExpectations = { min: 2200000, max: 4200000, currency: "CLP" }
    } else {
      salaryExpectations = { min: 1800000, max: 3500000, currency: "CLP" }
    }

    return {
      idealRoles: [...new Set(idealRoles)],
      companyTypes: [...new Set(companyTypes)],
      workEnvironment: [...new Set(workEnvironment)],
      avoidanceFactors: [...new Set(avoidanceFactors)],
      salaryExpectations,
    }
  }

  // Generate personalized learning recommendations
  generateLearningRecommendations(): PersonalizedRecommendation[] {
    const { disc, bigFive } = this.personalityProfile
    const recommendations: PersonalizedRecommendation[] = []

    // DISC-based learning recommendations
    if (disc) {
      const primary = disc.primary

      if (primary === "D") {
        recommendations.push({
          type: "book",
          title: "Los 7 Hábitos de la Gente Altamente Efectiva",
          description: "Desarrolla tus habilidades naturales de liderazgo con principios probados",
          reason: "Tu perfil DISC Dominante se beneficia de frameworks de liderazgo estructurados",
          priority: "high",
          personalityTrait: "DISC Dominante",
          actionUrl: "/library/reader/7-habits",
        })

        recommendations.push({
          type: "skill",
          title: "Strategic Decision Making",
          description: "Curso avanzado de toma de decisiones estratégicas",
          reason: "Potencia tu capacidad natural de tomar decisiones rápidas y efectivas",
          priority: "high",
          personalityTrait: "DISC Dominante",
        })
      } else if (primary === "I") {
        recommendations.push({
          type: "book",
          title: "Conversaciones Cruciales",
          description: "Mejora tu capacidad natural de influencia con técnicas de comunicación avanzada",
          reason: "Tu perfil DISC Influyente se beneficia de técnicas de comunicación estructuradas",
          priority: "high",
          personalityTrait: "DISC Influyente",
          actionUrl: "/library/reader/crucial-conversations",
        })

        recommendations.push({
          type: "networking",
          title: "Eventos de Networking Profesional",
          description: "Participa en eventos de networking del ecosistema tech chileno",
          reason: "Tu naturaleza social puede generar oportunidades valiosas",
          priority: "medium",
          personalityTrait: "DISC Influyente",
        })
      }
    }

    // Big Five-based recommendations
    if (bigFive) {
      if (bigFive.openness >= 70) {
        recommendations.push({
          type: "course",
          title: "Design Thinking y Innovación",
          description: "Metodologías para canalizar tu creatividad hacia la innovación empresarial",
          reason: "Tu alta apertura se beneficia de metodologías estructuradas de innovación",
          priority: "high",
          personalityTrait: "Alta Apertura",
        })
      }

      if (bigFive.neuroticism >= 60) {
        recommendations.push({
          type: "book",
          title: "El Poder del Ahora",
          description: "Técnicas de mindfulness para mejorar tu estabilidad emocional",
          reason: "Desarrollar técnicas de manejo del estrés mejorará tu bienestar profesional",
          priority: "high",
          personalityTrait: "Manejo del Estrés",
          actionUrl: "/library/reader/power-of-now",
        })
      }

      if (bigFive.extraversion <= 40) {
        recommendations.push({
          type: "skill",
          title: "Networking y Comunicación Profesional",
          description: "Desarrolla habilidades de networking para ampliar oportunidades",
          reason: "Mejorar tus habilidades sociales puede abrir nuevas oportunidades profesionales",
          priority: "medium",
          personalityTrait: "Desarrollo Social",
        })
      }

      if (bigFive.conscientiousness >= 70) {
        recommendations.push({
          type: "course",
          title: "Project Management Professional (PMP)",
          description: "Certificación en gestión de proyectos para aprovechar tu organización natural",
          reason: "Tu alta responsabilidad es ideal para roles de gestión de proyectos",
          priority: "high",
          personalityTrait: "Alta Responsabilidad",
        })
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  // Generate coaching conversation context
  generateCoachingContext(): {
    communicationStyle: string
    focusAreas: string[]
    motivationalApproach: string
    challengeAreas: string[]
  } {
    const { disc, bigFive } = this.personalityProfile
    let communicationStyle = "balanced"
    const focusAreas: string[] = []
    let motivationalApproach = "supportive"
    const challengeAreas: string[] = []

    // DISC-based coaching context
    if (disc) {
      const primary = disc.primary

      if (primary === "D") {
        communicationStyle = "direct and results-focused"
        focusAreas.push("Leadership development", "Strategic thinking", "Decision-making")
        motivationalApproach = "achievement-oriented"
        challengeAreas.push("Patience with process", "Collaborative decision-making")
      } else if (primary === "I") {
        communicationStyle = "engaging and enthusiastic"
        focusAreas.push("Communication skills", "Team building", "Networking")
        motivationalApproach = "recognition-based"
        challengeAreas.push("Attention to detail", "Independent work")
      } else if (primary === "S") {
        communicationStyle = "supportive and patient"
        focusAreas.push("Team collaboration", "Process improvement", "Stability")
        motivationalApproach = "steady progress"
        challengeAreas.push("Assertiveness", "Change adaptation")
      } else if (primary === "C") {
        communicationStyle = "detailed and analytical"
        focusAreas.push("Technical expertise", "Quality improvement", "Analysis")
        motivationalApproach = "competence-based"
        challengeAreas.push("Quick decision-making", "Interpersonal skills")
      }
    }

    // Big Five enhancements
    if (bigFive) {
      if (bigFive.openness >= 70) {
        focusAreas.push("Innovation", "Creative problem-solving")
      }
      if (bigFive.conscientiousness >= 70) {
        focusAreas.push("Goal achievement", "Organization")
      }
      if (bigFive.extraversion <= 40) {
        challengeAreas.push("Public speaking", "Networking")
      }
      if (bigFive.neuroticism >= 60) {
        challengeAreas.push("Stress management", "Emotional regulation")
      }
    }

    return {
      communicationStyle,
      focusAreas: [...new Set(focusAreas)],
      motivationalApproach,
      challengeAreas: [...new Set(challengeAreas)],
    }
  }

  // Generate insights for dashboard
  generatePersonalityInsights(): PersonalityInsight[] {
    const { disc, bigFive } = this.personalityProfile
    const insights: PersonalityInsight[] = []

    // DISC insights
    if (disc) {
      const primary = disc.primary
      const dominantScore = Math.max(...Object.values(disc.scores))

      if (primary === "D" && dominantScore >= 70) {
        insights.push({
          id: "leadership-potential",
          category: "leadership",
          title: "Potencial de Liderazgo Excepcional",
          description:
            "Tu perfil DISC muestra características de liderazgo natural. Considera roles donde puedas dirigir equipos y tomar decisiones estratégicas en el mercado chileno.",
          relevantTraits: ["DISC Dominante"],
          actionable: true,
          confidence: 85,
        })
      }

      if (disc.scores.I >= 60 && disc.scores.S >= 60) {
        insights.push({
          id: "collaboration-strength",
          category: "strength",
          title: "Excelente Balance Social",
          description:
            "Tu combinación de Influencia y Estabilidad te hace ideal para roles que requieren tanto liderazgo como colaboración en equipos.",
          relevantTraits: ["DISC Influencia", "DISC Estabilidad"],
          actionable: true,
          confidence: 80,
        })
      }
    }

    // Big Five insights
    if (bigFive) {
      if (bigFive.openness >= 70 && bigFive.conscientiousness >= 70) {
        insights.push({
          id: "innovation-execution",
          category: "strength",
          title: "Innovador Ejecutor",
          description:
            "Tu combinación de alta creatividad y responsabilidad es rara y valiosa. Puedes generar ideas innovadoras y ejecutarlas efectivamente.",
          relevantTraits: ["Alta Apertura", "Alta Responsabilidad"],
          actionable: true,
          confidence: 90,
        })
      }

      if (bigFive.neuroticism <= 30 && bigFive.extraversion >= 60) {
        insights.push({
          id: "natural-leader",
          category: "leadership",
          title: "Líder Natural Estable",
          description:
            "Tu estabilidad emocional combinada con sociabilidad te convierte en un líder natural que otros seguirán con confianza.",
          relevantTraits: ["Estabilidad Emocional", "Alta Extraversión"],
          actionable: true,
          confidence: 85,
        })
      }

      if (bigFive.agreeableness >= 70 && bigFive.conscientiousness >= 70) {
        insights.push({
          id: "reliable-team-player",
          category: "strength",
          title: "Pilar del Equipo",
          description:
            "Tu combinación de cooperación y responsabilidad te convierte en alguien en quien los equipos pueden confiar completamente.",
          relevantTraits: ["Alta Amabilidad", "Alta Responsabilidad"],
          actionable: false,
          confidence: 80,
        })
      }

      // Development areas
      if (bigFive.neuroticism >= 60) {
        insights.push({
          id: "stress-management",
          category: "development",
          title: "Oportunidad de Desarrollo Emocional",
          description:
            "Desarrollar técnicas de manejo del estrés puede mejorar significativamente tu bienestar y efectividad profesional.",
          relevantTraits: ["Manejo del Estrés"],
          actionable: true,
          confidence: 75,
        })
      }

      if (bigFive.extraversion <= 40) {
        insights.push({
          id: "networking-opportunity",
          category: "development",
          title: "Potencial de Networking",
          description:
            "Desarrollar habilidades de networking podría abrir nuevas oportunidades en el mercado profesional chileno.",
          relevantTraits: ["Desarrollo Social"],
          actionable: true,
          confidence: 70,
        })
      }
    }

    return insights.sort((a, b) => b.confidence - a.confidence)
  }
}

// Utility functions
export function loadPersonalityProfile(): PersonalityProfile {
  const profile: PersonalityProfile = {}

  // Load from localStorage (in real app, from API)
  const discResults = localStorage.getItem("discResults")
  if (discResults) {
    profile.disc = JSON.parse(discResults)
  }

  const bigFiveResults = localStorage.getItem("bigFiveResults")
  if (bigFiveResults) {
    const results = JSON.parse(bigFiveResults)
    profile.bigFive = results.results
  }

  return profile
}

export function getPersonalityTags(profile: PersonalityProfile): string[] {
  const tags: string[] = []

  if (profile.disc) {
    tags.push(`DISC: ${profile.disc.primary}${profile.disc.secondary || ""}`)
  }

  if (profile.bigFive) {
    if (profile.bigFive.openness >= 70) tags.push("Alta Creatividad")
    if (profile.bigFive.conscientiousness >= 70) tags.push("Alta Responsabilidad")
    if (profile.bigFive.extraversion >= 70) tags.push("Alta Sociabilidad")
    if (profile.bigFive.agreeableness >= 70) tags.push("Alta Colaboración")
    if (profile.bigFive.neuroticism <= 30) tags.push("Estabilidad Emocional")
  }

  return tags
}

export function getPersonalitySummary(profile: PersonalityProfile): string {
  let summary = "Perfil de personalidad profesional: "

  if (profile.disc) {
    const primary = profile.disc.primary
    if (primary === "D") summary += "Líder natural orientado a resultados"
    else if (primary === "I") summary += "Comunicador influyente y colaborativo"
    else if (primary === "S") summary += "Profesional estable y confiable"
    else if (primary === "C") summary += "Analista detallado y sistemático"
  }

  if (profile.bigFive) {
    const traits = []
    if (profile.bigFive.openness >= 70) traits.push("creativo")
    if (profile.bigFive.conscientiousness >= 70) traits.push("organizado")
    if (profile.bigFive.extraversion >= 70) traits.push("sociable")
    if (profile.bigFive.agreeableness >= 70) traits.push("colaborativo")
    if (profile.bigFive.neuroticism <= 30) traits.push("emocionalmente estable")

    if (traits.length > 0) {
      summary += ` con características ${traits.join(", ")}`
    }
  }

  summary += ". Ideal para roles que aprovechen estas fortalezas naturales."

  return summary
}
