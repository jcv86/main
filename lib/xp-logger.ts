/**
 * XP Logger Utility
 * 
 * Centralized service for logging XP activities to the audit trail.
 * Used by A3, A4, and interview handlers to record XP gains.
 */

export type XPSection = 'A3' | 'A4' | 'INTERVIEW' | 'BONUS'

interface XPActivityOptions {
  section: XPSection
  activity_type: string
  xp_amount: number
  reference_id?: string
  metadata?: Record<string, any>
}

/**
 * Log an XP activity to the audit trail
 * 
 * This function sends the XP activity to the API endpoint, which:
 * 1. Logs it to xp_activity_logs table
 * 2. Triggers automatic recalculation of user_gamification_profile
 * 3. Returns updated profile with new XP totals
 * 
 * @example
 * await logXPActivity({
 *   section: 'A3',
 *   activity_type: 'interview_completion',
 *   xp_amount: 150,
 *   reference_id: interview.id,
 *   metadata: { score: 85, difficulty: 'hard' }
 * })
 */
export async function logXPActivity(options: XPActivityOptions) {
  try {
    const response = await fetch('/api/gamification/xp-activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`XP activity logging failed: ${response.status}`)
    }

    const data = await response.json()
    console.log(
      `[v0] XP logged: +${options.xp_amount} XP for ${options.activity_type} (${options.section})`
    )
    return data
  } catch (error) {
    console.error('[v0] Error logging XP activity:', error)
    throw error
  }
}

/**
 * Get XP activity history for the current user
 * 
 * @param section Optional: Filter by section (A3, A4, INTERVIEW, BONUS)
 * @param limit Number of records to fetch (default: 50)
 */
export async function getXPActivities(section?: XPSection, limit: number = 50) {
  try {
    const params = new URLSearchParams()
    params.set('limit', limit.toString())
    if (section) {
      params.set('section', section)
    }

    const response = await fetch(`/api/gamification/xp-activity?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch XP activities: ${response.status}`)
    }

    const data = await response.json()
    return data.activities || []
  } catch (error) {
    console.error('[v0] Error fetching XP activities:', error)
    throw error
  }
}

/**
 * XP Reward Calculator
 * 
 * Centralized logic for calculating XP amounts based on activity type and difficulty
 */
export const XP_REWARDS = {
  // A3: Training Section
  A3: {
    INTERVIEW_BASIC: 50,
    INTERVIEW_GUIDED: 150,
    INTERVIEW_STRUCTURED: 200,
    INTERVIEW_CHALLENGING: 300,
    PERFECT_SCORE_BONUS: (score: number) => score >= 95 ? 100 : score >= 85 ? 50 : 0,
  },
  
  // A4: Modules Section
  A4: {
    MODULE_STARTED: 10,
    MODULE_50_PERCENT: 50,
    MODULE_100_PERCENT: 150,
    ALL_MODULES_COMPLETE: 500,
  },
  
  // Interview Bonuses
  INTERVIEW: {
    COMPLETION: 50,
    PERFECT_SCORE: 250,
    STREAK_BONUS: (streak: number) => Math.floor(streak / 5) * 25,
  },
  
  // Special Bonuses
  BONUS: {
    REFERRAL: 500,
    FIRST_WEEK_COMPLETE: 200,
    STREAK_7_DAYS: 300,
    STREAK_30_DAYS: 1000,
  },
}
