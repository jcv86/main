/**
 * Unified User Profile Service
 * 
 * Caches and manages the complete user skill profile across all phases
 * Provides single source of truth for job matching algorithm
 */

import { createClient } from '@/lib/supabase/server'
import { buildUnifiedUserProfile, UnifiedUserProfile } from './extractors'

const PROFILE_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// In-memory cache for profiles
const profileCache = new Map<string, { profile: UnifiedUserProfile; timestamp: number }>()

/**
 * Get or rebuild user's unified profile
 * Uses cache to avoid rebuilding on every request
 */
export async function getUserUnifiedProfile(userId: string): Promise<UnifiedUserProfile> {
  // Check cache
  const cached = profileCache.get(userId)
  if (cached && Date.now() - cached.timestamp < PROFILE_CACHE_TTL) {
    return cached.profile
  }

  // Build fresh profile
  const profile = await buildUnifiedUserProfile(userId)
  
  // Cache it
  profileCache.set(userId, { profile, timestamp: Date.now() })

  // Optionally save to DB for persistence
  await saveUnifiedProfileToDB(userId, profile)

  return profile
}

/**
 * Save unified profile to database for analytics and history
 */
export async function saveUnifiedProfileToDB(
  userId: string,
  profile: UnifiedUserProfile
): Promise<void> {
  try {
    const supabase = await createClient()
    
    await supabase
      .from('user_unified_profiles')
      .upsert(
        {
          user_id: userId,
          all_skills: profile.all_skills,
          skill_proficiency: profile.skill_proficiency,
          experience_level: profile.experience_level,
          specializations: profile.specializations,
          learning_trajectory: profile.learning_trajectory,
          strengths_summary: profile.strengths_summary,
          next_targets: profile.next_targets,
          last_updated: profile.last_updated,
          created_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      )
  } catch (error) {
    console.warn('[v0] Warning: Could not save unified profile to DB:', error)
  }
}

/**
 * Invalidate cache when A1/A2/A3 milestones complete
 */
export function invalidateProfileCache(userId: string): void {
  profileCache.delete(userId)
  console.log(`[v0] Profile cache invalidated for user ${userId}`)
}

/**
 * Get profile skills as array suitable for job matching
 */
export async function getUserSkillsForMatching(userId: string): Promise<string[]> {
  const profile = await getUserUnifiedProfile(userId)
  return profile.all_skills
}

/**
 * Get user's experience level for job matching
 */
export async function getUserExperienceLevel(
  userId: string
): Promise<'junior' | 'mid' | 'senior'> {
  const profile = await getUserUnifiedProfile(userId)
  return profile.experience_level
}

/**
 * Get user's specializations for industry matching
 */
export async function getUserSpecializations(userId: string): Promise<string[]> {
  const profile = await getUserUnifiedProfile(userId)
  return profile.specializations
}

/**
 * Clear all caches (for testing or admin purposes)
 */
export function clearAllProfileCaches(): void {
  profileCache.clear()
  console.log('[v0] All profile caches cleared')
}
