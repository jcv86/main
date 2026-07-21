import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface CompleteDayBody {
  dayNumber?: unknown
  submission?: unknown
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  let body: CompleteDayBody
  try {
    body = (await request.json()) as CompleteDayBody
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  const day = typeof body.dayNumber === 'number' ? body.dayNumber : Number(body.dayNumber)
  if (!Number.isInteger(day) || day < 1 || day > 90) {
    return NextResponse.json({ error: 'El día debe estar entre 1 y 90.' }, { status: 400 })
  }

  const submission = body.submission && typeof body.submission === 'object' && !Array.isArray(body.submission)
    ? body.submission
    : {}

  const { data, error } = await supabase.rpc('complete_a2_day', {
    p_day: day,
    p_submission: submission,
  })

  if (error) {
    const isLocked = error.message.includes('day_locked')
    return NextResponse.json(
      {
        error: isLocked
          ? 'Completa correctamente el día actual antes de avanzar.'
          : 'No pudimos registrar el avance. Intenta nuevamente.',
      },
      { status: isLocked ? 409 : 500 },
    )
  }

  return NextResponse.json({ success: true, progression: data })
}
