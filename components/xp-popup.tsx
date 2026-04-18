'use client'

import { useEffect, useState } from 'react'
import { Zap, TrendingUp, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface XPPopupProps {
  action: string
  xp: number
  multiplier?: number
  levelUp?: boolean
  newLevel?: number
  onComplete?: () => void
}

export function XPPopup({
  action,
  xp,
  multiplier = 1,
  levelUp = false,
  newLevel,
  onComplete
}: XPPopupProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 3500)

    return () => clearTimeout(timer)
  }, [onComplete])

  const actualXP = Math.round(xp * multiplier)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-24 right-6 z-50"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-background">
            <div className="space-y-2">
              {/* XP Gained */}
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-300" />
                <div>
                  <p className="text-sm font-bold text-white">{action}</p>
                  <p className="text-xs text-cyan/10">{actualXP} XP ganados</p>
                </div>
              </div>

              {/* Multiplier Info */}
              {multiplier > 1 && (
                <div className="flex items-center gap-2 text-xs text-cyan/10 bg-cyan/40 px-2 py-1 rounded">
                  <span>🔥</span>
                  <span>x{multiplier.toFixed(1)} multiplicador</span>
                </div>
              )}

              {/* Level Up */}
              {levelUp && newLevel && (
                <motion.div
                  className="flex items-center gap-2 text-xs font-bold text-white bg-background"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <Trophy className="w-4 h-4" />
                  <span>¡LEVEL UP! Ahora eres Nivel {newLevel}</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Floating Particles Effect */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan/40 rounded-full"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 100,
                y: -100,
                opacity: 0
              }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
