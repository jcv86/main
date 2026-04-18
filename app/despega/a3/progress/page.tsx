'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Award, Target, Zap } from 'lucide-react'

export default function ProgressPage() {
  const [loading, setLoading] = useState(true)
  const [a3Progress, setA3Progress] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('despega_a3_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setA3Progress(data)
    } catch (error) {
      console.log('[v0] Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-purple/30 border-t-purple-600 animate-spin mx-auto mb-4"></div>
          <p className="text-muted/60 dark:text-muted/40">Cargando progreso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Link href="/despega/a3">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a A3
          </Button>
        </Link>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-muted/90 dark:text-muted/5">
            Tu Progreso en A3
          </h1>
          <p className="text-lg text-muted/60 dark:text-muted/40">
            Visualiza tu evolución y mejora en el tiempo.
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted/60 dark:text-muted/40 mb-1">Sesiones Completadas</p>
                  <div className="text-3xl font-bold text-purple">
                    {a3Progress?.sessions_completed || 0}
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-purple/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted/60 dark:text-muted/40 mb-1">Score de Empleabilidad</p>
                  <div className="text-3xl font-bold text-blue">
                    {a3Progress?.employability_score || 0}/100
                  </div>
                </div>
                <Target className="w-8 h-8 text-indigo-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted/60 dark:text-muted/40 mb-1">Horas Entrenadas</p>
                  <div className="text-3xl font-bold text-blue">
                    {a3Progress?.hours_trained || 0}h
                  </div>
                </div>
                <Zap className="w-8 h-8 text-blue/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted/60 dark:text-muted/40 mb-1">Entrevistas Dominadas</p>
                  <div className="text-3xl font-bold text-green">
                    {a3Progress?.interviews_mastered || 0}
                  </div>
                </div>
                <Award className="w-8 h-8 text-green/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Progress */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Habilidades Desarrolladas</CardTitle>
            <CardDescription>Tu progreso en cada competencia clave</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { skill: 'Comunicación Clara', progress: 75, color: 'bg-blue/50' },
              { skill: 'Pensamiento Estratégico', progress: 60, color: 'bg-purple/50' },
              { skill: 'Manejo de Presión', progress: 55, color: 'bg-orange/50' },
              { skill: 'Storytelling', progress: 70, color: 'bg-blue/50' },
              { skill: 'Confianza en Video', progress: 65, color: 'bg-green/50' },
              { skill: 'Coherencia Emocional', progress: 50, color: 'bg-red/50' },
            ].map((item) => (
              <div key={item.skill} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-muted/90 dark:text-muted/5">{item.skill}</span>
                  <span className="text-sm font-semibold text-muted/60 dark:text-muted/40">{item.progress}%</span>
                </div>
                <div className="w-full bg-muted/20 dark:bg-muted/70 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-300`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Logros Desbloqueados</CardTitle>
            <CardDescription>Badges y certificados conseguidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { badge: '🎯 Primer Paso', desc: 'Completa tu diagnosis' },
                { badge: '✨ Consistencia', desc: '5 entrenamientos completados' },
                { badge: '🚀 Progresista', desc: 'Alcanza nivel Intermedio' },
              ].map((item) => (
                <Card key={item.badge} className="bg-background">
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl mb-2">{item.badge}</div>
                    <p className="text-sm text-muted/70 dark:text-muted/30">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-background">
          <CardContent className="pt-6 flex gap-3">
            <div className="w-5 h-5 flex-shrink-0 text-purple text-lg">💡</div>
            <div>
              <div className="font-semibold text-purple dark:text-purple/10 mb-2">Cómo acelerar tu progreso</div>
              <ul className="text-sm text-purple dark:text-purple/20 space-y-1">
                <li>✓ Realiza al menos 1 simulación diaria</li>
                <li>✓ Revisa el feedback del coach en detalle</li>
                <li>✓ Practica específicamente los gaps identificados</li>
                <li>✓ Comparte entrenamientos con mentores o amigos para feedback externo</li>
                <li>✓ Documenta lo que aprendes después de cada sesión</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
