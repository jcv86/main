"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Users, Heart, CheckCircle, TrendingUp, Briefcase, Download, Share2 } from "lucide-react"

interface DISCResult {
  primary_type: string
  secondary_type: string
  scores: {
    D: number
    I: number
    S: number
    C: number
  }
  description: string
  strengths: string[]
  challenges: string[]
  career_fit: string[]
}

export default function DISCResultsPage() {
  const [results, setResults] = useState<DISCResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockResults: DISCResult = {
      primary_type: "D",
      secondary_type: "I",
      scores: {
        D: 85,
        I: 72,
        S: 45,
        C: 38,
      },
      description:
        "Eres un líder natural con alta orientación a resultados y excelentes habilidades de comunicación. Tu perfil DI te convierte en un ejecutivo ideal que puede inspirar equipos mientras mantiene el foco en los objetivos.",
      strengths: [
        "Liderazgo natural y carisma",
        "Orientación a resultados",
        "Comunicación efectiva",
        "Toma de decisiones rápida",
        "Capacidad de influir y motivar",
        "Adaptabilidad a cambios",
      ],
      challenges: [
        "Puede ser impaciente con procesos lentos",
        "Tendencia a dominar conversaciones",
        "Necesita trabajar en la escucha activa",
        "Puede subestimar detalles importantes",
        "Dificultad para delegar completamente",
      ],
      career_fit: [
        "Director Ejecutivo (CEO)",
        "Gerente de Ventas",
        "Consultor Senior",
        "Emprendedor",
        "Director de Marketing",
        "Gerente de Proyectos",
      ],
    }

    setTimeout(() => {
      setResults(mockResults)
      setLoading(false)
    }, 1000)
  }, [])

  const getTypeInfo = (type: string) => {
    const types = {
      D: {
        name: "Dominancia",
        color: "bg-red-500",
        icon: Target,
        description: "Orientado a resultados, directo, decidido",
      },
      I: { name: "Influencia", color: "bg-yellow-500", icon: Users, description: "Sociable, optimista, persuasivo" },
      S: { name: "Estabilidad", color: "bg-green-500", icon: Heart, description: "Paciente, leal, colaborativo" },
      C: {
        name: "Cumplimiento",
        color: "bg-blue-500",
        icon: CheckCircle,
        description: "Analítico, preciso, sistemático",
      },
    }
    return types[type as keyof typeof types]
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Analizando tu perfil DISC...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <p>No se encontraron resultados. Por favor, completa la evaluación DISC primero.</p>
          <Button className="mt-4">Realizar Evaluación</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tu Perfil DISC</h1>
            <p className="text-muted-foreground">Resultados de tu evaluación de personalidad profesional</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>

        {/* Primary Type Badge */}
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Perfil Principal: {results.primary_type}
            {results.secondary_type}
          </Badge>
          <Badge variant="outline">
            {getTypeInfo(results.primary_type).name} + {getTypeInfo(results.secondary_type).name}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="scores">Puntuaciones</TabsTrigger>
          <TabsTrigger value="strengths">Fortalezas</TabsTrigger>
          <TabsTrigger value="career">Carrera</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Description Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tu Perfil de Personalidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{results.description}</p>
            </CardContent>
          </Card>

          {/* Quick Scores Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(results.scores).map(([type, score]) => {
              const typeInfo = getTypeInfo(type)
              const Icon = typeInfo.icon
              return (
                <Card key={type} className="text-center">
                  <CardContent className="pt-6">
                    <div
                      className={`w-12 h-12 ${typeInfo.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{typeInfo.name}</h3>
                    <div className="text-2xl font-bold mb-2">{score}%</div>
                    <Progress value={score} className="h-2" />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="scores" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Puntuaciones Detalladas</CardTitle>
              <CardDescription>Análisis completo de tu perfil en cada dimensión DISC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(results.scores).map(([type, score]) => {
                const typeInfo = getTypeInfo(type)
                const Icon = typeInfo.icon
                return (
                  <div key={type} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${typeInfo.color} rounded-full flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {typeInfo.name} ({type})
                          </h3>
                          <p className="text-sm text-muted-foreground">{typeInfo.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{score}%</div>
                        <div className="text-sm text-muted-foreground">
                          {score >= 70 ? "Alto" : score >= 40 ? "Medio" : "Bajo"}
                        </div>
                      </div>
                    </div>
                    <Progress value={score} className="h-3" />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strengths" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Fortalezas Clave</CardTitle>
                <CardDescription>Aspectos que te destacan profesionalmente</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Áreas de Desarrollo</CardTitle>
                <CardDescription>Oportunidades para crecer profesionalmente</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="career" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Roles Profesionales Ideales
              </CardTitle>
              <CardDescription>Posiciones que se alinean con tu perfil de personalidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.career_fit.map((role, index) => (
                  <Card
                    key={index}
                    className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <Briefcase className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <h3 className="font-semibold">{role}</h3>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones de Desarrollo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Para potenciar tu liderazgo:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Desarrolla habilidades de coaching y mentoring</li>
                    <li>• Practica la escucha activa en reuniones</li>
                    <li>• Aprende técnicas de delegación efectiva</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Para mejorar tu comunicación:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Practica presentaciones estructuradas</li>
                    <li>• Desarrolla empatía en conversaciones difíciles</li>
                    <li>• Aprende a adaptar tu estilo según la audiencia</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
