"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { ArrowRight, Zap, Target, BookOpen, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface CerebroProfile {
  energia: number
  enfoque: number
  relaciones: number
  plan_ejecutivo: number
  primary: string
  primaryScore: number
  secondary: string
  secondaryScore: number
}

export default function A2IntroPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cerebroProfile, setCerebroProfile] = useState<CerebroProfile | null>(null)
  const [profileName, setProfileName] = useState("")
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

      // Mark A2 intro as seen (CANONICAL FLAG)
      const { error: updateError } = await supabase
        .from('despega_user_profiles')
        .upsert({
          user_id: user.id,
          a2_intro_seen: true,
          a2_intro_seen_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
      
      if (updateError) {
        console.error('[v0] [CANONICAL] Error marking A2 intro seen:', updateError)
      } else {
        console.log('[v0] [CANONICAL] A2 intro marked as seen')
      }

      // Get the latest Cerebral assessment (DISC profile)
      const { data: profileData, error: profileError } = await supabase
        .from('a1_cerebral_assessment')
        .select('disc_profile')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single()

      if (profileError || !profileData?.disc_profile) {
        setError('No se encontró tu perfil Despega Cerebral. Por favor completa la evaluación primero.')
        return
      }

      const rawScores = profileData.disc_profile as Record<string, number> || {}
      
      // Map DISC to Despega Cerebral nomenclature
      // D = Energía, I = Plan Ejecutivo, S = Relaciones, C = Enfoque
      const despegaScores = {
        energia: Math.abs(rawScores.D || 0),
        plan_ejecutivo: Math.abs(rawScores.I || 0),
        relaciones: Math.abs(rawScores.S || 0),
        enfoque: Math.abs(rawScores.C || 0)
      }

      const total = despegaScores.energia + despegaScores.plan_ejecutivo + despegaScores.relaciones + despegaScores.enfoque || 1
      const normalized = {
        energia: (despegaScores.energia / total) * 100,
        plan_ejecutivo: (despegaScores.plan_ejecutivo / total) * 100,
        relaciones: (despegaScores.relaciones / total) * 100,
        enfoque: (despegaScores.enfoque / total) * 100
      }
      
      // Find dominant dimension
      const scores = [
        { name: 'energia', value: normalized.energia },
        { name: 'plan_ejecutivo', value: normalized.plan_ejecutivo },
        { name: 'relaciones', value: normalized.relaciones },
        { name: 'enfoque', value: normalized.enfoque }
      ]
      scores.sort((a, b) => b.value - a.value)
      
      const profile: CerebroProfile = {
        energia: normalized.energia,
        plan_ejecutivo: normalized.plan_ejecutivo,
        relaciones: normalized.relaciones,
        enfoque: normalized.enfoque,
        primary: scores[0].name,
        primaryScore: scores[0].value,
        secondary: scores[1].name,
        secondaryScore: scores[1].value
      }
      
      setCerebroProfile(profile)
      
      // Set profile name based on primary dimension
      const dimensionNames: Record<string, string> = {
        'energia': 'Energía',
        'plan_ejecutivo': 'Plan Ejecutivo',
        'relaciones': 'Relaciones',
        'enfoque': 'Enfoque'
      }
      setProfileName(dimensionNames[profile.primary] || profile.primary)
      
      console.log('[v0] Despega Cerebral profile loaded for A2 Intro:', profile)
    } catch (err) {
      console.error('[v0] Error loading Despega Cerebral profile:', err)
      setError('Error al cargar tu perfil. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/5 to-muted/10 dark:from-background dark:to-muted/90 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple dark:text-purple/40" />
          <p className="mt-4 text-muted/60 dark:text-muted/40">Cargando tu A2...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/5 to-muted/10 dark:from-background dark:to-muted/90 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => router.push('/despega/a1-cerebral')} className="w-full">
              Volver a A1
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!cerebroProfile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/5 to-muted/10 dark:from-background dark:to-muted/90 p-4">
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <Badge className="mx-auto" variant="secondary">
            A2: Rutas de Transformación
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-muted/90 dark:text-muted/5 leading-tight">
            Tu Motor de Avance
          </h1>
          <p className="text-xl text-muted/60 dark:text-muted/40">
            90 días de acciones personalizadas según tu patrón
          </p>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg bg-white dark:bg-background">
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-muted/70 dark:text-muted/30 leading-relaxed">
                Basado en tu perfil <strong>{profileName}</strong> de Despega Cerebral con puntuación dominante de <strong>{cerebroProfile.primaryScore}%</strong>, 
                hemos diseñado un plan de 90 días con micro-acciones concretas.
              </p>
              
              <div className="p-4 bg-muted/5 dark:bg-card/50 rounded-[28px] border border-muted/20 dark:border-card">
                <p className="text-muted/70 dark:text-muted/30 leading-relaxed">
                  No se trata de trabajar más horas. Se trata de trabajar <strong>en dirección correcta, 
                  con acciones que realmente importan</strong>, adaptadas a tu patrón natural de comportamiento.
                </p>
              </div>

              {/* Cerebro Profile Scores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                <div className="bg-red/5 dark:bg-red/20 p-3 rounded-[28px] border border-red/20 dark:border-red-800">
                  <p className="text-xs text-red dark:text-red-400 font-semibold">Energía</p>
                  <p className="text-2xl font-bold text-red dark:text-red-300">{cerebroProfile?.energia}%</p>
                </div>
                <div className="bg-yellow/5 dark:bg-yellow/20 p-3 rounded-[28px] border border-yellow/20 dark:border-yellow">
                  <p className="text-xs text-yellow dark:text-yellow-400 font-semibold">Enfoque</p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{cerebroProfile?.enfoque}%</p>
                </div>
                <div className="bg-green/5 dark:bg-green/20 p-3 rounded-[28px] border border-green/20 dark:border-green-800">
                  <p className="text-xs text-green dark:text-green/40 font-semibold">Relaciones</p>
                  <p className="text-2xl font-bold text-green dark:text-green-300">{cerebroProfile?.relaciones}%</p>
                </div>
                <div className="bg-blue/5 dark:bg-blue/20 p-3 rounded-[28px] border border-blue/30 dark:border-blue/10">
                  <p className="text-xs text-blue dark:text-blue/40 font-semibold">Plan Ejecutivo</p>
                  <p className="text-2xl font-bold text-blue dark:text-blue/30">{cerebroProfile?.plan_ejecutivo}%</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex gap-3">
                  <Zap className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-muted/10">Micro-acciones diarias</p>
                    <p className="text-sm text-muted/60 dark:text-muted/40">De 5 a 120 minutos, nunca abrumador</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Target className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-muted/10">3 Sprints estructurados</p>
                    <p className="text-sm text-muted/60 dark:text-muted/40">30 días cada uno, con momentum progresivo</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <BookOpen className="w-6 h-6 text-blue/50 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-muted/10">Bitácora de aprendizaje</p>
                    <p className="text-sm text-muted/60 dark:text-muted/40">Reflexión semanal para consolidar progreso</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3-Sprint Timeline */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-red-500 bg-white dark:bg-background">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sprint 1: Aterrizaje</CardTitle>
              <CardDescription>Días 1-30</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted/60 dark:text-muted/40">
                Tomar velocidad, establecer rutinas, descubrir tu ritmo natural
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 bg-white dark:bg-background">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sprint 2: Consolidación</CardTitle>
              <CardDescription>Días 31-60</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted/60 dark:text-muted/40">
                Profundizar habilidades, resolver obstáculos, acelerar transformación
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 bg-white dark:bg-background">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sprint 3: Maestría</CardTitle>
              <CardDescription>Días 61-90</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted/60 dark:text-muted/40">
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
          <p className="text-center text-sm text-muted/60 dark:text-muted/40">
            Tómate un momento para entender por dónde comenzaremos
          </p>
        </div>
      </div>
    </div>
  )
}

