/**
 * Job Matching Database Operations
 * Handles saving and retrieving job match results
 */

import { createClient } from '@/lib/supabase/server'
import type { MatchResult } from '@/lib/algorithms/job-matching'

// Types
interface JobMatchInput {
  userId: string
  jobId: string
  matchScore: number
  matchDetails?: Record<string, any>
  discoveredVia?: string
}

interface MatchedJob {
  jobId: string
  jobTitle: string
  company: string
  matchScore: number
  details?: Record<string, any>
}

/**
 * Match jobs for a user based on their profile
 */
export async function matchJobsForUser(
  userId: string,
  skills: string[],
  experienceLevel: string,
  specializations: string[]
): Promise<MatchedJob[]> {
  // This function runs the job matching algorithm
  // For now, return mock results - in production, run actual algorithm
  
  console.log(`[v0] Matching jobs for user ${userId} with ${skills.length} skills`)
  
  // TODO: Integrate with actual matching algorithm
  return [{
    jobId: 'job_1',
    jobTitle: 'Senior Developer',
    company: 'Tech Co',
    matchScore: 85,
    details: {
      skillsMatched: skills.slice(0, 3),
      experienceMatch: true
    }
  }]
}

/**
 * Save a single job match
 */
export async function saveJobMatch(input: JobMatchInput) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('a4_job_matches_individual').insert([
    {
      user_id: input.userId,
      job_id: input.jobId,
      match_score: input.matchScore,
      match_details: input.matchDetails ? JSON.stringify(input.matchDetails) : null,
      discovered_via: input.discoveredVia || 'algorithm',
      timestamp: new Date().toISOString(),
    },
  ])

  if (error) {
    console.error('[v0] Error saving job match:', error)
    throw error
  }

  return data
}

/**
 * Save job match results for a user
 */
export async function saveJobMatches(
  userId: string,
  matches: MatchResult[]
) {
  const supabase = await createClient()

  // Group by fit category
  const categorized = matches.reduce(
    (acc, match) => {
      if (!acc[match.fit_category]) {
        acc[match.fit_category] = []
      }
      acc[match.fit_category].push(match)
      return acc
    },
    {} as Record<string, MatchResult[]>
  )

  // Insert into database
  const { data, error } = await supabase.from('a4_job_matches').insert([
    {
      user_id: userId,
      timestamp: new Date().toISOString(),
      total_matches: matches.length,
      perfect_count: categorized['perfect']?.length || 0,
      strong_count: categorized['strong']?.length || 0,
      moderate_count: categorized['moderate']?.length || 0,
      potential_count: categorized['potential']?.length || 0,
      low_count: categorized['low']?.length || 0,
      top_10_matches: JSON.stringify(matches.slice(0, 10)),
      all_matches: JSON.stringify(matches),
    },
  ])

  if (error) {
    console.error('Error saving job matches:', error)
    throw error
  }

  return data
}

/**
 * Get latest job matches for a user
 */
export async function getUserJobMatches(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('a4_job_matches')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching job matches:', error)
    throw error
  }

  return data
}

/**
 * Get match statistics for a user
 */
export async function getMatchStatistics(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('a4_job_matches')
    .select('perfect_count, strong_count, moderate_count, potential_count, low_count')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching statistics:', error)
    throw error
  }

  if (!data) {
    return {
      perfect: 0,
      strong: 0,
      moderate: 0,
      potential: 0,
      low: 0,
    }
  }

  return {
    perfect: data.perfect_count || 0,
    strong: data.strong_count || 0,
    moderate: data.moderate_count || 0,
    potential: data.potential_count || 0,
    low: data.low_count || 0,
  }
}

/**
 * Save user interest in a specific job match
 */
export async function saveJobInterest(
  userId: string,
  jobId: string,
  action: 'viewed' | 'saved' | 'applied' | 'dismissed'
) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('a4_job_interests').insert([
    {
      user_id: userId,
      job_id: jobId,
      action,
      timestamp: new Date().toISOString(),
    },
  ])

  if (error) {
    console.error('Error saving job interest:', error)
    throw error
  }

  return data
}

/**
 * Get user's job interest history
 */
export async function getUserJobInterests(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('a4_job_interests')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching job interests:', error)
    throw error
  }

  return data || []
}

/**
 * Track match quality feedback
 */
export async function recordMatchFeedback(
  userId: string,
  matchId: string,
  feedback: {
    helpful?: boolean
    reason?: string
    rating?: number
  }
) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('a4_match_feedback').insert([
    {
      user_id: userId,
      match_id: matchId,
      feedback: JSON.stringify(feedback),
      timestamp: new Date().toISOString(),
    },
  ])

  if (error) {
    console.error('Error recording feedback:', error)
    throw error
  }

  return data
}
