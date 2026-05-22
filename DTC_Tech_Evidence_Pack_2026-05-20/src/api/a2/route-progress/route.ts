import { NextRequest, NextResponse } from 'next/server'
import { getA2RouteProgressMetrics } from '@/lib/a2-route-progress'

export async function GET(request: NextRequest) {
  try {
    const day = request.nextUrl.searchParams.get('day')
    
    if (!day || isNaN(parseInt(day))) {
      return NextResponse.json(
        { error: 'Day parameter required and must be a number' },
        { status: 400 }
      )
    }

    const dayNumber = parseInt(day)
    if (dayNumber < 1 || dayNumber > 90) {
      return NextResponse.json(
        { error: 'Day must be between 1 and 90' },
        { status: 400 }
      )
    }

    const metrics = getA2RouteProgressMetrics(dayNumber)

    return NextResponse.json({
      success: true,
      data: {
        ...metrics,
        expectedMetrics: {
          applicationsSubmitted: metrics.applicationsSubmitted,
          connectionsInitiated: metrics.connectionsInitiated,
          interviewsCompleted: metrics.interviewsCompleted,
          offersReceived: metrics.offersReceived,
          xpEarned: metrics.xpEarned
        }
      }
    })
  } catch (error) {
    console.error('[v0] Error fetching route progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch route progress' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { day, userMetrics } = body

    if (!day || !userMetrics) {
      return NextResponse.json(
        { error: 'Day and userMetrics required' },
        { status: 400 }
      )
    }

    const expectedMetrics = getA2RouteProgressMetrics(day)
    
    const applicationDiff = (userMetrics.applicationsSubmitted || 0) - expectedMetrics.applicationsSubmitted
    const interviewDiff = (userMetrics.interviewsCompleted || 0) - expectedMetrics.interviewsCompleted

    const pacing = {
      applicationsPacing: applicationDiff > 5 ? 'ahead' : applicationDiff < -5 ? 'behind' : 'on-track',
      interviewPacing: interviewDiff > 2 ? 'ahead' : interviewDiff < -2 ? 'behind' : 'on-track',
      onTrack: applicationDiff >= -5 && interviewDiff >= -2
    }

    return NextResponse.json({
      success: true,
      data: {
        expectedMetrics,
        userMetrics,
        pacing,
        recommendedAction: pacing.applicationsPacing === 'behind' 
          ? 'Increase applications: Send 5-10 applications today'
          : pacing.interviewPacing === 'behind'
          ? 'Focus on interview preparation and practice'
          : 'Keep up the pace! You\'re on track'
      }
    })
  } catch (error) {
    console.error('[v0] Error analyzing route progress:', error)
    return NextResponse.json(
      { error: 'Failed to analyze route progress' },
      { status: 500 }
    )
  }
}
