'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ASection, ASectionPart } from '@/components/a-section-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, BookOpen, Users, Target, Zap, Phone } from 'lucide-react'

const despegaLabels: Record<string, string> = {
  D: 'Impulsor',
  I: 'Catalizador',
  S: 'Estabilizador',
  C: 'Arquitecto'
}

const despegaDescriptions: Record<string, string> = {
  D: 'Orientado a Resultados - Decisivo, directo, orientado a metas',
  I: 'Orientado a Personas - Entusiasta, comunicador, inspirador',
  S: 'Orientado a Estabilidad - Colaborador, paciente, confiable',
  C: 'Orientado a Calidad - Analítico, detallista, minucioso'
}

const patternDetails: Record<string, { strengths: string[], challenges: string[], teamRole: string, career: string[] }> = {
  D: {
    strengths: ['Toma decisiones rápidas', 'Motivador y directo', 'Genera resultados bajo presión', 'Líder natural'],
    challenges: ['Puede ser impaciente', 'A veces no escucha lo suficiente', 'Tiende a ser competitivo', 'Puede parecer frío'],
    teamRole: 'Generalmente asume roles de liderazgo y gestión de proyectos estratégicos',
    career: ['Gestor de Proyectos', 'Emprendedor', 'Líder de Ventas', 'Director Ejecutivo', 'Estratega']
  },
  I: {
    strengths: ['Excelente comunicador', 'Inspira a otros', 'Creativo y flexible', 'Construye relaciones'],
    challenges: ['Puede distraerse fácilmente', 'Tiende a hablar demasiado', 'Menos atención a detalles', 'Decisiones impulsivas'],
    teamRole: 'Generalmente asume roles de comunicación, marketing y relaciones públicas',
    career: ['Especialista en Marketing', 'Presentador', 'Coach', 'Recruiter', 'Comunicador']
  },
  S: {
    strengths: ['Excelente oyente', 'Leal y confiable', 'Trabaja bien en equipo', 'Paciente'],
    challenges: ['Puede ser muy pasivo', 'Reticencia al cambio', 'Tiene dificultad diciendo no', 'Baja iniciativa propia'],
    teamRole: 'Generalmente asume roles de soporte, coordinación y work relaciones interpersonales',
    career: ['Especialista en Recursos Humanos', 'Community Manager', 'Coordinador', 'Asistente', 'Facilitador']
  },
  C: {
    strengths: ['Muy analítico', 'Atención extrema al detalle', 'Sistemático y organizado', 'Pensamiento crítico'],
    challenges: ['Puede ser demasiado crítico', 'Perfeccionista a ultranza', 'Lentitud en decisiones', 'Dificultad con cambios rápidos'],
    teamRole: 'Generalmente asume roles de análisis, calidad y procesos',
    career: ['Ingeniero', 'Analista de Datos', 'QA Specialist', 'Auditor', 'Especialista en Compliance']
  }
}

export default function A1PatternsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const profile = (searchParams.get('profile') as string) || 'D'
  
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'strengths' | 'challenges' | 'interview' | 'career'>('strengths')

  useEffect(() => {
    // Simular carga
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const details = patternDetails[profile] || patternDetails.D
  const label = despegaLabels[profile] || 'Impulsor'
  const description = despegaDescriptions[profile] || ''

  if (loading) {
    return (
      <ASection title="Tus Patrones de Personalidad" subtitle="Cómo Influyen en Tu Carrera" icon="🧠" colorClass="from-purple/50">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-white0" />
        </div>
      </ASection>
    )
  }

  return (
    <ASection title="Tus Patrones de Personalidad" subtitle="Cómo Influyen en Tu Carrera" icon="🧠" colorClass="from-purple/50">
      <ASectionPart title={`Tu Perfil: ${label}`} icon={<Target />}>
        {/* Profile Header */}
        <div className="bg-purple rounded-xl p-8 text-white mb-8 shadow-lg">
          <p className="text-white text-sm mb-2 font-semibold">Perfil Cerebral Identificado</p>
          <h1 className="text-5xl font-black mb-3">{label}</h1>
          <p className="text-lg text-white font-medium">{description}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-muted/80/50 p-4 rounded-[28px]">
          {(['strengths', 'challenges', 'interview', 'career'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedTab === tab
                  ? 'bg-purple text-white shadow-lg'
                  : 'bg-muted/70 text-white/85 hover:bg-muted/60'
              }`}
            >
              {tab === 'strengths' && '💪 Fortalezas'}
              {tab === 'challenges' && '⚠️ Desafíos'}
              {tab === 'interview' && '📞 En Entrevistas'}
              {tab === 'career' && '🚀 Carreras'}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {selectedTab === 'strengths' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6">Tus Fortalezas Naturales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {details.strengths.map((strength, idx) => (
                <Card key={idx} className="bg-background">
                  <CardContent className="pt-6">
                    <p className="text-green font-semibold text-lg">✓ {strength}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'challenges' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-6">Desafíos a Considerar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {details.challenges.map((challenge, idx) => (
                <Card key={idx} className="bg-background">
                  <CardContent className="pt-6">
                    <p className="text-yellow font-semibold text-lg">⚠️ {challenge}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'interview' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Cómo Destacar en Entrevistas</h3>
            
            <Card className="bg-muted/80/50 border-muted/70 border-2">
              <CardHeader>
                <CardTitle className="text-white">Tu Ventaja Natural</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/85">{details.teamRole}</p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Consejos de Entrevista</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile === 'D' && (
                  <>
                    <p>✓ Muestra ejemplos de liderazgo y resultados cuantificables</p>
                    <p>✓ Destaca tu capacidad para manejar situaciones de presión</p>
                    <p>✓ Menciona cómo has motivado a otros</p>
                    <p>✓ Sé conciso y directo en tus respuestas</p>
                  </>
                )}
                {profile === 'I' && (
                  <>
                    <p>✓ Cuenta historias que muestren tu carisma</p>
                    <p>✓ Destaca tus habilidades de comunicación</p>
                    <p>✓ Muestra entusiasmo genuino por la rol</p>
                    <p>✓ Enfatiza tus capacidades para inspirar a otros</p>
                  </>
                )}
                {profile === 'S' && (
                  <>
                    <p>✓ Destaca tu lealtad y confiabilidad</p>
                    <p>✓ Muestra ejemplos de trabajo en equipo</p>
                    <p>✓ Sé honesto sobre tu preferencia por ambientes estables</p>
                    <p>✓ Enfatiza tu capacidad para mantener relaciones a largo plazo</p>
                  </>
                )}
                {profile === 'C' && (
                  <>
                    <p>✓ Presenta datos y análisis concretos</p>
                    <p>✓ Muestra tu atención al detalle</p>
                    <p>✓ Destaca procesos que has mejorado</p>
                    <p>✓ Sé honesto sobre tu necesidad de claridad y estructura</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'career' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Carreras Ideales para Ti</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {details.career.map((role, idx) => (
                <Card key={idx} className="bg-background">
                  <CardContent className="pt-6">
                    <p className="text-white font-semibold text-lg">🎯 {role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="mt-12 pt-8 border-t border-muted/70">
          <h3 className="text-2xl font-bold text-white mb-6">Próximos Pasos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call Entrena
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/85 mb-4">Practica entrevistas específicas para tu perfil</p>
                <Button 
                  onClick={() => router.push(`/despega/a1-call-entrena?profile=${profile}`)}
                  className="w-full bg-blue hover:from-blue hover:to-blue"
                >
                  Comenzar Práctica
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/80/40 border-muted/70">
              <CardHeader>
                <CardTitle>Ir a Tu Ruta</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/85 mb-4">Crea tu plan personalizado de 90 días</p>
                <Button 
                  onClick={() => router.push('/despega/a2-routes')}
                  className="w-full bg-purple/80 hover:bg-purple/70"
                >
                  Siguiente Etapa
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ASectionPart>
    </ASection>
  )
}
