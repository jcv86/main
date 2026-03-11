'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, ArrowRight, BookOpen, Zap, Target, Globe } from 'lucide-react'
import Link from 'next/link'

interface PillarCardProps {
  pillar: 'A1' | 'A2' | 'A3' | 'A4'
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
      bg: 'bg-red-50/50 dark:bg-red-950/10',
      border: 'border-red-200/50 dark:border-red-800/50',
      icon: 'text-red-600 dark:text-red-400',
      badge: 'bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      button: 'bg-red-600 hover:bg-red-700',
    },
    blue: {
      bg: 'bg-blue-50/50 dark:bg-blue-950/10',
      border: 'border-blue-200/50 dark:border-blue-800/50',
      icon: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    green: {
      bg: 'bg-green-50/50 dark:bg-green-950/10',
      border: 'border-green-200/50 dark:border-green-800/50',
      icon: 'text-green-600 dark:text-green-400',
      badge: 'bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      button: 'bg-green-600 hover:bg-green-700',
    },
    purple: {
      bg: 'bg-purple-50/50 dark:bg-purple-950/10',
      border: 'border-purple-200/50 dark:border-purple-800/50',
      icon: 'text-purple-600 dark:text-purple-400',
      badge: 'bg-purple-100/50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      button: 'bg-purple-600 hover:bg-purple-700',
    },
  }

  const colors = colorMap[color]

  const getStatusIcon = () => {
    if (status === 'completed') {
      return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
    } else if (status === 'active') {
      return <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
    } else {
      return <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
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
      <p className="text-sm text-slate-700 dark:text-slate-300">
        {description}
      </p>

      {/* Status Badge */}
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
        {getStatusLabel()}
      </div>

      {/* Next Step */}
      {nextStep && (
        <div className="pt-2">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
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
