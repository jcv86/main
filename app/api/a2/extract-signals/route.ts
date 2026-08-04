import { NextResponse } from 'next/server'
import { z } from 'zod'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'

const requestSchema = z.object({
  dayNumber: z.literal(3),
})

const extractedSignalSchema = z.object({
  signal_type: z.enum(['skill', 'tool', 'soft_skill', 'framework']),
  signal_text: z.string().trim().min(2).max(160),
  frequency: z.number().int().min(1).max(20),
  importance: z.number().int().min(1).max(5),
})

const aiResponseSchema = z.object({
  signals: z.array(extractedSignalSchema).min(1).max(12),
})

type SignalType = z.infer<typeof extractedSignalSchema>['signal_type']

type MarketSignalRow = {
  job_title: string | null
  company_name: string | null
  requirements: unknown
  strengths_needed: unknown
  fears_skills: unknown
}

function boundedStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20)
    .map((item) => item.slice(0, 160))
}

function basicExtraction(marketSignals: MarketSignalRow[]) {
  const signalMap = new Map<
    string,
    { signal_type: SignalType; signal_text: string; frequency: number; importance: number }
  >()

  const collect = (
    values: string[],
    signalType: SignalType,
    importance: number,
  ) => {
    for (const raw of values) {
      const normalized = raw.toLocaleLowerCase('es-CL')
      const key = `${signalType}:${normalized}`
      const existing = signalMap.get(key)
      if (existing) {
        existing.frequency += 1
        continue
      }
      signalMap.set(key, {
        signal_type: signalType,
        signal_text: raw,
        frequency: 1,
        importance,
      })
    }
  }

  for (const signal of marketSignals) {
    collect(boundedStrings(signal.requirements), 'skill', 4)
    collect(boundedStrings(signal.strengths_needed), 'soft_skill', 3)
    collect(boundedStrings(signal.fears_skills), 'framework', 5)
  }

  return [...signalMap.values()]
    .sort((a, b) => b.frequency - a.frequency || b.importance - a.importance)
    .slice(0, 12)
}

function stripJsonFence(value: string): string {
  return value
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
}

async function generateSignalsWithOpenAI(
  apiKey: string,
  marketSignals: MarketSignalRow[],
) {
  const jobPostingsText = marketSignals
    .map((signal, index) => {
      const requirements = boundedStrings(signal.requirements)
      const strengths = boundedStrings(signal.strengths_needed)
      const challenges = boundedStrings(signal.fears_skills)
      return [
        `Vacante ${index + 1}: ${(signal.job_title || 'Cargo no indicado').slice(0, 160)}`,
        `Empresa: ${(signal.company_name || 'Empresa no indicada').slice(0, 160)}`,
        `Requisitos: ${requirements.join(', ')}`,
        `Fortalezas: ${strengths.join(', ')}`,
        `Brechas o desafíos: ${challenges.join(', ')}`,
      ].join('\n')
    })
    .join('\n\n')
    .slice(0, 14_000)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      store: false,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Analiza vacantes reales y devuelve JSON con la forma {"signals":[{"signal_type":"skill|tool|soft_skill|framework","signal_text":"...","frequency":1,"importance":1}]}. Entrega entre 1 y 12 señales, sin inventar datos y priorizando repeticiones observables.',
        },
        {
          role: 'user',
          content: `Extrae señales verificables de estas vacantes:\n\n${jobPostingsText}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 1_200,
    }),
  })

  if (!response.ok) return null

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = payload.choices?.[0]?.message?.content
  if (!content) return null

  try {
    const parsedJson = JSON.parse(stripJsonFence(content))
    const parsed = aiResponseSchema.safeParse(parsedJson)
    return parsed.success ? parsed.data.signals : null
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const currentUser = await resolveServerUser()
  if (!currentUser) {
    return NextResponse.json(
      { error: 'No autenticado', code: 'authentication_required' },
      { status: 401 },
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Solicitud inválida', code: 'invalid_json' },
      { status: 400 },
    )
  }

  const parsedRequest = requestSchema.safeParse(payload)
  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: 'Solo se admite la extracción canónica del Día 3.' },
      { status: 400 },
    )
  }

  const supabase = createAdminClient()
  const { data: marketSignals, error: marketError } = await supabase
    .from('a2_market_signals')
    .select('job_title, company_name, requirements, strengths_needed, fears_skills')
    .eq('user_id', currentUser.id)
    .eq('day_number', parsedRequest.data.dayNumber)
    .order('created_at', { ascending: false })
    .limit(10)

  if (marketError) {
    console.error('[v0] Error loading Day 3 market signals:', marketError)
    return NextResponse.json(
      { error: 'No pudimos cargar las vacantes guardadas.' },
      { status: 500 },
    )
  }

  const boundedMarketSignals = (marketSignals || []) as MarketSignalRow[]
  if (boundedMarketSignals.length < 3) {
    return NextResponse.json(
      { error: 'Guarda al menos 3 vacantes reales antes de extraer señales.' },
      { status: 422 },
    )
  }

  const fallbackSignals = basicExtraction(boundedMarketSignals)
  const apiKey = process.env.OPENAI_API_KEY
  const aiSignals = apiKey
    ? await generateSignalsWithOpenAI(apiKey, boundedMarketSignals)
    : null
  const validatedSignals = aiSignals || fallbackSignals

  if (validatedSignals.length === 0) {
    return NextResponse.json(
      { error: 'No encontramos señales suficientes en las vacantes guardadas.' },
      { status: 422 },
    )
  }

  const rows = validatedSignals.map((signal) => ({
    user_id: currentUser.id,
    day_number: 3,
    signal_type: signal.signal_type,
    signal_text: signal.signal_text,
    frequency: signal.frequency,
    importance: signal.importance,
    related_jobs_count: signal.frequency,
    category: signal.signal_type === 'skill' || signal.signal_type === 'tool'
      ? 'technical'
      : 'professional',
  }))

  const { error: deleteError } = await supabase
    .from('a2_extracted_signals')
    .delete()
    .eq('user_id', currentUser.id)
    .eq('day_number', 3)

  if (deleteError) {
    console.error('[v0] Error replacing Day 3 signals:', deleteError)
    return NextResponse.json(
      { error: 'No pudimos actualizar las señales anteriores.' },
      { status: 500 },
    )
  }

  const { data: savedSignals, error: insertError } = await supabase
    .from('a2_extracted_signals')
    .insert(rows)
    .select('*')

  if (insertError) {
    console.error('[v0] Error saving Day 3 signals:', insertError)
    return NextResponse.json(
      { error: 'No pudimos guardar las señales extraídas.' },
      { status: 500 },
    )
  }

  return NextResponse.json(
    {
      success: true,
      signals: savedSignals || [],
      count: savedSignals?.length || 0,
      source: aiSignals ? 'openai_validated' : 'deterministic_fallback',
    },
    {
      headers: { 'Cache-Control': 'private, no-store' },
    },
  )
}
