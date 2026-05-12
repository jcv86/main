'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, ArrowLeft, CheckCircle2, Video, Clock, AlertCircle,
  Lightbulb, User, MessageSquare, Mic, ChevronRight, Star, Award
} from 'lucide-react'

const MODULE_XP = 160

// Full interview script with questions and guidance
const INTERVIEW_SCRIPT = [
  {
    id: 'greeting',
    stage: 'Apertura',
    question: 'Hi! Thank you for joining. How are you today?',
    guidance: 'Keep it brief and professional. A simple "I\'m doing well, thank you for having me" works perfectly.',
    timeLimit: 15,
    evaluates: ['Professionalism', 'First impression']
  },
  {
    id: 'intro',
    stage: 'Introduction',
    question: 'Great! Let\'s start. Tell me about yourself.',
    guidance: 'Use your prepared 30-second self-introduction. Professional identity → Key skills → Career goal.',
    timeLimit: 45,
    evaluates: ['Structure', 'Relevance', 'Confidence']
  },
  {
    id: 'cv',
    stage: 'CV Review',
    question: 'I see you worked at [Anterior Company]. What was your main responsibility there?',
    guidance: 'Focus on your most relevant experience. Use specific examples and mention results if possible.',
    timeLimit: 60,
    evaluates: ['Experience clarity', 'Specificity', 'Achievement focus']
  },
  {
    id: 'motivation',
    stage: 'Motivation',
    question: 'Why are you interested in this role / company?',
    guidance: 'Show you researched the company. Connect their mission to your career goals.',
    timeLimit: 45,
    evaluates: ['Research', 'Genuine interest', 'Career alignment']
  },
  {
    id: 'strengths',
    stage: 'Fortalezas',
    question: 'What would you say are your greatest strengths?',
    guidance: 'Pick 1-2 strengths relevant to the role. Support with a brief example.',
    timeLimit: 45,
    evaluates: ['Self-awareness', 'Role relevance', 'Evidence']
  },
  {
    id: 'behavioral',
    stage: 'Behavioral',
    question: 'Tell me about a time you worked on a challenging project or solved a problem.',
    guidance: 'Use STAR format. Focus on YOUR actions and the measurable result.',
    timeLimit: 90,
    evaluates: ['STAR structure', 'Personal contribution', 'Results']
  },
  {
    id: 'candidate-question',
    stage: 'Your Turn',
    question: 'Do you have any questions for me about the role or company?',
    guidance: 'Ask 1-2 thoughtful questions. About the team, growth, or day-to-day responsibilities.',
    timeLimit: 60,
    evaluates: ['Preparation', 'Genuine curiosity', 'Professionalism']
  },
  {
    id: 'closing',
    stage: 'Cierre',
    question: 'Thank you for your time. We\'ll be in touch with next steps.',
    guidance: 'Thank them genuinely. Express continued interest. End confidently.',
    timeLimit: 15,
    evaluates: ['Professionalism', 'Enthusiasm', 'Closing strength']
  }
]

// Pre-simulation checklist
const PRE_CHECKLIST = [
  { id: 'quiet', text: 'Estoy en un ambiente tranquilo' },
  { id: 'camera', text: 'Mi cámara/micrófono funciona' },
  { id: 'notes', text: 'Tengo mis respuestas preparadas cerca (opcional)' },
  { id: 'ready', text: 'Estoy listo para practicar como si fuera real' }
]

// Good questions to ask
const GOOD_PREGUNTAS_TO_ASK = [
  'What does a typical day look like in this role?',
  'How would you describe the team I would be working with?',
  'What are the main goals for this position in the first 90 days?',
  'What opportunities for growth exist in this role?',
  'How would you describe the company culture?'
]

export default function FirstRecruiterSimulationModule() {
  const router = useRouter()
  const [currentStage, setCurrentStage] = useState(-1) // -1 = pre-interview
  const [simulationComenzared, setSimulationComenzared] = useState(false)
  const [preChecklist, setPreChecklist] = useState<string[]>([])
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [showingGuidance, setShowingGuidance] = useState<string | null>(null)
  const [selfRatings, setSelfRatings] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  const progress = currentStage < 0 ? 0 : Math.round(((currentStage + 1) / INTERVIEW_SCRIPT.length) * 100)

  const togglePreChecklist = (id: string) => {
    setPreChecklist(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const startSimulation = () => {
    setSimulationComenzared(true)
    setCurrentStage(0)
  }

  const submitResponse = (questionId: string, response: string) => {
    setResponses(prev => ({ ...prev, [questionId]: response }))
  }

  const rateResponse = (questionId: string, rating: number) => {
    setSelfRatings(prev => ({ ...prev, [questionId]: rating }))
  }

  const nextQuestion = () => {
    if (currentStage < INTERVIEW_SCRIPT.length - 1) {
      setCurrentStage(currentStage + 1)
      setShowingGuidance(null)
    } else {
      setShowResults(true)
    }
  }

  const calculateOverallScore = () => {
    const ratings = Object.values(selfRatings)
    if (ratings.length === 0) return 0
    return Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 20) // Convert 1-5 to percentage
  }

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/a3/save-module-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          moduleId: 'first-recruiter-simulation', 
          status: 'completed',
          xpEarned: MODULE_XP
        })
      })
      if (!response.ok) throw new Error('Failed to save progress')
      router.push('/despega/a3?completed=first-recruiter-simulation')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=first-recruiter-simulation')
    }
  }

  const currentQuestion = INTERVIEW_SCRIPT[currentStage]

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
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <Video className="w-3 h-3 mr-1" />
              Live Simulation
            </Badge>
            <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] border-[rgba(170,70,170,0.3)]">
              Module 8 • {MODULE_XP} XP
            </Badge>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Video className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Primera Simulación con Reclutador</h1>
              <p className="text-white/60">Your first real practice interview • 8-12 minutes</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            This is your first checkpoint. Complete a short recruiter-style interview 
            and receive a readiness assessment. The goal is practice, not perfection.
          </p>
        </div>

        {/* Key Learning */}
        <Card className="rounded-[2px] bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)] p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[rgb(170,70,170)] mt-0.5" />
            <div>
              <p className="font-medium text-white">Key Learning</p>
              <p className="text-white/70 text-sm mt-1">
                The first simulation is <span className="text-[rgb(170,70,170)]">always uncomfortable</span> - that&apos;s normal. 
                Your goal is to complete it, not to be perfect. Each practice makes the next one easier.
                <span className="text-[rgb(170,70,170)]"> Done is better than perfect.</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Interview Details */}
        <Card className="rounded-[2px] bg-white/5 border-white/10 p-4">
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-white/40 text-xs uppercase">Interviewer Style</p>
              <p className="text-white font-medium flex items-center justify-center gap-1">
                <User className="w-4 h-4" /> Reclutador / RRHH
              </p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase">Difficulty</p>
              <p className="text-green-400 font-medium">Simple</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase">Questions</p>
              <p className="text-white font-medium">{INTERVIEW_SCRIPT.length} total</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase">Duration</p>
              <p className="text-white font-medium flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" /> 8-12 min
              </p>
            </div>
          </div>
        </Card>

        {/* Progreso */}
        <Card className="rounded-[2px] bg-white/5 border-white/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progreso de la Entrevista</span>
            <span className="text-[rgb(170,70,170)]">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
          <p className="text-xs text-white/50 mt-2">
            {currentStage < 0 ? 'Configuración previa a la entrevista' : 
             currentStage < INTERVIEW_SCRIPT.length ? `Question ${currentStage + 1} of ${INTERVIEW_SCRIPT.length}: ${currentQuestion?.stage}` :
             'Interview complete'}
          </p>
        </Card>

        {/* Pre-interview Setup */}
        {!simulationComenzared && (
          <Card className="rounded-[2px] bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)] p-6 space-y-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-[rgb(170,70,170)] mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white">Lista de Verificación Previa a la Entrevista</h3>
              <p className="text-white/60 text-sm mt-1">
                Verifica estos elementos antes de comenzar tu simulación
              </p>
            </div>
            
            <div className="space-y-3">
              {PRE_CHECKLIST.map((item) => (
                <button
                  key={item.id}
                  onClick={() => togglePreChecklist(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    preChecklist.includes(item.id)
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-white/5 border border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${
                    preChecklist.includes(item.id) ? 'bg-green-500 text-white' : 'border border-white/30'
                  }`}>
                    {preChecklist.includes(item.id) && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className="text-white/80 text-sm">{item.text}</span>
                </button>
              ))}
            </div>
            
            {/* Interview structure preview */}
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/50 text-xs uppercase mb-3">Interview Flow</p>
              <div className="flex flex-wrap gap-2">
                {INTERVIEW_SCRIPT.map((q, i) => (
                  <Badge key={i} className="bg-white/10 text-white/60">
                    {i + 1}. {q.stage}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={startSimulation}
              disabled={preChecklist.length < 2}
              className="w-full rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
            >
              Comenzar Interview Simulation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}

        {/* Active Interview */}
        {simulationComenzared && currentQuestion && !showResults && (
          <Card className="rounded-[2px] bg-white/5 border-white/10 p-6 space-y-6">
            {/* Stage indicator */}
            <div className="flex items-center justify-between">
              <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)]">
                {currentQuestion.stage}
              </Badge>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <Clock className="w-4 h-4" />
                Target: {currentQuestion.timeLimit}s
              </div>
            </div>
            
            {/* Interviewer question */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[rgba(170,70,170,0.2)] flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-[rgb(170,70,170)]" />
              </div>
              <div className="flex-1">
                <p className="text-[rgb(170,70,170)] text-xs uppercase mb-1">Interviewer</p>
                <p className="text-white text-lg">&quot;{currentQuestion.question}&quot;</p>
              </div>
            </div>
            
            {/* Guidance toggle */}
            <button
              onClick={() => setShowingGuidance(showingGuidance === currentQuestion.id ? null : currentQuestion.id)}
              className="text-[rgb(80,160,170)] text-sm flex items-center gap-1 hover:underline"
            >
              <Lightbulb className="w-4 h-4" />
              {showingGuidance === currentQuestion.id ? 'Hide guidance' : 'Show guidance'}
            </button>
            
            {showingGuidance === currentQuestion.id && (
              <div className="bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.3)] rounded-lg p-4">
                <p className="text-[rgb(80,160,170)] text-sm mb-2"><strong>Guidance:</strong> {currentQuestion.guidance}</p>
                <p className="text-white/50 text-xs">Evaluates: {currentQuestion.evaluates.join(', ')}</p>
                
                {currentQuestion.id === 'candidate-question' && (
                  <div className="mt-3 pt-3 border-t border-[rgba(80,160,170,0.3)]">
                    <p className="text-white/70 text-xs uppercase mb-2">Good questions to ask:</p>
                    <ul className="space-y-1">
                      {GOOD_PREGUNTAS_TO_ASK.map((q, i) => (
                        <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-[rgb(80,160,170)] mt-0.5 flex-shrink-0" />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Response area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-white/70 text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Your Response
                </label>
                <Button variant="outline" size="sm" className="border-[rgba(170,70,170,0.3)] text-[rgb(170,70,170)]">
                  <Mic className="w-4 h-4 mr-1" />
                  Practice Aloud
                </Button>
              </div>
              <textarea
                value={responses[currentQuestion.id] || ''}
                onChange={(e) => submitResponse(currentQuestion.id, e.target.value)}
                placeholder="Type your answer here (or practice aloud and summarize)..."
                className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder:text-white/30 min-h-24"
              />
            </div>
            
            {/* Self-rating */}
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/70 text-sm mb-3">How did that answer feel?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => rateResponse(currentQuestion.id, rating)}
                    className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                      selfRatings[currentQuestion.id] === rating
                        ? 'bg-[rgba(170,70,170,0.3)] text-[rgb(170,70,170)] border border-[rgba(170,70,170,0.5)]'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {rating === 1 ? 'Rough' : rating === 2 ? 'Okay' : rating === 3 ? 'Good' : rating === 4 ? 'Strong' : 'Great'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Siguiente button */}
            <Button 
              onClick={nextQuestion}
              disabled={!responses[currentQuestion.id] || !selfRatings[currentQuestion.id]}
              className="w-full rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
            >
              {currentStage < INTERVIEW_SCRIPT.length - 1 ? 'Siguiente Question' : 'Complete Interview'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}

        {/* Results */}
        {showResults && (
          <Card className="rounded-[2px] bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)] p-6 space-y-6">
            <div className="text-center">
              <Award className="w-16 h-16 text-[rgb(170,70,170)] mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">First Simulation Complete!</h3>
              <p className="text-white/60 mt-1">
                You did it! Here&apos;s your self-assessment summary.
              </p>
            </div>
            
            {/* Overall score */}
            <div className="text-center py-4">
              <div className="w-24 h-24 rounded-full bg-[rgba(170,70,170,0.2)] flex items-center justify-center mx-auto">
                <span className="text-3xl font-bold text-[rgb(170,70,170)]">{calculateOverallScore()}%</span>
              </div>
              <p className="text-white/50 text-sm mt-2">Self-Assessed Comfort Level</p>
            </div>
            
            {/* Question breakdown */}
            <div className="space-y-2">
              <p className="text-white/70 text-sm">Your ratings by question:</p>
              {INTERVIEW_SCRIPT.map((q, i) => (
                <div key={q.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <span className="text-white/80 text-sm">{i + 1}. {q.stage}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${selfRatings[q.id] >= star ? 'text-[rgb(170,70,170)] fill-[rgb(170,70,170)]' : 'text-white/20'}`} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Key takeaway */}
            <div className="bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.3)] rounded-lg p-4">
              <p className="text-[rgb(80,160,170)] text-sm">
                <strong>Remember:</strong> The first simulation is always the hardest. 
                You&apos;ve now experienced the full flow. The next one will feel more familiar.
              </p>
            </div>
            
            <Button onClick={handleComplete} className="w-full rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]">
              Play to Laboratorio de Preguntas Difíciles y de Riesgo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
