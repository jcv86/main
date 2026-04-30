'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { Briefcase } from 'lucide-react'

export default function InterviewSimulationsPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCompleteSimulation = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) {
        router.push('/auth/signin')
        return
      }

      // Save placeholder simulation
      await supabase.from('user_a3_simulations').insert({
        user_id: user.id,
        simulation_type: 'behavioral',
        transcript: 'Simulación placeholder - módulo en desarrollo',
        score: 75,
        feedback: 'Simulaciones interactivas en desarrollo',
        completed_at: new Date().toISOString()
      })

      router.push('/despega/a3')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <Briefcase className="w-16 h-16 mx-auto text-purple mb-4 opacity-50" />
          <h1 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">
            Entrenamiento de Entrevista
          </h1>
          <p className="text-muted-foreground dark:text-muted-foreground mb-6">
            Simula entrevistas realistas y recibe feedback instantáneo
          </p>
          <div className="bg-blue/5 dark:bg-blue border border-blue/30 dark:border-blue/10 rounded-[28px] p-4 mb-6">
            <p className="text-blue dark:text-blue-300 text-sm">
              Este módulo ofrece: entrevistas técnicas, conductuales, preguntas STAR, feedback en tiempo real
            </p>
          </div>
          <Button onClick={handleCompleteSimulation} className="bg-purple/80 hover:bg-purple/70">
            {loading ? 'Guardando...' : 'Completar simulación'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
