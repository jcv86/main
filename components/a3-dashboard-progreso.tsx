'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Star, Zap, Award } from 'lucide-react'

interface ProgressData {
  ciclo_actual: number
  porcentaje_ciclo: number
  total_entrevistas: number
  score_promedio: number
  ultima_entrevista: {
    fecha: string
    score: number
    duracion: number
  }
  badges: string[]
}

export default function A3DashboardProgreso() {
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgreso = async () => {
      try {
        const response = await fetch('/api/a3/progreso')
        if (response.ok) {
          const result = await response.json()
          setData(result.data)
        }
      } catch (error) {
        console.error('[v0] Error fetching progreso:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProgreso()
  }, [])

  if (loading) return <div className="p-4 text-center">Cargando progreso...</div>
  if (!data) return null

  const cicloNombres = { 30: 'Ciclo 30', 60: 'Ciclo 60', 90: 'Ciclo 90' }
  const cicloActual = cicloNombres[data.ciclo_actual as keyof typeof cicloNombres]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Tu Progreso en Entrevistas</h2>
          <p className="text-muted-foreground mt-1">{cicloActual}: {data.porcentaje_ciclo}% completado</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-primary">{data.score_promedio.toFixed(0)}/100</div>
          <p className="text-sm text-muted-foreground">Score promedio</p>
        </div>
      </div>

      {/* Progress Bar del Ciclo */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            {cicloActual}
          </h3>
          <span className="text-sm font-medium">{data.porcentaje_ciclo}%</span>
        </div>
        <Progress value={data.porcentaje_ciclo} className="h-3" />
        <p className="text-xs text-muted-foreground mt-2">
          {data.total_entrevistas} entrevistas completadas
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-amber-500" />
            <p className="text-sm text-muted-foreground">Score Actual</p>
          </div>
          <p className="text-2xl font-bold">{data.score_promedio.toFixed(0)}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-purple-500" />
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <p className="text-2xl font-bold">{data.total_entrevistas}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-green-500" />
            <p className="text-sm text-muted-foreground">Badges</p>
          </div>
          <p className="text-2xl font-bold">{data.badges.length}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <p className="text-sm text-muted-foreground">Mejora</p>
          </div>
          <p className="text-2xl font-bold text-green-600">+8%</p>
        </Card>
      </div>

      {/* Última Entrevista */}
      {data.ultima_entrevista && (
        <Card className="p-6 border-l-4 border-l-green-500">
          <h3 className="font-semibold mb-3">Última Entrevista</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha:</span>
              <span className="font-medium">{new Date(data.ultima_entrevista.fecha).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Score:</span>
              <span className="font-bold text-green-600">{data.ultima_entrevista.score}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duración:</span>
              <span className="font-medium">{Math.round(data.ultima_entrevista.duracion / 60)}s</span>
            </div>
          </div>
        </Card>
      )}

      {/* Badges */}
      {data.badges.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Logros Desbloqueados</h3>
          <div className="flex flex-wrap gap-2">
            {data.badges.map((badge) => (
              <Badge key={badge} variant="secondary">{badge}</Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
