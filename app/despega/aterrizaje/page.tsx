"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, FileText, Linkedin, Users, DollarSign } from "lucide-react"

const MODULOS_ATERRIZAJE = [
  {
    id: "cv",
    name: "CV Profesional",
    description: "Crea un currículum que destaque",
    icon: FileText,
    color: "bg-blue/50",
    lightColor: "bg-blue-100",
    textColor: "text-blue-800",
    contenido: [
      "Estructura óptima de CV",
      "Palabras clave por industria",
      "Logros cuantificables",
      "Diseño y formato",
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn Optimizado",
    description: "Perfil que atrae oportunidades",
    icon: Linkedin,
    color: "bg-sky-500",
    lightColor: "bg-sky-100",
    textColor: "text-sky-800",
    contenido: [
      "Headline magnético",
      "About que convierte",
      "Experiencia con impacto",
      "Networking estratégico",
    ],
  },
  {
    id: "entrevistas",
    name: "Entrevistas",
    description: "Domina cualquier entrevista",
    icon: Users,
    color: "bg-green-500",
    lightColor: "bg-green-100",
    textColor: "text-green-800",
    contenido: [
      "Método STAR",
      "Preguntas difíciles",
      "Lenguaje corporal",
      "Follow-up efectivo",
    ],
  },
  {
    id: "negociacion",
    name: "Negociación Salarial",
    description: "Obtén lo que mereces",
    icon: DollarSign,
    color: "bg-green/50",
    lightColor: "bg-emerald-100",
    textColor: "text-emerald-800",
    contenido: [
      "Investigación de mercado",
      "Timing perfecto",
      "Técnicas de negociación",
      "Beneficios adicionales",
    ],
  },
]

export default function AterrizajePage() {
  const [loading, setLoading] = useState(true)
  const [modulosProgress, setModulosProgress] = useState<Record<string, number>>({})
  const [pilarProgress, setPilarProgress] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: progressData } = await supabase
        .from("despega_pilar_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("pilar", "aterrizaje")
        .single()

      if (progressData) setPilarProgress(progressData)

      setLoading(false)
    }

    loadData()
  }, [supabase])

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
            <div className="w-12 h-12 rounded-[28px] bg-orange-100 flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h1 className="text-2xl font-bold">Aterrizaje</h1>
              <p className="text-muted-foreground">Herramientas para conseguir el trabajo de tus sueños</p>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="text-2xl font-bold">{pilarProgress?.progreso || 0}%</div>
                <div className="text-sm text-muted-foreground">Progreso</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{pilarProgress?.score || 0}</div>
                <div className="text-sm text-muted-foreground">Puntos</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Día {pilarProgress?.ciclo_dia || 1}</div>
                <div className="text-sm text-muted-foreground">Ciclo {pilarProgress?.ciclo_actual || 30}</div>
              </div>
            </div>
            <Progress value={pilarProgress?.progreso || 0} className="h-3" />
          </CardContent>
        </Card>

        {/* Módulos */}
        <div className="grid md:grid-cols-2 gap-4">
          {MODULOS_ATERRIZAJE.map((modulo) => {
            const Icon = modulo.icon
            const progress = modulosProgress[modulo.id] || 0

            return (
              <Card key={modulo.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-lg ${modulo.lightColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${modulo.textColor}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{modulo.name}</CardTitle>
                      <CardDescription>{modulo.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Contenido:</p>
                    <div className="flex flex-wrap gap-1">
                      {modulo.contenido.map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/despega/aterrizaje/${modulo.id}`}>
                      {progress > 0 ? "Continuar" : "Comenzar"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
