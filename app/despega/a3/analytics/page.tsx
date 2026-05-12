'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Target, Zap, Award, BarChart3 } from 'lucide-react'

export default function A3AnalyticsPage() {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // En producción, esto traería datos reales de la base de datos
      const mockData = {
        totalScore: 72,
        interventionCount: 3,
        simulationAttempts: 5,
        averageResponseTime: 2.3,
        trainingCompletion: 45,
        strengths: ['Comunicación', 'STAR Method', 'Manejo de presión'],
        improvements: ['Detalles técnicos', 'Ejemplos cuantificables', 'Cerrar con poder']
      }
      setUserData(mockData)
    } catch (error) {
      console.log('[v0] Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-purple/30 border-t-purple-600 animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground dark:text-muted-foreground">Cargando analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <Link href="/despega/a3">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a A3
          </Button>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-muted/90 dark:text-white">
            Mi Progreso en A3
          </h1>
          <p className="text-muted-foreground dark:text-muted-foreground">
            Análisis detallado de tu desempeño, fortalezas y áreas de mejora
          </p>
        </div>

        {/* Overall Score */}
        <Card className="rounded-[2px] bg-background">
          <CardContent className="pt-8 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold opacity-90 mb-2">Tu Puntuación A3</p>
                <p className="text-6xl font-bold">{userData?.totalScore || 0}%</p>
                <p className="text-sm opacity-75 mt-2">Nivel: Intermediate - En camino a Avanzado</p>
              </div>
              <Award className="w-20 h-20 opacity-30" />
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              icon: Zap,
              label: 'Entrenamientos',
              value: userData?.simulationAttempts,
              total: 10,
              color: 'text-training'
            },
            {
              icon: Target,
              label: 'Entrenamientos',
              value: userData?.trainingCompletion,
              total: 100,
              suffix: '%',
              color: 'text-training'
            },
            {
              icon: TrendingUp,
              label: 'Mejora',
              value: '+12%',
              subtitle: 'última semana',
              color: 'text-training'
            },
            {
              icon: BarChart3,
              label: 'Consistencia',
              value: '85%',
              subtitle: 'en respuestas',
              color: 'text-training'
            }
          ].map((metric, idx) => {
            const Icon = metric.icon
            return (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-muted/90 dark:text-white">
                    {metric.value}{metric.suffix}
                  </p>
                  {metric.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
                  )}
                  {metric.total && (
                    <Progress value={(metric.value / metric.total) * 100} className="mt-2 h-1" />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Fortalezas & Mejoras */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green" />
                Tus Fortalezas
              </CardTitle>
              <CardDescription>Lo que haces muy bien en entrevistas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {userData?.strengths.map((strength: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-[28px] bg-green/5 dark:bg-green/20">
                  <span className="text-green dark:text-green/40 font-bold">+</span>
                  <span className="text-muted-foreground dark:text-white/85">{strength}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange" />
                Áreas de Mejora
              </CardTitle>
              <CardDescription>En qué debes enfocarte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {userData?.improvements.map((improvement: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-[28px] bg-orange/5 dark:bg-orange/20">
                  <span className="text-orange dark:text-orange/40 font-bold">→</span>
                  <span className="text-muted-foreground dark:text-white/85">{improvement}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Performance Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso en el Tiempo</CardTitle>
            <CardDescription>Tus mejoras en entrenamientos de entrevista</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: 'Hace 2 sem', score: 55, level: 'Básico' },
                { date: 'Hace 1 sem', score: 63, level: 'Intermedio' },
                { date: 'Esta semana', score: 72, level: 'Intermedio-Avanzado' }
              ].map((entry, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground dark:text-white/85">{entry.date}</span>
                    <Badge variant="secondary">{entry.level}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={entry.score} className="flex-1 h-2" />
                    <span className="font-bold text-muted/90 dark:text-white w-10 text-right">{entry.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="rounded-[2px] bg-training/5 dark:bg-training/20 border-training/30 dark:border-training/10">
          <CardHeader>
            <CardTitle className="text-training">Insights y Recomendaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userData?.insights?.map((insight: string, idx: number) => (
              <div key={idx} className="flex gap-2 text-sm text-muted-foreground dark:text-white/85">
                <span className="text-training font-bold">•</span>
                <span>{insight}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="rounded-[2px] bg-gradient-to-r from-training/10 to-training/5 border-training/30">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">Próximo desafío disponible</p>
                <p className="text-sm text-white/70 mt-1">Avanza al siguiente nivel y desbloquea nuevas habilidades</p>
              </div>
              <Button className="rounded-[20px] bg-training hover:bg-training/90 text-white">
                Ver Desafíos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
