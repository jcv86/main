import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/admin/pillar-unlock
 * Admin endpoint to manually unlock pillars for users
 * Requires admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user is admin (Travis dev account or admin role)
    const { data: adminCheck } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const isTravisDev = user.email === 'travis@nuanu.com'
    
    if (!adminCheck && !isTravisDev) {
      return NextResponse.json(
        { error: 'Not authorized - admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { targetUserId, pillar, action } = body

    if (!targetUserId || !pillar || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: targetUserId, pillar, action' },
        { status: 400 }
      )
    }

    if (!['a1', 'a2', 'a3', 'a4'].includes(pillar)) {
      return NextResponse.json(
        { error: 'Invalid pillar. Must be a1, a2, a3, or a4' },
        { status: 400 }
      )
    }

    if (!['unlock', 'reset'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be unlock or reset' },
        { status: 400 }
      )
    }

    let result = {}

    if (action === 'unlock') {
      // Create completion record for the pillar
      if (pillar === 'a1') {
        const { data, error } = await supabase
          .from('a1_identity')
          .upsert(
            {
              user_id: targetUserId,
              name: '[Admin Unlocked] A1 Identity',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )
          .select()
        
        if (error) throw error
        result = data
      } else if (pillar === 'a2') {
        // Mark last day of A2 as completed
        const { data, error } = await supabase
          .from('a2_user_task_completions')
          .upsert(
            {
              user_id: targetUserId,
              day: 90,
              completed_at: new Date().toISOString(),
              submission_data: { admin_unlock: true },
              is_demo: false,
            },
            { onConflict: 'user_id,day' }
          )
          .select()
        
        if (error) throw error
        result = data
      } else if (pillar === 'a3') {
        // Create a3 completion record
        const { data, error } = await supabase
          .from('a3_module_completions')
          .insert({
            user_id: targetUserId,
            module_id: 'admin-unlock',
            completed_at: new Date().toISOString(),
          })
          .select()
        
        if (error) throw error
        result = data
      } else if (pillar === 'a4') {
        // Create a4 document record
        const { data, error } = await supabase
          .from('a4_strategic_documents')
          .insert({
            user_id: targetUserId,
            title: '[Admin Unlocked] Strategic Document',
            content: '{}',
            created_at: new Date().toISOString(),
          })
          .select()
        
        if (error) throw error
        result = data
      }
    } else if (action === 'reset') {
      // Delete completion records for the pillar
      if (pillar === 'a1') {
        const { error } = await supabase
          .from('a1_identity')
          .delete()
          .eq('user_id', targetUserId)
        
        if (error) throw error
      } else if (pillar === 'a2') {
        const { error } = await supabase
          .from('a2_user_task_completions')
          .delete()
          .eq('user_id', targetUserId)
        
        if (error) throw error
      } else if (pillar === 'a3') {
        const { error } = await supabase
          .from('a3_module_completions')
          .delete()
          .eq('user_id', targetUserId)
        
        if (error) throw error
      } else if (pillar === 'a4') {
        const { error } = await supabase
          .from('a4_strategic_documents')
          .delete()
          .eq('user_id', targetUserId)
        
        if (error) throw error
      }
      
      result = { status: 'reset' }
    }

    // Log admin action (non-blocking)
    try {
      await supabase
        .from('admin_audit_log')
        .insert({
          admin_id: user.id,
          action: `${action}_pillar`,
          target_user_id: targetUserId,
          target_pillar: pillar,
          details: { action, pillar, targetUserId },
          created_at: new Date().toISOString(),
        })
    } catch (logError) {
      console.error('[v0] Failed to log admin action:', logError)
      // Don't throw - logging failure shouldn't fail the main request
    }

    console.log('[v0] Admin action completed:', {
      admin: user.email,
      targetUser: targetUserId,
      pillar,
      action,
    })

    return NextResponse.json({
      success: true,
      message: `Pillar ${pillar} ${action}ed for user ${targetUserId}`,
      result,
    })
  } catch (error) {
    console.error('[v0] Error in admin pillar-unlock:', error)
    return NextResponse.json(
      { error: 'Failed to process admin action', details: String(error) },
      { status: 500 }
    )
  }
}
