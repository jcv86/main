'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Target, BarChart3, Clock, Award, CheckCircle2 } from 'lucide-react'

interface DashboardMetric {
  label: string
  value: number | string
  unit?: string
  icon: React.ReactNode
  trend?: number
}

const mockMetrics: DashboardMetric[] = [
  {
    label: 'Tu Nivel de Criterio',
    value: 72,
    unit: '%',
    icon: <BarChart3 className="w-6 h-6 text-cyan" />,
    trend: 12
  },
  {
    label: 'Oportunidades Identificadas',
    value: 23,
    icon: <Target className="w-6 h-6 text-teal-600" />,
    trend: 5
  },
  {
    label: 'Horas de Aprendizaje',
    value: 47,
    unit: 'h',
    icon: <Clock className="w-6 h-6 text-emerald-600" />,
    trend: 8
  },
  {
    label: 'Ranking Semanal',
    value: 145,
    unit: 'º',
    icon: <Award className="w-6 h-6 text-amber-600" />,
    trend: -12
  }
]

const keyInsights = [
  {
    title: 'IA es tu diferenciador',
    description: 'El 78% de las oportunidades que vemos requieren "comfortable with AI". Tu comprensión está arriba del promedio.',
    action: 'Ver cursos IA'
  },
  {
    title: 'Tu sector está en expansión',
    description: 'Tech & Sostenibilidad crecen 24% YoY en Chile. Alinearte con esta tendencia aumenta tu valor 3.2x.',
    action: 'Explorar roles'
  },
  {
    title: 'Conexiones estratégicas',
    description: 'El 40% de los hires senior vienen de red. Tienes 8 conexiones potenciales en tu ruta laboral.',
    action: 'Ver contactos'
  }
]

const upcomingActions = [
  {
    id: 'tech-interview',
    title: 'Entrenamiento de entrevista técnica',
    stage: 'A3 - Entrenamiento',
    priority: 'Alta',
    daysLeft: 2,
    route: '/despega/a3/entrenamiento-guiado'
  },
  {
    id: 'job-analysis',
    title: 'Análisis de vacante target',
    stage: 'A3 - Ajuste por Vacante',
    priority: 'Media',
    daysLeft: 5,
    route: '/despega/a3/ajuste-por-vacante'
  },
  {
    id: 'cv-review',
    title: 'Review de CV con coach',
    stage: 'A3 - CV ATS',
    priority: 'Alta',
    daysLeft: 3,
    route: '/despega/a3/cv-ats'
  }
]

export function ExecutiveDashboard() {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null)
  const router = useRouter()

  const handleActionClick = (route: string) => {
    console.log('[v0] Navigating to:', route)
    router.push(route)
  }

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockMetrics.map((metric, idx) => (
          <Card key={idx} className="border-t-4 border-t-cyan-500 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>{metric.icon}</div>
                {metric.trend && (
                  <Badge className={metric.trend > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red/10 text-red'}>
                    {metric.trend > 0 ? '+' : ''}{metric.trend}%
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted/60 dark:text-muted/40 mb-2">{metric.label}</p>
              <p className="text-3xl font-bold text-muted/90 dark:text-muted/10">
                {metric.value}{metric.unit}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Insights */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Insights Clave Para Ti</h2>
        <div className="space-y-3">
          {keyInsights.map((insight, idx) => (
            <Card
              key={idx}
              className="cursor-pointer hover:border-cyan/50 transition-colors"
              onClick={() => setExpandedInsight(expandedInsight === idx ? null : idx)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-muted/90 dark:text-muted/10 mb-1">
                      {insight.title}
                    </h3>
                    {expandedInsight === idx && (
                      <p className="text-sm text-muted/60 dark:text-muted/40 mb-3">
                        {insight.description}
                      </p>
                    )}
                  </div>
                  <Button size="sm" className="ml-4 whitespace-nowrap bg-cyan hover:bg-cyan">
                    {insight.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Próximas Acciones */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Tu Próxima Semana</h2>
        <div className="space-y-3">
          {upcomingActions.map((action, idx) => (
            <Card key={idx} className="border-l-4 border-l-teal-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-muted/90 dark:text-muted/10">
                        {action.title}
                      </h3>
                      <Badge
                        className={
                          action.priority === 'Alta'
                            ? 'bg-red/10 text-red'
                            : 'bg-amber-100 text-amber-800'
                        }
                      >
                        {action.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted/50 dark:text-muted/40">
                      {action.stage} • {action.daysLeft} días
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleActionClick(action.route)}
                    className="cursor-pointer hover:bg-cyan/5 dark:hover:bg-cyan/20"
                  >
                    Acceder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/10 dark:to-teal-900/10 border-2 border-cyan/20 dark:border-cyan">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan" />
            Tu Progreso General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Ciclo Completo C1→A4</span>
              <span className="text-sm text-muted/60 dark:text-muted/40">72%</span>
            </div>
            <Progress value={72} className="h-2" />
          </div>
          <p className="text-sm text-muted/60 dark:text-muted/40">
            Estás en fase A4. Has completado el 100% de A1, A2 y el 85% de A3. 
            Continúa con tus simulaciones y estarás listo para ejecutar en 2-3 semanas.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
