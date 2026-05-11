'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Send, RotateCcw, TrendingUp, Lightbulb } from 'lucide-react'

interface ConversationTurn {
  role: 'interviewer' | 'candidate'
  message: string
  timestamp: number
}

const CONVERSATION_SCENARIOS = [
  {
    id: 1,
    title: 'Presentación Natural en Networking',
    difficulty: 'Básico',
    objective: 'Presentarte de manera natural y memorable sin sonar ensayado',
    starterMessage: 'Hola, ¿en qué trabajas?',
    tips: [
      'Evita sonar como un elevator pitch memorizado',
      'Usa lenguaje conversacional',
      'Muestra pasión genuina por lo que haces',
      'Termina con una pregunta para ellos'
    ],
    goodResponse: 'Trabajo en desarrollo de software, particularmente en aplicaciones web. Me encanta resolver problemas complejos de UX y actualmente estoy muy interesado en cómo las empresas pueden usar IA para mejorar la experiencia del usuario. ¿A ti qué te apasiona en tu trabajo?',
    learningPoints: [
      'Naturalidad vs. scripted',
      'Reciprocidad en la conversación',
      'Mostrar curiosidad genuina'
    ]
  },
  {
    id: 2,
    title: 'Transición en Carrera',
    difficulty: 'Intermedio',
    objective: 'Explicar cambios de carrera sin parecer indeciso',
    starterMessage: 'Veo que viniste de una industria diferente. ¿Por qué el cambio?',
    tips: [
      'Muestra una narrativa clara de crecimiento',
      'Conecta tu experiencia anterior con el nuevo rol',
      'Demuestra que fue una decisión deliberada',
      'Destaca habilidades transferibles'
    ],
    goodResponse: 'Pasé 5 años en consultoría enfocado en procesos de negocios. Aunque fue enriquecedor, me di cuenta de que me apasionaba más la tecnología. Lo bueno es que toda mi experiencia en analizar flujos complejos y hablar con stakeholders es perfecta para product management en tech. Es un cambio natural, no un salto al azar.',
    learningPoints: [
      'Storytelling de transición',
      'Validación de experiencia anterior',
      'Propósito claro'
    ]
  },
  {
    id: 3,
    title: 'Manejo de Pregunta Incómoda',
    difficulty: 'Avanzado',
    objective: 'Responder preguntas difíciles con autenticidad y calma',
    starterMessage: 'Notamos que dejaste tu último trabajo después de solo 6 meses. ¿Qué pasó?',
    tips: [
      'No hagas excusas, sé honesto',
      'Muestra lo que aprendiste',
      'Enfócate en lo positivo',
      'Demuestra cambio de perspectiva'
    ],
    goodResponse: 'Ese fue un aprendizaje importante. Acepté el rol muy rápidamente sin investigar bien la cultura de la empresa. Descubrí que los valores no estaban alineados y que los procesos técnicos no eran lo que buscaba. En lugar de quedarme miserable, tomé la decisión de irme. Ahora soy mucho más cuidadoso con evaluar cultural fit antes de aceptar.',
    learningPoints: [
      'Vulnerabilidad apropiada',
      'Lecciones aprendidas',
      'Crecimiento personal'
    ]
  },
  {
    id: 4,
    title: 'Rapport Building',
    difficulty: 'Intermedio',
    objective: 'Crear conexión humana genuina durante la entrevista',
    starterMessage: 'Veo que fuiste a [Universidad]. Yo también estudié allí años atrás.',
    tips: [
      'Busca puntos en común reales',
      'Muestra interés genuino',
      'Comparte brevemente de ti',
      'Mantén profesionalismo con calidez'
    ],
    goodResponse: 'Excelente, ¿de verdad? ¡Qué pequeño es el mundo! Pasé momentos increíbles ahí. ¿En qué época estuviste? Creo que la experiencia de estudiar allí realmente me enseñó a trabajar en equipo de forma efectiva. Supongo que los dos salimos con eso en común. ¿Cómo eso influyó en tu carrera?',
    learningPoints: [
      'Autenticidad en conexión',
      'Balance entre personal y profesional',
      'Demostrar humanidad'
    ]
  }
]

export default function EntrenamientoConversacionalPage() {
  const [selectedScenario, setSelectedScenario] = useState<typeof CONVERSATION_SCENARIOS[0] | null>(null)
  const [conversation, setConversation] = useState<ConversationTurn[]>([])
  const [userInput, setUserInput] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [conversationScore, setConversationScore] = useState(0)

  const startScenario = (scenario: typeof CONVERSATION_SCENARIOS[0]) => {
    setSelectedScenario(scenario)
    setConversation([
      {
        role: 'interviewer',
        message: scenario.starterMessage,
        timestamp: Date.now()
      }
    ])
    setUserInput('')
    setShowFeedback(false)
  }

  const submitResponse = () => {
    if (!userInput.trim()) return

    const newTurn: ConversationTurn = {
      role: 'candidate',
      message: userInput,
      timestamp: Date.now()
    }

    setConversation([...conversation, newTurn])
    setUserInput('')

    // Simulate feedback
    setTimeout(() => {
      const interviewerResponse: ConversationTurn = {
        role: 'interviewer',
        message: 'Interesante. Cuéntame más sobre eso...',
        timestamp: Date.now()
      }
      setConversation(prev => [...prev, interviewerResponse])
    }, 500)
  }

  const finishConversation = () => {
    const score = Math.floor(Math.random() * 20) + 80
    setConversationScore(score)
    setShowFeedback(true)
  }

  const resetScenario = () => {
    setSelectedScenario(null)
    setConversation([])
    setUserInput('')
    setShowFeedback(false)
  }

  if (selectedScenario && !showFeedback) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        {/* Header */}
        <div className="border-b border-purple-500/20 bg-black/50 p-6">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={resetScenario}
              variant="ghost"
              className="text-purple-400 hover:text-purple-300 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Escenarios
            </Button>
            <h1 className="text-2xl font-bold mb-2">{selectedScenario.title}</h1>
            <p className="text-white/60">{selectedScenario.objective}</p>
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-auto max-w-4xl mx-auto w-full px-6 py-6">
          <div className="space-y-4">
            {conversation.map((turn, idx) => (
              <div key={idx} className={`flex ${turn.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                <Card className={turn.role === 'candidate' ? 'bg-purple-600/20 border-purple-500/30 max-w-md' : 'bg-white/5 border-white/10 max-w-md'}>
                  <CardContent className="pt-3">
                    <p className="text-sm text-white/90">{turn.message}</p>
                    <p className="text-xs text-white/40 mt-2">
                      {turn.role === 'candidate' ? 'Tú' : 'Entrevistador'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-purple-500/20 bg-black/50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    submitResponse()
                  }
                }}
                placeholder="Escribe tu respuesta aquí (Ctrl+Enter para enviar)..."
                className="w-full bg-black border border-purple-500/30 rounded-lg p-4 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none min-h-24"
              />
              
              <div className="flex gap-3">
                <Button
                  onClick={submitResponse}
                  disabled={!userInput.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Respuesta
                </Button>
                {conversation.length > 1 && (
                  <Button
                    onClick={finishConversation}
                    variant="outline"
                    className="border-green-500/30 text-green-300"
                  >
                    Finalizar Conversación
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showFeedback) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <Card className="bg-black border-purple-500/30 w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Feedback de Conversación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 text-center">
              <p className="text-white/60 text-sm mb-2">Naturalidad y Conexión</p>
              <p className="text-5xl font-bold text-purple-400">{conversationScore}/100</p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3">Puntos Clave de Aprendizaje:</h3>
              <ul className="space-y-2">
                {selectedScenario?.learningPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white/70">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-3">Respuesta Modelo:</h3>
              <Card className="bg-green-500/10 border-green-500/20">
                <CardContent className="pt-4">
                  <p className="text-white/70 text-sm italic">{selectedScenario?.goodResponse}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={resetScenario}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Intentar Otro Escenario
              </Button>
              <Button
                variant="outline"
                className="border-purple-500/30 text-white"
              >
                Ver Análisis Detallado
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link href="/despega/a3" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver a Camino de Aprendizaje
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
              <MessageCircle className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Entrenamiento Conversacional</h1>
              <p className="text-white/60 mt-1">Practica conversaciones naturales y construye rapport genuino</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold mb-6">Elige un Escenario de Conversación</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {CONVERSATION_SCENARIOS.map((scenario) => (
            <Card
              key={scenario.id}
              className="bg-black border-purple-500/30 hover:border-purple-500/60 transition-colors cursor-pointer"
              onClick={() => startScenario(scenario)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{scenario.title}</CardTitle>
                  <Badge className={
                    scenario.difficulty === 'Avanzado' ? 'bg-orange-500/20 text-orange-300' :
                    scenario.difficulty === 'Intermedio' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }>
                    {scenario.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white/70 text-sm">{scenario.objective}</p>
                
                <div>
                  <p className="text-xs text-white/60 font-semibold mb-2">Tips Iniciales:</p>
                  <ul className="space-y-1">
                    {scenario.tips.slice(0, 2).map((tip, idx) => (
                      <li key={idx} className="text-xs text-white/50 flex gap-2">
                        <span>•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mt-4">
                  Iniciar Conversación
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">Qué hace una conversación natural</h3>
              <ul className="space-y-1 text-blue-200/70 text-sm">
                <li>• Evita respuestas que suenen ensayadas o demasiado perfectas</li>
                <li>• Usa lenguaje conversacional, no corporativo</li>
                <li>• Demuestra curiosidad genuina por el entrevistador</li>
                <li>• Sé auténtico - la gente detecta cuando actúas</li>
                <li>• Busca puntos en común reales, no forzados</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-purple-500/20 bg-black/50 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between">
          <Link href="/despega/a3/entrenamiento-estructurado">
            <Button variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior: Entrenamiento Estructurado
            </Button>
          </Link>
          <Link href="/despega/a3/simulacion-real">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Siguiente: Simulación Real
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
