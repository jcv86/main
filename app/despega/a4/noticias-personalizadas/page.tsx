"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Zap, AlertCircle } from "lucide-react"

export default function NoticiasPersonalizadasPage() {
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuthRedirect()

  useEffect(() => {
    if (authLoading || !user?.id) return
    
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        setLoading(false)
      } catch (error) {
        console.error('[v0] Error loading personalizadas:', error)
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
          <Zap className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Noticias Personalizadas</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Contenido filtrado según tu perfil y ruta profesional
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Profile Info */}
        <Card className="border-0 bg-primary/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm">Tu Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Desarrollador</Badge>
              <Badge variant="secondary">Tech Startup</Badge>
              <Badge variant="secondary">A1-A4</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Topics */}
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Temas de Interés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Tech Trends",
                "Startups",
                "Talento Tech",
                "Innovación",
                "Mercado Laboral",
                "Salarios",
                "Remoto",
                "Competencias"
              ].map((topic) => (
                <Badge key={topic} variant="outline" className="justify-center py-2">
                  {topic}
                </Badge>
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
                Tus noticias personalizadas estarán listas en breve. Verás contenido curado específicamente para tu ruta de desarrollo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
