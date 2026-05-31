import { NextRequest, NextResponse } from 'next/server'
import { parseCV } from '@/lib/cv/cv-parser'
import { calculateATSScore, formatSuggestionsForDisplay } from '@/lib/cv/cv-validator'
import { createClient } from '@/lib/supabase/server'
import { getDemoUserFromRequest } from '@/lib/auth/demo-user'

interface CVValidationRequest {
  cvText: string
  jobRequirements?: string[]
}

/**
 * POST /api/a4/cv-validator
 * Validates CV and returns ATS score with suggestions
 */
export async function POST(request: NextRequest) {
  try {
    const { cvText, jobRequirements } = (await request.json()) as CVValidationRequest

    if (!cvText || cvText.trim().length < 100) {
      return NextResponse.json(
        { error: 'CV text must be at least 100 characters' },
        { status: 400 }
      )
    }

    // Parse the CV
    console.log('[v0] Parsing CV for ATS validation')
    const parsedCV = parseCV(cvText)

    // Calculate ATS score
    const atsScore = calculateATSScore(parsedCV, jobRequirements)

    console.log(`[v0] ATS Score calculated: ${atsScore.overallScore}`)

    // Check for demo user or authenticated user
    const demoUser = getDemoUserFromRequest(request)
    let userId: string | null = null

    if (!demoUser) {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id || null
    }

    // Save validation result if authenticated
    if (userId) {
      try {
        const supabase = await createClient()
        await supabase
          .from('a4_cv_validations')
          .insert({
            user_id: userId,
            cv_text: cvText.substring(0, 5000), // Store first 5000 chars
            ats_score: atsScore.overallScore,
            category_scores: atsScore.categoryScores,
            suggestions: atsScore.suggestions,
            strengths: atsScore.strengths,
            estimated_ats_pass_rate: atsScore.estimatedATSPassRate,
            job_requirements: jobRequirements,
            created_at: new Date().toISOString()
          })
        console.log(`[v0] CV validation saved for user ${userId}`)
      } catch (dbError) {
        console.warn('[v0] Could not save CV validation:', dbError)
        // Continue - don't fail if DB save fails
      }
    }

    return NextResponse.json({
      success: true,
      atsScore: {
        overall: atsScore.overallScore,
        categories: atsScore.categoryScores,
        estimatedPassRate: atsScore.estimatedATSPassRate
      },
      suggestions: atsScore.suggestions,
      strengths: atsScore.strengths,
      recommendations: atsScore.recommendations,
      extractedData: {
        skills: parsedCV.extractedSkills,
        experienceCount: parsedCV.extractedExperience.length,
        educationCount: parsedCV.extractedEducation.length,
        contactInfo: parsedCV.contactInfo
      },
      displayText: formatSuggestionsForDisplay(atsScore.suggestions)
    })
  } catch (error) {
    console.error('[v0] CV validation error:', error)
    return NextResponse.json(
      {
        error: 'Error validating CV',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/a4/cv-validator
 * Retrieve CV validation history
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: validations } = await supabase
      .from('a4_cv_validations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      validations: validations || [],
      success: true
    })
  } catch (error) {
    console.error('[v0] CV history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CV validations' },
      { status: 500 }
    )
  }
}
