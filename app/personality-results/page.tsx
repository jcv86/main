"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Target, Users, TrendingUp, Download, Share2 } from "lucide-react"

interface PersonalityResult {
  type: string
  title: string
  description: string
  strengths: string[]
  challenges: string[]
  careerSuggestions: string[]
  scores: {
    dominance: number
    influence: number
    steadiness: number
    conscientiousness: number
  }
}

export default function PersonalityResultsPage() {
  const [results, setResults] = useState<PersonalityResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading results
    setTimeout(() => {
      setResults({
        type: "D",
        title: "Dominante",
        description:
          "Eres una persona orientada a resultados, directa y decidida. Te gusta tomar el control de las situaciones y liderar equipos hacia el éxito.",
        strengths: [
          "Liderazgo natural",
          "Toma de decisiones rápida",
          "Orientado a resultados",
          "Confianza en sí mismo",
          "Capacidad de resolver problemas",
        ],
        challenges: [
          "Puede ser demasiado directo",
          "Impaciencia con procesos lentos",
          "Tendencia a dominar conversaciones",
          "Dificultad para delegar",
        ],
        careerSuggestions: [
          "Director Ejecutivo",
          "Gerente de Ventas",
          "Consultor de Negocios",
          "Emprendedor",
          "Líder de Proyecto",
        ],
        scores: {
          dominance: 85,
          influence: 45,
          steadiness: 30,
          conscientiousness: 60,
        },
      })
      setLoading(false)
    }, 1500)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-3xl font-bold mb-2">Analizando tu personalidad...</h1>
            <p className="text-gray-600">Esto tomará solo unos momentos</p>
          </div>
        </div>
      </div>
    )
  }

  if (!results) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <Brain className="w-4 h-4 mr-2" />
            Análisis DISC Completo
          </Badge>
          <h1 className="text-4xl font-bold mb-2">Tu Perfil de Personalidad</h1>
          <p className="text-xl text-gray-600">
            Tipo {results.type}: {results.title}
          </p>
        </div>

        {/* Main Result Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Resumen de tu Personalidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">{results.description}</p>

            {/* DISC Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Puntuaciones DISC</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Dominancia (D)</span>
                      <span className="text-sm text-gray-600">{results.scores.dominance}%</span>
                    </div>
                    <Progress value={results.scores.dominance} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Influencia (I)</span>
                      <span className="text-sm text-gray-600">{results.scores.influence}%</span>
                    </div>
                    <Progress value={results.scores.influence} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Estabilidad (S)</span>
                      <span className="text-sm text-gray-600">{results.scores.steadiness}%</span>
                    </div>
                    <Progress value={results.scores.steadiness} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Cumplimiento (C)</span>
                      <span className="text-sm text-gray-600">{results.scores.conscientiousness}%</span>
                    </div>
                    <Progress value={results.scores.conscientiousness} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold text-blue-600">{results.type}</span>
                  </div>
                  <p className="font-semibold text-lg">{results.title}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <Tabs defaultValue="strengths" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strengths">Fortalezas</TabsTrigger>
            <TabsTrigger value="challenges">Áreas de Mejora</TabsTrigger>
            <TabsTrigger value="careers">Carreras Sugeridas</TabsTrigger>
          </TabsList>

          <TabsContent value="strengths">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tus Fortalezas Principales
                </CardTitle>
                <CardDescription>Estas son las características que te destacan y debes aprovechar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Áreas de Desarrollo
                </CardTitle>
                <CardDescription>Aspectos en los que puedes trabajar para crecer profesionalmente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <span className="font-medium">{challenge}</span>
                        <p className="text-sm text-gray-600 mt-1">
                          Considera desarrollar estrategias para mejorar en esta área
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="careers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Carreras Recomendadas
                </CardTitle>
                <CardDescription>Profesiones que se alinean con tu perfil de personalidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.careerSuggestions.map((career, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-semibold mb-2">{career}</h4>
                      <p className="text-sm text-gray-600">
                        Esta carrera aprovecha tus fortalezas naturales y te permitirá destacar
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Descargar Reporte PDF
          </Button>
          <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
            <Share2 className="w-4 h-4" />
            Compartir Resultados
          </Button>
        </div>
      </div>
    </div>
  )
}
