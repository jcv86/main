'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Zap,
  Target,
  Brain,
  Users,
  Briefcase,
  MessageSquare,
  Shield,
  ArrowRight,
  Sparkles
} from 'lucide-react'

interface InsightCardProps {
  title: string
  content: string
  icon: React.ReactNode
  index: number
  color: string // 'purple', 'blue', 'orange', 'cyan', 'pink', 'green', 'indigo', 'amber'
  emoji?: string
}

const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
  purple: { bg: 'bg-purple-50 dark:bg-purple-950', border: 'border-purple-200 dark:border-purple-800', icon: 'text-purple-600 dark:text-purple-400' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-950', border: 'border-blue-200 dark:border-blue-800', icon: 'text-blue-600 dark:text-blue-400' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-950', border: 'border-orange-200 dark:border-orange-800', icon: 'text-orange-600 dark:text-orange-400' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-950', border: 'border-cyan-200 dark:border-cyan-800', icon: 'text-cyan-600 dark:text-cyan-400' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-950', border: 'border-pink-200 dark:border-pink-800', icon: 'text-pink-600 dark:text-pink-400' },
  green: { bg: 'bg-green-50 dark:bg-green-950', border: 'border-green-200 dark:border-green-800', icon: 'text-green-600 dark:text-green-400' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950', border: 'border-indigo-200 dark:border-indigo-800', icon: 'text-indigo-600 dark:text-indigo-400' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-950', border: 'border-amber-200 dark:border-amber-800', icon: 'text-amber-600 dark:text-amber-400' },
}

export function InsightCard({ title, content, icon, index, color, emoji }: InsightCardProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  const colorClasses = colorMap[color] || colorMap.blue
  const animationDelay = index * 100

  return (
    <div
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${animationDelay}ms` }}
    >
      <Card className={`border-2 ${colorClasses.border} ${colorClasses.bg} hover:shadow-xl hover:scale-105 transition-all h-full duration-300`}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2">
              {emoji && <span className="text-2xl">{emoji}</span>}
              <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 flex-shrink-0`}>
                <div className={`w-5 h-5 ${colorClasses.icon}`}>
                  {icon}
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm md:text-base">
                {title}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {content}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface EnhancedInsightsGridProps {
  insights: {
    fortalezasPrincipales: string
    areasDesarrollo: string
    estiloEntrevista: string
    dinamicaEquipo: string
    carreraAlign: string
    comunicacionEfectiva: string
    gestionConflicto: string
    proxiPaso: string
  }
}

export function EnhancedInsightsGrid({ insights }: EnhancedInsightsGridProps) {
  const insightsList = [
    {
      title: 'Tus Fortalezas Principales',
      content: insights.fortalezasPrincipales,
      icon: <Sparkles className="w-full h-full" />,
      color: 'purple',
      emoji: '⭐'
    },
    {
      title: 'Áreas de Desarrollo',
      content: insights.areasDesarrollo,
      icon: <Target className="w-full h-full" />,
      color: 'blue',
      emoji: '🎯'
    },
    {
      title: 'Tu Estilo en Entrevistas',
      content: insights.estiloEntrevista,
      icon: <Brain className="w-full h-full" />,
      color: 'orange',
      emoji: '🧠'
    },
    {
      title: 'Dinámica de Equipo',
      content: insights.dinamicaEquipo,
      icon: <Users className="w-full h-full" />,
      color: 'cyan',
      emoji: '👥'
    },
    {
      title: 'Carreras Alineadas',
      content: insights.carreraAlign,
      icon: <Briefcase className="w-full h-full" />,
      color: 'pink',
      emoji: '💼'
    },
    {
      title: 'Comunicación Efectiva',
      content: insights.comunicacionEfectiva,
      icon: <MessageSquare className="w-full h-full" />,
      color: 'green',
      emoji: '💬'
    },
    {
      title: 'Gestión de Conflictos',
      content: insights.gestionConflicto,
      icon: <Shield className="w-full h-full" />,
      color: 'indigo',
      emoji: '🛡️'
    },
    {
      title: 'Tu Próximo Paso',
      content: insights.proxiPaso,
      icon: <ArrowRight className="w-full h-full" />,
      color: 'amber',
      emoji: '➡️'
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insightsList.map((insight, index) => (
          <InsightCard
            key={index}
            title={insight.title}
            content={insight.content}
            icon={insight.icon}
            index={index}
            color={insight.color}
            emoji={insight.emoji}
          />
        ))}
      </div>
      
      {/* Divider */}
      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        <div className="text-2xl">✨</div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      </div>
    </div>
  )
}
