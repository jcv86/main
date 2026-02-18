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

      setLoading(false)
    }

    loadData()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Cargando tu próximo paso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <Badge variant="outline" className="mx-auto">
              Paso 2 de tu Transición: A2 - Rutas
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
              Ahora, Tu Dirección
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Convertimos tu autoconocimiento en un plan vivible de 90 días
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                A2 es el <strong>"motor de avance"</strong> de tu transformación. Tomas lo que descubriste en A1 y lo conviertes en acciones concretas, hábitos reales y progreso medible.
              </p>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  No es coaching. No es terapia. <strong>Es estructura</strong>: una ruta personalizada con micro-acciones diarias, check-ins semanales y un espacio para documentar lo que aprendes.
                </p>
              </div>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Lo que hace diferente a A2 es que está diseñado para tu patrón específico. No recibirás consejos genéricos: todo se adapta a cómo realmente actúas.
              </p>
            </div>

            {/* Three Pillars */}
            <div className="grid md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800">
                <Zap className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Ruta Personalizada</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Camino diseñado para tu patrón y objetivo específico
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Micro-Acciones</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Tareas pequeñas y prácticas que cabren en tu día
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-lg border border-amber-200 dark:border-amber-800">
                <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Seguimiento Real</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Bitácora de aprendizaje + check-ins para ajustar
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline - What You'll Get */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">En los próximos 90 días</h2>
          
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Elige tu Ruta</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Selecciona el área donde quieres transformarte. Tendrás recomendaciones personalizadas basadas en tu A1.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Define tu Misión 90 Días</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  ¿Qué específicamente quieres lograr? ¿Cuál es tu éxito? Definimos juntos tu objetivo y criterio de éxito.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Activa tu Primer Sprint</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Los 90 días se dividen en 3 sprints de 30. Cada semana tiene un desafío claro y micro-acciones específicas.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold">
                  4
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Registra tu Aprendizaje</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Tu bitácora de aprendizaje es tu mejor herramienta. Qué probaste, qué aprendiste, qué cambiarás.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3 pt-4">
          <Link href="/despega/a2/camino">
            <Button size="lg" className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg">
              Comencemos Tu Ruta <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Este proceso dura aproximadamente 5 minutos.
          </p>
        </div>
      </div>
    </div>
  )
}
