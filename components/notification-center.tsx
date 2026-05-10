'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, X, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  action_url?: string
  milestone_type?: string
  read: boolean
  created_at: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function fetchNotifications() {
    try {
      const response = await fetch('/api/despega/notifications?limit=20')
      const data = await response.json()
      
      if (data.notifications) {
        setNotifications(data.notifications)
        setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('despega_notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (!error) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  async function dismissNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from('despega_notifications')
        .delete()
        .eq('id', notificationId)

      if (!error) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        if (!notifications.find(n => n.id === notificationId)?.read) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error('Error dismissing notification:', error)
    }
  }

  const getMilestoneIcon = (type?: string) => {
    switch (type) {
      case 'a1_completed':
        return <CheckCircle className="w-5 h-5 text-green/50" />
      case 'achievement_unlock':
        return <Zap className="w-5 h-5 text-orange" />
      default:
        return <AlertCircle className="w-5 h-5 text-blue/50" />
    }
  }

  const getMilestoneColor = (type?: string) => {
    switch (type) {
      case 'a1_completed':
        return 'bg-green/5 border-green/20'
      case 'achievement_unlock':
        return 'bg-yellow/5 border-yellow/20'
      default:
        return 'bg-blue/5 border-blue/20'
    }
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          Cargando notificaciones...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notificaciones
          {unreadCount > 0 && (
            <Badge className="bg-red/50">{unreadCount}</Badge>
          )}
        </h2>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No tienes notificaciones</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map(notification => (
            <Card
              key={notification.id}
              className={`border ${getMilestoneColor(notification.milestone_type)} ${
                !notification.read ? 'ring-1 ring-primary' : ''
              }`}
            >
              <CardContent className="py-4 px-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getMilestoneIcon(notification.milestone_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.created_at).toLocaleDateString()} •{' '}
                        {new Date(notification.created_at).toLocaleTimeString()}
                      </p>

                      {/* Action Button */}
                      {notification.action_url && (
                        <Link href={notification.action_url}>
                          <Button size="sm" className="mt-2">
                            Ver más
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
