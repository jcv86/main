'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { CanonRouteDisplay } from '@/components/canon-route-display'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

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
        if (!user) return

        console.log('[v0] Loading CANON route data for user:', user.id)

        // Get user profile
        const { data: profileData } = await supabase
          .from('despega_user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        // Get generated routes
        const { data: routeData } = await supabase
          .from('canon_generated_routes')
          .select('*')
          .eq('user_id', user.id)
          .order('day', { ascending: true })

        if (routeData) {
          console.log('[v0] Found routes:', routeData.length)
          setMissions(routeData.map(route => ({
            missionId: route.id,
            title: route.mission_title,
            description: route.mission_description,
            day: route.day,
            phase: route.phase,
            sourceRule: route.source_rule,
            sourceResponses: route.traceability_details || [],
            difficulty: route.difficulty,
            estimatedHours: route.estimated_hours
          })))
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
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  if (!missions || missions.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Ruta no generada</CardTitle>
          <CardDescription>Completa Conozcámonos 2 para generar tu ruta personalizada</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">Todavía no hemos generado tu ruta de 30/60/90 días. Completa el test para comenzar.</p>
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
