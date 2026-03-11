'use client'

import { useEffect, useCallback, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import useSWR from 'swr'

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'mission' | 'achievement' | 'alert' | 'update'
  category?: string
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
  read: boolean
  createdAt: string
  icon?: string
}

const fetcher = async (key: string) => {
  const response = await fetch(key)
  if (!response.ok) throw new Error('Failed to fetch notifications')
  return response.json()
}

export function useNotifications(userId: string | null) {
  const supabase = createClient()
  const [subscribed, setSubscribed] = useState(false)

  const { data: notifications, isLoading, mutate } = useSWR(
    userId ? `/api/notifications/${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true
    }
  )

  // Subscribe to new notifications
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          console.log('[v0] New notification received:', payload)
          await mutate()
        }
      )
      .subscribe()

    setSubscribed(true)

    return () => {
      supabase.removeChannel(channel)
      setSubscribed(false)
    }
  }, [userId, supabase, mutate])

  const createNotification = useCallback(
    async (notification: Omit<Notification, 'id' | 'userId' | 'createdAt' | 'read'>) => {
      if (!userId) return

      try {
        const response = await fetch(`/api/notifications/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...notification,
            userId,
            read: false,
            createdAt: new Date().toISOString()
          })
        })

        if (!response.ok) throw new Error('Failed to create notification')
        
        const result = await response.json()
        console.log('[v0] Notification created:', result)
        await mutate()
        
        return result
      } catch (error) {
        console.error('[v0] Error creating notification:', error)
        throw error
      }
    },
    [userId, mutate]
  )

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(
          `/api/notifications/${userId}/${notificationId}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ read: true })
          }
        )

        if (!response.ok) throw new Error('Failed to mark as read')
        await mutate()
      } catch (error) {
        console.error('[v0] Error marking notification as read:', error)
        throw error
      }
    },
    [userId, mutate]
  )

  const markAllAsRead = useCallback(
    async () => {
      try {
        const response = await fetch(
          `/api/notifications/${userId}/read-all`,
          { method: 'PATCH' }
        )

        if (!response.ok) throw new Error('Failed to mark all as read')
        await mutate()
      } catch (error) {
        console.error('[v0] Error marking all as read:', error)
        throw error
      }
    },
    [userId, mutate]
  )

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(
          `/api/notifications/${userId}/${notificationId}`,
          { method: 'DELETE' }
        )

        if (!response.ok) throw new Error('Failed to delete notification')
        await mutate()
      } catch (error) {
        console.error('[v0] Error deleting notification:', error)
        throw error
      }
    },
    [userId, mutate]
  )

  const unreadCount = notifications?.filter((n: Notification) => !n.read).length || 0

  return {
    notifications: notifications || [],
    isLoading,
    unreadCount,
    subscribed,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
}
