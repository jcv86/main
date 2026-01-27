'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Clock, TrendingUp } from 'lucide-react'

interface ProgressoA3 {
  dia_actual: number
  entrevistas_completadas: number
  porcentaje_completado: number
  fase: string
  score_promedio: number
}

export default function DashboardProgresoA3() {
  const [progreso, setProgreso] = useState<ProgressoA3 | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgreso = async () => {
      try {
        const response = await fetch('/api/a3/progreso')
        const data = await response.json()
        if (data.success) {
          setProgreso(data.data)
        }
      } catch (error) {
        console.error('[v0] Error fetching A3 progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgreso()
  }, [])

  if (loading || !progreso) {
    return (
      <div className="space-y-4">
        <Card className="h-48 bg-slate-800 animate-pulse" />
      </div>
    )
  }

  const fases = [
    { nombre: '30 Días', milestone: 'Educación', progress: Math.min(progreso.porcentaje_completado, 33) },
    { nombre: '60 Días', milestone: 'Asistencia', progress: Math.min(Math.max(progreso.porcentaje_completado - 33, 0), 33) },
    { nombre: '90 Días', milestone: 'Transición', progress: Math.min(Math.max(progreso.porcentaje_completado - 66, 0), 34) }
  ]

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Día Actual</p>
              <p className="text-3xl font-bold text-white">{progreso.dia_actual}</p>
              <p className="text-xs text-gray-500 mt-1">de 90 días</p>
            </div>
            <Clock className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Entrevistas</p>
              <p className="text-3xl font-bold text-white">{progreso.entrevistas_completadas}/6</p>
              <p className="text-xs text-gray-500 mt-1">completadas</p>
            </div>
            <CheckCircle2 className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-slate-800 border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Score Promedio</p>
              <p className="text-3xl font-bold text-white">{progreso.score_promedio}%</p>
              <p className="text-xs text-gray-500 mt-1">de desempeño</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Progress 30-60-90 */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h3 className="text-lg font-bold text-white mb-6">Progreso 30-60-90 Días</h3>
        <div className="space-y-6">
          {fases.map((fase, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="text-white font-semibold">{fase.nombre}</h4>
                  <p className="text-sm text-gray-400">{fase.milestone}</p>
                </div>
                <span className="text-sm text-gray-400">{Math.round(fase.progress)}%</span>
              </div>
              <Progress value={fase.progress} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Fase Actual */}
      <Card className="p-6 bg-slate-800 border-slate-700 border-blue-500/20">
        <h3 className="text-lg font-bold text-white mb-4">Fase Actual: {progreso.fase}</h3>
        <p className="text-gray-400 mb-4">
          {progreso.fase === 'Educación' && 'Aprende técnicas fundamentales de entrevista'}
          {progreso.fase === 'Asistencia' && 'Practica con casos reales y feedback'}
          {progreso.fase === 'Transición' && 'Prepárate para entrevistas reales con empleadores'}
        </p>
        <div className="pt-4 border-t border-slate-700">
          <p className="text-sm text-gray-500">
            Entrevistas completadas en esta fase: {progreso.entrevistas_completadas}
          </p>
        </div>
      </Card>
    </div>
  )
}
