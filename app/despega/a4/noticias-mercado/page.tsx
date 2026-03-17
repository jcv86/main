"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp, AlertCircle } from "lucide-react"

export default function NoticiasMercadoPage() {
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuthRedirect()

  useEffect(() => {
    if (authLoading || !user?.id) return
    
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        setLoading(false)
      } catch (error) {
        console.error('[v0] Error loading noticias:', error)
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
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Noticias del Mercado</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Tendencias laborales, cambios en industrias y oportunidades emergentes
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Tendencias", count: 12 },
            { label: "Industrias", count: 8 },
            { label: "Mercado Laboral", count: 15 },
            { label: "Startups", count: 6 },
          ].map((cat) => (
            <Card key={cat.label} className="border-0 bg-card/70 cursor-pointer hover:bg-card transition-colors">
              <CardContent className="pt-6 text-center">
                <p className="font-medium text-sm">{cat.label}</p>
                <p className="text-2xl font-bold text-primary mt-1">{cat.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon */}
        <Card className="border-0 bg-amber-500/10 backdrop-blur-sm">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Próximamente</p>
              <p className="text-sm text-muted-foreground mt-1">
                Las noticias del mercado están siendo curadas. Vuelve en breve para acceder a análisis detallados de cada categoría.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
