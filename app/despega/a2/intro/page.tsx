"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Zap, Target, BookOpen, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { type DiscProfile } from "@/lib/disc-calculator"
import { DESPEGA_PROFILES } from "@/lib/despega-profiles"

export default function A2IntroPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cerebroProfile, setCerebroProfile] = useState<DiscProfile | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadCerebroProfile()
  }, [])

  const loadCerebroProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) {
        router.push('/auth/signin')
        return
      }

      // Get the latest Despega Cerebral profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_a1_profiles')
        .select('disc_profile')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (profileError || !profileData?.disc_profile) {
        setError('No se encontró tu perfil Despega Cerebral. Por favor completa la evaluación primero.')
        return
      }

      setCerebroProfile(profileData.disc_profile as DiscProfile)
      console.log('[v0] Despega Cerebral profile loaded for A2 Intro:', profileData.disc_profile)
    } catch (err) {
      console.error('[v0] Error loading Despega Cerebral profile:', err)
      setError('Error al cargar tu perfil. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!cerebroProfile) {
    return null
  }

  const profileData = DESPEGA_PROFILES[cerebroProfile.primary as keyof typeof DESPEGA_PROFILES]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-600 dark:text-purple-400" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Cargando tu A2...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => router.push('/despega/a1-cerebral')} className="w-full">
              Volver a A1
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!a1Results) {
    return null
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
              Basado en tu perfil <strong>{profileData?.nombre}</strong> de Despega Cerebral con puntuación dominante de <strong>{cerebroProfile.primaryScore}%</strong>, 
              hemos diseñado un plan de 90 días con micro-acciones concretas.
            </p>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  No se trata de trabajar más horas. Se trata de trabajar <strong>en dirección correcta, 
                  con acciones que realmente importan</strong>, adaptadas a tu patrón natural de comportamiento.
                </p>
              </div>

              {/* Cerebro Profile Display */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-600 dark:text-red-400 font-semibold">Energía</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">{cerebroProfile.D}%</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">Influencia</p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{cerebroProfile.I}%</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Relaciones</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{cerebroProfile.S}%</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Plan Ejecutivo</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{cerebroProfile.C}%</p>
                </div>
              </div>

              {/* DISC Scores Display */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-600 dark:text-red-400 font-semibold">Dominancia</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">{a1Results.D}%</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">Influencia</p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{a1Results.I}%</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Estabilidad</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{a1Results.S}%</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Consciencia</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{a1Results.C}%</p>
                </div>
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
            onClick={() => router.push("/despega/conozcamonos-2")}
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
