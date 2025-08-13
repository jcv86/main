"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Play, Pause, Square, SkipForward, SkipBack, Volume2, Settings, Clock, Headphones } from "lucide-react"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

interface TTSControlsProps {
  text: string
  title?: string
  className?: string
}

export function TTSControls({ text, title = "Audio", className = "" }: TTSControlsProps) {
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0)
  const [showSettings, setShowSettings] = useState(false)

  // Call the hook directly in the component body - this is the correct way
  const tts = useTextToSpeech(text, {
    rate,
    pitch,
    volume,
    voice: null,
    lang: "es-ES",
  })

  if (!tts || !tts.isSupported) {
    return (
      <Card className={`border-orange-200 bg-orange-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-orange-700">
            <Headphones className="w-5 h-5" />
            <span className="text-sm">Text-to-Speech no está disponible en este navegador</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!text || text.trim().length === 0) {
    return (
      <Card className={`border-gray-200 bg-gray-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Headphones className="w-5 h-5" />
            <span className="text-sm">No hay texto disponible para reproducir</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const progress = tts.getProgress()
  const timeEstimate = tts.getTimeEstimate()

  const handlePlayPause = () => {
    console.log("Play/Pause clicked - Current state:", {
      isPlaying: tts.isPlaying,
      isPaused: tts.isPaused,
      totalLength: tts.totalLength,
    })

    if (tts.isPlaying) {
      tts.pause()
    } else if (tts.isPaused) {
      tts.resume()
    } else {
      tts.play()
    }
  }

  const getSpanishVoices = () => {
    return tts.voices.filter(
      (voice) =>
        voice.lang.toLowerCase().includes("es") ||
        voice.lang.includes("Spanish") ||
        voice.name.toLowerCase().includes("spanish") ||
        voice.name.toLowerCase().includes("español"),
    )
  }

  const spanishVoices = getSpanishVoices()

  return (
    <Card className={`border-blue-200 bg-blue-50/50 ${className}`}>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Headphones className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">{title}</span>
            {tts.isActive && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {tts.isPlaying ? "Reproduciendo" : "Pausado"}
              </Badge>
            )}
            {tts.isLoading && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                Cargando...
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Debug Info */}
        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
          Texto: {text.length} caracteres | Segmentos: {tts.totalLength} | Voces: {tts.voices.length}
        </div>

        {/* Error Display */}
        {tts.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{tts.error}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>
              {tts.currentPosition} / {tts.totalLength} segmentos
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{timeEstimate.current}</span>
            <span>-{timeEstimate.remaining}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={tts.skipBackward}
            disabled={!tts.isActive && tts.currentPosition === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            onClick={handlePlayPause}
            disabled={tts.isLoading || tts.totalLength === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {tts.isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : tts.isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={tts.stop} disabled={!tts.isActive}>
            <Square className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={tts.skipForward}
            disabled={tts.currentPosition >= tts.totalLength}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Advanced Settings */}
        <Collapsible open={showSettings} onOpenChange={setShowSettings}>
          <CollapsibleContent className="space-y-4">
            <Separator />

            {/* Voice Selection */}
            {spanishVoices.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Voz ({spanishVoices.length} disponibles)</label>
                <Select
                  value={selectedVoiceIndex.toString()}
                  onValueChange={(value) => setSelectedVoiceIndex(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar voz" />
                  </SelectTrigger>
                  <SelectContent>
                    {spanishVoices.map((voice, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* All Voices (for debugging) */}
            {tts.voices.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Todas las voces ({tts.voices.length})</label>
                <Select
                  value={selectedVoiceIndex.toString()}
                  onValueChange={(value) => setSelectedVoiceIndex(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar cualquier voz" />
                  </SelectTrigger>
                  <SelectContent>
                    {tts.voices.map((voice, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Speed Control */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">Velocidad</label>
                <span className="text-sm text-gray-500">{rate}x</span>
              </div>
              <Slider
                value={[rate]}
                onValueChange={(value) => setRate(value[0])}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Pitch Control */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">Tono</label>
                <span className="text-sm text-gray-500">{pitch}</span>
              </div>
              <Slider
                value={[pitch]}
                onValueChange={(value) => setPitch(value[0])}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                  <Volume2 className="w-4 h-4" />
                  <span>Volumen</span>
                </label>
                <span className="text-sm text-gray-500">{Math.round(volume * 100)}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Time Information */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Tiempo total estimado: {timeEstimate.total}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
