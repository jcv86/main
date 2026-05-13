import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      message,
      conversationHistory,
      userEmail,
      testType,
      testResults,
      currentStage,
      completedStages,
      userSituations,
      userGoals,
    } = body

    // Construir contexto segun la etapa actual
    const stageContext = getStageContext(currentStage, testType, testResults, userSituations, userGoals)

    // Determinar coach segun etapa
    const coach = currentStage === "resultados" || currentStage === "situaciones" ? "sofia" : "dani"

    const systemPrompt = `Eres ${coach === "sofia" ? "Sofía" : "Dani"}, coach de desarrollo personal de Despega Tu Carrera.

ETAPA ACTUAL: ${currentStage.toUpperCase()}
${stageContext}

CONTEXTO DEL USUARIO:
- Test completado: ${testType}
- Resultados: ${JSON.stringify(testResults).substring(0, 500)}
${userSituations.length > 0 ? `- Situaciones identificadas: ${userSituations.join(", ")}` : ""}
${userGoals.length > 0 ? `- Metas definidas: ${userGoals.join(", ")}` : ""}

INSTRUCCIONES:
1. Mantén la conversación enfocada en la etapa actual
2. Sé empático, cálido y profesional
3. Haz preguntas que ayuden a profundizar
4. Cuando detectes información relevante, extráela (situaciones, metas, recursos)
5. Sugiere pasar a la siguiente etapa cuando la actual esté completa
6. Usa ejemplos concretos relacionados con los resultados del test
7. Responde en español, de forma conversacional pero profesional
8. Máximo 150 palabras por respuesta`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory.map((m: any) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          { role: "user" as const, content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API error: ${error}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ""

    if (!text) {
      throw new Error("No response content from OpenAI")
    }

    // Analizar respuesta para extraer información
    const analysis = analyzeResponse(message, text, currentStage)

    return NextResponse.json({
      response: text,
      coach,
      extractedSituations: analysis.situations,
      extractedGoals: analysis.goals,
      recommendedResources: analysis.resources,
      suggestNextStage: analysis.suggestNext,
    })
  } catch (error) {
    console.error("[v0] Enhanced coach error:", error)
    return NextResponse.json({ error: "Error processing request" }, { status: 500 })
  }
}

function getStageContext(
  stage: string,
  testType: string,
  testResults: any,
  userSituations: string[],
  userGoals: string[],
): string {
  const contexts: Record<string, string> = {
    resultados: `
OBJETIVO DE ESTA ETAPA:
- Ayudar al usuario a entender sus resultados del test ${testType}
- Explorar fortalezas y áreas de mejora identificadas
- Resolver dudas sobre el significado de las dimensiones
- Generar insights personalizados

PREGUNTAS GUÍA:
- ¿Qué te sorprendió de tus resultados?
- ¿Cómo se reflejan estos resultados en tu día a día?
- ¿Qué fortaleza te gustaría potenciar?`,

    situaciones: `
OBJETIVO DE ESTA ETAPA:
- Identificar situaciones reales donde el usuario pueda aplicar sus aprendizajes
- Explorar contextos laborales, personales y relacionales
- Detectar conflictos o desafíos actuales
- Conectar los resultados del test con situaciones concretas

PREGUNTAS GUÍA:
- ¿En qué situación laboral te gustaría mejorar?
- ¿Hay alguna relación que te gustaría fortalecer?
- ¿Qué conversación difícil tienes pendiente?`,

    metas: `
OBJETIVO DE ESTA ETAPA:
- Definir metas SMART basadas en los resultados y situaciones
- Crear objetivos medibles a 30, 60 y 90 días
- Identificar hábitos a desarrollar
- Establecer indicadores de éxito

SITUACIONES YA IDENTIFICADAS: ${userSituations.join(", ") || "Ninguna aún"}

PREGUNTAS GUÍA:
- ¿Qué quieres lograr en los próximos 30 días?
- ¿Cómo sabrás que has mejorado?
- ¿Qué hábito te ayudaría más?`,

    recursos: `
OBJETIVO DE ESTA ETAPA:
- Recomendar libros, podcasts, videos y ejercicios personalizados
- Adaptar recomendaciones al estilo de aprendizaje del usuario
- Conectar recursos con las metas definidas
- Crear un plan de consumo de contenido

METAS DEFINIDAS: ${userGoals.join(", ") || "Ninguna aún"}

RECURSOS DISPONIBLES EN DTC:
- Biblioteca de +50 libros de desarrollo personal
- Módulo de simulaciones (entrevistas, conversaciones difíciles)
- Plan de 90 días personalizado`,

    simulacion: `
OBJETIVO DE ESTA ETAPA:
- Practicar situaciones reales mediante role-play
- Simular entrevistas de trabajo
- Practicar conversaciones difíciles
- Desarrollar habilidades en un entorno seguro

SITUACIONES IDENTIFICADAS: ${userSituations.join(", ") || "Ninguna aún"}

TIPOS DE SIMULACIÓN:
1. Entrevista de trabajo (técnica, conductual, case study)
2. Conversación con jefe (pedir aumento, dar feedback, renunciar)
3. Conversación con pareja/familia (establecer límites, resolver conflictos)
4. Negociación (salario, plazos, recursos)`,

    seguimiento: `
OBJETIVO DE ESTA ETAPA:
- Crear un plan de seguimiento a 30 días
- Establecer checkpoints de revisión
- Configurar recordatorios y notificaciones
- Preparar el re-test para medir evolución

METAS DEFINIDAS: ${userGoals.join(", ") || "Ninguna aún"}

OPCIONES DE SEGUIMIENTO:
- Revisión semanal (15 min)
- Revisión quincenal (30 min)
- Re-test a los 30 días
- Tips diarios por email`,
  }

  return contexts[stage] || ""
}

function analyzeResponse(
  userMessage: string,
  aiResponse: string,
  currentStage: string,
): {
  situations: string[]
  goals: string[]
  resources: string[]
  suggestNext: boolean
} {
  const result = {
    situations: [] as string[],
    goals: [] as string[],
    resources: [] as string[],
    suggestNext: false,
  }

  // Detectar situaciones en mensaje del usuario
  if (currentStage === "situaciones") {
    const situationKeywords = [
      "trabajo",
      "jefe",
      "equipo",
      "conflicto",
      "conversación",
      "relación",
      "pareja",
      "familia",
    ]
    const sentences = userMessage.split(/[.!?]/)
    sentences.forEach((sentence) => {
      if (situationKeywords.some((kw) => sentence.toLowerCase().includes(kw)) && sentence.length > 20) {
        result.situations.push(sentence.trim())
      }
    })
  }

  // Detectar metas en mensaje del usuario
  if (currentStage === "metas") {
    const goalKeywords = ["quiero", "objetivo", "meta", "lograr", "mejorar", "desarrollar", "aprender"]
    const sentences = userMessage.split(/[.!?]/)
    sentences.forEach((sentence) => {
      if (goalKeywords.some((kw) => sentence.toLowerCase().includes(kw)) && sentence.length > 15) {
        result.goals.push(sentence.trim())
      }
    })
  }

  // Detectar recursos recomendados en respuesta de IA
  if (currentStage === "recursos") {
    const resourceKeywords = ["libro", "recomiendo", "podcast", "video", "ejercicio", "recurso"]
    if (resourceKeywords.some((kw) => aiResponse.toLowerCase().includes(kw))) {
      // Extraer nombres de recursos mencionados
      const resourcePattern = /"([^"]+)"|«([^»]+)»|'([^']+)'/g
      let match
      while ((match = resourcePattern.exec(aiResponse)) !== null) {
        const resource = match[1] || match[2] || match[3]
        if (resource && resource.length > 3) {
          result.resources.push(resource)
        }
      }
    }
  }

  // Sugerir siguiente etapa si la conversación parece completa
  const completionIndicators = ["perfecto", "excelente", "muy bien", "entendido", "claro", "siguiente"]
  if (completionIndicators.some((ind) => aiResponse.toLowerCase().includes(ind))) {
    result.suggestNext = true
  }

  return result
}
