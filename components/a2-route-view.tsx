'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle, Clock, Play, Lock, ChevronRight } from 'lucide-react'

interface MicroAction {
  id: string
  titulo: string
  descripcion: string
  duracion_minutos: number
  formato: string
  completada: boolean
  dia: number
}

interface Module {
  id: string
  nombre: string
  descripcion: string
  orden: number
  duracion_estimada: string
  acciones: MicroAction[]
}

interface RouteViewProps {
  routeId: string
  userId: string
  userProfile: string // A, B, C, D
}

export default function A2RouteView({ routeId, userId, userProfile }: RouteViewProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [currentModule, setCurrentModule] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    fetchRouteData()
  }, [routeId, userId])

  const fetchRouteData = async () => {
    try {
      const response = await fetch(`/api/a2/routes/${routeId}?userId=${userId}&profile=${userProfile}`)
      if (response.ok) {
        const data = await response.json()
        setModules(data.modules || [])
        setProgress(data.progress || 0)
        setCurrentModule(data.currentModule || 0)
      }
    } catch (error) {
      console.error('Error fetching route:', error)
    } finally {
      setLoading(false)
    }
  }

  const completeAction = async (actionId: string) => {
    try {
      const response = await fetch('/api/a2/actions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, actionId }),
      })
      if (response.ok) {
        fetchRouteData()
      }
    } catch (error) {
      console.error('Error completing action:', error)
    }
  }

  const getFormatoIcon = (formato: string) => {
    switch (formato) {
      case 'video': return '🎬'
      case 'lectura': return '📖'
      case 'ejercicio': return '✏️'
      case 'proyecto': return '🛠️'
      case 'quiz': return '❓'
      default: return '📋'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Tu Progreso</CardTitle>
              <CardDescription>
                Modulo {currentModule + 1} de {modules.length}
              </CardDescription>
            </div>
            <Badge variant={progress >= 100 ? 'default' : 'secondary'} className="text-lg px-4 py-1">
              {Math.round(progress)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Inicio</span>
            <span>30 dias</span>
            <span>60 dias</span>
            <span>90 dias</span>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-4">
        {modules.map((module, moduleIndex) => {
          const isUnlocked = moduleIndex <= currentModule
          const isCompleted = module.acciones.every(a => a.completada)
          const moduleProgress = module.acciones.length > 0
            ? (module.acciones.filter(a => a.completada).length / module.acciones.length) * 100
            : 0

          return (
            <Card 
              key={module.id} 
              className={`transition-all ${!isUnlocked ? 'opacity-60' : ''} ${moduleIndex === currentModule ? 'ring-2 ring-primary' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : isUnlocked ? (
                      <Circle className="h-6 w-6 text-primary" />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    )}
                    <div>
                      <CardTitle className="text-base">
                        Modulo {module.orden}: {module.nombre}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {module.descripcion}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {module.duracion_estimada}
                    </Badge>
                    {isUnlocked && (
                      <div className="text-xs text-muted-foreground">
                        {Math.round(moduleProgress)}% completado
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              {isUnlocked && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {module.acciones.map((accion) => (
                      <div
                        key={accion.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          accion.completada 
                            ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                            : 'bg-muted/50 hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getFormatoIcon(accion.formato)}</span>
                          <div>
                            <div className="font-medium text-sm">{accion.titulo}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {accion.duracion_minutos} min
                              <span className="capitalize">{accion.formato}</span>
                            </div>
                          </div>
                        </div>
                        {accion.completada ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => completeAction(accion.id)}
                            className="gap-1"
                          >
                            <Play className="h-3 w-3" />
                            Iniciar
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
