"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"

const RUTAS = [
  {
    id: "energia",
    name: "Ruta Energía",
    description: "Optimiza tu vitalidad física y mental",
    icon: "⚡",
    color: "bg-yellow-500",
    lightColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    camino: "persona",
    temas: ["Sueño reparador", "Nutrición energética", "Ejercicio estratégico", "Gestión del estrés"],
    librosRelacionados: ["Atomic Habits", "The Power of Full Engagement", "Why We Sleep"],
  },
  {
    id: "enfoque",
    name: "Ruta Enfoque",
    description: "Domina tu atención y productividad",
    icon: "🎯",
    color: "bg-green-500",
    lightColor: "bg-green-100",
    textColor: "text-green-800",
    camino: "ambos",
    temas: ["Deep Work", "Eliminación de distracciones", "Sistema de prioridades", "Bloques de tiempo"],
    librosRelacionados: ["Deep Work", "Getting Things Done", "Essentialism"],
  },
  {
    id: "relaciones",
    name: "Ruta Relaciones",
    description: "Construye conexiones significativas",
    icon: "🤝",
    color: "bg-pink-500",
    lightColor: "bg-pink-100",
    textColor: "text-pink-800",
    camino: "persona",
    temas: ["Comunicación efectiva", "Networking estratégico", "Resolución de conflictos", "Liderazgo relacional"],
    librosRelacionados: ["How to Win Friends", "Crucial Conversations", "Never Split the Difference"],
  },
  {
    id: "plan_ejecutivo",
    name: "Ruta Plan Ejecutivo",
    description: "Ejecuta con precisión y consistencia",
    icon: "📋",
    color: "bg-purple-500",
    lightColor: "bg-purple-100",
    textColor: "text-purple-800",
    camino: "profesional",
    temas: ["Planificación estratégica", "Toma de decisiones", "Rituales de alto rendimiento", "Revisión semanal"],
    librosRelacionados: ["The 7 Habits", "The Goal", "Thinking Fast and Slow"],
  },
]

export default function RutasPage() {
  const [loading, setLoading] = useState(true)
  const [rutasProgress, setRutasProgress] = useState<Record<string, number>>({})
  const [userProfile, setUserProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profileData } = await supabase
        .from("despega_user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profileData) setUserProfile(profileData)

      const { data: progressData } = await supabase
        .from("despega_user_ruta_progress")
        .select("*")
        .eq("user_id", user.id)

      if (progressData) {
        const progressMap: Record<string, number> = {}
        progressData.forEach((p: any) => {
          progressMap[p.ruta_id] = p.progreso
        })
        setRutasProgress(progressMap)
      }

      setLoading(false)
    }

    loadData()
  }, [supabase])

  const isRutaAvailable = (rutaCamino: string) => {
    if (!userProfile) return false
    if (rutaCamino === "ambos") return true
    if (rutaCamino === "persona" && userProfile.camino_persona_active) return true
    if (rutaCamino === "profesional" && userProfile.camino_profesional_active) return true
    return false
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/despega" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-2xl">
              🛤️
            </div>
            <div>
              <h1 className="text-2xl font-bold">A2 Rutas</h1>
              <p className="text-muted-foreground">Elige tu ruta de desarrollo especializado</p>
            </div>
          </div>
        </div>

        {/* Rutas Grid */}
        <div className="grid gap-6">
          {RUTAS.map((ruta) => {
            const available = isRutaAvailable(ruta.camino)
            const progress = rutasProgress[ruta.id] || 0

            return (
              <Card 
                key={ruta.id} 
                className={`${!available ? "opacity-60" : ""} transition-all hover:shadow-md`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl ${ruta.lightColor} flex items-center justify-center text-3xl`}>
                        {ruta.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle>{ruta.name}</CardTitle>
                          {!available && <Lock className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <CardDescription>{ruta.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={`${ruta.lightColor} ${ruta.textColor} border-0`}>
                      {ruta.camino === "ambos" ? "Ambos" : ruta.camino.charAt(0).toUpperCase() + ruta.camino.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Temas */}
                  <div>
                    <p className="text-sm font-medium mb-2">Temas que cubrirás:</p>
                    <div className="flex flex-wrap gap-2">
                      {ruta.temas.map((tema) => (
                        <Badge key={tema} variant="outline" className="text-xs">
                          {tema}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Libros Relacionados */}
                  <div>
                    <p className="text-sm font-medium mb-2">Lecturas recomendadas:</p>
                    <div className="flex flex-wrap gap-2">
                      {ruta.librosRelacionados.map((libro) => (
                        <Badge key={libro} variant="secondary" className="text-xs">
                          {libro}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  {available ? (
                    <Button asChild className="w-full">
                      <Link href={`/despega/rutas/${ruta.id}`}>
                        {progress > 0 ? "Continuar Ruta" : "Comenzar Ruta"}
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      Activa el Camino {ruta.camino.charAt(0).toUpperCase() + ruta.camino.slice(1)} para desbloquear
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
