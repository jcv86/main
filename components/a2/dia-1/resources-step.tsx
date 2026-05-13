'use client'

import { Button } from '@/components/ui/button'
import { Download, ExternalLink } from 'lucide-react'

interface Dia1ResourcesStepProps {
  onNext: () => void
  onPrevious: () => void
}

export default function Dia1ResourcesStep({ onNext, onPrevious }: Dia1ResourcesStepProps) {
  const handleDownloadDocx = () => {
    // Mock download
    alert('Plantilla DOCX descargada. Abre el archivo y copia tu roadmap.')
  }

  const handleDownloadPdf = () => {
    // Mock download
    alert('Plantilla PDF descargada. Puedes completarla digitalmente o imprimirla.')
  }

  const handleOpenNotion = () => {
    // Mock Notion open
    alert('Abriendo plantilla de Notion. Copia el documento a tu workspace.')
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2 text-foreground">Paso 5: Guarda tu roadmap fuera de DTC</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Copia tu visión, tus 3 hitos y tu plan inicial en la plantilla. Puedes usar Notion o descargar el documento.
        </p>
        <div className="text-xs font-medium text-muted-foreground">⏱️ Tiempo estimado: 10 min</div>
      </div>

      {/* Resource Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-foreground">Recursos Recomendados</h3>

        {/* Notion Template */}
        <div className="p-4 border border-border rounded-lg bg-muted/30 space-y-3">
          <div>
            <h4 className="font-semibold text-foreground">Plantilla de Roadmap Profesional</h4>
            <p className="text-xs text-muted-foreground mt-1">Plantilla lista para guardar tu visión, hitos y acciones en Notion.</p>
          </div>
          <Button
            onClick={handleOpenNotion}
            className="w-full"
            size="lg"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir en Notion
          </Button>
        </div>

        {/* DOCX Template */}
        <div className="p-4 border border-border rounded-lg bg-muted/30 space-y-3">
          <div>
            <h4 className="font-semibold text-foreground">Plantilla DOCX Editable</h4>
            <p className="text-xs text-muted-foreground mt-1">Descarga un documento Word para completar en tu computadora.</p>
          </div>
          <Button
            onClick={handleDownloadDocx}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar plantilla DOCX
          </Button>
        </div>

        {/* PDF Template */}
        <div className="p-4 border border-border rounded-lg bg-muted/30 space-y-3">
          <div>
            <h4 className="font-semibold text-foreground">Plantilla PDF Editable</h4>
            <p className="text-xs text-muted-foreground mt-1">Descarga un PDF que puedes completar digitalmente o imprimir.</p>
          </div>
          <Button
            onClick={handleDownloadPdf}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar plantilla PDF
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
        <h3 className="font-semibold text-sm mb-2 text-foreground">Instrucciones</h3>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
          <li>Elige tu plantilla favorita (Notion, Word o PDF)</li>
          <li>Copia tu visión, hitos y acciones en la plantilla</li>
          <li>Revisa que todo esté claro y coherente</li>
          <li>Guarda el documento</li>
          <li>Descárgalo o exporta la plantilla de Notion</li>
          <li>Tendrás el roadmap guardado fuera de DTC</li>
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
          onClick={onNext}
          className="flex-1"
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
