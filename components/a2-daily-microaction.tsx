'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Target, CheckCircle2, Play } from 'lucide-react'
import { PERFIL_CONFIG } from '@/lib/a2-personalization-logic'

interface MicroActionProps {
  userId: string
  userProfile: 'A' | 'B' | 'C' | 'D'
  routeId: string
  onComplete?: () => void
}

interface MicroAction {
  id: string
  titulo: string
  descripcion: string
  formato: 'video' | 'lectura' | 'ejercicio' | 'proyecto' | 'quiz' | 'reflexion' | 'networking'
  duracion_minutos: number
  tareas: string[]
  objetivos: string[]
  contenido_url?: string
  completada: boolean
}

const FORMAT_ICONS: Record<string, string> = {
  video: '🎬',
  lectura: '📖',
  ejercicio: '✏️',
  proyecto: '🚀',
  quiz: '❓',
  reflexion: '💭',
  networking: '🤝'
}

export default function A2DailyMicroaction({ userId, userProfile, routeId, onComplete }: MicroActionProps) {
  const [microaction, setMicroaction] = useState<MicroAction | null>(null)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)

  const config = PERFIL_CONFIG[userProfile]

  useEffect(() => {
    fetchDailyMicroaction()
  }, [userId, userProfile, routeId])

  const fetchDailyMicroaction = async () => {
    try {
      const response = await fetch(`/api/a2/daily-action?userId=${userId}&routeId=${routeId}&profile=${userProfile}`)
      if (response.ok) {
        const data = await response.json()
        setMicroaction(data.action)
        setCompleted(data.completed || false)
      }
    } catch (error) {
      console.error('[v0] Error fetching microaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const completeAction = async () => {
    try {
      const response = await fetch('/api/a2/actions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, actionId: microaction?.id })
      })
      if (response.ok) {
        setCompleted(true)
        onComplete?.()
      }
    } catch (error) {
      console.error('[v0] Error completing action:', error)
    }
  }

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-700 rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!microaction) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <p className="text-gray-400">No hay microacción para hoy</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="border-2 transition-all"
      style={{ 
        borderColor: completed ? config.color : `${config.color}50`,
        backgroundColor: completed ? `${config.color}10` : 'rgb(30, 41, 59)'
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{FORMAT_ICONS[microaction.formato]}</span>
              <Badge 
                variant="outline"
                style={{ borderColor: config.color, color: config.color }}
              >
                {microaction.formato}
              </Badge>
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                {microaction.duracion_minutos} min
              </Badge>
            </div>
            <CardTitle className="text-xl text-white">{microaction.titulo}</CardTitle>
            <CardDescription className="text-gray-300 mt-1">
              {microaction.descripcion}
            </CardDescription>
          </div>
          {completed && (
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" style={{ color: config.color }} />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tareas */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            <Target className="w-4 h-4 inline mr-2" />
            Qué harás hoy:
          </h3>
          <div className="space-y-2">
            {microaction.tareas.map((tarea, i) => (
              <div 
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/50 cursor-pointer hover:bg-slate-700 transition-colors"
                onClick={() => setCurrentTaskIndex(i)}
              >
                <div 
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ 
                    borderColor: config.color,
                    backgroundColor: i < currentTaskIndex ? config.color : 'transparent'
                  }}
                >
                  {i < currentTaskIndex && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-sm text-gray-200">{tarea}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Objetivos */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Objetivos de aprendizaje:</h3>
          <div className="space-y-2">
            {microaction.objetivos.map((objetivo, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: config.color }}
                />
                {objetivo}
              </div>
            ))}
          </div>
        </div>

        {/* Info de perfil */}
        <div 
          className="p-4 rounded-lg border border-slate-600"
          style={{ backgroundColor: `${config.color}15` }}
        >
          <p className="text-xs text-gray-400 mb-1">Adaptado para tu perfil</p>
          <p className="text-sm text-gray-300">
            <strong>{config.nombre}:</strong> {config.descripcion_formato}
          </p>
        </div>

        {/* Botón de acción */}
        <Button
          onClick={completeAction}
          disabled={completed}
          className="w-full h-11 text-base font-semibold transition-all"
          style={{
            backgroundColor: completed ? `${config.color}40` : config.color,
            color: 'white'
          }}
        >
          {completed ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Completada
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Comenzar Ahora
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
