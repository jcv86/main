import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, data } = body

    if (type === "personality_complete_analysis") {
      const isSpanish = userId === "spanishUser"

      const prompt = isSpanish
        ? `Eres un psicólogo profesional especializado en análisis de personalidad. Analiza el siguiente perfil de personalidad y proporciona un análisis completo y profesional en español.

Datos del perfil:
- Apertura: ${data.openness}%
- Responsabilidad: ${data.conscientiousness}%
- Extraversión: ${data.extraversion}%
- Amabilidad: ${data.agreeableness}%
- Neuroticismo: ${data.neuroticism}%
- Tipo Primario: ${data.primaryType}
- Tipo Secundario: ${data.secondaryType}
- Puntuación General: ${data.overallScore}%

Proporciona un análisis detallado de 800-1000 palabras que incluya:

**RESUMEN DE PERSONALIDAD**
Una descripción general del perfil único de esta persona.

**FORTALEZAS Y TALENTOS**
Identifica las principales fortalezas basadas en las puntuaciones altas.

**DESAFÍOS POTENCIALES**
Áreas que podrían presentar dificultades y estrategias para manejarlas.

**IMPLICACIONES PROFESIONALES**
Ambientes de trabajo ideales, roles que se adaptan bien, y estilos de liderazgo.

**ESTILO DE COMUNICACIÓN**
Cómo esta persona prefiere interactuar y comunicarse.

**MANEJO DEL ESTRÉS**
Cómo maneja la presión y estrategias de afrontamiento.

**OPORTUNIDADES DE CRECIMIENTO**
Áreas específicas para el desarrollo personal y profesional.

**DINÁMICAS RELACIONALES**
Cómo se relaciona con otros en entornos profesionales.

**ESTILO DE TOMA DE DECISIONES**
Enfoque para resolver problemas y tomar decisiones.

**RECOMENDACIONES ACCIONABLES**
3-5 pasos específicos para el crecimiento personal y profesional.

Mantén un tono profesional, empático y constructivo. Enfócate en el crecimiento y el potencial.`
        : `You are a professional psychologist specializing in personality analysis. Analyze the following personality profile and provide a comprehensive, professional analysis in English.

Profile data:
- Openness: ${data.openness}%
- Conscientiousness: ${data.conscientiousness}%
- Extraversion: ${data.extraversion}%
- Agreeableness: ${data.agreeableness}%
- Neuroticism: ${data.neuroticism}%
- Primary Type: ${data.primaryType}
- Secondary Type: ${data.secondaryType}
- Overall Score: ${data.overallScore}%

Provide a detailed 800-1000 word analysis that includes:

**PERSONALITY OVERVIEW**
A comprehensive description of this person's unique profile.

**STRENGTHS AND TALENTS**
Identify key strengths based on high scores.

**POTENTIAL CHALLENGES**
Areas that might present difficulties and strategies to manage them.

**CAREER IMPLICATIONS**
Ideal work environments, well-suited roles, and leadership styles.

**COMMUNICATION STYLE**
How this person prefers to interact and communicate.

**STRESS MANAGEMENT**
How they handle pressure and coping strategies.

**GROWTH OPPORTUNITIES**
Specific areas for personal and professional development.

**RELATIONSHIP DYNAMICS**
How they relate to others in professional settings.

**DECISION-MAKING STYLE**
Approach to problem-solving and decision-making.

**ACTIONABLE RECOMMENDATIONS**
3-5 specific steps for personal and professional growth.

Maintain a professional, empathetic, and constructive tone. Focus on growth and potential.`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        maxTokens: 1500,
        temperature: 0.7,
      })

      return NextResponse.json({ insights: text })
    }

    if (type === "skills_analysis") {
      const isSpanish = userId === "spanishUser"

      const prompt = isSpanish
        ? `Analiza los siguientes resultados de evaluación de habilidades y proporciona insights profesionales en español:

Datos de habilidades: ${JSON.stringify(data)}

Proporciona un análisis de 400-500 palabras que incluya:
- Fortalezas técnicas identificadas
- Áreas de mejora recomendadas
- Sugerencias de desarrollo profesional
- Próximos pasos accionables

Mantén un tono profesional y constructivo.`
        : `Analyze the following skills assessment results and provide professional insights in English:

Skills data: ${JSON.stringify(data)}

Provide a 400-500 word analysis including:
- Identified technical strengths
- Recommended improvement areas
- Professional development suggestions
- Actionable next steps

Maintain a professional and constructive tone.`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        maxTokens: 800,
        temperature: 0.7,
      })

      return NextResponse.json({ insights: text })
    }

    if (type === "career_analysis") {
      const isSpanish = userId === "spanishUser"

      const prompt = isSpanish
        ? `Analiza la siguiente información de carrera y proporciona recomendaciones profesionales en español:

Datos de carrera:
- Nivel actual: ${data.currentLevel}
- Siguientes pasos: ${data.nextSteps.join(", ")}
- Rango salarial: ${data.salaryRange}
- Línea de crecimiento: ${data.growthTimeline}

Proporciona un análisis de 200-300 palabras que incluya:
- Recomendaciones de roles futuros
- Estrategias para alcanzar los siguientes niveles
- Consideraciones sobre el mercado laboral

Mantén un tono profesional y orientado al crecimiento.`
        : `Analyze the following career information and provide professional recommendations in English:

Career data:
- Current Level: ${data.currentLevel}
- Next Steps: ${data.nextSteps.join(", ")}
- Salary Range: ${data.salaryRange}
- Growth Timeline: ${data.growthTimeline}

Provide an analysis of 200-300 words including:
- Recommendations for future roles
- Strategies to reach the next levels
- Considerations about the job market

Maintain a professional and growth-oriented tone.`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        maxTokens: 600,
        temperature: 0.7,
      })

      return NextResponse.json({ insights: text })
    }

    // Mock AI insights response
    const insights = {
      personality: {
        summary:
          "Based on your DISC evaluation, you exhibit a natural leadership profile with a tendency towards collaboration.",
        strengths: ["Leadership", "Communication", "Problem-solving"],
        areas_for_improvement: ["Time management", "Delegation", "Patience"],
        recommendations: [
          "Consider team management roles",
          "Develop coaching skills",
          "Practice mindfulness techniques",
        ],
      },
      skills: {
        technical_score: 85,
        soft_skills_score: 78,
        overall_rating: "Advanced",
        top_skills: ["JavaScript", "React", "Node.js", "Communication", "Teamwork"],
        skill_gaps: ["Python", "Machine Learning", "Technical Leadership"],
        market_demand: "High demand in the Chilean market",
      },
      career: {
        current_level: "Senior Developer",
        next_steps: ["Tech Lead", "Engineering Manager", "Senior Architect"],
        salary_range: "CLP 3,500,000 - 5,500,000",
        growth_timeline: "6-12 months with focused development",
      },
    }

    return NextResponse.json({
      success: true,
      insights: insights[type as keyof typeof insights] || insights,
    })
  } catch (error) {
    console.error("AI Insights API Error:", error)
    return NextResponse.json({ success: false, error: "Error generating insights" }, { status: 500 })
  }
}
