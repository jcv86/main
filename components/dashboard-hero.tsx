'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Target, BookOpen, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface DashboardHeroProps {
  userName: string
  discProfile: {
    D: number
    I: number
    S: number
    C: number
  }
  dominantProfile: string
  progressPercent: number
}

export function DashboardHero({ 
  userName, 
  discProfile, 
  dominantProfile,
  progressPercent = 0 
}: DashboardHeroProps) {
  const profileDescriptions: { [key: string]: { color: string; bg: string; description: string } } = {
    D: { color: 'text-red-600', bg: 'bg-red-50', description: 'Directo, decidido y orientado a resultados' },
    I: { color: 'text-blue-600', bg: 'bg-blue-50', description: 'Inspirador, influyente y orientado a personas' },
    S: { color: 'text-green-600', bg: 'bg-green-50', description: 'Estable, de apoyo y orientado al equipo' },
    C: { color: 'text-purple-600', bg: 'bg-purple-50', description: 'Cuidadoso, cauteloso y orientado a la calidad' },
  }

  const profile = profileDescriptions[dominantProfile] || profileDescriptions.I

  return (
    <div className="space-y-6 pb-8">
      {/* Header con Perfil */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50">
            Hola, <span className={profile.color}>{userName}</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Tu Transformación de 90 Días Comienza Hoy
          </p>
        </div>

        {/* Perfil DISC Card */}
        <Card className={`${profile.bg} border-2 ${profile.color.replace('text-', 'border-')}/20 p-6`}>
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className={`text-2xl font-bold ${profile.color}`}>
                Eres {dominantProfile === 'D' ? 'Rojo' : dominantProfile === 'I' ? 'Azul' : dominantProfile === 'S' ? 'Verde' : 'Púrpura'}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                {profile.description}
              </p>
            </div>

            {/* Gráfico DISC mini */}
            <div className="flex gap-3 items-center">
              {Object.entries(discProfile).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center gap-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    key === 'D' ? 'bg-red-500' :
                    key === 'I' ? 'bg-blue-500' :
                    key === 'S' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`}>
                    {value}%
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{key}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Progreso de 90 Días</span>
            <span className={`text-sm font-bold ${progressPercent === 0 ? 'text-blue-600' : 'text-green-600'}`}>
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${Math.max(progressPercent, 3)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
