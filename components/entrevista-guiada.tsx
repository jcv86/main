'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  calcularScoreRespuesta,
  generarFeedbackPersonalizado,
  MODULOS_EDUCATIVOS,
  PREGUNTAS_ENTREVISTA,
  verificarReadinessNoAsistida,
  type PreguntaEntrevista,
} from '@/lib/a3-entrevistas-logic'
import { Lightbulb, Volume2, ChevronRight } from 'lucide-react'

interface EntrevistaGuiadaProps {
  usuarioId: string
  perfilDisc: 'A' | 'B' | 'C' | 'D'
  onComplete?: (resultados: any) => void
}

export function EntrevistaGuiada({ usuarioId, perfilDisc, onComplete }: EntrevistaGuiadaProps) {
  const [etapa, setEtapa] = useState<'modulos' | 'entrevista' | 'feedback'>('modulos')
  const [moduloActual, setModuloActual] = useState(0)
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [respuestasUsuario, setRespuestasUsuario] = useState<string[]>([])
  const [tiempoInicio, setTiempoInicio] = useState<number>(Date.now())
  const [showTips, setShowTips] = useState(false)
  const [modulosCompletados, setModulosCompletados] = useState<boolean[]>(
    new Array(MODULOS_EDUCATIVOS.length).fill(false)
  )

  const moduloActualData = MODULOS_EDUCATIVOS[moduloActual]
  const preguntaActualData = PREGUNTAS_ENTREVISTA[preguntaActual]
  const progresoPregunta = ((preguntaActual + 1) / PREGUNTAS_ENTREVISTA.length) * 100

  const handleModuloCompleto = () => {
    const newModulosCompletados = [...modulosCompletados]
    newModulosCompletados[moduloActual] = true
    setModulosCompletados(newModulosCompletados)

    if (moduloActual < MODULOS_EDUCATIVOS.length - 1) {
      setModuloActual(moduloActual + 1)
    } else {
      // Todos los módulos completados, pasar a entrevista
      setEtapa('entrevista')
      setTiempoInicio(Date.now())
    }
  }

  const handleRespuestaGuardada = (respuesta: string) => {
    const newRespuestas = [...respuestasUsuario]
    newRespuestas[preguntaActual] = respuesta
    setRespuestasUsuario(newRespuestas)

    // Calcular score automáticamente
    const { score, feedback } = calcularScoreRespuesta(respuesta, preguntaActualData.tipo)
    console.log(`[v0] Pregunta ${preguntaActual + 1}: Score ${score}, Feedback: ${feedback}`)
  }

  const handleSiguientePregunta = () => {
    if (preguntaActual < PREGUNTAS_ENTREVISTA.length - 1) {
      setPreguntaActual(preguntaActual + 1)
      setShowTips(false)
    } else {
      // Entrevista completada
      setEtapa('feedback')
      const feedback = generarFeedbackPersonalizado(
        respuestasUsuario.map((r, i) => ({
          pregunta_id: PREGUNTAS_ENTREVISTA[i].id,
          respuesta: r,
          tiempo: 60,
        })),
        perfilDisc
      )

      if (onComplete) {
        onComplete({ respuestas: respuestasUsuario, feedback })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Entrevista Guiada</h1>
          <p className="text-slate-600">Aprende y practica entrevistas con asistencia en tiempo real</p>
        </div>

        {/* Etapa: Módulos Educativos */}
        {etapa === 'modulos' && (
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardTitle>Preparación: {moduloActualData.titulo}</CardTitle>
              <div className="mt-4">
                <Progress
                  value={((moduloActual + 1) / MODULOS_EDUCATIVOS.length) * 100}
                  className="h-2"
                />
                <p className="text-sm mt-2 opacity-90">
                  Módulo {moduloActual + 1} de {MODULOS_EDUCATIVOS.length}
                </p>
              </div>
            </CardHeader>

            <CardContent className="pt-8">
              <div className="space-y-6">
                {/* Introducción */}
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                    {moduloActualData.titulo}
                  </h2>
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    {moduloActualData.contenido.introduccion}
                  </p>

                  {/* Qué esperar */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mb-6">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Qué esperar:
                    </h3>
                    <ul className="space-y-2">
                      {moduloActualData.contenido.que_esperar.map((item, i) => (
                        <li key={i} className="text-blue-800 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tips */}
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded">
                    <h3 className="font-semibold text-amber-900 mb-3">💡 Tips Importantes:</h3>
                    <ul className="space-y-2">
                      {moduloActualData.contenido.tips.map((tip, i) => (
                        <li key={i} className="text-amber-800 flex items-start gap-2">
                          <span className="text-amber-500 mt-1">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Botón siguiente */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Badge variant="outline" className="bg-slate-100">
                    Módulo {moduloActual + 1} de {MODULOS_EDUCATIVOS.length}
                  </Badge>
                  <Button
                    onClick={handleModuloCompleto}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {moduloActual === MODULOS_EDUCATIVOS.length - 1
                      ? 'Comenzar Entrevista'
                      : 'Siguiente Módulo'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Etapa: Entrevista */}
        {etapa === 'entrevista' && (
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardTitle>Pregunta {preguntaActual + 1} de {PREGUNTAS_ENTREVISTA.length}</CardTitle>
              <div className="mt-4">
                <Progress value={progresoPregunta} className="h-2" />
              </div>
            </CardHeader>

            <CardContent className="pt-8">
              <div className="space-y-6">
                {/* Pregunta */}
                <div>
                  <div className="text-2xl font-semibold text-slate-900 mb-4 flex items-start gap-2">
                    <span className="text-green-600 text-3xl">Q:</span>
                    {preguntaActualData.pregunta}
                  </div>

                  {/* Categoría y tipo */}
                  <div className="flex gap-2 mb-6">
                    <Badge className="bg-green-100 text-green-800">
                      {preguntaActualData.tipo}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      {preguntaActualData.categoria}
                    </Badge>
                  </div>
                </div>

                {/* Sugerencia */}
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-green-900 font-semibold mb-2">Sugerencia:</p>
                  <p className="text-green-800">{preguntaActualData.sugerencia}</p>
                </div>

                {/* Tips Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowTips(!showTips)}
                  className="w-full justify-start text-left"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showTips ? 'Ocultar tips' : 'Ver tips'}
                </Button>

                {/* Tips */}
                {showTips && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                    <p className="font-semibold text-amber-900 mb-2">Tips para esta pregunta:</p>
                    <ul className="space-y-2">
                      {preguntaActualData.tips.map((tip, i) => (
                        <li key={i} className="text-amber-800 flex items-start gap-2">
                          <span className="text-amber-500">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Área de respuesta */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Tu respuesta:
                  </label>
                  <textarea
                    onChange={e => handleRespuestaGuardada(e.target.value)}
                    value={respuestasUsuario[preguntaActual] || ''}
                    placeholder="Escribe tu respuesta aquí. Intenta usar el método STAR (Situación, Tarea, Acción, Resultado)..."
                    className="w-full h-32 p-4 border-2 border-slate-300 rounded-lg focus:border-green-500 focus:outline-none text-slate-900"
                  />
                  <p className="text-sm text-slate-600 mt-2">
                    {respuestasUsuario[preguntaActual]?.length || 0} caracteres
                  </p>
                </div>

                {/* Botones */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setPreguntaActual(Math.max(0, preguntaActual - 1))}
                    disabled={preguntaActual === 0}
                  >
                    Anterior
                  </Button>
                  <Button
                    onClick={handleSiguientePregunta}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={!respuestasUsuario[preguntaActual]?.trim()}
                  >
                    {preguntaActual === PREGUNTAS_ENTREVISTA.length - 1
                      ? 'Ver Feedback'
                      : 'Siguiente Pregunta'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Etapa: Feedback */}
        {etapa === 'feedback' && (
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardTitle>Tu Feedback Personalizado</CardTitle>
            </CardHeader>

            <CardContent className="pt-8">
              <div className="space-y-6">
                <p className="text-slate-600 text-lg">
                  ¡Excelente! Completaste la entrevista guiada. Aquí está tu feedback:
                </p>

                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
                  <p className="text-sm font-semibold text-green-900 mb-2">Tus fortalezas:</p>
                  <ul className="space-y-2">
                    <li className="text-green-800">✓ Buena estructura en respuestas</li>
                    <li className="text-green-800">✓ Ejemplos claros y relevantes</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Áreas para mejorar:</p>
                  <ul className="space-y-2">
                    <li className="text-blue-800">• Sé más conciso en algunas respuestas</li>
                    <li className="text-blue-800">• Enfatiza más los resultados</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded">
                  <p className="text-sm font-semibold text-purple-900 mb-2">Próximos pasos:</p>
                  <ul className="space-y-2">
                    <li className="text-purple-800">1. Practica entrevistas sin asistencia</li>
                    <li className="text-purple-800">2. Grábate respondiendo</li>
                    <li className="text-purple-800">3. Busca feedback de mentores</li>
                  </ul>
                </div>

                {/* Botones finales */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setEtapa('entrevista')}
                    className="flex-1"
                  >
                    Repetir Entrevista
                  </Button>
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                    Ir a Entrevista Libre
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
