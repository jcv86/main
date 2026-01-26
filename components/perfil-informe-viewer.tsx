'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, Share2, Lock, Zap } from 'lucide-react'

interface PerfilInformeViewerProps {
  usuario: { id: string; nombre: string }
  perfil: any
  informe: any
  version: 'free' | 'premium'
}

const PERFIL_COLORES = {
  A: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', icon: '🦁' },
  B: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', icon: '🎤' },
  C: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', icon: '🔬' },
  D: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', icon: '🤝' },
}

export function PerfilInformeViewer({ usuario, perfil, informe, version }: PerfilInformeViewerProps) {
  const [showFullReport, setShowFullReport] = useState(false)
  const colores = PERFIL_COLORES[perfil?.tipo_perfil as keyof typeof PERFIL_COLORES]

  if (!perfil) {
    return (
      <div className="text-center py-12">
        <p>No hay perfil disponible. Completa primero el Test Despega Cerebral.</p>
      </div>
    )
  }

  // Determinar cuántas secciones mostrar según versión
  const seccionesVisibles = version === 'premium' ? 9 : 3

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`${colores.bg} border-2 ${colores.border} rounded-lg p-8`}>
        <div className="flex items-start gap-4">
          <div className="text-5xl">{colores.icon}</div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              Eres <span className={colores.text}>{perfil.tipo_perfil}</span> - {perfil.descripcion_perfil}
            </h1>
            <p className="text-gray-600">
              Informe personalizado • {version === 'free' ? 'Versión Gratuita' : 'Versión Premium'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Generado: {new Date(perfil.completed_at).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Resumen Rápido - Scores */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Tu Composición DISC</h2>
        <div className="grid grid-cols-4 gap-4">
          {['A', 'B', 'C', 'D'].map((tipo) => (
            <div key={tipo} className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {perfil[`puntuacion_${tipo.toLowerCase()}`]}
              </div>
              <div className="text-sm font-semibold">
                {tipo === 'A' ? 'Dominancia' : tipo === 'B' ? 'Influencia' : tipo === 'C' ? 'Cumplimiento' : 'Estabilidad'}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Secciones del Informe */}
      <div className="space-y-6">
        {[1, 2, 3].map((seccion) => (
          <SeccionInforme
            key={seccion}
            numero={seccion}
            titulo={
              seccion === 1
                ? 'Tus Fortalezas'
                : seccion === 2
                  ? 'Áreas de Desarrollo'
                  : 'Empleos Ideales'
            }
            contenido={
              seccion === 1
                ? perfil.fortalezas?.join(', ') || 'Cargando...'
                : seccion === 2
                  ? perfil.areas_mejora?.join(', ') || 'Cargando...'
                  : perfil.empleos_recomendados?.join(', ') || 'Cargando...'
            }
            visible={true}
          />
        ))}

        {version === 'premium' &&
          [4, 5, 6, 7, 8, 9].map((seccion) => (
            <SeccionInforme
              key={seccion}
              numero={seccion}
              titulo={`Sección Premium ${seccion}`}
              contenido="Contenido exclusivo premium"
              visible={true}
            />
          ))}

        {version === 'free' && (
          <div className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center bg-amber-50">
            <Lock className="mx-auto mb-4 h-12 w-12 text-amber-600" />
            <h3 className="text-xl font-bold mb-2 text-amber-900">Desbloquea el informe completo</h3>
            <p className="text-amber-800 mb-4">
              Actualiza a Premium para acceder a 6 secciones adicionales, análisis comparativo y recomendaciones personalizadas.
            </p>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Zap className="mr-2 h-4 w-4" />
              Actualizar a Premium
            </Button>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-4 justify-center pt-6 border-t">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Descargar PDF
        </Button>
        {version === 'premium' && (
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Compartir Perfil
          </Button>
        )}
      </div>
    </div>
  )
}

interface SeccionInformeProps {
  numero: number
  titulo: string
  contenido: string
  visible: boolean
}

function SeccionInforme({ numero, titulo, contenido, visible }: SeccionInformeProps) {
  if (!visible) return null

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm flex-shrink-0">
          {numero}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-3">{titulo}</h3>
          <p className="text-gray-600 leading-relaxed">{contenido}</p>
        </div>
      </div>
    </Card>
  )
}
