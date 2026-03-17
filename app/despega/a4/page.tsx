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
          <div className="text-center max-w-3xl mx-auto mb-8">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm">
              <Globe className="w-3 h-3 mr-2" />
              Fase A4: Contexto & Cultura
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
              Entiende el Mundo Real
            </h1>
            <p className="text-xl text-muted-foreground text-balance mb-8">
              Noticias del mercado laboral, insights sobre industrias, y cultura general profesional. Tu brújula para tomar decisiones informadas.
            </p>
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Radar Estratégico */}
          <Link href="/despega/a4/radar" className="group lg:col-span-2">
            <Card className="h-full border-0 bg-gradient-to-br from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer text-white">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <Radar className="w-6 h-6 text-blue-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-200">Lectura del Día</Badge>
                </div>
                <CardTitle className="text-2xl text-slate-50">Radar Estratégico</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-6">
                  Análisis estructurado de noticias con 7 capas cognitivas. Entiende qué está pasando realmente, no solo qué dicen que pasó.
                </p>
                <div className="flex items-center text-blue-300 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Ver Radar <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* News Feed */}
          <Link href="/despega/a4/noticias" className="group">
            <Card className="h-full border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">En Vivo</Badge>
                </div>
                <CardTitle className="text-xl">Noticias del Mercado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Tendencias laborales, cambios en industrias, oportunidades emergentes y análisis del mercado en tiempo real.
                </p>
                <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Explorar <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Learning Modules */}
          <Link href="/despega/a4/aprender" className="group">
            <Card className="h-full border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">10+ Tests</Badge>
                </div>
                <CardTitle className="text-xl">Cultura General</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Tests gamificados sobre economía, industrias, trends laborales y cultura profesional. Aprende jugando.
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Comenzar <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Library */}
          <Link href="/despega/a4/biblioteca" className="group">
            <Card className="h-full border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">50+ Recursos</Badge>
                </div>
                <CardTitle className="text-xl">Biblioteca Curada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Libros, artículos y recursos seleccionados para tu crecimiento profesional. Con notas, highlights y progreso.
                </p>
                <div className="flex items-center text-amber-600 dark:text-amber-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Leer <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
