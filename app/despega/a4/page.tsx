"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { PanoramadelDia } from "@/components/a4/panorama-del-dia"
import { ChileEnNumeros } from "@/components/a4/chile-en-numeros"
import { NoticiasBase } from "@/components/a4/noticias-base"
import { QueSIgnificaParaTi } from "@/components/a4/que-significa-para-ti"
import { MiniTest } from "@/components/a4/mini-test"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, TrendingUp, BookOpen, Lightbulb, Globe, Radar, CheckCircle, Loader2, Bookmark } from "lucide-react"

export default function A4HubPage() {
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [waitingForSession, setWaitingForSession] = useState(true)
  const { user, loading: authLoading } = useAuthRedirect()
  const supabase = createClient()

  // Wait a bit longer for session to load from Supabase
  useEffect(() => {
    if (!authLoading) {
      // Auth check is done
      if (user) {
        // User found, proceed with data loading
        setWaitingForSession(false)
      } else {
        // No user after initial auth - wait a bit more in case session is loading
        const timeout = setTimeout(() => {
          setWaitingForSession(false)
        }, 2000)
        return () => clearTimeout(timeout)
      }
    }
  }, [authLoading, user])

  useEffect(() => {
    if (waitingForSession || !user?.id) return
    
    const loadData = async () => {
      try {
        // Get user Despega profile
        const { data: despegarProfile } = await supabase
          .from("despega_cerebral_perfil")
          .select("tipo_perfil")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        if (despegarProfile) {
          console.log('[v0] User Despega profile:', despegarProfile.tipo_perfil)
          setUserProfile(despegarProfile)
        }
      } catch (error) {
        console.error('[v0] Error loading A4 data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [authLoading, user?.id, supabase])

  // Show loading state while checking auth or waiting for session to load
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
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm">
              <Radar className="w-3 h-3 mr-2" />
              A4: Radar Estratégico
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
              Panorama Estratégico del Día
            </h1>
            <p className="text-xl text-muted-foreground text-balance mb-4">
              Análisis estructurado de noticias con 7 capas cognitivas. Entiende qué está pasando realmente en Chile, no solo qué dicen que pasó.
            </p>
            {userProfile && (
              <Badge className="bg-primary/10 text-primary px-3 py-1 text-sm">
                Personalizado para: {userProfile.tipo_perfil}
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* Bloque 1: Panorama del Día */}
          <PanoramadelDia isLoading={loading} />

          {/* Bloque 2: Chile en Números */}
          <ChileEnNumeros isLoading={loading} />

          {/* Bloque 3: Noticias Base */}
          <NoticiasBase isLoading={loading} />

          {/* Bloque 5: Qué Significa Para Ti */}
          <QueSIgnificaParaTi isLoading={loading} />

          {/* Bloque 6: Mini Test */}
          <MiniTest isLoading={loading} />

          {/* Watchlist Section */}
          <Card className="border-0 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Tu Watchlist</CardTitle>
                <Badge variant="outline">5 Guardadas</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Noticias que guardaste para monitorear
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm">
                  Guarda noticias a lo largo del día para revisarlas después
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/despega/a4/watchlist">
                    Ver tu Watchlist
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <Link href="/despega/a4/noticias" className="group">
              <Card className="h-full border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors mb-4 w-fit">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Todas las Noticias</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Acceso a todo el archivo de noticias seleccionadas
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/despega/a4/aprender" className="group">
              <Card className="h-full border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
                <CardHeader>
                  <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors mb-4 w-fit">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">Cultura General</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tests gamificados y entrenamiento cognitivo
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/despega/a4/biblioteca" className="group">
              <Card className="h-full border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
                <CardHeader>
                  <div className="p-3 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors mb-4 w-fit">
                    <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-lg">Biblioteca Curada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Recursos seleccionados para tu crecimiento
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
