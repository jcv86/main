import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUnreadNotifications, markNotificationAsRead } from '@/lib/notifications/job-notifications'

/**
 * GET /api/notifications/unread - Get unread notifications
 * POST /api/notifications/:id/read - Mark notification as read
 */

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const notifications = await getUnreadNotifications(user.id)

    return NextResponse.json({
      notifications,
      count: notifications.length,
      success: true
    })
  } catch (error) {
    console.error('[v0] Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { notificationId } = await request.json()
    
    if (!notificationId) {
      return NextResponse.json(
        { error: 'notificationId required' },
        { status: 400 }
      )
    }

    await markNotificationAsRead(notificationId)

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    })
  } catch (error) {
    console.error('[v0] Error marking notification as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  }
}
