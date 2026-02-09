'use client'

import React from 'react'

interface ArrowFlowProps {
  direction?: 'down' | 'right'
  animated?: boolean
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ArrowFlow({ 
  direction = 'down', 
  animated = true, 
  color = 'text-blue-500',
  size = 'md'
}: ArrowFlowProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const containerClasses = {
    sm: 'py-2',
    md: 'py-4',
    lg: 'py-6'
  }

  if (direction === 'down') {
    return (
      <div className={`flex justify-center ${containerClasses[size]}`}>
        <svg
          className={`${sizeClasses[size]} ${color} ${animated ? 'animate-bounce' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center px-4">
      <svg
        className={`${sizeClasses[size]} ${color} ${animated ? 'animate-pulse' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </div>
  )
}

export function StepBadge({ number, completed, current }: { number: number; completed: boolean; current: boolean }) {
  return (
    <div className={`
      w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all
      ${completed ? 'bg-green-600 text-white' : current ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'}
    `}>
      {completed ? '✓' : number}
    </div>
  )
}

export function ProgressStep({ 
  title, 
  description, 
  icon,
  number,
  completed,
  current
}: {
  title: string
  description: string
  icon?: React.ReactNode
  number: number
  completed?: boolean
  current?: boolean
}) {
  const bgColor = completed ? 'bg-green-50 border-green-200' : current ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
  const borderColor = completed ? 'border-green-200' : current ? 'border-blue-200' : 'border-slate-200'

  return (
    <div className={`p-4 rounded-lg border-2 transition-all ${bgColor} ${borderColor}`}>
      <div className="flex items-start gap-4">
        <StepBadge number={number} completed={completed || false} current={current || false} />
        <div className="flex-1 pt-1">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
          {icon && <div className="mt-2">{icon}</div>}
        </div>
      </div>
    </div>
  )
}
