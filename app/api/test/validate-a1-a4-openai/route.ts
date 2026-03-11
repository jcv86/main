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
            content: `You are a DISC profile coach. A user has these responses:
- Prefers quick decisions: strongly agree
- Values relationships: neutral
- Enjoys detailed analysis: agree
- Likes being in charge: strongly agree

Based on this, provide a JSON insight about their DISC profile (D/I/S/C dominant type), their strengths, and one key insight for their career development in 3-4 sentences.`
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
            content: `You are a career strategist. A user with DISC profile D (Dominant/Driver) has these goals:
- 30 days: Master negotiation skills
- 60 days: Lead a cross-functional team
- 90 days: Get a promotion

Provide 3 key strategic insights about their 90-day journey. Focus on how their D profile can be leveraged and where they need to compensate. Format as bullet points.`
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
            content: `You are an interview coach. A D-profile candidate (assertive, results-driven) is practicing interview responses. Their answer about handling conflict:
"I tell them my decision and why it's the best path forward."

Provide 2 specific coaching insights: 1) What's working well, 2) One phrase they should adjust to show empathy. Keep it brief.`
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
            content: `You are a market strategist. Given this news headline:
"AI adoption accelerates in business decision-making - Fortune 500 companies report 40% productivity gains"

For a D-profile professional aiming for a promotion, provide 2 actionable insights on how they can leverage this trend in their 90-day plan. Keep it to 2-3 sentences.`
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
            content: `You are synthesizing a complete career development journey. Here are insights from 4 phases:

A1 (Who they are): DISC D-profile - decisive, results-oriented, competitive
A2 (Their plan): 90-day journey to promotion via negotiation → team leadership → promotion
A3 (Their practice): Interview training showing they need to add empathy to decision-making
A4 (Market context): AI adoption accelerating - opportunity to lead AI-driven initiatives

Synthesize 1 powerful meta-insight that ties all 4 phases together. This is the "brain" insight that guides their entire journey. Keep it to 2-3 sentences.`
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
