"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Radar, TrendingUp, AlertCircle } from "lucide-react"

export default function RadarPage() {
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuthRedirect()
  const supabase = createClient()

  useEffect(() => {
    if (authLoading || !user?.id) return
    
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        setLoading(false)
      } catch (error) {
        console.error('[v0] Error loading radar:', error)
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
          <Radar className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Radar Estratégico</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Análisis estructurado de noticias con 7 capas cognitivas
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radar className="w-5 h-5" />
              7 Capas del Análisis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { num: 1, title: "Qué cambió vs ayer", desc: "Delta de impacto" },
                { num: 2, title: "Nivel de energía", desc: "Intensidad emocional" },
                { num: 3, title: "Narrativa vs realidad", desc: "Análisis crítico" },
                { num: 4, title: "Weak signals", desc: "Señales débiles emergentes" },
                { num: 5, title: "Tu contexto", desc: "Impacto en tu ruta" },
                { num: 6, title: "Acción sugerida", desc: "Qué hacer al respecto" },
                { num: 7, title: "Watchlist", desc: "Guardar para seguimiento" },
              ].map((layer) => (
                <div key={layer.num} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm flex-shrink-0">
                      {layer.num}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{layer.title}</p>
                      <p className="text-xs text-muted-foreground">{layer.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
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
                El Radar de hoy está siendo construido. Vuelve en breve para ver el análisis completo de las noticias del mercado.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
