import { createClient } from '@/lib/supabase/server'
import { matchUserToJobs, filterByMatchScore } from '@/lib/algorithms/job-matching'
import type { UserProfile, JobListing, MatchResult } from '@/lib/algorithms/job-matching'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const minScore = parseInt(searchParams.get('minScore') || '50')
    const limit = parseInt(searchParams.get('limit') || '20')

    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user profile (combine from multiple tables)
    const [userProfile, userJobs, userCv] = await Promise.all([
      supabase.from('users').select('*').eq('id', user.id).single(),
      supabase.from('job_recommendations').select('*').eq('user_id', user.id),
      supabase.from('cv_data').select('*').eq('user_id', user.id).single(),
    ])

    if (userProfile.error && userProfile.error.code !== 'PGRST116') {
      throw userProfile.error
    }

    // Build user profile from available data
    const profile: UserProfile = {
      id: user.id,
      email: user.email || '',
      skills: (userCv.data?.skills as string[]) || [],
      experience_years: 0,
      education: (userCv.data?.education as string[]) || [],
      languages: (userCv.data?.languages as string[]) || [],
    }

    // Fetch all active jobs
    const { data: allJobs, error: jobsError } = await supabase
      .from('job_listings')
      .select('*')
      .eq('status', 'active')
      .is('expires_date', null)
      .order('posted_date', { ascending: false })
      .limit(100)

    if (jobsError) {
      console.error('Error fetching jobs:', jobsError)
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
    }

    // Match user to jobs
    const matches = matchUserToJobs(profile, allJobs as JobListing[])

    // Filter by minimum score
    const filtered = filterByMatchScore(matches, minScore)

    // Return top N matches
    const topMatches = filtered.slice(0, limit)

    // Enrich with full job details
    const enriched = topMatches.map((match) => {
      const job = allJobs?.find((j: any) => j.id === match.job_id)
      return {
        ...match,
        job,
      }
    })

    return NextResponse.json({
      success: true,
      total_jobs: allJobs?.length || 0,
      total_matches: filtered.length,
      results: enriched,
      user_profile: profile,
    })
  } catch (error) {
    console.error('Job matching error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
