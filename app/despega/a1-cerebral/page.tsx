'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { DISC_TEST_QUESTIONS } from '@/lib/disc-test-questions'
import { QuestionProgress } from '@/components/question-progress'

type QuestionTiming = {
  questionId: number
  startTime: number
  endTime?: number
  responseTime?: number
}

export default function A1CerebralPage() {
  const [idx, setIdx] = useState(0)
  const [more, setMore] = useState<Record<number, string>>({})
  const [less, setLess] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authOk, setAuthOk] = useState(false)
  const [questionTimings, setQuestionTimings] = useState<QuestionTiming[]>([])
  const router = useRouter()
  const sb = createClient()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await sb.auth.getUser()
      if (!user) { router.push('/auth/signin'); return }
      setAuthOk(true)
    }
    check()
  }, [sb, router])

  useEffect(() => {
    // Track when user enters a new question
    setQuestionTimings(prev => {
      const updated = [...prev]
      const existing = updated.find(t => t.questionId === DISC_TEST_QUESTIONS[idx].id)
      if (!existing) {
        updated.push({ questionId: DISC_TEST_QUESTIONS[idx].id, startTime: Date.now() })
      }
      return updated
    })
  }, [idx])

  if (!authOk) return <div className="min-h-screen flex items-center justify-center"><p>Verificando...</p></div>

  const q = DISC_TEST_QUESTIONS[idx]
  const bothAnswered = !!more[q.id] && !!less[q.id]
  const isLast = idx === DISC_TEST_QUESTIONS.length - 1
  const questionCode = `A1-CERT-${String(q.id).padStart(3, '0')}`

  const calculateScores = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 }
    for (const qid in more) {
      const question = DISC_TEST_QUESTIONS.find(x => x.id === Number(qid))
      if (question) {
        const moreOpt = question.opciones.find(o => o.texto === more[qid])
        const lessOpt = question.opciones.find(o => o.texto === less[qid])
        if (moreOpt) scores[moreOpt.dimension]++
        if (lessOpt) scores[lessOpt.dimension]--
      }
    }
    return scores
  }

  const handleNext = async () => {
    if (!bothAnswered) { setError('Selecciona ambas opciones'); return }
    
    // Record response time for this question
    const currentTiming = questionTimings.find(t => t.questionId === q.id)
    if (currentTiming) {
      currentTiming.endTime = Date.now()
      currentTiming.responseTime = Math.round((currentTiming.endTime - currentTiming.startTime) / 1000)
    }
    
    // Check if same option selected for both MÁS and MENOS
    if (more[q.id] === less[q.id]) {
      setError('No puedes seleccionar la misma opción para MÁS y MENOS')
      return
    }
    
    if (isLast) {
      setLoading(true)
      setError('')
      try {
        console.log('[v0] Starting test submission via API...')
        
        // Get user first
        const { data: { user } } = await sb.auth.getUser()
        if (!user) {
          console.log('[v0] No user found, redirecting to signin')
          router.push('/auth/signin')
          return
        }
        
        const scores = calculateScores()
        console.log('[v0] Scores calculated:', scores)
        console.log('[v0] Response timings:', questionTimings)
        
        // Call API endpoint to save Cerebral assessment, passing user_id and response timings
        const response = await fetch('/api/a1-cerebral-save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            user_id: user.id,
            responses: { more, less },
            questions: DISC_TEST_QUESTIONS.map(q => ({ id: q.id, pregunta: q.pregunta })),
            disc_profile: scores,
            response_timings: questionTimings
          })
        })
        
        console.log('[v0] API response status:', response.status)
        
        const result = await response.json()
        
        if (!response.ok) {
          console.error('[v0] API error:', result)
          throw new Error(result.error || 'Failed to save test results')
        }
        
        console.log('[v0] Successfully saved Cerebral assessment:', result)
        router.push('/despega/a1-report')
      } catch (err) {
        console.error('[v0] Test submission error:', err)
        setError('Error al guardar: ' + (err instanceof Error ? err.message : 'Unknown error'))
      } finally {
        setLoading(false)
      }
    } else {
      setIdx(idx + 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <QuestionProgress
          currentQuestion={idx + 1}
          totalQuestions={DISC_TEST_QUESTIONS.length}
          questionCode={questionCode}
          estimatedTimePerQuestion={20}
          showTimeRemaining={true}
        />
        
        {/* Main Question Card */}
        <div className="bg-card border-2 border-purple/30 rounded-2xl p-10 mb-8 shadow-lg">
          {/* Question Header */}
          <div className="mb-10 pb-6 border-b border-purple/20">
            <h2 className="text-3xl font-bold text-white leading-tight">{q.pregunta}</h2>
            <p className="text-purple mt-3 font-semibold">Instrucción: Selecciona una opción en cada columna</p>
          </div>

          {/* Response Timing Display (if available) */}
          {questionTimings.find(t => t.questionId === q.id && t.responseTime) && (
            <div className="mb-6 p-4 bg-blue/10 border border-blue/40 rounded-lg text-center">
              <p className="text-sm text-blue font-semibold">
                ⏱️ Tiempo en pregunta anterior: {questionTimings.find(t => t.questionId === DISC_TEST_QUESTIONS[Math.max(0, idx-1)].id)?.responseTime || 0}s
              </p>
            </div>
          )}

          {/* Two-column layout for MÁS and MENOS */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* MÁS como yo column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">+</span>
                </div>
                <p className="text-xl font-bold text-green">MÁS como yo</p>
              </div>
              <div className="space-y-3">
                {q.opciones.map((opt) => (
                  <button 
                    key={`more-${opt.texto}`} 
                    onClick={() => { setMore(p => ({ ...p, [q.id]: opt.texto })); setError('') }} 
                    disabled={less[q.id] === opt.texto}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all font-semibold text-base ${
                      more[q.id] === opt.texto 
                        ? 'border-green bg-green/25 text-white shadow-lg shadow-green/20' 
                        : less[q.id] === opt.texto 
                          ? 'border-muted/20 bg-muted/5 text-white/70 opacity-50 cursor-not-allowed' 
                          : 'border-green/40 text-white/90 hover:border-green hover:bg-green/15 hover:text-white'
                    }`}>
                    {opt.texto}
                  </button>
                ))}
              </div>
            </div>

            {/* MENOS como yo column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">−</span>
                </div>
                <p className="text-xl font-bold text-red">MENOS como yo</p>
              </div>
              <div className="space-y-3">
                {q.opciones.map((opt) => (
                  <button 
                    key={`less-${opt.texto}`} 
                    onClick={() => { setLess(p => ({ ...p, [q.id]: opt.texto })); setError('') }} 
                    disabled={more[q.id] === opt.texto}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all font-semibold text-base ${
                      less[q.id] === opt.texto 
                        ? 'border-red bg-red/25 text-white shadow-lg shadow-red/20' 
                        : more[q.id] === opt.texto 
                          ? 'border-muted/20 bg-muted/5 text-white/70 opacity-50 cursor-not-allowed' 
                          : 'border-red/40 text-white/90 hover:border-red hover:bg-red/15 hover:text-white'
                    }`}>
                    {opt.texto}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red/15 border-2 border-red/40 rounded-lg">
              <p className="text-red font-semibold text-center"> {error}</p>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={() => idx > 0 && setIdx(idx - 1)} 
            variant="outline" 
            disabled={idx === 0} 
            className="flex-1 py-6 text-base font-semibold"
          >
            ← Anterior
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!bothAnswered || loading} 
            className="flex-1 py-6 text-base font-semibold"
          >
            {loading ? 'Guardando...' : isLast ? 'Ver Resultados →' : 'Siguiente →'}
          </Button>
        </div>
      </div>
    </div>
  )
}
