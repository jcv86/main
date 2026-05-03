'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'

interface SofiaInterviewerProps {
  state: 'greeting' | 'listening' | 'thinking' | 'idle'
  loop?: boolean
  autoPlay?: boolean
  onEnded?: () => void
}

export function SofiaInterviewer({ state = 'idle', loop = false, autoPlay = true, onEnded }: SofiaInterviewerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  useEffect(() => {
    setIsPlaying(autoPlay)
  }, [autoPlay])

  // For greeting, don't loop. For listening/thinking, loop by default
  const shouldLoop = state === 'greeting' ? false : loop

  const getVideoSource = () => {
    switch (state) {
      case 'greeting':
        return '/videos/sofia-greeting.mp4'
      case 'listening':
      case 'thinking':
        return '/videos/sofia-listening.mov'
      default:
        return null
    }
  }

  const getVideoLabel = () => {
    switch (state) {
      case 'greeting':
        return 'Sofia - Bienvenida'
      case 'listening':
        return 'Sofia - Escuchando'
      case 'thinking':
        return 'Sofia - Esperando'
      default:
        return 'Sofia'
    }
  }

  const videoSource = getVideoSource()

  if (!videoSource) {
    return (
      <Card className="bg-gradient-to-b from-training/20 to-background border-training/40 flex items-center justify-center h-80 w-full">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-training/20 mx-auto mb-4 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-training/40 animate-pulse"></div>
          </div>
          <p className="text-white/70 text-sm">{getVideoLabel()}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-black border-training/40 overflow-hidden">
      <div className="relative aspect-[3/4] w-full bg-black">
        <video
          src={videoSource}
          autoPlay={isPlaying}
          loop={shouldLoop}
          muted={state !== 'greeting'}
          playsInline
          className="w-full h-full object-contain"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={onEnded}
        />
        
        {/* Video Label */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-training animate-pulse' : 'bg-white/40'}`}></div>
            <span className="text-xs text-white/70 font-medium">{getVideoLabel()}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
