'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, ArrowRight, BookOpen, Zap, Target, Globe } from 'lucide-react'
import Link from 'next/link'

interface PillarCardProps {
  pillar: 'A1' | 'A2' | 'A3' | 'A4'
  pillarName: 'El Ritual' | 'Exploración' | 'Entrenamiento' | 'La Realidad'
  title: string
  status: 'completed' | 'active' | 'pending'
  description: string
  nextStep: string
  href: string
  icon: React.ReactNode
  color: 'red' | 'blue' | 'green' | 'purple'
}

export function PillarCard({
  pillar,
  pillarName,
  title,
  status,
  description,
  nextStep,
  href,
  icon,
  color,
}: PillarCardProps) {
  const colorMap = {
    red: {
      bg: 'bg-red/5 dark:bg-red/10',
      border: 'border-red/20 dark:border-red/50',
      icon: 'text-red dark:text-red',
      badge: 'bg-red/10 dark:bg-red/30 text-red dark:text-red',
      button: 'bg-red hover:bg-red/80',
    },
    blue: {
      bg: 'bg-blue/5 dark:bg-blue/10',
      border: 'border-blue/20 dark:border-blue/50',
      icon: 'text-blue dark:text-blue',
      badge: 'bg-blue/10 dark:bg-blue/30 text-blue dark:text-blue',
      button: 'bg-blue hover:bg-blue/80',
    },
    green: {
      bg: 'bg-green/5 dark:bg-green/10',
      border: 'border-green/20 dark:border-green/50',
      icon: 'text-green dark:text-green',
      badge: 'bg-green/10 dark:bg-green/30 text-green dark:text-green',
      button: 'bg-green hover:bg-green/80',
    },
    purple: {
      bg: 'bg-purple/5 dark:bg-purple/10',
      border: 'border-purple/20 dark:border-purple/50',
      icon: 'text-purple dark:text-purple',
      badge: 'bg-purple/10 dark:bg-purple/30 text-purple dark:text-purple',
      button: 'bg-purple hover:bg-purple/80',
    },
  }

  const colors = colorMap[color]

  const getStatusIcon = () => {
    if (status === 'completed') {
      return <CheckCircle2 className="w-5 h-5 text-green dark:text-green" />
    } else if (status === 'active') {
      return <Clock className="w-5 h-5 text-blue dark:text-blue animate-spin" />
    } else {
      return <ArrowRight className="w-5 h-5 text-muted dark:text-muted" />
    }
  }

  const getStatusLabel = () => {
    if (status === 'completed') return 'Completado'
    if (status === 'active') return 'En Progreso'
    return 'Próximo'
  }

  return (
    <Card className={`${colors.bg} border-2 ${colors.border} p-6 space-y-4 hover:shadow-lg transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`${colors.icon} mt-1`}>{icon}</div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-muted">{pillar}: {pillarName}</h3>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-xs font-medium text-muted/60 dark:text-muted/40">{getStatusLabel()}</span>
        </div>
      </div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-lg ${colors.badge}`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {pillar}
              </span>
              {getStatusIcon()}
            </div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted">
        {description}
      </p>

      {/* Status Badge */}
      <div className={`inline-block px-3 py-1 rounded-[20px] text-xs font-semibold ${colors.badge}`}>
        {getStatusLabel()}
      </div>

      {/* Next Step */}
      {nextStep && (
        <div className="pt-2">
          <p className="text-xs text-muted mb-2">
            <strong>Próximo:</strong> {nextStep}
          </p>
        </div>
      )}

      {/* Action Button */}
      <Link href={href}>
        <Button 
          className={`w-full ${colors.button} text-white font-semibold`}
          disabled={status === 'pending' && pillar !== 'A2'}
        >
          {status === 'completed' ? 'Ver Resultado' : status === 'active' ? 'Continuar' : 'Comenzar'}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </Link>
    </Card>
  )
}
