'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, AlertCircle, CheckCircle2, Lightbulb, Volume2, Eye } from 'lucide-react'

// Sample feedback data - en producción vendría de análisis IA real
const FEEDBACK_EXAMPLES = {
  interview1: {
    date: 'Hace 3 días',
    simulation: 'Entrevista Guiada - STAR Method',
    overallScore: 72,
    feedback: [
      {
        type: 'strength',
        icon: CheckCircle2,
        title: 'Excelente Uso de STAR',
        description: 'Tu estructura fue clara: Situación, Tarea, Acción, Resultado. El entrevistador siguió perfectamente tu narrativa.',
        timestamp: '00:00-00:45'
      },
      {
        type: 'improvement',
        icon: AlertCircle,
        title: 'Falta Cuantificación en Resultados',
        description: 'Dijiste "mejoramos el sistema". Mejor: "Reducimos latencia 40% (de 500ms a 300ms) beneficiando a 2M usuarios".',
        timestamp: '00:35-00:50'
      },
      {
        type: 'insight',
        icon: Lightbulb,
        title: 'Insight: Conexión con el rol',
        description: 'Conectaste bien tus logros con las necesidades de la empresa. Sigue así pero añade por qué ESPECÍFICAMENTE TÚ.',
        timestamp: 'Análisis General'
      }
    ]
  },
  interview2: {
    date: 'Ayer',
    simulation: 'Entrevista Estructurada',
    overallScore: 68,
    feedback: [
      {
        type: 'strength',
        icon: CheckCircle2,
        title: 'Manejo de Presión Mejorado',
        description: 'Las interrupciones no te desconcentraron. Respondiste con calma y claridad.',
        timestamp: '02:15-02:45'
      },
      {
        type: 'improvement',
        icon: AlertCircle,
        title: 'Pausas Largas en Respuestas',
        description: 'Hay silencios de 5-8 segundos. En entrevista real, verbaliza: "Déjame pensar...", "Buena pregunta, considero..."',
        timestamp: 'Múltiples momentos'
      },
      {
        type: 'insight',
        icon: Lightbulb,
        title: 'Patrón: Responsabilidad > Humildad',
        description: 'Tendencia a destacar solo tus logros. Añade: "Aprendí de mis colegas que..." Demuestra team player.',
        timestamp: 'Análisis General'
      }
    ]
  }
}

export default function FeedbackPage() {
  const [selectedInterview, setSelectedInterview] = useState('interview1')
  const interview = FEEDBACK_EXAMPLES[selectedInterview as keyof typeof FEEDBACK_EXAMPLES]

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'border-l-4 border-green-500 bg-green/5 dark:bg-green-900/20'
      case 'improvement':
        return 'border-l-4 border-orange-500 bg-orange/5 dark:bg-orange-900/20'
      case 'insight':
        return 'border-l-4 border-blue/50 bg-blue/5 dark:bg-blue/20'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/5 via-indigo-50 to-blue/5 dark:from-muted/90 dark:via-purple-900/20 dark:to-muted/90 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Link href="/despega/a3">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a A3
          </Button>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-muted/90 dark:text-white">
            Feedback del Coach IA
          </h1>
          <p className="text-muted/60 dark:text-muted/40">
            Análisis detallado de cada simulación con recomendaciones específicas
          </p>
        </div>

        {/* Interview Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Entrenamientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(FEEDBACK_EXAMPLES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedInterview(key)}
                  className={`w-full text-left p-4 rounded-[28px] border-2 transition-all ${
                    selectedInterview === key
                      ? 'border-blue/50 bg-blue/5 dark:bg-blue/20'
                      : 'border-muted/20 dark:border-card hover:border-blue/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-muted/90 dark:text-white">{value.simulation}</p>
                    <Badge className="bg-blue">{value.overallScore}%</Badge>
                  </div>
                  <p className="text-sm text-muted/60 dark:text-muted/40">{value.date}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Content */}
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="bg-gradient-to-r from-blue to-indigo-600 text-white border-0">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="opacity-90 mb-1">Puntuación General</p>
                  <p className="text-5xl font-bold">{interview.overallScore}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-75">Progreso desde inicio</p>
                  <p className="text-3xl font-bold">+17%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Items */}
          <div className="space-y-4">
            {interview.feedback.map((item, idx) => {
              const Icon = item.icon
              return (
                <Card key={idx} className={getFeedbackColor(item.type)}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Icon className={`w-6 h-6 flex-shrink-0 ${
                        item.type === 'strength'
                          ? 'text-green dark:text-green-400'
                          : item.type === 'improvement'
                          ? 'text-orange dark:text-orange-400'
                          : 'text-blue dark:text-blue/40'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-muted/90 dark:text-white">
                            {item.title}
                          </h3>
                          {item.type === 'strength' && (
                            <Badge className="bg-green">Fortaleza</Badge>
                          )}
                          {item.type === 'improvement' && (
                            <Badge className="bg-orange-600">Mejorar</Badge>
                          )}
                          {item.type === 'insight' && (
                            <Badge className="bg-blue">Insight</Badge>
                          )}
                        </div>
                        <p className="text-muted/70 dark:text-muted/30 mb-3">
                          {item.description}
                        </p>
                        <p className="text-xs text-muted/50 flex items-center gap-2">
                          <span className="w-1 h-1 bg-muted/40 rounded-full" />
                          Timestampv: {item.timestamp}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Action Items */}
          <Card className="border-2 border-purple/30 dark:border-purple">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple" />
                Tu Plan de Acción
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted/90 dark:text-white">
                  Para tu próxima simulación, enfócate en:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted/70 dark:text-muted/30">
                  <li>Añadir 2-3 números específicos en cada logro (% de mejora, cantidad de usuarios, tiempo ahorrado)</li>
                  <li>Practicar verbalizaciones de pausa ("Déjame pensar...", "Buena pregunta...")</li>
                  <li>Incluir un aprendizaje de un colega en al menos una respuesta</li>
                  <li>Conectar cada respuesta explícitamente con las necesidades del rol</li>
                </ol>
              </div>

              <div className="pt-4 border-t border-purple/30 dark:border-purple">
                <p className="text-sm text-muted/70 dark:text-muted/30 mb-3">
                  Cuando estés listo, practica la siguiente dificultad:
                </p>
                <Button className="w-full bg-purple hover:bg-purple">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Iniciar Entrevista Estructurada (Siguiente Nivel)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Tu Evolución</CardTitle>
              <CardDescription>Comparación con tu última simulación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { metric: 'Claridad de Respuestas', before: 65, after: 72 },
                  { metric: 'Cuantificación de Logros', before: 58, after: 65 },
                  { metric: 'Manejo de Presión', before: 70, after: 80 },
                  { metric: 'Conexión con Rol', before: 60, after: 68 }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-muted/90 dark:text-white">{item.metric}</span>
                      <span className="text-green dark:text-green-400 font-bold">
                        +{item.after - item.before}%
                      </span>
                    </div>
                    <div className="flex gap-2 h-2">
                      <div className="flex-1 bg-muted/20 dark:bg-muted/70 rounded overflow-hidden">
                        <div
                          className="bg-muted/40 dark:bg-muted/50 h-full"
                          style={{ width: `${item.before}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-muted/20 dark:bg-muted/70 rounded overflow-hidden">
                        <div
                          className="bg-green/50 h-full"
                          style={{ width: `${item.after}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
