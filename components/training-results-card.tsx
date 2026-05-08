'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Zap, Target, TrendingUp, Flame, Gift, Award } from 'lucide-react'

interface TrainingResult {
  score: number
  questionsCompleted: number
  totalQuestions: number
  timeSpent: number
  level: 'basico' | 'intermedio' | 'avanzado'
  trainingType: string
  moduleXpEarned?: number
  moduleXpTotal?: number
}

interface ProgressMetrics {
  xpEarned: number
  pointsEarned: number
  rewards: string[]
  totalXP: number
  level: number
  streak: number
  isFirstCompletion?: boolean
  message?: string
}

export function TrainingResultsCard({ result, onContinue }: { result: TrainingResult; onContinue: () => void }) {
  const [displayScore, setDisplayScore] = useState(0)
  const [showBadges, setShowBadges] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics | null>(null)
  const [isSaving, setIsSaving] = useState(true)
  const [showXPAnimation, setShowXPAnimation] = useState(false)

  // Save training session and animate score counting
  useEffect(() => {
    const saveAndAnimate = async () => {
      try {
        // Save training session
        const response = await fetch('/api/a3/training-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save-session',
            session: {
              training_type: result.trainingType,
              level: result.level,
              score: result.score,
              time_spent_seconds: result.timeSpent,
              questions_completed: result.questionsCompleted,
              total_questions: result.totalQuestions,
              started_at: new Date(Date.now() - result.timeSpent * 1000).toISOString(),
              completed_at: new Date().toISOString()
            }
          })
        })

        if (response.ok) {
          const data = await response.json()
          console.log('[v0] Session saved:', data)
          setProgressMetrics({
            xpEarned: data.xpEarned || 0,
            pointsEarned: data.pointsEarned || 0,
            rewards: data.rewards || [],
            totalXP: data.totalXP || 0,
            level: data.level || 1,
            streak: data.streak || 0,
            isFirstCompletion: data.isFirstCompletion ?? true,
            message: data.message || ''
          })
          // Show XP animation only for first completion
          if (data.isFirstCompletion) {
            setShowXPAnimation(true)
          }
        }
      } catch (error) {
        console.error('[v0] Error saving training session:', error)
      } finally {
        setIsSaving(false)

        // Animate score counting
        const duration = 2000
        const steps = 60
        const stepDuration = duration / steps
        let currentStep = 0

        const timer = setInterval(() => {
          currentStep++
          const progress = currentStep / steps
          const easeOutQuad = 1 - Math.pow(1 - progress, 2)
          setDisplayScore(Math.floor(result.score * easeOutQuad))

          if (currentStep === steps) {
            clearInterval(timer)
            setDisplayScore(result.score)
            setShowBadges(true)
            setShowCelebration(true)
          }
        }, stepDuration)

        return () => clearInterval(timer)
      }
    }

    saveAndAnimate()
  }, [result])

  const getBadges = () => {
    const badges = []
    if (result.score >= 90) badges.push({ icon: Trophy, label: '¡Excelente!', color: 'text-yellow-400' })
    if (result.score >= 75) badges.push({ icon: Star, label: 'Gran Desempeño', color: 'text-blue-400' })
    if (result.questionsCompleted === result.totalQuestions) badges.push({ icon: Target, label: 'Completado', color: 'text-green-400' })
    if (result.timeSpent < 300) badges.push({ icon: Zap, label: 'Rápido', color: 'text-purple-400' })
    return badges
  }

  const getLevelColor = () => {
    switch (result.level) {
      case 'basico': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'intermedio': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'avanzado': return 'bg-red-500/20 text-red-400 border-red-500/30'
    }
  }

  const badges = getBadges()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full space-y-6"
      >
        {/* Main Score Card */}
        <Card className="border-training/40 bg-gradient-to-br from-training/20 to-training/5 overflow-hidden">
          <CardContent className="pt-12 pb-8">
            <div className="text-center space-y-6">
              {/* Score Display */}
              <motion.div
                animate={showCelebration ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: showCelebration ? 2 : 0 }}
                className="space-y-2"
              >
                <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {result.moduleXpEarned ?? displayScore}
                </div>
                <p className="text-white/70 text-lg">/ {result.moduleXpTotal ?? 100}</p>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white"
              >
                ¡Entrenamiento Completado!
              </motion.h2>

              {/* Summary Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-3 gap-4 pt-4"
              >
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white/60 text-sm">Preguntas</p>
                  <p className="text-xl font-bold text-white">{result.questionsCompleted}/{result.totalQuestions}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-white/60 text-sm">Tiempo</p>
                  <p className="text-xl font-bold text-white">{Math.round(result.timeSpent / 60)}m</p>
                </div>
                <div className={`rounded-lg p-3 border ${getLevelColor()}`}>
                  <p className="text-white/60 text-sm">Nivel</p>
                  <p className="text-xl font-bold capitalize">{result.level}</p>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* XP and Rewards Section */}
        {!isSaving && progressMetrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-4"
          >
        {/* XP Earned */}
            {showXPAnimation && progressMetrics?.isFirstCompletion && (
              <motion.div>
                <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-background overflow-hidden relative">
                  {/* Floating +XP animation */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -100, scale: 1.2 }}
                    transition={{ duration: 2, delay: 0.3 }}
                    pointerEvents="none"
                  >
                    <div className="text-5xl font-bold" style={{ color: 'rgb(170, 70, 170)' }}>
                      +{progressMetrics.xpEarned} XP
                    </div>
                  </motion.div>
                  <CardContent className="pt-6 pb-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: 'spring' }}
                      className="mb-3"
                    >
                      <Zap className="w-8 h-8 mx-auto" style={{ color: 'rgb(170, 70, 170)' }} />
                    </motion.div>
                    <p className="text-3xl font-bold" style={{ color: 'rgb(170, 70, 170)' }}>
                      +{progressMetrics.xpEarned}
                    </p>
                    <p className="text-xs text-white/60 mt-2 uppercase tracking-wider">XP Ganados</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {!showXPAnimation && progressMetrics && !progressMetrics.isFirstCompletion && (
              <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-background">
                <CardContent className="pt-6 pb-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                    className="mb-3"
                  >
                    <TrendingUp className="w-8 h-8 mx-auto" style={{ color: 'rgb(180, 83, 9)' }} />
                  </motion.div>
                  <p className="text-sm" style={{ color: 'rgb(180, 83, 9)' }}>
                    Repitiendo
                  </p>
                  <p className="text-xs text-white/60 mt-2 uppercase tracking-wider">Ya ganaste XP</p>
                </CardContent>
              </Card>
            )}
            {!progressMetrics && (
              <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-background">
                <CardContent className="pt-6 pb-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                    className="mb-3"
                  >
                    <Zap className="w-8 h-8 mx-auto" style={{ color: 'rgb(170, 70, 170)' }} />
                  </motion.div>
                  <p className="text-3xl font-bold" style={{ color: 'rgb(170, 70, 170)' }}>
                    +{result.score}
                  </p>
                  <p className="text-xs text-white/60 mt-2 uppercase tracking-wider">XP Ganados</p>
                </CardContent>
              </Card>
            )}

            {/* Points Earned */}
            <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-background">
              <CardContent className="pt-6 pb-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.75, type: 'spring' }}
                  className="mb-3"
                >
                  <Award className="w-8 h-8 mx-auto" style={{ color: 'rgb(34, 197, 94)' }} />
                </motion.div>
                <p className="text-3xl font-bold" style={{ color: 'rgb(34, 197, 94)' }}>
                  +{progressMetrics.pointsEarned}
                </p>
                <p className="text-xs text-white/60 mt-2 uppercase tracking-wider">Puntos</p>
              </CardContent>
            </Card>

            {/* Total Rewards */}
            <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-background">
              <CardContent className="pt-6 pb-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                  className="mb-3"
                >
                  <Gift className="w-8 h-8 mx-auto" style={{ color: 'rgb(170, 70, 170)' }} />
                </motion.div>
                <p className="text-3xl font-bold" style={{ color: 'rgb(170, 70, 170)' }}>
                  {progressMetrics.rewards.length}
                </p>
                <p className="text-xs text-white/60 mt-2 uppercase tracking-wider">Logros Desbloqueados</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Badges */}
        {showBadges && badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="border-training/40 bg-training/5">
              <CardContent className="pt-6">
                <p className="text-white/60 text-sm mb-3">Logros Desbloqueados</p>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, idx) => {
                    const Icon = badge.icon
                    return (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 1 + idx * 0.1, type: 'spring' }}
                      >
                        <Badge
                          variant="outline"
                          className={`px-3 py-2 gap-1.5 ${badge.color} border-current/30 bg-current/5`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {badge.label}
                        </Badge>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Progress Streak */}
        {!isSaving && progressMetrics && progressMetrics.streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4 flex items-center gap-3"
          >
            <Flame className="w-6 h-6 text-orange-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white font-semibold">¡Racha de {progressMetrics.streak} días!</p>
              <p className="text-white/60 text-sm">Sigue practicando para mantener tu racha</p>
            </div>
          </motion.div>
        )}

        {/* Feedback Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-4 text-center"
        >
          {progressMetrics?.isFirstCompletion ? (
            <>
              {displayScore >= 90 && (
                <p className="text-white">
                  ¡Excelente desempeño! Ganaste {progressMetrics.xpEarned} XP. Estás listo para tu próxima entrevista. Continúa practicando para mejorar aún más.
                </p>
              )}
              {displayScore >= 75 && displayScore < 90 && (
                <p className="text-white">
                  Muy bien hecho. Ganaste {progressMetrics.xpEarned} XP. Tienes una sólida base. Practica con los escenarios más desafiantes para perfeccionar tus habilidades.
                </p>
              )}
              {displayScore < 75 && (
                <p className="text-white">
                  Buen comienzo. Ganaste {progressMetrics.xpEarned} XP. Revisa las áreas donde puedas mejorar y vuelve a intentar. Cada práctica te acerca a la excelencia.
                </p>
              )}
            </>
          ) : (
            <p className="text-white">
              {progressMetrics?.message || 'Excelente práctica! No hay XP adicional esta vez (ya ganaste XP en tu primer intento). Sigue practicando para mejorar tus habilidades.'}
            </p>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex gap-3 pt-4"
        >
          <Button
            onClick={() => {
              // Force a refresh of the progress data before navigating
              console.log('[v0] Triggering progress refresh after training completion')
              // Trigger a refresh by calling the progress API
              fetch('/api/a3/progress').then(response => {
                if (response.ok) {
                  console.log('[v0] Progress refreshed successfully')
                }
              }).catch(error => {
                console.error('[v0] Error refreshing progress:', error)
              })
              // Give it a moment to refresh, then continue
              setTimeout(() => onContinue(), 500)
            }}
            className="flex-1 h-12 text-base font-semibold text-white"
            style={{ backgroundColor: 'rgb(170, 70, 170)' }}
          >
            Continuar
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
