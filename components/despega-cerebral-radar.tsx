'use client'

import { useEffect, useRef } from 'react'

// Colores oficiales Despega Cerebral
export const DESPEGA_CEREBRAL_COLORS = {
  D: '#E53935', // Rojo - Dominante
  I: '#FDD835', // Amarillo - Influyente  
  S: '#43A047', // Verde - Estable
  C: '#1E88E5', // Azul - Cumplidor
}

export const DESPEGA_CEREBRAL_CONFIG = {
  D: {
    color: '#E53935',
    nombre: 'Dominante',
    letra: 'D',
    descripcion: 'Directo, decisivo, orientado a resultados',
    fortalezas: ['Toma de decisiones rapida', 'Liderazgo natural', 'Enfocado en metas'],
    areas: ['Escucha activa', 'Paciencia', 'Trabajo en equipo']
  },
  I: {
    color: '#FDD835', 
    nombre: 'Influyente',
    letra: 'I',
    descripcion: 'Entusiasta, optimista, colaborativo',
    fortalezas: ['Comunicacion efectiva', 'Motivacion de equipos', 'Creatividad'],
    areas: ['Seguimiento', 'Atencion al detalle', 'Analisis profundo']
  },
  S: {
    color: '#43A047',
    nombre: 'Estable',
    letra: 'S',
    descripcion: 'Paciente, confiable, orientado al equipo',
    fortalezas: ['Consistencia', 'Lealtad', 'Apoyo a otros'],
    areas: ['Adaptabilidad', 'Iniciativa', 'Confrontacion']
  },
  C: {
    color: '#1E88E5',
    nombre: 'Cumplidor',
    letra: 'C',
    descripcion: 'Analitico, preciso, orientado a la calidad',
    fortalezas: ['Atencion al detalle', 'Precision', 'Pensamiento critico'],
    areas: ['Flexibilidad', 'Decision rapida', 'Delegacion']
  }
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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const sizes = {
    sm: 250,
    md: 350,
    lg: 450
  }

  const canvasSize = sizes[size]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvasSize / 2
    const centerY = canvasSize / 2
    const maxRadius = (canvasSize / 2) - 60

    // Limpiar canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // Dibujar circulos de fondo (niveles)
    const levels = [20, 40, 60, 80, 100]
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    
    levels.forEach(level => {
      ctx.beginPath()
      ctx.arc(centerX, centerY, (level / 100) * maxRadius, 0, Math.PI * 2)
      ctx.stroke()
    })

    // Dimensiones en orden: D (arriba), I (derecha), S (abajo), C (izquierda)
    const dimensions = [
      { key: 'D', angle: -90, color: DESPEGA_CEREBRAL_COLORS.D, nombre: 'Dominante' },
      { key: 'I', angle: 0, color: DESPEGA_CEREBRAL_COLORS.I, nombre: 'Influyente' },
      { key: 'S', angle: 90, color: DESPEGA_CEREBRAL_COLORS.S, nombre: 'Estable' },
      { key: 'C', angle: 180, color: DESPEGA_CEREBRAL_COLORS.C, nombre: 'Cumplidor' },
    ]

    // Dibujar ejes con colores
    dimensions.forEach(dim => {
      const angleRad = (dim.angle * Math.PI) / 180
      const endX = centerX + Math.cos(angleRad) * maxRadius
      const endY = centerY + Math.sin(angleRad) * maxRadius

      // Linea del eje
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(endX, endY)
      ctx.strokeStyle = dim.color
      ctx.lineWidth = 2
      ctx.stroke()

      // Etiqueta
      const labelDistance = maxRadius + 35
      const labelX = centerX + Math.cos(angleRad) * labelDistance
      const labelY = centerY + Math.sin(angleRad) * labelDistance

      ctx.fillStyle = dim.color
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(dim.nombre, labelX, labelY)
    })

    // Calcular puntos del poligono
    const points = dimensions.map(dim => {
      const score = scores[dim.key as keyof typeof scores] || 0
      const angleRad = (dim.angle * Math.PI) / 180
      const radius = (score / 100) * maxRadius
      return {
        x: centerX + Math.cos(angleRad) * radius,
        y: centerY + Math.sin(angleRad) * radius,
        color: dim.color,
        score
      }
    })

    // Dibujar area del perfil con gradiente
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.closePath()
    ctx.fillStyle = 'rgba(139, 92, 246, 0.2)'
    ctx.fill()
    ctx.strokeStyle = '#8B5CF6'
    ctx.lineWidth = 2
    ctx.stroke()

    // Dibujar segmentos de colores hacia cada punto
    points.forEach((point, i) => {
      const nextPoint = points[(i + 1) % points.length]
      
      // Triangulo coloreado desde el centro
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(point.x, point.y)
      ctx.lineTo(nextPoint.x, nextPoint.y)
      ctx.closePath()
      
      // Gradiente entre los dos colores
      const gradient = ctx.createLinearGradient(point.x, point.y, nextPoint.x, nextPoint.y)
      gradient.addColorStop(0, `${point.color}40`)
      gradient.addColorStop(1, `${nextPoint.color}40`)
      ctx.fillStyle = gradient
      ctx.fill()
    })

    // Dibujar puntos en cada vertice con su color
    points.forEach(point => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2)
      ctx.fillStyle = point.color
      ctx.fill()
      ctx.strokeStyle = '#1F2937'
      ctx.lineWidth = 2
      ctx.stroke()

      // Valor dentro del punto
      ctx.fillStyle = '#1F2937'
      ctx.font = 'bold 10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${point.score}`, point.x, point.y)
    })

  }, [scores, canvasSize])

  // Determinar tipo dominante
  const maxScore = Math.max(scores.D, scores.I, scores.S, scores.C)
  const dominantType = Object.entries(scores).find(([_, val]) => val === maxScore)?.[0] || 'C'
  const dominantConfig = DESPEGA_CEREBRAL_CONFIG[dominantType as keyof typeof DESPEGA_CEREBRAL_CONFIG]

  return (
    <div className="w-full flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={canvasSize} 
        height={canvasSize}
        className="max-w-full"
      />

      {/* Barra de colores con puntuaciones */}
      <div className="mt-6 grid grid-cols-4 gap-2 w-full max-w-md">
        {Object.entries(DESPEGA_CEREBRAL_CONFIG).map(([key, config]) => {
          const score = scores[key as keyof typeof scores] || 0
          const isDominant = key === dominantType
          return (
            <div 
              key={key} 
              className={`text-center p-3 rounded-lg transition-all ${isDominant ? 'ring-2' : ''}`}
              style={{ 
                backgroundColor: `${config.color}20`,
                ringColor: isDominant ? config.color : 'transparent'
              }}
            >
              <div 
                className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: config.color }}
              >
                {config.letra}
              </div>
              <div className="text-xs text-gray-400 mb-1">
                {config.nombre}
              </div>
              <div 
                className="text-lg font-bold"
                style={{ color: config.color }}
              >
                {score}%
              </div>
            </div>
          )
        })}
      </div>

      {/* Leyenda si esta habilitada */}
      {showLegend && (
        <div className="mt-6 p-4 bg-slate-800 rounded-lg w-full max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: dominantConfig.color }}
            >
              {dominantType}
            </div>
            <div>
              <div className="text-white font-semibold">Perfil Dominante: {dominantConfig.nombre}</div>
              <div className="text-gray-400 text-sm">{dominantConfig.descripcion}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente para mostrar el perfil Despega Cerebral completo
export function DespegaCerebralProfileSummary({ scores }: { scores: { D: number, I: number, S: number, C: number }}) {
  const maxScore = Math.max(scores.D, scores.I, scores.S, scores.C)
  const dominantType = Object.entries(scores).find(([_, val]) => val === maxScore)?.[0] || 'C'
  const config = DESPEGA_CEREBRAL_CONFIG[dominantType as keyof typeof DESPEGA_CEREBRAL_CONFIG]

  // Ordenar perfiles por score
  const sortedProfiles = Object.entries(scores)
    .map(([key, score]) => ({
      key,
      score,
      config: DESPEGA_CEREBRAL_CONFIG[key as keyof typeof DESPEGA_CEREBRAL_CONFIG]
    }))
    .sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-4">
      {/* Perfil dominante */}
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
            {config.letra}
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Tu perfil Despega Cerebral dominante</div>
            <h3 className="text-xl font-bold text-white">{config.nombre}</h3>
            <p className="text-gray-400">{config.descripcion}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: DESPEGA_CEREBRAL_COLORS.S }}>Fortalezas</h4>
            <ul className="space-y-1">
              {config.fortalezas.map((f, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: DESPEGA_CEREBRAL_COLORS.S }}/>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: DESPEGA_CEREBRAL_COLORS.I }}>Areas de Desarrollo</h4>
            <ul className="space-y-1">
              {config.areas.map((a, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: DESPEGA_CEREBRAL_COLORS.I }}/>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Distribucion completa */}
      <div className="p-4 rounded-lg bg-slate-800">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Distribucion de tu perfil Despega Cerebral</h4>
        <div className="space-y-2">
          {sortedProfiles.map(({ key, score, config: cfg }) => (
            <div key={key} className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: cfg.color }}
              >
                {cfg.letra}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{cfg.nombre}</span>
                  <span style={{ color: cfg.color }}>{score}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${score}%`,
                      backgroundColor: cfg.color
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
