import { NextRequest, NextResponse } from 'next/server'
import {
  createExtractedSignal,
  type MarketSignal,
} from '@/lib/supabase/a2-market-and-board'

interface ExtractSignalsRequest {
  marketSignals: MarketSignal[]
  userId: string
  dayNumber: number
}

export async function POST(request: NextRequest) {
  try {
    const body: ExtractSignalsRequest = await request.json()
    const { marketSignals, userId, dayNumber } = body

    if (!marketSignals || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error('[v0] Missing OPENAI_API_KEY')
      return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
    }

    // Format market signals for AI analysis
    const jobPostingsText = marketSignals
      .map(
        (signal, idx) =>
          `Job ${idx + 1}: ${signal.job_title || 'Title TBD'} at ${signal.company_name || 'Company TBD'}
        Requirements: ${signal.requirements.join(', ')}
        Strengths Needed: ${signal.strengths_needed.join(', ')}
        Potential Challenges: ${signal.fears_skills.join(', ')}`
      )
      .join('\n\n')

    const systemPrompt = `You are an expert career market analyst. Analyze job postings to extract market signals.
For each signal, determine type (skill/tool/soft_skill/framework), frequency, and importance.
Return JSON with: { signals: [{signal_type, signal_text, frequency, importance}, ...], market_insights: "..." }`

    const userPrompt = `Analyze these ${marketSignals.length} job postings and extract the top 10-12 market signals.
Focus on signals appearing in multiple postings. Prioritize by frequency and importance.

${jobPostingsText}

Return structured JSON.`

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
        temperature: 0.5,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[v0] OpenAI API error:', error)
      // Fallback to basic extraction
      const extracted = extractSignalsBasic(marketSignals)
      return saveSignals(userId, dayNumber, extracted)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''

    // Parse AI response
    let aiSignals = []
    try {
      const parsed = JSON.parse(content)
      aiSignals = parsed.signals || []
    } catch {
      aiSignals = extractSignalsBasic(marketSignals)
    }

    return saveSignals(userId, dayNumber, aiSignals)
  } catch (error) {
    console.error('[v0] Error extracting signals:', error)
    return NextResponse.json({ error: 'Failed to extract signals' }, { status: 500 })
  }
}

// Fallback basic extraction
function extractSignalsBasic(marketSignals: MarketSignal[]) {
  const signals: {
    signal_type: 'skill' | 'tool' | 'soft_skill' | 'framework'
    signal_text: string
    frequency: number
    importance: number
  }[] = []

  const signalMap = new Map<
    string,
    { type: 'skill' | 'tool' | 'soft_skill' | 'framework'; importance: number; count: number }
  >()

  for (const signal of marketSignals) {
    for (const req of signal.requirements) {
      const key = `skill:${req.toLowerCase()}`
      if (!signalMap.has(key)) {
        signalMap.set(key, { type: 'skill', importance: 4, count: 0 })
      }
      signalMap.get(key)!.count++
    }

    for (const soft of signal.strengths_needed) {
      const key = `soft:${soft.toLowerCase()}`
      if (!signalMap.has(key)) {
        signalMap.set(key, { type: 'soft_skill', importance: 3, count: 0 })
      }
      signalMap.get(key)!.count++
    }

    for (const fear of signal.fears_skills) {
      const key = `blocker:${fear.toLowerCase()}`
      if (!signalMap.has(key)) {
        signalMap.set(key, { type: 'framework', importance: 5, count: 0 })
      }
      signalMap.get(key)!.count++
    }
  }

  for (const [key, metadata] of signalMap.entries()) {
    const [, text] = key.split(':')
    signals.push({
      signal_type: metadata.type,
      signal_text: text.charAt(0).toUpperCase() + text.slice(1),
      frequency: metadata.count,
      importance: metadata.importance,
    })
  }

  return signals.sort((a, b) => b.frequency - a.frequency).slice(0, 12)
}

// Save signals to database
async function saveSignals(
  userId: string,
  dayNumber: number,
  signals: Array<{
    signal_type: 'skill' | 'tool' | 'soft_skill' | 'framework'
    signal_text: string
    frequency: number
    importance: number
  }>
) {
  const savedSignals = []
  for (const signal of signals) {
    const { data, error } = await createExtractedSignal(userId, {
      day_number: dayNumber,
      signal_type: signal.signal_type,
      signal_text: signal.signal_text,
      frequency: signal.frequency,
      importance: signal.importance,
      related_jobs_count: signal.frequency,
      category: signal.signal_type === 'skill' ? 'technical' : 'professional',
    })

    if (!error && data) {
      savedSignals.push(data)
    }
  }

  console.log('[v0] Extracted', savedSignals.length, 'signals for user', userId)

  return NextResponse.json({
    success: true,
    signals: savedSignals,
    count: savedSignals.length,
  })
}


