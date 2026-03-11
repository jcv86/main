import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string; notificationId: string } }
) {
  try {
    const supabase = await createClient()
    const { userId, notificationId } = params
    const body = await request.json()

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify notification belongs to user
    const { data: notification } = await supabase
      .from('notifications')
      .select('id')
      .eq('id', notificationId)
      .eq('user_id', userId)
      .maybeSingle()

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    const { data, error } = await supabase
      .from('notifications')
      .update({
        read: body.read,
        updated_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('[v0] Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string; notificationId: string } }
) {
  try {
    const supabase = await createClient()
    const { userId, notificationId } = params

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}
