import { createClient } from '@/lib/supabase'
import { useState, useCallback } from 'react'

export interface TrainingSession {
  id: string
  sessionType: 'simulator' | 'laboratory' | 'field'
  skillTarget: string
  scenarioLevel: 'basico' | 'intermedio' | 'avanzado'
  objective: string
  status: 'en_progreso' | 'completado' | 'abandonado'
  createdAt: string
  completedAt?: string
}

export interface SessionEvaluation {
  scores: Record<string, number>
  feedbackNarrative: string
  patternsDetected: string[]
  nextSteps: string
}

export function useA3Training() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startSession = useCallback(
    async (
      sessionType: 'simulator' | 'laboratory' | 'field',
      skillTarget: string,
      scenarioLevel: 'basico' | 'intermedio' | 'avanzado',
      objective: string
    ): Promise<TrainingSession | null> => {
      try {
        setLoading(true)
        console.log('[v0] Starting A3 training session:', { sessionType, skillTarget, scenarioLevel })

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user found')

        // Get current mission
        const { data: profile } = await supabase
          .from('despega_user_profiles')
          .select('a2_mission_id')
          .eq('user_id', user.id)
          .single()

        const { data, error: insertError } = await supabase
          .from('a3_training_sessions')
          .insert([{
            user_id: user.id,
            mission_id: profile?.a2_mission_id,
            session_type: sessionType,
            skill_target: skillTarget,
            scenario_level: scenarioLevel,
            objective,
            status: 'en_progreso'
          }])
          .select()
          .single()

        if (insertError) throw insertError

        console.log('[v0] Training session created:', data?.id)

        // CONEXIÓN A3→A4: Personalizar feed de noticias
        try {
          const personalizeResponse = await fetch('/rest/personalize-feed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user.id,
              training_tema: skillTarget,
              training_id: data?.id,
            }),
          })

          if (personalizeResponse.ok) {
            const personalizeData = await personalizeResponse.json()
            console.log('[v0] A4 feed personalized for training:', skillTarget)
          } else {
            console.warn('[v0] Failed to personalize A4 feed (non-critical)')
          }
        } catch (error) {
          console.warn('[v0] Error in A3→A4 connection (non-critical):', error)
        }

        setError(null)
        return data

      } catch (err: any) {
        const msg = err.message || 'Error starting training session'
        console.error('[v0] Training session error:', msg)
        setError(msg)
        return null
      } finally {
        setLoading(false)
      }
    },
    [supabase]
  )

  const completeSession = useCallback(
    async (
      sessionId: string,
      executionData: any,
      durationMinutes: number,
      evaluation: SessionEvaluation
    ): Promise<boolean> => {
      try {
        setLoading(true)
        console.log('[v0] Completing training session:', sessionId)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user found')

        // Get rubric for this session
        const { data: session } = await supabase
          .from('a3_training_sessions')
          .select('skill_target, scenario_level')
          .eq('id', sessionId)
          .single()

        if (!session) throw new Error('Session not found')

        const { data: rubric } = await supabase
          .from('a3_rubrics')
          .select('id')
          .eq('skill_target', session.skill_target)
          .eq('scenario_level', session.scenario_level)
          .single()

        // Save execution
        const { data: execution, error: execError } = await supabase
          .from('a3_training_executions')
          .insert([{
            session_id: sessionId,
            execution_data: executionData,
            duration_minutes: durationMinutes
          }])
          .select()
          .single()

        if (execError) throw execError

        // Save evaluation
        await supabase
          .from('a3_session_evaluations')
          .insert([{
            execution_id: execution.id,
            rubric_id: rubric?.id,
            scores: evaluation.scores,
            feedback_narrative: evaluation.feedbackNarrative,
            patterns_detected: evaluation.patternsDetected,
            next_steps: evaluation.nextSteps
          }])

        // Mark session as complete
        await supabase
          .from('a3_training_sessions')
          .update({ status: 'completado', completed_at: new Date().toISOString() })
          .eq('id', sessionId)

        // Update skill progress
        const avgScore = Object.values(evaluation.scores).reduce((a: any, b: any) => a + b, 0) / Object.keys(evaluation.scores).length
        
        const { data: skillProgress } = await supabase
          .from('a3_skill_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('skill_target', session.skill_target)
          .single()

        if (skillProgress) {
          await supabase
            .from('a3_skill_progress')
            .update({
              session_count: (skillProgress.session_count || 0) + 1,
              avg_score: avgScore,
              updated_at: new Date().toISOString()
            })
            .eq('id', skillProgress.id)
        } else {
          await supabase
            .from('a3_skill_progress')
            .insert([{
              user_id: user.id,
              skill_target: session.skill_target,
              session_count: 1,
              avg_score: avgScore
            }])
        }

        console.log('[v0] Training session completed successfully')
        setError(null)
        return true

      } catch (err: any) {
        const msg = err.message || 'Error completing training session'
        console.error('[v0] Error completing session:', msg)
        setError(msg)
        return false
      } finally {
        setLoading(false)
      }
    },
    [supabase]
  )

  const logFieldExperiment = useCallback(
    async (
      hypothesis: string,
      actionTaken: string,
      context: string,
      result: string,
      learning: string,
      frictionLevel: number = 3
    ): Promise<boolean> => {
      try {
        setLoading(true)
        console.log('[v0] Logging field experiment...')

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user found')

        const { error: insertError } = await supabase
          .from('a3_field_experiments')
          .insert([{
            user_id: user.id,
            hypothesis,
            action_taken: actionTaken,
            context,
            result,
            learning,
            friction_level: frictionLevel,
            completed_at: new Date().toISOString()
          }])

        if (insertError) throw insertError

        console.log('[v0] Field experiment logged successfully')
        setError(null)
        return true

      } catch (err: any) {
        const msg = err.message || 'Error logging field experiment'
        console.error('[v0] Error logging experiment:', msg)
        setError(msg)
        return false
      } finally {
        setLoading(false)
      }
    },
    [supabase]
  )

  return {
    loading,
    error,
    startSession,
    completeSession,
    logFieldExperiment
  }
}
