import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { streamText, generateObject } from 'ai'
import { z } from 'zod'
import {
  createExtractedSignal,
  type MarketSignal,
} from '@/lib/supabase/a2-market-and-board'

interface ExtractSignalsRequest {
  marketSignals: MarketSignal[]
  userId: string
  dayNumber: number
}

// Schema for structured signal extraction
const SignalSchema = z.object({
  signal_type: z.enum(['skill', 'tool', 'soft_skill', 'framework']),
  signal_text: z.string(),
  frequency: z.number(),
  importance: z.number(),
  why_important: z.string(),
})

const SignalsSchema = z.object({
  signals: z.array(SignalSchema),
  market_trends: z.string(),
  key_insights: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body: ExtractSignalsRequest = await request.json()
    const { marketSignals, userId, dayNumber } = body

    if (!marketSignals || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format market signals for AI analysis
    const jobPostingsText = marketSignals
      .map(
        (signal, idx) =>
          `Job ${idx + 1}: ${signal.title || 'Title TBD'}
        Requirements: ${signal.requirements.join(', ')}
        Strengths Needed: ${signal.strengths_needed.join(', ')}
        Potential Fears: ${signal.fears_skills.join(', ')}`
      )
      .join('\n\n')

    // Use generateObject for structured extraction
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      system: `You are an expert career market analyst. Analyze job postings to extract meaningful market signals.
For each signal, determine:
- Type: skill (technical), tool (software/platform), soft_skill (interpersonal), or framework (methodology)
- Importance: 1-5 scale where 5 is critical for the role
- Frequency: How many job postings mentioned this
- Why it matters: Brief explanation of its importance

Also provide market trends and key insights about the role.`,
      schema: SignalsSchema,
      prompt: `Analyze these job postings and extract the top market signals:

${jobPostingsText}

Extract 8-12 of the most important and frequently mentioned signals. Focus on signals that appear in multiple postings.`,
      maxTokens: 1000,
    })

    // Save signals to database
    const savedSignals = []
    for (const signal of object.signals) {
      const { data, error } = await createExtractedSignal(userId, {
        day_number: dayNumber,
        signal_type: signal.signal_type,
        signal_text: signal.signal_text,
        frequency: signal.frequency,
        importance: signal.importance,
        related_jobs_count: Math.min(signal.frequency, marketSignals.length),
        category: signal.signal_type === 'skill' ? 'technical' : 'professional',
      })

      if (error) {
        console.error('[v0] Error saving signal:', error)
        continue
      }

      if (data) {
        savedSignals.push(data)
      }
    }

    console.log('[v0] Extracted', savedSignals.length, 'signals for user', userId, 'day', dayNumber)

    return NextResponse.json({
      success: true,
      signals: savedSignals,
      count: savedSignals.length,
      market_trends: object.market_trends,
      key_insights: object.key_insights,
    })
  } catch (error) {
    console.error('[v0] Error extracting signals:', error)
    return NextResponse.json(
      { error: 'Failed to extract signals' },
      { status: 500 }
    )
  }
}
