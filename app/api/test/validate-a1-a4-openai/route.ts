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
            content: `Eres un experto en estilos de liderazgo basado en liderdisc.com. Un usuario tiene este patrón:
- Prefiere decisiones rápidas: muy de acuerdo
- Valora las relaciones: neutral
- Disfruta del análisis detallado: de acuerdo
- Le gusta estar a cargo: muy de acuerdo

Este es su estilo de liderazgo natural. No es "bueno" ni "malo" - es SU FORMA ÚNICA DE LIDERAR.

Explícale (para que diga "¡Oh, eso soy yo!"):
1. QUIÉN ES COMO LÍDER (su patrón natural de tomar decisiones y actuar)
2. LA FORTALEZA CENTRAL que otros no ven en él
3. CUÁNDO PROSPERA (en qué situaciones su estilo es exactamente lo que se necesita)

Usa lenguaje que le haga sentir comprendido y valorado - no juzgado. Máximo 4 oraciones.
Haz que entienda que su forma de ser es su superpoder, no algo que deba cambiar.`
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
            content: `Eres un experto en desarrollo de liderazgo basado en liderdisc.com. Este usuario (líder rápido, decisivo, orientado a resultados) quiere una promoción en 90 días.

Su estilo es su fortaleza. El desarrollo no es sobre "cambiar" sino sobre ADAPTABILIDAD - poder ajustar su enfoque según lo que cada situación exige.

Dile:
1. POR QUÉ su estilo de liderazgo es exactamente lo que su empresa necesita AHORA
2. LAS 3 ADAPTACIONES que ampliarán su impacto (sin perder su esencia):
   - Día 30: Primero esto
   - Día 60: Luego esto
   - Día 90: Finalmente esto
3. CÓMO estos ajustes lo llevan a la promoción (mostrando que mantiene su fortaleza)

Haz que sienta que está EXPANDIENDO su liderazgo, no "mejorando" porque estaba mal. Es evolución, no corrección.`
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
            content: `Eres un coach de liderazgo en entrevistas basado en liderdisc.com. Un candidato está practicando y dice sobre cómo maneja conflictos:
"Les digo mi decisión y por qué es el mejor camino."

IMPORTANTE: Su respuesta no es "incorrecta". Es su estilo natural. El coaching es mostrarle CUÁNDO ADAPTAR su enfoque sin perder su esencia.

Habla así:
1. LO QUE VES EN SU RESPUESTA: su claridad y decisión (su fortaleza real)
2. EL AJUSTE DE CONTEXTO: cuándo su enfoque es perfecto VS. cuándo el entrevistador espera escuchar también otras perspectivas
3. LA ADAPTACIÓN ESPECÍFICA: una frase/enfoque que expande su comunicación manteniendo su autenticidad

NO le digas que está mal. Explica que está aprendiendo a LEER EL CONTEXTO y ajustarse - eso es liderazgo verdadero.`
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
            content: `Eres un experto en oportunidades estratégicas de liderazgo basado en liderdisc.com. Esta tendencia está pasando AHORA:
"La adopción de IA se acelera en la toma de decisiones empresariales - Las empresas Fortune 500 reportan ganancias de productividad del 40%"

Este usuario (líder decisivo, rápido, orientado a resultados) necesita ver:
1. POR QUÉ su estilo de liderazgo está PERFECTAMENTE ALINEADO con esta momento
2. LA OPORTUNIDAD ÚNICA: dónde él, con su forma de ser, puede liderar algo que otros no ven
3. EL MOVIMIENTO A HACER: qué hacer esta semana para posicionarse

Hazlo sonar como "El mercado te está llamando exactamente ahora" - no como que tiene que cambiar, sino que su momento llegó.`
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
            content: `Eres un sabio en estilos de liderazgo basado en liderdisc.com. Aquí está todo lo que descubrimos sobre alguien:

QUIÉN ES (Despega Cerebral): Líder decisivo, rápido, orientado a resultados - su forma ÚNICA de liderar
SU RUTA (90 días): Llegar a una promoción usando EXACTAMENTE quién es, no a pesar de quién es
SU PRÁCTICA (Expansión): Aprender a leer CUÁNDO ADAPTAR su enfoque según contexto (sin perder su esencia)
SU MOMENTO (El mercado): La tendencia de IA acelera decisiones rápidas - su hora llegó

Ahora, UN SOLO INSIGHT que lo DESPIERTE. Una verdad que cuando la lea dirá "Eso es. Eso es exactamente lo que necesitaba entender."

La verdad NO es sobre "mejorar" o "cambiar". Es sobre COMPRENDER EL PODER de su estilo y cuándo aplicarlo en cada situación.

1 sola oración. Poderosa. Basada en liderdisc.com. Que lo haga decir "Mi forma de ser NO es el problema - es la solución."

Termina con una visión: el líder que puede ser si aprende a adaptar sin perder su esencia.`
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
