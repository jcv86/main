import { NextRequest, NextResponse } from 'next/server'
import { saveTrainingSession, getUserTrainingProgress, getTrainingHistory } from '@/lib/training-progress-tracker'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'save-session') {
      const result = await saveTrainingSession(body.session)
      return NextResponse.json(result)
    } else if (action === 'get-progress') {
      const progress = await getUserTrainingProgress()
      return NextResponse.json(progress)
    } else if (action === 'get-history') {
      const { limit, offset } = body
      const history = await getTrainingHistory(limit, offset)
      return NextResponse.json(history)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('[v0] Training API error:', error)
    return NextResponse.json(
      { error: 'Failed to process training data' },
      { status: 500 }
    )
  }
}
