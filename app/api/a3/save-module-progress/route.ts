import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyDemoSessionToken, DEMO_COOKIE_NAME } from '@/lib/auth/demo-user'

// Module XP values for validation
const MODULE_XP: Record<string, number> = {
  'career-mirror': 80,
  'value-mining-lab': 100,
  'cv-builder-studio': 120,
  'job-decoder': 100,
  'answer-architecture': 120,
  'coach-practice-room': 130,
  'communication-gym': 140,
  'first-recruiter-simulation': 160,
  'risk-difficult-questions-lab': 170,
  'basic-interview-mission': 220,
}

// Module order for unlock logic
const MODULE_ORDER = [
  'career-mirror',
  'value-mining-lab',
  'cv-builder-studio',
  'job-decoder',
  'answer-architecture',
  'coach-practice-room',
  'communication-gym',
  'first-recruiter-simulation',
  'risk-difficult-questions-lab',
  'basic-interview-mission',
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { moduleId, status, xpEarned, completedActivities } = body

    if (!moduleId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: moduleId and status' },
        { status: 400 }
      )
    }

    // Validate moduleId
    if (!MODULE_XP[moduleId]) {
      return NextResponse.json(
        { error: 'Invalid moduleId' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    
    // Get user from session or signed JWT demo cookie
    const { data: { user } } = await supabase.auth.getUser()
    const cookieStore = await cookies()
    const demoToken = cookieStore.get(DEMO_COOKIE_NAME)?.value
    const demoUser = await verifyDemoSessionToken(demoToken)
    let userId = user?.id ?? demoUser?.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if progress record exists
    const { data: existingProgress, error: fetchError } = await supabase
      .from('a3_user_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('[v0] Error fetching progress:', fetchError)
    }

    const now = new Date().toISOString()
    const xp = xpEarned || MODULE_XP[moduleId] || 0

    if (existingProgress) {
      // Update existing progress
      const moduleStates = existingProgress.module_states || {}
      const completedModuleIds = existingProgress.completed_module_ids || []
      
      moduleStates[moduleId] = status
      
      // Add to completed list if not already there
      if (status === 'completed' && !completedModuleIds.includes(moduleId)) {
        completedModuleIds.push(moduleId)
      }

      // Unlock next module
      const currentIndex = MODULE_ORDER.indexOf(moduleId)
      if (currentIndex < MODULE_ORDER.length - 1 && status === 'completed') {
        const nextModuleId = MODULE_ORDER[currentIndex + 1]
        if (moduleStates[nextModuleId] === 'locked' || !moduleStates[nextModuleId]) {
          moduleStates[nextModuleId] = 'available'
        }
      }

      const newTotalXp = (existingProgress.total_xp || 0) + (status === 'completed' ? xp : 0)

      const { error: updateError } = await supabase
        .from('a3_user_progress')
        .update({
          module_states: moduleStates,
          completed_module_ids: completedModuleIds,
          total_xp: newTotalXp,
          updated_at: now,
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('[v0] Error updating progress:', updateError)
        return NextResponse.json(
          { error: 'Failed to update progress' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        xpAwarded: status === 'completed' ? xp : 0,
        totalXp: newTotalXp,
        moduleStates,
        completedModuleIds,
        nextModuleUnlocked: currentIndex < MODULE_ORDER.length - 1 ? MODULE_ORDER[currentIndex + 1] : null,
      })
    } else {
      // Create new progress record
      const moduleStates: Record<string, string> = {}
      MODULE_ORDER.forEach((id, index) => {
        if (id === moduleId) {
          moduleStates[id] = status
        } else if (index === 0) {
          moduleStates[id] = 'available'
        } else {
          moduleStates[id] = 'locked'
        }
      })

      // Unlock next module if completed
      const currentIndex = MODULE_ORDER.indexOf(moduleId)
      if (currentIndex < MODULE_ORDER.length - 1 && status === 'completed') {
        moduleStates[MODULE_ORDER[currentIndex + 1]] = 'available'
      }

      const completedModuleIds = status === 'completed' ? [moduleId] : []
      const totalXp = status === 'completed' ? xp : 0

      const { error: insertError } = await supabase
        .from('a3_user_progress')
        .insert({
          user_id: userId,
          module_states: moduleStates,
          completed_module_ids: completedModuleIds,
          total_xp: totalXp,
          created_at: now,
          updated_at: now,
        })

      if (insertError) {
        console.error('[v0] Error inserting progress:', insertError)
        return NextResponse.json(
          { error: 'Failed to save progress' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        xpAwarded: totalXp,
        totalXp,
        moduleStates,
        completedModuleIds,
        nextModuleUnlocked: currentIndex < MODULE_ORDER.length - 1 ? MODULE_ORDER[currentIndex + 1] : null,
      })
    }
  } catch (error) {
    console.error('Error in save-module-progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
