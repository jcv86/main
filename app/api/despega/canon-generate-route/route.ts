import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"

const ROUTE_GENERATOR_PROMPT = `Eres el generador de rutas de desarrollo profesional de Despega Tu Carrera.

Tu rol es crear rutas de desarrollo personalizadas basadas en:
- El perfil del usuario (fortalezas, debilidades, DISC)
- Su meta profesional y rol objetivo
- Su nivel de experiencia actual
- El tiempo disponible para el programa

Genera una ruta estructurada con:
1. Módulos de aprendizaje priorizados
2. Habilidades a desarrollar
3. Recursos recomendados
4. Hitos medibles
5. Timeline sugerido

Responde siempre en JSON válido con la estructura:
{
  "route_name": "string",
  "description": "string",
  "total_duration_days": number,
  "modules": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "duration_days": number,
      "skills": ["string"],
      "milestones": ["string"]
    }
  ],
  "key_skills": ["string"],
  "success_metrics": ["string"]
}`

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { targetRole, currentSkills, experienceYears, availableHoursPerWeek } = await request.json()

    // Get user's profile data
    const { data: profile } = await supabase
      .from("despega_user_profiles")
      .select("disc_profile, strengths, weaknesses, career_goal, industry")
      .eq("user_id", user.id)
      .single()

    const userContext = `
Información del usuario:
- Rol objetivo: ${targetRole || profile?.career_goal || "No especificado"}
- Perfil DISC: ${profile?.disc_profile || "No evaluado"}
- Fortalezas: ${profile?.strengths?.join(", ") || "No identificadas"}
- Áreas de mejora: ${profile?.weaknesses?.join(", ") || "No identificadas"}
- Habilidades actuales: ${currentSkills?.join(", ") || "No especificadas"}
- Años de experiencia: ${experienceYears || "No especificado"}
- Horas disponibles por semana: ${availableHoursPerWeek || 5}
- Industria objetivo: ${profile?.industry || "No especificada"}
`

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1500,
      messages: [
        {
          role: "system" as const,
          content: ROUTE_GENERATOR_PROMPT
        },
        {
          role: "user" as const,
          content: `Genera una ruta de desarrollo profesional personalizada para este usuario:\n${userContext}`
        }
      ] as any,
    })

    const text = response.choices[0].message.content || ""

    // Parse the JSON response
    let route
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        route = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("[v0] Error parsing route JSON:", parseError)
      return NextResponse.json({
        route: {
          route_name: "Ruta de Desarrollo General",
          description: "Ruta personalizada basada en tu perfil",
          total_duration_days: 90,
          modules: [
            {
              id: "mod1",
              name: "Fundamentos",
              description: "Establecer bases sólidas",
              duration_days: 30,
              skills: ["Comunicación", "Organización"],
              milestones: ["Completar evaluación inicial"]
            }
          ],
          key_skills: ["Comunicación efectiva", "Gestión del tiempo"],
          success_metrics: ["Completar 80% de módulos", "Mejorar confianza"]
        },
        generated: false
      })
    }

    // Save route to user profile
    await supabase
      .from("despega_user_profiles")
      .update({
        generated_route: route,
        route_generated_at: new Date().toISOString()
      })
      .eq("user_id", user.id)

    return NextResponse.json({ route, generated: true })
  } catch (error) {
    console.error("[v0] canon-generate-route error:", error)
    return NextResponse.json(
      { error: "Failed to generate route" },
      { status: 500 }
    )
  }
}
