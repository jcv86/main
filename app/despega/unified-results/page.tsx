"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Heart, Briefcase, Zap, Share2 } from "lucide-react"

const testMeta = [
  {
    name: "DISC",
    icon: Brain,
    color: "blue",
    category: "disc",
    description: "Perfil de Personalidad - Dimensiones conductuales",
  },
  {
    name: "MBTI",
    icon: Brain,
    color: "purple",
    category: "mbti",
    description: "Tipo de Personalidad - 16 tipos",
  },
  {
    name: "Big Five",
    icon: Zap,
    color: "indigo",
    category: "big_five",
    description: "5 Factores de Personalidad",
  },
  {
    name: "EI",
    icon: Heart,
    color: "red",
    category: "emotional_intelligence",
    description: "Inteligencia Emocional",
  },
  {
    name: "RIASEC",
    icon: Briefcase,
    color: "teal",
    category: "riasec",
    description: "Intereses Vocacionales",
  },
]

export default function UnifiedTestDashboard() {
  const { user, isLoading } = useSession()
  const router = useRouter()
  const [results, setResults] = useState<any>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/auth")
    }
  }, [mounted, isLoading, user, router])

  if (!mounted || isLoading || !user) return null

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue/5 border-blue/30 dark:bg-blue-950/20 dark:border-blue/10",
      purple: "bg-purple/5 border-purple/30 dark:bg-purple/20 dark:border-purple",
      indigo: "bg-blue/5 border-blue/30 dark:bg-indigo-950/20 dark:border-blue",
      red: "bg-red/5 border-red/20 dark:bg-red-950/20 dark:border-red-800",
      teal: "bg-teal-50 border-blue/20 dark:bg-teal-950/20 dark:border-teal-800",
    }
    return colors[color] || colors.blue
  }

  const getTextColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "text-blue dark:text-blue/40",
      purple: "text-purple dark:text-purple/40",
      indigo: "text-blue dark:text-indigo-400",
      red: "text-red dark:text-red-400",
      teal: "text-blue dark:text-teal-400",
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/5 to-muted/10 dark:from-background dark:to-muted/90 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tus Resultados de Tests</h1>
          <p className="text-muted/60 dark:text-muted/40">
            Panel unificado de todos tus evaluaciones científicas
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            {testMeta.map((test) => (
              <TabsTrigger key={test.category} value={test.category}>
                {test.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tu Perfil Completo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testMeta.map((test) => {
                    const Icon = test.icon
                    return (
                      <Card key={test.category} className={`border-2 ${getColorClasses(test.color)}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className={`font-bold ${getTextColorClasses(test.color)}`}>
                                {test.name}
                              </h3>
                              <p className="text-xs text-muted/60 dark:text-muted/40">
                                {test.description}
                              </p>
                            </div>
                            <Icon className={`w-5 h-5 ${getTextColorClasses(test.color)}`} />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                            onClick={() => router.push(`/test/${test.category}/results`)}
                          >
                            Ver Reporte
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas Generales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/10 dark:bg-card rounded-lg">
                    <p className="text-sm text-muted/60 dark:text-muted/40">Tests Completados</p>
                    <p className="text-2xl font-bold">5 de 5</p>
                    <Progress value={100} className="mt-2" />
                  </div>
                  <div className="p-4 bg-blue/10 dark:bg-blue/30 rounded-lg">
                    <p className="text-sm text-blue">Dimensiones Exploradas</p>
                    <p className="text-2xl font-bold">27+</p>
                    <p className="text-xs text-blue mt-1">facetas de personalidad</p>
                  </div>
                  <div className="p-4 bg-purple/10 dark:bg-purple/30 rounded-lg">
                    <p className="text-sm text-purple">Tipo de Perfil</p>
                    <p className="text-lg font-bold">Único</p>
                    <p className="text-xs text-purple mt-1">combinación especial</p>
                  </div>
                  <div className="p-4 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <p className="text-sm text-blue">Orientación Vocacional</p>
                    <p className="text-lg font-bold">Identificada</p>
                    <p className="text-xs text-blue mt-1">3 tipos principales</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Pasos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3 p-3 bg-blue/5 dark:bg-blue-950/20 rounded-[28px] border border-blue/30 dark:border-blue/10">
                  <Zap className="w-5 h-5 text-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue dark:text-blue/10">Ir a A2: Tu Plan</p>
                    <p className="text-sm text-blue dark:text-blue/30">Usa tus resultados para crear un plan personalizado</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-purple/5 dark:bg-purple/20 rounded-[28px] border border-purple/30 dark:border-purple">
                  <Share2 className="w-5 h-5 text-purple flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-purple dark:text-purple/10">Compartir Resultados</p>
                    <p className="text-sm text-purple dark:text-purple/30">Exporta tu perfil completo en PDF</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Individual Test Tabs */}
          {testMeta.map((test) => (
            <TabsContent key={test.category} value={test.category}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <test.icon className={`w-5 h-5 ${getTextColorClasses(test.color)}`} />
                      {test.name}
                    </CardTitle>
                    <Badge>{test.description}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/10 dark:bg-card rounded-lg">
                    <p className="text-sm text-muted/60 dark:text-muted/40 mb-2">Cargando resultado...</p>
                    <Progress value={33} />
                  </div>
                  <Button className="w-full">
                    Ver Reporte Detallado de {test.name}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer CTA */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue to-purple rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-2">Siguiente Fase: A2 - Tu Plan</h2>
          <p className="mb-4 opacity-90">
            Usa todos tus resultados para crear un plan personalizado de 90 días con sprints semanales
          </p>
          <Button className="bg-white text-blue hover:bg-white/90">
            Ir a A2: Tu Plan Personalizado
          </Button>
        </div>
      </div>
    </div>
  )
}
