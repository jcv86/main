"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, TrendingUp, BookOpen, Lightbulb, Globe, Radar, CheckCircle, Loader2 } from "lucide-react"

export default function A4HubPage() {
  const [loading, setLoading] = useState(true)
  const [waitingForSession, setWaitingForSession] = useState(true)
  const { user, loading: authLoading } = useAuthRedirect()
  const supabase = createClient()

  // Wait for session to load
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        setWaitingForSession(false)
      } else {
        const timeout = setTimeout(() => {
          setWaitingForSession(false)
        }, 2000)
        return () => clearTimeout(timeout)
      }
    }
  }, [authLoading, user])

  // Load data only after session is confirmed
  useEffect(() => {
    if (waitingForSession || !user?.id) return
    
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100))
        setLoading(false)
      } catch (error) {
        console.error('[v0] Error loading A4 data:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [waitingForSession, user?.id, supabase])

  // Show loading state while checking auth or waiting for session
  if (authLoading || waitingForSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando A4...</p>
        </div>
      </div>
    )
  }

  // If no user after auth check is done, show login link
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Necesitas autenticarte para acceder a A4</p>
          <Link href="/auth/signin">
            <Button>Ir a Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm">
              <Globe className="w-3 h-3 mr-2" />
              Fase A4: Radar Estratégico
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
              Entiende el Mercado en Tiempo Real
            </h1>
            <p className="text-xl text-muted-foreground text-balance mb-8">
              Análisis estructurado de noticias con 7 capas cognitivas. Entiende qué está pasando realmente en Chile y cómo te afecta.
            </p>
            <Link href="/despega">
              <Button variant="outline">Volver a Despega</Button>
            </Link>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* What is A4 */}
          <Card className="border-0 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-3">
                <Radar className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>¿Qué es el Radar?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Un análisis estructurado de noticias con 7 capas cognitivas:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Qué cambió vs ayer</li>
                <li>Impacto potencial</li>
                <li>Narrativa vs realidad</li>
                <li>Weak signals</li>
                <li>Tu energía hoy</li>
                <li>Acción sugerida</li>
                <li>Watchlist personal</li>
              </ul>
            </CardContent>
          </Card>

          {/* Why it Matters */}
          <Card className="border-0 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <div className="p-3 bg-blue-500/10 rounded-lg w-fit mb-3">
                <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Por Qué Importa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>La mayoría de personas consume noticias reactivamente. El Radar te da:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Contexto, no solo titulares</li>
                <li>Impacto laboral & económico</li>
                <li>Interpretación estructurada</li>
                <li>Posibilidades de acción</li>
                <li>Curación editorial diaria</li>
              </ul>
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <Card className="border-0 bg-card/70 backdrop-blur-sm md:col-span-2">
            <CardHeader>
              <div className="p-3 bg-amber-500/10 rounded-lg w-fit mb-3">
                <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle>Próximas Funcionalidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Noticias Personalizadas</p>
                    <p className="text-muted-foreground">Por tu perfil & ruta</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Tests de Cultura General</p>
                    <p className="text-muted-foreground">Entrenamiento cognitivo</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Biblioteca Curada</p>
                    <p className="text-muted-foreground">Recursos seleccionados</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Chile en Números</p>
                    <p className="text-muted-foreground">Indicadores económicos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
