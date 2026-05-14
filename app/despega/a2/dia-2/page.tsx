'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day2Experience } from '@/components/a2-day2-experience'
import { Card } from '@/components/ui/card'
import { AlertCircle, Loader } from 'lucide-react'
import { calcularPerfilA1, type A1ProfileResult, type A1Response } from '@/lib/disc-calculator'
import { markTaskComplete, getTaskId } from '@/lib/supabase/task-completions'
import type { Day2Submission } from '@/lib/a2-day2-types'

const DIA_NUM = 2

// Mock A1 profile data - Replace with actual API call
const getMockA1Profile = (): A1ProfileResult => {
  const mockResponses: A1Response[] = [
    // Dominancia (7 preguntas)
    { question_id: 1, respuesta: 'más' },
    { question_id: 2, respuesta: 'más' },
    { question_id: 3, respuesta: 'como_yo' },
    { question_id: 4, respuesta: 'más' },
    { question_id: 5, respuesta: 'como_yo' },
    { question_id: 6, respuesta: 'más' },
    { question_id: 7, respuesta: 'menos' },
    // Influencia (7 preguntas)
    { question_id: 8, respuesta: 'más' },
    { question_id: 9, respuesta: 'como_yo' },
    { question_id: 10, respuesta: 'más' },
    { question_id: 11, respuesta: 'menos' },
    { question_id: 12, respuesta: 'como_yo' },
    { question_id: 13, respuesta: 'menos' },
    { question_id: 14, respuesta: 'más' },
    // Estabilidad (7 preguntas)
    { question_id: 15, respuesta: 'como_yo' },
    { question_id: 16, respuesta: 'más' },
    { question_id: 17, respuesta: 'como_yo' },
    { question_id: 18, respuesta: 'más' },
    { question_id: 19, respuesta: 'menos' },
    { question_id: 20, respuesta: 'más' },
    { question_id: 21, respuesta: 'como_yo' },
    // Conciencia (7 preguntas)
    { question_id: 22, respuesta: 'más' },
    { question_id: 23, respuesta: 'más' },
    { question_id: 24, respuesta: 'como_yo' },
    { question_id: 25, respuesta: 'más' },
    { question_id: 26, respuesta: 'como_yo' },
    { question_id: 27, respuesta: 'menos' },
    { question_id: 28, respuesta: 'más' },
  ]

  return calcularPerfilA1(mockResponses)
}

export default function DiaPage() {
  const router = useRouter()
  const [a1Profile, setA1Profile] = useState<A1ProfileResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchA1Data = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/despega/a1-profile')
        // const data = await response.json()
        // setA1Profile(data)

        const mockProfile = getMockA1Profile()
        setA1Profile(mockProfile)
        setLoading(false)
      } catch (err) {
        console.error('[v0] Error fetching A1 profile:', err)
        setError('No pudimos cargar tu perfil A1. Intenta nuevamente.')
        setLoading(false)
      }
    }

    fetchA1Data()
  }, [])

  const handleDay2Complete = async (submission: Day2Submission) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/despega/a2/dia-2', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submission),
      // })
      // if (!response.ok) throw new Error('Failed to save')

      console.log('[v0] Day 2 submission saved:', submission)

      // Mark this task as complete in Supabase
      const taskId = getTaskId([], 2, 'Día 2')
      await markTaskComplete(taskId)
      console.log('[v0] Task marked complete:', taskId)

      // Navigate to A2 progress dashboard with anchor to día-3
      router.push('/despega/a2-routes#dia-3')
    } catch (err) {
      console.error('[v0] Error saving Day 2:', err)
      throw err
    }
  }

  // Loading state
  if (loading) {
    return (
      <A2DayPageTemplate dayNumber={DIA_NUM}>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-white/70">Cargando tu perfil A1...</p>
        </div>
      </A2DayPageTemplate>
    )
  }

  // Error state
  if (error || !a1Profile) {
    return (
      <A2DayPageTemplate dayNumber={DIA_NUM}>
        <Card className="border border-red-500/40 bg-red-500/5 p-6 rounded-[20px]">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-1">Error al cargar</h3>
              <p className="text-white/80 text-sm">{error || 'No pudimos cargar tu perfil A1. Intenta nuevamente.'}</p>
            </div>
          </div>
        </Card>
      </A2DayPageTemplate>
    )
  }

  // Success state - Show interactive experience
  return (
    <A2DayPageTemplate dayNumber={DIA_NUM}>
      <Day2Experience a1Profile={a1Profile} onComplete={handleDay2Complete} />
    </A2DayPageTemplate>
  )
}

