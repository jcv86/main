'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  User, 
  Users,
  BookOpen,
  Zap,
  Award
} from 'lucide-react'

export default function ValueMiningLabChoice() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black/95 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/despega/a3"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a módulos
          </Link>
          <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] border-[rgba(170,70,170,0.3)]">
            Módulo 2 • 100 XP
          </Badge>
        </div>

        {/* Module intro */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Laboratorio de Minería de Valor
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Descubre el valor real oculto en tu experiencia laboral anterior y convierte tareas en logros que impresionarán en cualquier entrevista.
          </p>
        </div>

        {/* Mode selection cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Without Coach option */}
          <Card className="bg-white/5 border-white/10 hover:bg-white/8 transition-colors cursor-pointer group"
            onClick={() => router.push('/despega/a3/value-mining-lab-text')}
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <BookOpen className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  Modo Texto
                </h2>
                <p className="text-white/70">
                  Trabaja a tu propio ritmo sin presión de tiempo
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Completa 5 actividades requeridas</span>
                </li>
                <li className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Constructor de texto para elaborar respuestas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Gana 100 XP al completar</span>
                </li>
              </ul>

              <Button 
                className="w-full bg-transparent border-2 border-[rgb(170,70,170)] text-[rgb(170,70,170)] font-semibold h-12 rounded-full hover:bg-[rgb(170,70,170)]/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push('/despega/a3/value-mining-lab-text')
                }}
              >
                Comenzar Modo Texto
              </Button>
            </div>
          </Card>

          {/* With Coach option */}
          <Card className="bg-gradient-to-br from-[rgba(170,70,170,0.15)] to-[rgba(170,70,170,0.05)] border-2 border-[rgba(170,70,170,0.4)] hover:border-[rgba(170,70,170,0.6)] transition-colors cursor-pointer group"
            onClick={() => router.push('/despega/a3/value-mining-lab-coach')}
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-full bg-[rgb(170,70,170)]/20 border-2 border-[rgb(170,70,170)]/30 flex items-center justify-center group-hover:bg-[rgb(170,70,170)]/30 transition-colors">
                  <Users className="w-8 h-8 text-[rgb(170,70,170)]" />
                </div>
                <Badge className="bg-[rgb(170,70,170)]/20 text-[rgb(170,70,170)] border-[rgb(170,70,170)]/30">
                  Interactivo
                </Badge>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  Modo Coach
                </h2>
                <p className="text-white/70">
                  Recibe retroalimentación en tiempo real con un coach de IA
                </p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[rgb(170,70,170)] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Coach de IA en la pantalla con retroalimentación</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-[rgb(170,70,170)] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Activación de cámara para práctica simulada</span>
                </li>
                <li className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-[rgb(170,70,170)] flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Gana 100 XP + bonificación de coach</span>
                </li>
              </ul>

              <Button 
                className="w-full bg-gradient-to-r from-[rgb(170,70,170)] to-[rgba(170,70,170,0.8)] hover:from-[rgba(170,70,170,0.9)] hover:to-[rgb(170,70,170)] text-white font-semibold h-12 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push('/despega/a3/value-mining-lab-coach')
                }}
              >
                Comenzar Modo Coach
              </Button>
            </div>
          </Card>
        </div>

        {/* Info section */}
        <Card className="bg-white/5 border-white/10 p-8">
          <h3 className="text-xl font-bold text-white mb-4">¿Cuál debo elegir?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="font-semibold text-white mb-2">Elige Modo Texto si:</p>
              <ul className="space-y-2 text-white/70">
                <li>• Prefieres trabajar sin presión de tiempo</li>
                <li>• Quieres editar y perfeccionar cuidadosamente</li>
                <li>• Es tu primer paso en la minería de valor</li>
                <li>• Prefieres enfoque textual y reflexivo</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Elige Modo Coach si:</p>
              <ul className="space-y-2 text-white/70">
                <li>• Quieres retroalimentación inmediata</li>
                <li>• Te gusta practicar de forma interactiva</li>
                <li>• Ya tienes experiencia con valor mining</li>
                <li>• Quieres simular entrevista con cámara</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
