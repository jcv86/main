'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Clock, Zap, Award } from 'lucide-react'

interface MetricsProps {
  daysCompleted: number
  trainingsCompleted: number
  articlesRead: number
  currentStreak: number
}

export function DashboardMetrics({
  daysCompleted = 0,
  trainingsCompleted = 0,
  articlesRead = 0,
  currentStreak = 0,
}: MetricsProps) {
  const metrics = [
    {
      label: 'Días Completados',
      value: daysCompleted,
      icon: Calendar,
      color: 'from-blue-500600',
      suffix: '/90',
    },
    {
      label: 'Entrenamientos',
      value: trainingsCompleted,
      icon: Award,
      color: 'from-emerald-500600',
      suffix: 'completados',
    },
    {
      label: 'Artículos Leídos',
      value: articlesRead,
      icon: Zap,
      color: 'from-amber-500600',
      suffix: 'noticias',
    },
    {
      label: 'Racha Actual',
      value: currentStreak,
      icon: TrendingUp,
      color: 'from-purple-500',
      suffix: 'días',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon
        return (
          <Card key={idx} className="border-0 bg-card/70 backdrop-blur-sm hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.suffix}</p>
                </div>
                <div className={`p-3 rounded-[28px] bg-background
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

import { Calendar } from 'lucide-react'
