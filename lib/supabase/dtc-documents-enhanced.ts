'use client'

import { createClient } from '@/lib/supabase/client'

export interface DTCTestResult {
  id: string
  user_id: string
  test_type: string
  test_name: string | null
  score: number | null
  results: Record<string, unknown>
  interpretation: string | null
  tags: string[]
  created_at: string
  completed_at: string | null
  metadata: Record<string, unknown>
}

export interface DTCActivityArtifact {
  id: string
  user_id: string
  activity_type: string
  day_number: number | null
  phase: string | null
  title: string
  description: string | null
  artifact_type: string
  content_url: string | null
  content: Record<string, unknown> | null
  duration_seconds: number | null
  file_size_bytes: number | null
  tags: string[]
  coach_feedback: string | null
  ai_summary: string | null
  created_at: string
  completed_at: string | null
  metadata: Record<string, unknown>
}

export interface DTCProgressMilestone {
  id: string
  user_id: string
  phase: string
  cycle_number: number | null
  milestone_type: string
  title: string
  description: string | null
  achieved_at: string | null
  xp_earned: number
  points_earned: number
  badges_earned: string[]
  streak_count: number | null
  created_at: string
  metadata: Record<string, unknown>
}

// Test Results Queries
export async function getAllUserTestResults(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('dtc_test_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching test results:', error)
    return []
  }
  return data as DTCTestResult[]
}

export async function getTestResultsByType(userId: string, testType: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('dtc_test_results')
    .select('*')
    .eq('user_id', userId)
    .eq('test_type', testType)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching test results by type:', error)
    return []
  }
  return data as DTCTestResult[]
}

// Activity Artifacts Queries
export async function getAllUserActivityArtifacts(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('dtc_activity_artifacts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching activity artifacts:', error)
    return []
  }
  return data as DTCActivityArtifact[]
}

export async function getActivityArtifactsByPhase(userId: string, phase: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('dtc_activity_artifacts')
    .select('*')
    .eq('user_id', userId)
    .eq('activity_type', phase)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching artifacts by phase:', error)
    return []
  }
  return data as DTCActivityArtifact[]
}

// Progress Milestones Queries
export async function getAllUserMilestones(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('dtc_progress_milestones')
    .select('*')
    .eq('user_id', userId)
    .order('achieved_at', { ascending: false, nullsFirst: false })

  if (error) {
    console.error('[v0] Error fetching milestones:', error)
    return []
  }
  return data as DTCProgressMilestone[]
}

export async function getMilestonesByPhase(userId: string, phase: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('dtc_progress_milestones')
    .select('*')
    .eq('user_id', userId)
    .eq('phase', phase)
    .order('achieved_at', { ascending: false, nullsFirst: false })

  if (error) {
    console.error('[v0] Error fetching milestones by phase:', error)
    return []
  }
  return data as DTCProgressMilestone[]
}

// Get comprehensive dashboard data
export async function getComprehensiveDashboardData(userId: string) {
  try {
    const [testResults, artifacts, milestones] = await Promise.all([
      getAllUserTestResults(userId),
      getAllUserActivityArtifacts(userId),
      getAllUserMilestones(userId),
    ])

    // Calculate stats
    const stats = {
      totalTests: testResults.length,
      completedTests: testResults.filter((t) => t.completed_at).length,
      totalArtifacts: artifacts.length,
      completedPhases: milestones.filter((m) => m.milestone_type === 'phase_completion')
        .length,
      totalXP: milestones.reduce((sum, m) => sum + m.xp_earned, 0),
      totalPoints: milestones.reduce((sum, m) => sum + m.points_earned, 0),
    }

    return {
      testResults,
      artifacts,
      milestones,
      stats,
    }
  } catch (err) {
    console.error('[v0] Error fetching comprehensive data:', err)
    return {
      testResults: [],
      artifacts: [],
      milestones: [],
      stats: {
        totalTests: 0,
        completedTests: 0,
        totalArtifacts: 0,
        completedPhases: 0,
        totalXP: 0,
        totalPoints: 0,
      },
    }
  }
}

// Insert methods
export async function insertTestResult(
  userId: string,
  testType: string,
  testName: string,
  results: Record<string, unknown>,
  interpretation?: string,
  tags?: string[]
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('dtc_test_results')
    .insert([
      {
        user_id: userId,
        test_type: testType,
        test_name: testName,
        results,
        interpretation: interpretation || null,
        tags: tags || [],
        completed_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error('[v0] Error inserting test result:', error)
    return null
  }
  return data?.[0]
}

export async function insertActivityArtifact(
  userId: string,
  activityType: string,
  title: string,
  artifactType: string,
  options?: {
    dayNumber?: number
    phase?: string
    description?: string
    contentUrl?: string
    content?: Record<string, unknown>
    durationSeconds?: number
    tags?: string[]
    coachFeedback?: string
    aiSummary?: string
  }
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('dtc_activity_artifacts')
    .insert([
      {
        user_id: userId,
        activity_type: activityType,
        title,
        artifact_type: artifactType,
        day_number: options?.dayNumber || null,
        phase: options?.phase || null,
        description: options?.description || null,
        content_url: options?.contentUrl || null,
        content: options?.content || null,
        duration_seconds: options?.durationSeconds || null,
        tags: options?.tags || [],
        coach_feedback: options?.coachFeedback || null,
        ai_summary: options?.aiSummary || null,
        completed_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error('[v0] Error inserting activity artifact:', error)
    return null
  }
  return data?.[0]
}

export async function insertMilestone(
  userId: string,
  phase: string,
  milestoneType: string,
  title: string,
  options?: {
    cycleNumber?: number
    description?: string
    xpEarned?: number
    pointsEarned?: number
    badgesEarned?: string[]
    streakCount?: number
  }
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('dtc_progress_milestones')
    .insert([
      {
        user_id: userId,
        phase,
        milestone_type: milestoneType,
        title,
        cycle_number: options?.cycleNumber || null,
        description: options?.description || null,
        xp_earned: options?.xpEarned || 0,
        points_earned: options?.pointsEarned || 0,
        badges_earned: options?.badgesEarned || [],
        streak_count: options?.streakCount || null,
        achieved_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error('[v0] Error inserting milestone:', error)
    return null
  }
  return data?.[0]
}
