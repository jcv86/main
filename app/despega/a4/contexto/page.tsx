'use client'

import { A4ContextCoach } from '@/components/a4/context-coach'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function A4ContextPage() {
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id)
      setLoading(false)
    }
    getUser()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-850 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-white">A4: Coach de Contexto</h1>
          <p className="text-gray-400 text-lg">Entiende cómo funciona el sistema en Chile</p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="max-w-6xl mx-auto text-center py-12">
          <p className="text-gray-400">Cargando...</p>
        </div>
      ) : (
        /* Main Content */
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Coach - Main */}
          <div className="lg:col-span-2">
            <A4ContextCoach userId={userId} topicContext="noticias y contexto de Chile" />
        </div>

        {/* Info Panel - Sidebar */}
        <div className="space-y-4">
          {/* About */}
          <div className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/20 rounded-lg">
            <h3 className="font-semibold text-white mb-3">¿Qué es A4?</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              A4 es tu Coach de Contexto. Te ayuda a entender noticias, conceptos económicos y cómo funciona el sistema
              laboral en Chile.
            </p>
          </div>

          {/* Topics */}
          <div className="p-4 bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border border-cyan-500/20 rounded-lg">
            <h3 className="font-semibold text-white mb-3">Temas que puedo explicar:</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Noticias económicas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Indicadores (UF, IPC, PIB)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Mundo del trabajo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Preparación para entrevistas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Cambios sociales</span>
              </li>
            </ul>
          </div>

          {/* How to Use */}
          <div className="p-4 bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-500/20 rounded-lg">
            <h3 className="font-semibold text-white mb-3">Cómo usar:</h3>
            <ol className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-semibold">1</span>
                <span>Escribe tu pregunta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-semibold">2</span>
                <span>El coach explicará como si no supieras</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-semibold">3</span>
                <span>Haz más preguntas si necesitas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-semibold">4</span>
                <span>Sin juzgamientos, solo aprendizaje</span>
              </li>
            </ol>
          </div>

          {/* Tips */}
          <div className="p-4 bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-500/20 rounded-lg">
            <h3 className="font-semibold text-white mb-3">💡 Tips:</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Pregunta como si no supieras nada</li>
              <li>• No hay preguntas tontas aquí</li>
              <li>• Pide ejemplos si no entiende</li>
              <li>• El coach es amable y paciente</li>
            </ul>
          </div>
        </div>
      </div>
      )}

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-[rgb(80,160,170)]/50 text-center">
        <p className="text-sm text-gray-500">A4 es parte de tu camino de 90 días en Despega Tu Carrera</p>
      </div>
    </div>
  )
}
