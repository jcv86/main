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

  // New categories from pages 61-63
  autoconocimiento_proposito: {
    id: "autoconocimiento_proposito",
    name: "Autoconocimiento y Propósito",
    coach: "sofia",
    description: "Ayudar al usuario a identificar fortalezas, intereses y valores",
    promptBase: "Me siento perdido con mi carrera, ¿cómo descubro qué me gusta?",
    exampleResponse:
      "Es totalmente normal sentirse así, sobre todo al inicio. Te propongo tres pasos simples: 1) reflexiona sobre las tareas que más disfrutaste, 2) revisa tus logros y en qué habilidades se repiten, y 3) usa el test DISC de DTC para identificar tu estilo natural. ¿Quieres que lo hagamos juntos?",
  },

  cv_linkedin_marca: {
    id: "cv_linkedin_marca",
    name: "CV, LinkedIn y Marca Personal",
    coach: "dani",
    description: "Mejorar presentación profesional y visibilidad",
    promptBase: "Quiero mejorar mi CV, no sé por dónde partir.",
    exampleResponse:
      "Perfecto. Haz esto: 1) Define el cargo objetivo, 2) Revisa tu CV actual y elimina datos irrelevantes (como RUT o dirección), 3) Añade logros medibles. Si quieres puedo analizar tu CV y sugerirte keywords según tu industria.",
  },

  entrevistas_comunicacion: {
    id: "entrevistas_comunicacion",
    name: "Entrevistas y Comunicación",
    coach: "hybrid", // Can use both Sofia and Dani
    description: "Preparar y practicar respuestas efectivas",
    promptBase: {
      sofia:
        "Respira, es normal. Podemos practicarlo. ¿Te hablo tres preguntas típicas (¿háblame de ti, fortalezas, debilidades?) y te daré feedback después. ¿Empezamos?",
      dani: "Excelente. Confirmaré una simulación enfocada en análisis de datos y pensamiento crítico. Te haré 5 preguntas y luego recibirás tu score por competencia.",
    },
  },

  crecimiento_salarial: {
    id: "crecimiento_salarial",
    name: "Crecimiento Profesional y Aumento Salarial",
    coach: "hybrid",
    description: "Guiar decisiones de desarrollo y negociación",
    promptBase: "Quiero pedir un aumento de sueldo pero me da miedo.",
    exampleResponse: {
      sofia:
        "Es totalmente válido sentir miedo. Ensayemos cómo podrías plantearlo. Primero, enfócate en logros concretos, luego en cómo has aportado valor. Si quieres, puedo ayudarte a mapear tus opciones en base a tu perfil y remuneración actual.",
      dani: "Ok. Vamos directo al plan: 1) Lista tus logros medibles, 2) revisa rangos salariales del mercado, 3) agenda la conversación en un momento de evaluación. Te puedo generar una plantilla para estructurarlo.",
    },
  },

  reinvencion_transicion: {
    id: "reinvencion_transicion",
    name: "Reinvención y Transición de Carrera",
    coach: "hybrid",
    description: "Acompañar procesos de cambio y reconversión profesional",
    promptBase: "No me gusta mi carrera, ¿debería cambiarme?",
    exampleResponse: {
      sofia:
        "Esa pregunta muestra autoconciencia. Veamos juntos: ¿es ahora el contenido o el entorno laboral? Si quieres, puedo ayudarte a mapear tus opciones en base a tu perfil y remuneración actual.",
      dani: "Analicémoslo estratégicamente. Primero define qué te motiva, luego identifica habilidades transferibles y revisa las áreas donde puedes reinsertarte. Te puedo sugerir rutas de reconversión según tu industria.",
    },
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
