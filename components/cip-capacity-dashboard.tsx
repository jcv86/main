'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import CIPCapacityIndicator from './cip-capacity-indicator'

interface CapacityData {
  date: string
  effective_capacity: number
  success_probability: number
  progression_phase: string
  energy_level: number
  mood_rating: number
}

export default function CIPCapacityDashboard() {
  const [capacityData, setCapacityData] = useState<CapacityData | null>(null)
  const [historicalData, setHistoricalData] = useState<CapacityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCapacityData()
    const interval = setInterval(fetchCapacityData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const fetchCapacityData = async () => {
    try {
      const response = await fetch('/api/cip/daily')
      if (!response.ok) throw new Error('Failed to fetch capacity data')
      
      const data = await response.json()
      setCapacityData(data.today)
      setHistoricalData(data.last7days || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Cargando datos de capacidad...</div>
  }

  if (!capacityData) {
    return <div className="text-center text-red-500">No hay datos disponibles</div>
  }

  const getRiskLevel = (capacity: number) => {
    if (capacity <= 15) return { level: 'critical', color: 'text-red-600', bg: 'bg-red-50' }
    if (capacity <= 68) return { level: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { level: 'optimal', color: 'text-green-600', bg: 'bg-green-50' }
  }

  const risk = getRiskLevel(capacityData.effective_capacity)

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Capacidad Actual */}
        <Card className={risk.bg}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Capacidad Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${risk.color}`}>
              {capacityData.effective_capacity.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-2">Zona: {risk.level}</p>
          </CardContent>
        </Card>

        {/* Probabilidad de Éxito */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Prob. de Éxito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {capacityData.success_probability.toFixed(0)}%
            </div>
            <p className="text-xs text-gray-500 mt-2">Tareas completables hoy</p>
          </CardContent>
        </Card>

        {/* Nivel de Energía */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Energía</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {capacityData.energy_level}/100
            </div>
            <p className="text-xs text-gray-500 mt-2">Fase: {capacityData.progression_phase}</p>
          </CardContent>
        </Card>

        {/* Ánimo */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ánimo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">
              {capacityData.mood_rating}/10
            </div>
            <p className="text-xs text-gray-500 mt-2">Hoy</p>
          </CardContent>
        </Card>
      </div>

      {/* Indicador Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Indicador de Capacidad</CardTitle>
          <CardDescription>Visual de tu zona de trabajo actual</CardDescription>
        </CardHeader>
        <CardContent>
          <CIPCapacityIndicator capacity={capacityData.effective_capacity} />
        </CardContent>
      </Card>

      {/* Alertas basadas en capacidad */}
      {capacityData.effective_capacity <= 15 && (
        <Alert className="border-red-300 bg-red-50">
          <AlertDescription className="text-red-800">
            ⚠️ Capacidad crítica: Tu capacidad efectiva está en zona de frustración. Considera reducir carga y descansar.
          </AlertDescription>
        </Alert>
      )}
      {capacityData.effective_capacity > 15 && capacityData.effective_capacity <= 68 && (
        <Alert className="border-yellow-300 bg-yellow-50">
          <AlertDescription className="text-yellow-800">
            🎯 En zona de alerta: Tu capacidad está en el rango objetivo de sostenibilidad. Mantén este ritmo.
          </AlertDescription>
        </Alert>
      )}

      {/* Gráfico Histórico */}
      {historicalData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Capacidad (Últimos 7 días)</CardTitle>
            <CardDescription>Evolución de tu capacidad efectiva</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="colorCapacity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="effective_capacity" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCapacity)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert className="border-red-300 bg-red-50">
          <AlertDescription className="text-red-800">
            Error: {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
