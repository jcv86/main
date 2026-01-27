'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import A2DailyMicroaction from '@/components/a2-daily-microaction'
import { Calendar, Target, Zap, TrendingUp, Play } from 'lucide-react'
import { PERFIL_CONFIG } from '@/lib/a2-personalization-logic'

interface RouteProgress {
  id: string
  route_id: string
  route_name: string
  route_color: string
  estado: string
  dia_actual: number
  porcentaje_completado: number
  fecha_inicio: string
  capacidad_promedio: number
}

export default function A2DashboardPage() {
  const [routes, setRoutes] = useState<RouteProgress[]>([])
  const [selectedRoute, setSelectedRoute] = useState<RouteProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')
  const [userProfile, setUserProfile] = useState<'A' | 'B' | 'C' | 'D'>('C')

  useEffect(() => {
    // Obtener datos del usuario
    const userData = JSON.parse(localStorage.getItem('dtc_session') || '{}')
    if (userData.user) {
      setUserId(userData.user.id)
      fetchRoutes(userData.user.id)
    }
  }, [])

  const fetchRoutes = async (userId: string) => {
    try {
      const response = await fetch(`/api/a2/routes?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setRoutes(data.routes || [])
        if (data.routes.length > 0) {
          setSelectedRoute(data.routes[0])
        }
      }
    } catch (error) {
      console.error('[v0] Error fetching routes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPhaseLabel = (dia: number) => {
    if (dia <= 30) return 'Fase 1: Fundamentos'
    if (dia <= 60) return 'Fase 2: Consolidación'
    return 'Fase 3: Dominio'
  }

  const getPhaseColor = (dia: number) => {
    if (dia <= 30) return '#3B82F6'
    if (dia <= 60) return '#F59E0B'
    return '#10B981'
  }

  const config = PERFIL_CONFIG[userProfile]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="container max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-2 h-8 rounded"
              style={{ backgroundColor: config.color }}
            />
            <h1 className="text-5xl font-bold text-white">
              Mi Ruta de Aprendizaje
            </h1>
          </div>
          <p className="text-gray-400 text-lg ml-5">
            Progresa a través de 90 días de aprendizaje personalizado
          </p>
        </div>

        {/* Seleccionar Ruta */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Mis Rutas Activas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {routes.map(route => (
              <Card 
                key={route.id}
                className={`cursor-pointer transition-all border-2 ${
                  selectedRoute?.id === route.id 
                    ? 'border-white' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setSelectedRoute(route)}
              >
                <CardContent className="pt-4">
                  <div 
                    className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: route.route_color }}
                  >
                    {route.route_name[0]}
                  </div>
                  <h3 className="font-semibold text-white mb-1">{route.route_name}</h3>
                  <p className="text-xs text-gray-400 mb-3">Día {route.dia_actual}/90</p>
                  <div className="space-y-1">
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${route.porcentaje_completado}%`,
                          backgroundColor: getPhaseColor(route.dia_actual)
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">{route.porcentaje_completado.toFixed(0)}%</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {selectedRoute && (
          <>
            {/* Progreso 30-60-90 */}
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-white mb-4">Progreso 30-60-90 Días</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { dias: 30, titulo: 'Fase 1', subtitle: 'Fundamentos', color: '#3B82F6' },
                  { dias: 60, titulo: 'Fase 2', subtitle: 'Consolidación', color: '#F59E0B' },
                  { dias: 90, titulo: 'Fase 3', subtitle: 'Dominio', color: '#10B981' }
                ].map((fase, i) => {
                  const completado = selectedRoute.dia_actual >= fase.dias
                  return (
                    <Card 
                      key={i}
                      className="border-slate-700"
                      style={{
                        backgroundColor: completado ? `${fase.color}15` : 'transparent',
                        borderColor: completado ? fase.color : 'inherit'
                      }}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-white">{fase.titulo}</h3>
                            <p className="text-xs text-gray-400">{fase.subtitle}</p>
                          </div>
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: fase.color }}
                          >
                            {completado ? '✓' : `${fase.dias}d`}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Progreso</span>
                            <span>{Math.min(100, (selectedRoute.dia_actual / fase.dias) * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${Math.min(100, (selectedRoute.dia_actual / fase.dias) * 100)}%`,
                                backgroundColor: fase.color
                              }}
                            />
                          </div>
                        </div>

                        {/* Milestones de la fase */}
                        <div className="mt-4 space-y-1 text-xs">
                          {i === 0 && (
                            <>
                              <p className="text-gray-400">✓ Conceptos base</p>
                              <p className="text-gray-400">✓ Primeros ejercicios</p>
                              <p className="text-gray-400">✓ Proyecto pequeño</p>
                            </>
                          )}
                          {i === 1 && (
                            <>
                              <p className="text-gray-400">✓ Profundización</p>
                              <p className="text-gray-400">✓ Casos reales</p>
                              <p className="text-gray-400">✓ Proyecto intermedio</p>
                            </>
                          )}
                          {i === 2 && (
                            <>
                              <p className="text-gray-400">✓ Especialización</p>
                              <p className="text-gray-400">✓ Proyectos complejos</p>
                              <p className="text-gray-400">✓ Mentoría / Enseñanza</p>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Microacción del Día */}
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Tu Acción de Hoy - Día {selectedRoute.dia_actual}
              </h2>
              {userId && (
                <A2DailyMicroaction 
                  userId={userId}
                  userProfile={userProfile}
                  routeId={selectedRoute.route_id}
                />
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Día Actual</p>
                      <p className="text-2xl font-bold text-white">{selectedRoute.dia_actual}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Progreso Total</p>
                      <p className="text-2xl font-bold text-white">{selectedRoute.porcentaje_completado.toFixed(0)}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Fase Actual</p>
                      <p className="text-sm font-bold text-white">{getPhaseLabel(selectedRoute.dia_actual)}</p>
                    </div>
                    <Zap 
                      className="w-8 h-8"
                      style={{ color: getPhaseColor(selectedRoute.dia_actual) }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Capacidad Promedio</p>
                      <p className="text-2xl font-bold text-white">{(selectedRoute.capacidad_promedio || 75).toFixed(0)}%</p>
                    </div>
                    <Target className="w-8 h-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Cargando rutas...</p>
          </div>
        )}

        {!loading && routes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No tienes rutas activas</p>
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Seleccionar una Ruta
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
