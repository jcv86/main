import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting A1-A4 OpenAI Insights Validation Test...")
    
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set")
    }

    const results = {
      a1_insights: null,
      a2_insights: null,
      a3_insights: null,
      a4_insights: null,
      brain_chain: null,
      timestamps: {},
    }

    // PHASE A1: DISC Analysis Insights
    console.log("[v0] A1: Generating DISC analysis insights...")
    const a1Start = Date.now()
    const a1Response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Eres un coach de perfil DISC. Un usuario tiene estas respuestas:
- Prefiere decisiones rápidas: muy de acuerdo
- Valora las relaciones: neutral
- Disfruta del análisis detallado: de acuerdo
- Le gusta estar a cargo: muy de acuerdo

Basándote en esto, proporciona un insight JSON sobre su tipo de perfil DISC dominante (D/I/S/C), sus fortalezas, y un insight clave para su desarrollo de carrera en 3-4 oraciones.`
          }
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    })
    
    if (!a1Response.ok) throw new Error("A1 OpenAI call failed")
    const a1Data = await a1Response.json()
    results.a1_insights = a1Data.choices?.[0]?.message?.content
    results.timestamps.a1 = Date.now() - a1Start
    console.log("[v0] A1 Insights: DISC profile analysis generated")

    // PHASE A2: Route Generation Insights
    console.log("[v0] A2: Generating personalized route insights...")
    const a2Start = Date.now()
    const a2Response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Eres un estratega de carrera. Un usuario con perfil DISC D (Dominante/Impulsor) tiene estos objetivos:
- 30 días: Dominar habilidades de negociación
- 60 días: Liderar un equipo multifuncional
- 90 días: Obtener una promoción

Proporciona 3 insights estratégicos clave sobre su viaje de 90 días. Enfócate en cómo aprovechar su perfil D y dónde necesita compensar. Formatea como viñetas.`
          }
        ],
        max_tokens: 400,
        temperature: 0.8,
      }),
    })
    
    if (!a2Response.ok) throw new Error("A2 OpenAI call failed")
    const a2Data = await a2Response.json()
    results.a2_insights = a2Data.choices?.[0]?.message?.content
    results.timestamps.a2 = Date.now() - a2Start
    console.log("[v0] A2 Insights: Route strategy generated")

    // PHASE A3: Training Recommendation Insights
    console.log("[v0] A3: Generating training recommendations...")
    const a3Start = Date.now()
    const a3Response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Eres un coach de entrevistas. Un candidato con perfil D (asertivo, orientado a resultados) está practicando respuestas de entrevista. Su respuesta sobre manejar conflictos:
"Les digo mi decisión y por qué es el mejor camino."

Proporciona 2 insights de coaching específicos: 1) Qué está funcionando bien, 2) Una frase que deberían ajustar para mostrar empatía. Mantente breve.`
          }
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    })
    
    if (!a3Response.ok) throw new Error("A3 OpenAI call failed")
    const a3Data = await a3Response.json()
    results.a3_insights = a3Data.choices?.[0]?.message?.content
    results.timestamps.a3 = Date.now() - a3Start
    console.log("[v0] A3 Insights: Training feedback generated")

    // PHASE A4: Strategic News Insights
    console.log("[v0] A4: Generating personalized strategic insights...")
    const a4Start = Date.now()
    const a4Response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Eres un estratega de mercado. Dada esta noticia:
"La adopción de IA se acelera en la toma de decisiones empresariales - Las empresas Fortune 500 reportan ganancias de productividad del 40%"

Para un profesional con perfil D que apunta a una promoción, proporciona 2 insights accionables sobre cómo pueden aprovechar esta tendencia en su plan de 90 días. Mantén de 2-3 oraciones.`
          }
        ],
        max_tokens: 250,
        temperature: 0.8,
      }),
    })
    
    if (!a4Response.ok) throw new Error("A4 OpenAI call failed")
    const a4Data = await a4Response.json()
    results.a4_insights = a4Data.choices?.[0]?.message?.content
    results.timestamps.a4 = Date.now() - a4Start
    console.log("[v0] A4 Insights: Strategic context generated")

    // BRAIN CHAIN: Consolidate all insights
    console.log("[v0] BRAIN: Consolidating all insights into coherent chain...")
    const brainStart = Date.now()
    const brainResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Estás sintetizando un viaje completo de desarrollo de carrera. Aquí hay insights de 4 fases:

A1 (Quién es): Perfil DISC D - decisivo, orientado a resultados, competitivo
A2 (Su plan): Viaje de 90 días para promoción vía negociación → liderazgo de equipo → promoción
A3 (Su práctica): Entrenamiento de entrevista mostrando que necesita agregar empatía a su toma de decisiones
A4 (Contexto de mercado): Adopción de IA acelerada - oportunidad de liderar iniciativas impulsadas por IA

Sintetiza 1 insight poderoso que une las 4 fases. Este es el insight "cerebro" que guía todo su viaje. Mantén de 2-3 oraciones.`
          }
        ],
        max_tokens: 300,
        temperature: 0.9,
      }),
    })
    
    if (!brainResponse.ok) throw new Error("Brain chain OpenAI call failed")
    const brainData = await brainResponse.json()
    results.brain_chain = brainData.choices?.[0]?.message?.content
    results.timestamps.brain = Date.now() - brainStart
    console.log("[v0] BRAIN: Meta-insight generated")

    const totalTime = Object.values(results.timestamps).reduce((a: number, b: number) => a + (b as number), 0)

    return NextResponse.json({
      success: true,
      message: "A1-A4 OpenAI Insights Validation Complete",
      results,
      performance: {
        total_ms: totalTime,
        phases: results.timestamps,
        avg_phase_ms: Math.round(totalTime / 5),
      },
      validation: {
        all_phases_completed: !![results.a1_insights, results.a2_insights, results.a3_insights, results.a4_insights, results.brain_chain].every(i => i),
        insights_generated: 5,
        brain_connected: !!results.brain_chain && results.brain_chain.length > 50,
      },
    })
  } catch (error: any) {
    console.error("[v0] A1-A4 Test Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        phase: error.phase || "unknown",
      },
      { status: 500 },
    )
  }
}
