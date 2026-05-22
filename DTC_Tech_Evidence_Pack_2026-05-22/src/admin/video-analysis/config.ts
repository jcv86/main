export type AnalysisType = "general" | "test" | "security" | "content" | "behavioral"

interface AnalysisConfig {
  label: string
  description: string
  prompt: string
  extractQuestions: boolean
}

export const ANALYSIS_TYPES: Record<AnalysisType, AnalysisConfig> = {
  general: {
    label: "Contenido General",
    description: "Análisis general del contenido, temas principales y contexto",
    prompt: `Analiza este video y proporciona:
1. Resumen general del contenido
2. Temas principales tratados
3. Puntos clave y hallazgos
4. Duración aproximada de segmentos importantes
5. Conclusiones relevantes

Sé conciso pero detallado.`,
    extractQuestions: false,
  },
  test: {
    label: "Tests/Entrevistas",
    description: "Extrae preguntas, respuestas y patrón de respuestas",
    prompt: `Analiza este video de test/entrevista y extrae:
1. Lista de preguntas formuladas
2. Respuestas dadas para cada pregunta
3. Patrón de respuestas y conclusiones
4. Tipo de prueba o evaluación
5. Puntuación o clasificación si aplica

Formatea las preguntas y respuestas de manera clara y estructurada.`,
    extractQuestions: true,
  },
  security: {
    label: "Análisis de Seguridad",
    description: "Verifica vulnerabilidades, comportamientos sospechosos o riesgos",
    prompt: `Revisa este video buscando:
1. Comportamientos o actividades sospechosas
2. Potenciales vulnerabilidades de seguridad
3. Áreas de riesgo identificadas
4. Recomendaciones de seguridad
5. Nivel de riesgo general

Sé específico con las ubicaciones temporales de los problemas.`,
    extractQuestions: false,
  },
  content: {
    label: "Análisis de Contenido",
    description: "Evalúa calidad, relevancia y adecuación del contenido",
    prompt: `Analiza la calidad y relevancia del contenido:
1. Calidad general de la producción
2. Coherencia y estructura del mensaje
3. Claridad de la comunicación
4. Elementos de engagement
5. Áreas de mejora

Proporciona una evaluación objetiva.`,
    extractQuestions: false,
  },
  behavioral: {
    label: "Análisis de Comportamiento",
    description: "Identifica patrones de comportamiento, lenguaje corporal y comunicación",
    prompt: `Analiza el comportamiento observado en el video:
1. Patrones de comunicación
2. Lenguaje corporal y gestos clave
3. Tono de voz y énfasis
4. Reacciones emocionales observadas
5. Conclusiones sobre personalidad o intención

Sé observador pero objetivo.`,
    extractQuestions: false,
  },
}
