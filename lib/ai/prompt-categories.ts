export const PROMPT_CATEGORIES = {
  // Existing categories
  autoconocimiento: {
    id: "autoconocimiento",
    name: "Autoconocimiento",
    coach: "sofia",
    description: "Identificar fortalezas, intereses y valores",
  },
  desarrollo_habilidades: {
    id: "desarrollo_habilidades",
    name: "Desarrollo de Habilidades",
    coach: "dani",
    description: "Mejorar habilidades profesionales",
  },
  orientacion_carrera: {
    id: "orientacion_carrera",
    name: "Orientación de Carrera",
    coach: "dani",
    description: "Guiar decisiones de carrera",
  },

  autoconocimiento_proposito: {
    id: "autoconocimiento_proposito",
    name: "Autoconocimiento y Propósito",
    coach: "sofia",
    description:
      "Descubre tu perfil con 6 tests psicométricos: DISC, MBTI, Big Five, RIASEC, Soft Skills e Inteligencia Emocional. Sofía analiza tus resultados contigo.",
  },

  cv_linkedin_marca: {
    id: "cv_linkedin_marca",
    name: "CV, LinkedIn y Marca Personal",
    coach: "dani",
    description:
      "Mejora tu presentación profesional con estrategias prácticas. Dani te da feedback estructurado y tips accionables para destacar.",
  },

  entrevistas_comunicacion: {
    id: "entrevistas_comunicacion",
    name: "Entrevistas y Comunicación",
    coach: "hybrid",
    description:
      "Practica respuestas a entrevistas y mejora tu comunicación. Sofía te da soporte emocional, Dani te entrena con simulaciones.",
  },

  crecimiento_salarial: {
    id: "crecimiento_salarial",
    name: "Crecimiento Profesional y Aumento Salarial",
    coach: "hybrid",
    description:
      "Planifica tu crecimiento profesional y negocia aumentos. Accede a data del mercado chileno y estrategias comprobadas.",
  },

  reinvencion_transicion: {
    id: "reinvencion_transicion",
    name: "Reinvención y Transición de Carrera",
    coach: "hybrid",
    description:
      "Cambia de carrera o industria con un plan claro. Usa tus tests y biblioteca de 120+ libros para explorar nuevas rutas profesionales.",
  },
} as const

export type PromptCategoryId = keyof typeof PROMPT_CATEGORIES

export interface TrainingFormat {
  tone: "empático" | "cercano" | "motivador" | "claro" | "estructurado" | "directo" | "profesional"
  recommendedCoach: "sofia" | "dani" | "híbrido"
  response: string // editable
  metrics: {
    engagement: number // messages count
    satisfaction: number // 1-5 stars
    actionCompleted: boolean
  }
}

export interface PromptRegistry {
  category: PromptCategoryId
  userPrompt: string
  coachResponse: string
  format: TrainingFormat
  timestamp: string
}
