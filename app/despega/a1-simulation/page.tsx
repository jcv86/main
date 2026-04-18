'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'
import { ASection, ASectionPart } from '@/components/a-section-layout'

interface SimulationQuestion {
  id: string
  question: string
  scenario: string
  forProfile: string[]
}

const SIMULATION_QUESTIONS: SimulationQuestion[] = [
  {
    id: 'q1',
    question: '¿Cuál es tu mayor fortaleza en un equipo?',
    scenario: 'Estás en una entrevista de grupo y te preguntan sobre tu contribución al equipo.',
    forProfile: ['D', 'I', 'S', 'C']
  },
  {
    id: 'q2',
    question: '¿Cómo manejas un conflicto con un compañero?',
    scenario: 'Ha surgido un desacuerdo importante sobre la dirección de un proyecto.',
    forProfile: ['D', 'I', 'S', 'C']
  },
  {
    id: 'q3',
    question: '¿Cuál es tu enfoque bajo presión?',
    scenario: 'El proyecto tiene un plazo crítico y recursos limitados.',
    forProfile: ['D', 'I', 'S', 'C']
  }
]

export default function A1SimulationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuthRedirect()
  
  const [profile, setProfile] = useState<string>('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<string[]>([])
  const [simulationComplete, setSimulationComplete] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    
    const profileParam = searchParams.get('profile')
    if (profileParam && ['D', 'I', 'S', 'C'].includes(profileParam)) {
      setProfile(profileParam)
      setLoading(false)
    } else {
      // Redirect back if no valid profile
      router.push('/despega/a1-report')
    }
  }, [authLoading, searchParams, router])

  const handleAnswer = (answer: string) => {
    const newResponses = [...responses, answer]
    setResponses(newResponses)

    if (currentQuestion < SIMULATION_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setSimulationComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setResponses([])
    setSimulationComplete(false)
  }

  const profileNames: Record<string, string> = {
    D: 'Impulsor',
    I: 'Catalizador',
    S: 'Estabilizador',
    C: 'Arquitecto'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-blue" />
      </div>
    )
  }

  if (simulationComplete) {
    return (
      <ASection 
        title="A1: Origen" 
        subtitle="Simulación Completada" 
        icon="🎭" 
        colorClass="from-blue to-blue"
      >
        <ASectionPart title="¡Excelente!" icon={<CheckCircle2 />}>
          <div className="bg-gradient-to-br from-blue/30 to-blue/20 border border-blue/30 rounded-[28px] p-8 text-center mb-8">
            <div className="mb-4">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-blue/40 to-blue/40 bg-clip-text mb-2">
                {profileNames[profile]}
              </div>
              <p className="text-lg text-muted/30">Completaste la simulación de entrevista</p>
            </div>

            <div className="bg-muted/80/50 rounded-[28px] p-6 mb-6 text-left">
              <h3 className="font-semibold text-white mb-4">Tus Respuestas:</h3>
              <div className="space-y-3">
                {responses.map((response, idx) => (
                  <div key={idx} className="border border-muted/60 rounded p-3">
                    <p className="text-xs text-muted/40 mb-1">Pregunta {idx + 1}:</p>
                    <p className="text-muted/20">{response}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-muted/40 mb-6">
              Esta simulación te ayuda a practicar respuestas según tu perfil {profileNames[profile]}. Repítela cuantas veces quieras para mejorar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={handleRestart}
              className="w-full bg-blue hover:from-blue hover:to-blue text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Repetir Simulación
            </Button>
            <Button 
              onClick={() => router.push('/despega/a1-report')}
              variant="outline"
              className="w-full"
            >
              Ver Perfil
            </Button>
            <Button 
              onClick={() => router.push('/despega')}
              className="w-full bg-purple hover:bg-purple"
            >
              Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </ASectionPart>
      </ASection>
    )
  }

  const question = SIMULATION_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / SIMULATION_QUESTIONS.length) * 100

  return (
    <ASection 
      title="A1: Origen" 
      subtitle="Simulación de Entrevista" 
      icon="🎭" 
      colorClass="from-blue to-blue"
    >
      <ASectionPart title={`Pregunta ${currentQuestion + 1} de ${SIMULATION_QUESTIONS.length}`} icon={<Zap />}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted/40">Perfil: <span className="font-semibold text-cyan/30">{profileNames[profile]}</span></p>
            <p className="text-sm text-muted/40">{Math.round(progress)}%</p>
          </div>
          <div className="h-2 bg-muted/70 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="bg-muted/80/40 border-muted/70 mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted/40 italic mb-4">Contexto: {question.scenario}</p>
            <p className="text-xs text-muted/50">Responde cómo lo haría alguien con tu perfil {profileNames[profile]}.</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-3 mb-8">
          {[
            {
              label: '💪 Respuesta Fuerte',
              description: 'Enfocada en resultados y acción',
              value: 'strong'
            },
            {
              label: '🤝 Respuesta Equilibrada',
              description: 'Considera personas y proceso',
              value: 'balanced'
            },
            {
              label: '🧠 Respuesta Analítica',
              description: 'Detallada y fundamentada',
              value: 'analytical'
            },
            {
              label: '⏰ Respuesta Pragmática',
              description: 'Realista y orientada al tiempo',
              value: 'pragmatic'
            }
          ].map((option) => (
            <Button
              key={option.value}
              onClick={() => handleAnswer(option.label)}
              variant="outline"
              className="h-auto py-4 px-4 flex items-start gap-3 justify-start border-muted/60 hover:border-blue hover:bg-cyan-950/20"
            >
              <div className="text-left flex-1">
                <p className="font-semibold text-white text-sm">{option.label}</p>
                <p className="text-xs text-muted/40">{option.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted/40" />
            </Button>
          ))}
        </div>

        <Button 
          onClick={() => router.push('/despega/a1-report')}
          variant="outline"
          className="w-full border-muted/60"
        >
          Salir de la Simulación
        </Button>
      </ASectionPart>
    </ASection>
  )
}
