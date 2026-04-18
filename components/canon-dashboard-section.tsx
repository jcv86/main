'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CanonRouteDisplay } from '@/components/canon-route-display'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface TraceabilityItem {
  missionId: string
  title: string
  description: string
  day: number
  phase: '30' | '60' | '90'
  sourceRule: string
  sourceResponses: {
    questionText: string
    userAnswer: string
    ruleLogic: string
  }[]
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedHours: number
}

export function CanonDashboardSection() {
  const [loading, setLoading] = useState(true)
  const [missions, setMissions] = useState<TraceabilityItem[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const loadCanonData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.log('[v0] No user found')
          setLoading(false)
          return
        }

        console.log('[v0] Loading CANON route data for user:', user.id)

        // Get user profile (with error handling for no data)
        const { data: profileData, error: profileError } = await supabase
          .from('despega_user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (profileError) {
          console.warn('[v0] Error getting profile:', profileError)
        }

        // Get generated routes (with error handling for no data)
        const { data: routeDataArray, error: routeError } = await supabase
          .from('canon_generated_routes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)

        if (routeError) {
          console.error('[v0] Error fetching routes:', routeError)
        }

        const routeData = routeDataArray && routeDataArray.length > 0 ? routeDataArray[0] : null

        if (routeData && routeData.route_data) {
          console.log('[v0] Found route data:', routeData)
          const route = routeData.route_data
          
          // Extract missions from route_data.steps
          if (route.steps && route.steps.length > 0) {
            const extractedMissions = route.steps.map((step: any) => ({
              missionId: step.action?.id || step.id,
              title: step.action?.title || 'Sin título',
              description: step.action?.description || '',
              day: step.week * 7, // Convert week to day
              phase: step.phase,
              sourceRule: step.action?.tags?.join(', ') || '',
              sourceResponses: step.action?.trazability_source_response_ids?.map((id: number) => ({
                questionId: id,
                questionText: `Pregunta ${id}`,
                userAnswer: '',
                ruleLogic: step.action?.title || '',
              })) || [],
              difficulty: step.action?.difficulty || 'medium',
              estimatedHours: (step.action?.duration || 60) / 60, // Convert minutes to hours
            }))
            
            console.log('[v0] Extracted missions:', extractedMissions)
            setMissions(extractedMissions)
          }
        } else {
          console.log('[v0] No route data found for user')
        }

        setUserProfile(profileData)
      } catch (error) {
        console.error('[v0] Error loading CANON data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCanonData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue/40" />
      </div>
    )
  }

  if (!missions || missions.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-muted/60">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Ruta no generada</CardTitle>
          <CardDescription className="text-muted/30">Completa Conozcámonos 2 para generar tu ruta personalizada</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted/30">
            Todavía no hemos generado tu ruta de 30/60/90 días. Responde 9 preguntas más sobre tu contexto de ejecución y generaremos acciones personalizadas basadas en el motor CANON.
          </p>
          <div className="bg-muted/70/50 border border-muted/60 rounded-[28px] p-4 space-y-3">
            <p className="text-sm text-muted/30">
              <span className="font-semibold text-emerald-400">✓ Ya completaste:</span> Test A1 (Perfil DISC)
            </p>
            <p className="text-sm text-muted/30">
              <span className="font-semibold text-blue/40">→ Siguiente:</span> Conozcámonos 2 - Paso 1 (Contexto de ejecución)
            </p>
            <p className="text-sm text-muted/30">
              <span className="font-semibold text-purple/40">📊 Resultado:</span> Ruta 30/60/90 personalizada con trazabilidad
            </p>
          </div>
          <Link href="/despega/onboarding" className="block mt-6">
            <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg">
              Generar mi Ruta Personalizada →
            </Button>
          </Link>
          <p className="text-xs text-muted/40 text-center">Tiempo estimado: 3 minutos</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <CanonRouteDisplay 
      missions={missions}
      userProfile={{
        name: userProfile?.nombre || 'User',
        dominantProfile: userProfile?.dominant_profile || 'D',
        c1Responses: {},
        c2Phase1Responses: {}
      }}
    />
  )
}
