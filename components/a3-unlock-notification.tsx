'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Sparkles, Lock, Unlock } from 'lucide-react'
import { getUserA3Unlocks } from '@/lib/supabase/a2-a3-unlock-handler'
import { useAuth } from '@/hooks/use-auth'

interface A3Unlock {
  id: string
  module_key: string
  module_name: string
  triggered_by_day: number
  unlock_date: string
  is_new: boolean
  description: string
  route: string
}

export function A3UnlockNotification() {
  const { user } = useAuth()
  const [unlocks, setUnlocks] = useState<A3Unlock[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUnlocks = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        const userUnlocks = await getUserA3Unlocks(user.id)
        console.log('[v0] A3 unlocks loaded:', userUnlocks)

        // Filter for new unlocks only
        const newUnlocks = userUnlocks.filter((u: any) => u.is_new && !dismissed.has(u.id))
        setUnlocks(newUnlocks)
      } catch (err) {
        console.error('[v0] Error loading A3 unlocks:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUnlocks()
  }, [user?.id, dismissed])

  if (isLoading || unlocks.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md space-y-3 z-50">
      {unlocks.map((unlock) => (
        <div
          key={unlock.id}
          className="bg-gradient-to-r from-purple-900/95 to-blue-900/95 border border-purple-500/50 rounded-lg p-4 shadow-lg backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Unlock className="w-5 h-5 text-amber-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  New A3 Module Unlocked!
                </h3>
              </div>

              <p className="text-sm text-purple-200 mt-1">{unlock.module_name}</p>

              <p className="text-xs text-purple-300 mt-2">{unlock.description}</p>

              <div className="flex gap-2 mt-3">
                <Link
                  href={unlock.route}
                  className="text-xs px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded transition-colors"
                >
                  Explore Now
                </Link>

                <button
                  onClick={() => {
                    const newDismissed = new Set(dismissed)
                    newDismissed.add(unlock.id)
                    setDismissed(newDismissed)
                  }}
                  className="text-xs px-3 py-1 bg-purple-700/50 hover:bg-purple-600/50 text-purple-200 rounded transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                const newDismissed = new Set(dismissed)
                newDismissed.add(unlock.id)
                setDismissed(newDismissed)
              }}
              className="flex-shrink-0 text-purple-400 hover:text-purple-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
