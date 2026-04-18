'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { DISC_TEST_QUESTIONS } from '@/lib/disc-test-questions'
import { QuestionProgress } from '@/components/question-progress'

export default function A1CerebralPage() {
  const [idx, setIdx] = useState(0)
  const [more, setMore] = useState<Record<number, string>>({})
  const [less, setLess] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authOk, setAuthOk] = useState(false)
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
        
        // Call API endpoint to save Cerebral assessment, passing user_id
        const response = await fetch('/api/a1-cerebral-save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            user_id: user.id,
            responses: { more, less },
            questions: DISC_TEST_QUESTIONS.map(q => ({ id: q.id, pregunta: q.pregunta })),
            disc_profile: scores
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
        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-8 text-center">{q.pregunta}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg font-semibold text-green dark:text-green/40 mb-4 text-center">MÁS como yo</p>
              <div className="space-y-3">
                {q.opciones.map((opt) => (
                  <button 
                    key={`more-${opt.texto}`} 
                    onClick={() => { setMore(p => ({ ...p, [q.id]: opt.texto })); setError('') }} 
                    disabled={less[q.id] === opt.texto}
                    className={`w-full text-left p-4 rounded-[28px] border-2 transition-all text-sm font-medium ${
                      more[q.id] === opt.texto 
                        ? 'border-green bg-green/10 text-green dark:bg-green/20 dark:text-green' 
                        : less[q.id] === opt.texto 
                          ? 'border-muted/20 bg-muted/5 text-muted/40 dark:border-muted/40 dark:bg-transparent dark:text-muted/50 opacity-50 cursor-not-allowed' 
                          : 'border-border text-foreground hover:border-green/50 hover:bg-green/5 dark:hover:bg-green/10'
                    }`}>
                    {opt.texto}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-red dark:text-red/40 mb-4 text-center">MENOS como yo</p>
              <div className="space-y-3">
                {q.opciones.map((opt) => (
                  <button 
                    key={`less-${opt.texto}`} 
                    onClick={() => { setLess(p => ({ ...p, [q.id]: opt.texto })); setError('') }} 
                    disabled={more[q.id] === opt.texto}
                    className={`w-full text-left p-4 rounded-[28px] border-2 transition-all text-sm font-medium ${
                      less[q.id] === opt.texto 
                        ? 'border-red bg-red/10 text-red dark:bg-red/20 dark:text-red' 
                        : more[q.id] === opt.texto 
                          ? 'border-muted/20 bg-muted/5 text-muted/40 dark:border-muted/40 dark:bg-transparent dark:text-muted/50 opacity-50 cursor-not-allowed' 
                          : 'border-border text-foreground hover:border-red/50 hover:bg-red/5 dark:hover:bg-red/10'
                    }`}>
                    {opt.texto}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {error && <p className="text-destructive text-sm mt-4 text-center">{error}</p>}
        </div>
        <div className="flex gap-4">
          <Button onClick={() => idx > 0 && setIdx(idx - 1)} variant="outline" disabled={idx === 0} className="flex-1">Anterior</Button>
          <Button onClick={handleNext} disabled={!bothAnswered || loading} className="flex-1">{loading ? 'Guardando...' : isLast ? 'Ver Resultados' : 'Siguiente'}</Button>
        </div>
      </div>
    </div>
  )
}
