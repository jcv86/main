import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userProfile, conversationHistory, context } = body

    if (!message || !userProfile) {
      return NextResponse.json({ error: "Message and user profile are required" }, { status: 400 })
    }

    const supabase = createClient()

    // Save user message to database
    await supabase.from("ai_conversations").insert({
      user_email: userProfile.email,
      message_type: "user",
      content: message,
      category: categorizeMessage(message),
      metadata: { context },
    })

    // Build comprehensive context for AI
    const aiContext = buildAIContext(userProfile, conversationHistory, context)

    // Generate AI response using mock AI (instead of OpenAI)
    const aiResponse = await generateMockAIResponse(message, userProfile, aiContext)

    // Generate suggested actions based on user profile and message
    const suggestedActions = generateSuggestedActions(message, userProfile, aiResponse)

    // Calculate confidence score
    const confidence = calculateConfidenceScore(userProfile, conversationHistory)

    // Identify context used
    const contextUsed = identifyContextUsed(userProfile, message)

    // Save AI response to database
    await supabase.from("ai_conversations").insert({
      user_email: userProfile.email,
      message_type: "assistant",
      content: aiResponse,
      category: categorizeMessage(message),
      suggested_actions: suggestedActions,
      metadata: {
        contextUsed,
        confidence,
        userCategory: userProfile.userCategory,
      },
    })

    // Update user's conversation history
    const updatedHistory = {
      ...userProfile.conversationHistory,
      totalMessages: (userProfile.conversationHistory?.totalMessages || 0) + 2, // +2 for user and assistant messages
      topics: [...new Set([...(userProfile.conversationHistory?.topics || []), categorizeMessage(message)])],
      lastActive: new Date().toISOString(),
    }

    await supabase.from("user_profiles").update({ conversation_history: updatedHistory }).eq("email", userProfile.email)

    return NextResponse.json({
      content: aiResponse,
      suggestedActions,
      contextUsed,
      confidence,
      category: categorizeMessage(message),
      userCategory: userProfile.userCategory,
    })
  } catch (error) {
    console.error("Error in AI coach conversation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateMockAIResponse(message: string, userProfile: any, context: string): Promise<string> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const userName = userProfile.name
  const userCategory = userProfile.userCategory
  const categoryBadge = getCategoryBadge(userCategory)
  const lowerMessage = message.toLowerCase()

  // Category-specific responses
  const categoryPrefix = getCategorySpecificPrefix(userCategory)

  // Generate contextual response based on message content
  if (lowerMessage.includes("test") || lowerMessage.includes("evaluación") || lowerMessage.includes("assessment")) {
    return `${categoryPrefix}

¡Excelente pregunta sobre evaluaciones, ${userName}! 📊

**Tests recomendados para tu perfil ${categoryBadge}:**

🎯 **Evaluaciones Prioritarias:**
• **DISC Assessment** - Analiza tu estilo de comunicación y liderazgo
• **Big Five** - Evalúa tus rasgos de personalidad fundamentales
• **RIASEC (Holland Code)** - Identifica tus intereses profesionales
• **Inteligencia Emocional** - Mide tu capacidad de gestión emocional

${getCategorySpecificTestRecommendations(userCategory)}

**📈 Próximos pasos:**
1. Comienza con el test DISC para entender tu estilo de trabajo
2. Continúa con Big Five para un análisis profundo de personalidad
3. Completa RIASEC para alinear intereses con oportunidades profesionales

¿Te gustaría que te guíe hacia algún test específico o tienes preguntas sobre alguna evaluación en particular?`
  }

  if (lowerMessage.includes("carrera") || lowerMessage.includes("trabajo") || lowerMessage.includes("profesional")) {
    return `${categoryPrefix}

¡Perfecto, ${userName}! Hablemos de tu desarrollo profesional 🚀

**Análisis de tu perfil ${categoryBadge}:**

🎯 **Fortalezas identificadas:**
${
  userProfile.personalityInsights?.strengths
    ?.slice(0, 3)
    .map((s: string) => `• ${s}`)
    .join("\n") || "• Análisis pendiente - completa más evaluaciones"
}

🔍 **Oportunidades de crecimiento:**
${
  userProfile.personalityInsights?.growthAreas
    ?.slice(0, 2)
    .map((a: string) => `• ${a}`)
    .join("\n") || "• Evaluación en progreso"
}

${getCategorySpecificCareerAdvice(userCategory, userProfile)}

**🎯 Plan de acción inmediato:**
1. **Corto plazo (1-3 meses)**: ${getShortTermGoal(userCategory)}
2. **Mediano plazo (6 meses)**: ${getMediumTermGoal(userCategory)}
3. **Largo plazo (1 año)**: ${getLongTermGoal(userCategory)}

¿Hay algún aspecto específico de tu carrera en el que te gustaría profundizar?`
  }

  if (lowerMessage.includes("habilidad") || lowerMessage.includes("skill") || lowerMessage.includes("competencia")) {
    return `${categoryPrefix}

¡Excelente enfoque en el desarrollo de habilidades, ${userName}! 💪

**Mapa de habilidades para tu perfil ${categoryBadge}:**

🌟 **Habilidades core actuales:**
• Nivel: ${userProfile.preferences?.skillLevel || "Intermedio"}
• Experiencia: ${userProfile.careerProfile?.experience || "En desarrollo"}
• Estilo de aprendizaje: ${userProfile.preferences?.learningStyle || "Visual"}

${getCategorySpecificSkillRecommendations(userCategory)}

**📚 Recursos de desarrollo:**
• **Libros recomendados**: Accede a nuestra biblioteca especializada
• **Cursos online**: Plataformas certificadas según tu nivel
• **Práctica aplicada**: Proyectos reales para consolidar conocimientos
• **Mentoring**: Conexión con expertos en tu área

**🎯 Ruta de aprendizaje personalizada:**
1. **Fundamentos** → Consolida bases sólidas
2. **Especialización** → Profundiza en tu área de interés
3. **Liderazgo** → Desarrolla habilidades de gestión
4. **Innovación** → Mantente actualizado con tendencias

¿Qué habilidad específica te gustaría desarrollar primero?`
  }

  if (lowerMessage.includes("libro") || lowerMessage.includes("leer") || lowerMessage.includes("lectura")) {
    return `${categoryPrefix}

¡Fantástico interés en la lectura, ${userName}! 📚

**Biblioteca personalizada para tu perfil ${categoryBadge}:**

📖 **Libros recomendados según tu perfil:**
${getCategorySpecificBookRecommendations(userCategory)}

**📊 Tu progreso de lectura:**
• Libros completados: ${userProfile.learningProfile?.completedBooks?.length || 0}
• Ritmo de lectura: ${userProfile.learningProfile?.learningPace || "Moderado"}
• Estilo preferido: ${userProfile.preferences?.learningStyle || "Visual"}

**🎯 Plan de lectura sugerido:**
1. **Semana 1-2**: Libro de fundamentos (base sólida)
2. **Semana 3-4**: Especialización técnica
3. **Semana 5-6**: Liderazgo y soft skills
4. **Semana 7-8**: Innovación y tendencias

**💡 Funciones disponibles:**
• Seguimiento de progreso automático
• Notas y highlights sincronizados
• Discusiones con la comunidad
• Recomendaciones basadas en IA

¿Te gustaría que te recomiende un libro específico para comenzar?`
  }

  if (lowerMessage.includes("liderazgo") || lowerMessage.includes("líder") || lowerMessage.includes("gestión")) {
    return `${categoryPrefix}

¡Excelente enfoque en liderazgo, ${userName}! 👑

**Desarrollo de liderazgo para tu perfil ${categoryBadge}:**

🎯 **Estilo de liderazgo identificado:**
• Comunicación: ${userProfile.preferences?.communicationStyle || "Colaborativo"}
• Motivadores: ${userProfile.personalityInsights?.motivators?.join(", ") || "Logro, autonomía, propósito"}
• Fortalezas: ${userProfile.personalityInsights?.strengths?.slice(0, 2).join(", ") || "Análisis, creatividad"}

${getCategorySpecificLeadershipAdvice(userCategory)}

**🚀 Competencias de liderazgo a desarrollar:**
1. **Comunicación efectiva** - Transmitir visión e inspirar equipos
2. **Toma de decisiones** - Análisis estratégico bajo presión
3. **Gestión de equipos** - Motivar y desarrollar talento
4. **Innovación** - Liderar cambio y transformación
5. **Inteligencia emocional** - Gestionar relaciones y conflictos

**📈 Plan de desarrollo ejecutivo:**
• **Mes 1**: Assessment 360° y feedback estructurado
• **Mes 2-3**: Coaching personalizado y mentoring
• **Mes 4-6**: Proyecto de liderazgo aplicado
• **Mes 7-12**: Consolidación y expansión de responsabilidades

¿Qué aspecto del liderazgo te resulta más desafiante actualmente?`
  }

  // Default general response
  return `${categoryPrefix}

¡Hola ${userName}! 👋 Gracias por tu mensaje.

Como tu AI Career Coach personalizado ${categoryBadge}, estoy aquí para ayudarte en tu desarrollo profesional.

**🧠 Contexto de nuestra conversación:**
• Mensajes previos: ${userProfile.conversationHistory?.totalMessages || 0}
• Temas explorados: ${userProfile.conversationHistory?.topics?.join(", ") || "Iniciando conversación"}
• Tu nivel: ${userProfile.preferences?.skillLevel || "Intermedio"}

**🎯 ¿En qué puedo ayudarte específicamente?**

• **Evaluaciones**: Tests de personalidad y habilidades
• **Desarrollo profesional**: Planificación de carrera y objetivos
• **Habilidades**: Identificación y desarrollo de competencias
• **Lectura**: Recomendaciones de libros y recursos
• **Liderazgo**: Estrategias de gestión y comunicación

${getCategorySpecificGeneralAdvice(userCategory)}

**💡 Sugerencia**: Para darte consejos más específicos, cuéntame sobre:
- Tus objetivos profesionales actuales
- Desafíos que estás enfrentando
- Habilidades que quieres desarrollar
- Área específica donde necesitas orientación

¿Hay algo específico en lo que te gustaría que te ayude hoy?`
}

function getCategoryBadge(category: string): string {
  switch (category) {
    case "premium":
      return "Premium 👑"
    case "enterprise":
      return "Enterprise 🏢"
    default:
      return "Estándar"
  }
}

function getCategorySpecificPrefix(category: string): string {
  switch (category) {
    case "premium":
      return `🌟 **Acceso Premium Activado** 👑

Como usuario Premium, tienes acceso a análisis avanzados, recursos exclusivos y consultoría personalizada de alto nivel.`

    case "enterprise":
      return `🚀 **Acceso Enterprise Activado** 🏢

Como usuario Enterprise, tienes acceso completo a consultoría estratégica, análisis organizacional y liderazgo ejecutivo.`

    default:
      return `📚 **Coaching Profesional Estándar**

Acceso a desarrollo profesional fundamental con recursos efectivos y estrategias probadas.`
  }
}

function getCategorySpecificTestRecommendations(category: string): string {
  switch (category) {
    case "premium":
      return `**🌟 Evaluaciones Premium adicionales:**
• **360° Leadership Assessment** - Feedback multifuente para líderes
• **Emotional Intelligence Advanced** - Análisis profundo de competencias emocionales
• **Innovation Style Indicator** - Identifica tu perfil innovador
• **Strategic Thinking Assessment** - Evalúa capacidades de pensamiento estratégico`

    case "enterprise":
      return `**🚀 Evaluaciones Enterprise exclusivas:**
• **Executive Leadership Profile** - Assessment nivel C-Suite
• **Organizational Culture Assessment** - Análisis de fit cultural
• **Digital Transformation Readiness** - Preparación para cambio tecnológico
• **Board Readiness Assessment** - Evaluación para posiciones de junta directiva`

    default:
      return `**📚 Evaluaciones complementarias:**
• **Soft Skills Assessment** - Habilidades interpersonales
• **Career Values Inventory** - Alineación de valores profesionales
• **Learning Style Assessment** - Optimiza tu método de aprendizaje`
  }
}

function getCategorySpecificCareerAdvice(category: string, userProfile: any): string {
  switch (category) {
    case "premium":
      return `**🌟 Estrategia Premium de carrera:**

🎯 **Posicionamiento de liderazgo:**
• Desarrollo de marca personal ejecutiva
• Networking estratégico con C-Suite
• Preparación para roles de Director/VP
• Especialización en gestión de P&L

**💼 Oportunidades Premium:**
• Consultoría estratégica en tu industria
• Roles de transformación digital
• Posiciones de liderazgo en startups unicornio
• Board advisor en empresas emergentes`

    case "enterprise":
      return `**🚀 Estrategia Enterprise de carrera:**

🎯 **Trayectoria ejecutiva:**
• Preparación para roles C-Level (CEO, CTO, COO)
• Liderazgo de transformación organizacional
• Gestión de portfolios de innovación
• Desarrollo de ecosistemas empresariales

**🏢 Oportunidades Enterprise:**
• Chief Technology Officer en Fortune 500
• VP of Digital Transformation
• Innovation Director en corporaciones
• Founder/Co-founder de ventures corporativos`

    default:
      return `**📚 Estrategia de desarrollo profesional:**

🎯 **Crecimiento estructurado:**
• Certificaciones profesionales relevantes
• Desarrollo de habilidades técnicas core
• Construcción de portfolio de proyectos
• Networking en comunidades profesionales

**💼 Oportunidades de crecimiento:**
• Senior roles en tu área actual
• Especialización técnica avanzada
• Team lead o project manager
• Consultor independiente en tu expertise`
  }
}

function getCategorySpecificSkillRecommendations(category: string): string {
  switch (category) {
    case "premium":
      return `**🌟 Habilidades Premium prioritarias:**

🎯 **Liderazgo ejecutivo:**
• Strategic thinking y visión a largo plazo
• Change management y transformación
• Executive communication y storytelling
• Financial acumen y business intelligence
• Innovation leadership y design thinking

**💼 Habilidades de gestión avanzada:**
• P&L management y ROI optimization
• Stakeholder management ejecutivo
• Crisis leadership y decision making
• Talent development y succession planning`

    case "enterprise":
      return `**🚀 Habilidades Enterprise críticas:**

🎯 **Liderazgo organizacional:**
• Organizational design y architecture
• Digital transformation strategy
• Ecosystem thinking y partnerships
• Board communication y governance
• M&A integration y due diligence

**🏢 Competencias tecnológicas ejecutivas:**
• AI/ML strategy y implementation
• Cloud architecture y scalability
• Cybersecurity governance
• Data strategy y analytics leadership`

    default:
      return `**📚 Habilidades fundamentales:**

🎯 **Competencias técnicas:**
• Certificaciones en tu área de expertise
• Project management (PMP, Agile, Scrum)
• Data analysis y visualization
• Digital literacy y automation tools
• Quality assurance y process improvement

**💼 Soft skills esenciales:**
• Communication y presentation skills
• Problem solving y critical thinking
• Time management y productivity
• Teamwork y collaboration`
  }
}

function getCategorySpecificBookRecommendations(category: string): string {
  switch (category) {
    case "premium":
      return `**🌟 Biblioteca Premium:**

📚 **Liderazgo estratégico:**
• "Good Strategy Bad Strategy" - Richard Rumelt
• "The Innovator's Dilemma" - Clayton Christensen
• "Multipliers" - Liz Wiseman
• "The Culture Code" - Daniel Coyle

📈 **Gestión ejecutiva:**
• "High Output Management" - Andy Grove
• "The Hard Thing About Hard Things" - Ben Horowitz
• "Radical Candor" - Kim Scott`

    case "enterprise":
      return `**🚀 Biblioteca Enterprise:**

📚 **Liderazgo C-Level:**
• "Zero to One" - Peter Thiel
• "The Lean Startup" - Eric Ries
• "Crossing the Chasm" - Geoffrey Moore
• "Platform Revolution" - Parker, Van Alstyne, Choudary

🏢 **Transformación organizacional:**
• "Leading Change" - John Kotter
• "The Fifth Discipline" - Peter Senge
• "Exponential Organizations" - Salim Ismail`

    default:
      return `**📚 Biblioteca Fundamental:**

📖 **Desarrollo profesional:**
• "Atomic Habits" - James Clear
• "Deep Work" - Cal Newport
• "The 7 Habits of Highly Effective People" - Stephen Covey
• "Mindset" - Carol Dweck

💼 **Habilidades técnicas:**
• "The Pragmatic Programmer" - Hunt & Thomas
• "Getting Things Done" - David Allen`
  }
}

function getCategorySpecificLeadershipAdvice(category: string): string {
  switch (category) {
    case "premium":
      return `**🌟 Liderazgo Premium:**

👑 **Desarrollo ejecutivo acelerado:**
• Executive coaching personalizado 1:1
• Mentoring con C-Suite de Fortune 500
• Leadership circles exclusivos
• Board readiness preparation

**🎯 Competencias de liderazgo Premium:**
• Visionary leadership y strategic foresight
• Stakeholder capitalism y ESG leadership
• Digital-first leadership mindset
• Global team management y cultural intelligence`

    case "enterprise":
      return `**🚀 Liderazgo Enterprise:**

🏢 **Transformación organizacional:**
• Chief Executive development program
• Organizational psychology aplicada
• Systems thinking y complexity management
• Innovation ecosystem leadership

**🎯 Competencias Enterprise:**
• Board governance y fiduciary responsibility
• Investor relations y capital markets
• M&A leadership y integration
• Regulatory compliance y risk management`

    default:
      return `**📚 Liderazgo Fundamental:**

💼 **Desarrollo de liderazgo estructurado:**
• Team leadership certification
• Management fundamentals
• Communication skills workshop
• Conflict resolution training

**🎯 Competencias básicas:**
• People management y motivation
• Project leadership y delivery
• Cross-functional collaboration
• Performance management`
  }
}

function getCategorySpecificGeneralAdvice(category: string): string {
  switch (category) {
    case "premium":
      return `**🌟 Recursos Premium disponibles:**
• Consultoría estratégica personalizada
• Acceso a red de mentores ejecutivos
• Análisis de mercado y tendencias
• Preparación para roles de liderazgo`

    case "enterprise":
      return `**🚀 Recursos Enterprise disponibles:**
• Consultoría C-Level especializada
• Análisis de ecosistemas empresariales
• Estrategia de transformación digital
• Preparación para board positions`

    default:
      return `**📚 Recursos disponibles:**
• Planes de desarrollo estructurados
• Biblioteca de recursos gratuitos
• Comunidad de aprendizaje
• Seguimiento de progreso personalizado`
  }
}

function getShortTermGoal(category: string): string {
  switch (category) {
    case "premium":
      return "Completar assessment 360° y definir plan de liderazgo ejecutivo"
    case "enterprise":
      return "Desarrollar estrategia de transformación organizacional"
    default:
      return "Completar certificación profesional en área core"
  }
}

function getMediumTermGoal(category: string): string {
  switch (category) {
    case "premium":
      return "Implementar proyecto de innovación con impacto P&L"
    case "enterprise":
      return "Liderar iniciativa de transformación digital"
    default:
      return "Asumir rol de liderazgo de equipo o proyecto"
  }
}

function getLongTermGoal(category: string): string {
  switch (category) {
    case "premium":
      return "Posicionarse para rol VP/Director en organización target"
    case "enterprise":
      return "Prepararse para posición C-Level o board advisor"
    default:
      return "Alcanzar posición senior con responsabilidades de gestión"
  }
}

function categorizeMessage(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("test") || lowerMessage.includes("evaluación") || lowerMessage.includes("assessment")) {
    return "evaluación"
  }
  if (lowerMessage.includes("libro") || lowerMessage.includes("leer") || lowerMessage.includes("lectura")) {
    return "lectura"
  }
  if (
    lowerMessage.includes("habilidad") ||
    lowerMessage.includes("skill") ||
    lowerMessage.includes("competencia") ||
    lowerMessage.includes("desarrollar")
  ) {
    return "habilidades"
  }
  if (
    lowerMessage.includes("carrera") ||
    lowerMessage.includes("trabajo") ||
    lowerMessage.includes("profesional") ||
    lowerMessage.includes("objetivo")
  ) {
    return "carrera"
  }
  if (lowerMessage.includes("liderazgo") || lowerMessage.includes("líder") || lowerMessage.includes("gestión")) {
    return "liderazgo"
  }

  return "general"
}

function buildAIContext(userProfile: any, conversationHistory: any[], context: any): string {
  const contextParts = []

  // User preferences context
  if (userProfile.preferences) {
    contextParts.push(`PREFERENCIAS:
- Comunicación: ${userProfile.preferences.communicationStyle}
- Aprendizaje: ${userProfile.preferences.learningStyle}
- Disponibilidad: ${userProfile.preferences.timeAvailability}
- Intereses: ${userProfile.preferences.interests?.join(", ") || "Por explorar"}`)
  }

  // Career context
  if (userProfile.careerProfile) {
    contextParts.push(`PERFIL PROFESIONAL:
- Rol actual: ${userProfile.careerProfile.currentRole || "No especificado"}
- Industria: ${userProfile.careerProfile.industry || "No especificada"}
- Aspiraciones: ${userProfile.careerProfile.aspirations?.join(", ") || "Por definir"}
- Gaps de habilidades: ${userProfile.careerProfile.skillGaps?.join(", ") || "Por evaluar"}`)
  }

  // Learning context
  if (userProfile.learningProfile) {
    contextParts.push(`PERFIL DE APRENDIZAJE:
- Libros completados: ${userProfile.learningProfile.completedBooks?.length || 0}
- Leyendo actualmente: ${userProfile.learningProfile.currentReading?.join(", ") || "Ninguno"}
- Ritmo preferido: ${userProfile.learningProfile.learningPace}`)
  }

  // Recent conversation context
  if (conversationHistory && conversationHistory.length > 0) {
    const recentMessages = conversationHistory.slice(-3)
    contextParts.push(`CONVERSACIÓN RECIENTE:
${recentMessages.map((msg: any) => `${msg.type}: ${msg.content.substring(0, 100)}...`).join("\n")}`)
  }

  return contextParts.join("\n\n")
}

function generateSuggestedActions(message: string, userProfile: any, aiResponse: string): string[] {
  const actions = []
  const category = categorizeMessage(message)
  const userCategory = userProfile.userCategory || "standard"

  // Category-specific actions
  if (category === "evaluación") {
    actions.push("Ver tests disponibles", "Comenzar evaluación DISC", "Analizar mis resultados")
  } else if (category === "carrera") {
    actions.push("Crear plan de carrera", "Analizar brechas de habilidades", "Explorar oportunidades")
  } else if (category === "liderazgo") {
    actions.push("Desarrollar liderazgo", "Estrategias de comunicación", "Gestión de equipos")
  } else if (category === "habilidades") {
    actions.push("Evaluar habilidades", "Plan de desarrollo", "Recursos de aprendizaje")
  } else if (category === "lectura") {
    actions.push("Recomendar libros", "Ver biblioteca", "Seguimiento de lectura")
  }

  // User category specific actions
  if (userCategory === "premium") {
    actions.push("Consultoría personalizada", "Recursos premium")
  } else if (userCategory === "enterprise") {
    actions.push("Estrategia empresarial", "Transformación digital")
  }

  // Always include a follow-up
  actions.push("¿Qué más puedo ayudarte?")

  return actions.slice(0, 4) // Limit to 4 actions
}

function calculateConfidenceScore(userProfile: any, conversationHistory: any[]): number {
  let confidence = 0.5 // Base confidence

  // Increase confidence based on available data
  if (userProfile.preferences?.careerGoals?.length > 0) confidence += 0.1
  if (userProfile.personalityInsights?.strengths?.length > 0) confidence += 0.2
  if ((userProfile.conversationHistory?.totalMessages || 0) > 5) confidence += 0.1
  if (conversationHistory && conversationHistory.length > 0) confidence += 0.1
  if (userProfile.userCategory === "premium" || userProfile.userCategory === "enterprise") confidence += 0.1

  return Math.min(confidence, 1.0)
}

function identifyContextUsed(userProfile: any, message: string): string[] {
  const contextUsed = ["profile"]

  if ((userProfile.conversationHistory?.totalMessages || 0) > 0) {
    contextUsed.push("history")
  }

  if (userProfile.personalityInsights?.strengths?.length > 0) {
    contextUsed.push("personality")
  }

  if (userProfile.preferences?.careerGoals?.length > 0) {
    contextUsed.push("goals")
  }

  if (userProfile.learningProfile?.completedBooks?.length > 0) {
    contextUsed.push("learning")
  }

  contextUsed.push(categorizeMessage(message))
  contextUsed.push(userProfile.userCategory || "standard")

  return contextUsed
}
