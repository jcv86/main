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

// Mock signal extraction - in production, this would use OpenAI
function extractSignalsFromJobs(marketSignals: MarketSignal[]) {
  const signals: {
    signal_type: 'skill' | 'tool' | 'soft_skill' | 'framework'
    signal_text: string
    frequency: number
    importance: number
    related_jobs_count: number
    category?: string
  }[] = []

  const signalMap = new Map<
    string,
    { type: 'skill' | 'tool' | 'soft_skill' | 'framework'; importance: number; count: number }
  >()

  for (const signal of marketSignals) {
    // Extract skills
    for (const req of signal.requirements) {
      const key = `skill:${req.toLowerCase()}`
      if (!signalMap.has(key)) {
        signalMap.set(key, { type: 'skill', importance: 4, count: 0 })
      }
      const existing = signalMap.get(key)!
      existing.count++
    }

    // Extract soft skills
    for (const soft of signal.strengths_needed) {
      const key = `soft:${soft.toLowerCase()}`
      if (!signalMap.has(key)) {
        signalMap.set(key, { type: 'soft_skill', importance: 3, count: 0 })
      }
      const existing = signalMap.get(key)!
      existing.count++
    }

    // Extract fears/blockers as importance indicators
    for (const fear of signal.fears_skills) {
      const key = `blocker:${fear.toLowerCase()}`
      if (!signalMap.has(key)) {
        signalMap.set(key, { type: 'framework', importance: 5, count: 0 })
      }
      const existing = signalMap.get(key)!
      existing.count++
    }
  }

  // Convert map to signals array, sorted by frequency
  for (const [key, metadata] of signalMap.entries()) {
    const [type_prefix, text] = key.split(':')
    signals.push({
      signal_type: metadata.type,
      signal_text: text.charAt(0).toUpperCase() + text.slice(1),
      frequency: metadata.count,
      importance: metadata.importance,
      related_jobs_count: Math.min(metadata.count, marketSignals.length),
      category: type_prefix === 'skill' ? 'technical' : 'professional',
    })
  }

  return signals.sort((a, b) => b.frequency - a.frequency)
}

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

    // Extract signals from job postings
    const extracted = extractSignalsFromJobs(marketSignals)

    // Save to database
    const savedSignals = []
    for (const signal of extracted) {
      const { data, error } = await createExtractedSignal(userId, {
        day_number: dayNumber,
        signal_type: signal.signal_type,
        signal_text: signal.signal_text,
        frequency: signal.frequency,
        importance: signal.importance,
        related_jobs_count: signal.related_jobs_count,
        category: signal.category,
      })

      if (error) {
        console.error('[v0] Error saving signal:', error)
        continue
      }

      if (data) {
        savedSignals.push(data)
      }
    }

    return NextResponse.json({
      success: true,
      signals: savedSignals,
      count: savedSignals.length,
    })
  } catch (error) {
    console.error('[v0] Error extracting signals:', error)
    return NextResponse.json(
      { error: 'Failed to extract signals' },
      { status: 500 }
    )
  }
}
