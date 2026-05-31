import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!adminRole) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get user ID from query params
    const targetUserId = request.nextUrl.searchParams.get('userId')
    if (!targetUserId) {
      return NextResponse.json({ error: 'userId query parameter required' }, { status: 400 })
    }

    // Get user's current pillar access
    const { data: pillarAccess } = await supabase
      .from('pillar_access')
      .select('*')
      .eq('user_id', targetUserId)

    // Get user profile to show their info
    const { data: userProfile } = await supabase
      .from('despega_user_profiles')
      .select('*')
      .eq('user_id', targetUserId)
      .single()

    return NextResponse.json({
      success: true,
      userId: targetUserId,
      user: userProfile,
      pillarAccess: pillarAccess || [],
      availablePillars: ['C1', 'A1', 'C2', 'A2', 'A3', 'A4'],
    })
  } catch (error) {
    console.error('[v0] Error getting pillar access:', error)
    return NextResponse.json({ error: 'Failed to get pillar access' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!adminRole) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { targetUserId, pillarCode, access } = await request.json() as {
      targetUserId: string
      pillarCode: string
      access: 'granted' | 'denied' | 'locked'
    }

    if (!targetUserId || !pillarCode || !access) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const validPillars = ['C1', 'A1', 'C2', 'A2', 'A3', 'A4']
    if (!validPillars.includes(pillarCode)) {
      return NextResponse.json({ error: 'Invalid pillar code' }, { status: 400 })
    }

    // Update or create pillar access record
    const { error: upsertError } = await supabase
      .from('pillar_access')
      .upsert(
        {
          user_id: targetUserId,
          pillar_code: pillarCode,
          access_status: access,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,pillar_code' }
      )

    if (upsertError) {
      console.error('[v0] Error updating pillar access:', upsertError)
      return NextResponse.json({ error: 'Failed to update pillar access' }, { status: 500 })
    }

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_user_id: user.id,
        action: 'pillar_access_updated',
        target_user_id: targetUserId,
        details: { pillarCode, access },
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      })

    return NextResponse.json({
      success: true,
      message: `Pillar ${pillarCode} access updated to ${access}`,
      targetUserId,
      pillarCode,
      access,
    })
  } catch (error) {
    console.error('[v0] Error updating pillar access:', error)
    return NextResponse.json({ error: 'Failed to update pillar access' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!adminRole) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { targetUserId, pillarCode } = await request.json() as {
      targetUserId: string
      pillarCode: string
    }

    if (!targetUserId || !pillarCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Delete pillar access record
    const { error: deleteError } = await supabase
      .from('pillar_access')
      .delete()
      .eq('user_id', targetUserId)
      .eq('pillar_code', pillarCode)

    if (deleteError) {
      console.error('[v0] Error deleting pillar access:', deleteError)
      return NextResponse.json({ error: 'Failed to delete pillar access' }, { status: 500 })
    }

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_user_id: user.id,
        action: 'pillar_access_deleted',
        target_user_id: targetUserId,
        details: { pillarCode },
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      })

    return NextResponse.json({
      success: true,
      message: `Pillar ${pillarCode} access removed for user`,
      targetUserId,
      pillarCode,
    })
  } catch (error) {
    console.error('[v0] Error deleting pillar access:', error)
    return NextResponse.json({ error: 'Failed to delete pillar access' }, { status: 500 })
  }
}
