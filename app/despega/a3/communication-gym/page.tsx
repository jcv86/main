'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, ArrowLeft, CheckCircle2, Mic, Lightbulb, Video,
  ChevronDown, ChevronUp, Play, Pause, Volume2, Timer, 
  RotateCcw, Zap, Target, AlertCircle
} from 'lucide-react'

const MODULE_XP = 140

// Communication drills with specific exercises
const COMMUNICATION_DRILLS = [
  {
    id: 'intro-30',
    title: 'Record 30-second Self-Introduction',
    type: 'recording',
    timeLimit: 30,
    instruction: 'Introduce yourself professionally in exactly 30 seconds. Practice until you hit the time naturally.',
    criteria: [
      'Comenzars with professional identity',
      'Mentions 2-3 relevant skills',
      'Ends with career goal',
      'Stays within 30 seconds'
    ],
    tips: [
      'Practice until 30 seconds feels natural',
      'Speak at a moderate pace - not rushed',
      'End confidently, not trailing off'
    ]
  },
  {
    id: 'pause-drill',
    title: 'Completar Ejercicio de Pausa',
    type: 'exercise',
    instruction: 'Lee el mensaje, luego haz una pausa de 2-3 segundos antes de responder. La pausa muestra confianza y te permite pensar.',
    prompts: [
      { question: '¿Cuál es tu mayor fortaleza?', pauseSeconds: 3 },
      { question: 'Cuéntame sobre un desafío que superaste.', pauseSeconds: 3 },
      { question: '¿Por qué deberíamos contratarte?', pauseSeconds: 3 }
    ],
    tips: [
      'Una pausa NO es incómoda - muestra reflexión',
      'Usa la pausa para estructurar tu respuesta mentalmente',
      'Comienza con el punto principal después de la pausa'
    ]
  },
  {
    id: 'motivation-45',
    title: 'Grabar Respuesta de Motivación de 45 segundos',
    type: 'recording',
    timeLimit: 45,
    instruction: 'Answer "Why do you want to work here?" in 45 seconds. Be specific about the company.',
    criteria: [
      'Mentions something specific about company',
      'Connects to personal career goals',
      'Shows genuine enthusiasm',
      'Stays within 45 seconds'
    ],
    tips: [
      'Research the company before recording',
      'Avoid generic phrases ("great culture")',
      'Show what you will contribute'
    ]
  },
  {
    id: 'delivery-feedback',
    title: 'Autoevaluar Calidad de Entrega',
    type: 'assessment',
    instruction: 'Review your recordings and rate yourself on these delivery aspects.',
    aspects: [
      { id: 'pace', label: 'Speaking Pace', description: 'Ni demasiado rápido, ni demasiado lento', options: ['Demasiado rápido', 'Justo bien', 'Demasiado lento'] },
      { id: 'volume', label: 'Volume & Clarity', description: 'Easy to hear and understand', options: ['Too quiet', 'Limpiar', 'Too loud'] },
      { id: 'filler', label: 'Filler Words', description: 'Um, uh, como, ya sabes', options: ['Muchos rellenos', 'Algunos rellenos', 'Pocos/ninguno'] },
      { id: 'confidence', label: 'Confidence', description: 'Voice sounds assured', options: ['Uncertain', 'Moderate', 'Confident'] },
      { id: 'ending', label: 'Answer Ending', description: 'Finishes strongly', options: ['Trails off', 'Adequate', 'Strong close'] }
    ],
    tips: [
      'Be honest - this is for your improvement',
      'Focus on 1-2 areas to improve next',
      'Small changes make big differences'
    ]
  },
  {
    id: 'improvement-round',
    title: 'Re-record with Improvements',
    type: 'recording',
    timeLimit: 45,
    instruction: 'Based on your self-assessment, record an improved version focusing on your weakest area.',
    criteria: [
      'Applied feedback from assessment',
      'Noticeably improved from first attempt',
      'More confident delivery',
      'Natural pacing with pauses'
    ],
    tips: [
      'Focus on ONE improvement at a time',
      'It is normal to need 3-5 attempts',
      'Progreso > perfection'
    ]
  }
]

// Speaking patterns for reference
const SPEAKING_PATTERNS = [
  { step: 1, label: 'Escuchar', description: 'Fully hear the question' },
  { step: 2, label: 'Pause', description: '2-3 seconds to think' },
  { step: 3, label: 'Main idea', description: 'Lead with your point' },
  { step: 4, label: 'Example', description: 'Support with evidence' },
  { step: 5, label: 'X', description: 'End clearly and confidently' }
]

export default function CommunicationGymModule() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [expandedSection, setExpandedSection] = useState<string | null>('intro-30')
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordings, setRecordings] = useState<Record<string, number>>({})
  
  // Pause drill state
  const [pauseStep, setPauseStep] = useState(0)
  const [isPausing, setIsPausing] = useState(false)
  const [pauseTimer, setPauseTimer] = useState(0)
  
  // Assessment state
  const [assessments, setAssessments] = useState<Record<string, string>>({})
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const progress = Math.round((completedSteps.length / COMMUNICATION_DRILLS.length) * 100)

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording])

  const startRecording = (drillId: string) => {
    setIsRecording(true)
    setRecordingTime(0)
  }

  const stopRecording = (drillId: string) => {
    setIsRecording(false)
    setRecordings(prev => ({ ...prev, [drillId]: recordingTime }))
  }

  const startPauseDrill = () => {
    setIsPausing(true)
    setPauseTimer(3)
    const interval = setInterval(() => {
      setPauseTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsPausing(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const completeDrill = (index: number) => {
    if (!completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index])
    }
    if (index < COMMUNICATION_DRILLS.length - 1) {
      setCurrentStep(index + 1)
      setExpandedSection(COMMUNICATION_DRILLS[index + 1].id)
    }
  }

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/a3/save-module-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          moduleId: 'communication-gym', 
          status: 'completed',
          xpEarned: MODULE_XP,
          completedActivities: COMMUNICATION_DRILLS.length
        })
      })
      if (!response.ok) throw new Error('Failed to save progress')
      router.push('/despega/a3?completed=communication-gym')
    } catch (error) {
      console.error('Error completing module:', error)
      router.push('/despega/a3?completed=communication-gym')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const canCompleteDrill = (drill: typeof COMMUNICATION_DRILLS[0]) => {
    if (drill.type === 'recording') return recordings[drill.id] && recordings[drill.id] > 10
    if (drill.type === 'exercise') return pauseStep >= 3
    if (drill.type === 'assessment') return Object.keys(assessments).length >= 5
    return true
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
          <div className="flex items-center gap-2">
            <Badge className="bg-[rgba(80,160,170,0.2)] text-[rgb(80,160,170)] border-[rgba(80,160,170,0.4)]">
              <Mic className="w-3 h-3 mr-1" />
              Voice Drills
            </Badge>
            <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] border-[rgba(170,70,170,0.3)]">
              Module 7 • {MODULE_XP} XP
            </Badge>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[rgba(170,70,170,0.2)] flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-[rgb(170,70,170)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Gimnasio de Comunicación</h1>
              <p className="text-white/60">Voice training • Delivery drills • Confidence building</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl">
            Train your voice, pacing, pauses, and delivery. A good answer loses impact with poor delivery.
            These drills build the muscle memory for confident speaking.
          </p>
        </div>

        {/* Key Learning */}
        <Card className="rounded-[2px] bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)] p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[rgb(170,70,170)] mt-0.5" />
            <div>
              <p className="font-medium text-white">Key Learning</p>
              <p className="text-white/70 text-sm mt-1">
                Speaking clearly is a <span className="text-[rgb(170,70,170)]">skill that improves with practice</span>. 
                A great answer can lose power if delivered too fast, too quiet, or without confidence. 
                <span className="text-[rgb(170,70,170)]"> Strategic pauses create control and presence.</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Speaking Pattern */}
        <Card className="rounded-[2px] bg-white/5 border-white/10 p-4">
          <p className="text-white/50 text-xs uppercase mb-4">Better Speaking Pattern</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SPEAKING_PATTERNS.map((pattern, i) => (
              <div key={pattern.step} className="flex items-center gap-2">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[rgba(170,70,170,0.2)] flex items-center justify-center mx-auto mb-1">
                    <span className="text-[rgb(170,70,170)] font-bold">{pattern.step}</span>
                  </div>
                  <p className="text-white text-xs font-medium">{pattern.label}</p>
                  <p className="text-white/40 text-xs">{pattern.description}</p>
                </div>
                {i < SPEAKING_PATTERNS.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-white/20 mx-1" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Progreso */}
        <Card className="rounded-[2px] bg-white/5 border-white/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Progreso</span>
            <span className="text-[rgb(170,70,170)]">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
          <p className="text-white/50 text-sm mt-2">{completedSteps.length} of {COMMUNICATION_DRILLS.length} drills completed</p>
        </Card>

        {/* Drills */}
        {COMMUNICATION_DRILLS.map((drill, index) => (
          <Card 
            key={drill.id}
            className={`rounded-[2px] p-6 transition-all ${
              completedSteps.includes(index) 
                ? 'bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)]' 
                : currentStep === index 
                  ? 'bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)]'
                  : 'bg-white/5 border-white/10'
            }`}
          >
            <button 
              onClick={() => setExpandedSection(expandedSection === drill.id ? null : drill.id)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  completedSteps.includes(index) ? 'bg-[rgba(170,70,170,0.2)] text-[rgb(200,130,200)]' : 'bg-white/10 text-white/50'
                }`}>
                  {completedSteps.includes(index) ? <CheckCircle2 className="w-5 h-5" /> : <span>{index + 1}</span>}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">{drill.title}</h3>
                  <p className="text-white/50 text-sm">
                    {drill.type === 'recording' && `${drill.timeLimit}s recording`}
                    {drill.type === 'exercise' && 'Práctica de pausa'}
                    {drill.type === 'assessment' && 'Autoevaluación'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {drill.type === 'recording' && recordings[drill.id] && (
                  <Badge className="bg-green-500/20 text-green-400">
                    Recorded: {formatTime(recordings[drill.id])}
                  </Badge>
                )}
                {expandedSection === drill.id ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
              </div>
            </button>
            
            {expandedSection === drill.id && (
              <div className="mt-6 space-y-4">
                {/* Instruction */}
                <div className="bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.3)] rounded-lg p-3">
                  <p className="text-white/80 text-sm">{drill.instruction}</p>
                </div>
                
                {/* Recording drill */}
                {drill.type === 'recording' && (
                  <>
                    {/* Criteria */}
                    <div className="grid md:grid-cols-2 gap-2">
                      {drill.criteria?.map((criterion, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                          <Target className="w-4 h-4 text-[rgb(170,70,170)]" />
                          <span className="text-white/70 text-sm">{criterion}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Recording interface */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
                      {isRecording ? (
                        <div className="space-y-4">
                          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto animate-pulse">
                            <Mic className="w-10 h-10 text-red-400" />
                          </div>
                          <p className="text-white text-2xl font-mono">{formatTime(recordingTime)}</p>
                          <p className="text-white/50 text-sm">
                            {drill.timeLimit && recordingTime > drill.timeLimit && (
                              <span className="text-yellow-400">Over time limit!</span>
                            )}
                          </p>
                          <Button 
                            onClick={() => stopRecording(drill.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <Pause className="w-4 h-4 mr-2" />
                            Stop Recording
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-20 h-20 rounded-full bg-[rgba(170,70,170,0.2)] flex items-center justify-center mx-auto">
                            <Video className="w-10 h-10 text-[rgb(170,70,170)]" />
                          </div>
                          {recordings[drill.id] ? (
                            <p className="text-green-400 text-sm">
                              Last recording: {formatTime(recordings[drill.id])}
                            </p>
                          ) : (
                            <p className="text-white/50 text-sm">
                              Target: {drill.timeLimit} seconds
                            </p>
                          )}
                          <Button 
                            onClick={() => startRecording(drill.id)}
                            className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {recordings[drill.id] ? 'Record Again' : 'Comenzar Recording'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {/* Pause drill exercise */}
                {drill.type === 'exercise' && (
                  <div className="space-y-4">
                    {drill.prompts?.map((prompt, i) => (
                      <div 
                        key={i}
                        className={`p-4 rounded-lg transition-all ${
                          pauseStep > i ? 'bg-green-500/10 border border-green-500/30' :
                          pauseStep === i ? 'bg-[rgba(170,70,170,0.1)] border border-[rgba(170,70,170,0.3)]' :
                          'bg-white/5 border border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-medium">Question {i + 1}</p>
                          {pauseStep > i && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                        </div>
                        <p className="text-white/70 italic mb-3">&quot;{prompt.question}&quot;</p>
                        
                        {pauseStep === i && (
                          <div className="space-y-3">
                            {isPausing ? (
                              <div className="text-center py-4">
                                <div className="w-16 h-16 rounded-full bg-[rgba(170,70,170,0.2)] flex items-center justify-center mx-auto mb-2">
                                  <span className="text-[rgb(170,70,170)] text-2xl font-bold">{pauseTimer}</span>
                                </div>
                                <p className="text-[rgb(170,70,170)] text-sm">Pause and think...</p>
                              </div>
                            ) : (
                              <Button 
                                onClick={() => {
                                  startPauseDrill()
                                  setTimeout(() => setPauseStep(i + 1), 3500)
                                }}
                                className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]"
                              >
                                <Timer className="w-4 h-4 mr-2" />
                                Comenzar Pause Drill
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Self-assessment */}
                {drill.type === 'assessment' && (
                  <div className="space-y-4">
                    {drill.aspects?.map((aspect) => (
                      <div key={aspect.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-white font-medium">{aspect.label}</p>
                            <p className="text-white/50 text-xs">{aspect.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {aspect.options.map((option, i) => (
                            <button
                              key={option}
                              onClick={() => setAssessments(prev => ({ ...prev, [aspect.id]: option }))}
                              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
                                assessments[aspect.id] === option
                                  ? i === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                    i === 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                    'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-white/5 text-white/60 hover:bg-white/10'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {/* Assessment summary */}
                    {Object.keys(assessments).length >= 5 && (
                      <div className="bg-[rgba(170,70,170,0.1)] border border-[rgba(170,70,170,0.3)] rounded-lg p-4">
                        <p className="text-[rgb(170,70,170)] font-medium mb-2">Your Focus Areas:</p>
                        <ul className="space-y-1">
                          {Object.entries(assessments)
                            .filter(([, value]) => value.includes('Too') || value === 'Muchos rellenos' || value === 'Uncertain' || value === 'Trails off')
                            .map(([key, value]) => (
                              <li key={key} className="text-white/70 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                                {key}: {value}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tips */}
                <div className="space-y-2">
                  <p className="text-white/50 text-xs uppercase">Tips</p>
                  {drill.tips?.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-[rgb(80,160,170)] mt-0.5" />
                      <p className="text-white/60 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
                
                {/* Complete button */}
                <Button 
                  onClick={() => completeDrill(index)}
                  disabled={!canCompleteDrill(drill)}
                  className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)] disabled:opacity-50"
                >
                  Completar Ejercicio
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </Card>
        ))}

        {/* Complete Module */}
        {completedSteps.length === COMMUNICATION_DRILLS.length && (
          <Card className="rounded-[2px] bg-[rgba(170,70,170,0.15)] border-[rgba(170,70,170,0.4)] p-6 text-center space-y-4">
            <Volume2 className="w-12 h-12 text-[rgb(200,130,200)] mx-auto" />
            <h3 className="text-xl font-bold text-white">Gimnasio de Comunicación Complete!</h3>
            <p className="text-white/70">
              You&apos;ve trained your voice and delivery skills. Earned {MODULE_XP} XP!
            </p>
            <div className="bg-white/5 rounded-lg p-4 text-left">
              <p className="text-white/70 text-sm mb-2">Skills practiced:</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)]">Timed speaking</Badge>
                <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)]">Strategic pauses</Badge>
                <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)]">Self-assessment</Badge>
                <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)]">Delivery improvement</Badge>
              </div>
            </div>
            <Button onClick={handleComplete} className="rounded-[20px] bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]">
              Play to Primera Simulación con Reclutador
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
