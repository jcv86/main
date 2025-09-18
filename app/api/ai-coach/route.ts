import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { message, userEmail, testResults, conversationHistory, context } = await request.json()

    console.log("🤖 Enhanced AI Coach API called with:", {
      message: message?.substring(0, 100),
      userEmail,
      testResultsCount: testResults?.length || 0,
      historyLength: conversationHistory?.length || 0,
      hasContext: !!context,
    })

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Enhanced context building with user profile
    let enhancedContext = `Eres un AI Coach profesional especializado en desarrollo de carrera y análisis psicométrico. 
    
Usuario: ${userEmail}
Tests completados: ${testResults?.length || 0}
Nivel de experiencia: ${context?.skillLevel || "Principiante"}
Objetivos actuales: ${context?.currentGoals?.join(", ") || "No definidos"}
Intereses: ${context?.interests?.join(", ") || "Generales"}
Estilo de aprendizaje: ${context?.preferredLearningStyle || "No especificado"}

`

    // Add test results analysis
    if (testResults && testResults.length > 0) {
      enhancedContext += "Resultados de tests del usuario:\n"
      testResults.forEach((result: string) => {
        enhancedContext += `- ${getTestName(result)}: Completado\n`
      })
      enhancedContext += "\n"
    }

    // Add personalized coaching instructions
    enhancedContext += `INSTRUCCIONES ESPECIALES:
1. Sé proactivo y ofrece recomendaciones específicas
2. Sugiere libros de la biblioteca de conocimiento cuando sea relevante
3. Recomienda tests adicionales basados en el progreso del usuario
4. Proporciona insights accionables y específicos
5. Mantén un tono motivacional pero profesional
6. Incluye métricas y objetivos medibles cuando sea posible
7. Conecta las recomendaciones con los objetivos del usuario

Si el usuario pregunta sobre:
- Desarrollo profesional: Usa sus resultados de tests para dar recomendaciones específicas
- Libros o recursos: Sugiere contenido de la biblioteca de conocimiento
- Tests: Recomienda evaluaciones basadas en su progreso actual
- Habilidades: Proporciona planes de desarrollo estructurados

Conversación actual:`

    // Build messages array for AI
    const messages = [
      {
        role: "system" as const,
        content: enhancedContext,
      },
    ]

    // Add conversation history (last 5 messages)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.slice(-5).forEach((msg: any) => {
        if (msg.role === "user") {
          messages.push({ role: "user" as const, content: msg.content })
        } else if (msg.role === "assistant") {
          messages.push({ role: "assistant" as const, content: msg.content })
        }
      })
    }

    // Add current message
    messages.push({ role: "user" as const, content: message })

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log("⚠️ OpenAI API key not available, using enhanced fallback response")
      return NextResponse.json({
        response: generateEnhancedFallbackResponse(message, testResults, context),
        suggestions: generateEnhancedSuggestions(message, testResults, context),
        recommendations: generateProactiveRecommendations(testResults, context),
        fallback: true,
      })
    }

    try {
      console.log("🔄 Calling OpenAI API with enhanced context...")

      const { text } = await generateText({
        model: openai("gpt-4o"),
        messages,
        temperature: 0.7,
        maxTokens: 1000,
      })

      console.log("✅ OpenAI response received")

      // Save interaction to database
      try {
        await supabase.from("ai_interactions").insert({
          user_email: userEmail,
          query: message,
          response: text,
          context_used: JSON.stringify(context),
          confidence_score: 0.9,
          created_at: new Date().toISOString(),
        })
      } catch (dbError) {
        console.error("Failed to save interaction:", dbError)
      }

      return NextResponse.json({
        response: text,
        suggestions: generateEnhancedSuggestions(message, testResults, context),
        recommendations: generateProactiveRecommendations(testResults, context),
        success: true,
      })
    } catch (aiError) {
      console.error("❌ OpenAI API error:", aiError)

      return NextResponse.json({
        response: generateEnhancedFallbackResponse(message, testResults, context),
        suggestions: generateEnhancedSuggestions(message, testResults, context),
        recommendations: generateProactiveRecommendations(testResults, context),
        fallback: true,
      })
    }
  } catch (error) {
    console.error("❌ Error in enhanced AI coach API:", error)

    return NextResponse.json({
      response: "Lo siento, hubo un error procesando tu consulta. Por favor, intenta reformular tu pregunta.",
      suggestions: [
        "¿Cuáles son mis fortalezas?",
        "¿Qué habilidades debo desarrollar?",
        "¿Cómo puedo mejorar mi carrera?",
      ],
      recommendations: [],
      error: true,
    })
  }
}

function getTestName(testType: string): string {
  const names = {
    disc: "DISC",
    "big-five": "Big Five",
    mbti: "MBTI",
    riasec: "RIASEC",
    "soft-skills": "Habilidades Blandas",
  }
  return names[testType as keyof typeof names] || testType
}

function generateEnhancedFallbackResponse(message: string, testResults: any[], context: any): string {
  const lowerMessage = message.toLowerCase()
  const completedTests = testResults?.length || 0
  const skillLevel = context?.skillLevel || "Principiante"
  const goals = context?.currentGoals || []

  // Personalized greeting based on context
  let response = `¡Hola! Como tu AI Coach personal, he analizado tu perfil:\n\n`
  response += `📊 **Tu situación actual:**\n`
  response += `• Tests completados: ${completedTests}/5\n`
  response += `• Nivel: ${skillLevel}\n`
  response += `• Objetivos: ${goals.length > 0 ? goals.join(", ") : "Por definir"}\n\n`

  // Context-aware responses
  if (lowerMessage.includes("recomendación") || lowerMessage.includes("sugerir")) {
    if (completedTests < 2) {
      response += `• **Prioridad Alta**: Completa más evaluaciones psicométricas para obtener un perfil completo\n`
      response += `• **Test DISC**: Ideal para entender tu estilo de comunicación\n`
      response += `• **Test RIASEC**: Perfecto para clarificar tus intereses vocacionales\n\n`
    } else {
      response += `• **Desarrollo de Habilidades**: Basado en tus resultados, enfócate en liderazgo y comunicación\n`
      response += `• **Biblioteca de Conocimiento**: Explora libros sobre productividad y desarrollo profesional\n`
      response += `• **Plan de Carrera**: Es momento de crear un plan de desarrollo a 90 días\n\n`
    }
  }

  // Career guidance
  else if (lowerMessage.includes("carrera") || lowerMessage.includes("profesional")) {
    if (completedTests >= 3) {
      response += `Con ${completedTests} evaluaciones completadas, tienes un perfil sólido para:\n`
      response += `• **Roles de Liderazgo**: Tu perfil muestra potencial para posiciones directivas\n`
      response += `• **Consultoría**: Combinas análisis y habilidades interpersonales\n`
      response += `• **Gestión de Proyectos**: Tienes las competencias para coordinar equipos\n\n`
    } else {
      response += `Para darte recomendaciones de carrera más precisas:\n`
      response += `• Completa al menos 3 evaluaciones psicométricas\n`
      response += `• Esto me permitirá identificar tu perfil vocacional único\n`
      response += `• Podremos crear un plan de carrera personalizado\n\n`
    }
  }

  // Skill development
  else if (lowerMessage.includes("habilidad") || lowerMessage.includes("desarrollar")) {
    if (skillLevel === "Principiante") {
      response += `**Fundamentos (Próximos 30 días):**\n`
      response += `• Comunicación efectiva y escucha activa\n`
      response += `• Gestión básica del tiempo y productividad\n`
      response += `• Fundamentos de trabajo en equipo\n\n`
    } else if (skillLevel === "Intermedio") {
      response += `**Habilidades Avanzadas (Próximos 60 días):**\n`
      response += `• Liderazgo de equipos pequeños\n`
      response += `• Presentaciones ejecutivas\n`
      response += `• Resolución de conflictos\n\n`
    } else {
      response += `**Especialización (Próximos 90 días):**\n`
      response += `• Liderazgo estratégico y visión\n`
      response += `• Mentoría y desarrollo de talento\n`
      response += `• Innovación y gestión del cambio\n\n`
    }
  }

  // Book recommendations
  else if (lowerMessage.includes("libro") || lowerMessage.includes("leer")) {
    response += `📚 **Recomendaciones de Lectura:**\n\n`
    response += `**Basado en tu perfil actual:**\n`
    response += `• **"Los 7 Hábitos de la Gente Altamente Efectiva"** - Fundamentos de efectividad personal\n`
    response += `• **"Inteligencia Emocional"** - Desarrollo de habilidades interpersonales\n`
    response += `• **"El Líder que no Tenía Cargo"** - Liderazgo sin autoridad formal\n\n`
    response += `💡 **Tip**: Visita nuestra biblioteca de conocimiento para acceder a estos y más recursos.\n\n`
  }

  // General response
  else {
    response += `🎯 **¿En qué puedo ayudarte hoy?**\n\n`
    response += `Como tu coach personal, puedo asistirte con:\n`
    response += `• **Análisis de tu perfil** y recomendaciones personalizadas\n`
    response += `• **Planificación de carrera** basada en tus fortalezas\n`
    response += `• **Desarrollo de habilidades** con planes estructurados\n`
    response += `• **Recomendaciones de recursos** de nuestra biblioteca\n`
    response += `• **Seguimiento de objetivos** y métricas de progreso\n\n`
  }

  response += `**💬 Pregúntame sobre:**\n`
  response += `• "¿Qué test debería hacer siguiente?"\n`
  response += `• "¿Cómo puedo mejorar mi liderazgo?"\n`
  response += `• "¿Qué libros me recomiendas?"\n`
  response += `• "¿Cuál es mi próximo paso profesional?"\n`

  return response
}

function generateEnhancedSuggestions(message: string, testResults: any[], context: any): string[] {
  const lowerMessage = message.toLowerCase()
  const completedTests = testResults?.length || 0
  const skillLevel = context?.skillLevel || "Principiante"

  if (lowerMessage.includes("recomendación") || lowerMessage.includes("sugerir")) {
    return [
      "¿Qué test me recomiendas hacer siguiente?",
      "¿Cómo puedo crear un plan de desarrollo personalizado?",
      "¿Qué libros se adaptan a mi perfil actual?",
      "¿Cuáles son las mejores prácticas para mi nivel?",
    ]
  }

  if (lowerMessage.includes("carrera")) {
    return [
      "¿Qué roles profesionales se adaptan a mi perfil?",
      "¿Cómo puedo hacer networking efectivo en mi industria?",
      "¿Qué certificaciones me ayudarían más?",
      "¿Cómo puedo negociar un aumento o promoción?",
    ]
  }

  if (lowerMessage.includes("habilidad") || lowerMessage.includes("desarrollar")) {
    return [
      "¿Cómo puedo medir mi progreso en el desarrollo de habilidades?",
      "¿Qué técnicas de práctica deliberada me recomiendas?",
      "¿Cómo puedo encontrar un mentor en mi área?",
      "¿Qué proyectos me ayudarían a crecer profesionalmente?",
    ]
  }

  // Default suggestions based on user level
  if (completedTests >= 3) {
    return [
      "Crea un plan de carrera a 5 años basado en mi perfil",
      "¿Qué oportunidades de liderazgo debería buscar?",
      "¿Cómo puedo optimizar mi marca personal?",
      "¿Qué tendencias de mi industria debería seguir?",
    ]
  } else if (completedTests >= 1) {
    return [
      "¿Qué evaluación debería completar después?",
      "Analiza mis resultados actuales en detalle",
      "¿Cómo puedo aplicar mis fortalezas en el trabajo?",
      "¿Qué áreas de mejora son más importantes?",
    ]
  } else {
    return [
      "¿Por dónde debería empezar mi desarrollo profesional?",
      "¿Qué evaluación me dará más insights iniciales?",
      "¿Cómo puedo establecer objetivos profesionales claros?",
      "¿Qué recursos básicos me recomiendas para comenzar?",
    ]
  }
}

function generateProactiveRecommendations(testResults: any[], context: any) {
  const recommendations = []
  const completedTests = testResults?.length || 0
  const skillLevel = context?.skillLevel || "Principiante"

  // Test recommendations
  if (completedTests < 3) {
    const availableTests = ["disc", "big-five", "mbti", "riasec", "soft-skills"]
    const nextTest = availableTests.find((test) => !testResults?.includes(test))

    if (nextTest) {
      recommendations.push({
        type: "test",
        title: `Completa el test ${getTestName(nextTest)}`,
        description: `Este test te dará insights valiosos sobre tu perfil profesional`,
        priority: "high",
        action_url: `/test/${nextTest}`,
        estimated_time: "15-20 min",
      })
    }
  }

  // Skill development recommendations
  if (skillLevel === "Principiante") {
    recommendations.push({
      type: "skill",
      title: "Desarrolla habilidades de comunicación",
      description: "La comunicación efectiva es fundamental para el crecimiento profesional",
      priority: "high",
      action_url: "/biblioteca?category=Comunicación",
      estimated_time: "1-2 horas",
    })
  }

  // Book recommendations
  recommendations.push({
    type: "book",
    title: "Explora la biblioteca de conocimiento",
    description: "Accede a recursos especializados en desarrollo profesional",
    priority: "medium",
    action_url: "/biblioteca",
    estimated_time: "30-45 min",
  })

  return recommendations
}
