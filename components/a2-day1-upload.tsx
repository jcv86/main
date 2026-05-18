'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Upload, AlertCircle, CheckCircle } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'

interface A2Day1UploadProps {
  onNext: () => void
  onBack: () => void
  routeData: any
}

export function A2Day1Upload({
  onNext,
  onBack,
  routeData,
}: A2Day1UploadProps) {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text' | null>(null)
  const [uploadedContent, setUploadedContent] = useState('')
  const [fileName, setFileName] = useState('')
  const [validationStatus, setValidationStatus] = useState<'pending' | 'checking' | 'valid' | 'invalid'>('pending')
  const [validationMessage, setValidationMessage] = useState('')

  const requiredElements = [
    { key: 'situation', label: 'Situación actual' },
    { key: 'objective', label: 'Objetivo' },
    { key: 'gates', label: '3 puertas' },
  ]

  const validateContent = (content: string) => {
    setValidationStatus('checking')

    // Simple validation checks
    const hasContent = content.length > 100
    const hasSituation = content.toLowerCase().includes('situación') || content.length > 500
    const hasObjective = content.toLowerCase().includes('objetivo') || content.includes(routeData.change30Days)
    const hasGates = content.toLowerCase().includes('puerta') || content.includes('día 10')

    const isValid = hasContent && hasSituation && hasObjective && hasGates

    if (isValid) {
      setValidationStatus('valid')
      setValidationMessage('✓ Documento válido. Estructura completa detectada.')
    } else {
      setValidationStatus('invalid')
      const missing = []
      if (!hasSituation) missing.push('situación actual')
      if (!hasObjective) missing.push('objetivo')
      if (!hasGates) missing.push('las 3 puertas')
      setValidationMessage(
        `Tu documento todavía no tiene estructura completa. Faltan: ${missing.join(', ')}`
      )
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setUploadedContent(content)
        validateContent(content)
      }
      reader.readAsText(file)
    }
  }

  const handleTextPaste = (text: string) => {
    setUploadedContent(text)
    validateContent(text)
  }

  const handleProceed = () => {
    if (validationStatus === 'valid') {
      onNext()
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid' }}
      >
        <h3 className="font-bold text-white mb-2">Sube Tu Documento Editado</h3>
        <p className="text-sm text-white/70">
          Ya editaste, personalizaste y perfeccionaste tu ruta. Ahora súbela para que DTC la valide.
        </p>
      </div>

      {/* Upload Method Selection */}
      {!uploadMethod && (
        <div className="space-y-4">
          <p className="text-sm text-white/70">Selecciona cómo quieres subir tu documento:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setUploadMethod('file')}
              className="p-4 rounded-lg border transition hover:border-opacity-100"
              style={{
                borderColor: 'rgba(90, 90, 150, 0.3)',
                backgroundColor: 'rgba(90, 90, 150, 0.05)',
              }}
            >
              <Upload className="w-6 h-6 mb-2" style={{ color: 'rgb(90, 90, 150)' }} />
              <p className="font-semibold text-white">Subir Archivo</p>
              <p className="text-xs text-white/50 mt-1">PDF, DOCX, Markdown, TXT</p>
            </button>

            <button
              onClick={() => setUploadMethod('text')}
              className="p-4 rounded-lg border transition hover:border-opacity-100"
              style={{
                borderColor: 'rgba(90, 90, 150, 0.3)',
                backgroundColor: 'rgba(90, 90, 150, 0.05)',
              }}
            >
              <p className="text-2xl mb-2">📋</p>
              <p className="font-semibold text-white">Pegar Texto</p>
              <p className="text-xs text-white/50 mt-1">Copia y pega el contenido</p>
            </button>
          </div>
        </div>
      )}

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <div className="space-y-4">
          <div
            className="rounded-lg p-6 border-2 border-dashed text-center"
            style={{
              borderColor: 'rgba(90, 90, 150, 0.3)',
              backgroundColor: 'rgba(90, 90, 150, 0.05)',
            }}
          >
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-white/50" />
                <p className="font-semibold text-white">Arrastra archivo o haz clic</p>
                <p className="text-xs text-white/50">PDF, DOCX, Markdown, TXT</p>
              </div>
            </label>
          </div>

          {fileName && (
            <p className="text-sm text-white/70">
              Archivo seleccionado: <span className="font-semibold">{fileName}</span>
            </p>
          )}
        </div>
      )}

      {/* Text Input */}
      {uploadMethod === 'text' && (
        <div className="space-y-4">
          <Textarea
            placeholder="Pega el contenido de tu documento aquí..."
            value={uploadedContent}
            onChange={(e) => handleTextPaste(e.target.value)}
            className="min-h-[300px]"
            style={{
              backgroundColor: 'rgba(15, 15, 30, 0.5)',
              borderColor: 'rgba(90, 90, 150, 0.2)',
              color: 'white',
            }}
          />

          {uploadedContent.length > 0 && (
            <p className="text-xs text-white/40">{uploadedContent.length} caracteres</p>
          )}
        </div>
      )}

      {/* Validation Status */}
      {uploadedContent && (
        <div
          className="rounded-lg p-4 flex gap-3"
          style={{
            backgroundColor:
              validationStatus === 'valid'
                ? 'rgba(80, 160, 170, 0.1)'
                : validationStatus === 'invalid'
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'rgba(90, 90, 150, 0.1)',
            borderColor:
              validationStatus === 'valid'
                ? 'rgba(80, 160, 170, 0.2)'
                : validationStatus === 'invalid'
                  ? 'rgba(239, 68, 68, 0.2)'
                  : 'rgba(90, 90, 150, 0.2)',
            border: '1px solid',
          }}
        >
          {validationStatus === 'valid' && (
            <>
              <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(80, 160, 170)' }} />
              <p className="text-sm text-white/80">{validationMessage}</p>
            </>
          )}

          {validationStatus === 'invalid' && (
            <>
              <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'rgb(239, 68, 68)' }} />
              <p className="text-sm text-white/80">{validationMessage}</p>
            </>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="pt-4 border-t space-y-3" style={{ borderColor: 'rgba(90, 90, 150, 0.2)' }}>
        <Button
          onClick={handleProceed}
          disabled={validationStatus !== 'valid'}
          className="w-full"
          size="lg"
          style={{
            backgroundColor:
              validationStatus === 'valid'
                ? 'rgb(90, 90, 150)'
                : 'rgba(90, 90, 150, 0.4)',
            color: 'white',
          }}
        >
          Continuar a Validación →
        </Button>

        {(uploadMethod === 'file' || uploadMethod === 'text') && (
          <Button
            onClick={() => {
              setUploadMethod(null)
              setUploadedContent('')
              setFileName('')
              setValidationStatus('pending')
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
