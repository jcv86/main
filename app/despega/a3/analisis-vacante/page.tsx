'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Upload, FileText, Search, CheckCircle2, AlertCircle, TrendingUp, Download } from 'lucide-react'
import { ModuleCompletionScreen } from '@/components/module-completion-screen'

const SAMPLE_JOB_DESCRIPTION = `Senior Software Engineer - Full Stack
Ubicación: Madrid, España
Empresa: Tech Innovators Inc

Descripción del Puesto:
Buscamos un Senior Software Engineer para unirse a nuestro equipo de 15 personas. Serás responsable de diseñar e implementar soluciones de software escalables usando tecnologías modernas. Trabajarás en un ambiente ágil, colaborativo y de rápido crecimiento.

Responsabilidades:
- Diseñar y desarrollar aplicaciones web full-stack usando React, Node.js y PostgreSQL
- Mentorizar a desarrolladores junior y conducir sesiones de code review
- Colaborar con product managers y diseñadores en la definición de requisitos
- Participar en decisiones de arquitectura y mejora de procesos
- Resolver problemas complejos de rendimiento y escalabilidad
- Contribuir a la documentación técnica y mejores prácticas del equipo

Requisitos Obligatorios:
- 5+ años de experiencia en desarrollo de software
- Expertise en React.js y Node.js
- Experiencia con bases de datos SQL (PostgreSQL preferentemente)
- Sólido conocimiento de principios de diseño de software y patrones
- Experiencia trabajando en equipos ágiles
- Excelentes habilidades de comunicación
- Fluidez en inglés (C1 mínimo)

Requisitos Deseables:
- Experiencia con AWS o infraestructura cloud
- Conocimiento de Docker y containerización
- Experiencia con GraphQL
- Certificaciones relevantes
- Contribuciones a proyectos open source
- Experiencia en startups o ambiente de rápido crecimiento

Ofrecemos:
- Salario: €65,000 - €85,000 brutos anuales
- Bonificación por rendimiento 15-20%
- Trabajo flexible: 2 días en oficina, 3 remoto
- 25 días de vacaciones + 5 días de formación
- Seguro de salud completo
- Presupuesto de desarrollo profesional
- Ambiente colaborativo y de aprendizaje
`

const JOB_ANALYSIS = {
  keySkills: [
    { skill: 'React.js', required: true, yourLevel: 'Expert' },
    { skill: 'Node.js', required: true, yourLevel: 'Advanced' },
    { skill: 'PostgreSQL', required: true, yourLevel: 'Intermediate' },
    { skill: 'AWS', required: false, yourLevel: 'None' },
    { skill: 'Docker', required: false, yourLevel: 'Intermediate' },
    { skill: 'GraphQL', required: false, yourLevel: 'None' }
  ],
  softSkills: [
    { skill: 'Liderazgo técnico', importance: 'Alta' },
    { skill: 'Mentoría', importance: 'Alta' },
    { skill: 'Comunicación', importance: 'Alta' },
    { skill: 'Pensamiento analítico', importance: 'Alta' },
    { skill: 'Trabajo en equipo', importance: 'Media' }
  ],
  experienceRequired: '5+ años',
  industryPreference: 'Tech/Comenzarups',
  matchScore: 78,
  gaps: [
    { gap: 'AWS - No mencionaste experiencia', priority: 'Media', action: 'Menciona proyectos personales o cursos completados' },
    { gap: 'PostgreSQL - Solo nivel intermedio', priority: 'Media', action: 'Destaca experiencia con SQL en general' },
    { gap: 'Experiencia startup - No clara', priority: 'Media', action: 'Enfatiza adaptabilidad y ritmo de trabajo' }
  ],
  strengths: [
    'Experiencia React excepcional',
    'Track record de mentoría',
    'Excelente comunicación en inglés',
    'Experiencia en equipos ágiles'
  ]
}

export default function AnalisisVacantePagePage() {
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_DESCRIPTION)
  const [analysisTab, setAnalysisTab] = useState<'overview' | 'skills' | 'gaps' | 'prep'>('overview')
  const [isCompleted, setIsCompleted] = useState(false)

  const matchScoreColor = JOB_ANALYSIS.matchScore >= 80 ? 'text-green-400' : JOB_ANALYSIS.matchScore >= 60 ? 'text-yellow-400' : 'text-[rgb(80,160,170)]-400'
  const matchBgColor = JOB_ANALYSIS.matchScore >= 80 ? 'bg-green-500/10' : JOB_ANALYSIS.matchScore >= 60 ? 'bg-yellow-500/10' : 'bg-[rgba(80,160,170,0.5)]-500/10'

  if (isCompleted) {
    return <ModuleCompletionScreen moduleId="analisis-vacante" moduleName="Análisis de Vacante" xpEarned={120} />
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
              <Search className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Análisis de Vacante</h1>
              <p className="text-white/60 mt-1">Analiza descripciones de empleo para identificar habilidades clave y preparate específicamente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Job Description Input */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Pega la Descripción del Puesto</h3>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Pega aquí la descripción completa del puesto..."
            className="w-full rounded-[20px] bg-black border border-purple-500/30 rounded-lg p-4 text-white placeholder-white/30 focus:border-purple-500 focus:outline-none min-h-40 font-mono text-sm"
          />
          <p className="text-xs text-white/40 mt-2">Nota: Esta es una demostración con análisis pre-generado</p>
        </div>

        {/* Analysis Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className={`bg-black border-2 ${matchBgColor}`}>
            <CardContent className="pt-6">
              <p className="text-white/60 text-sm mb-2">Compatibilidad General</p>
              <p className={`text-4xl font-bold ${matchScoreColor}`}>{JOB_ANALYSIS.matchScore}%</p>
              <p className="text-xs text-white/40 mt-2">Basado en tu perfil actual</p>
            </CardContent>
          </Card>

          <Card className="rounded-[2px] bg-black border-purple-500/30">
            <CardContent className="pt-6">
              <p className="text-white/60 text-sm mb-2">Años Requeridos</p>
              <p className="text-2xl font-bold">{JOB_ANALYSIS.experienceRequired}</p>
              <Badge className="mt-3 bg-purple-500/20 text-purple-300">Senior Level</Badge>
            </CardContent>
          </Card>

          <Card className="rounded-[2px] bg-black border-purple-500/30">
            <CardContent className="pt-6">
              <p className="text-white/60 text-sm mb-2">Factores de Éxito</p>
              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex-1 h-2 rounded bg-purple-500/20" />
                ))}
              </div>
              <p className="text-xs text-white/40 mt-2">4/5 factores destacados</p>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { tab: 'overview', label: 'Resumen' },
            { tab: 'skills', label: 'Habilidades' },
            { tab: 'gaps', label: 'Brechas' },
            { tab: 'prep', label: 'Preparación' }
          ].map((item) => (
            <Button
              key={item.tab}
              onClick={() => setAnalysisTab(item.tab as typeof analysisTab)}
              variant={analysisTab === item.tab ? 'default' : 'outline'}
              className={analysisTab === item.tab ? 'bg-purple-600' : 'border-purple-500/30 text-white'}
            >
              {item.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {analysisTab === 'overview' && (
          <div className="space-y-6">
            <Card className="rounded-[2px] bg-black border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Tus Fortalezas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {JOB_ANALYSIS.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-green-500/10 rounded border border-green-500/20">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <p className="text-white/70">{strength}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[2px] bg-black border-purple-500/30">
              <CardHeader>
                <CardTitle>Requerimientos Clave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold text-white/80 mb-2">Experiencia Requerida:</p>
                  <p className="text-white/60">{JOB_ANALYSIS.experienceRequired} en desarrollo de software</p>
                </div>
                <div>
                  <p className="font-semibold text-white/80 mb-2">Contexto Laboral:</p>
                  <p className="text-white/60">Ambiente ágil, equipo colaborativo, empresa tech en crecimiento</p>
                </div>
                <div>
                  <p className="font-semibold text-white/80 mb-2">Oportunidad de Crecimiento:</p>
                  <p className="text-white/60">Liderazgo técnico, mentoría, impacto arquitectónico</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Skills Tab */}
        {analysisTab === 'skills' && (
          <div className="space-y-6">
            <Card className="rounded-[2px] bg-black border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-lg">Habilidades Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {JOB_ANALYSIS.keySkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-purple-500/20 rounded">
                    <div className="flex-1">
                      <p className="font-semibold text-white">{skill.skill}</p>
                      <p className="text-xs text-white/60">Tu nivel: {skill.yourLevel}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {skill.required ? (
                        <Badge className="bg-[rgba(80,160,170,0.5)]-500/20 text-[rgb(80,160,170)]-300">Requerido</Badge>
                      ) : (
                        <Badge className="bg-blue-500/20 text-blue-300">Deseado</Badge>
                      )}
                      <div className={`w-2 h-2 rounded-full ${
                        skill.yourLevel === 'Expert' ? 'bg-green-500' :
                        skill.yourLevel === 'Advanced' ? 'bg-yellow-500' :
                        skill.yourLevel === 'Intermediate' ? 'bg-orange-500' : 'bg-[rgba(80,160,170,0.5)]-500'
                      }`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[2px] bg-black border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-lg">Habilidades Blandas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {JOB_ANALYSIS.softSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-purple-500/20 rounded">
                    <p className="font-semibold text-white">{skill.skill}</p>
                    <Badge className={skill.importance === 'Alta' ? 'bg-[rgba(80,160,170,0.5)]-500/20 text-[rgb(80,160,170)]-300' : 'bg-yellow-500/20 text-yellow-300'}>
                      {skill.importance} Importancia
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gaps Tab */}
        {analysisTab === 'gaps' && (
          <div className="space-y-6">
            <Card className="rounded-[2px] bg-[rgba(80,160,170,0.5)]-500/5 border-[rgb(80,160,170)]-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[rgb(80,160,170)]-300">
                  <AlertCircle className="w-5 h-5" />
                  Brechas Identificadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {JOB_ANALYSIS.gaps.map((gap, idx) => (
                  <div key={idx} className="p-4 bg-black border border-[rgb(80,160,170)]-500/20 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <AlertCircle className="w-4 h-4 text-[rgb(80,160,170)]-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-white">{gap.gap}</p>
                        <Badge className={gap.priority === 'Alta' ? 'bg-[rgba(80,160,170,0.5)]-500/20 text-[rgb(80,160,170)]-300 mt-2' : 'bg-yellow-500/20 text-yellow-300 mt-2'}>
                          Prioridad {gap.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-purple-300 ml-7 mt-2">Acción: {gap.action}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[2px] bg-black border-purple-500/30">
              <CardHeader>
                <CardTitle>Plan de Acción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white/70 text-sm">
                  Para maximizar tus posibilidades en esta entrevista:
                </p>
                <ol className="space-y-2">
                  <li className="text-sm text-white/70 flex gap-3">
                    <span className="text-purple-400 font-bold">1.</span>
                    <span>Prepara ejemplos específicos con React y Node.js</span>
                  </li>
                  <li className="text-sm text-white/70 flex gap-3">
                    <span className="text-purple-400 font-bold">2.</span>
                    <span>Destaca experiencia de mentoría e impacto en el equipo</span>
                  </li>
                  <li className="text-sm text-white/70 flex gap-3">
                    <span className="text-purple-400 font-bold">3.</span>
                    <span>Investiga sobre su tech stack y cultura company</span>
                  </li>
                  <li className="text-sm text-white/70 flex gap-3">
                    <span className="text-purple-400 font-bold">4.</span>
                    <span>Prepárate para preguntas sobre escalabilidad</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Prep Tab */}
        {analysisTab === 'prep' && (
          <div className="space-y-6">
            <Card className="rounded-[2px] bg-black border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  Preguntas Probables en la Entrevista
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Cuéntame sobre un proyecto donde lideraste la arquitectura técnica',
                  'Cómo mentorias a desarrolladores junior?',
                  'Experiencia con PostgreSQL y optimización de queries',
                  'Trabajo en equipo ágil - ¿cómo manejaste conflictos?',
                  'Desafío más difícil en performance y cómo lo resolviste'
                ].map((q, idx) => (
                  <div key={idx} className="p-3 border border-purple-500/20 rounded flex gap-3">
                    <span className="text-purple-400 font-bold flex-shrink-0">{idx + 1}.</span>
                    <p className="text-white/70 text-sm">{q}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[2px] bg-blue-500/5 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-300">Próximos Pasos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Usa el Método STAR</p>
                    <p className="text-sm text-white/60">Estructura tus respuestas con Situación, Tarea, Acción, Resultado</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Practica Entrenamiento Estructurado</p>
                    <p className="text-sm text-white/60">Haz simulaciones basadas en estas preguntas específicas</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Investigación Adicional</p>
                    <p className="text-sm text-white/60">Lee sobre la empresa, equipo, y últimos proyectos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
