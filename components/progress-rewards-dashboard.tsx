'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { NIVELES, BADGES, ProgresoDespega } from '@/lib/progress-rewards-system'
import { Trophy, Zap, Award, Flame, Target } from 'lucide-react'

interface ProgressRewardsDashboardProps {
  progreso: ProgresoDespega
}

export default function ProgressRewardsDashboard({ progreso }: ProgressRewardsDashboardProps) {
  const nivelConfig = NIVELES[progreso.nivel as keyof typeof NIVELES]

  return (
    <div className="space-y-6">
      {/* Card Principal: Nivel Actual */}
      <Card className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Nivel Visual */}
          <div className="flex flex-col items-center justify-center">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-6xl mb-4 shadow-lg"
              style={{ backgroundColor: nivelConfig.color }}
            >
              {nivelConfig.icono}
            </div>
            <h2 className="text-3xl font-bold text-white text-center">{nivelConfig.nombre}</h2>
            <p className="text-gray-400 mt-2">{progreso.accionesCompletadas} acciones completadas</p>
          </div>

          {/* Estadísticas principales */}
          <div className="space-y-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400 text-sm">Puntos Totales</span>
              </div>
              <div className="text-3xl font-bold text-white">{progreso.puntosTotales}</div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-red-400" />
                <span className="text-gray-400 text-sm">Racha Actual</span>
              </div>
              <div className="text-3xl font-bold text-white">{progreso.diasConsecutivos} días</div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400 text-sm">Percentil Global</span>
              </div>
              <div className="text-3xl font-bold text-white">{progreso.percentilGlobal}%</div>
            </div>
          </div>

          {/* Progreso del Nivel */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Progreso en Nivel</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progreso</span>
                <span className="text-white font-semibold">{progreso.progresoNivel.porcentaje}%</span>
              </div>
              <Progress value={progreso.progresoNivel.porcentaje} className="h-3" />
            </div>
            
            <div className="bg-slate-700 rounded-lg p-3 mt-4">
              <p className="text-sm text-gray-400">
                Faltan <span className="text-white font-bold">{progreso.progresoNivel.proxima_accion_para_subir}</span> acciones para el siguiente nivel
              </p>
            </div>

            <div className="space-y-2 mt-4">
              <p className="text-sm text-gray-400">Completadas por dificultad:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-700 rounded p-2">
                  <span className="text-gray-400">Fácil:</span> <span className="text-white font-bold">{progreso.accionesCompletadasPorDificultad.facil || 0}</span>
                </div>
                <div className="bg-slate-700 rounded p-2">
                  <span className="text-gray-400">Intermedia:</span> <span className="text-white font-bold">{progreso.accionesCompletadasPorDificultad.intermedia || 0}</span>
                </div>
                <div className="bg-slate-700 rounded p-2">
                  <span className="text-gray-400">Difícil:</span> <span className="text-white font-bold">{progreso.accionesCompletadasPorDificultad.dificil || 0}</span>
                </div>
                <div className="bg-slate-700 rounded p-2">
                  <span className="text-gray-400">Experto:</span> <span className="text-white font-bold">{progreso.accionesCompletadasPorDificultad.experto || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Badges y Recompensas */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Logros Desbloqueados
        </h3>
        
        {progreso.badges.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Completa más acciones para desbloquear logros</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {progreso.badges.map(badge => (
              <div 
                key={badge.id} 
                className="flex flex-col items-center justify-center p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                title={badge.descripcion}
              >
                <div className="text-4xl mb-2">{badge.icono}</div>
                <div className="text-sm font-semibold text-white text-center">{badge.nombre}</div>
                <p className="text-xs text-gray-400 text-center mt-2">{badge.descripcion}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Estadísticas generales */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-400" />
          Tu Trayectoria
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Rutas Completadas</div>
            <div className="text-3xl font-bold text-white">{progreso.rutas_completadas}</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Días Activos Totales</div>
            <div className="text-3xl font-bold text-white">{progreso.diasTotalesActivos}</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Ofertas Laborales</div>
            <div className="text-3xl font-bold text-white">{progreso.ofertas_laborales}</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Acciones Completadas</div>
            <div className="text-3xl font-bold text-white">{progreso.accionesCompletadas}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
