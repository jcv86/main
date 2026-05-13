'use client'

import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Download, Upload, CheckCircle2, AlertCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Step = 'intro' | 'vision' | 'coach-offer' | 'milestones' | 'actions' | 'notion-guide' | 'notion-upload' | 'analysis' | 'results'

interface Dia1Data {
  // Vision answers
  role: string
  environment: string
  careerResult: string
  
  // Coach enhancement (optional)
  coachEnhanced: boolean
  coachVersion: string
  
  // Milestones
  day10: string
  day20: string
  day30: string
  
  // Actions
  clarityActions: string[]
  materialActions: string[]
  interviewActions: string[]
  realActions: string[]
  
  // Notion & Upload
  notionPlanUrl: string
  uploadedFileName: string
  
  // Analysis
  analysisScore: number | null
  analysisStatus: 'pending' | 'passed' | 'needs-revision' | null
}

export default function Dia1Page() {
  const [step, setStep] = useState<Step>('intro')
  const [data, setData] = useState<Dia1Data>({
    role: '',
    environment: '',
    careerResult: '',
    coachEnhanced: false,
    coachVersion: '',
    day10: '',
    day20: '',
    day30: '',
    clarityActions: [''],
    materialActions: [''],
    interviewActions: [''],
    realActions: [''],
    notionPlanUrl: '',
    uploadedFileName: '',
    analysisScore: null,
    analysisStatus: null,
  })

  // Vision validation
  const visionValid = data.role.trim().length > 10 && 
                     data.environment.trim().length > 10 && 
                     data.careerResult.trim().length > 10

  // Milestones validation
  const milestonesValid = data.day10.trim().length > 5 && 
                         data.day20.trim().length > 5 && 
                         data.day30.trim().length > 5

  // Actions validation
  const actionsValid = data.clarityActions.some(a => a.trim().length > 3) &&
                      data.materialActions.some(a => a.trim().length > 3) &&
                      data.interviewActions.some(a => a.trim().length > 3) &&
                      data.realActions.some(a => a.trim().length > 3)

  const handleVisionNext = () => {
    if (visionValid) {
      setStep('coach-offer')
    }
  }

  const handleCoachOffer = (acceptCoach: boolean) => {
    if (acceptCoach) {
      // Simulate coach enhancement
      const enhanced = `Profesional en ${data.role} con enfoque en ${data.environment}. Objetivo: ${data.careerResult}. Trayectoria orientada a impacto sostenible y crecimiento técnico.`
      setData({ ...data, coachEnhanced: true, coachVersion: enhanced })
    }
    setStep('milestones')
  }

  const handleMilestonesNext = () => {
    if (milestonesValid) {
      setStep('actions')
    }
  }

  const handleActionsNext = () => {
    if (actionsValid) {
      setStep('notion-guide')
    }
  }

  const handleNotionGuideNext = () => {
    setStep('notion-upload')
  }

  const handleFileUpload = (fileName: string) => {
    setData({ ...data, uploadedFileName: fileName })
    // Simulate analysis
    setTimeout(() => {
      setStep('analysis')
    }, 1000)
  }

  const handleAnalysisComplete = (score: number) => {
    const passed = score >= 75
    setData({
      ...data,
      analysisScore: score,
      analysisStatus: passed ? 'passed' : 'needs-revision'
    })
    setStep('results')
  }

  const handleRedirectToFix = () => {
    setStep('vision')
    setData({
      ...data,
      analysisScore: null,
      analysisStatus: null
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-800">
        {/* Header */}
        <div className="sticky top-0 bg-slate-950 border-b border-slate-800 p-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-purple-400 font-medium">Día 1</div>
            <h1 className="text-2xl font-bold text-white mt-1">
              {step === 'intro' && 'Define tu visión y roadmap'}
              {step === 'vision' && 'Escribe tu visión profesional'}
              {step === 'coach-offer' && '¿Deseas mejorar tu visión con Coach IA?'}
              {step === 'milestones' && 'Define 3 hitos clave'}
              {step === 'actions' && 'Crea tu plan de acciones'}
              {step === 'notion-guide' && 'Descarga y crea en Notion'}
              {step === 'notion-upload' && 'Sube tu plan desde Notion'}
              {step === 'analysis' && 'Analizando tu documento...'}
              {step === 'results' && (data.analysisStatus === 'passed' ? '¡Félicidades! Día 1 completado' : 'Mejora tu plan')}
            </h1>
          </div>
          <button className="text-slate-400 hover:text-white transition" onClick={() => setStep('intro')}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* INTRO STEP */}
          {step === 'intro' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <p className="text-slate-300 text-lg">
                  Crea un documento estructurado con tu objetivo profesional, hitos clave y timeline realista.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-500/20 rounded text-purple-400 flex items-center justify-center text-sm">📋</span>
                  Pasos a Seguir
                </h3>
                <div className="space-y-3">
                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 flex gap-4">
                    <div className="text-2xl">✍️</div>
                    <div>
                      <div className="text-white font-semibold">1. Escribe tu visión</div>
                      <div className="text-slate-400 text-sm">Responde 3 preguntas clave (~10 min)</div>
                    </div>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 flex gap-4">
                    <div className="text-2xl">🤖</div>
                    <div>
                      <div className="text-white font-semibold">2. Opción: Mejora con Coach IA</div>
                      <div className="text-slate-400 text-sm">Pulir visión profesional (~5 min)</div>
                    </div>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 flex gap-4">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <div className="text-white font-semibold">3. Define 3 hitos (30/60/90 días)</div>
                      <div className="text-slate-400 text-sm">Control points (~10 min)</div>
                    </div>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 flex gap-4">
                    <div className="text-2xl">📝</div>
                    <div>
                      <div className="text-white font-semibold">4. Plan de acciones</div>
                      <div className="text-slate-400 text-sm">4 categorías de trabajo (~15 min)</div>
                    </div>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 flex gap-4">
                    <div className="text-2xl">📲</div>
                    <div>
                      <div className="text-white font-semibold">5. Exporta a Notion</div>
                      <div className="text-slate-400 text-sm">Crea plan real y descarga (~5 min)</div>
                    </div>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 flex gap-4">
                    <div className="text-2xl">✅</div>
                    <div>
                      <div className="text-white font-semibold">6. Análisis de DTC</div>
                      <div className="text-slate-400 text-sm">Validación y feedback (~5 min)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="text-blue-300 text-sm">
                  <strong>Criterios de éxito:</strong> Visión clara, 3 hitos realistas, plan con acciones, documento completo en Notion
                </div>
              </div>
            </div>
          )}

          {/* VISION STEP */}
          {step === 'vision' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    1. ¿Qué rol/dirección profesional quieres en 3 años?
                  </label>
                  <textarea
                    placeholder="Ej: Director de Producto en empresa Tech B2B, liderando equipos de 10+ personas..."
                    value={data.role}
                    onChange={(e) => setData({ ...data, role: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                    rows={3}
                  />
                  <div className="text-xs text-slate-400 mt-1">Mínimo 10 caracteres (actual: {data.role.length})</div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    2. ¿Qué tipo de empresa/ambiente quieres?
                  </label>
                  <textarea
                    placeholder="Ej: Startup de Series B, ambiente colaborativo, flexibilidad remota, équipo multicultural..."
                    value={data.environment}
                    onChange={(e) => setData({ ...data, environment: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                    rows={3}
                  />
                  <div className="text-xs text-slate-400 mt-1">Mínimo 10 caracteres (actual: {data.environment.length})</div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    3. ¿Cuál es el resultado más importante que quieres lograr?
                  </label>
                  <textarea
                    placeholder="Ej: Implementar proceso de innovación, posicionarme como experto, crecimiento salarial del 50%..."
                    value={data.careerResult}
                    onChange={(e) => setData({ ...data, careerResult: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                    rows={3}
                  />
                  <div className="text-xs text-slate-400 mt-1">Mínimo 10 caracteres (actual: {data.careerResult.length})</div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${visionValid ? 'bg-green-500/10 border-green-500/20' : 'bg-slate-800/30 border-slate-700'}`}>
                <div className="text-sm text-slate-300 flex items-start gap-2">
                  {visionValid ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Visión lista para siguiente paso</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                      <span>Completa todas las respuestas (mínimo 10 caracteres cada una)</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* COACH OFFER STEP */}
          {step === 'coach-offer' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Mejora tu visión con Coach IA</h3>
                    <p className="text-slate-300 mb-4">
                      Nuestro coach profesional puede pulir tu visión para hacerla más impactante y clara. Es completamente opcional.
                    </p>
                    <div className="bg-slate-800/50 border border-slate-700 rounded p-4">
                      <p className="text-slate-200 italic">
                        "{data.coachVersion || 'Profesional con experiencia comprobada en ' + data.role + ', enfocado en lograr ' + data.careerResult + ' dentro de un ambiente ' + data.environment}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleCoachOffer(false)}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800/50"
                >
                  Mantener mi versión
                </Button>
                <Button
                  onClick={() => handleCoachOffer(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Usar versión del Coach
                </Button>
              </div>
            </div>
          )}

          {/* MILESTONES STEP */}
          {step === 'milestones' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-300">Define 3 hitos clave a 30, 60 y 90 días. Deben ser realistas y alcanzables.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">🎯 Día 30: ¿Qué debe estar listo?</label>
                  <textarea
                    placeholder="Ej: CV actualizado, 5 empresas identificadas, LinkedIn optimizado..."
                    value={data.day10}
                    onChange={(e) => setData({ ...data, day10: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">🎯 Día 60: ¿Qué debe haber pasado?</label>
                  <textarea
                    placeholder="Ej: 10+ postulaciones, 3 entrevistas realizadas, respuestas ensayadas..."
                    value={data.day20}
                    onChange={(e) => setData({ ...data, day20: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">🎯 Día 90: ¿Cuál es tu objetivo final?</label>
                  <textarea
                    placeholder="Ej: Oferta recibida y negociada, o avanzar a siguiente ronda..."
                    value={data.day30}
                    onChange={(e) => setData({ ...data, day30: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                    rows={2}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${milestonesValid ? 'bg-green-500/10 border-green-500/20' : 'bg-slate-800/30 border-slate-700'}`}>
                <div className="text-sm text-slate-300 flex items-center gap-2">
                  {milestonesValid ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>Hitos completados</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-slate-500" />
                      <span>Completa todos los hitos</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ACTIONS STEP */}
          {step === 'actions' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-300">Define acciones en 4 categorías. Mínimo 1 acción por categoría.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-3">📊 Claridad: Diagnóstico y Fortalezas</label>
                  {data.clarityActions.map((action, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder="Ej: Realizar test de fortalezas DISC..."
                      value={action}
                      onChange={(e) => {
                        const newActions = [...data.clarityActions]
                        newActions[idx] = e.target.value
                        setData({ ...data, clarityActions: newActions })
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 mb-2 focus:outline-none focus:border-purple-500"
                    />
                  ))}
                  <Button
                    onClick={() => setData({ ...data, clarityActions: [...data.clarityActions, ''] })}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-300"
                  >
                    + Agregar acción
                  </Button>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">📄 Material: CV y Logros</label>
                  {data.materialActions.map((action, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder="Ej: Actualizar CV con últimos 3 proyectos..."
                      value={action}
                      onChange={(e) => {
                        const newActions = [...data.materialActions]
                        newActions[idx] = e.target.value
                        setData({ ...data, materialActions: newActions })
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 mb-2 focus:outline-none focus:border-purple-500"
                    />
                  ))}
                  <Button
                    onClick={() => setData({ ...data, materialActions: [...data.materialActions, ''] })}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-300"
                  >
                    + Agregar acción
                  </Button>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">🎤 Entrevista: Respuestas y Práctica</label>
                  {data.interviewActions.map((action, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder="Ej: Preparar respuesta para 'Cuéntame de ti'..."
                      value={action}
                      onChange={(e) => {
                        const newActions = [...data.interviewActions]
                        newActions[idx] = e.target.value
                        setData({ ...data, interviewActions: newActions })
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 mb-2 focus:outline-none focus:border-purple-500"
                    />
                  ))}
                  <Button
                    onClick={() => setData({ ...data, interviewActions: [...data.interviewActions, ''] })}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-300"
                  >
                    + Agregar acción
                  </Button>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">🔍 Acción Real: Búsqueda y Postulaciones</label>
                  {data.realActions.map((action, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder="Ej: Identificar 20 empresas target..."
                      value={action}
                      onChange={(e) => {
                        const newActions = [...data.realActions]
                        newActions[idx] = e.target.value
                        setData({ ...data, realActions: newActions })
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 mb-2 focus:outline-none focus:border-purple-500"
                    />
                  ))}
                  <Button
                    onClick={() => setData({ ...data, realActions: [...data.realActions, ''] })}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-300"
                  >
                    + Agregar acción
                  </Button>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${actionsValid ? 'bg-green-500/10 border-green-500/20' : 'bg-slate-800/30 border-slate-700'}`}>
                <div className="text-sm text-slate-300 flex items-center gap-2">
                  {actionsValid ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>Acciones completadas</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-slate-500" />
                      <span>Agrega al menos 1 acción por categoría</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* NOTION GUIDE STEP */}
          {step === 'notion-guide' && (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📲 Exporta tu plan a Notion</h3>
                <div className="space-y-4 text-slate-300">
                  <div className="flex gap-3">
                    <div className="text-2xl flex-shrink-0">1️⃣</div>
                    <div>
                      <p className="font-semibold text-white">Abre la Plantilla de Notion</p>
                      <a href="https://www.notion.so/template-plan-de-30-dias" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline text-sm mt-1 block">
                        Acceder a Plantilla →
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl flex-shrink-0">2️⃣</div>
                    <div>
                      <p className="font-semibold text-white">Copia la plantilla a tu workspace</p>
                      <p className="text-sm text-slate-400 mt-1">Botón "Duplicate" en la esquina superior derecha</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl flex-shrink-0">3️⃣</div>
                    <div>
                      <p className="font-semibold text-white">Completa con los datos de arriba</p>
                      <p className="text-slate-400 text-sm mt-1">
                        Visión: <strong>{data.role.substring(0, 50)}...</strong><br/>
                        Hitos: 30/60/90 días<br/>
                        Acciones: Las 4 categorías
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl flex-shrink-0">4️⃣</div>
                    <div>
                      <p className="font-semibold text-white">Exporta como PDF</p>
                      <p className="text-sm text-slate-400 mt-1">Menú: "..." → Export → PDF</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-300 text-sm">
                  <strong>Consejo:</strong> En Notion puedes organizar mejor tus tareas, agregar fechas, comentarios, y compartir con tu coach o mentor.
                </p>
              </div>
            </div>
          )}

          {/* NOTION UPLOAD STEP */}
          {step === 'notion-upload' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="text-center space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Sube tu plan desde Notion</h3>
                  <p className="text-slate-400">Exporta desde Notion (PDF/DOCX/TXT) y sube aquí para análisis</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0].name)
                      }
                    }}
                    className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                  />
                </label>

                {data.uploadedFileName && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-green-400 font-semibold">Archivo cargado</p>
                      <p className="text-green-300/70 text-sm">{data.uploadedFileName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ANALYSIS STEP */}
          {step === 'analysis' && (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin mb-4">
                  <Zap className="w-12 h-12 text-purple-500" />
                </div>
                <p className="text-white font-semibold">Analizando tu documento...</p>
                <p className="text-slate-400 text-sm mt-2">Evaluando visión, hitos, acciones y realismo</p>
              </div>
            </div>
          )}

          {/* RESULTS STEP */}
          {step === 'results' && (
            <div className="space-y-6">
              {data.analysisStatus === 'passed' ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                  <div className="flex gap-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">¡Felicidades! Día 1 completado</h3>
                      <p className="text-slate-300 mb-4">
                        Tu plan de 30 días está listo y validado. Ahora puedes empezar con Día 2.
                      </p>
                      <div className="bg-white/5 rounded p-3 mb-4">
                        <p className="text-sm text-slate-300">
                          <strong>Puntuación:</strong> {data.analysisScore}/100
                        </p>
                        <p className="text-sm text-green-400 mt-1">✓ Visión clara y específica</p>
                        <p className="text-sm text-green-400">✓ Hitos realistas y medibles</p>
                        <p className="text-sm text-green-400">✓ Acciones concretas identificadas</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
                  <div className="flex gap-4">
                    <AlertCircle className="w-8 h-8 text-amber-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Mejora tu plan</h3>
                      <p className="text-slate-300 mb-4">
                        Tu plan necesita algunos ajustes para ser más específico y realista.
                      </p>
                      <div className="bg-white/5 rounded p-3 mb-4 space-y-2">
                        <p className="text-sm text-slate-300">
                          <strong>Puntuación:</strong> {data.analysisScore}/100
                        </p>
                        <p className="text-sm text-amber-300">⚠ La visión podría ser más específica</p>
                        <p className="text-sm text-amber-300">⚠ Los hitos necesitan más detalle</p>
                        <p className="text-sm text-amber-300">⚠ Agrega más acciones concretas</p>
                      </div>
                      <p className="text-slate-400 text-sm">
                        Te vamos a devolver a la sección de visión para que hagas los ajustes necesarios.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-950 border-t border-slate-800 p-6 flex gap-3 justify-between">
          <Button
            onClick={() => {
              if (step === 'intro') setStep('intro')
              else if (step === 'vision') setStep('intro')
              else if (step === 'coach-offer') setStep('vision')
              else if (step === 'milestones') setStep('coach-offer')
              else if (step === 'actions') setStep('milestones')
              else if (step === 'notion-guide') setStep('actions')
              else if (step === 'notion-upload') setStep('notion-guide')
              else if (step === 'analysis') handleRedirectToFix()
              else if (step === 'results' && data.analysisStatus === 'needs-revision') handleRedirectToFix()
            }}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800/50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Atrás
          </Button>

          <Button
            onClick={() => {
              if (step === 'intro') setStep('vision')
              else if (step === 'vision' && visionValid) setStep('coach-offer')
              else if (step === 'coach-offer') setStep('milestones')
              else if (step === 'milestones' && milestonesValid) setStep('actions')
              else if (step === 'actions' && actionsValid) setStep('notion-guide')
              else if (step === 'notion-guide') setStep('notion-upload')
              else if (step === 'notion-upload' && data.uploadedFileName) handleNotionGuideNext()
              else if (step === 'results' && data.analysisStatus === 'passed') {
                // Day 1 complete - in real app, unlock Day 2
                alert('¡Día 1 completado! Día 2 está desbloqueado.')
              }
            }}
            disabled={
              (step === 'vision' && !visionValid) ||
              (step === 'milestones' && !milestonesValid) ||
              (step === 'actions' && !actionsValid) ||
              (step === 'notion-upload' && !data.uploadedFileName) ||
              step === 'analysis'
            }
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          >
            {step === 'results' && data.analysisStatus === 'passed' ? (
              <>
                Finalizar Tarea <ChevronRight className="w-4 h-4 ml-1" />
              </>
            ) : step === 'analysis' ? (
              'Analizando...'
            ) : (
              <>
                Siguiente <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
