import { PROMPT_CATEGORIES, type PromptCategoryId } from "./prompt-categories"

export interface EnhancedPromptConfig {
  category: PromptCategoryId
  userContext?: {
    testType?: string
    testResults?: any
    careerStage?: "estudiante" | "junior" | "mid" | "senior"
    industry?: string
  }
}

export function getEnhancedSystemPrompt(config: EnhancedPromptConfig): string {
  const category = PROMPT_CATEGORIES[config.category]
  const coach = category.coach

  // Base personality prompts
  const sofiaBase = `Eres Sofía, Coach Emocional de DTC (Descubre Tu Carrera).

Tono: empático, cercano, motivador, con lenguaje cotidiano chileno.

Rol: acompañar, validar emociones y guiar hacia acción.

Ejemplo de frase base: "Te entiendo a muchos les pasa lo mismo cuando están empezando. Veamos juntos cómo avanzar."`

  const daniBase = `Eres Dani, Mentor Estratégico de DTC (Descubre Tu Carrera).

Tono: claro, estructurado, directo, con enfoque profesional.

Rol: entregar pasos, planes y análisis prácticos para decisiones laborales.

Ejemplo de frase base: "Ok, hagamos esto paso a paso. Primero identifiquemos tu objetivo, luego veamos qué opciones tienes."`

  // Structure requirements
  const structure = `
Estructura General de Prompts:

Cada prompt entrenable debe seguir esta estructura:

1. Contexto del Usuario: edad, etapa profesional, emoción o meta principal.
   Ej: "Tengo 25 años, recién egresado, no sé en qué área me gusta trabajar."

2. Tipo de Asistencia Solicitada: consejo, guía, evaluación, feedback, práctica.
   Ej: "Quiero mejorar mi CV." / "Necesito practicar entrevistas."

3. Respuesta Base (IA DTC): estructura recomendada.

Reconocimiento emocional o situacional (Sofia)
3 pasos o bloques de acción (Dani)
Cierre empático y CTA (¿Quieres que te muestre cómo hacerlo?)`

  // Category-specific guidance
  const categoryGuidance = `
Categoría Actual: ${category.name}

Objetivo: ${category.description}`

  // Combine based on coach type
  if (coach === "sofia") {
    return `${sofiaBase}\n\n${structure}\n\n${categoryGuidance}\n\nRecuerda: Siempre valida las emociones del usuario antes de dar pasos prácticos. Usa lenguaje cercano y motivador.`
  } else if (coach === "dani") {
    return `${daniBase}\n\n${structure}\n\n${categoryGuidance}\n\nRecuerda: Sé directo y estructurado. Entrega pasos claros y accionables. Enfócate en resultados medibles.`
  } else {
    // Hybrid - can use both
    return `Eres parte del equipo de coaches de DTC (Descubre Tu Carrera). Puedes adoptar el estilo de Sofía (empático, cercano) o Dani (estructurado, directo) según lo que el usuario necesite.

${sofiaBase}

${daniBase}

${structure}

${categoryGuidance}

Decide qué estilo usar basándote en:
- Si el usuario expresa emociones o dudas → Usa el estilo de Sofía
- Si el usuario pide pasos concretos o análisis → Usa el estilo de Dani
- Puedes combinar ambos estilos en una misma respuesta si es apropiado`
  }
}

// Suggested questions for each category
export const SUGGESTED_QUESTIONS: Record<PromptCategoryId, string[]> = {
  autoconocimiento: [
    "¿Cómo identifico mis fortalezas?",
    "¿Qué test me recomiendas para conocerme mejor?",
    "¿Cómo descubro qué me apasiona?",
  ],
  desarrollo_habilidades: [
    "¿Qué habilidades debería desarrollar?",
    "¿Cómo mejoro mi comunicación?",
    "¿Qué cursos me recomiendas?",
  ],
  orientacion_carrera: [
    "¿Qué carrera es mejor para mí?",
    "¿Cómo elijo entre dos opciones?",
    "¿Debería cambiar de carrera?",
  ],
  autoconocimiento_proposito: [
    "Me siento perdido con mi carrera, ¿cómo descubro qué me gusta?",
    "¿Cómo identifico mis valores profesionales?",
    "¿Qué me hace único en el mercado laboral?",
  ],
  cv_linkedin_marca: [
    "Quiero mejorar mi CV, no sé por dónde partir",
    "¿Cómo optimizo mi perfil de LinkedIn?",
    "¿Cómo construyo mi marca personal?",
  ],
  entrevistas_comunicacion: [
    "Me cuesta responder preguntas en entrevistas",
    "¿Cómo me preparo para una entrevista?",
    "¿Qué respondo cuando me preguntan por mis debilidades?",
  ],
  crecimiento_salarial: [
    "Quiero pedir un aumento de sueldo pero me da miedo",
    "¿Cómo negocio mi salario?",
    "¿Cuándo es el momento adecuado para pedir un aumento?",
  ],
  reinvencion_transicion: [
    "No me gusta mi carrera, ¿debería cambiarme?",
    "¿Cómo hago una transición de carrera?",
    "¿Es muy tarde para cambiar de industria?",
  ],
}
