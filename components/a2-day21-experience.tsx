'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, AlertCircle, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ensureTravisDataForDay } from '@/lib/travis-seed-supabase'
import { isTravisMode } from '@/lib/travis-form-data'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day21ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

interface ImprovedBullet {
  bulletNumber: number
  rawBullet: string
  improvedBullet?: string
  actionVerb?: string
  context?: string
  impactMetrics?: string
  polishScore?: number
  isApproved?: boolean
}

export function Day21Experience({ onComplete, userId }: Day21ExperienceProps) {
  const [step, setStep] = useState(1)
  const [bullets, setBullets] = useState<ImprovedBullet[]>(Array.from({ length: 6 }, (_, i) => ({
    bulletNumber: i + 1,
    rawBullet: '',
    improvedBullet: '',
  })))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)
  const sb = createClient()

  // Load Day 19-20 bullets on mount (with Travis auto-seed)
  useEffect(() => {
    const travisMode = isTravisMode()
    setIsDevMode(travisMode)
    
    if (userId) {
      initializeDay21(travisMode)
    }
  }, [userId])

  const initializeDay21 = async (travisMode: boolean) => {
    if (!userId) return
    setIsLoading(true)
    try {
      if (travisMode) {
        await ensureTravisDataForDay(userId, 21)
      }
      await loadPreviousBullets()
    } catch (err) {
      console.error('[v0] Error initializing Day 21:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPreviousBullets = async () => {
    if (!userId) return
    try {
      const { data, error: err } = await sb
        .from('a2_cv_bullets')
        .select('bullet_number, raw_bullet, improved_bullet')
        .eq('user_id', userId)
        .in('day_number', [19, 20])
        .order('bullet_number', { ascending: true })
        .limit(6)

      if (err && err.code !== 'PGRST116') throw err

      if (data && data.length > 0) {
        const loadedBullets = data.map(b => ({
          bulletNumber: b.bullet_number,
          rawBullet: b.raw_bullet,
          improvedBullet: b.improved_bullet || '',
        }))
        setBullets(loadedBullets)
      } else {
        setError('No bullets found from Days 19-20. Please complete those days first.')
      }
    } catch (err) {
      console.error('[v0] Error loading bullets:', err)
      setError('Failed to load your previous bullets.')
    }
  }

  const updateBullet = (index: number, field: keyof ImprovedBullet, value: any) => {
    const updated = [...bullets]
    updated[index] = { ...updated[index], [field]: value }
    setBullets(updated)
  }

  const calculatePolishScore = (bullet: ImprovedBullet): number => {
    let score = 0
    if (bullet.actionVerb && bullet.actionVerb.length > 0) score += 2
    if (bullet.context && bullet.context.length > 20) score += 3
    if (bullet.impactMetrics && bullet.impactMetrics.length > 10) score += 3
    if (bullet.improvedBullet && bullet.improvedBullet.length > 50) score += 2
    return Math.min(10, score)
  }

  const handlePolishAll = async () => {
    setIsLoading(true)
    try {
      // Calculate polish scores for all bullets
      const polishedBullets = bullets.map(bullet => ({
        ...bullet,
        polishScore: calculatePolishScore(bullet),
        isApproved: false,
      }))
      setBullets(polishedBullets)
      setStep(2)
    } catch (err) {
      console.error('[v0] Error polishing bullets:', err)
      setError('Failed to polish bullets')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      // Save all 6 polished bullets to database
      if (userId) {
        for (const bullet of bullets) {
          const { error: err } = await sb.from('a2_cv_bullets').insert({
            user_id: userId,
            day_number: 21,
            bullet_number: bullet.bulletNumber,
            raw_bullet: bullet.rawBullet,
            improved_bullet: bullet.improvedBullet,
            action_verb: bullet.actionVerb,
            context: bullet.context,
            impact_metrics: bullet.impactMetrics,
            polish_score: bullet.polishScore || 0,
            is_approved: true,
          })

          if (err && err.code !== '23505') throw err
        }
      }

      await onComplete({
        dayNumber: 21,
        bulletCount: bullets.length,
        averagePolishScore: Math.round(
          bullets.reduce((sum, b) => sum + (b.polishScore || 0), 0) / bullets.length
        ),
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 21:', err)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && step === 1 && bullets[0].rawBullet === '') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-12 flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'rgb(80, 160, 170)' }} />
        <p className="text-white text-lg">Cargando tus bullets anteriores...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {error && (
        <div className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)' }}>
          <AlertCircle className="w-5 h-5 text-[rgb(80,160,170)]-500 flex-shrink-0 mt-0.5" />
          <p className="text-[rgb(80,160,170)]-500">{error}</p>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Profundización en Bullets</h2>
            <p className="text-white/70 text-lg">Toma tus 6 bullets mejores y hazlos irreprochables</p>
          </div>

          <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
            <h3 className="text-white font-semibold mb-4">Mejora cada bullet en 3 dimensiones:</h3>
            <div className="space-y-2 text-white/80 text-sm">
              <p>1. Verbo de Acción - Comienza con un verbo fuerte (Coordiné, Implementé, Diseñé)</p>
              <p>2. Contexto - ¿Dónde y con quién? Detalles específicos del entorno</p>
              <p>3. Impacto - ¿Qué cambió? Métricas, alcance o resultado</p>
            </div>
          </div>

          <div className="space-y-4">
            {bullets.map((bullet, idx) => (
              <div key={idx} className="rounded-lg p-4 border border-white/20" style={{ backgroundColor: 'rgba(80, 160, 170, 0.08)' }}>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-white/60 text-sm font-semibold">Bullet {bullet.bulletNumber}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-white/70 text-xs font-semibold mb-1 block">Verbo de Acción</label>
                    <input
                      type="text"
                      placeholder="Ej: Coordiné, Implementé, Diseñé"
                      value={bullet.actionVerb || ''}
                      onChange={(e) => updateBullet(idx, 'actionVerb', e.target.value)}
                      className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-white/70 text-xs font-semibold mb-1 block">Contexto</label>
                    <textarea
                      placeholder="¿Dónde? ¿Con cuántas personas? ¿En qué industria?"
                      value={bullet.context || ''}
                      onChange={(e) => updateBullet(idx, 'context', e.target.value)}
                      className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-white/70 text-xs font-semibold mb-1 block">Impacto / Métricas</label>
                    <input
                      type="text"
                      placeholder="Ej: $500K revenue, 40% improvement, 8 team members"
                      value={bullet.impactMetrics || ''}
                      onChange={(e) => updateBullet(idx, 'impactMetrics', e.target.value)}
                      className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-white/70 text-xs font-semibold mb-1 block">Bullet Mejorado</label>
                    <textarea
                      placeholder="El bullet final pulido"
                      value={bullet.improvedBullet || ''}
                      onChange={(e) => updateBullet(idx, 'improvedBullet', e.target.value)}
                      className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handlePolishAll}
            disabled={isLoading}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isLoading ? 'Puliendo...' : 'Calcular Puntuación de Pulido'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tus 6 Bullets Pulidos</h2>
            <p className="text-white/70">Cada uno está completo con acción, contexto e impacto</p>
          </div>

          <div className="space-y-3">
            {bullets.map((bullet, idx) => (
              <div key={idx} className="rounded-lg p-4" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 text-white/60 font-semibold text-sm">0{idx + 1}</div>
                  <div className="flex-1">
                    <p className="text-white text-sm leading-relaxed">{bullet.improvedBullet}</p>
                    <div className="flex gap-4 mt-2 text-xs text-white/60">
                      {bullet.polishScore && <span>Pulido: {bullet.polishScore}/10</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-6 border-2" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)', borderColor: 'rgba(80, 160, 170, 0.3)' }}>
            <p className="text-sm font-semibold text-white mb-3">Tu Armería de Bullets Lista</p>
            <p className="text-white/85 text-sm">
              Tienes 6 bullets de calidad profesional, cada uno con acción clara, contexto específico e impacto medible. Estos son tus mejores historias de valor.
            </p>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgb(80, 160, 170)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 21'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
