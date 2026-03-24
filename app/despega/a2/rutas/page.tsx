'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Target, Users, TrendingUp, Zap, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Route {
  id: string
  nombre: string
  descripcion: string
  duracion: number
  enfoque: string
  beneficios: string[]
  razon_seleccion: string
  icon: React.ReactNode
  color: string
}

const routeIcons: Record<string, any> = {
  'liderazgo': Target,
  'comunicacion': Users,
  'emprendimiento': Zap,
  'transformacion': TrendingUp,
}

const routeColors: Record<string, string> = {
  'liderazgo': 'from-blue-500 to-blue-600',
  'comunicacion': 'from-emerald-500 to-emerald-600',
  'emprendimiento': 'from-amber-500 to-amber-600',
  'transformacion': 'from-purple-500 to-purple-600',
}

export default function A2RoutasPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [routes, setRoutes] = useState<Route[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUserDataAndGenerateRoutes()
  }, [])

  const loadUserDataAndGenerateRoutes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) {
        router.push('/auth/signin')
        return
      }

      console.log('[v0] Loading user profile and responses for route generation...')

      // Get A1 Cerebral profile - try different possible table names
      let a1Data = null
      const possibleA1Tables = ['despega_cerebral_perfil', 'a1_disc_assessment', 'canon_a1_profile']
      
      for (const table of possibleA1Tables) {
        const { data } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        
        if (data) {
          a1Data = data
          break
        }
      }

      // Get Conozcámonos-2 responses using the correct table
      let c2Data = null
      const { data: c2Response } = await supabase
        .from('canon_conozcamonos_2_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('step1_completed', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      c2Data = c2Response

      if (!a1Data || !c2Data) {
        console.log('[v0] Missing data - A1:', !!a1Data, 'C2:', !!c2Data)
        setError('No se encontraron tus respuestas. Por favor completa Conozcámonos 1 y 2 primero.')
        setLoading(false)
        return
      }

      setUserProfile({
        profile: a1Data.tipo_perfil || a1Data.disc_profile || a1Data,
        responses: c2Data.responses || c2Data
      })

      // Generate routes using the real data
      generateRoutes(user.id, a1Data, c2Data)
    } catch (err) {
      console.error('[v0] Error loading user data:', err)
      setError('Error al cargar tus datos. Intenta de nuevo.')
      setLoading(false)
    }
  }

  const generateRoutes = async (userId: string, profile: any, responses: any) => {
    try {
      console.log('[v0] Generating personalized routes...')
      
      // Call the backend route generator
      const response = await fetch('/api/despega/canon-generate-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      })

      if (!response.ok) {
        throw new Error('Failed to generate routes')
      }

      const generatedRoutes = await response.json()
      console.log('[v0] Routes generated:', generatedRoutes)

      // Format routes with icons and colors
      const formattedRoutes: Route[] = (generatedRoutes.routes || []).map((route: any) => ({
        id: route.id,
        nombre: route.nombre,
        descripcion: route.descripcion,
        duracion: route.duracion || 90,
        enfoque: route.enfoque,
        beneficios: route.beneficios || [],
        razon_seleccion: route.razon_seleccion,
        icon: routeIcons[route.tipo] || Target,
        color: routeColors[route.tipo] || 'from-slate-500 to-slate-600'
      }))

      setRoutes(formattedRoutes)
    } catch (err) {
      console.error('[v0] Error generating routes:', err)
      setError('Error al generar tus rutas personalizadas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const selectRoute = async (routeId: string) => {
    setSelectedRoute(routeId)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) return

      // Save selected route
      const { error: saveError } = await supabase
        .from('user_a2_routes')
        .insert({
          user_id: user.id,
          route_id: routeId,
          selected_at: new Date().toISOString()
        })

      if (saveError) throw saveError

      setTimeout(() => {
        router.push(`/despega/a2/mision-90-dias?route=${routeId}`)
      }, 500)
    } catch (err) {
      console.error('[v0] Error selecting route:', err)
      setError('Error al seleccionar la ruta. Intenta de nuevo.')
      setSelectedRoute(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Generando tus rutas personalizadas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center p-4">
        <Card className="max-w-md border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{error}</p>
            <Button onClick={() => router.push('/despega')} className="w-full">
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Tu Ruta Personalizada
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Basadas en tu perfil {userProfile?.profile?.primary} y tus objetivos específicos
          </p>
          {userProfile?.profile && (
            <div className="space-y-2">
              <Badge variant="secondary" className="text-base py-2 px-4">
                Perfil Dominante: {['D', 'I', 'S', 'C'].includes(userProfile.profile.primary) ? 
                  ['Directo', 'Inspirador', 'Seguro', 'Consciente'][['D', 'I', 'S', 'C'].indexOf(userProfile.profile.primary)] 
                  : userProfile.profile.primary}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Puntuación: D={userProfile.profile.D}% I={userProfile.profile.I}% S={userProfile.profile.S}% C={userProfile.profile.C}%
              </p>
            </div>
          )}
        </div>

        {/* Routes Grid */}
        {routes.length > 0 ? (
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
                      {route.icon && typeof route.icon === 'function' && 
                        route.icon({ className: 'w-6 h-6 text-white' })
                      }
                    </div>
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

                  {/* Why this route */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm">
                      <span className="font-semibold text-blue-900 dark:text-blue-100">Por qué para ti: </span>
                      <span className="text-blue-800 dark:text-blue-200">{route.razon_seleccion}</span>
                    </p>
                  </div>

                  {/* Benefits */}
                  {route.beneficios.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Lograrás:</p>
                      <ul className="space-y-2">
                        {route.beneficios.slice(0, 4).map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

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
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No se generaron rutas. Intenta de nuevo.</p>
            <Button onClick={loadUserDataAndGenerateRoutes}>
              Reintentar
            </Button>
          </div>
        )}

        {/* Info Footer */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Cada ruta está diseñada según tu perfil y tus respuestas específicas
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

