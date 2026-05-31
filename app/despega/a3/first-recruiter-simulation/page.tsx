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
import { InterviewThreeColumnLayout } from '@/components/interview-three-column-layout'
import { CameraMicrophoneTest } from '@/components/camera-microphone-test'

const MODULE_XP = 160

// Full interview script with questions and guidance
const INTERVIEW_SCRIPT = [
  {
    id: 'greeting',
    stage: 'Apertura',
    question: '¡Hola! Gracias por venir. ¿Cómo estás hoy?',
    guidance: 'Mantén una respuesta breve y profesional. "Estoy bien, gracias por recibirme" funciona perfectamente.',
    timeLimit: 15,
    evaluates: ['Profesionalismo', 'Primera impresión']
  },
  {
    id: 'intro',
    stage: 'Introducción',
    question: '¡Perfecto! Comencemos. Cuéntame sobre ti.',
    guidance: 'Usa tu introducción preparada de 30 segundos. Identidad profesional → Habilidades clave → Objetivo de carrera.',
    timeLimit: 45,
    evaluates: ['Estructura', 'Relevancia', 'Confianza']
  },
  {
    id: 'cv',
    stage: 'Revisión de CV',
    question: 'Veo que trabajaste en [Empresa Anterior]. ¿Cuál era tu principal responsabilidad?',
    guidance: 'Enfócate en tu experiencia más relevante. Usa ejemplos específicos y menciona resultados si es posible.',
    timeLimit: 60,
    evaluates: ['Claridad de experiencia', 'Especificidad', 'Enfoque en logros']
  },
  {
    id: 'motivation',
    stage: 'Motivación',
    question: '¿Por qué te interesa este puesto / empresa?',
    guidance: 'Demuestra que investigaste la empresa. Conecta su misión con tus objetivos de carrera.',
    timeLimit: 45,
    evaluates: ['Investigación', 'Interés genuino', 'Alineación de carrera']
  },
  {
    id: 'strengths',
    stage: 'Fortalezas',
    question: '¿Cuáles dirías que son tus mayores fortalezas?',
    guidance: 'Elige 1-2 fortalezas relevantes para el puesto. Apoya con un breve ejemplo.',
    timeLimit: 45,
    evaluates: ['Autoconocimiento', 'Relevancia del puesto', 'Evidencia']
  },
  {
    id: 'behavioral',
    stage: 'Conductual',
    question: 'Cuéntame sobre un momento en que trabajaste en un proyecto desafiante o resolviste un problema.',
    guidance: 'Usa el formato STAR. Enfócate en TUS acciones y en el resultado medible.',
    timeLimit: 90,
    evaluates: ['Estructura STAR', 'Contribución personal', 'Resultados']
  },
  {
    id: 'candidate-question',
    stage: 'Tu Turno',
    question: '¿Tienes alguna pregunta sobre el puesto o la empresa?',
    guidance: 'Haz 1-2 preguntas reflexivas. Sobre el equipo, crecimiento, o responsabilidades diarias.',
    timeLimit: 60,
    evaluates: ['Preparación', 'Curiosidad genuina', 'Profesionalismo']
  },
  {
    id: 'closing',
    stage: 'Cierre',
    question: 'Gracias por tu tiempo. Nos pondremos en contacto con los próximos pasos.',
    guidance: 'Agradéceles genuinamente. Expresa interés continuo. Termina con confianza.',
    timeLimit: 15,
    evaluates: ['Profesionalismo', 'Entusiasmo', 'Fortaleza del cierre']
  }
]

// Pre-simulation checklist
const PRE_CHECKLIST = [
  { id: 'quiet', text: 'Estoy en un ambiente tranquilo' },
  { id: 'camera', text: 'Mi cámara/micrófono funciona' },
  { id: 'notes', text: 'Tengo mis respuestas preparadas cerca (opcional)' },
  { id: 'ready', text: 'Estoy listo para practicar como si fuera real' }
]

// Preguntas buenas para hacer
const GOOD_PREGUNTAS_TO_ASK = [
  '¿Cómo es un día típico en este puesto?',
  '¿Cómo describirías el equipo con el que trabajaría?',
  '¿Cuáles son los principales objetivos para esta posición en los primeros 90 días?',
  '¿Qué oportunidades de crecimiento existen en este rol?',
  '¿Cómo describirías la cultura de la empresa?'
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
  const [showCameraTest, setShowCameraTest] = useState(false)

  const progress = currentStage < 0 ? 0 : Math.round(((currentStage + 1) / INTERVIEW_SCRIPT.length) * 100)

  const togglePreChecklist = (id: string) => {
    if (id === 'camera' && !preChecklist.includes(id)) {
      // Open camera test modal when camera checkbox is clicked
      setShowCameraTest(true)
    } else {
      setPreChecklist(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      )
    }
  }

  const handleCameraTestComplete = (passed: boolean) => {
    setShowCameraTest(false)
    if (passed) {
      // Add camera to checklist if test passed
      setPreChecklist(prev => [...prev, 'camera'])
    }
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
        <Card className="rounded-[2px] bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-4">
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
        <Card className="rounded-[2px] bg-[rgba(80,160,170,0.2)] border-[rgb(80,160,170)]/10 p-4">
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
                      : 'bg-[rgba(80,160,170,0.2)] border border-[rgb(80,160,170)]/10 hover:border-[rgb(80,160,170)]/30'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${
                    preChecklist.includes(item.id) ? 'bg-green-500 text-white' : 'border border-[rgb(80,160,170)]/30'
                  }`}>
                    {preChecklist.includes(item.id) && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className="text-white/80 text-sm">{item.text}</span>
                </button>
              ))}
            </div>
            
            {/* Interview structure preview */}
            <div className="bg-[rgba(80,160,170,0.2)] rounded-lg p-4">
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

        {/* Active Interview - 3 Column Layout */}
        {simulationComenzared && currentQuestion && !showResults && (
          <InterviewThreeColumnLayout
            question={currentQuestion.question}
            stageName={currentQuestion.stage}
            targetTime={currentQuestion.timeLimit}
            onAnswer={(text) => submitResponse(currentQuestion.id, text)}
            onQualityRating={(rating) => rateResponse(currentQuestion.id, rating)}
            onNext={nextQuestion}
            currentIndex={currentStage}
            totalQuestions={INTERVIEW_SCRIPT.length}
            showGuidance={showingGuidance === currentQuestion.id}
            guidanceText={currentQuestion.guidance}
          />
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
                <div key={q.id} className="flex items-center justify-between bg-[rgba(80,160,170,0.2)] rounded-lg p-3">
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

        {/* Camera/Microphone Test Modal */}
        <CameraMicrophoneTest
          isOpen={showCameraTest}
          onClose={() => setShowCameraTest(false)}
          onTestComplete={handleCameraTestComplete}
        />
      </div>
    </div>
  )
}
