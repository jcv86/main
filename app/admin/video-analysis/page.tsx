"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Loader2, Video, Upload, Sparkles, AlertCircle, CheckCircle, Link2 } from "lucide-react"
import { ANALYSIS_TYPES, type AnalysisType } from "./config"
import { useToast } from "@/hooks/use-toast"

interface AnalysisResult {
  success: boolean
  analysisType: AnalysisType
  duration: number
  keyFindings: string[]
  questions?: string[]
  answers?: string[]
  summary: string
  confidence: number
  processedFrames: number
  timestamp: string
  error?: string
}

export default function AdminVideoAnalysisPage() {
  const [selectedType, setSelectedType] = useState<AnalysisType>("general")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [inputMethod, setInputMethod] = useState<"file" | "url">("file")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>("")
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith("video/")) {
        setVideoFile(file)
        const preview = URL.createObjectURL(file)
        setVideoPreview(preview)
        setResult(null)
      } else {
        toast({
          title: "Error",
          description: "Por favor selecciona un archivo de video válido",
          variant: "destructive",
        })
      }
    }
  }

  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value)
    setResult(null)
  }

  const handleAnalyze = async () => {
    if (inputMethod === "file" && !videoFile) {
      toast({
        title: "Error",
        description: "Por favor selecciona un video",
        variant: "destructive",
      })
      return
    }

    if (inputMethod === "url" && !videoUrl) {
      toast({
        title: "Error",
        description: "Por favor ingresa una URL de video válida",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()

      if (inputMethod === "file" && videoFile) {
        formData.append("video", videoFile)
        formData.append("inputMethod", "file")
      } else if (inputMethod === "url") {
        formData.append("videoUrl", videoUrl)
        formData.append("inputMethod", "url")
      }

      formData.append("analysisType", selectedType)

      const response = await fetch("/api/admin/video-analysis", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
        toast({
          title: "Análisis completado",
          description: "El video ha sido analizado exitosamente",
        })
      } else {
        toast({
          title: "Error en análisis",
          description: data.error || "Error al procesar el video",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error analyzing video:", error)
      toast({
        title: "Error",
        description: "Error al enviar el video para análisis",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const analysisTypeConfig = ANALYSIS_TYPES[selectedType]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Video className="h-8 w-8" />
          Análisis de Videos (Admin)
        </h1>
        <p className="text-muted-foreground mt-2">Herramienta administrativa para análisis inteligente de videos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Análisis</label>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as AnalysisType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ANALYSIS_TYPES).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">{analysisTypeConfig?.description}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Método de Entrada</label>
              <Select value={inputMethod} onValueChange={(value) => setInputMethod(value as "file" | "url")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">Cargar Archivo</SelectItem>
                  <SelectItem value="url">Desde URL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {inputMethod === "file" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Cargar Video</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm border rounded-md p-2 cursor-pointer"
                  disabled={loading}
                />
                {videoFile && (
                  <Badge variant="outline" className="mt-2">
                    {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </Badge>
                )}
              </div>
            )}

            {inputMethod === "url" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">URL del Video</label>
                <Input
                  type="url"
                  placeholder="https://ejemplo.com/video.mp4"
                  value={videoUrl}
                  onChange={handleUrlInput}
                  disabled={loading}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Solo se soportan URLs directas a archivos: MP4, MOV, AVI o WebM
                </p>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={(inputMethod === "file" && !videoFile) || (inputMethod === "url" && !videoUrl) || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  {inputMethod === "file" ? <Upload className="h-4 w-4 mr-2" /> : <Link2 className="h-4 w-4 mr-2" />}
                  Analizar Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Resultados del Análisis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-center py-8 text-muted-foreground">
                <Video className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Carga un video y presiona "Analizar Video" para ver los resultados</p>
              </div>
            ) : result.error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  {videoPreview && inputMethod === "file" && (
                    <div className="flex-shrink-0">
                      <video
                        src={videoPreview}
                        className="w-32 h-20 rounded-md object-cover bg-black"
                        controls={false}
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{result.analysisType}</Badge>
                      <Badge variant="secondary">Confianza: {(result.confidence * 100).toFixed(0)}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Duración: {result.duration}s | Frames procesados: {result.processedFrames}
                    </p>
                    <p className="text-sm text-muted-foreground">{new Date(result.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Resumen</h3>
                  <p className="text-sm text-foreground">{result.summary}</p>
                </div>

                {/* Key Findings */}
                {result.keyFindings.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Hallazgos Principales</h3>
                    <ul className="space-y-1">
                      {result.keyFindings.map((finding, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green flex-shrink-0 mt-0.5" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Questions & Answers */}
                {result.questions && result.questions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Preguntas Detectadas</h3>
                    <div className="space-y-2">
                      {result.questions.map((q, i) => (
                        <div key={i} className="bg-muted/5 p-2 rounded text-sm">
                          <p className="font-medium text-xs text-muted/60 mb-1">P{i + 1}:</p>
                          <p className="text-foreground">{q}</p>
                          {result.answers && result.answers[i] && (
                            <>
                              <p className="font-medium text-xs text-muted/60 mt-2 mb-1">R{i + 1}:</p>
                              <p className="text-foreground">{result.answers[i]}</p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
