import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import { matchUserToJobs, filterByMatchScore } from '@/lib/algorithms/job-matching'
import type { UserProfile, JobListing } from '@/lib/algorithms/job-matching'

export const runtime = 'nodejs'

function boundedInteger(
  rawValue: string | null,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  if (rawValue === null || rawValue.trim() === '') return fallback
  const parsed = Number.parseInt(rawValue, 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(maximum, Math.max(minimum, parsed))
}

export async function GET(request: Request) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const access = await checkA4Access(currentUser.id, supabase)
    if (!access.canAccess) {
      return NextResponse.json(
        { error: getA4AccessDenialMessage(), code: access.reason },
        { status: 403 },
      )
    }

    const { searchParams } = new URL(request.url)
    const minScore = boundedInteger(searchParams.get('minScore'), 50, 0, 100)
    const limit = boundedInteger(searchParams.get('limit'), 20, 1, 50)

    const { data: cvData, error: cvError } = await supabase
      .from('cv_data')
      .select('skills, education, languages')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    if (cvError) {
      console.error('[v0] A4 job matching CV error:', cvError)
      return NextResponse.json(
        { error: 'No pudimos cargar el perfil para calcular coincidencias.' },
        { status: 500 },
      )
    }

    const profile: UserProfile = {
      id: currentUser.id,
      email: '',
      skills: Array.isArray(cvData?.skills) ? (cvData.skills as string[]) : [],
      experience_years: 0,
      education: Array.isArray(cvData?.education)
        ? (cvData.education as string[])
        : [],
      languages: Array.isArray(cvData?.languages)
        ? (cvData.languages as string[])
        : [],
    }

    const today = new Date().toISOString().slice(0, 10)
    const { data: allJobs, error: jobsError } = await supabase
      .from('job_listings')
      .select('*')
      .eq('status', 'active')
      .or(`expires_date.is.null,expires_date.gte.${today}`)
      .order('posted_date', { ascending: false })
      .limit(100)

    if (jobsError) {
      console.error('[v0] A4 job matching jobs error:', jobsError)
      return NextResponse.json(
        { error: 'No pudimos cargar las oportunidades disponibles.' },
        { status: 500 },
      )
    }

    const jobs = (allJobs ?? []) as JobListing[]
    const matches = matchUserToJobs(profile, jobs)
    const filtered = filterByMatchScore(matches, minScore)
    const topMatches = filtered.slice(0, limit)
    const jobById = new Map(jobs.map((job) => [job.id, job]))

    return NextResponse.json({
      success: true,
      total_jobs: jobs.length,
      total_matches: filtered.length,
      min_score: minScore,
      limit,
      results: topMatches.map((match) => ({
        ...match,
        job: jobById.get(match.job_id) ?? null,
      })),
    })
  } catch (error) {
    console.error('[v0] A4 job matching error:', error)
    return NextResponse.json(
      { error: 'No pudimos calcular las coincidencias laborales.' },
      { status: 500 },
    )
  }
}
