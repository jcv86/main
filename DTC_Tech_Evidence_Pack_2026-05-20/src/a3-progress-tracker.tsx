'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, Award, Target, Zap, CheckCircle2, Clock, BarChart3 } from 'lucide-react'

interface A3ProgressTrackerProps {
  userId: string
  level: 'basico' | 'intermedio' | 'avanzado'
}

interface ProgressData {
  totalAttempts: number
  averageScore: number
  bestScore: number
  completedSessions: number
  timeSpent: number
  strengthAreas: string[]
  improvementAreas: string[]
  levelProgress: {
    basico: { completed: number; total: number; score: number }
    intermedio: { completed: number; total: number; score: number }
    avanzado: { completed: number; total: number; score: number }
  }
}

export function A3ProgressTracker({ userId, level }: A3ProgressTrackerProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadProgress()
  }, [userId])

  const loadProgress = async () => {
    try {
      const { data: attempts } = await supabase
        .from('a3_interview_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (!attempts || attempts.length === 0) {
        setProgress({
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          completedSessions: 0,
          timeSpent: 0,
          strengthAreas: [],
          improvementAreas: [],
          levelProgress: {
            basico: { completed: 0, total: 3, score: 0 },
            intermedio: { completed: 0, total: 3, score: 0 },
            avanzado: { completed: 0, total: 3, score: 0 }
          }
        })
        setLoading(false)
        return
      }

      const basicoAttempts = attempts.filter(a => a.level === 'basico')
      const intermedioAttempts = attempts.filter(a => a.level === 'intermedio')
      const avanzadoAttempts = attempts.filter(a => a.level === 'avanzado')

      const scores = attempts.map(a => a.score).filter(s => typeof s === 'number')
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0

      const strengthAreas = Array.from(
        new Set(attempts.flatMap(a => a.feedback?.strengths || []))
      ).slice(0, 4) as string[]

      const improvementAreas = Array.from(
        new Set(attempts.flatMap(a => a.feedback?.improvements || []))
      ).slice(0, 4) as string[]

      setProgress({
        totalAttempts: attempts.length,
        averageScore: avgScore,
        bestScore,
        completedSessions: attempts.filter(a => a.completed).length,
        timeSpent: attempts.reduce((total, a) => total + (a.duration_minutes || 0), 0),
        strengthAreas,
        improvementAreas,
        levelProgress: {
          basico: {
            completed: basicoAttempts.filter(a => a.completed).length,
            total: 3,
            score: basicoAttempts.length > 0 ? Math.round(basicoAttempts.map(a => a.score).reduce((a, b) => a + b) / basicoAttempts.length) : 0
          },
          intermedio: {
            completed: intermedioAttempts.filter(a => a.completed).length,
            total: 3,
            score: intermedioAttempts.length > 0 ? Math.round(intermedioAttempts.map(a => a.score).reduce((a, b) => a + b) / intermedioAttempts.length) : 0
          },
          avanzado: {
            completed: avanzadoAttempts.filter(a => a.completed).length,
            total: 3,
            score: avanzadoAttempts.length > 0 ? Math.round(avanzadoAttempts.map(a => a.score).reduce((a, b) => a + b) / avanzadoAttempts.length) : 0
          }
        }
      })
    } catch (error) {
      console.error('[v0] Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="h-32 animate-pulse bg-muted/20 dark:bg-transparent rounded-lg" />
  }

  if (!progress) return null

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green dark:text-green/40'
    if (score >= 70) return 'text-blue dark:text-blue/40'
    return 'text-orange dark:text-orange/40'
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue dark:text-blue/40" />
              <div className={`text-2xl font-bold ${getScoreColor(progress.averageScore)}`}>
                {progress.averageScore}
              </div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">Promedio</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Award className="w-6 h-6 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
              <div className={`text-2xl font-bold ${getScoreColor(progress.bestScore)}`}>
                {progress.bestScore}
              </div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">Mejor Score</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
              <div className="text-2xl font-bold text-muted/90 dark:text-white">
                {progress.completedSessions}
              </div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">Sesiones</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-purple dark:text-purple/40" />
              <div className="text-2xl font-bold text-muted/90 dark:text-white">
                {progress.timeSpent}m
              </div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">Tiempo</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Progreso por Nivel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(progress.levelProgress).map(([levelKey, levelData]) => (
            <div key={levelKey} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-muted/90 dark:text-white capitalize">
                    Nivel {levelKey}
                  </p>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                    {levelData.completed}/{levelData.total} completadas
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${getScoreColor(levelData.score)}`}>
                    {levelData.score}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">promedio</p>
                </div>
              </div>
              <Progress value={(levelData.completed / levelData.total) * 100} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-green dark:text-green/40" />
              Fortalezas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {progress.strengthAreas.length > 0 ? (
                progress.strengthAreas.map((area, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-[28px] bg-green/5 dark:bg-green/20">
                    <CheckCircle2 className="w-4 h-4 text-green dark:text-green/40 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground dark:text-white/85">{area}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Completa sesiones para ver tus fortalezas</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange dark:text-orange/40" />
              Áreas de Mejora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {progress.improvementAreas.length > 0 ? (
                progress.improvementAreas.map((area, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-[28px] bg-orange/5 dark:bg-orange/20">
                    <Target className="w-4 h-4 text-orange dark:text-orange/40 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground dark:text-white/85">{area}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Completa sesiones para obtener retroalimentación</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
