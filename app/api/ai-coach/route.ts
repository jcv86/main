import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { message, userEmail, testResults, conversationHistory } = await request.json()

    console.log("🤖 AI Coach API called with:", {
      message: message?.substring(0, 100),
      userEmail,
      testResultsCount: testResults?.length || 0,
      historyLength: conversationHistory?.length || 0,
    })

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build context from test results
    let context = `Eres un coach profesional especializado en desarrollo de carrera y análisis psicométrico. 
    
Usuario: ${userEmail}
Tests completados: ${testResults?.length || 0}

`

    if (testResults && testResults.length > 0) {
      context += "Resultados de tests del usuario:\n"
      testResults.forEach((result: any) => {
        context += `- ${result.test_type}: ${result.score}% (completado el ${result.completed_at})\n`
      })
      context += "\n"
    }

    context += `Proporciona consejos personalizados, prácticos y profesionales. Mantén un tono amigable pero profesional.
    Si el usuario pregunta sobre desarrollo profesional, usa sus resultados de tests para dar recomendaciones específicas.
    
Conversación actual:`

    // Build messages array for AI
    const messages = [
      {
        role: "system" as const,
        content: context,
      },
    ]

    // Add conversation history (last 5 messages)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.slice(-5).forEach((msg: any) => {
        if (msg.type === "user") {
          messages.push({ role: "user" as const, content: msg.content })
        } else if (msg.type === "ai") {
          messages.push({ role: "assistant" as const, content: msg.content })
        }
      })
    }

    // Add current message
    messages.push({ role: "user" as const, content: message })

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log("⚠️ OpenAI API key not available, using fallback response")
      return NextResponse.json({
        response: generateFallbackResponse(message, testResults),
        suggestions: generateSuggestions(message, testResults),
        fallback: true,
      })
    }

    try {
      console.log("🔄 Calling OpenAI API...")

      const { text } = await generateText({
        model: openai("gpt-4o"),
        messages,
        temperature: 0.7,
        maxTokens: 800,
      })

      console.log("✅ OpenAI response received")

      return NextResponse.json({
        response: text,
        suggestions: generateSuggestions(message, testResults),
        success: true,
      })
    } catch (aiError) {
      console.error("❌ OpenAI API error:", aiError)

      return NextResponse.json({
        response: generateFallbackResponse(message, testResults),
        suggestions: generateSuggestions(message, testResults),
        fallback: true,
      })
    }
  } catch (error) {
    console.error("❌ Error in AI coach API:", error)

    return NextResponse.json({
      response: "Lo siento, hubo un error procesando tu consulta. Por favor, intenta reformular tu pregunta.",
      suggestions: [
        "¿Cuáles son mis fortalezas?",
        "¿Qué habilidades debo desarrollar?",
        "¿Cómo puedo mejorar mi carrera?",
      ],
      error: true,
    })
  }
}

function generateFallbackResponse(message: string, testResults: any[]): string {
  const lowerMessage = message.toLowerCase()

  // Analyze test results for context
  const hasDisc = testResults?.some((r) => r.test_type === "disc")
  const hasBigFive = testResults?.some((r) => r.test_type === "big-five")
  const hasMbti = testResults?.some((r) => r.test_type === "mbti")
  const hasRiasec = testResults?.some((r) => r.test_type === "riasec")
  const hasSoftSkills = testResults?.some((r) => r.test_type === "soft-skills")

  const avgScore =
    testResults?.length > 0
      ? Math.round(testResults.reduce((sum, r) => sum + (r.score || 0), 0) / testResults.length)
      : 0

  // Fortalezas
  if (lowerMessage.includes("fortaleza") || lowerMessage.includes("fuerte") || lowerMessage.includes("bueno")) {
    let response = "🌟 **Análisis de Fortalezas:**\n\n"

    if (testResults?.length > 0) {
      response += `Basándome en tus ${testResults.length} evaluaciones completadas (promedio: ${avgScore}%), he identificado estas fortalezas clave:\n\n`

      if (hasDisc)
        response += "• **Comunicación y Liderazgo**: Tu perfil DISC muestra habilidades naturales de comunicación\n"
      if (hasBigFive) response += "• **Estabilidad Emocional**: Demuestras buen equilibrio en situaciones desafiantes\n"
      if (hasMbti) response += "• **Procesamiento de Información**: Tienes un estilo claro para tomar decisiones\n"
      if (hasRiasec) response += "• **Claridad Vocacional**: Conoces tus intereses profesionales\n"
      if (hasSoftSkills) response += "• **Competencias Interpersonales**: Tienes habilidades blandas desarrolladas\n"

      response += "\n**Recomendaciones:**\n"
      response += "• Busca roles que aprovechen estas fortalezas naturales\n"
      response += "• Considera oportunidades de mentoría o liderazgo\n"
      response += "• Desarrolla estas fortalezas aún más con práctica deliberada\n"
    } else {
      response +=
        "Para identificar tus fortalezas específicas, te recomiendo completar algunas evaluaciones. Esto me permitirá darte un análisis más personalizado.\n\n"
      response += "**Mientras tanto, reflexiona sobre:**\n"
      response += "• ¿En qué actividades destacas naturalmente?\n"
      response += "• ¿Qué feedback positivo recibes frecuentemente?\n"
      response += "• ¿Qué tareas realizas con facilidad?\n"
    }

    return response
  }

  // Desarrollo y mejora
  if (lowerMessage.includes("desarrollar") || lowerMessage.includes("mejorar") || lowerMessage.includes("crecer")) {
    let response = "🎯 **Plan de Desarrollo Personalizado:**\n\n"

    if (testResults?.length > 0) {
      response += "**Estrategia basada en tus resultados:**\n\n"

      if (avgScore >= 80) {
        response += "Con tu excelente desempeño promedio, enfócate en:\n"
        response += "• **Liderazgo Avanzado**: Desarrolla habilidades de liderazgo estratégico\n"
        response += "• **Mentoría**: Comparte tu conocimiento con otros\n"
        response += "• **Especialización**: Profundiza en áreas de expertise\n"
      } else if (avgScore >= 60) {
        response += "Con tu sólida base, te recomiendo:\n"
        response += "• **Comunicación Avanzada**: Mejora presentaciones y negociación\n"
        response += "• **Gestión del Tiempo**: Optimiza tu productividad\n"
        response += "• **Inteligencia Emocional**: Desarrolla habilidades interpersonales\n"
      } else {
        response += "Para acelerar tu desarrollo:\n"
        response += "• **Fundamentos**: Fortalece habilidades básicas de comunicación\n"
        response += "• **Autoconocimiento**: Completa más evaluaciones para claridad\n"
        response += "• **Práctica Deliberada**: Enfócate en 1-2 habilidades clave\n"
      }

      response += "\n**Plan de Acción (próximos 90 días):**\n"
      response += "1. **Semanas 1-2**: Identifica 2 habilidades prioritarias\n"
      response += "2. **Semanas 3-8**: Práctica diaria de 30 minutos\n"
      response += "3. **Semanas 9-12**: Aplica en proyectos reales y mide progreso\n"
    } else {
      response += "**Áreas universales de desarrollo profesional:**\n\n"
      response += "• **Comunicación**: Presentaciones, escritura, escucha activa\n"
      response += "• **Liderazgo**: Influencia, delegación, toma de decisiones\n"
      response += "• **Adaptabilidad**: Gestión del cambio, aprendizaje continuo\n"
      response += "• **Colaboración**: Trabajo en equipo, resolución de conflictos\n"
      response += "\n**Primer paso**: Completa evaluaciones para un plan más específico.\n"
    }

    return response
  }

  // Carrera profesional
  if (lowerMessage.includes("carrera") || lowerMessage.includes("trabajo") || lowerMessage.includes("profesional")) {
    let response = "🚀 **Orientación de Carrera Personalizada:**\n\n"

    if (hasRiasec) {
      response += "**Basado en tu evaluación RIASEC:**\n"
      response += "• Tienes intereses claros que pueden guiar tu carrera\n"
      response += "• Considera roles que alineen con tu código Holland\n"
      response += "• Explora industrias que valoren tus intereses naturales\n\n"
    }

    if (testResults?.length >= 2) {
      response += "**Tu perfil multidimensional sugiere:**\n"
      response += "• Roles híbridos que combinen múltiples habilidades\n"
      response += "• Posiciones de liderazgo o consultoría\n"
      response += "• Oportunidades en organizaciones innovadoras\n\n"
    }

    response += "**Próximos pasos recomendados:**\n"
    response += "1. **Networking**: Conecta con profesionales en roles de interés\n"
    response += "2. **Investigación**: Explora tendencias en tu industria\n"
    response += "3. **Desarrollo**: Identifica gaps de habilidades para tus objetivos\n"
    response += "4. **Experiencia**: Busca proyectos o voluntariados relevantes\n\n"

    if (testResults?.length < 3) {
      response += "💡 **Tip**: Completa más evaluaciones para recomendaciones más específicas de carrera.\n"
    }

    return response
  }

  // Respuesta general
  return `¡Hola! Como tu AI Coach, estoy aquí para ayudarte con tu desarrollo profesional.

${
  testResults?.length > 0
    ? `He revisado tus ${testResults.length} evaluación(es) completada(s) con un promedio de ${avgScore}%.`
    : "Una vez que completes algunas evaluaciones, podré darte consejos más personalizados."
}

**Puedo ayudarte con:**
• Análisis de fortalezas y áreas de desarrollo
• Planificación de carrera y objetivos profesionales  
• Recomendaciones de habilidades a desarrollar
• Estrategias de crecimiento personalizado

**¿En qué te gustaría enfocarte hoy?**

Puedes preguntarme cosas como:
• "¿Cuáles son mis principales fortalezas?"
• "¿Qué habilidades debería desarrollar?"
• "¿Cómo puedo avanzar en mi carrera?"
• "¿Qué roles se adaptan a mi perfil?"`
}

function generateSuggestions(message: string, testResults: any[]): string[] {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("fortaleza")) {
    return [
      "¿Cómo puedo aprovechar mejor mis fortalezas?",
      "¿Qué roles se adaptan a mi perfil?",
      "¿Cómo puedo desarrollar mis fortalezas aún más?",
    ]
  }

  if (lowerMessage.includes("desarrollar") || lowerMessage.includes("mejorar")) {
    return [
      "¿Qué cursos me recomiendas?",
      "¿Cómo puedo practicar estas habilidades?",
      "¿Cuál debería ser mi próximo paso?",
    ]
  }

  if (lowerMessage.includes("carrera")) {
    return [
      "¿Qué industrias se adaptan a mi perfil?",
      "¿Cómo puedo hacer networking efectivo?",
      "¿Qué certificaciones me ayudarían?",
    ]
  }

  // Default suggestions based on test completion
  if (testResults?.length >= 3) {
    return [
      "Crea un plan de desarrollo personalizado",
      "¿Qué oportunidades de liderazgo me recomiendas?",
      "¿Cómo puedo optimizar mi perfil profesional?",
    ]
  } else if (testResults?.length > 0) {
    return [
      "¿Qué otros tests debería completar?",
      "Analiza mis resultados actuales",
      "¿Cómo puedo mejorar mi puntuación?",
    ]
  } else {
    return [
      "¿Qué test debería hacer primero?",
      "¿Cómo funcionan las evaluaciones?",
      "¿Qué beneficios tienen los tests psicométricos?",
    ]
  }
}
