'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Upload } from 'lucide-react'

interface A2Day2UploadProps {
  onNext: (fragments: any[]) => void
  onBack: () => void
}

export function A2Day2Upload({ onNext, onBack }: A2Day2UploadProps) {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text' | null>(null)
  const [uploadedContent, setUploadedContent] = useState('')
  const [fragmentCount, setFragmentCount] = useState(0)

  const parseFragments = (content: string) => {
    // Simple parsing: count "FRAGMENTO" mentions or line breaks
    const lines = content.split('\n').filter((line) => line.trim().length > 0)
    const approxFragments = Math.max(
      Math.ceil(lines.length / 10), // Rough estimate
      content.toLowerCase().match(/fragment/gi)?.length || 0
    )
    return Math.min(approxFragments, 20) // Cap at 20 for display
  }

  const handleTextChange = (text: string) => {
    setUploadedContent(text)
    setFragmentCount(parseFragments(text))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        handleTextChange(content)
      }
      reader.readAsText(file)
    }
  }

  const handleSubmit = () => {
    if (fragmentCount >= 7) {
      // Parse into fragments (simplified)
      const fragments = uploadedContent
        .split('\n\n')
        .filter((f) => f.trim().length > 0)
        .map((rawText, idx) => ({
          id: `frag-${idx}`,
          rawText,
          type: 'unclassified',
        }))
      onNext(fragments)
    }
  }

  const isComplete = fragmentCount >= 7

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid' }}
      >
        <h3 className="font-bold text-white mb-2">Subir Tu Evidencia</h3>
        <p className="text-sm text-white/70">
          Sube los fragmentos recolectados. Mínimo 7 fragmentos.
        </p>
      </div>

      {/* Method Selection */}
      {!uploadMethod && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => setUploadMethod('file')}
            className="p-4 rounded-lg border transition"
            style={{
              borderColor: 'rgba(90, 90, 150, 0.3)',
              backgroundColor: 'rgba(90, 90, 150, 0.05)',
            }}
          >
            <Upload className="w-6 h-6 mb-2" style={{ color: 'rgb(90, 90, 150)' }} />
            <p className="font-semibold text-white text-sm">Subir Archivo</p>
            <p className="text-xs text-white/50 mt-1">PDF, DOCX, TXT</p>
          </button>

          <button
            onClick={() => setUploadMethod('text')}
            className="p-4 rounded-lg border transition"
            style={{
              borderColor: 'rgba(90, 90, 150, 0.3)',
              backgroundColor: 'rgba(90, 90, 150, 0.05)',
            }}
          >
            <p className="text-2xl mb-2">📋</p>
            <p className="font-semibold text-white text-sm">Pegar Texto</p>
            <p className="text-xs text-white/50 mt-1">Copia y pega</p>
          </button>
        </div>
      )}

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="block p-6 rounded-lg border-2 border-dashed text-center cursor-pointer transition"
            style={{
              borderColor: 'rgba(90, 90, 150, 0.3)',
              backgroundColor: 'rgba(90, 90, 150, 0.05)',
            }}
          >
            <Upload className="w-8 h-8 mx-auto text-white/50 mb-2" />
            <p className="font-semibold text-white">Arrastra archivo o haz clic</p>
            <p className="text-xs text-white/50 mt-1">PDF, DOCX, TXT</p>
          </label>
        </div>
      )}

      {/* Text Input */}
      {uploadMethod === 'text' && (
        <Textarea
          value={uploadedContent}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Pega el contenido de tu evidencia aquí..."
          className="min-h-[300px]"
          style={{
            backgroundColor: 'rgba(15, 15, 30, 0.5)',
            borderColor: 'rgba(90, 90, 150, 0.2)',
            color: 'white',
          }}
        />
      )}

      {/* Fragment Count */}
      {uploadedContent && (
        <div
          className="rounded-lg p-4"
          style={{
            backgroundColor: fragmentCount >= 7 ? 'rgba(80, 160, 170, 0.1)' : 'rgba(90, 90, 150, 0.1)',
            borderColor: fragmentCount >= 7 ? 'rgba(80, 160, 170, 0.2)' : 'rgba(90, 90, 150, 0.2)',
            border: '1px solid',
          }}
        >
          <p className="text-sm font-semibold text-white">
            Fragmentos detectados: <span style={{ color: fragmentCount >= 7 ? 'rgb(80, 160, 170)' : 'rgb(90, 90, 150)' }}>{fragmentCount}</span>
          </p>
          <p className="text-xs text-white/50 mt-1">Necesitas: 7+ fragmentos</p>
        </div>
      )}

      {/* CTA */}
      <div className="pt-4 border-t space-y-3" style={{ borderColor: 'rgba(90, 90, 150, 0.2)' }}>
        <Button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="w-full"
          size="lg"
          style={{
            backgroundColor: isComplete ? 'rgb(90, 90, 150)' : 'rgba(90, 90, 150, 0.4)',
            color: 'white',
          }}
        >
          Clasificar Evidencia →
        </Button>

        {uploadMethod && (
          <Button
            onClick={() => {
              setUploadMethod(null)
              setUploadedContent('')
              setFragmentCount(0)
            }}
            variant="outline"
            className="w-full"
            style={{
              borderColor: 'rgba(90, 90, 150, 0.3)',
              color: 'white',
            }}
          >
            Cambiar método
          </Button>
        )}

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white/70 text-sm transition w-full justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    </div>
  )
}
