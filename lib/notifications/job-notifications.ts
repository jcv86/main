/**
 * Job Notifications Service
 * 
 * Handles creation and delivery of notifications when new job matches found
 */

import { createClient } from '@/lib/supabase/server'

export interface NotificationPayload {
  userId: string
  type: 'new_job_match' | 'skill_milestone' | 'profile_updated'
  title: string
  message: string
  relatedJobId?: string
  relatedMatchScore?: number
}

/**
 * Create a notification for the user
 */
export async function createNotification(payload: NotificationPayload): Promise<void> {
  try {
    const supabase = await createClient()
    
    await supabase
      .from('notifications')
      .insert({
        user_id: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        related_job_id: payload.relatedJobId,
        match_score: payload.relatedMatchScore,
        read: false,
        created_at: new Date().toISOString()
      })

    console.log(`[v0] Notification created for user ${payload.userId}`)

    // Future: Send push notification via service (Firebase, OneSignal, etc.)
    // await sendPushNotification(payload)
  } catch (error) {
    console.error('[v0] Error creating notification:', error)
  }
}

/**
 * Get unread notifications for user
 */
export async function getUnreadNotifications(userId: string) {
  try {
    const supabase = await createClient()
    
    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(10)

    return notifications || []
  } catch (error) {
    console.error('[v0] Error fetching notifications:', error)
    return []
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const supabase = await createClient()
    
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
  } catch (error) {
    console.error('[v0] Error marking notification as read:', error)
  }
}

/**
 * Send in-app notification via Supabase real-time
 */
export async function broadcastNotification(userId: string, notification: NotificationPayload) {
  try {
    const supabase = await createClient()
    
    supabase
      .channel(`notifications:${userId}`)
      .on(
        'broadcast',
        {
          event: 'new_notification'
        },
        (payload) => {
          console.log('[v0] Notification broadcast:', payload)
        }
      )
      .subscribe()
  } catch (error) {
    console.error('[v0] Error broadcasting notification:', error)
  }
}
