'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Zap,
  CheckCircle2,
  Video,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Flame,
  Sparkles,
} from 'lucide-react'

interface XPGuideProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function XPGuideModal({ open, onOpenChange }: XPGuideProps) {
  const xpActivities = [
    // EL RITUAL (A1)
    {
      category: 'El Ritual',
      color: 'from-blue-500500',
      activities: [
        {
          action: 'Completar Conozcámonos 1',
          xp: 100,
          icon: <CheckCircle2 className="w-4 h-4" />,
          description: 'Contesta las preguntas iniciales sobre ti'
        },
        {
          action: 'Completar Test de Perfil',
          xp: 150,
          icon: <Target className="w-4 h-4" />,
          description: '28 preguntas para identificar tu estilo'
        },
        {
          action: 'Ver Tu Análisis Personal',
          xp: 50,
          icon: <Sparkles className="w-4 h-4" />,
          description: 'Revisar resultados de tu perfil'
        }
      ]
    },
    // EXPLORACIÓN (A2)
    {
      category: 'Exploración',
      color: 'from-cyan-500500',
      activities: [
        {
          action: 'Completar Define Tus Objetivos',
          xp: 100,
          icon: <CheckCircle2 className="w-4 h-4" />,
          description: 'Responde preguntas sobre tus metas'
        },
        {
          action: 'Generar Tu Ruta Personalizada',
          xp: 200,
          icon: <TrendingUp className="w-4 h-4" />,
          description: 'Crea tu plan de 30/60/90 días'
        },
        {
          action: 'Revisar Tu Ruta Diariamente',
          xp: 10,
          icon: <Flame className="w-4 h-4" />,
          description: 'Mantén tu racha activa (máx 50 XP/día)'
        }
      ]
    },
    // ENTRENAMIENTO (A3)
    {
      category: 'Entrenamiento',
      color: 'from-teal-500500',
      activities: [
        {
          action: 'Completar Interview 0',
          xp: 150,
          icon: <Video className="w-4 h-4" />,
          description: 'Responde 5 preguntas clave con video'
        },
        {
          action: 'Realizar Simulación Guiada',
          xp: 200,
          icon: <Target className="w-4 h-4" />,
          description: '6 preguntas con guía STAR'
        },
        {
          action: 'Análisis Multimodal (Video)',
          xp: 250,
          icon: <Video className="w-4 h-4" />,
          description: 'Grábate y recibe feedback IA'
        },
        {
          action: 'Simulación Estructurada',
          xp: 200,
          icon: <Target className="w-4 h-4" />,
          description: 'Entrenamiento conductuales'
        },
        {
          action: 'Ajuste por Vacante',
          xp: 150,
          icon: <BookOpen className="w-4 h-4" />,
          description: 'Personaliza respuestas por job posting'
        },
        {
          action: 'Simulación Desafiante',
          xp: 300,
          icon: <Award className="w-4 h-4" />,
          description: 'Máximo nivel de dificultad'
        }
      ]
    },
    // LA REALIDAD (A4)
    {
      category: 'La Realidad',
      color: 'from-emerald-500500',
      activities: [
        {
          action: 'Revisar Contexto del Mercado',
          xp: 100,
          icon: <BookOpen className="w-4 h-4" />,
          description: 'Accede a noticias y análisis'
        },
        {
          action: 'Ver Dashboard Ejecutivo',
          xp: 150,
          icon: <TrendingUp className="w-4 h-4" />,
          description: 'Monitor market intelligence'
        },
        {
          action: 'Completar Desafío Diario A4',
          xp: 75,
          icon: <Flame className="w-4 h-4" />,
          description: 'Tarea estratégica del día'
        }
      ]
    }
  ]

  const streakBonuses = [
    { days: 3, multiplier: 1.25, bonus: '+25% XP' },
    { days: 7, multiplier: 1.5, bonus: '+50% XP' },
    { days: 14, multiplier: 1.75, bonus: '+75% XP' },
    { days: 30, multiplier: 2.0, bonus: '+100% XP Doble' }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Guía Completa de XP
          </DialogTitle>
          <DialogDescription>
            Descubre todas las formas de ganar puntos y subir de nivel en tu transformación profesional
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="actividades" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="actividades">Actividades</TabsTrigger>
            <TabsTrigger value="racha">Racha Diaria</TabsTrigger>
            <TabsTrigger value="niveles">Niveles</TabsTrigger>
          </TabsList>

          {/* ACTIVIDADES TAB */}
          <TabsContent value="actividades" className="space-y-4">
            {xpActivities.map((phase) => (
              <Card key={phase.category} className="border-muted/20 dark:border-muted/70">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-[20px] bg-background`}
                    />
                    {phase.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {phase.activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-3 rounded-[28px] bg-muted/5 dark:bg-transparent/50 border border-muted/20 dark:border-muted/80"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-muted/40 mt-0.5">{activity.icon}</div>
                        <div>
                          <p className="font-semibold text-sm text-muted/90 dark:text-muted/10">
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted/50 dark:text-muted/40 mt-0.5">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                      <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 whitespace-nowrap flex-shrink-0">
                        +{activity.xp} XP
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* RACHA TAB */}
          <TabsContent value="racha" className="space-y-4">
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange" />
                  Bonificación por Racha Diaria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {streakBonuses.map((streak, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-[28px] bg-transparent/50 border border-orange/20 dark:border-orange"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-black text-orange">
                          {streak.days}
                        </div>
                        <div className="text-xs text-muted/50 dark:text-muted/40">
                          días
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-muted/90 dark:text-muted/10">
                          Multiplicador x{streak.multiplier.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted/50 dark:text-muted/40">
                          Todos tus XP se multiplican
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-background">
                      {streak.bonus}
                    </Badge>
                  </div>
                ))}
                <div className="mt-4 p-4 bg-orange/10 dark:bg-orange/30 border border-orange/30 dark:border-orange rounded-lg text-sm text-orange dark:text-orange/10">
                  <strong>💡 Tip:</strong> Cada día que visitas la plataforma suma a tu racha. ¡No la rompas para maximizar tus ganancias de XP!
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NIVELES TAB */}
          <TabsContent value="niveles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan" />
                  Sistema de Niveles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/5 dark:bg-transparent/50 rounded-[28px] border border-muted/20 dark:border-muted/80">
                  <p className="font-semibold text-sm mb-2">Nivel = 1,000 XP</p>
                  <p className="text-sm text-muted/60 dark:text-muted/40">
                    Cada nivel requiere 1,000 puntos. Con multiplicadores de racha, 
                    puedes llegar más rápido. Por ejemplo, con racha de 7 días:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-muted/60 dark:text-muted/40">
                    <li>• Simulación Desafiante: 300 XP → 450 XP con racha x1.5</li>
                    <li>• Análisis Multimodal: 250 XP → 375 XP con racha x1.5</li>
                    <li>• 3 Desafíos diarios → Subes casi un nivel completo</li>
                  </ul>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-[28px] border border-emerald-200 dark:border-emerald-800">
                  <p className="font-semibold text-sm mb-2 text-emerald-900 dark:text-emerald-100">
                    Progresión por Fase
                  </p>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                    Cada fase (A1, A2, A3, A4) tiene su propio sistema de niveles. 
                    Completa todas las actividades de una fase para desbloquear badges especiales.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
