/**
 * Admin Dashboard & Platform Management
 * 
 * Comprehensive admin tools for user management, content management, and platform health
 */

import { createClient } from '@/lib/supabase/server'

export interface AdminUser {
  userId: string
  email: string
  status: 'active' | 'paused' | 'completed'
  joinDate: Date
  completionRate: number
  lastActivityDate: Date | null
  modulesCompleted: number
  averageScore: number
}

export interface PlatformMetrics {
  totalUsers: number
  activeUsers: number
  averageCompletion: number
  averageScore: number
  totalModulesCompleted: number
  avgModulesPerUser: number
  daysToCompletion: number
  userRetention: number
}

export interface ContentMetrics {
  totalModules: number
  avgModuleCompletion: number
  avgModuleScore: number
  topModule: { id: string; completions: number }
  bottomModule: { id: string; completions: number }
  documentCount: number
}

/**
 * Get list of all users with admin view
 */
export async function getAllUsersForAdmin(limit: number = 50, offset: number = 0): Promise<{
  success: boolean
  users?: AdminUser[]
  total?: number
  error?: string
}> {
  try {
    const supabase = await createClient()

    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check admin role
    const { data: adminCheck } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!adminCheck) {
      return { success: false, error: 'Admin access required' }
    }

    // Get users
    const { data: profiles, error: profileError } = await supabase
      .from('despega_user_profiles')
      .select('*')
      .range(offset, offset + limit - 1)

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    // Get total count
    const { count } = await supabase
      .from('despega_user_profiles')
      .select('*', { count: 'exact', head: true })

    // Enrich with metrics
    const users: AdminUser[] = await Promise.all(
      profiles.map(async (profile: any) => {
        const { data: sessions } = await supabase
          .from('a3_session_attempts')
          .select('*')
          .eq('user_id', profile.user_id)

        const completed = sessions?.filter((s: any) => s.status === 'completed').length || 0
        const scores = sessions?.map((s: any) => s.score).filter(Boolean) || []
        const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

        return {
          userId: profile.user_id,
          email: profile.email || 'no-email',
          status: profile.status || 'active',
          joinDate: new Date(profile.created_at),
          completionRate: (completed / 10) * 100,
          lastActivityDate: sessions?.[sessions.length - 1]?.created_at ? new Date(sessions[sessions.length - 1].created_at) : null,
          modulesCompleted: completed,
          averageScore: Math.round(avgScore),
        }
      })
    )

    return {
      success: true,
      users,
      total: count || 0,
    }
  } catch (error) {
    console.error('[v0] Error getting users for admin:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * Get comprehensive platform metrics
 */
export async function getPlatformMetrics(): Promise<{
  success: boolean
  metrics?: PlatformMetrics
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify admin
    const { data: adminCheck } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!adminCheck) {
      return { success: false, error: 'Admin access required' }
    }

    // Get all users and sessions
    const { data: profiles } = await supabase
      .from('despega_user_profiles')
      .select('*')

    const { data: sessions } = await supabase
      .from('a3_session_attempts')
      .select('*')

    const totalUsers = profiles?.length || 0
    const activeUsers = profiles?.filter((p: any) => p.status === 'active').length || 0

    const completedSessions = sessions?.filter((s: any) => s.status === 'completed') || []
    const totalCompleted = completedSessions.length
    const avgCompletion = totalUsers > 0 ? (totalCompleted / (totalUsers * 10)) * 100 : 0

    const scores = sessions?.map((s: any) => s.score).filter(Boolean) || []
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

    // Calculate retention (users active in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const activeLastMonth = profiles?.filter((p: any) => new Date(p.updated_at) > thirtyDaysAgo).length || 0
    const retention = totalUsers > 0 ? (activeLastMonth / totalUsers) * 100 : 0

    return {
      success: true,
      metrics: {
        totalUsers,
        activeUsers,
        averageCompletion: Math.round(avgCompletion),
        averageScore: Math.round(avgScore),
        totalModulesCompleted: totalCompleted,
        avgModulesPerUser: totalUsers > 0 ? totalCompleted / totalUsers : 0,
        daysToCompletion: 90,
        userRetention: Math.round(retention),
      },
    }
  } catch (error) {
    console.error('[v0] Error getting platform metrics:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * Get content performance metrics
 */
export async function getContentMetrics(): Promise<{
  success: boolean
  metrics?: ContentMetrics
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify admin
    const { data: adminCheck } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!adminCheck) {
      return { success: false, error: 'Admin access required' }
    }

    const { data: sessions } = await supabase
      .from('a3_session_attempts')
      .select('*')

    const { data: documents } = await supabase
      .from('dtc_documents')
      .select('*')

    // Group by module
    const moduleStats = {} as Record<string, { completions: number; scores: number[] }>

    sessions?.forEach((session: any) => {
      if (!moduleStats[session.module_id]) {
        moduleStats[session.module_id] = { completions: 0, scores: [] }
      }
      if (session.status === 'completed') {
        moduleStats[session.module_id].completions++
      }
      if (session.score) {
        moduleStats[session.module_id].scores.push(session.score)
      }
    })

    const totalModules = Object.keys(moduleStats).length
    const avgCompletions = Object.values(moduleStats).reduce((sum, m) => sum + m.completions, 0) / Math.max(totalModules, 1)
    const allScores = Object.values(moduleStats).flatMap((m) => m.scores)
    const avgScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0

    // Find top and bottom modules
    const sorted = Object.entries(moduleStats).sort((a, b) => b[1].completions - a[1].completions)
    const topModule = sorted[0] ? { id: sorted[0][0], completions: sorted[0][1].completions } : { id: 'none', completions: 0 }
    const bottomModule = sorted[sorted.length - 1] ? { id: sorted[sorted.length - 1][0], completions: sorted[sorted.length - 1][1].completions } : { id: 'none', completions: 0 }

    return {
      success: true,
      metrics: {
        totalModules,
        avgModuleCompletion: Math.round(avgCompletions),
        avgModuleScore: Math.round(avgScore),
        topModule,
        bottomModule,
        documentCount: documents?.length || 0,
      },
    }
  } catch (error) {
    console.error('[v0] Error getting content metrics:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * Update user status (admin only)
 */
export async function updateUserStatus(
  targetUserId: string,
  status: 'active' | 'paused' | 'completed'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify admin
    const { data: adminCheck } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!adminCheck) {
      return { success: false, error: 'Admin access required' }
    }

    // Update user
    const { error } = await supabase
      .from('despega_user_profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('user_id', targetUserId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Log admin action
    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: `update_user_status`,
      target_user_id: targetUserId,
      details: { status },
      created_at: new Date().toISOString(),
    })

    return { success: true }
  } catch (error) {
    console.error('[v0] Error updating user status:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * Export user data (admin audit/compliance)
 */
export async function exportUserData(targetUserId: string): Promise<{
  success: boolean
  data?: Record<string, any>
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify admin
    const { data: adminCheck } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!adminCheck) {
      return { success: false, error: 'Admin access required' }
    }

    // Fetch all user data
    const [{ data: profile }, { data: sessions }, { data: documents }, { data: memories }] = await Promise.all([
      supabase.from('despega_user_profiles').select('*').eq('user_id', targetUserId).single(),
      supabase.from('a3_session_attempts').select('*').eq('user_id', targetUserId),
      supabase.from('dtc_documents').select('*').eq('user_id', targetUserId),
      supabase.from('memory_items').select('*').eq('user_id', targetUserId),
    ])

    // Log export
    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: `export_user_data`,
      target_user_id: targetUserId,
      details: { export_date: new Date().toISOString() },
      created_at: new Date().toISOString(),
    })

    return {
      success: true,
      data: {
        profile,
        sessions,
        documents,
        memories,
        exportDate: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error('[v0] Error exporting user data:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}

export default {
  getAllUsersForAdmin,
  getPlatformMetrics,
  getContentMetrics,
  updateUserStatus,
  exportUserData,
}
