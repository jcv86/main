'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Share2, Download, Lock } from 'lucide-react'

interface PerfilDescubiertoProps {
  perfil: any
  isPremium: boolean
}

export default function PerfilDescubiertoViewer({ perfil, isPremium }: PerfilDescubiertoProps) {
  const [activeTab, setActiveTab] = useState('resumen')

  const perfilTypeColors = {
    'A': 'from-red-500 to-pink-500',
    'B': 'from-orange-500 to-amber-500',
    'C': 'from-blue-500 to-cyan-500',
    'D': 'from-green-500 to-emerald-500'
  }

  const perfilTypeDescriptions = {
    'A': { nombre: 'Dominante', emoji: '⚡', description: 'Líder directo y orientado a resultados' },
    'B': { nombre: 'Influyente', emoji: '🌟', description: 'Carismático y orientado a las personas' },
    'C': { nombre: 'Cumplidor', emoji: '🎯', description: 'Analítico y orientado a la precisión' },
    'D': { nombre: 'Estable', emoji: '🛡️', description: 'Colaborativo y orientado al equipo' }
  }

  const tipo = perfil?.perfil_tipo || 'C'
  const typeInfo = perfilTypeDescriptions[tipo]
  const gradientClass = perfilTypeColors[tipo]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Tu Perfil Descubierto</h1>
          <p className="text-purple-300">Basado en Test Despega Cerebral</p>
        </div>

        {/* Main Profile Card */}
        <div className={`bg-gradient-to-br ${gradientClass} rounded-2xl p-1 mb-8 shadow-2xl`}>
          <div className="bg-slate-900 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{typeInfo.emoji}</div>
              <h2 className="text-3xl font-bold text-white mb-2">Tipo {tipo}: {typeInfo.nombre}</h2>
              <p className="text-gray-300">{typeInfo.description}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{perfil?.scores?.analisis || 0}%</div>
                <div className="text-sm text-gray-400">Análisis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{perfil?.scores?.intuicion || 0}%</div>
                <div className="text-sm text-gray-400">Intuición</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{perfil?.scores?.impacto || 0}%</div>
                <div className="text-sm text-gray-400">Impacto</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-700">
          {['resumen', 'fortalezas', 'desarrollo'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === tab
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === 'resumen' && (
          <div className="space-y-4 mb-8">
            <Card className="p-6 bg-slate-800 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-3">Resumen de tu Perfil</h3>
              <p className="text-gray-300">
                {perfil?.contenido_informe?.resumen || 'Tu perfil se está generando...'}
              </p>
            </Card>
          </div>
        )}

        {activeTab === 'fortalezas' && (
          <div className="space-y-4 mb-8">
            <Card className="p-6 bg-slate-800 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Tus Fortalezas</h3>
              <ul className="space-y-3">
                {perfil?.contenido_informe?.fortalezas?.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {activeTab === 'desarrollo' && (
          <div className="space-y-4 mb-8">
            <Card className="p-6 bg-slate-800 border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Áreas de Desarrollo</h3>
              <ul className="space-y-3">
                {perfil?.contenido_informe?.areas_desarrollo?.map((a: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-orange-400 mt-1">→</span>
                    <span className="text-gray-300">{a}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {/* Premium Features */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-6 mb-8 border border-purple-700">
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Desbloquea tu Informe Completo</h3>
                <p className="text-gray-300 mb-4">
                  Acceso a análisis detallado, comparativas con otros usuarios, rutas personalizadas y seguimiento 30-60-90
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Actualizar a Premium
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <Button className="flex-1 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Descargar PDF
          </Button>
          <Button variant="outline" className="flex-1 flex items-center justify-center gap-2 border-slate-600 text-white hover:bg-slate-800">
            <Share2 className="w-4 h-4" />
            Compartir
          </Button>
        </div>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-r from-blue-900 to-cyan-900 border-blue-700 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Continúa tu Desarrollo</h3>
          <p className="text-gray-300 mb-6">
            Acceso a misiones, rutas de aprendizaje y coaching personalizado
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Explorar Mi Ruta de Desarrollo
          </Button>
        </Card>
      </div>
    </div>
  )
}
