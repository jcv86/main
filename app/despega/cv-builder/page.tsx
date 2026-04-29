'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { FileText } from 'lucide-react'

export default function CVBuilderPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSaveCV = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) {
        router.push('/auth/signin')
        return
      }

      // Save placeholder CV
      await supabase.from('user_a3_cv').upsert({
        user_id: user.id,
        cv_content: 'CV placeholder - módulo en desarrollo',
        updated_at: new Date().toISOString()
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
          <FileText className="w-16 h-16 mx-auto text-purple mb-4 opacity-50" />
          <h1 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">
            CV Builder
          </h1>
          <p className="text-muted-foreground dark:text-muted-foreground mb-6">
            Módulo de CV Builder con optimización ATS en desarrollo
          </p>
          <div className="bg-blue/5 dark:bg-blue border border-blue/30 dark:border-blue/10 rounded-[28px] p-4 mb-6">
            <p className="text-blue dark:text-blue-300 text-sm">
              Este módulo permitirá crear y optimizar tu CV para aparecer en búsquedas ATS y captar recruiters
            </p>
          </div>
          <Button onClick={handleSaveCV} className="bg-purple hover:bg-purple">
            {loading ? 'Guardando...' : 'Marcar como completado'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
