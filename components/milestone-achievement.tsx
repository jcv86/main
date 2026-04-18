'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Zap, Star } from 'lucide-react'

interface MilestoneAchievementProps {
  milestone: 'a1_completed' | 'a2_started' | 'a4_started' | 'a2a4_completed' | 'a3_ready'
  userName: string
  onClose: () => void
}

export function MilestoneAchievement({ milestone, userName, onClose }: MilestoneAchievementProps) {
  const [show, setShow] = useState(true)

  const milestones = {
    a1_completed: {
      title: '¡Fase A1 Completada!',
      message: `Excelente, ${userName}. Ahora te conoces mejor. Es hora de decidir quién quieres ser.`,
      icon: Trophy,
      color: 'from-blue-500 to-blue-600',
      showConfetti: true,
    },
    a2_started: {
      title: 'Bienvenido a A2',
      message: 'Tu plan de 90 días comienza aquí. Cada semana, una acción más cercana a tu transformación.',
      icon: Zap,
      color: 'from-green-500 to-green-600',
      showConfetti: false,
    },
    a4_started: {
      title: 'Contexto Desbloqueado',
      message: 'Ahora ves el panorama completo. Noticias, oportunidades y tendencias que importan.',
      icon: Star,
      color: 'from-cyan-500 to-cyan-600',
      showConfetti: false,
    },
    a2a4_completed: {
      title: '¡Plan + Contexto Listos!',
      message: 'Tu plan y el mercado se alinearon. A3 ahora tiene todo lo que necesita para entrenamientos realistas.',
      icon: Trophy,
      color: 'from-purple-500 to-purple',
      showConfetti: true,
    },
    a3_ready: {
      title: 'A3: La Práctica Comienza',
      message: `${userName}, estás listo para entrenamientos personalizados. Prepárate para brillar.`,
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      showConfetti: true,
    },
  }

  const current = milestones[milestone]
  const Icon = current.icon

  if (!show) return null

  return (
    <>
      {current.showConfetti && <Confetti />}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShow(false)} />
        
        <Card className={`relative bg-gradient-to-br ${current.color} text-white max-w-md w-full shadow-2xl overflow-hidden`}>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute top-6 right-6"
          >
            <Icon className="w-16 h-16 opacity-20" />
          </motion.div>

          <div className="p-8 space-y-4 relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              <Icon className="w-12 h-12 mb-4" />
            </motion.div>

            <div>
              <h3 className="text-2xl font-bold mb-2">{current.title}</h3>
              <p className="text-white/90 leading-relaxed">{current.message}</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShow(false)}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold"
              >
                Continuar
              </Button>
              <Button
                onClick={() => {
                  setShow(false)
                  onClose()
                }}
                className="flex-1 bg-white text-muted/90 hover:bg-white/90 font-semibold"
              >
                Ir al Siguiente
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  )
}

export function Confetti() {
  const confetti = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 3 + Math.random() * 1,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {confetti.map(item => (
        <motion.div
          key={item.id}
          initial={{
            y: -20,
            x: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight + 100,
            x: (Math.random() - 0.5) * 100,
            opacity: 0,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            ease: 'easeIn',
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${item.left}%`,
            background: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][Math.floor(Math.random() * 5)],
          }}
        />
      ))}
    </div>
  )
}
