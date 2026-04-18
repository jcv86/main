'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { ConversationalInterviewSimulator } from '@/components/conversational-interview-simulator'

export default function ConversationalInterviewPage() {
  const { user, loading } = useAuthRedirect()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<'basico' | 'intermedio' | 'avanzado' | null>(null)

  const roles = ['Software Engineer', 'Product Manager', 'Data Scientist', 'Operations Manager', 'Marketing Lead']
  const industries = ['Tech', 'Finance', 'Healthcare', 'E-commerce', 'Consulting']
  const levels = [
    { id: 'basico', label: 'Básico - 3 preguntas', desc: 'Preguntas fundacionales' },
    { id: 'intermedio', label: 'Intermedio - 3 preguntas', desc: 'Preguntas situacionales' },
    { id: 'avanzado', label: 'Avanzado - 3 preguntas', desc: 'Preguntas estratégicas' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
      </div>
    )
  }

  if (!user) return null

  // Si está listo para la entrevista
  if (selectedRole && selectedIndustry && selectedLevel) {
    return (
      <main className="min-h-screen bg-black">
        <div className="flex flex-col h-screen">
          <div className="flex-shrink-0 border-b border-muted/80 bg-gradient-to-r from-slate-900 to-slate-950 p-4">
            <Link href="/despega/a3-dashboard">
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <ConversationalInterviewSimulator
              level={selectedLevel}
              onComplete={() => {
                setSelectedLevel(null)
                setSelectedRole(null)
                setSelectedIndustry(null)
              }}
            />
          </div>
        </div>
      </main>
    )
  }

  // Seleccionar configuración
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/despega/a3-dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Simulación de Entrevista Conversacional</h1>
            <p className="text-muted/60 dark:text-muted/40">
              Personaliza tu entrevista y practica con IA como entrevistador
            </p>
          </div>

          {/* Rol */}
          <div className="bg-white dark:bg-card rounded-[28px] p-6 border border-muted/20 dark:border-card">
            <h2 className="text-lg font-semibold mb-4">1. Selecciona el Puesto</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 rounded-[28px] border-2 transition ${
                    selectedRole === role
                      ? 'border-blue bg-blue/5 dark:bg-cyan-900/20'
                      : 'border-muted/20 dark:border-card hover:border-cyan-400'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Industria */}
          {selectedRole && (
            <div className="bg-white dark:bg-card rounded-[28px] p-6 border border-muted/20 dark:border-card">
              <h2 className="text-lg font-semibold mb-4">2. Selecciona la Industria</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {industries.map(industry => (
                  <button
                    key={industry}
                    onClick={() => setSelectedIndustry(industry)}
                    className={`p-3 rounded-[28px] border-2 transition ${
                      selectedIndustry === industry
                        ? 'border-blue bg-blue/5 dark:bg-cyan-900/20'
                        : 'border-muted/20 dark:border-card hover:border-cyan-400'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nivel */}
          {selectedRole && selectedIndustry && (
            <div className="bg-white dark:bg-card rounded-[28px] p-6 border border-muted/20 dark:border-card">
              <h2 className="text-lg font-semibold mb-4">3. Selecciona el Nivel de Dificultad</h2>
              <div className="space-y-3">
                {levels.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id as any)}
                    className={`w-full p-4 rounded-[28px] border-2 transition text-left ${
                      selectedLevel === level.id
                        ? 'border-blue bg-blue/5 dark:bg-cyan-900/20'
                        : 'border-muted/20 dark:border-card hover:border-cyan-400'
                    }`}
                  >
                    <div className="font-semibold">{level.label}</div>
                    <div className="text-sm text-muted/60 dark:text-muted/40">{level.desc}</div>
                  </button>
                ))}
              </div>

              <Button
                className="w-full mt-6 py-6 bg-blue hover:bg-cyan-700 text-white text-lg"
                onClick={() => {}}
              >
                Comenzar Entrevista
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
