'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, ArrowLeft, CheckCircle2, Users, Lightbulb, RefreshCw,
  ChevronDown, ChevronUp, MessageCircle, ThumbsUp, AlertCircle, 
  Sparkles, Eye, RotateCcw, Save, Loader2, Zap
} from 'lucide-react'
import { useCoaching } from '@/lib/hooks/use-coaching'

const MODULE_XP = 130

// Sesiones de práctica con patrones de Retroalimentación del coach de IA
const PRACTICE_SESSIONS = [
  {
    id: 'intro',
    question: 'Cuéntame sobre ti',
    coachPrompt: 'Déjame escuchar tu autopresentación. Recuerda: identidad profesional, habilidades clave y por qué estás aquí.',
    feedbackCriteria: [
      { id: 'structure', label: 'Estructura clara', description: 'Sigue la fórmula de introducción' },
      { id: 'relevance', label: 'Relevancia del puesto', description: 'Conectado con la posición objetivo' },
      { id: 'length', label: 'Duración apropiada', description: '30-45 segundos (~75-100 palabras)' },
      { id: 'specificity', label: 'Detalles específicos', description: 'No afirmaciones genéricas' }
    ],
    commonIssues: [
      'Demasiado personal (comenzó con nombre, edad o pasatiempos)',
      'Demasiado largo (más de 60 segundos)',
      'Demasiado vago (sin habilidades específicas mencionadas)',
      'Falta objetivo de carrera o motivación'
    ],
    improvementTips: [
      'Comenzar con tu título profesional',
      'Incluir 2-3 habilidades específicas relevantes al puesto',
      'Terminar con por qué esta oportunidad te emociona'
    ]
  },
  {
    id: 'motivation',
    question: '¿Por qué quieres trabajar aquí?',
    coachPrompt: 'Muéstrame que has investigado esta empresa. ¿Qué específicamente te atrae?',
    feedbackCriteria: [
      { id: 'research', label: 'Conocimiento de empresa', description: 'Muestra investigación específica' },
      { id: 'connection', label: 'Conexión personal', description: 'Se vincula con tus objetivos' },
      { id: 'authentic', label: 'Interés auténtico', description: 'No es adulación genérica' },
      { id: 'forward', label: 'Visión futura', description: 'Qué contribuirás' }
    ],
    commonIssues: [
      'Elogios genéricos ("gran empresa", "buena cultura")',
      'Enfocado solo en lo que ganarás',
      'Sin menciones específicas de productos/valores de la empresa',
      'Podría aplicarse a cualquier empresa'
    ],
    improvementTips: [
      'Menciona algo específico sobre la empresa',
      'Conecta la misión de la empresa con tus objetivos personales',
      'Muestra qué traerás, no solo qué tomarás'
    ]
  },
  {
    id: 'challenge',
    question: 'Cuéntame sobre una situación desafiante que superaste',
    coachPrompt: 'Usa el formato STAR. Sé específico sobre TUS acciones y el resultado medible.',
    feedbackCriteria: [
      { id: 'situation', label: 'Situación clara', description: 'El contexto es comprensible' },
      { id: 'actions', label: 'Tus acciones', description: 'Enfoque en lo que HICISTE' },
      { id: 'result', label: 'Resultado medible', description: 'Incluye números o impacto' },
      { id: 'learning', label: 'Muestra aprendizaje', description: 'Qué ganaste de ello' }
    ],
    commonIssues: [
      'Enfocado en el equipo, no tu contribución',
      'Resultado vago ("salió bien")',
      'Historia demasiado larga o complicada',
      'Falta el desafío - solo compartió éxito'
    ],
    improvementTips: [
      'Comenzar with the challenge/problem clearly',
      'Use "I" not "we" for your actions',
      'Include a specific number or metric in the result'
    ]
  }
]

// Removed mock generateFeedback - now using real LLM API via useCoaching hook

export default function CoachPracticeRoomModule() {
  const router = useRouter()
  const { generateFeedback: callLLMCoach, feedback: llmFeedback, loading: coachLoading } = useCoaching()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [expandedSection, setExpandedSection] = useState<string | null>('intro')
  
  // Practice state
  const [answers, setAnswers] = useState<Record<string, { original: string; improved: string }>>({})
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [showingFeedback, setShowingFeedback] = useState<Record<string, boolean>>({})
  const [iterations, setIterations] = useState<Record<string, number>>({})

  const progress = Math.round((completedSteps.length / PRACTICE_SESSIONS.length) * 100)

  const submitAnswer = async (sessionId: string, answer: string, isImproved: boolean = false) => {
    if (!answer.trim()) return

    setAnswers(prev => ({
      ...prev,
      [sessionId]: isImproved 
        ? { ...prev[sessionId], improved: answer }
        : { original: answer, improved: '' }
    }))
    
    const session = PRACTICE_SESSIONS.find(s => s.id === sessionId)
    if (session) {
      // Call LLM API for real coaching feedback
      const result = await callLLMCoach({
        question: session.question,
        userResponse: answer,
        interviewType: 'behavioral',
        roleContext: 'Professional development - interview coaching practice'
      })

      if (result.success) {
        setFeedback(prev => ({ ...prev, [sessionId]: result.feedback }))
        setShowingFeedback(prev => ({ ...prev, [sessionId]: true }))
        setIterations(prev => ({ ...prev, [sessionId]: (prev[sessionId] || 0) + 1 }))
      }
    }
  }

  const completeSession = (index: number) => {
    if (!completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index])
    }
    if (index < PRACTICE_SESSIONS.length - 1) {
      setCurrentStep(index + 1)
      setExpandedSection(PRACTICE_SESSIONS[index + 1].id)
    }
  }

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/a3/save-module-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          moduleId: 'coach-practice-room', 
          status: 'completed',
          xpEarned: MODULE_XP,
          completedActivities: PRACTICE_SESSIONS.length
        })
      })
      if (!response.ok) throw new Error('Failed to save progress')
      router.push('/despega/a3?completed=coach-practice-room')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=coach-practice-room')
    }
  }

  const canComplete = (sessionId: string) => {
    return answers[sessionId]?.improved || (iterations[sessionId] || 0) >= 2
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/despega/a3">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to A3
            </Button>
          </Link>
          <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] border-[rgba(170,70,170,0.3)]">
            Module 6 • {MODULE_XP} XP
          </Badge>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[rgba(170,70,170,0.2)] flex items-center justify-center">
              <Users className="w-6 h-6 text-[rgb(170,70,170)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sala de Práctica del Coach</h1>
              <p className="text-white/60">Practice with feedback • Improve through iteration</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Practice your interview answers with structured feedback. 
            The goal is improvement, not perfection. Iterate until your answers feel natural.
          </p>
        </div>

        {/* Key Learning */}
        <Card className="rounded-[2px] bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)] p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[rgb(170,70,170)] mt-0.5" />
            <div>
              <p className="font-medium text-white">Key Learning</p>
              <p className="text-white/70 text-sm mt-1">
                Practice is not performance. The goal is to <span className="text-[rgb(170,70,170)]">notice what is unclear</span>, 
                too long, weak, or missing evidence. Each iteration makes your answer stronger.
                <span className="text-[rgb(170,70,170)]"> Repetition builds confidence.</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Practice Flow */}
        <Card className="rounded-[2px] bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-4">
          <p className="text-white/50 text-xs uppercase mb-3">Practice Loop</p>
          <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
            <span className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] px-3 py-1 rounded-full">1. Answer</span>
            <ArrowRight className="w-4 h-4 text-white/30" />
            <span className="bg-[rgba(80,160,170,0.2)] text-[rgb(80,160,170)] px-3 py-1 rounded-full">2. Feedback</span>
            <ArrowRight className="w-4 h-4 text-white/30" />
            <span className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] px-3 py-1 rounded-full">3. Improve</span>
            <RefreshCw className="w-4 h-4 text-white/30" />
          </div>
        </Card>

        {/* Progreso */}
        <Card className="rounded-[2px] bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progreso</span>
            <span className="text-[rgb(170,70,170)]">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
          <p className="text-white/50 text-sm mt-2">{completedSteps.length} of {PRACTICE_SESSIONS.length} practice sessions completed</p>
        </Card>

        {/* Practice Sessions */}
        {PRACTICE_SESSIONS.map((session, index) => (
          <Card 
            key={session.id}
            className={`rounded-[2px] p-6 transition-all ${
              completedSteps.includes(index) 
                ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
                : currentStep === index 
                  ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
                  : 'bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10'
            }`}
          >
            <button 
              onClick={() => setExpandedSection(expandedSection === session.id ? null : session.id)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  completedSteps.includes(index) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
                }`}>
                  {completedSteps.includes(index) ? <CheckCircle2 className="w-5 h-5" /> : <span>{index + 1}</span>}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">{session.question}</h3>
                  <p className="text-white/50 text-sm">
                    {iterations[session.id] ? `${iterations[session.id]} attempt(s)` : 'Not started'}
                  </p>
                </div>
              </div>
              {expandedSection === session.id ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
            </button>
            
            {expandedSection === session.id && (
              <div className="mt-6 space-y-4">
                {/* Coach prompt */}
                <div className="flex items-start gap-3 bg-[rgba(170,70,170,0.1)] border border-[rgba(170,70,170,0.3)] rounded-lg p-4">
                  <MessageCircle className="w-5 h-5 text-[rgb(170,70,170)] mt-0.5" />
                  <div>
                    <p className="text-[rgb(170,70,170)] text-xs uppercase font-medium">Coach</p>
                    <p className="text-white/80 text-sm mt-1">{session.coachPrompt}</p>
                  </div>
                </div>
                
                {/* Criteria to hit */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {session.feedbackCriteria.map((criteria) => {
                    const score = feedback[session.id]?.scores.find(s => s.id === criteria.id)?.score
                    return (
                      <div 
                        key={criteria.id}
                        className={`p-2 rounded-lg text-center ${
                          score === 'good' ? 'bg-green-500/20 border border-green-500/30' :
                          score === 'needs-work' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                          score === 'missing' ? 'bg-red-500/20 border border-red-500/30' :
                          'bg-[rgba(80,160,170,0.2)] border border-[rgb(80,160,170)]/10'
                        }`}
                      >
                        <p className="text-white text-xs font-medium">{criteria.label}</p>
                        <p className="text-white/50 text-xs">{criteria.description}</p>
                      </div>
                    )
                  })}
                </div>
                
                {/* Answer input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-white/70 text-sm">Your Answer</label>
                    {iterations[session.id] > 0 && (
                      <Badge className="bg-[rgba(80,160,170,0.2)] text-[rgb(80,160,170)]">
                        Attempt {iterations[session.id]}
                      </Badge>
                    )}
                  </div>
                  <textarea
                    value={showingFeedback[session.id] ? (answers[session.id]?.improved || answers[session.id]?.original || '') : (answers[session.id]?.original || '')}
                    onChange={(e) => {
                      if (showingFeedback[session.id]) {
                        setAnswers(prev => ({
                          ...prev,
                          [session.id]: { ...prev[session.id], improved: e.target.value }
                        }))
                      } else {
                        setAnswers(prev => ({
                          ...prev,
                          [session.id]: { original: e.target.value, improved: '' }
                        }))
                      }
                    }}
                    placeholder="Write your answer here..."
                    className="w-full bg-[rgba(80,160,170,0.2)] border border-[rgb(80,160,170)]/20 rounded-lg p-4 text-white placeholder:text-white/30 min-h-32"
                  />
                </div>
                
                {/* Feedback display */}
                {showingFeedback[session.id] && feedback[session.id] && (
                  <div className="space-y-3 border-t border-[rgb(80,160,170)]/10 pt-4">
                    <p className="text-white font-medium flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[rgb(170,70,170)]" />
                      Coach Feedback
                    </p>
                    
                    {/* Fortalezas */}
                    {feedback[session.id].strengths.length > 0 && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <p className="text-green-400 text-xs uppercase font-medium mb-2 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" /> Fortalezas
                        </p>
                        <ul className="space-y-1">
                          {feedback[session.id].strengths.map((s, i) => (
                            <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                              <span className="text-green-400">+</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Issues */}
                    {feedback[session.id].issues.length > 0 && (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                        <p className="text-yellow-400 text-xs uppercase font-medium mb-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Areas to Improve
                        </p>
                        <ul className="space-y-1">
                          {feedback[session.id].issues.map((issue, i) => (
                            <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                              <span className="text-yellow-400">!</span> {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Suggestion */}
                    <div className="bg-[rgba(170,70,170,0.1)] border border-[rgba(170,70,170,0.3)] rounded-lg p-3">
                      <p className="text-[rgb(170,70,170)] text-xs uppercase font-medium mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Suggestion
                      </p>
                      <p className="text-white/70 text-sm">{feedback[session.id].suggestion}</p>
                    </div>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  {!showingFeedback[session.id] ? (
                    <Button 
                      onClick={() => submitAnswer(session.id, answers[session.id]?.original || '')}
                      disabled={!answers[session.id]?.original || answers[session.id]?.original.length < 30}
                      className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
                    >
                      Get Feedback
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowingFeedback(prev => ({ ...prev, [session.id]: false }))
                          setAnswers(prev => ({
                            ...prev,
                            [session.id]: { original: '', improved: '' }
                          }))
                        }}
                        className="border-[rgba(170,70,170,0.3)] text-[rgb(170,70,170)]"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Comenzar Over
                      </Button>
                      <Button 
                        onClick={() => submitAnswer(session.id, answers[session.id]?.improved || answers[session.id]?.original || '', true)}
                        disabled={!(answers[session.id]?.improved) || answers[session.id]?.improved === answers[session.id]?.original}
                        className="rounded-[20px] bg-[rgba(80,160,170,1)] hover:bg-[rgba(80,160,170,0.8)] disabled:opacity-50"
                      >
                        Resubmit Improved Answer
                        <RefreshCw className="w-4 h-4 ml-2" />
                      </Button>
                    </>
                  )}
                  
                  {canComplete(session.id) && (
                    <Button 
                      onClick={() => completeSession(index)}
                      className="rounded-[20px] bg-green-600 hover:bg-green-700 ml-auto"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save & Play
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}

        {/* Complete Module */}
        {completedSteps.length === PRACTICE_SESSIONS.length && (
          <Card className="rounded-[2px] bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)] p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[rgb(200,130,200)] mx-auto" />
            <h3 className="text-xl font-bold text-white">Coach Practice Complete!</h3>
            <p className="text-white/70">
              You&apos;ve practiced {PRACTICE_SESSIONS.length} key questions with feedback. Earned {MODULE_XP} XP!
            </p>
            <div className="bg-[rgba(80,160,170,0.2)] rounded-lg p-4 text-left">
              <p className="text-white/70 text-sm mb-2">Total practice iterations:</p>
              <div className="flex gap-4">
                {PRACTICE_SESSIONS.map(session => (
                  <div key={session.id} className="text-center">
                    <p className="text-[rgb(170,70,170)] text-xl font-bold">{iterations[session.id] || 0}</p>
                    <p className="text-white/50 text-xs">{session.question.split(' ').slice(0, 3).join(' ')}...</p>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={handleComplete} className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]">
              Play to Gimnasio de Comunicación
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
