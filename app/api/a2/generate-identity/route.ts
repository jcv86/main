import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/a2/generate-identity
 * Uses OpenAI GPT-4o to generate 3 professional identity versions
 */
export async function POST(request: NextRequest) {
  try {
    const { archetype, archetypeDescription, candidateProfile } = await request.json()

    if (!archetype) {
      return NextResponse.json({ error: 'Missing archetype' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error('[v0] Missing OPENAI_API_KEY')
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }

    const systemPrompt = `You are an expert personal branding coach who specializes in crafting compelling professional identities.
Generate 3 distinct versions of a professional identity statement for someone who is a ${archetype}.

Create:
1. SIMPLE: A clear, conversational 1-sentence identity (for casual conversations)
2. RECRUITER: A LinkedIn-ready pitch highlighting impact (2-3 sentences)
3. INTERVIEW: A STAR-format "Tell me about yourself" response (3-4 sentences)

Format as JSON with keys: simple, recruiter, interview`

    const userPrompt = `Professional Archetype: ${archetype}
Description: ${archetypeDescription || 'Standard professional'}
${candidateProfile ? `Profile: ${candidateProfile}` : ''}

Generate 3 distinct, authentic identity versions for each context.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[v0] OpenAI API error:', error)
      return NextResponse.json(
        { error: 'Failed to generate identity' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    // Try to parse as JSON, otherwise return as text
    let identities = { simple: '', recruiter: '', interview: '' }
    try {
      const parsed = JSON.parse(content)
      identities = parsed
    } catch {
      // If not valid JSON, split by lines and assign
      identities = {
        simple: content.split('\n')[0] || content,
        recruiter: content,
        interview: content,
      }
    }

    return NextResponse.json({
      success: true,
      identity_versions: identities,
      archetype,
      model: 'gpt-4o-mini',
    })
  } catch (error) {
    console.error('[v0] Error generating identity:', error)
    return NextResponse.json(
      { error: 'Failed to generate professional identity' },
      { status: 500 }
    )
  }
}
