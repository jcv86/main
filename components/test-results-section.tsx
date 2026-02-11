"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { getDespegarProfile, getBookRecommendations } from "@/lib/despega-profiles"

interface TestResult {
  test_results: {
    d_score: number
    i_score: number
    s_score: number
    c_score: number
    dominant_profile: "D" | "I" | "S" | "C"
    secondary_profile: "D" | "I" | "S" | "C"
    camino_persona: boolean
    camino_profesional: boolean
  }
  created_at: string
}

export function TestResultsSection() {
  const [results, setResults] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("/api/despega/get-test-results")
        if (response.ok) {
          const { data } = await response.json()
          setResults(data)
        }
      } catch (error) {
        console.error("[v0] Error fetching test results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!results) {
    return (
      <Card className="border-dashed shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Completa tu Evaluación</CardTitle>
          <CardDescription>Descubre tu perfil respondiendo el test de personalidad</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Aún no has completado tu evaluación de personalidad. Hazlo ahora para descubrir tu perfil y obtener recomendaciones personalizadas de libros.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { test_results } = results
  const dominantProfile = getDespegarProfile(test_results.dominant_profile, "profesional")
  const books = getBookRecommendations(test_results.dominant_profile)

  const scores = [
    { dimension: "D", label: "Impulsor", value: test_results.d_score, color: "#EF4444" },
    { dimension: "I", label: "Catalizador", value: test_results.i_score, color: "#F59E0B" },
    { dimension: "S", label: "Estabilizador", value: test_results.s_score, color: "#10B981" },
    { dimension: "C", label: "Arquitecto", value: test_results.c_score, color: "#3B82F6" },
  ]

  return (
    <div className="space-y-4">
      {/* Main Profile */}
      <Card className="border-l-8 shadow-lg overflow-hidden" style={{ borderLeftColor: dominantProfile.color }}>
        <CardHeader style={{ backgroundColor: `${dominantProfile.color}15` }}>
          <div className="flex items-center gap-3">
            <div
              className="text-4xl rounded-full w-16 h-16 flex items-center justify-center text-white"
              style={{ backgroundColor: dominantProfile.color }}
            >
              {dominantProfile.emoji}
            </div>
            <div>
              <CardTitle className="text-2xl">{dominantProfile.nombre}</CardTitle>
              <CardDescription>{dominantProfile.arquetipo}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {scores.map((score) => (
              <div
                key={score.dimension}
                className="p-3 rounded-lg border"
                style={{ borderColor: score.color, backgroundColor: `${score.color}08` }}
              >
                <p className="text-2xl font-bold" style={{ color: score.color }}>
                  {score.value}%
                </p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{score.label}</p>
                <Progress value={score.value} className="mt-2" />
              </div>
            ))}
          </div>

          {/* Características */}
          <div>
            <h4 className="font-semibold mb-2">Características</h4>
            <ul className="space-y-1 text-sm">
              {dominantProfile.caracteristicas.slice(0, 3).map((car, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="text-primary">•</span> {car}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Books */}
      <Card className="shadow-lg border-t-4 border-amber-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📚</span> Libros Recomendados para Ti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {books.map((book, idx) => (
            <div
              key={idx}
              className="p-3 border rounded-lg bg-amber-50 dark:bg-amber-950/20 hover:shadow-md transition-shadow"
            >
              <p className="font-semibold text-sm mb-1">{book.titulo}</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mb-1">
                por {book.autor}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{book.descripcion}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Fortalezas */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>💪</span> Tus Fortalezas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {dominantProfile.fortalezas.map((fuerza, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded border-l-4 border-emerald-500"
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span className="text-sm">{fuerza}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
