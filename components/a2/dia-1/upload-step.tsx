'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileCheck, Loader2 } from 'lucide-react'

interface Dia1UploadStepProps {
  file: File | null
  onFileUpdate: (file: File | null) => void
  onNext: () => void
  onPrevious: () => void
}

export default function Dia1UploadStep({
  file,
  onFileUpdate,
  onNext,
  onPrevious,
}: Dia1UploadStepProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown']
      if (validTypes.includes(selected.type)) {
        onFileUpdate(selected)
      } else {
        alert('Por favor selecciona un archivo válido: PDF, DOCX, TXT o Markdown')
      }
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsAnalyzing(false)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-foreground">Paso 6: Sube tu roadmap a DTC</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Cuando termines de guardar tu roadmap, súbelo aquí para que DTC lo analice.
        </p>
        <div className="text-xs font-medium text-muted-foreground">⏱️ Tiempo estimado: 5 min</div>
      </div>

      {/* Upload Area */}
      <div className="space-y-4">
        {!file ? (
          <div className="border-2 border-dashed border-border rounded-lg p-8 bg-muted/20 text-center cursor-pointer hover:bg-muted/40 transition-colors">
            <label htmlFor="file-upload" className="cursor-pointer space-y-2">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Sube tu Roadmap Día 1</h3>
              <p className="text-sm text-muted-foreground">
                Arrastra tu archivo aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos aceptados: PDF, DOCX, TXT, Markdown
              </p>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.docx,.txt,.md"
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start gap-3">
              <FileCheck className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 dark:text-green-100">Archivo subido</h3>
                <p className="text-sm text-green-800 dark:text-green-200 mt-1">{file.name}</p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                  Tamaño: {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFileUpdate(null)}
              >
                Cambiar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-sm mb-2 text-foreground">¿Qué sucede después?</h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Subes tu roadmap</li>
          <li>DTC analiza el contenido</li>
          <li>DTC verifica: visión, hitos, acciones, coherencia</li>
          <li>Recibes una puntuación de 0-100</li>
          <li>Si pasas (≥75), se desbloquea Día 2</li>
          <li>Si necesita revisión, el coach te ayuda a mejorar</li>
        </ol>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex-1"
        >
          Anterior
        </Button>
        <Button
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing}
          className="flex-1"
        >
          {isAnalyzing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isAnalyzing ? 'Analizando...' : 'Analizar mi roadmap'}
        </Button>
      </div>
    </div>
  )
}
