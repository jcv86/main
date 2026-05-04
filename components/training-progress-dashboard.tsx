'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Flame, Trophy, Target, TrendingUp, Clock, Award } from 'lucide-react'

interface TrainingProgress {
  total_trainings: number
  total_time_spent: number
  average_score: number
  total_xp_earned: number
  total_rewards_earned: number
  consecutive_days: number
  best_score: number
  training_streak: number
  unlocked_badges: string[]
}

interface TrainingSession {
  id: string
  training_type: string
  level: string
  score: number
  time_spent_seconds: number
  xp_earned: number
  completed_at: string
  rewards_earned: string[]
}

export function TrainingProgressDashboard() {
  const [progress, setProgress] = useState<TrainingProgress | null>(null)
  const [history, setHistory] = useState<TrainingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview')

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/a3/training-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-progress' })
      })

      if (res.ok) {
        const data = await res.json()
        setProgress(data)
      }

      // Fetch history
      const historyRes = await fetch('/api/a3/training-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-history', limit: 10, offset: 0 })
      })

      if (historyRes.ok) {
        const historyData = await historyRes.json()
        setHistory(historyData.sessions || [])
      }
    } catch (error) {
      console.error('[v0] Error fetching progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      excellent_performance: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      strong_performance: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      speed_demon: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      completion_master: 'bg-green-500/20 text-green-400 border-green-500/30',
      advanced_challenger: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
    return colors[badge] || 'bg-white/5 text-white/60 border-white/10'
  }

  const getBadgeLabel = (badge: string) => {
    const labels: Record<string, string> = {
      excellent_performance: '¡Excelente!',
      strong_performance: 'Muy Bien',
      speed_demon: 'Rápido',
      completion_master: 'Maestro',
      advanced_challenger: 'Campeón'
    }
    return labels[badge] || badge
  }

  if (loading) {
    return <div className="h-96 bg-muted/20 rounded-lg animate-pulse" />
  }

  if (!progress) {
    return <div className="text-center py-8 text-white/60">No hay datos disponibles</div>
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-purple-500/30 text-purple-400'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          Resumen
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-purple-500/30 text-purple-400'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          Historial
        </button>
      </div>

      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total XP */}
            <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-background">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/60 text-sm uppercase tracking-wider">Total XP</p>
                    <p className="text-3xl font-bold text-purple-400 mt-2">
                      {progress.total_xp_earned.toLocaleString()}
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-purple-400/60" />
                </div>
              </CardContent>
            </Card>

            {/* Training Streak */}
            <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-background">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/60 text-sm uppercase tracking-wider">Racha</p>
                    <p className="text-3xl font-bold text-orange-400 mt-2">
                      {progress.training_streak}
                    </p>
                  </div>
                  <Flame className="w-8 h-8 text-orange-400/60" />
                </div>
              </CardContent>
            </Card>

            {/* Average Score */}
            <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-background">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/60 text-sm uppercase tracking-wider">Promedio</p>
                    <p className="text-3xl font-bold text-blue-400 mt-2">
                      {progress.average_score}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-blue-400/60" />
                </div>
              </CardContent>
            </Card>

            {/* Total Trainings */}
            <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-background">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/60 text-sm uppercase tracking-wider">Entrenamientos</p>
                    <p className="text-3xl font-bold text-green-400 mt-2">
                      {progress.total_trainings}
                    </p>
                  </div>
                  <Trophy className="w-8 h-8 text-green-400/60" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Best Score */}
            <Card className="border-training/40 bg-training/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Mejor Puntuación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-purple-400">{progress.best_score}/100</p>
                <p className="text-white/60 text-sm mt-2">Tu máximo logrado</p>
              </CardContent>
            </Card>

            {/* Time Spent */}
            <Card className="border-training/40 bg-training/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Tiempo Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-purple-400">
                  {Math.round(progress.total_time_spent / 3600)}h {Math.round((progress.total_time_spent % 3600) / 60)}m
                </p>
                <p className="text-white/60 text-sm mt-2">Dedicado al entrenamiento</p>
              </CardContent>
            </Card>
          </div>

          {/* Unlocked Badges */}
          {progress.unlocked_badges && progress.unlocked_badges.length > 0 && (
            <Card className="border-training/40 bg-training/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Logros Desbloqueados ({progress.unlocked_badges.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {progress.unlocked_badges.map((badge, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Badge
                        variant="outline"
                        className={`px-3 py-2 ${getBadgeColor(badge)}`}
                      >
                        {getBadgeLabel(badge)}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {activeTab === 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {history.length === 0 ? (
            <div className="text-center py-8 text-white/60">No hay entrenamientos registrados</div>
          ) : (
            history.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-white capitalize">{session.training_type}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            session.level === 'basico' ? 'bg-blue-500/20 text-blue-400' :
                            session.level === 'intermedio' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {session.level}
                          </span>
                          <span>{new Date(session.completed_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-400">{session.score}</p>
                          <p className="text-xs text-white/60">/100</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-400">+{session.xp_earned} XP</p>
                          <p className="text-xs text-white/60">{Math.round(session.time_spent_seconds / 60)}m</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  )
}
