"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Volume2,
  Settings,
  ChevronDown,
  ChevronUp,
  Info,
  Mic,
  Clock,
  Hash,
  Type,
} from "lucide-react"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"

interface TTSControlsProps {
  text: string
  className?: string
}

export function TTSControls({ text, className = "" }: TTSControlsProps) {
  const tts = useTextToSpeech(text)
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const [showDebug, setShowDebug] = React.useState(false)

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusText = (): string => {
    if (tts.isPlaying) return "Reproduciendo"
    if (tts.isPaused) return "Pausado"
    return "Detenido"
  }

  const getStatusColor = (): string => {
    if (tts.isPlaying) return "bg-green-500"
    if (tts.isPaused) return "bg-yellow-500"
    return "bg-gray-500"
  }

  if (!tts.debugInfo.speechSynthesisSupported) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <Volume2 className="h-4 w-4" />
            <span className="text-sm">Text-to-Speech no está disponible en este navegador</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (tts.totalSegments === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Volume2 className="h-4 w-4" />
            <span className="text-sm">No hay texto disponible para reproducir</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Reproductor de Audio
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <span className="text-sm text-gray-600">{getStatusText()}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progreso: {Math.round(tts.progress)}%</span>
            <span>
              Segmento {tts.currentSegment + 1} de {tts.totalSegments}
            </span>
          </div>
          <Progress value={tts.progress} className="h-2" />
          {tts.estimatedTimeRemaining > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Tiempo restante: {formatTime(tts.estimatedTimeRemaining)}</span>
            </div>
          )}
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={tts.skipBackward} disabled={tts.currentSegment === 0}>
            <SkipBack className="h-4 w-4" />
          </Button>

          {tts.isPlaying ? (
            <Button onClick={tts.pause} size="sm">
              <Pause className="h-4 w-4 mr-1" />
              Pausar
            </Button>
          ) : (
            <Button onClick={tts.play} size="sm">
              <Play className="h-4 w-4 mr-1" />
              {tts.isPaused ? "Continuar" : "Reproducir"}
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={tts.stop} disabled={!tts.isPlaying && !tts.isPaused}>
            <Square className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={tts.skipForward}
            disabled={tts.currentSegment >= tts.totalSegments - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Voice Selection */}
        {tts.availableVoices.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Mic className="h-3 w-3" />
              Voz
            </label>
            <Select
              value={tts.selectedVoice?.name || ""}
              onValueChange={(value) => {
                const voice = tts.availableVoices.find((v) => v.name === value)
                if (voice) tts.setVoice(voice)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar voz" />
              </SelectTrigger>
              <SelectContent>
                {tts.availableVoices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    <div className="flex items-center gap-2">
                      <span>{voice.name}</span>
                      {voice.lang.startsWith("es") && (
                        <Badge variant="secondary" className="text-xs">
                          ES
                        </Badge>
                      )}
                      {voice.default && (
                        <Badge variant="outline" className="text-xs">
                          Por defecto
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Advanced Settings */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span className="flex items-center gap-1">
                <Settings className="h-3 w-3" />
                Configuración Avanzada
              </span>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-2">
            {/* Speed Control */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Velocidad</label>
                <span className="text-sm text-gray-600">{tts.rate}x</span>
              </div>
              <Slider
                value={[tts.rate]}
                onValueChange={([value]) => tts.setRate(value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Pitch Control */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Tono</label>
                <span className="text-sm text-gray-600">{tts.pitch}</span>
              </div>
              <Slider
                value={[tts.pitch]}
                onValueChange={([value]) => tts.setPitch(value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Volumen</label>
                <span className="text-sm text-gray-600">{Math.round(tts.volume * 100)}%</span>
              </div>
              <Slider
                value={[tts.volume]}
                onValueChange={([value]) => tts.setVolume(value)}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Debug Information */}
        <Collapsible open={showDebug} onOpenChange={setShowDebug}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                Información de Debug
              </span>
              {showDebug ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1 font-medium">
                  <Type className="h-3 w-3" />
                  Texto
                </div>
                <div>Original: {tts.debugInfo.originalTextLength.toLocaleString()} chars</div>
                <div>Limpio: {tts.debugInfo.cleanedTextLength.toLocaleString()} chars</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 font-medium">
                  <Hash className="h-3 w-3" />
                  Segmentos
                </div>
                <div>Total: {tts.totalSegments}</div>
                <div>Actual: {tts.currentSegment + 1}</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 font-medium text-xs">
                <Mic className="h-3 w-3" />
                Voz Actual
              </div>
              <div className="text-xs text-gray-600">{tts.debugInfo.currentVoice || "Ninguna seleccionada"}</div>
            </div>

            <div className="space-y-1">
              <div className="font-medium text-xs">Voces Disponibles</div>
              <div className="text-xs text-gray-600">
                {tts.availableVoices.length} voces encontradas
                {tts.availableVoices.filter((v) => v.lang.startsWith("es")).length > 0 &&
                  ` (${tts.availableVoices.filter((v) => v.lang.startsWith("es")).length} en español)`}
              </div>
            </div>

            {tts.debugInfo.segments.length > 0 && (
              <div className="space-y-1">
                <div className="font-medium text-xs">Segmento Actual</div>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">
                  {tts.debugInfo.segments[tts.currentSegment]?.substring(0, 200)}
                  {tts.debugInfo.segments[tts.currentSegment]?.length > 200 && "..."}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
