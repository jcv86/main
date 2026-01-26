'use client'

interface CIPCapacityIndicatorProps {
  capacity: number
}

export default function CIPCapacityIndicator({ capacity }: CIPCapacityIndicatorProps) {
  const isOptimal = capacity > 68
  const isWarning = capacity > 15 && capacity <= 68
  const isCritical = capacity <= 15

  return (
    <div className="space-y-6">
      {/* Main Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
          <span>Capacidad Actual</span>
          <span className="text-lg font-bold">{capacity.toFixed(1)}%</span>
        </div>
        
        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
          {/* Red Zone (0-15%) */}
          <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-400" style={{ width: '15%' }} />
          
          {/* Yellow Zone (15-68%) */}
          <div className="absolute top-0 h-full bg-gradient-to-r from-yellow-400 to-yellow-300" style={{ left: '15%', width: '53%' }} />
          
          {/* Green Zone (68-100%) */}
          <div className="absolute top-0 h-full bg-gradient-to-r from-green-400 to-green-300" style={{ left: '68%', width: '32%' }} />
          
          {/* Current Position Marker */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-1 h-full bg-black opacity-70 transition-all"
            style={{ left: `${Math.min(capacity, 100)}%` }}
          />
        </div>
      </div>

      {/* Zone Information */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <div className="font-semibold text-red-700 text-sm">Crítica</div>
          <div className="text-xs text-red-600 mt-1">0-15%</div>
          <div className="text-xs text-red-500 mt-2">⚠️ Frustración</div>
        </div>
        
        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <div className="font-semibold text-yellow-700 text-sm">Alerta</div>
          <div className="text-xs text-yellow-600 mt-1">15-68%</div>
          <div className="text-xs text-yellow-500 mt-2">🎯 Objetivo</div>
        </div>
        
        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="font-semibold text-green-700 text-sm">Óptima</div>
          <div className="text-xs text-green-600 mt-1">68-100%</div>
          <div className="text-xs text-green-500 mt-2">✓ Sostenible</div>
        </div>
      </div>

      {/* Status Message */}
      <div className="p-4 rounded-lg border-l-4" 
        style={{
          backgroundColor: isCritical ? '#fee2e2' : isWarning ? '#fef3c7' : '#dcfce7',
          borderColor: isCritical ? '#dc2626' : isWarning ? '#f59e0b' : '#22c55e'
        }}>
        <p className="text-sm font-medium" 
          style={{
            color: isCritical ? '#991b1b' : isWarning ? '#92400e' : '#166534'
          }}>
          {isCritical && '⚠️ Capacidad crítica: Reduce carga y descansa'}
          {isWarning && '🎯 En zona de compromiso: Mantén este ritmo'}
          {isOptimal && '✓ Capacidad sostenible: Ritmo óptimo'}
        </p>
      </div>
    </div>
  )
}
