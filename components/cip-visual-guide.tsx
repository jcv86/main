'use client'

import { useState } from 'react'
import { AlertCircle, TrendingUp, Zap, Target, BarChart3 } from 'lucide-react'

export default function CIPVisualGuide() {
  const [activeTab, setActiveTab] = useState<'pilares' | 'flujo' | 'fases'>('pilares')

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('pilares')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'pilares' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
        >
          Pilares Fundamentales
        </button>
        <button
          onClick={() => setActiveTab('flujo')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'flujo' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
        >
          Flujo Diario
        </button>
        <button
          onClick={() => setActiveTab('fases')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'fases' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
        >
          Progresión
        </button>
      </div>

      {/* PILARES */}
      {activeTab === 'pilares' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Los 7 Pilares del CIP</h2>

          {/* Pilar 1: A1 Base */}
          <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-transparent">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-blue-500 rounded-lg text-white">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Pilar 1: A1_Base</h3>
                <p className="text-gray-600 mt-2">Tu capacidad teórica máxima (constante)</p>
                <div className="mt-3 p-3 bg-white rounded border-l-4 border-blue-500">
                  <code className="text-sm">A1_Base = 60% → Tu "techo ideal"</code>
                </div>
              </div>
            </div>
          </div>

          {/* Pilar 2: T_capacidad_actual */}
          <div className="border rounded-lg p-6 bg-gradient-to-r from-purple-50 to-transparent">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-purple-500 rounded-lg text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Pilar 2: T_capacidad_actual</h3>
                <p className="text-gray-600 mt-2">Tu capacidad REAL hoy (varía con fatiga, estrés, etc.)</p>
                <div className="mt-3 p-3 bg-white rounded border-l-4 border-purple-500">
                  <code className="text-sm">T_actual = A1_Base × (0.8 a 1.2)</code>
                  <p className="text-xs text-gray-600 mt-1">Ejemplo: 60% × 1.1 = 66% hoy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pilar 3: P_success */}
          <div className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-transparent">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-green-500 rounded-lg text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Pilar 3: P_success</h3>
                <p className="text-gray-600 mt-2">Probabilidad de completar todas tus tareas sin frustración</p>
                <div className="mt-3 p-3 bg-white rounded border-l-4 border-green-500">
                  <code className="text-sm">P_success = T_actual × 0.85</code>
                  <p className="text-xs text-gray-600 mt-1">Ejemplo: 66% × 0.85 = 56% de éxito</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pilar 4: Zonas */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold">Pilar 4: Las 3 Zonas de Capacidad</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 bg-red-50">
                <div className="w-full h-2 bg-red-500 rounded mb-3"></div>
                <h4 className="font-bold text-red-900">Zona Roja (0-15%)</h4>
                <p className="text-sm text-red-700 mt-2">Frustración alta. Reduce carga ya.</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-yellow-50 ring-2 ring-yellow-500">
                <div className="w-full h-2 bg-yellow-500 rounded mb-3"></div>
                <h4 className="font-bold text-yellow-900">Zona Amarilla (15-68%) ⭐</h4>
                <p className="text-sm text-yellow-700 mt-2">Tu OBJETIVO. Sostenible a largo plazo.</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="w-full h-2 bg-green-500 rounded mb-3"></div>
                <h4 className="font-bold text-green-900">Zona Verde (68-100%)</h4>
                <p className="text-sm text-green-700 mt-2">Óptima pero insostenible. Riesgo de burnout.</p>
              </div>
            </div>
          </div>

          {/* Pilar 5: Modos */}
          <div className="border rounded-lg p-6 bg-gradient-to-r from-indigo-50 to-transparent">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-indigo-500 rounded-lg text-white">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Pilar 5: Un Modo Activo a la Vez</h3>
                <p className="text-gray-600 mt-2">Hard Rule: Solo 1 modo simultáneamente</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-white rounded">🔥 Deep Work</div>
                  <div className="p-2 bg-white rounded">📚 Learning</div>
                  <div className="p-2 bg-white rounded">😴 Rest</div>
                  <div className="p-2 bg-white rounded">👥 Collaboration</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pilar 6-7 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-cyan-50">
              <h4 className="font-bold">Pilar 6: Fases de Progresión</h4>
              <p className="text-sm text-gray-600 mt-2">A1_Base → A1_30 → A1_60 → A1_90</p>
              <p className="text-xs text-gray-500 mt-2">+5-10% por fase después de 30 días</p>
            </div>
            <div className="border rounded-lg p-4 bg-amber-50">
              <h4 className="font-bold">Pilar 7: DTC Philosophy</h4>
              <p className="text-sm text-gray-600 mt-2">Deliver To Capacity</p>
              <p className="text-xs text-gray-500 mt-2">Sostenibilidad &gt; Intensidad</p>
            </div>
          </div>
        </div>
      )}

      {/* FLUJO DIARIO */}
      {activeTab === 'flujo' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Flujo Diario: ¿Cómo Funciona?</h2>

          <div className="space-y-3">
            {[
              { num: 1, titulo: 'Cálculo Automático', desc: 'Sistema calcula T_actual = A1_Base × Varianza', color: 'blue' },
              { num: 2, titulo: 'Probabilidad', desc: 'Calcula P_success = T_actual × 0.85', color: 'purple' },
              { num: 3, titulo: 'Recomendación', desc: 'Sistema recomienda N tareas según P_success', color: 'green' },
              { num: 4, titulo: 'Seleccionar Modo', desc: 'Elige 1 modo: Deep Work, Learning, Rest, Collaboration', color: 'indigo' },
              { num: 5, titulo: 'Ejecutar', desc: 'Completa las tareas en ese modo', color: 'yellow' },
              { num: 6, titulo: 'Validación', desc: 'Sistema valida si completaste o fallaste', color: 'red' },
              { num: 7, titulo: 'Reporte', desc: 'Se registra en histórico para ajustar futuras predicciones', color: 'gray' },
            ].map((paso, idx) => (
              <div key={idx} className={`border rounded-lg p-4 bg-${paso.color}-50 flex items-start gap-4`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${paso.color}-500 text-white flex items-center justify-center font-bold`}>
                  {paso.num}
                </div>
                <div>
                  <h4 className="font-bold">{paso.titulo}</h4>
                  <p className="text-sm text-gray-600">{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-2 border-orange-500 rounded-lg p-4 bg-orange-50">
            <div className="flex gap-3">
              <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-orange-900">Ejemplo Real</h4>
                <p className="text-sm text-orange-800 mt-2">
                  Juan tiene A1_Base=60%. Hoy: T_actual=66% (buena varianza), P_success=56%.
                  Sistema recomienda 3-4 tareas. Elige "Deep Work". Completa 4 tareas. ✓ Validado.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FASES */}
      {activeTab === 'fases' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Progresión: 90 Días</h2>

          <div className="grid grid-cols-4 gap-4">
            {[
              { fase: 'A1_Base', dias: 'Inicio', capacidad: '60%', color: 'blue', desc: 'Tu punto de partida' },
              { fase: 'A1_30', dias: '30 días', capacidad: '63-66%', color: 'purple', desc: '+5-10%' },
              { fase: 'A1_60', dias: '60 días', capacidad: '66-72%', color: 'indigo', desc: '+5-10%' },
              { fase: 'A1_90', dias: '90 días', capacidad: '72-80%', color: 'green', desc: 'Meta máxima' },
            ].map((fase, idx) => (
              <div key={idx} className={`border-2 rounded-lg p-4 bg-gradient-to-b from-${fase.color}-50 to-transparent text-center`}>
                <div className={`text-2xl font-bold text-${fase.color}-600`}>{fase.fase}</div>
                <div className="text-sm text-gray-600 mt-1">{fase.dias}</div>
                <div className={`text-lg font-bold text-${fase.color}-700 mt-3`}>{fase.capacidad}</div>
                <div className="text-xs text-gray-500 mt-2">{fase.desc}</div>
              </div>
            ))}
          </div>

          <div className="border rounded-lg p-6 bg-green-50">
            <h4 className="font-bold text-lg mb-3">Condiciones de Progresión</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Mantener capacidad en zona amarilla (15-68%) durante todo el período</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Completar al menos 80% de tareas recomendadas</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>No tener más de 2 "días rojos" (crítica) en 30 días</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">✓</span>
                <span>Progresión automática: No requiere acción manual</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
