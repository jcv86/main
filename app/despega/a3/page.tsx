'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Lock, 
  Play, 
  RotateCcw,
  User,
  Gem,
  FileText,
  Search,
  MessageSquare,
  Users,
  Mic,
  Video,
  AlertTriangle,
  Trophy
} from 'lucide-react'

// ============================================
// A3 BASIC LEVEL TRAINING PATH
// XP Total: 1,340 XP across 10 modules
// ============================================

// PILLAR 3 COLORS
// Primary: rgb(170, 70, 170) - magenta/purple
// Accent: rgb(80, 160, 170) - teal
// Neutrals: black, white, gray shades only

const PILLAR3_PRIMARY = 'rgb(170, 70, 170)'
const PILLAR3_ACCENT = 'rgb(80, 160, 170)'

interface Module {
  id: string
  number: number
  title: string
  shortDescription: string
  format: string
  inputMode: string
  interviewRequirement: string
  xp: number
  mainOutput: string
  cta: string
  tags: string[]
  requiredActivities: string[]
  icon: React.ReactNode
  route: string
}

const BASIC_LEVEL_MODULES: Module[] = [
  {
    id: 'career-mirror',
    number: 1,
    title: 'Espejo de Carrera',
    shortDescription: 'Comprende tu perfil profesional, tu diagnóstico del Nivel Básico, tus fortalezas, bloqueadores, y cómo los entrevistadores pueden percibirte.',
    format: 'Módulo de autodescubrimiento',
    inputMode: 'Tarjetas interactivas, reflexiones breves, confirmaciones',
    interviewRequirement: 'Sin entrevista requerida',
    xp: 80,
    mainOutput: 'Tarjeta de Espejo de Carrera',
    cta: 'Comenzar Espejo de Carrera',
    tags: ['Sin Entrevista', 'Autodescubrimiento', 'Claridad de Perfil'],
    requiredActivities: ['Revisar diagnóstico', 'Confirmarar precisión del diagnóstico', 'Seleccionar dirección principal de carrera', 'Definir identidad profesional actual', 'Save Tarjeta de Espejo de Carrera'],
    icon: <User className="w-5 h-5" />,
    route: '/despega/a3/career-mirror'
  },
  {
    id: 'value-mining-lab',
    number: 2,
    title: 'Laboratorio de Minería de Valor',
    shortDescription: 'Descubre el valor real oculto en tu experiencia laboral anterior y convierte tareas en logros.',
    format: 'Laboratorio de descubrimiento de logros',
    inputMode: 'Entrada de texto por defecto. Modo coach guiado opcional.',
    interviewRequirement: 'Sin entrevista requerida. Soporte de coach opcional disponible.',
    xp: 100,
    mainOutput: 'Banco de Logros Básico',
    cta: 'Abrir Laboratorio de Valor',
    tags: ['Constructor de Texto', 'Coach Opcional', 'Laboratorio de Logros'],
    requiredActivities: ['Escribir 5 tareas de experiencia anterior', 'Transformar tareas en declaraciones de valor', 'Completar transformación de responsabilidades', 'Crear 3 ejemplos de logros', 'Seleccionar 1 historia fuerte para respuestas futuras de entrevista'],
    icon: <Gem className="w-5 h-5" />,
    route: '/despega/a3/value-mining-lab'
  },
  {
    id: 'cv-builder-studio',
    number: 3,
    title: 'Estudio Constructor de CV',
    shortDescription: 'Crea o mejora un CV claro y atractivo para reclutadores usando el valor descubierto en módulos anteriores.',
    format: 'Módulo de creación de documentos y escritura profesional',
    inputMode: 'Carga de CV, entrada de texto manual, constructor guiado',
    interviewRequirement: 'Sin entrevista requerida',
    xp: 120,
    mainOutput: 'Borrador de CV Básico',
    cta: 'Construir Mi CV',
    tags: ['Constructor de CV', 'Sin Entrevista', 'Estudio de Documentos'],
    requiredActivities: ['Cargar o crear base de CV', 'Construir resumen profesional', 'Mejorar al menos 3 puntos de experiencia', 'Organizar sección de habilidades', 'Completar lista de verificación de información faltante'],
    icon: <FileText className="w-5 h-5" />,
    route: '/despega/a3/cv-builder-studio'
  },
  {
    id: 'job-decoder',
    number: 4,
    title: 'Decodificador de Ofertas',
    shortDescription: 'Analiza ofertas de trabajo reales para identificar requisitos clave, brechas de habilidades y estrategia de aplicación personalizada.',
    format: 'Herramienta de análisis de ofertas de trabajo',
    inputMode: 'Pegado de ofertas de trabajo, análisis guiado, mapeo de habilidades',
    interviewRequirement: 'Sin entrevista requerida',
    xp: 100,
    mainOutput: 'Mapa de Correspondencia de Oferta',
    cta: 'Decodificar Oferta de Trabajo',
    tags: ['Análisis de Ofertas', 'Sin Entrevista', 'Correspondencia de Rol'],
    requiredActivities: ['Pegar descripción de trabajo', 'Identificar requisitos clave', 'Categorizar obligatorios vs. opcionales', 'Mapear experiencia actual', 'Crear estrategia de aplicación personalizada'],
    icon: <Search className="w-5 h-5" />,
    route: '/despega/a3/job-decoder'
  },
  {
    id: 'answer-architecture',
    number: 5,
    title: 'Arquitectura de Respuestas',
    shortDescription: 'Domina marcos de respuesta probados (STAR, CAR) para construir respuestas de entrevista convincentes y estructuradas.',
    format: 'Módulo de arquitectura de respuestas',
    inputMode: 'Aprendizaje guiado, construcción de plantillas, práctica',
    interviewRequirement: 'Sin entrevista requerida',
    xp: 120,
    mainOutput: 'Banco de Respuestas de Entrevista',
    cta: 'Aprender Arquitectura de Respuestas',
    tags: ['Constructor de Respuestas', 'Voz Opcional', 'Método STAR'],
    requiredActivities: ['Dominar marcos STAR/CAR/PAR', 'Aprender 6 tipos de preguntas comunes', 'Practicar autopresentación de 30 segundos', 'Construir respuesta de motivación', 'Crear respuestas de fortaleza y desafío'],
    icon: <MessageSquare className="w-5 h-5" />,
    route: '/despega/a3/answer-architecture'
  },
  {
    id: 'coach-practice-room',
    number: 6,
    title: 'Sala de Práctica del Coach',
    shortDescription: 'Practica preguntas de entrevista comunes con retroalimentación inmediata del coach de IA y métricas de mejora.',
    format: 'Simulación interactiva con coach de IA',
    inputMode: 'Práctica de preguntas rápidas, grabación de voz, escritura de respuestas',
    interviewRequirement: 'Sin entrevista requerida',
    xp: 130,
    mainOutput: 'Informe de Métricas de Práctica',
    cta: 'Entrar a Sala de Práctica',
    tags: ['Práctica Interactiva', 'Retroalimentación del Coach', 'Método STAR'],
    requiredActivities: ['Completar preguntas rápidas', 'Practicar recorrido de CV', 'Responder preguntas conductuales', 'Recibir retroalimentación del coach', 'Monitorear métricas de mejora'],
    icon: <Mic className="w-5 h-5" />,
    route: '/despega/a3/coach-practice-room'
  },
  {
    id: 'communication-gym',
    number: 7,
    title: 'Gimnasio de Comunicación',
    shortDescription: 'Desarrolla habilidades de comunicación profesional: vocabulario, lenguaje corporal, escucha activa y generación de confianza.',
    format: 'Módulo de desarrollo de habilidades de comunicación',
    inputMode: 'Grabación de voz, autoevaluación, práctica guiada',
    interviewRequirement: 'Sin entrevista requerida',
    xp: 140,
    mainOutput: 'Perfil de Estilo de Comunicación',
    cta: 'Desarrollar Habilidades de Comunicación',
    tags: ['Comunicación Profesional', 'Práctica de Voz', 'Desarrollo de Habilidades'],
    requiredActivities: ['Evaluar estilo de comunicación actual', 'Aprender vocabulario profesional', 'Practicar señales de lenguaje corporal', 'Dominar técnicas de escucha activa', 'Construir habilidades de generación de confianza'],
    icon: <Users className="w-5 h-5" />,
    route: '/despega/a3/communication-gym'
  },
  {
    id: 'first-recruiter-simulation',
    number: 8,
    title: 'Primera Simulación con Reclutador',
    shortDescription: 'Simula tu primera interacción con un reclutador de recursos humanos para practicar el diálogo inicial y generación de confianza.',
    format: 'Simulación de reclutador virtual',
    inputMode: 'Conversación guiada, práctica de preguntas de filtrado, manejo de salario',
    interviewRequirement: 'Sin entrevista requerida',
    xp: 160,
    cta: 'Comenzar Simulación con Reclutador',
    tags: ['Simulación Interactiva', 'Práctica de Diálogo', 'Entrevista Simulada'],
    requiredActivities: ['Lista de verificación previa a la entrevista', 'Sección de apertura', 'Responder preguntas de filtrado', 'Navegar discusión de salario', 'Recibir informe de retroalimentación'],
    icon: <Video className="w-5 h-5" />,
    route: '/despega/a3/first-recruiter-simulation'
  },
  {
    id: 'risk-difficult-questions-lab',
    number: 9,
    title: 'Laboratorio de Preguntas Difíciles y de Riesgo',
    shortDescription: 'Identifica y maneja preguntas difíciles o de riesgo con fórmulas de respuesta segura y práctica bajo presión.',
    format: 'Laboratorio de preguntas de riesgo',
    inputMode: 'Análisis de riesgo, construcción de respuestas seguras, simulación de presión',
    interviewRequirement: 'Sin entrevista requerida',
    xp: 170,
    cta: 'Preparar Respuestas de Riesgo',
    tags: ['Gestión de Riesgo', 'Preguntas Difíciles', 'Práctica Bajo Presión'],
    requiredActivities: ['Identificar áreas de riesgo personal', 'Aprender fórmulas de respuesta segura', 'Identificar frases de alerta roja a evitar', 'Construir respuestas seguras preparadas', 'Completar simulación de presión de 3 preguntas'],
    icon: <AlertTriangle className="w-5 h-5" />,
    route: '/despega/a3/risk-difficult-questions-lab'
  },
  {
    id: 'basic-interview-mission',
    number: 10,
    title: 'Misión de Entrevista Básica',
    shortDescription: 'Misión final de certificación: realiza una entrevista simulada completa que valida el dominio de todas las habilidades del Nivel Básico.',
    format: 'Misión de certificación de entrevista completa',
    inputMode: 'Simulación de entrevista completa de 10+ preguntas',
    interviewRequirement: 'Entrevista simulada requerida',
    xp: 220,
    mainOutput: 'Certificación del Nivel Básico',
    cta: 'Comenzar Misión de Entrevista Básica',
    tags: ['Certificación', 'Entrevista Completa', 'Validación de Habilidades'],
    requiredActivities: ['Briefing de misión', 'Apertura', 'Preguntas de historial de antecedentes', 'Preguntas de motivación', 'Preguntas conductuales', 'Preguntas de riesgo', 'Cierre', 'Autoevaluación en 5 criterios', 'Generar informe de preparación', 'Completar certificación del Nivel Básico'],
    icon: <Trophy className="w-5 h-5" />,
    route: '/despega/a3/basic-interview-mission'
  }
]

const TOTAL_XP = BASIC_LEVEL_MODULES.reduce((sum, module) => sum + module.xp, 0)

type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'completed'

interface ModuleProgreso {
  status: ModuleStatus
  progress: number // 0-100
  earnedXp: number
  completedActivities: number
}

export default function A3BasicLevelTrainingPath() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [moduleProgreso, setModuleProgreso] = useState<Record<string, ModuleProgreso>>({})
  const [selectedPath, setSelectedPath] = useState<'30' | '60' | '90'>('30')
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  // Calculate totals
  const earnedXp = Object.values(moduleProgreso).reduce((sum, p) => sum + p.earnedXp, 0)
  const completedModules = Object.values(moduleProgreso).filter(p => p.status === 'completed').length
  const progressPercentage = Math.round((earnedXp / TOTAL_XP) * 100)
  
  // Find current and next module
  const currentModule = BASIC_LEVEL_MODULES.find(m => {
    const progress = moduleProgreso[m.id]
    return progress?.status === 'in_progress' || progress?.status === 'available'
  })
  const nextModule = currentModule 
    ? BASIC_LEVEL_MODULES.find(m => m.number === currentModule.number + 1)
    : BASIC_LEVEL_MODULES[0]

  useEffect(() => {
    const fetchProgreso = async () => {
      try {
        const response = await fetch('/api/a3/user-progress', {
          credentials: 'include',
          cache: 'no-store'
        })
        
        if (response.ok) {
          const { progress } = await response.json()
          
          // Map API response to our module structure
          const progressMap: Record<string, ModuleProgreso> = {}
          
          BASIC_LEVEL_MODULES.forEach((module, index) => {
            const apiStatus = progress?.moduleStates?.[module.id]
            let status: ModuleStatus = 'locked'
            
            if (apiStatus === 'completed') {
              status = 'completed'
            } else if (apiStatus === 'in_progress') {
              status = 'in_progress'
            } else if (apiStatus === 'available' || index === 0) {
              status = 'available'
            } else {
              // Check if previous module is completed
              const prevModule = BASIC_LEVEL_MODULES[index - 1]
              const prevStatus = progress?.moduleStates?.[prevModule.id]
              if (prevStatus === 'completed') {
                status = 'available'
              }
            }
            
            progressMap[module.id] = {
              status,
              progress: status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0,
              earnedXp: status === 'completed' ? module.xp : 0,
              completedActivities: status === 'completed' ? module.requiredActivities.length : 0
            }
          })
          
          setModuleProgreso(progressMap)
        } else {
          // Default: first module available, rest locked
          const defaultProgreso: Record<string, ModuleProgreso> = {}
          BASIC_LEVEL_MODULES.forEach((module, index) => {
            defaultProgreso[module.id] = {
              status: index === 0 ? 'available' : 'locked',
              progress: 0,
              earnedXp: 0,
              completedActivities: 0
            }
          })
          setModuleProgreso(defaultProgreso)
        }
      } catch (error) {
        console.error('Error fetching progress:', error)
        // Default state
        const defaultProgreso: Record<string, ModuleProgreso> = {}
        BASIC_LEVEL_MODULES.forEach((module, index) => {
          defaultProgreso[module.id] = {
            status: index === 0 ? 'available' : 'locked',
            progress: 0,
            earnedXp: 0,
            completedActivities: 0
          }
        })
        setModuleProgreso(defaultProgreso)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProgreso()
  }, [])

  const getStatusBadge = (status: ModuleStatus) => {
    switch (status) {
      case 'completed':
        return <Badge style={{ backgroundColor: 'rgba(170, 70, 170, 0.3)', color: 'rgb(200, 130, 200)', borderColor: 'rgba(170, 70, 170, 0.5)' }} className="border">Completado</Badge>
      case 'in_progress':
        return <Badge style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', color: 'rgb(80, 160, 170)', borderColor: 'rgba(80, 160, 170, 0.4)' }} className="border">En Progreso</Badge>
      case 'available':
        return <Badge style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)', color: 'rgb(170, 70, 170)', borderColor: 'rgba(170, 70, 170, 0.4)' }} className="border">Disponible</Badge>
      case 'locked':
        return <Badge className="bg-white/10 text-white/50 border-white/20 border">Bloqueado</Badge>
    }
  }

  const getTagStyle = (tag: string) => {
    if (tag.includes('Sin Entrevista') || tag.includes('Optional')) {
      return { backgroundColor: 'rgba(80, 160, 170, 0.2)', color: 'rgb(80, 160, 170)' }
    }
    if (tag.includes('Required') || tag.includes('Live') || tag.includes('Voice') || tag.includes('Video')) {
      return { backgroundColor: 'rgba(170, 70, 170, 0.2)', color: 'rgb(200, 130, 200)' }
    }
    if (tag.includes('Final')) {
      return { backgroundColor: 'rgba(170, 70, 170, 0.3)', color: 'rgb(170, 70, 170)' }
    }
    return { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.7)' }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: PILLAR3_PRIMARY }} />
          <p className="text-white/70">Loading your progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background with pillar 3 color */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0" 
          style={{ 
            background: `linear-gradient(to bottom, rgba(170, 70, 170, 0.08) 0%, transparent 30%, transparent 100%)` 
          }} 
        />
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* ========== HEADER ========== */}
        <div className="space-y-6">
          <Link href="/despega">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Atrás
            </Button>
          </Link>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              A3 — Ruta de Entrenamiento Nivel Básico
            </h1>
            <p className="text-lg text-white/70 max-w-3xl">
              Un viaje guiado de 10 módulos para construir claridad, confianza, estructura y preparación de entrevista paso a paso.
            </p>
            <p className="text-white/60 leading-relaxed max-w-3xl">
              El Nivel Básico está diseñado para usuarios que necesitan más estructura antes de enfrentar entrevistas reales. 
              Este camino comienza con aprendizaje profundo y claridad profesional, luego se mueve hacia construcción de CV, 
              decodificación de ofertas, preparación de respuestas, práctica con coach, ejercicios de comunicación, simulaciones con reclutadores, 
              entrenamiento de preguntas difíciles y una misión de entrevista realista final.
            </p>
          </div>

          {/* Status Badges - using pillar 3 colors */}
          <div className="flex flex-wrap gap-3">
            <Badge 
              style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', color: 'rgb(80, 160, 170)', borderColor: 'rgba(80, 160, 170, 0.4)' }} 
              className="border px-3 py-1"
            >
              Nivel: Básico
            </Badge>
            <Badge 
              style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)', color: 'rgb(200, 130, 200)', borderColor: 'rgba(170, 70, 170, 0.4)' }} 
              className="border px-3 py-1"
            >
              Modo de Entrenamiento: Educativo + Guiado + Simulado
            </Badge>
            <Badge 
              style={{ backgroundColor: 'rgba(170, 70, 170, 0.3)', color: 'rgb(170, 70, 170)', borderColor: 'rgba(170, 70, 170, 0.5)' }} 
              className="border px-3 py-1"
            >
              Ruta Total: {TOTAL_XP.toLocaleString()} XP
            </Badge>
            <Badge className="bg-white/10 text-white/70 border-white/20 border px-3 py-1">
              Ruta Seleccionada: {selectedPath} Días
            </Badge>
          </div>
        </div>

        {/* ========== MAIN PROGRESS BAR ========== */}
        <Card 
          className="bg-white/5 border p-6 space-y-4"
          style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
        >
          <h2 className="text-lg font-semibold text-white">Tu Progreso del Nivel Básico</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">{progressPercentage}% completado</span>
              <span className="font-medium" style={{ color: PILLAR3_PRIMARY }}>{earnedXp.toLocaleString()} / {TOTAL_XP.toLocaleString()} XP</span>
            </div>
            {/* Custom progress bar with pillar 3 color */}
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progressPercentage}%`,
                  background: `linear-gradient(90deg, ${PILLAR3_PRIMARY}, rgba(170, 70, 170, 0.7))`
                }}
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div 
              className="bg-white/5 rounded-lg p-4 border"
              style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
            >
              <p className="text-2xl font-bold" style={{ color: PILLAR3_PRIMARY }}>{earnedXp}</p>
              <p className="text-xs text-white/50">XP Ganados from {TOTAL_XP}</p>
            </div>
            <div 
              className="bg-white/5 rounded-lg p-4 border"
              style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
            >
              <p className="text-2xl font-bold text-white">{completedModules} / 10</p>
              <p className="text-xs text-white/50">Módulos completados</p>
            </div>
            <div 
              className="bg-white/5 rounded-lg p-4 border"
              style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
            >
              <p className="text-lg font-bold text-white truncate">{currentModule?.title || 'Espejo de Carrera'}</p>
              <p className="text-xs text-white/50">Enfoque Actual</p>
            </div>
            <div 
              className="bg-white/5 rounded-lg p-4 border"
              style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
            >
              <p className="text-lg font-bold text-white/70 truncate">{nextModule?.title || 'Complete!'}</p>
              <p className="text-xs text-white/50">Siguiente Desbloqueo</p>
            </div>
          </div>
        </Card>

        {/* ========== MODULE CARDS ========== */}
        <div className="space-y-4">
          {BASIC_LEVEL_MODULES.map((module) => {
            const progress = moduleProgreso[module.id] || { status: 'locked', progress: 0, earnedXp: 0, completedActivities: 0 }
            const isLocked = progress.status === 'locked'
            const isExpanded = expandedModule === module.id
            const prevModule = module.number > 1 ? BASIC_LEVEL_MODULES[module.number - 2] : null

            return (
              <Card 
                key={module.id}
                className={`bg-white/5 overflow-hidden transition-all border ${
                  isLocked ? 'opacity-60 border-white/10' : ''
                }`}
                style={{ 
                  borderColor: isLocked ? undefined : 'rgba(170, 70, 170, 0.2)'
                }}
                onMouseEnter={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.borderColor = 'rgba(170, 70, 170, 0.5)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLocked) {
                    e.currentTarget.style.borderColor = 'rgba(170, 70, 170, 0.2)'
                  }
                }}
              >
                <div 
                  className={`p-6 ${!isLocked ? 'cursor-pointer' : ''}`}
                  onClick={() => !isLocked && setExpandedModule(isExpanded ? null : module.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Module Number & Icon */}
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: progress.status === 'completed' 
                          ? 'rgba(170, 70, 170, 0.3)' 
                          : progress.status === 'available' || progress.status === 'in_progress'
                            ? 'rgba(170, 70, 170, 0.2)'
                            : 'rgba(255, 255, 255, 0.1)',
                        color: progress.status === 'completed' || progress.status === 'available' || progress.status === 'in_progress'
                          ? 'rgb(200, 130, 200)'
                          : 'rgba(255, 255, 255, 0.4)'
                      }}
                    >
                      {progress.status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : progress.status === 'locked' ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        module.icon
                      )}
                    </div>

                    {/* Module Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-white/50">Module {module.number}</span>
                        {getStatusBadge(progress.status)}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mt-1">{module.title}</h3>
                      <p className="text-white/60 text-sm mt-1 line-clamp-2">{module.shortDescription}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {module.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-xs px-2 py-1 rounded"
                            style={getTagStyle(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Unlock Message */}
                      {isLocked && prevModule && (
                        <p className="text-sm mt-3" style={{ color: 'rgba(170, 70, 170, 0.7)' }}>
                          Complete {prevModule.title} to unlock this step.
                        </p>
                      )}
                    </div>

                    {/* XP Badge */}
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: PILLAR3_PRIMARY }}>{module.xp} XP</p>
                      <p className="text-xs text-white/50">{module.format}</p>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && !isLocked && (
                    <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-white/70 mb-2">Actividades Requeridas</h4>
                          <ul className="space-y-2">
                            {module.requiredActivities.map((activity, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                                <div 
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                  style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)', color: PILLAR3_PRIMARY }}
                                >
                                  {idx + 1}
                                </div>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white/70 mb-2">Output</h4>
                          <p className="text-sm text-white/60">{module.mainOutput}</p>
                          
                          <h4 className="text-sm font-medium text-white/70 mt-4 mb-2">Input Mode</h4>
                          <p className="text-sm text-white/60">{module.inputMode}</p>
                          
                          <h4 className="text-sm font-medium text-white/70 mt-4 mb-2">Interview Requirement</h4>
                          <p className="text-sm text-white/60">{module.interviewRequirement}</p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Link href={module.route} className="flex-1">
                          <Button 
                            className="w-full text-white"
                            style={{ 
                              backgroundColor: PILLAR3_PRIMARY,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(170, 70, 170, 0.8)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = PILLAR3_PRIMARY
                            }}
                          >
                            {progress.status === 'completed' ? (
                              <>
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Revisar Módulo
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                {module.cta}
                              </>
                            )}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* ========== SUMMARY TABLE ========== */}
        <Card 
          className="bg-white/5 border p-6"
          style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Module Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}>
                  <th className="text-left py-2 text-white/50 font-medium">#</th>
                  <th className="text-left py-2 text-white/50 font-medium">Module</th>
                  <th className="text-left py-2 text-white/50 font-medium">Format</th>
                  <th className="text-left py-2 text-white/50 font-medium">XP</th>
                  <th className="text-left py-2 text-white/50 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {BASIC_LEVEL_MODULES.map(module => {
                  const progress = moduleProgreso[module.id]
                  return (
                    <tr key={module.id} className="border-b" style={{ borderColor: 'rgba(170, 70, 170, 0.1)' }}>
                      <td className="py-3 text-white/50">{module.number}</td>
                      <td className="py-3 text-white">{module.title}</td>
                      <td className="py-3 text-white/60">{module.format}</td>
                      <td className="py-3" style={{ color: PILLAR3_PRIMARY }}>{module.xp} XP</td>
                      <td className="py-3">{getStatusBadge(progress?.status || 'locked')}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="border-t" style={{ borderColor: 'rgba(170, 70, 170, 0.3)' }}>
                  <td colSpan={3} className="py-3 font-semibold text-white">Total</td>
                  <td className="py-3 font-bold" style={{ color: PILLAR3_PRIMARY }}>{TOTAL_XP} XP</td>
                  <td className="py-3 text-white/60">{completedModules}/10 completed</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* ========== HOW PROGRESS WORKS ========== */}
        <Card 
          className="bg-white/5 border p-6"
          style={{ borderColor: 'rgba(170, 70, 170, 0.2)' }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Cómo Funciona el Progreso</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)' }}
              >
                <span style={{ color: PILLAR3_PRIMARY }}>1</span>
              </div>
              <h3 className="font-medium text-white">Complete modules in order</h3>
              <p className="text-sm text-white/60">Each module unlocks the next. Complete all required activities to earn XP.</p>
            </div>
            <div className="space-y-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)' }}
              >
                <span style={{ color: PILLAR3_PRIMARY }}>2</span>
              </div>
              <h3 className="font-medium text-white">Build your interview toolkit</h3>
              <p className="text-sm text-white/60">Each module produces outputs you&apos;ll use in later modules and real interviews.</p>
            </div>
            <div className="space-y-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)' }}
              >
                <span style={{ color: PILLAR3_PRIMARY }}>3</span>
              </div>
              <h3 className="font-medium text-white">Reach 1,340 XP</h3>
              <p className="text-sm text-white/60">Complete all 10 modules to finish Basic Level and unlock Intermediate training.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
