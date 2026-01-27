'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from 'recharts'

// Colores oficiales Despega Cerebral (basados en metodologia DISC)
export const DESPEGA_CEREBRAL_COLORS = {
  D: '#E53935', // Rojo - Dominancia
  I: '#FDD835', // Amarillo - Influencia  
  S: '#43A047', // Verde - Estabilidad
  C: '#1E88E5', // Azul - Cumplimiento
}

export const DESPEGA_CEREBRAL_CONFIG = {
  D: {
    color: '#E53935',
    nombre: 'Dominante',
    descripcion: 'Directo, decisivo, orientado a resultados',
    fortalezas: ['Toma de decisiones rapida', 'Liderazgo natural', 'Enfocado en metas'],
    areas: ['Escucha activa', 'Paciencia', 'Trabajo en equipo']
  },
  I: {
    color: '#FDD835', 
    nombre: 'Influyente',
    descripcion: 'Entusiasta, optimista, colaborativo',
    fortalezas: ['Comunicacion efectiva', 'Motivacion de equipos', 'Creatividad'],
    areas: ['Seguimiento', 'Atencion al detalle', 'Analisis profundo']
  },
  S: {
    color: '#43A047',
    nombre: 'Estable', 
    descripcion: 'Paciente, confiable, orientado al equipo',
    fortalezas: ['Consistencia', 'Lealtad', 'Apoyo a otros'],
    areas: ['Adaptabilidad', 'Iniciativa', 'Confrontacion']
  },
  C: {
    color: '#1E88E5',
    nombre: 'Cumplidor',
    descripcion: 'Analitico, preciso, orientado a la calidad',
    fortalezas: ['Atencion al detalle', 'Precision', 'Pensamiento critico'],
    areas: ['Flexibilidad', 'Decision rapida', 'Delegacion']
  }
}

interface RadarDataPoint {
  dimension: string
  valor: number
  fullMark: number
  color: string
}

interface DespegaCerebralRadarProps {
  scores: {
    D: number
    I: number
    S: number
    C: number
  }
  showLegend?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function DespegaCerebralRadar({ 
  scores, 
  showLegend = true,
  size = 'md' 
}: DespegaCerebralRadarProps) {
  
  const data: RadarDataPoint[] = [
    { 
      dimension: 'Dominante (D)', 
      valor: scores.D || 0, 
      fullMark: 100,
      color: DESPEGA_CEREBRAL_COLORS.D
    },
    { 
      dimension: 'Influyente (I)', 
      valor: scores.I || 0, 
      fullMark: 100,
      color: DESPEGA_CEREBRAL_COLORS.I
    },
    { 
      dimension: 'Estable (S)', 
      valor: scores.S || 0, 
      fullMark: 100,
      color: DESPEGA_CEREBRAL_COLORS.S
    },
    { 
      dimension: 'Cumplidor (C)', 
      valor: scores.C || 0, 
      fullMark: 100,
      color: DESPEGA_CEREBRAL_COLORS.C
    },
  ]

  // Determinar tipo dominante
  const maxScore = Math.max(scores.D, scores.I, scores.S, scores.C)
  const dominantType = Object.entries(scores).find(([_, val]) => val === maxScore)?.[0] || 'C'
  const dominantColor = DESPEGA_CEREBRAL_COLORS[dominantType as keyof typeof DESPEGA_CEREBRAL_COLORS]

  const heights = {
    sm: 250,
    md: 350,
    lg: 450
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={heights[size]}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid 
            stroke="#4B5563" 
            strokeDasharray="3 3"
          />
          <PolarAngleAxis 
            dataKey="dimension" 
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#6B7280', fontSize: 10 }}
          />
          <Radar
            name="Tu Perfil"
            dataKey="valor"
            stroke={dominantColor}
            fill={dominantColor}
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            formatter={(value: number) => [`${value}%`, 'Puntuacion']}
          />
          {showLegend && (
            <Legend 
              wrapperStyle={{ color: '#9CA3AF' }}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>

      {/* Barra de colores con puntuaciones */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        {Object.entries(DESPEGA_CEREBRAL_COLORS).map(([key, color]) => (
          <div 
            key={key} 
            className="text-center p-3 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <div 
              className="w-4 h-4 rounded-full mx-auto mb-2"
              style={{ backgroundColor: color }}
            />
            <div className="text-xs text-gray-400 mb-1">
              {DESPEGA_CEREBRAL_CONFIG[key as keyof typeof DESPEGA_CEREBRAL_CONFIG].nombre}
            </div>
            <div 
              className="text-lg font-bold"
              style={{ color }}
            >
              {scores[key as keyof typeof scores] || 0}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente para mostrar el perfil dominante
export function DespegaCerebralProfileSummary({ scores }: { scores: { D: number, I: number, S: number, C: number }}) {
  const maxScore = Math.max(scores.D, scores.I, scores.S, scores.C)
  const dominantType = Object.entries(scores).find(([_, val]) => val === maxScore)?.[0] || 'C'
  const config = DESPEGA_CEREBRAL_CONFIG[dominantType as keyof typeof DESPEGA_CEREBRAL_CONFIG]

  return (
    <div 
      className="p-6 rounded-xl border-2"
      style={{ 
        borderColor: config.color,
        backgroundColor: `${config.color}10`
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
          style={{ backgroundColor: config.color }}
        >
          {dominantType}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{config.nombre}</h3>
          <p className="text-gray-400">{config.descripcion}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <h4 className="text-sm font-semibold text-green-400 mb-2">Fortalezas</h4>
          <ul className="space-y-1">
            {config.fortalezas.map((f, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"/>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-amber-400 mb-2">Areas de Desarrollo</h4>
          <ul className="space-y-1">
            {config.areas.map((a, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"/>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
