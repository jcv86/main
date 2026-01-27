'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, Zap, BookOpen, Code, Users, Brain, Award } from 'lucide-react'
import { PERFIL_CONFIG } from '@/lib/a2-personalization-logic'

interface MicroAction {
  id: string
  dia: number
  titulo: string
  descripcion: string
  formato: string
  duracion_minutos: number
  tareas: string[]
  objetivos: string[]
  completado: boolean
}

interface A2DailyMicroactionsProps {
  routeId: string
  userId: string
  userPerfil: 'A' | 'B' | 'C' | 'D'
  capacidadDisponible: number
  diaActual: number
}

const FORMATO_ICONS = {
  video: BookOpen,
  lectura: BookOpen,
  ejercicio: Code,
  proyecto: Award,
  quiz: Brain,
  reflexion: Users,
  networking: Users
}

export default function A2DailyMicroactions({
  routeId,
  userId,
  userPerfil,
  capacidadDisponible,
  diaActual
}: A2DailyMicroactionsProps) {
  const [microactions, setMicroactions] = useState<MicroAction[]>([])
  const [loading, setLoading] = useState(true)
  const [completedCount, setCompletedCount] = useState(0)

  const perfilConfig = PERFIL_CONFIG[userPerfil]

  useEffect(() => {
    fetchDailyActions()
  }, [routeId, userId, diaActual])

  const fetchDailyActions = async () => {
    try {
      const response = await fetch(
        `/api/a2/daily-actions?routeId=${routeId}&userId=${userId}&dia=${diaActual}&perfil=${userPerfil}`
      )
      if (response.ok) {
        const data = await response.json()
        setMicroactions(data.actions || [])
        setCompletedCount(data.actions?.filter((a: MicroAction) => a.completado).length || 0)
      }
    } catch (error) {
      console.error('[v0] Error fetching daily actions:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAction = async (actionId: string) => {
    try {
      const response = await fetch('/api/a2/actions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          routeId,
          actionId
        })
      })

      if (response.ok) {
        setMicroactions(prev =>
          prev.map(action =>
            action.id === actionId
              ? { ...action, completado: !action.completado }
              : action
          )
        )
        setCompletedCount(prev => 
          microactions.find(a => a.id === actionId)?.completado ? prev - 1 : prev + 1
        )
      }
    } catch (error) {
      console.error('[v0] Error toggling action:', error)
    }
  }

  const totalDuracion = microactions.reduce((sum, a) => sum + a.duracion_minutos, 0)
  const durationOk = totalDuracion <= capacidadDisponible

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Cargando acciones del día...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header con progreso del día */}
      <Card className="p-6 bg-gradient-to-r border-0" style={{
        backgroundImage: `linear-gradient(135deg, ${perfilConfig.color}20, ${perfilConfig.color}40)`
      }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Acciones de Hoy</h2>
            <p className="text-gray-300">Día {diaActual} de tu ruta</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold" style={{ color: perfilConfig.color }}>
              {completedCount}/{microactions.length}
            </div>
            <p className="text-gray-400 text-sm">Completadas</p>
          </div>
        </div>

        {/* Indicadores */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-black/20">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-gray-300" />
              <span className="text-xs text-gray-400">Duración Total</span>
            </div>
            <div className="text-lg font-bold text-white">
              {totalDuracion} min
            </div>
          </div>
          <div className="p-3 rounded-lg bg-black/20">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} style={{ color: capacidadDisponible >= totalDuracion ? '#10B981' : '#EF4444' }} />
              <span className="text-xs text-gray-400">Capacidad</span>
            </div>
            <div className={`text-lg font-bold ${capacidadDisponible >= totalDuracion ? 'text-green-400' : 'text-red-400'}`}>
              {capacidadDisponible} min
            </div>
          </div>
          <div className="p-3 rounded-lg bg-black/20">
            <div className="flex items-center gap-2 mb-1">
              <Brain size={16} className="text-gray-300" />
              <span className="text-xs text-gray-400">Estilo</span>
            </div>
            <div className="text-sm font-bold text-white">
              {perfilConfig.nombre}
            </div>
          </div>
        </div>

        {!durationOk && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm">
              ⚠️ El tiempo total ({totalDuracion}min) excede tu capacidad disponible ({capacidadDisponible}min). 
              Considera completar menos acciones hoy.
            </p>
          </div>
        )}
      </Card>

      {/* Lista de microacciones */}
      <div className="space-y-3">
        {microactions.map((action, idx) => {
          const IconComponent = FORMATO_ICONS[action.formato as keyof typeof FORMATO_ICONS] || BookOpen
          
          return (
            <Card
              key={action.id}
              className={`p-4 cursor-pointer transition-all border-2 ${
                action.completado
                  ? 'bg-slate-700/30 border-slate-600 opacity-60'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-500'
              }`}
              onClick={() => toggleAction(action.id)}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  {action.completado ? (
                    <CheckCircle2 size={24} className="text-green-500" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-500" />
                  )}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className={`font-semibold text-sm mb-1 ${action.completado ? 'line-through text-gray-500' : 'text-white'}`}>
                        {idx + 1}. {action.titulo}
                      </h3>
                      <p className="text-xs text-gray-400">{action.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Clock size={14} className="text-gray-500" />
                      <span className="text-xs text-gray-400">{action.duracion_minutos}m</span>
                    </div>
                  </div>

                  {/* Tags de formato y objetivos */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    <div 
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                      style={{ 
                        backgroundColor: `${perfilConfig.color}30`,
                        color: perfilConfig.color
                      }}
                    >
                      <IconComponent size={12} />
                      {action.formato}
                    </div>
                    {action.tareas && action.tareas.length > 0 && (
                      <div className="px-2 py-1 rounded text-xs bg-slate-700/50 text-slate-200">
                        {action.tareas.length} tareas
                      </div>
                    )}
                  </div>

                  {/* Objetivos */}
                  {action.objetivos && action.objetivos.length > 0 && (
                    <div className="text-xs text-gray-400">
                      <strong>Objetivo:</strong> {action.objetivos[0]}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Resumen */}
      {microactions.length === 0 && (
        <Card className="p-6 text-center bg-slate-800 border-slate-700">
          <p className="text-gray-400">No hay acciones para hoy</p>
        </Card>
      )}
    </div>
  )
}
