import { NextRequest, NextResponse } from 'next/server'

// POST /api/a2/day1-score
// Scores the Day 1 roadmap submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { routeData } = body

    // Rule-based scoring (can be enhanced with AI)
    let clarity = 15
    let logic = 15
    let realism = 15
    let actionability = 15

    if (routeData.change30Days?.length > 150) clarity += 5
    if (routeData.targetRole?.length > 100) clarity += 5
    if (routeData.gates?.identity && routeData.gates?.evidence && routeData.gates?.material) {
      logic += 10
    }
    if (!routeData.mainBlocker?.toLowerCase().includes('impossible')) {
      realism += 10
    }
    if (routeData.gates?.identity?.includes('debo')) {
      actionability += 10
    }

    const totalScore = clarity + logic + realism + actionability
    const passStatus = totalScore >= 75 ? 'pass' : 'fail'

    return NextResponse.json({
      scores: { clarity, logic, realism, actionability },
      totalScore,
      passStatus,
      feedback: passStatus === 'pass' 
        ? 'Tu ruta es clara y alcanzable. ¡Continúa!'
        : 'Tu ruta necesita más especificidad y realismo.'
    })
  } catch (error) {
    console.error('[v0] Day 1 scoring error:', error)
    return NextResponse.json({ error: 'Scoring failed' }, { status: 500 })
  }
}
