'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Newspaper, TrendingUp, CheckCircle2 } from 'lucide-react'

export default function A4RadarPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) {
        router.push('/auth/signin')
        return
      }

      // Create placeholder radar entry
      await supabase.from('user_a4_radar').upsert({
        user_id: user.id,
        progress_stage: 'a4_active',
        updated_at: new Date().toISOString()
      })

      setLoading(false)
    } catch (err) {
      console.error('[v0] Error:', err)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-slate-600 dark:text-slate-400">Activando tu Radar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            A4: Radar - Acelera tu Oportunidad
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Monitoreo inteligente de oportunidades + sistema de progreso
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Jobs Monitor</h3>
              <Newspaper className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Monitoreo en tiempo real de ofertas que coinciden con tu perfil
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Progress Tracking</h3>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Sigue tu avance a través de A1-A4 con métricas detalladas
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Readiness Score</h3>
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Tu score de candidato competitivo calculado en tiempo real
            </p>
          </Card>
        </div>

        {/* Features */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Características A4
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  News Feed Personalizado
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Noticias sobre empresas e industrias de tu interés
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Job Matching AI
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Análisis automático de fit entre tu perfil y posiciones
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Coach IA Transversal
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Asistente inteligente disponible en todos los stages
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  Progress Dashboard
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Visualización completa de tu transformación A1→A4
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/despega/a3-dashboard')}
          >
            Volver a A3
          </Button>
          <Button
            onClick={() => router.push('/despega')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Ver Dashboard General
          </Button>
        </div>
      </div>
    </div>
  )
}
