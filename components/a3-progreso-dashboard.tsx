'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Circle, Clock } from 'lucide-react'

interface A3ProgresoDashboardProps {
  userId: string
}

export default function A3ProgresoDashboard({ userId }: A3ProgresoDashboardProps) {
  const [progreso, setProgreso] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgreso = async () => {
      try {
        const res = await fetch(`/api/a3/progreso?userId=${userId}`)
        const data = await res.json()
        setProgreso(data)
      } catch (error) {
        console.error('[v0] Error fetching progreso:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgreso()
  }, [userId])

  const fases = [
    { nombre: 'Días 1-30', descripcion: 'Educación & Orientación', icon: 'Conocimiento', color: 'bg-blue-500' },
    { nombre: 'Días 31-60', descripcion: 'Asistencia & Práctica', icon: 'Práctica', color: 'bg-purple-500' },
    { nombre: 'Días 61-90', descripcion: 'Transición & Aterrizaje', icon: 'Destino', color: 'bg-green-500' }
  ]

  if (loading) {
    return <div className="text-white">Cargando progreso...</div>
  }

  const porcentaje = progreso?.porcentaje_completado || 0
  const diaActual = progreso?.dia_actual || 1
  const fase = diaActual <= 30 ? 0 : diaActual <= 60 ? 1 : 2

  return (
    <div className="space-y-6">
      {/* Progreso general */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Tu Progreso 30-60-90</h2>

        <div className="flex items-center gap-8 mb-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#374151" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeDasharray={`${(porcentaje / 100) * 282.7} 282.7`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.3s' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{porcentaje}%</div>
                <div className="text-sm text-gray-400">Completado</div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-white font-semibold">Día {diaActual} de 90</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(diaActual / 90) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Entrevistas completadas: {progreso?.entrevistas_completadas || 0} de 6
            </p>
          </div>
        </div>
      </Card>

      {/* Fases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fases.map((fase_item, idx) => {
          const isActive = idx === fase
          const isCompleted = porcentaje >= ((idx + 1) / 3) * 100

          return (
            <Card
              key={idx}
              className={`p-6 border-2 transition-all ${
                isActive
                  ? 'bg-slate-700 border-blue-500'
                  : isCompleted
                  ? 'bg-slate-800 border-green-500'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                ) : isActive ? (
                  <Clock className="w-6 h-6 text-blue-500 flex-shrink-0 animate-spin" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-500 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold text-white">{fase_item.nombre}</h3>
                  <p className="text-sm text-gray-400">{fase_item.descripcion}</p>
                </div>
              </div>

              <div className="text-xs text-gray-500 pl-9">
                {isCompleted && <span className="text-green-400">✓ Completado</span>}
                {isActive && <span className="text-blue-400">Fase actual</span>}
                {!isActive && !isCompleted && <span>Por completar</span>}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Estadísticas */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h3 className="font-semibold text-white mb-4">Estadísticas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{progreso?.entrevistas_completadas || 0}</div>
            <div className="text-sm text-gray-400">Entrevistas</div>
          </div>
          <div className="p-4 bg-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{progreso?.videos_vistos || 0}</div>
            <div className="text-sm text-gray-400">Videos vistos</div>
          </div>
          <div className="p-4 bg-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{diaActual}</div>
            <div className="text-sm text-gray-400">Día actual</div>
          </div>
          <div className="p-4 bg-slate-700 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">{90 - diaActual}</div>
            <div className="text-sm text-gray-400">Días restantes</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
