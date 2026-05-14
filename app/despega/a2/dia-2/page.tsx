'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { A2DayPageTemplate } from '@/components/a2-day-page-template'
import { Day2Experience } from '@/components/a2-dia2-experience'
import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { A1ProfileResult, calcularPerfilA1, A1Response } from '@/lib/disc-calculator'
import type { Day2Submission } from '@/lib/a2-dia2-types'

const DIA_NUM = 2

/**
 * Mock A1 data for demo - Replace with actual user data fetch
 */
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
        // TODO: Replace with actual API call to fetch user's A1 results
        // const response = await fetch('/api/despega/a1-profile')
        // const data = await response.json()
        // setA1Profile(data)

        // For now, use mock data
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
      // TODO: Replace with actual API call to save Day 2 submission
      // const response = await fetch('/api/despega/a2/dia-2', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submission),
      // })
      // if (!response.ok) throw new Error('Failed to save')

      console.log('[v0] Day 2 submission saved:', submission)

      // Navigate to next day
      router.push('/despega/a2/dia-3')
    } catch (err) {
      console.error('[v0] Error saving Day 2:', err)
      throw err
    }
  }

  if (loading) {
    return (
      <A2DayPageTemplate
        dayNumber={DIA_NUM}
        mission={{
          type: 'mirror',
          title: 'Your Hidden Operating System',
          whyItMatters: 'Loading your profile...',
        }}
      >
        <Card className="border border-purple-500/40 bg-purple-500/5 p-6 rounded-[28px] text-center">
          <p className="text-white/80">Cargando tu perfil A1...</p>
        </Card>
      </A2DayPageTemplate>
    )
  }

  if (error || !a1Profile) {
    return (
      <A2DayPageTemplate
        dayNumber={DIA_NUM}
        mission={{
          type: 'mirror',
          title: 'Your Hidden Operating System',
          whyItMatters: 'There was an issue loading your profile',
        }}
      >
        <Card className="border border-red-500/40 bg-red-500/5 p-6 rounded-[28px]">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-1">Error</h3>
              <p className="text-white/80 text-sm">{error || 'Unable to load your A1 profile. Please try again.'}</p>
            </div>
          </div>
        </Card>
      </A2DayPageTemplate>
    )
  }

  return (
    <A2DayPageTemplate
      dayNumber={DIA_NUM}
      mission={{
        type: 'mirror',
        title: 'Your Hidden Operating System',
        whyItMatters:
          'Your work style directly affects interviews, job decisions, and how you communicate under pressure. Understanding this makes you strategic, not labeled.',
      }}
    >
      <Day2Experience a1Profile={a1Profile} onComplete={handleDay2Complete} />
    </A2DayPageTemplate>
  )
}

