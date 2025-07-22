"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Brain, Target, Users, Lightbulb, ArrowRight, Download } from "lucide-react"

interface PersonalityResult {
  type: string
  title: string
  description: string
  strengths: string[]
  challenges: string[]
  careerSuggestions: string[]
  scores: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
}

export default function PersonalityResultsPage() {
  const [results, setResults] = useState<PersonalityResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading personality results
    const timer = setTimeout(() => {
      setResults({
        type: "ENFP",
        title: "El Inspirador",
        description:
          "Eres una persona entusiasta, creativa y sociable que siempre busca nuevas posibilidades. Te motiva ayudar a otros a alcanzar su potencial.",
        strengths: [
          "Creatividad e innovación",
          "Excelentes habilidades de comunicación",
          "Capacidad para motivar a otros",
          "Flexibilidad y adaptabilidad",
          "Pensamiento estratégico",
        ],
        challenges: [
          "Tendencia a procrastinar",
          "Dificultad con tareas rutinarias",
          "Puede ser demasiado optimista",
          "Necesita variedad y estímulo",
        ],
        careerSuggestions: [
          "Marketing y Publicidad",
          "Recursos Humanos",
          "Consultoría",
          "Educación y Capacitación",
          "Emprendimiento",
          "Psicología",
        ],
        scores: {
          openness: 85,
          conscientiousness: 65,
          extraversion: 90,
          agreeableness: 80,
          neuroticism: 35,
        },
      })
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-3xl font-bold mb-2">Analizando tu Personalidad</h1>
            <p className="text-gray-600">Procesando tus respuestas...</p>
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
            Análisis de Personalidad Completado
          </Badge>
          <h1 className="text-4xl font-bold mb-2">Tu Tipo de Personalidad</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-6xl font-bold text-blue-600">{results.type}</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">{results.title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{results.description}</p>
        </div>

        {/* Personality Scores */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Puntuaciones de Personalidad
            </CardTitle>
            <CardDescription>Tus niveles en los cinco grandes factores de personalidad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Apertura a la Experiencia</span>
                <span className="text-sm text-gray-600">{results.scores.openness}%</span>
              </div>
              <Progress value={results.scores.openness} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Responsabilidad</span>
                <span className="text-sm text-gray-600">{results.scores.conscientiousness}%</span>
              </div>
              <Progress value={results.scores.conscientiousness} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Extraversión</span>
                <span className="text-sm text-gray-600">{results.scores.extraversion}%</span>
              </div>
              <Progress value={results.scores.extraversion} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Amabilidad</span>
                <span className="text-sm text-gray-600">{results.scores.agreeableness}%</span>
              </div>
              <Progress value={results.scores.agreeableness} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Neuroticismo</span>
                <span className="text-sm text-gray-600">{results.scores.neuroticism}%</span>
              </div>
              <Progress value={results.scores.neuroticism} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Lightbulb className="w-5 h-5" />
                Fortalezas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Target className="w-5 h-5" />
                Áreas de Desarrollo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Career Suggestions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Carreras Recomendadas
            </CardTitle>
            <CardDescription>
              Basado en tu perfil de personalidad, estas carreras podrían ser ideales para ti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.careerSuggestions.map((career, index) => (
                <Badge key={index} variant="outline" className="p-3 justify-center">
                  {career}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Descargar Reporte
          </Button>
          <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
            Explorar Carreras UDD
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
