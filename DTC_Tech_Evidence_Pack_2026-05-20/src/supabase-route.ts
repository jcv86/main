import { createClient } from '@supabase/supabase-js'
import type { UserRouteState, A2RouteState, A3RouteState } from '@/lib/route-state.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// ═══════════════════════════════════════════════════════════════════════════
// Route State Persistence
// ═══════════════════════════════════════════════════════════════════════════

export async function loadUserRouteState(userId: string): Promise<UserRouteState | null> {
  try {
    const { data, error } = await supabase
      .from('user_route_states')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('[v0] Error loading route state:', error)
      return null
    }

    if (!data) return null

    // Parse JSON fields
    return {
      ...data,
      c1: data.c1_data ? JSON.parse(data.c1_data) : null,
      a1: data.a1_data ? JSON.parse(data.a1_data) : null,
      c2: data.c2_data ? JSON.parse(data.c2_data) : null,
      a2: data.a2_data ? JSON.parse(data.a2_data) : null,
      a3: data.a3_data ? JSON.parse(data.a3_data) : null,
      lastUpdated: new Date(data.last_updated),
      createdAt: new Date(data.created_at),
      seededAt: data.seeded_at ? new Date(data.seeded_at) : null,
    }
  } catch (err) {
    console.error('[v0] Exception loading route state:', err)
    return null
  }
}

export async function saveUserRouteState(userId: string, state: UserRouteState): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_route_states')
      .upsert(
        {
          user_id: userId,
          mode: state.mode,
          status: state.status,
          c1_data: state.c1 ? JSON.stringify(state.c1) : null,
          a1_data: state.a1 ? JSON.stringify(state.a1) : null,
          c2_data: state.c2 ? JSON.stringify(state.c2) : null,
          a2_data: state.a2 ? JSON.stringify(state.a2) : null,
          a3_data: state.a3 ? JSON.stringify(state.a3) : null,
          data_quality: JSON.stringify(state.dataQuality),
          seeded_data_used: state.seededDataUsed,
          last_updated: new Date(),
          seeded_at: state.seededAt,
          seeded_by: state.seededBy,
        },
        { onConflict: 'user_id' }
      )

    if (error) {
      console.error('[v0] Error saving route state:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('[v0] Exception saving route state:', err)
    return false
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// A2 Progress Tracking
// ═══════════════════════════════════════════════════════════════════════════

export async function markA2DayComplete(
  userId: string,
  dayNumber: number,
  xpEarned: number = 0
): Promise<boolean> {
  try {
    const state = await loadUserRouteState(userId)
    if (!state?.a2) return false

    // Update day status
    state.a2.days[dayNumber].status = 'completed'
    state.a2.days[dayNumber].completedAt = new Date()

    // Unlock next day
    if (dayNumber < 90) {
      state.a2.days[dayNumber + 1].status = 'available'
    }

    state.a2.totalDaysCompleted += 1
    state.a2.xpEarned += xpEarned
    state.lastUpdated = new Date()

    // Save updated state
    return await saveUserRouteState(userId, state)
  } catch (err) {
    console.error('[v0] Error marking A2 day complete:', err)
    return false
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// A3 Progress Tracking
// ═══════════════════════════════════════════════════════════════════════════

export async function markA3ModuleComplete(
  userId: string,
  moduleId: string,
  xpEarned: number = 0
): Promise<boolean> {
  try {
    const state = await loadUserRouteState(userId)
    if (!state?.a3) return false

    const module = state.a3.modules[moduleId]
    if (!module) return false

    module.certificationStatus = 'certified'
    module.status = 'completed'
    module.certifiedAt = new Date()
    state.a3.completedModuleCount += 1
    state.a3.totalXp += xpEarned

    // Check if all modules completed
    const allCompleted = Object.values(state.a3.modules).every(
      m => m.certificationStatus === 'certified'
    )
    if (allCompleted) {
      state.a3.completedAt = new Date()
    }

    state.lastUpdated = new Date()

    // Save updated state
    return await saveUserRouteState(userId, state)
  } catch (err) {
    console.error('[v0] Error marking A3 module complete:', err)
    return false
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// C1, A1, C2 Data Persistence
// ═══════════════════════════════════════════════════════════════════════════

export async function updateC1Identity(userId: string, c1Data: any): Promise<boolean> {
  try {
    const state = await loadUserRouteState(userId)
    if (!state) return false

    state.c1 = c1Data
    state.dataQuality.c1Complete = true
    state.lastUpdated = new Date()

    return await saveUserRouteState(userId, state)
  } catch (err) {
    console.error('[v0] Error updating C1 identity:', err)
    return false
  }
}

export async function updateA1Profile(userId: string, a1Data: any): Promise<boolean> {
  try {
    const state = await loadUserRouteState(userId)
    if (!state) return false

    state.a1 = a1Data
    state.dataQuality.a1Complete = true
    state.lastUpdated = new Date()

    return await saveUserRouteState(userId, state)
  } catch (err) {
    console.error('[v0] Error updating A1 profile:', err)
    return false
  }
}

export async function updateC2Vault(userId: string, c2Data: any): Promise<boolean> {
  try {
    const state = await loadUserRouteState(userId)
    if (!state) return false

    state.c2 = c2Data
    state.dataQuality.c2Complete = true
    state.lastUpdated = new Date()

    return await saveUserRouteState(userId, state)
  } catch (err) {
    console.error('[v0] Error updating C2 vault:', err)
    return false
  }
}
