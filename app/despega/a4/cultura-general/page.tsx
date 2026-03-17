"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Brain, AlertCircle } from "lucide-react"

export default function CulturaGeneralPage() {
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuthRedirect()

  useEffect(() => {
    if (authLoading || !user?.id) return
    
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        setLoading(false)
      } catch (error) {
        console.error('[v0] Error loading cultura:', error)
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
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Cultura General</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Tests gamificados y entrenamiento cognitivo
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Test Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Economía Básica", desc: "Conceptos fundamentales", tests: 5 },
            { title: "Mercado Laboral", desc: "Tendencias y oportunidades", tests: 4 },
            { title: "Industrias", desc: "Sectores claves de Chile", tests: 6 },
            { title: "Finanzas Personales", desc: "Decisiones financieras", tests: 3 },
          ].map((cat) => (
            <Card key={cat.title} className="border-0 bg-card/70 hover:bg-card transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{cat.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{cat.desc}</p>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Badge variant="secondary">{cat.tests} tests</Badge>
                <Button variant="outline" size="sm">Empezar</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Tu Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tests completados</span>
                <Badge>0 / 18</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Puntuación promedio</span>
                <Badge variant="secondary">--</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Racha actual</span>
                <Badge variant="outline">Comienza hoy</Badge>
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
                Los tests de cultura general estarán disponibles pronto. Entrena tu conocimiento sobre economía, mercado laboral e industrias.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
