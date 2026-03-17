"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Lightbulb, AlertCircle } from "lucide-react"

export default function PruebasContextoPage() {
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuthRedirect()

  useEffect(() => {
    if (authLoading || !user?.id) return
    
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        setLoading(false)
      } catch (error) {
        console.error('[v0] Error loading pruebas:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [authLoading, user?.id])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Pruebas & Contexto</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Mini tests para entrenar tu pensamiento crítico
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Available Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "¿Qué pasó hoy?", desc: "Razon en vivo sobre noticias", difficulty: "Media" },
            { title: "Interpretación de Datos", desc: "Analiza gráficos económicos", difficulty: "Alta" },
            { title: "Impacto Personal", desc: "¿Cómo te afecta esta noticia?", difficulty: "Media" },
            { title: "Weak Signals", desc: "Identifica señales débiles", difficulty: "Alta" },
          ].map((test) => (
            <Card key={test.title} className="border-0 bg-card/70 hover:bg-card transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{test.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{test.desc}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{test.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">Intentar</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Puntuación Global</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground">Puntos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground">Tests</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">--</p>
                <p className="text-sm text-muted-foreground">Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="border-0 bg-amber-500/10 backdrop-blur-sm">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Próximamente</p>
              <p className="text-sm text-muted-foreground mt-1">
                Las pruebas interactivas estarán disponibles pronto. Entrena tu pensamiento crítico respondiendo preguntas sobre noticias reales.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
