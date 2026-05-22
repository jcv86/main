import { createClient } from "./supabase"

export interface AIInsight {
  id: string
  title: string
  content: string
  type: "personality" | "career" | "development" | "compatibility"
  confidence: number
  source_tests: string[]
  created_at: string
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

class AICoachService {
  async generateInsights(userEmail: string): Promise<AIInsight[]> {
    try {
      const supabase = createClient()
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // Get user's test results
      const { data: testResults, error } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", userEmail)
        .order("completed_at", { ascending: false })

      if (error) throw error

      if (!testResults || testResults.length < 2) {
        throw new Error("Se necesitan al menos 2 tests completados para generar insights")
      }

      // Generate insights based on test results
      const insights: AIInsight[] = []

      // Personality insight
      if (testResults.some((t) => t.test_type === "riasec")) {
        const riasecResult = testResults.find((t) => t.test_type === "riasec")
        if (riasecResult) {
          insights.push({
            id: `personality-${Date.now()}`,
            title: `Perfil Profesional ${riasecResult.results.holland_code}`,
            content: `Tu código Holland ${riasecResult.results.holland_code} indica una combinación única de intereses que te posiciona idealmente para roles que requieren ${this.getHollandDescription(riasecResult.results.holland_code)}.`,
            type: "personality",
            confidence: 92,
            source_tests: ["RIASEC"],
            created_at: new Date().toISOString(),
          })
        }
      }

      // Career insight
      if (testResults.length >= 2) {
        insights.push({
          id: `career-${Date.now()}`,
          title: "Compatibilidad de Carrera Multidimensional",
          content:
            "Basado en tus múltiples evaluaciones, muestras un perfil versátil que se adapta bien a roles híbridos que combinan análisis, creatividad y liderazgo. Considera carreras en consultoría de innovación, gestión de productos o emprendimiento tecnológico.",
          type: "career",
          confidence: 88,
          source_tests: testResults.map((t) => t.test_type.toUpperCase()),
          created_at: new Date().toISOString(),
        })
      }

      // Development insight
      insights.push({
        id: `development-${Date.now()}`,
        title: "Plan de Desarrollo Personalizado",
        content:
          "Para maximizar tu potencial, enfócate en desarrollar habilidades de comunicación técnica y gestión de equipos multidisciplinarios. Tu perfil analítico-creativo se beneficiaría de experiencia en metodologías ágiles y design thinking.",
        type: "development",
        confidence: 85,
        source_tests: testResults.map((t) => t.test_type.toUpperCase()),
        created_at: new Date().toISOString(),
      })

      // Save insights to database
      const { error: insertError } = await supabase.from("ai_insights").insert(
        insights.map((insight) => ({
          user_email: userEmail,
          insight_type: insight.type,
          insight_title: insight.title,
          insight_content: insight.content,
          confidence_score: insight.confidence,
          source_tests: insight.source_tests,
        })),
      )

      if (insertError) throw insertError

      return insights
    } catch (error) {
      console.error("Error generating insights:", error)
      throw error
    }
  }

  async getExistingInsights(userEmail: string): Promise<AIInsight[]> {
    try {
      const supabase = createClient()
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      const { data, error } = await supabase
        .from("ai_insights")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false })

      if (error) throw error

      return (
        data?.map((insight) => ({
          id: insight.id,
          title: insight.insight_title,
          content: insight.insight_content,
          type: insight.insight_type,
          confidence: insight.confidence_score,
          source_tests: insight.source_tests || [],
          created_at: insight.created_at,
        })) || []
      )
    } catch (error) {
      console.error("Error loading insights:", error)
      return []
    }
  }

  async chatWithCoach(
    userEmail: string,
    message: string,
    conversationHistory: ChatMessage[],
  ): Promise<{ message: string }> {
    try {
      const supabase = createClient()
      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // Get user's test results for context
      const { data: testResults } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", userEmail)
        .order("completed_at", { ascending: false })

      // Simulate AI response based on user profile
      let response = ""

      if (message.toLowerCase().includes("carrera") || message.toLowerCase().includes("trabajo")) {
        response = this.generateCareerAdvice(testResults)
      } else if (message.toLowerCase().includes("fortaleza") || message.toLowerCase().includes("habilidad")) {
        response = this.generateStrengthsAdvice(testResults)
      } else if (message.toLowerCase().includes("desarrollo") || message.toLowerCase().includes("mejorar")) {
        response = this.generateDevelopmentAdvice(testResults)
      } else {
        response = this.generateGeneralAdvice(testResults)
      }

      // Save conversation to database
      await supabase.from("ai_conversations").insert({
        user_email: userEmail,
        user_message: message,
        ai_response: response,
        created_at: new Date().toISOString(),
      })

      return { message: response }
    } catch (error) {
      console.error("Error in AI chat:", error)
      return {
        message:
          "Lo siento, hubo un error al procesar tu consulta. Por favor intenta de nuevo o reformula tu pregunta.",
      }
    }
  }

  private getHollandDescription(code: string): string {
    const descriptions: Record<string, string> = {
      IEA: "investigación científica, liderazgo empresarial y expresión creativa",
      EIA: "liderazgo con base analítica y toque innovador",
      AIE: "creatividad fundamentada en investigación y visión empresarial",
      ISE: "análisis profundo con impacto social y liderazgo",
      ESI: "liderazgo de iniciativas sociales con rigor analítico",
      ASI: "creatividad aplicada a soluciones de impacto social",
    }
    return descriptions[code] || "una combinación única de habilidades analíticas, creativas y de liderazgo"
  }

  private generateCareerAdvice(testResults: any[]): string {
    const riasecResult = testResults?.find((t) => t.test_type === "riasec")
    if (riasecResult) {
      const code = riasecResult.results.holland_code
      return `Basado en tu código Holland ${code}, te recomiendo explorar carreras en:

• **Consultoría de Innovación**: Combina tu capacidad analítica con liderazgo
• **Product Management**: Ideal para tu perfil investigativo-emprendedor
• **Arquitectura de Soluciones**: Aprovecha tu pensamiento sistémico
• **Emprendimiento Tecnológico**: Perfecto para tu combinación IEA

¿Te interesa alguna de estas áreas en particular? Puedo darte más detalles específicos.`
    }

    return `Para darte recomendaciones de carrera más precisas, necesito conocer mejor tu perfil. Te sugiero completar más evaluaciones para obtener un análisis más completo de tus intereses y habilidades.`
  }

  private generateStrengthsAdvice(testResults: any[]): string {
    return `Basado en tus evaluaciones, tus principales fortalezas incluyen:

🎯 **Pensamiento Analítico**: Excelente capacidad para descomponer problemas complejos
🚀 **Liderazgo Natural**: Habilidad para motivar e inspirar equipos
🎨 **Creatividad Aplicada**: Capacidad para generar soluciones innovadoras
🔍 **Visión Estratégica**: Habilidad para ver el panorama completo

**Cómo aprovecharlas:**
• Busca roles que requieran resolución de problemas complejos
• Lidera proyectos de innovación en tu organización actual
• Desarrolla tu capacidad de comunicar ideas técnicas de forma creativa
• Considera roles de consultoría donde puedas aplicar tu análisis estratégico

¿Hay alguna fortaleza específica que te gustaría desarrollar más?`
  }

  private generateDevelopmentAdvice(testResults: any[]): string {
    return `Para tu desarrollo profesional, te recomiendo enfocarte en:

📈 **Áreas de Crecimiento Prioritarias:**
• **Comunicación Técnica**: Mejorar la presentación de ideas complejas
• **Gestión de Equipos**: Desarrollar habilidades de liderazgo operativo
• **Paciencia Operativa**: Tolerancia con procesos rutinarios y administrativos
• **Networking Estratégico**: Construir relaciones profesionales clave

📚 **Plan de Desarrollo Sugerido:**
1. **Corto plazo (3 meses)**: Curso de presentaciones ejecutivas
2. **Mediano plazo (6 meses)**: Certificación en gestión de proyectos
3. **Largo plazo (1 año)**: Programa de liderazgo o MBA ejecutivo

🎯 **Acciones Inmediatas:**
• Únete a grupos profesionales de tu industria
• Busca un mentor en roles de liderazgo
• Practica presentaciones con feedback regular

¿Te gustaría que profundice en alguna de estas áreas?`
  }

  private generateGeneralAdvice(testResults: any[]): string {
    return `¡Hola! Soy tu coach de IA personalizado. He analizado tu perfil y estoy aquí para ayudarte con:

🎯 **Orientación Profesional**
• Identificación de carreras compatibles
• Estrategias de desarrollo profesional
• Planificación de objetivos a corto y largo plazo

💪 **Desarrollo Personal**
• Maximización de fortalezas naturales
• Planes para áreas de mejora
• Estrategias de crecimiento personalizado

🚀 **Crecimiento Profesional**
• Recomendaciones de habilidades a desarrollar
• Networking y construcción de marca personal
• Preparación para entrevistas y negociaciones

Puedes preguntarme sobre:
• "¿Qué carreras me recomiendas?"
• "¿Cómo puedo desarrollar mis fortalezas?"
• "¿Qué habilidades debería aprender?"
• "¿Cómo puedo mejorar mi liderazgo?"

¿En qué área te gustaría que te ayude hoy?`
  }
}

export const aiCoach = new AICoachService()
