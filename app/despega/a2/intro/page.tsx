"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Zap, Target, BookOpen } from "lucide-react"

// Mock data for A1 test results
const mockA1Results = {
  d_score: 75,
  i_score: 60,
  s_score: 55,
  c_score: 70,
  tipo_perfil: "Impulsor",
}

export default function A2IntroPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // For now, using mock data. Will replace with Supabase data later
  const a1Results = mockA1Results

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-slate-50 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Cargando tu A2...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <Badge className="mx-auto" variant="secondary">
            A2: Rutas de Transformación
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
            Tu Motor de Avance
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            90 días de acciones personalizadas según tu patrón
          </p>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                Basado en tu resultado A1 como <strong>{a1Results.tipo_perfil}</strong>, 
                hemos diseñado un plan de 90 días con micro-acciones concretas.
              </p>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  No se trata de trabajar más horas. Se trata de trabajar <strong>en dirección correcta, 
                  con acciones que realmente importan</strong>, adaptadas a cómo naturalmente actúas.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex gap-3">
                  <Zap className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Micro-acciones diarias</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">De 5 a 120 minutos, nunca abrumador</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Target className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">3 Sprints estructurados</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">30 días cada uno, con momentum progresivo</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <BookOpen className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Bitácora de aprendizaje</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Reflexión semanal para consolidar progreso</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3-Sprint Timeline */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-red-500 bg-white dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sprint 1: Aterrizaje</CardTitle>
              <CardDescription>Días 1-30</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Tomar velocidad, establecer rutinas, descubrir tu ritmo natural
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 bg-white dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sprint 2: Consolidación</CardTitle>
              <CardDescription>Días 31-60</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Profundizar habilidades, resolver obstáculos, acelerar transformación
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 bg-white dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sprint 3: Maestría</CardTitle>
              <CardDescription>Días 61-90</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Integración definitiva, preparación para A3, nuevo estándar
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Button 
            onClick={() => router.push("/despega/a2/camino")}
            className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg"
            size="lg"
          >
            Comenzar Mi A2 <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Tómate un momento para entender por dónde comenzaremos
          </p>
        </div>
      </div>
    </div>
  )
}

}
