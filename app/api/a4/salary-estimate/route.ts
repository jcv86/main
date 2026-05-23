import { NextRequest, NextResponse } from 'next/server'
import { estimateSalary } from '@/lib/salary/salary-benchmarking'

export async function POST(request: NextRequest) {
  try {
    const {
      industry,
      experienceYears,
      skills,
      location,
      urgency = 'medium',
    } = await request.json()

    if (!industry || experienceYears === undefined || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: industry, experienceYears, location' },
        { status: 400 }
      )
    }

    const estimate = estimateSalary({
      industry,
      experienceYears,
      skills: skills || [],
      location,
      urgency,
    })

    return NextResponse.json({
      success: true,
      estimate,
    })
  } catch (error) {
    console.error('[v0] Salary estimation error:', error)
    return NextResponse.json(
      { error: 'Failed to estimate salary' },
      { status: 500 }
    )
  }
}
