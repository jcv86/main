'use client'

import { useState, useEffect } from 'react'
import { Zap, Check, TrendingUp } from 'lucide-react'

interface XPNotification {
  id: string
  xp: number
  action: string
  timestamp: number
}

export function XPNotificationCenter() {
  const [notifications, setNotifications] = useState<XPNotification[]>([])

  useEffect(() => {
    // Listen for XP gain events (can be triggered from anywhere)
    const handleXPGain = (event: any) => {
      const notification: XPNotification = {
        id: Math.random().toString(36),
        xp: event.detail.xp,
        action: event.detail.action,
        timestamp: Date.now()
      }

      setNotifications(prev => [...prev, notification])

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, 3000)
    }

    window.addEventListener('xp-gain', handleXPGain)
    return () => window.removeEventListener('xp-gain', handleXPGain)
  }, [])

  return (
    <div className="fixed top-24 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="animate-in fade-in slide-in-from-top-2 animate-out fade-out slide-out-to-top-2 duration-300"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-[28px] bg-background">
            <div className="flex items-center justify-center w-6 h-6 rounded-[20px] bg-white/20">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">+{notification.xp} XP</p>
              <p className="text-xs text-white/80">{notification.action}</p>
            </div>
            <Check className="w-4 h-4" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Helper function to trigger XP notifications from anywhere
export function triggerXPGain(xp: number, action: string) {
  window.dispatchEvent(
    new CustomEvent('xp-gain', {
      detail: { xp, action }
    })
  )
}
