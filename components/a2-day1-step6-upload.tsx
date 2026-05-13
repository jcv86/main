'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Loader2, Check } from 'lucide-react'

interface Step6UploadProps {
  onNext: () => void
  onBack: () => void
}

export function A2Day1Step6Upload({ onNext, onBack }: Step6UploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState<{ name: string; url: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileName', file.name)

      const response = await fetch('/api/a2/day1/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const { blob } = await response.json()
      setUploaded({
        name: blob.fileName,
        url: blob.url,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Sube Tu Trabajo</h2>
        <p className="text-white/60">Sube tu documento del plan del Día 1 (PDF, Word o exportación de Google Docs) para análisis y puntuación con IA.</p>
      </div>

      {!uploaded ? (
        <div className="space-y-4">
          {/* File Upload Area */}
          <label className="block border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-cyan-500 transition cursor-pointer group">
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              disabled={loading}
            />
            <Upload className="w-8 h-8 text-white/40 group-hover:text-cyan-400 mx-auto mb-2 transition" />
            <p className="text-white font-medium group-hover:text-cyan-400 transition">
              {file ? file.name : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-white/60 mt-1">PDF, Word, or text documents</p>
          </label>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Upload Success */}
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-400">Upload Successful</p>
                <p className="text-sm text-white/70 mt-1">{uploaded.name}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/60">
            Your document has been uploaded and will be analyzed in the next step.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 border-slate-600 text-white hover:bg-slate-800 py-6 rounded-full"
        >
          Atrás
        </Button>
        <Button
          onClick={() => uploaded && onNext()}
          disabled={!uploaded}
          className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-6 rounded-full"
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
