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

    // PHASE A1: Despega Cerebral Discovery Insights
    console.log("[v0] A1: Generating Despega Cerebral discovery insights...")
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
            content: `Eres un coach personal que descubre quién es realmente la gente. Un usuario ha contestado así:
- Prefiere decisiones rápidas: muy de acuerdo
- Valora las relaciones: neutral
- Disfruta del análisis detallado: de acuerdo
- Le gusta estar a cargo: muy de acuerdo

Habla directamente al usuario como si lo conocieras profundamente. Tu trabajo es hacerlo decir "¡Oh, eso soy yo!"

Explícale:
1. QUIÉN ES (el patrón que no sabía que tenía)
2. POR QUÉ ES ASÍ (los instintos que lo mueven)
3. QUÉ SIGNIFICA PARA SU CARRERA (la oportunidad que no ve)

Usa lenguaje cálido, inteligente, sin jargón. Haz que se sienta VISTO. Máximo 4 oraciones.
Termina con una frase que lo haga pensar diferente sobre sí mismo.`
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
    console.log("[v0] A1 Insights: Despega Cerebral discovery generated")

    // PHASE A2: 90-Day Path Clarity
    console.log("[v0] A2: Generating your 90-day path clarity...")
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
            content: `Eres un mentor que ayuda a la gente a ver su camino claro. Este usuario quiere una promoción en 90 días. Sabe tomar decisiones rápidas y es orientado a resultados, pero necesita mejorar en escuchar otros.

IMPORTANTE: Habla COMO SI YA CREES EN ÉL. Tu tono debe ser: "Yo veo quién puedes ser."

Dile (como amigo que confía):
1. POR QUÉ su naturaleza es perfecta PARA esto (su superpower oculto)
2. EL ÚNICO GIRO que cambia todo (lo que muchos no ven)
3. LOS 3 MOVIMIENTOS clave: 30 días, 60 días, 90 días

Sé directo, motivador, real. Como un coach que ya cree en el jugador. 3-4 viñetas máximo.`
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
    console.log("[v0] A2 Insights: Path clarity generated")

    // PHASE A3: Training Feedback Reality Check
    console.log("[v0] A3: Generating training feedback...")
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
            content: `Eres un coach en entrevistas que es brutal pero amoroso. Un candidato está practicando. Cuando le preguntan cómo maneja conflictos, dice:
"Les digo mi decisión y por qué es el mejor camino."

IMPORTANTE: Tu feedback debe hacerlo sentir ENTENDIDO pero también desafiado.

Habla directamente:
1. LO BRILLANTE EN SU RESPUESTA (qué le da poder)
2. EL COSTO OCULTO (por qué esto le cuesta la promoción)
3. LA FRASE EXACTA QUE DEBE CAMBIAR (y por qué funciona mejor)
4. UNA VERDAD que lo haga crecer (no es crítica, es invitación)

Sé honesto como un verdadero coach - que te ama pero no te permite quedarte chico.`
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

    // PHASE A4: Market Intelligence for Your Moment
    console.log("[v0] A4: Generating your market intelligence...")
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
            content: `Eres un estratega que ayuda a gente a ver las oportunidades invisibles. Esta noticia está pasando AHORA:
"La adopción de IA se acelera en la toma de decisiones empresariales - Las empresas Fortune 500 reportan ganancias de productividad del 40%"

Este usuario (rápido en decisiones, orientado a resultados, buscando promoción) necesita saber:
1. POR QUÉ esta tendencia es SU MOMENTO específico (no de otros)
2. LA CONEXIÓN entre quién es + lo que está pasando = su oportunidad
3. QUÉ HACER ESTA SEMANA para prepararse

Hazlo sonar como un descubrimiento que cambia su perspectiva - una puerta que acaba de abrirse para él.
Haz que sienta que el mercado lo está llamando. 2-3 líneas.`
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
    console.log("[v0] A4 Insights: Market intelligence generated")

    // BRAIN CHAIN: The Master Insight That Ties Everything
    console.log("[v0] BRAIN: Synthesizing your master insight...")
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
            content: `Eres un sabio que ve el cuadro completo. Acabas de recopilar intel sobre alguien:

QUIÉN ES (Despega Cerebral): Toma decisiones rápidas, va al punto, compite para ganar, liderazgo natural
SU RUTA (90 días): Ir de impulsor a líder que lleva gente con él hacia una promoción
SU PRÁCTICA (La verdad): Es tan directo que a veces suena frío - necesita incluir a la gente en sus decisiones
SU MOMENTO (El mercado): IA está cambiando quién dirige - y gente como él tiene un superpoder oculto

Ahora, dame UNA SOLA FRASE ÉPICA que lo UNA TODO. Una verdad que cuando la lea, dirá "Así es. Eso es exactamente lo que necesitaba escuchar."

No es estrategia. Es el AHA que lo despierta.
1 oración. Poderosa. Que sea sobre quién puede llegar a ser.`
          }
        ],
        max_tokens: 150,
        temperature: 0.9,
      }),
    })
    
    if (!brainResponse.ok) throw new Error("Brain chain OpenAI call failed")
    const brainData = await brainResponse.json()
    results.brain_chain = brainData.choices?.[0]?.message?.content
    results.timestamps.brain = Date.now() - brainStart
    console.log("[v0] BRAIN: Master insight synthesized")

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
