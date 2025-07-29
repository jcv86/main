// Adaptive Testing Engine for Soft Skills Assessment
// Implements Item Response Theory (IRT) principles for efficient evaluation

export interface TestQuestion {
  id: string
  type: "scale" | "multiple" | "scenario" | "open" | "ranking"
  category: string
  skill: string
  difficulty: number // 1-5 scale
  text: string
  scenario?: string
  options?: Array<{
    id: string
    text: string
    value: number
    weight?: number
  }>
  expectedResponseTime?: number // in milliseconds
  adaptiveRules?: {
    skipIfScore?: { skill: string; threshold: number }
    requireIfScore?: { skill: string; threshold: number }
  }
}

export interface TestSession {
  id: string
  userId: string
  testType: string
  startTime: number
  questionsAsked: number
  responses: Array<{
    questionId: string
    answer: any
    responseTime: number
    timestamp: number
  }>
  skillScores: Record<
    string,
    {
      score: number
      confidence: number
      questionsAnswered: number
    }
  >
  isComplete: boolean
  adaptivePath: string[]
}

export interface TestResult {
  testType: string
  overallScore: number
  skillResults: Array<{
    skill: string
    score: number
    level: string
    description: string
    strengths: string[]
    improvements: string[]
  }>
  questionsAnswered: number
  totalPossibleQuestions: number
  completionTime: number
  adaptiveEfficiency: number
  aiCoachingFeedback: string
  recommendations: Array<{
    type: "book" | "course" | "coaching" | "practice"
    title: string
    description: string
    priority: "high" | "medium" | "low"
    estimatedTime: string
    provider?: string
    url?: string
  }>
  nextSteps: string[]
}

export interface SoftSkillTest {
  id: string
  name: string
  description: string
  skills: string[]
  duration: string
  minQuestions: number
  maxQuestions: number
  questions: TestQuestion[]
}

// Test Configurations
export const SOFT_SKILL_TESTS: Record<string, SoftSkillTest> = {
  emotional_intelligence: {
    id: "emotional_intelligence",
    name: "Inteligencia Emocional",
    description:
      "Evalúa tu capacidad para reconocer, comprender y gestionar emociones propias y ajenas en el contexto laboral chileno.",
    skills: ["self_awareness", "self_regulation", "empathy", "social_skills"],
    duration: "8-12 min",
    minQuestions: 12,
    maxQuestions: 25,
    questions: [
      {
        id: "ei_1",
        type: "scale",
        category: "Autoconciencia",
        skill: "self_awareness",
        difficulty: 2,
        text: "¿Con qué frecuencia reconoces tus emociones en el momento que las experimentas durante reuniones de trabajo?",
        options: [
          { id: "1", text: "Nunca me doy cuenta", value: 1 },
          { id: "2", text: "Rara vez", value: 2 },
          { id: "3", text: "A veces", value: 3 },
          { id: "4", text: "Frecuentemente", value: 4 },
          { id: "5", text: "Siempre soy consciente", value: 5 },
        ],
        expectedResponseTime: 8000,
      },
      {
        id: "ei_2",
        type: "scenario",
        category: "Autorregulación",
        skill: "self_regulation",
        difficulty: 3,
        text: "Tu jefe te critica duramente frente a tus colegas por un error en un proyecto importante. ¿Cuál sería tu reacción más probable?",
        scenario:
          "Estás en una reunión de equipo presentando los resultados de un proyecto en el que has trabajado durante semanas. Tu jefe interrumpe y señala varios errores frente a todo el equipo, usando un tono bastante duro.",
        options: [
          { id: "a", text: "Me defendería inmediatamente y explicaría por qué no es mi culpa", value: 2 },
          { id: "b", text: "Me quedaría callado pero me sentiría muy molesto el resto del día", value: 2 },
          { id: "c", text: "Tomaría nota de los errores y pediría hablar en privado después", value: 4 },
          { id: "d", text: "Agradecería el feedback y preguntaría cómo mejorar para la próxima vez", value: 5 },
          { id: "e", text: "Me disculparía profusamente y me sentiría muy avergonzado", value: 1 },
        ],
        expectedResponseTime: 15000,
        adaptiveRules: {
          skipIfScore: { skill: "self_regulation", threshold: 4.5 },
        },
      },
      {
        id: "ei_3",
        type: "multiple",
        category: "Empatía",
        skill: "empathy",
        difficulty: 2,
        text: "Un compañero de trabajo parece estar pasando por un momento difícil y su rendimiento ha bajado. ¿Qué harías?",
        options: [
          { id: "a", text: "No es mi problema, cada uno debe manejar sus asuntos personales", value: 1 },
          { id: "b", text: "Le preguntaría directamente qué le pasa", value: 3 },
          { id: "c", text: "Buscaría un momento apropiado para ofrecerle mi apoyo", value: 5 },
          { id: "d", text: "Se lo comentaría al supervisor para que tome cartas en el asunto", value: 2 },
          { id: "e", text: "Esperaría a que él me cuente si necesita ayuda", value: 3 },
        ],
        expectedResponseTime: 12000,
      },
      {
        id: "ei_4",
        type: "scale",
        category: "Habilidades Sociales",
        skill: "social_skills",
        difficulty: 3,
        text: "¿Qué tan efectivo eres para resolver conflictos entre miembros de tu equipo?",
        options: [
          { id: "1", text: "Evito involucrarme en conflictos", value: 1 },
          { id: "2", text: "Me cuesta mucho mediar", value: 2 },
          { id: "3", text: "Puedo ayudar en situaciones simples", value: 3 },
          { id: "4", text: "Soy bastante bueno mediando", value: 4 },
          { id: "5", text: "Excelente, siempre logro resolver conflictos", value: 5 },
        ],
        expectedResponseTime: 10000,
      },
      {
        id: "ei_5",
        type: "open",
        category: "Autoconciencia",
        skill: "self_awareness",
        difficulty: 4,
        text: "Describe una situación reciente donde tus emociones afectaron tu desempeño laboral. ¿Qué aprendiste de esa experiencia?",
        expectedResponseTime: 45000,
      },
    ],
  },

  communication: {
    id: "communication",
    name: "Habilidades de Comunicación",
    description:
      "Mide tu efectividad comunicando ideas, escuchando activamente y adaptándote a diferentes audiencias en el contexto profesional chileno.",
    skills: ["verbal_communication", "written_communication", "active_listening", "presentation_skills"],
    duration: "10-15 min",
    minQuestions: 15,
    maxQuestions: 30,
    questions: [
      {
        id: "comm_1",
        type: "scenario",
        category: "Comunicación Verbal",
        skill: "verbal_communication",
        difficulty: 2,
        text: "Debes explicar un concepto técnico complejo a un cliente que no tiene conocimientos técnicos. ¿Cómo lo abordarías?",
        scenario:
          "Eres desarrollador de software y debes explicar a un cliente por qué su sitio web está lento y qué soluciones propones.",
        options: [
          { id: "a", text: "Uso términos técnicos precisos para ser exacto", value: 1 },
          { id: "b", text: "Uso analogías simples y ejemplos cotidianos", value: 5 },
          { id: "c", text: "Le doy un resumen muy breve sin detalles", value: 2 },
          { id: "d", text: "Le envío documentación técnica para que lea", value: 1 },
          { id: "e", text: "Pregunto qué tanto sabe del tema antes de explicar", value: 4 },
        ],
        expectedResponseTime: 12000,
      },
      {
        id: "comm_2",
        type: "scale",
        category: "Escucha Activa",
        skill: "active_listening",
        difficulty: 2,
        text: "Durante las reuniones, ¿con qué frecuencia haces preguntas para clarificar lo que otros han dicho?",
        options: [
          { id: "1", text: "Nunca, prefiero no interrumpir", value: 2 },
          { id: "2", text: "Rara vez", value: 2 },
          { id: "3", text: "A veces, cuando no entiendo algo", value: 3 },
          { id: "4", text: "Frecuentemente, para asegurar comprensión", value: 5 },
          { id: "5", text: "Siempre que sea necesario", value: 4 },
        ],
        expectedResponseTime: 8000,
      },
      {
        id: "comm_3",
        type: "multiple",
        category: "Comunicación Escrita",
        skill: "written_communication",
        difficulty: 3,
        text: "Al escribir un email importante a tu equipo, ¿cuál es tu enfoque principal?",
        options: [
          { id: "a", text: "Ser lo más breve posible", value: 3 },
          { id: "b", text: "Incluir todos los detalles posibles", value: 2 },
          { id: "c", text: "Estructurar claramente con puntos clave", value: 5 },
          { id: "d", text: "Usar un tono muy formal siempre", value: 2 },
          { id: "e", text: "Adaptar el tono según la audiencia", value: 4 },
        ],
        expectedResponseTime: 10000,
      },
      {
        id: "comm_4",
        type: "ranking",
        category: "Habilidades de Presentación",
        skill: "presentation_skills",
        difficulty: 4,
        text: "Ordena estos elementos según su importancia para una presentación efectiva (1 = más importante):",
        options: [
          { id: "content", text: "Contenido bien estructurado", value: 0 },
          { id: "visuals", text: "Apoyo visual atractivo", value: 0 },
          { id: "delivery", text: "Forma de presentar (tono, gestos)", value: 0 },
          { id: "interaction", text: "Interacción con la audiencia", value: 0 },
          { id: "timing", text: "Manejo del tiempo", value: 0 },
        ],
        expectedResponseTime: 20000,
      },
    ],
  },

  resilience: {
    id: "resilience",
    name: "Resiliencia y Manejo del Estrés",
    description:
      "Evalúa tu capacidad para recuperarte de adversidades, manejar la presión y adaptarte a cambios en el ambiente laboral.",
    skills: ["stress_management", "adaptability", "recovery", "optimism"],
    duration: "8-12 min",
    minQuestions: 10,
    maxQuestions: 20,
    questions: [
      {
        id: "res_1",
        type: "scenario",
        category: "Manejo del Estrés",
        skill: "stress_management",
        difficulty: 3,
        text: "Tienes tres proyectos urgentes con fechas límite en la misma semana. ¿Cómo manejas esta situación?",
        scenario:
          "Es lunes por la mañana y te das cuenta de que tienes tres entregas importantes para el viernes: un reporte para el CEO, una presentación para un cliente clave, y el lanzamiento de una nueva funcionalidad.",
        options: [
          { id: "a", text: "Me siento abrumado y no sé por dónde empezar", value: 1 },
          { id: "b", text: "Trabajo día y noche hasta completar todo", value: 2 },
          { id: "c", text: "Priorizo según impacto y busco ayuda del equipo", value: 5 },
          { id: "d", text: "Hablo con mi jefe para renegociar algunas fechas", value: 4 },
          { id: "e", text: "Hago lo que pueda y acepto que algo puede quedar incompleto", value: 3 },
        ],
        expectedResponseTime: 15000,
      },
      {
        id: "res_2",
        type: "scale",
        category: "Adaptabilidad",
        skill: "adaptability",
        difficulty: 2,
        text: "¿Qué tan cómodo te sientes cuando cambian las prioridades de tu trabajo sin previo aviso?",
        options: [
          { id: "1", text: "Me molesta mucho y afecta mi productividad", value: 1 },
          { id: "2", text: "Me cuesta adaptarme pero lo logro", value: 2 },
          { id: "3", text: "Me adapto sin mayores problemas", value: 4 },
          { id: "4", text: "Me gusta la variedad y los nuevos desafíos", value: 5 },
          { id: "5", text: "Prefiero cuando hay cambios constantes", value: 4 },
        ],
        expectedResponseTime: 8000,
      },
      {
        id: "res_3",
        type: "multiple",
        category: "Recuperación",
        skill: "recovery",
        difficulty: 4,
        text: "Después de un fracaso importante en un proyecto, ¿cuál es tu reacción típica?",
        options: [
          { id: "a", text: "Me tomo tiempo para procesar y luego analizo qué salió mal", value: 5 },
          { id: "b", text: "Trato de olvidarlo rápidamente y seguir adelante", value: 2 },
          { id: "c", text: "Me culpo a mí mismo por mucho tiempo", value: 1 },
          { id: "d", text: "Busco inmediatamente otro proyecto para demostrar mi valor", value: 3 },
          { id: "e", text: "Hablo con mentores o colegas para obtener perspectiva", value: 4 },
        ],
        expectedResponseTime: 12000,
      },
    ],
  },

  leadership: {
    id: "leadership",
    name: "Liderazgo y Trabajo en Equipo",
    description:
      "Mide tu capacidad para influir positivamente, motivar equipos y tomar decisiones efectivas en contextos colaborativos.",
    skills: ["team_motivation", "decision_making", "delegation", "conflict_resolution"],
    duration: "12-18 min",
    minQuestions: 18,
    maxQuestions: 35,
    questions: [
      {
        id: "lead_1",
        type: "scenario",
        category: "Motivación de Equipo",
        skill: "team_motivation",
        difficulty: 3,
        text: "Tu equipo está desmotivado después de que se canceló un proyecto en el que trabajaron durante meses. ¿Cómo los motivas?",
        scenario:
          "El equipo había invertido 4 meses en desarrollar una nueva funcionalidad que finalmente fue cancelada por cambios en la estrategia de la empresa. Notas que la moral está muy baja.",
        options: [
          { id: "a", text: "Les digo que es parte del negocio y que sigan adelante", value: 2 },
          { id: "b", text: "Organizo una reunión para que expresen sus frustraciones", value: 4 },
          { id: "c", text: "Destaco el aprendizaje obtenido y celebro el buen trabajo realizado", value: 5 },
          { id: "d", text: "Les prometo que el próximo proyecto será mejor", value: 2 },
          { id: "e", text: "Busco formas de aplicar su trabajo en otros proyectos", value: 4 },
        ],
        expectedResponseTime: 18000,
      },
      {
        id: "lead_2",
        type: "scale",
        category: "Delegación",
        skill: "delegation",
        difficulty: 4,
        text: "¿Con qué frecuencia delegas tareas importantes a miembros de tu equipo?",
        options: [
          { id: "1", text: "Nunca, prefiero hacer todo yo mismo", value: 1 },
          { id: "2", text: "Solo cuando estoy muy ocupado", value: 2 },
          { id: "3", text: "Regularmente, según las fortalezas de cada persona", value: 5 },
          { id: "4", text: "Siempre que sea posible para desarrollar al equipo", value: 4 },
          { id: "5", text: "Delego todo para enfocarme en estrategia", value: 3 },
        ],
        expectedResponseTime: 10000,
      },
    ],
  },

  decision_making: {
    id: "decision_making",
    name: "Toma de Decisiones Éticas",
    description:
      "Evalúa tu proceso de toma de decisiones, consideración de factores éticos y manejo de dilemas profesionales.",
    skills: ["ethical_reasoning", "analytical_thinking", "risk_assessment", "stakeholder_consideration"],
    duration: "10-15 min",
    minQuestions: 12,
    maxQuestions: 25,
    questions: [
      {
        id: "dec_1",
        type: "scenario",
        category: "Razonamiento Ético",
        skill: "ethical_reasoning",
        difficulty: 4,
        text: "Descubres que tu empresa está usando datos de usuarios de manera que podría violar su privacidad, pero es legal. ¿Qué haces?",
        scenario:
          "Trabajas en una startup que recopila datos de usuarios para mejorar su producto. Te das cuenta de que están usando información personal de formas que técnicamente están en los términos de servicio, pero que los usuarios probablemente no esperan.",
        options: [
          { id: "a", text: "No hago nada, es legal y no es mi responsabilidad", value: 1 },
          { id: "b", text: "Hablo directamente con mi jefe sobre mis preocupaciones", value: 4 },
          { id: "c", text: "Propongo mejoras en la transparencia hacia los usuarios", value: 5 },
          { id: "d", text: "Busco asesoría legal externa", value: 3 },
          { id: "e", text: "Considero reportarlo a autoridades regulatorias", value: 3 },
        ],
        expectedResponseTime: 20000,
      },
      {
        id: "dec_2",
        type: "multiple",
        category: "Pensamiento Analítico",
        skill: "analytical_thinking",
        difficulty: 3,
        text: "Al enfrentar una decisión compleja, ¿cuál es tu primer paso?",
        options: [
          { id: "a", text: "Confío en mi intuición y experiencia", value: 3 },
          { id: "b", text: "Recopilo toda la información disponible", value: 4 },
          { id: "c", text: "Consulto con colegas y expertos", value: 4 },
          { id: "d", text: "Defino claramente el problema y objetivos", value: 5 },
          { id: "e", text: "Busco casos similares del pasado", value: 3 },
        ],
        expectedResponseTime: 12000,
      },
    ],
  },

  creativity: {
    id: "creativity",
    name: "Creatividad y Pensamiento Innovador",
    description:
      "Mide tu capacidad para generar ideas originales, pensar fuera de lo convencional y abordar problemas desde perspectivas únicas.",
    skills: ["divergent_thinking", "problem_solving", "innovation", "artistic_expression"],
    duration: "8-12 min",
    minQuestions: 10,
    maxQuestions: 20,
    questions: [
      {
        id: "crea_1",
        type: "open",
        category: "Pensamiento Divergente",
        skill: "divergent_thinking",
        difficulty: 3,
        text: "Imagina que debes mejorar la experiencia de espera en un banco. Propón 5 ideas creativas diferentes.",
        expectedResponseTime: 60000,
      },
      {
        id: "crea_2",
        type: "scenario",
        category: "Resolución Creativa de Problemas",
        skill: "problem_solving",
        difficulty: 4,
        text: "Tu equipo está estancado en un problema técnico complejo. Las soluciones tradicionales no funcionan. ¿Qué enfoque tomas?",
        scenario:
          "Llevan 2 semanas intentando optimizar el rendimiento de una aplicación, pero todas las técnicas estándar han fallado. El cliente está presionando por una solución.",
        options: [
          { id: "a", text: "Sigo intentando las mismas técnicas con más detalle", value: 2 },
          { id: "b", text: "Busco ayuda de expertos externos", value: 3 },
          { id: "c", text: "Replanteo completamente el problema desde cero", value: 5 },
          { id: "d", text: "Organizo una sesión de brainstorming con el equipo", value: 4 },
          { id: "e", text: "Investigo soluciones en industrias completamente diferentes", value: 5 },
        ],
        expectedResponseTime: 15000,
      },
    ],
  },
}

// Adaptive Testing Engine
class AdaptiveTestEngine {
  private sessions: Map<string, TestSession> = new Map()

  startTest(userId: string, testType: string): TestSession {
    const testConfig = SOFT_SKILL_TESTS[testType]
    if (!testConfig) {
      throw new Error(`Test type ${testType} not found`)
    }

    const session: TestSession = {
      id: `${userId}_${testType}_${Date.now()}`,
      userId,
      testType,
      startTime: Date.now(),
      questionsAsked: 0,
      responses: [],
      skillScores: {},
      isComplete: false,
      adaptivePath: [],
    }

    // Initialize skill scores
    testConfig.skills.forEach((skill) => {
      session.skillScores[skill] = {
        score: 2.5, // Start at neutral
        confidence: 0,
        questionsAnswered: 0,
      }
    })

    this.sessions.set(session.id, session)
    return session
  }

  getNextQuestion(session: TestSession): TestQuestion | null {
    const testConfig = SOFT_SKILL_TESTS[session.testType]
    if (!testConfig) return null

    // Check if we should end the test
    if (this.shouldEndTest(session, testConfig)) {
      return null
    }

    // Find the best next question using adaptive logic
    const availableQuestions = testConfig.questions.filter((q) => !session.responses.some((r) => r.questionId === q.id))

    if (availableQuestions.length === 0) return null

    // Adaptive selection logic
    const nextQuestion = this.selectAdaptiveQuestion(session, availableQuestions)

    if (nextQuestion) {
      session.adaptivePath.push(nextQuestion.id)
    }

    return nextQuestion
  }

  private shouldEndTest(session: TestSession, testConfig: SoftSkillTest): boolean {
    // Minimum questions not reached
    if (session.questionsAsked < testConfig.minQuestions) {
      return false
    }

    // Maximum questions reached
    if (session.questionsAsked >= testConfig.maxQuestions) {
      return true
    }

    // Check if we have sufficient confidence in all skills
    const allSkillsConfident = testConfig.skills.every((skill) => {
      const skillData = session.skillScores[skill]
      return skillData && skillData.confidence > 0.8 && skillData.questionsAnswered >= 2
    })

    return allSkillsConfident
  }

  private selectAdaptiveQuestion(session: TestSession, availableQuestions: TestQuestion[]): TestQuestion | null {
    // Find the skill with lowest confidence that needs more questions
    let targetSkill = ""
    let lowestConfidence = 1.0

    Object.entries(session.skillScores).forEach(([skill, data]) => {
      if (data.confidence < lowestConfidence) {
        lowestConfidence = data.confidence
        targetSkill = skill
      }
    })

    // Filter questions for the target skill
    let candidateQuestions = availableQuestions.filter((q) => q.skill === targetSkill)

    if (candidateQuestions.length === 0) {
      candidateQuestions = availableQuestions
    }

    // Select question with appropriate difficulty based on current skill score
    const skillScore = session.skillScores[targetSkill]?.score || 2.5
    const targetDifficulty = Math.round(skillScore)

    // Find question closest to target difficulty
    candidateQuestions.sort((a, b) => {
      const diffA = Math.abs(a.difficulty - targetDifficulty)
      const diffB = Math.abs(b.difficulty - targetDifficulty)
      return diffA - diffB
    })

    return candidateQuestions[0] || null
  }

  submitResponse(session: TestSession, questionId: string, answer: any, responseTime: number): void {
    const testConfig = SOFT_SKILL_TESTS[session.testType]
    const question = testConfig.questions.find((q) => q.id === questionId)

    if (!question) return

    // Record response
    session.responses.push({
      questionId,
      answer,
      responseTime,
      timestamp: Date.now(),
    })

    session.questionsAsked++

    // Update skill scores based on response
    this.updateSkillScores(session, question, answer, responseTime)
  }

  private updateSkillScores(session: TestSession, question: TestQuestion, answer: any, responseTime: number): void {
    const skill = question.skill
    const skillData = session.skillScores[skill]

    if (!skillData) return

    let score = 0

    // Calculate score based on question type
    switch (question.type) {
      case "scale":
      case "multiple":
      case "scenario":
        score = typeof answer === "number" ? answer : 0
        break
      case "ranking":
        // For ranking questions, calculate based on order quality
        score = this.calculateRankingScore(answer)
        break
      case "open":
        // For open questions, use AI to score (simplified here)
        score = this.calculateOpenScore(answer)
        break
    }

    // Normalize score to 1-5 scale
    const normalizedScore = Math.max(1, Math.min(5, score))

    // Update skill score using weighted average
    const weight = this.calculateResponseWeight(question, responseTime)
    const currentWeight = skillData.questionsAnswered
    const newScore = (skillData.score * currentWeight + normalizedScore * weight) / (currentWeight + weight)

    skillData.score = newScore
    skillData.questionsAnswered++

    // Update confidence based on consistency and number of questions
    skillData.confidence = Math.min(
      1.0,
      skillData.questionsAnswered * 0.2 + (1 - Math.abs(normalizedScore - skillData.score) / 4) * 0.3,
    )
  }

  private calculateResponseWeight(question: TestQuestion, responseTime: number): number {
    let weight = 1.0

    // Higher difficulty questions get more weight
    weight *= question.difficulty / 3

    // Response time factor (too fast or too slow reduces weight)
    if (question.expectedResponseTime) {
      const timeRatio = responseTime / question.expectedResponseTime
      if (timeRatio < 0.3 || timeRatio > 3.0) {
        weight *= 0.7 // Reduce weight for rushed or overly slow responses
      }
    }

    return weight
  }

  private calculateRankingScore(ranking: any[]): number {
    // Simplified ranking score calculation
    // In a real implementation, this would compare against expert rankings
    return 3.5 // Placeholder
  }

  private calculateOpenScore(text: string): number {
    // Simplified open-ended response scoring
    // In a real implementation, this would use AI/NLP to analyze the response
    const wordCount = text.split(" ").length
    if (wordCount < 10) return 2
    if (wordCount < 30) return 3
    if (wordCount < 60) return 4
    return 5
  }

  completeTest(session: TestSession): TestResult {
    session.isComplete = true
    const testConfig = SOFT_SKILL_TESTS[session.testType]

    // Calculate overall score
    const skillScores = Object.values(session.skillScores)
    const overallScore = Math.round(
      (skillScores.reduce((sum, skill) => sum + skill.score, 0) / skillScores.length) * 20,
    )

    // Generate skill results
    const skillResults = Object.entries(session.skillScores).map(([skill, data]) => {
      const score = Math.round(data.score * 20)
      const level = this.getSkillLevel(score)

      return {
        skill,
        score,
        level,
        description: this.getSkillDescription(skill, score),
        strengths: this.getSkillStrengths(skill, score),
        improvements: this.getSkillImprovements(skill, score),
      }
    })

    // Generate AI coaching feedback
    const aiCoachingFeedback = this.generateAICoachingFeedback(session, skillResults)

    // Generate recommendations
    const recommendations = this.generateRecommendations(skillResults)

    // Calculate efficiency
    const adaptiveEfficiency = 1 - session.questionsAsked / testConfig.maxQuestions

    const result: TestResult = {
      testType: session.testType,
      overallScore,
      skillResults,
      questionsAnswered: session.questionsAsked,
      totalPossibleQuestions: testConfig.maxQuestions,
      completionTime: Date.now() - session.startTime,
      adaptiveEfficiency,
      aiCoachingFeedback,
      recommendations,
      nextSteps: this.generateNextSteps(skillResults),
    }

    return result
  }

  private getSkillLevel(score: number): string {
    if (score >= 90) return "Excelente"
    if (score >= 75) return "Alto"
    if (score >= 60) return "Medio"
    if (score >= 40) return "Básico"
    return "En desarrollo"
  }

  private getSkillDescription(skill: string, score: number): string {
    const descriptions = {
      self_awareness: {
        high: "Tienes una excelente comprensión de tus emociones y cómo afectan tu comportamiento laboral.",
        medium: "Reconoces tus emociones la mayoría del tiempo, pero podrías mejorar en situaciones de estrés.",
        low: "Te beneficiarías de desarrollar mayor conciencia sobre tus estados emocionales.",
      },
      self_regulation: {
        high: "Manejas muy bien tus emociones y reacciones en situaciones desafiantes.",
        medium: "Generalmente controlas bien tus emociones, con algunas excepciones.",
        low: "Podrías mejorar en el control de impulsos y reacciones emocionales.",
      },
      empathy: {
        high: "Demuestras una capacidad excepcional para entender y conectar con otros.",
        medium: "Tienes buena empatía, pero podrías desarrollarla más en ciertas situaciones.",
        low: "Te beneficiarías de practicar más la perspectiva de otros.",
      },
      social_skills: {
        high: "Excelentes habilidades para interactuar y influir positivamente en otros.",
        medium: "Buenas habilidades sociales con espacio para crecimiento.",
        low: "Las habilidades interpersonales son un área importante de desarrollo.",
      },
    }

    const skillDesc = descriptions[skill as keyof typeof descriptions]
    if (!skillDesc) return "Habilidad evaluada exitosamente."

    if (score >= 75) return skillDesc.high
    if (score >= 50) return skillDesc.medium
    return skillDesc.low
  }

  private getSkillStrengths(skill: string, score: number): string[] {
    if (score < 60) return []

    const strengths = {
      self_awareness: [
        "Reconoces tus emociones rápidamente",
        "Entiendes cómo tus emociones afectan tu trabajo",
        "Tienes claridad sobre tus fortalezas y debilidades",
      ],
      self_regulation: [
        "Mantienes la calma bajo presión",
        "Controlas bien tus impulsos",
        "Te adaptas bien a los cambios",
      ],
      empathy: [
        "Entiendes las perspectivas de otros",
        "Respondes apropiadamente a las emociones ajenas",
        "Creas conexiones genuinas con colegas",
      ],
      social_skills: [
        "Comunicas efectivamente",
        "Resuelves conflictos constructivamente",
        "Influyes positivamente en el equipo",
      ],
    }

    return strengths[skill as keyof typeof strengths] || []
  }

  private getSkillImprovements(skill: string, score: number): string[] {
    if (score >= 75) return []

    const improvements = {
      self_awareness: [
        "Practica la reflexión diaria sobre tus emociones",
        "Solicita feedback regular de colegas",
        "Mantén un diario emocional",
      ],
      self_regulation: [
        "Desarrolla técnicas de respiración y mindfulness",
        "Practica la pausa antes de reaccionar",
        "Identifica tus triggers emocionales",
      ],
      empathy: [
        "Practica la escucha activa",
        "Haz más preguntas sobre las perspectivas de otros",
        "Observa el lenguaje corporal y señales no verbales",
      ],
      social_skills: [
        "Practica la comunicación asertiva",
        "Desarrolla habilidades de negociación",
        "Busca oportunidades de liderazgo",
      ],
    }

    return improvements[skill as keyof typeof improvements] || []
  }

  private generateAICoachingFeedback(session: TestSession, skillResults: any[]): string {
    // In a real implementation, this would call GPT-4 API
    // For now, we'll generate structured feedback based on results

    const testName = SOFT_SKILL_TESTS[session.testType].name
    const overallScore = skillResults.reduce((sum, skill) => sum + skill.score, 0) / skillResults.length

    let feedback = `¡Felicidades por completar tu evaluación adaptativa de ${testName}! `

    if (overallScore >= 80) {
      feedback += `Tus resultados son excelentes, mostrando un nivel muy alto en esta área. `
    } else if (overallScore >= 65) {
      feedback += `Tus resultados son sólidos, con algunas áreas destacadas y otras con potencial de crecimiento. `
    } else {
      feedback += `Tus resultados muestran una base sólida con importantes oportunidades de desarrollo. `
    }

    // Highlight top strength
    const topSkill = skillResults.reduce((prev, current) => (prev.score > current.score ? prev : current))
    feedback += `Tu mayor fortaleza es ${topSkill.skill.replace("_", " ")}, donde demuestras ${topSkill.level.toLowerCase()} desempeño. `

    // Highlight development area
    const developmentSkill = skillResults.reduce((prev, current) => (prev.score < current.score ? prev : current))
    if (developmentSkill.score < 70) {
      feedback += `El área con mayor potencial de crecimiento es ${developmentSkill.skill.replace("_", " ")}. `
    }

    feedback += `\n\nRecuerda que las habilidades blandas se desarrollan con práctica constante y reflexión. `
    feedback += `Te recomiendo enfocarte en 1-2 áreas específicas durante los próximos 3 meses para ver mejoras significativas. `
    feedback += `\n\n¡Estoy aquí para apoyarte en tu desarrollo profesional! ¿Te gustaría que conversemos sobre estrategias específicas para alguna de estas habilidades?`

    return feedback
  }

  private generateRecommendations(skillResults: any[]): TestResult["recommendations"] {
    const recommendations: TestResult["recommendations"] = []

    // Find skills that need improvement
    const improvementSkills = skillResults.filter((skill) => skill.score < 70)

    improvementSkills.forEach((skill) => {
      // Book recommendations
      recommendations.push({
        type: "book",
        title: this.getBookRecommendation(skill.skill),
        description: `Libro especializado en desarrollar ${skill.skill.replace("_", " ")}`,
        priority: skill.score < 50 ? "high" : "medium",
        estimatedTime: "2-3 semanas",
        provider: "Biblioteca DTC",
      })

      // Practice recommendations
      recommendations.push({
        type: "practice",
        title: `Ejercicios de ${skill.skill.replace("_", " ")}`,
        description: `Actividades prácticas para mejorar esta habilidad`,
        priority: "high",
        estimatedTime: "15 min/día",
        provider: "Coach IA",
      })
    })

    // Coaching recommendation
    if (improvementSkills.length > 0) {
      recommendations.push({
        type: "coaching",
        title: "Sesión de Coaching Personalizada",
        description: "Conversación uno-a-uno con el Coach IA para crear un plan de desarrollo",
        priority: "high",
        estimatedTime: "30 min",
        provider: "Coach IA DTC",
      })
    }

    return recommendations
  }

  private getBookRecommendation(skill: string): string {
    const bookMap = {
      self_awareness: "Inteligencia Emocional - Daniel Goleman",
      self_regulation: "Hábitos Atómicos - James Clear",
      empathy: "Comunicación No Violenta - Marshall Rosenberg",
      social_skills: "Cómo Ganar Amigos e Influir sobre las Personas - Dale Carnegie",
      stress_management: "El Poder del Ahora - Eckhart Tolle",
      adaptability: "Mindset - Carol Dweck",
      team_motivation: "Los 7 Hábitos de la Gente Altamente Efectiva - Stephen Covey",
      decision_making: "Pensar Rápido, Pensar Despacio - Daniel Kahneman",
    }

    return bookMap[skill as keyof typeof bookMap] || "Desarrollo Personal y Profesional"
  }

  private generateNextSteps(skillResults: any[]): string[] {
    const steps = [
      "Revisa tus resultados detallados y reflexiona sobre las áreas de fortaleza",
      "Selecciona 1-2 habilidades específicas para enfocar tu desarrollo",
      "Comienza con las recomendaciones de libros y recursos sugeridos",
      "Practica las habilidades identificadas en situaciones laborales reales",
      "Programa una sesión de seguimiento con el Coach IA en 4 semanas",
    ]

    // Add specific steps based on results
    const lowScoreSkills = skillResults.filter((skill) => skill.score < 60)
    if (lowScoreSkills.length > 0) {
      steps.splice(2, 0, `Prioriza el desarrollo de ${lowScoreSkills[0].skill.replace("_", " ")} como primera meta`)
    }

    return steps
  }
}

// Export singleton instance
export const adaptiveTestEngine = new AdaptiveTestEngine()
