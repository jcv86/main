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
  purple: { bg: 'bg-purple/5 dark:bg-purple', border: 'border-purple/20 dark:border-purple', icon: 'text-purple dark:text-purple/40' },
  blue: { bg: 'bg-blue/5 dark:bg-blue', border: 'border-blue/20 dark:border-blue', icon: 'text-blue dark:text-blue/40' },
  orange: { bg: 'bg-orange/5 dark:bg-orange', border: 'border-orange/20 dark:border-orange', icon: 'text-orange dark:text-orange/40' },
  cyan: { bg: 'bg-cyan/5 dark:bg-cyan-950', border: 'border-cyan/20 dark:border-cyan', icon: 'text-cyan dark:text-cyan/40' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-950', border: 'border-pink-200 dark:border-pink-800', icon: 'text-pink-600 dark:text-pink-400' },
  green: { bg: 'bg-green/5 dark:bg-green', border: 'border-green/20 dark:border-green', icon: 'text-green dark:text-green/40' },
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
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'`}
      }`}
      style={{ transitionDelay: `${animationDelay}ms` }}
    >
      <Card className={`border-2 ${colorClasses.border} ${colorClasses.bg} hover:shadow-xl hover:scale-105 transition-all h-full duration-300`}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2">
              {emoji && <span className="text-2xl">{emoji}</span>}
              <div className={`p-2 rounded-[28px] bg-transparent flex-shrink-0`}>
                <div className={`w-5 h-5 ${colorClasses.icon}`}>
                  {icon}
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-muted/90 dark:text-white mb-2 text-sm md:text-base">
                {title}
              </h3>
              <p className="text-sm text-muted/70 dark:text-muted/30 leading-relaxed">
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
        <div className="flex-1 h-px bg-background" />
        <div className="text-2xl">✨</div>
        <div className="flex-1 h-px bg-background" />
      </div>
    </div>
  )
}
