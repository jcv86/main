'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle, BookOpen, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Day15ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

interface Story {
  index: number
  title: string
  summary: string
  strength: number
}

export function Day15Experience({ onComplete, userId }: Day15ExperienceProps) {
  const [step, setStep] = useState(1)
  const [story1, setStory1] = useState<Story | null>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [stressTestResults, setStressTestResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sb = createClient()

  useEffect(() => {
    if (userId) {
      loadDay14Story()
    }
  }, [userId])

  const loadDay14Story = async () => {
    if (!userId) return
    setIsLoading(true)
    setError(null)
    try {
      const { data, error: err } = await sb
        .from('a2_achievement_stories')
        .select('*')
        .eq('user_id', userId)
        .eq('day_number', 14)
        .eq('story_index', 1)
        .single()

      if (err && err.code !== 'PGRST116') throw err

      if (data) {
        const loaded: Story = {
          index: 1,
          title: 'Primera Historia (Día 14)',
          summary: data.coach_polished_story || 'Historia cargada',
          strength: 8,
        }
        setStory1(loaded)
        setStories([loaded])
        setStep(2)
      } else {
        setError('No story found from Day 14. Please complete Day 14 first.')
      }
    } catch (err) {
      console.error('[v0] Error loading Day 14 story:', err)
      setError('Failed to load your Day 14 story.')
    } finally {
      setIsLoading(false)
    }
  }

  const buildStory2 = () => {
    const newStory: Story = {
      index: 2,
      title: 'Segunda Historia',
      summary: 'Cuéntanos otra situación donde demostraste tu valor...',
      strength: 0,
    }
    setStories([...stories, newStory])
  }

  const buildStory3 = () => {
    const newStory: Story = {
      index: 3,
      title: 'Tercera Historia',
      summary: 'Una tercera perspectiva de tu impacto profesional...',
      strength: 0,
    }
    setStories([...stories, newStory])
  }

  const runStressTest = async () => {
    setIsLoading(true)
    try {
      // Simulate stress test results
      const results = {
        totalStories: stories.length,
        averageStrength: Math.round(stories.reduce((sum, s) => sum + s.strength, 0) / stories.length),
        diversityScore: stories.length >= 3 ? 85 : stories.length === 2 ? 60 : 40,
        recommendation:
          stories.length >= 3
            ? '✓ 3 historias completas. Diversidad suficiente para entrevistas.'
            : `✓ ${stories.length} historias. Necesitas ${3 - stories.length} más para cobertura completa.`,
        issues: stories.length < 3 ? ['Necesitas 3 historias para cobertura completa', 'Considera contextos diversos'] : [],
      }

      setStressTestResults(results)
      setStep(4)
    } catch (err) {
      console.error('[v0] Error running stress test:', err)
      setError('Failed to run stress test.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      if (userId && stories.length > 0) {
        // Save complete set to a2_a3_checkpoint_package
        const packageData = {
          user_id: userId,
          day_number: 15,
          value_statements: stories,
          achievement_stories: stories,
          proof_map: [],
          inventory: [],
          a3_checkpoint_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { error: err } = await sb
          .from('a2_a3_checkpoint_package')
          .insert(packageData)

        if (err && err.code !== '23505') {
          throw err
        }
      }

      await onComplete({
        dayNumber: 15,
        stories: stories,
        stressTestResults,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 15:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && !story1) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
        <p className="text-white text-lg">Cargando tu primera historia...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {error && (
        <div className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold text-white mb-3">Cámara de Prueba</h2>
        <p className="text-white/70 text-lg">Completa hasta 3 historias y ejecuta la prueba de estrés</p>
      </div>

      <div className="space-y-4">
        {stories.map((story, idx) => (
          <div key={idx} className="rounded-lg p-4" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-white/60 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{story.title}</p>
                <p className="text-white/70 text-xs mt-2 line-clamp-2">{story.summary}</p>
              </div>
              {story.strength > 0 && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
            </div>
          </div>
        ))}
      </div>

      {stories.length < 3 && (
        <div className="space-y-2">
          {stories.length === 1 && (
            <Button
              onClick={buildStory2}
              className="w-full py-4 text-white font-semibold rounded-full"
              style={{ backgroundColor: 'rgba(80, 160, 170, 0.7)' }}
            >
              + Añadir Segunda Historia
            </Button>
          )}
          {stories.length === 2 && (
            <Button
              onClick={buildStory3}
              className="w-full py-4 text-white font-semibold rounded-full"
              style={{ backgroundColor: 'rgba(80, 160, 170, 0.7)' }}
            >
              + Añadir Tercera Historia
            </Button>
          )}
        </div>
      )}

      {stories.length > 0 && !stressTestResults && (
        <Button
          onClick={runStressTest}
          disabled={isLoading}
          className="w-full py-6 text-white font-semibold rounded-full"
          style={{ backgroundColor: 'rgb(80, 160, 170)' }}
        >
          {isLoading ? 'Analizando...' : `Ejecutar Prueba de Estrés (${stories.length}/3 historias)`}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      )}

      {stressTestResults && (
        <div className="space-y-4">
          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <h3 className="text-white font-semibold mb-4">Resultados de la Prueba de Estrés</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Total de Historias</span>
                <span className="text-white font-semibold">{stressTestResults.totalStories}/3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Fortaleza Promedio</span>
                <span className="text-white font-semibold">{stressTestResults.averageStrength}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Puntuación de Diversidad</span>
                <span className="text-white font-semibold">{stressTestResults.diversityScore}%</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-white text-sm mb-2 font-semibold">Recomendación</p>
              <p className="text-white/85 text-sm">{stressTestResults.recommendation}</p>
            </div>

            {stressTestResults.issues.length > 0 && (
              <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
                <p className="text-red-400 text-xs font-semibold mb-2">Puntos de Mejora</p>
                <ul className="text-red-400/80 text-xs space-y-1">
                  {stressTestResults.issues.map((issue: string, idx: number) => (
                    <li key={idx}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 15 - Enviar Paquete a A3'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
