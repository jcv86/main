'use client'

interface ProgressThermometerProps {
  percentage: number
  label: string
  color?: 'purple' | 'blue' | 'cyan' | 'emerald'
  onClick?: () => void
}

const colorMap = {
  purple: 'from-purple-500 to-purple-600',
  blue: 'from-blue-500 to-blue-600',
  cyan: 'from-cyan-500 to-cyan-600',
  emerald: 'from-emerald-500 to-emerald-600',
}

export function ProgressThermometerBadge({
  percentage,
  label,
  color = 'purple',
  onClick,
}: ProgressThermometerProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
        {/* Thermometer Visual */}
        <div className="flex flex-col gap-0.5">
          {/* Bar Container */}
          <div className="w-16 h-6 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center px-1">
            {/* Fill Bar */}
            <div
              className={`h-4 rounded-full bg-gradient-to-r ${colorMap[color]} transition-all duration-500`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          {/* Label */}
          <span className="text-xs font-semibold text-white/90 leading-none">{label}</span>
        </div>

        {/* Percentage Text */}
        <div className="text-sm font-bold text-white/80 min-w-[32px] text-right">
          {Math.round(percentage)}%
        </div>
      </div>
    </div>
  )
}
