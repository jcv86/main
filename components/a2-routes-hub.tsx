'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Code, Crown, Rocket, Users, Clock, BookOpen, Play, Lock, CheckCircle } from 'lucide-react'
import { LearningRoute, UserRouteProgress, PERFIL_CONFIG, PerfilTipo, startRoute } from '@/lib/a2-personalization-logic'

interface A2RoutesHubProps {
  routes: LearningRoute[]
  userPerfil: PerfilTipo
  userProgress: Record<string, UserRouteProgress>
  userId: string
}

const ICON_MAP: Record<string, any> = {
  Code: Code,
  Crown: Crown,
  Rocket: Rocket,
  Users: Users
}

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-600 border-blue-200',
  amber: 'bg-amber-500/10 text-amber-600 border-amber-200',
  purple: 'bg-purple-500/10 text-purple-600 border-purple-200',
  green: 'bg-green-500/10 text-green-600 border-green-200'
}

export default function A2RoutesHub({ routes, userPerfil, userProgress, userId }: A2RoutesHubProps) {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  const perfilConfig = PERFIL_CONFIG[userPerfil]
  
  const handleStartRoute = async (routeId: string) => {
    setIsStarting(true)
    try {
      await startRoute(userId, routeId)
      window.location.href = `/despega/a2/rutas/${routeId}`
    } catch (error) {
      console.error('Error starting route:', error)
    } finally {
      setIsStarting(false)
    }
  }

  const getRouteStatus = (route: LearningRoute) => {
    const progress = userProgress[route.id]
    if (!progress) return 'disponible'
    if (progress.estado === 'completado') return 'completado'
    if (progress.estado === 'activo') return 'en_progreso'
    return 'disponible'
  }

  return (
    <div className="space-y-8">
      {/* Header con perfil del usuario */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-2xl">
          {perfilConfig.emoji}
        </div>
        <div>
          <h2 className="text-lg font-semibold">Tu perfil: {perfilConfig.nombre}</h2>
          <p className="text-sm text-muted-foreground">{perfilConfig.estilo}</p>
        </div>
        <Badge variant="outline" className="ml-auto">
          {perfilConfig.descripcion_formato}
        </Badge>
      </div>

      {/* Grid de rutas */}
      <div className="grid gap-6 md:grid-cols-2">
        {routes.map((route) => {
          const IconComponent = ICON_MAP[route.icono] || BookOpen
          const colorClass = COLOR_MAP[route.color] || COLOR_MAP.blue
          const status = getRouteStatus(route)
          const progress = userProgress[route.id]
          const isRecommended = route.perfil_ideal === userPerfil

          return (
            <Card 
              key={route.id} 
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                isRecommended ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              {isRecommended && (
                <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium text-white bg-primary rounded-bl-lg">
                  Recomendado para ti
                </div>
              )}

              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg border ${colorClass}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{route.nombre}</CardTitle>
                    <CardDescription className="mt-1">{route.descripcion}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Metadatos */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{route.duracion_dias} días</span>
                  </div>
                  <Badge variant="secondary">{route.nivel}</Badge>
                  <Badge variant="outline">Perfil {route.perfil_ideal}</Badge>
                </div>

                {/* Progreso si existe */}
                {progress && status === 'en_progreso' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Día {progress.dia_actual} de {route.duracion_dias}</span>
                      <span>{Math.round(progress.porcentaje_completado)}%</span>
                    </div>
                    <Progress value={progress.porcentaje_completado} className="h-2" />
                  </div>
                )}

                {/* Botón de acción */}
                <div className="pt-2">
                  {status === 'disponible' && (
                    <Button 
                      className="w-full" 
                      onClick={() => handleStartRoute(route.id)}
                      disabled={isStarting}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar Ruta
                    </Button>
                  )}
                  {status === 'en_progreso' && (
                    <Button 
                      className="w-full" 
                      variant="secondary"
                      onClick={() => window.location.href = `/despega/a2/rutas/${route.id}`}
                    >
                      Continuar Aprendizaje
                    </Button>
                  )}
                  {status === 'completado' && (
                    <Button className="w-full" variant="outline" disabled>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completado
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Explicación de personalización */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Como funciona la personalización:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>1. Cada ruta tiene microacciones adaptadas a tu perfil {perfilConfig.emoji}</li>
            <li>2. El contenido se ajusta a tu estilo: {perfilConfig.estilo}</li>
            <li>3. La duración se adapta a tu capacidad diaria (CIP)</li>
            <li>4. Formatos preferidos: {perfilConfig.formatos_preferidos.join(', ')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
