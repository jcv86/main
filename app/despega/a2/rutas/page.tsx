'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Target, Users, TrendingUp, Zap } from 'lucide-react'

interface Route {
  id: string
  nombre: string
  descripcion: string
  duracion: number
  enfoque: string
  beneficios: string[]
  modulos_count: number
  icon: any
  color: string
  perfil_ideal: string
}

const routes: Route[] = [
  {
    id: 'liderazgo-ejecutivo',
    nombre: 'Liderazgo Ejecutivo',
    descripcion: 'Desarrolla habilidades de liderazgo estratégico, toma de decisiones y gestión de equipos de alto rendimiento.',
    duracion: 90,
    enfoque: 'Decisión & Estrategia',
    beneficios: ['Decisiones estratégicas', 'Gestión de equipos', 'Visión a largo plazo', 'Influencia organizacional'],
    modulos_count: 8,
    icon: Target,
    color: 'from-blue-500 to-blue-600',
    perfil_ideal: 'D - Dominante (Decisor)',
  },
  {
    id: 'comunicacion-influencia',
    nombre: 'Comunicación & Influencia',
    descripcion: 'Mejora tu capacidad de comunicación, persuasión y construcción de relaciones significativas en el equipo.',
    duracion: 90,
    enfoque: 'Relaciones & Conexión',
    beneficios: ['Comunicación efectiva', 'Influencia social', 'Relaciones significativas', 'Trabajo colaborativo'],
    modulos_count: 7,
    icon: Users,
    color: 'from-emerald-500 to-emerald-600',
    perfil_ideal: 'I - Influyente (Comunicador)',
  },
  {
    id: 'emprendimiento',
    nombre: 'Emprendimiento & Innovación',
    descripcion: 'Crea y escala negocios con metodología Lean Startup, validación de ideas y financiamiento.',
    duracion: 90,
    enfoque: 'Innovación & Crecimiento',
    beneficios: ['Validación de ideas', 'Business model canvas', 'Pitch perfecto', 'Gestión de crecimiento'],
    modulos_count: 9,
    icon: Zap,
    color: 'from-amber-500 to-amber-600',
    perfil_ideal: 'I - Influyente (Emprendedor)',
  },
  {
    id: 'transformacion-digital',
    nombre: 'Transformación Digital',
    descripcion: 'Lidera la transformación digital en tu organización con estrategia, tecnología y gestión del cambio.',
    duracion: 90,
    enfoque: 'Sistemas & Optimización',
    beneficios: ['Estrategia digital', 'Herramientas modernas', 'Cambio organizacional', 'Automatización'],
    modulos_count: 8,
    icon: TrendingUp,
    color: 'from-purple-500 to-purple-600',
    perfil_ideal: 'C - Concienzudo (Analítico)',
  },
]

export default function A2RoutasPage() {
  const router = useRouter()
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const cookieStore = await (await import('next/headers')).cookies()
      const response = await fetch('/rest/coach-context', {
        headers: { Cookie: cookieStore.toString() },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.context) {
          setUserProfile(data.context)
        }
      }
    } catch (error) {
      console.error('[v0] Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectRoute = async (routeId: string) => {
    setSelectedRoute(routeId)
    
    try {
      const response = await fetch('/rest/assign-trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          route_id: routeId,
        }),
      })

      if (response.ok) {
        setTimeout(() => {
          router.push(`/despega/a2/mision-90-dias?route=${routeId}`)
        }, 500)
      }
    } catch (error) {
      console.error('[v0] Error selecting route:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Elige Tu Ruta de Transformación
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Cada ruta está diseñada para llevarte desde donde estás hasta donde quieres llegar en 90 días
          </p>
          {userProfile?.a1_context?.perfil_dominante && (
            <Badge variant="secondary" className="text-base py-2 px-4">
              Tu Perfil: {userProfile.a1_context.perfil_dominante} - {['D', 'I', 'S', 'C'].includes(userProfile.a1_context.perfil_dominante) ? 'Personalización detectada' : 'Genérica'}
            </Badge>
          )}
        </div>

        {/* Routes Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {routes.map((route) => (
            <Card 
              key={route.id} 
              className={`group border-2 cursor-pointer transition-all duration-300 ${
                selectedRoute === route.id
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border hover:border-primary/50 hover:shadow-md'
              }`}
              onClick={() => selectRoute(route.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${route.color}`}>
                    <route.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="outline">{route.modulos_count} módulos</Badge>
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  {route.nombre}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {route.descripcion}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Duración</p>
                    <p className="font-semibold">{route.duracion} días</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Enfoque</p>
                    <p className="font-semibold text-sm">{route.enfoque}</p>
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <p className="text-sm font-semibold mb-2">Lograrás:</p>
                  <ul className="space-y-2">
                    {route.beneficios.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Button 
                  className="w-full group mt-4"
                  disabled={selectedRoute === route.id}
                >
                  {selectedRoute === route.id ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Iniciando...
                    </>
                  ) : (
                    <>
                      Elegir esta ruta
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Footer */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Puedes cambiar de ruta en cualquier momento desde tu dashboard
          </p>
          <Link href="/despega" className="inline-flex items-center text-primary hover:underline">
            Volver al Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}
