import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { response, category } = await request.json()

    if (!response || !category) {
      return NextResponse.json({ error: "Missing response or category" }, { status: 400 })
    }

    // Create a detailed prompt for analyzing the soft skills response
    const analysisPrompt = `Eres un experto en evaluación de habilidades blandas y análisis de competencias profesionales.

Analiza la siguiente respuesta de una evaluación de habilidades blandas en la categoría "${category}":

"${response}"

Proporciona un análisis estructurado siguiendo estos criterios:

CRITERIOS DE EVALUACIÓN:
- Especificidad y detalle de los ejemplos (25%)
- Demostración clara de la competencia (25%)
- Reflexión y aprendizaje (20%)
- Estructura y claridad de la respuesta (15%)
- Resultados e impacto mencionados (15%)

RESPONDE EN FORMATO JSON VÁLIDO:
{
  "strengths": ["fortaleza específica 1", "fortaleza específica 2"],
  "improvements": ["área de mejora 1", "área de mejora 2"],
  "insights": ["insight clave 1", "insight clave 2"],
  "overall_assessment": "Evaluación general en 2-3 oraciones",
  "recommendations": ["recomendación específica 1", "recomendación específica 2"],
  "score": número_entre_0_y_100
}

IMPORTANTE: Responde SOLO con el JSON válido, sin texto adicional.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: analysisPrompt,
      temperature: 0.3,
      maxTokens: 800,
    })

    // Clean the response to ensure it's valid JSON
    let cleanedText = text.trim()

    // Remove any markdown formatting
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\s*/, "").replace(/```\s*$/, "")
    }
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\s*/, "").replace(/```\s*$/, "")
    }

    // Try to parse the JSON response
    let analysis
    try {
      analysis = JSON.parse(cleanedText)

      // Validate required fields
      if (!analysis.strengths || !Array.isArray(analysis.strengths)) {
        throw new Error("Invalid strengths format")
      }
      if (!analysis.score || typeof analysis.score !== "number") {
        throw new Error("Invalid score format")
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      console.error("Raw AI response:", text)

      // Fallback analysis based on response length and content
      const wordCount = response.split(" ").filter((word) => word.length > 0).length
      const hasSpecificExamples =
        response.toLowerCase().includes("ejemplo") ||
        response.toLowerCase().includes("situación") ||
        response.toLowerCase().includes("proyecto")
      const hasResults =
        response.toLowerCase().includes("resultado") ||
        response.toLowerCase().includes("logré") ||
        response.toLowerCase().includes("conseguí")

      let fallbackScore = 60 // Base score
      if (wordCount > 100) fallbackScore += 10
      if (wordCount > 200) fallbackScore += 10
      if (hasSpecificExamples) fallbackScore += 10
      if (hasResults) fallbackScore += 10

      analysis = {
        strengths: [
          wordCount > 100 ? "Respuesta detallada y reflexiva" : "Respuesta proporcionada",
          hasSpecificExamples ? "Incluye ejemplos específicos" : "Muestra experiencia práctica",
        ],
        improvements: [
          wordCount < 100 ? "Podría incluir más detalles específicos" : "Podría estructurar mejor la respuesta",
          !hasResults
            ? "Incluir más información sobre resultados obtenidos"
            : "Continuar desarrollando esta competencia",
        ],
        insights: [
          "Demuestra experiencia en la competencia evaluada",
          wordCount > 150 ? "Muestra capacidad de reflexión profunda" : "Tiene potencial para mayor desarrollo",
        ],
        overall_assessment: `Respuesta que demuestra ${wordCount > 150 ? "un buen" : "cierto"} nivel de comprensión de la competencia ${category}. ${hasSpecificExamples ? "Incluye ejemplos relevantes." : "Podría beneficiarse de ejemplos más específicos."} ${hasResults ? "Menciona resultados concretos." : "Sería valioso incluir más detalles sobre resultados."}`,
        recommendations: [
          wordCount < 100
            ? "Proporcionar más detalles y ejemplos específicos"
            : "Continuar desarrollando esta competencia",
          !hasResults
            ? "Incluir métricas o resultados concretos en futuras respuestas"
            : "Mantener el enfoque en resultados medibles",
        ],
        score: Math.min(100, Math.max(0, fallbackScore)),
      }
    }

    // Ensure score is within valid range
    analysis.score = Math.max(0, Math.min(100, Math.round(analysis.score)))

    // Ensure all arrays have at least one item
    if (!analysis.strengths || analysis.strengths.length === 0) {
      analysis.strengths = ["Respuesta proporcionada para evaluación"]
    }
    if (!analysis.improvements || analysis.improvements.length === 0) {
      analysis.improvements = ["Continuar desarrollando esta competencia"]
    }
    if (!analysis.insights || analysis.insights.length === 0) {
      analysis.insights = ["Muestra experiencia en la competencia evaluada"]
    }
    if (!analysis.recommendations || analysis.recommendations.length === 0) {
      analysis.recommendations = ["Buscar más oportunidades de práctica"]
    }
    if (!analysis.overall_assessment) {
      analysis.overall_assessment = "Respuesta válida que demuestra comprensión de la competencia evaluada."
    }

    return NextResponse.json({
      success: true,
      analysis: analysis,
    })
  } catch (error) {
    console.error("Error analyzing response:", error)

    // Return a basic fallback analysis
    return NextResponse.json({
      success: true,
      analysis: {
        strengths: ["Respuesta proporcionada para evaluación"],
        improvements: ["Continuar desarrollando esta competencia"],
        insights: ["Muestra interés en el desarrollo profesional"],
        overall_assessment: "Respuesta recibida para análisis de competencias.",
        recommendations: ["Buscar oportunidades adicionales de práctica", "Solicitar feedback regular"],
        score: 70,
      },
    })
  }
}
