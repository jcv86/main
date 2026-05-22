'use client'

import { useEffect, useState } from 'react'
import { getUserA3Unlocks } from '@/lib/supabase/a2-a3-unlock-handler'
import { useAuth } from '@/hooks/use-auth'
import { Sparkles, Lock } from 'lucide-react'

interface UnlockTimeline {
  id: string
  module_key: string
  module_name: string
  triggered_by_day: number
  unlock_date: string
  is_new: boolean
}

export function A3UnlockTimeline() {
  const { user } = useAuth()
  const [unlocks, setUnlocks] = useState<UnlockTimeline[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUnlocks = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        const userUnlocks = await getUserA3Unlocks(user.id)
        setUnlocks(userUnlocks)
      } catch (err) {
        console.error('[v0] Error loading A3 timeline:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUnlocks()
  }, [user?.id])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 bg-gray-700/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (unlocks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Complete more days to unlock A3 modules</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {unlocks.map((unlock, idx) => (
        <div
          key={unlock.id}
          className="relative"
        >
          {/* Timeline connector */}
          {idx < unlocks.length - 1 && (
            <div className="absolute left-4 top-10 w-0.5 h-6 bg-purple-600/30" />
          )}

          {/* Timeline item */}
          <div className="flex gap-4">
            {/* Timeline dot */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  unlock.is_new
                    ? 'bg-amber-500/20 border border-amber-500'
                    : 'bg-purple-900/30 border border-purple-600'
                }`}
              >
                <Sparkles
                  className={`w-4 h-4 ${
                    unlock.is_new ? 'text-amber-400' : 'text-purple-400'
                  }`}
                />
              </div>
            </div>

            {/* Timeline content */}
            <div className="flex-1 py-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{unlock.module_name}</p>
                  <p className="text-sm text-gray-400">
                    Unlocked on Day {unlock.triggered_by_day}
                  </p>
                </div>

                {unlock.is_new && (
                  <span className="inline-block px-2 py-1 bg-amber-500/20 border border-amber-500/50 rounded text-xs font-semibold text-amber-400">
                    NEW
                  </span>
                )}
              </div>

              {unlock.unlock_date && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(unlock.unlock_date).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
