'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp } from 'lucide-react'

export default function MarketInsightsPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleGenerateInsights = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) {
        router.push('/auth/signin')
        return
      }

      // Save placeholder market insights
      await supabase.from('user_a3_market_insights').upsert({
        user_id: user.id,
        market_data: 'Market insights placeholder - análisis en desarrollo',
        updated_at: new Date().toISOString()
      })

      router.push('/despega/a3-dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <TrendingUp className="w-16 h-16 mx-auto text-purple mb-4 opacity-50" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Market Intelligence
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Análisis del mercado para tu rol objetivo
          </p>
          <div className="bg-blue/5 dark:bg-blue-950 border border-blue/30 dark:border-blue-800 rounded-[28px] p-4 mb-6">
            <p className="text-blue-900 dark:text-blue-200 text-sm">
              Este módulo analiza: salarios promedio, empresas que contratan, tendencias, skills demandadas, y competencia
            </p>
          </div>
          <Button onClick={handleGenerateInsights} className="bg-purple-600 hover:bg-purple-700">
            {loading ? 'Generando...' : 'Marcar como completado'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
